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

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALIZED ERROR CLASSES WITH HELPFUL SUGGESTIONS
// These errors tell you WHAT went wrong, WHY, and HOW to fix it
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Base class for helpful errors with suggestions and docs links.
 *
 * @example
 * ```typescript
 * try {
 *   await counter.count(text)
 * } catch (error) {
 *   if (error instanceof HelpfulError) {
 *     console.log(error.suggestion) // How to fix it
 *     console.log(error.docsUrl)    // Link to documentation
 *   }
 * }
 * ```
 */
export class HelpfulError extends TokenOptimizationError {
  /** Human-readable suggestion for how to fix the error */
  readonly suggestion?: string

  /** Link to relevant documentation */
  readonly docsUrl?: string

  /** ISO timestamp when error occurred */
  readonly timestamp: string

  /** Original error that caused this error */
  override readonly cause?: Error

  constructor(options: {
    message: string
    code: TokenErrorCode
    recoverable?: boolean
    context?: Record<string, unknown>
    suggestion?: string
    docsUrl?: string
    cause?: Error
  }) {
    super(
      options.message,
      options.code,
      options.recoverable ?? ERROR_RECOVERABILITY[options.code] ?? true,
      options.context
    )
    this.suggestion = options.suggestion
    this.docsUrl = options.docsUrl
    this.cause = options.cause
    this.timestamp = new Date().toISOString()
  }

  /**
   * Format error for console output with helpful information
   */
  format(): string {
    const lines = [`❌ ${this.name} [${this.code}]`, `   ${this.message}`]

    if (this.suggestion) {
      lines.push('', `💡 Suggestion: ${this.suggestion}`)
    }

    if (this.docsUrl) {
      lines.push(`📚 Docs: ${this.docsUrl}`)
    }

    if (this.context && Object.keys(this.context).length > 0) {
      lines.push('', '📋 Context:', JSON.stringify(this.context, null, 2))
    }

    return lines.join('\n')
  }

  override toJSON(): object {
    return {
      ...super.toJSON(),
      suggestion: this.suggestion,
      docsUrl: this.docsUrl,
      timestamp: this.timestamp,
      cause: this.cause?.message,
    }
  }
}

/**
 * Thrown when an unsupported model is specified.
 *
 * @example
 * ```typescript
 * // This will throw UnsupportedModelError
 * const counter = new TokenCounter({ model: 'invalid-model' })
 *
 * // Catch and handle
 * catch (error) {
 *   if (error instanceof UnsupportedModelError) {
 *     console.log(error.supportedModels) // ['gpt-4o', 'gpt-4o-mini', ...]
 *   }
 * }
 * ```
 */
export class UnsupportedModelError extends HelpfulError {
  /** List of supported models */
  readonly supportedModels: readonly string[]

  /** The model that was requested */
  readonly requestedModel: string

  constructor(model: string, supportedModels: readonly string[]) {
    const shortList = supportedModels.slice(0, 5)
    const hasMore = supportedModels.length > 5

    super({
      message: `Model "${model}" is not supported.`,
      code: TokenErrorCode.MODEL_NOT_SUPPORTED,
      context: {
        providedModel: model,
        supportedModels: [...supportedModels],
      },
      suggestion: `Use one of the supported models: ${shortList.join(', ')}${hasMore ? `, ... (${supportedModels.length} total)` : ''}`,
      docsUrl:
        'https://github.com/clarity-chat/token-optimization#supported-models',
    })
    this.name = 'UnsupportedModelError'
    this.supportedModels = supportedModels
    this.requestedModel = model
  }
}

/**
 * Thrown when token budget is exceeded.
 *
 * @example
 * ```typescript
 * try {
 *   await sendToLLM(prompt)
 * } catch (error) {
 *   if (error instanceof TokenBudgetExceededError) {
 *     console.log(`Over by ${error.overage} tokens`)
 *     // Use compressor to fix
 *     const compressed = await compressor.compress(prompt, {
 *       targetTokens: error.availableBudget
 *     })
 *   }
 * }
 * ```
 */
export class TokenBudgetExceededError extends HelpfulError {
  /** Current token count */
  readonly currentTokens: number

  /** Maximum allowed tokens */
  readonly maxTokens: number

  /** Tokens reserved for output */
  readonly reservedTokens: number

  /** Available budget (maxTokens - reservedTokens) */
  readonly availableBudget: number

  /** How many tokens over budget */
  readonly overage: number

