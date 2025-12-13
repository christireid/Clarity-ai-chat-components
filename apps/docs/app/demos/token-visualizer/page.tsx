'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  ChevronLeft,
  TrendingDown,
  DollarSign,
  Zap,
  Database,
  Send,
  Bot,
  User,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/UI/ScrollReveal'
import { useAutoScroll } from '@clarity-chat/react'
import { generateId, sleep, estimateTokens as estimateTokensUtil } from '@/lib/demos/utils'
import { useMountedRef } from '@/lib/demos/hooks'
import { trackDemoViewed, trackMessageSent } from '@/lib/demos/analytics'

interface TokenStats {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  contextUsed: number
  contextWindow: number
  kvCacheHits: number
  kvCacheMisses: number
  estimatedCost: number
  savedTokens: number
  savedCost: number
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  tokens: number
  timestamp: Date
}

const CONTEXT_WINDOW = 128000 // 128K context window
const INPUT_COST_PER_1K = 0.01 // $0.01 per 1K input tokens
const OUTPUT_COST_PER_1K = 0.03 // $0.03 per 1K output tokens

const sampleResponses = [
  "I understand! Let me help you with that. Here's what you need to know about token optimization in Clarity Chat...",
  "Great question! Token management is crucial for cost-effective AI applications. The system automatically tracks usage and optimizes context...",
  "Absolutely! I can see from the token visualizer that we're efficiently using the context window. Let me explain how KV-cache helps...",
  "That's a thoughtful approach. By monitoring token usage in real-time, you can make informed decisions about when to summarize or truncate context...",
]

