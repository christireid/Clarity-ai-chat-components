import * as React from 'react'

/**
 * Error type for different retry strategies
 */
export type RetryErrorType = 'network' | 'ratelimit' | 'server' | 'auth' | 'unknown'

/**
 * Retry button props
 */
export interface RetryButtonProps {
  /** Function to call on retry */
  onRetry: () => void | Promise<void>
  
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number
  
  /** Backoff delays in milliseconds for each attempt (default: [1000, 3000, 10000]) */
  backoffMs?: number[]
  
  /** Error type for appropriate messaging (default: 'unknown') */
  errorType?: RetryErrorType
  
  /** Current attempt number (external control) */
  attemptNumber?: number
  
  /** Whether button is disabled */
  disabled?: boolean
  
  /** Custom button text */
  buttonText?: string
  
  /** Show remaining attempts count (default: true) */
  showAttemptsRemaining?: boolean
  
  /** Callback when max attempts reached */
  onMaxAttemptsReached?: () => void
  
  /** Callback when retry starts */
  onRetryStart?: (attempt: number) => void
  
  /** Callback when retry succeeds */
  onRetrySuccess?: (attempt: number) => void
  
  /** Callback when retry fails */
  onRetryFail?: (attempt: number, error: Error) => void
  
  /** Custom CSS class */
  className?: string
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  
  /** Visual variant */
  variant?: 'default' | 'ghost' | 'outline'
}

/**
 * Error messages for different error types
 */
const ERROR_MESSAGES: Record<RetryErrorType, string> = {
  network: 'Connection lost. Check your internet and try again.',
  ratelimit: 'Too many requests. Please wait a moment before retrying.',
  server: 'Server error. Please try again in a moment.',
  auth: 'Authentication failed. Please sign in again.',
  unknown: 'Something went wrong. Please try again.',
}

/**
 * Production-ready Retry Button component with exponential backoff.
 * 
 * **Features:**
 * - Exponential backoff with configurable delays
 * - Type-specific error messages (network, rate limit, server, auth)
 * - Visual feedback during retry countdown
 * - Attempt tracking and max attempts enforcement
 * - Success/failure callbacks for analytics
 * - Accessible (keyboard navigation, ARIA attributes)
 * - Loading states during retry operation
 * 
 * **Use Cases:**
 * - Retry failed API requests
 * - Reconnect after network errors
 * - Handle rate limit errors gracefully
 * - Provide user-friendly error recovery
 * 
 * @example
 * ```tsx
 * // Basic network error retry
 * <RetryButton
 *   onRetry={handleRetry}
 *   errorType="network"
 *   maxAttempts={3}
 * />
 * 
 * // Custom backoff delays
 * <RetryButton
 *   onRetry={async () => {
 *     await sendMessage()
 *   }}
 *   backoffMs={[2000, 5000, 15000]} // 2s, 5s, 15s
 *   errorType="ratelimit"
 * />
 * 
 * // With analytics tracking
 * <RetryButton
 *   onRetry={handleRetry}
 *   onRetryStart={(attempt) => {
 *     analytics.track('retry_started', { attempt })
 *   }}
 *   onRetrySuccess={(attempt) => {
 *     analytics.track('retry_succeeded', { attempt })
 *   }}
 *   onRetryFail={(attempt, error) => {
 *     analytics.track('retry_failed', { attempt, error: error.message })
 *   }}
 *   onMaxAttemptsReached={() => {
 *     analytics.track('max_retries_reached')
 *     showSupportDialog()
 *   }}
 * />
 * 
 * // Small ghost variant
 * <RetryButton
 *   onRetry={handleRetry}
 *   size="sm"
 *   variant="ghost"
 *   buttonText="Try Again"
 * />
 * ```
 */
export function RetryButton({
  onRetry,
  maxAttempts = 3,
  backoffMs = [1000, 3000, 10000],
  errorType = 'unknown',
  attemptNumber,
  disabled = false,
  buttonText,
  showAttemptsRemaining = true,
  onMaxAttemptsReached,
  onRetryStart,
  onRetrySuccess,
  onRetryFail,
  className = '',
  size = 'md',
  variant = 'default',
}: RetryButtonProps) {
  const [currentAttempt, setCurrentAttempt] = React.useState(attemptNumber ?? 0)
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [countdown, setCountdown] = React.useState<number | null>(null)
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // Sync external attempt number
  React.useEffect(() => {
    if (attemptNumber !== undefined) {
      setCurrentAttempt(attemptNumber)
    }
  }, [attemptNumber])

  const attemptsRemaining = maxAttempts - currentAttempt
  const canRetry = attemptsRemaining > 0 && !isRetrying && !disabled

  /**
   * Get delay for current attempt
   */
  const getDelay = (attempt: number): number => {
    const index = Math.min(attempt, backoffMs.length - 1)
    return backoffMs[index]
  }

  /**
   * Start countdown timer
   */
  const startCountdown = (delayMs: number) => {
    let remaining = delayMs / 1000
    setCountdown(remaining)

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    countdownIntervalRef.current = setInterval(() => {
      remaining -= 0.1
      setCountdown(remaining)

      if (remaining <= 0) {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current)
          countdownIntervalRef.current = null
        }
        setCountdown(null)
      }
    }, 100)
  }

  /**
   * Handle retry click
   */
  const handleRetry = async () => {
    if (!canRetry) return

    const nextAttempt = currentAttempt + 1

    // Check max attempts
    if (nextAttempt > maxAttempts) {
      onMaxAttemptsReached?.()
      return
    }

    setIsRetrying(true)
    setCurrentAttempt(nextAttempt)
    onRetryStart?.(nextAttempt)

    // Get delay for this attempt
    const delay = getDelay(currentAttempt)
    
    // Show countdown if delay > 500ms
    if (delay > 500) {
      startCountdown(delay)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    try {
      await onRetry()
      onRetrySuccess?.(nextAttempt)
      
      // Reset on success
      setCurrentAttempt(0)
    } catch (error) {
      console.error('[RetryButton] Retry failed:', error)
      onRetryFail?.(nextAttempt, error as Error)
    } finally {
      setIsRetrying(false)
      setCountdown(null)
    }
  }

  /**
   * Cleanup on unmount
   */
  React.useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [])

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // Variant classes
  const variantClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
  }

  const buttonClasses = `
    group inline-flex items-center gap-2 rounded-lg font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim()

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleRetry}
        disabled={!canRetry}
        className={buttonClasses}
        aria-label={`Retry (${attemptsRemaining} attempts remaining)`}
      >
        {/* Icon with rotation animation */}
        {isRetrying ? (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}

        {/* Button text */}
        <span>
          {buttonText || (isRetrying ? 'Retrying...' : 'Try Again')}
          {countdown !== null && ` (${countdown.toFixed(1)}s)`}
        </span>

        {/* Attempts remaining */}
        {showAttemptsRemaining && attemptsRemaining > 0 && (
          <span className="text-xs opacity-75">
            ({attemptsRemaining} left)
          </span>
        )}
      </button>

      {/* Error message */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {ERROR_MESSAGES[errorType]}
      </p>

      {/* Max attempts reached */}
      {attemptsRemaining === 0 && (
        <p className="text-sm text-red-600 dark:text-red-400 animate-[shake_0.4s_ease-in-out]">
          Maximum retry attempts reached. Please refresh the page or contact support.
        </p>
      )}
    </div>
  )
}
