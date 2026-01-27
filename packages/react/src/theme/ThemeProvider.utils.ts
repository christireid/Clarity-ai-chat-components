import type { CompleteThemeConfig } from './theme-config'
import type { ThemeConfig, ThemeAnimationSpeed } from './theme-types'
import { animationSpeedMap as importedAnimationSpeedMap } from './theme-types'

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

/**
 * Animation speed durations in milliseconds
 * Re-exported from theme-types for convenience
 */
export const animationSpeedMap = importedAnimationSpeedMap

/**
 * Get persistable theme preferences (exclude runtime-only data)
 */
export function getPersistablePreferences(
  theme: ThemeConfig
): Partial<ThemeConfig> {
  const toStore: Partial<ThemeConfig> = {
    mode: theme.mode,
  }
  if (theme.preset) toStore.preset = theme.preset
  if (theme.enableTransitions !== undefined) {
    toStore.enableTransitions = theme.enableTransitions
  }
  return toStore
}

/**
 * Parse and validate stored theme preferences from localStorage
 */
export function parseStoredPreferences(
  stored: string
): Partial<ThemeConfig> | null {
  try {
    const parsed = JSON.parse(stored)
    // Only restore persistable preferences (mode, preset)
    // Don't restore customTheme as it may be stale
    const persistedPreferences: Partial<ThemeConfig> = {}
    if (parsed.mode) persistedPreferences.mode = parsed.mode
    if (parsed.preset) persistedPreferences.preset = parsed.preset
    if (parsed.enableTransitions !== undefined) {
      persistedPreferences.enableTransitions = parsed.enableTransitions
    }

    return Object.keys(persistedPreferences).length > 0
      ? persistedPreferences
      : null
  } catch {
    return null
  }
}
