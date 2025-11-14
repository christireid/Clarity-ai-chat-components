/**
 * Vector Store Adapter Interface
 * 
 * Provides a unified interface for integrating with various vector databases
 * (Pinecone, Qdrant, Weaviate, etc.) for semantic memory storage and retrieval.
 */

import type { MemoryItem, MemoryVectorMetadata } from './types'

/**
 * Vector store adapter interface
 */
export interface VectorStoreAdapter {
  /**
   * Initialize the vector store connection
   */
  initialize(): Promise<void>

  /**
   * Store a memory item with its embedding
   */
  storeMemory(memory: MemoryItem, embedding: number[]): Promise<void>

  /**
   * Search for similar memories
   */
  similaritySearch(
    queryEmbedding: number[],
    options: {
      userId: string
      k?: number
      minScore?: number
      filter?: Record<string, any>
    }
  ): Promise<MemoryItem[]>

  /**
   * Delete a memory by ID
   */
  deleteMemory(memoryId: string): Promise<void>

  /**
   * Update a memory item
   */
  updateMemory(memory: MemoryItem, embedding?: number[]): Promise<void>

  /**
   * Get memory by ID
   */
  getMemory(memoryId: string): Promise<MemoryItem | null>

  /**
   * Create embedding for text
   */
  createEmbedding(text: string): Promise<number[]>
}

/**
 * Base implementation with common functionality
 */
export abstract class BaseVectorStoreAdapter implements VectorStoreAdapter {
  protected initialized = false

  abstract initialize(): Promise<void>
  abstract storeMemory(memory: MemoryItem, embedding: number[]): Promise<void>
  abstract similaritySearch(
    queryEmbedding: number[],
    options: {
      userId: string
      k?: number
      minScore?: number
      filter?: Record<string, any>
    }
  ): Promise<MemoryItem[]>
  abstract deleteMemory(memoryId: string): Promise<void>
  abstract updateMemory(memory: MemoryItem, embedding?: number[]): Promise<void>
  abstract getMemory(memoryId: string): Promise<MemoryItem | null>
  abstract createEmbedding(text: string): Promise<number[]>

  /**
   * Calculate cosine similarity between two vectors
   */
  protected cosineSimilarity(a: number[], b: number[]): number {
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

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * Normalize vector
   */
  protected normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    if (magnitude === 0) return vector
    return vector.map((val) => val / magnitude)
  }

  /**
   * Create metadata for vector storage
   */
  protected createMetadata(memory: MemoryItem): MemoryVectorMetadata {
    return {
      userId: memory.userId,
      timestamp: memory.lastUpdated.toISOString(),
      chunkIndex: 0,
      totalChunks: 1,
      memoryType: memory.type,
      topic: memory.metadata?.topic,
      sentiment: memory.metadata?.sentiment,
      importanceScore: memory.importanceScore ?? 0,
      scope: memory.scope,
      layer: memory.layer,
    }
  }
}

/**
 * In-memory vector store for development/testing
 */
export class InMemoryVectorStore extends BaseVectorStoreAdapter {
  private memories: Map<string, { memory: MemoryItem; embedding: number[] }> = new Map()

  async initialize(): Promise<void> {
    this.initialized = true
  }

  async storeMemory(memory: MemoryItem, embedding: number[]): Promise<void> {
    this.memories.set(memory.id, { memory, embedding })
  }

  async similaritySearch(
    queryEmbedding: number[],
    options: {
      userId: string
      k?: number
      minScore?: number
      filter?: Record<string, any>
    }
  ): Promise<MemoryItem[]> {
    const { userId, k = 5, minScore = 0.7, filter } = options

    const results: Array<{ memory: MemoryItem; score: number }> = []

    for (const { memory, embedding } of this.memories.values()) {
      // Apply filters
      if (memory.userId !== userId) continue
      
      if (filter) {
        if (filter.scope && !filter.scope.includes(memory.scope)) continue
        if (filter.type && !filter.type.includes(memory.type)) continue
      }

      // Calculate similarity
      const score = this.cosineSimilarity(queryEmbedding, embedding)

      if (score >= minScore) {
        results.push({ memory, score })
      }
    }

    // Sort by score and limit
    results.sort((a, b) => b.score - a.score)
    
    return results.slice(0, k).map((r) => ({
      ...r.memory,
      metadata: {
        ...r.memory.metadata,
        similarityScore: r.score,
      },
    }))
  }

  async deleteMemory(memoryId: string): Promise<void> {
    this.memories.delete(memoryId)
  }

  async updateMemory(memory: MemoryItem, embedding?: number[]): Promise<void> {
    const existing = this.memories.get(memory.id)
    if (existing) {
      this.memories.set(memory.id, {
        memory,
        embedding: embedding ?? existing.embedding,
      })
    }
  }

  async getMemory(memoryId: string): Promise<MemoryItem | null> {
    const stored = this.memories.get(memoryId)
    return stored ? stored.memory : null
  }

  async createEmbedding(text: string): Promise<number[]> {
    // Simple hash-based embedding for development
    // In production, use OpenAI, Cohere, or other embedding API
    const hash = this.simpleHash(text)
    const embedding: number[] = []
    
    for (let i = 0; i < 384; i++) {
      // 384-dimensional embedding (sentence-transformers default)
      const val = Math.sin(hash + i) * 0.5 + 0.5
      embedding.push(val)
    }

    return this.normalizeVector(embedding)
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash
  }
}

/**
 * Factory function to create vector store adapters
 */
export function createVectorStoreAdapter(
  type: 'in-memory' | 'pinecone' | 'qdrant' | 'weaviate',
  config?: any
): VectorStoreAdapter {
  switch (type) {
    case 'in-memory':
      return new InMemoryVectorStore()
    
    // In production, add implementations for:
    // case 'pinecone':
    //   return new PineconeVectorStore(config)
    // case 'qdrant':
    //   return new QdrantVectorStore(config)
    // case 'weaviate':
    //   return new WeaviateVectorStore(config)
    
    default:
      throw new Error(`Unsupported vector store type: ${type}`)
  }
}
