'use client'

import { useState } from 'react'
import { Menu, X, PanelLeftClose, PanelLeft, GripVertical } from 'lucide-react'
import { Sidebar, type NavItem } from '@/components/Navigation/Sidebar'
import { TableOfContents } from '@/components/Enhanced/TableOfContents'
import { AutoPagination } from '@/components/Navigation/AutoPagination'
import { useSidebarState } from '@/components/Layout/hooks/useSidebarState'
import { useReducedMotion } from '@/components/Layout/hooks/useReducedMotion'
import clsx from 'clsx'

interface DocsLayoutProps {
  children: React.ReactNode
  navigation: NavItem[]
  tableOfContents?: {
    title: string
    id: string
    level: number
  }[]
}

/**
 * Skeleton loader shown during SSR hydration
 */
function DocsLayoutSkeleton() {
  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex py-8 relative">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <div className="p-6 space-y-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-bg-secondary rounded-lg animate-pulse"
                style={{ width: `${60 + Math.random() * 40}%` }}
              />
            ))}
          </div>
        </aside>
        {/* Content skeleton */}
        <main className="flex-1 min-w-0 lg:ml-4">
          <article className="max-w-4xl mx-auto px-4 lg:px-8 space-y-4">
            <div className="h-10 bg-bg-secondary rounded-lg animate-pulse w-3/4" />
            <div className="h-6 bg-bg-secondary rounded-lg animate-pulse w-full" />
            <div className="h-6 bg-bg-secondary rounded-lg animate-pulse w-5/6" />
            <div className="h-6 bg-bg-secondary rounded-lg animate-pulse w-4/5" />
          </article>
        </main>
      </div>
    </div>
  )
}

export function DocsLayout({
  children,
  navigation,
}: DocsLayoutProps) {
  // Mobile sidebar state (separate from desktop)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Desktop sidebar state with all features
  const sidebar = useSidebarState({
    minWidth: 200,
    maxWidth: 400,
    defaultWidth: 280,
  })

  // Respect reduced motion preferences
  const prefersReducedMotion = useReducedMotion()

  // Show skeleton during SSR hydration to prevent flash
  if (!sidebar.isMounted) {
    return <DocsLayoutSkeleton />
  }

  // Animation classes based on motion preference
  const transitionClasses = prefersReducedMotion
    ? ''
    : 'transition-all duration-300 ease-in-out'

  const transformTransitionClasses = prefersReducedMotion
    ? ''
    : 'transition-transform duration-300 ease-in-out'

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex py-8 relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={clsx(
            'lg:hidden fixed bottom-4 right-4 z-50 p-4',
            'bg-brand-500 text-white rounded-full shadow-lg',
            'hover:bg-brand-600 active:scale-95',
            prefersReducedMotion ? '' : 'transition-all duration-200'
          )}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="docs-sidebar-mobile"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={sidebar.toggleVisibility}
          className={clsx(
            'hidden lg:flex items-center justify-center',
            'fixed top-20 z-50 p-2 rounded-lg',
            'bg-bg-secondary hover:bg-bg-tertiary border border-border',
            'text-text-secondary hover:text-text-primary',
            'shadow-sm hover:shadow-md',
            transitionClasses
          )}
          style={{
            left: sidebar.visible ? `${sidebar.width + 8}px` : '16px',
          }}
          aria-label={sidebar.visible ? 'Hide sidebar' : 'Show sidebar'}
          aria-expanded={sidebar.visible}
          aria-controls="docs-sidebar"
          title={`${sidebar.visible ? 'Hide' : 'Show'} sidebar (⌘B)`}
        >
          {sidebar.visible ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeft className="w-5 h-5" />
          )}
        </button>

        {/* Desktop Sidebar */}
        <aside
          id="docs-sidebar"
          className={clsx(
            'hidden lg:block',
            'sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto',
            'bg-bg-primary',
            transformTransitionClasses,
            !sidebar.visible && 'lg:w-0 lg:opacity-0 lg:overflow-hidden'
          )}
          style={{
            width: sidebar.visible ? `${sidebar.width}px` : 0,
            minWidth: sidebar.visible ? `${sidebar.width}px` : 0,
          }}
          aria-hidden={!sidebar.visible}
          inert={!sidebar.visible ? true : undefined}
        >
          <div className="p-6 pr-2">
            <Sidebar navigation={navigation} />
          </div>
        </aside>

        {/* Resize Handle - Always visible with subtle indicator */}
        {sidebar.visible && (
          <div
            onMouseDown={sidebar.startResize}
            onTouchStart={sidebar.startResize}
            onKeyDown={sidebar.handleKeyboardResize}
            className={clsx(
              'hidden lg:flex flex-col items-center justify-center',
              'sticky top-16 h-[calc(100vh-4rem)] w-4 -ml-2',
              'cursor-col-resize group z-10',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
            )}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar. Use left/right arrows to adjust, Shift for larger steps, Home/End for min/max."
            aria-valuenow={sidebar.width}
            aria-valuemin={200}
            aria-valuemax={400}
            tabIndex={0}
          >
            {/* Visible resize indicator */}
            <div
              className={clsx(
                'flex flex-col items-center justify-center gap-0.5',
                'w-3 h-12 rounded-full',
                prefersReducedMotion ? '' : 'transition-all duration-150',
                sidebar.isResizing
                  ? 'bg-brand-500 scale-110'
                  : 'bg-border/60 group-hover:bg-brand-400 group-hover:scale-105'
              )}
            >
              <GripVertical
                className={clsx(
                  'w-3 h-3',
                  sidebar.isResizing
                    ? 'text-white'
                    : 'text-text-tertiary group-hover:text-white'
                )}
              />
            </div>
            {/* Tooltip */}
            <div
              className={clsx(
                'absolute top-1/2 left-6 -translate-y-1/2',
                'px-2 py-1 rounded text-xs whitespace-nowrap',
                'bg-gray-900 text-white',
                'opacity-0 group-hover:opacity-100 pointer-events-none',
                prefersReducedMotion ? '' : 'transition-opacity duration-150'
              )}
            >
              Drag to resize
            </div>
          </div>
        )}

        {/* Mobile Sidebar (Overlay) */}
        <aside
          id="docs-sidebar-mobile"
          className={clsx(
            'lg:hidden fixed top-16 left-0 z-40',
            'h-[calc(100vh-4rem)] w-72 overflow-y-auto',
            'bg-bg-primary border-r border-border',
            transformTransitionClasses,
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          aria-hidden={!mobileOpen}
          inert={!mobileOpen ? true : undefined}
        >
          <div className="p-6">
            <Sidebar navigation={navigation} />
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileOpen && (
          <div
            className={clsx(
              'lg:hidden fixed inset-0 z-30 bg-black/50',
              prefersReducedMotion ? '' : 'animate-fade-in'
            )}
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main
          className={clsx(
            'flex-1 min-w-0',
            transitionClasses
          )}
        >
          <article className="prose prose-lg dark:prose-invert max-w-none lg:max-w-4xl xl:max-w-5xl mx-auto px-4 lg:px-8">
            {children}

            {/* Next/Previous Navigation */}
            <AutoPagination />
          </article>
        </main>

        {/* Table of Contents */}
        <TableOfContents />
      </div>
    </div>
  )
}
