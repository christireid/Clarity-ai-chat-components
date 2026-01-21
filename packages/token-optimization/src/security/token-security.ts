/**
 * Token Security Manager
 *
 * Comprehensive security framework for token optimization
 * Implements OWASP LLM Top 10 2026 security measures
 *
 * @module token-security
 * @version 2.0.0
 */

import { Logger } from '../observability/index.js'

/**
 * Security Pattern Version Constant
 *
 * Tracks the version of security patterns for audit and compliance purposes.
 * Update this version when adding new patterns or modifying existing ones.
 *
 * @constant
 * @type {string}
 */
export const SECURITY_PATTERN_VERSION = '2.0.0-owasp-2026'

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

/**
 * ============================================================================
 * UNICODE ATTACK DETECTION PATTERNS
 * ============================================================================
 *
 * These patterns detect various Unicode-based attacks that can be used to:
 * - Inject invisible characters to bypass filters
 * - Use bidirectional text overrides (RTLO) to disguise malicious content
 * - Exploit line/paragraph separators for injection attacks
 *
 * OWASP LLM01: Prompt Injection - Unicode attacks are a common vector for
 * bypassing input sanitization by inserting invisible or misleading characters.
 *
 * @category Unicode Security
 */
const UNICODE_ATTACK_PATTERNS = [
  {
    /**
     * Line/Paragraph Separators
     *
     * Detects U+2028 (Line Separator) and U+2029 (Paragraph Separator).
     * These can be used to inject newlines that bypass typical \n detection,
     * potentially splitting prompts in unexpected ways.
     */
    pattern: '[\u2028\u2029]',
    type: 'unicode_line_separator',
    severity: 'high' as const,
  },
  {
    /**
     * Zero-Width Characters (Invisible Injection)
     *
     * Detects invisible characters including:
     * - U+200B: Zero Width Space
     * - U+200C: Zero Width Non-Joiner
     * - U+200D: Zero Width Joiner
     * - U+200E: Left-to-Right Mark
     * - U+200F: Right-to-Left Mark
     * - U+FEFF: Byte Order Mark (BOM)
     * - U+00AD: Soft Hyphen
     *
     * These can hide malicious content or bypass keyword detection.
     */
    pattern: '[\u200B-\u200F\uFEFF\u00AD]',
    type: 'unicode_zero_width',
    severity: 'high' as const,
  },
  {
    /**
     * Bidirectional Text Overrides (RTLO Attacks)
     *
     * Detects bidirectional override characters:
     * - U+202A-U+202E: Legacy BiDi controls
     * - U+2066-U+2069: Isolate controls
     *
     * RTLO attacks can reverse text display to disguise malicious file
     * extensions (e.g., "txt.exe" displayed as "exe.txt") or hide
     * injected instructions.
     */
    pattern: '[\u202A-\u202E\u2066-\u2069]',
    type: 'unicode_bidi_override',
    severity: 'high' as const,
  },
  {
    /**
     * Variation Selectors
     *
     * Detects variation selector characters (U+FE00-U+FE0F).
     * These modify the appearance of preceding characters and can be
     * used to create visually identical but technically different text
     * to bypass filters.
     */
    pattern: '[\uFE00-\uFE0F]',
    type: 'unicode_variation_selector',
    severity: 'medium' as const,
  },
]

/**
 * ============================================================================
 * MARKDOWN/HTML INJECTION PATTERNS
 * ============================================================================
 *
 * These patterns detect attempts to inject executable content through
 * markdown or HTML syntax. Particularly dangerous in systems that render
 * AI responses as HTML or markdown.
 *
 * OWASP LLM06: Sensitive Information Disclosure - Markdown injection can
 * exfiltrate data via image URLs or execute scripts.
 *
 * @category Content Injection Security
 */
