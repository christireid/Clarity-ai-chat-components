/**
 * Health Check System for Token Optimization
 *
 * Provides comprehensive health monitoring for the token optimization system including:
 * - Component-level health status (tokenizer, cache, security, compression)
 * - Aggregate system health with degradation detection
 * - Performance metrics collection and reporting
 * - Integration with observability systems
 *
 * @module health
 * @version 1.0.0
 */

/**
 * Health status for individual components
 */
export interface ComponentHealth {
  /** Current health status of the component */
  status: 'healthy' | 'degraded' | 'unhealthy'
  /** Average latency in milliseconds for recent operations */
  latencyMs?: number
  /** Error rate as a decimal (0.0 to 1.0) */
  errorRate?: number
  /** Most recent error message if any */
  lastError?: string
  /** Timestamp of last successful operation */
  lastSuccessAt?: number
  /** Additional component-specific details */
  details?: Record<string, unknown>
}

/**
 * Aggregated health metrics for the system
 */
export interface HealthMetrics {
  /** Total uptime in milliseconds since initialization */
  uptimeMs: number
  /** Total number of requests processed */
  requestsTotal: number
  /** Total number of errors encountered */
  errorsTotal: number
  /** Cache hit rate as a decimal (0.0 to 1.0) */
  cacheHitRate: number
  /** Average latency in milliseconds across all operations */
  avgLatencyMs: number
  /** P95 latency in milliseconds */
  p95LatencyMs: number
  /** P99 latency in milliseconds */
  p99LatencyMs: number
  /** Requests per second (averaged over last minute) */
  requestsPerSecond: number
}

/**
 * Complete health status for the token optimization system
 */
export interface HealthStatus {
  /** Overall system health status */
  status: 'healthy' | 'degraded' | 'unhealthy'
  /** Timestamp when this health check was performed */
  timestamp: number
  /** Version of the token optimization package */
  version: string
  /** Individual component health statuses */
  components: {
    tokenizer: ComponentHealth
    cache: ComponentHealth
    security: ComponentHealth
    compression: ComponentHealth
  }
  /** Aggregated system metrics */
  metrics: HealthMetrics
}

/**
 * Configuration for the health checker
 */
export interface HealthCheckerConfig {
  /** Latency threshold (ms) above which a component is considered degraded */
  degradedLatencyThreshold?: number
  /** Latency threshold (ms) above which a component is considered unhealthy */
  unhealthyLatencyThreshold?: number
  /** Error rate threshold above which a component is considered degraded */
  degradedErrorRateThreshold?: number
  /** Error rate threshold above which a component is considered unhealthy */
  unhealthyErrorRateThreshold?: number
  /** Number of recent samples to keep for metrics calculation */
  metricsSampleSize?: number
  /** Version string for the package */
  version?: string
}

/**
 * Default health checker configuration
 */
const DEFAULT_CONFIG: Required<HealthCheckerConfig> = {
  degradedLatencyThreshold: 100, // 100ms
  unhealthyLatencyThreshold: 500, // 500ms
  degradedErrorRateThreshold: 0.01, // 1%
  unhealthyErrorRateThreshold: 0.05, // 5%
  metricsSampleSize: 1000,
  version: '1.0.0',
}

/**
 * Internal structure for tracking component statistics
 */
interface ComponentStats {
  successCount: number
  errorCount: number
  latencies: number[]
  lastError?: string
  lastSuccessAt?: number
  lastErrorAt?: number
}

/**
 * Health checker for the token optimization system
 *
 * Monitors component health, collects metrics, and provides
 * comprehensive health status reporting for production systems.
 *
 * @example
 * ```typescript
 * const healthChecker = new HealthChecker({ version: '2.0.0' })
 *
 * // Record operations
 * healthChecker.recordRequest(50, true)
 * healthChecker.recordCacheHit(true)
 *
 * // Get health status
 * const status = await healthChecker.check()
 * console.log(status.status) // 'healthy'
 * ```
 */
export class HealthChecker {
  private readonly config: Required<HealthCheckerConfig>
  private readonly startTime: number
  private readonly componentStats: Map<string, ComponentStats>
  private cacheHits: number = 0
  private cacheMisses: number = 0

