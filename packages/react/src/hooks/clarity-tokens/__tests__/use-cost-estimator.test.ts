import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCostEstimator } from '../use-cost-estimator'

// Mock the clarity-tokens package
vi.mock('@clarity-chat/clarity-tokens', () => ({
  calculateCost: vi.fn((inputTokens: number, outputTokens: number) => ({
    inputCost: inputTokens * 0.0000025,
    outputCost: outputTokens * 0.00001,
    totalCost: inputTokens * 0.0000025 + outputTokens * 0.00001,
    currency: 'USD',
    breakdown: {
      inputTokens,
      outputTokens,
      cachedTokens: 0,
      pricePerInputToken: 0.0000025,
      pricePerOutputToken: 0.00001,
    },
  })),
  estimateCostFromText: vi.fn((text: string) => ({
    inputCost: (text.length / 4) * 0.0000025,
    outputCost: 500 * 0.00001,
    totalCost: (text.length / 4) * 0.0000025 + 500 * 0.00001,
    currency: 'USD',
    breakdown: {
      inputTokens: Math.ceil(text.length / 4),
      outputTokens: 500,
      cachedTokens: 0,
      pricePerInputToken: 0.0000025,
      pricePerOutputToken: 0.00001,
    },
  })),
  estimateCostFromMessages: vi.fn((messages: Array<{ content: string }>) => ({
    inputCost: messages.reduce((sum, m) => sum + m.content.length / 4, 0) * 0.0000025,
    outputCost: 500 * 0.00001,
    totalCost: 0.01,
    currency: 'USD',
    breakdown: {
      inputTokens: 100,
      outputTokens: 500,
      cachedTokens: 0,
      pricePerInputToken: 0.0000025,
      pricePerOutputToken: 0.00001,
    },
  })),
  formatCost: vi.fn((amount: number, currency: string) => `$${amount.toFixed(4)}`),
  CostTracker: vi.fn().mockImplementation(() => ({
    recordCost: vi.fn().mockReturnValue({
      inputCost: 0.001,
      outputCost: 0.005,
      totalCost: 0.006,
      currency: 'USD',
      breakdown: {},
    }),
    getTracking: vi.fn().mockReturnValue({
      today: 0.006,
      thisWeek: 0.006,
      thisMonth: 0.006,
      allTime: 0.006,
      byModel: { 'gpt-4o': 0.006 },
      byCategory: {},
    }),
    reset: vi.fn(),
    exportAsJson: vi.fn().mockReturnValue('{}'),
    exportAsCsv: vi.fn().mockReturnValue(''),
  })),
  getModelConfig: vi.fn(() => ({
    inputPer1M: 2.5,
    outputPer1M: 10.0,
    cachedInputPer1M: 1.25,
    contextWindow: 128000,
    encoding: 'o200k_base',
  })),
  storeCostTracking: vi.fn().mockResolvedValue(undefined),
  getCostTracking: vi.fn().mockResolvedValue(null),
  isIndexedDBAvailable: vi.fn().mockReturnValue(false),
}))

describe('useCostEstimator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default tracking values', () => {
      const { result } = renderHook(() =>
        useCostEstimator({ defaultModel: 'gpt-4o' })
      )

      expect(result.current.tracking).toEqual({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        allTime: 0,
        byModel: {},
        byCategory: {},
      })
    })

    it('should provide estimation functions', () => {
      const { result } = renderHook(() => useCostEstimator())

      expect(typeof result.current.estimate).toBe('function')
      expect(typeof result.current.recordCost).toBe('function')
      expect(typeof result.current.formatCost).toBe('function')
    })
  })

  describe('cost estimation', () => {
    it('should estimate cost from text', () => {
      const { result } = renderHook(() =>
        useCostEstimator({ defaultModel: 'gpt-4o' })
      )

      const estimate = result.current.estimate({
        inputText: 'Hello, world!',
      })

      expect(estimate).toHaveProperty('totalCost')
      expect(estimate).toHaveProperty('inputCost')
      expect(estimate).toHaveProperty('outputCost')
      expect(estimate.currency).toBe('USD')
    })

    it('should estimate cost from token counts', () => {
      const { result } = renderHook(() => useCostEstimator())

      const estimate = result.current.estimate({
        inputTokens: 1000,
        expectedOutputTokens: 500,
        model: 'gpt-4o',
      })

      expect(estimate.totalCost).toBeGreaterThan(0)
    })

    it('should estimate cost from messages', () => {
      const { result } = renderHook(() => useCostEstimator())

      const messages = [
        { id: '1', role: 'user' as const, content: 'Hello!' },
        { id: '2', role: 'assistant' as const, content: 'Hi there!' },
      ]

      const estimate = result.current.estimate({
        messages,
        model: 'gpt-4o',
      })

      expect(estimate.totalCost).toBeGreaterThan(0)
    })
  })

  describe('cost formatting', () => {
    it('should format cost for display', () => {
      const { result } = renderHook(() =>
        useCostEstimator({ currency: 'USD' })
      )

      const formatted = result.current.formatCost(0.0023)
      expect(formatted).toMatch(/\$/)
    })
  })

  describe('model pricing', () => {
    it('should get pricing for known models', () => {
      const { result } = renderHook(() => useCostEstimator())

      const pricing = result.current.getModelPricing('gpt-4o')

      expect(pricing.inputPer1M).toBe(2.5)
      expect(pricing.outputPer1M).toBe(10.0)
      expect(pricing.contextWindow).toBe(128000)
    })

    it('should allow custom pricing updates', () => {
      const { result } = renderHook(() => useCostEstimator())

      act(() => {
        result.current.updatePricing('custom-model', {
          inputPer1M: 1.0,
          outputPer1M: 2.0,
        })
      })

      const pricing = result.current.getModelPricing('custom-model')
      expect(pricing.inputPer1M).toBe(1.0)
      expect(pricing.outputPer1M).toBe(2.0)
    })
  })

  describe('tracking export', () => {
    it('should export tracking as JSON', () => {
      const { result } = renderHook(() => useCostEstimator())

      const exported = result.current.exportTracking('json')
      expect(typeof exported).toBe('string')
    })

    it('should export tracking as CSV', () => {
      const { result } = renderHook(() => useCostEstimator())

      const exported = result.current.exportTracking('csv')
      expect(typeof exported).toBe('string')
    })
  })
})
