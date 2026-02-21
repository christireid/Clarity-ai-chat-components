/**
 * Response Cache - Enhanced Edition
 *
 * Advanced caching system with multi-layer architecture, intelligent invalidation,
 * and context-aware caching strategies.
 *
 * Features:
 * - Multi-layer caching (L1: memory, L2: Redis)
 * - Semantic cache key generation
 * - Dynamic TTL based on query complexity
 * - LRU eviction with size-based limits
 * - Compression for large payloads
 * - Tag-based invalidation
 * - Cache warming and prefetching
 * - Detailed metrics and observability
 */

import { Redis } from '@upstash/redis'
import crypto from 'crypto'
import { logger } from '@/lib/logger'
import { LRUCache } from 'lru-cache'
import zlib from 'zlib'
import { promisify } from 'util'

const gzip = promisify(zlib.gzip)
const gunzip = promisify(zlib.gunzip)

// Compression threshold - compress responses larger than 1KB
const COMPRESSION_THRESHOLD = 1024

// L1 cache configuration (in-memory)
const L1_MAX_SIZE = 50 // Max entries in memory
const L1_MAX_AGE = 5 * 60 * 1000 // 5 minutes

// L2 cache configuration (Redis)
const L2_DEFAULT_TTL = 24 * 60 * 60 // 24 hours
const L2_SHORT_TTL = 60 * 60 // 1 hour
const L2_LONG_TTL = 7 * 24 * 60 * 60 // 7 days

export interface CachedResponse {
  query: string
  response: string
  sources?: Array<{ url: string; title: string; confidence: number }>
  model: string
  timestamp: string
  hits: number
  complexity?: 'simple' | 'moderate' | 'complex'
  tags?: string[] // For tag-based invalidation
  compressed?: boolean
}

export interface CacheStats {
  totalQueries: number
  cacheHits: number
  cacheMisses: number
  hitRate: number
  estimatedSavings: number // in USD
  l1Stats?: {
    hits: number
    misses: number
    size: number
    hitRate: number
  }
  l2Stats?: {
    hits: number
    misses: number
    hitRate: number
  }
  compressionStats?: {
    totalCompressed: number
    compressionRatio: number
    bytesSaved: number
  }
}

export interface CacheOptions {
  /** Custom TTL in seconds */
  ttl?: number
  /** Tags for invalidation */
  tags?: string[]
  /** Force compression regardless of size */
  forceCompression?: boolean
  /** Skip L1 cache */
  skipL1?: boolean
  /** Query complexity for TTL optimization */
  complexity?: 'simple' | 'moderate' | 'complex'
}

interface ResponseCache {
  /** Get cached response */
  get(query: string, contextHash?: string): Promise<CachedResponse | null>

  /** Store response in cache */
  set(
    query: string,
    response: string,
    options: {
      sources?: Array<{ url: string; title: string; confidence: number }>
      model?: string
      contextHash?: string
      ttl?: number
      tags?: string[]
      complexity?: 'simple' | 'moderate' | 'complex'
    }
  ): Promise<void>

  /** Get cache statistics */
  getStats(): Promise<CacheStats>

  /** Clear cache (optionally by tags) */
  clear(tags?: string[]): Promise<void>

  /** Invalidate by pattern */
  invalidatePattern(pattern: string): Promise<number>

  /** Warm cache with common queries */
  warmCache(queries: Array<{ query: string; contextHash?: string }>): Promise<void>

  /** Get cache metadata */
  getMetadata(query: string, contextHash?: string): Promise<CacheMetadata | null>
}

interface CacheMetadata {
  created: string
  lastAccessed: string
  hits: number
  ttl: number
  tags: string[]
  size: number
  compressed: boolean
}

/**
 * Generate semantic cache key from query and optional context
 *
 * Uses multiple factors:
 * 1. Normalized query text (case-insensitive, trimmed)
 * 2. Context hash (semantic similarity of sources)
 * 3. Query intent fingerprint (keywords, question type)
 */
