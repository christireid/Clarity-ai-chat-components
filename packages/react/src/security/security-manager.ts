import { logger } from '@clarity-chat/utils/logger';
/**
 * Security Manager - Unified Security Layer (2025)
 *
 * Orchestrates all security features in a single unified API:
 * - Prompt injection detection (enhanced)
 * - Jailbreak prevention
 * - PII detection & redaction
 * - Content moderation
 * - Rate limiting
 * - Security monitoring
 *
 * Based on OWASP LLM Top 10 2025 and security best practices
 */

import type { EnhancedPromptInjectionConfig } from '../safety/prompt-injection-enhanced'
import type {
  JailbreakPreventionConfig,
  SafetyMessage,
  OutputValidationResult,
} from '../safety/jailbreak-prevention'

// These config types are defined inline since they're not exported from their modules
type PIIDetectionConfig = Record<string, unknown>
type ContentFilterConfig = Record<string, unknown>

/**
 * Security context for validation
 */
export interface SecurityContext {
  /**
   * User ID (for rate limiting and monitoring)
   */
  userId?: string

  /**
   * Tenant ID (for multi-tenant isolation)
   */
  tenantId?: string

  /**
   * Session ID
   */
  sessionId?: string

  /**
   * IP address
   */
  ipAddress?: string

  /**
   * Additional metadata
   */
  metadata?: Record<string, any>
}

/**
 * Security check result
 */
export interface SecurityCheckResult {
  /**
   * Check name
   */
  name: string

  /**
   * Whether check passed
   */
  passed: boolean

  /**
   * Confidence score (0-1)
   */
  confidence: number

  /**
   * Action to take
   */
  action: 'allow' | 'block' | 'warn' | 'redact'

  /**
   * Details about the issue
   */
  details?: any

  /**
   * Threat description
   */
  threats?: string[]
}

/**
 * Overall security validation result
 */
export interface SecurityResult {
  /**
   * Whether input is allowed
   */
  allowed: boolean

  /**
   * Reason for block (if applicable)
   */
  reason?: string

  /**
   * Action to take
   */
  action: 'allow' | 'block' | 'warn'

  /**
   * Sanitized/cleaned input
   */
  sanitizedInput?: string

  /**
   * Individual check results
   */
  checks?: SecurityCheckResult[]

  /**
   * Detailed information
   */
  details?: any
}

/**
 * Security event types
 */
export type SecurityEventType =
  | 'prompt_injection_detected'
  | 'pii_detected'
  | 'content_moderation_triggered'
  | 'jailbreak_attempt'
  | 'rate_limit_exceeded'
  | 'suspicious_pattern'
  | 'authentication_failure'
  | 'unauthorized_access'
  | 'output_validation_failed'

/**
 * Security event
 */
export interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: 'info' | 'warning' | 'critical'
  timestamp: number
  userId?: string
  tenantId?: string
  details: any
  metadata?: Record<string, any>
}

/**
 * Alert handler interface
 */
export interface AlertHandler {
  handle(event: SecurityEvent): Promise<void> | void
}

/**
 * Security metrics
 */
export interface SecurityMetrics {
  totalEvents: number
  eventsByType: Record<SecurityEventType, number>
  eventsBySeverity: Record<'info' | 'warning' | 'critical', number>
  promptInjectionRate: number
  piiDetectionRate: number
  contentModerationRate: number
  averageDetectionTime: number
  topOffendingUsers: Array<{ userId: string; count: number }>
}

/**
 * Time range for metrics
 */
export interface TimeRange {
  start: number
  end: number
}

/**
 * Comprehensive security configuration
 */
export interface SecurityConfig {
  /**
   * PII Detection
   */
  pii?: {
    enabled: boolean
    patterns?: string[]
    redactionStrategy?: 'mask' | 'synthetic' | 'remove'
    config?: PIIDetectionConfig
  }

  /**
   * Prompt Injection Protection
   */
  promptInjection?: {
    enabled: boolean
    config?: EnhancedPromptInjectionConfig
  }

  /**
   * Content Moderation
   */
  contentModeration?: {
    enabled: boolean
    config?: ContentFilterConfig
    thresholds?: {
      hate?: number
      violence?: number
      sexual?: number
      harassment?: number
    }
  }

