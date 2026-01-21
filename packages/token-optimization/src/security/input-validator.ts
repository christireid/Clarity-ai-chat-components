/**
 * Input Validation using validator.js
 *
 * Production-grade input validation for security-critical operations.
 * Replaces custom regex patterns with battle-tested validation functions.
 *
 * @module input-validator
 */

import validator from 'validator'

/**
 * Validation result with detailed error information
 */
export interface ValidationResult {
  /** Whether all validations passed */
  valid: boolean
  /** List of validation errors */
  errors: ValidationError[]
  /** Sanitized input (if validation passed) */
  sanitized?: string
  /** Risk assessment */
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Individual validation error
 */
export interface ValidationError {
  /** Field that failed validation */
  field: string
  /** Error message */
  message: string
  /** Validation rule that failed */
  rule: string
  /** The problematic value (truncated for security) */
  value?: string
}

/**
 * PII detection result
 */
export interface PIIDetectionResult {
  /** Whether PII was detected */
  detected: boolean
  /** Types of PII found */
  types: PIIType[]
  /** Count of PII items found */
  count: number
  /** Redacted version of the input */
  redacted: string
}

/**
 * Types of personally identifiable information
 */
export type PIIType =
  | 'email'
  | 'phone'
  | 'ssn'
  | 'credit_card'
  | 'ip_address'
  | 'uuid'
  | 'url'
  | 'crypto_address'
  | 'passport'
  | 'iban'

/**
 * Input validation options
 */
export interface InputValidationOptions {
  /** Maximum allowed length */
  maxLength?: number
  /** Minimum allowed length */
  minLength?: number
  /** Allow HTML tags */
  allowHTML?: boolean
  /** Allow URLs in content */
  allowURLs?: boolean
  /** Custom banned patterns (regex strings) */
  bannedPatterns?: string[]
  /** Strip invisible characters */
  stripInvisible?: boolean
  /** Normalize unicode */
  normalizeUnicode?: boolean
}

/**
 * Input Validator using validator.js
 *
 * Provides comprehensive input validation for LLM/AI applications.
 *
 * @example
 * ```typescript
 * const inputValidator = new InputValidator();
 *
 * // Validate user prompt
 * const result = inputValidator.validate(userPrompt, {
 *   maxLength: 10000,
 *   allowHTML: false,
 *   stripInvisible: true
 * });
 *
 * if (!result.valid) {
 *   console.error('Validation failed:', result.errors);
 * }
 *
 * // Detect PII
 * const piiResult = inputValidator.detectPII(text);
 * if (piiResult.detected) {
 *   text = piiResult.redacted;
 * }
 * ```
 */
export class InputValidator {
  /**
   * Validate input text
   *
   * @param input - Text to validate
   * @param options - Validation options
   * @returns Validation result
   */
  validate(
    input: string,
    options: InputValidationOptions = {}
  ): ValidationResult {
    const errors: ValidationError[] = []
    let sanitized = input

    // Length validation
    if (options.maxLength && input.length > options.maxLength) {
      errors.push({
        field: 'input',
        message: `Input exceeds maximum length of ${options.maxLength}`,
        rule: 'maxLength',
        value: `${input.length} characters`,
      })
    }

    if (options.minLength && input.length < options.minLength) {
      errors.push({
        field: 'input',
        message: `Input below minimum length of ${options.minLength}`,
        rule: 'minLength',
        value: `${input.length} characters`,
      })
    }

    // Strip invisible characters
    if (options.stripInvisible !== false) {
      sanitized = this.stripInvisibleCharacters(sanitized)
    }

    // Normalize unicode
    if (options.normalizeUnicode !== false) {
      sanitized = sanitized.normalize('NFC')
    }

    // Check for HTML
    if (!options.allowHTML) {
      if (this.containsHTML(sanitized)) {
        errors.push({
          field: 'input',
          message: 'HTML tags are not allowed',
          rule: 'noHTML',
        })
        // Strip HTML for sanitized output
        sanitized = validator.stripLow(validator.escape(sanitized))
      }
    }

    // Check for URLs if not allowed
    if (!options.allowURLs && validator.contains(sanitized, '://')) {
      errors.push({
        field: 'input',
        message: 'URLs are not allowed',
        rule: 'noURLs',
      })
    }

    // Check banned patterns
    if (options.bannedPatterns) {
      for (const pattern of options.bannedPatterns) {
        const regex = new RegExp(pattern, 'gi')
        if (regex.test(sanitized)) {
          errors.push({
            field: 'input',
            message: `Input matches banned pattern`,
            rule: 'bannedPattern',
            value: pattern,
          })
        }
      }
    }

    // Calculate risk level
    const riskLevel = this.calculateRiskLevel(errors, sanitized)

    return {
      valid: errors.length === 0,
      errors,
      sanitized: errors.length === 0 ? sanitized : undefined,
      riskLevel,
    }
  }

