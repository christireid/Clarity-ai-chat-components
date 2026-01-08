import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Error Boundary Component for Example Applications
 *
 * Catches JavaScript errors in child components and displays
 * a fallback UI instead of crashing the entire app.
 *
 * @module error-boundary
 */
import * as React from 'react';
// =============================================================================
// 💡 Error Boundary Component
// =============================================================================
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
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsxs("div", { role: "alert", className: "p-6 border border-destructive/20 bg-destructive/5 rounded-lg", children: [_jsx("h2", { className: "text-lg font-semibold text-destructive mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: this.state.error?.message || 'An unexpected error occurred' }), this.props.showReset !== false && (_jsx("button", { onClick: this.handleReset, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary", children: "Try again" })), process.env.NODE_ENV === 'development' && this.state.error && (_jsx("pre", { className: "mt-4 p-4 bg-muted rounded text-xs overflow-auto max-h-40", children: this.state.error.stack }))] }));
        }
        return this.props.children;
    }
}
/**
 * Animated loading spinner component.
 *
 * @example
 * ```tsx
 * {isLoading ? <LoadingSpinner label="Loading messages..." /> : <Messages />}
 * ```
 */
export function LoadingSpinner({ size = 'md', label = 'Loading...', }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };
    return (_jsxs("div", { role: "status", "aria-label": label, className: "flex items-center gap-2", children: [_jsx("div", { className: `${sizeClasses[size]} border-primary/30 border-t-primary rounded-full animate-spin` }), _jsx("span", { className: "sr-only", children: label })] }));
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
export function Skeleton({ width = '100%', height = '1rem', rounded = true, className = '', }) {
    return (_jsx("div", { role: "presentation", "aria-hidden": "true", className: `bg-muted animate-pulse ${rounded ? 'rounded' : ''} ${className}`, style: { width, height } }));
}
/**
 * Skeleton for chat messages.
 *
 * @example
 * ```tsx
 * {isLoading ? <MessageSkeleton count={3} /> : <MessageList messages={messages} />}
 * ```
 */
export function MessageSkeleton({ count = 3, }) {
    return (_jsxs("div", { className: "space-y-4", role: "status", "aria-label": "Loading messages", children: [Array.from({ length: count }).map((_, i) => (_jsxs("div", { className: `p-4 rounded-lg ${i % 2 === 0 ? 'ml-12' : 'mr-12'}`, children: [_jsx(Skeleton, { width: "60%", height: "16px", className: "mb-2" }), _jsx(Skeleton, { width: "100%", height: "16px", className: "mb-2" }), _jsx(Skeleton, { width: "40%", height: "16px" })] }, i))), _jsx("span", { className: "sr-only", children: "Loading messages..." })] }));
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
export function EmptyState({ title, description, icon, action, }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [icon && (_jsx("div", { className: "mb-4 text-muted-foreground", "aria-hidden": "true", children: icon })), _jsx("h3", { className: "text-lg font-semibold mb-2", children: title }), description && (_jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: description })), action && (_jsx("button", { onClick: action.onClick, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary", children: action.label }))] }));
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
export function ErrorState({ title = 'Error', message, onRetry, }) {
    return (_jsxs("div", { role: "alert", className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [_jsx("div", { className: "mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center", "aria-hidden": "true", children: _jsx("span", { className: "text-2xl", children: "\u26A0\uFE0F" }) }), _jsx("h3", { className: "text-lg font-semibold text-destructive mb-2", children: title }), _jsx("p", { className: "text-sm text-muted-foreground mb-4 max-w-sm", children: message }), onRetry && (_jsx("button", { onClick: onRetry, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary", children: "Try again" }))] }));
}
//# sourceMappingURL=error-boundary.js.map