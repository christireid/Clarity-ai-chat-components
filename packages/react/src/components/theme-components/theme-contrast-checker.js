import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Theme Contrast Checker Component
 *
 * Analyzes the current theme and displays WCAG compliance status
 * for all color pairs. Shows which combinations pass AA, AAA, or fail.
 */
import * as React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { getContrastRatio, meetsContrastRequirement, hslStringToHex, } from '../../theme/color-utils';
/**
 * Convert an HSL string to hex, handling edge cases
 */
function safeHslToHex(hslString) {
    try {
        if (hslString.startsWith('#'))
            return hslString;
        return hslStringToHex(hslString);
    }
    catch {
        return '#000000';
    }
}
/**
 * Get WCAG level from contrast ratio
 */
function getWCAGLevel(ratio) {
    if (ratio >= 7)
        return 'AAA';
    if (ratio >= 4.5)
        return 'AA';
    return 'Fail';
}
/**
 * Color pair definitions to check
 */
const COLOR_PAIRS = [
    {
        name: 'Text on Background',
        foreground: 'foreground',
        background: 'background',
    },
    { name: 'Text on Card', foreground: 'cardForeground', background: 'card' },
    {
        name: 'Primary on Background',
        foreground: 'primary',
        background: 'background',
    },
    {
        name: 'Primary Text on Primary',
        foreground: 'primaryForeground',
        background: 'primary',
    },
    {
        name: 'Secondary Text on Secondary',
        foreground: 'secondaryForeground',
        background: 'secondary',
    },
    {
        name: 'Accent Text on Accent',
        foreground: 'accentForeground',
        background: 'accent',
    },
    {
        name: 'Muted Text on Muted',
        foreground: 'mutedForeground',
        background: 'muted',
    },
    {
        name: 'Destructive Text',
        foreground: 'destructiveForeground',
        background: 'destructive',
    },
    {
        name: 'Popover Text',
        foreground: 'popoverForeground',
        background: 'popover',
    },
];
/**
 * Badge component for displaying WCAG level
 * Uses semantic colors that work with any theme
 */
