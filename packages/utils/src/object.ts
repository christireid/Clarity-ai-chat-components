/**
 * Object Utilities
 *
 * Common object operations used across Clarity Chat packages.
 *
 * @module @clarity-chat/utils/object
 *
 * @example
 * ```ts
 * import { isEqual, deepClone, deepMerge } from '@clarity-chat/utils/object'
 *
 * isEqual({ a: 1 }, { a: 1 }) // true
 * deepClone({ nested: { value: 1 } }) // new object
 * ```
 */

/**
 * Deep equality comparison between two values
 *
 * Recursively compares objects and arrays.
 * Handles null, undefined, primitives, and nested structures.
 *
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are deeply equal
 *
 * @example
 * ```ts
 * isEqual({ a: 1 }, { a: 1 }) // true
 * isEqual([1, 2, 3], [1, 2, 3]) // true
 * isEqual({ a: { b: 1 } }, { a: { b: 1 } }) // true
 * isEqual({ a: 1 }, { a: 2 }) // false
 * ```
 */
export function isEqual(a: unknown, b: unknown): boolean {
  // Same reference or primitive equality
  if (a === b) return true

  // Null/undefined check
  if (a == null || b == null) return false

  // Type mismatch
  if (typeof a !== typeof b) return false

  // Non-object types (already checked equality above)
  if (typeof a !== 'object') return false

  // Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => isEqual(item, b[index]))
  }

  // One is array, one is not
  if (Array.isArray(a) !== Array.isArray(b)) return false

  // Objects
  const keysA = Object.keys(a as object)
  const keysB = Object.keys(b as object)

  if (keysA.length !== keysB.length) return false

  return keysA.every((key) => {
    if (!keysB.includes(key)) return false
    return isEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  })
}

/**
 * Alias for isEqual - deep equality comparison
 */
export const deepEqual = isEqual

/**
 * Deep clone an object
 *
 * Creates a deep copy of an object, handling nested objects, arrays, and Date instances.
 *
 * @param obj - Object to clone
 * @returns Deep clone of the object
 *
 * @example
 * ```ts
 * const original = { a: { b: 1 } }
 * const clone = deepClone(original)
 * clone.a.b = 2
 * console.log(original.a.b) // 1 (original unchanged)
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T
  }

  const cloned = {} as T
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key])
    }
  }

  return cloned
}

/**
 * Deep merge objects
 *
 * Merges source objects into target, handling nested objects recursively.
 * Arrays are replaced, not merged.
 *
 * @param target - Target object to merge into
 * @param sources - Source objects to merge from
 * @returns Merged object
 *
 * @example
 * ```ts
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } })
 * // { a: 1, b: { c: 2, d: 3 } }
 * ```
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target

  const source = sources.shift()
  if (source === undefined) return target

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = target[key]

      if (
        typeof sourceValue === 'object' &&
        sourceValue !== null &&
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' &&
        targetValue !== null &&
        !Array.isArray(targetValue)
      ) {
        target[key] = deepMerge(
          { ...targetValue } as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        ) as T[Extract<keyof T, string>]
      } else {
        target[key] = sourceValue as T[Extract<keyof T, string>]
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Check if an object is empty
 *
 * @param value - Value to check
 * @returns true if value is null, undefined, empty string, empty array, or empty object
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * Check if value is not empty
 */
export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value)
}

/**
 * Get nested object value safely using dot notation
 *
 * @param obj - Object to get value from
 * @param path - Dot-notation path (e.g., 'a.b.c')
 * @param defaultValue - Default value if path not found
 * @returns Value at path or default
 *
 * @example
 * ```ts
 * const obj = { a: { b: { c: 1 } } }
 * getNestedValue(obj, 'a.b.c') // 1
 * getNestedValue(obj, 'a.b.d', 'default') // 'default'
 * ```
 */
export function getNestedValue<T = unknown>(
  obj: unknown,
  path: string,
  defaultValue?: T
): T {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return defaultValue
  }, obj) as T
}

/**
 * Set nested object value safely using dot notation
 *
 * @param obj - Object to set value in
 * @param path - Dot-notation path (e.g., 'a.b.c')
 * @param value - Value to set
 * @returns The modified object
 */
export function setNestedValue<T extends Record<string, unknown>>(
  obj: T,
  path: string,
  value: unknown
): T {
  const keys = path.split('.')
  const lastKey = keys.pop()!

  let current: Record<string, unknown> = obj
  for (const key of keys) {
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[lastKey] = value
  return obj
}
