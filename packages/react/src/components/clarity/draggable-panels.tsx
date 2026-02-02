'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  GripVertical,
  GripHorizontal,
  X,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'

// Resizable Panel
export interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize?: number
  minSize?: number
  maxSize?: number
  direction?: 'horizontal' | 'vertical'
  collapsible?: boolean
  defaultCollapsed?: boolean
  onResize?: (size: number) => void
  onCollapse?: (collapsed: boolean) => void
  className?: string
}

export function ResizablePanel({
  children,
  defaultSize = 300,
  minSize = 200,
  maxSize = 600,
  direction = 'horizontal',
  collapsible = true,
  defaultCollapsed = false,
  onResize,
  onCollapse,
  className,
}: ResizablePanelProps) {
  const [size, setSize] = React.useState(defaultSize)
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [isResizing, setIsResizing] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const startPos = direction === 'horizontal' ? e.clientX : e.clientY
    const startSize = size

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const currentPos =
        direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
      const delta = currentPos - startPos
      const newSize = Math.max(minSize, Math.min(maxSize, startSize + delta))
      setSize(newSize)
      onResize?.(newSize)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapse?.(newCollapsed)
  }

  const isHorizontal = direction === 'horizontal'
  const CollapseIcon = isHorizontal
    ? isCollapsed
      ? ChevronRight
      : ChevronLeft
    : isCollapsed
      ? ChevronDown
      : ChevronUp

  return (
    <div
      ref={panelRef}
      className={cn(
        'relative flex-shrink-0 bg-card border-border transition-all',
        isHorizontal ? 'border-r' : 'border-b',
        isResizing && 'select-none',
        className
      )}
      style={{
        [isHorizontal ? 'width' : 'height']: isCollapsed ? 0 : size,
        overflow: isCollapsed ? 'hidden' : 'auto',
      }}
    >
      {!isCollapsed && children}

      {/* Resize Handle */}
      <div
        className={cn(
          'absolute bg-transparent hover:bg-accent/50 transition-colors z-10',
          isHorizontal
            ? 'right-0 top-0 bottom-0 w-1 cursor-col-resize'
            : 'bottom-0 left-0 right-0 h-1 cursor-row-resize',
          isResizing && 'bg-accent'
        )}
        onMouseDown={handleMouseDown}
      />

      {/* Collapse Button */}
      {collapsible && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute z-20 h-6 w-6 rounded-full bg-background border shadow-sm',
            isHorizontal
              ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2'
              : 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
          )}
          onClick={toggleCollapse}
        >
          <CollapseIcon className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// Split Pane
export interface SplitPaneProps {
  children: [React.ReactNode, React.ReactNode]
  direction?: 'horizontal' | 'vertical'
  defaultSplit?: number
  minSplit?: number
  maxSplit?: number
  className?: string
}

export function SplitPane({
  children,
  direction = 'horizontal',
  defaultSplit = 50,
  minSplit = 20,
  maxSplit = 80,
  className,
}: SplitPaneProps) {
  const [split, setSplit] = React.useState(defaultSplit)
  const [isResizing, setIsResizing] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const pos =
        direction === 'horizontal'
          ? ((moveEvent.clientX - rect.left) / rect.width) * 100
          : ((moveEvent.clientY - rect.top) / rect.height) * 100

      const newSplit = Math.max(minSplit, Math.min(maxSplit, pos))
      setSplit(newSplit)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const isHorizontal = direction === 'horizontal'

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex h-full',
        isHorizontal ? 'flex-row' : 'flex-col',
        isResizing && 'select-none',
        className
      )}
    >
      <div
        className="overflow-auto"
        style={{ [isHorizontal ? 'width' : 'height']: `${split}%` }}
      >
        {children[0]}
      </div>

      <div
        className={cn(
          'flex-shrink-0 bg-border hover:bg-accent transition-colors',
          isHorizontal ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',
          isResizing && 'bg-accent'
        )}
        onMouseDown={handleMouseDown}
      />

      <div
        className="overflow-auto"
        style={{ [isHorizontal ? 'width' : 'height']: `${100 - split}%` }}
      >
        {children[1]}
      </div>
    </div>
  )
}

// Floating Panel
export interface FloatingPanelProps {
  children: React.ReactNode
  title?: string
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  minSize?: { width: number; height: number }
  resizable?: boolean
  closable?: boolean
  minimizable?: boolean
  onClose?: () => void
  onMinimize?: () => void
  className?: string
}

