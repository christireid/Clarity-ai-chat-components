import { randomBytes, createHmac, timingSafeEqual } from 'crypto'

/**
 * CSRF Token Utility
 *
 * Provides secure CSRF token generation and validation to prevent
 * Cross-Site Request Forgery attacks on API routes.
 *
 * Wave 3.4 Agent 37 - Security Headers Auditor
 */

// Use environment variable or generate a secure fallback
const CSRF_SECRET =
  process.env.CSRF_SECRET ||
  (() => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'CSRF_SECRET must be set in production environment. Generate one with: openssl rand -hex 32'
      )
    }
    // Development-only fallback
    return 'dev-csrf-secret-change-in-production-5f8a2b3c4d1e6f7a8b9c0d1e2f3a4b5c'
  })()

/**
 * Generate a CSRF token for the current session
 *
 * Token format: nonce.signature
 * - nonce: Random 16-byte hex string
 * - signature: HMAC-SHA256 of sessionId:nonce
 *
 * @param sessionId - Unique identifier for the session (from cookie or header)
 * @returns CSRF token string
 */
export function generateCSRFToken(sessionId: string): string {
  const nonce = randomBytes(16).toString('hex')
  const hmac = createHmac('sha256', CSRF_SECRET)
  hmac.update(`${sessionId}:${nonce}`)
  const signature = hmac.digest('hex')

  return `${nonce}.${signature}`
}

/**
 * Validate a CSRF token against the current session
 *
 * Uses constant-time comparison to prevent timing attacks.
 *
 * @param token - CSRF token to validate
 * @param sessionId - Session identifier to validate against
 * @returns true if token is valid, false otherwise
 */
export function validateCSRFToken(token: string, sessionId: string): boolean {
  if (!token || !token.includes('.')) {
    return false
  }

  const parts = token.split('.')
  if (parts.length !== 2) {
    return false
  }

  const [nonce, providedSignature] = parts

  // Regenerate expected signature
  const hmac = createHmac('sha256', CSRF_SECRET)
  hmac.update(`${sessionId}:${nonce}`)
  const expectedSignature = hmac.digest('hex')

  // Constant-time comparison to prevent timing attacks
  try {
    const providedBuffer = Buffer.from(providedSignature, 'hex')
    const expectedBuffer = Buffer.from(expectedSignature, 'hex')

    if (providedBuffer.length !== expectedBuffer.length) {
      return false
    }

    return timingSafeEqual(providedBuffer, expectedBuffer)
  } catch {
    return false
  }
}

/**
 * Extract session ID from request
 *
 * Tries to get session ID from:
 * 1. sessionId cookie (preferred)
 * 2. x-session-id header
 * 3. IP address (fallback, less secure)
 *
 * @param request - Next.js request object
 * @returns Session identifier string
 */
export function getSessionId(request: Request): string {
  // Try to get from cookie
  const cookies = request.headers.get('cookie')
  if (cookies) {
    const sessionCookie = cookies
      .split(';')
      .find((c) => c.trim().startsWith('sessionId='))

    if (sessionCookie) {
      const value = sessionCookie.split('=')[1]?.trim()
      if (value) {
        return value
      }
    }
  }

  // Try to get from header
  const headerSessionId = request.headers.get('x-session-id')
  if (headerSessionId) {
    return headerSessionId
  }

  // Fallback: use IP address (less secure but works for demo)
  // In production, you should enforce proper session management
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return `ip-${forwarded.split(',')[0]?.trim()}`
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return `ip-${realIp}`
  }

  // Last resort fallback
  return 'anonymous-session'
}

/**
 * Check if request is a mutating method that requires CSRF protection
 *
 * @param method - HTTP method
 * @returns true if method requires CSRF protection
 */
export function requiresCSRFProtection(method: string): boolean {
  return ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase())
}

/**
 * Generate a secure random session ID
 *
 * @returns 32-byte hex string
 */
export function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}
