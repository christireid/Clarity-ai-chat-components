'use client'

/**
 * CodeBlockCopyButton Component
 *
 * A specialized copy button for code blocks. This is a thin wrapper around
 * the main CopyButton component with code-block-specific defaults.
 *
 * For the full-featured copy button, use CopyButton from '../message/copy-button'.
 *
 * @example
 * ```tsx
 * <CodeBlockCopyButton
 *   content={codeString}
 *   onCopy={() => console.log('Copied!')}
 * />
 * ```
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { CopyButton, type CopyButtonProps } from '../message/copy-button'

/**
 * CodeBlockCopyButton Component Props
 */
export interface CodeBlockCopyButtonProps {
  /** Content to copy to clipboard */
  content: string
  /** Callback when copy succeeds */
  onCopy?: () => void
  /** Callback when copy fails */
  onError?: (error: Error) => void
  /** Additional CSS class */
  className?: string
  /** Accessible label */
  'aria-label'?: string
  /** Whether the button is disabled */
  disabled?: boolean
}

/**
 * CodeBlockCopyButton - Specialized copy button for code blocks
 *
 * This is a convenience wrapper around the main CopyButton component,
 * pre-configured for code block usage with icon-only mode and
 * appropriate styling.
 *
 * Features:
 * - Smooth icon transition (copy → checkmark)
 * - Spring-based animations
 * - Respects prefers-reduced-motion
 * - Screen reader friendly
 *
 * @see CopyButton for the full-featured copy button
 */
export const CodeBlockCopyButton = React.memo<CodeBlockCopyButtonProps>(
  function CodeBlockCopyButton({
    content,
    onCopy,
    onError,
    className,
    'aria-label': ariaLabel = 'Copy code to clipboard',
    disabled = false,
  }) {
    return (
      <CopyButton
        text={content}
        onCopy={onCopy}
        onCopyError={onError}
        iconOnly
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          'p-2 rounded-md',
          'hover:bg-muted/80',
          'text-muted-foreground hover:text-foreground',
          className
        )}
      />
    )
  }
)

CodeBlockCopyButton.displayName = 'CodeBlockCopyButton'

export default CodeBlockCopyButton
