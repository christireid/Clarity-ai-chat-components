/**
 * Enhanced in-memory cache with TTL, LRU eviction, and statistics
 */

import { logger } from './logger.js'

interface CacheEntry<T> {
  data: T
  expires: number
  createdAt: number
}

interface CacheOptions {
  /** Default TTL in milliseconds (default: 5 minutes) */
  defaultTTL?: number
  /** Maximum number of entries (default: 100) */
  maxSize?: number
  /** Name for logging purposes */
  name?: string
}

export class Cache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private defaultTTL: number
  private maxSize: number
  private name: string
  private hits = 0
  private misses = 0

  constructor(options: CacheOptions | number = {}) {
    // Support legacy number argument for backwards compatibility
    if (typeof options === 'number') {
      this.defaultTTL = options
      this.maxSize = 100
      this.name = 'cache'
    } else {
      this.defaultTTL = options.defaultTTL ?? 5 * 60 * 1000
      this.maxSize = options.maxSize ?? 100
      this.name = options.name ?? 'cache'
    }
  }

  /**
   * Get cached value if not expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      this.misses++
      return null
    }

    if (entry.expires < Date.now()) {
      this.cache.delete(key)
      this.misses++
      logger.debug(`[${this.name}] Cache expired`, { key })
      return null
    }

    this.hits++
    logger.debug(`[${this.name}] Cache hit`, { key })

    // LRU: Move to end by re-inserting
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry.data
  }

  /**
   * Set cached value with TTL
   */
  set(key: string, value: T, ttl?: number): void {
    // Evict oldest entry if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        this.cache.delete(oldestKey)
        logger.debug(`[${this.name}] Evicted oldest entry`, { key: oldestKey })
      }
    }

    const now = Date.now()
    const expires = now + (ttl ?? this.defaultTTL)
    this.cache.set(key, { data: value, expires, createdAt: now })
    logger.debug(`[${this.name}] Cache set`, { key, ttl: ttl ?? this.defaultTTL })
  }

  /**
   * Delete cached value
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
    logger.info(`[${this.name}] Cache cleared`)
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

    if (cleaned > 0) {
      logger.debug(`[${this.name}] Cleaned expired entries`, { count: cleaned })
    }

    return cleaned
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number
    maxSize: number
    hits: number
    misses: number
    hitRate: number
  } {
    const total = this.hits + this.misses
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0
    }
  }

  /**
   * Get or compute a value using a factory function
   */
  async getOrSet(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get(key)
    if (cached !== null) {
      return cached
    }

    const value = await factory()
    this.set(key, value, ttl)
    return value
  }

  /**
   * Get all keys in cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  /**
   * Get current size
   */
  get size(): number {
    return this.cache.size
  }
}

/**
 * Cache key generators for MCP resources
 */
export const CacheKeys = {
  projectAnalysis: (path: string) => `project:analysis:${path}`,
  projectValidation: (path: string) => `project:validation:${path}`,
  modelInfo: (model: string) => `model:info:${model}`,
  example: (name: string) => `example:${name}`,
  exampleList: () => 'examples:list'
}

/**
 * Parse environment variable as integer with default
 */
const parseEnvInt = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Pre-configured cache instances for different resource types
 * All values configurable via environment variables
 */

// Project cache - short TTL as project files may change
export const projectCache = new Cache<unknown>({
  defaultTTL: parseEnvInt(process.env.MCP_PROJECT_CACHE_TTL, 30 * 1000), // 30 seconds
  maxSize: parseEnvInt(process.env.MCP_PROJECT_CACHE_SIZE, 50),
  name: 'project'
})

// Model info cache - long TTL as model info is static
export const modelCache = new Cache<unknown>({
  defaultTTL: parseEnvInt(process.env.MCP_MODEL_CACHE_TTL, 60 * 60 * 1000), // 1 hour
  maxSize: parseEnvInt(process.env.MCP_MODEL_CACHE_SIZE, 20),
  name: 'model'
})

// Examples cache - long TTL as examples are static
export const exampleCache = new Cache<unknown>({
  defaultTTL: parseEnvInt(process.env.MCP_EXAMPLE_CACHE_TTL, 60 * 60 * 1000), // 1 hour
  maxSize: parseEnvInt(process.env.MCP_EXAMPLE_CACHE_SIZE, 30),
  name: 'example'
})

// Cleanup interval (configurable via env)
const cleanupIntervalMs = parseEnvInt(process.env.MCP_CACHE_CLEANUP_INTERVAL, 5 * 60 * 1000)

// Start periodic cleanup
const cleanupInterval = setInterval(() => {
  projectCache.clean()
  modelCache.clean()
  exampleCache.clean()
}, cleanupIntervalMs)

// Unref to allow process to exit
if (cleanupInterval.unref) {
  cleanupInterval.unref()
}

// Allow cleanup interval to be cleared for testing
export function stopCacheCleanup(): void {
  clearInterval(cleanupInterval)
}
