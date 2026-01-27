/**
 * Analytics & Observability Domain Exports
 *
 * Top-level: Simple analytics access
 * Mid-level: Specific tracking
 * Low-level: Core services
 */

// ============================================================================
// TOP-LEVEL: Simple Analytics Access
// ============================================================================

export { AnalyticsProvider, useAnalytics } from '../analytics/AnalyticsProvider'

export type { AnalyticsConfig } from '../analytics/types'

// ============================================================================
// MID-LEVEL: Specific Tracking
// ============================================================================

// Analytics providers
export * from '../analytics/providers'

// Analytics hooks
export * from '../analytics/hooks'

// Performance monitoring
export { useRenderPerformance as usePerformance } from '../hooks/performance/use-performance'

// Error tracking
export * from '../error'

// ============================================================================
// LOW-LEVEL: Core Services
// ============================================================================

// Analytics types
export type {
  AnalyticsEvent,
  AnalyticsUser,
  PageView,
  AnalyticsProvider as AnalyticsProviderInterface,
} from '../analytics/types'

export { AnalyticsEvents } from '../analytics/types'