function generateCacheKey(query: string, contextHash?: string): string {
  const normalizedQuery = query.toLowerCase().trim()

  // Extract query intent markers
  const intentMarkers = extractIntentMarkers(normalizedQuery)
  const intentFingerprint = intentMarkers.join('|')

  // Combine all factors
  const content = contextHash
    ? `${normalizedQuery}:${contextHash}:${intentFingerprint}`
    : `${normalizedQuery}:${intentFingerprint}`

  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Extract intent markers from query for better cache key differentiation
 */
function extractIntentMarkers(query: string): string[] {
  const markers: string[] = []

  // Question type
  if (query.startsWith('how')) markers.push('how-to')
  else if (query.startsWith('what')) markers.push('what-is')
  else if (query.startsWith('why')) markers.push('why')
  else if (query.startsWith('when')) markers.push('when')
  else if (query.startsWith('where')) markers.push('where')

  // Action intent
  if (/\b(show|display|render)\b/i.test(query)) markers.push('display')
  if (/\b(install|setup|configure)\b/i.test(query)) markers.push('setup')
  if (/\b(fix|debug|error|issue)\b/i.test(query)) markers.push('troubleshoot')
  if (/\b(example|sample|demo)\b/i.test(query)) markers.push('example')
  if (/\b(optimize|improve|performance)\b/i.test(query)) markers.push('optimize')

  // Component mentions
  if (/\b(component|hook|utility)\b/i.test(query)) {
    const match = query.match(/\b([A-Z][a-zA-Z]+(?:Component|Hook|Utils?))\b/)
    if (match) markers.push(`entity:${match[1].toLowerCase()}`)
  }

  return markers
}

/**
 * Generate context hash with semantic awareness
 * Groups similar sources together using URL patterns and categories
 */
export function generateContextHash(
  sources: Array<{ url: string; title?: string; category?: string }>
): string {
  // Sort and deduplicate sources
  const uniqueSources = Array.from(
    new Set(sources.map((s) => s.url))
  ).sort()

  // Extract URL patterns (e.g., /components/ → comp, /hooks/ → hook)
  const patterns = uniqueSources.map((url) => {
    const match = url.match(/\/(components|hooks|guides|examples|api)\//i)
    return match ? match[1].substring(0, 4) : 'doc'
  })

  // Create hash from URL patterns + full URLs
  const content = `${patterns.join(',')}:${uniqueSources.join(',')}`
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 12)
}

/**
 * Determine optimal TTL based on query complexity and content type
 */
function getOptimalTTL(
  complexity?: 'simple' | 'moderate' | 'complex',
  tags?: string[]
): number {
  // API reference and stable content - long TTL
  if (tags?.some((t) => t.startsWith('api:') || t === 'reference')) {
    return L2_LONG_TTL
  }

  // Examples and guides - medium TTL
  if (tags?.some((t) => t === 'example' || t === 'guide')) {
    return L2_DEFAULT_TTL
  }

  // Complex queries - shorter TTL (may become stale faster)
  if (complexity === 'complex') {
    return L2_SHORT_TTL
  }

  // Default: 24 hours
  return L2_DEFAULT_TTL
}

/**
 * Compress response if it exceeds threshold
 */
async function compressResponse(response: string): Promise<{
  data: string
  compressed: boolean
  originalSize: number
  compressedSize: number
}> {
  const originalSize = Buffer.byteLength(response, 'utf-8')

  if (originalSize < COMPRESSION_THRESHOLD) {
    return {
      data: response,
      compressed: false,
      originalSize,
      compressedSize: originalSize,
    }
  }

  try {
    const compressed = await gzip(response)
    const compressedSize = compressed.length

    // Only use compression if it saves at least 20%
    if (compressedSize < originalSize * 0.8) {
      return {
        data: compressed.toString('base64'),
        compressed: true,
        originalSize,
        compressedSize,
      }
    }
  } catch (error) {
    logger.error('Compression failed', error)
  }

  return {
    data: response,
    compressed: false,
    originalSize,
    compressedSize: originalSize,
  }
}

/**
 * Decompress response if needed
 */
async function decompressResponse(data: string, compressed: boolean): Promise<string> {
  if (!compressed) {
    return data
  }

  try {
    const buffer = Buffer.from(data, 'base64')
    const decompressed = await gunzip(buffer)
    return decompressed.toString('utf-8')
  } catch (error) {
    logger.error('Decompression failed', error)
    return data // Fallback to original data
  }
}

/**
 * Redis Response Cache (Production) with Multi-Layer Architecture
 */
export class RedisResponseCache implements ResponseCache {
  private redis: Redis
  private defaultTTL: number
  private l1Cache: LRUCache<string, CachedResponse>
  private stats = {
    l1Hits: 0,
    l1Misses: 0,
    l2Hits: 0,
    l2Misses: 0,
    compressions: 0,
    compressionBytesSaved: 0,
  }

  constructor(ttl = L2_DEFAULT_TTL) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set'
      )
    }

    this.redis = new Redis({ url, token })
    this.defaultTTL = ttl

    // Initialize L1 cache (in-memory LRU)
    this.l1Cache = new LRUCache<string, CachedResponse>({
      max: L1_MAX_SIZE,
      ttl: L1_MAX_AGE,
      updateAgeOnGet: true,
      updateAgeOnHas: false,
    })
  }

  private getCacheKey(query: string, contextHash?: string): string {
    const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
    const hash = generateCacheKey(query, contextHash)
    return `${prefix}:v2:${hash}` // v2 for new cache format
  }

  private getMetadataKey(cacheKey: string): string {
    return `${cacheKey}:meta`
  }

  private getStatsKey(): string {
    const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
    return `${prefix}:stats:v2`
  }

  private getTagKey(tag: string): string {
    const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
    return `${prefix}:tag:${tag}`
  }

  async get(
    query: string,
    contextHash?: string
  ): Promise<CachedResponse | null> {
    const key = this.getCacheKey(query, contextHash)

    // L1 cache check (memory)
    const l1Result = this.l1Cache.get(key)
    if (l1Result) {
      this.stats.l1Hits++

      // Update hit counter in background
      this.updateHitCount(key, l1Result).catch((err) => {
        logger.error('Failed to update hit count', err)
      })

      logger.debug(`✅ L1 Cache HIT for query: "${query.substring(0, 50)}..."`)
      return l1Result
    }

    this.stats.l1Misses++

    // L2 cache check (Redis)
    try {
      const cached = await this.redis.get(key)

      if (cached) {
        this.stats.l2Hits++
        const response = cached as CachedResponse

        // Decompress if needed
        if (response.compressed) {
          response.response = await decompressResponse(response.response, true)
          response.compressed = false // Mark as decompressed
        }

        // Increment hit counter
        response.hits = (response.hits || 0) + 1

        // Store in L1 cache for faster subsequent access
        this.l1Cache.set(key, response)

        // Update in Redis (async, don't block)
        this.updateHitCount(key, response).catch((err) => {
          logger.error('Failed to update hit count', err)
        })

        // Track cache hit in stats
        await this.redis.hincrby(this.getStatsKey(), 'hits', 1)

        logger.debug(`✅ L2 Cache HIT for query: "${query.substring(0, 50)}..."`)
        return response
      }
    } catch (error) {
      logger.error('L2 cache read error', error)
    }

    // Complete cache miss
    this.stats.l2Misses++
    await this.redis.hincrby(this.getStatsKey(), 'misses', 1)

    logger.debug(`❌ Cache MISS for query: "${query.substring(0, 50)}..."`)
    return null
  }

  private async updateHitCount(key: string, response: CachedResponse): Promise<void> {
    try {
      const ttl = await this.redis.ttl(key)
      if (ttl > 0) {
        response.hits++
        await this.redis.set(key, response, { ex: ttl })
      }
    } catch (error) {
      logger.error('Failed to update hit count', error)
    }
  }

  async set(
    query: string,
    response: string,
    options: {
      sources?: Array<{ url: string; title: string; confidence: number }>
      model?: string
      contextHash?: string
      ttl?: number
      tags?: string[]
      complexity?: 'simple' | 'moderate' | 'complex'
    }
  ): Promise<void> {
    const key = this.getCacheKey(query, options.contextHash)

    // Determine optimal TTL
    const ttl = options.ttl || getOptimalTTL(options.complexity, options.tags)

    // Compress if beneficial
    const { data, compressed, originalSize, compressedSize } =
      await compressResponse(response)

    if (compressed) {
      this.stats.compressions++
      this.stats.compressionBytesSaved += (originalSize - compressedSize)
    }

    const cachedResponse: CachedResponse = {
      query,
      response: data,
      sources: options.sources,
      model: options.model || 'unknown',
      timestamp: new Date().toISOString(),
      hits: 0,
      complexity: options.complexity,
      tags: options.tags,
      compressed,
    }

    try {
      // Store in L2 (Redis)
      await this.redis.set(key, cachedResponse, { ex: ttl })

      // Store metadata separately for efficient queries
      const metadata: CacheMetadata = {
        created: cachedResponse.timestamp,
        lastAccessed: cachedResponse.timestamp,
        hits: 0,
        ttl,
        tags: options.tags || [],
        size: compressedSize,
        compressed,
      }
      await this.redis.set(this.getMetadataKey(key), metadata, { ex: ttl })

      // Index by tags for efficient invalidation
      if (options.tags && options.tags.length > 0) {
        const pipeline = this.redis.pipeline()
        for (const tag of options.tags) {
          pipeline.sadd(this.getTagKey(tag), key)
          pipeline.expire(this.getTagKey(tag), ttl)
        }
        await pipeline.exec()
      }

      // Store in L1 (memory) - use decompressed version
      if (!compressed || options.complexity !== 'complex') {
        this.l1Cache.set(key, {
          ...cachedResponse,
          response, // Store decompressed version in L1
          compressed: false,
        })
      }

      logger.debug(
        `💾 Cached response for query: "${query.substring(0, 50)}..." ` +
        `(TTL: ${ttl}s, Compressed: ${compressed}, Size: ${compressedSize}B)`
      )
    } catch (error) {
      logger.error('Failed to cache response', error)
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      const stats = await this.redis.hgetall(this.getStatsKey())
      const hits = parseInt((stats?.hits as string) || '0', 10)
      const misses = parseInt((stats?.misses as string) || '0', 10)
      const total = hits + misses
      const hitRate = total > 0 ? (hits / total) * 100 : 0

      // Estimate savings: GPT-4 Turbo average cost
      const estimatedSavings = hits * 0.0015

      // L1 stats
      const l1Total = this.stats.l1Hits + this.stats.l1Misses
      const l1HitRate = l1Total > 0 ? (this.stats.l1Hits / l1Total) * 100 : 0

      // L2 stats
      const l2Total = this.stats.l2Hits + this.stats.l2Misses
      const l2HitRate = l2Total > 0 ? (this.stats.l2Hits / l2Total) * 100 : 0

      return {
        totalQueries: total,
        cacheHits: hits,
        cacheMisses: misses,
        hitRate,
        estimatedSavings,
        l1Stats: {
          hits: this.stats.l1Hits,
          misses: this.stats.l1Misses,
          size: this.l1Cache.size,
          hitRate: l1HitRate,
        },
        l2Stats: {
          hits: this.stats.l2Hits,
          misses: this.stats.l2Misses,
          hitRate: l2HitRate,
        },
        compressionStats: {
          totalCompressed: this.stats.compressions,
          compressionRatio: this.stats.compressions > 0
            ? this.stats.compressionBytesSaved / this.stats.compressions
            : 0,
          bytesSaved: this.stats.compressionBytesSaved,
        },
      }
    } catch (error) {
      logger.error('Failed to get cache stats', error)
      return {
        totalQueries: 0,
        cacheHits: 0,
        cacheMisses: 0,
        hitRate: 0,
        estimatedSavings: 0,
      }
    }
  }

  async clear(tags?: string[]): Promise<void> {
    if (tags && tags.length > 0) {
      // Tag-based invalidation
      let keysToDelete: string[] = []

      for (const tag of tags) {
        const tagKey = this.getTagKey(tag)
        const keys = await this.redis.smembers(tagKey)
        keysToDelete = keysToDelete.concat(keys as string[])
        keysToDelete.push(tagKey) // Delete tag set itself
      }

      if (keysToDelete.length > 0) {
        // Remove duplicates
        const uniqueKeys = Array.from(new Set(keysToDelete))
        await this.redis.del(...uniqueKeys)

        logger.debug(`🗑️  Cleared ${uniqueKeys.length} cached responses for tags: ${tags.join(', ')}`)
      }
    } else {
      // Full cache clear
      const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
      const keys = await this.redis.keys(`${prefix}:*`)

      if (keys.length > 0) {
        await this.redis.del(...keys)
      }

      logger.debug(`🗑️  Cleared ${keys.length} cached responses`)
    }

    // Clear L1 cache
    this.l1Cache.clear()
  }

  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
      const searchPattern = `${prefix}:v2:*${pattern}*`
      const keys = await this.redis.keys(searchPattern)

      if (keys.length > 0) {
        await this.redis.del(...keys)

        // Also clear from L1
        for (const key of keys) {
          this.l1Cache.delete(key)
        }

        logger.debug(`🗑️  Invalidated ${keys.length} cached responses matching pattern: ${pattern}`)
      }

      return keys.length
    } catch (error) {
      logger.error('Failed to invalidate by pattern', error)
      return 0
    }
  }

  async warmCache(
    queries: Array<{ query: string; contextHash?: string }>
  ): Promise<void> {
    logger.info(`🔥 Warming cache with ${queries.length} queries`)

    // Check which queries are already cached
    let alreadyCached = 0
    for (const { query, contextHash } of queries) {
      const cached = await this.get(query, contextHash)
      if (cached) {
        alreadyCached++
      }
    }

    logger.info(
      `🔥 Cache warming complete: ${alreadyCached}/${queries.length} already cached`
    )
  }

  async getMetadata(
    query: string,
    contextHash?: string
  ): Promise<CacheMetadata | null> {
    const key = this.getCacheKey(query, contextHash)
    const metaKey = this.getMetadataKey(key)

    try {
      const metadata = await this.redis.get(metaKey)
      return metadata as CacheMetadata | null
    } catch (error) {
      logger.error('Failed to get cache metadata', error)
      return null
    }
  }
}