  constructor(options: {
    currentTokens: number
    maxTokens: number
    reservedTokens?: number
  }) {
    const { currentTokens, maxTokens, reservedTokens = 0 } = options
    const budget = maxTokens - reservedTokens
    const overage = currentTokens - budget
    const overagePercent = ((overage / budget) * 100).toFixed(1)

    super({
      message: `Token budget exceeded by ${overage.toLocaleString()} tokens (${overagePercent}% over).`,
      code: TokenErrorCode.BUDGET_EXCEEDED,
      context: {
        currentTokens,
        maxTokens,
        reservedTokens,
        availableBudget: budget,
        overage,
      },
      suggestion:
        `Try one of these solutions:\n` +
        `  1. Use PromptCompressor: await compressor.compress(text, { targetTokens: ${budget} })\n` +
        `  2. Increase maxTokens if your model supports it\n` +
        `  3. Split your content into multiple requests`,
      docsUrl: 'https://github.com/clarity-chat/token-optimization#compression',
    })
    this.name = 'TokenBudgetExceededError'
    this.currentTokens = currentTokens
    this.maxTokens = maxTokens
    this.reservedTokens = reservedTokens
    this.availableBudget = budget
    this.overage = overage
  }
}

/**
 * Thrown when input validation fails.
 *
 * @example
 * ```typescript
 * // This will throw ValidationError
 * counter.count(123) // Expected string, got number
 *
 * // The error tells you exactly what went wrong
 * // ValidationError: Invalid text: Expected string, received number
 * // Suggestion: Ensure text is of type string.
 * ```
 */
export class ValidationError extends HelpfulError {
  /** The field that failed validation */
  readonly field: string

  /** The value that was received */
  readonly receivedValue: unknown

  /** The expected type */
  readonly expectedType: string

  constructor(
    message: string,
    field: string,
    receivedValue: unknown,
    expectedType: string
  ) {
    super({
      message: `Invalid ${field}: ${message}`,
      code: TokenErrorCode.INVALID_INPUT,
      context: {
        field,
        receivedValue:
          typeof receivedValue === 'string'
            ? receivedValue.slice(0, 100)
            : receivedValue,
        receivedType: typeof receivedValue,
        expectedType,
      },
      suggestion: `Ensure ${field} is of type ${expectedType}.`,
    })
    this.name = 'ValidationError'
    this.field = field
    this.receivedValue = receivedValue
    this.expectedType = expectedType
  }
}

/**
 * Thrown when cache operations fail.
 *
 * @example
 * ```typescript
 * try {
 *   await cache.get(key)
 * } catch (error) {
 *   if (error instanceof CacheError) {
 *     console.log(error.operation) // 'get', 'set', etc.
 *     // Cache errors are usually recoverable
 *   }
 * }
 * ```
 */
export class CacheError extends HelpfulError {
  /** The cache operation that failed */
  readonly operation: 'get' | 'set' | 'delete' | 'clear'

  constructor(
    operation: 'get' | 'set' | 'delete' | 'clear',
    reason: string,
    cause?: Error
  ) {
    super({
      message: `Cache ${operation} failed: ${reason}`,
      code:
        operation === 'set'
          ? TokenErrorCode.CACHE_FULL
          : TokenErrorCode.CACHE_CORRUPTED,
      context: { operation },
      suggestion:
        operation === 'get'
          ? 'The cache miss is expected on first request. Subsequent identical requests will be cached.'
          : 'Check if the cache storage is available and not full. Try clearing the cache with cache.clear().',
      cause,
    })
    this.name = 'CacheError'
    this.operation = operation
  }
}

/**
 * Thrown when compression fails to meet target.
 *
 * @example
 * ```typescript
 * try {
 *   await compressor.compress(text, { targetTokens: 100 })
 * } catch (error) {
 *   if (error instanceof CompressionError) {
 *     console.log(`Achieved ${error.achievedTokens} tokens, wanted ${error.targetTokens}`)
 *     // Try a more aggressive strategy
 *   }
 * }
 * ```
 */
export class CompressionError extends HelpfulError {
  /** The compression strategy used */
  readonly strategy: string

  /** Original token count */
  readonly originalTokens: number

  /** Target token count */
  readonly targetTokens: number

  /** Actually achieved token count */
  readonly achievedTokens: number

  /** Compression ratio achieved */
  readonly compressionRatio: number

  constructor(options: {
    strategy: string
    originalTokens: number
    targetTokens: number
    achievedTokens: number
  }) {
    const { strategy, originalTokens, targetTokens, achievedTokens } = options
    const compressionRatio = originalTokens / achievedTokens

    super({
      message: `Compression with "${strategy}" strategy achieved ${achievedTokens} tokens, but target was ${targetTokens}.`,
      code: TokenErrorCode.COMPRESSION_FAILED,
      context: {
        strategy,
        originalTokens,
        targetTokens,
        achievedTokens,
        compressionRatio: compressionRatio.toFixed(2),
      },
      suggestion:
        achievedTokens > targetTokens
          ? `Try a more aggressive strategy like "summarization" or reduce preserveStart/preserveEnd values.`
          : `Compression succeeded but was more aggressive than needed. Consider using "truncation" for faster processing.`,
      docsUrl:
        'https://github.com/clarity-chat/token-optimization#compression-strategies',
    })
    this.name = 'CompressionError'
    this.strategy = strategy
    this.originalTokens = originalTokens
    this.targetTokens = targetTokens
    this.achievedTokens = achievedTokens
    this.compressionRatio = compressionRatio
  }
}

