'use client'

import { useCallback, useRef, useDeferredValue } from 'react'
import Particles from '@tsparticles/react'
import type { Container } from '@tsparticles/engine'
import { cn } from '@/lib/utils'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useThemeMode } from './hooks/useThemeMode'
import { useParticlesEngine } from './hooks/useParticlesEngine'
import { usePageVisibility } from './hooks/usePageVisibility'
import { darkParticlesConfig, lightParticlesConfig } from './config/particles.config'

/**
 * Props for the AnimatedBackground component.
 */
export interface AnimatedBackgroundProps {
  /** Additional CSS classes to apply to the container */
  className?: string
}

/**
 * High-performance animated particle background component.
 * 
 * Features:
 * - Interactive particles that respond to mouse interactions
 * - Theme-aware (dark/light mode support)
 * - Respects `prefers-reduced-motion` accessibility preference
 * - Performance optimized with Page Visibility API
 * - Graceful error handling and degradation
 * - Uses React concurrent features (useDeferredValue) for smooth theme transitions
 * 
 * @example
 * ```tsx
 * <AnimatedBackground className="custom-class" />
 * ```
 */
export function AnimatedBackground({ className = '' }: AnimatedBackgroundProps) {
  const prefersReducedMotion = useReducedMotion()
  const isDarkRaw = useThemeMode()
  
  // Use deferred value for theme to prevent blocking renders during theme transitions
  const isDark = useDeferredValue(isDarkRaw)
  
  const { isInitialized, error } = useParticlesEngine()
  const containerRef = useRef<Container | null>(null)

  // Particles loaded callback
  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    if (container) {
      containerRef.current = container
    }
  }, [])

  // Handle page visibility for performance optimization
  // Pass container ref value - hook will handle updates via internal ref
  usePageVisibility(containerRef.current, isInitialized && !prefersReducedMotion)

  // Don't render if reduced motion is preferred, not initialized, or error occurred
  if (prefersReducedMotion || !isInitialized || error) {
    // Log error in development mode for debugging
    if (error && process.env.NODE_ENV === 'development') {
      console.warn('[AnimatedBackground] Initialization error:', error)
    }
    return null
  }

  return (
    <div
      className={cn('fixed inset-0 -z-10 pointer-events-none', className)}
      aria-hidden="true"
      role="presentation"
    >
      <Particles
        id="animated-background"
        particlesLoaded={particlesLoaded}
        options={isDark ? darkParticlesConfig : lightParticlesConfig}
        className="w-full h-full"
      />
    </div>
  )
}
