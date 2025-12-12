/**
 * Shared Error Handling Utilities
 *
 * Provides consistent error handling patterns across all Clarity Chat examples.
 * Can be used standalone or with React components.
 */

// ============================================================================
// Error Types
// ============================================================================

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical'

export interface ChatError {
  code: string
  message: string
  severity: ErrorSeverity
  timestamp: number
  details?: Record<string, unknown>
  recoverable: boolean
  retryable: boolean
}

// Standard error codes
export const ERROR_CODES = {
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  RATE_LIMITED: 'RATE_LIMITED',
  // API errors
  API_ERROR: 'API_ERROR',
  INVALID_API_KEY: 'INVALID_API_KEY',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  MODEL_UNAVAILABLE: 'MODEL_UNAVAILABLE',
  // Input errors
  INVALID_INPUT: 'INVALID_INPUT',
  INPUT_TOO_LONG: 'INPUT_TOO_LONG',
  EMPTY_MESSAGE: 'EMPTY_MESSAGE',
  // Stream errors
  STREAM_ERROR: 'STREAM_ERROR',
  STREAM_ABORTED: 'STREAM_ABORTED',
  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

// ============================================================================
// Error Classification
// ============================================================================

export function classifyError(error: unknown): ChatError {
  const timestamp = Date.now()

  // Handle abort errors
  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      code: ERROR_CODES.STREAM_ABORTED,
      message: 'Request was cancelled',
      severity: 'info',
      timestamp,
      recoverable: true,
      retryable: false,
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return {
        code: ERROR_CODES.NETWORK_ERROR,
        message: 'Unable to connect. Please check your internet connection.',
        severity: 'error',
        timestamp,
        recoverable: true,
        retryable: true,
      }
    }

    // Timeout
    if (message.includes('timeout')) {
      return {
        code: ERROR_CODES.TIMEOUT,
        message: 'Request timed out. Please try again.',
        severity: 'warning',
        timestamp,
        recoverable: true,
        retryable: true,
      }
    }

    // Rate limiting
    if (message.includes('rate') || message.includes('429')) {
      return {
        code: ERROR_CODES.RATE_LIMITED,
        message: 'Too many requests. Please wait a moment.',
        severity: 'warning',
        timestamp,
        details: { waitTime: 60 },
        recoverable: true,
        retryable: true,
      }
    }

    // API key issues
    if (message.includes('api key') || message.includes('401')) {
      return {
        code: ERROR_CODES.INVALID_API_KEY,
        message: 'Invalid API key. Please check your configuration.',
        severity: 'critical',
        timestamp,
        recoverable: false,
        retryable: false,
      }
    }

    // Quota exceeded
    if (message.includes('quota') || message.includes('billing')) {
      return {
        code: ERROR_CODES.QUOTA_EXCEEDED,
        message: 'API quota exceeded. Please check your billing.',
        severity: 'critical',
        timestamp,
        recoverable: false,
        retryable: false,
      }
    }

    // Model unavailable
    if (message.includes('model') && message.includes('not found')) {
      return {
        code: ERROR_CODES.MODEL_UNAVAILABLE,
        message: 'The requested AI model is unavailable.',
        severity: 'error',
        timestamp,
        recoverable: false,
        retryable: false,
      }
    }

    // Input too long
    if (message.includes('too long') || message.includes('context length')) {
      return {
        code: ERROR_CODES.INPUT_TOO_LONG,
        message: 'Your message is too long. Please shorten it.',
        severity: 'warning',
        timestamp,
        recoverable: true,
        retryable: false,
      }
    }

    // Generic API error
    if (message.includes('api') || message.includes('500')) {
      return {
        code: ERROR_CODES.API_ERROR,
        message: 'An API error occurred. Please try again.',
        severity: 'error',
        timestamp,
        recoverable: true,
        retryable: true,
      }
    }

    // Unknown error with original message
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred.',
      severity: 'error',
      timestamp,
      details: { originalError: error.name },
      recoverable: true,
      retryable: true,
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: error,
      severity: 'error',
      timestamp,
      recoverable: true,
      retryable: true,
    }
  }

  // Unknown error type
  return {
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: 'An unexpected error occurred.',
    severity: 'error',
    timestamp,
    recoverable: true,
    retryable: true,
  }
}

