'use client'

/**
 * Provider Caching API Documentation
 *
 * The 90% savings hero - comprehensive documentation for formatMessagesForProviderCaching
 * and the provider caching ecosystem.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingDown,
  Zap,
  Database,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Copy,
  Server,
  Gauge,
  Calculator,
  ShieldCheck,
  Trophy,
  Sparkles,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { PropsTable, type PropDefinition } from '../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import type { TocItem } from '../../../../components/Docs/TableOfContents'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'quick-start', title: 'Quick Start', level: 2 },
  { id: 'before-after', title: 'Before/After Example', level: 2 },
  { id: 'provider-examples', title: 'Provider Examples', level: 2 },
  { id: 'api-reference', title: 'API Reference', level: 2 },
  { id: 'cost-calculator', title: 'Monthly Savings Calculator', level: 2 },
  { id: 'cache-requirements', title: 'Cache Requirements & TTL', level: 2 },
  { id: 'troubleshooting', title: 'Troubleshooting', level: 2 },
  { id: 'best-practices', title: 'Best Practices', level: 2 },
]

// ============================================================================
// Props Definitions
// ============================================================================

const formatMessagesProps: PropDefinition[] = [
  {
    name: 'messages',
    type: 'CacheableMessage[]',
    required: true,
    description: 'Array of messages with role and content. Use cacheable: true to mark static messages.',
  },
  {
    name: 'config',
    type: 'Partial<ProviderCachingConfig>',
    description: 'Optional configuration for provider-specific caching behavior',
  },
  {
    name: 'tokenCounter',
    type: 'TokenCounter',
    description: 'Optional custom token counter (defaults to AccurateTokenCounter)',
  },
]

const providerConfigProps: PropDefinition[] = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Whether to enable provider caching',
  },
  {
    name: 'provider',
    type: "'anthropic' | 'openai' | 'google'",
    default: "'anthropic'",
    description: 'Which provider to use for caching',
  },
  {
    name: 'anthropic',
    type: 'AnthropicCachingConfig',
    description: 'Anthropic-specific configuration (minCachedTokens, maxBreakpoints, defaultTTL)',
  },
  {
    name: 'openai',
    type: 'OpenAICachingConfig',
    description: 'OpenAI-specific configuration (optimizeMessageOrder, retention)',
  },
  {
    name: 'google',
    type: 'GoogleCachingConfig',
    description: 'Google-specific configuration (mode: implicit|explicit, cacheId, defaultTTL)',
  },
]

const providerComparisonData = [
  {
    provider: 'Anthropic',
    model: 'Claude 3.5 Sonnet',
    inputCost: '$3.00 / 1M tokens',
    cachedCost: '$0.30 / 1M tokens',
    savings: '90%',
    minTokens: '1,024',
    ttl: '5 min',
    maxBreakpoints: '4',
  },
  {
    provider: 'Anthropic',
    model: 'Claude 3 Haiku',
    inputCost: '$0.25 / 1M tokens',
    cachedCost: '$0.025 / 1M tokens',
    savings: '90%',
    minTokens: '1,024',
    ttl: '5 min',
    maxBreakpoints: '4',
  },
  {
    provider: 'OpenAI',
    model: 'GPT-4o',
    inputCost: '$2.50 / 1M tokens',
    cachedCost: '$1.25 / 1M tokens',
    savings: '50%',
    minTokens: '1,024',
    ttl: '1 hour',
    maxBreakpoints: 'Auto',
  },
  {
    provider: 'OpenAI',
    model: 'GPT-4o-mini',
    inputCost: '$0.15 / 1M tokens',
    cachedCost: '$0.075 / 1M tokens',
    savings: '50%',
    minTokens: '1,024',
    ttl: '1 hour',
    maxBreakpoints: 'Auto',
  },
  {
    provider: 'Google',
    model: 'Gemini 2.0 Flash',
    inputCost: '$0.50 / 1M tokens',
    cachedCost: '$0.05 / 1M tokens',
    savings: '90%',
    minTokens: '1,024',
    ttl: 'Custom',
    maxBreakpoints: 'Auto',
  },
]

// ============================================================================
// Cost Calculator Component
// ============================================================================

function MonthlySavingsCalculator() {
  const [monthlyTokens, setMonthlyTokens] = React.useState(10_000_000)
  const [provider, setProvider] = React.useState<'anthropic' | 'openai' | 'google'>('anthropic')
  const [cacheHitRate, setCacheHitRate] = React.useState(70)

  // Provider-specific pricing (per 1M tokens)
  const pricing = {
    anthropic: { input: 3.0, cached: 0.3 },
    openai: { input: 2.5, cached: 1.25 },
    google: { input: 0.5, cached: 0.05 },
  }

  const selectedPricing = pricing[provider]
  const cachedTokens = (monthlyTokens * cacheHitRate) / 100
  const uncachedTokens = monthlyTokens - cachedTokens

  // Costs
  const baselineCost = (monthlyTokens / 1_000_000) * selectedPricing.input
  const optimizedCost =
    (cachedTokens / 1_000_000) * selectedPricing.cached +
    (uncachedTokens / 1_000_000) * selectedPricing.input

  const monthlySavings = baselineCost - optimizedCost
  const annualSavings = monthlySavings * 12
  const savingsPercent = ((monthlySavings / baselineCost) * 100).toFixed(1)

  return (
    <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground">Monthly Savings Calculator</h3>
          <p className="text-sm text-muted-foreground">Calculate your cost reduction with provider caching</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Monthly Token Volume
            </label>
            <input
              type="number"
              value={monthlyTokens}
              onChange={(e) => setMonthlyTokens(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground font-mono text-lg"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {(monthlyTokens / 1_000_000).toFixed(1)}M tokens per month
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as any)}
              className="w-full px-4 py-3 rounded-lg border border-border/50 bg-background text-foreground"
            >
              <option value="anthropic">Anthropic (90% savings)</option>
              <option value="openai">OpenAI (50% savings)</option>
              <option value="google">Google (90% savings)</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Input: ${selectedPricing.input}/1M • Cached: ${selectedPricing.cached}/1M
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cache Hit Rate: {cacheHitRate}%
            </label>
            <input
              type="range"
              min="30"
              max="95"
              value={cacheHitRate}
              onChange={(e) => setCacheHitRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Conservative (30%)</span>
              <span>Typical (70%)</span>
              <span>Excellent (95%)</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-border/50 shadow-sm">
            <div className="text-sm text-muted-foreground mb-1">Baseline Cost (No Caching)</div>
            <div className="text-3xl font-bold text-foreground">${baselineCost.toFixed(2)}/mo</div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
            <div className="text-sm opacity-90 mb-1 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Monthly Savings</span>
            </div>
            <div className="text-4xl font-bold mb-1">${monthlySavings.toFixed(2)}</div>
            <div className="text-sm opacity-90">
              {savingsPercent}% cost reduction • {cacheHitRate}% cache hit rate
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-xs text-muted-foreground mb-1">Annual Savings</div>
              <div className="text-xl font-bold text-foreground">${annualSavings.toFixed(0)}</div>
            </div>
            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-xs text-muted-foreground mb-1">Optimized Cost</div>
              <div className="text-xl font-bold text-foreground">${optimizedCost.toFixed(2)}</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <strong className="text-foreground">ROI Impact:</strong> At this volume, provider caching
                pays for itself in the first hour of implementation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ProviderCachingPage() {
  return (
    <DocumentationPage
      title="Provider Caching"
      description="Achieve 90% cost reduction with provider-native caching from Anthropic, OpenAI, and Google"
      icon={Trophy}
      badges={[
        { label: '90% Savings', variant: 'success' },
        { label: 'Production Ready', variant: 'stable' },
        { label: 'Hero Feature', variant: 'premium' },
      ]}
      packageName="@clarity-chat/token-optimization"
      features={[
        {
          icon: DollarSign,
          label: 'Massive Savings',
          description: 'Up to 90% cost reduction on cached tokens',
        },
        {
          icon: Server,
          label: 'Multi-Provider',
          description: 'Works with Anthropic, OpenAI, and Google',
        },
        {
          icon: Zap,
          label: 'Zero Config',
          description: 'Simple API with intelligent defaults',
        },
        {
          icon: ShieldCheck,
          label: 'Production Safe',
          description: 'Battle-tested with automatic fallbacks',
        },
      ]}
      tableOfContents={tableOfContents}
    >
      {/* Hero Overview */}
      <Section id="overview" title="Overview">
        <div className="space-y-8">
          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: durations.moderate }}
            className="p-8 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8" />
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                  THE 90% SAVINGS HERO
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3">Save 50-90% with Provider Caching</h2>
              <p className="text-lg opacity-90 max-w-3xl">
                Provider caching leverages built-in caching features from Anthropic, OpenAI, and Google
                to dramatically reduce costs on repeated content. Perfect for chatbots with static system
                prompts, RAG applications with large document context, and any scenario with cacheable
                content.
              </p>
            </div>
          </motion.div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 w-fit mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Massive Cost Reduction</h3>
              <p className="text-muted-foreground text-sm">
                Anthropic and Google offer 90% savings on cached tokens. OpenAI offers 50% savings.
                For a 10M token/month workload, that's $1,400+ in monthly savings.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-500/20">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 w-fit mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Zero Configuration</h3>
              <p className="text-muted-foreground text-sm">
                Simple API with intelligent defaults. One function call to enable caching across all
                providers. No complex setup or configuration required.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-500/20">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 w-fit mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Automatic Cache Management</h3>
              <p className="text-muted-foreground text-sm">
                Intelligent breakpoint detection for Anthropic, automatic caching for OpenAI, and flexible
                modes for Google. Works transparently with your existing code.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Quick Start */}
      <Section id="quick-start" title="Quick Start">
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Get started with provider caching in 30 seconds with our zero-config API:
          </p>

          <CodeBlock
            language="bash"
            code={`# Install the package
pnpm add @clarity-chat/token-optimization

# Or with npm
npm install @clarity-chat/token-optimization`}
            filename="terminal"
          />

          <CodeBlock
            language="tsx"
            code={`import { quickCache } from '@clarity-chat/token-optimization'

// Simple example - uses Anthropic by default
const result = await quickCache([
  {
    role: 'system',
    content: 'You are a helpful coding assistant with expertise in TypeScript...',
    cacheable: true // Mark static content for caching
  },
  {
    role: 'user',
    content: 'How do I create a React component?'
  }
])

console.log(\`Caching applied: \${result.cached}\`)
console.log(\`Estimated savings: \${(result.estimatedSavings.percentage * 100).toFixed(1)}%\`)
console.log(\`Cost reduction: $\${result.estimatedSavings.costReduction.toFixed(4)}\`)

// Use result.messages in your API call
// Subsequent calls with the same system prompt will be 90% cheaper!`}
            filename="quick-start.ts"
          />

          <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>What Just Happened?</span>
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>
                  The system message was marked with <code>cacheable: true</code>, telling the provider
                  to cache this content
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>
                  First request: Normal cost (provider stores the system message in cache)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>
                  Subsequent requests: 90% cheaper on the cached system message (only pay full price for
                  new user queries)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 shrink-0">✓</span>
                <span>
                  Cache TTL: 5 minutes for Anthropic (can be configured to 1 hour)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Before/After Cost Comparison */}
      <Section id="before-after" title="Before/After Cost Comparison">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Real-world example showing the dramatic cost difference with provider caching:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Before: No Caching</h3>
              </div>

              <CodeBlock
                language="tsx"
                code={`// Without provider caching
const messages = [
  {
    role: 'system',
    content: largeSystemPrompt // 2000 tokens
  },
  {
    role: 'user',
    content: userQuery // 50 tokens
  }
]

// Cost calculation (Claude 3.5 Sonnet)
// Input: 2050 tokens × $3.00 / 1M = $0.00615 per request
// 1000 requests/day = $6.15/day = $184.50/month`}
                filename="without-caching.ts"
              />

              <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-2xl font-bold text-red-600">$184.50/month</div>
                <div className="text-sm text-muted-foreground">Full cost on every request</div>
              </div>
            </div>

            {/* After */}
            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">After: Provider Caching</h3>
              </div>

              <CodeBlock
                language="tsx"
                code={`// With provider caching
import { anthropicCache } from '@clarity-chat/token-optimization'

const result = await anthropicCache([
  {
    role: 'system',
    content: largeSystemPrompt, // 2000 tokens (CACHED)
    cacheable: true
  },
  {
    role: 'user',
    content: userQuery // 50 tokens (not cached)
  }
])

// Cost calculation
// First request: 2050 tokens × $3.00 / 1M = $0.00615
// Cached requests: (2000 × $0.30 + 50 × $3.00) / 1M = $0.00075
// 1000 requests/day ≈ $0.75/day = $22.50/month`}
                filename="with-caching.ts"
              />

              <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <div className="text-2xl font-bold">$22.50/month</div>
                <div className="text-sm opacity-90 flex items-center gap-2 mt-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>87.8% cost reduction • Save $162/month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-foreground text-lg">Annual Savings: $1,944</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              This is just one example. Scale this across your entire organization, multiple bots, or
              high-volume applications, and provider caching can save tens of thousands of dollars per year.
            </p>
          </div>
        </div>
      </Section>

      {/* Three Provider Examples */}
      <Section id="provider-examples" title="Provider Examples">
        <div className="space-y-8">
          <p className="text-muted-foreground">
            Each provider has unique caching features. Use the provider-specific functions for clarity:
          </p>

          {/* Anthropic Example */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span>Anthropic Claude (90% Savings)</span>
            </h3>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-500/20">
                <h4 className="font-semibold text-foreground mb-2">Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 90% cost reduction on cached tokens</li>
                  <li>• Manual cache control with up to 4 breakpoints</li>
                  <li>• Minimum 1,024 tokens per cached block</li>
                  <li>• TTL: 5 minutes (default) or 1 hour (ephemeral)</li>
                  <li>• Best for: Structured prompts with static system instructions</li>
                </ul>
              </div>

              <CodeBlock
                language="tsx"
                code={`import { anthropicCache } from '@clarity-chat/token-optimization'

const messages = [
  {
    role: 'system',
    content: 'You are a coding assistant...', // Static system prompt
    cacheable: true // Anthropic will insert cache_control breakpoint
  },
  {
    role: 'user',
    content: 'How do I use async/await?' // Dynamic user query
  }
]

const result = await anthropicCache(messages)

console.log('Provider:', result.metadata.provider) // 'anthropic'
console.log('Breakpoints:', result.metadata.providerDetails.breakpointCount) // 1
console.log('Cached tokens:', result.metadata.cachedTokens) // ~500 tokens
console.log('Savings:', \`\${(result.estimatedSavings.percentage * 100).toFixed(1)}%\`) // ~90%

// Use result.messages with Anthropic SDK
// Messages now include cache_control metadata automatically`}
                filename="anthropic-example.ts"
              />
            </div>
          </div>

          {/* OpenAI Example */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span>OpenAI GPT (50% Savings)</span>
            </h3>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-500/20">
                <h4 className="font-semibold text-foreground mb-2">Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 50% cost reduction on cached tokens</li>
                  <li>• Automatic caching for prompts ≥1,024 tokens</li>
                  <li>• No explicit cache control needed</li>
                  <li>• TTL: 1 hour automatic retention</li>
                  <li>• Best for: Large context windows and conversation history</li>
                </ul>
              </div>

              <CodeBlock
                language="tsx"
                code={`import { openaiCache } from '@clarity-chat/token-optimization'

const documentContext = loadLargeDocument() // 5000+ tokens

const messages = [
  {
    role: 'system',
    content: \`Answer questions about this document:\\n\\n\${documentContext}\`,
    cacheable: true // OpenAI will automatically cache large content
  },
  {
    role: 'user',
    content: 'What is the main topic?'
  }
]

const result = await openaiCache(messages)

console.log('Provider:', result.metadata.provider) // 'openai'
console.log('Retention:', result.metadata.providerDetails.retention) // 'in_memory'
console.log('Cached tokens:', result.metadata.cachedTokens) // ~5000 tokens
console.log('Savings:', \`\${(result.estimatedSavings.percentage * 100).toFixed(1)}%\`) // ~50%

// OpenAI automatically caches the document context
// Follow-up questions reuse the cached context at 50% cost`}
                filename="openai-example.ts"
              />
            </div>
          </div>

          {/* Google Example */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-teal-600">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span>Google Gemini (90% Savings)</span>
            </h3>

            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border border-green-500/20">
                <h4 className="font-semibold text-foreground mb-2">Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 90% cost reduction on cached tokens</li>
                  <li>• Implicit mode: Automatic caching (like OpenAI)</li>
                  <li>• Explicit mode: Manual cache IDs for fine control</li>
                  <li>• TTL: Custom configuration (default: 3600s)</li>
                  <li>• Best for: Long-running sessions with explicit cache management</li>
                </ul>
              </div>

              <CodeBlock
                language="tsx"
                code={`import { googleCache } from '@clarity-chat/token-optimization'

// Implicit mode (automatic, recommended)
const messages = [
  {
    role: 'system',
    content: 'You are a helpful assistant...', // Automatically cached
    cacheable: true
  },
  {
    role: 'user',
    content: 'Tell me about TypeScript'
  }
]

const result = await googleCache(messages)

console.log('Provider:', result.metadata.provider) // 'google'
console.log('Mode:', result.metadata.providerDetails.mode) // 'implicit'
console.log('Cached tokens:', result.metadata.cachedTokens)
console.log('Savings:', \`\${(result.estimatedSavings.percentage * 100).toFixed(1)}%\`) // ~90%

// For explicit mode with cache IDs:
import { createProviderCache } from '@clarity-chat/token-optimization'

const explicitCache = createProviderCache({
  provider: 'google',
  google: {
    mode: 'explicit',
    cacheId: 'my-session-123',
    defaultTTL: '7200s' // 2 hours
  }
})

const explicitResult = await explicitCache(messages)
// Cache persists across sessions with the same cacheId`}
                filename="google-example.ts"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* API Reference */}
      <Section id="api-reference" title="API Reference">
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">formatMessagesForProviderCaching</h3>
            <p className="text-muted-foreground mb-4">
              Core function that applies provider-specific caching metadata to messages.
            </p>

            <CodeBlock
              language="tsx"
              code={`import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

async function formatMessagesForProviderCaching(
  messages: CacheableMessage[],
  config?: Partial<ProviderCachingConfig>,
  tokenCounter?: TokenCounter
): Promise<ProviderCachingResult>

// Return value
interface ProviderCachingResult {
  messages: any[]           // Formatted messages with provider metadata
  cached: boolean           // Whether caching was applied
  metadata: {
    provider: string        // Provider used ('anthropic' | 'openai' | 'google')
    cachedTokens: number    // Number of tokens eligible for caching
    providerDetails: any    // Provider-specific metadata
  }
  estimatedSavings: {
    tokens: number          // Tokens that will be cached
    percentage: number      // Savings percentage (0.5 for 50%, 0.9 for 90%)
    costReduction: number   // Estimated dollar savings per request
  }
  recommendations: string[] // Optimization suggestions
}`}
              filename="api-signature.ts"
            />

            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-4">Parameters</h4>
              <PropsTable props={formatMessagesProps} />
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-4">Configuration Options</h4>
              <PropsTable props={providerConfigProps} />
            </div>
          </div>

          {/* Simple API Functions */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Simple API (Recommended)</h3>
            <p className="text-muted-foreground mb-4">
              High-level convenience functions for common use cases:
            </p>

            <CodeBlock
              language="tsx"
              code={`// Zero-config quick caching
import { quickCache, anthropicCache, openaiCache, googleCache } from '@clarity-chat/token-optimization'

// Default provider (Anthropic)
const result1 = await quickCache(messages)

// Provider-specific functions
const result2 = await anthropicCache(messages)  // Anthropic (90% savings)
const result3 = await openaiCache(messages)     // OpenAI (50% savings)
const result4 = await googleCache(messages)     // Google (90% savings)

// Create reusable cache function
import { createProviderCache } from '@clarity-chat/token-optimization'

const cache = createProviderCache({
  provider: 'anthropic',
  minTokens: 2048,           // Higher threshold
  autoSelectProvider: false  // Manual provider selection
})

const result5 = await cache(messages)

// Estimate savings before applying
import { estimateCacheSavings } from '@clarity-chat/token-optimization'

const estimate = await estimateCacheSavings(messages, 'anthropic')
console.log('Eligible:', estimate.eligible)
console.log('Tokens:', estimate.estimatedTokens)
console.log('Savings:', \`\${estimate.estimatedSavingsPercent}%\`)
console.log('Recommendation:', estimate.recommendation)`}
              filename="simple-api.ts"
            />
          </div>
        </div>
      </Section>

      {/* Monthly Savings Calculator */}
      <Section id="cost-calculator" title="Monthly Savings Calculator">
        <MonthlySavingsCalculator />
      </Section>

      {/* Cache Requirements Table */}
      <Section id="cache-requirements" title="Cache Requirements & TTL">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Each provider has specific requirements and cache time-to-live (TTL) configurations:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Provider</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Model</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Input Cost</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Cached Cost</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Savings</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Min Tokens</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Default TTL</th>
                  <th className="text-left p-4 text-sm font-semibold text-foreground">Max Breakpoints</th>
                </tr>
              </thead>
              <tbody>
                {providerComparisonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 text-sm font-medium text-foreground">{row.provider}</td>
                    <td className="p-4 text-sm text-muted-foreground">{row.model}</td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{row.inputCost}</td>
                    <td className="p-4 text-sm text-green-600 dark:text-green-400 font-mono font-semibold">
                      {row.cachedCost}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          row.savings === '90%'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {row.savings}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">{row.minTokens}</td>
                    <td className="p-4 text-sm text-muted-foreground">{row.ttl}</td>
                    <td className="p-4 text-sm text-muted-foreground">{row.maxBreakpoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>Minimum Token Requirements</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                All providers require at least 1,024 tokens for caching to be effective. Content below
                this threshold won't be cached.
              </p>
              <CodeBlock
                language="tsx"
                code={`// Check if content is cacheable
import { estimateCacheSavings } from '@clarity-chat/token-optimization'

const estimate = await estimateCacheSavings(messages)

if (!estimate.eligible) {
  console.log(estimate.recommendation)
  // "Need at least 1024 tokens for caching. Current: 842 tokens."
}`}
                filename="check-eligibility.ts"
              />
            </div>

            <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span>Cache TTL (Time-to-Live)</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Cached content expires after the TTL period. Configure TTL based on your use case:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0">•</span>
                  <span>
                    <strong className="text-foreground">Anthropic:</strong> 5 min (default) or 1 hour
                    (ephemeral mode)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0">•</span>
                  <span>
                    <strong className="text-foreground">OpenAI:</strong> 1 hour automatic (no config)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 shrink-0">•</span>
                  <span>
                    <strong className="text-foreground">Google:</strong> Custom (3600s default, configurable)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Troubleshooting */}
      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Issue 1 */}
            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-foreground">Cache Not Applied</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Symptom:</strong> <code>result.cached</code> returns <code>false</code>
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Causes:</strong>
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                <li>• Content below 1,024 token minimum</li>
                <li>• No messages marked with <code>cacheable: true</code></li>
                <li>• Provider caching disabled in config</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Solution:</strong> Use <code>estimateCacheSavings()</code> to check eligibility
                and review recommendations.
              </p>
            </div>

            {/* Issue 2 */}
            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-foreground">Lower Savings Than Expected</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Symptom:</strong> Savings percentage lower than 50-90%
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Causes:</strong>
              </p>
              <ul className="space-y-1 text-sm text-muted-foreground mb-3">
                <li>• Small proportion of cacheable content</li>
                <li>• Cache misses due to content variation</li>
                <li>• Cache expired (TTL exceeded)</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                <strong>Solution:</strong> Mark more static content as cacheable, increase TTL, or ensure
                content consistency.
              </p>
            </div>

            {/* Issue 3 */}
            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-foreground">Anthropic Breakpoint Limit</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Symptom:</strong> Warning about exceeding max breakpoints
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Cause:</strong> Anthropic supports max 4 cache breakpoints per request
              </p>
              <CodeBlock
                language="tsx"
                code={`// Solution: Reduce breakpoints or use auto-detection
const formatter = new ProviderCachingFormatter({
  provider: 'anthropic',
  anthropic: {
    maxBreakpoints: 4,
    autoDetectBreakpoints: true // Let library choose optimal breakpoints
  }
})`}
                filename="fix-breakpoints.ts"
              />
            </div>

            {/* Issue 4 */}
            <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="font-semibold text-foreground">Google Explicit Mode Cache ID Errors</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Symptom:</strong> Cache ID not found or expired
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Cause:</strong> Cache ID doesn't exist or TTL expired
              </p>
              <CodeBlock
                language="tsx"
                code={`// Solution: Use implicit mode or manage cache lifecycle
const cache = createProviderCache({
  provider: 'google',
  google: {
    mode: 'implicit', // Automatic cache management
    autoCreateCache: true
  }
})`}
                filename="fix-google-cache.ts"
              />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span>Debugging Tips</span>
            </h4>
            <CodeBlock
              language="tsx"
              code={`import { quickCache, estimateCacheSavings } from '@clarity-chat/token-optimization'

// Step 1: Check eligibility
const estimate = await estimateCacheSavings(messages, 'anthropic')
console.log('Eligible:', estimate.eligible)
console.log('Recommendation:', estimate.recommendation)

// Step 2: Apply caching and inspect result
const result = await quickCache(messages, 'anthropic')
console.log('Cached:', result.cached)
console.log('Metadata:', result.metadata)
console.log('Savings:', result.estimatedSavings)
console.log('Recommendations:', result.recommendations)

// Step 3: Check formatted messages
console.log('Formatted messages:', JSON.stringify(result.messages, null, 2))
// Look for provider-specific metadata (cache_control, etc.)`}
              filename="debug-caching.ts"
            />
          </div>
        </div>
      </Section>

      {/* Best Practices */}
      <Section id="best-practices" title="Best Practices">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-foreground">1. Mark Static Content</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Explicitly mark static content with <code>cacheable: true</code> to maximize cache hit rates:
              </p>
              <CodeBlock
                language="tsx"
                code={`const messages = [
  {
    role: 'system',
    content: largeSystemPrompt,
    cacheable: true // Static, should be cached
  },
  {
    role: 'user',
    content: dynamicUserQuery,
    cacheable: false // Dynamic, don't cache
  }
]`}
                filename="mark-static.ts"
              />
            </div>

            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-foreground">2. Ensure Minimum Tokens</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                All providers require ≥1,024 tokens for caching. Make system prompts substantial:
              </p>
              <CodeBlock
                language="tsx"
                code={`// ❌ Too small (won't be cached)
const systemPrompt = 'You are a helpful assistant.'

// ✅ Large enough for caching
const systemPrompt = \`
You are an expert TypeScript developer assistant.
[... detailed instructions ...]
\`.repeat(10) // Make it substantial (1000+ tokens)`}
                filename="ensure-minimum.ts"
              />
            </div>

            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-foreground">3. Reuse Cache Functions</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create cache functions once and reuse them for better performance:
              </p>
              <CodeBlock
                language="tsx"
                code={`// Create once at module level
const cache = createProviderCache({
  provider: 'anthropic',
  minTokens: 1024
})

// Reuse in multiple functions
async function handleQuery1() {
  return cache(messages1)
}

async function handleQuery2() {
  return cache(messages2)
}`}
                filename="reuse-cache.ts"
              />
            </div>

            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-foreground">4. Monitor Cache Hit Rates</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Track cache performance to optimize your implementation:
              </p>
              <CodeBlock
                language="tsx"
                code={`const result = await cache(messages)

// Log cache metrics
console.log({
  cached: result.cached,
  cachedTokens: result.metadata.cachedTokens,
  savingsPercent: result.estimatedSavings.percentage * 100,
  costReduction: result.estimatedSavings.costReduction
})

// Track over time to identify optimization opportunities`}
                filename="monitor-hits.ts"
              />
            </div>

            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-foreground">5. Choose Right Provider</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select provider based on your use case:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">•</span>
                  <span>
                    <strong className="text-foreground">Anthropic:</strong> Best for structured prompts
                    with clear static sections (90% savings)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">•</span>
                  <span>
                    <strong className="text-foreground">OpenAI:</strong> Best for large context windows
                    and conversation history (50% savings)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">•</span>
                  <span>
                    <strong className="text-foreground">Google:</strong> Best for long-running sessions
                    with explicit cache management (90% savings)
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-foreground">6. Configure Appropriate TTL</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Balance cache freshness with cost savings:
              </p>
              <CodeBlock
                language="tsx"
                code={`// Short TTL for rapidly changing content
const shortCache = createProviderCache({
  provider: 'anthropic',
  anthropic: { defaultTTL: '5m' }
})

// Long TTL for stable content
const longCache = createProviderCache({
  provider: 'anthropic',
  anthropic: { defaultTTL: '1h' } // Ephemeral mode
})`}
                filename="configure-ttl.ts"
              />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-foreground text-lg">Production Checklist</h4>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Static content marked with <code>cacheable: true</code></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>System prompts are ≥1,024 tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Cache hit rates monitored and logged</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>TTL configured based on content update frequency</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Provider selected based on use case requirements</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Error handling implemented for cache failures</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Cost savings tracked and reported</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
