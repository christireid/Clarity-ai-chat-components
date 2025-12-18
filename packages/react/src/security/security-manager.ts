/**
 * Enhanced Security Manager
 * Unified security orchestrator using the Enterprise Feature architecture.
 * Integrates Prompt Injection, PII Detection, Content Moderation, and Jailbreak Prevention.
 */

import {
  EnhancedEnterpriseFeature,
  type EnhancedBaseEnterpriseConfig,
  type EnterpriseProcessingResult,
} from '../enterprise/enterprise-feature-base.js'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { CLIError, ExitCode } from '../../../cli/src/utils/errors.js'
import { generateUniqueFilename } from '../../../primitives/src/lib/enterprise-utils.js'

// --- Configuration Interfaces ---

export interface SecurityServiceConfig extends EnhancedBaseEnterpriseConfig {
  validation: ValidationConfig
  sanitization: SanitizationConfig
  rateLimiting: RateLimitingConfig
  encryption: EncryptionConfig
  audit: AuditConfig
  jailbreak: JailbreakConfig
}

export interface ValidationConfig {
  enabled: boolean
  strict: boolean
  promptInjection: {
    enabled: boolean
    config?: any
  }
  contentModeration: {
    enabled: boolean
    config?: any
  }
}

export interface SanitizationConfig {
  enabled: boolean
  pii: {
    enabled: boolean
    config?: any
    redactionStrategy?: 'mask' | 'synthetic' | 'remove'
  }
  html: {
    enabled: boolean
    allowedTags?: string[]
  }
}

export interface RateLimitingConfig {
  enabled: boolean
  type: 'memory' | 'redis' | 'distributed'
  points: number
  duration: number
  blockDuration: number
  keyPrefix: string
}

export interface EncryptionConfig {
  enabled: boolean
  algorithm: string
  keyRotation: boolean
  rotationInterval: number
}

export interface AuditConfig {
  enabled: boolean
  logLevel: 'none' | 'basic' | 'detailed' | 'verbose'
  storage: 'memory' | 'file'
}

export interface JailbreakConfig {
  enabled: boolean
  config?: any
}

// --- Result Interfaces ---

export interface SecurityProcessingResult {
  validation: ValidationResult
  sanitization: SanitizationResult
  rateLimit: RateLimitResult
  jailbreak: JailbreakResult
  securityScore: number
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  passed: boolean
  blocked: boolean
  auditLogId?: string
}

// --- Legacy Compatibility Interfaces ---

export type SecurityConfig = Partial<SecurityServiceConfig>

export interface SecurityContext {
  userId?: string
  tenantId?: string
  sessionId?: string
  ip?: string
}

export interface SecurityResult {
  allowed: boolean
  reason?: string
  action: 'allow' | 'block' | 'warn'
  sanitizedInput?: string
  details?: any
}

export interface SecurityMetrics {
  score: number
  risk: string
  totalRequests: number
  blockedRequests: number
  averageDuration: number
}

export interface SecurityEvent {
  type: string
  severity: 'info' | 'warning' | 'critical'
  userId?: string
  details?: any
  timestamp: number
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  details?: {
    promptInjection?: any
    contentModeration?: any
  }
}

export interface SanitizationResult {
  sanitized: string
  wasModified: boolean
  details?: {
    pii?: any
    html?: any
  }
}

export interface RateLimitResult {
  allowed: boolean
  remainingPoints: number
  msBeforeNext: number
}

export interface JailbreakResult {
  safe: boolean
  details?: any
}

export interface SecurityRequest {
  data: any
  identifier: string // User ID or IP
  requestId?: string
  validate?: boolean
  sanitize?: boolean
  checkRateLimit?: boolean
  jailbreakCheck?: boolean // For output validation
  context?: any
}

// --- Main Class ---

export class SecurityManager extends EnhancedEnterpriseFeature<
  SecurityServiceConfig,
  SecurityRequest,
  SecurityProcessingResult
