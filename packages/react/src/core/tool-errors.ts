/**
 * Tool System Error Hierarchy
 *
 * Unified error types for the tool calling system with consistent structure,
 * error codes, and recovery hints.
 *
 * @module core/tool-errors
 */

/**
 * Error codes for categorizing tool system errors
 */
export enum ToolErrorCode {
  // Validation errors (1xxx)
  VALIDATION_FAILED = 'TOOL_VALIDATION_FAILED',
  INVALID_PARAMETERS = 'TOOL_INVALID_PARAMETERS',
  INVALID_DEFINITION = 'TOOL_INVALID_DEFINITION',
  SCHEMA_VALIDATION_FAILED = 'TOOL_SCHEMA_VALIDATION_FAILED',

  // Execution errors (2xxx)
  EXECUTION_FAILED = 'TOOL_EXECUTION_FAILED',
  EXECUTION_TIMEOUT = 'TOOL_EXECUTION_TIMEOUT',
  EXECUTION_ABORTED = 'TOOL_EXECUTION_ABORTED',
  EXECUTION_REJECTED = 'TOOL_EXECUTION_REJECTED',

  // Registry errors (3xxx)
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  TOOL_ALREADY_REGISTERED = 'TOOL_ALREADY_REGISTERED',
  REGISTRY_ERROR = 'TOOL_REGISTRY_ERROR',

  // Lifecycle errors (4xxx)
  INVALID_STATE_TRANSITION = 'TOOL_INVALID_STATE_TRANSITION',
  LIFECYCLE_ERROR = 'TOOL_LIFECYCLE_ERROR',
  APPROVAL_REQUIRED = 'TOOL_APPROVAL_REQUIRED',
  APPROVAL_REJECTED = 'TOOL_APPROVAL_REJECTED',

  // Security errors (5xxx)
  SECURITY_VIOLATION = 'TOOL_SECURITY_VIOLATION',
  UNSAFE_IMPLEMENTATION = 'TOOL_UNSAFE_IMPLEMENTATION',
  RATE_LIMIT_EXCEEDED = 'TOOL_RATE_LIMIT_EXCEEDED',
  CONCURRENCY_LIMIT_EXCEEDED = 'TOOL_CONCURRENCY_LIMIT_EXCEEDED',

  // Cache errors (6xxx)
  CACHE_ERROR = 'TOOL_CACHE_ERROR',
  CACHE_MISS = 'TOOL_CACHE_MISS',

  // Unknown errors
  UNKNOWN = 'TOOL_UNKNOWN_ERROR',
}

/**
 * Base error class for all tool system errors
 *
 * Provides consistent structure for error handling with:
 * - Error codes for programmatic handling
 * - Context data for debugging
 * - Recovery suggestions for users
 *
 * @example
 * ```typescript
 * try {
 *   await tool.execute(args)
 * } catch (error) {
 *   if (error instanceof ToolSystemError) {
 *     console.log('Code:', error.code)
 *     console.log('Details:', error.details)
 *     console.log('Suggestion:', error.suggestion)
 *   }
 * }
 * ```
 */
export class ToolSystemError extends Error {
  /**
   * Error code for programmatic handling
   */
  readonly code: ToolErrorCode

  /**
   * Additional context about the error
   */
  readonly details?: Record<string, unknown>

  /**
   * Suggestion for how to fix or recover from the error
   */
  readonly suggestion?: string

  /**
   * ISO timestamp when error occurred
   */
  readonly timestamp: string

  /**
   * Original error that caused this error
   */
  override readonly cause?: Error

  constructor(
    message: string,
    code: ToolErrorCode,
    options?: {
      details?: Record<string, unknown>
      suggestion?: string
      cause?: Error
    }
  ) {
    super(message)
    this.name = 'ToolSystemError'
    this.code = code
    this.details = options?.details
    this.suggestion = options?.suggestion
    this.cause = options?.cause
    this.timestamp = new Date().toISOString()

    // Maintain proper stack trace for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      suggestion: this.suggestion,
      timestamp: this.timestamp,
      stack: this.stack,
    }
  }
}

/**
 * Validation errors - tool definition or argument validation failed
 */
export class ToolValidationError extends ToolSystemError {
  constructor(
    message: string,
    options?: {
      toolName?: string
      field?: string
      expected?: string | string[]
      received?: unknown
      suggestion?: string
      cause?: Error
    }
  ) {
    super(message, ToolErrorCode.VALIDATION_FAILED, {
      details: {
        toolName: options?.toolName,
        field: options?.field,
        expected: options?.expected,
        received: options?.received,
      },
      suggestion: options?.suggestion,
      cause: options?.cause,
    })
    this.name = 'ToolValidationError'
  }
}

/**
 * Execution errors - tool execution failed or timed out
 */
export class ToolExecutionError extends ToolSystemError {
  constructor(
    message: string,
    code:
      | ToolErrorCode.EXECUTION_FAILED
      | ToolErrorCode.EXECUTION_TIMEOUT
      | ToolErrorCode.EXECUTION_ABORTED = ToolErrorCode.EXECUTION_FAILED,
    options?: {
      toolName?: string
      args?: unknown
      duration?: number
      suggestion?: string
      cause?: Error
    }
  ) {
    super(message, code, {
      details: {
        toolName: options?.toolName,
        args: options?.args,
        duration: options?.duration,
      },
      suggestion: options?.suggestion,
      cause: options?.cause,
    })
    this.name = 'ToolExecutionError'
  }
}

