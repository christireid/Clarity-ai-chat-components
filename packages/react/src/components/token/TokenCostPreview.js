/**
 * TokenCostPreview - Real-time Token Cost Estimation Component
 *
 * Displays live cost estimates as users type, providing transparency
 * into API costs before messages are sent.
 *
 * @example
 * ```tsx
 * <TokenCostPreview
 *   text={inputValue}
 *   model="gpt-4"
 *   showTokenCount
 *   onCostChange={(cost) => console.log(`Est. cost: $${cost.toFixed(4)}`)}
 * />
 * ```
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { estimateTokens } from '../../utils/tokenization/estimator';
import { calculateCost } from '../../utils/tokenization/model-pricing';
/**
 * Hook for real-time token estimation with throttling
 *
 * @example
 * ```tsx
 * const { tokens, inputCost, isStale } = useTokenEstimate({
 *   text: inputValue,
 *   model: 'gpt-4',
 *   throttleMs: 150,
 * })
 * ```
 */
export function useTokenEstimate(options) {
    const { text, model = 'gpt-4', throttleMs = 100 } = options;
    const [estimate, setEstimate] = React.useState({
        tokens: 0,
        inputCost: 0,
        model,
        isStale: false,
        isLoading: true,
        error: null,
    });
    // Refs for throttling
    const lastUpdateRef = React.useRef(0);
    const pendingRef = React.useRef(null);
    const latestTextRef = React.useRef(text);
    const hasCalculatedRef = React.useRef(false);
    // Keep latest text in ref
    latestTextRef.current = text;
    // Calculate estimate
    const calculateEstimate = React.useCallback(() => {
        try {
            const tokens = estimateTokens(latestTextRef.current, model);
            let inputCost = 0;
            try {
                const cost = calculateCost({
                    model,
                    inputTokens: tokens,
                    outputTokens: 0,
                });
                inputCost = cost.inputCost;
            }
            catch {
                // Model not in pricing database, estimate with GPT-4 pricing
                // $0.03 per 1K input tokens for GPT-4
                inputCost = (tokens / 1000) * 0.03;
            }
            hasCalculatedRef.current = true;
            setEstimate({
                tokens,
                inputCost,
                model,
                isStale: false,
                isLoading: false,
                error: null,
            });
        }
        catch (err) {
            // Handle unexpected errors in estimation
            hasCalculatedRef.current = true;
            setEstimate((prev) => ({
                ...prev,
                isStale: false,
                isLoading: false,
                error: err instanceof Error ? err : new Error('Token estimation failed'),
            }));
        }
    }, [model]);
    // Throttled update effect
    React.useEffect(() => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateRef.current;
        // Clear any pending update
        if (pendingRef.current) {
            clearTimeout(pendingRef.current);
        }
        if (timeSinceLastUpdate >= throttleMs) {
            // Immediate update
            lastUpdateRef.current = now;
            calculateEstimate();
        }
        else {
            // Mark as stale and schedule update
            setEstimate((prev) => ({ ...prev, isStale: true }));
            pendingRef.current = setTimeout(() => {
                lastUpdateRef.current = Date.now();
                calculateEstimate();
            }, throttleMs - timeSinceLastUpdate);
        }
        return () => {
            if (pendingRef.current) {
                clearTimeout(pendingRef.current);
            }
        };
    }, [text, throttleMs, calculateEstimate]);
    return estimate;
}
/**
 * Default cost formatter - shows significant digits
 */
function defaultFormatCost(cost) {
    if (cost < 0.0001)
        return '$0.00';
    if (cost < 0.01)
        return `$${cost.toFixed(4)}`;
    if (cost < 1)
        return `$${cost.toFixed(3)}`;
    return `$${cost.toFixed(2)}`;
}
/**
 * Default token formatter with compact notation
 */
function defaultFormatTokens(tokens) {
    if (tokens < 1000)
        return `${tokens}`;
    if (tokens < 10000)
        return `${(tokens / 1000).toFixed(1)}K`;
    return `${Math.round(tokens / 1000)}K`;
}
/**
 * Real-time token cost preview component
 *
 * Displays live estimates of token count and API cost as users type.
 * Useful for giving users transparency into costs before sending messages.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TokenCostPreview text={inputValue} model="gpt-4" />
 *
 * // With callback
 * <TokenCostPreview
 *   text={inputValue}
 *   model="claude-3-5-sonnet"
 *   onCostChange={(cost, tokens) => {
 *     if (cost > 0.10) {
 *       showWarning('This message will cost more than $0.10')
 *     }
 *   }}
 * />
 *
 * // Custom formatting
 * <TokenCostPreview
 *   text={inputValue}
 *   formatCost={(cost) => `~$${cost.toFixed(2)} USD`}
 *   formatTokens={(tokens) => `${tokens} tokens`}
 * />
 * ```
 */
