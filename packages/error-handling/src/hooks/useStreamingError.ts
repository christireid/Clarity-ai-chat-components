'use client'

import * as React from 'react'
import {
  useEnhancedErrorHandler,
  type UseEnhancedErrorHandlerOptions,
} from './useEnhancedErrorHandler'
import { StreamingError, StreamingErrorCode } from '../errors/streaming-error'
import { isStreamingError } from '../errors/type-guards'

/**
 * Circuit breaker states for managing failure patterns
 */
type CircuitState = 'closed' | 'open' | 'half-open'

export interface UseStreamingErrorOptions extends UseEnhancedErrorHandlerOptions {
  /** Maximum retry attempts */
  maxRetries?: number
  /** Base delay between retries (ms) */
  retryDelay?: number
  /** Jitter factor (0-1) for randomizing delays to prevent thundering herd */
  jitterFactor?: number
  /** Called when retrying */
  onRetry?: (attempt: number) => void
  /** Called when max retries exceeded */
  onMaxRetriesExceeded?: (error: StreamingError) => void
  /** Circuit breaker: failures before opening circuit */
  circuitBreakerThreshold?: number
  /** Circuit breaker: time before attempting recovery (ms) */
  circuitBreakerResetTime?: number
  /** Called when circuit breaker opens */
  onCircuitOpen?: () => void
}

export interface UseStreamingErrorReturn {
  /** Handle streaming error with automatic retry logic */
  handleStreamError: (
    error: unknown,
    options?: { partialContent?: string; lastEventId?: string }
  ) => void
  /** Retry the failed operation */
  retry: () => void
  /** Resume stream from partial content (requires server support) */
  resumeStream: (resumePayload?: ResumePayload) => Promise<void>
  /** Register a retry callback function */
  setRetryCallback: (
    callback: (resumePayload?: ResumePayload) => void | Promise<void>
  ) => void
  /** Whether currently retrying */
  isRetrying: boolean
  /** Number of retry attempts made */
  retryCount: number
  /** Clear error and reset retry count */
  clearError: () => void
  /** Current streaming error */
  error: StreamingError | null
  /** Whether error is recoverable */
  canRetry: boolean
  /** Time until next retry is allowed (ms) */
  retryAfterMs: number | null
  /** Circuit breaker state */
  circuitState: CircuitState
  /** Whether stream can be resumed from partial content */
  canResume: boolean
}

/**
 * Payload for resuming a stream from partial content
 */
export interface ResumePayload {
  /** Partial content received before error */
  partialContent?: string
  /** Last event ID for SSE resumption */
  lastEventId?: string
  /** Token count of partial content (if known) */
  tokenCount?: number
}

/**
 * Calculate delay with jitter to prevent thundering herd
 */
function calculateDelayWithJitter(
  baseDelay: number,
  attempt: number,
  jitterFactor: number
): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt)
  const jitter = Math.random() * jitterFactor * exponentialDelay
  return Math.floor(exponentialDelay + jitter)
}

