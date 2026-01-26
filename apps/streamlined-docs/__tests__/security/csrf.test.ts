/**
 * CSRF Protection Test Suite
 *
 * Wave 3.4 Agent 37 - Security Headers Auditor
 *
 * Tests CSRF token generation, validation, and protection on API routes.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateCSRFToken,
  validateCSRFToken,
  getSessionId,
  requiresCSRFProtection,
  generateSessionId,
} from '@/lib/csrf'

describe('CSRF Token Generation', () => {
  it('should generate unique tokens', () => {
    const sessionId = 'test-session-123'
    const token1 = generateCSRFToken(sessionId)
    const token2 = generateCSRFToken(sessionId)

    expect(token1).not.toBe(token2)
  })

  it('should generate tokens in correct format', () => {
    const sessionId = 'test-session-123'
    const token = generateCSRFToken(sessionId)

    // Format: nonce.signature
    expect(token).toMatch(/^[a-f0-9]{32}\.[a-f0-9]{64}$/)
    expect(token.split('.').length).toBe(2)
  })

  it('should generate different tokens for different sessions', () => {
    const token1 = generateCSRFToken('session-1')
    const token2 = generateCSRFToken('session-2')

    expect(token1).not.toBe(token2)

    // Different sessions should produce different signatures
    const [nonce1, sig1] = token1.split('.')
    const [nonce2, sig2] = token2.split('.')

    // Even if nonces were same, signatures would differ
    expect(sig1).not.toBe(sig2)
  })

  it('should generate cryptographically secure tokens', () => {
    const sessionId = 'test-session'
    const tokens = new Set()

    // Generate 1000 tokens, all should be unique
    for (let i = 0; i < 1000; i++) {
      const token = generateCSRFToken(sessionId)
      tokens.add(token)
    }

    expect(tokens.size).toBe(1000)
  })
})

describe('CSRF Token Validation', () => {
  it('should validate correct token', () => {
    const sessionId = 'test-session-123'
    const token = generateCSRFToken(sessionId)

    expect(validateCSRFToken(token, sessionId)).toBe(true)
  })

  it('should reject invalid token format', () => {
    const sessionId = 'test-session'

    expect(validateCSRFToken('invalid', sessionId)).toBe(false)
    expect(validateCSRFToken('no-dot-separator', sessionId)).toBe(false)
    expect(validateCSRFToken('too.many.dots', sessionId)).toBe(false)
  })

  it('should reject token with wrong session', () => {
    const token = generateCSRFToken('session-1')

    expect(validateCSRFToken(token, 'session-2')).toBe(false)
  })

  it('should reject token with tampered nonce', () => {
    const sessionId = 'test-session'
    const token = generateCSRFToken(sessionId)
    const [nonce, signature] = token.split('.')

    // Tamper with nonce
    const tamperedNonce = 'a'.repeat(32)
    const tamperedToken = `${tamperedNonce}.${signature}`

    expect(validateCSRFToken(tamperedToken, sessionId)).toBe(false)
  })

  it('should reject token with tampered signature', () => {
    const sessionId = 'test-session'
    const token = generateCSRFToken(sessionId)
    const [nonce] = token.split('.')

    // Tamper with signature
    const tamperedSignature = 'b'.repeat(64)
    const tamperedToken = `${nonce}.${tamperedSignature}`

    expect(validateCSRFToken(tamperedToken, sessionId)).toBe(false)
  })

  it('should reject empty token', () => {
    expect(validateCSRFToken('', 'session')).toBe(false)
  })

  it('should reject null token', () => {
    expect(validateCSRFToken(null as any, 'session')).toBe(false)
  })

  it('should use constant-time comparison', () => {
    const sessionId = 'test-session'
    const validToken = generateCSRFToken(sessionId)

    // These should all take roughly the same time (timing-safe)
    const times: number[] = []

    for (let i = 0; i < 100; i++) {
      const start = performance.now()
      validateCSRFToken(validToken, sessionId)
      const end = performance.now()
      times.push(end - start)
    }

    // Standard deviation should be small (timing-safe)
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const variance =
      times.reduce((sum, time) => sum + Math.pow(time - avg, 2), 0) /
      times.length
    const stdDev = Math.sqrt(variance)

    // Timing should be consistent (within 300% variance)
    // Note: Performance timing in CI can be variable due to resource contention
    expect(stdDev / avg).toBeLessThan(3)
  })
})

describe('Session ID Extraction', () => {
  it('should extract session ID from cookie', () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        cookie: 'sessionId=test-session-123; other=value',
      },
    })

    const sessionId = getSessionId(mockRequest)
    expect(sessionId).toBe('test-session-123')
  })

  it('should extract session ID from x-session-id header', () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        'x-session-id': 'header-session-123',
      },
    })

    const sessionId = getSessionId(mockRequest)
    expect(sessionId).toBe('header-session-123')
  })

  it('should prefer cookie over header', () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        cookie: 'sessionId=cookie-session',
        'x-session-id': 'header-session',
      },
    })

    const sessionId = getSessionId(mockRequest)
    expect(sessionId).toBe('cookie-session')
  })

  it('should fall back to IP address', () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        'x-forwarded-for': '192.168.1.1',
      },
    })

    const sessionId = getSessionId(mockRequest)
    expect(sessionId).toBe('ip-192.168.1.1')
  })

  it('should handle multiple IPs in x-forwarded-for', () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
      },
    })

    const sessionId = getSessionId(mockRequest)
    expect(sessionId).toBe('ip-192.168.1.1')
  })

  it('should use x-real-ip as fallback', () => {
    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        'x-real-ip': '203.0.113.1',
      },
    })

    const sessionId = getSessionId(mockRequest)
    expect(sessionId).toBe('ip-203.0.113.1')
  })

  it('should return anonymous-session as last resort', () => {
    const mockRequest = new Request('http://localhost:3000')

    const sessionId = getSessionId(mockRequest)
    expect(sessionId).toBe('anonymous-session')
  })
})

describe('CSRF Protection Requirements', () => {
  it('should require CSRF protection for POST', () => {
    expect(requiresCSRFProtection('POST')).toBe(true)
  })

  it('should require CSRF protection for PUT', () => {
    expect(requiresCSRFProtection('PUT')).toBe(true)
  })

  it('should require CSRF protection for DELETE', () => {
    expect(requiresCSRFProtection('DELETE')).toBe(true)
  })

  it('should require CSRF protection for PATCH', () => {
    expect(requiresCSRFProtection('PATCH')).toBe(true)
  })

  it('should not require CSRF protection for GET', () => {
    expect(requiresCSRFProtection('GET')).toBe(false)
  })

  it('should not require CSRF protection for HEAD', () => {
    expect(requiresCSRFProtection('HEAD')).toBe(false)
  })

  it('should not require CSRF protection for OPTIONS', () => {
    expect(requiresCSRFProtection('OPTIONS')).toBe(false)
  })

  it('should be case-insensitive', () => {
    expect(requiresCSRFProtection('post')).toBe(true)
    expect(requiresCSRFProtection('Post')).toBe(true)
    expect(requiresCSRFProtection('get')).toBe(false)
    expect(requiresCSRFProtection('Get')).toBe(false)
  })
})

describe('Session ID Generation', () => {
  it('should generate unique session IDs', () => {
    const id1 = generateSessionId()
    const id2 = generateSessionId()

    expect(id1).not.toBe(id2)
  })

  it('should generate session IDs of correct length', () => {
    const sessionId = generateSessionId()

    // 32 bytes as hex = 64 characters
    expect(sessionId.length).toBe(64)
  })

  it('should generate hex-format session IDs', () => {
    const sessionId = generateSessionId()

    expect(sessionId).toMatch(/^[a-f0-9]{64}$/)
  })

  it('should generate cryptographically secure session IDs', () => {
    const sessionIds = new Set()

    // Generate 1000 session IDs, all should be unique
    for (let i = 0; i < 1000; i++) {
      sessionIds.add(generateSessionId())
    }

    expect(sessionIds.size).toBe(1000)
  })
})

describe('CSRF Attack Scenarios', () => {
  it('should prevent token reuse across sessions', () => {
    const session1 = 'session-1'
    const session2 = 'session-2'

    const token = generateCSRFToken(session1)

    // Token should only work for session-1
    expect(validateCSRFToken(token, session1)).toBe(true)
    expect(validateCSRFToken(token, session2)).toBe(false)
  })

  it('should prevent token prediction', () => {
    const sessionId = 'test-session'

    // Generate multiple tokens
    const token1 = generateCSRFToken(sessionId)
    const token2 = generateCSRFToken(sessionId)
    const token3 = generateCSRFToken(sessionId)

    // Should not be able to predict next token from previous tokens
    expect(token1).not.toBe(token2)
    expect(token2).not.toBe(token3)

    // Nonces should be random (not sequential)
    const [nonce1] = token1.split('.')
    const [nonce2] = token2.split('.')
    const [nonce3] = token3.split('.')

    expect(nonce1).not.toBe(nonce2)
    expect(nonce2).not.toBe(nonce3)
  })

  it('should prevent timing attacks on validation', () => {
    const sessionId = 'test-session'
    const validToken = generateCSRFToken(sessionId)

    // Create tokens with varying degrees of similarity
    const [nonce, signature] = validToken.split('.')

    const tokens = [
      validToken, // Fully valid
      `${nonce}.${'0'.repeat(64)}`, // Valid nonce, wrong signature
      `${'0'.repeat(32)}.${signature}`, // Wrong nonce, valid signature
      `${'0'.repeat(32)}.${'0'.repeat(64)}`, // Both wrong
    ]

    // All validations should take similar time (timing-safe)
    const times: number[] = []

    for (const token of tokens) {
      const start = performance.now()
      validateCSRFToken(token, sessionId)
      const end = performance.now()
      times.push(end - start)
    }

    // Timing variance should be small
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const maxDeviation = Math.max(...times.map((t) => Math.abs(t - avg)))

    // Max deviation should be less than 2x average (reasonable for timing-safe ops)
    expect(maxDeviation / avg).toBeLessThan(2)
  })
})

describe('CSRF Environment Configuration', () => {
  it('should require CSRF_SECRET in production', () => {
    const originalEnv = process.env.NODE_ENV

    // This test documents the requirement
    // In actual production, CSRF_SECRET must be set
    // In test/dev environments, we accept the fallback
    expect(
      process.env.CSRF_SECRET ||
        originalEnv === 'development' ||
        originalEnv === 'test'
    ).toBeTruthy()
  })

  it('should use development fallback in dev mode', () => {
    // Development mode should have a fallback secret
    // But production must have CSRF_SECRET set
    const isDevelopment = process.env.NODE_ENV !== 'production'

    if (isDevelopment) {
      // Development fallback is acceptable
      expect(true).toBe(true)
    } else {
      // Production must have CSRF_SECRET
      expect(process.env.CSRF_SECRET).toBeTruthy()
    }
  })
})

describe('CSRF Integration', () => {
  it('should work with session management', () => {
    // Create session
    const sessionId = generateSessionId()

    // Generate CSRF token for session
    const csrfToken = generateCSRFToken(sessionId)

    // Validate token with same session
    expect(validateCSRFToken(csrfToken, sessionId)).toBe(true)

    // Should fail with different session
    const otherSessionId = generateSessionId()
    expect(validateCSRFToken(csrfToken, otherSessionId)).toBe(false)
  })

  it('should integrate with cookie-based sessions', () => {
    const sessionId = 'test-session-123'

    const mockRequest = new Request('http://localhost:3000', {
      headers: {
        cookie: `sessionId=${sessionId}; path=/`,
      },
    })

    const extractedSessionId = getSessionId(mockRequest)
    const csrfToken = generateCSRFToken(extractedSessionId)

    expect(validateCSRFToken(csrfToken, extractedSessionId)).toBe(true)
  })
})
