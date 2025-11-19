/**
 * In-Memory Storage Adapter
 * 
 * Fast, ephemeral storage for development and serverless
 */

import type { StorageAdapter } from './storage-adapter'
import type { Memory, MemoryType, MemoryScope, SearchOptions } from '../types'

export class InMemoryStore implements StorageAdapter {
  private memories: Map<string, Memory> = new Map()
  private initialized: boolean = false

  async initialize(): Promise<void> {
    this.memories = new Map()
    this.initialized = true
  }

  async save(memory: Memory): Promise<void> {
    this.memories.set(memory.id, memory)
  }

  async load(id: string): Promise<Memory | null> {
    return this.memories.get(id) || null
  }

  async update(id: string, memory: Memory): Promise<void> {
    if (!this.memories.has(id)) {
      throw new Error(`Memory not found: ${id}`)
    }
    this.memories.set(id, memory)
  }

  async delete(id: string): Promise<void> {
    this.memories.delete(id)
  }

  async search(
    query: string,
    options?: SearchOptions & { embedding?: number[] }
  ): Promise<Array<{ memory: Memory; score: number }>> {
    const results: Array<{ memory: Memory; score: number }> = []
    const queryLower = query.toLowerCase()

    for (const memory of this.memories.values()) {
      // Filter by options
      if (options?.types && !options.types.includes(memory.type)) continue
      if (options?.scopes && !options.scopes.includes(memory.scope)) continue
      if (options?.userId && memory.metadata.userId !== options.userId) continue
      if (options?.sessionId && memory.metadata.sessionId !== options.sessionId) continue
      if (options?.tags && !options.tags.some(tag => memory.tags?.includes(tag))) continue

      // Simple text matching (will be enhanced with vector search)
      const contentLower = memory.content.toLowerCase()
      let score = 0

      if (contentLower.includes(queryLower)) {
        score = 0.7
        // Boost score for exact matches
        if (contentLower === queryLower) {
          score = 1.0
        } else if (contentLower.startsWith(queryLower)) {
          score = 0.9
        }
      }

      // Boost by importance
      score = score * (0.5 + memory.importance * 0.5)

      // Vector similarity if embeddings available
      if (options?.embedding && memory.embedding) {
        const similarity = this.cosineSimilarity(options.embedding, memory.embedding)
        score = Math.max(score, similarity * 0.8 + memory.importance * 0.2)
      }

      if (score > 0 && (!options?.minScore || score >= options.minScore)) {
        results.push({ memory, score })
      }
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score)

    // Apply limit
    return results.slice(0, options?.limit || 10)
  }

  async query(options?: {
    scope?: MemoryScope
    type?: MemoryType
    userId?: string
    sessionId?: string
    threadId?: string
  }): Promise<Memory[]> {
    const results: Memory[] = []

    for (const memory of this.memories.values()) {
      if (options?.scope && memory.scope !== options.scope) continue
      if (options?.type && memory.type !== options.type) continue
      if (options?.userId && memory.metadata.userId !== options.userId) continue
      if (options?.sessionId && memory.metadata.sessionId !== options.sessionId) continue

      results.push(memory)
    }

    return results
  }

  async clear(scope?: MemoryScope, type?: MemoryType): Promise<void> {
    if (!scope && !type) {
      this.memories.clear()
      return
    }

    const toDelete: string[] = []
    for (const memory of this.memories.values()) {
      if (scope && memory.scope !== scope) continue
      if (type && memory.type !== type) continue
      toDelete.push(memory.id)
    }

    for (const id of toDelete) {
      this.memories.delete(id)
    }
  }

  async getStats(): Promise<{
    totalMemories: number
    byType: Record<MemoryType, number>
    byScope: Record<MemoryScope, number>
    tokenUsage: number
    compressionRatio: number
    averageImportance: number
  }> {
    const byType: Record<MemoryType, number> = {
      episodic: 0,
      semantic: 0,
      profile: 0,
    }
    const byScope: Record<MemoryScope, number> = {
      session: 0,
      thread: 0,
      user: 0,
      global: 0,
    }

    let tokenUsage = 0
    let totalImportance = 0
    let compressedCount = 0

    for (const memory of this.memories.values()) {
      byType[memory.type]++
      byScope[memory.scope]++
      tokenUsage += this.countTokens(memory.content)
      totalImportance += memory.importance
      if (memory.compressed) compressedCount++
    }

    return {
      totalMemories: this.memories.size,
      byType,
      byScope,
      tokenUsage,
      compressionRatio: this.memories.size > 0 ? compressedCount / this.memories.size : 0,
      averageImportance: this.memories.size > 0 ? totalImportance / this.memories.size : 0,
    }
  }

  async close(): Promise<void> {
    this.memories.clear()
    this.initialized = false
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

  private countTokens(text: string): number {
    return countTokens(text)
  }
}
