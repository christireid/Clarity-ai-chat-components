'use client'

/**
 * PromptEditor Component
 *
 * A labeled editor section with syntax-highlighted textarea and token count.
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { HighlightedTextarea } from './HighlightedTextarea'

export interface PromptEditorProps {
  /** Editor label */
  label: string
  /** Current value */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Token count for this editor */
  tokenCount: number
  /** Placeholder text */
  placeholder?: string
  /** Minimum height */
  minHeight?: number
  /** Maximum height */
  maxHeight?: number
  /** Whether the editor is disabled */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

/**
 * Prompt editor with label and token count
 */
export const PromptEditor = React.memo(function PromptEditor({
  label,
  value,
  onChange,
  tokenCount,
  placeholder,
  minHeight = 120,
  maxHeight = 300,
  disabled = false,
  className,
}: PromptEditorProps) {
  const editorId = React.useId()

  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={editorId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <span className="text-xs font-mono text-muted-foreground">
          ~{tokenCount.toLocaleString()} tokens
        </span>
      </div>

      {/* Editor */}
      <div
        className={cn(
          'rounded-lg border border-border bg-muted/30',
          'transition-colors duration-200',
          'hover:border-border/80',
          'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20'
        )}
      >
        <HighlightedTextarea
          id={editorId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minHeight={minHeight}
          maxHeight={maxHeight}
          disabled={disabled}
          ariaLabel={label}
          className="border-0 focus-within:ring-0"
        />
      </div>

      {/* Help text */}
      <p className="text-xs text-muted-foreground">
        Use{' '}
        <code className="px-1 py-0.5 bg-muted rounded text-cyan-600 dark:text-cyan-400">
          {'{{ variable }}'}
        </code>{' '}
        syntax for dynamic values
      </p>
    </div>
  )
})

export default PromptEditor
