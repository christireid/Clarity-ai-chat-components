'use client'

/**
 * TieredCache - API Reference Documentation
 *
 * Multi-tier caching orchestrator providing optimal hit rates through
 * layered lookup: Exact → Smart → Semantic matching.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Copy,
  Check,
  Layers,
  Zap,
  Search,
  Target,
  Clock,
  TrendingUp,
  Database,
  AlertCircle,
  ChevronRight,
  FileCode,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Tier Comparison Component
// ============================================================================

function TierComparison() {
  const tiers = [
    {
      tier: 'Tier 1: Exact',
      icon: Target,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      latency: '< 1ms',
      matchType: 'Hash lookup',
      accuracy: '100%',
      useCase: 'Identical queries',
      complexity: 'O(1)',
      example: '"What is the weather in Paris?" → exact match',
    },
    {
      tier: 'Tier 2: Smart',
      icon: Search,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      latency: '< 5ms',
      matchType: 'Pattern matching',
      accuracy: '95%',
      useCase: 'Parameterized queries',
      complexity: 'O(log n)',
      example: '"What is the weather in London?" → pattern match',
    },
    {
      tier: 'Tier 3: Semantic',
      icon: Layers,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      latency: '< 50ms',
      matchType: 'Vector similarity',
      accuracy: '92%+',
      useCase: 'Paraphrased queries',
      complexity: 'O(log n)',
      example: '"Tell me the weather for Paris" → semantic match',
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((tier, index) => {
        const Icon = tier.icon
        return (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: durations.normal }}
            className={cn(
              'relative rounded-xl border border-border/50 p-6',
              'bg-card hover:shadow-lg transition-all duration-300',
              'hover:border-brand-500/50'
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {tier.tier}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">{tier.latency}</span>
                </div>
              </div>
              <div className={cn('p-3 rounded-lg', tier.bgColor)}>
                <Icon className={cn('w-6 h-6', tier.color)} />
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Match Type
                </div>
                <div className="text-sm font-medium text-foreground">
                  {tier.matchType}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Accuracy
                </div>
                <div className="text-sm font-medium text-foreground">
                  {tier.accuracy}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Complexity
                </div>
                <div className="text-sm font-mono text-foreground">
                  {tier.complexity}
                </div>
              </div>
            </div>

            {/* Use Case */}
            <div className="pt-4 border-t border-border/50">
              <div className="text-xs font-semibold text-foreground mb-2">
                Use Case
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                {tier.useCase}
              </div>
              <div className="text-xs text-muted-foreground bg-muted/20 rounded-md p-2 font-mono">
                {tier.example}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Performance Comparison Table
// ============================================================================

function PerformanceTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Metric
            </th>
            <th className="px-4 py-3 text-center font-semibold text-green-500">
              Tier 1: Exact
            </th>
            <th className="px-4 py-3 text-center font-semibold text-blue-500">
              Tier 2: Smart
            </th>
            <th className="px-4 py-3 text-center font-semibold text-purple-500">
              Tier 3: Semantic
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/30">
            <td className="px-4 py-3 font-medium text-foreground">
              Lookup Latency
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-green-600 dark:text-green-400">
              &lt; 1ms
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-blue-600 dark:text-blue-400">
              &lt; 5ms
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-purple-600 dark:text-purple-400">
              &lt; 50ms
            </td>
          </tr>
          <tr className="border-b border-border/30 bg-muted/10">
            <td className="px-4 py-3 font-medium text-foreground">
              Hit Rate (typical)
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              20-30%
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              15-25%
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              30-40%
            </td>
          </tr>
          <tr className="border-b border-border/30">
            <td className="px-4 py-3 font-medium text-foreground">
              Cache Size (default)
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              1,000 entries
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              500 patterns
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              200 vectors
            </td>
          </tr>
          <tr className="border-b border-border/30 bg-muted/10">
            <td className="px-4 py-3 font-medium text-foreground">
              Match Accuracy
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              100%
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              ~95%
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              92-98%
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium text-foreground">
              Storage Overhead
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              Low (~1KB/entry)
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              Medium (~2KB/entry)
            </td>
            <td className="px-4 py-3 text-center font-mono text-sm text-muted-foreground">
              High (~5KB/entry)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [query, setQuery] = React.useState(
    'What is the weather in Paris?'
  )
  const [cacheHits, setCacheHits] = React.useState<
    Array<{ tier: string; latency: number; similarity?: number }>
  >([])

  const simulateLookup = () => {
    // Simulate cache lookup
    const hits = [
      { tier: 'Tier 1: Exact', latency: 0.8 },
      { tier: 'Tier 2: Smart', latency: 3.2 },
      { tier: 'Tier 3: Semantic', latency: 42.5, similarity: 0.94 },
    ]
    setCacheHits(hits)
  }

  React.useEffect(() => {
    simulateLookup()
  }, [query])

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg">
        <div className="p-4 bg-muted/20 border-b border-border/50">
          <label className="block text-sm font-medium text-foreground mb-2">
            Test Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-border/50',
              'bg-background text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
              'text-sm'
            )}
            placeholder="Enter a query to test cache lookup..."
          />
        </div>

        {/* Results */}
        <div className="p-4 space-y-3">
          <div className="text-sm font-semibold text-foreground mb-3">
            Cache Lookup Results
          </div>
          {cacheHits.map((hit, index) => (
            <motion.div
              key={hit.tier}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                'bg-muted/30 border border-border/30'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    index === 0 && 'bg-green-500',
                    index === 1 && 'bg-blue-500',
                    index === 2 && 'bg-purple-500'
                  )}
                />
                <span className="text-sm font-medium text-foreground">
                  {hit.tier}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {hit.similarity && (
                  <span className="text-xs text-muted-foreground">
                    {(hit.similarity * 100).toFixed(1)}% match
                  </span>
                )}
                <span className="text-xs font-mono text-muted-foreground">
                  {hit.latency.toFixed(1)}ms
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-muted-foreground">
          The cache checks all tiers in sequence. The first tier to return a
          hit stops the lookup and returns the cached response.
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function TieredCachePage() {
  // Configuration props
  const configProps: PropDefinition[] = [
    {
      name: 'exact',
      type: 'ExactCacheConfig',
      required: true,
      description:
        'Configuration for Tier 1 exact match cache. Includes maxSize and ttl.',
    },
    {
      name: 'smart',
      type: 'SmartCacheConfig',
      required: true,
      description:
        'Configuration for Tier 2 pattern match cache. Includes maxSize and ttl.',
    },
    {
      name: 'semantic',
      type: 'SemanticCacheConfig',
      required: true,
      description:
        'Configuration for Tier 3 semantic match cache. Includes maxSize, similarityThreshold, and embedding config.',
    },
  ]

  // Result type props
  const resultProps: PropDefinition[] = [
    {
      name: 'hit',
      type: 'boolean',
      required: true,
      description: 'Whether any tier had a cache hit.',
    },
    {
      name: 'tier',
      type: "'exact' | 'smart' | 'semantic'",
      description: 'Which tier provided the hit (undefined if no hit).',
    },
    {
      name: 'data',
      type: 'string',
      description: 'The cached response data (undefined if no hit).',
    },
    {
      name: 'similarity',
      type: 'number',
      description:
        'Similarity score for semantic hits (0-1 range, undefined for other tiers).',
    },
    {
      name: 'latency',
      type: 'number',
      description: 'Lookup latency in milliseconds.',
    },
  ]

  // Method signatures
  const methods = [
    {
      name: 'get',
      signature: 'async get(prompt: string, context?: CacheContext): Promise<TieredCacheResult>',
      description:
        'Look up a prompt across all cache tiers. Returns the first hit found, checking tiers in order: Exact → Smart → Semantic.',
    },
    {
      name: 'set',
      signature:
        'async set(prompt: string, response: string, metadata?: Record<string, unknown>): Promise<void>',
      description:
        'Store a prompt-response pair in all cache tiers for maximum hit potential.',
    },
    {
      name: 'invalidate',
      signature: 'async invalidate(prompt: string): Promise<void>',
      description:
        'Invalidate a specific prompt from the cache. Note: Only exact cache supports direct invalidation.',
    },
    {
      name: 'prefetch',
      signature: 'async prefetch(items: PrefetchItem[]): Promise<void>',
      description:
        'Prefetch multiple items into the cache for faster initial lookups.',
    },
    {
      name: 'clear',
      signature: 'clear(): void',
      description: 'Clear all cache tiers and reset statistics.',
    },
    {
      name: 'getStats',
      signature: 'getStats(): CacheStats',
      description:
        'Get comprehensive cache statistics including per-tier hit rates and sizes.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.normal }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 border border-brand-500/20">
              <Layers className="w-8 h-8 text-brand-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                TieredCache
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                Multi-tier caching orchestrator
              </p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Orchestrates 3 cache tiers for optimal hit rates through layered
            lookup: <strong>Exact</strong> (hash lookup),{' '}
            <strong>Smart</strong> (pattern matching), and{' '}
            <strong>Semantic</strong> (vector similarity). Achieves 70-85%
            combined hit rate with intelligent fallback.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: durations.normal }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            {
              icon: Zap,
              label: 'Fastest Tier',
              value: '< 1ms',
              color: 'text-green-500',
            },
            {
              icon: TrendingUp,
              label: 'Combined Hit Rate',
              value: '70-85%',
              color: 'text-blue-500',
            },
            {
              icon: Database,
              label: 'Default Capacity',
              value: '1,700 entries',
              color: 'text-purple-500',
            },
            {
              icon: Target,
              label: 'Match Accuracy',
              value: '92-100%',
              color: 'text-orange-500',
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="p-4 rounded-lg bg-card border border-border/50"
              >
                <Icon className={cn('w-5 h-5 mb-2', stat.color)} />
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Architecture Overview */}
        <Section id="architecture" title="3-Tier Architecture">
          <p className="text-muted-foreground mb-6">
            TieredCache implements a cascading lookup strategy that checks each
            tier in sequence, stopping at the first hit. This provides the
            optimal balance between latency and hit rate.
          </p>
          <TierComparison />
        </Section>

        {/* Installation */}
        <Section id="installation" title="Installation" className="mt-12">
          <CodeBlock
            language="bash"
            code={`npm install @clarity-chat/token-optimization`}
          />
        </Section>

        {/* Import */}
        <Section id="import" title="Import" className="mt-12">
          <CodeBlock
            language="typescript"
            code={`import { TieredCache } from '@clarity-chat/token-optimization'
import type {
  TieredCacheConfig,
  TieredCacheResult,
  CacheStats,
  TierStats,
} from '@clarity-chat/token-optimization'`}
          />
        </Section>

        {/* Basic Usage */}
        <Section id="basic-usage" title="Basic Usage" className="mt-12">
          <p className="text-muted-foreground mb-6">
            Create a tiered cache with custom configuration for each tier:
          </p>
          <CodeBlock
            language="typescript"
            code={`import { TieredCache } from '@clarity-chat/token-optimization'

// Create cache with custom tier configurations
const cache = new TieredCache({
  exact: {
    maxSize: 1000,
    ttl: 3600000, // 1 hour
  },
  smart: {
    maxSize: 500,
    ttl: 3600000,
  },
  semantic: {
    maxSize: 200,
    similarityThreshold: 0.92,
    embeddingModel: 'text-embedding-3-small',
    apiKey: process.env.OPENAI_API_KEY,
  },
})

// Store a response
await cache.set(
  'What is the weather in Paris?',
  'Sunny, 22°C with light winds'
)

// Exact match (Tier 1 hit)
const result1 = await cache.get('What is the weather in Paris?')
// { hit: true, tier: 'exact', data: 'Sunny, 22°C...', latency: 0.8 }

// Pattern match (Tier 2 hit)
const result2 = await cache.get('What is the weather in London?')
// { hit: true, tier: 'smart', data: 'Sunny, 22°C...', latency: 3.2 }

// Semantic match (Tier 3 hit)
const result3 = await cache.get('Tell me the weather for Paris')
// { hit: true, tier: 'semantic', data: 'Sunny, 22°C...', similarity: 0.94, latency: 42.5 }`}
          />
        </Section>

        {/* Live Demo */}
        <Section id="demo" title="Interactive Demo" className="mt-12">
          <p className="text-muted-foreground mb-6">
            Try different queries to see how the cache tiers respond:
          </p>
          <LiveDemo />
        </Section>

        {/* Constructor Configuration */}
        <Section id="configuration" title="Constructor Configuration" className="mt-12">
          <p className="text-muted-foreground mb-6">
            The <code className="text-sm">TieredCacheConfig</code> object
            configures all three cache tiers:
          </p>
          <PropsTable props={configProps} />

          <SubSection id="exact-cache-config" title="ExactCacheConfig">
            <CodeBlock
              language="typescript"
              code={`interface ExactCacheConfig {
  /** Maximum number of entries (default: 1000) */
  maxSize: number
  /** Time-to-live in milliseconds (default: 3600000 = 1 hour) */
  ttl: number
}`}
            />
          </SubSection>

          <SubSection id="smart-cache-config" title="SmartCacheConfig">
            <CodeBlock
              language="typescript"
              code={`interface SmartCacheConfig {
  /** Maximum number of patterns (default: 500) */
  maxSize: number
  /** Time-to-live in milliseconds (default: 3600000 = 1 hour) */
  ttl: number
}`}
            />
          </SubSection>

          <SubSection id="semantic-cache-config" title="SemanticCacheConfig">
            <CodeBlock
              language="typescript"
              code={`interface SemanticCacheConfig {
  /** Maximum number of vectors (default: 200) */
  maxSize: number
  /** Minimum similarity threshold (default: 0.92) */
  similarityThreshold: number
  /** Embedding model name (default: 'text-embedding-3-small') */
  embeddingModel: string
  /** API key for embedding provider */
  apiKey: string
  /** Time-to-live in milliseconds (default: 3600000 = 1 hour) */
  ttl?: number
}`}
            />
          </SubSection>
        </Section>

        {/* Methods */}
        <Section id="methods" title="Methods" className="mt-12">
          <div className="space-y-8">
            {methods.map((method) => (
              <div
                key={method.name}
                className="p-6 rounded-lg border border-border/50 bg-card"
              >
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {method.name}()
                </h3>
                <CodeBlock
                  language="typescript"
                  code={method.signature}
                  className="mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Return Types */}
        <Section id="return-types" title="Return Types" className="mt-12">
          <SubSection id="tiered-cache-result" title="TieredCacheResult">
            <p className="text-muted-foreground mb-4">
              The result object returned by <code>get()</code>:
            </p>
            <PropsTable props={resultProps} />
          </SubSection>

          <SubSection id="cache-stats" title="CacheStats">
            <p className="text-muted-foreground mb-4">
              Comprehensive statistics returned by <code>getStats()</code>:
            </p>
            <CodeBlock
              language="typescript"
              code={`interface CacheStats {
  /** Overall cache hit rate (0-1) */
  hitRate: number
  /** Total hits across all tiers */
  totalHits: number
  /** Total misses (no hit in any tier) */
  totalMisses: number
  /** Current size of exact cache */
  exactSize: number
  /** Current size of smart cache */
  smartSize: number
  /** Current size of semantic cache */
  semanticSize: number
  /** Per-tier statistics */
  tierStats: {
    exact: TierStats
    smart: TierStats
    semantic: TierStats
  }
}

interface TierStats {
  hits: number
  misses: number
  size: number
}`}
            />
          </SubSection>
        </Section>

        {/* Performance Comparison */}
        <Section id="performance" title="Performance Comparison" className="mt-12">
          <p className="text-muted-foreground mb-6">
            Each tier offers different trade-offs between latency, accuracy,
            and hit rate:
          </p>
          <PerformanceTable />

          <div className="mt-6 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Performance Note:</strong>{' '}
                Actual hit rates and latencies depend on query patterns,
                cache size, and similarity thresholds. The values shown are
                typical ranges from production workloads.
              </div>
            </div>
          </div>
        </Section>

        {/* When to Use Each Tier */}
        <Section id="when-to-use" title="When to Use Each Tier" className="mt-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-lg border border-green-500/20 bg-green-500/5">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Tier 1: Exact
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Users repeat exact queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>API responses are deterministic</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Ultra-low latency required</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-500" />
                  <span>Perfect accuracy needed</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-blue-500/20 bg-blue-500/5">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-500" />
                Tier 2: Smart
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Queries follow patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Parameters vary (dates, names, IDs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Low latency still important</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <span>Template-based responses</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-lg border border-purple-500/20 bg-purple-500/5">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-500" />
                Tier 3: Semantic
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Users paraphrase queries</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Natural language variation</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Conceptual similarity matters</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />
                  <span>Higher latency acceptable</span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Advanced Usage */}
        <Section id="advanced-usage" title="Advanced Usage" className="mt-12">
          <SubSection id="prefetching" title="Prefetching Common Queries">
            <p className="text-muted-foreground mb-4">
              Warm the cache with frequently asked questions:
            </p>
            <CodeBlock
              language="typescript"
              code={`const cache = new TieredCache({ /* config */ })

// Prefetch common queries at startup
await cache.prefetch([
  {
    key: 'What are your business hours?',
    value: 'We are open Monday-Friday, 9am-5pm EST.',
  },
  {
    key: 'How do I reset my password?',
    value: 'Click "Forgot Password" on the login page...',
  },
  {
    key: 'What payment methods do you accept?',
    value: 'We accept Visa, Mastercard, American Express...',
  },
])

// Immediate hits for these queries
const result = await cache.get('What are your business hours?')
// { hit: true, tier: 'exact', data: 'We are open...', latency: 0.7 }`}
            />
          </SubSection>

          <SubSection id="monitoring" title="Monitoring Cache Performance">
            <p className="text-muted-foreground mb-4">
              Track cache statistics to optimize configuration:
            </p>
            <CodeBlock
              language="typescript"
              code={`const stats = cache.getStats()

console.log(\`Hit Rate: \${(stats.hitRate * 100).toFixed(1)}%\`)
console.log(\`Total Hits: \${stats.totalHits}\`)
console.log(\`Total Misses: \${stats.totalMisses}\`)

// Per-tier statistics
console.log('Tier 1 (Exact):', {
  hits: stats.tierStats.exact.hits,
  misses: stats.tierStats.exact.misses,
  size: stats.tierStats.exact.size,
})

console.log('Tier 2 (Smart):', {
  hits: stats.tierStats.smart.hits,
  misses: stats.tierStats.smart.misses,
  size: stats.tierStats.smart.size,
})

console.log('Tier 3 (Semantic):', {
  hits: stats.tierStats.semantic.hits,
  misses: stats.tierStats.semantic.misses,
  size: stats.tierStats.semantic.size,
})`}
            />
          </SubSection>

          <SubSection id="invalidation" title="Cache Invalidation">
            <p className="text-muted-foreground mb-4">
              Invalidate stale entries when data changes:
            </p>
            <CodeBlock
              language="typescript"
              code={`// User updates their profile
async function updateUserProfile(userId: string, data: ProfileData) {
  await database.update(userId, data)

  // Invalidate related cache entries
  await cache.invalidate(\`user:\${userId}:profile\`)

  // Note: Only exact cache is cleared immediately.
  // Smart and semantic tiers rely on TTL expiration.
}

// Clear entire cache (e.g., after deployment)
cache.clear()`}
            />
          </SubSection>
        </Section>

        {/* Best Practices */}
        <Section id="best-practices" title="Best Practices" className="mt-12">
          <div className="space-y-6">
            <div className="p-5 rounded-lg border border-border/50 bg-card">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-brand-500" />
                Size Tier Caches Appropriately
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Use larger sizes for tiers with higher hit rates:
              </p>
              <CodeBlock
                language="typescript"
                code={`// Recommended ratios
const cache = new TieredCache({
  exact: { maxSize: 1000 },    // Largest: highest hit rate, lowest cost
  smart: { maxSize: 500 },     // Medium: good hit rate, low cost
  semantic: { maxSize: 200 },  // Smallest: lowest hit rate, highest cost
})`}
              />
            </div>

            <div className="p-5 rounded-lg border border-border/50 bg-card">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-500" />
                Set Appropriate TTLs
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Match TTL to data freshness requirements:
              </p>
              <CodeBlock
                language="typescript"
                code={`const cache = new TieredCache({
  exact: {
    maxSize: 1000,
    ttl: 3600000,  // 1 hour for static data
  },
  smart: {
    maxSize: 500,
    ttl: 1800000,  // 30 minutes for semi-dynamic
  },
  semantic: {
    maxSize: 200,
    ttl: 900000,   // 15 minutes for dynamic data
    similarityThreshold: 0.92,
  },
})`}
              />
            </div>

            <div className="p-5 rounded-lg border border-border/50 bg-card">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                Monitor and Optimize
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Regularly check statistics to optimize configuration:
              </p>
              <CodeBlock
                language="typescript"
                code={`// Log stats periodically
setInterval(() => {
  const stats = cache.getStats()

  // Low hit rate? Increase cache sizes or adjust thresholds
  if (stats.hitRate < 0.6) {
    console.warn('Cache hit rate below 60%:', stats)
  }

  // High semantic tier usage? Increase size
  if (stats.tierStats.semantic.hits > stats.tierStats.exact.hits) {
    console.info('Consider increasing semantic cache size')
  }
}, 60000) // Every minute`}
              />
            </div>

            <div className="p-5 rounded-lg border border-border/50 bg-card">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-500" />
                Tune Similarity Threshold
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Balance between hit rate and accuracy:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span>
                    <strong className="text-foreground">0.95+:</strong> Very
                    strict, high accuracy, lower hit rate
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span>
                    <strong className="text-foreground">0.90-0.95:</strong>{' '}
                    Balanced (recommended)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                  <span>
                    <strong className="text-foreground">0.85-0.90:</strong>{' '}
                    Relaxed, higher hit rate, more false positives
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Related */}
        <Section id="related" title="Related" className="mt-12">
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/api/token-optimization/exact-cache"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-brand-500/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ExactCache
              </h3>
              <p className="text-sm text-muted-foreground">
                Tier 1: Hash-based exact match caching
              </p>
            </Link>

            <Link
              href="/api/token-optimization/smart-cache"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-brand-500/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                SmartCache
              </h3>
              <p className="text-sm text-muted-foreground">
                Tier 2: Pattern-based caching with parameter extraction
              </p>
            </Link>

            <Link
              href="/api/token-optimization/semantic-cache"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-brand-500/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                SemanticCache
              </h3>
              <p className="text-sm text-muted-foreground">
                Tier 3: Vector similarity-based semantic caching
              </p>
            </Link>

            <Link
              href="/guides/token-optimization"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-brand-500/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Token Optimization Guide
              </h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive guide to caching strategies
              </p>
            </Link>
          </div>
        </Section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-border/50"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Last updated: January 2026</div>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/your-org/clarity-chat"
                className="hover:text-brand-500 transition-colors"
              >
                View Source
              </Link>
              <Link
                href="/api/reference"
                className="hover:text-brand-500 transition-colors"
              >
                API Reference
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
