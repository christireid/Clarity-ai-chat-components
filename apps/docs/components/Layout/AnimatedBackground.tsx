'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import type { Engine, ISourceOptions } from '@tsparticles/engine'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useThemeDetection } from './hooks/useThemeDetection'
import { useDebouncedCallback } from './hooks/useDebouncedCallback'
import { createDarkModeConfig, createLightModeConfig } from './config/particleConfigs'
import { isParticlesEngine, type ParticlesEngine } from './types/particles'

interface AnimatedBackgroundProps {
  className?: string
}

export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isDarkMode = useThemeDetection()
  const engineRef = useRef<Engine | null>(null)

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
    } catch {
      // Silently fail - background animation is non-critical
      // In production, you might want to log this to an error tracking service
      engineRef.current = null
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

  // Don't render if motion is reduced
  if (reducedMotion) {
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
