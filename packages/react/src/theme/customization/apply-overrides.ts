/**
 * Theme Override Application
 *
 * Runtime API for applying customer theme overrides safely.
 */

import type { ThemeOverrides, ApplyOptions, ColorOverrides } from './types'
import { DEFAULT_STORAGE_KEY } from './types'
import { validateThemeOverrides } from './validate-theme'

/**
 * CSS variable prefix for clarity tokens.
 */
const CSS_VAR_PREFIX = 'clarity'

/**
 * Map color key to CSS variable name.
 */
function colorKeyToCssVar(key: string): string {
  // Convert camelCase to kebab-case
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase()
  return `--${CSS_VAR_PREFIX}-${kebab}`
}

/**
 * Convert hex color to OKLCH-like format for CSS variables.
 * For simplicity, we store the original value and let the browser handle it.
 */
function normalizeColorValue(value: string): string {
  // If it's already OKLCH-style (no prefix), return as-is
  if (/^[\d.]+%?\s+[\d.]+\s+[\d.]+/.test(value)) {
    return value
  }

  // For hex/rgb/hsl, we need to wrap in the appropriate function
  // Since we're setting CSS variables, we'll use the raw value
  // and the CSS will use oklch() wrapper
  return value
}

/**
 * Apply theme overrides to an element.
 */
function applyOverridesToElement(
  element: HTMLElement,
  overrides: ThemeOverrides,
  mode?: 'light' | 'dark' | 'both'
): void {
  // Validate overrides
  const { sanitized } = validateThemeOverrides(overrides)

  // Apply color overrides
  if (sanitized.colors) {
    for (const [key, value] of Object.entries(sanitized.colors)) {
      if (value === undefined) continue

      const cssVar = colorKeyToCssVar(key)
      const normalized = normalizeColorValue(value)

      // If mode is specified, we need to use conditional selectors
      // For runtime, we apply directly to the element's style
      element.style.setProperty(cssVar, normalized)
    }
  }

  // Apply radius
  if (sanitized.radius) {
    element.style.setProperty(`--${CSS_VAR_PREFIX}-radius`, sanitized.radius)
  }

  // Apply glass overrides
  if (sanitized.glass) {
    if (sanitized.glass.opacity !== undefined) {
      element.style.setProperty(
        `--${CSS_VAR_PREFIX}-glass-opacity`,
        String(sanitized.glass.opacity)
      )
    }
    if (sanitized.glass.blur) {
      element.style.setProperty(
        `--${CSS_VAR_PREFIX}-glass-blur`,
        sanitized.glass.blur
      )
    }
    if (sanitized.glass.saturate) {
      element.style.setProperty(
        `--${CSS_VAR_PREFIX}-glass-saturate`,
        sanitized.glass.saturate
      )
    }
    if (sanitized.glass.borderOpacity !== undefined) {
      element.style.setProperty(
        `--${CSS_VAR_PREFIX}-glass-border-opacity`,
        String(sanitized.glass.borderOpacity)
      )
    }
  }
}

/**
 * Apply theme overrides.
 *
 * @example
 * ```typescript
 * // Apply brand colors
 * applyThemeOverrides({
 *   colors: {
 *     primary: '#3b82f6',
 *     primaryForeground: '#ffffff',
 *   },
 *   radius: '0.75rem',
 * });
 *
 * // Apply to specific element
 * applyThemeOverrides(overrides, {
 *   scope: document.getElementById('chat-container'),
 * });
 *
 * // Persist to localStorage
 * applyThemeOverrides(overrides, { persist: true });
 * ```
 */
