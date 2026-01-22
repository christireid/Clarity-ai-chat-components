import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useStreamingError } from '../../src/hooks/useStreamingError'
import {
  StreamingError,
  StreamingErrorCode,
} from '../../src/errors/streaming-error'

// Wrapper component that provides ErrorBoundary context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary fallback={<div>Error</div>}>{children}</ErrorBoundary>
)

describe('useStreamingError', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      expect(result.current.error).toBeNull()
      expect(result.current.isRetrying).toBe(false)
      expect(result.current.retryCount).toBe(0)
      expect(result.current.canRetry).toBe(false)
      expect(result.current.retryAfterMs).toBeNull()
    })

    it('should accept custom options', () => {
      const onRetry = vi.fn()
      const onMaxRetriesExceeded = vi.fn()
      const { result } = renderHook(
        () =>
          useStreamingError({
            maxRetries: 5,
            retryDelay: 2000,
            onRetry,
            onMaxRetriesExceeded,
          }),
        { wrapper }
      )

      expect(result.current.error).toBeNull()
      expect(result.current.retryCount).toBe(0)
    })
  })

  describe('handleStreamError', () => {
    it('should handle StreamingError directly', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      const streamError = StreamingError.connectionLost(
        'sse',
        'partial response'
      )

      act(() => {
        result.current.handleStreamError(streamError)
      })

      expect(result.current.error).toBeInstanceOf(StreamingError)
      expect(result.current.canRetry).toBe(true) // connectionLost is recoverable
    })

    it('should wrap non-StreamingError in StreamingError', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.handleStreamError(new Error('Connection failed'))
      })

      expect(result.current.error).toBeInstanceOf(StreamingError)
      expect(result.current.error?.message).toBe('Connection failed')
    })

    it('should wrap string errors in StreamingError', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.handleStreamError('Network error')
      })

      expect(result.current.error).toBeInstanceOf(StreamingError)
      expect(result.current.error?.message).toBe('Network error')
    })

    it('should preserve partial content when provided', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.handleStreamError(new Error('Connection lost'), {
          partialContent: 'The answer to your question is...',
        })
      })

      expect(result.current.error?.partialContent).toBe(
        'The answer to your question is...'
      )
      expect(result.current.error?.hasPartialContent).toBe(true)
    })

    it('should call onMaxRetriesExceeded when retries exhausted', async () => {
      const onMaxRetriesExceeded = vi.fn()
      const retryCallback = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(
        () =>
          useStreamingError({
            maxRetries: 2,
            retryDelay: 100,
            jitterFactor: 0,
            onMaxRetriesExceeded,
          }),
        { wrapper }
      )

      act(() => {
        result.current.setRetryCallback(retryCallback)
      })

      // First error and retry
      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Second retry
      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      await act(async () => {
        vi.advanceTimersByTime(400)
      })

      // Now at max retries, next error should trigger callback
      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      expect(onMaxRetriesExceeded).toHaveBeenCalled()
    })
  })

  describe('retry', () => {
    it('should not retry without registered callback', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('no retry callback registered')
      )
      consoleWarnSpy.mockRestore()
    })

    it('should not retry when canRetry is false', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})
      const { result } = renderHook(
        () => useStreamingError({ maxRetries: 0 }),
        { wrapper }
      )

      const retryCallback = vi.fn()
      act(() => {
        result.current.setRetryCallback(retryCallback)
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Cannot retry')
      )
      expect(retryCallback).not.toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })

    it('should execute retry with exponential backoff', async () => {
      const retryCallback = vi.fn().mockResolvedValue(undefined)
      const onRetry = vi.fn()

      const { result } = renderHook(
        () =>
          useStreamingError({
            maxRetries: 3,
            retryDelay: 1000,
            onRetry,
          }),
        { wrapper }
      )

      act(() => {
        result.current.setRetryCallback(retryCallback)
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      // First retry - 1000ms base delay (with jitter, ~1000-1300ms)
      act(() => {
        result.current.retry()
      })

      expect(result.current.isRetrying).toBe(true)
      expect(result.current.retryCount).toBe(1)
      expect(result.current.retryAfterMs).toBeGreaterThan(900) // ~1000ms with jitter

      // Advance past the delay
      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      expect(onRetry).toHaveBeenCalledWith(1, undefined)
      expect(retryCallback).toHaveBeenCalledTimes(1)

      // Second retry - 2000ms * 2^1 = ~2000-2600ms
      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      expect(result.current.retryCount).toBe(2)
      expect(result.current.retryAfterMs).toBeGreaterThan(1800) // ~2000ms with jitter

      await act(async () => {
        vi.advanceTimersByTime(4000)
      })

      expect(onRetry).toHaveBeenCalledWith(2, undefined)
      expect(retryCallback).toHaveBeenCalledTimes(2)
    })

    it('should update retryAfterMs countdown', async () => {
      const retryCallback = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(
        () => useStreamingError({ retryDelay: 1000 }),
        { wrapper }
      )

      act(() => {
        result.current.setRetryCallback(retryCallback)
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      const initialMs = result.current.retryAfterMs!
      expect(initialMs).toBeGreaterThan(900)

      // Advance 100ms
      act(() => {
        vi.advanceTimersByTime(100)
      })

      // Should have decreased
      expect(result.current.retryAfterMs).toBeLessThan(initialMs)
    })
  })

  describe('setRetryCallback', () => {
    it('should register retry callback', async () => {
      const { result } = renderHook(
        () =>
          useStreamingError({
            retryDelay: 100,
            jitterFactor: 0,
            circuitBreakerThreshold: 10,
          }),
        { wrapper }
      )
      const callback = vi.fn().mockResolvedValue(undefined)

      act(() => {
        result.current.setRetryCallback(callback)
      })

      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      // Verify error was set and retry is allowed
      expect(result.current.error).not.toBeNull()
      expect(result.current.canRetry).toBe(true)

      act(() => {
        result.current.retry()
      })

      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      expect(callback).toHaveBeenCalled()
    })

    it('should handle async callbacks', async () => {
      const asyncCallback = vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return 'done'
      })

      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.setRetryCallback(asyncCallback)
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      await act(async () => {
        vi.advanceTimersByTime(2000)
      })

      expect(asyncCallback).toHaveBeenCalled()
    })
  })

  describe('clearError', () => {
    it('should clear error and reset state', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      expect(result.current.error).not.toBeNull()

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
      expect(result.current.retryCount).toBe(0)
      expect(result.current.isRetrying).toBe(false)
      expect(result.current.retryAfterMs).toBeNull()
    })

    it('should cancel pending retry timer', () => {
      const retryCallback = vi.fn()
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.setRetryCallback(retryCallback)
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
        result.current.retry()
      })

      // Clear before timer fires
      act(() => {
        result.current.clearError()
      })

      // Advance past when retry would have fired
      vi.advanceTimersByTime(5000)

      expect(retryCallback).not.toHaveBeenCalled()
    })
  })

  describe('canRetry', () => {
    it('should be true for recoverable errors under max retries', () => {
      const { result } = renderHook(
        () => useStreamingError({ maxRetries: 3 }),
        { wrapper }
      )

      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      expect(result.current.canRetry).toBe(true)
    })

    it('should be false for non-recoverable errors', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      // Aborted errors are not recoverable
      act(() => {
        result.current.handleStreamError(StreamingError.aborted('sse'))
      })

      expect(result.current.canRetry).toBe(false)
    })

    it('should be false when max retries exceeded', () => {
      const { result } = renderHook(
        () => useStreamingError({ maxRetries: 1, retryDelay: 100 }),
        { wrapper }
      )

      act(() => {
        result.current.setRetryCallback(vi.fn())
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      // First retry
      act(() => {
        result.current.retry()
      })

      vi.advanceTimersByTime(200)

      // Now at max retries
      expect(result.current.canRetry).toBe(false)
    })
  })

  describe('cleanup', () => {
    it('should cleanup timers on unmount', () => {
      const { result, unmount } = renderHook(() => useStreamingError(), {
        wrapper,
      })

      act(() => {
        result.current.setRetryCallback(vi.fn())
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
        result.current.retry()
      })

      // Unmount while timer is pending
      unmount()

      // Should not throw or cause issues when timer fires
      expect(() => {
        vi.advanceTimersByTime(5000)
      }).not.toThrow()
    })
  })

  describe('jitter in backoff', () => {
    it('should add jitter to retry delays', () => {
      const { result } = renderHook(
        () => useStreamingError({ retryDelay: 1000, jitterFactor: 0.3 }),
        { wrapper }
      )

      act(() => {
        result.current.setRetryCallback(vi.fn().mockResolvedValue(undefined))
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      act(() => {
        result.current.retry()
      })

      // Capture the delay immediately after retry is called
      const delay = result.current.retryAfterMs!

      // Base delay is 1000, with up to 30% jitter = 1000-1300
      expect(delay).toBeGreaterThanOrEqual(1000)
      expect(delay).toBeLessThanOrEqual(1300)
    })
  })

  describe('circuit breaker', () => {
    it('should initialize with closed circuit state', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })
      expect(result.current.circuitState).toBe('closed')
    })

    it('should open circuit after threshold failures', () => {
      const onCircuitOpen = vi.fn()
      const { result } = renderHook(
        () =>
          useStreamingError({
            circuitBreakerThreshold: 3,
            onCircuitOpen,
          }),
        { wrapper }
      )

      // Trigger failures up to threshold
      for (let i = 0; i < 3; i++) {
        act(() => {
          result.current.handleStreamError(StreamingError.connectionLost('sse'))
        })
      }

      expect(result.current.circuitState).toBe('open')
      expect(onCircuitOpen).toHaveBeenCalled()
    })

    it('should prevent retries when circuit is open', () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})
      const { result } = renderHook(
        () =>
          useStreamingError({
            circuitBreakerThreshold: 2,
          }),
        { wrapper }
      )

      const retryCallback = vi.fn()
      act(() => {
        result.current.setRetryCallback(retryCallback)
      })

      // Open the circuit
      for (let i = 0; i < 2; i++) {
        act(() => {
          result.current.handleStreamError(StreamingError.connectionLost('sse'))
        })
      }

      expect(result.current.circuitState).toBe('open')

      // Try to retry - should be blocked
      act(() => {
        result.current.retry()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('circuit breaker is open')
      )
      expect(retryCallback).not.toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
    })

    it('should transition to half-open after reset time', () => {
      const { result } = renderHook(
        () =>
          useStreamingError({
            circuitBreakerThreshold: 1,
            circuitBreakerResetTime: 1000,
          }),
        { wrapper }
      )

      // Open the circuit
      act(() => {
        result.current.handleStreamError(StreamingError.connectionLost('sse'))
      })

      expect(result.current.circuitState).toBe('open')

      // Advance past reset time
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(result.current.circuitState).toBe('half-open')
    })
  })

  describe('stream resumption', () => {
    it('should initialize canResume as false', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })
      expect(result.current.canResume).toBe(false)
    })

    it('should set canResume true when error has partial content', () => {
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.handleStreamError(
          StreamingError.connectionLost('sse', 'Some partial content...')
        )
      })

      expect(result.current.canResume).toBe(true)
    })

    it('should warn when trying to resume without partial content', async () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      // Register callback to bypass "no retry callback" check
      act(() => {
        result.current.setRetryCallback(vi.fn())
      })

      act(() => {
        result.current.handleStreamError(
          StreamingError.connectionLost('sse') // No partial content
        )
      })

      await act(async () => {
        await result.current.resumeStream()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('no partial content available')
      )

      consoleWarnSpy.mockRestore()
    })

    it('should warn when trying to resume without callback', async () => {
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {})
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.handleStreamError(
          StreamingError.connectionLost('sse', 'partial')
        )
      })

      await act(async () => {
        await result.current.resumeStream()
      })

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('no retry callback registered')
      )

      consoleWarnSpy.mockRestore()
    })

    it('should call callback with resume payload', async () => {
      const resumeCallback = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.setRetryCallback(resumeCallback)
        result.current.handleStreamError(
          StreamingError.connectionLost('sse', 'The answer is...'),
          { lastEventId: 'evt_123' }
        )
      })

      await act(async () => {
        await result.current.resumeStream()
      })

      expect(resumeCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          partialContent: 'The answer is...',
          lastEventId: 'evt_123',
        })
      )
    })

    it('should allow custom resume payload', async () => {
      const resumeCallback = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useStreamingError(), { wrapper })

      act(() => {
        result.current.setRetryCallback(resumeCallback)
        result.current.handleStreamError(new Error('Connection lost'))
      })

      await act(async () => {
        await result.current.resumeStream({
          partialContent: 'custom content',
          lastEventId: 'custom_id',
          tokenCount: 100,
        })
      })

      expect(resumeCallback).toHaveBeenCalledWith({
        partialContent: 'custom content',
        lastEventId: 'custom_id',
        tokenCount: 100,
      })
    })
  })
})