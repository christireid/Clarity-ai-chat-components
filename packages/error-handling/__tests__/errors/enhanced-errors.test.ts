import { describe, it, expect, beforeEach } from 'vitest'
import {
  ClarityError,
  isClarityError,
  ApiError,
  ApiErrorCode,
  isApiError,
  StreamingError,
  StreamingErrorCode,
  isStreamingError,
  ProviderError,
  ProviderErrorCode,
  isProviderError,
  EnhancedValidationError,
  ValidationErrorCode,
  isValidationError,
  isNetworkError,
  isRateLimitError,
  isAuthError,
  isRecoverableError,
  hasRetryAfter,
  hasPartialContent,
  getErrorStatusCode,
  getErrorCode,
  getUserMessage,
  normalizeError,
} from '../../src/errors'

describe('ClarityError Base Class', () => {
  // Create a concrete implementation for testing
  class TestError extends ClarityError {
    readonly code = 'TEST_ERROR'
    readonly statusCode = 500
  }

  it('should create error with correct properties', () => {
    const error = new TestError('Test error message', {
      context: { key: 'value' },
      recoverable: true,
      solution: 'Try again',
    })

    expect(error.message).toBe('Test error message')
    expect(error.name).toBe('TestError')
    expect(error.code).toBe('TEST_ERROR')
    expect(error.statusCode).toBe(500)
    expect(error.recoverable).toBe(true)
    expect(error.solution).toBe('Try again')
    expect(error.context).toEqual({ key: 'value' })
    expect(error.timestamp).toBeInstanceOf(Date)
  })

  it('should pass instanceof checks', () => {
    const error = new TestError('Test')

    expect(error instanceof Error).toBe(true)
    expect(error instanceof ClarityError).toBe(true)
    expect(error instanceof TestError).toBe(true)
    expect(isClarityError(error)).toBe(true)
  })

  it('should serialize to JSON correctly', () => {
    const error = new TestError('Test', {
      context: { test: true },
    })

    const json = error.toJSON()

    expect(json).toHaveProperty('name', 'TestError')
    expect(json).toHaveProperty('code', 'TEST_ERROR')
    expect(json).toHaveProperty('statusCode', 500)
    expect(json).toHaveProperty('timestamp')
    expect(json).toHaveProperty('recoverable', false)
  })

  it('should provide user-friendly message', () => {
    const recoverableError = new TestError('Test', { recoverable: true })
    expect(recoverableError.userMessage).toBe('Test. Please try again.')

    const nonRecoverableError = new TestError('Test', { recoverable: false })
    expect(nonRecoverableError.userMessage).toBe(
      'An unexpected error occurred. Please contact support.'
    )
  })
})

describe('ApiError', () => {
  it('should create error with correct properties', () => {
    const error = new ApiError('Not found', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
      endpoint: '/api/chat',
      method: 'GET',
    })

    expect(error.name).toBe('ApiError')
    expect(error.code).toBe(ApiErrorCode.NOT_FOUND)
    expect(error.statusCode).toBe(404)
    expect(error.endpoint).toBe('/api/chat')
    expect(error.method).toBe('GET')
    expect(error.recoverable).toBe(true) // 4xx are recoverable
  })

  it('should mark 5xx errors as not recoverable', () => {
    const error = new ApiError('Server error', {
      code: ApiErrorCode.SERVER_ERROR,
      statusCode: 500,
    })

    expect(error.recoverable).toBe(false)
  })

  it('should pass type guard', () => {
    const error = new ApiError('Test', {
      code: ApiErrorCode.BAD_REQUEST,
      statusCode: 400,
    })

    expect(isApiError(error)).toBe(true)
    expect(isApiError(new Error('Regular error'))).toBe(false)
  })

  it('should create network error', () => {
    const error = ApiError.networkError(
      new Error('Network failed'),
      '/api/chat'
    )

    expect(error.code).toBe(ApiErrorCode.NETWORK_ERROR)
    expect(error.statusCode).toBe(0)
    expect(error.endpoint).toBe('/api/chat')
  })

  it('should create timeout error', () => {
    const error = ApiError.timeout(5000, '/api/chat')

    expect(error.code).toBe(ApiErrorCode.TIMEOUT)
    expect(error.statusCode).toBe(408)
    expect(error.message).toContain('5000ms')
  })

  it('should provide context-aware user messages', () => {
    const unauthorized = new ApiError('Unauthorized', {
      code: ApiErrorCode.UNAUTHORIZED,
      statusCode: 401,
    })
    expect(unauthorized.userMessage).toBe('You need to sign in to continue.')

    const rateLimited = new ApiError('Rate limited', {
      code: ApiErrorCode.RATE_LIMITED,
      statusCode: 429,
    })
    expect(rateLimited.userMessage).toBe(
      'Too many requests. Please wait a moment and try again.'
    )
  })
})

