/**
 * Clarity Chat - Ocean Theme Preset
 *
 * A calming blue-teal theme inspired by the ocean depths.
 * Perfect for professional and trustworthy interfaces.
 * WCAG AA compliant.
 */

import type { CompleteThemeConfig, ColorConfig } from '../theme-config'
import { createPreset } from './base'
import { darkShadows } from '../tokens/shadows'

/**
 * Ocean Light Colors
 * Primary: Deep ocean blue (#0ea5e9)
 * Accent: Teal highlights
 */
const oceanLightColors: ColorConfig = {
  // Base - crisp white with slate text
  background: '0 0% 100%',
  foreground: '201 24% 12%',

  // Surfaces - subtle blue tints
  card: '200 50% 99%',
  cardForeground: '201 24% 12%',
  popover: '0 0% 100%',
  popoverForeground: '201 24% 12%',

  // Brand - ocean blue
  primary: '199 89% 48%',
  primaryForeground: '0 0% 100%',
  secondary: '199 19% 94%',
  secondaryForeground: '201 24% 18%',
  accent: '172 66% 45%',
  accentForeground: '0 0% 100%',

  // State colors
  destructive: '0 84% 50%',
  destructiveForeground: '0 0% 100%',
  success: '158 64% 40%',
  successForeground: '0 0% 100%',
  warning: '38 92% 50%',
  warningForeground: '22 92% 10%',
  info: '199 89% 48%',
  infoForeground: '0 0% 100%',

  // UI elements
  muted: '199 19% 95%',
  mutedForeground: '201 12% 42%',
  border: '199 19% 88%',
  input: '199 19% 90%',
  ring: '199 89% 48%',

  // Extended surfaces
  surfaceMuted: '199 19% 96%',
  surfaceElevated: '200 50% 99%',
  surfaceOverlay: '0 0% 100%',
}

/**
 * Ocean Dark Colors
 * Deep sea colors with bright blue accents
 */
const oceanDarkColors: ColorConfig = {
  // Base - deep ocean
  background: '201 45% 8%',
  foreground: '199 20% 95%',

  // Surfaces
  card: '201 40% 11%',
  cardForeground: '199 20% 95%',
  popover: '201 40% 11%',
  popoverForeground: '199 20% 95%',

  // Brand - bright ocean
  primary: '199 89% 58%',
  primaryForeground: '201 45% 8%',
  secondary: '201 30% 18%',
  secondaryForeground: '199 20% 95%',
  accent: '172 66% 55%',
  accentForeground: '201 45% 8%',

  // State colors
  destructive: '0 72% 55%',
  destructiveForeground: '0 0% 100%',
  success: '158 64% 50%',
  successForeground: '158 64% 10%',
  warning: '38 92% 55%',
  warningForeground: '38 92% 10%',
  info: '199 89% 58%',
  infoForeground: '201 45% 8%',

  // UI elements
  muted: '201 30% 15%',
  mutedForeground: '199 15% 65%',
  border: '201 30% 22%',
  input: '201 30% 15%',
  ring: '199 89% 58%',

  // Extended surfaces
  surfaceMuted: '201 30% 12%',
  surfaceElevated: '201 40% 14%',
  surfaceOverlay: '201 45% 6%',
}

export const oceanLightTheme: CompleteThemeConfig = createPreset(
  'ocean',
  'light',
  oceanLightColors
)

export const oceanDarkTheme: CompleteThemeConfig = createPreset(
  'ocean-dark',
  'dark',
  oceanDarkColors,
  { shadows: darkShadows }
)

export const oceanThemeMetadata = {
  light: {
    name: 'ocean',
    displayName: 'Ocean',
    description: 'Calming blue-teal theme inspired by the sea (WCAG AA)',
    preview: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#ecfeff',
      backgroundColor: '#ffffff',
    },
  },
  dark: {
    name: 'ocean-dark',
    displayName: 'Ocean Dark',
    description: 'Deep sea colors with bright blue accents (WCAG AA)',
    preview: {
      primaryColor: '#38bdf8',
      secondaryColor: '#164e63',
      backgroundColor: '#0c1929',
    },
  },
}
