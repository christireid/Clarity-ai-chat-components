/**
 * Animation Presets for Framer Motion
 *
 * This module provides standardized animation configurations for consistent
 * motion design across all components. It follows best practices from
 * Framer Motion and respects user preferences for reduced motion.
 *
 * @see {@link https://www.framer.com/motion/} Framer Motion
 * @see {@link https://www.joshwcomeau.com/react/prefers-reduced-motion/} Reduced Motion
 */

import type { Transition, Variants, TargetAndTransition } from 'framer-motion'

// ============================================================================
// Transition Presets
// ============================================================================

/**
 * Spring physics presets for natural-feeling motion
 *
 * @description
 * Spring animations feel more natural than duration-based easing.
 * Use these for interactive elements where physics-based motion enhances UX.
 *
 * - `snappy`: Quick, responsive feedback (buttons, toggles)
 * - `gentle`: Softer motion (tooltips, popovers)
 * - `bouncy`: Playful, attention-grabbing (notifications, celebrations)
 * - `smooth`: Balanced, general-purpose (dialogs, panels)
 */
export const springPresets = {
  /** Quick, responsive spring for UI interactions (150-200ms feel) */
  snappy: {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 1,
  } as const,

  /** Gentle spring for subtle animations (250-300ms feel) */
  gentle: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
    mass: 1,
  } as const,

  /** Bouncy spring for playful animations */
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
    mass: 1,
  } as const,

  /** Smooth, balanced spring for general use */
  smooth: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
    mass: 1,
  } as const,

  /** Very fast spring for micro-interactions */
  instant: {
    type: 'spring',
    stiffness: 700,
    damping: 35,
    mass: 0.8,
  } as const,
} satisfies Record<string, Transition>

/**
 * Duration constants for consistent timing
 */
const durations = {
  /** Very fast: 100ms */
  fast: 0.1,
  /** Normal: 200ms */
  normal: 0.2,
  /** Moderate: 250ms */
  moderate: 0.25,
  /** Slow: 300ms */
  slow: 0.3,
} as const

/**
 * Duration-based easing presets
 *
 * @description
 * Use for animations where precise timing is important, or where
 * spring physics would feel unnatural (like opacity fades).
 *
 * Timing recommendations:
 * - 150-250ms for micro UI changes (hover states, button presses)
 * - 250-400ms for larger context switches (page transitions, dialogs)
 */
export const easingPresets = {
  /** Fast ease out for elements entering (150ms) */
  enterFast: {
    type: 'tween',
    duration: durations.fast,
    ease: [0.25, 0.1, 0.25, 1],
  } as const,

  /** Standard ease out for elements entering (200ms) */
  enter: {
    type: 'tween',
    duration: durations.normal,
    ease: [0.25, 0.1, 0.25, 1],
  } as const,

  /** Slower ease out for larger animations (300ms) */
  enterSlow: {
    type: 'tween',
    duration: durations.moderate,
    ease: [0.25, 0.1, 0.25, 1],
  } as const,

  /** Fast ease in for elements exiting (100ms) */
  exitFast: {
    type: 'tween',
    duration: durations.fast,
    ease: [0.25, 0.1, 0.25, 1],
  } as const,

  /** Standard ease in for elements exiting (150ms) */
  exit: {
    type: 'tween',
    duration: durations.fast,
    ease: [0.25, 0.1, 0.25, 1],
  } as const,

  /** Smooth ease in-out for position changes (250ms) */
  move: {
    type: 'tween',
    duration: durations.moderate,
    ease: [0.4, 0, 0.2, 1],
  } as const,
} satisfies Record<string, Transition>

/**
 * No animation transition (for reduced motion)
 */
export const noAnimation: Transition = {
  duration: 0,
}

// ============================================================================
// Animation Variants
// ============================================================================

/**
 * Fade animation variants
 *
 * @description
 * Simple opacity fade. Safe for users with motion sensitivity.
 *
 * @example
 * ```tsx
 * <motion.div
 *   variants={fadeVariants}
 *   initial="initial"
 *   animate="animate"
 *   exit="exit"
 * />
 * ```
 */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Scale + fade animation variants (for dialogs, popovers)
 *
 * @description
 * Combines scale with opacity for a polished appear/disappear effect.
 * The scale is subtle (96%) to avoid jarring motion.
 */
export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
}

/**
 * Slide up + fade variants (for toasts, bottom sheets)
 */
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
}

/**
 * Slide down + fade variants (for dropdowns, tooltips from top)
 */
export const slideDownVariants: Variants = {
  initial: { opacity: 0, y: -16, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
}

/**
 * Slide left + fade variants (for sidebars, drawers from right)
 */
export const slideLeftVariants: Variants = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 16 },
}

/**
 * Slide right + fade variants (for sidebars, drawers from left)
 */
export const slideRightVariants: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
}

/**
 * Pop/zoom variants (for emphasis, celebrations)
 */
export const popVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

