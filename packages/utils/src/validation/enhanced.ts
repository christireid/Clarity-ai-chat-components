import { logger } from '@clarity-chat/utils/logger';
/**
 * Enhanced Validation Utilities
 * 
 * Merges strict TypeScript validation with comprehensive runtime validation
 * Addresses the duplication between /apps/docs/lib/typescript/strict.ts and /packages/utils/src/validation/index.ts
 * 
 * @module @clarity-chat/utils/validation/enhanced
 * 
 * @example
 * ```ts
 * import {
 *   isString,
 *   validateString,
 *   assertString,
 *   strictTypeOf
 * } from '@clarity-chat/utils/validation/enhanced'
 * 
 * // Type guards
 * if (isString(value)) {
 *   // value is narrowed to string
 * }
 * 
 * // Validation with detailed errors
 * const result = validateString(value, { minLength: 5, maxLength: 100 })
 * if (!result.success) {
 *   console.error(result.errors)
 * }
 * 
 * // Assertions
 * assertString(value, 'Value must be a string')
 * 
 * // Strict runtime type checking
 * const str = strictTypeOf(value, isString, 'Expected string')
 * ```
 */

import { error } from '../logger';

// ============================================================================
// Type Guards (from existing validation/index.ts)
// ============================================================================

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number (not NaN)
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is a function
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Check if value is an object (not null, not array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if value is a non-null array of a specific type
 */
export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

/**
 * Check if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Check if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Check if value is null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value == null;
}

/**
 * Check if value is defined (not null and not undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value != null;
}

/**
 * Check if value is nullish (null or undefined)
 */
export function isNullish(value: unknown): value is null | undefined {
  return value == null;
}

/**
 * Check if value is a non-empty array
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Check if value is a valid date
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if value is a promise
 */
export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise || (isObject(value) && typeof (value as any).then === 'function');
}

/**
 * Check if value is an error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

// ============================================================================
// Strict Validation Types (from strict.ts)
// ============================================================================

export interface StrictValidationResult<T> {
  success: true;
  data: T;
}

export interface StrictValidationError {
  success: false;
  errors: string[];
}

export type StrictValidation<T> = StrictValidationResult<T> | StrictValidationError;

// ============================================================================
// Enhanced Validation Functions
// ============================================================================

export interface StringValidationOptions {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  allowEmpty?: boolean;
}

/**
 * Enhanced string validation with detailed error reporting
 */
export function validateString(
  value: unknown,
  options: StringValidationOptions = {}
): StrictValidation<string> {
  const { minLength, maxLength, pattern, required = true, allowEmpty = false } = options;
  const errors: string[] = [];

  if (!isString(value)) {
    errors.push(`Expected string, got ${typeof value}`);
    return { success: false, errors };
  }

  if (required && !allowEmpty && value.length === 0) {
    errors.push('String cannot be empty');
  }

  if (minLength !== undefined && value.length < minLength) {
    errors.push(`String must be at least ${minLength} characters long`);
  }

  if (maxLength !== undefined && value.length > maxLength) {
    errors.push(`String length ${value.length} exceeds maximum ${maxLength}`);
  }

  if (pattern && !pattern.test(value)) {
    errors.push(`String does not match required pattern`);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: value };
}

export interface NumberValidationOptions {
  min?: number;
  max?: number;
  integer?: boolean;
  required?: boolean;
}

/**
 * Enhanced number validation with detailed error reporting
 */
export function validateNumber(
  value: unknown,
  options: NumberValidationOptions = {}
): StrictValidation<number> {
  const { min, max, integer, required = true } = options;
  const errors: string[] = [];

  if (!isNumber(value)) {
    if (required || value != null) {
      errors.push(`Expected number, got ${typeof value}`);
      return { success: false, errors };
    }
    return { success: true, data: 0 };
  }

  if (integer && !Number.isInteger(value)) {
    errors.push('Number must be an integer');
  }

  if (min !== undefined && value < min) {
    errors.push(`Number ${value} is less than minimum ${min}`);
  }

  if (max !== undefined && value > max) {
    errors.push(`Number ${value} exceeds maximum ${max}`);
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: value };
}

