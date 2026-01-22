/**
 * Security Utilities
 *
 * Utilities for safe evaluation, HTML sanitization, and parameter sanitization.
 *
 * **SECURITY**: Comprehensive security utilities to prevent common injection attacks:
 * - Code evaluation (disabled by default - TOOL-021)
 * - HTML/XSS sanitization
 * - SQL injection prevention (TOOL-022)
 * - Command injection prevention (TOOL-022)
 * - Path traversal prevention (TOOL-022)
 * - LDAP/XML injection prevention (TOOL-022)
 */

export {
  safeEvaluate,
  detectDangerousPatterns,
  formatEvaluateResult,
  type SafeEvaluateResult,
  type SafeEvaluateOptions,
} from './safe-evaluate'

export {
  sanitizeCodeHtml,
  escapeHtmlEntities,
  createSafeCodeHtml,
  detectDangerousHtml,
} from './sanitize-html'

export {
  // SQL sanitization
  sanitizeSQL,
  sanitizeSQLIdentifier,

  // Shell/Command sanitization
  sanitizeShellArg,
  detectCommandInjection,

  // Path sanitization
  sanitizePath,
  sanitizeFilename,

  // Other injection prevention
  sanitizeLDAP,
  sanitizeXML,
  sanitizeURLParam,

  // Utilities
  isSafeInput,
  truncateInput,

  // Default export
  sanitization,
} from './sanitization'
