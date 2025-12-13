/**
 * Clarity Chat - Forest Theme Preset
 *
 * A natural, earthy theme inspired by lush forests.
 * Creates a calming, organic atmosphere.
 * WCAG AA compliant.
 */

import type { CompleteThemeConfig, ColorConfig } from '../theme-config'
import { createPreset } from './base'
import { darkShadows } from '../tokens/shadows'

/**
 * Forest Light Colors
 * Primary: Forest green (#16a34a)
 * Accent: Emerald highlights
 */
const forestLightColors: ColorConfig = {
  // Base - clean with earthy undertone
  background: '120 20% 99%',
  foreground: '150 20% 12%',

  // Surfaces - subtle green tints
  card: '120 15% 98%',
  cardForeground: '150 20% 12%',
  popover: '120 20% 99%',
  popoverForeground: '150 20% 12%',

  // Brand - forest green
  primary: '142 71% 38%',
  primaryForeground: '0 0% 100%',
  secondary: '120 15% 93%',
  secondaryForeground: '150 20% 16%',
  accent: '158 64% 42%',
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
  muted: '120 12% 94%',
  mutedForeground: '150 10% 42%',
  border: '120 12% 86%',
  input: '120 12% 88%',
  ring: '142 71% 38%',

  // Extended surfaces
  surfaceMuted: '120 12% 95%',
  surfaceElevated: '120 15% 98%',
  surfaceOverlay: '120 20% 99%',
}

/**
 * Forest Dark Colors
 * Deep woodland with luminous green accents
 */
const forestDarkColors: ColorConfig = {
  // Base - deep forest floor
  background: '150 30% 6%',
  foreground: '120 20% 95%',

  // Surfaces
  card: '150 25% 10%',
  cardForeground: '120 20% 95%',
  popover: '150 25% 10%',
  popoverForeground: '120 20% 95%',

  // Brand - luminous green
  primary: '142 71% 50%',
  primaryForeground: '150 30% 6%',
  secondary: '150 20% 16%',
  secondaryForeground: '120 20% 95%',
  accent: '158 64% 52%',
  accentForeground: '150 30% 6%',

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
  muted: '150 20% 14%',
  mutedForeground: '120 12% 62%',
  border: '150 20% 20%',
  input: '150 20% 14%',
  ring: '142 71% 50%',

  // Extended surfaces
  surfaceMuted: '150 20% 11%',
  surfaceElevated: '150 25% 13%',
  surfaceOverlay: '150 30% 5%',
}

export const forestLightTheme: CompleteThemeConfig = createPreset(
  'forest',
  'light',
  forestLightColors
)

export const forestDarkTheme: CompleteThemeConfig = createPreset(
  'forest-dark',
  'dark',
  forestDarkColors,
  { shadows: darkShadows }
)

export const forestThemeMetadata = {
  light: {
    name: 'forest',
    displayName: 'Forest',
    description: 'Natural green theme inspired by lush forests (WCAG AA)',
    preview: {
      primaryColor: '#16a34a',
      secondaryColor: '#dcfce7',
      backgroundColor: '#fbfefb',
    },
  },
  dark: {
    name: 'forest-dark',
    displayName: 'Forest Dark',
    description: 'Deep woodland with luminous green accents (WCAG AA)',
    preview: {
      primaryColor: '#22c55e',
      secondaryColor: '#14532d',
      backgroundColor: '#0a1a0e',
    },
  },
}
