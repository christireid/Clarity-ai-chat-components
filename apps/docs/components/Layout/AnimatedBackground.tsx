'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useTheme } from 'next-themes'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import type { Container, Engine } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const [init, setInit] = useState(false)
  const [initError, setInitError] = useState<Error | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<Container | null>(null)
  const isMountedRef = useRef(true)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === 'dark'

  // Handle theme mounting
  useEffect(() => {
    setMounted(true)
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Check for reduced motion preference with SSR safety
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches)
      }

      // Use addEventListener for modern browsers, fallback for older ones
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    } catch (error) {
      // Silently fail if matchMedia is not supported
      console.warn('prefers-reduced-motion media query not supported:', error)
    }
  }, [])

  // Initialize particles engine with error handling and cleanup
  useEffect(() => {
    let cancelled = false

    const initEngine = async () => {
      try {
        await initParticlesEngine(async (engine: Engine) => {
          await loadSlim(engine)
        })

        if (!cancelled && isMountedRef.current) {
          setInit(true)
          setInitError(null)
        }
      } catch (error) {
        if (!cancelled && isMountedRef.current) {
          const err = error instanceof Error ? error : new Error('Failed to initialize particles engine')
          setInitError(err)
          console.error('Failed to initialize particles engine:', err)
        }
      }
    }

    initEngine()

    return () => {
      cancelled = true
    }
  }, [])

  // Handle window resize with debouncing
  useEffect(() => {
    if (typeof window === 'undefined') return

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        if (containerRef.current && isMountedRef.current) {
          try {
            containerRef.current.refresh()
          } catch (error) {
            console.warn('Failed to refresh particles on resize:', error)
          }
        }
      }, 150)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // Handle page visibility (pause when tab is hidden)
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      if (containerRef.current && isMountedRef.current) {
        try {
          if (document.hidden) {
            containerRef.current.pause()
          } else {
            containerRef.current.play()
          }
        } catch (error) {
          console.warn('Failed to pause/play particles on visibility change:', error)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Memoize particle configuration to prevent unnecessary re-renders
  const particlesConfig = useMemo(() => ({
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
        type: 'circle',
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
        direction: 'none',
        outModes: {
          default: 'out',
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
      detectsOn: 'window',
      events: {
        onHover: {
          enable: !reducedMotion,
          mode: 'repulse',
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
  }), [isDark, reducedMotion])

  // Handle container cleanup
  const handleParticlesLoaded = useCallback((container: Container | null) => {
    if (isMountedRef.current) {
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
  if (!init || reducedMotion || !mounted) {
    return null
  }

  // If initialization failed, render nothing (silent failure for background element)
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
        particlesLoaded={handleParticlesLoaded}
        options={particlesConfig}
        className="w-full h-full"
      />
    </div>
  )
}
