/**
 * Error Utils Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatError, logError, handleError, createErrorHandler, withErrorHandling, assert, tryCatch, tryCatchSync, isErrorType, getErrorMessage, normalizeError, } from '../utils.js';
import { ClarityError } from '../base.js';
import { APIKeyMissingError } from '../api.js';
import { ValidationError } from '../validation.js';
// Concrete implementation for testing
class TestClarityError extends ClarityError {
    constructor(code, userMessage) {
        super(code, userMessage, 'Technical details', [], {});
    }
}
describe('formatError', () => {
    it('should format ClarityError using toTerminalString', () => {
        const error = new TestClarityError('TEST', 'Test error message');
        const formatted = formatError(error);
        expect(formatted).toContain('TestClarityError');
        expect(formatted).toContain('Test error message');
        expect(formatted).toContain('TEST');
    });
    it('should format regular Error with stack', () => {
        const error = new Error('Regular error');
        const formatted = formatError(error);
        expect(formatted).toContain('Error');
        expect(formatted).toContain('Regular error');
        expect(formatted).toContain(error.stack);
    });
    it('should format APIKeyMissingError', () => {
        const error = new APIKeyMissingError('openai');
        const formatted = formatError(error);
        expect(formatted).toContain('OPENAI');
        expect(formatted).toContain('API_KEY_MISSING');
    });
});
describe('logError', () => {
    let consoleErrorSpy;
    beforeEach(() => {
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });
    it('should log ClarityError to console', () => {
        const error = new TestClarityError('TEST', 'Test message');
        logError(error);
        expect(consoleErrorSpy).toHaveBeenCalled();
        const allArgs = consoleErrorSpy.mock.calls.flat();
        const hasMessage = allArgs.some(arg => String(arg).includes('Test message'));
        expect(hasMessage).toBe(true);
    });
    it('should log regular Error with stack', () => {
        const error = new Error('Regular error message');
        logError(error);
        expect(consoleErrorSpy).toHaveBeenCalled();
        // Should log "Unexpected Error" for non-ClarityErrors
        const allArgs = consoleErrorSpy.mock.calls.flat();
        const hasUnexpectedError = allArgs.some(arg => String(arg).includes('Unexpected Error'));
        expect(hasUnexpectedError).toBe(true);
    });
    it('should log stack trace for regular errors', () => {
        const error = new Error('Error with stack');
        logError(error);
        const allArgs = consoleErrorSpy.mock.calls.flat();
        const hasStackTrace = allArgs.some(arg => String(arg).includes('Stack trace'));
        expect(hasStackTrace).toBe(true);
    });
});
describe('handleError', () => {
    it('should return correct status code for ClarityError', () => {
        const error = new APIKeyMissingError('openai');
        const { statusCode, body } = handleError(error);
        expect(statusCode).toBe(401); // API_KEY_MISSING = 401
        expect(body.code).toBe('API_KEY_MISSING');
    });
    it('should return 400 for validation errors', () => {
        const error = new ValidationError('Invalid input');
        const { statusCode } = handleError(error);
        expect(statusCode).toBe(400);
    });
    it('should return 500 for unknown errors', () => {
        const error = new Error('Unknown error');
        const { statusCode, body } = handleError(error);
        expect(statusCode).toBe(500);
        expect(body.code).toBe('INTERNAL_ERROR');
    });
    it('should return JSON body for ClarityError', () => {
        const error = new TestClarityError('TEST_CODE', 'User message');
        const { body } = handleError(error);
        expect(body.name).toBe('TestClarityError');
        expect(body.code).toBe('TEST_CODE');
        expect(body.message).toBe('User message');
    });
    it('should return generic body for regular Error', () => {
        const error = new Error('Internal issue');
        const { body } = handleError(error);
        expect(body.code).toBe('INTERNAL_ERROR');
        expect(body.message).toBe('An unexpected error occurred');
        expect(body.technicalMessage).toBe('Internal issue');
    });
});
describe('createErrorHandler', () => {
    it('should create middleware function', () => {
        const handler = createErrorHandler();
        expect(typeof handler).toBe('function');
    });
    it('should pass through successful responses', async () => {
        const handler = createErrorHandler();
        const mockHandler = vi.fn().mockResolvedValue({ success: true });
        const wrapped = handler(mockHandler);
        const result = await wrapped({}, {});
        expect(result).toEqual({ success: true });
        expect(mockHandler).toHaveBeenCalled();
    });
    it('should catch errors and send response', async () => {
        const handler = createErrorHandler();
        const mockHandler = vi.fn().mockRejectedValue(new Error('Test error'));
        const mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        // Suppress console.error for this test
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { });
        const wrapped = handler(mockHandler);
        await wrapped({}, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'INTERNAL_ERROR' }));
        consoleErrorSpy.mockRestore();
    });
    it('should use correct status code for ClarityErrors', async () => {
        const handler = createErrorHandler();
        const mockHandler = vi
            .fn()
            .mockRejectedValue(new APIKeyMissingError('openai'));
        const mockRes = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { });
        const wrapped = handler(mockHandler);
        await wrapped({}, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ code: 'API_KEY_MISSING' }));
        consoleErrorSpy.mockRestore();
    });
});
describe('withErrorHandling', () => {
    it('should return result on success', async () => {
        const fn = async () => 'success';
        const wrapped = withErrorHandling(fn);
        const result = await wrapped();
        expect(result).toBe('success');
    });
    it('should pass arguments to wrapped function', async () => {
        const fn = async (a, b) => a + b;
        const wrapped = withErrorHandling(fn);
        const result = await wrapped(2, 3);
        expect(result).toBe(5);
    });
    it('should call default error handler on error', async () => {
        const consoleErrorSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => { });
        const fn = async () => {
            throw new Error('Test error');
        };
        const wrapped = withErrorHandling(fn);
        await expect(wrapped()).rejects.toThrow('Test error');
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
    it('should call custom error handler on error', async () => {
        const customHandler = vi.fn();
        const fn = async () => {
            throw new Error('Custom handled');
        };
        const wrapped = withErrorHandling(fn, customHandler);
        await expect(wrapped()).rejects.toThrow('Custom handled');
        expect(customHandler).toHaveBeenCalled();
    });
    it('should re-throw the error after handling', async () => {
        const fn = async () => {
            throw new Error('Should be rethrown');
        };
        const wrapped = withErrorHandling(fn, () => { });
        await expect(wrapped()).rejects.toThrow('Should be rethrown');
    });
});
describe('assert', () => {
    it('should not throw when condition is true', () => {
        expect(() => assert(true, 'Should not throw')).not.toThrow();
    });
    it('should throw string error when condition is false', () => {
        expect(() => assert(false, 'Assertion failed')).toThrow('Assertion failed');
    });
    it('should throw Error when condition is false', () => {
        const error = new Error('Custom error');
        expect(() => assert(false, error)).toThrow(error);
    });
    it('should throw ClarityError when condition is false', () => {
        const error = new TestClarityError('ASSERT', 'Assertion failed');
        expect(() => assert(false, error)).toThrow(error);
    });
    it('should work as type guard', () => {
        const value = 'test';
        assert(value !== null, 'Value should not be null');
        // TypeScript should now know value is string
        expect(value.toUpperCase()).toBe('TEST');
    });
});
describe('tryCatch', () => {
    it('should return [null, result] on success', async () => {
        const fn = async () => 'success';
        const [error, result] = await tryCatch(fn);
        expect(error).toBeNull();
        expect(result).toBe('success');
    });
    it('should return [error, null] on failure', async () => {
        const fn = async () => {
            throw new Error('Failure');
        };
        const [error, result] = await tryCatch(fn);
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('Failure');
        expect(result).toBeNull();
    });
    it('should work with async operations', async () => {
        const fn = async () => {
            await new Promise((r) => setTimeout(r, 10));
            return 42;
        };
        const [error, result] = await tryCatch(fn);
        expect(error).toBeNull();
        expect(result).toBe(42);
    });
    it('should capture ClarityErrors', async () => {
        const fn = async () => {
            throw new APIKeyMissingError('openai');
        };
        const [error, result] = await tryCatch(fn);
        expect(error).toBeInstanceOf(APIKeyMissingError);
        expect(result).toBeNull();
    });
    it('should work with Promise-returning functions', async () => {
        const fn = () => Promise.resolve({ data: 'test' });
        const [error, result] = await tryCatch(fn);
        expect(error).toBeNull();
        expect(result).toEqual({ data: 'test' });
    });
});
describe('tryCatchSync', () => {
    it('should return [null, result] on success', () => {
        const fn = () => 'success';
        const [error, result] = tryCatchSync(fn);
        expect(error).toBeNull();
        expect(result).toBe('success');
    });
    it('should return [error, null] on failure', () => {
        const fn = () => {
            throw new Error('Sync failure');
        };
        const [error, result] = tryCatchSync(fn);
        expect(error).toBeInstanceOf(Error);
        expect(error?.message).toBe('Sync failure');
        expect(result).toBeNull();
    });
    it('should work with complex operations', () => {
        const fn = () => JSON.parse('{"valid": true}');
        const [error, result] = tryCatchSync(fn);
        expect(error).toBeNull();
        expect(result).toEqual({ valid: true });
    });
    it('should catch JSON parse errors', () => {
        const fn = () => JSON.parse('invalid json');
        const [error, result] = tryCatchSync(fn);
        expect(error).toBeInstanceOf(SyntaxError);
        expect(result).toBeNull();
    });
});
describe('isErrorType', () => {
    it('should return true for matching error type', () => {
        const error = new APIKeyMissingError('openai');
        expect(isErrorType(error, APIKeyMissingError)).toBe(true);
    });
    it('should return false for non-matching error type', () => {
        const error = new Error('Generic error');
        expect(isErrorType(error, APIKeyMissingError)).toBe(false);
    });
    it('should work with ClarityError base class', () => {
        const error = new APIKeyMissingError('openai');
        expect(isErrorType(error, ClarityError)).toBe(true);
    });
});
describe('getErrorMessage', () => {
    it('should return message from Error', () => {
        const error = new Error('Error message');
        expect(getErrorMessage(error)).toBe('Error message');
    });
    it('should return message from ClarityError', () => {
        const error = new TestClarityError('TEST', 'User message');
        expect(getErrorMessage(error)).toBe('User message');
    });
    it('should convert string to message', () => {
        expect(getErrorMessage('String error')).toBe('String error');
    });
    it('should convert unknown types to string', () => {
        expect(getErrorMessage(42)).toBe('42');
        expect(getErrorMessage(null)).toBe('null');
        expect(getErrorMessage(undefined)).toBe('undefined');
    });
});
describe('normalizeError', () => {
    it('should return Error as-is', () => {
        const error = new Error('Test');
        expect(normalizeError(error)).toBe(error);
    });
    it('should return ClarityError as-is', () => {
        const error = new TestClarityError('TEST', 'Test');
        expect(normalizeError(error)).toBe(error);
    });
    it('should convert string to Error', () => {
        const result = normalizeError('String error');
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('String error');
    });
    it('should convert objects to Error', () => {
        const result = normalizeError({ message: 'Object error' });
        expect(result).toBeInstanceOf(Error);
        // Objects are converted using String(), which returns "[object Object]"
        expect(result.message).toBe('[object Object]');
    });
    it('should convert null to Error', () => {
        const result = normalizeError(null);
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('null');
    });
    it('should convert numbers to Error', () => {
        const result = normalizeError(404);
        expect(result).toBeInstanceOf(Error);
        expect(result.message).toBe('404');
    });
});
//# sourceMappingURL=utils.test.js.map