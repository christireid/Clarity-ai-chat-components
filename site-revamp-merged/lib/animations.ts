import type { Variants, Transition } from "framer-motion"

/**
 * Shared animation utilities for consistent motion design
 * across all marketing components.
 */

// Standard easing curve for smooth, premium feel
export const easeOut = [0.25, 0.4, 0.25, 1] as const

// Default transition settings
export const defaultTransition: Transition = {
  duration: 0.6,
  ease: easeOut,
}

/**
 * Container variant with staggered children
 * Use on parent elements that contain multiple animated children
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

/**
 * Stagger container with faster stagger for grids
 */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

/**
 * Fade up animation for content sections
 * Standard reveal animation for text and cards
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

/**
 * Fade up with subtle scale for cards
 * Adds depth to the reveal animation
 */
export const fadeInUpScale: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
}

/**
 * Fade in with scale for hero elements
 * Slower, more dramatic reveal
 */
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: easeOut,
      delay: 0.8,
    },
  },
}

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

/**
 * Navigation bar animation
 */
export const navSlideDown: Variants = {
  hidden: { y: -100 },
  visible: {
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
}

/**
 * Mobile menu animation
 */
export const mobileMenuFade: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
}

/**
 * Viewport settings for scroll-triggered animations
 */
export const viewportOnce = {
  once: true,
  margin: "-100px",
}

/**
 * Hover animation for cards
 */
export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: {
    duration: 0.3,
    ease: easeOut,
  },
}

/**
 * Hover animation for buttons
 */
export const buttonHover = {
  scale: 1.02,
  y: -2,
  transition: {
    duration: 0.2,
    ease: easeOut,
  },
}

/**
 * Tap animation for interactive elements
 */
export const tapScale = {
  scale: 0.98,
}
