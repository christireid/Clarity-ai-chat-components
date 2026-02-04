/**
 * Math Utilities
 *
 * Common mathematical operations and utilities.
 * These are the canonical implementations used across all Clarity Chat packages.
 *
 * @module @clarity-chat/utils/math
 *
 * @example
 * ```ts
 * import { clamp } from '@clarity-chat/utils/math'
 *
 * clamp(15, 0, 10) // 10
 * clamp(-5, 0, 10) // 0
 * clamp(5, 0, 10)  // 5
 * ```
 */

/**
 * Clamp a number between min and max values
 *
 * Ensures a value stays within a specified range. Handles edge cases
 * like NaN and Infinity by returning the minimum value.
 *
 * @param value - The value to clamp
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns The clamped value within [min, max]
 *
 * @example
 * ```ts
 * clamp(15, 0, 10)  // 10 (clamped to max)
 * clamp(-5, 0, 10)  // 0 (clamped to min)
 * clamp(5, 0, 10)   // 5 (within range)
 * clamp(NaN, 0, 10) // 0 (invalid returns min)
 * clamp(Infinity, 0, 10) // 0 (invalid returns min)
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  // Handle invalid values (NaN, Infinity) by returning min
  if (!Number.isFinite(value)) return min

  // Clamp value to [min, max] range
  return Math.max(min, Math.min(max, value))
}
