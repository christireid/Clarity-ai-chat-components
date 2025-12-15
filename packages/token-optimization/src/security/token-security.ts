/**
 * Token Security Manager
 * 
 * Comprehensive security framework for token optimization
 * Implements OWASP LLM Top 10 security measures
 */

export interface SecurityConfig {
  enableSanitization: boolean
  enableCompressionObfuscation: boolean
  enableAuditLogging: boolean
  enablePIIRedaction: boolean
  noiseLevel?: number
  complianceLevel?: 'basic' | 'enterprise' | 'government'
  auditRetention?: number // days
}

export interface SecurityEvent {
  type: 'token_count' | 'compression' | 'optimization' | 'access'
  timestamp: Date
  originalText: string
  processedText?: string
  originalLength: number
  processedLength?: number
  checks: string[]
  riskLevel: 'low' | 'medium' | 'high'
  userId?: string
  sessionId?: string
}

export class TokenSecurityManager {
  private auditLog: SecurityEvent[] = []
  
  constructor(private config: SecurityConfig) {
    this.setupAuditCleanup()
  }

  /**
   * OWASP LLM01: Prompt Injection Prevention
   */
  sanitizeInput(text: string): SanitizationResult {
    if (!this.config.enableSanitization) {
      return {
        original: text,
        sanitized: text,
        threats: [],
        riskLevel: 'low'
      }
    }

    let sanitized = text
    const detectedThreats: Threat[] = []

    // Multi-layer injection detection
    const injectionPatterns = [
      // Direct injection attempts
      {
        pattern: /ignore.*previous.*instructions/gi,
        type: 'instruction_override',
        severity: 'high'
      },
      {
        pattern: /system:\s*.*/gi,
        type: 'system_prompt_injection',
        severity: 'high'
      },
      {
        pattern: /you\s+are\s+now/gi,
        type: 'role_manipulation',
        severity: 'high'
      },
      {
        pattern: /disregard.*above/gi,
        type: 'context_override',
        severity: 'medium'
      },
      
      // Indirect injection
      {
        pattern: /translate.*to.*system/gi,
        type: 'indirect_injection',
        severity: 'medium'
      },
      {
        pattern: /pretend.*you.*are/gi,
        type: 'roleplay_injection',
        severity: 'medium'
      },
      
      // Advanced injection techniques
      {
        pattern: /unicode.*bypass/gi,
        type: 'encoding_bypass',
        severity: 'high'
      },
      {
        pattern: /base64.*instruction/gi,
        type: 'encoding_injection',
        severity: 'high'
      },
      
      // Token-specific attacks
      {
        pattern: /compression.*ratio.*leak/gi,
        type: 'side_channel',
        severity: 'medium'
      },
      {
        pattern: /token.*count.*attack/gi,
        type: 'timing_attack',
        severity: 'medium'
      }
    ]

    // Check each pattern
    injectionPatterns.forEach(({ pattern, type, severity }) => {
      if (pattern.test(sanitized)) {
        // Replace with safe placeholder
        sanitized = sanitized.replace(pattern, `[INJECTION_ATTEMPT:${type}]`)
        
        detectedThreats.push({
          type,
          severity: severity as 'low' | 'medium' | 'high',
          pattern: pattern.source,
          detected: true
        })
      }
    })

    // Additional sanitization
    sanitized = this.additionalSanitization(sanitized)

    const riskLevel = this.calculateRiskLevel(detectedThreats)

    return {
      original: text,
      sanitized,
      threats: detectedThreats,
      riskLevel
    }
  }

