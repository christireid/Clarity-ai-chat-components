'use client'

import * as React from 'react'
import { createResponseCache, ResponseCacheManager } from '@clarity-chat/clarity-tokens'
import type { CacheStats } from '@clarity-chat/clarity-tokens'
import type {
  UseResponseCacheConfig,
  UseResponseCacheReturn,
  CachedResponse,
} from './types'

/**
 * useResponseCache - Intelligent response caching with TTL and invalidation
 *
 * Caches LLM responses with configurable TTL, tag-based invalidation,
 * and stale-while-revalidate pattern. Uses exact-match for deterministic queries.
 *
 * @param config - Configuration options
 * @returns Cache utilities and statistics
 *
 * @example
 * ```tsx
 * function CachedChat() {
 *   const cache = useResponseCache<string>({
 *     defaultTTLMs: 3600000, // 1 hour
 *     storageBackend: 'indexeddb',
 *     staleWhileRevalidate: true,
 *   })
 *
 *   const handleQuery = async (query: string) => {
 *     // Use getOrRevalidate for automatic cache management
 *     const { data, source } = await cache.getOrRevalidate(
 *       query,
 *       async () => {
 *         const response = await callLLM(query)
 *         return response.text
 *       }
 *     )
 *
 *     console.log(`Response from: ${source}`) // 'cache', 'fresh', or 'stale'
 *     return data
 *   }
 *
 *   return (
 *     <div>
 *       <span>Cache hit rate: {(cache.stats.hitRate * 100).toFixed(1)}%</span>
 *       <span>Tokens saved: {cache.stats.totalTokensSaved}</span>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Tag-based invalidation
 * function DocumentChat() {
 *   const cache = useResponseCache()
 *
 *   const handleQuery = async (docId: string, query: string) => {
 *     const cacheKey = `${docId}:${query}`
 *
 *     await cache.set(cacheKey, response, {
 *       tags: [`doc:${docId}`, 'queries'],
 *     })
 *   }
 *
 *   const handleDocumentUpdate = async (docId: string) => {
 *     // Invalidate all cached queries for this document
 *     const count = await cache.invalidateByTag(`doc:${docId}`)
 *     console.log(`Invalidated ${count} cached responses`)
 *   }
 * }
 * ```
 */
export function useResponseCache<T = string>(
  config: UseResponseCacheConfig = {}
): UseResponseCacheReturn<T> {
  // Create cache manager
  const cacheRef = React.useRef<ResponseCacheManager<T> | null>(null)

  // Stats state
  const [stats, setStats] = React.useState<CacheStats>({
    totalEntries: 0,
    hitRate: 0,
    totalTokensSaved: 0,
    totalCostSaved: 0,
    avgSearchTimeMs: 0,
  })

  // Initialize cache
  React.useEffect(() => {
    cacheRef.current = createResponseCache<T>(config)

    // Update stats periodically
    const updateStats = async () => {
      if (cacheRef.current) {
        const newStats = await cacheRef.current.getStats()
        setStats(newStats)
      }
    }

    void updateStats()

    return () => {
      cacheRef.current = null
    }
  }, [config.defaultTTLMs, config.maxEntries, config.storageBackend])

  /**
   * Get cached response
   */
  const get = React.useCallback(
    async (key: string): Promise<CachedResponse<T> | null> => {
      if (!cacheRef.current) return null

      const result = await cacheRef.current.search(key)

      if (result.isHit && result.entry) {
        // Update stats
        const newStats = await cacheRef.current.getStats()
        setStats(newStats)

        return {
          data: result.entry.response,
          cachedAt: result.entry.metadata.createdAt,
          expiresAt: result.entry.metadata.expiresAt!,
          isStale:
            result.entry.metadata.expiresAt! < new Date() &&
            !!config.staleWhileRevalidate,
          tags: result.entry.metadata.tags ?? [],
          hitCount: result.entry.metadata.hitCount,
        }
      }

      return null
    },
    [config.staleWhileRevalidate]
  )

  /**
   * Set cached response
   */
  const set = React.useCallback(
    async (
      key: string,
      value: T,
      options?: { ttlMs?: number; tags?: string[] }
    ): Promise<void> => {
      if (!cacheRef.current) return

      await cacheRef.current.set(key, value, options)

      // Update stats
      const newStats = await cacheRef.current.getStats()
      setStats(newStats)
    },
    []
  )

  /**
   * Invalidate by key
   */
  const invalidate = React.useCallback(async (key: string): Promise<void> => {
    if (!cacheRef.current) return
    await cacheRef.current.invalidate(key)

    // Update stats
    const newStats = await cacheRef.current.getStats()
    setStats(newStats)
  }, [])

  /**
   * Invalidate by tag
   */
  const invalidateByTag = React.useCallback(
    async (tag: string): Promise<number> => {
      if (!cacheRef.current) return 0
      const count = await cacheRef.current.invalidateByTag(tag)

      // Update stats
      const newStats = await cacheRef.current.getStats()
      setStats(newStats)

      return count
    },
    []
  )

  /**
   * Invalidate by pattern
   */
  const invalidateByPattern = React.useCallback(
    async (pattern: RegExp): Promise<number> => {
      if (!cacheRef.current) return 0
      const count = await cacheRef.current.invalidateByPattern(pattern)

      // Update stats
      const newStats = await cacheRef.current.getStats()
      setStats(newStats)

      return count
    },
    []
  )

  /**
   * Clear all entries
   */
  const invalidateAll = React.useCallback(async (): Promise<void> => {
    if (!cacheRef.current) return
    await cacheRef.current.clear()

    setStats({
      totalEntries: 0,
      hitRate: 0,
      totalTokensSaved: 0,
      totalCostSaved: 0,
      avgSearchTimeMs: 0,
    })
  }, [])

  /**
   * Get or revalidate
   */
  const getOrRevalidate = React.useCallback(
    async (
      key: string,
      revalidate: () => Promise<T>
    ): Promise<{ data: T; source: 'cache' | 'fresh' | 'stale' }> => {
      if (!cacheRef.current) {
        const fresh = await revalidate()
        return { data: fresh, source: 'fresh' }
      }

      const result = await cacheRef.current.getOrRevalidate(key, revalidate)

      // Update stats
      const newStats = await cacheRef.current.getStats()
      setStats(newStats)

      return result
    },
    []
  )

  return {
    get,
    set,
    invalidate,
    invalidateByTag,
    invalidateByPattern,
    invalidateAll,
    getOrRevalidate,
    stats,
  }
}
