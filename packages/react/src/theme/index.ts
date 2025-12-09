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

// Theme types
export {
  type ThemeMode,
  type ThemeConfig,
  type ThemeContextValue,
  type ThemePresetName,
  type ThemeAnimationSpeed,
  animationSpeedMap,
  isCompleteThemeConfig,
  normalizeThemeInput,
} from './theme-types'

// Theme context
export { ThemeContext } from './theme-context'

// useTheme hook
export { useTheme } from './use-theme'

// Theme Provider
export { ThemeProvider, type ThemeProviderProps } from './ThemeProvider'

// Theme Toggle
export { ThemeToggle, type ThemeToggleProps } from './ThemeToggle'

// Theme Mode Selector
export {
  ThemeModeSelector,
  type ThemeModeSelectorProps,
} from './ThemeModeSelector'

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

// Theme presets
export {
  modernThemes as themes,
  modernThemes,
  modernThemeMetadata as themeMetadata,
  modernThemeMetadata,
  getModernThemeNames as getThemeNames,
  getModernThemeNames,
  getAllModernThemes as getAllThemes,
  getAllModernThemes,
  isValidModernThemeName as isValidThemeName,
  isValidModernThemeName,
  getModernDarkVariant as getDarkVariant,
  getModernDarkVariant,
  getModernLightVariant as getLightVariant,
  getModernLightVariant,
  type ModernThemePresetName,
  // Individual theme exports
  defaultLightTheme,
  defaultDarkTheme,
  neutralLightTheme,
  neutralDarkTheme,
  vibrantLightTheme,
  vibrantDarkTheme,
  highContrastLightTheme,
  highContrastDarkTheme,
  // Template-specific semantic themes
  codeEditorTheme,
  supportChatTheme,
  aiAssistantTheme,
  devToolsTheme,
  enterpriseTheme,
  creativeTheme,
  accessibleTheme,
  nightModeTheme,
} from './modern-presets'

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
// Additional Exports
// ============================================================================

// Design tokens object
export { designTokens, type DesignTokens } from './design-tokens'

// Theme builder utilities
export {
  applyThemeToDocument,
  exportTheme,
  importTheme,
  getTheme,
  getThemeMetadata,
  createThemeVariants,
  validateTheme,
  hexToHsl,
  hslToHex,
  checkContrast,
  generateForegroundColor,
  generatePalette,
} from './theme-builder'

// Theme validation utilities
export {
  validateThemeConfig,
  assertValidTheme,
  validateThemeWithWarnings,
  type ValidationResult,
  type ValidationIssue,
} from './theme-validator'
