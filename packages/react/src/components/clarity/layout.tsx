'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  PanelLeft,
  PanelRight,
  PanelLeftClose,
  PanelRightClose,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  GripVertical,
} from 'lucide-react'

// Layout Container - Main wrapper for app layouts
interface LayoutContainerProps {
  children: React.ReactNode
  className?: string
}

export function LayoutContainer({ children, className }: LayoutContainerProps) {
  return (
    <div className={cn('flex h-screen w-full overflow-hidden', className)}>
      {children}
    </div>
  )
}

// Sidebar Layout
interface SidebarLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  sidebarPosition?: 'left' | 'right'
  sidebarWidth?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
  className?: string
}

export function SidebarLayout({
  children,
  sidebar,
  sidebarPosition = 'left',
  sidebarWidth = 280,
  collapsible = true,
  defaultCollapsed = false,
  className,
}: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)

  return (
    <div className={cn('flex h-full w-full', className)}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex h-full flex-col border-r bg-background transition-all duration-300',
          sidebarPosition === 'right' && 'order-last border-l border-r-0',
          isCollapsed ? 'w-16' : `w-[${sidebarWidth}px]`,
          'fixed inset-y-0 z-50 lg:relative',
          sidebarPosition === 'left' ? 'left-0' : 'right-0',
          isMobileOpen
            ? 'translate-x-0'
            : sidebarPosition === 'left'
              ? '-translate-x-full lg:translate-x-0'
              : 'translate-x-full lg:translate-x-0'
        )}
        style={{ width: isCollapsed ? 64 : sidebarWidth }}
      >
        {/* Mobile Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-auto">{sidebar}</div>

        {/* Collapse Toggle */}
        {collapsible && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-6 z-10 hidden h-6 w-6 rounded-full border bg-background shadow-md lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {sidebarPosition === 'left' ? (
              isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )
            ) : isCollapsed ? (
              <ChevronLeft className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        {children}
      </main>
    </div>
  )
}

// Split Panel Layout
interface SplitPanelLayoutProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultSplit?: number
  minLeft?: number
  minRight?: number
  resizable?: boolean
  className?: string
}

export function SplitPanelLayout({
  left,
  right,
  defaultSplit = 50,
  minLeft = 20,
  minRight = 20,
  resizable = true,
  className,
}: SplitPanelLayoutProps) {
  const [split, setSplit] = React.useState(defaultSplit)
  const [isDragging, setIsDragging] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    if (!resizable) return
    setIsDragging(true)
  }

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newSplit = ((e.clientX - rect.left) / rect.width) * 100
      setSplit(Math.max(minLeft, Math.min(100 - minRight, newSplit)))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, minLeft, minRight])

  return (
    <div ref={containerRef} className={cn('flex h-full w-full', className)}>
      <div style={{ width: `${split}%` }} className="h-full overflow-auto">
        {left}
      </div>
      {resizable && (
        <div
          className={cn(
            'flex w-1 cursor-col-resize items-center justify-center bg-border hover:bg-accent',
            isDragging && 'bg-accent'
          )}
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div
        style={{ width: `${100 - split}%` }}
        className="h-full overflow-auto"
      >
        {right}
      </div>
    </div>
  )
}

// Three Column Layout
interface ThreeColumnLayoutProps {
  left?: React.ReactNode
  center: React.ReactNode
  right?: React.ReactNode
  leftWidth?: number
  rightWidth?: number
  leftCollapsible?: boolean
  rightCollapsible?: boolean
  className?: string
}

export function ThreeColumnLayout({
  left,
  center,
  right,
  leftWidth = 240,
  rightWidth = 320,
  leftCollapsible = true,
  rightCollapsible = true,
  className,
}: ThreeColumnLayoutProps) {
  const [leftCollapsed, setLeftCollapsed] = React.useState(false)
  const [rightCollapsed, setRightCollapsed] = React.useState(false)

  return (
    <div className={cn('flex h-full w-full', className)}>
      {/* Left Panel */}
      {left && (
        <aside
          className={cn(
            'flex h-full flex-col border-r bg-muted/30 transition-all duration-300',
            leftCollapsed ? 'w-0 overflow-hidden' : ''
          )}
          style={{ width: leftCollapsed ? 0 : leftWidth }}
        >
          {left}
        </aside>
      )}

      {/* Center Panel */}
      <main className="relative flex-1 overflow-auto">
        {/* Left Toggle */}
        {left && leftCollapsible && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-2 z-10"
            onClick={() => setLeftCollapsed(!leftCollapsed)}
          >
            {leftCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* Right Toggle */}
        {right && rightCollapsible && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10"
            onClick={() => setRightCollapsed(!rightCollapsed)}
          >
            {rightCollapsed ? (
              <PanelRight className="h-4 w-4" />
            ) : (
              <PanelRightClose className="h-4 w-4" />
            )}
          </Button>
        )}

        {center}
      </main>

      {/* Right Panel */}
      {right && (
        <aside
          className={cn(
            'flex h-full flex-col border-l bg-muted/30 transition-all duration-300',
            rightCollapsed ? 'w-0 overflow-hidden' : ''
          )}
          style={{ width: rightCollapsed ? 0 : rightWidth }}
        >
          {right}
        </aside>
      )}
    </div>
  )
}

// Header Layout
interface HeaderLayoutProps {
  header: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  stickyHeader?: boolean
  className?: string
}

export function HeaderLayout({
  header,
  children,
  footer,
  stickyHeader = true,
  className,
}: HeaderLayoutProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      <header
        className={cn(
          'border-b bg-background',
          stickyHeader && 'sticky top-0 z-50'
        )}
      >
        {header}
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
      {footer && <footer className="border-t bg-background">{footer}</footer>}
    </div>
  )
}

