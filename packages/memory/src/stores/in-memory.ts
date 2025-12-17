/**
 * In-Memory Vector Store
 * Simple implementation for development and testing
 */

import type { MemoryItem, MemoryType } from '../types'
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
    if (!this.memories.has(id)) {
      throw new Error(`Memory not found: ${id}`)
    }
    this.memories.set(id, memory)
  }

  async delete(id: string): Promise<void> {
    this.memories.delete(id)
    this.accessCounts.delete(id)
  }

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<Array<{ memory: MemoryItem; score: number }>> {
    const results: Array<{ memory: MemoryItem; score: number }> = []

    for (const memory of this.memories.values()) {
      // Apply type filter
      if (options.types && !options.types.includes(memory.type)) {
        continue
      }

      // Apply scope filter
      if (options.scopes && !options.scopes.includes(memory.scope)) {
        continue
      }

      // Apply userId filter
      if (options.userId && memory.metadata?.userId !== options.userId) {
        continue
      }

      // Apply metadata filters
      if (options.filters) {
        let matches = true
        for (const [key, value] of Object.entries(options.filters)) {
          if (key === 'scopes') continue // Skip scopes as handled above
          if (memory.metadata?.[key] !== value) {
            matches = false
            break
          }
        }
        if (!matches) continue
      }

      // Calculate similarity score
      let score = 0

      // Text similarity (simple)
      if (query) {
        const queryLower = query.toLowerCase()
        const contentLower = memory.content.toLowerCase()
        if (contentLower.includes(queryLower)) {
          score = 0.7
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

      // Boost by importance (only if we have a score)
      if (score > 0) {
        score = score * (0.7 + (memory.importance ?? 0.5) * 0.3)
      }

      if (score >= (options.minScore || 0) && score > 0) {
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

  async getStats(): Promise<{
    totalMemories: number
    tokenUsage: number
    averageImportance: number
    compressionRatio: number
    byType: Record<string, number>
    byScope: Record<string, number>
  }> {
    const memories = Array.from(this.memories.values())
    const totalMemories = memories.length
    
    // Count by type - ensure all expected types exist
    const byType: Record<string, number> = {
      episodic: 0,
      semantic: 0,
      procedural: 0
    }
    for (const memory of memories) {
      byType[memory.type] = (byType[memory.type] || 0) + 1
    }
    
    // Count by scope - ensure all expected scopes exist
    const byScope: Record<string, number> = {
      session: 0,
      user: 0,
      global: 0
    }
    for (const memory of memories) {
      byScope[memory.scope] = (byScope[memory.scope] || 0) + 1
    }
    
    // Calculate average importance
    const totalImportance = memories.reduce((sum, m) => sum + (m.importance ?? 0.5), 0)
    const averageImportance = totalMemories > 0 ? totalImportance / totalMemories : 0
    
    // Calculate token usage (simplified)
    const tokenUsage = memories.reduce((sum, m) => sum + (m.tokens || 0), 0)
    
    // Calculate compression ratio (simplified)
    const compressedCount = memories.filter(m => m.compressed).length
    const compressionRatio = totalMemories > 0 ? compressedCount / totalMemories : 0
    
    return {
      totalMemories,
      tokenUsage,
      averageImportance,
      compressionRatio,
      byType,
      byScope
    }
  }

  async query(options?: { scope?: string; type?: MemoryType; userId?: string; sessionId?: string }): Promise<MemoryItem[]> {
    const results = Array.from(this.memories.values())

    if (options?.scope) {
      return results.filter(m => m.scope === options.scope)
    }

    if (options?.type) {
      return results.filter(m => m.type === options.type)
    }

    if (options?.userId) {
      return results.filter(m => m.metadata?.userId === options.userId)
    }

    if (options?.sessionId) {
      return results.filter(m => m.metadata?.sessionId === options.sessionId)
    }

    return results
  }

  async clear(scope?: string, type?: MemoryType): Promise<void> {
    const toDelete: string[] = []

    for (const [id, memory] of this.memories) {
      let shouldDelete = true

      if (scope && memory.scope !== scope) shouldDelete = false
      if (type && memory.type !== type) shouldDelete = false

      if (shouldDelete) {
        toDelete.push(id)
      }
    }

    for (const id of toDelete) {
      this.memories.delete(id)
      this.accessCounts.delete(id)
    }
  }

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
