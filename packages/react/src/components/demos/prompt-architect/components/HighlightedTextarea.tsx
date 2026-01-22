'use client'

/**
 * HighlightedTextarea Component
 *
 * A textarea with syntax highlighting for {{ variables }}.
 * Uses overlay technique: hidden textarea for input + visible div for display.
 */

import * as React from 'react'
import { cn } from '../../../../utils/cn'
import { getTemplateSegments } from '../utils/variable-parser'

export interface HighlightedTextareaProps {
  /** Current value */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Minimum height in pixels */
  minHeight?: number
  /** Maximum height in pixels */
  maxHeight?: number
  /** Whether the textarea is disabled */
  disabled?: boolean
  /** Additional class name */
  className?: string
  /** ID for the textarea */
  id?: string
  /** Aria label */
  ariaLabel?: string
}

/**
 * Textarea with syntax highlighting for template variables
 */
export function HighlightedTextarea({
  value,
  onChange,
  placeholder,
  minHeight = 120,
  maxHeight = 400,
  disabled = false,
  className,
  id,
  ariaLabel,
}: HighlightedTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const highlightRef = React.useRef<HTMLDivElement>(null)

  // Sync scroll between textarea and highlight overlay
  const handleScroll = React.useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }, [])

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
    }
  }, [value, minHeight, maxHeight])

  // Render highlighted content
  const highlightedContent = React.useMemo(() => {
    if (!value) return null

    const segments = getTemplateSegments(value)

    return segments.map((segment, index) => {
      if (segment.type === 'variable') {
        return (
          <span
            key={index}
            className="text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 rounded px-0.5"
          >
            {segment.content}
          </span>
        )
      }
      return <span key={index}>{segment.content}</span>
    })
  }, [value])

  return (
    <div className={cn('relative', className)}>
      {/* Highlight overlay (visual display) */}
      <div
        ref={highlightRef}
        className={cn(
          'absolute inset-0 pointer-events-none overflow-hidden',
          'whitespace-pre-wrap break-words',
          'font-mono text-sm leading-relaxed',
          'p-3 text-foreground',
          // Match textarea styling exactly
          'border border-transparent rounded-lg'
        )}
        style={{
          minHeight,
          maxHeight,
        }}
        aria-hidden="true"
      >
        {highlightedContent}
        {/* Placeholder when empty */}
        {!value && placeholder && (
          <span className="text-muted-foreground/70">{placeholder}</span>
        )}
      </div>

      {/* Actual textarea (handles input) */}
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder=""
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          'relative w-full resize-none',
          'font-mono text-sm leading-relaxed',
          'p-3 rounded-lg',
          'bg-transparent text-transparent caret-foreground',
          'border border-border',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
        style={{
          minHeight,
          maxHeight,
          // Ensure the textarea text is invisible but caret is visible
          WebkitTextFillColor: 'transparent',
        }}
      />
    </div>
  )
}

export default HighlightedTextarea
