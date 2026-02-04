'use client'

/**
 * OptimizationConfig Type - API Reference Documentation
 *
 * Complete API reference for the OptimizationConfig type used to configure
 * token optimization strategies. Achieving 50-70% cost reduction through
 * compression, caching, and intelligent routing.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Coins,
  TrendingDown,
  Settings,
  PieChart,
  AlertTriangle,
  Database,
  Route,
  Layers,
  Sparkles,
  DollarSign,
  BadgePercent,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
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
// Props/Return Table Components
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
              Property
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
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'cost-impact', title: 'Cost Impact: 50-70% Savings' },
  { id: 'import', title: 'Import' },
  { id: 'type-definition', title: 'Type Definition' },
  {
    id: 'properties',
    title: 'Properties',
    children: [
      { id: 'compression', title: 'Compression Options' },
      { id: 'caching', title: 'Caching Options' },
      { id: 'routing', title: 'Routing Options' },
    ],
  },
  {
    id: 'presets',
    title: 'Preset Configurations',
    children: [
      { id: 'preset-balanced', title: 'Balanced (Default)' },
      { id: 'preset-aggressive', title: 'Aggressive' },
      { id: 'preset-conservative', title: 'Conservative' },
    ],
  },
  {
    id: 'examples',
    title: 'Usage Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-presets', title: 'Using Presets' },
      { id: 'example-custom', title: 'Custom Configuration' },
      { id: 'example-advanced', title: 'Advanced Patterns' },
    ],
  },
  { id: 'performance-vs-cost', title: 'Performance vs Cost' },
  { id: 'best-practices', title: 'Best Practices' },
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
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
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

const compressionProps: PropDefinition[] = [
  {
    name: 'enablePromptShortening',
    type: 'boolean',
    default: 'true',
    description:
      'Remove duplicate sentences, filler words, and simplify complex sentences to reduce token count.',
  },
  {
    name: 'enableHistoryLimiting',
    type: 'boolean',
    default: 'true',
    description:
      'Limit conversation history using sliding window, FIFO, or smart strategies.',
  },
  {
    name: 'compressionRatio',
    type: 'number',
    default: '0.3',
    description:
      'Target reduction percentage (0-1). 0.3 = 30% reduction. Higher values = more compression.',
  },
  {
    name: 'qualityThreshold',
    type: 'number',
    default: '0.8',
    description:
      'Minimum quality threshold (0-1) to maintain during compression. Lower allows more aggressive compression.',
  },
]

const cachingProps: PropDefinition[] = [
  {
    name: 'enableCaching',
    type: 'boolean',
    default: 'true',
    description: 'Enable response caching to avoid duplicate API calls.',
  },
  {
    name: 'enableSimilarityCaching',
    type: 'boolean',
    default: 'false',
    description:
      'Cache similar queries using Jaccard similarity or embeddings. Reduces API calls for related queries.',
  },
  {
    name: 'cacheStorage',
    type: "'memory' | 'localStorage' | 'indexedDB'",
    default: "'memory'",
    description: 'Storage backend for cached responses.',
  },
  {
    name: 'cacheTTL',
    type: 'number',
    default: '3600000',
    description: 'Cache time-to-live in milliseconds (default: 1 hour).',
  },
  {
    name: 'maxCacheSize',
    type: 'number',
    default: '100',
    description: 'Maximum number of cached entries.',
  },
]

const routingProps: PropDefinition[] = [
  {
    name: 'enableModelRouting',
    type: 'boolean',
    default: 'false',
    description:
      'Route simple queries to cheaper models, complex queries to more capable models.',
  },
  {
    name: 'complexityThreshold',
    type: 'number',
    default: '50',
    description:
      'Token threshold for classifying query complexity. Below = simple model, above = complex model.',
  },
  {
    name: 'simpleModel',
    type: 'string',
    default: "'gpt-3.5-turbo'",
    description: 'Model to use for simple queries.',
  },
  {
    name: 'complexModel',
    type: 'string',
    default: "'gpt-4'",
    description: 'Model to use for complex queries.',
  },
]

const otherProps: PropDefinition[] = [
  {
    name: 'enableThrottling',
    type: 'boolean',
    default: 'false',
    description: 'Throttle API requests to prevent rate limit errors.',
  },
  {
    name: 'enableReferences',
    type: 'boolean',
    default: 'false',
    description:
      'Use reference system for large data (>1KB). Stores data externally and passes reference ID.',
  },
  {
    name: 'enableOutputLimits',
    type: 'boolean',
    default: 'false',
    description:
      'Enforce maximum output token/character limits to control costs.',
  },
  {
    name: 'enableBatching',
    type: 'boolean',
    default: 'false',
    description: 'Batch multiple requests together to reduce overhead.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import type { TokenOptimizationConfig } from '@clarity-chat/react'

// Or from optimization utilities
import type { TokenOptimizationConfig } from '@clarity-chat/utils/optimization'`

const typeDefinitionCode = `interface TokenOptimizationConfig {
  // Compression
  enablePromptShortening?: boolean
  enableHistoryLimiting?: boolean
  compressionRatio?: number
  qualityThreshold?: number

  // Caching
  enableCaching?: boolean
  enableSimilarityCaching?: boolean
  cacheStorage?: 'memory' | 'localStorage' | 'indexedDB'
  cacheTTL?: number
  maxCacheSize?: number

  // Routing
  enableModelRouting?: boolean
  complexityThreshold?: number
  simpleModel?: string
  complexModel?: string

  // Other optimizations
  enableThrottling?: boolean
  enableReferences?: boolean
  enableOutputLimits?: boolean
  enableBatching?: boolean
}`

const basicUsageCode = `import { useClarityChat } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    optimization: {
      enablePromptShortening: true,
      enableCaching: true,
      compressionRatio: 0.3,
    },
  })

  return <ChatWindow messages={messages} onSend={append} />
}`

const balancedPresetCode = `// Balanced preset: Good quality + moderate savings (30-40%)
const balancedConfig: TokenOptimizationConfig = {
  // Compression
  enablePromptShortening: true,
  enableHistoryLimiting: true,
  compressionRatio: 0.3,
  qualityThreshold: 0.8,

  // Caching
  enableCaching: true,
  enableSimilarityCaching: false,
  cacheStorage: 'memory',
  cacheTTL: 3600000, // 1 hour
  maxCacheSize: 100,

  // Routing
  enableModelRouting: false,

  // Other
  enableThrottling: false,
  enableReferences: false,
  enableOutputLimits: false,
  enableBatching: false,
}`

const aggressivePresetCode = `// Aggressive preset: Maximum savings (50-70%)
const aggressiveConfig: TokenOptimizationConfig = {
  // Compression
  enablePromptShortening: true,
  enableHistoryLimiting: true,
  compressionRatio: 0.6,       // 60% reduction
  qualityThreshold: 0.7,       // Lower quality threshold

  // Caching
  enableCaching: true,
  enableSimilarityCaching: true,
  cacheStorage: 'indexedDB',
  cacheTTL: 7200000, // 2 hours
  maxCacheSize: 500,

  // Routing
  enableModelRouting: true,
  complexityThreshold: 50,
  simpleModel: 'gpt-3.5-turbo',
  complexModel: 'gpt-4',

  // Other
  enableThrottling: true,
  enableReferences: true,
  enableOutputLimits: true,
  enableBatching: true,
}`

const conservativePresetCode = `// Conservative preset: Minimal impact on quality (10-20% savings)
const conservativeConfig: TokenOptimizationConfig = {
  // Compression
  enablePromptShortening: true,
  enableHistoryLimiting: true,
  compressionRatio: 0.15,      // Only 15% reduction
  qualityThreshold: 0.9,       // High quality threshold

  // Caching
  enableCaching: true,
  enableSimilarityCaching: false,
  cacheStorage: 'memory',
  cacheTTL: 1800000, // 30 minutes
  maxCacheSize: 50,

  // Routing
  enableModelRouting: false,

  // Other
  enableThrottling: false,
  enableReferences: false,
  enableOutputLimits: false,
  enableBatching: false,
}`

const customConfigCode = `import { useClarityChat } from '@clarity-chat/react'

function ChatWithCustomOptimization() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    optimization: {
      // Enable only specific optimizations
      enablePromptShortening: true,
      enableCaching: true,
      enableModelRouting: true,

      // Fine-tune compression
      compressionRatio: 0.4,
      qualityThreshold: 0.85,

      // Configure caching
      cacheStorage: 'indexedDB',
      cacheTTL: 2 * 60 * 60 * 1000, // 2 hours
      maxCacheSize: 200,

      // Configure routing
      complexityThreshold: 75,
      simpleModel: 'gpt-3.5-turbo',
      complexModel: 'gpt-4-turbo',
    },
  })

  return <ChatWindow messages={messages} onSend={append} />
}`

const advancedPatternsCode = `import { useClarityChat } from '@clarity-chat/react'
import { calculateTokenSavings } from '@clarity-chat/utils/optimization'

function AdvancedOptimizationExample() {
  const [config, setConfig] = React.useState<TokenOptimizationConfig>({
    enablePromptShortening: true,
    enableCaching: true,
    compressionRatio: 0.3,
  })

  const { messages, append } = useClarityChat({
    api: '/api/chat',
    optimization: config,
  })

  // Dynamic adjustment based on usage
  const adjustOptimization = (currentCost: number, budget: number) => {
    if (currentCost > budget * 0.8) {
      // Approaching budget - increase optimization
      setConfig({
        ...config,
        compressionRatio: 0.5,
        enableModelRouting: true,
      })
    }
  }

  return (
    <div>
      <ChatWindow messages={messages} onSend={append} />
      <OptimizationControls
        config={config}
        onChange={setConfig}
        onAdjust={adjustOptimization}
      />
    </div>
  )
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function OptimizationConfigPage() {
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
                  <Settings className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Type
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                      50-70% Savings
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                OptimizationConfig
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Configuration type for token optimization strategies. Achieve
                50-70% cost reduction through intelligent compression, caching,
                and model routing.
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
                {
                  icon: Layers,
                  label: 'Compression',
                  desc: 'Smart text reduction',
                },
                {
                  icon: Database,
                  label: 'Caching',
                  desc: 'Response reuse',
                },
                {
                  icon: Route,
                  label: 'Routing',
                  desc: 'Model optimization',
                },
                {
                  icon: TrendingDown,
                  label: '50-70% Savings',
                  desc: 'Proven reduction',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The <code>OptimizationConfig</code> type configures token
                  optimization strategies to reduce API costs while maintaining
                  quality. It supports compression, caching, and intelligent
                  routing across multiple model providers.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Compression:</strong> Reduce token count by 30-60%
                    through prompt shortening and history limiting
                  </li>
                  <li>
                    <strong>Caching:</strong> Eliminate duplicate API calls
                    with exact and similarity-based caching
                  </li>
                  <li>
                    <strong>Model Routing:</strong> Route simple queries to
                    cheaper models, saving up to 90% on simple requests
                  </li>
                  <li>
                    <strong>Preset Configurations:</strong> Use balanced,
                    aggressive, or conservative presets for common scenarios
                  </li>
                </ul>
              </div>
            </Section>

            {/* Cost Impact Section */}
            <Section id="cost-impact" title="Cost Impact: 50-70% Savings">
              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-brand-500/10 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <BadgePercent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Configure for Optimal 50-70% Savings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      With the right configuration, achieve consistent cost
                      reduction across all AI interactions. Here&apos;s the
                      impact by optimization type:
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Layers className="w-4 h-4 text-purple-500" />
                          <span className="font-semibold text-sm">
                            Compression
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Prompt shortening + history limiting
                        </p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          30-50% savings
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Database className="w-4 h-4 text-blue-500" />
                          <span className="font-semibold text-sm">Caching</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Response reuse for similar queries
                        </p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          10-30% savings
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Route className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-sm">Routing</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Cheaper models for simple queries
                        </p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          20-40% savings
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-pink-500" />
                          <span className="font-semibold text-sm">
                            Combined
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          All optimizations enabled
                        </p>
                        <p className="text-lg font-bold text-pink-600 dark:text-pink-400">
                          50-70% savings
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800">
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        <strong>Real-world example:</strong> A typical chat
                        application spending $1,000/month can reduce costs to
                        $300-500/month with aggressive optimization.
                      </p>
                    </div>
                  </div>
                </div>
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

            {/* Type Definition Section */}
            <Section id="type-definition" title="Type Definition">
              <CodeBlock
                code={typeDefinitionCode}
                language="tsx"
                filename="OptimizationConfig"
                showDownloadButton={false}
              />
            </Section>

            {/* Properties Section */}
            <Section id="properties" title="Properties">
              <SubSection id="compression" title="Compression Options">
                <p className="text-muted-foreground mb-4">
                  Control how text is compressed to reduce token count.
                  Compression is the most effective optimization strategy,
                  achieving 30-50% savings.
                </p>
                <PropsTable props={compressionProps} />
              </SubSection>

              <SubSection id="caching" title="Caching Options">
                <p className="text-muted-foreground mb-4">
                  Configure response caching to eliminate duplicate API calls.
                  Effective for applications with repetitive queries.
                </p>
                <PropsTable props={cachingProps} />
              </SubSection>

              <SubSection id="routing" title="Routing Options">
                <p className="text-muted-foreground mb-4">
                  Enable intelligent model routing to use cheaper models for
                  simple queries. Can save 20-40% by routing 50-70% of queries
                  to cheaper models.
                </p>
                <PropsTable props={routingProps} />
              </SubSection>

              <SubSection id="other" title="Other Optimizations">
                <p className="text-muted-foreground mb-4">
                  Additional optimization strategies for specific use cases.
                </p>
                <PropsTable props={otherProps} />
              </SubSection>
            </Section>

            {/* Presets Section */}
            <Section id="presets" title="Preset Configurations">
              <p className="text-muted-foreground mb-6">
                Pre-configured optimization profiles for common scenarios.
                Choose based on your quality requirements and cost sensitivity.
              </p>

              <SubSection id="preset-balanced" title="Balanced (Default)">
                <p className="text-muted-foreground mb-4">
                  Good quality with moderate savings (30-40%). Recommended for
                  most applications.
                </p>
                <CodeBlock
                  code={balancedPresetCode}
                  language="tsx"
                  filename="Balanced Preset"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="preset-aggressive" title="Aggressive">
                <p className="text-muted-foreground mb-4">
                  Maximum savings (50-70%) with acceptable quality trade-offs.
                  Best for high-volume, cost-sensitive applications.
                </p>
                <CodeBlock
                  code={aggressivePresetCode}
                  language="tsx"
                  filename="Aggressive Preset"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="preset-conservative" title="Conservative">
                <p className="text-muted-foreground mb-4">
                  Minimal impact on quality (10-20% savings). Best for
                  applications where quality is paramount.
                </p>
                <CodeBlock
                  code={conservativePresetCode}
                  language="tsx"
                  filename="Conservative Preset"
                  showDownloadButton={false}
                />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Usage Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple optimization with compression and caching:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicUsage.tsx"
                />
              </SubSection>

              <SubSection id="example-presets" title="Using Presets">
                <p className="text-muted-foreground mb-4">
                  Apply preset configurations for common scenarios:
                </p>
                <CodeBlock
                  code={`import { useClarityChat } from '@clarity-chat/react'
import {
  balancedOptimization,
  aggressiveOptimization,
  conservativeOptimization,
} from '@clarity-chat/utils/optimization'

function ChatWithPreset() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    optimization: aggressiveOptimization, // Use preset
  })

  return <ChatWindow messages={messages} onSend={append} />
}`}
                  language="tsx"
                  filename="UsingPresets.tsx"
                />
              </SubSection>

              <SubSection id="example-custom" title="Custom Configuration">
                <p className="text-muted-foreground mb-4">
                  Create custom optimization strategies:
                </p>
                <CodeBlock
                  code={customConfigCode}
                  language="tsx"
                  filename="CustomConfig.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-advanced" title="Advanced Patterns">
                <p className="text-muted-foreground mb-4">
                  Dynamic optimization adjustment based on usage:
                </p>
                <CodeBlock
                  code={advancedPatternsCode}
                  language="tsx"
                  filename="AdvancedOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Performance vs Cost Section */}
            <Section id="performance-vs-cost" title="Performance vs Cost">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Different optimization strategies have different trade-offs
                  between cost savings and quality/performance:
                </p>

                <div className="overflow-x-auto rounded-lg border border-border/50 not-prose mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Strategy
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Cost Savings
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Quality Impact
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Performance Impact
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Best For
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3 font-semibold">Caching</td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          10-30%
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          None
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          Faster
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Repetitive queries
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3 font-semibold">
                          Light compression
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          15-25%
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          Minimal
                        </td>
                        <td className="px-4 py-3 text-amber-600 dark:text-amber-400">
                          Slight delay
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          General use
                        </td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3 font-semibold">
                          Model routing
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          20-40%
                        </td>
                        <td className="px-4 py-3 text-amber-600 dark:text-amber-400">
                          Moderate
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          Faster
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Mixed complexity
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3 font-semibold">
                          Aggressive compression
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          40-60%
                        </td>
                        <td className="px-4 py-3 text-red-600 dark:text-red-400">
                          Noticeable
                        </td>
                        <td className="px-4 py-3 text-red-600 dark:text-red-400">
                          Processing delay
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          Cost-sensitive
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold">
                          All optimizations
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          50-70%
                        </td>
                        <td className="px-4 py-3 text-amber-600 dark:text-amber-400">
                          Acceptable
                        </td>
                        <td className="px-4 py-3 text-amber-600 dark:text-amber-400">
                          Slight delay
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          High volume
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Best Practices Section */}
            <Section id="best-practices" title="Best Practices">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    Start with balanced preset
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use the balanced preset as a starting point and adjust
                    based on your specific needs. Monitor quality and cost to
                    find the right balance.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    Enable caching for all applications
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Caching has zero quality impact and improves performance.
                    It&apos;s a no-brainer optimization that should be enabled
                    by default.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Route className="w-4 h-4 text-purple-500" />
                    Use model routing for mixed workloads
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    If your application handles both simple and complex queries,
                    enable model routing. Simple queries like &quot;What&apos;s
                    the weather?&quot; don&apos;t need GPT-4.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Monitor quality metrics
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Track user satisfaction and response quality when using
                    aggressive optimization. Adjust compressionRatio and
                    qualityThreshold if quality degrades.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-green-500" />
                    Measure actual savings
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use token tracking hooks to measure actual cost savings.
                    Compare before/after optimization to validate the impact.
                  </p>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description:
                      'Main chat hook with optimization support',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'useTokenOptimization',
                    type: 'hook',
                    description: 'Advanced token optimization hook',
                    href: '/reference/hooks/use-token-optimization',
                  },
                  {
                    name: 'TokenOptimizationPanel',
                    type: 'component',
                    description: 'UI for displaying optimization stats',
                    href: '/reference/components/token-optimization-panel',
                  },
                  {
                    name: 'Achieving 50-70% Reduction',
                    type: 'cookbook',
                    description: 'Complete guide to cost optimization',
                    href: '/cookbook/achieving-50-percent-reduction',
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
                            : api.type === 'component'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/types"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Types Reference
                    </div>
                  </div>
                </Link>
                <Link
                  href="/cookbook/achieving-50-percent-reduction"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      50-70% Cost Reduction Guide
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

// Add missing tokenCountOptionsProps
const tokenCountOptionsProps: PropDefinition[] = [
  {
    name: 'model',
    type: 'ModelName',
    default: "'gpt-4o'",
    description: 'Model name for accurate tokenization',
  },
  {
    name: 'debounceMs',
    type: 'number',
    default: '300',
    description: 'Debounce delay in milliseconds',
  },
  {
    name: 'immediate',
    type: 'boolean',
    default: 'false',
    description: 'Skip debounce for first count',
  },
]
