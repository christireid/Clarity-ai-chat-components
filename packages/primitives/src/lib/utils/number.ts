/**
 * Number Utilities
 * Type-safe number operations and type guards
 */

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
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
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
