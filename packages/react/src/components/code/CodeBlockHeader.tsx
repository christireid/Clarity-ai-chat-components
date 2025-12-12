'use client'

import * as React from 'react'
import { cn } from '../../utils/cn'
import { getLanguageDisplayName } from './utils'

/**
 * CodeBlockHeader Component Props
 */
export interface CodeBlockHeaderProps {
  /** Title or filename to display */
  title?: string
  /** Programming language */
  language?: string
  /** Show language badge */
  showLanguageBadge?: boolean
  /** Custom actions to render on the right side */
  actions?: React.ReactNode
  /** Additional CSS class */
  className?: string
  /** Children (typically copy button) */
  children?: React.ReactNode
}

/**
 * CodeBlockHeader Component
 *
 * Header bar for code blocks displaying title, language badge, and actions.
 *
 * @example
 * ```tsx
 * <CodeBlockHeader
 *   title="example.ts"
 *   language="typescript"
 *   showLanguageBadge
 * >
 *   <CopyButton text={code} />
 * </CodeBlockHeader>
 * ```
 */
export const CodeBlockHeader = React.memo<CodeBlockHeaderProps>(
  function CodeBlockHeader({
    title,
    language,
    showLanguageBadge = true,
    actions,
    className,
    children,
  }) {
    const displayLanguage =
      language && language !== 'text' && language !== 'plaintext'

    // Don't render if there's nothing to show
    if (!title && !displayLanguage && !actions && !children) {
      return null
    }

    return (
      <div
        className={cn(
          'flex items-center justify-between',
          'px-4 py-2',
          'border-b border-border/50',
          'bg-muted/30',
          className
        )}
      >
        {/* Left side: Title and Language Badge */}
        <div className="flex items-center gap-2 min-w-0">
          {title && (
            <span
              className={cn(
                'text-sm font-medium text-muted-foreground',
                'truncate max-w-[200px]'
              )}
              title={title}
            >
              {title}
            </span>
          )}
          {showLanguageBadge && displayLanguage && (
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded',
                'bg-muted text-muted-foreground',
                'font-mono uppercase tracking-wide'
              )}
            >
              {getLanguageDisplayName(language)}
            </span>
          )}
        </div>

        {/* Right side: Actions and Children */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          {children}
        </div>
      </div>
    )
  }
)

CodeBlockHeader.displayName = 'CodeBlockHeader'

export default CodeBlockHeader
