'use client'

import * as React from 'react'
import { cn } from '../../utils/cn'
import { useAnalytics, useInteractionTracking } from '../../utils/analytics'

/**
 * InlineCode component for inline code snippets
 *
 * Features:
 * - Night Owl theming (consistent with CodeBlock)
 * - Keyboard accessible
 * - Copy functionality on click
 * - Accessible feedback
 */
export interface InlineCodeProps {
  /** The code content to display */
  children: string
  /** Additional CSS class */
  className?: string
  /** Enable copy functionality */
  enableCopy?: boolean
  /** Callback when code is copied */
  onCopy?: () => void
}

export const InlineCode = React.memo<InlineCodeProps>(function InlineCode({
  children,
  className,
  enableCopy = false,
  onCopy,
}) {
  const [copied, setCopied] = React.useState(false)
  const { trackInteraction } = useAnalytics('InlineCode')
  const { trackClick } = useInteractionTracking('InlineCode')

  const codeText = React.useMemo(() => {
    return typeof children === 'string' ? children.trim() : String(children).trim()
  }, [children])

  const handleClick = React.useCallback(async () => {
    if (!enableCopy) return

    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      onCopy?.()
      trackInteraction('copy', { content: codeText })

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy inline code:', error)
    }
  }, [enableCopy, codeText, onCopy, trackInteraction])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }, [handleClick])

  return (
    <code
      className={cn(
        // Night Owl background and foreground
        'bg-[#011627] text-[#d6deeb]',
        // Border and padding
        'rounded border border-white/[0.08] px-1.5 py-0.5',
        // Font styling
        'font-mono text-sm font-medium',
        // Interactive states (only when copy is enabled)
        enableCopy && [
          'cursor-pointer transition-colors duration-200',
          'hover:bg-[#011627]/80 hover:border-white/[0.12]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
        ],
        className
      )}
      onClick={enableCopy ? handleClick : undefined}
      onKeyDown={enableCopy ? handleKeyDown : undefined}
      tabIndex={enableCopy ? 0 : undefined}
      role={enableCopy ? 'button' : undefined}
      aria-label={enableCopy ? `Copy code: ${codeText}` : undefined}
      title={enableCopy ? 'Click to copy code' : undefined}
    >
      {codeText}
      {enableCopy && copied && (
        <span
          className="ml-2 text-green-400"
          aria-live="polite"
          aria-label="Code copied to clipboard"
        >
          ✓
        </span>
      )}
    </code>
  )
})

InlineCode.displayName = 'InlineCode'