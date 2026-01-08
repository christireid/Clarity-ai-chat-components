/**
 * Clarity Chat - Theme System
 *
 * Modern, flexible theming for Clarity Chat components.
 * World-class theming capabilities with 24 built-in presets,
 * advanced color utilities, and comprehensive accessibility support.
 *
 * Features:
 * - 24 built-in theme presets (12 light/dark pairs)
 * - Simple API for custom themes
 * - CSS custom properties for runtime customization
 * - Full TypeScript support
 * - WCAG accessibility compliance (AA/AAA)
 * - Color blindness simulation
 * - Harmonious palette generation
 * - Theme composition with mixins
 * - Interactive theme customizer component
 * - Export to CSS/JSON/Tailwind
 *
 * @example
 * // Zero config - just works
 * import '@clarity-chat/react/styles.css'
 * <ClarityChat api="/api/chat" />
 *
 * @example
 * // Theme preset selection (24 presets available)
 * <ThemeProvider defaultTheme={{ preset: 'ocean-dark' }}>
 *   <ClarityChat api="/api/chat" />
 * </ThemeProvider>
 *
 * @example
 * // Simple brand customization
 * import { createTheme } from '@clarity-chat/react'
 * const theme = createTheme({ brandColor: '#6366f1' })
 *
 * @example
 * // Advanced theme composition
 * import { ThemeBuilder, ColorMixins, BorderMixins } from '@clarity-chat/react'
 * const theme = new ThemeBuilder()
 *   .extend('neutral')
 *   .mode('dark')
 *   .colors(ColorMixins.brand('#6366f1'))
 *   .borders(BorderMixins.extraRounded())
 *   .build()
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
export { animationSpeedMap, isCompleteThemeConfig, normalizeThemeInput, } from './theme-types';
// Theme context
export { ThemeContext } from './theme-context';
// useTheme hook
export { useTheme } from './use-theme';
// Theme Provider
export { ThemeProvider } from './ThemeProvider';
// Theme Toggle
export { ThemeToggle } from './ThemeToggle';
// Theme Mode Selector
export { ThemeModeSelector, } from './ThemeModeSelector';
// ============================================================================
// Theme Creation & Customization
// ============================================================================
// Simplified theme creation API
export { createTheme, mergeTheme, generateCSSVariables, applyThemeVariables, removeThemeVariables, getThemeCSS, } from './create-theme';
// Color utilities
export { hexToHSLString, hslStringToHex, toHSLString, adjustLightness, adjustSaturation, getContrastRatio, meetsContrastRequirement, getContrastingForeground, generatePaletteFromBrandColor, isHexColor, isHSLString, } from './color-utils';
// ============================================================================
// Theme Presets
// ============================================================================
// Theme presets
export { modernThemes as themes, modernThemes, modernThemeMetadata as themeMetadata, modernThemeMetadata, getModernThemeNames as getThemeNames, getModernThemeNames, getAllModernThemes as getAllThemes, getAllModernThemes, isValidModernThemeName as isValidThemeName, isValidModernThemeName, getModernDarkVariant as getDarkVariant, getModernDarkVariant, getModernLightVariant as getLightVariant, getModernLightVariant, 
// Individual theme exports
defaultLightTheme, defaultDarkTheme, neutralLightTheme, neutralDarkTheme, vibrantLightTheme, vibrantDarkTheme, highContrastLightTheme, highContrastDarkTheme, 
// Template-specific semantic themes
codeEditorTheme, supportChatTheme, aiAssistantTheme, devToolsTheme, enterpriseTheme, creativeTheme, accessibleTheme, nightModeTheme, } from './modern-presets';
// ============================================================================
// Design Tokens
// ============================================================================
// Color tokens
export { lightColors, darkColors, highContrastLightColors, highContrastDarkColors, CSS_VAR_PREFIX, getCSSVarName, getCSSVar, getHSLVar, } from './tokens/colors';
// Spacing tokens
export { spacingTokens, semanticSpacing, } from './tokens/spacing';
// Radius tokens
export { radiusTokens, radiusPresets, computedRadius, semanticRadius, } from './tokens/radius';
// Shadow tokens
export { lightShadows, darkShadows, coloredShadows, semanticShadows, } from './tokens/shadows';
// Typography tokens
export { fontFamilyTokens, fontSizeTokens, fontWeightTokens, letterSpacingTokens, lineHeightTokens, semanticTypography, } from './tokens/typography';
// Animation tokens
export { durationTokens, easingTokens, animationPresets, semanticAnimations, } from './tokens/animations';
// ============================================================================
// Additional Exports
// ============================================================================
// Design tokens object
export { designTokens } from './design-tokens';
// Theme builder utilities
export { applyThemeToDocument, exportTheme, importTheme, getTheme, getThemeMetadata, createThemeVariants, validateTheme, hexToHsl, hslToHex, checkContrast, generateForegroundColor, generatePalette, } from './theme-builder';
// Theme validation utilities
export { validateThemeConfig, assertValidTheme, validateThemeWithWarnings, } from './theme-validator';
// Color contrast validation (WCAG compliance)
export { checkContrast as checkColorContrast, validateAllColors, generateContrastReport, parseHSL, hslToRgb, getRelativeLuminance, semanticColorPairs, darkModeColorPairs, } from './color-contrast';
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
rgbToOklch, oklchToRgb, hexToOklch, oklchToHex, 
// Color blindness simulation
simulateColorBlindness, getAllColorBlindnessSimulations, areColorsDistinguishable, 
// Harmonious palettes
generateHarmoniousPalette, generateColorScale, generateSemanticColors, 
// Gradients
generateGradient, generateSmoothGradient, generateMeshGradient, 
// Color mixing
mixColors, blendColors, 
// Auto-adjustment
autoAdjustForContrast, getReadableTextColor, analyzeColor, } from './color-advanced';
// ============================================================================
// Theme Composition
// ============================================================================
// Theme builder and mixins
export { 
// Theme builder class
ThemeBuilder, 
// Color mixins
ColorMixins, 
// Typography mixins
TypographyMixins, 
// Border mixins
BorderMixins, 
// Shadow mixins
ShadowMixins, 
// Theme composition utilities
composeThemes, createVariant, ThemeVariants, 
// Quick theme creation
createBrandTheme, createMultiColorTheme, } from './theme-composer';
// ============================================================================
// New Theme Presets
// ============================================================================
// Additional theme presets
export { 
// Ocean theme
oceanLightTheme, oceanDarkTheme, oceanThemeMetadata, 
// Sunset theme
sunsetLightTheme, sunsetDarkTheme, sunsetThemeMetadata, 
// Forest theme
forestLightTheme, forestDarkTheme, forestThemeMetadata, 
// Rose theme
roseLightTheme, roseDarkTheme, roseThemeMetadata, 
// Midnight theme
midnightLightTheme, midnightDarkTheme, midnightThemeMetadata, 
// Slate theme
slateLightTheme, slateDarkTheme, slateThemeMetadata, 
// Emerald theme
emeraldLightTheme, emeraldDarkTheme, emeraldThemeMetadata, 
// Amber theme
amberLightTheme, amberDarkTheme, amberThemeMetadata, 
// Category helpers
getThemesByCategory, getLightThemes, getDarkThemes, 
// Industry-specific aliases
financeTheme, healthcareTheme, ecommerceTheme, lifestyleTheme, } from './modern-presets';
//# sourceMappingURL=index.js.map