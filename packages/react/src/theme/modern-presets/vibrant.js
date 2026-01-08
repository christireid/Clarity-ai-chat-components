/**
 * Clarity Chat - Vibrant Theme Preset
 *
 * Bold, colorful theme with purple/pink gradients.
 * Playful yet professional, great for creative applications.
 */
import { createPreset } from './base';
import { darkShadows } from '../tokens/shadows';
/**
 * Vibrant Light Colors
 * Purple primary with pink accents
 */
const vibrantLightColors = {
    // Base
    background: '0 0% 100%',
    foreground: '270 50% 11%',
    // Surfaces
    card: '0 0% 100%',
    cardForeground: '270 50% 11%',
    popover: '0 0% 100%',
    popoverForeground: '270 50% 11%',
    // Brand - Vibrant purple
    primary: '262 83% 58%',
    primaryForeground: '0 0% 100%',
    secondary: '280 80% 90%',
    secondaryForeground: '270 50% 11%',
    accent: '330 81% 60%', // Pink accent
    accentForeground: '0 0% 100%',
    // State colors
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    success: '142 71% 45%',
    successForeground: '0 0% 100%',
    warning: '38 92% 50%',
    warningForeground: '270 50% 11%',
    info: '199 89% 48%',
    infoForeground: '0 0% 100%',
    // UI elements
    muted: '270 30% 96%',
    mutedForeground: '270 20% 45%',
    border: '270 20% 90%',
    input: '270 20% 90%',
    ring: '262 83% 58%',
};
/**
 * Vibrant Dark Colors
 * Deep purple background with bright accents
 */
const vibrantDarkColors = {
    // Base - Deep purple-tinted black
    background: '270 50% 6%',
    foreground: '270 20% 95%',
    // Surfaces
    card: '270 40% 10%',
    cardForeground: '270 20% 95%',
    popover: '270 40% 10%',
    popoverForeground: '270 20% 95%',
    // Brand
    primary: '262 83% 68%',
    primaryForeground: '0 0% 100%',
    secondary: '270 30% 18%',
    secondaryForeground: '270 20% 95%',
    accent: '330 81% 65%',
    accentForeground: '0 0% 100%',
    // State colors
    destructive: '0 62% 30%',
    destructiveForeground: '270 20% 95%',
    success: '142 71% 45%',
    successForeground: '270 50% 6%',
    warning: '38 92% 50%',
    warningForeground: '270 50% 6%',
    info: '199 89% 48%',
    infoForeground: '270 50% 6%',
    // UI elements
    muted: '270 30% 18%',
    mutedForeground: '270 20% 60%',
    border: '270 30% 20%',
    input: '270 30% 15%',
    ring: '262 83% 68%',
};
/**
 * Vibrant Light Theme
 */
export const vibrantLightTheme = createPreset('vibrant', 'light', vibrantLightColors);
/**
 * Vibrant Dark Theme
 */
export const vibrantDarkTheme = createPreset('vibrant-dark', 'dark', vibrantDarkColors, {
    shadows: darkShadows,
});
/**
 * Theme metadata
 */
export const vibrantThemeMetadata = {
    light: {
        name: 'vibrant',
        displayName: 'Vibrant',
        description: 'Bold purple theme with pink accents',
        preview: {
            primaryColor: '#a855f7',
            secondaryColor: '#f5d0fe',
            backgroundColor: '#ffffff',
        },
    },
    dark: {
        name: 'vibrant-dark',
        displayName: 'Vibrant Dark',
        description: 'Deep purple dark theme with bright accents',
        preview: {
            primaryColor: '#c084fc',
            secondaryColor: '#3b2d4d',
            backgroundColor: '#0f0a14',
        },
    },
};
//# sourceMappingURL=vibrant.js.map