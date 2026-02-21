import type { Engine } from '@tsparticles/engine'

/**
 * Extended Engine interface with methods that tsparticles provides
 * but may not be fully typed in the @tsparticles/engine package
 */
export interface ParticlesEngine extends Engine {
  pause?: () => void
  play?: () => void
  destroy?: () => void
  canvas?: {
    resize?: () => void
    element?: {
      parentElement?: HTMLElement | null
    }
  }
  interactivity?: {
    mouse?: {
      position?: { x: number; y: number }
    }
  }
}

/**
 * Type guard to check if engine has expected methods
 */
export function isParticlesEngine(engine: Engine | null): engine is ParticlesEngine {
  return engine !== null && typeof engine === 'object'
}