/**
 * Specialized error handling for streaming operations
 * Includes automatic retry logic with exponential backoff and jitter,
 * circuit breaker pattern, and stream resumption support.
 *
 * @example
 * ```tsx
 * function StreamingChat() {
 *   const {
 *     handleStreamError,
 *     retry,
 *     resumeStream,
 *     setRetryCallback,
 *     canRetry,
 *     canResume,
 *     error,
 *     circuitState,
 *   } = useStreamingError({
 *     maxRetries: 3,
 *     jitterFactor: 0.3,
 *     circuitBreakerThreshold: 5,
 *     onRetry: (attempt) => console.debug(`Retry attempt ${attempt}`),
 *     onCircuitOpen: () => console.debug('Circuit breaker opened'),
 *   });
 *
 *   const startStream = useCallback(async (resumePayload?: ResumePayload) => {
 *     try {
 *       await connectToStream(resumePayload);
 *     } catch (err) {
 *       handleStreamError(err, { partialContent: currentText, lastEventId });
 *     }
 *   }, [handleStreamError]);
 *
 *   useEffect(() => {
 *     setRetryCallback(startStream);
 *   }, [startStream, setRetryCallback]);
 *
 *   return (
 *     <div>
 *       {circuitState === 'open' && <p>Service temporarily unavailable</p>}
 *       {error && canRetry && <button onClick={retry}>Retry</button>}
 *       {error && canResume && <button onClick={() => resumeStream()}>Continue</button>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useStreamingError(
  options: UseStreamingErrorOptions = {}
): UseStreamingErrorReturn {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    jitterFactor = 0.3,
    onRetry,
    onMaxRetriesExceeded,
    circuitBreakerThreshold = 5,
    circuitBreakerResetTime = 30000,
    onCircuitOpen,
    ...errorOptions
  } = options

  const {
    handleError: baseHandleError,
    clearError: baseClearError,
    error: baseError,
  } = useEnhancedErrorHandler(errorOptions)

  const [retryCount, setRetryCount] = React.useState(0)
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [retryAfterMs, setRetryAfterMs] = React.useState<number | null>(null)
  const [circuitState, setCircuitState] = React.useState<CircuitState>('closed')
  const [failureCount, setFailureCount] = React.useState(0)
  const [lastEventId, setLastEventId] = React.useState<string | undefined>()

  const retryCallbackRef = React.useRef<
    ((resumePayload?: ResumePayload) => void | Promise<void>) | null
  >(null)
  const retryTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownIntervalRef = React.useRef<ReturnType<
    typeof setInterval
  > | null>(null)
  const circuitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  // Extract streaming error or null
  const error = isStreamingError(baseError) ? baseError : null
  const canRetry =
    error?.recoverable === true &&
    retryCount < maxRetries &&
    circuitState !== 'open'
  const canResume = error?.hasPartialContent === true && circuitState !== 'open'

  // Clean up timers on unmount
  React.useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      if (circuitTimerRef.current) {
        clearTimeout(circuitTimerRef.current)
      }
    }
  }, [])

  // Handle circuit breaker state transitions
  const openCircuit = React.useCallback(() => {
    setCircuitState('open')
    onCircuitOpen?.()

    // Schedule transition to half-open
    circuitTimerRef.current = setTimeout(() => {
      setCircuitState('half-open')
    }, circuitBreakerResetTime)
  }, [circuitBreakerResetTime, onCircuitOpen])

  const handleStreamError = React.useCallback(
    (
      rawError: unknown,
      opts?: { partialContent?: string; lastEventId?: string }
    ) => {
      // Track failure for circuit breaker
      const newFailureCount = failureCount + 1
      setFailureCount(newFailureCount)

      // Check if we should open the circuit
      if (
        newFailureCount >= circuitBreakerThreshold &&
        circuitState === 'closed'
      ) {
        openCircuit()
      }

      // If circuit was half-open and we got an error, open it again
      if (circuitState === 'half-open') {
        openCircuit()
      }

      // Store last event ID for resumption
      if (opts?.lastEventId) {
        setLastEventId(opts.lastEventId)
      }

      const streamError =
        rawError instanceof StreamingError
          ? rawError
          : new StreamingError(
              rawError instanceof Error ? rawError.message : String(rawError),
              {
                code: StreamingErrorCode.CONNECTION_FAILED,
                transport: 'sse',
                partialContent: opts?.partialContent,
                cause: rawError instanceof Error ? rawError : undefined,
                context: opts?.lastEventId
                  ? { lastEventId: opts.lastEventId }
                  : undefined,
              }
            )

      baseHandleError(streamError)

      // Check if max retries exceeded
      if (retryCount >= maxRetries && streamError.recoverable) {
        onMaxRetriesExceeded?.(streamError)
      }
    },
    [
      baseHandleError,
      retryCount,
      maxRetries,
      onMaxRetriesExceeded,
      failureCount,
      circuitBreakerThreshold,
      circuitState,
      openCircuit,
    ]
  )

  const setRetryCallback = React.useCallback(
    (callback: (resumePayload?: ResumePayload) => void | Promise<void>) => {
      retryCallbackRef.current = callback
    },
    []
  )

  const retry = React.useCallback(() => {
    if (circuitState === 'open') {
      console.warn('[useStreamingError] Cannot retry: circuit breaker is open')
      return
    }

    if (!canRetry) {
      console.warn(
        '[useStreamingError] Cannot retry: max retries exceeded or error not recoverable'
      )
      return
    }

    if (!retryCallbackRef.current) {
      console.warn(
        '[useStreamingError] Cannot retry: no retry callback registered'
      )
      return
    }

    setIsRetrying(true)
    const nextAttempt = retryCount + 1
    setRetryCount(nextAttempt)

    // Exponential backoff with jitter
    const delay = calculateDelayWithJitter(retryDelay, retryCount, jitterFactor)
    setRetryAfterMs(delay)

    // Clear previous interval if exists
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    // Clear retry countdown
    countdownIntervalRef.current = setInterval(() => {
      setRetryAfterMs((prev) => {
        if (prev === null || prev <= 100) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current)
            countdownIntervalRef.current = null
          }
          return null
        }
        return prev - 100
      })
    }, 100)

    retryTimerRef.current = setTimeout(async () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
        countdownIntervalRef.current = null
      }
      setRetryAfterMs(null)

      try {
        onRetry?.(nextAttempt)
        await retryCallbackRef.current?.()

        // Success - if circuit was half-open, close it
        if (circuitState === 'half-open') {
          setCircuitState('closed')
          setFailureCount(0)
        }
      } catch {
        // Error will be handled by handleStreamError
      } finally {
        setIsRetrying(false)
      }
    }, delay)
  }, [canRetry, retryCount, retryDelay, jitterFactor, onRetry, circuitState])

  const resumeStream = React.useCallback(
    async (customPayload?: ResumePayload) => {
      if (!error?.hasPartialContent && !customPayload) {
        console.warn(
          '[useStreamingError] Cannot resume: no partial content available'
        )
        return
      }

      if (!retryCallbackRef.current) {
        console.warn(
          '[useStreamingError] Cannot resume: no retry callback registered'
        )
        return
      }

      setIsRetrying(true)

      const resumePayload: ResumePayload = customPayload ?? {
        partialContent: error?.partialContent,
        lastEventId: lastEventId ?? (error?.context?.['lastEventId'] as string),
      }

      try {
        await retryCallbackRef.current(resumePayload)

        // Success - reset circuit breaker if needed
        if (circuitState === 'half-open') {
          setCircuitState('closed')
          setFailureCount(0)
        }
      } catch {
        // Error will be handled by handleStreamError
      } finally {
        setIsRetrying(false)
      }
    },
    [error, lastEventId, circuitState]
  )

  const clearError = React.useCallback(() => {
    baseClearError()
    setRetryCount(0)
    setIsRetrying(false)
    setRetryAfterMs(null)
    setLastEventId(undefined)

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }
  }, [baseClearError])

  return {
    handleStreamError,
    retry,
    resumeStream,
    setRetryCallback,
    isRetrying,
    retryCount,
    clearError,
    error,
    canRetry,
    retryAfterMs,
    circuitState,
    canResume,
  }
}
