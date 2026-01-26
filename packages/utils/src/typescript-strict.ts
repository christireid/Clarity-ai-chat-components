/**
 * Enhanced TypeScript Strict Mode Utilities
 *
 * Provides comprehensive type safety utilities for TypeScript strict mode.
 * Enhances the existing validation utilities with strict mode specific helpers.
 *
 * @module @clarity-chat/utils/typescript-strict
 *
 * @example
 * ```ts
 * import {
 *   strictTypeGuard,
 *   strictAssert,
 *   StrictValidation,
 *   validateStrictUnion,
 *   strictEnum,
 *   strictPropertyAccess
 * } from '@clarity-chat/utils/typescript-strict'
 *
 * // Strict type guard
 * const user = strictTypeGuard(data, isUser, 'Expected User object');
 *
 * // Strict assertion
 * strictAssert(condition, 'Value must be truthy');
 *
 * // Strict union validation
 * const result = validateStrictUnion(value, [isString, isNumber]);
 * ```
 */

// ============================================================================
// Core Strict Types
// ============================================================================

/**
 * Strict validation result types
 */
export interface StrictValidationSuccess<T> {
  success: true
  data: T
}

export interface StrictValidationError {
  success: false
  errors: string[]
}

export type StrictValidation<T> =
  | StrictValidationSuccess<T>
  | StrictValidationError

/**
 * Strict type guard function type
 */
export type StrictTypeGuard<T> = (value: unknown) => value is T

/**
 * Strict assertion function type
 */
export type StrictAssertion<T = unknown> = (
  value: T,
  message?: string
) => asserts value is T

// ============================================================================
// Enhanced Type Guards (Strict Mode)
// ============================================================================

/**
 * Enhanced string type guard with strict validation
 */
export function isStrictString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Enhanced number type guard with strict validation (excludes NaN)
 */
export function isStrictNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

/**
 * Enhanced boolean type guard
 */
export function isStrictBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Enhanced function type guard
 */
export function isStrictFunction<
  T extends (...args: any[]) => any = (...args: any[]) => any,
>(value: unknown): value is T {
  return typeof value === 'function'
}

/**
 * Enhanced object type guard (excludes null and arrays)
 */
export function isStrictObject(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Enhanced array type guard
 */
export function isStrictArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}

/**
 * Enhanced array type guard with element validation
 */
export function isStrictArrayOf<T>(
  value: unknown,
  guard: StrictTypeGuard<T>
): value is T[] {
  return Array.isArray(value) && value.every(guard)
}

/**
 * Enhanced null type guard
 */
export function isStrictNull(value: unknown): value is null {
  return value === null
}

/**
 * Enhanced undefined type guard
 */
export function isStrictUndefined(value: unknown): value is undefined {
  return value === undefined
}

/**
 * Enhanced null or undefined type guard
 */
export function isStrictNullish(value: unknown): value is null | undefined {
  return value == null
}

/**
 * Enhanced defined type guard (excludes null and undefined)
 */
export function isStrictDefined<T>(value: T | null | undefined): value is T {
  return value != null
}

/**
 * Enhanced non-empty string type guard
 */
export function isStrictNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Enhanced non-empty array type guard
 */
export function isStrictNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0
}

/**
 * Enhanced valid date type guard
 */
export function isStrictValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * Enhanced promise type guard
 */
export function isStrictPromise<T = unknown>(
  value: unknown
): value is Promise<T> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Promise<T>).then === 'function'
  )
}

/**
 * Enhanced error type guard
 */
export function isStrictError(value: unknown): value is Error {
  return value instanceof Error
}

// ============================================================================
// Strict Assertion Functions
// ============================================================================

/**
 * Enhanced assertion that throws TypeError with detailed message
 */
export function strictAssertDefined<T>(
  value: T | null | undefined,
  message = 'Value must be defined'
): asserts value is T {
  if (isStrictNullish(value)) {
    throw new TypeError(message)
  }
}

