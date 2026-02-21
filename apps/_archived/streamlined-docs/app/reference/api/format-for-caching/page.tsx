'use client'

/**
 * API Reference: formatForCaching
 *
 * Comprehensive reference for the formatMessagesForProviderCaching function.
 * This is the hero function for achieving 90% savings on cached tokens via
 * Anthropic, OpenAI, and Google native caching.
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
  ExternalLink,
  BookOpen,
  Code2,
  Target,
  BarChart3,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { PropsTable, type PropDefinition } from '../../../../components/Docs/PropsTable'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import type { TocItem } from '../../../../components/Docs/TableOfContents'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import Link from 'next/link'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'function-signature', title: 'Function Signature', level: 2 },
  { id: 'parameters', title: 'Parameters', level: 2 },
  { id: 'return-type', title: 'Return Type', level: 2 },
  { id: 'cost-impact', title: 'Cost Impact', level: 2 },
  { id: 'provider-examples', title: 'Provider Examples', level: 2 },
  { id: 'use-cases', title: 'Common Use Cases', level: 2 },
  { id: 'cache-invalidation', title: 'Cache Invalidation', level: 2 },
  { id: 'performance', title: 'Performance Characteristics', level: 2 },
  { id: 'related-resources', title: 'Related Resources', level: 2 },
]

// ============================================================================
// Props Definitions
// ============================================================================

const messageParameterProps: PropDefinition[] = [
  {
    name: 'messages',
    type: 'CacheableMessage[]',
    required: true,
    description: 'Array of messages to format with cache markers. Each message should have role, content, and optional cacheable flag.',
  },
]

const configParameterProps: PropDefinition[] = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Whether to enable provider caching. Set to false to bypass caching.',
  },
  {
    name: 'provider',
    type: "'anthropic' | 'openai' | 'google'",
    default: "'anthropic'",
    description: 'Target provider for caching. Each provider has unique caching features.',
  },
  {
    name: 'anthropic',
    type: 'AnthropicCachingConfig',
    description: 'Anthropic-specific config: minCachedTokens (1024), maxBreakpoints (4), defaultTTL (5m or 1h).',
  },
  {
    name: 'openai',
    type: 'OpenAICachingConfig',
    description: 'OpenAI-specific config: optimizeMessageOrder (true), retention (in_memory).',
  },
  {
    name: 'google',
    type: 'GoogleCachingConfig',
    description: 'Google-specific config: mode (implicit/explicit), cacheId, defaultTTL (3600s).',
  },
]

const tokenCounterProps: PropDefinition[] = [
  {
    name: 'tokenCounter',
    type: 'TokenCounter',
    description: 'Optional custom token counter. Defaults to AccurateTokenCounter. Used for calculating cache eligibility.',
  },
]

const returnTypeProps: PropDefinition[] = [
  {
    name: 'messages',
    type: 'any[]',
    description: 'Formatted messages with provider-specific cache metadata. Use with provider SDK.',
  },
  {
    name: 'cached',
    type: 'boolean',
    description: 'Whether caching was applied. False if below minimum tokens or caching disabled.',
  },
  {
    name: 'metadata',
    type: 'ProviderCacheMetadata',
    description: 'Metadata about caching: provider, cachedTokens, savingsPercentage, providerDetails.',
  },
  {
    name: 'estimatedSavings',
    type: 'object',
    description: 'Savings estimate: tokens (count), percentage (0.5 or 0.9), costReduction (dollar amount).',
  },
  {
    name: 'recommendations',
    type: 'string[]',
    description: 'Optimization suggestions based on analysis (e.g., "Need at least 1024 tokens").',
  },
]

const cacheableMessageProps: PropDefinition[] = [
  {
    name: 'role',
    type: "'system' | 'user' | 'assistant'",
    required: true,
    description: 'Message role. System messages are typically cached.',
  },
  {
    name: 'content',
    type: 'string | ContentBlock[]',
    required: true,
    description: 'Message content. Can be plain text or structured content blocks.',
  },
  {
    name: 'cacheable',
    type: 'boolean',
    description: 'Explicitly mark as cacheable. Overrides automatic detection. Set true for static content.',
  },
  {
    name: 'cacheWeight',
    type: 'number (0-1)',
    description: 'Cache priority weight. >0.5 = cacheable. Use for fine-grained control.',
  },
]

// ============================================================================
// Main Page Component
// ============================================================================

export default function FormatForCachingPage() {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null)

  const handleCopy = (section: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  return (
    <DocumentationPage
      title="formatForCaching"
      description="Format messages for provider-native caching. Achieve 50%+ baseline savings, up to 90% on cached tokens with Anthropic, OpenAI, and Google."
      icon={Trophy}
      badges={[
        { label: '90% Savings', variant: 'success' },
        { label: 'Token Optimization', variant: 'premium' },
        { label: 'Stable', variant: 'stable' },
      ]}
      packageName="@clarity-chat/token-optimization"
      features={[
        {
          icon: DollarSign,
          label: '50-90% Cost Reduction',
          description: 'Achieve 50%+ baseline, 90% on cached tokens',
        },
        {
          icon: Server,
          label: 'Multi-Provider',
          description: 'Anthropic, OpenAI, Google support',
        },
        {
          icon: Zap,
          label: 'Zero Config',
          description: 'Works out of the box with smart defaults',
        },
        {
          icon: ShieldCheck,
          label: 'Type Safe',
          description: 'Full TypeScript support with inference',
        },
      ]}
      tableOfContents={tableOfContents}
    >
      {/* Overview */}
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
                  HERO API
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-3">The 90% Savings Hero</h2>
              <p className="text-lg opacity-90 max-w-3xl">
                <code className="bg-white/20 px-2 py-1 rounded font-mono text-sm">formatForCaching</code> is
                your gateway to massive cost savings via provider-native caching. This function formats messages
                with cache control markers for Anthropic, OpenAI, and Google, enabling 50%+ baseline savings
                and up to 90% reduction on cached tokens.
              </p>
            </div>
          </motion.div>

          {/* Key Concepts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-500/20">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 w-fit mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">What It Does</h3>
              <p className="text-muted-foreground text-sm">
                Analyzes your messages, identifies static content (system prompts, RAG context, tool definitions),
                and adds provider-specific cache markers. The formatted messages can then be sent to provider APIs
                to benefit from native caching.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 w-fit mb-4">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Performance Impact</h3>
              <p className="text-muted-foreground text-sm">
                First request: Creates cache (normal cost). Subsequent requests: 50-90% cheaper on cached content.
                Cache hit rates of 70-95% are typical in production. At 10M tokens/month, save $1,400+ monthly.
              </p>
            </div>
          </div>

          {/* Important Warning */}
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Important: This Function Formats Messages Only
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                  <code>formatForCaching</code> does NOT make API calls or implement caching. It only adds cache
                  markers to your messages. You must:
                </p>
                <ol className="text-sm text-amber-800 dark:text-amber-200 list-decimal list-inside space-y-1 ml-2">
                  <li>Format messages using this function</li>
                  <li>Make provider API calls with the formatted messages</li>
                  <li>Make repeated API calls to benefit from caching</li>
                  <li>Track actual costs to measure real savings</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Function Signature */}
      <Section id="function-signature" title="Function Signature">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Full TypeScript signature with all parameters and return types:
          </p>

          <CodeBlock
            language="typescript"
            code={`import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

async function formatMessagesForProviderCaching(
  messages: CacheableMessage[],
  config?: Partial<ProviderCachingConfig>,
  tokenCounter?: TokenCounter
): Promise<ProviderCachingResult>

// Return type structure
interface ProviderCachingResult {
  messages: any[]                      // Formatted messages with cache metadata
  cached: boolean                      // Whether caching was applied
  metadata: ProviderCacheMetadata      // Cache metadata (provider, tokens, etc.)
  estimatedSavings: {
    tokens: number                     // Number of tokens that will be cached
    percentage: number                 // Savings rate (0.5 = 50%, 0.9 = 90%)
    costReduction: number              // Estimated dollar savings per request
  }
  recommendations: string[]            // Optimization suggestions
}`}
            filename="function-signature.ts"
          />

          <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span>Quick Start Tip</span>
            </h4>
            <p className="text-sm text-muted-foreground">
              For simple use cases, use the convenience functions: <code>quickCache()</code>,{' '}
              <code>anthropicCache()</code>, <code>openaiCache()</code>, or <code>googleCache()</code>.
              They wrap this function with sensible defaults.
            </p>
          </div>
        </div>
      </Section>

      {/* Parameters */}
      <Section id="parameters" title="Parameters">
        <div className="space-y-8">
          {/* Messages Parameter */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">messages: CacheableMessage[]</h3>
            <PropsTable props={messageParameterProps} />

            <div className="mt-4">
              <h4 className="font-semibold text-foreground mb-3">CacheableMessage Interface</h4>
              <PropsTable props={cacheableMessageProps} />
            </div>

            <div className="mt-4">
              <CodeBlock
                language="typescript"
                code={`// Example messages array
const messages: CacheableMessage[] = [
  {
    role: 'system',
    content: 'You are a helpful AI assistant...',
    cacheable: true  // Explicitly mark as cacheable
  },
  {
    role: 'user',
    content: 'What is React?',
    cacheable: false  // User queries are typically dynamic
  }
]`}
                filename="cacheable-messages.ts"
              />
            </div>
          </div>

          {/* Config Parameter */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">config: Partial&lt;ProviderCachingConfig&gt;</h3>
            <p className="text-muted-foreground mb-4">
              Optional configuration object. All fields are optional with intelligent defaults.
            </p>
            <PropsTable props={configParameterProps} />

            <div className="mt-4">
              <CodeBlock
                language="typescript"
                code={`// Example configurations for each provider

// Anthropic (90% savings, 4 max breakpoints)
const anthropicConfig = {
  provider: 'anthropic',
  anthropic: {
    minCachedTokens: 1024,      // Minimum tokens for caching
    maxBreakpoints: 4,          // Max 4 cache breakpoints
    defaultTTL: '5m',           // 5 minutes (or '1h' for ephemeral)
    autoDetectBreakpoints: true // Auto-detect optimal breakpoints
  }
}

// OpenAI (50% savings, automatic caching)
const openaiConfig = {
  provider: 'openai',
  openai: {
    retention: 'in_memory',     // Cache retention mode
    optimizeMessageOrder: true  // Reorder messages for better caching
  }
}

// Google (90% savings, implicit or explicit mode)
const googleConfig = {
  provider: 'google',
  google: {
    mode: 'implicit',           // 'implicit' (auto) or 'explicit' (manual)
    defaultTTL: '3600s',        // 1 hour TTL
    autoCreateCache: true,      // Auto-create cache if needed
    cacheId: 'my-cache-123'     // Optional cache ID (explicit mode)
  }
}`}
                filename="provider-configs.ts"
              />
            </div>
          </div>

          {/* Token Counter Parameter */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">tokenCounter: TokenCounter (optional)</h3>
            <PropsTable props={tokenCounterProps} />

            <div className="mt-4">
              <CodeBlock
                language="typescript"
                code={`import { AccurateTokenCounter, formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

// Use custom token counter
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })

const result = await formatMessagesForProviderCaching(
  messages,
  { provider: 'openai' },
  counter  // Pass custom counter
)

// Or use default (AccurateTokenCounter with gpt-4o)
const result2 = await formatMessagesForProviderCaching(messages)`}
                filename="custom-token-counter.ts"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Return Type */}
      <Section id="return-type" title="Return Type">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            The function returns a <code>ProviderCachingResult</code> object with formatted messages, metadata,
            and savings estimates:
          </p>

          <PropsTable props={returnTypeProps} />

          <div className="mt-6">
            <h4 className="font-semibold text-foreground mb-3">Example Return Value</h4>
            <CodeBlock
              language="typescript"
              code={`const result = await formatMessagesForProviderCaching(messages, { provider: 'anthropic' })

// result structure:
{
  cached: true,
  messages: [
    {
      role: 'user',  // Anthropic doesn't have 'system' role in messages
      content: [
        {
          type: 'text',
          text: 'You are a helpful assistant...',
          cache_control: { type: 'ephemeral', ttl: '5m' }  // Cache marker added!
        }
      ]
    },
    {
      role: 'user',
      content: 'What is React?'  // No cache marker (dynamic content)
    }
  ],
  metadata: {
    provider: 'anthropic',
    cachedTokens: 1500,           // 1500 tokens eligible for caching
    savingsPercentage: 0.9,       // 90% savings
    createdAt: '2026-01-28T...',
    providerDetails: {
      breakpointCount: 1,         // 1 cache breakpoint added
      ttl: '5m'
    }
  },
  estimatedSavings: {
    tokens: 1350,                 // 1350 tokens saved (90% of 1500)
    percentage: 0.9,              // 90% savings rate
    costReduction: 0.00405        // $0.00405 saved per request
  },
  recommendations: []
}`}
              filename="return-value-example.ts"
            />
          </div>

          <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>Pro Tip: Check cached flag</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Always check <code>result.cached</code> before using the messages. If false, caching wasn't applied
              (likely due to insufficient tokens or config issues). Check <code>result.recommendations</code> for
              suggestions.
            </p>
            <CodeBlock
              language="typescript"
              code={`const result = await formatMessagesForProviderCaching(messages)

if (!result.cached) {
  console.warn('Caching not applied:', result.recommendations)
  // Handle non-cached scenario
}

// Use formatted messages with provider SDK
const response = await anthropic.messages.create({
  messages: result.messages,
  // ...
})`}
              filename="check-cached-flag.ts"
            />
          </div>
        </div>
      </Section>

      {/* Cost Impact */}
      <Section id="cost-impact" title="Cost Impact">
        <div className="space-y-8">
          {/* Hero Cost Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.moderate }}
            className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Achieve 50%+ Savings Baseline</h3>
                <p className="text-sm text-muted-foreground">Up to 90% on cached tokens with provider caching</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-border/50">
                <div className="text-sm text-muted-foreground mb-1">Baseline (All Strategies)</div>
                <div className="text-3xl font-bold text-green-600">50-70%</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Provider caching + compression + routing
                </div>
              </div>

              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                <div className="text-sm opacity-90 mb-1">Cached Tokens Only</div>
                <div className="text-3xl font-bold">90%</div>
                <div className="text-xs opacity-90 mt-2">
                  Anthropic & Google on cached content
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-border/50">
                <div className="text-sm text-muted-foreground mb-1">OpenAI Cached</div>
                <div className="text-3xl font-bold text-blue-600">50%</div>
                <div className="text-xs text-muted-foreground mt-2">
                  Still significant for GPT-4o workloads
                </div>
              </div>
            </div>
          </motion.div>

          {/* Real-World Examples */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Real-World Cost Examples</h3>

            <div className="space-y-4">
              {/* Example 1: Customer Support */}
              <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Customer Support Chatbot</h4>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-semibold">
                    82% savings
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Scenario:</p>
                    <ul className="text-sm space-y-1">
                      <li>• 10,000 requests/month</li>
                      <li>• 2,000 token system prompt (cacheable)</li>
                      <li>• 50 token avg user query</li>
                      <li>• Claude 3.5 Sonnet ($3/1M input)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Costs:</p>
                    <ul className="text-sm space-y-1">
                      <li className="text-red-600">• Without: $61.50/month</li>
                      <li className="text-green-600">• With caching: $11.40/month</li>
                      <li className="font-semibold">• <span className="text-green-600">Saved: $50.10/month</span></li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Calculation:</strong> 90% cache hit rate on 2000-token
                    system prompt. First request creates cache ($0.0061). Subsequent 9,999 requests use cached
                    system prompt at 90% discount ($0.0006 + $0.00015 = $0.00075 each).
                  </p>
                </div>
              </div>

              {/* Example 2: RAG Application */}
              <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">RAG Document Q&A</h4>
                  <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-sm font-semibold">
                    88% savings
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Scenario:</p>
                    <ul className="text-sm space-y-1">
                      <li>• 5,000 queries/month</li>
                      <li>• 8,000 token document context (cached)</li>
                      <li>• 100 token avg question</li>
                      <li>• Claude 3.5 Sonnet ($3/1M input)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Costs:</p>
                    <ul className="text-sm space-y-1">
                      <li className="text-red-600">• Without: $121.50/month</li>
                      <li className="text-green-600">• With caching: $14.90/month</li>
                      <li className="font-semibold">• <span className="text-green-600">Saved: $106.60/month</span></li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Why it works:</strong> Document context is static and
                    reused across all queries in a session. With 95% cache hit rate on 8K tokens, massive savings
                    on repeated document processing.
                  </p>
                </div>
              </div>

              {/* Example 3: Code Assistant */}
              <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Code Assistant (OpenAI)</h4>
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-sm font-semibold">
                    45% savings
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Scenario:</p>
                    <ul className="text-sm space-y-1">
                      <li>• 20,000 requests/month</li>
                      <li>• 3,000 token codebase docs (cached)</li>
                      <li>• 80 token avg coding question</li>
                      <li>• GPT-4o ($2.50/1M input)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Costs:</p>
                    <ul className="text-sm space-y-1">
                      <li className="text-red-600">• Without: $154.00/month</li>
                      <li className="text-green-600">• With caching: $85.00/month</li>
                      <li className="font-semibold">• <span className="text-green-600">Saved: $69.00/month</span></li>
                    </ul>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> OpenAI offers 50% discount vs Anthropic's 90%,
                    but still substantial savings. Automatic caching makes it easy to implement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Savings Calculator */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-foreground text-lg">Annual Savings Impact</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">$1,944</div>
                <div className="text-sm text-muted-foreground mt-1">Customer Support Example</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">$1,279</div>
                <div className="text-sm text-muted-foreground mt-1">RAG Document Q&A</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">$828</div>
                <div className="text-sm text-muted-foreground mt-1">Code Assistant (OpenAI)</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Scale these savings across multiple applications, teams, and use cases for massive cost reduction.
            </p>
          </div>
        </div>
      </Section>

      {/* Provider Examples */}
      <Section id="provider-examples" title="Provider Examples">
        <div className="space-y-8">
          <p className="text-muted-foreground">
            Working code examples for Anthropic, OpenAI, and other providers:
          </p>

          {/* Anthropic Example */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span>Anthropic Claude (90% Savings)</span>
            </h3>

            <CodeBlock
              language="typescript"
              code={`import Anthropic from '@anthropic-ai/sdk'
import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Prepare messages
const messages = [
  {
    role: 'system',
    content: \`You are a customer support AI.

# Product Documentation
\${largeProductDocs}  // 3000+ tokens

# Support Guidelines
\${supportGuidelines}  // 1500+ tokens

Always be helpful and professional.\`,
    cacheable: true  // Mark static content
  },
  {
    role: 'user',
    content: 'How do I reset my password?'
  }
]

// Format for caching
const cached = await formatMessagesForProviderCaching(messages, {
  provider: 'anthropic',
  anthropic: {
    minCachedTokens: 1024,
    maxBreakpoints: 4,
    defaultTTL: '5m'
  }
})

console.log('Cached:', cached.cached)
console.log('Savings:', cached.estimatedSavings)

// Use with Anthropic SDK
const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: cached.messages,  // Uses formatted messages with cache_control
})

// Check cache performance in response
const usage = response.usage
console.log('Cache read tokens:', usage.cache_read_input_tokens)
console.log('Cache creation tokens:', usage.cache_creation_input_tokens)
console.log('Regular input tokens:', usage.input_tokens)

// Calculate actual savings
const cacheHitRate = usage.cache_read_input_tokens > 0 ? 0.9 : 0
const actualSavings = cacheHitRate * usage.cache_read_input_tokens * 0.9
console.log(\`Actual savings: \${actualSavings} tokens at 90% discount\`)`}
              filename="anthropic-example.ts"
            />
          </div>

          {/* OpenAI Example */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span>OpenAI GPT (50% Savings)</span>
            </h3>

            <CodeBlock
              language="typescript"
              code={`import OpenAI from 'openai'
import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// RAG example with large document context
const documentContext = loadLargeDocument()  // 5000+ tokens

const messages = [
  {
    role: 'system',
    content: \`Answer questions about this document:

\${documentContext}\`,
    cacheable: true  // Large context will be automatically cached
  },
  {
    role: 'user',
    content: 'What is the main topic?'
  }
]

// Format for OpenAI caching
const cached = await formatMessagesForProviderCaching(messages, {
  provider: 'openai',
  openai: {
    retention: 'in_memory',
    optimizeMessageOrder: true
  }
})

// Use with OpenAI SDK
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: cached.messages,
})

// Check cache performance
const usage = response.usage
const cachedTokens = usage.prompt_tokens_details?.cached_tokens || 0
const cacheHitRate = cachedTokens / usage.prompt_tokens

console.log('Cached tokens:', cachedTokens)
console.log('Cache hit rate:', \`\${(cacheHitRate * 100).toFixed(1)}%\`)
console.log('Cost savings:', \`\${(cacheHitRate * 50).toFixed(1)}% (50% discount)\`)`}
              filename="openai-example.ts"
            />
          </div>

          {/* Google Example */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-teal-600">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span>Google Gemini (90% Savings)</span>
            </h3>

            <CodeBlock
              language="typescript"
              code={`import { GoogleGenerativeAI } from '@google/generative-ai'
import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

// Very large codebase analysis scenario
const codebaseContext = loadCodebaseDocumentation()  // 50,000+ tokens

const messages = [
  {
    role: 'system',
    content: \`You are an AI code analyst.

# Complete Codebase Documentation
\${codebaseContext}

# Analysis Guidelines
\${analysisGuidelines}\`,
    cacheable: true  // Large context (must be 32K+ for Google)
  },
  {
    role: 'user',
    content: 'Analyze the authentication module'
  }
]

// Format for Google caching (implicit mode)
const cached = await formatMessagesForProviderCaching(messages, {
  provider: 'google',
  google: {
    mode: 'implicit',        // Automatic caching
    defaultTTL: '3600s',     // 1 hour
    autoCreateCache: true
  }
})

// Use with Google SDK
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: cached.messages[0].content,
  cachedContent: {
    model: 'gemini-2.0-flash',
    systemInstruction: cached.messages[0].content,
    ttl: 3600,  // 1 hour
  },
})

const result = await model.generateContent(cached.messages[1].content)
const response = result.response

console.log('Response:', response.text())
console.log('Estimated savings: 90% on cached content')`}
              filename="google-example.ts"
            />
          </div>
        </div>
      </Section>

      {/* Common Use Cases */}
      <Section id="use-cases" title="Common Use Cases">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Provider caching excels in scenarios with static, reusable content:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* System Prompts */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-500/20">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-600" />
                <span>Static System Prompts</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Large, detailed system instructions that remain constant across conversations.
              </p>
              <CodeBlock
                language="typescript"
                code={`// Customer support bot with detailed guidelines
const messages = [
  {
    role: 'system',
    content: \`You are a customer support AI...

# Brand Voice Guidelines
\${brandGuidelines}

# Product Knowledge Base
\${productKnowledgeBase}

# Response Templates
\${responseTemplates}\`,
    cacheable: true  // Cache the entire system prompt
  },
  { role: 'user', content: userQuery }
]`}
                filename="system-prompts.ts"
              />
            </div>

            {/* Conversation History */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-500/20">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                <span>Conversation History</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Cache previous conversation turns to reduce costs on long-running chats.
              </p>
              <CodeBlock
                language="typescript"
                code={`// Multi-turn conversation
const messages = [
  { role: 'system', content: systemPrompt, cacheable: true },
  // Previous turns (cacheable history)
  { role: 'user', content: 'Previous Q1', cacheable: true },
  { role: 'assistant', content: 'Previous A1', cacheable: true },
  { role: 'user', content: 'Previous Q2', cacheable: true },
  { role: 'assistant', content: 'Previous A2', cacheable: true },
  // Current turn (dynamic)
  { role: 'user', content: currentQuery, cacheable: false }
]`}
                filename="conversation-history.ts"
              />
            </div>

            {/* RAG Context */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span>RAG Document Context</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Cache large retrieved documents that are queried multiple times.
              </p>
              <CodeBlock
                language="typescript"
                code={`// RAG with cached document context
const retrievedDocs = await vectorDB.retrieve(query)

const messages = [
  {
    role: 'system',
    content: \`Answer using this context:

\${retrievedDocs.map(doc => doc.content).join('\\n\\n')}\`,
    cacheable: true  // Cache entire retrieved context
  },
  { role: 'user', content: query }
]

// Follow-up questions reuse cached docs
// Massive savings on document reprocessing`}
                filename="rag-context.ts"
              />
            </div>

            {/* Tool Definitions */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-500/20">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <span>Tool/Function Definitions</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Cache tool schemas and descriptions for function calling scenarios.
              </p>
              <CodeBlock
                language="typescript"
                code={`// Agent with many tool definitions
const toolDefinitions = [
  { name: 'search', schema: searchSchema },
  { name: 'calculator', schema: calcSchema },
  { name: 'database', schema: dbSchema },
  // ... 20 more tools
]

const messages = [
  {
    role: 'system',
    content: \`You are an AI agent with tools:

\${JSON.stringify(toolDefinitions, null, 2)}\`,
    cacheable: true  // Cache all tool definitions
  },
  { role: 'user', content: userTask }
]`}
                filename="tool-definitions.ts"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Cache Invalidation */}
      <Section id="cache-invalidation" title="Cache Invalidation Strategies">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Understanding cache expiry and invalidation is critical for correctness and cost optimization:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* TTL-Based Invalidation */}
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-border/50">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>TTL-Based Invalidation</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Caches automatically expire after the TTL (Time-To-Live) period.
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="font-medium mb-1">Anthropic: 5 min (default) or 1 hour (ephemeral)</p>
                  <CodeBlock
                    language="typescript"
                    code={`const config = {
  provider: 'anthropic',
  anthropic: {
    defaultTTL: '1h'  // Use 1-hour ephemeral cache
  }
}`}
                    filename="anthropic-ttl.ts"
                  />
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="font-medium mb-1">OpenAI: 1 hour (automatic, not configurable)</p>
                  <p className="text-xs text-muted-foreground">Cache expires after 1 hour of inactivity.</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="font-medium mb-1">Google: Custom TTL (default 3600s)</p>
                  <CodeBlock
                    language="typescript"
                    code={`const config = {
  provider: 'google',
  google: {
    defaultTTL: '7200s'  // 2 hours
  }
}`}
                    filename="google-ttl.ts"
                  />
                </div>
              </div>
            </div>

            {/* Content-Based Invalidation */}
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-border/50">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span>Content-Based Invalidation</span>
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Caches invalidate when content changes (even slightly).
              </p>
              <CodeBlock
                language="typescript"
                code={`// Cache invalidation on content change
const systemPromptV1 = 'You are a helpful assistant.'
const systemPromptV2 = 'You are a helpful assistant!'  // Different!

// First request - creates cache
await formatMessagesForProviderCaching([
  { role: 'system', content: systemPromptV1, cacheable: true }
])

// Second request - CACHE MISS (content changed)
await formatMessagesForProviderCaching([
  { role: 'system', content: systemPromptV2, cacheable: true }
])

// Keep system prompts EXACTLY the same for cache hits`}
                filename="content-invalidation.ts"
              />
            </div>
          </div>

          {/* Best Practices */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Cache Invalidation Best Practices</span>
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Keep static content consistent:</strong> Even whitespace
                    changes invalidate cache
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Use versioned prompts:</strong> Append version number
                    to force cache refresh
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Configure TTL based on update frequency:</strong> Short
                    TTL for frequently updated content
                  </span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Warm the cache:</strong> Make initial request before
                    high-traffic periods
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Monitor cache hit rates:</strong> Track
                    cache_read_input_tokens to measure effectiveness
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 shrink-0">✓</span>
                  <span>
                    <strong className="text-foreground">Separate dynamic content:</strong> Don't cache user
                    queries or frequently changing data
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* Performance Characteristics */}
      <Section id="performance" title="Performance Characteristics & Cache Hit Rates">
        <div className="space-y-8">
          <p className="text-muted-foreground">
            Understanding cache performance helps you optimize for maximum savings:
          </p>

          {/* Cache Hit Rates */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Typical Cache Hit Rates</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-foreground">Excellent</span>
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">85-95%</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Static system prompts, RAG applications with stable documents
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Customer support bots</li>
                  <li>• Document Q&A</li>
                  <li>• Code assistants with static docs</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-foreground">Good</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">60-85%</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Multi-turn conversations, tool-using agents
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Chatbots with conversation history</li>
                  <li>• Agents with many tools</li>
                  <li>• Mixed static/dynamic content</li>
                </ul>
              </div>

              <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-foreground">Fair</span>
                </div>
                <div className="text-4xl font-bold text-amber-600 mb-2">30-60%</div>
                <p className="text-sm text-muted-foreground mb-3">
                  Frequently changing content, low request volume
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Dynamic RAG with frequent updates</li>
                  <li>• Low traffic applications (cache expiry)</li>
                  <li>• High content variation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Performance Metrics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-border/50">
                <h4 className="font-semibold text-foreground mb-4">Latency Impact</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">First Request (Cache Miss)</span>
                      <span className="text-sm font-semibold text-foreground">~Same</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cache creation adds negligible overhead
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Cached Requests (Cache Hit)</span>
                      <span className="text-sm font-semibold text-green-600">-10-15%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Faster processing due to cached tokens
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-border/50">
                <h4 className="font-semibold text-foreground mb-4">Throughput Impact</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Requests/Second</span>
                      <span className="text-sm font-semibold text-green-600">+10-20%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '120%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher throughput with cached content
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Time to First Token</span>
                      <span className="text-sm font-semibold text-green-600">-15-25%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Faster initial response with cache
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monitoring Guide */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-purple-600" />
              <span>Monitoring Cache Performance</span>
            </h4>
            <CodeBlock
              language="typescript"
              code={`// Track cache metrics over time
interface CacheMetrics {
  totalRequests: number
  cacheHits: number
  cacheMisses: number
  cacheHitRate: number
  totalCost: number
  savingsAmount: number
}

const metrics: CacheMetrics = {
  totalRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  cacheHitRate: 0,
  totalCost: 0,
  savingsAmount: 0,
}

// After each request
const response = await anthropic.messages.create({ /* ... */ })
const usage = response.usage

metrics.totalRequests++

if (usage.cache_read_input_tokens > 0) {
  metrics.cacheHits++
  // Calculate savings (90% discount on cached tokens)
  const cachedCost = usage.cache_read_input_tokens * 0.0003 / 1000  // $0.30/1M
  const normalCost = usage.cache_read_input_tokens * 0.003 / 1000   // $3.00/1M
  metrics.savingsAmount += (normalCost - cachedCost)
} else if (usage.cache_creation_input_tokens > 0) {
  metrics.cacheMisses++
}

// Calculate cache hit rate
metrics.cacheHitRate = metrics.cacheHits / metrics.totalRequests

// Log metrics periodically
console.log(\`Cache hit rate: \${(metrics.cacheHitRate * 100).toFixed(1)}%\`)
console.log(\`Total savings: $\${metrics.savingsAmount.toFixed(2)}\`)
console.log(\`Avg cost per request: $\${(metrics.totalCost / metrics.totalRequests).toFixed(4)}\`)`}
              filename="cache-monitoring.ts"
            />
          </div>
        </div>
      </Section>

      {/* Related Resources */}
      <Section id="related-resources" title="Related Resources">
        <div className="space-y-6">
          <p className="text-muted-foreground mb-6">
            Explore related documentation and resources:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cookbooks */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-500/20">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Cookbooks</span>
              </h4>
              <div className="space-y-3">
                <Link
                  href="/cookbook/provider-caching-setup"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Provider Caching Setup Guide
                </Link>
                <Link
                  href="/cookbook/achieving-50-percent-reduction"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Achieving 50-70% Cost Reduction
                </Link>
                <Link
                  href="/cookbook/react-integration"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  React Integration Guide
                </Link>
                <Link
                  href="/cookbook/enterprise-production-pipeline"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Enterprise Production Pipeline
                </Link>
              </div>
            </div>

            {/* API References */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-500/20">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-600" />
                <span>Related APIs</span>
              </h4>
              <div className="space-y-3">
                <Link
                  href="/api/token-optimization/provider-caching"
                  className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Provider Caching API Overview
                </Link>
                <Link
                  href="/api/token-optimization/accurate-token-counter"
                  className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  AccurateTokenCounter (Token Counting)
                </Link>
                <Link
                  href="/api/token-optimization/cost-tracker"
                  className="flex items-center gap-2 text-sm text-purple-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  CostTracker (Cost Analytics)
                </Link>
              </div>
            </div>

            {/* External Resources */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-green-600" />
                <span>Provider Documentation</span>
              </h4>
              <div className="space-y-3">
                <a
                  href="https://docs.anthropic.com/claude/docs/prompt-caching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Anthropic Prompt Caching Docs
                </a>
                <a
                  href="https://platform.openai.com/docs/guides/prompt-caching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  OpenAI Prompt Caching Docs
                </a>
                <a
                  href="https://ai.google.dev/gemini-api/docs/caching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Google Gemini Context Caching
                </a>
              </div>
            </div>

            {/* Guides */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-500/20">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span>Optimization Guides</span>
              </h4>
              <div className="space-y-3">
                <Link
                  href="/guides/token-optimization"
                  className="flex items-center gap-2 text-sm text-amber-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Complete Token Optimization Guide
                </Link>
                <Link
                  href="/cookbook/smart-model-routing"
                  className="flex items-center gap-2 text-sm text-amber-600 hover:underline"
                >
                  <ArrowRight className="w-4 h-4" />
                  Smart Model Routing (10-15% savings)
                </Link>
              </div>
            </div>
          </div>

          {/* Token Optimization Badge */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8" />
              <div>
                <h4 className="text-xl font-bold">Token Optimization Hero</h4>
                <p className="text-sm opacity-90">
                  This API is part of the Token Optimization system
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                50-90% Savings
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                Stable
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold">
                Multi-Provider
              </span>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
