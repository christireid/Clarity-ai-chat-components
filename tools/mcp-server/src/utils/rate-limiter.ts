/**
 * Rate Limiter for MCP Server
 *
 * Implements token bucket and sliding window rate limiting
 * to protect against abuse and ensure fair usage.
 *
 * @module utils/rate-limiter
 */

import { logger } from './logger.js'
import { serverEvents } from './events.js'

// =============================================================================
// Rate Limiter Types
// =============================================================================

export interface RateLimitConfig {
  /** Maximum requests per window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Block duration when limit exceeded (ms) */
  blockDurationMs?: number
  /** Enable sliding window (more accurate) */
  slidingWindow?: boolean
  /** Custom key generator */
  keyGenerator?: (context: RequestContext) => string
  /** Skip rate limiting based on context */
  skip?: (context: RequestContext) => boolean
  /** Custom response when rate limited */
  onRateLimited?: (context: RequestContext, retryAfter: number) => void
  /** Maximum number of entries to track (prevents memory issues) */
  maxEntries?: number
}

export interface RequestContext {
  type: 'tool' | 'resource' | 'prompt'
  name: string
  clientId?: string
  timestamp: number
}

interface RateLimitEntry {
  count: number
  windowStart: number
  requests: number[] // timestamps for sliding window
  blockedUntil?: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  retryAfterMs?: number
  windowResetMs: number
}

// =============================================================================
// Rate Limiter Implementation
// =============================================================================

/**
 * Token Bucket / Sliding Window Rate Limiter
 */
export class RateLimiter {
  private entries = new Map<string, RateLimitEntry>()
  private config: Required<RateLimitConfig> & { maxEntries: number }
  private cleanupInterval: ReturnType<typeof setInterval>

