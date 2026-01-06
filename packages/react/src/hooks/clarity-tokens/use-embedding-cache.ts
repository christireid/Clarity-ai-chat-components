'use client'

import * as React from 'react'
import { createEmbeddingManager, EmbeddingManager } from '@clarity-chat/clarity-tokens'
import type { EmbeddingResult } from '@clarity-chat/clarity-tokens'
import type { UseEmbeddingCacheConfig, UseEmbeddingCacheReturn } from './types'

/**
 * useEmbeddingCache - Cached embedding generation with model management
 *
 * Wraps Transformers.js embedding pipeline with LRU caching,
 * deduplication, and IndexedDB persistence. Lazy-loads models
 * on demand with progress callbacks.
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
 *
 * @example
 * ```tsx
 * // Preload embeddings for common content
 * function PreloadedEmbeddings() {
 *   const { isModelLoaded, preloadEmbeddings, cacheStats } = useEmbeddingCache()
 *
 *   useEffect(() => {
 *     if (isModelLoaded) {
 *       preloadEmbeddings([
 *         'frequently asked question 1',
 *         'frequently asked question 2',
 *         // ... more content
 *       ])
 *     }
 *   }, [isModelLoaded])
 *
 *   return (
 *     <span>
 *       Cache: {cacheStats.size} embeddings,
 *       Hit rate: {(cacheStats.hitRate * 100).toFixed(1)}%
 *     </span>
 *   )
 * }
 * ```
 */
export function useEmbeddingCache(
  config: UseEmbeddingCacheConfig = {}
): UseEmbeddingCacheReturn {
  // Manager ref
  const managerRef = React.useRef<EmbeddingManager | null>(null)

  // State
  const [isModelLoaded, setIsModelLoaded] = React.useState(false)
  const [loadProgress, setLoadProgress] = React.useState(0)
  const [cacheStats, setCacheStats] = React.useState({
    size: 0,
    hitRate: 0,
    memoryUsageMB: 0,
  })

  // Initialize manager
  React.useEffect(() => {
    managerRef.current = createEmbeddingManager({
      model: config.model,
      device: config.device,
      cacheSize: config.cacheSize,
      persistCache: config.persistCache,
      batchSize: config.batchSize,
      normalize: config.normalize,
    })

    return () => {
      if (managerRef.current) {
        managerRef.current.unloadModel()
      }
    }
  }, [
    config.model,
    config.device,
    config.cacheSize,
    config.persistCache,
    config.batchSize,
    config.normalize,
  ])

  /**
   * Load embedding model
   */
  const loadModel = React.useCallback(async (): Promise<void> => {
    if (!managerRef.current) return

    try {
      await managerRef.current.loadModel((progress) => {
        setLoadProgress(progress.percent)
      })
      setIsModelLoaded(true)
      setCacheStats(managerRef.current.getCacheStats())
    } catch (error) {
      console.error('Failed to load embedding model:', error)
      throw error
    }
  }, [])

  /**
   * Unload model
   */
  const unloadModel = React.useCallback((): void => {
    if (managerRef.current) {
      managerRef.current.unloadModel()
      setIsModelLoaded(false)
      setLoadProgress(0)
    }
  }, [])

  /**
   * Generate single embedding
   */
  const embed = React.useCallback(
    async (text: string): Promise<EmbeddingResult> => {
      if (!managerRef.current) {
        throw new Error('Embedding manager not initialized')
      }

      const result = await managerRef.current.embed(text)
      setCacheStats(managerRef.current.getCacheStats())

      return result
    },
    []
  )

  /**
   * Batch embed
   */
  const embedBatch = React.useCallback(
    async (texts: string[]): Promise<EmbeddingResult[]> => {
      if (!managerRef.current) {
        throw new Error('Embedding manager not initialized')
      }

      const results = await managerRef.current.embedBatch(texts)
      setCacheStats(managerRef.current.getCacheStats())

      return results
    },
    []
  )

  /**
   * Clear cache
   */
  const clearCache = React.useCallback(async (): Promise<void> => {
    if (!managerRef.current) return
    await managerRef.current.clearCache()
    setCacheStats({
      size: 0,
      hitRate: 0,
      memoryUsageMB: 0,
    })
  }, [])

  /**
   * Preload embeddings
   */
  const preloadEmbeddings = React.useCallback(
    async (texts: string[]): Promise<void> => {
      if (!managerRef.current) return
      await managerRef.current.preloadEmbeddings(texts)
      setCacheStats(managerRef.current.getCacheStats())
    },
    []
  )

  /**
   * Cosine similarity
   */
  const cosineSimilarity = React.useCallback(
    (a: Float32Array, b: Float32Array): number => {
      if (!managerRef.current) {
        throw new Error('Embedding manager not initialized')
      }
      return managerRef.current.cosineSimilarity(a, b)
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
      if (!managerRef.current) {
        throw new Error('Embedding manager not initialized')
      }

      const results = await managerRef.current.findMostSimilar(
        query,
        candidates,
        topK
      )
      setCacheStats(managerRef.current.getCacheStats())

      return results
    },
    []
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
