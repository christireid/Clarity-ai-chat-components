import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PromptArchitectErrorBoundary Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { PromptArchitectErrorBoundary } from '../components/PromptArchitectErrorBoundary';
// Component that throws an error
const ThrowError = ({ shouldThrow, errorMessage = 'Test error', }) => {
    if (shouldThrow) {
        throw new Error(errorMessage);
    }
    return _jsx("div", { children: "No error" });
};
// Suppress console.error for expected errors in tests
const originalConsoleError = console.error;
beforeEach(() => {
    console.error = vi.fn();
});
afterEach(() => {
    console.error = originalConsoleError;
});
describe('PromptArchitectErrorBoundary', () => {
    describe('Normal rendering', () => {
        it('should render children when no error occurs', () => {
            render(_jsx(PromptArchitectErrorBoundary, { children: _jsx("div", { children: "Child content" }) }));
            expect(screen.getByText('Child content')).toBeInTheDocument();
        });
    });
    describe('Error handling', () => {
        it('should catch errors and display fallback', () => {
            render(_jsx(PromptArchitectErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
            expect(screen.getByText('Test error')).toBeInTheDocument();
        });
        it('should display Try Again button in fallback', () => {
            render(_jsx(PromptArchitectErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
            expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
        });
        it('should call onError callback when error occurs', () => {
            const onError = vi.fn();
            render(_jsx(PromptArchitectErrorBoundary, { onError: onError, children: _jsx(ThrowError, { shouldThrow: true, errorMessage: "Custom error" }) }));
            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Custom error' }), expect.objectContaining({ componentStack: expect.any(String) }));
        });
    });
    describe('Custom fallback', () => {
        it('should render custom fallback function', () => {
            const fallback = vi.fn(({ error, resetError }) => (_jsxs("div", { children: [_jsxs("span", { children: ["Custom error: ", error.message] }), _jsx("button", { onClick: resetError, children: "Custom Reset" })] })));
            render(_jsx(PromptArchitectErrorBoundary, { fallback: fallback, children: _jsx(ThrowError, { shouldThrow: true, errorMessage: "Fallback test error" }) }));
            expect(fallback).toHaveBeenCalled();
            expect(screen.getByText('Custom error: Fallback test error')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Custom Reset' })).toBeInTheDocument();
        });
    });
    describe('Reset functionality', () => {
        it('should reset error state when reset button is clicked', () => {
            const TestComponent = () => {
                const [shouldThrow, setShouldThrow] = React.useState(true);
                return (_jsx("div", { children: _jsx(PromptArchitectErrorBoundary, { fallback: ({ error, resetError }) => (_jsxs("div", { children: [_jsx("span", { children: "Error occurred" }), _jsx("button", { onClick: () => {
                                        setShouldThrow(false);
                                        resetError();
                                    }, children: "Reset" })] })), children: _jsx(ThrowError, { shouldThrow: shouldThrow }) }) }));
            };
            render(_jsx(TestComponent, {}));
            // Initially shows error
            expect(screen.getByText('Error occurred')).toBeInTheDocument();
            // Click reset
            fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
            // After reset, should show normal content
            expect(screen.getByText('No error')).toBeInTheDocument();
        });
        it('should call onReset callback when reset is triggered', () => {
            const onReset = vi.fn();
            const TestComponent = () => {
                const [shouldThrow, setShouldThrow] = React.useState(true);
                return (_jsx(PromptArchitectErrorBoundary, { onReset: onReset, fallback: ({ resetError }) => (_jsx("button", { onClick: () => {
                            setShouldThrow(false);
                            resetError();
                        }, children: "Reset" })), children: _jsx(ThrowError, { shouldThrow: shouldThrow }) }));
            };
            render(_jsx(TestComponent, {}));
            fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
            expect(onReset).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=PromptArchitectErrorBoundary.test.js.map