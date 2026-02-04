'use client'

/**
 * Think Component
 *
 * Collapsible reasoning/thinking display panel inspired by Ant Design X's
 * Think component and the RICH paradigm (Reasoning, Insight, Content, Help).
 *
 * Shows AI's thought process in a collapsible panel with visual indicators
 * for thinking state, streaming content, and step-by-step reasoning.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Think content="Let me analyze this step by step..." />
 *
 * // Streaming with title
 * <Think
 *   title="Reasoning"
 *   content={streamingThought}
 *   isStreaming
 * />
 *
 * // Controlled expansion
 * <Think
 *   content="My thought process..."
 *   expanded={isExpanded}
 *   onExpandedChange={setIsExpanded}
 * />
 *
 * // With steps
 * <Think
 *   title="Analysis"
 *   steps={[
 *     { text: 'Understanding the query', status: 'complete' },
 *     { text: 'Searching knowledge base', status: 'active' },
 *     { text: 'Formulating response', status: 'pending' }
 *   ]}
 * />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { VARIANT_CONFIG } from './config'
import { ThinkHeader } from './ThinkHeader'
import { ThinkContent } from './ThinkContent'
import { getContentMotionProps } from './animations'
import type { ThinkProps } from './types'

/**
 * Think - Collapsible reasoning/thinking display
 *
 * A component for displaying AI's thought process in a clean,
 * collapsible panel. Supports streaming content, discrete steps,
 * and various visual variants.
 *
 * Following Ant Design X's RICH paradigm:
 * - Reasoning: Shows the AI's thought process
 * - Insight: Highlights key observations
 * - Content: Main response content
 * - Help: Suggestions and guidance
 */
export function Think({
  title = 'Thinking',
  content,
  steps,
  isStreaming = false,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  variant = 'default',
  collapsible = true,
  showIndicator = true,
  className,
  disableAnimations = false,
  icon,
  'aria-label': ariaLabel,
}: ThinkProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations

  // Expansion state management
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded)
  const isExpanded = controlledExpanded ?? internalExpanded

  // Toggle handler
  const toggleExpanded = React.useCallback(() => {
    const newValue = !isExpanded
    if (controlledExpanded === undefined) {
      setInternalExpanded(newValue)
    }
    onExpandedChange?.(newValue)
  }, [isExpanded, controlledExpanded, onExpandedChange])

  // Configuration and content checks
  const config = VARIANT_CONFIG[variant]
  const hasContent = Boolean(content || (steps && steps.length > 0))

  // Auto-expand effect when streaming starts
  React.useEffect(() => {
    if (isStreaming && !isExpanded && controlledExpanded === undefined) {
      setInternalExpanded(true)
      onExpandedChange?.(true)
    }
  }, [isStreaming, isExpanded, controlledExpanded, onExpandedChange])

  // Animation configuration
  const contentMotionProps = React.useMemo(
    () => getContentMotionProps(prefersReducedMotion),
    [prefersReducedMotion]
  )

  return (
    <div
      className={cn(config.container, className)}
      role="region"
      aria-label={ariaLabel || `${title} section`}
    >
      {/* Header */}
      <ThinkHeader
        config={config}
        collapsible={collapsible}
        toggleExpanded={toggleExpanded}
        isExpanded={isExpanded}
        title={title}
        icon={icon}
        isStreaming={isStreaming}
        showIndicator={showIndicator}
        prefersReducedMotion={prefersReducedMotion}
        hasContent={hasContent}
      />

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && hasContent && (
          <motion.div
            {...contentMotionProps}
            className="overflow-hidden"
          >
            <ThinkContent
              config={config}
              steps={steps}
              content={content}
              isStreaming={isStreaming}
              prefersReducedMotion={prefersReducedMotion}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Think.displayName = 'Think'
