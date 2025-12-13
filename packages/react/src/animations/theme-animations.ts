/**
 * Theme-Aware Animation Presets
 *
 * Advanced animations that integrate with the theming system.
 * Includes theme transition effects, color-aware animations,
 * and premium micro-interactions.
 */

import type { Variants, Transition, TargetAndTransition } from 'framer-motion'
import { ANIMATION_DURATION, EASING_FRAMER } from './constants'

// ============================================================================
// Theme Transition Animations
// ============================================================================

/**
 * Theme switch animation variants
 * Creates smooth transitions when switching between themes
 */
export const ThemeSwitchAnimations = {
  /** Crossfade transition */
  crossfade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.inOut,
    },
  },

  /** Morph transition with scale */
  morph: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
    transition: {
      duration: 0.25,
      ease: EASING_FRAMER.spring,
    },
  },

  /** Slide and fade */
  slideAndFade: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -5 },
    transition: {
      duration: 0.2,
      ease: EASING_FRAMER.out,
    },
  },

  /** Blur transition (for glassmorphic themes) */
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.inOut,
    },
  },
} as const

// ============================================================================
// Premium Micro-Interactions
// ============================================================================

/**
 * Button press animations with haptic-like feedback
 */
export const ButtonAnimations = {
  /** Standard press */
  press: {
    tap: { scale: 0.97 },
    transition: { duration: 0.1 },
  },

  /** Springy press */
  springPress: {
    tap: { scale: 0.95 },
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 400,
    },
  },

  /** 3D press effect */
  press3D: {
    tap: {
      scale: 0.98,
      y: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    transition: { duration: 0.1 },
  },

  /** Glow press */
  glowPress: {
    tap: {
      scale: 0.98,
      boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.3)',
    },
    transition: { duration: 0.15 },
  },

  /** Icon button spin on press */
  iconSpin: {
    tap: { rotate: 180 },
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 300,
    },
  },
} as const

/**
 * Card animations for premium feel
 */
export const CardAnimations = {
  /** Lift on hover with shadow */
  liftWithShadow: {
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
    },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.out,
    },
  },

  /** Tilt on hover (3D effect) */
  tilt3D: (rotateX: number, rotateY: number) => ({
    hover: {
      rotateX,
      rotateY,
      scale: 1.02,
    },
    transition: { duration: 0.2 },
  }),

  /** Shine effect on hover */
  shine: {
    hover: {
      backgroundPosition: '200% center',
    },
    transition: {
      duration: 0.8,
      ease: 'linear',
    },
  },

  /** Border highlight */
  borderHighlight: {
    hover: {
      borderColor: 'hsl(var(--primary))',
      boxShadow: '0 0 0 2px hsl(var(--primary) / 0.1)',
    },
    transition: { duration: 0.2 },
  },

  /** Expandable card (uses scale for 60fps performance) */
  expand: {
    initial: { scaleY: 1, opacity: 1 },
    expanded: { scaleY: 1, opacity: 1, originY: 0 },
    collapsed: { scaleY: 0, opacity: 0, originY: 0 },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.inOut,
    },
  },
} as const

/**
 * Input field animations
 */
export const InputAnimations = {
  /** Focus ring pulse */
  focusPulse: {
    focus: {
      boxShadow: [
        '0 0 0 0px hsl(var(--ring))',
        '0 0 0 4px hsl(var(--ring) / 0.3)',
      ],
    },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.out,
    },
  },

  /** Label float animation */
  floatingLabel: {
    default: {
      y: 0,
      scale: 1,
      color: 'hsl(var(--muted-foreground))',
    },
    focused: {
      y: -24,
      scale: 0.85,
      color: 'hsl(var(--primary))',
    },
    transition: {
      duration: 0.2,
      ease: EASING_FRAMER.out,
    },
  },

  /** Shake on error */
  errorShake: {
    x: [-8, 8, -6, 6, -4, 4, 0],
    transition: {
      duration: 0.4,
      ease: EASING_FRAMER.sharp,
    },
  },

  /** Success glow */
  successGlow: {
    boxShadow: [
      '0 0 0 0 hsl(var(--success) / 0)',
      '0 0 0 4px hsl(var(--success) / 0.3)',
      '0 0 0 0 hsl(var(--success) / 0)',
    ],
    transition: {
      duration: 0.6,
      ease: EASING_FRAMER.out,
    },
  },
} as const

