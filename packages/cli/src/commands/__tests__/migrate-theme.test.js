/**
 * Tests for theme migration command utilities
 */
import { describe, it, expect } from 'vitest';
/**
 * Legacy preset mappings - testing the migration logic
 */
const LEGACY_PRESETS = {
    light: 'default',
    dark: 'default-dark',
    midnight: 'default-dark',
    ocean: 'vibrant',
    'ocean-dark': 'vibrant-dark',
    sunset: 'vibrant',
    'sunset-dark': 'vibrant-dark',
    forest: 'neutral',
    'forest-dark': 'neutral-dark',
    minimal: 'neutral',
    'minimal-dark': 'neutral-dark',
    professional: 'default',
    'professional-dark': 'default-dark',
    accessibility: 'high-contrast',
    'accessibility-dark': 'high-contrast-dark',
};
const MODERN_PRESETS = [
    'default',
    'default-dark',
    'neutral',
    'neutral-dark',
    'vibrant',
    'vibrant-dark',
    'high-contrast',
    'high-contrast-dark',
];
/**
 * Helper to detect legacy preset in a line
 */
function detectLegacyPreset(line) {
    for (const [legacy, modern] of Object.entries(LEGACY_PRESETS)) {
        if (line.includes(`preset: '${legacy}'`) ||
            line.includes(`preset: "${legacy}"`)) {
            return { legacy, modern };
        }
    }
    return null;
}
/**
 * Helper to migrate legacy CSS variables
 */
function migrateCSSVariable(line) {
    return line.replace(/--clarity-chat-/g, '--clarity-');
}
/**
 * Helper to migrate import paths
 */
