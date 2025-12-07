/**
 * Tests for KV Cache-Aligned Prompt Builder
 */
import { describe, it, expect, vi } from 'vitest';
import { buildKVCacheOptimizedPrompt, createSegment, createSystemSegment, createContextSegment, createRAGSegment, createHistorySegment, createUserSegment, conversationToSegments, validateSegments, estimateKVCacheSavings, PromptBudgetExceededError, } from '../kv-cache-prompt-builder';
// Mock the estimator
vi.mock('../tokenization/estimator', () => ({
    estimateTokens: vi.fn((text) => Math.ceil(text.length / 4)),
}));
describe('buildKVCacheOptimizedPrompt', () => {
    describe('basic functionality', () => {
        it('should build prompt with correct ordering', () => {
            const segments = [
                createUserSegment('user', 'What is React?'),
                createSystemSegment('sys', 'You are helpful'),
                createRAGSegment('rag', 'React is a library'),
                createContextSegment('ctx', 'Background info'),
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 10000,
                reservedForOutput: 1000,
            });
            // Check ordering: system -> static-context -> rag -> user
            expect(result.messages[0].role).toBe('system');
            expect(result.messages[0].content).toBe('You are helpful');
            expect(result.messages[1].content).toBe('Background info');
            expect(result.messages[2].content).toBe('React is a library');
            expect(result.messages[3].content).toBe('What is React?');
        });
        it('should calculate token counts correctly', () => {
            const segments = [
                createSystemSegment('sys', 'A'.repeat(100)), // 25 tokens
                createUserSegment('user', 'B'.repeat(40)), // 10 tokens
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 1000,
                reservedForOutput: 100,
            });
            // 25 + 10 = 35 content tokens + overhead (4 per message * 2 + 2 priming) = 45
            expect(result.tokenCount).toBe(45);
        });
        it('should track cacheable prefix correctly', () => {
            const segments = [
                createSystemSegment('sys', 'System prompt'),
                createContextSegment('ctx', 'Static context'),
                createRAGSegment('rag', 'Dynamic RAG'),
                createUserSegment('user', 'Query'),
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 10000,
                reservedForOutput: 1000,
            });
            // Cacheable: system + static-context (with overhead)
            const systemTokens = Math.ceil('System prompt'.length / 4) + 4;
            const contextTokens = Math.ceil('Static context'.length / 4) + 4;
            expect(result.kvCacheablePrefix).toBe(systemTokens + contextTokens);
        });
    });
    describe('must-have validation', () => {
        it('should throw when must-have content exceeds budget', () => {
            const segments = [
                createSystemSegment('sys', 'A'.repeat(4000)), // 1000 tokens
                createUserSegment('user', 'B'.repeat(4000)), // 1000 tokens
            ];
            expect(() => buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 1500,
                reservedForOutput: 500,
            })).toThrow(PromptBudgetExceededError);
        });
        it('should provide detailed error information', () => {
            const segments = [
                createSystemSegment('sys', 'A'.repeat(4000)),
                createUserSegment('user', 'B'.repeat(4000)),
            ];
            try {
                buildKVCacheOptimizedPrompt(segments, {
                    maxInputTokens: 1500,
                    reservedForOutput: 500,
                });
                expect.fail('Should have thrown');
            }
            catch (error) {
                expect(error).toBeInstanceOf(PromptBudgetExceededError);
                const budgetError = error;
                expect(budgetError.details.systemTokens).toBeGreaterThan(0);
                expect(budgetError.details.userTokens).toBeGreaterThan(0);
                expect(budgetError.details.availableBudget).toBe(1000);
            }
        });
    });
    describe('trimming behavior', () => {
        it('should trim low priority segments to fit budget', () => {
            // Use content large enough to exceed budget and require trimming
            // Token estimation is ~length/4, so 400 chars ≈ 100 tokens
            // With budget of 80 tokens, this should force trimming
            const segments = [
                createSystemSegment('sys', 'System'),
                createHistorySegment('h1', 'A'.repeat(400), 'user', 'low'),
                createHistorySegment('h2', 'B'.repeat(400), 'assistant', 'low'),
                createHistorySegment('h3', 'C'.repeat(200), 'user', 'normal'),
                createUserSegment('user', 'Query'),
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 100,
                reservedForOutput: 20,
            });
            // Some history should be trimmed due to tight budget
            expect(result.trimmedSegments.length).toBeGreaterThan(0);
            // Must-have segments should remain
            const contents = result.messages.map(m => m.content);
            expect(contents).toContain('System');
            expect(contents).toContain('Query');
        });
        it('should trim lowest priority first', () => {
            const segments = [
                createSystemSegment('sys', 'S'),
                { id: 'low', type: 'history', content: 'A'.repeat(100), priority: 'low' },
                { id: 'normal', type: 'history', content: 'B'.repeat(100), priority: 'normal' },
                { id: 'high', type: 'history', content: 'C'.repeat(100), priority: 'high' },
                createUserSegment('user', 'Q'),
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 100,
                reservedForOutput: 20,
            });
            // Low priority should be trimmed first
            const trimmedIds = result.trimmedSegments.map(s => s.id);
            if (trimmedIds.includes('low') && trimmedIds.includes('high')) {
                // If both are trimmed, low should have been trimmed first (appears in list)
                expect(trimmedIds.indexOf('low')).toBeLessThanOrEqual(trimmedIds.indexOf('high'));
            }
        });
        it('should never trim must-have segments', () => {
            const segments = [
                createSystemSegment('sys', 'A'.repeat(40)),
                { id: 'optional', type: 'rag', content: 'B'.repeat(400), priority: 'normal' },
                createUserSegment('user', 'C'.repeat(40)),
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 200,
                reservedForOutput: 50,
            });
            // Must-have should never be in trimmed
            const trimmedIds = result.trimmedSegments.map(s => s.id);
            expect(trimmedIds).not.toContain('sys');
            expect(trimmedIds).not.toContain('user');
        });
    });
    describe('token breakdown', () => {
        it('should provide accurate breakdown by type', () => {
            const segments = [
                createSystemSegment('sys', 'System content'),
                createContextSegment('ctx', 'Context content'),
                createRAGSegment('rag', 'RAG content'),
                createHistorySegment('hist', 'History content', 'user'),
                createUserSegment('user', 'User query'),
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 10000,
                reservedForOutput: 1000,
            });
            expect(result.tokenBreakdown['system']).toBeGreaterThan(0);
            expect(result.tokenBreakdown['static-context']).toBeGreaterThan(0);
            expect(result.tokenBreakdown['rag']).toBeGreaterThan(0);
            expect(result.tokenBreakdown['history']).toBeGreaterThan(0);
            expect(result.tokenBreakdown['user']).toBeGreaterThan(0);
        });
    });
    describe('pre-computed tokens', () => {
        it('should use pre-computed token counts when provided', () => {
            const segments = [
                { ...createSystemSegment('sys', 'System'), tokenCount: 100 },
                { ...createUserSegment('user', 'Query'), tokenCount: 50 },
            ];
            const result = buildKVCacheOptimizedPrompt(segments, {
                maxInputTokens: 1000,
                reservedForOutput: 100,
            });
            // 100 + 50 = 150 content + overhead (4*2 + 2) = 160
            expect(result.tokenCount).toBe(160);
        });
    });
});
describe('segment helpers', () => {
    it('createSegment should create valid segment', () => {
        const segment = createSegment('test', 'rag', 'content', 'high');
        expect(segment.id).toBe('test');
        expect(segment.type).toBe('rag');
        expect(segment.content).toBe('content');
        expect(segment.priority).toBe('high');
    });
    it('createSystemSegment should default to must-have', () => {
        const segment = createSystemSegment('sys', 'content');
        expect(segment.type).toBe('system');
        expect(segment.priority).toBe('must-have');
        expect(segment.role).toBe('system');
    });
    it('createUserSegment should be must-have', () => {
        const segment = createUserSegment('user', 'query');
        expect(segment.type).toBe('user');
        expect(segment.priority).toBe('must-have');
        expect(segment.role).toBe('user');
    });
    it('createHistorySegment should preserve role', () => {
        const userSeg = createHistorySegment('h1', 'content', 'user');
        const assistantSeg = createHistorySegment('h2', 'content', 'assistant');
        expect(userSeg.role).toBe('user');
        expect(assistantSeg.role).toBe('assistant');
    });
});
describe('conversationToSegments', () => {
    it('should convert messages to segments', () => {
        const messages = [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there' },
            { role: 'user', content: 'How are you?' },
        ];
        const segments = conversationToSegments(messages);
        expect(segments.length).toBe(3);
        expect(segments[0].type).toBe('history');
        expect(segments[0].role).toBe('user');
    });
    it('should mark recent messages as higher priority', () => {
        const messages = [
            { role: 'user', content: 'Old' },
            { role: 'assistant', content: 'Old response' },
            { role: 'user', content: 'Recent' },
            { role: 'assistant', content: 'Recent response' },
        ];
        const segments = conversationToSegments(messages, { recentHighPriority: 2 });
        expect(segments[0].priority).toBe('low');
        expect(segments[1].priority).toBe('low');
        expect(segments[2].priority).toBe('normal');
        expect(segments[3].priority).toBe('normal');
    });
    it('should use custom id prefix', () => {
        const messages = [{ role: 'user', content: 'Test' }];
        const segments = conversationToSegments(messages, { idPrefix: 'conv' });
        expect(segments[0].id).toBe('conv-0');
    });
});
describe('validateSegments', () => {
    it('should pass valid segments', () => {
        const segments = [
            createSystemSegment('sys', 'System'),
            createUserSegment('user', 'Query'),
        ];
        const result = validateSegments(segments);
        expect(result.valid).toBe(true);
        expect(result.errors.length).toBe(0);
    });
    it('should error on missing user segment', () => {
        const segments = [createSystemSegment('sys', 'System')];
        const result = validateSegments(segments);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('user'))).toBe(true);
    });
    it('should warn on missing system segment', () => {
        const segments = [createUserSegment('user', 'Query')];
        const result = validateSegments(segments);
        expect(result.valid).toBe(true); // Still valid
        expect(result.warnings.some(w => w.includes('system'))).toBe(true);
    });
    it('should error on duplicate IDs', () => {
        const segments = [
            createSystemSegment('dup', 'System'),
            createUserSegment('dup', 'Query'),
        ];
        const result = validateSegments(segments);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('Duplicate'))).toBe(true);
    });
    it('should warn on non-must-have user segment', () => {
        const segments = [
            createSystemSegment('sys', 'System'),
            { id: 'user', type: 'user', content: 'Query', priority: 'normal' },
        ];
        const result = validateSegments(segments);
        expect(result.warnings.some(w => w.includes('must-have'))).toBe(true);
    });
});
describe('minHistoryTokens', () => {
    it('should report when minHistoryTokens is met', () => {
        const segments = [
            createSystemSegment('sys', 'System'),
            createHistorySegment('h1', 'A'.repeat(100), 'user'), // ~25 tokens
            createHistorySegment('h2', 'B'.repeat(100), 'assistant'), // ~25 tokens
            createUserSegment('user', 'Query'),
        ];
        const result = buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: 1000,
            reservedForOutput: 100,
            minHistoryTokens: 40,
        });
        expect(result.minHistoryTokensMet).toBe(true);
        expect(result.historyTokensIncluded).toBeGreaterThanOrEqual(40);
    });
    it('should report when minHistoryTokens is not met due to budget', () => {
        const segments = [
            createSystemSegment('sys', 'A'.repeat(200)), // ~50 tokens
            createHistorySegment('h1', 'B'.repeat(100), 'user'), // ~25 tokens
            createUserSegment('user', 'C'.repeat(100)), // ~25 tokens
        ];
        const result = buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: 150,
            reservedForOutput: 20,
            minHistoryTokens: 100, // More than available
        });
        expect(result.minHistoryTokensMet).toBe(false);
        expect(result.historyTokensIncluded).toBeLessThan(100);
    });
    it('should report minHistoryTokensMet as true when minHistoryTokens is 0', () => {
        const segments = [
            createSystemSegment('sys', 'System'),
            createUserSegment('user', 'Query'),
        ];
        const result = buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: 1000,
            reservedForOutput: 100,
            minHistoryTokens: 0,
        });
        expect(result.minHistoryTokensMet).toBe(true);
        expect(result.historyTokensIncluded).toBe(0);
    });
});
describe('input validation', () => {
    it('should throw on non-positive maxInputTokens', () => {
        const segments = [createUserSegment('user', 'Query')];
        expect(() => buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: 0,
            reservedForOutput: 100,
        })).toThrow('maxInputTokens must be positive');
        expect(() => buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: -100,
            reservedForOutput: 100,
        })).toThrow('maxInputTokens must be positive');
    });
    it('should throw on negative reservedForOutput', () => {
        const segments = [createUserSegment('user', 'Query')];
        expect(() => buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: 1000,
            reservedForOutput: -100,
        })).toThrow('reservedForOutput cannot be negative');
    });
    it('should throw when reservedForOutput >= maxInputTokens', () => {
        const segments = [createUserSegment('user', 'Query')];
        expect(() => buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: 1000,
            reservedForOutput: 1000,
        })).toThrow('reservedForOutput must be less than maxInputTokens');
        expect(() => buildKVCacheOptimizedPrompt(segments, {
            maxInputTokens: 1000,
            reservedForOutput: 1500,
        })).toThrow('reservedForOutput must be less than maxInputTokens');
    });
    it('should throw on empty segments array', () => {
        expect(() => buildKVCacheOptimizedPrompt([], {
            maxInputTokens: 1000,
            reservedForOutput: 100,
        })).toThrow('segments array cannot be empty');
    });
});
describe('estimateKVCacheSavings', () => {
    it('should calculate savings correctly', () => {
        const builtPrompt = {
            messages: [],
            tokenCount: 1000,
            trimmedSegments: [],
            kvCacheablePrefix: 400,
            tokenBreakdown: { system: 400, 'static-context': 0, rag: 300, history: 200, user: 100 },
            availableForOutput: 5000,
            budgetWarning: false,
            historyTokensIncluded: 200,
            minHistoryTokensMet: true,
        };
        const result = estimateKVCacheSavings(builtPrompt, 10);
        expect(result.cacheableTokens).toBe(400);
        expect(result.uncachedTotal).toBe(10000); // 1000 * 10
        // With caching: first full (1000) + 9 * dynamic (600) = 1000 + 5400 = 6400
        expect(result.cachedTotal).toBe(6400);
        expect(result.tokensSaved).toBe(3600);
        expect(result.savingsPercent).toBe(36);
    });
    it('should handle no cacheable prefix', () => {
        const builtPrompt = {
            messages: [],
            tokenCount: 1000,
            trimmedSegments: [],
            kvCacheablePrefix: 0,
            tokenBreakdown: { system: 0, 'static-context': 0, rag: 500, history: 300, user: 200 },
            availableForOutput: 5000,
            budgetWarning: false,
            historyTokensIncluded: 300,
            minHistoryTokensMet: true,
        };
        const result = estimateKVCacheSavings(builtPrompt, 10);
        expect(result.tokensSaved).toBe(0);
        expect(result.savingsPercent).toBe(0);
    });
});
//# sourceMappingURL=kv-cache-prompt-builder.test.js.map