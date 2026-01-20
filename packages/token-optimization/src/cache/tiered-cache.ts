/**
 * TieredCache - Multi-tier caching orchestrator
 *
 * Orchestrates 3 cache tiers for optimal hit rate:
 * - Tier 1 (Exact): O(1) hash lookup for identical queries
 * - Tier 2 (Smart): Pattern matching for parameterized queries
 * - Tier 3 (Semantic): Embedding similarity for paraphrased queries
 *
 * @module tiered-cache
 */

import { ExactCache } from './exact-cache'
import type { ExactCacheConfig } from './exact-cache'
import { SmartCache } from './smart-cache'
import type { SmartCacheConfig } from './smart-cache'
import { AdvancedSemanticCache } from '../caching/advanced-semantic-cache'
import type {
  SemanticCacheConfig,
  CacheContext,
} from '../caching/advanced-semantic-cache'

export interface TieredCacheConfig {
  /** Configuration for exact match cache (Tier 1) */
  exact: ExactCacheConfig
  /** Configuration for pattern match cache (Tier 2) */
  smart: SmartCacheConfig
  /** Configuration for semantic match cache (Tier 3) */
  semantic: SemanticCacheConfig
}

export interface TieredCacheResult {
  /** Whether any tier had a cache hit */
  hit: boolean
  /** Which tier provided the hit */
  tier?: 'exact' | 'smart' | 'semantic'
  /** The cached response data */
  data?: string
  /** Similarity score (for semantic hits) */
  similarity?: number
  /** Lookup latency in milliseconds */
  latency?: number
}

export interface TierStats {
  hits: number
  misses: number
  size: number
}

export interface CacheStats {
  /** Overall cache hit rate */
  hitRate: number
  /** Total hits across all tiers */
  totalHits: number
  /** Total misses (no hit in any tier) */
  totalMisses: number
  /** Size of exact cache */
  exactSize: number
  /** Size of smart cache */
  smartSize: number
  /** Size of semantic cache */
  semanticSize: number
  /** Per-tier statistics */
  tierStats: {
    exact: TierStats
    smart: TierStats
    semantic: TierStats
  }
}

export interface PrefetchItem {
  key: string
  value: string
  metadata?: Record<string, unknown>
}

/**
 * Multi-tier cache providing optimal hit rates through layered lookup
 *
 * @example
 * ```typescript
 * const cache = new TieredCache({
 *   exact: { maxSize: 1000, ttl: 3600000 },
 *   smart: { maxSize: 500, ttl: 3600000 },
 *   semantic: { maxSize: 200, similarityThreshold: 0.92, ... }
 * })
 *
 * await cache.set('What is the weather in Paris?', 'Sunny, 22°C')
 *
 * // Exact hit
 * await cache.get('What is the weather in Paris?')
 * // { hit: true, tier: 'exact', data: 'Sunny, 22°C' }
 *
 * // Smart hit (same pattern)
 * await cache.get('What is the weather in London?')
 * // { hit: true, tier: 'smart', data: 'Sunny, 22°C' }
 *
 * // Semantic hit (similar meaning)
 * await cache.get('Tell me the weather for Paris')
 * // { hit: true, tier: 'semantic', data: 'Sunny, 22°C' }
 * ```
 */
export class TieredCache {
  private exactCache: ExactCache<string>
  private smartCache: SmartCache
  private semanticCache: AdvancedSemanticCache

  private stats = {
    exact: { hits: 0, misses: 0 },
    smart: { hits: 0, misses: 0 },
    semantic: { hits: 0, misses: 0 },
  }

  constructor(config: TieredCacheConfig) {
    this.exactCache = new ExactCache(config.exact)
    this.smartCache = new SmartCache(config.smart)
    this.semanticCache = new AdvancedSemanticCache(config.semantic)
  }

