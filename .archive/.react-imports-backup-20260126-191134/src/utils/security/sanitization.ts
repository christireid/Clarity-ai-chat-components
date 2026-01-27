/**
 * Parameter Sanitization Utilities
 *
 * **SECURITY**: TOOL-022 - Provides sanitization utilities for common injection attack vectors
 *
 * This module provides sanitization helpers for tool developers to prevent:
 * - SQL Injection
 * - Command Injection
 * - Path Traversal
 * - LDAP Injection
 * - XML Injection
 *
 * **IMPORTANT**: These utilities provide defense-in-depth but should NOT be the only
 * security measure. Always use:
 * 1. Parameterized queries for SQL
 * 2. Avoid shell execution when possible
 * 3. Whitelist validation for file paths
 * 4. Principle of least privilege
 *
 * @module utils/security/sanitization
 */

// ============================================================================
// SQL INJECTION PREVENTION
// ============================================================================

/**
 * Sanitize a string for use in SQL queries
 *
 * **WARNING**: This is NOT a substitute for parameterized queries!
 * Always use prepared statements/parameterized queries when available.
 * This is only for cases where parameters cannot be used (e.g., table/column names).
 *
 * @param input - The input to sanitize
 * @returns Sanitized string safe for SQL context
 *
 * @example
 * ```ts
 * // WRONG: Never build SQL queries with string concatenation
 * const query = `SELECT * FROM users WHERE name = '${userInput}'`
 *
 * // BETTER: Use this as last resort (still not ideal)
 * const safeInput = sanitizeSQL(userInput)
 * const query = `SELECT * FROM users WHERE name = '${safeInput}'`
 *
 * // BEST: Use parameterized queries
 * const query = 'SELECT * FROM users WHERE name = ?'
 * db.execute(query, [userInput])
 * ```
 */