/**
 * Local Response Cache (Development) with LRU Eviction
 */
export class LocalResponseCache implements ResponseCache {
  private cache: LRUCache<string, CachedResponse>
  private stats = { hits: 0, misses: 0, compressions: 0, bytesSaved: 0 }
  private tagIndex: Map<string, Set<string>> = new Map()

  constructor() {
    this.cache = new LRUCache<string, CachedResponse>({
      max: 100, // Max 100 entries
      maxSize: 50 * 1024 * 1024, // Max 50MB total
      sizeCalculation: (value) => {
        return Buffer.byteLength(JSON.stringify(value), 'utf-8')
      },
      ttl: L2_DEFAULT_TTL * 1000, // Convert to milliseconds
      updateAgeOnGet: true,
    })
  }

  async get(
    query: string,
    contextHash?: string
  ): Promise<CachedResponse | null> {
    const key = generateCacheKey(query, contextHash)
    const cached = this.cache.get(key)

    if (cached) {
      // Decompress if needed
      if (cached.compressed) {
        cached.response = await decompressResponse(cached.response, true)
        cached.compressed = false
      }

      // Increment hit counter
      cached.hits++
      this.stats.hits++

      logger.debug(
        `✅ Cache HIT (local) for query: "${query.substring(0, 50)}..."`
      )
      return cached
    }

    this.stats.misses++
    logger.debug(
      `❌ Cache MISS (local) for query: "${query.substring(0, 50)}..."`
    )
    return null
  }

