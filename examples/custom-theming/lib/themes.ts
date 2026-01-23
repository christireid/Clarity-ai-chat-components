/**
 * Theme Customization Example for Clarity Chat
 *
 * This example demonstrates the new consolidated theme system with:
 * - Only TWO built-in themes: light and dark
 * - Custom theme presets created via CSS variable overrides
 *
 * For production use, prefer the customization API:
 * ```typescript
 * import { applyThemeOverrides } from '@clarity-chat/react'
 * applyThemeOverrides({ colors: { primary: '#6366f1' } })
 * ```
 */

export interface ThemePreset {
  id: string
  name: string
  description: string
  mode: 'light' | 'dark'
  overrides: {
    primary?: string
    primaryForeground?: string
    secondary?: string
    accent?: string
    background?: string
    foreground?: string
    muted?: string
    mutedForeground?: string
    border?: string
    ring?: string
    radius?: string
  }
}

/**
 * Built-in themes (only light and dark are provided)
 */
export const BUILT_IN_THEMES: ThemePreset[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean, professional light theme',
    mode: 'light',
    overrides: {}, // Uses default light values
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Sleek, modern dark theme',
    mode: 'dark',
    overrides: {}, // Uses default dark values
  },
]

/**
 * Example custom presets (for demonstration)
 * These show how to customize the base light/dark themes.
 */
export const CUSTOM_PRESET_EXAMPLES: ThemePreset[] = [
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calm blue tones - extends light',
    mode: 'light',
    overrides: {
      primary: '200 100% 40%', // Bright blue
      accent: '180 60% 45%', // Teal
      ring: '200 100% 40%',
      radius: '1rem',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green palette - extends light',
    mode: 'light',
    overrides: {
      primary: '142 76% 36%', // Green
      accent: '142 60% 40%',
      ring: '142 76% 36%',
      radius: '0.75rem',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Warm pink accents - extends light',
    mode: 'light',
    overrides: {
      primary: '350 80% 50%', // Pink
      accent: '350 70% 55%',
      ring: '350 80% 50%',
      radius: '1.5rem',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep blue darkness - extends dark',
    mode: 'dark',
    overrides: {
      primary: '210 100% 60%', // Bright blue
      accent: '200 100% 50%',
      background: '230 35% 7%', // Deep blue-black
      ring: '210 100% 60%',
      radius: '0.75rem',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Rich green on dark - extends dark',
    mode: 'dark',
    overrides: {
      primary: '142 76% 36%', // Emerald
      accent: '142 50% 30%',
      ring: '142 76% 36%',
      radius: '0.75rem',
    },
  },
  {
    id: 'purple-haze',
    name: 'Purple Haze',
    description: 'Vibrant purple tones - extends dark',
    mode: 'dark',
    overrides: {
      primary: '270 80% 60%', // Purple
      accent: '280 70% 55%',
      background: '270 30% 6%', // Deep purple-black
      ring: '270 80% 60%',
      radius: '1rem',
    },
  },
]

/**
 * All available theme presets
 */
export const THEMES: ThemePreset[] = [
  ...BUILT_IN_THEMES,
  ...CUSTOM_PRESET_EXAMPLES,
]

export function getThemeById(id: string): ThemePreset | undefined {
  return THEMES.find((t) => t.id === id)
}

/**
 * Apply a theme preset to the document.
 * This demonstrates manual CSS variable application.
 *
 * In production, prefer using the Clarity Chat customization API:
 * ```typescript
 * import { applyThemeOverrides } from '@clarity-chat/react'
 * applyThemeOverrides(preset.overrides)
 * ```
 */
export function applyTheme(preset: ThemePreset): void {
  const root = document.documentElement

  // Set the base theme mode
  if (preset.mode === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }

  // Apply overrides
  Object.entries(preset.overrides).forEach(([key, value]) => {
    if (value === undefined) return

    // Map key to CSS variable name
    const cssVar =
      key === 'radius'
        ? '--clarity-radius'
        : `--clarity-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`

    root.style.setProperty(cssVar, value)
  })
}

/**
 * Clear all custom overrides (reset to base theme)
 */
export function clearThemeOverrides(): void {
  const root = document.documentElement
  const style = root.style

  // Remove all clarity CSS variables
  const toRemove: string[] = []
  for (let i = 0; i < style.length; i++) {
    const prop = style[i]
    if (prop?.startsWith('--clarity-')) {
      toRemove.push(prop)
    }
  }
  toRemove.forEach((prop) => style.removeProperty(prop))
}

/**
 * Generate CSS string for a theme preset.
 * Useful for documentation or static CSS generation.
 */
export function generateCSSVariables(preset: ThemePreset): string {
  if (Object.keys(preset.overrides).length === 0) {
    return `/* ${preset.name}: Uses default ${preset.mode} theme values */`
  }

  const lines = Object.entries(preset.overrides).map(([key, value]) => {
    if (value === undefined) return ''
    const cssVar =
      key === 'radius'
        ? '--clarity-radius'
        : `--clarity-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    return `  ${cssVar}: ${value};`
  })

  const selector =
    preset.mode === 'dark' ? '[data-theme="dark"]' : '[data-theme="light"]'

  return `/* ${preset.name} - ${preset.description} */\n${selector} {\n${lines.filter(Boolean).join('\n')}\n}`
}

// ============================================================================
// Backward Compatibility (Deprecated)
// ============================================================================

/**
 * @deprecated Use ThemePreset instead
 */
export interface Theme {
  id: string
  name: string
  description: string
  mode: 'light' | 'dark'
  colors: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    border: string
    input: string
    ring: string
    userBubble: string
    userBubbleForeground: string
    assistantBubble: string
    assistantBubbleForeground: string
  }
  radius: string
}