/**
 * Enhanced array validation
 */
export function validateArray<T>(
  value: unknown,
  itemValidator: (item: unknown) => item is T,
  options: { minLength?: number; maxLength?: number; required?: boolean } = {}
): StrictValidation<T[]> {
  const { minLength, maxLength, required = true } = options;
  const errors: string[] = [];

  if (!isArray(value)) {
    if (required || value != null) {
      errors.push(`Expected array, got ${typeof value}`);
      return { success: false, errors };
    }
    return { success: true, data: [] };
  }

  if (minLength !== undefined && value.length < minLength) {
    errors.push(`Array must have at least ${minLength} items`);
  }

  if (maxLength !== undefined && value.length > maxLength) {
    errors.push(`Array length ${value.length} exceeds maximum ${maxLength}`);
  }

  // Validate array items
  const validItems: T[] = [];
  for (let i = 0; i < value.length; i++) {
    if (itemValidator(value[i])) {
      validItems.push(value[i] as T);
    } else {
      errors.push(`Item at index ${i} is invalid`);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: validItems };
}

// ============================================================================
// Assertion Functions (from strict.ts)
// ============================================================================

/**
 * Assert that value is a string
 */
export function assertString(value: unknown, message?: string): asserts value is string {
  if (!isString(value)) {
    throw new TypeError(message || `Expected string, got ${typeof value}`);
  }
}

/**
 * Assert that value is a number
 */
export function assertNumber(value: unknown, message?: string): asserts value is number {
  if (!isNumber(value)) {
    throw new TypeError(message || `Expected number, got ${typeof value}`);
  }
}

/**
 * Assert that value is a boolean
 */
export function assertBoolean(value: unknown, message?: string): asserts value is boolean {
  if (!isBoolean(value)) {
    throw new TypeError(message || `Expected boolean, got ${typeof value}`);
  }
}

/**
 * Assert that value is an object
 */
export function assertObject(value: unknown, message?: string): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new TypeError(message || `Expected object, got ${typeof value}`);
  }
}

/**
 * Assert that value is an array
 */
export function assertArray(value: unknown, message?: string): asserts value is unknown[] {
  if (!isArray(value)) {
    throw new TypeError(message || `Expected array, got ${typeof value}`);
  }
}

/**
 * Assert that value is a function
 */
export function assertFunction(value: unknown, message?: string): asserts value is Function {
  if (!isFunction(value)) {
    throw new TypeError(message || `Expected function, got ${typeof value}`);
  }
}

/**
 * Assert that value is not null
 */
export function assertNonNull<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (isNull(value)) {
    throw new TypeError(message || 'Expected non-null value, got null');
  }
}

/**
 * Assert that value is not undefined
 */
export function assertNonUndefined<T>(
  value: T,
  message?: string
): asserts value is T extends undefined ? never : T {
  if (isUndefined(value)) {
    throw new TypeError(message || 'Expected defined value, got undefined');
  }
}

/**
 * Assert that value is defined (not null and not undefined)
 */
export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (isNullOrUndefined(value)) {
    throw new TypeError(message || 'Expected defined value, got null or undefined');
  }
}

// ============================================================================
// Strict Runtime Type Checking
// ============================================================================

/**
 * Strict runtime type checking with detailed error messages
 * Combines type guard with assertion for safe runtime validation
 */
export function strictTypeOf<T>(
  value: unknown,
  typeGuard: (value: unknown) => value is T,
  message?: string
): T {
  if (!typeGuard(value)) {
    const typeName = typeGuard.name || 'unknown type';
    throw new TypeError(message || `Expected ${typeName}, got ${typeof value}`);
  }
  return value;
}

/**
 * Validate union types with strict checking
 */
