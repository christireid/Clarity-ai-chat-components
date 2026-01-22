/**
 * Hook to detect user's preference for reduced motion
 * Respects the prefers-reduced-motion media query
 *
 * Re-exports useReducedMotion from @clarity-chat/primitives as an alias
 * for backward compatibility. New code should use useReducedMotion directly.
 *
 * @returns boolean indicating if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion()
 * if (prefersReducedMotion) {
 *   // Disable animations
 * }
 * ```
 *
 * @deprecated Use useReducedMotion from @clarity-chat/primitives instead
 */
export { useReducedMotion as usePrefersReducedMotion } from '@clarity-chat/primitives'
