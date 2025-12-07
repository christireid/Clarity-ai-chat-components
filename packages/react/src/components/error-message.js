'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { AlertCircleIcon, AlertTriangleIcon, RefreshIcon, InfoIcon } from './icons';
import { RetryButton } from './retry-button';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { getMotionSafeDuration, getMotionSafeValue } from '../animations/motion-safe';
/**
 * Default error details for common error types
 */
const DEFAULT_ERROR_DETAILS = {
    network: {
        title: 'Connection Lost',
        message: 'Unable to connect to the server. Please check your internet connection.',
        severity: 'error',
        suggestions: [
            'Check your internet connection',
            'Disable VPN or proxy if enabled',
            'Try refreshing the page',
        ],
        canRetry: true,
    },
    ratelimit: {
        title: 'Too Many Requests',
        message: 'You\'ve sent too many requests. Please wait a moment before trying again.',
        severity: 'warning',
        suggestions: [
            'Wait a few seconds before retrying',
            'Reduce request frequency',
        ],
        canRetry: true,
        retryButtonText: 'Wait and Retry',
    },
    server: {
        title: 'Server Error',
        message: 'The server encountered an error. This is temporary and will be resolved shortly.',
        severity: 'error',
        suggestions: [
            'Wait a moment and try again',
            'Check our status page for updates',
            'Contact support if issue persists',
        ],
        canRetry: true,
    },
    auth: {
        title: 'Authentication Failed',
        message: 'Your session has expired or authentication failed.',
        severity: 'error',
        suggestions: [
            'Sign in again',
            'Clear browser cookies and cache',
            'Check your account status',
        ],
        canRetry: false,
    },
    unknown: {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred.',
        severity: 'error',
        suggestions: [
            'Try again',
            'Refresh the page',
            'Contact support if issue persists',
        ],
        canRetry: true,
    },
};
/**
 * Parse error into ErrorDetails
 */
function parseError(error) {
    if (typeof error === 'string') {
        return {
            type: 'unknown',
            title: 'Error',
            message: error,
            severity: 'error',
            canRetry: true,
        };
    }
    // Merge with defaults for the error type
    const defaults = DEFAULT_ERROR_DETAILS[error.type];
    return {
        ...defaults,
        ...error,
    };
}
/**
 * Enhanced Error Message Component
 *
 * Displays user-friendly error messages with:
 * - Clear error explanations
 * - Suggested resolution actions
 * - Retry functionality with exponential backoff
 * - Technical details toggle (optional)
 * - Smooth animations
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <ErrorMessage
 *   error={{
 *     type: 'network',
 *     title: 'Connection Lost',
 *     message: 'Unable to send message',
 *   }}
 *   onRetry={() => retrySendMessage()}
 * />
 *
 * // Compact mode
 * <ErrorMessage
 *   error="Failed to load data"
 *   onRetry={fetchData}
 *   compact
 * />
 * ```
 */
