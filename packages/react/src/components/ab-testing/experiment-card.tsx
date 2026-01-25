'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@clarity-chat/primitives'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

/**
 * Props for ExperimentCard component
 */
export interface ExperimentCardProps {
  /** Experiment ID */
  id: string
  /** Experiment name */
  name: string
  /** Experiment description */
  description?: string
  /** Experiment status */
  status: 'draft' | 'running' | 'paused' | 'completed'
  /** Number of variants */
  variantCount: number
  /** Whether a winner has been detected */
  hasWinner?: boolean
  /** Whether this card is selected */
  isSelected?: boolean
  /** Callback when card is clicked */
  onSelect?: () => void
  /** Custom className */
  className?: string
}

/**
 * Card component for displaying an experiment in a list.
 *
 * @example
 * ```tsx
 * <ExperimentCard
 *   id="exp-1"
 *   name="Chat Input Enhancement"
 *   description="Testing new input UI"
 *   status="running"
 *   variantCount={3}
 *   hasWinner={false}
 *   isSelected={selectedId === 'exp-1'}
 *   onSelect={() => setSelectedId('exp-1')}
 * />
 * ```
 */
export function ExperimentCard({
  id,
  name,
  description,
  status,
  variantCount,
  hasWinner = false,
  isSelected = false,
  onSelect,
  className,
}: ExperimentCardProps): React.ReactElement {
  const prefersReducedMotion = useReducedMotion()

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect?.()
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
      viewport={{ once: true }}
    >
      <Card
        className={cn(
          'cursor-pointer transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-1',
          isSelected && 'border-primary',
          className
        )}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Select experiment ${name}`}
        aria-pressed={isSelected}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              {description && (
                <CardDescription className="text-xs mt-1">
                  {description}
                </CardDescription>
              )}
            </div>

            <Badge
              variant={
                status === 'running'
                  ? 'default'
                  : status === 'completed'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {variantCount} variant{variantCount !== 1 ? 's' : ''}
            </span>

            {hasWinner && (
              <Badge variant="success" className="text-xs">
                Winner found
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

ExperimentCard.displayName = 'ExperimentCard'
