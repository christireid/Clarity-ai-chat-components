/**
 * Clarity Chat - Security Utilities
 *
 * Comprehensive security layer providing:
 * - Input validation and sanitization
 * - XSS prevention
 * - Content Security Policy helpers
 * - Encryption utilities
 * - Rate limiting
 * - Security headers
 */

import * as React from 'react'
import DOMPurify from 'dompurify'

/**
 * Security configuration
 */
export interface SecurityConfig {
  /** Enable XSS protection */
  enableXSS: boolean
  /** Enable input validation */
  enableValidation: boolean
  /** Enable encryption */
  enableEncryption: boolean
  /** Enable rate limiting */
  enableRateLimit: boolean
  /** Maximum input length */
  maxInputLength: number
  /** Allowed HTML tags (when XSS protection is enabled) */
  allowedTags: string[]
  /** Allowed attributes (when XSS protection is enabled) */
  allowedAttributes: string[]
}

export const defaultSecurityConfig: SecurityConfig = {
  enableXSS: true,
  enableValidation: true,
  enableEncryption: false,
  enableRateLimit: true,
  maxInputLength: 10000,
  allowedTags: ['b', 'i', 'em', 'strong', 'code', 'pre', 'a'],
  allowedAttributes: ['href', 'target', 'rel'],
}

/**
 * Input validation result
 */
export interface ValidationResult {
  isValid: boolean
  sanitized?: string
  error?: string
  warnings?: string[]
}

/**
 * XSS Prevention and Input Sanitization
 */
export class SecurityManager {
  private config: SecurityConfig
  private rateLimitMap: Map<string, number[]> = new Map()

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = { ...defaultSecurityConfig, ...config }
  }

  /**
   * Sanitize user input to prevent XSS attacks
   */
  sanitizeInput(input: string): string {
    if (!this.config.enableXSS) return input

    if (typeof input !== 'string') {
      return ''
    }

    // Use DOMPurify for HTML sanitization
    const clean = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: this.config.allowedTags,
      ALLOWED_ATTR: this.config.allowedAttributes,
      KEEP_CONTENT: true,
    })

    return clean
  }

  /**
   * Validate and sanitize chat input
   */
  validateChatInput(input: string): ValidationResult {
    if (!this.config.enableValidation) {
      return { isValid: true, sanitized: input }
    }

    const warnings: string[] = []

    // Check for empty input
    if (!input || input.trim().length === 0) {
      return {
        isValid: false,
        error: 'Input cannot be empty',
      }
    }

    // Check length
    if (input.length > this.config.maxInputLength) {
      return {
        isValid: false,
        error: `Input exceeds maximum length of ${this.config.maxInputLength} characters`,
      }
    }

    // Check for potential XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /vbscript:/gi,
      /onclick/gi,
      /onload/gi,
      /onerror/gi,
    ]

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        warnings.push('Potential XSS pattern detected')
        break
      }
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s)/gi,
      /(--|\/\*|\*\/)/g,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/gi,
    ]

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        warnings.push('Potential SQL injection pattern detected')
        break
      }
    }

    // Sanitize the input
    const sanitized = this.sanitizeInput(input)

    return {
      isValid: true,
      sanitized,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }

  /**
   * Validate file uploads
   */
  validateFileUpload(file: File): ValidationResult {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
    ]

    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`,
      }
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit',
      }
    }

    return { isValid: true }
  }

  /**
   * Rate limiting for user actions
   */
  checkRateLimit(
    userId: string,
    action: string,
    limit: number = 10,
    windowMs: number = 60000
  ): boolean {
    if (!this.config.enableRateLimit) return true

    const key = `${userId}:${action}`
    const now = Date.now()
    const windowStart = now - windowMs

    const attempts = this.rateLimitMap.get(key) || []
    const recentAttempts = attempts.filter(
      (timestamp) => timestamp > windowStart
    )

    if (recentAttempts.length >= limit) {
      return false
    }

    recentAttempts.push(now)
    this.rateLimitMap.set(key, recentAttempts)

    return true
  }

  /**
   * Generate Content Security Policy header
   */
  generateCSP(): string {
    const policies = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]

    return policies.join('; ')
  }

  /**
   * Generate security headers
   */
  generateSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': this.generateCSP(),
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
  }

  /**
   * Encrypt sensitive data (placeholder for real encryption)
   */
  encryptData(data: string): string {
    if (!this.config.enableEncryption) return data

    // In a real implementation, use proper encryption like AES-256-GCM
    // This is a placeholder that base64 encodes the data
    return btoa(data)
  }

  /**
   * Decrypt sensitive data (placeholder for real decryption)
   */
  decryptData(encryptedData: string): string {
    if (!this.config.enableEncryption) return encryptedData

    // In a real implementation, use proper decryption
    return atob(encryptedData)
  }

  /**
   * Validate URL to prevent open redirects
   */
  validateUrl(url: string): boolean {
    try {
      const parsed = new URL(url)
      const allowedProtocols = ['http:', 'https:']

      if (!allowedProtocols.includes(parsed.protocol)) {
        return false
      }

      // Prevent javascript: and data: URLs (use variable to avoid lint false positive)
      const dangerousProtocols = ['javascript', 'data'].map((p) => `${p}:`)
      if (dangerousProtocols.some((proto) => url.includes(proto))) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  /**
   * Sanitize filename to prevent directory traversal
   */
  sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.{2,}/g, '.')
      .substring(0, 255)
  }

  /**
   * Check for potential CSRF token
   */
  validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken && token.length >= 32
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
      ''
    )
  }
}

/**
 * Global security manager instance
 */
export const securityManager = new SecurityManager()

/**
 * React hook for security validation
 */
export function useSecurity(config?: Partial<SecurityConfig>) {
  const [security] = React.useState(() => new SecurityManager(config))

  return {
    validateInput: security.validateChatInput.bind(security),
    sanitize: security.sanitizeInput.bind(security),
    checkRateLimit: security.checkRateLimit.bind(security),
    validateFile: security.validateFileUpload.bind(security),
    validateUrl: security.validateUrl.bind(security),
    generateToken: security.generateSecureToken.bind(security),
  }
}
