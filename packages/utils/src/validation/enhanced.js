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
// ============================================================================
// Type Guards (from existing validation/index.ts)
// ============================================================================
/**
 * Check if value is a string
 */
export function isString(value) {
    return typeof value === 'string';
}
/**
 * Check if value is a number (not NaN)
 */
export function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
/**
 * Check if value is a boolean
 */
export function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Check if value is a function
 */
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Check if value is an object (not null, not array)
 */
export function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Check if value is an array
 */
export function isArray(value) {
    return Array.isArray(value);
}
/**
 * Check if value is a non-null array of a specific type
 */
export function isArrayOf(value, guard) {
    return Array.isArray(value) && value.every(guard);
}
/**
 * Check if value is null
 */
export function isNull(value) {
    return value === null;
}
/**
 * Check if value is undefined
 */
export function isUndefined(value) {
    return value === undefined;
}
/**
 * Check if value is null or undefined
 */
export function isNullOrUndefined(value) {
    return value == null;
}
/**
 * Check if value is defined (not null and not undefined)
 */
export function isDefined(value) {
    return value != null;
}
/**
 * Check if value is nullish (null or undefined)
 */
export function isNullish(value) {
    return value == null;
}
/**
 * Check if value is a non-empty array
 */
export function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
/**
 * Check if value is a valid date
 */
export function isValidDate(value) {
    return value instanceof Date && !isNaN(value.getTime());
}
/**
 * Check if value is a promise
 */
export function isPromise(value) {
    return (value instanceof Promise ||
        (isObject(value) && typeof value.then === 'function'));
}
/**
 * Check if value is an error
 */
export function isError(value) {
    return value instanceof Error;
}
/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}
/**
 * Enhanced string validation with detailed error reporting
 */
