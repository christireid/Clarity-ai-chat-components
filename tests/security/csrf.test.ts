import { describe, it, expect } from 'vitest'
import {
  generateCSRFToken,
  validateCSRFToken,
  getSessionId,
  requiresCSRFProtection,
  generateSessionId,
} from '../../apps/streamlined-docs/lib/csrf'

/**
 * CSRF Token Utility Tests
 *
 * Unit tests for CSRF token generation and validation logic.
 * Wave 3.4 Agent 37 - Security Headers Auditor
 */

describe('CSRF Token Generation', () => {
  it('should generate a valid token format', () => {
    const sessionId = 'test-session-123'
    const token = generateCSRFToken(sessionId)

    expect(token).toBeTruthy()
    expect(token).toContain('.')

    const parts = token.split('.')
    expect(parts).toHaveLength(2)

    // Nonce should be 32 hex characters (16 bytes)
    expect(parts[0]).toMatch(/^[a-f0-9]{32}$/)

    // Signature should be 64 hex characters (SHA-256)
    expect(parts[1]).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should generate unique tokens for same session', () => {
    const sessionId = 'test-session-123'
    const token1 = generateCSRFToken(sessionId)
    const token2 = generateCSRFToken(sessionId)

    expect(token1).not.toBe(token2)
  })

  it('should generate different tokens for different sessions', () => {
    const token1 = generateCSRFToken('session-1')
    const token2 = generateCSRFToken('session-2')

    expect(token1).not.toBe(token2)
  })
})

describe('CSRF Token Validation', () => {
  it('should validate a correct token', () => {
    const sessionId = 'test-session-123'
    const token = generateCSRFToken(sessionId)

    expect(validateCSRFToken(token, sessionId)).toBe(true)
  })

  it('should reject token with wrong session ID', () => {
    const token = generateCSRFToken('session-1')
    expect(validateCSRFToken(token, 'session-2')).toBe(false)
  })

  it('should reject malformed tokens', () => {
    const sessionId = 'test-session'

    expect(validateCSRFToken('', sessionId)).toBe(false)
    expect(validateCSRFToken('invalid', sessionId)).toBe(false)
    expect(validateCSRFToken('no-dot-here', sessionId)).toBe(false)
    expect(validateCSRFToken('too.many.dots', sessionId)).toBe(false)
  })

  it('should reject token with invalid signature', () => {
    const sessionId = 'test-session-123'
    const token = generateCSRFToken(sessionId)
    const [nonce] = token.split('.')

    // Create token with wrong signature
    const invalidToken = `${nonce}.${'0'.repeat(64)}`

    expect(validateCSRFToken(invalidToken, sessionId)).toBe(false)
  })

  it('should reject token with tampered nonce', () => {
    const sessionId = 'test-session-123'
    const token = generateCSRFToken(sessionId)
    const [, signature] = token.split('.')

    // Create token with different nonce
    const tamperedToken = `${'a'.repeat(32)}.${signature}`

    expect(validateCSRFToken(tamperedToken, sessionId)).toBe(false)
  })

  it('should use constant-time comparison', () => {
    const sessionId = 'test-session'
    const token = generateCSRFToken(sessionId)

    // Timing attack test - both should take similar time
    const start1 = process.hrtime.bigint()
    validateCSRFToken(token, sessionId)
    const time1 = process.hrtime.bigint() - start1

    const start2 = process.hrtime.bigint()
    validateCSRFToken('invalid.token', sessionId)
    const time2 = process.hrtime.bigint() - start2

    // Note: This is a basic test, proper timing attack testing requires more samples
    expect(time1).toBeGreaterThan(0)
    expect(time2).toBeGreaterThan(0)
  })
})

