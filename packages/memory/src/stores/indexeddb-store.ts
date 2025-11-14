/**
 * IndexedDB Storage Adapter
 * 
 * Browser-based persistent storage
 */

import type { StorageAdapter } from './storage-adapter'
import type { Memory, MemoryType, MemoryScope, SearchOptions } from '../core/types'

const DB_NAME = 'clarity-memory'
const STORE_NAME = 'memories'
const DB_VERSION = 1

export class IndexedDBStore implements StorageAdapter {
  private db: IDBDatabase | null = null
  private initialized: boolean = false

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error}`))
      }

      request.onsuccess = () => {
        this.db = request.result
        this.initialized = true
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('scope', 'scope', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('userId', 'metadata.userId', { unique: false })
          store.createIndex('sessionId', 'metadata.sessionId', { unique: false })
        }
      }
    })
  }

  async save(memory: Memory): Promise<void> {
    await this.ensureInitialized()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(this.serialize(memory))

      request.onerror = () => {
        reject(new Error(`Failed to save memory: ${request.error}`))
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  async load(id: string): Promise<Memory | null> {
    await this.ensureInitialized()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onerror = () => {
        reject(new Error(`Failed to load memory: ${request.error}`))
      }

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? this.deserialize(result) : null)
      }
    })
  }

  async update(id: string, memory: Memory): Promise<void> {
    await this.ensureInitialized()
    
    const existing = await this.load(id)
    if (!existing) {
      throw new Error(`Memory not found: ${id}`)
    }

    return this.save({ ...memory, id })
  }

  async delete(id: string): Promise<void> {
    await this.ensureInitialized()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onerror = () => {
        reject(new Error(`Failed to delete memory: ${request.error}`))
      }

      request.onsuccess = () => {
        resolve()
      }
    })
  }

  async search(
    query: string,
    options?: SearchOptions & { embedding?: number[] }
  ): Promise<Array<{ memory: Memory; score: number }>> {
    await this.ensureInitialized()
    
    const allMemories = await this.query({
      types: options?.types,
      scopes: options?.scopes,
      userId: options?.userId,
      sessionId: options?.sessionId,
    })

    const results: Array<{ memory: Memory; score: number }> = []
    const queryLower = query.toLowerCase()

    for (const memory of allMemories) {
      // Filter by tags
      if (options?.tags && !options.tags.some(tag => memory.tags?.includes(tag))) {
        continue
      }

      // Simple text matching
      const contentLower = memory.content.toLowerCase()
      let score = 0

      if (contentLower.includes(queryLower)) {
        score = 0.7
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
    await this.ensureInitialized()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onerror = () => {
        reject(new Error(`Failed to query memories: ${request.error}`))
      }

      request.onsuccess = () => {
        let memories = (request.result as any[]).map(m => this.deserialize(m))

        // Apply filters
        if (options?.scope) {
          memories = memories.filter(m => m.scope === options.scope)
        }
        if (options?.type) {
          memories = memories.filter(m => m.type === options.type)
        }
        if (options?.userId) {
          memories = memories.filter(m => m.metadata.userId === options.userId)
        }
        if (options?.sessionId) {
          memories = memories.filter(m => m.metadata.sessionId === options.sessionId)
        }
        if (options?.threadId) {
          memories = memories.filter(m => m.metadata.threadId === options.threadId)
        }

        resolve(memories)
      }
    })
  }

  async clear(scope?: MemoryScope, type?: MemoryType): Promise<void> {
    await this.ensureInitialized()
    
    if (!scope && !type) {
      // Clear all
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        const request = store.clear()

        request.onerror = () => {
          reject(new Error(`Failed to clear memories: ${request.error}`))
        }

        request.onsuccess = () => {
          resolve()
        }
      })
    }

    // Clear filtered
    const memories = await this.query({ scope, type })
    await Promise.all(memories.map(m => this.delete(m.id)))
  }

  async getStats(): Promise<{
    totalMemories: number
    byType: Record<MemoryType, number>
    byScope: Record<MemoryScope, number>
    tokenUsage: number
    compressionRatio: number
    averageImportance: number
  }> {
    await this.ensureInitialized()
    
    const memories = await this.query()
    
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

    for (const memory of memories) {
      byType[memory.type]++
      byScope[memory.scope]++
      tokenUsage += this.countTokens(memory.content)
      totalImportance += memory.importance
      if (memory.compressed) compressedCount++
    }

    return {
      totalMemories: memories.length,
      byType,
      byScope,
      tokenUsage,
      compressionRatio: memories.length > 0 ? compressedCount / memories.length : 0,
      averageImportance: memories.length > 0 ? totalImportance / memories.length : 0,
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
    this.initialized = false
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }
  }

  private serialize(memory: Memory): any {
    return {
      ...memory,
      timestamp: memory.timestamp.toISOString(),
      lastAccessed: memory.lastAccessed?.toISOString(),
    }
  }

  private deserialize(data: any): Memory {
    return {
      ...data,
      timestamp: new Date(data.timestamp),
      lastAccessed: data.lastAccessed ? new Date(data.lastAccessed) : undefined,
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

  private countTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }
}
