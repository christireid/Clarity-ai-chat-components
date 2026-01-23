import { describe, it, expect, vi } from 'vitest'
import {
  ParticlePhysics,
  createParticlePhysics,
  DEFAULT_PHYSICS_CONFIG,
  type InteractionTarget,
} from './particle-physics'
import type { NoiseFunction3D } from 'simplex-noise'

describe('ParticlePhysics', () => {
  // Create a mock noise function that returns predictable values
  const mockNoise: NoiseFunction3D = vi.fn((x, y, z) => {
    // Return a value based on inputs for predictability
    return Math.sin(x + y + z) * 0.5 + 0.5
  })

  const createTestArrays = (count: number) => ({
    positions: new Float32Array(count * 3),
    velocities: new Float32Array(count * 3),
    origins: new Float32Array(count * 3),
  })

  describe('constructor', () => {
    it('should create instance with default config', () => {
      const physics = new ParticlePhysics(mockNoise)
      expect(physics).toBeInstanceOf(ParticlePhysics)
    })

    it('should merge custom config with defaults', () => {
      const physics = new ParticlePhysics(mockNoise, {
        noiseFrequency: 0.002,
      })
      expect(physics).toBeInstanceOf(ParticlePhysics)
    })
  })

  describe('createParticlePhysics', () => {
    it('should create a ParticlePhysics instance', () => {
      const physics = createParticlePhysics(mockNoise)
      expect(physics).toBeInstanceOf(ParticlePhysics)
    })
  })

  describe('setConfig', () => {
    it('should update configuration', () => {
      const physics = new ParticlePhysics(mockNoise)
      physics.setConfig({ damping: 0.8 })
      // Verify by running a step and checking damping was applied
      const { positions, velocities, origins } = createTestArrays(1)
      velocities[0] = 1.0
      physics.applyDamping(velocities, 1)
      // Default damping is 0.95, but we set 0.8
      expect(velocities[0]).toBeCloseTo(0.8)
    })
  })

  describe('applyNoiseForce', () => {
    it('should modify velocities based on noise', () => {
      const physics = new ParticlePhysics(mockNoise)
      const { positions, velocities } = createTestArrays(2)

      // Set initial positions
      positions[0] = 1
      positions[1] = 2
      positions[2] = 0.5
      positions[3] = -1
      positions[4] = 0
      positions[5] = 0.3

      // Apply noise force
      physics.applyNoiseForce(velocities, positions, 1.0, 2)

      // Velocities should have changed from initial 0
      const hasChanged =
        velocities[0] !== 0 ||
        velocities[1] !== 0 ||
        velocities[2] !== 0 ||
        velocities[3] !== 0 ||
        velocities[4] !== 0 ||
        velocities[5] !== 0

      expect(hasChanged).toBe(true)
    })
  })

  describe('applyInteractionForce', () => {
    it('should not modify velocities when interaction is inactive', () => {
      const physics = new ParticlePhysics(mockNoise)
      const { positions, velocities } = createTestArrays(1)

      positions[0] = 1
      positions[1] = 1
      positions[2] = 0

      const target: InteractionTarget = { x: 0, y: 0, isActive: false }

      physics.applyInteractionForce(velocities, positions, target, 'repel', 1.0, 1)

      expect(velocities[0]).toBe(0)
      expect(velocities[1]).toBe(0)
    })

    it('should repel particles away from interaction point', () => {
      const physics = new ParticlePhysics(mockNoise, { interactionRadius: 5 })
      const { positions, velocities } = createTestArrays(1)

      // Particle at (1, 1, 0)
      positions[0] = 1
      positions[1] = 1
      positions[2] = 0

      // Interaction at origin (0, 0)
      const target: InteractionTarget = { x: 0, y: 0, isActive: true }

      physics.applyInteractionForce(velocities, positions, target, 'repel', 1.0, 1)

      // Particle should be pushed away from origin (positive velocities)
      expect(velocities[0]).toBeGreaterThan(0)
      expect(velocities[1]).toBeGreaterThan(0)
    })

    it('should attract particles toward interaction point', () => {
      const physics = new ParticlePhysics(mockNoise, { interactionRadius: 5 })
      const { positions, velocities } = createTestArrays(1)

      // Particle at (1, 1, 0)
      positions[0] = 1
      positions[1] = 1
      positions[2] = 0

      // Interaction at origin (0, 0)
      const target: InteractionTarget = { x: 0, y: 0, isActive: true }

      physics.applyInteractionForce(velocities, positions, target, 'attract', 1.0, 1)

      // Particle should be pulled toward origin (negative velocities)
      expect(velocities[0]).toBeLessThan(0)
      expect(velocities[1]).toBeLessThan(0)
    })

    it('should apply hybrid mode correctly', () => {
      const physics = new ParticlePhysics(mockNoise, { interactionRadius: 5 })
      const { positions, velocities } = createTestArrays(1)

      // Particle far from interaction point
      positions[0] = 2
      positions[1] = 2
      positions[2] = 0

      // Interaction at origin
      const target: InteractionTarget = { x: 0, y: 0, isActive: true }

      physics.applyInteractionForce(velocities, positions, target, 'hybrid', 1.0, 1)

      // At distance, should attract (negative velocities)
      expect(velocities[0]).toBeLessThan(0)
      expect(velocities[1]).toBeLessThan(0)
    })
  })

  describe('applyReturnForce', () => {
    it('should pull particles back toward origin', () => {
      const physics = new ParticlePhysics(mockNoise)
      const { positions, velocities, origins } = createTestArrays(1)

      // Origin at (0, 0, 0)
      origins[0] = 0
      origins[1] = 0
      origins[2] = 0

      // Particle displaced to (2, 2, 1)
      positions[0] = 2
      positions[1] = 2
      positions[2] = 1

      physics.applyReturnForce(velocities, positions, origins, 1)

      // Velocities should point back toward origin
      expect(velocities[0]).toBeLessThan(0)
      expect(velocities[1]).toBeLessThan(0)
      expect(velocities[2]).toBeLessThan(0)
    })
  })

  describe('applyDamping', () => {
    it('should reduce velocity magnitudes', () => {
      const physics = new ParticlePhysics(mockNoise)
      const velocities = new Float32Array([1.0, 0.5, -0.3, 2.0, -1.0, 0.8])

      physics.applyDamping(velocities, 2)

      // All velocities should be reduced by damping factor (default 0.95)
      expect(velocities[0]).toBeCloseTo(0.95)
      expect(velocities[1]).toBeCloseTo(0.475)
      expect(velocities[2]).toBeCloseTo(-0.285)
      expect(velocities[3]).toBeCloseTo(1.9)
      expect(velocities[4]).toBeCloseTo(-0.95)
      expect(velocities[5]).toBeCloseTo(0.76)
    })
  })

  describe('integrate', () => {
    it('should update positions based on velocities', () => {
      const physics = new ParticlePhysics(mockNoise)
      const { positions, velocities, origins } = createTestArrays(1)

      positions[0] = 0
      positions[1] = 0
      positions[2] = 0

      velocities[0] = 0.1
      velocities[1] = -0.05
      velocities[2] = 0.02

      origins[0] = 0
      origins[1] = 0
      origins[2] = 0

      physics.integrate(positions, velocities, origins, 1)

      expect(positions[0]).toBeCloseTo(0.1)
      expect(positions[1]).toBeCloseTo(-0.05)
      expect(positions[2]).toBeCloseTo(0.02)
    })

    it('should clamp displacement to maxDisplacement', () => {
      const physics = new ParticlePhysics(mockNoise, { maxDisplacement: 1.0 })
      const { positions, velocities, origins } = createTestArrays(1)

      positions[0] = 0
      positions[1] = 0
      positions[2] = 0

      // Large velocity that would exceed max displacement
      velocities[0] = 10
      velocities[1] = 10
      velocities[2] = 10

      origins[0] = 0
      origins[1] = 0
      origins[2] = 0

      physics.integrate(positions, velocities, origins, 1)

      // Calculate resulting displacement magnitude
      const dx = positions[0]
      const dy = positions[1]
      const dz = positions[2]
      const displacement = Math.sqrt(dx * dx + dy * dy + dz * dz)

      expect(displacement).toBeCloseTo(1.0)
    })
  })

  describe('step', () => {
    it('should run a complete physics step', () => {
      const physics = new ParticlePhysics(mockNoise)
      const { positions, velocities, origins } = createTestArrays(2)

      // Initialize particles
      for (let i = 0; i < 6; i++) {
        positions[i] = (Math.random() - 0.5) * 2
        origins[i] = positions[i]
      }

      const initialPositions = new Float32Array(positions)

      // Run a physics step
      physics.step(positions, velocities, origins, 1.0, null, 'repel', 0.5, 2)

      // Positions should have changed
      let hasChanged = false
      for (let i = 0; i < 6; i++) {
        if (positions[i] !== initialPositions[i]) {
          hasChanged = true
          break
        }
      }

      expect(hasChanged).toBe(true)
    })

    it('should apply interaction when target is active', () => {
      const physics = new ParticlePhysics(mockNoise, { interactionRadius: 10 })
      const { positions, velocities, origins } = createTestArrays(1)

      positions[0] = 1
      positions[1] = 1
      positions[2] = 0
      origins[0] = 1
      origins[1] = 1
      origins[2] = 0

      const target: InteractionTarget = { x: 0, y: 0, isActive: true }

      physics.step(positions, velocities, origins, 1.0, target, 'repel', 1.0, 1)

      // Particle should have been pushed away
      expect(positions[0]).toBeGreaterThan(1)
      expect(positions[1]).toBeGreaterThan(1)
    })
  })

  describe('DEFAULT_PHYSICS_CONFIG', () => {
    it('should have expected default values', () => {
      expect(DEFAULT_PHYSICS_CONFIG.noiseFrequency).toBe(0.0008)
      expect(DEFAULT_PHYSICS_CONFIG.noiseAmplitude).toBe(0.15)
      expect(DEFAULT_PHYSICS_CONFIG.baseSpeed).toBe(0.0003)
      expect(DEFAULT_PHYSICS_CONFIG.interactionRadius).toBe(2.5)
      expect(DEFAULT_PHYSICS_CONFIG.returnForce).toBe(0.02)
      expect(DEFAULT_PHYSICS_CONFIG.maxDisplacement).toBe(3.0)
      expect(DEFAULT_PHYSICS_CONFIG.damping).toBe(0.95)
    })
  })
})
