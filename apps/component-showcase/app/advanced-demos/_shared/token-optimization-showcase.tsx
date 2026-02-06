'use client'

import { useState, useMemo } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Coins,
  Eye,
  EyeOff,
  Zap,
  TrendingDown,
  FileText,
  Scissors,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Settings2,
} from 'lucide-react'
import {
  TokenOptimizationBadge,
  TokenOptimizationPanel,
  TokenOptimizationDashboard,
  TokenUsageMeterStatic as TokenUsageMeter,
  createEmptyStats,
  type TokenOptimizationStats,
  type OptimizationMetrics,
} from '@clarity-chat/token-optimization/react'
import type { TokenSettings } from './types'

interface TokenOptimizationShowcaseProps {
  settings: TokenSettings
  onUpdate: (settings: TokenSettings) => void
  className?: string
}

/** Derive simulated optimization stats from the current settings. */
function deriveStats(settings: TokenSettings): TokenOptimizationStats {
  if (!settings.optimizationEnabled) return createEmptyStats()

  const { techniques, used } = settings
  const activeCount =
    (techniques.compression ? 1 : 0) +
    (techniques.summarization ? 1 : 0) +
    (techniques.pruning ? 1 : 0)
  const savingsPercent = activeCount * 12 // ~12% per technique
  const saved = Math.floor(used.total * (savingsPercent / 100))

  return {
    tokensSaved: saved,
    costSavings: Number(((saved / 1000) * 0.005).toFixed(4)),
    percentageSaved: savingsPercent,
    cacheHits: techniques.compression ? Math.floor(used.total / 400) : 0,
    cacheMisses: Math.floor(used.total / 1200),
    requestsThrottled: 0,
    simpleModelRoutes: techniques.summarization
      ? Math.floor(used.total / 500)
      : 0,
    complexModelRoutes: Math.floor(used.total / 800),
  }
}

/** Derive simulated dashboard metrics from the current settings. */
function deriveMetrics(
  settings: TokenSettings,
  stats: TokenOptimizationStats
): OptimizationMetrics {
  const { techniques, used } = settings
  return {
    totalTokens: used.total,
    tokensSaved: stats.tokensSaved,
    costSaved: stats.costSavings,
    breakdown: {
      promptCompression: {
        tokens: techniques.compression
          ? Math.floor(stats.tokensSaved * 0.4)
          : 0,
        percent: techniques.compression ? 14 : 0,
      },
      caching: {
        hits: stats.cacheHits,
        savings: stats.cacheHits * 50,
      },
      modelRouting: {
        savings: stats.simpleModelRoutes * 30,
        percent: stats.simpleModelRoutes > 0 ? 10 : 0,
      },
      responseLimiting: {
        tokens: techniques.pruning ? Math.floor(stats.tokensSaved * 0.2) : 0,
        percent: techniques.pruning ? 7 : 0,
      },
      batching: { requests: 0, savings: 0 },
      throttling: { callsSaved: 0 },
      referencing: { bytesSaved: 0, percent: 0 },
    },
    savingsPercent: stats.percentageSaved,
  }
}

