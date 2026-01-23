/**
 * Memory Service Error Classes
 * Provides typed errors with error codes for better error handling
 */

/**
 * Error codes for memory service operations
 */
export enum MemoryErrorCode {
  // Configuration errors (1000-1099)
  INVALID_CONFIG = 'MEMORY_1000',
  MISSING_REQUIRED_CONFIG = 'MEMORY_1001',
  INVALID_EMBEDDING_PROVIDER = 'MEMORY_1002',
  INVALID_VECTOR_STORE = 'MEMORY_1003',

  // Consent & privacy errors (1100-1199)
  CONSENT_REQUIRED = 'MEMORY_1100',
  CONSENT_WITHDRAWN = 'MEMORY_1101',
  MISSING_USER_ID = 'MEMORY_1102',
  PRIVACY_VIOLATION = 'MEMORY_1103',

  // Memory operation errors (1200-1299)
  MEMORY_NOT_FOUND = 'MEMORY_1200',
  MEMORY_TOO_LARGE = 'MEMORY_1201',
  INVALID_MEMORY_TYPE = 'MEMORY_1202',
  INVALID_MEMORY_SCOPE = 'MEMORY_1203',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_1204',
  TOKEN_LIMIT_EXCEEDED = 'MEMORY_1205',
  DUPLICATE_MEMORY = 'MEMORY_1206',

  // Storage errors (1300-1399)
  STORAGE_ERROR = 'MEMORY_1300',
  STORAGE_NOT_INITIALIZED = 'MEMORY_1301',
  STORAGE_FULL = 'MEMORY_1302',
  STORAGE_CORRUPTED = 'MEMORY_1303',

  // Embedding errors (1400-1499)
  EMBEDDING_FAILED = 'MEMORY_1400',
  EMBEDDING_PROVIDER_ERROR = 'MEMORY_1401',
  EMBEDDING_TIMEOUT = 'MEMORY_1402',

  // Query errors (1500-1599)
  INVALID_QUERY = 'MEMORY_1500',
  QUERY_TIMEOUT = 'MEMORY_1501',
  QUERY_TOO_COMPLEX = 'MEMORY_1502',

  // Tool integration errors (1600-1699)
  TOOL_CAPTURE_FAILED = 'MEMORY_1600',
  TOOL_NOT_FOUND = 'MEMORY_1601',
  TOOL_BUDGET_EXCEEDED = 'MEMORY_1602',

  // General errors (1900-1999)
  UNKNOWN_ERROR = 'MEMORY_1900',
  OPERATION_ABORTED = 'MEMORY_1901',
  VALIDATION_ERROR = 'MEMORY_1902',
  NOT_IMPLEMENTED = 'MEMORY_1903',
}

/**
 * Base error class for all memory service errors
 */
export class MemoryError extends Error {
  public readonly code: MemoryErrorCode
  public readonly details?: Record<string, any>
  public readonly timestamp: Date

  constructor(
    message: string,
    code: MemoryErrorCode,
    details?: Record<string, any>
  ) {
    super(message)
    this.name = 'MemoryError'
    this.code = code
    this.details = details
    this.timestamp = new Date()

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    }
  }
}

/**
 * Configuration errors
 */
export class MemoryConfigError extends MemoryError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, MemoryErrorCode.INVALID_CONFIG, details)
    this.name = 'MemoryConfigError'
  }
}

/**
 * Consent and privacy errors
 */
export class MemoryConsentError extends MemoryError {
  public readonly userId?: string
  public readonly purpose?: string

  constructor(
    message: string,
    code: MemoryErrorCode = MemoryErrorCode.CONSENT_REQUIRED,
    details?: Record<string, any> & { userId?: string; purpose?: string }
  ) {
    super(message, code, details)
    this.name = 'MemoryConsentError'
    this.userId = details?.userId
    this.purpose = details?.purpose
  }
}

/**
 * Memory operation errors (not found, too large, etc.)
 */
export class MemoryOperationError extends MemoryError {
  public readonly memoryId?: string
  public readonly operation?: string

  constructor(
    message: string,
    code: MemoryErrorCode,
    details?: Record<string, any> & { memoryId?: string; operation?: string }
  ) {
    super(message, code, details)
    this.name = 'MemoryOperationError'
    this.memoryId = details?.memoryId
    this.operation = details?.operation
  }
}

/**
 * Storage errors
 */
export class MemoryStorageError extends MemoryError {
  public readonly storageType?: string

  constructor(
    message: string,
    code: MemoryErrorCode = MemoryErrorCode.STORAGE_ERROR,
    details?: Record<string, any> & { storageType?: string }
  ) {
    super(message, code, details)
    this.name = 'MemoryStorageError'
    this.storageType = details?.storageType
  }
}

/**
 * Embedding provider errors
 */
export class MemoryEmbeddingError extends MemoryError {
  public readonly provider?: string
  public readonly text?: string

  constructor(
    message: string,
    code: MemoryErrorCode = MemoryErrorCode.EMBEDDING_FAILED,
    details?: Record<string, any> & { provider?: string; text?: string }
  ) {
    super(message, code, details)
    this.name = 'MemoryEmbeddingError'
    this.provider = details?.provider
    this.text = details?.text
  }
}

/**
 * Query errors
 */
export class MemoryQueryError extends MemoryError {
  public readonly query?: string

  constructor(
    message: string,
    code: MemoryErrorCode = MemoryErrorCode.INVALID_QUERY,
    details?: Record<string, any> & { query?: string }
  ) {
    super(message, code, details)
    this.name = 'MemoryQueryError'
    this.query = details?.query
  }
}

/**
 * Tool integration errors
 */
export class MemoryToolError extends MemoryError {
  public readonly toolName?: string

  constructor(
    message: string,
    code: MemoryErrorCode = MemoryErrorCode.TOOL_CAPTURE_FAILED,
    details?: Record<string, any> & { toolName?: string }
  ) {
    super(message, code, details)
    this.name = 'MemoryToolError'
    this.toolName = details?.toolName
  }
}

/**
 * Validation errors
 */
export class MemoryValidationError extends MemoryError {
  public readonly field?: string
  public readonly value?: any

  constructor(
    message: string,
    details?: Record<string, any> & { field?: string; value?: any }
  ) {
    super(message, MemoryErrorCode.VALIDATION_ERROR, details)
    this.name = 'MemoryValidationError'
    this.field = details?.field
    this.value = details?.value
  }
}

/**
 * Type guard to check if error is a MemoryError
 */
export function isMemoryError(error: unknown): error is MemoryError {
  return error instanceof MemoryError
}

/**
 * Type guard to check if error is a specific memory error type
 */
export function isMemoryErrorType<T extends MemoryError>(
  error: unknown,
  errorClass: new (...args: any[]) => T
): error is T {
  return error instanceof errorClass
}

/**
 * Format error for user display (hides sensitive details)
 */
export function formatErrorForUser(error: unknown): string {
  if (isMemoryError(error)) {
    return `${error.name}: ${error.message} (Code: ${error.code})`
  }
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

/**
 * Extract error code from any error
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isMemoryError(error)) {
    return error.code
  }
  return undefined
}
