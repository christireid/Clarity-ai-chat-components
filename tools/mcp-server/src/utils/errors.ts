/**
 * Custom error classes for MCP server
 */

export enum ErrorCode {
  VALIDATION_ERROR = 400,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  PERMISSION_DENIED = 403
}

export class MCPError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'MCPError'
    Object.setPrototypeOf(this, MCPError.prototype)
  }
}

export class ValidationError extends MCPError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.VALIDATION_ERROR, message, details)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class NotFoundError extends MCPError {
  constructor(resource: string, identifier?: string) {
    const message = identifier 
      ? `${resource} not found: ${identifier}`
      : `${resource} not found`
    super(ErrorCode.NOT_FOUND, message, { resource, identifier })
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class PermissionError extends MCPError {
  constructor(message: string, details?: Record<string, any>) {
    super(ErrorCode.PERMISSION_DENIED, message, details)
    this.name = 'PermissionError'
    Object.setPrototypeOf(this, PermissionError.prototype)
  }
}

/**
 * Format error for MCP response
 */
export function formatErrorResponse(error: unknown): {
  content: Array<{ type: 'text'; text: string }>
  isError: boolean
} {
  if (error instanceof MCPError) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            success: false,
            error: {
              code: error.code,
              message: error.message,
              ...(error.details && { details: error.details })
            }
          }, null, 2)
        }
      ],
      isError: true
    }
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          success: false,
          error: {
            code: ErrorCode.INTERNAL_ERROR,
            message: 'Internal server error'
          }
        }, null, 2)
      }
    ],
    isError: true
  }
}
