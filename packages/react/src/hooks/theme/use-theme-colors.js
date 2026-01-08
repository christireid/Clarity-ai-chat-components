/**
 * useThemeColors Hook
 *
 * Convenience hook for accessing the current theme's colors.
 * Provides both the raw HSL values and computed hex values.
 *
 * @example
 * ```tsx
 * const { primary, background, isDark } = useThemeColors()
 *
 * // Use in inline styles
 * <div style={{ color: `hsl(${primary})` }}>
 *   Themed text
 * </div>
 *
 * // Or use hex values
 * const { hex } = useThemeColors()
 * <div style={{ backgroundColor: hex.primary }}>
 *   Primary background
 * </div>
 * ```
 */
import * as React from 'react';
import { useTheme } from '../../theme/ThemeProvider';
import { hslStringToHex } from '../../theme/color-utils';
/**
 * Convert ColorConfig to ThemeColorValues
 */
function colorConfigToValues(colors) {
    return {
        primary: colors.primary || '0 0% 0%',
        primaryForeground: colors.primaryForeground || '0 0% 100%',
        secondary: colors.secondary || '0 0% 96%',
        secondaryForeground: colors.secondaryForeground || '0 0% 9%',
        background: colors.background || '0 0% 100%',
        foreground: colors.foreground || '0 0% 3.9%',
        muted: colors.muted || '0 0% 96.1%',
        mutedForeground: colors.mutedForeground || '0 0% 45.1%',
        accent: colors.accent || '0 0% 96.1%',
        accentForeground: colors.accentForeground || '0 0% 9%',
        card: colors.card || '0 0% 100%',
        cardForeground: colors.cardForeground || '0 0% 3.9%',
        border: colors.border || '0 0% 89.8%',
        input: colors.input || '0 0% 89.8%',
        ring: colors.ring || '0 0% 3.9%',
        destructive: colors.destructive || '0 84.2% 60.2%',
        destructiveForeground: colors.destructiveForeground || '0 0% 98%',
        popover: colors.popover || '0 0% 100%',
        popoverForeground: colors.popoverForeground || '0 0% 3.9%',
    };
}
/**
 * Convert HSL strings to hex values
 */
function valuesToHex(values) {
    const result = {};
    for (const [key, value] of Object.entries(values)) {
        try {
            result[key] = hslStringToHex(value);
        }
        catch {
            result[key] = '#000000';
        }
    }
    return result;
}
/**
 * Hook to access theme colors conveniently
 *
 * @returns Theme color values and utilities
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { primary, isDark, hex } = useThemeColors()
 *
 *   return (
 *     <div style={{
 *       backgroundColor: `hsl(${primary})`,
 *       color: isDark ? '#fff' : '#000'
 *     }}>
 *       <span>Hex: {hex.primary}</span>
 *     </div>
 *   )
 * }
 * ```
 */
export function useThemeColors() {
    const { resolvedTheme, mode } = useTheme();
    // Extract colors from resolved theme
    const colors = React.useMemo(() => {
        if (!resolvedTheme?.colors) {
            return colorConfigToValues({});
        }
        return colorConfigToValues(resolvedTheme.colors);
    }, [resolvedTheme]);
    // Convert to hex values
    const hexColors = React.useMemo(() => valuesToHex(colors), [colors]);
    // Helper to get CSS variable reference
    const getCSSVar = React.useCallback((colorName) => {
        const kebabName = colorName.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `var(--clarity-${kebabName})`;
    }, []);
    // Helper to get HSL as usable CSS value
    const getHSL = React.useCallback((colorName) => {
        return `hsl(${colors[colorName]})`;
    }, [colors]);
    return {
        ...colors,
        isDark: mode === 'dark',
        isLight: mode === 'light',
        mode,
        themeName: resolvedTheme?.name || 'unknown',
        hex: hexColors,
        getCSSVar,
        getHSL,
    };
}
export default useThemeColors;
//# sourceMappingURL=use-theme-colors.js.map