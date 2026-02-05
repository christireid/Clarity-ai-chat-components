'use client'

import { useState } from 'react'
import { ComponentPreview } from './ComponentPreview'
import { GripVertical } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface SplitViewProps {
  leftComponent: string
  rightComponent: string
}

export function SplitView({ leftComponent, rightComponent }: SplitViewProps) {
  const [splitPosition, setSplitPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const container = e.currentTarget.getBoundingClientRect()
    const position = ((e.clientX - container.left) / container.width) * 100
    setSplitPosition(Math.max(20, Math.min(80, position)))
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Side-by-Side Comparison</h3>
        <div className="text-sm text-muted-foreground">
          Drag the divider to adjust split
        </div>
      </div>

      <div
        className="relative h-[600px] overflow-hidden rounded-lg border bg-background"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left Side */}
        <div
          className="absolute left-0 top-0 bottom-0 overflow-auto"
          style={{ width: `${splitPosition}%` }}
        >
          <div className="h-full p-6 border-r">
            <div className="glass-panel p-4 rounded-lg mb-4">
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                Component A
              </div>
              <div className="text-xs text-muted-foreground">{leftComponent}</div>
            </div>
            <ComponentPreview componentId={leftComponent} />
          </div>
        </div>

        {/* Right Side */}
        <div
          className="absolute right-0 top-0 bottom-0 overflow-auto"
          style={{ width: `${100 - splitPosition}%` }}
        >
          <div className="h-full p-6">
            <div className="glass-panel p-4 rounded-lg mb-4">
              <div className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                Component B
              </div>
              <div className="text-xs text-muted-foreground">{rightComponent}</div>
            </div>
            <ComponentPreview componentId={rightComponent} />
          </div>
        </div>

        {/* Draggable Divider */}
        <div
          className={cn(
            'absolute top-0 bottom-0 w-1 bg-border hover:bg-primary cursor-col-resize transition-colors z-10 group',
            isDragging && 'bg-primary'
          )}
          style={{ left: `${splitPosition}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}