  /**
   * Jailbreak Prevention
   */
  jailbreakPrevention?: {
    enabled: boolean
    config?: JailbreakPreventionConfig
  }

  /**
   * Security Monitoring
   */
  monitoring?: {
    enabled: boolean
    logEvents?: boolean
    alertHandlers?: AlertHandler[]
  }

  /**
   * Rate Limiting
   */
  rateLimiting?: {
    enabled: boolean
    maxRequestsPerMinute?: number
    maxRequestsPerHour?: number
    maxRequestsPerDay?: number
  }
}

/**
 * Security Manager
 *
 * Unified API for all security features
 */
export class SecurityManager {
  private config: SecurityConfig
  private events: SecurityEvent[] = []
  private alertHandlers: AlertHandler[] = []
  private rateLimitTracking: Map<string, number[]> = new Map()

  // Lazy-loaded security components
  private promptInjectionGuard?: any
  private jailbreakPreventer?: any
  private piiDetector?: any
  private contentFilter?: any

  constructor(config: SecurityConfig = {}) {
    this.config = {
      pii: { enabled: false, ...config.pii },
      promptInjection: { enabled: false, ...config.promptInjection },
      contentModeration: { enabled: false, ...config.contentModeration },
      jailbreakPrevention: { enabled: false, ...config.jailbreakPrevention },
      monitoring: { enabled: true, logEvents: true, ...config.monitoring },
      rateLimiting: {
        enabled: false,
        maxRequestsPerMinute: 60,
        maxRequestsPerHour: 1000,
        maxRequestsPerDay: 10000,
        ...config.rateLimiting,
      },
    }

    // Register alert handlers
    if (this.config.monitoring?.alertHandlers) {
      this.alertHandlers = this.config.monitoring.alertHandlers
    }
  }

  /**
   * Validate user input through all security layers
   */
  async validateInput(
    input: string,
    context?: SecurityContext
  ): Promise<SecurityResult> {
    const results: SecurityCheckResult[] = []
    let sanitizedInput = input

    // 1. Rate limiting check
    if (this.config.rateLimiting?.enabled && context?.userId) {
      const rateLimitResult = this.checkRateLimit(context.userId)
      if (!rateLimitResult.allowed) {
        await this.logSecurityEvent({
          type: 'rate_limit_exceeded',
          severity: 'warning',
          userId: context.userId,
          tenantId: context.tenantId,
          details: rateLimitResult,
        })

        return {
          allowed: false,
          reason: 'rate_limit_exceeded',
          action: 'block',
        }
      }
    }

    // 2. Prompt injection detection
    if (this.config.promptInjection?.enabled) {
      const injectionResult = await this.detectPromptInjection(input)
      results.push({
        name: 'prompt_injection',
        passed: injectionResult.safe,
        confidence: injectionResult.confidence,
        action: injectionResult.action as any,
        details: injectionResult,
        threats: injectionResult.threats,
      })

      if (!injectionResult.safe && injectionResult.confidence > 0.7) {
        await this.logSecurityEvent({
          type: 'prompt_injection_detected',
          severity: 'critical',
          userId: context?.userId,
          tenantId: context?.tenantId,
          details: injectionResult,
        })

        return {
          allowed: false,
          reason: 'prompt_injection',
          action: 'block',
          details: injectionResult,
          checks: results,
        }
      }
    }

    // 3. PII detection & redaction
    if (this.config.pii?.enabled) {
      const piiResult = await this.detectPII(input)
      results.push({
        name: 'pii_detection',
        passed: piiResult.entities.length === 0,
        confidence: piiResult.entities.length > 0 ? 0.9 : 0,
        action: piiResult.entities.length > 0 ? 'redact' : 'allow',
        details: piiResult,
      })

      if (piiResult.entities.length > 0) {
        await this.logSecurityEvent({
          type: 'pii_detected',
          severity: 'warning',
          userId: context?.userId,
          tenantId: context?.tenantId,
          details: piiResult,
        })

        // Redact PII
        sanitizedInput = piiResult.redacted || input
      }
    }

    // 4. Content moderation
    if (this.config.contentModeration?.enabled) {
      const moderationResult = await this.moderateContent(input)
      results.push({
        name: 'content_moderation',
        passed: !moderationResult.flagged,
        confidence: moderationResult.flagged ? 0.8 : 0,
        action: moderationResult.action as any,
        details: moderationResult,
      })

      if (moderationResult.action === 'block') {
        await this.logSecurityEvent({
          type: 'content_moderation_triggered',
          severity: 'warning',
          userId: context?.userId,
          tenantId: context?.tenantId,
          details: moderationResult,
        })

        return {
          allowed: false,
          reason: 'content_policy_violation',
          action: 'block',
          details: moderationResult,
          checks: results,
        }
      }
    }

    return {
      allowed: true,
      sanitizedInput,
      action: 'allow',
      checks: results,
    }
  }

