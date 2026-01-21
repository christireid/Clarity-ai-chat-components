/**
 * Streaming Cost Tracker
 *
 * Real-time cost tracking for streaming LLM responses.
 * Updates cost estimates as tokens arrive.
 */

import type { StreamingTokenStats, StreamingChunk } from './streaming-token-counter'

/**
 * Model pricing configuration
 */
export interface StreamingModelPricing {
  model: string
  inputCostPer1M: number
  outputCostPer1M: number
}

/**
 * Streaming cost stats
 */
export interface StreamingCostStats {
  /** Input tokens (prompt) */
  inputTokens: number
  /** Output tokens (response so far) */
  outputTokens: number
  /** Total tokens */
  totalTokens: number
  /** Input cost */
  inputCost: number
  /** Output cost so far */
  outputCost: number
  /** Total cost so far */
  totalCost: number
  /** Estimated final output tokens */
  estimatedFinalOutputTokens?: number
  /** Estimated final cost */
  estimatedFinalCost?: number
  /** Cost per output token */
  costPerOutputToken: number
  /** Tokens per second (if timing enabled) */
  tokensPerSecond?: number
}

/**
 * Streaming cost tracker configuration
 */
export interface StreamingCostTrackerConfig {
  /** Model pricing */
  pricing: StreamingModelPricing
  /** Input tokens (prompt) */
  inputTokens: number
  /** Enable timing metrics */
  enableTiming?: boolean
  /** Callback for cost updates */
  onCostUpdate?: (stats: StreamingCostStats) => void
}

/**
 * Streaming Cost Tracker
 *
 * Tracks costs in real-time as streaming response arrives.
 */
export class StreamingCostTracker {
  private config: Required<StreamingCostTrackerConfig>
  private outputTokens: number = 0
  private startTime?: number
  private lastUpdateTime?: number

  constructor(config: StreamingCostTrackerConfig) {
    this.config = {
      pricing: config.pricing,
      inputTokens: config.inputTokens,
      enableTiming: config.enableTiming ?? false,
      onCostUpdate: config.onCostUpdate ?? (() => {}),
    }

    if (this.config.enableTiming) {
      this.startTime = Date.now()
    }
  }

  /**
   * Update with new token stats
   */
  update(tokenStats: StreamingTokenStats): StreamingCostStats {
    this.outputTokens = tokenStats.totalTokens

    if (this.config.enableTiming) {
      this.lastUpdateTime = Date.now()
    }

    const stats = this.getStats(tokenStats)
    this.config.onCostUpdate(stats)

    return stats
  }

  /**
   * Get current cost statistics
   */
  getStats(tokenStats?: StreamingTokenStats): StreamingCostStats {
    const inputCost = (this.config.inputTokens / 1_000_000) * this.config.pricing.inputCostPer1M
    const outputCost = (this.outputTokens / 1_000_000) * this.config.pricing.outputCostPer1M
    const totalCost = inputCost + outputCost

    const stats: StreamingCostStats = {
      inputTokens: this.config.inputTokens,
      outputTokens: this.outputTokens,
      totalTokens: this.config.inputTokens + this.outputTokens,
      inputCost,
      outputCost,
      totalCost,
      costPerOutputToken: this.config.pricing.outputCostPer1M / 1_000_000,
    }

    // Add estimated final cost if prediction available
    if (tokenStats?.estimatedFinalTokens) {
      stats.estimatedFinalOutputTokens = tokenStats.estimatedFinalTokens
      const estimatedOutputCost =
        (tokenStats.estimatedFinalTokens / 1_000_000) * this.config.pricing.outputCostPer1M
      stats.estimatedFinalCost = inputCost + estimatedOutputCost
    }

    // Add timing metrics
    if (this.config.enableTiming && this.startTime && this.lastUpdateTime) {
      const elapsedSeconds = (this.lastUpdateTime - this.startTime) / 1000
      stats.tokensPerSecond = elapsedSeconds > 0 ? this.outputTokens / elapsedSeconds : 0
    }

    return stats
  }

  /**
   * Reset tracker for new stream
   */
  reset(inputTokens?: number): void {
    if (inputTokens !== undefined) {
      this.config.inputTokens = inputTokens
    }
    this.outputTokens = 0
    if (this.config.enableTiming) {
      this.startTime = Date.now()
      this.lastUpdateTime = undefined
    }
  }

  /**
   * Update pricing
   */
  setPricing(pricing: StreamingModelPricing): void {
    this.config.pricing = pricing
  }
}

/**
 * Combined streaming tracker (tokens + cost)
 */
export class StreamingTracker {
  private costTracker: StreamingCostTracker
  private onUpdate?: (stats: StreamingCostStats) => void

  constructor(config: StreamingCostTrackerConfig) {
    this.onUpdate = config.onCostUpdate
    this.costTracker = new StreamingCostTracker({
      ...config,
      onCostUpdate: undefined, // We'll handle this
    })
  }

