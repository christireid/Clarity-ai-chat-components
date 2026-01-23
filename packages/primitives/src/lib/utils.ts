/**
 * Enhanced Primitives Utilities
 * Extended utilities for enterprise features while maintaining backward compatibility
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 * Accepts Date objects, ISO strings, or timestamps
 */
export function formatRelativeTime(
  date: Date | string | number | undefined | null
): string {
  if (!date) return ''

  // Convert to Date if needed
  let dateObj: Date
  if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    return ''
  }

  // Check for invalid date
  if (isNaN(dateObj.getTime())) {
    return ''
  }

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return dateObj.toLocaleDateString()
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {
      await navigator.clipboard.writeText(text)
      return true
    }
    // Fallback for older browsers or non-secure contexts
    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand
        ? document.execCommand('copy')
        : false
      document.body.removeChild(textarea)
      return success
    }
    return false
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Format file size
 * Enhanced version with better precision and consistency
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Format bytes to human readable string
 * Alias for formatFileSize for consistency across codebase
 */
export function formatBytes(bytes: number): string {
  return formatFileSize(bytes)
}

/**
 * Format timestamp to ISO string
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString()
}

/**
 * Calculate percentage
 */
export function calculatePercentage(
  part: number,
  total: number,
  decimals: number = 2
): number {
  if (total === 0) return 0
  return parseFloat(((part / total) * 100).toFixed(decimals))
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(
  prefix: string,
  extension: string
): string {
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
    TB: 1024 * 1024 * 1024 * 1024,
  }

  const match = sizeStr.trim().match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i)
  if (!match) throw new Error(`Invalid file size format: ${sizeStr}`)

  const size = match[1]
  const unit = match[2]
  if (!size || !unit) throw new Error(`Invalid file size format: ${sizeStr}`)
  return parseFloat(size) * units[unit.toUpperCase() as keyof typeof units]
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      const targetValue = result[key] as Record<string, unknown> | undefined
      result[key] = deepMerge(
        targetValue ?? ({} as Record<string, unknown>),
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>]
    } else {
      result[key] = sourceValue as T[Extract<keyof T, string>]
    }
  }

  return result
}

/**
 * Validate configuration against schema
 */
export function validateConfig<T>(
  config: unknown,
  schema: { validate: (data: unknown) => T }
): T {
  try {
    return schema.validate(config)
  } catch (error) {
    throw new Error(`Configuration validation failed: ${error}`)
  }
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()!.toLowerCase() : ''
}

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

/**
 * Check if running in Node.js environment
 */
export function isNode(): boolean {
  // Check for Node.js environment without relying on @types/node
  return (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { process?: { versions?: { node?: string } } })
      .process?.versions?.node === 'string'
  )
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T = any>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString)
  } catch {
    return fallback
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Generate random string
 */
export function randomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < retries - 1) {
        await sleep(delay * Math.pow(2, i))
      }
    }
  }

  throw lastError!
}

/**
 * Memoize function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  return ((...args: Parameters<T>): ReturnType<T> | void => {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      return func(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func(...args)
      }, remaining)
    }
  }) as T
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return text.replace(/[&<>"']/g, (m) => map[m] ?? m)
}

/**
 * Unescape HTML special characters
 */
export function unescapeHtml(html: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }

  return html.replace(/&(?:amp|lt|gt|quot|#39);/g, (m) => map[m] ?? m)
}

/**
 * Convert string to kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert string to camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase())
}

/**
 * Convert string to PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase())
}

/**
 * Convert string to snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}

/**
 * Check if string is valid JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Get nested object value safely
 */
export function getNestedValue(
  obj: any,
  path: string,
  defaultValue?: any
): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : defaultValue
  }, obj)
}

/**
 * Set nested object value safely
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  let current = obj
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }

  current[lastKey] = value
  return obj
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
  return array.filter((item) => {
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
  return array.reduce(
    (groups, item) => {
      const group = String(item[key])
      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
      return groups
    },
    {} as Record<string, T[]>
  )
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
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

/**
 * Pick properties from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Omit properties from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

/**
 * Check if object has property
 */
export function hasProperty<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * Get object keys
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

/**
 * Get object values
 */
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj)
}

/**
 * Get object entries
 */
export function entries<T extends object>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>
}

/**
 * Check if value is object
 */
export function isObject(value: any): value is Record<string, any> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Check if value is array
 */
export function isArray(value: any): value is any[] {
  return Array.isArray(value)
}

/**
 * Check if value is string
 */
