import { useState, useCallback } from 'react'

/**
 * Options for async error handling with retry logic
 */
export interface UseAsyncErrorOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Delay between retries in milliseconds (default: 1000) */
  retryDelay?: number
  /** Callback function when an error occurs */
  onError?: (error: Error) => void
  /** Callback function when operation succeeds */
  onSuccess?: () => void
}

/**
 * Hook for handling async operations with automatic retry logic and exponential backoff
 * 
 * @example
 * ```tsx
 * const { executeAsync, isLoading, error, retryCount } = useAsyncError()
 * 
 * const fetchData = async () => {
 *   const result = await executeAsync(
 *     async () => {
 *       const res = await fetch('/api/data')
 *       if (!res.ok) throw new Error('Request failed')
 *       return res.json()
 *     },
 *     { maxRetries: 3, retryDelay: 1000 }
 *   )
 * }
 * ```
 */
export function useAsyncError<T = any>() {
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const reset = useCallback(() => {
    setError(null)
    setIsLoading(false)
    setRetryCount(0)
  }, [])

  const executeAsync = useCallback(
    async (
      asyncFn: () => Promise<T>,
      options?: UseAsyncErrorOptions
    ): Promise<T | null> => {
      const {
        maxRetries = 3,
        retryDelay = 1000,
        onError,
        onSuccess,
      } = options || {}

      setIsLoading(true)
      setError(null)

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await asyncFn()
          setIsLoading(false)
          setRetryCount(0)
          onSuccess?.()
          return result
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          setRetryCount(attempt + 1)

          // If we haven't exhausted retries, wait and try again
          if (attempt < maxRetries) {
            // Exponential backoff: 1s, 2s, 3s, etc.
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * (attempt + 1))
            )
          } else {
            // Final failure after all retries
            setError(error)
            setIsLoading(false)
            onError?.(error)
            return null
          }
        }
      }

      // Should never reach here, but TypeScript needs it
      setIsLoading(false)
      return null
    },
    []
  )

  return {
    /** Current error, if any */
    error,
    /** Whether an async operation is in progress */
    isLoading,
    /** Current retry attempt count */
    retryCount,
    /** Execute an async function with retry logic */
    executeAsync,
    /** Reset error state */
    reset,
  }
}
