/**
 * Hook to detect and listen for changes to the `prefers-reduced-motion` media query.
 *
 * Re-exports the canonical implementation from @clarity-chat/primitives
 * for consistency across the codebase.
 *
 * @returns `true` if the user prefers reduced motion, `false` otherwise
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * if (prefersReducedMotion) {
 *   // Disable animations
 * }
 * ```
 */
export { useReducedMotion } from '@clarity-chat/primitives'