> {
  private validationService: ValidationService
  private sanitizationService: SanitizationService
  private rateLimitingService: RateLimitingService
  private auditService: AuditService
  private jailbreakService: JailbreakService

  constructor(config: Partial<SecurityServiceConfig> = {}) {
    super(config, 'security-manager')
    this.validationService = new ValidationService(
      this.config.validation,
      this.logger
    )
    this.sanitizationService = new SanitizationService(
      this.config.sanitization,
      this.logger
    )
    this.rateLimitingService = new RateLimitingService(
      this.config.rateLimiting,
      this.logger
    )
    this.auditService = new AuditService(
      this.config.audit,
      this.logger,
      this.config.outputDir
    )
    this.jailbreakService = new JailbreakService(
      this.config.jailbreak,
      this.logger
    )
  }

  getDefaultConfig(): SecurityServiceConfig {
    return {
      enabled: true,
      outputDir: './security-reports',
      formats: ['json'],
      thresholds: { securityScore: 70 },
      failOnThreshold: false,
      generateReports: true,
      includeGzip: false,
      generateTrends: true,
      logLevel: 'info',
      validation: {
        enabled: true,
        strict: true,
        promptInjection: { enabled: true },
        contentModeration: { enabled: true },
      },
      sanitization: {
        enabled: true,
        pii: { enabled: true, redactionStrategy: 'mask' },
        html: { enabled: true },
      },
      rateLimiting: {
        enabled: true,
        type: 'memory',
        points: 100,
        duration: durations.slower,
        blockDuration: 300,
        keyPrefix: 'sec',
      },
      encryption: {
        enabled: true,
        algorithm: 'aes-256-gcm',
        keyRotation: true,
        rotationInterval: 86400000,
      },
      audit: {
        enabled: true,
        logLevel: 'detailed',
        storage: 'file',
      },
      jailbreak: {
        enabled: true,
      },
    }
  }

  validateConfig(): void {
    if (
      this.config.rateLimiting.enabled &&
      this.config.rateLimiting.points <= 0
    ) {
      throw new Error('Rate limit points must be positive')
    }
  }

  /**
   * Main processing entry point
   */
  async process(request: SecurityRequest): Promise<SecurityProcessingResult> {
    this.emit('processing-start')
    const startTime = Date.now()

    // 1. Rate Limiting (Fail Fast)
    let rateLimit: RateLimitResult = {
      allowed: true,
      remainingPoints: -1,
      msBeforeNext: 0,
    }
    if (this.config.rateLimiting.enabled && request.checkRateLimit !== false) {
      rateLimit = await this.rateLimitingService.check(request.identifier)
      if (!rateLimit.allowed) {
        return this.finalizeResult(
          {
            validation: {
              isValid: false,
              errors: ['Rate limit exceeded'],
              warnings: [],
            },
            sanitization: { sanitized: request.data, wasModified: false },
            rateLimit,
            jailbreak: { safe: true },
            passed: false,
            blocked: true,
          },
          startTime,
          request
        )
      }
    }

    // 2. Validation (Prompt Injection, Content Mod)
    let validation: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    }
    if (this.config.validation.enabled && request.validate !== false) {
      validation = await this.validationService.validate(request.data)
      if (!validation.isValid && this.config.validation.strict) {
        return this.finalizeResult(
          {
            validation,
            sanitization: { sanitized: request.data, wasModified: false },
            rateLimit,
            jailbreak: { safe: true },
            passed: false,
            blocked: true,
          },
          startTime,
          request
        )
      }
    }

    // 3. Sanitization (PII, HTML)
    let sanitization: SanitizationResult = {
      sanitized: request.data,
      wasModified: false,
    }
    if (
      this.config.sanitization.enabled &&
      request.sanitize !== false &&
      typeof request.data === 'string'
    ) {
      sanitization = await this.sanitizationService.sanitize(request.data)
    }

    // 4. Jailbreak (Output Validation)
    let jailbreak: JailbreakResult = { safe: true }
    if (this.config.jailbreak.enabled && request.jailbreakCheck) {
      jailbreak = await this.jailbreakService.check(sanitization.sanitized)
      if (!jailbreak.safe) {
        return this.finalizeResult(
          {
            validation,
            sanitization,
            rateLimit,
            jailbreak,
            passed: false,
            blocked: true,
          },
          startTime,
          request
        )
      }
    }

    // Success
    return this.finalizeResult(
      {
        validation,
        sanitization,
        rateLimit,
        jailbreak,
        passed: true,
        blocked: false,
      },
      startTime,
      request
    )
  }

  private async finalizeResult(
    partial: Omit<SecurityProcessingResult, 'securityScore' | 'riskLevel'>,
    startTime: number,
    request: SecurityRequest
  ): Promise<SecurityProcessingResult> {
    const duration = Date.now() - startTime

    // Calculate Score & Risk
    const securityScore = this.calculateScore(partial)
    const riskLevel = this.calculateRisk(partial, securityScore)

    // Audit Log
    let auditLogId
    if (this.config.audit.enabled) {
      auditLogId = await this.auditService.log(request, partial, riskLevel)
    }

    const result: SecurityProcessingResult = {
      ...partial,
      securityScore,
      riskLevel,
      auditLogId,
    }

    // Update metrics
    this.updateMetrics('security', {
      score: securityScore,
      risk: riskLevel,
      blocked: result.blocked,
      duration,
    })

    this.emit('processing-complete', {
      success: true,
      data: result,
      warnings: result.validation?.warnings || [],
      errors: result.validation?.errors || [],
      metrics: {
        score: securityScore,
        risk: riskLevel,
        blocked: result.blocked,
      },
      timestamp: new Date(),
      duration,
    })

    return result
  }

  private calculateScore(result: any): number {
    let score = 100
    if (!result.validation.isValid) score -= 50
    if (result.rateLimit && !result.rateLimit.allowed) score -= 30
    if (!result.jailbreak.safe) score -= 50
    if (result.validation.warnings.length > 0) score -= 10
    if (result.sanitization.wasModified) score -= 5
    return Math.max(0, score)
  }

  private calculateRisk(
    result: any,
    score: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (result.blocked) return 'critical'
    if (score < 50) return 'high'
    if (score < 80) return 'medium'
    return 'low'
  }

  // --- Public Helpers for Hooks ---

  /**
   * Helper for jailbreak prevention messages
   */
  prepareMessages(messages: any[]): any[] {
    return this.jailbreakService.prepareMessages(messages)
  }

  /**
   * Helper for output validation
   */
  async validateOutput(
    output: string,
    context?: SecurityContext
  ): Promise<any> {
    const result = await this.process({
      data: output,
      identifier: context?.userId || 'system',
      validate: false,
      sanitize: false,
      checkRateLimit: false,
      jailbreakCheck: true,
      context,
    })

    return {
      safe: result.passed,
      risks: !result.passed ? { jailbreak: !result.jailbreak.safe } : {},
      action: result.passed ? 'allow' : 'block',
      output: result.passed ? output : undefined,
    }
  }

  // --- Compatibility Methods for useSecurity Hook ---

  /**
   * Validates input using the unified security process
   */
  async validateInput(
    input: string,
    context?: SecurityContext
  ): Promise<SecurityResult> {
    const result = await this.process({
      data: input,
      identifier: context?.userId || 'anonymous',
      validate: true,
      sanitize: true,
      checkRateLimit: true,
      context,
    })

    return {
      allowed: result.passed,
      reason: result.blocked
        ? result.validation.errors[0] || 'Blocked by security policy'
        : undefined,
      action: result.blocked
        ? 'block'
        : result.validation.warnings.length > 0
          ? 'warn'
          : 'allow',
      sanitizedInput: result.sanitization.sanitized,
      details: {
        riskLevel: result.riskLevel,
        score: result.securityScore,
        validation: result.validation,
        sanitization: result.sanitization,
      },
    }
  }

  /**
   * Get metrics in the legacy format
   */
  getMetrics(timeRange?: { start?: number; end?: number }): SecurityMetrics {
    const metrics = this.getMetrics('security')
    const filtered = timeRange
      ? metrics.filter((m) => {
          const t = new Date(m.timestamp).getTime()
          return (
            (!timeRange.start || t >= timeRange.start) &&
            (!timeRange.end || t <= timeRange.end)
          )
        })
      : metrics

    if (filtered.length === 0) {
      return {
        score: 100,
        risk: 'low',
        totalRequests: 0,
        blockedRequests: 0,
        averageDuration: 0,
      }
    }

    const total = filtered.length
    const blocked = filtered.filter((m) => m.blocked).length
    const durationSum = filtered.reduce((acc, m) => acc + (m.duration || 0), 0)
    const lastMetric = filtered[filtered.length - 1]

    return {
      score: lastMetric.score || 100,
      risk: lastMetric.risk || 'low',
      totalRequests: total,
      blockedRequests: blocked,
      averageDuration: durationSum / total,
    }
  }

  /**
   * Get events (Not fully implemented in base, mocking for compatibility)
   */
  getEvents(filter?: {
    type?: any
    severity?: any
    userId?: string
  }): SecurityEvent[] {
    // In a real implementation, we would query the AuditService
    // For now, return empty or mock
    return []
  }

  /**
   * Subscribe to alerts
   */
  onAlert(handler: {
    handle: (event: SecurityEvent) => void | Promise<void>
  }): void {
    // We can proxy internal events to this handler
    this.on('processing-complete', (result: any) => {
      if (result.data.blocked || result.data.riskLevel === 'critical') {
        handler.handle({
          type: 'security_alert',
          severity: result.data.blocked ? 'critical' : 'warning',
          timestamp: Date.now(),
          details: result.data,
        })
      }
    })

    this.on('threshold-exceeded', (data: any) => {
      handler.handle({
        type: 'threshold_exceeded',
        severity: 'warning',
        timestamp: Date.now(),
        details: data,
      })
    })
  }
}

