/**
 * Tests for usePromptPlayground hook
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePromptPlayground, MODEL_PRICING } from '../use-prompt-playground';
describe('usePromptPlayground', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('initialization', () => {
        it('should initialize with empty template', () => {
            const { result } = renderHook(() => usePromptPlayground());
            expect(result.current.state.template).toBe('');
            expect(result.current.state.variables).toEqual({});
            expect(result.current.state.output).toBe('');
            expect(result.current.state.errors).toEqual([]);
        });
        it('should initialize with provided template string', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello {{name}}',
                initialVariables: { name: 'World' },
            }));
            expect(result.current.state.template).toBe('Hello {{name}}');
            expect(result.current.state.variables).toEqual({ name: 'World' });
        });
        it('should initialize with PromptTemplate object', () => {
            const template = {
                id: 'test-1',
                name: 'Test',
                template: 'Hello {{name}}',
                variables: [{ name: 'name', default: 'Default' }],
            };
            const { result } = renderHook(() => usePromptPlayground({ initialTemplate: template }));
            expect(result.current.state.template).toBe('Hello {{name}}');
        });
    });
    describe('template editing', () => {
        it('should update template', () => {
            const { result } = renderHook(() => usePromptPlayground());
            act(() => {
                result.current.setTemplate('New template');
            });
            expect(result.current.state.template).toBe('New template');
        });
        it('should update token count when template changes', () => {
            const { result } = renderHook(() => usePromptPlayground());
            const initialTokens = result.current.state.tokenCount;
            act(() => {
                result.current.setTemplate('A much longer template with many words');
            });
            expect(result.current.state.tokenCount).toBeGreaterThan(initialTokens);
        });
    });
    describe('variable management', () => {
        it('should set single variable', () => {
            const { result } = renderHook(() => usePromptPlayground({ initialTemplate: 'Hello {{name}}' }));
            act(() => {
                result.current.setVariable('name', 'Alice');
            });
            expect(result.current.state.variables).toEqual({ name: 'Alice' });
        });
        it('should set multiple variables', () => {
            const { result } = renderHook(() => usePromptPlayground({ initialTemplate: 'Hello {{name}}, age {{age}}' }));
            act(() => {
                result.current.setVariables({ name: 'Alice', age: '30' });
            });
            expect(result.current.state.variables).toEqual({
                name: 'Alice',
                age: '30',
            });
        });
        it('should extract variables from template', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello {{name}}, you are {{age}} years old. {{name}} is great!',
            }));
            const variables = result.current.extractVariables();
            expect(variables).toContain('name');
            expect(variables).toContain('age');
            expect(variables).toHaveLength(2); // Deduplicated
        });
    });
    describe('rendering', () => {
        it('should render template manually', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello {{name}}',
                initialVariables: { name: 'World' },
                autoRender: false,
            }));
            act(() => {
                result.current.render();
            });
            expect(result.current.state.output).toBe('Hello World');
        });
        it('should auto-render with debounce', async () => {
            const onRender = vi.fn();
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello {{name}}',
                initialVariables: { name: 'World' },
                autoRender: true,
                debounceMs: 100,
                onRender,
            }));
            // Trigger change
            act(() => {
                result.current.setVariable('name', 'Universe');
            });
            // Before debounce
            expect(onRender).not.toHaveBeenCalled();
            // After debounce - advance timers and flush all pending effects
            await act(async () => {
                vi.advanceTimersByTime(150);
                await vi.runAllTimersAsync();
            });
            expect(result.current.state.output).toBe('Hello Universe');
        });
        it('should report errors for invalid templates', () => {
            const onError = vi.fn();
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello {{name}',
                autoRender: false,
                onError,
            }));
            const validation = result.current.validate();
            expect(validation.valid).toBe(false);
            expect(validation.errors).toBeDefined();
        });
    });
    describe('validation', () => {
        it('should validate correct template', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello {{name}}!',
            }));
            const validation = result.current.validate();
            expect(validation.valid).toBe(true);
        });
        it('should detect mismatched delimiters', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello {{name}!',
            }));
            const validation = result.current.validate();
            expect(validation.valid).toBe(false);
        });
    });
    describe('cost estimation', () => {
        it('should estimate cost with default model', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello World',
                model: 'gpt-4o',
            }));
            const cost = result.current.getEstimatedCost(100);
            expect(cost.input).toBeGreaterThan(0);
            expect(cost.output).toBeGreaterThan(0);
            expect(cost.total).toBe(cost.input + cost.output);
        });
        it('should use correct pricing for model', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Hello',
                model: 'gpt-3.5-turbo',
            }));
            expect(result.current.pricing.id).toBe('gpt-3.5-turbo');
            expect(result.current.pricing.inputCostPer1k).toBe(MODEL_PRICING['gpt-3.5-turbo']?.inputCostPer1k);
        });
        it('should change model', () => {
            const { result } = renderHook(() => usePromptPlayground({ model: 'gpt-4o' }));
            expect(result.current.pricing.id).toBe('gpt-4o');
            act(() => {
                result.current.setModel('claude-3-haiku');
            });
            expect(result.current.pricing.id).toBe('claude-3-haiku');
        });
    });
    describe('template loading', () => {
        it('should load template with defaults', () => {
            const { result } = renderHook(() => usePromptPlayground());
            const template = {
                id: 'loaded',
                name: 'Loaded Template',
                template: 'Hello {{name}}, {{greeting}}',
                variables: [
                    { name: 'name', default: 'User' },
                    { name: 'greeting', default: 'welcome!' },
                ],
            };
            act(() => {
                result.current.loadTemplate(template);
            });
            expect(result.current.state.template).toBe('Hello {{name}}, {{greeting}}');
            expect(result.current.state.variables).toEqual({
                name: 'User',
                greeting: 'welcome!',
            });
        });
    });
    describe('reset', () => {
        it('should reset to initial state', () => {
            const { result } = renderHook(() => usePromptPlayground({
                initialTemplate: 'Initial',
                initialVariables: { key: 'value' },
            }));
            act(() => {
                result.current.setTemplate('Changed');
                result.current.setVariable('key', 'changed');
            });
            expect(result.current.state.template).toBe('Changed');
            act(() => {
                result.current.reset();
            });
            expect(result.current.state.template).toBe('Initial');
            expect(result.current.state.variables).toEqual({ key: 'value' });
        });
    });
    describe('MODEL_PRICING', () => {
        it('should have all common models', () => {
            expect(MODEL_PRICING['gpt-4o']).toBeDefined();
            expect(MODEL_PRICING['gpt-4o-mini']).toBeDefined();
            expect(MODEL_PRICING['gpt-3.5-turbo']).toBeDefined();
            expect(MODEL_PRICING['claude-3-5-sonnet']).toBeDefined();
            expect(MODEL_PRICING['claude-3-opus']).toBeDefined();
            expect(MODEL_PRICING['claude-3-haiku']).toBeDefined();
        });
        it('should have valid pricing structure', () => {
            Object.values(MODEL_PRICING).forEach((model) => {
                expect(model.id).toBeDefined();
                expect(model.name).toBeDefined();
                expect(model.inputCostPer1k).toBeGreaterThanOrEqual(0);
                expect(model.outputCostPer1k).toBeGreaterThanOrEqual(0);
                expect(model.maxTokens).toBeGreaterThan(0);
            });
        });
    });
});
//# sourceMappingURL=use-prompt-playground.test.js.map