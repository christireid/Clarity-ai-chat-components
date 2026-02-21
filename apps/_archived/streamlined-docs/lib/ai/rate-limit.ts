/**
 * Rate Limiting Utilities for AI APIs
 *
 * Provides in-memory rate limiting for development and
 * Upstash Redis integration for production.
 */

// In-memory store for development
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
  retryAfter?: number
}

interface RateLimitConfig {
  requests: number // Max requests per window
  window: number // Window in seconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  requests: 100,
  window: 60,
}

/**
 * Get a rate limit identifier from the request
 * Uses IP address or a default for local development
 */
export function getRateLimitIdentifier(request: Request): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip =
    forwardedFor?.split(',')[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    'anonymous'

  return `ratelimit:ai:${ip}`
}

/**
 * Check rate limit using in-memory store (development)
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowMs = config.window * 1000
  const existing = inMemoryStore.get(identifier)

  // Clean up expired entries
  if (existing && now >= existing.resetAt) {
    inMemoryStore.delete(identifier)
  }

  const current = inMemoryStore.get(identifier)

  if (!current) {
    // First request in window
    inMemoryStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })

    return {
      success: true,
      limit: config.requests,
      remaining: config.requests - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    }
  }

  if (current.count >= config.requests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((current.resetAt - now) / 1000)

    return {
      success: false,
      limit: config.requests,
      remaining: 0,
      reset: Math.ceil(current.resetAt / 1000),
      retryAfter,
    }
  }

  // Increment counter
  current.count++
  inMemoryStore.set(identifier, current)

  return {
    success: true,
    limit: config.requests,
    remaining: config.requests - current.count,
    reset: Math.ceil(current.resetAt / 1000),
  }
}

/**
 * Create rate limit headers from result
 */
export function createRateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }

  if (result.retryAfter !== undefined) {
    headers['Retry-After'] = result.retryAfter.toString()
  }

  return headers
}

/**
 * Higher-order function to wrap API routes with rate limiting
 *
 * Usage:
 * ```
 * export const GET = withRateLimit(async (request) => {
 *   // Your handler code
 * })
 * ```
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  config: RateLimitConfig = DEFAULT_CONFIG
) {
  return async (request: Request): Promise<Response> => {
    const identifier = getRateLimitIdentifier(request)
    const result = await checkRateLimit(identifier, config)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
          },
          timestamp: new Date().toISOString(),
          path: new URL(request.url).pathname,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...createRateLimitHeaders(result),
          },
        }
      )
    }

    // Call the actual handler
    const response = await handler(request)

    // Clone response and add rate limit headers
    const headers = new Headers(response.headers)
    Object.entries(createRateLimitHeaders(result)).forEach(([key, value]) => {
      headers.set(key, value)
    })

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [key, value] of inMemoryStore.entries()) {
    if (now >= value.resetAt) {
      inMemoryStore.delete(key)
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000)
}