// --- Sub-Services ---

class ValidationService {
  private promptInjection: any
  private contentFilter: any

  constructor(
    private config: ValidationConfig,
    private logger: any
  ) {}

  async validate(data: any): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    let promptResult, contentResult

    // Prompt Injection
    if (this.config.promptInjection.enabled && typeof data === 'string') {
      try {
        if (!this.promptInjection) {
          const { EnhancedPromptInjectionGuardrail } =
            await import('../safety/prompt-injection-enhanced.js')
          this.promptInjection = new EnhancedPromptInjectionGuardrail(
            this.config.promptInjection.config || {}
          )
        }
        promptResult = await this.promptInjection.check(data, { role: 'user' })
        if (!promptResult.safe) {
          errors.push('Prompt injection detected')
        }
      } catch (e) {
        this.logger.error('Prompt injection check failed', e)
      }
    }

    // Content Moderation
    if (this.config.contentModeration.enabled && typeof data === 'string') {
      try {
        if (!this.contentFilter) {
          const { ContentFilter } = await import('../safety/content-filter.js')
          this.contentFilter = new ContentFilter(
            this.config.contentModeration.config || {}
          )
        }
        contentResult = await this.contentFilter.filter(data)
        if (contentResult.flagged) {
          if (contentResult.action === 'block')
            errors.push('Content policy violation')
          else warnings.push('Content flagged')
        }
      } catch (e) {
        this.logger.error('Content moderation failed', e)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      details: {
        promptInjection: promptResult,
        contentModeration: contentResult,
      },
    }
  }
}

