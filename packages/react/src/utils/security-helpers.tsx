/**
 * Security Utilities
 *
 * Comprehensive security utilities for content components including:
 * - XSS protection and sanitization
 * - CSP (Content Security Policy) management
 * - Security headers configuration
 * - Safe content rendering
 * - Input validation and sanitization
 */

import React from 'react'
import DOMPurify from 'isomorphic-dompurify'

// ============================================================================
// TYPES
// ============================================================================

export interface SecurityConfig {
  /** Enable XSS protection */
  enableXSSProtection?: boolean
  /** Enable CSP headers */
  enableCSP?: boolean
  /** Enable HSTS */
  enableHSTS?: boolean
  /** Custom CSP directives */
  cspDirectives?: Record<string, string[]>
  /** Allowed domains for external resources */
  allowedDomains?: string[]
  /** Enable input sanitization */
  enableInputSanitization?: boolean
  /** Enable script execution prevention */
  preventScriptExecution?: boolean
}

export interface SanitizationOptions {
  /** Allow HTML tags */
  ALLOWED_TAGS?: string[]
  /** Allow HTML attributes */
  ALLOWED_ATTR?: string[]
  /** Allow data attributes */
  ALLOW_DATA_ATTR?: boolean
  /** Custom sanitization rules */
  customRules?: (html: string) => string
}

export interface SecurityHeaders {
  'Content-Security-Policy'?: string
  'X-Frame-Options'?: string
  'X-Content-Type-Options'?: string
  'X-XSS-Protection'?: string
  'Strict-Transport-Security'?: string
  'Referrer-Policy'?: string
  'Permissions-Policy'?: string
}

export interface SecurityAuditResult {
  componentName: string
  vulnerabilities: Array<{
    type: 'xss' | 'csp' | 'headers' | 'sanitization'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: string
    recommendation: string
    location?: string
  }>
  score: number // 0-100, higher is better
  passed: boolean
}

// ============================================================================
// DEFAULT SECURITY CONFIGURATION
// ============================================================================

export const DEFAULT_SECURITY_CONFIG: Required<SecurityConfig> = {
  enableXSSProtection: true,
  enableCSP: true,
  enableHSTS: true,
  cspDirectives: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    'font-src': ["'self'", "https://fonts.gstatic.com"],
    'img-src': ["'self'", "data:", "https:", "blob:"],
    'connect-src': ["'self'", "https://api.github.com", "https://*.clarity-chat.dev"],
    'media-src': ["'self'", "https:", "blob:"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  },
  allowedDomains: [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'unpkg.com',
    'api.github.com',
    '*.clarity-chat.dev',
  ],
  enableInputSanitization: true,
  preventScriptExecution: true,
}

// ============================================================================
// XSS PROTECTION AND SANITIZATION
// ============================================================================

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHTML(
  html: string,
  options: SanitizationOptions = {}
): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  const {
    ALLOWED_TAGS = [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img', 'span', 'div',
    ],
    ALLOWED_ATTR = [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel',
      'colspan', 'rowspan', 'width', 'height',
    ],
    ALLOW_DATA_ATTR = false,
    customRules,
  } = options

  // Configure DOMPurify
  const purifyConfig = {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR,
    // Prevent script execution
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout'],
    // Sanitize CSS
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
  }

  let sanitized = DOMPurify.sanitize(html, purifyConfig)

  // Apply custom rules if provided
  if (customRules) {
    sanitized = customRules(sanitized)
  }

  return sanitized
}

/**
 * Sanitize markdown content (remove potentially dangerous elements)
 */
export function sanitizeMarkdown(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') {
    return ''
  }

  // Remove script tags and event handlers
  let sanitized = markdown
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*on\w+="[^"]*"[^>]*>/gi, '')
    .replace(/<[^>]*on\w+='[^']*'[^>]*>/gi, '')
    .replace(/javascript:/gi, '')

  // Sanitize HTML within markdown
  sanitized = sanitizeHTML(sanitized, {
    ALLOWED_TAGS: [
      'strong', 'em', 'u', 'code', 'pre', 'br', 'p',
      'ul', 'ol', 'li', 'blockquote', 'hr',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    ],
  })

  return sanitized
}

/**
 * Validate and sanitize user input
 */
export function sanitizeUserInput(input: string, type: 'text' | 'html' | 'markdown' = 'text'): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  switch (type) {
    case 'html':
      return sanitizeHTML(input)
    case 'markdown':
      return sanitizeMarkdown(input)
    case 'text':
    default:
      // For plain text, escape HTML entities
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
  }
}

/**
 * Check if content contains potentially dangerous patterns
 */
