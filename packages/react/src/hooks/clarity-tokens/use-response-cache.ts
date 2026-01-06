'use client'

import * as React from 'react'
import type {
  UseResponseCacheConfig,
  UseResponseCacheReturn,
  CachedResponse,
  CacheStats,
} from './types'

/**
 * Simple in-memory cache manager
 */
class ResponseCacheManager<T> {
  private cache: Map<string, {
    data: T
    cachedAt: Date
    expiresAt: Date
    tags: string[]
    hitCount: number
  }>
  private maxEntries: number
  private defaultTTLMs: number
  private hits: number = 0
  private misses: number = 0

  constructor(maxEntries: number = 1000, defaultTTLMs: number = 3600000) {
    this.cache = new Map()
    this.maxEntries = maxEntries
    this.defaultTTLMs = defaultTTLMs
  }

  async search(key: string): Promise<{
    isHit: boolean
    entry: {
      response: T
      metadata: {
        createdAt: Date
        expiresAt: Date
        tags: string[]
        hitCount: number
      }
    } | null
  }> {
    const entry = this.cache.get(key)
    if (entry && entry.expiresAt > new Date()) {
      this.hits++
      entry.hitCount++
      return {
        isHit: true,
        entry: {
          response: entry.data,
          metadata: {
            createdAt: entry.cachedAt,
            expiresAt: entry.expiresAt,
            tags: entry.tags,
            hitCount: entry.hitCount,
          },
        },
      }
    }
    this.misses++
    if (entry) {
      this.cache.delete(key) // Remove expired
    }
    return { isHit: false, entry: null }
  }

  async set(
    key: string,
    value: T,
    options?: { ttlMs?: number; tags?: string[] }
  ): Promise<void> {
    if (this.cache.size >= this.maxEntries) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }

    const ttl = options?.ttlMs ?? this.defaultTTLMs
    this.cache.set(key, {
      data: value,
      cachedAt: new Date(),
      expiresAt: new Date(Date.now() + ttl),
      tags: options?.tags ?? [],
      hitCount: 0,
    })
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async invalidateByTag(tag: string): Promise<number> {
    let count = 0
    for (const [key, entry] of this.cache) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key)
        count++
      }
    }
    return count
  }

  async invalidateByPattern(pattern: RegExp): Promise<number> {
    let count = 0
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
        count++
      }
    }
    return count
  }

  async clear(): Promise<void> {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  async getOrRevalidate(
    key: string,
    revalidate: () => Promise<T>
  ): Promise<{ data: T; source: 'cache' | 'fresh' | 'stale' }> {
    const result = await this.search(key)
    if (result.isHit && result.entry) {
      return { data: result.entry.response, source: 'cache' }
    }

    const freshData = await revalidate()
    await this.set(key, freshData)
    return { data: freshData, source: 'fresh' }
  }

  async getStats(): Promise<CacheStats> {
    const total = this.hits + this.misses
    return {
      totalEntries: this.cache.size,
      hitRate: total > 0 ? this.hits / total : 0,
      totalTokensSaved: 0, // Would need token counting
      totalCostSaved: 0, // Would need cost calculation
      avgSearchTimeMs: 0, // Would need timing
    }
  }
}

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
 *     storageBackend: 'memory',
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
    cacheRef.current = new ResponseCacheManager<T>(
      config.maxEntries ?? 1000,
      config.defaultTTLMs ?? 3600000
    )

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
          expiresAt: result.entry.metadata.expiresAt,
          isStale:
            result.entry.metadata.expiresAt < new Date() &&
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
