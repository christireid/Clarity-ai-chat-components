/**
 * Health Monitoring for Model Adapters
 *
 * Tracks provider health metrics:
 * - Success/failure rates
 * - Latency distributions (p50, p95, p99)
 * - Error rates by type
 * - Token usage and costs
 * - Request throughput
 * - Provider availability
 */

import type { AdapterError } from './errors'
import type { TokenUsage } from './types'

/**
 * Latency percentiles
 */
export interface LatencyPercentiles {
  /** 50th percentile (median) */
  p50: number
  /** 95th percentile */
  p95: number
  /** 99th percentile */
  p99: number
  /** Minimum latency */
  min: number
  /** Maximum latency */
  max: number
  /** Average latency */
  avg: number
}

/**
 * Error statistics by type
 */
export interface ErrorStats {
  /** Total error count */
  total: number
  /** Errors by error code */
  byCode: Record<string, number>
  /** Retryable error count */
  retryable: number
  /** Non-retryable error count */
  nonRetryable: number
}

/**
 * Health metrics for a provider
 */
export interface ProviderHealthMetrics {
  /** Provider name */
  provider: string
  /** Total requests */
  totalRequests: number
  /** Successful requests */
  successCount: number
  /** Failed requests */
  failureCount: number
  /** Success rate (0-1) */
  successRate: number
  /** Latency metrics in milliseconds */
  latency: LatencyPercentiles
  /** Error statistics */
  errors: ErrorStats
  /** Token usage */
  tokens: {
    total: number
    input: number
    output: number
  }
  /** Total cost in USD */
  totalCost: number
  /** Requests per second (last minute) */
  requestsPerSecond: number
  /** Average tokens per request */
  avgTokensPerRequest: number
  /** Average cost per request */
  avgCostPerRequest: number
  /** Time window start */
  windowStart: string
  /** Time window end */
  windowEnd: string
  /** Is provider healthy */
  isHealthy: boolean
  /** Health score (0-100) */
  healthScore: number
}

/**
 * Request record for tracking
 */
interface RequestRecord {
  timestamp: number
  success: boolean
  latencyMs: number
  error?: AdapterError
  tokens?: TokenUsage
  cost?: number
}

/**
 * Health threshold configuration
 */
export interface HealthThresholds {
  /** Minimum success rate to be healthy (default: 0.95 = 95%) */
  minSuccessRate?: number
  /** Maximum p99 latency to be healthy in ms (default: 10000 = 10s) */
  maxP99Latency?: number
  /** Maximum error rate to be healthy (default: 0.05 = 5%) */
  maxErrorRate?: number
}

/**
 * Default health thresholds
 */
const DEFAULT_THRESHOLDS: Required<HealthThresholds> = {
  minSuccessRate: 0.95,
  maxP99Latency: 10000,
  maxErrorRate: 0.05,
}

/**
 * Health monitor for a single provider
 */
export class HealthMonitor {
  private provider: string
  private requests: RequestRecord[] = []
  private thresholds: Required<HealthThresholds>
  private windowMs: number
  private maxRecords: number

