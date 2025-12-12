/**
 * Tests for fetchWithTimeout utility
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  fetchWithTimeout,
  TimeoutError,
  isTimeoutError,
  isAbortError,
} from '../fetch-with-timeout'

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('fetchWithTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('basic functionality', () => {
    it('should make a successful fetch request', async () => {
      const mockResponse = new Response('OK', { status: 200 })
      mockFetch.mockResolvedValueOnce(mockResponse)

      const response = await fetchWithTimeout('https://api.example.com/test')

      expect(response).toBe(mockResponse)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      )
    })

    it('should pass through fetch options', async () => {
      const mockResponse = new Response('OK', { status: 200 })
      mockFetch.mockResolvedValueOnce(mockResponse)

      await fetchWithTimeout('https://api.example.com/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: 'test' }),
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: 'test' }),
        })
      )
    })

    it('should propagate fetch errors', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      // Capture rejection to prevent unhandled rejection warning
      const errorPromise = fetchWithTimeout(
        'https://api.example.com/test'
      ).catch((e) => e)
      const error = await errorPromise

      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Network error')
    })
  })

  describe('timeout behavior', () => {
    it('should use default 30s timeout', async () => {
      // Make fetch that respects abort signal (like real fetch does)
      mockFetch.mockImplementationOnce(
        (_url: string, options?: { signal?: AbortSignal }) => {
          return new Promise((_, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                reject(options.signal!.reason || new Error('Aborted'))
              })
            }
          })
        }
      )

      // Capture rejection immediately to prevent unhandled rejection
      const errorPromise = fetchWithTimeout(
        'https://api.example.com/test'
      ).catch((e) => e)

      // Advance time past default timeout
      await vi.advanceTimersByTimeAsync(30001)

      const error = await errorPromise
      expect(error).toBeInstanceOf(TimeoutError)
      expect((error as TimeoutError).message).toContain(
        'timed out after 30000ms'
      )
    })

    it('should use custom timeout', async () => {
      // Make fetch that respects abort signal
      mockFetch.mockImplementationOnce(
        (_url: string, options?: { signal?: AbortSignal }) => {
          return new Promise((_, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                reject(options.signal!.reason || new Error('Aborted'))
              })
            }
          })
        }
      )

      // Capture rejection immediately to prevent unhandled rejection
      const errorPromise = fetchWithTimeout('https://api.example.com/test', {
        timeout: 5000,
      }).catch((e) => e)

      // Advance time past custom timeout
      await vi.advanceTimersByTimeAsync(5001)

      const error = await errorPromise
      expect(error).toBeInstanceOf(TimeoutError)
      expect((error as TimeoutError).message).toContain(
        'timed out after 5000ms'
      )
    })

    it('should clear timeout on successful response', async () => {
      const mockResponse = new Response('OK', { status: 200 })
      mockFetch.mockResolvedValueOnce(mockResponse)

      const responsePromise = fetchWithTimeout('https://api.example.com/test', {
        timeout: 5000,
      })

      const response = await responsePromise

      // Advancing time should not throw
      await vi.advanceTimersByTimeAsync(10000)

      expect(response).toBe(mockResponse)
    })

    it('should clear timeout on fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      // Capture rejection immediately to prevent unhandled rejection
      const errorPromise = fetchWithTimeout('https://api.example.com/test', {
        timeout: 5000,
      }).catch((e) => e)

      const error = await errorPromise
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Network error')

      // Advancing time should not cause issues
      await vi.advanceTimersByTimeAsync(10000)
    })
  })

  describe('AbortSignal support', () => {
    it('should respect external AbortSignal', async () => {
      const controller = new AbortController()
      // Make fetch that respects abort signal
      mockFetch.mockImplementationOnce(
        (_url: string, options?: { signal?: AbortSignal }) => {
          return new Promise((_, reject) => {
            if (options?.signal) {
              if (options.signal.aborted) {
                reject(new DOMException('Aborted', 'AbortError'))
                return
              }
              options.signal.addEventListener('abort', () => {
                reject(new DOMException('Aborted', 'AbortError'))
              })
            }
          })
        }
      )

      // Capture rejection immediately to prevent unhandled rejection
      const errorPromise = fetchWithTimeout('https://api.example.com/test', {
        signal: controller.signal,
        timeout: 30000,
      }).catch((e) => e)

      // Abort immediately
      controller.abort()
      await vi.runAllTimersAsync()

      const error = await errorPromise
      expect(error).toBeDefined()
      expect(error.name).toBe('AbortError')
    })

    it('should combine external signal with timeout signal', async () => {
      const controller = new AbortController()
      // Make fetch that respects abort signal
      mockFetch.mockImplementationOnce(
        (_url: string, options?: { signal?: AbortSignal }) => {
          return new Promise((_, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                reject(options.signal!.reason || new Error('Aborted'))
              })
            }
          })
        }
      )

      // Capture rejection immediately to prevent unhandled rejection
      const errorPromise = fetchWithTimeout('https://api.example.com/test', {
        signal: controller.signal,
        timeout: 10000,
      }).catch((e) => e)

      // Timeout should still work
      await vi.advanceTimersByTimeAsync(10001)

      const error = await errorPromise
      expect(error).toBeInstanceOf(TimeoutError)
    })

    it('should not throw timeout error if fetch completes before timeout', async () => {
      const mockResponse = new Response('OK', { status: 200 })

      // Simulate a 1s delay
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockResponse), 1000)
          })
      )

      const responsePromise = fetchWithTimeout('https://api.example.com/test', {
        timeout: 5000,
      })

      // Advance past fetch delay but not timeout
      await vi.advanceTimersByTimeAsync(1500)

      const response = await responsePromise
      expect(response).toBe(mockResponse)
    })
  })
})

describe('TimeoutError', () => {
  it('should create error with correct properties', () => {
    const error = new TimeoutError('Request timed out', 30000)

    expect(error.message).toBe('Request timed out')
    expect(error.name).toBe('TimeoutError')
    expect(error.timeout).toBe(30000)
  })

  it('should be instanceof Error', () => {
    const error = new TimeoutError('Request timed out', 30000)

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(TimeoutError)
  })
})

describe('isTimeoutError', () => {
  it('should return true for TimeoutError instances', () => {
    const error = new TimeoutError('Request timed out', 30000)
    expect(isTimeoutError(error)).toBe(true)
  })

  it('should return true for errors with name "TimeoutError"', () => {
    const error = new Error('Request timed out')
    error.name = 'TimeoutError'
    expect(isTimeoutError(error)).toBe(true)
  })

  it('should return false for regular errors', () => {
    const error = new Error('Network error')
    expect(isTimeoutError(error)).toBe(false)
  })

  it('should return false for null/undefined', () => {
    expect(isTimeoutError(null)).toBe(false)
    expect(isTimeoutError(undefined)).toBe(false)
  })
})

describe('isAbortError', () => {
  it('should return true for AbortError DOMException', () => {
    const error = new DOMException('Aborted', 'AbortError')
    expect(isAbortError(error)).toBe(true)
  })

  it('should return false for other DOMExceptions', () => {
    const error = new DOMException('Not found', 'NotFoundError')
    expect(isAbortError(error)).toBe(false)
  })

  it('should return false for regular errors', () => {
    const error = new Error('Aborted')
    expect(isAbortError(error)).toBe(false)
  })
})
