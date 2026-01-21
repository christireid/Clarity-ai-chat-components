/**
 * useCacheStats Hook
 *
 * React hook for real-time cache performance monitoring.
 * Tracks cache hits, misses, and provides performance insights.
 *
 * @module use-cache-stats
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import type { TieredCache } from '../cache/tiered-cache'
import type { SmartCache } from '../cache/smart-cache'
import type { ExactCache } from '../cache/exact-cache'

/**
 * Cache statistics
 */
export interface CacheStatistics {
  /** Total cache hits */
  hits: number
  /** Total cache misses */
  misses: number
  /** Hit rate (0-1) */
  hitRate: number
  /** Total cache operations */
  totalOperations: number
  /** Cache size (number of entries) */
  size: number
  /** Estimated tokens saved */
  tokensSaved: number
  /** Estimated cost saved (USD) */
  costSaved: number
}

/**
 * Cache performance metrics
 */
export interface CachePerformanceMetrics {
  /** Hit rate over last N operations */
  recentHitRate: number
  /** Trend direction */
  trend: 'improving' | 'declining' | 'stable'
  /** Performance level */
  performance: 'excellent' | 'good' | 'fair' | 'poor'
  /** Recommended actions */
  recommendations: string[]
}

/**
 * Configuration for useCacheStats hook
 */
