/**
 * Theme Customization Types
 *
 * Type definitions for safe customer theme customization.
 */

/**
 * Color tokens that can be customized.
 * Values can be OKLCH (e.g., "60% 0.2 265"), hex (#6366f1), or rgb/hsl.
 */
export interface ColorOverrides {
  /** Primary brand color */
  primary?: string
  /** Text on primary color */
  primaryForeground?: string
  /** Secondary surface color */
  secondary?: string
  /** Text on secondary */
  secondaryForeground?: string
  /** Accent/highlight color */
  accent?: string
  /** Text on accent */
  accentForeground?: string
  /** Muted background */
  muted?: string
  /** Muted text */
  mutedForeground?: string
  /** Page background */
  background?: string
  /** Default text color */
  foreground?: string
  /** Card background */
  card?: string
  /** Card text */
  cardForeground?: string
  /** Popover background */
  popover?: string
  /** Popover text */
  popoverForeground?: string
  /** Border color */
  border?: string
  /** Input border */
  input?: string
  /** Focus ring color */
  ring?: string
  /** Destructive/error color */
  destructive?: string
  /** Text on destructive */
  destructiveForeground?: string
  /** Success color */
  success?: string
  /** Warning color */
  warning?: string
}

/**
 * Glass effect parameters with safe bounds.
 */
export interface GlassOverrides {
  /** Background opacity (0.5 - 0.95) */
  opacity?: number
  /** Blur amount (4px - 24px) */
  blur?: string
  /** Color saturation (100% - 200%) */
  saturate?: string
  /** Border opacity (0.05 - 0.4) */
  borderOpacity?: number
}

/**
 * Complete theme overrides object.
 */
export interface ThemeOverrides {
  /** Color token overrides */
  colors?: ColorOverrides
  /** Border radius (e.g., "0.5rem", "8px") */
  radius?: string
  /** Glass effect parameters */
  glass?: GlassOverrides
}

/**
 * Options for applying theme overrides.
 */
export interface ApplyOptions {
  /** Element to apply overrides to (default: document.documentElement) */
  scope?: HTMLElement
  /** Which theme mode to apply to ('light' | 'dark' | 'both') */
  mode?: 'light' | 'dark' | 'both'
  /** Persist overrides to localStorage */
  persist?: boolean
  /** localStorage key for persistence */
  storageKey?: string
}

/**
 * Validation result for a single value.
 */
export interface ValidationResult {
  valid: boolean
  sanitized?: string | number
  error?: string
}

/**
 * Allowlisted token keys that can be customized.
 */
export const CUSTOMIZABLE_TOKENS = [
  // Colors
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'accent',
  'accentForeground',
  'muted',
  'mutedForeground',
  'background',
  'foreground',
  'card',
  'cardForeground',
  'popover',
  'popoverForeground',
  'border',
  'input',
  'ring',
  'destructive',
  'destructiveForeground',
  'success',
  'warning',
  // Layout
  'radius',
  // Glass
  'glassOpacity',
  'glassBlur',
  'glassSaturate',
  'glassBorderOpacity',
] as const

export type CustomizableToken = (typeof CUSTOMIZABLE_TOKENS)[number]

/**
 * Safe bounds for glass parameters.
 */
export const GLASS_BOUNDS = {
  opacity: { min: 0.5, max: 0.95, default: 0.7 },
  blur: { min: 4, max: 24, default: 12 },
  saturate: { min: 100, max: 200, default: 150 },
  borderOpacity: { min: 0.05, max: 0.4, default: 0.2 },
} as const

/**
 * Storage key for persisted overrides.
 */
export const DEFAULT_STORAGE_KEY = 'clarity-theme-overrides'
