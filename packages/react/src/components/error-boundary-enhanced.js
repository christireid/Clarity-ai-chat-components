/**
 * Enhanced Error Boundary with Error Tracking Integration
 *
 * This is an enhanced version of ErrorBoundary that integrates with the error tracking system.
 * It automatically reports errors to configured providers and allows user feedback collection.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { ErrorBoundary } from './error-boundary';
import { ErrorFeedback } from '../error/ErrorFeedback';
import { useErrorReporter } from '../error/ErrorReporter';
/**
 * Default Enhanced Fallback component with feedback option
 */
const DefaultEnhancedFallback = React.memo(function DefaultEnhancedFallback({ error, resetError, onFeedbackSubmit, enableFeedback, }) {
    const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
    return (_jsxs("div", { role: "alert", className: "flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]", children: [_jsxs("div", { className: "mb-4 flex items-center gap-3", children: [_jsx("svg", { className: "h-8 w-8 text-destructive", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Something went wrong" })] }), _jsx("p", { className: "mb-4 max-w-md text-center text-sm text-muted-foreground", children: error.message || 'An unexpected error occurred. Please try again.' }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: resetError, className: "rounded-lg bg-destructive px-4 py-2 text-destructive-foreground transition-all duration-150 ease-out hover:opacity-90 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2", children: "Try Again" }), enableFeedback && (_jsx("button", { onClick: () => setShowFeedbackModal(true), className: "rounded-lg border border-destructive bg-card px-4 py-2 text-destructive transition-all duration-150 ease-out hover:bg-destructive/10 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-2", children: "Report Issue" }))] }), process.env['NODE_ENV'] === 'development' && (_jsxs("details", { className: "mt-4 w-full max-w-2xl text-left", children: [_jsx("summary", { className: "cursor-pointer text-sm text-muted-foreground hover:underline hover:text-foreground transition-colors", children: "Error Details (Development Only)" }), _jsx("pre", { className: "mt-2 overflow-auto rounded-lg bg-muted p-3 text-xs text-foreground border border-border", children: error.stack })] })), _jsx(ErrorFeedback, { show: showFeedbackModal, error: error, onSubmit: (feedback) => {
                    onFeedbackSubmit(feedback);
                    setShowFeedbackModal(false);
                }, onCancel: () => setShowFeedbackModal(false) })] }));
});
DefaultEnhancedFallback.displayName = 'DefaultEnhancedFallback';
/**
 * Enhanced Error Boundary Component with Error Tracking
 *
 * This component extends the standard ErrorBoundary with automatic error reporting
 * and optional user feedback collection. It requires ErrorReporterProvider to be
 * present in the component tree.
 *
 * @example
 * ```tsx
 * import { ErrorBoundaryEnhanced, ErrorReporterProvider, createSentryProvider } from '@chat-ui/react'
 *
 * function App() {
 *   return (
 *     <ErrorReporterProvider
 *       config={{
 *         providers: [createSentryProvider({ dsn: 'YOUR_DSN' })],
 *         enabled: true
 *       }}
 *     >
 *       <ErrorBoundaryEnhanced enableFeedback>
 *         <YourApp />
 *       </ErrorBoundaryEnhanced>
 *     </ErrorReporterProvider>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom fallback
 * <ErrorBoundaryEnhanced
 *   enableFeedback
 *   severity="error"
 *   errorContext={{ page: 'chat', feature: 'streaming' }}
 *   fallback={(error, reset, showFeedback) => (
 *     <div>
 *       <h1>Chat Error</h1>
 *       <p>{error.message}</p>
 *       <button onClick={reset}>Retry</button>
 *       <button onClick={showFeedback}>Report</button>
 *     </div>
 *   )}
 * >
 *   <ChatWindow />
 * </ErrorBoundaryEnhanced>
 * ```
 */
export function ErrorBoundaryEnhanced({ children, enableFeedback = true, fallback, errorContext, severity = 'error', onError, ...props }) {
    const errorReporter = useErrorReporter();
    const [currentError, setCurrentError] = React.useState(null);
    const [currentErrorInfo, setCurrentErrorInfo] = React.useState(null);
    const handleError = React.useCallback((error, errorInfo) => {
        setCurrentError(error);
        setCurrentErrorInfo(errorInfo);
        // Report to error tracking
        if (errorReporter.isEnabled) {
            errorReporter.reportErrorDetailed({
                message: error.message,
                stack: error.stack,
                severity: severity,
                componentStack: errorInfo.componentStack ?? undefined,
                context: errorContext,
                handled: false, // Error boundaries catch unhandled errors
                originalError: error,
            });
        }
        // Call custom onError callback
        onError?.(error, errorInfo);
    }, [errorReporter, errorContext, severity, onError]);
    const handleFeedbackSubmit = React.useCallback((feedback) => {
        if (!currentError || !errorReporter.isEnabled)
            return;
        // Report again with user feedback
        errorReporter.reportErrorDetailed({
            message: currentError.message,
            stack: currentError.stack,
            severity: severity,
            componentStack: currentErrorInfo?.componentStack ?? undefined,
            context: errorContext,
            userFeedback: JSON.stringify(feedback),
            handled: false,
            originalError: currentError,
        });
        console.log('[ErrorBoundaryEnhanced] User feedback submitted:', feedback);
    }, [currentError, currentErrorInfo, errorReporter, errorContext, severity]);
    const handleShowFeedback = React.useCallback(() => {
        // Trigger feedback modal (handled by fallback component)
    }, []);
    const enhancedFallback = React.useCallback((error, resetError) => {
        if (fallback) {
            return fallback(error, resetError, handleShowFeedback);
        }
        return (_jsx(DefaultEnhancedFallback, { error: error, resetError: resetError, onFeedbackSubmit: handleFeedbackSubmit, enableFeedback: enableFeedback }));
    }, [fallback, handleFeedbackSubmit, enableFeedback, handleShowFeedback]);
    return (_jsx(ErrorBoundary, { ...props, fallback: enhancedFallback, onError: handleError, children: children }));
}
/**
 * Hook to programmatically trigger error boundary
 * Useful for handling async errors that occur outside of render
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const throwError = useErrorBoundaryTrigger()
 *
 *   const handleAsyncAction = async () => {
 *     try {
 *       await somethingAsync()
 *     } catch (error) {
 *       throwError(error) // This will trigger the error boundary
 *     }
 *   }
 *
 *   return <button onClick={handleAsyncAction}>Do something</button>
 * }
 * ```
 */
export function useErrorBoundaryTrigger() {
    const [, setError] = React.useState(null);
    return React.useCallback((error) => {
        setError(() => {
            throw error;
        });
    }, []);
}
//# sourceMappingURL=error-boundary-enhanced.js.map