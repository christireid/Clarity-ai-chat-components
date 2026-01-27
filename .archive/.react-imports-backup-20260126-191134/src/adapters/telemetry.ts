/**
 * Telemetry and Metrics Export for Model Adapters
 *
 * Provides hooks for integration with:
 * - OpenTelemetry (spans, traces, metrics)
 * - Prometheus (metrics export)
 * - Custom monitoring systems
 * - APM tools (DataDog, New Relic, etc.)
 */

import type { AdapterError } from './errors'
import type { TokenUsage, FinishReason } from './types'
import { globalHealthMonitorRegistry } from './monitoring'
import type { ProviderHealthMetrics } from './monitoring'
import { globalCircuitBreakerRegistry } from './circuit-breaker'

/**
 * Telemetry event types
 */
export enum TelemetryEventType {
  REQUEST_START = 'request.start',
  REQUEST_END = 'request.end',
  REQUEST_ERROR = 'request.error',
  REQUEST_RETRY = 'request.retry',
  CIRCUIT_STATE_CHANGE = 'circuit.state_change',
  CIRCUIT_REQUEST_REJECTED = 'circuit.request_rejected',
  TOKEN_USAGE = 'token.usage',
  COST_INCURRED = 'cost.incurred',
}

/**
 * Telemetry event data
 */
export interface TelemetryEvent {
  /** Event type */
  type: TelemetryEventType
  /** Event timestamp */
  timestamp: string
  /** Provider name */
  provider: string
  /** Correlation ID for tracing */
  correlationId?: string
  /** Operation type (chat, stream) */
  operation?: string
  /** Event-specific data */
  data: Record<string, unknown>
}

/**
 * Telemetry hook function
 */
export type TelemetryHook = (event: TelemetryEvent) => void | Promise<void>

/**
 * Telemetry configuration
 */
export interface TelemetryConfig {
  /** Enable telemetry */
  enabled?: boolean
  /** Custom telemetry hooks */
  hooks?: TelemetryHook[]
  /** Sample rate (0-1, default: 1 = 100%) */
  sampleRate?: number
}

/**
 * Telemetry manager
 */
export class TelemetryManager {
  private config: Required<TelemetryConfig>
  private hooks: TelemetryHook[] = []

  constructor(config: TelemetryConfig = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      hooks: config.hooks || [],
      sampleRate: config.sampleRate ?? 1,
    }
    this.hooks = [...this.config.hooks]
  }

  /**
   * Add telemetry hook
   */
  addHook(hook: TelemetryHook): void {
    this.hooks.push(hook)
  }

  /**
   * Remove telemetry hook
   */
  removeHook(hook: TelemetryHook): void {
    this.hooks = this.hooks.filter((h) => h !== hook)
  }

  /**
   * Emit telemetry event
   */
  async emit(event: TelemetryEvent): Promise<void> {
    if (!this.config.enabled) return

    // Sample rate check
    if (Math.random() > this.config.sampleRate) return

    // Call all hooks
    const promises = this.hooks.map((hook) => {
      try {
        return Promise.resolve(hook(event))
      } catch (error) {
        console.error('Telemetry hook error:', error)
        return Promise.resolve()
      }
    })

    await Promise.all(promises)
  }

  /**
   * Record request start
   */
  async recordRequestStart(
    provider: string,
    operation: string,
    correlationId?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    await this.emit({
      type: TelemetryEventType.REQUEST_START,
      timestamp: new Date().toISOString(),
      provider,
      correlationId,
      operation,
      data: metadata || {},
    })
  }

  /**
   * Record request end
   */
  async recordRequestEnd(
    provider: string,
    operation: string,
    durationMs: number,
    tokens?: TokenUsage,
    finishReason?: FinishReason,
    correlationId?: string
  ): Promise<void> {
    await this.emit({
      type: TelemetryEventType.REQUEST_END,
      timestamp: new Date().toISOString(),
      provider,
      correlationId,
      operation,
      data: {
        durationMs,
        tokens,
        finishReason,
      },
    })
  }

  /**
   * Record request error
   */
  async recordRequestError(
    provider: string,
    operation: string,
    error: AdapterError,
    durationMs: number,
    correlationId?: string
  ): Promise<void> {
    await this.emit({
      type: TelemetryEventType.REQUEST_ERROR,
      timestamp: new Date().toISOString(),
      provider,
      correlationId,
      operation,
      data: {
        error: {
          code: error.code,
          message: error.message,
          isRetryable: error.isRetryable,
        },
        durationMs,
      },
    })
  }

  /**
   * Record request retry
   */
  async recordRequestRetry(
    provider: string,
    operation: string,
    attempt: number,
    delayMs: number,
    error: AdapterError,
    correlationId?: string
  ): Promise<void> {
    await this.emit({
      type: TelemetryEventType.REQUEST_RETRY,
      timestamp: new Date().toISOString(),
      provider,
      correlationId,
      operation,
      data: {
        attempt,
        delayMs,
        error: {
          code: error.code,
          message: error.message,
        },
      },
    })
  }

  /**
   * Record token usage
   */
  async recordTokenUsage(
    provider: string,
    tokens: TokenUsage,
    correlationId?: string
  ): Promise<void> {
    await this.emit({
      type: TelemetryEventType.TOKEN_USAGE,
      timestamp: new Date().toISOString(),
      provider,
      correlationId,
      data: {
        promptTokens: tokens.promptTokens,
        completionTokens: tokens.completionTokens,
        totalTokens: tokens.totalTokens,
      },
    })
  }

  /**
   * Record cost
   */
  async recordCost(
    provider: string,
    cost: number,
    correlationId?: string
  ): Promise<void> {
    await this.emit({
      type: TelemetryEventType.COST_INCURRED,
      timestamp: new Date().toISOString(),
      provider,
      correlationId,
      data: {
        cost,
      },
    })
  }
}

