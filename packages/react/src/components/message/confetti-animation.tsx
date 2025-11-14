import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ConfettiAnimationProps {
  show: boolean
  particleCount?: number
}

const CONFETTI_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'] as const

/**
 * Confetti animation component for positive feedback
 * Extracted from Message component for better organization
 */
export const ConfettiAnimation = React.memo<ConfettiAnimationProps>(
  ({ show, particleCount = 8 }) => {
    return (
      <AnimatePresence>
        {show && (
          <>
            {Array.from({ length: particleCount }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: 1,
                  x: Math.cos((i * Math.PI * 2) / particleCount) * 30,
                  y: Math.sin((i * Math.PI * 2) / particleCount) * 30,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
                style={{
                  backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                }}
                aria-hidden="true"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    )
  }
)

ConfettiAnimation.displayName = 'ConfettiAnimation'
