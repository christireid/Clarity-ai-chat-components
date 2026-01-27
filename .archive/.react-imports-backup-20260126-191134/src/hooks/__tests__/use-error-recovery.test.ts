import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useErrorRecovery } from '../use-error-recovery'

describe('useErrorRecovery', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully execute operation on first try', async () => {
    const operation = vi.fn().mockResolvedValue('success')
    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 3,
      })
    )

    const data = await result.current.execute('test-arg')

    expect(data).toBe('success')
    expect(operation).toHaveBeenCalledTimes(1)
    expect(operation).toHaveBeenCalledWith('test-arg')
    expect(result.current.error).toBeNull()
    expect(result.current.attemptNumber).toBe(1)
  })

  it('should retry on failure up to max attempts', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success')

    const onRetryStart = vi.fn()

    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 3,
        backoffMs: [100, 100, 100],
        onRetryStart,
      })
    )

    const data = await result.current.execute()

    expect(data).toBe('success')
    expect(operation).toHaveBeenCalledTimes(3)
    expect(onRetryStart).toHaveBeenCalledTimes(2) // Called for attempt 2 and 3
  })

  it('should stop retrying after max attempts', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('persistent error'))
    const onMaxAttemptsReached = vi.fn()

    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 2,
        backoffMs: [10, 10],
        onMaxAttemptsReached,
      })
    )

    const data = await result.current.execute()

    expect(data).toBeNull()
    expect(operation).toHaveBeenCalledTimes(2)
    expect(result.current.error?.message).toBe('persistent error')
    expect(result.current.canRetry).toBe(false)
    expect(onMaxAttemptsReached).toHaveBeenCalled()
  })

  it('should classify error types correctly', async () => {
    const networkError = new Error('Network request failed')
    const operation = vi.fn().mockRejectedValue(networkError)

    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 1,
      })
    )

    await result.current.execute()

    expect(result.current.errorType).toBe('network')
    expect(result.current.errorMessage).toContain('Connection lost')
  })

  it('should respect shouldRetry function', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('401 Unauthorized'))
    const shouldRetry = vi.fn().mockReturnValue(false)

    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 3,
        shouldRetry,
      })
    )

    const data = await result.current.execute()

    expect(data).toBeNull()
    expect(operation).toHaveBeenCalledTimes(1)
    expect(shouldRetry).toHaveBeenCalled()
  })

  it('should allow manual retry', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success')

    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 3,
        backoffMs: [10],
      })
    )

    // First attempt fails
    await result.current.execute('arg1')
    expect(result.current.error).toBeTruthy()
    expect(result.current.canRetry).toBe(true)

    // Manual retry succeeds
    const data = await result.current.retry()
    expect(data).toBe('success')
    expect(result.current.error).toBeNull()
  })

  it('should reset state', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('fail'))

    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 1,
      })
    )

    await result.current.execute()
    expect(result.current.error).toBeTruthy()

    result.current.reset()
    expect(result.current.error).toBeNull()
    expect(result.current.attemptNumber).toBe(0)
    expect(result.current.data).toBeNull()
  })

  it('should track loading and retrying states', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success')

    const { result } = renderHook(() =>
      useErrorRecovery({
        operation,
        maxAttempts: 3,
        backoffMs: [50],
      })
    )

    const promise = result.current.execute()

    // Should be loading immediately
    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isRetrying).toBe(true))

    await promise

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isRetrying).toBe(false)
  })
})
