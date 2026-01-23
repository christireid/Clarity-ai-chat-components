/**
 * Simple LRU Cache Implementation
 *
 * Used for caching embeddings and other expensive operations
 */

export interface CacheOptions {
  maxSize: number
  ttl?: number // Time to live in milliseconds
  maxValueSize?: number // Maximum size per value in bytes
  onEvict?: <K, V>(key: K, value: V, reason: 'size' | 'ttl' | 'lru') => void
}

export class LRUCache<K, V> {
  private cache: Map<K, { value: V; timestamp: number; size: number }>
  private maxSize: number
  private ttl?: number
  private maxValueSize?: number
  private onEvict?: (key: K, value: V, reason: 'size' | 'ttl' | 'lru') => void
  private totalSize: number = 0

  constructor(options: CacheOptions) {
    this.cache = new Map()
    this.maxSize = options.maxSize
    this.ttl = options.ttl
    this.maxValueSize = options.maxValueSize
    this.onEvict = options.onEvict
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key)

    if (!item) {
      return undefined
    }

    // Check TTL
    if (this.ttl && Date.now() - item.timestamp > this.ttl) {
      this.totalSize -= item.size
      if (this.onEvict) {
        this.onEvict(key, item.value, 'ttl')
      }
      this.cache.delete(key)
      return undefined
    }

    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, item)

    return item.value
  }

  set(key: K, value: V): void {
    // Calculate value size
    const size = this.estimateSize(value)

    // Check if value is too large
    if (this.maxValueSize && size > this.maxValueSize) {
      throw new Error(
        `Value size (${size} bytes) exceeds maximum (${this.maxValueSize} bytes)`
      )
    }

    // Remove if exists
    if (this.cache.has(key)) {
      const old = this.cache.get(key)!
      this.totalSize -= old.size
      if (this.onEvict) {
        this.onEvict(key, old.value, 'size')
      }
      this.cache.delete(key)
    }

    // Add new item
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      size,
    })
    this.totalSize += size

    // Evict oldest if over limit
    while (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        const evicted = this.cache.get(firstKey)!
        this.totalSize -= evicted.size
        if (this.onEvict) {
          this.onEvict(firstKey, evicted.value, 'lru')
        }
        this.cache.delete(firstKey)
      }
    }
  }

  has(key: K): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    // Check TTL
    if (this.ttl && Date.now() - item.timestamp > this.ttl) {
      this.totalSize -= item.size
      if (this.onEvict) {
        this.onEvict(key, item.value, 'ttl')
      }
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  /**
   * Clean expired entries
   */
  cleanup(): number {
    if (!this.ttl) return 0

    const now = Date.now()
    let cleaned = 0

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.totalSize -= item.size
        if (this.onEvict) {
          this.onEvict(key, item.value, 'ttl')
        }
        this.cache.delete(key)
        cleaned++
      }
    }

    return cleaned
  }

  /**
   * Estimate size of value in bytes
   */
  private estimateSize(value: V): number {
    if (typeof value === 'string') {
      return value.length * 2 // Rough estimate for UTF-16
    }
    if (typeof value === 'number') {
      return 8
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value).length * 2
    }
    return 100 // Default estimate
  }

  /**
   * Get current cache statistics
   */
  getStats(): {
    size: number
    totalSize: number
    avgSize: number
  } {
    return {
      size: this.cache.size,
      totalSize: this.totalSize,
      avgSize: this.cache.size > 0 ? this.totalSize / this.cache.size : 0,
    }
  }
}
