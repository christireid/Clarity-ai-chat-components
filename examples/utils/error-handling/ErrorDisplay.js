'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ErrorDisplay Component
 *
 * A reusable error display component for chat applications.
 * Shows user-friendly error messages with appropriate styling and retry options.
 */
import { useState, useEffect } from 'react';
import { formatErrorForUser, shouldShowRetryButton, getErrorColor, } from './index';
// ============================================================================
// Icons
// ============================================================================
function InfoIcon() {
    return (_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
}
function WarningIcon() {
    return (_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }));
}
function ErrorIcon() {
    return (_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
}
function CriticalIcon() {
    return (_jsx("svg", { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }));
}
function getIcon(severity) {
    switch (severity) {
        case 'info':
            return _jsx(InfoIcon, {});
        case 'warning':
            return _jsx(WarningIcon, {});
        case 'error':
            return _jsx(ErrorIcon, {});
        case 'critical':
            return _jsx(CriticalIcon, {});
        default:
            return _jsx(ErrorIcon, {});
    }
}
// ============================================================================
// Component
// ============================================================================
export function ErrorDisplay({ error, onRetry, onDismiss, className = '', showDetails = false, autoDismiss = false, autoDismissDelay = 5000, }) {
    const [dismissed, setDismissed] = useState(false);
    // Auto-dismiss effect
    useEffect(() => {
        if (autoDismiss && error) {
            const timer = setTimeout(() => {
                setDismissed(true);
                onDismiss?.();
            }, autoDismissDelay);
            return () => clearTimeout(timer);
        }
    }, [autoDismiss, autoDismissDelay, error, onDismiss]);
    // Reset dismissed state when error changes
    useEffect(() => {
        setDismissed(false);
    }, [error]);
    if (!error || dismissed)
        return null;
    // Convert to ChatError if needed
    let chatError;
    if (typeof error === 'string') {
        chatError = {
            code: 'UNKNOWN_ERROR',
            message: error,
            severity: 'error',
            timestamp: Date.now(),
            recoverable: true,
            retryable: true,
        };
    }
    else if (error instanceof Error) {
        chatError = {
            code: 'UNKNOWN_ERROR',
            message: error.message,
            severity: 'error',
            timestamp: Date.now(),
            recoverable: true,
            retryable: true,
        };
    }
    else {
        chatError = error;
    }
    const colorClasses = getErrorColor(chatError.severity);
    const message = formatErrorForUser(chatError);
    const showRetry = onRetry && shouldShowRetryButton(chatError);
    return (_jsxs("div", { className: `flex items-start gap-3 p-4 rounded-lg border ${colorClasses} ${className}`, role: "alert", "aria-live": "assertive", children: [_jsx("div", { className: "flex-shrink-0", children: getIcon(chatError.severity) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium", children: message }), showDetails && chatError.details && (_jsxs("details", { className: "mt-2 text-xs opacity-75", children: [_jsx("summary", { className: "cursor-pointer", children: "Technical details" }), _jsx("pre", { className: "mt-1 p-2 bg-white/50 rounded overflow-auto", children: JSON.stringify(chatError.details, null, 2) })] })), (showRetry || onDismiss) && (_jsxs("div", { className: "flex gap-2 mt-3", children: [showRetry && (_jsx("button", { onClick: onRetry, className: "px-3 py-1 text-sm font-medium bg-white/50 hover:bg-white/80 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1", children: "Try again" })), onDismiss && (_jsx("button", { onClick: () => {
                                    setDismissed(true);
                                    onDismiss();
                                }, className: "px-3 py-1 text-sm opacity-75 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1", children: "Dismiss" }))] }))] })] }));
}
export default ErrorDisplay;
//# sourceMappingURL=ErrorDisplay.js.map