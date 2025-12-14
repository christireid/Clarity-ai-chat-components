/**
 * Clarity Dev Tools - Styles Export
 *
 * This module provides the CSS styling for the dev tools components.
 * Import this in your application to apply the default styles.
 *
 * @example
 * ```tsx
 * // Import all styles (bundled)
 * import '@clarity-chat/dev-tools/styles'
 *
 * // Or import specific modules for tree-shaking
 * import '@clarity-chat/dev-tools/styles/modules'
 * ```
 *
 * @example
 * ```tsx
 * // Import only the modules you need
 * import '@clarity-chat/dev-tools/styles/modules/_variables.css'
 * import '@clarity-chat/dev-tools/styles/modules/_dashboard.css'
 * import '@clarity-chat/dev-tools/styles/modules/_api-inspector.css'
 * ```
 *
 * @example
 * ```tsx
 * // With theme switching
 * <div data-theme="dark">
 *   <DevToolsDashboard />
 * </div>
 * ```
 *
 * Available CSS Modules:
 * - _variables.css    - CSS Custom Properties / Design Tokens
 * - _dark-mode.css    - Dark mode theme overrides
 * - _animations.css   - Keyframe animations
 * - _base.css         - Base element styles
 * - _dashboard.css    - Dashboard component styles
 * - _api-inspector.css - API Inspector panel styles
 * - _profiler.css     - Profiler panel styles
 * - _time-travel.css  - Time Travel panel styles
 * - _validation.css   - Validation form styles
 * - _model-comparison.css - Model Comparison panel styles
 * - _buttons.css      - Button component styles
 * - _components.css   - Common UI components (empty state, loading, tooltips, badges)
 * - _code-blocks.css  - Code block styles
 * - _utilities.css    - Utility classes and responsive design
 * - _error-boundary.css - Error boundary fallback styles
 * - _demo.css         - Demo page styles
 */

// Re-export path for bundlers
export const cssPath = './dev-tools.css'

// Modular CSS exports
export const modulesPath = './modules/index.css'

// Individual module paths for selective imports
export const cssModules = {
  variables: './modules/_variables.css',
  darkMode: './modules/_dark-mode.css',
  animations: './modules/_animations.css',
  base: './modules/_base.css',
  dashboard: './modules/_dashboard.css',
  apiInspector: './modules/_api-inspector.css',
  profiler: './modules/_profiler.css',
  timeTravel: './modules/_time-travel.css',
  validation: './modules/_validation.css',
  modelComparison: './modules/_model-comparison.css',
  buttons: './modules/_buttons.css',
  components: './modules/_components.css',
  codeBlocks: './modules/_code-blocks.css',
  utilities: './modules/_utilities.css',
  errorBoundary: './modules/_error-boundary.css',
  demo: './modules/_demo.css',
} as const

export type CSSModuleName = keyof typeof cssModules

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