/**
 * Toggle/Switch animations
 */
export const ToggleAnimations = {
  /** Thumb slide with spring */
  thumbSlide: (checked: boolean) => ({
    x: checked ? 20 : 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300,
    },
  }),

  /** Background color transition */
  trackColor: (checked: boolean) => ({
    backgroundColor: checked
      ? 'hsl(var(--primary))'
      : 'hsl(var(--muted))',
    transition: {
      duration: 0.2,
    },
  }),

  /** Checkbox check animation */
  checkmark: {
    initial: { pathLength: 0, opacity: 0 },
    checked: { pathLength: 1, opacity: 1 },
    unchecked: { pathLength: 0, opacity: 0 },
    transition: {
      duration: 0.2,
      ease: EASING_FRAMER.out,
    },
  },

  /** Radio dot animation */
  radioDot: {
    initial: { scale: 0 },
    selected: { scale: 1 },
    unselected: { scale: 0 },
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 400,
    },
  },
} as const

// ============================================================================
// Modal & Dialog Animations
// ============================================================================

/**
 * Modal/Dialog entrance animations
 */
export const ModalAnimations = {
  /** Backdrop fade */
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: 0.2,
    },
  },

  /** Content scale in */
  content: {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: 5 },
    transition: {
      duration: 0.2,
      ease: EASING_FRAMER.spring,
    },
  },

  /** Sheet slide up */
  sheet: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  },

  /** Drawer slide */
  drawer: (side: 'left' | 'right') => ({
    initial: { x: side === 'left' ? '-100%' : '100%' },
    animate: { x: 0 },
    exit: { x: side === 'left' ? '-100%' : '100%' },
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300,
    },
  }),

  /** Alert drop in */
  alert: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.98 },
    transition: {
      duration: 0.2,
      ease: EASING_FRAMER.out,
    },
  },
} as const

// ============================================================================
// Toast & Notification Animations
// ============================================================================

/**
 * Toast notification animations
 */
export const ToastAnimations = {
  /** Slide in from top */
  slideTop: {
    initial: { opacity: 0, y: -20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
    transition: {
      duration: 0.25,
      ease: EASING_FRAMER.spring,
    },
  },

  /** Slide in from bottom */
  slideBottom: {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 20, scale: 0.95 },
    transition: {
      duration: 0.25,
      ease: EASING_FRAMER.spring,
    },
  },

  /** Slide in from right */
  slideRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.out,
    },
  },

  /** Pop in */
  pop: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 400,
    },
  },

  /** Progress bar */
  progress: (duration: number) => ({
    initial: { scaleX: 1 },
    animate: { scaleX: 0 },
    transition: {
      duration,
      ease: 'linear',
    },
  }),
} as const

// ============================================================================
// Menu & Dropdown Animations
// ============================================================================

/**
 * Menu and dropdown animations
 */
export const MenuAnimations = {
  /** Dropdown scale and fade */
  dropdown: {
    initial: { opacity: 0, scale: 0.95, y: -5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -5 },
    transition: {
      duration: 0.15,
      ease: EASING_FRAMER.out,
    },
  },

  /** Context menu */
  contextMenu: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      duration: 0.1,
      ease: EASING_FRAMER.out,
    },
  },

  /** Menu item hover */
  menuItem: {
    hover: {
      backgroundColor: 'hsl(var(--accent))',
      x: 4,
    },
    transition: {
      duration: 0.15,
    },
  },

  /** Staggered menu items */
  staggeredItems: (index: number) => ({
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    transition: {
      delay: index * 0.03,
      duration: 0.2,
      ease: EASING_FRAMER.out,
    },
  }),

  /** Submenu slide */
  submenu: {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -5 },
    transition: {
      duration: 0.15,
      ease: EASING_FRAMER.out,
    },
  },
} as const

// ============================================================================
// Tooltip Animations
// ============================================================================

/**
 * Tooltip animations
 */
export const TooltipAnimations = {
  /** Fade and scale */
  fadeScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      duration: 0.15,
      ease: EASING_FRAMER.out,
    },
  },

  /** Position-aware slide */
  slide: (position: 'top' | 'bottom' | 'left' | 'right') => {
    const offsets = {
      top: { y: 5 },
      bottom: { y: -5 },
      left: { x: 5 },
      right: { x: -5 },
    }
    return {
      initial: { opacity: 0, ...offsets[position] },
      animate: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, ...offsets[position] },
      transition: {
        duration: 0.15,
        ease: EASING_FRAMER.out,
      },
    }
  },
} as const

