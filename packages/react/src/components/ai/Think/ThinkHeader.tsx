/**
 * Header component for Think component
 * @packageDocumentation
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { BrainIcon, ChevronIcon } from './icons'
import { ThinkingIndicator } from './ThinkingIndicator'
import { handleKeyDown } from './utils'
import { getIconAnimationProps } from './animations'

/**
 * Props for ThinkHeader component
 */
interface ThinkHeaderProps {
  config: { header: string }
  collapsible: boolean
  toggleExpanded: () => void
  isExpanded: boolean
  title: string
  icon?: React.ReactNode
  isStreaming: boolean
  showIndicator: boolean
  prefersReducedMotion: boolean
  hasContent: boolean
}

/**
 * Header component for Think panel
 */
export const ThinkHeader = React.memo(function ThinkHeader({
  config,
  collapsible,
  toggleExpanded,
  isExpanded,
  title,
  icon,
  isStreaming,
  showIndicator,
  prefersReducedMotion,
  hasContent,
}: ThinkHeaderProps) {
  const handleKeyboardEvent = React.useCallback(
    (e: React.KeyboardEvent) => {
      handleKeyDown(e, toggleExpanded)
    },
    [toggleExpanded]
  )

  const iconAnimationProps = getIconAnimationProps(isStreaming, prefersReducedMotion)

  return (
    <div
      className={config.header}
      onClick={collapsible ? toggleExpanded : undefined}
      role={collapsible ? 'button' : undefined}
      aria-expanded={collapsible ? isExpanded : undefined}
      tabIndex={collapsible ? 0 : undefined}
      onKeyDown={collapsible ? handleKeyboardEvent : undefined}
    >
      <div className="reasoning-title">
        {/* Icon */}
        <motion.span
          {...iconAnimationProps}
          className="w-4 h-4"
        >
          {icon || <BrainIcon className="w-full h-full" />}
        </motion.span>

        {/* Title */}
        <span>{title}</span>

        {/* Streaming indicator */}
        {isStreaming && showIndicator && (
          <ThinkingIndicator prefersReducedMotion={prefersReducedMotion} />
        )}
      </div>

      {/* Expand/collapse chevron */}
      {collapsible && hasContent && (
        <ChevronIcon expanded={isExpanded} className="w-4 h-4" />
      )}
    </div>
  )
})

ThinkHeader.displayName = 'ThinkHeader'
