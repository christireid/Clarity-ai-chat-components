'use client'

import { useState } from 'react'
import { CheckCircle, Code, Zap, Server, Layers, ArrowRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export default function ReactIntegrationCookbook() {
  const [activePattern, setActivePattern] = useState<'client' | 'server' | 'hybrid'>('hybrid')

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 rounded-full">
          <Layers className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
            React Integration
          </span>
        </div>

        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Integrate Token Optimization into Your React App
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Add provider caching, compression, and smart routing to React components with hooks, context, and server components.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50-70%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Cost Reduction</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">3 Hooks</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Ready to Use</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Type-Safe</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Full TypeScript</div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
        <ul className="space-y-3">
          {[
            'Use token optimization hooks in React components',
            'Set up optimization context for your app',
            'Implement server-side optimization with Next.js',
            'Handle streaming responses with optimization',
            'Track costs in real-time with React state',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Prerequisites */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
        <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
          <p>Before starting, ensure you have:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>React 18+ or Next.js 13+ installed</li>
            <li>
              Installed{' '}
              <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                @clarity-chat/token-optimization
              </code>
            </li>
            <li>
              Installed{' '}
              <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                @clarity-chat/react
              </code>
            </li>
            <li>
              Environment variable{' '}
              <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">ANTHROPIC_API_KEY</code>
            </li>
            <li>Basic understanding of React hooks and context</li>
          </ul>
        </div>
      </section>

      {/* Integration Patterns */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Integration Patterns</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Choose the integration pattern that fits your architecture:
        </p>

        {/* Pattern Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'hybrid', label: 'Hybrid (Recommended)', icon: Layers },
            { id: 'server', label: 'Server-Only', icon: Server },
            { id: 'client', label: 'Client-Only', icon: Code },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePattern(id as typeof activePattern)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activePattern === id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Pattern Content */}
        <div className="space-y-6">
          {activePattern === 'hybrid' && (
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-2">Best For:</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Next.js apps with Server Components + Client Components. Optimize on server for security, track
                  costs on client for UX.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 1: Create Optimization Context Provider</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Set up a context provider to share optimization state across your app:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`// app/providers/OptimizationProvider.tsx
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import type { CostMetrics } from '@clarity-chat/token-optimization'

interface OptimizationContextValue {
  totalCost: number
  requestCount: number
  avgTokensPerRequest: number
  recordRequest: (metrics: CostMetrics) => void
  resetMetrics: () => void
}

const OptimizationContext = createContext<OptimizationContextValue | undefined>(undefined)

export function OptimizationProvider({ children }: { children: ReactNode }) {
  const [totalCost, setTotalCost] = useState(0)
  const [requestCount, setRequestCount] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)

  const recordRequest = useCallback((metrics: CostMetrics) => {
    setTotalCost(prev => prev + metrics.cost)
    setRequestCount(prev => prev + 1)
    setTotalTokens(prev => prev + metrics.inputTokens + metrics.outputTokens)
  }, [])

  const resetMetrics = useCallback(() => {
    setTotalCost(0)
    setRequestCount(0)
    setTotalTokens(0)
  }, [])

  const avgTokensPerRequest = requestCount > 0 ? totalTokens / requestCount : 0

  return (
    <OptimizationContext.Provider
      value={{
        totalCost,
        requestCount,
        avgTokensPerRequest,
        recordRequest,
        resetMetrics,
      }}
    >
      {children}
    </OptimizationContext.Provider>
  )
}

export function useOptimization() {
  const context = useContext(OptimizationContext)
  if (!context) {
    throw new Error('useOptimization must be used within OptimizationProvider')
  }
  return context
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 2: Add Provider to App Layout</h3>
                <CodeBlock
                  language="typescript"
                  code={`// app/layout.tsx
import { OptimizationProvider } from './providers/OptimizationProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OptimizationProvider>
          {children}
        </OptimizationProvider>
      </body>
    </html>
  )
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 3: Optimize in Server Action</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Perform optimization on the server for security (API keys stay server-side):
                </p>

                <CodeBlock
                  language="typescript"
                  code={`// app/actions/chat.ts
'use server'

import Anthropic from '@anthropic-ai/sdk'
import { formatForCaching, compressWithLLMLingua, ModelRouter } from '@clarity-chat/token-optimization'
import type { Message } from '@anthropic-ai/sdk/resources'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function sendOptimizedMessage(messages: Message[]) {
  // Step 1: Format for provider caching
  const cached = await formatForCaching(messages, {
    provider: 'anthropic',
    minTokens: 1024,
  })

  // Step 2: Compress user context
  const lastUserMessage = messages[messages.length - 1]
  if (lastUserMessage.role === 'user' && typeof lastUserMessage.content === 'string') {
    const compressed = await compressWithLLMLingua(lastUserMessage.content, {
      targetRatio: 0.5,
      qualityThreshold: 0.7,
    })

    if (compressed.quality >= 0.7) {
      lastUserMessage.content = compressed.compressed
    }
  }

  // Step 3: Route to optimal model
  const router = ModelRouter.builder().useClaudeModels().withStrategy('hybrid').build()
  const routing = await router.route(lastUserMessage.content as string)

  // Step 4: Call Anthropic API
  const response = await anthropic.messages.create({
    model: routing.model,
    max_tokens: 1024,
    messages: cached.messages,
  })

  // Step 5: Calculate cost
  const cost = calculateCost(response.usage, routing.model)

  return {
    content: response.content[0].text,
    metrics: {
      cost,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheHit: response.usage.cache_read_input_tokens > 0,
      model: routing.model,
    },
  }
}

function calculateCost(usage: any, model: string): number {
  // Simplified cost calculation
  const prices = {
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
    'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
    'claude-opus-3-20240229': { input: 0.015, output: 0.075 },
  }

  const price = prices[model as keyof typeof prices]
  return (usage.input_tokens * price.input + usage.output_tokens * price.output) / 1000
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 4: Use in Client Component</h3>
                <CodeBlock
                  language="typescript"
                  code={`// app/components/ChatWindow.tsx
'use client'

import { useState } from 'react'
import { useOptimization } from '../providers/OptimizationProvider'
import { sendOptimizedMessage } from '../actions/chat'

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { recordRequest, totalCost, requestCount } = useOptimization()

  const handleSend = async () => {
    if (!input.trim()) return

    setIsLoading(true)
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)

    try {
      // Server action handles all optimization
      const result = await sendOptimizedMessage(newMessages)

      // Record metrics
      recordRequest(result.metrics)

      // Add assistant response
      setMessages([...newMessages, { role: 'assistant', content: result.content }])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Cost Tracker */}
      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">Total Cost:</span>
            <span className="ml-2 font-semibold text-emerald-600">
              \${totalCost.toFixed(4)}
            </span>
          </div>
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">Requests:</span>
            <span className="ml-2 font-semibold">{requestCount}</span>
          </div>
          <div>
            <span className="text-neutral-600 dark:text-neutral-400">Avg Cost:</span>
            <span className="ml-2 font-semibold">
              \${requestCount > 0 ? (totalCost / requestCount).toFixed(4) : '0.0000'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={\`mb-4 \${msg.role === 'user' ? 'text-right' : 'text-left'}\`}>
            <div className="inline-block px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-center text-neutral-500">Thinking...</div>}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg border"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}`}
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Benefits of Hybrid Pattern
                </h4>
                <ul className="text-sm space-y-1 text-emerald-800 dark:text-emerald-200">
                  <li>✅ API keys stay on server (secure)</li>
                  <li>✅ Optimization logic runs server-side (fast)</li>
                  <li>✅ Cost tracking updates in real-time (good UX)</li>
                  <li>✅ No client-side bundle bloat</li>
                </ul>
              </div>
            </div>
          )}

          {activePattern === 'server' && (
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-2">Best For:</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Next.js Server Components where all AI logic stays server-side. Maximum security, minimal
                  client bundle.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Server Component with Optimization</h3>
                <CodeBlock
                  language="typescript"
                  code={`// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { formatForCaching, compressWithLLMLingua, ModelRouter } from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  const { messages } = await request.json()

  // Step 1: Format for caching
  const cached = await formatForCaching(messages, {
    provider: 'anthropic',
    minTokens: 1024,
  })

  // Step 2: Compress
  const lastMsg = messages[messages.length - 1]
  if (lastMsg.content.length > 500) {
    const compressed = await compressWithLLMLingua(lastMsg.content, {
      targetRatio: 0.5,
      qualityThreshold: 0.7,
    })
    if (compressed.quality >= 0.7) {
      lastMsg.content = compressed.compressed
    }
  }

  // Step 3: Route
  const router = ModelRouter.builder().useClaudeModels().withStrategy('complexity-based').build()
  const routing = await router.route(lastMsg.content)

  // Step 4: Generate
  const response = await anthropic.messages.create({
    model: routing.model,
    max_tokens: 1024,
    messages: cached.messages,
  })

  return NextResponse.json({
    content: response.content[0].text,
    usage: response.usage,
    model: routing.model,
  })
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Server Component Usage</h3>
                <CodeBlock
                  language="typescript"
                  code={`// app/dashboard/page.tsx
import { ChatInterface } from './components/ChatInterface'

export default async function DashboardPage() {
  // Fetch data server-side
  const initialData = await fetchInitialData()

  return (
    <div>
      <h1>AI Dashboard</h1>
      <ChatInterface initialData={initialData} />
    </div>
  )
}`}
                />
              </div>
            </div>
          )}

          {activePattern === 'client' && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100">Not Recommended</p>
                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                      Client-only optimization requires exposing API keys to the browser (insecure) or using
                      proxy endpoints. Use hybrid or server-only patterns instead.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-semibold mb-2">If You Must Use Client-Only:</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Create a proxy API endpoint that accepts messages and returns optimized responses. Never expose
                  API keys client-side.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ready-to-Use Hooks */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Ready-to-Use Hooks</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Use these pre-built hooks for common optimization tasks:
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              1. <code>useTokenCount</code> - Real-time Token Counting
            </h3>
            <CodeBlock
              language="typescript"
              code={`import { useTokenCount } from '@clarity-chat/react'

function MessageComposer() {
  const [message, setMessage] = useState('')
  const { tokens, cost, isLoading } = useTokenCount(message, {
    model: 'claude-3-sonnet-20240229',
  })

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <div className="text-sm text-neutral-600">
        {tokens} tokens • \${cost.toFixed(4)} estimated cost
      </div>
    </div>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              2. <code>useOptimizedMessages</code> - Automatic Optimization
            </h3>
            <CodeBlock
              language="typescript"
              code={`import { useOptimizedMessages } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, sendMessage, totalCost } = useOptimizedMessages({
    provider: 'anthropic',
    enableCaching: true,
    enableCompression: true,
    enableRouting: true,
  })

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>{msg.content}</div>
      ))}
      <div>Total cost: \${totalCost.toFixed(4)}</div>
      <button onClick={() => sendMessage('Hello!')}>
        Send Message
      </button>
    </div>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              3. <code>useCostTracker</code> - Cost Monitoring
            </h3>
            <CodeBlock
              language="typescript"
              code={`import { useCostTracker } from '@clarity-chat/react'

function CostDashboard() {
  const {
    totalCost,
    requestCount,
    avgCostPerRequest,
    costByModel,
    resetMetrics,
  } = useCostTracker()

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <div className="text-2xl font-bold">\${totalCost.toFixed(2)}</div>
        <div className="text-sm text-neutral-600">Total Cost</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{requestCount}</div>
        <div className="text-sm text-neutral-600">Requests</div>
      </div>
      <div>
        <div className="text-2xl font-bold">\${avgCostPerRequest.toFixed(4)}</div>
        <div className="text-sm text-neutral-600">Avg Per Request</div>
      </div>
    </div>
  )
}`}
            />
          </div>
        </div>
      </section>

      {/* Streaming Support */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Streaming with Optimization</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Handle streaming responses while tracking costs in real-time:
        </p>

        <CodeBlock
          language="typescript"
          code={`// Server Action with Streaming
'use server'

import Anthropic from '@anthropic-ai/sdk'
import { formatForCaching } from '@clarity-chat/token-optimization'

export async function streamOptimizedResponse(messages: Message[]) {
  const cached = await formatForCaching(messages, {
    provider: 'anthropic',
    minTokens: 1024,
  })

  const stream = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1024,
    messages: cached.messages,
    stream: true,
  })

  return stream
}

// Client Component
'use client'

import { useState } from 'react'
import { streamOptimizedResponse } from '../actions/chat'

export function StreamingChat() {
  const [response, setResponse] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const handleStream = async () => {
    setIsStreaming(true)
    setResponse('')

    const stream = await streamOptimizedResponse(messages)

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta') {
        setResponse(prev => prev + chunk.delta.text)
      }
    }

    setIsStreaming(false)
  }

  return (
    <div>
      <div className="whitespace-pre-wrap">{response}</div>
      {isStreaming && <div className="animate-pulse">...</div>}
      <button onClick={handleStream}>Send</button>
    </div>
  )
}`}
        />
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Cost tracking not updating
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> <code>totalCost</code> stays at 0 after requests
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Ensure you're calling <code>recordRequest()</code> with actual cost
              metrics after each API call. Check that the provider is wrapped around your component tree.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Optimization not working in production
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> Works in dev, fails in production
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Check that <code>ANTHROPIC_API_KEY</code> is set in production
              environment. Verify server actions are enabled in <code>next.config.js</code>.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: High memory usage with large chat histories
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> App slows down after many messages
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Implement message history truncation. Keep only the last N messages in
              state and store the rest in a database or localStorage.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Next Steps
        </h2>
        <div className="space-y-3">
          <Link
            href="/cookbook/nodejs-backend-integration"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Integrate with Node.js backend API
          </Link>
          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Learn the full optimization strategy
          </Link>
          <Link
            href="/reference/hooks/use-optimized-messages"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            useOptimizedMessages API Reference
          </Link>
          <Link
            href="/reference/hooks/use-cost-tracker"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            useCostTracker API Reference
          </Link>
        </div>
      </section>

      {/* Real-World Example */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">Real-World Example: Customer Support Dashboard</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Scenario</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              React-based customer support dashboard with real-time AI assistance for agents
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Implementation</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Hybrid pattern: Optimization in Next.js server actions</li>
              <li>• Real-time cost tracking with <code>useOptimization</code> hook</li>
              <li>• Streaming responses for better UX</li>
              <li>• Per-agent cost breakdown</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Results</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Before: $0.15/conversation average (all Sonnet)</li>
              <li>• After: $0.04/conversation average (optimized routing)</li>
              <li>• <strong>73% cost reduction</strong></li>
              <li>• Response quality maintained (0.92 satisfaction score)</li>
              <li>• Agents can see cost per conversation in real-time</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
