/**
 * ThemeModeSelector Component
 *
 * Three-way mode selector (light/dark/system)
 *
 * @module theme/ThemeModeSelector
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
import { useTheme } from './use-theme';
/**
 * ThemeModeSelector - Three-way mode selector (light/dark/system)
 *
 * Unlike ThemeToggle which only toggles between light/dark,
 * this component provides access to all three modes including system.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeModeSelector />
 *
 * // Inline variant
 * <ThemeModeSelector variant="inline" />
 *
 * // With custom className
 * <ThemeModeSelector className="my-selector" />
 * ```
 */
export function ThemeModeSelector({ className, variant = 'buttons', size = 'md', }) {
    const { theme, setTheme, mode } = useTheme();
    const currentMode = theme.mode;
    const modes = [
        {
            value: 'light',
            label: 'Light',
            icon: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "5" }), _jsx("path", { d: "M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" })] })),
        },
        {
            value: 'dark',
            label: 'Dark',
            icon: (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: _jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) })),
        },
        {
            value: 'system',
            label: 'System',
            icon: (_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [_jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }), _jsx("path", { d: "M8 21h8m-4-4v4" })] })),
        },
    ];
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };
    if (variant === 'dropdown') {
        return (_jsxs("div", { className: cn('relative inline-block', className), children: [_jsx("select", { value: currentMode, onChange: (e) => setTheme({ mode: e.target.value }), className: cn('appearance-none rounded-lg border border-border bg-background text-foreground', 'focus:outline-none focus:ring-2 focus:ring-ring/40', 'pr-8 cursor-pointer', sizeClasses[size]), "aria-label": "Select theme mode", children: modes.map((m) => (_jsx("option", { value: m.value, children: m.label }, m.value))) }), _jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2", children: _jsx("svg", { className: "h-4 w-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) }) })] }));
    }
    if (variant === 'inline') {
        return (_jsx("div", { className: cn('inline-flex items-center gap-1 rounded-lg bg-muted p-1', className), role: "radiogroup", "aria-label": "Theme mode", children: modes.map((m) => (_jsxs("button", { type: "button", onClick: () => setTheme({ mode: m.value }), className: cn('inline-flex items-center gap-1.5 rounded-md transition-colors', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1', sizeClasses[size], currentMode === m.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'), role: "radio", "aria-checked": currentMode === m.value, "aria-label": m.label, children: [m.icon, _jsx("span", { className: "sr-only sm:not-sr-only", children: m.label })] }, m.value))) }));
    }
    // Default: buttons variant
    return (_jsxs("div", { className: cn('flex items-center gap-2', className), role: "radiogroup", "aria-label": "Theme mode", children: [modes.map((m) => (_jsxs("button", { type: "button", onClick: () => setTheme({ mode: m.value }), className: cn('inline-flex items-center gap-2 rounded-lg border transition-colors', 'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', sizeClasses[size], currentMode === m.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-foreground hover:bg-muted'), role: "radio", "aria-checked": currentMode === m.value, "aria-label": m.label, children: [m.icon, _jsx("span", { children: m.label })] }, m.value))), currentMode === 'system' && (_jsxs("span", { className: "text-xs text-muted-foreground ml-2", children: ["(using ", mode, ")"] }))] }));
}
ThemeModeSelector.displayName = 'ThemeModeSelector';
//# sourceMappingURL=ThemeModeSelector.js.map