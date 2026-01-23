/**
 * Clarity Chat - Theme Presets
 *
 * Consolidated theme system with exactly TWO built-in themes:
 * - light (default)
 * - dark
 *
 * For custom themes, use the customization API instead of creating new presets.
 * @see ../customization/index.ts
 */

import type { CompleteThemeConfig, ThemeMetadata } from '../theme-config'

// Base utilities
export { baseThemeConfig, createPreset } from './base'

// Default presets (light and dark only)
import {
  defaultLightTheme,
  defaultDarkTheme,
  defaultThemeMetadata,
} from './default'
export { defaultLightTheme, defaultDarkTheme, defaultThemeMetadata }

/**
 * Available theme presets (2 total: light and dark)
 */
export const modernThemes = {
  // Light theme (default)
  default: defaultLightTheme,
  light: defaultLightTheme,

  // Dark theme
  'default-dark': defaultDarkTheme,
  dark: defaultDarkTheme,
} as unknown as Record<string, CompleteThemeConfig>

/**
 * Modern theme preset name type
 */
export type ModernThemePresetName =
  | 'default'
  | 'default-dark'
  | 'light'
  | 'dark'

/**
 * Theme metadata for presets
 */
export const modernThemeMetadata: Record<string, ThemeMetadata> = {
  default: {
    name: 'default',
    displayName: 'Light',
    description: 'Clean, professional light theme',
    author: 'Clarity Chat',
    version: '3.0.0',
    preview: {
      primaryColor: '#6366f1',
      secondaryColor: '#f4f4f5',
      backgroundColor: '#ffffff',
    },
  },
  light: {
    name: 'light',
    displayName: 'Light',
    description: 'Clean, professional light theme',
    author: 'Clarity Chat',
    version: '3.0.0',
    preview: {
      primaryColor: '#6366f1',
      secondaryColor: '#f4f4f5',
      backgroundColor: '#ffffff',
    },
  },
  'default-dark': {
    name: 'default-dark',
    displayName: 'Dark',
    description: 'Sleek, modern dark theme',
    author: 'Clarity Chat',
    version: '3.0.0',
    preview: {
      primaryColor: '#818cf8',
      secondaryColor: '#27272a',
      backgroundColor: '#18181b',
    },
  },
  dark: {
    name: 'dark',
    displayName: 'Dark',
    description: 'Sleek, modern dark theme',
    author: 'Clarity Chat',
    version: '3.0.0',
    preview: {
      primaryColor: '#818cf8',
      secondaryColor: '#27272a',
      backgroundColor: '#18181b',
    },
  },
}

/**
 * Get all modern theme names
 */
export function getModernThemeNames(): ModernThemePresetName[] {
  return ['default', 'default-dark', 'light', 'dark']
}

/**
 * Get all modern themes with metadata
 */
export function getAllModernThemes(): Array<{
  name: ModernThemePresetName
  metadata: ThemeMetadata
  config: CompleteThemeConfig
}> {
  return [
    {
      name: 'default',
      metadata: modernThemeMetadata['default'],
      config: modernThemes['default'],
    },
    {
      name: 'default-dark',
      metadata: modernThemeMetadata['default-dark'],
      config: modernThemes['default-dark'],
    },
  ]
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
 * Get the dark variant of a theme
 */
export function getModernDarkVariant(
  name: ModernThemePresetName
): ModernThemePresetName | null {
  if (name === 'default' || name === 'light') return 'dark'
  return null
}

/**
 * Get the light variant of a theme
 */
export function getModernLightVariant(
  name: ModernThemePresetName
): ModernThemePresetName | null {
  if (name === 'default-dark' || name === 'dark') return 'light'
  return null
}

/**
 * @deprecated Use the customization API instead of theme categories.
 * Categories have been removed in favor of light/dark only.
 */
export function getThemesByCategory(): Record<string, string[]> {
  return {
    core: ['default', 'default-dark'],
  }
}

/**
 * Get light themes only
 */
export function getLightThemes(): ModernThemePresetName[] {
  return ['default', 'light']
}

/**
 * Get dark themes only
 */
export function getDarkThemes(): ModernThemePresetName[] {
  return ['default-dark', 'dark']
}

// ============================================================================
// Template-Specific Theme Aliases (All point to light or dark now)
// ============================================================================

/**
 * Code Editor Theme - uses dark for reduced eye strain
 */
export const codeEditorTheme = defaultDarkTheme

/**
 * Customer Support Theme - uses light for approachable feel
 */
export const supportChatTheme = defaultLightTheme

/**
 * AI Assistant Theme - uses light by default
 */
export const aiAssistantTheme = defaultLightTheme

/**
 * Developer Tools Theme - uses dark for terminal aesthetic
 */
export const devToolsTheme = defaultDarkTheme

/**
 * Corporate/Enterprise Theme - uses light for professionalism
 */
export const enterpriseTheme = defaultLightTheme

/**
 * Creative/Marketing Theme - uses light
 * @deprecated Customize colors via the customization API
 */
export const creativeTheme = defaultLightTheme

/**
 * Accessibility-First Theme - uses light with high contrast mode support
 * Enable high contrast via CSS media query @media (prefers-contrast: high)
 */
export const accessibleTheme = defaultLightTheme

/**
 * Night Mode Theme - uses dark
 */
export const nightModeTheme = defaultDarkTheme

/**
 * Finance/Banking Theme - uses light
 * @deprecated Customize colors via the customization API
 */
export const financeTheme = defaultLightTheme

/**
 * Healthcare Theme - uses light
 * @deprecated Customize colors via the customization API
 */
export const healthcareTheme = defaultLightTheme

/**
 * E-commerce Theme - uses light
 * @deprecated Customize colors via the customization API
 */
export const ecommerceTheme = defaultLightTheme

/**
 * Lifestyle/Blog Theme - uses light
 * @deprecated Customize colors via the customization API
 */
export const lifestyleTheme = defaultLightTheme

// ============================================================================
// Backward Compatibility - Deprecated Theme Exports
// ============================================================================
// These exports exist for backward compatibility and will be removed in v4.0
// All deprecated themes now resolve to either light or dark

/** @deprecated Use defaultLightTheme or customize via API */
export const neutralLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const neutralDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const vibrantLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const vibrantDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const highContrastLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const highContrastDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const oceanLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const oceanDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const sunsetLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const sunsetDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const forestLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const forestDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const roseLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const roseDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const midnightLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const midnightDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const slateLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const slateDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const emeraldLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const emeraldDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const amberLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const amberDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const glassmorphismLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const glassmorphismDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const auroraLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const auroraDarkTheme = defaultDarkTheme
/** @deprecated Use defaultLightTheme or customize via API */
export const neumorphismLightTheme = defaultLightTheme
/** @deprecated Use defaultDarkTheme or customize via API */
export const neumorphismDarkTheme = defaultDarkTheme

/** @deprecated Theme metadata no longer includes removed themes */
export const neutralThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const vibrantThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const highContrastThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const oceanThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const sunsetThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const forestThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const roseThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const midnightThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const slateThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const emeraldThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const amberThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const glassmorphismThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const auroraThemeMetadata = defaultThemeMetadata
/** @deprecated Theme metadata no longer includes removed themes */
export const neumorphismThemeMetadata = defaultThemeMetadata
