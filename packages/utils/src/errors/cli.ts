import { error as logError } from '../logger';

/**
 * CLI Error Classes
 *
 * Errors for command-line interface operations with exit codes
 * and user-friendly formatting.
 */

/**
 * Standard CLI exit codes
 */
export enum ExitCode {
  /** Successful execution */
  SUCCESS = 0,
  /** General error */
  GENERAL_ERROR = 1,
  /** Command misuse (invalid arguments) */
  MISUSE = 2,
  /** Configuration error */
  CONFIG_ERROR = 3,
  /** Validation error */
  VALIDATION_ERROR = 4,
  /** Resource not found */
  NOT_FOUND = 5,
  /** Permission denied */
  PERMISSION_ERROR = 6,
}

/**
 * Base error class for CLI tools
 *
 * Provides structured error handling with exit codes and suggestions
 * for CLI applications.
 *
 * @example
 * ```ts
 * throw new CLIError(
 *   'Invalid option: --foo',
 *   ExitCode.MISUSE,
 *   ['Use --bar instead', 'Run --help for usage info']
 * )
 * ```
 */
export class CLIError extends Error {
  /** CLI exit code */
  public readonly code: ExitCode
  /** Suggestions for fixing the error */
  public readonly suggestions: string[]
  /** Optional documentation URL */
  public readonly docs?: string

  constructor(
    message: string,
    code: ExitCode = ExitCode.GENERAL_ERROR,
    suggestions: string[] = [],
    docs?: string
  ) {
    super(message)
    this.name = 'CLIError'
    this.code = code
    this.suggestions = suggestions
    this.docs = docs
  }

  /**
   * Format error for CLI output
   */
  format(): string {
    const lines: string[] = []
    lines.push(`\n✖ ${this.name}: ${this.message}`)

    if (this.suggestions.length > 0) {
      lines.push('\n💡 Suggestions:')
      for (const suggestion of this.suggestions) {
        lines.push(`   • ${suggestion}`)
      }
    }

    if (this.docs) {
      lines.push(`\n📚 Documentation: ${this.docs}`)
    }

    lines.push('')
    return lines.join('\n')
  }

  /**
   * Format error as JSON
   */
  toJSON() {
    return {
      error: this.message,
      code: this.code,
      suggestions: this.suggestions,
      docs: this.docs,
    }
  }
}

/**
 * CLI validation error
 */
export class CLIValidationError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.VALIDATION_ERROR, suggestions)
    this.name = 'ValidationError'
  }
}

/**
 * CLI configuration error
 */
export class CLIConfigError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.CONFIG_ERROR, suggestions)
    this.name = 'ConfigError'
  }
}

/**
 * CLI resource not found error
 */
export class CLINotFoundError extends CLIError {
  constructor(resource: string, suggestions: string[] = []) {
    super(`Not found: ${resource}`, ExitCode.NOT_FOUND, suggestions)
    this.name = 'NotFoundError'
  }
}

/**
 * CLI permission error
 */
export class CLIPermissionError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.PERMISSION_ERROR, suggestions)
    this.name = 'PermissionError'
  }
}

/**
 * Handle CLI error and exit the process
 *
 * @param error - Error to handle
 *
 * @example
 * ```ts
 * try {
 *   await runCommand()
 * } catch (error) {
 *   handleCLIError(error)
 * }
 * ```
 */
export function handleCLIError(error: string | Error | unknown): never {
  const normalizedError = normalizeToError(error)
  const isJsonMode =
    typeof process !== 'undefined' &&
    (process.argv?.includes('--output=json') ||
      process.argv?.includes('--json'))

  if (normalizedError instanceof CLIError) {
    if (isJsonMode) {
      logError(JSON.stringify(normalizedError.toJSON()))
    } else {
      logError(normalizedError.format())
    }

    if (typeof process !== 'undefined') {
      process.exit(normalizedError.code)
    }
    throw normalizedError // Fallback for non-Node environments
  }

  // Generic error
  if (isJsonMode) {
    logError(
      JSON.stringify({
        error: normalizedError.message,
        stack: normalizedError.stack,
      })
    )
  } else {
    logError(`\n✖ Error: ${normalizedError.message}`)

    const showStack =
      typeof process !== 'undefined' &&
      (process.env?.DEBUG || process.env?.VERBOSE)
    if (showStack && normalizedError.stack) {
      logError('\n' + normalizedError.stack)
    } else {
      logError('   Run with --verbose for more details')
    }
    logError('')
  }

  if (typeof process !== 'undefined') {
    process.exit(ExitCode.GENERAL_ERROR)
  }
  throw normalizedError
}

/**
 * Wrap async CLI function with error handling
 *
 * @param fn - Async function to wrap
 * @returns Wrapped function that handles errors
 *
 * @example
 * ```ts
 * const main = withCLIErrorHandling(async () => {
 *   // Your CLI logic here
 * })
 *
 * main()
 * ```
 */
export function withCLIErrorHandling<
  T extends (...args: never[]) => Promise<unknown>,
>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleCLIError(error)
    }
  }) as T
}

/**
 * Normalize any value to an Error instance
 */
function normalizeToError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === 'string') {
    return new Error(error)
  }
  return new Error(String(error))
}
