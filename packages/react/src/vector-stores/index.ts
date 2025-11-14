/**
 * Vector Stores - Enterprise RAG Infrastructure
 *
 * Unified interface for multiple vector databases enabling seamless switching
 * between providers without code changes.
 *
 * @example
 * ```tsx
 * // Pinecone
 * const store = createVectorStore({
 *   provider: 'pinecone',
 *   apiKey: process.env.PINECONE_API_KEY,
 *   environment: 'us-east1-gcp',
 *   indexName: 'my-index',
 * })
 *
 * // Qdrant
 * const store = createVectorStore({
 *   provider: 'qdrant',
 *   endpoint: 'https://xyz.qdrant.io',
 *   apiKey: process.env.QDRANT_API_KEY,
 *   indexName: 'my-collection',
 * })
 *
 * // Usage (same for all providers)
 * await store.initialize()
 * await store.upsert(vectors)
 * const results = await store.query({ vector, topK: 10 })
 * ```
 */

export * from './types'
export * from './pinecone'
export * from './qdrant'
export * from './weaviate'
export * from './chroma'
export * from './react'

import type { VectorStore, VectorStoreConfig } from './types'
import { PineconeVectorStore } from './pinecone'
import { QdrantVectorStore } from './qdrant'
import { WeaviateVectorStore } from './weaviate'
import { ChromaVectorStore } from './chroma'

/**
 * Create a vector store instance
 *
 * Factory function that creates the appropriate vector store based on provider
 *
 * @example
 * ```tsx
 * const store = createVectorStore({
 *   provider: 'pinecone',
 *   apiKey: process.env.PINECONE_API_KEY,
 *   environment: 'us-east1-gcp',
 *   indexName: 'documents',
 * })
 *
 * await store.initialize()
 * ```
 */
export function createVectorStore(config: VectorStoreConfig): VectorStore {
  switch (config.provider) {
    case 'pinecone':
      return new PineconeVectorStore(config as any)

    case 'qdrant':
      return new QdrantVectorStore(config as any)

    case 'weaviate':
      return new WeaviateVectorStore(config as any)

    case 'chroma':
      return new ChromaVectorStore(config as any)

    default:
      throw new Error(`Unsupported vector store provider: ${config.provider}`)
  }
}

/**
 * Vector store utilities
 */
export const VectorStoreUtils = {
  /**
   * Batch vectors for efficient upload
   */
  batchVectors(vectors: any[], batchSize: number): any[][] {
    const batches: any[][] = []
    for (let i = 0; i < vectors.length; i += batchSize) {
      batches.push(vectors.slice(i, i + batchSize))
    }
    return batches
  },

  /**
   * Generate a unique vector ID
   */
  generateId(): string {
    return `vec-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
  },

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same dimension')
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      const aVal = a[i] ?? 0
      const bVal = b[i] ?? 0
      dotProduct += aVal * bVal
      normA += aVal * aVal
      normB += bVal * bVal
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  },

  /**
   * Calculate euclidean distance between two vectors
   */
  euclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must have same dimension')
    }

    let sum = 0
    for (let i = 0; i < a.length; i++) {
      const aVal = a[i] ?? 0
      const bVal = b[i] ?? 0
      const diff = aVal - bVal
      sum += diff * diff
    }

    return Math.sqrt(sum)
  },

  /**
   * Normalize a vector to unit length
   */
  normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return magnitude === 0 ? vector : vector.map((val) => val / magnitude)
  },
}
