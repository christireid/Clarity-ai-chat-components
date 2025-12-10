/**
 * Retry with Exponential Backoff Utility
 *
 * Provides configurable retry logic with exponential backoff and jitter
 * for AI API calls. Respects rate limit headers when available.
 *
 * @example
 * ```ts
 * const result = await retryWithBackoff(
 *   () => fetch('/api/openai/chat'),
 *   {
 *     maxRetries: 3,
 *     baseDelay: 1000,
 *     shouldRetry: (error) => error.status === 429,
 *   }
 * )
 * ```
 */

import { calculateRetryDelay, type RateLimitInfo } from './rate-limit-headers'

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Base delay in ms for exponential backoff (default: 1000) */
  baseDelay?: number
  /** Maximum delay in ms (default: 30000) */
  maxDelay?: number
  /** Jitter factor (0-1) to randomize delays (default: 0.5) */
  jitter?: number
  /** Function to determine if error is retryable */
  shouldRetry?: (error: Error, attempt: number) => boolean
  /** Callback when retry attempt starts */
  onRetry?: (attempt: number, delay: number, error: Error) => void
  /** AbortSignal to cancel retries */
  signal?: AbortSignal
  /** Extract rate limit info from error for intelligent retry timing */
  getRateLimitInfo?: (error: Error) => RateLimitInfo | undefined
}

export interface RetryResult<T> {
  /** Successful result */
  result: T
  /** Number of attempts made */
  attempts: number
  /** Total time spent including retries */
  totalTime: number
}

interface RetryableError extends Error {
  rateLimitInfo?: RateLimitInfo
  status?: number
  statusCode?: number
}

/**
 * Default function to determine if an error is retryable
 */
function defaultShouldRetry(error: RetryableError, attempt: number): boolean {
  // Don't retry user cancellations
  if (error.name === 'AbortError') return false

  // Don't retry validation errors
  if (error.message.toLowerCase().includes('invalid')) return false
  if (error.message.toLowerCase().includes('validation')) return false
  if (error.message.toLowerCase().includes('unauthorized')) return false
  if (error.message.toLowerCase().includes('forbidden')) return false

  // Retry rate limits
  if (error.status === 429 || error.statusCode === 429) return true
  if (error.message.includes('rate limit')) return true
  if (error.message.includes('too many requests')) return true

  // Retry server errors
  const status = error.status ?? error.statusCode
  if (status && status >= 500 && status < 600) return true
  if (error.message.includes('server error')) return true
  if (error.message.includes('temporarily unavailable')) return true

  // Retry network errors
  if (error.message.includes('network')) return true
  if (error.message.includes('ECONNRESET')) return true
  if (error.message.includes('ETIMEDOUT')) return true
  if (error.message.includes('socket hang up')) return true

  // Retry timeout errors
  if (error.name === 'TimeoutError') return true
  if (error.message.includes('timeout')) return true

  return false
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateBackoffDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  jitter: number,
  rateLimitInfo?: RateLimitInfo
): number {
  // If we have rate limit info, prefer that
  if (rateLimitInfo) {
    const rateLimitDelay = calculateRetryDelay(rateLimitInfo, baseDelay)
    if (rateLimitDelay > 0) {
      // Add small jitter to rate limit delay
      const jitterAmount = rateLimitDelay * jitter * Math.random()
      return Math.min(rateLimitDelay + jitterAmount, maxDelay)
    }
  }

  // Calculate exponential backoff
  const exponentialDelay = baseDelay * Math.pow(2, attempt)

  // Add jitter: random between (1 - jitter) and (1 + jitter) of the delay
  const jitterMultiplier = 1 - jitter + Math.random() * jitter * 2
  const jitteredDelay = exponentialDelay * jitterMultiplier

  return Math.min(jitteredDelay, maxDelay)
}

/**
 * Sleep for specified duration, respecting abort signal
 */
async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const timeout = setTimeout(resolve, ms)

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timeout)
        reject(new DOMException('Aborted', 'AbortError'))
      },
      { once: true }
    )
  })
}

/**
 * Execute a function with retry logic and exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    jitter = 0.5,
    shouldRetry = defaultShouldRetry,
    onRetry,
    signal,
    getRateLimitInfo,
  } = options

  const startTime = Date.now()
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Check for abort
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError')
    }

    try {
      const result = await fn()
      return {
        result,
        attempts: attempt + 1,
        totalTime: Date.now() - startTime,
      }
    } catch (error) {
      lastError = error as Error

      // Check if we should retry
      if (attempt >= maxRetries || !shouldRetry(lastError, attempt)) {
        throw lastError
      }

      // Get rate limit info if available
      const rateLimitInfo =
        getRateLimitInfo?.(lastError) ??
        (lastError as RetryableError).rateLimitInfo

      // Calculate delay
      const delay = calculateBackoffDelay(
        attempt,
        baseDelay,
        maxDelay,
        jitter,
        rateLimitInfo
      )

      // Notify callback
      onRetry?.(attempt + 1, delay, lastError)

      // Wait before retrying
      await sleep(delay, signal)
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError ?? new Error('Retry failed')
}

/**
 * Create a retry wrapper for a function
 *
 * @example
 * ```ts
 * const retryableFetch = createRetryWrapper(
 *   (url: string) => fetch(url),
 *   { maxRetries: 3 }
 * )
 *
 * const response = await retryableFetch('/api/chat')
 * ```
 */
export function createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): (...args: Parameters<T>) => Promise<RetryResult<Awaited<ReturnType<T>>>> {
  return (...args: Parameters<T>) =>
    retryWithBackoff(() => fn(...args), options)
}

/**
 * Preset retry options for AI API calls
 */
export const AI_API_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 60000, // 1 minute max for rate limits
  jitter: 0.5,
  shouldRetry: defaultShouldRetry,
  getRateLimitInfo: (error: Error) => {
    return (error as RetryableError).rateLimitInfo
  },
}

/**
 * Preset retry options for streaming calls (shorter timeouts)
 */
export const STREAMING_RETRY_OPTIONS: RetryOptions = {
  ...AI_API_RETRY_OPTIONS,
  maxRetries: 2, // Fewer retries for streaming
  maxDelay: 30000, // 30s max
}
