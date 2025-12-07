import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ErrorBoundary Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { ErrorBoundary } from '../error-boundary';
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
describe('ErrorBoundary', () => {
    describe('Normal rendering', () => {
        it('should render children when no error occurs', () => {
            render(_jsx(ErrorBoundary, { children: _jsx("div", { children: "Child content" }) }));
            expect(screen.getByText('Child content')).toBeInTheDocument();
        });
        it('should render multiple children', () => {
            render(_jsxs(ErrorBoundary, { children: [_jsx("div", { children: "First child" }), _jsx("div", { children: "Second child" })] }));
            expect(screen.getByText('First child')).toBeInTheDocument();
            expect(screen.getByText('Second child')).toBeInTheDocument();
        });
    });
    describe('Error handling', () => {
        it('should catch errors and display default fallback', () => {
            render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
            expect(screen.getByRole('alert')).toBeInTheDocument();
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
            expect(screen.getByText('Test error')).toBeInTheDocument();
        });
        it('should display Try Again button in fallback', () => {
            render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
            expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
        });
        it('should call onError callback when error occurs', () => {
            const onError = vi.fn();
            render(_jsx(ErrorBoundary, { onError: onError, children: _jsx(ThrowError, { shouldThrow: true, errorMessage: "Custom error" }) }));
            expect(onError).toHaveBeenCalledTimes(1);
            expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Custom error' }), expect.objectContaining({ componentStack: expect.any(String) }));
        });
        it('should call logError callback when error occurs', () => {
            const logError = vi.fn();
            render(_jsx(ErrorBoundary, { logError: logError, children: _jsx(ThrowError, { shouldThrow: true }) }));
            expect(logError).toHaveBeenCalledTimes(1);
            expect(logError).toHaveBeenCalledWith(expect.any(Error), expect.objectContaining({ componentStack: expect.any(String) }));
        });
    });
    describe('Custom fallback', () => {
        it('should render custom fallback ReactNode', () => {
            render(_jsx(ErrorBoundary, { fallback: _jsx("div", { children: "Custom error UI" }), children: _jsx(ThrowError, { shouldThrow: true }) }));
            expect(screen.getByText('Custom error UI')).toBeInTheDocument();
            expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
        });
        it('should render custom fallback function with error and reset', () => {
            const fallback = vi.fn((error, resetError) => (_jsxs("div", { children: [_jsxs("span", { children: ["Error: ", error.message] }), _jsx("button", { onClick: resetError, children: "Reset" })] })));
            render(_jsx(ErrorBoundary, { fallback: fallback, children: _jsx(ThrowError, { shouldThrow: true, errorMessage: "Function fallback error" }) }));
            expect(fallback).toHaveBeenCalled();
            expect(screen.getByText('Error: Function fallback error')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
        });
    });
    describe('Reset functionality', () => {
        it('should reset error state when reset button is clicked', () => {
            const TestComponent = () => {
                const [shouldThrow, setShouldThrow] = React.useState(true);
                return (_jsxs("div", { children: [_jsx("button", { onClick: () => setShouldThrow(false), children: "Fix error" }), _jsx(ErrorBoundary, { fallback: (error, reset) => (_jsxs("div", { children: [_jsx("span", { children: "Error occurred" }), _jsx("button", { onClick: () => {
                                            setShouldThrow(false);
                                            reset();
                                        }, children: "Reset" })] })), children: _jsx(ThrowError, { shouldThrow: shouldThrow }) })] }));
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
                return (_jsx(ErrorBoundary, { onReset: onReset, fallback: (error, reset) => (_jsx("button", { onClick: () => {
                            setShouldThrow(false);
                            reset();
                        }, children: "Reset" })), children: _jsx(ThrowError, { shouldThrow: shouldThrow }) }));
            };
            render(_jsx(TestComponent, {}));
            fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
            expect(onReset).toHaveBeenCalledTimes(1);
        });
        it('should call reset function when Try Again button is clicked', () => {
            // This test verifies that the reset mechanism is triggered
            // The actual re-render behavior depends on whether the error source is fixed
            const onReset = vi.fn();
            render(_jsx(ErrorBoundary, { onReset: onReset, children: _jsx(ThrowError, { shouldThrow: true }) }));
            // Should show error initially
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
            // Click Try Again - this should trigger reset
            fireEvent.click(screen.getByRole('button', { name: /try again/i }));
            // onReset should have been called
            expect(onReset).toHaveBeenCalledTimes(1);
        });
    });
    describe('Reset keys', () => {
        it('should reset when resetKeys change', () => {
            const TestComponent = () => {
                const [key, setKey] = React.useState(1);
                const [shouldThrow, setShouldThrow] = React.useState(true);
                return (_jsxs("div", { children: [_jsx("button", { onClick: () => {
                                setShouldThrow(false);
                                setKey((k) => k + 1);
                            }, children: "Change key" }), _jsx(ErrorBoundary, { resetKeys: [key], children: _jsx(ThrowError, { shouldThrow: shouldThrow }) })] }));
            };
            render(_jsx(TestComponent, {}));
            // Initially shows error
            expect(screen.getByText('Something went wrong')).toBeInTheDocument();
            // Change key
            fireEvent.click(screen.getByRole('button', { name: 'Change key' }));
            // After key change, should show normal content
            expect(screen.getByText('No error')).toBeInTheDocument();
        });
    });
    describe('Accessibility', () => {
        it('should have role="alert" on error state', () => {
            render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });
        it('should have accessible button in fallback', () => {
            render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true }) }));
            const button = screen.getByRole('button', { name: /try again/i });
            expect(button).toBeInTheDocument();
            expect(button).not.toBeDisabled();
        });
    });
    describe('Error message display', () => {
        it('should display error message in fallback', () => {
            render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { shouldThrow: true, errorMessage: "Specific error message" }) }));
            expect(screen.getByText('Specific error message')).toBeInTheDocument();
        });
        it('should display default message for errors without message', () => {
            const ThrowEmptyError = () => {
                throw new Error();
            };
            render(_jsx(ErrorBoundary, { children: _jsx(ThrowEmptyError, {}) }));
            expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=error-boundary.test.js.map