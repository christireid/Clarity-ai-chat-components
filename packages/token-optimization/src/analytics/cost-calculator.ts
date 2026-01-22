/**
 * Cost Savings Calculator
 *
 * Implements real-time cost tracking and savings calculation for token optimization.
 * This addresses the "90% cost savings" claim by providing accurate, measurable calculations
 * based on provider-native caching and actual token usage.
 *
 * @module analytics/cost-calculator
 */

import { MODEL_PRICING, type ModelPricing } from '../models/model-pricing'
import type { ModelId } from '../models/model-registry'

/**
 * Token usage statistics
 */
export interface TokenUsage {
  /** Total input tokens */
  inputTokens: number
  /** Total output tokens */
  outputTokens: number
  /** Cached input tokens (if caching enabled) */
  cachedInputTokens?: number
}

/**
 * Cost breakdown for a request
 */
export interface CostBreakdown {
  /** Cost of uncached input tokens */
  inputCost: number
  /** Cost of output tokens */
  outputCost: number
  /** Cost of cached input tokens (90% discount) */
  cachedInputCost: number
  /** Total cost for this request */
  totalCost: number
  /** Cost without caching (baseline) */
  baselineCost: number
  /** Absolute savings in dollars */
  savingsAmount: number
  /** Savings percentage (0-100) */
  savingsPercentage: number
}

/**
 * Cumulative cost tracking over time
 */
export interface CostTracking {
  /** Total cost with optimization */
  totalCostWithOptimization: number
  /** Total cost without optimization (baseline) */
  totalCostWithoutOptimization: number
  /** Total savings amount */
  totalSavings: number
  /** Average savings percentage */
  averageSavingsPercentage: number
  /** Number of requests tracked */
  requestCount: number
  /** Tokens saved through caching */
  tokensSaved: number
  /** Total tokens processed */
  totalTokens: number
}

/**
 * Detailed savings report
 */
export interface SavingsReport {
  /** Current request cost breakdown */
  currentRequest: CostBreakdown
  /** Cumulative tracking data */
  cumulative: CostTracking
  /** Model being used */
  model: string
  /** Model pricing info */
  pricing: ModelPricing
  /** Whether caching is enabled and effective */
  cachingStatus: {
    enabled: boolean
    effective: boolean
    cacheHitRate: number
    reason?: string
  }
  /** Recommendations for further optimization */
  recommendations: string[]
}

/**
 * Calculate cost for a single request with caching
 *
 * This is the core implementation of the "90% cost savings" claim.
 *
 * @example
 * ```typescript
 * const cost = calculateCost({
 *   model: 'claude-3-sonnet',
 *   inputTokens: 10000,
 *   outputTokens: 500,
 *   cachedInputTokens: 8000 // 80% cache hit rate
 * })
 *
 * console.log(`Savings: ${cost.savingsPercentage.toFixed(1)}%`)
 * // => "Savings: 72.0%"
 * ```
 */
export function calculateCost(params: {
  model: ModelId | string
  inputTokens: number
  outputTokens: number
  cachedInputTokens?: number
}): CostBreakdown {
  const { model, inputTokens, outputTokens, cachedInputTokens = 0 } = params

  const pricing = MODEL_PRICING[model]
  if (!pricing) {
    throw new Error(`Unknown model: ${model}. Cannot calculate cost.`)
  }

  // Calculate uncached input tokens
  const uncachedInputTokens = Math.max(0, inputTokens - cachedInputTokens)

  // Cost calculations
  const inputCost = (uncachedInputTokens / 1_000_000) * pricing.inputCostPer1M
  const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M

  // Cached input cost (90% discount for Anthropic, similar for others)
  let cachedInputCost = 0
  if (cachedInputTokens > 0 && pricing.cachedInputCostPer1M) {
    cachedInputCost =
      (cachedInputTokens / 1_000_000) * pricing.cachedInputCostPer1M
  }

  const totalCost = inputCost + outputCost + cachedInputCost

  // Baseline cost (no caching)
  const baselineCost =
    (inputTokens / 1_000_000) * pricing.inputCostPer1M +
    (outputTokens / 1_000_000) * pricing.outputCostPer1M

  // Savings calculation
  const savingsAmount = baselineCost - totalCost
  const savingsPercentage =
    baselineCost > 0 ? (savingsAmount / baselineCost) * 100 : 0

  return {
    inputCost,
    outputCost,
    cachedInputCost,
    totalCost,
    baselineCost,
    savingsAmount,
    savingsPercentage,
  }
}

