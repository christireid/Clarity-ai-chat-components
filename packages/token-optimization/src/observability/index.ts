/**
 * Observability System for Token Optimization
 *
 * Provides comprehensive observability capabilities including:
 * - Structured logging with configurable handlers
 * - Metrics collection with support for external metrics systems
 * - Distributed tracing with span management
 * - Integration hooks for APM systems (DataDog, New Relic, etc.)
 *
 * @module observability
 * @version 1.0.0
 */

/**
 * Log levels in order of severity
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

/**
 * Configuration for the observability system
 */
export interface ObservabilityConfig {
  /** Whether metrics collection is enabled */
  metricsEnabled: boolean
  /** Custom handler for metrics */
  metricsHandler?: MetricsHandler

  /** Minimum log level to output */
  logLevel: LogLevel
  /** Whether to use structured JSON logging */
  structuredLogging: boolean
  /** Custom handler for logs */
  logHandler?: LogHandler

  /** Whether distributed tracing is enabled */
  tracingEnabled: boolean
  /** Custom handler for traces */
  traceHandler?: TraceHandler

  /** Service name for logging and tracing context */
  serviceName?: string
  /** Environment name (e.g., 'production', 'staging') */
  environment?: string
}

/**
 * Handler interface for custom metrics implementations
 */
export interface MetricsHandler {
  /**
   * Increments a counter metric
   *
   * @param name - Metric name
   * @param value - Value to increment by (default: 1)
   * @param tags - Optional key-value tags
   */
  increment(name: string, value?: number, tags?: Record<string, string>): void

  /**
   * Sets a gauge metric
   *
   * @param name - Metric name
   * @param value - Current value
   * @param tags - Optional key-value tags
   */
  gauge(name: string, value: number, tags?: Record<string, string>): void

  /**
   * Records a histogram/distribution metric
   *
   * @param name - Metric name
   * @param value - Value to record
   * @param tags - Optional key-value tags
   */
  histogram(name: string, value: number, tags?: Record<string, string>): void

  /**
   * Records a timing metric
   *
   * @param name - Metric name
   * @param durationMs - Duration in milliseconds
   * @param tags - Optional key-value tags
   */
  timing?(name: string, durationMs: number, tags?: Record<string, string>): void
}

/**
 * Handler interface for custom log implementations
 */
export interface LogHandler {
  /**
   * Logs a message at the specified level
   *
   * @param level - Log level
   * @param message - Log message
   * @param context - Optional structured context
   */
  log(level: string, message: string, context?: Record<string, unknown>): void
}

/**
 * Handler interface for custom tracing implementations
 */
export interface TraceHandler {
  /**
   * Starts a new span
   *
   * @param name - Span name
   * @param context - Optional span context
   * @returns A Span instance
   */
  startSpan(name: string, context?: Record<string, unknown>): Span
}

/**
 * Represents a tracing span
 */
export interface Span {
  /** Ends the span */
  end(): void
  /** Sets the span status */
  setStatus(status: 'ok' | 'error'): void
  /** Sets an attribute on the span */
  setAttribute(key: string, value: unknown): void
  /** Records an exception on the span */
  recordException?(error: Error): void
  /** Gets the span ID */
  getSpanId?(): string
  /** Gets the trace ID */
  getTraceId?(): string
}

/**
 * Snapshot of collected metrics
 */
export interface MetricsSnapshot {
  /** Total tokens processed */
  tokensProcessed: number
  /** Cache hit count */
  cacheHits: number
  /** Cache miss count */
  cacheMisses: number
  /** Latency measurements by operation */
  latencies: Record<string, number[]>
  /** Compression ratios recorded */
  compressionRatios: number[]
  /** Timestamp of snapshot */
  timestamp: number
  /** Counters by name */
  counters: Record<string, number>
  /** Gauges by name */
  gauges: Record<string, number>
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: ObservabilityConfig = {
  metricsEnabled: true,
  logLevel: 'info',
  structuredLogging: true,
  tracingEnabled: false,
  serviceName: 'token-optimization',
  environment: 'development',
}

/**
 * Log level priority map
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/**
 * Logger for token optimization
 *
 * Provides structured logging with configurable output handlers
 * and support for both human-readable and JSON formats.
 *
 * @example
 * ```typescript
 * const logger = new Logger({ logLevel: 'debug', structuredLogging: true })
 *
 * logger.info('Processing tokens', { count: 1500, model: 'gpt-4' })
 * logger.error('Compression failed', new Error('Quality threshold not met'))
 * ```
 */
export class Logger {
  private readonly config: ObservabilityConfig

