/**
 * Validation Utilities
 *
 * Type guards, assertions, and validation helpers.
 *
 * @module @clarity-chat/utils/validation
 *
 * @example
 * ```ts
 * import {
 *   isString,
 *   isNumber,
 *   assertDefined,
 *   isValidEmail
 * } from '@clarity-chat/utils/validation'
 *
 * if (isString(value)) {
 *   // value is narrowed to string
 * }
 *
 * assertDefined(user, 'User is required')
 * // user is now non-nullable
 * ```
 */

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Check if value is a number (not NaN)
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Check if value is a function
 */
export function isFunction(
  value: unknown
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}

/**
 * Check if value is an object (not null, not array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Check if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Check if value is a non-null array of a specific type
 */
export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard)
}

/**
 * Check if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null
}

/**
 * Check if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * Check if value is null or undefined
 */
export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Check if value is a non-empty array
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0
}

/**
 * Check if value is a valid Date object
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * Check if value is a Promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Promise<T>).then === 'function'
  )
}

/**
 * Check if value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}

// ============================================================================
// Assertions
// ============================================================================

/**
 * Assert that value is defined (not null or undefined)
 *
 * @param value - Value to check
 * @param message - Error message if assertion fails
 * @throws Error if value is null or undefined
 *
 * @example
 * ```ts
 * const user = getUser()
 * assertDefined(user, 'User not found')
 * // user is now typed as non-nullable
 * console.log(user.name)
 * ```
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value must be defined'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}

/**
 * Assert that value is a string
 */
export function assertString(
  value: unknown,
  message = 'Value must be a string'
): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(message)
  }
}

/**
 * Assert that value is a number
 */
export function assertNumber(
  value: unknown,
  message = 'Value must be a number'
): asserts value is number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError(message)
  }
}

/**
 * Assert that value is an object
 */
export function assertObject(
  value: unknown,
  message = 'Value must be an object'
): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(message)
  }
}

/**
 * Assert that value is an array
 */
export function assertArray(
  value: unknown,
  message = 'Value must be an array'
): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new TypeError(message)
  }
}

/**
 * Assert that a condition is true
 *
 * @example
 * ```ts
 * assert(user.age >= 18, 'User must be 18 or older')
 * ```
 */
export function assert(
  condition: boolean,
  message = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

/**
 * Mark code as unreachable (exhaustive check helper)
 *
 * @example
 * ```ts
 * type Status = 'pending' | 'active' | 'complete'
 *
 * function handleStatus(status: Status) {
 *   switch (status) {
 *     case 'pending': return 'Waiting...'
 *     case 'active': return 'In progress'
 *     case 'complete': return 'Done!'
 *     default:
 *       assertNever(status) // TypeScript error if a case is missing
 *   }
 * }
 * ```
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${value}`)
}

// ============================================================================
// Format Validators
// ============================================================================

/**
 * Check if string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  // Simple email regex - covers most cases without being overly complex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Check if string is a valid UUID (v4)
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Check if string is valid JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * Parse JSON safely with type guard
 *
 * @example
 * ```ts
 * const result = parseJSON<User>(jsonString)
 * if (result.success) {
 *   console.log(result.data.name)
 * } else {
 *   console.error(result.error)
 * }
 * ```
 */
export function parseJSON<T>(
  str: string
): { success: true; data: T } | { success: false; error: Error } {
  try {
    const data = JSON.parse(str) as T
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

// ============================================================================
// Object Utilities
// ============================================================================

/**
 * Check if object has a specific key
 */
export function hasKey<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return isObject(obj) && key in obj
}

/**
 * Check if object has all specified keys
 */
export function hasKeys<K extends string>(
  obj: unknown,
  keys: K[]
): obj is Record<K, unknown> {
  if (!isObject(obj)) return false
  return keys.every((key) => key in obj)
}

/**
 * Pick specific keys from an object
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
 * Omit specific keys from an object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj } as Omit<T, K>
  for (const key of keys) {
    delete (result as T)[key]
  }
  return result
}
