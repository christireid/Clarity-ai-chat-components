/**
 * Icon components for Think component
 * @packageDocumentation
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

/**
 * Brain/thinking icon
 */
export const BrainIcon = React.memo(function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
    </svg>
  )
})

BrainIcon.displayName = 'BrainIcon'

/**
 * Chevron icon for expand/collapse
 */
export const ChevronIcon = React.memo(function ChevronIcon({
  expanded,
  className,
}: {
  expanded: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'reasoning-chevron transition-transform',
        className
      )}
      data-open={expanded}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
})

ChevronIcon.displayName = 'ChevronIcon'
