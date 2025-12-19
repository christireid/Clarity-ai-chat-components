/**
 * Advanced Animation Variants for Skeleton Components
 *
 * Collection of sophisticated, performant animations that work without Framer Motion
 * Includes physics-based animations, morphing effects, and micro-interactions
 */

import * as React from 'react'
import { cn } from '../../utils/cn'

// =============================================================================
// ADVANCED CSS KEYFRAMES
// =============================================================================

export const advancedKeyframes = `
  /* Advanced shimmer variants */
  @keyframes shimmer-advanced {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @keyframes shimmer-rainbow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes shimmer-circular {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Physics-based animations */
  @keyframes physics-bounce {
    0% { transform: scale(1); }
    25% { transform: scale(1.05); }
    50% { transform: scale(0.95); }
    75% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  @keyframes physics-spring {
    0% { transform: scale(1) translateY(0); }
    15% { transform: scale(1.1) translateY(-5px); }
    30% { transform: scale(0.9) translateY(2px); }
    45% { transform: scale(1.02) translateY(-1px); }
    60% { transform: scale(0.98) translateY(0.5px); }
    100% { transform: scale(1) translateY(0); }
  }

  @keyframes physics-wobble {
    0% { transform: rotate(0deg); }
    15% { transform: rotate(-5deg); }
    30% { transform: rotate(3deg); }
    45% { transform: rotate(-2deg); }
    60% { transform: rotate(1deg); }
    75% { transform: rotate(-0.5deg); }
    100% { transform: rotate(0deg); }
  }

  /* Morphing animations */
  @keyframes morph-circle-to-square {
    0% { border-radius: 50%; transform: rotate(0deg); }
    50% { border-radius: 25%; transform: rotate(180deg); }
    100% { border-radius: 8px; transform: rotate(360deg); }
  }

  @keyframes morph-expand-contract {
    0% { transform: scale(1); border-radius: 8px; }
    25% { transform: scale(1.2); border-radius: 50%; }
    50% { transform: scale(0.8); border-radius: 16px; }
    75% { transform: scale(1.1); border-radius: 12px; }
    100% { transform: scale(1); border-radius: 8px; }
  }

  @keyframes morph-squash-stretch {
    0% { transform: scaleY(1) scaleX(1); }
    25% { transform: scaleY(0.8) scaleX(1.2); }
    50% { transform: scaleY(1.2) scaleX(0.8); }
    75% { transform: scaleY(0.9) scaleX(1.1); }
    100% { transform: scaleY(1) scaleX(1); }
  }

  /* Particle system animations */
  @keyframes particle-float {
    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
  }

  @keyframes particle-spiral {
    0% { transform: rotate(0deg) translateX(0px) rotate(0deg); opacity: 1; }
    100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); opacity: 0; }
  }

  @keyframes particle-explode {
    0% { transform: scale(0) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
    100% { transform: scale(0) rotate(360deg); opacity: 0; }
  }

  /* Wave animations */
  @keyframes wave-sine {
    0% { transform: translateY(0px); }
    25% { transform: translateY(-10px); }
    50% { transform: translateY(0px); }
    75% { transform: translateY(10px); }
    100% { transform: translateY(0px); }
  }

  @keyframes wave-cosine {
    0% { transform: translateX(0px) translateY(0px); }
    25% { transform: translateX(10px) translateY(-5px); }
    50% { transform: translateX(0px) translateY(0px); }
    75% { transform: translateX(-10px) translateY(5px); }
    100% { transform: translateX(0px) translateY(0px); }
  }

  @keyframes wave-complex {
    0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    25% { transform: translateX(15px) translateY(-8px) rotate(90deg); }
    50% { transform: translateX(0px) translateY(0px) rotate(180deg); }
    75% { transform: translateX(-15px) translateY(8px) rotate(270deg); }
    100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
  }

  /* Ripple and pulse animations */
  @keyframes ripple-out {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
  }

  @keyframes pulse-radial {
    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
  }

  @keyframes pulse-heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.3); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); }
    70% { transform: scale(1); }
  }

  /* Glitch and distortion effects */
  @keyframes glitch-horizontal {
    0% { transform: translateX(0); }
    20% { transform: translateX(-2px); }
    40% { transform: translateX(2px); }
    60% { transform: translateX(-1px); }
    80% { transform: translateX(1px); }
    100% { transform: translateX(0); }
  }

  @keyframes glitch-vertical {
    0% { transform: translateY(0); }
    20% { transform: translateY(-2px); }
    40% { transform: translateY(2px); }
    60% { transform: translateY(-1px); }
    80% { transform: translateY(1px); }
    100% { transform: translateY(0); }
  }

  @keyframes glitch-skew {
    0% { transform: skew(0deg); }
    20% { transform: skew(-5deg); }
    40% { transform: skew(5deg); }
    60% { transform: skew(-2deg); }
    80% { transform: skew(2deg); }
    100% { transform: skew(0deg); }
  }

  /* Organic animations */
  @keyframes organic-breath {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  @keyframes organic-sway {
    0% { transform: rotate(-2deg) translateY(0px); }
    25% { transform: rotate(1deg) translateY(-2px); }
    50% { transform: rotate(-1deg) translateY(0px); }
    75% { transform: rotate(2deg) translateY(2px); }
    100% { transform: rotate(-2deg) translateY(0px); }
  }

  @keyframes organic-grow {
    0% { transform: scale(0.8); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.9; }
  }

  /* Neon and glow effects */
  @keyframes neon-flicker {
    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
      text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00f, 0 0 20px #00f, 0 0 25px #00f, 0 0 30px #00f, 0 0 35px #00f;
    }
    20%, 24%, 55% { text-shadow: none; }
  }

  @keyframes glow-pulse {
    0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
    50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6); }
    100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
  }

  @keyframes glow-radiate {
    0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
    100% { box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); }
  }
`

