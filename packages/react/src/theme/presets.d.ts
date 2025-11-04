/**
 * Built-in Theme Presets
 *
 * 10 beautiful, production-ready themes covering various styles:
 * - Default (Light/Dark)
 * - Minimal (Light/Dark)
 * - Vibrant (Light/Dark)
 * - Ocean
 * - Sunset
 * - Forest
 * - Corporate
 */
import type { CompleteThemeConfig, ThemeMetadata } from './theme-config';
export declare const defaultLightTheme: CompleteThemeConfig;
export declare const defaultDarkTheme: CompleteThemeConfig;
export declare const minimalLightTheme: CompleteThemeConfig;
export declare const minimalDarkTheme: CompleteThemeConfig;
export declare const vibrantLightTheme: CompleteThemeConfig;
export declare const vibrantDarkTheme: CompleteThemeConfig;
export declare const oceanTheme: CompleteThemeConfig;
export declare const sunsetTheme: CompleteThemeConfig;
export declare const forestTheme: CompleteThemeConfig;
export declare const corporateTheme: CompleteThemeConfig;
export declare const glassmorphismTheme: CompleteThemeConfig;
export declare const themes: {
    readonly 'default-light': CompleteThemeConfig;
    readonly 'default-dark': CompleteThemeConfig;
    readonly 'minimal-light': CompleteThemeConfig;
    readonly 'minimal-dark': CompleteThemeConfig;
    readonly 'vibrant-light': CompleteThemeConfig;
    readonly 'vibrant-dark': CompleteThemeConfig;
    readonly ocean: CompleteThemeConfig;
    readonly sunset: CompleteThemeConfig;
    readonly forest: CompleteThemeConfig;
    readonly corporate: CompleteThemeConfig;
    readonly glassmorphism: CompleteThemeConfig;
};
export type ThemePresetName = keyof typeof themes;
export declare const themeMetadata: Record<ThemePresetName, ThemeMetadata>;
//# sourceMappingURL=presets.d.ts.map