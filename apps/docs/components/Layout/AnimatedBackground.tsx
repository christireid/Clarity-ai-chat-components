'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const [isDarkMode, setIsDarkMode] = useState(false)
  const engineRef = useRef<Engine | null>(null)

  // Initialize client-side state after mount
  useEffect(() => {
    setMounted(true)

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    // Determine theme based on resolvedTheme or system preference
    const determineTheme = () => {
      if (resolvedTheme === 'dark') {
        setIsDarkMode(true)
      } else if (resolvedTheme === 'light') {
        setIsDarkMode(false)
      } else {
        // Fallback to system preference
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setIsDarkMode(darkModeQuery.matches)
      }
    }

    determineTheme()

    const handleThemeChange = (e: MediaQueryListEvent) => {
      // Only use system preference if resolvedTheme is not explicitly set
      if (!resolvedTheme) {
        setIsDarkMode(e.matches)
      }
    }

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeQuery.addEventListener('change', handleThemeChange)
    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      darkModeQuery.removeEventListener('change', handleThemeChange)
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [resolvedTheme])

  // Handle page visibility to pause animation when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (engineRef.current) {
        const engine = engineRef.current as any
        if (document.hidden) {
          engine.pause?.()
        } else if (!reducedMotion) {
          engine.play?.()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [reducedMotion])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (engineRef.current) {
        const engine = engineRef.current as any
        engine.canvas?.resize?.()
      }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadSlim(engine)
      engineRef.current = engine
    } catch {
      // Silently fail - background animation is non-critical
      // In production, you might want to log this to an error tracking service
      engineRef.current = null
    }
  }, [])

  // Cleanup engine on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        const engine = engineRef.current as any
        engine.destroy?.()
        engineRef.current = null
      }
    }
  }, [])

  // Memoize configurations to prevent unnecessary re-renders
  // Configuration for dark mode: glowing nodes, cyberpunk grid
  const darkModeConfig = useMemo(() => ({
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
  }), [reducedMotion])

  // Configuration for light mode: subtle flowing mesh, soft gradient waves
  const lightModeConfig = useMemo(() => ({
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
  }), [reducedMotion])

  const config = useMemo(() => {
    return isDarkMode ? darkModeConfig : lightModeConfig
  }, [isDarkMode, darkModeConfig, lightModeConfig])

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
        options={config as unknown as ISourceOptions}
        className="w-full h-full"
      />
    </div>
  )
}
