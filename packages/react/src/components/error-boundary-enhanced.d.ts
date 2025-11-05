/**
 * Enhanced Error Boundary with Error Tracking Integration
 *
 * This is an enhanced version of ErrorBoundary that integrates with the error tracking system.
 * It automatically reports errors to configured providers and allows user feedback collection.
 */
import React from 'react';
import { ErrorBoundaryProps } from './error-boundary';
/**
 * Enhanced Error Boundary Props
 */
export interface ErrorBoundaryEnhancedProps extends Omit<ErrorBoundaryProps, 'onError' | 'fallback'> {
    /** Whether to show user feedback option */
    enableFeedback?: boolean;
    /** Custom fallback component (receives error, reset, and showFeedback props) */
    fallback?: (error: Error, resetError: () => void, showFeedback: () => void) => React.ReactNode;
    /** Additional context to include in error reports */
    errorContext?: Record<string, any>;
    /** Error severity level */
    severity?: 'fatal' | 'error' | 'warning';
    /** Callback when error is caught (in addition to automatic reporting) */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
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
export declare function ErrorBoundaryEnhanced({ children, enableFeedback, fallback, errorContext, severity, onError, ...props }: ErrorBoundaryEnhancedProps): import("react/jsx-runtime").JSX.Element;
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
export declare function useErrorBoundaryTrigger(): (error: Error) => void;
//# sourceMappingURL=error-boundary-enhanced.d.ts.map