  /**
   * Look up a prompt across all cache tiers
   *
   * @param prompt - The prompt to look up
   * @param context - Optional context for semantic matching
   * @returns Cache result with tier information
   */
  async get(
    prompt: string,
    context?: CacheContext
  ): Promise<TieredCacheResult> {
    const startTime = performance.now()

    // Tier 1: Exact match (< 1ms)
    const exactResult = this.exactCache.get(prompt)
    if (exactResult.hit && exactResult.value) {
      this.stats.exact.hits++
      return {
        hit: true,
        tier: 'exact',
        data: exactResult.value,
        latency: performance.now() - startTime,
      }
    }
    this.stats.exact.misses++

    // Tier 2: Smart pattern match (< 5ms)
    const smartResult = this.smartCache.match(prompt)
    if (smartResult.hit && smartResult.value) {
      this.stats.smart.hits++
      return {
        hit: true,
        tier: 'smart',
        data: smartResult.value,
        latency: performance.now() - startTime,
      }
    }
    this.stats.smart.misses++

    // Tier 3: Semantic similarity (< 50ms)
    const semanticResult = await this.semanticCache.get(prompt, context)
    if (semanticResult.found && semanticResult.entry) {
      this.stats.semantic.hits++
      return {
        hit: true,
        tier: 'semantic',
        data: semanticResult.entry.content,
        similarity: semanticResult.similarityScore,
        latency: performance.now() - startTime,
      }
    }
    this.stats.semantic.misses++

    return {
      hit: false,
      latency: performance.now() - startTime,
    }
  }

  /**
   * Store a prompt-response pair in all cache tiers
   *
   * @param prompt - The prompt
   * @param response - The response to cache
   * @param metadata - Optional metadata
   */
  async set(
    prompt: string,
    response: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    // Populate all tiers for maximum hit potential
    this.exactCache.set(prompt, response)
    this.smartCache.index(prompt, response, metadata)
    await this.semanticCache.set(
      prompt,
      response,
      { qualityScore: 0.95 },
      metadata as CacheContext
    )
  }

  /**
   * Invalidate a specific prompt from the cache
   *
   * Note: Only exact cache supports direct invalidation.
   * Smart and semantic caches rely on TTL and LRU eviction.
   *
   * @param prompt - The prompt to invalidate
   */
  async invalidate(prompt: string): Promise<void> {
    this.exactCache.delete(prompt)
    // Smart and semantic caches don't support direct deletion
    // They will naturally expire via TTL or be evicted via LRU
  }

  /**
   * Prefetch multiple items into the cache
   *
   * @param items - Array of key-value pairs to prefetch
   */
  async prefetch(items: PrefetchItem[]): Promise<void> {
    for (const item of items) {
      await this.set(item.key, item.value, item.metadata)
    }
  }

  /**
   * Clear all cache tiers
   */
  clear(): void {
    this.exactCache.clear()
    this.smartCache.clear()
    this.semanticCache.clear()
    this.stats = {
      exact: { hits: 0, misses: 0 },
      smart: { hits: 0, misses: 0 },
      semantic: { hits: 0, misses: 0 },
    }
  }

  /**
   * Get comprehensive cache statistics
   */
  getStats(): CacheStats {
    const totalHits =
      this.stats.exact.hits + this.stats.smart.hits + this.stats.semantic.hits
    const totalMisses = this.stats.semantic.misses // Only final misses count
    const total = totalHits + totalMisses

    const semanticStats = this.semanticCache.getStats()

    return {
      hitRate: total > 0 ? totalHits / total : 0,
      totalHits,
      totalMisses,
      exactSize: this.exactCache.size,
      smartSize: this.smartCache.size,
      semanticSize: semanticStats.totalEntries,
      tierStats: {
        exact: { ...this.stats.exact, size: this.exactCache.size },
        smart: { ...this.stats.smart, size: this.smartCache.size },
        semantic: { ...this.stats.semantic, size: semanticStats.totalEntries },
      },
    }
  }
}
