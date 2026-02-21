'use client'

/**
 * useTokenOptimization Hook - API Reference Documentation
 *
 * Complete token optimization hook with caching, compression, routing, and React 19 features.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Code2, Copy, Check, ChevronRight, Zap, Database, Settings, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

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
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  )
}

// ============================================================================
// Props/Return Table Components
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({ props, title }: { props: PropDefinition[]; title?: string }) {
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
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Default</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">{prop.name}</span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">{prop.default || '-'}</td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
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
        <a href={`#${id}`} className="hover:text-brand-500 transition-colors group">
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">#</span>
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
        <a href={`#${id}`} className="hover:text-brand-500 transition-colors group">
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">#</span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  {
    id: 'preset-options',
    title: 'Preset Options',
    children: [
      { id: 'preset-minimal', title: 'Minimal' },
      { id: 'preset-standard', title: 'Standard' },
      { id: 'preset-production', title: 'Production' },
      { id: 'preset-enterprise', title: 'Enterprise' },
    ],
  },
  { id: 'configuration', title: 'Configuration' },
  { id: 'return-values', title: 'Return Values' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-with-cache', title: 'With Caching' },
      { id: 'example-full-optimization', title: 'Full Optimization' },
    ],
  },
  { id: 'related', title: 'Related APIs' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="sticky top-24 space-y-1 text-sm" aria-label="Table of contents">
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const configProps: PropDefinition[] = [
  {
    name: 'preset',
    type: "'minimal' | 'standard' | 'production' | 'enterprise'",
    default: "'standard'",
    description: 'Preset configuration level with optimized settings for different use cases.',
  },
  {
    name: 'model',
    type: 'string',
    default: "'gpt-4o'",
    description: 'Model identifier for accurate token counting (e.g., "gpt-4o", "claude-3-sonnet").',
  },
  {
    name: 'availableModels',
    type: 'string[]',
    default: "['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo']",
    description: 'Available models for intelligent routing based on prompt complexity.',
  },
  {
    name: 'enableCache',
    type: 'boolean',
    default: 'true',
    description: 'Enable tiered caching (exact, smart, semantic) for response reuse.',
  },
  {
    name: 'enableCompression',
    type: 'boolean',
    default: 'true',
    description: 'Enable markdown compression to reduce token count.',
  },
  {
    name: 'enableRouting',
    type: 'boolean',
    default: 'true',
    description: 'Enable intelligent model routing based on prompt complexity.',
  },
  {
    name: 'cacheConfig',
    type: 'Partial<TieredCacheConfig>',
    description: 'Custom cache configuration. Overrides preset cache settings.',
  },
  {
    name: 'routerConfig',
    type: 'Partial<ModelRouterConfig>',
    description: 'Custom router configuration. Overrides preset routing settings.',
  },
]

const returnProps: PropDefinition[] = [
  {
    name: 'countTokens',
    type: '(text: string) => number',
    description: 'Count tokens in text using the configured model tokenizer.',
  },
  {
    name: 'getFromCache',
    type: '(prompt: string) => Promise<string | undefined>',
    description: 'Retrieve cached response for a prompt. Returns undefined if not cached.',
  },
  {
    name: 'setInCache',
    type: '(prompt: string, response: string) => Promise<void>',
    description: 'Store a response in cache for future retrieval.',
  },
  {
    name: 'compress',
    type: '(text: string) => MarkdownCompressionResult',
    description: 'Compress markdown text to reduce token count while preserving meaning.',
  },
  {
    name: 'route',
    type: '(prompt: string) => RoutingResult',
    description: 'Route a prompt to the optimal model based on complexity and cost.',
  },
  {
    name: 'optimize',
    type: '(prompt: string) => Promise<OptimizationResult>',
    description: 'Apply full optimization: check cache, compress, and route to best model.',
  },
  {
    name: 'getStats',
    type: '() => OptimizationStats',
    description: 'Get combined statistics for cache, router, and token savings.',
  },
  {
    name: 'resetStats',
    type: '() => void',
    description: 'Reset all statistics to zero.',
  },
  {
    name: 'clearCache',
    type: '() => void',
    description: 'Clear all cached responses.',
  },
  {
    name: 'isPending',
    type: 'boolean',
    description: 'React 19: Whether a non-blocking state transition is pending.',
  },
  {
    name: 'optimisticCache',
    type: 'OptimisticCacheState',
    description: 'React 19: Optimistic cache state for instant UI feedback.',
  },
  {
    name: 'optimisticSetInCache',
    type: '(prompt: string, response: string) => void',
    description: 'React 19: Optimistically add to cache with instant UI update.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { useTokenOptimization } from '@clarity-chat/token-optimization'
import type {
  UseTokenOptimizationConfig,
  UseTokenOptimizationReturn,
  TokenOptimizationPreset,
  OptimizationResult,
  OptimizationStats,
} from '@clarity-chat/token-optimization'`

const signatureCode = `function useTokenOptimization(
  config?: UseTokenOptimizationConfig
): UseTokenOptimizationReturn`

const basicUsageCode = `import { useTokenOptimization } from '@clarity-chat/token-optimization'

function ChatComponent() {
  const { countTokens, optimize, getStats } = useTokenOptimization({
    preset: 'standard',
    model: 'gpt-4o',
  })

  const handleSend = async (userMessage: string) => {
    // Count tokens before sending
    const tokenCount = countTokens(userMessage)
    console.log(\`Message has \${tokenCount} tokens\`)

    // Optimize the message
    const result = await optimize(userMessage)

    if (result.cachedResponse) {
      // Use cached response instantly
      return result.cachedResponse
    }

    // Send optimized message to API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: result.compressedPrompt,
        model: result.recommendedModel,
      }),
    })

    console.log(\`Saved \${result.tokensSaved} tokens\`)
    console.log(\`Estimated cost saved: $\${result.estimatedCostSaved.toFixed(4)}\`)
  }

  return (
    <div>
      {/* Your chat UI */}
    </div>
  )
}`

const cacheUsageCode = `import { useTokenOptimization } from '@clarity-chat/token-optimization'

