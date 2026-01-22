/**
 * ⚠️ DEPRECATED - SECURITY CRITICAL ⚠️
 *
 * Safe Code Evaluation Utility
 *
 * **THIS FEATURE IS DEPRECATED AND DISABLED BY DEFAULT DUE TO SECURITY RISKS**
 *
 * While this implementation blocks common dangerous patterns, it uses `new Function()`
 * which is inherently unsafe and can be bypassed through various techniques including:
 * - Unicode escape sequences
 * - Property access chains
 * - Prototype pollution
 * - Case variation bypasses
 *
 * **SECURITY AUDIT FINDING**: CRITICAL - TOOL-021
 * This code evaluation can be exploited for arbitrary code execution.
 *
 * **RECOMMENDED ALTERNATIVES**:
 * 1. Use Web Workers for true sandboxing (browser)
 * 2. Use vm2 module for Node.js environments
 * 3. Use a dedicated expression parser/DSL (e.g., expr-eval, mathjs)
 * 4. Remove this functionality entirely if not critical
 *
 * @deprecated Use Web Workers or vm2 for safe code execution
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
 * Options for safe evaluation
 */
export interface SafeEvaluateOptions {
  /**
   * Explicitly acknowledge the security risks and enable evaluation.
   *
   * **WARNING**: Setting this to true acknowledges that you understand:
   * 1. This is NOT secure sandboxing
   * 2. Pattern blocking can be bypassed
   * 3. Only use with fully trusted code
   * 4. Never use with user-provided code
   *
   * @default false
   */
  unsafeEnableEvaluation?: boolean
}

/**
 * ⚠️ DEPRECATED - Safely evaluate a JavaScript expression
 *
 * **THIS FUNCTION IS DISABLED BY DEFAULT FOR SECURITY**
 *
 * To use this function, you must explicitly set `unsafeEnableEvaluation: true`
 * in the options, acknowledging the security risks.
 *
 * @param code - The code to evaluate (should be an expression, not statements)
 * @param options - Options including security acknowledgment
 * @returns Result object with success status and result or error
 *
 * @deprecated Use Web Workers or vm2 module instead
 *
 * @example
 * ```ts
 * // UNSAFE - Requires explicit opt-in
 * const result = safeEvaluate('2 + 2', { unsafeEnableEvaluation: true })
 * // { success: true, result: 4 }
 *
 * // Without opt-in, function is disabled
 * const disabled = safeEvaluate('2 + 2')
 * // { success: false, error: 'SECURITY: safe-evaluate is disabled by default...' }
 * ```
 */
export function safeEvaluate(
  code: string,
  options: SafeEvaluateOptions = {}
): SafeEvaluateResult {
  // SECURITY: Disabled by default - requires explicit opt-in
  if (!options.unsafeEnableEvaluation) {
    return {
      success: false,
      error:
        'SECURITY: safe-evaluate is disabled by default due to security risks (TOOL-021). ' +
        'Use Web Workers or vm2 for true sandboxing. ' +
        'If you must use this with TRUSTED code only, set unsafeEnableEvaluation: true. ' +
        'See https://github.com/[your-repo]/security/safe-evaluate.md for details.',
    }
  }

  // Log warning when this dangerous function is used
  console.warn(
    '[SECURITY WARNING] safe-evaluate is being used despite known security risks. ' +
      'This should only be used with fully trusted code. Issue: TOOL-021'
  )
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