  /**
   * OWASP LLM02: Sensitive Information Disclosure Prevention
   */
  protectSensitiveData(text: string): ProtectionResult {
    if (!this.config.enablePIIRedaction) {
      return {
        original: text,
        protected: text,
        redactedTypes: [],
        riskLevel: 'low'
      }
    }

    let protectedText = text
    const redactedTypes: string[] = []

    // PII Detection and Redaction
    const piiPatterns = [
      // Email addresses
      {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        type: 'email',
        replacement: '[EMAIL]'
      },
      // Phone numbers
      {
        pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
        type: 'phone',
        replacement: '[PHONE]'
      },
      // Social Security Numbers
      {
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        type: 'ssn',
        replacement: '[SSN]'
      },
      // Credit card numbers
      {
        pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
        type: 'credit_card',
        replacement: '[CREDIT_CARD]'
      },
      // API keys
      {
        pattern: /\b[a-zA-Z0-9]{32,}\b/g,
        type: 'api_key',
        replacement: '[API_KEY]'
      },
      // Passwords
      {
        pattern: /\b(password|pwd|pass)\s*[:=]\s*[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}\b/gi,
        type: 'password',
        replacement: '[PASSWORD]'
      },
      // Passport numbers
      {
        pattern: /\b[A-Z]{1,2}\d{6,8}\b/g,
        type: 'passport',
        replacement: '[PASSPORT]'
      },
      // License plates
      {
        pattern: /\b[A-Z]{2}\d{6,8}\b/g,
        type: 'license_plate',
        replacement: '[LICENSE]'
      }
    ]

    piiPatterns.forEach(({ pattern, type, replacement }) => {
      if (pattern.test(protectedText)) {
        protectedText = protectedText.replace(pattern, replacement)
        redactedTypes.push(type)
      }
    })

    // Additional data protection
    protectedText = this.additionalDataProtection(protectedText)

    const riskLevel = redactedTypes.length > 0 ? 'medium' : 'low'

    return {
      original: text,
      protected: protectedText,
      redactedTypes: [...new Set(redactedTypes)], // Remove duplicates
      riskLevel
    }
  }

  /**
   * Compression ratio protection against side-channel attacks
   */
  protectCompressionRatio(
    originalTokens: number,
    compressedTokens: number
  ): ProtectedMetrics {
    if (!this.config.enableCompressionObfuscation) {
      return {
        compressionRatio: compressedTokens / originalTokens,
        originalTokens,
        compressedTokens,
        noiseLevel: 0,
        protectionLevel: 'none'
      }
    }

    const noiseLevel = this.config.noiseLevel || 0.1 // ±10% noise by default
    
    // Add controlled noise to prevent information leakage
    const noise = (Math.random() - 0.5) * noiseLevel
    let protectedRatio = (compressedTokens / originalTokens) + noise
    
    // Clamp to reasonable bounds
    protectedRatio = Math.max(0.1, Math.min(0.95, protectedRatio))
    
    // Additional protection based on compliance level
    if (this.config.complianceLevel === 'government') {
      // Add time-based obfuscation for government level
      const timeNoise = Math.sin(Date.now() / 3600000) * 0.05 // ±5% time-based
      protectedRatio += timeNoise
      protectedRatio = Math.max(0.1, Math.min(0.95, protectedRatio))
    }

    // Obfuscate token counts
    const obfuscatedOriginal = this.obfuscateTokenCount(originalTokens)
    const obfuscatedCompressed = this.obfuscateTokenCount(compressedTokens)

    return {
      compressionRatio: protectedRatio,
      originalTokens: obfuscatedOriginal,
      compressedTokens: obfuscatedCompressed,
      noiseLevel,
      protectionLevel: this.config.complianceLevel || 'basic'
    }
  }

  /**
   * Comprehensive security audit logging
   */
  logSecurityEvent(event: SecurityEvent): void {
    if (!this.config.enableAuditLogging) return

    // Add to audit log
    this.auditLog.push(event)

    // Limit audit log size
    const maxSize = 10000
    if (this.auditLog.length > maxSize) {
      this.auditLog = this.auditLog.slice(-maxSize)
    }

    // Real-time security alert for high-risk events
    if (event.riskLevel === 'high') {
      this.sendSecurityAlert(event)
    }

    // Detailed audit entry
    const auditEntry = {
      timestamp: event.timestamp.toISOString(),
      type: event.type,
      riskLevel: event.riskLevel,
      originalLength: event.originalLength,
      processedLength: event.processedLength,
      checks: event.checks,
      userId: event.userId,
      sessionId: event.sessionId
    }

    // In production, this would go to a secure audit system
    console.log('[SECURITY AUDIT]', auditEntry)
  }

