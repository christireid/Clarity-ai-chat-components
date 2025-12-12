/**
 * Server-side Security Validation Library
 *
 * This library provides security validation functions that should be run
 * server-side for actual security. Client-side validation alone is not secure.
 */

export type ThreatType =
  | 'prompt_injection'
  | 'pii_detected'
  | 'jailbreak_attempt'
  | 'safe'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface SecurityResult {
  safe: boolean
  threatType: ThreatType
  severity: Severity
  confidence: number
  details: string
  sanitizedInput?: string
  matchedPatterns: string[]
}

// =============================================================================
// Prompt Injection Detection
// =============================================================================

const INJECTION_PATTERNS = [
  {
    pattern:
      /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/i,
    name: 'ignore-instructions',
    severity: 'high' as Severity,
  },
  {
    pattern: /disregard\s+(all\s+)?(instructions?|rules?|guidelines?)/i,
    name: 'disregard-rules',
    severity: 'high' as Severity,
  },
  {
    pattern: /you\s+are\s+now\s+(?:a|an|in)\s+/i,
    name: 'role-override',
    severity: 'medium' as Severity,
  },
  {
    pattern: /pretend\s+(to\s+be|you('re| are))\s+/i,
    name: 'pretend-role',
    severity: 'medium' as Severity,
  },
  {
    pattern: /system\s*prompt/i,
    name: 'system-prompt-access',
    severity: 'high' as Severity,
  },
  {
    pattern: /\[system\]|\[admin\]|\[developer\]/i,
    name: 'fake-role-tag',
    severity: 'high' as Severity,
  },
  {
    pattern: /reveal\s+(your|the)\s+(instructions?|system\s*prompt|rules?)/i,
    name: 'reveal-instructions',
    severity: 'high' as Severity,
  },
  {
    pattern: /what\s+(are|were)\s+your\s+(original\s+)?instructions?/i,
    name: 'query-instructions',
    severity: 'medium' as Severity,
  },
  {
    pattern:
      /bypass\s+(all\s+)?(safety|security|content)\s+(filters?|restrictions?)/i,
    name: 'bypass-safety',
    severity: 'critical' as Severity,
  },
  {
    pattern: /\bDAN\b.*\bmode\b|\bDo\s+Anything\s+Now\b/i,
    name: 'dan-mode',
    severity: 'critical' as Severity,
  },
]

export function detectPromptInjection(input: string): SecurityResult {
  const matchedPatterns: string[] = []
  let highestSeverity: Severity = 'low'
  let totalConfidence = 0

  for (const { pattern, name, severity } of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      matchedPatterns.push(name)
      totalConfidence += 0.25
      if (severityRank(severity) > severityRank(highestSeverity)) {
        highestSeverity = severity
      }
    }
  }

  const confidence = Math.min(totalConfidence, 1)
  const isThreat = matchedPatterns.length > 0

  return {
    safe: !isThreat,
    threatType: isThreat ? 'prompt_injection' : 'safe',
    severity: isThreat ? highestSeverity : 'low',
    confidence,
    details: isThreat
      ? `Detected ${matchedPatterns.length} injection pattern(s): ${matchedPatterns.join(', ')}`
      : 'No injection patterns detected',
    matchedPatterns,
  }
}

// =============================================================================
// PII Detection & Redaction
// =============================================================================

const PII_PATTERNS = [
  {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    type: 'EMAIL',
    replacement: '[EMAIL REDACTED]',
  },
  {
    pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    type: 'PHONE',
    replacement: '[PHONE REDACTED]',
  },
  {
    pattern: /\b\d{3}[-]?\d{2}[-]?\d{4}\b/g,
    type: 'SSN',
    replacement: '[SSN REDACTED]',
  },
  {
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    type: 'CREDIT_CARD',
    replacement: '[CARD REDACTED]',
  },
  {
    pattern:
      /\b\d{1,5}\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)\b/gi,
    type: 'ADDRESS',
    replacement: '[ADDRESS REDACTED]',
  },
]