  /**
   * Creates a new HealthChecker instance
   *
   * @param config - Optional configuration options
   */
  constructor(config?: HealthCheckerConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.startTime = Date.now()
    this.componentStats = new Map([
      ['tokenizer', this.createEmptyStats()],
      ['cache', this.createEmptyStats()],
      ['security', this.createEmptyStats()],
      ['compression', this.createEmptyStats()],
    ])
  }

  /**
   * Creates empty component statistics
   */
  private createEmptyStats(): ComponentStats {
    return {
      successCount: 0,
      errorCount: 0,
      latencies: [],
    }
  }

  /**
   * Performs a comprehensive health check of all components
   *
   * @returns Complete health status including all components and metrics
   */
  async check(): Promise<HealthStatus> {
    const timestamp = Date.now()

    const components = {
      tokenizer: this.getComponentHealth('tokenizer'),
      cache: this.getComponentHealth('cache'),
      security: this.getComponentHealth('security'),
      compression: this.getComponentHealth('compression'),
    }

    const metrics = this.getMetrics()
    const status = this.calculateOverallStatus(components)

    return {
      status,
      timestamp,
      version: this.config.version,
      components,
      metrics,
    }
  }

  /**
   * Gets health status for a specific component
   *
   * @param component - Component name
   * @returns Component health status
   */
  private getComponentHealth(component: string): ComponentHealth {
    const stats = this.componentStats.get(component)
    if (!stats) {
      return { status: 'healthy' }
    }

    const totalRequests = stats.successCount + stats.errorCount
    const errorRate = totalRequests > 0 ? stats.errorCount / totalRequests : 0
    const avgLatency = this.calculateAverage(stats.latencies)

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'

    // Check error rate thresholds
    if (errorRate >= this.config.unhealthyErrorRateThreshold) {
      status = 'unhealthy'
    } else if (errorRate >= this.config.degradedErrorRateThreshold) {
      status = 'degraded'
    }

    // Check latency thresholds (only if we have latency data)
    if (avgLatency > 0) {
      if (avgLatency >= this.config.unhealthyLatencyThreshold) {
        status = 'unhealthy'
      } else if (
        avgLatency >= this.config.degradedLatencyThreshold &&
        status !== 'unhealthy'
      ) {
        status = 'degraded'
      }
    }

    return {
      status,
      latencyMs: avgLatency > 0 ? Math.round(avgLatency) : undefined,
      errorRate:
        totalRequests > 0 ? Math.round(errorRate * 10000) / 10000 : undefined,
      lastError: stats.lastError,
      lastSuccessAt: stats.lastSuccessAt,
    }
  }

  /**
   * Calculates overall system status based on component health
   */
  private calculateOverallStatus(
    components: Record<string, ComponentHealth>
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const statuses = Object.values(components).map((c) => c.status)

    if (statuses.some((s) => s === 'unhealthy')) {
      return 'unhealthy'
    }
    if (statuses.some((s) => s === 'degraded')) {
      return 'degraded'
    }
    return 'healthy'
  }

  /**
   * Gets current health metrics
   *
   * @returns Current health metrics snapshot
   */
  getMetrics(): HealthMetrics {
    const allLatencies: number[] = []
    let totalRequests = 0
    let totalErrors = 0

    for (const stats of this.componentStats.values()) {
      totalRequests += stats.successCount + stats.errorCount
      totalErrors += stats.errorCount
      allLatencies.push(...stats.latencies)
    }

    const uptimeMs = Date.now() - this.startTime
    const requestsPerSecond =
      uptimeMs > 0 ? (totalRequests / uptimeMs) * 1000 : 0
    const totalCacheRequests = this.cacheHits + this.cacheMisses
    const cacheHitRate =
      totalCacheRequests > 0 ? this.cacheHits / totalCacheRequests : 0

    return {
      uptimeMs,
      requestsTotal: totalRequests,
      errorsTotal: totalErrors,
      cacheHitRate: Math.round(cacheHitRate * 10000) / 10000,
      avgLatencyMs: Math.round(this.calculateAverage(allLatencies)),
      p95LatencyMs: Math.round(this.calculatePercentile(allLatencies, 95)),
      p99LatencyMs: Math.round(this.calculatePercentile(allLatencies, 99)),
      requestsPerSecond: Math.round(requestsPerSecond * 100) / 100,
    }
  }