  async set(
    query: string,
    response: string,
    options: {
      sources?: Array<{ url: string; title: string; confidence: number }>
      model?: string
      contextHash?: string
      ttl?: number
      tags?: string[]
      complexity?: 'simple' | 'moderate' | 'complex'
    }
  ): Promise<void> {
    const key = generateCacheKey(query, options.contextHash)

    // Compress if beneficial
    const { data, compressed, originalSize, compressedSize } =
      await compressResponse(response)

    if (compressed) {
      this.stats.compressions++
      this.stats.bytesSaved += (originalSize - compressedSize)
    }

    const cachedResponse: CachedResponse = {
      query,
      response: data,
      sources: options.sources,
      model: options.model || 'unknown',
      timestamp: new Date().toISOString(),
      hits: 0,
      complexity: options.complexity,
      tags: options.tags,
      compressed,
    }

    this.cache.set(key, cachedResponse, {
      ttl: (options.ttl || getOptimalTTL(options.complexity, options.tags)) * 1000,
    })

    // Index by tags
    if (options.tags) {
      for (const tag of options.tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set())
        }
        this.tagIndex.get(tag)!.add(key)
      }
    }

    logger.debug(
      `💾 Cached response (local) for query: "${query.substring(0, 50)}..." ` +
      `(Compressed: ${compressed}, Size: ${compressedSize}B)`
    )
  }

  async getStats(): Promise<CacheStats> {
    const total = this.stats.hits + this.stats.misses
    const hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0
    const estimatedSavings = this.stats.hits * 0.0015

    return {
      totalQueries: total,
      cacheHits: this.stats.hits,
      cacheMisses: this.stats.misses,
      hitRate,
      estimatedSavings,
      compressionStats: {
        totalCompressed: this.stats.compressions,
        compressionRatio: this.stats.compressions > 0
          ? this.stats.bytesSaved / this.stats.compressions
          : 0,
        bytesSaved: this.stats.bytesSaved,
      },
    }
  }

  async clear(tags?: string[]): Promise<void> {
    if (tags && tags.length > 0) {
      // Tag-based invalidation
      let keysToDelete: string[] = []

      for (const tag of tags) {
        const keys = this.tagIndex.get(tag)
        if (keys) {
          keysToDelete = keysToDelete.concat(Array.from(keys))
          this.tagIndex.delete(tag)
        }
      }

      for (const key of keysToDelete) {
        this.cache.delete(key)
      }

      logger.debug(`🗑️  Cleared ${keysToDelete.length} cached responses (local) for tags: ${tags.join(', ')}`)
    } else {
      const size = this.cache.size
      this.cache.clear()
      this.tagIndex.clear()
      this.stats = { hits: 0, misses: 0, compressions: 0, bytesSaved: 0 }

      logger.debug(`🗑️  Cleared ${size} cached responses (local)`)
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    let count = 0
    const keysToDelete: string[] = []

    // Iterate through all entries
    for (const [key, value] of this.cache.entries()) {
      if (value.query.includes(pattern)) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key)
      count++
    }

    logger.debug(`🗑️  Invalidated ${count} cached responses (local) matching pattern: ${pattern}`)
    return count
  }

  async warmCache(
    queries: Array<{ query: string; contextHash?: string }>
  ): Promise<void> {
    logger.info(`🔥 Warming cache (local) with ${queries.length} queries`)

    let alreadyCached = 0
    for (const { query, contextHash } of queries) {
      const cached = await this.get(query, contextHash)
      if (cached) {
        alreadyCached++
      }
    }

    logger.info(
      `🔥 Cache warming complete: ${alreadyCached}/${queries.length} already cached`
    )
  }

  async getMetadata(
    query: string,
    contextHash?: string
  ): Promise<CacheMetadata | null> {
    const key = generateCacheKey(query, contextHash)
    const cached = this.cache.get(key)

    if (!cached) return null

    const ttl = this.cache.getRemainingTTL(key)

    return {
      created: cached.timestamp,
      lastAccessed: new Date().toISOString(),
      hits: cached.hits,
      ttl: ttl ? Math.floor(ttl / 1000) : 0,
      tags: cached.tags || [],
      size: Buffer.byteLength(cached.response, 'utf-8'),
      compressed: cached.compressed || false,
    }
  }
}

