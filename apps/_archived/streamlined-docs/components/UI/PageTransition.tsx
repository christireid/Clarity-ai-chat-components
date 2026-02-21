'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { durations } from '@/lib/animations'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  /**
   * Transition mode:
   * - 'fade': Simple fade in/out
   * - 'slide': Slide up with fade
   * - 'scale': Scale with fade (command palette style)
   */
  mode?: 'fade' | 'slide' | 'scale'
  /**
   * Duration in seconds (defaults to design token)
   */
  duration?: number
}

/**
 * PageTransition - Wrapper for smooth page transitions
 *
 * Uses the animation library for consistent transitions across the site.
 * Leverages Next.js usePathname to detect route changes.
 * Respects prefers-reduced-motion for accessibility.
 *
 * Performance: Uses GPU-accelerated properties (transform, opacity)
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * <PageTransition mode="slide">
 *   {children}
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  mode = 'fade',
  duration = durations.normal,
}: PageTransitionProps) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  // Full animation variants
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  }

  // Reduced motion variants - opacity only
  const reducedVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  }

  // Use reduced variants when user prefers reduced motion
  const activeVariants = shouldReduceMotion ? reducedVariants : variants[mode]

  // Faster duration for reduced motion
  const activeDuration = shouldReduceMotion ? 0.1 : duration

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={activeVariants}
        viewport={{ once: true }}
        transition={{
          duration: activeDuration,
          ease: [0.4, 0, 0.2, 1], // Standard easing curve
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * PageSection - Animated section for within-page content
 *
 * Creates staggered animations for page sections using the animation library.
 * Respects prefers-reduced-motion for accessibility.
 *
 * @example
 * ```tsx
 * <PageSection delay={0.1}>
 *   <h1>Section Title</h1>
 *   <p>Content...</p>
 * </PageSection>
 * ```
 */
interface PageSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export function PageSection({
  children,
  delay = 0,
  className,
}: PageSectionProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      viewport={{ once: true }}
      transition={{
        delay: shouldReduceMotion ? 0 : delay,
        duration: shouldReduceMotion ? 0.1 : durations.normal,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