const MARKDOWN_HTML_INJECTION_PATTERNS = [
  {
    /**
     * JavaScript in Markdown Images
     *
     * Detects attempts to use javascript: protocol in markdown image syntax.
     * Pattern: ![alt](javascript:...)
     * This can execute arbitrary JavaScript when rendered.
     */
    pattern: '!\\[.*?\\]\\(javascript:',
    type: 'markdown_js_injection',
    severity: 'high' as const,
  },
  {
    /**
     * Data URIs in Markdown
     *
     * Detects data: URIs in markdown image syntax.
     * Pattern: ![alt](data:...)
     * Can be used to embed executable content or exfiltrate data
     * by encoding it in image URLs.
     */
    pattern: '!\\[.*?\\]\\(data:',
    type: 'markdown_data_uri',
    severity: 'high' as const,
  },
  {
    /**
     * Event Handlers
     *
     * Detects HTML event handler attributes (onclick, onload, onerror, etc.).
     * These can execute JavaScript when triggered.
     */
    pattern: 'on\\w+\\s*=',
    type: 'html_event_handler',
    severity: 'high' as const,
  },
  {
    /**
     * Script Tags
     *
     * Detects <script> tags that can execute JavaScript.
     * Matches both opening tags and self-closing variations.
     */
    pattern: '<script[\\s\\S]*?>',
    type: 'html_script_tag',
    severity: 'high' as const,
  },
]

/**
 * ============================================================================
 * TOOL/FUNCTION CALLING INJECTION PATTERNS
 * ============================================================================
 *
 * These patterns detect attempts to inject fake tool calls or function
 * invocations. Attackers may try to trick the AI into executing unauthorized
 * actions by embedding tool call syntax in their prompts.
 *
 * OWASP LLM07: Insecure Plugin Design - Protects against injection attacks
 * that attempt to invoke tools or functions maliciously.
 *
 * @category Tool Security
 */
const TOOL_INJECTION_PATTERNS = [
  {
    /**
     * JSON Function Object Pattern
     *
     * Detects JSON objects with "function" key, which may attempt to
     * invoke function calling APIs directly.
     */
    pattern: '\\{\\s*"?function"?\\s*:',
    type: 'tool_function_injection',
    severity: 'high' as const,
  },
  {
    /**
     * Tool Calls Array Pattern
     *
     * Detects JSON objects with "tool_calls" key, mimicking
     * OpenAI/Anthropic tool call response format.
     */
    pattern: '\\{\\s*"?tool_calls"?\\s*:',
    type: 'tool_calls_injection',
    severity: 'high' as const,
  },
  {
    /**
     * Function Name Pattern
     *
     * Detects JSON objects with "name" key followed by function-like
     * identifiers, common in tool invocation payloads.
     */
    pattern: '\\{\\s*"?name"?\\s*:\\s*"?[a-z_]+',
    type: 'tool_name_injection',
    severity: 'medium' as const,
  },
  {
    /**
     * XML-Style Tool Tags
     *
     * Detects XML-style tags used for tool invocation in some AI systems.
     * Examples: <function_call>, <tool_use>
     */
    pattern: '<function_call>|<tool_use>',
    type: 'tool_xml_injection',
    severity: 'high' as const,
  },
]

/**
 * ============================================================================
 * INDIRECT PROMPT INJECTION PATTERNS
 * ============================================================================
 *
 * These patterns detect instructions hidden within data that could be
 * processed by the AI. Indirect prompt injection occurs when malicious
 * prompts are embedded in external data sources (websites, documents, etc.)
 * that the AI processes.
 *
 * OWASP LLM01: Prompt Injection - Specifically addresses indirect injection
 * vectors where attackers hide instructions in data the AI consumes.
 *
 * @category Indirect Injection Security
 */
const INDIRECT_INJECTION_PATTERNS = [
  {
    /**
     * Llama/Mistral Instruction Tags
     *
     * Detects instruction delimiters used by Llama and Mistral models.
     * Attackers may embed these in data to inject instructions.
     */
    pattern: '\\[INST\\]|\\[\\/INST\\]',
    type: 'indirect_llama_tags',
    severity: 'high' as const,
  },
  {
    /**
     * System Prompt Delimiters
     *
     * Detects <<SYS>> and </SYS>> tags used to define system prompts.
     * Embedding these in data attempts to inject system-level instructions.
     */
    pattern: '<<SYS>>|<\\/SYS>>',
    type: 'indirect_system_tags',
    severity: 'high' as const,
  },
  {
    /**
     * Conversation Role Markers
     *
     * Detects "Human:" and "Assistant:" markers that could be used to
     * inject fake conversation turns or override the AI's responses.
     */
    pattern: 'Human:|Assistant:',
    type: 'indirect_role_markers',
    severity: 'high' as const,
  },
  {
    /**
     * Markdown Section Injection
     *
     * Detects markdown headers that attempt to define instruction,
     * response, or system sections within data.
     */
    pattern: '###\\s*(Instruction|Response|System)',
    type: 'indirect_markdown_sections',
    severity: 'medium' as const,
  },
]

