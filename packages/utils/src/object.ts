/**
 * Object Utilities
 *
 * Deep merge and other object manipulation utilities.
 *
 * @packageDocumentation
 *
 * @example
 * ```ts
 * import { deepMerge } from '@clarity-chat/utils/object'
 *
 * const merged = deepMerge({ a: { b: 1 } }, { a: { c: 2 } })
 * // => { a: { b: 1, c: 2 } }
 * ```
 */

/**
 * Deep merge objects. Recursively merges properties from source objects into
 * the target. Arrays are replaced (not concatenated). Only plain objects are
 * recursively merged; class instances, arrays, and other non-plain objects
 * are assigned directly.
 *
 * @param target - The target object to merge into
 * @param sources - One or more source objects to merge from
 * @returns The merged target object
 *
 * @example
 * ```ts
 * deepMerge({ a: 1 }, { b: 2 })
 * // => { a: 1, b: 2 }
 *
 * deepMerge({ a: { b: 1 } }, { a: { c: 2 } })
 * // => { a: { b: 1, c: 2 } }
 *
 * deepMerge({ a: 1 }, { a: 2 }, { a: 3 })
 * // => { a: 3 }
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
