import type { ISourceOptions, RecursivePartial } from '@tsparticles/engine'

// Type helper for particle options with flexible density config
type ParticleOptions = RecursivePartial<ISourceOptions> & {
  particles?: {
    number?: {
      density?: {
        enable?: boolean
        area?: number
        value_area?: number
      }
    }
  }
}

/**
 * Creates dark mode particle configuration
 * Glowing nodes with connecting lines for cyberpunk aesthetic
 */
export function createDarkModeConfig(reducedMotion: boolean): ParticleOptions {
  return {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: reducedMotion ? 0 : 50,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ['#60a5fa', '#3b82f6', '#93c5fd', '#2563eb'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: {
          enable: !reducedMotion,
          speed: 0.5,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: !reducedMotion,
          speed: 2,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: '#3b82f6',
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: !reducedMotion,
        speed: 0.5,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: false,
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: !reducedMotion,
          mode: 'grab',
        },
        onClick: {
          enable: false,
        },
        resize: { enable: true },
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.4,
          },
        },
      },
    },
    detectRetina: true,
  }
}

/**
 * Creates light mode particle configuration
 * Subtle flowing mesh with soft gradient waves
 */
export function createLightModeConfig(reducedMotion: boolean): ParticleOptions {
  return {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: reducedMotion ? 0 : 40,
        density: {
          enable: true,
          value_area: 1000,
        },
      },
      color: {
        value: ['#3b82f6', '#2563eb', '#60a5fa', '#93c5fd'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.05, max: 0.25 },
        animation: {
          enable: !reducedMotion,
          speed: 0.3,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 2.5 },
        animation: {
          enable: !reducedMotion,
          speed: 1.5,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 180,
        color: '#3b82f6',
        opacity: 0.15,
        width: 0.5,
      },
      move: {
        enable: !reducedMotion,
        speed: 0.3,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: false,
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: !reducedMotion,
          mode: 'grab',
        },
        onClick: {
          enable: false,
        },
        resize: { enable: true },
      },
      modes: {
        grab: {
          distance: 250,
          links: {
            opacity: 0.3,
          },
        },
      },
    },
    detectRetina: true,
  }
}
