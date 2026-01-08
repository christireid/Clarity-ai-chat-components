import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { render, screen, act, renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TokenBudgetProvider, useTokenBudget, useTokenBudgetOptional, } from '../token-budget-context';
// Mock the underlying hook
vi.mock('../../hooks/use-token-budget-monitor', async () => {
    const actual = await vi.importActual('../../hooks/use-token-budget-monitor');
    return {
        ...actual,
        useTokenBudgetMonitor: vi.fn(() => ({
            usage: {
                current: 0,
                max: 128000,
                available: 123904,
                utilizationPercent: 0,
                exceededPercent: 0,
                status: 'safe',
                reservedForOutput: 4096,
                effectiveMax: 123904,
            },
            isWarning: false,
            isCritical: false,
            isExceeded: false,
            wouldExceed: vi.fn(() => false),
            calculateTokens: vi.fn(async () => 10),
            updateMessages: vi.fn(),
            trimToCritical: vi.fn(() => null),
            reset: vi.fn(),
            lastTrimResult: null,
            isCalculating: false,
        })),
    };
});
describe('TokenBudgetProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('basic rendering', () => {
        it('renders children', () => {
            render(_jsx(TokenBudgetProvider, { children: _jsx("div", { "data-testid": "child", children: "Hello" }) }));
            expect(screen.getByTestId('child')).toBeInTheDocument();
        });
        it('accepts custom config', () => {
            render(_jsx(TokenBudgetProvider, { config: { maxInputTokens: 64000, reservedForOutput: 2048 }, children: _jsx("div", { children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
        it('accepts model preset', () => {
            render(_jsx(TokenBudgetProvider, { model: "gpt-4o", children: _jsx("div", { children: "Content" }) }));
            expect(screen.getByText('Content')).toBeInTheDocument();
        });
    });
});
describe('useTokenBudget', () => {
    it('provides budget context values', () => {
        function TestComponent() {
            const budget = useTokenBudget();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "current", children: budget.usage.current }), _jsx("span", { "data-testid": "max", children: budget.usage.max }), _jsx("span", { "data-testid": "status", children: budget.usage.status })] }));
        }
        render(_jsx(TokenBudgetProvider, { children: _jsx(TestComponent, {}) }));
        expect(screen.getByTestId('current')).toHaveTextContent('0');
        expect(screen.getByTestId('max')).toHaveTextContent('128000');
        expect(screen.getByTestId('status')).toHaveTextContent('safe');
    });
    it('throws error when used outside provider', () => {
        // Suppress console.error for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        function TestComponent() {
            useTokenBudget();
            return _jsx("div", { children: "Should not render" });
        }
        expect(() => render(_jsx(TestComponent, {}))).toThrow('[useTokenBudget] must be used within a TokenBudgetProvider');
        consoleSpy.mockRestore();
    });
    it('provides model setter', () => {
        let capturedSetModel = null;
        function TestComponent() {
            const budget = useTokenBudget();
            capturedSetModel = budget.setModel;
            return _jsx("div", { "data-testid": "model", children: budget.model ?? 'none' });
        }
        render(_jsx(TokenBudgetProvider, { model: "gpt-4o", children: _jsx(TestComponent, {}) }));
        expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o');
        expect(capturedSetModel).toBeDefined();
    });
    it('provides config updater', () => {
        let capturedUpdateConfig = null;
        function TestComponent() {
            const budget = useTokenBudget();
            capturedUpdateConfig = budget.updateConfig;
            return _jsx("div", { "data-testid": "config", children: budget.config.maxInputTokens });
        }
        render(_jsx(TokenBudgetProvider, { config: { maxInputTokens: 64000 }, children: _jsx(TestComponent, {}) }));
        expect(screen.getByTestId('config')).toHaveTextContent('64000');
        expect(capturedUpdateConfig).toBeDefined();
    });
});
describe('useTokenBudgetOptional', () => {
    it('returns context when inside provider', () => {
        function TestComponent() {
            const budget = useTokenBudgetOptional();
            return (_jsx("div", { "data-testid": "result", children: budget ? 'has-context' : 'no-context' }));
        }
        render(_jsx(TokenBudgetProvider, { children: _jsx(TestComponent, {}) }));
        expect(screen.getByTestId('result')).toHaveTextContent('has-context');
    });
    it('returns null when outside provider', () => {
        function TestComponent() {
            const budget = useTokenBudgetOptional();
            return (_jsx("div", { "data-testid": "result", children: budget ? 'has-context' : 'no-context' }));
        }
        render(_jsx(TestComponent, {}));
        expect(screen.getByTestId('result')).toHaveTextContent('no-context');
    });
});
describe('model changes', () => {
    it('updates config when model changes', () => {
        let capturedSetModel = null;
        function TestComponent() {
            const budget = useTokenBudget();
            capturedSetModel = budget.setModel;
            return _jsx("div", { "data-testid": "model", children: budget.model ?? 'none' });
        }
        const { rerender } = render(_jsx(TokenBudgetProvider, { model: "gpt-4o", children: _jsx(TestComponent, {}) }));
        expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o');
        // Change model via setModel
        act(() => {
            capturedSetModel?.('claude-sonnet-4');
        });
        // The component should show updated model
        expect(screen.getByTestId('model')).toHaveTextContent('claude-sonnet-4');
    });
    it('warns on invalid model', () => {
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
        let capturedSetModel = null;
        function TestComponent() {
            const budget = useTokenBudget();
            capturedSetModel = budget.setModel;
            return _jsx("div", { "data-testid": "model", children: budget.model ?? 'none' });
        }
        render(_jsx(TokenBudgetProvider, { model: "gpt-4o", children: _jsx(TestComponent, {}) }));
        // Try to set invalid model
        act(() => {
            capturedSetModel?.('invalid-model');
        });
        // Should warn and not change
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid model'));
        expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o');
        consoleSpy.mockRestore();
    });
});
describe('config overrides', () => {
    it('applies config overrides with model preset', () => {
        function TestComponent() {
            const budget = useTokenBudget();
            return (_jsxs("div", { children: [_jsx("span", { "data-testid": "model", children: budget.model }), _jsx("span", { "data-testid": "autoTrim", children: budget.config.autoTrim ? 'yes' : 'no' })] }));
        }
        render(_jsx(TokenBudgetProvider, { model: "gpt-4o", configOverrides: { autoTrim: true }, children: _jsx(TestComponent, {}) }));
        expect(screen.getByTestId('model')).toHaveTextContent('gpt-4o');
        expect(screen.getByTestId('autoTrim')).toHaveTextContent('yes');
    });
});
//# sourceMappingURL=token-budget-context.test.js.map