function LevelBadge({ level }) {
    // Use inline styles to avoid hardcoded Tailwind colors that may not exist in custom themes
    const styles = {
        AAA: {
            backgroundColor: 'hsl(var(--clarity-success, 142 76% 36%) / 0.15)',
            color: 'hsl(var(--clarity-success, 142 76% 36%))',
        },
        AA: {
            backgroundColor: 'hsl(var(--clarity-warning, 38 92% 50%) / 0.15)',
            color: 'hsl(var(--clarity-warning, 38 92% 50%))',
        },
        Fail: {
            backgroundColor: 'hsl(var(--clarity-destructive, 0 84% 60%) / 0.15)',
            color: 'hsl(var(--clarity-destructive, 0 84% 60%))',
        },
    };
    return (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", style: styles[level], role: "status", "aria-label": `WCAG compliance: ${level === 'Fail' ? 'Failed' : `Passes ${level}`}`, children: level === 'Fail' ? '✗ Fail' : `✓ ${level}` }));
}
/**
 * Color swatch component
 */
function ColorSwatch({ color, label }) {
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-6 h-6 rounded border border-border", style: { backgroundColor: color }, title: color, "aria-hidden": "true" }), _jsx("span", { className: "text-xs font-mono", "aria-label": `Color: ${label}`, children: label })] }));
}
/**
 * ThemeContrastChecker - Visual WCAG accessibility analyzer
 *
 * Analyzes color contrast ratios in your theme and displays
 * compliance status for each color pair.
 *
 * @example
 * ```tsx
 * // Use with current theme
 * <ThemeContrastChecker />
 *
 * // Analyze a custom theme
 * <ThemeContrastChecker theme={myCustomTheme} />
 *
 * // Show only failing contrasts
 * <ThemeContrastChecker showOnlyFailing />
 * ```
 */
export function ThemeContrastChecker({ theme: customTheme, showDetails = true, className = '', showOnlyFailing = false, }) {
    const { resolvedTheme } = useTheme();
    const theme = customTheme || resolvedTheme;
    // Analyze all color pairs
    const analysis = React.useMemo(() => {
        if (!theme?.colors)
            return [];
        return COLOR_PAIRS.map((pair) => {
            const foreground = theme.colors[pair.foreground] || '0 0% 0%';
            const background = theme.colors[pair.background] || '0 0% 100%';
            const foregroundHex = safeHslToHex(foreground);
            const backgroundHex = safeHslToHex(background);
            const ratio = getContrastRatio(foregroundHex, backgroundHex);
            const passesAA = meetsContrastRequirement(foregroundHex, backgroundHex, 'AA');
            const passesAAA = meetsContrastRequirement(foregroundHex, backgroundHex, 'AAA');
            return {
                name: pair.name,
                foreground,
                background,
                foregroundHex,
                backgroundHex,
                ratio,
                level: getWCAGLevel(ratio),
                passesAA,
                passesAAA,
            };
        });
    }, [theme]);
    // Filter based on showOnlyFailing
    const filteredAnalysis = showOnlyFailing
        ? analysis.filter((a) => a.level === 'Fail')
        : analysis;
    // Summary stats
    const summary = React.useMemo(() => {
        const total = analysis.length;
        const passing = analysis.filter((a) => a.passesAA).length;
        const passingAAA = analysis.filter((a) => a.passesAAA).length;
        const failing = analysis.filter((a) => !a.passesAA).length;
        return { total, passing, passingAAA, failing };
    }, [analysis]);
    if (!theme) {
        return (_jsx("div", { className: `p-4 text-sm text-muted-foreground ${className}`, children: "No theme available. Wrap your component in a ThemeProvider." }));
    }
    return (_jsxs("div", { className: `theme-contrast-checker ${className}`, children: [_jsxs("div", { className: "mb-4 p-4 rounded-lg bg-card border", children: [_jsx("h3", { className: "text-lg font-semibold mb-2", children: "Theme Accessibility Report" }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", children: summary.total }), _jsx("div", { className: "text-muted-foreground", children: "Color Pairs" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", style: { color: 'hsl(var(--clarity-success, 142 76% 36%))' }, children: summary.passing }), _jsx("div", { className: "text-muted-foreground", children: "Pass AA" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", style: { color: 'hsl(var(--clarity-success, 142 76% 30%))' }, children: summary.passingAAA }), _jsx("div", { className: "text-muted-foreground", children: "Pass AAA" })] }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", style: { color: 'hsl(var(--clarity-destructive, 0 84% 60%))' }, children: summary.failing }), _jsx("div", { className: "text-muted-foreground", children: "Failing" })] })] }), _jsx("div", { className: "mt-3 pt-3 border-t", children: summary.failing === 0 ? (_jsx("p", { className: "font-medium", style: { color: 'hsl(var(--clarity-success, 142 76% 36%))' }, children: "\u2713 All color pairs meet WCAG AA requirements" })) : (_jsxs("p", { className: "font-medium", style: { color: 'hsl(var(--clarity-destructive, 0 84% 60%))' }, children: ["\u26A0 ", summary.failing, " color pair", summary.failing > 1 ? 's' : '', ' ', "need attention"] })) })] }), showDetails && (_jsx("div", { className: "space-y-2", children: filteredAnalysis.map((pair) => (_jsxs("div", { className: "p-3 rounded-lg border", style: pair.level === 'Fail'
                        ? {
                            borderColor: 'hsl(var(--clarity-destructive, 0 84% 60%) / 0.3)',
                            backgroundColor: 'hsl(var(--clarity-destructive, 0 84% 60%) / 0.05)',
                        }
                        : undefined, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "font-medium", children: pair.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-sm font-mono", children: [pair.ratio.toFixed(2), ":1"] }), _jsx(LevelBadge, { level: pair.level })] })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsx(ColorSwatch, { color: pair.foregroundHex, label: pair.foregroundHex }), _jsx("span", { className: "text-muted-foreground", children: "on" }), _jsx(ColorSwatch, { color: pair.backgroundHex, label: pair.backgroundHex })] }), _jsx("div", { className: "mt-2 p-2 rounded text-sm", style: {
                                backgroundColor: pair.backgroundHex,
                                color: pair.foregroundHex,
                            }, children: "Sample text preview" }), pair.level === 'Fail' && (_jsx("div", { className: "mt-2 text-xs", style: {
                                color: 'hsl(var(--clarity-destructive, 0 84% 60%))',
                            }, children: "\uD83D\uDCA1 Tip: Increase contrast by darkening the foreground or lightening the background" }))] }, pair.name))) })), _jsxs("div", { className: "mt-4 p-3 rounded-lg bg-muted text-sm", children: [_jsx("p", { className: "font-medium mb-1", children: "WCAG Contrast Requirements:" }), _jsxs("ul", { className: "space-y-1 text-muted-foreground", children: [_jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "AA (Normal Text):" }), " 4.5:1 minimum ratio"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "AAA (Enhanced):" }), " 7:1 minimum ratio"] }), _jsxs("li", { children: ["\u2022 ", _jsx("strong", { children: "AA (Large Text):" }), " 3:1 minimum ratio (18pt+ or 14pt+ bold)"] })] })] })] }));
}
export default ThemeContrastChecker;
//# sourceMappingURL=theme-contrast-checker.js.map