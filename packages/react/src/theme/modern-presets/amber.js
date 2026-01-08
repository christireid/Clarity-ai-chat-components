/**
 * Clarity Chat - Amber Theme Preset
 *
 * A warm, golden theme inspired by honey and amber.
 * Creates a cozy, inviting atmosphere.
 * WCAG AA compliant.
 */
import { createPreset } from './base';
import { darkShadows } from '../tokens/shadows';
/**
 * Amber Light Colors
 * Primary: Golden amber (#d97706)
 * Accent: Warm yellow highlights
 */
const amberLightColors = {
    // Base - warm cream
    background: '45 100% 99%',
    foreground: '28 20% 14%',
    // Surfaces - subtle amber tints
    card: '45 60% 98%',
    cardForeground: '28 20% 14%',
    popover: '45 100% 99%',
    popoverForeground: '28 20% 14%',
    // Brand - golden amber
    primary: '38 92% 50%',
    primaryForeground: '28 20% 10%',
    secondary: '45 35% 92%',
    secondaryForeground: '28 20% 18%',
    accent: '48 96% 53%',
    accentForeground: '28 20% 10%',
    // State colors
    destructive: '0 84% 50%',
    destructiveForeground: '0 0% 100%',
    success: '142 71% 38%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '28 92% 10%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    // UI elements
    muted: '45 25% 93%',
    mutedForeground: '28 10% 42%',
    border: '45 25% 85%',
    input: '45 25% 87%',
    ring: '38 92% 50%',
    // Extended surfaces
    surfaceMuted: '45 25% 94%',
    surfaceElevated: '45 60% 98%',
    surfaceOverlay: '45 100% 99%',
};
/**
 * Amber Dark Colors
 * Deep bronze with glowing amber accents
 */
const amberDarkColors = {
    // Base - deep bronze
    background: '28 30% 7%',
    foreground: '45 40% 95%',
    // Surfaces
    card: '28 25% 11%',
    cardForeground: '45 40% 95%',
    popover: '28 25% 11%',
    popoverForeground: '45 40% 95%',
    // Brand - glowing amber
    primary: '38 92% 55%',
    primaryForeground: '28 30% 7%',
    secondary: '28 20% 17%',
    secondaryForeground: '45 40% 95%',
    accent: '48 96% 58%',
    accentForeground: '28 30% 7%',
    // State colors
    destructive: '0 72% 55%',
    destructiveForeground: '0 0% 100%',
    success: '142 71% 50%',
    successForeground: '142 71% 10%',
    warning: '38 92% 55%',
    warningForeground: '28 92% 10%',
    info: '199 89% 58%',
    infoForeground: '199 89% 10%',
    // UI elements
    muted: '28 20% 14%',
    mutedForeground: '45 20% 60%',
    border: '28 20% 21%',
    input: '28 20% 14%',
    ring: '38 92% 55%',
    // Extended surfaces
    surfaceMuted: '28 20% 11%',
    surfaceElevated: '28 25% 13%',
    surfaceOverlay: '28 30% 5%',
};
export const amberLightTheme = createPreset('amber', 'light', amberLightColors);
export const amberDarkTheme = createPreset('amber-dark', 'dark', amberDarkColors, { shadows: darkShadows });
export const amberThemeMetadata = {
    light: {
        name: 'amber',
        displayName: 'Amber',
        description: 'Warm golden theme inspired by honey and amber (WCAG AA)',
        preview: {
            primaryColor: '#d97706',
            secondaryColor: '#fef3c7',
            backgroundColor: '#fffdf7',
        },
    },
    dark: {
        name: 'amber-dark',
        displayName: 'Amber Dark',
        description: 'Deep bronze with glowing amber accents (WCAG AA)',
        preview: {
            primaryColor: '#f59e0b',
            secondaryColor: '#451a03',
            backgroundColor: '#1a1308',
        },
    },
};
//# sourceMappingURL=amber.js.map