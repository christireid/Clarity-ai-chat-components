import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'

export interface MarkdownCodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
  [key: string]: unknown
}

/**
 * Code block component for markdown rendering
 * Extracted from Message component for better organization
 */
export const MarkdownCodeBlock = React.memo<MarkdownCodeBlockProps>(
  ({ inline, className, children, ...rest }) => {
    if (inline) {
      return (
        <code className="bg-muted px-1 py-0.5 rounded text-sm" {...rest}>
          {children}
        </code>
      )
    }

    return (
      <div className="relative group/code">
        <pre className={cn('relative', className)}>
          <code {...rest}>{children}</code>
        </pre>
        <CopyButton
          text={String(children).replace(/\n$/, '')}
          className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity"
        />
      </div>
    )
  }
)

MarkdownCodeBlock.displayName = 'MarkdownCodeBlock'
