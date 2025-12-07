/**
 * Tests for Utility Functions
 */
import { describe, it, expect } from 'vitest';
import { formatTokenCount, formatCost, getModelMetadata, needsOptimization, getRecommendedTargetTokens, } from '../core/utils';
describe('formatTokenCount', () => {
    it('should format small numbers', () => {
        expect(formatTokenCount(100)).toBe('100');
        expect(formatTokenCount(999)).toBe('999');
    });
    it('should format thousands', () => {
        expect(formatTokenCount(1000)).toBe('1.0K');
        expect(formatTokenCount(1500)).toBe('1.5K');
        expect(formatTokenCount(9999)).toBe('10.0K');
    });
    it('should format millions', () => {
        expect(formatTokenCount(1000000)).toBe('1.00M');
        expect(formatTokenCount(1500000)).toBe('1.50M');
    });
});
describe('formatCost', () => {
    it('should format small costs in cents', () => {
        expect(formatCost(0.001)).toMatch(/\$.*¢/);
    });
    it('should format larger costs in dollars', () => {
        expect(formatCost(0.01)).toMatch(/^\$0\.01/);
        expect(formatCost(1.5)).toMatch(/^\$1\.5/);
    });
});
describe('getModelMetadata', () => {
    it('should return metadata for known models', () => {
        const gpt4 = getModelMetadata('gpt-4');
        expect(gpt4).toBeDefined();
        expect(gpt4?.model).toBe('gpt-4');
        expect(gpt4?.maxTokens).toBe(8192);
        const claude = getModelMetadata('claude-3-opus');
        expect(claude).toBeDefined();
        expect(claude?.model).toBe('claude-3-opus');
    });
    it('should return null for unknown models', () => {
        expect(getModelMetadata('unknown-model')).toBeNull();
    });
});
describe('needsOptimization', () => {
    const mockModel = {
        model: 'gpt-4',
        maxTokens: 8000,
        tokenizer: 'approximate',
    };
    it('should return true when over budget', () => {
        const messages = [
            { role: 'user', content: 'A'.repeat(10000) }, // Large message
        ];
        const needs = needsOptimization(messages, 100, mockModel);
        expect(needs).toBe(true);
    });
    it('should return false when under budget', () => {
        const messages = [
            { role: 'user', content: 'Hello' },
        ];
        const needs = needsOptimization(messages, 1000, mockModel);
        expect(needs).toBe(false);
    });
});
describe('getRecommendedTargetTokens', () => {
    it('should return 80% of max tokens', () => {
        const model = {
            model: 'test',
            maxTokens: 10000,
        };
        const recommended = getRecommendedTargetTokens(model);
        expect(recommended).toBe(8000);
    });
});
//# sourceMappingURL=utils.test.js.map