/**
 * Configuration constants for the HeroParticles component
 * Fine-tuned for visual quality and performance across devices
 */

// =============================================================================
// PARTICLE COUNT CONFIG
// =============================================================================

/** Default particle counts by device type */
export const PARTICLE_COUNTS = {
  /** Desktop/laptop displays (1024px+) */
  desktop: 800,
  /** Tablet displays (768px - 1023px) */
  tablet: 500,
  /** Mobile displays (< 768px) */
  mobile: 300,
  /** Minimum viewport width to show particles */
  minViewportWidth: 480,
} as const

// =============================================================================
// PHYSICS CONFIG
// =============================================================================

/** Physics constants for particle movement */
export const PHYSICS = {
  /** Base speed multiplier for particle drift */
  baseSpeed: 0.0003,
  /** Noise frequency for organic movement */
  noiseFrequency: 0.0008,
  /** Noise amplitude for position offset */
  noiseAmplitude: 0.15,
  /** Mouse repulsion radius in world units */
  repulsionRadius: 2.5,
  /** Default repulsion strength (0-1) */
  repulsionStrength: 0.5,
  /** Easing factor for smooth repulsion (lower = smoother) */
  repulsionEasing: 0.08,
  /** How quickly particles return to original position */
  returnForce: 0.02,
  /** Maximum displacement from original position */
  maxDisplacement: 3.0,
} as const

// =============================================================================
// VISUAL CONFIG
// =============================================================================

/** Visual configuration for particle rendering */
export const VISUALS = {
  /** Base particle size in world units */
  particleSize: 0.08,
  /** Size variation range (multiplier) */
  sizeVariation: 0.5,
  /** Minimum z-depth (back of scene) */
  depthMin: -5,
  /** Maximum z-depth (front of scene) */
  depthMax: 2,
  /** Depth-based size attenuation factor */
  depthAttenuation: 0.15,
  /** Particle opacity range */
  opacityMin: 0.3,
  opacityMax: 0.9,
  /** Particle glow intensity (inner glow) */
  glowIntensity: 0.6,
} as const

// =============================================================================
// BLOOM/POST-PROCESSING CONFIG
// =============================================================================

/** Post-processing bloom effect settings */
export const BLOOM = {
  /** Bloom intensity for dark mode (0-3) */
  intensityDark: 1.5,
  /** Bloom intensity for light mode (0-3) */
  intensityLight: 0.8,
  /** Bloom luminance threshold */
  luminanceThreshold: 0.2,
  /** Bloom smoothing factor */
  luminanceSmoothing: 0.9,
  /** Bloom radius (blur spread) */
  radius: 0.8,
  /** Number of mipmap levels for bloom */
  mipmapBlur: true,
} as const

// =============================================================================
// COLORS
// =============================================================================

/** Theme-aware particle colors */
export const COLORS = {
  dark: {
    /** Primary particle color (cyan) */
    primary: '#60a5fa',
    /** Secondary particle color (purple) */
    secondary: '#a78bfa',
    /** Tertiary color for variation */
    tertiary: '#38bdf8',
  },
  light: {
    /** Primary particle color (deep blue) */
    primary: '#3b82f6',
    /** Secondary particle color (indigo) */
    secondary: '#8b5cf6',
    /** Tertiary color for variation */
    tertiary: '#0ea5e9',
  },
} as const

// =============================================================================
// CAMERA CONFIG
// =============================================================================

/** Camera settings for the 3D scene */
export const CAMERA = {
  /** Camera field of view (degrees) */
  fov: 75,
  /** Near clipping plane */
  near: 0.1,
  /** Far clipping plane */
  far: 100,
  /** Camera z-position */
  position: [0, 0, 6] as const,
} as const

// =============================================================================
// CANVAS CONFIG
// =============================================================================

/** WebGL canvas configuration */
export const CANVAS = {
  /** Device pixel ratio clamp (performance) */
  dpr: [1, 2] as const,
  /** Enable antialiasing */
  antialias: true,
  /** Canvas alpha (transparency) */
  alpha: true,
  /** Power preference for GPU */
  powerPreference: 'high-performance' as const,
} as const

// =============================================================================
// SPAWN BOUNDS
// =============================================================================

/** Bounds for initial particle positions */
export const BOUNDS = {
  /** X-axis spread (half-width) */
  x: 8,
  /** Y-axis spread (half-height) */
  y: 5,
  /** Z-axis spread (depth range uses VISUALS.depthMin/Max) */
  z: { min: -5, max: 2 },
} as const

// =============================================================================
// PERFORMANCE
// =============================================================================

/** Performance-related settings */
export const PERFORMANCE = {
  /** Frame rate target (for throttling on low-end devices) */
  targetFps: 60,
  /** Whether to use instanced rendering */
  useInstancing: true,
  /** Maximum allowed frame time (ms) before throttling */
  maxFrameTime: 20,
} as const
