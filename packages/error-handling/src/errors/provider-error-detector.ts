/**
 * Provider error detection with confidence scoring
 *
 * Provides robust error parsing with confidence levels to indicate
 * how certain we are about the error classification.
 */

import { ProviderErrorCode } from './error-codes'
import type { AIProvider } from './provider-error'

export type DetectionConfidence = 'high' | 'medium' | 'low'

export interface DetectionResult {
  code: ProviderErrorCode
  confidence: DetectionConfidence
  message: string
  solution?: string
  retryAfter?: number
  rawError?: unknown
}

/**
 * Error pattern matcher
 */
interface ErrorPattern {
  /** Pattern name for debugging */
  name: string
  /** Match function */
  match: (body: unknown, statusCode: number) => boolean
  /** Error code to assign */
  code: ProviderErrorCode
  /** Confidence level of this match */
  confidence: DetectionConfidence
  /** Solution message */
  solution?: string
  /** Extract retry-after value */
  extractRetryAfter?: (body: unknown) => number | undefined
  /** Extract message */
  extractMessage?: (body: unknown) => string | undefined
}

/**
 * Safely get nested property from unknown object
 */
function getNestedValue(obj: unknown, path: string): unknown {
  if (obj === null || obj === undefined) return undefined
  if (typeof obj !== 'object') return undefined

  const parts = path.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[part]
  }

  return current
}

/**
 * Check if value matches any of the given patterns (case-insensitive)
 */
function matchesAny(value: unknown, patterns: string[]): boolean {
  if (typeof value !== 'string') return false
  const lower = value.toLowerCase()
  return patterns.some((p) => lower.includes(p.toLowerCase()))
}

/**
 * OpenAI/Azure error patterns
 */
const openAIPatterns: ErrorPattern[] = [
  {
    name: 'rate_limit_by_type',
    match: (body, statusCode) =>
      statusCode === 429 ||
      getNestedValue(body, 'error.type') === 'rate_limit_exceeded',
    code: ProviderErrorCode.RATE_LIMIT,
    confidence: 'high',
    solution: 'Please wait a moment before trying again.',
    extractRetryAfter: (body) =>
      typeof getNestedValue(body, 'retry_after') === 'number'
        ? (getNestedValue(body, 'retry_after') as number)
        : undefined,
  },
  {
    name: 'invalid_api_key',
    match: (body, statusCode) =>
      statusCode === 401 ||
      getNestedValue(body, 'error.code') === 'invalid_api_key',
    code: ProviderErrorCode.INVALID_API_KEY,
    confidence: 'high',
    solution: 'Please check your API key configuration.',
  },
  {
    name: 'quota_exceeded',
    match: (body, statusCode) =>
      statusCode === 403 ||
      matchesAny(getNestedValue(body, 'error.type'), ['insufficient_quota']),
    code: ProviderErrorCode.QUOTA_EXCEEDED,
    confidence: 'high',
    solution: 'You have exceeded your API quota. Please check your billing.',
  },
  {
    name: 'context_length_by_code',
    match: (body) =>
      getNestedValue(body, 'error.code') === 'context_length_exceeded',
    code: ProviderErrorCode.CONTEXT_LENGTH,
    confidence: 'high',
    solution: 'Your conversation is too long. Try starting a new chat.',
  },
  {
    name: 'context_length_by_message',
    match: (body) =>
      matchesAny(getNestedValue(body, 'error.message'), [
        'maximum context length',
        'token limit',
        'tokens exceeded',
      ]),
    code: ProviderErrorCode.CONTEXT_LENGTH,
    confidence: 'medium',
    solution: 'Your conversation is too long. Try starting a new chat.',
  },
  {
    name: 'content_filter',
    match: (body) =>
      getNestedValue(body, 'error.code') === 'content_filter' ||
      getNestedValue(body, 'error.type') === 'content_policy_violation',
    code: ProviderErrorCode.CONTENT_FILTER,
    confidence: 'high',
    solution: 'Please revise your message and try again.',
  },
  {
    name: 'model_not_found',
    match: (body, statusCode) =>
      statusCode === 404 ||
      getNestedValue(body, 'error.code') === 'model_not_found',
    code: ProviderErrorCode.MODEL_NOT_FOUND,
    confidence: 'high',
    solution: 'Please verify the model name and your API access.',
  },
  {
    name: 'service_unavailable',
    match: (_, statusCode) => statusCode >= 500,
    code: ProviderErrorCode.SERVICE_UNAVAILABLE,
    confidence: 'high',
    solution: 'The AI service is experiencing issues. Please try again later.',
  },
]

/**
 * Anthropic error patterns
 */
