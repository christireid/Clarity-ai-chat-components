import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTokenOptimizationEnhanced } from '../use-token-optimization-enhanced';
// Mock dependencies
vi.mock('../../utils/tokenization/model-pricing', () => ({
    calculateCost: vi.fn(() => ({
        inputCost: 0.01,
        outputCost: 0.02,
        totalCost: 0.03,
    })),
}));
vi.mock('../../utils/tokenization', () => ({
    countTokens: vi.fn(async (text) => ({
        total: text.length / 4,
        method: 'estimated',
    })),
    countConversationTokens: vi.fn(async () => ({
        total: 100,
        method: 'estimated',
    })),
}));
vi.mock('../../utils/prompt-compression', () => ({
    compressPrompt: vi.fn((text) => ({
        compressed: text.substring(0, text.length / 2),
        savingsPercent: 50,
        tokenSavings: 10,
    })),
}));
vi.mock('../../utils/llmlingua-compressor', () => ({
    intelligentCompress: vi.fn(async (text) => ({
        compressed: text.substring(0, text.length / 3),
        original: text,
        originalTokens: 100,
        compressedTokens: 33,
        compressionRatio: 0.33,
        tokenSavings: 67,
    })),
}));
vi.mock('../../utils/semantic-cache-persistent', () => ({
    createPersistentSemanticCache: vi.fn(() => ({
        checkCache: vi.fn(),
        storeResponse: vi.fn(),
        getStats: vi.fn(() => Promise.resolve({ hits: 0, misses: 0 })),
    })),
}));
describe('useTokenOptimizationEnhanced', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should initialize with default stats', () => {
        const { result } = renderHook(() => useTokenOptimizationEnhanced());
        expect(result.current.stats).toBeDefined();
        expect(result.current.stats.costs.totalCost).toBe(0);
    });
    it('should optimize prompt using intelligent compression', async () => {
        const { result } = renderHook(() => useTokenOptimizationEnhanced({
            enablePromptCompression: true,
            compressionLevel: 'aggressive',
        }));
        const prompt = 'This is a very long prompt that needs compression';
        const optimization = await result.current.optimizePrompt(prompt);
        expect(optimization.content).toBeDefined();
        expect(optimization.content.length).toBeLessThan(prompt.length);
        await waitFor(() => {
            expect(result.current.stats.compression.compressions).toBe(1);
        });
    });
    it('should respect budget limits', () => {
        const { result } = renderHook(() => useTokenOptimizationEnhanced({
            enableCostTracking: true,
            budget: 0.02, // Very low budget
        }));
        // Initially can make request
        expect(result.current.canMakeRequest()).toBe(true);
        // Simulate cost accumulation (mocked calculateCost returns 0.03)
        // We need to trigger something that adds cost. optimizePrompt calls calculateCost
        waitFor(async () => {
            await result.current.optimizePrompt('test');
        });
        // Should now be over budget (0.03 > 0.02)
        // Note: React state updates are async, may need waitFor
        waitFor(() => {
            expect(result.current.canMakeRequest()).toBe(false);
            expect(result.current.isBudgetExceeded).toBe(true);
        });
    });
    it('should redact PII when enabled', async () => {
        const { result } = renderHook(() => useTokenOptimizationEnhanced({
            enablePIIRedaction: true,
            enablePromptCompression: false,
        }));
        const prompt = 'Contact me at test@example.com or 555-123-4567';
        const optimization = await result.current.optimizePrompt(prompt);
        expect(optimization.content).not.toContain('test@example.com');
        expect(optimization.content).not.toContain('555-123-4567');
        expect(optimization.content).toContain('<EMAIL_REDACTED>');
        expect(optimization.content).toContain('<PHONE_REDACTED>');
    });
    describe('optimizeHistory', () => {
        const messages = Array.from({ length: 10 }, (_, i) => ({
            id: `msg-${i}`,
            role: i % 2 === 0 ? 'user' : 'assistant',
            content: `Message ${i} content`,
        }));
        it('should use sliding window by default', async () => {
            const { result } = renderHook(() => useTokenOptimizationEnhanced({
                enableHistoryLimiting: true,
                historyLimiting: { maxMessages: 4 },
            }));
            const optimized = await result.current.optimizeHistory(messages);
            expect(optimized.length).toBeLessThanOrEqual(4);
        });
        it('should support summarization strategy', async () => {
            const mockSummarize = vi.fn().mockResolvedValue({
                role: 'assistant',
                content: 'Summary of history',
            });
            const { result } = renderHook(() => useTokenOptimizationEnhanced({
                enableHistoryLimiting: true,
                historyLimiting: { strategy: 'summarize', maxMessages: 4 },
                summarizeMessage: mockSummarize,
            }));
            const optimized = await result.current.optimizeHistory(messages);
            expect(mockSummarize).toHaveBeenCalled();
            expect(optimized.some((m) => m.content.includes('Summary'))).toBe(true);
            // Should preserve recent messages
            expect(optimized.length).toBeGreaterThan(1);
        });
        it('should fallback to sliding window if summarizer missing', async () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const { result } = renderHook(() => useTokenOptimizationEnhanced({
                enableHistoryLimiting: true,
                historyLimiting: { strategy: 'summarize', maxMessages: 4 },
                // No summarizeMessage provided
            }));
            const optimized = await result.current.optimizeHistory(messages);
            expect(consoleSpy).toHaveBeenCalled();
            expect(optimized.length).toBeLessThanOrEqual(4);
            consoleSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=use-token-optimization-enhanced.test.js.map