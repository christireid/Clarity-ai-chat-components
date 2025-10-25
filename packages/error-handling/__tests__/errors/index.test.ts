import { describe, it, expect } from 'vitest'
import {
  ClarityChatError,
  ConfigurationError,
  APIError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  StreamError,
  TokenLimitError,
  NetworkError,
  TimeoutError,
  ComponentError,
} from '../../src/errors'

describe('ClarityChatError', () => {
  it('should create error with message and code', () => {
    const error = new ClarityChatError('Test error', {
      code: 'TEST_ERROR',
    })

    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_ERROR')
    expect(error.name).toBe('ClarityChatError')
  })

  it('should include solution when provided', () => {
    const error = new ClarityChatError('Test error', {
      code: 'TEST_ERROR',
      solution: 'Try this fix',
    })

    expect(error.solution).toBe('Try this fix')
  })

  it('should include docs link when provided', () => {
    const error = new ClarityChatError('Test error', {
      code: 'TEST_ERROR',
      docs: 'https://example.com/docs',
    })

    expect(error.docs).toBe('https://example.com/docs')
  })

  it('should include context when provided', () => {
    const context = { userId: '123', action: 'delete' }
    const error = new ClarityChatError('Test error', {
      code: 'TEST_ERROR',
      context,
    })

    expect(error.context).toEqual(context)
  })

  it('should format toString with all information', () => {
    const error = new ClarityChatError('Test error', {
      code: 'TEST_ERROR',
      solution: 'Try this fix',
      docs: 'https://example.com/docs',
      context: { key: 'value' },
    })

    const str = error.toString()
    expect(str).toContain('ClarityChatError [TEST_ERROR]: Test error')
    expect(str).toContain('💡 Solution: Try this fix')
    expect(str).toContain('📚 Documentation: https://example.com/docs')
    expect(str).toContain('🔍 Context:')
    expect(str).toContain('"key": "value"')
  })

  it('should serialize to JSON', () => {
    const error = new ClarityChatError('Test error', {
      code: 'TEST_ERROR',
      solution: 'Try this fix',
      context: { key: 'value' },
    })

    const json = error.toJSON()
    expect(json.name).toBe('ClarityChatError')
    expect(json.code).toBe('TEST_ERROR')
    expect(json.message).toBe('Test error')
    expect(json.solution).toBe('Try this fix')
    expect(json.context).toEqual({ key: 'value' })
    expect(json.stack).toBeDefined()
  })
})

describe('ConfigurationError', () => {
  it('should create configuration error', () => {
    const error = new ConfigurationError('Invalid config', {
      code: 'INVALID_CONFIG',
    })

    expect(error.name).toBe('ConfigurationError')
    expect(error.message).toBe('Invalid config')
    expect(error.code).toBe('INVALID_CONFIG')
    expect(error instanceof ClarityChatError).toBe(true)
  })
})

describe('APIError', () => {
  it('should create API error with status code', () => {
    const error = new APIError('Request failed', {
      code: 'API_ERROR',
      statusCode: 500,
    })

    expect(error.name).toBe('APIError')
    expect(error.statusCode).toBe(500)
    expect(error instanceof ClarityChatError).toBe(true)
  })
})

describe('AuthenticationError', () => {
  it('should create authentication error', () => {
    const error = new AuthenticationError('Invalid credentials', {
      code: 'AUTH_ERROR',
    })

    expect(error.name).toBe('AuthenticationError')
    expect(error instanceof ClarityChatError).toBe(true)
  })
})

describe('RateLimitError', () => {
  it('should create rate limit error with retry info', () => {
    const error = new RateLimitError('Too many requests', {
      code: 'RATE_LIMIT',
      retryAfter: 60,
      limit: 100,
      remaining: 0,
    })

    expect(error.name).toBe('RateLimitError')
    expect(error.retryAfter).toBe(60)
    expect(error.limit).toBe(100)
    expect(error.remaining).toBe(0)
  })
})

describe('ValidationError', () => {
  it('should create validation error with field info', () => {
    const error = new ValidationError('Invalid input', {
      code: 'VALIDATION_ERROR',
      field: 'email',
      value: 'not-an-email',
      expected: 'email format',
    })

    expect(error.name).toBe('ValidationError')
    expect(error.field).toBe('email')
    expect(error.value).toBe('not-an-email')
    expect(error.expected).toBe('email format')
  })
})

describe('StreamError', () => {
  it('should create stream error', () => {
    const error = new StreamError('Connection lost', {
      code: 'STREAM_ERROR',
    })

    expect(error.name).toBe('StreamError')
    expect(error instanceof ClarityChatError).toBe(true)
  })
})

describe('TokenLimitError', () => {
  it('should create token limit error', () => {
    const error = new TokenLimitError('Token limit exceeded', {
      code: 'TOKEN_LIMIT',
      limit: 4096,
      actual: 5000,
    })

    expect(error.name).toBe('TokenLimitError')
    expect(error.limit).toBe(4096)
    expect(error.actual).toBe(5000)
  })
})

describe('NetworkError', () => {
  it('should create network error', () => {
    const error = new NetworkError('Connection failed', {
      code: 'NETWORK_ERROR',
    })

    expect(error.name).toBe('NetworkError')
    expect(error instanceof ClarityChatError).toBe(true)
  })
})

describe('TimeoutError', () => {
  it('should create timeout error', () => {
    const error = new TimeoutError('Request timed out', {
      code: 'TIMEOUT',
      timeout: 5000,
    })

    expect(error.name).toBe('TimeoutError')
    expect(error.timeout).toBe(5000)
  })
})

describe('ComponentError', () => {
  it('should create component error', () => {
    const error = new ComponentError('Component failed', {
      code: 'COMPONENT_ERROR',
      componentName: 'ChatContainer',
    })

    expect(error.name).toBe('ComponentError')
    expect(error.componentName).toBe('ChatContainer')
  })
})