const anthropicPatterns: ErrorPattern[] = [
  {
    name: 'rate_limit',
    match: (body, statusCode) =>
      statusCode === 429 ||
      getNestedValue(body, 'error.type') === 'rate_limit_error' ||
      getNestedValue(body, 'type') === 'rate_limit_error',
    code: ProviderErrorCode.RATE_LIMIT,
    confidence: 'high',
    solution: 'Please wait a moment before trying again.',
    extractRetryAfter: (body) => {
      const ms = getNestedValue(body, 'retry_after_ms')
      return typeof ms === 'number' ? Math.ceil(ms / 1000) : undefined
    },
  },
  {
    name: 'authentication_error',
    match: (body, statusCode) =>
      statusCode === 401 ||
      getNestedValue(body, 'error.type') === 'authentication_error',
    code: ProviderErrorCode.INVALID_API_KEY,
    confidence: 'high',
    solution: 'Please check your API key configuration.',
  },
  {
    name: 'quota_by_message',
    match: (body) =>
      matchesAny(getNestedValue(body, 'error.message'), [
        'credit',
        'billing',
        'payment',
      ]),
    code: ProviderErrorCode.QUOTA_EXCEEDED,
    confidence: 'medium',
    solution: 'Please check your Anthropic billing and credits.',
  },
  {
    name: 'context_length',
    match: (body) =>
      matchesAny(getNestedValue(body, 'error.message'), [
        'too long',
        'too many token',
        'exceeds maximum',
      ]),
    code: ProviderErrorCode.CONTEXT_LENGTH,
    confidence: 'medium',
    solution: 'Your message is too long. Please shorten it.',
  },
  {
    name: 'content_filter',
    match: (body, statusCode) =>
      statusCode === 400 &&
      matchesAny(getNestedValue(body, 'error.message'), ['safety', 'harmful']),
    code: ProviderErrorCode.CONTENT_FILTER,
    confidence: 'medium',
    solution: 'Please revise your message and try again.',
  },
  {
    name: 'model_not_found',
    match: (_, statusCode) => statusCode === 404,
    code: ProviderErrorCode.MODEL_NOT_FOUND,
    confidence: 'high',
    solution: 'Please verify the model name and your API access.',
  },
  {
    name: 'overloaded',
    match: (body, statusCode) =>
      statusCode === 529 ||
      getNestedValue(body, 'error.type') === 'overloaded_error',
    code: ProviderErrorCode.SERVICE_UNAVAILABLE,
    confidence: 'high',
    solution: 'Anthropic is experiencing high demand. Please try again later.',
  },
  {
    name: 'service_unavailable',
    match: (_, statusCode) => statusCode >= 500,
    code: ProviderErrorCode.SERVICE_UNAVAILABLE,
    confidence: 'high',
    solution:
      'Anthropic service is experiencing issues. Please try again later.',
  },
]

/**
 * Google AI error patterns
 */
const googlePatterns: ErrorPattern[] = [
  {
    name: 'rate_limit',
    match: (body, statusCode) =>
      statusCode === 429 ||
      getNestedValue(body, 'error.status') === 'RESOURCE_EXHAUSTED',
    code: ProviderErrorCode.RATE_LIMIT,
    confidence: 'high',
    solution: 'Please wait a moment before trying again.',
    extractRetryAfter: (body) => {
      const details = getNestedValue(body, 'error.details') as
        | Array<{ retryDelay?: string }>
        | undefined
      if (details?.[0]?.retryDelay) {
        const match = details[0].retryDelay.match(/(\d+)s/)
        return match?.[1] ? parseInt(match[1], 10) : undefined
      }
      return undefined
    },
  },
  {
    name: 'authentication',
    match: (body, statusCode) =>
      statusCode === 401 ||
      statusCode === 403 ||
      getNestedValue(body, 'error.status') === 'UNAUTHENTICATED',
    code: ProviderErrorCode.INVALID_API_KEY,
    confidence: 'high',
    solution: 'Please check your Google AI API key configuration.',
  },
  {
    name: 'context_length',
    match: (body) =>
      getNestedValue(body, 'error.status') === 'INVALID_ARGUMENT' &&
      matchesAny(getNestedValue(body, 'error.message'), ['token', 'length']),
    code: ProviderErrorCode.CONTEXT_LENGTH,
    confidence: 'medium',
    solution: 'Your message is too long. Please shorten it.',
  },
  {
    name: 'content_filter',
    match: (body) =>
      getNestedValue(body, 'error.code') === 'SAFETY' ||
      matchesAny(getNestedValue(body, 'error.message'), ['safety', 'blocked']),
    code: ProviderErrorCode.CONTENT_FILTER,
    confidence: 'medium',
    solution: 'Please revise your message and try again.',
  },
  {
    name: 'model_not_found',
    match: (body, statusCode) =>
      statusCode === 404 ||
      getNestedValue(body, 'error.status') === 'NOT_FOUND',
    code: ProviderErrorCode.MODEL_NOT_FOUND,
    confidence: 'high',
    solution: 'Please verify the model name and your API access.',
  },
  {
    name: 'service_unavailable',
    match: (body, statusCode) =>
      statusCode >= 500 || getNestedValue(body, 'error.status') === 'INTERNAL',
    code: ProviderErrorCode.SERVICE_UNAVAILABLE,
    confidence: 'high',
    solution:
      'Google AI service is experiencing issues. Please try again later.',
  },
]

