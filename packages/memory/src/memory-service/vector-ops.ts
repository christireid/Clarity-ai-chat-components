/**
 * Vector Operations Module
 *
 * Handles all vector store operations including:
 * - Vector search
 * - Vector store updates
 * - Match to memory conversion
 */

import type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  VectorStore,
  VectorStoreMatch,
  VectorStoreVector,
  VectorStoreQuery,
  MemoryType,
  MemoryScope,
  MemoryPriority,
} from '../types'

/**
 * Simple token counter utility
 */
const TokenCounter = {
  count: (text: string): number => Math.ceil(text.length / 4),
}

/**
 * Vector operations handler
 */
export class VectorOperations {
  constructor(
    private vectorStore?: VectorStore,
    private namespace?: string,
    private batchSize: number = 100,
    private debug: boolean = false
  ) {}

  /**
   * Perform vector search
   */
  async search(
    query: MemoryQuery,
    cache: Map<string, MemoryItem>
  ): Promise<MemorySearchResult[]> {
    if (!this.vectorStore || !query.embedding) {
      return []
    }

    try {
      const matches = await this.vectorStore.query({
        vector: query.embedding,
        topK: query.limit || 10,
        minScore: query.minConfidence || 0.5,
        filter: query.metadata,
        namespace: this.namespace,
        includeMetadata: true,
      } satisfies VectorStoreQuery)

      return matches.map((match: VectorStoreMatch) => ({
        memory: cache.get(match.id) || this.createMemoryFromMatch(match),
        relevance: match.score,
        distance: 1 - match.score,
      }))
    } catch (error) {
      if (this.debug) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Vector search failed:', error)
        }
      }
      return []
    }
  }

  /**
   * Update vector store with memories
   */
  async update(memories: MemoryItem[]): Promise<void> {
    if (!this.vectorStore) return

    const vectors: VectorStoreVector[] = memories
      .filter((m) => m.embedding && m.embedding.length > 0)
      .map((m) => ({
        id: m.id,
        values: m.embedding!,
        metadata: {
          type: m.type,
          scope: m.scope,
          priority: m.priority,
          content: m.content,
          ...m.metadata,
        },
      }))

    if (vectors.length === 0) return

    try {
      await this.vectorStore.upsert(vectors, {
        namespace: this.namespace,
        batchSize: this.batchSize,
      })
    } catch (error) {
      if (this.debug) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to update vector store:', error)
        }
      }
      // Re-throw to allow caller to handle sync failures
      throw error
    }
  }

  /**
   * Delete vectors from store
   */
  async delete(ids: string[]): Promise<void> {
    if (!this.vectorStore) return

    try {
      await this.vectorStore.delete(ids, this.namespace)
    } catch (error) {
      if (this.debug) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to delete from vector store:', error)
        }
      }
      throw error
    }
  }

  /**
   * Initialize vector store
   */
  async initialize(): Promise<void> {
    if (this.vectorStore) {
      await this.vectorStore.initialize()
    }
  }

  /**
   * Close vector store
   */
  async close(): Promise<void> {
    if (this.vectorStore && 'close' in this.vectorStore) {
      await (this.vectorStore as any).close()
    }
  }

  /**
   * Create memory from vector match
   */
  private createMemoryFromMatch(match: VectorStoreMatch): MemoryItem {
    const metadata = match.metadata || {}
    return {
      id: match.id,
      type: (metadata['type'] as MemoryType | undefined) || 'episodic',
      scope: (metadata['scope'] as MemoryScope | undefined) || 'session',
      content: (metadata['content'] as string | undefined) || '',
      metadata: metadata,
      embedding: match.values,
      confidence: match.score || 0.5,
      priority:
        (metadata['priority'] as MemoryPriority | undefined) || 'medium',
      tokens: TokenCounter.count(
        (metadata['content'] as string | undefined) || ''
      ),
      accessCount: 0,
      lastAccessed: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}
