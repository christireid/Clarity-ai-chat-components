'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Zap, Play, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Controls component
function DemoControls({
  currentTokens,
  maxTokens,
  showCost,
  showPercentage,
  animate,
  onCurrentTokensChange,
  onMaxTokensChange,
  onShowCostChange,
  onShowPercentageChange,
  onAnimateChange,
  onReset,
  onSimulate,
}: {
  currentTokens: number
  maxTokens: number
  showCost: boolean
  showPercentage: boolean
  animate: boolean
  onCurrentTokensChange: (value: number) => void
  onMaxTokensChange: (value: number) => void
  onShowCostChange: (value: boolean) => void
  onShowPercentageChange: (value: boolean) => void
  onAnimateChange: (value: boolean) => void
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
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showCost}
            onChange={(e) => onShowCostChange(e.target.checked)}
            className="rounded"
          />
          Show Cost
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showPercentage}
            onChange={(e) => onShowPercentageChange(e.target.checked)}
            className="rounded"
          />
          Show Percentage
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={animate}
            onChange={(e) => onAnimateChange(e.target.checked)}
            className="rounded"
          />
          Animate
        </label>
        <button
          onClick={onSimulate}
          className="text-sm px-3 py-1.5 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors flex items-center gap-1.5"
          disabled={currentTokens >= maxTokens}
        >
          <Play className="w-3.5 h-3.5" />
          Simulate Streaming
        </button>
      </div>
    </div>
  )
}

// Demo display component
function MeterDisplay({
  currentTokens,
  maxTokens,
  showCost,
  showPercentage,
  animate,
}: {
  currentTokens: number
  maxTokens: number
  showCost: boolean
  showPercentage: boolean
  animate: boolean
}) {
  const percentage = Math.round((currentTokens / maxTokens) * 100)
  const estimatedCost = ((currentTokens / 1000) * 0.002).toFixed(4)

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
      <div className="p-6">
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Token Usage</span>
              {showPercentage && (
                <span className="font-mono font-semibold">{percentage}%</span>
              )}
            </div>

            <div className="relative h-3 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded-full transition-colors',
                  percentage < 50
                    ? 'bg-emerald-500'
                    : percentage < 80
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                )}
                initial={animate ? { width: 0 } : false}
                animate={{ width: `${percentage}%` }}
                transition={
                  animate
                    ? { duration: durations.slow, ease: 'easeOut' }
                    : { duration: 0 }
                }
                viewport={{ once: true }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-mono text-muted-foreground">
                {currentTokens.toLocaleString()} / {maxTokens.toLocaleString()}
              </span>
              {showCost && (
                <span className="text-muted-foreground">
                  Est. ${estimatedCost}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main LiveDemo component
function LiveDemo() {
  const [currentTokens, setCurrentTokens] = React.useState(1500)
  const [maxTokens, setMaxTokens] = React.useState(4000)
  const [showCost, setShowCost] = React.useState(true)
  const [showPercentage, setShowPercentage] = React.useState(true)
  const [animate, setAnimate] = React.useState(true)

  const handleReset = () => {
    setCurrentTokens(1500)
    setMaxTokens(4000)
    setShowCost(true)
    setShowPercentage(true)
    setAnimate(true)
  }

  const handleSimulateStreaming = () => {
    let tokens = currentTokens
    const interval = setInterval(() => {
      tokens += 50
      if (tokens >= maxTokens) {
        clearInterval(interval)
        tokens = maxTokens
      }
      setCurrentTokens(tokens)
    }, 100)
  }

  return (
    <div className="space-y-4">
      <DemoControls
        currentTokens={currentTokens}
        maxTokens={maxTokens}
        showCost={showCost}
        showPercentage={showPercentage}
        animate={animate}
        onCurrentTokensChange={setCurrentTokens}
        onMaxTokensChange={setMaxTokens}
        onShowCostChange={setShowCost}
        onShowPercentageChange={setShowPercentage}
        onAnimateChange={setAnimate}
        onReset={handleReset}
        onSimulate={handleSimulateStreaming}
      />
      <MeterDisplay
        currentTokens={currentTokens}
        maxTokens={maxTokens}
        showCost={showCost}
        showPercentage={showPercentage}
        animate={animate}
      />
    </div>
  )
}

export default function TokenUsageMeterAPIPage() {
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
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">TokenUsageMeter</h1>
              <p className="text-muted-foreground">
                Visual meter showing current token usage with cost estimates
              </p>
            </div>
          </div>

          {/* Component Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              The TokenUsageMeter component displays current token usage as a
              visual meter with percentage, cost estimates, and animated
              progress indicators. Perfect for showing users their current
              consumption at a glance.
            </p>
          </section>

          {/* Live Demo */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-brand-500" />
              <h2 className="text-2xl font-bold">Live Demo</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Interact with the controls below to see how the TokenUsageMeter
              responds to different configurations. Try simulating streaming to
              watch the meter animate in real-time.
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
                    <td className="p-3">Current number of tokens used</td>
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
                    <td className="p-3">Maximum token limit</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        showCost
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">false</code>
                    </td>
                    <td className="p-3">Show estimated cost</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        showPercentage
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">true</code>
                    </td>
                    <td className="p-3">Show usage percentage</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        animate
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">true</code>
                    </td>
                    <td className="p-3">Enable animations</td>
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
                <code>{`import { TokenUsageMeter } from '@clarity-chat/react'

function MyComponent() {
  return (
    <TokenUsageMeter
      currentTokens={1500}
      maxTokens={4000}
      showCost
      showPercentage
      animate
    />
  )
}`}</code>
              </pre>
            </div>
          </section>

          {/* With Streaming */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">With Streaming</h2>
            <p className="text-muted-foreground mb-4">
              TokenUsageMeter updates in real-time as streaming responses
              arrive:
            </p>
            <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
              <pre className="text-sm">
                <code>{`import { TokenUsageMeter } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function StreamingChat() {
  const { tokenTracker } = useClarityChat({ 
    api: '/api/chat',
    streaming: true 
  })

  return (
    <TokenUsageMeter
      currentTokens={tokenTracker.tokenCount}
      maxTokens={8000}
      showCost
      animate
    />
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
