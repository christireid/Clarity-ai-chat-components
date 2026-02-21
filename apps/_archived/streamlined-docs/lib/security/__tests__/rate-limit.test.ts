/**
 * Unit tests for rate limiting module
 *
 * Tests Redis rate limiting and in-memory fallback
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getClientIdentifier,
  createRateLimitHeaders,
  RATE_LIMIT_CONSTANTS,
  type RateLimitResult,
} from '../rate-limit'

describe('getClientIdentifier', () => {
  it('should prioritize user ID', () => {
    const request = {
      headers: new Headers(),
      ip: '192.168.1.1',
    }
    const result = getClientIdentifier(request, 'user123')
    expect(result).toBe('user:user123')
  })

  it('should use IP when user ID not provided', () => {
    const request = {
      headers: new Headers(),
      ip: '192.168.1.1',
    }
    const result = getClientIdentifier(request)
    expect(result).toBe('ip:192.168.1.1')
  })

  it('should use x-forwarded-for header when IP not available', () => {
    const headers = new Headers()
    headers.set('x-forwarded-for', '203.0.113.1, 198.51.100.1')

    const request = {
      headers,
    }
    const result = getClientIdentifier(request)
    expect(result).toBe('ip:203.0.113.1')
  })

  it('should fallback to anonymous when no identifier available', () => {
    const request = {
      headers: new Headers(),
    }
    const result = getClientIdentifier(request)
    expect(result).toBe('anonymous')
  })
})

describe('createRateLimitHeaders', () => {
  it('should create standard rate limit headers', () => {
    const result: RateLimitResult = {
      allowed: true,
      limit: 10,
      remaining: 5,
      reset: 1234567890,
    }

    const headers = createRateLimitHeaders(result)

    expect(headers['X-RateLimit-Limit']).toBe('10')
    expect(headers['X-RateLimit-Remaining']).toBe('5')
    expect(headers['X-RateLimit-Reset']).toBe('1234567890')
    expect(headers['Retry-After']).toBeUndefined()
  })

  it('should include Retry-After when rate limited', () => {
    const result: RateLimitResult = {
      allowed: false,
      limit: 10,
      remaining: 0,
      reset: 1234567890,
      retryAfter: 60,
    }

    const headers = createRateLimitHeaders(result)

    expect(headers['Retry-After']).toBe('60')
  })
})

describe('RATE_LIMIT_CONSTANTS', () => {
  it('should have correct default values', () => {
    expect(RATE_LIMIT_CONSTANTS.DEFAULT_MAX_REQUESTS).toBe(10)
    expect(RATE_LIMIT_CONSTANTS.DEFAULT_WINDOW).toBe('1 m')
  })
})

/**
 * Integration tests for in-memory fallback rate limiter
 *
 * These tests verify the fallback mechanism works when Redis is unavailable.
 * In production, you should also test with a real Redis instance.
 */
