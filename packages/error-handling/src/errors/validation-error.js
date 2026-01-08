import { ClarityError } from './base-error';
import { ValidationErrorCode } from './error-codes';
export { ValidationErrorCode };
/**
 * Input validation errors with field-level details
 */
export class ValidationError extends ClarityError {
    code = 'VALIDATION_ERROR';
    statusCode = 400;
    fields;
    constructor(message, options) {
        super(message, {
            context: options.context,
            recoverable: true,
            solution: options.solution ??
                'Please correct the highlighted fields and try again.',
            docs: options.docs,
        });
        // Required for proper instanceof checks
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.fields = options.fields;
    }
    /**
     * Create a validation error for a single field
     */
    static field(field, message, code, options) {
        return new ValidationError(`Validation failed: ${message}`, {
            fields: [
                {
                    field,
                    message,
                    code,
                    value: options?.value,
                    expected: options?.expected,
                },
            ],
        });
    }
    /**
     * Create a required field error
     */
    static required(field) {
        return ValidationError.field(field, `${field} is required`, ValidationErrorCode.REQUIRED_FIELD);
    }
    /**
     * Create an invalid format error
     */
    static invalidFormat(field, expected, value) {
        return ValidationError.field(field, `${field} has an invalid format`, ValidationErrorCode.INVALID_FORMAT, { value, expected });
    }
    /**
     * Create an out of range error
     */
    static outOfRange(field, min, max, value) {
        const rangeText = min !== undefined && max !== undefined
            ? `between ${min} and ${max}`
            : min !== undefined
                ? `at least ${min}`
                : max !== undefined
                    ? `at most ${max}`
                    : 'within the valid range';
        return ValidationError.field(field, `${field} must be ${rangeText}`, ValidationErrorCode.OUT_OF_RANGE, { value, expected: rangeText });
    }
    /**
     * Create an invalid type error
     */
    static invalidType(field, expected, actual) {
        return ValidationError.field(field, `${field} must be a ${expected}, got ${actual}`, ValidationErrorCode.INVALID_TYPE, { value: actual, expected });
    }
    /**
     * Create a too long error
     */
    static tooLong(field, maxLength, actual) {
        return ValidationError.field(field, `${field} exceeds maximum length of ${maxLength}`, ValidationErrorCode.TOO_LONG, { value: actual, expected: `max ${maxLength} characters` });
    }
    /**
     * Create a too short error
     */
    static tooShort(field, minLength, actual) {
        return ValidationError.field(field, `${field} must be at least ${minLength} characters`, ValidationErrorCode.TOO_SHORT, { value: actual, expected: `min ${minLength} characters` });
    }
    /**
     * Create a pattern mismatch error
     */
    static patternMismatch(field, pattern, value) {
        return ValidationError.field(field, `${field} does not match the required pattern`, ValidationErrorCode.PATTERN_MISMATCH, { value, expected: pattern });
    }
    /**
     * Combine multiple validation errors into one
     */
    static combine(errors) {
        const allFields = errors.flatMap((e) => e.fields);
        return new ValidationError(`Validation failed for ${allFields.length} field(s)`, { fields: allFields });
    }
    /**
     * Get error message for a specific field
     */
    getFieldError(fieldName) {
        return this.fields.find((f) => f.field === fieldName)?.message;
    }
    /**
     * Check if a specific field has an error
     */
    hasFieldError(fieldName) {
        return this.fields.some((f) => f.field === fieldName);
    }
    /**
     * Get all field names with errors
     */
    get errorFields() {
        return this.fields.map((f) => f.field);
    }
    /**
     * Get a map of field names to error messages
     */
    get fieldErrorMap() {
        return this.fields.reduce((acc, f) => {
            acc[f.field] = f.message;
            return acc;
        }, {});
    }
    get userMessage() {
        const firstField = this.fields[0];
        if (this.fields.length === 1 && firstField) {
            return firstField.message;
        }
        return `Please fix the following: ${this.fields.map((f) => f.message).join(', ')}`;
    }
}
/**
 * Type guard for ValidationError
 */
export function isValidationError(error) {
    return error instanceof ValidationError;
}
//# sourceMappingURL=validation-error.js.map