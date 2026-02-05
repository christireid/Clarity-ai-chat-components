'use client'

import { useState } from 'react'
import { ComparisonView } from '@/components/comparison/ComparisonView'
import { ComponentSelector } from '@/components/comparison/ComponentSelector'
import { ComparisonToolbar } from '@/components/comparison/ComparisonToolbar'
import { GitCompare, Info } from 'lucide-react'

export default function ComparePage() {
  const [leftComponent, setLeftComponent] = useState<string | null>(null)
  const [rightComponent, setRightComponent] = useState<string | null>(null)
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay' | 'diff'>('side-by-side')
  const [showPerformance, setShowPerformance] = useState(true)
  const [showProps, setShowProps] = useState(true)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <GitCompare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Component Comparison</h1>
            <p className="text-muted-foreground">
              Compare components side-by-side with visual diffs and performance metrics
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="glass-card p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium mb-1">How to use Comparison Mode</p>
            <p className="text-muted-foreground">
              Select two components to compare their props, themes, performance, and visual
              appearance. Use the toolbar to switch between comparison modes and export results.
            </p>
          </div>
        </div>
      </div>

      {/* Component Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ComponentSelector
          label="Component A"
          selectedComponent={leftComponent}
          onSelect={setLeftComponent}
          excludeComponent={rightComponent}
        />
        <ComponentSelector
          label="Component B"
          selectedComponent={rightComponent}
          onSelect={setRightComponent}
          excludeComponent={leftComponent}
        />
      </div>

      {/* Comparison Toolbar */}
      {leftComponent && rightComponent && (
        <ComparisonToolbar
          comparisonMode={comparisonMode}
          onModeChange={setComparisonMode}
          showPerformance={showPerformance}
          onTogglePerformance={setShowPerformance}
          showProps={showProps}
          onToggleProps={setShowProps}
          leftComponent={leftComponent}
          rightComponent={rightComponent}
        />
      )}

      {/* Comparison View */}
      {leftComponent && rightComponent ? (
        <ComparisonView
          leftComponent={leftComponent}
          rightComponent={rightComponent}
          mode={comparisonMode}
          showPerformance={showPerformance}
          showProps={showProps}
        />
      ) : (
        <div className="glass-card p-12 text-center">
          <GitCompare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Select Components to Compare</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose two components from the dropdowns above to start comparing their configurations,
            performance, and visual appearance.
          </p>
        </div>
      )}
    </div>
  )
}
