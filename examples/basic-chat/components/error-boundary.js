'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Also provides retry functionality.
 */
import { Component, ReactNode } from 'react';
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }
    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 mb-4 rounded-full bg-destructive/10 flex items-center justify-center", children: _jsx("svg", { className: "w-8 h-8 text-destructive", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsx("h2", { className: "text-xl font-semibold mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-muted-foreground mb-4 max-w-md", children: this.state.error?.message || 'An unexpected error occurred' }), _jsx("button", { onClick: this.handleRetry, className: "px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors", children: "Try Again" })] }));
        }
        return this.props.children;
    }
}
/**
 * Inline Error Display Component
 * For displaying errors within the chat interface without breaking the entire UI
 */
export function InlineError({ message, onRetry, onDismiss, }) {
    return (_jsxs("div", { className: "mx-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("svg", { className: "w-5 h-5 text-destructive flex-shrink-0 mt-0.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-destructive font-medium", children: "Error" }), _jsx("p", { className: "text-sm text-destructive/80 mt-1", children: message })] }), onDismiss && (_jsx("button", { onClick: onDismiss, className: "text-destructive/60 hover:text-destructive", "aria-label": "Dismiss error", children: _jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }), onRetry && (_jsx("div", { className: "mt-3 flex justify-end", children: _jsx("button", { onClick: onRetry, className: "px-4 py-1.5 text-sm bg-destructive/20 text-destructive rounded-md hover:bg-destructive/30 transition-colors", children: "Retry" }) }))] }));
}
/**
 * Hook for retry logic with exponential backoff
 */
export function useRetry(maxRetries = 3, baseDelay = 1000) {
    const retryWithBackoff = async (fn, onRetry) => {
        let lastError = new Error('Unknown error');
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    onRetry?.(attempt + 1, lastError);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError;
    };
    return { retryWithBackoff };
}
export default ErrorBoundary;
//# sourceMappingURL=error-boundary.js.map