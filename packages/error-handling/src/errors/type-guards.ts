/**
 * Type guards for all Clarity Chat error types
 * Use these for type-safe error handling in catch blocks
 *
 * @example
 * ```typescript
 * import { isApiError, isStreamingError, isProviderError } from '@clarity-chat/error-handling'
 *
 * try {
 *   await sendMessage()
 * } catch (error) {
 *   if (isApiError(error)) {
 *     // error is typed as ApiError
 *     console.log(error.statusCode)
 *   } else if (isStreamingError(error)) {
 *     // error is typed as StreamingError
 *     console.log(error.transport)
 *   } else if (isProviderError(error)) {
 *     // error is typed as ProviderError
 *     console.log(error.provider)
 *   }
 * }
 * ```
 */

import { ClarityError } from './base-error'
import { ApiError } from './api-error'
import { StreamingError } from './streaming-error'
import { ProviderError } from './provider-error'

// Re-export individual type guards
export { isClarityError } from './base-error'
export { isApiError } from './api-error'
export { isStreamingError } from './streaming-error'
export { isProviderError } from './provider-error'
export { isValidationError } from './validation-error'

/**
 * Check if error is a network-related error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.code === 'API_NETWORK_ERROR' || error.code === 'API_TIMEOUT'
  }
  if (error instanceof StreamingError) {
    return (
      error.code === 'STREAM_CONNECTION_FAILED' ||
      error.code === 'STREAM_CONNECTION_LOST' ||
      error.code === 'STREAM_TIMEOUT'
    )
  }
  return false
}

/**
 * Check if error is a rate limit error from any source
 */
export function isRateLimitError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.code === 'API_RATE_LIMITED'
  }
  if (error instanceof ProviderError) {
    return error.code === 'PROVIDER_RATE_LIMIT'
  }
  return false
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.code === 'API_UNAUTHORIZED' || error.code === 'API_FORBIDDEN'
  }
  if (error instanceof ProviderError) {
    return error.code === 'PROVIDER_INVALID_API_KEY'
  }
  return false
}

/**
 * Check if error is recoverable (can be retried)
 */
export function isRecoverableError(error: unknown): boolean {
  if (error instanceof ClarityError) {
    return error.recoverable
  }
  return false
}

/**
 * Check if error has retry-after information
 */
export function hasRetryAfter(
  error: unknown
): error is ProviderError & { retryAfter: number } {
  return error instanceof ProviderError && typeof error.retryAfter === 'number'
}

/**
 * Check if error has partial content that can be preserved
 */
export function hasPartialContent(
  error: unknown
): error is StreamingError & { partialContent: string } {
  return error instanceof StreamingError && error.hasPartialContent
}

/**
 * Get the HTTP status code from any error type
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof ClarityError) {
    return error.statusCode
  }
  return 500
}

/**
 * Get the error code from any error type
 */
export function getErrorCode(error: unknown): string {
  if (error instanceof ClarityError) {
    return error.code
  }
  if (error instanceof Error) {
    return 'UNKNOWN_ERROR'
  }
  return 'UNKNOWN_ERROR'
}

/**
 * Get a user-friendly message from any error
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof ClarityError) {
    return error.userMessage
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred.'
}

/**
 * Normalize any error to a ClarityError-compatible shape
 */
export function normalizeError(error: unknown): {
  name: string
  code: string
  message: string
  statusCode: number
  recoverable: boolean
  userMessage: string
} {
  if (error instanceof ClarityError) {
    return {
      name: error.name,
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      recoverable: error.recoverable,
      userMessage: error.userMessage,
    }
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      code: 'UNKNOWN_ERROR',
      message: error.message,
      statusCode: 500,
      recoverable: false,
      userMessage: 'An unexpected error occurred.',
    }
  }

  return {
    name: 'Error',
    code: 'UNKNOWN_ERROR',
    message: String(error),
    statusCode: 500,
    recoverable: false,
    userMessage: 'An unexpected error occurred.',
  }
}
