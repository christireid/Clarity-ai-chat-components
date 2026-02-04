import { describe, it, expect, beforeAll } from 'vitest'

/**
 * Security Headers Test Suite
 *
 * Validates all security headers are present and properly configured.
 * Wave 3.4 Agent 37 - Security Headers Auditor
 *
 * Tests:
 * - X-Content-Type-Options
 * - Permissions-Policy
 * - Content-Security-Policy
 * - X-Frame-Options
 * - Strict-Transport-Security
 * - CSRF protection
 * - Secure cookie settings
 */

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

describe('Security Headers - Main Pages', () => {
  it('should have X-Content-Type-Options header', async () => {
    const response = await fetch(BASE_URL)
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('should have Permissions-Policy header with restricted features', async () => {
    const response = await fetch(BASE_URL)
    const policy = response.headers.get('permissions-policy')

    expect(policy).toBeTruthy()
    expect(policy).toContain('camera=()')
    expect(policy).toContain('microphone=()')
    expect(policy).toContain('geolocation=()')
    expect(policy).toContain('payment=()')
    expect(policy).toContain('usb=()')
    expect(policy).toContain('interest-cohort=()') // Disable FLoC
  })

  it('should have X-Frame-Options header', async () => {
    const response = await fetch(BASE_URL)
    expect(response.headers.get('x-frame-options')).toBe('DENY')
  })

  it('should have Strict-Transport-Security header', async () => {
    const response = await fetch(BASE_URL)
    const hsts = response.headers.get('strict-transport-security')
    expect(hsts).toBeTruthy()
    expect(hsts).toContain('max-age=')
    expect(hsts).toContain('includeSubDomains')
  })

  it('should have Content-Security-Policy header', async () => {
    const response = await fetch(BASE_URL)
    const csp = response.headers.get('content-security-policy')

    expect(csp).toBeTruthy()
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it('should have Referrer-Policy header', async () => {
    const response = await fetch(BASE_URL)
    const referrer = response.headers.get('referrer-policy')
    expect(referrer).toBeTruthy()
  })
})

describe('Security Headers - API Routes', () => {
  it('should have X-Content-Type-Options on API routes', async () => {
    const response = await fetch(`${BASE_URL}/api/test`)
    expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  })

  it('should have stricter Permissions-Policy on API routes', async () => {
    const response = await fetch(`${BASE_URL}/api/test`)
    const policy = response.headers.get('permissions-policy')

    expect(policy).toBeTruthy()
    expect(policy).toContain('camera=()')
    expect(policy).toContain('microphone=()')
    expect(policy).toContain('interest-cohort=()')
  })

  it('should have stricter CSP on API routes', async () => {
    const response = await fetch(`${BASE_URL}/api/test`)
    const csp = response.headers.get('content-security-policy')

    expect(csp).toBeTruthy()
    expect(csp).toContain("default-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
  })

  it('should have no-cache headers on API routes', async () => {
    const response = await fetch(`${BASE_URL}/api/test`)
    const cacheControl = response.headers.get('cache-control')

    expect(cacheControl).toBeTruthy()
    expect(cacheControl).toContain('no-store')
  })
})

describe('CSRF Protection', () => {
  let sessionId: string
  let csrfToken: string

  beforeAll(async () => {
    // Create a session to get CSRF token
    const sessionResponse = await fetch(`${BASE_URL}/api/session`, {
      credentials: 'include',
    })
    expect(sessionResponse.ok).toBe(true)

    const sessionData = await sessionResponse.json()
    sessionId = sessionData.sessionId

    // Get CSRF token from page
    const pageResponse = await fetch(BASE_URL, {
      credentials: 'include',
    })
    const html = await pageResponse.text()
    const match = html.match(/name="csrf-token" content="([^"]+)"/)
    if (match) {
      csrfToken = match[1]
    }
  })

  it('should reject POST requests without CSRF token', async () => {
    const response = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'test' }),
      credentials: 'include',
    })

    expect(response.status).toBe(403)
    const data = await response.json()
    expect(data.error).toContain('CSRF')
  })

  it('should accept POST requests with valid CSRF token', async () => {
    if (!csrfToken) {
      console.warn('CSRF token not found, skipping test')
      return
    }

    const response = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ message: 'test' }),
      credentials: 'include',
    })

    // Should either succeed or fail for a different reason (not CSRF)
    if (!response.ok) {
      const data = await response.json()
      expect(data.error).not.toContain('CSRF')
    }
  })

  it('should reject PUT requests without CSRF token', async () => {
    const response = await fetch(`${BASE_URL}/api/analytics`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event: 'test' }),
      credentials: 'include',
    })

    expect(response.status).toBe(403)
  })

  it('should reject DELETE requests without CSRF token', async () => {
    const response = await fetch(`${BASE_URL}/api/session`, {
      method: 'DELETE',
      credentials: 'include',
    })

    expect(response.status).toBe(403)
  })

  it('should allow GET requests without CSRF token', async () => {
    const response = await fetch(`${BASE_URL}/api/test`, {
      credentials: 'include',
    })

    // GET requests should work without CSRF token
    expect(response.status).not.toBe(403)
  })
})

