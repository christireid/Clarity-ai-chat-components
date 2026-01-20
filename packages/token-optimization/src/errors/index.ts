/**
 * Error Handling System for Token Optimization
 *
 * Provides a comprehensive error handling framework with:
 * - Typed error codes for all token optimization scenarios
 * - Error classification (recoverable vs non-recoverable)
 * - Retry utilities with exponential backoff
 * - Error context preservation for debugging
 *
 * @module errors
 * @version 1.0.0
 */

/**
 * Error codes for all token optimization error scenarios
 */
export enum TokenErrorCode {
  // Model errors
  /** The specified model is not supported by the tokenizer */
  MODEL_NOT_SUPPORTED = 'MODEL_NOT_SUPPORTED',
  /** Token count exceeds the model's context limit */
  MODEL_LIMIT_EXCEEDED = 'MODEL_LIMIT_EXCEEDED',

  // Compression errors
  /** Compression operation failed */
  COMPRESSION_FAILED = 'COMPRESSION_FAILED',
  /** Compressed output does not meet quality threshold */
  QUALITY_THRESHOLD_NOT_MET = 'QUALITY_THRESHOLD_NOT_MET',

  // Cache errors
  /** Cache data is corrupted or invalid */
  CACHE_CORRUPTED = 'CACHE_CORRUPTED',
  /** Cache has reached its maximum capacity */
  CACHE_FULL = 'CACHE_FULL',

  // Budget errors
  /** Token or cost budget has been exceeded */
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  /** Rate limit for API calls has been exceeded */
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Security errors
  /** A security policy violation was detected */
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
  /** Personally identifiable information was detected */
  PII_DETECTED = 'PII_DETECTED',
  /** Potential injection attack was detected */
  INJECTION_DETECTED = 'INJECTION_DETECTED',

  // Parse errors
  /** Failed to parse TOON format */
  TOON_PARSE_ERROR = 'TOON_PARSE_ERROR',
  /** Input validation failed */
  INVALID_INPUT = 'INVALID_INPUT',

  // Network errors
  /** Network request failed */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** Operation timed out */
  TIMEOUT = 'TIMEOUT',

  // Unknown
  /** An unknown error occurred */
  UNKNOWN = 'UNKNOWN',
}

/**
 * Map of error codes to their default recoverability status
 */
const ERROR_RECOVERABILITY: Record<TokenErrorCode, boolean> = {
  [TokenErrorCode.MODEL_NOT_SUPPORTED]: false,
  [TokenErrorCode.MODEL_LIMIT_EXCEEDED]: true,
  [TokenErrorCode.COMPRESSION_FAILED]: true,
  [TokenErrorCode.QUALITY_THRESHOLD_NOT_MET]: true,
  [TokenErrorCode.CACHE_CORRUPTED]: true,
  [TokenErrorCode.CACHE_FULL]: true,
  [TokenErrorCode.BUDGET_EXCEEDED]: false,
  [TokenErrorCode.RATE_LIMIT_EXCEEDED]: true,
  [TokenErrorCode.SECURITY_VIOLATION]: false,
  [TokenErrorCode.PII_DETECTED]: true,
  [TokenErrorCode.INJECTION_DETECTED]: false,
  [TokenErrorCode.TOON_PARSE_ERROR]: false,
  [TokenErrorCode.INVALID_INPUT]: false,
  [TokenErrorCode.NETWORK_ERROR]: true,
  [TokenErrorCode.TIMEOUT]: true,
  [TokenErrorCode.UNKNOWN]: true,
}

/**
 * Base error class for all token optimization errors
 *
 * Provides structured error information including:
 * - Error code for programmatic handling
 * - Recoverability flag for retry decisions
 * - Optional context for debugging
 *
 * @example
 * ```typescript
 * throw new TokenOptimizationError(
 *   'Model context limit exceeded',
 *   TokenErrorCode.MODEL_LIMIT_EXCEEDED,
 *   true,
 *   { tokenCount: 150000, limit: 128000 }
 * )
 * ```
 */
export class TokenOptimizationError extends Error {
  /**
   * Creates a new TokenOptimizationError
   *
   * @param message - Human-readable error message
   * @param code - Error code from TokenErrorCode enum
   * @param recoverable - Whether the error is recoverable (defaults based on error code)
   * @param context - Optional additional context for debugging
   */
  constructor(
    message: string,
    public readonly code: TokenErrorCode,
    public readonly recoverable: boolean = ERROR_RECOVERABILITY[code] ?? true,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'TokenOptimizationError'

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TokenOptimizationError)
    }
  }

  /**
   * Serializes the error to a JSON-compatible object
   *
   * @returns Object representation of the error
   */
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      recoverable: this.recoverable,
      context: this.context,
      stack: this.stack,
    }
  }

  /**
   * Creates a TokenOptimizationError from an unknown error
   *
   * Useful for wrapping caught exceptions in a consistent error type
   *
   * @param error - The original error (can be any type)
   * @param code - Optional error code (defaults to UNKNOWN)
   * @returns A new TokenOptimizationError
   *
   * @example
   * ```typescript
   * try {
   *   await someOperation()
   * } catch (error) {
   *   throw TokenOptimizationError.fromError(error, TokenErrorCode.COMPRESSION_FAILED)
   * }
   * ```
   */
  static fromError(
    error: unknown,
    code: TokenErrorCode = TokenErrorCode.UNKNOWN
  ): TokenOptimizationError {
    // If it's already a TokenOptimizationError, return it
    if (error instanceof TokenOptimizationError) {
      return error
    }

    // Extract message from various error types
    let message: string
    let context: Record<string, unknown> | undefined

    if (error instanceof Error) {
      message = error.message
      context = {
        originalName: error.name,
        originalStack: error.stack,
      }
    } else if (typeof error === 'string') {
      message = error
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = String((error as { message: unknown }).message)
      context = { originalError: error }
    } else {
      message = 'An unknown error occurred'
      context = { originalError: error }
    }

    return new TokenOptimizationError(message, code, undefined, context)
  }
}

