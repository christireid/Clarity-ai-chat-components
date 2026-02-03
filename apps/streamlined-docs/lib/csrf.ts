/**
 * CSRF Protection Utilities
 *
 * Provides CSRF token generation and validation for API routes.
 */

import { createHmac, randomBytes } from 'crypto'

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-for-development'

/**
 * Generate a CSRF token for a session
 */
export function generateCSRFToken(sessionId: string): string {
  const nonce = randomBytes(16).toString('hex')
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(`${nonce}:${sessionId}`)
    .digest('hex')
  return `${nonce}.${signature}`
}

/**
 * Validate a CSRF token
 */
export function validateCSRFToken(token: string, sessionId: string): boolean {
  if (!token || typeof token !== 'string') return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [nonce, signature] = parts
  const expectedSignature = createHmac('sha256', CSRF_SECRET)
    .update(`${nonce}:${sessionId}`)
    .digest('hex')

  // Use timing-safe comparison
  if (signature.length !== expectedSignature.length) return false

  let result = 0
  for (let i = 0; i < signature.length; i++) {
    result |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i)
  }
  return result === 0
}

/**
 * Get session ID from a request
 */
export function getSessionId(request?: Request): string {
  // In a real implementation, this would extract the session ID from cookies
  // For now, return a default anonymous session ID
  const sessionCookie = request?.headers?.get?.('cookie')
  const sessionMatch = sessionCookie?.match(/sessionId=([^;]+)/)
  return sessionMatch?.[1] || 'anonymous-session'
}

/**
 * Generate a new session ID
 */
export function generateSessionId(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Check if a route requires CSRF protection
 */
export function requiresCSRFProtection(method: string, path?: string): boolean {
  // Safe methods don't need CSRF protection
  const safeMethods = ['GET', 'HEAD', 'OPTIONS']
  if (safeMethods.includes(method.toUpperCase())) {
    return false
  }

  // If no path provided, assume it needs protection (safe default for state-modifying methods)
  if (!path) {
    return true
  }

  // API routes that modify state need CSRF protection
  const protectedPaths = ['/api/chat', '/api/docs-assistant', '/api/feedback']
  return protectedPaths.some(p => path.startsWith(p))
}