  /**
   * Prepare messages with jailbreak prevention
   */
  prepareMessages(messages: SafetyMessage[]): SafetyMessage[] {
    if (!this.config.jailbreakPrevention?.enabled) {
      return messages
    }

    if (!this.jailbreakPreventer) {
      // Lazy load
      const { JailbreakPrevention } = require('../safety/jailbreak-prevention')
      this.jailbreakPreventer = new JailbreakPrevention(
        this.config.jailbreakPrevention.config || {}
      )
    }

    return this.jailbreakPreventer.prepareMessages(messages)
  }

  /**
   * Validate LLM output
   */
  async validateOutput(
    output: string,
    context?: SecurityContext
  ): Promise<OutputValidationResult> {
    if (!this.config.jailbreakPrevention?.enabled) {
      return { safe: true, risks: {}, action: 'allow', output }
    }

    if (!this.jailbreakPreventer) {
      // Lazy load
      const { JailbreakPrevention } = require('../safety/jailbreak-prevention')
      this.jailbreakPreventer = new JailbreakPrevention(
        this.config.jailbreakPrevention.config || {}
      )
    }

    const result = this.jailbreakPreventer.validateOutput(output)

    if (!result.safe) {
      await this.logSecurityEvent({
        type: 'output_validation_failed',
        severity: 'critical',
        userId: context?.userId,
        tenantId: context?.tenantId,
        details: result,
      })
    }

    return { ...result, output: result.safe ? output : undefined }
  }

  /**
   * Detect prompt injection
   */
  private async detectPromptInjection(input: string): Promise<any> {
    if (!this.promptInjectionGuard) {
      // Lazy load
      const {
        EnhancedPromptInjectionGuardrail,
      } = require('../safety/prompt-injection-enhanced')
      this.promptInjectionGuard = new EnhancedPromptInjectionGuardrail(
        this.config.promptInjection?.config || {}
      )
    }

    return await this.promptInjectionGuard.check(input, { role: 'user' })
  }

  /**
   * Detect PII
   */
  private async detectPII(input: string): Promise<any> {
    if (!this.piiDetector) {
      // Lazy load
      const { PIIDetector } = require('../safety/pii-detection')
      this.piiDetector = new PIIDetector(this.config.pii?.config || {})
    }

    return await this.piiDetector.detect(input)
  }