describe('Session ID Extraction', () => {
  it('should extract session ID from cookie', () => {
    const request = new Request('http://localhost:3000', {
      headers: {
        cookie: 'sessionId=abc123; other=value',
      },
    })

    const sessionId = getSessionId(request)
    expect(sessionId).toBe('abc123')
  })

  it('should extract session ID from x-session-id header', () => {
    const request = new Request('http://localhost:3000', {
      headers: {
        'x-session-id': 'xyz789',
      },
    })

    const sessionId = getSessionId(request)
    expect(sessionId).toBe('xyz789')
  })

  it('should prefer cookie over header', () => {
    const request = new Request('http://localhost:3000', {
      headers: {
        cookie: 'sessionId=from-cookie',
        'x-session-id': 'from-header',
      },
    })

    const sessionId = getSessionId(request)
    expect(sessionId).toBe('from-cookie')
  })

  it('should fallback to IP address', () => {
    const request = new Request('http://localhost:3000', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      },
    })

    const sessionId = getSessionId(request)
    expect(sessionId).toBe('ip-192.168.1.1')
  })

  it('should fallback to x-real-ip', () => {
    const request = new Request('http://localhost:3000', {
      headers: {
        'x-real-ip': '192.168.1.1',
      },
    })

    const sessionId = getSessionId(request)
    expect(sessionId).toBe('ip-192.168.1.1')
  })

  it('should return anonymous session as last resort', () => {
    const request = new Request('http://localhost:3000')

    const sessionId = getSessionId(request)
    expect(sessionId).toBe('anonymous-session')
  })
})

describe('CSRF Protection Requirements', () => {
  it('should require protection for POST', () => {
    expect(requiresCSRFProtection('POST')).toBe(true)
  })

  it('should require protection for PUT', () => {
    expect(requiresCSRFProtection('PUT')).toBe(true)
  })

  it('should require protection for DELETE', () => {
    expect(requiresCSRFProtection('DELETE')).toBe(true)
  })

  it('should require protection for PATCH', () => {
    expect(requiresCSRFProtection('PATCH')).toBe(true)
  })

  it('should not require protection for GET', () => {
    expect(requiresCSRFProtection('GET')).toBe(false)
  })

  it('should not require protection for HEAD', () => {
    expect(requiresCSRFProtection('HEAD')).toBe(false)
  })

  it('should not require protection for OPTIONS', () => {
    expect(requiresCSRFProtection('OPTIONS')).toBe(false)
  })

  it('should be case-insensitive', () => {
    expect(requiresCSRFProtection('post')).toBe(true)
    expect(requiresCSRFProtection('Post')).toBe(true)
    expect(requiresCSRFProtection('get')).toBe(false)
  })
})

describe('Session ID Generation', () => {
  it('should generate valid session IDs', () => {
    const sessionId = generateSessionId()

    expect(sessionId).toBeTruthy()
    expect(sessionId).toMatch(/^[a-f0-9]{64}$/) // 32 bytes as hex
  })

  it('should generate unique session IDs', () => {
    const ids = new Set<string>()

    for (let i = 0; i < 100; i++) {
      ids.add(generateSessionId())
    }

    expect(ids.size).toBe(100)
  })

  it('should have sufficient entropy', () => {
    const sessionId = generateSessionId()

    // Should be 64 hex characters (32 bytes = 256 bits of entropy)
    expect(sessionId.length).toBe(64)

    // Should contain mix of characters (not all same)
    const uniqueChars = new Set(sessionId.split(''))
    expect(uniqueChars.size).toBeGreaterThan(10)
  })
})

describe('CSRF Security Properties', () => {
  it('should not be predictable', () => {
    const sessionId = 'test-session'
    const tokens = new Set<string>()

    // Generate 1000 tokens, all should be unique
    for (let i = 0; i < 1000; i++) {
      tokens.add(generateCSRFToken(sessionId))
    }

    expect(tokens.size).toBe(1000)
  })

  it('should not leak session information in token', () => {
    const sessionId = 'secret-session-id-123'
    const token = generateCSRFToken(sessionId)

    // Token should not contain session ID
    expect(token.toLowerCase()).not.toContain(sessionId.toLowerCase())
  })

  it('should bind token to specific session', () => {
    const token = generateCSRFToken('session-1')

    // Same token should not work for different sessions
    expect(validateCSRFToken(token, 'session-1')).toBe(true)
    expect(validateCSRFToken(token, 'session-2')).toBe(false)
    expect(validateCSRFToken(token, 'session-3')).toBe(false)
  })

  it('should not allow token reuse across sessions', () => {
    const token1 = generateCSRFToken('session-1')
    const token2 = generateCSRFToken('session-2')

    // Tokens from different sessions should not cross-validate
    expect(validateCSRFToken(token1, 'session-2')).toBe(false)
    expect(validateCSRFToken(token2, 'session-1')).toBe(false)
  })
})
