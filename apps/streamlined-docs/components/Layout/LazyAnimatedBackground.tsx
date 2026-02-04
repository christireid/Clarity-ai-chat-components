'use client'

import dynamic from 'next/dynamic'
import { useLazyBackground } from '@/hooks/useLazyBackground'

// Dynamic import - TSParticles only loads when conditions are met
const AnimatedBackground = dynamic(
  () =>
    import('./AnimatedBackground').then((mod) => ({
      default: mod.AnimatedBackground,
    })),
  {
    ssr: false,
    loading: () => null, // No skeleton - background is optional enhancement
  }
)

/**
 * Lazy-loaded wrapper for AnimatedBackground
 *
 * Features:
 * - Only loads on desktop (viewport > 1024px)
 * - Respects prefers-reduced-motion
 * - Skips on slow network connections
 * - Delays loading until after initial render (1s)
 *
 * This prevents mobile users from downloading TSParticles (~200KB)
 * and improves initial page load performance.
 *
 * @example
 * ```tsx
 * <LazyAnimatedBackground />
 * ```
 */
export function LazyAnimatedBackground() {
  const shouldLoad = useLazyBackground({
    minViewportWidth: 1024, // Desktop only
    checkReducedMotion: true, // Respect a11y preferences
    checkNetworkSpeed: true, // Skip on slow networks
    delayMs: 1000, // After initial render
  })

  if (!shouldLoad) {
    return null
  }

  return <AnimatedBackground />
}
