/**
 * Embedding Manager - Client-side embedding generation
 *
 * Provides embedding generation with caching, batching, and
 * optional persistence. Uses Transformers.js for client-side
 * inference when available.
 */

import { LRUCache } from 'lru-cache'
import type { EmbeddingResult, EmbeddingCacheConfig } from '../types'
import {
  storeEmbedding,
  getEmbedding,
  clearEmbeddingCache as clearStoredEmbeddings,
  isIndexedDBAvailable,
} from '../core/storage'

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<EmbeddingCacheConfig> = {
  model: 'Xenova/all-MiniLM-L6-v2',
  device: 'auto',
  cacheSize: 5000,
  persistCache: true,
  batchSize: 32,
  normalize: true,
}

/**
 * Transformer pipeline type (from @huggingface/transformers)
 */
type Pipeline = {
  (texts: string | string[], options?: { pooling?: string; normalize?: boolean }): Promise<{
    data: Float32Array
  }>
}

/**
 * Embedding Manager
 *
 * Manages embedding generation with caching and optional
 * Transformers.js integration for client-side inference.
 */
export class EmbeddingManager {
  private config: Required<EmbeddingCacheConfig>
  private memoryCache: LRUCache<string, Float32Array>
  private pipeline: Pipeline | null = null
  private isLoading = false
  private loadProgress = 0
  private dimensions = 384 // Default for MiniLM
  private stats = {
    hits: 0,
    misses: 0,
    totalTimeMs: 0,
    embedCount: 0,
  }

  constructor(config: EmbeddingCacheConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }

    if (this.config.persistCache && !isIndexedDBAvailable()) {
      this.config.persistCache = false
    }

