import React, { ReactNode } from 'react';
/**
 * Error boundary props
 */
export interface ErrorBoundaryProps {
    /** Child components to render */
    children: ReactNode;
    /** Custom fallback UI when error occurs */
    fallback?: (props: {
        error: Error;
        resetError: () => void;
    }) => ReactNode;
    /** Callback when an error is caught */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    /** Callback when error boundary is reset */
    onReset?: () => void;
}
/**
 * Error Boundary component - catches errors in child components
 *
 * Modern functional wrapper around required class component
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={({ error, resetError }) => (
 *     <div>
 *       <h1>Error: {error.message}</h1>
 *       <button onClick={resetError}>Try Again</button>
 *     </div>
 *   )}
 *   onError={(error, errorInfo) => {
 *     // Log to error tracking service
 *     logErrorToService(error, errorInfo)
 *   }}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export declare function ErrorBoundary(props: ErrorBoundaryProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ErrorBoundary.d.ts.map