/**
 * Design Tokens for Clarity Chat Documentation
 *
 * Centralized design system values for consistent styling across the site.
 * These tokens ensure visual cohesion and make it easy to maintain design consistency.
 */

// =============================================================================
// SPACING SYSTEM
// =============================================================================

/**
 * Spacing scale based on 4px base unit
 * Follows an 8pt grid system for consistent vertical rhythm
 */
export const spacing = {
  // Micro spacing (for tight layouts, inline elements)
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px

  // Standard spacing (most common use cases)
  base: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px

  // Macro spacing (for sections, large gaps)
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
  '5xl': '8rem', // 128px
  '6xl': '12rem', // 192px
} as const

/**
 * Semantic spacing for specific contexts
 */
export const semanticSpacing = {
  // Component internal padding
  componentPadding: spacing.lg, // 24px
  componentPaddingSmall: spacing.md, // 12px
  componentPaddingLarge: spacing.xl, // 32px

  // Card spacing
  cardPadding: spacing.lg, // 24px
  cardGap: spacing.xl, // 32px

  // Section spacing
  sectionGap: spacing['3xl'], // 64px
  sectionGapLarge: spacing['4xl'], // 96px
  sectionPadding: spacing['2xl'], // 48px

  // Page spacing
  pageGutter: spacing.base, // 16px (mobile)
  pageGutterDesktop: spacing['2xl'], // 48px (desktop)

  // Content spacing
  paragraphGap: spacing.lg, // 24px
  headingMarginTop: spacing.xl, // 32px
  headingMarginBottom: spacing.md, // 12px

  // List spacing
  listItemGap: spacing.sm, // 8px
  nestedListIndent: spacing.lg, // 24px
} as const

// =============================================================================
// SHADOW SYSTEM
// =============================================================================

/**
 * Layered shadow system for depth hierarchy
 * Based on Material Design elevation principles
 *
 * Usage guidelines:
 * - xs: Subtle borders, hover states
 * - sm: Cards at rest, subtle elevation
 * - md: Dropdowns, popovers, floating elements
 * - lg: Modals, dialogs, important floating UI
 * - xl: Maximum elevation, rarely used
 * - inner: Inset shadows for pressed/active states
 */
export const shadows = {
  // No shadow
  none: 'none',

  // Extra subtle - barely perceptible depth
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',

  // Subtle - cards at rest, gentle elevation
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',

  // Default - hovering cards, dropdowns
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

  // Elevated - modals, important floating elements
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // Maximum elevation - rarely used, top-level overlays
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Extra large - hero elements, marketing sections
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',

  // Inset - pressed buttons, active states
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const

/**
 * Colored shadows for brand elements
 */
export const coloredShadows = {
  // Brand color glow (for CTAs, featured elements)
  brandGlow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
  brandGlowLarge: '0 0 0 6px rgba(59, 130, 246, 0.08)',

  // Success state glow
  successGlow: '0 0 0 3px rgba(34, 197, 94, 0.1)',

  // Error state glow
  errorGlow: '0 0 0 3px rgba(239, 68, 68, 0.1)',

  // Warning state glow
  warningGlow: '0 0 0 3px rgba(245, 158, 11, 0.1)',

  // Focus ring (for accessibility)
  focusRing: '0 0 0 3px rgba(59, 130, 246, 0.5)',
  focusRingDark: '0 0 0 3px rgba(96, 165, 250, 0.5)',
} as const

/**
 * Combined shadows for layered effects
 */
export const layeredShadows = {
  // Card with subtle glow on hover
  cardHover: `${shadows.md}, ${coloredShadows.brandGlow}`,

  // Button with focus ring
  buttonFocus: `${shadows.sm}, ${coloredShadows.focusRing}`,

  // Elevated card (stacked shadows for more depth)
  elevated: `${shadows.lg}, 0 0 0 1px rgba(0, 0, 0, 0.05)`,

  // Floating action button
  fab: `${shadows.lg}, 0 0 0 1px rgba(59, 130, 246, 0.1)`,
} as const

// =============================================================================
// BORDER RADIUS SYSTEM
// =============================================================================

/**
 * Border radius scale for consistent roundedness
 */
export const radius = {
  none: '0',
  sm: '0.25rem', // 4px - subtle rounding
  md: '0.5rem', // 8px - default rounding
  lg: '0.75rem', // 12px - cards, buttons
  xl: '1rem', // 16px - larger cards, sections
  '2xl': '1.5rem', // 24px - hero sections, featured elements
  '3xl': '2rem', // 32px - very large elements
  full: '9999px', // Fully rounded (pills, circles)
} as const

/**
 * Semantic radius for specific components
 */
export const semanticRadius = {
  button: radius.lg,
  card: radius.xl,
  input: radius.md,
  modal: radius.xl,
  badge: radius.full,
  tooltip: radius.md,
  codeBlock: radius.lg,
  image: radius.lg,
} as const

// =============================================================================
// Z-INDEX SYSTEM
// =============================================================================

/**
 * Z-index scale to prevent z-index wars
 * Each layer has a purpose and clear hierarchy
 */
export const zIndex = {
  base: 0, // Default layer
  dropdown: 10, // Dropdowns, tooltips
  sticky: 100, // Sticky headers, sidebars
  fixed: 200, // Fixed position elements
  overlay: 300, // Modal overlays, backdrops
  modal: 400, // Modals, dialogs
  popover: 500, // Popovers, context menus
  toast: 600, // Toast notifications
  tooltip: 700, // Tooltips (highest, always visible)
} as const

// =============================================================================
// TRANSITIONS
// =============================================================================

/**
 * Standard transition durations (in CSS format)
 */
export const transitionDuration = {
  instant: '100ms',
  fast: '150ms',
  normal: '200ms',
  moderate: '300ms',
  slow: '500ms',
  slower: '700ms',
} as const

/**
 * Standard transition timing functions
 */
export const transitionTiming = {
  easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  linear: 'linear',
} as const

/**
 * Complete transition strings for common use
 */
export const transitions = {
  fast: `all ${transitionDuration.fast} ${transitionTiming.easeOut}`,
  normal: `all ${transitionDuration.normal} ${transitionTiming.easeOut}`,
  moderate: `all ${transitionDuration.moderate} ${transitionTiming.easeOut}`,
  colors: `color ${transitionDuration.normal} ${transitionTiming.easeOut}, 
           background-color ${transitionDuration.normal} ${transitionTiming.easeOut}, 
           border-color ${transitionDuration.normal} ${transitionTiming.easeOut}`,
  transform: `transform ${transitionDuration.normal} ${transitionTiming.easeOut}`,
  opacity: `opacity ${transitionDuration.normal} ${transitionTiming.easeOut}`,
} as const

// =============================================================================
// BREAKPOINTS
// =============================================================================

/**
 * Responsive breakpoints (matches Tailwind defaults)
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

/**
 * Media query helpers
 */
export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,

  // Max-width queries
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,

  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',

  // Dark mode
  dark: '@media (prefers-color-scheme: dark)',
} as const