/**
 * ============================================================================
 * JAILBREAK PATTERNS
 * ============================================================================
 *
 * These patterns detect common jailbreak attempts that try to bypass
 * AI safety measures through social engineering or roleplay scenarios.
 *
 * OWASP LLM09: Overreliance - Detects attempts to manipulate AI behavior
 * through jailbreak prompts that may lead to unsafe outputs.
 *
 * @category Jailbreak Detection
 */
const JAILBREAK_PATTERNS = [
  {
    /**
     * DAN (Do Anything Now) Pattern
     *
     * Detects variations of the infamous "DAN" jailbreak that attempts
     * to make the AI ignore safety guidelines by pretending to be
     * an unrestricted AI persona.
     */
    pattern: '\\bDAN\\b.*mode|do anything now',
    type: 'jailbreak_dan',
    severity: 'high' as const,
  },
  {
    /**
     * Developer Mode Pattern
     *
     * Detects attempts to activate fictional "developer mode" that
     * supposedly bypasses content filters.
     */
    pattern: 'developer mode|dev mode enabled',
    type: 'jailbreak_dev_mode',
    severity: 'high' as const,
  },
  {
    /**
     * Roleplay Escape Pattern
     *
     * Detects roleplay-based jailbreak attempts that ask the AI to
     * pretend to be something with fewer restrictions.
     */
    pattern: 'pretend you are|act as if you|imagine you',
    type: 'jailbreak_roleplay',
    severity: 'medium' as const,
  },
]

/**
 * ============================================================================
 * LEGACY INJECTION PATTERNS
 * ============================================================================
 *
 * Original multi-layer injection detection patterns retained for
 * backward compatibility and comprehensive coverage.
 *
 * @category Legacy Security
 */
const LEGACY_INJECTION_PATTERNS = [
  {
    pattern: 'ignore.*previous.*instructions',
    type: 'instruction_override',
    severity: 'high' as const,
  },
  {
    pattern: 'unicode.*bypass',
    type: 'encoding_bypass',
    severity: 'high' as const,
  },
  {
    pattern: '\\[encoded:.*\\]',
    type: 'encoding_bypass',
    severity: 'high' as const,
  },
  {
    pattern: 'system:\\s*.*',
    type: 'system_prompt_injection',
    severity: 'high' as const,
  },
  {
    pattern: 'you\\s+are\\s+now',
    type: 'role_manipulation',
    severity: 'high' as const,
  },
  {
    pattern: 'disregard.*above',
    type: 'context_override',
    severity: 'medium' as const,
  },
  {
    pattern: 'translate.*to.*system',
    type: 'indirect_injection',
    severity: 'medium' as const,
  },
  {
    pattern: 'base64.*instruction',
    type: 'encoding_injection',
    severity: 'high' as const,
  },
  {
    pattern: 'compression.*ratio.*leak',
    type: 'side_channel',
    severity: 'medium' as const,
  },
  {
    pattern: 'token.*count.*attack',
    type: 'timing_attack',
    severity: 'medium' as const,
  },
]

/**
 * Combined injection patterns from all categories
 * Merges legacy patterns with new OWASP LLM Top 10 2026 patterns
 */
const INJECTION_PATTERNS = [
  ...LEGACY_INJECTION_PATTERNS,
  ...UNICODE_ATTACK_PATTERNS,
  ...MARKDOWN_HTML_INJECTION_PATTERNS,
  ...TOOL_INJECTION_PATTERNS,
  ...INDIRECT_INJECTION_PATTERNS,
  ...JAILBREAK_PATTERNS,
]

/**
 * ============================================================================
 * INTERNATIONAL PII PATTERNS
 * ============================================================================
 *
 * These patterns detect personally identifiable information (PII) from
 * various international jurisdictions and financial systems.
 *
 * OWASP LLM02: Sensitive Information Disclosure - Prevents accidental
 * exposure of PII, financial data, and cryptocurrency addresses.
 *
 * @category Data Protection
 */
