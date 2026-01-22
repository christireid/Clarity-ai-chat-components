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

/** Physics constants for particle movement - Enhanced for spectacular effect */
export const PHYSICS = {
  /** Base speed multiplier for particle drift - Slightly faster */
  baseSpeed: 0.0004,
  /** Noise frequency for organic movement - More dynamic */
  noiseFrequency: 0.001,
  /** Noise amplitude for position offset - More fluid */
  noiseAmplitude: 0.2,
  /** Mouse repulsion radius in world units - Larger for more impact */
  repulsionRadius: 3.5,
  /** Default repulsion strength (0-1) - Stronger reaction */
  repulsionStrength: 0.7,
  /** Easing factor for smooth repulsion (lower = smoother) */
  repulsionEasing: 0.1,
  /** How quickly particles return to original position */
  returnForce: 0.025,
  /** Maximum displacement from original position - More dramatic */
  maxDisplacement: 4.0,
} as const

// =============================================================================
// VISUAL CONFIG
// =============================================================================

/** Visual configuration for particle rendering - Premium luxury feel */
export const VISUALS = {
  /** Base particle size in world units - Slightly larger */
  particleSize: 0.1,
  /** Size variation range (multiplier) - More variety */
  sizeVariation: 0.6,
  /** Minimum z-depth (back of scene) */
  depthMin: -5,
  /** Maximum z-depth (front of scene) */
  depthMax: 2,
  /** Depth-based size attenuation factor */
  depthAttenuation: 0.15,
  /** Particle opacity range - Brighter */
  opacityMin: 0.4,
  opacityMax: 1.0,
  /** Particle glow intensity (inner glow) - Enhanced glow */
  glowIntensity: 0.8,
} as const

// =============================================================================
// BLOOM/POST-PROCESSING CONFIG
// =============================================================================

/** Post-processing bloom effect settings - Premium Luxury Glow */
export const BLOOM = {
  /** Bloom intensity for dark mode (0-3) - Boosted for luxury feel */
  intensityDark: 2.2,
  /** Bloom intensity for light mode (0-3) */
  intensityLight: 1.2,
  /** Bloom luminance threshold - Lower for more glow */
  luminanceThreshold: 0.15,
  /** Bloom smoothing factor - Higher for smoother glow */
  luminanceSmoothing: 0.95,
  /** Bloom radius (blur spread) */
  radius: 1.0,
  /** Number of mipmap levels for bloom */
  mipmapBlur: true,
} as const

// =============================================================================
// COLORS
// =============================================================================

/** Theme-aware particle colors - Premium Indigo to Pink Palette */
export const COLORS = {
  dark: {
    /** Primary particle color (premium indigo) */
    primary: '#818cf8',
    /** Secondary particle color (vibrant pink) */
    secondary: '#f472b6',
    /** Tertiary color for variation (purple) */
    tertiary: '#c084fc',
  },
  light: {
    /** Primary particle color (deep indigo) */
    primary: '#6366f1',
    /** Secondary particle color (rose pink) */
    secondary: '#ec4899',
    /** Tertiary color for variation (purple) */
    tertiary: '#a855f7',
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
