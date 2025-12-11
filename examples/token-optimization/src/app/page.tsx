'use client'

import { useState } from 'react'
import {
  Zap,
  FileCode2,
  Shrink,
  Coins,
  RotateCcw,
  ArrowRight,
} from 'lucide-react'

// =============================================================================
// Types
// =============================================================================

interface OptimizationResult {
  type: 'toon' | 'compression' | 'caching' | 'full'
  original: string
  optimized: string
  originalTokens: number
  optimizedTokens: number
  savingsPercent: number
  estimatedCost: number
}

interface Stats {
  toonSavings: number
  compressionSavings: number
  totalTokensSaved: number
  totalCostSaved: number
}

// =============================================================================
// Mock Optimization Functions
// =============================================================================

/**
 * Simulates TOON (Token-Optimized Object Notation) conversion.
 * TOON uses single-character keys and removes unnecessary whitespace
 * to reduce token count by 30-60%.
 */
function optimizeWithToon(data: unknown): {
  optimized: string
  tokens: number
} {
  const original = JSON.stringify(data, null, 2)
  // Simulate TOON conversion by stripping keys to single chars
  const json = data as Record<string, unknown>[]
  const keys = Object.keys(json[0] || {})
  const keyMap = keys.reduce(
    (acc, key, i) => {
      acc[key] = String.fromCharCode(97 + i) // a, b, c, ...
      return acc
    },
    {} as Record<string, string>
  )

  const toonData = json.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([k, v]) => [keyMap[k] || k, v])
    )
  )

  const optimized = JSON.stringify(toonData)
  // Rough token estimate: 1 token per 4 characters
  return {
    optimized: `@keys:${Object.entries(keyMap)
      .map(([k, v]) => `${v}=${k}`)
      .join(',')}\n${optimized}`,
    tokens: Math.ceil(optimized.length / 4),
  }
}

/**
 * Simulates prompt compression by removing filler words
 * and redundant phrases.
 */
function compressPrompt(text: string): { optimized: string; tokens: number } {
  const fillers = [
    'really, really',
    'you know,',
    'basically',
    'actually',
    'literally',
    'just',
    'I mean,',
  ]

  let optimized = text
  fillers.forEach((filler) => {
    optimized = optimized.replace(new RegExp(filler, 'gi'), '')
  })

  // Clean up extra spaces
  optimized = optimized.replace(/\s+/g, ' ').trim()

  return {
    optimized,
    tokens: Math.ceil(optimized.length / 4),
  }
}

/**
 * Simulates prompt caching by adding cache control markers.
 */
function prepareForCaching(
  messages: Array<{ role: string; content: string }>
): {
  prepared: Array<{
    role: string
    content: string
    cache_control?: { type: string }
  }>
  tokens: number
} {
  const prepared = messages.map((msg, i) => ({
    ...msg,
    // Add cache control to system messages and long content
    ...(msg.role === 'system' || msg.content.length > 100
      ? { cache_control: { type: 'ephemeral' } }
      : {}),
  }))

  const tokens = prepared.reduce(
    (sum, msg) => sum + Math.ceil(msg.content.length / 4),
    0
  )

  return { prepared, tokens }
}

// =============================================================================
// Components
// =============================================================================

function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  color,
}: {
  label: string
  value: string | number
  suffix?: string
  icon: React.ElementType
  color: string
}) {
  return (
    <div className="p-4 bg-card border rounded-lg">
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
        <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
        {label}
      </div>
      <p className="text-2xl font-bold">
        {value}
        {suffix && (
          <span className="text-sm font-normal text-muted-foreground">
            {suffix}
          </span>
        )}
      </p>
    </div>
  )
}