  /**
   * Moderate content
   */
  private async moderateContent(input: string): Promise<any> {
    if (!this.contentFilter) {
      // Lazy load
      const { ContentFilter } = require('../safety/content-filter')
      this.contentFilter = new ContentFilter(
        this.config.contentModeration?.config || {}
      )
    }

    return await this.contentFilter.filter(input)
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(userId: string): {
    allowed: boolean
    remaining: number
  } {
    if (!this.config.rateLimiting?.enabled) {
      return { allowed: true, remaining: -1 }
    }

    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute

    // Get or create rate limit tracker
    let requests = this.rateLimitTracking.get(userId) || []

    // Remove old requests outside window
    requests = requests.filter((timestamp) => now - timestamp < windowMs)

    // Check if rate limit exceeded
    const limit = this.config.rateLimiting.maxRequestsPerMinute || 60
    if (requests.length >= limit) {
      return { allowed: false, remaining: 0 }
    }

    // Record this request
    requests.push(now)
    this.rateLimitTracking.set(userId, requests)

    return { allowed: true, remaining: limit - requests.length }
  }

  /**
   * Log security event
   */
  private async logSecurityEvent(
    event: Omit<SecurityEvent, 'id' | 'timestamp'>
  ): Promise<void> {
    if (!this.config.monitoring?.enabled) {
      return
    }

    const fullEvent: SecurityEvent = {
      ...event,
      id: this.generateId(),
      timestamp: Date.now(),
    }

    if (this.config.monitoring.logEvents) {
      this.events.push(fullEvent)
    }

    // Trigger alerts for critical events
    if (event.severity === 'critical') {
      await this.triggerAlerts(fullEvent)
    }
  }

  /**
   * Trigger alert handlers
   */
  private async triggerAlerts(event: SecurityEvent): Promise<void> {
    for (const handler of this.alertHandlers) {
      try {
        await handler.handle(event)
      } catch (error) {
        logger.logger.error('Alert handler failed:', error)
      }
    }
  }

  /**
   * Get security metrics
   */
  getMetrics(timeRange?: { start?: number; end?: number }): SecurityMetrics {
    const start = timeRange?.start || 0
    const end = timeRange?.end || Date.now()

    const filteredEvents = this.events.filter(
      (e) => e.timestamp >= start && e.timestamp <= end
    )

    const eventsByType: Record<string, number> = {}
    const eventsBySeverity: Record<string, number> = {}
    const userEventCounts: Record<string, number> = {}

    for (const event of filteredEvents) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
      eventsBySeverity[event.severity] =
        (eventsBySeverity[event.severity] || 0) + 1

      if (event.userId) {
        userEventCounts[event.userId] = (userEventCounts[event.userId] || 0) + 1
      }
    }

    const topOffendingUsers = Object.entries(userEventCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalEvents: filteredEvents.length,
      eventsByType: eventsByType as any,
      eventsBySeverity: eventsBySeverity as any,
      promptInjectionRate:
        (eventsByType['prompt_injection_detected'] || 0) /
        Math.max(filteredEvents.length, 1),
      piiDetectionRate:
        (eventsByType['pii_detected'] || 0) /
        Math.max(filteredEvents.length, 1),
      contentModerationRate:
        (eventsByType['content_moderation_triggered'] || 0) /
        Math.max(filteredEvents.length, 1),
      averageDetectionTime: 0, // TODO: Implement timing
      topOffendingUsers,
    }
  }

  /**
   * Get all security events
   */
  getEvents(filter?: {
    type?: SecurityEventType
    severity?: 'info' | 'warning' | 'critical'
    userId?: string
    limit?: number
  }): SecurityEvent[] {
    let events = [...this.events]

    if (filter?.type) {
      events = events.filter((e) => e.type === filter.type)
    }

    if (filter?.severity) {
      events = events.filter((e) => e.severity === filter.severity)
    }

    if (filter?.userId) {
      events = events.filter((e) => e.userId === filter.userId)
    }

    if (filter?.limit) {
      events = events.slice(-filter.limit)
    }

    return events
  }

  /**
   * Register alert handler
   */
  onAlert(handler: AlertHandler): void {
    this.alertHandlers.push(handler)
  }

  /**
   * Clear events (for testing/cleanup)
   */
  clearEvents(): void {
    this.events = []
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `sec-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
}

/**
 * Common alert handlers
 */

/**
 * Webhook alert handler
 */
export class WebhookAlertHandler implements AlertHandler {
  constructor(private webhookUrl: string) {}

  async handle(event: SecurityEvent): Promise<void> {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert: 'Security Event',
          severity: event.severity,
          type: event.type,
          details: event.details,
          timestamp: event.timestamp,
          userId: event.userId,
        }),
      })
    } catch (error) {
      logger.logger.error('Webhook alert failed:', error)
    }
  }
}

/**
 * Console alert handler (for development)
 */
export class ConsoleAlertHandler implements AlertHandler {
  handle(event: SecurityEvent): void {
    const emoji =
      event.severity === 'critical'
        ? '🚨'
        : event.severity === 'warning'
          ? '⚠️'
          : 'ℹ️'
    logger.warn(
      `${emoji} Security Alert [${event.severity.toUpperCase()}]: ${event.type}`,
      event.details
    )
  }
}
