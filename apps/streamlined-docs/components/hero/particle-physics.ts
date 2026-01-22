/**
 * Particle Physics Engine
 *
 * Pure physics calculations for particle systems, separated from rendering.
 * This module is testable without Three.js dependencies.
 */

import type { NoiseFunction3D } from 'simplex-noise'
import type { InteractionMode } from './HeroParticles.types'

/**
 * Configuration for the physics engine
 */
export interface PhysicsConfig {
  /** Noise frequency for organic movement */
  noiseFrequency: number
  /** Noise amplitude for velocity changes */
  noiseAmplitude: number
  /** Base speed multiplier for time-based effects */
  baseSpeed: number
  /** Radius within which interaction forces apply */
  interactionRadius: number
  /** Force pulling particles back to origin */
  returnForce: number
  /** Maximum distance from origin */
  maxDisplacement: number
  /** Velocity damping factor (0-1, lower = more damping) */
  damping: number
}

/**
 * Default physics configuration
 */
export const DEFAULT_PHYSICS_CONFIG: PhysicsConfig = {
  noiseFrequency: 0.0008,
  noiseAmplitude: 0.15,
  baseSpeed: 0.0003,
  interactionRadius: 2.5,
  returnForce: 0.02,
  maxDisplacement: 3.0,
  damping: 0.95,
}

/**
 * Interaction target position and state
 */
export interface InteractionTarget {
  x: number
  y: number
  isActive: boolean
}

/**
 * Particle Physics Engine
 *
 * Handles all physics calculations for particle systems.
 * Operates on Float32Arrays for performance.
 */
export class ParticlePhysics {
  private config: PhysicsConfig
  private noise: NoiseFunction3D

  constructor(noise: NoiseFunction3D, config: Partial<PhysicsConfig> = {}) {
    this.noise = noise
    this.config = { ...DEFAULT_PHYSICS_CONFIG, ...config }
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<PhysicsConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Apply noise-based drift forces to all particles
   *
   * @param velocities - Velocity array (count * 3)
   * @param positions - Position array (count * 3)
   * @param time - Current time for noise sampling
   * @param count - Number of particles
   */
  applyNoiseForce(
    velocities: Float32Array,
    positions: Float32Array,
    time: number,
    count: number
  ): void {
    const { noiseFrequency, noiseAmplitude, baseSpeed } = this.config
    const timeScale = time * baseSpeed * 10

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = positions[i3]
      const y = positions[i3 + 1]
      const z = positions[i3 + 2]

      // Sample noise at different offsets for each axis
      const noiseX =
        this.noise(x * noiseFrequency, y * noiseFrequency, timeScale) * 2 - 1
      const noiseY =
        this.noise(y * noiseFrequency + 100, z * noiseFrequency, timeScale) *
          2 -
        1
      const noiseZ =
        this.noise(z * noiseFrequency + 200, x * noiseFrequency, timeScale) *
          2 -
        1

      // Apply noise as velocity changes
      velocities[i3] += noiseX * noiseAmplitude * 0.01
      velocities[i3 + 1] += noiseY * noiseAmplitude * 0.01
      velocities[i3 + 2] += noiseZ * noiseAmplitude * 0.005
    }
  }

