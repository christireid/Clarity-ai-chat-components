/**
 * Input validation errors
 */
import { ClarityError } from './base-error';
export declare class ValidationError extends ClarityError {
    constructor(message: string, errors: string[], originalError?: Error);
}
export declare class InvalidInputError extends ClarityError {
    constructor(fieldName: string, expectedFormat: string, actualValue: any, originalError?: Error);
}
export declare class MissingFieldError extends ClarityError {
    constructor(fieldName: string, originalError?: Error);
}
export declare class TypeMismatchError extends ClarityError {
    constructor(fieldName: string, expectedType: string, actualType: string, originalError?: Error);
}
//# sourceMappingURL=validation-errors.d.ts.map