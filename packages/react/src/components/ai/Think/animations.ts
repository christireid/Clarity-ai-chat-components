/**
 * Animation configurations for Think component
 * @packageDocumentation
 */

import { DURATION_SECONDS, EASING_FRAMER } from '../../../animations/constants'

/**
 * Get content motion props based on reduced motion preference
 */
export function getContentMotionProps(prefersReducedMotion: boolean) {
  return {
    initial: prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 },
    animate: prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 },
    exit: prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 },
    transition: {
      duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.normal,
      ease: EASING_FRAMER.out,
    },
  }
}

/**
 * Get step item animation props
 */
export function getStepItemAnimationProps(index: number, prefersReducedMotion: boolean) {
  return {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 },
    animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 },
    transition: {
      delay: index * 0.1,
      duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
    },
  }
}

/**
 * Get icon animation props for streaming state
 */
export function getIconAnimationProps(isStreaming: boolean, prefersReducedMotion: boolean) {
  return {
    animate:
      isStreaming && !prefersReducedMotion
        ? { rotate: [0, 5, -5, 0] }
        : {},
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }
}

/**
 * Get thinking indicator animation props
 */
export function getThinkingDotAnimationProps(index: number, prefersReducedMotion: boolean) {
  return {
    animate: prefersReducedMotion
      ? { opacity: [0.4, 0.8, 0.4] }
      : { y: [-1, -3, -1], opacity: [0.4, 1, 0.4] },
    transition: {
      duration: 0.6,
      delay: index * 0.15,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  }
}
