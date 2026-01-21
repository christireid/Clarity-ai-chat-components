/**
 * Tests for useEstimateCost, useCumulativeCost, and useBudgetAlerts hooks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useEstimateCost,
  useCumulativeCost,
  useBudgetAlerts,
  MODEL_PRICING_PRESETS,
} from '../../hooks/use-estimate-cost'
import type { ConversationMessage } from '../../compression/strategies/conversation-memory'

describe('useEstimateCost', () => {
  const mockPricing = MODEL_PRICING_PRESETS['gpt-4o-mini']

  describe('Basic Functionality', () => {
    it('should initialize with provided pricing', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      expect(result.current.pricing).toEqual(mockPricing)
    })

    it('should estimate cost for text', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
          estimatedOutputTokens: 100,
        })
      )

      const text = 'This is a test message'
      const estimate = result.current.estimate(text)

      expect(estimate.inputCost).toBeGreaterThan(0)
      expect(estimate.outputCost).toBeGreaterThan(0)
      expect(estimate.totalCost).toBe(estimate.inputCost + estimate.outputCost)
      expect(estimate.inputTokens).toBeGreaterThan(0)
      expect(estimate.outputTokens).toBe(100)
    })

    it('should estimate cost for longer text', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const shortText = 'Hello'
      const longText = 'This is a much longer text that contains many more words and tokens'

      const shortEstimate = result.current.estimate(shortText)
      const longEstimate = result.current.estimate(longText)

      expect(longEstimate.inputTokens).toBeGreaterThan(shortEstimate.inputTokens)
      expect(longEstimate.totalCost).toBeGreaterThan(shortEstimate.totalCost)
    })
  })

  describe('Message Cost Estimation', () => {
    it('should estimate cost for messages', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
          estimatedOutputTokens: 200,
        })
      )

      const messages: ConversationMessage[] = [
        { role: 'system', content: 'You are helpful' },
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi! How can I help?' },
      ]

      const estimate = result.current.estimateMessages(messages)

      expect(estimate.inputTokens).toBeGreaterThan(0)
      expect(estimate.totalCost).toBeGreaterThan(0)
    })

    it('should accumulate tokens from all messages', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const singleMessage: ConversationMessage[] = [
        { role: 'user', content: 'Hello' },
      ]

      const multipleMessages: ConversationMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' },
      ]

      const singleEstimate = result.current.estimateMessages(singleMessage)
      const multiEstimate = result.current.estimateMessages(multipleMessages)

      expect(multiEstimate.inputTokens).toBeGreaterThan(singleEstimate.inputTokens)
    })
  })

  describe('Direct Token Calculation', () => {
    it('should calculate cost for specific token counts', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const inputTokens = 1000
      const outputTokens = 500

      const estimate = result.current.calculateCost(inputTokens, outputTokens)

      expect(estimate.inputTokens).toBe(1000)
      expect(estimate.outputTokens).toBe(500)
      expect(estimate.totalTokens).toBe(1500)
      expect(estimate.inputCost).toBeCloseTo((1000 / 1_000_000) * mockPricing.inputCostPer1M, 6)
      expect(estimate.outputCost).toBeCloseTo((500 / 1_000_000) * mockPricing.outputCostPer1M, 6)
    })

    it('should calculate cost per token', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const estimate = result.current.calculateCost(1000, 500)

      expect(estimate.costPerToken).toBe(estimate.totalCost / estimate.totalTokens)
      expect(estimate.costPerToken).toBeGreaterThan(0)
    })
  })

  describe('Cost Breakdown with Optimizations', () => {
    it('should calculate savings from context optimization', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
          contextOptimizationRatio: 0.5, // 50% of original tokens
        })
      )

      const baseCost = 0.01
      const breakdown = result.current.getBreakdown(baseCost)

      expect(breakdown.contextSavings).toBeGreaterThan(0)
      expect(breakdown.finalCost).toBeLessThan(baseCost)
    })

    it('should calculate savings from caching', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
          cacheHitRate: 0.6, // 60% cache hits
        })
      )

      const baseCost = 0.01
      const breakdown = result.current.getBreakdown(baseCost)

      expect(breakdown.cacheSavings).toBeGreaterThan(0)
      expect(breakdown.finalCost).toBeLessThan(baseCost)
    })

    it('should calculate savings from model routing', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
          routingSavingsRatio: 0.7, // Use 70% as expensive model
        })
      )

      const baseCost = 0.01
      const breakdown = result.current.getBreakdown(baseCost)

      expect(breakdown.routingSavings).toBeGreaterThan(0)
      expect(breakdown.finalCost).toBeLessThan(baseCost)
    })

    it('should combine all optimization savings', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
          contextOptimizationRatio: 0.5,
          cacheHitRate: 0.6,
          routingSavingsRatio: 0.7,
        })
      )

      const baseCost = 1.0
      const breakdown = result.current.getBreakdown(baseCost)

      expect(breakdown.contextSavings).toBeGreaterThan(0)
      expect(breakdown.cacheSavings).toBeGreaterThan(0)
      expect(breakdown.routingSavings).toBeGreaterThan(0)
      expect(breakdown.finalCost).toBeLessThan(baseCost)
      expect(breakdown.savingsPercentage).toBeGreaterThan(0)
    })

    it('should calculate savings percentage correctly', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
          contextOptimizationRatio: 0.5, // 50% savings
        })
      )

      const baseCost = 1.0
      const breakdown = result.current.getBreakdown(baseCost)

      expect(breakdown.savingsPercentage).toBeGreaterThan(0)
      expect(breakdown.savingsPercentage).toBeLessThanOrEqual(100)
    })
  })

  describe('Dynamic Pricing Updates', () => {
    it('should update pricing', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const newPricing = MODEL_PRICING_PRESETS['gpt-4o']

      act(() => {
        result.current.setPricing(newPricing)
      })

      expect(result.current.pricing).toEqual(newPricing)
    })

    it('should recalculate costs with new pricing', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: MODEL_PRICING_PRESETS['gpt-4o-mini'],
        })
      )

      const text = 'Test message'
      const estimateWithMini = result.current.estimate(text)

      act(() => {
        result.current.setPricing(MODEL_PRICING_PRESETS['gpt-4o'])
      })

      const estimateWithGPT4 = result.current.estimate(text)

      // GPT-4o is more expensive than GPT-4o-mini
      expect(estimateWithGPT4.totalCost).toBeGreaterThan(estimateWithMini.totalCost)
    })
  })

  describe('Model Pricing Presets', () => {
    it('should have OpenAI model presets', () => {
      expect(MODEL_PRICING_PRESETS['gpt-4o']).toBeDefined()
      expect(MODEL_PRICING_PRESETS['gpt-4o-mini']).toBeDefined()
      expect(MODEL_PRICING_PRESETS['o1']).toBeDefined()
    })

    it('should have Anthropic model presets', () => {
      expect(MODEL_PRICING_PRESETS['claude-3-5-sonnet']).toBeDefined()
      expect(MODEL_PRICING_PRESETS['claude-3-5-haiku']).toBeDefined()
      expect(MODEL_PRICING_PRESETS['claude-opus-4']).toBeDefined()
    })

    it('should have Google model presets', () => {
      expect(MODEL_PRICING_PRESETS['gemini-pro']).toBeDefined()
      expect(MODEL_PRICING_PRESETS['gemini-flash']).toBeDefined()
    })

    it('should have valid pricing values', () => {
      Object.values(MODEL_PRICING_PRESETS).forEach((preset) => {
        expect(preset.inputCostPer1M).toBeGreaterThan(0)
        expect(preset.outputCostPer1M).toBeGreaterThan(0)
        expect(preset.model).toBeTruthy()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero tokens', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const estimate = result.current.calculateCost(0, 0)

      expect(estimate.totalCost).toBe(0)
      expect(estimate.costPerToken).toBe(0)
    })

    it('should handle very large token counts', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const estimate = result.current.calculateCost(1_000_000, 500_000)

      expect(estimate.totalCost).toBeGreaterThan(0)
      expect(estimate.totalTokens).toBe(1_500_000)
    })

    it('should handle empty text', () => {
      const { result } = renderHook(() =>
        useEstimateCost({
          pricing: mockPricing,
        })
      )

      const estimate = result.current.estimate('')

      expect(estimate.inputTokens).toBeGreaterThanOrEqual(0)
      expect(estimate.totalCost).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('useCumulativeCost', () => {
  describe('Basic Functionality', () => {
    it('should initialize with zero cost', () => {
      const { result } = renderHook(() => useCumulativeCost())

      expect(result.current.totalCost).toBe(0)
      expect(result.current.callCount).toBe(0)
      expect(result.current.averageCost).toBe(0)
      expect(result.current.costHistory).toEqual([])
    })

    it('should add cost entries', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.01)
      })

      expect(result.current.totalCost).toBe(0.01)
      expect(result.current.callCount).toBe(1)
      expect(result.current.costHistory).toHaveLength(1)
    })

    it('should accumulate costs', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.01)
        result.current.addCost(0.02)
        result.current.addCost(0.03)
      })

      expect(result.current.totalCost).toBeCloseTo(0.06, 4)
      expect(result.current.callCount).toBe(3)
    })
  })

  describe('Cost History', () => {
    it('should track cost history with timestamps', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.01)
      })

      const entry = result.current.costHistory[0]

      expect(entry.cost).toBe(0.01)
      expect(entry.cumulativeCost).toBe(0.01)
      expect(entry.timestamp).toBeGreaterThan(0)
    })

    it('should track cumulative cost correctly', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.01)
        result.current.addCost(0.02)
      })

      expect(result.current.costHistory[0].cumulativeCost).toBe(0.01)
      expect(result.current.costHistory[1].cumulativeCost).toBeCloseTo(0.03, 4)
    })

    it('should include metadata in history entries', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.01, { model: 'gpt-4o', tokens: 1000 })
      })

      const entry = result.current.costHistory[0] as any

      expect(entry.model).toBe('gpt-4o')
      expect(entry.tokens).toBe(1000)
    })
  })

  describe('Statistics', () => {
    it('should calculate average cost', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.01)
        result.current.addCost(0.03)
      })

      expect(result.current.averageCost).toBeCloseTo(0.02, 4)
    })

    it('should handle average with single entry', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.05)
      })

      expect(result.current.averageCost).toBe(0.05)
    })
  })

  describe('Time Range Queries', () => {
    it('should get costs in time range', () => {
      const { result } = renderHook(() => useCumulativeCost())

      const now = Date.now()

      act(() => {
        result.current.addCost(0.01)
      })

      const costs = result.current.getCostsInRange(now - 1000, now + 1000)

      expect(costs).toHaveLength(1)
      expect(costs[0].cost).toBe(0.01)
    })

    it('should filter by time range', () => {
      const { result } = renderHook(() => useCumulativeCost())

      const now = Date.now()

      act(() => {
        result.current.addCost(0.01)
      })

      // Query for future time range (should be empty)
      const futureCosts = result.current.getCostsInRange(now + 10000, now + 20000)

      expect(futureCosts).toHaveLength(0)
    })
  })

  describe('Reset', () => {
    it('should reset all costs', () => {
      const { result } = renderHook(() => useCumulativeCost())

      act(() => {
        result.current.addCost(0.01)
        result.current.addCost(0.02)
      })

      expect(result.current.totalCost).toBeGreaterThan(0)

      act(() => {
        result.current.reset()
      })

      expect(result.current.totalCost).toBe(0)
      expect(result.current.callCount).toBe(0)
      expect(result.current.costHistory).toEqual([])
    })
  })
})

describe('useBudgetAlerts', () => {
  describe('Basic Functionality', () => {
    it('should initialize with budget configuration', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
        })
      )

      expect(result.current.totalCost).toBe(0)
      expect(result.current.budgetRemaining).toBe(10)
      expect(result.current.budgetUtilization).toBe(0)
      expect(result.current.alerts).toEqual([])
    })

    it('should track budget utilization', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
        })
      )

      act(() => {
        result.current.addCost(5)
      })

      expect(result.current.budgetUtilization).toBeCloseTo(0.5, 2)
      expect(result.current.budgetRemaining).toBe(5)
    })
  })

  describe('Warning Alerts', () => {
    it('should create warning alert at threshold', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
          warningThreshold: 0.75,
        })
      )

      act(() => {
        result.current.addCost(7.5)
      })

      expect(result.current.alerts).toHaveLength(1)
      expect(result.current.alerts[0].severity).toBe('warning')
      expect(result.current.alerts[0].message).toContain('warning')
    })

    it('should not create warning below threshold', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
          warningThreshold: 0.75,
        })
      )

      act(() => {
        result.current.addCost(5)
      })

      expect(result.current.alerts).toHaveLength(0)
    })
  })

  describe('Critical Alerts', () => {
    it('should create critical alert at threshold', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
          criticalThreshold: 0.9,
        })
      )

      act(() => {
        result.current.addCost(9)
      })

      expect(result.current.alerts).toHaveLength(1)
      expect(result.current.alerts[0].severity).toBe('critical')
      expect(result.current.alerts[0].message).toContain('critical')
    })

    it('should prioritize critical over warning', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
          warningThreshold: 0.75,
          criticalThreshold: 0.9,
        })
      )

      act(() => {
        result.current.addCost(9.5)
      })

      const criticalAlerts = result.current.alerts.filter((a) => a.severity === 'critical')
      expect(criticalAlerts.length).toBeGreaterThan(0)
    })
  })

  describe('Alert Management', () => {
    it('should dismiss alerts', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
          warningThreshold: 0.75,
        })
      )

      act(() => {
        result.current.addCost(8)
      })

      expect(result.current.alerts).toHaveLength(1)

      const alertId = result.current.alerts[0].id

      act(() => {
        result.current.dismiss(alertId)
      })

      expect(result.current.alerts).toHaveLength(0)
    })

    it('should track alert details', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
          warningThreshold: 0.75,
        })
      )

      act(() => {
        result.current.addCost(8)
      })

      const alert = result.current.alerts[0]

      expect(alert.id).toBeTruthy()
      expect(alert.severity).toBe('warning')
      expect(alert.currentCost).toBe(8)
      expect(alert.budget).toBe(10)
      expect(alert.threshold).toBe(0.75)
      expect(alert.timestamp).toBeGreaterThan(0)
    })
  })

  describe('Budget Tracking', () => {
    it('should calculate budget remaining', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
        })
      )

      act(() => {
        result.current.addCost(3)
      })

      expect(result.current.budgetRemaining).toBe(7)
    })

    it('should not go below zero budget remaining', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
        })
      )

      act(() => {
        result.current.addCost(15)
      })

      expect(result.current.budgetRemaining).toBe(0)
    })

    it('should calculate utilization over 100%', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
        })
      )

      act(() => {
        result.current.addCost(12)
      })

      expect(result.current.budgetUtilization).toBeGreaterThan(1)
    })
  })

  describe('Integration with Cumulative Cost', () => {
    it('should inherit cumulative cost functionality', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
        })
      )

      act(() => {
        result.current.addCost(1)
        result.current.addCost(2)
      })

      expect(result.current.callCount).toBe(2)
      expect(result.current.costHistory).toHaveLength(2)
      expect(result.current.averageCost).toBeCloseTo(1.5, 2)
    })

    it('should support reset functionality', () => {
      const { result } = renderHook(() =>
        useBudgetAlerts({
          dailyBudget: 10,
          warningThreshold: 0.75,
        })
      )

      act(() => {
        result.current.addCost(8)
      })

      expect(result.current.alerts).toHaveLength(1)

      act(() => {
        result.current.reset()
      })

      expect(result.current.totalCost).toBe(0)
      expect(result.current.budgetUtilization).toBe(0)
      // Note: alerts persist across reset (by design)
    })
  })
})
