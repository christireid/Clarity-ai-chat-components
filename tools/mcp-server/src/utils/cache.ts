/**
 * Simple in-memory cache with TTL support
 */

interface CacheEntry<T> {
  data: T
  expires: number
}

export class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private defaultTTL: number

  constructor(defaultTTL: number = 5 * 60 * 1000) { // 5 minutes default
    this.defaultTTL = defaultTTL
  }

  /**
   * Get cached value if not expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    if (entry.expires < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Set cached value with TTL
   */
  set(key: string, value: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { data: value, expires })
  }

  /**
   * Delete cached value
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) {
      return false
    }
    if (entry.expires < Date.now()) {
      this.cache.delete(key)
      return false
    }
    return true
  }

  /**
   * Clean expired entries
   */
  clean(): number {
    const now = Date.now()
    let cleaned = 0
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires < now) {
        this.cache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }
}
