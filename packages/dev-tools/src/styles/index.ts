/**
 * Clarity Dev Tools - Styles Export
 *
 * This module provides the CSS styling for the dev tools components.
 * Import this in your application to apply the default styles.
 *
 * @example
 * ```tsx
 * // In your app entry file
 * import '@clarity-chat/dev-tools/styles'
 *
 * // Or import the CSS directly
 * import '@clarity-chat/dev-tools/dist/styles/dev-tools.css'
 * ```
 *
 * @example
 * ```tsx
 * // With theme switching
 * <div data-theme="dark">
 *   <DevToolsDashboard />
 * </div>
 * ```
 */

// Re-export path for bundlers
export const cssPath = './dev-tools.css'

// Export CSS variables for programmatic access
export const cssVariables = {
  // Colors
  colorPrimary: 'var(--dt-color-primary-500)',
  colorSuccess: 'var(--dt-color-success-500)',
  colorWarning: 'var(--dt-color-warning-500)',
  colorError: 'var(--dt-color-error-500)',

  // Backgrounds
  bgPrimary: 'var(--dt-bg-primary)',
  bgSecondary: 'var(--dt-bg-secondary)',
  bgTertiary: 'var(--dt-bg-tertiary)',

  // Text
  textPrimary: 'var(--dt-text-primary)',
  textSecondary: 'var(--dt-text-secondary)',
  textTertiary: 'var(--dt-text-tertiary)',

  // Borders
  borderPrimary: 'var(--dt-border-primary)',
  borderFocus: 'var(--dt-border-focus)',

  // Shadows
  shadowSm: 'var(--dt-shadow-sm)',
  shadowMd: 'var(--dt-shadow-md)',
  shadowLg: 'var(--dt-shadow-lg)',

  // Typography
  fontSans: 'var(--dt-font-sans)',
  fontMono: 'var(--dt-font-mono)',

  // Spacing
  space1: 'var(--dt-space-1)',
  space2: 'var(--dt-space-2)',
  space3: 'var(--dt-space-3)',
  space4: 'var(--dt-space-4)',
  space6: 'var(--dt-space-6)',
  space8: 'var(--dt-space-8)',

  // Radius
  radiusSm: 'var(--dt-radius-sm)',
  radiusMd: 'var(--dt-radius-md)',
  radiusLg: 'var(--dt-radius-lg)',
  radiusXl: 'var(--dt-radius-xl)',

  // Transitions
  transitionFast: 'var(--dt-transition-fast)',
  transitionBase: 'var(--dt-transition-base)',
  transitionSlow: 'var(--dt-transition-slow)',
} as const

// Type for CSS variables
export type CSSVariableKey = keyof typeof cssVariables