export function FloatingPanel({
  children,
  title,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 },
  minSize = { width: 200, height: 150 },
  resizable = true,
  closable = true,
  minimizable = true,
  onClose,
  onMinimize,
  className,
}: FloatingPanelProps) {
  const [position, setPosition] = React.useState(defaultPosition)
  const [size, setSize] = React.useState(defaultSize)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isResizing, setIsResizing] = React.useState(false)
  const [isMinimized, setIsMinimized] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)

  // Drag handling
  const handleDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    setIsDragging(true)

    const startX = e.clientX - position.x
    const startY = e.clientY - position.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Resize handling
  const handleResizeStart = (e: React.MouseEvent, corner: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = size.width
    const startHeight = size.height
    const startPosX = position.x
    const startPosY = position.y

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth
      let newHeight = startHeight
      let newX = startPosX
      let newY = startPosY

      if (corner.includes('e')) {
        newWidth = Math.max(
          minSize.width,
          startWidth + (moveEvent.clientX - startX)
        )
      }
      if (corner.includes('w')) {
        const delta = startX - moveEvent.clientX
        newWidth = Math.max(minSize.width, startWidth + delta)
        newX = startPosX - delta
      }
      if (corner.includes('s')) {
        newHeight = Math.max(
          minSize.height,
          startHeight + (moveEvent.clientY - startY)
        )
      }
      if (corner.includes('n')) {
        const delta = startY - moveEvent.clientY
        newHeight = Math.max(minSize.height, startHeight + delta)
        newY = startPosY - delta
      }

      setSize({ width: newWidth, height: newHeight })
      setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    onMinimize?.()
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed rounded-lg border border-border bg-card shadow-lg overflow-hidden',
        (isDragging || isResizing) && 'select-none',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? 'auto' : size.height,
        zIndex: 50,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border cursor-move"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{title || 'Panel'}</span>
        </div>
        <div className="flex items-center gap-1">
          {minimizable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleMinimize}
            >
              {isMinimized ? (
                <Maximize2 className="h-3 w-3" />
              ) : (
                <Minimize2 className="h-3 w-3" />
              )}
            </Button>
          )}
          {closable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="h-[calc(100%-40px)] overflow-auto">{children}</div>
      )}

      {/* Resize handles */}
      {resizable && !isMinimized && (
        <>
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => handleResizeStart(e, 'se')}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'sw')}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
            onMouseDown={(e) => handleResizeStart(e, 'ne')}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
            onMouseDown={(e) => handleResizeStart(e, 'nw')}
          />
          <div
            className="absolute bottom-0 left-4 right-4 h-1 cursor-s-resize"
            onMouseDown={(e) => handleResizeStart(e, 's')}
          />
          <div
            className="absolute top-0 left-4 right-4 h-1 cursor-n-resize"
            onMouseDown={(e) => handleResizeStart(e, 'n')}
          />
          <div
            className="absolute left-0 top-4 bottom-4 w-1 cursor-w-resize"
            onMouseDown={(e) => handleResizeStart(e, 'w')}
          />
          <div
            className="absolute right-0 top-4 bottom-4 w-1 cursor-e-resize"
            onMouseDown={(e) => handleResizeStart(e, 'e')}
          />
        </>
      )}
    </div>
  )
}

// Scroll Shadow
export interface ScrollShadowProps {
  children: React.ReactNode
  className?: string
  shadowSize?: number
}

export function ScrollShadow({
  children,
  className,
  shadowSize = 20,
}: ScrollShadowProps) {
  const [showTopShadow, setShowTopShadow] = React.useState(false)
  const [showBottomShadow, setShowBottomShadow] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setShowTopShadow(scrollTop > 0)
    setShowBottomShadow(scrollTop + clientHeight < scrollHeight - 1)
  }, [])

  React.useEffect(() => {
    handleScroll()
    const scrollElement = scrollRef.current
    scrollElement?.addEventListener('scroll', handleScroll)
    return () => scrollElement?.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <div className={cn('relative', className)}>
      {/* Top shadow */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 pointer-events-none z-10 transition-opacity',
          showTopShadow ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: shadowSize,
          background:
            'linear-gradient(to bottom, hsl(var(--background)), transparent)',
        }}
      />

      {/* Scroll content */}
      <div ref={scrollRef} className="h-full overflow-auto scrollbar-thin">
        {children}
      </div>

      {/* Bottom shadow */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 pointer-events-none z-10 transition-opacity',
          showBottomShadow ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          height: shadowSize,
          background:
            'linear-gradient(to top, hsl(var(--background)), transparent)',
        }}
      />
    </div>
  )
}

// Panel Group
export interface PanelGroupProps {
  children: React.ReactNode
  direction?: 'horizontal' | 'vertical'
  className?: string
}

export function PanelGroup({
  children,
  direction = 'horizontal',
  className,
}: PanelGroupProps) {
  return (
    <div
      className={cn(
        'flex h-full',
        direction === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {children}
    </div>
  )
}
