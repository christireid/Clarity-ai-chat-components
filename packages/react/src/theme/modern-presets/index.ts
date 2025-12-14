/**
 * Clarity Chat - Theme Presets
 *
 * Pre-built theme configurations for common use cases.
 * Each preset includes light and dark variants.
 *
 * Available themes (24 total):
 * - Default: Clean professional with indigo accents
 * - Neutral: Minimal monochrome (Linear-inspired)
 * - Vibrant: Bold purple/pink theme
 * - High Contrast: WCAG AAA accessible
 * - Ocean: Calming blue-teal inspired by the sea
 * - Sunset: Warm orange/amber theme
 * - Forest: Natural green nature theme
 * - Rose: Elegant pink-rose theme
 * - Midnight: Deep purple night theme
 * - Slate: Sophisticated professional gray
 * - Emerald: Rich luxurious green
 * - Amber: Warm golden honey theme
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

// New sophisticated presets
import { oceanLightTheme, oceanDarkTheme, oceanThemeMetadata } from './ocean'
export { oceanLightTheme, oceanDarkTheme, oceanThemeMetadata }

import {
  sunsetLightTheme,
  sunsetDarkTheme,
  sunsetThemeMetadata,
} from './sunset'
export { sunsetLightTheme, sunsetDarkTheme, sunsetThemeMetadata }

import {
  forestLightTheme,
  forestDarkTheme,
  forestThemeMetadata,
} from './forest'
export { forestLightTheme, forestDarkTheme, forestThemeMetadata }

import { roseLightTheme, roseDarkTheme, roseThemeMetadata } from './rose'
export { roseLightTheme, roseDarkTheme, roseThemeMetadata }

import {
  midnightLightTheme,
  midnightDarkTheme,
  midnightThemeMetadata,
} from './midnight'
export { midnightLightTheme, midnightDarkTheme, midnightThemeMetadata }

import { slateLightTheme, slateDarkTheme, slateThemeMetadata } from './slate'
export { slateLightTheme, slateDarkTheme, slateThemeMetadata }

import {
  emeraldLightTheme,
  emeraldDarkTheme,
  emeraldThemeMetadata,
} from './emerald'
export { emeraldLightTheme, emeraldDarkTheme, emeraldThemeMetadata }

import { amberLightTheme, amberDarkTheme, amberThemeMetadata } from './amber'
export { amberLightTheme, amberDarkTheme, amberThemeMetadata }

/**
 * All available theme presets (24 themes)
 * Organized by category for easy discovery
 */