export function ErrorMessage({ error, onRetry, onDismiss, showTechnicalDetails = false, maxRetryAttempts = 3, className, compact = false, }) {
    const prefersReducedMotion = useReducedMotion();
    const errorDetails = parseError(error);
    const [showDetails, setShowDetails] = React.useState(false);
    const severityConfig = {
        error: {
            icon: AlertCircleIcon,
            iconColor: 'text-destructive',
            bgColor: 'bg-destructive/10',
            borderColor: 'border-destructive/30',
        },
        warning: {
            icon: AlertTriangleIcon,
            iconColor: 'text-warning',
            bgColor: 'bg-warning/10',
            borderColor: 'border-warning/30',
        },
        info: {
            icon: InfoIcon,
            iconColor: 'text-info',
            bgColor: 'bg-info/10',
            borderColor: 'border-info/30',
        },
    };
    const config = severityConfig[errorDetails.severity || 'error'];
    const IconComponent = config.icon;
    if (compact) {
        return (_jsxs(motion.div, { initial: { opacity: 0, y: getMotionSafeValue(prefersReducedMotion, -10, 0) }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: getMotionSafeDuration(prefersReducedMotion, 0.2) }, className: cn('flex items-center gap-2.5 p-2.5 rounded-lg border shadow-sm', config.bgColor, config.borderColor, className), children: [_jsx(IconComponent, { size: 16, className: cn(config.iconColor, 'shrink-0') }), _jsx("span", { className: "text-sm text-foreground/90 flex-1", children: errorDetails.message }), errorDetails.canRetry && onRetry && (_jsx("button", { onClick: onRetry, className: "p-1.5 rounded-lg hover:bg-accent/50 transition-colors", "aria-label": "Retry", children: _jsx(RefreshIcon, { size: 14 }) }))] }));
    }
    return (_jsxs(motion.div, { initial: { opacity: 0, y: getMotionSafeValue(prefersReducedMotion, 10, 0), scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, transition: { duration: getMotionSafeDuration(prefersReducedMotion, 0.3) }, className: cn('relative p-4 rounded-lg border shadow-sm space-y-4', config.bgColor, config.borderColor, className), role: "alert", "aria-live": "assertive", children: [_jsxs("div", { className: "flex items-start gap-3.5", children: [_jsx(motion.div, { initial: { scale: 0, rotate: -90 }, animate: { scale: 1, rotate: 0 }, transition: {
                            duration: getMotionSafeDuration(prefersReducedMotion, 0.4),
                            type: 'spring',
                            stiffness: 300,
                            damping: 20,
                        }, children: _jsx(IconComponent, { size: 24, className: config.iconColor }) }), _jsxs("div", { className: "flex-1 space-y-1.5", children: [_jsx("h4", { className: "font-bold text-foreground", children: errorDetails.title }), _jsx("p", { className: "text-sm text-muted-foreground/90", children: errorDetails.message })] }), onDismiss && (_jsx("button", { onClick: onDismiss, className: "p-1.5 rounded-lg hover:bg-accent/50 transition-colors", "aria-label": "Dismiss", children: _jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }), errorDetails.suggestions && errorDetails.suggestions.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, transition: { delay: getMotionSafeDuration(prefersReducedMotion, 0.1) }, className: "space-y-2.5", children: [_jsx("p", { className: "text-xs font-semibold text-foreground/90 uppercase tracking-wide", children: "Suggested Actions" }), _jsx("ul", { className: "space-y-2", children: errorDetails.suggestions.map((suggestion, index) => (_jsxs(motion.li, { initial: { opacity: 0, x: getMotionSafeValue(prefersReducedMotion, -10, 0) }, animate: { opacity: 1, x: 0 }, transition: {
                                delay: getMotionSafeDuration(prefersReducedMotion, 0.1 + index * 0.05),
                                duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
                            }, className: "flex items-start gap-2.5 text-sm text-foreground/90", children: [_jsx("span", { className: "text-primary mt-0.5", children: "\u2022" }), _jsx("span", { children: suggestion })] }, index))) })] })), showTechnicalDetails && errorDetails.technicalDetails && (_jsxs("div", { className: "space-y-2.5", children: [_jsxs("button", { onClick: () => setShowDetails(!showDetails), className: "flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/90 hover:text-foreground transition-colors", children: [_jsx(motion.svg, { className: "w-3 h-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", animate: { rotate: showDetails ? 90 : 0 }, transition: { duration: 0.2 }, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) }), "Technical Details"] }), _jsx(AnimatePresence, { children: showDetails && (_jsx(motion.pre, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "text-xs bg-muted/50 rounded p-3 overflow-x-auto font-mono", children: errorDetails.technicalDetails })) })] })), errorDetails.canRetry && onRetry && (_jsx(motion.div, { initial: { opacity: 0, y: getMotionSafeValue(prefersReducedMotion, 10, 0) }, animate: { opacity: 1, y: 0 }, transition: { delay: getMotionSafeDuration(prefersReducedMotion, 0.2) }, children: _jsx(RetryButton, { onRetry: onRetry, errorType: errorDetails.type, maxAttempts: maxRetryAttempts, buttonText: errorDetails.retryButtonText, size: "sm" }) }))] }));
}
ErrorMessage.displayName = 'ErrorMessage';
//# sourceMappingURL=error-message.js.map