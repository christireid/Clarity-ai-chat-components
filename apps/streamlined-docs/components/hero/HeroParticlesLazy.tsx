'use client'

import dynamic from 'next/dynamic'
import type { HeroParticlesProps } from './HeroParticles.types'

/**
 * Loading placeholder for lazy-loaded particles
 * Shows a subtle gradient while Three.js loads
 */
function LazyLoadingFallback() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse" />
    </div>
  )
}

/**
 * Lazy-loaded version of HeroParticles
 *
 * This wrapper uses Next.js dynamic imports to code-split the Three.js
 * dependencies, reducing initial bundle size. Three.js and related
 * libraries are only loaded when this component mounts.
 *
 * @example
 * ```tsx
 * import { HeroParticlesLazy } from '@/components/hero/HeroParticlesLazy'
 *
 * export function HeroSection() {
 *   return (
 *     <div className="relative h-screen">
 *       <HeroParticlesLazy />
 *       <div className="relative z-10">
 *         <h1>Welcome</h1>
 *       </div>
 *     </div>
 *   )
 * }
 * ```
 */
export const HeroParticlesLazy = dynamic<HeroParticlesProps>(
  () => import('./HeroParticles').then((mod) => mod.HeroParticles),
  {
    ssr: false,
    loading: LazyLoadingFallback,
  }
)

export default HeroParticlesLazy
