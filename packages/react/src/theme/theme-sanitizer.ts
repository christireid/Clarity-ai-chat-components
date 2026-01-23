/**
 * Theme Override Sanitization
 *
 * Provides utilities to safely apply runtime theme customizations
 * by blocking potentially dangerous CSS values.
 *
 * @example
 * ```tsx
 * import { sanitizeThemeOverrides, applyThemeOverrides } from '@clarity-chat/react/theme'
 *
 * // Validate and apply user theme customizations
 * const userOverrides = {
 *   'primary': '60% 0.2 265',
 *   'radius': '0.75rem',
 * }
 *
 * const safe = sanitizeThemeOverrides(userOverrides)
 * applyThemeOverrides(safe)
 * ```
 */

/**
 * Patterns that are blocked in CSS values for security.
 * These could potentially be used for XSS or other attacks.
 */
const UNSAFE_PATTERNS: RegExp[] = [
  /url\s*\(/i, // url() could load external resources
  /expression\s*\(/i, // IE expression() - legacy XSS vector
  /javascript:/i, // JavaScript protocol
  /data:/i, // Data URIs could contain scripts
  /behavior:/i, // IE behavior directive
  /-moz-binding/i, // Firefox XBL binding
  /@import/i, // CSS imports could load external stylesheets
  /<script/i, // Script tags
  /<style/i, // Style tags
  /\\00/i, // Unicode escapes that could bypass filters
  /&\{/i, // Expression injection
]

/**
 * Check if a CSS value contains unsafe patterns.
 *
 * @param value - The CSS value to check
 * @returns true if the value is safe, false if it contains unsafe patterns
 */
export function isSafeCssValue(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }

  // Check against all unsafe patterns
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(value)) {
      return false
    }
  }

  // Check for excessive length (potential DoS)
  if (value.length > 1000) {
    return false
  }

  return true
}

/**
 * Sanitize a single CSS value.
 *
 * @param value - The CSS value to sanitize
 * @returns The sanitized value, or null if the value is unsafe
 */
export function sanitizeCssValue(value: string): string | null {
  if (!isSafeCssValue(value)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Clarity Theme] Blocked unsafe CSS value: "${value}"`)
    }
    return null
  }

  // Trim whitespace
  return value.trim()
}

/**
 * Result of sanitizing theme overrides.
 */
export interface SanitizeResult {
  /** Safe overrides that can be applied */
  safe: Record<string, string>
  /** Keys that were blocked due to unsafe values */
  blocked: string[]
}

/**
 * Sanitize a set of theme overrides.
 *
 * @param overrides - Object of CSS variable name to value mappings
 * @returns Object with safe overrides and list of blocked keys
 *
 * @example
 * ```tsx
 * const result = sanitizeThemeOverrides({
 *   'primary': '60% 0.2 265', // safe
 *   'background': 'url(evil.com)', // blocked
 * })
 *
 * console.log(result.safe) // { primary: '60% 0.2 265' }
 * console.log(result.blocked) // ['background']
 * ```
 */
export function sanitizeThemeOverrides(
  overrides: Record<string, string>
): SanitizeResult {
  const safe: Record<string, string> = {}
  const blocked: string[] = []

  for (const [key, value] of Object.entries(overrides)) {
    // Validate key format (CSS variable names)
    if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(key)) {
      blocked.push(key)
      continue
    }

    const sanitized = sanitizeCssValue(value)
    if (sanitized !== null) {
      safe[key] = sanitized
    } else {
      blocked.push(key)
    }
  }

  return { safe, blocked }
}

/**
 * Apply sanitized theme overrides to the document.
 *
 * @param overrides - Object of CSS variable name to value mappings
 * @param element - Element to apply styles to (default: document.documentElement)
 *
 * @example
 * ```tsx
 * applyThemeOverrides({
 *   'primary': '60% 0.2 265',
 *   'radius': '0.75rem',
 * })
 * ```
 */
export function applyThemeOverrides(
  overrides: Record<string, string>,
  element: HTMLElement = document.documentElement
): void {
  const { safe, blocked } = sanitizeThemeOverrides(overrides)

  // Log blocked values in development
  if (blocked.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `[Clarity Theme] Blocked ${blocked.length} unsafe theme override(s):`,
      blocked
    )
  }

  // Apply safe values
  for (const [key, value] of Object.entries(safe)) {
    element.style.setProperty(`--${key}`, value)
  }
}

/**
 * Remove theme overrides from the document.
 *
 * @param keys - Array of CSS variable names to remove
 * @param element - Element to remove styles from (default: document.documentElement)
 */
export function removeThemeOverrides(
  keys: string[],
  element: HTMLElement = document.documentElement
): void {
  for (const key of keys) {
    element.style.removeProperty(`--${key}`)
  }
}

/**
 * Get current theme override values.
 *
 * @param keys - Array of CSS variable names to retrieve
 * @param element - Element to read styles from (default: document.documentElement)
 * @returns Object of CSS variable name to current value mappings
 */
export function getThemeOverrides(
  keys: string[],
  element: HTMLElement = document.documentElement
): Record<string, string> {
  const computed = getComputedStyle(element)
  const result: Record<string, string> = {}

  for (const key of keys) {
    const value = computed.getPropertyValue(`--${key}`).trim()
    if (value) {
      result[key] = value
    }
  }

  return result
}
