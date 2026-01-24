/**
 * Tool Executor - Cache Module
 *
 * Provides LRU cache for tool results with TTL-based expiration.
 *
 * @module core/tool-executor/cache
 */

import type { ToolArguments, ToolResult } from '../../types/tool-definition'

/**
 * Cache entry with LRU tracking
 */
interface CacheEntry {
  result: ToolResult
  timestamp: number // When entry was created
  lastAccessed: number // When entry was last accessed (for LRU)
  ttl: number
  accessCount: number // Number of times accessed
}

/**
 * Tool result cache configuration
 */
export interface ToolResultCacheConfig {
  /** Maximum cache size (number of entries, default: 1000) */
  maxSize?: number

  /** Enable periodic cleanup of expired entries (default: false) */
  enablePeriodicCleanup?: boolean

  /** Cleanup interval in milliseconds (default: 60000 = 1 minute) */
  cleanupIntervalMs?: number
}

/**
 * Tool result cache with LRU eviction
 *
 * **Features**:
 * - LRU (Least Recently Used) eviction when maxSize is reached
 * - TTL-based expiration
 * - Optional periodic cleanup of expired entries
 * - Cache hit/miss statistics
 * - Per-tool cache clearing
 *
 * **Usage**:
 * ```typescript
 * const cache = new ToolResultCache({
 *   maxSize: 1000,
 *   enablePeriodicCleanup: true,
 *   cleanupIntervalMs: 60000,
 * })
 * ```
 */
export class ToolResultCache {
  private cache = new Map<string, CacheEntry>()
  private hits = 0
  private misses = 0
  private evictions = 0
  private maxSize: number
  private cleanupIntervalMs: number
  private cleanupTimer?: NodeJS.Timeout | number

  constructor(config: ToolResultCacheConfig = {}) {
    this.maxSize = config.maxSize ?? 1000
    this.cleanupIntervalMs = config.cleanupIntervalMs ?? 60000

    // Start periodic cleanup if enabled
    if (config.enablePeriodicCleanup) {
      this.startPeriodicCleanup()
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startPeriodicCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired()
    }, this.cleanupIntervalMs)

