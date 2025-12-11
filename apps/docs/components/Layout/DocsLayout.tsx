'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Menu, X, PanelLeftClose, PanelLeft, GripVertical } from 'lucide-react'
import { Sidebar, type NavItem } from '@/components/Navigation/Sidebar'
import { TableOfContents } from '@/components/Enhanced/TableOfContents'
import { AutoPagination } from '@/components/Navigation/AutoPagination'
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

const SIDEBAR_MIN_WIDTH = 200
const SIDEBAR_MAX_WIDTH = 400
const SIDEBAR_DEFAULT_WIDTH = 280

export function DocsLayout({
  children,
  navigation,
  tableOfContents,
}: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile state
  const [sidebarVisible, setSidebarVisible] = useState(true) // Desktop collapse state
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)

  // Load persisted state from localStorage
  useEffect(() => {
    const savedVisible = localStorage.getItem('docs-sidebar-visible')
    const savedWidth = localStorage.getItem('docs-sidebar-width')

    if (savedVisible !== null) {
      setSidebarVisible(savedVisible === 'true')
    }
    if (savedWidth !== null) {
      const width = parseInt(savedWidth, 10)
      if (width >= SIDEBAR_MIN_WIDTH && width <= SIDEBAR_MAX_WIDTH) {
        setSidebarWidth(width)
      }
    }
  }, [])

  // Persist sidebar visibility
  useEffect(() => {
    localStorage.setItem('docs-sidebar-visible', String(sidebarVisible))
  }, [sidebarVisible])

  // Persist sidebar width
  useEffect(() => {
    localStorage.setItem('docs-sidebar-width', String(sidebarWidth))
  }, [sidebarWidth])

  // Handle resize drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = e.clientX
      if (newWidth >= SIDEBAR_MIN_WIDTH && newWidth <= SIDEBAR_MAX_WIDTH) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setSidebarVisible((v) => !v)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex py-8 relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 p-4 bg-brand-500 text-white rounded-full shadow-lg hover:bg-brand-600 transition-colors"
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={() => setSidebarVisible(!sidebarVisible)}
          className={clsx(
            'hidden lg:flex items-center justify-center',
            'fixed top-20 z-50 p-2 rounded-lg',
            'bg-bg-secondary hover:bg-bg-tertiary border border-border',
            'text-text-secondary hover:text-text-primary',
            'transition-all duration-300 shadow-sm hover:shadow-md',
            sidebarVisible ? 'left-[calc(var(--sidebar-width)+0.5rem)]' : 'left-4'
          )}
          style={{
            '--sidebar-width': `${sidebarWidth}px`,
          } as React.CSSProperties}
          aria-label={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
          aria-expanded={sidebarVisible}
          aria-controls="docs-sidebar"
          title={sidebarVisible ? 'Hide sidebar (⌘B)' : 'Show sidebar (⌘B)'}
        >
          {sidebarVisible ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeft className="w-5 h-5" />
          )}
        </button>

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          id="docs-sidebar"
          className={clsx(
            'fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] overflow-y-auto',
            'bg-bg-primary border-r border-border lg:border-0',
            'transition-transform duration-300 ease-in-out',
            // Mobile styles
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            // Desktop styles
            'lg:translate-x-0',
            !sidebarVisible && 'lg:-translate-x-full lg:opacity-0 lg:pointer-events-none'
          )}
          style={{
            width: `${sidebarWidth}px`,
            flexShrink: 0,
          }}
          aria-hidden={!sidebarVisible && !sidebarOpen}
        >
          <div className="p-6 pr-4">
            <Sidebar navigation={navigation} />
          </div>
        </aside>

        {/* Resize Handle */}
        {sidebarVisible && (
          <div
            onMouseDown={handleMouseDown}
            className={clsx(
              'hidden lg:flex items-center justify-center',
              'fixed top-16 h-[calc(100vh-4rem)] w-3 z-50',
              'cursor-col-resize group',
              'transition-opacity duration-200',
              isResizing ? 'opacity-100' : 'opacity-0 hover:opacity-100'
            )}
            style={{
              left: `${sidebarWidth - 6}px`,
            }}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                setSidebarWidth((w) => Math.max(SIDEBAR_MIN_WIDTH, w - 10))
              } else if (e.key === 'ArrowRight') {
                setSidebarWidth((w) => Math.min(SIDEBAR_MAX_WIDTH, w + 10))
              }
            }}
          >
            <div
              className={clsx(
                'h-16 w-1 rounded-full transition-all duration-200',
                isResizing
                  ? 'bg-brand-500 w-1.5'
                  : 'bg-border group-hover:bg-brand-400 group-hover:w-1.5'
              )}
            />
          </div>
        )}

        {/* Backdrop (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main
          className={clsx(
            'flex-1 min-w-0 transition-all duration-300 ease-in-out',
            sidebarVisible ? 'lg:ml-4' : 'lg:ml-0'
          )}
          style={{
            marginLeft: sidebarVisible ? undefined : 0,
          }}
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
