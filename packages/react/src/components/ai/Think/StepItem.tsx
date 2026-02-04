/**
 * Step item component for Think component
 * @packageDocumentation
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { STEP_STATUS_CONFIG } from './config'
import { getStepItemAnimationProps } from './animations'
import type { ThinkStep } from './types'

/**
 * Props for StepItem component
 */
interface StepItemProps {
  step: ThinkStep
  index: number
  prefersReducedMotion: boolean
}

/**
 * Individual step display component
 */
export const StepItem = React.memo(function StepItem({
  step,
  index,
  prefersReducedMotion,
}: StepItemProps) {
  const config = STEP_STATUS_CONFIG[step.status]
  const animationProps = getStepItemAnimationProps(index, prefersReducedMotion)

  return (
    <motion.div
      {...animationProps}
      className="reasoning-step"
    >
      {/* Status indicator */}
      <div className={cn('flex items-center justify-center w-4 h-4 flex-shrink-0', config.color)}>
        {config.icon || (
          <div className={cn('reasoning-step-dot', config.dotColor)} />
        )}
      </div>

      {/* Step text */}
      <div className="flex-1 min-w-0">
        <span className={cn('text-sm', config.color)}>
          {step.text}
        </span>
        {step.duration && step.status === 'complete' && (
          <span className="ml-2 text-xs text-muted-foreground tabular-nums">
            {(step.duration / 1000).toFixed(1)}s
          </span>
        )}
      </div>
    </motion.div>
  )
})

StepItem.displayName = 'StepItem'