/**
 * Timeout errors - tool execution exceeded time limit
 */
export class ToolTimeoutError extends ToolExecutionError {
  constructor(
    toolName: string,
    timeout: number,
    options?: {
      suggestion?: string
      cause?: Error
    }
  ) {
    super(
      `Tool "${toolName}" timed out after ${timeout}ms`,
      ToolErrorCode.EXECUTION_TIMEOUT,
      {
        toolName,
        duration: timeout,
        suggestion:
          options?.suggestion ||
          `Increase timeout or optimize tool implementation. Current limit: ${timeout}ms`,
        cause: options?.cause,
      }
    )
    this.name = 'ToolTimeoutError'
  }
}

/**
 * Registry errors - tool registration/lookup failed
 */
export class ToolRegistryError extends ToolSystemError {
  constructor(
    message: string,
    code:
      | ToolErrorCode.TOOL_NOT_FOUND
      | ToolErrorCode.TOOL_ALREADY_REGISTERED
      | ToolErrorCode.REGISTRY_ERROR = ToolErrorCode.REGISTRY_ERROR,
    options?: {
      toolName?: string
      availableTools?: string[]
      suggestion?: string
      cause?: Error
    }
  ) {
    super(message, code, {
      details: {
        toolName: options?.toolName,
        availableTools: options?.availableTools,
      },
      suggestion: options?.suggestion,
      cause: options?.cause,
    })
    this.name = 'ToolRegistryError'
  }
}

/**
 * Lifecycle errors - invalid state transition or lifecycle operation failed
 */
export class ToolLifecycleError extends ToolSystemError {
  constructor(
    message: string,
    code:
      | ToolErrorCode.INVALID_STATE_TRANSITION
      | ToolErrorCode.LIFECYCLE_ERROR
      | ToolErrorCode.APPROVAL_REQUIRED
      | ToolErrorCode.APPROVAL_REJECTED = ToolErrorCode.LIFECYCLE_ERROR,
    options?: {
      callId?: string
      currentState?: string
      targetState?: string
      suggestion?: string
      cause?: Error
    }
  ) {
    super(message, code, {
      details: {
        callId: options?.callId,
        currentState: options?.currentState,
        targetState: options?.targetState,
      },
      suggestion: options?.suggestion,
      cause: options?.cause,
    })
    this.name = 'ToolLifecycleError'
  }
}

/**
 * Security errors - unsafe implementation or security policy violation
 */
export class ToolSecurityError extends ToolSystemError {
  constructor(
    message: string,
    code:
      | ToolErrorCode.SECURITY_VIOLATION
      | ToolErrorCode.UNSAFE_IMPLEMENTATION
      | ToolErrorCode.RATE_LIMIT_EXCEEDED
      | ToolErrorCode.CONCURRENCY_LIMIT_EXCEEDED = ToolErrorCode.SECURITY_VIOLATION,
    options?: {
      toolName?: string
      violation?: string
      suggestion?: string
      cause?: Error
    }
  ) {
    super(message, code, {
      details: {
        toolName: options?.toolName,
        violation: options?.violation,
      },
      suggestion: options?.suggestion,
      cause: options?.cause,
    })
    this.name = 'ToolSecurityError'
  }
}

/**
 * Cache errors - cache operation failed
 */
export class ToolCacheError extends ToolSystemError {
  constructor(
    message: string,
    options?: {
      operation?: string
      key?: string
      suggestion?: string
      cause?: Error
    }
  ) {
    super(message, ToolErrorCode.CACHE_ERROR, {
      details: {
        operation: options?.operation,
        key: options?.key,
      },
      suggestion: options?.suggestion,
      cause: options?.cause,
    })
    this.name = 'ToolCacheError'
  }
}

/**
 * Type guard to check if error is a tool system error
 *
 * @param error - Error to check
 * @returns true if error is a ToolSystemError
 *
 * @example
 * ```typescript
 * try {
 *   await tool.execute(args)
 * } catch (error) {
 *   if (isToolSystemError(error)) {
 *     console.log('Tool error:', error.code)
 *   } else {
 *     console.log('Unknown error:', error)
 *   }
 * }
 * ```
 */
export function isToolSystemError(error: unknown): error is ToolSystemError {
  return error instanceof ToolSystemError
}

/**
 * Type guard to check if error is a specific tool error type
 *
 * @param error - Error to check
 * @param errorClass - Error class to check against
 * @returns true if error is instance of errorClass
 *
 * @example
 * ```typescript
 * if (isToolError(error, ToolValidationError)) {
 *   console.log('Validation failed:', error.details)
 * }
 * ```
 */
export function isToolError<T extends ToolSystemError>(
  error: unknown,
  errorClass: new (...args: any[]) => T
): error is T {
  return error instanceof errorClass
}

/**
 * Convert any error to a ToolSystemError
 *
 * @param error - Error to convert
 * @param defaultCode - Default error code if not a ToolSystemError
 * @returns ToolSystemError
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation
 * } catch (err) {
 *   throw toToolSystemError(err, ToolErrorCode.EXECUTION_FAILED)
 * }
 * ```
 */
export function toToolSystemError(
  error: unknown,
  defaultCode: ToolErrorCode = ToolErrorCode.UNKNOWN
): ToolSystemError {
  if (error instanceof ToolSystemError) {
    return error
  }

  if (error instanceof Error) {
    return new ToolSystemError(error.message, defaultCode, {
      cause: error,
    })
  }

  return new ToolSystemError(
    String(error),
    defaultCode
  )
}