// =============================================================================
// CONTENT WIDTHS
// =============================================================================

/**
 * Maximum content widths for readability
 */
export const contentWidth = {
  // Text content (optimal reading line length: 60-75 characters)
  text: '65ch', // ~65 characters per line
  textNarrow: '55ch', // For larger text
  textWide: '80ch', // For dense content

  // Layout containers
  container: '1280px', // Main content container
  containerWide: '1536px', // Wide content
  containerNarrow: '896px', // Narrow content (e.g., blog posts)

  // Component widths
  prose: '68rem', // Prose content (like blog posts)
  sidebar: '16rem', // Sidebar width
  sidebarWide: '20rem', // Wide sidebar
} as const

// =============================================================================
// TYPOGRAPHY SCALE
// =============================================================================

/**
 * Fluid typography scale
 * Scales smoothly between mobile and desktop using clamp()
 */
export const fontSize = {
  // Body text
  xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12px → 14px
  sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14px → 16px
  base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', // 16px → 18px
  lg: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', // 18px → 20px
  xl: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', // 20px → 24px

  // Headings
  '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', // 24px → 30px
  '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)', // 30px → 36px
  '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)', // 36px → 48px
  '5xl': 'clamp(3rem, 2.5rem + 2.5vw, 3.75rem)', // 48px → 60px
  '6xl': 'clamp(3.75rem, 3rem + 3.75vw, 4.5rem)', // 60px → 72px
  '7xl': 'clamp(4.5rem, 3.5rem + 5vw, 6rem)', // 72px → 96px
} as const

/**
 * Line height scale for optimal readability
 */
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '1.75',

  // Semantic line heights
  heading: '1.2',
  body: '1.6',
  code: '1.5',
} as const

/**
 * Font weight scale
 */
export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const

// =============================================================================
// ANIMATION PERFORMANCE
// =============================================================================

/**
 * Properties that are GPU-accelerated (animate these for 60fps)
 */
export const gpuAcceleratedProps = ['transform', 'opacity', 'filter'] as const

/**
 * Properties that cause layout reflow (avoid animating these)
 */
export const layoutProps = [
  'width',
  'height',
  'top',
  'left',
  'right',
  'bottom',
  'padding',
  'margin',
] as const

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Convert spacing token to CSS value
 */
export const getSpacing = (key: keyof typeof spacing): string => spacing[key]

/**
 * Convert shadow token to CSS value
 */
export const getShadow = (key: keyof typeof shadows): string => shadows[key]

/**
 * Generate CSS custom properties from design tokens
 */
export const generateCSSVariables = () => {
  const cssVars: Record<string, string> = {}

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value
  })

  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    cssVars[`--shadow-${key}`] = value
  })

  // Radius
  Object.entries(radius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value
  })

  return cssVars
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  spacing,
  semanticSpacing,
  shadows,
  coloredShadows,
  layeredShadows,
  radius,
  semanticRadius,
  zIndex,
  transitionDuration,
  transitionTiming,
  transitions,
  breakpoints,
  media,
  contentWidth,
  fontSize,
  lineHeight,
  fontWeight,
  getSpacing,
  getShadow,
  generateCSSVariables,
}
