/**
 * Base error class for all Clarity Chat errors.
 * Provides consistent structure, serialization, and stack trace handling.
 *
 * @example
 * ```typescript
 * throw new ClarityError('Something went wrong', {
 *   code: 'UNKNOWN_ERROR',
 *   context: { userId: '123' }
 * });
 * ```
 */
export abstract class ClarityError extends Error {
  /** Unique error code for programmatic handling */
  abstract readonly code: string

  /** HTTP status code for API responses */
  abstract readonly statusCode: number

  /** Whether this error is recoverable */
  readonly recoverable: boolean

  /** Additional context for debugging */
  readonly context?: Record<string, unknown>

  /** Original error that caused this one */
  override readonly cause?: Error

  /** Timestamp when error occurred */
  readonly timestamp: Date

  /** User-friendly solution hint */
  readonly solution?: string

  /** Documentation link */
  readonly docs?: string

  constructor(
    message: string,
    options?: {
      cause?: Error
      context?: Record<string, unknown>
      recoverable?: boolean
      solution?: string
      docs?: string
    }
  ) {
    super(message)

    // Required for proper instanceof checks in TypeScript
    Object.setPrototypeOf(this, new.target.prototype)

    // Override the name property from Error
    ;(this as { name: string }).name = this.constructor.name
    this.cause = options?.cause
    this.context = options?.context
    this.recoverable = options?.recoverable ?? false
    this.timestamp = new Date()
    this.solution = options?.solution
    this.docs = options?.docs

    // Clean stack trace (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Serialize error for logging or API responses
   * Excludes sensitive information and circular references
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      recoverable: this.recoverable,
      timestamp: this.timestamp.toISOString(),
      // Only include context in development
      ...(process.env['NODE_ENV'] === 'development' && {
        context: this.context,
        stack: this.stack,
        solution: this.solution,
        docs: this.docs,
      }),
    }
  }

  /**
   * User-friendly message suitable for display
   */
  get userMessage(): string {
    if (this.recoverable && this.solution) {
      return `${this.message}. ${this.solution}`
    }
    return this.recoverable
      ? `${this.message}. Please try again.`
      : 'An unexpected error occurred. Please contact support.'
  }

  /**
   * Full string representation with all details
   */
  override toString(): string {
    let message = `${this.name} [${this.code}]: ${this.message}`

    if (this.solution) {
      message += `\n\n💡 Solution: ${this.solution}`
    }

    if (this.docs) {
      message += `\n\n📚 Documentation: ${this.docs}`
    }

    if (this.context) {
      message += `\n\n🔍 Context: ${JSON.stringify(this.context, null, 2)}`
    }

    return message
  }
}

/**
 * Check if an error is a ClarityError
 */
export function isClarityError(error: unknown): error is ClarityError {
  return error instanceof ClarityError
}
