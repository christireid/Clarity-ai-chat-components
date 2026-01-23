/**
 * Rate Limiter Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { RateLimiter, type AcquireOptions } from '../rate-limiter'

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Basic functionality', () => {
    it('should allow acquiring tokens up to maxTokens', () => {
      const limiter = new RateLimiter({
        maxTokens: 3,
        refillRate: 1,
      })

      expect(limiter.tryAcquire()).toBe(true)
      expect(limiter.tryAcquire()).toBe(true)
      expect(limiter.tryAcquire()).toBe(true)
      expect(limiter.tryAcquire()).toBe(false)
    })

    it('should refill tokens over time', () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 10, // 10 tokens per second
      })

      // Consume the token
      expect(limiter.tryAcquire()).toBe(true)
      expect(limiter.tryAcquire()).toBe(false)

      // Advance time by 100ms (should refill 1 token)
      vi.advanceTimersByTime(100)

      // Should be able to acquire again
      expect(limiter.tryAcquire()).toBe(true)
    })

    it('should not exceed maxTokens when refilling', () => {
      const limiter = new RateLimiter({
        maxTokens: 2,
        refillRate: 10,
      })

      // Wait a long time
      vi.advanceTimersByTime(10000)

      // Should only have maxTokens available
      expect(limiter.tryAcquire()).toBe(true)
      expect(limiter.tryAcquire()).toBe(true)
      expect(limiter.tryAcquire()).toBe(false)
    })
  })

  describe('acquire with timeout', () => {
    it('should timeout after specified duration', async () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 0.1, // Very slow refill
      })

      // Consume the only token
      limiter.tryAcquire()

      // Should timeout quickly
      const promise = limiter.acquire({ timeoutMs: 100 })

      vi.advanceTimersByTime(100)

      await expect(promise).rejects.toThrow('Rate limit acquire timeout')
    })

    it('should respect abort signal', async () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 0.1,
      })

      limiter.tryAcquire() // Consume token

      const controller = new AbortController()
      const promise = limiter.acquire({ signal: controller.signal })

      // Abort after 50ms
      vi.advanceTimersByTime(50)
      controller.abort()
      vi.advanceTimersByTime(1) // Process abort

      await expect(promise).rejects.toThrow('Rate limit acquire cancelled')
    })

    it('should acquire when token becomes available within timeout', async () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 10, // 10 tokens/second = 100ms per token
      })

      limiter.tryAcquire() // Consume token

      // Should succeed within 200ms
      const promise = limiter.acquire({ timeoutMs: 200 })

      // Advance time to allow refill
      vi.advanceTimersByTime(150)

      await expect(promise).resolves.toBeUndefined()
    })

    it('should use default timeout of 30 seconds', async () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 0.001, // Very slow
      })

      limiter.tryAcquire()

      const promise = limiter.acquire() // No timeout specified

      // Should timeout at 30 seconds
      vi.advanceTimersByTime(30000)

      await expect(promise).rejects.toThrow('Rate limit acquire timeout')
    })

    it('should not wait longer than remaining timeout', async () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 1, // 1 token per second
      })

      limiter.tryAcquire()

      const promise = limiter.acquire({ timeoutMs: 100 })

      // Advance time to timeout
      vi.advanceTimersByTime(100)

      await expect(promise).rejects.toThrow('timeout')
    })
  })

  describe('getAvailableTokens', () => {
    it('should return current available tokens', () => {
      const limiter = new RateLimiter({
        maxTokens: 5,
        refillRate: 1,
      })

      expect(limiter.getAvailableTokens()).toBe(5)
      limiter.tryAcquire()
      expect(limiter.getAvailableTokens()).toBe(4)
      limiter.tryAcquire()
      expect(limiter.getAvailableTokens()).toBe(3)
    })

    it('should reflect refilled tokens', () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 10,
      })

      limiter.tryAcquire() // Consume token
      expect(limiter.getAvailableTokens()).toBe(0)

      vi.advanceTimersByTime(100) // 100ms = 1 token

      expect(limiter.getAvailableTokens()).toBe(1)
    })
  })

  describe('reset', () => {
    it('should reset tokens to maxTokens', () => {
      const limiter = new RateLimiter({
        maxTokens: 3,
        refillRate: 1,
      })

      limiter.tryAcquire()
      limiter.tryAcquire()
      expect(limiter.getAvailableTokens()).toBe(1)

      limiter.reset()
      expect(limiter.getAvailableTokens()).toBe(3)
    })

    it('should reset refill timer', () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 10,
      })

      limiter.tryAcquire()
      vi.advanceTimersByTime(50)

      limiter.reset()

      // Should start refilling from reset point
      expect(limiter.getAvailableTokens()).toBe(1)
    })
  })

  describe('Edge cases', () => {
    it('should handle very fast refill rates', () => {
      const limiter = new RateLimiter({
        maxTokens: 100,
        refillRate: 1000, // 1000 tokens per second
      })

      for (let i = 0; i < 100; i++) {
        limiter.tryAcquire()
      }
      expect(limiter.tryAcquire()).toBe(false)

      vi.advanceTimersByTime(100) // 100ms = 100 tokens

      for (let i = 0; i < 100; i++) {
        expect(limiter.tryAcquire()).toBe(true)
      }
    })

    it('should handle fractional tokens during refill', () => {
      const limiter = new RateLimiter({
        maxTokens: 10,
        refillRate: 0.5, // 0.5 tokens per second
      })

      limiter.tryAcquire()
      expect(limiter.getAvailableTokens()).toBe(9)

      // Advance 1 second (should add 0.5 tokens)
      vi.advanceTimersByTime(1000)
      expect(limiter.getAvailableTokens()).toBeCloseTo(9.5, 1)

      // Advance another second (should add 0.5 more, reaching 10)
      vi.advanceTimersByTime(1000)
      expect(limiter.getAvailableTokens()).toBe(10)
    })

    it('should handle concurrent acquire calls', async () => {
      const limiter = new RateLimiter({
        maxTokens: 1,
        refillRate: 2, // 2 tokens per second
      })

      limiter.tryAcquire() // Consume initial token

      const promises = [
        limiter.acquire({ timeoutMs: 1000 }),
        limiter.acquire({ timeoutMs: 1000 }),
      ]

      // Both should eventually succeed as tokens refill
      vi.advanceTimersByTime(500) // 1 token refilled
      await Promise.resolve() // Let first promise resolve

      vi.advanceTimersByTime(500) // Another token refilled
      await Promise.resolve() // Let second promise resolve

      const results = await Promise.all(promises)
      expect(results).toEqual([undefined, undefined])
    })
  })
})
