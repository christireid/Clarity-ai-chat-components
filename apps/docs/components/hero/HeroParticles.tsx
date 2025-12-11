'use client'

import { Suspense, useMemo, useRef, useEffect, RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { cn } from '@/lib/utils'
import {
  useMounted,
  usePrefersReducedMotion,
  useIsDark,
} from '@/components/Layout/hooks'
import {
  useWebGLAvailable,
  useResponsiveParticles,
  useMousePosition,
} from './hooks'
import {
  PHYSICS,
  VISUALS,
  BLOOM,
  COLORS,
  CAMERA,
  CANVAS,
  BOUNDS,
} from './particle-config'
import type {
  HeroParticlesProps,
  ParticleFieldProps,
  MousePosition,
} from './HeroParticles.types'

// =============================================================================
// GLSL SHADERS
// =============================================================================

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;

  uniform float uTime;
  uniform float uSizeMultiplier;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    vColor = aColor;
    vPhase = aPhase;

    // Position in view space
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // Depth-based size attenuation
    float depth = -mvPosition.z;
    float depthAttenuation = 1.0 / (1.0 + depth * ${VISUALS.depthAttenuation.toFixed(2)});

    // Calculate alpha based on depth (fade particles at edges)
    float normalizedDepth = (position.z - ${VISUALS.depthMin.toFixed(1)}) / ${(VISUALS.depthMax - VISUALS.depthMin).toFixed(1)};
    vAlpha = mix(${VISUALS.opacityMin.toFixed(2)}, ${VISUALS.opacityMax.toFixed(2)}, normalizedDepth);

    // Subtle size pulsing based on phase
    float pulse = 1.0 + sin(uTime * 0.5 + aPhase * 6.28318) * 0.1;

    // Final point size
    gl_PointSize = aSize * uSizeMultiplier * depthAttenuation * pulse * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uGlowIntensity;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vPhase;

  void main() {
    // Distance from center of point
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);

    // Soft circular falloff with glow
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

    // Inner glow effect
    float glow = exp(-dist * 4.0) * uGlowIntensity;

    // Combined alpha with glow boost
    float finalAlpha = (alpha + glow * 0.5) * vAlpha;

    // Slight color brightening towards center
    vec3 finalColor = vColor + glow * 0.3;

    // Discard fully transparent pixels
    if (finalAlpha < 0.01) discard;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`

// =============================================================================
// NOISE FUNCTION (Simplex-like 3D noise)
// =============================================================================

/**
 * Simple pseudo-random function for deterministic noise
 */
function pseudoRandom(x: number, y: number, z: number): number {
  const dot = x * 12.9898 + y * 78.233 + z * 37.719
  return (Math.sin(dot) * 43758.5453) % 1
}

/**
 * Smooth noise function for organic particle movement
 * Uses trilinear interpolation for smooth results
 */
function smoothNoise(x: number, y: number, z: number, time: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const xf = x - xi
  const yf = y - yi
  const zf = z - zi

  // Smooth interpolation
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const w = zf * zf * (3 - 2 * zf)

  // 8 corner values
  const n000 = pseudoRandom(xi, yi, zi + time * 0.1)
  const n100 = pseudoRandom(xi + 1, yi, zi + time * 0.1)
  const n010 = pseudoRandom(xi, yi + 1, zi + time * 0.1)
  const n110 = pseudoRandom(xi + 1, yi + 1, zi + time * 0.1)
  const n001 = pseudoRandom(xi, yi, zi + 1 + time * 0.1)
  const n101 = pseudoRandom(xi + 1, yi, zi + 1 + time * 0.1)
  const n011 = pseudoRandom(xi, yi + 1, zi + 1 + time * 0.1)
  const n111 = pseudoRandom(xi + 1, yi + 1, zi + 1 + time * 0.1)

  // Trilinear interpolation
  const nx00 = n000 * (1 - u) + n100 * u
  const nx10 = n010 * (1 - u) + n110 * u
  const nx01 = n001 * (1 - u) + n101 * u
  const nx11 = n011 * (1 - u) + n111 * u
  const nxy0 = nx00 * (1 - v) + nx10 * v
  const nxy1 = nx01 * (1 - v) + nx11 * v

  return nxy0 * (1 - w) + nxy1 * w
}

// =============================================================================
// PARTICLE FIELD COMPONENT
// =============================================================================

/**
 * Inner component that renders the particle system
 * Uses buffer geometry for performance with instanced attributes
 */
function ParticleField({
  count,
  primaryColor,
  secondaryColor,
  repulsionStrength,
  mouseRef,
  animated,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  // Store original positions for return-to-home behavior
  const originalPositions = useRef<Float32Array | null>(null)
  const velocities = useRef<Float32Array | null>(null)

  // Generate initial particle data
  const { positions, colors, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const phases = new Float32Array(count)

    // Create a third color for variation
    const tertiaryColor = new THREE.Color().lerpColors(
      primaryColor,
      secondaryColor,
      0.5
    )

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Distribute particles in 3D space
      positions[i3] = (Math.random() - 0.5) * BOUNDS.x * 2
      positions[i3 + 1] = (Math.random() - 0.5) * BOUNDS.y * 2
      positions[i3 + 2] =
        BOUNDS.z.min + Math.random() * (BOUNDS.z.max - BOUNDS.z.min)

      // Color variation (blend between primary, secondary, tertiary)
      const colorChoice = Math.random()
      let particleColor: THREE.Color

      if (colorChoice < 0.4) {
        particleColor = primaryColor
      } else if (colorChoice < 0.7) {
        particleColor = secondaryColor
      } else {
        particleColor = tertiaryColor
      }

      // Add slight random variation to color
      const variation = 0.1
      colors[i3] = Math.min(
        1,
        Math.max(0, particleColor.r + (Math.random() - 0.5) * variation)
      )
      colors[i3 + 1] = Math.min(
        1,
        Math.max(0, particleColor.g + (Math.random() - 0.5) * variation)
      )
      colors[i3 + 2] = Math.min(
        1,
        Math.max(0, particleColor.b + (Math.random() - 0.5) * variation)
      )

      // Size variation
      sizes[i] =
        VISUALS.particleSize *
        (1 + (Math.random() - 0.5) * VISUALS.sizeVariation * 2)

      // Random phase for animation variation
      phases[i] = Math.random()
    }

    return { positions, colors, sizes, phases }
  }, [count, primaryColor, secondaryColor])

  // Initialize refs on mount
  useEffect(() => {
    originalPositions.current = new Float32Array(positions)
    velocities.current = new Float32Array(count * 3).fill(0)
  }, [positions, count])

  // Uniforms for shaders
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSizeMultiplier: { value: 1 },
      uGlowIntensity: { value: VISUALS.glowIntensity },
    }),
    []
  )

  // Animation loop
  useFrame((state) => {
    if (!animated) return
    if (!pointsRef.current) return
    if (!originalPositions.current) return
    if (!velocities.current) return

    const time = state.clock.elapsedTime
    const geometry = pointsRef.current.geometry
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    // Update uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
    }

    // Get mouse position in world space
    const mouse = mouseRef.current
    const mouseWorld = new THREE.Vector3(
      (mouse?.x ?? 0) * viewport.width * 0.5,
      (mouse?.y ?? 0) * viewport.height * 0.5,
      0
    )

    // Update each particle
    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Current position
      const x = posArray[i3]
      const y = posArray[i3 + 1]
      const z = posArray[i3 + 2]

      // Original position
      const ox = originalPositions.current[i3]
      const oy = originalPositions.current[i3 + 1]
      const oz = originalPositions.current[i3 + 2]

      // Noise-based drift
      const noiseX =
        smoothNoise(
          x * PHYSICS.noiseFrequency,
          y * PHYSICS.noiseFrequency,
          z * PHYSICS.noiseFrequency,
          time * PHYSICS.baseSpeed
        ) *
          2 -
        1
      const noiseY =
        smoothNoise(
          y * PHYSICS.noiseFrequency + 100,
          z * PHYSICS.noiseFrequency,
          x * PHYSICS.noiseFrequency,
          time * PHYSICS.baseSpeed
        ) *
          2 -
        1
      const noiseZ =
        smoothNoise(
          z * PHYSICS.noiseFrequency + 200,
          x * PHYSICS.noiseFrequency,
          y * PHYSICS.noiseFrequency,
          time * PHYSICS.baseSpeed
        ) *
          2 -
        1

      // Apply noise velocity
      velocities.current[i3] += noiseX * PHYSICS.noiseAmplitude * 0.01
      velocities.current[i3 + 1] += noiseY * PHYSICS.noiseAmplitude * 0.01
      velocities.current[i3 + 2] += noiseZ * PHYSICS.noiseAmplitude * 0.005

      // Mouse repulsion
      if (mouse?.isActive && repulsionStrength > 0) {
        const dx = x - mouseWorld.x
        const dy = y - mouseWorld.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < PHYSICS.repulsionRadius && dist > 0.01) {
          const force =
            (1 - dist / PHYSICS.repulsionRadius) *
            repulsionStrength *
            PHYSICS.repulsionStrength
          const normalizedDx = dx / dist
          const normalizedDy = dy / dist

          velocities.current[i3] += normalizedDx * force * 0.1
          velocities.current[i3 + 1] += normalizedDy * force * 0.1
        }
      }

      // Return-to-home force
      const homeX = ox - x
      const homeY = oy - y
      const homeZ = oz - z

      velocities.current[i3] += homeX * PHYSICS.returnForce
      velocities.current[i3 + 1] += homeY * PHYSICS.returnForce
      velocities.current[i3 + 2] += homeZ * PHYSICS.returnForce

      // Apply velocity with damping
      const damping = 0.95
      velocities.current[i3] *= damping
      velocities.current[i3 + 1] *= damping
      velocities.current[i3 + 2] *= damping

      // Update position
      posArray[i3] += velocities.current[i3]
      posArray[i3 + 1] += velocities.current[i3 + 1]
      posArray[i3 + 2] += velocities.current[i3 + 2]

      // Clamp displacement
      const dispX = posArray[i3] - ox
      const dispY = posArray[i3 + 1] - oy
      const dispZ = posArray[i3 + 2] - oz
      const dispMag = Math.sqrt(dispX * dispX + dispY * dispY + dispZ * dispZ)

      if (dispMag > PHYSICS.maxDisplacement) {
        const scale = PHYSICS.maxDisplacement / dispMag
        posArray[i3] = ox + dispX * scale
        posArray[i3 + 1] = oy + dispY * scale
        posArray[i3 + 2] = oz + dispZ * scale
      }
    }

    // Mark attribute for update
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={count}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// =============================================================================
// SCENE COMPONENT
// =============================================================================

interface SceneProps {
  count: number
  primaryColor: THREE.Color
  secondaryColor: THREE.Color
  repulsionStrength: number
  mouseRef: RefObject<MousePosition>
  animated: boolean
  bloomIntensity: number
}

/**
 * Scene wrapper containing particles and post-processing
 */
function Scene({
  count,
  primaryColor,
  secondaryColor,
  repulsionStrength,
  mouseRef,
  animated,
  bloomIntensity,
}: SceneProps) {
  return (
    <>
      <ParticleField
        count={count}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        repulsionStrength={repulsionStrength}
        mouseRef={mouseRef}
        animated={animated}
      />
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          luminanceThreshold={BLOOM.luminanceThreshold}
          luminanceSmoothing={BLOOM.luminanceSmoothing}
          mipmapBlur={BLOOM.mipmapBlur}
        />
      </EffectComposer>
    </>
  )
}

// =============================================================================
// GRADIENT FALLBACK
// =============================================================================

/**
 * CSS gradient fallback for when WebGL is unavailable
 * Provides a pleasing visual without 3D rendering
 */
function GradientFallback({ isDark }: { isDark: boolean }) {
  const colors = isDark ? COLORS.dark : COLORS.light

  return (
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, ${colors.primary}20 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, ${colors.secondary}20 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, ${colors.tertiary}10 0%, transparent 70%)
        `,
      }}
    />
  )
}

