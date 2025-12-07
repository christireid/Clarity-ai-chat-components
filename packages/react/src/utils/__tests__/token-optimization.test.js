/**
 * Token Optimization Utilities Tests
 */
import { describe, it, expect } from 'vitest';
import { shortenPrompt, calculateTokenSavings, estimateTokens, limitHistorySlidingWindow, limitHistoryFIFO, limitHistorySmart, createCache, generateCacheKey, createThrottler, routeToModel, estimateRoutingSavings, createReference, shouldUseReference, enforceOutputLimit, createBatcher, calculateSimilarity, findSimilarCached, } from '../token-optimization';
describe('Token Optimization Utilities', () => {
    describe('shortenPrompt', () => {
        it('should remove filler words', () => {
            const result = shortenPrompt('I really, really want to know, um, you know, what the weather is', {
                removeFillers: true,
            });
            expect(result).not.toContain('really, really');
            expect(result).not.toContain('um');
            expect(result).not.toContain('you know');
        });
        it('should remove duplicate sentences', () => {
            const result = shortenPrompt('Hello. Hello. How are you?', {
                removeDuplicates: true,
            });
            const sentences = result.split(/[.!?]+/).filter(s => s.trim());
            expect(sentences.length).toBeLessThanOrEqual(2);
        });
        it('should preserve important keywords', () => {
            const result = shortenPrompt('I really want to know about weather', {
                removeFillers: true,
                preserveKeywords: ['weather'],
            });
            expect(result).toContain('weather');
        });
    });
    describe('calculateTokenSavings', () => {
        it('should calculate correct savings', () => {
            const original = 'This is a very long prompt with many words';
            const shortened = 'This is a prompt with words';
            const savings = calculateTokenSavings(original, shortened);
            expect(savings.tokensSaved).toBeGreaterThan(0);
            expect(savings.percentage).toBeGreaterThan(0);
            expect(savings.originalTokens).toBeGreaterThan(savings.shortenedTokens);
        });
    });
    describe('estimateTokens', () => {
        it('should estimate tokens correctly', () => {
            const text = 'Hello world';
            const tokens = estimateTokens(text);
            expect(tokens).toBeGreaterThan(0);
            expect(tokens).toBeLessThan(text.length);
        });
    });
    describe('limitHistorySlidingWindow', () => {
        it('should limit to max messages', () => {
            const messages = Array.from({ length: 20 }, (_, i) => ({
                id: `msg-${i}`,
                role: i % 2 === 0 ? 'user' : 'assistant',
                content: `Message ${i}`,
            }));
            const limited = limitHistorySlidingWindow(messages, { maxMessages: 10 });
            expect(limited.length).toBeLessThanOrEqual(10);
        });
        it('should keep system message', () => {
            const messages = [
                { id: 'sys', role: 'system', content: 'System prompt' },
                ...Array.from({ length: 10 }, (_, i) => ({
                    id: `msg-${i}`,
                    role: 'user',
                    content: `Message ${i}`,
                })),
            ];
            const limited = limitHistorySlidingWindow(messages, { keepSystemMessage: true });
            expect(limited[0].role).toBe('system');
        });
    });
    describe('limitHistoryFIFO', () => {
        it('should respect token limits', () => {
            const messages = Array.from({ length: 20 }, (_, i) => ({
                id: `msg-${i}`,
                role: 'user',
                content: `Message ${i} with some content`,
            }));
            const limited = limitHistoryFIFO(messages, { maxTokens: 100 });
            const totalTokens = limited.reduce((sum, msg) => sum + estimateTokens(typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)), 0);
            expect(totalTokens).toBeLessThanOrEqual(100);
        });
    });
    describe('limitHistorySmart', () => {
        it('should keep conversation pairs together', () => {
            const messages = [
                { id: 'u1', role: 'user', content: 'Hello' },
                { id: 'a1', role: 'assistant', content: 'Hi there' },
                { id: 'u2', role: 'user', content: 'How are you?' },
                { id: 'a2', role: 'assistant', content: 'Good!' },
            ];
            const limited = limitHistorySmart(messages, { maxTokens: 100 });
            // Should keep pairs together
            expect(limited.length % 2).toBe(0);
        });
    });
    describe('createCache', () => {
        it('should store and retrieve values', () => {
            const cache = createCache();
            cache.set('key1', 'value1', 1000);
            expect(cache.get('key1')).toBe('value1');
        });
        it('should expire values after TTL', async () => {
            const cache = createCache();
            cache.set('key1', 'value1', 100);
            await new Promise(resolve => setTimeout(resolve, 150));
            expect(cache.get('key1')).toBeNull();
        });
        it('should respect max size', () => {
            const cache = createCache({ maxSize: 2 });
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');
            expect(cache.size()).toBeLessThanOrEqual(2);
        });
    });
    describe('generateCacheKey', () => {
        it('should generate consistent keys', () => {
            const key1 = generateCacheKey('Hello world');
            const key2 = generateCacheKey('Hello world');
            expect(key1).toBe(key2);
        });
        it('should generate different keys for different content', () => {
            const key1 = generateCacheKey('Hello');
            const key2 = generateCacheKey('World');
            expect(key1).not.toBe(key2);
        });
    });
    describe('createThrottler', () => {
        it('should allow requests within limits', () => {
            const throttler = createThrottler({ minDelay: 100, maxRequests: 10 });
            expect(throttler.canMakeRequest()).toBe(true);
        });
        it('should throttle after max requests', () => {
            const throttler = createThrottler({ maxRequests: 2, timeWindow: 1000 });
            throttler.recordRequest();
            throttler.recordRequest();
            expect(throttler.canMakeRequest()).toBe(false);
        });
        it('should enforce minimum delay', () => {
            const throttler = createThrottler({ minDelay: 100 });
            throttler.recordRequest();
            expect(throttler.canMakeRequest()).toBe(false);
        });
    });
    describe('routeToModel', () => {
        it('should route simple queries to simple model', () => {
            const model = routeToModel('Hello', {
                simpleModel: 'gpt-3.5-turbo',
                complexModel: 'gpt-4',
                complexityThreshold: 50,
            });
            expect(model).toBe('gpt-3.5-turbo');
        });
        it('should route complex queries to complex model', () => {
            const longQuery = 'a'.repeat(200); // Large query
            const model = routeToModel(longQuery, {
                simpleModel: 'gpt-3.5-turbo',
                complexModel: 'gpt-4',
                complexityThreshold: 50,
            });
            expect(model).toBe('gpt-4');
        });
    });
    describe('estimateRoutingSavings', () => {
        it('should calculate savings for simple queries', () => {
            const savings = estimateRoutingSavings('Hello', {
                simpleModel: 'gpt-3.5-turbo',
                complexModel: 'gpt-4',
                simpleModelCost: 0.0000005,
                complexModelCost: 0.00003,
            });
            expect(savings.saved).toBeGreaterThan(0);
            expect(savings.selectedModel).toBe('gpt-3.5-turbo');
        });
    });
    describe('createReference', () => {
        it('should create reference for large data', () => {
            const largeData = 'a'.repeat(2000);
            const ref = createReference(largeData, { maxSize: 1000 });
            expect(ref.type).toBe('reference');
            if (ref.type === 'reference') {
                expect(ref.id).toBeDefined();
                expect(ref.originalSize).toBeGreaterThan(1000);
            }
        });
        it('should return data for small content', () => {
            const smallData = 'Hello';
            const ref = createReference(smallData, { maxSize: 1000 });
            expect(ref.type).toBe('data');
            if (ref.type === 'data') {
                expect(ref.data).toBe(smallData);
            }
        });
    });
    describe('shouldUseReference', () => {
        it('should return true for large data', () => {
            const largeData = 'a'.repeat(2000);
            expect(shouldUseReference(largeData, { maxSize: 1000 })).toBe(true);
        });
        it('should return false for small data', () => {
            const smallData = 'Hello';
            expect(shouldUseReference(smallData, { maxSize: 1000 })).toBe(false);
        });
    });
    describe('enforceOutputLimit', () => {
        it('should truncate at character limit', () => {
            const longOutput = 'a'.repeat(100);
            const limited = enforceOutputLimit(longOutput, { maxCharacters: 50 });
            expect(limited.length).toBeLessThanOrEqual(53); // 50 + '...'
        });
        it('should truncate at token limit', () => {
            const longOutput = 'a'.repeat(100);
            const limited = enforceOutputLimit(longOutput, { maxTokens: 10 });
            expect(limited.length).toBeLessThanOrEqual(35 + 3); // ~10 tokens * 3.5 + '...'
        });
        it('should truncate at sentence boundary when smart', () => {
            const output = 'First sentence. Second sentence. Third sentence.';
            const limited = enforceOutputLimit(output, {
                maxCharacters: 20,
                truncationStrategy: 'smart',
            });
            expect(limited).toContain('.');
        });
    });
    describe('createBatcher', () => {
        it('should batch requests', async () => {
            const batcher = createBatcher({ batchSize: 2, maxWaitTime: 100 });
            const results = await Promise.all([
                batcher.add(() => Promise.resolve(1)),
                batcher.add(() => Promise.resolve(2)),
            ]);
            expect(results).toEqual([1, 2]);
        });
    });
    describe('calculateSimilarity', () => {
        it('should calculate similarity correctly', () => {
            const sim = calculateSimilarity('hello world', 'hello world');
            expect(sim).toBe(1);
        });
        it('should return 0 for completely different strings', () => {
            const sim = calculateSimilarity('hello', 'xyz');
            expect(sim).toBeLessThan(0.5);
        });
    });
    describe('findSimilarCached', () => {
        it('should find similar cached responses', () => {
            const cache = new Map([
                ['key1', { query: 'What is the weather?', response: 'Sunny', timestamp: Date.now() }],
                ['key2', { query: 'How are you?', response: 'Good', timestamp: Date.now() }],
            ]);
            const cached = findSimilarCached('What\'s the weather like?', cache, 0.7);
            expect(cached).toBe('Sunny');
        });
        it('should return null if no similar match', () => {
            const cache = new Map([
                ['key1', { query: 'Hello', response: 'Hi', timestamp: Date.now() }],
            ]);
            const cached = findSimilarCached('Completely different query', cache, 0.7);
            expect(cached).toBeNull();
        });
    });
});
//# sourceMappingURL=token-optimization.test.js.map