  /**
   * Creates a new Logger instance
   *
   * @param config - Logger configuration
   */
  constructor(config?: Partial<ObservabilityConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Logs a debug message
   *
   * @param message - Log message
   * @param context - Optional structured context
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context)
  }

  /**
   * Logs an info message
   *
   * @param message - Log message
   * @param context - Optional structured context
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context)
  }

  /**
   * Logs a warning message
   *
   * @param message - Log message
   * @param context - Optional structured context
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context)
  }

  /**
   * Logs an error message
   *
   * @param message - Log message
   * @param error - Optional error object
   * @param context - Optional structured context
   */
  error(
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
  ): void {
    const errorContext: Record<string, unknown> = { ...context }

    if (error instanceof Error) {
      errorContext.errorName = error.name
      errorContext.errorMessage = error.message
      errorContext.errorStack = error.stack
    } else if (error !== undefined) {
      errorContext.error = error
    }

    this.log('error', message, errorContext)
  }

  /**
   * Internal logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): void {
    // Check log level threshold
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.config.logLevel]) {
      return
    }

    // Use custom handler if provided
    if (this.config.logHandler) {
      this.config.logHandler.log(level, message, context)
      return
    }

    // Build log entry
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.config.serviceName,
      environment: this.config.environment,
      ...context,
    }

    // Output based on format
    if (this.config.structuredLogging) {
      const logFn =
        level === 'error'
          ? console.error
          : level === 'warn'
            ? console.warn
            : console.log
      logFn(JSON.stringify(entry))
    } else {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${this.config.serviceName}]`
      const contextStr = context ? ` ${JSON.stringify(context)}` : ''
      const logFn =
        level === 'error'
          ? console.error
          : level === 'warn'
            ? console.warn
            : console.log
      logFn(`${prefix} ${message}${contextStr}`)
    }
  }

  /**
   * Creates a child logger with additional context
   *
   * @param context - Context to include in all log messages
   * @returns A new Logger instance with the additional context
   */
  child(context: Record<string, unknown>): ChildLogger {
    return new ChildLogger(this, context)
  }
}

/**
 * Child logger that includes additional context in all messages
 */
class ChildLogger {
  constructor(
    private readonly parent: Logger,
    private readonly context: Record<string, unknown>
  ) {}

  debug(message: string, context?: Record<string, unknown>): void {
    this.parent.debug(message, { ...this.context, ...context })
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.parent.info(message, { ...this.context, ...context })
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.parent.warn(message, { ...this.context, ...context })
  }

  error(
    message: string,
    error?: unknown,
    context?: Record<string, unknown>
  ): void {
    this.parent.error(message, error, { ...this.context, ...context })
  }
}

/**
 * Metrics collector for token optimization
 *
 * Collects and aggregates metrics about token processing,
 * caching, and compression operations.
 *
 * @example
 * ```typescript
 * const metrics = new MetricsCollector({
 *   metricsEnabled: true,
 *   metricsHandler: datadogHandler
 * })
 *
 * metrics.incrementTokensProcessed(1500, 'gpt-4')
 * metrics.recordLatency('compression', 45)
 * metrics.recordCompressionRatio(0.65)
 *
 * const snapshot = metrics.getSnapshot()
 * ```
 */
