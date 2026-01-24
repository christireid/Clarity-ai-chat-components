/**
 * Enhanced Primitives Utilities
 * Extended utilities for enterprise features while maintaining backward compatibility
 */

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @deprecated Import from @clarity-chat/utils/format instead
 */
export { formatRelativeTime } from '@clarity-chat/utils/format'

/**
 * Generate unique ID
 * @deprecated Import from @clarity-chat/utils instead
 */
export { generateId } from '@clarity-chat/utils'

/**
 * Format file size
 * @deprecated Import from @clarity-chat/utils/format instead
 */
export { formatBytes as formatFileSize } from '@clarity-chat/utils/format'

/**
 * Format bytes to human readable string
 * @deprecated Import from @clarity-chat/utils/format instead
 */
export { formatBytes } from '@clarity-chat/utils/format'

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
 * @deprecated Import from @clarity-chat/utils instead
 */
export { clamp } from '@clarity-chat/utils'

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
 * @deprecated Import from @clarity-chat/utils/env instead
 */
export { isBrowser } from '@clarity-chat/utils/env'

/**
 * Check if running in Node.js environment
 * @deprecated Import from @clarity-chat/utils/env instead
 */
export { isNode } from '@clarity-chat/utils/env'

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
 * @deprecated Import retry from @clarity-chat/utils/async instead
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  const { retry: retryUtil } = await import('@clarity-chat/utils/async')
  return retryUtil(fn, {
    retries: retries - 1, // retry() counts retries, not total attempts
    delay,
    backoffFactor: 2,
  })
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
 * Check if string is valid JSON
 * @deprecated Import from @clarity-chat/utils/validation instead
 */
export { isValidJson } from '@clarity-chat/utils/validation'

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
 * @deprecated Import from @clarity-chat/utils/validation instead
 */
export { isValidEmail as isEmail } from '@clarity-chat/utils/validation'

/**
 * Check if string is URL
 * @deprecated Import from @clarity-chat/utils/validation instead
 */
export { isValidUrl as isUrl } from '@clarity-chat/utils/validation'

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

// Re-export from utils subdirectory for backwards compatibility
export * from './utils/classnames'
export * from './utils/dom'
export * from './utils/style'