/**
 * Enhanced string assertion
 */
export function strictAssertString(
  value: unknown,
  message = 'Value must be a string'
): asserts value is string {
  if (!isStrictString(value)) {
    throw new TypeError(`${message}. Got: ${typeof value}`)
  }
}

/**
 * Enhanced number assertion
 */
export function strictAssertNumber(
  value: unknown,
  message = 'Value must be a number'
): asserts value is number {
  if (!isStrictNumber(value)) {
    throw new TypeError(`${message}. Got: ${typeof value}`)
  }
}

/**
 * Enhanced boolean assertion
 */
export function strictAssertBoolean(
  value: unknown,
  message = 'Value must be a boolean'
): asserts value is boolean {
  if (!isStrictBoolean(value)) {
    throw new TypeError(`${message}. Got: ${typeof value}`)
  }
}

/**
 * Enhanced object assertion
 */
export function strictAssertObject(
  value: unknown,
  message = 'Value must be an object'
): asserts value is Record<string, unknown> {
  if (!isStrictObject(value)) {
    throw new TypeError(`${message}. Got: ${typeof value}`)
  }
}

/**
 * Enhanced array assertion
 */
export function strictAssertArray(
  value: unknown,
  message = 'Value must be an array'
): asserts value is unknown[] {
  if (!isStrictArray(value)) {
    throw new TypeError(`${message}. Got: ${typeof value}`)
  }
}

/**
 * Enhanced function assertion
 */
export function strictAssertFunction(
  value: unknown,
  message = 'Value must be a function'
): asserts value is (...args: any[]) => any {
  if (!isStrictFunction(value)) {
    throw new TypeError(`${message}. Got: ${typeof value}`)
  }
}

/**
 * Enhanced condition assertion
 */
export function strictAssert(
  condition: boolean,
  message = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new TypeError(message)
  }
}

/**
 * Enhanced exhaustive check assertion for TypeScript
 */
export function strictAssertNever(value: never, message?: string): never {
  const errorMessage = message ?? `Unexpected value: ${JSON.stringify(value)}`
  if (process.env.NODE_ENV === 'development') {
    console.error('Exhaustive check failed', { value, message: errorMessage })
  }
  throw new TypeError(errorMessage)
}

// ============================================================================
// Strict Validation Functions
// ============================================================================

/**
 * Enhanced string validation with strict checking
 */
export interface StrictStringValidationOptions {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  required?: boolean
  allowEmpty?: boolean
  trim?: boolean
}

export function validateStrictString(
  value: unknown,
  options: StrictStringValidationOptions = {}
): StrictValidation<string> {
  const {
    minLength,
    maxLength,
    pattern,
    required = true,
    allowEmpty = false,
    trim = true,
  } = options

  if (isStrictNullish(value)) {
    if (!required) {
      return { success: true, data: '' }
    }
    return { success: false, errors: ['Value is required'] }
  }

  if (!isStrictString(value)) {
    return { success: false, errors: [`Expected string, got ${typeof value}`] }
  }

  const errors: string[] = []
  const processedValue = trim ? value.trim() : value

  if (!allowEmpty && processedValue.length === 0) {
    errors.push('String cannot be empty')
  }

  if (minLength !== undefined && processedValue.length < minLength) {
    errors.push(`String must be at least ${minLength} characters long`)
  }

  if (maxLength !== undefined && processedValue.length > maxLength) {
    errors.push(`String must be at most ${maxLength} characters long`)
  }

  if (pattern && !pattern.test(processedValue)) {
    errors.push('String does not match required pattern')
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: processedValue }
}

/**
 * Enhanced number validation with strict checking
 */
export interface StrictNumberValidationOptions {
  min?: number
  max?: number
  integer?: boolean
  finite?: boolean
  required?: boolean
}

