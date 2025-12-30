'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { fadeIn, slideUp, springs, durations, easings } from '@/lib/animations'
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[mode]}
        transition={{
          duration,
          ease: easings.easeOut,
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

export function PageSection({
  children,
  delay = 0,
  className,
}: PageSectionProps) {
  return (
    <motion.div
      className={className}
      variants={fadeIn}
      initial="initial"
      animate="animate"
      custom={delay}
      transition={{
        delay,
        duration: durations.normal,
        ease: easings.easeOut,
      }}
    >
      {children}
    </motion.div>
  )
}
