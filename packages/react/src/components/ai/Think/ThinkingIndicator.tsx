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
    <span className="inline-flex items-center gap-1 ml-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          {...getThinkingDotAnimationProps(i, prefersReducedMotion)}
        />
      ))}
    </span>
  )
})

ThinkingIndicator.displayName = 'ThinkingIndicator'
