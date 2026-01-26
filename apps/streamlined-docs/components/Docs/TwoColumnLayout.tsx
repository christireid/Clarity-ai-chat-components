'use client'

/**
 * TwoColumnLayout - Sidebar + content layout for documentation
 *
 * Features:
 * - Responsive sidebar (drawer on mobile)
 * - Sticky sidebar
 * - Customizable widths
 * - Dark mode support
 * - Fully accessible
 */

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TwoColumnLayoutProps {
  /** Left sidebar content */
  sidebar: React.ReactNode
  /** Main content */
  children: React.ReactNode
  /** Right sidebar content (optional) */
  rightSidebar?: React.ReactNode
  /** Sidebar width (desktop) */
  sidebarWidth?: string
  /** Right sidebar width (desktop) */
  rightSidebarWidth?: string
  /** Make sidebar sticky */
  stickySidebar?: boolean
  /** Make right sidebar sticky */
  stickyRightSidebar?: boolean
  /** Additional CSS classes */
  className?: string
}

export function TwoColumnLayout({
  sidebar,
  children,
  rightSidebar,
  sidebarWidth = '16rem',
  rightSidebarWidth = '16rem',
  stickySidebar = true,
  stickyRightSidebar = true,
  className,
}: TwoColumnLayoutProps) {
  return (
    <div className={cn('flex min-h-screen', className)}>
      {/* Left sidebar */}
      <aside
        className={cn(
          'hidden lg:block shrink-0 border-r border-border/50 bg-background',
          stickySidebar && 'sticky top-0 h-screen overflow-y-auto'
        )}
        style={{ width: sidebarWidth }}
        aria-label="Primary navigation"
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">{children}</main>

      {/* Right sidebar (optional) */}
      {rightSidebar && (
        <aside
          className={cn(
            'hidden xl:block shrink-0 border-l border-border/50 bg-background',
            stickyRightSidebar && 'sticky top-0 h-screen overflow-y-auto'
          )}
          style={{ width: rightSidebarWidth }}
          aria-label="Secondary navigation"
        >
          {rightSidebar}
        </aside>
      )}
    </div>
  )
}

/**
 * ThreeColumnLayout - Sidebar + content + TOC layout
 */
export interface ThreeColumnLayoutProps {
  /** Left sidebar (navigation) */
  sidebar: React.ReactNode
  /** Main content */
  children: React.ReactNode
  /** Right sidebar (table of contents) */
  tableOfContents: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

export function ThreeColumnLayout({
  sidebar,
  children,
  tableOfContents,
  className,
}: ThreeColumnLayoutProps) {
  return (
    <TwoColumnLayout
      sidebar={sidebar}
      rightSidebar={tableOfContents}
      sidebarWidth="16rem"
      rightSidebarWidth="16rem"
      className={className}
    >
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </TwoColumnLayout>
  )
}
