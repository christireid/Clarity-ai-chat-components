/**
 * Neumorphism Theme Preset
 *
 * Soft, extruded UI elements with tactile realism and subtle depth.
 * Perfect for AI chat interfaces that need a calm, sophisticated feel.
 */

import type { CompleteThemeConfig, ThemeMetadata } from '../theme-config'
import { createPreset } from './base'

/**
 * Neumorphism light theme
 * Soft, tactile interface with subtle extrusions
 */
export const neumorphismLightTheme = {
  name: 'neumorphism-light',
  displayName: 'Neumorphic Light',
  mode: 'light',

  colors: {
    // Soft neumorphic base
    background: '#e0e5ec',
    foreground: '#2d3436',

    // Subtle neumorphic surfaces
    card: '#e0e5ec',
    cardForeground: '#2d3436',
    popover: '#d5dae1',
    popoverForeground: '#2d3436',

    // Neumorphic primary with soft contrast
    primary: '#6c5ce7',
    primaryForeground: '#ffffff',
    secondary: '#a29bfe',
    secondaryForeground: '#ffffff',
    accent: '#fd79a8',
    accentForeground: '#ffffff',

    // State colors with neumorphic softness
    destructive: '#e84393',
    destructiveForeground: '#ffffff',
    success: '#00b894',
    successForeground: '#ffffff',
    warning: '#fdcb6e',
    warningForeground: '#2d3436',
    info: '#74b9ff',
    infoForeground: '#ffffff',

    // Neumorphic UI colors
    muted: '#b2bec3',
    mutedForeground: '#636e72',
    border: '#dfe6e9',
    input: '#e0e5ec',
    ring: '#6c5ce7',

    // Extended neumorphic surfaces
    surfaceMuted: '#dfe6e9',
    surfaceElevated: '#ffffff',
    surfaceOverlay: '#b2bec3',
  },

  spacing: {
    scale: 'rem',
    base: 0.25,
    ratio: 1.414, // Square root of 2
    unit: 'rem',
  },

  radius: {
    none: '0',
    sm: '0.5rem',
    DEFAULT: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  shadows: {
    sm: 'inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.7)',
    DEFAULT:
      '5px 5px 10px rgba(0,0,0,0.1), -5px -5px 10px rgba(255,255,255,0.7)',
    md: '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
    lg: '12px 12px 24px rgba(0,0,0,0.1), -12px -12px 24px rgba(255,255,255,0.7)',
    xl: '16px 16px 32px rgba(0,0,0,0.1), -16px -16px 32px rgba(255,255,255,0.7)',
    '2xl':
      '20px 20px 40px rgba(0,0,0,0.1), -20px -20px 40px rgba(255,255,255,0.7)',
    inner:
      'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
    neumorphic:
      '5px 5px 10px rgba(0,0,0,0.1), -5px -5px 10px rgba(255,255,255,0.7)',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  animations: {
    duration: {
      instant: '0ms',
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      slower: '800ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      neumorphic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      soft: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  components: {
    button: {
      padding: '0.875rem 1.75rem',
      borderRadius: '0.75rem',
      fontWeight: 500,
      boxShadow:
        '5px 5px 10px rgba(0,0,0,0.1), -5px -5px 10px rgba(255,255,255,0.7)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      background: '#e0e5ec',
      border: 'none',
    },
    input: {
      padding: '0.875rem 1.25rem',
      borderRadius: '0.75rem',
      border: 'none',
      background: '#e0e5ec',
      boxShadow:
        'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
    },
    card: {
      padding: '2rem',
      borderRadius: '1.25rem',
      background: '#e0e5ec',
      boxShadow:
        '8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.3)',
    },
    message: {
      borderRadius: '1.25rem',
      padding: '1rem 1.25rem',
      maxWidth: '80%',
      background: '#e0e5ec',
      boxShadow:
        '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  },

  custom: {
    neumorphic: {
      background: '#e0e5ec',
      lightShadow: 'rgba(255,255,255,0.7)',
      darkShadow: 'rgba(0,0,0,0.1)',
      concave:
        'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.7)',
      convex:
        '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.7)',
      flat: '2px 2px 4px rgba(0,0,0,0.05), -2px -2px 4px rgba(255,255,255,0.7)',
    },
    soft: {
      background: '#f0f3f7',
      highlight: 'rgba(255,255,255,0.8)',
      shadow: 'rgba(0,0,0,0.08)',
    },
    tactile: {
      pressed:
        'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.7)',
      raised:
        '6px 6px 12px rgba(0,0,0,0.1), -6px -6px 12px rgba(255,255,255,0.7)',
      inset:
        'inset 3px 3px 6px rgba(0,0,0,0.1), inset -3px -3px 6px rgba(255,255,255,0.7)',
    },
  },
}

/**
 * Neumorphism dark theme
 * Deep, soft interface with subtle extrusions
 */
export const neumorphismDarkTheme = {
  name: 'neumorphism-dark',
  displayName: 'Neumorphic Dark',
  mode: 'dark',

  colors: {
    // Deep neumorphic base
    background: '#1a1e23',
    foreground: '#e0e5ec',

    // Dark neumorphic surfaces
    card: '#1a1e23',
    cardForeground: '#e0e5ec',
    popover: '#23282d',
    popoverForeground: '#e0e5ec',

    // Neumorphic primary with enhanced contrast
    primary: '#a29bfe',
    primaryForeground: '#1a1e23',
    secondary: '#fd79a8',
    secondaryForeground: '#1a1e23',
    accent: '#74b9ff',
    accentForeground: '#1a1e23',

    // State colors with neumorphic softness
    destructive: '#e84393',
    destructiveForeground: '#ffffff',
    success: '#00b894',
    successForeground: '#ffffff',
    warning: '#fdcb6e',
    warningForeground: '#1a1e23',
    info: '#74b9ff',
    infoForeground: '#ffffff',

    // Neumorphic UI colors for dark mode
    muted: '#636e72',
    mutedForeground: '#b2bec3',
    border: '#2d3436',
    input: '#1a1e23',
    ring: '#a29bfe',

    // Extended dark neumorphic surfaces
    surfaceMuted: '#23282d',
    surfaceElevated: '#2d3436',
    surfaceOverlay: '#636e72',
  },

  spacing: {
    scale: 'rem',
    base: 0.25,
    ratio: 1.414, // Square root of 2
    unit: 'rem',
  },

  radius: {
    none: '0',
    sm: '0.5rem',
    DEFAULT: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  shadows: {
    sm: 'inset 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 5px rgba(255,255,255,0.05)',
    DEFAULT:
      '5px 5px 10px rgba(0,0,0,0.3), -5px -5px 10px rgba(255,255,255,0.05)',
    md: '8px 8px 16px rgba(0,0,0,0.3), -8px -8px 16px rgba(255,255,255,0.05)',
    lg: '12px 12px 24px rgba(0,0,0,0.3), -12px -12px 24px rgba(255,255,255,0.05)',
    xl: '16px 16px 32px rgba(0,0,0,0.3), -16px -16px 32px rgba(255,255,255,0.05)',
    '2xl':
      '20px 20px 40px rgba(0,0,0,0.3), -20px -20px 40px rgba(255,255,255,0.05)',
    inner:
      'inset 4px 4px 8px rgba(0,0,0,0.3), inset -4px -4px 8px rgba(255,255,255,0.05)',
    neumorphic:
      '5px 5px 10px rgba(0,0,0,0.3), -5px -5px 10px rgba(255,255,255,0.05)',
  },

  typography: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  animations: {
    duration: {
      instant: '0ms',
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      slower: '800ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      neumorphic: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      soft: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  components: {
    button: {
      padding: '0.875rem 1.75rem',
      borderRadius: '0.75rem',
      fontWeight: 500,
      boxShadow:
        '5px 5px 10px rgba(0,0,0,0.3), -5px -5px 10px rgba(255,255,255,0.05)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      background: '#1a1e23',
      border: 'none',
    },
    input: {
      padding: '0.875rem 1.25rem',
      borderRadius: '0.75rem',
      border: 'none',
      background: '#1a1e23',
      boxShadow:
        'inset 4px 4px 8px rgba(0,0,0,0.3), inset -4px -4px 8px rgba(255,255,255,0.05)',
    },
    card: {
      padding: '2rem',
      borderRadius: '1.25rem',
      background: '#1a1e23',
      boxShadow:
        '8px 8px 16px rgba(0,0,0,0.3), -8px -8px 16px rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
    },
    message: {
      borderRadius: '1.25rem',
      padding: '1rem 1.25rem',
      maxWidth: '80%',
      background: '#1a1e23',
      boxShadow:
        '4px 4px 8px rgba(0,0,0,0.3), -4px -4px 8px rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
    },
  },

  custom: {
    neumorphic: {
      background: '#1a1e23',
      lightShadow: 'rgba(255,255,255,0.05)',
      darkShadow: 'rgba(0,0,0,0.3)',
      concave:
        'inset 4px 4px 8px rgba(0,0,0,0.3), inset -4px -4px 8px rgba(255,255,255,0.05)',
      convex:
        '4px 4px 8px rgba(0,0,0,0.3), -4px -4px 8px rgba(255,255,255,0.05)',
      flat: '2px 2px 4px rgba(0,0,0,0.2), -2px -2px 4px rgba(255,255,255,0.05)',
    },
    soft: {
      background: '#23282d',
      highlight: 'rgba(255,255,255,0.1)',
      shadow: 'rgba(0,0,0,0.4)',
    },
    tactile: {
      pressed:
        'inset 2px 2px 4px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(255,255,255,0.05)',
      raised:
        '6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.05)',
      inset:
        'inset 3px 3px 6px rgba(0,0,0,0.3), inset -3px -3px 6px rgba(255,255,255,0.05)',
    },
  },
}

/**
 * Neumorphism theme metadata
 */
export const neumorphismThemeMetadata: ThemeMetadata = {
  name: 'neumorphism',
  displayName: 'Neumorphism',
  description:
    'Soft, extruded UI elements with tactile realism and subtle depth',
  category: 'modern',
  tags: ['neumorphism', 'soft', 'tactile', 'extruded', 'minimal', 'calm'],
  popularity: 88,
  accessibility: {
    wcagRating: 'AA',
    contrastRatio: 8.2,
    colorBlindSafe: true,
  },
  designSystem: {
    primary: 'Soft extruded elements',
    secondary: 'Tactile shadows and highlights',
    accent: 'Minimal color palette',
  },
  useCases: [
    'Calm applications',
    'Medical interfaces',
    'Wellness platforms',
    'Minimalist designs',
    'Professional tools',
  ],
  features: [
    'Soft extruded UI',
    'Tactile realism',
    'Subtle depth',
    'Minimal aesthetics',
    'Calming interface',
  ],
  compatibility: {
    browsers: ['Chrome 60+', 'Firefox 55+', 'Safari 11+', 'Edge 79+'],
    features: [
      'CSS shadows',
      'CSS filters',
      'CSS transitions',
      'CSS Variables',
    ],
  },
}

/**
 * Neumorphism theme preset
 */
export const neumorphismPreset = createPreset({
  light: neumorphismLightTheme,
  dark: neumorphismDarkTheme,
  metadata: neumorphismThemeMetadata,
})

// Themes are already exported with 'export const' declarations above
