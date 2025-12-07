'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useDeferredValue } from 'react'
import dynamic from 'next/dynamic'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useThemeDetection } from './hooks/useThemeDetection'
import { useDebouncedCallback } from './hooks/useDebouncedCallback'
import { createDarkModeConfig, createLightModeConfig } from './config/particleConfigs'
import { isParticlesEngine, type ParticlesEngine } from './types/particles'
import { cn } from '@/lib/utils'

// Dynamically import Particles to reduce initial bundle size
const Particles = dynamic(
  () => import('@tsparticles/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => null, // No loading state needed for background
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
export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isDarkModeRaw = useThemeDetection()
  
  // Use deferred value for theme to prevent blocking renders during theme transitions
  const isDarkMode = useDeferredValue(isDarkModeRaw)
  
  const engineRef = useRef<Engine | null>(null)
  const [loadError, setLoadError] = useState(false)

  // Handle page visibility to pause animation when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isParticlesEngine(engineRef.current)) {
        if (document.hidden) {
          engineRef.current.pause?.()
        } else if (!reducedMotion) {
          engineRef.current.play?.()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [reducedMotion])

  // Handle window resize with debouncing
  const handleResize = useDebouncedCallback(() => {
    if (isParticlesEngine(engineRef.current)) {
      engineRef.current.canvas?.resize?.()
    }
  }, 150)

  useEffect(() => {
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadSlim(engine)
      engineRef.current = engine
      setLoadError(false)
    } catch (error) {
      // Background animation is non-critical, but track error for debugging
      setLoadError(true)
      engineRef.current = null
      
      // In production, you might want to log this to an error tracking service
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to load tsparticles:', error)
      }
    }
  }, [])

  // Cleanup engine on unmount
  useEffect(() => {
    return () => {
      if (isParticlesEngine(engineRef.current)) {
        engineRef.current.destroy?.()
        engineRef.current = null
      }
    }
  }, [])

  // Memoize configurations to prevent unnecessary re-renders
  const config = useMemo(() => {
    return isDarkMode
      ? createDarkModeConfig(reducedMotion)
      : createLightModeConfig(reducedMotion)
  }, [isDarkMode, reducedMotion])

  // Don't render if motion is reduced or if there was a load error
  if (reducedMotion || loadError) {
    return null
  }

  return (
    <div
      className={cn('fixed inset-0 -z-10 pointer-events-none', className)}
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