  /**
   * Process streaming chunk (from StreamingTokenCounter)
   */
  processTokenStats(tokenStats: StreamingTokenStats): StreamingCostStats {
    const costStats = this.costTracker.update(tokenStats)

    if (this.onUpdate) {
      this.onUpdate(costStats)
    }

    return costStats
  }

  /**
   * Get current stats
   */
  getStats(): StreamingCostStats {
    return this.costTracker.getStats()
  }

  /**
   * Reset for new stream
   */
  reset(inputTokens?: number): void {
    this.costTracker.reset(inputTokens)
  }
}

/**
 * Budget monitor for streaming
 */
export interface StreamingBudgetConfig {
  /** Budget limit */
  budgetLimit: number
  /** Warning threshold (0-1) */
  warningThreshold?: number
  /** Callback when budget exceeded */
  onBudgetExceeded?: (stats: StreamingCostStats) => void
  /** Callback when warning threshold reached */
  onWarning?: (stats: StreamingCostStats) => void
}

/**
 * Streaming Budget Monitor
 *
 * Monitors streaming costs against budget limits.
 */
export class StreamingBudgetMonitor {
  private config: Required<StreamingBudgetConfig>
  private warningTriggered: boolean = false
  private budgetExceeded: boolean = false

  constructor(config: StreamingBudgetConfig) {
    this.config = {
      budgetLimit: config.budgetLimit,
      warningThreshold: config.warningThreshold ?? 0.8,
      onBudgetExceeded: config.onBudgetExceeded ?? (() => {}),
      onWarning: config.onWarning ?? (() => {}),
    }
  }

  /**
   * Check budget with current cost stats
   */
  check(stats: StreamingCostStats): {
    withinBudget: boolean
    budgetRemaining: number
    budgetUtilization: number
    shouldStop: boolean
  } {
    const budgetRemaining = this.config.budgetLimit - stats.totalCost
    const budgetUtilization = stats.totalCost / this.config.budgetLimit

    // Check warning threshold
    if (!this.warningTriggered && budgetUtilization >= this.config.warningThreshold) {
      this.warningTriggered = true
      this.config.onWarning(stats)
    }

    // Check budget exceeded
    if (!this.budgetExceeded && stats.totalCost >= this.config.budgetLimit) {
      this.budgetExceeded = true
      this.config.onBudgetExceeded(stats)
    }

    return {
      withinBudget: stats.totalCost < this.config.budgetLimit,
      budgetRemaining: Math.max(0, budgetRemaining),
      budgetUtilization,
      shouldStop: this.budgetExceeded,
    }
  }

  /**
   * Reset monitor
   */
  reset(): void {
    this.warningTriggered = false
    this.budgetExceeded = false
  }
}

/**
 * Rate limiter for streaming cost tracking
 */
export class StreamingRateLimiter {
  private lastUpdate: number = 0
  private pendingUpdate?: StreamingCostStats

  constructor(private minIntervalMs: number = 100) {}

  /**
   * Throttle updates to avoid excessive callbacks
   */
  throttle(
    stats: StreamingCostStats,
    callback: (stats: StreamingCostStats) => void,
    force: boolean = false
  ): void {
    const now = Date.now()

    if (force || now - this.lastUpdate >= this.minIntervalMs) {
      callback(stats)
      this.lastUpdate = now
      this.pendingUpdate = undefined
    } else {
      // Store pending update for later
      this.pendingUpdate = stats
    }
  }

  /**
   * Flush any pending updates
   */
  flush(callback: (stats: StreamingCostStats) => void): void {
    if (this.pendingUpdate) {
      callback(this.pendingUpdate)
      this.pendingUpdate = undefined
      this.lastUpdate = Date.now()
    }
  }
}

/**
 * Helper to create streaming cost tracker with budget monitoring
 */
export function createStreamingCostTracker(config: {
  pricing: StreamingModelPricing
  inputTokens: number
  budgetLimit?: number
  enableTiming?: boolean
  onUpdate?: (stats: StreamingCostStats) => void
  onBudgetExceeded?: () => void
}): {
  tracker: StreamingTracker
  monitor?: StreamingBudgetMonitor
  rateLimiter: StreamingRateLimiter
} {
  const rateLimiter = new StreamingRateLimiter(100)

  const tracker = new StreamingTracker({
    pricing: config.pricing,
    inputTokens: config.inputTokens,
    enableTiming: config.enableTiming,
    onCostUpdate: config.onUpdate
      ? (stats) => rateLimiter.throttle(stats, config.onUpdate!)
      : undefined,
  })

  const monitor = config.budgetLimit
    ? new StreamingBudgetMonitor({
        budgetLimit: config.budgetLimit,
        onBudgetExceeded: config.onBudgetExceeded,
      })
    : undefined

  return { tracker, monitor, rateLimiter }
}
