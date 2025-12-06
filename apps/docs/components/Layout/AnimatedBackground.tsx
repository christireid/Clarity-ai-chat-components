'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [reducedMotion, setReducedMotion] = useState(false)
  const engineRef = useRef<Engine | null>(null)
  const lastMouseUpdateRef = useRef(0)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Handle page visibility to pause animation when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (engineRef.current) {
        if (document.hidden) {
          engineRef.current.pause()
        } else if (!reducedMotion) {
          engineRef.current.play()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [reducedMotion])

  // Throttled mouse tracking for interactive particles
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const now = Date.now()
      // Throttle to ~60fps max
      if (now - lastMouseUpdateRef.current < 16) return
      lastMouseUpdateRef.current = now

      // Update particle interactivity if engine is ready
      if (engineRef.current && !reducedMotion) {
        const container = engineRef.current.canvas?.element?.parentElement
        if (container) {
          const rect = container.getBoundingClientRect()
          const relativeX = event.clientX - rect.left
          const relativeY = event.clientY - rect.top

          // Update particles interactivity (this will be handled by the config)
          engineRef.current.interactivity.mouse.position = {
            x: relativeX,
            y: relativeY,
          }
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [reducedMotion])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.canvas?.resize()
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
    engineRef.current = engine
  }, [])

  // Determine if we're in dark mode
  const isDark = mounted && (resolvedTheme === 'dark' || (!resolvedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches))

  // Configuration for dark mode: glowing nodes, cyberpunk grid
  const darkModeConfig: ISourceOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: reducedMotion ? 0 : 50,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ['#60a5fa', '#3b82f6', '#93c5fd', '#2563eb'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
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
      links: {
        enable: true,
        distance: 150,
        color: '#3b82f6',
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: !reducedMotion,
        speed: 0.5,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: false,
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: !reducedMotion,
          mode: 'grab',
        },
        onClick: {
          enable: false,
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 200,
          links: {
            opacity: 0.4,
          },
        },
      },
    },
    detectRetina: true,
  }

  // Configuration for light mode: subtle flowing mesh, soft gradient waves
  const lightModeConfig: ISourceOptions = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: reducedMotion ? 0 : 40,
        density: {
          enable: true,
          value_area: 1000,
        },
      },
      color: {
        value: ['#3b82f6', '#2563eb', '#60a5fa', '#93c5fd'],
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: { min: 0.05, max: 0.25 },
        animation: {
          enable: !reducedMotion,
          speed: 0.3,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 2.5 },
        animation: {
          enable: !reducedMotion,
          speed: 1.5,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 180,
        color: '#3b82f6',
        opacity: 0.15,
        width: 0.5,
      },
      move: {
        enable: !reducedMotion,
        speed: 0.3,
        direction: 'none',
        random: true,
        straight: false,
        outModes: {
          default: 'out',
        },
        attract: {
          enable: false,
        },
      },
    },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: {
          enable: !reducedMotion,
          mode: 'grab',
        },
        onClick: {
          enable: false,
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 250,
          links: {
            opacity: 0.3,
          },
        },
      },
    },
    detectRetina: true,
  }

  const config = isDark ? darkModeConfig : lightModeConfig

  // Don't render if motion is reduced
  if (reducedMotion) {
    return null
  }

  if (!mounted) {
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
        options={config}
        className="w-full h-full"
      />
    </div>
  )
}
