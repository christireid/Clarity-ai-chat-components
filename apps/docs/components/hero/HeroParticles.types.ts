/**
 * Type definitions for HeroParticles component
 */

import type { RefObject } from 'react'
import type * as THREE from 'three'

// =============================================================================
// INTERACTION MODES
// =============================================================================

/**
 * Available interaction modes for particle behavior
 */
export type InteractionMode = 'repel' | 'attract' | 'hybrid'

// =============================================================================
// COMPONENT PROPS
// =============================================================================

/**
 * Props for the main HeroParticles component
 */
export interface HeroParticlesProps {
  /** Number of particles (auto-adjusts based on device if not specified) */
  count?: number
  /** Primary particle color (hex string) */
  primaryColor?: string
  /** Secondary particle color for gradient variation (hex string) */
  secondaryColor?: string
  /** Bloom intensity (0-3, default varies by theme) */
  bloomIntensity?: number
  /** Mouse/touch interaction strength (0-1, default: 0.5) */
  interactionStrength?: number
  /** Interaction mode: 'repel' pushes away, 'attract' pulls in, 'hybrid' does both */
  interactionMode?: InteractionMode
  /** Whether animation is enabled (respects prefers-reduced-motion by default) */
  animated?: boolean
  /** Enable touch interaction on mobile (default: true) */
  enableTouch?: boolean
  /** Additional className for the wrapper div */
  className?: string
}

/**
 * Props for the inner ParticleField component
 */
export interface ParticleFieldProps {
  /** Number of particles to render */
  count: number
  /** Primary color in normalized RGB [0-1, 0-1, 0-1] */
  primaryColor: THREE.Color
  /** Secondary color in normalized RGB [0-1, 0-1, 0-1] */
  secondaryColor: THREE.Color
  /** Mouse/touch interaction strength (0-1) */
  interactionStrength: number
  /** Interaction mode */
  interactionMode: InteractionMode
  /** Reference to interaction position */
  interactionRef: RefObject<InteractionState>
  /** Whether animation is enabled */
  animated: boolean
}

// =============================================================================
// INTERNAL TYPES
// =============================================================================

/**
 * Interaction state tracking for mouse and touch
 * Uses smooth interpolation for fluid motion
 */
export interface InteractionState {
  /** Current interpolated X position (-1 to 1) */
  x: number
  /** Current interpolated Y position (-1 to 1) */
  y: number
  /** Target X position (raw input) */
  targetX: number
  /** Target Y position (raw input) */
  targetY: number
  /** Whether interaction is currently active */
  isActive: boolean
  /** Type of interaction source */
  source: 'mouse' | 'touch' | 'none'
}

/**
 * Legacy mouse position type for backwards compatibility
 * @deprecated Use InteractionState instead
 */
export interface MousePosition {
  /** X position (-1 to 1) */
  x: number
  /** Y position (-1 to 1) */
  y: number
  /** Whether mouse is currently over the canvas */
  isActive: boolean
}

/**
 * Particle state for buffer geometry
 */
export interface ParticleState {
  /** Current position (x, y, z per particle) */
  positions: Float32Array
  /** Original/home position for returning */
  originalPositions: Float32Array
  /** Per-particle velocities */
  velocities: Float32Array
  /** Per-particle colors (r, g, b) */
  colors: Float32Array
  /** Per-particle sizes */
  sizes: Float32Array
  /** Per-particle phases for animation variation */
  phases: Float32Array
}

/**
 * WebGL availability check result
 */
export interface WebGLAvailability {
  /** Whether WebGL is available */
  available: boolean
  /** WebGL version available (1, 2, or 0 for none) */
  version: 0 | 1 | 2
  /** Error message if unavailable */
  error?: string
}

/**
 * Responsive particle configuration
 */
export interface ResponsiveConfig {
  /** Computed particle count for current viewport */
  count: number
  /** Whether to show particles at all */
  shouldRender: boolean
  /** Current device category */
  device: 'desktop' | 'tablet' | 'mobile'
}

// =============================================================================
// SHADER UNIFORMS
// =============================================================================

/**
 * Uniforms passed to particle shaders
 */
export interface ParticleUniforms {
  /** Current time for animation */
  uTime: { value: number }
  /** Interaction position in world space */
  uInteractionPos: { value: THREE.Vector3 }
  /** Interaction strength */
  uInteractionStrength: { value: number }
  /** Whether interaction is active (0 or 1) */
  uInteractionActive: { value: number }
  /** Interaction mode (0=repel, 1=attract, 2=hybrid) */
  uInteractionMode: { value: number }
  /** Particle size multiplier */
  uSizeMultiplier: { value: number }
  /** Glow intensity */
  uGlowIntensity: { value: number }
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/**
 * Return type for useResponsiveParticles hook
 */
export interface UseResponsiveParticlesReturn {
  /** Computed particle count */
  count: number
  /** Whether particles should be rendered */
  shouldRender: boolean
  /** Current device type */
  device: 'desktop' | 'tablet' | 'mobile'
}

/**
 * Return type for useWebGLAvailable hook
 */
export interface UseWebGLAvailableReturn {
  /** Whether WebGL is available */
  isAvailable: boolean
  /** WebGL version (0, 1, or 2) */
  version: 0 | 1 | 2
  /** Whether check is complete */
  isChecked: boolean
}

/**
 * Return type for useInteraction hook
 */
export interface UseInteractionReturn {
  /** Ref containing current interaction state with smooth interpolation */
  interactionRef: RefObject<InteractionState>
  /** Handler for mouse move events */
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
  /** Handler for mouse leave events */
  handleMouseLeave: () => void
  /** Handler for touch start events */
  handleTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void
  /** Handler for touch move events */
  handleTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void
  /** Handler for touch end events */
  handleTouchEnd: () => void
}

/**
 * Return type for useMousePosition hook
 * @deprecated Use useInteraction instead
 */
export interface UseMousePositionReturn {
  /** Ref containing current mouse position */
  mouseRef: RefObject<MousePosition>
  /** Handler for mouse move events */
  handleMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void
  /** Handler for mouse leave events */
  handleMouseLeave: () => void
}

// =============================================================================
// ERROR BOUNDARY TYPES
// =============================================================================

/**
 * Props for the error boundary component
 */
export interface ParticleErrorBoundaryProps {
  /** Children to render */
  children: React.ReactNode
  /** Fallback to show on error */
  fallback: React.ReactNode
  /** Called when an error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

/**
 * State for the error boundary component
 */
export interface ParticleErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean
  /** The error that occurred */
  error: Error | null
}
