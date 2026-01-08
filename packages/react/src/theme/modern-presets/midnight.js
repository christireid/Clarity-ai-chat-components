/**
 * Clarity Chat - Midnight Theme Preset
 *
 * A deep, mysterious purple night theme.
 * Perfect for creative, immersive experiences.
 * WCAG AA compliant.
 */
import { createPreset } from './base';
import { darkShadows } from '../tokens/shadows';
/**
 * Midnight Light Colors
 * Primary: Deep purple (#7c3aed)
 * Accent: Violet highlights
 */
const midnightLightColors = {
    // Base - soft lavender background
    background: '270 50% 99%',
    foreground: '270 25% 12%',
    // Surfaces - subtle purple tints
    card: '270 40% 98%',
    cardForeground: '270 25% 12%',
    popover: '270 50% 99%',
    popoverForeground: '270 25% 12%',
    // Brand - deep purple
    primary: '262 83% 58%',
    primaryForeground: '0 0% 100%',
    secondary: '270 25% 93%',
    secondaryForeground: '270 25% 18%',
    accent: '280 68% 60%',
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
    muted: '270 18% 94%',
    mutedForeground: '270 10% 42%',
    border: '270 18% 86%',
    input: '270 18% 88%',
    ring: '262 83% 58%',
    // Extended surfaces
    surfaceMuted: '270 18% 95%',
    surfaceElevated: '270 40% 98%',
    surfaceOverlay: '270 50% 99%',
};
/**
 * Midnight Dark Colors
 * Deep night sky with luminous purple accents
 */
const midnightDarkColors = {
    // Base - deep night
    background: '270 45% 5%',
    foreground: '270 20% 95%',
    // Surfaces
    card: '270 40% 9%',
    cardForeground: '270 20% 95%',
    popover: '270 40% 9%',
    popoverForeground: '270 20% 95%',
    // Brand - luminous purple
    primary: '262 83% 68%',
    primaryForeground: '270 45% 5%',
    secondary: '270 30% 16%',
    secondaryForeground: '270 20% 95%',
    accent: '280 68% 70%',
    accentForeground: '270 45% 5%',
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
    muted: '270 30% 13%',
    mutedForeground: '270 12% 62%',
    border: '270 30% 20%',
    input: '270 30% 13%',
    ring: '262 83% 68%',
    // Extended surfaces
    surfaceMuted: '270 30% 10%',
    surfaceElevated: '270 40% 12%',
    surfaceOverlay: '270 45% 4%',
};
export const midnightLightTheme = createPreset('midnight', 'light', midnightLightColors);
export const midnightDarkTheme = createPreset('midnight-dark', 'dark', midnightDarkColors, { shadows: darkShadows });
export const midnightThemeMetadata = {
    light: {
        name: 'midnight',
        displayName: 'Midnight',
        description: 'Deep purple theme for immersive experiences (WCAG AA)',
        preview: {
            primaryColor: '#7c3aed',
            secondaryColor: '#ede9fe',
            backgroundColor: '#fcfbff',
        },
    },
    dark: {
        name: 'midnight-dark',
        displayName: 'Midnight Dark',
        description: 'Deep night sky with luminous purple accents (WCAG AA)',
        preview: {
            primaryColor: '#a78bfa',
            secondaryColor: '#2e1065',
            backgroundColor: '#0d0712',
        },
    },
};
//# sourceMappingURL=midnight.js.map