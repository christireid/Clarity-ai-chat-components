/**
 * Input validation utilities
 */
import { ValidationError } from './errors.js';
/**
 * Validate required parameters
 */
export function validateRequired(args, required) {
    const missing = [];
    for (const key of required) {
        if (args[key] === undefined || args[key] === null || args[key] === '') {
            missing.push(String(key));
        }
    }
    if (missing.length > 0) {
        throw new ValidationError(`Missing required parameters: ${missing.join(', ')}`, { missing });
    }
}
/**
 * Validate enum value
 */
export function validateEnum(value, enumValues, paramName) {
    if (!enumValues.includes(value)) {
        throw new ValidationError(`Invalid ${paramName}: ${value}. Must be one of: ${enumValues.join(', ')}`, { paramName, value, allowedValues: enumValues });
    }
    return value;
}
/**
 * Validate string parameter
 */
export function validateString(value, paramName, minLength = 1) {
    if (typeof value !== 'string') {
        throw new ValidationError(`Invalid ${paramName}: must be a string`, { paramName, value });
    }
    if (value.length < minLength) {
        throw new ValidationError(`Invalid ${paramName}: must be at least ${minLength} characters`, { paramName, value, minLength });
    }
    return value;
}
/**
 * Validate number parameter
 */
export function validateNumber(value, paramName, min, max) {
    if (typeof value !== 'number' || isNaN(value)) {
        throw new ValidationError(`Invalid ${paramName}: must be a number`, { paramName, value });
    }
    if (min !== undefined && value < min) {
        throw new ValidationError(`Invalid ${paramName}: must be at least ${min}`, { paramName, value, min });
    }
    if (max !== undefined && value > max) {
        throw new ValidationError(`Invalid ${paramName}: must be at most ${max}`, { paramName, value, max });
    }
    return value;
}
//# sourceMappingURL=validation.js.map