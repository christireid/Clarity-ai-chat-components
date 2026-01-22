/**
 * ROI Calculator
 *
 * Calculate and track return on investment from token optimization.
 * Shows actual cost savings and ROI metrics.
 */

/**
 * Model pricing information
 */
export interface ModelPricing {
  model: string
  provider: 'openai' | 'anthropic' | 'google'
  inputCostPer1M: number
  outputCostPer1M: number
  cachedInputCostPer1M?: number // Cached input cost (if different)
}

/**
 * Optimization savings breakdown
 */
export interface OptimizationSavings {
  /** Savings from text compression */
  compression: number
  /** Savings from conversation memory optimization */
  conversationMemory: number
  /** Savings from caching */
  caching: number
  /** Savings from vision/image optimization */
  vision: number
  /** Savings from function schema optimization */
  schemaOptimization: number
  /** Savings from model routing (using cheaper models) */
  routing: number
}

/**
 * Usage statistics
 */
export interface UsageStats {
  /** Total input tokens (before optimization) */
  inputTokensBaseline: number
  /** Total output tokens */
  outputTokens: number
  /** Input tokens after optimization */
  inputTokensOptimized: number
  /** Cached input tokens */
  cachedInputTokens: number
  /** Number of requests */
  requestCount: number
  /** Number of images processed */
  imageCount: number
  /** Number of function calls */
  functionCallCount: number
}

/**
 * ROI calculation result
 */
export interface ROIResult {
  /** Baseline cost (without optimization) */
  baselineCost: number
  /** Actual cost (with optimization) */
  actualCost: number
  /** Total savings */
  totalSavings: number
  /** Savings percentage */
  savingsPercentage: number
  /** Savings breakdown by optimization type */
  savingsBreakdown: OptimizationSavings
  /** ROI (savings / implementation cost) */
  roi: number
  /** Payback period in days */
  paybackPeriodDays: number
  /** Projected annual savings */
  projectedAnnualSavings: number
}

/**
 * ROI tracking period
 */
export interface ROIPeriod {
  /** Period start date */
  startDate: Date
  /** Period end date */
  endDate: Date
  /** Usage statistics for period */
  usage: UsageStats
  /** Calculated ROI */
  roi: ROIResult
}

/**
 * Model pricing presets
 */
export const MODEL_PRICING: Record<string, ModelPricing> = {
  'gpt-4o': {
    model: 'gpt-4o',
    provider: 'openai',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
    cachedInputCostPer1M: 1.25, // 50% off for cached
  },
  'gpt-4o-mini': {
    model: 'gpt-4o-mini',
    provider: 'openai',
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    cachedInputCostPer1M: 0.075,
  },
  'claude-3-5-sonnet': {
    model: 'claude-3-5-sonnet-20241022',
    provider: 'anthropic',
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
    cachedInputCostPer1M: 0.3, // 90% off for cached
  },
  'claude-3-5-haiku': {
    model: 'claude-3-5-haiku-20241022',
    provider: 'anthropic',
    inputCostPer1M: 0.8,
    outputCostPer1M: 4.0,
    cachedInputCostPer1M: 0.08,
  },
  'gemini-1.5-pro': {
    model: 'gemini-1.5-pro',
    provider: 'google',
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.0,
    cachedInputCostPer1M: 0.3125, // 75% off for cached
  },
  'gemini-1.5-flash': {
    model: 'gemini-1.5-flash',
    provider: 'google',
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
    cachedInputCostPer1M: 0.01875,
  },
}

/**
 * ROI Calculator
 */
export class ROICalculator {
  private pricing: ModelPricing
  private implementationCost: number
  private periods: ROIPeriod[] = []

  constructor(
    modelOrPricing: string | ModelPricing,
    implementationCost: number = 0
  ) {
    if (typeof modelOrPricing === 'string') {
      this.pricing = MODEL_PRICING[modelOrPricing]
      if (!this.pricing) {
        throw new Error(`Unknown model: ${modelOrPricing}`)
      }
    } else {
      this.pricing = modelOrPricing
    }
    this.implementationCost = implementationCost
  }