  constructor(
    provider: string,
    config: {
      windowMs?: number
      maxRecords?: number
      thresholds?: HealthThresholds
    } = {}
  ) {
    this.provider = provider
    this.windowMs = config.windowMs || 60000 // 1 minute default
    this.maxRecords = config.maxRecords || 10000 // Keep last 10k requests
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...config.thresholds }
  }

  /**
   * Record successful request
   */
  recordSuccess(latencyMs: number, tokens?: TokenUsage, cost?: number): void {
    this.addRecord({
      timestamp: Date.now(),
      success: true,
      latencyMs,
      tokens,
      cost,
    })
  }

  /**
   * Record failed request
   */
  recordFailure(latencyMs: number, error: AdapterError): void {
    this.addRecord({
      timestamp: Date.now(),
      success: false,
      latencyMs,
      error,
    })
  }

  /**
   * Add request record and cleanup old records
   */
  private addRecord(record: RequestRecord): void {
    this.requests.push(record)

    // Remove old records outside time window
    const cutoff = Date.now() - this.windowMs
    this.requests = this.requests.filter((r) => r.timestamp >= cutoff)

    // Cap at max records
    if (this.requests.length > this.maxRecords) {
      this.requests = this.requests.slice(-this.maxRecords)
    }
  }

  /**
   * Get health metrics
   */
  getMetrics(): ProviderHealthMetrics {
    const now = Date.now()
    const cutoff = now - this.windowMs

    // Filter to current window
    const windowRecords = this.requests.filter((r) => r.timestamp >= cutoff)

    if (windowRecords.length === 0) {
      return this.getEmptyMetrics()
    }

    const totalRequests = windowRecords.length
    const successCount = windowRecords.filter((r) => r.success).length
    const failureCount = totalRequests - successCount
    const successRate = successCount / totalRequests

    // Calculate latency percentiles
    const latencies = windowRecords.map((r) => r.latencyMs).sort((a, b) => a - b)
    const latency = this.calculatePercentiles(latencies)

    // Calculate error stats
    const errors = this.calculateErrorStats(windowRecords)

    // Calculate token usage
    const tokens = windowRecords.reduce(
      (acc, r) => {
        if (r.tokens) {
          acc.total += r.tokens.totalTokens
          acc.input += r.tokens.promptTokens
          acc.output += r.tokens.completionTokens
        }
        return acc
      },
      { total: 0, input: 0, output: 0 }
    )

    // Calculate total cost
    const totalCost = windowRecords.reduce((acc, r) => acc + (r.cost || 0), 0)

    // Calculate requests per second
    const windowSec = this.windowMs / 1000
    const requestsPerSecond = totalRequests / windowSec

    // Calculate averages
    const avgTokensPerRequest = tokens.total / totalRequests
    const avgCostPerRequest = totalCost / totalRequests

    // Determine health status
    const isHealthy = this.isHealthy(successRate, latency, errors)
    const healthScore = this.calculateHealthScore(
      successRate,
      latency,
      errors
    )

    return {
      provider: this.provider,
      totalRequests,
      successCount,
      failureCount,
      successRate,
      latency,
      errors,
      tokens,
      totalCost,
      requestsPerSecond,
      avgTokensPerRequest,
      avgCostPerRequest,
      windowStart: new Date(cutoff).toISOString(),
      windowEnd: new Date(now).toISOString(),
      isHealthy,
      healthScore,
    }
  }

  /**
   * Calculate latency percentiles
   */
  private calculatePercentiles(sortedLatencies: number[]): LatencyPercentiles {
    if (sortedLatencies.length === 0) {
      return { p50: 0, p95: 0, p99: 0, min: 0, max: 0, avg: 0 }
    }

    const getPercentile = (p: number) => {
      const index = Math.ceil((p / 100) * sortedLatencies.length) - 1
      return sortedLatencies[Math.max(0, index)]
    }

    const sum = sortedLatencies.reduce((a, b) => a + b, 0)

    return {
      p50: getPercentile(50),
      p95: getPercentile(95),
      p99: getPercentile(99),
      min: sortedLatencies[0],
      max: sortedLatencies[sortedLatencies.length - 1],
      avg: sum / sortedLatencies.length,
    }
  }

  /**
   * Calculate error statistics
   */
  private calculateErrorStats(records: RequestRecord[]): ErrorStats {
    const errors = records.filter((r) => !r.success)

    const byCode: Record<string, number> = {}
    let retryable = 0
    let nonRetryable = 0

    for (const record of errors) {
      if (record.error) {
        const code = record.error.code
        byCode[code] = (byCode[code] || 0) + 1

        if (record.error.isRetryable) {
          retryable++
        } else {
          nonRetryable++
        }
      }
    }

    return {
      total: errors.length,
      byCode,
      retryable,
      nonRetryable,
    }
  }

  /**
   * Check if provider is healthy based on thresholds
   */
  private isHealthy(
    successRate: number,
    latency: LatencyPercentiles,
    errors: ErrorStats
  ): boolean {
    // Check success rate
    if (successRate < this.thresholds.minSuccessRate) {
      return false
    }

    // Check p99 latency
    if (latency.p99 > this.thresholds.maxP99Latency) {
      return false
    }

    // Check error rate
    const errorRate = 1 - successRate
    if (errorRate > this.thresholds.maxErrorRate) {
      return false
    }

    return true
  }

  /**
   * Calculate health score (0-100)
   */
  private calculateHealthScore(
    successRate: number,
    latency: LatencyPercentiles,
    errors: ErrorStats
  ): number {
    // Success rate score (0-40 points)
    const successScore = successRate * 40

    // Latency score (0-30 points)
    // Lower is better - normalize against threshold
    const latencyRatio = Math.min(
      latency.p99 / this.thresholds.maxP99Latency,
      1
    )
    const latencyScore = (1 - latencyRatio) * 30

    // Error score (0-30 points)
    // Favor retryable errors over non-retryable
    const errorRate = 1 - successRate
    const errorRatio = Math.min(errorRate / this.thresholds.maxErrorRate, 1)
    const nonRetryableRatio =
      errors.total > 0 ? errors.nonRetryable / errors.total : 0
    const errorScore = (1 - errorRatio) * 30 * (1 - nonRetryableRatio * 0.5)

    return Math.round(successScore + latencyScore + errorScore)
  }

  /**
   * Get empty metrics
   */
  private getEmptyMetrics(): ProviderHealthMetrics {
    const now = Date.now()
    return {
      provider: this.provider,
      totalRequests: 0,
      successCount: 0,
      failureCount: 0,
      successRate: 1,
      latency: { p50: 0, p95: 0, p99: 0, min: 0, max: 0, avg: 0 },
      errors: { total: 0, byCode: {}, retryable: 0, nonRetryable: 0 },
      tokens: { total: 0, input: 0, output: 0 },
      totalCost: 0,
      requestsPerSecond: 0,
      avgTokensPerRequest: 0,
      avgCostPerRequest: 0,
      windowStart: new Date(now - this.windowMs).toISOString(),
      windowEnd: new Date(now).toISOString(),
      isHealthy: true,
      healthScore: 100,
    }
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.requests = []
  }
}

