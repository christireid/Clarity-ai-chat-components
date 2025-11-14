/**
 * Clarity Memory - File System Store
 * 
 * Node.js file system-based persistent storage
 */

import { promises as fs } from 'fs'
import { join } from 'path'
import type {
  MemoryStore,
  MemoryItem,
  SearchOptions,
  ListOptions,
} from '../core/types'

/**
 * File system store implementation
 */
export class FileSystemStore implements MemoryStore {
  private items: Map<string, MemoryItem> = new Map()
  private filePath: string

  constructor(private baseDir: string = './.clarity-memory') {
    this.filePath = join(this.baseDir, 'memories.json')
  }

  /**
   * Load memories from disk
   */
  private async load(): Promise<void> {
    try {
      // Ensure directory exists
      await fs.mkdir(this.baseDir, { recursive: true })
      
      // Try to read existing file
      try {
        const data = await fs.readFile(this.filePath, 'utf-8')
        const items = JSON.parse(data) as MemoryItem[]
        
        // Convert timestamp strings back to Date objects
        for (const item of items) {
          item.timestamp = new Date(item.timestamp)
          if (item.metadata && 'createdAt' in item.metadata) {
            item.metadata['createdAt'] = new Date(item.metadata['createdAt'] as string)
          }
        }
        
        this.items = new Map(items.map(item => [item.id, item]))
      } catch (error: any) {
        // File doesn't exist yet, start with empty map
        if (error.code !== 'ENOENT') {
          throw error
        }
      }
    } catch (error) {
      console.warn('Failed to load memories from disk:', error)
    }
  }

  /**
   * Save memories to disk
   */
  private async save(): Promise<void> {
    try {
      // Ensure directory exists
      await fs.mkdir(this.baseDir, { recursive: true })
      
      // Convert to array and serialize
      const items = Array.from(this.items.values())
      await fs.writeFile(this.filePath, JSON.stringify(items, null, 2), 'utf-8')
    } catch (error) {
      console.warn('Failed to save memories to disk:', error)
    }
  }

  async add(item: MemoryItem): Promise<void> {
    await this.load()
    this.items.set(item.id, item)
    await this.save()
  }

  async get(id: string): Promise<MemoryItem | null> {
    await this.load()
    return this.items.get(id) || null
  }

  async update(id: string, updates: Partial<MemoryItem>): Promise<void> {
    await this.load()
    const existing = this.items.get(id)
    if (!existing) {
      throw new Error(`Memory item ${id} not found`)
    }
    
    this.items.set(id, { ...existing, ...updates })
    await this.save()
  }

  async delete(id: string): Promise<void> {
    await this.load()
    this.items.delete(id)
    await this.save()
  }

  async search(query: string, options: SearchOptions = {}): Promise<MemoryItem[]> {
    await this.load()
    let results = Array.from(this.items.values())
    
    // Filter by query (simple text matching)
    if (query) {
      const queryLower = query.toLowerCase()
      results = results.filter(item => 
        item.content.toLowerCase().includes(queryLower)
      )
    }
    
    // Apply filters
    results = this.applyFilters(results, options)
    
    // Sort by importance (descending)
    results.sort((a, b) => b.importance - a.importance)
    
    // Apply limit
    if (options.limit) {
      results = results.slice(0, options.limit)
    }
    
    return results
  }

  async list(options: ListOptions = {}): Promise<MemoryItem[]> {
    await this.load()
    let results = Array.from(this.items.values())
    
    // Filter by type
    if (options.types && options.types.length > 0) {
      results = results.filter(item => options.types!.includes(item.type))
    }
    
    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter(item => 
        item.tags && options.tags!.some(tag => item.tags!.includes(tag))
      )
    }
    
    // Sort
    if (options.sortBy) {
      results.sort((a, b) => {
        let aVal: any
        let bVal: any
        
        switch (options.sortBy) {
          case 'timestamp':
            aVal = a.timestamp.getTime()
            bVal = b.timestamp.getTime()
            break
          case 'importance':
            aVal = a.importance
            bVal = b.importance
            break
          default:
            return 0
        }
        
        if (options.order === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    }
    
    // Apply offset and limit
    const offset = options.offset || 0
    const limit = options.limit ? offset + options.limit : undefined
    
    return results.slice(offset, limit)
  }

  async clear(): Promise<void> {
    this.items.clear()
    await this.save()
  }

  async close(): Promise<void> {
    await this.save()
  }

  /**
   * Apply search filters to results
   */
  private applyFilters(items: MemoryItem[], options: SearchOptions): MemoryItem[] {
    let results = items
    
    // Filter by type
    if (options.types && options.types.length > 0) {
      results = results.filter(item => options.types!.includes(item.type))
    }
    
    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter(item => 
        item.tags && options.tags!.some(tag => item.tags!.includes(tag))
      )
    }
    
    // Filter by minimum importance
    if (options.minImportance !== undefined) {
      results = results.filter(item => item.importance >= options.minImportance!)
    }
    
    // Filter by user ID
    if (options.userId) {
      results = results.filter(item => item.userId === options.userId)
    }
    
    // Filter by session ID
    if (options.sessionId) {
      results = results.filter(item => item.sessionId === options.sessionId)
    }
    
    // Filter by date range
    if (options.since) {
      results = results.filter(item => item.timestamp >= options.since!)
    }
    
    if (options.until) {
      results = results.filter(item => item.timestamp <= options.until!)
    }
    
    // Filter by metadata
    if (options.metadata) {
      results = results.filter(item => {
        if (!item.metadata) return false
        return Object.entries(options.metadata!).every(([key, value]) => 
          item.metadata![key] === value
        )
      })
    }
    
    return results
  }
}
