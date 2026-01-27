/**
 * ChatLayout - Mid-level component for custom chat layouts
 *
 * Building block component that provides layout structure for chat UIs.
 * Use this when you need custom layouts but want the structure handled.
 *
 * @example
 * ```tsx
 * <ChatLayout
 *   sidebar={<RAGContext />}
 *   header={<SessionHeader />}
 *   footer={<TokenCounter />}
 * >
 *   <ChatWindow {...chat} />
 * </ChatLayout>
 * ```
 */

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

/**
 * Props for ChatLayout
 */
export interface ChatLayoutProps {
  /** Main chat content */
  children: React.ReactNode
  /** Optional sidebar */
  sidebar?: React.ReactNode
  /** Optional header */
  header?: React.ReactNode
  /** Optional footer */
  footer?: React.ReactNode
  /** Layout variant */
  variant?: 'default' | 'split' | 'full'
  /** Custom className */
  className?: string
}

/**
 * ChatLayout - Mid-level layout component
 *
 * Provides flexible layout structure for chat UIs with optional
 * sidebar, header, and footer sections.
 */
export function ChatLayout({
  children,
  sidebar,
  header,
  footer,
  variant = 'default',
  className,
}: ChatLayoutProps) {
  const hasSidebar = !!sidebar
  const hasHeader = !!header
  const hasFooter = !!footer

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        variant === 'split' && hasSidebar && 'flex-row',
        className
      )}
    >
      {hasHeader && (
        <header className="flex-shrink-0 border-b border-border">
          {header}
        </header>
      )}

      <div
        className={cn(
          'flex flex-1 overflow-hidden',
          variant === 'split' && hasSidebar && 'flex-row'
        )}
      >
        {hasSidebar && (
          <aside
            className={cn(
              'flex-shrink-0 border-r border-border',
              variant === 'split' ? 'w-80' : 'w-64'
            )}
          >
            {sidebar}
          </aside>
        )}

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>

      {hasFooter && (
        <footer className="flex-shrink-0 border-t border-border">
          {footer}
        </footer>
      )}
    </div>
  )
}

ChatLayout.displayName = 'ChatLayout'
