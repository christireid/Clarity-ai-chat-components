'use client'

import dynamic from 'next/dynamic'

// Lazy load the animated background to reduce initial bundle size
// This component is decorative and can load after initial render
const AnimatedBackground = dynamic(
  () =>
    import('@/components/Layout/AnimatedBackground').then(
      (mod) => mod.AnimatedBackground
    ),
  {
    ssr: false, // Particle animations require browser APIs
  }
)

export function AnimatedBackgroundClient() {
  return <AnimatedBackground />
}
