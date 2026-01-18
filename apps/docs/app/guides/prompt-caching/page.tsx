'use client'

import { ToastProvider } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { TutorialStep } from '@/components/Enhanced/TutorialStep'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ScrollReveal } from '@/components/UI/ScrollReveal'

const cacheManagerOptions: Prop[] = [
  {
    name: 'provider',
    type: "'anthropic' | 'openai' | 'auto'",
    description:
      'Cache provider to use. Auto-detects based on model name if not specified.',
    required: false,
  },
  {
    name: 'model',
    type: 'string',
    description: 'Model name for cost calculations.',
    required: false,
  },
  {
    name: 'defaultMinLength',
    type: 'number',
    description: 'Minimum token count for content to be cached. Default: 1024.',
    required: false,
  },
  {
    name: 'autoManage',
    type: 'boolean',
    description: 'Automatically add cache control markers. Default: true.',
    required: false,
  },
  {
    name: 'trackStats',
    type: 'boolean',
    description: 'Track cache hit/miss statistics. Default: true.',
    required: false,
  },
]

const cacheStatsProps: Prop[] = [
  {
    name: 'requests',
    type: 'number',
    description: 'Total cache requests made.',
  },
  {
    name: 'hits',
    type: 'number',
    description: 'Number of cache hits.',
  },
  {
    name: 'misses',
    type: 'number',
    description: 'Number of cache misses.',
  },
  {
    name: 'hitRate',
    type: 'number',
    description: 'Cache hit rate as percentage (0-100).',
  },
  {
    name: 'tokensSaved',
    type: 'number',
    description: 'Total tokens saved from caching.',
  },
  {
    name: 'costSaved',
    type: 'number',
    description: 'Estimated cost saved in dollars.',
  },
]

