/**
 * Enhanced error handling utilities for CLI
 * Provides actionable error messages and proper exit codes
 */

import chalk from 'chalk'
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
 * Format and display error with suggestions
 */
export function handleError(error: unknown): never {
  if (error instanceof CLIError) {
    console.error('\n' + chalk.red.bold('❌ Error:'), chalk.red(error.message))
    
    if (error.suggestions.length > 0) {
      console.error('\n' + chalk.yellow.bold('💡 Suggestions:'))
      error.suggestions.forEach(suggestion => {
        console.error(chalk.gray('  •'), suggestion)
      })
    }
    
    if (error.docs) {
      console.error('\n' + chalk.blue.bold('📚 Documentation:'), chalk.cyan(error.docs))
    }
    
    logger.error(error)
    process.exit(error.code)
  }
  
  if (error instanceof Error) {
    console.error('\n' + chalk.red.bold('❌ Unexpected Error:'), chalk.red(error.message))
    
    if (process.env.DEBUG || process.env.VERBOSE) {
      console.error('\n' + chalk.gray(error.stack || ''))
    } else {
      console.error(chalk.gray('\nRun with --debug for more details'))
    }
    
    logger.error(error)
    process.exit(ExitCode.GENERAL_ERROR)
  }
  
  console.error('\n' + chalk.red.bold('❌ Unknown Error'))
  logger.error('Unknown error', error)
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
