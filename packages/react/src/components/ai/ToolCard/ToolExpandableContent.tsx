'use client'

/**
 * ToolExpandableContent Component
 *
 * Collapsible section showing args, result, and error details
 * @packageDocumentation
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DURATION_SECONDS, EASING_FRAMER } from '../../../animations/constants'

export interface ToolExpandableContentProps {
  /** Whether expanded */
  expanded: boolean
  /** Whether has content to show */
  hasContent: boolean
  /** Show arguments */
  showArgs?: boolean
  /** Arguments data */
  args?: Record<string, unknown>
  /** Show result */
  showResult?: boolean
  /** Result data */
  result?: unknown
  /** Error message */
  error?: string
  /** Disable animations */
  prefersReducedMotion: boolean
}

/**
 * ToolExpandableContent - Animated expandable section
 */
export function ToolExpandableContent({
  expanded,
  hasContent,
  showArgs,
  args,
  showResult,
  result,
  error,
  prefersReducedMotion,
}: ToolExpandableContentProps) {
  if (!hasContent) return null

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
            ease: EASING_FRAMER.out,
          }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-2 border-t border-current/10 mt-2">
            {/* Args */}
            {showArgs && args && (
              <div className="space-y-1">
                <span className="text-xs font-medium opacity-70">Input:</span>
                <pre className="text-xs bg-black/5 dark:bg-white/5 rounded p-2 overflow-x-auto">
                  <code>{JSON.stringify(args, null, 2)}</code>
                </pre>
              </div>
            )}

            {/* Result */}
            {showResult && result && (
              <div className="space-y-1">
                <span className="text-xs font-medium opacity-70">Output:</span>
                <pre className="text-xs bg-black/5 dark:bg-white/5 rounded p-2 overflow-x-auto">
                  <code>{JSON.stringify(result, null, 2)}</code>
                </pre>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="space-y-1">
                <span className="text-xs font-medium text-destructive">Error:</span>
                <p className="text-xs text-destructive/90">{error}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

ToolExpandableContent.displayName = 'ToolExpandableContent'
