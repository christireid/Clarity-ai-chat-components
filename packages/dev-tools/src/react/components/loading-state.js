/**
 * Loading State Components
 * Reusable loading indicators for dev tools panels
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Animated loading spinner
 */
export function LoadingSpinner({ size = 'md', className, label = 'Loading...', }) {
    const sizeMap = {
        sm: 16,
        md: 24,
        lg: 32,
    };
    const spinnerSize = sizeMap[size];
    return (_jsxs("div", { className: `loading-spinner loading-spinner-${size} ${className || ''}`, role: "status", "aria-label": label, children: [_jsxs("svg", { width: spinnerSize, height: spinnerSize, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("circle", { className: "loading-spinner-track", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "3", opacity: "0.25" }), _jsx("circle", { className: "loading-spinner-progress", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeDasharray: "31.42", strokeDashoffset: "10" })] }), _jsx("span", { className: "sr-only", children: label })] }));
}
/**
 * Loading overlay that covers content
 */
export function LoadingOverlay({ isLoading, message = 'Loading...', children, blur = true, className, }) {
    return (_jsxs("div", { className: `loading-overlay-container ${className || ''}`, children: [_jsx("div", { className: `loading-overlay-content ${isLoading && blur ? 'loading-blurred' : ''}`, children: children }), isLoading && (_jsx("div", { className: "loading-overlay", role: "alert", "aria-busy": "true", children: _jsxs("div", { className: "loading-overlay-inner", children: [_jsx(LoadingSpinner, { size: "lg" }), message && _jsx("p", { className: "loading-overlay-message", children: message })] }) }))] }));
}
/**
 * Skeleton loading placeholder
 */
export function LoadingSkeleton({ width = '100%', height = '1em', radius = 'md', className, lines = 1, }) {
    const radiusMap = {
        sm: 'var(--dt-radius-sm)',
        md: 'var(--dt-radius-md)',
        lg: 'var(--dt-radius-lg)',
        full: 'var(--dt-radius-full)',
    };
    if (lines > 1) {
        return (_jsx("div", { className: `loading-skeleton-group ${className || ''}`, children: Array.from({ length: lines }).map((_, i) => (_jsx("div", { className: "loading-skeleton", style: {
                    width: i === lines - 1 ? '60%' : width,
                    height,
                    borderRadius: radiusMap[radius],
                }, "aria-hidden": "true" }, i))) }));
    }
    return (_jsx("div", { className: `loading-skeleton ${className || ''}`, style: {
            width,
            height,
            borderRadius: radiusMap[radius],
        }, "aria-hidden": "true" }));
}
/**
 * Button with loading state
 */
export function LoadingButton({ isLoading, loadingText, variant = 'primary', size = 'md', children, disabled, className, ...props }) {
    const sizeClass = size !== 'md' ? `dt-btn-${size}` : '';
    return (_jsx("button", { className: `dt-btn dt-btn-${variant} ${sizeClass} ${className || ''}`, disabled: disabled || isLoading, "aria-busy": isLoading, ...props, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(LoadingSpinner, { size: "sm" }), loadingText || children] })) : (children) }));
}
export default LoadingSpinner;
//# sourceMappingURL=loading-state.js.map