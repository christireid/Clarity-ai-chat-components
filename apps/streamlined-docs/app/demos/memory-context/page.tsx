'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/Enhanced/ScrollReveal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/CodeBlock'
import {
  Brain,
  Database,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  BarChart3,
  DollarSign,
  Clock,
  Layers,
  Info,
  Sparkles,
  Activity,
} from 'lucide-react'
import Link from 'next/link'

// =============================================================================
// TYPES
// =============================================================================

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  cached?: boolean
  tokens?: {
    input: number
    output: number
    cached: number
  }
}

interface CacheStats {
  totalRequests: number
  cachedRequests: number
  hitRate: number
  tokensSaved: number
  costSavings: number
}

// =============================================================================
// DEMO COMPONENT
// =============================================================================

export default function MemoryContextDemoPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    totalRequests: 0,
    cachedRequests: 0,
    hitRate: 0,
    tokensSaved: 0,
    costSavings: 0,
  })
  const [showSystemPrompt, setShowSystemPrompt] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // System prompt (this would be cached in real implementation)
  const systemPrompt = `You are a helpful AI assistant with access to conversation memory and context.

# Product Documentation (3000+ tokens)

## Features
- Real-time chat with streaming responses
- Persistent conversation memory across sessions
- Automatic context compression for long conversations
- Provider caching for system prompts (90% savings)
- Smart model routing for cost optimization

## Best Practices
1. Keep system prompts ≥1024 tokens for caching eligibility
2. Use semantic memory for long-term facts
3. Compress episodic memories after 5+ messages
4. Monitor cache hit rates (target >80%)
5. Combine caching with compression for maximum savings

## API Reference
[... extensive documentation continues ...]`

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with a system message
  useEffect(() => {
    const systemMessage: Message = {
      id: 'system-1',
      role: 'system',
      content: systemPrompt,
      timestamp: new Date(),
      cached: true,
      tokens: {
        input: 3200,
        output: 0,
        cached: 3200,
      },
    }
    setMessages([systemMessage])
  }, [])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
      tokens: {
        input: Math.floor(inputValue.length / 4), // Rough token estimate
        output: 0,
        cached: 0,
      },
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate API call with caching
    setTimeout(() => {
      const isCached = cacheStats.totalRequests > 0 // First request creates cache, subsequent use it
      const systemTokens = 3200
      const userTokens = userMessage.tokens!.input
      const responseTokens = Math.floor(Math.random() * 200 + 100)

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `This is a simulated response demonstrating ${isCached ? 'cached' : 'non-cached'} system prompt behavior. ${isCached ? 'System prompt (3200 tokens) was read from cache at 90% discount!' : 'System prompt (3200 tokens) was sent and cached for future requests.'}`,
        timestamp: new Date(),
        cached: isCached,
        tokens: {
          input: userTokens,
          output: responseTokens,
          cached: isCached ? systemTokens : 0,
        },
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update cache statistics
      setCacheStats((prev) => {
        const totalRequests = prev.totalRequests + 1
        const cachedRequests = prev.cachedRequests + (isCached ? 1 : 0)
        const hitRate = (cachedRequests / totalRequests) * 100

        // Calculate token savings
        const tokensSaved = prev.tokensSaved + (isCached ? systemTokens : 0)

        // Cost calculation (Claude Sonnet 3.5 pricing)
        // Input: $3.00 per 1M tokens
        // Cached input: $0.30 per 1M tokens (90% savings)
        const regularCost = (systemTokens * 3.0) / 1_000_000
        const cachedCost = (systemTokens * 0.3) / 1_000_000
        const savingsPerRequest = isCached ? regularCost - cachedCost : 0
        const costSavings = prev.costSavings + savingsPerRequest

        return {
          totalRequests,
          cachedRequests,
          hitRate,
          tokensSaved,
          costSavings,
        }
      })

      setIsLoading(false)
    }, 1000)
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'system-1',
        role: 'system',
        content: systemPrompt,
        timestamp: new Date(),
        cached: true,
        tokens: {
          input: 3200,
          output: 0,
          cached: 3200,
        },
      },
    ])
    setCacheStats({
      totalRequests: 0,
      cachedRequests: 0,
      hitRate: 0,
      tokensSaved: 0,
      costSavings: 0,
    })
  }

  const firstRequestCost = (3200 * 3.0) / 1_000_000
  const cachedRequestCost = (3200 * 0.3) / 1_000_000
  const savingsPercentage = ((firstRequestCost - cachedRequestCost) / firstRequestCost) * 100

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50 rounded-full mb-6">
            <Brain className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Interactive Demo
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Memory & Context with Provider Caching
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            See how provider caching reduces costs by 90% on cached tokens in
            real-time. Watch your savings grow with each message.
          </p>
        </div>
      </ScrollReveal>

      {/* Cost Savings Banner */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50 p-6 rounded-xl">
          <div className="flex items-start gap-3">
            <DollarSign className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Cost Breakdown: First vs Cached Requests
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                  <p className="font-medium text-red-700 dark:text-red-300 mb-1">
                    First Request (Cache Creation)
                  </p>
                  <p className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
                    3200 tokens × $3.00/1M
                  </p>
                  <p className="font-mono text-xl text-red-600 mt-2">
                    = ${firstRequestCost.toFixed(4)}
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-neutral-900/50 p-4 rounded-lg">
                  <p className="font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Cached Requests (90% Savings)
                  </p>
                  <p className="font-mono text-sm text-neutral-600 dark:text-neutral-400">
                    3200 tokens × $0.30/1M
                  </p>
                  <p className="font-mono text-xl text-emerald-600 mt-2">
                    = ${cachedRequestCost.toFixed(4)}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-300 dark:border-emerald-700">
                <p className="font-bold text-lg text-emerald-800 dark:text-emerald-200">
                  Per-request savings: ${(firstRequestCost - cachedRequestCost).toFixed(4)} (
                  {savingsPercentage.toFixed(0)}% reduction)
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Live Demo Container */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-500 to-purple-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Database className="w-5 h-5" />
                <span className="font-semibold">Chat with Memory</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
              >
                Reset Demo
              </button>
            </div>

            {/* System Prompt Indicator */}
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 border-b border-purple-200 dark:border-purple-800/50">
              <button
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 transition-colors w-full"
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">
                  System Prompt (3200 tokens) {messages[0]?.cached ? '✓ Cached' : '○ Not Cached'}
                </span>
                <Info className="w-4 h-4 ml-auto" />
              </button>
              <AnimatePresence>
                {showSystemPrompt && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="max-h-40 overflow-y-auto scrollbar-hide text-xs font-mono bg-white dark:bg-neutral-900 p-3 rounded border border-purple-200 dark:border-purple-800">
                      {systemPrompt}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto scrollbar-hide p-4 space-y-4">
              {messages
                .filter((m) => m.role !== 'system')
                .map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-brand-500 text-white'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.cached && (
                        <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>System prompt cached (90% savings)</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !inputValue.trim()}
                  className="px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Real-Time Stats Panel */}
          <div className="space-y-4">
            {/* Cache Hit Rate */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-brand-500" />
                <h3 className="font-semibold">Cache Hit Rate</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-500 mb-2">
                  {cacheStats.hitRate.toFixed(1)}%
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {cacheStats.cachedRequests} of {cacheStats.totalRequests} requests cached
                </p>
                <div className="mt-4 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cacheStats.hitRate}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-brand-500 to-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Tokens Saved */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold">Tokens Saved</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-500 mb-2">
                  {cacheStats.tokensSaved.toLocaleString()}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  tokens from cache
                </p>
              </div>
            </div>

            {/* Cost Savings */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold">Total Savings</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-500 mb-2">
                  ${cacheStats.costSavings.toFixed(4)}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  saved from caching
                </p>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-900 dark:text-blue-100">
                  This demo simulates provider caching. In production, the first request creates the
                  cache, and subsequent requests within 5 minutes use cached tokens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* How It Works */}
      <ScrollReveal direction="up" delay={0.25}>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">How Provider Caching Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">1. First Request</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                System prompt (≥1024 tokens) is sent and cached for 5 minutes. Full price applies
                to this request.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">2. Cached Requests</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Subsequent requests use cached system prompt at 90% discount. Only user message
                charged at full rate.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">3. Massive Savings</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                With typical system prompts, achieve 50-70% overall cost reduction when combined
                with other strategies.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Implementation Example */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Implementation Example</h2>
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="font-semibold text-sm">Anthropic Claude with Provider Caching</h3>
            </div>
            <div className="p-6">
              <CodeBlock
                code={`import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const systemPrompt = \`You are a helpful AI assistant...
[... extensive documentation 3000+ tokens ...]\`

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: systemPrompt,
      cache_control: { type: 'ephemeral' }, // Enable caching
    }
  ],
  messages: [
    { role: 'user', content: userMessage }
  ],
})

// Check cache performance
const usage = response.usage
console.log('Cache read tokens:', usage.cache_read_input_tokens)
console.log('Cache creation tokens:', usage.cache_creation_input_tokens)
console.log('Regular input tokens:', usage.input_tokens)

// Calculate savings
const cacheHitRate = usage.cache_read_input_tokens > 0
const savings = cacheHitRate
  ? ((usage.cache_read_input_tokens * 2.7) / 1_000_000)
  : 0
console.log('Cost saved:', \`$\${savings.toFixed(4)}\`)`}
                language="typescript"
              />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.35}>
        <section>
          <h2 className="text-2xl font-bold mb-6">Learn More</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/cookbook/provider-caching-setup"
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 group-hover:scale-110 transition-transform">
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    Provider Caching Setup
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Complete guide to implementing provider caching across Anthropic, OpenAI, and
                    Google.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 group-hover:scale-110 transition-transform">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    Achieving 50-70% Cost Reduction
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Combine caching with compression and smart routing for maximum savings.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/guides/memory"
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 group-hover:scale-110 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    Memory & Context Guide
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Deep dive into conversation memory, context compression, and retention
                    policies.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/cookbook/streaming-with-memory"
              className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    Streaming with Memory
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Build a production chat with streaming, memory, and RAG integration.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
