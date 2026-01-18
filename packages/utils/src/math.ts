/**
 * Math Utilities
 *
 * Common mathematical operations used across Clarity Chat packages.
 *
 * @module @clarity-chat/utils/math
 *
 * @example
 * ```ts
 * import { clamp, calculatePercentage, lerp, round } from '@clarity-chat/utils/math'
 *
 * clamp(150, 0, 100) // 100
 * calculatePercentage(75, 200) // 37.5
 * lerp(0, 100, 0.5) // 50
 * round(3.14159, 2) // 3.14
 * ```
 */

/**
 * Clamp a number between a minimum and maximum value
 *
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 *
 * @example
 * ```ts
 * clamp(150, 0, 100) // 100
 * clamp(-10, 0, 100) // 0
 * clamp(50, 0, 100) // 50
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate a percentage
 *
 * @param part - The part value
 * @param total - The total value
 * @param decimals - Number of decimal places (default: 2)
 * @returns The percentage value
 *
 * @example
 * ```ts
 * calculatePercentage(25, 100) // 25
 * calculatePercentage(1, 3) // 33.33
 * calculatePercentage(1, 3, 0) // 33
 * calculatePercentage(0, 0) // 0 (safe division)
 * ```
 */
export function calculatePercentage(
  part: number,
  total: number,
  decimals = 2
): number {
  if (total === 0) return 0
  const percentage = (part / total) * 100
  return decimals === 0
    ? Math.round(percentage)
    : parseFloat(percentage.toFixed(decimals))
}

/**
 * Linear interpolation between two values
 *
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 * @returns The interpolated value
 *
 * @example
 * ```ts
 * lerp(0, 100, 0) // 0
 * lerp(0, 100, 0.5) // 50
 * lerp(0, 100, 1) // 100
 * lerp(0, 100, 0.25) // 25
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * Inverse linear interpolation - find t given value
 *
 * @param start - Start value
 * @param end - End value
 * @param value - The value to find t for
 * @returns The interpolation factor (0-1)
 *
 * @example
 * ```ts
 * inverseLerp(0, 100, 50) // 0.5
 * inverseLerp(0, 100, 25) // 0.25
 * inverseLerp(0, 100, 0) // 0
 * ```
 */
export function inverseLerp(start: number, end: number, value: number): number {
  if (start === end) return 0
  return (value - start) / (end - start)
}

/**
 * Round a number to a specified number of decimal places
 *
 * @param value - The value to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns The rounded value
 *
 * @example
 * ```ts
 * round(3.14159) // 3
 * round(3.14159, 2) // 3.14
 * round(3.14159, 4) // 3.1416
 * ```
 */
export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}

/**
 * Map a value from one range to another
 *
 * @param value - The value to map
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns The mapped value
 *
 * @example
 * ```ts
 * mapRange(50, 0, 100, 0, 1) // 0.5
 * mapRange(5, 0, 10, 0, 100) // 50
 * mapRange(0.5, 0, 1, 0, 255) // 127.5
 * ```
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Check if a number is within a range (inclusive)
 *
 * @param value - The value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if value is within range
 *
 * @example
 * ```ts
 * inRange(50, 0, 100) // true
 * inRange(0, 0, 100) // true
 * inRange(100, 0, 100) // true
 * inRange(101, 0, 100) // false
 * ```
 */
export function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Calculate the average of an array of numbers
 *
 * @param values - Array of numbers
 * @returns The average, or 0 if empty
 *
 * @example
 * ```ts
 * average([1, 2, 3, 4, 5]) // 3
 * average([10, 20]) // 15
 * average([]) // 0
 * ```
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

/**
 * Calculate the sum of an array of numbers
 *
 * @param values - Array of numbers
 * @returns The sum
 *
 * @example
 * ```ts
 * sum([1, 2, 3, 4, 5]) // 15
 * sum([]) // 0
 * ```
 */
export function sum(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0)
}