// =============================================================================
// LOADING PLACEHOLDER
// =============================================================================

/**
 * Placeholder shown while Canvas loads
 */
function LoadingPlaceholder() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * HeroParticles - Premium 3D particle animation for the hero section
 *
 * Features:
 * - Organic particle drift using noise functions
 * - Mouse-interactive repulsion effect
 * - Bloom post-processing for dreamy glow
 * - Theme-aware colors (dark/light mode)
 * - Responsive particle count
 * - Accessible (respects prefers-reduced-motion)
 * - WebGL fallback to CSS gradient
 *
 * @example
 * ```tsx
 * <div className="relative h-screen">
 *   <HeroParticles />
 *   <div className="relative z-10">
 *     // Hero content here
 *   </div>
 * </div>
 * ```
 */
export function HeroParticles({
  count: customCount,
  primaryColor: customPrimary,
  secondaryColor: customSecondary,
  bloomIntensity: customBloom,
  repulsionStrength = PHYSICS.repulsionStrength,
  animated: customAnimated,
  className,
}: HeroParticlesProps) {
  // Hooks
  const mounted = useMounted()
  const prefersReducedMotion = usePrefersReducedMotion()
  const isDark = useIsDark()
  const { isAvailable: webglAvailable, isChecked: webglChecked } =
    useWebGLAvailable()
  const { count: responsiveCount, shouldRender } =
    useResponsiveParticles(customCount)
  const { mouseRef, handleMouseMove, handleMouseLeave } = useMousePosition()

  // Computed values
  const animated =
    customAnimated !== undefined ? customAnimated : !prefersReducedMotion
  const themeColors = isDark ? COLORS.dark : COLORS.light

  const primaryColor = useMemo(
    () => new THREE.Color(customPrimary ?? themeColors.primary),
    [customPrimary, themeColors.primary]
  )

  const secondaryColor = useMemo(
    () => new THREE.Color(customSecondary ?? themeColors.secondary),
    [customSecondary, themeColors.secondary]
  )

  const bloomIntensity =
    customBloom ?? (isDark ? BLOOM.intensityDark : BLOOM.intensityLight)

  // Don't render during SSR or on very small viewports
  if (!mounted || !shouldRender) {
    return null
  }

  // Show fallback if WebGL is unavailable
  if (webglChecked && !webglAvailable) {
    return (
      <div
        className={cn(
          'absolute inset-0 -z-10 overflow-hidden pointer-events-none',
          className
        )}
      >
        <GradientFallback isDark={isDark} />
      </div>
    )
  }

  // Show static particles for reduced motion
  if (prefersReducedMotion && customAnimated !== true) {
    return (
      <div
        className={cn(
          'absolute inset-0 -z-10 overflow-hidden pointer-events-none',
          className
        )}
      >
        <GradientFallback isDark={isDark} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'absolute inset-0 -z-10 overflow-hidden',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ pointerEvents: 'none' }}
    >
      {/* Invisible overlay to capture mouse events */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: 'auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      <Suspense fallback={<LoadingPlaceholder />}>
        <Canvas
          camera={{
            fov: CAMERA.fov,
            near: CAMERA.near,
            far: CAMERA.far,
            position: CAMERA.position as unknown as THREE.Vector3Tuple,
          }}
          dpr={CANVAS.dpr as [number, number]}
          gl={{
            antialias: CANVAS.antialias,
            alpha: CANVAS.alpha,
            powerPreference: CANVAS.powerPreference,
          }}
          style={{ pointerEvents: 'none' }}
        >
          <Scene
            count={responsiveCount}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            repulsionStrength={repulsionStrength}
            mouseRef={mouseRef}
            animated={animated}
            bloomIntensity={bloomIntensity}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default HeroParticles
