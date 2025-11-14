/**
 * IndexedDB Vector Store
 * Browser-native storage for client-side applications
 */

import type { MemoryItem, MemoryType } from '../core/types'
import type { VectorStore, SearchOptions } from './base'
import { cosineSimilarity } from '../utils/vector'

interface IDBStore {
  memories: MemoryItem[]
}

export class IndexedDBStore implements VectorStore {
  private dbName: string
  private storeName: string = 'memories'
  private db: IDBDatabase | null = null
  private initialized: boolean = false

  constructor(dbName: string = 'clarity-memory') {
    this.dbName = dbName
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not available in this environment'))
        return
      }

      const request = indexedDB.open(this.dbName, 1)

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

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'id',
          })
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('importance', 'importance', { unique: false })
        }
      }
    })
  }

  async add(memory: MemoryItem): Promise<void> {
    await this.ensureInitialized()
    return this.put(memory)
  }

  async get(id: string): Promise<MemoryItem | null> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        reject(new Error(`Failed to get memory: ${request.error}`))
      }
    })
  }

  async update(id: string, memory: MemoryItem): Promise<void> {
    await this.ensureInitialized()
    return this.put(memory)
  }

  async delete(id: string): Promise<void> {
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error(`Failed to delete memory: ${request.error}`))
      }
    })
  }

  async search(
    query: string,
    options: SearchOptions
  ): Promise<Array<{ memory: MemoryItem; score: number }>> {
    await this.ensureInitialized()

    const allMemories = await this.getAll({ types: options.types })
    const results: Array<{ memory: MemoryItem; score: number }> = []

    for (const memory of allMemories) {
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

      // Text similarity
      if (query) {
        const queryLower = query.toLowerCase()
        const contentLower = memory.content.toLowerCase()
        if (contentLower.includes(queryLower)) {
          score = 0.7
        } else {
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
    await this.ensureInitialized()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        let memories = request.result as MemoryItem[]

        // Filter by type if specified
        if (options?.types) {
          memories = memories.filter((m) => options.types!.includes(m.type))
        }

        resolve(memories)
      }

      request.onerror = () => {
        reject(new Error(`Failed to get all memories: ${request.error}`))
      }
    })
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
    }
    this.initialized = false
  }

  // Private helpers
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }
  }

  private async put(memory: MemoryItem): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.put(memory)

      request.onsuccess = () => {
        resolve()
      }

      request.onerror = () => {
        reject(new Error(`Failed to put memory: ${request.error}`))
      }
    })
  }

}