  /**
   * Apply interaction forces (mouse/touch) to particles
   *
   * @param velocities - Velocity array (count * 3)
   * @param positions - Position array (count * 3)
   * @param target - Interaction target position and state
   * @param mode - Interaction mode (repel/attract/hybrid)
   * @param strength - Interaction strength (0-1)
   * @param count - Number of particles
   */
  applyInteractionForce(
    velocities: Float32Array,
    positions: Float32Array,
    target: InteractionTarget,
    mode: InteractionMode,
    strength: number,
    count: number
  ): void {
    if (!target.isActive || strength <= 0) return

    const { interactionRadius } = this.config
    const radiusSq = interactionRadius * interactionRadius

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = positions[i3]
      const y = positions[i3 + 1]

      const dx = x - target.x
      const dy = y - target.y
      const distSq = dx * dx + dy * dy

      if (distSq < radiusSq && distSq > 0.0001) {
        const dist = Math.sqrt(distSq)
        const normalizedDist = dist / interactionRadius
        const falloff = 1 - normalizedDist

        // Normalize direction
        const normalizedDx = dx / dist
        const normalizedDy = dy / dist

        // Calculate force based on mode
        let forceMultiplier: number

        switch (mode) {
          case 'attract':
            forceMultiplier = -falloff * strength * 0.15
            break
          case 'hybrid':
            if (normalizedDist > 0.4) {
              forceMultiplier = -falloff * strength * 0.1
            } else {
              forceMultiplier = (1 - normalizedDist * 2.5) * strength * 0.2
            }
            break
          case 'repel':
          default:
            forceMultiplier = falloff * strength * 0.15
            break
        }

        velocities[i3] += normalizedDx * forceMultiplier
        velocities[i3 + 1] += normalizedDy * forceMultiplier
      }
    }
  }

  /**
   * Apply return-to-origin forces
   *
   * @param velocities - Velocity array (count * 3)
   * @param positions - Position array (count * 3)
   * @param origins - Original position array (count * 3)
   * @param count - Number of particles
   */
  applyReturnForce(
    velocities: Float32Array,
    positions: Float32Array,
    origins: Float32Array,
    count: number
  ): void {
    const { returnForce } = this.config

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      const homeX = origins[i3] - positions[i3]
      const homeY = origins[i3 + 1] - positions[i3 + 1]
      const homeZ = origins[i3 + 2] - positions[i3 + 2]

      velocities[i3] += homeX * returnForce
      velocities[i3 + 1] += homeY * returnForce
      velocities[i3 + 2] += homeZ * returnForce
    }
  }

  /**
   * Apply velocity damping
   *
   * @param velocities - Velocity array (count * 3)
   * @param count - Number of particles
   */
  applyDamping(velocities: Float32Array, count: number): void {
    const { damping } = this.config

    for (let i = 0; i < count * 3; i++) {
      velocities[i] *= damping
    }
  }

  /**
   * Integrate velocities into positions and clamp displacement
   *
   * @param positions - Position array (count * 3)
   * @param velocities - Velocity array (count * 3)
   * @param origins - Original position array (count * 3)
   * @param count - Number of particles
   */
  integrate(
    positions: Float32Array,
    velocities: Float32Array,
    origins: Float32Array,
    count: number
  ): void {
    const { maxDisplacement } = this.config

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Update position
      positions[i3] += velocities[i3]
      positions[i3 + 1] += velocities[i3 + 1]
      positions[i3 + 2] += velocities[i3 + 2]

      // Clamp displacement from origin
      const dispX = positions[i3] - origins[i3]
      const dispY = positions[i3 + 1] - origins[i3 + 1]
      const dispZ = positions[i3 + 2] - origins[i3 + 2]
      const dispMag = Math.sqrt(dispX * dispX + dispY * dispY + dispZ * dispZ)

      if (dispMag > maxDisplacement) {
        const scale = maxDisplacement / dispMag
        positions[i3] = origins[i3] + dispX * scale
        positions[i3 + 1] = origins[i3 + 1] + dispY * scale
        positions[i3 + 2] = origins[i3 + 2] + dispZ * scale
      }
    }
  }

  /**
   * Run a complete physics step
   *
   * @param positions - Position array (count * 3)
   * @param velocities - Velocity array (count * 3)
   * @param origins - Original position array (count * 3)
   * @param time - Current time
   * @param interaction - Interaction target (optional)
   * @param interactionMode - Interaction mode
   * @param interactionStrength - Interaction strength
   * @param count - Number of particles
   */
  step(
    positions: Float32Array,
    velocities: Float32Array,
    origins: Float32Array,
    time: number,
    interaction: InteractionTarget | null,
    interactionMode: InteractionMode,
    interactionStrength: number,
    count: number
  ): void {
    // Apply all forces
    this.applyNoiseForce(velocities, positions, time, count)

    if (interaction) {
      this.applyInteractionForce(
        velocities,
        positions,
        interaction,
        interactionMode,
        interactionStrength,
        count
      )
    }

    this.applyReturnForce(velocities, positions, origins, count)
    this.applyDamping(velocities, count)

    // Integrate
    this.integrate(positions, velocities, origins, count)
  }
}

/**
 * Create a particle physics engine instance
 */
export function createParticlePhysics(
  noise: NoiseFunction3D,
  config?: Partial<PhysicsConfig>
): ParticlePhysics {
  return new ParticlePhysics(noise, config)
}
