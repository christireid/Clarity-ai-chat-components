'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Demo TokenOptimizationBadge component
function DemoBadge({
  status,
  savings,
  size,
  showIcon,
  showPercentage,
  animated,
}: {
  status: 'optimal' | 'good' | 'warning' | 'critical'
  savings: number
  size: 'sm' | 'md' | 'lg'
  showIcon: boolean
  showPercentage: boolean
  animated: boolean
}) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  const statusConfig = {
    optimal: {
      icon: CheckCircle2,
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    good: {
      icon: Sparkles,
      bg: 'bg-blue-500/10 dark:bg-blue-500/20',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
    },
    critical: {
      icon: XCircle,
      bg: 'bg-red-500/10 dark:bg-red-500/20',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const badgeContent = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        sizeClasses[size],
        config.bg,
        config.text,
        config.border
      )}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {showPercentage && `${savings}%`}
    </span>
  )

  if (animated) {
    return (
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
        {badgeContent}
      </motion.div>
    )
  }

  return badgeContent
}

export default function TokenOptimizationBadgePage() {
  const [status, setStatus] = React.useState<'optimal' | 'good' | 'warning' | 'critical'>('optimal')
  const [savings, setSavings] = React.useState(70)
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md')
  const [showIcon, setShowIcon] = React.useState(true)
  const [showPercentage, setShowPercentage] = React.useState(true)
  const [animated, setAnimated] = React.useState(true)

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/reference/components"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Components
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-4">TokenOptimizationBadge</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Status badge showing optimization level with color-coded visual indicators.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Interactive Demo</h2>

          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {/* Demo Display */}
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[200px]">
              <DemoBadge
                status={status}
                savings={savings}
                size={size}
                showIcon={showIcon}
                showPercentage={showPercentage}
                animated={animated}
              />
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Status: <span className="text-muted-foreground capitalize">{status}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['optimal', 'good', 'warning', 'critical'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                        status === s
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Savings: {savings}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="95"
                  step="5"
                  value={savings}
                  onChange={(e) => setSavings(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                        size === s
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIcon}
                    onChange={(e) => setShowIcon(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Icon</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPercentage}
                    onChange={(e) => setShowPercentage(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Percentage</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animated}
                    onChange={(e) => setAnimated(e.target.checked)}
                    className="rounded"
                  />
                  <span>Animated</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Installation</h2>
          <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
            <code className="text-sm">npm install @clarity-chat/react</code>
          </div>
        </section>

        {/* Usage */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Usage</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { TokenOptimizationBadge } from '@clarity-chat/react'

function MyComponent() {
  return (
    <TokenOptimizationBadge
      status="optimal"
      savings={70}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">With Custom Styling</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<TokenOptimizationBadge
  status="good"
  savings={55}
  size="lg"
  showIcon={true}
  showPercentage={true}
  animated={true}
  className="my-custom-class"
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Props */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Props</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold">Prop</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>status</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'optimal' | 'good' | 'warning' | 'critical'</td>
                  <td className="py-3 px-4 text-muted-foreground">'optimal'</td>
                  <td className="py-3 px-4 text-muted-foreground">Optimization status level</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>savings</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">0</td>
                  <td className="py-3 px-4 text-muted-foreground">Cost savings percentage (0-100)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>size</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'sm' | 'md' | 'lg'</td>
                  <td className="py-3 px-4 text-muted-foreground">'md'</td>
                  <td className="py-3 px-4 text-muted-foreground">Badge size variant</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showIcon</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show status icon</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showPercentage</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show savings percentage</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>animated</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Enable entrance animation</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>className</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Status Levels */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Status Levels</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Optimal (65%+)</h3>
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Excellent optimization. Maximum cost savings achieved.
              </p>
            </div>

            <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Good (40-64%)</h3>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Good optimization. Significant cost savings active.
              </p>
            </div>

            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Warning (20-39%)</h3>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Moderate optimization. Room for improvement exists.
              </p>
            </div>

            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-500/10 p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="font-semibold text-red-900 dark:text-red-100">Critical (&lt;20%)</h3>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">
                Low optimization. Immediate attention recommended.
              </p>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Common Use Cases</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">In Dashboard Header</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Token Optimization Status</h4>
                  <DemoBadge status="optimal" savings={72} size="md" showIcon={true} showPercentage={true} animated={false} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">In Analytics Cards</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Cache Performance</span>
                    <DemoBadge status="optimal" savings={88} size="sm" showIcon={true} showPercentage={true} animated={false} />
                  </div>
                  <p className="text-2xl font-bold">90% hit rate</p>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Model Routing</span>
                    <DemoBadge status="good" savings={52} size="sm" showIcon={true} showPercentage={true} animated={false} />
                  </div>
                  <p className="text-2xl font-bold">60% on Haiku</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">In Settings Panel</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Prompt Caching</p>
                    <p className="text-sm text-muted-foreground">Enabled for system prompts</p>
                  </div>
                  <DemoBadge status="optimal" savings={90} size="sm" showIcon={false} showPercentage={true} animated={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compression</p>
                    <p className="text-sm text-muted-foreground">Adaptive mode active</p>
                  </div>
                  <DemoBadge status="good" savings={45} size="sm" showIcon={false} showPercentage={true} animated={false} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/token-optimization-panel"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">TokenOptimizationPanel</h3>
              <p className="text-sm text-muted-foreground">Comprehensive optimization analytics</p>
            </Link>

            <Link
              href="/reference/components/token-optimization-dashboard"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">TokenOptimizationDashboard</h3>
              <p className="text-sm text-muted-foreground">Executive reporting dashboard</p>
            </Link>

            <Link
              href="/reference/components/token-counter"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">TokenCounter</h3>
              <p className="text-sm text-muted-foreground">Real-time token counting</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
