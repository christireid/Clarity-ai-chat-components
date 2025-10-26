/**
 * Animation Utilities
 * 
 * Helper functions for creating consistent animations across components.
 */

import { Variants, Transition } from 'framer-motion'
import { 
  ANIMATION_DURATION, 
  ANIMATION_EASING, 
  STAGGER_TIMING,
  AnimationDuration,
  AnimationEasing,
  StaggerTiming,
} from './constants'

/**
 * Create a fade animation variant
 */
export function createFadeVariant(
  duration: AnimationDuration = 'normal',
  easing: AnimationEasing = 'default'
): Variants {
  return {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: ANIMATION_DURATION[duration] / 1000,
        ease: ANIMATION_EASING[easing],
      },
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: ANIMATION_DURATION[duration] / 1000,
        ease: ANIMATION_EASING[easing],
      },
    },
  }
}

/**
 * Create a slide animation variant
 */
export function createSlideVariant(
  direction: 'up' | 'down' | 'left' | 'right',
  distance: number = 20,
  duration: AnimationDuration = 'normal',
  easing: AnimationEasing = 'out'
): Variants {
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x'
  const value = direction === 'down' || direction === 'right' ? distance : -distance
  
  return {
    initial: { 
      opacity: 0, 
      [axis]: value,
    } as any,
    animate: { 
      opacity: 1, 
      [axis]: 0,
      transition: {
        duration: ANIMATION_DURATION[duration] / 1000,
        ease: ANIMATION_EASING[easing],
      },
    } as any,
    exit: { 
      opacity: 0, 
      [axis]: -value,
      transition: {
        duration: ANIMATION_DURATION[duration] / 1000,
        ease: ANIMATION_EASING[easing],
      },
    } as any,
  }
}

/**
 * Create a scale animation variant
 */
export function createScaleVariant(
  initialScale: number = 0.9,
  duration: AnimationDuration = 'fast',
  easing: AnimationEasing = 'spring'
): Variants {
  return {
    initial: { 
      opacity: 0, 
      scale: initialScale,
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: ANIMATION_DURATION[duration] / 1000,
        ease: ANIMATION_EASING[easing],
      },
    },
    exit: { 
      opacity: 0, 
      scale: initialScale,
      transition: {
        duration: ANIMATION_DURATION[duration] / 1000,
        ease: ANIMATION_EASING[easing],
      },
    },
  }
}

/**
 * Create a stagger container variant
 */
export function createStaggerContainerVariant(
  staggerSpeed: StaggerTiming = 'normal',
  delayChildren: number = 0
): Variants {
  return {
    initial: {},
    animate: {
      transition: {
        staggerChildren: STAGGER_TIMING[staggerSpeed],
        delayChildren,
      },
    },
    exit: {
      transition: {
        staggerChildren: STAGGER_TIMING[staggerSpeed] / 2,
        staggerDirection: -1,
      },
    },
  }
}

/**
 * Create a stagger child variant
 */
export function createStaggerChildVariant(
  type: 'fade' | 'slide' | 'scale' = 'slide',
  duration: AnimationDuration = 'fast'
): Variants {
  switch (type) {
    case 'fade':
      return {
        initial: { opacity: 0 },
        animate: { 
          opacity: 1,
          transition: { duration: ANIMATION_DURATION[duration] / 1000 },
        },
        exit: { 
          opacity: 0,
          transition: { duration: ANIMATION_DURATION[duration] / 1000 },
        },
      }
    
    case 'scale':
      return {
        initial: { opacity: 0, scale: 0.8 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: { duration: ANIMATION_DURATION[duration] / 1000 },
        },
        exit: { 
          opacity: 0, 
          scale: 0.8,
          transition: { duration: ANIMATION_DURATION[duration] / 1000 },
        },
      }
    
    case 'slide':
    default:
      return {
        initial: { opacity: 0, y: 10 },
        animate: { 
          opacity: 1, 
          y: 0,
          transition: { duration: ANIMATION_DURATION[duration] / 1000 },
        },
        exit: { 
          opacity: 0, 
          y: -10,
          transition: { duration: ANIMATION_DURATION[duration] / 1000 },
        },
      }
  }
}

