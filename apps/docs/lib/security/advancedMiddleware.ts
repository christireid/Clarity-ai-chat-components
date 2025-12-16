import { NextRequest, NextResponse } from 'next/server'
import { 
  AdvancedSecurityValidator, 
  AdvancedCSP, 
  AdvancedRateLimiter,
  AdvancedInputValidator,
  SecurityUtils 
} from './advancedSecurity'

/**
 * Advanced Security Middleware with comprehensive protection
 */
export class AdvancedSecurityMiddleware {
  private rateLimiter: AdvancedRateLimiter
  
  constructor() {
    this.rateLimiter = new AdvancedRateLimiter(60000, 100) // 100 requests per minute
  }

  /**
   * Main middleware function with comprehensive security checks
   */
  async middleware(request: NextRequest) {
    const startTime = Date.now()
    const clientIP = this.getClientIP(request)
    
    try {
      // 1. Rate limiting check
      if (!this.rateLimiter.isAllowed(clientIP)) {
        return this.createRateLimitResponse(clientIP)
      }

      // 2. Request validation
      const validationResult = this.validateRequest(request)
      if (!validationResult.isValid) {
        return this.createBadRequestResponse(validationResult.error)
      }

      // 3. Security headers
      const securityHeaders = this.generateSecurityHeaders(request)
      
      // 4. Content validation
      const contentValidation = await this.validateContent(request)
      if (!contentValidation.isValid) {
        return this.createBadRequestResponse(contentValidation.error)
      }

      // 5. Create response with security headers
      const response = NextResponse.next()
      
      // Add security headers
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      // Add rate limit headers
      response.headers.set('X-RateLimit-Remaining', this.rateLimiter.getRemainingRequests(clientIP).toString())
      response.headers.set('X-RateLimit-Reset', this.rateLimiter.getResetTime(clientIP).toISOString())

      return response

    } catch (error) {
      return this.createErrorResponse(error)
    }
  }

  /**
   * Validate incoming request for security issues
   */
  private validateRequest(request: NextRequest): { isValid: boolean; error?: string } {
    const url = request.nextUrl.pathname
    const searchParams = request.nextUrl.search
    
    // Check for path traversal
    if (AdvancedInputValidator.detectPathTraversal(url)) {
      return { isValid: false, error: 'Path traversal detected' }
    }
    
    // Check for SQL injection in URL
    if (AdvancedInputValidator.detectSQLInjection(url)) {
      return { isValid: false, error: 'SQL injection detected in URL' }
    }
    
    // Check for command injection in search params
    if (searchParams && AdvancedInputValidator.detectCommandInjection(searchParams)) {
      return { isValid: false, error: 'Command injection detected in parameters' }
    }
    
    // Validate headers
    const userAgent = request.headers.get('user-agent')
    if (userAgent && userAgent.length > 500) {
      return { isValid: false, error: 'User agent too long' }
    }
    
    return { isValid: true }
  }

  /**
   * Validate request content for security issues
   */
  private async validateContent(request: NextRequest): Promise<{ isValid: boolean; error?: string }> {
    // Skip content validation for GET and HEAD requests
    if (['GET', 'HEAD'].includes(request.method)) {
      return { isValid: true }
    }
    
    try {
      // Check content length
      const contentLength = request.headers.get('content-length')
      if (contentLength) {
        const length = parseInt(contentLength)
        if (length > 10 * 1024 * 1024) { // 10MB limit
          return { isValid: false, error: 'Content too large' }
        }
      }
      
      // Check content type
      const contentType = request.headers.get('content-type')
      if (contentType) {
        const allowedTypes = [
          'application/json',
          'application/x-www-form-urlencoded',
          'multipart/form-data',
          'text/plain'
        ]
        
        if (!allowedTypes.some(type => contentType.includes(type))) {
          return { isValid: false, error: 'Content type not allowed' }
        }
      }
      
      // For JSON content, validate structure
      if (contentType?.includes('application/json')) {
        const body = await request.text()
        if (body) {
          try {
            const parsed = JSON.parse(body)
            if (this.hasCircularReference(parsed)) {
              return { isValid: false, error: 'Circular reference detected' }
            }
          } catch {
            return { isValid: false, error: 'Invalid JSON format' }
          }
        }
      }
      
      return { isValid: true }
    } catch (error) {
      return { isValid: false, error: 'Content validation failed' }
    }
  }

  /**
   * Generate security headers based on request
   */
  private generateSecurityHeaders(request: NextRequest): Record<string, string> {
    const environment = this.getEnvironment(request)
    const baseHeaders = AdvancedCSP.generateSecurityHeaders(environment)
    
    // Add request-specific headers
    const requestHeaders: Record<string, string> = {
      ...baseHeaders,
      'X-Request-ID': SecurityUtils.generateSecureToken(16),
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
    
    // Add timing allow origin for performance monitoring
    const origin = request.headers.get('origin')
    if (origin && this.isAllowedOrigin(origin)) {
      requestHeaders['Timing-Allow-Origin'] = origin
    }
    
    return requestHeaders
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    if (realIP) {
      return realIP
    }
    
    return 'unknown'
  }

  /**
   * Get environment based on request
   */
  private getEnvironment(request: NextRequest): 'development' | 'staging' | 'production' {
    const host = request.headers.get('host')
    
    if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
      return 'development'
    }
    
    if (host?.includes('staging') || host?.includes('preview')) {
      return 'staging'
    }
    
    return 'production'
  }

  /**
   * Check if origin is allowed
   */
  private isAllowedOrigin(origin: string): boolean {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3000',
      'https://clarity-chat.dev',
      'https://www.clarity-chat.dev'
    ]
    
    return allowedOrigins.includes(origin)
  }

  /**
   * Check for circular references in objects
   */
  private hasCircularReference(obj: any, seen = new WeakSet()): boolean {
    if (obj === null || typeof obj !== 'object') {
      return false
    }
    
    if (seen.has(obj)) {
      return true
    }
    
    seen.add(obj)
    
    for (const value of Object.values(obj)) {
      if (this.hasCircularReference(value, seen)) {
        return true
      }
    }
    
    return false
  }

  /**
   * Create rate limit response
   */
  private createRateLimitResponse(clientIP: string): NextResponse {
    const response = NextResponse.json(
      { 
        error: 'Rate limit exceeded',
        message: 'Too many requests',
        retryAfter: 60
      },
      { 
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': this.rateLimiter.getResetTime(clientIP).toISOString()
        }
      }
    )
    
    return response
  }

  /**
   * Create bad request response
   */
  private createBadRequestResponse(error: string = 'Bad Request'): NextResponse {
    return NextResponse.json(
      { error, message: error },
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  /**
   * Create error response
   */
  private createErrorResponse(error: any): NextResponse {
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: 'An error occurred processing your request',
        requestId: SecurityUtils.generateSecureToken(8)
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

/**
 * Advanced security configuration
 */
export const advancedSecurityConfig = {
  // Rate limiting
  rateLimiting: {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  
  // Content security
  contentSecurity: {
    directives: AdvancedCSP.generateCSP('production'),
    reportOnly: false,
    setAllHeaders: true
  },
  
  // Input validation
  inputValidation: {
    maxBodySize: 10 * 1024 * 1024, // 10MB
    maxParameterLength: 1000,
    maxHeaderLength: 500,
    allowDots: false,
    allowPrototypes: false
  },
  
  // Security headers
  securityHeaders: {
    contentTypeOptions: 'nosniff',
    frameOptions: 'DENY',
    xssProtection: '1; mode=block',
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'geolocation=(), microphone=(), camera=()'
  }
}

export default AdvancedSecurityMiddleware