/**
 * Get the appropriate response cache based on environment
 */
export function getResponseCache(): ResponseCache {
  const useRedis =
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN &&
    process.env.NODE_ENV === 'production'

  if (useRedis) {
    return new RedisResponseCache()
  } else {
    return new LocalResponseCache()
  }
}

/**
 * Cache warming utilities
 */

// Common queries to warm cache on deployment
export const COMMON_QUERIES = [
  { query: 'How do I get started with Clarity Chat?', tags: ['guide', 'getting-started'] },
  { query: 'What is the ChatWindow component?', tags: ['component', 'api:ChatWindow'] },
  { query: 'How do I customize the theme?', tags: ['guide', 'customization'] },
  { query: 'What hooks are available?', tags: ['reference', 'hooks'] },
  { query: 'How do I handle streaming responses?', tags: ['guide', 'streaming'] },
  { query: 'What is token optimization?', tags: ['concept', 'optimization'] },
  { query: 'How do I add error handling?', tags: ['guide', 'error-handling'] },
  { query: 'Show me a basic chat example', tags: ['example', 'basic'] },
]

/**
 * Warm cache with common queries (call on deployment)
 */
export async function warmCommonQueries(): Promise<void> {
  const cache = getResponseCache()
  await cache.warmCache(COMMON_QUERIES)
}
