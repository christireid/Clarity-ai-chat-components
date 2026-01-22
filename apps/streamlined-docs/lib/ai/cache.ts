/**
 * Caching Utilities for AI APIs
 *
 * Provides in-memory caching with TTL support for API responses.
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
  etag: string
}

// In-memory cache store
const cache = new Map<string, CacheEntry<unknown>>()

// Default TTL: 1 hour
const DEFAULT_TTL = 60 * 60 * 1000

/**
 * Generate a simple hash for ETag
 */
function generateETag(data: unknown): string {
  const str = JSON.stringify(data)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `"${Math.abs(hash).toString(16)}"`
}

/**
 * Get cached data
 */
export function getFromCache<T>(key: string): CacheEntry<T> | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined

  if (!entry) {
    return null
  }

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    cache.delete(key)
    return null
  }

  return entry
}

/**
 * Set data in cache
 */
export function setInCache<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL
): CacheEntry<T> {
  const entry: CacheEntry<T> = {
    data,
    expiresAt: Date.now() + ttl,
    etag: generateETag(data),
  }

  cache.set(key, entry)
  return entry
}

/**
 * Invalidate cache entry
 */
export function invalidateCache(key: string): void {
  cache.delete(key)
}

/**
 * Invalidate cache entries matching a pattern
 */
export function invalidateCachePattern(pattern: string): void {
  const regex = new RegExp(pattern)
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key)
    }
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  cache.clear()
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number
  keys: string[]
  memoryUsage: number
} {
  const keys = Array.from(cache.keys())

  // Rough memory estimate
  let memoryUsage = 0
  for (const entry of cache.values()) {
    memoryUsage += JSON.stringify(entry).length * 2 // UTF-16 chars
  }

  return {
    size: cache.size,
    keys,
    memoryUsage,
  }
}

/**
 * Cached function decorator
 *
 * Usage:
 * ```
 * const getCachedData = cached('my-key', async () => {
 *   return fetchData()
 * }, 60000)
 *
 * const data = await getCachedData()
 * ```
 */
export function cached<T>(
  key: string,
  fn: () => T | Promise<T>,
  ttl: number = DEFAULT_TTL
): () => Promise<T> {
  return async (): Promise<T> => {
    const existing = getFromCache<T>(key)
    if (existing) {
      return existing.data
    }

    const data = await fn()
    setInCache(key, data, ttl)
    return data
  }
}

/**
 * Create cache headers for response
 */
export function createCacheHeaders(
  entry: CacheEntry<unknown> | null,
  maxAge: number = 3600
): Record<string, string> {
  const headers: Record<string, string> = {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 24}`,
  }

  if (entry) {
    headers['ETag'] = entry.etag
    headers['Last-Modified'] = new Date(
      entry.expiresAt - DEFAULT_TTL
    ).toUTCString()
  }

  return headers
}

/**
 * Check if request has matching ETag
 */
export function checkETag(
  request: Request,
  entry: CacheEntry<unknown> | null
): boolean {
  if (!entry) return false

  const ifNoneMatch = request.headers.get('If-None-Match')
  if (ifNoneMatch && ifNoneMatch === entry.etag) {
    return true
  }

  return false
}

// Clean up expired entries periodically
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key)
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}
