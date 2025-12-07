/**
 * Tests for security utilities
 */
import { describe, it, expect } from 'vitest';
import { validatePath, maskSensitive, validateApiKeyFormat } from '../security.js';
import { ValidationError } from '../errors.js';
describe('validatePath', () => {
    it('should resolve relative paths', () => {
        const result = validatePath('./test', process.cwd());
        expect(result).toContain('test');
    });
    it('should reject directory traversal', () => {
        expect(() => validatePath('../outside', process.cwd())).toThrow(ValidationError);
        expect(() => validatePath('../../etc/passwd', process.cwd())).toThrow(ValidationError);
    });
    it('should reject paths with ..', () => {
        expect(() => validatePath('test/../outside', process.cwd())).toThrow(ValidationError);
    });
});
describe('maskSensitive', () => {
    it('should mask API keys', () => {
        const key = 'sk-1234567890abcdef';
        const masked = maskSensitive(key, 4);
        expect(masked).not.toContain('1234567890abcdef');
        expect(masked.length).toBeGreaterThan(8);
    });
    it('should handle short strings', () => {
        const short = 'abc';
        const masked = maskSensitive(short, 4);
        expect(masked).toBe('***');
    });
});
describe('validateApiKeyFormat', () => {
    it('should validate OpenAI keys', () => {
        expect(validateApiKeyFormat('sk-12345678901234567890123456789012', 'openai')).toBe(true);
        expect(validateApiKeyFormat('invalid', 'openai')).toBe(false);
    });
    it('should validate Anthropic keys', () => {
        expect(validateApiKeyFormat('sk-ant-12345678901234567890123456789012', 'anthropic')).toBe(true);
        expect(validateApiKeyFormat('invalid', 'anthropic')).toBe(false);
    });
    it('should validate Google keys', () => {
        expect(validateApiKeyFormat('AIza12345678901234567890123456789012345', 'google')).toBe(true);
        expect(validateApiKeyFormat('invalid', 'google')).toBe(false);
    });
});
//# sourceMappingURL=security.test.js.map