/**
 * Tests for provider error detection with confidence scoring
 */

import { describe, it, expect } from 'vitest'
import {
  detectProviderError,
  logDetectionResult,
  isMalformedErrorBody,
} from '../../src/errors/provider-error-detector'
import { ProviderErrorCode } from '../../src/errors/error-codes'

describe('detectProviderError', () => {
  describe('OpenAI detection', () => {
    it('should detect rate limit with high confidence', () => {
      const result = detectProviderError('openai', 429, {
        error: { type: 'rate_limit_exceeded', message: 'Rate limit' },
      })

      expect(result.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(result.confidence).toBe('high')
    })

    it('should detect invalid API key with high confidence', () => {
      const result = detectProviderError('openai', 401, {
        error: { code: 'invalid_api_key', message: 'Invalid API key' },
      })

      expect(result.code).toBe(ProviderErrorCode.INVALID_API_KEY)
      expect(result.confidence).toBe('high')
    })

    it('should detect quota exceeded', () => {
      const result = detectProviderError('openai', 403, {
        error: { type: 'insufficient_quota', message: 'Quota exceeded' },
      })

      expect(result.code).toBe(ProviderErrorCode.QUOTA_EXCEEDED)
      expect(result.confidence).toBe('high')
    })

    it('should detect context length by code with high confidence', () => {
      const result = detectProviderError('openai', 400, {
        error: { code: 'context_length_exceeded', message: 'Too long' },
      })

      expect(result.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
      expect(result.confidence).toBe('high')
    })

    it('should detect context length by message with medium confidence', () => {
      const result = detectProviderError('openai', 400, {
        error: { message: 'This exceeds the maximum context length' },
      })

      expect(result.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
      expect(result.confidence).toBe('medium')
    })

    it('should detect content filter', () => {
      const result = detectProviderError('openai', 400, {
        error: {
          type: 'content_policy_violation',
          message: 'Content filtered',
        },
      })

      expect(result.code).toBe(ProviderErrorCode.CONTENT_FILTER)
      expect(result.confidence).toBe('high')
    })

    it('should detect service unavailable', () => {
      const result = detectProviderError('openai', 500, {
        error: { message: 'Internal error' },
      })

      expect(result.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
      expect(result.confidence).toBe('high')
    })

    it('should extract retry_after', () => {
      const result = detectProviderError('openai', 429, {
        error: { type: 'rate_limit_exceeded' },
        retry_after: 30,
      })

      expect(result.retryAfter).toBe(30)
    })

    it('should work with Azure provider', () => {
      const result = detectProviderError('azure', 429, {
        error: { type: 'rate_limit_exceeded' },
      })

      expect(result.code).toBe(ProviderErrorCode.RATE_LIMIT)
    })

    it('should return low confidence for unknown error', () => {
      const result = detectProviderError('openai', 400, {
        error: { message: 'Something weird happened' },
      })

      expect(result.confidence).toBe('low')
    })
  })

  describe('Anthropic detection', () => {
    it('should detect rate limit', () => {
      const result = detectProviderError('anthropic', 429, {
        error: { type: 'rate_limit_error', message: 'Rate limited' },
      })

      expect(result.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(result.confidence).toBe('high')
    })

    it('should detect authentication error', () => {
      const result = detectProviderError('anthropic', 401, {
        error: { type: 'authentication_error', message: 'Invalid key' },
      })

      expect(result.code).toBe(ProviderErrorCode.INVALID_API_KEY)
      expect(result.confidence).toBe('high')
    })

    it('should detect quota with medium confidence from message', () => {
      const result = detectProviderError('anthropic', 400, {
        error: { message: 'Insufficient credits remaining' },
      })

      expect(result.code).toBe(ProviderErrorCode.QUOTA_EXCEEDED)
      expect(result.confidence).toBe('medium')
    })

    it('should detect context length from token message', () => {
      const result = detectProviderError('anthropic', 400, {
        error: { message: 'Request has too many tokens' },
      })

      expect(result.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
      expect(result.confidence).toBe('medium')
    })

    it('should detect overloaded error', () => {
      const result = detectProviderError('anthropic', 529, {
        error: { type: 'overloaded_error', message: 'Overloaded' },
      })

      expect(result.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
      expect(result.confidence).toBe('high')
    })

    it('should extract retry_after_ms', () => {
      const result = detectProviderError('anthropic', 429, {
        error: { type: 'rate_limit_error' },
        retry_after_ms: 60000,
      })

      expect(result.retryAfter).toBe(60)
    })

    it('should support flat error format', () => {
      const result = detectProviderError('anthropic', 429, {
        type: 'rate_limit_error',
        message: 'Rate limited',
      })

      expect(result.code).toBe(ProviderErrorCode.RATE_LIMIT)
    })
  })

  describe('Google detection', () => {
    it('should detect rate limit by status', () => {
      const result = detectProviderError('google', 429, {
        error: { status: 'RESOURCE_EXHAUSTED', message: 'Quota exceeded' },
      })

      expect(result.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(result.confidence).toBe('high')
    })

    it('should detect authentication error', () => {
      const result = detectProviderError('google', 401, {
        error: { status: 'UNAUTHENTICATED', message: 'Invalid API key' },
      })

      expect(result.code).toBe(ProviderErrorCode.INVALID_API_KEY)
      expect(result.confidence).toBe('high')
    })

    it('should detect content filter by code', () => {
      const result = detectProviderError('google', 400, {
        error: { code: 'SAFETY', message: 'Safety filter triggered' },
      })

      expect(result.code).toBe(ProviderErrorCode.CONTENT_FILTER)
      expect(result.confidence).toBe('medium')
    })

    it('should detect model not found', () => {
      const result = detectProviderError('google', 404, {
        error: { status: 'NOT_FOUND', message: 'Model not found' },
      })

      expect(result.code).toBe(ProviderErrorCode.MODEL_NOT_FOUND)
      expect(result.confidence).toBe('high')
    })

    it('should extract retry delay from details', () => {
      const result = detectProviderError('google', 429, {
        error: {
          status: 'RESOURCE_EXHAUSTED',
          details: [{ retryDelay: '30s' }],
        },
      })

      expect(result.retryAfter).toBe(30)
    })
  })

  describe('Generic detection', () => {
    it('should handle unknown provider with status-based detection', () => {
      const result = detectProviderError('cohere', 429, {
        error: { message: 'Rate limited' },
      })

      expect(result.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(result.confidence).toBe('high')
    })

    it('should detect auth error for unknown provider', () => {
      const result = detectProviderError('cohere', 401, {
        error: { message: 'Unauthorized' },
      })

      expect(result.code).toBe(ProviderErrorCode.INVALID_API_KEY)
      expect(result.confidence).toBe('medium')
    })

    it('should handle undefined body', () => {
      const result = detectProviderError('cohere', 500, undefined)

      expect(result.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
      expect(result.message).toBe('cohere API error')
    })
  })
})

describe('isMalformedErrorBody', () => {
  it('should return true for null', () => {
    expect(isMalformedErrorBody(null)).toBe(true)
  })

  it('should return true for undefined', () => {
    expect(isMalformedErrorBody(undefined)).toBe(true)
  })

  it('should return true for array', () => {
    expect(isMalformedErrorBody([])).toBe(true)
  })

  it('should return true for string', () => {
    expect(isMalformedErrorBody('error')).toBe(true)
  })

  it('should return true for empty object', () => {
    expect(isMalformedErrorBody({})).toBe(true)
  })

  it('should return false for object with error property', () => {
    expect(isMalformedErrorBody({ error: { message: 'test' } })).toBe(false)
  })

  it('should return false for object with message property', () => {
    expect(isMalformedErrorBody({ message: 'test' })).toBe(false)
  })

  it('should return false for object with type property', () => {
    expect(isMalformedErrorBody({ type: 'error_type' })).toBe(false)
  })
})

describe('logDetectionResult', () => {
  it('should log warning for low confidence results', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    logDetectionResult('openai', 400, {
      code: ProviderErrorCode.OPENAI_ERROR,
      confidence: 'low',
      message: 'Unknown error',
      rawError: { weird: 'body' },
    })

    expect(warnSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('Low confidence detection'),
      expect.any(Object)
    )

    warnSpy.mockRestore()
  })

  it('should not log for high confidence results', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    logDetectionResult('openai', 429, {
      code: ProviderErrorCode.RATE_LIMIT,
      confidence: 'high',
      message: 'Rate limited',
    })

    expect(warnSpy).not.toHaveBeenCalled()

    warnSpy.mockRestore()
  })
})