export function validateStrictNumber(
  value: unknown,
  options: StrictNumberValidationOptions = {}
): StrictValidation<number> {
  const { min, max, integer, finite = true, required = true } = options

  if (isStrictNullish(value)) {
    if (!required) {
      return { success: true, data: 0 }
    }
    return { success: false, errors: ['Value is required'] }
  }

  if (!isStrictNumber(value)) {
    return { success: false, errors: [`Expected number, got ${typeof value}`] }
  }

  if (finite && !Number.isFinite(value)) {
    return { success: false, errors: ['Number must be finite'] }
  }

  const errors: string[] = []

  if (integer && !Number.isInteger(value)) {
    errors.push('Number must be an integer')
  }

  if (min !== undefined && value < min) {
    errors.push(`Number must be at least ${min}`)
  }

  if (max !== undefined && value > max) {
    errors.push(`Number must be at most ${max}`)
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: value }
}

/**
 * Enhanced array validation with strict checking
 */
export interface StrictArrayValidationOptions<T> {
  minLength?: number
  maxLength?: number
  itemValidator?: (item: unknown) => StrictValidation<T>
  required?: boolean
}

export function validateStrictArray<T>(
  value: unknown,
  options: StrictArrayValidationOptions<T> = {}
): StrictValidation<T[]> {
  const { minLength, maxLength, itemValidator, required = true } = options

  if (isStrictNullish(value)) {
    if (!required) {
      return { success: true, data: [] }
    }
    return { success: false, errors: ['Value is required'] }
  }

  if (!isStrictArray(value)) {
    return { success: false, errors: [`Expected array, got ${typeof value}`] }
  }

  const errors: string[] = []

  if (minLength !== undefined && value.length < minLength) {
    errors.push(`Array must have at least ${minLength} items`)
  }

  if (maxLength !== undefined && value.length > maxLength) {
    errors.push(`Array must have at most ${maxLength} items`)
  }

  // Validate each item if validator provided
  if (itemValidator) {
    const validItems: T[] = []
    value.forEach((item, index) => {
      const result = itemValidator(item)
      if (!result.success) {
        errors.push(`Item ${index}: ${result.errors.join(', ')}`)
      } else {
        validItems.push(result.data)
      }
    })

    if (errors.length === 0) {
      return { success: true, data: validItems }
    }
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: value as T[] }
}

// ============================================================================
// Strict Runtime Type Checking
// ============================================================================

/**
 * Enhanced runtime type checking with strict validation
 */
export function strictTypeOf<T>(
  value: unknown,
  typeGuard: StrictTypeGuard<T>,
  message?: string
): T {
  if (!typeGuard(value)) {
    const typeName = typeGuard.name || 'unknown type'
    const errorMessage = message || `Expected ${typeName}, got ${typeof value}`
    if (process.env.NODE_ENV === 'development') {
      console.error('Strict type check failed', {
        expected: typeName,
        actual: typeof value,
        value,
        message: errorMessage,
      })
    }
    throw new TypeError(errorMessage)
  }
  return value
}

/**
 * Strict union type validation
 */
export function validateStrictUnion<T extends readonly unknown[]>(
  value: unknown,
  validators: readonly [
    ...{ [K in keyof T]: (value: unknown) => StrictValidation<T[K]> },
  ]
): StrictValidation<T[number]> {
  const errors: string[] = []

  for (const validator of validators) {
    const result = validator(value)
    if (result.success) {
      return result as StrictValidation<T[number]>
    }
    errors.push(...(result as StrictValidationError).errors)
  }

  return {
    success: false,
    errors: [...new Set(errors), 'Value does not match any type in union'],
  }
}

/**
 * Strict enum validation
 */
