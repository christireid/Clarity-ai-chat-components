/**
 * Thinking indicator component for Think component
 * @packageDocumentation
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { getThinkingDotAnimationProps } from './animations'

/**
 * Props for ThinkingIndicator component
 */
interface ThinkingIndicatorProps {
  prefersReducedMotion: boolean
}

/**
 * Thinking indicator with animated dots
 */
export const ThinkingIndicator = React.memo(function ThinkingIndicator({
  prefersReducedMotion,
}: ThinkingIndicatorProps) {
  return (
    <span
      className="inline-flex items-center gap-1 ml-2 relative"
      aria-hidden="true"
    >
      {/* Glassmorphism: subtle intensity, blue gradient, animated glow */}
      <span className="absolute inset-0 -m-1 rounded-full bg-gradient-to-r from-blue-400/20 via-blue-500/30 to-blue-600/20 blur-md animate-pulse opacity-60" />
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="relative w-1 h-1 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          {...getThinkingDotAnimationProps(i, prefersReducedMotion)}
        />
      ))}
    </span>
  )
})

ThinkingIndicator.displayName = 'ThinkingIndicator'
