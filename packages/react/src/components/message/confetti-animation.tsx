import * as React from 'react'
import { motion } from 'framer-motion'
import { DURATION_SECONDS as durations, ANIMATION_PRESETS } from '../../animations/constants'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

export interface ConfettiAnimationProps {
  show: boolean
  particleCount?: number
}

const CONFETTI_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'] as const

// Confetti particle base animation
const CONFETTI_BASE_ANIMATION = {
  opacity: 0,
  scale: 1,
}

/**
 * Confetti animation component for positive feedback
 * Extracted from Message component for better organization
 */
export const ConfettiAnimation = React.memo<ConfettiAnimationProps>(
  ({ show, particleCount = 8 }) => {
    const prefersReducedMotion = useReducedMotion()

    // Don't render confetti if user prefers reduced motion
    if (prefersReducedMotion || !show) return null

    return (
      <>
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            {...ANIMATION_PRESETS.scale}
            animate={{
              ...ANIMATION_PRESETS.scale.animate,
              ...CONFETTI_BASE_ANIMATION,
              x: Math.cos((i * Math.PI * 2) / particleCount) * 30,
              y: Math.sin((i * Math.PI * 2) / particleCount) * 30,
            }}
            transition={{ duration: durations.slower, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            }}
            aria-hidden="true"
          />
        ))}
      </>
    )
  }
)

ConfettiAnimation.displayName = 'ConfettiAnimation'
