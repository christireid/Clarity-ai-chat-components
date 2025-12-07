/**
 * Tests for error handling utilities
 */
import { describe, it, expect } from 'vitest';
import { CLIError, ValidationError, NotFoundError, ConfigError, PermissionError, ExitCode } from '../errors.js';
describe('CLIError', () => {
    it('should create error with message and code', () => {
        const error = new CLIError('Test error', ExitCode.GENERAL_ERROR);
        expect(error.message).toBe('Test error');
        expect(error.code).toBe(ExitCode.GENERAL_ERROR);
        expect(error.name).toBe('CLIError');
    });
    it('should include suggestions', () => {
        const suggestions = ['Fix 1', 'Fix 2'];
        const error = new CLIError('Test', ExitCode.GENERAL_ERROR, suggestions);
        expect(error.suggestions).toEqual(suggestions);
    });
});
describe('ValidationError', () => {
    it('should have correct code', () => {
        const error = new ValidationError('Invalid input');
        expect(error.code).toBe(ExitCode.VALIDATION_ERROR);
        expect(error.name).toBe('ValidationError');
    });
});
describe('NotFoundError', () => {
    it('should format message correctly', () => {
        const error = new NotFoundError('file.txt');
        expect(error.message).toContain('file.txt');
        expect(error.code).toBe(ExitCode.NOT_FOUND);
    });
});
describe('ConfigError', () => {
    it('should have correct code', () => {
        const error = new ConfigError('Config issue');
        expect(error.code).toBe(ExitCode.CONFIG_ERROR);
    });
});
describe('PermissionError', () => {
    it('should have correct code', () => {
        const error = new PermissionError('Permission denied');
        expect(error.code).toBe(ExitCode.PERMISSION_ERROR);
    });
});
//# sourceMappingURL=errors.test.js.map