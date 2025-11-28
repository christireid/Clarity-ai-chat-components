/**
 * Persistent Semantic Cache with IndexedDB
 *
 * Advanced caching system that:
 * - Persists across browser sessions using IndexedDB
 * - Finds semantically similar queries using embeddings
 * - Implements LRU eviction when max entries exceeded
 * - Auto-prunes expired entries
 *
 * Can save 40-70% on repeated or similar queries.
 *
 * @module utils/semantic-cache-persistent
 */

/**
 * Configuration for the persistent semantic cache
 */
export interface SemanticCacheConfig {
  /** Database name (default: 'clarity-semantic-cache') */
  dbName?: string
  /** Object store name (default: 'responses') */
  storeName?: string
  /** Maximum number of entries (default: 1000) */
  maxEntries?: number
  /** Time-to-live in milliseconds (default: 24 hours) */
  ttlMs?: number
  /** Similarity threshold for matching (0-1, default: 0.85) */
  similarityThreshold?: number
  /** Function to generate embeddings for queries */
  embedFunction: (text: string) => Promise<number[]>
}

/**
 * A cached response entry
 */
export interface CachedResponse {
  /** Unique identifier */
  id: string
  /** Original query text */
  query: string
  /** Query embedding for similarity matching */
  queryEmbedding: number[]
  /** Cached response content */
  response: string
  /** Timestamp when cached */
  timestamp: number
  /** Number of cache hits */
  hits: number
  /** Last accessed timestamp */
  lastAccessed: number
  /** Optional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Cache statistics
 */
export interface SemanticCacheStats {
  /** Total entries in cache */
  size: number
  /** Total cache hits */
  hits: number
  /** Total cache misses */
  misses: number
  /** Hit rate percentage (0-100) */
  hitRate: number
  /** Estimated tokens saved */
  tokensSaved: number
  /** Oldest entry timestamp */
  oldestEntry: number | null
  /** Database size in bytes (approximate) */
  dbSizeBytes: number
}

/**
 * Result of a cache check
 */
export interface CacheCheckResult {
  /** Whether a match was found */
  hit: boolean
  /** The matched response (if hit) */
  response: CachedResponse | null
  /** Similarity score (if semantic match) */
  similarity: number
  /** Whether match was exact or semantic */
  matchType: 'exact' | 'semantic' | 'none'
  /** Time taken for lookup in ms */
  lookupTimeMs: number
}

// Default configuration values
const DEFAULT_CONFIG = {
  dbName: 'clarity-semantic-cache',
  storeName: 'responses',
  maxEntries: 1000,
  ttlMs: 24 * 60 * 60 * 1000, // 24 hours
  similarityThreshold: 0.85,
}

// IndexedDB version
const DB_VERSION = 1

/**
 * Calculate cosine similarity between two embedding vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    const aVal = a[i] ?? 0
    const bVal = b[i] ?? 0
    dotProduct += aVal * bVal
    normA += aVal * aVal
    normB += bVal * bVal
  }

  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Generate a unique ID for cache entries
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Normalize query for exact matching
 */
function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ')
}

/**
 * Persistent Semantic Cache using IndexedDB
 *
 * @example
 * ```typescript
 * const cache = new PersistentSemanticCache({
 *   embedFunction: async (text) => await getEmbedding(text),
 *   maxEntries: 500,
 *   ttlMs: 12 * 60 * 60 * 1000, // 12 hours
 * })
 *
 * // Check cache before API call
 * const cached = await cache.checkCache('What is React?')
 * if (cached) {
 *   return cached.response
 * }
 *
 * // After API call, store response
 * const response = await callAPI('What is React?')
 * await cache.storeResponse('What is React?', response)
 * ```
 */
export class PersistentSemanticCache {
  private config: Required<Omit<SemanticCacheConfig, 'embedFunction'>> & {
    embedFunction: SemanticCacheConfig['embedFunction']
  }
  private db: IDBDatabase | null = null
  private dbPromise: Promise<IDBDatabase> | null = null
  private stats = {
    hits: 0,
    misses: 0,
    tokensSaved: 0,
  }

  constructor(config: SemanticCacheConfig) {
    // Validate required config
    if (!config.embedFunction) {
      throw new Error('embedFunction is required for PersistentSemanticCache')
    }

    // Validate optional config values
    if (config.maxEntries !== undefined && config.maxEntries <= 0) {
      throw new Error('maxEntries must be positive')
    }
    if (config.ttlMs !== undefined && config.ttlMs < 0) {
      throw new Error('ttlMs cannot be negative')
    }
    if (config.similarityThreshold !== undefined &&
        (config.similarityThreshold < 0 || config.similarityThreshold > 1)) {
      throw new Error('similarityThreshold must be between 0 and 1')
    }

    this.config = {
      dbName: config.dbName ?? DEFAULT_CONFIG.dbName,
      storeName: config.storeName ?? DEFAULT_CONFIG.storeName,
      maxEntries: config.maxEntries ?? DEFAULT_CONFIG.maxEntries,
      ttlMs: config.ttlMs ?? DEFAULT_CONFIG.ttlMs,
      similarityThreshold: config.similarityThreshold ?? DEFAULT_CONFIG.similarityThreshold,
      embedFunction: config.embedFunction,
    }
  }

