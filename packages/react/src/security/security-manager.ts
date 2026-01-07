/**
 * Security Manager
 *
 * Core security infrastructure for AI chat applications.
 * Provides input validation, output validation, and security event tracking.
 */

import type { SafetyMessage } from '../safety/jailbreak-prevention'
import {
  prepareSecureMessages,
  validateOutput as validateOutputSafety,
} from '../safety/jailbreak-prevention'

// =============================================================================
// Types
// =============================================================================

/**
 * Security configuration options
 */
export interface SecurityConfig {
  /** Prompt injection detection settings */
  promptInjection?: {
    enabled?: boolean
    strict?: boolean
    blockedPatterns?: string[]
  }
  /** PII detection and redaction settings */
  pii?: {
    enabled?: boolean
    redactionStrategy?: 'mask' | 'synthetic' | 'remove'
    patterns?: string[]
  }
  /** Rate limiting settings */
  rateLimit?: {
    enabled?: boolean
    maxRequests?: number
    windowMs?: number
  }
  /** Content filtering settings */
  contentFilter?: {
    enabled?: boolean
    categories?: string[]
    threshold?: number
  }
}

/**
 * Security validation result
 */
export interface SecurityResult {
  /** Whether the input is allowed */
  allowed: boolean
  /** Reason for blocking (if blocked) */
  reason?: string
  /** Action to take */
  action?: 'allow' | 'warn' | 'block'
  /** Sanitized version of the input */
  sanitizedInput?: string
  /** Detailed information about the validation */
  details?: Record<string, unknown>
}

/**
 * Context for security validation
 */
export interface SecurityContext {
  /** User identifier */
  userId?: string
  /** Tenant identifier */
  tenantId?: string
  /** Session identifier */
  sessionId?: string
  /** Custom metadata */
  metadata?: Record<string, unknown>
}

/**
 * Security metrics
 */
export interface SecurityMetrics {
  /** Total requests validated */
  totalRequests: number
  /** Blocked requests */
  blockedRequests: number
  /** Warnings issued */
  warnings: number
  /** Rate limit hits */
  rateLimitHits: number
  /** PII detections */
  piiDetections: number
  /** Prompt injection attempts */
  injectionAttempts: number
}

/**
 * Security event for logging and monitoring
 */
export interface SecurityEvent {
  /** Event identifier */
  id: string
  /** Event type */
  type:
    | 'validation'
    | 'block'
    | 'warning'
    | 'rate_limit'
    | 'pii_detected'
    | 'injection_attempt'
  /** Event severity */
  severity: 'info' | 'warning' | 'critical'
  /** User identifier */
  userId?: string
  /** Event timestamp */
  timestamp: Date
  /** Event details */
  details?: Record<string, unknown>
}

/**
 * Alert handler interface
 */
interface AlertHandler {
  handle: (event: SecurityEvent) => void | Promise<void>
}

// =============================================================================
// SecurityManager Class
// =============================================================================

/**
 * Security Manager
 *
 * Centralizes security operations for AI chat applications.
 */
export class SecurityManager {
  private config: SecurityConfig
  private events: SecurityEvent[] = []
  private metrics: SecurityMetrics = {
    totalRequests: 0,
    blockedRequests: 0,
    warnings: 0,
    rateLimitHits: 0,
    piiDetections: 0,
    injectionAttempts: 0,
  }
  private alertHandlers: AlertHandler[] = []
  private rateLimitMap: Map<string, { count: number; resetTime: number }> =
    new Map()

  constructor(config?: SecurityConfig) {
    this.config = {
      promptInjection: { enabled: true, strict: false, blockedPatterns: [] },
      pii: { enabled: true, redactionStrategy: 'mask', patterns: [] },
      rateLimit: { enabled: false, maxRequests: 100, windowMs: 60000 },
      contentFilter: { enabled: false, categories: [], threshold: 0.8 },
      ...config,
    }
  }

  /**
   * Validate user input
   */
  async validateInput(
    input: string,
    context?: SecurityContext
  ): Promise<SecurityResult> {
    this.metrics.totalRequests++

    // Check rate limit
    if (this.config.rateLimit?.enabled && context?.userId) {
      const isLimited = this.checkRateLimit(context.userId)
      if (isLimited) {
        this.metrics.rateLimitHits++
        this.addEvent({
          type: 'rate_limit',
          severity: 'warning',
          userId: context.userId,
          details: { reason: 'rate_limit_exceeded' },
        })
        return {
          allowed: false,
          reason: 'rate_limit_exceeded',
          action: 'block',
        }
      }
    }

    // Check for empty input
    if (!input || input.trim().length === 0) {
      return { allowed: true, action: 'allow', sanitizedInput: input }
    }

    // Check for prompt injection patterns
    if (this.config.promptInjection?.enabled) {
      const injectionResult = this.detectPromptInjection(input)
      if (injectionResult.detected) {
        this.metrics.injectionAttempts++
        this.metrics.blockedRequests++
        this.addEvent({
          type: 'injection_attempt',
          severity: 'critical',
          userId: context?.userId,
          details: { patterns: injectionResult.patterns },
        })
        return {
          allowed: false,
          reason: 'potential_prompt_injection',
          action: 'block',
          details: { patterns: injectionResult.patterns },
        }
      }
    }

    // Check for PII
    let sanitizedInput = input
    if (this.config.pii?.enabled) {
      const piiResult = this.detectAndRedactPII(input)
      if (piiResult.detected) {
        this.metrics.piiDetections++
        sanitizedInput = piiResult.redacted
        this.addEvent({
          type: 'pii_detected',
          severity: 'warning',
          userId: context?.userId,
          details: { types: piiResult.types },
        })
      }
    }

    return {
      allowed: true,
      action: 'allow',
      sanitizedInput,
    }
  }

