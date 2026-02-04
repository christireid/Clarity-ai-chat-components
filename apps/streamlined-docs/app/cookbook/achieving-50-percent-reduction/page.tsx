import { Metadata } from 'next'
import { useState } from 'react'
import { CodeBlock } from '@/components/CodeBlock'
import { ScrollReveal } from '@/components/Enhanced/ScrollReveal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { BeforeAfterComparison } from '@clarity-chat/react'
import {
  DollarSign,
  TrendingDown,
  Database,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Target,
  Layers,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Achieving 50-70% Cost Reduction | Token Optimization Cookbook',
  description:
    'Achieve 50-70% cost reduction on AI costs through provider caching, token compression, and smart model routing. Step-by-step implementation guide with real-world examples showing how to reduce AI costs by combining multiple optimization strategies.',
  keywords: [
    'token optimization',
    'cost reduction',
    'AI cost savings',
    '50-70% savings',
    'provider caching',
    'model routing',
    'compression',
    'AI optimization',
    'LLM cost reduction',
    'token compression',
  ],
  openGraph: {
    title: 'Achieving 50-70% AI Cost Reduction - Token Optimization Guide',
    description:
      'Learn how to reduce AI costs by 50-70% using provider caching, compression, and smart routing. Production-ready code examples and cost analysis included.',
    type: 'article',
    url: '/cookbook/achieving-50-percent-reduction',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Achieving 50-70% AI Cost Reduction',
    description:
      'Reduce AI costs by 50-70% with provider caching, compression, and smart routing. Step-by-step guide with production examples.',
  },
}

'use client'

