'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, PanelLeftClose, PanelLeft, GripVertical } from 'lucide-react'
import { Sidebar, type NavItem } from '@/components/Navigation/Sidebar'
import { TableOfContents } from '@/components/Enhanced/TableOfContents'
import { AutoPagination } from '@/components/Navigation/AutoPagination'
import { useSidebarState } from '@/components/Layout/hooks/useSidebarState'
import { useReducedMotion } from '@/components/Layout/hooks/useReducedMotion'
import clsx from 'clsx'

// Animation constants for consistency (300ms)
const ANIMATION_DURATION_MS = 300

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
  const pathname = usePathname()

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

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Handle mobile sidebar close (for navigation callback)
  const handleMobileClose = useCallback(() => {
    setMobileOpen(false)
  }, [])

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

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
        {/* Mobile Sidebar Toggle - Floating action button with glassmorphism */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={clsx(
            'lg:hidden fixed bottom-6 right-6 z-50 p-4',
            // Glassmorphism styling with brand accent
            'bg-brand-500/90 backdrop-blur-md text-white rounded-2xl',
            'shadow-lg shadow-brand-500/25',
            'hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30',
            'active:scale-95',
            prefersReducedMotion ? '' : 'transition-all duration-200'
          )}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="docs-sidebar-mobile"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Sidebar Toggle - Positioned at left edge when collapsed, near sidebar when visible */}
        <button
          onClick={sidebar.toggleVisibility}
          className={clsx(
            'hidden lg:flex items-center justify-center',
            'fixed top-20 z-40 p-2.5 rounded-xl',
            // Glassmorphism styling
            'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md',
            'border border-slate-200/50 dark:border-slate-700/50',
            'text-slate-600 dark:text-slate-400',
            'hover:text-slate-900 dark:hover:text-slate-100',
            'hover:bg-white dark:hover:bg-slate-800',
            'shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20',
            'hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30',
            transitionClasses
          )}
          style={{
            left: sidebar.visible ? `${Math.min(sidebar.width + 24, 320)}px` : '24px',
          }}
          aria-label={sidebar.visible ? 'Hide sidebar' : 'Show sidebar'}
          aria-expanded={sidebar.visible}
          aria-controls="docs-sidebar"
          title={`${sidebar.visible ? 'Hide' : 'Show'} sidebar (Cmd+B)`}
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

        {/* Mobile Sidebar (Overlay) - Glassmorphism styling with swipe support */}
        <aside
          id="docs-sidebar-mobile"
          className={clsx(
            'lg:hidden fixed top-16 left-0 z-40',
            'h-[calc(100vh-4rem)] w-80 max-w-[85vw] overflow-y-auto overflow-x-hidden',
            'bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl',
            'border-r border-slate-200/50 dark:border-slate-700/50',
            'shadow-2xl shadow-slate-900/10 dark:shadow-slate-900/30',
            // Smooth 300ms slide transition
            transformTransitionClasses,
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          aria-hidden={!mobileOpen}
          inert={!mobileOpen ? true : undefined}
          // Touch swipe handling via CSS touch-action
          style={{ touchAction: 'pan-y' }}
        >
          {/* Close button inside mobile sidebar for easy access */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
            <span className="font-semibold text-text-primary">Navigation</span>
            <button
              onClick={handleMobileClose}
              className={clsx(
                'p-2 rounded-lg',
                'text-text-secondary hover:text-text-primary',
                'hover:bg-bg-secondary dark:hover:bg-slate-800',
                'transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
              )}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <Sidebar navigation={navigation} onNavigate={handleMobileClose} />
          </div>
        </aside>

        {/* Mobile Backdrop - Blur effect with smooth transition */}
        <div
          className={clsx(
            'lg:hidden fixed inset-0 z-30',
            'bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-sm',
            // Smooth 300ms fade transition
            'transition-opacity duration-300 ease-in-out',
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
          onClick={handleMobileClose}
          aria-hidden="true"
          role="presentation"
        />

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
