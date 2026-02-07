'use client'

import { memo } from 'react'
import { cn } from '@clarity-chat/primitives'
import { FileUploadZone } from '../../_shared/file-upload'
import type { FileAttachment } from '../../_shared/types'
import { Target, ToggleLeft, SlidersHorizontal } from 'lucide-react'

interface ContextPanelProps {
  researchFocus: string
  onResearchFocusChange: (text: string) => void
  preferredSources: Record<string, boolean>
  onToggleSource: (source: string) => void
  depthLevel: number
  onDepthLevelChange: (level: number) => void
  deepResearchMode: boolean
  onToggleDeepResearch: () => void
  files: FileAttachment[]
  onFilesChange: (files: FileAttachment[]) => void
  className?: string
}

const sourceTypes = [
  { key: 'academic', label: 'Academic' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'news', label: 'News' },
  { key: 'forums', label: 'Forums' },
]

const depthLabels = ['Quick', 'Standard', 'Deep']

export const ResearchContextPanel = memo(function ResearchContextPanel({
  researchFocus,
  onResearchFocusChange,
  preferredSources,
  onToggleSource,
  depthLevel,
  onDepthLevelChange,
  deepResearchMode,
  onToggleDeepResearch,
  files,
  onFilesChange,
  className,
}: ContextPanelProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Target className="h-4 w-4 text-blue-500" />
        Research Context
      </h4>

      {/* Deep Research Toggle */}
      <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10">
        <div>
          <div className="text-sm font-medium">Deep Research Mode</div>
          <div className="text-[10px] text-muted-foreground">
            Multi-step research with cross-referencing
          </div>
        </div>
        <button
          onClick={onToggleDeepResearch}
          className={cn(
            'relative w-9 h-5 rounded-full transition-colors',
            deepResearchMode ? 'bg-blue-500' : 'bg-muted-foreground/30'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
              deepResearchMode ? 'translate-x-4' : 'translate-x-0.5'
            )}
          />
        </button>
      </label>

      {/* Research Focus */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">
          Research Focus
        </label>
        <textarea
          value={researchFocus}
          onChange={(e) => onResearchFocusChange(e.target.value)}
          placeholder="Describe your research focus..."
          rows={3}
          className="w-full text-sm px-3 py-2 rounded-lg bg-muted/30 border border-muted-foreground/10 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none placeholder:text-muted-foreground/40"
        />
      </div>

      {/* Preferred Sources */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground font-medium">
          Preferred Sources
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {sourceTypes.map((source) => (
            <button
              key={source.key}
              onClick={() => onToggleSource(source.key)}
              className={cn(
                'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                preferredSources[source.key]
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30'
                  : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
              )}
            >
              {source.label}
            </button>
          ))}
        </div>
      </div>

      {/* Research Depth */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground font-medium">
            Research Depth
          </span>
          <span className="font-medium text-blue-500">
            {depthLabels[depthLevel]}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={depthLevel}
          onChange={(e) => onDepthLevelChange(Number(e.target.value))}
          className="w-full accent-blue-500 h-1.5"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Quick</span>
          <span>Standard</span>
          <span>Deep</span>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground font-medium">
          Research Documents
        </label>
        <FileUploadZone files={files} onFilesChange={onFilesChange} />
      </div>
    </div>
  )
})
