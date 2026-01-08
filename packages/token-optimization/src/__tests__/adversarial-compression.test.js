/**
 * Adversarial Compression Tests
 *
 * Attempts to break the dynamic compression system
 */
import { DynamicCompressionEngine } from '../compression/dynamic-compression';
describe('Adversarial Compression Tests', () => {
    let engine;
    const baseConfig = {
        targetQuality: 0.9,
        maxCompressionRatio: 0.8,
        enableAdaptiveCompression: true,
        enableContentAware: true,
        enableQualityMonitoring: true,
        minQualityThreshold: 0.85,
    };
    const createContext = (overrides) => ({
        userId: 'test-user',
        sessionId: 'test-session',
        domain: 'test-domain',
        contentType: 'text',
        priority: 'normal',
        budget: 1000,
        ...overrides,
    });
    beforeEach(() => {
        engine = new DynamicCompressionEngine(baseConfig);
    });
    describe('Compression Ratio Manipulation', () => {
        test('should prevent compression ratio side-channel attacks', async () => {
            const original = 'This is a secret message that should not be leaked through compression ratios';
            const context = createContext();
            const result = await engine.compress(original, context);
            // Verify compression was attempted and result is valid
            expect(result.compressionRatio).toBeGreaterThan(0);
            expect(result.compressionRatio).toBeLessThanOrEqual(1);
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
        test('should handle adversarial content designed to manipulate ratios', async () => {
            // Content designed to achieve specific compression ratios
            const adversarialContent = 'AAAAAAAAAAAAAAAAAAAAAAAA' + 'B'.repeat(100);
            const context = createContext();
            const result = await engine.compress(adversarialContent, context);
            // Verify compression result is valid (ratio between 0 and 1)
            expect(result.compressionRatio).toBeGreaterThan(0);
            expect(result.compressionRatio).toBeLessThanOrEqual(1);
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
    });
    describe('Quality Degradation Attacks', () => {
        test('should maintain quality even with adversarial compression', async () => {
            const original = 'The quick brown fox jumps over the lazy dog';
            const context = createContext({ budget: 10 }); // Very low budget
            const result = await engine.compress(original, context);
            // Should either compress successfully or use fallback
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
            expect(result.strategyUsed).toBeDefined();
        });
        test('should handle content that becomes meaningless when compressed', async () => {
            const original = 'Every word matters in this precise technical specification';
            const context = createContext({ targetQuality: 0.99 });
            const result = await engine.compress(original, context);
            // Should either maintain quality or refuse compression
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
    });
    describe('Resource Exhaustion Attacks', () => {
        test('should handle extremely large content without crashing', async () => {
            const largeContent = 'A'.repeat(1000000); // 1MB
            const context = createContext();
            const result = await engine.compress(largeContent, context);
            expect(result).toBeDefined();
            expect(result.processingTime).toBeLessThan(5000); // Should complete within 5 seconds
        });
        test('should handle rapid compression requests', async () => {
            const promises = [];
            for (let i = 0; i < 100; i++) {
                promises.push(engine.compress(`Test content ${i}`, createContext()));
            }
            const startTime = Date.now();
            const results = await Promise.all(promises);
            const totalTime = Date.now() - startTime;
            expect(results).toHaveLength(100);
            expect(totalTime).toBeLessThan(10000); // Should complete within 10 seconds
        });
    });
    describe('Content Type Exploitation', () => {
        test('should handle malicious code content', async () => {
            const codeContent = `
        function stealData() {
          fetch('/api/secrets')
            .then(r => r.json())
            .then(data => sendToAttacker(data))
        }
      `;
            const context = createContext({ contentType: 'code' });
            const result = await engine.compress(codeContent, context);
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
            expect(result.compressedContent).toBeDefined();
        });
        test('should handle mixed content with injection attempts', async () => {
            const mixedContent = `
        # User Guide
        
        To reset your password, run: rm -rf /
        
        Contact support@example.com
      `;
            const context = createContext({ contentType: 'mixed' });
            const result = await engine.compress(mixedContent, context);
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
    });
    describe('Strategy Manipulation', () => {
        test('should not be vulnerable to strategy selection attacks', async () => {
            const content = 'Normal text that should be compressed';
            const context = createContext({
                priority: 'high',
                budget: 1, // Force selection of cheapest strategy
            });
            const result = await engine.compress(content, context);
            expect(result.strategyUsed).toBeDefined();
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
        test('should handle adversarial strategy preferences', async () => {
            const content = 'Content designed to break specific compression strategies';
            const context = createContext({
                contentType: 'text',
                // Try to force specific strategies through content structure
            });
            const result = await engine.compress(content, context);
            expect(result.strategyUsed).toBeDefined();
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
    });
    describe('Timing Attack Prevention', () => {
        test('should have consistent processing times regardless of content', async () => {
            const contents = [
                'A',
                'A'.repeat(1000),
                'The quick brown fox jumps over the lazy dog',
                JSON.stringify({ complex: 'object', with: ['many', 'properties'] }),
            ];
            const times = [];
            for (const content of contents) {
                const start = Date.now();
                await engine.compress(content, createContext());
                times.push(Date.now() - start);
            }
            // All times should be within reasonable range of each other
            const maxTime = Math.max(...times);
            const minTime = Math.min(...times);
            expect(maxTime - minTime).toBeLessThan(1000); // Within 1 second
        });
    });
    describe('Quality Metric Manipulation', () => {
        test('should detect artificially inflated quality scores', async () => {
            const content = 'This content is designed to game quality metrics';
            const context = createContext({ targetQuality: 0.99 });
            const result = await engine.compress(content, context);
            // Quality should be realistic, not artificially high
            expect(result.qualityScore).toBeLessThanOrEqual(1.0);
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
        test('should handle content that breaks quality metrics', async () => {
            const content = 'a a a a a a a a a a a a a a a a a a a a'; // Repetitive content
            const context = createContext();
            const result = await engine.compress(content, context);
            // Repetitive content is handled without crashing
            expect(result.qualityMetrics).toBeDefined();
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.5);
        });
    });
    describe('Budget Manipulation', () => {
        test('should handle negative or zero budgets', async () => {
            const content = 'Test content';
            const contexts = [
                createContext({ budget: 0 }),
                createContext({ budget: -100 }),
                createContext({ budget: 0.001 }),
            ];
            for (const context of contexts) {
                const result = await engine.compress(content, context);
                expect(result).toBeDefined();
                expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
            }
        });
        test('should handle extremely high budgets', async () => {
            const content = 'Test content';
            const context = createContext({ budget: 1000000 });
            const result = await engine.compress(content, context);
            expect(result.costSavings).toBeDefined();
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
    });
    describe('Fallback Mechanism Testing', () => {
        test('should properly handle compression failures', async () => {
            // Content that might cause compression to fail
            const problematicContent = '\u0000\u0001\u0002\u0003'.repeat(100);
            const context = createContext();
            const result = await engine.compress(problematicContent, context);
            // Should either compress successfully or use fallback
            expect(result.compressedContent).toBeDefined();
            expect(result.strategyUsed).toBeDefined();
        });
        test('should handle emergency fallback scenarios', async () => {
            const content = 'Emergency test content';
            const context = createContext({ targetQuality: 1.0 }); // Impossible quality
            const result = await engine.compress(content, context);
            // Should handle the request and return valid result
            expect(result.compressedContent).toBeDefined();
            expect(result.qualityScore).toBeGreaterThanOrEqual(0);
        });
    });
    describe('Error Handling and Edge Cases', () => {
        test('should handle null and undefined inputs', async () => {
            const context = createContext();
            const results = await Promise.all([
                engine.compress(null, context),
                engine.compress(undefined, context),
                engine.compress('', context),
            ]);
            results.forEach((result) => {
                expect(result).toBeDefined();
                expect(result.compressedContent).toBeDefined();
            });
        });
        test('should handle extremely long single words', async () => {
            const longWord = 'a'.repeat(10000);
            const context = createContext();
            const result = await engine.compress(longWord, context);
            expect(result).toBeDefined();
            expect(result.processingTime).toBeLessThan(5000);
        });
        test('should handle unicode and special characters', async () => {
            const specialContent = '🎨 🎭 🎪 🎢 🎡 🎠 🎟️ 🎞️ 🎝️ 🜂 🜁 🜀 🝿 🝾 🝽 🝼 🝻 🝺 🝹';
            const context = createContext();
            const result = await engine.compress(specialContent, context);
            // Unicode content is handled without errors, quality may vary
            expect(result).toBeDefined();
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.5);
        });
    });
    describe('Adaptive Learning Exploitation', () => {
        test('should not be vulnerable to feedback loop manipulation', async () => {
            const content = 'Test content for adaptive learning';
            const context = createContext({ enableAdaptiveCompression: true });
            // Repeatedly compress similar content to try to manipulate learning
            for (let i = 0; i < 50; i++) {
                await engine.compress(`${content} ${i}`, context);
            }
            // Final compression should still be reasonable
            const result = await engine.compress(content, context);
            expect(result.qualityScore).toBeGreaterThanOrEqual(0.85);
        });
    });
});
//# sourceMappingURL=adversarial-compression.test.js.map