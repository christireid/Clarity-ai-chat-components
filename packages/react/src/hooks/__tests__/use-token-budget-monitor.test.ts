/**
 * Tests for useTokenBudgetMonitor hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useTokenBudgetMonitor,
  getStatusColor,
  formatTokenUsage,
  createModelBudgetMonitor,
  type BudgetMessage,
  type TokenUsage,
} from '../use-token-budget-monitor'

// Mock the tokenization modules
vi.mock('../../utils/tokenization', () => ({
  countTokens: vi.fn(async (text: string) => ({
    total: Math.ceil(text.length / 4),
    model: 'gpt-4',
    method: 'estimated',
  })),
  countConversationTokens: vi.fn(
    async (messages: Array<{ content: string }>) => ({
      total: messages.reduce(
        (sum, m) => sum + Math.ceil(m.content.length / 4),
        0
      ),
      model: 'gpt-4',
      method: 'estimated',
    })
  ),
}))

vi.mock('../../utils/tokenization/estimator', () => ({
  estimateTokens: vi.fn((text: string) => Math.ceil(text.length / 4)),
}))

describe('useTokenBudgetMonitor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with safe status and zero usage', () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          reservedForOutput: 1000,
        })
      )

      expect(result.current.usage.current).toBe(0)
      expect(result.current.usage.max).toBe(10000)
      expect(result.current.usage.effectiveMax).toBe(9000) // 10000 - 1000
      expect(result.current.usage.status).toBe('safe')
      expect(result.current.isWarning).toBe(false)
      expect(result.current.isCritical).toBe(false)
      expect(result.current.isExceeded).toBe(false)
    })

    it('should use default values when not provided', () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 128000,
        })
      )

      expect(result.current.usage.reservedForOutput).toBe(4096) // Default
      expect(result.current.usage.effectiveMax).toBe(128000 - 4096)
    })
  })

  describe('updateMessages', () => {
    it('should calculate token usage from messages', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          reservedForOutput: 1000,
          debounceMs: 0, // Disable debounce for testing
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'Hello world!' }, // ~3 tokens
        { role: 'assistant', content: 'Hi there!' }, // ~3 tokens
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      // Advance timers for debounce
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.usage.current).toBeGreaterThan(0)
    })

    it('should use pre-computed token counts when available', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          reservedForOutput: 1000,
          debounceMs: 0,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'user', content: 'Hello', tokens: 100 },
        { role: 'assistant', content: 'Hi', tokens: 50 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      // Should use pre-computed: 100 + 50 + (4 * 2 overhead) + 2 priming = 160
      expect(result.current.usage.current).toBe(160)
    })
  })

  describe('threshold detection', () => {
    it('should detect warning threshold', async () => {
      const onWarning = vi.fn()

      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          warningThreshold: 0.5, // 50%
          debounceMs: 0,
          onWarning,
        })
      )

      // Add messages that exceed 50% of 1000 = 500 tokens
      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 600 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.isWarning).toBe(true)
      expect(result.current.usage.status).toBe('warning')
      expect(onWarning).toHaveBeenCalledTimes(1)
    })

    it('should detect critical threshold', async () => {
      const onCritical = vi.fn()

      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          criticalThreshold: 0.9, // 90%
          debounceMs: 0,
          onCritical,
        })
      )

      // Add messages that exceed 90% of 1000 = 900 tokens
      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 950 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.isCritical).toBe(true)
      expect(result.current.usage.status).toBe('critical')
      expect(onCritical).toHaveBeenCalledTimes(1)
    })

    it('should detect exceeded state', async () => {
      const onExceeded = vi.fn()

      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          debounceMs: 0,
          onExceeded,
        })
      )

      // Add messages that exceed 100%
      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 1100 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.isExceeded).toBe(true)
      expect(result.current.usage.status).toBe('exceeded')
      expect(onExceeded).toHaveBeenCalledTimes(1)
    })

    it('should report exceededPercent when over budget', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          debounceMs: 0,
        })
      )

      // Add messages that exceed by 50% (1500 tokens when max is 1000)
      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 1494 }, // +6 overhead = 1500 total
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.usage.status).toBe('exceeded')
      expect(result.current.usage.utilizationPercent).toBe(100) // Capped at 100
      expect(result.current.usage.exceededPercent).toBe(50) // 50% over budget
    })

    it('should report exceededPercent as 0 when under budget', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          debounceMs: 0,
        })
      )

      // Add messages under budget
      const messages: BudgetMessage[] = [
        { role: 'user', content: 'x', tokens: 500 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.usage.exceededPercent).toBe(0)
    })

    it('should only fire callbacks once per threshold crossing', async () => {
      const onWarning = vi.fn()

      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          warningThreshold: 0.5,
          debounceMs: 0,
          onWarning,
        })
      )

      // First update to warning
      act(() => {
        result.current.updateMessages([
          { role: 'user', content: 'x', tokens: 600 },
        ])
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      // Second update still in warning
      act(() => {
        result.current.updateMessages([
          { role: 'user', content: 'x', tokens: 650 },
        ])
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(onWarning).toHaveBeenCalledTimes(1) // Only once
    })
  })

  describe('wouldExceed', () => {
    it('should correctly predict if adding tokens would exceed budget', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          debounceMs: 0,
        })
      )

      // Set current usage to 800
      act(() => {
        result.current.updateMessages([
          { role: 'user', content: 'x', tokens: 800 },
        ])
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.wouldExceed(100)).toBe(false) // 800 + 100 = 900 < 1000
      expect(result.current.wouldExceed(300)).toBe(true) // 800 + 300 = 1100 > 1000
    })
  })

  describe('calculateTokens', () => {
    it('should calculate tokens for text', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
        })
      )

      let tokenCount: number = 0

      await act(async () => {
        tokenCount = await result.current.calculateTokens('Hello world!')
      })

      expect(tokenCount).toBeGreaterThan(0)
    })
  })

  describe('auto-trim', () => {
    it('should auto-trim when enabled and critical', async () => {
      const onAutoTrim = vi.fn()

      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          criticalThreshold: 0.8,
          autoTrim: true,
          debounceMs: 0,
          onAutoTrim,
        })
      )

      // Add messages that exceed critical threshold
      const messages: BudgetMessage[] = [
        {
          role: 'system',
          content: 'System prompt',
          tokens: 100,
          trimmable: false,
        },
        { role: 'user', content: 'Old message 1', tokens: 200 },
        { role: 'assistant', content: 'Old response 1', tokens: 200 },
        { role: 'user', content: 'Old message 2', tokens: 200 },
        { role: 'assistant', content: 'Old response 2', tokens: 200 },
        {
          role: 'user',
          content: 'Current message',
          tokens: 100,
          trimmable: false,
        },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(onAutoTrim).toHaveBeenCalled()
      expect(result.current.lastTrimResult).not.toBeNull()
      expect(
        result.current.lastTrimResult?.removedItems.length
      ).toBeGreaterThan(0)
    })

    it('should not trim system messages', async () => {
      const onAutoTrim = vi.fn()

      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 500,
          reservedForOutput: 0,
          criticalThreshold: 0.5,
          autoTrim: true,
          debounceMs: 0,
          onAutoTrim,
        })
      )

      const messages: BudgetMessage[] = [
        { role: 'system', content: 'Important system prompt', tokens: 200 },
        { role: 'user', content: 'User message', tokens: 200 },
      ]

      act(() => {
        result.current.updateMessages(messages)
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      if (result.current.lastTrimResult) {
        // System message should not be in removed items
        const removedRoles = result.current.lastTrimResult.removedItems.map(
          (item) => {
            return messages[item.index]?.role
          }
        )
        expect(removedRoles).not.toContain('system')
      }
    })
  })

  describe('trimToCritical', () => {
    it('should manually trim to below critical', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          criticalThreshold: 0.8,
          debounceMs: 0,
        })
      )

      // Set up messages
      act(() => {
        result.current.updateMessages([
          { role: 'user', content: 'Old 1', tokens: 300 },
          { role: 'assistant', content: 'Resp 1', tokens: 300 },
          { role: 'user', content: 'Old 2', tokens: 300 },
          { role: 'assistant', content: 'Resp 2', tokens: 300 },
        ])
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      // Manually trim
      let trimResult: ReturnType<typeof result.current.trimToCritical>

      act(() => {
        trimResult = result.current.trimToCritical()
      })

      expect(trimResult).not.toBeNull()
      expect(trimResult?.reason).toBe('manual')
      expect(trimResult?.tokensRemoved).toBeGreaterThan(0)
    })
  })

  describe('reset', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 1000,
          reservedForOutput: 0,
          debounceMs: 0,
        })
      )

      // Add some usage
      act(() => {
        result.current.updateMessages([
          { role: 'user', content: 'x', tokens: 500 },
        ])
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })

      expect(result.current.usage.current).toBe(506) // 500 + 4 overhead + 2 priming

      // Reset
      act(() => {
        result.current.reset()
      })

      expect(result.current.usage.current).toBe(0)
      expect(result.current.usage.status).toBe('safe')
      expect(result.current.lastTrimResult).toBeNull()
    })
  })

  describe('debouncing', () => {
    it('should debounce rapid updates', async () => {
      const { result } = renderHook(() =>
        useTokenBudgetMonitor({
          maxInputTokens: 10000,
          debounceMs: 300,
        })
      )

      // Rapid fire updates
      act(() => {
        result.current.updateMessages([
          { role: 'user', content: 'a', tokens: 10 },
        ])
        result.current.updateMessages([
          { role: 'user', content: 'ab', tokens: 20 },
        ])
        result.current.updateMessages([
          { role: 'user', content: 'abc', tokens: 30 },
        ])
      })

      // Before debounce completes
      expect(result.current.usage.current).toBe(0)

      // After debounce
      await act(async () => {
        await vi.advanceTimersByTimeAsync(400)
      })

      // Should only reflect last update
      expect(result.current.usage.current).toBe(36) // 30 + 4 overhead + 2 priming
    })
  })
})

describe('getStatusColor', () => {
  it('should return correct colors for each status', () => {
    expect(getStatusColor('safe')).toBe('green')
    expect(getStatusColor('warning')).toBe('yellow')
    expect(getStatusColor('critical')).toBe('orange')
    expect(getStatusColor('exceeded')).toBe('red')
  })
})

describe('formatTokenUsage', () => {
  it('should format usage correctly', () => {
    const usage: TokenUsage = {
      current: 5000,
      max: 10000,
      available: 4000,
      utilizationPercent: 55.56,
      exceededPercent: 0,
      status: 'warning',
      reservedForOutput: 1000,
      effectiveMax: 9000,
    }

    const formatted = formatTokenUsage(usage)

    expect(formatted).toContain('5,000')
    expect(formatted).toContain('9,000')
    expect(formatted).toContain('55.6%')
  })
})

describe('createModelBudgetMonitor', () => {
  it('should create config for GPT-4', () => {
    const config = createModelBudgetMonitor('gpt-4')

    expect(config.maxInputTokens).toBe(8192)
    expect(config.reservedForOutput).toBe(2048)
    expect(config.model).toBe('gpt-4')
  })

  it('should create config for GPT-4 Turbo', () => {
    const config = createModelBudgetMonitor('gpt-4-turbo')

    expect(config.maxInputTokens).toBe(128000)
    expect(config.reservedForOutput).toBe(4096)
  })

  it('should create config for Claude 3.5 Sonnet', () => {
    const config = createModelBudgetMonitor('claude-3-5-sonnet')

    expect(config.maxInputTokens).toBe(200000)
    expect(config.reservedForOutput).toBe(8192)
  })

  it('should create config for Claude Sonnet 4 with 1M context', () => {
    const config = createModelBudgetMonitor('claude-sonnet-4')

    // Claude 4 models have 1M context window as of late 2024
    expect(config.maxInputTokens).toBe(1000000)
    expect(config.reservedForOutput).toBe(16384)
    expect(config.model).toBe('claude-sonnet-4')
  })

  it('should create config for Claude Opus 4 with 1M context', () => {
    const config = createModelBudgetMonitor('claude-opus-4')

    // Claude 4 models have 1M context window as of late 2024
    expect(config.maxInputTokens).toBe(1000000)
    expect(config.reservedForOutput).toBe(32768)
  })

  it('should create config for Gemini 1.5 Pro', () => {
    const config = createModelBudgetMonitor('gemini-1.5-pro')

    expect(config.maxInputTokens).toBe(1000000)
    expect(config.reservedForOutput).toBe(8192)
  })

  it('should create config for Gemini 2.0 Pro', () => {
    const config = createModelBudgetMonitor('gemini-2.0-pro')

    expect(config.maxInputTokens).toBe(2000000)
    expect(config.reservedForOutput).toBe(8192)
  })

  it('should create config for DeepSeek Chat', () => {
    const config = createModelBudgetMonitor('deepseek-chat')

    expect(config.maxInputTokens).toBe(64000)
    expect(config.reservedForOutput).toBe(8192)
  })

  it('should create config for DeepSeek R1', () => {
    const config = createModelBudgetMonitor('deepseek-r1')

    expect(config.maxInputTokens).toBe(128000)
    expect(config.reservedForOutput).toBe(32768)
  })

  it('should create config for Mistral Large', () => {
    const config = createModelBudgetMonitor('mistral-large')

    expect(config.maxInputTokens).toBe(128000)
    expect(config.reservedForOutput).toBe(8192)
  })

  it('should create config for O1 reasoning model', () => {
    const config = createModelBudgetMonitor('o1')

    expect(config.maxInputTokens).toBe(200000)
    expect(config.reservedForOutput).toBe(100000)
  })

  it('should create config for GPT-4.1', () => {
    const config = createModelBudgetMonitor('gpt-4.1')

    expect(config.maxInputTokens).toBe(1000000)
    expect(config.reservedForOutput).toBe(32768)
    expect(config.model).toBe('gpt-4.1')
  })

  it('should create config for GPT-4.1 Mini', () => {
    const config = createModelBudgetMonitor('gpt-4.1-mini')

    expect(config.maxInputTokens).toBe(1000000)
    expect(config.reservedForOutput).toBe(32768)
  })

  it('should create config for GPT-4.1 Nano', () => {
    const config = createModelBudgetMonitor('gpt-4.1-nano')

    expect(config.maxInputTokens).toBe(1000000)
    expect(config.reservedForOutput).toBe(32768)
  })

  it('should allow overrides', () => {
    const config = createModelBudgetMonitor('gpt-4', {
      warningThreshold: 0.7,
      autoTrim: true,
    })

    expect(config.maxInputTokens).toBe(8192) // From model
    expect(config.warningThreshold).toBe(0.7) // Override
    expect(config.autoTrim).toBe(true) // Override
  })
})
