/**
 * Comprehensive Test Suite for Token Optimization Features
 *
 * Tests all new optimization modules:
 * - Text compression and preprocessing
 * - Intelligent caching strategies
 * - Smart truncation and summarization
 * - Dynamic optimization
 * - Dashboard and monitoring
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { 
// Text compression
compressText, compressForBudget, compressForRatio, SemanticCompressor, 
// Intelligent caching
SemanticCache, MultiLevelCache, CachedTokenCounter, createTokenCache, 
// Smart truncation
SmartTruncator, SmartSummarizer, truncateText, summarizeText, truncateConversation, 
// Dynamic optimization
DynamicOptimizer, optimizeForModel, optimizeForBudget, optimizeForCost, 
// Dashboard and monitoring
TokenOptimizationMonitor, TokenOptimizationAnalytics, createTokenMonitor, createTokenAnalytics, } from '../index';
describe('Token Optimization Test Suite', () => {
    describe('Text Compression Tests', () => {
        let compressor;
        beforeEach(() => {
            compressor = new SemanticCompressor();
        });
        it('should compress text using semantic strategy', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a simple test sentence for token compression testing.';
            const result = await compressText(text, {
                strategy: 'semantic',
                targetRatio: 0.7,
            });
            expect(result.compressionRatio).toBeLessThan(0.8);
            expect(result.compressedText).toBeTruthy();
            expect(result.compressedText.length).toBeLessThan(text.length);
        });
        it('should compress text for specific budget', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer test sentence that will be compressed to fit within a specific token budget.';
            const result = await compressForBudget(text, 20);
            expect(result.compressedTokens).toBeLessThanOrEqual(20);
            expect(result.compressedText).toBeTruthy();
        });
        it('should handle lossless compression', async () => {
            const text = 'The quick brown fox jumps over the lazy dog.';
            const result = await compressText(text, {
                strategy: 'lossless',
                targetRatio: 0.9,
            });
            expect(result.strategyUsed).toBe('lossless');
            expect(result.estimatedQuality).toBe(1.0);
            expect(result.compressedText.length).toBeLessThanOrEqual(text.length);
        });
        it('should preserve key terms during compression', async () => {
            const text = 'The artificial intelligence system uses machine learning algorithms to process natural language.';
            const result = await compressText(text, {
                strategy: 'semantic',
                targetRatio: 0.8,
                preserveKeyTerms: ['artificial intelligence', 'machine learning'],
            });
            expect(result.preservedTerms).toContain('artificial');
            expect(result.compressedText.toLowerCase()).toContain('artificial');
        });
        it('should handle multi-strategy compression', async () => {
            const text = 'This is a test sentence for multi-strategy compression. It should try different approaches and return multiple results.';
            const results = await compressMultiStrategy(text, ['semantic', 'extractive'], {
                strategy: 'semantic',
                targetRatio: 0.7,
            });
            expect(results.length).toBeGreaterThan(0);
            results.forEach((result) => {
                expect(result.compressedText).toBeTruthy();
                expect(result.compressionRatio).toBeLessThan(0.9);
            });
        });
    });
    describe('Intelligent Caching Tests', () => {
        let cache;
        beforeEach(() => {
            cache = new SemanticCache({
                strategy: 'semantic',
                maxSize: 100,
                similarityThreshold: 0.85,
            });
        });
        it('should cache and retrieve values', async () => {
            const key = 'test-key';
            const value = 42;
            await cache.set(key, value);
            const retrieved = await cache.get(key);
            expect(retrieved).toBe(value);
        });
        it('should handle cache misses', async () => {
            const result = await cache.get('non-existent-key');
            expect(result).toBeUndefined();
        });
        it('should provide fallback functionality', async () => {
            const key = 'expensive-computation';
            let callCount = 0;
            const fallback = async () => {
                callCount++;
                return 42;
            };
            // First call should trigger fallback
            const result1 = await cache.getWithFallback(key, fallback);
            expect(result1).toBe(42);
            expect(callCount).toBe(1);
            // Second call should use cache
            const result2 = await cache.getWithFallback(key, fallback);
            expect(result2).toBe(42);
            expect(callCount).toBe(1); // Fallback not called again
        });
        it('should handle cache eviction', async () => {
            const smallCache = new SemanticCache({
                strategy: 'lru',
                maxSize: 2,
            });
            await smallCache.set('key1', 1);
            await smallCache.set('key2', 2);
            await smallCache.set('key3', 3); // Should evict key1
            const result1 = await smallCache.get('key1');
            const result2 = await smallCache.get('key2');
            const result3 = await smallCache.get('key3');
            expect(result1).toBeUndefined();
            expect(result2).toBe(2);
            expect(result3).toBe(3);
        });
        it('should provide cache statistics', async () => {
            await cache.set('key1', 1);
            await cache.set('key2', 2);
            await cache.get('key1'); // Hit
            await cache.get('non-existent'); // Miss
            const stats = cache.getStats();
            expect(stats.entryCount).toBe(2);
            expect(stats.hits).toBe(1);
            expect(stats.misses).toBe(1);
        });
        it('should handle cached token counting', async () => {
            const cachedCounter = new CachedTokenCounter();
            const text1 = 'Hello world';
            const text2 = 'Hello world'; // Same text
            const count1 = await cachedCounter.count(text1);
            const count2 = await cachedCounter.count(text2);
            expect(count1).toBeGreaterThan(0);
            expect(count2).toBe(count1); // Should be cached
            const stats = cachedCounter.getCacheStats();
            expect(stats.hits).toBeGreaterThan(0);
        });
    });
    describe('Smart Truncation Tests', () => {
        let truncator;
        beforeEach(() => {
            truncator = new SmartTruncator();
        });
        it('should truncate text semantically', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be truncated. Another sentence here.';
            const result = await truncator.truncateSemantic(text, {
                strategy: 'semantic',
                maxTokens: 15,
            });
            expect(result.truncatedTokens).toBeLessThanOrEqual(15);
            expect(result.compressionRatio).toBeLessThan(1.0);
            expect(result.truncatedText).toBeTruthy();
        });
        it('should truncate text extractively', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be truncated. Another sentence here. Final sentence for testing.';
            const result = await truncator.truncateExtractive(text, {
                strategy: 'extractive',
                maxTokens: 20,
            });
            expect(result.truncatedTokens).toBeLessThanOrEqual(20);
            expect(result.strategyUsed).toBe('extractive');
            expect(result.preservedSentences.length).toBeGreaterThan(0);
        });
        it('should handle conversations', async () => {
            const conversation = `User: What is the weather today?
Assistant: The weather is sunny and warm.
User: What about tomorrow?
Assistant: Tomorrow will be cloudy with a chance of rain.`;
            const result = await truncator.truncateConversation(conversation, {
                strategy: 'adaptive',
                maxTokens: 25,
                contentType: 'conversation',
            });
            expect(result.truncatedTokens).toBeLessThanOrEqual(25);
            expect(result.truncatedText).toContain('User:');
            expect(result.truncatedText).toContain('Assistant:');
        });
        it('should generate summaries', async () => {
            const summarizer = new SmartSummarizer();
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be summarized. Another sentence here for testing.';
            const summary = await summarizer.summarize(text, {
                maxTokens: 10,
                style: 'concise',
            });
            expect(summary).toBeTruthy();
            expect(summary.length).toBeLessThan(text.length);
        });
        it('should truncate text using convenience function', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be truncated.';
            const truncated = await truncateText(text, 15, 'semantic', 'general');
            expect(truncated).toBeTruthy();
            expect(truncated.length).toBeLessThan(text.length);
        });
    });
    describe('Dynamic Optimization Tests', () => {
        let optimizer;
        beforeEach(() => {
            optimizer = new DynamicOptimizer();
        });
        it('should optimize for specific model', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be optimized for a specific model.';
            const result = await optimizeForModel(text, 'gpt-4', 'general');
            expect(result.optimizedText).toBeTruthy();
            expect(result.compressionRatio).toBeLessThan(1.0);
            expect(result.modelUsed).toBe('gpt-4');
            expect(result.recommendations).toBeInstanceOf(Array);
        });
        it('should optimize for budget', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be optimized to fit within a specific token budget.';
            const result = await optimizeForBudget(text, 20, 'gpt-4');
            expect(result.optimizedTokens).toBeLessThanOrEqual(20);
            expect(result.strategyUsed).toBe('budget-aware');
        });
        it('should optimize for cost', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be optimized to reduce costs.';
            const result = await optimizeForCost(text, 0.01, 'gpt-4');
            expect(result.costSavings).toBeGreaterThan(0);
            expect(result.strategyUsed).toBeTruthy();
        });
        it('should provide quality estimates', async () => {
            const text = 'The quick brown fox jumps over the lazy dog.';
            const result = await optimizeForModel(text, 'gpt-4', 'general');
            expect(result.estimatedQuality).toBeGreaterThan(0);
            expect(result.estimatedQuality).toBeLessThanOrEqual(1);
        });
    });
    describe('Dashboard and Monitoring Tests', () => {
        let monitor;
        beforeEach(() => {
            monitor = createTokenMonitor();
        });
        it('should record token usage', async () => {
            const originalText = 'The quick brown fox jumps over the lazy dog. This is the original text that will be optimized.';
            const optimizedText = 'The quick brown fox jumps over the lazy dog. Optimized text.';
            await recordTokenUsage(monitor, originalText, optimizedText, 'gpt-4', 'semantic', 0.9, 100);
            const metrics = monitor.getRealTimeMetrics();
            expect(metrics.totalTokensUsed).toBeGreaterThan(0);
            expect(metrics.tokensSaved).toBeGreaterThan(0);
        });
        it('should provide historical data', async () => {
            // Record some usage
            await recordTokenUsage(monitor, 'Original text for testing', 'Optimized text', 'gpt-4', 'semantic', 0.9, 100);
            const historicalData = monitor.getHistoricalData('24h');
            expect(historicalData).toBeInstanceOf(Array);
            expect(historicalData.length).toBeGreaterThan(0);
        });
        it('should provide cost analysis', () => {
            const costAnalysis = monitor.getCostAnalysis();
            expect(costAnalysis).toHaveProperty('totalSpent');
            expect(costAnalysis).toHaveProperty('totalSaved');
            expect(costAnalysis).toHaveProperty('roi');
            expect(costAnalysis).toHaveProperty('costPerToken');
            expect(costAnalysis).toHaveProperty('projectedSavings');
        });
        it('should provide performance insights', () => {
            const insights = monitor.getPerformanceInsights();
            expect(insights).toHaveProperty('topOptimizations');
            expect(insights).toHaveProperty('bottlenecks');
            expect(insights).toHaveProperty('recommendations');
            expect(insights).toHaveProperty('trends');
            expect(insights.topOptimizations).toBeInstanceOf(Array);
            expect(insights.bottlenecks).toBeInstanceOf(Array);
            expect(insights.recommendations).toBeInstanceOf(Array);
            expect(insights.trends).toBeInstanceOf(Array);
        });
        it('should handle alerts', () => {
            monitor.configureAlert({
                type: 'quality',
                threshold: 0.8,
                comparison: 'less',
                message: 'Quality below threshold',
                severity: 'medium',
                enabled: true,
            });
            const alerts = monitor.getAlerts();
            expect(alerts).toBeInstanceOf(Array);
        });
        it('should export data', async () => {
            // Record some usage first
            await recordTokenUsage(monitor, 'Test text', 'Optimized', 'gpt-4', 'semantic', 0.9, 100);
            const jsonExport = await monitor.exportData('json');
            expect(jsonExport).toBeTruthy();
            expect(() => JSON.parse(jsonExport)).not.toThrow();
            const csvExport = await monitor.exportData('csv');
            expect(csvExport).toBeTruthy();
            expect(csvExport).toContain('timestamp');
        });
        it('should provide analytics', () => {
            const analytics = createTokenAnalytics(monitor);
            const effectiveness = analytics.analyzeEffectiveness();
            expect(effectiveness).toHaveProperty('effectiveness');
            expect(effectiveness).toHaveProperty('trends');
            expect(effectiveness).toHaveProperty('recommendations');
            expect(effectiveness).toHaveProperty('benchmarkComparison');
        });
        it('should predict usage', () => {
            const analytics = createTokenAnalytics(monitor);
            // Record some historical data
            for (let i = 0; i < 10; i++) {
                recordTokenUsage(monitor, 'Test text ' + i, 'Optimized ' + i, 'gpt-4', 'semantic', 0.9, 100);
            }
            const prediction = analytics.predictUsage(7); // 7 days
            expect(prediction).toHaveProperty('predictedTokens');
            expect(prediction).toHaveProperty('confidence');
            expect(prediction).toHaveProperty('factors');
        });
    });
    describe('Integration Tests', () => {
        it('should integrate compression with caching', async () => {
            const cache = new SemanticCache({
                strategy: 'semantic',
                maxSize: 100,
            });
            const text = 'The quick brown fox jumps over the lazy dog.';
            // Compress text
            const compressed = await compressText(text, {
                strategy: 'lossless',
                targetRatio: 0.9,
            });
            // Cache the compression result
            await cache.set('compression-result', compressed, text);
            // Retrieve from cache
            const cached = await cache.get('compression-result', text);
            expect(cached).toBeDefined();
            expect(cached?.compressedText).toBe(compressed.compressedText);
        });
        it('should integrate truncation with optimization', async () => {
            const text = 'The quick brown fox jumps over the lazy dog. This is a longer sentence that will be optimized and then truncated.';
            // First optimize for model
            const optimized = await optimizeForModel(text, 'gpt-4', 'general');
            // Then truncate if needed
            const truncated = await truncateText(optimized.optimizedText, 15, 'semantic', 'general');
            expect(truncated).toBeTruthy();
            expect(truncated.length).toBeLessThanOrEqual(text.length);
        });
        it('should provide end-to-end token optimization pipeline', async () => {
            const monitor = createTokenMonitor();
            const originalText = 'The quick brown fox jumps over the lazy dog. This is a comprehensive test of the token optimization pipeline with multiple stages including compression, caching, truncation, and monitoring.';
            // Step 1: Compress text
            const compressed = await compressText(originalText, {
                strategy: 'moderate',
                targetRatio: 0.6,
            });
            // Step 2: Cache the result
            const cache = await createTokenCache();
            await cache.set('optimized-text', compressed.compressedText, compressed.compressedText);
            // Step 3: Truncate if needed
            const truncated = await truncateText(compressed.compressedText, 25, 'semantic', 'general');
            // Step 4: Record usage
            await recordTokenUsage(monitor, originalText, truncated, 'gpt-4', 'pipeline', 0.85, 150);
            // Verify results
            const metrics = monitor.getRealTimeMetrics();
            expect(metrics.totalTokensUsed).toBeGreaterThan(0);
            expect(metrics.compressionRatio).toBeLessThan(1.0);
            const cached = await cache.get('optimized-text', compressed.compressedText);
            expect(cached).toBe(compressed.compressedText);
        });
    });
    describe('Error Handling Tests', () => {
        it('should handle invalid compression strategies gracefully', async () => {
            const text = 'Test text';
            // @ts-expect-error Testing invalid strategy
            const result = await compressText(text, {
                strategy: 'invalid-strategy',
                targetRatio: 0.7,
            });
            expect(result).toBeDefined();
            expect(result.compressedText).toBeTruthy();
        });
        it('should handle empty text', async () => {
            const text = '';
            const result = await compressText(text, {
                strategy: 'semantic',
                targetRatio: 0.7,
            });
            expect(result.compressedText).toBe('');
            expect(result.compressionRatio).toBe(1.0);
        });
        it('should handle cache errors gracefully', async () => {
            const cache = new SemanticCache({
                strategy: 'lru',
                maxSize: 1,
            });
            // Should handle errors without crashing
            const result = await cache.get('non-existent');
            expect(result).toBeUndefined();
        });
        it('should handle optimization errors', async () => {
            const text = 'Test text';
            // Should handle unknown models gracefully
            const result = await optimizeForModel(text, 'unknown-model', 'general');
            expect(result).toBeDefined();
            expect(result.optimizedText).toBeTruthy();
        });
    });
    describe('Performance Tests', () => {
        it('should handle large text efficiently', async () => {
            const largeText = 'The quick brown fox jumps over the lazy dog. '.repeat(1000);
            const startTime = Date.now();
            const result = await compressText(largeText, {
                strategy: 'lossless',
                targetRatio: 0.9,
            });
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            expect(result.compressedText).toBeTruthy();
            expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds
        });
        it('should handle batch operations efficiently', async () => {
            const texts = Array.from({ length: 100 }, (_, i) => `Test text ${i}`);
            const startTime = Date.now();
            const cachedCounter = new CachedTokenCounter();
            const results = await cachedCounter.countBatch(texts);
            const endTime = Date.now();
            const processingTime = endTime - startTime;
            expect(results).toHaveLength(100);
            expect(processingTime).toBeLessThan(1000); // Should complete within 1 second
        });
        it('should maintain cache performance', async () => {
            const cache = new SemanticCache({
                strategy: 'lru',
                maxSize: 1000,
            });
            // Fill cache
            for (let i = 0; i < 100; i++) {
                await cache.set(`key${i}`, `value${i}`);
            }
            const startTime = Date.now();
            // Access cached values
            for (let i = 0; i < 100; i++) {
                await cache.get(`key${i}`);
            }
            const endTime = Date.now();
            const accessTime = endTime - startTime;
            expect(accessTime).toBeLessThan(100); // Should be very fast
        });
    });
});
//# sourceMappingURL=token-optimization-comprehensive.test.js.map