  /**
   * Calculate ROI for given usage
   */
  calculateROI(usage: UsageStats): ROIResult {
    // Calculate baseline cost (no optimization)
    const baselineInputCost =
      (usage.inputTokensBaseline / 1_000_000) * this.pricing.inputCostPer1M
    const baselineOutputCost =
      (usage.outputTokens / 1_000_000) * this.pricing.outputCostPer1M
    const baselineCost = baselineInputCost + baselineOutputCost

    // Calculate actual cost (with optimization)
    const optimizedInputTokens =
      usage.inputTokensOptimized - usage.cachedInputTokens
    const cachedCostPer1M =
      this.pricing.cachedInputCostPer1M || this.pricing.inputCostPer1M * 0.1

    const optimizedInputCost =
      (optimizedInputTokens / 1_000_000) * this.pricing.inputCostPer1M
    const cachedInputCost =
      (usage.cachedInputTokens / 1_000_000) * cachedCostPer1M
    const outputCost =
      (usage.outputTokens / 1_000_000) * this.pricing.outputCostPer1M
    const actualCost = optimizedInputCost + cachedInputCost + outputCost

    // Calculate total savings
    const totalSavings = baselineCost - actualCost
    const savingsPercentage = baselineCost > 0 ? (totalSavings / baselineCost) * 100 : 0

    // Estimate savings breakdown
    const savingsBreakdown = this.estimateSavingsBreakdown(
      usage,
      totalSavings
    )

    // Calculate ROI
    const roi =
      this.implementationCost > 0
        ? totalSavings / this.implementationCost
        : Infinity

    // Calculate payback period
    const dailySavings = totalSavings // Assuming usage is for 1 day
    const paybackPeriodDays =
      dailySavings > 0 ? this.implementationCost / dailySavings : Infinity

    // Project annual savings
    const projectedAnnualSavings = totalSavings * 365

    return {
      baselineCost,
      actualCost,
      totalSavings,
      savingsPercentage,
      savingsBreakdown,
      roi,
      paybackPeriodDays,
      projectedAnnualSavings,
    }
  }

  /**
   * Estimate savings breakdown by optimization type
   */
  private estimateSavingsBreakdown(
    usage: UsageStats,
    totalSavings: number
  ): OptimizationSavings {
    // Estimate contribution of each optimization type
    // These are rough estimates based on typical usage patterns

    // Caching typically provides the largest savings (90% for cached tokens)
    const cachedTokenRatio =
      usage.cachedInputTokens / usage.inputTokensBaseline
    const cachingSavings = totalSavings * cachedTokenRatio * 0.9

    // Compression typically saves 20-40%
    const compressionRatio = usage.inputTokensOptimized / usage.inputTokensBaseline
    const compressionSavings = totalSavings * (1 - compressionRatio) * 0.3

    // Conversation memory saves 50-90% on context
    const conversationMemorySavings = totalSavings * 0.15

    // Vision optimization (if images are used)
    const visionSavings = usage.imageCount > 0 ? totalSavings * 0.1 : 0

    // Schema optimization (if function calls are used)
    const schemaSavings =
      usage.functionCallCount > 0 ? totalSavings * 0.05 : 0

    // Routing (using cheaper models when appropriate)
    const routingSavings = totalSavings * 0.05

    return {
      compression: compressionSavings,
      conversationMemory: conversationMemorySavings,
      caching: cachingSavings,
      vision: visionSavings,
      schemaOptimization: schemaSavings,
      routing: routingSavings,
    }
  }

  /**
   * Track usage for a time period
   */
  trackPeriod(startDate: Date, endDate: Date, usage: UsageStats): ROIPeriod {
    const roi = this.calculateROI(usage)

    const period: ROIPeriod = {
      startDate,
      endDate,
      usage,
      roi,
    }

    this.periods.push(period)

    return period
  }

  /**
   * Get all tracked periods
   */
  getPeriods(): ROIPeriod[] {
    return this.periods
  }

  /**
   * Get total ROI across all periods
   */
  getTotalROI(): ROIResult {
    const totalUsage: UsageStats = this.periods.reduce(
      (acc, period) => ({
        inputTokensBaseline:
          acc.inputTokensBaseline + period.usage.inputTokensBaseline,
        outputTokens: acc.outputTokens + period.usage.outputTokens,
        inputTokensOptimized:
          acc.inputTokensOptimized + period.usage.inputTokensOptimized,
        cachedInputTokens:
          acc.cachedInputTokens + period.usage.cachedInputTokens,
        requestCount: acc.requestCount + period.usage.requestCount,
        imageCount: acc.imageCount + period.usage.imageCount,
        functionCallCount:
          acc.functionCallCount + period.usage.functionCallCount,
      }),
      {
        inputTokensBaseline: 0,
        outputTokens: 0,
        inputTokensOptimized: 0,
        cachedInputTokens: 0,
        requestCount: 0,
        imageCount: 0,
        functionCallCount: 0,
      }
    )

    return this.calculateROI(totalUsage)
  }

