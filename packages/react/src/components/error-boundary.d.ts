import * as React from 'react';
/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
    /** Child components to render */
    children: React.ReactNode;
    /** Fallback UI to render when error occurs */
    fallback?: React.ReactNode | ((error: Error, resetError: () => void) => React.ReactNode);
    /** Callback when error is caught */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    /** Callback when error boundary is reset */
    onReset?: () => void;
    /** Keys that trigger reset when changed */
    resetKeys?: Array<string | number>;
    /** Custom error logging function */
    logError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
/**
 * Error boundary state
 */
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
/**
 * Production-ready Error Boundary component for graceful error handling.
 *
 * **Features:**
 * - Catches JavaScript errors anywhere in child component tree
 * - Logs error information for debugging
 * - Displays fallback UI when errors occur
 * - Provides reset functionality to recover from errors
 * - Supports custom fallback components
 * - Automatic reset when resetKeys change
 * - Development mode shows detailed error info
 *
 * **Use Cases:**
 * - Wrap entire chat application for top-level error handling
 * - Wrap individual message components for isolated error handling
 * - Wrap streaming components to handle API failures
 * - Wrap third-party integrations
 *
 * @example
 * ```tsx
 * // Basic usage with default fallback
 * <ErrorBoundary>
 *   <ChatWindow />
 * </ErrorBoundary>
 *
 * // Custom fallback UI
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <h1>Chat Error: {error.message}</h1>
 *       <button onClick={reset}>Retry</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => {
 *     console.error('Chat error:', error, errorInfo)
 *     analytics.track('chat_error', { error: error.message })
 *   }}
 * >
 *   <ChatWindow />
 * </ErrorBoundary>
 *
 * // Auto-reset on conversation change
 * <ErrorBoundary
 *   resetKeys={[conversationId]}
 *   onReset={() => {
 *     console.log('Error boundary reset for new conversation')
 *   }}
 * >
 *   <ChatWindow conversationId={conversationId} />
 * </ErrorBoundary>
 *
 * // Custom error logging
 * <ErrorBoundary
 *   logError={(error, errorInfo) => {
 *     Sentry.captureException(error, {
 *       contexts: {
 *         react: {
 *           componentStack: errorInfo.componentStack,
 *         },
 *       },
 *     })
 *   }}
 * >
 *   <ChatWindow />
 * </ErrorBoundary>
 * ```
 */
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    componentDidUpdate(prevProps: ErrorBoundaryProps): void;
    reset: () => void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=error-boundary.d.ts.map