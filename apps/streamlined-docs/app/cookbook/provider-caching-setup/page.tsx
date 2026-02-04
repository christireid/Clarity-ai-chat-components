import { Metadata } from 'next'
import { useState } from 'react'
import { CodeBlock } from '@/components/CodeBlock'
import { ScrollReveal } from '@/components/Enhanced/ScrollReveal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import {
  Database,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Provider Caching Setup | 90% Savings on Cached Tokens',
  description:
    'Achieve up to 90% cost savings on cached tokens with provider-native caching across Anthropic, OpenAI, and Google Gemini. Complete setup guide for implementing prompt caching to reduce AI costs by 50-70% when combined with other strategies.',
  keywords: [
    'provider caching',
    'prompt caching',
    'Anthropic caching',
    'OpenAI caching',
    'Google Gemini caching',
    '90% cost savings',
    'token optimization',
    'cost reduction',
    'AI caching',
    'LLM caching',
  ],
  openGraph: {
    title: 'Provider Caching Setup - 90% Savings on Cached Tokens',
    description:
      'Implement provider-native caching across Anthropic, OpenAI, and Google Gemini for 90% savings on cached tokens. Complete guide with code examples.',
    type: 'article',
    url: '/cookbook/provider-caching-setup',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Provider Caching Setup - 90% Savings',
    description:
      'Complete guide to implementing prompt caching across Anthropic, OpenAI, and Google Gemini for massive cost savings.',
  },
}

'use client'

