'use client'

import { useRef, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

// Dynamic import - Three.js and HeroParticles only load when conditions are met
const HeroParticles = dynamic(
  () =>
    import('./HeroParticles').then((mod) => ({ default: mod.HeroParticles })),
  {
    ssr: false,
    loading: () => null, // No skeleton - particles are optional enhancement
  }
)

/**
 * Lazy-loaded wrapper for HeroParticles
 *
 * Features:
 * - Only loads on desktop (viewport > 1024px)
 * - Uses Intersection Observer to load when hero section is visible
 * - Respects prefers-reduced-motion
 * - Progressive enhancement pattern
 *
 * This prevents mobile users from downloading Three.js and TSParticles
 * which can be 1.25 MB+ combined.
 *
 * @example
 * ```tsx
 * <div className="relative h-screen">
 *   <LazyHeroParticles />
 *   <div className="relative z-10">
 *     // Hero content here
 *   </div>
 * </div>
 * ```
 */
export function LazyHeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(containerRef, {
    threshold: 0.1,
    rootMargin: '100px', // Start loading slightly before visible
  })

  const [shouldRender, setShouldRender] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Check if desktop (viewport width)
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkDesktop()

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Only render if:
    // 1. Visible in viewport
    // 2. Desktop viewport
    // 3. No reduced motion preference
    if (isVisible && isDesktop && !prefersReducedMotion) {
      setShouldRender(true)
    }

    // Update on resize
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [isVisible, isDesktop])

  return (
    <div
      ref={containerRef}
      className="hero-particles-container absolute inset-0 -z-10"
    >
      {shouldRender && <HeroParticles />}
    </div>
  )
}