    // Unref timer in Node.js to allow process to exit
    if (typeof this.cleanupTimer === 'object' && 'unref' in this.cleanupTimer) {
      this.cleanupTimer.unref()
    }
  }

  /**
   * Stop periodic cleanup
   */
  stopPeriodicCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer as any)
      this.cleanupTimer = undefined
    }
  }

  /**
   * Clean up expired entries
   * @returns Number of entries removed
   */
  cleanupExpired(): number {
    const now = Date.now()
    let removed = 0

    const allEntries = Array.from(this.cache.entries())
    for (const [key, entry] of allEntries) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
        removed++
      }
    }

    return removed
  }

  /**
   * Evict least recently used entries to make room
   * @param count Number of entries to evict
   */
  private evictLRU(count: number): void {
    // Sort entries by lastAccessed (oldest first)
    const allEntries = Array.from(this.cache.entries())
    const sortedEntries = allEntries.sort(
      ([, a], [, b]) => a.lastAccessed - b.lastAccessed
    )

    // Remove oldest entries
    for (let i = 0; i < Math.min(count, sortedEntries.length); i++) {
      this.cache.delete(sortedEntries[i][0])
      this.evictions++
    }
  }

  /**
   * Generate cache key with robust hashing
   *
   * Handles edge cases:
   * - Circular references (uses [Circular] marker)
   * - Functions (uses function signature)
   * - Dates (uses ISO string)
   * - RegExp (uses source)
   * - Nested objects (recursive hash)
   * - Arrays (preserves order)
   * - Null/undefined (explicit markers)
   *
   * @param toolName - Tool name
   * @param args - Tool arguments
   * @returns Cache key string
   */
  private getCacheKey(toolName: string, args: ToolArguments): string {
    const seen = new WeakSet()

    const hash = (value: unknown): string => {
      // Handle primitives
      if (value === null) return 'null'
      if (value === undefined) return 'undefined'
      if (typeof value === 'string') return `"${value}"`
      if (typeof value === 'number') return String(value)
      if (typeof value === 'boolean') return String(value)

      // Handle functions
      if (typeof value === 'function') {
        return `function:${value.name || 'anonymous'}:${value.length}`
      }

      // Handle Date
      if (value instanceof Date) {
        return `date:${value.toISOString()}`
      }

      // Handle RegExp
      if (value instanceof RegExp) {
        return `regex:${value.source}:${value.flags}`
      }

      // Handle arrays
      if (Array.isArray(value)) {
        return `[${value.map(hash).join(',')}]`
      }

      // Handle objects
      if (typeof value === 'object') {
        // Check for circular references
        if (seen.has(value as object)) {
          return '[Circular]'
        }
        seen.add(value as object)

        // Sort keys for consistent hashing
        const keys = Object.keys(value).sort()
        const pairs = keys.map((key) => `${key}:${hash((value as any)[key])}`)
        return `{${pairs.join(',')}}`
      }

      // Fallback
      return String(value)
    }

    try {
      const argsHash = hash(args)
      return `${toolName}:${argsHash}`
    } catch (error) {
      // Fallback to JSON.stringify if hashing fails
      console.warn('Cache key generation failed, using fallback:', error)
      const sortedArgs = Object.keys(args)
        .sort()
        .reduce(
          (acc, key) => {
            acc[key] = args[key]
            return acc
          },
          {} as Record<string, unknown>
        )

      return `${toolName}:${JSON.stringify(sortedArgs)}`
    }
  }

  /**
   * Get cached result
   */
  get(toolName: string, args: ToolArguments): ToolResult | undefined {
    const key = this.getCacheKey(toolName, args)
    const entry = this.cache.get(key)

    if (!entry) {
      this.misses++
      return undefined
    }

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      this.misses++
      return undefined
    }

    // Update LRU tracking
    entry.lastAccessed = now
    entry.accessCount++

    this.hits++
    return entry.result
  }

  /**
   * Set cache entry
   */
  set(
    toolName: string,
    args: ToolArguments,
    result: ToolResult,
    ttl: number
  ): void {
    const key = this.getCacheKey(toolName, args)
    const now = Date.now()

    // Check if we need to evict entries to make room
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Evict 10% of cache (or at least 1 entry)
      const evictCount = Math.max(1, Math.floor(this.maxSize * 0.1))
      this.evictLRU(evictCount)
    }

    this.cache.set(key, {
      result,
      timestamp: now,
      lastAccessed: now,
      ttl,
      accessCount: 0,
    })
  }

  /**
   * Clear cache for tool
   */
  clear(toolName?: string): void {
    if (!toolName) {
      this.cache.clear()
      return
    }

    const keys = Array.from(this.cache.keys())
    for (const key of keys) {
      if (key.startsWith(`${toolName}:`)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    maxSize: number
    hits: number
    misses: number
    evictions: number
    hitRate: number
    fillRate: number
    entries: Array<{
      toolName: string
      age: number
      lastAccessed: number
      accessCount: number
    }>
  } {
    const entries: Array<{
      toolName: string
      age: number
      lastAccessed: number
      accessCount: number
    }> = []
    const now = Date.now()

    const allEntries = Array.from(this.cache.entries())
    for (const [key, entry] of allEntries) {
      const toolName = key.split(':')[0]
      entries.push({
        toolName,
        age: now - entry.timestamp,
        lastAccessed: entry.lastAccessed,
        accessCount: entry.accessCount,
      })
    }

    const total = this.hits + this.misses
    const hitRate = total > 0 ? this.hits / total : 0
    const fillRate = this.maxSize > 0 ? this.cache.size / this.maxSize : 0

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate,
      fillRate,
      entries,
    }
  }

  /**
   * Destroy cache and stop periodic cleanup
   */
  destroy(): void {
    this.stopPeriodicCleanup()
    this.cache.clear()
  }
}
