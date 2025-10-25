import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useAsyncError } from '../../src/hooks/useAsyncError'

describe('useAsyncError', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAsyncError())

    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.retryCount).toBe(0)
  })

  it('should execute async function successfully', async () => {
    const { result } = renderHook(() => useAsyncError())
    const asyncFn = vi.fn().mockResolvedValue('success')

    let response: string | null = null
    await act(async () => {
      response = await result.current.executeAsync(asyncFn)
    })

    expect(response).toBe('success')
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(asyncFn).toHaveBeenCalledTimes(1)
  })

  it('should retry on failure with exponential backoff', async () => {
    const { result } = renderHook(() => useAsyncError())
    let attempts = 0

    const asyncFn = vi.fn().mockImplementation(() => {
      attempts++
      if (attempts < 3) {
        return Promise.reject(new Error('Temporary failure'))
      }
      return Promise.resolve('success')
    })

    const promise = act(async () => {
      return await result.current.executeAsync(asyncFn, {
        maxRetries: 3,
        retryDelay: 1000,
      })
    })

    // Fast-forward through retry delays
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000) // First retry
      await vi.advanceTimersByTimeAsync(2000) // Second retry
    })

    const response = await promise

    expect(response).toBe('success')
    expect(attempts).toBe(3)
    expect(result.current.retryCount).toBe(0) // Reset after success
    expect(result.current.error).toBeNull()
  })

  it('should set error after max retries exceeded', async () => {
    const { result } = renderHook(() => useAsyncError())
    const error = new Error('Permanent failure')
    const asyncFn = vi.fn().mockRejectedValue(error)
    const onError = vi.fn()

    const promise = act(async () => {
      return await result.current.executeAsync(asyncFn, {
        maxRetries: 2,
        retryDelay: 1000,
        onError,
      })
    })

    // Fast-forward through all retries
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000) // First retry
      await vi.advanceTimersByTimeAsync(2000) // Second retry
    })

    const response = await promise

    expect(response).toBeNull()
    expect(result.current.error).toEqual(error)
    expect(result.current.isLoading).toBe(false)
    expect(asyncFn).toHaveBeenCalledTimes(3) // Initial + 2 retries
    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should call onSuccess callback on successful execution', async () => {
    const { result } = renderHook(() => useAsyncError())
    const asyncFn = vi.fn().mockResolvedValue('success')
    const onSuccess = vi.fn()

    await act(async () => {
      await result.current.executeAsync(asyncFn, { onSuccess })
    })

    expect(onSuccess).toHaveBeenCalled()
  })

  it('should update retry count during retries', async () => {
    const { result } = renderHook(() => useAsyncError())
    const asyncFn = vi.fn().mockRejectedValue(new Error('Failed'))

    const promise = act(async () => {
      return await result.current.executeAsync(asyncFn, {
        maxRetries: 2,
        retryDelay: 1000,
      })
    })

    // After first attempt
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })
    expect(result.current.retryCount).toBe(1)

    // After second attempt
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })
    expect(result.current.retryCount).toBe(2)

    // Complete the promise
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    await promise
  })

  it('should reset state', async () => {
    const { result } = renderHook(() => useAsyncError())
    const asyncFn = vi.fn().mockRejectedValue(new Error('Failed'))

    const promise = act(async () => {
      return await result.current.executeAsync(asyncFn, {
        maxRetries: 1,
        retryDelay: 1000,
      })
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    await promise

    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.reset()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.retryCount).toBe(0)
  })

  it('should handle non-Error objects', async () => {
    const { result } = renderHook(() => useAsyncError())
    const asyncFn = vi.fn().mockRejectedValue('string error')

    const promise = act(async () => {
      return await result.current.executeAsync(asyncFn, {
        maxRetries: 0,
      })
    })

    await promise

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('string error')
  })
})
