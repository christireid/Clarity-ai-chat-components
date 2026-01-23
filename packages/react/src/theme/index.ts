/**
 * Clarity Chat - Theme System
 *
 * A consolidated, minimal theme system with exactly TWO built-in themes:
 * - Light (default)
 * - Dark
 *
 * Features:
 * - Two built-in themes only (light/dark)
 * - Safe customer customization API
 * - CSS custom properties for runtime customization
 * - Premium glassmorphism with accessibility fallbacks
 * - WCAG AA accessibility compliance
 * - Full TypeScript support
 *
 * @example
 * // Zero config - just works
 * import '@clarity-chat/react/styles.css'
 * <ClarityChat api="/api/chat" />
 *
 * @example
 * // Theme toggle (light/dark only)
 * <ThemeProvider defaultTheme="light">
 *   <ClarityChat api="/api/chat" />
 *   <ThemeToggle />
 * </ThemeProvider>
 *
 * @example
 * // Customer customization via runtime API
 * import { applyThemeOverrides } from '@clarity-chat/react'
 * applyThemeOverrides({
 *   colors: { primary: '#6366f1' },
 *   radius: '0.75rem',
 *   glass: { opacity: 0.8, blur: '16px' },
 * }, { persist: true });
 *
 * @example
 * // Customer customization via CSS (recommended)
 * // In your-brand-theme.css (import after clarity styles):
 * :root {
 *   --clarity-primary: 60% 0.2 265;
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

// Color contrast validation (WCAG compliance)
export {
  checkContrast as checkColorContrast,
  validateAllColors,
  generateContrastReport,
  parseHSL,
  hslToRgb,
  getRelativeLuminance,
  semanticColorPairs,
  darkModeColorPairs,
  type ContrastResult,
  type ColorPair,
  type ContrastReport,
} from './color-contrast'

// NOTE:
// `migrate-colors` is a Node-only codemod (uses `fs`/`path`) and should not be
// exported from the browser-facing theme entrypoint. Keeping it out of the main
// bundle prevents Vite/Storybook from attempting to resolve Node built-ins.
// ============================================================================
// Advanced Color Utilities
// ============================================================================

// Advanced color manipulation
export {
  // OKLCH color space
  rgbToOklch,
  oklchToRgb,
  hexToOklch,
  oklchToHex,
  type OKLCHColor,
  // Color blindness simulation
  simulateColorBlindness,
  getAllColorBlindnessSimulations,
  areColorsDistinguishable,
  type ColorBlindnessType,
  // Harmonious palettes
  generateHarmoniousPalette,
  generateColorScale,
  generateSemanticColors,
  type ColorHarmony,
  // Gradients
  generateGradient,
  generateSmoothGradient,
  generateMeshGradient,
  type GradientDirection,
  type GradientStop,
  // Color mixing
  mixColors,
  blendColors,
  type BlendMode,
  // Auto-adjustment
  autoAdjustForContrast,
  getReadableTextColor,
  analyzeColor,
} from './color-advanced'

// ============================================================================
// Theme Composition
// ============================================================================

// Theme builder and mixins
export {
  // Theme builder class
  ThemeBuilder,
  type ThemeBuilderOptions,
  // Color mixins
  ColorMixins,
  type ColorMixin,
  // Typography mixins
  TypographyMixins,
  // Border mixins
  BorderMixins,
  // Shadow mixins
  ShadowMixins,
  // Theme composition utilities
  composeThemes,
  createVariant,
  ThemeVariants,
  // Quick theme creation
  createBrandTheme,
  createMultiColorTheme,
  type ThemeMixin,
  type ThemeVariantFn,
} from './theme-composer'

// ============================================================================
// New Theme Presets
// ============================================================================

// Additional theme presets
export {
  // Ocean theme
  oceanLightTheme,
  oceanDarkTheme,
  oceanThemeMetadata,
  // Sunset theme
  sunsetLightTheme,
  sunsetDarkTheme,
  sunsetThemeMetadata,
  // Forest theme
  forestLightTheme,
  forestDarkTheme,
  forestThemeMetadata,
  // Rose theme
  roseLightTheme,
  roseDarkTheme,
  roseThemeMetadata,
  // Midnight theme
  midnightLightTheme,
  midnightDarkTheme,
  midnightThemeMetadata,
  // Slate theme
  slateLightTheme,
  slateDarkTheme,
  slateThemeMetadata,
  // Emerald theme
  emeraldLightTheme,
  emeraldDarkTheme,
  emeraldThemeMetadata,
  // Amber theme
  amberLightTheme,
  amberDarkTheme,
  amberThemeMetadata,
  // Category helpers
  getThemesByCategory,
  getLightThemes,
  getDarkThemes,
  // Industry-specific aliases (deprecated - all now point to light/dark)
  financeTheme,
  healthcareTheme,
  ecommerceTheme,
  lifestyleTheme,
} from './modern-presets'

// ============================================================================
// Theme Customization API
// ============================================================================

// Safe customer theming with validated overrides
export {
  // Application functions
  applyThemeOverrides,
  clearThemeOverrides,
  getPersistedOverrides,
  loadPersistedOverrides,
  generateOverrideCSS,
  // Validation functions
  validateThemeOverrides,
  validateColor,
  validateLength,
  validateNumber,
  validateGlassOverrides,
  // Types
  type ThemeOverrides,
  type ColorOverrides,
  type GlassOverrides,
  type ApplyOptions,
  type ValidationResult as CustomizationValidationResult,
  type CustomizableToken,
  // Constants
  CUSTOMIZABLE_TOKENS,
  GLASS_BOUNDS,
  DEFAULT_STORAGE_KEY,
} from './customization'
