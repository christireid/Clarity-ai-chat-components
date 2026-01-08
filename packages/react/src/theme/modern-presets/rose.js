/**
 * Clarity Chat - Rose Theme Preset
 *
 * An elegant, sophisticated pink-rose theme.
 * Perfect for creative and lifestyle applications.
 * WCAG AA compliant.
 */
import { createPreset } from './base';
import { darkShadows } from '../tokens/shadows';
/**
 * Rose Light Colors
 * Primary: Rose pink (#e11d48)
 * Accent: Soft coral
 */
const roseLightColors = {
    // Base - soft blush background
    background: '350 100% 99%',
    foreground: '350 20% 14%',
    // Surfaces - subtle rose tints
    card: '350 50% 98%',
    cardForeground: '350 20% 14%',
    popover: '350 100% 99%',
    popoverForeground: '350 20% 14%',
    // Brand - rose pink
    primary: '347 77% 50%',
    primaryForeground: '0 0% 100%',
    secondary: '350 30% 93%',
    secondaryForeground: '350 20% 18%',
    accent: '12 76% 61%',
    accentForeground: '0 0% 100%',
    // State colors
    destructive: '0 84% 50%',
    destructiveForeground: '0 0% 100%',
    success: '142 71% 38%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '22 92% 10%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    // UI elements
    muted: '350 20% 94%',
    mutedForeground: '350 10% 42%',
    border: '350 20% 86%',
    input: '350 20% 88%',
    ring: '347 77% 50%',
    // Extended surfaces
    surfaceMuted: '350 20% 95%',
    surfaceElevated: '350 50% 98%',
    surfaceOverlay: '350 100% 99%',
};
/**
 * Rose Dark Colors
 * Deep burgundy with vibrant rose accents
 */
const roseDarkColors = {
    // Base - deep rose
    background: '350 35% 8%',
    foreground: '350 30% 95%',
    // Surfaces
    card: '350 30% 12%',
    cardForeground: '350 30% 95%',
    popover: '350 30% 12%',
    popoverForeground: '350 30% 95%',
    // Brand - vibrant rose
    primary: '347 77% 60%',
    primaryForeground: '350 35% 8%',
    secondary: '350 25% 18%',
    secondaryForeground: '350 30% 95%',
    accent: '12 76% 68%',
    accentForeground: '350 35% 8%',
    // State colors
    destructive: '0 72% 55%',
    destructiveForeground: '0 0% 100%',
    success: '142 71% 50%',
    successForeground: '142 71% 10%',
    warning: '38 92% 55%',
    warningForeground: '38 92% 10%',
    info: '199 89% 58%',
    infoForeground: '199 89% 10%',
    // UI elements
    muted: '350 25% 15%',
    mutedForeground: '350 15% 62%',
    border: '350 25% 22%',
    input: '350 25% 15%',
    ring: '347 77% 60%',
    // Extended surfaces
    surfaceMuted: '350 25% 12%',
    surfaceElevated: '350 30% 14%',
    surfaceOverlay: '350 35% 6%',
};
export const roseLightTheme = createPreset('rose', 'light', roseLightColors);
export const roseDarkTheme = createPreset('rose-dark', 'dark', roseDarkColors, { shadows: darkShadows });
export const roseThemeMetadata = {
    light: {
        name: 'rose',
        displayName: 'Rose',
        description: 'Elegant pink-rose theme for creative applications (WCAG AA)',
        preview: {
            primaryColor: '#e11d48',
            secondaryColor: '#fce7f3',
            backgroundColor: '#fffbfc',
        },
    },
    dark: {
        name: 'rose-dark',
        displayName: 'Rose Dark',
        description: 'Deep burgundy with vibrant rose accents (WCAG AA)',
        preview: {
            primaryColor: '#fb7185',
            secondaryColor: '#4c0519',
            backgroundColor: '#1a0a10',
        },
    },
};
//# sourceMappingURL=rose.js.map