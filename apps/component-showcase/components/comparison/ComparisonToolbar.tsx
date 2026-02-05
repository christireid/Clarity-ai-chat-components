'use client'

import { useState } from 'react'
import {
  LayoutGrid,
  Layers,
  GitCompareArrows,
  BarChart3,
  Code2,
  Download,
  Share2,
  Camera,
  Copy,
  Check,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface ComparisonToolbarProps {
  comparisonMode: 'side-by-side' | 'overlay' | 'diff'
  onModeChange: (mode: 'side-by-side' | 'overlay' | 'diff') => void
  showPerformance: boolean
  onTogglePerformance: (show: boolean) => void
  showProps: boolean
  onToggleProps: (show: boolean) => void
  leftComponent: string
  rightComponent: string
}

export function ComparisonToolbar({
  comparisonMode,
  onModeChange,
  showPerformance,
  onTogglePerformance,
  showProps,
  onToggleProps,
  leftComponent,
  rightComponent,
}: ComparisonToolbarProps) {
  const [shareUrlCopied, setShareUrlCopied] = useState(false)
  const [screenshotTaken, setScreenshotTaken] = useState(false)

  const handleShareUrl = () => {
    const url = `${window.location.origin}/compare?left=${leftComponent}&right=${rightComponent}&mode=${comparisonMode}`
    navigator.clipboard.writeText(url)
    setShareUrlCopied(true)
    setTimeout(() => setShareUrlCopied(false), 2000)
  }

  const handleScreenshot = () => {
    // In a real implementation, this would capture the comparison view
    setScreenshotTaken(true)
    setTimeout(() => setScreenshotTaken(false), 2000)
  }

  const handleExport = () => {
    // In a real implementation, this would generate a JSON/CSV export
    const data = {
      comparison: {
        left: leftComponent,
        right: rightComponent,
        mode: comparisonMode,
        timestamp: new Date().toISOString(),
      },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comparison-${leftComponent}-vs-${rightComponent}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Comparison Modes */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">View:</span>
          <div className="flex gap-1">
            <button
              onClick={() => onModeChange('side-by-side')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                comparisonMode === 'side-by-side'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-panel hover:bg-muted'
              )}
              title="Side-by-side view"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => onModeChange('overlay')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                comparisonMode === 'overlay'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-panel hover:bg-muted'
              )}
              title="Overlay view"
            >
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">Overlay</span>
            </button>
            <button
              onClick={() => onModeChange('diff')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                comparisonMode === 'diff'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass-panel hover:bg-muted'
              )}
              title="Diff view"
            >
              <GitCompareArrows className="h-4 w-4" />
              <span className="hidden sm:inline">Diff</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-border hidden md:block" />

        {/* Toggle Options */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTogglePerformance(!showPerformance)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
              showPerformance
                ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                : 'glass-panel hover:bg-muted'
            )}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </button>
          <button
            onClick={() => onToggleProps(!showProps)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
              showProps
                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                : 'glass-panel hover:bg-muted'
            )}
          >
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">Props</span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleScreenshot}
            className="px-3 py-1.5 rounded-lg glass-panel hover:bg-muted text-sm font-medium transition-all flex items-center gap-2"
            title="Take screenshot"
          >
            {screenshotTaken ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            <span className="hidden lg:inline">Screenshot</span>
          </button>
          <button
            onClick={handleShareUrl}
            className="px-3 py-1.5 rounded-lg glass-panel hover:bg-muted text-sm font-medium transition-all flex items-center gap-2"
            title="Copy shareable URL"
          >
            {shareUrlCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            <span className="hidden lg:inline">{shareUrlCopied ? 'Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 rounded-lg glass-panel hover:bg-muted text-sm font-medium transition-all flex items-center gap-2"
            title="Export comparison data"
          >
            <Download className="h-4 w-4" />
            <span className="hidden lg:inline">Export</span>
          </button>
        </div>
      </div>
    </div>
  )
}
