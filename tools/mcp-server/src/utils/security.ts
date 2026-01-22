/**
 * Security utilities for path validation and sanitization
 */

import * as path from 'path'
import { PermissionError } from './errors.js'

/**
 * Check if paths start with base path (case-sensitive on Unix, case-insensitive on Windows)
 */
function pathStartsWith(resolved: string, base: string): boolean {
  // On Windows, use case-insensitive comparison
  if (process.platform === 'win32') {
    return resolved.toLowerCase().startsWith(base.toLowerCase())
  }
  return resolved.startsWith(base)
}

/**
 * Validate and resolve file path, preventing directory traversal
 */
export function validatePath(
  userPath: string,
  baseDir: string = process.cwd()
): string {
  // Sanitize null bytes and control characters first
  // eslint-disable-next-line no-control-regex
  const sanitized = userPath.replace(/\0/g, '').replace(/[\x00-\x1F\x7F]/g, '')

  // Normalize the path
  const normalized = path.normalize(sanitized)

  // Resolve relative to base directory
  const resolved = path.resolve(baseDir, normalized)

  // Ensure the resolved path is within the base directory
  const baseResolved = path.resolve(baseDir)

  // Use platform-aware comparison
  if (!pathStartsWith(resolved, baseResolved)) {
    throw new PermissionError('Invalid path: directory traversal detected', {
      userPath,
      baseDir,
      resolved,
      baseResolved,
    })
  }

  // Ensure the path separator follows the resolved path
  // This prevents /base/path from matching /base/pathfoo
  if (
    resolved !== baseResolved &&
    !pathStartsWith(resolved, baseResolved + path.sep)
  ) {
    throw new PermissionError('Invalid path: directory traversal detected', {
      userPath,
      baseDir,
      resolved,
      baseResolved,
    })
  }

  return resolved
}

/**
 * Sanitize string input to prevent injection attacks
 */
export function sanitizeString(input: string): string {
  // Remove null bytes and control characters
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '') // eslint-disable-line no-control-regex
    .trim()
}

/**
 * Validate project path is safe for file operations
 */
export function validateProjectPath(projectPath: string): string {
  const sanitized = sanitizeString(projectPath)

  // Check for directory traversal patterns more precisely
  // path.normalize resolves ".." segments, so we check if result starts with ".."
  // or contains "..\" or "../" which indicate parent directory references
  const normalized = path.normalize(sanitized)
  if (
    normalized.startsWith('..') ||
    normalized.includes('..' + path.sep) ||
    sanitized.includes('../') ||
    sanitized.includes('..\\')
  ) {
    throw new PermissionError(
      'Invalid project path: contains parent directory reference'
    )
  }

  // Validate path doesn't contain system directories
  const dangerousPaths = [
    '/etc',
    '/usr',
    '/bin',
    '/sbin',
    '/var',
    '/sys',
    '/proc',
    'C:\\Windows',
    'C:\\System32',
  ]

  const lowerPath = sanitized.toLowerCase()
  for (const dangerous of dangerousPaths) {
    if (lowerPath.includes(dangerous.toLowerCase())) {
      throw new PermissionError(
        `Invalid project path: cannot use system directory`
      )
    }
  }

  return sanitized
}

/**
 * Mask sensitive data (API keys, tokens, passwords, etc.)
 *
 * @param value - The sensitive string to mask
 * @param visibleChars - Number of characters to show at start and end (default: 4)
 * @returns Masked string showing only first and last N characters
 *
 * @example
 * maskSensitive('sk-1234567890abcdef') // => 'sk-1********cdef'
 * maskSensitive('short', 2) // => 'sh***rt'
 */
export function maskSensitive(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars * 2) {
    return '*'.repeat(value.length)
  }

  const start = value.slice(0, visibleChars)
  const end = value.slice(-visibleChars)
  const middle = '*'.repeat(Math.max(8, value.length - visibleChars * 2))

  return `${start}${middle}${end}`
}

/**
 * List of sensitive keys to redact in logs
 * Includes API keys, tokens, passwords, and PII fields
 */
const SENSITIVE_KEYS = [
  'apikey',
  'api_key',
  'apitoken',
  'api_token',
  'token',
  'password',
  'passwd',
  'pwd',
  'secret',
  'auth',
  'authorization',
  'bearer',
  'key',
  'credential',
  'credentials',
  'private',
  'privatekey',
  'private_key',
  'access_token',
  'accesstoken',
  'refresh_token',
  'refreshtoken',
  'session',
  'sessionid',
  'session_id',
  'cookie',
  'jwt',
  'email', // PII
  'phone', // PII
  'telephone', // PII
  'ssn', // PII
  'social_security', // PII
  'address', // PII
  'credit_card', // PII
  'creditcard', // PII
  'card_number', // PII
  'cvv', // PII
  'pin', // PII
]

/**
 * Check if a key name appears to be sensitive
 *
 * Uses fuzzy matching to catch variations like 'apiKey', 'api_key', 'API-KEY'
 */
function isSensitiveKey(key: string): boolean {
  const normalizedKey = key.toLowerCase().replace(/[_-]/g, '')
  return SENSITIVE_KEYS.some((sensitiveKey) =>
    normalizedKey.includes(sensitiveKey.toLowerCase().replace(/[_-]/g, ''))
  )
}

/**
 * Sanitize arguments/metadata for logging by masking sensitive values
 *
 * Recursively traverses objects to find and mask sensitive fields based on key names.
 * Prevents accidental exposure of API keys, tokens, passwords, and PII in logs.
 *
 * @param args - Object containing potentially sensitive data
 * @returns Sanitized object safe for logging
 *
 * @example
 * sanitizeForLogging({
 *   username: 'john',
 *   apiKey: 'sk-1234567890abcdef',
 *   config: { token: 'secret123' }
 * })
 * // => {
 * //   username: 'john',
 * //   apiKey: 'sk-1********cdef',
 * //   config: { token: 'secr********et123' }
 * // }
 */
export function sanitizeForLogging(
  args: Record<string, unknown>
): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(args)) {
    if (isSensitiveKey(key)) {
      // Mask sensitive values
      if (typeof value === 'string') {
        sanitized[key] = maskSensitive(value)
      } else if (value !== null && value !== undefined) {
        sanitized[key] = '[REDACTED]'
      } else {
        sanitized[key] = value
      }
    } else if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeForLogging(value as Record<string, unknown>)
    } else if (Array.isArray(value)) {
      // Sanitize arrays
      sanitized[key] = value.map((item) =>
        item !== null && typeof item === 'object' && !Array.isArray(item)
          ? sanitizeForLogging(item as Record<string, unknown>)
          : item
      )
    } else {
      sanitized[key] = value
    }
  }

  return sanitized
}
