/**
 * Performance Monitor
 *
 * @deprecated Use performance-unified.ts instead. This file re-exports for backward compatibility.
 *
 * Unified performance monitoring and metrics collection
 *
 * @module @clarity-chat/utils/performance
 *
 * @example
 * ```ts
 * import { PerformanceMonitor } from '@clarity-chat/utils/performance'
 *
 * // Track function execution
 * const result = PerformanceMonitor.track('api-call', () => {
 *   return expensiveOperation()
 * })
 *
 * // Manual timing
 * PerformanceMonitor.time('database-query')
 * await queryDatabase()
 * PerformanceMonitor.timeEnd('database-query')
 *
 * // Get metrics
 * const metrics = PerformanceMonitor.getMetrics()
 * console.log(`Average time: ${metrics.averageTime}ms`)
 * ```
 */

// Re-export from unified performance module
export {
  UnifiedPerformanceMonitor as PerformanceMonitor,
  measurePerformance,
  measurePerformanceAsync,
  startPerformanceTimer,
  endPerformanceTimer,
  getPerformanceMetrics,
  formatPerformanceMetrics,
  getPerformanceSummary,
  throttle,
  debounce,
  Batcher,
  lazyLoad,
  optimizeArray,
  type OperationTiming,
  type PerformanceMetrics,
  type PerformanceOptions,
} from './performance-unified.js'

// Re-export utilities from other modules for backward compatibility
export { formatDuration, formatBytes } from './format/index.js'
export { getLogger } from './logger/index.js'
