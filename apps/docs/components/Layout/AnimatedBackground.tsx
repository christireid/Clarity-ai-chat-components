'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Container, Engine, IOptions, RecursivePartial } from '@tsparticles/engine'

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const [init, setInit] = useState(false)
  const [initError, setInitError] = useState<Error | null>(null)
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<Container | null>(null)
  const initAbortedRef = useRef(false)

  // useTheme is safe to call unconditionally - returns undefined values if not in provider
  const { theme, resolvedTheme } = useTheme()

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    return () => {
      initAbortedRef.current = true
    }
  }, [])

  // Compute isDark only when mounted
  const isDark = useMemo(() => {
    if (!mounted) return false
    return resolvedTheme === 'dark' || theme === 'dark'
  }, [mounted, resolvedTheme, theme])

  // Check for prefers-reduced-motion with safety check
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      setPrefersReducedMotion(mediaQuery.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches)
      }

      // Use addEventListener for better browser support
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    } catch {
      // Silently fail - reduced motion check is not critical
    }
  }, [])

  // Initialize particles engine with error handling and cleanup
  useEffect(() => {
    let isMounted = true

    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
    })
      .then(() => {
        if (isMounted && !initAbortedRef.current) {
          setInit(true)
          setInitError(null)
        }
      })
      .catch((error: Error) => {
        if (isMounted && !initAbortedRef.current) {
          setInitError(error)
          // Don't set init to true on error - component will gracefully degrade
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Handle page visibility for performance
  useEffect(() => {
    if (!init || prefersReducedMotion || typeof document === 'undefined') return

    const handleVisibilityChange = () => {
      if (containerRef.current) {
        try {
          if (document.hidden) {
            containerRef.current.pause()
          } else {
            containerRef.current.play()
          }
        } catch {
          // Silently handle errors - container may be destroyed
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [init, prefersReducedMotion])

  // Particles loaded callback
  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    if (container && !initAbortedRef.current) {
      containerRef.current = container
    }
  }, [])

  // Memoize configs to prevent recreation on every render
  const darkConfig = useMemo(
    () =>
      ({
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push' as const,
            },
            onHover: {
              enable: true,
              mode: 'repulse' as const,
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 2,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
      particles: {
        color: {
          value: '#60a5fa', // brand-400
        },
        links: {
          color: '#3b82f6', // brand-500
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 50,
        },
        opacity: {
          value: 0.6,
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.3,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
            sync: false,
          },
        },
      },
        detectRetina: true,
      } as unknown as RecursivePartial<IOptions>),
    []
  )

  const lightConfig = useMemo(
    () =>
      ({
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push' as const,
            },
            onHover: {
              enable: true,
              mode: 'grab' as const,
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 1,
            },
            grab: {
              distance: 120,
              links: {
                opacity: 0.4,
              },
            },
          },
        },
      particles: {
        color: {
          value: '#93c5fd', // brand-300
        },
        links: {
          color: '#bfdbfe', // brand-200
          distance: 120,
          enable: true,
          opacity: 0.2,
          width: 0.5,
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce',
          },
          random: false,
          speed: 0.5,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1000,
          },
          value: 40,
        },
        opacity: {
          value: 0.4,
          animation: {
            enable: true,
            speed: 0.3,
            minimumValue: 0.2,
            sync: false,
          },
        },
        shape: {
          type: 'circle',
        },
        size: {
          value: { min: 0.5, max: 2 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.3,
            sync: false,
          },
        },
      },
        detectRetina: true,
      } as unknown as RecursivePartial<IOptions>),
    []
  )

  // Don't render if reduced motion is preferred, not mounted, not initialized, or error occurred
  if (prefersReducedMotion || !init || !mounted || initError) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Particles
        id="animated-background"
        particlesLoaded={particlesLoaded}
        options={isDark ? darkConfig : lightConfig}
        className="w-full h-full"
      />
    </div>
  )
}
