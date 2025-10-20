import * as React from 'react'

/**
 * Error recovery options
 */
export interface UseErrorRecoveryOptions<T> {
  /** The async operation to execute and retry */
  operation: (...args: any[]) => Promise<T>
  
  /** Maximum retry attempts (default: 3) */
  maxAttempts?: number
  
  /** Backoff delays in milliseconds (default: [1000, 3000, 10000]) */
  backoffMs?: number[]
  
  /** Function to determine if error is retryable (default: all errors retryable) */
  shouldRetry?: (error: Error, attempt: number) => boolean
  
  /** Callback when retry starts */
  onRetryStart?: (attempt: number) => void
  
  /** Callback when retry succeeds */
  onRetrySuccess?: (result: T, attempt: number) => void
  
  /** Callback when retry fails */
  onRetryFail?: (error: Error, attempt: number) => void
  
  /** Callback when max attempts reached */
  onMaxAttemptsReached?: (error: Error) => void
}

/**
 * Error recovery state
 */
export interface UseErrorRecoveryReturn<T> {
  /** Execute operation with retry logic */
  execute: (...args: any[]) => Promise<T | null>
  
  /** Manually retry last failed operation */
  retry: () => Promise<T | null>
  
  /** Current error if any */
  error: Error | null
  
  /** Whether operation is currently executing */
  isLoading: boolean
  
  /** Whether operation is retrying */
  isRetrying: boolean
  
  /** Current attempt number (0 = not started, 1 = first attempt, etc.) */
  attemptNumber: number
  
  /** Whether can retry (haven't reached max attempts) */
  canRetry: boolean
  
  /** User-friendly error message */
  errorMessage: string | null
  
  /** Error type classification */
  errorType: 'network' | 'ratelimit' | 'server' | 'auth' | 'unknown' | null
  
  /** Last successful result */
  data: T | null
  
  /** Reset state */
  reset: () => void
}

/**
 * Classify error type
 */
function classifyError(error: Error): 'network' | 'ratelimit' | 'server' | 'auth' | 'unknown' {
  const message = error.message.toLowerCase()
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network'
  }
  
  if (message.includes('rate limit') || message.includes('too many requests') || message.includes('429')) {
    return 'ratelimit'
  }
  
  if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
    return 'server'
  }
  
  if (message.includes('401') || message.includes('403') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'auth'
  }
  
  return 'unknown'
}

/**
 * Get user-friendly error message
 */