export default function Achieving50PercentReductionPage() {
  const [activeStrategy, setActiveStrategy] = useState<'caching' | 'compression' | 'routing'>('caching')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-full mb-6">
            <Target className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              Cookbook Recipe
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Achieving 50-70% Cost Reduction
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A step-by-step guide to systematically reduce your AI costs by 50-70% using
            provider caching, compression, and smart routing strategies.
          </p>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.15}>
        <section className="mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 text-white flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-3">What You'll Learn</h2>
                <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>How to achieve 50%+ savings with provider caching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Adding 15-25% more savings with compression</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Achieving 10-15% additional reduction via smart routing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Combining strategies for maximum cost efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Measuring and tracking your savings over time</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Prerequisites */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">1. Install the Package</h3>
              <CodeBlock
                code="npm install @clarity-chat/token-optimization"
                language="bash"
              />
            </div>

            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">2. Basic Token Counting</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Understand how to count tokens before optimizing costs.
              </p>
              <CodeBlock
                code={`import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
})

const tokens = counter.count('Your text here')
console.log(\`Tokens: \${tokens}\`)`}
                language="typescript"
              />
            </div>

            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">3. Environment Variables</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Set up your API keys for the providers you'll use.
              </p>
              <CodeBlock
                code={`# .env.local
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here`}
                language="bash"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Strategy Overview */}
      <ScrollReveal direction="up" delay={0.25}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Optimization Strategy Overview</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => setActiveStrategy('caching')}
              className={`p-6 rounded-xl text-left transition-all ${
                activeStrategy === 'caching'
                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-300 dark:border-purple-700'
                  : 'bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] hover:border-purple-200 dark:hover:border-purple-800'
              }`}
            >
              <Database className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">Provider Caching</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                50%+ cost reduction
              </p>
              <p className="text-xs text-neutral-500">
                Cache static content for 90% savings on repeated tokens
              </p>
            </button>

            <button
              onClick={() => setActiveStrategy('compression')}
              className={`p-6 rounded-xl text-left transition-all ${
                activeStrategy === 'compression'
                  ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-2 border-blue-300 dark:border-blue-700'
                  : 'bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              <Layers className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">Compression</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                15-25% additional reduction
              </p>
              <p className="text-xs text-neutral-500">
                Compress context with 2-20x ratio while preserving quality
              </p>
            </button>

            <button
              onClick={() => setActiveStrategy('routing')}
              className={`p-6 rounded-xl text-left transition-all ${
                activeStrategy === 'routing'
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-300 dark:border-emerald-700'
                  : 'bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06] hover:border-emerald-200 dark:hover:border-emerald-800'
              }`}
            >
              <Zap className="w-8 h-8 text-emerald-500 mb-3" />
              <h3 className="font-bold text-lg mb-2">Smart Routing</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                10-15% additional reduction
              </p>
              <p className="text-xs text-neutral-500">
                Route queries to cost-efficient models based on complexity
              </p>
            </button>
          </div>
        </section>
      </ScrollReveal>

      {/* Strategy 1: Provider Caching */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Strategy 1: Provider Caching (50%+ Savings)</h2>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
            <p className="text-sm text-purple-900 dark:text-purple-100">
              <strong>Key Insight:</strong> Provider caching gives you 90% discount on cached tokens (like system prompts).
              For a typical application with a 2000-token system prompt used in every request, this translates to 50%+ overall savings.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Implementation Steps</h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-sm font-bold">1</span>
                Format Your Messages for Caching
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                Use the <code>formatForCaching</code> function to automatically add cache markers to eligible content:
              </p>
              <CodeBlock
                code={`import { formatForCaching } from '@clarity-chat/token-optimization'

const messages = [
  {
    role: 'system',
    content: \`You are an AI assistant specialized in customer support.

Here is our comprehensive product documentation:

\${largeDocumentation}

Always be helpful, accurate, and professional.\`
  },
  {
    role: 'user',
    content: userQuery
  }
]

// Anthropic caching (90% discount on cached tokens)
const cached = await formatForCaching(messages, {
  provider: 'anthropic',
  minTokens: 1024, // Minimum tokens to cache (provider requirement)
})

console.log(cached.estimatedSavings) // "~60% overall cost reduction"`}
                language="typescript"
              />
            </div>

            {/* Step 2 */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-sm font-bold">2</span>
                Use Cached Messages in Your API Calls
              </h4>
              <CodeBlock
                code={`import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: cached.messages, // Uses cache-formatted messages
  // System prompt with cache_control automatically added
})

// Check cache performance
console.log('Cache read tokens:', response.usage.cache_read_input_tokens)
console.log('Cache creation tokens:', response.usage.cache_creation_input_tokens)`}
                language="typescript"
              />
            </div>

            {/* Before/After Comparison */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
              <h4 className="font-semibold mb-4">💰 Cost Comparison</h4>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">Before Caching</p>
                  <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>System prompt (2000 tokens):</span>
                      <span className="font-mono">$0.006</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>User query (200 tokens):</span>
                      <span className="font-mono">$0.0006</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                      <span>Total per request:</span>
                      <span className="font-mono text-red-600">$0.0066</span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500 pt-1">
                      <span>10,000 requests/month:</span>
                      <span className="font-mono">$66/mo</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">After Caching</p>
                  <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>System prompt (cached at 90% off):</span>
                      <span className="font-mono">$0.0006</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>User query (200 tokens):</span>
                      <span className="font-mono">$0.0006</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                      <span>Total per request:</span>
                      <span className="font-mono text-emerald-600">$0.0012</span>
                    </div>
                    <div className="flex justify-between text-xs text-emerald-600 pt-1 font-semibold">
                      <span>10,000 requests/month:</span>
                      <span className="font-mono">$12/mo (82% savings!)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded bg-emerald-100 dark:bg-emerald-900/30 text-sm text-emerald-800 dark:text-emerald-200">
                <strong>Result:</strong> $66/mo → $12/mo = <strong>82% cost reduction</strong> just from caching!
                This exceeds our 50-70% baseline target.
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Strategy 2: Compression */}
      <ScrollReveal direction="up" delay={0.35}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Strategy 2: Compression (15-25% Additional)</h2>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Key Insight:</strong> Compression reduces token count by 2-20x while maintaining quality above 0.7.
              Combined with caching, this adds 15-25% more savings.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Choose the Right Compressor</h3>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2">LLMLingua</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Best for: Prompts and instructions
              </p>
              <p className="text-xs text-emerald-600">2-20x compression</p>
            </div>
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2">Extractive</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Best for: Documents and articles
              </p>
              <p className="text-xs text-emerald-600">2-10x compression</p>
            </div>
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2">Adaptive</h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Best for: Auto-selection
              </p>
              <p className="text-xs text-emerald-600">2-15x compression</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Implementation</h3>

          <CodeBlock
            code={`import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

// Compress user context before caching
const userContext = \`
\${userProfile}
\${conversationHistory}
\${relevantDocuments}
\`

const compressed = await compressWithLLMLingua(userContext, {
  targetRatio: 0.5, // Target 50% of original size
  qualityThreshold: 0.7, // Minimum acceptable quality
  preserveStructure: true,
})

if (compressed.quality >= 0.7) {
  console.log(\`Compressed \${compressed.originalTokens} → \${compressed.compressedTokens} tokens\`)
  console.log(\`Quality: \${compressed.quality}\`)
  console.log(\`Token savings: \${compressed.tokensSaved}\`)

  // Use compressed context in your messages
  const messages = [
    { role: 'system', content: systemPrompt }, // Will be cached
    { role: 'user', content: compressed.compressed }, // Compressed!
  ]
} else {
  console.warn('Compression quality too low, using original')
}`}
            language="typescript"
          />

          <div className="mt-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Quality Gate:</strong> Always check <code>compressed.quality &gt;= 0.7</code> before using compressed text.
              Fall back to original if quality is too low to ensure good AI responses.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Strategy 3: Smart Routing */}
      <ScrollReveal direction="up" delay={0.4}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Strategy 3: Smart Routing (10-15% Additional)</h2>
          </div>

          <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
            <p className="text-sm text-emerald-900 dark:text-emerald-100">
              <strong>Key Insight:</strong> 60-70% of queries can be handled by cheaper models (like Claude Haiku or GPT-4o-mini)
              without sacrificing quality. Route intelligently to save 10-15% more.
            </p>
          </div>

          <h3 className="text-xl font-semibold mb-4">Implementation</h3>

          <CodeBlock
            code={`import { ModelRouter } from '@clarity-chat/token-optimization'

// Create router with cost-optimized strategy
const router = ModelRouter.builder()
  .useClaudeModels() // Adds Haiku, Sonnet, Opus
  .withStrategy('cost-optimized')
  .build()

// Route based on query complexity
const userQuery = "What's the weather like?"
const routing = await router.route(userQuery, {
  maxCostPerToken: 0.003, // Budget constraint
  preferredProvider: 'anthropic',
})

console.log(\`Selected model: \${routing.model}\`) // claude-3-haiku (cheap!)
console.log(\`Reasoning: \${routing.reasoning}\`)
console.log(\`Estimated cost: $\${routing.estimatedCost}\`)

// Use the routed model
const response = await anthropic.messages.create({
  model: routing.model,
  max_tokens: routing.suggestedMaxTokens,
  messages: [{ role: 'user', content: userQuery }],
})`}
            language="typescript"
          />

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 text-sm">Simple Queries → Cheap Models</h4>
              <ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>• "What's the status of my order?"</li>
                <li>• "Set a reminder for tomorrow"</li>
                <li>• "Summarize this paragraph"</li>
              </ul>
              <p className="text-xs text-emerald-600 mt-2">→ Claude Haiku ($0.25/1M input)</p>
            </div>
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h4 className="font-semibold mb-2 text-sm">Complex Queries → Premium Models</h4>
              <ul className="text-xs space-y-1 text-neutral-600 dark:text-neutral-400">
                <li>• "Analyze this legal contract"</li>
                <li>• "Write a strategic business plan"</li>
                <li>• "Debug this complex algorithm"</li>
              </ul>
              <p className="text-xs text-purple-600 mt-2">→ Claude Sonnet ($3/1M input)</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Combining Strategies */}
      <ScrollReveal direction="up" delay={0.45}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Combining All Three Strategies</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The real power comes from combining caching, compression, and routing into a single optimization pipeline:
          </p>

          <CodeBlock
            code={`import {
  formatForCaching,
  compressWithLLMLingua,
  ModelRouter,
  estimateCost,
} from '@clarity-chat/token-optimization'

async function optimizedChat(userQuery: string) {
  // Step 1: Compress user context
  const userContext = await getUserContext() // 5000 tokens
  const compressed = await compressWithLLMLingua(userContext, {
    targetRatio: 0.5,
    qualityThreshold: 0.7,
  })

  // Step 2: Format with caching
  const messages = [
    {
      role: 'system',
      content: largeSystemPrompt, // 2000 tokens, will be cached
    },
    {
      role: 'user',
      content: \`Context: \${compressed.compressed}\n\nQuery: \${userQuery}\`,
    },
  ]

  const cached = await formatForCaching(messages, {
    provider: 'anthropic',
    minTokens: 1024,
  })

  // Step 3: Route to cost-efficient model
  const router = ModelRouter.builder()
    .useClaudeModels()
    .withStrategy('cost-optimized')
    .build()

  const routing = await router.route(userQuery)

  // Step 4: Make API call
  const response = await anthropic.messages.create({
    model: routing.model,
    max_tokens: routing.suggestedMaxTokens,
    messages: cached.messages,
  })

  // Step 5: Track savings
  const originalCost = estimateCost({
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    inputTokens: 7000, // Original: 2000 system + 5000 context
    outputTokens: response.usage.output_tokens,
  })

  const optimizedCost = estimateCost({
    provider: 'anthropic',
    model: routing.model,
    inputTokens: 2000 * 0.1 + compressed.compressedTokens, // Cached + compressed
    outputTokens: response.usage.output_tokens,
  })

  console.log(\`Original cost: $\${originalCost.toFixed(4)}\`)
  console.log(\`Optimized cost: $\${optimizedCost.toFixed(4)}\`)
  console.log(\`Savings: \${((1 - optimizedCost / originalCost) * 100).toFixed(1)}%\`)

  return response
}

// Usage
const response = await optimizedChat("How do I reset my password?")`}
            language="typescript"
          />

          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <h3 className="font-semibold mb-4">Expected Savings Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Provider caching (system prompt):</span>
                <span className="font-mono text-emerald-600">~50%</span>
              </div>
              <div className="flex justify-between">
                <span>Compression (user context):</span>
                <span className="font-mono text-emerald-600">~15%</span>
              </div>
              <div className="flex justify-between">
                <span>Smart routing (model selection):</span>
                <span className="font-mono text-emerald-600">~10%</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-emerald-300 dark:border-emerald-700">
                <span>Combined total savings:</span>
                <span className="font-mono text-emerald-600">60-75%</span>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Measuring Results */}
      {/* Visual Cost Comparison */}
      <ScrollReveal direction="up" delay={0.475}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Expected Results</h2>

          <BeforeAfterComparison
            before={{
              value: 2500,
              label: 'Baseline Monthly Cost',
              description: 'Using standard API calls without any optimization',
            }}
            after={{
              value: 750,
              label: 'Optimized Monthly Cost',
              description: 'With caching, compression, and smart routing combined',
            }}
            comparisonType="cost"
            title="50-70% Cost Reduction Achievement"
            visualStyle="bars"
            strategies={[
              {
                name: 'Provider Caching',
                savingsPercent: 50,
                description: 'Anthropic prompt caching on system prompts and knowledge bases',
                color: 'rgb(168, 85, 247)', // purple-500
              },
              {
                name: 'Token Compression',
                savingsPercent: 15,
                description: 'LLMLingua compression for long contexts',
                color: 'rgb(59, 130, 246)', // blue-500
              },
              {
                name: 'Smart Model Routing',
                savingsPercent: 10,
                description: 'Route simple queries to cheaper models',
                color: 'rgb(34, 197, 94)', // green-500
              },
              {
                name: 'Response Caching',
                savingsPercent: 5,
                description: 'Semantic cache for frequently asked questions',
                color: 'rgb(249, 115, 22)', // orange-500
              },
            ]}
          />
        </section>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.5}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold">Measuring Your Results</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Use <code>CostTracker</code> to monitor savings over time:
          </p>

          <CodeBlock
            code={`import { CostTracker } from '@clarity-chat/token-optimization'

const tracker = new CostTracker({
  provider: 'anthropic',
  persistTo: './cost-tracking.json',
})

// Track each request
await tracker.track({
  model: 'claude-3-haiku-20240307',
  inputTokens: 2500,
  outputTokens: 500,
  cached: true,
  cacheReadTokens: 2000,
  metadata: {
    endpoint: '/api/chat',
    user: userId,
  },
})

// Get insights
const report = tracker.getReport({
  period: '30d',
  groupBy: 'day',
})

console.log(\`Total requests: \${report.totalRequests}\`)
console.log(\`Total cost: $\${report.totalCost.toFixed(2)}\`)
console.log(\`Avg cost per request: $\${report.avgCostPerRequest.toFixed(4)}\`)
console.log(\`Estimated savings: \${report.estimatedSavingsPercent}%\`)

// Export for analysis
await tracker.exportCSV('./savings-report.csv')`}
            language="typescript"
          />
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.55}>
        <section className="mb-16">
          <div className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-3">
              <Link
                href="/cookbook/provider-caching-setup"
                className="flex items-center gap-2 text-brand-600 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                Deep dive: Provider Caching Setup
              </Link>
              <Link
                href="/guides/compression-strategies"
                className="flex items-center gap-2 text-brand-600 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                Learn more: Compression Strategies
              </Link>
              <Link
                href="/cookbook/smart-routing"
                className="flex items-center gap-2 text-brand-600 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                Advanced: Smart Model Routing
              </Link>
              <Link
                href="/cookbook/enterprise-pipeline"
                className="flex items-center gap-2 text-brand-600 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                Production: Enterprise Optimization Pipeline
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
