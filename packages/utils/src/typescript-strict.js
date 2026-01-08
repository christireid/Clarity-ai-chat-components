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
// Enhanced Type Guards (Strict Mode)
// ============================================================================
/**
 * Enhanced string type guard with strict validation
 */
export function isStrictString(value) {
    return typeof value === 'string';
}
/**
 * Enhanced number type guard with strict validation (excludes NaN)
 */
export function isStrictNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
/**
 * Enhanced boolean type guard
 */
export function isStrictBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Enhanced function type guard
 */
export function isStrictFunction(value) {
    return typeof value === 'function';
}
/**
 * Enhanced object type guard (excludes null and arrays)
 */
export function isStrictObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * Enhanced array type guard
 */
export function isStrictArray(value) {
    return Array.isArray(value);
}
/**
 * Enhanced array type guard with element validation
 */
export function isStrictArrayOf(value, guard) {
    return Array.isArray(value) && value.every(guard);
}
/**
 * Enhanced null type guard
 */
export function isStrictNull(value) {
    return value === null;
}
/**
 * Enhanced undefined type guard
 */
export function isStrictUndefined(value) {
    return value === undefined;
}
/**
 * Enhanced null or undefined type guard
 */
export function isStrictNullish(value) {
    return value == null;
}
/**
 * Enhanced defined type guard (excludes null and undefined)
 */
export function isStrictDefined(value) {
    return value != null;
}
/**
 * Enhanced non-empty string type guard
 */
export function isStrictNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}
/**
 * Enhanced non-empty array type guard
 */
export function isStrictNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}
/**
 * Enhanced valid date type guard
 */
export function isStrictValidDate(value) {
    return value instanceof Date && !Number.isNaN(value.getTime());
}
/**
 * Enhanced promise type guard
 */
export function isStrictPromise(value) {
    return (value !== null &&
        typeof value === 'object' &&
        typeof value.then === 'function');
}
/**
 * Enhanced error type guard
 */
export function isStrictError(value) {
    return value instanceof Error;
}
// ============================================================================
// Strict Assertion Functions
// ============================================================================
/**
 * Enhanced assertion that throws TypeError with detailed message
 */
export function strictAssertDefined(value, message = 'Value must be defined') {
    if (isStrictNullish(value)) {
        throw new TypeError(message);
    }
}
/**
 * Enhanced string assertion
 */
export function strictAssertString(value, message = 'Value must be a string') {
    if (!isStrictString(value)) {
        throw new TypeError(`${message}. Got: ${typeof value}`);
    }
}
/**
 * Enhanced number assertion
 */
export function strictAssertNumber(value, message = 'Value must be a number') {
    if (!isStrictNumber(value)) {
        throw new TypeError(`${message}. Got: ${typeof value}`);
    }
}
/**
 * Enhanced boolean assertion
 */
export function strictAssertBoolean(value, message = 'Value must be a boolean') {
    if (!isStrictBoolean(value)) {
        throw new TypeError(`${message}. Got: ${typeof value}`);
    }
}
/**
 * Enhanced object assertion
 */
export function strictAssertObject(value, message = 'Value must be an object') {
    if (!isStrictObject(value)) {
        throw new TypeError(`${message}. Got: ${typeof value}`);
    }
}
/**
 * Enhanced array assertion
 */
export function strictAssertArray(value, message = 'Value must be an array') {
    if (!isStrictArray(value)) {
        throw new TypeError(`${message}. Got: ${typeof value}`);
    }
}
/**
 * Enhanced function assertion
 */
export function strictAssertFunction(value, message = 'Value must be a function') {
    if (!isStrictFunction(value)) {
        throw new TypeError(`${message}. Got: ${typeof value}`);
    }
}
/**
 * Enhanced condition assertion
 */
export function strictAssert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new TypeError(message);
    }
}
/**
 * Enhanced exhaustive check assertion for TypeScript
 */