  /**
   * Get average daily savings
   */
  getAverageDailySavings(): number {
    if (this.periods.length === 0) return 0

    const totalSavings = this.periods.reduce(
      (sum, period) => sum + period.roi.totalSavings,
      0
    )

    return totalSavings / this.periods.length
  }

  /**
   * Clear all tracked periods
   */
  clear(): void {
    this.periods = []
  }
}

/**
 * Quick ROI calculation helper
 */
export function calculateQuickROI(
  baselineTokens: number,
  optimizedTokens: number,
  cachedTokens: number,
  outputTokens: number,
  model: string = 'gpt-4o'
): ROIResult {
  const calculator = new ROICalculator(model)

  return calculator.calculateROI({
    inputTokensBaseline: baselineTokens,
    inputTokensOptimized: optimizedTokens,
    cachedInputTokens: cachedTokens,
    outputTokens,
    requestCount: 1,
    imageCount: 0,
    functionCallCount: 0,
  })
}

/**
 * Estimate monthly savings
 */
export function estimateMonthlySavings(
  dailyRequests: number,
  avgTokensPerRequest: number,
  optimizationPercentage: number = 70,
  cacheHitRate: number = 0.8,
  model: string = 'gpt-4o'
): {
  baselineMonthlyCost: number
  optimizedMonthlyCost: number
  monthlySavings: number
  savingsPercentage: number
} {
  const calculator = new ROICalculator(model)

  // Calculate for one day
  const baselineTokens = dailyRequests * avgTokensPerRequest
  const optimizedTokens = baselineTokens * (1 - optimizationPercentage / 100)
  const cachedTokens = optimizedTokens * cacheHitRate

  const dailyROI = calculator.calculateROI({
    inputTokensBaseline: baselineTokens,
    inputTokensOptimized: optimizedTokens,
    cachedInputTokens: cachedTokens,
    outputTokens: baselineTokens * 0.5, // Assume output is 50% of input
    requestCount: dailyRequests,
    imageCount: 0,
    functionCallCount: 0,
  })

  // Project to monthly
  const baselineMonthlyCost = dailyROI.baselineCost * 30
  const optimizedMonthlyCost = dailyROI.actualCost * 30
  const monthlySavings = dailyROI.totalSavings * 30

  return {
    baselineMonthlyCost,
    optimizedMonthlyCost,
    monthlySavings,
    savingsPercentage: dailyROI.savingsPercentage,
  }
}

/**
 * Compare ROI across different models
 */
export function compareModels(
  usage: UsageStats,
  models: string[]
): Array<{ model: string; roi: ROIResult }> {
  return models.map((model) => {
    const calculator = new ROICalculator(model)
    return {
      model,
      roi: calculator.calculateROI(usage),
    }
  })
}

/**
 * Calculate break-even point
 */
export function calculateBreakEven(
  implementationCost: number,
  dailyRequests: number,
  avgTokensPerRequest: number,
  optimizationPercentage: number = 70,
  model: string = 'gpt-4o'
): {
  daysToBreakEven: number
  breakEvenDate: Date
  dailySavings: number
} {
  const calculator = new ROICalculator(model, implementationCost)

  const baselineTokens = dailyRequests * avgTokensPerRequest
  const optimizedTokens = baselineTokens * (1 - optimizationPercentage / 100)

  const dailyROI = calculator.calculateROI({
    inputTokensBaseline: baselineTokens,
    inputTokensOptimized: optimizedTokens,
    cachedInputTokens: optimizedTokens * 0.8,
    outputTokens: baselineTokens * 0.5,
    requestCount: dailyRequests,
    imageCount: 0,
    functionCallCount: 0,
  })

  const dailySavings = dailyROI.totalSavings
  const daysToBreakEven =
    dailySavings > 0 ? Math.ceil(implementationCost / dailySavings) : Infinity

  const breakEvenDate = new Date()
  breakEvenDate.setDate(breakEvenDate.getDate() + daysToBreakEven)

  return {
    daysToBreakEven,
    breakEvenDate,
    dailySavings,
  }
}
