import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TokenCounter } from '@clarity-chat/token-optimization';
import { estimateTokens } from '../estimator';
import { countConversationTokens, countTokens } from '../accurate-counter';
import { InputValidator } from '../input-validator';
import { errorHandler } from '../enhanced-error-handling';
describe('Adversarial Analysis - Input Validation & Error Handling', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        errorHandler.clearHistory();
    });
    afterEach(() => {
        vi.restoreAllMocks();
    });
    describe('Input Validation Edge Cases', () => {
        it('should handle null/undefined inputs gracefully', async () => {
            // Test null input
            const result1 = await countConversationTokens([
                { role: 'user', content: null },
            ]);
            expect(result1.total).toBeGreaterThanOrEqual(0);
            // Test undefined input
            const result2 = await countConversationTokens([
                { role: 'user', content: undefined },
            ]);
            expect(result2.total).toBeGreaterThanOrEqual(0);
        });
        it('should handle non-string inputs with conversion', async () => {
            const result = await countConversationTokens([
                { role: 'user', content: 12345 },
            ]);
            expect(result.total).toBeGreaterThanOrEqual(0);
        });
        it('should handle empty arrays and objects', async () => {
            const result1 = await countConversationTokens([]);
            expect(result1.total).toBe(2); // Priming tokens
            const result2 = await estimateTokens('');
            expect(result2).toBe(0);
        });
        it('should handle extremely large inputs', async () => {
            const largeText = 'a'.repeat(10000); // 10KB
            const result = await estimateTokens(largeText);
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(50000); // Reasonable upper bound
        });
        it('should validate model names properly', async () => {
            const result = await countConversationTokens([{ role: 'user', content: 'test' }], { model: 'invalid model!@#' });
            // Should still work with sanitized model name
            expect(result.model).toBe('invalid-model');
        });
        it('should handle invalid message structures', async () => {
            // Missing content field
            await expect(countConversationTokens([{ role: 'user' }])).rejects.toThrow();
            // Invalid role
            const result = await countConversationTokens([
                { role: 'invalid-role', content: 'test' },
            ]);
            expect(result.total).toBeGreaterThan(0);
        });
    });
    describe('Error Handling & Recovery', () => {
        it('should recover from TokenCounter failures', async () => {
            // Mock TokenCounter.count to throw error
            vi.spyOn(TokenCounter, 'count').mockImplementation(() => {
                throw new Error('TokenCounter unavailable');
            });
            const result = await estimateTokens('Hello world');
            expect(result).toBeGreaterThan(0); // Should use fallback
        });
        it('should handle timeout scenarios', async () => {
            // Mock a slow operation
            vi.spyOn(TokenCounter, 'count').mockImplementation(() => {
                const start = Date.now();
                while (Date.now() - start < 100) {
                    // Busy wait to simulate slow operation
                }
                return 10;
            });
            const result = await estimateTokens('test');
            expect(result).toBeGreaterThan(0);
        });
        it('should provide meaningful error messages', async () => {
            try {
                await countConversationTokens(null);
            }
            catch (error) {
                expect(error.message).toContain('must be an array');
                expect(error.suggestedActions).toBeDefined();
                expect(error.suggestedActions.length).toBeGreaterThan(0);
            }
        });
        it('should track error statistics', async () => {
            // Generate some errors
            try {
                await countConversationTokens(null);
            }
            catch (error) {
                // Expected
            }
            try {
                await estimateTokens(null);
            }
            catch (error) {
                // Expected
            }
            const stats = errorHandler.getErrorStats();
            expect(stats.totalErrors).toBeGreaterThan(0);
            expect(stats.recoverableRate).toBeGreaterThanOrEqual(0);
        });
    });
    describe('Input Validator Edge Cases', () => {
        it('should validate compression ratios properly', () => {
            const result1 = InputValidator.validateCompressionRatio(1.5);
            expect(result1.valid).toBe(false);
            expect(result1.errors.length).toBeGreaterThan(0);
            const result2 = InputValidator.validateCompressionRatio(-0.5);
            expect(result2.valid).toBe(false);
            const result3 = InputValidator.validateCompressionRatio(0.5);
            expect(result3.valid).toBe(true);
            expect(result3.sanitized).toBe(0.5);
        });
        it('should validate quality thresholds properly', () => {
            const result1 = InputValidator.validateQualityThreshold(1.5);
            expect(result1.valid).toBe(false);
            const result2 = InputValidator.validateQualityThreshold(0.95);
            expect(result2.valid).toBe(true);
            expect(result2.warnings.length).toBeGreaterThan(0); // Warning for high threshold
        });
        it('should validate budgets properly', () => {
            const result1 = InputValidator.validateBudget(-100);
            expect(result1.valid).toBe(false);
            const result2 = InputValidator.validateBudget(1000000);
            expect(result2.valid).toBe(false);
            const result3 = InputValidator.validateBudget(1000);
            expect(result3.valid).toBe(true);
        });
        it('should validate optimization configs comprehensively', () => {
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
    describe('Race Conditions & Concurrent Operations', () => {
        it('should handle concurrent token counting', async () => {
            const texts = ['text1', 'text2', 'text3', 'text4', 'text5'];
            const promises = texts.map((text) => countConversationTokens([{ role: 'user', content: text }]));
            const results = await Promise.all(promises);
            expect(results).toHaveLength(5);
            results.forEach((result) => {
                expect(result.total).toBeGreaterThan(0);
            });
        });
        it('should handle mixed valid/invalid concurrent requests', async () => {
            const mixedInputs = [
                [{ role: 'user', content: 'valid text' }],
                null, // Invalid
                [{ role: 'user', content: 'another valid' }],
                undefined, // Invalid
                [{ role: 'user', content: 'final valid' }],
            ];
            const promises = mixedInputs.map((input) => countConversationTokens(input).catch((error) => ({ error })));
            const results = await Promise.all(promises);
            const validResults = results.filter((r) => !r.error);
            const errors = results.filter((r) => r.error);
            expect(validResults.length).toBeGreaterThan(0);
            expect(errors.length).toBeGreaterThan(0);
        });
    });
    describe('Resource Exhaustion Scenarios', () => {
        it('should handle many small requests efficiently', async () => {
            const startTime = Date.now();
            const promises = [];
            for (let i = 0; i < 100; i++) {
                promises.push(estimateTokens(`small text ${i}`));
            }
            const results = await Promise.all(promises);
            const endTime = Date.now();
            expect(results).toHaveLength(100);
            expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
        });
        it('should handle memory pressure gracefully', async () => {
            // Create large text
            const largeText = 'a'.repeat(100000); // 100KB
            const result = await estimateTokens(largeText);
            expect(result).toBeGreaterThan(0);
            // Test multiple large texts
            const results = await Promise.all([
                estimateTokens(largeText),
                estimateTokens(largeText),
                estimateTokens(largeText),
            ]);
            expect(results).toHaveLength(3);
            results.forEach((result) => expect(result).toBeGreaterThan(0));
        });
    });
    describe('Edge Cases & Boundary Conditions', () => {
        it('should handle special characters and emojis', async () => {
            const specialTexts = [
                '🚀🎉💻🤖', // Emojis
                'Café résumé naïve', // Accented characters
                '中文测试', // Chinese
                'العربية', // Arabic
                '🎉🎊🎈🎁', // More emojis
            ];
            for (const text of specialTexts) {
                const result = await estimateTokens(text);
                expect(result).toBeGreaterThan(0);
            }
        });
        it('should handle very long words', async () => {
            const longWord = 'a'.repeat(1000); // 1000 character word
            const result = await estimateTokens(longWord);
            expect(result).toBeGreaterThan(0);
        });
        it('should handle whitespace variations', async () => {
            const whitespaceTexts = [
                '   ', // Multiple spaces
                '\t\n\r', // Various whitespace
                ' \t \n \r ', // Mixed whitespace
                '\u00A0', // Non-breaking space
            ];
            for (const text of whitespaceTexts) {
                const result = await estimateTokens(text);
                expect(typeof result).toBe('number');
            }
        });
    });
});
//# sourceMappingURL=adversarial-analysis.test.js.map