export function validateStrictEnum<T extends string | number>(
  value: unknown,
  enumObject: Record<string, T>,
  options: {
    caseSensitive?: boolean
    required?: boolean
  } = {}
): StrictValidation<T> {
  const { caseSensitive = true, required = true } = options

  if (isStrictNullish(value)) {
    if (!required) {
      const validValues = Object.values(enumObject)
      return { success: true, data: validValues[0] }
    }
    return { success: false, errors: ['Value is required'] }
  }

  if (!isStrictString(value) && !isStrictNumber(value)) {
    return {
      success: false,
      errors: [`Expected string or number, got ${typeof value}`],
    }
  }

  const enumValues = Object.values(enumObject)
  const targetValue = caseSensitive ? value : String(value).toLowerCase()

  const validValue = enumValues.find((v) =>
    caseSensitive ? v === value : String(v).toLowerCase() === targetValue
  )

  if (validValue === undefined) {
    return {
      success: false,
      errors: [`Invalid enum value. Must be one of: ${enumValues.join(', ')}`],
    }
  }

  return { success: true, data: validValue }
}

/**
 * Strict property access with null checking
 */
export function strictPropertyAccess<
  T extends Record<string, any>,
  K extends keyof T,
>(obj: T | null | undefined, key: K, message?: string): T[K] {
  if (isStrictNull(obj)) {
    throw new TypeError(message || 'Cannot access property of null')
  }
  if (isStrictUndefined(obj)) {
    throw new TypeError(message || 'Cannot access property of undefined')
  }

  const value = obj[key]
  if (isStrictNull(value)) {
    throw new TypeError(message || `Property ${String(key)} is null`)
  }
  if (isStrictUndefined(value)) {
    throw new TypeError(message || `Property ${String(key)} is undefined`)
  }

  return value
}

/**
 * Strict array access with bounds checking
 */
export function strictArrayAccess<T>(
  array: T[],
  index: number,
  message?: string
): T {
  strictAssertNumber(index)

  if (index < 0 || index >= array.length) {
    throw new RangeError(message || `Array index ${index} out of bounds`)
  }

  return array[index]
}

/**
 * Strict date validation
 */
export function validateStrictDate(
  value: unknown,
  options: {
    min?: Date
    max?: Date
    required?: boolean
  } = {}
): StrictValidation<Date> {
  const { min, max, required = true } = options

  if (isStrictNullish(value)) {
    if (!required) {
      return { success: true, data: new Date() }
    }
    return { success: false, errors: ['Value is required'] }
  }

  let date: Date

  if (value instanceof Date) {
    date = value
  } else if (isStrictString(value) || isStrictNumber(value)) {
    date = new Date(value)
  } else {
    return {
      success: false,
      errors: [`Expected Date, string, or number, got ${typeof value}`],
    }
  }

  if (Number.isNaN(date.getTime())) {
    return { success: false, errors: ['Invalid date'] }
  }

  const errors: string[] = []

  if (min && date < min) {
    errors.push(`Date must be on or after ${min.toISOString()}`)
  }

  if (max && date > max) {
    errors.push(`Date must be on or before ${max.toISOString()}`)
  }

  return errors.length > 0
    ? { success: false, errors }
    : { success: true, data: date }
}

// ============================================================================
// Format Validation (Strict Mode)
// ============================================================================

/**
 * Strict email validation
 */