  constructor(config: RateLimitConfig) {
    this.config = {
      maxRequests: config.maxRequests,
      windowMs: config.windowMs,
      blockDurationMs: config.blockDurationMs ?? 0,
      slidingWindow: config.slidingWindow ?? true,
      keyGenerator: config.keyGenerator ?? this.defaultKeyGenerator,
      skip: config.skip ?? (() => false),
      onRateLimited:
        config.onRateLimited ??
        ((ctx, retryAfter) => {
          logger.warn('Rate limit exceeded', {
            key: this.config.keyGenerator(ctx),
            retryAfter,
          })
        }),
      maxEntries: config.maxEntries ?? 10000, // Default max 10k entries
    }

    // Cleanup expired entries periodically
    this.cleanupInterval = setInterval(
      () => this.cleanup(),
      Math.min(this.config.windowMs, 60000)
    )

    // Allow process to exit even if interval is running
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref()
    }
  }

  /**
   * Default key generator - uses type:name
   */
  private defaultKeyGenerator(context: RequestContext): string {
    return `${context.type}:${context.name}`
  }

  /**
   * Check if request is allowed
   */
  check(context: RequestContext): RateLimitResult {
    // Check if should skip rate limiting
    if (this.config.skip(context)) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        limit: this.config.maxRequests,
        windowResetMs: 0,
      }
    }

    const key = this.config.keyGenerator(context)
    const now = context.timestamp
    let entry = this.entries.get(key)

    // Check if currently blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
      const retryAfterMs = entry.blockedUntil - now

      serverEvents.emit('ratelimit:exceeded', {
        clientId: context.clientId ?? key,
        limit: this.config.maxRequests,
      })

      return {
        allowed: false,
        remaining: 0,
        limit: this.config.maxRequests,
        retryAfterMs,
        windowResetMs: retryAfterMs,
      }
    }

    // Initialize or reset entry if window expired
    if (!entry || now - entry.windowStart >= this.config.windowMs) {
      // Enforce max entries limit before adding new entry
      if (!entry && this.entries.size >= this.config.maxEntries) {
        this.evictOldestEntries(Math.floor(this.config.maxEntries * 0.1)) // Remove 10%
      }

      entry = {
        count: 0,
        windowStart: now,
        requests: [],
      }
      this.entries.set(key, entry)
    }

    if (this.config.slidingWindow) {
      return this.checkSlidingWindow(key, entry, context)
    } else {
      return this.checkFixedWindow(key, entry, context)
    }
  }

  /**
   * Fixed window rate limiting
   */
  private checkFixedWindow(
    key: string,
    entry: RateLimitEntry,
    context: RequestContext
  ): RateLimitResult {
    const now = context.timestamp
    const windowResetMs = entry.windowStart + this.config.windowMs - now

    if (entry.count >= this.config.maxRequests) {
      // Apply block if configured
      if (this.config.blockDurationMs > 0) {
        entry.blockedUntil = now + this.config.blockDurationMs
      }

      this.config.onRateLimited(context, windowResetMs)

      serverEvents.emit('ratelimit:exceeded', {
        clientId: context.clientId ?? key,
        limit: this.config.maxRequests,
      })

      return {
        allowed: false,
        remaining: 0,
        limit: this.config.maxRequests,
        retryAfterMs: windowResetMs,
        windowResetMs,
      }
    }

    entry.count++
    const remaining = this.config.maxRequests - entry.count

    // Emit warning if running low
    if (remaining <= this.config.maxRequests * 0.1) {
      serverEvents.emit('ratelimit:warning', {
        clientId: context.clientId ?? key,
        remaining,
      })
    }

    return {
      allowed: true,
      remaining,
      limit: this.config.maxRequests,
      windowResetMs,
    }
  }

  /**
   * Sliding window rate limiting (more accurate)
   */
  private checkSlidingWindow(
    key: string,
    entry: RateLimitEntry,
    context: RequestContext
  ): RateLimitResult {
    const now = context.timestamp
    const windowStart = now - this.config.windowMs

    // Remove expired requests
    entry.requests = entry.requests.filter((ts) => ts > windowStart)

    const windowResetMs =
      entry.requests.length > 0
        ? entry.requests[0] + this.config.windowMs - now
        : this.config.windowMs

    if (entry.requests.length >= this.config.maxRequests) {
      // Apply block if configured
      if (this.config.blockDurationMs > 0) {
        entry.blockedUntil = now + this.config.blockDurationMs
      }

      const retryAfterMs = entry.requests[0] + this.config.windowMs - now
      this.config.onRateLimited(context, retryAfterMs)

      serverEvents.emit('ratelimit:exceeded', {
        clientId: context.clientId ?? key,
        limit: this.config.maxRequests,
      })

      return {
        allowed: false,
        remaining: 0,
        limit: this.config.maxRequests,
        retryAfterMs,
        windowResetMs,
      }
    }

    entry.requests.push(now)
    const remaining = this.config.maxRequests - entry.requests.length

    // Emit warning if running low
    if (remaining <= this.config.maxRequests * 0.1) {
      serverEvents.emit('ratelimit:warning', {
        clientId: context.clientId ?? key,
        remaining,
      })
    }

    return {
      allowed: true,
      remaining,
      limit: this.config.maxRequests,
      windowResetMs,
    }
  }

  /**
   * Consume a request (call after successful check)
   * Note: check() already increments, this is for explicit consumption
   */
  consume(context: RequestContext, tokens = 1): boolean {
    const result = this.check(context)
    return result.allowed
  }

  /**
   * Get current limit status for a context
   */
  getStatus(context: RequestContext): RateLimitResult {
    const key = this.config.keyGenerator(context)
    const entry = this.entries.get(key)
    const now = Date.now()

    if (!entry) {
      return {
        allowed: true,
        remaining: this.config.maxRequests,
        limit: this.config.maxRequests,
        windowResetMs: this.config.windowMs,
      }
    }

    if (this.config.slidingWindow) {
      const windowStart = now - this.config.windowMs
      const activeRequests = entry.requests.filter((ts) => ts > windowStart)
      return {
        allowed: activeRequests.length < this.config.maxRequests,
        remaining: Math.max(0, this.config.maxRequests - activeRequests.length),
        limit: this.config.maxRequests,
        windowResetMs:
          activeRequests.length > 0
            ? activeRequests[0] + this.config.windowMs - now
            : this.config.windowMs,
      }
    }

    const windowResetMs = Math.max(
      0,
      entry.windowStart + this.config.windowMs - now
    )
    return {
      allowed: entry.count < this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      limit: this.config.maxRequests,
      windowResetMs,
    }
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(context: RequestContext): void {
    const key = this.config.keyGenerator(context)
    this.entries.delete(key)
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.entries.clear()
  }

  /**
   * Evict oldest entries to make room for new ones
   */
  private evictOldestEntries(count: number): void {
    if (count <= 0) return

    // Sort entries by windowStart (oldest first)
    const sorted = Array.from(this.entries.entries())
      .sort(([, a], [, b]) => a.windowStart - b.windowStart)

    // Delete the oldest entries
    for (let i = 0; i < Math.min(count, sorted.length); i++) {
      this.entries.delete(sorted[i][0])
    }

    logger.debug('Evicted rate limit entries', { evicted: count, remaining: this.entries.size })
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    for (const [key, entry] of this.entries) {
      // Remove if window expired and not blocked
      if (
        entry.windowStart < windowStart &&
        (!entry.blockedUntil || entry.blockedUntil < now)
      ) {
        this.entries.delete(key)
      }
    }
  }

  /**
   * Stop the cleanup interval
   */
  destroy(): void {
    clearInterval(this.cleanupInterval)
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalEntries: number
    blockedEntries: number
  } {
    const now = Date.now()
    let blockedCount = 0

    for (const entry of this.entries.values()) {
      if (entry.blockedUntil && entry.blockedUntil > now) {
        blockedCount++
      }
    }

    return {
      totalEntries: this.entries.size,
      blockedEntries: blockedCount,
    }
  }
}

