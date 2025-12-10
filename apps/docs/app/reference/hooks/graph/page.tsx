'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  hookMetadata,
  categoryConfig,
  type HookMetadata,
  type HookCategory,
} from '@/lib/hook-metadata'
import { FeedbackWidget } from '@/components/FeedbackWidget'

// Build adjacency list for the graph
function buildGraph(): Map<string, string[]> {
  const graph = new Map<string, string[]>()

  hookMetadata.forEach((hook) => {
    graph.set(hook.name, hook.relatedHooks || [])
  })

  return graph
}

// Get color for category
function getCategoryColor(category: HookCategory): string {
  const colors: Record<HookCategory, string> = {
    'top-level': '#6366f1', // indigo
    chat: '#f59e0b', // amber
    memory: '#10b981', // emerald
    streaming: '#3b82f6', // blue
    ui: '#a855f7', // purple
    utility: '#6b7280', // gray
    agent: '#f97316', // orange
    storage: '#06b6d4', // cyan
    performance: '#ef4444', // red
  }
  return colors[category] || '#6b7280'
}

function HookNode({
  hook,
  isSelected,
  isHighlighted,
  onClick,
}: {
  hook: HookMetadata
  isSelected: boolean
  isHighlighted: boolean
  onClick: () => void
}) {
  const color = getCategoryColor(hook.category)

  return (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-2 rounded-lg text-sm font-mono transition-all duration-200
        ${isSelected ? 'ring-2 ring-offset-2 ring-brand-500 scale-105' : ''}
        ${isHighlighted ? 'opacity-100' : isSelected ? 'opacity-100' : 'opacity-60'}
        hover:opacity-100 hover:scale-105
      `}
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
        borderWidth: '2px',
        color: color,
      }}
    >
      {hook.name}
      {hook.relatedHooks && hook.relatedHooks.length > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-muted rounded-full text-xs flex items-center justify-center text-muted-foreground">
          {hook.relatedHooks.length}
        </span>
      )}
    </button>
  )
}

function ConnectionLine({
  from,
  to,
  isActive,
}: {
  from: string
  to: string
  isActive: boolean
}) {
  // This is a simplified representation - in a real implementation
  // you'd calculate actual positions
  return null // We'll use a different approach below
}

function HookDetails({ hook }: { hook: HookMetadata }) {
  const config = categoryConfig[hook.category]

  return (
    <div className="border rounded-lg p-4 bg-muted/50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-mono font-bold text-lg">{hook.name}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${config.colorClass}`}
          style={{ backgroundColor: `${getCategoryColor(hook.category)}20` }}
        >
          {config.label}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{hook.description}</p>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Signature</p>
          <code className="text-xs bg-background px-2 py-1 rounded block overflow-x-auto">
            {hook.signature}
          </code>
        </div>

        {hook.useCases && hook.useCases.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Use Cases</p>
            <ul className="text-sm space-y-1">
              {hook.useCases.map((uc, i) => (
                <li key={i} className="text-muted-foreground">• {uc}</li>
              ))}
            </ul>
          </div>
        )}

        {hook.relatedHooks && hook.relatedHooks.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
              Related Hooks ({hook.relatedHooks.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {hook.relatedHooks.map((name) => (
                <span
                  key={name}
                  className="text-xs bg-background px-2 py-1 rounded font-mono"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 border-t">
          <Link
            href={hook.href}
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
          >
            View full documentation →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function HookGraphPage() {
  const [selectedHook, setSelectedHook] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<HookCategory | 'all'>('all')

  const graph = useMemo(() => buildGraph(), [])

  const filteredHooks = useMemo(() => {
    if (filterCategory === 'all') return hookMetadata
    return hookMetadata.filter((h) => h.category === filterCategory)
  }, [filterCategory])

  const groupedHooks = useMemo(() => {
    const groups: Record<HookCategory, HookMetadata[]> = {} as Record<HookCategory, HookMetadata[]>
    filteredHooks.forEach((hook) => {
      if (!groups[hook.category]) {
        groups[hook.category] = []
      }
      groups[hook.category].push(hook)
    })
    return groups
  }, [filteredHooks])

  const selectedHookData = useMemo(
    () => hookMetadata.find((h) => h.name === selectedHook),
    [selectedHook]
  )

  const highlightedHooks = useMemo(() => {
    if (!selectedHook) return new Set<string>()
    const related = graph.get(selectedHook) || []
    const highlighted = new Set([selectedHook, ...related])

    // Also highlight hooks that reference the selected hook
    hookMetadata.forEach((hook) => {
      if (hook.relatedHooks?.includes(selectedHook)) {
        highlighted.add(hook.name)
      }
    })

    return highlighted
  }, [selectedHook, graph])

  const categories = Object.keys(categoryConfig) as HookCategory[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Hook Relationship Graph</h1>
        <p className="text-xl text-muted-foreground">
          Visualize how hooks relate to each other. Click on a hook to see its connections.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-sm text-muted-foreground mr-2">Filter by category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as HookCategory | 'all')}
            className="px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryConfig[cat].label}
              </option>
            ))}
          </select>
        </div>

        {selectedHook && (
          <button
            onClick={() => setSelectedHook(null)}
            className="px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <p className="text-sm font-semibold mb-2">Category Legend:</p>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getCategoryColor(cat) }}
              />
              <span className="text-xs">{categoryConfig[cat].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-2 border rounded-lg p-6 bg-background min-h-[500px]">
          <div className="space-y-6">
            {(Object.keys(groupedHooks) as HookCategory[]).map((category) => {
              const hooks = groupedHooks[category]
              if (!hooks || hooks.length === 0) return null

              return (
                <div key={category}>
                  <h3
                    className="text-sm font-semibold mb-3"
                    style={{ color: getCategoryColor(category) }}
                  >
                    {categoryConfig[category].label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hooks.map((hook) => (
                      <HookNode
                        key={hook.name}
                        hook={hook}
                        isSelected={selectedHook === hook.name}
                        isHighlighted={
                          selectedHook === null || highlightedHooks.has(hook.name)
                        }
                        onClick={() =>
                          setSelectedHook(
                            selectedHook === hook.name ? null : hook.name
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Connection indicators when a hook is selected */}
          {selectedHook && selectedHookData?.relatedHooks && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-semibold mb-2">
                Connections from {selectedHook}:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedHookData.relatedHooks.map((related) => (
                  <div key={related} className="flex items-center gap-2">
                    <span className="text-brand-500">→</span>
                    <button
                      onClick={() => setSelectedHook(related)}
                      className="text-sm font-mono text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      {related}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-1">
          {selectedHookData ? (
            <HookDetails hook={selectedHookData} />
          ) : (
            <div className="border rounded-lg p-6 text-center text-muted-foreground">
              <svg
                className="w-12 h-12 mx-auto mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="font-medium mb-2">Select a hook</p>
              <p className="text-sm">
                Click on any hook in the graph to see its details and connections.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-brand-600">{hookMetadata.length}</p>
          <p className="text-sm text-muted-foreground">Total Hooks</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-brand-600">{categories.length}</p>
          <p className="text-sm text-muted-foreground">Categories</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-brand-600">
            {hookMetadata.filter((h) => h.relatedHooks && h.relatedHooks.length > 0).length}
          </p>
          <p className="text-sm text-muted-foreground">With Connections</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-brand-600">
            {hookMetadata.reduce((acc, h) => acc + (h.relatedHooks?.length || 0), 0)}
          </p>
          <p className="text-sm text-muted-foreground">Total Connections</p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 pt-8 border-t flex gap-4 text-sm">
        <Link href="/reference/hooks" className="text-brand-600 dark:text-brand-400 hover:underline">
          ← All Hooks
        </Link>
        <Link href="/reference/hooks/selector" className="text-brand-600 dark:text-brand-400 hover:underline">
          Hook Selector →
        </Link>
        <Link href="/reference/hooks/compare" className="text-brand-600 dark:text-brand-400 hover:underline">
          Compare Hooks →
        </Link>
      </div>

      {/* Feedback Widget */}
      <FeedbackWidget pageId="hooks-graph" className="mt-12" />
    </div>
  )
}