/**
 * Collapse/expand variants (for accordions, expandable content)
 * Uses scaleY transform for performant 60fps animations instead of height
 */
export const collapseVariants: Variants = {
  initial: { scaleY: 0, opacity: 0, transformOrigin: 'top' },
  animate: { scaleY: 1, opacity: 1, transformOrigin: 'top' },
  exit: { scaleY: 0, opacity: 0, transformOrigin: 'top' },
}

// ============================================================================
// Reduced Motion Variants
// ============================================================================

/**
 * Get variants that respect reduced motion preference
 *
 * @description
 * Returns appropriate animation variants based on user's motion preference.
 * For reduced motion, all animations become simple fades (or nothing).
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * const variants = getReducedMotionVariants(scaleVariants, prefersReducedMotion)
 *
 * return (
 *   <motion.div
 *     variants={variants}
 *     initial="initial"
 *     animate="animate"
 *     exit="exit"
 *   />
 * )
 * ```
 *
 * @param normalVariants - The animation variants for normal motion
 * @param prefersReducedMotion - Whether the user prefers reduced motion
 * @param useFade - Whether to use fade for reduced motion (default: true)
 * @returns The appropriate variants based on motion preference
 */
export function getReducedMotionVariants(
  normalVariants: Variants,
  prefersReducedMotion: boolean,
  useFade: boolean = true
): Variants {
  if (!prefersReducedMotion) {
    return normalVariants
  }

  // Return fade variants or no animation
  if (useFade) {
    return fadeVariants
  }

  // Return instant state changes (no animation)
  return {
    initial: normalVariants.initial,
    animate: normalVariants.animate,
    exit: normalVariants.exit,
  }
}

/**
 * Get transition that respects reduced motion preference
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 * const transition = getReducedMotionTransition(springPresets.smooth, prefersReducedMotion)
 * ```
 */
export function getReducedMotionTransition(
  normalTransition: Transition,
  prefersReducedMotion: boolean
): Transition {
  if (prefersReducedMotion) {
    return noAnimation
  }
  return normalTransition
}

// ============================================================================
// Interactive Variants (hover, tap, focus)
// ============================================================================

/**
 * Interactive states for buttons and clickable elements
 *
 * @description
 * Provides subtle feedback for hover, tap, and focus states.
 * The transforms are minimal to avoid motion sensitivity issues.
 */
export const interactiveVariants = {
  /** Subtle lift on hover */
  hover: {
    y: -1,
    transition: springPresets.snappy,
  } satisfies TargetAndTransition,

  /** Subtle press feedback */
  tap: {
    scale: 0.98,
    y: 0,
    transition: springPresets.instant,
  } satisfies TargetAndTransition,

  /** Focus ring scaling (optional, use with care) */
  focus: {
    scale: 1.02,
    transition: springPresets.snappy,
  } satisfies TargetAndTransition,
}

/**
 * Get interactive variants that respect reduced motion
 */
export function getReducedMotionInteractive(prefersReducedMotion: boolean): {
  hover?: TargetAndTransition
  tap?: TargetAndTransition
} {
  if (prefersReducedMotion) {
    return {} // No motion variants
  }
  return {
    hover: interactiveVariants.hover,
    tap: interactiveVariants.tap,
  }
}

// ============================================================================
// Stagger Utilities
// ============================================================================

/**
 * Container variants for staggered children animations
 *
 * @description
 * Use with `staggerChildren` to animate list items sequentially.
 * The delay between children is 50ms for a balanced visual rhythm.
 *
 * @example
 * ```tsx
 * <motion.ul variants={staggerContainerVariants} initial="initial" animate="animate">
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItemVariants}>
 *       {item.name}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05, // 50ms between items
      delayChildren: 0.1, // 100ms before first item
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03, // Faster stagger on exit
      staggerDirection: -1, // Reverse order on exit
    },
  },
}

/**
 * Item variants for staggered animations
 */
export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: easingPresets.enter,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: easingPresets.exitFast,
  },
}

// ============================================================================
// Preset Collections
// ============================================================================

/**
 * Animation presets organized by use case
 */
export const animationPresets = {
  /** Dialogs, modals, alerts */
  dialog: {
    variants: scaleVariants,
    transition: springPresets.smooth,
  },

  /** Dropdowns, select menus */
  dropdown: {
    variants: slideDownVariants,
    transition: easingPresets.enter,
  },

  /** Tooltips, popovers */
  tooltip: {
    variants: fadeVariants,
    transition: easingPresets.enterFast,
  },

  /** Toast notifications */
  toast: {
    variants: slideUpVariants,
    transition: springPresets.gentle,
  },

  /** Side drawers, sheets */
  drawer: {
    variants: slideRightVariants,
    transition: springPresets.smooth,
  },

  /** Accordion, collapsible content */
  accordion: {
    variants: collapseVariants,
    transition: easingPresets.move,
  },

  /** Overlay backdrops */
  overlay: {
    variants: fadeVariants,
    transition: easingPresets.enter,
  },
} as const
