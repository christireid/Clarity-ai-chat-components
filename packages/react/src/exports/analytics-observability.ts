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

export {
  AnalyticsProvider,
  useAnalytics,
  type AnalyticsConfig,
} from '../analytics/AnalyticsProvider'

// ============================================================================
// MID-LEVEL: Specific Tracking
// ============================================================================

// Analytics providers
export * from '../analytics/providers'

// Analytics hooks
export * from '../analytics/hooks'

// Performance monitoring
export { usePerformance } from '../hooks/use-performance'

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