export function strictAssertNever(value, message) {
    const errorMessage = message ?? `Unexpected value: ${JSON.stringify(value)}`;
    console.error('Exhaustive check failed', { value, message: errorMessage });
    throw new TypeError(errorMessage);
}
export function validateStrictString(value, options = {}) {
    const { minLength, maxLength, pattern, required = true, allowEmpty = false, trim = true } = options;
    if (isStrictNullish(value)) {
        if (!required) {
            return { success: true, data: '' };
        }
        return { success: false, errors: ['Value is required'] };
    }
    if (!isStrictString(value)) {
        return { success: false, errors: [`Expected string, got ${typeof value}`] };
    }
    const errors = [];
    const processedValue = trim ? value.trim() : value;
    if (!allowEmpty && processedValue.length === 0) {
        errors.push('String cannot be empty');
    }
    if (minLength !== undefined && processedValue.length < minLength) {
        errors.push(`String must be at least ${minLength} characters long`);
    }
    if (maxLength !== undefined && processedValue.length > maxLength) {
        errors.push(`String must be at most ${maxLength} characters long`);
    }
    if (pattern && !pattern.test(processedValue)) {
        errors.push('String does not match required pattern');
    }
    return errors.length > 0
        ? { success: false, errors }
        : { success: true, data: processedValue };
}
export function validateStrictNumber(value, options = {}) {
    const { min, max, integer, finite = true, required = true } = options;
    if (isStrictNullish(value)) {
        if (!required) {
            return { success: true, data: 0 };
        }
        return { success: false, errors: ['Value is required'] };
    }
    if (!isStrictNumber(value)) {
        return { success: false, errors: [`Expected number, got ${typeof value}`] };
    }
    if (finite && !Number.isFinite(value)) {
        return { success: false, errors: ['Number must be finite'] };
    }
    const errors = [];
    if (integer && !Number.isInteger(value)) {
        errors.push('Number must be an integer');
    }
    if (min !== undefined && value < min) {
        errors.push(`Number must be at least ${min}`);
    }
    if (max !== undefined && value > max) {
        errors.push(`Number must be at most ${max}`);
    }
    return errors.length > 0
        ? { success: false, errors }
        : { success: true, data: value };
}
export function validateStrictArray(value, options = {}) {
    const { minLength, maxLength, itemValidator, required = true } = options;
    if (isStrictNullish(value)) {
        if (!required) {
            return { success: true, data: [] };
        }
        return { success: false, errors: ['Value is required'] };
    }
    if (!isStrictArray(value)) {
        return { success: false, errors: [`Expected array, got ${typeof value}`] };
    }
    const errors = [];
    if (minLength !== undefined && value.length < minLength) {
        errors.push(`Array must have at least ${minLength} items`);
    }
    if (maxLength !== undefined && value.length > maxLength) {
        errors.push(`Array must have at most ${maxLength} items`);
    }
    // Validate each item if validator provided
    if (itemValidator) {
        const validItems = [];
        value.forEach((item, index) => {
            const result = itemValidator(item);
            if (!result.success) {
                errors.push(`Item ${index}: ${result.errors.join(', ')}`);
            }
            else {
                validItems.push(result.data);
            }
        });
        if (errors.length === 0) {
            return { success: true, data: validItems };
        }
    }
    return errors.length > 0
        ? { success: false, errors }
        : { success: true, data: value };
}
// ============================================================================
// Strict Runtime Type Checking
// ============================================================================
/**
 * Enhanced runtime type checking with strict validation
 */
export function strictTypeOf(value, typeGuard, message) {
    if (!typeGuard(value)) {
        const typeName = typeGuard.name || 'unknown type';
        const errorMessage = message || `Expected ${typeName}, got ${typeof value}`;
        console.error('Strict type check failed', {
            expected: typeName,
            actual: typeof value,
            value,
            message: errorMessage
        });
        throw new TypeError(errorMessage);
    }
    return value;
}
/**
 * Strict union type validation
 */
export function validateStrictUnion(value, validators) {
    const errors = [];
    for (const validator of validators) {
        const result = validator(value);
        if (result.success) {
            return result;
        }
        errors.push(...result.errors);
    }
    return {
        success: false,
        errors: [...new Set(errors), 'Value does not match any type in union']
    };
}
/**
 * Strict enum validation
 */
export function validateStrictEnum(value, enumObject, options = {}) {
    const { caseSensitive = true, required = true } = options;
    if (isStrictNullish(value)) {
        if (!required) {
            const validValues = Object.values(enumObject);
            return { success: true, data: validValues[0] };
        }
        return { success: false, errors: ['Value is required'] };
    }
    if (!isStrictString(value) && !isStrictNumber(value)) {
        return { success: false, errors: [`Expected string or number, got ${typeof value}`] };
    }
    const enumValues = Object.values(enumObject);
    const targetValue = caseSensitive ? value : String(value).toLowerCase();
    const validValue = enumValues.find(v => caseSensitive ? v === value : String(v).toLowerCase() === targetValue);
    if (validValue === undefined) {
        return {
            success: false,
            errors: [`Invalid enum value. Must be one of: ${enumValues.join(', ')}`]
        };
    }
    return { success: true, data: validValue };
}
/**
 * Strict property access with null checking
 */
export function strictPropertyAccess(obj, key, message) {
    if (isStrictNull(obj)) {
        throw new TypeError(message || 'Cannot access property of null');
    }
    if (isStrictUndefined(obj)) {
        throw new TypeError(message || 'Cannot access property of undefined');
    }
    const value = obj[key];
    if (isStrictNull(value)) {
        throw new TypeError(message || `Property ${String(key)} is null`);
    }
    if (isStrictUndefined(value)) {
        throw new TypeError(message || `Property ${String(key)} is undefined`);
    }
    return value;
}
/**
 * Strict array access with bounds checking
 */
