'use client'

/**
 * CopyButton Component
 *
 * A button that copies text to clipboard with visual feedback.
 */

import * as React from 'react'
import { cn } from '../../../../utils/cn'

export interface CopyButtonProps {
  /** Text to copy to clipboard */
  text: string
  /** Button label (shown in tooltip) */
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
 */
export function CopyButton({
  text,
  label = 'Copy to clipboard',
  size = 'sm',
  className,
  onCopy,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [text, onCopy])

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : label}
      title={copied ? 'Copied!' : label}
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        'text-muted-foreground hover:text-foreground',
        'hover:bg-muted transition-colors',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        size === 'sm' && 'h-7 w-7',
        size === 'md' && 'h-8 w-8',
        copied && 'text-green-500 dark:text-green-400',
        className
      )}
    >
      {copied ? (
        <svg
          width={size === 'sm' ? 14 : 16}
          height={size === 'sm' ? 14 : 16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width={size === 'sm' ? 14 : 16}
          height={size === 'sm' ? 14 : 16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}

export default CopyButton
