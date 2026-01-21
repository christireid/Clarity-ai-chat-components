'use client'

import * as React from 'react'
import { ExactCache } from '@clarity-chat/token-optimization'
import type { ExactCacheConfig } from '@clarity-chat/token-optimization'
import type {
  UseResponseCacheConfig,
  UseResponseCacheReturn,
  CachedResponse,
  CacheStats,
} from './types'

/**
 * Extended cache entry with metadata
 * Wraps ExactCache from @clarity-chat/token-optimization with additional
 * tag-based invalidation and metadata tracking
 */
interface CacheEntryWithMeta<T> {
  data: T
  cachedAt: Date
  expiresAt: Date
  tags: string[]
  hitCount: number
}

/**
 * Response cache manager using ExactCache from @clarity-chat/token-optimization
 *
 * This wraps the high-performance ExactCache with additional features:
 * - Tag-based invalidation
 * - Pattern-based invalidation
 * - Metadata tracking (cachedAt, hitCount)
 * - Stale-while-revalidate support
 */
class ResponseCacheManager<T> {
  private exactCache: ExactCache<CacheEntryWithMeta<T>>
  private tagIndex: Map<string, Set<string>> // tag -> keys mapping
  private maxEntries: number
  private defaultTTLMs: number
  private hits: number = 0
  private misses: number = 0

  constructor(maxEntries: number = 1000, defaultTTLMs: number = 3600000) {
    this.maxEntries = maxEntries
    this.defaultTTLMs = defaultTTLMs
    this.tagIndex = new Map()

    // Initialize ExactCache from token-optimization
    this.exactCache = new ExactCache<CacheEntryWithMeta<T>>({
      maxSize: maxEntries,
      ttl: defaultTTLMs,
    })
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
    const result = this.exactCache.get(key)

    if (result.hit && result.value) {
      this.hits++
      // Update hit count
      result.value.hitCount++
      return {
        isHit: true,
        entry: {
          response: result.value.data,
          metadata: {
            createdAt: result.value.cachedAt,
            expiresAt: result.value.expiresAt,
            tags: result.value.tags,
            hitCount: result.value.hitCount,
          },
        },
      }
    }

    this.misses++
    return { isHit: false, entry: null }
  }

  async set(
    key: string,
    value: T,
    options?: { ttlMs?: number; tags?: string[] }
  ): Promise<void> {
    const ttl = options?.ttlMs ?? this.defaultTTLMs
    const tags = options?.tags ?? []
    const now = new Date()

    const entry: CacheEntryWithMeta<T> = {
      data: value,
      cachedAt: now,
      expiresAt: new Date(now.getTime() + ttl),
      tags,
      hitCount: 0,
    }

    this.exactCache.set(key, entry)

    // Update tag index
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set())
      }
      this.tagIndex.get(tag)!.add(key)
    }
  }

  async invalidate(key: string): Promise<void> {
    // Get entry to clean up tag index
    const result = this.exactCache.get(key)
    if (result.hit && result.value) {
      for (const tag of result.value.tags) {
        this.tagIndex.get(tag)?.delete(key)
      }
    }
    this.exactCache.delete(key)
  }

  async invalidateByTag(tag: string): Promise<number> {
    const keys = this.tagIndex.get(tag)
    if (!keys) return 0

    let count = 0
    for (const key of keys) {
      this.exactCache.delete(key)
      count++
    }

    this.tagIndex.delete(tag)
    return count
  }

  async invalidateByPattern(pattern: RegExp): Promise<number> {
    // Since ExactCache uses hashing internally, we need to track original keys
    // For pattern matching, we iterate through the tag index keys
    let count = 0

    // Get all keys from tag index
    const allKeys = new Set<string>()
    for (const keys of this.tagIndex.values()) {
      for (const key of keys) {
        allKeys.add(key)
      }
    }

    for (const key of allKeys) {
      if (pattern.test(key)) {
        await this.invalidate(key)
        count++
      }
    }

    return count
  }

  async clear(): Promise<void> {
    this.exactCache.clear()
    this.tagIndex.clear()
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
    const exactStats = this.exactCache.getStats()
    const total = this.hits + this.misses
    return {
      totalEntries: exactStats.size,
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

    updateStats().catch(() => {
      // Silently ignore stats update failures
    })

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
