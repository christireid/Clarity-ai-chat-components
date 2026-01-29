'use client'

/**
 * ToolCard Component
 *
 * Lightweight, color-coded tool execution indicator inspired by prompt-kit's
 * Tool component. Uses CSS classes from globals.css for consistent styling.
 *
 * This is a simpler alternative to ToolExecutionCard when you need a compact
 * inline display without collapsible sections.
 *
 * @example
 * ```tsx
 * // Pending state
 * <ToolCard name="web_search" status="pending" />
 *
 * // Running with args
 * <ToolCard
 *   name="code_interpreter"
 *   status="running"
 *   args={{ code: "print('hello')" }}
 * />
 *
 * // Success with result
 * <ToolCard
 *   name="calculator"
 *   status="success"
 *   result={{ answer: 42 }}
 * />
 *
 * // Error state
 * <ToolCard
 *   name="api_call"
 *   status="error"
 *   error="Request timeout"
 * />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../../animations/constants'
import { ToolStatusIndicator } from './ToolStatusIndicator'
import { ToolMetadata } from './ToolMetadata'
import { ToolExpandableContent } from './ToolExpandableContent'
import { SIZE_CONFIG, STATUS_CSS_CLASSES, STATUS_LABELS } from './constants'
import type { ToolCardProps } from './types'

/**
 * ToolCard - Lightweight color-coded tool indicator
 *
 * A compact component for displaying tool execution status with
 * color-coded states. Uses CSS classes from globals.css.
 */
export function ToolCard({
  name,
  status,
  args,
  result,
  error,
  size = 'md',
  showArgs = false,
  showResult = false,
  duration,
  icon,
  className,
  disableAnimations = false,
  onClick,
  onToggleExpand,
  expanded = false,
}: ToolCardProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const sizeConfig = SIZE_CONFIG[size]

  const isInteractive = !!onClick || !!onToggleExpand
  const hasExpandableContent = (showArgs && !!args) || (showResult && !!result) || !!error

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        'tool-card',
        STATUS_CSS_CLASSES[status],
        sizeConfig.container,
        isInteractive && 'cursor-pointer',
        className
      )}
      onClick={onClick || (hasExpandableContent ? onToggleExpand : undefined)}
      role={isInteractive ? 'button' : 'article'}
      aria-label={`Tool: ${name}, Status: ${STATUS_LABELS[status]}`}
      aria-expanded={hasExpandableContent ? expanded : undefined}
    >
      {/* Main row */}
      <div className="flex items-center gap-2 min-w-0">
        <ToolStatusIndicator
          status={status}
          sizeConfig={sizeConfig}
          icon={icon}
          name={name}
        />

        <ToolMetadata
          duration={duration}
          size={size}
          sizeConfig={sizeConfig}
          hasExpandableContent={hasExpandableContent}
          expanded={expanded}
          onToggleExpand={onToggleExpand}
        />
      </div>

      {/* Expandable content */}
      <ToolExpandableContent
        expanded={expanded}
        hasContent={hasExpandableContent}
        showArgs={showArgs}
        args={args}
        showResult={showResult}
        result={result}
        error={error}
        prefersReducedMotion={prefersReducedMotion}
      />
    </motion.div>
  )
}

ToolCard.displayName = 'ToolCard'
