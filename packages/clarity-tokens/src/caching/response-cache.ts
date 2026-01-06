/**
 * Response Cache - Intelligent response caching with TTL and invalidation
 *
 * Provides exact-match response caching with configurable TTL,
 * tag-based invalidation, and stale-while-revalidate support.
 */

import { LRUCache } from 'lru-cache'
import type {
  CacheEntry,
  CacheSearchResult,
  CacheStats,
  ResponseCacheConfig,
} from '../types'
import {
  generateId,
  storeResponseCache,
  getResponseCache,
  cleanupExpiredResponseCache,
  invalidateResponseCacheByTag,
  getResponseCacheStats,
  isIndexedDBAvailable,
} from '../core/storage'

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<ResponseCacheConfig> = {
  defaultTTLMs: 3600000, // 1 hour
  maxEntries: 500,
  storageBackend: 'indexeddb',
  staleWhileRevalidate: true,
  staleMaxAgeMs: 86400000, // 24 hours
  dbName: 'clarity-tokens',
}

/**
 * Response cache statistics tracker
 */
interface StatsTracker {
  hits: number
  misses: number
  staleHits: number
  totalSearchTimeMs: number
  searchCount: number
}

/**
 * Response Cache Manager
 *
 * Manages caching of LLM responses with exact-match lookup,
 * TTL expiration, and stale-while-revalidate support.
 */
export class ResponseCacheManager<T = string> {
  private config: Required<ResponseCacheConfig>
  private memoryCache: LRUCache<string, CacheEntry<T>>
  private stats: StatsTracker

  constructor(config: ResponseCacheConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }

    // Adjust storage backend if IndexedDB unavailable
    if (
      this.config.storageBackend === 'indexeddb' &&
      !isIndexedDBAvailable()
    ) {
      this.config.storageBackend = 'memory'
    }

    this.memoryCache = new LRUCache<string, CacheEntry<T>>({
      max: this.config.maxEntries,
      ttl: this.config.defaultTTLMs,
    })

