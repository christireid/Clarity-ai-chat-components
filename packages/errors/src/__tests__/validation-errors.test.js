/**
 * Validation Errors Tests
 */
import { describe, it, expect } from 'vitest';
import { ValidationError, InvalidInputError, MissingFieldError, TypeMismatchError } from '../validation-errors';
import { ClarityError } from '../base-error';
describe('ValidationError', () => {
    it('should create error with message and error list', () => {
        const errors = ['Name is required', 'Email is invalid'];
        const error = new ValidationError('Multiple validation errors', errors);
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.userMessage).toBe('Input validation failed');
        expect(error.technicalMessage).toBe('Multiple validation errors');
    });
    it('should include all errors in solutions', () => {
        const errors = ['Field A is invalid', 'Field B is missing'];
        const error = new ValidationError('Validation failed', errors);
        expect(error.solutions[0].steps).toHaveLength(2);
        expect(error.solutions[0].steps?.[0]).toContain('Field A');
        expect(error.solutions[0].steps?.[1]).toContain('Field B');
    });
    it('should include errors in context', () => {
        const errors = ['Error 1', 'Error 2', 'Error 3'];
        const error = new ValidationError('Failed', errors);
        expect(error.context.data?.errors).toEqual(errors);
    });
    it('should handle empty error list', () => {
        const error = new ValidationError('No specific errors', []);
        expect(error.solutions[0].steps).toHaveLength(0);
    });
    it('should be instance of ClarityError', () => {
        const error = new ValidationError('Test', ['error']);
        expect(error).toBeInstanceOf(ClarityError);
    });
    it('should preserve original error', () => {
        const originalError = new Error('Zod validation failed');
        const error = new ValidationError('Validation error', ['invalid field'], originalError);
        expect(error.originalError).toBe(originalError);
    });
});
describe('InvalidInputError', () => {
    it('should create error with field details', () => {
        const error = new InvalidInputError('email', 'email', 'not-an-email');
        expect(error.code).toBe('INVALID_INPUT');
        expect(error.userMessage).toContain('email');
        expect(error.technicalMessage).toContain('email');
    });
    it('should include expected format', () => {
        const error = new InvalidInputError('phone', 'phone number', '12345');
        expect(error.solutions[0].steps?.some((s) => s.includes('phone number'))).toBe(true);
    });
    it('should include actual value in solution', () => {
        const error = new InvalidInputError('url', 'url', 'bad-url');
        expect(error.solutions[0].steps?.some((s) => s.includes('bad-url'))).toBe(true);
    });
    it('should provide email example', () => {
        const error = new InvalidInputError('userEmail', 'email', 'invalid');
        expect(error.solutions[0].example).toContain('user@example.com');
    });
    it('should provide URL example', () => {
        const error = new InvalidInputError('website', 'url', 'not-url');
        expect(error.solutions[0].example).toContain('https://');
    });
    it('should provide phone example', () => {
        const error = new InvalidInputError('contact', 'phone number', '123');
        expect(error.solutions[0].example).toContain('+1');
    });
    it('should provide date example', () => {
        const error = new InvalidInputError('createdAt', 'date', 'yesterday');
        expect(error.solutions[0].example).toContain('ISO 8601');
    });
    it('should handle unknown formats', () => {
        const error = new InvalidInputError('custom', 'custom-format', 'value');
        expect(error.solutions[0].example).toContain('custom-format');
    });
    it('should include field in context', () => {
        const error = new InvalidInputError('age', 'positive number', -5);
        expect(error.context.data?.fieldName).toBe('age');
        expect(error.context.data?.expectedFormat).toBe('positive number');
        expect(error.context.data?.actualValue).toBe(-5);
    });
});
describe('MissingFieldError', () => {
    it('should create error with field name', () => {
        const error = new MissingFieldError('username');
        expect(error.code).toBe('MISSING_FIELD');
        expect(error.userMessage).toContain('username');
        expect(error.technicalMessage).toContain('username');
    });
    it('should provide fix instructions', () => {
        const error = new MissingFieldError('password');
        expect(error.solutions[0].steps?.some((s) => s.includes('Include password'))).toBe(true);
    });
    it('should include example', () => {
        const error = new MissingFieldError('apiKey');
        expect(error.solutions[0].example).toContain('apiKey');
        expect(error.solutions[0].example).toContain('"value"');
    });
    it('should include field in context', () => {
        const error = new MissingFieldError('token');
        expect(error.context.data?.fieldName).toBe('token');
        expect(error.context.action).toContain('required fields');
    });
    it('should preserve original error', () => {
        const originalError = new Error('Required field missing');
        const error = new MissingFieldError('id', originalError);
        expect(error.originalError).toBe(originalError);
    });
});
describe('TypeMismatchError', () => {
    it('should create error with type details', () => {
        const error = new TypeMismatchError('count', 'number', 'string');
        expect(error.code).toBe('TYPE_MISMATCH');
        expect(error.userMessage).toContain('count');
        expect(error.technicalMessage).toContain('number');
        expect(error.technicalMessage).toContain('string');
    });
    it('should include conversion steps', () => {
        const error = new TypeMismatchError('age', 'number', 'string');
        expect(error.solutions[0].steps?.some((s) => s.includes('string'))).toBe(true);
        expect(error.solutions[0].steps?.some((s) => s.includes('number'))).toBe(true);
    });
    it('should provide string to number conversion', () => {
        const error = new TypeMismatchError('value', 'number', 'string');
        expect(error.solutions[0].example).toContain('parseInt');
    });
    it('should provide string to boolean conversion', () => {
        const error = new TypeMismatchError('enabled', 'boolean', 'string');
        expect(error.solutions[0].example).toContain('=== "true"');
    });
    it('should provide number to string conversion', () => {
        const error = new TypeMismatchError('id', 'string', 'number');
        expect(error.solutions[0].example).toContain('toString()');
    });
    it('should provide boolean to number conversion', () => {
        const error = new TypeMismatchError('flag', 'number', 'boolean');
        expect(error.solutions[0].example).toContain('? 1 : 0');
    });
    it('should handle unknown conversions', () => {
        const error = new TypeMismatchError('data', 'object', 'array');
        expect(error.solutions[0].example).toContain('conversion logic');
    });
    it('should include types in context', () => {
        const error = new TypeMismatchError('items', 'array', 'object');
        expect(error.context.data?.fieldName).toBe('items');
        expect(error.context.data?.expectedType).toBe('array');
        expect(error.context.data?.actualType).toBe('object');
    });
    it('should preserve original error', () => {
        const originalError = new TypeError('Cannot convert');
        const error = new TypeMismatchError('test', 'string', 'number', originalError);
        expect(error.originalError).toBe(originalError);
    });
});
//# sourceMappingURL=validation-errors.test.js.map