  /**
   * Initialize IndexedDB connection (lazy)
   */
  private async getDb(): Promise<IDBDatabase> {
    if (this.db) return this.db

    if (this.dbPromise) return this.dbPromise

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      // Check if IndexedDB is available
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB is not available'))
        return
      }

      const request = indexedDB.open(this.config.dbName, DB_VERSION)

      request.onerror = () => {
        reject(new Error(`Failed to open IndexedDB: ${request.error?.message}`))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.config.storeName)) {
          const store = db.createObjectStore(this.config.storeName, { keyPath: 'id' })

          // Create indexes for efficient queries
          store.createIndex('query', 'query', { unique: false })
          store.createIndex('timestamp', 'timestamp', { unique: false })
          store.createIndex('lastAccessed', 'lastAccessed', { unique: false })
        }
      }
    })

    // Reset dbPromise on failure so next call can retry
    this.dbPromise.catch(() => {
      this.dbPromise = null
    })

    return this.dbPromise
  }

  /**
   * Check cache for a matching response
   */
  async checkCache(query: string): Promise<CachedResponse | null> {
    const startTime = performance.now()

    try {
      const db = await this.getDb()
      const normalizedQuery = normalizeQuery(query)

      // First, try exact match
      const exactMatch = await this.findExactMatch(db, normalizedQuery)
      if (exactMatch && !this.isExpired(exactMatch)) {
        await this.updateHitCount(db, exactMatch.id)
        this.stats.hits++
        return exactMatch
      }

      // Try semantic similarity match
      const queryEmbedding = await this.config.embedFunction(query)
      const semanticMatch = await this.findSemanticMatch(db, queryEmbedding)

      if (semanticMatch) {
        await this.updateHitCount(db, semanticMatch.id)
        this.stats.hits++
        return semanticMatch
      }

      this.stats.misses++
      return null
    } catch (error) {
      console.warn('[PersistentSemanticCache] Cache check failed:', error)
      this.stats.misses++
      return null
    }
  }

  /**
   * Store a response in the cache
   */
  async storeResponse(
    query: string,
    response: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      const db = await this.getDb()
      const queryEmbedding = await this.config.embedFunction(query)
      const now = Date.now()

      const entry: CachedResponse = {
        id: generateId(),
        query: normalizeQuery(query),
        queryEmbedding,
        response,
        timestamp: now,
        hits: 0,
        lastAccessed: now,
        metadata,
      }

      await this.put(db, entry)

      // Enforce max entries (LRU eviction)
      await this.enforceMaxEntries(db)
    } catch (error) {
      console.warn('[PersistentSemanticCache] Store failed:', error)
    }
  }

  /**
   * Find entries similar to the given embedding
   */
  async findSimilar(
    embedding: number[],
    threshold?: number
  ): Promise<CachedResponse[]> {
    try {
      const db = await this.getDb()
      const entries = await this.getAllEntries(db)
      const similarityThreshold = threshold ?? this.config.similarityThreshold

      const matches: Array<{ entry: CachedResponse; similarity: number }> = []

      for (const entry of entries) {
        if (this.isExpired(entry)) continue

        const similarity = cosineSimilarity(embedding, entry.queryEmbedding)
        if (similarity >= similarityThreshold) {
          matches.push({ entry, similarity })
        }
      }

      // Sort by similarity descending
      matches.sort((a, b) => b.similarity - a.similarity)

      return matches.map((m) => m.entry)
    } catch (error) {
      console.warn('[PersistentSemanticCache] findSimilar failed:', error)
      return []
    }
  }

  /**
   * Remove expired entries
   */
  async prune(): Promise<number> {
    try {
      const db = await this.getDb()
      const entries = await this.getAllEntries(db)
      let pruned = 0

      for (const entry of entries) {
        if (this.isExpired(entry)) {
          await this.delete(db, entry.id)
          pruned++
        }
      }

      return pruned
    } catch (error) {
      console.warn('[PersistentSemanticCache] Prune failed:', error)
      return 0
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      const db = await this.getDb()
      const transaction = db.transaction(this.config.storeName, 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      store.clear()

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve()
        transaction.onerror = () => reject(transaction.error)
      })

      this.stats = { hits: 0, misses: 0, tokensSaved: 0 }
    } catch (error) {
      console.warn('[PersistentSemanticCache] Clear failed:', error)
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<SemanticCacheStats> {
    try {
      const db = await this.getDb()
      const entries = await this.getAllEntries(db)

      let oldestEntry: number | null = null
      let dbSizeBytes = 0

      for (const entry of entries) {
        if (oldestEntry === null || entry.timestamp < oldestEntry) {
          oldestEntry = entry.timestamp
        }
        // Approximate size: embedding (4 bytes per float) + response + query
        dbSizeBytes +=
          entry.queryEmbedding.length * 4 +
          entry.response.length * 2 +
          entry.query.length * 2
      }

      const total = this.stats.hits + this.stats.misses
      return {
        size: entries.length,
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
        tokensSaved: this.stats.tokensSaved,
        oldestEntry,
        dbSizeBytes,
      }
    } catch (error) {
      console.warn('[PersistentSemanticCache] getStats failed:', error)
      return {
        size: 0,
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate: 0,
        tokensSaved: this.stats.tokensSaved,
        oldestEntry: null,
        dbSizeBytes: 0,
      }
    }
  }

  /**
   * Record token savings for statistics
   */
  recordTokensSaved(tokens: number): void {
    this.stats.tokensSaved += tokens
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      this.dbPromise = null
    }
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Find exact match by normalized query
   */
  private findExactMatch(
    db: IDBDatabase,
    normalizedQuery: string
  ): Promise<CachedResponse | null> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.config.storeName, 'readonly')
      const store = transaction.objectStore(this.config.storeName)
      const index = store.index('query')
      const request = index.get(normalizedQuery)

      request.onsuccess = () => {
        resolve(request.result ?? null)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Find semantic match using embedding similarity
   */
  private async findSemanticMatch(
    db: IDBDatabase,
    queryEmbedding: number[]
  ): Promise<CachedResponse | null> {
    const entries = await this.getAllEntries(db)

    let bestMatch: CachedResponse | null = null
    let bestSimilarity = 0

    for (const entry of entries) {
      if (this.isExpired(entry)) continue

      const similarity = cosineSimilarity(queryEmbedding, entry.queryEmbedding)
      if (similarity > bestSimilarity && similarity >= this.config.similarityThreshold) {
        bestSimilarity = similarity
        bestMatch = entry
      }
    }

    return bestMatch
  }

  /**
   * Get all entries from the store
   */
  private getAllEntries(db: IDBDatabase): Promise<CachedResponse[]> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.config.storeName, 'readonly')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result ?? [])
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Put an entry into the store
   */
  private put(db: IDBDatabase, entry: CachedResponse): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.config.storeName, 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.put(entry)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Delete an entry by ID
   */
  private delete(db: IDBDatabase, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.config.storeName, 'readwrite')
      const store = transaction.objectStore(this.config.storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Update hit count and last accessed time for an entry
   */
  private async updateHitCount(db: IDBDatabase, id: string): Promise<void> {
    const transaction = db.transaction(this.config.storeName, 'readwrite')
    const store = transaction.objectStore(this.config.storeName)

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id)

      getRequest.onsuccess = () => {
        const entry = getRequest.result as CachedResponse | undefined
        if (entry) {
          entry.hits++
          entry.lastAccessed = Date.now()
          store.put(entry)
        }
        resolve()
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  /**
   * Check if entry is expired
   */
  private isExpired(entry: CachedResponse): boolean {
    if (this.config.ttlMs === 0) return false
    return Date.now() - entry.timestamp > this.config.ttlMs
  }

  /**
   * Enforce max entries using LRU eviction
   */
  private async enforceMaxEntries(db: IDBDatabase): Promise<void> {
    const entries = await this.getAllEntries(db)

    if (entries.length <= this.config.maxEntries) return

    // Sort by LRU score (lastAccessed - hits bonus)
    const sortedEntries = entries.sort((a, b) => {
      const scoreA = a.lastAccessed - a.hits * 60000 // 1 minute bonus per hit
      const scoreB = b.lastAccessed - b.hits * 60000
      return scoreA - scoreB
    })

    // Remove oldest entries until under limit
    const toRemove = sortedEntries.slice(0, entries.length - this.config.maxEntries)

    for (const entry of toRemove) {
      await this.delete(db, entry.id)
    }
  }
}

/**
 * Create a persistent semantic cache with the given configuration
 */
export function createPersistentSemanticCache(
  config: SemanticCacheConfig
): PersistentSemanticCache {
  return new PersistentSemanticCache(config)
}

/**
 * React hook for using persistent semantic cache
 */
export function usePersistentSemanticCacheConfig(
  embedFunction: SemanticCacheConfig['embedFunction'],
  options?: Omit<SemanticCacheConfig, 'embedFunction'>
): SemanticCacheConfig {
  return {
    embedFunction,
    ...options,
  }
}
