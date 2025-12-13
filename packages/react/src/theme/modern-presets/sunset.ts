/**
 * Clarity Chat - Sunset Theme Preset
 *
 * A warm, inviting theme inspired by golden sunsets.
 * Creates an energetic yet comfortable atmosphere.
 * WCAG AA compliant.
 */

import type { CompleteThemeConfig, ColorConfig } from '../theme-config'
import { createPreset } from './base'
import { darkShadows } from '../tokens/shadows'

/**
 * Sunset Light Colors
 * Primary: Warm orange (#f97316)
 * Accent: Golden amber
 */
const sunsetLightColors: ColorConfig = {
  // Base - warm cream with rich brown text
  background: '36 100% 99%',
  foreground: '20 14% 14%',

  // Surfaces - subtle warm tints
  card: '36 60% 98%',
  cardForeground: '20 14% 14%',
  popover: '36 100% 99%',
  popoverForeground: '20 14% 14%',

  // Brand - sunset orange
  primary: '25 95% 53%',
  primaryForeground: '0 0% 100%',
  secondary: '36 40% 93%',
  secondaryForeground: '20 14% 18%',
  accent: '38 92% 50%',
  accentForeground: '20 14% 10%',

  // State colors
  destructive: '0 84% 50%',
  destructiveForeground: '0 0% 100%',
  success: '142 71% 38%',
  successForeground: '0 0% 100%',
  warning: '38 92% 50%',
  warningForeground: '20 92% 10%',
  info: '199 89% 48%',
  infoForeground: '0 0% 100%',

  // UI elements
  muted: '36 30% 94%',
  mutedForeground: '20 8% 42%',
  border: '36 25% 86%',
  input: '36 25% 88%',
  ring: '25 95% 53%',

  // Extended surfaces
  surfaceMuted: '36 30% 95%',
  surfaceElevated: '36 60% 98%',
  surfaceOverlay: '36 100% 99%',
}

/**
 * Sunset Dark Colors
 * Rich amber depths with warm glowing accents
 */
const sunsetDarkColors: ColorConfig = {
  // Base - warm charcoal
  background: '20 20% 8%',
  foreground: '36 40% 95%',

  // Surfaces
  card: '20 18% 12%',
  cardForeground: '36 40% 95%',
  popover: '20 18% 12%',
  popoverForeground: '36 40% 95%',

  // Brand - glowing orange
  primary: '25 95% 60%',
  primaryForeground: '20 20% 8%',
  secondary: '20 15% 18%',
  secondaryForeground: '36 40% 95%',
  accent: '38 92% 58%',
  accentForeground: '20 20% 8%',

  // State colors
  destructive: '0 72% 55%',
  destructiveForeground: '0 0% 100%',
  success: '142 71% 50%',
  successForeground: '142 71% 10%',
  warning: '38 92% 58%',
  warningForeground: '20 92% 10%',
  info: '199 89% 58%',
  infoForeground: '199 89% 10%',

  // UI elements
  muted: '20 15% 15%',
  mutedForeground: '36 20% 62%',
  border: '20 15% 22%',
  input: '20 15% 15%',
  ring: '25 95% 60%',

  // Extended surfaces
  surfaceMuted: '20 15% 12%',
  surfaceElevated: '20 18% 14%',
  surfaceOverlay: '20 20% 6%',
}

export const sunsetLightTheme: CompleteThemeConfig = createPreset(
  'sunset',
  'light',
  sunsetLightColors
)

export const sunsetDarkTheme: CompleteThemeConfig = createPreset(
  'sunset-dark',
  'dark',
  sunsetDarkColors,
  { shadows: darkShadows }
)

export const sunsetThemeMetadata = {
  light: {
    name: 'sunset',
    displayName: 'Sunset',
    description: 'Warm, energetic orange theme with golden accents (WCAG AA)',
    preview: {
      primaryColor: '#f97316',
      secondaryColor: '#fef3c7',
      backgroundColor: '#fffbf5',
    },
  },
  dark: {
    name: 'sunset-dark',
    displayName: 'Sunset Dark',
    description: 'Rich amber depths with glowing orange accents (WCAG AA)',
    preview: {
      primaryColor: '#fb923c',
      secondaryColor: '#422006',
      backgroundColor: '#1a1410',
    },
  },
}
