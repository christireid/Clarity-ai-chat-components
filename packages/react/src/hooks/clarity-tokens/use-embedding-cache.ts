'use client'

import * as React from 'react'
import type {
  UseEmbeddingCacheConfig,
  UseEmbeddingCacheReturn,
  EmbeddingResult,
} from './types'

/**
 * Simple LRU cache for embeddings
 *
 * This is a standalone cache implementation optimized for embedding vectors.
 * Note: The @clarity-chat/token-optimization package focuses on token counting,
 * caching LLM responses, and compression - it does not include embedding utilities.
 * This hook provides a complete embedding solution with LRU caching.
 */
class EmbeddingCache {
  private cache: Map<string, { embedding: Float32Array; timestamp: number }>
  private maxSize: number
  private hits: number = 0
  private misses: number = 0

  constructor(maxSize: number = 1000) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  get(key: string): Float32Array | null {
    const entry = this.cache.get(key)
    if (entry) {
      this.hits++
      // Refresh position (LRU)
      this.cache.delete(key)
      this.cache.set(key, entry)
      return entry.embedding
    }
    this.misses++
    return null
  }

  set(key: string, embedding: Float32Array): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
      }
    }
    this.cache.set(key, { embedding, timestamp: Date.now() })
  }

  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  getStats() {
    const total = this.hits + this.misses
    return {
      size: this.cache.size,
      hitRate: total > 0 ? this.hits / total : 0,
      memoryUsageMB: (this.cache.size * 384 * 4) / (1024 * 1024), // Estimate: 384 dims * 4 bytes
    }
  }
}

/**
 * Cosine similarity between two vectors
 *
 * Computes the cosine similarity between two Float32Array vectors.
 * Returns a value between -1 and 1, where 1 means identical direction,
 * 0 means orthogonal, and -1 means opposite direction.
 *
 * @param a - First vector
 * @param b - Second vector (must have same length as a)
 * @returns Cosine similarity score
 * @throws Error if vectors have different lengths
 */
function cosineSimilarityFn(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom > 0 ? dotProduct / denom : 0
}