// ============================================================================
// Error Recovery Strategies
// ============================================================================

export interface RetryConfig {
  maxAttempts: number
  baseDelay: number
  maxDelay: number
  backoffFactor: number
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
}

export function calculateRetryDelay(
  attempt: number,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): number {
  const delay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1)
  // Add jitter (±20%)
  const jitter = delay * (0.8 + Math.random() * 0.4)
  return Math.min(jitter, config.maxDelay)
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: unknown

  for (let attempt = 1; attempt <= fullConfig.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      const chatError = classifyError(error)

      // Don't retry non-retryable errors
      if (!chatError.retryable) {
        throw error
      }

      // Don't retry on last attempt
      if (attempt === fullConfig.maxAttempts) {
        throw error
      }

      // Wait before retrying
      const delay = calculateRetryDelay(attempt, fullConfig)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

// ============================================================================
// Error Formatting
// ============================================================================

export function formatErrorForUser(error: ChatError): string {
  switch (error.code) {
    case ERROR_CODES.NETWORK_ERROR:
      return 'Connection error. Please check your internet and try again.'
    case ERROR_CODES.TIMEOUT:
      return 'The request took too long. Please try again.'
    case ERROR_CODES.RATE_LIMITED:
      return 'Slow down! Too many requests. Please wait a moment.'
    case ERROR_CODES.INVALID_API_KEY:
      return 'Authentication failed. Please contact support.'
    case ERROR_CODES.QUOTA_EXCEEDED:
      return 'Service temporarily unavailable. Please try again later.'
    case ERROR_CODES.MODEL_UNAVAILABLE:
      return 'The AI model is currently unavailable. Please try a different model.'
    case ERROR_CODES.INPUT_TOO_LONG:
      return 'Your message is too long. Please shorten it and try again.'
    case ERROR_CODES.STREAM_ABORTED:
      return 'Message cancelled.'
    case ERROR_CODES.STREAM_ERROR:
      return 'Error receiving response. Please try again.'
    default:
      return error.message || 'Something went wrong. Please try again.'
  }
}

export function formatErrorForLog(error: ChatError): string {
  return JSON.stringify(
    {
      ...error,
      timestamp: new Date(error.timestamp).toISOString(),
    },
    null,
    2
  )
}

// ============================================================================
// Error Reporting
// ============================================================================

export interface ErrorReport {
  error: ChatError
  context?: {
    url?: string
    userAgent?: string
    sessionId?: string
  }
  stack?: string
}

export function createErrorReport(
  error: unknown,
  context?: ErrorReport['context']
): ErrorReport {
  const chatError = classifyError(error)
  const report: ErrorReport = {
    error: chatError,
    context,
  }

  if (error instanceof Error && error.stack) {
    report.stack = error.stack
  }

  return report
}

// ============================================================================
// Error Boundary Helpers
// ============================================================================

export function shouldShowRetryButton(error: ChatError): boolean {
  return error.retryable && error.recoverable
}

export function getErrorIcon(severity: ErrorSeverity): string {
  switch (severity) {
    case 'info':
      return 'info'
    case 'warning':
      return 'warning'
    case 'error':
      return 'error'
    case 'critical':
      return 'critical'
    default:
      return 'error'
  }
}

export function getErrorColor(severity: ErrorSeverity): string {
  switch (severity) {
    case 'info':
      return 'text-blue-600 bg-blue-50 border-blue-200'
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'error':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'critical':
      return 'text-red-700 bg-red-100 border-red-300'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}
