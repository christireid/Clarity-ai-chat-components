'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Target, Play, RotateCcw, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Controls component
function BudgetControls({
  currentTokens,
  maxTokens,
  warningThreshold,
  showLabels,
  showWarning,
  onCurrentTokensChange,
  onMaxTokensChange,
  onWarningThresholdChange,
  onShowLabelsChange,
  onShowWarningChange,
  onReset,
  onSimulate,
}: {
  currentTokens: number
  maxTokens: number
  warningThreshold: number
  showLabels: boolean
  showWarning: boolean
  onCurrentTokensChange: (value: number) => void
  onMaxTokensChange: (value: number) => void
  onWarningThresholdChange: (value: number) => void
  onShowLabelsChange: (value: boolean) => void
  onShowWarningChange: (value: boolean) => void
  onReset: () => void
  onSimulate: () => void
}) {
  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Controls</span>
        <button
          onClick={onReset}
          className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded hover:bg-muted/50 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-2">
            Current Tokens: {currentTokens}
          </label>
          <input
            type="range"
            min="0"
            max={maxTokens}
            value={currentTokens}
            onChange={(e) => onCurrentTokensChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-2">
            Max Tokens: {maxTokens}
          </label>
          <input
            type="range"
            min="1000"
            max="8000"
            step="1000"
            value={maxTokens}
            onChange={(e) => onMaxTokensChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-2">
            Warning Threshold: {(warningThreshold * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={warningThreshold}
            onChange={(e) => onWarningThresholdChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => onShowLabelsChange(e.target.checked)}
            className="rounded"
          />
          Show Labels
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showWarning}
            onChange={(e) => onShowWarningChange(e.target.checked)}
            className="rounded"
          />
          Show Warning
        </label>
        <button
          onClick={onSimulate}
          className="text-sm px-3 py-1.5 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          Simulate Usage
        </button>
      </div>
    </div>
  )
}

// Budget bar display component
function BudgetBarDisplay({
  currentTokens,
  maxTokens,
  warningThreshold,
  showLabels,
  showWarning,
}: {
  currentTokens: number
  maxTokens: number
  warningThreshold: number
  showLabels: boolean
  showWarning: boolean
}) {
  const percentage = (currentTokens / maxTokens) * 100
  const isWarning = percentage >= warningThreshold * 100
  const isCritical = percentage >= 95

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="space-y-3">
            {showLabels && (
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Token Budget</span>
                <span
                  className={cn(
                    'font-mono font-semibold',
                    isCritical
                      ? 'text-red-500'
                      : isWarning
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                  )}
                >
                  {currentTokens.toLocaleString()} /{' '}
                  {maxTokens.toLocaleString()}
                </span>
              </div>
            )}

            <div className="relative">
              <div className="relative h-4 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className={cn(
                    'h-full rounded-full transition-colors',
                    isCritical
                      ? 'bg-red-500'
                      : isWarning
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: durations.slow, ease: 'easeOut' }}
                  viewport={{ once: true }}
                />

                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-600/50"
                  style={{ left: `${warningThreshold * 100}%` }}
                />
              </div>

              {showLabels && (
                <div
                  className="absolute -top-6 text-xs text-amber-600 dark:text-amber-400"
                  style={{
                    left: `${warningThreshold * 100}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  Warning
                </div>
              )}
            </div>

            {showWarning && isWarning && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                  'flex items-start gap-2 p-3 rounded-lg text-sm',
                  isCritical
                    ? 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                )}
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  {isCritical
                    ? 'Critical: Token budget exceeded! Consider upgrading your plan.'
                    : 'Warning: Approaching token budget limit. Usage may be throttled.'}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main LiveDemo component
function LiveDemo() {
  const [currentTokens, setCurrentTokens] = React.useState(3200)
  const [maxTokens, setMaxTokens] = React.useState(4000)
  const [warningThreshold, setWarningThreshold] = React.useState(0.8)
  const [showLabels, setShowLabels] = React.useState(true)
  const [showWarning, setShowWarning] = React.useState(true)

  const handleReset = () => {
    setCurrentTokens(3200)
    setMaxTokens(4000)
    setWarningThreshold(0.8)
    setShowLabels(true)
    setShowWarning(true)
  }

  const handleSimulateBudgetUsage = () => {
    let tokens = 0
    const interval = setInterval(() => {
      tokens += 200
      if (tokens >= maxTokens) {
        clearInterval(interval)
        tokens = maxTokens
      }
      setCurrentTokens(tokens)
    }, 150)
  }

  return (
    <div className="space-y-4">
      <BudgetControls
        currentTokens={currentTokens}
        maxTokens={maxTokens}
        warningThreshold={warningThreshold}
        showLabels={showLabels}
        showWarning={showWarning}
        onCurrentTokensChange={setCurrentTokens}
        onMaxTokensChange={setMaxTokens}
        onWarningThresholdChange={setWarningThreshold}
        onShowLabelsChange={setShowLabels}
        onShowWarningChange={setShowWarning}
        onReset={handleReset}
        onSimulate={handleSimulateBudgetUsage}
      />
      <BudgetBarDisplay
        currentTokens={currentTokens}
        maxTokens={maxTokens}
        warningThreshold={warningThreshold}
        showLabels={showLabels}
        showWarning={showWarning}
      />
    </div>
  )
}

export default function TokenBudgetBarAPIPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        <Link
          href="/guides/token-optimization"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Token Optimization Guide
        </Link>

        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-amber-600">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">TokenBudgetBar</h1>
              <p className="text-muted-foreground">
                Budget visualization with warning thresholds and limit
                enforcement
              </p>
            </div>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              The TokenBudgetBar component displays token budget consumption
              with configurable warning thresholds, visual indicators, and
              alerts when approaching or exceeding limits.
            </p>
          </section>

          {/* Live Demo */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-brand-500" />
              <h2 className="text-2xl font-bold">Live Demo</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Adjust the controls to see how the budget bar responds to
              different thresholds and usage levels. Watch the warning
              indicators trigger as you approach the limit.
            </p>
            <LiveDemo />
          </section>

          {/* Props */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Props</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Prop</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Default</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        currentTokens
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">number</code>
                    </td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Current tokens consumed</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        maxTokens
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">number</code>
                    </td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Maximum token budget</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        warningThreshold
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">number</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">0.8</code>
                    </td>
                    <td className="p-3">Threshold (0-1) to trigger warning</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        showLabels
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">true</code>
                    </td>
                    <td className="p-3">Show token count labels</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        showWarning
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">true</code>
                    </td>
                    <td className="p-3">Display warning alerts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Basic Usage */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
            <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
              <pre className="text-sm">
                <code>{`import { TokenBudgetBar } from '@clarity-chat/react'

function MyComponent() {
  return (
    <TokenBudgetBar
      currentTokens={3200}
      maxTokens={4000}
      warningThreshold={0.8}
      showLabels
      showWarning
    />
  )
}`}</code>
              </pre>
            </div>
          </section>

          {/* With Real-time Tracking */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">With Real-time Tracking</h2>
            <p className="text-muted-foreground mb-4">
              Connect to your chat's token tracker for live budget monitoring:
            </p>
            <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
              <pre className="text-sm">
                <code>{`import { TokenBudgetBar } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function ChatWithBudget() {
  const { tokenTracker } = useClarityChat({
    api: '/api/chat',
    maxTokens: 4000,
  })

  return (
    <div>
      <TokenBudgetBar
        currentTokens={tokenTracker.tokenCount}
        maxTokens={4000}
        warningThreshold={0.85}
        showLabels
        showWarning
      />
      {/* Chat interface */}
    </div>
  )
}`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
