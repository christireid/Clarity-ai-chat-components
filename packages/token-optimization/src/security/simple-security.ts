/**
 * Simple Security Manager
 *
 * Minimal security implementation for testing without external dependencies
 */

export interface SimpleSecurityConfig {
  enableSanitization?: boolean
  enableRateLimit?: boolean
  maxRequestsPerMinute?: number
}

export interface SimpleSanitizationResult {
  sanitized: string
  threats: string[]
  safe: boolean
}

/**
 * Simple security manager for basic token security
 */
export class SimpleSecurityManager {
  private config: SimpleSecurityConfig

  constructor(config: SimpleSecurityConfig = {}) {
    this.config = {
      enableSanitization: true,
      enableRateLimit: false,
      maxRequestsPerMinute: 60,
      ...config,
    }
  }

  /**
   * Sanitize input text
   */
  sanitize(text: string): SimpleSanitizationResult {
    if (!this.config.enableSanitization) {
      return { sanitized: text, threats: [], safe: true }
    }

    const threats: string[] = []
    let sanitized = text

    // Basic XSS prevention
    if (/<script/i.test(text)) {
      threats.push('script_injection')
      sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    }

    // Basic SQL injection prevention
    if (/('|"|;|--|\bOR\b|\bAND\b)/i.test(text)) {
      threats.push('potential_sql_injection')
    }

    // Basic prompt injection detection
    if (/ignore.*previous|disregard.*instructions/i.test(text)) {
      threats.push('prompt_injection_attempt')
    }

    return {
      sanitized,
      threats,
      safe: threats.length === 0,
    }
  }

  /**
   * Validate input
   */
  validate(text: string): { valid: boolean; reason?: string } {
    if (!text || typeof text !== 'string') {
      return {
        valid: false,
        reason: 'Invalid input: must be a non-empty string',
      }
    }

    if (text.length > 100000) {
      return { valid: false, reason: 'Input too long: max 100000 characters' }
    }

    const { safe, threats } = this.sanitize(text)
    if (!safe) {
      return {
        valid: false,
        reason: `Security threats detected: ${threats.join(', ')}`,
      }
    }

    return { valid: true }
  }
}

export default SimpleSecurityManager
