import { logger } from '@clarity-chat/utils/logger';
/**
 * Enhanced error handling utilities for CLI
 * Provides actionable error messages and proper exit codes
 */

import pc from 'picocolors'
import boxen from 'boxen'
import { getLogger } from './logger.js'


const logger = getLogger('errors')

export enum ExitCode {
  SUCCESS = 0,
  GENERAL_ERROR = 1,
  MISUSE = 2,
  CONFIG_ERROR = 3,
  VALIDATION_ERROR = 4,
  NOT_FOUND = 5,
  PERMISSION_ERROR = 6,
}

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

export class ValidationError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.VALIDATION_ERROR, suggestions)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends CLIError {
  constructor(resource: string, suggestions: string[] = []) {
    super(`Not found: ${resource}`, ExitCode.NOT_FOUND, suggestions)
    this.name = 'NotFoundError'
  }
}

export class ConfigError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.CONFIG_ERROR, suggestions)
    this.name = 'ConfigError'
  }
}

export class PermissionError extends CLIError {
  constructor(message: string, suggestions: string[] = []) {
    super(message, ExitCode.PERMISSION_ERROR, suggestions)
    this.name = 'PermissionError'
  }
}

/**
 * Normalize error to Error instance
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

  // Don't show beautiful error UI in JSON mode
  const isJsonMode = process.argv.includes('--json')

  if (normalizedError instanceof CLIError) {
    if (!isJsonMode) {
      logger.error('\n')
      const errorBox = boxen(
        pc.bold(pc.red(normalizedError.message)) +
          (normalizedError.suggestions.length > 0
            ? '\n\n' +
              pc.bold(pc.yellow('💡 Suggestions:\n')) +
              normalizedError.suggestions
                .map((s) => pc.gray('  • ') + s)
                .join('\n')
            : '') +
          (normalizedError.docs
            ? '\n\n' +
              pc.bold(pc.blue('📚 Documentation: ')) +
              pc.underline(pc.cyan(normalizedError.docs))
            : ''),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'red',
          title: '❌ Error',
          titleAlignment: 'center',
        }
      )
      logger.error(errorBox)
    } else {
      logger.error(
        JSON.stringify({
          error: normalizedError.message,
          code: normalizedError.code,
          suggestions: normalizedError.suggestions,
          docs: normalizedError.docs,
        })
      )
    }

    logger.error(normalizedError)
    process.exit(normalizedError.code)
  }

  if (normalizedError instanceof Error) {
    if (!isJsonMode) {
      logger.error('\n')
      const errorBox = boxen(
        pc.bold(pc.red('Unexpected Error:')) +
          '\n\n' +
          pc.red(normalizedError.message) +
          (process.env.DEBUG || (process.env.VERBOSE && normalizedError.stack)
            ? '\n\n' + pc.gray(normalizedError.stack)
            : '\n\n' + pc.gray('Run with --debug for more details')),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'red',
          title: '❌ Error',
          titleAlignment: 'center',
        }
      )
      logger.error(errorBox)
    } else {
      logger.error(
        JSON.stringify({
          error: normalizedError.message,
          stack: normalizedError.stack,
        })
      )
    }

    logger.error(normalizedError)
    process.exit(ExitCode.GENERAL_ERROR)
  }

  if (!isJsonMode) {
    logger.error('\n')
    logger.error(
      boxen(pc.bold(pc.red('Unknown Error')), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'red',
        title: '❌ Error',
        titleAlignment: 'center',
      })
    )
  }

  logger.error('Unknown error', normalizedError)
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
