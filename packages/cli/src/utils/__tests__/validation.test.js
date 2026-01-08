/**
 * Tests for validation utilities
 *
 * Note: These tests require zod to be available at runtime.
 * In a monorepo setup, dependencies may need to be installed at workspace root.
 */
import { describe, it, expect, vi } from 'vitest';
// Skip tests if zod is not available
const zodAvailable = typeof require !== 'undefined'
    ? require.resolve('zod', { paths: [process.cwd(), __dirname] })
    : false;
const testIfZodAvailable = zodAvailable ? describe : describe.skip;
testIfZodAvailable('validate', async () => {
    const { validate, FrameworkSchema } = await import('../validation.js');
    const { ValidationError } = await import('../errors.js');
    it('should validate and return parsed value', () => {
        const result = validate(FrameworkSchema, 'nextjs');
        expect(result).toBe('nextjs');
    });
    it('should throw ValidationError on invalid input', () => {
        expect(() => validate(FrameworkSchema, 'invalid')).toThrow(ValidationError);
    });
    it('should use custom error message', () => {
        expect(() => validate(FrameworkSchema, 'invalid', 'Custom error')).toThrow('Custom error');
    });
});
testIfZodAvailable('validateRequired', async () => {
    const { validateRequired } = await import('../validation.js');
    const { ValidationError } = await import('../errors.js');
    it('should pass when all required fields present', () => {
        expect(() => validateRequired({ a: 1, b: 2 }, ['a', 'b'])).not.toThrow();
    });
    it('should throw when fields missing', () => {
        expect(() => validateRequired({ a: 1 }, ['a', 'b'])).toThrow(ValidationError);
    });
});
testIfZodAvailable('validateComponentName', async () => {
    const { validateComponentName } = await import('../validation.js');
    const { ValidationError } = await import('../errors.js');
    it('should accept PascalCase', () => {
        expect(validateComponentName('ChatInterface')).toBe('ChatInterface');
    });
    it('should accept kebab-case', () => {
        expect(validateComponentName('chat-interface')).toBe('chat-interface');
    });
    it('should reject invalid names', () => {
        expect(() => validateComponentName('123invalid')).toThrow(ValidationError);
        expect(() => validateComponentName('invalid-name!')).toThrow(ValidationError);
    });
});
//# sourceMappingURL=validation.test.js.map