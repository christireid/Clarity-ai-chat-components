/**
 * Shared Error Classes
 *
 * Structured error handling for all Clarity Chat packages
 */

import pc from 'picocolors'

export enum ExitCode {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  MISUSE = 2,
  CONFIG_ERROR = 3,
  VALIDATION_ERROR = 4,
  NOT_FOUND = 5,
  PERMISSION_ERROR = 6,
}

/**
 * Base error class for CLI tools
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: ExitCode = ExitCode.GENERAL_ERROR,
    public readonly suggestions: string[] = [],
    public readonly docs?: string
  ) {
    super(message)
    this.name = 'CLIError'
  }
}

/**
 * Validation error
 */
export class ValidationError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.VALIDATION_ERROR, suggestions)
    this.name = 'ValidationError'
  }
}

/**
 * Configuration error
 */
export class ConfigError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.CONFIG_ERROR, suggestions)
    this.name = 'ConfigError'
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends CLIError {
  constructor(resource: string, suggestions: string[] = []) {
    super(`Not found: ${resource}`, ExitCode.NOT_FOUND, suggestions)
    this.name = 'NotFoundError'
  }
}

/**
 * Permission error
 */
export class PermissionError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.PERMISSION_ERROR, suggestions)
    this.name = 'PermissionError'
  }
}

/**
 * Normalize any error to Error instance
 */
function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === 'string') {
    return new Error(error)
  }
  return new Error(String(error))
}

/**
 * Format and display error with suggestions
 */
export function handleError(error: string | Error | unknown): never {
  const normalizedError = normalizeError(error)

  // Check for JSON output mode
  const isJsonMode =
    process.argv.includes('--output=json') || process.argv.includes('--json')

  if (normalizedError instanceof CLIError) {
    if (isJsonMode) {
      console.error(
        JSON.stringify({
          error: normalizedError.message,
          code: normalizedError.code,
          suggestions: normalizedError.suggestions,
          docs: normalizedError.docs,
        })
      )
    } else {
      console.error('')
      console.error(
        pc.bold(pc.red(`✖ ${normalizedError.name}: ${normalizedError.message}`))
      )

      if (normalizedError.suggestions.length > 0) {
        console.error('')
        console.error(pc.bold(pc.yellow('💡 Suggestions:')))
        for (const suggestion of normalizedError.suggestions) {
          console.error(pc.gray(`   • ${suggestion}`))
        }
      }

      if (normalizedError.docs) {
        console.error('')
        console.error(
          pc.bold(pc.blue('📚 Documentation: ')) +
            pc.underline(pc.cyan(normalizedError.docs))
        )
      }
      console.error('')
    }

    process.exit(normalizedError.code)
  }

  // Generic error
  if (isJsonMode) {
    console.error(
      JSON.stringify({
        error: normalizedError.message,
        stack: normalizedError.stack,
      })
    )
  } else {
    console.error('')
    console.error(pc.bold(pc.red(`✖ Error: ${normalizedError.message}`)))

    if (process.env.DEBUG || process.env.VERBOSE) {
      if (normalizedError.stack) {
        console.error('')
        console.error(pc.gray(normalizedError.stack))
      }
    } else {
      console.error(pc.gray('   Run with --verbose for more details'))
    }
    console.error('')
  }

  process.exit(ExitCode.GENERAL_ERROR)
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<
  T extends (...args: never[]) => Promise<unknown>,
>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error)
    }
  }) as T
}
