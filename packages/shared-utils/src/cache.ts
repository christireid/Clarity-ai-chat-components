/**
 * Caching Utilities
 *
 * Shared caching utilities including LRU cache and content hashing
 */

import { createHash } from 'node:crypto'

/**
 * Get content hash for a string
 */
export function getContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16)
}

/**
 * Create a cache key from multiple inputs
 */
export function createCacheKey(...inputs: string[]): string {
  return getContentHash(inputs.join(':'))
}

/**
 * Simple in-memory LRU cache
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly maxSize: number

  constructor(maxSize: number) {
    this.maxSize = maxSize
  }

  /**
   * Get a value from the cache
   */
  get(key: K): V | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  /**
   * Set a value in the cache
   */
  set(key: K, value: V): void {
    // Remove existing to update position
    this.cache.delete(key)

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldest = this.cache.keys().next().value
      if (oldest !== undefined) {
        this.cache.delete(oldest)
      }
    }

    this.cache.set(key, value)
  }

  /**
   * Check if a key exists
   */
  has(key: K): boolean {
    return this.cache.has(key)
  }

  /**
   * Delete a key
   */
  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * Get all keys
   */
  keys(): IterableIterator<K> {
    return this.cache.keys()
  }

  /**
   * Get all values
   */
  values(): IterableIterator<V> {
    return this.cache.values()
  }

  /**
   * Get all entries
   */
  entries(): IterableIterator<[K, V]> {
    return this.cache.entries()
  }
}

/**
 * Time-based cache with expiration
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>()
  private readonly defaultTTL: number

  constructor(defaultTTLMs: number) {
    this.defaultTTL = defaultTTLMs
  }

  /**
   * Get a value from the cache
   */
  get(key: K): V | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiry) {
      this.cache.delete(key)
      return undefined
    }

    return entry.value
  }

  /**
   * Set a value in the cache
   */
  set(key: K, value: V, ttlMs?: number): void {
    const expiry = Date.now() + (ttlMs ?? this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: K): boolean {
    return this.get(key) !== undefined
  }

  /**
   * Delete a key
   */
  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove expired entries
   */
  prune(): number {
    const now = Date.now()
    let removed = 0

    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key)
        removed++
      }
    }

    return removed
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size
  }
}

/**
 * Memoize a function with optional TTL
 */
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  options: {
    maxSize?: number
    ttlMs?: number
    keyFn?: (...args: Args) => string
  } = {}
): (...args: Args) => Result {
  const { maxSize = 100, ttlMs, keyFn } = options

  const cache = ttlMs
    ? new TTLCache<string, Result>(ttlMs)
    : new LRUCache<string, Result>(maxSize)

  return (...args: Args): Result => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args)

    const cached = cache.get(key)
    if (cached !== undefined) {
      return cached
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * Async memoize with optional TTL
 */
export function memoizeAsync<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options: {
    maxSize?: number
    ttlMs?: number
    keyFn?: (...args: Args) => string
  } = {}
): (...args: Args) => Promise<Result> {
  const { maxSize = 100, ttlMs, keyFn } = options

  const cache = ttlMs
    ? new TTLCache<string, Promise<Result>>(ttlMs)
    : new LRUCache<string, Promise<Result>>(maxSize)

  return async (...args: Args): Promise<Result> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args)

    const cached = cache.get(key)
    if (cached !== undefined) {
      return cached
    }

    const promise = fn(...args)
    cache.set(key, promise)

    try {
      return await promise
    } catch (err) {
      // Remove failed promises from cache
      cache.delete(key)
      throw err
    }
  }
}
