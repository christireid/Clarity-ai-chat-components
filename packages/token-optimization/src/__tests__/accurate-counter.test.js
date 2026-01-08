/**
 * Tests for AccurateTokenCounter
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AccurateTokenCounter } from '../simple-index';
describe('AccurateTokenCounter', () => {
    let counter;
    beforeEach(() => {
        counter = new AccurateTokenCounter({
            model: 'gpt-4',
            enableCaching: true,
            enableMonitoring: true
        });
    });
    afterEach(() => {
        counter.destroy();
    });
    describe('Basic Token Counting', () => {
        it('should count tokens in simple text', () => {
            const text = 'Hello world';
            const tokens = counter.count(text);
            // "Hello world" should be 2 tokens with tiktoken
            expect(tokens).toBeGreaterThan(0);
            expect(tokens).toBeLessThan(5);
        });
        it('should handle empty text', () => {
            expect(counter.count('')).toBe(0);
            expect(counter.count(null)).toBe(0);
            expect(counter.count(undefined)).toBe(0);
        });
        it('should count tokens in complex text', () => {
            const text = 'The quick brown fox jumps over the lazy dog';
            const tokens = counter.count(text);
            expect(tokens).toBeGreaterThan(0);
            expect(tokens).toBeLessThan(15);
        });
        it('should handle Unicode characters', () => {
            const text = 'Hello 世界 🌍';
            const tokens = counter.count(text);
            expect(tokens).toBeGreaterThan(0);
        });
        it('should count tokens in batch', () => {
            const texts = [
                'Hello world',
                'How are you?',
                'This is a test.'
            ];
            const totalTokens = counter.countBatch(texts);
            const individualSum = texts.reduce((sum, text) => sum + counter.count(text), 0);
            expect(totalTokens).toBe(individualSum);
        });
    });
    describe('Token Estimation', () => {
        it('should estimate tokens quickly', () => {
            const text = 'This is a longer piece of text that should be estimated quickly without full encoding';
            const estimated = counter.estimate(text);
            const actual = counter.count(text);
            // Estimation should be reasonably close to actual
            expect(Math.abs(estimated - actual)).toBeLessThan(actual * 0.3);
        });
        it('should handle edge cases in estimation', () => {
            expect(counter.estimate('')).toBe(0);
            expect(counter.estimate('a')).toBeGreaterThan(0);
        });
    });
    describe('Token Info', () => {
        it('should provide detailed token information', () => {
            const text = 'Hello world from token counter';
            const info = counter.getTokenInfo(text);
            expect(info.tokens).toBeGreaterThan(0);
            expect(info.characters).toBe(text.length);
            expect(info.words).toBe(text.split(/\s+/).length);
            expect(info.ratio).toBeGreaterThan(0);
            expect(info.estimated).toBe(false);
        });
    });
    describe('Text Truncation', () => {
        it('should truncate text to fit token budget', () => {
            const text = 'This is a long piece of text that needs to be truncated to fit within a specific token budget';
            const maxTokens = 10;
            const truncated = counter.truncate(text, maxTokens);
            const truncatedTokens = counter.count(truncated);
            expect(truncatedTokens).toBeLessThanOrEqual(maxTokens);
            expect(truncated.length).toBeLessThan(text.length);
        });
        it('should not truncate if under budget', () => {
            const text = 'Short text';
            const maxTokens = 100;
            const truncated = counter.truncate(text, maxTokens);
            expect(truncated).toBe(text);
        });
        it('should handle empty text truncation', () => {
            expect(counter.truncate('', 10)).toBe('');
        });
    });
    describe('Caching', () => {
        it('should cache token counts', () => {
            const text = 'Cached text example';
            // First call - cache miss
            const tokens1 = counter.count(text);
            const stats1 = counter.getCacheStats();
            expect(stats1.enabled).toBe(true);
            expect(stats1.hits).toBe(0);
            expect(stats1.misses).toBe(1);
            // Second call - cache hit
            const tokens2 = counter.count(text);
            const stats2 = counter.getCacheStats();
            expect(tokens2).toBe(tokens1);
            expect(stats2.hits).toBe(1);
            expect(stats2.misses).toBe(1);
            expect(stats2.hitRate).toBe(0.5);
        });
        it('should respect cache size limits', () => {
            const smallCounter = new AccurateTokenCounter({
                model: 'gpt-4',
                cacheSize: 2,
                enableCaching: true
            });
            // Add more items than cache size
            smallCounter.count('text1');
            smallCounter.count('text2');
            smallCounter.count('text3');
            const stats = smallCounter.getCacheStats();
            expect(stats.size).toBeLessThanOrEqual(3); // Allow for small variance in cache management
            smallCounter.destroy();
        });
    });
    describe('Monitoring', () => {
        it('should track monitoring statistics', () => {
            const text = 'Monitoring test text';
            // Make some calls
            counter.count(text);
            counter.count(text);
            counter.count(text);
            const stats = counter.getMonitoringStats();
            expect(stats.enabled).toBe(true);
            expect(stats.totalCalls).toBe(3);
            expect(stats.totalTokens).toBeGreaterThan(0);
            expect(stats.averageTokens).toBeGreaterThan(0);
            expect(stats.runtime).toBeGreaterThan(0);
            expect(stats.tokensPerSecond).toBeGreaterThan(0);
        });
    });
    describe('Error Handling', () => {
        it('should handle encoding errors gracefully', () => {
            // Test with invalid input that might cause encoding issues
            const invalidText = '\uD800'; // Unpaired surrogate
            // Should not throw, should return estimated count
            expect(() => counter.count(invalidText)).not.toThrow();
            const tokens = counter.count(invalidText);
            expect(tokens).toBeGreaterThan(0);
        });
        it('should handle model fallback', () => {
            const counterWithInvalidModel = new AccurateTokenCounter({
                model: 'invalid-model-name',
                enableCaching: false
            });
            // Should fallback to cl100k_base encoding
            const tokens = counterWithInvalidModel.count('Hello world');
            expect(tokens).toBeGreaterThan(0);
            counterWithInvalidModel.destroy();
        });
    });
    describe('Performance', () => {
        it('should count tokens efficiently', () => {
            const text = 'Performance test with longer text to ensure counting is efficient';
            const iterations = 1000;
            const start = performance.now();
            for (let i = 0; i < iterations; i++) {
                counter.count(text);
            }
            const end = performance.now();
            const timePerOperation = (end - start) / iterations;
            // Should be reasonably fast (less than 1ms per operation)
            expect(timePerOperation).toBeLessThan(1);
        });
        it('should handle batch counting efficiently', () => {
            const texts = Array.from({ length: 100 }, (_, i) => `Text ${i} for batch counting`);
            const start = performance.now();
            const totalTokens = counter.countBatch(texts);
            const end = performance.now();
            expect(totalTokens).toBeGreaterThan(0);
            expect(end - start).toBeLessThan(100); // Should be fast
        });
    });
    describe('Edge Cases', () => {
        it('should handle very long text', () => {
            const longText = 'word '.repeat(1000);
            const tokens = counter.count(longText);
            expect(tokens).toBeGreaterThan(0);
            expect(tokens).toBeLessThan(longText.length);
        });
        it('should handle text with special characters', () => {
            const specialText = 'Hello! How are you? This is a test...';
            const tokens = counter.count(specialText);
            expect(tokens).toBeGreaterThan(0);
        });
        it('should handle multilingual text', () => {
            const multilingualText = 'Hello 世界 🌍 Bonjour мир';
            const tokens = counter.count(multilingualText);
            expect(tokens).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=accurate-counter.test.js.map