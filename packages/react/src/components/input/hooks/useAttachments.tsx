/**
 * useAttachments Hook
 *
 * Manages attachment button rendering and interaction for PillChatInput.
 * Handles both custom left slot and default attachment button.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface UseAttachmentsOptions {
  /** Custom left slot element */
  leftSlot?: React.ReactNode
  /** Attachment click handler */
  onAttach?: () => void
  /** Button size classes */
  buttonClasses: string
  /** Icon size in pixels */
  iconSize: number
}

export interface UseAttachmentsReturn {
  /** Whether to show attachment UI */
  showAttachment: boolean
  /** Rendered attachment element */
  renderAttachment: () => React.ReactNode
}

/**
 * Hook for managing attachment button in chat input
 */
export function useAttachments({
  leftSlot,
  onAttach,
  buttonClasses,
  iconSize,
}: UseAttachmentsOptions): UseAttachmentsReturn {
  const showAttachment = Boolean(leftSlot || onAttach)

  const renderAttachment = React.useCallback((): React.ReactNode => {
    if (!showAttachment) return null

    return (
      <div className="flex-shrink-0 pb-0.5">
        {leftSlot || (
          <button
            type="button"
            onClick={onAttach}
            className={cn(
              'flex items-center justify-center rounded-full',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-muted/50 transition-colors',
              buttonClasses
            )}
            aria-label="Attach file"
          >
            <AttachIcon size={iconSize} />
          </button>
        )}
      </div>
    )
  }, [leftSlot, onAttach, buttonClasses, iconSize, showAttachment])

  return {
    showAttachment,
    renderAttachment,
  }
}

// Inline icon component (kept with hook for co-location)
const AttachIcon = React.memo(function AttachIcon({
  size = 18,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
})

AttachIcon.displayName = 'AttachIcon'
