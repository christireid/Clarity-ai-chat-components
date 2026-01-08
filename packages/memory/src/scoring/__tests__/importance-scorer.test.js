/**
 * ImportanceScorer Tests
 *
 * Comprehensive tests for memory importance scoring
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { ImportanceScorer, } from '../importance-scorer';
// Helper to create test memories
function createMemory(overrides = {}) {
    return {
        id: `mem-${Math.random().toString(36).slice(2)}`,
        content: 'Test memory content',
        type: 'episodic',
        scope: 'session',
        importance: 0.5,
        accessCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        timestamp: new Date(),
        tokens: 10,
        confidence: 0.8,
        priority: 'medium',
        metadata: {},
        ...overrides,
    };
}
describe('ImportanceScorer', () => {
    let scorer;
    beforeEach(() => {
        scorer = new ImportanceScorer();
    });
    describe('constructor', () => {
        it('should create with default config', () => {
            const s = new ImportanceScorer();
            expect(s).toBeDefined();
        });
        it('should accept custom config', () => {
            const s = new ImportanceScorer({
                recencyHalfLife: 14,
                maxFrequencyAccesses: 20,
                weights: {
                    base: 0.3,
                    recency: 0.2,
                },
            });
            expect(s).toBeDefined();
        });
        it('should use default values for missing config', () => {
            const s = new ImportanceScorer({
                recencyHalfLife: 14,
                // Other values should use defaults
            });
            expect(s).toBeDefined();
        });
    });
    describe('score', () => {
        it('should return a score between 0 and 1', () => {
            const memory = createMemory();
            const result = scorer.score(memory);
            expect(result.final).toBeGreaterThanOrEqual(0);
            expect(result.final).toBeLessThanOrEqual(1);
        });
        it('should include all score components', () => {
            const memory = createMemory();
            const result = scorer.score(memory);
            expect(result).toHaveProperty('base');
            expect(result).toHaveProperty('recency');
            expect(result).toHaveProperty('frequency');
            expect(result).toHaveProperty('userBoost');
            expect(result).toHaveProperty('semanticRelevance');
            expect(result).toHaveProperty('final');
            expect(result).toHaveProperty('breakdown');
        });
        it('should use memory importance as base', () => {
            const memory = createMemory({ importance: 0.9 });
            const result = scorer.score(memory);
            expect(result.base).toBe(0.9);
        });
        it('should default base to 0.5 when importance is missing', () => {
            const memory = createMemory();
            delete memory.importance;
            const result = scorer.score(memory);
            expect(result.base).toBe(0.5);
        });
        it('should give higher recency to newer memories', () => {
            const now = new Date();
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const newMemory = createMemory({
                createdAt: now,
                timestamp: now,
            });
            const oldMemory = createMemory({
                createdAt: thirtyDaysAgo,
                timestamp: thirtyDaysAgo,
            });
            const newResult = scorer.score(newMemory);
            const oldResult = scorer.score(oldMemory);
            expect(newResult.recency).toBeGreaterThan(oldResult.recency);
        });
        it('should give higher frequency to more accessed memories', () => {
            const lowAccess = createMemory({ accessCount: 1 });
            const highAccess = createMemory({ accessCount: 10 });
            const lowResult = scorer.score(lowAccess);
            const highResult = scorer.score(highAccess);
            expect(highResult.frequency).toBeGreaterThan(lowResult.frequency);
        });
        it('should cap frequency at 1.0', () => {
            const highAccess = createMemory({ accessCount: 100 });
            const result = scorer.score(highAccess);
            expect(result.frequency).toBe(1);
        });
        it('should give user boost for user-scoped memories', () => {
            const sessionMemory = createMemory({ scope: 'session' });
            const userMemory = createMemory({ scope: 'user' });
            const sessionResult = scorer.score(sessionMemory);
            const userResult = scorer.score(userMemory);
            expect(userResult.userBoost).toBe(0.1);
            expect(sessionResult.userBoost).toBe(0);
        });
    });
    describe('semantic relevance', () => {
        it('should return 0.5 when no query is provided', () => {
            const memory = createMemory({ content: 'User prefers TypeScript' });
            const result = scorer.score(memory);
            expect(result.semanticRelevance).toBe(0.5);
        });
        it('should return 0.5 for empty query', () => {
            const memory = createMemory({ content: 'User prefers TypeScript' });
            const result = scorer.score(memory, '');
            expect(result.semanticRelevance).toBe(0.5);
        });
        it('should return 0.5 for whitespace-only query', () => {
            const memory = createMemory({ content: 'User prefers TypeScript' });
            const result = scorer.score(memory, '   ');
            expect(result.semanticRelevance).toBe(0.5);
        });
        it('should return high score for exact substring match', () => {
            const memory = createMemory({ content: 'User prefers TypeScript' });
            const result = scorer.score(memory, 'TypeScript');
            expect(result.semanticRelevance).toBeGreaterThan(0.8);
        });
        it('should return high score for case-insensitive match', () => {
            const memory = createMemory({ content: 'User prefers TypeScript' });
            const result = scorer.score(memory, 'typescript');
            expect(result.semanticRelevance).toBeGreaterThan(0.8);
        });
        it('should return medium score for word overlap', () => {
            const memory = createMemory({
                content: 'User prefers TypeScript for development',
            });
            const result = scorer.score(memory, 'TypeScript development');
            expect(result.semanticRelevance).toBeGreaterThan(0.5);
        });
        it('should return low score for no match', () => {
            const memory = createMemory({ content: 'User prefers TypeScript' });
            const result = scorer.score(memory, 'Python Django Flask');
            expect(result.semanticRelevance).toBeLessThan(0.5);
        });
        it('should handle partial/prefix matching', () => {
            const memory = createMemory({ content: 'User prefers programming' });
            const result = scorer.score(memory, 'program');
            // Should find partial match
            expect(result.semanticRelevance).toBeGreaterThan(0.1);
        });
        it('should filter stop words', () => {
            const memory = createMemory({ content: 'quick brown fox jumps' });
            // Query with only stop words should give neutral relevance
            const result = scorer.score(memory, 'is the a');
            // Stop words should be filtered, leaving no meaningful tokens
            expect(result.semanticRelevance).toBe(0.5);
        });
        it('should handle empty content', () => {
            const memory = createMemory({ content: '' });
            const result = scorer.score(memory, 'test');
            expect(result.semanticRelevance).toBe(0.1);
        });
        it('should handle undefined content', () => {
            const memory = createMemory();
            // @ts-expect-error - Testing edge case
            memory.content = undefined;
            const result = scorer.score(memory, 'test');
            expect(result.semanticRelevance).toBe(0.1);
        });
        it('should weight longer words more heavily', () => {
            const memory = createMemory({
                content: 'authentication authorization infrastructure',
            });
            // Longer matching words should contribute more
            const result = scorer.score(memory, 'authentication');
            expect(result.semanticRelevance).toBeGreaterThan(0.5);
        });
    });
    describe('scoreBatch', () => {
        it('should score multiple memories', () => {
            const memories = [
                createMemory({ content: 'TypeScript is great' }),
                createMemory({ content: 'Python is popular' }),
                createMemory({ content: 'JavaScript everywhere' }),
            ];
            const results = scorer.scoreBatch(memories, 'TypeScript');
            expect(results).toHaveLength(3);
            expect(results[0].memory).toBeDefined();
            expect(results[0].score).toBeDefined();
        });
        it('should sort by final score descending', () => {
            const memories = [
                createMemory({ content: 'Python programming', importance: 0.3 }),
                createMemory({ content: 'TypeScript code', importance: 0.9 }),
                createMemory({ content: 'JavaScript web', importance: 0.5 }),
            ];
            const results = scorer.scoreBatch(memories, 'TypeScript');
            // TypeScript match should be first
            expect(results[0].memory.content).toContain('TypeScript');
            // Should be sorted by score descending
            for (let i = 1; i < results.length; i++) {
                expect(results[i - 1].score.final).toBeGreaterThanOrEqual(results[i].score.final);
            }
        });
        it('should work without query', () => {
            const memories = [
                createMemory({ importance: 0.3 }),
                createMemory({ importance: 0.9 }),
            ];
            const results = scorer.scoreBatch(memories);
            expect(results).toHaveLength(2);
            // Higher importance should be first
            expect(results[0].memory.importance).toBe(0.9);
        });
        it('should return empty array for empty input', () => {
            const results = scorer.scoreBatch([]);
            expect(results).toHaveLength(0);
        });
    });
    describe('recency calculation', () => {
        it('should return 1 for brand new memories', () => {
            const now = new Date();
            const memory = createMemory({ createdAt: now, timestamp: now });
            const result = scorer.score(memory);
            expect(result.recency).toBeGreaterThan(0.99);
        });
        it('should return ~0.5 at half-life (7 days default)', () => {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const memory = createMemory({
                createdAt: sevenDaysAgo,
                timestamp: sevenDaysAgo,
            });
            const result = scorer.score(memory);
            expect(result.recency).toBeGreaterThan(0.45);
            expect(result.recency).toBeLessThan(0.55);
        });
        it('should approach 0 for very old memories', () => {
            const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            const memory = createMemory({
                createdAt: oneYearAgo,
                timestamp: oneYearAgo,
            });
            const result = scorer.score(memory);
            expect(result.recency).toBeLessThan(0.01);
        });
        it('should handle custom half-life', () => {
            const customScorer = new ImportanceScorer({ recencyHalfLife: 1 }); // 1 day
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const memory = createMemory({
                createdAt: oneDayAgo,
                timestamp: oneDayAgo,
            });
            const result = customScorer.score(memory);
            expect(result.recency).toBeGreaterThan(0.45);
            expect(result.recency).toBeLessThan(0.55);
        });
        it('should use timestamp if createdAt is missing', () => {
            const memory = createMemory({
                timestamp: new Date(),
            });
            // @ts-expect-error - Testing edge case
            delete memory.createdAt;
            const result = scorer.score(memory);
            expect(result.recency).toBeGreaterThan(0.99);
        });
        it('should return 0.5 if both timestamp and createdAt are missing', () => {
            const memory = createMemory();
            // @ts-expect-error - Testing edge case
            delete memory.createdAt;
            // @ts-expect-error - Testing edge case
            delete memory.timestamp;
            const result = scorer.score(memory);
            expect(result.recency).toBe(0.5);
        });
        it('should return 1 for future dates', () => {
            const memory = createMemory({
                createdAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            });
            const result = scorer.score(memory);
            expect(result.recency).toBe(1);
        });
        it('should handle invalid dates', () => {
            const memory = createMemory({
                createdAt: new Date('invalid'),
            });
            const result = scorer.score(memory);
            // Should not throw and return a reasonable value
            expect(result.recency).toBeDefined();
        });
    });
    describe('frequency calculation', () => {
        it('should return 0 for zero access count', () => {
            const memory = createMemory({ accessCount: 0 });
            const result = scorer.score(memory);
            expect(result.frequency).toBe(0);
        });
        it('should return 0.5 at half of max accesses', () => {
            const memory = createMemory({ accessCount: 5 }); // Default max is 10
            const result = scorer.score(memory);
            expect(result.frequency).toBe(0.5);
        });
        it('should cap at 1.0 at max accesses', () => {
            const memory = createMemory({ accessCount: 10 });
            const result = scorer.score(memory);
            expect(result.frequency).toBe(1);
        });
        it('should respect custom maxFrequencyAccesses', () => {
            const customScorer = new ImportanceScorer({ maxFrequencyAccesses: 20 });
            const memory = createMemory({ accessCount: 10 });
            const result = customScorer.score(memory);
            expect(result.frequency).toBe(0.5); // 10/20
        });
        it('should handle missing accessCount', () => {
            const memory = createMemory();
            delete memory.accessCount;
            const result = scorer.score(memory);
            expect(result.frequency).toBe(0);
        });
    });
    describe('custom weights', () => {
        it('should apply custom base weight', () => {
            const customScorer = new ImportanceScorer({
                weights: { base: 1.0, recency: 0, frequency: 0, relevance: 0 },
            });
            const memory = createMemory({ importance: 0.8, scope: 'session' });
            const result = customScorer.score(memory);
            // Only base weight matters
            expect(result.final).toBeCloseTo(0.8, 1);
        });
        it('should apply custom recency weight', () => {
            const customScorer = new ImportanceScorer({
                weights: { base: 0, recency: 1.0, frequency: 0, relevance: 0 },
            });
            const memory = createMemory({
                createdAt: new Date(),
                scope: 'session',
            });
            const result = customScorer.score(memory);
            // Only recency matters, should be close to 1
            expect(result.final).toBeGreaterThan(0.9);
        });
        it('should include breakdown in result', () => {
            const result = scorer.score(createMemory());
            expect(result.breakdown).toHaveProperty('recencyWeight');
            expect(result.breakdown).toHaveProperty('frequencyWeight');
            expect(result.breakdown).toHaveProperty('relevanceWeight');
        });
    });
    describe('edge cases', () => {
        it('should handle memory with all minimum values', () => {
            const memory = createMemory({
                importance: 0,
                accessCount: 0,
                createdAt: new Date(0), // Very old
                content: '',
            });
            const result = scorer.score(memory, 'test');
            expect(result.final).toBeGreaterThanOrEqual(0);
            expect(result.final).toBeLessThanOrEqual(1);
        });
        it('should handle memory with all maximum values', () => {
            const memory = createMemory({
                importance: 1,
                accessCount: 100,
                createdAt: new Date(),
                scope: 'user',
                content: 'test content for matching',
            });
            const result = scorer.score(memory, 'test');
            expect(result.final).toBeGreaterThanOrEqual(0);
            expect(result.final).toBeLessThanOrEqual(1);
        });
        it('should not exceed 1.0 even with user boost', () => {
            const memory = createMemory({
                importance: 1,
                accessCount: 100,
                createdAt: new Date(),
                scope: 'user',
                content: 'exact match query',
            });
            const result = scorer.score(memory, 'exact match query');
            expect(result.final).toBeLessThanOrEqual(1);
        });
        it('should handle special characters in content', () => {
            const memory = createMemory({
                content: "User's email: test@example.com (verified)",
            });
            const result = scorer.score(memory, 'email');
            expect(result).toBeDefined();
            expect(result.semanticRelevance).toBeGreaterThan(0.1);
        });
        it('should handle unicode content', () => {
            const memory = createMemory({
                content: 'User likes 日本語 and emoji 🎉',
            });
            const result = scorer.score(memory, 'emoji');
            expect(result).toBeDefined();
        });
    });
});
//# sourceMappingURL=importance-scorer.test.js.map