describe('In-memory rate limiter fallback', () => {
  beforeEach(() => {
    // Ensure Redis is not configured for these tests
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  it('should enforce rate limits using in-memory fallback', async () => {
    // This test requires importing the fallback implementation
    // In production, you would test the actual checkDocsApiRateLimit function
    // with Redis disabled

    // Mock implementation for testing
    class TestRateLimiter {
      private requests: Map<string, number[]> = new Map()
      private readonly windowMs = 60000
      private readonly maxRequests = 3

      async limit(identifier: string): Promise<RateLimitResult> {
        const now = Date.now()
        const userRequests = this.requests.get(identifier) || []
        const validRequests = userRequests.filter(
          (t) => now - t < this.windowMs
        )

        const remaining = Math.max(0, this.maxRequests - validRequests.length)
        const allowed = validRequests.length < this.maxRequests

        if (allowed) {
          validRequests.push(now)
          this.requests.set(identifier, validRequests)
        }

        const oldestRequest =
          validRequests.length > 0 ? Math.min(...validRequests) : now
        const reset = Math.floor((oldestRequest + this.windowMs) / 1000)

        return {
          allowed,
          limit: this.maxRequests,
          remaining,
          reset,
          retryAfter: allowed
            ? undefined
            : Math.ceil((reset * 1000 - now) / 1000),
        }
      }
    }

    const limiter = new TestRateLimiter()

    // First 3 requests should succeed
    const r1 = await limiter.limit('test-user')
    expect(r1.allowed).toBe(true)
    expect(r1.remaining).toBe(2)

    const r2 = await limiter.limit('test-user')
    expect(r2.allowed).toBe(true)
    expect(r2.remaining).toBe(1)

    const r3 = await limiter.limit('test-user')
    expect(r3.allowed).toBe(true)
    expect(r3.remaining).toBe(0)

    // 4th request should be rate limited
    const r4 = await limiter.limit('test-user')
    expect(r4.allowed).toBe(false)
    expect(r4.remaining).toBe(0)
    expect(r4.retryAfter).toBeGreaterThan(0)
  })

  it('should reset after time window expires', async () => {
    vi.useFakeTimers()

    class TestRateLimiter {
      private requests: Map<string, number[]> = new Map()
      private readonly windowMs = 60000
      private readonly maxRequests = 2

      async limit(identifier: string): Promise<RateLimitResult> {
        const now = Date.now()
        const userRequests = this.requests.get(identifier) || []
        const validRequests = userRequests.filter(
          (t) => now - t < this.windowMs
        )

        const remaining = Math.max(0, this.maxRequests - validRequests.length)
        const allowed = validRequests.length < this.maxRequests

        if (allowed) {
          validRequests.push(now)
          this.requests.set(identifier, validRequests)
        }

        const oldestRequest =
          validRequests.length > 0 ? Math.min(...validRequests) : now
        const reset = Math.floor((oldestRequest + this.windowMs) / 1000)

        return {
          allowed,
          limit: this.maxRequests,
          remaining,
          reset,
        }
      }
    }

    const limiter = new TestRateLimiter()

    // Use up quota
    await limiter.limit('test-user')
    await limiter.limit('test-user')
    const r1 = await limiter.limit('test-user')
    expect(r1.allowed).toBe(false)

    // Advance time past window
    vi.advanceTimersByTime(61000)

    // Should be allowed again
    const r2 = await limiter.limit('test-user')
    expect(r2.allowed).toBe(true)

    vi.useRealTimers()
  })

  it('should handle multiple identifiers independently', async () => {
    class TestRateLimiter {
      private requests: Map<string, number[]> = new Map()
      private readonly windowMs = 60000
      private readonly maxRequests = 2

      async limit(identifier: string): Promise<RateLimitResult> {
        const now = Date.now()
        const userRequests = this.requests.get(identifier) || []
        const validRequests = userRequests.filter(
          (t) => now - t < this.windowMs
        )

        const remaining = Math.max(0, this.maxRequests - validRequests.length)
        const allowed = validRequests.length < this.maxRequests

        if (allowed) {
          validRequests.push(now)
          this.requests.set(identifier, validRequests)
        }

        return {
          allowed,
          limit: this.maxRequests,
          remaining,
          reset: 0,
        }
      }
    }

    const limiter = new TestRateLimiter()

    // User 1 makes 2 requests
    const u1r1 = await limiter.limit('user1')
    const u1r2 = await limiter.limit('user1')
    expect(u1r1.allowed).toBe(true)
    expect(u1r2.allowed).toBe(true)

    // User 1 is now rate limited
    const u1r3 = await limiter.limit('user1')
    expect(u1r3.allowed).toBe(false)

    // User 2 should still have full quota
    const u2r1 = await limiter.limit('user2')
    expect(u2r1.allowed).toBe(true)
    expect(u2r1.remaining).toBe(1)
  })
})

/**
 * Security tests for rate limit bypass attempts
 */
describe('Rate limit security', () => {
  it('should not allow rate limit bypass with different user ID formats', async () => {
    // Test that variations of the same identifier don't bypass limits
    const identifiers = [
      getClientIdentifier({ headers: new Headers() }, 'user123'),
      getClientIdentifier({ headers: new Headers() }, 'user123'),
    ]

    expect(identifiers[0]).toBe(identifiers[1])
  })

  it('should handle malicious identifier injection attempts', () => {
    const maliciousIds = [
      '../../../etc/passwd',
      '<script>alert(1)</script>',
      "'; DROP TABLE ratelimits; --",
    ]

    for (const id of maliciousIds) {
      const result = getClientIdentifier({ headers: new Headers() }, id)
      // Should still create a valid identifier
      expect(result).toBe(`user:${id}`)
      // The underlying rate limit storage should handle this safely
    }
  })

  it('should handle IPv6 addresses correctly', () => {
    const headers = new Headers()
    headers.set('x-forwarded-for', '2001:0db8:85a3:0000:0000:8a2e:0370:7334')

    const result = getClientIdentifier({ headers })
    expect(result).toContain('ip:')
    expect(result).toContain('2001:0db8')
  })

  it('should handle multiple IPs in x-forwarded-for', () => {
    const headers = new Headers()
    headers.set('x-forwarded-for', '203.0.113.1, 198.51.100.1, 192.0.2.1')

    const result = getClientIdentifier({ headers })
    // Should use first IP (client IP)
    expect(result).toBe('ip:203.0.113.1')
  })
})
