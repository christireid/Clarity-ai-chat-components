import { logger } from '@clarity-chat/utils/logger';
'use client'

import * as React from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { isClarityError } from '../errors/base-error'

export interface UseEnhancedErrorHandlerOptions {
  /** Callback when error is handled */
  onError?: (error: Error) => void
  /** Whether to show error boundary UI */
  showBoundary?: boolean
  /** Log errors to console in development */
  logInDev?: boolean
}

export interface UseEnhancedErrorHandlerReturn {
  /** Handle an error - shows boundary UI and logs */
  handleError: (error: unknown) => void
  /** Handle async operation with error handling */
  handleAsync: <T>(promise: Promise<T>) => Promise<T | undefined>
  /** Wrap a function with error handling */
  withErrorHandling: <TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn | Promise<TReturn>
  ) => (...args: TArgs) => Promise<TReturn | undefined>
  /** Clear the current error state */
  clearError: () => void
  /** Current error if any */
  error: Error | null
  /** Whether an error is currently active */
  hasError: boolean
  /** Whether the current error is recoverable */
  isRecoverable: boolean
}

/**
 * Unified error handling hook for components
 * Integrates with error boundaries and provides async error handling
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { handleAsync, error, clearError } = useEnhancedErrorHandler();
 *
 *   const sendMessage = async () => {
 *     const result = await handleAsync(api.sendMessage(input));
 *     if (result) {
 *       // Success
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={sendMessage}>
 *       {error && (
 *         <div>
 *           <p>{error.message}</p>
 *           <button onClick={clearError}>Dismiss</button>
 *         </div>
 *       )}
 *       <input ... />
 *     </form>
 *   );
 * }
 * ```
 */
export function useEnhancedErrorHandler(
  options: UseEnhancedErrorHandlerOptions = {}
): UseEnhancedErrorHandlerReturn {
  const { onError, showBoundary = false, logInDev = true } = options
  const { showBoundary: triggerBoundary, resetBoundary } = useErrorBoundary()
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback(
    (rawError: unknown) => {
      // Normalize to Error object
      const normalizedError =
        rawError instanceof Error ? rawError : new Error(String(rawError))

      // Log in development
      if (logInDev && process.env['NODE_ENV'] === 'development') {
        logger.logger.error('[useEnhancedErrorHandler]', normalizedError)
        if (isClarityError(normalizedError)) {
          logger.logger.error('Details:', normalizedError.toJSON())
        }
      }

      // Set local state
      setError(normalizedError)

      // Trigger callback
      onError?.(normalizedError)

      // Optionally trigger error boundary
      if (showBoundary) {
        triggerBoundary(normalizedError)
      }
    },
    [logInDev, onError, showBoundary, triggerBoundary]
  )

  const handleAsync = React.useCallback(
    async <T>(promise: Promise<T>): Promise<T | undefined> => {
      try {
        setError(null)
        return await promise
      } catch (err) {
        handleError(err)
        return undefined
      }
    },
    [handleError]
  )

  const withErrorHandling = React.useCallback(
    <TArgs extends unknown[], TReturn>(
      fn: (...args: TArgs) => TReturn | Promise<TReturn>
    ) => {
      return async (...args: TArgs): Promise<TReturn | undefined> => {
        try {
          setError(null)
          const result = fn(...args)
          return result instanceof Promise ? await result : result
        } catch (err) {
          handleError(err)
          return undefined
        }
      }
    },
    [handleError]
  )

  const clearError = React.useCallback(() => {
    setError(null)
    resetBoundary()
  }, [resetBoundary])

  const hasError = error !== null
  const isRecoverable =
    error !== null && isClarityError(error) && error.recoverable

  return {
    handleError,
    handleAsync,
    withErrorHandling,
    clearError,
    error,
    hasError,
    isRecoverable,
  }
}
