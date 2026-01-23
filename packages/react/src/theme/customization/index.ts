/**
 * Theme Customization API
 *
 * Safe customer theming with validated overrides.
 *
 * @example
 * ```typescript
 * import {
 *   applyThemeOverrides,
 *   clearThemeOverrides,
 *   loadPersistedOverrides,
 * } from '@clarity-chat/react';
 *
 * // Apply brand colors
 * applyThemeOverrides({
 *   colors: {
 *     primary: '#3b82f6',
 *     primaryForeground: '#ffffff',
 *   },
 *   radius: '0.75rem',
 *   glass: {
 *     opacity: 0.8,
 *     blur: '16px',
 *   },
 * });
 *
 * // Persist to localStorage
 * applyThemeOverrides(overrides, { persist: true });
 *
 * // Load on app start
 * loadPersistedOverrides();
 *
 * // Clear overrides
 * clearThemeOverrides();
 * ```
 */

// Types
export type {
  ThemeOverrides,
  ColorOverrides,
  GlassOverrides,
  ApplyOptions,
  ValidationResult,
  CustomizableToken,
} from './types'

export { CUSTOMIZABLE_TOKENS, GLASS_BOUNDS, DEFAULT_STORAGE_KEY } from './types'

// Validation
export {
  validateThemeOverrides,
  validateColor,
  validateLength,
  validateNumber,
  validateGlassOverrides,
} from './validate-theme'

// Application
export {
  applyThemeOverrides,
  clearThemeOverrides,
  getPersistedOverrides,
  loadPersistedOverrides,
  generateOverrideCSS,
} from './apply-overrides'
