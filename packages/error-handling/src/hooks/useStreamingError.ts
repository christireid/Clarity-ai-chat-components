'use client'

import * as React from 'react'
import {
  useEnhancedErrorHandler,
  type UseEnhancedErrorHandlerOptions,
} from './useEnhancedErrorHandler'
import { StreamingError, StreamingErrorCode } from '../errors/streaming-error'
import { isStreamingError } from '../errors/type-guards'

export interface UseStreamingErrorOptions extends UseEnhancedErrorHandlerOptions {
  /** Maximum retry attempts */
  maxRetries?: number
  /** Base delay between retries (ms) */
  retryDelay?: number
  /** Called when retrying */
  onRetry?: (attempt: number) => void
  /** Called when max retries exceeded */
  onMaxRetriesExceeded?: (error: StreamingError) => void
}

export interface UseStreamingErrorReturn {
  /** Handle streaming error with automatic retry logic */
  handleStreamError: (
    error: unknown,
    options?: { partialContent?: string }
  ) => void
  /** Retry the failed operation */
  retry: () => void
  /** Register a retry callback function */
  setRetryCallback: (callback: () => void | Promise<void>) => void
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
}

/**
 * Specialized error handling for streaming operations
 * Includes automatic retry logic with exponential backoff
 *
 * @example
 * ```tsx
 * function StreamingChat() {
 *   const {
 *     handleStreamError,
 *     retry,
 *     setRetryCallback,
 *     canRetry,
 *     error
 *   } = useStreamingError({
 *     maxRetries: 3,
 *     onRetry: (attempt) => console.log(`Retry attempt ${attempt}`),
 *   });
 *
 *   const startStream = useCallback(async () => {
 *     try {
 *       await connectToStream();
 *     } catch (err) {
 *       handleStreamError(err, { partialContent: currentText });
 *     }
 *   }, [handleStreamError]);
 *
 *   // Register the retry callback
 *   useEffect(() => {
 *     setRetryCallback(startStream);
 *   }, [startStream, setRetryCallback]);
 *
 *   return (
 *     <div>
 *       {error && canRetry && <button onClick={retry}>Retry</button>}
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
    onRetry,
    onMaxRetriesExceeded,
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
  const retryCallbackRef = React.useRef<(() => void | Promise<void>) | null>(
    null
  )
  const retryTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Extract streaming error or null
  const error = isStreamingError(baseError) ? baseError : null
  const canRetry = error?.recoverable === true && retryCount < maxRetries

  // Clean up timer on unmount
  React.useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
      }
    }
  }, [])

  const handleStreamError = React.useCallback(
    (rawError: unknown, opts?: { partialContent?: string }) => {
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
              }
            )

      baseHandleError(streamError)

      // Check if max retries exceeded
      if (retryCount >= maxRetries && streamError.recoverable) {
        onMaxRetriesExceeded?.(streamError)
      }
    },
    [baseHandleError, retryCount, maxRetries, onMaxRetriesExceeded]
  )

  const setRetryCallback = React.useCallback(
    (callback: () => void | Promise<void>) => {
      retryCallbackRef.current = callback
    },
    []
  )

  const retry = React.useCallback(() => {
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

    // Exponential backoff: 1s, 2s, 4s, etc.
    const delay = retryDelay * Math.pow(2, retryCount)
    setRetryAfterMs(delay)

    // Clear retry countdown
    const countdownInterval = setInterval(() => {
      setRetryAfterMs((prev) => {
        if (prev === null || prev <= 100) {
          clearInterval(countdownInterval)
          return null
        }
        return prev - 100
      })
    }, 100)

    retryTimerRef.current = setTimeout(async () => {
      clearInterval(countdownInterval)
      setRetryAfterMs(null)

      try {
        onRetry?.(nextAttempt)
        await retryCallbackRef.current?.()
      } finally {
        setIsRetrying(false)
      }
    }, delay)
  }, [canRetry, retryCount, retryDelay, onRetry])

  const clearError = React.useCallback(() => {
    baseClearError()
    setRetryCount(0)
    setIsRetrying(false)
    setRetryAfterMs(null)
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }
  }, [baseClearError])

  return {
    handleStreamError,
    retry,
    setRetryCallback,
    isRetrying,
    retryCount,
    clearError,
    error,
    canRetry,
    retryAfterMs,
  }
}
