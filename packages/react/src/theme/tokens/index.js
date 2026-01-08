/**
 * Clarity Chat - Design Tokens
 *
 * Centralized exports for all design tokens.
 * These tokens form the foundation of the theming system.
 */
// Colors
export * from './colors';
export { lightColors, darkColors, highContrastLightColors, highContrastDarkColors, CSS_VAR_PREFIX, getCSSVarName, getCSSVar, getHSLVar, } from './colors';
// Spacing
export * from './spacing';
export { spacingTokens, semanticSpacing } from './spacing';
// Border Radius
export * from './radius';
export { radiusTokens, radiusPresets, computedRadius, semanticRadius, } from './radius';
// Shadows
export * from './shadows';
export { lightShadows, darkShadows, coloredShadows, semanticShadows, } from './shadows';
// Typography
export * from './typography';
export { fontFamilyTokens, fontSizeTokens, fontWeightTokens, letterSpacingTokens, lineHeightTokens, semanticTypography, } from './typography';
// Animations
export * from './animations';
export { durationTokens, easingTokens, animationPresets, semanticAnimations, } from './animations';
/**
 * Consolidated tokens object for convenience
 */
export const tokens = {
    colors: {
        light: () => import('./colors').then((m) => m.lightColors),
        dark: () => import('./colors').then((m) => m.darkColors),
        highContrastLight: () => import('./colors').then((m) => m.highContrastLightColors),
        highContrastDark: () => import('./colors').then((m) => m.highContrastDarkColors),
    },
    spacing: () => import('./spacing').then((m) => m.spacingTokens),
    radius: () => import('./radius').then((m) => m.radiusTokens),
    shadows: {
        light: () => import('./shadows').then((m) => m.lightShadows),
        dark: () => import('./shadows').then((m) => m.darkShadows),
    },
    typography: {
        fontFamily: () => import('./typography').then((m) => m.fontFamilyTokens),
        fontSize: () => import('./typography').then((m) => m.fontSizeTokens),
        fontWeight: () => import('./typography').then((m) => m.fontWeightTokens),
        letterSpacing: () => import('./typography').then((m) => m.letterSpacingTokens),
        lineHeight: () => import('./typography').then((m) => m.lineHeightTokens),
    },
    animations: {
        duration: () => import('./animations').then((m) => m.durationTokens),
        easing: () => import('./animations').then((m) => m.easingTokens),
        presets: () => import('./animations').then((m) => m.animationPresets),
    },
};
//# sourceMappingURL=index.js.map