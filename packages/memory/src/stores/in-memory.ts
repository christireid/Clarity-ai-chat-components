/**
 * In-Memory Vector Store
 * Simple implementation for development and testing
 */

import type { MemoryItem, MemoryType } from '../core/types'
import type { VectorStore, SearchOptions } from './base'

export class InMemoryStore implements VectorStore {
  private memories: Map<string, MemoryItem> = new Map()
  private accessCounts: Map<string, number> = new Map()

  initialize(): void {
    // No initialization needed for in-memory store
  }

  async add(memory: MemoryItem): Promise<void> {
    this.memories.set(memory.id, memory)
    this.accessCounts.set(memory.id, 0)
  }

  async get(id: string): Promise<MemoryItem | null> {
    const memory = this.memories.get(id)
    if (memory) {
      this.accessCounts.set(id, (this.accessCounts.get(id) || 0) + 1)
    }
    return memory || null
  }

  async update(id: string, memory: MemoryItem): Promise<void> {
    if (this.memories.has(id)) {
      this.memories.set(id, memory)
    }
  }

  async delete(id: string): Promise<void> {
    this.memories.delete(id)
    this.accessCounts.delete(id)
  }

  async search(
    query: string,
    options: SearchOptions
  ): Promise<Array<{ memory: MemoryItem; score: number }>> {
    const results: Array<{ memory: MemoryItem; score: number }> = []

    for (const memory of this.memories.values()) {
      // Apply type filter
      if (options.types && !options.types.includes(memory.type)) {
        continue
      }

      // Apply metadata filters
      if (options.filters) {
        let matches = true
        for (const [key, value] of Object.entries(options.filters)) {
          if (memory.metadata?.[key] !== value) {
            matches = false
            break
          }
        }
        if (!matches) continue
      }

      // Apply tag filter
      if (options.tags && memory.tags) {
        const hasTag = options.tags.some((tag) => memory.tags?.includes(tag))
        if (!hasTag) continue
      }

      // Calculate similarity score
      let score = 0

      // Text similarity (simple)
      if (query) {
        const queryLower = query.toLowerCase()
        const contentLower = memory.content.toLowerCase()
        if (contentLower.includes(queryLower)) {
          score = 0.7
        } else {
          // Check word overlap
          const queryWords = new Set(queryLower.split(/\s+/))
          const contentWords = new Set(contentLower.split(/\s+/))
          const overlap = [...queryWords].filter((w) => contentWords.has(w))
            .length
          score = overlap / Math.max(queryWords.size, 1) * 0.5
        }
      }

      // Vector similarity (if embeddings available)
      if (options.embedding && memory.embedding) {
        const vectorScore = this.cosineSimilarity(
          options.embedding,
          memory.embedding
        )
        score = Math.max(score, vectorScore)
      }

      // Boost by importance
      score = score * (0.7 + memory.importance * 0.3)

      if (score >= (options.minScore || 0)) {
        results.push({ memory, score })
      }
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score)

    // Apply limit
    return results.slice(0, options.limit || 10)
  }

  async getAll(options?: { types?: MemoryType[] }): Promise<MemoryItem[]> {
    const memories = Array.from(this.memories.values())

    if (options?.types) {
      return memories.filter((m) => options.types!.includes(m.type))
    }

    return memories
  }

  async close(): Promise<void> {
    // Clear all data
    this.memories.clear()
    this.accessCounts.clear()
  }

  // Helper: Calculate cosine similarity
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i]! * b[i]!
      normA += a[i]! * a[i]!
      normB += b[i]! * b[i]!
    }

    if (normA === 0 || normB === 0) return 0

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}
