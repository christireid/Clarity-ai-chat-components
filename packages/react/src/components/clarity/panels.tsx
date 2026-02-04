'use client'

import * as React from 'react'
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  X,
  Maximize2,
  Minimize2,
  PanelLeft,
  PanelRight,
  PanelBottom,
  Settings,
  Pin,
  PinOff,
} from 'lucide-react'
import { Button } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'

// Collapsible Panel
interface CollapsiblePanelProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function CollapsiblePanel({
  title,
  children,
  defaultOpen = false,
  icon,
  badge,
  actions,
  className,
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <button
        type="button"
        className="flex items-center justify-between w-full p-3 text-left bg-muted/50 hover:bg-muted transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          {icon}
          <span className="font-medium text-sm">{title}</span>
          {badge}
        </div>
        {actions && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1"
          >
            {actions}
          </div>
        )}
      </button>
      {isOpen && <div className="p-3 border-t">{children}</div>}
    </div>
  )
}

// Resizable Panel
interface ResizablePanelProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  position?: 'left' | 'right'
  className?: string
  onResize?: (width: number) => void
}

export function ResizablePanel({
  children,
  defaultWidth = 300,
  minWidth = 200,
  maxWidth = 600,
  position = 'left',
  className,
  onResize,
}: ResizablePanelProps) {
  const [width, setWidth] = React.useState(defaultWidth)
  const [isResizing, setIsResizing] = React.useState(false)
  const panelRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return

      const rect = panelRef.current.getBoundingClientRect()
      let newWidth: number

      if (position === 'left') {
        newWidth = e.clientX - rect.left
      } else {
        newWidth = rect.right - e.clientX
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(newWidth)
      onResize?.(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minWidth, maxWidth, position, onResize])

  return (
    <div
      ref={panelRef}
      className={cn('relative flex', className)}
      style={{ width: `${width}px` }}
    >
      {position === 'right' && (
        <div
          className={cn(
            'absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-accent transition-colors',
            isResizing && 'bg-accent'
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">{children}</div>
      {position === 'left' && (
        <div
          className={cn(
            'absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-accent transition-colors',
            isResizing && 'bg-accent'
          )}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

// Slide-over Drawer
interface DrawerPanelProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  position?: 'left' | 'right' | 'bottom'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showOverlay?: boolean
}

export function DrawerPanel({
  children,
  isOpen,
  onClose,
  title,
  description,
  position = 'right',
  size = 'md',
  showOverlay = true,
}: DrawerPanelProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: position === 'bottom' ? 'h-1/4' : 'w-80',
    md: position === 'bottom' ? 'h-1/3' : 'w-96',
    lg: position === 'bottom' ? 'h-1/2' : 'w-[480px]',
    xl: position === 'bottom' ? 'h-2/3' : 'w-[640px]',
    full: position === 'bottom' ? 'h-full' : 'w-full',
  }

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    bottom: 'left-0 right-0 bottom-0',
  }

  const animationClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right',
    bottom: 'animate-fade-in',
  }

  return (
    <div className="fixed inset-0 z-50">
      {showOverlay && (
        <div
          className="absolute inset-0 bg-black/50 animate-fade-in"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          'absolute bg-background border shadow-lg flex flex-col',
          positionClasses[position],
          sizeClasses[size],
          animationClasses[position]
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-4 border-b">
            <div>
              {title && <h2 className="font-semibold">{title}</h2>}
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}

// Floating Panel
interface FloatingPanelProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  position?: { x: number; y: number }
  draggable?: boolean
  pinnable?: boolean
  isPinned?: boolean
  onPin?: () => void
}

export function FloatingPanel({
  children,
  isOpen,
  onClose,
  title,
  position = { x: 100, y: 100 },
  draggable = true,
  pinnable = false,
  isPinned = false,
  onPin,
}: FloatingPanelProps) {
  const [pos, setPos] = React.useState(position)
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 })
  const panelRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || isPinned) return
    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) return

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      setPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      className={cn(
        'fixed z-50 bg-background border rounded-lg shadow-lg min-w-[300px] animate-scale-in',
        isDragging && 'cursor-grabbing'
      )}
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className={cn(
          'flex items-center justify-between p-3 border-b',
          draggable && !isPinned && 'cursor-grab'
        )}
        onMouseDown={handleMouseDown}
      >
        <span className="font-medium text-sm">{title}</span>
        <div className="flex items-center gap-1">
          {pinnable && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onPin}
            >
              {isPinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

// Split Panel
interface SplitPanelProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultSplit?: number
  minLeft?: number
  minRight?: number
  className?: string
}

export function SplitPanel({
  left,
  right,
  defaultSplit = 50,
  minLeft = 20,
  minRight = 20,
  className,
}: SplitPanelProps) {
  const [split, setSplit] = React.useState(defaultSplit)
  const [isResizing, setIsResizing] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsResizing(true)
  }

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const newSplit = ((e.clientX - rect.left) / rect.width) * 100
      const clampedSplit = Math.max(minLeft, Math.min(100 - minRight, newSplit))
      setSplit(clampedSplit)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, minLeft, minRight])

  return (
    <div ref={containerRef} className={cn('flex h-full', className)}>
      <div style={{ width: `${split}%` }} className="overflow-auto">
        {left}
      </div>
      <div
        className={cn(
          'w-1 bg-border cursor-col-resize hover:bg-accent transition-colors flex-shrink-0',
          isResizing && 'bg-accent'
        )}
        onMouseDown={handleMouseDown}
      />
      <div style={{ width: `${100 - split}%` }} className="overflow-auto">
        {right}
      </div>
    </div>
  )
}

// Panel Toggle Button
interface PanelToggleProps {
  position: 'left' | 'right' | 'bottom'
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function PanelToggle({
  position,
  isOpen,
  onClick,
  className,
}: PanelToggleProps) {
  const icons = {
    left: isOpen ? PanelLeft : PanelRight,
    right: isOpen ? PanelRight : PanelLeft,
    bottom: isOpen ? PanelBottom : PanelBottom,
  }

  const Icon = icons[position]

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn('h-8 w-8', className)}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

// Toolbar Panel
interface ToolbarPanelProps {
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function ToolbarPanel({
  children,
  position = 'top',
  className,
}: ToolbarPanelProps) {
  const positionClasses = {
    top: 'flex-row border-b',
    bottom: 'flex-row border-t',
    left: 'flex-col border-r',
    right: 'flex-col border-l',
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-muted/50',
        positionClasses[position],
        className
      )}
    >
      {children}
    </div>
  )
}
