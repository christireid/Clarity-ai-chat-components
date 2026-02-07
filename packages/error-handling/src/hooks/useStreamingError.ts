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
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface UseStreamingErrorOptions extends UseEnhancedErrorHandlerOptions {
  /** Maximum retry attempts */
  maxRetries?: number
  /** Base delay between retries (ms) */
  retryDelay?: number
  /** Jitter factor (0-1) for randomizing delays to prevent thundering herd */
  jitterFactor?: number
  /** ERROR-2: Called when retrying (now includes partial state for resumption) */
  onRetry?: (attempt: number, partialState?: ResumePayload) => void
  /** Called when max retries exceeded */
  onMaxRetriesExceeded?: (error: StreamingError) => void
  /** Circuit breaker: failures before opening circuit */
  circuitBreakerThreshold?: number
  /** Circuit breaker: time before attempting recovery (ms) */
  circuitBreakerResetTime?: number
  /** ERROR-1: Circuit breaker: consecutive successes required to close circuit (default: 3) */
  circuitBreakerSuccessThreshold?: number
  /** Called when circuit breaker opens */
  onCircuitOpen?: () => void
  /** ERROR-1: Called when circuit breaker closes after recovery */
  onCircuitClose?: () => void
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
  /** ERROR-1: Number of consecutive successes (used for circuit breaker recovery) */
  successCount: number
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
 *     onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
 *     onCircuitOpen: () => console.log('Circuit breaker opened'),
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
 *       {circuitState === 'OPEN' && <p>Service temporarily unavailable</p>}
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
    circuitBreakerSuccessThreshold = 3, // ERROR-1: Consecutive successes to close circuit
    onCircuitOpen,
    onCircuitClose, // ERROR-1: Callback when circuit closes
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
  const [circuitState, setCircuitState] = React.useState<CircuitState>('CLOSED')
  const [failureCount, setFailureCount] = React.useState(0)
  const [successCount, setSuccessCount] = React.useState(0) // ERROR-1: Track consecutive successes
  const [lastEventId, setLastEventId] = React.useState<string | undefined>()
  const [partialContent, setPartialContent] = React.useState<
    string | undefined
  >() // ERROR-2: Store partial content for retry

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
    circuitState !== 'OPEN'
  const canResume = error?.hasPartialContent === true && circuitState !== 'OPEN'

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
    setCircuitState('OPEN')
    onCircuitOpen?.()

    // Schedule transition to half-open
    circuitTimerRef.current = setTimeout(() => {
      setCircuitState('HALF_OPEN')
    }, circuitBreakerResetTime)
  }, [circuitBreakerResetTime, onCircuitOpen])

  const handleStreamError = React.useCallback(
    (
      rawError: unknown,
      opts?: { partialContent?: string; lastEventId?: string }
    ) => {
      // ERROR-1: Reset success count on any error
      setSuccessCount(0)

      // Track failure for circuit breaker (cap at threshold + 1 to prevent overflow)
      const newFailureCount = Math.min(
        failureCount + 1,
        circuitBreakerThreshold + 1
      )
      setFailureCount(newFailureCount)

      // Check if we should open the circuit
      if (
        newFailureCount >= circuitBreakerThreshold &&
        circuitState === 'CLOSED'
      ) {
        openCircuit()
      }

      // If circuit was half-open and we got an error, open it again
      if (circuitState === 'HALF_OPEN') {
        openCircuit()
      }

      // ERROR-2: Store partial state for resumption
      if (opts?.lastEventId) {
        setLastEventId(opts.lastEventId)
      }
      if (opts?.partialContent) {
        setPartialContent(opts.partialContent)
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
    if (circuitState === 'OPEN') {
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
        // ERROR-2: Build partial state for retry
        const partialState: ResumePayload | undefined =
          partialContent || lastEventId
            ? { partialContent, lastEventId }
            : undefined

        onRetry?.(nextAttempt, partialState)
        await retryCallbackRef.current?.(partialState)

        // ERROR-1: Success - increment success count and check if circuit should close
        const newSuccessCount = successCount + 1
        setSuccessCount(newSuccessCount)

        // If circuit was half-open and we have enough successes, close it
        if (
          circuitState === 'HALF_OPEN' &&
          newSuccessCount >= circuitBreakerSuccessThreshold
        ) {
          setCircuitState('CLOSED')
          setFailureCount(0)
          setSuccessCount(0) // Reset after closing circuit
          onCircuitClose?.()
        }
      } catch {
        // Error will be handled by handleStreamError
      } finally {
        setIsRetrying(false)
      }
    }, delay)
  }, [
    canRetry,
    retryCount,
    retryDelay,
    jitterFactor,
    onRetry,
    circuitState,
    successCount,
    circuitBreakerSuccessThreshold,
    onCircuitClose,
    partialContent,
    lastEventId,
  ])

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

        // ERROR-1: Success - increment success count and check if circuit should close
        const newSuccessCount = successCount + 1
        setSuccessCount(newSuccessCount)

        // If circuit was half-open and we have enough successes, close it
        if (
          circuitState === 'HALF_OPEN' &&
          newSuccessCount >= circuitBreakerSuccessThreshold
        ) {
          setCircuitState('CLOSED')
          setFailureCount(0)
          setSuccessCount(0) // Reset after closing circuit
          onCircuitClose?.()
        }
      } catch {
        // Error will be handled by handleStreamError
      } finally {
        setIsRetrying(false)
      }
    },
    [
      error,
      lastEventId,
      circuitState,
      successCount,
      circuitBreakerSuccessThreshold,
      onCircuitClose,
    ]
  )

  const clearError = React.useCallback(() => {
    baseClearError()
    setRetryCount(0)
    setIsRetrying(false)
    setRetryAfterMs(null)
    setLastEventId(undefined)
    setPartialContent(undefined) // ERROR-2: Clear partial content

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
    successCount, // ERROR-1: Expose success count
    canResume,
  }
}
