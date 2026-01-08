/**
 * Internal Type Assertions and Guards
 *
 * @internal
 * These utilities are for internal use only and are not part of the public API.
 * They provide type-safe runtime checks for common patterns.
 */
/**
 * Asserts that a value is not null or undefined
 */
export function assertDefined(value, message = 'Expected value to be defined') {
    if (value === null || value === undefined) {
        throw new Error(message);
    }
}
/**
 * Type guard for non-nullable values
 */
export function isDefined(value) {
    return value !== null && value !== undefined;
}
/**
 * Type guard for non-empty strings
 */
export function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}
/**
 * Type guard for valid numbers (not NaN or Infinity)
 */
export function isValidNumber(value) {
    return (typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value));
}
/**
 * Type guard for plain objects
 */
export function isPlainObject(value) {
    return (typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.prototype.toString.call(value) === '[object Object]');
}
/**
 * Type guard for arrays
 */
export function isArray(value) {
    return Array.isArray(value);
}
/**
 * Type guard for functions
 */
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Type guard for promises
 */
export function isPromise(value) {
    return (value !== null &&
        typeof value === 'object' &&
        'then' in value &&
        typeof value.then === 'function');
}
/**
 * Assert that a condition is true
 */
export function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}
/**
 * Assert unreachable code path (exhaustive checks)
 */
export function assertNever(value, message) {
    throw new Error(message ?? `Unexpected value: ${JSON.stringify(value)}`);
}
//# sourceMappingURL=assertions.js.map