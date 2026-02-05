'use client'

import { useState } from 'react'
import { ComponentPreview } from './ComponentPreview'
import { Slider } from '@/components/ui/Slider'
import { cn } from '@clarity-chat/primitives'

interface OverlayViewProps {
  leftComponent: string
  rightComponent: string
}

export function OverlayView({ leftComponent, rightComponent }: OverlayViewProps) {
  const [opacity, setOpacity] = useState(50)
  const [activeLayer, setActiveLayer] = useState<'left' | 'right'>('left')

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Overlay Comparison</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveLayer('left')}
              className={cn(
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                activeLayer === 'left'
                  ? 'bg-blue-500 text-white'
                  : 'glass-panel hover:bg-muted'
              )}
            >
              Component A
            </button>
            <button
              onClick={() => setActiveLayer('right')}
              className={cn(
                'px-3 py-1 rounded text-sm font-medium transition-colors',
                activeLayer === 'right'
                  ? 'bg-purple-500 text-white'
                  : 'glass-panel hover:bg-muted'
              )}
            >
              Component B
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-[600px] overflow-hidden rounded-lg border bg-background">
        {/* Base Layer */}
        <div className="absolute inset-0 p-6">
          <ComponentPreview componentId={activeLayer === 'left' ? leftComponent : rightComponent} />
        </div>

        {/* Overlay Layer */}
        <div
          className="absolute inset-0 p-6 pointer-events-none"
          style={{ opacity: opacity / 100 }}
        >
          <div className="outline-dashed outline-2 outline-primary outline-offset-4 rounded-lg">
            <ComponentPreview componentId={activeLayer === 'left' ? rightComponent : leftComponent} />
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-xs font-medium mb-2">Overlay Opacity</div>
              <Slider
                value={opacity}
                onChange={setOpacity}
                min={0}
                max={100}
                step={1}
              />
            </div>
            <div className="text-sm font-medium tabular-nums">
              {opacity}%
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Base: {activeLayer === 'left' ? leftComponent : rightComponent}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 opacity-50" />
              <span>Overlay: {activeLayer === 'left' ? rightComponent : leftComponent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
