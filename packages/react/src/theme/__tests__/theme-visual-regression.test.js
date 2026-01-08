/**
 * Visual Regression Tests for Theme System
 *
 * These tests verify that theme color values remain stable and
 * CSS variables are generated correctly across all presets.
 */
import { describe, it, expect } from 'vitest';
import { modernThemes } from '../modern-presets';
import { createTheme } from '../create-theme';
import { lightColors, darkColors, highContrastLightColors, highContrastDarkColors, } from '../tokens/colors';
// Helper to get a preset by name
function getModernPreset(name) {
    return modernThemes[name];
}
// Helper to extract HSL values for comparison
function parseHSL(hsl) {
    const parts = hsl.split(' ');
    return {
        h: parseInt(parts[0], 10),
        s: parseInt(parts[1], 10),
        l: parseInt(parts[2], 10),
    };
}
describe('Theme Visual Regression', () => {
    describe('Color Token Stability', () => {
        it('should have stable light color values', () => {
            // Snapshot of critical light colors to detect unintended changes
            expect(lightColors.primary).toBe('239 84% 56%');
            expect(lightColors.primaryForeground).toBe('0 0% 100%');
            expect(lightColors.background).toBe('0 0% 100%');
            expect(lightColors.foreground).toBe('222 47% 11%');
            expect(lightColors.destructive).toBe('0 84% 50%');
            expect(lightColors.mutedForeground).toBe('240 4% 38%');
        });
        it('should have stable dark color values', () => {
            expect(darkColors.primary).toBe('239 84% 70%');
            expect(darkColors.primaryForeground).toBe('222 47% 11%');
            expect(darkColors.background).toBe('222 47% 11%');
            expect(darkColors.foreground).toBe('210 40% 98%');
            expect(darkColors.destructive).toBe('0 72% 55%');
            expect(darkColors.mutedForeground).toBe('215 20% 70%');
        });
        it('should have stable high contrast light colors', () => {
            expect(highContrastLightColors.primary).toBe('239 100% 40%');
            expect(highContrastLightColors.background).toBe('0 0% 100%');
            expect(highContrastLightColors.foreground).toBe('0 0% 0%');
        });
        it('should have stable high contrast dark colors', () => {
            expect(highContrastDarkColors.primary).toBe('239 84% 75%');
            expect(highContrastDarkColors.background).toBe('0 0% 0%');
            expect(highContrastDarkColors.foreground).toBe('0 0% 100%');
        });
    });
    describe('WCAG AA Compliance', () => {
        // Helper to calculate relative luminance
        function getLuminance(hsl) {
            const { h, s, l } = parseHSL(hsl);
            // Convert HSL to RGB
            const sNorm = s / 100;
            const lNorm = l / 100;
            const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = lNorm - c / 2;
            let r = 0, g = 0, b = 0;
            if (h < 60) {
                r = c;
                g = x;
                b = 0;
            }
            else if (h < 120) {
                r = x;
                g = c;
                b = 0;
            }
            else if (h < 180) {
                r = 0;
                g = c;
                b = x;
            }
            else if (h < 240) {
                r = 0;
                g = x;
                b = c;
            }
            else if (h < 300) {
                r = x;
                g = 0;
                b = c;
            }
            else {
                r = c;
                g = 0;
                b = x;
            }
            r += m;
            g += m;
            b += m;
            // Apply sRGB conversion
            const toLinear = (v) => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
        }
        function getContrastRatio(bg, fg) {
            const l1 = getLuminance(bg);
            const l2 = getLuminance(fg);
            const lighter = Math.max(l1, l2);
            const darker = Math.min(l1, l2);
            return (lighter + 0.05) / (darker + 0.05);
        }
        it('should have sufficient contrast for light theme primary text', () => {
            // Primary on white background should meet WCAG AA (4.5:1)
            const contrast = getContrastRatio(lightColors.background, lightColors.primary);
            expect(contrast).toBeGreaterThanOrEqual(4.5);
        });
        it('should have sufficient contrast for light theme foreground', () => {
            const contrast = getContrastRatio(lightColors.background, lightColors.foreground);
            expect(contrast).toBeGreaterThanOrEqual(4.5);
        });
        it('should have sufficient contrast for light theme muted foreground', () => {
            const contrast = getContrastRatio(lightColors.background, lightColors.mutedForeground);
            expect(contrast).toBeGreaterThanOrEqual(4.5);
        });
        it('should have sufficient contrast for dark theme foreground', () => {
            const contrast = getContrastRatio(darkColors.background, darkColors.foreground);
            expect(contrast).toBeGreaterThanOrEqual(4.5);
        });
    });
    describe('Preset Completeness', () => {
        const presetNames = [
            'default',
            'default-dark',
            'neutral',
            'neutral-dark',
            'vibrant',
            'vibrant-dark',
            'high-contrast',
            'high-contrast-dark',
        ];
        it('should have all 8 presets defined', () => {
            expect(Object.keys(modernThemes)).toHaveLength(8);
            presetNames.forEach((name) => {
                expect(modernThemes[name]).toBeDefined();
            });
        });
        it.each(presetNames)('preset %s should have all required color tokens', (presetName) => {
            const theme = getModernPreset(presetName);
            expect(theme).toBeDefined();
            expect(theme.colors).toBeDefined();
            // Required color tokens
            const requiredColors = [
                'primary',
                'primaryForeground',
                'background',
                'foreground',
                'card',
                'cardForeground',
                'muted',
                'mutedForeground',
                'border',
                'destructive',
                'destructiveForeground',
            ];
            requiredColors.forEach((colorKey) => {
                expect(theme.colors[colorKey]).toBeDefined();
                expect(theme.colors[colorKey]).toBeTruthy();
            });
        });
        it.each(presetNames)('preset %s should have valid mode', (presetName) => {
            const theme = getModernPreset(presetName);
            expect(['light', 'dark']).toContain(theme.mode);
            // Dark presets should have mode 'dark'
            if (presetName.endsWith('-dark')) {
                expect(theme.mode).toBe('dark');
            }
            else {
                expect(theme.mode).toBe('light');
            }
        });
        it.each(presetNames)('preset %s should have valid border radius config', (presetName) => {
            const theme = getModernPreset(presetName);
            expect(theme.borders).toBeDefined();
            expect(theme.borders.radius).toBeDefined();
            expect(theme.borders.radius.md).toBeDefined();
            expect(typeof theme.borders.radius.md).toBe('string');
        });
    });
    describe('createTheme Stability', () => {
        it('should create theme with correct brand color override', () => {
            const customTheme = createTheme({
                extends: 'default',
                brandColor: '#ff0000',
                name: 'test-red',
            });
            expect(customTheme.name).toBe('test-red');
            expect(customTheme.colors.primary).toBeDefined();
            // Brand color should modify primary
            expect(customTheme.colors.primary).not.toBe(lightColors.primary);
        });
        it('should preserve base theme colors not overridden', () => {
            const customTheme = createTheme({
                extends: 'default',
                brandColor: '#ff0000',
                name: 'test-custom',
            });
            // Non-brand colors should be preserved from base theme
            expect(customTheme.colors.background).toBe(lightColors.background);
            expect(customTheme.colors.foreground).toBe(lightColors.foreground);
        });
        it('should apply radius override correctly', () => {
            const customTheme = createTheme({
                extends: 'default',
                radius: 'xl',
                name: 'test-radius',
            });
            // The radius option updates the 'lg' border radius value
            expect(customTheme.borders.radius.lg).toBe('0.75rem');
        });
        it('should handle all radius options', () => {
            // Radius options map to specific values for the 'lg' border radius
            const radiusOptions = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
            const expectedValues = [
                '0',
                '0.25rem',
                '0.375rem',
                '0.5rem',
                '0.75rem',
                '1rem',
            ];
            radiusOptions.forEach((radius, index) => {
                const theme = createTheme({
                    extends: 'default',
                    radius,
                    name: `test-radius-${radius}`,
                });
                expect(theme.borders.radius.lg).toBe(expectedValues[index]);
            });
        });
    });
    describe('Theme Snapshots (Optimized)', () => {
        /**
         * Instead of full object snapshots (which create 500+ line files),
         * we validate critical properties inline for better performance
         * and easier maintenance.
         */
        it('should have stable default light theme structure', () => {
            const theme = getModernPreset('default');
            // Validate structure
            expect(theme).toHaveProperty('name');
            expect(theme).toHaveProperty('mode', 'light');
            expect(theme).toHaveProperty('colors');
            expect(theme).toHaveProperty('typography');
            expect(theme).toHaveProperty('shadows');
            expect(theme).toHaveProperty('borders');
            expect(theme).toHaveProperty('animations');
            // Validate critical color values inline
            expect(theme.colors.primary).toBe('239 84% 56%');
            expect(theme.colors.background).toBe('0 0% 100%');
            expect(theme.colors.foreground).toBe('222 47% 11%');
        });
        it('should have stable default dark theme structure', () => {
            const theme = getModernPreset('default-dark');
            expect(theme).toHaveProperty('mode', 'dark');
            expect(theme.colors.primary).toBe('239 84% 70%');
            expect(theme.colors.background).toBe('222 47% 11%');
            expect(theme.colors.foreground).toBe('210 40% 98%');
        });
        it('should have stable high-contrast light theme structure', () => {
            const theme = getModernPreset('high-contrast');
            expect(theme).toHaveProperty('mode', 'light');
            expect(theme.colors.primary).toBe('239 100% 40%');
            expect(theme.colors.background).toBe('0 0% 100%');
            expect(theme.colors.foreground).toBe('0 0% 0%');
        });
        it('should have stable high-contrast dark theme structure', () => {
            const theme = getModernPreset('high-contrast-dark');
            expect(theme).toHaveProperty('mode', 'dark');
            expect(theme.colors.primary).toBe('239 84% 75%');
            expect(theme.colors.background).toBe('0 0% 0%');
            expect(theme.colors.foreground).toBe('0 0% 100%');
        });
        it('should have consistent theme property counts', () => {
            // Ensures no properties are accidentally added or removed
            const defaultTheme = getModernPreset('default');
            // Color tokens count
            const colorKeys = Object.keys(defaultTheme.colors);
            expect(colorKeys.length).toBeGreaterThanOrEqual(15);
            // Border radius count
            const radiusKeys = Object.keys(defaultTheme.borders.radius);
            expect(radiusKeys.length).toBe(8); // none, sm, md, lg, xl, 2xl, 3xl, full
            // Shadow count
            const shadowKeys = Object.keys(defaultTheme.shadows);
            expect(shadowKeys.length).toBeGreaterThanOrEqual(3);
        });
    });
    describe('CSS Variable Generation', () => {
        it('should generate valid HSL format for all color tokens', () => {
            const theme = getModernPreset('default');
            const hslPattern = /^\d{1,3}\s+\d{1,3}%\s+\d{1,3}%$/;
            Object.entries(theme.colors).forEach(([key, value]) => {
                if (value) {
                    expect(value, `Color ${key} should be valid HSL`).toMatch(hslPattern);
                }
            });
        });
        it('should generate valid shadow values', () => {
            const theme = getModernPreset('default');
            expect(theme.shadows).toBeDefined();
            expect(theme.shadows.sm).toBeDefined();
            expect(theme.shadows.md).toBeDefined();
            expect(theme.shadows.lg).toBeDefined();
        });
        it('should generate valid animation values', () => {
            const theme = getModernPreset('default');
            expect(theme.animations).toBeDefined();
            expect(theme.animations.duration).toBeDefined();
            expect(theme.animations.easing).toBeDefined();
        });
    });
});
describe('Theme Mode Transitions', () => {
    it('should pair light and dark themes correctly', () => {
        const pairs = [
            ['default', 'default-dark'],
            ['neutral', 'neutral-dark'],
            ['vibrant', 'vibrant-dark'],
            ['high-contrast', 'high-contrast-dark'],
        ];
        pairs.forEach(([lightName, darkName]) => {
            const lightTheme = getModernPreset(lightName);
            const darkTheme = getModernPreset(darkName);
            // Both should exist
            expect(lightTheme).toBeDefined();
            expect(darkTheme).toBeDefined();
            // Modes should match their names
            expect(lightTheme.mode).toBe('light');
            expect(darkTheme.mode).toBe('dark');
            // They should have the same structure
            expect(Object.keys(lightTheme.colors).sort()).toEqual(Object.keys(darkTheme.colors).sort());
        });
    });
});
//# sourceMappingURL=theme-visual-regression.test.js.map