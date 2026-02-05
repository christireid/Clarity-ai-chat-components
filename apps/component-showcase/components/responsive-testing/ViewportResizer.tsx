'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ViewportResizerProps {
  initialWidth: number
  initialHeight: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onResize?: (width: number, height: number) => void
  children: React.ReactNode
  className?: string
}

export function ViewportResizer({
  initialWidth,
  initialHeight,
  minWidth = 320,
  minHeight = 568,
  maxWidth = 3840,
  maxHeight = 2160,
  onResize,
  children,
  className,
}: ViewportResizerProps) {
  const [width, setWidth] = useState(initialWidth)
  const [height, setHeight] = useState(initialHeight)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<'right' | 'bottom' | 'corner' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, handle: 'right' | 'bottom' | 'corner') => {
      e.preventDefault()
      setIsResizing(true)
      setResizeHandle(handle)
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        width,
        height,
      }
    },
    [width, height]
  )

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      let newWidth = width
      let newHeight = height

      if (resizeHandle === 'right' || resizeHandle === 'corner') {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startPos.current.width + deltaX))
      }

      if (resizeHandle === 'bottom' || resizeHandle === 'corner') {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startPos.current.height + deltaY))
      }

      setWidth(newWidth)
      setHeight(newHeight)
      onResize?.(newWidth, newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setResizeHandle(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, resizeHandle, width, height, minWidth, minHeight, maxWidth, maxHeight, onResize])

  return (
    <div className={cn('relative inline-block', className)} ref={containerRef}>
      <div
        className="relative bg-background border border-border rounded-lg overflow-hidden"
        style={{ width, height }}
      >
        {children}

        {/* Dimension Display */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded font-mono">
          {width} × {height}
        </div>

        {/* Right Handle */}
        <div
          className={cn(
            'absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize',
            'hover:bg-primary/50 transition-colors',
            isResizing && resizeHandle === 'right' && 'bg-primary'
          )}
          onMouseDown={(e) => handleMouseDown(e, 'right')}
        />

        {/* Bottom Handle */}
        <div
          className={cn(
            'absolute left-0 right-0 bottom-0 h-1 cursor-ns-resize',
            'hover:bg-primary/50 transition-colors',
            isResizing && resizeHandle === 'bottom' && 'bg-primary'
          )}
          onMouseDown={(e) => handleMouseDown(e, 'bottom')}
        />

        {/* Corner Handle */}
        <div
          className={cn(
            'absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize',
            'hover:bg-primary/50 transition-colors rounded-tl',
            isResizing && resizeHandle === 'corner' && 'bg-primary'
          )}
          onMouseDown={(e) => handleMouseDown(e, 'corner')}
        >
          <Maximize2 className="w-3 h-3 absolute right-0.5 bottom-0.5 text-white" />
        </div>
      </div>
    </div>
  )
}