/**
 * Health monitor registry for all providers
 */
export class HealthMonitorRegistry {
  private monitors = new Map<string, HealthMonitor>()
  private config: {
    windowMs?: number
    maxRecords?: number
    thresholds?: HealthThresholds
  }

  constructor(config: {
    windowMs?: number
    maxRecords?: number
    thresholds?: HealthThresholds
  } = {}) {
    this.config = config
  }

  /**
   * Get or create monitor for provider
   */
  get(provider: string): HealthMonitor {
    if (!this.monitors.has(provider)) {
      const monitor = new HealthMonitor(provider, this.config)
      this.monitors.set(provider, monitor)
    }
    return this.monitors.get(provider)!
  }

  /**
   * Get metrics for all providers
   */
  getAllMetrics(): Record<string, ProviderHealthMetrics> {
    const metrics: Record<string, ProviderHealthMetrics> = {}
    for (const [provider, monitor] of this.monitors.entries()) {
      metrics[provider] = monitor.getMetrics()
    }
    return metrics
  }

  /**
   * Get metrics for healthy providers only
   */
  getHealthyProviders(): string[] {
    const providers: string[] = []
    for (const [provider, monitor] of this.monitors.entries()) {
      const metrics = monitor.getMetrics()
      if (metrics.isHealthy) {
        providers.push(provider)
      }
    }
    return providers
  }

  /**
   * Get metrics for unhealthy providers
   */
  getUnhealthyProviders(): string[] {
    const providers: string[] = []
    for (const [provider, monitor] of this.monitors.entries()) {
      const metrics = monitor.getMetrics()
      if (!metrics.isHealthy) {
        providers.push(provider)
      }
    }
    return providers
  }

  /**
   * Get overall health summary
   */
  getHealthSummary(): {
    totalProviders: number
    healthyProviders: number
    unhealthyProviders: number
    overallHealthScore: number
  } {
    const allMetrics = this.getAllMetrics()
    const providers = Object.keys(allMetrics)
    const totalProviders = providers.length

    if (totalProviders === 0) {
      return {
        totalProviders: 0,
        healthyProviders: 0,
        unhealthyProviders: 0,
        overallHealthScore: 100,
      }
    }

    const healthyProviders = providers.filter(
      (p) => allMetrics[p].isHealthy
    ).length
    const unhealthyProviders = totalProviders - healthyProviders

    const overallHealthScore = Math.round(
      providers.reduce((sum, p) => sum + allMetrics[p].healthScore, 0) /
        totalProviders
    )

    return {
      totalProviders,
      healthyProviders,
      unhealthyProviders,
      overallHealthScore,
    }
  }

  /**
   * Reset all monitors
   */
  resetAll(): void {
    for (const monitor of this.monitors.values()) {
      monitor.reset()
    }
  }

  /**
   * Clear all monitors
   */
  clear(): void {
    this.monitors.clear()
  }
}

/**
 * Global health monitor registry
 */
export const globalHealthMonitorRegistry = new HealthMonitorRegistry({
  windowMs: 60000, // 1 minute window
  thresholds: {
    minSuccessRate: 0.95, // 95%
    maxP99Latency: 10000, // 10 seconds
    maxErrorRate: 0.05, // 5%
  },
})
