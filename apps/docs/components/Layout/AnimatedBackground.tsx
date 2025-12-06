'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTheme } from 'next-themes'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [initError, setInitError] = useState<Error | null>(null)

  // Initialize client-side state and media queries
  useEffect(() => {
    // SSR safety: only run on client
    if (typeof window === 'undefined') return

    setMounted(true)

    // Check for prefers-reduced-motion with fallback for older browsers
    const checkReducedMotion = () => {
      try {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        // Use addEventListener if available (modern browsers)
        if (mediaQuery.addEventListener) {
          const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches)
          }
          mediaQuery.addEventListener('change', handleChange)
          return () => mediaQuery.removeEventListener('change', handleChange)
        } else {
          // Fallback for older browsers (addListener/removeListener)
          // @ts-expect-error - Legacy API for older browsers
          const handleChange = (mql: MediaQueryList | MediaQueryListEvent) => {
            setPrefersReducedMotion(mql.matches)
          }
          // @ts-expect-error - Legacy API
          mediaQuery.addListener(handleChange)
          // @ts-expect-error - Legacy API
          return () => mediaQuery.removeListener(handleChange)
        }
      } catch (error) {
        // If matchMedia fails, default to no reduced motion
        setPrefersReducedMotion(false)
        return () => {}
      }
    }

    return checkReducedMotion()
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadSlim(engine)
      setInitError(null)
    } catch (error) {
      // Log error but don't crash the component
      const err = error instanceof Error ? error : new Error('Failed to load particles engine')
      setInitError(err)
      console.error('[AnimatedBackground] Failed to initialize particles:', err)
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

  // If initialization failed, render nothing (graceful degradation)
  if (initError) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Particles
        id="animated-background"
        init={particlesInit}
        options={particlesConfig}
        className="w-full h-full"
      />
    </div>
  )
}
