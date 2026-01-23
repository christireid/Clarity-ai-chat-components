/**
 * Rate Limiter
 *
 * Simple token bucket rate limiter for API calls
 */

export interface RateLimiterOptions {
  maxTokens: number
  refillRate: number // tokens per second
}

export interface AcquireOptions {
  /** Maximum time to wait in milliseconds (default: 30000) */
  timeoutMs?: number
  /** AbortSignal for cancellation support */
  signal?: AbortSignal
}

export class RateLimiter {
  private tokens: number
  private maxTokens: number
  private refillRate: number
  private lastRefill: number

  constructor(options: RateLimiterOptions) {
    this.maxTokens = options.maxTokens
    this.refillRate = options.refillRate
    this.tokens = options.maxTokens
    this.lastRefill = Date.now()
  }

  /**
   * Try to acquire a token
   * Returns true if token acquired, false if rate limited
   */
  tryAcquire(): boolean {
    this.refill()

    if (this.tokens >= 1) {
      this.tokens--
      return true
    }

    return false
  }

  /**
   * Wait until a token is available
   *
   * @param options - Timeout and cancellation options
   * @throws {Error} If timeout is reached or signal is aborted
   *
   * @example
   * ```typescript
   * // With timeout
   * await limiter.acquire({ timeoutMs: 5000 })
   *
   * // With cancellation
   * const controller = new AbortController()
   * await limiter.acquire({ signal: controller.signal })
   * controller.abort() // Cancel waiting
   * ```
   */
  async acquire(options?: AcquireOptions): Promise<void> {
    const timeout = options?.timeoutMs ?? 30000 // 30 second default
    const start = Date.now()

    while (!this.tryAcquire()) {
      // Check timeout
      const elapsed = Date.now() - start
      if (elapsed > timeout) {
        throw new Error(
          `Rate limit acquire timeout after ${elapsed}ms (limit: ${timeout}ms)`
        )
      }

      // Check cancellation
      if (options?.signal?.aborted) {
        throw new Error('Rate limit acquire cancelled')
      }

      // Calculate wait time
      const tokensNeeded = 1 - this.tokens
      const baseWaitTime = (tokensNeeded / this.refillRate) * 1000

      // Don't wait longer than remaining timeout
      const remainingTimeout = timeout - elapsed
      const waitTime = Math.min(Math.ceil(baseWaitTime), remainingTimeout)

      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }

      this.refill()
    }
  }

  /**
   * Get current available tokens
   */
  getAvailableTokens(): number {
    this.refill()
    return this.tokens
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000 // seconds
    const tokensToAdd = elapsed * this.refillRate

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
    this.lastRefill = now
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.tokens = this.maxTokens
    this.lastRefill = Date.now()
  }
}
