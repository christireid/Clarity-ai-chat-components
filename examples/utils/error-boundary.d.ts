/**
 * Error Boundary Component for Example Applications
 *
 * Catches JavaScript errors in child components and displays
 * a fallback UI instead of crashing the entire app.
 *
 * @module error-boundary
 */
import * as React from 'react';
interface ErrorBoundaryProps {
    /** Child components to render */
    children: React.ReactNode;
    /** Custom fallback UI to show on error */
    fallback?: React.ReactNode;
    /** Callback when error is caught */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    /** Whether to show a reset button */
    showReset?: boolean;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
/**
 * Error boundary that catches errors in child components.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ErrorBoundary
 *       fallback={<ErrorFallback />}
 *       onError={(error) => logError(error)}
 *     >
 *       <ChatComponent />
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    handleReset: () => void;
    render(): React.ReactNode;
}
interface LoadingSpinnerProps {
    /** Size of the spinner */
    size?: 'sm' | 'md' | 'lg';
    /** Accessible label for screen readers */
    label?: string;
}
/**
 * Animated loading spinner component.
 *
 * @example
 * ```tsx
 * {isLoading ? <LoadingSpinner label="Loading messages..." /> : <Messages />}
 * ```
 */
export declare function LoadingSpinner({ size, label, }: LoadingSpinnerProps): React.ReactElement;
interface SkeletonProps {
    /** Width of the skeleton */
    width?: string;
    /** Height of the skeleton */
    height?: string;
    /** Whether to show rounded corners */
    rounded?: boolean;
    /** Additional CSS classes */
    className?: string;
}
/**
 * Skeleton loading placeholder.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <div className="space-y-2">
 *     <Skeleton width="100%" height="20px" />
 *     <Skeleton width="75%" height="20px" />
 *   </div>
 * ) : (
 *   <Content />
 * )}
 * ```
 */
export declare function Skeleton({ width, height, rounded, className, }: SkeletonProps): React.ReactElement;
interface MessageSkeletonProps {
    /** Number of skeleton messages to show */
    count?: number;
}
/**
 * Skeleton for chat messages.
 *
 * @example
 * ```tsx
 * {isLoading ? <MessageSkeleton count={3} /> : <MessageList messages={messages} />}
 * ```
 */
export declare function MessageSkeleton({ count, }: MessageSkeletonProps): React.ReactElement;
interface EmptyStateProps {
    /** Title of the empty state */
    title: string;
    /** Description text */
    description?: string;
    /** Icon to display */
    icon?: React.ReactNode;
    /** Action button */
    action?: {
        label: string;
        onClick: () => void;
    };
}
/**
 * Empty state component for when there's no content.
 *
 * @example
 * ```tsx
 * {messages.length === 0 ? (
 *   <EmptyState
 *     title="No messages yet"
 *     description="Start a conversation to see messages here"
 *     action={{ label: "Start chat", onClick: startChat }}
 *   />
 * ) : (
 *   <MessageList messages={messages} />
 * )}
 * ```
 */
export declare function EmptyState({ title, description, icon, action, }: EmptyStateProps): React.ReactElement;
interface ErrorStateProps {
    /** Error title */
    title?: string;
    /** Error message */
    message: string;
    /** Retry action */
    onRetry?: () => void;
}
/**
 * Error state component for displaying errors.
 *
 * @example
 * ```tsx
 * {error ? (
 *   <ErrorState
 *     message={error.message}
 *     onRetry={() => refetch()}
 *   />
 * ) : (
 *   <Content />
 * )}
 * ```
 */
export declare function ErrorState({ title, message, onRetry, }: ErrorStateProps): React.ReactElement;
export {};
//# sourceMappingURL=error-boundary.d.ts.map