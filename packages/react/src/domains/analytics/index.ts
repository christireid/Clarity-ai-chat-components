/**
 * Analytics & Observability Domain
 * 
 * APIs for tracking, monitoring, and evaluation
 */

// Top-level: Drop-in ready APIs
export {
  useAnalytics,
  type UseAnalyticsOptions,
} from '../../analytics/use-analytics'
export { AnalyticsProvider } from '../../analytics/AnalyticsProvider'

// Mid-level: Building blocks
export {
  useTracking,
  type UseTrackingOptions,
} from '../../analytics/use-tracking'
export {
  useMetrics,
  type UseMetricsOptions,
} from '../../observability/use-metrics'
export {
  useEvaluation,
  type UseEvaluationOptions,
} from '../../observability/use-evaluation'

// Low-level: Primitives
export { trackEvent } from '../../analytics/track-event'
export { recordMetric } from '../../observability/record-metric'
export { evaluateResponse } from '../../observability/evaluate-response'

// Re-export analytics and observability modules
export * from '../../analytics'
export * from '../../observability'