function ChatWithCache() {
  const {
    getFromCache,
    setInCache,
    optimisticSetInCache, // React 19 feature
    isPending,
    getStats,
  } = useTokenOptimization({
    preset: 'production',
    enableCache: true,
  })

  const handleSend = async (prompt: string) => {
    // Try to get from cache first
    const cached = await getFromCache(prompt)
    if (cached) {
      console.log('Cache hit! Saved API call')
      return cached
    }

    // Make API call
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    })
    const data = await response.json()

    // Store in cache for future use
    // Use optimistic update for instant UI feedback (React 19)
    optimisticSetInCache(prompt, data.response)

    return data.response
  }

  // Display cache statistics
  const stats = getStats()

  return (
    <div>
      <div className="stats">
        <p>Cache hits: {stats.cache?.hits || 0}</p>
        <p>Cache misses: {stats.cache?.misses || 0}</p>
        <p>Hit rate: {((stats.cache?.hits || 0) / ((stats.cache?.hits || 0) + (stats.cache?.misses || 1)) * 100).toFixed(1)}%</p>
        {isPending && <span>Updating cache...</span>}
      </div>
      {/* Your chat UI */}
    </div>
  )
}`

const fullOptimizationCode = `import { useTokenOptimization } from '@clarity-chat/token-optimization'

