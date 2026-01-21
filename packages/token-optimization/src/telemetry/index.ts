/**
 * OpenTelemetry Integration
 *
 * Week 6: Observability through traces, metrics, and logs for all
 * token optimization operations.
 *
 * Features:
 * - Distributed tracing for token counting and optimization
 * - Metrics collection (counters, gauges, histograms)
 * - Error tracking and logging
 * - Configurable sampling and export
 * - Console, OTLP, and custom exporters
 *
 * @module telemetry
 */

// ============================================================================
// Telemetry Collector
// ============================================================================

export {
  TelemetryCollector,
  instrumentTokenCount,
  instrumentOptimization,
  initTelemetry,
  getTelemetry,
  createConsoleExporter,
  withTelemetry,
} from './telemetry-collector'

export type {
  TelemetrySpan,
  TelemetryMetrics,
  TelemetryConfig,
} from './telemetry-collector'
