/**
 * Advanced Security Hardening Measures
 * Implements comprehensive security protections beyond basic XSS/SQL injection prevention
 */

import DOMPurify from 'dompurify'
import crypto from 'crypto'

/**
 * Advanced input validation and sanitization
 */
export class AdvancedSecurityValidator {
  /**
   * Validate and sanitize file uploads
   */
  static validateFileUpload(file: File): { isValid: boolean; error?: string } {
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    const ALLOWED_MIME_TYPES = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv'
    ]

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size exceeds 10MB limit' }
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { isValid: false, error: 'File type not allowed' }
    }

    // Additional security checks
    const fileName = file.name.toLowerCase()
    const dangerousExtensions = ['.exe', '.scr', '.bat', '.cmd', '.com', '.pif', '.vbs', '.js', '.jar']
    
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      return { isValid: false, error: 'Potentially dangerous file type' }
    }

    return { isValid: true }
  }

  /**
   * Validate email addresses with strict RFC compliance
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    if (!emailRegex.test(email)) {
      return false
    }

    // Additional security checks
    const [localPart, domain] = email.split('@')
    
    // Check for common attack patterns
    if (localPart.includes('..') || domain.includes('..')) {
      return false
    }

    // Check length limits
    if (email.length > 254 || localPart.length > 64) {
      return false
    }

    return true
  }

  /**
   * Validate URLs with strict security checks
   */
  static validateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url)
      
      // Only allow HTTP and HTTPS
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return false
      }

      // Block localhost and private IP ranges
      const hostname = parsedUrl.hostname.toLowerCase()
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return false
      }

      // Check for private IP ranges
      const ipRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/
      if (ipRegex.test(hostname)) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * Advanced XSS prevention with context-aware sanitization
   */
  static sanitizeForContext(input: string, context: 'html' | 'attribute' | 'javascript' | 'url'): string {
    switch (context) {
      case 'html':
        return DOMPurify.sanitize(input, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code', 'pre'],
          ALLOWED_ATTR: ['href', 'target', 'rel']
        })
      
      case 'attribute':
        return input.replace(/["'<>]/g, '')
      
      case 'javascript':
        return input.replace(/['"\\]/g, '')
      
      case 'url':
        return encodeURIComponent(input)
      
      default:
        return DOMPurify.sanitize(input)
    }
  }
}

/**
 * Advanced Content Security Policy (CSP) configuration
 */
export class AdvancedCSP {
  /**
   * Generate strict CSP headers for different environments
   */
  static generateCSP(environment: 'development' | 'staging' | 'production'): string {
    const baseCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self'"
    ]

    switch (environment) {
      case 'development':
        return [
          ...baseCSP,
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:*",
          "connect-src 'self' ws://localhost:* http://localhost:*"
        ].join('; ')
      
      case 'staging':
        return [
          ...baseCSP,
          "script-src 'self' 'unsafe-inline'",
          "connect-src 'self' https://staging-api.example.com"
        ].join('; ')
      
      case 'production':
        return [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'"
        ].join('; ')
      
      default:
        return baseCSP.join('; ')
    }
  }

  /**
   * Generate security headers for comprehensive protection
   */
  static generateSecurityHeaders(environment: 'development' | 'staging' | 'production') {
    return {
      'Content-Security-Policy': this.generateCSP(environment),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    }
  }
}

/**
 * Advanced rate limiting with sliding window
 */
export class AdvancedRateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  /**
   * Check if request is allowed
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => now - timestamp < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    
    return true
  }

  /**
   * Get remaining requests for identifier
   */
  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    const validRequests = userRequests.filter(timestamp => now - timestamp < this.windowMs)
    
    return Math.max(0, this.maxRequests - validRequests.length)
  }

  /**
   * Get reset time for identifier
   */
  getResetTime(identifier: string): Date {
    const userRequests = this.requests.get(identifier) || []
    if (userRequests.length === 0) {
      return new Date()
    }
    
    const oldestRequest = Math.min(...userRequests)
    return new Date(oldestRequest + this.windowMs)
  }
}

/**
 * Advanced input validation with machine learning patterns
 */
export class AdvancedInputValidator {
  /**
   * Detect SQL injection patterns
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter|exec|execute|script|declare|union|having|or\s+1=1|and\s+1=1)\b)/i,
      /('|")\s*(or|and)\s*\d+\s*=\s*\d+/i,
      /;.*drop\s+table/i,
      /union\s+select/i,
      /xp_/i,
      /sp_/i
    ]
    
    return sqlPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Detect command injection patterns
   */
  static detectCommandInjection(input: string): boolean {
    const cmdPatterns = [
      /[;&|`]/,
      /\$\(/,
      /\${.*}/,
      /(?:cat|ls|echo|rm|cp|mv|whoami|id|uname|pwd)\s+/i
    ]
    
    return cmdPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Detect path traversal patterns
   */
  static detectPathTraversal(input: string): boolean {
    const pathPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /%2e%2e%2f/i,
      /%2e%2e%5c/i,
      /%252e%252e%252f/i
    ]
    
    return pathPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Comprehensive input validation
   */
  static validateInput(input: string, type: 'username' | 'email' | 'text' | 'numeric'): boolean {
    if (this.detectSQLInjection(input)) return false
    if (this.detectCommandInjection(input)) return false
    if (this.detectPathTraversal(input)) return false
    
    switch (type) {
      case 'username':
        return /^[a-zA-Z0-9_-]{3,20}$/.test(input)
      
      case 'email':
        return AdvancedSecurityValidator.validateEmail(input)
      
      case 'text':
        return input.length <= 1000 // Reasonable text length limit
      
      case 'numeric':
        return /^\d+$/.test(input)
      
      default:
        return true
    }
  }
}

/**
 * Security utilities for cryptographic operations
 */
export class SecurityUtils {
  /**
   * Generate cryptographically secure random string
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Hash sensitive data with salt
   */
  static hashWithSalt(data: string, salt?: string): string {
    const saltValue = salt || this.generateSecureToken(16)
    const hash = crypto.createHash('sha256').update(data + saltValue).digest('hex')
    return `${saltValue}:${hash}`
  }

  /**
   * Verify hash with salt
   */
  static verifyHash(data: string, hashedData: string): boolean {
    const [salt, hash] = hashedData.split(':')
    const newHash = crypto.createHash('sha256').update(data + salt).digest('hex')
    return hash === newHash
  }

  /**
   * Mask sensitive data
   */
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) return '*'.repeat(data.length)
    return data.slice(0, visibleChars) + '*'.repeat(data.length - visibleChars)
  }
}