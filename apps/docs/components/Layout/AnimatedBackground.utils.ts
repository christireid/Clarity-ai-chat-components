/**
 * Utility functions for generating particle configurations
 */

import type { ISourceOptions } from '@tsparticles/engine'
import {
  PARTICLES_CONFIG,
  PARTICLES_COUNT,
  PARTICLES_DISTANCE,
  PARTICLES_SPEED,
  PARTICLES_OPACITY,
  ANIMATION_SPEED,
  ANIMATION_MIN_VALUES,
} from './AnimatedBackground.config'

/**
 * Creates a minimal particle configuration for reduced motion preference
 */
export function createReducedMotionConfig(): ISourceOptions {
  return {
    particles: {
      number: { value: 0 },
    },
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
      },
    },
  }
}

/**
 * Creates a full particle configuration based on theme
 * 
 * @param isDark - Whether dark mode is active
 * @returns Complete particle configuration
 */
export function createParticlesConfig(isDark: boolean): ISourceOptions {
  const opacityConfig = isDark ? PARTICLES_OPACITY.DARK : PARTICLES_OPACITY.LIGHT

  // Use Tailwind brand colors via CSS variables for better theme integration
  // Fallback to hex values if CSS variables aren't available
  const baseColor = isDark ? '#60a5fa' : '#3b82f6' // brand-400 in dark, brand-500 in light
  const secondaryColor = isDark ? '#93c5fd' : '#60a5fa' // brand-300 in dark, brand-400 in light

  return {
    fpsLimit: PARTICLES_CONFIG.FPS_LIMIT,
    particles: {
      number: {
        value: isDark ? PARTICLES_COUNT.DARK : PARTICLES_COUNT.LIGHT,
        density: {
          enable: true,
          area: PARTICLES_CONFIG.DENSITY_AREA,
        },
      },
      color: {
        value: baseColor,
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: opacityConfig.BASE,
        random: true,
        animation: {
          enable: true,
          speed: ANIMATION_SPEED.OPACITY,
          minimumValue: ANIMATION_MIN_VALUES.OPACITY,
          sync: false,
        },
      },
      size: {
        value: { min: PARTICLES_CONFIG.MIN_SIZE, max: PARTICLES_CONFIG.MAX_SIZE },
        random: true,
        animation: {
          enable: true,
          speed: ANIMATION_SPEED.SIZE,
          minimumValue: ANIMATION_MIN_VALUES.SIZE,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: isDark ? PARTICLES_DISTANCE.DARK : PARTICLES_DISTANCE.LIGHT,
        color: secondaryColor,
        opacity: opacityConfig.LINK,
        width: PARTICLES_CONFIG.LINK_WIDTH,
      },
      move: {
        enable: true,
        speed: isDark ? PARTICLES_SPEED.DARK : PARTICLES_SPEED.LIGHT,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
        bounce: false,
        attract: {
          enable: false,
          rotateX: PARTICLES_CONFIG.ATTRACT_ROTATE_X,
          rotateY: PARTICLES_CONFIG.ATTRACT_ROTATE_Y,
        },
      },
    },
    interactivity: {
      detectOn: 'canvas',
      events: {
        onHover: {
          enable: true,
          mode: 'grab',
          parallax: {
            enable: false,
            force: 60,
            smooth: 10,
          },
        },
        onClick: {
          enable: true,
          mode: 'push',
        },
        resize: {
          enable: true,
        },
      },
      modes: {
        grab: {
          distance: PARTICLES_CONFIG.GRAB_DISTANCE,
          links: {
            opacity: opacityConfig.GRAB_LINK,
          },
        },
        push: {
          quantity: PARTICLES_CONFIG.PUSH_QUANTITY,
        },
      },
    },
    detectRetina: true,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
  }
}
