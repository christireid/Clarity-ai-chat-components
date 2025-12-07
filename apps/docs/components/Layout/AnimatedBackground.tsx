'use client'

import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import type { Container } from '@tsparticles/engine'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useParticlesEngine } from './hooks/useParticlesEngine'
import { useWindowResize } from './hooks/useWindowResize'
import { usePageVisibility } from './hooks/usePageVisibility'

// Dynamically import Particles component to reduce initial bundle size
const Particles = dynamic(
  () => import('@tsparticles/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null, // No loading state needed for background element
  }
)

interface AnimatedBackgroundProps {
  className?: string
}

/**
 * AnimatedBackground Component
 *
 * A high-performance animated particle background system for the homepage.
 * Features interactive particles with connecting nodes, theme-aware colors,
 * and accessibility compliance.
 *
 * @param className - Optional additional CSS classes
 *
 * @example
 * ```tsx
 * <AnimatedBackground />
 * <AnimatedBackground className="opacity-50" />
 * ```
 */
export const AnimatedBackground = memo(function AnimatedBackground({
  className = '',
}: AnimatedBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<Container | null>(null)
  const isMountedRef = useRef(true)

  // Custom hooks
  const reducedMotion = useReducedMotion()
  const { isInitialized: engineInitialized, error: engineError } = useParticlesEngine()
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === 'dark'

  // Handle theme mounting (prevent hydration mismatch)
  useEffect(() => {
    setMounted(true)
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Handle window resize with debouncing
  useWindowResize(
    useCallback(() => {
      if (containerRef.current && isMountedRef.current) {
        try {
          containerRef.current.refresh()
        } catch (error) {
          console.warn('Failed to refresh particles on resize:', error)
        }
      }
    }, []),
    150,
    engineInitialized && !reducedMotion && mounted
  )

  // Handle page visibility (pause when tab is hidden)
  usePageVisibility(
    useCallback(
      (isHidden: boolean) => {
        if (containerRef.current && isMountedRef.current) {
          try {
            if (isHidden) {
              containerRef.current.pause()
            } else {
              containerRef.current.play()
            }
          } catch (error) {
            console.warn('Failed to pause/play particles on visibility change:', error)
          }
        }
      },
      []
    ),
    engineInitialized && !reducedMotion && mounted
  )

  // Memoize particle configuration to prevent unnecessary re-renders
  const particlesConfig = useMemo(() => {
    // Type-safe configuration object
    const config = {
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: isDark ? 80 : 60,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: isDark
            ? ['#60a5fa', '#3b82f6', '#93c5fd'] // Light blue tones for dark mode
            : ['#3b82f6', '#2563eb', '#60a5fa'], // Blue tones for light mode
        },
        shape: {
          type: 'circle' as const,
        },
        opacity: {
          value: isDark ? { min: 0.3, max: 0.8 } : { min: 0.2, max: 0.6 },
          animation: {
            enable: !reducedMotion,
            speed: 0.5,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: !reducedMotion,
            speed: 2,
            sync: false,
          },
        },
        move: {
          enable: !reducedMotion,
          direction: 'none' as const,
          outModes: {
            default: 'out' as const,
          },
          random: true,
          speed: { min: 0.5, max: 1.5 },
          straight: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
        links: {
          enable: true,
          distance: isDark ? 150 : 120,
          color: isDark ? '#60a5fa' : '#3b82f6',
          opacity: isDark ? 0.3 : 0.2,
          width: 1,
          triangles: {
            enable: false,
          },
        },
        collisions: {
          enable: false,
        },
      },
      interactivity: {
        detectsOn: 'window' as const,
        events: {
          onHover: {
            enable: !reducedMotion,
            mode: 'repulse' as const,
          },
          onClick: {
            enable: false,
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 100,
            duration: 0.4,
            factor: 100,
            speed: 1,
          },
        },
      },
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }

    // Type assertion needed due to strict library types for partial configs
    // The config is type-safe, but tsparticles expects a more complete type
    // Using 'any' here is acceptable as the library's types are overly strict for partial configs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return config as any
  }, [isDark, reducedMotion])

  // Handle container cleanup
  const handleParticlesLoaded = useCallback(async (container?: Container) => {
    if (isMountedRef.current && container) {
      containerRef.current = container
    }
  }, [])

  // Cleanup container on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        try {
          containerRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying particles container:', error)
        }
        containerRef.current = null
      }
    }
  }, [])

  // Don't render if initialization failed, reduced motion is enabled, or not mounted
  if (!engineInitialized || reducedMotion || !mounted) {
    return null
  }

  // If initialization failed, render nothing (silent failure for background element)
  if (engineError) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Particles
        id="animated-background"
        particlesLoaded={handleParticlesLoaded}
        options={particlesConfig}
        className="w-full h-full"
      />
    </div>
  )
})

AnimatedBackground.displayName = 'AnimatedBackground'
