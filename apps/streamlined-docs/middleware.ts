import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  validateCSRFToken,
  getSessionId,
  requiresCSRFProtection,
} from './lib/csrf'

/**
 * Edge Middleware for Cache Header Optimization and Security
 *
 * Wave 3.3 Agent 35 - ISR Cache Optimizer
 * Wave 3.4 Agent 37 - Security Headers Auditor (CSRF Protection)
 *
 * Implements:
 * - Stale-while-revalidate strategy for different content types
 * - CSRF token validation for mutating API requests
 * - Static assets: Aggressive caching (immutable)
 * - API docs: 1 hour edge cache + 24 hour stale-while-revalidate
 * - Get started: 2 hour edge cache + 24 hour stale-while-revalidate
 * - Home page: 30 min edge cache + 1 hour stale-while-revalidate
 * - Other pages: 1 hour edge cache + 2 hour stale-while-revalidate
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const path = request.nextUrl.pathname

  // CSRF Protection - validate tokens for mutating API requests
  // Exempt session endpoint (needed to create session before getting token)
  if (
    path.startsWith('/api/') &&
    path !== '/api/session' &&
    requiresCSRFProtection(request.method)
  ) {
    const csrfToken = request.headers.get('x-csrf-token')
    const sessionId = getSessionId(request)

    if (!csrfToken || !validateCSRFToken(csrfToken, sessionId)) {
      return NextResponse.json(
        {
          error: 'Invalid or missing CSRF token',
          message:
            'CSRF token validation failed. Please include a valid X-CSRF-Token header.',
        },
        { status: 403 }
      )
    }
  }

  // Static assets - aggressive caching (never change after build)
  if (
    path.startsWith('/_next/static/') ||
    path.match(/\.(jpg|jpeg|png|svg|ico|webp|avif|woff2|woff|ttf)$/)
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
    return response
  }

  // API documentation - 1 hour cache, stale-while-revalidate for 24 hours
  if (path.startsWith('/api/reference/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    )
    return response
  }

  // Get started pages - 2 hour cache
  if (path.startsWith('/get-started/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=7200, stale-while-revalidate=86400'
    )
    return response
  }

  // Explore pages - 3 hour cache
  if (path.startsWith('/explore/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=10800, stale-while-revalidate=86400'
    )
    return response
  }

  // About pages - 6 hour cache
  if (path.startsWith('/about/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=21600, stale-while-revalidate=86400'
    )
    return response
  }

  // Home page - 30 min cache (high traffic, more frequent updates)
  if (path === '/') {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=1800, stale-while-revalidate=3600'
    )
    return response
  }

  // API routes - no caching (dynamic data)
  if (path.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate'
    )
    return response
  }

  // Default for all other pages - moderate caching
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=7200'
  )

  return response
}

// Configure which paths to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes - handled separately above)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     */
    '/((?!_next/image|favicon.ico).*)',
  ],
}