/**
 * Hook to detect prefers-reduced-motion
 */
function useReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
    React.useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (event) => {
            setPrefersReducedMotion(event.matches);
        };
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);
    return prefersReducedMotion;
}
export function TokenCostPreview({ text, model = 'gpt-4', showTokenCount = true, showCost = true, minDisplayCost = 0.0001, className, onCostChange, onError, formatCost = defaultFormatCost, formatTokens = defaultFormatTokens, throttleMs = 100, ariaLabel, id, showLoading = false, loadingText = 'Calculating...', showError = true, renderError, }) {
    const { tokens, inputCost, isStale, isLoading, error } = useTokenEstimate({
        text,
        model,
        throttleMs,
    });
    const prefersReducedMotion = useReducedMotion();
    // Notify on cost changes
    React.useEffect(() => {
        onCostChange?.(inputCost, tokens);
    }, [inputCost, tokens, onCostChange]);
    // Notify on errors
    React.useEffect(() => {
        if (error) {
            onError?.(error);
        }
    }, [error, onError]);
    // Don't render if nothing to show
    if (!showTokenCount && !showCost)
        return null;
    if (!isLoading && !error && tokens === 0 && inputCost < minDisplayCost)
        return null;
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        color: 'var(--clarity-text-muted, #6b7280)',
        opacity: isStale ? 0.7 : 1,
        // Respect prefers-reduced-motion
        transition: prefersReducedMotion ? 'none' : 'opacity 0.15s ease',
    };
    const errorStyles = {
        ...baseStyles,
        color: 'var(--clarity-text-error, #dc2626)',
    };
    // Handle error state
    if (error && showError) {
        const errorContent = renderError ? (renderError(error)) : (_jsx("span", { "data-testid": "error-message", children: "Unable to estimate" }));
        return (_jsx("span", { id: id, className: className, style: className ? undefined : errorStyles, role: "alert", "aria-live": "assertive", children: errorContent }));
    }
    // Handle loading state
    if (isLoading && showLoading && text.length > 0) {
        return (_jsxs("span", { id: id, className: className, style: className ? undefined : baseStyles, role: "status", "aria-live": "polite", "aria-busy": "true", children: [_jsx("span", { "data-testid": "loading-indicator", "aria-hidden": "true", children: loadingText }), _jsx("span", { style: {
                        position: 'absolute',
                        width: '1px',
                        height: '1px',
                        padding: 0,
                        margin: '-1px',
                        overflow: 'hidden',
                        clip: 'rect(0, 0, 0, 0)',
                        whiteSpace: 'nowrap',
                        border: 0,
                    }, children: "Calculating token estimate" })] }));
    }
    // Build accessible announcement text for screen readers
    const announcementParts = [];
    if (showTokenCount) {
        announcementParts.push(`${tokens} tokens`);
    }
    if (showCost && inputCost >= minDisplayCost) {
        announcementParts.push(`estimated cost ${formatCost(inputCost)}`);
    }
    const announcementText = announcementParts.join(', ');
    // Default aria-label if not provided
    const computedAriaLabel = ariaLabel ?? `Token and cost estimate: ${announcementText}`;
    return (_jsxs("span", { id: id, className: className, style: className ? undefined : baseStyles, role: "status", "aria-live": "polite", "aria-atomic": "true", "aria-label": computedAriaLabel, children: [showTokenCount && (_jsxs("span", { "data-testid": "token-count", "aria-hidden": "true", children: [formatTokens(tokens), " tokens"] })), showTokenCount && showCost && inputCost >= minDisplayCost && (_jsx("span", { "aria-hidden": "true", children: "\u2022" })), showCost && inputCost >= minDisplayCost && (_jsxs("span", { "data-testid": "cost-estimate", "aria-hidden": "true", children: [formatCost(inputCost), " est."] })), _jsxs("span", { style: {
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: 0,
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                }, children: [announcementText, isStale && ', updating...'] })] }));
}
//# sourceMappingURL=TokenCostPreview.js.map