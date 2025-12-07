'use client';
import { useMediaQuery } from './use-media-query';
/**
 * Detect if user prefers reduced motion
 *
 * Returns true if the user has enabled "reduce motion" in their OS settings.
 * Use this to disable or simplify animations for better accessibility.
 *
 * @returns {boolean} True if user prefers reduced motion
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = useReducedMotion()
 *
 *   return (
 *     <motion.div
 *       animate={{ x: prefersReducedMotion ? 0 : 100 }}
 *       transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 *
 * @example With conditional animations
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * const variants = prefersReducedMotion
 *   ? { initial: {}, animate: {} }
 *   : {
 *       initial: { opacity: 0, y: 20 },
 *       animate: { opacity: 1, y: 0 }
 *     }
 * ```
 */
export function useReducedMotion() {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
}
//# sourceMappingURL=use-reduced-motion.js.map