export function TokenOptimizationShowcase({
  settings,
  onUpdate,
  className,
}: TokenOptimizationShowcaseProps) {
  const [showSettings, setShowSettings] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)

  const usagePercent = Math.min(
    (settings.used.total / settings.budget) * 100,
    100
  )
  const estimatedCost = ((settings.used.total / 1000) * 0.005).toFixed(4)

  const stats = useMemo(() => deriveStats(settings), [settings])
  const metrics = useMemo(
    () => deriveMetrics(settings, stats),
    [settings, stats]
  )

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          Token Optimization
        </h4>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onUpdate({
                ...settings,
                showExpenditure: !settings.showExpenditure,
              })
            }
            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
            title={settings.showExpenditure ? 'Hide metrics' : 'Show metrics'}
          >
            {settings.showExpenditure ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Optimization Badge (library component) */}
      {settings.optimizationEnabled && stats.tokensSaved > 0 && (
        <TokenOptimizationBadge stats={stats} showCost size="sm" />
      )}

      {/* Optimization Toggle */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm">Enable Optimization</span>
        <button
          onClick={() =>
            onUpdate({
              ...settings,
              optimizationEnabled: !settings.optimizationEnabled,
            })
          }
          className={cn(
            'relative w-9 h-5 rounded-full transition-colors',
            settings.optimizationEnabled
              ? 'bg-green-500'
              : 'bg-muted-foreground/30'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
              settings.optimizationEnabled ? 'translate-x-4' : 'translate-x-0.5'
            )}
          />
        </button>
      </label>

      {/* Usage Meter (library component) */}
      {settings.showExpenditure && (
        <TokenUsageMeter
          usage={{
            promptTokens: settings.used.input,
            completionTokens: settings.used.output,
            totalTokens: settings.used.total,
          }}
          pricing={{
            modelId: 'gpt-4o',
            inputCostPer1K: 0.005,
            outputCostPer1K: 0.015,
          }}
          showCost
          showBreakdown
          className="rounded-lg"
        />
      )}

      {/* Settings Section (collapsible) */}
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        {showSettings ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <Settings2 className="h-3 w-3" />
        Settings
      </button>

      {showSettings && (
        <div className="space-y-3 pl-1">
          {/* Techniques */}
          {settings.optimizationEnabled && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Techniques
              </p>
              {[
                {
                  key: 'compression' as const,
                  label: 'Context Compression',
                  icon: Scissors,
                  desc: 'Reduce message sizes',
                },
                {
                  key: 'summarization' as const,
                  label: 'Auto Summarization',
                  icon: FileText,
                  desc: 'Summarize old messages',
                },
                {
                  key: 'pruning' as const,
                  label: 'Context Pruning',
                  icon: TrendingDown,
                  desc: 'Remove low-value context',
                },
              ].map((technique) => (
                <label
                  key={technique.key}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={settings.techniques[technique.key]}
                    onChange={() =>
                      onUpdate({
                        ...settings,
                        techniques: {
                          ...settings.techniques,
                          [technique.key]: !settings.techniques[technique.key],
                        },
                      })
                    }
                    className="rounded border-muted-foreground/30"
                  />
                  <technique.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{technique.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {technique.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Token Budget</span>
              <span className="font-mono">
                {settings.budget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={32000}
              step={1000}
              value={settings.budget}
              onChange={(e) =>
                onUpdate({ ...settings, budget: Number(e.target.value) })
              }
              className="w-full accent-primary h-1.5"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1K</span>
              <span>32K</span>
            </div>
          </div>
        </div>
      )}

      {/* Cost Breakdown (when expenditure visible) */}
      {settings.showExpenditure && (
        <div className="space-y-2 p-3 rounded-lg bg-muted/30">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Usage</span>
            <span className="font-mono">{usagePercent.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                usagePercent > 90
                  ? 'bg-red-500'
                  : usagePercent > 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="text-center">
              <div className="font-mono text-foreground">
                {settings.used.input.toLocaleString()}
              </div>
              <div className="text-muted-foreground">Input</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-foreground">
                {settings.used.output.toLocaleString()}
              </div>
              <div className="text-muted-foreground">Output</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-foreground">${estimatedCost}</div>
              <div className="text-muted-foreground">Est. Cost</div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Section (collapsible, library component) */}
      <button
        onClick={() => setShowDashboard(!showDashboard)}
        className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
      >
        {showDashboard ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        <BarChart3 className="h-3 w-3" />
        Optimization Dashboard
      </button>

      {showDashboard && (
        <div className="space-y-3">
          <TokenOptimizationDashboard
            metrics={metrics}
            showBreakdown
            className="rounded-lg text-xs"
          />
          {settings.optimizationEnabled && (
            <TokenOptimizationPanel
              stats={stats}
              showDetails
              showCacheStats
              showRoutingStats
              size="sm"
              className="rounded-lg"
            />
          )}
        </div>
      )}
    </div>
  )
}
