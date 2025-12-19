import { TokenCounter } from '@clarity-chat/token-optimization'
import { smartCountTokens } from './smart-fallback'

export interface TokenCounterError extends Error {
  code: string
  context: ErrorContext
  recoverable: boolean
  fallbackUsed: boolean
}

export interface ErrorContext {
  input: unknown
  options?: Record<string, unknown>
  timestamp: number
  stack?: string
  metadata?: Record<string, unknown>
}

export interface ErrorHandlingOptions {
  fallbackToSmart?: boolean
  fallbackToCharacter?: boolean
  maxRetries?: number
  retryDelay?: number
  logErrors?: boolean
  throwOnError?: boolean
  timeout?: number
  model?: string
}

/**
 * Robust error handling for token counting operations
 */
export class RobustTokenCounter {
  private errorLog: TokenCounterError[] = []
  private maxLogSize = 100
  private defaultOptions: Required<ErrorHandlingOptions> = {
    fallbackToSmart: true,
    fallbackToCharacter: true,
    maxRetries: 3,
    retryDelay: 100,
    logErrors: true,
    throwOnError: false,
    timeout: 5000,
    model: 'gpt-4',
  }

  /**
   * Count tokens with comprehensive error handling
   */
  public async countTokensWithFallback(
    text: string,
    options: ErrorHandlingOptions = {}
  ): Promise<{ count: number; strategy: string; error?: TokenCounterError }> {
    const mergedOptions = { ...this.defaultOptions, ...options }
    const startTime = Date.now()

    try {
      // Validate input first
      const validation = this.validateInput(text)
      if (!validation.valid && validation.reason) {
        return this.handleInvalidInput(
          { valid: false, reason: validation.reason },
          mergedOptions
        )
      }

      // Attempt primary counting with timeout
      const result = await this.countWithTimeout(text, mergedOptions)
      const strategy = 'primary'

      return {
        count: result,
        strategy,
        error: undefined,
      }
    } catch (error) {
      return this.handleError(error, text, mergedOptions, startTime)
    }
  }