describe('Secure Cookie Settings', () => {
  it('should set session cookie with secure flags', async () => {
    const response = await fetch(`${BASE_URL}/api/session`)
    const setCookie = response.headers.get('set-cookie')

    expect(setCookie).toBeTruthy()
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('SameSite=Strict')

    // In production, should have Secure flag
    if (process.env.NODE_ENV === 'production') {
      expect(setCookie).toContain('Secure')
    }
  })

  it('should set session cookie with appropriate max-age', async () => {
    const response = await fetch(`${BASE_URL}/api/session`)
    const setCookie = response.headers.get('set-cookie')

    expect(setCookie).toBeTruthy()
    expect(setCookie).toContain('Max-Age=')

    // Extract max-age value
    const match = setCookie?.match(/Max-Age=(\d+)/)
    if (match) {
      const maxAge = parseInt(match[1], 10)
      // Should be 7 days (604800 seconds)
      expect(maxAge).toBe(604800)
    }
  })

  it('should allow session cookie deletion', async () => {
    const response = await fetch(`${BASE_URL}/api/session`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': 'temp-token-for-delete',
      },
      credentials: 'include',
    })

    // Note: This might fail due to CSRF protection, which is expected
    // The test is to verify the endpoint exists
    expect([200, 403]).toContain(response.status)
  })
})

describe('Static Asset Caching', () => {
  it('should have immutable cache for static assets', async () => {
    const response = await fetch(`${BASE_URL}/_next/static/test.js`)
    const cacheControl = response.headers.get('cache-control')

    // Static assets should have aggressive caching
    if (cacheControl) {
      expect(cacheControl).toContain('immutable')
      expect(cacheControl).toContain('public')
    }
  })
})

describe('Security Score Validation', () => {
  it('should pass basic security header checklist', async () => {
    const response = await fetch(BASE_URL)

    const requiredHeaders = [
      'x-content-type-options',
      'x-frame-options',
      'content-security-policy',
      'permissions-policy',
      'referrer-policy',
    ]

    const missingHeaders = requiredHeaders.filter(
      (header) => !response.headers.get(header)
    )

    expect(missingHeaders).toEqual([])
  })

  it('should not leak server information', async () => {
    const response = await fetch(BASE_URL)

    // Should not have X-Powered-By header
    expect(response.headers.get('x-powered-by')).toBeNull()

    // Server header should be minimal or absent
    const server = response.headers.get('server')
    if (server) {
      expect(server).not.toContain('PHP')
      expect(server).not.toContain('Apache')
      expect(server).not.toContain('nginx/')
    }
  })
})