  /**
   * Detect PII in text
   *
   * @param input - Text to scan for PII
   * @returns PII detection result with redacted text
   */
  detectPII(input: string): PIIDetectionResult {
    const types: PIIType[] = []
    let redacted = input
    let count = 0

    // Email detection
    const emailMatches = this.findEmails(input)
    if (emailMatches.length > 0) {
      types.push('email')
      count += emailMatches.length
      for (const email of emailMatches) {
        redacted = redacted.replace(email, '[EMAIL_REDACTED]')
      }
    }

    // Phone detection (various formats)
    const phonePattern =
      /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g
    const phoneMatches = input.match(phonePattern) || []
    if (phoneMatches.length > 0) {
      types.push('phone')
      count += phoneMatches.length
      for (const phone of phoneMatches) {
        redacted = redacted.replace(phone, '[PHONE_REDACTED]')
      }
    }

    // SSN detection
    const ssnPattern = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g
    const ssnMatches = input.match(ssnPattern) || []
    if (ssnMatches.length > 0) {
      types.push('ssn')
      count += ssnMatches.length
      for (const ssn of ssnMatches) {
        redacted = redacted.replace(ssn, '[SSN_REDACTED]')
      }
    }

    // Credit card detection
    const ccMatches = this.findCreditCards(input)
    if (ccMatches.length > 0) {
      types.push('credit_card')
      count += ccMatches.length
      for (const cc of ccMatches) {
        redacted = redacted.replace(cc, '[CC_REDACTED]')
      }
    }

    // IP address detection
    const ipMatches = this.findIPAddresses(input)
    if (ipMatches.length > 0) {
      types.push('ip_address')
      count += ipMatches.length
      for (const ip of ipMatches) {
        redacted = redacted.replace(ip, '[IP_REDACTED]')
      }
    }

    // UUID detection
    const uuidPattern =
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi
    const uuidMatches = input.match(uuidPattern) || []
    if (uuidMatches.length > 0) {
      types.push('uuid')
      count += uuidMatches.length
      for (const uuid of uuidMatches) {
        redacted = redacted.replace(uuid, '[UUID_REDACTED]')
      }
    }

    // Crypto address detection (Ethereum, Bitcoin)
    const cryptoMatches = this.findCryptoAddresses(input)
    if (cryptoMatches.length > 0) {
      types.push('crypto_address')
      count += cryptoMatches.length
      for (const addr of cryptoMatches) {
        redacted = redacted.replace(addr, '[CRYPTO_REDACTED]')
      }
    }

    return {
      detected: count > 0,
      types,
      count,
      redacted,
    }
  }

  /**
   * Validate email address
   */
  isValidEmail(email: string): boolean {
    return validator.isEmail(email)
  }