export default function ProviderCachingSetupPage() {
  const [selectedProvider, setSelectedProvider] = useState<'anthropic' | 'openai' | 'google'>('anthropic')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Database className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Cookbook Recipe
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Provider Caching Setup
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Achieve 90% savings on cached tokens by implementing provider-native caching
            across Anthropic, OpenAI, and Google Gemini.
          </p>
        </div>
      </ScrollReveal>

      {/* Important Warning */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="mb-12 bg-amber-500/10 border border-amber-500/30 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Important: 90% savings applies to cached tokens only
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Your overall cost reduction will be 50-70% baseline when combining provider caching with other
                strategies. The 90% rate applies only to static content like system prompts that meet the
                caching threshold (typically ≥1024 tokens).
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* What You'll Learn */}
      <ScrollReveal direction="up" delay={0.2}>
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
                    <span>How to format messages for Anthropic, OpenAI, and Google caching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Provider-specific requirements and limitations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Monitoring cache hit rates and performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Calculating actual savings from cache usage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>Troubleshooting common caching issues</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Prerequisites */}
      <ScrollReveal direction="up" delay={0.25}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Prerequisites</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <CodeBlock
                code="npm install @clarity-chat/token-optimization"
                language="bash"
              />
            </div>
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">API Keys</h3>
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

      {/* Provider Selection */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Select Your Provider</h2>

          <div className="flex items-center gap-2 mb-6">
            {(['anthropic', 'openai', 'google'] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all capitalize ${
                  selectedProvider === provider
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          {/* Anthropic */}
          {selectedProvider === 'anthropic' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Anthropic Prompt Caching</h3>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50 mb-6">
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-purple-900 dark:text-purple-100">
                    <li>• Minimum 1024 tokens for caching eligibility</li>
                    <li>• Up to 4 cache breakpoints per request</li>
                    <li>• 90% cost reduction on cached tokens ($0.30 vs $3.00 per 1M)</li>
                    <li>• 5-minute cache lifetime</li>
                    <li>• Supports system, user, and assistant messages</li>
                  </ul>
                </div>

                <h4 className="font-semibold mb-3">Step 1: Format Messages for Caching</h4>
                <CodeBlock
                  code={`import { formatForCaching } from '@clarity-chat/token-optimization'

const messages = [
  {
    role: 'system',
    content: \`You are an AI assistant specialized in customer support.

# Product Documentation

\${largeProductDocs} // 3000+ tokens

# Support Guidelines

\${supportGuidelines} // 1500+ tokens

Always be helpful and professional.\`
  },
  {
    role: 'user',
    content: 'How do I reset my password?'
  }
]

// Format with cache markers
const cached = await formatForCaching(messages, {
  provider: 'anthropic',
  minTokens: 1024,
})

console.log(cached.messages)
// System message now has cache_control: { type: 'ephemeral' }`}
                  language="typescript"
                />

                <h4 className="font-semibold mb-3 mt-6">Step 2: Use with Anthropic SDK</h4>
                <CodeBlock
                  code={`import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  messages: cached.messages,
})

// Check cache performance
const usage = response.usage
console.log('Cache read tokens:', usage.cache_read_input_tokens)
console.log('Cache creation tokens:', usage.cache_creation_input_tokens)
console.log('Regular input tokens:', usage.input_tokens)`}
                  language="typescript"
                />

                <h4 className="font-semibold mb-3 mt-6">Step 3: Monitor Cache Hit Rate</h4>
                <CodeBlock
                  code={`function calculateCacheHitRate(responses: any[]) {
  let totalRequests = 0
  let cacheHits = 0
  let cacheMisses = 0

  responses.forEach(response => {
    totalRequests++
    const usage = response.usage

    if (usage.cache_read_input_tokens > 0) {
      cacheHits++
    } else if (usage.cache_creation_input_tokens > 0) {
      cacheMisses++
    }
  })

  const hitRate = (cacheHits / totalRequests) * 100

  return {
    totalRequests,
    cacheHits,
    cacheMisses,
    hitRate: \`\${hitRate.toFixed(1)}%\`,
  }
}

// Usage
const stats = calculateCacheHitRate(allResponses)
console.log(\`Cache hit rate: \${stats.hitRate}\`)
// Target: >80% for optimal savings`}
                  language="typescript"
                />

                <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
                  <h4 className="font-semibold mb-4">💰 Cost Calculation Example</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium mb-2">Scenario: 10,000 requests with 2000-token system prompt</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                        <p className="font-medium text-red-700 dark:text-red-300 mb-2">Without Caching</p>
                        <p className="font-mono text-sm">2000 tokens × $3.00/1M × 10K</p>
                        <p className="font-mono text-xl text-red-600 mt-2">= $60</p>
                      </div>
                      <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                        <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">With Caching (90% hit rate)</p>
                        <p className="font-mono text-sm">2000 × $0.30/1M × 9K (cached)</p>
                        <p className="font-mono text-sm">+ 2000 × $3.00/1M × 1K (miss)</p>
                        <p className="font-mono text-xl text-emerald-600 mt-2">= $11.40</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-emerald-300 dark:border-emerald-700">
                      <p className="font-bold text-lg">
                        Savings: $48.60/mo (81% reduction)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OpenAI */}
          {selectedProvider === 'openai' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">OpenAI Prompt Caching</h3>
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 mb-6">
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-blue-900 dark:text-blue-100">
                    <li>• Minimum 1024 tokens for automatic caching</li>
                    <li>• 50% cost reduction on cached tokens</li>
                    <li>• 5-10 minute cache lifetime (varies by load)</li>
                    <li>• Automatic - no special formatting required</li>
                    <li>• Works with all GPT-4o and GPT-4o-mini models</li>
                  </ul>
                </div>

                <h4 className="font-semibold mb-3">Step 1: Structure Messages for Caching</h4>
                <CodeBlock
                  code={`import { formatForCaching } from '@clarity-chat/token-optimization'

const messages = [
  {
    role: 'system',
    content: \`You are an AI coding assistant.

# Codebase Documentation

\${codebaseDocs} // 3000+ tokens

# Coding Standards

\${codingStandards} // 1500+ tokens\`
  },
  {
    role: 'user',
    content: 'How do I implement authentication?'
  }
]

// Format for OpenAI caching (automatic)
const cached = await formatForCaching(messages, {
  provider: 'openai',
  minTokens: 1024,
})

console.log('Formatted for OpenAI caching')`}
                  language="typescript"
                />

                <h4 className="font-semibold mb-3 mt-6">Step 2: Use with OpenAI SDK</h4>
                <CodeBlock
                  code={`import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: cached.messages,
})

// Check cache performance
const usage = response.usage
console.log('Prompt tokens:', usage.prompt_tokens)
console.log('Cached tokens:', usage.prompt_tokens_details?.cached_tokens || 0)

// Calculate savings
const cachedTokens = usage.prompt_tokens_details?.cached_tokens || 0
const regularTokens = usage.prompt_tokens - cachedTokens
const savings = (cachedTokens / usage.prompt_tokens) * 100
console.log(\`Cache usage: \${savings.toFixed(1)}%\`)`}
                  language="typescript"
                />

                <h4 className="font-semibold mb-3 mt-6">Step 3: Verify Caching is Working</h4>
                <CodeBlock
                  code={`async function verifyCaching() {
  const messages = [
    {
      role: 'system',
      content: largeSystemPrompt // 2000+ tokens
    },
    {
      role: 'user',
      content: 'Test query 1'
    }
  ]

  // First request - cache miss
  const response1 = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
  })

  console.log('First request cached tokens:',
    response1.usage.prompt_tokens_details?.cached_tokens || 0)
  // Should be 0 (cache miss)

  // Wait a moment
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Second request - cache hit
  messages[1].content = 'Test query 2' // Different user query
  const response2 = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
  })

  console.log('Second request cached tokens:',
    response2.usage.prompt_tokens_details?.cached_tokens || 0)
  // Should be >0 (cache hit on system prompt)

  return {
    firstRequest: response1.usage.prompt_tokens_details?.cached_tokens || 0,
    secondRequest: response2.usage.prompt_tokens_details?.cached_tokens || 0,
    cacheWorking: (response2.usage.prompt_tokens_details?.cached_tokens || 0) > 0,
  }
}`}
                  language="typescript"
                />

                <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/50">
                  <h4 className="font-semibold mb-4">💡 OpenAI Caching Tips</h4>
                  <ul className="text-sm space-y-2 text-blue-900 dark:text-blue-100">
                    <li>• Place cacheable content (system prompts, docs) at the START of messages</li>
                    <li>• Keep system prompts consistent across requests</li>
                    <li>• Minimum 1024 tokens required for caching</li>
                    <li>• Only 50% discount (vs Anthropic's 90%), but still significant</li>
                    <li>• Cache expires after 5-10 minutes of inactivity</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Google */}
          {selectedProvider === 'google' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Google Gemini Context Caching</h3>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 mb-6">
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="text-sm space-y-1 text-green-900 dark:text-green-100">
                    <li>• Minimum 32,768 tokens for caching (much higher threshold)</li>
                    <li>• 75% cost reduction on cached tokens</li>
                    <li>• 1-hour cache lifetime (longer than others)</li>
                    <li>• Supports very large contexts (up to 1M tokens)</li>
                    <li>• Best for document-heavy applications</li>
                  </ul>
                </div>

                <h4 className="font-semibold mb-3">Step 1: Format Large Context for Caching</h4>
                <CodeBlock
                  code={`import { formatForCaching } from '@clarity-chat/token-optimization'

const messages = [
  {
    role: 'system',
    content: \`You are an AI document analyst.

# Complete Documentation Library

\${massiveDocumentation} // 50,000+ tokens

# Analysis Guidelines

\${analysisGuidelines} // 10,000+ tokens\`
  },
  {
    role: 'user',
    content: 'Summarize section 5'
  }
]

// Format for Gemini caching (requires 32K+ tokens)
const cached = await formatForCaching(messages, {
  provider: 'google',
  minTokens: 32768, // Google's higher threshold
})

if (!cached.eligible) {
  console.warn('Content too small for Gemini caching (need 32K+ tokens)')
}`}
                  language="typescript"
                />

                <h4 className="font-semibold mb-3 mt-6">Step 2: Use with Google AI SDK</h4>
                <CodeBlock
                  code={`import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

// Create model with caching
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: cached.messages[0].content,
  cachedContent: {
    model: 'gemini-2.0-flash',
    systemInstruction: cached.messages[0].content,
    ttl: 3600, // 1 hour
  },
})

const result = await model.generateContent(
  cached.messages[1].content
)

const response = result.response
console.log(response.text())`}
                  language="typescript"
                />

                <h4 className="font-semibold mb-3 mt-6">Step 3: Monitor Cache Usage</h4>
                <CodeBlock
                  code={`async function monitorGeminiCache() {
  const stats = {
    totalRequests: 0,
    cachedRequests: 0,
    totalCost: 0,
    cachedCost: 0,
  }

  // Track over multiple requests
  for (let i = 0; i < 100; i++) {
    const result = await model.generateContent(\`Query \${i}\`)

    stats.totalRequests++

    // Gemini doesn't expose cache metrics directly
    // Estimate based on first request creating cache
    if (i === 0) {
      stats.totalCost += 0.50 // Cache creation
    } else {
      stats.cachedRequests++
      stats.cachedCost += 0.125 // Cached read (75% off)
      stats.totalCost += 0.125
    }
  }

  const savings = ((1 - stats.totalCost / (stats.totalRequests * 0.50)) * 100)

  return {
    ...stats,
    savingsPercent: \`\${savings.toFixed(1)}%\`,
  }
}`}
                  language="typescript"
                />

                <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50">
                  <h4 className="font-semibold mb-4">📊 When to Use Gemini Caching</h4>
                  <div className="space-y-3 text-sm text-green-900 dark:text-green-100">
                    <p><strong>Best for:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Very large document analysis (50K+ tokens)</li>
                      <li>Long-lived caches (1-hour lifetime)</li>
                      <li>Multi-turn conversations with heavy context</li>
                      <li>Codebase analysis with full repository context</li>
                    </ul>
                    <p className="mt-3"><strong>Not ideal for:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Small prompts (&lt;32K tokens - won&apos;t cache)</li>
                      <li>Frequently changing context</li>
                      <li>Short-burst request patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Troubleshooting */}
      <ScrollReveal direction="up" delay={0.35}>
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Troubleshooting Common Issues</h2>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">❌ Cache Not Working</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>Symptoms:</strong> No cached tokens reported in usage stats
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside ml-2 space-y-1">
                <li>Verify content meets minimum token threshold (1024 for Anthropic/OpenAI, 32K for Google)</li>
                <li>Ensure system prompt is identical across requests</li>
                <li>Check that cache hasn't expired (5min for Anthropic/OpenAI, 1hr for Google)</li>
                <li>Confirm you're using a cache-compatible model version</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">📉 Low Cache Hit Rate (&lt;50%)</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>Symptoms:</strong> Fewer cache hits than expected
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside ml-2 space-y-1">
                <li>Increase request frequency (caches expire quickly)</li>
                <li>Batch requests during peak hours</li>
                <li>Use consistent system prompts (don't vary them per request)</li>
                <li>Consider warming the cache before high-traffic periods</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-white/60 dark:bg-white/[0.02] border border-neutral-200/60 dark:border-white/[0.06]">
              <h3 className="font-semibold mb-2">💸 Higher Costs Than Expected</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>Symptoms:</strong> Bills don't reflect expected savings
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                <strong>Solutions:</strong>
              </p>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 list-disc list-inside ml-2 space-y-1">
                <li>Remember: 90% savings is on CACHED tokens only, not overall cost</li>
                <li>Calculate realistic savings: (cached_tokens / total_tokens) × 0.9</li>
                <li>Combine with compression and routing for 50-70% overall reduction</li>
                <li>Monitor cache_creation costs (first request pays full price)</li>
              </ul>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.4}>
        <section className="mb-16">
          <div className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-3">
              <Link
                href="/cookbook/achieving-50-percent-reduction"
                className="flex items-center gap-2 text-brand-600 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                Combine with compression and routing
              </Link>
              <Link
                href="/guides/token-optimization"
                className="flex items-center gap-2 text-brand-600 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                Full Token Optimization Guide
              </Link>
              <Link
                href="/reference/functions/format-for-caching"
                className="flex items-center gap-2 text-brand-600 hover:underline"
              >
                <ArrowRight className="w-4 h-4" />
                API Reference: formatForCaching()
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
