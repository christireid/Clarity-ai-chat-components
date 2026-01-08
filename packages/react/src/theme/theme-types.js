/**
 * Theme System Type Definitions
 *
 * @module theme/theme-types
 */
/**
 * Animation speed durations in milliseconds
 */
export const animationSpeedMap = {
    none: 0,
    fast: 150,
    normal: 300,
    slow: 500,
};
/**
 * Check if a value is a CompleteThemeConfig (has colors, typography, etc.)
 * vs a ThemeConfig (has mode, preset, customTheme, etc.)
 */
export function isCompleteThemeConfig(value) {
    if (!value || typeof value !== 'object')
        return false;
    const obj = value;
    // CompleteThemeConfig has 'colors' and 'typography' as required fields
    return ('colors' in obj && 'typography' in obj && typeof obj.colors === 'object');
}
/**
 * Normalize theme input to ThemeConfig format
 * Allows users to pass either:
 * - Partial<ThemeConfig> (e.g., { preset: 'default' })
 * - CompleteThemeConfig (e.g., defaultLightTheme directly)
 */
export function normalizeThemeInput(input) {
    if (!input)
        return { mode: 'system' };
    // If it's a complete theme config, wrap it
    if (isCompleteThemeConfig(input)) {
        return {
            mode: input.mode || 'light',
            customTheme: input,
        };
    }
    return input;
}
//# sourceMappingURL=theme-types.js.map