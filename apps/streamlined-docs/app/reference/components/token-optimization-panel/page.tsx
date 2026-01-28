'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Sparkles,
  Play,
  RotateCcw,
  TrendingDown,
  Lightbulb,
  BarChart3,
  Settings,
  CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Controls component
function OptimizationControls({
  currentTokens,
  maxTokens,
  messageCount,
  showSuggestions,
  showStats,
  onCurrentTokensChange,
  onMaxTokensChange,
  onMessageCountChange,
  onShowSuggestionsChange,
  onShowStatsChange,
  onReset,
}: {
  currentTokens: number
  maxTokens: number
  messageCount: number
  showSuggestions: boolean
  showStats: boolean
  onCurrentTokensChange: (value: number) => void
  onMaxTokensChange: (value: number) => void
  onMessageCountChange: (value: number) => void
  onShowSuggestionsChange: (value: boolean) => void
  onShowStatsChange: (value: boolean) => void
  onReset: () => void
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            Messages: {messageCount}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={messageCount}
            onChange={(e) => onMessageCountChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showSuggestions}
            onChange={(e) => onShowSuggestionsChange(e.target.checked)}
            className="rounded"
          />
          Show Suggestions
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showStats}
            onChange={(e) => onShowStatsChange(e.target.checked)}
            className="rounded"
          />
          Show Statistics
        </label>
      </div>
    </div>
  )
}

// Statistics Grid component
function StatisticsGrid({
  avgTokensPerMessage,
  estimatedMessagesRemaining,
  projectedCost,
}: {
  avgTokensPerMessage: number
  estimatedMessagesRemaining: number
  projectedCost: string
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Avg per Message</span>
        </div>
        <div className="text-2xl font-bold">{avgTokensPerMessage}</div>
        <p className="text-xs text-muted-foreground mt-1">tokens</p>
      </div>

      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Remaining</span>
        </div>
        <div className="text-2xl font-bold">{estimatedMessagesRemaining}</div>
        <p className="text-xs text-muted-foreground mt-1">messages est.</p>
      </div>

      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Est. Cost</span>
        </div>
        <div className="text-2xl font-bold">${projectedCost}</div>
        <p className="text-xs text-muted-foreground mt-1">current</p>
      </div>
    </div>
  )
}

