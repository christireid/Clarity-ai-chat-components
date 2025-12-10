/**
 * Theme System Type Definitions
 *
 * @module theme/theme-types
 */

import type { ModernThemePresetName } from './modern-presets'
import type { CompleteThemeConfig, PartialThemeConfig } from './theme-config'
import type { SimpleThemeConfig } from './create-theme'

/**
 * Theme mode: light, dark, or system (follows OS preference)
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Theme preset name (modern themes only)
 */
export type ThemePresetName = ModernThemePresetName

/**
 * Animation speed options for theme transitions
 */
export type ThemeAnimationSpeed = 'none' | 'fast' | 'normal' | 'slow'

/**
 * Animation speed durations in milliseconds
 */
export const animationSpeedMap: Record<ThemeAnimationSpeed, number> = {
  none: 0,
  fast: 150,
  normal: 300,
  slow: 500,
}

/**
 * Theme configuration object
 */
export interface ThemeConfig {
  mode: ThemeMode
  preset?: ThemePresetName
  customTheme?: CompleteThemeConfig
  customizations?: PartialThemeConfig
  // Simple theme config (modern API)
  simpleConfig?: SimpleThemeConfig
  // Transition settings
  enableTransitions?: boolean
  transitionDuration?: number
}

/**
 * Theme context value provided by ThemeProvider
 */
export interface ThemeContextValue {
  theme: ThemeConfig
  setTheme: (theme: Partial<ThemeConfig>) => void
  mode: 'light' | 'dark'
  toggleMode: () => void
  resolvedTheme: CompleteThemeConfig | null
  setPreset: (preset: ThemePresetName) => void
  availablePresets: ThemePresetName[]
}

/**
 * Check if a value is a CompleteThemeConfig (has colors, typography, etc.)
 * vs a ThemeConfig (has mode, preset, customTheme, etc.)
 */
export function isCompleteThemeConfig(
  value: unknown
): value is CompleteThemeConfig {
  if (!value || typeof value !== 'object') return false
  const obj = value as Record<string, unknown>
  // CompleteThemeConfig has 'colors' and 'typography' as required fields
  return (
    'colors' in obj && 'typography' in obj && typeof obj.colors === 'object'
  )
}

/**
 * Normalize theme input to ThemeConfig format
 * Allows users to pass either:
 * - Partial<ThemeConfig> (e.g., { preset: 'default' })
 * - CompleteThemeConfig (e.g., defaultLightTheme directly)
 */
export function normalizeThemeInput(
  input: Partial<ThemeConfig> | CompleteThemeConfig | undefined
): Partial<ThemeConfig> {
  if (!input) return { mode: 'system' }

  // If it's a complete theme config, wrap it
  if (isCompleteThemeConfig(input)) {
    return {
      mode: input.mode || 'light',
      customTheme: input,
    }
  }

  return input as Partial<ThemeConfig>
}
