/**
 * Theme Selector Component
 *
 * UI component for selecting and switching between theme presets
 */
'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { getAllThemes } from '../../theme/theme-builder';
/**
 * Theme Selector - Choose from built-in theme presets
 *
 * Features:
 * - Visual theme preview
 * - Horizontal or vertical layout
 * - Keyboard navigation
 * - Active theme indication
 *
 * @example
 * ```tsx
 * <ThemeSelector
 *   showPreview
 *   orientation="vertical"
 *   onThemeChange={(theme) => console.log('Theme changed:', theme)}
 * />
 * ```
 */
export function ThemeSelector({ showPreview = true, orientation = 'vertical', className, onThemeChange, }) {
    const { theme, setPreset } = useTheme();
    const allThemes = React.useMemo(() => getAllThemes(), []);
    const handleThemeSelect = React.useCallback((themeName) => {
        setPreset(themeName);
        onThemeChange?.(themeName);
    }, [setPreset, onThemeChange]);
    const isHorizontal = orientation === 'horizontal';
    return (_jsx("div", { className: `theme-selector ${isHorizontal ? 'flex flex-row gap-2 overflow-x-auto' : 'flex flex-col gap-1'} ${className || ''}`, role: "radiogroup", "aria-label": "Theme selection", children: allThemes.map(({ name, metadata, config: _config }) => {
            const isActive = theme.preset === name;
            return (_jsxs("button", { type: "button", role: "radio", "aria-checked": isActive, onClick: () => handleThemeSelect(name), className: `
              theme-option
              flex items-center gap-3 p-3 rounded-lg
              border transition-all duration-150 ease-out
              ${isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
              ${isHorizontal ? 'flex-col min-w-[120px]' : 'flex-row'}
            `, children: [showPreview && metadata.preview && (_jsxs("div", { className: "theme-preview flex gap-1 items-center", children: [_jsx("div", { className: "w-8 h-8 rounded-full border border-white shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", style: { backgroundColor: metadata.preview.primaryColor }, "aria-hidden": "true" }), !isHorizontal && (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-6 h-6 rounded-full border border-white shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", style: {
                                            backgroundColor: metadata.preview.secondaryColor,
                                        }, "aria-hidden": "true" }), _jsx("div", { className: "w-6 h-6 rounded-full border border-white shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", style: {
                                            backgroundColor: metadata.preview.backgroundColor,
                                        }, "aria-hidden": "true" })] }))] })), _jsxs("div", { className: `theme-info ${isHorizontal ? 'text-center' : 'flex-1'}`, children: [_jsx("div", { className: "font-medium text-sm", children: metadata.displayName }), !isHorizontal && (_jsx("div", { className: "text-xs text-muted-foreground", children: metadata.description }))] }), isActive && (_jsx("svg", { className: "w-5 h-5 text-primary", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-label": "Selected", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }))] }, name));
        }) }));
}
export function ThemeSelectorDropdown({ className, onThemeChange, }) {
    const { theme, setPreset } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);
    const allThemes = React.useMemo(() => getAllThemes(), []);
    const handleThemeSelect = React.useCallback((themeName) => {
        setPreset(themeName);
        setIsOpen(false);
        onThemeChange?.(themeName);
    }, [setPreset, onThemeChange]);
    const currentTheme = allThemes.find((t) => t.name === theme.preset);
    return (_jsxs("div", { className: `theme-selector-dropdown relative ${className || ''}`, children: [_jsxs("button", { type: "button", onClick: () => setIsOpen(!isOpen), className: "\n          flex items-center justify-between gap-2\n          px-4 py-2 rounded-lg\n          border border-border\n          bg-background\n          hover:bg-accent\n          transition-colors\n        ", "aria-expanded": isOpen, "aria-haspopup": "listbox", children: [_jsx("span", { className: "font-medium text-sm", children: currentTheme?.metadata.displayName || 'Select Theme' }), _jsx("svg", { className: `w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("polyline", { points: "6 9 12 15 18 9" }) })] }), isOpen && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40", onClick: () => setIsOpen(false), "aria-hidden": "true" }), _jsx("div", { className: "\n              absolute top-full left-0 right-0 mt-2 z-50\n              bg-popover border border-border/60 rounded-lg shadow-[0_24px_48px_rgba(15,23,42,0.32)] backdrop-blur-sm\n              max-h-96 overflow-y-auto\n            ", role: "listbox", children: allThemes.map(({ name, metadata }) => {
                            const isActive = theme.preset === name;
                            return (_jsxs("button", { type: "button", role: "option", "aria-selected": isActive, onClick: () => handleThemeSelect(name), className: `
                    w-full flex items-center justify-between gap-3 px-4 py-3
                    text-left transition-colors
                    ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}
                  `, children: [_jsxs("div", { className: "flex items-center gap-3 flex-1", children: [metadata.preview && (_jsx("div", { className: "w-6 h-6 rounded-full border-2 border-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] flex-shrink-0", style: {
                                                    backgroundColor: metadata.preview.primaryColor,
                                                }, "aria-hidden": "true" })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "font-medium text-sm", children: metadata.displayName }), _jsx("div", { className: "text-xs text-muted-foreground truncate", children: metadata.description })] })] }), isActive && (_jsx("svg", { className: "w-5 h-5 text-primary flex-shrink-0", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-label": "Selected", children: _jsx("polyline", { points: "20 6 9 17 4 12" }) }))] }, name));
                        }) })] }))] }));
}
//# sourceMappingURL=theme-selector.js.map