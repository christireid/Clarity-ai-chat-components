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

      const responsePromise = fetchWithTimeout('https://api.example.com/test')
      await vi.runAllTimersAsync()
      const response = await responsePromise

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

      const responsePromise = fetchWithTimeout('https://api.example.com/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: 'test' }),
      })
      await vi.runAllTimersAsync()
      await responsePromise

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

      const responsePromise = fetchWithTimeout('https://api.example.com/test')
      await vi.runAllTimersAsync()

      await expect(responsePromise).rejects.toThrow('Network error')
    })
  })

  describe('timeout behavior', () => {
    it('should use default 30s timeout', async () => {
      // Make fetch hang indefinitely
      mockFetch.mockImplementationOnce(
        () => new Promise(() => {}) // Never resolves
      )

      const responsePromise = fetchWithTimeout('https://api.example.com/test')

      // Advance time past default timeout
      await vi.advanceTimersByTimeAsync(30001)

      await expect(responsePromise).rejects.toThrow(TimeoutError)
      await expect(responsePromise).rejects.toThrow('timed out after 30000ms')
    })

    it('should use custom timeout', async () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}))

      const responsePromise = fetchWithTimeout('https://api.example.com/test', {
        timeout: 5000,
      })

      // Advance time past custom timeout
      await vi.advanceTimersByTimeAsync(5001)

      await expect(responsePromise).rejects.toThrow(TimeoutError)
      await expect(responsePromise).rejects.toThrow('timed out after 5000ms')
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

      const responsePromise = fetchWithTimeout('https://api.example.com/test', {
        timeout: 5000,
      })

      await expect(responsePromise).rejects.toThrow('Network error')

      // Advancing time should not cause issues
      await vi.advanceTimersByTimeAsync(10000)
    })
  })

  describe('AbortSignal support', () => {
    it('should respect external AbortSignal', async () => {
      const controller = new AbortController()
      mockFetch.mockImplementationOnce(() => new Promise(() => {}))

      const responsePromise = fetchWithTimeout('https://api.example.com/test', {
        signal: controller.signal,
        timeout: 30000,
      })

      // Abort immediately
      controller.abort()
      await vi.runAllTimersAsync()

      await expect(responsePromise).rejects.toThrow()
    })

    it('should combine external signal with timeout signal', async () => {
      const controller = new AbortController()
      mockFetch.mockImplementationOnce(() => new Promise(() => {}))

      const responsePromise = fetchWithTimeout('https://api.example.com/test', {
        signal: controller.signal,
        timeout: 10000,
      })

      // Timeout should still work
      await vi.advanceTimersByTimeAsync(10001)

      await expect(responsePromise).rejects.toThrow(TimeoutError)
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
