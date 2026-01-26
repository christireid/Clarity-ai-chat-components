/**
 * Type Guards
 * Runtime type checking utilities
 */

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
 * Check if value is not empty
 */
export function isNotEmpty(value: any): boolean {
  return !isEmpty(value)
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