/**
 * Create a hover/tap interaction
 */
export function createInteractionVariant(
  hoverScale: number = 1.02,
  tapScale: number = 0.98,
  duration: AnimationDuration = 'instant'
) {
  return {
    hover: { scale: hoverScale },
    tap: { scale: tapScale },
    transition: { duration: ANIMATION_DURATION[duration] / 1000 },
  }
}

/**
 * Create a loading pulse animation
 */
export function createPulseAnimation(
  minOpacity: number = 0.5,
  maxOpacity: number = 0.8,
  duration: number = 1.5
): Variants {
  return {
    animate: {
      opacity: [minOpacity, maxOpacity, minOpacity],
      transition: {
        duration,
        repeat: Infinity,
        ease: ANIMATION_EASING.inOut,
      },
    },
  }
}

/**
 * Create a shimmer loading animation
 */
export function createShimmerAnimation(duration: number = 2): Variants {
  return {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  }
}

/**
 * Create a spinner rotation animation
 */
export function createSpinnerAnimation(duration: number = 1): Variants {
  return {
    animate: {
      rotate: [0, 360],
      transition: {
        duration,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  }
}

/**
 * Create a dots loading animation
 */
export function createDotsAnimation(
  delay: number = 0,
  duration: number = 1.5
): Variants {
  return {
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1, 0.8],
      transition: {
        duration,
        repeat: Infinity,
        delay,
      },
    },
  }
}

/**
 * Create a bounce animation
 */
export function createBounceAnimation(
  height: number = -10,
  duration: number = 0.5
): Variants {
  return {
    animate: {
      y: [0, height, 0],
      transition: {
        duration,
        repeat: Infinity,
        ease: ANIMATION_EASING.out,
      },
    },
  }
}

/**
 * Create a shake animation
 */
export function createShakeAnimation(
  intensity: number = 10,
  duration: number = 0.5
): Variants {
  return {
    animate: {
      x: [-intensity, intensity, -intensity, intensity, 0],
      transition: {
        duration,
      },
    },
  }
}

/**
 * Create a success checkmark animation
 */
export function createSuccessAnimation(): Variants {
  return {
    initial: { scale: 0, rotate: -45 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: ANIMATION_DURATION.normal / 1000,
        ease: ANIMATION_EASING.spring,
      },
    },
  }
}

/**
 * Create an error shake animation
 */
export function createErrorAnimation(): Variants {
  return {
    animate: {
      x: [-10, 10, -10, 10, 0],
      transition: {
        duration: 0.4,
      },
    },
  }
}

/**
 * Merge multiple transitions
 */
export function mergeTransitions(...transitions: Partial<Transition>[]): Transition {
  return transitions.reduce((acc, transition) => ({ ...acc, ...transition }), {}) as Transition
}

/**
 * Get duration in seconds
 */
export function getDurationInSeconds(duration: AnimationDuration): number {
  return ANIMATION_DURATION[duration] / 1000
}

/**
 * Get duration in milliseconds
 */
export function getDurationInMs(duration: AnimationDuration): number {
  return ANIMATION_DURATION[duration]
}

/**
 * Create custom spring transition
 */
export function createSpringTransition(
  stiffness: number = 300,
  damping: number = 20
): Transition {
  return {
    type: 'spring',
    stiffness,
    damping,
  }
}

/**
 * Create custom tween transition
 */
export function createTweenTransition(
  duration: AnimationDuration = 'normal',
  easing: AnimationEasing = 'default',
  delay: number = 0
): Transition {
  return {
    type: 'tween',
    duration: getDurationInSeconds(duration),
    ease: ANIMATION_EASING[easing],
    delay,
  }
}
