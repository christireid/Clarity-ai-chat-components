'use client'

import * as React from 'react'
import { SmartCache } from '../../utils/optimization/smart-cache'
import type {
  CacheOptions,
  CacheStats,
} from '../../utils/optimization/smart-cache'
import { estimateTokens } from '../../utils/tokenization/estimator'

export interface UseSmartCacheOptions<T = any> extends CacheOptions {
  /** Enable cache (default: true) */
  enabled?: boolean
  /** Cost per token for savings calculation */
  costPerToken?: number
  /** Callback when cache hit */
  onCacheHit?: (query: string, response: T) => void
  /** Callback when cache miss */
  onCacheMiss?: (query: string) => void
}

export interface UseSmartCacheReturn<T = any> {
  /** Get from cache */
  get: (query: string) => Promise<T | null>
  /** Set in cache */
  set: (
    query: string,
    response: T,
    options?: { ttl?: number; tags?: string[] }
  ) => Promise<void>
  /** Clear cache */
  clear: () => void
  /** Clear by tag */
  clearByTag: (tag: string) => void
  /** Cache statistics */
  stats: CacheStats
  /** Whether cache is enabled */
  isEnabled: boolean
  /** Toggle cache */
  setEnabled: (enabled: boolean) => void
}

/**
 * Hook for smart caching with semantic similarity
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const cache = useSmartCache<string>({
 *     enableSemanticMatching: true,
 *     embedFunction: async (text) => await getEmbedding(text),
 *     similarityThreshold: 0.85,
 *   })
 *
 *   const handleQuery = async (query: string) => {
 *     // Try cache first
 *     const cached = await cache.get(query)
 *     if (cached) {
 *       console.log('Cache hit!')
 *       return cached
 *     }
 *
 *     // Query API
 *     const response = await queryAPI(query)
 *
 *     // Cache for future
 *     await cache.set(query, response, { ttl: 3600000 }) // 1 hour
 *
 *     return response
 *   }
 *
 *   return (
 *     <div>
 *       <div>Cache Hit Rate: {cache.stats.hitRate.toFixed(1)}%</div>
 *       <div>Tokens Saved: {cache.stats.tokensSaved}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useSmartCache<T = any>(
  options: UseSmartCacheOptions<T> = {}
): UseSmartCacheReturn<T> {
  const {
    enabled: initialEnabled = true,
    costPerToken = 0,
    onCacheHit,
    onCacheMiss,
    ...cacheOptions
  } = options

  const [isEnabled, setIsEnabled] = React.useState(initialEnabled)
  const [stats, setStats] = React.useState<CacheStats>({
    size: 0,
    hits: 0,
    misses: 0,
    hitRate: 0,
    tokensSaved: 0,
    costSaved: 0,
  })

  // Create cache instance (memoized)
  const cache = React.useMemo(
    () => new SmartCache<T>(cacheOptions),
    [cacheOptions]
  )

  // Update stats periodically
  React.useEffect(() => {
    const updateStats = () => {
      setStats(cache.getStats())
    }

    const interval = setInterval(updateStats, 1000)
    return () => clearInterval(interval)
  }, [cache])

  const get = React.useCallback(
    async (query: string): Promise<T | null> => {
      if (!isEnabled) return null

      const result = await cache.get(query)

      if (result) {
        onCacheHit?.(query, result)
        // Estimate tokens saved using centralized estimator
        const tokens = estimateTokens(query)
        cache.recordSavings(tokens, costPerToken)
      } else {
        onCacheMiss?.(query)
      }

      setStats(cache.getStats())
      return result
    },
    [cache, isEnabled, onCacheHit, onCacheMiss, costPerToken]
  )

  const set = React.useCallback(
    async (
      query: string,
      response: T,
      opts?: { ttl?: number; tags?: string[] }
    ) => {
      if (!isEnabled) return
      await cache.set(query, response, opts)
      setStats(cache.getStats())
    },
    [cache, isEnabled]
  )

  const clear = React.useCallback(() => {
    cache.clear()
    setStats(cache.getStats())
  }, [cache])

  const clearByTag = React.useCallback(
    (tag: string) => {
      cache.clearByTag(tag)
      setStats(cache.getStats())
    },
    [cache]
  )

  return {
    get,
    set,
    clear,
    clearByTag,
    stats,
    isEnabled,
    setEnabled: setIsEnabled,
  }
}