export interface UseCacheStatsConfig {
  /** Cache instance to monitor */
  cache: TieredCache | SmartCache | ExactCache | any
  /** Update interval in ms (default: 1000) */
  updateInterval?: number
  /** Track cost savings (requires token cost per 1M) */
  tokenCostPer1M?: number
  /** Average tokens per cached response */
  avgTokensPerResponse?: number
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Return type for useCacheStats hook
 */
export interface UseCacheStatsReturn {
  /** Current cache statistics */
  stats: CacheStatistics
  /** Performance metrics */
  performance: CachePerformanceMetrics
  /** Reset statistics */
  resetStats: () => void
  /** Force update statistics */
  updateStats: () => void
  /** Whether stats are being tracked */
  isTracking: boolean
}

/**
 * React hook for monitoring cache performance
 *
 * Provides real-time insights into cache effectiveness, including
 * hit rates, cost savings, and performance recommendations.
 *
 * @example Basic Usage
 * ```typescript
 * function CacheMonitor() {
 *   const cache = useMemo(() => new TieredCache(), [])
 *   const { stats, performance } = useCacheStats({ cache })
 *
 *   return (
 *     <div>
 *       <StatCard label="Hit Rate" value={`${(stats.hitRate * 100).toFixed(1)}%`} />
 *       <StatCard label="Tokens Saved" value={stats.tokensSaved.toLocaleString()} />
 *       <StatCard label="Cost Saved" value={`$${stats.costSaved.toFixed(2)}`} />
 *       <Badge color={getPerformanceColor(performance.performance)}>
 *         {performance.performance}
 *       </Badge>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example With Cost Tracking
 * ```typescript
 * const { stats, performance, resetStats } = useCacheStats({
 *   cache: myCache,
 *   tokenCostPer1M: 2.5, // GPT-4o input cost
 *   avgTokensPerResponse: 500,
 *   updateInterval: 2000,
 * })
 *
 * // Track cumulative savings
 * console.log(`Saved $${stats.costSaved.toFixed(2)} so far`)
 *
 * // Performance insights
 * if (performance.performance === 'poor') {
 *   console.log('Recommendations:', performance.recommendations)
 * }
 * ```
 *
 * @param config - Hook configuration
 * @returns Hook state and methods
 */
export function useCacheStats(config: UseCacheStatsConfig): UseCacheStatsReturn {
  const {
    cache,
    updateInterval = 1000,
    tokenCostPer1M = 0,
    avgTokensPerResponse = 500,
    debug = false,
  } = config

  // State
  const [stats, setStats] = useState<CacheStatistics>(() => ({
    hits: 0,
    misses: 0,
    hitRate: 0,
    totalOperations: 0,
    size: 0,
    tokensSaved: 0,
    costSaved: 0,
  }))

  const [recentHistory, setRecentHistory] = useState<number[]>([])
  const [isTracking, setIsTracking] = useState(true)

  // Update statistics from cache
  const updateStats = useCallback(() => {
    try {
      // Get cache stats (API varies by cache type)
      let cacheStats: any

      if (typeof cache.getStats === 'function') {
        cacheStats = cache.getStats()
      } else if (typeof cache.stats !== 'undefined') {
        cacheStats = cache.stats
      } else {
        // Fallback for caches without built-in stats
        cacheStats = {
          hits: cache.hits || 0,
          misses: cache.misses || 0,
          size: cache.size || 0,
        }
      }

      const hits = cacheStats.hits || 0
      const misses = cacheStats.misses || 0
      const totalOperations = hits + misses
      const hitRate = totalOperations > 0 ? hits / totalOperations : 0
      const size = cacheStats.size || 0

      // Calculate cost savings
      const tokensSaved = hits * avgTokensPerResponse
      const costSaved = tokenCostPer1M > 0 ? (tokensSaved / 1_000_000) * tokenCostPer1M : 0

      setStats({
        hits,
        misses,
        hitRate,
        totalOperations,
        size,
        tokensSaved,
        costSaved,
      })

      // Track recent hit rates for trend analysis
      setRecentHistory((prev) => {
        const updated = [...prev, hitRate]
        return updated.slice(-10) // Keep last 10 data points
      })

      if (debug) {
        console.log('Cache stats updated:', {
          hits,
          misses,
          hitRate: `${(hitRate * 100).toFixed(1)}%`,
          tokensSaved,
          costSaved,
        })
      }
    } catch (error) {
      if (debug) {
        console.error('Failed to update cache stats:', error)
      }
    }
  }, [cache, avgTokensPerResponse, tokenCostPer1M, debug])

  // Reset statistics
  const resetStats = useCallback(() => {
    if (typeof cache.reset === 'function') {
      cache.reset()
    }
    setRecentHistory([])
    updateStats()
  }, [cache, updateStats])

  // Auto-update on interval
  useEffect(() => {
    if (!isTracking) {
      return
    }

    updateStats() // Initial update

    const interval = setInterval(updateStats, updateInterval)

    return () => {
      clearInterval(interval)
    }
  }, [isTracking, updateStats, updateInterval])

  // Calculate performance metrics
  const performance = useMemo((): CachePerformanceMetrics => {
    const { hitRate } = stats
    const recommendations: string[] = []

    // Determine performance level
    let performanceLevel: CachePerformanceMetrics['performance']
    if (hitRate >= 0.8) {
      performanceLevel = 'excellent'
    } else if (hitRate >= 0.6) {
      performanceLevel = 'good'
    } else if (hitRate >= 0.4) {
      performanceLevel = 'fair'
      recommendations.push('Consider increasing cache TTL')
      recommendations.push('Review cache key generation strategy')
    } else {
      performanceLevel = 'poor'
      recommendations.push('Cache hit rate is low - review caching strategy')
      recommendations.push('Consider using semantic caching for similar queries')
      recommendations.push('Increase cache size if memory allows')
    }

    // Calculate trend
    let trend: CachePerformanceMetrics['trend'] = 'stable'
    if (recentHistory.length >= 3) {
      const recent = recentHistory.slice(-3)
      const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length
      const prev = recentHistory.slice(-6, -3)
      if (prev.length >= 3) {
        const prevAvg = prev.reduce((sum, val) => sum + val, 0) / prev.length
        if (avg > prevAvg + 0.05) {
          trend = 'improving'
        } else if (avg < prevAvg - 0.05) {
          trend = 'declining'
          recommendations.push('Hit rate declining - investigate cache invalidation')
        }
      }
    }

    // Recent hit rate (last 5 operations)
    const recentHitRate =
      recentHistory.length > 0
        ? recentHistory.slice(-5).reduce((sum, val) => sum + val, 0) / Math.min(recentHistory.length, 5)
        : hitRate

    return {
      recentHitRate,
      trend,
      performance: performanceLevel,
      recommendations,
    }
  }, [stats, recentHistory])

  return {
    stats,
    performance,
    resetStats,
    updateStats,
    isTracking,
  }
}

/**
 * Helper function to get color for performance level
 */
export function getPerformanceColor(
  performance: CachePerformanceMetrics['performance']
): 'green' | 'yellow' | 'orange' | 'red' {
  switch (performance) {
    case 'excellent':
      return 'green'
    case 'good':
      return 'yellow'
    case 'fair':
      return 'orange'
    case 'poor':
      return 'red'
  }
}

/**
 * Hook for comparing cache strategies
 *
 * Useful for A/B testing different cache configurations.
 *
 * @example
 * ```typescript
 * function CacheComparison() {
 *   const exactCache = useMemo(() => new ExactCache(), [])
 *   const smartCache = useMemo(() => new SmartCache(), [])
 *
 *   const exactStats = useCacheStats({ cache: exactCache })
 *   const smartStats = useCacheStats({ cache: smartCache })
 *
 *   return (
 *     <ComparisonTable>
 *       <Row label="Exact Cache" stats={exactStats.stats} />
 *       <Row label="Smart Cache" stats={smartStats.stats} />
 *     </ComparisonTable>
 *   )
 * }
 * ```
 */
export interface CacheComparison {
  cache1: {
    name: string
    stats: CacheStatistics
    performance: CachePerformanceMetrics
  }
  cache2: {
    name: string
    stats: CacheStatistics
    performance: CachePerformanceMetrics
  }
  winner: 'cache1' | 'cache2' | 'tie'
  advantage: string
}

export function useCacheComparison(
  cache1: { name: string; cache: any; config?: Partial<UseCacheStatsConfig> },
  cache2: { name: string; cache: any; config?: Partial<UseCacheStatsConfig> }
): CacheComparison {
  const stats1 = useCacheStats({ cache: cache1.cache, ...cache1.config })
  const stats2 = useCacheStats({ cache: cache2.cache, ...cache2.config })

  const comparison = useMemo((): CacheComparison => {
    const hitRateDiff = stats1.stats.hitRate - stats2.stats.hitRate

    let winner: CacheComparison['winner']
    let advantage: string

    if (Math.abs(hitRateDiff) < 0.05) {
      winner = 'tie'
      advantage = 'Performance is similar'
    } else if (hitRateDiff > 0) {
      winner = 'cache1'
      advantage = `${cache1.name} has ${(hitRateDiff * 100).toFixed(1)}% higher hit rate`
    } else {
      winner = 'cache2'
      advantage = `${cache2.name} has ${(Math.abs(hitRateDiff) * 100).toFixed(1)}% higher hit rate`
    }

    return {
      cache1: {
        name: cache1.name,
        stats: stats1.stats,
        performance: stats1.performance,
      },
      cache2: {
        name: cache2.name,
        stats: stats2.stats,
        performance: stats2.performance,
      },
      winner,
      advantage,
    }
  }, [stats1, stats2, cache1.name, cache2.name])

  return comparison
}