export default function PromptCachingGuidePage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <ScrollReveal>
          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-semibold mb-4">
              Cost Optimization
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Prompt Caching Guide
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Reduce AI API costs by 50-90% with intelligent prompt caching.
              Clarity Chat provides built-in support for Anthropic and OpenAI
              caching mechanisms.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <YouWillLearn
            items={[
              'How prompt caching works and its benefits',
              'Using PromptCacheManager for automatic caching',
              'Creating Anthropic-formatted cached messages',
              'Estimating cost savings from caching',
              'Multi-breakpoint caching strategies',
              'Cache warming for production applications',
            ]}
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="my-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <h3 className="text-lg font-semibold mb-2">
              Cost Savings Potential
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-green-500">90%</p>
                <p className="text-sm text-text-secondary">
                  Anthropic cache reads are 90% cheaper than regular input
                  tokens
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-500">50%</p>
                <p className="text-sm text-text-secondary">
                  OpenAI cache reads are 50% cheaper than regular input tokens
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-12 space-y-12">
          <ScrollReveal delay={0.3}>
            <TutorialStep step={1} title="Understanding Prompt Caching">
              <p className="text-text-secondary mb-4">
                Prompt caching allows AI providers to reuse previously processed
                content, significantly reducing costs when the same prompts are
                sent repeatedly. This is especially valuable for:
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">+</span>
                  <div>
                    <strong>System prompts</strong> - Your assistant&apos;s
                    personality and instructions rarely change
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">+</span>
                  <div>
                    <strong>Document context</strong> - RAG documents injected
                    into prompts
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">+</span>
                  <div>
                    <strong>Code context</strong> - Repository content for code
                    assistants
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">+</span>
                  <div>
                    <strong>Conversation history</strong> - Multi-turn chats
                    build up context
                  </div>
                </li>
              </ul>

              <Callout type="info">
                <strong>Provider Support:</strong> Anthropic supports up to 4
                cache breakpoints per request with a 5-minute TTL that extends
                on each cache hit. OpenAI caches system prompts automatically.
              </Callout>
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <TutorialStep step={2} title="Basic Usage with PromptCacheManager">
              <p className="text-text-secondary mb-4">
                The <code>PromptCacheManager</code> class provides automatic
                cache management:
              </p>

              <EnhancedCodeBlock
                code={`import { PromptCacheManager } from '@clarity-chat/react/internal'

// Create a cache manager for Anthropic
const cacheManager = new PromptCacheManager({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet',
  defaultMinLength: 1024, // Min tokens to cache
  autoManage: true,       // Auto-add cache markers
  trackStats: true,       // Track hit/miss rates
})

// Your long system prompt (this will be cached)
const systemPrompt = \`You are an expert AI assistant specialized in...
[lots of instructions, examples, and context - 2000+ tokens]\`

// Prepare messages with automatic cache control
const messages = cacheManager.prepareMessagesAnthropic([
  { role: 'system', content: systemPrompt },
  { role: 'user', content: 'Hello, how can you help me?' },
])

// Messages now include cache_control markers
// {
//   role: 'system',
//   content: '...',
//   cache_control: { type: 'ephemeral' }  // Added automatically!
// }`}
                language="typescript"
                filename="cache-manager-basic.ts"
                showLineNumbers
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <TutorialStep step={3} title="Convenience Functions">
              <p className="text-text-secondary mb-4">
                For simpler use cases, use the standalone utility functions:
              </p>

              <EnhancedCodeBlock
                code={`import {
  createAnthropicCachedMessages,
  estimateCacheSavings,
} from '@clarity-chat/react/internal'

// Create Anthropic-formatted messages with caching
const messages = createAnthropicCachedMessages(
  systemPrompt,           // Will be cached if > 1024 tokens
  conversationHistory,    // Array of { role, content }
  1024                    // Min token threshold (optional)
)

// Estimate potential savings
const savings = estimateCacheSavings({
  systemPromptTokens: 2000,
  contextTokens: 1500,
  conversationsPerDay: 1000,
  provider: 'anthropic',
  model: 'claude-3-5-sonnet',
})

console.log(\`Monthly savings: $\${savings.monthlySavings.toFixed(2)}\`)
// Output: "Monthly savings: $270.00"`}
                language="typescript"
                filename="cache-utilities.ts"
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.6}>
            <TutorialStep step={4} title="Multi-Breakpoint Strategy">
              <p className="text-text-secondary mb-4">
                Anthropic supports up to 4 cache breakpoints. Use them
                strategically for maximum savings:
              </p>

              <EnhancedCodeBlock
                code={`import {
  calculateCacheBreakpoints,
  applyBreakpointsToMessages,
} from '@clarity-chat/react/internal'

const messages = [
  { role: 'system', content: longSystemPrompt },      // 3000 tokens
  { role: 'user', content: documentContext },          // 2000 tokens
  { role: 'assistant', content: firstResponse },       // 500 tokens
  { role: 'user', content: followUpQuestion },         // 100 tokens
  { role: 'assistant', content: secondResponse },      // 800 tokens
  { role: 'user', content: currentQuery },             // 50 tokens
]

// Calculate optimal cache breakpoints
const breakpoints = calculateCacheBreakpoints(messages, {
  maxBreakpoints: 4,
  minTokensBetweenBreakpoints: 1024,
  provider: 'anthropic',
})

// Returns:
// [
//   { index: 0, cumulativeTokens: 3000, priority: 'critical', reason: 'System prompt' },
//   { index: 1, cumulativeTokens: 5000, priority: 'high', reason: 'Long user context' },
//   { index: 2, cumulativeTokens: 5500, priority: 'high', reason: 'Conversation boundary' },
//   { index: 4, cumulativeTokens: 6300, priority: 'medium', reason: 'Fill gap for coverage' },
// ]

// Apply breakpoints to messages
const cachedMessages = applyBreakpointsToMessages(messages, breakpoints)`}
                language="typescript"
                filename="multi-breakpoint.ts"
                showLineNumbers
                showCopyButton
              />

              <Callout type="tip" className="mt-4">
                <strong>Breakpoint Strategy:</strong>
                <ul className="mt-2 space-y-1">
                  <li>
                    <strong>Critical:</strong> System prompts (rarely change)
                  </li>
                  <li>
                    <strong>High:</strong> Document context, conversation
                    boundaries
                  </li>
                  <li>
                    <strong>Medium:</strong> Long user messages with RAG content
                  </li>
                  <li>
                    <strong>Low:</strong> Fill gaps for better coverage
                  </li>
                </ul>
              </Callout>
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.7}>
            <TutorialStep step={5} title="Cache Warming">
              <p className="text-text-secondary mb-4">
                Pre-populate caches before user traffic arrives for guaranteed
                cache hits:
              </p>

              <EnhancedCodeBlock
                code={`import {
  createCacheWarmingRequests,
  calculateWarmingSchedule,
} from '@clarity-chat/react/internal'

// Define content to warm
const warmingConfig = {
  content: [
    { id: 'system', content: systemPrompt, type: 'system', priority: 1 },
    { id: 'docs', content: documentation, type: 'document', priority: 2 },
    { id: 'examples', content: examples, type: 'context', priority: 3 },
  ],
  provider: 'anthropic',
}

// Create warming requests
const warmingRequests = createCacheWarmingRequests(warmingConfig)

// Calculate optimal execution schedule
const schedule = calculateWarmingSchedule(warmingRequests, {
  maxConcurrent: 3,
  delayBetweenBatches: 1000,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
})

// Execute warming on application startup
async function warmCaches() {
  for (const batch of schedule) {
    const requests = warmingRequests.filter(r =>
      batch.batch.includes(r.contentId)
    )

    await Promise.all(
      requests.map(req =>
        fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ messages: req.messages }),
        })
      )
    )

    // Wait before next batch
    await new Promise(resolve =>
      setTimeout(resolve, batch.executeAt - Date.now())
    )
  }
}`}
                language="typescript"
                filename="cache-warming.ts"
                showLineNumbers
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.8}>
            <TutorialStep step={6} title="TTL Management">
              <p className="text-text-secondary mb-4">
                Anthropic caches have a 5-minute TTL that extends on each hit.
                Manage TTL to maintain cache effectiveness:
              </p>

              <EnhancedCodeBlock
                code={`import { calculateTTLRefreshSchedule } from '@clarity-chat/react/internal'

// Track last cache hit timestamp
let lastCacheHit = Date.now()

// Check if refresh is needed
function checkCacheRefresh() {
  const result = calculateTTLRefreshSchedule(lastCacheHit, {
    baseTTL: 5 * 60 * 1000,    // 5 minutes
    refreshBefore: 30 * 1000,  // 30 seconds margin
    maxExtension: 30 * 60 * 1000, // 30 minutes max
  })

  if (result.shouldRefresh) {
    // Send a minimal request to extend the cache
    sendCacheRefreshRequest()
    lastCacheHit = Date.now()
  }

  return result
}

// Check periodically
setInterval(() => {
  const status = checkCacheRefresh()
  console.log(\`Cache expires in \${status.timeRemaining / 1000}s\`)
}, 60000)`}
                language="typescript"
                filename="ttl-management.ts"
                showCopyButton
              />
            </TutorialStep>
          </ScrollReveal>

          <ScrollReveal delay={0.9}>
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">API Reference</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    PromptCacheManager Options
                  </h3>
                  <PropsTable props={cacheManagerOptions} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Cache Statistics
                  </h3>
                  <p className="text-text-secondary mb-4">
                    Call <code>cacheManager.getStats()</code> to retrieve:
                  </p>
                  <PropsTable props={cacheStatsProps} />
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1.0}>
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Best Practices</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Cache Long Static Content
                  </h4>
                  <p className="text-sm text-text-secondary">
                    System prompts, documentation, and code context benefit most
                    from caching.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Use Cache Warming
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Pre-warm caches on startup to ensure first users get cache
                    hits.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Monitor Cache Stats
                  </h4>
                  <p className="text-sm text-text-secondary">
                    Track hit rates and adjust thresholds for optimal savings.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">+</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Plan TTL Refreshes
                  </h4>
                  <p className="text-sm text-text-secondary">
                    For long-running sessions, send periodic requests to extend
                    cache TTL.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">-</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Avoid Caching Dynamic Content
                  </h4>
                  <p className="text-sm text-text-secondary">
                    User-specific data that changes frequently won&apos;t
                    benefit from caching.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-bg-secondary border border-border">
                  <div className="text-2xl mb-2">-</div>
                  <h4 className="font-semibold text-text-primary mb-1">
                    Don&apos;t Over-Breakpoint
                  </h4>
                  <p className="text-sm text-text-secondary">
                    More breakpoints isn&apos;t always better. Focus on content
                    that&apos;s actually reused.
                  </p>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={1.1}>
            <Callout type="success" className="mt-8">
              <strong>Real-World Impact:</strong> A typical enterprise chat
              application with a 3000-token system prompt and 1000
              conversations/day can save ~$270/month with Anthropic caching and
              ~$125/month with OpenAI caching.
            </Callout>
          </ScrollReveal>
        </div>

        <Pagination
          prev={{
            title: 'Token Optimization',
            href: '/guides/token-optimization',
          }}
          next={{
            title: 'RAG Integration',
            href: '/guides/rag',
          }}
        />
      </>
    </ToastProvider>
  )
}