// =============================================================================
// ADVANCED SKELETON VARIANTS
// =============================================================================

export interface AdvancedSkeletonVariant {
  name: string
  keyframes: string
  duration: string
  easing: string
  background?: string
  pseudoElements?: Array<{
    content: string
    position: string
    animation: string
    style: React.CSSProperties
  }>
}

export const advancedVariants: Record<string, AdvancedSkeletonVariant> = {
  // Shimmer variants
  shimmerAdvanced: {
    name: 'shimmer-advanced',
    keyframes: 'shimmer-advanced',
    duration: '2s',
    easing: 'linear',
    background:
      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
  },

  shimmerRainbow: {
    name: 'shimmer-rainbow',
    keyframes: 'shimmer-rainbow',
    duration: '3s',
    easing: 'ease-in-out',
    background:
      'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)',
  },

  shimmerCircular: {
    name: 'shimmer-circular',
    keyframes: 'shimmer-circular',
    duration: '4s',
    easing: 'linear',
    background:
      'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)',
  },

  // Physics-based animations
  physicsBounce: {
    name: 'physics-bounce',
    keyframes: 'physics-bounce',
    duration: '0.6s',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  physicsSpring: {
    name: 'physics-spring',
    keyframes: 'physics-spring',
    duration: '1s',
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  physicsWobble: {
    name: 'physics-wobble',
    keyframes: 'physics-wobble',
    duration: '0.8s',
    easing: 'ease-in-out',
  },

  // Morphing animations
  morphCircleToSquare: {
    name: 'morph-circle-to-square',
    keyframes: 'morph-circle-to-square',
    duration: '2s',
    easing: 'ease-in-out',
  },

  morphExpandContract: {
    name: 'morph-expand-contract',
    keyframes: 'morph-expand-contract',
    duration: '1.5s',
    easing: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  },

  morphSquashStretch: {
    name: 'morph-squash-stretch',
    keyframes: 'morph-squash-stretch',
    duration: '1s',
    easing: 'ease-in-out',
  },

  // Particle system
  particleFloat: {
    name: 'particle-float',
    keyframes: 'particle-float',
    duration: '3s',
    easing: 'ease-out',
    pseudoElements: [
      {
        content: '""',
        position: 'absolute',
        animation: 'particle-float 3s ease-out infinite',
        style: {
          width: '4px',
          height: '4px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      },
    ],
  },

  // Wave animations
  waveSine: {
    name: 'wave-sine',
    keyframes: 'wave-sine',
    duration: '2s',
    easing: 'ease-in-out',
  },

  waveCosine: {
    name: 'wave-cosine',
    keyframes: 'wave-cosine',
    duration: '2.5s',
    easing: 'ease-in-out',
  },

  waveComplex: {
    name: 'wave-complex',
    keyframes: 'wave-complex',
    duration: '3s',
    easing: 'ease-in-out',
  },

  // Ripple and pulse
  rippleOut: {
    name: 'ripple-out',
    keyframes: 'ripple-out',
    duration: '1s',
    easing: 'ease-out',
  },

  pulseRadial: {
    name: 'pulse-radial',
    keyframes: 'pulse-radial',
    duration: '2s',
    easing: 'ease-in-out',
  },

  pulseHeartbeat: {
    name: 'pulse-heartbeat',
    keyframes: 'pulse-heartbeat',
    duration: '1.5s',
    easing: 'ease-in-out',
  },

  // Glitch effects
  glitchHorizontal: {
    name: 'glitch-horizontal',
    keyframes: 'glitch-horizontal',
    duration: '0.5s',
    easing: 'steps(2, end)',
  },

  glitchVertical: {
    name: 'glitch-vertical',
    keyframes: 'glitch-vertical',
    duration: '0.4s',
    easing: 'steps(2, end)',
  },

  glitchSkew: {
    name: 'glitch-skew',
    keyframes: 'glitch-skew',
    duration: '0.6s',
    easing: 'steps(2, end)',
  },

  // Organic animations
  organicBreath: {
    name: 'organic-breath',
    keyframes: 'organic-breath',
    duration: '3s',
    easing: 'ease-in-out',
  },

  organicSway: {
    name: 'organic-sway',
    keyframes: 'organic-sway',
    duration: '4s',
    easing: 'ease-in-out',
  },

  organicGrow: {
    name: 'organic-grow',
    keyframes: 'organic-grow',
    duration: '2s',
    easing: 'ease-out',
  },

  // Neon and glow
  neonFlicker: {
    name: 'neon-flicker',
    keyframes: 'neon-flicker',
    duration: '1.5s',
    easing: 'steps(1, end)',
  },

  glowPulse: {
    name: 'glow-pulse',
    keyframes: 'glow-pulse',
    duration: '2s',
    easing: 'ease-in-out',
  },

  glowRadiate: {
    name: 'glow-radiate',
    keyframes: 'glow-radiate',
    duration: '1s',
    easing: 'ease-out',
  },
}

// =============================================================================
// RESPONSIVE SKELETON SIZING SYSTEM
// =============================================================================

export interface ResponsiveSize {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  '2xl'?: number
}

export interface ResponsiveSkeletonProps {
  baseSize: number
  responsive?: ResponsiveSize
  containerQueries?: boolean
  fluid?: boolean
  aspectRatio?: string
}

export const createResponsiveSkeleton = ({
  baseSize,
  responsive = {},
  containerQueries = true,
  fluid = false,
  aspectRatio,
}: ResponsiveSkeletonProps) => {
  const sizes = {
    xs: responsive.xs || baseSize * 0.75,
    sm: responsive.sm || baseSize * 0.85,
    md: responsive.md || baseSize,
    lg: responsive.lg || baseSize * 1.15,
    xl: responsive.xl || baseSize * 1.3,
    '2xl': responsive['2xl'] || baseSize * 1.5,
  }

  const styles = `
    ${
      containerQueries
        ? `
      @container (max-width: 320px) {
        width: ${sizes.xs}px;
        height: ${sizes.xs}px;
      }
      @container (min-width: 321px) and (max-width: 640px) {
        width: ${sizes.sm}px;
        height: ${sizes.sm}px;
      }
      @container (min-width: 641px) and (max-width: 768px) {
        width: ${sizes.md}px;
        height: ${sizes.md}px;
      }
      @container (min-width: 769px) and (max-width: 1024px) {
        width: ${sizes.lg}px;
        height: ${sizes.lg}px;
      }
      @container (min-width: 1025px) and (max-width: 1280px) {
        width: ${sizes.xl}px;
        height: ${sizes.xl}px;
      }
      @container (min-width: 1281px) {
        width: ${sizes['2xl']}px;
        height: ${sizes['2xl']}px;
      }
    `
        : `
      @media (max-width: 320px) {
        width: ${sizes.xs}px;
        height: ${sizes.xs}px;
      }
      @media (min-width: 321px) and (max-width: 640px) {
        width: ${sizes.sm}px;
        height: ${sizes.sm}px;
      }
      @media (min-width: 641px) and (max-width: 768px) {
        width: ${sizes.md}px;
        height: ${sizes.md}px;
      }
      @media (min-width: 769px) and (max-width: 1024px) {
        width: ${sizes.lg}px;
        height: ${sizes.lg}px;
      }
      @media (min-width: 1025px) and (max-width: 1280px) {
        width: ${sizes.xl}px;
        height: ${sizes.xl}px;
      }
      @media (min-width: 1281px) {
        width: ${sizes['2xl']}px;
        height: ${sizes['2xl']}px;
      }
    `
    }

    ${
      fluid
        ? `
      width: clamp(${sizes.xs}px, 10vw, ${sizes['2xl']}px);
      height: clamp(${sizes.xs}px, 10vw, ${sizes['2xl']}px);
    `
        : ''
    }

    ${aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''}
  `

  return styles
}

// =============================================================================
// ADVANCED HOOKS
// =============================================================================

/**
 * Hook to detect the best animation variant based on device capabilities
 */
export const useOptimalAnimation = (preferredVariant: string) => {
  const [animationVariant, setAnimationVariant] =
    React.useState(preferredVariant)

  React.useEffect(() => {
    const checkDeviceCapabilities = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      // Check for low-end device indicators
      const deviceMemory = (navigator as any).deviceMemory || 4
      const hardwareConcurrency = navigator.hardwareConcurrency || 2
      const isLowEndDevice = deviceMemory < 4 || hardwareConcurrency < 4

      if (prefersReducedMotion || isLowEndDevice) {
        setAnimationVariant('none')
      } else {
        setAnimationVariant(preferredVariant)
      }
    }

    checkDeviceCapabilities()

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => checkDeviceCapabilities()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [preferredVariant])

  return animationVariant
}

/**
 * Hook to create responsive skeleton sizing
 */
export const useResponsiveSize = (
  baseSize: number,
  responsive?: ResponsiveSize
) => {
  const [size, setSize] = React.useState(baseSize)
  const [containerWidth, setContainerWidth] = React.useState(0)

  React.useEffect(() => {
    const updateSize = () => {
      const viewportWidth = window.innerWidth

      if (viewportWidth <= 320) {
        setSize(responsive?.xs || baseSize * 0.75)
      } else if (viewportWidth <= 640) {
        setSize(responsive?.sm || baseSize * 0.85)
      } else if (viewportWidth <= 768) {
        setSize(responsive?.md || baseSize)
      } else if (viewportWidth <= 1024) {
        setSize(responsive?.lg || baseSize * 1.15)
      } else if (viewportWidth <= 1280) {
        setSize(responsive?.xl || baseSize * 1.3)
      } else {
        setSize(responsive?.['2xl'] || baseSize * 1.5)
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [baseSize, responsive])

  return size
}

/**
 * Hook to monitor container size for container queries
 */
export const useContainerSize = (ref: React.RefObject<HTMLElement | null>) => {
  const [size, setSize] = React.useState({ width: 0, height: 0 })

  React.useEffect(() => {
    if (!ref.current) return undefined

    const updateSize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        })
      }
    }

    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(ref.current)

    return () => resizeObserver.disconnect()
  }, [])

  return size
}

// =============================================================================
// ADVANCED SKELETON COMPONENT
// =============================================================================

export interface AdvancedSkeletonProps {
  variant: string
  size?: number
  responsive?: ResponsiveSize
  containerQueries?: boolean
  fluid?: boolean
  aspectRatio?: string
  enableMicroInteractions?: boolean
  enablePerformanceMonitoring?: boolean
  className?: string
  style?: React.CSSProperties
}

export const AdvancedSkeleton: React.FC<AdvancedSkeletonProps> = ({
  variant,
  size = 40,
  responsive,
  containerQueries = true,
  fluid = false,
  aspectRatio,
  enableMicroInteractions = true,
  enablePerformanceMonitoring = false,
  className,
  style,
}) => {
  const elementRef = React.useRef<HTMLDivElement>(null)
  const optimalVariant = useOptimalAnimation(variant)
  const responsiveSize = useResponsiveSize(size, responsive)
  const containerSize = useContainerSize(elementRef)

  const animationVariant =
    advancedVariants[optimalVariant] || advancedVariants.shimmerAdvanced

  // Performance monitoring
  React.useEffect(() => {
    if (enablePerformanceMonitoring && typeof window !== 'undefined') {
      const startTime = performance.now()

      return () => {
        const endTime = performance.now()
        const renderTime = endTime - startTime

        if (renderTime > 16) {
          // More than one frame
          console.warn(
            `AdvancedSkeleton render took ${renderTime}ms (variant: ${variant})`
          )
        }
      }
    }
    return undefined
  }, [variant, enablePerformanceMonitoring])

  const responsiveStyles = createResponsiveSkeleton({
    baseSize: responsiveSize,
    responsive,
    containerQueries,
    fluid,
    aspectRatio,
  })

  const microInteractionStyles = enableMicroInteractions
    ? `
    &:hover {
      transform: scale(1.02);
      transition: transform 0.2s ease-out;
    }
    
    &:active {
      transform: scale(0.98);
      transition: transform 0.1s ease-out;
    }
  `
    : ''

  return (
    <>
      <style>{`
        .advanced-skeleton {
          position: relative;
          background: ${animationVariant.background || '#f1f5f9'};
          border-radius: 8px;
          overflow: hidden;
          ${responsiveStyles}
          ${microInteractionStyles}
        }
        
        .advanced-skeleton::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${animationVariant.background || 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'};
          background-size: 200% 100%;
          animation: ${animationVariant.keyframes} ${animationVariant.duration} ${animationVariant.easing} infinite;
        }
        
        ${
          animationVariant.pseudoElements
            ?.map(
              (pseudo, index) => `
          .advanced-skeleton::after {
            content: ${pseudo.content};
            position: ${pseudo.position};
            animation: ${pseudo.animation};
            ${Object.entries(pseudo.style)
              .map(([key, value]) => `${key}: ${value};`)
              .join('\n')}
          }
        `
            )
            .join('\n') || ''
        }
      `}</style>
      <div
        ref={elementRef}
        className={cn('advanced-skeleton', className)}
        style={style}
      />
    </>
  )
}
