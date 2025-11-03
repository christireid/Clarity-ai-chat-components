/**
 * Rate Limiting Utilities
 * 
 * Flexible rate limiting with pluggable storage.
 * Bring your own storage backend (memory, Redis, database, etc.)
 */

export interface RateLimitStorage {
  /**
   * Get current request count for a key
   */
  get(key: string): Promise<number>
  
  /**
   * Increment request count
   */
  increment(key: string, ttl: number): Promise<number>
  
  /**
   * Reset request count
   */
  reset(key: string): Promise<void>
}

export interface RateLimitConfig {
  /** Maximum requests allowed */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Storage backend */
  storage: RateLimitStorage
  /** Key generator function */
  keyGenerator?: (identifier: string) => string
  /** Handler for rate limit exceeded */
  onLimitExceeded?: (identifier: string, retryAfter: number) => void
}

export interface RateLimitResult {
  /** Whether request is allowed */
  allowed: boolean
  /** Current request count */
  count: number
  /** Maximum allowed requests */
  limit: number
  /** Time until window resets (ms) */
  retryAfter?: number
  /** Remaining requests in window */
  remaining: number
}

/**
 * In-memory rate limit storage (not shared across processes)
 */
export class MemoryRateLimitStorage implements RateLimitStorage {
  private store = new Map<string, { count: number; expiresAt: number }>()
  
  async get(key: string): Promise<number> {
    const entry = this.store.get(key)
    
    if (!entry) {
      return 0
    }
    
    // Check if expired
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key)
      return 0
    }
    
    return entry.count
  }
  
  async increment(key: string, ttl: number): Promise<number> {
    const entry = this.store.get(key)
    const now = Date.now()
    
    if (!entry || entry.expiresAt < now) {
      this.store.set(key, {
        count: 1,
        expiresAt: now + ttl,
      })
      return 1
    }
    
    entry.count++
    return entry.count
  }
  
  async reset(key: string): Promise<void> {
    this.store.delete(key)
  }
  
  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    const entries = Array.from(this.store.entries())
    for (const [key, entry] of entries) {
      if (entry.expiresAt < now) {
        this.store.delete(key)
      }
    }
  }
}

/**
 * Token Bucket Rate Limiter
 * 
 * Allows bursts of requests up to bucket capacity.
 */
export class TokenBucketRateLimiter {
  private config: RateLimitConfig
  
  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id) => `ratelimit:${id}`,
      ...config,
    }
  }
  
  /**
   * Check if request is allowed and consume a token
   */
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const key = this.config.keyGenerator!(identifier)
    const count = await this.config.storage.increment(key, this.config.windowMs)
    
    const allowed = count <= this.config.maxRequests
    const remaining = Math.max(0, this.config.maxRequests - count)
    
    const result: RateLimitResult = {
      allowed,
      count,
      limit: this.config.maxRequests,
      remaining,
    }
    
    if (!allowed) {
      result.retryAfter = this.config.windowMs
      
      if (this.config.onLimitExceeded) {
        this.config.onLimitExceeded(identifier, this.config.windowMs)
      }
    }
    
    return result
  }
  
  /**
   * Reset limit for identifier
   */
  async reset(identifier: string): Promise<void> {
    const key = this.config.keyGenerator!(identifier)
    await this.config.storage.reset(key)
  }
}

/**
 * Sliding Window Rate Limiter
 * 
 * More accurate than token bucket for distributed systems.
 */
export class SlidingWindowRateLimiter {
  private config: RateLimitConfig
  private timestamps = new Map<string, number[]>()
  
  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id) => `ratelimit:${id}`,
      ...config,
    }
  }
  
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    
    // Get timestamps for this identifier
    let times = this.timestamps.get(identifier) || []
    
    // Remove expired timestamps
    times = times.filter(t => t > windowStart)
    
    // Check limit
    const count = times.length
    const allowed = count < this.config.maxRequests
    
    if (allowed) {
      times.push(now)
      this.timestamps.set(identifier, times)
    }
    
    const result: RateLimitResult = {
      allowed,
      count,
      limit: this.config.maxRequests,
      remaining: Math.max(0, this.config.maxRequests - count),
    }
    
    if (!allowed) {
      // Calculate retry after based on oldest timestamp
      const oldestTime = times[0]
      result.retryAfter = oldestTime + this.config.windowMs - now
      
      if (this.config.onLimitExceeded) {
        this.config.onLimitExceeded(identifier, result.retryAfter)
      }
    }
    
    return result
  }
  
  async reset(identifier: string): Promise<void> {
    this.timestamps.delete(identifier)
  }
  
  /**
   * Clean up old timestamps
   */
  cleanup(): void {
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    
    const entries = Array.from(this.timestamps.entries())
    for (const [key, times] of entries) {
      const filtered = times.filter(t => t > windowStart)
      if (filtered.length === 0) {
        this.timestamps.delete(key)
      } else {
        this.timestamps.set(key, filtered)
      }
    }
  }
}

/**
 * Rate limiter middleware helper
 * 
 * @example
 * ```tsx
 * const limiter = new TokenBucketRateLimiter({
 *   maxRequests: 10,
 *   windowMs: 60000, // 1 minute
 *   storage: new MemoryRateLimitStorage(),
 * })
 * 
 * async function handleRequest(userId: string) {
 *   const result = await withRateLimit(
 *     () => processRequest(),
 *     userId,
 *     limiter
 *   )
 * }
 * ```
 */
export async function withRateLimit<T>(
  fn: () => Promise<T>,
  identifier: string,
  limiter: TokenBucketRateLimiter | SlidingWindowRateLimiter
): Promise<T> {
  const result = await limiter.checkLimit(identifier)
  
  if (!result.allowed) {
    throw new RateLimitError(
      `Rate limit exceeded. Retry after ${result.retryAfter}ms`,
      result
    )
  }
  
  return await fn()
}

/**
 * Rate limit error
 */
export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly limitInfo: RateLimitResult
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

