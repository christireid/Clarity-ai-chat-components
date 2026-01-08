/**
 * Tests for Dynamic Output Token Calculator
 */
import { describe, it, expect } from 'vitest';
import { calculateDynamicOutputLimit, injectBrevityInstruction, getPreferenceConfig, getTaskTypeConfig, detectTaskType, createModelOutputConfig, getMaxTokens, } from '../dynamic-output-limit';
describe('calculateDynamicOutputLimit', () => {
    describe('basic calculation', () => {
        it('should calculate output limit correctly', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 5000,
                userPreference: 'balanced',
                taskType: 'chat',
            });
            expect(result.absoluteMaxTokens).toBe(5000);
            expect(result.recommendedMaxTokens).toBeLessThanOrEqual(result.absoluteMaxTokens);
            expect(result.recommendedMaxTokens).toBeGreaterThan(0);
        });
        it('should never exceed absolute max', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 1000,
                inputTokenCount: 900,
            });
            expect(result.recommendedMaxTokens).toBeLessThanOrEqual(100);
        });
        it('should respect UI configured max', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                uiConfiguredMax: 500,
            });
            expect(result.recommendedMaxTokens).toBeLessThanOrEqual(500);
        });
        it('should enforce minimum output tokens', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 1000,
                inputTokenCount: 990,
                minOutputTokens: 5,
            });
            expect(result.recommendedMaxTokens).toBeGreaterThanOrEqual(5);
        });
    });
    describe('user preference', () => {
        it('should reduce tokens for concise preference', () => {
            const balanced = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                userPreference: 'balanced',
                taskType: 'chat',
            });
            const concise = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                userPreference: 'concise',
                taskType: 'chat',
            });
            expect(concise.recommendedMaxTokens).toBeLessThan(balanced.recommendedMaxTokens);
        });
        it('should increase tokens for detailed preference', () => {
            const balanced = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                userPreference: 'balanced',
                taskType: 'chat',
            });
            const detailed = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                userPreference: 'detailed',
                taskType: 'chat',
            });
            expect(detailed.recommendedMaxTokens).toBeGreaterThan(balanced.recommendedMaxTokens);
        });
    });
    describe('task type', () => {
        it('should give fewer tokens for classification', () => {
            const classification = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                taskType: 'classification',
            });
            const generation = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                taskType: 'generation',
            });
            expect(classification.recommendedMaxTokens).toBeLessThan(generation.recommendedMaxTokens);
        });
        it('should give more tokens for code generation', () => {
            const chat = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                taskType: 'chat',
            });
            const code = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                taskType: 'code',
            });
            expect(code.recommendedMaxTokens).toBeGreaterThan(chat.recommendedMaxTokens);
        });
    });
    describe('brevity instruction', () => {
        it('should provide short instruction for small limits', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 1000,
                inputTokenCount: 900, // Only 100 remaining
                includeBrevityInstruction: true,
            });
            expect(result.brevityInstruction).toContain('1-2 sentences');
        });
        it('should provide appropriate instruction for medium limits', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                userPreference: 'concise',
                taskType: 'chat',
                includeBrevityInstruction: true,
            });
            expect(result.brevityInstruction.length).toBeGreaterThan(0);
        });
        it('should skip instruction when disabled', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 1000,
                includeBrevityInstruction: false,
            });
            expect(result.brevityInstruction).toBe('');
        });
    });
    describe('input utilization', () => {
        it('should calculate input utilization correctly', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 5000,
            });
            expect(result.inputUtilization).toBe(50);
        });
        it('should flag input constrained situations', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 1000,
                inputTokenCount: 950,
                taskType: 'generation', // Base is 4000, but only 50 available
            });
            expect(result.inputConstrained).toBe(true);
        });
        it('should not flag when space is ample', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 128000,
                inputTokenCount: 5000,
                taskType: 'chat',
            });
            expect(result.inputConstrained).toBe(false);
        });
    });
    describe('reasoning', () => {
        it('should provide detailed reasoning', () => {
            const result = calculateDynamicOutputLimit({
                modelCapacity: 10000,
                inputTokenCount: 5000,
                userPreference: 'concise',
                taskType: 'analysis',
                uiConfiguredMax: 1000,
            });
            expect(result.reasoning).toContain('Model capacity');
            expect(result.reasoning).toContain('Input used');
            expect(result.reasoning).toContain('Task type');
            expect(result.reasoning).toContain('Preference');
            expect(result.reasoning).toContain('UI cap');
            expect(result.reasoning).toContain('Final recommendation');
        });
    });
});
describe('injectBrevityInstruction', () => {
    it('should append instruction to prompt', () => {
        const result = injectBrevityInstruction('You are a helpful assistant.', 'Be concise.');
        expect(result).toBe('You are a helpful assistant.\n\nIMPORTANT: Be concise.');
    });
    it('should not duplicate instruction', () => {
        const prompt = 'You are a helpful assistant.\n\nIMPORTANT: Be concise.';
        const result = injectBrevityInstruction(prompt, 'Be concise.');
        expect(result).toBe(prompt);
    });
    it('should return original if no instruction', () => {
        const prompt = 'You are a helpful assistant.';
        const result = injectBrevityInstruction(prompt, '');
        expect(result).toBe(prompt);
    });
});
describe('getPreferenceConfig', () => {
    it('should return config for each preference', () => {
        const concise = getPreferenceConfig('concise');
        const balanced = getPreferenceConfig('balanced');
        const detailed = getPreferenceConfig('detailed');
        expect(concise.multiplier).toBe(0.5);
        expect(balanced.multiplier).toBe(1.0);
        expect(detailed.multiplier).toBe(1.5);
        expect(concise.description).toBeTruthy();
        expect(balanced.description).toBeTruthy();
        expect(detailed.description).toBeTruthy();
    });
});
describe('getTaskTypeConfig', () => {
    it('should return config for each task type', () => {
        const classification = getTaskTypeConfig('classification');
        const code = getTaskTypeConfig('code');
        expect(classification.base).toBeLessThan(code.base);
        expect(classification.multiplier).toBeLessThan(code.multiplier);
        expect(classification.examples.length).toBeGreaterThan(0);
        expect(code.examples.length).toBeGreaterThan(0);
    });
});
describe('detectTaskType', () => {
    it('should detect classification queries', () => {
        expect(detectTaskType('Classify this email as spam or not')).toBe('classification');
        expect(detectTaskType('Is this sentiment positive or negative?')).toBe('classification');
    });
    it('should detect extraction queries', () => {
        expect(detectTaskType('Extract all names from this document')).toBe('extraction');
        expect(detectTaskType('List all the dates mentioned')).toBe('extraction');
    });
    it('should detect summary queries', () => {
        expect(detectTaskType('Summarize this article')).toBe('summary');
        expect(detectTaskType('Give me a TLDR')).toBe('summary');
    });
    it('should detect code queries', () => {
        expect(detectTaskType('Write a function to sort an array')).toBe('code');
        expect(detectTaskType('Debug this code')).toBe('code');
        expect(detectTaskType('Implement a binary search')).toBe('code');
    });
    it('should detect generation queries', () => {
        expect(detectTaskType('Write an essay about climate change')).toBe('generation');
        expect(detectTaskType('Create a story about a dragon')).toBe('generation');
    });
    it('should detect analysis queries', () => {
        expect(detectTaskType('Analyze the pros and cons')).toBe('analysis');
        expect(detectTaskType('Compare these two approaches')).toBe('analysis');
    });
    it('should default to chat for general queries', () => {
        expect(detectTaskType('Hello, how are you?')).toBe('chat');
        expect(detectTaskType('What time is it?')).toBe('chat');
    });
});
describe('createModelOutputConfig', () => {
    it('should create config for GPT-4', () => {
        const config = createModelOutputConfig('gpt-4', 1000);
        expect(config.modelCapacity).toBe(8192);
        expect(config.inputTokenCount).toBe(1000);
    });
    it('should create config for GPT-4 Turbo', () => {
        const config = createModelOutputConfig('gpt-4-turbo', 5000);
        expect(config.modelCapacity).toBe(128000);
        expect(config.inputTokenCount).toBe(5000);
    });
    it('should create config for Claude models', () => {
        const claude = createModelOutputConfig('claude-3-5-sonnet', 10000);
        expect(claude.modelCapacity).toBe(200000);
    });
    it('should apply overrides', () => {
        const config = createModelOutputConfig('gpt-4', 1000, {
            userPreference: 'detailed',
            taskType: 'code',
        });
        expect(config.userPreference).toBe('detailed');
        expect(config.taskType).toBe('code');
    });
});
describe('input validation', () => {
    it('should throw on non-positive modelCapacity', () => {
        expect(() => calculateDynamicOutputLimit({
            modelCapacity: 0,
            inputTokenCount: 100,
        })).toThrow('modelCapacity must be positive');
        expect(() => calculateDynamicOutputLimit({
            modelCapacity: -1000,
            inputTokenCount: 100,
        })).toThrow('modelCapacity must be positive');
    });
    it('should throw on negative inputTokenCount', () => {
        expect(() => calculateDynamicOutputLimit({
            modelCapacity: 10000,
            inputTokenCount: -100,
        })).toThrow('inputTokenCount cannot be negative');
    });
    it('should throw on negative minOutputTokens', () => {
        expect(() => calculateDynamicOutputLimit({
            modelCapacity: 10000,
            inputTokenCount: 100,
            minOutputTokens: -50,
        })).toThrow('minOutputTokens cannot be negative');
    });
    it('should throw on negative uiConfiguredMax', () => {
        expect(() => calculateDynamicOutputLimit({
            modelCapacity: 10000,
            inputTokenCount: 100,
            uiConfiguredMax: -500,
        })).toThrow('uiConfiguredMax cannot be negative');
    });
    it('should handle inputTokenCount > modelCapacity gracefully', () => {
        const result = calculateDynamicOutputLimit({
            modelCapacity: 1000,
            inputTokenCount: 1500,
        });
        expect(result.absoluteMaxTokens).toBe(0);
        expect(result.recommendedMaxTokens).toBe(0);
        expect(result.inputConstrained).toBe(true);
    });
});
describe('getMaxTokens', () => {
    it('should return recommended max tokens', () => {
        const maxTokens = getMaxTokens(10000, 5000, 'balanced', 'chat');
        expect(maxTokens).toBeGreaterThan(0);
        expect(maxTokens).toBeLessThanOrEqual(5000);
    });
    it('should use defaults when not provided', () => {
        const maxTokens = getMaxTokens(10000, 5000);
        expect(maxTokens).toBeGreaterThan(0);
    });
    it('should respect preference', () => {
        const concise = getMaxTokens(10000, 1000, 'concise', 'chat');
        const detailed = getMaxTokens(10000, 1000, 'detailed', 'chat');
        expect(concise).toBeLessThan(detailed);
    });
});
//# sourceMappingURL=dynamic-output-limit.test.js.map