// ============================================================================
// Skeleton & Loading Animations
// ============================================================================

/**
 * Skeleton loading animations
 */
export const SkeletonAnimations = {
  /** Shimmer effect */
  shimmer: {
    backgroundPosition: ['-200% 0', '200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  /** Pulse effect */
  pulse: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: EASING_FRAMER.inOut,
    },
  },

  /** Wave effect */
  wave: (index: number) => ({
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      delay: index * 0.1,
      ease: EASING_FRAMER.inOut,
    },
  }),
} as const

// ============================================================================
// Chat-Specific Animations
// ============================================================================

/**
 * Chat message animations
 */
export const ChatAnimations = {
  /** User message enter */
  userMessage: {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    transition: {
      duration: 0.25,
      ease: EASING_FRAMER.out,
    },
  },

  /** AI message enter */
  aiMessage: {
    initial: { opacity: 0, x: -20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    transition: {
      duration: 0.25,
      ease: EASING_FRAMER.out,
    },
  },

  /** System message */
  systemMessage: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.2,
      ease: EASING_FRAMER.out,
    },
  },

  /** Typing indicator dots */
  typingDot: (index: number) => ({
    y: [0, -8, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1,
      repeat: Infinity,
      delay: index * 0.15,
      ease: EASING_FRAMER.inOut,
    },
  }),

  /** Message streaming text */
  streamingText: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: 0.05,
    },
  },

  /** Message action buttons */
  messageActions: {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.2,
      delay: 0.1,
    },
  },

  /** Reaction animation */
  reaction: {
    initial: { scale: 0 },
    animate: { scale: [0, 1.2, 1] },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.spring,
    },
  },
} as const

// ============================================================================
// Avatar Animations
// ============================================================================

/**
 * Avatar animations
 */
export const AvatarAnimations = {
  /** Online status pulse */
  onlinePulse: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: EASING_FRAMER.inOut,
    },
  },

  /** Avatar hover */
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },

  /** Avatar group stack */
  stackedAvatar: (index: number) => ({
    initial: { scale: 0, x: index * -8 },
    animate: { scale: 1, x: index * -8 },
    transition: {
      delay: index * 0.05,
      type: 'spring',
      damping: 15,
      stiffness: 300,
    },
  }),
} as const

// ============================================================================
// Icon Animations
// ============================================================================

/**
 * Icon micro-animations
 */
export const IconAnimations = {
  /** Check mark draw */
  checkDraw: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.out,
    },
  },

  /** X mark draw */
  xDraw: {
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: {
      duration: 0.2,
      ease: EASING_FRAMER.out,
    },
  },

  /** Arrow rotation */
  arrowRotate: (direction: 'up' | 'down' | 'left' | 'right') => {
    const rotations = { up: -90, down: 90, left: 180, right: 0 }
    return {
      rotate: rotations[direction],
      transition: {
        duration: 0.2,
        ease: EASING_FRAMER.out,
      },
    }
  },

  /** Refresh spin */
  refreshSpin: {
    rotate: 360,
    transition: {
      duration: 0.5,
      ease: 'linear',
    },
  },

  /** Bell ring */
  bellRing: {
    rotate: [0, 15, -15, 10, -10, 5, 0],
    transition: {
      duration: 0.5,
      ease: EASING_FRAMER.inOut,
    },
  },

  /** Heart beat */
  heartBeat: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.3,
      ease: EASING_FRAMER.inOut,
    },
  },

  /** Star sparkle */
  starSparkle: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, 0],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 0.4,
      ease: EASING_FRAMER.spring,
    },
  },
} as const

// ============================================================================
// Type Exports
// ============================================================================

export type ThemeSwitchAnimation = keyof typeof ThemeSwitchAnimations
export type ButtonAnimation = keyof typeof ButtonAnimations
export type CardAnimation = keyof typeof CardAnimations
export type ModalAnimation = keyof typeof ModalAnimations
export type ToastAnimation = keyof typeof ToastAnimations
export type MenuAnimation = keyof typeof MenuAnimations
export type ChatAnimation = keyof typeof ChatAnimations
