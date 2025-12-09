/**
 * useDashboardData Hook Tests
 *
 * Tests for the dashboard data fetching hook including:
 * - Basic fetching functionality
 * - Loading/error states
 * - Retry with exponential backoff
 * - Stale data detection
 * - Race condition handling
 * - Polling behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useDashboardData, useSimpleDashboardData } from '../use-dashboard-data'

// Mock timers for testing async behavior
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('useDashboardData', () => {
  describe('basic functionality', () => {
    it('should fetch data on mount by default', async () => {
      const mockData = { value: 42 }
      const fetcher = vi.fn().mockResolvedValue(mockData)

      const { result } = renderHook(() => useDashboardData({ fetcher }))

      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBe(null)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(fetcher).toHaveBeenCalledTimes(1)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toEqual(mockData)
      expect(result.current.error).toBe(null)
    })

    it('should not fetch on mount when fetchOnMount is false', async () => {
      const fetcher = vi.fn().mockResolvedValue({ value: 42 })

      const { result } = renderHook(() =>
        useDashboardData({ fetcher, fetchOnMount: false })
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(fetcher).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBe(null)
    })

    it('should use initialData when provided', async () => {
      const initialData = { value: 10 }
      const mockData = { value: 42 }
      const fetcher = vi.fn().mockResolvedValue(mockData)

      const { result } = renderHook(() =>
        useDashboardData({ fetcher, initialData })
      )

      // Should start with initial data
      expect(result.current.data).toEqual(initialData)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Should update to fetched data
      expect(result.current.data).toEqual(mockData)
    })
  })

  describe('error handling', () => {
    it('should set error state on fetch failure', async () => {
      const error = new Error('Fetch failed')
      const fetcher = vi.fn().mockRejectedValue(error)

      const { result } = renderHook(() =>
        useDashboardData({ fetcher, enableRetry: false })
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toEqual(error)
      expect(result.current.data).toBe(null)
    })

    it('should call onError callback on failure', async () => {
      const error = new Error('Fetch failed')
      const fetcher = vi.fn().mockRejectedValue(error)
      const onError = vi.fn()

      renderHook(() =>
        useDashboardData({ fetcher, onError, enableRetry: false })
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(onError).toHaveBeenCalledWith(error)
    })

    it('should call onSuccess callback on success', async () => {
      const mockData = { value: 42 }
      const fetcher = vi.fn().mockResolvedValue(mockData)
      const onSuccess = vi.fn()

      renderHook(() => useDashboardData({ fetcher, onSuccess }))

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(onSuccess).toHaveBeenCalledWith(mockData)
    })
  })

  describe('retry logic', () => {
    it('should retry on failure with exponential backoff', async () => {
      const error = new Error('Fetch failed')
      const fetcher = vi.fn().mockRejectedValue(error)

      const { result } = renderHook(() =>
        useDashboardData({
          fetcher,
          enableRetry: true,
          maxRetries: 3,
          retryBackoffMs: 1000,
        })
      )

      // Initial fetch
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(result.current.retryCount).toBe(1)

      // First retry after 1000ms
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })

      expect(result.current.retryCount).toBe(2)

      // Second retry after 2000ms (2 * 1000)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000)
      })

      expect(result.current.retryCount).toBe(3)

      // Third retry after 4000ms (4 * 1000)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(4000)
      })

      // Should stop after max retries
      expect(fetcher).toHaveBeenCalledTimes(4) // Initial + 3 retries
    })

    it('should reset retry count on successful fetch', async () => {
      const fetcher = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValue({ value: 42 })

      const { result } = renderHook(() =>
        useDashboardData({
          fetcher,
          enableRetry: true,
          maxRetries: 3,
          retryBackoffMs: 1000,
        })
      )

      // Initial fetch fails
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(result.current.retryCount).toBe(1)

      // Retry succeeds
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })

      expect(result.current.retryCount).toBe(0)
      expect(result.current.data).toEqual({ value: 42 })
    })
  })

  describe('refetch', () => {
    it('should refetch data when refetch is called', async () => {
      const mockData1 = { value: 1 }
      const mockData2 = { value: 2 }
      const fetcher = vi
        .fn()
        .mockResolvedValueOnce(mockData1)
        .mockResolvedValueOnce(mockData2)

      const { result } = renderHook(() => useDashboardData({ fetcher }))

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(result.current.data).toEqual(mockData1)

      await act(async () => {
        result.current.refetch()
        await vi.runAllTimersAsync()
      })

      expect(result.current.data).toEqual(mockData2)
      expect(fetcher).toHaveBeenCalledTimes(2)
    })

    it('should reset retry count on manual refetch', async () => {
      const fetcher = vi.fn().mockRejectedValue(new Error('Fail'))

      const { result } = renderHook(() =>
        useDashboardData({
          fetcher,
          enableRetry: true,
          maxRetries: 3,
          retryBackoffMs: 1000,
        })
      )

      // Let retries happen
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000)
      })

      expect(result.current.retryCount).toBe(3)

      // Manual refetch should reset
      await act(async () => {
        result.current.refetch()
        await vi.advanceTimersByTimeAsync(0)
      })

      // Retry count resets and starts new retry sequence
      expect(result.current.retryCount).toBeLessThanOrEqual(1)
    })
  })

  describe('stale data', () => {
    it('should mark data as stale after staleTime', async () => {
      const fetcher = vi.fn().mockResolvedValue({ value: 42 })

      const { result } = renderHook(() =>
        useDashboardData({
          fetcher,
          staleTime: 5000,
        })
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(result.current.isStale).toBe(false)

      // Advance time past staleTime
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000)
      })

      expect(result.current.isStale).toBe(true)
    })

    it('should allow manual invalidation', async () => {
      const fetcher = vi.fn().mockResolvedValue({ value: 42 })

      const { result } = renderHook(() => useDashboardData({ fetcher }))

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(result.current.isStale).toBe(false)

      act(() => {
        result.current.invalidate()
      })

      expect(result.current.isStale).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset to initial state', async () => {
      const initialData = { value: 10 }
      const fetcher = vi.fn().mockResolvedValue({ value: 42 })

      const { result } = renderHook(() =>
        useDashboardData({ fetcher, initialData })
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(result.current.data).toEqual({ value: 42 })

      act(() => {
        result.current.reset()
      })

      expect(result.current.data).toEqual(initialData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.isStale).toBe(false)
      expect(result.current.lastFetchedAt).toBe(null)
    })
  })

  describe('polling', () => {
    it('should poll at specified interval', async () => {
      const fetcher = vi.fn().mockResolvedValue({ value: 42 })

      renderHook(() =>
        useDashboardData({
          fetcher,
          pollingInterval: 5000,
        })
      )

      // Initial fetch
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(fetcher).toHaveBeenCalledTimes(1)

      // First poll
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000)
      })

      expect(fetcher).toHaveBeenCalledTimes(2)

      // Second poll
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000)
      })

      expect(fetcher).toHaveBeenCalledTimes(3)
    })

    it('should skip poll if fetch is already in progress', async () => {
      let resolvePromise: (value: { value: number }) => void
      const fetcher = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve
          })
      )

      renderHook(() =>
        useDashboardData({
          fetcher,
          pollingInterval: 1000,
        })
      )

      // Initial fetch starts but doesn't complete
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0)
      })

      expect(fetcher).toHaveBeenCalledTimes(1)

      // Poll interval passes while fetch is in progress
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })

      // Should not start another fetch
      expect(fetcher).toHaveBeenCalledTimes(1)

      // Complete the first fetch
      await act(async () => {
        resolvePromise!({ value: 42 })
        await vi.runAllTimersAsync()
      })

      // Now next poll should work
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })

      expect(fetcher).toHaveBeenCalledTimes(2)
    })
  })

  describe('race condition handling', () => {
    it('should discard stale responses', async () => {
      let resolveFirst: (value: { value: number }) => void
      let resolveSecond: (value: { value: number }) => void

      const fetcher = vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = resolve
            })
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveSecond = resolve
            })
        )

      const { result } = renderHook(() => useDashboardData({ fetcher }))

      // Start first fetch
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0)
      })

      // Start second fetch (via refetch)
      await act(async () => {
        result.current.refetch()
        await vi.advanceTimersByTimeAsync(0)
      })

      // Resolve second fetch first
      await act(async () => {
        resolveSecond!({ value: 2 })
        await vi.runAllTimersAsync()
      })

      expect(result.current.data).toEqual({ value: 2 })

      // Resolve first fetch (should be discarded)
      await act(async () => {
        resolveFirst!({ value: 1 })
        await vi.runAllTimersAsync()
      })

      // Data should still be from second fetch
      expect(result.current.data).toEqual({ value: 2 })
    })
  })

  describe('cleanup', () => {
    it('should clear timers on unmount', async () => {
      const fetcher = vi.fn().mockResolvedValue({ value: 42 })

      const { unmount } = renderHook(() =>
        useDashboardData({
          fetcher,
          pollingInterval: 5000,
        })
      )

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0)
      })

      unmount()

      // After unmount, no more fetches should happen
      const callCount = fetcher.mock.calls.length

      await act(async () => {
        await vi.advanceTimersByTimeAsync(10000)
      })

      expect(fetcher).toHaveBeenCalledTimes(callCount)
    })
  })
})

describe('useSimpleDashboardData', () => {
  it('should provide simplified interface', async () => {
    const mockData = { value: 42 }
    const fetcher = vi.fn().mockResolvedValue(mockData)

    const { result } = renderHook(() => useSimpleDashboardData(fetcher))

    expect(result.current.isLoading).toBe(true)

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(typeof result.current.refetch).toBe('function')
  })

  it('should refetch on dependency change', async () => {
    const fetcher = vi.fn().mockResolvedValue({ value: 42 })
    let dep = 1

    const { result, rerender } = renderHook(() =>
      useSimpleDashboardData(fetcher, [dep])
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(fetcher).toHaveBeenCalledTimes(1)

    // Change dependency
    dep = 2
    rerender()

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(fetcher).toHaveBeenCalledTimes(2)
  })
})
