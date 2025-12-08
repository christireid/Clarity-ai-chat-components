/**
 * Clarity Chat - Theme Presets
 *
 * Pre-built theme configurations for common use cases.
 * Each preset includes light and dark variants.
 */

import type { CompleteThemeConfig, ThemeMetadata } from '../theme-config'

// Base utilities
export { baseThemeConfig, createPreset } from './base'

// Individual presets
import {
  defaultLightTheme,
  defaultDarkTheme,
  defaultThemeMetadata,
} from './default'
export { defaultLightTheme, defaultDarkTheme, defaultThemeMetadata }

import {
  neutralLightTheme,
  neutralDarkTheme,
  neutralThemeMetadata,
} from './neutral'
export { neutralLightTheme, neutralDarkTheme, neutralThemeMetadata }

import {
  vibrantLightTheme,
  vibrantDarkTheme,
  vibrantThemeMetadata,
} from './vibrant'
export { vibrantLightTheme, vibrantDarkTheme, vibrantThemeMetadata }

import {
  highContrastLightTheme,
  highContrastDarkTheme,
  highContrastThemeMetadata,
} from './high-contrast'
export {
  highContrastLightTheme,
  highContrastDarkTheme,
  highContrastThemeMetadata,
}

/**
 * All available theme presets (new modern presets)
 */
export const modernThemes = {
  // Default theme
  default: defaultLightTheme,
  'default-dark': defaultDarkTheme,

  // Neutral/Minimal theme
  neutral: neutralLightTheme,
  'neutral-dark': neutralDarkTheme,

  // Vibrant theme
  vibrant: vibrantLightTheme,
  'vibrant-dark': vibrantDarkTheme,

  // High contrast (accessibility)
  'high-contrast': highContrastLightTheme,
  'high-contrast-dark': highContrastDarkTheme,
} as const

/**
 * Modern theme preset name type
 */
export type ModernThemePresetName = keyof typeof modernThemes

/**
 * Theme metadata for modern presets
 */
export const modernThemeMetadata: Record<ModernThemePresetName, ThemeMetadata> =
  {
    default: {
      name: 'default',
      displayName: 'Default',
      description: 'Clean, professional theme with indigo accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#6366f1',
        secondaryColor: '#f4f4f5',
        backgroundColor: '#ffffff',
      },
    },
    'default-dark': {
      name: 'default-dark',
      displayName: 'Default Dark',
      description: 'Sleek dark theme with indigo accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#818cf8',
        secondaryColor: '#27272a',
        backgroundColor: '#18181b',
      },
    },
    neutral: {
      name: 'neutral',
      displayName: 'Neutral',
      description: 'Minimal, monochrome design inspired by Linear',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#171717',
        secondaryColor: '#f5f5f5',
        backgroundColor: '#ffffff',
      },
    },
    'neutral-dark': {
      name: 'neutral-dark',
      displayName: 'Neutral Dark',
      description: 'True dark mode with white accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#f5f5f5',
        secondaryColor: '#262626',
        backgroundColor: '#0a0a0a',
      },
    },
    vibrant: {
      name: 'vibrant',
      displayName: 'Vibrant',
      description: 'Bold purple theme with pink accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#a855f7',
        secondaryColor: '#f5d0fe',
        backgroundColor: '#ffffff',
      },
    },
    'vibrant-dark': {
      name: 'vibrant-dark',
      displayName: 'Vibrant Dark',
      description: 'Deep purple dark theme with bright accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#c084fc',
        secondaryColor: '#3b2d4d',
        backgroundColor: '#0f0a14',
      },
    },
    'high-contrast': {
      name: 'high-contrast',
      displayName: 'High Contrast',
      description: 'WCAG AAA compliant, maximum accessibility',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#1d4ed8',
        secondaryColor: '#f0f0f0',
        backgroundColor: '#ffffff',
      },
    },
    'high-contrast-dark': {
      name: 'high-contrast-dark',
      displayName: 'High Contrast Dark',
      description: 'WCAG AAA compliant dark theme',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#93c5fd',
        secondaryColor: '#262626',
        backgroundColor: '#000000',
      },
    },
  }

/**
 * Get all modern theme names
 */
export function getModernThemeNames(): ModernThemePresetName[] {
  return Object.keys(modernThemes) as ModernThemePresetName[]
}

/**
 * Get all modern themes with metadata
 */
export function getAllModernThemes(): Array<{
  name: ModernThemePresetName
  metadata: ThemeMetadata
  config: CompleteThemeConfig
}> {
  return getModernThemeNames().map((name) => ({
    name,
    metadata: modernThemeMetadata[name],
    config: modernThemes[name],
  }))
}

/**
 * Check if a modern theme name is valid
 */
export function isValidModernThemeName(
  name: string
): name is ModernThemePresetName {
  return name in modernThemes
}

/**
 * Get the dark variant of a modern theme
 */
export function getModernDarkVariant(
  name: ModernThemePresetName
): ModernThemePresetName | null {
  if (name.endsWith('-dark')) return null
  const darkName = `${name}-dark` as ModernThemePresetName
  return darkName in modernThemes ? darkName : null
}

/**
 * Get the light variant of a modern theme
 */
export function getModernLightVariant(
  name: ModernThemePresetName
): ModernThemePresetName | null {
  if (!name.endsWith('-dark')) return null
  const lightName = name.replace('-dark', '') as ModernThemePresetName
  return lightName in modernThemes ? lightName : null
}
