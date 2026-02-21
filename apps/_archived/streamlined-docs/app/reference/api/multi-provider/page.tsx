'use client'

/**
 * Multi-Provider API Reference
 *
 * Complete guide to multi-provider optimization strategies including:
 * - Primary/fallback patterns
 * - Cost-based routing
 * - Provider-specific optimizations
 * - Cross-provider cost comparison
 * - Production deployment
 */

import { useState } from 'react'
import { CodeBlock } from '@/components/CodeBlock'
import { ScrollReveal } from '@/components/Enhanced/ScrollReveal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import {
  Zap,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  DollarSign,
  GitBranch,
  BarChart3,
  Shield,
  Rocket,
  Settings,
  RefreshCw,
  Target,
} from 'lucide-react'
import Link from 'next/link'

type ProviderStrategy = 'primary-fallback' | 'cost-routing' | 'load-balancing' | 'quality-based'

export default function MultiProviderAPIReference() {
  const [activeStrategy, setActiveStrategy] = useState<ProviderStrategy>('primary-fallback')
  const [activeProvider, setActiveProvider] = useState<'anthropic' | 'openai' | 'google'>('anthropic')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full mb-6 shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider">
              50-70% Savings
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Layers className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              API Reference
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Multi-Provider Optimization
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Optimize across Anthropic, OpenAI, and Google providers for maximum 50-70% cost savings
            through intelligent routing, provider-specific caching, and unified optimization strategies.
          </p>

          {/* Token Optimization Badge */}
          <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
              Token Optimization System
            </span>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Stats */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">50-70%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Savings</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/50">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">3+</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Providers</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">99.9%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Uptime</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">&lt;50ms</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Route Latency</div>
          </div>
        </div>
      </ScrollReveal>

      {/* Important Note */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50 p-6 rounded-lg">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Multi-Provider Strategy: Achieve 50-70% Baseline Savings
              </p>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Combine provider caching (90% on cached tokens), compression (15-25%), smart routing (10-15%),
                and cross-provider optimization to maximize cost efficiency while maintaining quality and reliability.
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Table of Contents */}
      <ScrollReveal direction="up" delay={0.25}>
        <section className="mb-16">
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm border border-neutral-200/60 dark:border-white/[0.06]">
            <h2 className="text-xl font-bold mb-4">On This Page</h2>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <a href="#patterns" className="text-brand-600 hover:underline flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Multi-Provider Patterns
              </a>
              <a href="#provider-optimization" className="text-brand-600 hover:underline flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Provider-Specific Optimization
              </a>
              <a href="#cost-comparison" className="text-brand-600 hover:underline flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Cross-Provider Cost Comparison
              </a>
              <a href="#unified-config" className="text-brand-600 hover:underline flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Unified Configuration
              </a>
              <a href="#selection-strategies" className="text-brand-600 hover:underline flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Provider Selection Strategies
              </a>
              <a href="#production" className="text-brand-600 hover:underline flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Production Deployment
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Multi-Provider Patterns */}
      <ScrollReveal direction="up" delay={0.3}>
        <section id="patterns" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-brand-500" />
            Multi-Provider Patterns
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Choose the right multi-provider strategy for your use case to maximize cost savings,
            reliability, and quality.
          </p>

          {/* Strategy Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            {[
              { id: 'primary-fallback', label: 'Primary/Fallback', icon: Shield },
              { id: 'cost-routing', label: 'Cost-Based Routing', icon: DollarSign },
              { id: 'load-balancing', label: 'Load Balancing', icon: RefreshCw },
              { id: 'quality-based', label: 'Quality-Based', icon: Target },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveStrategy(id as ProviderStrategy)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeStrategy === id
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Primary/Fallback Pattern */}
          {activeStrategy === 'primary-fallback' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                <h3 className="font-semibold mb-2">Use Case</h3>
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  High reliability with automatic failover. Use primary provider for best quality,
                  fallback to secondary if primary fails or is rate-limited.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  language="typescript"
                  code={`import { MultiProviderClient, ProviderConfig } from '@clarity-chat/token-optimization'

// Configure providers with fallback chain
const config: ProviderConfig = {
  providers: [
    {
      name: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      priority: 1, // Primary provider
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
      caching: {
        enabled: true,
        minTokens: 1024,
      },
    },
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      priority: 2, // Fallback provider
      models: ['gpt-4o', 'gpt-4o-mini'],
      caching: {
        enabled: true,
        minTokens: 1024,
      },
    },
    {
      name: 'google',
      apiKey: process.env.GOOGLE_API_KEY,
      priority: 3, // Secondary fallback
      models: ['gemini-2.0-flash', 'gemini-1.5-pro'],
      caching: {
        enabled: true,
        minTokens: 32768,
      },
    },
  ],
  strategy: 'primary-fallback',
  timeout: 30000, // 30s timeout before fallback
  retries: 2, // Retry primary before falling back
}

const client = new MultiProviderClient(config)

// Automatic failover on errors
async function chat(messages: Message[]) {
  try {
    // Tries Anthropic first
    const response = await client.chat({
      messages,
      model: 'auto', // Auto-selects from available models
    })

    console.log(\`Provider used: \${response.provider}\`) // 'anthropic', 'openai', or 'google'
    console.log(\`Model: \${response.model}\`)
    console.log(\`Cost: $\${response.cost}\`)
    console.log(\`Cached tokens: \${response.usage.cached}\`)

    return response
  } catch (error) {
    // All providers failed
    console.error('All providers failed:', error)
    throw error
  }
}`}
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Benefits
                </h4>
                <ul className="text-sm space-y-1 text-emerald-800 dark:text-emerald-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>99.9% uptime through automatic failover</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Consistent quality by prioritizing best provider</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Rate limit protection across providers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Simple configuration and operation</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Cost-Based Routing */}
          {activeStrategy === 'cost-routing' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                <h3 className="font-semibold mb-2">Use Case</h3>
                <p className="text-sm text-emerald-900 dark:text-emerald-100">
                  Minimize costs by routing each request to the most cost-effective provider
                  that meets quality requirements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  language="typescript"
                  code={`import { MultiProviderClient, CostRouter } from '@clarity-chat/token-optimization'

const config = {
  providers: [
    {
      name: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: [
        { name: 'claude-3-haiku-20240307', cost: { input: 0.25, output: 1.25 } },
        { name: 'claude-3-5-sonnet-20241022', cost: { input: 3.0, output: 15.0 } },
        { name: 'claude-opus-3-20240229', cost: { input: 15.0, output: 75.0 } },
      ],
    },
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      models: [
        { name: 'gpt-4o-mini', cost: { input: 0.15, output: 0.6 } },
        { name: 'gpt-4o', cost: { input: 2.5, output: 10.0 } },
      ],
    },
    {
      name: 'google',
      apiKey: process.env.GOOGLE_API_KEY,
      models: [
        { name: 'gemini-2.0-flash', cost: { input: 0.075, output: 0.3 } },
        { name: 'gemini-1.5-pro', cost: { input: 1.25, output: 5.0 } },
      ],
    },
  ],
  strategy: 'cost-optimized',
  routing: {
    // Define complexity levels and acceptable providers
    complexityLevels: {
      simple: {
        providers: ['google', 'openai', 'anthropic'],
        maxCostPerMToken: 0.5, // $0.50 per million tokens
        models: ['gemini-2.0-flash', 'gpt-4o-mini', 'claude-3-haiku-20240307'],
      },
      moderate: {
        providers: ['openai', 'anthropic'],
        maxCostPerMToken: 3.0,
        models: ['gpt-4o', 'claude-3-5-sonnet-20241022'],
      },
      complex: {
        providers: ['anthropic'],
        maxCostPerMToken: 15.0,
        models: ['claude-opus-3-20240229'],
      },
    },
  },
}

const client = new MultiProviderClient(config)

// Route based on cost and complexity
async function chat(messages: Message[], complexity: 'simple' | 'moderate' | 'complex') {
  const response = await client.chat({
    messages,
    complexity, // Automatically routes to cheapest suitable provider
  })

  return {
    provider: response.provider,
    model: response.model,
    cost: response.cost,
    savings: response.savingsVsDefault, // Compare vs using Sonnet for everything
  }
}

// Examples
await chat([{ role: 'user', content: 'What are your hours?' }], 'simple')
// → Google Gemini Flash ($0.075/M tokens) = 95% savings vs Sonnet

await chat([{ role: 'user', content: 'Explain OAuth 2.0 flows' }], 'moderate')
// → OpenAI GPT-4o ($2.50/M tokens) = 17% savings vs Sonnet

await chat([{ role: 'user', content: 'Design a fraud detection system' }], 'complex')
// → Anthropic Opus ($15/M tokens) = best quality for critical task`}
                />
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <h4 className="font-semibold mb-4">💰 Cost Savings Example (10K requests/month)</h4>
                <div className="space-y-3 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                      <p className="font-medium text-red-700 dark:text-red-300 mb-2">Single Provider (Sonnet)</p>
                      <p className="font-mono text-sm">10K × $0.003 avg</p>
                      <p className="font-mono text-xl text-red-600 mt-2">= $30/mo</p>
                    </div>
                    <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                      <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-2">Cost-Based Routing</p>
                      <p className="font-mono text-sm">6K simple × $0.0001</p>
                      <p className="font-mono text-sm">3K moderate × $0.0025</p>
                      <p className="font-mono text-sm">1K complex × $0.015</p>
                      <p className="font-mono text-xl text-emerald-600 mt-2">= $8.10/mo</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-emerald-300 dark:border-emerald-700">
                    <p className="font-bold text-lg">
                      Savings: $21.90/mo (73% reduction)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Load Balancing */}
          {activeStrategy === 'load-balancing' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
                <h3 className="font-semibold mb-2">Use Case</h3>
                <p className="text-sm text-purple-900 dark:text-purple-100">
                  Distribute requests across providers to avoid rate limits, optimize latency,
                  and maximize throughput during high traffic.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  language="typescript"
                  code={`import { MultiProviderClient, LoadBalancer } from '@clarity-chat/token-optimization'

const config = {
  providers: [
    {
      name: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      rateLimit: { requestsPerMinute: 50, tokensPerMinute: 100000 },
      weight: 40, // 40% of traffic
    },
    {
      name: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      rateLimit: { requestsPerMinute: 500, tokensPerMinute: 200000 },
      weight: 40, // 40% of traffic
    },
    {
      name: 'google',
      apiKey: process.env.GOOGLE_API_KEY,
      rateLimit: { requestsPerMinute: 60, tokensPerMinute: 4000000 },
      weight: 20, // 20% of traffic
    },
  ],
  strategy: 'load-balanced',
  balancing: {
    algorithm: 'weighted-round-robin', // or 'least-latency', 'least-loaded'
    healthCheck: {
      enabled: true,
      intervalMs: 30000,
    },
    stickySessions: false, // Set true to keep user on same provider
  },
}

const client = new MultiProviderClient(config)

// Automatic load distribution
async function handleBurst(requests: Message[][]) {
  const responses = await Promise.all(
    requests.map(messages => client.chat({ messages }))
  )

  // Analyze distribution
  const distribution = responses.reduce((acc, r) => {
    acc[r.provider] = (acc[r.provider] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('Request distribution:', distribution)
  // { anthropic: 40, openai: 40, google: 20 }

  return responses
}

// Monitor provider health
client.on('health-check', (results) => {
  results.forEach(({ provider, healthy, latency, error }) => {
    if (!healthy) {
      console.warn(\`Provider \${provider} unhealthy: \${error}\`)
      // Automatically reduces traffic to unhealthy provider
    }
  })
})`}
                />
              </div>

              <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">
                  Load Balancing Algorithms
                </h4>
                <div className="text-sm space-y-2 text-brand-800 dark:text-brand-200">
                  <p><strong>weighted-round-robin:</strong> Distribute by configured weights</p>
                  <p><strong>least-latency:</strong> Route to fastest responding provider</p>
                  <p><strong>least-loaded:</strong> Route to provider with most capacity</p>
                  <p><strong>random:</strong> Random distribution (simplest)</p>
                </div>
              </div>
            </div>
          )}

          {/* Quality-Based Routing */}
          {activeStrategy === 'quality-based' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                <h3 className="font-semibold mb-2">Use Case</h3>
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  Route based on quality metrics and user feedback. Use best provider for each
                  task type based on historical performance.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Implementation</h3>
                <CodeBlock
                  language="typescript"
                  code={`import { MultiProviderClient, QualityRouter } from '@clarity-chat/token-optimization'

const config = {
  providers: ['anthropic', 'openai', 'google'],
  strategy: 'quality-optimized',
  quality: {
    // Define task types and track quality metrics
    taskTypes: {
      coding: {
        metric: 'accuracy',
        minScore: 0.85,
        providerScores: {
          anthropic: 0.94, // Best for coding
          openai: 0.89,
          google: 0.82,
        },
      },
      creative: {
        metric: 'creativity',
        minScore: 0.80,
        providerScores: {
          anthropic: 0.91,
          openai: 0.93, // Best for creative
          google: 0.84,
        },
      },
      analysis: {
        metric: 'depth',
        minScore: 0.90,
        providerScores: {
          anthropic: 0.96, // Best for analysis
          openai: 0.88,
          google: 0.85,
        },
      },
    },
    // Continuously update scores based on user feedback
    learningEnabled: true,
  },
}

const client = new MultiProviderClient(config)

// Route based on task type and quality
async function chat(
  messages: Message[],
  taskType: 'coding' | 'creative' | 'analysis'
) {
  const response = await client.chat({
    messages,
    taskType, // Automatically routes to best provider for task
  })

  // Track quality for continuous improvement
  await client.recordFeedback({
    requestId: response.id,
    qualityScore: getUserRating(), // 0-1 from user thumbs up/down
    taskType,
  })

  return response
}

// Monitor quality trends
const qualityReport = await client.getQualityMetrics({
  period: 'last_30_days',
})

console.log('Quality by provider:')
qualityReport.providers.forEach(({ name, tasks }) => {
  console.log(\`\${name}:\`)
  tasks.forEach(({ type, score }) => {
    console.log(\`  \${type}: \${score}\`)
  })
})`}
                />
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Quality Metrics
                </h4>
                <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                  <li><strong>Accuracy:</strong> Factual correctness (coding, math, analysis)</li>
                  <li><strong>Creativity:</strong> Novel ideas (writing, brainstorming)</li>
                  <li><strong>Depth:</strong> Comprehensive coverage (research, explanations)</li>
                  <li><strong>Coherence:</strong> Logical flow (conversations, narratives)</li>
                  <li><strong>User satisfaction:</strong> Thumbs up/down feedback</li>
                </ul>
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Provider-Specific Optimization */}
      <ScrollReveal direction="up" delay={0.35}>
        <section id="provider-optimization" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-500" />
            Provider-Specific Optimization
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Each provider has unique optimization features. Leverage them all for maximum savings.
          </p>

          {/* Provider Tabs */}
          <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-2">
            {(['anthropic', 'openai', 'google'] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => setActiveProvider(provider)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeProvider === provider
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          {/* Anthropic Optimizations */}
          {activeProvider === 'anthropic' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
                <h3 className="font-semibold mb-2">Anthropic Prompt Caching</h3>
                <p className="text-sm text-purple-900 dark:text-purple-100 mb-2">
                  90% cost reduction on cached tokens. Best for static system prompts.
                </p>
                <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                  <li>• Minimum 1024 tokens required</li>
                  <li>• Up to 4 cache breakpoints per request</li>
                  <li>• 5-minute cache lifetime</li>
                  <li>• $0.30/M cached vs $3.00/M regular</li>
                </ul>
              </div>

              <CodeBlock
                language="typescript"
                code={`import { AnthropicProvider } from '@clarity-chat/token-optimization'

const anthropic = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY,
  caching: {
    enabled: true,
    minTokens: 1024,
    strategy: 'aggressive', // Cache everything possible
  },
})

// Format messages for caching
const response = await anthropic.chat({
  model: 'claude-3-5-sonnet-20241022',
  messages: [
    {
      role: 'system',
      content: largeSystemPrompt, // 2000+ tokens
      // Automatically tagged with cache_control: { type: 'ephemeral' }
    },
    {
      role: 'user',
      content: userQuery,
    },
  ],
})

// Check cache performance
console.log('Cache stats:', {
  cacheCreationTokens: response.usage.cache_creation_input_tokens,
  cacheReadTokens: response.usage.cache_read_input_tokens,
  regularTokens: response.usage.input_tokens,
  savings: response.cost.savings, // $ saved vs non-cached
})

// Expected output:
// {
//   cacheCreationTokens: 2000,  // First request
//   cacheReadTokens: 0,
//   regularTokens: 50,
//   savings: 0
// }
//
// Subsequent requests:
// {
//   cacheCreationTokens: 0,
//   cacheReadTokens: 2000,       // 90% discount!
//   regularTokens: 50,
//   savings: 0.0054             // $0.0054 saved per request
// }`}
              />

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Best Practices
                </h4>
                <ul className="text-sm space-y-1 text-emerald-800 dark:text-emerald-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Place cacheable content at the end of system message</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Keep system prompts identical across requests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Use multiple cache breakpoints for large contexts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Monitor cache hit rate (target &gt;80%)</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* OpenAI Optimizations */}
          {activeProvider === 'openai' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                <h3 className="font-semibold mb-2">OpenAI Batching & Caching</h3>
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                  50% off batched requests + 50% off cached tokens.
                </p>
                <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
                  <li>• Batch API: 50% cost reduction, 24h completion</li>
                  <li>• Prompt caching: Automatic, 1024+ tokens</li>
                  <li>• Combine both for 75% total savings</li>
                </ul>
              </div>

              <CodeBlock
                language="typescript"
                code={`import { OpenAIProvider } from '@clarity-chat/token-optimization'

const openai = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  batching: {
    enabled: true,
    maxBatchSize: 50000, // Max 50K requests per batch
    maxWaitTime: 60000,  // Wait up to 1 minute before submitting
  },
  caching: {
    enabled: true,
    minTokens: 1024,
  },
})

// Batch multiple requests
const batchId = await openai.batch.create([
  {
    custom_id: 'request-1',
    method: 'POST',
    url: '/v1/chat/completions',
    body: {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Query 1' },
      ],
    },
  },
  {
    custom_id: 'request-2',
    method: 'POST',
    url: '/v1/chat/completions',
    body: {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt }, // Same prompt = cached
        { role: 'user', content: 'Query 2' },
      ],
    },
  },
  // ... up to 50,000 requests
])

// Check batch status
const status = await openai.batch.retrieve(batchId)
console.log('Batch status:', status.status) // 'validating', 'in_progress', 'completed'

// Retrieve results when complete
if (status.status === 'completed') {
  const results = await openai.batch.results(batchId)

  console.log('Batch savings:', {
    totalRequests: results.length,
    batchDiscount: '50%',
    cacheDiscount: '50% (on cached tokens)',
    totalSavings: results.reduce((sum, r) => sum + r.cost.savings, 0),
  })
}

// For real-time requests with caching
const response = await openai.chat({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: systemPrompt }, // Cached automatically
    { role: 'user', content: 'Real-time query' },
  ],
})

console.log('Cache usage:', response.usage.prompt_tokens_details?.cached_tokens || 0)`}
              />

              <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  When to Use Batching
                </h4>
                <div className="text-sm space-y-2 text-blue-800 dark:text-blue-200">
                  <p><strong>Good for:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Data processing pipelines</li>
                    <li>Bulk content generation</li>
                    <li>Batch analytics</li>
                    <li>Non-time-sensitive workflows</li>
                  </ul>
                  <p className="mt-2"><strong>Not for:</strong></p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>Real-time chat</li>
                    <li>Interactive applications</li>
                    <li>Time-sensitive requests</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Google Optimizations */}
          {activeProvider === 'google' && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50">
                <h3 className="font-semibold mb-2">Google Context Caching</h3>
                <p className="text-sm text-green-900 dark:text-green-100 mb-2">
                  75% cost reduction on cached tokens. Best for very large contexts.
                </p>
                <ul className="text-sm space-y-1 text-green-800 dark:text-green-200">
                  <li>• Minimum 32,768 tokens (much higher threshold)</li>
                  <li>• 1-hour cache lifetime (longest)</li>
                  <li>• Supports up to 1M token contexts</li>
                  <li>• Perfect for document analysis</li>
                </ul>
              </div>

              <CodeBlock
                language="typescript"
                code={`import { GoogleProvider } from '@clarity-chat/token-optimization'

const google = new GoogleProvider({
  apiKey: process.env.GOOGLE_API_KEY,
  caching: {
    enabled: true,
    minTokens: 32768, // Much higher than Anthropic/OpenAI
    ttl: 3600, // 1 hour
  },
})

// Cache large document context
const cachedContent = await google.cacheContent({
  model: 'gemini-2.0-flash',
  systemInstruction: \`You are a document analyzer.

# Complete Documentation
\${massiveDocumentation} // 100K+ tokens

# Analysis Guidelines
\${guidelines}
\`,
  ttl: 3600,
})

console.log('Cached content ID:', cachedContent.name)

// Use cached content across multiple queries
const responses = await Promise.all([
  google.chat({
    model: 'gemini-2.0-flash',
    cachedContent: cachedContent.name,
    messages: [{ role: 'user', content: 'Summarize section 1' }],
  }),
  google.chat({
    model: 'gemini-2.0-flash',
    cachedContent: cachedContent.name,
    messages: [{ role: 'user', content: 'Summarize section 2' }],
  }),
  // Each query gets 75% discount on 100K cached tokens!
])

// Calculate savings
const totalCachedTokens = responses.length * 100000
const regularCost = totalCachedTokens * 0.075 / 1000000 // $0.075/M
const cachedCost = totalCachedTokens * 0.01875 / 1000000 // 75% off
const savings = regularCost - cachedCost

console.log('Savings:', {
  regularCost: \`$\${regularCost.toFixed(2)}\`,
  cachedCost: \`$\${cachedCost.toFixed(2)}\`,
  saved: \`$\${savings.toFixed(2)}\`,
  percentSaved: '75%',
})`}
              />

              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Ideal Use Cases
                </h4>
                <ul className="text-sm space-y-1 text-green-800 dark:text-green-200">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Large document Q&A (50K+ token documents)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Codebase analysis (entire repository context)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Long-lived chat sessions (1-hour cache)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Multi-turn analysis with heavy context</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* Cross-Provider Cost Comparison */}
      <ScrollReveal direction="up" delay={0.4}>
        <section id="cost-comparison" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-brand-500" />
            Cross-Provider Cost Comparison
          </h2>

          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                    <th className="text-left p-3 font-semibold">Provider</th>
                    <th className="text-left p-3 font-semibold">Model</th>
                    <th className="text-right p-3 font-semibold">Input ($/M)</th>
                    <th className="text-right p-3 font-semibold">Output ($/M)</th>
                    <th className="text-right p-3 font-semibold">Cached ($/M)</th>
                    <th className="text-left p-3 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  <tr className="bg-purple-50 dark:bg-purple-950/10">
                    <td className="p-3 font-medium">Anthropic</td>
                    <td className="p-3">Claude 3 Haiku</td>
                    <td className="text-right p-3">$0.25</td>
                    <td className="text-right p-3">$1.25</td>
                    <td className="text-right p-3 text-emerald-600">$0.03</td>
                    <td className="p-3">Fast, cheap queries</td>
                  </tr>
                  <tr className="bg-purple-50 dark:bg-purple-950/10">
                    <td className="p-3 font-medium">Anthropic</td>
                    <td className="p-3">Claude 3.5 Sonnet</td>
                    <td className="text-right p-3">$3.00</td>
                    <td className="text-right p-3">$15.00</td>
                    <td className="text-right p-3 text-emerald-600">$0.30</td>
                    <td className="p-3">Balanced quality/cost</td>
                  </tr>
                  <tr className="bg-purple-50 dark:bg-purple-950/10">
                    <td className="p-3 font-medium">Anthropic</td>
                    <td className="p-3">Claude Opus 3</td>
                    <td className="text-right p-3">$15.00</td>
                    <td className="text-right p-3">$75.00</td>
                    <td className="text-right p-3 text-emerald-600">$1.50</td>
                    <td className="p-3">Complex reasoning</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-950/10">
                    <td className="p-3 font-medium">OpenAI</td>
                    <td className="p-3">GPT-4o Mini</td>
                    <td className="text-right p-3">$0.15</td>
                    <td className="text-right p-3">$0.60</td>
                    <td className="text-right p-3 text-emerald-600">$0.075</td>
                    <td className="p-3">Budget-friendly</td>
                  </tr>
                  <tr className="bg-blue-50 dark:bg-blue-950/10">
                    <td className="p-3 font-medium">OpenAI</td>
                    <td className="p-3">GPT-4o</td>
                    <td className="text-right p-3">$2.50</td>
                    <td className="text-right p-3">$10.00</td>
                    <td className="text-right p-3 text-emerald-600">$1.25</td>
                    <td className="p-3">General purpose</td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-950/10">
                    <td className="p-3 font-medium">Google</td>
                    <td className="p-3">Gemini 2.0 Flash</td>
                    <td className="text-right p-3">$0.075</td>
                    <td className="text-right p-3">$0.30</td>
                    <td className="text-right p-3 text-emerald-600">$0.02</td>
                    <td className="p-3">Cheapest option</td>
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-950/10">
                    <td className="p-3 font-medium">Google</td>
                    <td className="p-3">Gemini 1.5 Pro</td>
                    <td className="text-right p-3">$1.25</td>
                    <td className="text-right p-3">$5.00</td>
                    <td className="text-right p-3 text-emerald-600">$0.31</td>
                    <td className="p-3">Large contexts</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CodeBlock
              language="typescript"
              code={`import { CostComparator } from '@clarity-chat/token-optimization'

// Compare costs across providers for a specific workload
const comparator = new CostComparator({
  providers: ['anthropic', 'openai', 'google'],
  workload: {
    requestsPerDay: 1000,
    avgInputTokens: 1500,
    avgOutputTokens: 500,
    cachingEnabled: true,
    cacheHitRate: 0.85, // 85% cache hits
  },
})

const analysis = await comparator.analyze()

console.log('Monthly cost comparison:')
analysis.providers.forEach(({ name, model, cost, savings }) => {
  console.log(\`\${name} (\${model}): $\${cost}/mo (save $\${savings} vs baseline)\`)
})

// Output:
// google (gemini-2.0-flash): $3.15/mo (save $177 vs baseline)
// openai (gpt-4o-mini): $4.50/mo (save $176 vs baseline)
// anthropic (claude-3-haiku): $6.30/mo (save $174 vs baseline)
// openai (gpt-4o): $67.50/mo (save $113 vs baseline)
// anthropic (claude-3-5-sonnet): $81.00/mo (save $99 vs baseline)
// anthropic (claude-opus-3): $405.00/mo (baseline)

// Recommendations
console.log('Recommended configuration:')
console.log(analysis.recommendation)
// {
//   primary: { provider: 'google', model: 'gemini-2.0-flash', usage: 60% },
//   secondary: { provider: 'openai', model: 'gpt-4o-mini', usage: 30% },
//   premium: { provider: 'anthropic', model: 'claude-3-5-sonnet', usage: 10% },
//   monthlyCost: $12.45,
//   savings: 93%,
// }`}
            />
          </div>
        </section>
      </ScrollReveal>

      {/* Unified Configuration */}
      <ScrollReveal direction="up" delay={0.45}>
        <section id="unified-config" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-500" />
            Unified Optimization Configuration
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Configure all providers and optimization strategies in one place.
          </p>

          <CodeBlock
            language="typescript"
            code={`import { MultiProviderOptimizer } from '@clarity-chat/token-optimization'

// Comprehensive configuration
const optimizer = new MultiProviderOptimizer({
  // Provider configuration
  providers: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
      caching: {
        enabled: true,
        minTokens: 1024,
        strategy: 'aggressive',
      },
      rateLimit: {
        requestsPerMinute: 50,
        tokensPerMinute: 100000,
      },
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      models: ['gpt-4o', 'gpt-4o-mini'],
      caching: {
        enabled: true,
        minTokens: 1024,
      },
      batching: {
        enabled: true,
        maxBatchSize: 50000,
        maxWaitTime: 60000,
      },
      rateLimit: {
        requestsPerMinute: 500,
        tokensPerMinute: 200000,
      },
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY,
      models: ['gemini-2.0-flash', 'gemini-1.5-pro'],
      caching: {
        enabled: true,
        minTokens: 32768,
        ttl: 3600,
      },
      rateLimit: {
        requestsPerMinute: 60,
        tokensPerMinute: 4000000,
      },
    },
  },

  // Routing strategy
  routing: {
    strategy: 'hybrid', // primary-fallback, cost-optimized, load-balanced, quality-based, hybrid

    // Primary/fallback configuration
    fallback: {
      primary: 'anthropic',
      secondary: 'openai',
      tertiary: 'google',
      timeout: 30000,
      retries: 2,
    },

    // Cost-based routing
    costOptimization: {
      enabled: true,
      complexityLevels: {
        simple: {
          maxCostPerMToken: 0.5,
          providers: ['google', 'openai'],
        },
        moderate: {
          maxCostPerMToken: 3.0,
          providers: ['openai', 'anthropic'],
        },
        complex: {
          maxCostPerMToken: 15.0,
          providers: ['anthropic'],
        },
      },
    },

    // Load balancing
    loadBalancing: {
      enabled: true,
      algorithm: 'weighted-round-robin',
      weights: {
        anthropic: 40,
        openai: 40,
        google: 20,
      },
      healthCheck: {
        enabled: true,
        intervalMs: 30000,
      },
    },

    // Quality-based routing
    qualityOptimization: {
      enabled: true,
      taskTypes: {
        coding: { preferredProvider: 'anthropic' },
        creative: { preferredProvider: 'openai' },
        analysis: { preferredProvider: 'anthropic' },
        general: { preferredProvider: 'google' },
      },
      learningEnabled: true,
    },
  },

  // Token optimization
  tokenOptimization: {
    // Compression
    compression: {
      enabled: true,
      strategy: 'adaptive', // smart, aggressive, conservative
      targetReduction: 0.20, // 20% reduction goal
    },

    // Caching (unified across providers)
    caching: {
      enabled: true,
      autoFormat: true, // Automatically format for each provider
      monitorHitRate: true,
      targetHitRate: 0.80, // 80% cache hit rate goal
    },

    // Smart model routing
    modelRouting: {
      enabled: true,
      classifyComplexity: true,
      classifyIntent: true,
    },

    // Budget management
    budgets: {
      daily: 100, // $100/day max
      monthly: 2500, // $2500/month max
      alertThreshold: 0.80, // Alert at 80%
      hardLimit: true, // Block requests when over budget
    },
  },

  // Monitoring
  monitoring: {
    enabled: true,
    metrics: ['cost', 'latency', 'quality', 'cache-hit-rate', 'provider-distribution'],
    exportInterval: 60000, // Export metrics every minute
    destinations: ['console', 'datadog', 'prometheus'],
  },

  // Error handling
  errorHandling: {
    retryStrategy: 'exponential-backoff',
    maxRetries: 3,
    circuitBreaker: {
      enabled: true,
      failureThreshold: 5,
      resetTimeout: 60000,
    },
  },
})

// Use the optimizer
const response = await optimizer.chat({
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userQuery },
  ],
  complexity: 'auto', // Auto-detect
  taskType: 'auto', // Auto-detect
})

console.log('Optimization results:', {
  provider: response.provider,
  model: response.model,
  cost: response.cost,
  savings: response.savings,
  cached: response.usage.cached,
  compressionRatio: response.compressionRatio,
  routingReason: response.routingReason,
})`}
          />
        </section>
      </ScrollReveal>

      {/* Provider Selection Strategies */}
      <ScrollReveal direction="up" delay={0.5}>
        <section id="selection-strategies" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="w-8 h-8 text-brand-500" />
            Provider Selection Strategies
          </h2>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
                <h3 className="font-semibold mb-3">Decision Matrix</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Choose Anthropic when:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 text-neutral-600 dark:text-neutral-400">
                      <li>You need highest quality reasoning</li>
                      <li>Complex analysis or coding tasks</li>
                      <li>90% cache discount is valuable</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800/50">
                <h3 className="font-semibold mb-3">Decision Matrix</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Choose OpenAI when:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 text-neutral-600 dark:text-neutral-400">
                      <li>Batch processing is acceptable</li>
                      <li>Creative or general-purpose tasks</li>
                      <li>High rate limits needed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800/50">
                <h3 className="font-semibold mb-3">Decision Matrix</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Choose Google when:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 text-neutral-600 dark:text-neutral-400">
                      <li>Cost is primary concern</li>
                      <li>Very large contexts (50K+ tokens)</li>
                      <li>Simple or general queries</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50">
                <h3 className="font-semibold mb-3">Decision Matrix</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Use Multi-Provider when:</strong>
                    <ul className="list-disc list-inside ml-2 mt-1 text-neutral-600 dark:text-neutral-400">
                      <li>Maximum cost savings required</li>
                      <li>High availability critical</li>
                      <li>Diverse workload types</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <CodeBlock
              language="typescript"
              code={`import { ProviderSelector } from '@clarity-chat/token-optimization'

// Automated provider selection
const selector = new ProviderSelector({
  criteria: {
    // Weighted criteria (total = 1.0)
    cost: 0.40,        // 40% weight on cost
    quality: 0.30,     // 30% weight on quality
    latency: 0.20,     // 20% weight on speed
    reliability: 0.10, // 10% weight on uptime
  },
})

// Get recommendation for specific request
const recommendation = await selector.select({
  messages,
  requirements: {
    maxCost: 0.01,           // Max $0.01 per request
    minQuality: 0.85,        // Min 85% quality score
    maxLatency: 2000,        // Max 2s response time
    minReliability: 0.995,   // Min 99.5% uptime
  },
})

console.log('Recommendation:', {
  provider: recommendation.provider,
  model: recommendation.model,
  estimatedCost: recommendation.estimatedCost,
  expectedQuality: recommendation.expectedQuality,
  reason: recommendation.reason,
})

// Example output:
// {
//   provider: 'google',
//   model: 'gemini-2.0-flash',
//   estimatedCost: 0.0002,
//   expectedQuality: 0.87,
//   reason: 'Lowest cost meeting quality threshold'
// }`}
            />
          </div>
        </section>
      </ScrollReveal>

      {/* Production Deployment */}
      <ScrollReveal direction="up" delay={0.55}>
        <section id="production" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Rocket className="w-8 h-8 text-brand-500" />
            Production Deployment
          </h2>

          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                    Production Checklist
                  </p>
                  <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Configure all API keys in environment variables</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Set up monitoring and alerting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Configure budget limits and alerts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Test failover scenarios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Enable circuit breakers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Set up cache warming for high-traffic periods</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <CodeBlock
              language="typescript"
              code={`// app/api/chat/route.ts
import { MultiProviderOptimizer } from '@clarity-chat/token-optimization'
import { NextRequest, NextResponse } from 'next/server'

const optimizer = new MultiProviderOptimizer({
  providers: {
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY!,
      models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
      caching: { enabled: true, minTokens: 1024 },
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY!,
      models: ['gpt-4o', 'gpt-4o-mini'],
      caching: { enabled: true, minTokens: 1024 },
      batching: { enabled: false }, // Disable for real-time chat
    },
    google: {
      apiKey: process.env.GOOGLE_API_KEY!,
      models: ['gemini-2.0-flash'],
      caching: { enabled: true, minTokens: 32768 },
    },
  },

  routing: {
    strategy: 'hybrid',
    fallback: {
      primary: 'anthropic',
      secondary: 'openai',
      tertiary: 'google',
    },
    costOptimization: {
      enabled: true,
      complexityLevels: {
        simple: { maxCostPerMToken: 0.5, providers: ['google', 'openai'] },
        moderate: { maxCostPerMToken: 3.0, providers: ['openai', 'anthropic'] },
        complex: { maxCostPerMToken: 15.0, providers: ['anthropic'] },
      },
    },
  },

  tokenOptimization: {
    compression: { enabled: true, strategy: 'adaptive' },
    caching: { enabled: true, autoFormat: true, targetHitRate: 0.80 },
    modelRouting: { enabled: true, classifyComplexity: true },
    budgets: {
      daily: Number(process.env.DAILY_BUDGET) || 100,
      monthly: Number(process.env.MONTHLY_BUDGET) || 2500,
      alertThreshold: 0.80,
      hardLimit: true,
    },
  },

  monitoring: {
    enabled: true,
    metrics: ['cost', 'latency', 'quality', 'cache-hit-rate'],
    destinations: process.env.NODE_ENV === 'production' ? ['datadog'] : ['console'],
  },

  errorHandling: {
    retryStrategy: 'exponential-backoff',
    maxRetries: 3,
    circuitBreaker: { enabled: true, failureThreshold: 5, resetTimeout: 60000 },
  },
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Optimize and route request
    const response = await optimizer.chat({
      messages,
      complexity: 'auto',
      taskType: 'auto',
      stream: true, // Enable streaming
    })

    // Return streaming response
    return new Response(response.stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Provider': response.provider,
        'X-Model': response.model,
        'X-Estimated-Cost': response.cost.toString(),
      },
    })
  } catch (error) {
    console.error('Chat error:', error)

    // Check if budget exceeded
    if (error instanceof BudgetExceededError) {
      return NextResponse.json(
        { error: 'Daily budget exceeded. Please try again tomorrow.' },
        { status: 429 }
      )
    }

    // All providers failed
    if (error instanceof AllProvidersFailed) {
      return NextResponse.json(
        { error: 'All AI providers are currently unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'An error occurred processing your request.' },
      { status: 500 }
    )
  }
}`}
            />

            <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <h3 className="font-semibold mb-4">Monitoring Dashboard</h3>
              <CodeBlock
                language="typescript"
                code={`// Monitor real-time metrics
const metrics = await optimizer.getMetrics({
  period: 'last_24_hours',
})

console.log('Provider Distribution:', metrics.providerDistribution)
// { anthropic: 35%, openai: 45%, google: 20% }

console.log('Cost Metrics:', {
  total: metrics.cost.total,           // $45.67
  perProvider: metrics.cost.byProvider,
  savings: metrics.cost.savings,       // $123.45 (73% vs baseline)
})

console.log('Performance:', {
  avgLatency: metrics.latency.avg,     // 1.2s
  p95Latency: metrics.latency.p95,     // 2.8s
  cacheHitRate: metrics.caching.hitRate, // 87%
})

console.log('Quality:', {
  avgScore: metrics.quality.avg,       // 0.92
  byProvider: metrics.quality.byProvider,
})`}
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.6}>
        <section className="bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-950/30 dark:to-purple-950/30 border border-brand-200 dark:border-brand-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Related Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            <Link
              href="/cookbook/smart-model-routing"
              className="flex items-center gap-2 text-brand-600 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Smart Model Routing Cookbook
            </Link>
            <Link
              href="/cookbook/provider-caching-setup"
              className="flex items-center gap-2 text-brand-600 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Provider Caching Setup
            </Link>
            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="flex items-center gap-2 text-brand-600 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Achieving 50-70% Cost Reduction
            </Link>
            <Link
              href="/reference/components/token-optimization"
              className="flex items-center gap-2 text-brand-600 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Token Optimization System
            </Link>
            <Link
              href="/cookbook/enterprise-production-pipeline"
              className="flex items-center gap-2 text-brand-600 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Enterprise Production Pipeline
            </Link>
            <Link
              href="/reference/api/complete"
              className="flex items-center gap-2 text-brand-600 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Complete API Reference
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
