/**
 * Clarity Chat - Slate Theme Preset
 *
 * A sophisticated, professional gray theme.
 * Perfect for enterprise and business applications.
 * WCAG AA compliant.
 */

import type { CompleteThemeConfig, ColorConfig } from '../theme-config'
import { createPreset } from './base'
import { darkShadows } from '../tokens/shadows'

/**
 * Slate Light Colors
 * Primary: Slate blue (#475569)
 * Sophisticated grayscale with subtle blue undertones
 */
const slateLightColors: ColorConfig = {
  // Base - clean slate
  background: '210 20% 99%',
  foreground: '215 25% 15%',

  // Surfaces - subtle cool grays
  card: '210 15% 98%',
  cardForeground: '215 25% 15%',
  popover: '210 20% 99%',
  popoverForeground: '215 25% 15%',

  // Brand - slate blue
  primary: '215 16% 37%',
  primaryForeground: '0 0% 100%',
  secondary: '210 15% 93%',
  secondaryForeground: '215 25% 18%',
  accent: '215 20% 50%',
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
  muted: '210 15% 94%',
  mutedForeground: '215 12% 45%',
  border: '210 15% 85%',
  input: '210 15% 87%',
  ring: '215 16% 37%',

  // Extended surfaces
  surfaceMuted: '210 15% 95%',
  surfaceElevated: '210 15% 98%',
  surfaceOverlay: '210 20% 99%',
}

/**
 * Slate Dark Colors
 * Deep slate with refined gray accents
 */
const slateDarkColors: ColorConfig = {
  // Base - deep slate
  background: '215 28% 9%',
  foreground: '210 20% 96%',

  // Surfaces
  card: '215 25% 12%',
  cardForeground: '210 20% 96%',
  popover: '215 25% 12%',
  popoverForeground: '210 20% 96%',

  // Brand - bright slate
  primary: '215 20% 65%',
  primaryForeground: '215 28% 9%',
  secondary: '215 20% 18%',
  secondaryForeground: '210 20% 96%',
  accent: '215 25% 55%',
  accentForeground: '215 28% 9%',

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
  muted: '215 20% 15%',
  mutedForeground: '215 12% 60%',
  border: '215 20% 22%',
  input: '215 20% 15%',
  ring: '215 20% 65%',

  // Extended surfaces
  surfaceMuted: '215 20% 12%',
  surfaceElevated: '215 25% 14%',
  surfaceOverlay: '215 28% 7%',
}

export const slateLightTheme: CompleteThemeConfig = createPreset(
  'slate',
  'light',
  slateLightColors
)

export const slateDarkTheme: CompleteThemeConfig = createPreset(
  'slate-dark',
  'dark',
  slateDarkColors,
  { shadows: darkShadows }
)

export const slateThemeMetadata = {
  light: {
    name: 'slate',
    displayName: 'Slate',
    description: 'Sophisticated professional gray theme (WCAG AA)',
    preview: {
      primaryColor: '#475569',
      secondaryColor: '#e2e8f0',
      backgroundColor: '#fcfdfe',
    },
  },
  dark: {
    name: 'slate-dark',
    displayName: 'Slate Dark',
    description: 'Deep slate with refined gray accents (WCAG AA)',
    preview: {
      primaryColor: '#94a3b8',
      secondaryColor: '#1e293b',
      backgroundColor: '#0f172a',
    },
  },
}