/**
 * Global telemetry manager
 */
export const globalTelemetry = new TelemetryManager()

/**
 * Prometheus-compatible metrics
 */
export interface PrometheusMetrics {
  /** Adapter request total (counter) */
  adapter_requests_total: Array<{
    provider: string
    operation: string
    status: 'success' | 'failure'
    value: number
  }>

  /** Adapter request duration (histogram) */
  adapter_request_duration_ms: Array<{
    provider: string
    operation: string
    quantile: number
    value: number
  }>

  /** Adapter errors total (counter) */
  adapter_errors_total: Array<{
    provider: string
    operation: string
    error_code: string
    value: number
  }>

  /** Adapter tokens total (counter) */
  adapter_tokens_total: Array<{
    provider: string
    type: 'input' | 'output'
    value: number
  }>

  /** Adapter cost total (counter) */
  adapter_cost_total: Array<{
    provider: string
    value: number
  }>

  /** Circuit breaker state (gauge) */
  circuit_breaker_state: Array<{
    provider: string
    state: 'closed' | 'open' | 'half_open'
    value: number
  }>

  /** Provider health score (gauge) */
  provider_health_score: Array<{
    provider: string
    value: number
  }>
}

/**
 * Export metrics in Prometheus format
 */
export function exportPrometheusMetrics(): PrometheusMetrics {
  const healthMetrics = globalHealthMonitorRegistry.getAllMetrics()
  const circuitStats = globalCircuitBreakerRegistry.getAllStats()

  const metrics: PrometheusMetrics = {
    adapter_requests_total: [],
    adapter_request_duration_ms: [],
    adapter_errors_total: [],
    adapter_tokens_total: [],
    adapter_cost_total: [],
    circuit_breaker_state: [],
    provider_health_score: [],
  }

  // Process health metrics
  for (const [provider, health] of Object.entries(healthMetrics)) {
    // Request totals
    metrics.adapter_requests_total.push(
      {
        provider,
        operation: 'chat', // Simplified - could be more granular
        status: 'success',
        value: health.successCount,
      },
      {
        provider,
        operation: 'chat',
        status: 'failure',
        value: health.failureCount,
      }
    )

    // Request duration histograms
    metrics.adapter_request_duration_ms.push(
      { provider, operation: 'chat', quantile: 0.5, value: health.latency.p50 },
      { provider, operation: 'chat', quantile: 0.95, value: health.latency.p95 },
      { provider, operation: 'chat', quantile: 0.99, value: health.latency.p99 }
    )

    // Error totals
    for (const [errorCode, count] of Object.entries(health.errors.byCode)) {
      metrics.adapter_errors_total.push({
        provider,
        operation: 'chat',
        error_code: errorCode,
        value: count,
      })
    }

    // Token totals
    metrics.adapter_tokens_total.push(
      {
        provider,
        type: 'input',
        value: health.tokens.input,
      },
      {
        provider,
        type: 'output',
        value: health.tokens.output,
      }
    )

    // Cost totals
    metrics.adapter_cost_total.push({
      provider,
      value: health.totalCost,
    })

    // Health score
    metrics.provider_health_score.push({
      provider,
      value: health.healthScore,
    })
  }

  // Process circuit breaker stats
  for (const [provider, stats] of Object.entries(circuitStats)) {
    const stateValue = stats.state === 'CLOSED' ? 0 : stats.state === 'OPEN' ? 1 : 2

    metrics.circuit_breaker_state.push({
      provider,
      state: stats.state.toLowerCase() as 'closed' | 'open' | 'half_open',
      value: stateValue,
    })
  }

  return metrics
}

