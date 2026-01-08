'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { usePrefersReducedMotion } from '../hooks/useAccessibility';
// Animation keyframes
const countdownKeyframes = `
  @keyframes retryCountdownPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  @keyframes retryCountdownGlow {
    0%, 100% { filter: drop-shadow(0 0 8px var(--glow-color)); }
    50% { filter: drop-shadow(0 0 16px var(--glow-color)); }
  }
  @keyframes retryCountdownSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes retryCountdownTick {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes retryCountdownFadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
// Color configurations
const colorConfigs = {
    blue: {
        primary: '#3b82f6',
        secondary: '#2563eb',
        bg: 'rgba(59, 130, 246, 0.08)',
        glow: 'rgba(59, 130, 246, 0.4)',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        shadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
    },
    purple: {
        primary: '#8b5cf6',
        secondary: '#7c3aed',
        bg: 'rgba(139, 92, 246, 0.08)',
        glow: 'rgba(139, 92, 246, 0.4)',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        shadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
    },
    emerald: {
        primary: '#10b981',
        secondary: '#059669',
        bg: 'rgba(16, 185, 129, 0.08)',
        glow: 'rgba(16, 185, 129, 0.4)',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        shadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
    },
    amber: {
        primary: '#f59e0b',
        secondary: '#d97706',
        bg: 'rgba(245, 158, 11, 0.08)',
        glow: 'rgba(245, 158, 11, 0.4)',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        shadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
    },
};
const sizeConfigs = {
    sm: {
        container: 64,
        ring: 54,
        stroke: 4,
        font: '1rem',
        iconSize: 14,
        padding: '0.75rem',
    },
    md: {
        container: 88,
        ring: 76,
        stroke: 5,
        font: '1.5rem',
        iconSize: 18,
        padding: '1rem',
    },
    lg: {
        container: 112,
        ring: 98,
        stroke: 6,
        font: '2rem',
        iconSize: 22,
        padding: '1.25rem',
    },
};
/**
 * Beautiful visual countdown timer for retry delays with stunning animations.
 *
 * Shows users when automatic retry will occur with an optional progress ring
 * and smooth animations.
 *
 * @example
 * ```tsx
 * <RetryCountdown
 *   remainingMs={5000}
 *   onComplete={() => triggerRetry()}
 *   onRetryNow={() => immediateRetry()}
 *   colorScheme="purple"
 *   showProgress
 * />
 * ```
 */
export function RetryCountdown({ remainingMs, onComplete, onRetryNow, showProgress = true, size = 'md', variant = 'default', colorScheme = 'blue', message, showRetryButton = true, className, }) {
    const [timeLeft, setTimeLeft] = React.useState(remainingMs);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();
    const intervalRef = React.useRef(undefined);
    const totalTime = React.useRef(remainingMs);
    const colors = colorConfigs[colorScheme];
    const sizes = sizeConfigs[size];
    React.useEffect(() => {
        totalTime.current = remainingMs;
        setTimeLeft(remainingMs);
        setIsComplete(false);
    }, [remainingMs]);
    React.useEffect(() => {
        if (timeLeft <= 0) {
            setIsComplete(true);
            onComplete?.();
            return;
        }
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 100;
                if (newTime <= 0) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return newTime;
            });
        }, 100);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timeLeft, onComplete]);
    const seconds = Math.ceil(timeLeft / 1000);
    const progress = totalTime.current > 0 ? timeLeft / totalTime.current : 0;
    const circumference = 2 * Math.PI * (sizes.ring / 2 - sizes.stroke);
    const strokeDashoffset = circumference * (1 - progress);
    const displayMessage = message || (seconds > 0 ? 'Retrying automatically...' : 'Retrying now...');
    // Inline variant
    if (variant === 'inline') {
        return (_jsxs(_Fragment, { children: [_jsx("style", { children: countdownKeyframes }), _jsxs("span", { className: className, style: {
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        background: colors.bg,
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: colors.primary,
                    }, role: "timer", "aria-live": "polite", "aria-label": `Retrying in ${seconds} seconds`, children: [_jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: colors.primary, strokeWidth: "2", style: {
                                animation: !prefersReducedMotion
                                    ? 'retryCountdownSpin 2s linear infinite'
                                    : 'none',
                            }, children: _jsx("path", { d: "M21 12a9 9 0 11-6.219-8.56" }) }), "Retrying in ", seconds, "s"] })] }));
    }
    // Compact variant
    if (variant === 'compact') {
        return (_jsxs(_Fragment, { children: [_jsx("style", { children: countdownKeyframes }), _jsxs("div", { className: className, style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 1rem',
                        borderRadius: '12px',
                        background: colors.bg,
                        border: `1px solid ${colors.primary}20`,
                        animation: !prefersReducedMotion
                            ? 'retryCountdownFadeIn 0.3s ease-out'
                            : 'none',
                    }, role: "timer", "aria-live": "polite", "aria-label": `Retrying in ${seconds} seconds`, children: [_jsxs("div", { style: {
                                position: 'relative',
                                width: '32px',
                                height: '32px',
                            }, children: [_jsxs("svg", { width: "32", height: "32", viewBox: "0 0 32 32", style: { transform: 'rotate(-90deg)' }, children: [_jsx("circle", { cx: "16", cy: "16", r: "13", fill: "none", stroke: `${colors.primary}20`, strokeWidth: "3" }), _jsx("circle", { cx: "16", cy: "16", r: "13", fill: "none", stroke: colors.primary, strokeWidth: "3", strokeLinecap: "round", strokeDasharray: 81.68, strokeDashoffset: 81.68 * (1 - progress), style: {
                                                transition: prefersReducedMotion
                                                    ? 'none'
                                                    : 'stroke-dashoffset 0.1s linear',
                                            } })] }), _jsx("div", { style: {
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: colors.primary,
                                    }, children: seconds })] }), _jsx("span", { style: {
                                fontSize: '0.8125rem',
                                color: 'var(--error-color-muted, #6b7280)',
                            }, children: displayMessage }), showRetryButton && onRetryNow && seconds > 0 && (_jsx("button", { onClick: onRetryNow, style: {
                                marginLeft: 'auto',
                                padding: '0.25rem 0.5rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: colors.primary,
                                background: 'transparent',
                                border: `1px solid ${colors.primary}`,
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }, onMouseOver: (e) => {
                                e.currentTarget.style.background = colors.bg;
                            }, onMouseOut: (e) => {
                                e.currentTarget.style.background = 'transparent';
                            }, onFocus: (e) => {
                                e.currentTarget.style.outline = `2px solid ${colors.primary}`;
                                e.currentTarget.style.outlineOffset = '2px';
                            }, onBlur: (e) => {
                                e.currentTarget.style.outline = 'none';
                            }, children: "Skip" }))] })] }));
    }
    // Minimal variant
    if (variant === 'minimal') {
        return (_jsxs(_Fragment, { children: [_jsx("style", { children: countdownKeyframes }), _jsxs("div", { className: className, style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }, role: "timer", "aria-live": "polite", "aria-label": `Retrying in ${seconds} seconds`, children: [_jsx("span", { style: {
                                fontSize: '2rem',
                                fontWeight: 700,
                                color: colors.primary,
                                fontVariantNumeric: 'tabular-nums',
                                animation: !prefersReducedMotion && seconds <= 3
                                    ? 'retryCountdownTick 1s ease-in-out'
                                    : 'none',
                            }, children: seconds }), _jsx("span", { style: {
                                fontSize: '0.8125rem',
                                color: 'var(--error-color-muted, #9ca3af)',
                            }, children: "seconds" })] })] }));
    }
    // Default variant with full styling
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: countdownKeyframes }), _jsxs("div", { className: className, style: {
                    '--glow-color': colors.glow,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: sizes.padding,
                    animation: !prefersReducedMotion
                        ? 'retryCountdownFadeIn 0.4s ease-out'
                        : 'none',
                }, role: "timer", "aria-live": "polite", "aria-label": `Retrying in ${seconds} seconds`, children: [showProgress ? (_jsxs("div", { style: {
                            position: 'relative',
                            width: sizes.container,
                            height: sizes.container,
                            animation: !prefersReducedMotion && isHovered
                                ? 'retryCountdownPulse 2s ease-in-out infinite'
                                : 'none',
                        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [!prefersReducedMotion && (_jsx("div", { style: {
                                    position: 'absolute',
                                    inset: '8px',
                                    borderRadius: '50%',
                                    background: colors.gradient,
                                    opacity: 0.15,
                                    filter: 'blur(12px)',
                                    animation: seconds <= 3
                                        ? 'retryCountdownGlow 1s ease-in-out infinite'
                                        : 'none',
                                }, "aria-hidden": "true" })), _jsxs("svg", { width: sizes.container, height: sizes.container, viewBox: `0 0 ${sizes.ring} ${sizes.ring}`, style: {
                                    transform: 'rotate(-90deg)',
                                    filter: !prefersReducedMotion
                                        ? `drop-shadow(0 0 6px ${colors.glow})`
                                        : 'none',
                                }, children: [_jsx("circle", { cx: sizes.ring / 2, cy: sizes.ring / 2, r: sizes.ring / 2 - sizes.stroke, fill: "none", stroke: `${colors.primary}15`, strokeWidth: sizes.stroke }), _jsx("defs", { children: _jsxs("linearGradient", { id: `countdown-gradient-${colorScheme}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: colors.primary }), _jsx("stop", { offset: "100%", stopColor: colors.secondary })] }) }), _jsx("circle", { cx: sizes.ring / 2, cy: sizes.ring / 2, r: sizes.ring / 2 - sizes.stroke, fill: "none", stroke: `url(#countdown-gradient-${colorScheme})`, strokeWidth: sizes.stroke, strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: strokeDashoffset, style: {
                                            transition: prefersReducedMotion
                                                ? 'none'
                                                : 'stroke-dashoffset 0.1s linear',
                                        } })] }), _jsx("div", { style: {
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }, children: isComplete ? (_jsx("svg", { width: sizes.iconSize * 1.5, height: sizes.iconSize * 1.5, viewBox: "0 0 24 24", fill: "none", stroke: colors.primary, strokeWidth: "2", style: {
                                        animation: !prefersReducedMotion
                                            ? 'retryCountdownSpin 1s linear infinite'
                                            : 'none',
                                    }, children: _jsx("path", { d: "M21 12a9 9 0 11-6.219-8.56" }) })) : (_jsxs(_Fragment, { children: [_jsx("span", { style: {
                                                fontSize: sizes.font,
                                                fontWeight: 700,
                                                color: 'var(--error-color-text, #1f2937)',
                                                fontVariantNumeric: 'tabular-nums',
                                                lineHeight: 1,
                                                animation: !prefersReducedMotion && seconds <= 3
                                                    ? 'retryCountdownTick 1s ease-in-out'
                                                    : 'none',
                                            }, children: seconds }), _jsx("span", { style: {
                                                fontSize: size === 'sm' ? '0.625rem' : '0.75rem',
                                                color: 'var(--error-color-muted, #9ca3af)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                marginTop: '2px',
                                            }, children: "sec" })] })) })] })) : (_jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '0.375rem',
                        }, children: [_jsx("span", { style: {
                                    fontSize: sizes.font,
                                    fontWeight: 700,
                                    color: colors.primary,
                                    fontVariantNumeric: 'tabular-nums',
                                }, children: seconds }), _jsx("span", { style: {
                                    fontSize: '0.875rem',
                                    color: 'var(--error-color-muted, #6b7280)',
                                }, children: "seconds" })] })), _jsx("p", { style: {
                            margin: 0,
                            fontSize: '0.875rem',
                            color: 'var(--error-color-muted, #6b7280)',
                            textAlign: 'center',
                        }, children: displayMessage }), showRetryButton && onRetryNow && seconds > 0 && (_jsxs("button", { onClick: onRetryNow, style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: colors.primary,
                            background: 'transparent',
                            border: `1.5px solid ${colors.primary}`,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }, onMouseOver: (e) => {
                            e.currentTarget.style.background = colors.bg;
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = colors.shadow;
                        }, onMouseOut: (e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }, onFocus: (e) => {
                            e.currentTarget.style.outline = `2px solid ${colors.primary}`;
                            e.currentTarget.style.outlineOffset = '2px';
                        }, onBlur: (e) => {
                            e.currentTarget.style.outline = 'none';
                        }, children: [_jsxs("svg", { width: sizes.iconSize - 2, height: sizes.iconSize - 2, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [_jsx("path", { d: "M23 4v6h-6" }), _jsx("path", { d: "M20.49 15a9 9 0 11-2.12-9.36L23 10" })] }), "Retry now"] }))] })] }));
}
//# sourceMappingURL=RetryCountdown.js.map