export class MetricsCollector {
  private readonly config: ObservabilityConfig
  private tokensProcessed: number = 0
  private cacheHits: number = 0
  private cacheMisses: number = 0
  private readonly latencies: Map<string, number[]> = new Map()
  private readonly compressionRatios: number[] = []
  private readonly counters: Map<string, number> = new Map()
  private readonly gauges: Map<string, number> = new Map()
  private readonly maxSamples: number = 1000

  /**
   * Creates a new MetricsCollector instance
   *
   * @param config - Metrics configuration
   */
  constructor(config?: Partial<ObservabilityConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Increments the tokens processed counter
   *
   * @param count - Number of tokens processed
   * @param model - Optional model name for tagging
   */
  incrementTokensProcessed(count: number, model?: string): void {
    this.tokensProcessed += count

    if (this.config.metricsEnabled && this.config.metricsHandler) {
      this.config.metricsHandler.increment(
        'token_optimization.tokens_processed',
        count,
        model ? { model } : undefined
      )
    }
  }

  /**
   * Records a cache hit
   */
  incrementCacheHit(): void {
    this.cacheHits++

    if (this.config.metricsEnabled && this.config.metricsHandler) {
      this.config.metricsHandler.increment('token_optimization.cache_hit')
    }
  }

  /**
   * Records a cache miss
   */
  incrementCacheMiss(): void {
    this.cacheMisses++

    if (this.config.metricsEnabled && this.config.metricsHandler) {
      this.config.metricsHandler.increment('token_optimization.cache_miss')
    }
  }

  /**
   * Records a latency measurement for an operation
   *
   * @param operationName - Name of the operation
   * @param latencyMs - Latency in milliseconds
   */
  recordLatency(operationName: string, latencyMs: number): void {
    // Store locally
    const existing = this.latencies.get(operationName) || []
    existing.push(latencyMs)

    // Trim to max samples
    if (existing.length > this.maxSamples) {
      existing.shift()
    }
    this.latencies.set(operationName, existing)

    // Send to handler
    if (this.config.metricsEnabled && this.config.metricsHandler) {
      if (this.config.metricsHandler.timing) {
        this.config.metricsHandler.timing(
          `token_optimization.${operationName}.latency`,
          latencyMs
        )
      } else {
        this.config.metricsHandler.histogram(
          `token_optimization.${operationName}.latency_ms`,
          latencyMs
        )
      }
    }
  }

  /**
   * Records a compression ratio
   *
   * @param ratio - Compression ratio (0.0 to 1.0)
   */
  recordCompressionRatio(ratio: number): void {
    this.compressionRatios.push(ratio)

    // Trim to max samples
    if (this.compressionRatios.length > this.maxSamples) {
      this.compressionRatios.shift()
    }

    if (this.config.metricsEnabled && this.config.metricsHandler) {
      this.config.metricsHandler.histogram(
        'token_optimization.compression_ratio',
        ratio
      )
    }
  }

  /**
   * Increments a custom counter
   *
   * @param name - Counter name
   * @param value - Value to increment by (default: 1)
   * @param tags - Optional tags
   */
  increment(
    name: string,
    value: number = 1,
    tags?: Record<string, string>
  ): void {
    const current = this.counters.get(name) || 0
    this.counters.set(name, current + value)

    if (this.config.metricsEnabled && this.config.metricsHandler) {
      this.config.metricsHandler.increment(
        `token_optimization.${name}`,
        value,
        tags
      )
    }
  }

  /**
   * Sets a gauge value
   *
   * @param name - Gauge name
   * @param value - Current value
   * @param tags - Optional tags
   */
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    this.gauges.set(name, value)

    if (this.config.metricsEnabled && this.config.metricsHandler) {
      this.config.metricsHandler.gauge(
        `token_optimization.${name}`,
        value,
        tags
      )
    }
  }

