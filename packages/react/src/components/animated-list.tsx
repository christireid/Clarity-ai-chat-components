/**
 * Animated List Components
 * 
 * Pre-configured AnimatePresence wrappers for common list animation patterns.
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  createStaggerContainerVariant,
  createStaggerChildVariant,
  createSlideVariant,
  createFadeVariant,
  createScaleVariant,
} from '../animations/utils'
import type { AnimationDuration, StaggerTiming } from '../animations/constants'

export interface AnimatedListProps {
  /** Children to animate */
  children: React.ReactNode
  /** Animation type */
  variant?: 'slide' | 'fade' | 'scale'
  /** Stagger timing between items */
  stagger?: StaggerTiming
  /** Animation duration for each item */
  duration?: AnimationDuration
  /** Additional className */
  className?: string
  /** Delay before starting animations */
  delay?: number
}

/**
 * Container for animated list items with stagger effect
 */
export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  variant: _variant = 'slide', // Reserved for future use
  stagger = 'normal',
  duration: _duration = 'fast', // Reserved for future use
  className,
  delay = 0,
}) => {
  const containerVariants = createStaggerContainerVariant(stagger, delay)

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

export interface AnimatedListItemProps {
  /** Children to animate */
  children: React.ReactNode
  /** Animation type - must match parent AnimatedList variant */
  variant?: 'slide' | 'fade' | 'scale'
  /** Animation duration */
  duration?: AnimationDuration
  /** Additional className */
  className?: string
  /** Layout animation when reordering */
  layout?: boolean
}

/**
 * Individual list item with animation
 */
export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  variant = 'slide',
  duration = 'fast',
  className,
  layout = false,
}) => {
  const itemVariants = createStaggerChildVariant(variant, duration)

  return (
    <motion.div
      className={className}
      variants={itemVariants}
      layout={layout}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fade in/out wrapper
 */
export const FadePresence: React.FC<{
  children: React.ReactNode
  duration?: AnimationDuration
  className?: string
}> = ({ children, duration = 'normal', className }) => {
  const variants = createFadeVariant(duration)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Slide in/out wrapper
 */
export const SlidePresence: React.FC<{
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: AnimationDuration
  className?: string
}> = ({ children, direction = 'up', distance = 20, duration = 'normal', className }) => {
  const variants = createSlideVariant(direction, distance, duration)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Scale in/out wrapper
 */
export const ScalePresence: React.FC<{
  children: React.ReactNode
  initialScale?: number
  duration?: AnimationDuration
  className?: string
}> = ({ children, initialScale = 0.9, duration = 'fast', className }) => {
  const variants = createScaleVariant(initialScale, duration)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={className}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Conditional presence wrapper - only animates when condition is true
 */
export const ConditionalPresence: React.FC<{
  children: React.ReactNode
  show: boolean
  variant?: 'fade' | 'slide' | 'scale'
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
}> = ({ children, show, variant = 'fade', direction = 'up', className }) => {
  const variants =
    variant === 'fade'
      ? createFadeVariant()
      : variant === 'slide'
      ? createSlideVariant(direction)
      : createScaleVariant()

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          className={className}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Stagger children with configurable animation type
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode
  stagger?: StaggerTiming
  delay?: number
  className?: string
}> = ({ children, stagger = 'normal', delay = 0, className }) => {
  const variants = createStaggerContainerVariant(stagger, delay)

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

/**
 * Grid with stagger animation
 */
export const AnimatedGrid: React.FC<{
  children: React.ReactNode
  columns?: number
  gap?: number
  stagger?: StaggerTiming
  className?: string
}> = ({ children, columns = 3, gap = 4, stagger = 'fast', className }) => {
  const variants = createStaggerContainerVariant(stagger)

  return (
    <motion.div
      className={cn(`grid gap-${gap}`, className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      variants={variants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}
