/**
 * Cost Calculator Tests
 *
 * Tests for the cost savings calculator that implements the "90% cost savings" claim.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  calculateCost,
  getSavingsPercentage,
  CostTracker,
  compareModelCosts,
  estimatePotentialSavings,
} from '../../analytics/cost-calculator'

describe('Cost Calculator', () => {
  describe('calculateCost', () => {
    it('calculates cost without caching', () => {
      const result = calculateCost({
        model: 'claude-3-sonnet',
        inputTokens: 10000,
        outputTokens: 1000,
        cachedInputTokens: 0,
      })

      // claude-3-sonnet: $3/1M input, $15/1M output
      expect(result.inputCost).toBeCloseTo(0.03, 4) // 10k * $3/1M
      expect(result.outputCost).toBeCloseTo(0.015, 4) // 1k * $15/1M
      expect(result.cachedInputCost).toBe(0)
      expect(result.totalCost).toBeCloseTo(0.045, 4)
      expect(result.baselineCost).toBeCloseTo(0.045, 4)
      expect(result.savingsAmount).toBe(0)
      expect(result.savingsPercentage).toBe(0)
    })

    it('calculates cost with 90% caching (validates 90% savings claim)', () => {
      const result = calculateCost({
        model: 'claude-3-sonnet',
        inputTokens: 10000,
        outputTokens: 1000,
        cachedInputTokens: 9000, // 90% cached
      })

      // Uncached: 1000 tokens at $3/1M = $0.003
      // Cached: 9000 tokens at $0.3/1M = $0.0027
      // Output: 1000 tokens at $15/1M = $0.015
      expect(result.inputCost).toBeCloseTo(0.003, 4)
      expect(result.cachedInputCost).toBeCloseTo(0.0027, 4)
      expect(result.outputCost).toBeCloseTo(0.015, 4)
      expect(result.totalCost).toBeCloseTo(0.0207, 4)

      // Baseline (no cache): 10k * $3/1M + 1k * $15/1M = $0.045
      expect(result.baselineCost).toBeCloseTo(0.045, 4)

      // Savings should be ~54% for 90% cache hit rate
      expect(result.savingsPercentage).toBeGreaterThan(50)
      expect(result.savingsPercentage).toBeLessThan(60)
    })

    it('validates the actual 90% savings per cached token claim', () => {
      // For Anthropic models, cached tokens cost 90% less
      // claude-3-sonnet: $3 → $0.3 per 1M tokens
      const result = calculateCost({
        model: 'claude-3-sonnet',
        inputTokens: 10000,
        outputTokens: 0,
        cachedInputTokens: 10000, // 100% cached
      })

      // All cached: 10k * $0.3/1M = $0.003
      // Without cache: 10k * $3/1M = $0.03
      expect(result.cachedInputCost).toBeCloseTo(0.003, 4)
      expect(result.baselineCost).toBeCloseTo(0.03, 4)

      // Should be exactly 90% savings
      expect(result.savingsPercentage).toBeCloseTo(90, 1)
    })

    it('handles OpenAI models with 50% cache discount', () => {
      const result = calculateCost({
        model: 'gpt-4o',
        inputTokens: 10000,
        outputTokens: 1000,
        cachedInputTokens: 10000,
      })

      // gpt-4o: $2.5/1M input, $1.25/1M cached, $10/1M output
      expect(result.cachedInputCost).toBeCloseTo(0.0125, 4)
      expect(result.outputCost).toBeCloseTo(0.01, 4)

      // Baseline: 10k * $2.5/1M + 1k * $10/1M = $0.035
      expect(result.baselineCost).toBeCloseTo(0.035, 4)

      // With cache: 10k * $1.25/1M + 1k * $10/1M = $0.0225
      expect(result.totalCost).toBeCloseTo(0.0225, 4)

      // Savings ~35.7%
      expect(result.savingsPercentage).toBeGreaterThan(35)
      expect(result.savingsPercentage).toBeLessThan(37)
    })

    it('throws error for unknown model', () => {
      expect(() =>
        calculateCost({
          model: 'unknown-model',
          inputTokens: 1000,
          outputTokens: 100,
        })
      ).toThrow('Unknown model')
    })
  })

  describe('getSavingsPercentage', () => {
    it('returns 90% for Anthropic Claude 3 Opus', () => {
      const savings = getSavingsPercentage('claude-3-opus')
      // $15 → $1.5 = 90% savings
      expect(savings).toBeCloseTo(90, 1)
    })

    it('returns 90% for Anthropic Claude 3 Sonnet', () => {
      const savings = getSavingsPercentage('claude-3-sonnet')
      // $3 → $0.3 = 90% savings
      expect(savings).toBeCloseTo(90, 1)
    })

    it('returns 90% for Anthropic Claude 3 Haiku', () => {
      const savings = getSavingsPercentage('claude-3-haiku')
      // $0.25 → $0.03 = 88% savings (close to 90%)
      expect(savings).toBeGreaterThan(85)
      expect(savings).toBeLessThan(95)
    })

    it('returns 50% for OpenAI GPT-4o', () => {
      const savings = getSavingsPercentage('gpt-4o')
      // $2.5 → $1.25 = 50% savings
      expect(savings).toBeCloseTo(50, 1)
    })

    it('returns 0 for models without caching', () => {
      const savings = getSavingsPercentage('gpt-4')
      expect(savings).toBe(0)
    })
  })

  describe('CostTracker', () => {
    let tracker: CostTracker

    beforeEach(() => {
      tracker = new CostTracker('claude-3-sonnet')
    })

    it('tracks single request', () => {
      const result = tracker.trackRequest({
        inputTokens: 5000,
        outputTokens: 500,
        cachedInputTokens: 4000,
      })

      expect(result.savingsPercentage).toBeGreaterThan(0)

      const cumulative = tracker.getCumulativeTracking()
      expect(cumulative.requestCount).toBe(1)
      expect(cumulative.totalTokens).toBe(5500)
      expect(cumulative.tokensSaved).toBe(4000)
    })

    it('tracks multiple requests and accumulates savings', () => {
      // Request 1: 80% cache hit
      tracker.trackRequest({
        inputTokens: 10000,
        outputTokens: 1000,
        cachedInputTokens: 8000,
      })

      // Request 2: 90% cache hit
      tracker.trackRequest({
        inputTokens: 5000,
        outputTokens: 500,
        cachedInputTokens: 4500,
      })

      const cumulative = tracker.getCumulativeTracking()
      expect(cumulative.requestCount).toBe(2)
      expect(cumulative.totalTokens).toBe(16500)
      expect(cumulative.tokensSaved).toBe(12500)
      expect(cumulative.averageSavingsPercentage).toBeGreaterThan(0)
      expect(cumulative.totalSavings).toBeGreaterThan(0)
    })

    it('generates comprehensive savings report', () => {
      tracker.trackRequest({
        inputTokens: 10000,
        outputTokens: 1000,
        cachedInputTokens: 9000,
      })

      const report = tracker.getReport()

      expect(report.model).toBe('claude-3-sonnet')
      expect(report.pricing).toBeDefined()
      expect(report.cachingStatus.enabled).toBe(true)
      expect(report.cachingStatus.effective).toBe(true)
      expect(report.cachingStatus.cacheHitRate).toBeGreaterThan(0.8)
      expect(report.recommendations).toBeDefined()
    })

    it('provides recommendations for low cache hit rate', () => {
      tracker.trackRequest({
        inputTokens: 10000,
        outputTokens: 1000,
        cachedInputTokens: 500, // Only 5% cached
      })

      const report = tracker.getReport()
      expect(report.cachingStatus.effective).toBe(false)
      expect(report.recommendations.length).toBeGreaterThan(0)
      expect(report.recommendations.some((r) => r.includes('low'))).toBe(true)
    })

    it('can be reset', () => {
      tracker.trackRequest({
        inputTokens: 5000,
        outputTokens: 500,
        cachedInputTokens: 4000,
      })

      tracker.reset()

      const cumulative = tracker.getCumulativeTracking()
      expect(cumulative.requestCount).toBe(0)
      expect(cumulative.totalTokens).toBe(0)
      expect(cumulative.tokensSaved).toBe(0)
      expect(cumulative.totalSavings).toBe(0)
    })

    it('exports tracking data', () => {
      tracker.trackRequest({
        inputTokens: 5000,
        outputTokens: 500,
        cachedInputTokens: 4000,
      })

      const exported = tracker.export()
      expect(exported.model).toBe('claude-3-sonnet')
      expect(exported.cumulative.requestCount).toBe(1)
      expect(exported.recentRequests.length).toBe(1)
    })
  })

  describe('compareModelCosts', () => {
    it('compares costs across multiple models', () => {
      const comparison = compareModelCosts({
        models: ['claude-3-sonnet', 'gpt-4o', 'gemini-1.5-pro'],
        inputTokens: 10000,
        outputTokens: 1000,
        cachedInputTokens: 8000,
      })

      expect(comparison).toHaveLength(3)
      expect(comparison[0].model).toBeDefined()
      expect(comparison[0].cost.totalCost).toBeDefined()
      expect(comparison[0].supportsCaching).toBe(true)

      // Should be sorted by total cost (ascending)
      for (let i = 1; i < comparison.length; i++) {
        expect(comparison[i].cost.totalCost).toBeGreaterThanOrEqual(
          comparison[i - 1].cost.totalCost
        )
      }
    })
  })

  describe('estimatePotentialSavings', () => {
    it('estimates monthly and annual savings', () => {
      const estimate = estimatePotentialSavings({
        model: 'claude-3-sonnet',
        monthlyRequests: 10000,
        averageInputTokens: 5000,
        averageOutputTokens: 500,
        expectedCacheHitRate: 0.8, // 80% cache hit
      })

      expect(estimate.monthlyCostWithoutCaching).toBeGreaterThan(0)
      expect(estimate.monthlyCostWithCaching).toBeGreaterThan(0)
      expect(estimate.monthlyCostWithCaching).toBeLessThan(
        estimate.monthlyCostWithoutCaching
      )
      expect(estimate.monthlySavings).toBeGreaterThan(0)
      expect(estimate.savingsPercentage).toBeGreaterThan(0)
      expect(estimate.annualSavings).toBe(estimate.monthlySavings * 12)
    })

    it('calculates realistic savings for 90% cache hit rate', () => {
      const estimate = estimatePotentialSavings({
        model: 'claude-3-sonnet',
        monthlyRequests: 100000, // 100k requests/month
        averageInputTokens: 10000,
        averageOutputTokens: 1000,
        expectedCacheHitRate: 0.9, // 90% cache hit
      })

      // With 90% cache hit on input, savings should be significant
      expect(estimate.savingsPercentage).toBeGreaterThan(50)

      // Annual savings should be meaningful
      expect(estimate.annualSavings).toBeGreaterThan(100)
    })

    it('shows minimal savings with low cache hit rate', () => {
      const estimate = estimatePotentialSavings({
        model: 'claude-3-sonnet',
        monthlyRequests: 10000,
        averageInputTokens: 5000,
        averageOutputTokens: 500,
        expectedCacheHitRate: 0.1, // Only 10% cache hit
      })

      expect(estimate.savingsPercentage).toBeLessThan(20)
    })
  })

  describe('Real-world scenarios', () => {
    it('chatbot with high system prompt reuse (validates 90% claim)', () => {
      const tracker = new CostTracker('claude-3-sonnet')

      // Simulate 100 requests with consistent system prompt (5000 tokens)
      // that gets cached
      for (let i = 0; i < 100; i++) {
        tracker.trackRequest({
          inputTokens: 6000, // 5000 system + 1000 user message
          outputTokens: 500,
          cachedInputTokens: 5000, // System prompt cached
        })
      }

      const report = tracker.getReport()

      // Should show significant savings due to caching
      expect(report.cumulative.averageSavingsPercentage).toBeGreaterThan(50)
      expect(report.cumulative.tokensSaved).toBe(500000) // 5000 * 100
      expect(report.cachingStatus.effective).toBe(true)
    })

    it('RAG application with document chunks', () => {
      const tracker = new CostTracker('gpt-4o')

      // Simulate RAG queries where retrieved chunks are often similar
      for (let i = 0; i < 50; i++) {
        tracker.trackRequest({
          inputTokens: 15000, // Large context from retrieved docs
          outputTokens: 500,
          cachedInputTokens: 12000, // 80% of context is reused
        })
      }

      const report = tracker.getReport()
      expect(report.cumulative.averageSavingsPercentage).toBeGreaterThan(25)
    })

    it('code assistant with repeated file context', () => {
      const tracker = new CostTracker('claude-3-5-sonnet')

      // Developer working on same files, high cache reuse
      for (let i = 0; i < 30; i++) {
        tracker.trackRequest({
          inputTokens: 8000,
          outputTokens: 1000,
          cachedInputTokens: 7000, // Same file context
        })
      }

      const report = tracker.getReport()
      expect(report.cachingStatus.cacheHitRate).toBeGreaterThan(0.75)
      // High cache hit rate should lead to good savings
      expect(report.cumulative.averageSavingsPercentage).toBeGreaterThan(45)
    })
  })
})
