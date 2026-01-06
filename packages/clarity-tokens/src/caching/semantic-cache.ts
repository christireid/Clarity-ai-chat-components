/**
 * Semantic Cache - Similarity-based response caching
 *
 * Uses embeddings and cosine similarity to find cached responses
 * for semantically similar queries, achieving 40-60% cache hit rates.
 */

import { LRUCache } from 'lru-cache'
import type {
  SemanticCacheEntry,
  CacheSearchResult,
  CacheStats,
  SemanticCacheConfig,
} from '../types'
import {
  generateId,
  storeSemanticCache,
  getAllSemanticCacheEntries,
  updateSemanticCacheHit,
  isIndexedDBAvailable,
} from '../core/storage'

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<SemanticCacheConfig> = {
  embeddingModel: 'Xenova/all-MiniLM-L6-v2',
  similarityThreshold: 0.92,
  maxCacheSize: 1000,
  ttlMs: 3600000, // 1 hour
  persistToIndexedDB: true,
  dbName: 'clarity-tokens',
}

/**
 * Embedding function type
 */
export type EmbeddingFunction = (text: string) => Promise<Float32Array>

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same dimensions')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  if (denominator === 0) return 0

  return dotProduct / denominator
}

/**
 * Semantic Cache Manager
 *
 * Provides similarity-based caching for LLM responses using embeddings.
 * When a query is semantically similar to a cached query, returns the
 * cached response instead of making a new API call.
 */
export class SemanticCacheManager<T = string> {
  private config: Required<SemanticCacheConfig>
  private embeddings: Map<string, Float32Array>
  private entries: LRUCache<string, SemanticCacheEntry<T>>
  private embedFunction: EmbeddingFunction | null = null
  private stats: {
    hits: number
    misses: number
    totalSearchTimeMs: number
    searchCount: number
  }
  private isReady = false

  constructor(config: SemanticCacheConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }

    // Disable persistence if IndexedDB unavailable
    if (this.config.persistToIndexedDB && !isIndexedDBAvailable()) {
      this.config.persistToIndexedDB = false
    }

    this.embeddings = new Map()
    this.entries = new LRUCache<string, SemanticCacheEntry<T>>({
      max: this.config.maxCacheSize,
      ttl: this.config.ttlMs,
    })