export function isString(value: any): value is string {
  return typeof value === 'string'
}

/**
 * Check if value is number
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Check if value is boolean
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Check if value is function
 */
export function isFunction(
  value: unknown
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

/**
 * Check if value is null
 */
export function isNull(value: any): value is null {
  return value === null
}

/**
 * Check if value is undefined
 */
export function isUndefined(value: any): value is undefined {
  return value === undefined
}

/**
 * Check if value is null or undefined
 */
export function isNil(value: any): value is null | undefined {
  return value == null
}

/**
 * Check if value is truthy
 */
export function isTruthy(value: any): boolean {
  return Boolean(value)
}

/**
 * Check if value is falsy
 */
export function isFalsy(value: any): boolean {
  return !value
}

/**
 * Check if value is not empty
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value)
}

/**
 * Check if value is equal (deep comparison for objects)
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false
  if (typeof a !== 'object') return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!isEqual(a[key], b[key])) return false
  }

  return true
}

/**
 * Check if value is not equal
 */
export function isNotEqual(a: any, b: any): boolean {
  return !isEqual(a, b)
}

/**
 * Check if value is in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Check if value is out of range
 */
export function isOutOfRange(value: number, min: number, max: number): boolean {
  return !isInRange(value, min, max)
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
 * Check if value is zero
 */
export function isZero(value: number): boolean {
  return value === 0
}

/**
 * Check if value is even
 */
export function isEven(value: number): boolean {
  return value % 2 === 0
}

/**
 * Check if value is odd
 */
export function isOdd(value: number): boolean {
  return value % 2 !== 0
}

/**
 * Check if value is finite
 */
export function isFinite(value: number): boolean {
  return Number.isFinite(value)
}

/**
 * Check if value is infinite
 */
export function isInfinite(value: number): boolean {
  return !Number.isFinite(value)
}

/**
 * Check if value is NaN
 */
export function isNaN(value: number): boolean {
  return Number.isNaN(value)
}

/**
 * Check if value is not NaN
 */
export function isNotNaN(value: number): boolean {
  return !Number.isNaN(value)
}

/**
 * Check if value is integer
 */
export function isInteger(value: number): boolean {
  return Number.isInteger(value)
}

/**
 * Check if value is float
 */
export function isFloat(value: number): boolean {
  return !Number.isInteger(value)
}

/**
 * Check if value is safe integer
 */
export function isSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value)
}

/**
 * Check if value is not safe integer
 */
export function isNotSafeInteger(value: number): boolean {
  return !Number.isSafeInteger(value)
}

/**
 * Check if value is positive integer
 */
export function isPositiveInteger(value: number): boolean {
  return isPositive(value) && isInteger(value)
}

/**
 * Check if value is negative integer
 */
export function isNegativeInteger(value: number): boolean {
  return isNegative(value) && isInteger(value)
}

/**
 * Check if value is positive float
 */
export function isPositiveFloat(value: number): boolean {
  return isPositive(value) && isFloat(value)
}

/**
 * Check if value is negative float
 */
export function isNegativeFloat(value: number): boolean {
  return isNegative(value) && isFloat(value)
}

/**
 * Check if value is in array
 */
export function includes<T>(array: T[], value: T): boolean {
  return array.includes(value)
}

/**
 * Check if value is not in array
 */
export function excludes<T>(array: T[], value: T): boolean {
  return !array.includes(value)
}

/**
 * Find first match in array
 */
export function find<T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined {
  return array.find(predicate)
}

/**
 * Find all matches in array
 */
export function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate)
}

/**
 * Check if any item matches predicate
 */
export function some<T>(array: T[], predicate: (item: T) => boolean): boolean {
  return array.some(predicate)
}

/**
 * Check if all items match predicate
 */
export function every<T>(array: T[], predicate: (item: T) => boolean): boolean {
  return array.every(predicate)
}

/**
 * Check if array includes any of the values
 */
export function includesAny<T>(array: T[], values: T[]): boolean {
  return values.some((value) => array.includes(value))
}

/**
 * Check if array includes all of the values
 */
export function includesAll<T>(array: T[], values: T[]): boolean {
  return values.every((value) => array.includes(value))
}

/**
 * Check if array excludes all of the values
 */
export function excludesAll<T>(array: T[], values: T[]): boolean {
  return values.every((value) => !array.includes(value))
}

/**
 * Check if string includes substring
 */
export function includesSubstring(str: string, substring: string): boolean {
  return str.includes(substring)
}

/**
 * Check if string excludes substring
 */
