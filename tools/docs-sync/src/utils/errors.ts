/**
 * Structured error handling for docs-sync
 * Provides actionable error messages and proper exit codes
 * Aligned with @clarity-chat/cli error patterns
 */

import pc from 'picocolors'

export enum ExitCode {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  MISUSE = 2,
  CONFIG_ERROR = 3,
  VALIDATION_ERROR = 4,
  NOT_FOUND = 5,
  EXTRACTION_ERROR = 6,
  GENERATION_ERROR = 7,
  GIT_ERROR = 8,
}

/**
 * Base error class for docs-sync CLI
 */
export class DocsSyncError extends Error {
  constructor(
    message: string,
    public readonly code: ExitCode = ExitCode.GENERAL_ERROR,
    public readonly suggestions: string[] = [],
    public readonly docs?: string
  ) {
    super(message)
    this.name = 'DocsSyncError'
  }
}

/**
 * Validation error (config, schema, etc.)
 */
export class ValidationError extends DocsSyncError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.VALIDATION_ERROR, suggestions)
    this.name = 'ValidationError'
  }
}

/**
 * Configuration error
 */
export class ConfigError extends DocsSyncError {
  constructor(message: string, suggestions: string[] = []) {
    super(
      message,
      ExitCode.CONFIG_ERROR,
      suggestions.length > 0
        ? suggestions
        : [
            'Check your .docs-sync.json configuration',
            'Run: pnpm docs-sync init --force to regenerate config',
          ]
    )
    this.name = 'ConfigError'
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends DocsSyncError {
  constructor(resource: string, suggestions: string[] = []) {
    super(`Not found: ${resource}`, ExitCode.NOT_FOUND, suggestions)
    this.name = 'NotFoundError'
  }
}

/**
 * API extraction error
 */
export class ExtractionError extends DocsSyncError {
  constructor(message: string, suggestions: string[] = []) {
    super(
      message,
      ExitCode.EXTRACTION_ERROR,
      suggestions.length > 0
        ? suggestions
        : [
            'Check that the TypeScript files are valid',
            'Verify entry points in your config',
            'Run with --verbose for more details',
          ]
    )
    this.name = 'ExtractionError'
  }
}

/**
 * Documentation generation error
 */
export class GenerationError extends DocsSyncError {
  constructor(message: string, suggestions: string[] = []) {
    super(
      message,
      ExitCode.GENERATION_ERROR,
      suggestions.length > 0
        ? suggestions
        : [
            'Check output directory permissions',
            'Verify the docs directory exists',
            'Run with --dry-run to preview changes',
          ]
    )
    this.name = 'GenerationError'
  }
}

/**
 * Git operation error
 */
export class GitError extends DocsSyncError {
  constructor(message: string, suggestions: string[] = []) {
    super(
      message,
      ExitCode.GIT_ERROR,
      suggestions.length > 0
        ? suggestions
        : [
            'Ensure you are in a git repository',
            'Check that the commits/refs exist',
            'Verify git is installed and accessible',
          ]
    )
    this.name = 'GitError'
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

  if (normalizedError instanceof DocsSyncError) {
    if (isJsonMode) {
      SecureLogger.error(
        JSON.stringify({
          error: normalizedError.message,
          code: normalizedError.code,
          suggestions: normalizedError.suggestions,
          docs: normalizedError.docs,
        })
      )
    } else {
      SecureLogger.error('')
      SecureLogger.error(
        pc.bold(pc.red(`✖ ${normalizedError.name}: ${normalizedError.message}`))
      )

      if (normalizedError.suggestions.length > 0) {
        SecureLogger.error('')
        SecureLogger.error(pc.bold(pc.yellow('💡 Suggestions:')))
        for (const suggestion of normalizedError.suggestions) {
          SecureLogger.error(pc.gray(`   • ${suggestion}`))
        }
      }

      if (normalizedError.docs) {
        SecureLogger.error('')
        SecureLogger.error(
          pc.bold(pc.blue('📚 Documentation: ')) +
            pc.underline(pc.cyan(normalizedError.docs))
        )
      }
      SecureLogger.error('')
    }

    process.exit(normalizedError.code)
  }

  // Generic error
  if (isJsonMode) {
    SecureLogger.error(
      JSON.stringify({
        error: normalizedError.message,
        stack: normalizedError.stack,
      })
    )
  } else {
    SecureLogger.error('')
    SecureLogger.error(pc.bold(pc.red(`✖ Error: ${normalizedError.message}`)))

    if (process.env.DEBUG || process.env.VERBOSE) {
      if (normalizedError.stack) {
        SecureLogger.error('')
        SecureLogger.error(pc.gray(normalizedError.stack))
      }
    } else {
      SecureLogger.error(pc.gray('   Run with --verbose for more details'))
    }
    SecureLogger.error('')
  }

  process.exit(ExitCode.GENERAL_ERROR)
}

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error)
    }
  }) as T
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(
  errors: Array<{ path: string; message: string; value?: unknown }>
): string {
  if (errors.length === 0) return ''

  const lines = [pc.bold(pc.red('Configuration validation failed:')), '']

  for (const err of errors) {
    lines.push(`  ${pc.red('✖')} ${pc.cyan(err.path)}: ${err.message}`)
    if (err.value !== undefined) {
      lines.push(`    Value: ${pc.gray(JSON.stringify(err.value))}`)
    }
  }

  return lines.join('\n')
}
