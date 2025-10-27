/**
 * Utility functions for error handling
 */

import { ClarityError } from './base-error'

/**
 * Format error for display
 */
export function formatError(error: Error | ClarityError): string {
  if (error instanceof ClarityError) {
    return error.toTerminalString()
  }
  
  return `\n❌ Error: ${error.message}\n\n${error.stack}\n`
}

/**
 * Log error to console with formatting
 */
export function logError(error: Error | ClarityError): void {
  if (error instanceof ClarityError) {
    console.error(error.toTerminalString())
  } else {
    console.error('\n❌ Unexpected Error:', error.message)
    console.error('\nStack trace:')
    console.error(error.stack)
    console.error('')
  }
}

/**
 * Handle error with appropriate response
 */
export function handleError(error: Error | ClarityError): {
  statusCode: number
  body: any
} {
  if (error instanceof ClarityError) {
    const statusCode = getStatusCode(error.code)
    return {
      statusCode,
      body: error.toJSON()
    }
  }

  // Unknown error
  return {
    statusCode: 500,
    body: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      technicalMessage: error.message
    }
  }
}

/**
 * Map error codes to HTTP status codes
 */
function getStatusCode(errorCode: string): number {
  const statusCodes: Record<string, number> = {
    // Client errors (400-499)
    'VALIDATION_ERROR': 400,
    'INVALID_INPUT': 400,
    'MISSING_FIELD': 400,
    'TYPE_MISMATCH': 400,
    'INVALID_CONFIG': 400,
    
    // Authentication/Authorization (401-403)
    'API_KEY_MISSING': 401,
    'API_AUTHENTICATION_FAILED': 401,
    
    // Not found (404)
    'FILE_NOT_FOUND': 404,
    'DEPENDENCY_MISSING': 404,
    
    // Rate limiting (429)
    'API_RATE_LIMIT': 429,
    
    // Server errors (500-599)
    'API_NETWORK_ERROR': 503,
    'API_RESPONSE_ERROR': 502,
    'PORT_IN_USE': 500,
    'ENV_VAR_MISSING': 500
  }

  return statusCodes[errorCode] || 500
}

/**
 * Create error handler middleware for Next.js API routes
 */
export function createErrorHandler() {
  return function errorHandler(
    handler: (req: any, res: any) => Promise<any>
  ) {
    return async (req: any, res: any) => {
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
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorHandler?: (error: Error) => void
): T {
  return (async (...args: any[]) => {
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
 * Assert condition and throw descriptive error if false
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