export function excludesSubstring(str: string, substring: string): boolean {
  return !str.includes(substring)
}

/**
 * Check if string starts with substring
 */
export function startsWith(str: string, substring: string): boolean {
  return str.startsWith(substring)
}

/**
 * Check if string ends with substring
 */
export function endsWith(str: string, substring: string): boolean {
  return str.endsWith(substring)
}

/**
 * Check if string matches regex
 */
export function matches(str: string, regex: RegExp): boolean {
  return regex.test(str)
}

/**
 * Check if string does not match regex
 */
export function notMatches(str: string, regex: RegExp): boolean {
  return !regex.test(str)
}

/**
 * Check if string is email
 */
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(str)
}

/**
 * Check if string is URL
 */
export function isUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string is numeric
 */
export function isNumeric(str: string): boolean {
  return !isNaN(Number(str))
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
 * Check if string is JSON
 */
export function isJsonString(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string is UUID
 */
export function isUuid(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

/**
 * Check if string is IP address
 */
export function isIpAddress(str: string): boolean {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
  return ipv4Regex.test(str) || ipv6Regex.test(str)
}

/**
 * Check if string is port number
 */
export function isPortNumber(str: string): boolean {
  const port = Number(str)
  return isInteger(port) && port >= 1 && port <= 65535
}

/**
 * Check if string is date
 */
export function isDateString(str: string): boolean {
  return !isNaN(Date.parse(str))
}

/**
 * Check if string is time
 */
export function isTimeString(str: string): boolean {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
  return timeRegex.test(str)
}

/**
 * Check if string is color
 */
export function isColorString(str: string): boolean {
  const colorRegex =
    /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$|^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$|^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/
  return colorRegex.test(str)
}

/**
 * Check if string is CSS unit
 */
export function isCssUnit(str: string): boolean {
  const cssUnitRegex =
    /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ex|ch|cm|mm|in|pt|pc|fr)$/
  return cssUnitRegex.test(str)
}

/**
 * Check if string is HTML tag
 */
export function isHtmlTag(str: string): boolean {
  const htmlTags = [
    'a',
    'abbr',
    'address',
    'area',
    'article',
    'aside',
    'audio',
    'b',
    'base',
    'bdi',
    'bdo',
    'blockquote',
    'body',
    'br',
    'button',
    'canvas',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'data',
    'datalist',
    'dd',
    'del',
    'details',
    'dfn',
    'dialog',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'fieldset',
    'figcaption',
    'figure',
    'footer',
    'form',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'header',
    'hr',
    'html',
    'i',
    'iframe',
    'img',
    'input',
    'ins',
    'kbd',
    'label',
    'legend',
    'li',
    'link',
    'main',
    'map',
    'mark',
    'meta',
    'meter',
    'nav',
    'noscript',
    'object',
    'ol',
    'optgroup',
    'option',
    'output',
    'p',
    'param',
    'picture',
    'pre',
    'progress',
    'q',
    'rp',
    'rt',
    'ruby',
    's',
    'samp',
    'script',
    'section',
    'select',
    'small',
    'source',
    'span',
    'strong',
    'style',
    'sub',
    'summary',
    'sup',
    'table',
    'tbody',
    'td',
    'template',
    'textarea',
    'tfoot',
    'th',
    'thead',
    'time',
    'title',
    'tr',
    'track',
    'u',
    'ul',
    'var',
    'video',
    'wbr',
  ]
  return htmlTags.includes(str.toLowerCase())
}

/**
 * Check if string is SVG tag
 */
export function isSvgTag(str: string): boolean {
  const svgTags = [
    'svg',
    'g',
    'path',
    'rect',
    'circle',
    'ellipse',
    'line',
    'polyline',
    'polygon',
    'text',
    'tspan',
    'tref',
    'textPath',
    'defs',
    'clipPath',
    'mask',
    'pattern',
    'image',
    'switch',
    'foreignObject',
    'use',
    'symbol',
    'marker',
    'linearGradient',
    'radialGradient',
    'stop',
    'animate',
    'animateMotion',
    'animateTransform',
    'set',
    'metadata',
    'title',
    'desc',
  ]
  return svgTags.includes(str.toLowerCase())
}

/**
 * Check if string is MathML tag
 */
export function isMathmlTag(str: string): boolean {
  const mathmlTags = [
    'math',
    'maction',
    'maligngroup',
    'malignmark',
    'menclose',
    'merror',
    'mfenced',
    'mfrac',
    'mglyph',
    'mi',
    'mlabeledtr',
    'mlongdiv',
    'mmultiscripts',
    'mn',
    'mo',
    'mover',
    'mpadded',
    'mphantom',
    'mroot',
    'mrow',
    'ms',
    'mscarries',
    'mscarry',
    'msgroup',
    'msline',
    'mspace',
    'msqrt',
    'msrow',
    'mstack',
    'mstyle',
    'msub',
    'msup',
    'msubsup',
    'mtable',
    'mtd',
    'mtext',
    'mtr',
    'munder',
    'munderover',
    'semantics',
    'annotation',
    'annotation-xml',
  ]
  return mathmlTags.includes(str.toLowerCase())
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
 * Check if string is role attribute
 */
export function isRoleAttribute(str: string): boolean {
  return str === 'role'
}

/**
 * Check if string is event attribute
 */
export function isEventAttribute(str: string): boolean {
  return str.startsWith('on')
}

/**
 * Check if string is style attribute
 */
export function isStyleAttribute(str: string): boolean {
  return str === 'style'
}

/**
 * Check if string is class attribute
 */
export function isClassAttribute(str: string): boolean {
  return str === 'class'
}

/**
 * Check if string is id attribute
 */
export function isIdAttribute(str: string): boolean {
  return str === 'id'
}

/**
 * Check if string is href attribute
 */
export function isHrefAttribute(str: string): boolean {
  return str === 'href'
}

/**
 * Check if string is src attribute
 */
export function isSrcAttribute(str: string): boolean {
  return str === 'src'
}

/**
 * Check if string is alt attribute
 */
export function isAltAttribute(str: string): boolean {
  return str === 'alt'
}

/**
 * Check if string is title attribute
 */
export function isTitleAttribute(str: string): boolean {
  return str === 'title'
}

/**
 * Check if string is value attribute
 */
export function isValueAttribute(str: string): boolean {
  return str === 'value'
}

/**
 * Check if string is name attribute
 */
export function isNameAttribute(str: string): boolean {
  return str === 'name'
}

/**
 * Check if string is type attribute
 */
export function isTypeAttribute(str: string): boolean {
  return str === 'type'
}

/**
 * Check if string is placeholder attribute
 */
export function isPlaceholderAttribute(str: string): boolean {
  return str === 'placeholder'
}

/**
 * Check if string is disabled attribute
 */
export function isDisabledAttribute(str: string): boolean {
  return str === 'disabled'
}

/**
 * Check if string is readonly attribute
 */
export function isReadonlyAttribute(str: string): boolean {
  return str === 'readonly'
}

/**
 * Check if string is required attribute
 */
export function isRequiredAttribute(str: string): boolean {
  return str === 'required'
}

/**
 * Check if string is checked attribute
 */
export function isCheckedAttribute(str: string): boolean {
  return str === 'checked'
}

/**
 * Check if string is selected attribute
 */
export function isSelectedAttribute(str: string): boolean {
  return str === 'selected'
}

/**
 * Check if string is multiple attribute
 */
export function isMultipleAttribute(str: string): boolean {
  return str === 'multiple'
}

/**
 * Check if string is accept attribute
 */
export function isAcceptAttribute(str: string): boolean {
  return str === 'accept'
}

/**
 * Check if string is autocomplete attribute
 */
export function isAutocompleteAttribute(str: string): boolean {
  return str === 'autocomplete'
}

/**
 * Check if string is autofocus attribute
 */
export function isAutofocusAttribute(str: string): boolean {
  return str === 'autofocus'
}

/**
 * Check if string is form attribute
 */
export function isFormAttribute(str: string): boolean {
  return str === 'form'
}

/**
 * Check if string is formaction attribute
 */
export function isFormactionAttribute(str: string): boolean {
  return str === 'formaction'
}

/**
 * Check if string is formenctype attribute
 */
export function isFormenctypeAttribute(str: string): boolean {
  return str === 'formenctype'
}

/**
 * Check if string is formmethod attribute
 */
export function isFormmethodAttribute(str: string): boolean {
  return str === 'formmethod'
}

/**
 * Check if string is formnovalidate attribute
 */
export function isFormnovalidateAttribute(str: string): boolean {
  return str === 'formnovalidate'
}

/**
 * Check if string is formtarget attribute
 */
export function isFormtargetAttribute(str: string): boolean {
  return str === 'formtarget'
}

/**
 * Check if string is height attribute
 */
export function isHeightAttribute(str: string): boolean {
  return str === 'height'
}

/**
 * Check if string is width attribute
 */
export function isWidthAttribute(str: string): boolean {
  return str === 'width'
}

/**
 * Check if string is max attribute
 */
export function isMaxAttribute(str: string): boolean {
  return str === 'max'
}

/**
 * Check if string is maxlength attribute
 */
export function isMaxlengthAttribute(str: string): boolean {
  return str === 'maxlength'
}

/**
 * Check if string is min attribute
 */
export function isMinAttribute(str: string): boolean {
  return str === 'min'
}

/**
 * Check if string is minlength attribute
 */
export function isMinlengthAttribute(str: string): boolean {
  return str === 'minlength'
}

/**
 * Check if string is pattern attribute
 */
export function isPatternAttribute(str: string): boolean {
  return str === 'pattern'
}

/**
 * Check if string is step attribute
 */
export function isStepAttribute(str: string): boolean {
  return str === 'step'
}

/**
 * Check if string is wrap attribute
 */
export function isWrapAttribute(str: string): boolean {
  return str === 'wrap'
}

/**
 * Check if string is contenteditable attribute
 */
export function isContenteditableAttribute(str: string): boolean {
  return str === 'contenteditable'
}

/**
 * Check if string is draggable attribute
 */
export function isDraggableAttribute(str: string): boolean {
  return str === 'draggable'
}

/**
 * Check if string is hidden attribute
 */
export function isHiddenAttribute(str: string): boolean {
  return str === 'hidden'
}

/**
 * Check if string is spellcheck attribute
 */
export function isSpellcheckAttribute(str: string): boolean {
  return str === 'spellcheck'
}

/**
 * Check if string is translate attribute
 */
export function isTranslateAttribute(str: string): boolean {
  return str === 'translate'
}

/**
 * Check if string is accesskey attribute
 */
export function isAccesskeyAttribute(str: string): boolean {
  return str === 'accesskey'
}

/**
 * Check if string is dir attribute
 */
export function isDirAttribute(str: string): boolean {
  return str === 'dir'
}

/**
 * Check if string is lang attribute
 */
export function isLangAttribute(str: string): boolean {
  return str === 'lang'
}

/**
 * Check if string is tabindex attribute
 */
export function isTabindexAttribute(str: string): boolean {
  return str === 'tabindex'
}

/**
 * Check if string is XML name
 */
export function isXmlName(str: string): boolean {
  const xmlNameRegex = /^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/
  return xmlNameRegex.test(str)
}

/**
 * Check if string is XML NCName
 */
export function isXmlNcname(str: string): boolean {
  const xmlNcnameRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlNcnameRegex.test(str)
}

/**
 * Check if string is XML QName
 */
export function isXmlQname(str: string): boolean {
  const xmlQnameRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*(:[a-zA-Z_][a-zA-Z0-9_.-]*)?$/
  return xmlQnameRegex.test(str)
}

/**
 * Check if string is XML NMTOKEN
 */
export function isXmlNmtoken(str: string): boolean {
  const xmlNmtokenRegex = /^[a-zA-Z0-9_.-]+$/
  return xmlNmtokenRegex.test(str)
}

/**
 * Check if string is XML NMTOKENS
 */
export function isXmlNmtokens(str: string): boolean {
  const xmlNmtokensRegex = /^[a-zA-Z0-9_.-\s]+$/
  return xmlNmtokensRegex.test(str)
}

/**
 * Check if string is XML ID
 */
export function isXmlId(str: string): boolean {
  const xmlIdRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlIdRegex.test(str)
}

/**
 * Check if string is XML IDREF
 */
export function isXmlIdref(str: string): boolean {
  const xmlIdrefRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlIdrefRegex.test(str)
}

/**
 * Check if string is XML IDREFS
 */
export function isXmlIdrefs(str: string): boolean {
  const xmlIdrefsRegex = /^[a-zA-Z_][a-zA-Z0-9_.-\s]+$/
  return xmlIdrefsRegex.test(str)
}

/**
 * Check if string is XML ENTITY
 */
export function isXmlEntity(str: string): boolean {
  const xmlEntityRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlEntityRegex.test(str)
}

/**
 * Check if string is XML ENTITIES
 */
export function isXmlEntities(str: string): boolean {
  const xmlEntitiesRegex = /^[a-zA-Z_][a-zA-Z0-9_.-\s]+$/
  return xmlEntitiesRegex.test(str)
}

/**
 * Check if string is XML NOTATION
 */
export function isXmlNotation(str: string): boolean {
  const xmlNotationRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/
  return xmlNotationRegex.test(str)
}