export function detectXSSPatterns(content: string): Array<{
  pattern: string
  severity: 'low' | 'medium' | 'high'
  description: string
}> {
  const patterns = [
    {
      regex: /<script[^>]*>[\s\S]*?<\/script>/gi,
      severity: 'high' as const,
      description: 'Script tag injection',
    },
    {
      regex: /javascript:/gi,
      severity: 'high' as const,
      description: 'JavaScript URL scheme',
    },
    {
      regex: /on\w+="[^"]*"/gi,
      severity: 'medium' as const,
      description: 'Event handler attributes',
    },
    {
      regex: /<iframe[^>]*>/gi,
      severity: 'medium' as const,
      description: 'Iframe injection',
    },
    {
      regex: /<object[^>]*>/gi,
      severity: 'high' as const,
      description: 'Object/embed injection',
    },
    {
      regex: /data:text\/html/gi,
      severity: 'medium' as const,
      description: 'Data URL with HTML',
    },
  ]

  const findings: Array<{
    pattern: string
    severity: 'low' | 'medium' | 'high'
    description: string
  }> = []

  patterns.forEach(({ regex, severity, description }) => {
    if (regex.test(content)) {
      findings.push({
        pattern: regex.source,
        severity,
        description,
      })
    }
  })

  return findings
}

// ============================================================================
// CSP MANAGEMENT
// ============================================================================

/**
 * Generate Content Security Policy header
 */
export function generateCSPHeader(
  directives: Record<string, string[]> = {},
  reportUri?: string
): string {
  const mergedDirectives = { ...DEFAULT_SECURITY_CONFIG.cspDirectives, ...directives }

  const cspParts: string[] = []

  Object.entries(mergedDirectives).forEach(([directive, values]) => {
    if (values.length > 0) {
      cspParts.push(`${directive} ${values.join(' ')}`)
    }
  })

  if (reportUri) {
    cspParts.push(`report-uri ${reportUri}`)
  }

  return cspParts.join('; ')
}

/**
 * Validate CSP directives
 */
