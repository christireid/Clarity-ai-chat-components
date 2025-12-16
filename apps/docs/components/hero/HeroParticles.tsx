import { logger } from '@clarity-chat/utils/logger';
'use client'

import {
  Suspense,
  useMemo,
  useRef,
  useEffect,
  useDeferredValue,
  Component,
  type RefObject,
  type ReactNode,
  type ErrorInfo,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { createNoise3D, type NoiseFunction3D } from 'simplex-noise'
import { cn } from '@/lib/utils'
import {
  useMounted,
  usePrefersReducedMotion,
  useIsDark,
} from '@/components/Layout/hooks'
import {
  useWebGLAvailable,
  useResponsiveParticles,
  useInteraction,
  useDocumentVisibility,
  useAdaptiveQuality,
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
import {
  createParticlePhysics,
  type ParticlePhysics,
  type InteractionTarget,
} from './particle-physics'
import type {
  HeroParticlesProps,
  ParticleFieldProps,
  InteractionState,
  InteractionMode,
  ParticleErrorBoundaryProps,
  ParticleErrorBoundaryState,
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
// NOISE GENERATOR (Simplex Noise)
// =============================================================================

// Create noise function once and reuse
let noise3D: NoiseFunction3D | null = null

function getNoise3D(): NoiseFunction3D {
  if (!noise3D) {
    noise3D = createNoise3D()
  }
  return noise3D
}

// =============================================================================
// ERROR BOUNDARY
// =============================================================================

/**
 * Error boundary to catch Three.js/WebGL errors
 * Prevents crashes from propagating to the rest of the app
 */
class ParticleErrorBoundary extends Component<
  ParticleErrorBoundaryProps,
  ParticleErrorBoundaryState
> {
  constructor(props: ParticleErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ParticleErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    logger.logger.error('[HeroParticles] WebGL Error:', error)
    logger.logger.error('[HeroParticles] Error Info:', errorInfo)

    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// =============================================================================
// PARTICLE FIELD COMPONENT
// =============================================================================

interface ParticleFieldInternalProps extends ParticleFieldProps {
  isVisible: boolean
  qualityLevel: number
}

/**
 * Inner component that renders the particle system
 * Uses buffer geometry for performance with instanced attributes
 * Leverages extracted physics engine for clean separation of concerns
 */
function ParticleField({
  count,
  primaryColor,
  secondaryColor,
  interactionStrength,
  interactionMode,
  interactionRef,
  animated,
  isVisible,
  qualityLevel,
}: ParticleFieldInternalProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  // Store original positions for return-to-home behavior
  const originalPositions = useRef<Float32Array | null>(null)
  const velocities = useRef<Float32Array | null>(null)

  // Physics engine instance
  const physicsRef = useRef<ParticlePhysics | null>(null)

  // Get noise function
  const noise = useMemo(() => getNoise3D(), [])

  // Initialize physics engine
  useEffect(() => {
    physicsRef.current = createParticlePhysics(noise, {
      noiseFrequency: PHYSICS.noiseFrequency,
      noiseAmplitude: PHYSICS.noiseAmplitude,
      baseSpeed: PHYSICS.baseSpeed,
      interactionRadius: PHYSICS.repulsionRadius,
      returnForce: PHYSICS.returnForce,
      maxDisplacement: PHYSICS.maxDisplacement,
      damping: 0.95,
    })
  }, [noise])

  // Adjust physics based on quality level
  useEffect(() => {
    if (physicsRef.current) {
      // Lower quality = less noise complexity, faster return
      const qualityMultiplier = qualityLevel / 100
      physicsRef.current.setConfig({
        noiseAmplitude: PHYSICS.noiseAmplitude * qualityMultiplier,
      })
    }
  }, [qualityLevel])

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

  // Animation loop - uses extracted physics engine
  useFrame((state) => {
    // Skip animation when not visible or not animated
    if (!animated || !isVisible) return
    if (!pointsRef.current) return
    if (!originalPositions.current) return
    if (!velocities.current) return
    if (!physicsRef.current) return

    const time = state.clock.elapsedTime
    const geometry = pointsRef.current.geometry
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    // Update uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time
    }

    // Get interaction position in world space
    const interaction = interactionRef.current
    const interactionTarget: InteractionTarget | null = interaction?.isActive
      ? {
          x: interaction.x * viewport.width * 0.5,
          y: interaction.y * viewport.height * 0.5,
          isActive: true,
        }
      : null

    // Run physics step using the extracted engine
    physicsRef.current.step(
      posArray,
      velocities.current,
      originalPositions.current,
      time,
      interactionTarget,
      interactionMode,
      interactionStrength,
      count
    )

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
  interactionStrength: number
  interactionMode: InteractionMode
  interactionRef: RefObject<InteractionState>
  animated: boolean
  bloomIntensity: number
  isVisible: boolean
  qualityLevel: number
  enableBloom: boolean
}

/**
 * Scene wrapper containing particles and post-processing
 */
function Scene({
  count,
  primaryColor,
  secondaryColor,
  interactionStrength,
  interactionMode,
  interactionRef,
  animated,
  bloomIntensity,
  isVisible,
  qualityLevel,
  enableBloom,
}: SceneProps) {
  return (
    <>
      <ParticleField
        count={count}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        interactionStrength={interactionStrength}
        interactionMode={interactionMode}
        interactionRef={interactionRef}
        animated={animated}
        isVisible={isVisible}
        qualityLevel={qualityLevel}
      />
      {enableBloom && (
        <EffectComposer>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={BLOOM.luminanceThreshold}
            luminanceSmoothing={BLOOM.luminanceSmoothing}
            mipmapBlur={BLOOM.mipmapBlur}
          />
        </EffectComposer>
      )}
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
// LOADING PLACEHOLDER (with shimmer effect)
// =============================================================================

/**
 * Placeholder shown while Canvas loads
 * Features a subtle shimmer animation for premium feel
 */
function LoadingPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      {/* Shimmer effect */}
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          background: `
            linear-gradient(
              90deg,
              transparent 0%,
              rgba(59, 130, 246, 0.03) 50%,
              transparent 100%
            )
          `,
          animation: 'shimmer 2s ease-in-out infinite',
        }}
      />

      {/* Scattered dots for visual interest */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/30"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * HeroParticles - Premium 3D particle animation for the hero section
 *
 * Features:
 * - Organic particle drift using Simplex noise
 * - Mouse and touch interactive effects (repel/attract/hybrid)
 * - Bloom post-processing for dreamy glow
 * - Theme-aware colors (dark/light mode)
 * - Responsive particle count
 * - Accessible (respects prefers-reduced-motion)
 * - WebGL fallback to CSS gradient
 * - Error boundary for graceful failure handling
 * - Smooth input interpolation for fluid motion
 * - Tab visibility awareness (pauses when hidden)
 * - Adaptive quality based on FPS monitoring
 * - Extracted physics engine for testability
 *
 * @example
 * ```tsx
 * // Basic usage
 * <div className="relative h-screen">
 *   <HeroParticles />
 *   <div className="relative z-10">
 *     // Hero content here
 *   </div>
 * </div>
 *
 * // With custom settings
 * <HeroParticles
 *   interactionMode="hybrid"
 *   interactionStrength={0.7}
 *   bloomIntensity={2}
 * />
 * ```
 */
export function HeroParticles({
  count: customCount,
  primaryColor: customPrimary,
  secondaryColor: customSecondary,
  bloomIntensity: customBloom,
  interactionStrength = 0.5,
  interactionMode = 'repel',
  animated: customAnimated,
  enableTouch = true,
  className,
}: HeroParticlesProps) {
  // Hooks
  const mounted = useMounted()
  const prefersReducedMotion = usePrefersReducedMotion()
  const isDark = useIsDark()
  const { isAvailable: webglAvailable, isChecked: webglChecked } =
    useWebGLAvailable()
  const { count: responsiveCount, shouldRender, device } =
    useResponsiveParticles(customCount)
  const {
    interactionRef,
    handleMouseMove,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useInteraction()

  // Tab visibility - pause animation when tab is hidden
  const isTabVisible = useDocumentVisibility()

  // Adaptive quality - reduce quality when FPS drops
  const { qualityLevel, shouldDisableEffects } = useAdaptiveQuality({
    targetFps: 55,
    measurementInterval: 1000,
    qualityStep: 10,
  })

  // Computed values
  const animated =
    customAnimated !== undefined ? customAnimated : !prefersReducedMotion

  // Use deferred value for theme to prevent blocking renders during theme transitions
  const deferredIsDark = useDeferredValue(isDark)
  const themeColors = deferredIsDark ? COLORS.dark : COLORS.light

  const primaryColor = useMemo(
    () => new THREE.Color(customPrimary ?? themeColors.primary),
    [customPrimary, themeColors.primary]
  )

  const secondaryColor = useMemo(
    () => new THREE.Color(customSecondary ?? themeColors.secondary),
    [customSecondary, themeColors.secondary]
  )

  const bloomIntensity =
    customBloom ?? (deferredIsDark ? BLOOM.intensityDark : BLOOM.intensityLight)

  // Adjust particle count based on quality level
  const adjustedCount = useMemo(() => {
    const qualityMultiplier = qualityLevel / 100
    return Math.floor(responsiveCount * qualityMultiplier)
  }, [responsiveCount, qualityLevel])

  // Adjust size multiplier for mobile (larger particles for visibility)
  const sizeMultiplier = device === 'mobile' ? 1.3 : 1

  // Determine if bloom should be enabled
  const enableBloom = !shouldDisableEffects

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
        <GradientFallback isDark={deferredIsDark} />
      </div>
    )
  }

  // Show static fallback for reduced motion
  if (prefersReducedMotion && customAnimated !== true) {
    return (
      <div
        className={cn(
          'absolute inset-0 -z-10 overflow-hidden pointer-events-none',
          className
        )}
      >
        <GradientFallback isDark={deferredIsDark} />
      </div>
    )
  }

  // Touch handlers (conditionally enabled)
  const touchHandlers = enableTouch
    ? {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
      }
    : {}

  return (
    <div
      className={cn('absolute inset-0 -z-10 overflow-hidden', className)}
      style={{ pointerEvents: 'none' }}
    >
      {/* Invisible overlay to capture mouse/touch events */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: 'auto' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...touchHandlers}
      />

      {/* Error boundary wraps the 3D content */}
      <ParticleErrorBoundary
        fallback={<GradientFallback isDark={deferredIsDark} />}
        onError={(error) => {
          logger.warn(
            '[HeroParticles] Falling back to gradient due to error:',
            error.message
          )
        }}
      >
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
              count={adjustedCount}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              interactionStrength={interactionStrength}
              interactionMode={interactionMode}
              interactionRef={interactionRef}
              animated={animated}
              bloomIntensity={bloomIntensity * sizeMultiplier}
              isVisible={isTabVisible}
              qualityLevel={qualityLevel}
              enableBloom={enableBloom}
            />
          </Canvas>
        </Suspense>
      </ParticleErrorBoundary>
    </div>
  )
}

export default HeroParticles