    this.stats = {
      hits: 0,
      misses: 0,
      totalSearchTimeMs: 0,
      searchCount: 0,
    }
  }

  /**
   * Initialize cache with embedding function
   *
   * The embedding function should be provided by the consuming application,
   * typically using Transformers.js or a similar library.
   */
  async initialize(embedFunction: EmbeddingFunction): Promise<void> {
    this.embedFunction = embedFunction

    // Load persisted entries
    if (this.config.persistToIndexedDB) {
      try {
        const storedEntries = await getAllSemanticCacheEntries(
          this.config.dbName
        )
        for (const entry of storedEntries) {
          this.entries.set(entry.id, entry as SemanticCacheEntry<T>)
          this.embeddings.set(entry.id, entry.embedding)
        }
      } catch {
        // IndexedDB error, continue with empty cache
      }
    }

    this.isReady = true
  }

  /**
   * Check if cache is ready
   */
  getIsReady(): boolean {
    return this.isReady
  }

  /**
   * Search for semantically similar cached response
   */
  async search(prompt: string): Promise<CacheSearchResult<T>> {
    const startTime = performance.now()

    if (!this.embedFunction) {
      throw new Error('Semantic cache not initialized. Call initialize() first.')
    }

    // Generate embedding for query
    let queryEmbedding: Float32Array
    try {
      queryEmbedding = await this.embedFunction(prompt)
    } catch {
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

    // Search for most similar entry
    let bestMatch: SemanticCacheEntry<T> | null = null
    let bestSimilarity = 0

    for (const [id, embedding] of this.embeddings) {
      const similarity = cosineSimilarity(queryEmbedding, embedding)

      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        const entry = this.entries.get(id)
        if (entry) {
          bestMatch = entry
        }
      }
    }

    const searchTimeMs = performance.now() - startTime
    this.stats.totalSearchTimeMs += searchTimeMs
    this.stats.searchCount++

    // Check if best match exceeds threshold
    if (bestMatch && bestSimilarity >= this.config.similarityThreshold) {
      this.stats.hits++

      // Update hit count
      if (this.config.persistToIndexedDB) {
        void updateSemanticCacheHit(bestMatch.id, this.config.dbName).catch(
          () => {}
        )
      }

      return {
        entry: bestMatch,
        similarity: bestSimilarity,
        isHit: true,
        searchTimeMs,
      }
    }

    this.stats.misses++

    return {
      entry: null,
      similarity: bestSimilarity,
      isHit: false,
      searchTimeMs,
    }
  }

  /**
   * Store response with embedding
   */
  async set(
    prompt: string,
    response: T,
    options?: {
      model?: string
      tokensSaved?: number
    }
  ): Promise<string> {
    if (!this.embedFunction) {
      throw new Error('Semantic cache not initialized. Call initialize() first.')
    }

    // Generate embedding
    const embedding = await this.embedFunction(prompt)

    const id = generateId()
    const now = new Date()

    const entry: SemanticCacheEntry<T> = {
      id,
      prompt,
      response,
      embedding,
      metadata: {
        model: options?.model ?? 'unknown',
        tokensSaved: options?.tokensSaved ?? 0,
        createdAt: now,
        expiresAt: new Date(now.getTime() + this.config.ttlMs),
        hitCount: 0,
        lastAccessed: now,
      },
    }

    // Store in memory
    this.entries.set(id, entry)
    this.embeddings.set(id, embedding)

    // Persist to IndexedDB
    if (this.config.persistToIndexedDB) {
      try {
        await storeSemanticCache(
          entry as SemanticCacheEntry<string>,
          this.config.dbName
        )
      } catch {
        // IndexedDB error, continue with memory-only
      }
    }

    return id
  }

  /**
   * Invalidate entry by ID
   */
  async invalidate(id: string): Promise<void> {
    this.entries.delete(id)
    this.embeddings.delete(id)
  }

  /**
   * Invalidate entries similar to prompt
   */
  async invalidateByPrompt(
    prompt: string,
    threshold?: number
  ): Promise<number> {
    if (!this.embedFunction) {
      return 0
    }

    const queryEmbedding = await this.embedFunction(prompt)
    const actualThreshold = threshold ?? this.config.similarityThreshold
    let count = 0

    const toDelete: string[] = []

    for (const [id, embedding] of this.embeddings) {
      const similarity = cosineSimilarity(queryEmbedding, embedding)
      if (similarity >= actualThreshold) {
        toDelete.push(id)
        count++
      }
    }

    for (const id of toDelete) {
      this.entries.delete(id)
      this.embeddings.delete(id)
    }

    return count
  }

  /**
   * Warm cache with pre-computed entries
   */
  async warmCache(
    entries: Array<{ prompt: string; response: T }>
  ): Promise<void> {
    for (const { prompt, response } of entries) {
      await this.set(prompt, response)
    }
  }

  /**
   * Export all cache entries
   */
  exportCache(): SemanticCacheEntry<T>[] {
    return Array.from(this.entries.values())
  }

  /**
   * Import cache entries
   */
  async importCache(entries: SemanticCacheEntry<T>[]): Promise<void> {
    for (const entry of entries) {
      this.entries.set(entry.id, entry)
      this.embeddings.set(entry.id, entry.embedding)

      if (this.config.persistToIndexedDB) {
        await storeSemanticCache(
          entry as SemanticCacheEntry<string>,
          this.config.dbName
        ).catch(() => {})
      }
    }
  }

  /**
   * Update similarity threshold
   */
  updateThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 1) {
      throw new Error('Threshold must be between 0 and 1')
    }
    this.config.similarityThreshold = threshold
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.entries.clear()
    this.embeddings.clear()
    this.stats = {
      hits: 0,
      misses: 0,
      totalSearchTimeMs: 0,
      searchCount: 0,
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses
    let totalTokensSaved = 0

    for (const entry of this.entries.values()) {
      totalTokensSaved += entry.metadata.tokensSaved
    }

    return {
      totalEntries: this.entries.size,
      hitRate: totalRequests > 0 ? this.stats.hits / totalRequests : 0,
      totalTokensSaved,
      totalCostSaved: 0, // Calculated externally
      avgSearchTimeMs:
        this.stats.searchCount > 0
          ? this.stats.totalSearchTimeMs / this.stats.searchCount
          : 0,
      memoryUsageMB: this.entries.size * 0.005, // ~5KB per entry with embedding
    }
  }

  /**
   * Find most similar entries (for debugging/analysis)
   */
  async findSimilar(
    prompt: string,
    topK = 5
  ): Promise<Array<{ entry: SemanticCacheEntry<T>; similarity: number }>> {
    if (!this.embedFunction) {
      return []
    }

    const queryEmbedding = await this.embedFunction(prompt)
    const results: Array<{ entry: SemanticCacheEntry<T>; similarity: number }> =
      []

    for (const [id, embedding] of this.embeddings) {
      const similarity = cosineSimilarity(queryEmbedding, embedding)
      const entry = this.entries.get(id)
      if (entry) {
        results.push({ entry, similarity })
      }
    }

    // Sort by similarity descending
    results.sort((a, b) => b.similarity - a.similarity)

    return results.slice(0, topK)
  }
}

/**
 * Create a semantic cache manager
 */
export function createSemanticCache<T = string>(
  config?: SemanticCacheConfig
): SemanticCacheManager<T> {
  return new SemanticCacheManager<T>(config)
}
