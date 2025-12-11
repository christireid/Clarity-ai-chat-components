/**
 * Tests for ProviderError.fromProviderResponse and provider-specific parsing
 */

import { describe, it, expect } from 'vitest'
import {
  ProviderError,
  ProviderErrorCode,
} from '../../src/errors/provider-error'

describe('ProviderError.fromProviderResponse', () => {
  describe('OpenAI response parsing', () => {
    it('should parse rate limit error', () => {
      const error = ProviderError.fromProviderResponse('openai', 429, {
        error: {
          message: 'Rate limit exceeded',
          type: 'rate_limit_exceeded',
          code: 'rate_limit_exceeded',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.provider).toBe('openai')
      expect(error.statusCode).toBe(429)
    })

    it('should parse rate limit with retry_after', () => {
      const error = ProviderError.fromProviderResponse('openai', 429, {
        error: { message: 'Rate limit exceeded', type: 'rate_limit_exceeded' },
        retry_after: 30,
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.retryAfter).toBe(30)
      expect(error.solution).toContain('30 seconds')
    })

    it('should parse invalid API key error', () => {
      const error = ProviderError.fromProviderResponse('openai', 401, {
        error: {
          message: 'Invalid API key',
          type: 'invalid_request_error',
          code: 'invalid_api_key',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.INVALID_API_KEY)
      expect(error.statusCode).toBe(401)
    })

    it('should parse quota exceeded error (403)', () => {
      const error = ProviderError.fromProviderResponse('openai', 403, {
        error: { message: 'Quota exceeded', type: 'insufficient_quota' },
      })

      expect(error.code).toBe(ProviderErrorCode.QUOTA_EXCEEDED)
    })

    it('should parse context length exceeded error by code', () => {
      const error = ProviderError.fromProviderResponse('openai', 400, {
        error: {
          message: 'Request too large',
          type: 'invalid_request_error',
          code: 'context_length_exceeded',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
    })

    it('should parse context length exceeded error by message', () => {
      const error = ProviderError.fromProviderResponse('openai', 400, {
        error: {
          message: "This model's maximum context length is 8192 tokens",
          type: 'invalid_request_error',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
    })

    it('should parse content filter error by code', () => {
      const error = ProviderError.fromProviderResponse('openai', 400, {
        error: {
          message: 'Content violated policy',
          type: 'invalid_request_error',
          code: 'content_filter',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTENT_FILTER)
    })

    it('should parse content filter error by type', () => {
      const error = ProviderError.fromProviderResponse('openai', 400, {
        error: {
          message: 'Content policy violation',
          type: 'content_policy_violation',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTENT_FILTER)
    })

    it('should parse model not found error', () => {
      const error = ProviderError.fromProviderResponse(
        'openai',
        404,
        {
          error: {
            message: 'Model gpt-5 not found',
            type: 'invalid_request_error',
            code: 'model_not_found',
          },
        },
        'gpt-5'
      )

      expect(error.code).toBe(ProviderErrorCode.MODEL_NOT_FOUND)
      expect(error.model).toBe('gpt-5')
    })

    it('should parse service unavailable error', () => {
      const error = ProviderError.fromProviderResponse('openai', 500, {
        error: { message: 'Internal server error' },
      })

      expect(error.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
    })

    it('should handle 503 status', () => {
      const error = ProviderError.fromProviderResponse('openai', 503, {
        error: { message: 'Service temporarily unavailable' },
      })

      expect(error.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
    })

    it('should handle empty error body', () => {
      const error = ProviderError.fromProviderResponse('openai', 500, undefined)

      expect(error.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
      expect(error.message).toBe('openai API error')
    })

    it('should work with Azure provider', () => {
      const error = ProviderError.fromProviderResponse('azure', 429, {
        error: { message: 'Rate limit', type: 'rate_limit_exceeded' },
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.provider).toBe('azure')
    })
  })

  describe('Anthropic response parsing', () => {
    it('should parse rate limit error', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 429, {
        error: { type: 'rate_limit_error', message: 'Rate limited' },
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.provider).toBe('anthropic')
    })

    it('should parse rate limit with retry_after_ms', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 429, {
        error: { type: 'rate_limit_error', message: 'Rate limited' },
        retry_after_ms: 60000,
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.retryAfter).toBe(60)
    })

    it('should parse authentication error', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 401, {
        error: { type: 'authentication_error', message: 'Invalid API key' },
      })

      expect(error.code).toBe(ProviderErrorCode.INVALID_API_KEY)
    })

    it('should parse invalid_request_error with credit message', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 400, {
        error: {
          type: 'invalid_request_error',
          message: 'Insufficient credits',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.QUOTA_EXCEEDED)
    })

    it('should parse invalid_request_error with billing message', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 400, {
        error: {
          type: 'invalid_request_error',
          message: 'Please check your billing',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.QUOTA_EXCEEDED)
    })

    it('should parse context length error with token message', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 400, {
        error: {
          type: 'invalid_request_error',
          message: 'Too many tokens in request',
        },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
    })

    it('should parse context length error with too long message', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 400, {
        error: { type: 'invalid_request_error', message: 'Request too long' },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
    })

    it('should parse generic invalid_request_error', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 400, {
        error: { type: 'invalid_request_error', message: 'Bad parameter' },
      })

      expect(error.code).toBe(ProviderErrorCode.ANTHROPIC_ERROR)
      expect(error.solution).toContain('request parameters')
    })

    it('should parse content filter error', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 400, {
        error: { message: 'Output blocked for safety' },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTENT_FILTER)
    })

    it('should parse model not found error', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 404, {
        error: { message: 'Model not found' },
      })

      expect(error.code).toBe(ProviderErrorCode.MODEL_NOT_FOUND)
    })

    it('should parse overloaded error (529)', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 529, {
        error: { type: 'overloaded_error', message: 'Overloaded' },
      })

      expect(error.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
    })

    it('should parse server error (500+)', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 502, {
        error: { message: 'Bad gateway' },
      })

      expect(error.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
    })

    it('should handle flat error response format', () => {
      const error = ProviderError.fromProviderResponse('anthropic', 429, {
        type: 'rate_limit_error',
        message: 'Rate limited',
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
    })

    it('should handle empty error body', () => {
      const error = ProviderError.fromProviderResponse(
        'anthropic',
        500,
        undefined
      )

      expect(error.message).toBe('Anthropic API error')
    })
  })

  describe('Google AI response parsing', () => {
    it('should parse rate limit error by status', () => {
      const error = ProviderError.fromProviderResponse('google', 429, {
        error: { message: 'Quota exceeded', status: 'RESOURCE_EXHAUSTED' },
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.provider).toBe('google')
    })

    it('should parse rate limit with retry delay in details', () => {
      const error = ProviderError.fromProviderResponse('google', 429, {
        error: {
          message: 'Quota exceeded',
          status: 'RESOURCE_EXHAUSTED',
          details: [{ retryDelay: '30s' }],
        },
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.retryAfter).toBe(30)
    })

    it('should parse authentication error (401)', () => {
      const error = ProviderError.fromProviderResponse('google', 401, {
        error: { message: 'Invalid API key', status: 'UNAUTHENTICATED' },
      })

      expect(error.code).toBe(ProviderErrorCode.INVALID_API_KEY)
    })

    it('should parse authentication error (403)', () => {
      const error = ProviderError.fromProviderResponse('google', 403, {
        error: { message: 'Permission denied' },
      })

      expect(error.code).toBe(ProviderErrorCode.INVALID_API_KEY)
    })

    it('should parse context length error with token message', () => {
      const error = ProviderError.fromProviderResponse('google', 400, {
        error: { message: 'Too many tokens', status: 'INVALID_ARGUMENT' },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
    })

    it('should parse context length error with length message', () => {
      const error = ProviderError.fromProviderResponse('google', 400, {
        error: { message: 'Max length exceeded', status: 'INVALID_ARGUMENT' },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
    })

    it('should parse generic INVALID_ARGUMENT', () => {
      const error = ProviderError.fromProviderResponse('google', 400, {
        error: { message: 'Bad parameter', status: 'INVALID_ARGUMENT' },
      })

      expect(error.code).toBe(ProviderErrorCode.GOOGLE_ERROR)
      expect(error.solution).toContain('request parameters')
    })

    it('should parse content filter error by code', () => {
      const error = ProviderError.fromProviderResponse('google', 400, {
        error: { message: 'Blocked', code: 'SAFETY' },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTENT_FILTER)
    })

    it('should parse content filter error by message', () => {
      const error = ProviderError.fromProviderResponse('google', 400, {
        error: { message: 'Output blocked for safety reasons' },
      })

      expect(error.code).toBe(ProviderErrorCode.CONTENT_FILTER)
    })

    it('should parse model not found error (404)', () => {
      const error = ProviderError.fromProviderResponse('google', 404, {
        error: { message: 'Model not found' },
      })

      expect(error.code).toBe(ProviderErrorCode.MODEL_NOT_FOUND)
    })

    it('should parse model not found error by status', () => {
      const error = ProviderError.fromProviderResponse('google', 400, {
        error: { message: 'Not found', status: 'NOT_FOUND' },
      })

      expect(error.code).toBe(ProviderErrorCode.MODEL_NOT_FOUND)
    })

    it('should parse server error (500+)', () => {
      const error = ProviderError.fromProviderResponse('google', 500, {
        error: { message: 'Internal error', status: 'INTERNAL' },
      })

      expect(error.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
    })

    it('should handle empty error body', () => {
      const error = ProviderError.fromProviderResponse('google', 500, undefined)

      expect(error.message).toBe('Google AI API error')
    })
  })

  describe('Generic/Cohere response parsing', () => {
    it('should parse rate limit error', () => {
      const error = ProviderError.fromProviderResponse('cohere', 429, {
        error: { message: 'Rate limited' },
      })

      expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
      expect(error.provider).toBe('cohere')
    })

    it('should parse auth error (401)', () => {
      const error = ProviderError.fromProviderResponse('cohere', 401, {
        error: { message: 'Invalid API key' },
      })

      expect(error.code).toBe(ProviderErrorCode.INVALID_API_KEY)
    })

    it('should parse auth error (403)', () => {
      const error = ProviderError.fromProviderResponse('cohere', 403, {
        error: { message: 'Forbidden' },
      })

      expect(error.code).toBe(ProviderErrorCode.INVALID_API_KEY)
    })

    it('should parse not found error', () => {
      const error = ProviderError.fromProviderResponse('cohere', 404, {
        error: { message: 'Not found' },
      })

      expect(error.code).toBe(ProviderErrorCode.MODEL_NOT_FOUND)
    })

    it('should parse server error', () => {
      const error = ProviderError.fromProviderResponse('cohere', 500, {
        error: { message: 'Server error' },
      })

      expect(error.code).toBe(ProviderErrorCode.SERVICE_UNAVAILABLE)
    })

    it('should handle flat message format', () => {
      const error = ProviderError.fromProviderResponse('cohere', 500, {
        message: 'Something went wrong',
      })

      expect(error.message).toBe('Something went wrong')
    })

    it('should handle empty body', () => {
      const error = ProviderError.fromProviderResponse('cohere', 500, undefined)

      expect(error.message).toBe('cohere API error')
    })

    it('should include error type in context', () => {
      const error = ProviderError.fromProviderResponse('cohere', 400, {
        error: {
          message: 'Bad request',
          type: 'invalid_request',
          code: 'bad_param',
        },
      })

      expect(error.context?.errorType).toBe('invalid_request')
    })
  })

  describe('userMessage generation', () => {
    it('should generate user message for rate limit with retryAfter', () => {
      const error = ProviderError.rateLimit('openai', 30)
      expect(error.userMessage).toContain('30 seconds')
    })

    it('should generate user message for rate limit without retryAfter', () => {
      const error = ProviderError.rateLimit('openai')
      expect(error.userMessage).toContain('Rate limit exceeded')
      expect(error.userMessage).toContain('later')
    })

    it('should generate user message for context length', () => {
      const error = ProviderError.contextLengthExceeded('openai', 8000, 10000)
      expect(error.userMessage).toContain('too long')
    })

    it('should generate user message for content filter', () => {
      const error = ProviderError.contentFiltered('openai')
      expect(error.userMessage).toContain('content filters')
    })

    it('should generate user message for invalid API key', () => {
      const error = ProviderError.invalidApiKey('openai')
      expect(error.userMessage).toContain('Authentication')
    })

    it('should generate user message for model not found', () => {
      const error = new ProviderError('Model not found', {
        code: ProviderErrorCode.MODEL_NOT_FOUND,
        provider: 'openai',
        statusCode: 404,
        model: 'gpt-5',
      })
      expect(error.userMessage).toContain('gpt-5')
    })

    it('should generate user message for quota exceeded', () => {
      const error = new ProviderError('Quota exceeded', {
        code: ProviderErrorCode.QUOTA_EXCEEDED,
        provider: 'openai',
        statusCode: 403,
      })
      expect(error.userMessage).toContain('quota')
    })

    it('should generate user message for service unavailable', () => {
      const error = ProviderError.serviceUnavailable('openai')
      expect(error.userMessage).toContain('unavailable')
    })

    it('should use default user message for unknown codes', () => {
      const error = new ProviderError('Unknown error', {
        code: ProviderErrorCode.OPENAI_ERROR,
        provider: 'openai',
        statusCode: 400,
      })
      expect(error.userMessage).toBeDefined()
    })
  })
})