class SanitizationService {
  private piiDetector: any

  constructor(
    private config: SanitizationConfig,
    private logger: any
  ) {}

  async sanitize(data: string): Promise<SanitizationResult> {
    let sanitized = data
    let wasModified = false
    let piiResult

    // PII Redaction
    if (this.config.pii.enabled) {
      try {
        if (!this.piiDetector) {
          const { PIIDetector } = await import('../safety/pii-detection.js')
          this.piiDetector = new PIIDetector(this.config.pii.config || {})
        }
        piiResult = await this.piiDetector.detect(data)
        if (piiResult.entities.length > 0 && piiResult.redacted) {
          sanitized = piiResult.redacted
          wasModified = true
        }
      } catch (e) {
        this.logger.error('PII detection failed', e)
      }
    }

    return {
      sanitized,
      wasModified,
      details: { pii: piiResult },
    }
  }
}

class RateLimitingService {
  private requests: Map<string, number[]> = new Map()

  constructor(
    private config: RateLimitingConfig,
    private logger: any
  ) {
    if (config.type !== 'memory') {
      logger.warn(
        `Rate limiting type '${config.type}' not fully implemented, falling back to memory`
      )
    }
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const windowMs = this.config.duration * 1000

    let timestamps = this.requests.get(identifier) || []
    timestamps = timestamps.filter((t) => now - t < windowMs)

    if (timestamps.length >= this.config.points) {
      return {
        allowed: false,
        remainingPoints: 0,
        msBeforeNext: timestamps[0] + windowMs - now,
      }
    }

    timestamps.push(now)
    this.requests.set(identifier, timestamps)

    return {
      allowed: true,
      remainingPoints: this.config.points - timestamps.length,
      msBeforeNext: 0,
    }
  }
}