export function validateUnion<T extends readonly unknown[]>(
  value: unknown,
  validators: readonly [...{ [K in keyof T]: (value: unknown) => value is T[K] }]
): StrictValidation<T[number]> {
  const errors: string[] = [];

  for (const validator of validators) {
    try {
      if (validator(value)) {
        return { success: true, data: value as T[number] };
      }
    } catch (error) {
      errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return {
    success: false,
    errors: [...errors, `Value does not match any type in union`]
  };
}

/**
 * Validate enum values with strict checking
 */
export function validateEnum<T extends string | number>(
  value: unknown,
  enumObject: Record<string, T>
): StrictValidation<T> {
  const validValues = Object.values(enumObject) as T[];
  
  if (!validValues.includes(value as T)) {
    return {
      success: false,
      errors: [`Value must be one of: ${validValues.join(', ')}`]
    };
  }

  return { success: true, data: value as T };
}

/**
 * Strict date validation
 */
export function validateDate(value: unknown, options: { required?: boolean } = {}): StrictValidation<Date> {
  const { required = true } = options;
  
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    if (required || value != null) {
      return {
        success: false,
        errors: ['Expected valid Date object']
      };
    }
    return { success: true, data: new Date() };
  }

  return { success: true, data: value };
}

// ============================================================================
// Format Validation
// ============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: unknown): email is string {
  if (!isString(email)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: unknown): url is string {
  if (!isString(url)) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate UUID format
 */
export function isValidUuid(uuid: unknown): uuid is string {
  if (!isString(uuid)) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Alias for backward compatibility
export const isValidUUID = isValidUuid;

/**
 * Validate JSON format
 */
export function isValidJson(jsonString: unknown): boolean {
  if (!isString(jsonString)) return false;
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse JSON with validation
 */
export function parseJson<T = unknown>(
  jsonString: string,
  validator?: (parsed: unknown) => parsed is T
): StrictValidation<T> {
  try {
    const parsed = JSON.parse(jsonString);
    if (validator && !validator(parsed)) {
      return { success: false, errors: ['Parsed JSON does not match expected format'] };
    }
    return { success: true, data: parsed as T };
  } catch (parseError) {
    logger.error('JSON parsing failed', { jsonString, error: parseError instanceof Error ? parseError.message : String(parseError) });
    return { success: false, errors: [parseError instanceof Error ? parseError.message : 'Invalid JSON'] };
  }
}

// Aliases for backward compatibility
export const isValidJSON = isValidJson;

/**
 * Backward-compatible parseJSON function that returns { success, data, error }
 */
export function parseJSON<T = unknown>(
  jsonString: string,
  validator?: (parsed: unknown) => parsed is T
): { success: boolean; data?: T; error?: Error } {
  const result = parseJson(jsonString, validator);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: new Error(result.errors.join(', ')) };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if object has a specific key
 */
export function hasKey<T extends string>(
  obj: unknown,
  key: T
): obj is Record<T, unknown> {
  return isObject(obj) && key in obj;
}

/**
 * Check if object has all specified keys
 */
export function hasKeys<T extends string>(
  obj: unknown,
  keys: T[]
): obj is Record<T, unknown> {
  if (!isObject(obj)) {
    return false;
  }
  return keys.every(key => key in obj);
}

/**
 * Pick specific properties from an object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific properties from an object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

/**
 * Strict property access with null checking
 */
export function strictProperty<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
  message?: string
): T[K] {
  assertObject(obj, message || 'Expected object');
  if (!(key in obj)) {
    throw new TypeError(`Property '${String(key)}' does not exist on object`);
  }
  return obj[key];
}

/**
 * Strict array access with bounds checking
 */
export function strictArrayAccess<T>(
  array: T[],
  index: number,
  message?: string
): T {
  assertArray(array, 'Expected array');
  if (index < 0 || index >= array.length) {
    throw new RangeError(message || `Index ${index} is out of bounds`);
  }
  return array[index];
}

/**
 * Assert that condition is never true (exhaustive checking)
 */
export function assertNever(value: never, message?: string): never {
  throw new TypeError(message || `Unexpected value: ${JSON.stringify(value)}`);
}

// Re-export everything from the original validation module
export * from './index';