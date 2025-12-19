'use client'

import { useMemo, useDeferredValue } from 'react'
import dynamic from 'next/dynamic'
import type { ISourceOptions } from '@tsparticles/engine'
import { cn } from '@/lib/utils'
import {
  useMounted,
  usePrefersReducedMotion,
  useParticlesEngine,
  useIsDark,
} from './hooks'
import {
  createParticlesConfig,
  createReducedMotionConfig,
} from './AnimatedBackground.utils'

// Dynamically import Particles to reduce initial bundle size
// This is a heavy library that's only needed for the background animation
// @tsparticles/react exports Particles as both default and named export
const Particles = dynamic(
  () =>
    import('@tsparticles/react').then((mod) => {
      // Ensure we return a proper module object for Next.js dynamic
      const Component = mod.default || mod.Particles
      return { default: Component }
    }),
  {
    ssr: false,
    loading: () => null, // Render nothing while loading
  }
)

interface AnimatedBackgroundProps {
  className?: string
}

/**
 * AnimatedBackground Component
 *
 * Provides an animated particle background for the home page.
 * Features:
 * - Theme-aware particle colors (dark/light mode)
 * - Respects prefers-reduced-motion accessibility preference
 * - High-performance with 60fps target
 * - Non-intrusive (behind content, pointer-events: none)
 * - Uses React concurrent features (useDeferredValue) for smooth theme transitions
 *
 * @param className - Optional additional CSS classes
 *
 * @example
 * ```tsx
 * <AnimatedBackground className="custom-class" />
 * ```
 */
export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  const mounted = useMounted()
  const prefersReducedMotion = usePrefersReducedMotion()
  const { isInitialized, hasError } = useParticlesEngine()
  const isDarkRaw = useIsDark()

  // Use deferred value for theme to prevent blocking renders during theme transitions
  const isDark = useDeferredValue(isDarkRaw)

  // Particle configuration based on theme and accessibility preferences
  const particlesConfig: ISourceOptions = useMemo(() => {
    if (prefersReducedMotion) {
      return createReducedMotionConfig()
    }
    return createParticlesConfig(isDark)
  }, [isDark, prefersReducedMotion])

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  // If initialization failed or not yet initialized, render nothing (graceful degradation)
  if (hasError || !isInitialized) {
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
        options={particlesConfig}
        className="w-full h-full"
      />
    </div>
  )
}
