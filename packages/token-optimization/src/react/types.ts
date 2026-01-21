/**
 * Token Optimization Statistics
 *
 * Types and interfaces for tracking token optimization statistics.
 * These are used by display components like TokenOptimizationPanel and TokenOptimizationBadge.
 */

/**
 * Statistics tracking token optimization performance
 *
 * This interface is used by display components to show optimization metrics.
 * It tracks accumulated statistics over the lifetime of the application.
 */
export interface TokenOptimizationStats {
  /** Total tokens saved through optimization */
  tokensSaved: number

  /** Total cost savings in USD */
  costSavings: number

  /** Percentage of tokens saved (0-100) */
  percentageSaved: number

  /** Number of cache hits */
  cacheHits: number

  /** Number of cache misses */
  cacheMisses: number

  /** Number of requests that were throttled */
  requestsThrottled: number

  /** Number of queries routed to simple model */
  simpleModelRoutes: number

  /** Number of queries routed to complex model */
  complexModelRoutes: number
}

/**
 * Create an empty stats object
 */
export function createEmptyStats(): TokenOptimizationStats {
  return {
    tokensSaved: 0,
    costSavings: 0,
    percentageSaved: 0,
    cacheHits: 0,
    cacheMisses: 0,
    requestsThrottled: 0,
    simpleModelRoutes: 0,
    complexModelRoutes: 0,
  }
}
