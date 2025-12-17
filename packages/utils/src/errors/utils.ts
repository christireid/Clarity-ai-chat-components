/**
 * Error Handling Utilities
 *
 * Helper functions for error handling, formatting, and common patterns.
 */

import { ClarityError } from './base.js'
import { logger } from '../logger';

/**
 * Format any error for display
 *
 * @param error - Error to format
 * @returns Formatted error string
 *
 * @example
 * ```ts
 * try {
 *   await riskyOperation()
 * } catch (error) {
 *   logger.error(formatError(error))
 * }
 * ```
 */
export function formatError(error: Error | ClarityError): string {
  if (error instanceof ClarityError) {
    return error.toTerminalString()
  }

  return `\n❌ Error: ${error.message}\n\n${error.stack}\n`
}

/**
 * Log error to console with formatting
 *
 * @param error - Error to log
 */
export function logError(errorToLog: Error | ClarityError): void {
  if (errorToLog instanceof ClarityError) {
    logger.error(errorToLog.toTerminalString())
  } else {
    logger.error('\n❌ Unexpected Error:', errorToLog.message)
    if (errorToLog.stack) {
      logger.error('\nStack trace:')
      logger.error(errorToLog.stack)
    }
    logger.error('')
  }
}

/**
 * HTTP status codes for error types
 */
const ERROR_STATUS_CODES: Record<string, number> = {
  // Client errors (400-499)
  VALIDATION_ERROR: 400,
  INVALID_INPUT: 400,
  MISSING_FIELD: 400,
  TYPE_MISMATCH: 400,
  INVALID_CONFIG: 400,

  // Authentication/Authorization (401-403)
  API_KEY_MISSING: 401,
  API_AUTHENTICATION_FAILED: 401,

  // Not found (404)
  FILE_NOT_FOUND: 404,
  DEPENDENCY_MISSING: 404,

  // Rate limiting (429)
  API_RATE_LIMIT: 429,

  // Server errors (500-599)
  API_NETWORK_ERROR: 503,
  API_RESPONSE_ERROR: 502,
  PORT_IN_USE: 500,
  ENV_VAR_MISSING: 500,
}

/**
 * Get HTTP status code for an error
 *
 * @param error - Error to get status for
 * @returns HTTP status code
 */
export function getStatusCode(error: Error | ClarityError): number {
  if (error instanceof ClarityError) {
    return ERROR_STATUS_CODES[error.code] || 500
  }
  return 500
}

/**
 * Handle error and return HTTP response data
 *
 * @param error - Error to handle
 * @returns Object with statusCode and body
 *
 * @example
 * ```ts
 * app.use((error, req, res, next) => {
 *   const { statusCode, body } = handleError(error)
 *   res.status(statusCode).json(body)
 * })
 * ```
 */
export function handleError(error: Error | ClarityError): {
  statusCode: number
  body: Record<string, unknown>
} {
  if (error instanceof ClarityError) {
    return {
      statusCode: getStatusCode(error),
      body: error.toJSON(),
    }
  }

  // Unknown error
  return {
    statusCode: 500,
    body: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      technicalMessage: error.message,
    },
  }
}

/**
 * Create error handler middleware for Express/Next.js API routes
 *
 * @returns Error handler middleware
 *
 * @example
 * ```ts
 * const errorHandler = createErrorHandler()
 *
 * export const POST = errorHandler(async (req, res) => {
 *   // Your handler logic
 * })
 * ```
 */
export function createErrorHandler() {
  return function errorHandler<
    Req = unknown,
    Res extends {
      status: (code: number) => { json: (body: unknown) => void }
    } = never,
  >(handler: (req: Req, res: Res) => Promise<unknown>) {
    return async (req: Req, res: Res) => {
      try {
        return await handler(req, res)
      } catch (error) {
        const { statusCode, body } = handleError(error as Error)

        // Log error for debugging
        logError(error as Error)

        // Send error response
        res.status(statusCode).json(body)
      }
    }
  }
}

/**
 * Wrap async functions with error handling
 *
 * @param fn - Function to wrap
 * @param errorHandler - Optional custom error handler
 * @returns Wrapped function
 *
 * @example
 * ```ts
 * const safeFetch = withErrorHandling(
 *   async (url: string) => fetch(url),
 *   (error) => logger.error('Fetch failed:', error)
 * )
 * ```
 */
export function withErrorHandling<
  T extends (...args: unknown[]) => Promise<unknown>,
>(fn: T, errorHandler?: (error: Error) => void): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      if (errorHandler) {
        errorHandler(error as Error)
      } else {
        logError(error as Error)
      }
      throw error
    }
  }) as T
}

/**
 * Assert a condition and throw error if false
 *
 * @param condition - Condition to assert
 * @param error - Error to throw if condition is false
 * @throws The provided error if condition is false
 *
 * @example
 * ```ts
 * assert(user !== null, new ValidationError('User is required', 'user'))
 * // TypeScript now knows user is not null
 * debug(user.name)
 * ```
 */
export function assert(
  condition: boolean,
  error: Error | ClarityError | string
): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new Error(error)
    }
    throw error
  }
}

/**
 * Try-catch wrapper that returns [error, result] tuple
 *
 * Provides a Go-style error handling pattern for async operations.
 *
 * @param fn - Async function to execute
 * @returns Tuple of [error, result] where one is always null
 *
 * @example
 * ```ts
 * const [error, user] = await tryCatch(() => fetchUser(id))
 *
 * if (error) {
 *   logger.error('Failed to fetch user:', error.message)
 *   return
 * }
 *
 * debug('Got user:', user.name)
 * ```
 */
export async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<[null, T] | [Error, null]> {
  try {
    const result = await fn()
    return [null, result]
  } catch (error) {
    return [error as Error, null]
  }
}

/**
 * Synchronous version of tryCatch
 *
 * @param fn - Function to execute
 * @returns Tuple of [error, result]
 *
 * @example
 * ```ts
 * const [error, data] = tryCatchSync(() => JSON.parse(jsonString))
 *
 * if (error) {
 *   logger.error('Invalid JSON:', error.message)
 *   return
 * }
 * ```
 */
export function tryCatchSync<T>(fn: () => T): [null, T] | [Error, null] {
  try {
    const result = fn()
    return [null, result]
  } catch (error) {
    return [error as Error, null]
  }
}

/**
 * Check if an error is of a specific type
 *
 * @param error - Error to check
 * @param ErrorClass - Error class to check against
 * @returns True if error is instance of ErrorClass
 *
 * @example
 * ```ts
 * if (isErrorType(error, ValidationError)) {
 *   // Handle validation error
 *   debug(error.field)
 * }
 * ```
 */
export function isErrorType<T extends Error>(
  error: unknown,
  ErrorClass: new (...args: unknown[]) => T
): error is T {
  return error instanceof ErrorClass
}

/**
 * Extract error message from unknown error
 *
 * @param error - Unknown error value
 * @returns Error message string
 *
 * @example
 * ```ts
 * catch (error) {
 *   logger.error('Failed:', getErrorMessage(error))
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return String(error)
}

/**
 * Normalize unknown error to Error instance
 *
 * @param error - Unknown error value
 * @returns Error instance
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  if (typeof error === 'string') {
    return new Error(error)
  }
  return new Error(String(error))
}
