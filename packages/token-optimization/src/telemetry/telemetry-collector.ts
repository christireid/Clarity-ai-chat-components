/**
 * OpenTelemetry Integration for Token Optimization
 *
 * Provides observability through traces, metrics, and logs for all
 * token optimization operations.
 */

/**
 * Telemetry span
 */
export interface TelemetrySpan {
  name: string
  startTime: number
  endTime?: number
  attributes: Record<string, any>
  events: Array<{ name: string; timestamp: number; attributes?: Record<string, any> }>
  status: 'ok' | 'error'
  error?: Error
}

/**
 * Telemetry metrics
 */
export interface TelemetryMetrics {
  // Counter metrics
  tokensCounted: number
  optimizationsPerformed: number
  cacheHits: number
  cacheMisses: number
  errorsEncountered: number

  // Gauge metrics
  currentTokens: number
  currentCost: number
  cacheSize: number

  // Histogram metrics
  tokenCountDurations: number[]
  optimizationDurations: number[]
  costCalculationDurations: number[]
}

/**
 * Telemetry configuration
 */
export interface TelemetryConfig {
  /** Service name */
  serviceName: string
  /** Enable tracing */
  enableTracing?: boolean
  /** Enable metrics */
  enableMetrics?: boolean
  /** Sample rate (0-1) */
  sampleRate?: number
  /** Export interval (ms) */
  exportInterval?: number
  /** Custom attributes */
  attributes?: Record<string, any>
}

/**
 * Simple telemetry collector
 */
export class TelemetryCollector {
  private config: Required<TelemetryConfig>
  private spans: TelemetrySpan[] = []
  private metrics: TelemetryMetrics = {
    tokensCounted: 0,
    optimizationsPerformed: 0,
    cacheHits: 0,
    cacheMisses: 0,
    errorsEncountered: 0,
    currentTokens: 0,
    currentCost: 0,
    cacheSize: 0,
    tokenCountDurations: [],
    optimizationDurations: [],
    costCalculationDurations: [],
  }
  private activeSpans: Map<string, TelemetrySpan> = new Map()

  constructor(config: TelemetryConfig) {
    this.config = {
      serviceName: config.serviceName,
      enableTracing: config.enableTracing ?? true,
      enableMetrics: config.enableMetrics ?? true,
      sampleRate: config.sampleRate ?? 1.0,
      exportInterval: config.exportInterval ?? 60000,
      attributes: config.attributes ?? {},
    }
  }

  /**
   * Start a new span
   */
  startSpan(name: string, attributes?: Record<string, any>): string {
    if (!this.config.enableTracing) return ''
    if (Math.random() > this.config.sampleRate) return ''

    const spanId = `${name}_${Date.now()}_${Math.random()}`
    const span: TelemetrySpan = {
      name,
      startTime: Date.now(),
      attributes: { ...this.config.attributes, ...attributes },
      events: [],
      status: 'ok',
    }

    this.activeSpans.set(spanId, span)
    return spanId
  }

  /**
   * End a span
   */
  endSpan(spanId: string, attributes?: Record<string, any>): void {
    if (!spanId) return

    const span = this.activeSpans.get(spanId)
    if (!span) return

    span.endTime = Date.now()
    if (attributes) {
      span.attributes = { ...span.attributes, ...attributes }
    }

    this.spans.push(span)
    this.activeSpans.delete(spanId)
  }

  /**
   * Record an error in a span
   */
  recordError(spanId: string, error: Error): void {
    if (!spanId) return

    const span = this.activeSpans.get(spanId)
    if (span) {
      span.status = 'error'
      span.error = error
      span.events.push({
        name: 'error',
        timestamp: Date.now(),
        attributes: {
          message: error.message,
          stack: error.stack,
        },
      })
    }
  }

  /**
   * Add event to span
   */
  addEvent(spanId: string, name: string, attributes?: Record<string, any>): void {
    if (!spanId) return

    const span = this.activeSpans.get(spanId)
    if (span) {
      span.events.push({
        name,
        timestamp: Date.now(),
        attributes,
      })
    }
  }

  /**
   * Record metrics
   */
  recordMetric(name: keyof TelemetryMetrics, value: number): void {
    if (!this.config.enableMetrics) return

    if (name.endsWith('Durations')) {
      (this.metrics[name] as number[]).push(value)
    } else {
      this.metrics[name] = value as any
    }
  }

  /**
   * Increment counter
   */
  incrementCounter(name: keyof TelemetryMetrics, delta: number = 1): void {
    if (!this.config.enableMetrics) return

    this.metrics[name] = (this.metrics[name] as number) + delta
  }

