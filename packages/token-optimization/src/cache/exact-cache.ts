/**
 * ExactCache - O(1) hash-based cache with LRU eviction
 *
 * Tier 1 of the tiered caching system. Provides instant lookups
 * for identical prompts using FNV-1a hashing.
 *
 * @module exact-cache
 */

export interface ExactCacheConfig {
  /** Maximum number of entries */
  maxSize: number
  /** Time-to-live in milliseconds */
  ttl: number
}

export interface ExactCacheResult<T> {
  /** Whether the key was found and valid */
  hit: boolean
  /** The cached value (if hit) */
  value?: T
  /** Age of the entry in milliseconds (if hit) */
  age?: number
}

export interface ExactCacheStats {
  size: number
  hits: number
  misses: number
  hitRate: number
}

interface CacheEntry<T> {
  value: T
  timestamp: number
}

/**
 * High-performance exact-match cache with LRU eviction
 *
 * @example
 * ```typescript
 * const cache = new ExactCache<string>({ maxSize: 1000, ttl: 3600000 })
 *
 * cache.set('What is 2+2?', '4')
 * const result = cache.get('What is 2+2?')
 * // { hit: true, value: '4', age: 0 }
 * ```
 */
export class ExactCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private accessOrder: string[] = []
  private hits = 0
  private misses = 0

  constructor(private config: ExactCacheConfig) {}

  /**
   * Retrieve a value from the cache
   *
   * @param key - The cache key (will be hashed internally)
   * @returns Cache result with hit status, value, and age
   */
  get(key: string): ExactCacheResult<T> {
    const hashedKey = this.hash(key)
    const entry = this.cache.get(hashedKey)

    if (!entry) {
      this.misses++
      return { hit: false }
    }

    const age = Date.now() - entry.timestamp

    // Check TTL expiration
    if (age > this.config.ttl) {
      this.cache.delete(hashedKey)
      this.removeFromAccessOrder(hashedKey)
      this.misses++
      return { hit: false }
    }

    // Update access order (move to end = most recently used)
    this.removeFromAccessOrder(hashedKey)
    this.accessOrder.push(hashedKey)

    this.hits++
    return { hit: true, value: entry.value, age }
  }

  /**
   * Store a value in the cache
   *
   * @param key - The cache key (will be hashed internally)
   * @param value - The value to cache
   */
  set(key: string, value: T): void {
    const hashedKey = this.hash(key)

    // If key exists, remove from access order (will be re-added at end)
    if (this.cache.has(hashedKey)) {
      this.removeFromAccessOrder(hashedKey)
    }

    // Evict LRU entries if at capacity
    while (
      this.cache.size >= this.config.maxSize &&
      this.accessOrder.length > 0
    ) {
      const lruKey = this.accessOrder.shift()
      if (lruKey) {
        this.cache.delete(lruKey)
      }
    }

    this.cache.set(hashedKey, { value, timestamp: Date.now() })
    this.accessOrder.push(hashedKey)
  }

  /**
   * Check if a key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key).hit
  }

  /**
   * Delete a specific key from the cache
   */
  delete(key: string): boolean {
    const hashedKey = this.hash(key)
    this.removeFromAccessOrder(hashedKey)
    return this.cache.delete(hashedKey)
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
    this.hits = 0
    this.misses = 0
  }

  /**
   * Get the current number of entries
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * Get cache statistics
   */
  getStats(): ExactCacheStats {
    const total = this.hits + this.misses
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    }
  }

  /**
   * FNV-1a hash function - fast with good distribution
   *
   * @param input - String to hash
   * @returns Base36-encoded hash string
   */
  hash(input: string): string {
    let hash = 2166136261 // FNV offset basis

    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i)
      hash = Math.imul(hash, 16777619) // FNV prime
      hash = hash >>> 0 // Keep as unsigned 32-bit
    }

    return hash.toString(36)
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }
}