export function strictArrayAccess(array, index, message) {
    strictAssertNumber(index);
    if (index < 0 || index >= array.length) {
        throw new RangeError(message || `Array index ${index} out of bounds`);
    }
    return array[index];
}
/**
 * Strict date validation
 */
export function validateStrictDate(value, options = {}) {
    const { min, max, required = true } = options;
    if (isStrictNullish(value)) {
        if (!required) {
            return { success: true, data: new Date() };
        }
        return { success: false, errors: ['Value is required'] };
    }
    let date;
    if (value instanceof Date) {
        date = value;
    }
    else if (isStrictString(value) || isStrictNumber(value)) {
        date = new Date(value);
    }
    else {
        return { success: false, errors: [`Expected Date, string, or number, got ${typeof value}`] };
    }
    if (Number.isNaN(date.getTime())) {
        return { success: false, errors: ['Invalid date'] };
    }
    const errors = [];
    if (min && date < min) {
        errors.push(`Date must be on or after ${min.toISOString()}`);
    }
    if (max && date > max) {
        errors.push(`Date must be on or before ${max.toISOString()}`);
    }
    return errors.length > 0
        ? { success: false, errors }
        : { success: true, data: date };
}
// ============================================================================
// Format Validation (Strict Mode)
// ============================================================================
/**
 * Strict email validation
 */
export function isStrictValidEmail(value) {
    if (!isStrictString(value))
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}
/**
 * Strict URL validation
 */
export function isStrictValidUrl(value) {
    if (!isStrictString(value))
        return false;
    try {
        new URL(value);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Strict UUID validation
 */
export function isStrictValidUuid(value) {
    if (!isStrictString(value))
        return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
}
/**
 * Strict JSON validation
 */
export function isStrictValidJson(value) {
    if (!isStrictString(value))
        return false;
    try {
        JSON.parse(value);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Parse JSON with strict validation
 */
export function parseStrictJson(jsonString, validator) {
    try {
        const parsed = JSON.parse(jsonString);
        if (validator && !validator(parsed)) {
            return null;
        }
        return parsed;
    }
    catch (e) {
        console.error('JSON parsing failed', {
            jsonString,
            error: e instanceof Error ? e.message : String(e)
        });
        return null;
    }
}
// ============================================================================
// Object Utilities (Strict Mode)
// ============================================================================
/**
 * Strict object key checking
 */
export function strictHasKey(obj, key) {
    return isStrictObject(obj) && key in obj;
}
/**
 * Strict object keys checking
 */
export function strictHasKeys(obj, keys) {
    if (!isStrictObject(obj))
        return false;
    return keys.every(key => key in obj);
}
/**
 * Strict object property picking
 */
export function strictPick(obj, keys) {
    strictAssertObject(obj);
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
/**
 * Strict object property omitting
 */
export function strictOmit(obj, keys) {
    strictAssertObject(obj);
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Create a strict type guard for a specific type
 */
export function createStrictTypeGuard(validator, typeName) {
    return (value) => {
        const result = validator(value);
        if (!result) {
            console.error('Strict type guard failed', {
                typeName,
                value,
                valueType: typeof value
            });
        }
        return result;
    };
}
/**
 * Combine multiple type guards with AND logic
 */
export function and(...guards) {
    return (value) => {
        return guards.every(guard => guard(value));
    };
}
/**
 * Combine multiple type guards with OR logic
 */
export function or(...guards) {
    return (value) => {
        return guards.some(guard => guard(value));
    };
}
/**
 * Negate a type guard
 */
export function not(guard) {
    return (value) => {
        return !guard(value);
    };
}
/**
 * Create an optional type guard
 */
export function optional(guard) {
    return (value) => {
        return isStrictNullish(value) || guard(value);
    };
}
/**
 * Create an array type guard
 */
export function arrayOf(guard) {
    return (value) => {
        return isStrictArray(value) && value.every(guard);
    };
}
/**
 * Create a tuple type guard
 */
export function tuple(...guards) {
    return (value) => {
        if (!isStrictArray(value))
            return false;
        if (value.length !== guards.length)
            return false;
        return guards.every((guard, index) => guard(value[index]));
    };
}
/**
 * Create a record type guard
 */
export function record(valueGuard) {
    return (value) => {
        if (!isStrictObject(value))
            return false;
        return Object.values(value).every(valueGuard);
    };
}
/**
 * Performance measurement with strict typing
 */
export function strictMeasurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log('Strict performance measurement', {
        name,
        duration: end - start,
        functionName: fn.name || 'anonymous',
        timestamp: new Date().toISOString()
    });
    return result;
}
//# sourceMappingURL=typescript-strict.js.map