import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTokenTracker, MODEL_PRICING, MODEL_LIMITS, } from '../use-token-tracker';
describe('useTokenTracker', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should initialize with zero tokens', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
        }));
        expect(result.current.tokens).toBe(0);
        expect(result.current.inputTokens).toBe(0);
        expect(result.current.outputTokens).toBe(0);
        expect(result.current.estimatedCost).toBe(0);
    });
    it('should track input tokens from user messages', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Hello, how are you?',
                tokens: 10,
            });
        });
        expect(result.current.inputTokens).toBe(10);
        expect(result.current.outputTokens).toBe(0);
        expect(result.current.tokens).toBe(10);
    });
    it('should track output tokens from assistant messages', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
        }));
        act(() => {
            result.current.addMessage({
                role: 'assistant',
                content: 'I am doing well, thank you!',
                tokens: 15,
            });
        });
        expect(result.current.inputTokens).toBe(0);
        expect(result.current.outputTokens).toBe(15);
        expect(result.current.tokens).toBe(15);
    });
    it('should calculate estimated cost correctly', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
            // GPT-4: input $0.00003, output $0.00006
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Hello',
                tokens: 100,
            });
            result.current.addMessage({
                role: 'assistant',
                content: 'Hi there!',
                tokens: 50,
            });
        });
        // 100 * 0.00003 + 50 * 0.00006 = 0.003 + 0.003 = 0.006
        expect(result.current.estimatedCost).toBeCloseTo(0.006, 6);
    });
    it('should detect when near token limit', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
            maxTokens: 100,
            warningThreshold: 0.8, // 80%
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Test message',
                tokens: 85, // 85% of limit
            });
        });
        expect(result.current.isNearLimit).toBe(true);
        expect(result.current.isCritical).toBe(false);
        expect(result.current.percentage).toBe(85);
    });
    it('should detect critical token limit', () => {
        const onWarning = vi.fn();
        const onCritical = vi.fn();
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
            maxTokens: 100,
            warningThreshold: 0.8,
            criticalThreshold: 0.95,
            onWarning,
            onCritical,
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Test message',
                tokens: 96, // 96% of limit
            });
        });
        expect(result.current.isCritical).toBe(true);
        expect(result.current.suggestPruning).toBe(true);
        expect(onCritical).toHaveBeenCalled();
    });
    it('should validate if can send message', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
            maxTokens: 100,
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Test',
                tokens: 80,
            });
        });
        expect(result.current.canSend(15)).toBe(true);
        expect(result.current.canSend(25)).toBe(false);
    });
    it('should remove messages', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Message 1',
                tokens: 10,
            });
            result.current.addMessage({
                role: 'user',
                content: 'Message 2',
                tokens: 20,
            });
        });
        expect(result.current.tokens).toBe(30);
        act(() => {
            result.current.removeMessage(0); // Remove first message
        });
        expect(result.current.tokens).toBe(20);
    });
    it('should clear all messages', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Test',
                tokens: 50,
            });
        });
        expect(result.current.tokens).toBe(50);
        act(() => {
            result.current.clear();
        });
        expect(result.current.tokens).toBe(0);
        expect(result.current.isNearLimit).toBe(false);
    });
    it('should estimate tokens from text', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
        }));
        // Rough approximation: 4 chars = 1 token + 4 overhead
        const text = 'This is a test message';
        const estimated = result.current.estimateTokens(text);
        expect(estimated).toBeGreaterThan(0);
        expect(estimated).toBeLessThan(text.length); // Should be less than character count
    });
    it('should use custom pricing', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'custom-model',
            maxTokens: 4096,
            inputCostPerToken: 0.00001,
            outputCostPerToken: 0.00002,
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Test',
                tokens: 100,
            });
            result.current.addMessage({
                role: 'assistant',
                content: 'Response',
                tokens: 200,
            });
        });
        // 100 * 0.00001 + 200 * 0.00002 = 0.001 + 0.004 = 0.005
        expect(result.current.estimatedCost).toBeCloseTo(0.005, 6);
    });
    it('should auto-estimate tokens if not provided', () => {
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
        }));
        act(() => {
            result.current.addMessage({
                role: 'user',
                content: 'Hello, this is a test message!', // 30 chars ≈ 8 tokens
                // No tokens property provided
            });
        });
        expect(result.current.tokens).toBeGreaterThan(0);
    });
    it('should trigger warning callback only once', () => {
        const onWarning = vi.fn();
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
            maxTokens: 100,
            warningThreshold: 0.8,
            onWarning,
        }));
        act(() => {
            result.current.addMessage({ role: 'user', content: 'Test', tokens: 85 });
        });
        expect(onWarning).toHaveBeenCalledTimes(1);
        // Add more tokens (still in warning zone)
        act(() => {
            result.current.addMessage({ role: 'user', content: 'Test', tokens: 5 });
        });
        // Should not trigger again
        expect(onWarning).toHaveBeenCalledTimes(1);
    });
    it('should reset warnings when usage drops', () => {
        const onWarning = vi.fn();
        const { result } = renderHook(() => useTokenTracker({
            modelName: 'gpt-4',
            maxTokens: 100,
            warningThreshold: 0.8,
            onWarning,
        }));
        act(() => {
            result.current.addMessage({ role: 'user', content: 'Test', tokens: 85 });
        });
        expect(onWarning).toHaveBeenCalledTimes(1);
        // Clear to reset
        act(() => {
            result.current.clear();
        });
        // Add again to trigger warning
        act(() => {
            result.current.addMessage({ role: 'user', content: 'Test', tokens: 85 });
        });
        expect(onWarning).toHaveBeenCalledTimes(2);
    });
});
// =============================================================================
// Lazy Initialization Proxy Tests
// =============================================================================
describe('MODEL_PRICING (lazy-initialized Proxy)', () => {
    it('should return pricing data for known models via get trap', () => {
        const gpt4Pricing = MODEL_PRICING['gpt-4'];
        expect(gpt4Pricing).toBeDefined();
        expect(typeof gpt4Pricing.input).toBe('number');
        expect(typeof gpt4Pricing.output).toBe('number');
        expect(gpt4Pricing.input).toBeGreaterThan(0);
        expect(gpt4Pricing.output).toBeGreaterThan(0);
    });
    it('should return undefined for unknown models', () => {
        const unknownPricing = MODEL_PRICING['non-existent-model-xyz'];
        expect(unknownPricing).toBeUndefined();
    });
    it('should work with "in" operator via has trap', () => {
        expect('gpt-4' in MODEL_PRICING).toBe(true);
        expect('gpt-4o' in MODEL_PRICING).toBe(true);
        expect('claude-3-5-sonnet' in MODEL_PRICING).toBe(true);
        expect('non-existent-model' in MODEL_PRICING).toBe(false);
    });
    it('should work with Object.keys() via ownKeys trap', () => {
        const keys = Object.keys(MODEL_PRICING);
        expect(Array.isArray(keys)).toBe(true);
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('gpt-4');
        expect(keys).toContain('claude-3-5-sonnet');
    });
    it('should work with Object.entries() via getOwnPropertyDescriptor trap', () => {
        const entries = Object.entries(MODEL_PRICING);
        expect(Array.isArray(entries)).toBe(true);
        expect(entries.length).toBeGreaterThan(0);
        // Check first entry has correct structure
        const [modelName, pricing] = entries[0];
        expect(typeof modelName).toBe('string');
        expect(pricing).toHaveProperty('input');
        expect(pricing).toHaveProperty('output');
    });
    it('should work with Object.values()', () => {
        const values = Object.values(MODEL_PRICING);
        expect(Array.isArray(values)).toBe(true);
        expect(values.length).toBeGreaterThan(0);
        // All values should have input/output properties
        values.forEach((pricing) => {
            expect(pricing).toHaveProperty('input');
            expect(pricing).toHaveProperty('output');
        });
    });
    it('should work with for...in loops', () => {
        const keys = [];
        for (const key in MODEL_PRICING) {
            keys.push(key);
        }
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('gpt-4');
    });
    it('should work with spread operator', () => {
        const copy = { ...MODEL_PRICING };
        expect(copy).toHaveProperty('gpt-4');
        expect(copy['gpt-4']).toHaveProperty('input');
    });
    it('should return consistent values on multiple accesses', () => {
        const first = MODEL_PRICING['gpt-4'];
        const second = MODEL_PRICING['gpt-4'];
        expect(first).toBe(second);
        expect(first.input).toBe(second.input);
    });
});
describe('MODEL_LIMITS (lazy-initialized Proxy)', () => {
    it('should return limit data for known models via get trap', () => {
        const gpt4Limit = MODEL_LIMITS['gpt-4'];
        expect(gpt4Limit).toBeDefined();
        expect(typeof gpt4Limit).toBe('number');
        expect(gpt4Limit).toBeGreaterThan(0);
    });
    it('should return undefined for unknown models', () => {
        const unknownLimit = MODEL_LIMITS['non-existent-model-xyz'];
        expect(unknownLimit).toBeUndefined();
    });
    it('should work with "in" operator via has trap', () => {
        expect('gpt-4' in MODEL_LIMITS).toBe(true);
        expect('gpt-4o' in MODEL_LIMITS).toBe(true);
        expect('claude-3-5-sonnet' in MODEL_LIMITS).toBe(true);
        expect('non-existent-model' in MODEL_LIMITS).toBe(false);
    });
    it('should work with Object.keys() via ownKeys trap', () => {
        const keys = Object.keys(MODEL_LIMITS);
        expect(Array.isArray(keys)).toBe(true);
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('gpt-4');
        expect(keys).toContain('claude-3-5-sonnet');
    });
    it('should work with Object.entries() via getOwnPropertyDescriptor trap', () => {
        const entries = Object.entries(MODEL_LIMITS);
        expect(Array.isArray(entries)).toBe(true);
        expect(entries.length).toBeGreaterThan(0);
        // Check first entry has correct structure
        const [modelName, limit] = entries[0];
        expect(typeof modelName).toBe('string');
        expect(typeof limit).toBe('number');
        expect(limit).toBeGreaterThan(0);
    });
    it('should work with Object.values()', () => {
        const values = Object.values(MODEL_LIMITS);
        expect(Array.isArray(values)).toBe(true);
        expect(values.length).toBeGreaterThan(0);
        // All values should be numbers
        values.forEach((limit) => {
            expect(typeof limit).toBe('number');
            expect(limit).toBeGreaterThan(0);
        });
    });
    it('should work with for...in loops', () => {
        const keys = [];
        for (const key in MODEL_LIMITS) {
            keys.push(key);
        }
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('gpt-4');
    });
    it('should work with spread operator', () => {
        const copy = { ...MODEL_LIMITS };
        expect(copy).toHaveProperty('gpt-4');
        expect(typeof copy['gpt-4']).toBe('number');
    });
    it('should return consistent values on multiple accesses', () => {
        const first = MODEL_LIMITS['gpt-4'];
        const second = MODEL_LIMITS['gpt-4'];
        expect(first).toBe(second);
    });
    it('should have consistent keys between MODEL_PRICING and MODEL_LIMITS', () => {
        const pricingKeys = new Set(Object.keys(MODEL_PRICING));
        const limitsKeys = new Set(Object.keys(MODEL_LIMITS));
        // All pricing keys should have limits
        pricingKeys.forEach((key) => {
            expect(limitsKeys.has(key)).toBe(true);
        });
        // All limits keys should have pricing
        limitsKeys.forEach((key) => {
            expect(pricingKeys.has(key)).toBe(true);
        });
    });
});
//# sourceMappingURL=use-token-tracker.test.js.map