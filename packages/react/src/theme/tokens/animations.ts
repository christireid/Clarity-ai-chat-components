/**
 * Clarity Chat - Animation Tokens
 *
 * Duration, easing, and keyframe definitions for smooth animations.
 * Respects prefers-reduced-motion for accessibility.
 *
 * NOTE: For the primary animation system, prefer using:
 * - `@clarity/react/animations` for Framer Motion animations
 * - `tailwind.config.js` for CSS/Tailwind animations
 *
 * This file provides CSS-compatible token values for theme integration.
 *
 * @see packages/react/src/animations/constants.ts for the centralized animation system
 */

// Re-export from centralized animation system for convenience
export {
  DURATION_CSS,
  ANIMATION_EASING,
  TAILWIND_DURATION,
  TAILWIND_EASING,
} from '../../animations/constants'

/**
 * Animation duration scale
 */
export interface DurationTokens {
  instant: string
  faster: string
  fast: string
  normal: string
  slow: string
  slower: string
  slowest: string
}

export const durationTokens: DurationTokens = {
  instant: '0ms',
  faster: '75ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
}

/**
 * Easing function tokens
 * Based on Material Design motion principles
 */
export interface EasingTokens {
  // Standard easings
  linear: string
  ease: string
  easeIn: string
  easeOut: string
  easeInOut: string

  // Expressive easings
  easeInQuad: string
  easeOutQuad: string
  easeInOutQuad: string
  easeInCubic: string
  easeOutCubic: string
  easeInOutCubic: string

  // Bouncy easings
  spring: string
  springBouncy: string
  springSmooth: string

  // Specialized
  snap: string
  smooth: string
}

export const easingTokens: EasingTokens = {
  // Standard
  linear: 'linear',
  ease: 'ease',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

  // Quad
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',

  // Cubic
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

  // Spring-like
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  springBouncy: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  springSmooth: 'cubic-bezier(0.34, 1.2, 0.64, 1)',

  // Specialized
  snap: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.1, 1)',
}

/**
 * Pre-composed animation presets
 */
export const animationPresets = {
  // Fade animations
  fadeIn: {
    keyframes: `
      from { opacity: 0; }
      to { opacity: 1; }
    `,
    duration: durationTokens.normal,
    easing: easingTokens.easeOut,
  },
  fadeOut: {
    keyframes: `
      from { opacity: 1; }
      to { opacity: 0; }
    `,
    duration: durationTokens.fast,
    easing: easingTokens.easeIn,
  },

  // Scale animations
  scaleIn: {
    keyframes: `
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    `,
    duration: durationTokens.normal,
    easing: easingTokens.spring,
  },
  scaleOut: {
    keyframes: `
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.95); }
    `,
    duration: durationTokens.fast,
    easing: easingTokens.easeIn,
  },

  // Slide animations
  slideInFromTop: {
    keyframes: `
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    duration: durationTokens.normal,
    easing: easingTokens.easeOut,
  },
  slideInFromBottom: {
    keyframes: `
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    `,
    duration: durationTokens.normal,
    easing: easingTokens.easeOut,
  },
  slideInFromLeft: {
    keyframes: `
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
    duration: durationTokens.normal,
    easing: easingTokens.easeOut,
  },
  slideInFromRight: {
    keyframes: `
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    `,
    duration: durationTokens.normal,
    easing: easingTokens.easeOut,
  },

  // Interactive feedback
  pulse: {
    keyframes: `
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    `,
    duration: durationTokens.slower,
    easing: easingTokens.easeInOut,
  },
  bounce: {
    keyframes: `
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    `,
    duration: durationTokens.slow,
    easing: easingTokens.easeInOut,
  },
  shake: {
    keyframes: `
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
      20%, 40%, 60%, 80% { transform: translateX(4px); }
    `,
    duration: durationTokens.slow,
    easing: easingTokens.easeInOut,
  },
  spin: {
    keyframes: `
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    `,
    duration: '1s',
    easing: easingTokens.linear,
  },

  // Typing indicator
  typingDot: {
    keyframes: `
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-8px); opacity: 1; }
    `,
    duration: '1.4s',
    easing: easingTokens.easeInOut,
  },

  // Shimmer for loading states
  shimmer: {
    keyframes: `
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    `,
    duration: '2s',
    easing: easingTokens.linear,
  },
} as const

/**
 * Semantic animation aliases
 */
export const semanticAnimations = {
  // Component enter/exit
  enter: animationPresets.scaleIn,
  exit: animationPresets.scaleOut,

  // Modal/dialog
  dialogEnter: animationPresets.scaleIn,
  dialogExit: animationPresets.scaleOut,

  // Dropdown/menu
  menuEnter: animationPresets.slideInFromTop,
  menuExit: animationPresets.fadeOut,

  // Toast notifications
  toastEnter: animationPresets.slideInFromRight,
  toastExit: animationPresets.slideInFromRight, // reversed

  // Message animations
  messageEnter: animationPresets.slideInFromBottom,

  // Loading states
  loading: animationPresets.spin,
  skeleton: animationPresets.shimmer,
  typing: animationPresets.typingDot,

  // Feedback
  success: animationPresets.bounce,
  error: animationPresets.shake,
} as const

export type AnimationPresetKey = keyof typeof animationPresets
export type SemanticAnimationKey = keyof typeof semanticAnimations