// Optimization Suggestions component
function OptimizationSuggestions({
  suggestions,
}: {
  suggestions: Array<{
    id: number
    title: string
    description: string
    savings: number
    priority: string
  }>
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h4 className="font-semibold text-sm">Optimization Suggestions</h4>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn(
              'p-4 rounded-lg border',
              suggestion.priority === 'high'
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-muted/30 border-border/50'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className="font-medium text-sm">{suggestion.title}</h5>
                  {suggestion.priority === 'high' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300">
                      High Priority
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
              {suggestion.savings > 0 && (
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    -{suggestion.savings}
                  </div>
                  <p className="text-xs text-muted-foreground">tokens</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Panel Display component
function PanelDisplay({
  currentTokens,
  maxTokens,
  messageCount,
  showStats,
  showSuggestions,
  avgTokensPerMessage,
  estimatedMessagesRemaining,
  projectedCost,
  suggestions,
}: {
  currentTokens: number
  maxTokens: number
  messageCount: number
  showStats: boolean
  showSuggestions: boolean
  avgTokensPerMessage: number
  estimatedMessagesRemaining: number
  projectedCost: string
  suggestions: Array<{
    id: number
    title: string
    description: string
    savings: number
    priority: string
  }>
}) {
  const percentage = (currentTokens / maxTokens) * 100

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-500/10">
              <Sparkles className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h3 className="font-semibold">Token Optimization</h3>
              <p className="text-sm text-muted-foreground">
                {messageCount} messages • {currentTokens.toLocaleString()}{' '}
                tokens
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{percentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Used</p>
          </div>
        </div>

        {showStats && (
          <StatisticsGrid
            avgTokensPerMessage={avgTokensPerMessage}
            estimatedMessagesRemaining={estimatedMessagesRemaining}
            projectedCost={projectedCost}
          />
        )}

        {showSuggestions && (
          <OptimizationSuggestions suggestions={suggestions} />
        )}

        <button className="w-full py-2.5 px-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Apply Optimizations
        </button>
      </div>
    </div>
  )
}

// Main LiveDemo component
function LiveDemo() {
  const [currentTokens, setCurrentTokens] = React.useState(2500)
  const [maxTokens, setMaxTokens] = React.useState(4000)
  const [messageCount, setMessageCount] = React.useState(15)
  const [showSuggestions, setShowSuggestions] = React.useState(true)
  const [showStats, setShowStats] = React.useState(true)

  const percentage = (currentTokens / maxTokens) * 100
  const avgTokensPerMessage = Math.round(currentTokens / messageCount)
  const estimatedMessagesRemaining = Math.floor(
    (maxTokens - currentTokens) / avgTokensPerMessage
  )
  const projectedCost = ((currentTokens / 1000) * 0.002).toFixed(4)

  const suggestions = [
    {
      id: 1,
      title: 'Reduce context window',
      description:
        'Limiting conversation history to last 10 messages could save ~20% tokens',
      savings: Math.round(currentTokens * 0.2),
      priority: percentage > 70 ? 'high' : 'medium',
    },
    {
      id: 2,
      title: 'Enable streaming',
      description:
        'Streaming responses can reduce perceived latency and allows early cancellation',
      savings: 0,
      priority: 'low',
    },
    {
      id: 3,
      title: 'Use prompt compression',
      description:
        'Compress repeated patterns in prompts to reduce token usage by ~15%',
      savings: Math.round(currentTokens * 0.15),
      priority: percentage > 50 ? 'high' : 'low',
    },
  ]

  const handleReset = () => {
    setCurrentTokens(2500)
    setMaxTokens(4000)
    setMessageCount(15)
    setShowSuggestions(true)
    setShowStats(true)
  }

  return (
    <div className="space-y-4">
      <OptimizationControls
        currentTokens={currentTokens}
        maxTokens={maxTokens}
        messageCount={messageCount}
        showSuggestions={showSuggestions}
        showStats={showStats}
        onCurrentTokensChange={setCurrentTokens}
        onMaxTokensChange={setMaxTokens}
        onMessageCountChange={setMessageCount}
        onShowSuggestionsChange={setShowSuggestions}
        onShowStatsChange={setShowStats}
        onReset={handleReset}
      />
      <PanelDisplay
        currentTokens={currentTokens}
        maxTokens={maxTokens}
        messageCount={messageCount}
        showStats={showStats}
        showSuggestions={showSuggestions}
        avgTokensPerMessage={avgTokensPerMessage}
        estimatedMessagesRemaining={estimatedMessagesRemaining}
        projectedCost={projectedCost}
        suggestions={suggestions}
      />
    </div>
  )
}

export default function TokenOptimizationPanelAPIPage() {
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
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">TokenOptimizationPanel</h1>
              <p className="text-muted-foreground">
                Comprehensive panel with optimization tips, suggestions, and
                statistics
              </p>
            </div>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              The TokenOptimizationPanel provides a complete dashboard for
              monitoring and optimizing token usage. It displays statistics,
              actionable suggestions, and cost projections to help reduce token
              consumption.
            </p>
          </section>

          {/* Live Demo */}
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-brand-500" />
              <h2 className="text-2xl font-bold">Live Demo</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Interact with the panel to see optimization suggestions adapt
              based on usage patterns. Notice how high-priority suggestions
              appear when token usage exceeds thresholds.
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
                    <td className="p-3">Current token count</td>
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
                        messages
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">Message[]</code>
                    </td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Conversation messages for analysis</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        showSuggestions
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">true</code>
                    </td>
                    <td className="p-3">Display optimization suggestions</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        showStats
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">true</code>
                    </td>
                    <td className="p-3">Display usage statistics</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">
                        onApply
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">(suggestions) =&gt; void</code>
                    </td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Callback when optimization applied</td>
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
                <code>{`import { TokenOptimizationPanel } from '@clarity-chat/react'

function MyComponent() {
  const [messages, setMessages] = useState([])

  return (
    <TokenOptimizationPanel
      currentTokens={2500}
      maxTokens={4000}
      messages={messages}
      showSuggestions
      showStats
      onApply={(suggestions) => {
        console.log('Applying:', suggestions)
      }}
    />
  )
}`}</code>
              </pre>
            </div>
          </section>

          {/* Integrated Example */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Integrated with Chat</h2>
            <p className="text-muted-foreground mb-4">
              Use with useClarityChat for automatic token tracking:
            </p>
            <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
              <pre className="text-sm">
                <code>{`import { TokenOptimizationPanel } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function OptimizedChat() {
  const { messages, tokenTracker } = useClarityChat({
    api: '/api/chat',
    maxTokens: 4000,
  })

  return (
    <div className="space-y-4">
      <TokenOptimizationPanel
        currentTokens={tokenTracker.tokenCount}
        maxTokens={4000}
        messages={messages}
        showSuggestions
        showStats
        onApply={(suggestions) => {
          // Apply optimizations to chat config
          suggestions.forEach(s => applyOptimization(s))
        }}
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