    this.stats = {
      hits: 0,
      misses: 0,
      staleHits: 0,
      totalSearchTimeMs: 0,
      searchCount: 0,
    }
  }

  /**
   * Generate cache key from prompt
   */
  private getCacheKey(prompt: string): string {
    // Simple hash for memory cache key
    let hash = 0
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `cache_${Math.abs(hash).toString(36)}_${prompt.length}`
  }

  /**
   * Search for cached response
   */
  async search(prompt: string): Promise<CacheSearchResult<T>> {
    const startTime = performance.now()

    // Check memory cache first
    const cacheKey = this.getCacheKey(prompt)
    const memoryEntry = this.memoryCache.get(cacheKey)

    if (memoryEntry && memoryEntry.prompt === prompt) {
      const searchTimeMs = performance.now() - startTime
      this.stats.hits++
      this.stats.totalSearchTimeMs += searchTimeMs
      this.stats.searchCount++

      // Check if stale
      const now = new Date()
      const isStale =
        memoryEntry.metadata.expiresAt &&
        memoryEntry.metadata.expiresAt < now

      if (isStale && !this.config.staleWhileRevalidate) {
        // Entry is stale and SWR is disabled
        this.memoryCache.delete(cacheKey)
        this.stats.misses++
        this.stats.hits--
        return {
          entry: null,
          similarity: 0,
          isHit: false,
          searchTimeMs,
        }
      }

      if (isStale) {
        this.stats.staleHits++
      }

      return {
        entry: memoryEntry,
        similarity: 1.0, // Exact match
        isHit: true,
        searchTimeMs,
      }
    }

    // Check persistent storage
    if (this.config.storageBackend === 'indexeddb') {
      try {
        const storedEntry = await getResponseCache(prompt, this.config.dbName)
        if (storedEntry) {
          const searchTimeMs = performance.now() - startTime
          this.stats.hits++
          this.stats.totalSearchTimeMs += searchTimeMs
          this.stats.searchCount++

          // Add to memory cache
          this.memoryCache.set(cacheKey, storedEntry as CacheEntry<T>)

          return {
            entry: storedEntry as CacheEntry<T>,
            similarity: 1.0,
            isHit: true,
            searchTimeMs,
          }
        }
      } catch {
        // IndexedDB error, continue with miss
      }
    }

    const searchTimeMs = performance.now() - startTime
    this.stats.misses++
    this.stats.totalSearchTimeMs += searchTimeMs
    this.stats.searchCount++

    return {
      entry: null,
      similarity: 0,
      isHit: false,
      searchTimeMs,
    }
  }

  /**
   * Store response in cache
   */
  async set(
    prompt: string,
    response: T,
    options?: {
      ttlMs?: number
      tags?: string[]
      model?: string
      tokensSaved?: number
    }
  ): Promise<string> {
    const id = generateId()
    const now = new Date()
    const ttl = options?.ttlMs ?? this.config.defaultTTLMs

    const entry: CacheEntry<T> = {
      id,
      prompt,
      response,
      metadata: {
        model: options?.model ?? 'unknown',
        tokensSaved: options?.tokensSaved ?? 0,
        createdAt: now,
        expiresAt: new Date(now.getTime() + ttl),
        hitCount: 0,
        lastAccessed: now,
        tags: options?.tags,
      },
    }

    // Store in memory cache
    const cacheKey = this.getCacheKey(prompt)
    this.memoryCache.set(cacheKey, entry, { ttl })

    // Store in persistent storage
    if (this.config.storageBackend === 'indexeddb') {
      try {
        await storeResponseCache(
          entry as CacheEntry<string>,
          this.config.dbName
        )
      } catch {
        // IndexedDB error, continue with memory-only
      }
    }

    return id
  }

  /**
   * Get or revalidate with stale-while-revalidate pattern
   */
  async getOrRevalidate(
    prompt: string,
    revalidate: () => Promise<T>,
    options?: {
      ttlMs?: number
      tags?: string[]
      model?: string
      tokensSaved?: number
    }
  ): Promise<{ data: T; source: 'cache' | 'fresh' | 'stale' }> {
    const result = await this.search(prompt)

    if (result.isHit && result.entry) {
      const now = new Date()
      const isStale =
        result.entry.metadata.expiresAt &&
        result.entry.metadata.expiresAt < now

      if (isStale && this.config.staleWhileRevalidate) {
        // Return stale data and revalidate in background
        void revalidate().then(async (freshData) => {
          await this.set(prompt, freshData, options)
        })

        return {
          data: result.entry.response,
          source: 'stale',
        }
      }

      return {
        data: result.entry.response,
        source: 'cache',
      }
    }

    // Cache miss, fetch fresh data
    const freshData = await revalidate()
    await this.set(prompt, freshData, options)

    return {
      data: freshData,
      source: 'fresh',
    }
  }

  /**
   * Invalidate cache entry by prompt
   */
  async invalidate(prompt: string): Promise<void> {
    const cacheKey = this.getCacheKey(prompt)
    this.memoryCache.delete(cacheKey)
  }

  /**
   * Invalidate cache entries by tag
   */
  async invalidateByTag(tag: string): Promise<number> {
    // Can't easily filter memory cache by tag, so just clear it
    // In practice, tags are mainly useful for persistent storage
    if (this.config.storageBackend === 'indexeddb') {
      try {
        return await invalidateResponseCacheByTag(tag, this.config.dbName)
      } catch {
        return 0
      }
    }
    return 0
  }

  /**
   * Invalidate cache entries matching pattern
   */
  async invalidateByPattern(pattern: RegExp): Promise<number> {
    let count = 0

    // Clear matching entries from memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (pattern.test(entry.prompt)) {
        this.memoryCache.delete(key)
        count++
      }
    }

    return count
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.memoryCache.clear()
    this.stats = {
      hits: 0,
      misses: 0,
      staleHits: 0,
      totalSearchTimeMs: 0,
      searchCount: 0,
    }
  }

  /**
   * Cleanup expired entries
   */
  async cleanup(): Promise<number> {
    if (this.config.storageBackend === 'indexeddb') {
      try {
        return await cleanupExpiredResponseCache(this.config.dbName)
      } catch {
        return 0
      }
    }
    return 0
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    const persistentStats =
      this.config.storageBackend === 'indexeddb'
        ? await getResponseCacheStats(this.config.dbName).catch(() => ({
            totalEntries: 0,
            totalTokensSaved: 0,
          }))
        : { totalEntries: 0, totalTokensSaved: 0 }

    const totalRequests = this.stats.hits + this.stats.misses

    return {
      totalEntries: this.memoryCache.size + persistentStats.totalEntries,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      totalTokensSaved: persistentStats.totalTokensSaved,
      totalCostSaved: 0, // Calculated externally based on model pricing
      avgSearchTimeMs:
        this.stats.searchCount > 0
          ? this.stats.totalSearchTimeMs / this.stats.searchCount
          : 0,
      memoryUsageMB: this.memoryCache.size * 0.002, // Rough estimate
    }
  }
}

/**
 * Create a response cache manager with configuration
 */
export function createResponseCache<T = string>(
  config?: ResponseCacheConfig
): ResponseCacheManager<T> {
  return new ResponseCacheManager<T>(config)
}
