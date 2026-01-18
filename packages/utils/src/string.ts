/**
 * String Utilities
 *
 * Common string operations used across Clarity Chat packages.
 *
 * @module @clarity-chat/utils/string
 *
 * @example
 * ```ts
 * import { escapeHtml, unescapeHtml, kebabCase, camelCase } from '@clarity-chat/utils/string'
 *
 * escapeHtml('<script>alert("xss")</script>') // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * kebabCase('myVariableName') // 'my-variable-name'
 * ```
 */

// =============================================================================
// HTML Escaping
// =============================================================================

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const HTML_UNESCAPE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'", // Alternative encoding
  '&#039;': "'", // Decimal encoding
}

/**
 * Escape HTML special characters to prevent XSS attacks
 *
 * @param text - The text to escape
 * @returns The escaped text safe for HTML insertion
 *
 * @example
 * ```ts
 * escapeHtml('<script>alert("xss")</script>')
 * // '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 * ```
 */
export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char)
}

/**
 * Unescape HTML entities back to their original characters
 *
 * @param html - The HTML-escaped text
 * @returns The unescaped text
 *
 * @example
 * ```ts
 * unescapeHtml('&lt;script&gt;')
 * // '<script>'
 * ```
 */
export function unescapeHtml(html: string): string {
  return html.replace(
    /&(?:amp|lt|gt|quot|#39|#x27|#039);/g,
    (entity) => HTML_UNESCAPE_MAP[entity] ?? entity
  )
}

// =============================================================================
// Case Conversion
// =============================================================================

/**
 * Convert string to kebab-case
 *
 * @param str - The string to convert
 * @returns The kebab-case string
 *
 * @example
 * ```ts
 * kebabCase('myVariableName') // 'my-variable-name'
 * kebabCase('MyComponent') // 'my-component'
 * kebabCase('some_value') // 'some-value'
 * ```
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert string to camelCase
 *
 * @param str - The string to convert
 * @returns The camelCase string
 *
 * @example
 * ```ts
 * camelCase('my-variable-name') // 'myVariableName'
 * camelCase('some_value') // 'someValue'
 * ```
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase())
}

/**
 * Convert string to PascalCase
 *
 * @param str - The string to convert
 * @returns The PascalCase string
 *
 * @example
 * ```ts
 * pascalCase('my-component') // 'MyComponent'
 * pascalCase('some_value') // 'SomeValue'
 * ```
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase())
}

/**
 * Convert string to snake_case
 *
 * @param str - The string to convert
 * @returns The snake_case string
 *
 * @example
 * ```ts
 * snakeCase('myVariableName') // 'my_variable_name'
 * snakeCase('MyComponent') // 'my_component'
 * ```
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

// =============================================================================
// Random String Generation
// =============================================================================

const ALPHANUMERIC_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Generate a random alphanumeric string
 *
 * @param length - Length of the string to generate (default: 8)
 * @returns Random alphanumeric string
 *
 * @example
 * ```ts
 * randomString() // 'aB3xK9mZ'
 * randomString(16) // 'aB3xK9mZpQ7wN2yL'
 * ```
 */
export function randomString(length = 8): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARS.charAt(
      Math.floor(Math.random() * ALPHANUMERIC_CHARS.length)
    )
  }
  return result
}
