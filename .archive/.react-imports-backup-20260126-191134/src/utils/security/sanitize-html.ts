/**
 * HTML Sanitization Utility
 *
 * Provides sanitization for HTML content before using dangerouslySetInnerHTML.
 * Designed specifically for code highlighting output (Shiki, Prism, highlight.js).
 *
 * SECURITY NOTE: For maximum security with arbitrary HTML, use DOMPurify.
 * This utility is optimized for trusted sources like syntax highlighters.
 *
 * @module utils/sanitize-html
 */

/**
 * Allowed HTML tags for code highlighting
 * These are the only tags that syntax highlighters typically use
 */
const ALLOWED_TAGS = new Set([
  'span',
  'div',
  'pre',
  'code',
  'br',
  'em',
  'strong',
  'mark',
  'del',
  'ins',
  'sub',
  'sup',
])

/**
 * Allowed attributes for code highlighting
 * Limited to safe styling and data attributes
 */
const ALLOWED_ATTRS = new Set([
  'class',
  'style',
  'data-line',
  'data-language',
  'data-theme',
  'data-highlighted',
  'data-line-numbers',
  'title',
  'aria-hidden',
  'aria-label',
  'role',
])

/**
 * Dangerous patterns that should be removed
 */
const DANGEROUS_PATTERNS: RegExp[] = [
  // Script tags (with any attributes)
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  // Style tags that could contain expressions
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  // Event handlers (on*)
  /\s+on\w+\s*=/gi,
  // JavaScript URLs
  /javascript\s*:/gi,
  // Data URLs with script
  /data\s*:\s*text\/html/gi,
  // Expression() in CSS
  /expression\s*\(/gi,
  // VBScript
  /vbscript\s*:/gi,
  // HTML comments that might hide content
  /<!--[\s\S]*?-->/g,
]

/**
 * Safe style properties allowed in inline styles
 */
const SAFE_STYLE_PROPERTIES = new Set([
  'color',
  'background-color',
  'background',
  'font-weight',
  'font-style',
  'font-family',
  'text-decoration',
  'opacity',
  'display',
  'visibility',
])

/**
 * Sanitize HTML for safe rendering in code blocks
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 *
 * @example
 * ```ts
 * // Safe usage with Shiki output
 * const highlightedCode = await codeToHtml(code, { lang: 'typescript' })
 * const safeHtml = sanitizeCodeHtml(highlightedCode)
 *
 * // In React
 * <code dangerouslySetInnerHTML={{ __html: safeHtml }} />
 * ```
 */
export function sanitizeCodeHtml(html: string): string {
  if (typeof html !== 'string') {
    return ''
  }

  let sanitized = html

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '')
  }

  // Remove disallowed tags but keep content
  // Match opening and closing tags of non-allowed elements
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  sanitized = sanitized.replace(tagPattern, (match, tagName) => {
    if (ALLOWED_TAGS.has(tagName.toLowerCase())) {
      return match
    }
    // Remove the tag but preserve any text content
    return ''
  })

  // Sanitize attributes on remaining tags
  sanitized = sanitizeAttributes(sanitized)

  return sanitized
}

/**
 * Sanitize attributes in HTML, keeping only allowed ones
 */
function sanitizeAttributes(html: string): string {
  // Match tags with attributes
  const tagWithAttrsPattern = /<([a-z][a-z0-9]*)\s+([^>]*)>/gi

  return html.replace(tagWithAttrsPattern, (match, tagName, attrsString) => {
    if (!ALLOWED_TAGS.has(tagName.toLowerCase())) {
      return match
    }

    const sanitizedAttrs = sanitizeAttributeString(attrsString)
    if (sanitizedAttrs) {
      return `<${tagName} ${sanitizedAttrs}>`
    }
    return `<${tagName}>`
  })
}

/**
 * Parse and sanitize attribute string
 */
