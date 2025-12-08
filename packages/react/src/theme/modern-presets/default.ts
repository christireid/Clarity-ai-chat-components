/**
 * Clarity Chat - Default Theme Preset
 *
 * Clean, professional theme with indigo accents.
 * Designed for optimal readability and accessibility (WCAG AA).
 */

import type { CompleteThemeConfig } from '../theme-config'
import { createPreset } from './base'
import { lightColors, darkColors } from '../tokens/colors'
import { darkShadows } from '../tokens/shadows'

/**
 * Default Light Theme
 * Primary: Indigo (#6366f1)
 * Clean white backgrounds with subtle gray accents
 */
export const defaultLightTheme: CompleteThemeConfig = createPreset(
  'default',
  'light',
  lightColors
)

/**
 * Default Dark Theme
 * Matching dark variant with adjusted colors for contrast
 */
export const defaultDarkTheme: CompleteThemeConfig = createPreset(
  'default-dark',
  'dark',
  darkColors,
  {
    shadows: darkShadows,
  }
)

/**
 * Theme metadata for UI display
 */
export const defaultThemeMetadata = {
  light: {
    name: 'default',
    displayName: 'Default',
    description: 'Clean, professional theme with indigo accents (WCAG AA)',
    preview: {
      primaryColor: '#4f46e5', // 239 84% 56%
      secondaryColor: '#f4f4f5',
      backgroundColor: '#ffffff',
    },
  },
  dark: {
    name: 'default-dark',
    displayName: 'Default Dark',
    description: 'Sleek dark theme with indigo accents (WCAG AA)',
    preview: {
      primaryColor: '#818cf8', // 239 84% 70%
      secondaryColor: '#27272a',
      backgroundColor: '#18181b',
    },
  },
}
