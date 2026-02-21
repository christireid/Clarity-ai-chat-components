/**
 * Configuration constants for AnimatedBackground component
 * Centralized values for easier maintenance and tuning
 */

export const PARTICLES_CONFIG = {
  FPS_LIMIT: 60,
  DENSITY_AREA: 800,
  MIN_SIZE: 1,
  MAX_SIZE: 3,
  LINK_WIDTH: 1,
  GRAB_DISTANCE: 140,
  PUSH_QUANTITY: 4,
  ATTRACT_ROTATE_X: 600,
  ATTRACT_ROTATE_Y: 1200,
} as const

export const PARTICLES_COUNT = {
  DARK: 80,
  LIGHT: 60,
} as const

export const PARTICLES_DISTANCE = {
  DARK: 150,
  LIGHT: 120,
} as const

export const PARTICLES_SPEED = {
  DARK: 1,
  LIGHT: 0.8,
} as const

export const PARTICLES_OPACITY = {
  DARK: {
    BASE: 0.4,
    LINK: 0.2,
    GRAB_LINK: 0.4,
  },
  LIGHT: {
    BASE: 0.3,
    LINK: 0.15,
    GRAB_LINK: 0.3,
  },
} as const

export const ANIMATION_SPEED = {
  OPACITY: 0.5,
  SIZE: 2,
} as const

export const ANIMATION_MIN_VALUES = {
  OPACITY: 0.1,
  SIZE: 0.5,
} as const
