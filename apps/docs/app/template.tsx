'use client'

import { PageTransition } from '@/components/UI/PageTransition'

/**
 * App Router template wrapper for page transitions
 *
 * This template wraps every page with smooth transitions.
 * Using template.tsx instead of layout.tsx ensures animations
 * trigger on route changes (layouts persist, templates re-render).
 *
 * Animation: Slide up with fade (200-300ms)
 * Performance: GPU-accelerated, 60fps verified
 * Accessibility: Respects prefers-reduced-motion
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <PageTransition mode="slide" duration={0.25}>
      {children}
    </PageTransition>
  )
}
