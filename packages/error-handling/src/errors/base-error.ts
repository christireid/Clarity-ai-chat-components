/**
 * A suggested solution for resolving an error
 */
export interface ErrorSolution {
  /** Brief description of the solution */
  description: string
  /** Step-by-step instructions */
  steps?: string[]
  /** Code example showing the fix */
  example?: string
  /** Link to documentation */
  docsUrl?: string
}

/**
 * Base error class for all Clarity Chat errors.
 * Provides consistent structure, serialization, and stack trace handling.
 *
 * This is the canonical ClarityError — all packages should import from here
 * (or re-export from here) rather than defining their own.
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

  /** User-friendly solution hint (simple string shorthand) */
  readonly solution?: string

  /** Structured solutions with steps, examples, and docs links */
  readonly solutions: ErrorSolution[]

  /** Documentation link */
  readonly docs?: string

  constructor(
    message: string,
    options?: {
      cause?: Error
      context?: Record<string, unknown>
      recoverable?: boolean
      solution?: string
      solutions?: ErrorSolution[]
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
    this.solutions = options?.solutions ?? []
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
      ...(this.solutions.length > 0 && { solutions: this.solutions }),
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
   * Format error for display in terminal
   */
  toTerminalString(): string {
    const lines: string[] = []

    lines.push(`\n${this.name} [${this.code}]: ${this.message}`)

    if (this.solution) {
      lines.push(`\n💡 Solution: ${this.solution}`)
    }

    if (this.solutions.length > 0) {
      lines.push(`\n💡 Suggested Solutions:`)
      this.solutions.forEach((sol, index) => {
        lines.push(`\n   ${index + 1}. ${sol.description}`)
        if (sol.steps) {
          sol.steps.forEach((step, stepIndex) => {
            lines.push(`      ${stepIndex + 1}. ${step}`)
          })
        }
        if (sol.example) {
          lines.push(`\n      Example:`)
          lines.push(`      ${sol.example.split('\n').join('\n      ')}`)
        }
        if (sol.docsUrl) {
          lines.push(`      📚 Documentation: ${sol.docsUrl}`)
        }
      })
    }

    if (this.docs) {
      lines.push(`\n📚 Documentation: ${this.docs}`)
    }

    if (this.context) {
      lines.push(`\n🔍 Context: ${JSON.stringify(this.context, null, 2)}`)
    }

    lines.push('')
    return lines.join('\n')
  }

  /**
   * Full string representation with all details
   */
  override toString(): string {
    return this.toTerminalString()
  }

  /**
   * Format error for structured logging
   */
  toLogString(): string {
    return JSON.stringify({
      timestamp: this.timestamp.toISOString(),
      level: 'error',
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      stack: this.stack,
    })
  }
}

/**
 * Check if an error is a ClarityError
 */
export function isClarityError(error: unknown): error is ClarityError {
  return error instanceof ClarityError
}
