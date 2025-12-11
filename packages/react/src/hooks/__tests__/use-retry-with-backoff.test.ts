/**
 * Tests for useRetryWithBackoff hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRetryWithBackoff } from '../use-retry-with-backoff'

describe('useRetryWithBackoff', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useRetryWithBackoff())

      expect(result.current.isRetrying).toBe(false)
      expect(result.current.attempt).toBe(0)
      expect(result.current.lastError).toBeNull()
      expect(typeof result.current.execute).toBe('function')
      expect(typeof result.current.cancel).toBe('function')
      expect(typeof result.current.reset).toBe('function')
    })
  })

  describe('successful execution', () => {
    it('should execute function successfully on first try', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')
      const { result } = renderHook(() => useRetryWithBackoff())

      let executeResult: unknown
      await act(async () => {
        executeResult = await result.current.execute(mockFn)
      })

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(executeResult).toEqual({
        result: 'success',
        attempts: 1,
        totalTime: expect.any(Number),
      })
      expect(result.current.isRetrying).toBe(false)
      expect(result.current.lastError).toBeNull()
    })

    it('should set isRetrying during execution', async () => {
      let resolvePromise: (value: string) => void
      const mockFn = vi.fn().mockImplementation(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve
          })
      )

      const { result } = renderHook(() => useRetryWithBackoff())

      act(() => {
        result.current.execute(mockFn)
      })

      expect(result.current.isRetrying).toBe(true)

      await act(async () => {
        resolvePromise!('done')
        await vi.runAllTimersAsync()
      })

      expect(result.current.isRetrying).toBe(false)
    })
  })

  describe('retry behavior', () => {
    it('should throw immediately when maxRetries is 0', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Always fails'))

      const { result } = renderHook(() =>
        useRetryWithBackoff({
          maxRetries: 0,
        })
      )

      let error: Error | undefined
      await act(async () => {
        try {
          await result.current.execute(mockFn)
        } catch (e) {
          error = e as Error
        }
      })

      expect(error).toBeDefined()
      expect(error?.message).toBe('Always fails')
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result.current.lastError).toBeInstanceOf(Error)
    })
  })

  describe('cancellation', () => {
    it('should cancel pending retries', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Fail'))
      const onRetry = vi.fn()

      const { result } = renderHook(() =>
        useRetryWithBackoff({
          maxRetries: 5,
          baseDelay: 1000,
          onRetry,
        })
      )

      act(() => {
        result.current.execute(mockFn).catch(() => {})
      })

      // Cancel before retry completes
      act(() => {
        result.current.cancel()
      })

      expect(result.current.isRetrying).toBe(false)
      expect(result.current.attempt).toBe(0)
    })

    it('should reset state including lastError', () => {
      const { result } = renderHook(() => useRetryWithBackoff())

      act(() => {
        result.current.reset()
      })

      expect(result.current.isRetrying).toBe(false)
      expect(result.current.attempt).toBe(0)
      expect(result.current.lastError).toBeNull()
    })
  })

  describe('cleanup on unmount', () => {
    it('should cancel on unmount', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Fail'))

      const { result, unmount } = renderHook(() =>
        useRetryWithBackoff({
          maxRetries: 5,
          baseDelay: 1000,
        })
      )

      act(() => {
        result.current.execute(mockFn).catch(() => {})
      })

      unmount()

      // Advance timers - should not throw or cause issues
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000)
      })

      // Test passes if no errors thrown
    })
  })

  describe('lastError tracking', () => {
    it('should track the last error encountered', async () => {
      const error = new Error('Test error')
      const mockFn = vi.fn().mockRejectedValue(error)

      const { result } = renderHook(() =>
        useRetryWithBackoff({
          maxRetries: 1,
          baseDelay: 100,
        })
      )

      await act(async () => {
        try {
          await result.current.execute(mockFn)
        } catch {
          // Expected
        }
        await vi.runAllTimersAsync()
      })

      expect(result.current.lastError).toBe(error)
    })

    it('should clear lastError on reset', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Fail'))

      const { result } = renderHook(() =>
        useRetryWithBackoff({
          maxRetries: 0,
        })
      )

      await act(async () => {
        try {
          await result.current.execute(mockFn)
        } catch {
          // Expected
        }
      })

      expect(result.current.lastError).not.toBeNull()

      act(() => {
        result.current.reset()
      })

      expect(result.current.lastError).toBeNull()
    })
  })

  describe('onRetry callback', () => {
    it('should accept onRetry option', () => {
      const onRetry = vi.fn()
      const { result } = renderHook(() =>
        useRetryWithBackoff({
          maxRetries: 2,
          baseDelay: 100,
          onRetry,
        })
      )

      // Verify hook initializes correctly with onRetry
      expect(result.current.isRetrying).toBe(false)
      expect(typeof result.current.execute).toBe('function')
    })
  })
})
