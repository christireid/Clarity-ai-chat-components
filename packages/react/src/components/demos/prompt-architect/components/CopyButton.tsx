'use client'

import { logger } from '@clarity-chat/utils/logger'

/**
 * CopyButton Component (PromptArchitect)
 *
 * A thin wrapper around the main CopyButton component with
 * PromptArchitect-specific styling defaults.
 *
 * @see {@link ../../../../components/message/copy-button.tsx} for the full implementation
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { CopyButton as BaseCopyButton } from '../../../message/copy-button'

export interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string
  /** Button label (shown in aria-label) */
  label?: string
  /** Size variant */
  size?: 'sm' | 'md'
  /** Additional class name */
  className?: string
  /** Callback after successful copy */
  onCopy?: () => void
}

/**
 * Copy to clipboard button with visual feedback
 *
 * This is a convenience wrapper around the main CopyButton component,
 * pre-configured for PromptArchitect usage.
 */
export function CopyButton({
  text,
  label = 'Copy to clipboard',
  size = 'sm',
  className,
  onCopy,
}: CopyButtonProps) {
  return (
    <BaseCopyButton
      text={text}
      onCopy={onCopy}
      iconOnly
      aria-label={label}
      className={cn(
        'rounded-md',
        'text-muted-foreground hover:text-foreground',
        'hover:bg-muted',
        size === 'sm' && 'h-7 w-7 p-1.5',
        size === 'md' && 'h-8 w-8 p-2',
        className
      )}
    />
  )
}

export default CopyButton