export function isStrictValidEmail(value: unknown): value is string {
  if (!isStrictString(value)) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

/**
 * Strict URL validation
 */
export function isStrictValidUrl(value: unknown): value is string {
  if (!isStrictString(value)) return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/**
 * Strict UUID validation
 */
export function isStrictValidUuid(value: unknown): value is string {
  if (!isStrictString(value)) return false
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(value)
}

/**
 * Strict JSON validation
 */
export function isStrictValidJson(value: unknown): boolean {
  if (!isStrictString(value)) return false
  try {
    JSON.parse(value)
    return true
  } catch {
    return false
  }
}

/**
 * Parse JSON with strict validation
 */
export function parseStrictJson<T = unknown>(
  jsonString: string,
  validator?: (parsed: unknown) => parsed is T
): T | null {
  try {
    const parsed = JSON.parse(jsonString)
    if (validator && !validator(parsed)) {
      return null
    }
    return parsed as T
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error('JSON parsing failed', {
        jsonString,
        error: e instanceof Error ? e.message : String(e),
      })
    }
    return null
  }
}

// ============================================================================
// Object Utilities (Strict Mode)
// ============================================================================

/**
 * Strict object key checking
 */
export function strictHasKey<T extends string>(
  obj: unknown,
  key: T
): obj is Record<T, unknown> {
  return isStrictObject(obj) && key in obj
}

/**
 * Strict object keys checking
 */
export function strictHasKeys<T extends string>(
  obj: unknown,
  keys: T[]
): obj is Record<T, unknown> {
  if (!isStrictObject(obj)) return false
  return keys.every((key) => key in obj)
}

/**
 * Strict object property picking
 */
export function strictPick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  strictAssertObject(obj)

  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

/**
 * Strict object property omitting
 */
export function strictOmit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  strictAssertObject(obj)

  const result = { ...obj } as Omit<T, K>
  for (const key of keys) {
    delete (result as T)[key]
  }
  return result
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a strict type guard for a specific type
 */
export function createStrictTypeGuard<T>(
  validator: (value: unknown) => boolean,
  typeName: string
): StrictTypeGuard<T> {
  return (value: unknown): value is T => {
    const result = validator(value)
    if (!result && process.env.NODE_ENV === 'development') {
      console.error('Strict type guard failed', {
        typeName,
        value,
        valueType: typeof value,
      })
    }
    return result
  }
}

/**
 * Combine multiple type guards with AND logic
 */
export function and<T extends readonly unknown[]>(
  ...guards: { [K in keyof T]: StrictTypeGuard<T[K]> }
): StrictTypeGuard<T[number]> {
  return (value: unknown): value is T[number] => {
    return guards.every((guard) => guard(value))
  }
}

/**
 * Combine multiple type guards with OR logic
 */
export function or<T extends readonly unknown[]>(
  ...guards: { [K in keyof T]: StrictTypeGuard<T[K]> }
): StrictTypeGuard<T[number]> {
  return (value: unknown): value is T[number] => {
    return guards.some((guard) => guard(value))
  }
}

/**
 * Negate a type guard
 */
export function not<T>(
  guard: StrictTypeGuard<T>
): StrictTypeGuard<Exclude<unknown, T>> {
  return (value: unknown): value is Exclude<unknown, T> => {
    return !guard(value)
  }
}

/**
 * Create an optional type guard
 */
export function optional<T>(
  guard: StrictTypeGuard<T>
): StrictTypeGuard<T | null | undefined> {
  return (value: unknown): value is T | null | undefined => {
    return isStrictNullish(value) || guard(value)
  }
}

/**
 * Create an array type guard
 */
export function arrayOf<T>(guard: StrictTypeGuard<T>): StrictTypeGuard<T[]> {
  return (value: unknown): value is T[] => {
    return isStrictArray(value) && value.every(guard)
  }
}

/**
 * Create a tuple type guard
 */
export function tuple<T extends readonly unknown[]>(
  ...guards: { [K in keyof T]: StrictTypeGuard<T[K]> }
): StrictTypeGuard<T> {
  return (value: unknown): value is T => {
    if (!isStrictArray(value)) return false
    if (value.length !== guards.length) return false

    return guards.every((guard, index) => guard(value[index]))
  }
}

/**
 * Create a record type guard
 */
export function record<T>(
  valueGuard: StrictTypeGuard<T>
): StrictTypeGuard<Record<string, T>> {
  return (value: unknown): value is Record<string, T> => {
    if (!isStrictObject(value)) return false

    return Object.values(value).every(valueGuard)
  }
}

/**
 * Performance measurement with strict typing
 */
export function strictMeasurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()

  if (process.env.NODE_ENV === 'development') {
    console.log('Strict performance measurement', {
      name,
      duration: end - start,
      functionName: fn.name || 'anonymous',
      timestamp: new Date().toISOString(),
    })
  }

  return result
}