export default function TokenVisualizerDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm demonstrating token usage tracking. Watch the dashboard as we chat - you'll see tokens accumulate and optimization kick in!",
      sender: 'bot',
      tokens: 28,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [stats, setStats] = useState<TokenStats>({
    inputTokens: 0,
    outputTokens: 28,
    totalTokens: 28,
    contextUsed: 28,
    contextWindow: CONTEXT_WINDOW,
    kvCacheHits: 0,
    kvCacheMisses: 1,
    estimatedCost: 0.00084,
    savedTokens: 0,
    savedCost: 0,
  })
  const [showOptimization, setShowOptimization] = useState(false)
  const messageCountRef = useRef(0)
  const isMountedRef = useMountedRef()

  useEffect(() => {
    trackDemoViewed('token-visualizer')
  }, [])

  const { scrollRef, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
  })

  const estimateTokens = (text: string) => Math.ceil(text.length / 4)

  const resetDemo = () => {
    setMessages([{
      id: '1',
      text: "Hello! I'm demonstrating token usage tracking. Watch the dashboard as we chat - you'll see tokens accumulate and optimization kick in!",
      sender: 'bot',
      tokens: 28,
      timestamp: new Date(),
    }])
    setStats({
      inputTokens: 0,
      outputTokens: 28,
      totalTokens: 28,
      contextUsed: 28,
      contextWindow: CONTEXT_WINDOW,
      kvCacheHits: 0,
      kvCacheMisses: 1,
      estimatedCost: 0.00084,
      savedTokens: 0,
      savedCost: 0,
    })
    setShowOptimization(false)
    messageCountRef.current = 0
  }

  const handleSend = async () => {
    if (!input.trim() || isTyping) return

    trackMessageSent('token-visualizer')
    const inputTokens = estimateTokens(input)
    const userMessage: Message = {
      id: generateId(),
      text: input,
      sender: 'user',
      tokens: inputTokens,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    scrollToBottom()
    messageCountRef.current++

    // Update stats for input
    setStats(prev => ({
      ...prev,
      inputTokens: prev.inputTokens + inputTokens,
      totalTokens: prev.totalTokens + inputTokens,
      contextUsed: prev.contextUsed + inputTokens,
      estimatedCost: prev.estimatedCost + (inputTokens * INPUT_COST_PER_1K / 1000),
    }))

    await sleep(800)
    if (!isMountedRef.current) return

    const responseText = sampleResponses[messageCountRef.current % sampleResponses.length]
    const outputTokens = estimateTokens(responseText)
    const kvCacheHit = messageCountRef.current > 2 && Math.random() > 0.3

    const botMessage: Message = {
      id: generateId(),
      text: responseText,
      sender: 'bot',
      tokens: outputTokens,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, botMessage])
    setIsTyping(false)

    // Update stats for output
    setStats(prev => {
      const newContextUsed = prev.contextUsed + outputTokens
      const shouldOptimize = newContextUsed > CONTEXT_WINDOW * 0.7
      const savedTokens = shouldOptimize ? Math.floor(newContextUsed * 0.3) : 0

      if (shouldOptimize && !showOptimization) {
        setShowOptimization(true)
      }

      return {
        ...prev,
        outputTokens: prev.outputTokens + outputTokens,
        totalTokens: prev.totalTokens + outputTokens,
        contextUsed: shouldOptimize ? newContextUsed - savedTokens : newContextUsed,
        kvCacheHits: kvCacheHit ? prev.kvCacheHits + 1 : prev.kvCacheHits,
        kvCacheMisses: kvCacheHit ? prev.kvCacheMisses : prev.kvCacheMisses + 1,
        estimatedCost: prev.estimatedCost + (outputTokens * OUTPUT_COST_PER_1K / 1000),
        savedTokens: prev.savedTokens + savedTokens,
        savedCost: prev.savedCost + (savedTokens * ((INPUT_COST_PER_1K + OUTPUT_COST_PER_1K) / 2) / 1000),
      }
    })
  }

  const contextPercentage = (stats.contextUsed / stats.contextWindow) * 100
  const kvCacheRate = stats.kvCacheHits + stats.kvCacheMisses > 0
    ? (stats.kvCacheHits / (stats.kvCacheHits + stats.kvCacheMisses)) * 100
    : 0

  return (
    <div className="container-docs py-12">
      <Link
        href="/demos"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-600 dark:hover:text-brand-400 mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Demos
      </Link>

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              Token Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Token Budget{' '}
              <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Visualizer
              </span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Real-time dashboard showing token counts, context window usage,
              cost calculations, and KV-cache hit rates.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Dashboard */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                <Database className="w-4 h-4" />
                Total Tokens
              </div>
              <div className="text-2xl font-bold">
                {stats.totalTokens.toLocaleString()}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                In: {stats.inputTokens} | Out: {stats.outputTokens}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                <Zap className="w-4 h-4" />
                Context Usage
              </div>
              <div className="text-2xl font-bold">
                {contextPercentage.toFixed(1)}%
              </div>
              <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    contextPercentage > 80 ? 'bg-red-500' :
                    contextPercentage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(contextPercentage, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                <DollarSign className="w-4 h-4" />
                Estimated Cost
              </div>
              <div className="text-2xl font-bold">
                ${stats.estimatedCost.toFixed(4)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Saved: ${stats.savedCost.toFixed(4)}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border">
              <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                <TrendingDown className="w-4 h-4" />
                KV-Cache Rate
              </div>
              <div className="text-2xl font-bold">
                {kvCacheRate.toFixed(0)}%
              </div>
              <div className="text-xs text-text-secondary mt-1">
                Hits: {stats.kvCacheHits} | Misses: {stats.kvCacheMisses}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Optimization Alert */}
        <AnimatePresence>
          {showOptimization && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-green-700 dark:text-green-300">
                    Context Optimization Activated!
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Summarized older messages, saved {stats.savedTokens.toLocaleString()} tokens (${stats.savedCost.toFixed(4)})
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Panel */}
          <ScrollReveal delay={0.2}>
            <div className="lg:col-span-2 rounded-2xl border-2 border-border shadow-xl overflow-hidden bg-bg-primary">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold">Token Tracking Demo</div>
                    <div className="text-xs opacity-90">
                      {messages.length} messages | {stats.totalTokens} tokens
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetDemo}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef as React.RefObject<HTMLDivElement>}
                className="h-[400px] overflow-y-auto p-6 space-y-4 scroll-smooth"
              >
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'bot'
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                        : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                    }`}>
                      {message.sender === 'bot' ? (
                        <Bot className="w-5 h-5" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="max-w-[75%]">
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'bot'
                          ? 'bg-bg-secondary text-text-primary rounded-tl-sm'
                          : 'bg-brand-500 text-white rounded-tr-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <div className={`text-xs text-text-secondary mt-1 ${
                        message.sender === 'user' ? 'text-right' : ''
                      }`}>
                        {message.tokens} tokens
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-indigo-500"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                    </div>
                    <span className="text-sm">Generating...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border p-4 bg-bg-primary">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Send messages to see token usage..."
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-bg-secondary text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>

          {/* Token Breakdown */}
          <ScrollReveal delay={0.3}>
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-bg-secondary border border-border">
                <h3 className="font-bold mb-4">Token Breakdown</h3>
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={msg.id} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        msg.sender === 'bot' ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              msg.sender === 'bot' ? 'bg-indigo-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${(msg.tokens / stats.totalTokens) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-text-secondary w-12 text-right">
                        {msg.tokens}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold mb-3">Why This Matters</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Predictable API costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Automatic context optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>KV-cache maximization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Real-time budget alerts</span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.4}>
          <div className="mt-12 text-center">
            <Link
              href="/guides/token-optimization"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
            >
              Token Optimization Guide <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