class JailbreakService {
  private preventer: any

  constructor(
    private config: JailbreakConfig,
    private logger: any
  ) {}

  private async getPreventer() {
    if (!this.preventer) {
      const { JailbreakPrevention } =
        await import('../safety/jailbreak-prevention.js')
      this.preventer = new JailbreakPrevention(this.config.config || {})
    }
    return this.preventer
  }

  async check(output: string): Promise<JailbreakResult> {
    try {
      const p = await this.getPreventer()
      const result = p.validateOutput(output)
      return { safe: result.safe, details: result }
    } catch (e) {
      this.logger.error('Jailbreak check failed', e)
      return { safe: false, details: { error: 'Security check failed' } } // Fail closed
    }
  }

  prepareMessages(messages: any[]): any[] {
    // This is synchronous in the original, but we might need to load it.
    // Ideally we assume it's loaded or do a sync load if possible,
    // or return messages unmodified if not loaded yet (trade-off).
    // For now, let's try to lazy load if we can, but prepareMessages is usually sync in React render loop.
    // We'll stub basic behavior or use a sync require if strictly needed,
    // but ES modules are async.
    // NOTE: This might be a limitation. We'll return unmodified if not ready.
    if (this.preventer) {
      return this.preventer.prepareMessages(messages)
    }
    return messages
  }
}

class AuditService {
  constructor(
    private config: AuditConfig,
    private logger: any,
    private outputDir: string
  ) {}

  async log(
    request: SecurityRequest,
    result: any,
    risk: string
  ): Promise<string> {
    const id = generateUniqueFilename('audit', 'json')

    if (this.config.logLevel !== 'none') {
      this.logger.info('Security Audit', {
        id,
        identifier: request.identifier,
        risk,
        blocked: result.blocked,
      })
    }

    if (this.config.storage === 'file' && this.outputDir) {
      try {
        const auditData = {
          id,
          timestamp: new Date().toISOString(),
          request: {
            identifier: request.identifier,
            requestId: request.requestId,
          },
          result: {
            blocked: result.blocked,
            risk,
            score: result.securityScore,
          },
          details: result,
        }
        // Ensure we handle potential errors if directory doesn't exist (though base class should ensure it)
        writeFileSync(
          join(this.outputDir, id),
          JSON.stringify(auditData, null, 2)
        )
      } catch (e) {
        this.logger.error('Failed to write audit log', e)
      }
    }

    return id
  }
}