  /**
   * Get current metrics
   */
  getMetrics(): TelemetryMetrics {
    return { ...this.metrics }
  }

  /**
   * Get all spans
   */
  getSpans(): TelemetrySpan[] {
    return [...this.spans]
  }

  /**
   * Export and clear
   */
  export(): { spans: TelemetrySpan[]; metrics: TelemetryMetrics } {
    const data = {
      spans: this.getSpans(),
      metrics: this.getMetrics(),
    }

    this.spans = []
    this.metrics = {
      tokensCounted: 0,
      optimizationsPerformed: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errorsEncountered: 0,
      currentTokens: 0,
      currentCost: 0,
      cacheSize: 0,
      tokenCountDurations: [],
      optimizationDurations: [],
      costCalculationDurations: [],
    }

    return data
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.spans = []
    this.activeSpans.clear()
    this.metrics = {
      tokensCounted: 0,
      optimizationsPerformed: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errorsEncountered: 0,
      currentTokens: 0,
      currentCost: 0,
      cacheSize: 0,
      tokenCountDurations: [],
      optimizationDurations: [],
      costCalculationDurations: [],
    }
  }
}

/**
 * Instrumented wrapper for token counting
 */
export function instrumentTokenCount<T extends (...args: any[]) => any>(
  fn: T,
  collector: TelemetryCollector,
  spanName: string = 'token_count'
): T {
  return ((...args: Parameters<T>) => {
    const spanId = collector.startSpan(spanName, {
      operation: 'token_count',
    })

    const startTime = Date.now()

    try {
      const result = fn(...args)

      const duration = Date.now() - startTime
      collector.recordMetric('tokenCountDurations', duration)
      collector.incrementCounter('tokensCounted')

      if (typeof result === 'number') {
        collector.endSpan(spanId, { tokens: result, duration })
      } else {
        collector.endSpan(spanId, { duration })
      }

      return result
    } catch (error) {
      collector.recordError(spanId, error as Error)
      collector.incrementCounter('errorsEncountered')
      collector.endSpan(spanId)
      throw error
    }
  }) as T
}

/**
 * Instrumented wrapper for optimization operations
 */
export function instrumentOptimization<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  collector: TelemetryCollector,
  spanName: string = 'optimization'
): T {
  return (async (...args: Parameters<T>) => {
    const spanId = collector.startSpan(spanName, {
      operation: 'optimization',
    })

    const startTime = Date.now()

    try {
      const result = await fn(...args)

      const duration = Date.now() - startTime
      collector.recordMetric('optimizationDurations', duration)
      collector.incrementCounter('optimizationsPerformed')

      collector.endSpan(spanId, {
        duration,
        tokensSaved: result?.tokensSaved,
        strategy: result?.strategy,
      })

      return result
    } catch (error) {
      collector.recordError(spanId, error as Error)
      collector.incrementCounter('errorsEncountered')
      collector.endSpan(spanId)
      throw error
    }
  }) as T
}

/**
 * Global telemetry instance
 */
let globalCollector: TelemetryCollector | null = null

/**
 * Initialize global telemetry
 */
export function initTelemetry(config: TelemetryConfig): TelemetryCollector {
  globalCollector = new TelemetryCollector(config)
  return globalCollector
}

/**
 * Get global telemetry collector
 */
export function getTelemetry(): TelemetryCollector | null {
  return globalCollector
}

/**
 * Simple console exporter
 */
export function createConsoleExporter(collector: TelemetryCollector) {
  return setInterval(() => {
    const data = collector.export()

    if (data.spans.length > 0 || Object.values(data.metrics).some(v =>
      Array.isArray(v) ? v.length > 0 : v > 0
    )) {
      console.log('[Telemetry Export]', {
        timestamp: new Date().toISOString(),
        spans: data.spans.length,
        metrics: data.metrics,
      })
    }
  }, collector['config'].exportInterval)
}

/**
 * Helper to wrap a function with telemetry
 */
export function withTelemetry<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    collector?: TelemetryCollector
    spanName?: string
    type?: 'sync' | 'async'
  } = {}
): T {
  const collector = options.collector || getTelemetry()
  if (!collector) return fn

  const spanName = options.spanName || fn.name || 'operation'

  if (options.type === 'async' || fn.constructor.name === 'AsyncFunction') {
    return instrumentOptimization(fn, collector, spanName)
  }

  return instrumentTokenCount(fn, collector, spanName)
}
