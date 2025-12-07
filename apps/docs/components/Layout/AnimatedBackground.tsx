'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { ISourceOptions } from '@tsparticles/engine'

interface AnimatedBackgroundProps {
  className?: string
}

// Module-level singleton to prevent multiple initializations
// This ensures initParticlesEngine is only called once, even with multiple component instances
let initializationPromise: Promise<void> | null = null
let initializationState: 'idle' | 'initializing' | 'initialized' | 'error' = 'idle'
let initializationError: Error | null = null

function initializeParticlesEngine(): Promise<void> {
  // If already initialized, return resolved promise
  if (initializationState === 'initialized') {
    return Promise.resolve()
  }

  // If already initializing, return the existing promise
  if (initializationState === 'initializing' && initializationPromise) {
    return initializationPromise
  }

  // Start initialization
  initializationState = 'initializing'
  initializationPromise = initParticlesEngine(async (engine) => {
    await loadSlim(engine)
  })
    .then(() => {
      initializationState = 'initialized'
      initializationError = null
    })
    .catch((error) => {
      initializationState = 'error'
      initializationError = error instanceof Error ? error : new Error('Failed to load particles engine')
      console.error('[AnimatedBackground] Failed to initialize particles:', initializationError)
      throw initializationError
    })

  return initializationPromise
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [particlesInitialized, setParticlesInitialized] = useState(false)
  const [initError, setInitError] = useState<Error | null>(null)

  // Initialize client-side state, media queries, and particles engine
  useEffect(() => {
    // SSR safety: only run on client
    if (typeof window === 'undefined') return

    const abortController = new AbortController()
    setMounted(true)

    // Check for prefers-reduced-motion
    const setupReducedMotionListener = () => {
      try {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        if (!abortController.signal.aborted) {
          setPrefersReducedMotion(mediaQuery.matches)
        }

        const handleChange = (e: MediaQueryListEvent) => {
          if (!abortController.signal.aborted) {
            setPrefersReducedMotion(e.matches)
          }
        }

        // Modern browsers use addEventListener
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleChange)
          return () => {
            if (!abortController.signal.aborted) {
              mediaQuery.removeEventListener('change', handleChange)
            }
          }
        }

        // Legacy browsers (IE11 and older) - but this is likely unnecessary in 2024
        // Keeping minimal fallback for completeness
        if ('addListener' in mediaQuery && typeof mediaQuery.addListener === 'function') {
          // Legacy API: handler receives MediaQueryList directly, not MediaQueryListEvent
          const legacyHandler = (mql: MediaQueryList) => {
            if (!abortController.signal.aborted) {
              setPrefersReducedMotion(mql.matches)
            }
          }
          // @ts-expect-error - Legacy API signature differs from modern API
          mediaQuery.addListener(legacyHandler)
          return () => {
            if (!abortController.signal.aborted && 'removeListener' in mediaQuery) {
              // @ts-expect-error - Legacy API
              mediaQuery.removeListener(legacyHandler)
            }
          }
        }

        return () => {}
      } catch (error) {
        // If matchMedia fails, default to no reduced motion
        if (!abortController.signal.aborted) {
          setPrefersReducedMotion(false)
        }
        return () => {}
      }
    }

    const cleanupMediaQuery = setupReducedMotionListener()

    // Initialize particles engine using singleton pattern
    initializeParticlesEngine()
      .then(() => {
        if (!abortController.signal.aborted) {
          setParticlesInitialized(true)
          setInitError(null)
        }
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          setInitError(error)
          setParticlesInitialized(false)
        }
      })

    return () => {
      abortController.abort()
      cleanupMediaQuery()
    }
  }, [])

  // Determine if dark mode is active (SSR-safe)
  const isDark = useMemo(() => {
    if (!mounted || typeof window === 'undefined') return false
    
    // Handle undefined resolvedTheme (ThemeProvider not set up)
    if (!resolvedTheme) return false
    
    if (resolvedTheme === 'dark') return true
    if (resolvedTheme === 'system') {
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      } catch {
        // Fallback if matchMedia fails
        return false
      }
    }
    return false
  }, [mounted, resolvedTheme])

  // Particle configuration based on theme
  const particlesConfig: ISourceOptions = useMemo(() => {
    // If user prefers reduced motion, return minimal config
    if (prefersReducedMotion) {
      return {
        particles: {
          number: { value: 0 },
        },
        interactivity: {
          events: {
            onHover: { enable: false },
            onClick: { enable: false },
          },
        },
      }
    }

    const baseColor = isDark ? '#60a5fa' : '#3b82f6' // brand-400 in dark, brand-500 in light
    const secondaryColor = isDark ? '#93c5fd' : '#60a5fa' // brand-300 in dark, brand-400 in light
    const opacity = isDark ? 0.4 : 0.3

    return {
      fpsLimit: 60,
      particles: {
        number: {
          value: isDark ? 80 : 60,
          density: {
            enable: true,
            area: 800,
          },
        },
        color: {
          value: baseColor,
        },
        shape: {
          type: 'circle',
        },
        opacity: {
          value: opacity,
          random: true,
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.1,
            sync: false,
          },
        },
        size: {
          value: { min: 1, max: 3 },
          random: true,
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: isDark ? 150 : 120,
          color: secondaryColor,
          opacity: isDark ? 0.2 : 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: isDark ? 1 : 0.8,
          direction: 'none',
          random: true,
          straight: false,
          outModes: {
            default: 'out',
          },
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detectOn: 'canvas',
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
            parallax: {
              enable: false,
              force: 60,
              smooth: 10,
            },
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 140,
            links: {
              opacity: isDark ? 0.4 : 0.3,
            },
          },
          push: {
            quantity: 4,
          },
        },
      },
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }
  }, [isDark, prefersReducedMotion])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  // If initialization failed or not yet initialized, render nothing (graceful degradation)
  if (initError || !particlesInitialized) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Particles
        id="animated-background"
        options={particlesConfig}
        className="w-full h-full"
      />
    </div>
  )
}
