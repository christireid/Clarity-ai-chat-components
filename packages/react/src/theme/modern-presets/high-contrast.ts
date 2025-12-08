/**
 * Clarity Chat - High Contrast Theme Preset
 *
 * WCAG AAA compliant theme for maximum accessibility.
 * Minimum 7:1 contrast ratio for all text.
 */

import type { CompleteThemeConfig } from '../theme-config'
import { createPreset } from './base'
import {
  highContrastLightColors,
  highContrastDarkColors,
} from '../tokens/colors'
import { darkShadows } from '../tokens/shadows'

/**
 * High Contrast Light Theme
 * Pure black on white for maximum readability
 */
export const highContrastLightTheme: CompleteThemeConfig = createPreset(
  'high-contrast',
  'light',
  highContrastLightColors,
  {
    // Slightly larger border radius for better visibility
    borders: {
      width: {
        thin: '2px', // Thicker borders for visibility
        normal: '2px',
        thick: '4px',
      },
      radius: {
        none: '0',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  }
)

/**
 * High Contrast Dark Theme
 * Pure white on black for maximum readability
 */
export const highContrastDarkTheme: CompleteThemeConfig = createPreset(
  'high-contrast-dark',
  'dark',
  highContrastDarkColors,
  {
    shadows: darkShadows,
    borders: {
      width: {
        thin: '2px',
        normal: '2px',
        thick: '4px',
      },
      radius: {
        none: '0',
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
    },
  }
)

/**
 * Theme metadata
 */
export const highContrastThemeMetadata = {
  light: {
    name: 'high-contrast',
    displayName: 'High Contrast',
    description: 'WCAG AAA compliant, maximum accessibility',
    preview: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#f0f0f0',
      backgroundColor: '#ffffff',
    },
  },
  dark: {
    name: 'high-contrast-dark',
    displayName: 'High Contrast Dark',
    description: 'WCAG AAA compliant dark theme',
    preview: {
      primaryColor: '#93c5fd',
      secondaryColor: '#262626',
      backgroundColor: '#000000',
    },
  },
}
