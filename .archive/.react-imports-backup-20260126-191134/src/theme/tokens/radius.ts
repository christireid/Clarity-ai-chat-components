/**
 * Clarity Chat - Border Radius Tokens
 *
 * Consistent border radius scale for rounded corners.
 * Provides both size-based and semantic naming.
 */

/**
 * Border radius scale
 */
export interface RadiusTokens {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  full: string
}

/**
 * Default radius scale
 * Uses rem for consistency with spacing
 */
export const radiusTokens: RadiusTokens = {
  none: '0',
  sm: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px', // Fully rounded (pills, circles)
}

/**
 * Radius preset configurations
 * Users can choose a preset to set all component radii consistently
 */
export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'

/**
 * Radius preset values
 * Maps preset name to base --clarity-radius value
 */
export const radiusPresets: Record<RadiusPreset, string> = {
  none: '0',
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '1rem', // full preset uses 1rem as base, individual components can use 9999px for pills
}

/**
 * Get computed radius for a size relative to the base radius
 * Uses calc() to derive sizes from the --clarity-radius variable
 */
export const computedRadius = {
  // Smaller than base
  sm: 'calc(var(--clarity-radius) - 4px)',
  // Base radius (--clarity-radius)
  md: 'calc(var(--clarity-radius) - 2px)',
  // Larger than base
  lg: 'var(--clarity-radius)',
  xl: 'calc(var(--clarity-radius) + 4px)',
  '2xl': 'calc(var(--clarity-radius) + 8px)',
  // Full is always fully rounded
  full: '9999px',
} as const

/**
 * Semantic radius aliases for common components
 */
export const semanticRadius = {
  // Buttons
  button: computedRadius.lg,
  buttonSm: computedRadius.md,
  buttonLg: computedRadius.xl,

  // Inputs
  input: computedRadius.lg,
  textarea: computedRadius.lg,

  // Cards and containers
  card: computedRadius.xl,
  panel: computedRadius.xl,
  modal: computedRadius['2xl'],

  // Messages
  messageBubble: computedRadius.xl,
  messageTail: computedRadius.md,

  // Badges and tags
  badge: computedRadius.full,
  tag: computedRadius.md,

  // Avatars
  avatar: computedRadius.full,
  avatarSquare: computedRadius.lg,

  // Tooltips and popovers
  tooltip: computedRadius.md,
  popover: computedRadius.lg,

  // Progress and indicators
  progress: computedRadius.full,
  skeleton: computedRadius.md,
} as const

export type SemanticRadiusKey = keyof typeof semanticRadius
