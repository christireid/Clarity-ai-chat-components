/**
 * Model Adapter Error Types
 *
 * Categorized error classes for intelligent error handling, retry logic,
 * and circuit breaker patterns.
 *
 * Error Categories:
 * - Authentication: Invalid or missing API keys (don't retry)
 * - RateLimit: Rate limit exceeded (retry with backoff)
 * - InvalidRequest: Bad request parameters (don't retry)
 * - ServerError: Provider server errors (retry)
 * - NetworkError: Network connectivity issues (retry)
 * - ContentFilter: Content policy violations (don't retry)
 * - Timeout: Request timeout (retry with backoff)
 */

import type { RateLimitInfo } from '../utils/api/rate-limit-headers'

/**
 * Error codes for programmatic handling
 */
export enum AdapterErrorCode {
  // Authentication errors (don't retry)
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_KEY_INVALID = 'API_KEY_INVALID',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Rate limit errors (retry with backoff)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // Invalid request errors (don't retry)
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_MODEL = 'INVALID_MODEL',
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  TOKEN_LIMIT_EXCEEDED = 'TOKEN_LIMIT_EXCEEDED',

  // Server errors (retry)
  SERVER_ERROR = 'SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  GATEWAY_TIMEOUT = 'GATEWAY_TIMEOUT',

  // Network errors (retry)
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Content errors (don't retry)
  CONTENT_FILTER = 'CONTENT_FILTER',
  CONTENT_POLICY_VIOLATION = 'CONTENT_POLICY_VIOLATION',

  // Unknown errors
  UNKNOWN = 'UNKNOWN',
}

/**
 * Base adapter error with categorization
 */
export class AdapterError extends Error {
  public readonly code: AdapterErrorCode
  public readonly isRetryable: boolean
  public readonly statusCode?: number
  public readonly provider?: string
  public readonly timestamp: number

  constructor(
    message: string,
    code: AdapterErrorCode,
    options?: {
      isRetryable?: boolean
      statusCode?: number
      provider?: string
      cause?: Error
    }
  ) {
    super(message)
    this.name = 'AdapterError'
    this.code = code
    this.isRetryable = options?.isRetryable ?? this.isCodeRetryable(code)
    this.statusCode = options?.statusCode
    this.provider = options?.provider
    this.timestamp = Date.now()

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    // Include cause if provided
    if (options?.cause) {
      this.cause = options.cause
    }
  }

  /**
   * Determine if an error code is retryable by default
   */
  private isCodeRetryable(code: AdapterErrorCode): boolean {
    const retryableCodes = [
      AdapterErrorCode.RATE_LIMIT_EXCEEDED,
      AdapterErrorCode.QUOTA_EXCEEDED,
      AdapterErrorCode.SERVER_ERROR,
      AdapterErrorCode.SERVICE_UNAVAILABLE,
      AdapterErrorCode.GATEWAY_TIMEOUT,
      AdapterErrorCode.NETWORK_ERROR,
      AdapterErrorCode.CONNECTION_ERROR,
      AdapterErrorCode.TIMEOUT,
    ]
    return retryableCodes.includes(code)
  }

  /**
   * Get recommended retry delay in milliseconds
   */
  getRetryDelay(attemptNumber: number): number {
    if (!this.isRetryable) return 0

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s
    const baseDelay = 1000
    const maxDelay = 32000
    const exponentialDelay = Math.min(
      baseDelay * Math.pow(2, attemptNumber - 1),
      maxDelay
    )

    // Add jitter (±20%)
    const jitter = exponentialDelay * 0.2 * (Math.random() * 2 - 1)
    return Math.round(exponentialDelay + jitter)
  }
}

/**
 * Authentication error (don't retry)
 */
export class AuthenticationError extends AdapterError {
  constructor(
    message: string,
    options?: {
      statusCode?: number
      provider?: string
      cause?: Error
      code?: AdapterErrorCode
    }
  ) {
    super(message, options?.code ?? AdapterErrorCode.UNAUTHORIZED, {
      ...options,
      isRetryable: false,
    })
    this.name = 'AuthenticationError'
  }
}

/**
 * API key missing error
 */
export class APIKeyMissingError extends AuthenticationError {
  constructor(provider: string) {
    super(`${provider} API key is required but not provided`, {
      provider,
      code: AdapterErrorCode.API_KEY_MISSING,
    })
    this.name = 'APIKeyMissingError'
  }
}

/**
 * Rate limit error (retry with backoff)
 */
export class RateLimitError extends AdapterError {
  public readonly rateLimitInfo?: RateLimitInfo

  constructor(
    message: string,
    rateLimitInfo?: RateLimitInfo,
    options?: {
      statusCode?: number
      provider?: string
      cause?: Error
    }
  ) {
    super(message, AdapterErrorCode.RATE_LIMIT_EXCEEDED, {
      ...options,
      isRetryable: true,
    })
    this.name = 'RateLimitError'
    this.rateLimitInfo = rateLimitInfo
  }