// Card Grid Layout
interface CardGridLayoutProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CardGridLayout({
  children,
  columns = 3,
  gap = 'md',
  className,
}: CardGridLayoutProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  return (
    <div
      className={cn('grid', columnClasses[columns], gapClasses[gap], className)}
    >
      {children}
    </div>
  )
}

// Centered Layout
interface CenteredLayoutProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
}

export function CenteredLayout({
  children,
  maxWidth = 'lg',
  className,
}: CenteredLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full px-4',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  )
}

// Fullscreen Layout
interface FullscreenLayoutProps {
  children: React.ReactNode
  isFullscreen?: boolean
  onToggle?: () => void
  showToggle?: boolean
  className?: string
}

export function FullscreenLayout({
  children,
  isFullscreen,
  onToggle,
  showToggle = true,
  className,
}: FullscreenLayoutProps) {
  const [internalFullscreen, setInternalFullscreen] = React.useState(false)
  const fullscreen = isFullscreen ?? internalFullscreen
  const toggleFullscreen =
    onToggle ?? (() => setInternalFullscreen(!internalFullscreen))

  return (
    <div
      className={cn(
        'relative',
        fullscreen && 'fixed inset-0 z-50 bg-background',
        className
      )}
    >
      {showToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={toggleFullscreen}
        >
          {fullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}
      {children}
    </div>
  )
}

// Scroll Area with Shadow
interface ScrollShadowProps {
  children: React.ReactNode
  className?: string
}

export function ScrollShadow({ children, className }: ScrollShadowProps) {
  const [showTopShadow, setShowTopShadow] = React.useState(false)
  const [showBottomShadow, setShowBottomShadow] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowTopShadow(scrollTop > 0)
    setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 1)
  }

  React.useEffect(() => {
    handleScroll()
    const el = scrollRef.current
    if (el) {
      const observer = new ResizeObserver(handleScroll)
      observer.observe(el)
      return () => observer.disconnect()
    }
  }, [])

  return (
    <div className={cn('relative', className)}>
      {showTopShadow && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-background to-transparent" />
      )}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-auto"
      >
        {children}
      </div>
      {showBottomShadow && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-background to-transparent" />
      )}
    </div>
  )
}
