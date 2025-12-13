/**
 * Clarity Chat - Emerald Theme Preset
 *
 * A rich, luxurious green theme inspired by precious emeralds.
 * Perfect for finance, success, and premium applications.
 * WCAG AA compliant.
 */

import type { CompleteThemeConfig, ColorConfig } from '../theme-config'
import { createPreset } from './base'
import { darkShadows } from '../tokens/shadows'

/**
 * Emerald Light Colors
 * Primary: Rich emerald (#059669)
 * Accent: Teal highlights
 */
const emeraldLightColors: ColorConfig = {
  // Base - crisp with emerald undertone
  background: '160 40% 99%',
  foreground: '166 30% 12%',

  // Surfaces - subtle emerald tints
  card: '160 30% 98%',
  cardForeground: '166 30% 12%',
  popover: '160 40% 99%',
  popoverForeground: '166 30% 12%',

  // Brand - rich emerald
  primary: '160 84% 39%',
  primaryForeground: '0 0% 100%',
  secondary: '160 20% 93%',
  secondaryForeground: '166 30% 16%',
  accent: '174 72% 42%',
  accentForeground: '0 0% 100%',

  // State colors
  destructive: '0 84% 50%',
  destructiveForeground: '0 0% 100%',
  success: '160 84% 39%',
  successForeground: '0 0% 100%',
  warning: '38 92% 50%',
  warningForeground: '22 92% 10%',
  info: '199 89% 48%',
  infoForeground: '0 0% 100%',

  // UI elements
  muted: '160 15% 94%',
  mutedForeground: '166 12% 42%',
  border: '160 15% 86%',
  input: '160 15% 88%',
  ring: '160 84% 39%',

  // Extended surfaces
  surfaceMuted: '160 15% 95%',
  surfaceElevated: '160 30% 98%',
  surfaceOverlay: '160 40% 99%',
}

/**
 * Emerald Dark Colors
 * Deep jade with luminous emerald accents
 */
const emeraldDarkColors: ColorConfig = {
  // Base - deep jade
  background: '166 40% 6%',
  foreground: '160 25% 95%',

  // Surfaces
  card: '166 35% 10%',
  cardForeground: '160 25% 95%',
  popover: '166 35% 10%',
  popoverForeground: '160 25% 95%',

  // Brand - luminous emerald
  primary: '160 84% 50%',
  primaryForeground: '166 40% 6%',
  secondary: '166 25% 16%',
  secondaryForeground: '160 25% 95%',
  accent: '174 72% 52%',
  accentForeground: '166 40% 6%',

  // State colors
  destructive: '0 72% 55%',
  destructiveForeground: '0 0% 100%',
  success: '160 84% 50%',
  successForeground: '166 84% 10%',
  warning: '38 92% 55%',
  warningForeground: '38 92% 10%',
  info: '199 89% 58%',
  infoForeground: '199 89% 10%',

  // UI elements
  muted: '166 25% 13%',
  mutedForeground: '160 15% 62%',
  border: '166 25% 20%',
  input: '166 25% 13%',
  ring: '160 84% 50%',

  // Extended surfaces
  surfaceMuted: '166 25% 10%',
  surfaceElevated: '166 35% 12%',
  surfaceOverlay: '166 40% 5%',
}

export const emeraldLightTheme: CompleteThemeConfig = createPreset(
  'emerald',
  'light',
  emeraldLightColors
)

export const emeraldDarkTheme: CompleteThemeConfig = createPreset(
  'emerald-dark',
  'dark',
  emeraldDarkColors,
  { shadows: darkShadows }
)

export const emeraldThemeMetadata = {
  light: {
    name: 'emerald',
    displayName: 'Emerald',
    description: 'Rich, luxurious green theme for premium apps (WCAG AA)',
    preview: {
      primaryColor: '#059669',
      secondaryColor: '#d1fae5',
      backgroundColor: '#f9fefc',
    },
  },
  dark: {
    name: 'emerald-dark',
    displayName: 'Emerald Dark',
    description: 'Deep jade with luminous emerald accents (WCAG AA)',
    preview: {
      primaryColor: '#34d399',
      secondaryColor: '#064e3b',
      backgroundColor: '#0a1a14',
    },
  },
}
