import { useCallback } from 'react'
import { ClarityChatError } from '../errors'

/**
 * Options for error handler configuration
 */
export interface UseErrorHandlerOptions {
  /** Whether to log errors to console (default: true in development) */
  logErrors?: boolean
  /** Whether to show toast notifications for errors (default: false) */
  showToast?: boolean
  /** Custom error handler function */
  onError?: (error: Error) => void
}

/**
 * Hook for centralized error handling with logging and notifications
 * 
 * @example
 * ```tsx
 * const { handleError } = useErrorHandler({
 *   logErrors: true,
 *   showToast: true,
 *   onError: (error) => {
 *     // Send to error tracking service
 *     Sentry.captureException(error)
 *   }
 * })
 * 
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   handleError(error)
 * }
 * ```
 */
export function useErrorHandler(options?: UseErrorHandlerOptions) {
  const {
    logErrors = process.env.NODE_ENV === 'development',
    showToast = false,
    onError,
  } = options || {}

  const handleError = useCallback(
    (error: unknown) => {
      const err = error instanceof Error ? error : new Error(String(error))

      // Log to console in development
      if (logErrors) {
        console.group('🚨 Clarity Chat Error')
        console.error('Error:', err)

        // If it's our custom error, log the full details
        if (err instanceof ClarityChatError) {
          console.error('\n' + err.toString())
        }

        console.groupEnd()
      }

      // Show toast notification if enabled
      if (showToast) {
        // This would integrate with a toast system
        // For now, we'll just log that we would show a toast
        if (logErrors) {
          console.info('Toast would be shown:', err.message)
        }
      }

      // Call custom error handler
      onError?.(err)
    },
    [logErrors, showToast, onError]
  )

  return {
    /** Handle an error with logging and notifications */
    handleError,
  }
}