/**
 * Thrown when quality threshold is not met after compression.
 *
 * @example
 * ```typescript
 * try {
 *   await compressor.compress(text, { minQuality: 0.95 })
 * } catch (error) {
 *   if (error instanceof QualityThresholdError) {
 *     console.log(`Quality ${error.achievedQuality}, needed ${error.requiredQuality}`)
 *     // Lower the quality threshold or use less aggressive compression
 *   }
 * }
 * ```
 */
export class QualityThresholdError extends HelpfulError {
  /** Required quality threshold (0-1) */
  readonly requiredQuality: number

  /** Actually achieved quality (0-1) */
  readonly achievedQuality: number

  constructor(requiredQuality: number, achievedQuality: number) {
    super({
      message: `Compression quality ${(achievedQuality * 100).toFixed(1)}% is below the required ${(requiredQuality * 100).toFixed(1)}% threshold.`,
      code: TokenErrorCode.QUALITY_THRESHOLD_NOT_MET,
      context: {
        requiredQuality,
        achievedQuality,
        gap: requiredQuality - achievedQuality,
      },
      suggestion:
        `Options to resolve:\n` +
        `  1. Lower the quality threshold: { minQuality: ${Math.max(0.7, achievedQuality - 0.05).toFixed(2)} }\n` +
        `  2. Use a less aggressive compression strategy: { strategy: 'extractive' }\n` +
        `  3. Preserve more context: { preserveStart: 100, preserveEnd: 100 }`,
      docsUrl:
        'https://github.com/clarity-chat/token-optimization#quality-settings',
    })
    this.name = 'QualityThresholdError'
    this.requiredQuality = requiredQuality
    this.achievedQuality = achievedQuality
  }
}

/**
 * Thrown when a security violation is detected.
 *
 * @example
 * ```typescript
 * try {
 *   await security.sanitize(userInput)
 * } catch (error) {
 *   if (error instanceof SecurityViolationError) {
 *     console.log(`Threat type: ${error.threatType}`)
 *     console.log(`Severity: ${error.severity}`)
 *     // Log and reject the input
 *   }
 * }
 * ```
 */
export class SecurityViolationError extends HelpfulError {
  /** Type of security threat detected */
  readonly threatType: string

  /** Severity level */
  readonly severity: 'low' | 'medium' | 'high'

  constructor(
    threatType: string,
    severity: 'low' | 'medium' | 'high',
    details?: string
  ) {
    super({
      message: `Security violation detected: ${threatType}${details ? ` - ${details}` : ''}`,
      code: TokenErrorCode.SECURITY_VIOLATION,
      recoverable: false,
      context: {
        threatType,
        severity,
      },
      suggestion:
        'Review and sanitize the input. Enable PII redaction if handling sensitive data.',
      docsUrl: 'https://github.com/clarity-chat/token-optimization#security',
    })
    this.name = 'SecurityViolationError'
    this.threatType = threatType
    this.severity = severity
  }
}

/**
 * Factory function to create appropriate error based on error code.
 *
 * @example
 * ```typescript
 * throw createError(TokenErrorCode.BUDGET_EXCEEDED, {
 *   currentTokens: 5000,
 *   maxTokens: 4096
 * })
 * ```
 */
export function createError(
  code: TokenErrorCode,
  context?: Record<string, unknown>
): TokenOptimizationError {
  switch (code) {
    case TokenErrorCode.MODEL_NOT_SUPPORTED:
      return new UnsupportedModelError(
        (context?.model as string) || 'unknown',
        (context?.supportedModels as string[]) || []
      )

    case TokenErrorCode.BUDGET_EXCEEDED:
      return new TokenBudgetExceededError({
        currentTokens: (context?.currentTokens as number) || 0,
        maxTokens: (context?.maxTokens as number) || 0,
        reservedTokens: context?.reservedTokens as number | undefined,
      })

    case TokenErrorCode.INVALID_INPUT:
      return new ValidationError(
        (context?.message as string) || 'Invalid input',
        (context?.field as string) || 'input',
        context?.value,
        (context?.expectedType as string) || 'unknown'
      )

    case TokenErrorCode.COMPRESSION_FAILED:
      return new CompressionError({
        strategy: (context?.strategy as string) || 'auto',
        originalTokens: (context?.originalTokens as number) || 0,
        targetTokens: (context?.targetTokens as number) || 0,
        achievedTokens: (context?.achievedTokens as number) || 0,
      })

    case TokenErrorCode.QUALITY_THRESHOLD_NOT_MET:
      return new QualityThresholdError(
        (context?.requiredQuality as number) || 0.85,
        (context?.achievedQuality as number) || 0
      )

    case TokenErrorCode.SECURITY_VIOLATION:
      return new SecurityViolationError(
        (context?.threatType as string) || 'unknown',
        (context?.severity as 'low' | 'medium' | 'high') || 'high'
      )

    default:
      return new TokenOptimizationError(
        (context?.message as string) || `Error: ${code}`,
        code,
        undefined,
        context
      )
  }
}