    this.memoryCache = new LRUCache<string, Float32Array>({
      max: this.config.cacheSize,
    })
  }

  /**
   * Get cache key for text
   */
  private getCacheKey(text: string): string {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return `emb_${this.config.model}_${Math.abs(hash).toString(36)}`
  }

  /**
   * L2 normalize a vector
   */
  private normalizeVector(vec: Float32Array): Float32Array {
    let norm = 0
    for (let i = 0; i < vec.length; i++) {
      norm += vec[i] * vec[i]
    }
    norm = Math.sqrt(norm)

    if (norm === 0) return vec

    const normalized = new Float32Array(vec.length)
    for (let i = 0; i < vec.length; i++) {
      normalized[i] = vec[i] / norm
    }
    return normalized
  }

  /**
   * Load the embedding model
   */
  async loadModel(
    progressCallback?: (progress: { stage: string; percent: number }) => void
  ): Promise<void> {
    if (this.pipeline || this.isLoading) {
      return
    }

    this.isLoading = true
    this.loadProgress = 0

    try {
      // Dynamically import Transformers.js
      const { pipeline, env } = await import('@huggingface/transformers')

      // Configure environment
      if (this.config.device === 'webgpu') {
        env.backends.onnx.wasm.numThreads = 1
      }

      progressCallback?.({ stage: 'loading', percent: 10 })
      this.loadProgress = 10

      // Create feature extraction pipeline
      this.pipeline = await pipeline('feature-extraction', this.config.model, {
        progress_callback: (data: { status: string; progress?: number }) => {
          if (data.status === 'progress' && data.progress) {
            const percent = Math.round(10 + data.progress * 0.9)
            this.loadProgress = percent
            progressCallback?.({ stage: 'downloading', percent })
          }
        },
      }) as Pipeline

      this.loadProgress = 100
      progressCallback?.({ stage: 'ready', percent: 100 })
    } catch (error) {
      this.isLoading = false
      this.loadProgress = 0
      throw new Error(
        `Failed to load embedding model: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }

    this.isLoading = false
  }

  /**
   * Check if model is loaded
   */
  isModelLoaded(): boolean {
    return this.pipeline !== null
  }

  /**
   * Get loading progress (0-100)
   */
  getLoadProgress(): number {
    return this.loadProgress
  }

  /**
   * Generate embedding for text
   */
  async embed(text: string): Promise<EmbeddingResult> {
    const startTime = performance.now()
    const cacheKey = this.getCacheKey(text)

    // Check memory cache
    const cached = this.memoryCache.get(cacheKey)
    if (cached) {
      this.stats.hits++
      return {
        embedding: cached,
        dimensions: cached.length,
        fromCache: true,
        processingTimeMs: performance.now() - startTime,
      }
    }

    // Check persistent cache
    if (this.config.persistCache) {
      const stored = await getEmbedding(text, this.config.model)
      if (stored) {
        this.memoryCache.set(cacheKey, stored)
        this.stats.hits++
        return {
          embedding: stored,
          dimensions: stored.length,
          fromCache: true,
          processingTimeMs: performance.now() - startTime,
        }
      }
    }

    this.stats.misses++

    // Generate embedding
    if (!this.pipeline) {
      throw new Error('Embedding model not loaded. Call loadModel() first.')
    }

    const output = await this.pipeline(text, {
      pooling: 'mean',
      normalize: this.config.normalize,
    })

    let embedding = new Float32Array(output.data)

    if (this.config.normalize && !this.config.normalize) {
      embedding = this.normalizeVector(embedding)
    }

    this.dimensions = embedding.length

    // Cache the embedding
    this.memoryCache.set(cacheKey, embedding)

    if (this.config.persistCache) {
      await storeEmbedding(text, embedding, this.config.model).catch(() => {})
    }

    const processingTimeMs = performance.now() - startTime
    this.stats.totalTimeMs += processingTimeMs
    this.stats.embedCount++

    return {
      embedding,
      dimensions: embedding.length,
      fromCache: false,
      processingTimeMs,
    }
  }

  /**
   * Generate embeddings for multiple texts (batched)
   */
  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = []
    const toEmbed: { index: number; text: string }[] = []

    // Check cache first
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i]
      const cacheKey = this.getCacheKey(text)
      const cached = this.memoryCache.get(cacheKey)

      if (cached) {
        results[i] = {
          embedding: cached,
          dimensions: cached.length,
          fromCache: true,
          processingTimeMs: 0,
        }
        this.stats.hits++
      } else {
        toEmbed.push({ index: i, text })
      }
    }

    // Generate embeddings for uncached texts in batches
    if (toEmbed.length > 0 && this.pipeline) {
      for (let i = 0; i < toEmbed.length; i += this.config.batchSize) {
        const batch = toEmbed.slice(i, i + this.config.batchSize)
        const batchTexts = batch.map((b) => b.text)

        const startTime = performance.now()

        // Note: Some models support batch processing
        for (let j = 0; j < batchTexts.length; j++) {
          const result = await this.embed(batchTexts[j])
          results[batch[j].index] = result
        }

        const batchTime = performance.now() - startTime
        this.stats.totalTimeMs += batchTime
      }
    }

    return results
  }

  /**
   * Unload the model to free memory
   */
  unloadModel(): void {
    this.pipeline = null
    this.loadProgress = 0
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(a: Float32Array, b: Float32Array): number {
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
   * Find most similar texts from candidates
   */
  async findMostSimilar(
    query: string,
    candidates: string[],
    topK = 5
  ): Promise<Array<{ text: string; similarity: number }>> {
    const queryEmbedding = await this.embed(query)
    const candidateEmbeddings = await this.embedBatch(candidates)

    const results = candidates.map((text, i) => ({
      text,
      similarity: this.cosineSimilarity(
        queryEmbedding.embedding,
        candidateEmbeddings[i].embedding
      ),
    }))

    results.sort((a, b) => b.similarity - a.similarity)

    return results.slice(0, topK)
  }

  /**
   * Preload embeddings for texts
   */
  async preloadEmbeddings(texts: string[]): Promise<void> {
    await this.embedBatch(texts)
  }

  /**
   * Clear the embedding cache
   */
  async clearCache(): Promise<void> {
    this.memoryCache.clear()
    if (this.config.persistCache) {
      await clearStoredEmbeddings()
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number
    hitRate: number
    memoryUsageMB: number
    avgEmbedTimeMs: number
  } {
    const total = this.stats.hits + this.stats.misses

    return {
      size: this.memoryCache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      memoryUsageMB:
        (this.memoryCache.size * this.dimensions * 4) / (1024 * 1024),
      avgEmbedTimeMs:
        this.stats.embedCount > 0
          ? this.stats.totalTimeMs / this.stats.embedCount
          : 0,
    }
  }

  /**
   * Get device information
   */
  getDeviceInfo(): {
    hasWebGPU: boolean
    selectedDevice: string
    dimensions: number
    modelName: string
  } {
    const hasWebGPU =
      typeof navigator !== 'undefined' && 'gpu' in navigator

    return {
      hasWebGPU,
      selectedDevice: this.config.device === 'auto'
        ? (hasWebGPU ? 'webgpu' : 'wasm')
        : this.config.device,
      dimensions: this.dimensions,
      modelName: this.config.model,
    }
  }
}

/**
 * Create an embedding manager
 */
export function createEmbeddingManager(
  config?: EmbeddingCacheConfig
): EmbeddingManager {
  return new EmbeddingManager(config)
}

/**
 * Simple embedding function for one-off use
 * (requires model to be loaded externally)
 */
export async function generateEmbedding(
  text: string,
  manager: EmbeddingManager
): Promise<Float32Array> {
  const result = await manager.embed(text)
  return result.embedding
}
