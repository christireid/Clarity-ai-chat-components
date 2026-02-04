/**
 * Dashboard Components
 *
 * Analytics and monitoring dashboards for tracking usage,
 * performance, and conversation metrics.
 */

export { AnalyticsDashboard } from './AnalyticsDashboard'
export { PerformanceDashboard } from './PerformanceDashboard'
export { PerformanceAnalyticsDashboard } from './PerformanceAnalyticsDashboard'
export { ConversationAnalyticsDashboard } from './ConversationAnalyticsDashboard'
export { UsageDashboard } from './UsageDashboard'
export {
  UserInteractionAnalytics,
  useInteractionTracking,
} from './UserInteractionAnalytics'
export { ResponseQualityMeter } from './ResponseQualityMeter'

// Savings Dashboard
export {
  SavingsDashboard,
  type SavingsDashboardProps,
  type SavingsMetrics,
  type TimePeriodMetrics,
  type TrendDataPoint,
  type ExportFormat,
  type TimePeriod,
} from './SavingsDashboard'