// =============================================================================
// Environment-based Configuration
// =============================================================================

const parseEnvInt = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

// =============================================================================
// Pre-configured Rate Limiters
// =============================================================================

/**
 * Default rate limiter for tool calls
 * Default: 100 requests per minute per tool (configurable via env)
 */
export const toolRateLimiter = new RateLimiter({
  maxRequests: parseEnvInt(process.env.MCP_TOOL_RATE_LIMIT, 100),
  windowMs: parseEnvInt(process.env.MCP_TOOL_RATE_WINDOW_MS, 60 * 1000),
  slidingWindow: true,
  keyGenerator: (ctx) => `tool:${ctx.name}`,
  maxEntries: parseEnvInt(process.env.MCP_RATE_LIMIT_MAX_ENTRIES, 10000),
})

/**
 * Rate limiter for resource reads
 * Default: 200 requests per minute per resource (configurable via env)
 */
export const resourceRateLimiter = new RateLimiter({
  maxRequests: parseEnvInt(process.env.MCP_RESOURCE_RATE_LIMIT, 200),
  windowMs: parseEnvInt(process.env.MCP_RESOURCE_RATE_WINDOW_MS, 60 * 1000),
  slidingWindow: true,
  keyGenerator: (ctx) => `resource:${ctx.name}`,
  maxEntries: parseEnvInt(process.env.MCP_RATE_LIMIT_MAX_ENTRIES, 10000),
})

/**
 * Global rate limiter
 * Default: 500 requests per minute total (configurable via env)
 */
export const globalRateLimiter = new RateLimiter({
  maxRequests: parseEnvInt(process.env.MCP_GLOBAL_RATE_LIMIT, 500),
  windowMs: parseEnvInt(process.env.MCP_GLOBAL_RATE_WINDOW_MS, 60 * 1000),
  slidingWindow: true,
  keyGenerator: () => 'global',
  maxEntries: parseEnvInt(process.env.MCP_RATE_LIMIT_MAX_ENTRIES, 10000),
})

// =============================================================================
// Rate Limit Middleware
// =============================================================================

export interface RateLimitError extends Error {
  retryAfterMs: number
  remaining: number
  limit: number
}

/**
 * Create a rate limit error
 */
export function createRateLimitError(result: RateLimitResult): RateLimitError {
  const error = new Error(
    `Rate limit exceeded. Retry after ${result.retryAfterMs}ms`
  ) as RateLimitError
  error.name = 'RateLimitError'
  error.retryAfterMs = result.retryAfterMs ?? 0
  error.remaining = result.remaining
  error.limit = result.limit
  return error
}

/**
 * Apply rate limiting to an async function
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  limiter: RateLimiter,
  getContext: (...args: Parameters<T>) => RequestContext
): T {
  return (async (...args: Parameters<T>) => {
    const context = getContext(...args)
    const result = limiter.check(context)

    if (!result.allowed) {
      throw createRateLimitError(result)
    }

    return fn(...args)
  }) as T
}
