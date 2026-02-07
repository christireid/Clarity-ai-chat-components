'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Separator,
  cn,
} from '@clarity-chat/primitives'
import {
  DollarSign,
  Zap,
  Loader2,
  FileText,
  AlertTriangle,
  Minus,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle,
} from 'lucide-react'

export function TokenOptimizationDashboardDemo() {
  const metrics = {
    totalTokens: 50000,
    tokensSaved: 15000,
    costSaved: 0.45,
    breakdown: {
      promptCompression: { tokens: 4000, percent: 27 },
      caching: { hits: 120, savings: 5000 },
      modelRouting: { savings: 3000, percent: 40 },
      responseLimiting: { tokens: 2000, percent: 15 },
      batching: { requests: 50, savings: 800 },
      throttling: { callsSaved: 200 },
      referencing: { bytesSaved: 50000, percent: 60 },
    },
    savingsPercent: 30,
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Token Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Real-time savings and efficiency metrics
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl font-bold text-green-500">
                {metrics.tokensSaved.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Tokens Saved</div>
              <div className="text-xs text-green-500 mt-1">
                {metrics.savingsPercent}% reduction
              </div>
            </div>
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-500">
                ${metrics.costSaved.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Cost Saved</div>
              <div className="text-xs text-blue-500 mt-1">
                Per {metrics.totalTokens.toLocaleString()} tokens
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="text-2xl font-bold">
                {metrics.totalTokens.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Tokens</div>
              <div className="text-xs text-muted-foreground mt-1">
                Processed in session
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Optimization Breakdown</h4>
            {[
              {
                icon: '✂️',
                label: 'Prompt Compression',
                value: '4,000',
                percent: 27,
              },
              {
                icon: '💾',
                label: 'Smart Caching',
                value: '5,000',
                percent: 33,
              },
              {
                icon: '🎯',
                label: 'Model Routing',
                value: '3,000',
                percent: 20,
              },
              {
                icon: '✨',
                label: 'Response Limiting',
                value: '2,000',
                percent: 13,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="text-green-500 font-medium">
                      {item.value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TokenOptimizationPanelDemo() {
  const stats = {
    tokensSaved: 8500,
    costSavings: 0.25,
    percentageSaved: 25.5,
    cacheHits: 85,
    cacheMisses: 15,
    requestsThrottled: 12,
    simpleModelRoutes: 45,
    complexModelRoutes: 55,
  }

  const cacheHitRate =
    (stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Token Optimization</h3>
            <div className="flex items-center gap-2">
              <span className="text-green-500 font-medium">
                {stats.tokensSaved.toLocaleString()} tokens saved
              </span>
              <span className="text-muted-foreground">
                (${stats.costSavings.toFixed(2)})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground text-xs">Tokens Saved</div>
              <div className="text-lg font-semibold text-green-500">
                {stats.tokensSaved.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.percentageSaved.toFixed(1)}% reduction
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">
                Cache Hit Rate
              </div>
              <div className="text-lg font-semibold">
                {cacheHitRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.cacheHits} hits / {stats.cacheMisses} misses
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Requests Throttled</span>
              <span>{stats.requestsThrottled}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model Routing</span>
              <span>
                {stats.simpleModelRoutes} simple / {stats.complexModelRoutes}{' '}
                complex
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost Savings</span>
              <span className="text-green-500">
                ${stats.costSavings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TokenCostPreviewDemo() {
  const [text, setText] = useState(
    'This is an example message to see cost estimation in action.'
  )
  const estimatedTokens = Math.ceil(text.length / 4) // rough estimate
  const estimatedCost = (estimatedTokens / 1000) * 0.03 // GPT-4 pricing

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message to see cost estimation..."
            className="mb-3"
          />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{estimatedTokens} tokens</span>
            <span>•</span>
            <span>${estimatedCost.toFixed(4)} est.</span>
          </div>
        </div>

        <Separator />

        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Card Variant</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span>{estimatedTokens} tokens</span>
            <span className="text-muted-foreground">•</span>
            <span>${estimatedCost.toFixed(4)} est.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TokenUsageMeterDemo() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [usage, setUsage] = useState({
    promptTokens: 150,
    completionTokens: 47,
    totalTokens: 197,
  })

  const simulateStream = () => {
    setIsStreaming(true)
    let completion = 47
    const interval = setInterval(() => {
      completion += Math.floor(Math.random() * 10) + 1
      setUsage((prev) => ({
        ...prev,
        completionTokens: completion,
        totalTokens: prev.promptTokens + completion,
      }))
      if (completion >= 200) {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 200)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Token Usage</span>
            {isStreaming && (
              <span className="text-xs text-green-500 animate-pulse">Live</span>
            )}
          </div>
          <span className="font-mono text-sm">
            ${((usage.totalTokens / 1000) * 0.03).toFixed(4)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Input</div>
            <div className="text-lg font-semibold text-blue-500">
              {usage.promptTokens}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Output</div>
            <div className="text-lg font-semibold text-green-500">
              {usage.completionTokens}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-lg font-semibold text-purple-500">
              {usage.totalTokens}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          className="w-full"
          onClick={simulateStream}
          disabled={isStreaming}
        >
          {isStreaming ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Streaming...
            </>
          ) : (
            'Simulate Streaming'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

export function TokenCounterDemo() {
  const [tokens, setTokens] = useState(3200)
  const maxTokens = 4096
  const percentage = (tokens / maxTokens) * 100
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'flex items-center gap-2 font-medium',
              isCritical
                ? 'text-red-500'
                : isWarning
                  ? 'text-yellow-500'
                  : 'text-green-500'
            )}
          >
            <FileText className="h-4 w-4" />
            <span>
              {tokens.toLocaleString()} / {maxTokens.toLocaleString()} tokens
            </span>
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            ${((tokens / 1000) * 0.002).toFixed(4)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all',
              isCritical
                ? 'bg-red-500'
                : isWarning
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div
          className={cn(
            'text-xs',
            isCritical
              ? 'text-red-500'
              : isWarning
                ? 'text-yellow-500'
                : 'text-green-500'
          )}
        >
          {percentage.toFixed(1)}% of context window used
        </div>

        {isWarning && (
          <div
            className={cn(
              'flex items-start gap-2 p-3 rounded-lg border',
              isCritical
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-yellow-500/10 border-yellow-500/20'
            )}
          >
            <AlertTriangle
              className={cn(
                'h-5 w-5 flex-shrink-0',
                isCritical ? 'text-red-500' : 'text-yellow-500'
              )}
            />
            <div>
              <p
                className={cn(
                  'font-medium text-sm',
                  isCritical ? 'text-red-500' : 'text-yellow-500'
                )}
              >
                {isCritical
                  ? 'Context Limit Nearly Reached'
                  : 'Approaching Context Limit'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isCritical
                  ? 'Consider pruning older messages to free up space.'
                  : "You're using a large portion of the context window."}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTokens(Math.max(0, tokens - 500))}
          >
            <Minus className="h-3 w-3 mr-1" />
            500
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setTokens(Math.min(maxTokens, tokens + 500))}
          >
            <Plus className="h-3 w-3 mr-1" />
            500
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TokenBudgetBarDemo() {
  const [current, setCurrent] = useState(65000)
  const max = 128000
  const reserved = 8000
  const effectiveMax = max - reserved
  const percentage = (current / effectiveMax) * 100
  const available = effectiveMax - current
  const status =
    percentage > 100
      ? 'exceeded'
      : percentage >= 90
        ? 'critical'
        : percentage >= 70
          ? 'warning'
          : 'safe'

  const statusColors = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-orange-500',
    exceeded: 'bg-red-500',
  }

  const textColors = {
    safe: 'text-green-500',
    warning: 'text-yellow-500',
    critical: 'text-orange-500',
    exceeded: 'text-red-500',
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('font-medium', textColors[status])}>
              {current.toLocaleString()} / {effectiveMax.toLocaleString()}
            </span>
            {status !== 'safe' && (
              <Badge
                variant={
                  status === 'exceeded'
                    ? 'destructive'
                    : status === 'critical'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {status === 'exceeded'
                  ? 'Over Budget'
                  : status === 'critical'
                    ? 'Critical'
                    : 'Warning'}
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            ~${((current / 1000) * 0.01).toFixed(2)}
          </span>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all',
              statusColors[status],
              status === 'exceeded' && 'animate-pulse'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Current</div>
            <div className="font-mono">{current.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Max (Input)</div>
            <div className="font-mono">{max.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Reserved</div>
            <div className="font-mono">{reserved.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Available</div>
            <div className={cn('font-mono', available <= 0 && 'text-red-500')}>
              {available.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => setCurrent(Math.max(0, current - 20000))}
          >
            Trim Context
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => setCurrent(Math.min(max, current + 20000))}
          >
            Add Messages
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function TokenOptimizationBadgeDemo() {
  const stats = [
    { tokensSaved: 1250, costSavings: 0.05, size: 'sm' as const },
    { tokensSaved: 8500, costSavings: 0.25, size: 'md' as const },
    { tokensSaved: 45000, costSavings: 1.35, size: 'lg' as const },
  ]

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Compact badges showing token savings:
        </p>
        <div className="flex flex-col gap-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 rounded-full px-3 py-1.5 bg-green-500/10 border border-green-500/20 w-fit"
            >
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="font-semibold text-green-500">
                {stat.tokensSaved >= 1000
                  ? `${(stat.tokensSaved / 1000).toFixed(1)}k`
                  : stat.tokensSaved}{' '}
                saved
              </span>
              {stat.costSavings > 0 && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="text-muted-foreground/60">
                    ${stat.costSavings.toFixed(2)}
                  </span>
                </>
              )}
              <Badge variant="outline" className="text-xs">
                {stat.size.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function TokenROICalculatorDemo() {
  const [requestsPerDay, setRequestsPerDay] = useState(1000)
  const [optimizationPercent, setOptimizationPercent] = useState(30)

  const tokensPerRequest = 500
  const costPerToken = 0.00003
  const dailyTokens = requestsPerDay * tokensPerRequest
  const dailyCost = dailyTokens * costPerToken
  const dailySavings = dailyCost * (optimizationPercent / 100)
  const annualSavings = dailySavings * 365
  const implementationCost = 500
  const breakEvenDays = implementationCost / dailySavings

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Annual Savings</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              ${annualSavings.toFixed(0)}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Break-Even</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {Math.ceil(breakEvenDays)} days
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Requests per Day</span>
              <span className="font-mono">
                {requestsPerDay.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              step={100}
              value={requestsPerDay}
              onChange={(e) => setRequestsPerDay(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Optimization %</span>
              <span className="font-mono">{optimizationPercent}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={80}
              step={5}
              value={optimizationPercent}
              onChange={(e) => setOptimizationPercent(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Daily savings</span>
            <span className="font-mono">${dailySavings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Monthly savings</span>
            <span className="font-mono">${(dailySavings * 30).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Implementation cost</span>
            <span className="font-mono">${implementationCost}</span>
          </div>
        </div>

        {breakEvenDays < 90 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Excellent ROI - breaks even in {Math.ceil(breakEvenDays)} days!
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
