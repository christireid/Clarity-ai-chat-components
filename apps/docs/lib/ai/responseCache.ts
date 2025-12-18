/**
 * Response Cache
 *
 * Caches AI responses to reduce API costs and improve response times.
 * Uses query content + RAG context as cache key for accuracy.
 */

import { Redis } from '@upstash/redis'
import crypto from 'crypto'

export interface CachedResponse {
  query: string
  response: string
  sources?: Array<{ url: string; title: string; confidence: number }>
  model: string
  timestamp: string
  hits: number
}

export interface CacheStats {
  totalQueries: number
  cacheHits: number
  cacheMisses: number
  hitRate: number
  estimatedSavings: number // in USD
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
    }
  ): Promise<void>

  /** Get cache statistics */
  getStats(): Promise<CacheStats>

  /** Clear cache */
  clear(): Promise<void>
}

/**
 * Generate cache key from query and optional context
 */
function generateCacheKey(query: string, contextHash?: string): string {
  const normalizedQuery = query.toLowerCase().trim()
  const content = contextHash
    ? `${normalizedQuery}:${contextHash}`
    : normalizedQuery

  return crypto.createHash('sha256').update(content).digest('hex')
}

/**
 * Redis Response Cache (Production)
 */
export class RedisResponseCache implements ResponseCache {
  private redis: Redis
  private defaultTTL: number // in seconds

  constructor(ttl = 24 * 60 * 60) {
    // Default: 24 hours
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set'
      )
    }

    this.redis = new Redis({ url, token })
    this.defaultTTL = ttl
  }

  private getCacheKey(query: string, contextHash?: string): string {
    const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
    const hash = generateCacheKey(query, contextHash)
    return `${prefix}:${hash}`
  }

  private getStatsKey(): string {
    const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
    return `${prefix}:stats`
  }

  async get(query: string, contextHash?: string): Promise<CachedResponse | null> {
    const key = this.getCacheKey(query, contextHash)
    const cached = await this.redis.get(key)

    if (cached) {
      const response = cached as CachedResponse

      // Increment hit counter
      response.hits = (response.hits || 0) + 1
      await this.redis.set(key, response, { ex: this.defaultTTL })

      // Track cache hit
      await this.redis.hincrby(this.getStatsKey(), 'hits', 1)

      logger.debug(`✅ Cache HIT for query: "${query.substring(0, 50)}..."`)
      return response
    }

    // Track cache miss
    await this.redis.hincrby(this.getStatsKey(), 'misses', 1)

    logger.debug(`❌ Cache MISS for query: "${query.substring(0, 50)}..."`)
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
    }
  ): Promise<void> {
    const key = this.getCacheKey(query, options.contextHash)
    const ttl = options.ttl || this.defaultTTL

    const cachedResponse: CachedResponse = {
      query,
      response,
      sources: options.sources,
      model: options.model || 'unknown',
      timestamp: new Date().toISOString(),
      hits: 0,
    }

    await this.redis.set(key, cachedResponse, { ex: ttl })

    logger.debug(`💾 Cached response for query: "${query.substring(0, 50)}..."`)
  }

  async getStats(): Promise<CacheStats> {
    const stats = await this.redis.hgetall(this.getStatsKey())
    const hits = parseInt((stats?.hits as string) || '0')
    const misses = parseInt((stats?.misses as string) || '0')
    const total = hits + misses
    const hitRate = total > 0 ? (hits / total) * 100 : 0

    // Estimate savings: assume $0.0015 per query (GPT-4 average)
    const estimatedSavings = hits * 0.0015

    return {
      totalQueries: total,
      cacheHits: hits,
      cacheMisses: misses,
      hitRate,
      estimatedSavings,
    }
  }

  async clear(): Promise<void> {
    const prefix = process.env.CACHE_PREFIX || 'clarity-response-cache'
    const keys = await this.redis.keys(`${prefix}:*`)

    if (keys.length > 0) {
      await this.redis.del(...keys)
    }

    logger.debug(`🗑️  Cleared ${keys.length} cached responses`)
  }
}

/**
 * Local Response Cache (Development)
 */
export class LocalResponseCache implements ResponseCache {
  private cache: Map<string, CachedResponse> = new Map()
  private stats = { hits: 0, misses: 0 }

  async get(query: string, contextHash?: string): Promise<CachedResponse | null> {
    const key = generateCacheKey(query, contextHash)
    const cached = this.cache.get(key)

    if (cached) {
      // Increment hit counter
      cached.hits++
      this.stats.hits++

      logger.debug(`✅ Cache HIT (local) for query: "${query.substring(0, 50)}..."`)
      return cached
    }

    this.stats.misses++
    logger.debug(`❌ Cache MISS (local) for query: "${query.substring(0, 50)}..."`)
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
    }
  ): Promise<void> {
    const key = generateCacheKey(query, options.contextHash)

    const cachedResponse: CachedResponse = {
      query,
      response,
      sources: options.sources,
      model: options.model || 'unknown',
      timestamp: new Date().toISOString(),
      hits: 0,
    }

    this.cache.set(key, cachedResponse)

    logger.debug(`💾 Cached response (local) for query: "${query.substring(0, 50)}..."`)

    // Auto-cleanup: remove oldest entries if cache grows too large
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }
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
    }
  }

  async clear(): Promise<void> {
    const size = this.cache.size
    this.cache.clear()
    this.stats = { hits: 0, misses: 0 }

    logger.debug(`🗑️  Cleared ${size} cached responses (local)`)
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
    logger.debug('Using Redis response cache (Upstash)')
    return new RedisResponseCache()
  } else {
    logger.debug('Using local response cache (development mode)')
    return new LocalResponseCache()
  }
}

/**
 * Generate context hash for RAG queries
 * Uses source URLs to create a stable hash
 */
export function generateContextHash(sources: Array<{ url: string }>): string {
  const urls = sources.map(s => s.url).sort().join(',')
  return crypto.createHash('md5').update(urls).digest('hex').substring(0, 8)
}