describe('StreamingError', () => {
  it('should create error with transport type', () => {
    const error = new StreamingError('Connection lost', {
      code: StreamingErrorCode.CONNECTION_LOST,
      transport: 'sse',
      partialContent: 'Hello, I am...',
    })

    expect(error.name).toBe('StreamingError')
    expect(error.transport).toBe('sse')
    expect(error.partialContent).toBe('Hello, I am...')
    expect(error.recoverable).toBe(true)
  })

  it('should mark connection errors as recoverable', () => {
    const connectionLost = new StreamingError('Lost', {
      code: StreamingErrorCode.CONNECTION_LOST,
      transport: 'websocket',
    })
    expect(connectionLost.recoverable).toBe(true)

    const parseError = new StreamingError('Parse failed', {
      code: StreamingErrorCode.PARSE_ERROR,
      transport: 'sse',
    })
    expect(parseError.recoverable).toBe(false)
  })

  it('should pass type guard', () => {
    const error = new StreamingError('Test', {
      code: StreamingErrorCode.CONNECTION_FAILED,
      transport: 'fetch',
    })

    expect(isStreamingError(error)).toBe(true)
  })

  it('should create connection lost error with partial content', () => {
    const error = StreamingError.connectionLost('sse', 'Hello, world')

    expect(error.code).toBe(StreamingErrorCode.CONNECTION_LOST)
    expect(error.partialContent).toBe('Hello, world')
    expect(error.hasPartialContent).toBe(true)
  })

  it('should detect partial content', () => {
    const withContent = new StreamingError('Test', {
      code: StreamingErrorCode.ABORTED,
      transport: 'sse',
      partialContent: 'Some content',
    })
    expect(withContent.hasPartialContent).toBe(true)

    const withoutContent = new StreamingError('Test', {
      code: StreamingErrorCode.ABORTED,
      transport: 'sse',
    })
    expect(withoutContent.hasPartialContent).toBe(false)
  })
})

describe('ProviderError', () => {
  it('should create error with provider info', () => {
    const error = new ProviderError('Rate limit exceeded', {
      code: ProviderErrorCode.RATE_LIMIT,
      provider: 'openai',
      model: 'gpt-4',
      retryAfter: 60,
    })

    expect(error.name).toBe('ProviderError')
    expect(error.provider).toBe('openai')
    expect(error.model).toBe('gpt-4')
    expect(error.retryAfter).toBe(60)
    expect(error.recoverable).toBe(true) // Rate limits are recoverable
  })

  it('should pass type guard', () => {
    const error = new ProviderError('Test', {
      code: ProviderErrorCode.OPENAI_ERROR,
      provider: 'openai',
    })

    expect(isProviderError(error)).toBe(true)
  })

  it('should create rate limit error', () => {
    const error = ProviderError.rateLimit('anthropic', 30, 'claude-3')

    expect(error.code).toBe(ProviderErrorCode.RATE_LIMIT)
    expect(error.provider).toBe('anthropic')
    expect(error.retryAfter).toBe(30)
    expect(error.userMessage).toContain('30 seconds')
  })

  it('should create context length error', () => {
    const error = ProviderError.contextLengthExceeded(
      'openai',
      4096,
      5000,
      'gpt-4'
    )

    expect(error.code).toBe(ProviderErrorCode.CONTEXT_LENGTH)
    expect(error.context).toEqual(
      expect.objectContaining({ limit: 4096, actual: 5000 })
    )
  })

  it('should provide provider-specific user messages', () => {
    const rateLimitError = ProviderError.rateLimit('openai', 30)
    expect(rateLimitError.userMessage).toContain('30 seconds')

    const contextError = ProviderError.contextLengthExceeded(
      'openai',
      4096,
      5000
    )
    expect(contextError.userMessage).toContain('too long')
  })
})

describe('EnhancedValidationError', () => {
  it('should create error with field details', () => {
    const error = new EnhancedValidationError('Validation failed', {
      fields: [
        {
          field: 'email',
          message: 'Invalid email format',
          code: ValidationErrorCode.INVALID_FORMAT,
        },
        {
          field: 'name',
          message: 'Name is required',
          code: ValidationErrorCode.REQUIRED_FIELD,
        },
      ],
    })

    expect(error.name).toBe('ValidationError')
    expect(error.fields.length).toBe(2)
    expect(error.recoverable).toBe(true)
    expect(error.statusCode).toBe(400)
  })

  it('should pass type guard', () => {
    const error = EnhancedValidationError.required('email')

    expect(isValidationError(error)).toBe(true)
  })

  it('should create single field errors', () => {
    const required = EnhancedValidationError.required('username')
    expect(required.fields[0].field).toBe('username')
    expect(required.fields[0].code).toBe(ValidationErrorCode.REQUIRED_FIELD)

    const tooLong = EnhancedValidationError.tooLong('bio', 500, 600)
    expect(tooLong.fields[0].field).toBe('bio')
    expect(tooLong.fields[0].code).toBe(ValidationErrorCode.TOO_LONG)
  })

  it('should get field errors', () => {
    const error = new EnhancedValidationError('Validation failed', {
      fields: [
        {
          field: 'email',
          message: 'Invalid',
          code: ValidationErrorCode.INVALID_FORMAT,
        },
      ],
    })

    expect(error.getFieldError('email')).toBe('Invalid')
    expect(error.getFieldError('name')).toBeUndefined()
    expect(error.hasFieldError('email')).toBe(true)
    expect(error.hasFieldError('name')).toBe(false)
  })

  it('should combine multiple validation errors', () => {
    const error1 = EnhancedValidationError.required('email')
    const error2 = EnhancedValidationError.tooLong('name', 50, 60)
    const combined = EnhancedValidationError.combine([error1, error2])

    expect(combined.fields.length).toBe(2)
    expect(combined.errorFields).toEqual(['email', 'name'])
  })

  it('should provide field error map', () => {
    const error = new EnhancedValidationError('Validation failed', {
      fields: [
        {
          field: 'email',
          message: 'Invalid email',
          code: ValidationErrorCode.INVALID_FORMAT,
        },
        {
          field: 'name',
          message: 'Required',
          code: ValidationErrorCode.REQUIRED_FIELD,
        },
      ],
    })

    expect(error.fieldErrorMap).toEqual({
      email: 'Invalid email',
      name: 'Required',
    })
  })
})

