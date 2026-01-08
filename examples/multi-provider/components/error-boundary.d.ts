/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays a fallback UI.
 * Also provides retry functionality.
 */
import { Component, ReactNode } from 'react';
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    handleRetry: () => void;
    render(): ReactNode;
}
/**
 * Inline Error Display Component
 * For displaying errors within the chat interface without breaking the entire UI
 */
export declare function InlineError({ message, onRetry, onDismiss, }: {
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}): import("react").JSX.Element;
/**
 * Hook for retry logic with exponential backoff
 */
export declare function useRetry(maxRetries?: number, baseDelay?: number): {
    retryWithBackoff: <T>(fn: () => Promise<T>, onRetry?: (attempt: number, error: Error) => void) => Promise<T>;
};
export default ErrorBoundary;
//# sourceMappingURL=error-boundary.d.ts.map