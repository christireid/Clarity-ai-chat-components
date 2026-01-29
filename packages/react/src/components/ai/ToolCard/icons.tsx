/**
 * ToolCard Icons
 *
 * Icon components for ToolCard
 * @packageDocumentation
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import type { ToolCardStatus } from './types'

export const ToolIcon = React.memo(function ToolIcon({ className }: { className?: string }) {
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
})

ToolIcon.displayName = 'ToolIcon'

export const SpinnerIcon = React.memo(function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('animate-spin', className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
})

SpinnerIcon.displayName = 'SpinnerIcon'

export const CheckIcon = React.memo(function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
})

CheckIcon.displayName = 'CheckIcon'

export const XIcon = React.memo(function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
})

XIcon.displayName = 'XIcon'

export const ClockIcon = React.memo(function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
})

ClockIcon.displayName = 'ClockIcon'

export const ChevronIcon = React.memo(function ChevronIcon({
  expanded,
  className,
}: {
  expanded?: boolean
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
        'transition-transform',
        expanded && 'rotate-180',
        className
      )}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
})

ChevronIcon.displayName = 'ChevronIcon'

/**
 * Get status icon based on status
 */
export function getStatusIcon(status: ToolCardStatus, className?: string): React.ReactNode {
  switch (status) {
    case 'pending':
      return <ClockIcon className={className} />
    case 'running':
      return <SpinnerIcon className={className} />
    case 'success':
      return <CheckIcon className={className} />
    case 'error':
      return <XIcon className={className} />
    default:
      return <ToolIcon className={className} />
  }
}
