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

    return (
      <div
        className={cn(
          'flex items-center justify-between',
          'px-4 py-2.5',
          'border-b border-[#1e293b]',
          'bg-[#0b2942]',
          'select-none',
          className
        )}
      >
        {/* Left side: Window Controls, Title and Language Badge */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mac-style Window Controls */}
          <div
            className="flex items-center gap-1.5 opacity-75 hover:opacity-100 transition-opacity flex-shrink-0"
            aria-hidden="true"
          >
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            {title && (
              <span
                className={cn('text-sm font-medium text-white', 'truncate')}
                title={title}
              >
                {title}
              </span>
            )}
            {showLanguageBadge && displayLanguage && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider opacity-70',
                  'bg-[#1e293b] text-[#d6deeb]'
                )}
              >
                {getLanguageDisplayName(language)}
              </span>
            )}
          </div>
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
