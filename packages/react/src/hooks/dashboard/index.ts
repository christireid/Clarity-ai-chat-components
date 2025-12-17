/**
 * Dashboard Hooks
 *
 * Hooks for dashboard data fetching, composition, and performance.
 */

export {
  useDashboardData,
  useSimpleDashboardData,
  type DashboardDataState,
  type DashboardDataActions,
  type UseDashboardDataOptions,
} from './use-dashboard-data'

export {
  useDashboardComposer,
  createDataSource,
  type DataSourceConfig,
  type DataSourceState,
  type DashboardComposerState,
  type DashboardComposerActions,
  type UseDashboardComposerOptions,
} from './use-dashboard-composer'

export {
  useDashboardPerformance,
  DashboardPerformanceProvider,
  usePerformanceContext,
  type DashboardPerformanceMetrics,
  type UseDashboardPerformanceOptions,
  type UseDashboardPerformanceReturn,
  type PerformanceContextValue,
} from './use-dashboard-performance'
