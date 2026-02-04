/**
 * LRU cache implementation for link metadata
 */

import type { LinkMetadata } from './types'

export interface CacheEntry {
  metadata: LinkMetadata
  timestamp: number
}

export const DEFAULT_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
export const DEFAULT_MAX_CACHE_SIZE = 100

export class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly maxSize: number

  constructor(maxSize: number = DEFAULT_MAX_CACHE_SIZE) {
    this.maxSize = maxSize
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined

    // Move to end (most recently used)
    const value = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }

  set(key: K, value: V): void {
    // Delete if exists to update position
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, value)
  }

  delete(key: K): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }

  has(key: K): boolean {
    return this.cache.has(key)
  }
}

export function getCachedMetadata(
  cache: LRUCache<string, CacheEntry>,
  url: string,
  cacheDuration: number
): LinkMetadata | null {
  const entry = cache.get(url)
  if (!entry) return null

  const isExpired = Date.now() - entry.timestamp > cacheDuration
  if (isExpired) {
    cache.delete(url)
    return null
  }

  return entry.metadata
}

export function setCachedMetadata(
  cache: LRUCache<string, CacheEntry>,
  url: string,
  metadata: LinkMetadata
): void {
  cache.set(url, { metadata, timestamp: Date.now() })
}
