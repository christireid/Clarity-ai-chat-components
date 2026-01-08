import { describe, it, expect } from 'vitest';
import { modernThemes, modernThemeMetadata, getModernThemeNames, getAllModernThemes, isValidModernThemeName, getModernDarkVariant, getModernLightVariant, } from '../modern-presets';
describe('modern-presets', () => {
    describe('modernThemes', () => {
        it('should have 8 theme presets', () => {
            expect(Object.keys(modernThemes)).toHaveLength(8);
        });
        it('should have light and dark variants for each theme family', () => {
            expect(modernThemes['default']).toBeDefined();
            expect(modernThemes['default-dark']).toBeDefined();
            expect(modernThemes['neutral']).toBeDefined();
            expect(modernThemes['neutral-dark']).toBeDefined();
            expect(modernThemes['vibrant']).toBeDefined();
            expect(modernThemes['vibrant-dark']).toBeDefined();
            expect(modernThemes['high-contrast']).toBeDefined();
            expect(modernThemes['high-contrast-dark']).toBeDefined();
        });
        it('should have correct mode for each theme', () => {
            expect(modernThemes['default'].mode).toBe('light');
            expect(modernThemes['default-dark'].mode).toBe('dark');
            expect(modernThemes['neutral'].mode).toBe('light');
            expect(modernThemes['neutral-dark'].mode).toBe('dark');
        });
        it('should have all required color properties', () => {
            const theme = modernThemes['default'];
            expect(theme.colors).toHaveProperty('primary');
            expect(theme.colors).toHaveProperty('primaryForeground');
            expect(theme.colors).toHaveProperty('background');
            expect(theme.colors).toHaveProperty('foreground');
            expect(theme.colors).toHaveProperty('border');
            expect(theme.colors).toHaveProperty('destructive');
            expect(theme.colors).toHaveProperty('success');
        });
    });
    describe('modernThemeMetadata', () => {
        it('should have metadata for all themes', () => {
            const names = Object.keys(modernThemes);
            names.forEach((name) => {
                expect(modernThemeMetadata[name]).toBeDefined();
            });
        });
        it('should have required metadata properties', () => {
            const metadata = modernThemeMetadata['default'];
            expect(metadata).toHaveProperty('name');
            expect(metadata).toHaveProperty('displayName');
            expect(metadata).toHaveProperty('description');
            expect(metadata).toHaveProperty('preview');
        });
        it('should have preview colors', () => {
            const metadata = modernThemeMetadata['default'];
            expect(metadata.preview).toHaveProperty('primaryColor');
            expect(metadata.preview).toHaveProperty('backgroundColor');
        });
    });
    describe('getModernThemeNames', () => {
        it('should return all theme names', () => {
            const names = getModernThemeNames();
            expect(names).toContain('default');
            expect(names).toContain('default-dark');
            expect(names).toContain('neutral');
            expect(names).toContain('vibrant');
            expect(names).toContain('high-contrast');
        });
    });
    describe('getAllModernThemes', () => {
        it('should return themes with metadata and config', () => {
            const themes = getAllModernThemes();
            expect(themes.length).toBe(8);
            themes.forEach((theme) => {
                expect(theme).toHaveProperty('name');
                expect(theme).toHaveProperty('metadata');
                expect(theme).toHaveProperty('config');
            });
        });
    });
    describe('isValidModernThemeName', () => {
        it('should return true for valid theme names', () => {
            expect(isValidModernThemeName('default')).toBe(true);
            expect(isValidModernThemeName('neutral-dark')).toBe(true);
            expect(isValidModernThemeName('high-contrast')).toBe(true);
        });
        it('should return false for invalid theme names', () => {
            expect(isValidModernThemeName('invalid')).toBe(false);
            expect(isValidModernThemeName('')).toBe(false);
            expect(isValidModernThemeName('default-light')).toBe(false);
        });
    });
    describe('getModernDarkVariant', () => {
        it('should return dark variant for light themes', () => {
            expect(getModernDarkVariant('default')).toBe('default-dark');
            expect(getModernDarkVariant('neutral')).toBe('neutral-dark');
            expect(getModernDarkVariant('vibrant')).toBe('vibrant-dark');
        });
        it('should return null for dark themes', () => {
            expect(getModernDarkVariant('default-dark')).toBeNull();
            expect(getModernDarkVariant('neutral-dark')).toBeNull();
        });
    });
    describe('getModernLightVariant', () => {
        it('should return light variant for dark themes', () => {
            expect(getModernLightVariant('default-dark')).toBe('default');
            expect(getModernLightVariant('neutral-dark')).toBe('neutral');
            expect(getModernLightVariant('vibrant-dark')).toBe('vibrant');
        });
        it('should return null for light themes', () => {
            expect(getModernLightVariant('default')).toBeNull();
            expect(getModernLightVariant('neutral')).toBeNull();
        });
    });
});
//# sourceMappingURL=modern-presets.test.js.map