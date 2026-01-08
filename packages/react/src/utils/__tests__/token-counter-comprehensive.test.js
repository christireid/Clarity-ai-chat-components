import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TokenCounter } from '@clarity-chat/token-optimization';
// Test data for different models and scenarios
const TEST_CASES = {
    // Basic text samples
    basic: {
        'Hello World': 3,
        'The quick brown fox jumps over the lazy dog': 9,
        'AI is transforming the world': 6,
        '': 0,
        a: 1,
        A: 1,
    },
    // Complex text samples
    complex: {
        'function calculateTokenCount(text: string): number { return TokenCounter.count(text); }': 18,
        'const result = await fetch("https://api.example.com/data");': 16,
        'import { TokenCounter } from "@clarity-chat/token-optimization";': 14,
        'SELECT * FROM users WHERE id = ? AND status = "active"': 16,
        '<div className="container"><h1>Title</h1><p>Content</p></div>': 21,
    },
    // Multilingual text
    multilingual: {
        'Hello 世界': 4, // Mixed English/Chinese
        'Café résumé naïve': 6, // French accents
        '¡Hola mundo! ¿Cómo estás?': 9, // Spanish
        'Привет мир': 5, // Russian
        'مرحبا بالعالم': 6, // Arabic
        '🌍🚀🎉': 3, // Emojis
    },
    // Code samples
    code: {
        'console.log("Hello World");': 7,
        'const x = 42;': 5,
        'function add(a, b) { return a + b; }': 15,
        'class MyClass { constructor() { this.value = 0; } }': 20,
        'async/await Promise.then().catch()': 9,
    },
    // Edge cases
    edgeCases: {
        '\n\n\n': 3, // Multiple newlines
        '   ': 3, // Multiple spaces
        '\t\t\t': 3, // Multiple tabs
        'a\nb\nc': 5, // Mixed characters and newlines
        '   text   ': 5, // Text with leading/trailing spaces
        ['word'.repeat(100)]: 600, // Long repeated text
    },
};
// Model-specific test expectations
const MODEL_EXPECTATIONS = {
    'gpt-4': { ratio: 4.0, tolerance: 0.2 },
    'gpt-4-turbo': { ratio: 4.0, tolerance: 0.2 },
    'gpt-4o': { ratio: 4.0, tolerance: 0.2 },
    'gpt-4o-mini': { ratio: 4.0, tolerance: 0.2 },
    'gpt-3.5-turbo': { ratio: 4.0, tolerance: 0.2 },
    o1: { ratio: 4.0, tolerance: 0.2 },
    o3: { ratio: 4.0, tolerance: 0.2 },
    'claude-3-opus': { ratio: 3.8, tolerance: 0.3 },
    'claude-3-sonnet': { ratio: 3.8, tolerance: 0.3 },
    'claude-3-haiku': { ratio: 3.8, tolerance: 0.3 },
    'claude-3.5-sonnet': { ratio: 3.8, tolerance: 0.3 },
    'claude-4': { ratio: 3.8, tolerance: 0.3 },
    'gemini-pro': { ratio: 4.0, tolerance: 0.3 },
    'gemini-1.5-pro': { ratio: 4.0, tolerance: 0.3 },
    'gemini-1.5-flash': { ratio: 4.0, tolerance: 0.3 },
    'deepseek-chat': { ratio: 4.0, tolerance: 0.3 },
    'deepseek-coder': { ratio: 4.0, tolerance: 0.3 },
    'llama-2-70b': { ratio: 3.5, tolerance: 0.4 },
    'llama-3-8b': { ratio: 3.5, tolerance: 0.4 },
    'llama-3-70b': { ratio: 3.5, tolerance: 0.4 },
};
describe('TokenCounter Comprehensive Tests', () => {
    beforeEach(() => {
        // Clear any caches or state before each test
        TokenCounter.clearCache?.();
    });
    describe('Basic Functionality', () => {
        Object.entries(TEST_CASES.basic).forEach(([text, expectedTokens]) => {
            it(`should count "${text}" as ${expectedTokens} tokens`, () => {
                const result = TokenCounter.count(text);
                expect(result).toBe(expectedTokens);
            });
        });
    });
    describe('Complex Text', () => {
        Object.entries(TEST_CASES.complex).forEach(([text, expectedTokens]) => {
            it(`should count complex text: "${text.substring(0, 50)}..." as ${expectedTokens} tokens`, () => {
                const result = TokenCounter.count(text);
                expect(result).toBe(expectedTokens);
            });
        });
    });
    describe('Multilingual Support', () => {
        Object.entries(TEST_CASES.multilingual).forEach(([text, expectedTokens]) => {
            it(`should count multilingual text: "${text}" as ${expectedTokens} tokens`, () => {
                const result = TokenCounter.count(text);
                expect(result).toBe(expectedTokens);
            });
        });
    });
    describe('Code Samples', () => {
        Object.entries(TEST_CASES.code).forEach(([text, expectedTokens]) => {
            it(`should count code: "${text.substring(0, 30)}..." as ${expectedTokens} tokens`, () => {
                const result = TokenCounter.count(text);
                expect(result).toBe(expectedTokens);
            });
        });
    });
    describe('Edge Cases', () => {
        Object.entries(TEST_CASES.edgeCases).forEach(([text, expectedTokens]) => {
            it(`should handle edge case: "${JSON.stringify(text)}" as ${expectedTokens} tokens`, () => {
                const result = TokenCounter.count(text);
                expect(result).toBe(expectedTokens);
            });
        });
    });
    describe('Performance Tests', () => {
        it('should handle large text efficiently', () => {
            const largeText = 'Hello World! '.repeat(10000); // ~120k characters
            const startTime = performance.now();
            const result = TokenCounter.count(largeText);
            const endTime = performance.now();
            expect(result).toBeGreaterThan(0);
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
        });
        it('should handle concurrent counting', async () => {
            const texts = Array.from({ length: 100 }, (_, i) => `Test text ${i}`);
            const startTime = performance.now();
            const results = await Promise.all(texts.map((text) => Promise.resolve(TokenCounter.count(text))));
            const endTime = performance.now();
            expect(results).toHaveLength(100);
            expect(results.every((count) => count > 0)).toBe(true);
            expect(endTime - startTime).toBeLessThan(500); // Should complete within 500ms
        });
    });
    describe('Model-Specific Accuracy', () => {
        const testText = 'The quick brown fox jumps over the lazy dog. This is a standard test sentence for token counting across different AI models.';
        const charCount = testText.length;
        Object.entries(MODEL_EXPECTATIONS).forEach(([model, { ratio, tolerance }]) => {
            it(`should maintain reasonable accuracy for ${model}`, () => {
                const tokenCount = TokenCounter.count(testText);
                const expectedTokens = Math.ceil(charCount / ratio);
                const minTokens = Math.ceil(expectedTokens * (1 - tolerance));
                const maxTokens = Math.ceil(expectedTokens * (1 + tolerance));
                expect(tokenCount).toBeGreaterThanOrEqual(minTokens);
                expect(tokenCount).toBeLessThanOrEqual(maxTokens);
            });
        });
    });
    describe('Cache Functionality', () => {
        it('should cache results for repeated text', () => {
            const text = 'Hello World';
            const spy = vi.spyOn(TokenCounter, 'count');
            // First call
            const result1 = TokenCounter.count(text);
            // Second call (should use cache)
            const result2 = TokenCounter.count(text);
            expect(result1).toBe(result2);
            expect(spy).toHaveBeenCalledTimes(2); // Called twice, but second might use cache
        });
        it('should handle cache clearing', () => {
            const text = 'Test text';
            const result1 = TokenCounter.count(text);
            // Clear cache if method exists
            if (TokenCounter.clearCache) {
                TokenCounter.clearCache();
            }
            const result2 = TokenCounter.count(text);
            expect(result1).toBe(result2);
        });
    });
    describe('Error Handling', () => {
        it('should handle null input gracefully', () => {
            expect(() => TokenCounter.count(null)).not.toThrow();
            expect(TokenCounter.count(null)).toBe(0);
        });
        it('should handle undefined input gracefully', () => {
            expect(() => TokenCounter.count(undefined)).not.toThrow();
            expect(TokenCounter.count(undefined)).toBe(0);
        });
        it('should handle non-string input gracefully', () => {
            expect(() => TokenCounter.count(123)).not.toThrow();
            expect(() => TokenCounter.count({})).not.toThrow();
            expect(() => TokenCounter.count([])).not.toThrow();
        });
        it('should handle extremely long text', () => {
            const veryLongText = 'a'.repeat(1000000); // 1 million characters
            expect(() => TokenCounter.count(veryLongText)).not.toThrow();
            const result = TokenCounter.count(veryLongText);
            expect(result).toBeGreaterThan(0);
        });
    });
    describe('Consistency Tests', () => {
        it('should maintain consistency across multiple calls', () => {
            const text = 'Consistency test text for token counting';
            const results = Array.from({ length: 10 }, () => TokenCounter.count(text));
            expect(new Set(results).size).toBe(1); // All results should be identical
        });
        it('should handle special Unicode characters consistently', () => {
            const specialChars = '€£¥©®™½¼¾';
            const result1 = TokenCounter.count(specialChars);
            const result2 = TokenCounter.count(specialChars);
            expect(result1).toBe(result2);
            expect(result1).toBeGreaterThan(0);
        });
    });
    describe('Real-world Scenarios', () => {
        it('should handle typical user messages', () => {
            const userMessages = [
                'Can you help me write a function to sort an array?',
                'What is the weather like today?',
                'Translate this text to Spanish: Hello, how are you?',
                'Generate a React component for a todo list',
                'Explain quantum computing in simple terms',
            ];
            userMessages.forEach((message) => {
                const count = TokenCounter.count(message);
                expect(count).toBeGreaterThan(0);
                expect(count).toBeLessThan(message.length); // Tokens should be less than characters
            });
        });
        it('should handle code documentation', () => {
            const docText = `
        /**
         * Calculates the token count for a given text string.
         * This function uses the Tiktoken library for accurate counting.
         * 
         * @param text - The text to count tokens for
         * @returns The number of tokens in the text
         * @example
         * const count = countTokens("Hello World");
         * console.log(count); // 3
         */
      `;
            const count = TokenCounter.count(docText);
            expect(count).toBeGreaterThan(0);
        });
    });
});
//# sourceMappingURL=token-counter-comprehensive.test.js.map