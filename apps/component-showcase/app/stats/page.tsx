'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/component-section'
import {
  PieChart,
  Component,
  Puzzle,
  Layers,
  Link2,
  FileCode,
} from 'lucide-react'
import { buildSearchIndex, type SearchEntry } from '@/data/search-index'

// ---------------------------------------------------------------------------
// Bar Chart (pure CSS)
// ---------------------------------------------------------------------------

function BarChart({
  data,
  maxValue,
}: {
  data: Array<{ label: string; value: number; color?: string }>
  maxValue?: number
}) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-28 truncate text-right">
            {d.label}
          </span>
          <div className="flex-1 h-5 bg-muted/30 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/70 transition-all duration-700 ease-out"
              style={{ width: `${Math.max(2, (d.value / max) * 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground w-8 text-right">
            {d.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------

function StatBox({
  value,
  label,
  icon: Icon,
}: {
  value: string | number
  label: string
  icon: React.ElementType
}) {
  return (
    <div className="glass-card p-5 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-2">
        <div className="icon-container-sm">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold gradient-text">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Type Distribution Ring (CSS-based)
// ---------------------------------------------------------------------------

function TypeRing({
  components,
  hooks,
  primitives,
}: {
  components: number
  hooks: number
  primitives: number
}) {
  const total = components + hooks + primitives
  if (total === 0) return null
  const pctComponents = Math.round((components / total) * 100)
  const pctHooks = Math.round((hooks / total) * 100)
  const pctPrimitives = 100 - pctComponents - pctHooks

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="hsl(var(--primary) / 0.3)"
            strokeWidth="3"
            strokeDasharray={`${pctComponents} ${100 - pctComponents}`}
            strokeDashoffset="0"
          />
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="hsl(280 100% 70% / 0.5)"
            strokeWidth="3"
            strokeDasharray={`${pctHooks} ${100 - pctHooks}`}
            strokeDashoffset={`${-pctComponents}`}
          />
          <circle
            cx="18"
            cy="18"
            r="15.915"
            fill="none"
            stroke="hsl(200 100% 60% / 0.5)"
            strokeWidth="3"
            strokeDasharray={`${pctPrimitives} ${100 - pctPrimitives}`}
            strokeDashoffset={`${-(pctComponents + pctHooks)}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">{total}</span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary/50" />
          <span>Components ({components})</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: 'hsl(280 100% 70% / 0.5)' }}
          />
          <span>Hooks ({hooks})</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: 'hsl(200 100% 60% / 0.5)' }}
          />
          <span>Primitives ({primitives})</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StatsPage() {
  const [index, setIndex] = useState<SearchEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    buildSearchIndex()
      .then(setIndex)
      .catch((err) => console.error('[StatsPage] Failed to load index:', err))
      .finally(() => setLoading(false))
  }, [])

  // Derive metrics from the search index
  const totalDocs = index.length
  const components = index.filter((e) => e.type === 'component').length
  const hooks = index.filter((e) => e.type === 'hook').length
  const primitives = index.filter((e) => e.type === 'primitive').length
  const categories = [...new Set(index.map((e) => e.category))].length
  const withSource = index.filter((e) => e.hasSource).length

  // Per-category counts
  const categoryCounts = [
    ...index.reduce((map, e) => {
      map.set(e.category, (map.get(e.category) ?? 0) + 1)
      return map
    }, new Map<string, number>()),
  ]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)

  // Per-section counts (top 15)
  const sectionCounts = [
    ...index.reduce((map, e) => {
      map.set(e.section, (map.get(e.section) ?? 0) + 1)
      return map
    }, new Map<string, number>()),
  ]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15)

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Library Statistics"
          description="Health metrics and coverage analysis for the component library."
          icon={PieChart}
          badge="Dashboard"
        />
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          Loading statistics...
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Library Statistics"
        description="Health metrics and coverage analysis for the component library."
        icon={PieChart}
        badge="Dashboard"
      />

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox value={totalDocs} label="Documented entries" icon={FileCode} />
        <StatBox value={components} label="Components" icon={Component} />
        <StatBox value={hooks} label="Hooks" icon={Puzzle} />
        <StatBox value={categories} label="Categories" icon={Layers} />
      </div>

      {/* Type Distribution + Source Coverage */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Type Distribution</h3>
          <TypeRing
            components={components}
            hooks={hooks}
            primitives={primitives}
          />
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Source Coverage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Linked to source code</span>
                <span className="font-mono text-muted-foreground">
                  {withSource} / {totalDocs}
                </span>
              </div>
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500/60"
                  style={{
                    width: `${totalDocs > 0 ? Math.min(100, Math.round((withSource / totalDocs) * 100)) : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>With props documentation</span>
                <span className="font-mono text-muted-foreground">
                  {totalDocs} entries
                </span>
              </div>
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/60"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
              <Link2 className="h-3.5 w-3.5" />
              <span>Source links point to GitHub repository files</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Components per Category</h3>
        <BarChart data={categoryCounts} />
      </div>

      {/* Top Sections */}
      <div className="glass-card p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Largest Documentation Sections
        </h3>
        <BarChart data={sectionCounts} />
      </div>
    </div>
  )
}
