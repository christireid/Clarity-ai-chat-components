'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import type { Container, Engine } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const [init, setInit] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<Container | null>(null)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === 'dark'

  // Handle theme mounting
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        containerRef.current.refresh()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle page visibility (pause when tab is hidden)
  useEffect(() => {
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
  }, [])

  // Particle configuration
  const particlesConfig = {
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
  }

  if (!init || reducedMotion || !mounted) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <Particles
        id="animated-background"
        particlesLoaded={(container) => {
          containerRef.current = container
        }}
        options={particlesConfig}
        className="w-full h-full"
      />
    </div>
  )
}