export const modernThemes = {
  // Default theme - Professional indigo
  default: defaultLightTheme,
  'default-dark': defaultDarkTheme,

  // Neutral/Minimal theme - Linear-inspired
  neutral: neutralLightTheme,
  'neutral-dark': neutralDarkTheme,

  // Vibrant theme - Bold purple/pink
  vibrant: vibrantLightTheme,
  'vibrant-dark': vibrantDarkTheme,

  // High contrast (accessibility) - WCAG AAA
  'high-contrast': highContrastLightTheme,
  'high-contrast-dark': highContrastDarkTheme,

  // Ocean theme - Blue/teal serenity
  ocean: oceanLightTheme,
  'ocean-dark': oceanDarkTheme,

  // Sunset theme - Warm orange/amber
  sunset: sunsetLightTheme,
  'sunset-dark': sunsetDarkTheme,

  // Forest theme - Natural green
  forest: forestLightTheme,
  'forest-dark': forestDarkTheme,

  // Rose theme - Elegant pink
  rose: roseLightTheme,
  'rose-dark': roseDarkTheme,

  // Midnight theme - Deep purple night
  midnight: midnightLightTheme,
  'midnight-dark': midnightDarkTheme,

  // Slate theme - Sophisticated gray
  slate: slateLightTheme,
  'slate-dark': slateDarkTheme,

  // Emerald theme - Rich luxurious green
  emerald: emeraldLightTheme,
  'emerald-dark': emeraldDarkTheme,

  // Amber theme - Warm golden
  amber: amberLightTheme,
  'amber-dark': amberDarkTheme,
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
    // New themes
    ocean: {
      name: 'ocean',
      displayName: 'Ocean',
      description: 'Calming blue-teal theme inspired by the sea',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#0ea5e9',
        secondaryColor: '#ecfeff',
        backgroundColor: '#ffffff',
      },
    },
    'ocean-dark': {
      name: 'ocean-dark',
      displayName: 'Ocean Dark',
      description: 'Deep sea colors with bright blue accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#38bdf8',
        secondaryColor: '#164e63',
        backgroundColor: '#0c1929',
      },
    },
    sunset: {
      name: 'sunset',
      displayName: 'Sunset',
      description: 'Warm, energetic orange theme with golden accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#f97316',
        secondaryColor: '#fef3c7',
        backgroundColor: '#fffbf5',
      },
    },
    'sunset-dark': {
      name: 'sunset-dark',
      displayName: 'Sunset Dark',
      description: 'Rich amber depths with glowing orange accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#fb923c',
        secondaryColor: '#422006',
        backgroundColor: '#1a1410',
      },
    },
    forest: {
      name: 'forest',
      displayName: 'Forest',
      description: 'Natural green theme inspired by lush forests',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#16a34a',
        secondaryColor: '#dcfce7',
        backgroundColor: '#fbfefb',
      },
    },
    'forest-dark': {
      name: 'forest-dark',
      displayName: 'Forest Dark',
      description: 'Deep woodland with luminous green accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#22c55e',
        secondaryColor: '#14532d',
        backgroundColor: '#0a1a0e',
      },
    },
    rose: {
      name: 'rose',
      displayName: 'Rose',
      description: 'Elegant pink-rose theme for creative applications',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#e11d48',
        secondaryColor: '#fce7f3',
        backgroundColor: '#fffbfc',
      },
    },
    'rose-dark': {
      name: 'rose-dark',
      displayName: 'Rose Dark',
      description: 'Deep burgundy with vibrant rose accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#fb7185',
        secondaryColor: '#4c0519',
        backgroundColor: '#1a0a10',
      },
    },
    midnight: {
      name: 'midnight',
      displayName: 'Midnight',
      description: 'Deep purple theme for immersive experiences',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#7c3aed',
        secondaryColor: '#ede9fe',
        backgroundColor: '#fcfbff',
      },
    },
    'midnight-dark': {
      name: 'midnight-dark',
      displayName: 'Midnight Dark',
      description: 'Deep night sky with luminous purple accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#a78bfa',
        secondaryColor: '#2e1065',
        backgroundColor: '#0d0712',
      },
    },
    slate: {
      name: 'slate',
      displayName: 'Slate',
      description: 'Sophisticated professional gray theme',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#475569',
        secondaryColor: '#e2e8f0',
        backgroundColor: '#fcfdfe',
      },
    },
    'slate-dark': {
      name: 'slate-dark',
      displayName: 'Slate Dark',
      description: 'Deep slate with refined gray accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#94a3b8',
        secondaryColor: '#1e293b',
        backgroundColor: '#0f172a',
      },
    },
    emerald: {
      name: 'emerald',
      displayName: 'Emerald',
      description: 'Rich, luxurious green theme for premium apps',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#059669',
        secondaryColor: '#d1fae5',
        backgroundColor: '#f9fefc',
      },
    },
    'emerald-dark': {
      name: 'emerald-dark',
      displayName: 'Emerald Dark',
      description: 'Deep jade with luminous emerald accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#34d399',
        secondaryColor: '#064e3b',
        backgroundColor: '#0a1a14',
      },
    },
    amber: {
      name: 'amber',
      displayName: 'Amber',
      description: 'Warm golden theme inspired by honey and amber',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#d97706',
        secondaryColor: '#fef3c7',
        backgroundColor: '#fffdf7',
      },
    },
    'amber-dark': {
      name: 'amber-dark',
      displayName: 'Amber Dark',
      description: 'Deep bronze with glowing amber accents',
      author: 'Clarity Chat',
      version: '2.0.0',
      preview: {
        primaryColor: '#f59e0b',
        secondaryColor: '#451a03',
        backgroundColor: '#1a1308',
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

/**
 * Get themes by category
 */
export function getThemesByCategory(): Record<string, ModernThemePresetName[]> {
  return {
    professional: [
      'default',
      'default-dark',
      'neutral',
      'neutral-dark',
      'slate',
      'slate-dark',
    ],
    vibrant: [
      'vibrant',
      'vibrant-dark',
      'rose',
      'rose-dark',
      'midnight',
      'midnight-dark',
    ],
    nature: [
      'ocean',
      'ocean-dark',
      'forest',
      'forest-dark',
      'emerald',
      'emerald-dark',
    ],
    warm: ['sunset', 'sunset-dark', 'amber', 'amber-dark'],
    accessible: ['high-contrast', 'high-contrast-dark'],
  }
}

/**
 * Get light themes only
 */
export function getLightThemes(): ModernThemePresetName[] {
  return getModernThemeNames().filter((name) => !name.endsWith('-dark'))
}

/**
 * Get dark themes only
 */
export function getDarkThemes(): ModernThemePresetName[] {
  return getModernThemeNames().filter((name) => name.endsWith('-dark'))
}

// ============================================================================
// Template-Specific Theme Aliases
// ============================================================================
// These semantic aliases make it clear which themes are designed for which
// use cases, improving template readability and intentionality.

/**
 * Code Editor Theme
 *
 * Optimized for code editing and programming assistance:
 * - Dark background reduces eye strain during long coding sessions
 * - High contrast for code readability
 * - Neutral palette doesn't distract from syntax highlighting
 */
export const codeEditorTheme = neutralDarkTheme

/**
 * Customer Support Theme
 *
 * Designed for customer-facing support interfaces:
 * - Professional, trustworthy appearance
 * - Light background feels welcoming and approachable
 * - Clean design builds confidence
 */
export const supportChatTheme = defaultLightTheme

/**
 * AI Assistant Theme
 *
 * For general-purpose AI assistant interfaces:
 * - Modern, sophisticated look
 * - Balanced light theme works in most contexts
 * - Professional without being cold
 */
export const aiAssistantTheme = defaultLightTheme

/**
 * Developer Tools Theme
 *
 * For developer-focused applications and tools:
 * - True dark mode preferred by developers
 * - Minimal distractions
 * - Terminal-like aesthetic
 */
export const devToolsTheme = neutralDarkTheme

/**
 * Corporate/Enterprise Theme
 *
 * For enterprise and business applications:
 * - Conservative, professional appearance
 * - Neutral colors project reliability
 * - Accessible and inclusive
 */
export const enterpriseTheme = slateLightTheme

/**
 * Creative/Marketing Theme
 *
 * For creative and marketing applications:
 * - Bold, attention-grabbing colors
 * - Modern, trendy aesthetic
 * - Memorable and distinctive
 */
export const creativeTheme = vibrantLightTheme

/**
 * Accessibility-First Theme
 *
 * For applications requiring maximum accessibility:
 * - WCAG AAA compliant contrast ratios
 * - Clear, legible text
 * - High visibility UI elements
 */
export const accessibleTheme = highContrastLightTheme

/**
 * Night Mode Theme
 *
 * For low-light environments:
 * - True dark with high contrast
 * - Easy on the eyes in dark rooms
 * - Reduced blue light appearance
 */
export const nightModeTheme = midnightDarkTheme

/**
 * Finance/Banking Theme
 *
 * For financial applications:
 * - Trustworthy, premium appearance
 * - Green suggests growth and success
 * - Professional and secure feeling
 */
export const financeTheme = emeraldLightTheme

/**
 * Healthcare Theme
 *
 * For healthcare and wellness applications:
 * - Calming, trustworthy appearance
 * - Blue suggests reliability and care
 * - Clean and professional
 */
export const healthcareTheme = oceanLightTheme

/**
 * E-commerce Theme
 *
 * For shopping and retail applications:
 * - Warm, inviting colors
 * - Amber tones create urgency and excitement
 * - Modern and energetic
 */
export const ecommerceTheme = amberLightTheme

/**
 * Lifestyle/Blog Theme
 *
 * For lifestyle, fashion, and blog applications:
 * - Elegant and stylish
 * - Rose tones feel sophisticated
 * - Modern and distinctive
 */
export const lifestyleTheme = roseLightTheme