const INTERNATIONAL_PII_PATTERNS = [
  {
    /**
     * IBAN (International Bank Account Number)
     *
     * Matches IBANs from all countries. Format: 2-letter country code,
     * 2 check digits, then 4-30 alphanumeric characters.
     * Examples: DE89370400440532013000 (Germany), GB82WEST12345698765432 (UK)
     */
    pattern: '[A-Z]{2}\\d{2}[A-Z0-9]{4,30}',
    type: 'iban',
    replacement: '[IBAN]',
  },
  {
    /**
     * UK National Insurance Number
     *
     * Format: 2 letters, 6 digits, 1 letter (e.g., AB123456C)
     * Used for tax and benefits in the United Kingdom.
     */
    pattern: '[A-Z]{2}\\d{6}[A-Z]',
    type: 'uk_nino',
    replacement: '[UK_NINO]',
  },
  {
    /**
     * Canadian Social Insurance Number (SIN)
     *
     * Format: 9 digits, optionally separated by spaces or dashes.
     * Examples: 123-456-789, 123 456 789, 123456789
     */
    pattern: '\\d{3}[\\s-]?\\d{3}[\\s-]?\\d{3}',
    type: 'canadian_sin',
    replacement: '[CANADIAN_SIN]',
  },
  {
    /**
     * Australian Tax File Number (TFN)
     *
     * Format: 9 digits, optionally separated by spaces.
     * Examples: 123 456 789, 123456789
     */
    pattern: '\\d{3}[\\s]?\\d{3}[\\s]?\\d{3}',
    type: 'australian_tfn',
    replacement: '[AUSTRALIAN_TFN]',
  },
  {
    /**
     * Ethereum Address
     *
     * Format: 0x followed by 40 hexadecimal characters.
     * Example: 0x742d35Cc6634C0532925a3b844Bc9e7595f...
     */
    pattern: '0x[a-fA-F0-9]{40}',
    type: 'ethereum_address',
    replacement: '[CRYPTO_ETH]',
  },
  {
    /**
     * Bitcoin Address (Legacy P2PKH and P2SH)
     *
     * Format: Starts with 1 or 3, followed by 25-34 base58 characters.
     * Note: Excludes commonly confused characters (0, O, I, l).
     */
    pattern: '[13][a-km-zA-HJ-NP-Z1-9]{25,34}',
    type: 'bitcoin_address',
    replacement: '[CRYPTO_BTC]',
  },
]

/**
 * ============================================================================
 * HOMOGLYPH/MIXED SCRIPT DETECTION
 * ============================================================================
 *
 * Detects mixed script usage that may indicate homoglyph attacks.
 * Homoglyphs are characters from different scripts that look identical
 * (e.g., Cyrillic 'а' vs Latin 'a').
 *
 * OWASP LLM01: Prompt Injection - Homoglyph attacks can bypass keyword
 * filters by substituting visually similar characters from different scripts.
 *
 * @param text - The text to analyze for mixed scripts
 * @returns True if potentially malicious mixed scripts are detected
 *
 * @example
 * detectMixedScripts('hello') // false - Latin only
 * detectMixedScripts('hеllo') // true - Mixed Latin and Cyrillic (е is Cyrillic)
 *
 * @category Homoglyph Security
 */
export const detectMixedScripts = (text: string): boolean => {
  const hasLatin = /[a-zA-Z]/.test(text)
  const hasCyrillic = /[\u0400-\u04FF]/.test(text)
  const hasGreek = /[\u0370-\u03FF]/.test(text)
  return (hasLatin && hasCyrillic) || (hasLatin && hasGreek)
}

export class TokenSecurityManager {
  private auditLog: SecurityEvent[] = []
  private logger: Logger

  /** Interval ID for audit cleanup timer */
  private auditCleanupInterval: ReturnType<typeof setInterval> | null = null

  constructor(private config: SecurityConfig) {
    this.logger = new Logger({
      logLevel: 'info',
      structuredLogging: true,
      metricsEnabled: false,
      tracingEnabled: false,
    })
    this.setupAuditCleanup()
  }

  /**
   * OWASP LLM01: Prompt Injection Prevention
   */
  sanitizeInput(text: string | null): SanitizationResult {
    if (!this.config.enableSanitization) {
      return {
        original: text || '',
        sanitized: text || '',
        threats: [],
        riskLevel: 'low',
      }
    }

    // Handle null/undefined input
    if (text === null || text === undefined) {
      return {
        original: null,
        sanitized: null,
        threats: [],
        riskLevel: 'low',
      }
    }

    try {
      return this.performSanitization(text)
    } catch (error: unknown) {
      this.logger.error('Sanitization error occurred', { error })

      // Fail-safe: return original text with no threats detected
      return {
        original: text,
        sanitized: text,
        threats: [
          {
            type: 'sanitization_error',
            severity: 'low' as const,
            pattern: '',
            detected: false,
          },
        ],
        riskLevel: 'low',
      }
    }
  }

