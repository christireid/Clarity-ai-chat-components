/**
 * Clarity Memory - In-Memory Store
 * 
 * Simple in-memory storage implementation (default)
 */

import type {
  MemoryStore,
  MemoryItem,
  SearchOptions,
  ListOptions,
} from '../core/types'

/**
 * In-memory store implementation
 */
export class InMemoryStore implements MemoryStore {
  private items: Map<string, MemoryItem> = new Map()

  async add(item: MemoryItem): Promise<void> {
    this.items.set(item.id, item)
  }

  async get(id: string): Promise<MemoryItem | null> {
    return this.items.get(id) ?? null
  }

  async update(id: string, updates: Partial<MemoryItem>): Promise<void> {
    const existing = this.items.get(id)
    if (!existing) {
      throw new Error(`Memory item ${id} not found`)
    }
    
    this.items.set(id, { ...existing, ...updates })
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id)
  }

  async search(query: string, options: SearchOptions = {}): Promise<MemoryItem[]> {
    let results = Array.from(this.items.values())
    
    // Filter by query (simple text matching)
    if (query) {
      const queryLower = query.toLowerCase()
      results = results.filter(item => 
        item.content.toLowerCase().includes(queryLower)
      )
    }
    
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
    
    // Sort by importance (descending)
    results.sort((a, b) => b.importance - a.importance)
    
    // Apply limit
    if (options.limit) {
      results = results.slice(0, options.limit)
    }
    
    return results
  }

  async list(options: ListOptions = {}): Promise<MemoryItem[]> {
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
  }

  async close(): Promise<void> {
    this.items.clear()
  }
}
