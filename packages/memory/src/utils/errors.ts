/**
 * Clarity Memory - Error Utilities
 * 
 * Error handling utilities and helpers.
 */

import { MemoryError, MemoryErrorCodes } from '../types'

/**
 * Create a store error
 */
export function createStoreError(message: string, cause?: Error): MemoryError {
  return new MemoryError(message, MemoryErrorCodes.STORE_ERROR, cause)
}

/**
 * Create an embedding error
 */
export function createEmbeddingError(message: string, cause?: Error): MemoryError {
  return new MemoryError(message, MemoryErrorCodes.EMBEDDING_ERROR, cause)
}

/**
 * Create a token budget error
 */
export function createTokenBudgetError(
  requested: number,
  available: number
): MemoryError {
  return new MemoryError(
    `Token budget exceeded: requested ${requested}, available ${available}`,
    MemoryErrorCodes.TOKEN_BUDGET_EXCEEDED
  )
}

/**
 * Create an invalid config error
 */
export function createInvalidConfigError(message: string): MemoryError {
  return new MemoryError(message, MemoryErrorCodes.INVALID_CONFIG)
}

/**
 * Create a memory not found error
 */
export function createMemoryNotFoundError(id: string): MemoryError {
  return new MemoryError(
    `Memory not found: ${id}`,
    MemoryErrorCodes.MEMORY_NOT_FOUND
  )
}

/**
 * Check if error is a MemoryError
 */
export function isMemoryError(error: unknown): error is MemoryError {
  return error instanceof MemoryError
}

/**
 * Get error message safely
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error'
}

/**
 * Get error code safely
 */
export function getErrorCode(error: unknown): string | undefined {
  if (isMemoryError(error)) {
    return error.code
  }
  return undefined
}
