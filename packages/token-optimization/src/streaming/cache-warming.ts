/**
 * Cache Warming for Streaming Responses
 *
 * Pre-populate cache with partial streaming responses to improve
 * cache hit rates for subsequent similar requests.
 */

import type { StreamingChunk } from './streaming-token-counter'

/**
 * Cache entry for streaming response
 */
export interface StreamingCacheEntry {
  /** Prompt/query */
  prompt: string
  /** Partial or complete response */
  response: string
  /** Timestamp */
  timestamp: number
  /** Is complete */
  isComplete: boolean
  /** Chunk count */
  chunkCount: number
  /** Total tokens */
  totalTokens: number
  /** Metadata */
  metadata?: Record<string, any>
}

/**
 * Cache warming strategy
 */
export type CacheWarmingStrategy =
  | 'incremental' // Cache after each chunk
  | 'threshold' // Cache when chunk count/tokens exceed threshold
  | 'complete' // Only cache complete responses
  | 'periodic' // Cache at regular intervals

/**
 * Cache warming configuration
 */
export interface CacheWarmingConfig {
  /** Caching strategy */
  strategy: CacheWarmingStrategy
  /** Chunk threshold (for 'threshold' strategy) */
  chunkThreshold?: number
  /** Token threshold (for 'threshold' strategy) */
  tokenThreshold?: number
  /** Period in chunks (for 'periodic' strategy) */
  period?: number
  /** Include incomplete responses */
  cacheIncomplete?: boolean
  /** TTL for cache entries (ms) */
  ttl?: number
  /** Custom cache key generator */
  keyGenerator?: (prompt: string) => string
}

/**
 * Cache Warmer
 *
 * Manages cache warming during streaming responses.
 */
export class CacheWarmer {
  private config: Required<CacheWarmingConfig>
  private cache: Map<string, StreamingCacheEntry>
  private chunksSinceLastCache: number = 0

  constructor(
    private cacheStore: Map<string, any>,
    config: CacheWarmingConfig
  ) {
    this.config = {
      strategy: config.strategy,
      chunkThreshold: config.chunkThreshold ?? 5,
      tokenThreshold: config.tokenThreshold ?? 100,
      period: config.period ?? 10,
      cacheIncomplete: config.cacheIncomplete ?? true,
      ttl: config.ttl ?? 3600000, // 1 hour default
      keyGenerator: config.keyGenerator ?? ((prompt) => this.hashPrompt(prompt)),
    }

    this.cache = new Map()
  }

  /**
   * Process streaming chunk and update cache
   */
  processChunk(
    prompt: string,
    chunk: StreamingChunk,
    totalTokens: number
  ): { cached: boolean; key?: string } {
    const key = this.config.keyGenerator(prompt)

    // Determine if we should cache based on strategy
    const shouldCache = this.shouldCache(chunk, totalTokens)

    if (shouldCache) {
      const entry: StreamingCacheEntry = {
        prompt,
        response: chunk.cumulative,
        timestamp: Date.now(),
        isComplete: chunk.isFinal,
        chunkCount: chunk.sequence + 1,
        totalTokens,
        metadata: chunk.metadata,
      }

      this.cache.set(key, entry)
      this.cacheStore.set(key, entry)

      this.chunksSinceLastCache = 0

      return { cached: true, key }
    }

    this.chunksSinceLastCache++

    return { cached: false }
  }

  /**
   * Determine if chunk should be cached
   */
  private shouldCache(chunk: StreamingChunk, totalTokens: number): boolean {
    switch (this.config.strategy) {
      case 'incremental':
        // Cache every chunk
        return true

      case 'threshold':
        // Cache when thresholds exceeded
        return (
          chunk.sequence >= this.config.chunkThreshold ||
          totalTokens >= this.config.tokenThreshold
        )

      case 'complete':
        // Only cache final chunk
        return chunk.isFinal

      case 'periodic':
        // Cache periodically
        return this.chunksSinceLastCache >= this.config.period || chunk.isFinal

      default:
        return false
    }
  }

  /**
   * Get cached response
   */
  get(prompt: string): StreamingCacheEntry | undefined {
    const key = this.config.keyGenerator(prompt)
    const entry = this.cache.get(key)

    // Check TTL
    if (entry && Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key)
      this.cacheStore.delete(key)
      return undefined
    }

    return entry
  }

  /**
   * Check if prompt has cached response
   */
  has(prompt: string): boolean {
    return this.get(prompt) !== undefined
  }

  /**
   * Clear expired entries
   */
  clearExpired(): number {
    const now = Date.now()
    let cleared = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key)
        this.cacheStore.delete(key)
        cleared++
      }
    }

    return cleared
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalEntries: number
    completeEntries: number
    incompleteEntries: number
    averageTokens: number
    averageChunks: number
  } {
    const entries = Array.from(this.cache.values())

    return {
      totalEntries: entries.length,
      completeEntries: entries.filter((e) => e.isComplete).length,
      incompleteEntries: entries.filter((e) => !e.isComplete).length,
      averageTokens:
        entries.length > 0
          ? entries.reduce((sum, e) => sum + e.totalTokens, 0) / entries.length
          : 0,
      averageChunks:
        entries.length > 0
          ? entries.reduce((sum, e) => sum + e.chunkCount, 0) / entries.length
          : 0,
    }
  }

  /**
   * Simple hash for prompt
   */
  private hashPrompt(prompt: string): string {
    let hash = 0
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `prompt_${hash.toString(36)}`
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear()
    // Note: We don't clear the external cacheStore here
    // as it might be shared across multiple warmers
  }
}

/**
 * Prefetcher for predictive cache warming
 */
export class StreamingPrefetcher {
  private prefetchQueue: Set<string> = new Set()
  private warmer: CacheWarmer

  constructor(
    cacheStore: Map<string, any>,
    private config: CacheWarmingConfig
  ) {
    this.warmer = new CacheWarmer(cacheStore, config)
  }

  /**
   * Prefetch likely next prompts
   */
  async prefetch(
    prompts: string[],
    fetchFn: (prompt: string) => AsyncIterable<StreamingChunk>
  ): Promise<void> {
    for (const prompt of prompts) {
      if (!this.prefetchQueue.has(prompt) && !this.warmer.has(prompt)) {
        this.prefetchQueue.add(prompt)
        this.prefetchSingle(prompt, fetchFn).finally(() => {
          this.prefetchQueue.delete(prompt)
        })
      }
    }
  }

  /**
   * Prefetch single prompt
   */
  private async prefetchSingle(
    prompt: string,
    fetchFn: (prompt: string) => AsyncIterable<StreamingChunk>
  ): Promise<void> {
    try {
      const stream = fetchFn(prompt)
      let totalTokens = 0

      for await (const chunk of stream) {
        totalTokens += chunk.content.length / 4 // Rough estimation

        this.warmer.processChunk(prompt, chunk, totalTokens)

        // Stop after first chunk for prefetch (partial caching)
        if (chunk.sequence >= 5) break
      }
    } catch (error) {
      // Silently fail prefetch
      console.warn('Prefetch failed:', error)
    }
  }
}

/**
 * Helper to create cache warmer
 */
export function createCacheWarmer(
  strategy: CacheWarmingStrategy = 'periodic',
  options?: Partial<CacheWarmingConfig>
): {
  warmer: CacheWarmer
  cacheStore: Map<string, StreamingCacheEntry>
} {
  const cacheStore = new Map<string, StreamingCacheEntry>()

  const warmer = new CacheWarmer(cacheStore, {
    strategy,
    ...options,
  })

  return { warmer, cacheStore }
}
