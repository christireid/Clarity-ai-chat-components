/**
 * Clarity Chat - Neutral Theme Preset
 *
 * Minimal, monochrome design inspired by Linear.
 * Focus on content with subtle UI elements.
 */

import type { CompleteThemeConfig, ColorConfig } from '../theme-config'
import { createPreset } from './base'
import { darkShadows } from '../tokens/shadows'

/**
 * Neutral Light Colors
 * Monochrome palette with pure black accents
 */
const neutralLightColors: ColorConfig = {
  // Base - Pure white with near-black text
  background: '0 0% 100%',
  foreground: '0 0% 9%',

  // Surfaces - Very subtle grays
  card: '0 0% 100%',
  cardForeground: '0 0% 9%',
  popover: '0 0% 100%',
  popoverForeground: '0 0% 9%',

  // Brand - Monochrome
  primary: '0 0% 9%',
  primaryForeground: '0 0% 100%',
  secondary: '0 0% 96%',
  secondaryForeground: '0 0% 9%',
  accent: '0 0% 96%',
  accentForeground: '0 0% 9%',

  // State colors - Subtle, desaturated
  destructive: '0 72% 51%',
  destructiveForeground: '0 0% 100%',
  success: '142 71% 45%',
  successForeground: '0 0% 100%',
  warning: '38 92% 50%',
  warningForeground: '0 0% 9%',
  info: '199 89% 48%',
  infoForeground: '0 0% 100%',

  // UI elements - Minimal
  muted: '0 0% 96%',
  mutedForeground: '0 0% 45%',
  border: '0 0% 90%',
  input: '0 0% 90%',
  ring: '0 0% 9%',
}

/**
 * Neutral Dark Colors
 * True dark with white accents, Linear-style
 */
const neutralDarkColors: ColorConfig = {
  // Base - Near black with white text
  background: '0 0% 7%',
  foreground: '0 0% 95%',

  // Surfaces - Subtle elevation
  card: '0 0% 10%',
  cardForeground: '0 0% 95%',
  popover: '0 0% 10%',
  popoverForeground: '0 0% 95%',

  // Brand - Inverted monochrome
  primary: '0 0% 95%',
  primaryForeground: '0 0% 9%',
  secondary: '0 0% 15%',
  secondaryForeground: '0 0% 95%',
  accent: '0 0% 15%',
  accentForeground: '0 0% 95%',

  // State colors
  destructive: '0 62% 30%',
  destructiveForeground: '0 0% 95%',
  success: '142 71% 45%',
  successForeground: '0 0% 9%',
  warning: '38 92% 50%',
  warningForeground: '0 0% 9%',
  info: '199 89% 48%',
  infoForeground: '0 0% 9%',

  // UI elements
  muted: '0 0% 15%',
  mutedForeground: '0 0% 60%',
  border: '0 0% 20%',
  input: '0 0% 15%',
  ring: '0 0% 95%',
}

/**
 * Neutral Light Theme
 * Minimalist design with no color distractions
 */
export const neutralLightTheme: CompleteThemeConfig = createPreset(
  'neutral',
  'light',
  neutralLightColors,
  {
    borders: {
      width: {
        thin: '1px',
        normal: '1px', // Thinner borders for minimal look
        thick: '2px',
      },
      radius: {
        none: '0',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.625rem',
        '2xl': '0.75rem',
        full: '9999px',
      },
    },
  }
)

/**
 * Neutral Dark Theme
 * True dark mode, easy on the eyes
 */
export const neutralDarkTheme: CompleteThemeConfig = createPreset(
  'neutral-dark',
  'dark',
  neutralDarkColors,
  {
    shadows: darkShadows,
    borders: {
      width: {
        thin: '1px',
        normal: '1px',
        thick: '2px',
      },
      radius: {
        none: '0',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.625rem',
        '2xl': '0.75rem',
        full: '9999px',
      },
    },
  }
)

/**
 * Theme metadata
 */
export const neutralThemeMetadata = {
  light: {
    name: 'neutral',
    displayName: 'Neutral',
    description: 'Minimal, monochrome design inspired by Linear',
    preview: {
      primaryColor: '#171717',
      secondaryColor: '#f5f5f5',
      backgroundColor: '#ffffff',
    },
  },
  dark: {
    name: 'neutral-dark',
    displayName: 'Neutral Dark',
    description: 'True dark mode with white accents',
    preview: {
      primaryColor: '#f5f5f5',
      secondaryColor: '#262626',
      backgroundColor: '#0a0a0a',
    },
  },
}
