/**
 * Error recovery options
 */
export interface UseErrorRecoveryOptions<T> {
    /** The async operation to execute and retry */
    operation: (...args: any[]) => Promise<T>;
    /** Maximum retry attempts (default: 3) */
    maxAttempts?: number;
    /** Backoff delays in milliseconds (default: [1000, 3000, 10000]) */
    backoffMs?: number[];
    /** Function to determine if error is retryable (default: all errors retryable) */
    shouldRetry?: (error: Error, attempt: number) => boolean;
    /** Callback when retry starts */
    onRetryStart?: (attempt: number) => void;
    /** Callback when retry succeeds */
    onRetrySuccess?: (result: T, attempt: number) => void;
    /** Callback when retry fails */
    onRetryFail?: (error: Error, attempt: number) => void;
    /** Callback when max attempts reached */
    onMaxAttemptsReached?: (error: Error) => void;
}
/**
 * Error recovery state
 */
export interface UseErrorRecoveryReturn<T> {
    /** Execute operation with retry logic */
    execute: (...args: any[]) => Promise<T | null>;
    /** Manually retry last failed operation */
    retry: () => Promise<T | null>;
    /** Current error if any */
    error: Error | null;
    /** Whether operation is currently executing */
    isLoading: boolean;
    /** Whether operation is retrying */
    isRetrying: boolean;
    /** Current attempt number (0 = not started, 1 = first attempt, etc.) */
    attemptNumber: number;
    /** Whether can retry (haven't reached max attempts) */
    canRetry: boolean;
    /** User-friendly error message */
    errorMessage: string | null;
    /** Error type classification */
    errorType: 'network' | 'ratelimit' | 'server' | 'auth' | 'unknown' | null;
    /** Last successful result */
    data: T | null;
    /** Reset state */
    reset: () => void;
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
export declare function useErrorRecovery<T = any>(options: UseErrorRecoveryOptions<T>): UseErrorRecoveryReturn<T>;
//# sourceMappingURL=use-error-recovery.d.ts.map