function sanitizeAttributeString(attrsString: string): string {
  const attrs: string[] = []

  // Match attribute patterns: name="value" or name='value' or name=value or name
  const attrPattern =
    /([a-z][a-z0-9-]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/gi
  let match

  while ((match = attrPattern.exec(attrsString)) !== null) {
    const [, name, doubleQuoted, singleQuoted, unquoted] = match
    const value = doubleQuoted ?? singleQuoted ?? unquoted ?? ''

    if (
      ALLOWED_ATTRS.has(name.toLowerCase()) ||
      name.toLowerCase().startsWith('data-')
    ) {
      // Additional sanitization for specific attributes
      if (name.toLowerCase() === 'style') {
        const safeStyle = sanitizeStyleAttribute(value)
        if (safeStyle) {
          attrs.push(`style="${safeStyle}"`)
        }
      } else {
        // Escape quotes in value
        const escapedValue = value.replace(/"/g, '&quot;')
        attrs.push(`${name}="${escapedValue}"`)
      }
    }
  }

  return attrs.join(' ')
}

/**
 * Sanitize inline style attribute
 */
function sanitizeStyleAttribute(style: string): string {
  const safeProperties: string[] = []

  // Parse style properties
  const properties = style.split(';')

  for (const prop of properties) {
    const colonIndex = prop.indexOf(':')
    if (colonIndex === -1) continue

    const name = prop.slice(0, colonIndex).trim().toLowerCase()
    const value = prop.slice(colonIndex + 1).trim()

    // Only allow safe properties
    if (SAFE_STYLE_PROPERTIES.has(name)) {
      // Additional check for dangerous values
      if (
        !value.includes('expression') &&
        // eslint-disable-next-line no-script-url -- This is a security check, not code execution
        !value.includes('javascript:') &&
        !value.includes('url(')
      ) {
        safeProperties.push(`${name}: ${value}`)
      }
    }
  }

  return safeProperties.join('; ')
}

/**
 * Escape HTML entities (for displaying code as text)
 *
 * This is the canonical HTML escaping implementation.
 * Use this instead of local escapeHtml implementations.
 *
 * @param text - Plain text to escape
 * @returns HTML-escaped string
 *
 * @example
 * ```ts
 * const safe = escapeHtmlEntities('<script>alert("xss")</script>')
 * // Returns: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;
 * ```
 */
export function escapeHtmlEntities(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return text.replace(/[&<>"']/g, (char) => escapeMap[char] || char)
}

/**
 * Alias for escapeHtmlEntities for backwards compatibility
 * @deprecated Use escapeHtmlEntities instead for clarity
 */
export const escapeHtml = escapeHtmlEntities

/**
 * Create safe HTML for code display (when no highlighting is available)
 *
 * @param code - The code string
 * @param options - Optional configuration
 * @returns Safe HTML string
 */
export function createSafeCodeHtml(
  code: string,
  options?: { className?: string; preserveWhitespace?: boolean }
): string {
  const { className = '', preserveWhitespace = true } = options ?? {}
  const escaped = escapeHtmlEntities(code)
  const classAttr = className ? ` class="${escapeHtmlEntities(className)}"` : ''
  const preStyle = preserveWhitespace ? ' style="white-space: pre-wrap;"' : ''

  return `<pre${preStyle}><code${classAttr}>${escaped}</code></pre>`
}

/**
 * Check if HTML contains potentially dangerous content
 *
 * @param html - HTML string to check
 * @returns Object indicating if dangerous and what was found
 */
export function detectDangerousHtml(html: string): {
  isDangerous: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(html)) {
      reasons.push(pattern.source.slice(0, 50))
    }
  }

  // Check for disallowed tags
  const tagPattern = /<([a-z][a-z0-9]*)\b/gi
  let match
  while ((match = tagPattern.exec(html)) !== null) {
    const tagName = match[1].toLowerCase()
    if (!ALLOWED_TAGS.has(tagName)) {
      reasons.push(`disallowed tag: <${tagName}>`)
    }
  }

  return {
    isDangerous: reasons.length > 0,
    reasons: [...new Set(reasons)], // Remove duplicates
  }
}
