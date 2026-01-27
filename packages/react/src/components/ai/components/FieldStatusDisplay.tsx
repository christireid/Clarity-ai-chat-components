/**
 * FieldStatusDisplay Component
 *
 * Displays per-field streaming status with mini progress bars
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@clarity-chat/primitives'
import { AnimatedDots } from '../../ui/AnimatedDots'
import type { FieldStatus } from '../StreamingProgress.types'
import {
  FIELD_STATUS_COLORS,
  FIELD_STATUS_TEXT_COLORS,
  formatTokenCount,
} from '../StreamingProgress.utils'

interface FieldStatusDisplayProps {
  fieldStatus: Map<string, FieldStatus>
  prefersReducedMotion: boolean
}

export const FieldStatusDisplay: React.FC<FieldStatusDisplayProps> = ({
  fieldStatus,
  prefersReducedMotion,
}) => {
  const fieldArray = Array.from(fieldStatus.values())

  if (fieldArray.length === 0) return null

  return (
    <div className="space-y-2 mt-3 pl-2 border-l-2 border-border/40">
      <AnimatePresence>
        {fieldArray.map((field) => (
          <motion.div
            key={field.name}
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
            }
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }
            }
            className="flex items-center gap-2"
          >
            {/* Status indicator dot */}
            <div
              className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                FIELD_STATUS_COLORS[field.status],
                field.status === 'streaming' &&
                  !prefersReducedMotion &&
                  'animate-pulse'
              )}
            />

            {/* Field name */}
            <span
              className={cn(
                'text-xs font-medium capitalize',
                FIELD_STATUS_TEXT_COLORS[field.status]
              )}
            >
              {field.name}
            </span>

            {/* Mini progress bar */}
            {field.status === 'streaming' && (
              <div className="flex-1 h-1 rounded-full bg-primary/20 overflow-hidden max-w-24">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${field.progress}%` }}
                  className="h-full bg-primary rounded-full"
                  transition={{
                    duration: prefersReducedMotion ? 0.1 : 0.3,
                    ease: 'easeOut',
                  }}
                />
              </div>
            )}

            {/* Token count */}
            {field.tokensReceived > 0 && (
              <span className="text-xs text-muted-foreground/70 tabular-nums">
                {formatTokenCount(field.tokensReceived)}
              </span>
            )}

            {/* Streaming dots */}
            {field.status === 'streaming' && !prefersReducedMotion && (
              <AnimatedDots variant="fade" size="sm" />
            )}

            {/* Error indicator */}
            {field.status === 'error' && field.error && (
              <span
                className="text-xs text-destructive truncate max-w-32"
                title={field.error}
              >
                {field.error}
              </span>
            )}

            {/* Complete checkmark */}
            {field.status === 'complete' && (
              <svg
                className="w-3 h-3 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

FieldStatusDisplay.displayName = 'FieldStatusDisplay'
