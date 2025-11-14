/**
 * Clarity Memory - IndexedDB Store
 * 
 * Browser-based persistent storage using IndexedDB
 */

import type {
  MemoryStore,
  MemoryItem,
  SearchOptions,
  ListOptions,
} from '../core/types'

const DB_NAME = 'clarity-memory'
const STORE_NAME = 'memories'
const DB_VERSION = 1

/**
 * IndexedDB store implementation
 */
export class IndexedDBStore implements MemoryStore {
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  constructor(private dbName: string = DB_NAME) {}

  /**
   * Initialize IndexedDB connection
   */
  private async init(): Promise<void> {
    if (this.db) {
      return
    }

    if (this.initPromise) {
      return this.initPromise
    }

    this.initPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not available in this environment'))
        return
      }

      const request = indexedDB.open(this.dbName, DB_VERSION)

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error}`))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
          
          // Create indexes for efficient queries
          store.createIndex('type', 'type', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('importance', 'importance', { unique: false })
          store.createIndex('userId', 'userId', { unique: false })
          store.createIndex('sessionId', 'sessionId', { unique: false })
          store.createIndex('tags', 'tags', { unique: false, multiEntry: true })
        }
      }
    })

    return this.initPromise
  }

  async add(item: MemoryItem): Promise<void> {
    await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(item)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`Failed to add memory: ${request.error}`))
    })
  }

  async get(id: string): Promise<MemoryItem | null> {
    await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => {
        resolve(request.result || null)
      }
      request.onerror = () => reject(new Error(`Failed to get memory: ${request.error}`))
    })
  }

  async update(id: string, updates: Partial<MemoryItem>): Promise<void> {
    await this.init()
    
    const existing = await this.get(id)
    if (!existing) {
      throw new Error(`Memory item ${id} not found`)
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const updated = { ...existing, ...updates }
      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.put(updated)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`Failed to update memory: ${request.error}`))
    })
  }

  async delete(id: string): Promise<void> {
    await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`Failed to delete memory: ${request.error}`))
    })
  }

  async search(query: string, options: SearchOptions = {}): Promise<MemoryItem[]> {
    await this.init()
    
    const allItems = await this.list()
    
    // Filter by query (simple text matching)
    let results = allItems
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
    await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        let results = request.result as MemoryItem[]
        
        // Apply filters
        if (options.types && options.types.length > 0) {
          results = results.filter(item => options.types!.includes(item.type))
        }
        
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
        
        resolve(results.slice(offset, limit))
      }
      
      request.onerror = () => reject(new Error(`Failed to list memories: ${request.error}`))
    })
  }

  async clear(): Promise<void> {
    await this.init()
    
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error(`Failed to clear memories: ${request.error}`))
    })
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
      this.initPromise = null
    }
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