  /**
   * Prepare messages with security protections
   */
  prepareMessages(messages: SafetyMessage[]): SafetyMessage[] {
    return prepareSecureMessages(messages)
  }

  /**
   * Validate LLM output
   */
  async validateOutput(
    output: string,
    _context?: SecurityContext
  ): Promise<{
    safe: boolean
    output?: string
    action: 'allow' | 'block' | 'sanitize'
    risks: {
      containsSystemInstructions?: boolean
      containsRoleChange?: boolean
      containsEscapeAttempt?: boolean
      containsBracketViolation?: boolean
      containsMetaInstructions?: boolean
    }
  }> {
    const result = validateOutputSafety(output)
    return {
      safe: result.safe,
      output: result.output,
      action: result.action,
      risks: result.risks,
    }
  }

  /**
   * Get security metrics
   */
  getMetrics(_timeRange?: { start?: number; end?: number }): SecurityMetrics {
    return { ...this.metrics }
  }

  /**
   * Get security events
   */
  getEvents(filter?: {
    type?: string
    severity?: 'info' | 'warning' | 'critical'
    userId?: string
    limit?: number
  }): SecurityEvent[] {
    let filtered = [...this.events]

    if (filter?.type) {
      filtered = filtered.filter((e) => e.type === filter.type)
    }
    if (filter?.severity) {
      filtered = filtered.filter((e) => e.severity === filter.severity)
    }
    if (filter?.userId) {
      filtered = filtered.filter((e) => e.userId === filter.userId)
    }
    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit)
    }

    return filtered
  }

  /**
   * Register an alert handler
   */
  onAlert(handler: AlertHandler): void {
    this.alertHandlers.push(handler)
  }

  // =============================================================================
  // Private Methods
  // =============================================================================

  private checkRateLimit(userId: string): boolean {
    const now = Date.now()
    const entry = this.rateLimitMap.get(userId)
    const windowMs = this.config.rateLimit?.windowMs ?? 60000
    const maxRequests = this.config.rateLimit?.maxRequests ?? 100

    if (!entry || now > entry.resetTime) {
      this.rateLimitMap.set(userId, { count: 1, resetTime: now + windowMs })
      return false
    }

    entry.count++
    return entry.count > maxRequests
  }

  private detectPromptInjection(input: string): {
    detected: boolean
    patterns: string[]
  } {
    const lowerInput = input.toLowerCase()
    const detectedPatterns: string[] = []

    // Common injection patterns
    const patterns = [
      'ignore previous instructions',
      'ignore all previous',
      'disregard previous',
      'forget previous',
      'new instructions:',
      'system prompt:',
      'you are now',
      'act as if',
      'pretend you are',
      'jailbreak',
      'dan mode',
      'developer mode',
      ...(this.config.promptInjection?.blockedPatterns ?? []),
    ]

    for (const pattern of patterns) {
      if (lowerInput.includes(pattern.toLowerCase())) {
        detectedPatterns.push(pattern)
      }
    }

    return {
      detected: detectedPatterns.length > 0,
      patterns: detectedPatterns,
    }
  }

  private detectAndRedactPII(input: string): {
    detected: boolean
    redacted: string
    types: string[]
  } {
    let redacted = input
    const types: string[] = []

    // Email pattern
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    if (emailPattern.test(input)) {
      types.push('email')
      redacted = redacted.replace(emailPattern, '[EMAIL_REDACTED]')
    }

    // Phone pattern (US format)
    const phonePattern =
      /\b(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g
    if (phonePattern.test(input)) {
      types.push('phone')
      redacted = redacted.replace(phonePattern, '[PHONE_REDACTED]')
    }

    // SSN pattern
    const ssnPattern = /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g
    if (ssnPattern.test(input)) {
      types.push('ssn')
      redacted = redacted.replace(ssnPattern, '[SSN_REDACTED]')
    }

    // Credit card pattern
    const ccPattern = /\b(?:\d{4}[-.\s]?){3}\d{4}\b/g
    if (ccPattern.test(input)) {
      types.push('credit_card')
      redacted = redacted.replace(ccPattern, '[CC_REDACTED]')
    }

    return {
      detected: types.length > 0,
      redacted,
      types,
    }
  }

  private addEvent(eventData: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const event: SecurityEvent = {
      ...eventData,
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    }

    this.events.push(event)

    // Notify alert handlers
    for (const handler of this.alertHandlers) {
      try {
        handler.handle(event)
      } catch {
        // Ignore handler errors
      }
    }

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }
  }
}
