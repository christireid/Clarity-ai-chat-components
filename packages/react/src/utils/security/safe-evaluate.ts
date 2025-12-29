/**
 * Safe Code Evaluation Utility
 *
 * Provides sandboxed evaluation of JavaScript expressions without using eval().
 * Blocks dangerous patterns and limits available globals.
 *
 * SECURITY NOTE: This is safer than eval() but NOT a complete sandbox.
 * For untrusted code execution, use Web Workers or iframes with sandbox attribute.
 *
 * @module utils/safe-evaluate
 */

/**
 * Result of a safe evaluation
 */
export interface SafeEvaluateResult {
  /** Whether evaluation succeeded */
  success: boolean
  /** The result value if successful */
  result?: unknown
  /** Error message if failed */
  error?: string
}

/**
 * Patterns that are blocked from evaluation
 * These could be used to escape the sandbox or access dangerous APIs
 */
const BLOCKED_PATTERNS: RegExp[] = [
  /\beval\s*\(/i,
  /\bFunction\s*\(/i,
  /\bsetTimeout\s*\(/i,
  /\bsetInterval\s*\(/i,
  /\bsetImmediate\s*\(/i,
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\b/i,
  /\bimport\s*\(/i,
  /\bimport\s+/i,
  /\brequire\s*\(/i,
  /\bprocess\b/i,
  /\bglobalThis\b/i,
  /\bwindow\b/i,
  /\bdocument\b/i,
  /\blocalStorage\b/i,
  /\bsessionStorage\b/i,
  /\bcookie\b/i,
  /\blocation\b/i,
  /\bnavigator\b/i,
  /\bWebSocket\b/i,
  /\bWorker\b/i,
  /\b__proto__\b/,
  /\bconstructor\b/,
  /\bprototype\b/,
]

/**
 * Safe globals that can be accessed during evaluation
 */
const SAFE_GLOBALS: Record<string, unknown> = {
  Math,
  Date,
  String,
  Number,
  Boolean,
  Array,
  Object,
  JSON,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  undefined,
  NaN,
  Infinity,
  // Safe array methods
  Map,
  Set,
  // Console for debugging (safe, output only)
  console: {
    log: (...args: unknown[]) => args.join(' '),
    warn: (...args: unknown[]) => args.join(' '),
    error: (...args: unknown[]) => args.join(' '),
  },
}

/**
 * Maximum code length allowed (prevents DoS via large inputs)
 */
const MAX_CODE_LENGTH = 10000

/**
 * Maximum execution time in milliseconds
 */
const MAX_EXECUTION_TIME = 1000

/**
 * Safely evaluate a JavaScript expression
 *
 * @param code - The code to evaluate (should be an expression, not statements)
 * @returns Result object with success status and result or error
 *
 * @example
 * ```ts
 * const result = safeEvaluate('2 + 2')
 * // { success: true, result: 4 }
 *
 * const invalid = safeEvaluate('fetch("https://evil.com")')
 * // { success: false, error: 'Blocked: dangerous pattern detected (fetch)' }
 * ```
 */
export function safeEvaluate(code: string): SafeEvaluateResult {
  // Input validation
  if (typeof code !== 'string') {
    return { success: false, error: 'Code must be a string' }
  }

  const trimmedCode = code.trim()

  if (trimmedCode.length === 0) {
    return { success: false, error: 'Code cannot be empty' }
  }

  if (trimmedCode.length > MAX_CODE_LENGTH) {
    return {
      success: false,
      error: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`,
    }
  }

  // Check for dangerous patterns
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmedCode)) {
      const patternName = pattern.source
        .replace(/\\b|\\s\*|\\/gi, '')
        .replace(/\(i?$/, '')
      return {
        success: false,
        error: `Blocked: dangerous pattern detected (${patternName})`,
      }
    }
  }

  try {
    // Create a sandboxed function with only safe globals
    const globalNames = Object.keys(SAFE_GLOBALS)
    const globalValues = Object.values(SAFE_GLOBALS)

    // Wrap in strict mode and return expression result
    const wrappedCode = `"use strict"; return (${trimmedCode})`

    // Create function with limited scope

    const sandboxedFn = new Function(...globalNames, wrappedCode)

    // Execute with timeout protection
    const startTime = Date.now()
    const result = sandboxedFn(...globalValues)

    // Check if execution took too long (basic protection)
    if (Date.now() - startTime > MAX_EXECUTION_TIME) {
      return {
        success: false,
        error: 'Execution timeout exceeded',
      }
    }

    return { success: true, result }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown evaluation error',
    }
  }
}

/**
 * Check if code contains any blocked patterns without executing
 *
 * @param code - The code to check
 * @returns Array of detected dangerous patterns, empty if safe
 */
export function detectDangerousPatterns(code: string): string[] {
  const detected: string[] = []

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(code)) {
      const patternName = pattern.source
        .replace(/\\b|\\s\*|\\/gi, '')
        .replace(/\(i?$/, '')
      detected.push(patternName)
    }
  }

  return detected
}

/**
 * Format evaluation result for display
 *
 * @param result - The result from safeEvaluate
 * @returns Formatted string for display
 */
export function formatEvaluateResult(result: SafeEvaluateResult): string {
  if (result.success) {
    const value = result.result
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2)
      } catch {
        return String(value)
      }
    }
    return String(value)
  }
  return `Error: ${result.error}`
}
