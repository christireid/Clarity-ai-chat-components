/**
 * API Errors Tests
 */
import { describe, it, expect } from 'vitest'
import {
  APIKeyMissingError,
  APIRateLimitError,
  APIAuthenticationError,
  APINetworkError,
  APIResponseError
} from '../api-errors'
import { ClarityError } from '../base-error'

describe('APIKeyMissingError', () => {
  it('should create error for OpenAI provider', () => {
    const error = new APIKeyMissingError('openai')

    expect(error.code).toBe('API_KEY_MISSING')
    expect(error.userMessage).toContain('OPENAI')
    expect(error.technicalMessage).toContain('OPENAI_API_KEY')
    expect(error.context.data?.provider).toBe('openai')
  })

  it('should create error for Anthropic provider', () => {
    const error = new APIKeyMissingError('anthropic')

    expect(error.userMessage).toContain('ANTHROPIC')
    expect(error.technicalMessage).toContain('ANTHROPIC_API_KEY')
    expect(error.context.data?.provider).toBe('anthropic')
  })

  it('should create error for Google provider', () => {
    const error = new APIKeyMissingError('google')

    expect(error.userMessage).toContain('GOOGLE')
    expect(error.technicalMessage).toContain('GOOGLE_AI_API_KEY')
    expect(error.context.data?.provider).toBe('google')
  })

  it('should include helpful solutions', () => {
    const error = new APIKeyMissingError('openai')

    expect(error.solutions.length).toBeGreaterThan(0)
    expect(error.solutions[0].description).toContain('environment')
    expect(error.solutions[0].steps).toBeDefined()
    expect(error.solutions[0].steps?.length).toBeGreaterThan(0)
  })

  it('should include docs URL', () => {
    const error = new APIKeyMissingError('openai')
    const solutionWithDocs = error.solutions.find((s) => s.docsUrl)

    expect(solutionWithDocs).toBeDefined()
    expect(solutionWithDocs?.docsUrl).toContain('openai')
  })

  it('should preserve original error', () => {
    const originalError = new Error('Original')
    const error = new APIKeyMissingError('openai', originalError)

    expect(error.originalError).toBe(originalError)
  })

  it('should be instance of ClarityError', () => {
    const error = new APIKeyMissingError('openai')
    expect(error).toBeInstanceOf(ClarityError)
  })
})

describe('APIRateLimitError', () => {
  it('should create error with provider', () => {
    const error = new APIRateLimitError('openai')

    expect(error.code).toBe('API_RATE_LIMIT')
    expect(error.userMessage).toContain('openai')
    expect(error.userMessage).toContain('rate limit')
  })

  it('should include retry time when provided', () => {
    const error = new APIRateLimitError('openai', 30)

    expect(error.technicalMessage).toContain('30')
    expect(error.context.data?.retryAfter).toBe(30)
  })

  it('should handle missing retry time', () => {
    const error = new APIRateLimitError('openai')

    expect(error.context.data?.retryAfter).toBeUndefined()
  })

  it('should include exponential backoff solution', () => {
    const error = new APIRateLimitError('openai')
    const backoffSolution = error.solutions.find((s) =>
      s.description.toLowerCase().includes('backoff')
    )

    expect(backoffSolution).toBeDefined()
    expect(backoffSolution?.example).toContain('await')
  })

  it('should preserve original error', () => {
    const originalError = new Error('429 Too Many Requests')
    const error = new APIRateLimitError('openai', 60, originalError)

    expect(error.originalError).toBe(originalError)
  })
})

describe('APIAuthenticationError', () => {
  it('should create error with provider', () => {
    const error = new APIAuthenticationError('anthropic')

    expect(error.code).toBe('API_AUTHENTICATION_FAILED')
    expect(error.userMessage).toContain('Authentication failed')
    expect(error.userMessage).toContain('anthropic')
  })

  it('should include verification steps', () => {
    const error = new APIAuthenticationError('openai')

    expect(error.solutions[0].steps).toContain('Check .env.local for typos')
  })

  it('should include example of correct format', () => {
    const error = new APIAuthenticationError('openai')
    const formatSolution = error.solutions.find((s) => s.example)

    expect(formatSolution?.example).toContain('OPENAI_API_KEY')
  })

  it('should suggest generating new key', () => {
    const error = new APIAuthenticationError('anthropic')
    const newKeySolution = error.solutions.find((s) =>
      s.description.includes('Generate a new')
    )

    expect(newKeySolution).toBeDefined()
    expect(newKeySolution?.steps).toBeDefined()
  })
})

describe('APINetworkError', () => {
  it('should create network error', () => {
    const error = new APINetworkError('openai')

    expect(error.code).toBe('API_NETWORK_ERROR')
    expect(error.userMessage).toContain('Network error')
    expect(error.context.location).toBe('Network layer')
  })

  it('should suggest checking internet connection', () => {
    const error = new APINetworkError('google')

    const connectionSolution = error.solutions.find((s) =>
      s.description.includes('internet connection')
    )
    expect(connectionSolution).toBeDefined()
  })

  it('should suggest checking service status', () => {
    const error = new APINetworkError('openai')

    const statusSolution = error.solutions.find((s) =>
      s.description.includes('service is down')
    )
    expect(statusSolution).toBeDefined()
    expect(statusSolution?.docsUrl).toContain('status')
  })

  it('should include proxy configuration example', () => {
    const error = new APINetworkError('openai')

    const proxySolution = error.solutions.find((s) =>
      s.description.includes('proxy')
    )
    expect(proxySolution?.example).toContain('HttpsProxyAgent')
  })
})

describe('APIResponseError', () => {
  it('should create error with status code', () => {
    const error = new APIResponseError('openai', 500, { error: 'Internal error' })

    expect(error.code).toBe('API_RESPONSE_ERROR')
    expect(error.userMessage).toContain('500')
    expect(error.technicalMessage).toContain('500')
  })

  it('should include response body in context', () => {
    const responseBody = { error: { message: 'Bad request', code: 'invalid' } }
    const error = new APIResponseError('anthropic', 400, responseBody)

    expect(error.context.data?.responseBody).toEqual(responseBody)
    expect(error.context.data?.statusCode).toBe(400)
  })

  it('should include docs URL for error codes', () => {
    const error = new APIResponseError('openai', 422, {})

    expect(error.solutions[0].docsUrl).toContain('/errors')
  })

  it('should preserve original error', () => {
    const originalError = new Error('Fetch failed')
    const error = new APIResponseError('google', 503, {}, originalError)

    expect(error.originalError).toBe(originalError)
  })

  it('should handle various status codes', () => {
    const error400 = new APIResponseError('openai', 400, {})
    const error404 = new APIResponseError('openai', 404, {})
    const error500 = new APIResponseError('openai', 500, {})

    expect(error400.userMessage).toContain('400')
    expect(error404.userMessage).toContain('404')
    expect(error500.userMessage).toContain('500')
  })
})