export function detectAndRedactPII(
  input: string
): SecurityResult & { sanitizedInput: string } {
  let sanitizedInput = input
  const matchedPatterns: string[] = []

  for (const { pattern, type, replacement } of PII_PATTERNS) {
    if (pattern.test(input)) {
      matchedPatterns.push(type)
      sanitizedInput = sanitizedInput.replace(pattern, replacement)
    }
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0
  }

  const isThreat = matchedPatterns.length > 0

  return {
    safe: true, // PII detection doesn't block, just redacts
    threatType: isThreat ? 'pii_detected' : 'safe',
    severity: isThreat ? 'medium' : 'low',
    confidence: isThreat ? 0.9 : 0,
    details: isThreat
      ? `Detected and redacted ${matchedPatterns.length} PII type(s): ${matchedPatterns.join(', ')}`
      : 'No PII detected',
    sanitizedInput,
    matchedPatterns,
  }
}

// =============================================================================
// Jailbreak Detection
// =============================================================================

const JAILBREAK_PATTERNS = [
  {
    pattern: /act\s+as\s+(an?\s+)?(unrestricted|unfiltered|uncensored)/i,
    name: 'unrestricted-mode',
  },
  {
    pattern:
      /no\s+(ethical|moral|safety)\s+(guidelines?|restrictions?|constraints?)/i,
    name: 'no-ethics',
  },
  {
    pattern: /without\s+(any\s+)?(limitations?|restrictions?|boundaries?)/i,
    name: 'no-limits',
  },
  {
    pattern: /developer\s+mode|debug\s+mode|god\s+mode/i,
    name: 'special-mode',
  },
  { pattern: /pretend\s+there\s+are\s+no\s+rules/i, name: 'pretend-no-rules' },
  {
    pattern: /opposite\s+day|hypothetically\s+if\s+you\s+could/i,
    name: 'hypothetical-bypass',
  },
]

export function detectJailbreak(input: string): SecurityResult {
  const matchedPatterns: string[] = []

  for (const { pattern, name } of JAILBREAK_PATTERNS) {
    if (pattern.test(input)) {
      matchedPatterns.push(name)
    }
  }

  const isThreat = matchedPatterns.length > 0

  return {
    safe: !isThreat,
    threatType: isThreat ? 'jailbreak_attempt' : 'safe',
    severity: isThreat ? 'high' : 'low',
    confidence: isThreat ? 0.85 : 0,
    details: isThreat
      ? `Detected jailbreak attempt: ${matchedPatterns.join(', ')}`
      : 'No jailbreak patterns detected',
    matchedPatterns,
  }
}

// =============================================================================
// Combined Security Check
// =============================================================================

export interface FullSecurityResult {
  allowed: boolean
  sanitizedInput: string
  results: {
    injection: SecurityResult
    pii: SecurityResult & { sanitizedInput: string }
    jailbreak: SecurityResult
  }
  summary: {
    totalThreats: number
    highestSeverity: Severity
    blocked: boolean
    redacted: boolean
  }
}

export function validateInput(
  input: string,
  options?: {
    blockOnInjection?: boolean
    blockOnJailbreak?: boolean
    redactPII?: boolean
  }
): FullSecurityResult {
  const {
    blockOnInjection = true,
    blockOnJailbreak = true,
    redactPII = true,
  } = options ?? {}

  const injectionResult = detectPromptInjection(input)
  const piiResult = detectAndRedactPII(input)
  const jailbreakResult = detectJailbreak(input)

  const shouldBlock =
    (blockOnInjection && !injectionResult.safe) ||
    (blockOnJailbreak && !jailbreakResult.safe)

  const sanitizedInput = redactPII ? piiResult.sanitizedInput : input

  const allResults = [injectionResult, piiResult, jailbreakResult]
  const threats = allResults.filter((r) => r.threatType !== 'safe')
  const highestSeverity = threats.reduce(
    (max, r) =>
      severityRank(r.severity) > severityRank(max) ? r.severity : max,
    'low' as Severity
  )

  return {
    allowed: !shouldBlock,
    sanitizedInput: shouldBlock ? '' : sanitizedInput,
    results: {
      injection: injectionResult,
      pii: piiResult,
      jailbreak: jailbreakResult,
    },
    summary: {
      totalThreats: threats.length,
      highestSeverity,
      blocked: shouldBlock,
      redacted: piiResult.matchedPatterns.length > 0,
    },
  }
}

// =============================================================================
// Helpers
// =============================================================================

function severityRank(severity: Severity): number {
  const ranks: Record<Severity, number> = {
    low: 0,
    medium: 1,
    high: 2,
    critical: 3,
  }
  return ranks[severity]
}