  /**
   * Count tokens with timeout protection
   */
  private async countWithTimeout(
    text: string,
    options: Required<ErrorHandlingOptions>
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Token counting timeout'))
      }, options.timeout)

      try {
        const count = TokenCounter.count(text)
        clearTimeout(timeoutId)

        if (this.isValidCount(count, text)) {
          resolve(count)
        } else {
          reject(new Error('Invalid token count from primary method'))
        }
      } catch (error) {
        clearTimeout(timeoutId)
        reject(error)
      }
    })
  }

  /**
   * Validate input text
   */
  private validateInput(text: unknown): {
    valid: boolean
    reason?: string
    sanitized?: string
  } {
    // Handle null/undefined
    if (text === null || text === undefined) {
      return { valid: true, sanitized: '' }
    }

    // Handle non-string types
    if (typeof text !== 'string') {
      try {
        const stringified = String(text)
        return { valid: true, sanitized: stringified }
      } catch {
        return { valid: false, reason: 'Cannot convert input to string' }
      }
    }

    // Handle empty string
    if (text.length === 0) {
      return { valid: true, sanitized: text }
    }

    // Handle extremely long text (potential memory issues)
    if (text.length > 10000000) {
      // 10MB of text
      return { valid: false, reason: 'Text too long (exceeds 10MB)' }
    }

    // Handle potentially problematic Unicode
    try {
      // Test if text can be processed
      const testBuffer = Buffer.from(text, 'utf8')
      if (testBuffer.length > 50000000) {
        // 50MB buffer
        return { valid: false, reason: 'Text produces buffer too large' }
      }
    } catch {
      return { valid: false, reason: 'Text contains invalid UTF-8 sequences' }
    }

    return { valid: true, sanitized: text }
  }

  /**
   * Handle invalid input
   */
  private handleInvalidInput(
    validation: { valid: false; reason: string },
    options: Required<ErrorHandlingOptions>
  ): Promise<{ count: number; strategy: string; error?: TokenCounterError }> {
    const error = this.createError(
      'INVALID_INPUT',
      `Invalid input: ${validation.reason}`,
      { input: validation, options }
    )

    if (options.throwOnError) {
      return Promise.reject(error)
    }

    return Promise.resolve({
      count: 0,
      strategy: 'error-fallback',
      error,
    })
  }

  /**
   * Handle various types of errors
   */
  private handleError(
    error: unknown,
    text: string,
    options: Required<ErrorHandlingOptions>,
    startTime: number
  ): Promise<{ count: number; strategy: string; error?: TokenCounterError }> {
    const tokenError = this.createErrorFromAny(error, text, options)

    if (options.logErrors) {
      this.logError(tokenError)
    }

    // Try retry logic for transient errors
    if (this.isRetryableError(tokenError) && options.maxRetries > 0) {
      return this.retryCount(text, options, tokenError)
    }

    // Try fallback strategies
    const fallbackResult = this.tryFallbackStrategies(text, options, tokenError)
    if (fallbackResult) {
      return Promise.resolve(fallbackResult)
    }

    // Last resort: return error or throw
    if (options.throwOnError) {
      return Promise.reject(tokenError)
    }

    return Promise.resolve({
      count: 0,
      strategy: 'error',
      error: tokenError,
    })
  }

  /**
   * Retry counting with exponential backoff
   */
  private async retryCount(
    text: string,
    options: Required<ErrorHandlingOptions>,
    originalError: TokenCounterError
  ): Promise<{ count: number; strategy: string; error?: TokenCounterError }> {
    for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
      try {
        await new Promise((resolve) =>
          setTimeout(resolve, options.retryDelay * Math.pow(2, attempt - 1))
        )

        const count = await this.countWithTimeout(text, options)
        return {
          count,
          strategy: `retry-${attempt}`,
          error: undefined,
        }
      } catch (retryError) {
        if (attempt === options.maxRetries) {
          const finalError = this.createErrorFromAny(
            retryError,
            text,
            options,
            'MAX_RETRIES_EXCEEDED'
          )

          if (options.throwOnError) {
            throw finalError
          }

          return {
            count: 0,
            strategy: 'retry-failed',
            error: finalError,
          }
        }
      }
    }

    throw new Error('Retry logic failed unexpectedly')
  }

  /**
   * Try fallback strategies
   */
  private tryFallbackStrategies(
    text: string,
    options: Required<ErrorHandlingOptions>,
    error: TokenCounterError
  ): { count: number; strategy: string; error?: TokenCounterError } | null {
    // Try smart fallback
    if (options.fallbackToSmart) {
      try {
        const smartCount = smartCountTokens(text, { model: options.model })
        return {
          count: smartCount,
          strategy: 'smart-fallback',
          error: { ...error, fallbackUsed: true },
        }
      } catch (smartError) {
        // Continue to next fallback
      }
    }

    // Try character-based fallback
    if (options.fallbackToCharacter) {
      try {
        const charCount = this.characterBasedFallback(text, options.model)
        return {
          count: charCount,
          strategy: 'character-fallback',
          error: { ...error, fallbackUsed: true },
        }
      } catch (charError) {
        // Continue to next fallback
      }
    }

    return null
  }

  /**
   * Character-based fallback estimation
   */
  private characterBasedFallback(text: string, model?: string): number {
    const modelRatios: Record<string, number> = {
      'gpt-4': 4.0,
      'gpt-3.5-turbo': 4.0,
      'claude-3-opus': 3.8,
      'claude-3-sonnet': 3.8,
      'gemini-pro': 4.0,
      'deepseek-chat': 4.0,
      'llama-2-70b': 3.5,
    }

    const ratio = model ? modelRatios[model] || 4.0 : 4.0
    return Math.ceil(text.length / ratio)
  }

  /**
   * Validate token count
   */
  private isValidCount(count: number, text: string): boolean {
    if (typeof count !== 'number' || isNaN(count)) return false
    if (count < 0) return false
    if (count > text.length * 2) return false // Sanity check
    return true
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: TokenCounterError): boolean {
    const retryableCodes = [
      'TIMEOUT',
      'NETWORK_ERROR',
      'SERVICE_UNAVAILABLE',
      'RATE_LIMITED',
    ]

    return retryableCodes.includes(error.code) && error.recoverable
  }

  /**
   * Create error from any thrown value
   */
  private createErrorFromAny(
    error: unknown,
    text: string,
    options: Record<string, unknown>,
    code?: string
  ): TokenCounterError {
    if (this.isTokenCounterError(error)) {
      return error
    }

    const errorCode = code || this.inferErrorCode(error)
    const message =
      error instanceof Error ? error.message : String(error) || 'Unknown error'

    return this.createError(errorCode, message, {
      text,
      options,
      originalError: error,
    })
  }

  /**
   * Create structured error
   */
  private createError(
    code: string,
    message: string,
    context: Record<string, unknown>
  ): TokenCounterError {
    const error = new Error(message) as TokenCounterError
    error.code = code
    error.context = {
      input: context.text || context.input,
      options: context.options as Record<string, unknown> | undefined,
      timestamp: Date.now(),
      stack: new Error().stack,
      metadata: context,
    }
    error.recoverable = this.isRecoverable(code)
    error.fallbackUsed = false
    error.name = 'TokenCounterError'

    return error
  }

  /**
   * Infer error code from error
   */
  private inferErrorCode(error: unknown): string {
    const errorString = String(error).toLowerCase()

    if (errorString.includes('timeout')) return 'TIMEOUT'
    if (errorString.includes('network')) return 'NETWORK_ERROR'
    if (errorString.includes('memory')) return 'OUT_OF_MEMORY'
    if (errorString.includes('invalid')) return 'INVALID_INPUT'
    if (errorString.includes('rate limit')) return 'RATE_LIMITED'
    if (errorString.includes('service unavailable'))
      return 'SERVICE_UNAVAILABLE'

    return 'UNKNOWN_ERROR'
  }

  /**
   * Check if error code is recoverable
   */
  private isRecoverable(code: string): boolean {
    const recoverableCodes = [
      'TIMEOUT',
      'NETWORK_ERROR',
      'SERVICE_UNAVAILABLE',
      'RATE_LIMITED',
      'INVALID_INPUT',
    ]

    return recoverableCodes.includes(code)
  }

  /**
   * Check if error is TokenCounterError
   */
  private isTokenCounterError(error: unknown): error is TokenCounterError {
    return (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      'context' in error
    )
  }

  /**
   * Log error
   */
  private logError(error: TokenCounterError): void {
    this.errorLog.push(error)

    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize)
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn('[RobustTokenCounter] Error logged:', {
        code: error.code,
        message: error.message,
        recoverable: error.recoverable,
        fallbackUsed: error.fallbackUsed,
      })
    }
  }

  /**
   * Get recent errors
   */
  public getRecentErrors(limit = 10): TokenCounterError[] {
    return this.errorLog.slice(-limit)
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = []
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): Record<string, number> {
    const stats: Record<string, number> = {}

    this.errorLog.forEach((error) => {
      stats[error.code] = (stats[error.code] || 0) + 1
    })

    return stats
  }
}

// Export singleton instance
export const robustTokenCounter = new RobustTokenCounter()

// Convenience function for simple usage
export async function countTokensRobust(
  text: string,
  options?: ErrorHandlingOptions
): Promise<number> {
  const result = await robustTokenCounter.countTokensWithFallback(text, options)
  return result.count
}
