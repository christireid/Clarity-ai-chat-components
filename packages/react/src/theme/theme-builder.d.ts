/**
 * Theme Builder Utilities
 *
 * Utilities for creating, customizing, and exporting themes
 */
import type { CompleteThemeConfig, PartialThemeConfig, ColorConfig, ExportableTheme, ThemeMetadata } from './theme-config';
import { type ThemePresetName } from './presets';
/**
 * Create a complete theme from a base theme and customizations
 */
export declare function createTheme(baseTheme: ThemePresetName | CompleteThemeConfig, customizations?: PartialThemeConfig): CompleteThemeConfig;
/**
 * Convert hex color to HSL string
 */
export declare function hexToHsl(hex: string): string;
/**
 * Convert HSL string to hex color
 */
export declare function hslToHex(hsl: string): string;
/**
 * Lighten or darken an HSL color
 */
export declare function adjustLightness(hsl: string, amount: number): string;
/**
 * Calculate contrast ratio between two HSL colors
 */
export declare function getContrastRatio(hsl1: string, hsl2: string): number;
/**
 * Check if contrast ratio meets WCAG AA or AAA standards
 */
export declare function checkContrast(foreground: string, background: string, level?: 'AA' | 'AAA', isLargeText?: boolean): {
    passes: boolean;
    ratio: number;
    required: number;
};
/**
 * Generate foreground color with sufficient contrast
 */
export declare function generateForegroundColor(background: string, targetRatio?: number): string;
/**
 * Generate a complete color palette from a primary color
 */
export declare function generatePalette(primaryColor: string): Partial<ColorConfig>;
/**
 * Apply theme to document root
 */
export declare function applyThemeToDocument(theme: CompleteThemeConfig): void;
/**
 * Export theme as JSON
 */
export declare function exportTheme(theme: CompleteThemeConfig, metadata?: Partial<ThemeMetadata>): ExportableTheme;
/**
 * Import theme from JSON
 */
export declare function importTheme(exported: ExportableTheme): CompleteThemeConfig;
/**
 * Get theme by name
 */
export declare function getTheme(name: ThemePresetName): CompleteThemeConfig;
/**
 * Get all available theme names
 */
export declare function getThemeNames(): ThemePresetName[];
/**
 * Get theme metadata
 */
export declare function getThemeMetadata(name: ThemePresetName): ThemeMetadata;
/**
 * Get all themes with metadata
 */
export declare function getAllThemes(): Array<{
    name: ThemePresetName;
    metadata: ThemeMetadata;
    config: CompleteThemeConfig;
}>;
/**
 * Create theme variants (light/dark) from a base theme
 */
export declare function createThemeVariants(baseTheme: CompleteThemeConfig): {
    light: CompleteThemeConfig;
    dark: CompleteThemeConfig;
};
/**
 * Validate theme configuration
 */
export declare function validateTheme(theme: CompleteThemeConfig): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
//# sourceMappingURL=theme-builder.d.ts.map