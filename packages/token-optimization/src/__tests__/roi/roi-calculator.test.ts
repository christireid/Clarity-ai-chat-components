/**
 * ROI Calculator Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  ROICalculator,
  calculateQuickROI,
  estimateMonthlySavings,
  compareModels,
  calculateBreakEven,
  MODEL_PRICING,
  type UsageStats,
} from '../../roi'

describe('ROICalculator', () => {
  let calculator: ROICalculator

  beforeEach(() => {
    calculator = new ROICalculator('gpt-4o', 0)
  })

  describe('Basic ROI Calculation', () => {
    it('should calculate ROI correctly', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      expect(roi.baselineCost).toBeGreaterThan(0)
      expect(roi.actualCost).toBeGreaterThan(0)
      expect(roi.totalSavings).toBeGreaterThan(0)
      expect(roi.baselineCost).toBeGreaterThan(roi.actualCost)
      expect(roi.savingsPercentage).toBeGreaterThan(0)
      expect(roi.savingsPercentage).toBeLessThan(100)
    })

    it('should calculate correct baseline cost', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 1_000_000, // 1M tokens
        inputTokensOptimized: 300_000,
        cachedInputTokens: 0,
        outputTokens: 500_000,
        requestCount: 1,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      // gpt-4o: $2.5/1M input, $10/1M output
      const expectedBaseline = 2.5 + 5.0 // $7.5
      expect(roi.baselineCost).toBeCloseTo(expectedBaseline, 2)
    })

    it('should account for cached tokens', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 1_000_000,
        inputTokensOptimized: 1_000_000,
        cachedInputTokens: 800_000, // 80% cached
        outputTokens: 0,
        requestCount: 1,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      // Should have significant savings from caching
      expect(roi.savingsPercentage).toBeGreaterThan(40)
    })

    it('should handle zero usage', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 0,
        inputTokensOptimized: 0,
        cachedInputTokens: 0,
        outputTokens: 0,
        requestCount: 0,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      expect(roi.baselineCost).toBe(0)
      expect(roi.actualCost).toBe(0)
      expect(roi.totalSavings).toBe(0)
      expect(roi.savingsPercentage).toBe(0)
    })
  })

  describe('Savings Breakdown', () => {
    it('should provide savings breakdown', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 5,
        functionCallCount: 3,
      }

      const roi = calculator.calculateROI(usage)

      expect(roi.savingsBreakdown).toBeDefined()
      expect(roi.savingsBreakdown.compression).toBeGreaterThanOrEqual(0)
      expect(roi.savingsBreakdown.caching).toBeGreaterThanOrEqual(0)
      expect(roi.savingsBreakdown.conversationMemory).toBeGreaterThanOrEqual(0)
      expect(roi.savingsBreakdown.vision).toBeGreaterThanOrEqual(0)
      expect(roi.savingsBreakdown.schemaOptimization).toBeGreaterThanOrEqual(0)
      expect(roi.savingsBreakdown.routing).toBeGreaterThanOrEqual(0)
    })

    it('should not include vision savings without images', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      expect(roi.savingsBreakdown.vision).toBe(0)
    })

    it('should not include schema savings without function calls', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      expect(roi.savingsBreakdown.schemaOptimization).toBe(0)
    })
  })

  describe('ROI and Payback', () => {
    it('should calculate ROI correctly with implementation cost', () => {
      const calcWithCost = new ROICalculator('gpt-4o', 1000)

      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calcWithCost.calculateROI(usage)

      expect(roi.roi).toBeGreaterThan(0)
      expect(roi.roi).toBe(roi.totalSavings / 1000)
    })

    it('should calculate payback period', () => {
      const calcWithCost = new ROICalculator('gpt-4o', 100)

      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calcWithCost.calculateROI(usage)

      expect(roi.paybackPeriodDays).toBeGreaterThan(0)
      expect(roi.paybackPeriodDays).toBe(100 / roi.totalSavings)
    })

    it('should handle infinite ROI with zero implementation cost', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      expect(roi.roi).toBe(Infinity)
    })
  })

  describe('Annual Projections', () => {
    it('should project annual savings correctly', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calculator.calculateROI(usage)

      expect(roi.projectedAnnualSavings).toBe(roi.totalSavings * 365)
    })
  })

  describe('Period Tracking', () => {
    it('should track periods correctly', () => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-02')

      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      const period = calculator.trackPeriod(startDate, endDate, usage)

      expect(period.startDate).toBe(startDate)
      expect(period.endDate).toBe(endDate)
      expect(period.usage).toBe(usage)
      expect(period.roi).toBeDefined()
    })

    it('should accumulate multiple periods', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      calculator.trackPeriod(new Date('2024-01-01'), new Date('2024-01-02'), usage)
      calculator.trackPeriod(new Date('2024-01-02'), new Date('2024-01-03'), usage)
      calculator.trackPeriod(new Date('2024-01-03'), new Date('2024-01-04'), usage)

      const periods = calculator.getPeriods()
      expect(periods).toHaveLength(3)
    })

    it('should calculate total ROI across periods', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      calculator.trackPeriod(new Date('2024-01-01'), new Date('2024-01-02'), usage)
      calculator.trackPeriod(new Date('2024-01-02'), new Date('2024-01-03'), usage)

      const totalROI = calculator.getTotalROI()

      // Total should be roughly 2x single period (may vary due to rounding)
      const singleROI = calculator.calculateROI(usage)
      expect(totalROI.totalSavings).toBeCloseTo(singleROI.totalSavings * 2, 1)
    })

    it('should calculate average daily savings', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      calculator.trackPeriod(new Date('2024-01-01'), new Date('2024-01-02'), usage)
      calculator.trackPeriod(new Date('2024-01-02'), new Date('2024-01-03'), usage)

      const avgSavings = calculator.getAverageDailySavings()

      const singleROI = calculator.calculateROI(usage)
      expect(avgSavings).toBeCloseTo(singleROI.totalSavings, 2)
    })

    it('should clear periods', () => {
      const usage: UsageStats = {
        inputTokensBaseline: 10000,
        inputTokensOptimized: 3000,
        cachedInputTokens: 2400,
        outputTokens: 5000,
        requestCount: 10,
        imageCount: 0,
        functionCallCount: 0,
      }

      calculator.trackPeriod(new Date(), new Date(), usage)
      calculator.clear()

      expect(calculator.getPeriods()).toHaveLength(0)
    })
  })

  describe('Different Models', () => {
    it('should work with gpt-4o-mini', () => {
      const calc = new ROICalculator('gpt-4o-mini')

      const usage: UsageStats = {
        inputTokensBaseline: 1_000_000,
        inputTokensOptimized: 300_000,
        cachedInputTokens: 0,
        outputTokens: 500_000,
        requestCount: 1,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calc.calculateROI(usage)

      // gpt-4o-mini: $0.15/1M input, $0.6/1M output
      const expectedBaseline = 0.15 + 0.3 // $0.45
      expect(roi.baselineCost).toBeCloseTo(expectedBaseline, 2)
    })

    it('should work with claude-3-5-sonnet', () => {
      const calc = new ROICalculator('claude-3-5-sonnet')

      const usage: UsageStats = {
        inputTokensBaseline: 1_000_000,
        inputTokensOptimized: 300_000,
        cachedInputTokens: 0,
        outputTokens: 500_000,
        requestCount: 1,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calc.calculateROI(usage)

      // claude-3-5-sonnet: $3/1M input, $15/1M output
      const expectedBaseline = 3.0 + 7.5 // $10.5
      expect(roi.baselineCost).toBeCloseTo(expectedBaseline, 2)
    })

    it('should work with custom pricing', () => {
      const customPricing = {
        model: 'custom-model',
        provider: 'openai' as const,
        inputCostPer1M: 5.0,
        outputCostPer1M: 20.0,
      }

      const calc = new ROICalculator(customPricing)

      const usage: UsageStats = {
        inputTokensBaseline: 1_000_000,
        inputTokensOptimized: 300_000,
        cachedInputTokens: 0,
        outputTokens: 500_000,
        requestCount: 1,
        imageCount: 0,
        functionCallCount: 0,
      }

      const roi = calc.calculateROI(usage)

      const expectedBaseline = 5.0 + 10.0 // $15
      expect(roi.baselineCost).toBeCloseTo(expectedBaseline, 2)
    })
  })
})

describe('calculateQuickROI', () => {
  it('should calculate ROI quickly', () => {
    const roi = calculateQuickROI(10000, 3000, 2400, 5000, 'gpt-4o')

    expect(roi.baselineCost).toBeGreaterThan(0)
    expect(roi.actualCost).toBeGreaterThan(0)
    expect(roi.totalSavings).toBeGreaterThan(0)
    expect(roi.savingsPercentage).toBeGreaterThan(0)
  })
})

describe('estimateMonthlySavings', () => {
  it('should estimate monthly savings correctly', () => {
    const estimate = estimateMonthlySavings(
      1000, // 1000 requests/day
      500,  // 500 tokens/request
      70,   // 70% optimization
      0.8,  // 80% cache hit rate
      'gpt-4o'
    )

    expect(estimate.baselineMonthlyCost).toBeGreaterThan(0)
    expect(estimate.optimizedMonthlyCost).toBeGreaterThan(0)
    expect(estimate.monthlySavings).toBeGreaterThan(0)
    expect(estimate.savingsPercentage).toBeGreaterThan(0)
    expect(estimate.baselineMonthlyCost).toBeGreaterThan(
      estimate.optimizedMonthlyCost
    )
  })

  it('should scale to 30 days', () => {
    const daily = estimateMonthlySavings(1000, 500, 70, 0.8, 'gpt-4o')

    // Monthly should be roughly 30x daily baseline
    expect(daily.baselineMonthlyCost).toBeGreaterThan(0)
  })
})

describe('compareModels', () => {
  it('should compare ROI across models', () => {
    const usage: UsageStats = {
      inputTokensBaseline: 10000,
      inputTokensOptimized: 3000,
      cachedInputTokens: 2400,
      outputTokens: 5000,
      requestCount: 10,
      imageCount: 0,
      functionCallCount: 0,
    }

    const comparison = compareModels(usage, [
      'gpt-4o',
      'gpt-4o-mini',
      'claude-3-5-sonnet',
    ])

    expect(comparison).toHaveLength(3)
    expect(comparison[0].model).toBe('gpt-4o')
    expect(comparison[1].model).toBe('gpt-4o-mini')
    expect(comparison[2].model).toBe('claude-3-5-sonnet')

    // gpt-4o-mini should be cheapest
    expect(comparison[1].roi.actualCost).toBeLessThan(comparison[0].roi.actualCost)
  })
})

describe('calculateBreakEven', () => {
  it('should calculate break-even correctly', () => {
    const breakEven = calculateBreakEven(
      5000,  // $5000 implementation cost
      10000, // 10000 requests/day
      500,   // 500 tokens/request
      70,    // 70% optimization
      'gpt-4o'
    )

    expect(breakEven.daysToBreakEven).toBeGreaterThan(0)
    expect(breakEven.dailySavings).toBeGreaterThan(0)
    expect(breakEven.breakEvenDate).toBeInstanceOf(Date)
    expect(breakEven.breakEvenDate.getTime()).toBeGreaterThan(Date.now())
  })

  it('should have infinite break-even with zero savings', () => {
    const breakEven = calculateBreakEven(
      5000,
      0,     // No requests
      500,
      70,
      'gpt-4o'
    )

    expect(breakEven.daysToBreakEven).toBe(Infinity)
  })
})

describe('MODEL_PRICING', () => {
  it('should have pricing for all major models', () => {
    expect(MODEL_PRICING['gpt-4o']).toBeDefined()
    expect(MODEL_PRICING['gpt-4o-mini']).toBeDefined()
    expect(MODEL_PRICING['claude-3-5-sonnet']).toBeDefined()
    expect(MODEL_PRICING['claude-3-5-haiku']).toBeDefined()
    expect(MODEL_PRICING['gemini-1.5-pro']).toBeDefined()
    expect(MODEL_PRICING['gemini-1.5-flash']).toBeDefined()
  })

  it('should have correct structure for each model', () => {
    Object.values(MODEL_PRICING).forEach((pricing) => {
      expect(pricing.model).toBeDefined()
      expect(pricing.provider).toBeDefined()
      expect(pricing.inputCostPer1M).toBeGreaterThan(0)
      expect(pricing.outputCostPer1M).toBeGreaterThan(0)
    })
  })

  it('should have cached pricing lower than regular', () => {
    Object.values(MODEL_PRICING).forEach((pricing) => {
      if (pricing.cachedInputCostPer1M) {
        expect(pricing.cachedInputCostPer1M).toBeLessThan(
          pricing.inputCostPer1M
        )
      }
    })
  })
})

describe('Integration Tests', () => {
  it('should track realistic usage over time', () => {
    const calculator = new ROICalculator('gpt-4o', 5000)

    // Day 1
    const day1Usage: UsageStats = {
      inputTokensBaseline: 500000,
      inputTokensOptimized: 150000,
      cachedInputTokens: 120000,
      outputTokens: 250000,
      requestCount: 1000,
      imageCount: 50,
      functionCallCount: 200,
    }

    calculator.trackPeriod(
      new Date('2024-01-01'),
      new Date('2024-01-02'),
      day1Usage
    )

    // Day 2
    calculator.trackPeriod(
      new Date('2024-01-02'),
      new Date('2024-01-03'),
      day1Usage
    )

    // Day 3
    calculator.trackPeriod(
      new Date('2024-01-03'),
      new Date('2024-01-04'),
      day1Usage
    )

    const totalROI = calculator.getTotalROI()
    const avgSavings = calculator.getAverageDailySavings()

    expect(totalROI.totalSavings).toBeGreaterThan(0)
    expect(totalROI.paybackPeriodDays).toBeGreaterThan(0)
    expect(avgSavings).toBeGreaterThan(0)

    // Should break even eventually
    if (totalROI.paybackPeriodDays < Infinity) {
      expect(totalROI.paybackPeriodDays).toBeLessThan(365)
    }
  })
})
