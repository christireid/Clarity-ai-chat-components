/**
 * Theme Preview Component
 *
 * Interactive theme preview and live editor
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { getAllThemes, hexToHsl, hslToHex, 
// createTheme, // Reserved for future use
validateTheme } from '../theme/theme-builder';
/**
 * Theme Preview Component
 *
 * Shows live preview of theme with editable colors
 *
 * @example
 * ```tsx
 * <ThemePreview
 *   showEditor
 *   onThemeChange={theme => console.log('Theme changed:', theme)}
 * />
 * ```
 */
export function ThemePreview({ showEditor = false, onThemeChange, className, }) {
    const { resolvedTheme } = useTheme();
    const [localTheme, setLocalTheme] = React.useState(resolvedTheme);
    const [editMode, setEditMode] = React.useState(false);
    React.useEffect(() => {
        if (resolvedTheme) {
            setLocalTheme(resolvedTheme);
        }
    }, [resolvedTheme]);
    const handleColorChange = React.useCallback((colorKey, hexValue) => {
        if (!localTheme)
            return;
        const hslValue = hexToHsl(hexValue);
        const updatedTheme = {
            ...localTheme,
            colors: {
                ...localTheme.colors,
                [colorKey]: hslValue,
            },
        };
        setLocalTheme(updatedTheme);
        onThemeChange?.(updatedTheme);
    }, [localTheme, onThemeChange]);
    if (!localTheme)
        return null;
    return (_jsxs("div", { className: `theme-preview ${className || ''}`, children: [_jsxs("div", { className: "preview-panel space-y-4 p-6 rounded-lg border border-border bg-background", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Theme Preview" }), showEditor && (_jsx("button", { onClick: () => setEditMode(!editMode), className: "px-3 py-1 text-sm rounded-md border border-border hover:bg-accent", children: editMode ? 'View Mode' : 'Edit Mode' }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("button", { className: "px-4 py-2 bg-primary text-primary-foreground rounded-md", children: "Primary Button" }), _jsx("button", { className: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md", children: "Secondary Button" }), _jsx("button", { className: "px-4 py-2 bg-destructive text-destructive-foreground rounded-md", children: "Destructive Button" })] }), _jsxs("div", { className: "p-4 bg-card text-card-foreground rounded-lg border border-border", children: [_jsx("h4", { className: "font-medium mb-2", children: "Card Component" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "This is a sample card with muted text" })] }), _jsx("input", { type: "text", placeholder: "Sample input field", className: "w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring" }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "p-3 bg-success/10 text-success rounded-md border border-success/20", children: "\u2713 Success message" }), _jsx("div", { className: "p-3 bg-warning/10 text-warning rounded-md border border-warning/20", children: "\u26A0 Warning message" }), _jsx("div", { className: "p-3 bg-info/10 text-info rounded-md border border-info/20", children: "\u2139 Info message" })] })] })] }), showEditor && editMode && (_jsxs("div", { className: "editor-panel mt-6 p-6 rounded-lg border-2 border-border bg-card", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Color Editor" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: Object.entries(localTheme.colors).map(([key, value]) => {
                            const hexValue = hslToHex(value);
                            return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "color", value: hexValue, onChange: (e) => handleColorChange(key, e.target.value), className: "w-12 h-12 rounded cursor-pointer border-2 border-border" }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-sm font-medium", children: key.replace(/([A-Z])/g, ' $1').trim() }), _jsx("input", { type: "text", value: hexValue, onChange: (e) => handleColorChange(key, e.target.value), className: "w-full px-2 py-1 text-xs bg-background border border-input rounded font-mono" })] })] }, key));
                        }) }), _jsxs("div", { className: "mt-6 flex gap-2", children: [_jsx("button", { onClick: () => {
                                    if (localTheme) {
                                        const validation = validateTheme(localTheme);
                                        if (validation.warnings.length > 0) {
                                            alert('Theme warnings:\n' + validation.warnings.join('\n'));
                                        }
                                        else {
                                            alert('Theme is valid!');
                                        }
                                    }
                                }, className: "px-4 py-2 bg-primary text-primary-foreground rounded-md", children: "Validate Theme" }), _jsx("button", { onClick: () => {
                                    if (localTheme) {
                                        const json = JSON.stringify(localTheme, null, 2);
                                        navigator.clipboard.writeText(json);
                                        alert('Theme copied to clipboard!');
                                    }
                                }, className: "px-4 py-2 bg-secondary text-secondary-foreground rounded-md", children: "Export Theme" })] })] }))] }));
}
export function ThemeComparison({ theme1, theme2, className }) {
    const allThemes = React.useMemo(() => getAllThemes(), []);
    const themeConfig1 = allThemes.find(t => t.name === theme1);
    const themeConfig2 = allThemes.find(t => t.name === theme2);
    if (!themeConfig1 || !themeConfig2)
        return null;
    return (_jsxs("div", { className: `theme-comparison grid grid-cols-2 gap-4 ${className || ''}`, children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: themeConfig1.metadata.displayName }), _jsx(ThemePreview, {})] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: themeConfig2.metadata.displayName }), _jsx(ThemePreview, {})] })] }));
}
//# sourceMappingURL=theme-preview.js.map