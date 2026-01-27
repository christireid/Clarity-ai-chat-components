/**
 * Code Theme Definitions
 *
 * Curated collection of popular syntax highlighting themes
 * All themes are Shiki/VS Code compatible
 *
 * @packageDocumentation
 */

import type { BundledTheme } from 'shiki'

// Night Owl theme definitions (single source of truth)
export {
  NIGHT_OWL_COLORS,
  NIGHT_OWL_TOKENS,
  NIGHT_OWL_MONACO_THEME,
  NIGHT_OWL_CSS_VARS,
  NIGHT_OWL_TAILWIND,
} from './night-owl'

/**
 * Theme metadata with display information
 */
export interface CodeThemeDefinition {
  /** Display name for the theme */
  name: string
  /** Theme type (dark/light) for UI theming */
  type: 'dark' | 'light'
  /** Shiki theme identifier */
  shikiTheme: BundledTheme
  /** Theme description */
  description?: string
}

/**
 * Available code themes
 *
 * Organized by type (dark/light) with popular themes first
 */
export const CODE_THEMES = {
  // === Dark Themes (Most Popular First) ===

  'github-dark': {
    name: 'GitHub Dark',
    type: 'dark',
    shikiTheme: 'github-dark',
    description: "GitHub's official dark theme",
  },

  'one-dark-pro': {
    name: 'One Dark Pro',
    type: 'dark',
    shikiTheme: 'one-dark-pro',
    description: 'Popular Atom One Dark theme',
  },

  'material-theme-darker': {
    name: 'Material Darker',
    type: 'dark',
    shikiTheme: 'material-theme-darker',
    description: 'Material Design dark variant',
  },

  'night-owl': {
    name: 'Night Owl',
    type: 'dark',
    shikiTheme: 'night-owl',
    description: 'Optimized for night coding',
  },

  dracula: {
    name: 'Dracula',
    type: 'dark',
    shikiTheme: 'dracula',
    description: 'Classic dark theme with vibrant colors',
  },

  'tokyo-night': {
    name: 'Tokyo Night',
    type: 'dark',
    shikiTheme: 'tokyo-night',
    description: "Inspired by Tokyo's night lights",
  },

  'vitesse-dark': {
    name: 'Vitesse Dark',
    type: 'dark',
    shikiTheme: 'vitesse-dark',
    description: 'Elegant dark theme by Anthony Fu',
  },

  nord: {
    name: 'Nord',
    type: 'dark',
    shikiTheme: 'nord',
    description: 'Arctic, north-bluish color palette',
  },

  'catppuccin-mocha': {
    name: 'Catppuccin Mocha',
    type: 'dark',
    shikiTheme: 'catppuccin-mocha',
    description: 'Soothing pastel theme (dark)',
  },

  'ayu-dark': {
    name: 'Ayu Dark',
    type: 'dark',
    shikiTheme: 'ayu-dark',
    description: 'Simple, bright colors',
  },

  // === Light Themes ===

  'github-light': {
    name: 'GitHub Light',
    type: 'light',
    shikiTheme: 'github-light',
    description: "GitHub's official light theme",
  },

  'material-theme-lighter': {
    name: 'Material Lighter',
    type: 'light',
    shikiTheme: 'material-theme-lighter',
    description: 'Material Design light variant',
  },

  'vitesse-light': {
    name: 'Vitesse Light',
    type: 'light',
    shikiTheme: 'vitesse-light',
    description: 'Elegant light theme by Anthony Fu',
  },

  'catppuccin-latte': {
    name: 'Catppuccin Latte',
    type: 'light',
    shikiTheme: 'catppuccin-latte',
    description: 'Soothing pastel theme (light)',
  },

  'min-light': {
    name: 'Min Light',
    type: 'light',
    shikiTheme: 'min-light',
    description: 'Minimal, clean light theme',
  },

  'slack-ochin': {
    name: 'Slack Ochin',
    type: 'light',
    shikiTheme: 'slack-ochin',
    description: 'Light theme inspired by Slack',
  },
} as const satisfies Record<string, CodeThemeDefinition>

/**
 * Type for available theme names
 */
export type CodeThemeName = keyof typeof CODE_THEMES

/**
 * Default theme for dark mode
 * Night Owl - Optimized for night coding with premium aesthetics
 */
export const DEFAULT_DARK_THEME: CodeThemeName = 'night-owl'

/**
 * Default theme for light mode
 */
export const DEFAULT_LIGHT_THEME: CodeThemeName = 'github-light'

/**
 * Get all dark themes
 */
export function getDarkThemes(): CodeThemeName[] {
  return Object.entries(CODE_THEMES)
    .filter(([, theme]) => theme.type === 'dark')
    .map(([key]) => key as CodeThemeName)
}

/**
 * Get all light themes
 */
export function getLightThemes(): CodeThemeName[] {
  return Object.entries(CODE_THEMES)
    .filter(([, theme]) => theme.type === 'light')
    .map(([key]) => key as CodeThemeName)
}

/**
 * Get theme metadata
 */
export function getThemeDefinition(theme: CodeThemeName): CodeThemeDefinition {
  return CODE_THEMES[theme]
}

/**
 * Check if a theme name is valid
 */
export function isValidTheme(theme: string): theme is CodeThemeName {
  return theme in CODE_THEMES
}
