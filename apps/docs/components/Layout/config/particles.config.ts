import type { IOptions, RecursivePartial } from '@tsparticles/engine'

// Extended type to allow area property in density config
type ParticleConfig = RecursivePartial<IOptions> & {
  particles?: {
    number?: {
      density?: {
        enable?: boolean
        area?: number
      }
    }
  }
}

/**
 * Base particle configuration shared between dark and light modes.
 */
const baseConfig: ParticleConfig = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push' as const,
      },
      resize: { enable: true },
    },
  },
  particles: {
    shape: {
      type: 'circle',
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce',
      },
      random: false,
      straight: false,
    },
  },
  detectRetina: true,
}

/**
 * Dark mode particle configuration.
 * Features: Glowing nodes with vibrant blue colors, more particles, higher opacity.
 */
export const darkParticlesConfig: ParticleConfig = {
  ...baseConfig,
  interactivity: {
    ...baseConfig.interactivity,
    events: {
      ...baseConfig.interactivity?.events,
      onHover: {
        enable: true,
        mode: 'repulse' as const,
      },
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    ...baseConfig.particles,
    color: {
      value: '#60a5fa', // brand-400
    },
    links: {
      color: '#3b82f6', // brand-500
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      ...baseConfig.particles?.move,
      speed: 1,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 50,
    },
    opacity: {
      value: { min: 0.3, max: 0.6 },
      animation: {
        enable: true,
        speed: 0.5,
        sync: false,
      },
    },
    size: {
      value: { min: 0.5, max: 3 },
      animation: {
        enable: true,
        speed: 2,
        sync: false,
      },
    },
  },
}

/**
 * Light mode particle configuration.
 * Features: Subtle mesh with softer colors, fewer particles, lower opacity.
 */
export const lightParticlesConfig: ParticleConfig = {
  ...baseConfig,
  interactivity: {
    ...baseConfig.interactivity,
    events: {
      ...baseConfig.interactivity?.events,
      onHover: {
        enable: true,
        mode: 'grab' as const,
      },
    },
    modes: {
      push: {
        quantity: 1,
      },
      grab: {
        distance: 120,
        links: {
          opacity: 0.4,
        },
      },
    },
  },
  particles: {
    ...baseConfig.particles,
    color: {
      value: '#93c5fd', // brand-300
    },
    links: {
      color: '#bfdbfe', // brand-200
      distance: 120,
      enable: true,
      opacity: 0.2,
      width: 0.5,
    },
    move: {
      ...baseConfig.particles?.move,
      speed: 0.5,
    },
    number: {
      density: {
        enable: true,
        area: 1000,
      },
      value: 40,
    },
    opacity: {
      value: { min: 0.2, max: 0.4 },
      animation: {
        enable: true,
        speed: 0.3,
        sync: false,
      },
    },
    size: {
      value: { min: 0.3, max: 2 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
  },
}
