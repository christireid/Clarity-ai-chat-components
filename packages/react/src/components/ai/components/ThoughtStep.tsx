/**
 * ThoughtStep Component
 *
 * Individual reasoning step display with collapsible content.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
  STAGGER_TIMING,
} from '../../../animations/constants'
import { StepProgress, StatusBadge } from './ThoughtHelpers'
import { ChevronDownIcon } from './ChainOfThoughtIcons'
import {
  STATUS_CONFIG,
  getStatusIcon,
  formatDuration,
  formatTimestamp,
} from '../ChainOfThought.utils'
import type { StepItemProps } from '../ChainOfThought.types'

/**
 * Individual step component
 */
export const ThoughtStep: React.FC<StepItemProps> = ({
  step,
  index,
  isExpanded,
  onToggle,
  onClick,
  onRetry,
  showStepNumber,
  showTimestamp,
  showDuration,
  variant,
  prefersReducedMotion,
  className,
}) => {
  const config = STATUS_CONFIG[step.status]
  const isCompact = variant === 'compact' || variant === 'minimal'
  const hasContent = step.content && step.content.trim().length > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (hasContent) {
        onToggle()
      }
      onClick?.()
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.normal,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.fast,
      }}
      className={cn(
        'relative rounded-lg border transition-all duration-150',
        config.bgColor,
        config.borderColor,
        'hover:shadow-sm',
        {
          'ring-2 ring-primary/20': step.status === 'in-progress',
        },
        className
      )}
      role="article"
      aria-label={`Step ${index + 1}: ${step.title}, ${config.label}`}
    >
      {/* Step Header */}
      <button
        type="button"
        onClick={() => {
          if (hasContent) onToggle()
          onClick?.()
        }}
        onKeyDown={handleKeyDown}
        disabled={!hasContent && !onClick}
        className={cn(
          'w-full flex items-start gap-3 text-left',
          isCompact ? 'p-2.5' : 'p-3.5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
          'disabled:cursor-default',
          hasContent && 'cursor-pointer'
        )}
        aria-expanded={hasContent ? isExpanded : undefined}
        aria-controls={hasContent ? `step-content-${step.id}` : undefined}
      >
        {/* Step Number / Icon */}
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center rounded-full',
            isCompact ? 'w-6 h-6' : 'w-8 h-8',
            config.bgColor,
            'border',
            config.borderColor
          )}
        >
          {showStepNumber ? (
            <span
              className={cn(
                'font-semibold tabular-nums',
                isCompact ? 'text-xs' : 'text-sm',
                config.iconColor
              )}
            >
              {index + 1}
            </span>
          ) : (
            getStatusIcon(step.status, step.icon)
          )}
        </div>

        {/* Step Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={cn(
                'font-semibold text-foreground truncate',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {step.title}
            </h4>
            {variant !== 'minimal' && (
              <StatusBadge status={step.status} showDots />
            )}
          </div>

          {/* Metadata row */}
          {(showTimestamp || showDuration) && variant !== 'minimal' && (
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/80">
              {showTimestamp && step.timestamp && (
                <span>{formatTimestamp(step.timestamp)}</span>
              )}
              {showDuration && step.duration !== undefined && (
                <span className="tabular-nums">
                  {formatDuration(step.duration)}
                </span>
              )}
            </div>
          )}

          {/* In-progress indicator with progress bar */}
          {step.status === 'in-progress' && step.progress !== undefined && (
            <StepProgress
              progress={step.progress}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
        </div>

        {/* Expand/Collapse indicator */}
        {hasContent && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : durations.fast,
              ease: EASING_FRAMER.out,
            }}
            className="flex-shrink-0 text-muted-foreground"
          >
            <ChevronDownIcon size={16} />
          </motion.div>
        )}
      </button>

      {/* Step Content (Collapsible) */}
      <AnimatePresence initial={false}>
        {isExpanded && hasContent && (
          <motion.div
            id={`step-content-${step.id}`}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { height: 'auto', opacity: 1 }
            }
            exit={
              prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.1 : durations.normal,
              ease: EASING_FRAMER.out,
            }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                'border-t',
                config.borderColor,
                isCompact ? 'px-2.5 py-2' : 'px-3.5 py-3'
              )}
            >
              {/* Main content */}
              <div
                className={cn(
                  'text-muted-foreground whitespace-pre-wrap',
                  isCompact ? 'text-xs' : 'text-sm',
                  'leading-relaxed'
                )}
              >
                {step.content}
              </div>

              {/* Error message */}
              {step.status === 'error' && step.error && (
                <div className="mt-3 p-2.5 rounded-md bg-destructive/10 border border-destructive/30">
                  <p className="text-sm text-destructive font-medium">
                    {step.error}
                  </p>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRetry()
                      }}
                      className={cn(
                        'mt-2 px-3 py-1.5 text-xs font-medium rounded-md',
                        'bg-destructive text-destructive-foreground',
                        'hover:bg-destructive/90 transition-colors',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      )}
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {/* Metadata */}
              {step.metadata &&
                Object.keys(step.metadata).length > 0 &&
                variant === 'detailed' && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {Object.entries(step.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-muted-foreground">{key}:</dt>
                          <dd className="font-medium text-foreground">
                            {String(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

              {/* Sub-steps (recursive) */}
              {step.subSteps && step.subSteps.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-border/40 space-y-2">
                  {step.subSteps.map((subStep) => (
                    <div
                      key={subStep.id}
                      className="flex items-start gap-2 text-xs"
                    >
                      <span className={STATUS_CONFIG[subStep.status].iconColor}>
                        {getStatusIcon(subStep.status)}
                      </span>
                      <div>
                        <span className="font-medium">{subStep.title}</span>
                        {subStep.content && (
                          <p className="text-muted-foreground mt-0.5">
                            {subStep.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

ThoughtStep.displayName = 'ThoughtStep'
