/**
 * Redis-based Rate Limiting Module
 *
 * Implements sliding window rate limiting using Upstash Redis
 * to prevent API abuse and DoS attacks.
 *
 * SECURITY REQUIREMENTS:
 * - 10 requests per minute per IP (default)
 * - Sliding window algorithm for accurate rate limiting
 * - Redis-backed for distributed rate limiting
 * - Graceful degradation if Redis unavailable
 */

import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

/**
 * Default rate limit: 10 requests per minute per IP
 */
const DEFAULT_MAX_REQUESTS = 10
const DEFAULT_WINDOW = '1 m' // 1 minute sliding window

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  maxRequests?: number
  window?: string
  prefix?: string
}

/**
 * Rate limit result
 */
export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

/**
 * Initialize Redis client from environment variables
 *
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 */
function createRedisClient(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      console.warn(
        'Redis rate limiting disabled: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN not configured'
      )
      return null
    }

    return new Redis({
      url,
      token,
    })
  } catch (error) {
    console.error('Failed to initialize Redis client', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    return null
  }
}

/**
 * Create rate limiter instance
 *
 * Uses sliding window algorithm for accurate rate limiting.
 * Falls back to in-memory rate limiting if Redis unavailable.
 */
function createRateLimiter(config: RateLimitConfig = {}): Ratelimit | null {
  const redis = createRedisClient()

  if (!redis) {
    // Redis not available - will use fallback in-memory rate limiting
    return null
  }

  const maxRequests = config.maxRequests || DEFAULT_MAX_REQUESTS
  const window = config.window || DEFAULT_WINDOW
  const prefix = config.prefix || 'ratelimit:docs-api'

  try {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, window),
      analytics: true, // Enable analytics for monitoring
      prefix,
    })
  } catch (error) {
    console.error('Failed to create rate limiter', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    return null
  }
}

/**
 * Global rate limiter instances (singleton pattern)
 */
let docsApiRateLimiter: Ratelimit | null = null
let liveDemoRateLimiter: Ratelimit | null = null

/**
 * Get rate limiter for docs-assistant API
 */
export function getDocsApiRateLimiter(): Ratelimit | null {
  if (!docsApiRateLimiter) {
    docsApiRateLimiter = createRateLimiter({
      maxRequests: parseInt(process.env.DOCS_API_RATE_LIMIT || '10', 10),
      window: '1 m',
      prefix: 'ratelimit:docs-api',
    })
  }
  return docsApiRateLimiter
}

/**
 * Get rate limiter for live-demo-chat API
 */
export function getLiveDemoRateLimiter(): Ratelimit | null {
  if (!liveDemoRateLimiter) {
    liveDemoRateLimiter = createRateLimiter({
      maxRequests: parseInt(process.env.LIVE_DEMO_RATE_LIMIT || '10', 10),
      window: '1 m',
      prefix: 'ratelimit:live-demo',
    })
  }
  return liveDemoRateLimiter
}

/**
 * In-memory fallback rate limiter
 *
 * Used when Redis is unavailable. Not suitable for production
 * in distributed environments but provides basic protection.
 */
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number
  private readonly maxEntries = 10000 // Prevent unbounded memory growth

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests

    // Cleanup stale entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  /**
   * Cleanup stale entries
   */
  private cleanup() {
    const now = Date.now()
    for (const [key, timestamps] of this.requests.entries()) {
      const valid = timestamps.filter((t) => now - t < this.windowMs)
      if (valid.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, valid)
      }
    }
  }

  /**
   * Evict oldest entry when limit reached
   */
  private evictOldest() {
    let oldestKey: string | null = null
    let oldestTime = Infinity

    for (const [key, timestamps] of this.requests.entries()) {
      const oldest = Math.min(...timestamps)
      if (oldest < oldestTime) {
        oldestTime = oldest
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.requests.delete(oldestKey)
    }
  }

  /**
   * Check rate limit
   */
  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []

    // Filter to only valid requests within window
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    )

    const remaining = Math.max(0, this.maxRequests - validRequests.length)
    const allowed = validRequests.length < this.maxRequests

    if (allowed) {
      // Evict oldest if adding new identifier would exceed limit
      if (
        !this.requests.has(identifier) &&
        this.requests.size >= this.maxEntries
      ) {
        this.evictOldest()
      }

      // Add current request
      validRequests.push(now)
      this.requests.set(identifier, validRequests)
    }

    // Calculate reset time (when oldest request expires)
    const oldestRequest =
      validRequests.length > 0 ? Math.min(...validRequests) : now
    const reset = Math.floor((oldestRequest + this.windowMs) / 1000)

    return {
      allowed,
      limit: this.maxRequests,
      remaining,
      reset,
      retryAfter: allowed ? undefined : Math.ceil((reset * 1000 - now) / 1000),
    }
  }
}

