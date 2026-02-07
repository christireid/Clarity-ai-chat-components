'use client'

import { memo } from 'react'
import { cn } from '@clarity-chat/primitives'
import { Brain, Database, Layers, Trash2, Activity } from 'lucide-react'
import type { MemorySettings } from './types'

interface MemoryPanelProps {
  settings: MemorySettings
  onUpdate: (settings: MemorySettings) => void
  extraToggles?: Array<{ key: string; label: string; checked: boolean }>
  onExtraToggle?: (key: string) => void
  className?: string
}

export const MemoryPanel = memo(function MemoryPanel({
  settings,
  onUpdate,
  extraToggles,
  onExtraToggle,
  className,
}: MemoryPanelProps) {
  const usagePercent = Math.min(
    (settings.usage / settings.maxTokens) * 100,
    100
  )

  return (
    <div className={cn('space-y-4', className)}>
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Brain className="h-4 w-4 text-purple-500" />
        Memory
      </h4>

      {/* Enable Toggle */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm">Enable Memory</span>
        <button
          onClick={() => onUpdate({ ...settings, enabled: !settings.enabled })}
          className={cn(
            'relative w-9 h-5 rounded-full transition-colors',
            settings.enabled ? 'bg-purple-500' : 'bg-muted-foreground/30'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
              settings.enabled ? 'translate-x-4' : 'translate-x-0.5'
            )}
          />
        </button>
      </label>

      {settings.enabled && (
        <>
          {/* Strategy */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Strategy
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                {
                  value: 'sliding-window' as const,
                  label: 'Sliding Window',
                  icon: Layers,
                  desc: 'Recent messages only',
                },
                {
                  value: 'semantic-chunks' as const,
                  label: 'Semantic Chunks',
                  icon: Database,
                  desc: 'Similarity-based retrieval',
                },
                {
                  value: 'vector-store' as const,
                  label: 'Vector Store',
                  icon: Activity,
                  desc: 'Full semantic search',
                },
              ].map((strategy) => (
                <button
                  key={strategy.value}
                  onClick={() =>
                    onUpdate({ ...settings, strategy: strategy.value })
                  }
                  className={cn(
                    'flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors text-sm',
                    settings.strategy === strategy.value
                      ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/30'
                      : 'hover:bg-muted/50'
                  )}
                >
                  <strategy.icon className="h-3.5 w-3.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs">{strategy.label}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {strategy.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Max Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Max Memory Tokens</span>
              <span className="font-mono">
                {settings.maxTokens.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={512}
              max={16384}
              step={512}
              value={settings.maxTokens}
              onChange={(e) =>
                onUpdate({ ...settings, maxTokens: Number(e.target.value) })
              }
              className="w-full accent-purple-500 h-1.5"
            />
          </div>

          {/* Extra Toggles */}
          {extraToggles && extraToggles.length > 0 && (
            <div className="space-y-1.5">
              {extraToggles.map((toggle) => (
                <label
                  key={toggle.key}
                  className="flex items-center justify-between cursor-pointer py-1"
                >
                  <span className="text-xs">{toggle.label}</span>
                  <button
                    onClick={() => onExtraToggle?.(toggle.key)}
                    className={cn(
                      'relative w-8 h-4 rounded-full transition-colors',
                      toggle.checked
                        ? 'bg-purple-500'
                        : 'bg-muted-foreground/30'
                    )}
                  >
                    <div
                      className={cn(
                        'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm',
                        toggle.checked ? 'translate-x-4' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </label>
              ))}
            </div>
          )}

          {/* Usage Indicator */}
          <div className="p-2.5 rounded-lg bg-muted/30 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Memory Usage</span>
              <span className="font-mono text-xs">
                {settings.usage.toLocaleString()} /{' '}
                {settings.maxTokens.toLocaleString()}
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-500"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>

          {/* Clear Memory */}
          <button
            onClick={() => onUpdate({ ...settings, usage: 0 })}
            className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 transition-colors w-full justify-center py-1.5 rounded-lg hover:bg-red-500/5"
          >
            <Trash2 className="h-3 w-3" />
            Clear Memory
          </button>
        </>
      )}
    </div>
  )
})