  /**
   * Records a request for a specific component
   *
   * @param component - Component name
   * @param latencyMs - Request latency in milliseconds
   * @param success - Whether the request was successful
   * @param errorMessage - Optional error message if request failed
   */
  recordComponentRequest(
    component: 'tokenizer' | 'cache' | 'security' | 'compression',
    latencyMs: number,
    success: boolean,
    errorMessage?: string
  ): void {
    const stats = this.componentStats.get(component)
    if (!stats) return

    if (success) {
      stats.successCount++
      stats.lastSuccessAt = Date.now()
    } else {
      stats.errorCount++
      stats.lastErrorAt = Date.now()
      if (errorMessage) {
        stats.lastError = errorMessage
      }
    }

    stats.latencies.push(latencyMs)

    // Trim latencies array to configured sample size
    if (stats.latencies.length > this.config.metricsSampleSize) {
      stats.latencies = stats.latencies.slice(-this.config.metricsSampleSize)
    }
  }

  /**
   * Records a general request (deprecated, use recordComponentRequest)
   *
   * @param latencyMs - Request latency in milliseconds
   * @param success - Whether the request was successful
   * @deprecated Use recordComponentRequest for more granular tracking
   */
  recordRequest(latencyMs: number, success: boolean): void {
    // Record to all components for backward compatibility
    this.recordComponentRequest('tokenizer', latencyMs, success)
  }

  /**
   * Records a cache hit or miss
   *
   * @param hit - true for cache hit, false for cache miss
   */
  recordCacheHit(hit: boolean): void {
    if (hit) {
      this.cacheHits++
    } else {
      this.cacheMisses++
    }
  }

  /**
   * Resets all metrics and statistics
   */
  reset(): void {
    for (const [key] of this.componentStats) {
      this.componentStats.set(key, this.createEmptyStats())
    }
    this.cacheHits = 0
    this.cacheMisses = 0
  }

  /**
   * Calculates average of an array of numbers
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0
    const sum = values.reduce((a, b) => a + b, 0)
    return sum / values.length
  }

  /**
   * Calculates percentile of an array of numbers
   */
  private calculatePercentile(values: number[], percentile: number): number {
    if (values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)]
  }
}

/**
 * Creates a health check endpoint handler for HTTP servers
 *
 * @param healthChecker - HealthChecker instance
 * @returns Handler function that returns health status
 *
 * @example
 * ```typescript
 * const healthChecker = new HealthChecker()
 * const handler = createHealthEndpoint(healthChecker)
 *
 * // Express
 * app.get('/health', async (req, res) => {
 *   const { status, body } = await handler()
 *   res.status(status).json(body)
 * })
 * ```
 */
export function createHealthEndpoint(
  healthChecker: HealthChecker
): () => Promise<{ status: number; body: HealthStatus }> {
  return async () => {
    const health = await healthChecker.check()
    const httpStatus =
      health.status === 'healthy'
        ? 200
        : health.status === 'degraded'
          ? 200 // Still return 200 for degraded to prevent unnecessary alerts
          : 503

    return {
      status: httpStatus,
      body: health,
    }
  }
}

/**
 * Creates a liveness check (simple ping)
 *
 * @returns Handler function for liveness checks
 *
 * @example
 * ```typescript
 * const liveness = createLivenessCheck()
 * app.get('/health/live', (req, res) => {
 *   const { status, body } = liveness()
 *   res.status(status).json(body)
 * })
 * ```
 */
export function createLivenessCheck(): () => {
  status: number
  body: { alive: boolean }
} {
  return () => ({
    status: 200,
    body: { alive: true },
  })
}

/**
 * Creates a readiness check
 *
 * @param healthChecker - HealthChecker instance
 * @returns Handler function for readiness checks
 *
 * @example
 * ```typescript
 * const healthChecker = new HealthChecker()
 * const readiness = createReadinessCheck(healthChecker)
 * app.get('/health/ready', async (req, res) => {
 *   const { status, body } = await readiness()
 *   res.status(status).json(body)
 * })
 * ```
 */
export function createReadinessCheck(
  healthChecker: HealthChecker
): () => Promise<{
  status: number
  body: { ready: boolean; reason?: string }
}> {
  return async () => {
    const health = await healthChecker.check()
    const ready = health.status !== 'unhealthy'

    return {
      status: ready ? 200 : 503,
      body: {
        ready,
        reason: ready ? undefined : 'System is unhealthy',
      },
    }
  }
}
