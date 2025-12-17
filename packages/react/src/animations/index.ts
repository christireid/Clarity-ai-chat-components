/**
 * Animation System
 *
 * Centralized animation constants, utilities, and presets for consistent motion design.
 * Includes accessibility-focused motion-safe utilities that respect prefers-reduced-motion.
 *
 * Key exports:
 * - Duration tokens: ANIMATION_DURATION, DURATION_CSS, DURATION_SECONDS, TAILWIND_DURATION
 * - Easing tokens: ANIMATION_EASING, EASING_FRAMER, TAILWIND_EASING
 * - Unified easing: getEasing, getFramerEasing, getCSSEasing (use these to avoid format confusion)
 * - Presets: ANIMATION_PRESETS, ANIMATION_PRESETS_REDUCED
 * - Interactions: INTERACTION_VARIANTS, INTERACTION_VARIANTS_REDUCED
 * - Helpers: getPreset, getInteractionVariant, getTransition, getTailwindTransition
 * - Spring presets: SPRING_PRESETS, getSpring, SPRING_COMBINATIONS
 * - Motion-safe utilities: getMotionSafeVariants, getMotionSafeTransition, etc.
 *
 * @example
 * ```tsx
 * import {
 *   ANIMATION_PRESETS,
 *   getPreset,
 *   getTransition,
 *   useReducedMotion
 * } from '@clarity/react/animations'
 *
 * function MyComponent() {
 *   const prefersReducedMotion = useReducedMotion()
 *   const variants = getPreset('slideUp', prefersReducedMotion)
 *   const transition = getTransition('normal', 'out', prefersReducedMotion)
 *
 *   return (
 *     <motion.div
 *       {...variants}
 *       transition={transition}
 *     >
 *       Content
 *     </motion.div>
 *   )
 * }
 * ```
 */

export * from './constants'
export * from './utils'
export * from './motion-safe'
export * from './spring-presets'
export * from './microanimations'
export * from './theme-animations'

// Re-export the useReducedMotion hook for convenience
export { useReducedMotion } from '../hooks/ui/use-reduced-motion'
