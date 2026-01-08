/**
 * Error Boundary Component
 * Catches JavaScript errors in child component trees
 * and displays a graceful fallback UI
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { AlertTriangleIcon } from './icons';
/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error(`[ErrorBoundary${this.props.componentName ? `: ${this.props.componentName}` : ''}]`, error, errorInfo);
        }
    }
    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };
    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }
            // Default fallback UI
            return (_jsx(ErrorFallback, { error: this.state.error, errorInfo: this.state.errorInfo, componentName: this.props.componentName, showDetails: this.props.showDetails, onRetry: this.handleRetry }));
        }
        return this.props.children;
    }
}
function ErrorFallback({ error, errorInfo, componentName, showDetails = process.env.NODE_ENV === 'development', onRetry, }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    return (_jsx("div", { className: "error-boundary-fallback", role: "alert", children: _jsxs("div", { className: "error-boundary-content", children: [_jsx("div", { className: "error-boundary-icon", "aria-hidden": "true", children: _jsx(AlertTriangleIcon, { size: "xl" }) }), _jsx("h3", { className: "error-boundary-title", children: componentName ? `${componentName} Error` : 'Something went wrong' }), _jsx("p", { className: "error-boundary-message", children: error?.message || 'An unexpected error occurred' }), _jsxs("div", { className: "error-boundary-actions", children: [_jsx("button", { className: "dt-btn dt-btn-primary", onClick: onRetry, "aria-label": "Retry loading component", children: "Try Again" }), showDetails && error && (_jsx("button", { className: "dt-btn dt-btn-ghost", onClick: () => setIsExpanded(!isExpanded), "aria-expanded": isExpanded, children: isExpanded ? 'Hide Details' : 'Show Details' }))] }), showDetails && isExpanded && (_jsxs("details", { className: "error-boundary-details", open: true, children: [_jsx("summary", { className: "sr-only", children: "Error details" }), _jsxs("div", { className: "error-details-content", children: [_jsxs("div", { className: "error-section", children: [_jsx("h4", { children: "Error Message" }), _jsx("pre", { className: "code-block", children: _jsx("code", { children: error?.message }) })] }), error?.stack && (_jsxs("div", { className: "error-section", children: [_jsx("h4", { children: "Stack Trace" }), _jsx("pre", { className: "code-block", children: _jsx("code", { children: error.stack }) })] })), errorInfo?.componentStack && (_jsxs("div", { className: "error-section", children: [_jsx("h4", { children: "Component Stack" }), _jsx("pre", { className: "code-block", children: _jsx("code", { children: errorInfo.componentStack }) })] }))] })] }))] }) }));
}
/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary(Component, options) {
    const WrappedComponent = (props) => (_jsx(ErrorBoundary, { ...options, children: _jsx(Component, { ...props }) }));
    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;
    return WrappedComponent;
}
export function PanelErrorBoundary({ children, panelName, onError, }) {
    return (_jsx(ErrorBoundary, { componentName: panelName, onError: onError, fallback: _jsx("div", { className: "panel-error-fallback", role: "alert", children: _jsxs("div", { className: "panel-error-content", children: [_jsx(AlertTriangleIcon, { size: "lg" }), _jsxs("div", { className: "panel-error-text", children: [_jsxs("h4", { children: [panelName, " encountered an error"] }), _jsx("p", { children: "Please try refreshing the panel or contact support if the issue persists." })] })] }) }), children: children }));
}
export default ErrorBoundary;
//# sourceMappingURL=error-boundary.js.map