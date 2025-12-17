/**
 * File-Based Vector Store
 * Simple JSON file persistence for single-instance applications
 */

import { promises as fs } from 'fs'
import { memoryLogger } from '../utils/logger'
import { dirname } from 'path'
import type { MemoryItem, MemoryType } from '../types'
import type { VectorStore, SearchOptions } from './base'

interface FileStoreData {
  memories: MemoryItem[]
  version: string
  lastUpdated: number
}

export class FileStore implements VectorStore {
  private filePath: string
  private memories: Map<string, MemoryItem> = new Map()
  private initialized: boolean = false

  constructor(filePath: string = './memories.json') {
    this.filePath = filePath
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      // Ensure directory exists
      const dir = dirname(this.filePath)
      await fs.mkdir(dir, { recursive: true })

      // Try to load existing data
      try {
        const data = await fs.readFile(this.filePath, 'utf-8')
        const parsed: FileStoreData = JSON.parse(data)
        
        // Migrate old format if needed
        if (parsed.memories) {
          for (const memory of parsed.memories) {
            this.memories.set(memory.id, memory)
          }
        } else if (Array.isArray(parsed)) {
          // Legacy format: array of memories
          for (const memory of parsed) {
            this.memories.set(memory.id, memory)
          }
        }
      } catch (error: any) {
        // File doesn't exist or is invalid - start fresh
        if (error.code !== 'ENOENT') {
          memoryLogger.warn('Failed to load memory file:', error.message)
        }
      }

      this.initialized = true
    } catch (error) {
      throw new Error(`Failed to initialize file store: ${error}`)
    }
  }

  async add(memory: MemoryItem): Promise<void> {
    await this.ensureInitialized()
    this.memories.set(memory.id, memory)
    await this.persist()
  }

  async get(id: string): Promise<MemoryItem | null> {
    await this.ensureInitialized()
    return this.memories.get(id) || null
  }

  async update(id: string, memory: MemoryItem): Promise<void> {
    await this.ensureInitialized()
    if (this.memories.has(id)) {
      this.memories.set(id, memory)
      await this.persist()
    }
  }

  async delete(id: string): Promise<void> {
    await this.ensureInitialized()
    this.memories.delete(id)
    await this.persist()
  }

  async search(
    query: string,
    options: SearchOptions
  ): Promise<Array<{ memory: MemoryItem; score: number }>> {
    await this.ensureInitialized()
    
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
      score = score * (0.7 + (memory.importance ?? 0.5) * 0.3)

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
    const memories = Array.from(this.memories.values())

    if (options?.types) {
      return memories.filter((m) => options.types!.includes(m.type))
    }

    return memories
  }

  async close(): Promise<void> {
    await this.persist()
    this.memories.clear()
    this.initialized = false
  }

  // Private helpers
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize()
    }
  }

  private async persist(): Promise<void> {
    const data: FileStoreData = {
      memories: Array.from(this.memories.values()),
      version: '1.0.0',
      lastUpdated: Date.now(),
    }

    const content = JSON.stringify(data, null, 2)

    // Use atomic write pattern: write to temp file, then rename
    // This prevents data corruption if process crashes during write
    // Note: This implementation is safe for single-process use only.
    // For multi-process scenarios, use a database or add file locking.
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
    const tempPath = `${this.filePath}.${uniqueId}.tmp`
    const backupPath = `${this.filePath}.bak`

    try {
      // Write to temporary file first
      await fs.writeFile(tempPath, content, 'utf-8')

      // Create backup of existing file (if it exists)
      try {
        await fs.copyFile(this.filePath, backupPath)
      } catch {
        // Original file may not exist yet - that's fine
      }

      // Atomic rename: replace target with temp file
      await fs.rename(tempPath, this.filePath)

      // Clean up backup after successful write
      try {
        await fs.unlink(backupPath)
      } catch {
        // Backup may not exist - that's fine
      }
    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.unlink(tempPath)
      } catch {
        // Temp file may not exist - that's fine
      }

      // Attempt to restore from backup if main file was corrupted
      try {
        await fs.access(backupPath)
        await fs.rename(backupPath, this.filePath)
        memoryLogger.warn('Restored from backup after persist failure')
      } catch {
        // No backup to restore from
      }

      memoryLogger.error('Failed to persist memories:', error)
      throw error
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
