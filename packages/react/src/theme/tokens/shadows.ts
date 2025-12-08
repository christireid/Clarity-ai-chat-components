/**
 * Clarity Chat - Shadow Tokens
 *
 * Elevation system using box-shadow for depth perception.
 * Includes both neutral and colored shadows.
 */

/**
 * Shadow scale for elevation levels
 */
export interface ShadowTokens {
  none: string
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
}

/**
 * Light mode shadows
 * Subtle, natural-looking shadows
 */
export const lightShadows: ShadowTokens = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}

/**
 * Dark mode shadows
 * More pronounced for visibility on dark backgrounds
 */
export const darkShadows: ShadowTokens = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
}

/**
 * Colored shadow generators
 * Uses CSS custom properties for dynamic color
 */
export const coloredShadows = {
  /**
   * Primary color glow (for focus states, CTAs)
   */
  primary: '0 4px 14px -3px hsl(var(--clarity-primary) / 0.35)',
  primaryLg: '0 8px 20px -4px hsl(var(--clarity-primary) / 0.4)',

  /**
   * Success color glow (for positive feedback)
   */
  success: '0 4px 14px -3px hsl(var(--clarity-success) / 0.35)',

  /**
   * Warning color glow (for alerts)
   */
  warning: '0 4px 14px -3px hsl(var(--clarity-warning) / 0.35)',

  /**
   * Destructive/error color glow
   */
  destructive: '0 4px 14px -3px hsl(var(--clarity-destructive) / 0.35)',

  /**
   * Info color glow
   */
  info: '0 4px 14px -3px hsl(var(--clarity-info) / 0.35)',
} as const

/**
 * Semantic shadow aliases for components
 */
export const semanticShadows = {
  // Cards and panels
  card: lightShadows.sm,
  cardHover: lightShadows.md,
  cardActive: lightShadows.xs,

  // Dropdowns and menus
  dropdown: lightShadows.lg,
  menu: lightShadows.lg,

  // Modals and dialogs
  modal: lightShadows['2xl'],
  dialog: lightShadows.xl,

  // Popovers and tooltips
  popover: lightShadows.md,
  tooltip: lightShadows.sm,

  // Buttons
  button: lightShadows.xs,
  buttonHover: lightShadows.sm,
  buttonActive: lightShadows.inner,

  // Focus rings (use colored shadows)
  focusRing: coloredShadows.primary,

  // Toast notifications
  toast: lightShadows.lg,

  // Floating action buttons
  fab: lightShadows.lg,
  fabHover: lightShadows.xl,
} as const

export type SemanticShadowKey = keyof typeof semanticShadows
export type ColoredShadowKey = keyof typeof coloredShadows