/**
 * Export metrics in Prometheus text format
 */
export function exportPrometheusText(): string {
  const metrics = exportPrometheusMetrics()
  const lines: string[] = []

  // Helper to format labels
  const formatLabels = (labels: Record<string, string | number>): string => {
    const labelPairs = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(',')
    return labelPairs ? `{${labelPairs}}` : ''
  }

  // adapter_requests_total
  lines.push('# HELP adapter_requests_total Total number of adapter requests')
  lines.push('# TYPE adapter_requests_total counter')
  for (const metric of metrics.adapter_requests_total) {
    const labels = formatLabels({
      provider: metric.provider,
      operation: metric.operation,
      status: metric.status,
    })
    lines.push(`adapter_requests_total${labels} ${metric.value}`)
  }

  // adapter_request_duration_ms
  lines.push(
    '# HELP adapter_request_duration_ms Adapter request duration in milliseconds'
  )
  lines.push('# TYPE adapter_request_duration_ms summary')
  for (const metric of metrics.adapter_request_duration_ms) {
    const labels = formatLabels({
      provider: metric.provider,
      operation: metric.operation,
      quantile: metric.quantile,
    })
    lines.push(`adapter_request_duration_ms${labels} ${metric.value}`)
  }

  // adapter_errors_total
  lines.push('# HELP adapter_errors_total Total number of adapter errors')
  lines.push('# TYPE adapter_errors_total counter')
  for (const metric of metrics.adapter_errors_total) {
    const labels = formatLabels({
      provider: metric.provider,
      operation: metric.operation,
      error_code: metric.error_code,
    })
    lines.push(`adapter_errors_total${labels} ${metric.value}`)
  }

  // adapter_tokens_total
  lines.push('# HELP adapter_tokens_total Total number of tokens processed')
  lines.push('# TYPE adapter_tokens_total counter')
  for (const metric of metrics.adapter_tokens_total) {
    const labels = formatLabels({
      provider: metric.provider,
      type: metric.type,
    })
    lines.push(`adapter_tokens_total${labels} ${metric.value}`)
  }

  // adapter_cost_total
  lines.push('# HELP adapter_cost_total Total cost in USD')
  lines.push('# TYPE adapter_cost_total counter')
  for (const metric of metrics.adapter_cost_total) {
    const labels = formatLabels({
      provider: metric.provider,
    })
    lines.push(`adapter_cost_total${labels} ${metric.value}`)
  }

  // circuit_breaker_state
  lines.push(
    '# HELP circuit_breaker_state Circuit breaker state (0=closed, 1=open, 2=half_open)'
  )
  lines.push('# TYPE circuit_breaker_state gauge')
  for (const metric of metrics.circuit_breaker_state) {
    const labels = formatLabels({
      provider: metric.provider,
      state: metric.state,
    })
    lines.push(`circuit_breaker_state${labels} ${metric.value}`)
  }

  // provider_health_score
  lines.push('# HELP provider_health_score Provider health score (0-100)')
  lines.push('# TYPE provider_health_score gauge')
  for (const metric of metrics.provider_health_score) {
    const labels = formatLabels({
      provider: metric.provider,
    })
    lines.push(`provider_health_score${labels} ${metric.value}`)
  }

  return lines.join('\n') + '\n'
}

/**
 * OpenTelemetry-compatible span interface
 */
export interface Span {
  /** Span name */
  name: string
  /** Start time */
  startTime: number
  /** End time */
  endTime?: number
  /** Span attributes */
  attributes: Record<string, string | number | boolean>
  /** Span status */
  status?: 'ok' | 'error'
  /** Error message */
  errorMessage?: string
}

/**
 * Create OpenTelemetry-compatible span
 */
export function createSpan(
  name: string,
  attributes: Record<string, string | number | boolean> = {}
): Span {
  return {
    name,
    startTime: Date.now(),
    attributes,
  }
}

/**
 * End OpenTelemetry span
 */
export function endSpan(
  span: Span,
  status: 'ok' | 'error' = 'ok',
  errorMessage?: string
): Span {
  span.endTime = Date.now()
  span.status = status
  if (errorMessage) {
    span.errorMessage = errorMessage
  }
  return span
}

/**
 * Export span in OpenTelemetry format
 */
export function exportSpan(span: Span): {
  name: string
  startTimeMs: number
  endTimeMs?: number
  durationMs?: number
  attributes: Record<string, string | number | boolean>
  status?: 'ok' | 'error'
  errorMessage?: string
} {
  return {
    name: span.name,
    startTimeMs: span.startTime,
    endTimeMs: span.endTime,
    durationMs: span.endTime ? span.endTime - span.startTime : undefined,
    attributes: span.attributes,
    status: span.status,
    errorMessage: span.errorMessage,
  }
}