export function validateCSPDirectives(directives: Record<string, string[]>): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for dangerous directives
  if (directives['script-src']?.includes("'unsafe-inline'")) {
    warnings.push("Using 'unsafe-inline' in script-src reduces security")
  }

  if (directives['script-src']?.includes("'unsafe-eval'")) {
    warnings.push("Using 'unsafe-eval' in script-src reduces security")
  }

  if (directives['style-src']?.includes("'unsafe-inline'")) {
    warnings.push("Using 'unsafe-inline' in style-src reduces security")
  }

  // Check for missing essential directives
  const requiredDirectives = ['default-src', 'script-src', 'style-src', 'img-src']
  requiredDirectives.forEach(directive => {
    if (!directives[directive] || directives[directive].length === 0) {
      errors.push(`Missing required CSP directive: ${directive}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================

/**
 * Generate comprehensive security headers
 */
export function generateSecurityHeaders(config: SecurityConfig = {}): SecurityHeaders {
  const headers: SecurityHeaders = {}

  const mergedConfig = { ...DEFAULT_SECURITY_CONFIG, ...config }

  // Content Security Policy
  if (mergedConfig.enableCSP) {
    headers['Content-Security-Policy'] = generateCSPHeader(mergedConfig.cspDirectives)
  }

  // XSS Protection
  if (mergedConfig.enableXSSProtection) {
    headers['X-XSS-Protection'] = '1; mode=block'
  }

  // Frame Options
  headers['X-Frame-Options'] = 'DENY'

  // Content Type Options
  headers['X-Content-Type-Options'] = 'nosniff'

  // HSTS
  if (mergedConfig.enableHSTS) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  }

  // Referrer Policy
  headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

  // Permissions Policy
  headers['Permissions-Policy'] = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
    'ambient-light-sensor=()',
    'autoplay=()',
    'fullscreen=(self)',
  ].join(', ')

  return headers
}

// ============================================================================
// SECURITY AUDITING
// ============================================================================

/**
 * Audit component for security vulnerabilities
 */
export function auditComponentSecurity(
  componentName: string,
  content: string,
  config: SecurityConfig = {}
): SecurityAuditResult {
  const vulnerabilities: SecurityAuditResult['vulnerabilities'] = []

  // Check for XSS patterns
  const xssPatterns = detectXSSPatterns(content)
  xssPatterns.forEach(pattern => {
    vulnerabilities.push({
      type: 'xss',
      severity: pattern.severity,
      description: pattern.description,
      recommendation: 'Use proper sanitization before rendering user content',
      location: componentName,
    })
  })

  // Check CSP configuration
  if (config.enableCSP) {
    const cspValidation = validateCSPDirectives(config.cspDirectives || {})
    cspValidation.errors.forEach(error => {
      vulnerabilities.push({
        type: 'csp',
        severity: 'high',
        description: error,
        recommendation: 'Add missing CSP directives',
        location: componentName,
      })
    })
    cspValidation.warnings.forEach(warning => {
      vulnerabilities.push({
        type: 'csp',
        severity: 'medium',
        description: warning,
        recommendation: 'Review CSP directives for security',
        location: componentName,
      })
    })
  }

  // Calculate security score
  const totalIssues = vulnerabilities.length
  const highSeverityCount = vulnerabilities.filter(v => v.severity === 'high' || v.severity === 'critical').length
  const mediumSeverityCount = vulnerabilities.filter(v => v.severity === 'medium').length

  // Scoring algorithm: start with 100, deduct points for issues
  let score = 100
  score -= highSeverityCount * 25  // -25 for each high/critical issue
  score -= mediumSeverityCount * 10 // -10 for each medium issue
  score -= Math.max(0, totalIssues - highSeverityCount - mediumSeverityCount) * 5 // -5 for each low issue
  score = Math.max(0, Math.min(100, score))

  return {
    componentName,
    vulnerabilities,
    score,
    passed: vulnerabilities.filter(v => v.severity === 'high' || v.severity === 'critical').length === 0,
  }
}

/**
 * Create a secure content wrapper component
 */
export function createSecureContentWrapper(config: SecurityConfig = {}) {
  return function SecureContent({
    children,
    content,
    type = 'text',
    className,
    ...props
  }: {
    children?: React.ReactNode
    content?: string
    type?: 'text' | 'html' | 'markdown'
    className?: string
    [key: string]: any
  }) {
    const sanitizedContent = content ? sanitizeUserInput(content, type) : ''

    return (
      <div
        className={className}
        {...props}
        dangerouslySetInnerHTML={sanitizedContent ? { __html: sanitizedContent } : undefined}
      >
        {sanitizedContent ? null : children}
      </div>
    )
  }
}

// ============================================================================
// REACT SECURITY HOOKS
// ============================================================================

/**
 * React hook for secure content rendering
 */
export function useSecureContent(config: SecurityConfig = {}) {
  const sanitize = React.useCallback(
    (content: string, type: 'text' | 'html' | 'markdown' = 'text') => {
      return sanitizeUserInput(content, type)
    },
    []
  )

  const audit = React.useCallback(
    (content: string) => {
      return detectXSSPatterns(content)
    },
    []
  )

  return {
    sanitize,
    audit,
    isSecure: (content: string) => detectXSSPatterns(content).length === 0,
  }
}

/**
 * React hook for CSP management
 */
export function useCSP(config: SecurityConfig = {}) {
  React.useEffect(() => {
    if (config.enableCSP && typeof document !== 'undefined') {
      const cspHeader = generateCSPHeader(config.cspDirectives)
      const metaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]')

      if (metaTag) {
        metaTag.setAttribute('content', cspHeader)
      } else {
        const newMetaTag = document.createElement('meta')
        newMetaTag.setAttribute('http-equiv', 'Content-Security-Policy')
        newMetaTag.setAttribute('content', cspHeader)
        document.head.appendChild(newMetaTag)
      }
    }
  }, [config])

  return {
    cspHeader: generateCSPHeader(config.cspDirectives),
    validate: () => validateCSPDirectives(config.cspDirectives || {}),
  }
}

// ============================================================================
// SECURITY MONITORING
// ============================================================================

/**
 * Security monitoring utility
 */
export class SecurityMonitor {
  private static instance: SecurityMonitor
  private violations: Array<{
    timestamp: number
    type: string
    details: any
    component?: string
  }> = []

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
    }
    return SecurityMonitor.instance
  }

  /**
   * Report a security violation
   */
  reportViolation(
    type: 'xss' | 'csp' | 'sanitization' | 'headers',
    details: any,
    component?: string
  ): void {
    this.violations.push({
      timestamp: Date.now(),
      type,
      details,
      component,
    })

    // Log to console in development
    if (process.env['NODE_ENV'] === 'development') {
      console.warn(`Security violation detected: ${type}`, {
        component,
        details,
        timestamp: new Date().toISOString(),
      })
    }

    // In production, you might want to send this to a monitoring service
    // this.sendToMonitoringService(violations)
  }

  /**
   * Get security violations
   */
  getViolations(type?: string): Array<{
    timestamp: number
    type: string
    details: any
    component?: string
  }> {
    return type ? this.violations.filter(v => v.type === type) : this.violations
  }

  /**
   * Clear violations
   */
  clearViolations(): void {
    this.violations = []
  }

  /**
   * Get security report
   */
  getSecurityReport(): {
    totalViolations: number
    violationsByType: Record<string, number>
    recentViolations: Array<any>
  } {
    const violationsByType: Record<string, number> = {}

    this.violations.forEach(v => {
      violationsByType[v.type] = (violationsByType[v.type] || 0) + 1
    })

    return {
      totalViolations: this.violations.length,
      violationsByType,
      recentViolations: this.violations.slice(-10), // Last 10 violations
    }
  }
}

// Global security monitor instance
export const securityMonitor = SecurityMonitor.getInstance()

/**
 * Alias for SecurityMonitor (backward compatibility)
 */
export { SecurityMonitor as SecurityManager }
export { securityMonitor as securityManager }

/**
 * Hook to access security features
 */
export function useSecurity() {
  return {
    monitor: securityMonitor,
    ...useSecureContent(),
    ...useCSP(),
  }
}