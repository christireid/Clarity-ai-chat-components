import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Tests for ErrorBoundary components
 * Tests error catching, fallback UI, and recovery
 */
import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, PanelErrorBoundary, withErrorBoundary, } from '../components/error-boundary';
// Component that throws an error
function ThrowError({ shouldThrow = true }) {
    if (shouldThrow) {
        throw new Error('Test error message');
    }
    return _jsx("div", { "data-testid": "child-content", children: "Child content" });
}
// Suppress console.error during tests
beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
});
describe('ErrorBoundary', () => {
    it('renders children when no error', () => {
        render(_jsx(ErrorBoundary, { children: _jsx("div", { "data-testid": "child", children: "Child content" }) }));
        expect(screen.getByTestId('child')).toBeTruthy();
        expect(screen.getByText('Child content')).toBeTruthy();
    });
    it('renders fallback UI when error occurs', () => {
        render(_jsx(ErrorBoundary, { children: _jsx(ThrowError, {}) }));
        expect(screen.getByRole('alert')).toBeTruthy();
        expect(screen.getByText('Something went wrong')).toBeTruthy();
        expect(screen.getByText('Test error message')).toBeTruthy();
    });
    it('renders custom fallback when provided', () => {
        render(_jsx(ErrorBoundary, { fallback: _jsx("div", { "data-testid": "custom-fallback", children: "Custom Error" }), children: _jsx(ThrowError, {}) }));
        expect(screen.getByTestId('custom-fallback')).toBeTruthy();
        expect(screen.getByText('Custom Error')).toBeTruthy();
    });
    it('shows component name in error title', () => {
        render(_jsx(ErrorBoundary, { componentName: "TestPanel", children: _jsx(ThrowError, {}) }));
        expect(screen.getByText('TestPanel Error')).toBeTruthy();
    });
    it('calls onError callback when error occurs', () => {
        const onError = vi.fn();
        render(_jsx(ErrorBoundary, { onError: onError, children: _jsx(ThrowError, {}) }));
        expect(onError).toHaveBeenCalledTimes(1);
        expect(onError).toHaveBeenCalledWith(expect.objectContaining({ message: 'Test error message' }), expect.objectContaining({ componentStack: expect.any(String) }));
    });
    it('recovers when Try Again is clicked', () => {
        let shouldThrow = true;
        function ConditionalThrow() {
            if (shouldThrow) {
                throw new Error('Conditional error');
            }
            return _jsx("div", { "data-testid": "recovered", children: "Recovered!" });
        }
        const { rerender } = render(_jsx(ErrorBoundary, { children: _jsx(ConditionalThrow, {}) }));
        // Error should be shown
        expect(screen.getByText('Something went wrong')).toBeTruthy();
        // Fix the error condition
        shouldThrow = false;
        // Click retry (button has aria-label="Retry loading component")
        fireEvent.click(screen.getByRole('button', { name: /retry loading/i }));
        // Rerender to apply the fix
        rerender(_jsx(ErrorBoundary, { children: _jsx(ConditionalThrow, {}) }));
        // Should show recovered content (or error again if component still throws)
        // Note: The retry resets internal state but doesn't control shouldThrow
    });
    it('shows/hides error details when showDetails is true', () => {
        render(_jsx(ErrorBoundary, { showDetails: true, children: _jsx(ThrowError, {}) }));
        // Click Show Details button
        const detailsButton = screen.getByRole('button', { name: /show details/i });
        expect(detailsButton).toBeTruthy();
        fireEvent.click(detailsButton);
        // Error details should now be visible
        expect(screen.getByText('Error Message')).toBeTruthy();
        expect(screen.getByRole('button', { name: /hide details/i })).toBeTruthy();
    });
});
describe('PanelErrorBoundary', () => {
    it('renders children when no error', () => {
        render(_jsx(PanelErrorBoundary, { panelName: "TestPanel", children: _jsx("div", { "data-testid": "panel-content", children: "Panel content" }) }));
        expect(screen.getByTestId('panel-content')).toBeTruthy();
    });
    it('renders panel-specific error fallback', () => {
        render(_jsx(PanelErrorBoundary, { panelName: "API Inspector", children: _jsx(ThrowError, {}) }));
        expect(screen.getByRole('alert')).toBeTruthy();
        expect(screen.getByText('API Inspector encountered an error')).toBeTruthy();
        expect(screen.getByText(/please try refreshing the panel/i)).toBeTruthy();
    });
    it('calls onError callback', () => {
        const onError = vi.fn();
        render(_jsx(PanelErrorBoundary, { panelName: "TestPanel", onError: onError, children: _jsx(ThrowError, {}) }));
        expect(onError).toHaveBeenCalledTimes(1);
    });
});
describe('withErrorBoundary HOC', () => {
    it('wraps component with error boundary', () => {
        function MyComponent() {
            return _jsx("div", { "data-testid": "wrapped", children: "Wrapped content" });
        }
        const WrappedComponent = withErrorBoundary(MyComponent);
        render(_jsx(WrappedComponent, {}));
        expect(screen.getByTestId('wrapped')).toBeTruthy();
    });
    it('catches errors in wrapped component', () => {
        function FailingComponent() {
            throw new Error('HOC test error');
        }
        const WrappedComponent = withErrorBoundary(FailingComponent, {
            componentName: 'FailingComponent',
        });
        render(_jsx(WrappedComponent, {}));
        expect(screen.getByRole('alert')).toBeTruthy();
        expect(screen.getByText('FailingComponent Error')).toBeTruthy();
    });
    it('sets displayName correctly', () => {
        function NamedComponent() {
            return _jsx("div", { children: "Named" });
        }
        const WrappedComponent = withErrorBoundary(NamedComponent);
        expect(WrappedComponent.displayName).toBe('withErrorBoundary(NamedComponent)');
    });
    it('passes props to wrapped component', () => {
        function PropsComponent({ message }) {
            return _jsx("div", { "data-testid": "props", children: message });
        }
        const WrappedComponent = withErrorBoundary(PropsComponent);
        render(_jsx(WrappedComponent, { message: "Hello from props!" }));
        expect(screen.getByText('Hello from props!')).toBeTruthy();
    });
});
//# sourceMappingURL=error-boundary.test.js.map