/**
 * Calculate the actual savings percentage for cached tokens
 *
 * This verifies the "90% savings" claim with real numbers.
 *
 * @example
 * ```typescript
 * const savings = getSavingsPercentage('claude-3-sonnet')
 * console.log(savings) // => 90.0 (for cached tokens)
 * ```
 */
export function getSavingsPercentage(model: ModelId | string): number {
  const pricing = MODEL_PRICING[model]

  if (!pricing || !pricing.cachedInputCostPer1M) {
    return 0
  }

  const savingsAmount = pricing.inputCostPer1M - pricing.cachedInputCostPer1M
  return (savingsAmount / pricing.inputCostPer1M) * 100
}

/**
 * Real-time cost tracker
 *
 * Tracks cumulative costs and savings across multiple requests.
 *
 * @example
 * ```typescript
 * const tracker = new CostTracker('claude-3-sonnet')
 *
 * // Track each request
 * tracker.trackRequest({
 *   inputTokens: 5000,
 *   outputTokens: 500,
 *   cachedInputTokens: 4000
 * })
 *
 * // Get current statistics
 * const report = tracker.getReport()
 * console.log(`Total saved: $${report.cumulative.totalSavings.toFixed(4)}`)
 * console.log(`Average savings: ${report.cumulative.averageSavingsPercentage.toFixed(1)}%`)
 * ```
 */
export class CostTracker {
  private model: ModelId | string
  private totalCostWithOptimization = 0
  private totalCostWithoutOptimization = 0
  private requestCount = 0
  private totalTokens = 0
  private tokensSaved = 0
  private requestHistory: CostBreakdown[] = []

  constructor(model: ModelId | string) {
    if (!MODEL_PRICING[model]) {
      throw new Error(`Unknown model: ${model}. Cannot create cost tracker.`)
    }
    this.model = model
  }

  /**
   * Track a new request and update cumulative statistics
   */
  trackRequest(usage: TokenUsage): CostBreakdown {
    const cost = calculateCost({
      model: this.model,
      ...usage,
    })

    // Update cumulative tracking
    this.totalCostWithOptimization += cost.totalCost
    this.totalCostWithoutOptimization += cost.baselineCost
    this.requestCount++
    this.totalTokens += usage.inputTokens + usage.outputTokens
    this.tokensSaved += usage.cachedInputTokens || 0

    // Store in history (keep last 100 for performance)
    this.requestHistory.push(cost)
    if (this.requestHistory.length > 100) {
      this.requestHistory.shift()
    }

    return cost
  }

  /**
   * Get cumulative tracking data
   */
  getCumulativeTracking(): CostTracking {
    const totalSavings =
      this.totalCostWithoutOptimization - this.totalCostWithOptimization
    const averageSavingsPercentage =
      this.totalCostWithoutOptimization > 0
        ? (totalSavings / this.totalCostWithoutOptimization) * 100
        : 0

    return {
      totalCostWithOptimization: this.totalCostWithOptimization,
      totalCostWithoutOptimization: this.totalCostWithoutOptimization,
      totalSavings,
      averageSavingsPercentage,
      requestCount: this.requestCount,
      tokensSaved: this.tokensSaved,
      totalTokens: this.totalTokens,
    }
  }

  /**
   * Get a comprehensive savings report
   */
  getReport(currentUsage?: TokenUsage): SavingsReport {
    const pricing = MODEL_PRICING[this.model]!

    // Calculate current request if provided
    const currentRequest = currentUsage
      ? calculateCost({ model: this.model, ...currentUsage })
      : this.requestHistory[this.requestHistory.length - 1] || {
          inputCost: 0,
          outputCost: 0,
          cachedInputCost: 0,
          totalCost: 0,
          baselineCost: 0,
          savingsAmount: 0,
          savingsPercentage: 0,
        }

    const cumulative = this.getCumulativeTracking()

    // Calculate cache hit rate
    const cacheHitRate =
      this.totalTokens > 0 ? this.tokensSaved / this.totalTokens : 0

    // Determine caching effectiveness
    const cachingEnabled = pricing.cachedInputCostPer1M !== undefined
    const cachingEffective = cachingEnabled && cacheHitRate > 0.1 // >10% hit rate

    const recommendations: string[] = []

    // Generate recommendations
    if (!cachingEnabled) {
      recommendations.push(
        `Model ${this.model} does not support caching. Consider using a model with caching support (e.g., claude-3-sonnet, gpt-4o, gemini-1.5-pro).`
      )
    } else if (!cachingEffective) {
      recommendations.push(
        'Cache hit rate is low. Ensure you are reusing system prompts and static content across requests.'
      )
    }

    if (cacheHitRate < 0.5 && cachingEnabled) {
      recommendations.push(
        'Increase cache hit rate by structuring prompts with static content first (system messages, examples).'
      )
    }

    if (cumulative.averageSavingsPercentage < 50 && cachingEnabled) {
      recommendations.push(
        'Consider increasing the proportion of cacheable content in your prompts to maximize savings.'
      )
    }

    if (cumulative.averageSavingsPercentage > 80) {
      recommendations.push(
        'Excellent cache utilization! Your optimization is highly effective.'
      )
    }

    return {
      currentRequest,
      cumulative,
      model: this.model,
      pricing,
      cachingStatus: {
        enabled: cachingEnabled,
        effective: cachingEffective,
        cacheHitRate,
        reason: cachingEnabled
          ? cachingEffective
            ? `Cache is working effectively with ${(cacheHitRate * 100).toFixed(1)}% hit rate`
            : `Cache hit rate is low (${(cacheHitRate * 100).toFixed(1)}%)`
          : `Model ${this.model} does not support caching`,
      },
      recommendations,
    }
  }

