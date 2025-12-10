/**
 * Tests for Retry with Backoff Utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  retryWithBackoff,
  createRetryWrapper,
  AI_API_RETRY_OPTIONS,
  STREAMING_RETRY_OPTIONS,
} from '../retry-with-backoff'

describe('retryWithBackoff', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('successful execution', () => {
    it('should return result on first try', async () => {
      const fn = vi.fn().mockResolvedValue('success')

      const resultPromise = retryWithBackoff(fn)
      await vi.runAllTimersAsync()
      const { result, attempts, totalTime } = await resultPromise

      expect(result).toBe('success')
      expect(attempts).toBe(1)
      expect(totalTime).toBeGreaterThanOrEqual(0)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should track total time', async () => {
      const fn = vi.fn().mockResolvedValue('success')

      const resultPromise = retryWithBackoff(fn)
      await vi.advanceTimersByTimeAsync(100)
      const { totalTime } = await resultPromise

      expect(totalTime).toBeGreaterThanOrEqual(0)
    })
  })

  describe('retry behavior', () => {
    it('should retry on retryable error', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('rate limit'))
        .mockResolvedValue('success')

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 3,
        baseDelay: 100,
      })

      // First call fails
      await vi.advanceTimersByTimeAsync(0)

      // Wait for retry delay
      await vi.advanceTimersByTimeAsync(200)

      const { result, attempts } = await resultPromise

      expect(result).toBe('success')
      expect(attempts).toBe(2)
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should exhaust retries and throw', async () => {
      const error = new Error('rate limit')
      const fn = vi.fn().mockRejectedValue(error)

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 2,
        baseDelay: 100,
      })

      // Run all timers to exhaust retries
      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow('rate limit')
      expect(fn).toHaveBeenCalledTimes(3) // Initial + 2 retries
    })

    it('should not retry non-retryable errors', async () => {
      const error = new Error('invalid request')
      const fn = vi.fn().mockRejectedValue(error)

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 3,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow('invalid request')
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should not retry abort errors', async () => {
      const error = new DOMException('Aborted', 'AbortError')
      const fn = vi.fn().mockRejectedValue(error)

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 3,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('backoff calculation', () => {
    it('should use exponential backoff', async () => {
      const onRetry = vi.fn()
      const fn = vi.fn().mockRejectedValue(new Error('rate limit'))

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 3,
        baseDelay: 1000,
        jitter: 0, // No jitter for predictable tests
        onRetry,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()

      // Delays should be exponential: 1000, 2000, 4000
      expect(onRetry).toHaveBeenCalledTimes(3)
      const delays = onRetry.mock.calls.map((call) => call[1])
      expect(delays[0]).toBe(1000)
      expect(delays[1]).toBe(2000)
      expect(delays[2]).toBe(4000)
    })

    it('should respect maxDelay', async () => {
      const onRetry = vi.fn()
      const fn = vi.fn().mockRejectedValue(new Error('rate limit'))

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 5,
        baseDelay: 10000,
        maxDelay: 15000,
        jitter: 0,
        onRetry,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()

      const delays = onRetry.mock.calls.map((call) => call[1])
      expect(Math.max(...delays)).toBeLessThanOrEqual(15000)
    })

    it('should add jitter to delays', async () => {
      const onRetry = vi.fn()
      const fn = vi.fn().mockRejectedValue(new Error('rate limit'))

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 1,
        baseDelay: 1000,
        jitter: 0.5, // 50% jitter
        onRetry,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()

      const delay = onRetry.mock.calls[0][1]
      // With 50% jitter, delay should be between 500 and 1500
      expect(delay).toBeGreaterThanOrEqual(500)
      expect(delay).toBeLessThanOrEqual(1500)
    })
  })

  describe('rate limit info', () => {
    it('should use rate limit info for delay calculation', async () => {
      const onRetry = vi.fn()
      const error = new Error('rate limit') as Error & {
        rateLimitInfo: { retryAfter: number }
      }
      error.rateLimitInfo = { retryAfter: 5 } // 5 seconds
      const fn = vi.fn().mockRejectedValue(error)

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 1,
        baseDelay: 1000,
        jitter: 0,
        onRetry,
        getRateLimitInfo: (e) => (e as typeof error).rateLimitInfo,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()

      // Should use 5000ms from rate limit info
      const delay = onRetry.mock.calls[0][1]
      expect(delay).toBe(5000)
    })
  })

  describe('abort signal', () => {
    it('should abort immediately if signal is already aborted', async () => {
      const controller = new AbortController()
      controller.abort()

      const fn = vi.fn().mockResolvedValue('success')

      const resultPromise = retryWithBackoff(fn, {
        signal: controller.signal,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow('Aborted')
      expect(fn).not.toHaveBeenCalled()
    })

    it('should abort during retry delay', async () => {
      const controller = new AbortController()
      const fn = vi.fn().mockRejectedValue(new Error('rate limit'))

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 3,
        baseDelay: 10000,
        signal: controller.signal,
      })

      // First call fails
      await vi.advanceTimersByTimeAsync(0)

      // Abort during delay
      controller.abort()
      await vi.advanceTimersByTimeAsync(100)

      await expect(resultPromise).rejects.toThrow('Aborted')
    })
  })

  describe('custom shouldRetry', () => {
    it('should use custom shouldRetry function', async () => {
      const shouldRetry = vi.fn().mockReturnValue(true)
      const fn = vi.fn().mockRejectedValue(new Error('custom error'))

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 2,
        baseDelay: 100,
        shouldRetry,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()
      expect(shouldRetry).toHaveBeenCalled()
      expect(fn).toHaveBeenCalledTimes(3) // Retried because shouldRetry returned true
    })

    it('should stop retrying when shouldRetry returns false', async () => {
      const shouldRetry = vi.fn().mockReturnValue(false)
      const fn = vi.fn().mockRejectedValue(new Error('custom error'))

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 3,
        shouldRetry,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('onRetry callback', () => {
    it('should call onRetry before each retry', async () => {
      const onRetry = vi.fn()
      const error = new Error('rate limit')
      const fn = vi.fn().mockRejectedValue(error)

      const resultPromise = retryWithBackoff(fn, {
        maxRetries: 2,
        baseDelay: 100,
        onRetry,
      })

      await vi.runAllTimersAsync()

      await expect(resultPromise).rejects.toThrow()

      expect(onRetry).toHaveBeenCalledTimes(2)
      expect(onRetry).toHaveBeenCalledWith(1, expect.any(Number), error)
      expect(onRetry).toHaveBeenCalledWith(2, expect.any(Number), error)
    })
  })
})

describe('createRetryWrapper', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should create a wrapped function', async () => {
    const fn = vi
      .fn()
      .mockImplementation((a: number, b: number) => Promise.resolve(a + b))
    const wrapped = createRetryWrapper(fn, { maxRetries: 2 })

    const resultPromise = wrapped(2, 3)
    await vi.runAllTimersAsync()
    const { result } = await resultPromise

    expect(result).toBe(5)
    expect(fn).toHaveBeenCalledWith(2, 3)
  })

  it('should retry wrapped function on failure', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('rate limit'))
      .mockResolvedValue('success')

    const wrapped = createRetryWrapper(fn, {
      maxRetries: 2,
      baseDelay: 100,
    })

    const resultPromise = wrapped()
    await vi.runAllTimersAsync()
    const { result, attempts } = await resultPromise

    expect(result).toBe('success')
    expect(attempts).toBe(2)
  })
})

describe('presets', () => {
  it('AI_API_RETRY_OPTIONS should have correct defaults', () => {
    expect(AI_API_RETRY_OPTIONS.maxRetries).toBe(3)
    expect(AI_API_RETRY_OPTIONS.baseDelay).toBe(1000)
    expect(AI_API_RETRY_OPTIONS.maxDelay).toBe(60000)
    expect(AI_API_RETRY_OPTIONS.jitter).toBe(0.5)
  })

  it('STREAMING_RETRY_OPTIONS should have fewer retries', () => {
    expect(STREAMING_RETRY_OPTIONS.maxRetries).toBe(2)
    expect(STREAMING_RETRY_OPTIONS.maxDelay).toBe(30000)
  })
})
