/**
 * Internal Type Assertions and Guards
 *
 * @internal
 * These utilities are for internal use only and are not part of the public API.
 * They provide type-safe runtime checks for common patterns.
 *
 * Most type guards are re-exported from @clarity-chat/utils/validation for consistency.
 */

// Re-export type guards from the canonical utils package
export {
  isDefined,
  isNonEmptyString,
  isArray,
  isFunction,
  isPromise,
} from '@clarity-chat/utils/validation'

/**
 * Asserts that a value is not null or undefined
 */
export function assertDefined<T>(
  value: T,
  message = 'Expected value to be defined'
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}

/**
 * Type guard for valid numbers (not NaN or Infinity)
 */
export function isValidNumber(value: unknown): value is number {
  return (
    typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
  )
}

/**
 * Type guard for plain objects (stricter than utils version)
 * Uses Object.prototype.toString for more reliable plain object detection
 */
export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === '[object Object]'
  )
}

/**
 * Assert that a condition is true
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
 * Assert unreachable code path (exhaustive checks)
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${JSON.stringify(value)}`)
}
