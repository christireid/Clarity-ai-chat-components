import type { Metadata } from 'next'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import {
  PropsTable,
  PropDefinition,
} from '../../../../../components/Docs/PropsTable'
import { CodeBlock } from '../../../../../components/Docs/CodeBlock'
import { TocItem } from '../../../../../components/Docs/TableOfContents'
import { Alert } from '../../../../../components/Docs/Alert'
import Link from 'next/link'

export const revalidate = 3600 // ISR: revalidate every hour

export const metadata: Metadata = {
  title: 'CachingOptions Type | Clarity AI Chat Components',
  description:
    'Configure provider caching for 90% savings on cached tokens. Complete reference for CachingOptions type with Anthropic, OpenAI, and Google Gemini support.',
  openGraph: {
    title: 'CachingOptions Type Reference',
    description: 'Provider caching configuration for 90% token savings',
    type: 'article',
  },
}

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'type-definition', title: 'Type Definition', level: 2 },
  { id: 'properties', title: 'Properties Reference', level: 2 },
  { id: 'cost-impact', title: 'Cost Impact', level: 2 },
  { id: 'provider-options', title: 'Provider-Specific Options', level: 2 },
  { id: 'anthropic', title: 'Anthropic Caching', level: 3 },
  { id: 'openai', title: 'OpenAI Caching', level: 3 },
  { id: 'google', title: 'Google Gemini Caching', level: 3 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  {
    id: 'format-integration',
    title: 'Integration with formatForCaching',
    level: 2,
  },
  { id: 'cache-invalidation', title: 'Cache Invalidation Patterns', level: 2 },
  { id: 'best-practices', title: 'Best Practices', level: 2 },
  { id: 'examples', title: 'Usage Examples', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// Type properties definition
const baseProperties: PropDefinition[] = [
  {
    name: 'provider',
    type: "'anthropic' | 'openai' | 'google' | 'auto'",
    required: true,
    description:
      'Provider to use for caching. Use "auto" to automatically detect based on model name.',
  },
  {
    name: 'model',
    type: 'string',
    description:
      'Model name for provider detection (e.g., "claude-3-5-sonnet", "gpt-4o", "gemini-2.0-flash")',
  },
  {
    name: 'minTokens',
    type: 'number',
    default: '1024',
    description:
      'Minimum token threshold for caching eligibility. Anthropic/OpenAI: 1024, Google: 32768',
  },
  {
    name: 'ttl',
    type: 'number',
    description:
      'Cache TTL override in milliseconds. Anthropic: 5min, OpenAI: 5-10min, Google: 1hr',
  },
  {
    name: 'priority',
    type: 'number',
    description:
      'Cache priority (0-10, higher = more important). Used for multi-breakpoint optimization.',
  },
  {
    name: 'autoManage',
    type: 'boolean',
    default: 'true',
    description:
      'Automatically manage cache breakpoints. When true, system determines optimal cache points.',
  },
  {
    name: 'trackStats',
    type: 'boolean',
    default: 'true',
    description:
      'Track cache hit rates and cost savings for analytics and optimization.',
  },
]

const anthropicProperties: PropDefinition[] = [
  {
    name: 'maxBreakpoints',
    type: 'number',
    default: '4',
    description:
      'Maximum cache breakpoints per request (Anthropic supports up to 4 breakpoints)',
  },
  {
    name: 'cacheType',
    type: "'ephemeral'",
    default: "'ephemeral'",
    description:
      'Cache control type for Anthropic API. Currently only "ephemeral" is supported.',
  },
  {
    name: 'cacheSystemPrompt',
    type: 'boolean',
    default: 'true',
    description:
      'Automatically cache system prompts that meet minTokens threshold',
  },
  {
    name: 'cacheUserContext',
    type: 'boolean',
    default: 'true',
    description:
      'Cache long user messages (e.g., documents, context) that meet threshold',
  },
]

const openaiProperties: PropDefinition[] = [
  {
    name: 'cacheStrategy',
    type: "'automatic' | 'manual'",
    default: "'automatic'",
    description:
      'OpenAI caching is automatic. Manual mode disables cache-aware formatting.',
  },
  {
    name: 'enablePrefixCaching',
    type: 'boolean',
    default: 'true',
    description:
      'Enable prefix caching for system prompts (OpenAI automatically caches message prefixes)',
  },
]

const googleProperties: PropDefinition[] = [
  {
    name: 'contextCaching',
    type: 'boolean',
    default: 'true',
    description:
      'Enable context caching for Gemini models (requires 32K+ token threshold)',
  },
  {
    name: 'cacheTTL',
    type: 'number',
    default: '3600000',
    description:
      'Cache TTL in milliseconds for Google (default: 1 hour = 3600000ms)',
  },
  {
    name: 'includeSystemInstruction',
    type: 'boolean',
    default: 'true',
    description:
      'Include systemInstruction in cached content (Gemini-specific)',
  },
]

export default function CachingOptionsPage() {
  return (
    <DocumentationPage
      title="CachingOptions"
      description="Configure provider caching for 90% savings on cached tokens"
      tableOfContents={tableOfContents}
      badge={{
        text: '50-90% Savings',
        variant: 'cost-reduction',
      }}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          The <code className="text-sm">CachingOptions</code> type configures
          provider-native prompt caching to achieve significant cost reductions
          on repeated context. Different providers offer different caching
          capabilities and pricing models.
        </p>

        <Alert variant="success" className="mb-6">
          <h4 className="font-semibold mb-2">💰 Cost Impact</h4>
          <p className="text-sm">
            Configure for <strong>90% savings on cached tokens</strong> with
            Anthropic, 50% with OpenAI, and 75% with Google Gemini. When
            combined with other optimization strategies, achieve 50-70% overall
            cost reduction.
          </p>
        </Alert>

        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Key Benefits
          </h4>
          <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200 list-disc list-inside">
            <li>
              <strong>Massive Savings:</strong> 90% reduction on cached tokens
              (Anthropic)
            </li>
            <li>
              <strong>Multi-Provider:</strong> Unified API for Anthropic,
              OpenAI, and Google
            </li>
            <li>
              <strong>Automatic Management:</strong> Optimal cache breakpoints
              selected automatically
            </li>
            <li>
              <strong>Analytics Built-In:</strong> Track hit rates and actual
              savings
            </li>
            <li>
              <strong>Smart Invalidation:</strong> Cache expires only when
              needed
            </li>
          </ul>
        </div>
      </Section>

      {/* Type Definition */}
      <Section id="type-definition" title="Type Definition">
        <CodeBlock
          language="typescript"
          code={`/**
 * Caching configuration for provider-native prompt caching
 *
 * Achieves 50-90% cost reduction on repeated context by caching
 * static content like system prompts and documentation.
 */
export interface CachingOptions {
  /** Provider to use for caching */
  provider: 'anthropic' | 'openai' | 'google' | 'auto'

  /** Model name for auto provider detection */
  model?: string

  /** Minimum tokens required for caching eligibility */
  minTokens?: number

  /** Cache TTL override in milliseconds */
  ttl?: number

  /** Cache priority for multi-breakpoint optimization (0-10) */
  priority?: number

  /** Automatically manage cache breakpoints */
  autoManage?: boolean

  /** Track cache statistics for analytics */
  trackStats?: boolean

  // Provider-specific options

  /** Anthropic-specific options */
  anthropic?: {
    maxBreakpoints?: number
    cacheType?: 'ephemeral'
    cacheSystemPrompt?: boolean
    cacheUserContext?: boolean
  }

  /** OpenAI-specific options */
  openai?: {
    cacheStrategy?: 'automatic' | 'manual'
    enablePrefixCaching?: boolean
  }

  /** Google Gemini-specific options */
  google?: {
    contextCaching?: boolean
    cacheTTL?: number
    includeSystemInstruction?: boolean
  }
}`}
        />
      </Section>

      {/* Properties Reference */}
      <Section id="properties" title="Properties Reference">
        <h3 className="text-xl font-semibold mb-4">Base Properties</h3>
        <PropsTable props={baseProperties} />
      </Section>

      {/* Cost Impact */}
      <Section id="cost-impact" title="Cost Impact">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Configure for 90% Savings on Cached Tokens
          </h3>

          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  90%
                </div>
                <div className="text-sm font-medium">Anthropic Claude</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  $0.30 vs $3.00 per 1M tokens
                </div>
              </div>

              <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">50%</div>
                <div className="text-sm font-medium">OpenAI GPT-4</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  $1.25 vs $2.50 per 1M tokens
                </div>
              </div>

              <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  75%
                </div>
                <div className="text-sm font-medium">Google Gemini</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  $0.125 vs $0.50 per 1M tokens
                </div>
              </div>
            </div>

            <Alert variant="warning" className="mt-4">
              <p className="text-sm">
                <strong>Important:</strong> These percentages apply to cached
                tokens only. Overall cost reduction will be 50-70% when
                combining provider caching with compression and model routing
                strategies.
              </p>
            </Alert>

            <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-3">Example: 10,000 Requests</h4>
              <div className="text-sm space-y-2">
                <p>
                  <strong>Scenario:</strong> 2000-token system prompt, 90% cache
                  hit rate
                </p>
                <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span>Without Caching</span>
                  <span className="font-mono text-red-600">$60.00/month</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-neutral-800">
                  <span>With Caching (Anthropic)</span>
                  <span className="font-mono text-emerald-600">
                    $11.40/month
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 font-bold">
                  <span>Monthly Savings</span>
                  <span className="font-mono text-emerald-600">
                    $48.60 (81%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Provider-Specific Options */}
      <Section id="provider-options" title="Provider-Specific Options">
        {/* Anthropic */}
        <div id="anthropic" className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Anthropic Prompt Caching
          </h3>

          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">Key Features</h4>
            <ul className="text-sm space-y-1 text-purple-900 dark:text-purple-100 list-disc list-inside">
              <li>Up to 4 cache breakpoints per request</li>
              <li>90% cost reduction on cached tokens</li>
              <li>5-minute cache lifetime (extends on each hit)</li>
              <li>Minimum 1024 tokens for caching</li>
              <li>Supports system, user, and assistant messages</li>
            </ul>
          </div>

          <PropsTable props={anthropicProperties} />

          <div className="mt-4">
            <CodeBlock
              language="typescript"
              code={`import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'

const options: CachingOptions = {
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  minTokens: 1024,
  autoManage: true,
  trackStats: true,
  anthropic: {
    maxBreakpoints: 4,
    cacheType: 'ephemeral',
    cacheSystemPrompt: true,
    cacheUserContext: true,
  },
}

const result = await formatMessagesForProviderCaching(messages, options)
// System prompt and long user messages automatically cached`}
            />
          </div>
        </div>

        {/* OpenAI */}
        <div id="openai" className="mb-8">
          <h3 className="text-xl font-semibold mb-4">OpenAI Prompt Caching</h3>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">Key Features</h4>
            <ul className="text-sm space-y-1 text-blue-900 dark:text-blue-100 list-disc list-inside">
              <li>Automatic prefix caching (no special formatting needed)</li>
              <li>50% cost reduction on cached tokens</li>
              <li>5-10 minute cache lifetime (varies by load)</li>
              <li>Minimum 1024 tokens for automatic caching</li>
              <li>Works with GPT-4o and GPT-4o-mini models</li>
            </ul>
          </div>

          <PropsTable props={openaiProperties} />

          <div className="mt-4">
            <CodeBlock
              language="typescript"
              code={`const options: CachingOptions = {
  provider: 'openai',
  model: 'gpt-4o',
  minTokens: 1024,
  openai: {
    cacheStrategy: 'automatic',
    enablePrefixCaching: true,
  },
}

const result = await formatMessagesForProviderCaching(messages, options)
// OpenAI automatically caches message prefixes`}
            />
          </div>
        </div>

        {/* Google */}
        <div id="google" className="mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Google Gemini Context Caching
          </h3>

          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold mb-2">Key Features</h4>
            <ul className="text-sm space-y-1 text-green-900 dark:text-green-100 list-disc list-inside">
              <li>Best for very large contexts (32K+ tokens required)</li>
              <li>75% cost reduction on cached tokens</li>
              <li>1-hour cache lifetime (longest among providers)</li>
              <li>Supports contexts up to 1M tokens</li>
              <li>Ideal for document-heavy applications</li>
            </ul>
          </div>

          <PropsTable props={googleProperties} />

          <div className="mt-4">
            <CodeBlock
              language="typescript"
              code={`const options: CachingOptions = {
  provider: 'google',
  model: 'gemini-2.0-flash',
  minTokens: 32768, // Higher threshold for Google
  google: {
    contextCaching: true,
    cacheTTL: 3600000, // 1 hour
    includeSystemInstruction: true,
  },
}

const result = await formatMessagesForProviderCaching(messages, options)
// Only caches if content exceeds 32K tokens`}
            />
          </div>
        </div>
      </Section>

      {/* Basic Usage */}
      <Section id="basic-usage" title="Basic Usage">
        <CodeBlock
          language="typescript"
          code={`import { CachingOptions } from '@clarity-chat/token-optimization'

// Simple configuration with auto provider detection
const options: CachingOptions = {
  provider: 'auto',
  model: 'claude-3-5-sonnet-20241022',
  autoManage: true,
  trackStats: true,
}

// Provider-specific configuration
const anthropicOptions: CachingOptions = {
  provider: 'anthropic',
  minTokens: 1024,
  anthropic: {
    maxBreakpoints: 4,
    cacheSystemPrompt: true,
  },
}

// Custom TTL and priority
const customOptions: CachingOptions = {
  provider: 'anthropic',
  ttl: 600000, // 10 minutes
  priority: 8, // High priority for critical content
  autoManage: false, // Manual breakpoint control
}`}
        />
      </Section>

      {/* Integration with formatForCaching */}
      <Section
        id="format-integration"
        title="Integration with formatForCaching"
      >
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          CachingOptions integrates seamlessly with the{' '}
          <code className="text-sm">formatForCaching()</code> utility to
          automatically add cache control markers to your messages.
        </p>

        <CodeBlock
          language="typescript"
          code={`import { formatMessagesForProviderCaching, CachingOptions } from '@clarity-chat/token-optimization'

const messages = [
  {
    role: 'system',
    content: largeSystemPrompt, // 3000+ tokens
  },
  {
    role: 'user',
    content: 'How do I implement authentication?',
  },
]

const options: CachingOptions = {
  provider: 'anthropic',
  minTokens: 1024,
  autoManage: true,
  trackStats: true,
}

// Format messages with cache markers
const result = await formatMessagesForProviderCaching(messages, options)

console.log(result.messages)
// [
//   {
//     role: 'system',
//     content: largeSystemPrompt,
//     cache_control: { type: 'ephemeral' } // ✅ Added automatically
//   },
//   {
//     role: 'user',
//     content: 'How do I implement authentication?'
//   }
// ]

// Use with Anthropic SDK
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: result.messages,
})

// Check cache performance
console.log('Cache read tokens:', response.usage.cache_read_input_tokens)
console.log('Savings:', result.stats.estimatedSavings)`}
        />
      </Section>

      {/* Cache Invalidation Patterns */}
      <Section id="cache-invalidation" title="Cache Invalidation Patterns">
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Understanding cache invalidation is crucial for optimal performance
          and cost savings.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Time-Based Invalidation</h4>
            <CodeBlock
              language="typescript"
              code={`// Cache expires after TTL
const options: CachingOptions = {
  provider: 'anthropic',
  ttl: 300000, // 5 minutes (default for Anthropic)
}

// Google has longer TTL
const googleOptions: CachingOptions = {
  provider: 'google',
  google: {
    cacheTTL: 3600000, // 1 hour
  },
}

// Cache extends on each hit (Anthropic only)
// If you send a request every 4 minutes, cache stays warm indefinitely`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Content-Based Invalidation</h4>
            <CodeBlock
              language="typescript"
              code={`// Cache invalidates when content changes
const systemPrompt = 'You are a helpful assistant.'

// First request - creates cache
await formatMessagesForProviderCaching([
  { role: 'system', content: systemPrompt },
  { role: 'user', content: 'Hello' },
], options)

// Second request - cache hit (same system prompt)
await formatMessagesForProviderCaching([
  { role: 'system', content: systemPrompt },
  { role: 'user', content: 'How are you?' },
], options)

// Third request - cache miss (different system prompt)
await formatMessagesForProviderCaching([
  { role: 'system', content: 'You are a code assistant.' }, // Changed!
  { role: 'user', content: 'Write a function' },
], options)
// ❌ Cache invalidated - new system prompt creates new cache`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Manual Cache Warming</h4>
            <CodeBlock
              language="typescript"
              code={`import { createCacheWarmingRequests } from '@clarity-chat/token-optimization'

// Pre-warm cache before user traffic
const warmingRequests = createCacheWarmingRequests({
  content: [
    {
      id: 'system',
      content: systemPrompt,
      type: 'system',
      priority: 1,
    },
    {
      id: 'docs',
      content: documentation,
      type: 'document',
      priority: 2,
    },
  ],
  provider: 'anthropic',
})

// Execute warming requests
await Promise.all(warmingRequests.map(async (req) => {
  await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1,
    messages: req.messages,
  })
}))

// Cache is now warm for user requests`}
            />
          </div>
        </div>
      </Section>

      {/* Best Practices */}
      <Section id="best-practices" title="Best Practices">
        <div className="space-y-4">
          <div className="bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              ✅ DO: Place Cacheable Content First
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Put static content (system prompts, documentation) at the
              beginning of your message array for optimal caching.
            </p>
            <CodeBlock
              language="typescript"
              code={`// ✅ Good: System prompt first
const messages = [
  { role: 'system', content: largeSystemPrompt }, // Cached
  { role: 'user', content: 'Dynamic query' },      // Not cached
]`}
            />
          </div>

          <div className="bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              ✅ DO: Keep System Prompts Consistent
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Use the exact same system prompt across requests to maximize cache
              hits.
            </p>
            <CodeBlock
              language="typescript"
              code={`// ✅ Good: Store as constant
const SYSTEM_PROMPT = 'You are a helpful assistant with...'

// Use everywhere
const messages1 = [{ role: 'system', content: SYSTEM_PROMPT }, ...]
const messages2 = [{ role: 'system', content: SYSTEM_PROMPT }, ...]

// ❌ Bad: Varying prompts
const messages1 = [{ role: 'system', content: 'You are helpful...' }, ...]
const messages2 = [{ role: 'system', content: 'You are a helpful...' }, ...]`}
            />
          </div>

          <div className="bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              ✅ DO: Meet Minimum Token Thresholds
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Ensure your cacheable content meets the provider's minimum token
              requirement.
            </p>
            <CodeBlock
              language="typescript"
              code={`// Anthropic/OpenAI: Minimum 1024 tokens
const systemPrompt = generateLargePrompt() // Must be 1024+ tokens

// Google: Minimum 32,768 tokens
const documentation = generateMassiveContext() // Must be 32K+ tokens

// Check before caching
import { estimateTokens } from '@clarity-chat/token-optimization'

const tokens = estimateTokens(systemPrompt)
if (tokens < 1024) {
  console.warn('Content too small for caching')
}`}
            />
          </div>

          <div className="bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              ✅ DO: Monitor Cache Hit Rates
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Enable statistics tracking to measure actual savings and optimize
              configuration.
            </p>
            <CodeBlock
              language="typescript"
              code={`const options: CachingOptions = {
  provider: 'anthropic',
  trackStats: true, // Enable statistics
}

const result = await formatMessagesForProviderCaching(messages, options)

// Check performance
console.log('Cache hit rate:', result.stats.hitRate)
console.log('Tokens saved:', result.stats.tokensSaved)
console.log('Cost saved:', result.stats.costSaved)

// Target: >80% hit rate for optimal savings`}
            />
          </div>

          <div className="bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              ❌ DON'T: Cache Frequently Changing Content
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Avoid caching content that changes on every request - you'll pay
              cache creation costs without benefits.
            </p>
            <CodeBlock
              language="typescript"
              code={`// ❌ Bad: Caching dynamic content
const messages = [
  {
    role: 'system',
    content: \`Today is \${new Date()}\`, // Changes every request!
    cache_control: { type: 'ephemeral' },
  },
]

// ✅ Good: Cache static, reference dynamic
const messages = [
  {
    role: 'system',
    content: 'You are a helpful assistant.', // Static
    cache_control: { type: 'ephemeral' },
  },
  {
    role: 'user',
    content: \`Today is \${new Date()}. Help me...\`, // Dynamic in user message
  },
]`}
            />
          </div>

          <div className="bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] rounded-lg p-4">
            <h4 className="font-semibold mb-2">
              ❌ DON'T: Expect 90% Overall Savings
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              The 90% discount applies only to cached tokens, not your entire
              bill. Realistic overall savings are 50-70%.
            </p>
            <CodeBlock
              language="typescript"
              code={`// Understanding the math:
// If 40% of your tokens are cacheable and you get 90% hit rate:
// Savings = 0.40 × 0.90 = 36% of total cost

// Combined with compression (30%) and routing (20%):
// Total savings ≈ 36% + 30% + 20% = 86% (but not additive)
// Realistic combined savings: 50-70% overall`}
            />
          </div>
        </div>
      </Section>

      {/* Usage Examples */}
      <Section id="examples" title="Usage Examples">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">
              Example 1: Customer Support Bot
            </h4>
            <CodeBlock
              language="typescript"
              code={`import { formatMessagesForProviderCaching, CachingOptions } from '@clarity-chat/token-optimization'

const supportDocs = \`
# Product Documentation
[3000+ tokens of product documentation]

# Support Guidelines
[1500+ tokens of support guidelines]
\`

const options: CachingOptions = {
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  minTokens: 1024,
  autoManage: true,
  trackStats: true,
  anthropic: {
    cacheSystemPrompt: true,
    maxBreakpoints: 2, // System + docs
  },
}

// First customer query
const messages1 = [
  { role: 'system', content: supportDocs },
  { role: 'user', content: 'How do I reset my password?' },
]

const result1 = await formatMessagesForProviderCaching(messages1, options)
// Cache miss - pays full price for system prompt

// Second customer query (5 seconds later)
const messages2 = [
  { role: 'system', content: supportDocs }, // Same docs
  { role: 'user', content: 'How do I cancel my subscription?' },
]

const result2 = await formatMessagesForProviderCaching(messages2, options)
// Cache hit - pays 90% less for system prompt
// Savings: ~$0.014 per request on 4500 tokens`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">Example 2: Code Assistant</h4>
            <CodeBlock
              language="typescript"
              code={`const codebaseDocs = \`
# Codebase Documentation
[5000+ tokens of codebase context]

# Coding Standards
[2000+ tokens of style guides]
\`

const options: CachingOptions = {
  provider: 'openai',
  model: 'gpt-4o',
  minTokens: 1024,
  openai: {
    enablePrefixCaching: true,
  },
}

const messages = [
  { role: 'system', content: codebaseDocs },
  { role: 'user', content: 'Implement authentication' },
]

const result = await formatMessagesForProviderCaching(messages, options)
// OpenAI automatically caches the system prompt prefix
// 50% savings on subsequent requests with same prefix`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              Example 3: Document Analysis (Gemini)
            </h4>
            <CodeBlock
              language="typescript"
              code={`import { GoogleGenerativeAI } from '@google/generative-ai'

const massiveDocs = \`
[50,000+ tokens of documentation]
\`

const options: CachingOptions = {
  provider: 'google',
  model: 'gemini-2.0-flash',
  minTokens: 32768,
  google: {
    contextCaching: true,
    cacheTTL: 3600000, // 1 hour
    includeSystemInstruction: true,
  },
}

const result = await formatMessagesForProviderCaching(
  [
    { role: 'system', content: massiveDocs },
    { role: 'user', content: 'Summarize section 5' },
  ],
  options
)

// Google caches large context for 1 hour
// 75% savings on cached tokens
// Ideal for multi-turn document Q&A`}
            />
          </div>

          <div>
            <h4 className="font-semibold mb-3">
              Example 4: Multi-Breakpoint Caching
            </h4>
            <CodeBlock
              language="typescript"
              code={`const options: CachingOptions = {
  provider: 'anthropic',
  minTokens: 1024,
  autoManage: false, // Manual control
  anthropic: {
    maxBreakpoints: 4,
  },
}

const messages = [
  {
    role: 'system',
    content: systemPrompt, // 2000 tokens
    cache_control: { type: 'ephemeral' }, // Breakpoint 1
  },
  {
    role: 'user',
    content: productDocs, // 3000 tokens
    cache_control: { type: 'ephemeral' }, // Breakpoint 2
  },
  {
    role: 'assistant',
    content: previousResponse, // 1500 tokens
    cache_control: { type: 'ephemeral' }, // Breakpoint 3
  },
  {
    role: 'user',
    content: newQuery, // Not cached
  },
]

// With 4 breakpoints, different parts cache independently
// Maximize reuse across conversation patterns`}
            />
          </div>
        </div>
      </Section>

      {/* Related APIs */}
      <Section id="related" title="Related APIs">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/reference/functions/format-for-caching"
            className="block p-4 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">formatForCaching()</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Format messages with cache control markers based on CachingOptions
            </p>
          </Link>

          <Link
            href="/reference/types/prompt-cache-options"
            className="block p-4 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">PromptCacheOptions</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Lower-level cache configuration for advanced use cases
            </p>
          </Link>

          <Link
            href="/reference/classes/prompt-cache-manager"
            className="block p-4 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">PromptCacheManager</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Class-based cache management with analytics and warming
            </p>
          </Link>

          <Link
            href="/cookbook/provider-caching-setup"
            className="block p-4 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">Provider Caching Cookbook</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Complete guide to setting up provider caching with real examples
            </p>
          </Link>

          <Link
            href="/reference/components/token-optimization"
            className="block p-4 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">Token Optimization System</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Complete token optimization guide with caching integration
            </p>
          </Link>

          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="block p-4 rounded-lg border border-neutral-200/60 dark:border-white/[0.06] hover:border-brand-500/30 transition-colors"
          >
            <h4 className="font-semibold mb-2">Achieving 50% Cost Reduction</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Combine caching with compression and routing for maximum savings
            </p>
          </Link>
        </div>
      </Section>
    </DocumentationPage>
  )
}
