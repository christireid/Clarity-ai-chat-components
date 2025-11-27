/**
 * Tests for useContextMonitor hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useContextMonitor,
  getUtilizationColor,
  formatTokenCount,
  createContextMonitorIntegration,
  type ContextMessage,
} from '../use-context-monitor'

// Mock the estimator
vi.mock('../../utils/tokenization/estimator', () => ({
  estimateTokens: vi.fn((text: string) => Math.ceil(text.length / 4)),
}))

describe('useContextMonitor', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('basic functionality', () => {
    it('should initialize with null utilization', () => {
      const { result } = renderHook(() => useContextMonitor())

      expect(result.current.utilization).toBeNull()
      expect(result.current.warnings).toEqual([])
      expect(result.current.recommendations).toEqual([])
      expect(result.current.history).toEqual([])
      expect(result.current.isWarning).toBe(false)
      expect(result.current.isCritical).toBe(false)
    })

    it('should analyze messages and update utilization', () => {
      const { result } = renderHook(() =>
        useContextMonitor({ maxTokens: 1000, reservedTokens: 100 })
      )

      const messages: ContextMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello, how are you?' },
        { role: 'assistant', content: 'I am doing well, thank you!' },
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      expect(result.current.utilization).not.toBeNull()
      expect(result.current.utilization?.totalTokens).toBeGreaterThan(0)
      expect(result.current.utilization?.maxTokens).toBe(1000)
      expect(result.current.utilization?.utilizationPercent).toBeGreaterThan(0)
    })

    it('should correctly categorize token breakdown', () => {
      const { result } = renderHook(() =>
        useContextMonitor({ maxTokens: 10000, reservedTokens: 1000 })
      )

      const messages: ContextMessage[] = [
        { role: 'system', content: 'System prompt here' },
        { role: 'user', content: 'First user message' },
        { role: 'assistant', content: 'Assistant response' },
        {
          role: 'user',
          content: 'Retrieved context',
          isRetrievedContext: true,
        },
        { role: 'user', content: 'Current user message' }, // Last user message
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      const breakdown = result.current.utilization?.breakdown
      expect(breakdown).toBeDefined()
      expect(breakdown?.systemPrompt).toBeGreaterThan(0)
      expect(breakdown?.conversationHistory).toBeGreaterThan(0)
      expect(breakdown?.retrievedContext).toBeGreaterThan(0)
      expect(breakdown?.userMessage).toBeGreaterThan(0)
      expect(breakdown?.reserved).toBe(1000)
    })
  })

  describe('warning thresholds', () => {
    it('should set isWarning when utilization exceeds warning threshold', () => {
      const { result } = renderHook(() =>
        useContextMonitor({
          maxTokens: 100,
          reservedTokens: 0,
          warningThreshold: 0.5, // 50%
        })
      )

      // Create messages that will use more than 50% of context
      const messages: ContextMessage[] = [
        { role: 'user', content: 'A'.repeat(200) }, // ~50 tokens, but estimator gives ~50
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      expect(result.current.isWarning).toBe(true)
      expect(result.current.isCritical).toBe(false)
    })

    it('should set isCritical when utilization exceeds critical threshold', () => {
      const { result } = renderHook(() =>
        useContextMonitor({
          maxTokens: 100,
          reservedTokens: 0,
          warningThreshold: 0.5,
          criticalThreshold: 0.9,
        })
      )

      // Create messages that will use more than 90% of context
      const messages: ContextMessage[] = [
        { role: 'user', content: 'A'.repeat(400) }, // ~100 tokens
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      expect(result.current.isCritical).toBe(true)
    })
  })

  describe('warnings generation', () => {
    it('should generate utilization warnings at warning threshold', () => {
      const { result } = renderHook(() =>
        useContextMonitor({
          maxTokens: 100,
          reservedTokens: 0,
          warningThreshold: 0.5,
        })
      )

      const messages: ContextMessage[] = [
        { role: 'user', content: 'A'.repeat(220) },
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      const warningTypes = result.current.warnings.map(w => w.type)
      expect(warningTypes).toContain('utilization')
    })

    it('should generate critical warnings at critical threshold', () => {
      const { result } = renderHook(() =>
        useContextMonitor({
          maxTokens: 100,
          reservedTokens: 0,
          criticalThreshold: 0.9,
        })
      )

      const messages: ContextMessage[] = [
        { role: 'user', content: 'A'.repeat(400) },
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      const criticalWarnings = result.current.warnings.filter(w => w.level === 'critical')
      expect(criticalWarnings.length).toBeGreaterThan(0)
    })
  })

  describe('recommendations generation', () => {
    it('should generate summarization recommendation for high utilization', () => {
      const { result } = renderHook(() =>
        useContextMonitor({
          maxTokens: 1000,
          reservedTokens: 0,
        })
      )

      // Create conversation history that uses >70% of context
      const messages: ContextMessage[] = [
        { role: 'system', content: 'System' },
        { role: 'user', content: 'A'.repeat(1000) },
        { role: 'assistant', content: 'B'.repeat(1000) },
        { role: 'user', content: 'C'.repeat(800) },
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      const hasRecommendation = result.current.recommendations.some(
        r => r.action === 'summarize' || r.action === 'switch-model'
      )
      expect(hasRecommendation).toBe(true)
    })
  })

  describe('history tracking', () => {
    it('should track history when enabled', () => {
      const { result } = renderHook(() =>
        useContextMonitor({
          maxTokens: 1000,
          trackHistory: true,
          maxHistoryEntries: 10,
        })
      )

      const messages: ContextMessage[] = [
        { role: 'user', content: 'Hello' },
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      expect(result.current.history.length).toBe(1)

      act(() => {
        result.current.analyzeMessages([...messages, { role: 'assistant', content: 'Hi' }])
      })

      expect(result.current.history.length).toBe(2)
    })

    it('should respect maxHistoryEntries limit', () => {
      const { result } = renderHook(() =>
        useContextMonitor({
          maxTokens: 1000,
          trackHistory: true,
          maxHistoryEntries: 3,
        })
      )

      const messages: ContextMessage[] = [{ role: 'user', content: 'Hello' }]

      // Add 5 entries
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.analyzeMessages([...messages, { role: 'user', content: `msg ${i}` }])
        })
      }

      expect(result.current.history.length).toBe(3)
    })

    it('should clear history', () => {
      const { result } = renderHook(() =>
        useContextMonitor({ trackHistory: true })
      )

      const messages: ContextMessage[] = [{ role: 'user', content: 'Hello' }]

      act(() => {
        result.current.analyzeMessages(messages)
        result.current.analyzeMessages(messages)
      })

      expect(result.current.history.length).toBe(2)

      act(() => {
        result.current.clearHistory()
      })

      expect(result.current.history.length).toBe(0)
    })
  })

  describe('getUtilization (stateless)', () => {
    it('should return utilization without updating state', () => {
      const { result } = renderHook(() =>
        useContextMonitor({ maxTokens: 1000 })
      )

      const messages: ContextMessage[] = [
        { role: 'user', content: 'Hello there!' },
      ]

      let utilization: ReturnType<typeof result.current.getUtilization>

      act(() => {
        utilization = result.current.getUtilization(messages)
      })

      // State should still be null
      expect(result.current.utilization).toBeNull()
      // But returned value should have data
      expect(utilization!.totalTokens).toBeGreaterThan(0)
    })
  })

  describe('efficiency metrics', () => {
    it('should calculate information density', () => {
      const { result } = renderHook(() => useContextMonitor())

      const messages: ContextMessage[] = [
        { role: 'user', content: 'function calculateTotal() { return sum; }' },
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      expect(result.current.utilization?.efficiency.informationDensity).toBeDefined()
      expect(result.current.utilization?.efficiency.informationDensity).toBeGreaterThan(0)
    })

    it('should calculate recency score', () => {
      const { result } = renderHook(() => useContextMonitor())

      const now = Date.now()
      const messages: ContextMessage[] = [
        { role: 'user', content: 'Old message', timestamp: now - 3600000 }, // 1 hour ago
        { role: 'user', content: 'Recent message', timestamp: now },
      ]

      act(() => {
        result.current.analyzeMessages(messages)
      })

      expect(result.current.utilization?.efficiency.recencyScore).toBeDefined()
      // Score should be between 0 and 1
      expect(result.current.utilization?.efficiency.recencyScore).toBeGreaterThanOrEqual(0)
      expect(result.current.utilization?.efficiency.recencyScore).toBeLessThanOrEqual(1)
    })
  })
})

describe('getUtilizationColor', () => {
  it('should return green for low utilization', () => {
    expect(getUtilizationColor(30)).toBe('green')
    expect(getUtilizationColor(59)).toBe('green')
  })

  it('should return yellow for medium utilization', () => {
    expect(getUtilizationColor(60)).toBe('yellow')
    expect(getUtilizationColor(79)).toBe('yellow')
  })

  it('should return red for high utilization', () => {
    expect(getUtilizationColor(80)).toBe('red')
    expect(getUtilizationColor(100)).toBe('red')
  })
})

describe('formatTokenCount', () => {
  it('should format small numbers as-is', () => {
    expect(formatTokenCount(0)).toBe('0')
    expect(formatTokenCount(100)).toBe('100')
    expect(formatTokenCount(999)).toBe('999')
  })

  it('should format thousands with K suffix', () => {
    expect(formatTokenCount(1000)).toBe('1.0K')
    expect(formatTokenCount(1500)).toBe('1.5K')
    expect(formatTokenCount(128000)).toBe('128.0K')
  })

  it('should format millions with M suffix', () => {
    expect(formatTokenCount(1000000)).toBe('1.00M')
    expect(formatTokenCount(1500000)).toBe('1.50M')
  })
})

describe('createContextMonitorIntegration', () => {
  it('should return canSendMessage that checks projected utilization', () => {
    const { result } = renderHook(() =>
      useContextMonitor({ maxTokens: 1000, reservedTokens: 0 })
    )

    const messages: ContextMessage[] = [
      { role: 'user', content: 'A'.repeat(3200) }, // ~800 tokens
    ]

    act(() => {
      result.current.analyzeMessages(messages)
    })

    const integration = createContextMonitorIntegration(result.current)

    // Should not allow message that would exceed 95%
    expect(integration.canSendMessage(200)).toBe(false)
    // Should allow small message
    expect(integration.canSendMessage(50)).toBe(true)
  })

  it('should return canSendMessage true when no utilization data', () => {
    const { result } = renderHook(() => useContextMonitor())

    const integration = createContextMonitorIntegration(result.current)

    expect(integration.canSendMessage(1000)).toBe(true)
  })

  it('should return health summary with correct status', () => {
    const { result } = renderHook(() =>
      useContextMonitor({
        maxTokens: 100,
        reservedTokens: 0,
        warningThreshold: 0.5,
        criticalThreshold: 0.9,
      })
    )

    const integration = createContextMonitorIntegration(result.current)

    // No data yet - healthy
    expect(integration.getHealthSummary().status).toBe('healthy')

    // Add messages at warning level
    act(() => {
      result.current.analyzeMessages([
        { role: 'user', content: 'A'.repeat(260) }, // ~65%
      ])
    })

    expect(integration.getHealthSummary().status).toBe('warning')

    // Add messages at critical level
    act(() => {
      result.current.analyzeMessages([
        { role: 'user', content: 'A'.repeat(380) }, // ~95%
      ])
    })

    expect(integration.getHealthSummary().status).toBe('critical')
  })
})