export function validateString(value, options = {}) {
    const { minLength, maxLength, pattern, required = true, allowEmpty = false, } = options;
    const errors = [];
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
/**
 * Enhanced number validation with detailed error reporting
 */
export function validateNumber(value, options = {}) {
    const { min, max, integer, required = true } = options;
    const errors = [];
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
export function validateArray(value, itemValidator, options = {}) {
    const { minLength, maxLength, required = true } = options;
    const errors = [];
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
    const validItems = [];
    for (let i = 0; i < value.length; i++) {
        if (itemValidator(value[i])) {
            validItems.push(value[i]);
        }
        else {
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
export function assertString(value, message) {
    if (!isString(value)) {
        throw new TypeError(message || `Expected string, got ${typeof value}`);
    }
}
/**
 * Assert that value is a number
 */
export function assertNumber(value, message) {
    if (!isNumber(value)) {
        throw new TypeError(message || `Expected number, got ${typeof value}`);
    }
}
/**
 * Assert that value is a boolean
 */
export function assertBoolean(value, message) {
    if (!isBoolean(value)) {
        throw new TypeError(message || `Expected boolean, got ${typeof value}`);
    }
}
/**
 * Assert that value is an object
 */
export function assertObject(value, message) {
    if (!isObject(value)) {
        throw new TypeError(message || `Expected object, got ${typeof value}`);
    }
}
/**
 * Assert that value is an array
 */
export function assertArray(value, message) {
    if (!isArray(value)) {
        throw new TypeError(message || `Expected array, got ${typeof value}`);
    }
}
/**
 * Assert that value is a function
 */
export function assertFunction(value, message) {
    if (!isFunction(value)) {
        throw new TypeError(message || `Expected function, got ${typeof value}`);
    }
}
/**
 * Assert that value is not null
 */
export function assertNonNull(value, message) {
    if (isNull(value)) {
        throw new TypeError(message || 'Expected non-null value, got null');
    }
}
/**
 * Assert that value is not undefined
 */
export function assertNonUndefined(value, message) {
    if (isUndefined(value)) {
        throw new TypeError(message || 'Expected defined value, got undefined');
    }
}
/**
 * Assert that value is defined (not null and not undefined)
 */
export function assertDefined(value, message) {
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
export function strictTypeOf(value, typeGuard, message) {
    if (!typeGuard(value)) {
        const typeName = typeGuard.name || 'unknown type';
        throw new TypeError(message || `Expected ${typeName}, got ${typeof value}`);
    }
    return value;
}
/**
 * Validate union types with strict checking
 */
export function validateUnion(value, validators) {
    const errors = [];
    for (const validator of validators) {
        try {
            if (validator(value)) {
                return { success: true, data: value };
            }
        }
        catch (error) {
            errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    return {
        success: false,
        errors: [...errors, `Value does not match any type in union`],
    };
}
/**
 * Validate enum values with strict checking
 */
export function validateEnum(value, enumObject) {
    const validValues = Object.values(enumObject);
    if (!validValues.includes(value)) {
        return {
            success: false,
            errors: [`Value must be one of: ${validValues.join(', ')}`],
        };
    }
    return { success: true, data: value };
}
/**
 * Strict date validation
 */
export function validateDate(value, options = {}) {
    const { required = true } = options;
    if (!(value instanceof Date) || isNaN(value.getTime())) {
        if (required || value != null) {
            return {
                success: false,
                errors: ['Expected valid Date object'],
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
export function isValidEmail(email) {
    if (!isString(email))
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validate URL format
 */
export function isValidUrl(url) {
    if (!isString(url))
        return false;
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Validate UUID format
 */
export function isValidUuid(uuid) {
    if (!isString(uuid))
        return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}
// Alias for backward compatibility
export const isValidUUID = isValidUuid;
/**
 * Validate JSON format
 */
export function isValidJson(jsonString) {
    if (!isString(jsonString))
        return false;
    try {
        JSON.parse(jsonString);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Parse JSON with validation
 */
export function parseJson(jsonString, validator) {
    try {
        const parsed = JSON.parse(jsonString);
        if (validator && !validator(parsed)) {
            return {
                success: false,
                errors: ['Parsed JSON does not match expected format'],
            };
        }
        return { success: true, data: parsed };
    }
    catch (parseError) {
        console.error('JSON parsing failed', {
            jsonString,
            error: parseError instanceof Error ? parseError.message : String(parseError),
        });
        return {
            success: false,
            errors: [
                parseError instanceof Error ? parseError.message : 'Invalid JSON',
            ],
        };
    }
}
// Aliases for backward compatibility
export const isValidJSON = isValidJson;
/**
 * Backward-compatible parseJSON function that returns { success, data, error }
 */
export function parseJSON(jsonString, validator) {
    const result = parseJson(jsonString, validator);
    if (result.success) {
        return { success: true, data: result.data };
    }
    else {
        return { success: false, error: new Error(result.errors.join(', ')) };
    }
}
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Check if object has a specific key
 */
export function hasKey(obj, key) {
    return isObject(obj) && key in obj;
}
/**
 * Check if object has all specified keys
 */
export function hasKeys(obj, keys) {
    if (!isObject(obj)) {
        return false;
    }
    return keys.every((key) => key in obj);
}
/**
 * Pick specific properties from an object
 */
export function pick(obj, keys) {
    const result = {};
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
export function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
/**
 * Strict property access with null checking
 */
export function strictProperty(obj, key, message) {
    assertObject(obj, message || 'Expected object');
    if (!(key in obj)) {
        throw new TypeError(`Property '${String(key)}' does not exist on object`);
    }
    return obj[key];
}
/**
 * Strict array access with bounds checking
 */
export function strictArrayAccess(array, index, message) {
    assertArray(array, 'Expected array');
    if (index < 0 || index >= array.length) {
        throw new RangeError(message || `Index ${index} is out of bounds`);
    }
    return array[index];
}
/**
 * Assert that condition is never true (exhaustive checking)
 */
export function assertNever(value, message) {
    throw new TypeError(message || `Unexpected value: ${JSON.stringify(value)}`);
}
// Re-export everything from the original validation module
export * from './index';
//# sourceMappingURL=enhanced.js.map