/**
 * Fallback rate limiters
 */
const fallbackDocsApi = new InMemoryRateLimiter(60000, 10)
const fallbackLiveDemo = new InMemoryRateLimiter(60000, 10)

/**
 * Check rate limit for docs-assistant API
 *
 * @param identifier - IP address or user ID
 * @returns Rate limit result
 */
export async function checkDocsApiRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  const limiter = getDocsApiRateLimiter()

  if (!limiter) {
    // Fallback to in-memory rate limiting
    return fallbackDocsApi.limit(identifier)
  }

  try {
    const result = await limiter.limit(identifier)

    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success
        ? undefined
        : Math.ceil((result.reset - Date.now()) / 1000),
    }
  } catch (error) {
    console.error('Rate limit check failed, using fallback', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    // Fallback to in-memory on error
    return fallbackDocsApi.limit(identifier)
  }
}

/**
 * Check rate limit for live-demo-chat API
 *
 * @param identifier - IP address or user ID
 * @returns Rate limit result
 */
export async function checkLiveDemoRateLimit(
  identifier: string
): Promise<RateLimitResult> {
  const limiter = getLiveDemoRateLimiter()

  if (!limiter) {
    // Fallback to in-memory rate limiting
    return fallbackLiveDemo.limit(identifier)
  }

  try {
    const result = await limiter.limit(identifier)

    return {
      allowed: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success
        ? undefined
        : Math.ceil((result.reset - Date.now()) / 1000),
    }
  } catch (error) {
    console.error('Rate limit check failed, using fallback', {
      errorType: error?.constructor?.name || 'Unknown',
      timestamp: new Date().toISOString(),
    })
    // Fallback to in-memory on error
    return fallbackLiveDemo.limit(identifier)
  }
}

/**
 * Get client identifier from request
 *
 * Uses IP address with fallback to user ID or 'anonymous'
 *
 * @param request - Next.js request object
 * @param userId - Optional user ID
 * @returns Client identifier for rate limiting
 */
export function getClientIdentifier(
  request: { headers: Headers; ip?: string },
  userId?: string
): string {
  // Priority: userId > IP > x-forwarded-for > anonymous
  if (userId) {
    return `user:${userId}`
  }

  // Try to get IP from request
  // @ts-expect-error - request.ip exists in Next.js runtime but not in type definitions
  const ip = request.ip

  if (ip) {
    return `ip:${ip}`
  }

  // Try x-forwarded-for header
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim()
    return `ip:${ip}`
  }

  // Fallback to anonymous (not ideal but prevents blocking)
  return 'anonymous'
}

/**
 * Create rate limit headers for response
 *
 * Adds standard rate limit headers to inform clients of limits
 */
export function createRateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }

  if (result.retryAfter !== undefined) {
    headers['Retry-After'] = result.retryAfter.toString()
  }

  return headers
}

/**
 * Export rate limit constants for testing
 */
export const RATE_LIMIT_CONSTANTS = {
  DEFAULT_MAX_REQUESTS,
  DEFAULT_WINDOW,
}
