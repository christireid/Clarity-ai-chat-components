/**
 * Hero section components
 *
 * @module components/hero
 */

export { HeroParticles, default as HeroParticlesDefault } from './HeroParticles'
export type {
  HeroParticlesProps,
  ParticleFieldProps,
  InteractionState,
  InteractionMode,
  MousePosition,
} from './HeroParticles.types'

// Re-export hooks for advanced usage
export {
  useWebGLAvailable,
  useResponsiveParticles,
  useInteraction,
} from './hooks'