  /**
   * Generate security compliance report
   */
  generateComplianceReport(): ComplianceReport {
    const recentEvents = this.auditLog.filter(
      event => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000
    )

    const riskLevels = {
      low: recentEvents.filter(e => e.riskLevel === 'low').length,
      medium: recentEvents.filter(e => e.riskLevel === 'medium').length,
      high: recentEvents.filter(e => e.riskLevel === 'high').length
    }

    const complianceChecks = {
      sanitization: this.config.enableSanitization,
      piiProtection: this.config.enablePIIRedaction,
      auditLogging: this.config.enableAuditLogging,
      compressionObfuscation: this.config.enableCompressionObfuscation
    }

    return {
      timestamp: new Date().toISOString(),
      complianceLevel: this.config.complianceLevel || 'basic',
      totalEvents: this.auditLog.length,
      recentEvents: recentEvents.length,
      riskLevels,
      complianceChecks,
      recommendations: this.generateRecommendations(recentEvents)
    }
  }

  private setupAuditCleanup(): void {
    // Clean up old audit logs daily
    setInterval(() => {
      const retentionDays = this.config.auditRetention || 30
      const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000)
      
      this.auditLog = this.auditLog.filter(
        event => event.timestamp.getTime() > cutoffTime
      )
    }, 24 * 60 * 60 * 1000)
  }

  private additionalSanitization(text: string): string {
    // Additional sanitization steps
    return text
      .replace(/[<>]/g, '') // Remove potential HTML
      .replace(/javascript:/gi, '') // Remove JavaScript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
  }

  private additionalDataProtection(text: string): string {
    // Additional data protection
    return text
      .replace(/\b\d{4,}\b/g, '[NUMBER]') // Long numbers
      .replace(/\b[A-Z]{3,}\b/g, '[ACRONYM]') // Acronyms
  }

  private calculateRiskLevel(threats: Threat[]): 'low' | 'medium' | 'high' {
    if (threats.length === 0) return 'low'
    
    const hasHighSeverity = threats.some(t => t.severity === 'high')
    const hasMediumSeverity = threats.some(t => t.severity === 'medium')
    
    if (hasHighSeverity) return 'high'
    if (hasMediumSeverity) return 'medium'
    
    return 'low'
  }

  private obfuscateTokenCount(tokenCount: number): number {
    // Round to nearest 5 to prevent precise inference
    return Math.round(tokenCount / 5) * 5
  }

  private sendSecurityAlert(event: SecurityEvent): void {
    // In production, this would send alerts to security team
    console.warn('[SECURITY ALERT]', {
      type: event.type,
      riskLevel: event.riskLevel,
      timestamp: event.timestamp.toISOString(),
      userId: event.userId
    })
  }

  private generateRecommendations(events: SecurityEvent[]): string[] {
    const recommendations: string[] = []
    
    const highRiskEvents = events.filter(e => e.riskLevel === 'high')
    const mediumRiskEvents = events.filter(e => e.riskLevel === 'medium')
    
    if (highRiskEvents.length > 0) {
      recommendations.push('Review and strengthen input validation')
      recommendations.push('Consider implementing rate limiting')
    }
    
    if (mediumRiskEvents.length > 5) {
      recommendations.push('Monitor for patterns in medium-risk events')
      recommendations.push('Consider additional security training')
    }
    
    if (events.some(e => e.type === 'compression')) {
      recommendations.push('Review compression ratio protection settings')
    }
    
    return recommendations
  }
}

// Interfaces
export interface SanitizationResult {
  original: string
  sanitized: string
  threats: Threat[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface ProtectionResult {
  original: string
  protected: string
  redactedTypes: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface ProtectedMetrics {
  compressionRatio: number
  originalTokens: number
  compressedTokens: number
  noiseLevel: number
  protectionLevel: string
}

export interface Threat {
  type: string
  severity: 'low' | 'medium' | 'high'
  pattern: string
  detected: boolean
}

export interface ComplianceReport {
  timestamp: string
  complianceLevel: string
  totalEvents: number
  recentEvents: number
  riskLevels: {
    low: number
    medium: number
    high: number
  }
  complianceChecks: Record<string, boolean>
  recommendations: string[]
}