/**
 * Checks if an error is recoverable
 *
 * Works with both TokenOptimizationError and standard Error objects
 *
 * @param error - The error to check
 * @returns true if the error is recoverable, false otherwise
 *
 * @example
 * ```typescript
 * try {
 *   await compressText(text)
 * } catch (error) {
 *   if (isRecoverable(error)) {
 *     // Retry the operation
 *   } else {
 *     // Handle fatal error
 *   }
 * }
 * ```
 */
export function isRecoverable(error: unknown): boolean {
  if (error instanceof TokenOptimizationError) {
    return error.recoverable
  }

  // For network errors, assume recoverable
  if (error instanceof Error) {
    const networkErrorPatterns = [
      'ECONNRESET',
      'ETIMEDOUT',
      'ECONNREFUSED',
      'fetch failed',
      'network',
      'timeout',
    ]
    const errorString = `${error.name} ${error.message}`.toLowerCase()
    return networkErrorPatterns.some((pattern) =>
      errorString.includes(pattern.toLowerCase())
    )
  }

  // Default to recoverable for unknown errors
  return true
}

/**
 * Options for the retry helper
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Initial backoff delay in milliseconds (default: 1000) */
  backoffMs?: number
  /** Whether to use exponential backoff (default: true) */
  exponential?: boolean
  /** Maximum backoff delay in milliseconds (default: 30000) */
  maxBackoffMs?: number
  /** Custom function to determine if an error should be retried */
  shouldRetry?: (error: unknown) => boolean
  /** Callback invoked before each retry attempt */
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void
}

/**
 * Default retry options
 */
const DEFAULT_RETRY_OPTIONS: Required<
  Omit<RetryOptions, 'shouldRetry' | 'onRetry'>
> = {
  maxRetries: 3,
  backoffMs: 1000,
  exponential: true,
  maxBackoffMs: 30000,
}

/**
 * Executes an operation with automatic retry and exponential backoff
 *
 * @param operation - Async function to execute
 * @param options - Retry configuration options
 * @returns The result of the operation
 * @throws The last error if all retries fail
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => fetchTokenCount(text),
 *   {
 *     maxRetries: 5,
 *     backoffMs: 500,
 *     shouldRetry: (error) => error instanceof NetworkError,
 *     onRetry: (error, attempt) => console.log(`Retry ${attempt}`)
 *   }
 * )
 * ```
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const config = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  }

  const shouldRetryFn = config.shouldRetry ?? isRecoverable

  let lastError: unknown
  let attempt = 0

  while (attempt <= config.maxRetries) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      attempt++

      // Check if we should retry
      if (attempt > config.maxRetries || !shouldRetryFn(error)) {
        break
      }

      // Calculate backoff delay
      let delay = config.backoffMs
      if (config.exponential) {
        delay = Math.min(
          config.backoffMs * Math.pow(2, attempt - 1),
          config.maxBackoffMs
        )
      }

      // Add jitter (10% random variation) to prevent thundering herd
      const jitter = delay * 0.1 * (Math.random() - 0.5)
      delay = Math.round(delay + jitter)

      // Call onRetry callback if provided
      if (config.onRetry) {
        config.onRetry(error, attempt, delay)
      }

      // Wait before retrying
      await sleep(delay)
    }
  }

  // Wrap the last error in TokenOptimizationError if it isn't already
  throw TokenOptimizationError.fromError(lastError)
}

/**
 * Sleep utility function
 * @param ms - Duration to sleep in milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Creates a timeout wrapper for async operations
 *
 * @param operation - Async function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @returns The result of the operation
 * @throws TokenOptimizationError with TIMEOUT code if operation times out
 *
 * @example
 * ```typescript
 * const result = await withTimeout(
 *   () => expensiveCompression(text),
 *   5000
 * )
 * ```
 */
export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(
        new TokenOptimizationError(
          `Operation timed out after ${timeoutMs}ms`,
          TokenErrorCode.TIMEOUT,
          true,
          { timeoutMs }
        )
      )
    }, timeoutMs)

    // Unref the timer so it doesn't prevent Node.js from exiting
    if (typeof timer === 'object' && 'unref' in timer) {
      timer.unref()
    }
  })

  return Promise.race([operation(), timeoutPromise])
}

/**
 * Wraps an operation to catch and transform errors
 *
 * @param operation - Async function to execute
 * @param errorCode - Error code to use if operation fails
 * @param contextFn - Optional function to generate additional context
 * @returns The result of the operation
 *
 * @example
 * ```typescript
 * const result = await wrapError(
 *   () => parseJSON(input),
 *   TokenErrorCode.TOON_PARSE_ERROR,
 *   () => ({ input: input.substring(0, 100) })
 * )
 * ```
 */
export async function wrapError<T>(
  operation: () => Promise<T>,
  errorCode: TokenErrorCode,
  contextFn?: () => Record<string, unknown>
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const context = contextFn ? contextFn() : undefined
    if (error instanceof TokenOptimizationError) {
      // Preserve original error but add context
      throw new TokenOptimizationError(
        error.message,
        error.code,
        error.recoverable,
        { ...error.context, ...context }
      )
    }
    throw TokenOptimizationError.fromError(error, errorCode)
  }
}
