/**
 * Unified error handling utilities
 * 
 * Provides consistent error classification, formatting, and handling
 * across all Clarity Chat APIs.
 */

/**
 * Error type classification
 */
export type ErrorType =
  | 'network'
  | 'ratelimit'
  | 'server'
  | 'auth'
  | 'validation'
  | 'memory'
  | 'agent'
  | 'unknown'

/**
 * Standardized error information
 */
export interface ClarityError {
  /** Error message */
  message: string
  /** Error type classification */
  type: ErrorType
  /** Original error (if available) */
  original?: Error
  /** HTTP status code (if available) */
  statusCode?: number
  /** Retryable flag */
  retryable: boolean
  /** Suggested retry delay in milliseconds */
  retryDelay?: number
}

/**
 * Classify error type from error message or response
 */
export function classifyError(error: Error | Response | unknown): ErrorType {
  if (error instanceof Response) {
    if (error.status === 429) return 'ratelimit'
    if (error.status >= 500) return 'server'
    if (error.status === 401 || error.status === 403) return 'auth'
    if (error.status >= 400) return 'validation'
  }

  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase()

  if (
    message.includes('memory') ||
    message.includes('vector') ||
    message.includes('embedding')
  ) {
    return 'memory'
  }

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('timeout')
  ) {
    return 'network'
  }

  if (
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    message.includes('429')
  ) {
    return 'ratelimit'
  }

  if (
    message.includes('500') ||
    message.includes('502') ||
    message.includes('503') ||
    message.includes('504')
  ) {
    return 'server'
  }

  if (
    message.includes('401') ||
    message.includes('403') ||
    message.includes('unauthorized') ||
    message.includes('forbidden')
  ) {
    return 'auth'
  }

  if (
    message.includes('agent') ||
    message.includes('tool') ||
    message.includes('execution')
  ) {
    return 'agent'
  }

  return 'unknown'
}

/**
 * Normalize error to ClarityError format
 */
export function normalizeError(error: Error | Response | unknown): ClarityError {
  if (error instanceof Response) {
    const type = classifyError(error)
    return {
      message: `HTTP ${error.status}: ${error.statusText}`,
      type,
      statusCode: error.status,
      retryable: error.status >= 500 || error.status === 429,
      retryDelay: error.status === 429 ? 60000 : error.status >= 500 ? 2000 : undefined,
    }
  }

  if (error instanceof Error) {
    const type = classifyError(error)
    return {
      message: error.message,
      type,
      original: error,
      retryable: type === 'network' || type === 'server' || type === 'ratelimit',
      retryDelay:
        type === 'ratelimit' ? 60000 : type === 'network' || type === 'server' ? 2000 : undefined,
    }
  }

  return {
    message: String(error),
    type: 'unknown',
    retryable: false,
  }
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error | Response | unknown): boolean {
  return normalizeError(error).retryable
}

/**
 * Get suggested retry delay for error
 */
export function getRetryDelay(error: Error | Response | unknown): number {
  const normalized = normalizeError(error)
  return normalized.retryDelay || 1000
}

/**
 * Format error for user display
 */
export function formatErrorForUser(error: ClarityError): string {
  switch (error.type) {
    case 'network':
      return 'Connection error. Please check your internet connection and try again.'
    case 'ratelimit':
      return 'Too many requests. Please wait a moment and try again.'
    case 'server':
      return 'Server error. Please try again in a moment.'
    case 'auth':
      return 'Authentication error. Please check your credentials.'
    case 'validation':
      return 'Invalid request. Please check your input and try again.'
    case 'memory':
      return 'Memory operation failed. Please try again.'
    case 'agent':
      return 'Agent execution failed. Please try again.'
    default:
      return error.message || 'An unexpected error occurred.'
  }
}
