import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { ConfigurationError } from '../../src/errors';
// Component that throws an error
function ThrowError({ error }) {
    if (error) {
        throw error;
    }
    throw new Error('Test error');
}
// Component with conditional error
function ConditionalError({ shouldThrow }) {
    if (shouldThrow) {
        throw new Error('Conditional error');
    }
    return _jsx("div", { children: "No error" });
}
describe('ErrorBoundary', () => {
    it('should render children when no error occurs', () => {
        render(_jsx(ErrorBoundary, { children: _jsx("div", { children: "Child component" }) }));
        expect(screen.getByText('Child component')).toBeInTheDocument();
    });
    it('should catch error and render default fallback', () => {
        render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, {}) }));
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });
    it('should render custom fallback when provided', () => {
        const customFallback = ({ error }) => (_jsxs("div", { children: [_jsx("h1", { children: "Custom Error UI" }), _jsx("p", { children: error.message })] }));
        render(_jsx(ErrorBoundary, { fallback: customFallback, children: _jsx(ThrowError, {}) }));
        expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
        expect(screen.getByText('Test error')).toBeInTheDocument();
    });
    it('should call onError callback when error occurs', () => {
        const onError = vi.fn();
        render(_jsx(ErrorBoundary, { onError: onError, children: _jsx(ThrowError, {}) }));
        expect(onError).toHaveBeenCalled();
        const [error, errorInfo] = onError.mock.calls[0];
        expect(error.message).toBe('Test error');
        expect(errorInfo).toBeDefined();
    });
    it('should display solution for ClarityChatError', () => {
        const error = new ConfigurationError('Missing config', {
            code: 'MISSING_CONFIG',
            solution: 'Add the required configuration',
        });
        render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, { error: error }) }));
        expect(screen.getByText(/💡 Solution:/)).toBeInTheDocument();
        expect(screen.getByText('Add the required configuration')).toBeInTheDocument();
    });
    it('should reset error when resetError is called', async () => {
        let shouldThrow = true;
        const { rerender } = render(_jsx(ErrorBoundary, { children: _jsx(ConditionalError, { shouldThrow: shouldThrow }) }));
        // Error should be caught
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        // Change condition first so component won't throw after reset
        shouldThrow = false;
        // Update the component first so it won't throw
        await act(async () => {
            rerender(_jsx(ErrorBoundary, { children: _jsx(ConditionalError, { shouldThrow: shouldThrow }) }));
        });
        // Now click reset button - error boundary should clear and show children
        const resetButton = screen.getByText(/try again/i);
        await act(async () => {
            fireEvent.click(resetButton);
        });
        // Should show content, not error
        await waitFor(() => {
            expect(screen.getByText('No error')).toBeInTheDocument();
        }, { timeout: 3000 });
        // Verify error is gone
        expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
    });
    it('should call onReset callback when error is reset', () => {
        const onReset = vi.fn();
        render(_jsx(ErrorBoundary, { onReset: onReset, children: _jsx(ThrowError, {}) }));
        const resetButton = screen.getByText(/try again/i);
        fireEvent.click(resetButton);
        expect(onReset).toHaveBeenCalled();
    });
    it('should show stack trace in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';
        render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, {}) }));
        const details = screen.getByText('Stack trace');
        expect(details).toBeInTheDocument();
        process.env.NODE_ENV = originalEnv;
    });
    it('should handle errors from nested components', () => {
        render(_jsx(ErrorBoundary, { children: _jsx("div", { children: _jsx("div", { children: _jsx(ThrowError, {}) }) }) }));
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
    it('should maintain separate error state for multiple boundaries', () => {
        render(_jsxs("div", { children: [_jsx(ErrorBoundary, { children: _jsx(ThrowError, { error: new Error('Error 1') }) }), _jsx(ErrorBoundary, { children: _jsx(ThrowError, { error: new Error('Error 2') }) })] }));
        expect(screen.getByText('Error 1')).toBeInTheDocument();
        expect(screen.getByText('Error 2')).toBeInTheDocument();
    });
    it('should provide resetError function in fallback', () => {
        const fallback = ({ resetError }) => (_jsx("div", { children: _jsx("button", { onClick: resetError, children: "Custom Reset" }) }));
        render(_jsx(ErrorBoundary, { fallback: fallback, children: _jsx(ThrowError, {}) }));
        const resetButton = screen.getByText('Custom Reset');
        expect(resetButton).toBeInTheDocument();
        // Should be able to click without errors
        fireEvent.click(resetButton);
    });
});
//# sourceMappingURL=ErrorBoundary.test.js.map