/**
 * Generic fallback patterns
 */
const genericPatterns: ErrorPattern[] = [
  {
    name: 'rate_limit',
    match: (_, statusCode) => statusCode === 429,
    code: ProviderErrorCode.RATE_LIMIT,
    confidence: 'high',
    solution: 'Please wait a moment before trying again.',
  },
  {
    name: 'auth_error',
    match: (_, statusCode) => statusCode === 401 || statusCode === 403,
    code: ProviderErrorCode.INVALID_API_KEY,
    confidence: 'medium',
    solution: 'Please check your API key configuration.',
  },
  {
    name: 'not_found',
    match: (_, statusCode) => statusCode === 404,
    code: ProviderErrorCode.MODEL_NOT_FOUND,
    confidence: 'medium',
    solution: 'Please verify the model name and your API access.',
  },
  {
    name: 'server_error',
    match: (_, statusCode) => statusCode >= 500,
    code: ProviderErrorCode.SERVICE_UNAVAILABLE,
    confidence: 'medium',
    solution: 'The AI service is experiencing issues. Please try again later.',
  },
]

/**
 * Get patterns for a specific provider
 */
function getPatternsForProvider(provider: AIProvider): ErrorPattern[] {
  switch (provider) {
    case 'openai':
    case 'azure':
      return openAIPatterns
    case 'anthropic':
      return anthropicPatterns
    case 'google':
      return googlePatterns
    default:
      return genericPatterns
  }
}

/**
 * Extract message from error body
 */
function extractMessage(body: unknown, provider: AIProvider): string {
  const paths = ['error.message', 'message', 'error.error.message']

  for (const path of paths) {
    const value = getNestedValue(body, path)
    if (typeof value === 'string' && value.length > 0) {
      return value
    }
  }

  return `${provider} API error`
}

/**
 * Detect error type with confidence scoring
 */
export function detectProviderError(
  provider: AIProvider,
  statusCode: number,
  errorBody: unknown
): DetectionResult {
  const patterns = getPatternsForProvider(provider)

  // Try patterns in order (they're ordered by specificity)
  for (const pattern of patterns) {
    if (pattern.match(errorBody, statusCode)) {
      const message =
        pattern.extractMessage?.(errorBody) ??
        extractMessage(errorBody, provider)
      const retryAfter = pattern.extractRetryAfter?.(errorBody)

      return {
        code: pattern.code,
        confidence: pattern.confidence,
        message,
        solution: pattern.solution,
        retryAfter,
        rawError: errorBody,
      }
    }
  }

  // No pattern matched - return generic error with low confidence
  return {
    code:
      provider === 'anthropic'
        ? ProviderErrorCode.ANTHROPIC_ERROR
        : provider === 'google'
          ? ProviderErrorCode.GOOGLE_ERROR
          : ProviderErrorCode.OPENAI_ERROR,
    confidence: 'low',
    message: extractMessage(errorBody, provider),
    rawError: errorBody,
  }
}

/**
 * Log detection result for debugging/monitoring
 */
export function logDetectionResult(
  provider: AIProvider,
  statusCode: number,
  result: DetectionResult
): void {
  if (result.confidence === 'low') {
    console.warn(
      `[ProviderErrorDetector] Low confidence detection for ${provider} (${statusCode}):`,
      {
        code: result.code,
        message: result.message,
        rawError: result.rawError,
      }
    )
  }
}

/**
 * Check if error body appears malformed
 */
export function isMalformedErrorBody(body: unknown): boolean {
  if (body === null || body === undefined) return true
  if (typeof body !== 'object') return true
  if (Array.isArray(body)) return true

  // Check for common error structure
  const hasError = 'error' in (body as Record<string, unknown>)
  const hasMessage = 'message' in (body as Record<string, unknown>)
  const hasType = 'type' in (body as Record<string, unknown>)

  return !hasError && !hasMessage && !hasType
}