/**
 * useEmbeddingCache - Cached embedding generation with model management
 *
 * Provides LRU caching for embeddings with deduplication and lazy model loading.
 * Supports Transformers.js models for client-side embedding generation.
 *
 * **Note on token-optimization integration:**
 * This hook is standalone and does not use @clarity-chat/token-optimization.
 * The token-optimization package focuses on:
 * - Token counting (AccurateTokenCounter)
 * - Response caching (ExactCache, TieredCache)
 * - Prompt compression (LLMLingua, Extractive, Adaptive)
 *
 * Embedding generation requires different infrastructure (ML models, WASM/WebGPU)
 * and is handled separately by this hook using @xenova/transformers.
 *
 * **Features:**
 * - Lazy model loading (only loads when needed)
 * - LRU caching for deduplication
 * - Batch embedding support
 * - Similarity search utilities
 * - Fallback to hash-based pseudo-embeddings when Transformers.js is unavailable
 *
 * @param config - Configuration options
 * @returns Embedding utilities and cache statistics
 *
 * @example
 * ```tsx
 * function SemanticSearch() {
 *   const {
 *     embed,
 *     embedBatch,
 *     isModelLoaded,
 *     loadProgress,
 *     loadModel,
 *     findMostSimilar,
 *   } = useEmbeddingCache({
 *     model: 'Xenova/all-MiniLM-L6-v2',
 *     device: 'auto',
 *     persistCache: true,
 *   })
 *
 *   useEffect(() => {
 *     loadModel()
 *   }, [])
 *
 *   const handleSearch = async (query: string) => {
 *     const results = await findMostSimilar(query, documents, 5)
 *     return results
 *   }
 *
 *   return (
 *     <div>
 *       {!isModelLoaded && (
 *         <progress value={loadProgress} max={100}>
 *           Loading model: {loadProgress}%
 *         </progress>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useEmbeddingCache(
  config: UseEmbeddingCacheConfig = {}
): UseEmbeddingCacheReturn {
  // Cache ref
  const cacheRef = React.useRef<EmbeddingCache | null>(null)

  // Pipeline ref for Transformers.js (lazy loaded)
  const pipelineRef = React.useRef<
    ((text: string) => Promise<Float32Array>) | null
  >(null)

  // State
  const [isModelLoaded, setIsModelLoaded] = React.useState(false)
  const [loadProgress, setLoadProgress] = React.useState(0)
  const [cacheStats, setCacheStats] = React.useState({
    size: 0,
    hitRate: 0,
    memoryUsageMB: 0,
  })

  // Initialize cache
  React.useEffect(() => {
    cacheRef.current = new EmbeddingCache(config.cacheSize ?? 1000)

    return () => {
      if (cacheRef.current) {
        cacheRef.current.clear()
      }
    }
  }, [config.cacheSize])

  /**
   * Load embedding model
   * Note: This is a placeholder. For real Transformers.js integration,
   * you would dynamically import @xenova/transformers here.
   */
  const loadModel = React.useCallback(async (): Promise<void> => {
    try {
      setLoadProgress(10)

      // Attempt to dynamically load Transformers.js
      // This allows the hook to work even if the package isn't installed
      try {
        // @ts-expect-error - Optional dependency, may not be installed
        const { pipeline } = await import('@xenova/transformers')
        setLoadProgress(50)

        const extractor = await pipeline(
          'feature-extraction',
          config.model ?? 'Xenova/all-MiniLM-L6-v2'
        )
        setLoadProgress(90)

        pipelineRef.current = async (text: string): Promise<Float32Array> => {
          const output = await extractor(text, {
            pooling: 'mean',
            normalize: config.normalize ?? true,
          })
          return new Float32Array(output.data)
        }

        setLoadProgress(100)
        setIsModelLoaded(true)
      } catch {
        // Transformers.js not available - use fallback
        console.warn('Transformers.js not available, using fallback embedding')

        // Simple hash-based pseudo-embedding (for demo/testing purposes only)
        pipelineRef.current = async (text: string): Promise<Float32Array> => {
          const embedding = new Float32Array(384)
          let hash = 0
          for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i)
            hash = hash & hash
          }
          for (let i = 0; i < 384; i++) {
            embedding[i] = Math.sin(hash * (i + 1) * 0.01) * 0.5
          }
          // Normalize
          const norm = Math.sqrt(
            embedding.reduce((sum, val) => sum + val * val, 0)
          )
          if (norm > 0) {
            for (let i = 0; i < embedding.length; i++) {
              embedding[i] /= norm
            }
          }
          return embedding
        }

        setLoadProgress(100)
        setIsModelLoaded(true)
      }
    } catch (error) {
      console.error('Failed to load embedding model:', error)
      throw error
    }
  }, [config.model, config.normalize])

  /**
   * Unload model
   */
  const unloadModel = React.useCallback((): void => {
    pipelineRef.current = null
    setIsModelLoaded(false)
    setLoadProgress(0)
  }, [])

  /**
   * Generate single embedding
   */
  const embed = React.useCallback(
    async (text: string): Promise<EmbeddingResult> => {
      if (!pipelineRef.current) {
        throw new Error('Embedding model not loaded. Call loadModel() first.')
      }

      // Check cache
      const cached = cacheRef.current?.get(text)
      if (cached) {
        setCacheStats(
          cacheRef.current?.getStats() ?? {
            size: 0,
            hitRate: 0,
            memoryUsageMB: 0,
          }
        )
        return {
          embedding: cached,
          text,
          tokenCount: Math.ceil(text.length / 4),
          cached: true,
        }
      }

      // Generate embedding
      const embedding = await pipelineRef.current(text)

      // Store in cache
      cacheRef.current?.set(text, embedding)
      setCacheStats(
        cacheRef.current?.getStats() ?? {
          size: 0,
          hitRate: 0,
          memoryUsageMB: 0,
        }
      )

      return {
        embedding,
        text,
        tokenCount: Math.ceil(text.length / 4),
        cached: false,
      }
    },
    []
  )

  /**
   * Batch embed
   */
  const embedBatch = React.useCallback(
    async (texts: string[]): Promise<EmbeddingResult[]> => {
      return Promise.all(texts.map((text) => embed(text)))
    },
    [embed]
  )

  /**
   * Clear cache
   */
  const clearCache = React.useCallback(async (): Promise<void> => {
    cacheRef.current?.clear()
    setCacheStats({ size: 0, hitRate: 0, memoryUsageMB: 0 })
  }, [])

  /**
   * Preload embeddings
   */
  const preloadEmbeddings = React.useCallback(
    async (texts: string[]): Promise<void> => {
      await embedBatch(texts)
    },
    [embedBatch]
  )

  /**
   * Cosine similarity
   */
  const cosineSimilarity = React.useCallback(
    (a: Float32Array, b: Float32Array): number => {
      return cosineSimilarityFn(a, b)
    },
    []
  )

  /**
   * Find most similar
   */
  const findMostSimilar = React.useCallback(
    async (
      query: string,
      candidates: string[],
      topK = 5
    ): Promise<Array<{ text: string; similarity: number }>> => {
      const queryResult = await embed(query)
      const queryEmbedding = queryResult.embedding

      const candidateResults = await embedBatch(candidates)

      const similarities = candidateResults.map((result, i) => ({
        text: candidates[i],
        similarity: cosineSimilarityFn(queryEmbedding, result.embedding),
      }))

      // Sort by similarity descending and take top K
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK)
    },
    [embed, embedBatch]
  )

  return {
    embed,
    embedBatch,
    isModelLoaded,
    loadProgress,
    loadModel,
    unloadModel,
    cacheStats,
    clearCache,
    preloadEmbeddings,
    cosineSimilarity,
    findMostSimilar,
  }
}
