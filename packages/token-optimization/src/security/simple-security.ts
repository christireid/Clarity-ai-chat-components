/**
 * Simple Security Manager
 *
 * Lightweight security implementation for basic token protection
 */

export interface SimpleSecurityConfig {
  enableSanitization: boolean
  enableCompressionObfuscation: boolean
  enableAuditLogging: boolean
  enablePIIRedaction: boolean
  noiseLevel?: number
  complianceLevel?: 'basic' | 'enterprise' | 'government'
  auditRetention?: number
}

export interface SimpleSanitizationResult {
  sanitized: string
  originalLength: number
  sanitizedLength: number
  redactedPIICount: number
}

export class SimpleSecurityManager {
  private config: SimpleSecurityConfig

  constructor(config: Partial<SimpleSecurityConfig> = {}) {
    this.config = {
      enableSanitization: config.enableSanitization ?? true,
      enableCompressionObfuscation: config.enableCompressionObfuscation ?? true,
      enableAuditLogging: config.enableAuditLogging ?? true,
      enablePIIRedaction: config.enablePIIRedaction ?? true,
      noiseLevel: config.noiseLevel ?? 0.1,
      complianceLevel: config.complianceLevel ?? 'basic',
      auditRetention: config.auditRetention ?? 30,
    }
  }

  sanitize(text: string): SimpleSanitizationResult {
    if (!this.config.enableSanitization) {
      return {
        sanitized: text,
        originalLength: text.length,
        sanitizedLength: text.length,
        redactedPIICount: 0,
      }
    }

    let sanitized = text
    let redactedCount = 0

    if (this.config.enablePIIRedaction) {
      // Simple PII patterns - email, phone, SSN
      const emailPattern =
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
      const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
      const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/g

      const emailMatches = sanitized.match(emailPattern) || []
      const phoneMatches = sanitized.match(phonePattern) || []
      const ssnMatches = sanitized.match(ssnPattern) || []

      sanitized = sanitized.replace(emailPattern, '[REDACTED_EMAIL]')
      sanitized = sanitized.replace(phonePattern, '[REDACTED_PHONE]')
      sanitized = sanitized.replace(ssnPattern, '[REDACTED_SSN]')

      redactedCount =
        emailMatches.length + phoneMatches.length + ssnMatches.length
    }

    return {
      sanitized,
      originalLength: text.length,
      sanitizedLength: sanitized.length,
      redactedPIICount: redactedCount,
    }
  }

  logAudit(event: string, details?: Record<string, unknown>): void {
    if (this.config.enableAuditLogging) {
      console.debug('[SecurityAudit]', event, details)
    }
  }

  getConfig(): SimpleSecurityConfig {
    return { ...this.config }
  }

  /**
   * Sanitize input text and assess security risk
   */
  sanitizeInput(text: string): {
    sanitized: string
    threats: string[]
    riskLevel: 'low' | 'medium' | 'high'
  } {
    const result = this.sanitize(text)
    const threats: string[] = []

    // Check for potential threats
    if (result.redactedPIICount > 0) {
      threats.push(`Detected ${result.redactedPIICount} PII items`)
    }

    // Assess risk level based on threats
    let riskLevel: 'low' | 'medium' | 'high' = 'low'
    if (result.redactedPIICount > 5) {
      riskLevel = 'high'
    } else if (result.redactedPIICount > 0) {
      riskLevel = 'medium'
    }

    return {
      sanitized: result.sanitized,
      threats,
      riskLevel,
    }
  }
}
