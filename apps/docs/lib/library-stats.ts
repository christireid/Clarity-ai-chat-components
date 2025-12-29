/**
 * Library Statistics - Single Source of Truth
 *
 * Central location for all Clarity Chat library statistics.
 * Update these values when the library grows, and all documentation
 * will automatically reflect the changes.
 *
 * Last verified: 2025-12-29
 * - Components: 191 files in packages/react/src/components/ (excluding index.ts, test, stories, spec)
 * - Hooks: 100 files matching use*.ts in packages/react/src/hooks/
 * - Themes: 15 presets in packages/react/src/theme/modern-presets/
 *
 * To re-verify counts, run from packages/react/src:
 *   find components -type f \( -name "*.tsx" -o -name "*.ts" \) ! -name "*.test.*" ! -name "*.stories.*" ! -name "*.spec.*" ! -name "index.ts" | wc -l
 *   find hooks -type f -name "use*.ts" ! -name "*.test.*" | wc -l
 *   ls theme/modern-presets/*.ts | grep -v index | grep -v base | wc -l
 */

/**
 * Marketing-friendly counts (rounded for messaging)
 * These are the numbers shown in user-facing documentation
 */
export const LIBRARY_STATS = {
  /** Total component count (rounded down for marketing) */
  components: '190+',
  /** Total hook count (rounded down for marketing) */
  hooks: '95+',
  /** Exact theme preset count */
  themes: 15,
  /** Animation/micro-interaction count */
  animations: '150+',
  /** Cookbook recipe count */
  recipes: '33+',
  /** AI provider adapter count */
  aiProviders: 4,
} as const

/**
 * Exact counts for internal use and validation
 * These should match or exceed the marketing counts above
 */
export const LIBRARY_STATS_EXACT = {
  components: 191,
  hooks: 100,
  themes: 15,
  animations: 150,
} as const

/**
 * Formatted strings for common documentation patterns
 */
export const LIBRARY_DESCRIPTIONS = {
  /** Short tagline */
  tagline: `${LIBRARY_STATS.components} components, ${LIBRARY_STATS.hooks} hooks, ${LIBRARY_STATS.themes} themes`,

  /** Full description for meta tags */
  metaDescription: `Enterprise-grade React component library for building beautiful, accessible AI chat interfaces. Features ${LIBRARY_STATS.components} production-ready components, ${LIBRARY_STATS.hooks} custom hooks, ${LIBRARY_STATS.themes} themes, and comprehensive token optimization.`,

  /** Component description */
  componentsDescription: `Explore all ${LIBRARY_STATS.components} components with interactive examples`,

  /** Hooks description */
  hooksDescription: `${LIBRARY_STATS.hooks} hooks for chat functionality, streaming, and state management`,

  /** Themes description */
  themesDescription: `${LIBRARY_STATS.themes} pre-built themes with full customization support`,
} as const

/**
 * Deprecated count patterns that should NOT appear in documentation
 * Used by linting and tests to catch stale values
 */
export const DEPRECATED_PATTERNS = [
  /70\+\s*components?/i,
  /200\+\s*components?/i,
  /35\+\s*hooks?/i,
  /140\+\s*hooks?/i,
  /11\+?\s*themes?/i,
  /11\s*pre-?built/i,
] as const

/**
 * Type for library stats
 */
export type LibraryStats = typeof LIBRARY_STATS
export type LibraryStatsExact = typeof LIBRARY_STATS_EXACT
