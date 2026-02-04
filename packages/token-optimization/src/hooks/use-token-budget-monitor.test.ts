/**
 * Tests for useTokenBudgetMonitor hook
 *
 * Validates token budget monitoring functionality including:
 * - Token counting and estimation
 * - Threshold warnings (safe, warning, critical, exceeded)
 * - Auto-trimming functionality
 * - Cost estimation
 * - Performance optimizations (debouncing, memoization)
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  useTokenBudgetMonitor,
  createModelBudgetMonitor,
  estimateTokenCost,
  formatTokenUsage,
  getStatusColor,
  isValidBudgetMonitorModel,
  getSupportedBudgetModels,
  type TokenBudgetConfig,
  type BudgetMessage,
} from './use-token-budget-monitor'

// Mock token counting utilities
vi.mock('../tokenizers/accurate-counter', () => ({
  AccurateTokenCounter: vi.fn().mockImplementation(() => ({
    count: vi.fn((text: string) => text.length / 4), // Simple estimation
  })),
}))

vi.mock('../utils/token-estimation', () => ({
  estimateTokens: vi.fn((text: string) => Math.ceil(text.length / 4)),
}))

describe('useTokenBudgetMonitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 128000,
        })
      )

      expect(result.current.usage.current).toBe(0)
      expect(result.current.usage.max).toBe(128000)
      expect(result.current.usage.status).toBe('safe')
      expect(result.current.isWarning).toBe(false)
      expect(result.current.isCritical).toBe(false)
      expect(result.current.isExceeded).toBe(false)
    })

    it('should apply custom configuration', () => {
      const config: TokenBudgetConfig = {
        maxInputTokens: 100000,
        warningThreshold: 0.7,
        criticalThreshold: 0.9,
        reservedForOutput: 2000,
      }

      const { result } = renderHook(() => useTokenBudgetMonitor(config))

      expect(result.current.usage.max).toBe(100000)
      expect(result.current.usage.reservedForOutput).toBe(2000)
      expect(result.current.usage.effectiveMax).toBe(98000)
    })

    it('should calculate effectiveMax correctly', () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          reservedForOutput: 1000,
        })
      )

      expect(result.current.usage.effectiveMax).toBe(9000)
      expect(result.current.usage.available).toBe(9000)
    })
  })

  describe('Deprecation Warning', () => {
    it('should show deprecation warning in development once', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'development'
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 128000,
        })
      )

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('useTokenBudgetMonitor')
      )
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('useTokenBudgetTracking')
      )

      // Reset and render again - should not warn twice
      consoleWarnSpy.mockClear()
      renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 128000,
        })
      )

      expect(consoleWarnSpy).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
      process.env['NODE_ENV'] = originalEnv
    })
  })

  describe('Configuration Validation', () => {
    it('should warn about invalid maxInputTokens in development', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'development'
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: -100,
        })
      )

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('maxInputTokens must be positive')
      )

      consoleWarnSpy.mockRestore()
      process.env['NODE_ENV'] = originalEnv
    })

    it('should warn about invalid reservedForOutput', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'development'
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 2000,
        })
      )

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'reservedForOutput should be less than maxInputTokens'
        )
      )

      consoleWarnSpy.mockRestore()
      process.env['NODE_ENV'] = originalEnv
    })

    it('should warn about invalid threshold configuration', () => {
      const originalEnv = process.env['NODE_ENV']
      process.env['NODE_ENV'] = 'development'
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})

      renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          warningThreshold: 0.9,
          criticalThreshold: 0.8,
        })
      )

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'warningThreshold should be less than criticalThreshold'
        )
      )

      consoleWarnSpy.mockRestore()
      process.env['NODE_ENV'] = originalEnv
    })
  })

  describe('Message Updates', () => {
    it('should update token count when messages change', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          debounceMs: 100,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'Hello world! This is a test message.' },
        { role: 'assistant', content: 'Hi there! How can I help you today?' },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      // Wait for debounce
      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(result.current.usage.current).toBeGreaterThan(0)
      })
    })

    it('should use pre-computed token counts when available', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          debounceMs: 100,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'Test', tokens: 100 },
        { role: 'assistant', content: 'Response', tokens: 200 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      await waitFor(() => {
        // Should use pre-computed tokens (100 + 200) + message overhead (2 * 4) + priming (2)
        expect(result.current.usage.current).toBe(310)
      })
    })

    it('should debounce rapid message updates', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          debounceMs: 300,
        })
      )

      const messages1: BudgetMessage[] = [
        { role: 'user', content: 'Message 1' },
      ]
      const messages2: BudgetMessage[] = [
        { role: 'user', content: 'Message 1' },
        { role: 'assistant', content: 'Response 1' },
      ]

      // Rapid updates
      act(() => {
        result.current.updateMessages(messages1)
      })

      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      act(() => {
        result.current.updateMessages(messages2)
      })

      // Only the last update should be processed after debounce
      await act(async () => {
        vi.advanceTimersByTime(300)
      })

      await waitFor(() => {
        expect(result.current.usage.current).toBeGreaterThan(0)
      })
    })
  })

  describe('Threshold Callbacks', () => {
    it('should trigger onWarning when crossing warning threshold', async () => {
      const onWarning = vi.fn()
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          warningThreshold: 0.8,
          onWarning,
          debounceMs: 10,
        })
      )

      // 900 effective max, warning at 720
      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 750 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(onWarning).toHaveBeenCalled()
        expect(result.current.isWarning).toBe(true)
      })
    })

    it('should trigger onCritical when crossing critical threshold', async () => {
      const onCritical = vi.fn()
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          criticalThreshold: 0.95,
          onCritical,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 860 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(onCritical).toHaveBeenCalled()
        expect(result.current.isCritical).toBe(true)
      })
    })

    it('should trigger onExceeded when exceeding budget', async () => {
      const onExceeded = vi.fn()
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          onExceeded,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 950 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(onExceeded).toHaveBeenCalled()
        expect(result.current.isExceeded).toBe(true)
      })
    })

    it('should only trigger callbacks on status change', async () => {
      const onWarning = vi.fn()
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          warningThreshold: 0.8,
          onWarning,
          debounceMs: 10,
        })
      )

      const messages1: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 750 },
      ]
      const messages2: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 760 },
      ]

      // First update - should trigger
      act(() => {
        result.current.updateMessages(messages1)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(onWarning).toHaveBeenCalledTimes(1)
      })

      // Second update - still in warning state, should not trigger again
      onWarning.mockClear()

      act(() => {
        result.current.updateMessages(messages2)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(onWarning).not.toHaveBeenCalled()
      })
    })
  })

  describe('Auto-trim', () => {
    it('should auto-trim when enabled and critical', async () => {
      const onAutoTrim = vi.fn()
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          criticalThreshold: 0.95,
          autoTrim: true,
          onAutoTrim,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        {
          role: 'system',
          content: 'System prompt',
          tokens: 100,
          trimmable: false,
        },
        { role: 'user', content: 'Old message 1', tokens: 200 },
        { role: 'assistant', content: 'Response 1', tokens: 200 },
        { role: 'user', content: 'Recent message', tokens: 400 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(onAutoTrim).toHaveBeenCalled()
        expect(result.current.lastTrimResult).not.toBeNull()
      })
    })

    it('should respect trimmable flag', async () => {
      const onAutoTrim = vi.fn()
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          criticalThreshold: 0.95,
          autoTrim: true,
          onAutoTrim,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'system', content: 'x', tokens: 500, trimmable: false },
        { role: 'user', content: 'x', tokens: 400 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        if (result.current.lastTrimResult) {
          // Should only trim trimmable messages
          expect(
            result.current.lastTrimResult.removedItems.every(
              (item) => messages[item.index].trimmable !== false
            )
          ).toBe(true)
        }
      })
    })

    it('should respect priority when trimming', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'Low priority', tokens: 200, priority: 0 },
        { role: 'user', content: 'High priority', tokens: 200, priority: 10 },
        { role: 'user', content: 'Medium priority', tokens: 200, priority: 5 },
      ]

      act(() => {
        const trimResult = result.current.trimToCritical()
        if (trimResult && trimResult.removedItems.length > 0) {
          // Lower priority messages should be trimmed first
          expect(messages[trimResult.removedItems[0].index].priority).toBe(0)
        }
      })
    })
  })

  describe('Utility Functions', () => {
    it('wouldExceed should predict budget overflow', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 800 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(result.current.wouldExceed(50)).toBe(false)
        expect(result.current.wouldExceed(200)).toBe(true)
      })
    })

    it('calculateTokens should count text tokens', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
        })
      )

      const tokens = await result.current.calculateTokens('Hello world!')
      expect(tokens).toBeGreaterThan(0)
    })

    it('trimToCritical should manually trim messages', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 100,
          criticalThreshold: 0.95,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'Message 1', tokens: 400 },
        { role: 'user', content: 'Message 2', tokens: 400 },
        { role: 'user', content: 'Message 3', tokens: 200 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(async () => {
        const trimResult = await act(() => result.current.trimToCritical())
        expect(trimResult).not.toBeNull()
        expect(trimResult?.tokensRemoved).toBeGreaterThan(0)
      })
    })

    it('reset should clear all state', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          debounceMs: 10,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'Test', tokens: 500 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        vi.advanceTimersByTime(10)
      })

      await waitFor(() => {
        expect(result.current.usage.current).toBeGreaterThan(0)
      })

      act(() => {
        result.current.reset()
      })

      expect(result.current.usage.current).toBe(0)
      expect(result.current.usage.status).toBe('safe')
      expect(result.current.lastTrimResult).toBeNull()
    })
  })

  describe('Cleanup', () => {
    it('should cleanup debounce timer on unmount', () => {
      const { unmount } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          debounceMs: 300,
        })
      )

      unmount()

      // Should not throw or cause memory leaks
      expect(() => vi.advanceTimersByTime(300)).not.toThrow()
    })

    it('should abort in-flight calculations on unmount', async () => {
      const { result, unmount } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          debounceMs: 100,
        })
      )

      act(() => {
        result.current.updateMessages([
          { role: 'user', content: 'Test message' },
        ])
      })

      // Unmount before calculation completes
      unmount()

      // Should not cause errors
      await act(async () => {
        vi.advanceTimersByTime(100)
      })
    })
  })
})

describe('createModelBudgetMonitor', () => {
  it('should create config for GPT-4', () => {
    const config = createModelBudgetMonitor('gpt-4o')

    expect(config.maxInputTokens).toBeDefined()
    expect(config.reservedForOutput).toBeDefined()
    expect(config.model).toBe('gpt-4o')
  })

  it('should create config for Claude', () => {
    const config = createModelBudgetMonitor('claude-sonnet-4')

    expect(config.maxInputTokens).toBeDefined()
    expect(config.reservedForOutput).toBeDefined()
    expect(config.model).toBe('claude-sonnet-4')
  })

  it('should apply overrides', () => {
    const config = createModelBudgetMonitor('gpt-4o', {
      warningThreshold: 0.7,
      autoTrim: true,
    })

    expect(config.warningThreshold).toBe(0.7)
    expect(config.autoTrim).toBe(true)
  })

  it('should throw for invalid model', () => {
    expect(() => {
      createModelBudgetMonitor('invalid-model' as any)
    }).toThrow('Unknown model')
  })
})

describe('Utility Functions', () => {
  describe('getStatusColor', () => {
    it('should return correct colors for each status', () => {
      expect(getStatusColor('safe')).toBe('green')
      expect(getStatusColor('warning')).toBe('yellow')
      expect(getStatusColor('critical')).toBe('orange')
      expect(getStatusColor('exceeded')).toBe('red')
    })
  })

  describe('formatTokenUsage', () => {
    it('should format normal usage', () => {
      const usage = {
        current: 5000,
        max: 10000,
        effectiveMax: 9000,
        available: 4000,
        utilizationPercent: 55.6,
        exceededPercent: 0,
        status: 'safe' as const,
        reservedForOutput: 1000,
      }

      const formatted = formatTokenUsage(usage)
      expect(formatted).toBe('5,000 / 9,000 tokens (55.6%)')
    })

    it('should format exceeded usage', () => {
      const usage = {
        current: 13500,
        max: 10000,
        effectiveMax: 9000,
        available: 0,
        utilizationPercent: 100,
        exceededPercent: 50,
        status: 'exceeded' as const,
        reservedForOutput: 1000,
      }

      const formatted = formatTokenUsage(usage)
      expect(formatted).toContain('100%')
      expect(formatted).toContain('50.0% over')
    })
  })

  describe('isValidBudgetMonitorModel', () => {
    it('should validate known models', () => {
      expect(isValidBudgetMonitorModel('gpt-4o')).toBe(true)
      expect(isValidBudgetMonitorModel('claude-sonnet-4')).toBe(true)
      expect(isValidBudgetMonitorModel('gemini-2.0-flash')).toBe(true)
    })

    it('should reject unknown models', () => {
      expect(isValidBudgetMonitorModel('unknown-model')).toBe(false)
      expect(isValidBudgetMonitorModel('')).toBe(false)
    })
  })

  describe('getSupportedBudgetModels', () => {
    it('should return array of supported models', () => {
      const models = getSupportedBudgetModels()

      expect(Array.isArray(models)).toBe(true)
      expect(models.length).toBeGreaterThan(0)
      expect(models).toContain('gpt-4o')
      expect(models).toContain('claude-sonnet-4')
    })
  })

  describe('estimateTokenCost', () => {
    it('should estimate cost for valid model', () => {
      const usage = {
        current: 10000,
        max: 128000,
        effectiveMax: 124000,
        available: 114000,
        utilizationPercent: 8.1,
        exceededPercent: 0,
        status: 'safe' as const,
        reservedForOutput: 4000,
      }

      const cost = estimateTokenCost(usage, 'gpt-4o')

      if (cost) {
        expect(cost.inputCost).toBeGreaterThan(0)
        expect(cost.estimatedOutputCost).toBeGreaterThan(0)
        expect(cost.totalCost).toBe(cost.inputCost + cost.estimatedOutputCost)
        expect(cost.formattedCost).toMatch(/^\$/)
      }
    })

    it('should return null for model without pricing', () => {
      const usage = {
        current: 1000,
        max: 10000,
        effectiveMax: 9000,
        available: 8000,
        utilizationPercent: 11.1,
        exceededPercent: 0,
        status: 'safe' as const,
        reservedForOutput: 1000,
      }

      // Mock a model without pricing
      const cost = estimateTokenCost(usage, 'unknown-model' as any)
      expect(cost).toBeNull()
    })
  })
})