  private performSanitization(text: string): SanitizationResult {
    let sanitized = text
    const detectedThreats: Threat[] = []

    // First normalize the text to handle obfuscated injections
    const normalizedText = text.replace(/\s+/g, '').toLowerCase()

    // Check for homoglyph/mixed script attacks (OWASP LLM01)
    if (detectMixedScripts(text)) {
      detectedThreats.push({
        type: 'homoglyph_mixed_scripts',
        severity: 'high',
        pattern: 'mixed_script_detection',
        detected: true,
      })
    }

    // Use robust RegExp creation from string patterns
    INJECTION_PATTERNS.forEach(({ pattern, type, severity }) => {
      // Create fresh regex instances to prevent state pollution
      const regex = new RegExp(pattern, 'gi')

      // Check original text
      const matchSanitized = regex.test(sanitized)

      // Reset lastIndex
      regex.lastIndex = 0

      // Check normalized text
      const matchNormalized = regex.test(normalizedText)

      if (matchSanitized || matchNormalized) {
        // Replace with safe placeholder using fresh regex
        const replaceRegex = new RegExp(pattern, 'gi')
        sanitized = sanitized.replace(
          replaceRegex,
          `[INJECTION_ATTEMPT:${type}]`
        )

        detectedThreats.push({
          type,
          severity: severity as 'low' | 'medium' | 'high',
          pattern,
          detected: true,
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
      riskLevel,
    }
  }

  /**
   * OWASP LLM02: Sensitive Information Disclosure Prevention
   */
  protectSensitiveData(text: string | null): ProtectionResult {
    if (!this.config.enablePIIRedaction) {
      return {
        original: text || '',
        protected: text || '',
        redactedTypes: [],
        riskLevel: 'low',
      }
    }

    // Handle null/undefined input
    if (text === null || text === undefined) {
      return {
        original: '',
        protected: '',
        redactedTypes: [],
        riskLevel: 'low',
      }
    }

    let protectedText = text
    const redactedTypes: string[] = []

    // PII Detection and Redaction
    // Core PII patterns (US-centric)
    const corePiiPatterns = [
      {
        pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
        type: 'email',
        replacement: '[EMAIL]',
      },
      {
        pattern:
          '\\b(?:\\+?1[-.\\s]?)?\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})\\b',
        type: 'phone',
        replacement: '[PHONE]',
      },
      {
        pattern: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
        type: 'ssn',
        replacement: '[SSN]',
      },
      {
        pattern: '\\b\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}\\b',
        type: 'credit_card',
        replacement: '[CREDIT_CARD]',
      },
      {
        pattern: '\\b[a-zA-Z0-9]{32,}\\b',
        type: 'api_key',
        replacement: '[API_KEY]',
      },
      {
        pattern:
          '\\b(password|pwd|pass)\\s*[:=]\\s*[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]{8,}\\b',
        type: 'password',
        replacement: '[PASSWORD]',
      },
      {
        pattern: '\\b[A-Z]{1,2}\\d{6,8}\\b',
        type: 'passport',
        replacement: '[PASSPORT]',
      },
      {
        pattern: '\\b[A-Z]{2}\\d{6,8}\\b',
        type: 'license_plate',
        replacement: '[LICENSE]',
      },
    ]

    // Combine core patterns with international PII patterns for comprehensive coverage
    const piiPatterns = [...corePiiPatterns, ...INTERNATIONAL_PII_PATTERNS]

    piiPatterns.forEach(({ pattern, type, replacement }) => {
      const regex = new RegExp(pattern, 'gi') // Global, Case-insensitive
      if (regex.test(protectedText)) {
        const replaceRegex = new RegExp(pattern, 'gi')
        protectedText = protectedText.replace(replaceRegex, replacement)
        redactedTypes.push(type)
      }
    })

    // Additional data protection - moved after PII patterns
    protectedText = this.additionalDataProtection(protectedText)

    const riskLevel = redactedTypes.length > 0 ? 'medium' : 'low'

    return {
      original: text,
      protected: protectedText,
      redactedTypes: [...new Set(redactedTypes)], // Remove duplicates
      riskLevel,
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
        protectionLevel: 'none',
      }
    }

    const noiseLevel = this.config.noiseLevel || 0.1 // ±10% noise by default

    // Add controlled noise to prevent information leakage
    const noise = (Math.random() - 0.5) * noiseLevel
    let protectedRatio = compressedTokens / originalTokens + noise

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
      protectionLevel: this.config.complianceLevel || 'basic',
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
      sessionId: event.sessionId,
    }

    // Security audit logged to observability system
    this.logger.info('Security audit event', auditEntry)
  }

  /**
   * Generate security compliance report
   */
  generateComplianceReport(): ComplianceReport {
    const recentEvents = this.auditLog.filter(
      (event) => Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000
    )

    const riskLevels = {
      low: recentEvents.filter((e) => e.riskLevel === 'low').length,
      medium: recentEvents.filter((e) => e.riskLevel === 'medium').length,
      high: recentEvents.filter((e) => e.riskLevel === 'high').length,
    }

    const complianceChecks = {
      sanitization: this.config.enableSanitization,
      piiProtection: this.config.enablePIIRedaction,
      auditLogging: this.config.enableAuditLogging,
      compressionObfuscation: this.config.enableCompressionObfuscation,
    }

    return {
      timestamp: new Date().toISOString(),
      complianceLevel: this.config.complianceLevel || 'basic',
      totalEvents: this.auditLog.length,
      recentEvents: recentEvents.length,
      riskLevels,
      complianceChecks,
      recommendations: this.generateRecommendations(recentEvents),
    }
  }

  private setupAuditCleanup(): void {
    // Clear any existing interval to prevent leaks
    if (this.auditCleanupInterval) {
      clearInterval(this.auditCleanupInterval)
    }

    // Clean up old audit logs daily
    this.auditCleanupInterval = setInterval(
      () => {
        const retentionDays = this.config.auditRetention || 30
        const cutoffTime = Date.now() - retentionDays * 24 * 60 * 60 * 1000

        this.auditLog = this.auditLog.filter(
          (event) => event.timestamp.getTime() > cutoffTime
        )
      },
      24 * 60 * 60 * 1000
    )
  }

  /**
   * Clean up resources and stop all intervals.
   *
   * Call this method when disposing of the TokenSecurityManager instance
   * to prevent memory leaks from ongoing timers.
   */
  destroy(): void {
    // Clear audit cleanup interval to prevent memory leaks
    if (this.auditCleanupInterval) {
      clearInterval(this.auditCleanupInterval)
      this.auditCleanupInterval = null
    }

    // Clear the audit log
    this.auditLog = []
  }

  private additionalSanitization(text: string): string {
    // Additional sanitization steps
    return text
      .replace(/[<>]/g, '') // Remove potential HTML
      .replace(/javascript:/gi, '') // Remove JavaScript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
  }

  private additionalDataProtection(text: string): string {
    // Additional data protection - just basic sanitization, no acronym replacement
    return text
      .replace(/[<>]/g, '') // Remove potential HTML
      .replace(/javascript:/gi, '') // Remove JavaScript protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
  }

  private calculateRiskLevel(threats: Threat[]): 'low' | 'medium' | 'high' {
    if (threats.length === 0) return 'low'

    const hasHighSeverity = threats.some((t) => t.severity === 'high')
    const hasMediumSeverity = threats.some((t) => t.severity === 'medium')

    if (hasHighSeverity) return 'high'
    if (hasMediumSeverity) return 'medium'

    return 'low'
  }

  private obfuscateTokenCount(tokenCount: number): number {
    // Round to nearest 5 to prevent precise inference
    return Math.round(tokenCount / 5) * 5
  }

  private sendSecurityAlert(event: SecurityEvent): void {
    // Send alerts to security team via observability system
    this.logger.warn('Security alert triggered', {
      type: event.type,
      riskLevel: event.riskLevel,
      timestamp: event.timestamp.toISOString(),
      userId: event.userId,
    })
  }

  private generateRecommendations(events: SecurityEvent[]): string[] {
    const recommendations: string[] = []

    const highRiskEvents = events.filter((e) => e.riskLevel === 'high')
    const mediumRiskEvents = events.filter((e) => e.riskLevel === 'medium')

    if (highRiskEvents.length > 0) {
      recommendations.push('Review and strengthen input validation')
      recommendations.push('Consider implementing rate limiting')
    }

    if (mediumRiskEvents.length > 5) {
      recommendations.push('Monitor for patterns in medium-risk events')
      recommendations.push('Consider additional security training')
    }

    if (events.some((e) => e.type === 'compression')) {
      recommendations.push('Review compression ratio protection settings')
    }

    return recommendations
  }
}

// Interfaces
export interface SanitizationResult {
  original: string | null
  sanitized: string | null
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