  /**
   * Gets a snapshot of all collected metrics
   *
   * @returns Current metrics snapshot
   */
  getSnapshot(): MetricsSnapshot {
    const latenciesObj: Record<string, number[]> = {}
    for (const [key, values] of this.latencies) {
      latenciesObj[key] = [...values]
    }

    const countersObj: Record<string, number> = {}
    for (const [key, value] of this.counters) {
      countersObj[key] = value
    }

    const gaugesObj: Record<string, number> = {}
    for (const [key, value] of this.gauges) {
      gaugesObj[key] = value
    }

    return {
      tokensProcessed: this.tokensProcessed,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      latencies: latenciesObj,
      compressionRatios: [...this.compressionRatios],
      timestamp: Date.now(),
      counters: countersObj,
      gauges: gaugesObj,
    }
  }

  /**
   * Gets the cache hit rate
   *
   * @returns Cache hit rate as a decimal (0.0 to 1.0)
   */
  getCacheHitRate(): number {
    const total = this.cacheHits + this.cacheMisses
    return total > 0 ? this.cacheHits / total : 0
  }

  /**
   * Resets all collected metrics
   */
  reset(): void {
    this.tokensProcessed = 0
    this.cacheHits = 0
    this.cacheMisses = 0
    this.latencies.clear()
    this.compressionRatios.length = 0
    this.counters.clear()
    this.gauges.clear()
  }
}

/**
 * Tracer for distributed tracing
 *
 * Provides span-based tracing for tracking operations
 * across distributed systems.
 *
 * @example
 * ```typescript
 * const tracer = new Tracer({
 *   tracingEnabled: true,
 *   traceHandler: openTelemetryHandler
 * })
 *
 * const span = tracer.startSpan('compress_text')
 * try {
 *   // ... do work
 *   span.setAttribute('tokens', 1500)
 *   span.setStatus('ok')
 * } catch (error) {
 *   span.setStatus('error')
 *   throw error
 * } finally {
 *   span.end()
 * }
 * ```
 */
export class Tracer {
  private readonly config: ObservabilityConfig

  /**
   * Creates a new Tracer instance
   *
   * @param config - Tracer configuration
   */
  constructor(config?: Partial<ObservabilityConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Starts a new span
   *
   * @param name - Span name
   * @param context - Optional span context
   * @returns A Span instance
   */
  startSpan(name: string, context?: Record<string, unknown>): Span {
    if (this.config.tracingEnabled && this.config.traceHandler) {
      return this.config.traceHandler.startSpan(name, context)
    }

    // Return a no-op span if tracing is disabled
    return new NoOpSpan()
  }

  /**
   * Wraps an async function with tracing
   *
   * @param name - Span name
   * @param fn - Function to wrap
   * @returns The result of the function
   */
  async trace<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    context?: Record<string, unknown>
  ): Promise<T> {
    const span = this.startSpan(name, context)
    try {
      const result = await fn(span)
      span.setStatus('ok')
      return result
    } catch (error) {
      span.setStatus('error')
      if (span.recordException && error instanceof Error) {
        span.recordException(error)
      }
      throw error
    } finally {
      span.end()
    }
  }
}

/**
 * No-op span implementation for when tracing is disabled
 */
class NoOpSpan implements Span {
  end(): void {
    // No-op
  }
  setStatus(_status: 'ok' | 'error'): void {
    // No-op
  }
  setAttribute(_key: string, _value: unknown): void {
    // No-op
  }
  recordException(_error: Error): void {
    // No-op
  }
  getSpanId(): string {
    return ''
  }
  getTraceId(): string {
    return ''
  }
}

/**
 * Creates a default observability instance with all components
 *
 * @param config - Configuration options
 * @returns Object containing logger, metrics, and tracer instances
 *
 * @example
 * ```typescript
 * const { logger, metrics, tracer } = createObservability({
 *   logLevel: 'info',
 *   metricsEnabled: true,
 *   tracingEnabled: true
 * })
 * ```
 */
export function createObservability(config?: Partial<ObservabilityConfig>): {
  logger: Logger
  metrics: MetricsCollector
  tracer: Tracer
} {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  return {
    logger: new Logger(mergedConfig),
    metrics: new MetricsCollector(mergedConfig),
    tracer: new Tracer(mergedConfig),
  }
}
