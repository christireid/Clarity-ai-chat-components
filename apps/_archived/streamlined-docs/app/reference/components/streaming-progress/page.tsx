'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Activity, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// Demo StreamingProgress component
function DemoStreamingProgress({
  variant,
  progress,
  showPercentage,
  showTokenCount,
  showThroughput,
  showTimeRemaining,
  size,
  color,
  isStreaming,
  label,
}: {
  variant: 'bar' | 'circular' | 'text' | 'minimal'
  progress: number
  showPercentage: boolean
  showTokenCount: boolean
  showThroughput: boolean
  showTimeRemaining: boolean
  size: 'sm' | 'md' | 'lg'
  color: 'default' | 'success' | 'warning' | 'error'
  isStreaming: boolean
  label?: string
}) {
  const received = Math.floor((progress / 100) * 500)
  const estimated = 500
  const tokensPerSecond = isStreaming ? 45 : 0
  const timeRemaining = isStreaming ? Math.floor((estimated - received) / tokensPerSecond) * 1000 : 0

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  const colorClasses = {
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  }

  const textColorClasses = {
    default: 'text-blue-600 dark:text-blue-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
  }

  if (variant === 'minimal') {
    return (
      <div className="inline-flex items-center gap-2">
        <span className={cn('font-medium tabular-nums', textColorClasses[color], sizeClasses[size])}>
          {Math.round(progress)}%
        </span>
        {isStreaming && (
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={cn('flex items-center gap-3', sizeClasses[size])}>
        {label && <span className="text-muted-foreground">{label}</span>}
        <span className={cn('font-semibold tabular-nums', textColorClasses[color])}>
          {Math.round(progress)}%
        </span>
        {isStreaming && (
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
        {showTokenCount && (
          <span className="text-muted-foreground">
            {received}/{estimated} tokens
          </span>
        )}
        {showThroughput && isStreaming && (
          <span className="text-muted-foreground">
            {tokensPerSecond} tok/s
          </span>
        )}
        {showTimeRemaining && isStreaming && timeRemaining > 0 && (
          <span className="text-muted-foreground">
            ~{Math.ceil(timeRemaining / 1000)}s
          </span>
        )}
      </div>
    )
  }

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 40
    const offset = circumference - (progress / 100) * circumference

    return (
      <div className="flex flex-col items-center gap-2">
        {label && <span className={cn('text-muted-foreground mb-1', sizeClasses[size])}>{label}</span>}
        <div className="relative">
          <svg className="w-24 h-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={cn('transition-all duration-300', textColorClasses[color])}
              strokeLinecap="round"
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('font-bold tabular-nums', textColorClasses[color], sizeClasses[size])}>
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
        {showTokenCount && (
          <span className={cn('text-muted-foreground', sizeClasses[size])}>
            {received}/{estimated} tokens
          </span>
        )}
        {showThroughput && isStreaming && (
          <span className={cn('text-muted-foreground', sizeClasses[size])}>
            {tokensPerSecond} tok/s
          </span>
        )}
        {showTimeRemaining && isStreaming && timeRemaining > 0 && (
          <span className={cn('text-muted-foreground', sizeClasses[size])}>
            ~{Math.ceil(timeRemaining / 1000)}s remaining
          </span>
        )}
      </div>
    )
  }

  // Bar variant (default)
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className={cn('text-muted-foreground', sizeClasses[size])}>
              {label}
              {isStreaming && (
                <span className="ml-1.5 inline-flex gap-0.5">
                  <span className="inline-block w-1 h-1 rounded-full bg-current animate-pulse" />
                  <span className="inline-block w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="inline-block w-1 h-1 rounded-full bg-current animate-pulse" style={{ animationDelay: '0.4s' }} />
                </span>
              )}
            </span>
          )}
          {showPercentage && (
            <span className={cn('font-semibold tabular-nums', textColorClasses[color], sizeClasses[size])}>
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}

      <div className="relative h-2 rounded-full bg-muted/30 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300 rounded-full',
            colorClasses[color],
            isStreaming && 'animate-pulse'
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {(showTokenCount || showThroughput || showTimeRemaining) && (
        <div className={cn('flex items-center justify-between mt-1.5 flex-wrap gap-2', sizeClasses[size])}>
          <div className="flex items-center gap-3 text-muted-foreground">
            {showTokenCount && (
              <span>
                {received}/{estimated} tokens
              </span>
            )}
            {showThroughput && isStreaming && <span>{tokensPerSecond} tok/s</span>}
          </div>
          {showTimeRemaining && isStreaming && timeRemaining > 0 && (
            <span className="text-muted-foreground">
              ~{Math.ceil(timeRemaining / 1000)}s remaining
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default function StreamingProgressPage() {
  const [variant, setVariant] = React.useState<'bar' | 'circular' | 'text' | 'minimal'>('bar')
  const [progress, setProgress] = React.useState(65)
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md')
  const [color, setColor] = React.useState<'default' | 'success' | 'warning' | 'error'>('default')
  const [showPercentage, setShowPercentage] = React.useState(true)
  const [showTokenCount, setShowTokenCount] = React.useState(true)
  const [showThroughput, setShowThroughput] = React.useState(true)
  const [showTimeRemaining, setShowTimeRemaining] = React.useState(true)
  const [isStreaming, setIsStreaming] = React.useState(true)
  const [showLabel, setShowLabel] = React.useState(true)

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

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">StreamingProgress</h1>
              <p className="text-sm text-muted-foreground mt-1">Streaming Component</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Real-time progress indicator for streaming AI responses with token tracking, throughput display, and time estimation.
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
            <div className="p-8 sm:p-12 border-b border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center min-h-[300px]">
              <div className="w-full max-w-md">
                <DemoStreamingProgress
                  variant={variant}
                  progress={progress}
                  showPercentage={showPercentage}
                  showTokenCount={showTokenCount}
                  showThroughput={showThroughput}
                  showTimeRemaining={showTimeRemaining}
                  size={size}
                  color={color}
                  isStreaming={isStreaming}
                  label={showLabel ? 'Streaming response' : undefined}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Progress: {Math.round(progress)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Variant</label>
                <div className="flex flex-wrap gap-2">
                  {(['bar', 'circular', 'text', 'minimal'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        variant === v
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Size</label>
                <div className="flex flex-wrap gap-2">
                  {(['sm', 'md', 'lg'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all uppercase',
                        size === s
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-3">Color</label>
                <div className="flex flex-wrap gap-2">
                  {(['default', 'success', 'warning', 'error'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all capitalize',
                        color === c
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                          : 'border-border/50 hover:border-border hover:bg-muted/50'
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLabel}
                    onChange={(e) => setShowLabel(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Label</span>
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
                    checked={showTokenCount}
                    onChange={(e) => setShowTokenCount(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Token Count</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showThroughput}
                    onChange={(e) => setShowThroughput(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Throughput</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTimeRemaining}
                    onChange={(e) => setShowTimeRemaining(e.target.checked)}
                    className="rounded"
                  />
                  <span>Show Time Remaining</span>
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isStreaming}
                    onChange={(e) => setIsStreaming(e.target.checked)}
                    className="rounded"
                  />
                  <span>Is Streaming</span>
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

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Usage</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Basic Bar Progress</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { StreamStatusProgress } from '@clarity-chat/react'

function MyComponent() {
  return (
    <StreamStatusProgress
      progress={65}
      tokens={{ received: 325, estimated: 500 }}
      isStreaming={true}
      showTokenCount={true}
      showThroughput={true}
    />
  )
}`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Circular Progress</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamStatusProgress
  progress={progress}
  variant="circular"
  tokens={{
    received: 150,
    estimated: 500,
    tokensPerSecond: 45
  }}
  showThroughput={true}
  showTimeRemaining={true}
  size="lg"
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Text-Only Variant</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamStatusProgress
  progress={80}
  variant="text"
  label="Generating response"
  showTimeRemaining={true}
  timeRemaining={5000}
/>`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Minimal Progress</h3>
              <div className="rounded-lg border border-border/50 bg-muted/30 p-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`<StreamStatusProgress
  progress={45}
  variant="minimal"
  size="sm"
  color="success"
  isStreaming={true}
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
                    <code>progress</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">number</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Progress percentage (0-100)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>variant</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'bar' | 'circular' | 'text' | 'minimal'</td>
                  <td className="py-3 px-4 text-muted-foreground">'bar'</td>
                  <td className="py-3 px-4 text-muted-foreground">Visual style variant</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>size</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'sm' | 'md' | 'lg'</td>
                  <td className="py-3 px-4 text-muted-foreground">'md'</td>
                  <td className="py-3 px-4 text-muted-foreground">Component size</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>color</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">'default' | 'success' | 'warning' | 'error'</td>
                  <td className="py-3 px-4 text-muted-foreground">'default'</td>
                  <td className="py-3 px-4 text-muted-foreground">Progress bar color theme</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>tokens</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">StreamStatusTokens</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Token statistics (received, estimated, tokensPerSecond)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>isStreaming</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Whether currently streaming</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showPercentage</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show percentage value</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showTokenCount</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">true</td>
                  <td className="py-3 px-4 text-muted-foreground">Show token count (received/estimated)</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showThroughput</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Show tokens per second</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>showTimeRemaining</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Show estimated time remaining</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>label</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">string</td>
                  <td className="py-3 px-4 text-muted-foreground">-</td>
                  <td className="py-3 px-4 text-muted-foreground">Optional label text</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <code>disableAnimations</code>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">boolean</td>
                  <td className="py-3 px-4 text-muted-foreground">false</td>
                  <td className="py-3 px-4 text-muted-foreground">Disable all animations</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Features</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold">Multiple Variants</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Bar, circular, text, and minimal variants for different UI contexts
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="font-semibold">Token Tracking</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Display received/estimated tokens and tokens per second throughput
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold">Time Estimation</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Estimate time remaining based on streaming throughput
              </p>
            </div>

            <div className="rounded-lg border border-border/50 bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <h3 className="font-semibold">Accessible</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                WCAG 2.1 AA compliant with proper ARIA attributes and reduced motion support
              </p>
            </div>
          </div>
        </section>

        {/* Related Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Related Components</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/reference/components/streaming-message"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingMessage</h3>
              <p className="text-sm text-muted-foreground">Real-time streaming message display</p>
            </Link>

            <Link
              href="/reference/components/streaming-code-block"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingCodeBlock</h3>
              <p className="text-sm text-muted-foreground">Live syntax-highlighted code streaming</p>
            </Link>

            <Link
              href="/reference/components/streaming-text-renderer"
              className="rounded-lg border border-border/50 bg-card p-4 hover:border-brand-500/50 hover:bg-brand-500/5 transition-colors"
            >
              <h3 className="font-semibold mb-2">StreamingTextRenderer</h3>
              <p className="text-sm text-muted-foreground">Smooth text streaming with typewriter effect</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
