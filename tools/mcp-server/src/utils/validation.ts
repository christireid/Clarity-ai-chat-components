/**
 * Input validation utilities
 *
 * Delegates primitive validation to @clarity-chat/utils
 * while providing MCP-specific validation helpers
 */

import {
  isString,
  isNumber,
  validateString as utilsValidateString,
  validateNumber as utilsValidateNumber,
} from '@clarity-chat/utils/validation'
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
 * Uses @clarity-chat/utils for primitive validation
 */
export function validateString(
  value: unknown,
  paramName: string,
  minLength = 1
): string {
  if (!isString(value)) {
    throw new ValidationError(
      `Invalid ${paramName}: must be a string`,
      { paramName, value }
    )
  }

  const result = utilsValidateString(value, { minLength, required: true })
  if (!result.success) {
    throw new ValidationError(
      `Invalid ${paramName}: ${result.errors.join(', ')}`,
      { paramName, value, minLength }
    )
  }

  return result.data
}

/**
 * Validate number parameter
 * Uses @clarity-chat/utils for primitive validation
 */
export function validateNumber(
  value: unknown,
  paramName: string,
  min?: number,
  max?: number
): number {
  if (!isNumber(value)) {
    throw new ValidationError(
      `Invalid ${paramName}: must be a number`,
      { paramName, value }
    )
  }

  const result = utilsValidateNumber(value, { min, max, required: true })
  if (!result.success) {
    throw new ValidationError(
      `Invalid ${paramName}: ${result.errors.join(', ')}`,
      { paramName, value, min, max }
    )
  }

  return result.data
}