  /**
   * Validate URL
   */
  isValidURL(url: string): boolean {
    return validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })
  }

  /**
   * Validate UUID
   */
  isValidUUID(uuid: string): boolean {
    return validator.isUUID(uuid)
  }

  /**
   * Validate JSON string
   */
  isValidJSON(json: string): boolean {
    return validator.isJSON(json)
  }

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(input: string): string {
    return validator.escape(input)
  }

  /**
   * Normalize email address
   */
  normalizeEmail(email: string): string | false {
    return validator.normalizeEmail(email)
  }

  /**
   * Strip low ASCII characters
   */
  stripLowASCII(input: string): string {
    return validator.stripLow(input, true)
  }

  /**
   * Find all emails in text
   */
  private findEmails(input: string): string[] {
    // More comprehensive email pattern
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    const matches = input.match(emailPattern) || []
    return matches.filter((email) => validator.isEmail(email))
  }

  /**
   * Find credit card numbers in text
   */
  private findCreditCards(input: string): string[] {
    // Remove spaces/dashes and look for card patterns
    const cleaned = input.replace(/[-\s]/g, '')
    const ccPattern =
      /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g
    const matches = cleaned.match(ccPattern) || []

    // Also find formatted versions in original
    const formattedPattern = /\b(?:\d{4}[-\s]?){3,4}\b/g
    const formattedMatches = input.match(formattedPattern) || []

    return [
      ...new Set([
        ...matches,
        ...formattedMatches.filter((m) =>
          validator.isCreditCard(m.replace(/[-\s]/g, ''))
        ),
      ]),
    ]
  }

  /**
   * Find IP addresses in text
   */
  private findIPAddresses(input: string): string[] {
    const ipv4Pattern =
      /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
    const matches = input.match(ipv4Pattern) || []
    return matches.filter((ip) => validator.isIP(ip, 4))
  }

  /**
   * Find cryptocurrency addresses
   */
  private findCryptoAddresses(input: string): string[] {
    const addresses: string[] = []

    // Ethereum addresses
    const ethPattern = /0x[a-fA-F0-9]{40}/g
    const ethMatches = input.match(ethPattern) || []
    addresses.push(
      ...ethMatches.filter((addr) => validator.isEthereumAddress(addr))
    )

    // Bitcoin addresses (simplified pattern)
    const btcPattern = /[13][a-km-zA-HJ-NP-Z1-9]{25,34}/g
    const btcMatches = input.match(btcPattern) || []
    addresses.push(...btcMatches.filter((addr) => validator.isBtcAddress(addr)))

    return addresses
  }

  /**
   * Check if text contains HTML
   */
  private containsHTML(input: string): boolean {
    return /<[^>]+>/g.test(input)
  }

  /**
   * Strip invisible characters
   */
  private stripInvisibleCharacters(input: string): string {
    // Remove zero-width characters and other invisibles
    return input
      .replace(/[\u200B-\u200F\uFEFF\u00AD]/g, '') // Zero-width chars
      .replace(/[\u2028\u2029]/g, '\n') // Line/paragraph separators
      .replace(/[\u202A-\u202E\u2066-\u2069]/g, '') // BiDi controls
  }

  /**
   * Calculate risk level based on errors and content
   */
  private calculateRiskLevel(
    errors: ValidationError[],
    _content: string
  ): 'none' | 'low' | 'medium' | 'high' | 'critical' {
    if (errors.length === 0) return 'none'

    const hasHTML = errors.some((e) => e.rule === 'noHTML')
    const hasBanned = errors.some((e) => e.rule === 'bannedPattern')
    const hasLength = errors.some((e) => e.rule === 'maxLength')

    if (hasBanned) return 'high'
    if (hasHTML) return 'medium'
    if (hasLength) return 'low'

    return 'low'
  }
}

/**
 * Create a default input validator instance
 */
export function createInputValidator(): InputValidator {
  return new InputValidator()
}

/**
 * Quick validate using default settings
 *
 * @param input - Text to validate
 * @returns Whether input is valid
 */
export function validateInput(input: string): boolean {
  const inputValidator = new InputValidator()
  return inputValidator.validate(input).valid
}

/**
 * Quick PII detection
 *
 * @param input - Text to scan
 * @returns Whether PII was detected
 */
export function hasPII(input: string): boolean {
  const inputValidator = new InputValidator()
  return inputValidator.detectPII(input).detected
}

/**
 * Redact PII from text
 *
 * @param input - Text with potential PII
 * @returns Text with PII redacted
 */
export function redactPII(input: string): string {
  const inputValidator = new InputValidator()
  return inputValidator.detectPII(input).redacted
}
