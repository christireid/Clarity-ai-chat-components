/**
 * PII Detection Utilities
 *
 * Simple pattern-based PII detection. For production, integrate with
 * services like Google DLP, Microsoft Presidio, or AWS Comprehend.
 */

import type { PIIDetection, SafetyCheck, SafetyGuardrail } from './types'

export class PIIDetector {
  private patterns: Record<string, RegExp> = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/g,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    credit_card: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
    ip_address: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  }

  /**
   * Detect PII in text
   */
  detect(text: string): PIIDetection[] {
    const detections: PIIDetection[] = []

    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = Array.from(text.matchAll(pattern))
      
      for (const match of matches) {
        if (match.index !== undefined) {
          detections.push({
            type: type as any,
            match: match[0],
            start: match.index,
            end: match.index + match[0].length,
            confidence: this.getConfidence(type, match[0]),
          })
        }
      }
    }

    return detections
  }

  /**
   * Redact PII from text
   */
  redact(text: string, replacement = '[REDACTED]'): string {
    let redacted = text

    for (const pattern of Object.values(this.patterns)) {
      redacted = redacted.replace(pattern, replacement)
    }

    return redacted
  }

  /**
   * Check if text contains PII
   */
  hasPII(text: string): boolean {
    return this.detect(text).length > 0
  }

  /**
   * Get confidence score for detection
   */
  private getConfidence(type: string, match: string): number {
    // Simple validation to improve confidence
    switch (type) {
      case 'email':
        return match.includes('@') && match.includes('.') ? 0.9 : 0.6

      case 'phone':
        return match.replace(/\D/g, '').length === 10 ? 0.85 : 0.6

      case 'ssn':
        return match.match(/^\d{3}-\d{2}-\d{4}$/) ? 0.95 : 0.7

      case 'credit_card':
        // Luhn algorithm check would go here
        return 0.7

      default:
        return 0.5
    }
  }

  /**
   * Add custom PII pattern
   */
  addPattern(name: string, pattern: RegExp): void {
    this.patterns[name] = pattern
  }
}

/**
 * PII Detection Guardrail
 */
export class PIIGuardrail implements SafetyGuardrail {
  name = 'pii-detection'

  private detector = new PIIDetector()
  private action: 'allow' | 'block' | 'redact'

  constructor(options?: { action?: 'allow' | 'block' | 'redact' }) {
    this.action = options?.action || 'block'
  }

  check(content: string): SafetyCheck {
    const detections = this.detector.detect(content)
    const hasPII = detections.length > 0

    return {
      name: this.name,
      passed: !hasPII,
      confidence: hasPII
        ? Math.max(...detections.map((d) => d.confidence))
        : 1.0,
      details: hasPII
        ? `Detected ${detections.length} PII instance(s): ${detections.map((d) => d.type).join(', ')}`
        : 'No PII detected',
      action: hasPII ? this.action : 'allow',
    }
  }
}