  /**
   * Get retry delay from rate limit headers or exponential backoff
   */
  override getRetryDelay(attemptNumber: number): number {
    // Use Retry-After header if available
    if (this.rateLimitInfo?.retryAfter) {
      return this.rateLimitInfo.retryAfter * 1000
    }

    // Calculate from reset time if available
    if (this.rateLimitInfo?.reset) {
      const delay = Math.max(0, this.rateLimitInfo.reset - Date.now())
      if (delay > 0 && delay < 60000) {
        // Only use reset time if < 60s
        return delay
      }
    }

    // Fall back to exponential backoff
    return super.getRetryDelay(attemptNumber)
  }
}

/**
 * Invalid request error (don't retry)
 */
export class InvalidRequestError extends AdapterError {
  public readonly details?: Record<string, unknown>

  constructor(
    message: string,
    options?: {
      statusCode?: number
      provider?: string
      details?: Record<string, unknown>
      cause?: Error
    }
  ) {
    super(message, AdapterErrorCode.INVALID_REQUEST, {
      ...options,
      isRetryable: false,
    })
    this.name = 'InvalidRequestError'
    this.details = options?.details
  }
}

/**
 * Server error (retry)
 */
export class ServerError extends AdapterError {
  constructor(
    message: string,
    options?: {
      statusCode?: number
      provider?: string
      cause?: Error
    }
  ) {
    super(message, AdapterErrorCode.SERVER_ERROR, {
      ...options,
      isRetryable: true,
    })
    this.name = 'ServerError'
  }
}

/**
 * Network error (retry)
 */
export class NetworkError extends AdapterError {
  constructor(
    message: string,
    options?: {
      provider?: string
      cause?: Error
    }
  ) {
    super(message, AdapterErrorCode.NETWORK_ERROR, {
      ...options,
      isRetryable: true,
    })
    this.name = 'NetworkError'
  }
}

/**
 * Timeout error (retry)
 */
export class TimeoutError extends AdapterError {
  public readonly timeoutMs: number

  constructor(
    message: string,
    timeoutMs: number,
    options?: {
      provider?: string
      cause?: Error
    }
  ) {
    super(message, AdapterErrorCode.TIMEOUT, {
      ...options,
      isRetryable: true,
    })
    this.name = 'TimeoutError'
    this.timeoutMs = timeoutMs
  }
}

/**
 * Content filter error (don't retry)
 */
export class ContentFilterError extends AdapterError {
  public readonly filterReason?: string

  constructor(
    message: string,
    filterReason?: string,
    options?: {
      statusCode?: number
      provider?: string
      cause?: Error
    }
  ) {
    super(message, AdapterErrorCode.CONTENT_FILTER, {
      ...options,
      isRetryable: false,
    })
    this.name = 'ContentFilterError'
    this.filterReason = filterReason
  }
}

/**
 * Parse HTTP error response into appropriate error type
 */
export function parseHttpError(
  response: Response,
  provider: string,
  errorData?: unknown
): AdapterError {
  const status = response.status
  const statusText = response.statusText

  // Extract error message from response data
  let message = `${provider} API error: ${statusText}`
  if (errorData && typeof errorData === 'object') {
    const error = errorData as Record<string, unknown>
    if (error.error && typeof error.error === 'object') {
      const errorObj = error.error as Record<string, unknown>
      if (typeof errorObj.message === 'string') {
        message = `${provider} API error: ${errorObj.message}`
      }
    } else if (typeof error.message === 'string') {
      message = `${provider} API error: ${error.message}`
    }
  }

  // Categorize by status code
  if (status === 401 || status === 403) {
    return new AuthenticationError(message, {
      statusCode: status,
      provider,
    })
  }

  if (status === 429) {
    return new RateLimitError(
      message,
      undefined, // Rate limit info should be parsed separately
      {
        statusCode: status,
        provider,
      }
    )
  }

  if (status === 400 || status === 422) {
    return new InvalidRequestError(message, {
      statusCode: status,
      provider,
      details: errorData as Record<string, unknown>,
    })
  }

  if (status >= 500) {
    return new ServerError(message, {
      statusCode: status,
      provider,
    })
  }

  // Unknown error
  return new AdapterError(message, AdapterErrorCode.UNKNOWN, {
    statusCode: status,
    provider,
    isRetryable: false,
  })
}

/**
 * Parse network/fetch error into appropriate error type
 */
export function parseNetworkError(
  error: Error,
  provider: string
): AdapterError {
  const message = error.message.toLowerCase()

  if (
    message.includes('timeout') ||
    message.includes('timed out') ||
    error.name === 'TimeoutError'
  ) {
    return new TimeoutError(
      `${provider} request timeout: ${error.message}`,
      0,
      {
        provider,
        cause: error,
      }
    )
  }

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('econnrefused') ||
    message.includes('enotfound')
  ) {
    return new NetworkError(`${provider} network error: ${error.message}`, {
      provider,
      cause: error,
    })
  }

  // Unknown error
  return new AdapterError(
    `${provider} error: ${error.message}`,
    AdapterErrorCode.UNKNOWN,
    {
      provider,
      isRetryable: false,
      cause: error,
    }
  )
}

/**
 * Type guard to check if error is an AdapterError
 */
export function isAdapterError(error: unknown): error is AdapterError {
  return error instanceof AdapterError
}

/**
 * Type guard to check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (isAdapterError(error)) {
    return error.isRetryable
  }
  return false
}

/**
 * Get retry delay for any error
 */
export function getErrorRetryDelay(
  error: unknown,
  attemptNumber: number
): number {
  if (isAdapterError(error)) {
    return error.getRetryDelay(attemptNumber)
  }
  return 0
}
