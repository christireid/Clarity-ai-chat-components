/**
 * Enhanced error handling utilities for CLI
 * Provides actionable error messages and proper exit codes
 */

import chalk from 'chalk'
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
 * Format and display error with suggestions
 */
export function handleError(error: unknown): never {
  // Don't show beautiful error UI in JSON mode
  const isJsonMode = process.argv.includes('--json')
  
  if (error instanceof CLIError) {
    if (!isJsonMode) {
      console.error('\n')
      const errorBox = boxen(
        chalk.red.bold(error.message) +
        (error.suggestions.length > 0 
          ? '\n\n' + chalk.yellow.bold('💡 Suggestions:\n') +
            error.suggestions.map(s => chalk.gray('  • ') + s).join('\n')
          : '') +
        (error.docs 
          ? '\n\n' + chalk.blue.bold('📚 Documentation: ') + chalk.cyan.underline(error.docs)
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
      console.error(errorBox)
    } else {
      console.error(JSON.stringify({
        error: error.message,
        code: error.code,
        suggestions: error.suggestions,
        docs: error.docs,
      }))
    }
    
    logger.error(error)
    process.exit(error.code)
  }
  
  if (error instanceof Error) {
    if (!isJsonMode) {
      console.error('\n')
      const errorBox = boxen(
        chalk.red.bold('Unexpected Error:') + '\n\n' + chalk.red(error.message) +
        (process.env.DEBUG || process.env.VERBOSE && error.stack
          ? '\n\n' + chalk.gray(error.stack)
          : '\n\n' + chalk.gray('Run with --debug for more details')),
        {
          padding: 1,
          margin: 1,
          borderStyle: 'round',
          borderColor: 'red',
          title: '❌ Error',
          titleAlignment: 'center',
        }
      )
      console.error(errorBox)
    } else {
      console.error(JSON.stringify({
        error: error.message,
        stack: error.stack,
      }))
    }
    
    logger.error(error)
    process.exit(ExitCode.GENERAL_ERROR)
  }
  
  if (!isJsonMode) {
    console.error('\n')
    console.error(boxen(
      chalk.red.bold('Unknown Error'),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'red',
        title: '❌ Error',
        titleAlignment: 'center',
      }
    ))
  }
  
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
