import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedCallback } from '../useDebouncedCallback'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should debounce callback execution', async () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    // Call multiple times rapidly
    act(() => {
      result.current()
      result.current()
      result.current()
    })

    // Should not be called yet
    expect(callback).not.toHaveBeenCalled()

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100)
    })

    // Should be called once after delay
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should cancel previous calls when called again', async () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    act(() => {
      result.current()
    })

    act(() => {
      vi.advanceTimersByTime(50)
    })

    // Call again before delay completes
    act(() => {
      result.current()
    })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    // Should only be called once (last call)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should cleanup on unmount', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 100))

    act(() => {
      result.current()
    })

    unmount()

    act(() => {
      vi.advanceTimersByTime(100)
    })

    // Should not be called after unmount
    expect(callback).not.toHaveBeenCalled()
  })
})