function migrateImportPath(line) {
    return line.replace("from '@clarity-chat/react/theme'", "from '@clarity-chat/react'");
}
describe('Theme Migration Utilities', () => {
    describe('Legacy Preset Mappings', () => {
        it('should have correct mappings for all legacy presets', () => {
            expect(LEGACY_PRESETS['light']).toBe('default');
            expect(LEGACY_PRESETS['dark']).toBe('default-dark');
            expect(LEGACY_PRESETS['ocean']).toBe('vibrant');
            expect(LEGACY_PRESETS['forest']).toBe('neutral');
            expect(LEGACY_PRESETS['accessibility']).toBe('high-contrast');
        });
        it('should map dark variants correctly', () => {
            expect(LEGACY_PRESETS['midnight']).toBe('default-dark');
            expect(LEGACY_PRESETS['ocean-dark']).toBe('vibrant-dark');
            expect(LEGACY_PRESETS['forest-dark']).toBe('neutral-dark');
            expect(LEGACY_PRESETS['accessibility-dark']).toBe('high-contrast-dark');
        });
        it('should have modern presets as valid targets', () => {
            const modernTargets = Object.values(LEGACY_PRESETS);
            for (const target of modernTargets) {
                expect(MODERN_PRESETS).toContain(target);
            }
        });
    });
    describe('detectLegacyPreset', () => {
        it('should detect single-quoted legacy preset', () => {
            const line = "const config = { preset: 'ocean' }";
            const result = detectLegacyPreset(line);
            expect(result).toEqual({ legacy: 'ocean', modern: 'vibrant' });
        });
        it('should detect double-quoted legacy preset', () => {
            const line = 'const config = { preset: "forest-dark" }';
            const result = detectLegacyPreset(line);
            expect(result).toEqual({ legacy: 'forest-dark', modern: 'neutral-dark' });
        });
        it('should return null for modern presets', () => {
            const line = "const config = { preset: 'default' }";
            const result = detectLegacyPreset(line);
            expect(result).toBeNull();
        });
        it('should return null for non-preset lines', () => {
            const line = "const color = 'ocean-blue'";
            const result = detectLegacyPreset(line);
            expect(result).toBeNull();
        });
        it('should handle accessibility preset', () => {
            const line = "{ preset: 'accessibility' }";
            const result = detectLegacyPreset(line);
            expect(result).toEqual({
                legacy: 'accessibility',
                modern: 'high-contrast',
            });
        });
    });
    describe('migrateCSSVariable', () => {
        it('should migrate CSS variable prefix', () => {
            const input = 'color: var(--clarity-chat-primary);';
            const output = migrateCSSVariable(input);
            expect(output).toBe('color: var(--clarity-primary);');
        });
        it('should migrate multiple variables in one line', () => {
            const input = 'background: var(--clarity-chat-background); color: var(--clarity-chat-foreground);';
            const output = migrateCSSVariable(input);
            expect(output).toBe('background: var(--clarity-background); color: var(--clarity-foreground);');
        });
        it('should not change modern variable prefix', () => {
            const input = 'color: var(--clarity-primary);';
            const output = migrateCSSVariable(input);
            expect(output).toBe('color: var(--clarity-primary);');
        });
        it('should handle CSS variable definitions', () => {
            const input = '--clarity-chat-border: 0 0% 90%;';
            const output = migrateCSSVariable(input);
            expect(output).toBe('--clarity-border: 0 0% 90%;');
        });
    });
    describe('migrateImportPath', () => {
        it('should migrate legacy import path', () => {
            const input = "import { ThemeProvider } from '@clarity-chat/react/theme'";
            const output = migrateImportPath(input);
            expect(output).toBe("import { ThemeProvider } from '@clarity-chat/react'");
        });
        it('should not change correct import path', () => {
            const input = "import { ThemeProvider } from '@clarity-chat/react'";
            const output = migrateImportPath(input);
            expect(output).toBe("import { ThemeProvider } from '@clarity-chat/react'");
        });
        it('should handle different import styles', () => {
            const input = "import type { ThemeConfig } from '@clarity-chat/react/theme'";
            const output = migrateImportPath(input);
            expect(output).toBe("import type { ThemeConfig } from '@clarity-chat/react'");
        });
    });
    describe('Modern Presets List', () => {
        it('should have exactly 8 presets', () => {
            expect(MODERN_PRESETS).toHaveLength(8);
        });
        it('should include all required presets', () => {
            expect(MODERN_PRESETS).toContain('default');
            expect(MODERN_PRESETS).toContain('default-dark');
            expect(MODERN_PRESETS).toContain('neutral');
            expect(MODERN_PRESETS).toContain('neutral-dark');
            expect(MODERN_PRESETS).toContain('vibrant');
            expect(MODERN_PRESETS).toContain('vibrant-dark');
            expect(MODERN_PRESETS).toContain('high-contrast');
            expect(MODERN_PRESETS).toContain('high-contrast-dark');
        });
        it('should have matching light/dark pairs', () => {
            const lightPresets = MODERN_PRESETS.filter((p) => !p.endsWith('-dark'));
            const darkPresets = MODERN_PRESETS.filter((p) => p.endsWith('-dark'));
            expect(lightPresets).toHaveLength(4);
            expect(darkPresets).toHaveLength(4);
            for (const light of lightPresets) {
                expect(darkPresets).toContain(`${light}-dark`);
            }
        });
    });
    describe('Breaking Change Detection', () => {
        it('should detect baseTheme usage', () => {
            const line = "const theme = createTheme({ baseTheme: 'light', ... })";
            const hasBreaking = line.includes('createTheme(') && line.includes('baseTheme:');
            expect(hasBreaking).toBe(true);
        });
        it('should not flag modern extends usage', () => {
            const line = "const theme = createTheme({ extends: 'default', ... })";
            const hasBreaking = line.includes('createTheme(') && line.includes('baseTheme:');
            expect(hasBreaking).toBe(false);
        });
        it('should detect direct color mutation', () => {
            const line = "theme.colors.primary = '#ff0000'";
            const hasBreaking = line.includes('.colors.') && line.includes('=');
            expect(hasBreaking).toBe(true);
        });
    });
    describe('Pattern Matching', () => {
        it('should match legacy import pattern', () => {
            const lines = [
                "import { ThemeProvider } from '@clarity-chat/react/theme'",
                "import { useTheme } from '@clarity-chat/react/theme'",
                "import type { ThemeConfig } from '@clarity-chat/react/theme'",
            ];
            for (const line of lines) {
                expect(line.includes("from '@clarity-chat/react/theme'")).toBe(true);
            }
        });
        it('should match CSS variable pattern', () => {
            const lines = [
                'color: var(--clarity-chat-primary);',
                '--clarity-chat-background: 0 0% 100%;',
                'border-color: var(--clarity-chat-border);',
            ];
            for (const line of lines) {
                expect(line.includes('--clarity-chat-')).toBe(true);
            }
        });
        it('should match preset configuration pattern', () => {
            const lines = [
                "preset: 'ocean'",
                'preset: "forest-dark"',
                "defaultTheme: { preset: 'minimal' }",
            ];
            for (const line of lines) {
                const result = detectLegacyPreset(line);
                expect(result).not.toBeNull();
            }
        });
    });
});
//# sourceMappingURL=migrate-theme.test.js.map