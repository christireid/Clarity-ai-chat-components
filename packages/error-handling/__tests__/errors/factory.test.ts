import { describe, it, expect } from 'vitest'
import {
  createConfigError,
  createApiError,
  createAuthError,
  createNetworkError,
  createValidationError,
  createStreamError,
  createRateLimitError,
  createTokenLimitError,
} from '../../src/errors/factory'
import {
  ConfigurationError,
  APIError,
  AuthenticationError,
  NetworkError,
  ValidationError,
  StreamError,
  RateLimitError,
  TokenLimitError,
  TimeoutError,
} from '../../src/errors'

describe('createConfigError', () => {
  it('should create missingApiEndpoint error', () => {
    const error = createConfigError.missingApiEndpoint()
    expect(error).toBeInstanceOf(ConfigurationError)
    expect(error.code).toBe('MISSING_API_ENDPOINT')
    expect(error.solution).toContain('apiEndpoint')
  })

  it('should create invalidModel error', () => {
    const error = createConfigError.invalidModel('gpt-5', ['gpt-3.5', 'gpt-4'])
    expect(error).toBeInstanceOf(ConfigurationError)
    expect(error.code).toBe('INVALID_MODEL')
    expect(error.context?.providedModel).toBe('gpt-5')
    expect(error.context?.validModels).toEqual(['gpt-3.5', 'gpt-4'])
  })

  it('should create missingApiKey error', () => {
    const error = createConfigError.missingApiKey()
    expect(error).toBeInstanceOf(ConfigurationError)
    expect(error.code).toBe('MISSING_API_KEY')
    expect(error.solution).toContain('apiKey')
  })

  it('should create invalidConfiguration error', () => {
    const error = createConfigError.invalidConfiguration('timeout', 5000, 'number')
    expect(error).toBeInstanceOf(ConfigurationError)
    expect(error.code).toBe('INVALID_CONFIGURATION')
    expect(error.context?.field).toBe('timeout')
  })

  it('should create missingRequiredProp error', () => {
    const error = createConfigError.missingRequiredProp('apiKey', 'ChatContainer')
    expect(error).toBeInstanceOf(ConfigurationError)
    expect(error.code).toBe('MISSING_REQUIRED_PROP')
    expect(error.context?.propName).toBe('apiKey')
    expect(error.context?.componentName).toBe('ChatContainer')
  })
})

describe('createApiError', () => {
  it('should create requestFailed error', () => {
    const error = createApiError.requestFailed('/api/chat', 500, 'Internal Server Error')
    expect(error).toBeInstanceOf(APIError)
    expect(error.code).toBe('API_REQUEST_FAILED')
    expect(error.statusCode).toBe(500)
    expect(error.context?.endpoint).toBe('/api/chat')
  })

  it('should create invalidResponse error', () => {
    const error = createApiError.invalidResponse('/api/chat', 'Invalid JSON')
    expect(error).toBeInstanceOf(APIError)
    expect(error.code).toBe('INVALID_API_RESPONSE')
    expect(error.context?.endpoint).toBe('/api/chat')
  })

  it('should create serverError error', () => {
    const error = createApiError.serverError('/api/chat', 500)
    expect(error).toBeInstanceOf(APIError)
    expect(error.code).toBe('SERVER_ERROR')
    expect(error.statusCode).toBe(500)
  })

  it('should create notFound error', () => {
    const error = createApiError.notFound('/api/chat')
    expect(error).toBeInstanceOf(APIError)
    expect(error.code).toBe('API_NOT_FOUND')
    expect(error.statusCode).toBe(404)
  })
})

describe('createAuthError', () => {
  it('should create missingApiKey error', () => {
    const error = createAuthError.missingApiKey()
    expect(error).toBeInstanceOf(AuthenticationError)
    expect(error.code).toBe('MISSING_API_KEY')
  })

  it('should create invalidApiKey error', () => {
    const error = createAuthError.invalidApiKey()
    expect(error).toBeInstanceOf(AuthenticationError)
    expect(error.code).toBe('INVALID_API_KEY')
  })

  it('should create insufficientPermissions error', () => {
    const error = createAuthError.insufficientPermissions('delete_message')
    expect(error).toBeInstanceOf(AuthenticationError)
    expect(error.code).toBe('INSUFFICIENT_PERMISSIONS')
    expect(error.context?.action).toBe('delete_message')
  })
})

