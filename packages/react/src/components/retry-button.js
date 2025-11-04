import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Button, cn } from '@clarity-chat/primitives';
/**
 * Error messages for different error types
 */
const ERROR_MESSAGES = {
    network: 'Connection lost. Check your internet and try again.',
    ratelimit: 'Too many requests. Please wait a moment before retrying.',
    server: 'Server error. Please try again in a moment.',
    auth: 'Authentication failed. Please sign in again.',
    unknown: 'Something went wrong. Please try again.',
};
/**
 * Production-ready Retry Button component with exponential backoff.
 *
 * **Features:**
 * - Exponential backoff with configurable delays
 * - Type-specific error messages (network, rate limit, server, auth)
 * - Visual feedback during retry countdown
 * - Attempt tracking and max attempts enforcement
 * - Success/failure callbacks for analytics
 * - Accessible (keyboard navigation, ARIA attributes)
 * - Loading states during retry operation
 *
 * **Use Cases:**
 * - Retry failed API requests
 * - Reconnect after network errors
 * - Handle rate limit errors gracefully
 * - Provide user-friendly error recovery
 *
 * @example
 * ```tsx
 * // Basic network error retry
 * <RetryButton
 *   onRetry={handleRetry}
 *   errorType="network"
 *   maxAttempts={3}
 * />
 *
 * // Custom backoff delays
 * <RetryButton
 *   onRetry={async () => {
 *     await sendMessage()
 *   }}
 *   backoffMs={[2000, 5000, 15000]} // 2s, 5s, 15s
 *   errorType="ratelimit"
 * />
 *
 * // With analytics tracking
 * <RetryButton
 *   onRetry={handleRetry}
 *   onRetryStart={(attempt) => {
 *     analytics.track('retry_started', { attempt })
 *   }}
 *   onRetrySuccess={(attempt) => {
 *     analytics.track('retry_succeeded', { attempt })
 *   }}
 *   onRetryFail={(attempt, error) => {
 *     analytics.track('retry_failed', { attempt, error: error.message })
 *   }}
 *   onMaxAttemptsReached={() => {
 *     analytics.track('max_retries_reached')
 *     showSupportDialog()
 *   }}
 * />
 *
 * // Small ghost variant
 * <RetryButton
 *   onRetry={handleRetry}
 *   size="sm"
 *   variant="ghost"
 *   buttonText="Try Again"
 * />
 * ```
 */
export function RetryButton({ onRetry, maxAttempts = 3, backoffMs = [1000, 3000, 10000], errorType = 'unknown', attemptNumber, disabled = false, buttonText, showAttemptsRemaining = true, onMaxAttemptsReached, onRetryStart, onRetrySuccess, onRetryFail, className = '', size = 'md', variant = 'default', }) {
    const [currentAttempt, setCurrentAttempt] = React.useState(attemptNumber ?? 0);
    const [isRetrying, setIsRetrying] = React.useState(false);
    const [countdown, setCountdown] = React.useState(null);
    const countdownIntervalRef = React.useRef(null);
    // Sync external attempt number
    React.useEffect(() => {
        if (attemptNumber !== undefined) {
            setCurrentAttempt(attemptNumber);
        }
    }, [attemptNumber]);
    const attemptsRemaining = maxAttempts - currentAttempt;
    const canRetry = attemptsRemaining > 0 && !isRetrying && !disabled;
    /**
     * Get delay for current attempt
     */
    const getDelay = (attempt) => {
        const index = Math.min(attempt, backoffMs.length - 1);
        return backoffMs[index];
    };
    /**
     * Start countdown timer
     */
    const startCountdown = (delayMs) => {
        let remaining = delayMs / 1000;
        setCountdown(remaining);
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }
        countdownIntervalRef.current = setInterval(() => {
            remaining -= 0.1;
            setCountdown(remaining);
            if (remaining <= 0) {
                if (countdownIntervalRef.current) {
                    clearInterval(countdownIntervalRef.current);
                    countdownIntervalRef.current = null;
                }
                setCountdown(null);
            }
        }, 100);
    };
    /**
     * Handle retry click
     */
    const handleRetry = async () => {
        if (!canRetry)
            return;
        const nextAttempt = currentAttempt + 1;
        // Check max attempts
        if (nextAttempt > maxAttempts) {
            onMaxAttemptsReached?.();
            return;
        }
        setIsRetrying(true);
        setCurrentAttempt(nextAttempt);
        onRetryStart?.(nextAttempt);
        // Get delay for this attempt
        const delay = getDelay(currentAttempt);
        // Show countdown if delay > 500ms
        if (delay > 500) {
            startCountdown(delay);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
        try {
            await onRetry();
            onRetrySuccess?.(nextAttempt);
            // Reset on success
            setCurrentAttempt(0);
        }
        catch (error) {
            console.error('[RetryButton] Retry failed:', error);
            onRetryFail?.(nextAttempt, error);
        }
        finally {
            setIsRetrying(false);
            setCountdown(null);
        }
    };
    /**
     * Cleanup on unmount
     */
    React.useEffect(() => {
        return () => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
        };
    }, []);
    const sizeMap = {
        sm: 'sm',
        md: 'default',
        lg: 'lg',
    };
    const variantMap = {
        default: 'destructive',
        ghost: 'ghost',
        outline: 'outline',
    };
    return (_jsxs("div", { className: "flex flex-col items-start gap-3", children: [_jsxs(Button, { onClick: handleRetry, disabled: !canRetry, variant: variantMap[variant], size: sizeMap[size], loading: isRetrying, className: cn('gap-2', className), "aria-label": `Retry (${attemptsRemaining} attempts remaining)`, children: [!isRetrying && (_jsx("svg", { className: "w-5 h-5 transition-transform duration-200 group-hover:rotate-180", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) })), _jsxs("span", { children: [buttonText || (isRetrying ? 'Retrying...' : 'Try Again'), countdown !== null && ` (${countdown.toFixed(1)}s)`] }), showAttemptsRemaining && attemptsRemaining > 0 && (_jsxs("span", { className: "text-xs opacity-75", children: ["(", attemptsRemaining, " left)"] }))] }), _jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1.5", children: [_jsx("svg", { className: "h-3.5 w-3.5 text-warning", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), ERROR_MESSAGES[errorType]] }), attemptsRemaining === 0 && (_jsxs(motion.p, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, className: "text-sm text-destructive flex items-center gap-1.5 animate-[shake-x_0.4s_ease-in-out]", children: [_jsx("svg", { className: "h-4 w-4 shrink-0", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "Maximum retry attempts reached. Please refresh the page or contact support."] }))] }));
}
//# sourceMappingURL=retry-button.js.map