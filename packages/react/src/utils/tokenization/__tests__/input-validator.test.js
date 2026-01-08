import { describe, it, expect } from 'vitest';
import { InputValidator } from '../input-validator';
describe('Input Validator Unit Tests', () => {
    describe('Text Input Validation', () => {
        it('should handle null/undefined inputs', () => {
            const result1 = InputValidator.validateTextInput(null);
            expect(result1.valid).toBe(true); // Should be valid with warning
            expect(result1.warnings.length).toBeGreaterThan(0);
            const result2 = InputValidator.validateTextInput(undefined);
            expect(result2.valid).toBe(true);
            expect(result2.warnings.length).toBeGreaterThan(0);
        });
        it('should handle non-string inputs', () => {
            const result1 = InputValidator.validateTextInput(12345);
            expect(result1.valid).toBe(true);
            expect(result1.sanitized).toBe('12345');
            const result2 = InputValidator.validateTextInput({});
            expect(result2.valid).toBe(true);
            expect(result2.sanitized).toBe('{}'); // JSON.stringify({}) returns "{}"
            const result3 = InputValidator.validateTextInput([]);
            expect(result3.valid).toBe(true);
            expect(result3.sanitized).toBe('');
        });
        it('should validate length constraints', () => {
            const shortText = 'a';
            const result1 = InputValidator.validateTextInput(shortText, {
                minLength: 5,
            });
            expect(result1.valid).toBe(false);
            expect(result1.errors.length).toBeGreaterThan(0);
            const longText = 'a'.repeat(100000);
            const result2 = InputValidator.validateTextInput(longText, {
                maxLength: 50000,
            });
            expect(result2.valid).toBe(false);
            expect(result2.errors.length).toBeGreaterThan(0);
        });
    });
    describe('Model Name Validation', () => {
        it('should validate model names correctly', () => {
            const result1 = InputValidator.validateModel('gpt-4');
            expect(result1.valid).toBe(true);
            expect(result1.sanitized).toBe('gpt-4');
            const result2 = InputValidator.validateModel('');
            expect(result2.valid).toBe(false);
            expect(result2.errors.length).toBeGreaterThan(0);
            const result3 = InputValidator.validateModel('invalid model!@#');
            expect(result3.valid).toBe(true); // Valid with warnings
            expect(result3.warnings.length).toBeGreaterThan(0);
        });
    });
    describe('Compression Ratio Validation', () => {
        it('should validate compression ratios', () => {
            const result1 = InputValidator.validateCompressionRatio(0.5);
            expect(result1.valid).toBe(true);
            expect(result1.sanitized).toBe(0.5);
            const result2 = InputValidator.validateCompressionRatio(1.5);
            expect(result2.valid).toBe(false);
            expect(result2.errors.length).toBeGreaterThan(0);
            const result3 = InputValidator.validateCompressionRatio(-0.1);
            expect(result3.valid).toBe(false);
            const result4 = InputValidator.validateCompressionRatio(0.95);
            expect(result4.valid).toBe(true);
            expect(result4.warnings.length).toBeGreaterThan(0); // Warning for high ratio
        });
    });
    describe('Quality Threshold Validation', () => {
        it('should validate quality thresholds', () => {
            const result1 = InputValidator.validateQualityThreshold(0.8);
            expect(result1.valid).toBe(true);
            const result2 = InputValidator.validateQualityThreshold(1.5);
            expect(result2.valid).toBe(false);
            const result3 = InputValidator.validateQualityThreshold(0.3);
            expect(result3.valid).toBe(true);
            expect(result3.warnings.length).toBeGreaterThan(0); // Warning for low quality
        });
    });
    describe('Budget Validation', () => {
        it('should validate budgets', () => {
            const result1 = InputValidator.validateBudget(1000);
            expect(result1.valid).toBe(true);
            const result2 = InputValidator.validateBudget(-100);
            expect(result2.valid).toBe(false);
            const result3 = InputValidator.validateBudget(10000000);
            expect(result3.valid).toBe(false);
        });
    });
    describe('Optimization Config Validation', () => {
        it('should validate optimization configs', () => {
            const result1 = InputValidator.validateOptimizationConfig({
                compressionRatio: 0.5,
                qualityThreshold: 0.8,
                budget: 1000,
            });
            expect(result1.valid).toBe(true);
            const result2 = InputValidator.validateOptimizationConfig({
                compressionRatio: 1.5, // Invalid
                qualityThreshold: -0.1, // Invalid
            });
            expect(result2.valid).toBe(false);
            expect(result2.errors.length).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=input-validator.test.js.map