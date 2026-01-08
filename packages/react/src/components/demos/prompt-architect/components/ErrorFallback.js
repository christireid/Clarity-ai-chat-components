'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ErrorFallback Component
 *
 * A friendly error fallback UI for the Prompt Architect Studio.
 * Shows when an error occurs during rendering.
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
/**
 * Error fallback UI for the Prompt Architect demo
 */
export function ErrorFallback({ error, resetError, className, }) {
    return (_jsx("div", { role: "alert", "aria-live": "assertive", className: cn('flex flex-col items-center justify-center h-full min-h-[400px] p-8', 'bg-background rounded-xl border border-border', className), children: _jsxs("div", { className: "text-center max-w-md", children: [_jsx("div", { className: "text-5xl mb-4", role: "img", "aria-label": "Error", children: "\u26A0\uFE0F" }), _jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: error.message || 'An unexpected error occurred' }), _jsxs("details", { className: "text-left mb-6", children: [_jsx("summary", { className: "text-xs text-muted-foreground cursor-pointer hover:text-foreground", children: "Show technical details" }), _jsx("pre", { className: "mt-2 p-3 text-xs bg-muted rounded-lg overflow-auto max-h-32 text-foreground", children: error.stack || error.toString() })] }), _jsx("button", { type: "button", onClick: resetError, className: cn('px-4 py-2 text-sm font-medium rounded-lg', 'bg-primary text-primary-foreground', 'hover:bg-primary/90 transition-colors', 'focus:outline-none focus:ring-2 focus:ring-primary/50'), children: "Try Again" }), _jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "If this problem persists, try refreshing the page or clearing your browser cache." })] }) }));
}
export default ErrorFallback;
//# sourceMappingURL=ErrorFallback.js.map