  /**
   * Reset tracking statistics
   */
  reset(): void {
    this.totalCostWithOptimization = 0
    this.totalCostWithoutOptimization = 0
    this.requestCount = 0
    this.totalTokens = 0
    this.tokensSaved = 0
    this.requestHistory = []
  }

  /**
   * Export tracking data for analysis
   */
  export(): {
    model: string
    cumulative: CostTracking
    recentRequests: CostBreakdown[]
  } {
    return {
      model: this.model,
      cumulative: this.getCumulativeTracking(),
      recentRequests: [...this.requestHistory],
    }
  }
}

/**
 * Compare costs across multiple models
 *
 * Useful for finding the most cost-effective model for a given workload.
 */
export function compareModelCosts(params: {
  models: (ModelId | string)[]
  inputTokens: number
  outputTokens: number
  cachedInputTokens?: number
}): Array<{
  model: string
  cost: CostBreakdown
  pricing: ModelPricing
  supportsCaching: boolean
  potentialSavings: number
}> {
  const { models, inputTokens, outputTokens, cachedInputTokens = 0 } = params

  const results = models.map((model) => {
    const pricing = MODEL_PRICING[model]
    if (!pricing) {
      throw new Error(`Unknown model: ${model}`)
    }

    const cost = calculateCost({
      model,
      inputTokens,
      outputTokens,
      cachedInputTokens,
    })

    return {
      model,
      cost,
      pricing,
      supportsCaching: pricing.cachedInputCostPer1M !== undefined,
      potentialSavings: cost.savingsPercentage,
    }
  })

  // Sort by total cost (ascending)
  return results.sort((a, b) => a.cost.totalCost - b.cost.totalCost)
}

/**
 * Estimate potential savings from enabling caching
 *
 * This helps users understand the value proposition before implementation.
 */
export function estimatePotentialSavings(params: {
  model: ModelId | string
  monthlyRequests: number
  averageInputTokens: number
  averageOutputTokens: number
  expectedCacheHitRate: number // 0-1
}): {
  monthlyCostWithoutCaching: number
  monthlyCostWithCaching: number
  monthlySavings: number
  savingsPercentage: number
  annualSavings: number
  breakdownPerRequest: {
    withoutCaching: number
    withCaching: number
    savings: number
  }
} {
  const {
    model,
    monthlyRequests,
    averageInputTokens,
    averageOutputTokens,
    expectedCacheHitRate,
  } = params

  const cachedTokens = Math.floor(averageInputTokens * expectedCacheHitRate)

  // Cost per request
  const costWithoutCaching = calculateCost({
    model,
    inputTokens: averageInputTokens,
    outputTokens: averageOutputTokens,
    cachedInputTokens: 0,
  })

  const costWithCaching = calculateCost({
    model,
    inputTokens: averageInputTokens,
    outputTokens: averageOutputTokens,
    cachedInputTokens: cachedTokens,
  })

  // Monthly calculations
  const monthlyCostWithoutCaching = costWithoutCaching.totalCost * monthlyRequests
  const monthlyCostWithCaching = costWithCaching.totalCost * monthlyRequests
  const monthlySavings = monthlyCostWithoutCaching - monthlyCostWithCaching
  const savingsPercentage =
    monthlyCostWithoutCaching > 0
      ? (monthlySavings / monthlyCostWithoutCaching) * 100
      : 0

  return {
    monthlyCostWithoutCaching,
    monthlyCostWithCaching,
    monthlySavings,
    savingsPercentage,
    annualSavings: monthlySavings * 12,
    breakdownPerRequest: {
      withoutCaching: costWithoutCaching.totalCost,
      withCaching: costWithCaching.totalCost,
      savings: costWithCaching.savingsAmount,
    },
  }
}
