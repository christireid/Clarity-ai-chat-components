'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Container, Engine } from '@tsparticles/engine'

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const [init, setInit] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const containerRef = useRef<Container | null>(null)
  const { theme, resolvedTheme } = useTheme()

  // Handle mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark')

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Handle page visibility for performance
  useEffect(() => {
    if (!init || prefersReducedMotion) return

    const handleVisibilityChange = () => {
      if (containerRef.current) {
        if (document.hidden) {
          containerRef.current.pause()
        } else {
          containerRef.current.play()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [init, prefersReducedMotion])

  // Particles loaded callback
  const particlesLoaded = useCallback((container: Container | undefined) => {
    if (container) {
      containerRef.current = container
    }
  }, [])

  // Don't render if reduced motion is preferred or not mounted/initialized
  if (prefersReducedMotion || !init || !mounted) {
    return null
  }

  // Configuration for dark mode: glowing nodes with connections (cyberpunk/tech aesthetic)
  const darkConfig = {
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
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'repulse',
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
  }

  // Configuration for light mode: subtle flowing mesh with soft connections
  const lightConfig = {
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
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'grab',
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
