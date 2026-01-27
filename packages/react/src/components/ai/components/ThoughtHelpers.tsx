/**
 * Helper components for ChainOfThought
 *
 * Small, reusable components used within the ChainOfThought component.
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
} from '../../../animations/constants'
import { AnimatedDots } from '../../ui/AnimatedDots'
import { STATUS_CONFIG } from '../ChainOfThought.utils'
import { BrainIcon } from './ChainOfThoughtIcons'
import type { ChainOfThoughtStepStatus } from '../ChainOfThought.types'

/**
 * Progress bar for in-progress steps
 */
export const StepProgress: React.FC<{
  progress: number
  prefersReducedMotion: boolean
}> = ({ progress, prefersReducedMotion }) => (
  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.slow,
        ease: EASING_FRAMER.out,
      }}
      className="h-full bg-primary rounded-full"
    />
  </div>
)

/**
 * Status badge component
 */
export const StatusBadge: React.FC<{
  status: ChainOfThoughtStepStatus
  showDots?: boolean
}> = ({ status, showDots }) => {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        'transition-colors duration-150',
        {
          'bg-muted/60 text-muted-foreground':
            config.badgeVariant === 'default',
          'bg-primary/10 text-primary': config.badgeVariant === 'info',
          'bg-success/10 text-success': config.badgeVariant === 'success',
          'bg-warning/10 text-warning': config.badgeVariant === 'warning',
          'bg-destructive/10 text-destructive':
            config.badgeVariant === 'destructive',
        }
      )}
    >
      {config.label}
      {showDots && status === 'in-progress' && (
        <AnimatedDots variant="fade" size="sm" className="ml-0.5" />
      )}
    </span>
  )
}

/**
 * Skeleton loader for loading state
 */
export const ChainOfThoughtSkeleton: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <div className="space-y-3" role="status" aria-label="Loading reasoning steps">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-lg border border-border/40 bg-muted/20 p-3.5 animate-pulse"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-muted/60" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/60 rounded w-1/3" />
            <div className="h-3 bg-muted/40 rounded w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

/**
 * Empty state component
 */
export const ChainOfThoughtEmpty: React.FC<{
  message: string
  className?: string
}> = ({ message, className }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center py-8 text-center',
      className
    )}
    role="status"
  >
    <BrainIcon size={40} className="text-muted-foreground/40 mb-3" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
)
