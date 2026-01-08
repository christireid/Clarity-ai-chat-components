/**
 * Tests for error utilities
 */
import { describe, it, expect } from 'vitest';
import { MCPError, ValidationError, NotFoundError, PermissionError, formatErrorResponse, ErrorCode } from '../errors.js';
describe('errors', () => {
    describe('MCPError', () => {
        it('should create error with code and message', () => {
            const error = new MCPError(ErrorCode.VALIDATION_ERROR, 'Test error');
            expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
            expect(error.message).toBe('Test error');
            expect(error).toBeInstanceOf(Error);
        });
        it('should include details when provided', () => {
            const error = new MCPError(ErrorCode.VALIDATION_ERROR, 'Test error', { field: 'test' });
            expect(error.details).toEqual({ field: 'test' });
        });
    });
    describe('ValidationError', () => {
        it('should have correct code', () => {
            const error = new ValidationError('Invalid input');
            expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
            expect(error).toBeInstanceOf(MCPError);
        });
    });
    describe('NotFoundError', () => {
        it('should create error with resource and identifier', () => {
            const error = new NotFoundError('Model', 'gpt-5');
            expect(error.code).toBe(ErrorCode.NOT_FOUND);
            expect(error.message).toContain('Model');
            expect(error.message).toContain('gpt-5');
            expect(error.details?.resource).toBe('Model');
            expect(error.details?.identifier).toBe('gpt-5');
        });
        it('should create error without identifier', () => {
            const error = new NotFoundError('Resource');
            expect(error.message).toContain('Resource');
            expect(error.details?.identifier).toBeUndefined();
        });
    });
    describe('PermissionError', () => {
        it('should have correct code', () => {
            const error = new PermissionError('Access denied');
            expect(error.code).toBe(ErrorCode.PERMISSION_DENIED);
        });
    });
    describe('formatErrorResponse', () => {
        it('should format MCPError correctly', () => {
            const error = new ValidationError('Invalid input', { field: 'test' });
            const response = formatErrorResponse(error);
            expect(response.isError).toBe(true);
            expect(response.content[0].type).toBe('text');
            const parsed = JSON.parse(response.content[0].text);
            expect(parsed.success).toBe(false);
            expect(parsed.error.code).toBe(ErrorCode.VALIDATION_ERROR);
            expect(parsed.error.message).toBe('Invalid input');
            expect(parsed.error.details).toEqual({ field: 'test' });
        });
        it('should format generic Error correctly', () => {
            const error = new Error('Generic error');
            const response = formatErrorResponse(error);
            expect(response.isError).toBe(true);
            const parsed = JSON.parse(response.content[0].text);
            expect(parsed.error.code).toBe(ErrorCode.INTERNAL_ERROR);
            // Enhanced error handling preserves actual error message for better debugging
            expect(parsed.error.message).toBe('Generic error');
        });
        it('should handle unknown error types', () => {
            const response = formatErrorResponse('string error');
            expect(response.isError).toBe(true);
            const parsed = JSON.parse(response.content[0].text);
            expect(parsed.error.code).toBe(ErrorCode.INTERNAL_ERROR);
        });
    });
});
//# sourceMappingURL=errors.test.js.map