/**
 * Enhanced Primitives Utilities
 * Extended utilities for enterprise features while maintaining backward compatibility
 *
 * IMPORTANT: Prefer importing from @clarity-chat/utils when possible.
 * This file contains only primitives-specific utilities and re-exports.
 */

// =============================================================================
// Re-exports from @clarity-chat/utils (canonical source)
// =============================================================================

// Format utilities
export {
  formatBytes,
  formatRelativeTime,
  truncate,
  formatNumber,
} from '@clarity-chat/utils'

// Async utilities
export {
  debounce,
  throttle,
  sleep,
  retry,
} from '@clarity-chat/utils'

// Cache utilities
export { memoize } from '@clarity-chat/utils'

// ID generation
export { generateId } from '@clarity-chat/utils'

// Math utilities
export { clamp, calculatePercentage } from '@clarity-chat/utils'

// Environment detection
export { isBrowser, isNode } from '@clarity-chat/utils'

// String utilities
export {
  escapeHtml,
  unescapeHtml,
  kebabCase,
  camelCase,
  pascalCase,
  snakeCase,
  randomString,
} from '@clarity-chat/utils'

// DOM utilities
export { copyToClipboard } from '@clarity-chat/utils'

// Object utilities
export {
  isEqual,
  deepEqual,
  deepClone,
  deepMerge,
  isEmpty,
  isNotEmpty,
  getNestedValue,
  setNestedValue,
} from '@clarity-chat/utils'

// Validation utilities
export {
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isArray,
  isNull,
  isUndefined,
  isNullish as isNil,
  isDefined,
  isNonEmptyString,
  isNonEmptyArray,
  isValidDate,
  isPromise,
  isError,
  isValidEmail as isEmail,
  isValidUrl as isUrl,
  isValidUUID as isUuid,
  isValidJSON as isValidJson,
  parseJSON as safeJsonParse,
  pick,
  omit,
  hasKey as hasProperty,
} from '@clarity-chat/utils'

// =============================================================================
// Primitives-specific utilities (not in @clarity-chat/utils)
// =============================================================================

// Re-export cn from the canonical location
export { cn } from './cn'

/**
 * Format file size (alias for formatBytes for backward compatibility)
 */
export { formatBytes as formatFileSize } from '@clarity-chat/utils'


/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `${prefix}-${timestamp}.${extension}`
}

/**
 * Parse file size string (e.g., "1.5 MB") to bytes
 */
export function parseFileSize(sizeStr: string): number {
  const units = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
    TB: 1024 * 1024 * 1024 * 1024
  }

  const match = sizeStr.trim().match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i)
  if (!match) throw new Error(`Invalid file size format: ${sizeStr}`)

  const size = match[1]
  const unit = match[2]
  if (!size || !unit) throw new Error(`Invalid file size format: ${sizeStr}`)
  return parseFloat(size) * units[unit.toUpperCase() as keyof typeof units]
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}


// =============================================================================
// Object/Array utilities
// =============================================================================

/**
 * Get object keys with proper typing
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

/**
 * Get object values with proper typing
 */
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj)
}

/**
 * Get object entries with proper typing
 */
export function entries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)]
}

/**
 * Remove duplicates from array by key
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * Group array items by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Sort array by key
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

/**
 * Flatten nested arrays
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce<T[]>((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item)
  }, [])
}

// =============================================================================
// Number utilities
// =============================================================================

/**
 * Check if value is in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Check if value is positive
 */
export function isPositive(value: number): boolean {
  return value > 0
}

/**
 * Check if value is negative
 */
export function isNegative(value: number): boolean {
  return value < 0
}

/**
 * Check if value is integer
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value)
}

// =============================================================================
// String validation utilities
// =============================================================================

/**
 * Check if string is numeric
 */
export function isNumeric(str: string): boolean {
  return !Number.isNaN(Number(str))
}

/**
 * Check if string is alphabetic
 */
export function isAlphabetic(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str)
}

/**
 * Check if string is alphanumeric
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str)
}

/**
 * Check if string is hexadecimal
 */
export function isHexadecimal(str: string): boolean {
  return /^[0-9a-fA-F]+$/.test(str)
}

/**
 * Check if string is base64
 */
export function isBase64(str: string): boolean {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
  return base64Regex.test(str) && str.length % 4 === 0
}

/**
 * Check if string is IP address (IPv4 or IPv6)
 */
export function isIpAddress(str: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/
  return ipv4Regex.test(str) || ipv6Regex.test(str)
}

/**
 * Check if string is date string
 */
export function isDateString(str: string): boolean {
  return !Number.isNaN(Date.parse(str))
}

/**
 * Check if string is color (hex, rgb, rgba, hsl, hsla)
 */
export function isColorString(str: string): boolean {
  const colorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$|^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$|^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/
  return colorRegex.test(str)
}

/**
 * Check if string is CSS unit
 */
export function isCssUnit(str: string): boolean {
  const cssUnitRegex = /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ex|ch|cm|mm|in|pt|pc|fr)$/
  return cssUnitRegex.test(str)
}

// =============================================================================
// HTML/SVG element utilities (primitives-specific)
// =============================================================================

const HTML_TAGS = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo',
  'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
  'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed',
  'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend',
  'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol',
  'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt',
  'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong',
  'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot',
  'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
])

const SVG_TAGS = new Set([
  'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text',
  'tspan', 'tref', 'textPath', 'defs', 'clipPath', 'mask', 'pattern', 'image', 'switch',
  'foreignObject', 'use', 'symbol', 'marker', 'linearGradient', 'radialGradient', 'stop',
  'animate', 'animateMotion', 'animateTransform', 'set', 'metadata', 'title', 'desc'
])

/**
 * Check if string is HTML tag
 */
export function isHtmlTag(str: string): boolean {
  return HTML_TAGS.has(str.toLowerCase())
}

/**
 * Check if string is SVG tag
 */
export function isSvgTag(str: string): boolean {
  return SVG_TAGS.has(str.toLowerCase())
}

/**
 * Check if string is ARIA attribute
 */
export function isAriaAttribute(str: string): boolean {
  return str.startsWith('aria-')
}

/**
 * Check if string is data attribute
 */
export function isDataAttribute(str: string): boolean {
  return str.startsWith('data-')
}

/**
 * Check if string is event attribute (e.g., onClick, onSubmit)
 */
export function isEventAttribute(str: string): boolean {
  return str.startsWith('on')
}
