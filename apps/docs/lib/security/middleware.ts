/**
 * Security middleware for API routes
 * Implements rate limiting, input validation, and security headers
 */

import { NextRequest, NextResponse } from 'next/server'

export interface RateLimitEntry {
  count: number
  resetTime: number
}

/**
 * In-memory rate limiter (consider Redis for production)
 */
export class RateLimiter {
  private static instance: RateLimiter
  private requests: Map<string, RateLimitEntry> = new Map()
  private readonly windowMs = 60 * 1000 // 1 minute
  private readonly maxRequests = 100
  private readonly cleanupInterval = 5 * 60 * 1000 // 5 minutes

  private constructor() {
    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), this.cleanupInterval)
  }

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter()
    }
    return RateLimiter.instance
  }

  /**
   * Check if request is allowed under rate limit
   */
  isAllowed(identifier: string): {
    allowed: boolean
    remaining: number
    resetTime: number
  } {
    const now = Date.now()
    const entry = this.requests.get(identifier)

    if (!entry) {
      // First request
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      }
    }

    if (now > entry.resetTime) {
      // Reset window
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      })
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      }
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return { allowed: false, remaining: 0, resetTime: entry.resetTime }
    }

    // Increment counter
    entry.count++
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    }
  }

  /**
   * Cleanup old entries
   */
  private cleanup() {
    const now = Date.now()
    for (const [identifier, entry] of this.requests.entries()) {
      if (now > entry.resetTime + this.windowMs) {
        this.requests.delete(identifier)
      }
    }
  }
}

/**
 * Security middleware for API routes
 */
export class SecurityMiddleware {
  private rateLimiter = RateLimiter.getInstance()

  /**
   * Apply security middleware to request
   */
  async apply(request: NextRequest): Promise<NextResponse | null> {
    // Rate limiting
    const clientIp = this.getClientIp(request)
    const rateLimitResult = this.rateLimiter.isAllowed(clientIp)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(
              rateLimitResult.resetTime
            ).toISOString(),
            'Retry-After': rateLimitResult.resetTime.toString(),
          },
        }
      )
    }

    // Input validation
    const validationResult = this.validateInput(request)
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          message: validationResult.error,
        },
        { status: 400 }
      )
    }

    // Security headers
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', '100')
    response.headers.set(
      'X-RateLimit-Remaining',
      rateLimitResult.remaining.toString()
    )
    response.headers.set(
      'X-RateLimit-Reset',
      new Date(rateLimitResult.resetTime).toISOString()
    )

    return response
  }

  /**
   * Get client IP address
   */
  private getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const remoteAddr = request.headers.get('x-remote-addr')

    return forwarded?.split(',')[0]?.trim() || realIp || remoteAddr || 'unknown'
  }

  /**
   * Validate request input
   */
  private validateInput(request: NextRequest): {
    valid: boolean
    error?: string
  } {
    // Validate content type
    const contentType = request.headers.get('content-type')

    if (request.method === 'POST' || request.method === 'PUT') {
      if (!contentType || !contentType.includes('application/json')) {
        return { valid: false, error: 'Content-Type must be application/json' }
      }
    }

    // Validate request size (10MB limit)
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) {
      return { valid: false, error: 'Request payload too large' }
    }

    // Validate query parameters
    const url = new URL(request.url)
    const queryParams = Object.fromEntries(url.searchParams.entries())

    for (const [key, value] of Object.entries(queryParams)) {
      if (!this.isValidQueryParam(key, value)) {
        return { valid: false, error: `Invalid query parameter: ${key}` }
      }
    }

    return { valid: true }
  }

  /**
   * Validate query parameter
   */
  private isValidQueryParam(key: string, value: string): boolean {
    // Check for SQL injection patterns
    const sqlInjectionPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|script)\b)/i,
      /(\b(or|and)\b.*=.*)/i,
      /(\bunion\b.*\bselect\b)/i,
      /(\bselect\b.*\bfrom\b.*\bwhere\b)/i,
    ]

    for (const pattern of sqlInjectionPatterns) {
      if (pattern.test(value)) {
        return false
      }
    }

    // Check for XSS patterns
    const xssPatterns = [
      /<script[^>]*>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
    ]

    for (const pattern of xssPatterns) {
      if (pattern.test(value)) {
        return false
      }
    }

    // Check parameter length
    if (value.length > 1000) {
      return false
    }

    return true
  }
}

/**
 * Input sanitizer for user inputs
 */
export class InputSanitizer {
  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return ''

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[{}]/g, '') // Remove curly braces
      .substring(0, 1000) // Limit length
  }

  /**
   * Sanitize email
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return emailRegex.test(sanitized) ? sanitized.toLowerCase() : ''
  }

  /**
   * Sanitize URL
   */
  static sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeString(url)

    try {
      const parsed = new URL(sanitized)

      // Allow only HTTP/HTTPS protocols
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return ''
      }

      return parsed.toString()
    } catch {
      return ''
    }
  }

  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(html: string): string {
    return this.sanitizeString(html)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }

  /**
   * Validate and sanitize number
   */
  static sanitizeNumber(input: any): number {
    const num = Number(input)
    return isNaN(num) ? 0 : Math.max(0, Math.min(num, 1000000)) // Cap at 1M
  }

  /**
   * Sanitize boolean
   */
  static sanitizeBoolean(input: any): boolean {
    if (typeof input === 'boolean') return input
    if (typeof input === 'string') {
      return input.toLowerCase() === 'true'
    }
    return Boolean(input)
  }
}

/**
 * Security utilities
 */
export const securityUtils = {
  /**
   * Generate secure random string
   */
  generateSecureId(length: number = 32): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  /**
   * Hash sensitive data
   */
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  },

  /**
   * Validate file upload
   */
  validateFileUpload(file: File): boolean {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (file.size > maxSize) return false
    if (!allowedTypes.includes(file.type)) return false

    return true
  },
}