export function applyThemeOverrides(
  overrides: ThemeOverrides,
  options: ApplyOptions = {}
): void {
  const {
    scope = typeof document !== 'undefined'
      ? document.documentElement
      : undefined,
    mode = 'both',
    persist = false,
    storageKey = DEFAULT_STORAGE_KEY,
  } = options

  if (!scope) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[Clarity Theme] Cannot apply overrides: no scope element (SSR environment?)'
      )
    }
    return
  }

  applyOverridesToElement(scope, overrides, mode)

  // Persist to localStorage if requested
  if (persist && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(storageKey, JSON.stringify(overrides))
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[Clarity Theme] Failed to persist overrides:', e)
      }
    }
  }
}

/**
 * Clear all theme overrides from an element.
 */
export function clearThemeOverrides(
  scope: HTMLElement = typeof document !== 'undefined'
    ? document.documentElement
    : (undefined as unknown as HTMLElement),
  storageKey: string = DEFAULT_STORAGE_KEY
): void {
  if (!scope) return

  // Get all clarity CSS custom properties
  const style = scope.style
  const toRemove: string[] = []

  for (let i = 0; i < style.length; i++) {
    const prop = style[i]
    if (prop?.startsWith(`--${CSS_VAR_PREFIX}-`)) {
      toRemove.push(prop)
    }
  }

  // Remove them
  toRemove.forEach((prop) => style.removeProperty(prop))

  // Clear from localStorage
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // Ignore storage errors
    }
  }
}

/**
 * Get currently active overrides from localStorage.
 */
export function getPersistedOverrides(
  storageKey: string = DEFAULT_STORAGE_KEY
): ThemeOverrides | null {
  if (typeof localStorage === 'undefined') return null

  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) return null

    const parsed = JSON.parse(stored)

    // Validate the parsed data
    const { sanitized } = validateThemeOverrides(parsed)
    return sanitized
  } catch {
    return null
  }
}

/**
 * Load and apply persisted overrides.
 * Call this on app initialization to restore customer's theme.
 */
export function loadPersistedOverrides(
  options: Omit<ApplyOptions, 'persist'> = {}
): boolean {
  const overrides = getPersistedOverrides(options.storageKey)

  if (overrides) {
    applyThemeOverrides(overrides, { ...options, persist: false })
    return true
  }

  return false
}

/**
 * Generate CSS string from theme overrides.
 * Useful for SSR or generating static override files.
 *
 * @example
 * ```typescript
 * const css = generateOverrideCSS({
 *   colors: { primary: '#3b82f6' },
 * });
 * // Returns: ":root { --clarity-primary: #3b82f6; }"
 * ```
 */
export function generateOverrideCSS(
  overrides: ThemeOverrides,
  selector: string = ':root'
): string {
  const { sanitized } = validateThemeOverrides(overrides)
  const declarations: string[] = []

  // Colors
  if (sanitized.colors) {
    for (const [key, value] of Object.entries(sanitized.colors)) {
      if (value === undefined) continue
      const cssVar = colorKeyToCssVar(key)
      declarations.push(`  ${cssVar}: ${value};`)
    }
  }

  // Radius
  if (sanitized.radius) {
    declarations.push(`  --${CSS_VAR_PREFIX}-radius: ${sanitized.radius};`)
  }

  // Glass
  if (sanitized.glass) {
    if (sanitized.glass.opacity !== undefined) {
      declarations.push(
        `  --${CSS_VAR_PREFIX}-glass-opacity: ${sanitized.glass.opacity};`
      )
    }
    if (sanitized.glass.blur) {
      declarations.push(
        `  --${CSS_VAR_PREFIX}-glass-blur: ${sanitized.glass.blur};`
      )
    }
    if (sanitized.glass.saturate) {
      declarations.push(
        `  --${CSS_VAR_PREFIX}-glass-saturate: ${sanitized.glass.saturate};`
      )
    }
    if (sanitized.glass.borderOpacity !== undefined) {
      declarations.push(
        `  --${CSS_VAR_PREFIX}-glass-border-opacity: ${sanitized.glass.borderOpacity};`
      )
    }
  }

  if (declarations.length === 0) {
    return ''
  }

  return `${selector} {\n${declarations.join('\n')}\n}`
}
