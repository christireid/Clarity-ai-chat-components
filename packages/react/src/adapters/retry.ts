/**
 * Retry Logic for Model Adapters
 *
 * Implements intelligent retry behavior with:
 * - Exponential backoff with jitter
 * - Configurable retry attempts and delays
 * - Automatic retry decision based on error types
 * - Rate limit awareness
 * - AbortSignal support
 *
 * @deprecated Prefer `retryWithBackoff` from `../../utils/resilience/retry-with-backoff`
 * which provides the same functionality plus rate-limit header parsing and
 * pre-configured presets for AI APIs (`AI_API_RETRY_OPTIONS`, `STREAMING_RETRY_OPTIONS`).
 * This module is kept for backwards compatibility with existing adapter code.
 */

import {
  isRetryableError,
  getErrorRetryDelay,
  type AdapterError,
} from './errors'

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number

  /** Initial delay in milliseconds (default: 1000) */
  initialDelayMs?: number

  /** Maximum delay in milliseconds (default: 32000) */
  maxDelayMs?: number

  /** Backoff multiplier (default: 2 for exponential) */
  backoffMultiplier?: number

  /** Add jitter to delays (±20%) (default: true) */
  jitter?: boolean

  /** Custom function to determine if error is retryable */
  shouldRetry?: (error: AdapterError, attempt: number) => boolean

  /** Custom function to calculate retry delay */
  getDelay?: (error: AdapterError, attempt: number) => number

  /** Callback called before each retry */
  onRetry?: (error: AdapterError, attempt: number, delayMs: number) => void
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 32000,
  backoffMultiplier: 2,
  jitter: true,
  shouldRetry: (error: AdapterError) => error.isRetryable,
  getDelay: (error: AdapterError, attempt: number) =>
    error.getRetryDelay(attempt),
  onRetry: () => {
    /* no-op */
  },
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Aborted'))
      return
    }

    const timeout = setTimeout(resolve, ms)

    const abortHandler = () => {
      clearTimeout(timeout)
      reject(new Error('Aborted'))
    }

    signal?.addEventListener('abort', abortHandler, { once: true })
  })
}

/**
 * Calculate retry delay with exponential backoff and jitter
 */
export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = {}
): number {
  const {
    initialDelayMs = DEFAULT_RETRY_CONFIG.initialDelayMs,
    maxDelayMs = DEFAULT_RETRY_CONFIG.maxDelayMs,
    backoffMultiplier = DEFAULT_RETRY_CONFIG.backoffMultiplier,
    jitter = DEFAULT_RETRY_CONFIG.jitter,
  } = config

  // Exponential backoff
  const exponentialDelay = Math.min(
    initialDelayMs * Math.pow(backoffMultiplier, attempt - 1),
    maxDelayMs
  )

  // Add jitter (±20%)
  if (jitter) {
    const jitterAmount = exponentialDelay * 0.2 * (Math.random() * 2 - 1)
    return Math.round(exponentialDelay + jitterAmount)
  }

  return exponentialDelay
}

/**
 * Retry context passed to operations
 */
export interface RetryContext {
  /** Current attempt number (1-indexed) */
  attempt: number
  /** Total number of attempts that will be made */
  maxAttempts: number
  /** Whether this is the last attempt */
  isLastAttempt: boolean
}

/**
 * Execute an async operation with retry logic
 *
 * @example
 * ```ts
 * const result = await withRetry(
 *   async (ctx) => {
 *     console.log(`Attempt ${ctx.attempt}/${ctx.maxAttempts}`)
 *     return await fetchData()
 *   },
 *   {
 *     maxRetries: 3,
 *     onRetry: (error, attempt, delay) => {
 *       console.log(`Retrying after ${delay}ms due to:`, error.message)
 *     }
 *   },
 *   abortSignal
 * )
 * ```
 */
export async function withRetry<T>(
  operation: (context: RetryContext) => Promise<T>,
  config: RetryConfig = {},
  signal?: AbortSignal
): Promise<T> {
  const {
    maxRetries = DEFAULT_RETRY_CONFIG.maxRetries,
    shouldRetry = DEFAULT_RETRY_CONFIG.shouldRetry,
    getDelay = DEFAULT_RETRY_CONFIG.getDelay,
    onRetry = DEFAULT_RETRY_CONFIG.onRetry,
  } = config

  const maxAttempts = maxRetries + 1
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Check if aborted before attempting
    if (signal?.aborted) {
      throw new Error('Request aborted')
    }

    const context: RetryContext = {
      attempt,
      maxAttempts,
      isLastAttempt: attempt === maxAttempts,
    }

    try {
      return await operation(context)
    } catch (error) {
      lastError = error as Error

      // Don't retry on last attempt
      if (context.isLastAttempt) {
        throw error
      }

      // Check if error is retryable
      if (!isRetryableError(error) || !shouldRetry(error as AdapterError, attempt)) {
        throw error
      }

      // Calculate delay
      const delayMs =
        getDelay(error as AdapterError, attempt) ||
        calculateRetryDelay(attempt, config)

      // Call retry callback
      onRetry(error as AdapterError, attempt, delayMs)

      // Wait before retrying (throws if aborted during sleep)
      await sleep(delayMs, signal)
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Retry failed')
}

/**
 * Wrap a function with retry logic
 *
 * @example
 * ```ts
 * const fetchWithRetry = withRetryWrapper(
 *   async (url: string) => {
 *     const response = await fetch(url)
 *     if (!response.ok) throw new Error('Failed')
 *     return response.json()
 *   },
 *   { maxRetries: 3 }
 * )
 *
 * const data = await fetchWithRetry('https://api.example.com/data')
 * ```
 */
export function withRetryWrapper<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  config: RetryConfig = {}
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs) => {
    return withRetry(
      async () => fn(...args),
      config
    )
  }
}

/**
 * Retry statistics for monitoring
 */
export interface RetryStats {
  /** Total attempts made */
  totalAttempts: number
  /** Number of successful operations */
  successCount: number
  /** Number of failed operations */
  failureCount: number
  /** Number of retries performed */
  retryCount: number
  /** Average attempts per operation */
  averageAttempts: number
  /** Retry rate (retries / total operations) */
  retryRate: number
}

/**
 * Track retry statistics
 */
export class RetryTracker {
  private stats = {
    totalAttempts: 0,
    successCount: 0,
    failureCount: 0,
    retryCount: 0,
  }

  /**
   * Record a successful operation
   */
  recordSuccess(attempts: number): void {
    this.stats.totalAttempts += attempts
    this.stats.successCount++
    if (attempts > 1) {
      this.stats.retryCount += attempts - 1
    }
  }

  /**
   * Record a failed operation
   */
  recordFailure(attempts: number): void {
    this.stats.totalAttempts += attempts
    this.stats.failureCount++
    if (attempts > 1) {
      this.stats.retryCount += attempts - 1
    }
  }

  /**
   * Get current statistics
   */
  getStats(): RetryStats {
    const totalOperations = this.stats.successCount + this.stats.failureCount
    return {
      ...this.stats,
      averageAttempts:
        totalOperations > 0 ? this.stats.totalAttempts / totalOperations : 0,
      retryRate:
        totalOperations > 0 ? this.stats.retryCount / totalOperations : 0,
    }
  }

  /**
   * Reset statistics
   */
  reset(): void {
    this.stats = {
      totalAttempts: 0,
      successCount: 0,
      failureCount: 0,
      retryCount: 0,
    }
  }
}
