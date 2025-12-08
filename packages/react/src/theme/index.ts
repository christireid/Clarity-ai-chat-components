/**
 * Clarity Chat - Theme System
 *
 * Modern, flexible theming for Clarity Chat components.
 *
 * Features:
 * - 8 built-in theme presets (light/dark variants)
 * - Simple API for custom themes
 * - CSS custom properties for runtime customization
 * - Full TypeScript support
 * - WCAG accessibility compliance
 * - Backwards compatible with existing themes
 *
 * @example
 * // Zero config - just works
 * import '@clarity-chat/react/styles.css'
 * <ClarityChat api="/api/chat" />
 *
 * @example
 * // Theme preset selection
 * <ThemeProvider defaultTheme={{ preset: 'neutral-dark' }}>
 *   <ClarityChat api="/api/chat" />
 * </ThemeProvider>
 *
 * @example
 * // Simple brand customization
 * import { createTheme } from '@clarity-chat/react'
 * const theme = createTheme({ brandColor: '#6366f1' })
 *
 * @example
 * // Pure CSS override (simplest)
 * :root {
 *   --clarity-primary: 239 84% 67%;
 *   --clarity-radius: 0.75rem;
 * }
 */

// ============================================================================
// Core Theme System
// ============================================================================

// Theme Provider and Hook
export {
  ThemeProvider,
  useTheme,
  ThemeToggle,
  type ThemeMode,
  type ThemeConfig,
  type ThemeProviderProps,
  type ThemeToggleProps,
} from './ThemeProvider'

// Theme Configuration Types
export type {
  HSLColor,
  ColorConfig,
  TypographyConfig,
  SpacingConfig,
  BorderConfig,
  ShadowConfig,
  AnimationConfig,
  ComponentOverrides,
  CompleteThemeConfig,
  PartialThemeConfig,
  ThemeMetadata,
  ExportableTheme,
} from './theme-config'

// ============================================================================
// Theme Creation & Customization
// ============================================================================

// Simplified theme creation API
export {
  createTheme,
  mergeTheme,
  generateCSSVariables,
  applyThemeVariables,
  removeThemeVariables,
  getThemeCSS,
  type SimpleThemeConfig,
} from './create-theme'

// Color utilities
export {
  hexToHSLString,
  hslStringToHex,
  toHSLString,
  adjustLightness,
  adjustSaturation,
  getContrastRatio,
  meetsContrastRequirement,
  getContrastingForeground,
  generatePaletteFromBrandColor,
  isHexColor,
  isHSLString,
  type HSLColor as HSLColorObject,
  type RGBColor,
} from './color-utils'

// ============================================================================
// Theme Presets
// ============================================================================

// Modern theme presets (new architecture)
export {
  modernThemes,
  modernThemeMetadata,
  getModernThemeNames,
  getAllModernThemes,
  isValidModernThemeName,
  getModernDarkVariant,
  getModernLightVariant,
  type ModernThemePresetName,
  // Individual theme exports
  defaultLightTheme as modernDefaultLight,
  defaultDarkTheme as modernDefaultDark,
  neutralLightTheme,
  neutralDarkTheme,
  vibrantLightTheme as modernVibrantLight,
  vibrantDarkTheme as modernVibrantDark,
  highContrastLightTheme,
  highContrastDarkTheme,
} from './modern-presets'

// Legacy presets (backwards compatibility)
// Re-export everything from the existing presets.ts file
export * from './presets'

// ============================================================================
// Design Tokens
// ============================================================================

// Color tokens
export {
  lightColors,
  darkColors,
  highContrastLightColors,
  highContrastDarkColors,
  CSS_VAR_PREFIX,
  getCSSVarName,
  getCSSVar,
  getHSLVar,
  type ColorTokens,
  type PartialColorTokens,
  type ColorValue,
} from './tokens/colors'

// Spacing tokens
export {
  spacingTokens,
  semanticSpacing,
  type SpacingTokens,
} from './tokens/spacing'

// Radius tokens
export {
  radiusTokens,
  radiusPresets,
  computedRadius,
  semanticRadius,
  type RadiusTokens,
  type RadiusPreset,
} from './tokens/radius'

// Shadow tokens
export {
  lightShadows,
  darkShadows,
  coloredShadows,
  semanticShadows,
  type ShadowTokens,
} from './tokens/shadows'

// Typography tokens
export {
  fontFamilyTokens,
  fontSizeTokens,
  fontWeightTokens,
  letterSpacingTokens,
  lineHeightTokens,
  semanticTypography,
  type FontFamilyTokens,
  type FontSizeTokens,
  type FontWeightTokens,
} from './tokens/typography'

// Animation tokens
export {
  durationTokens,
  easingTokens,
  animationPresets,
  semanticAnimations,
  type DurationTokens,
  type EasingTokens,
} from './tokens/animations'

// ============================================================================
// Legacy Exports (Backwards Compatibility)
// ============================================================================

// Legacy design tokens object
export { designTokens, type DesignTokens } from './design-tokens'

// Legacy theme builder functions
export {
  createTheme as createThemeLegacy,
  applyThemeToDocument,
  exportTheme,
  importTheme,
  getTheme,
  getThemeNames as getThemeNamesLegacy,
  getThemeMetadata,
  getAllThemes as getAllThemesLegacy,
  createThemeVariants,
  validateTheme,
  hexToHsl,
  hslToHex,
  adjustLightness as adjustLightnessLegacy,
  getContrastRatio as getContrastRatioLegacy,
  checkContrast,
  generateForegroundColor,
  generatePalette,
} from './theme-builder'