function ResultCard({ result }: { result: OptimizationResult }) {
  const typeLabels = {
    toon: 'TOON Optimization',
    compression: 'Prompt Compression',
    caching: 'Cache Preparation',
    full: 'Full Optimization',
  }

  const typeColors = {
    toon: 'text-blue-600',
    compression: 'text-green-600',
    caching: 'text-purple-600',
    full: 'text-orange-600',
  }

  return (
    <div className="p-6 bg-card border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${typeColors[result.type]}`}>
          {typeLabels[result.type]}
        </h3>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
          {result.savingsPercent.toFixed(1)}% saved
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Original */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Original</span>
            <span className="font-mono">{result.originalTokens} tokens</span>
          </div>
          <pre className="p-3 bg-muted rounded text-xs overflow-x-auto max-h-48">
            {result.original}
          </pre>
        </div>

        {/* Optimized */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Optimized</span>
            <span className="font-mono text-green-600">
              {result.optimizedTokens} tokens
            </span>
          </div>
          <pre className="p-3 bg-green-50 dark:bg-green-900/20 rounded text-xs overflow-x-auto max-h-48">
            {result.optimized}
          </pre>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Coins className="w-4 h-4" />
        Estimated cost: ${result.estimatedCost.toFixed(4)}
      </div>
    </div>
  )
}

// =============================================================================
// Main Page
// =============================================================================

export default function TokenOptimizationPage() {
  const [results, setResults] = useState<OptimizationResult[]>([])
  const [stats, setStats] = useState<Stats>({
    toonSavings: 0,
    compressionSavings: 0,
    totalTokensSaved: 0,
    totalCostSaved: 0,
  })

  // Sample data for demonstrations
  const sampleData = [
    { name: 'Alice Johnson', age: 30, city: 'New York', role: 'Engineer' },
    { name: 'Bob Smith', age: 25, city: 'San Francisco', role: 'Designer' },
    { name: 'Carol Williams', age: 35, city: 'Seattle', role: 'Manager' },
    { name: 'David Brown', age: 28, city: 'Austin', role: 'Developer' },
  ]

  const samplePrompt = `
    I really, really want to understand, you know, how I can actually improve
    my code quality and make it more maintainable. Can you basically help me
    with that? I'm just looking for some advice, literally anything would help.
  `

  const sampleMessages = [
    {
      role: 'system',
      content: `You are a helpful AI assistant specialized in software engineering.
        You have deep knowledge of React, TypeScript, Node.js, and modern web development.
        Always provide practical, production-ready solutions with clear explanations.
        Consider performance, security, and best practices in all recommendations.`,
    },
    {
      role: 'user',
      content: 'How can I optimize my React components for better performance?',
    },
  ]

  const handleToonOptimization = () => {
    const original = JSON.stringify(sampleData, null, 2)
    const originalTokens = Math.ceil(original.length / 4)
    const { optimized, tokens } = optimizeWithToon(sampleData)

    const result: OptimizationResult = {
      type: 'toon',
      original,
      optimized,
      originalTokens,
      optimizedTokens: tokens,
      savingsPercent: ((originalTokens - tokens) / originalTokens) * 100,
      estimatedCost: tokens * 0.00001, // Rough estimate
    }

    setResults((prev) => [...prev, result])
    setStats((prev) => ({
      ...prev,
      toonSavings: prev.toonSavings + result.savingsPercent,
      totalTokensSaved: prev.totalTokensSaved + (originalTokens - tokens),
      totalCostSaved: prev.totalCostSaved + (originalTokens - tokens) * 0.00001,
    }))
  }

  const handlePromptCompression = () => {
    const originalTokens = Math.ceil(samplePrompt.length / 4)
    const { optimized, tokens } = compressPrompt(samplePrompt)

    const result: OptimizationResult = {
      type: 'compression',
      original: samplePrompt.trim(),
      optimized,
      originalTokens,
      optimizedTokens: tokens,
      savingsPercent: ((originalTokens - tokens) / originalTokens) * 100,
      estimatedCost: tokens * 0.00001,
    }

    setResults((prev) => [...prev, result])
    setStats((prev) => ({
      ...prev,
      compressionSavings: prev.compressionSavings + result.savingsPercent,
      totalTokensSaved: prev.totalTokensSaved + (originalTokens - tokens),
      totalCostSaved: prev.totalCostSaved + (originalTokens - tokens) * 0.00001,
    }))
  }

  const handleCachingPreparation = () => {
    const original = JSON.stringify(sampleMessages, null, 2)
    const originalTokens = Math.ceil(original.length / 4)
    const { prepared, tokens } = prepareForCaching(sampleMessages)
    const optimized = JSON.stringify(prepared, null, 2)

    // With caching, effective cost is reduced by ~50-90%
    const cacheSavings = 0.7 // 70% savings from caching

    const result: OptimizationResult = {
      type: 'caching',
      original,
      optimized,
      originalTokens,
      optimizedTokens: tokens,
      savingsPercent: cacheSavings * 100,
      estimatedCost: tokens * 0.00001 * (1 - cacheSavings),
    }

    setResults((prev) => [...prev, result])
    setStats((prev) => ({
      ...prev,
      totalTokensSaved:
        prev.totalTokensSaved + Math.floor(originalTokens * cacheSavings),
      totalCostSaved:
        prev.totalCostSaved + originalTokens * 0.00001 * cacheSavings,
    }))
  }

  const handleReset = () => {
    setResults([])
    setStats({
      toonSavings: 0,
      compressionSavings: 0,
      totalTokensSaved: 0,
      totalCostSaved: 0,
    })
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Token Optimization Demo</h1>
          <p className="text-muted-foreground">
            Explore different techniques to reduce token usage and API costs
          </p>
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={handleToonOptimization}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <FileCode2 className="w-4 h-4" aria-hidden="true" />
            TOON Optimize Data
          </button>
          <button
            onClick={handlePromptCompression}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <Shrink className="w-4 h-4" aria-hidden="true" />
            Compress Prompt
          </button>
          <button
            onClick={handleCachingPreparation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
            Prepare for Caching
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="TOON Savings"
            value={stats.toonSavings > 0 ? stats.toonSavings.toFixed(1) : '0'}
            suffix="%"
            icon={FileCode2}
            color="text-blue-600"
          />
          <StatCard
            label="Compression Savings"
            value={
              stats.compressionSavings > 0
                ? stats.compressionSavings.toFixed(1)
                : '0'
            }
            suffix="%"
            icon={Shrink}
            color="text-green-600"
          />
          <StatCard
            label="Tokens Saved"
            value={stats.totalTokensSaved.toLocaleString()}
            icon={Zap}
            color="text-purple-600"
          />
          <StatCard
            label="Cost Saved"
            value={`$${stats.totalCostSaved.toFixed(4)}`}
            icon={Coins}
            color="text-orange-600"
          />
        </div>

        {/* Results */}
        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className="text-xl font-semibold mb-4">
            Results
          </h2>

          {results.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-card">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <ArrowRight
                  className="w-8 h-8 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <p className="text-muted-foreground">
                Click any optimization button above to see the results
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result, i) => (
                <ResultCard key={i} result={result} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Powered by <span className="font-medium">Clarity Chat</span> Token
            Optimization
          </p>
        </footer>
      </div>
    </div>
  )
}
