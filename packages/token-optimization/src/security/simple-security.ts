/**
 * Simple Security Manager
 * 
 * Basic security features without external dependencies
 */

export interface SecurityResult {
  original: string
  sanitized: string
  threats: SecurityThreat[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface SecurityThreat {
  type: string
  severity: 'low' | 'medium' | 'high'
  detected: boolean
}

export class SimpleSecurityManager {
  private readonly injectionPatterns = [
    /ignore.*previous.*instructions/gi,
    /system:\s*.*/gi,
    /you\s+are\s+now/gi,
    /disregard.*above/gi,
    /bypass.*security/gi
  ]

  sanitizeInput(text: string): SecurityResult {
    let sanitized = text
    const threats: SecurityThreat[] = []

    // Check for injection patterns
    this.injectionPatterns.forEach((pattern, index) => {
      if (pattern.test(sanitized)) {
        const threatType = this.getThreatType(pattern)
        sanitized = sanitized.replace(pattern, `[INJECTION_ATTEMPT:${threatType}]`)
        
        threats.push({
          type: threatType,
          severity: 'high',
          detected: true
        })
      }
    })

    const riskLevel = this.calculateRiskLevel(threats)

    return {
      original: text,
      sanitized,
      threats,
      riskLevel
    }
  }

  protectSensitiveData(text: string): {
    original: string
    protected: string
    redactedTypes: string[]
    riskLevel: 'low' | 'medium' | 'high'
  } {
    let protectedText = text
    const redactedTypes: string[] = []

    // Basic PII patterns
    const patterns = [
      {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        type: 'email',
        replacement: '[EMAIL]'
      },
      {
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        type: 'ssn',
        replacement: '[SSN]'
      }
    ]

    patterns.forEach(({ pattern, type, replacement }) => {
      if (pattern.test(protectedText)) {
        protectedText = protectedText.replace(pattern, replacement)
        redactedTypes.push(type)
      }
    })

    const riskLevel = redactedTypes.length > 0 ? 'medium' : 'low'

    return {
      original: text,
      protected: protectedText,
      redactedTypes: [...new Set(redactedTypes)],
      riskLevel
    }
  }

  protectCompressionRatio(
    originalTokens: number,
    compressedTokens: number
  ): {
    compressionRatio: number
    originalTokens: number
    compressedTokens: number
    noiseLevel: number
    protectionLevel: string
  } {
    const noiseLevel = 0.1 // ±10% noise
    const noise = (Math.random() - 0.5) * noiseLevel
    const protectedRatio = (compressedTokens / originalTokens) + noise
    const clampedRatio = Math.max(0.1, Math.min(0.95, protectedRatio))

    return {
      compressionRatio: clampedRatio,
      originalTokens,
      compressedTokens,
      noiseLevel,
      protectionLevel: 'basic'
    }
  }

  private getThreatType(pattern: RegExp): string {
    if (pattern.source.includes('system')) return 'system_prompt_injection'
    if (pattern.source.includes('ignore')) return 'instruction_override'
    if (pattern.source.includes('bypass')) return 'security_bypass'
    return 'injection_attempt'
  }

  private calculateRiskLevel(threats: SecurityThreat[]): 'low' | 'medium' | 'high' {
    if (threats.length === 0) return 'low'
    
    const hasHighSeverity = threats.some(t => t.severity === 'high')
    return hasHighSeverity ? 'high' : 'medium'
  }
}