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
  /** Show traffic light buttons (macOS window chrome style) */
  showWindowChrome?: boolean
}

/**
 * Traffic light window controls - macOS style
 */
function WindowControls() {
  return (
    <div className="flex items-center gap-2 mr-4 shrink-0" aria-hidden="true">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: '#FF5F57', boxShadow: 'inset 0 -1px 1px rgba(0,0,0,0.2)' }}
      />
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: '#FEBC2E', boxShadow: 'inset 0 -1px 1px rgba(0,0,0,0.2)' }}
      />
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: '#28C840', boxShadow: 'inset 0 -1px 1px rgba(0,0,0,0.2)' }}
      />
    </div>
  )
}

/**
 * CodeBlockHeader Component
 *
 * Premium header bar for code blocks with macOS-style window chrome.
 * Features traffic light buttons, title, language badge, and actions.
 *
 * @example
 * ```tsx
 * <CodeBlockHeader
 *   title="example.ts"
 *   language="typescript"
 *   showLanguageBadge
 *   showWindowChrome
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
    showWindowChrome = true,
    actions,
    className,
    children,
  }) {
    const displayLanguage =
      language && language !== 'text' && language !== 'plaintext'

    // Always render header with window chrome for premium look
    const hasContent = title || displayLanguage || actions || children

    return (
      <div
        className={cn(
          'flex items-center justify-between',
          'px-3 py-2.5',
          'border-b border-white/[0.06]',
          'bg-[#011627]/80 dark:bg-[#011627]',
          'backdrop-blur-sm',
          className
        )}
      >
        {/* Left side: Window Controls, Title and Language Badge */}
        <div className="flex items-center gap-2 min-w-0">
          {showWindowChrome && <WindowControls />}
          {title && (
            <span
              className={cn(
                'text-[13px] font-medium text-neutral-400',
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
                'text-[10px] px-1.5 py-0.5 rounded',
                'bg-white/[0.06] text-neutral-500',
                'font-mono uppercase tracking-wider'
              )}
            >
              {getLanguageDisplayName(language)}
            </span>
          )}
        </div>

        {/* Right side: Actions and Children */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {actions}
          {children}
        </div>
      </div>
    )
  }
)

CodeBlockHeader.displayName = 'CodeBlockHeader'

export default CodeBlockHeader
