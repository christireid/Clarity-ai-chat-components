/**
 * AI Types and Utilities Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createErrorResponse,
  validateSearchParams,
  getStableTimestamp,
  AI_API_VERSION,
  BASE_URL,
  PACKAGE_VERSION,
  CORS_HEADERS,
  CACHE_HEADERS,
  RATE_LIMIT_HEADERS,
  API_RESPONSE_HEADERS,
  VALID_SEARCH_TYPES,
} from '../types'

describe('AI Types Constants', () => {
  it('exports correct API version', () => {
    expect(AI_API_VERSION).toBe('v1')
  })

  it('exports correct base URL', () => {
    expect(BASE_URL).toBe('https://clarity-chat.dev')
  })

  it('exports correct package version', () => {
    expect(PACKAGE_VERSION).toBe('0.1.0')
  })

  it('exports valid search types array', () => {
    expect(VALID_SEARCH_TYPES).toContain('component')
    expect(VALID_SEARCH_TYPES).toContain('hook')
    expect(VALID_SEARCH_TYPES).toContain('guide')
    expect(VALID_SEARCH_TYPES).toContain('example')
    expect(VALID_SEARCH_TYPES).toContain('cookbook')
    expect(VALID_SEARCH_TYPES).toContain('concept')
    expect(VALID_SEARCH_TYPES).toContain('deployment')
    expect(VALID_SEARCH_TYPES).toContain('integration')
  })
})

describe('CORS Headers', () => {
  it('allows all origins', () => {
    expect(CORS_HEADERS['Access-Control-Allow-Origin']).toBe('*')
  })

  it('allows GET and OPTIONS methods', () => {
    expect(CORS_HEADERS['Access-Control-Allow-Methods']).toBe('GET, OPTIONS')
  })

  it('allows required headers', () => {
    expect(CORS_HEADERS['Access-Control-Allow-Headers']).toContain(
      'Content-Type'
    )
  })
})

describe('Cache Headers', () => {
  it('sets public caching', () => {
    expect(CACHE_HEADERS['Cache-Control']).toContain('public')
  })

  it('sets s-maxage for CDN caching', () => {
    expect(CACHE_HEADERS['Cache-Control']).toContain('s-maxage=3600')
  })

  it('enables stale-while-revalidate', () => {
    expect(CACHE_HEADERS['Cache-Control']).toContain('stale-while-revalidate')
  })
})

describe('Rate Limit Headers', () => {
  it('sets rate limit', () => {
    expect(RATE_LIMIT_HEADERS['X-RateLimit-Limit']).toBe('100')
  })

  it('sets rate limit window', () => {
    expect(RATE_LIMIT_HEADERS['X-RateLimit-Window']).toBe('60')
  })
})

describe('API Response Headers', () => {
  it('includes Content-Type', () => {
    expect(API_RESPONSE_HEADERS['Content-Type']).toBe('application/json')
  })

  it('includes CORS headers', () => {
    expect(API_RESPONSE_HEADERS['Access-Control-Allow-Origin']).toBe('*')
  })

  it('includes cache headers', () => {
    expect(API_RESPONSE_HEADERS['Cache-Control']).toBeDefined()
  })

  it('includes rate limit headers', () => {
    expect(API_RESPONSE_HEADERS['X-RateLimit-Limit']).toBeDefined()
  })
})

describe('createErrorResponse', () => {
  it('creates error response with required fields', () => {
    const response = createErrorResponse(
      'TEST_ERROR',
      'Test message',
      '/api/test'
    )

    expect(response.error.code).toBe('TEST_ERROR')
    expect(response.error.message).toBe('Test message')
    expect(response.path).toBe('/api/test')
    expect(response.timestamp).toBeDefined()
  })

  it('includes details when provided', () => {
    const response = createErrorResponse(
      'TEST_ERROR',
      'Test message',
      '/api/test',
      'Additional details'
    )

    expect(response.error.details).toBe('Additional details')
  })

  it('omits details when not provided', () => {
    const response = createErrorResponse(
      'TEST_ERROR',
      'Test message',
      '/api/test'
    )

    expect(response.error.details).toBeUndefined()
  })

  it('generates valid ISO timestamp', () => {
    const response = createErrorResponse(
      'TEST_ERROR',
      'Test message',
      '/api/test'
    )

    // Should be a valid ISO date string
    expect(() => new Date(response.timestamp)).not.toThrow()
  })
})

describe('validateSearchParams', () => {
  it('returns valid for empty params', () => {
    const params = new URLSearchParams()
    const result = validateSearchParams(params)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('returns valid for valid query', () => {
    const params = new URLSearchParams('q=streaming')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(true)
  })

  it('returns error for query too long', () => {
    const longQuery = 'a'.repeat(201)
    const params = new URLSearchParams(`q=${longQuery}`)
    const result = validateSearchParams(params)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'Query parameter "q" must not exceed 200 characters'
    )
  })

  it('accepts query at exactly 200 characters', () => {
    const exactQuery = 'a'.repeat(200)
    const params = new URLSearchParams(`q=${exactQuery}`)
    const result = validateSearchParams(params)

    expect(result.valid).toBe(true)
  })

  it('returns valid for valid type', () => {
    const params = new URLSearchParams('type=component')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(true)
  })

  it('returns error for invalid type', () => {
    const params = new URLSearchParams('type=invalid')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(false)
    expect(result.errors[0]).toContain('Invalid type')
  })

  it('validates all valid types', () => {
    const validTypes = [
      'component',
      'hook',
      'guide',
      'example',
      'cookbook',
      'concept',
      'deployment',
      'integration',
    ]

    validTypes.forEach((type) => {
      const params = new URLSearchParams(`type=${type}`)
      const result = validateSearchParams(params)
      expect(result.valid).toBe(true)
    })
  })

  it('returns valid for valid limit', () => {
    const params = new URLSearchParams('limit=50')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(true)
  })

  it('returns error for limit below 1', () => {
    const params = new URLSearchParams('limit=0')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Limit must be a number between 1 and 100')
  })

  it('returns error for limit above 100', () => {
    const params = new URLSearchParams('limit=101')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Limit must be a number between 1 and 100')
  })

  it('returns error for non-numeric limit', () => {
    const params = new URLSearchParams('limit=abc')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Limit must be a number between 1 and 100')
  })

  it('accumulates multiple errors', () => {
    const params = new URLSearchParams('q=' + 'a'.repeat(201) + '&type=invalid')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(2)
  })

  it('ignores unrelated params', () => {
    const params = new URLSearchParams('foo=bar&category=test')
    const result = validateSearchParams(params)

    expect(result.valid).toBe(true)
  })
})

describe('getStableTimestamp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns ISO formatted string', () => {
    vi.setSystemTime(new Date('2025-01-15T14:30:45.123Z'))
    const timestamp = getStableTimestamp()

    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('rounds to the hour (minutes and seconds are 00)', () => {
    vi.setSystemTime(new Date('2025-01-15T14:30:45.123Z'))
    const timestamp = getStableTimestamp()

    // Should round to hour
    expect(timestamp).toContain('T14:00:00')
  })

  it('produces consistent output for same hour', () => {
    vi.setSystemTime(new Date('2025-01-15T14:15:00.000Z'))
    const timestamp1 = getStableTimestamp()

    vi.setSystemTime(new Date('2025-01-15T14:45:00.000Z'))
    const timestamp2 = getStableTimestamp()

    expect(timestamp1).toBe(timestamp2)
  })

  it('produces different output for different hours', () => {
    vi.setSystemTime(new Date('2025-01-15T14:00:00.000Z'))
    const timestamp1 = getStableTimestamp()

    vi.setSystemTime(new Date('2025-01-15T15:00:00.000Z'))
    const timestamp2 = getStableTimestamp()

    expect(timestamp1).not.toBe(timestamp2)
  })
})
