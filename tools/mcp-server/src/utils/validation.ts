/**
 * Input validation utilities
 */

import { ValidationError } from './errors.js'

/**
 * Validate required parameters
 */
export function validateRequired<T extends Record<string, any>>(
  args: T,
  required: Array<keyof T>
): void {
  const missing: string[] = []
  
  for (const key of required) {
    if (args[key] === undefined || args[key] === null || args[key] === '') {
      missing.push(String(key))
    }
  }

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required parameters: ${missing.join(', ')}`,
      { missing }
    )
  }
}

/**
 * Validate enum value
 */
export function validateEnum<T extends string>(
  value: unknown,
  enumValues: readonly T[],
  paramName: string
): T {
  if (!enumValues.includes(value as T)) {
    throw new ValidationError(
      `Invalid ${paramName}: ${value}. Must be one of: ${enumValues.join(', ')}`,
      { paramName, value, allowedValues: enumValues }
    )
  }
  return value as T
}

/**
 * Validate string parameter
 */
export function validateString(
  value: unknown,
  paramName: string,
  minLength = 1
): string {
  if (typeof value !== 'string') {
    throw new ValidationError(
      `Invalid ${paramName}: must be a string`,
      { paramName, value }
    )
  }

  if (value.length < minLength) {
    throw new ValidationError(
      `Invalid ${paramName}: must be at least ${minLength} characters`,
      { paramName, value, minLength }
    )
  }

  return value
}

/**
 * Validate number parameter
 */
export function validateNumber(
  value: unknown,
  paramName: string,
  min?: number,
  max?: number
): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(
      `Invalid ${paramName}: must be a number`,
      { paramName, value }
    )
  }

  if (min !== undefined && value < min) {
    throw new ValidationError(
      `Invalid ${paramName}: must be at least ${min}`,
      { paramName, value, min }
    )
  }

  if (max !== undefined && value > max) {
    throw new ValidationError(
      `Invalid ${paramName}: must be at most ${max}`,
      { paramName, value, max }
    )
  }

  return value
}
