'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
/**
 * Progress bar component for dashboard metrics.
 *
 * Features:
 * - Accessible with ARIA attributes
 * - Guards against NaN/Infinity values
 * - Auto color variant based on thresholds
 * - Multiple size options
 *
 * @example
 * ```tsx
 * <DashboardProgress
 *   value={75}
 *   aria-label="Storage usage"
 *   variant="auto"
 *   thresholds={{ warning: 70, danger: 90 }}
 * />
 * ```
 */
export function DashboardProgress({ className, value = 0, max = 100, 'aria-label': ariaLabel, showValue = false, size = 'md', variant = 'default', thresholds = { warning: 70, danger: 90 }, ref, ...props }) {
    // Guard against NaN/Infinity - clamp to valid percentage range
    const safeValue = Number.isFinite(value)
        ? Math.min(max, Math.max(0, value))
        : 0;
    const percentage = (safeValue / max) * 100;
    // Determine color based on variant
    const getBarColor = () => {
        if (variant === 'auto') {
            if (percentage >= thresholds.danger)
                return 'bg-red-600';
            if (percentage >= thresholds.warning)
                return 'bg-yellow-500';
            return 'bg-green-600';
        }
        switch (variant) {
            case 'success':
                return 'bg-green-600';
            case 'warning':
                return 'bg-yellow-500';
            case 'danger':
                return 'bg-red-600';
            default:
                return 'bg-blue-600';
        }
    };
    // Size classes
    const sizeClasses = {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
    };
    return (_jsxs("div", { className: cn('w-full', className), ref: ref, ...props, children: [_jsx("div", { className: cn('relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700', sizeClasses[size]), role: "progressbar", "aria-valuenow": Math.round(safeValue), "aria-valuemin": 0, "aria-valuemax": max, "aria-label": ariaLabel || 'Progress', children: _jsx("div", { className: cn('h-full transition-all duration-300 ease-out', getBarColor()), style: { width: `${percentage}%` } }) }), showValue && (_jsxs("span", { className: "mt-1 text-xs text-muted-foreground", children: [Math.round(percentage), "%"] }))] }));
}
DashboardProgress.displayName = 'DashboardProgress';
/**
 * Circular progress indicator component.
 *
 * @example
 * ```tsx
 * <CircularProgress value={75} size={48} showValue />
 * ```
 */
export function CircularProgress({ value, size = 40, strokeWidth = 4, showValue = false, variant = 'default', thresholds = { warning: 70, danger: 90 }, className, }) {
    // Guard against invalid values
    const safeValue = Number.isFinite(value)
        ? Math.min(100, Math.max(0, value))
        : 0;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (safeValue / 100) * circumference;
    // Determine color based on variant
    const getStrokeColor = () => {
        if (variant === 'auto') {
            if (safeValue >= thresholds.danger)
                return 'stroke-red-600';
            if (safeValue >= thresholds.warning)
                return 'stroke-yellow-500';
            return 'stroke-green-600';
        }
        switch (variant) {
            case 'success':
                return 'stroke-green-600';
            case 'warning':
                return 'stroke-yellow-500';
            case 'danger':
                return 'stroke-red-600';
            default:
                return 'stroke-blue-600';
        }
    };
    return (_jsxs("div", { className: cn('relative inline-flex items-center justify-center', className), style: { width: size, height: size }, role: "progressbar", "aria-valuenow": Math.round(safeValue), "aria-valuemin": 0, "aria-valuemax": 100, children: [_jsxs("svg", { className: "transform -rotate-90", width: size, height: size, children: [_jsx("circle", { className: "stroke-gray-200 dark:stroke-gray-700", strokeWidth: strokeWidth, fill: "none", r: radius, cx: size / 2, cy: size / 2 }), _jsx("circle", { className: cn('transition-all duration-300 ease-out', getStrokeColor()), strokeWidth: strokeWidth, strokeLinecap: "round", fill: "none", r: radius, cx: size / 2, cy: size / 2, style: {
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                        } })] }), showValue && (_jsx("span", { className: "absolute text-xs font-medium", children: Math.round(safeValue) }))] }));
}
CircularProgress.displayName = 'CircularProgress';
//# sourceMappingURL=dashboard-progress.js.map