'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  fadeIn,
  fadeInUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
} from '@/lib/animations'
import type { ReactNode } from 'react'

export type RevealAnimation =
  | 'fadeInUp'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'fadeIn'

interface ScrollRevealProps {
  children: ReactNode
  /**
   * Animation variant to use
   * @default 'fadeInUp'
   */
  animation?: RevealAnimation
  /**
   * Delay before animation starts (in seconds)
   * @default 0
   */
  delay?: number
  /**
   * Percentage of element visible before triggering (0-1)
   * @default 0.2
   */
  threshold?: number
  /**
   * Only animate once (don't re-trigger on scroll)
   * @default true
   */
  once?: boolean
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Enable stagger for child elements
   * @default false
   */
  stagger?: boolean
  /**
   * Stagger delay between children (in seconds)
   * @default 0.05
   */
  staggerDelay?: number
}

const animationVariants = {
  fadeInUp,
  fadeInLeft: slideInLeft,
  fadeInRight: slideInRight,
  fadeIn,
}

/**
 * ScrollReveal Component
 *
 * Wraps content with scroll-triggered animations.
 * Content fades in when scrolled into view.
 *
 * Features:
 * - Multiple animation directions (up, left, right, fade)
 * - Configurable threshold and delay
 * - Stagger support for list items
 * - Once-only option (prevents re-triggering)
 * - Accessibility (respects prefers-reduced-motion)
 *
 * @example
 * ```tsx
 * // Basic fade in from bottom
 * <ScrollReveal>
 *   <Card />
 * </ScrollReveal>
 *
 * // Fade in from left with delay
 * <ScrollReveal animation="fadeInLeft" delay={0.2}>
 *   <Content />
 * </ScrollReveal>
 *
 * // Staggered list items
 * <ScrollReveal stagger>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.2,
  once = true,
  className,
  stagger = false,
  staggerDelay = 0.05,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const variants = animationVariants[animation]

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  if (stagger) {
    return (
      <motion.div
        variants={staggerContainer(staggerDelay)}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: threshold }}
        transition={{ delay }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={{ once, amount: threshold }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScrollRevealItem Component
 *
 * Individual item within a staggered reveal.
 * Must be used as direct child of <ScrollReveal stagger>
 *
 * @example
 * ```tsx
 * <ScrollReveal stagger>
 *   {items.map(item => (
 *     <ScrollRevealItem key={item.id}>
 *       <Card {...item} />
 *     </ScrollRevealItem>
 *   ))}
 * </ScrollReveal>
 * ```
 */
export function ScrollRevealItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  // staggerItem uses 'hidden'/'show' keys to match staggerContainer
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}
