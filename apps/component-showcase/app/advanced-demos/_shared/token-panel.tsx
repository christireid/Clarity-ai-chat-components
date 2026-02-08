'use client'

import { cn } from '@clarity-chat/primitives'
import {
  Coins,
  Eye,
  EyeOff,
  Zap,
  TrendingDown,
  FileText,
  Scissors,
} from 'lucide-react'
import type { TokenSettings } from './types'

interface TokenPanelProps {
  settings: TokenSettings
  onUpdate: (settings: TokenSettings) => void
  className?: string
}

export function TokenPanel({ settings, onUpdate, className }: TokenPanelProps) {
  const usagePercent = Math.min((settings.used.total / settings.budget) * 100, 100)
  const estimatedCost = ((settings.used.total / 1000) * 0.005).toFixed(4)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold flex items-center gap-2">
          <Coins className="h-4 w-4 text-yellow-500" />
          Token Optimization
        </h4>
        <button
          onClick={() => onUpdate({ ...settings, showExpenditure: !settings.showExpenditure })}
          className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
          title={settings.showExpenditure ? 'Hide expenditure' : 'Show expenditure'}
        >
          {settings.showExpenditure ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Optimization Toggle */}
      <label className="flex items-center justify-between cursor-pointer">
        <span className="text-sm">Enable Optimization</span>
        <button
          onClick={() => onUpdate({ ...settings, optimizationEnabled: !settings.optimizationEnabled })}
          className={cn(
            'relative w-9 h-5 rounded-full transition-colors',
            settings.optimizationEnabled ? 'bg-green-500' : 'bg-muted-foreground/30'
          )}
        >
          <div className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm',
            settings.optimizationEnabled ? 'translate-x-4' : 'translate-x-0.5'
          )} />
        </button>
      </label>

      {/* Techniques */}
      {settings.optimizationEnabled && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Techniques</p>
          {[
            { key: 'compression' as const, label: 'Context Compression', icon: Scissors, desc: 'Reduce message sizes' },
            { key: 'summarization' as const, label: 'Auto Summarization', icon: FileText, desc: 'Summarize old messages' },
            { key: 'pruning' as const, label: 'Context Pruning', icon: TrendingDown, desc: 'Remove low-value context' },
          ].map(technique => (
            <label key={technique.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={settings.techniques[technique.key]}
                onChange={() => onUpdate({
                  ...settings,
                  techniques: { ...settings.techniques, [technique.key]: !settings.techniques[technique.key] }
                })}
                className="rounded border-muted-foreground/30"
              />
              <technique.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm">{technique.label}</div>
                <div className="text-xs text-muted-foreground">{technique.desc}</div>
              </div>
            </label>
          ))}
        </div>
      )}

      {/* Budget Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Token Budget</span>
          <span className="font-mono">{settings.budget.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={32000}
          step={1000}
          value={settings.budget}
          onChange={e => onUpdate({ ...settings, budget: Number(e.target.value) })}
          className="w-full accent-primary h-1.5"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1K</span>
          <span>32K</span>
        </div>
      </div>

      {/* Usage Meter */}
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
                usagePercent > 90 ? 'bg-red-500' : usagePercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="text-center">
              <div className="font-mono text-foreground">{settings.used.input.toLocaleString()}</div>
              <div className="text-muted-foreground">Input</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-foreground">{settings.used.output.toLocaleString()}</div>
              <div className="text-muted-foreground">Output</div>
            </div>
            <div className="text-center">
              <div className="font-mono text-foreground">${estimatedCost}</div>
              <div className="text-muted-foreground">Est. Cost</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