export function sanitizeSQL(input: string): string {
  if (typeof input !== 'string') {
    throw new TypeError('SQL sanitization requires string input')
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')

  // Escape single quotes (most common SQL injection vector)
  sanitized = sanitized.replace(/'/g, "''")

  // Escape backslashes
  sanitized = sanitized.replace(/\\/g, '\\\\')

  // Remove comment sequences
  sanitized = sanitized.replace(/--/g, '')
  sanitized = sanitized.replace(/\/\*/g, '')
  sanitized = sanitized.replace(/\*\//g, '')

  // Remove semicolons (prevents query chaining)
  sanitized = sanitized.replace(/;/g, '')

  return sanitized
}

/**
 * Validate and sanitize SQL identifier (table name, column name, etc.)
 *
 * Identifiers have stricter rules than values.
 *
 * @param identifier - The identifier to validate
 * @param options - Validation options
 * @returns Sanitized identifier
 * @throws Error if identifier contains invalid characters
 *
 * @example
 * ```ts
 * const tableName = sanitizeSQLIdentifier(userInput, { allowDots: false })
 * const query = `SELECT * FROM ${tableName}`
 * ```
 */
export function sanitizeSQLIdentifier(
  identifier: string,
  options: { allowDots?: boolean; maxLength?: number } = {}
): string {
  const { allowDots = false, maxLength = 64 } = options

  if (typeof identifier !== 'string') {
    throw new TypeError('SQL identifier must be a string')
  }

  if (identifier.length === 0) {
    throw new Error('SQL identifier cannot be empty')
  }

  if (identifier.length > maxLength) {
    throw new Error(`SQL identifier exceeds maximum length of ${maxLength}`)
  }

  // Allow only alphanumeric, underscore, and optionally dots
  const validPattern = allowDots ? /^[a-zA-Z0-9_.]+$/ : /^[a-zA-Z0-9_]+$/
  if (!validPattern.test(identifier)) {
    throw new Error(
      `SQL identifier contains invalid characters: ${identifier}. ` +
        `Allowed: letters, numbers, underscores${allowDots ? ', dots' : ''}`
    )
  }

  // Must start with letter or underscore
  if (!/^[a-zA-Z_]/.test(identifier)) {
    throw new Error('SQL identifier must start with a letter or underscore')
  }

  return identifier
}

// ============================================================================
// COMMAND INJECTION PREVENTION
// ============================================================================

/**
 * Sanitize input for shell command execution
 *
 * **WARNING**: Avoid shell execution when possible! Use language-native APIs instead.
 * If you must execute shell commands, use this as defense-in-depth.
 *
 * @param input - The input to sanitize
 * @param options - Sanitization options
 * @returns Sanitized string safe for shell context
 *
 * @example
 * ```ts
 * // WRONG: Never pass user input directly to shell
 * exec(`ls ${userInput}`)
 *
 * // BETTER: Sanitize first (still risky)
 * const safe = sanitizeShellArg(userInput)
 * exec(`ls ${safe}`)
 *
 * // BEST: Avoid shell entirely
 * import { readdir } from 'fs/promises'
 * const files = await readdir(userInput)
 * ```
 */
export function sanitizeShellArg(
  input: string,
  options: { strict?: boolean } = {}
): string {
  const { strict = true } = options

  if (typeof input !== 'string') {
    throw new TypeError('Shell argument must be a string')
  }

  if (input.length === 0) {
    return "''"
  }

  // In strict mode, only allow safe characters
  if (strict) {
    // Only alphanumeric, dash, underscore, dot, forward slash
    if (!/^[a-zA-Z0-9._/-]+$/.test(input)) {
      throw new Error(
        'Shell argument contains unsafe characters. ' +
          'Allowed in strict mode: letters, numbers, dash, underscore, dot, forward slash'
      )
    }
    return input
  }

  // In non-strict mode, escape dangerous characters
  // Wrap in single quotes and escape any single quotes
  const escaped = input.replace(/'/g, "'\\''")
  return `'${escaped}'`
}

/**
 * Detect common command injection patterns
 *
 * @param input - The input to check
 * @returns Array of detected dangerous patterns
 *
 * @example
 * ```ts
 * const dangerous = detectCommandInjection(userInput)
 * if (dangerous.length > 0) {
 *   throw new Error(`Dangerous patterns detected: ${dangerous.join(', ')}`)
 * }
 * ```
 */
export function detectCommandInjection(input: string): string[] {
  const dangerousPatterns = [
    { pattern: /[;&|`$()<>]/g, name: 'Shell metacharacters' },
    { pattern: /\$\{[^}]*\}/g, name: 'Command substitution' },
    { pattern: /\$\([^)]*\)/g, name: 'Command substitution' },
    { pattern: /``/g, name: 'Backtick substitution' },
    { pattern: /\n/g, name: 'Newline injection' },
    { pattern: /\r/g, name: 'Carriage return' },
    { pattern: /\0/g, name: 'Null byte' },
    { pattern: /\.\.\//g, name: 'Directory traversal' },
  ]

  const detected: string[] = []

  for (const { pattern, name } of dangerousPatterns) {
    if (pattern.test(input)) {
      detected.push(name)
    }
  }

  return detected
}

// ============================================================================
// PATH TRAVERSAL PREVENTION
// ============================================================================

/**
 * Sanitize and validate file path to prevent directory traversal
 *
 * @param inputPath - The path to sanitize
 * @param options - Validation options
 * @returns Sanitized safe path
 * @throws Error if path attempts traversal or is invalid
 *
 * @example
 * ```ts
 * try {
 *   const safePath = sanitizePath(userInput, {
 *     baseDir: '/var/uploads',
 *     allowedExtensions: ['.jpg', '.png']
 *   })
 *   // Safe to use safePath now
 * } catch (error) {
 *   console.error('Invalid path:', error.message)
 * }
 * ```
 */
export function sanitizePath(
  inputPath: string,
  options: {
    baseDir?: string
    allowedExtensions?: string[]
    maxLength?: number
    allowAbsolute?: boolean
  } = {}
): string {
  const {
    baseDir,
    allowedExtensions,
    maxLength = 4096,
    allowAbsolute = false,
  } = options

  if (typeof inputPath !== 'string') {
    throw new TypeError('Path must be a string')
  }

  if (inputPath.length === 0) {
    throw new Error('Path cannot be empty')
  }

  if (inputPath.length > maxLength) {
    throw new Error(`Path exceeds maximum length of ${maxLength}`)
  }

  // Check for null bytes
  if (inputPath.includes('\0')) {
    throw new Error('Path contains null byte')
  }

  // Detect directory traversal attempts
  const traversalPatterns = ['../', '..\\', '%2e%2e', '%252e%252e', '....//']
  for (const pattern of traversalPatterns) {
    if (inputPath.toLowerCase().includes(pattern)) {
      throw new Error('Path contains directory traversal sequence')
    }
  }

  // Check for absolute paths if not allowed
  if (!allowAbsolute) {
    if (inputPath.startsWith('/') || /^[a-zA-Z]:/.test(inputPath)) {
      throw new Error('Absolute paths are not allowed')
    }
  }

  // Normalize path separators
  let normalized = inputPath.replace(/\\/g, '/')

  // Remove duplicate slashes
  normalized = normalized.replace(/\/+/g, '/')

  // Remove leading/trailing slashes for relative paths
  if (!allowAbsolute) {
    normalized = normalized.replace(/^\/+/, '').replace(/\/+$/, '')
  }

  // Validate extension if whitelist provided
  if (allowedExtensions && allowedExtensions.length > 0) {
    const hasValidExtension = allowedExtensions.some((ext) =>
      normalized.toLowerCase().endsWith(ext.toLowerCase())
    )
    if (!hasValidExtension) {
      throw new Error(
        `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`
      )
    }
  }

  // If baseDir provided, ensure path doesn't escape it
  if (baseDir) {
    const path = require('path')
    const fullPath = path.resolve(baseDir, normalized)
    const resolvedBase = path.resolve(baseDir)

    if (!fullPath.startsWith(resolvedBase)) {
      throw new Error('Path escapes base directory')
    }

    return fullPath
  }

  return normalized
}

/**
 * Validate filename (no path components)
 *
 * @param filename - The filename to validate
 * @param options - Validation options
 * @returns Sanitized filename
 * @throws Error if filename is invalid
 *
 * @example
 * ```ts
 * const safe = sanitizeFilename(userInput, {
 *   allowedExtensions: ['.txt', '.md'],
 *   maxLength: 255
 * })
 * ```
 */
export function sanitizeFilename(
  filename: string,
  options: { allowedExtensions?: string[]; maxLength?: number } = {}
): string {
  const { allowedExtensions, maxLength = 255 } = options

  if (typeof filename !== 'string') {
    throw new TypeError('Filename must be a string')
  }

  if (filename.length === 0) {
    throw new Error('Filename cannot be empty')
  }

  if (filename.length > maxLength) {
    throw new Error(`Filename exceeds maximum length of ${maxLength}`)
  }

  // Must not contain path separators
  if (filename.includes('/') || filename.includes('\\')) {
    throw new Error('Filename cannot contain path separators')
  }

  // Must not be . or ..
  if (filename === '.' || filename === '..') {
    throw new Error('Invalid filename')
  }

  // Check for null bytes and control characters
  // eslint-disable-next-line no-control-regex
  if (/[\0-\x1f\x7f]/.test(filename)) {
    throw new Error('Filename contains invalid control characters')
  }

  // Validate extension if whitelist provided
  if (allowedExtensions && allowedExtensions.length > 0) {
    const hasValidExtension = allowedExtensions.some((ext) =>
      filename.toLowerCase().endsWith(ext.toLowerCase())
    )
    if (!hasValidExtension) {
      throw new Error(
        `Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`
      )
    }
  }

  return filename
}

// ============================================================================
// LDAP INJECTION PREVENTION
// ============================================================================

/**
 * Sanitize input for LDAP queries
 *
 * @param input - The input to sanitize
 * @returns Sanitized string safe for LDAP context
 *
 * @example
 * ```ts
 * const safe = sanitizeLDAP(userInput)
 * const filter = `(uid=${safe})`
 * ```
 */
export function sanitizeLDAP(input: string): string {
  if (typeof input !== 'string') {
    throw new TypeError('LDAP input must be a string')
  }

  // Escape special LDAP characters according to RFC 4515
  const escapeMap: Record<string, string> = {
    '\\': '\\5c',
    '*': '\\2a',
    '(': '\\28',
    ')': '\\29',
    '\0': '\\00',
  }

  return input.replace(/[\\*()\0]/g, (char) => escapeMap[char])
}

// ============================================================================
// XML INJECTION PREVENTION
// ============================================================================

/**
 * Sanitize input for XML content
 *
 * @param input - The input to sanitize
 * @returns Sanitized string safe for XML context
 *
 * @example
 * ```ts
 * const safe = sanitizeXML(userInput)
 * const xml = `<user><name>${safe}</name></user>`
 * ```
 */
export function sanitizeXML(input: string): string {
  if (typeof input !== 'string') {
    throw new TypeError('XML input must be a string')
  }

  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }

  return input.replace(/[&<>"']/g, (char) => escapeMap[char])
}

// ============================================================================
// URL PARAMETER SANITIZATION
// ============================================================================

/**
 * Sanitize input for use in URL parameters
 *
 * @param input - The input to sanitize
 * @param options - Sanitization options
 * @returns URL-safe string
 *
 * @example
 * ```ts
 * const safe = sanitizeURLParam(userInput)
 * const url = `https://api.example.com/search?q=${safe}`
 * ```
 */
export function sanitizeURLParam(
  input: string,
  options: { allowReserved?: boolean } = {}
): string {
  const { allowReserved = false } = options

  if (typeof input !== 'string') {
    throw new TypeError('URL parameter must be a string')
  }

  // Use proper URL encoding
  const encoded = encodeURIComponent(input)

  // If we don't allow reserved characters, ensure they're encoded
  if (!allowReserved) {
    // Double-encode reserved characters that might have special meaning
    return encoded.replace(/[!'()*]/g, (char) => {
      return '%' + char.charCodeAt(0).toString(16).toUpperCase()
    })
  }

  return encoded
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if input contains only safe characters
 *
 * @param input - The input to check
 * @param allowedPattern - Regex pattern for allowed characters
 * @returns true if input is safe
 *
 * @example
 * ```ts
 * if (!isSafeInput(userInput, /^[a-zA-Z0-9]+$/)) {
 *   throw new Error('Input contains invalid characters')
 * }
 * ```
 */
export function isSafeInput(input: string, allowedPattern: RegExp): boolean {
  if (typeof input !== 'string') {
    return false
  }

  return allowedPattern.test(input)
}

/**
 * Truncate input to maximum length
 *
 * @param input - The input to truncate
 * @param maxLength - Maximum allowed length
 * @param options - Truncation options
 * @returns Truncated string
 *
 * @example
 * ```ts
 * const safe = truncateInput(userInput, 100, { suffix: '...' })
 * ```
 */
export function truncateInput(
  input: string,
  maxLength: number,
  options: { suffix?: string; strict?: boolean } = {}
): string {
  const { suffix = '', strict = false } = options

  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string')
  }

  if (input.length <= maxLength) {
    return input
  }

  if (strict) {
    throw new Error(`Input exceeds maximum length of ${maxLength}`)
  }

  const truncated = input.substring(0, maxLength - suffix.length)
  return truncated + suffix
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Collection of all sanitization utilities
 */
export const sanitization = {
  // SQL
  sanitizeSQL,
  sanitizeSQLIdentifier,

  // Shell/Command
  sanitizeShellArg,
  detectCommandInjection,

  // Path
  sanitizePath,
  sanitizeFilename,

  // LDAP
  sanitizeLDAP,

  // XML
  sanitizeXML,

  // URL
  sanitizeURLParam,

  // Utilities
  isSafeInput,
  truncateInput,
} as const

export default sanitization
