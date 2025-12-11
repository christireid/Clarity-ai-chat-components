/**
 * Caching Utilities
 *
 * In-memory caching with LRU eviction, TTL expiration, and memoization helpers.
 *
 * @module @clarity-chat/utils/cache
 *
 * @example
 * ```ts
 * import { LRUCache, TTLCache, memoize } from '@clarity-chat/utils/cache'
 *
 * const cache = new LRUCache<string, Data>(100)
 * cache.set('key', data)
 *
 * const cachedFn = memoize(expensiveFn, { maxSize: 50 })
 * ```
 */

import { createHash } from 'node:crypto'

/**
 * Generate a SHA-256 hash of content (truncated to 16 chars)
 *
 * @param content - String content to hash
 * @returns 16-character hex hash string
 *
 * @example
 * ```ts
 * getContentHash('hello world') // "b94d27b9934d3e08"
 * ```
 */
export function getContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex').slice(0, 16)
}

/**
 * Create a cache key from multiple inputs
 *
 * @param inputs - Array of strings to combine into a key
 * @returns Hashed cache key
 *
 * @example
 * ```ts
 * createCacheKey('user', '123', 'profile') // "a1b2c3d4e5f6g7h8"
 * ```
 */
export function createCacheKey(...inputs: string[]): string {
  return getContentHash(inputs.join(':'))
}

/**
 * Simple in-memory LRU (Least Recently Used) cache
 *
 * Items are evicted when the cache exceeds maxSize, starting with the
 * least recently accessed items.
 *
 * @example
 * ```ts
 * const cache = new LRUCache<string, User>(100)
 *
 * cache.set('user:1', user)
 * const user = cache.get('user:1')
 *
 * if (cache.has('user:1')) {
 *   cache.delete('user:1')
 * }
 * ```
 */
export class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly maxSize: number

  constructor(maxSize: number) {
    this.maxSize = maxSize
  }

  /**
   * Get a value from the cache
   * Accessing a value moves it to the end (most recently used)
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
   * Evicts the oldest entry if at capacity
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
   * Check if a key exists in the cache
   */
  has(key: K): boolean {
    return this.cache.has(key)
  }

  /**
   * Delete a key from the cache
   */
  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get the current number of entries in the cache
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * Get an iterator over all keys
   */
  keys(): IterableIterator<K> {
    return this.cache.keys()
  }

  /**
   * Get an iterator over all values
   */
  values(): IterableIterator<V> {
    return this.cache.values()
  }

  /**
   * Get an iterator over all entries
   */
  entries(): IterableIterator<[K, V]> {
    return this.cache.entries()
  }
}

/**
 * Time-based cache with automatic expiration
 *
 * Entries automatically expire after their TTL (Time To Live).
 *
 * @example
 * ```ts
 * const cache = new TTLCache<string, Token>(60000) // 1 minute default TTL
 *
 * cache.set('session', token) // Uses default TTL
 * cache.set('temp', data, 5000) // Custom 5s TTL
 *
 * // Returns undefined if expired
 * const token = cache.get('session')
 * ```
 */
export class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>()
  private readonly defaultTTL: number

  /**
   * Create a new TTL cache
   * @param defaultTTLMs - Default time-to-live in milliseconds
   */
  constructor(defaultTTLMs: number) {
    this.defaultTTL = defaultTTLMs
  }

  /**
   * Get a value from the cache
   * Returns undefined if the entry has expired
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
   * Set a value in the cache with optional custom TTL
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlMs - Optional TTL override in milliseconds
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
   * Delete a key from the cache
   */
  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Remove all expired entries
   * @returns Number of entries removed
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
   * Get the current number of entries (including potentially expired)
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * Get remaining TTL for a key in milliseconds
   * Returns 0 if key doesn't exist or is expired
   */
  getTTL(key: K): number {
    const entry = this.cache.get(key)
    if (!entry) return 0
    const remaining = entry.expiry - Date.now()
    return remaining > 0 ? remaining : 0
  }
}

/**
 * Options for memoization
 */
export interface MemoizeOptions<Args extends unknown[]> {
  /** Maximum cache size (default: 100) */
  maxSize?: number
  /** Time-to-live in milliseconds (if set, uses TTL instead of LRU) */
  ttlMs?: number
  /** Custom key generation function */
  keyFn?: (...args: Args) => string
}

/**
 * Memoize a synchronous function
 *
 * Caches function results based on arguments. Uses LRU eviction by default,
 * or TTL expiration if ttlMs is specified.
 *
 * @param fn - Function to memoize
 * @param options - Memoization options
 * @returns Memoized function
 *
 * @example
 * ```ts
 * const expensiveCalc = (n: number) => { /* ... *\/ }
 *
 * const cached = memoize(expensiveCalc, { maxSize: 50 })
 * cached(42) // Computes
 * cached(42) // Returns cached result
 *
 * // With custom key function
 * const cached2 = memoize(
 *   (user: User) => fetchData(user),
 *   { keyFn: (user) => user.id }
 * )
 * ```
 */
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
  options: MemoizeOptions<Args> = {}
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
 * Memoize an async function
 *
 * Caches the returned Promise, so concurrent calls with the same arguments
 * will share the same Promise. Failed promises are removed from cache.
 *
 * @param fn - Async function to memoize
 * @param options - Memoization options
 * @returns Memoized async function
 *
 * @example
 * ```ts
 * const fetchUser = async (id: string) => { /* ... *\/ }
 *
 * const cachedFetch = memoizeAsync(fetchUser, { ttlMs: 60000 })
 *
 * // Both calls share the same request
 * const [user1, user2] = await Promise.all([
 *   cachedFetch('123'),
 *   cachedFetch('123'),
 * ])
 * ```
 */
export function memoizeAsync<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options: MemoizeOptions<Args> = {}
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
