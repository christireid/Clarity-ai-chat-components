import { NextRequest, NextResponse } from 'next/server'
import { generateSessionId } from '@/lib/csrf'

/**
 * Session Management API
 *
 * Provides secure session creation with HttpOnly, Secure, SameSite=Strict cookies
 * to prevent CSRF attacks.
 *
 * Wave 3.4 Agent 37 - Security Headers Auditor
 */

/**
 * GET /api/session
 *
 * Creates or refreshes a session and returns the session ID.
 * Sets a secure session cookie with:
 * - HttpOnly: Prevents JavaScript access (XSS protection)
 * - Secure: HTTPS only in production (MITM protection)
 * - SameSite=Strict: Prevents CSRF attacks
 * - Max-Age: 7 days
 */
export async function GET(request: NextRequest) {
  const sessionId = generateSessionId()

  const response = NextResponse.json({
    sessionId,
    success: true,
    message: 'Session created successfully',
  })

  // Set secure session cookie
  response.cookies.set('sessionId', sessionId, {
    httpOnly: true, // Not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // Prevent CSRF
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  return response
}

/**
 * DELETE /api/session
 *
 * Destroys the current session by clearing the session cookie.
 */
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Session destroyed successfully',
  })

  // Clear session cookie
  response.cookies.delete('sessionId')

  return response
}