describe('Type Guards', () => {
  it('should detect network errors', () => {
    const apiNetworkError = new ApiError('Network failed', {
      code: ApiErrorCode.NETWORK_ERROR,
      statusCode: 0,
    })
    expect(isNetworkError(apiNetworkError)).toBe(true)

    const streamNetworkError = new StreamingError('Connection lost', {
      code: StreamingErrorCode.CONNECTION_LOST,
      transport: 'sse',
    })
    expect(isNetworkError(streamNetworkError)).toBe(true)

    const regularError = new Error('Regular')
    expect(isNetworkError(regularError)).toBe(false)
  })

  it('should detect rate limit errors', () => {
    const apiRateLimit = new ApiError('Rate limited', {
      code: ApiErrorCode.RATE_LIMITED,
      statusCode: 429,
    })
    expect(isRateLimitError(apiRateLimit)).toBe(true)

    const providerRateLimit = ProviderError.rateLimit('openai', 30)
    expect(isRateLimitError(providerRateLimit)).toBe(true)
  })

  it('should detect auth errors', () => {
    const apiAuth = new ApiError('Unauthorized', {
      code: ApiErrorCode.UNAUTHORIZED,
      statusCode: 401,
    })
    expect(isAuthError(apiAuth)).toBe(true)

    const providerAuth = ProviderError.invalidApiKey('openai')
    expect(isAuthError(providerAuth)).toBe(true)
  })

  it('should detect recoverable errors', () => {
    const recoverable = new ApiError('Not found', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })
    expect(isRecoverableError(recoverable)).toBe(true)

    const notRecoverable = new ApiError('Server error', {
      code: ApiErrorCode.SERVER_ERROR,
      statusCode: 500,
    })
    expect(isRecoverableError(notRecoverable)).toBe(false)
  })

  it('should detect retry-after', () => {
    const withRetry = ProviderError.rateLimit('openai', 30)
    expect(hasRetryAfter(withRetry)).toBe(true)

    const withoutRetry = ProviderError.contextLengthExceeded(
      'openai',
      4096,
      5000
    )
    expect(hasRetryAfter(withoutRetry)).toBe(false)
  })

  it('should detect partial content', () => {
    const withContent = StreamingError.connectionLost('sse', 'Hello')
    expect(hasPartialContent(withContent)).toBe(true)

    const withoutContent = StreamingError.connectionFailed('sse')
    expect(hasPartialContent(withoutContent)).toBe(false)
  })
})

describe('Utility Functions', () => {
  it('should get error status code', () => {
    const apiError = new ApiError('Test', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })
    expect(getErrorStatusCode(apiError)).toBe(404)

    const regularError = new Error('Test')
    expect(getErrorStatusCode(regularError)).toBe(500)
  })

  it('should get error code', () => {
    const apiError = new ApiError('Test', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })
    expect(getErrorCode(apiError)).toBe(ApiErrorCode.NOT_FOUND)

    const regularError = new Error('Test')
    expect(getErrorCode(regularError)).toBe('UNKNOWN_ERROR')
  })

  it('should get user message', () => {
    const apiError = new ApiError('Test', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })
    expect(getUserMessage(apiError)).toBe(
      'The requested resource could not be found.'
    )

    const regularError = new Error('Custom message')
    expect(getUserMessage(regularError)).toBe('Custom message')
  })

  it('should normalize errors', () => {
    const apiError = new ApiError('Test', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })
    const normalized = normalizeError(apiError)

    expect(normalized.name).toBe('ApiError')
    expect(normalized.code).toBe(ApiErrorCode.NOT_FOUND)
    expect(normalized.statusCode).toBe(404)

    const regularError = new Error('Regular')
    const regularNormalized = normalizeError(regularError)

    expect(regularNormalized.code).toBe('UNKNOWN_ERROR')
    expect(regularNormalized.statusCode).toBe(500)
  })
})