function getUserFriendlyMessage(errorType: string): string {
  switch (errorType) {
    case 'network':
      return 'Connection lost. Please check your internet and try again.'
    case 'ratelimit':
      return 'Too many requests. Please wait a moment before trying again.'
    case 'server':
      return 'Server error. Please try again in a moment.'
    case 'auth':
      return 'Authentication failed. Please sign in again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

/**
 * Production-ready error recovery hook with intelligent retry logic.
 * 
 * **Features:**
 * - Automatic retry with exponential backoff
 * - Configurable retry logic (max attempts, delays, conditions)
 * - Error classification (network, rate limit, server, auth)
 * - User-friendly error messages
 * - Retry state tracking
 * - Manual retry capability
 * - Success/failure callbacks for analytics
 * 
 * **Use Cases:**
 * - API request error handling
 * - Network failure recovery
 * - Rate limit handling
 * - Server error retry
 * - Authentication refresh
 * 
 * @example
 * ```tsx
 * // Basic API retry
 * const { execute, error, isLoading, retry, canRetry } = useErrorRecovery({
 *   operation: async (message: string) => {
 *     const response = await fetch('/api/chat', {
 *       method: 'POST',
 *       body: JSON.stringify({ message }),
 *     })
 *     return response.json()
 *   },
 *   maxAttempts: 3,
 * })
 * 
 * const handleSend = async () => {
 *   const result = await execute('Hello!')
 *   if (result) {
 *     console.log('Success:', result)
 *   }
 * }
 * 
 * // Custom retry logic
 * const { execute } = useErrorRecovery({
 *   operation: sendMessage,
 *   maxAttempts: 5,
 *   backoffMs: [1000, 2000, 5000, 10000, 30000],
 *   shouldRetry: (error, attempt) => {
 *     // Don't retry auth errors
 *     if (error.message.includes('401')) return false
 *     // Only retry network errors up to 3 times
 *     if (error.message.includes('network') && attempt > 3) return false
 *     return true
 *   },
 *   onRetryStart: (attempt) => {
 *     console.log(`Retry attempt ${attempt}`)
 *     analytics.track('retry_started', { attempt })
 *   },
 *   onRetrySuccess: (result, attempt) => {
 *     console.log(`Success after ${attempt} attempts`)
 *     analytics.track('retry_succeeded', { attempt })
 *   },
 *   onMaxAttemptsReached: (error) => {
 *     console.error('Max retries reached:', error)
 *     showSupportDialog()
 *   },
 * })
 * 
 * // With manual retry UI
 * function ChatMessage() {
 *   const { execute, error, errorMessage, errorType, retry, canRetry, isRetrying } = useErrorRecovery({
 *     operation: sendMessage,
 *   })
 * 
 *   return (
 *     <div>
 *       {error && (
 *         <div>
 *           <p>{errorMessage}</p>
 *           {canRetry && (
 *             <button onClick={retry} disabled={isRetrying}>
 *               {isRetrying ? 'Retrying...' : 'Try Again'}
 *             </button>
 *           )}
 *         </div>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useErrorRecovery<T = any>(
  options: UseErrorRecoveryOptions<T>
): UseErrorRecoveryReturn<T> {
  const {
    operation,
    maxAttempts = 3,
    backoffMs = [1000, 3000, 10000],
    shouldRetry = () => true,
    onRetryStart,
    onRetrySuccess,
    onRetryFail,
    onMaxAttemptsReached,
  } = options

  const [error, setError] = React.useState<Error | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [attemptNumber, setAttemptNumber] = React.useState(0)
  const [data, setData] = React.useState<T | null>(null)
  const lastArgsRef = React.useRef<any[]>([])

  const canRetry = attemptNumber < maxAttempts && error !== null
  const errorType = error ? classifyError(error) : null
  const errorMessage = errorType ? getUserFriendlyMessage(errorType) : null

  /**
   * Get delay for current attempt
   */
  const getDelay = React.useCallback(
    (attempt: number): number => {
      const index = Math.min(attempt - 1, backoffMs.length - 1)
      return backoffMs[index]
    },
    [backoffMs]
  )

  /**
   * Execute operation with retry logic
   */
  const execute = React.useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Store args for manual retry
      lastArgsRef.current = args

      let currentAttempt = 0
      let lastError: Error | null = null

      setIsLoading(true)
      setError(null)
      setAttemptNumber(0)

      while (currentAttempt < maxAttempts) {
        currentAttempt++
        setAttemptNumber(currentAttempt)

        try {
          // Show retry state for attempts > 1
          if (currentAttempt > 1) {
            setIsRetrying(true)
            onRetryStart?.(currentAttempt)

            // Wait for backoff delay
            const delay = getDelay(currentAttempt - 1)
            await new Promise((resolve) => setTimeout(resolve, delay))
          }

          // Execute operation
          const result = await operation(...args)
          
          // Success
          setData(result)
          setError(null)
          setIsLoading(false)
          setIsRetrying(false)
          
          if (currentAttempt > 1) {
            onRetrySuccess?.(result, currentAttempt)
          }
          
          return result
        } catch (err) {
          lastError = err as Error
          console.error(`[useErrorRecovery] Attempt ${currentAttempt} failed:`, err)

          // Check if should retry
          if (!shouldRetry(lastError, currentAttempt)) {
            console.log('[useErrorRecovery] shouldRetry returned false - stopping retries')
            break
          }

          // Check if reached max attempts
          if (currentAttempt >= maxAttempts) {
            console.log('[useErrorRecovery] Max attempts reached')
            break
          }

          // Notify retry failure
          if (currentAttempt > 1) {
            onRetryFail?.(lastError, currentAttempt)
          }
        }
      }

      // All attempts failed
      setError(lastError)
      setIsLoading(false)
      setIsRetrying(false)

      if (lastError) {
        onMaxAttemptsReached?.(lastError)
      }

      return null
    },
    [operation, maxAttempts, shouldRetry, onRetryStart, onRetrySuccess, onRetryFail, onMaxAttemptsReached, getDelay]
  )

  /**
   * Manually retry last operation
   */
  const retry = React.useCallback(async (): Promise<T | null> => {
    if (!canRetry) {
      console.warn('[useErrorRecovery] Cannot retry - max attempts reached or no error')
      return null
    }

    // Reset attempt counter for new retry sequence
    setAttemptNumber(0)
    setError(null)

    return execute(...lastArgsRef.current)
  }, [canRetry, execute])

  /**
   * Reset state
   */
  const reset = React.useCallback(() => {
    setError(null)
    setIsLoading(false)
    setIsRetrying(false)
    setAttemptNumber(0)
    setData(null)
    lastArgsRef.current = []
  }, [])

  return {
    execute,
    retry,
    error,
    isLoading,
    isRetrying,
    attemptNumber,
    canRetry,
    errorMessage,
    errorType,
    data,
    reset,
  }
}