function FullyOptimizedChat() {
  const {
    optimize,
    getStats,
    resetStats,
    clearCache,
  } = useTokenOptimization({
    preset: 'enterprise', // Aggressive optimization
    model: 'gpt-4o',
    availableModels: [
      'gpt-4o-mini',    // Cheapest
      'gpt-4o',         // Balanced
      'gpt-4-turbo',    // Most capable
    ],
    enableCache: true,
    enableCompression: true,
    enableRouting: true,
  })

  const handleSend = async (userMessage: string) => {
    // Full optimization pipeline
    const result = await optimize(userMessage)

    // Check if we can use cached response
    if (result.cachedResponse) {
      console.log('✅ Using cached response (0 API cost)')
      return result.cachedResponse
    }

    // Send to recommended model
    console.log(\`📤 Sending to \${result.recommendedModel}\`)
    console.log(\`💰 Saved \${result.tokensSaved} tokens ($\${result.estimatedCostSaved.toFixed(4)})\`)

    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: result.compressedPrompt,
        model: result.recommendedModel,
      }),
    })

    const data = await response.json()
    return data.response
  }

  // Show comprehensive stats
  const stats = getStats()

  return (
    <div>
      <div className="optimization-dashboard">
        <h3>Optimization Statistics</h3>

        {/* Token Savings */}
        <div className="stat-card">
          <h4>Token Savings</h4>
          <p className="big-number">{stats.tokensSaved.toLocaleString()}</p>
          <p className="caption">
            {stats.tokensProcessed > 0
              ? \`\${((stats.tokensSaved / stats.tokensProcessed) * 100).toFixed(1)}% reduction\`
              : '0% reduction'}
          </p>
        </div>

        {/* Cache Performance */}
        {stats.cache && (
          <div className="stat-card">
            <h4>Cache Performance</h4>
            <p>Hits: {stats.cache.hits}</p>
            <p>Misses: {stats.cache.misses}</p>
            <p>Hit Rate: {(stats.cache.hitRate * 100).toFixed(1)}%</p>
          </div>
        )}

        {/* Routing Stats */}
        <div className="stat-card">
          <h4>Model Routing</h4>
          <p>Total routes: {stats.router.totalRoutes}</p>
          <p>Small: {stats.router.routesByTier.small}</p>
          <p>Medium: {stats.router.routesByTier.medium}</p>
          <p>Large: {stats.router.routesByTier.large}</p>
          <p>Estimated savings: ${stats.router.estimatedSavings.toFixed(2)}</p>
        </div>

        <div className="actions">
          <button onClick={resetStats}>Reset Stats</button>
          <button onClick={clearCache}>Clear Cache</button>
        </div>
      </div>

      {/* Your chat UI */}
    </div>
  )
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseTokenOptimizationPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Zap className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Hook
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/token-optimization
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">useTokenOptimization</h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                All-in-one token optimization hook with intelligent caching, compression, and
                model routing. Includes React 19 features like useOptimistic for instant UI
                feedback.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: Database, label: 'Tiered Caching', desc: 'Exact + semantic' },
                { icon: Layers, label: 'Compression', desc: 'Markdown-aware' },
                { icon: Settings, label: 'Smart Routing', desc: 'Cost-optimized' },
                { icon: Zap, label: 'React 19', desc: 'Optimistic updates' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <Icon className="w-5 h-5 text-brand-500 mb-2" aria-hidden="true" />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>useTokenOptimization</code> is a unified React hook that combines token
                  counting, caching, compression, and intelligent model routing into a single
                  interface. It provides four preset configurations for different use cases, from
                  minimal overhead to enterprise-grade optimization.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Tiered Caching:</strong> Three-layer cache (exact, smart, semantic)
                    for maximum hit rates
                  </li>
                  <li>
                    <strong>Markdown Compression:</strong> TOON-based compression preserves code
                    and instructions
                  </li>
                  <li>
                    <strong>Intelligent Routing:</strong> Automatic model selection based on
                    prompt complexity
                  </li>
                  <li>
                    <strong>React 19 Ready:</strong> useTransition and useOptimistic for instant
                    UI feedback
                  </li>
                  <li>
                    <strong>Preset Configurations:</strong> Minimal, Standard, Production,
                    Enterprise presets
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Cost Savings</h4>
                <p>
                  With the <code>enterprise</code> preset, typical applications see:
                </p>
                <ul>
                  <li>40-70% reduction in token usage through compression</li>
                  <li>80%+ cache hit rate after warm-up period</li>
                  <li>20-40% cost savings from intelligent model routing</li>
                  <li>Combined savings of 60-90% on API costs</li>
                </ul>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <CodeBlock
                code={importCode}
                language="tsx"
                filename="Import"
                showDownloadButton={false}
              />
            </Section>

            {/* Signature Section */}
            <Section id="signature" title="Signature">
              <CodeBlock
                code={signatureCode}
                language="tsx"
                filename="Signature"
                showDownloadButton={false}
              />
            </Section>

            {/* Preset Options Section */}
            <Section id="preset-options" title="Preset Options">
              <p className="text-muted-foreground mb-6">
                Choose a preset configuration optimized for your use case. Each preset balances
                performance, cost, and resource usage differently.
              </p>

              <div className="space-y-6">
                <SubSection id="preset-minimal" title="Minimal">
                  <div className="p-6 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Minimal</h4>
                        <p className="text-sm text-muted-foreground">
                          Lowest resource usage, suitable for development and testing
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded">
                        Development
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Cache Settings</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Exact cache: 100 entries</li>
                          <li>• Smart cache: 50 entries</li>
                          <li>• TTL: 5 minutes</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Optimization</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Compression: Light</li>
                          <li>• Routing: Cost-optimized</li>
                          <li>• Semantic cache: 50 entries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SubSection>

                <SubSection id="preset-standard" title="Standard (Default)">
                  <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Standard</h4>
                        <p className="text-sm text-muted-foreground">
                          Balanced defaults for most applications (recommended)
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-600 dark:text-green-400 rounded">
                        Default
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Cache Settings</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Exact cache: 500 entries</li>
                          <li>• Smart cache: 200 entries</li>
                          <li>• TTL: 30 minutes</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Optimization</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Compression: Moderate</li>
                          <li>• Routing: Balanced</li>
                          <li>• Semantic cache: 200 entries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SubSection>

                <SubSection id="preset-production" title="Production">
                  <div className="p-6 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Production</h4>
                        <p className="text-sm text-muted-foreground">
                          Higher limits and longer TTL for production workloads
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded">
                        Production
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Cache Settings</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Exact cache: 1,000 entries</li>
                          <li>• Smart cache: 500 entries</li>
                          <li>• TTL: 1 hour</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Optimization</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Compression: Moderate</li>
                          <li>• Routing: Balanced</li>
                          <li>• Semantic cache: 500 entries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SubSection>

                <SubSection id="preset-enterprise" title="Enterprise">
                  <div className="p-6 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-1">Enterprise</h4>
                        <p className="text-sm text-muted-foreground">
                          Maximum performance and optimization for high-volume applications
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded">
                        Enterprise
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-2">Cache Settings</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Exact cache: 5,000 entries</li>
                          <li>• Smart cache: 2,000 entries</li>
                          <li>• TTL: 2 hours</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-2">Optimization</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Compression: Aggressive</li>
                          <li>• Routing: Quality-first</li>
                          <li>• Semantic cache: 2,000 entries</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SubSection>
              </div>
            </Section>

            {/* Configuration Section */}
            <Section id="configuration" title="Configuration">
              <p className="text-muted-foreground mb-6">
                All configuration options. Start with a preset and override specific settings as
                needed.
              </p>
              <PropsTable props={configProps} />
            </Section>

            {/* Return Values Section */}
            <Section id="return-values" title="Return Values">
              <p className="text-muted-foreground mb-6">
                The hook returns an object with methods for optimization operations and state
                management.
              </p>
              <PropsTable props={returnProps} />
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple token optimization with counting and compression:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-with-cache" title="With Caching">
                <p className="text-muted-foreground mb-4">
                  Leverage caching to avoid redundant API calls. Includes React 19 optimistic
                  updates:
                </p>
                <CodeBlock
                  code={cacheUsageCode}
                  language="tsx"
                  filename="CachedOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-full-optimization" title="Full Optimization Pipeline">
                <p className="text-muted-foreground mb-4">
                  Complete optimization with caching, compression, routing, and comprehensive
                  statistics:
                </p>
                <CodeBlock
                  code={fullOptimizationCode}
                  language="tsx"
                  filename="FullOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'AccurateTokenCounter',
                    type: 'class',
                    description: 'Low-level token counting with model-specific tokenizers',
                    href: '/api/token-optimization/accurate-token-counter',
                  },
                  {
                    name: 'TieredCache',
                    type: 'class',
                    description: 'Three-layer caching system used internally',
                    href: '/api/token-optimization/tiered-cache',
                  },
                  {
                    name: 'ModelRouter',
                    type: 'class',
                    description: 'Intelligent model selection based on complexity',
                    href: '/api/token-optimization/model-router',
                  },
                  {
                    name: 'MarkdownCompressor',
                    type: 'class',
                    description: 'TOON-based markdown compression',
                    href: '/api/token-optimization/markdown-compressor',
                  },
                  {
                    name: 'useTokenCount',
                    type: 'hook',
                    description: 'Simple token counting hook',
                    href: '/reference/hooks/use-token-optimization#use-token-count',
                  },
                  {
                    name: 'useTokenBudgetMonitor',
                    type: 'hook',
                    description: 'Budget monitoring with threshold warnings',
                    href: '/reference/hooks/use-token-optimization#use-token-budget-monitor',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : api.type === 'class'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-green-500/10 text-green-600 dark:text-green-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{api.description}</p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/api/token-optimization"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Previous</div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Token Optimization
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-token-optimization"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Next</div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Token Optimization Hooks
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