describe('createNetworkError', () => {
  it('should create connectionFailed error', () => {
    const error = createNetworkError.connectionFailed('/api/chat')
    expect(error).toBeInstanceOf(NetworkError)
    expect(error.code).toBe('CONNECTION_FAILED')
    expect(error.context?.endpoint).toBe('/api/chat')
  })

  it('should create requestTimeout error', () => {
    const error = createNetworkError.requestTimeout('/api/chat', 5000)
    expect(error).toBeInstanceOf(TimeoutError)
    expect(error.code).toBe('REQUEST_TIMEOUT')
    expect(error.timeout).toBe(5000)
  })

  it('should create offline error', () => {
    const error = createNetworkError.offline()
    expect(error).toBeInstanceOf(NetworkError)
    expect(error.code).toBe('OFFLINE')
  })

  it('should create dnsLookupFailed error', () => {
    const error = createNetworkError.dnsLookupFailed('api.example.com')
    expect(error).toBeInstanceOf(NetworkError)
    expect(error.code).toBe('DNS_LOOKUP_FAILED')
    expect(error.context?.hostname).toBe('api.example.com')
  })
})

describe('createValidationError', () => {
  it('should create invalidInput error', () => {
    const error = createValidationError.invalidInput('email', 'not-an-email', 'email format')
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.code).toBe('INVALID_INPUT')
    expect(error.field).toBe('email')
    expect(error.value).toBe('not-an-email')
    expect(error.expected).toBe('email format')
  })

  it('should create requiredField error', () => {
    const error = createValidationError.requiredField('message')
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.code).toBe('REQUIRED_FIELD_MISSING')
    expect(error.field).toBe('message')
  })

  it('should create valueTooLong error', () => {
    const error = createValidationError.valueTooLong('message', 100, 150)
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.code).toBe('VALUE_TOO_LONG')
    expect(error.field).toBe('message')
    expect(error.context?.maxLength).toBe(100)
    expect(error.context?.actualLength).toBe(150)
  })

  it('should create invalidFormat error', () => {
    const error = createValidationError.invalidFormat('date', 'YYYY-MM-DD')
    expect(error).toBeInstanceOf(ValidationError)
    expect(error.code).toBe('INVALID_FORMAT')
    expect(error.field).toBe('date')
    expect(error.expected).toBe('YYYY-MM-DD')
  })
})

describe('createStreamError', () => {
  it('should create connectionLost error', () => {
    const error = createStreamError.connectionLost()
    expect(error).toBeInstanceOf(StreamError)
    expect(error.code).toBe('STREAM_CONNECTION_LOST')
  })

  it('should create malformedData error', () => {
    const error = createStreamError.malformedData('invalid json data')
    expect(error).toBeInstanceOf(StreamError)
    expect(error.code).toBe('STREAM_MALFORMED_DATA')
    expect(error.context?.receivedData).toBeDefined()
  })

  it('should create streamAborted error', () => {
    const error = createStreamError.streamAborted()
    expect(error).toBeInstanceOf(StreamError)
    expect(error.code).toBe('STREAM_ABORTED')
  })

  it('should create streamTimeout error', () => {
    const error = createStreamError.streamTimeout(30000)
    expect(error).toBeInstanceOf(StreamError)
    expect(error.code).toBe('STREAM_TIMEOUT')
    expect(error.context?.timeout).toBe(30000)
  })
})

describe('createRateLimitError', () => {
  it('should create exceeded error', () => {
    const error = createRateLimitError.exceeded(60, 100)
    expect(error).toBeInstanceOf(RateLimitError)
    expect(error.code).toBe('RATE_LIMIT_EXCEEDED')
    expect(error.retryAfter).toBe(60)
    expect(error.limit).toBe(100)
  })

  it('should create quotaExceeded error', () => {
    const error = createRateLimitError.quotaExceeded(1000, 1000)
    expect(error).toBeInstanceOf(RateLimitError)
    expect(error.code).toBe('QUOTA_EXCEEDED')
    expect(error.limit).toBe(1000)
    expect(error.context?.used).toBe(1000)
  })
})

describe('createTokenLimitError', () => {
  it('should create messageTooLong error', () => {
    const error = createTokenLimitError.messageTooLong(4096, 5000)
    expect(error).toBeInstanceOf(TokenLimitError)
    expect(error.code).toBe('MESSAGE_TOO_LONG')
    expect(error.limit).toBe(4096)
    expect(error.actual).toBe(5000)
  })

  it('should create contextTooLong error', () => {
    const error = createTokenLimitError.contextTooLong(8192, 10000)
    expect(error).toBeInstanceOf(TokenLimitError)
    expect(error.code).toBe('CONTEXT_TOO_LONG')
    expect(error.limit).toBe(8192)
    expect(error.actual).toBe(10000)
  })
})
