'use client'

import { useState } from 'react'
import { CodeBlock } from '@/components/CodeBlock'
import { ScrollReveal } from '@/components/Enhanced/ScrollReveal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import {
  Radio,
  Wifi,
  Globe,
  Zap,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Activity,
  Target,
  BarChart3,
  Database,
  RefreshCw,
  Shield,
  Clock,
  Layers,
} from 'lucide-react'
import Link from 'next/link'

export default function StreamingOptimizationPage() {
  const [selectedMode, setSelectedMode] = useState<'sse' | 'websocket' | 'http'>('sse')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumbs />

      {/* Hero Section */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 rounded-full mb-6">
            <Radio className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              API Reference
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Streaming with Token Optimization
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Build high-performance streaming chat with real-time token tracking,
            progressive compression, and provider caching for 50-70% cost savings.
          </p>

          {/* Cost Savings Badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg">
            <TrendingDown className="w-5 h-5" />
            <span className="font-semibold">Optimize streaming responses for 50-70% savings</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Quick Navigation */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <button
            onClick={() => setSelectedMode('sse')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMode === 'sse'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <Radio className={`w-8 h-8 mb-3 ${selectedMode === 'sse' ? 'text-blue-500' : 'text-neutral-400'}`} />
            <h3 className="font-semibold text-lg mb-2">Server-Sent Events</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              HTTP-based unidirectional streaming (recommended)
            </p>
          </button>

          <button
            onClick={() => setSelectedMode('websocket')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMode === 'websocket'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <Wifi className={`w-8 h-8 mb-3 ${selectedMode === 'websocket' ? 'text-blue-500' : 'text-neutral-400'}`} />
            <h3 className="font-semibold text-lg mb-2">WebSocket</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Bidirectional real-time communication
            </p>
          </button>

          <button
            onClick={() => setSelectedMode('http')}
            className={`p-6 rounded-xl border-2 transition-all ${
              selectedMode === 'http'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <Globe className={`w-8 h-8 mb-3 ${selectedMode === 'http' ? 'text-blue-500' : 'text-neutral-400'}`} />
            <h3 className="font-semibold text-lg mb-2">HTTP Streaming</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Chunked transfer encoding for compatibility
            </p>
          </button>
        </div>
      </ScrollReveal>

      {/* Overview */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Overview</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
              Streaming responses provide real-time feedback to users while optimizing token usage
              through progressive compression and provider caching. This guide covers all three
              streaming patterns with integrated token optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500 text-white flex-shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Real-Time Optimization</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Track token usage as responses stream in, with live cost estimation
                    and compression suggestions.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800/50">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500 text-white flex-shrink-0">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Progressive Compression</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Automatically compress older messages while streaming new ones,
                    maintaining context quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Server-Sent Events */}
      {selectedMode === 'sse' && (
        <>
          <ScrollReveal direction="up" delay={0.25}>
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Radio className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold">Server-Sent Events (SSE)</h2>
              </div>

              <div className="mb-8 bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Recommended for Most Use Cases
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      SSE provides the best balance of simplicity, reliability, and performance
                      for one-way streaming. Works with standard HTTP/2 and modern browsers.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4">Basic SSE Setup</h3>
              <CodeBlock language="typescript">
{`import { useStreamingSSE } from '@clarity-chat/react'

function ChatWithSSE() {
  const {
    status,
    events,
    tokenStats,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',

    // Token optimization
    enableTokenTracking: true,
    compressionThreshold: 0.7,

    // Event handlers
    onMessage: (event) => {
      console.log('Received:', event.data)
    },
    onTokenUpdate: (stats) => {
      console.log('Tokens used:', stats.totalTokens)
      console.log('Estimated cost:', stats.estimatedCost)
    },
  })

  const handleSend = (message: string) => {
    connect({
      body: {
        message,
        // Enable provider caching
        enableCaching: true,
      }
    })
  }

  return (
    <div>
      <StreamingIndicator
        status={status}
        tokensUsed={tokenStats.totalTokens}
      />
      <MessageList messages={events} />
      <ChatInput onSend={handleSend} />
    </div>
  )
}`}
              </CodeBlock>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <section className="mb-16">
              <h3 className="text-2xl font-semibold mb-4">SSE Server Implementation</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Create an API route that streams responses with token tracking:
              </p>
              <CodeBlock language="typescript">
{`// app/api/chat/stream/route.ts
import { Anthropic } from '@anthropic-ai/sdk'
import { StreamingTextResponse, TokenCounter } from '@clarity-chat/utils'

export async function POST(request: Request) {
  const { message, enableCaching } = await request.json()

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  // Initialize token counter
  const tokenCounter = new TokenCounter({
    model: 'claude-3-5-sonnet-20241022',
    trackCosts: true,
  })

  // Create encoder for SSE format
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  // Start streaming
  ;(async () => {
    try {
      const response = await anthropic.messages.stream({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
        // Provider caching
        system: enableCaching ? [
          {
            type: 'text',
            text: 'Your system prompt here...',
            cache_control: { type: 'ephemeral' },
          },
        ] : undefined,
      })

      let accumulatedText = ''

      for await (const chunk of response) {
        if (chunk.type === 'content_block_delta') {
          const text = chunk.delta.text
          accumulatedText += text

          // Count tokens incrementally
          const tokens = tokenCounter.count(accumulatedText)

          // Send SSE event with token stats
          const data = JSON.stringify({
            type: 'message',
            content: text,
            tokens: {
              total: tokens,
              cost: tokenCounter.estimateCost(tokens),
            },
          })

          await writer.write(
            encoder.encode(\`data: \${data}\\n\\n\`)
          )
        }
      }

      // Send completion event with final stats
      const finalStats = tokenCounter.getStats()
      await writer.write(
        encoder.encode(\`data: \${JSON.stringify({
          type: 'done',
          stats: finalStats,
        })}\\n\\n\`)
      )

      await writer.close()
    } catch (error) {
      await writer.write(
        encoder.encode(\`data: \${JSON.stringify({
          type: 'error',
          error: error.message,
        })}\\n\\n\`)
      )
      await writer.close()
    }
  })()

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}`}
              </CodeBlock>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.35}>
            <section className="mb-16">
              <h3 className="text-2xl font-semibold mb-4">Token Tracking During Streaming</h3>
              <CodeBlock language="typescript">
{`import { TokenBudgetIndicator } from '@clarity-chat/react'

function StreamingChat() {
  const {
    status,
    events,
    tokenStats,
    connect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    enableTokenTracking: true,

    // Real-time token callbacks
    onTokenUpdate: (stats) => {
      console.log('Live token count:', stats.totalTokens)
      console.log('Cost so far:', stats.estimatedCost)
      console.log('Compression savings:', stats.compressionSavings)
    },

    // Warning threshold
    tokenBudget: 8000,
    onBudgetWarning: (usage) => {
      console.warn(\`Token budget at \${usage}%\`)
    },
  })

  return (
    <div className="space-y-4">
      {/* Real-time token budget display */}
      <TokenBudgetIndicator
        current={tokenStats.totalTokens}
        budget={8000}
        showSavings={true}
        compressionRate={tokenStats.compressionRate}
      />

      {/* Streaming status */}
      {status === 'streaming' && (
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Streaming... {tokenStats.totalTokens} tokens</span>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={events} />
    </div>
  )
}`}
              </CodeBlock>
            </section>
          </ScrollReveal>
        </>
      )}

      {/* WebSocket */}
      {selectedMode === 'websocket' && (
        <>
          <ScrollReveal direction="up" delay={0.25}>
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Wifi className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold">WebSocket Streaming</h2>
              </div>

              <div className="mb-8 bg-amber-500/10 border border-amber-500/30 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Use for Bidirectional Communication
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      WebSockets are ideal when you need the client to send messages during streaming
                      (e.g., stop generation, real-time feedback). For simple streaming, prefer SSE.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4">WebSocket Setup</h3>
              <CodeBlock language="typescript">
{`import { useStreamingWebSocket } from '@clarity-chat/react'

function ChatWithWebSocket() {
  const {
    status,
    messages,
    tokenStats,
    send,
    stop,
    disconnect,
  } = useStreamingWebSocket({
    url: 'ws://localhost:3000/api/chat/ws',

    // Auto-reconnect
    autoReconnect: true,
    maxReconnectAttempts: 5,

    // Token optimization
    enableTokenTracking: true,
    compressionThreshold: 0.7,

    // Event handlers
    onMessage: (msg) => {
      console.log('Received:', msg)
    },
    onTokenUpdate: (stats) => {
      console.log('Tokens:', stats.totalTokens)
    },
    onError: (error) => {
      console.error('WebSocket error:', error)
    },
  })

  const handleSend = (message: string) => {
    send({
      type: 'message',
      content: message,
      enableCaching: true,
    })
  }

  const handleStop = () => {
    // Stop generation mid-stream
    send({ type: 'stop' })
  }

  return (
    <div>
      <StreamingIndicator
        status={status}
        tokensUsed={tokenStats.totalTokens}
      />

      <MessageList messages={messages} />

      <div className="flex gap-2">
        <ChatInput onSend={handleSend} />
        {status === 'streaming' && (
          <button onClick={handleStop}>Stop</button>
        )}
      </div>
    </div>
  )
}`}
              </CodeBlock>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <section className="mb-16">
              <h3 className="text-2xl font-semibold mb-4">WebSocket Server Implementation</h3>
              <CodeBlock language="typescript">
{`// server/websocket.ts
import { WebSocketServer } from 'ws'
import { Anthropic } from '@anthropic-ai/sdk'
import { TokenCounter } from '@clarity-chat/utils'

const wss = new WebSocketServer({ port: 3000, path: '/api/chat/ws' })

wss.on('connection', (ws) => {
  const tokenCounter = new TokenCounter({
    model: 'claude-3-5-sonnet-20241022',
  })

  let currentStream: any = null

  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString())

    if (message.type === 'stop') {
      // Handle stop request
      if (currentStream) {
        currentStream.controller.abort()
      }
      return
    }

    if (message.type === 'message') {
      const anthropic = new Anthropic()

      try {
        const stream = await anthropic.messages.stream({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: message.content }],
        })

        currentStream = stream
        let accumulatedText = ''

        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta') {
            accumulatedText += chunk.delta.text
            const tokens = tokenCounter.count(accumulatedText)

            // Send incremental update
            ws.send(JSON.stringify({
              type: 'content',
              content: chunk.delta.text,
              tokens: {
                total: tokens,
                cost: tokenCounter.estimateCost(tokens),
              },
            }))
          }
        }

        // Send completion
        ws.send(JSON.stringify({
          type: 'done',
          stats: tokenCounter.getStats(),
        }))

        currentStream = null
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          error: error.message,
        }))
      }
    }
  })

  ws.on('close', () => {
    if (currentStream) {
      currentStream.controller.abort()
    }
  })
})`}
              </CodeBlock>
            </section>
          </ScrollReveal>
        </>
      )}

      {/* HTTP Streaming */}
      {selectedMode === 'http' && (
        <>
          <ScrollReveal direction="up" delay={0.25}>
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold">HTTP Streaming</h2>
              </div>

              <div className="mb-8 bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Maximum Compatibility
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      HTTP streaming with chunked transfer encoding works in all environments,
                      including older browsers and restrictive networks.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-4">HTTP Streaming Setup</h3>
              <CodeBlock language="typescript">
{`import { useStreamingHTTP } from '@clarity-chat/react'

function ChatWithHTTP() {
  const {
    status,
    content,
    tokenStats,
    fetch: streamFetch,
  } = useStreamingHTTP({
    enableTokenTracking: true,
    compressionThreshold: 0.7,

    onChunk: (chunk) => {
      console.log('Chunk received:', chunk)
    },
    onTokenUpdate: (stats) => {
      console.log('Tokens:', stats.totalTokens)
    },
  })

  const handleSend = async (message: string) => {
    await streamFetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        enableCaching: true,
      }),
    })
  }

  return (
    <div>
      <div className="mb-4">
        <TokenBudgetIndicator
          current={tokenStats.totalTokens}
          budget={8000}
          showSavings={true}
        />
      </div>

      <div className="whitespace-pre-wrap">
        {content}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}`}
              </CodeBlock>
            </section>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <section className="mb-16">
              <h3 className="text-2xl font-semibold mb-4">HTTP Streaming Server</h3>
              <CodeBlock language="typescript">
{`// app/api/chat/stream/route.ts
import { Anthropic } from '@anthropic-ai/sdk'

export async function POST(request: Request) {
  const { message, enableCaching } = await request.json()

  const anthropic = new Anthropic()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await anthropic.messages.stream({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [{ role: 'user', content: message }],
        })

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta') {
            // Send chunk as plain text
            controller.enqueue(
              new TextEncoder().encode(chunk.delta.text)
            )
          }
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}`}
              </CodeBlock>
            </section>
          </ScrollReveal>
        </>
      )}

      {/* Progressive Compression */}
      <ScrollReveal direction="up" delay={0.4}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="w-8 h-8 text-purple-500" />
            <h2 className="text-3xl font-bold">Progressive Compression</h2>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Automatically compress older messages while streaming new responses to stay within
            token budgets while maintaining conversation quality.
          </p>

          <CodeBlock language="typescript">
{`import { useProgressiveCompression } from '@clarity-chat/react'

function ChatWithCompression() {
  const {
    messages,
    appendMessage,
    tokenStats,
  } = useProgressiveCompression({
    // Compression settings
    maxTokens: 8000,
    compressionThreshold: 0.7, // Compress when 70% full
    preserveRecent: 3, // Keep last 3 messages uncompressed

    // Quality targets
    minCompressionRatio: 0.3, // At least 70% reduction
    qualityThreshold: 0.8, // Maintain 80% quality

    // Callbacks
    onCompress: (stats) => {
      console.log('Compressed messages:', stats.compressedCount)
      console.log('Tokens saved:', stats.tokensSaved)
      console.log('Quality score:', stats.qualityScore)
    },
  })

  return (
    <div>
      {/* Compression stats */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg mb-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-neutral-600 dark:text-neutral-400">Total Tokens</div>
            <div className="text-2xl font-bold">{tokenStats.totalTokens}</div>
          </div>
          <div>
            <div className="text-neutral-600 dark:text-neutral-400">Tokens Saved</div>
            <div className="text-2xl font-bold text-purple-600">
              {tokenStats.tokensSaved}
            </div>
          </div>
          <div>
            <div className="text-neutral-600 dark:text-neutral-400">Compression</div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(tokenStats.compressionRate * 100)}%
            </div>
          </div>
        </div>
      </div>

      <MessageList messages={messages} />
    </div>
  )
}`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Provider Caching with Streaming */}
      <ScrollReveal direction="up" delay={0.45}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-emerald-500" />
            <h2 className="text-3xl font-bold">Provider Caching with Streaming</h2>
          </div>

          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  90% Savings on Cached Tokens
                </p>
                <p className="text-sm text-emerald-800 dark:text-emerald-200">
                  Provider caching reduces costs by 90% for static content like system prompts
                  and conversation history that meets the caching threshold (≥1024 tokens).
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Anthropic Prompt Caching</h3>
          <CodeBlock language="typescript">
{`// Streaming with Anthropic prompt caching
const stream = await anthropic.messages.stream({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 4096,

  // Cache system prompt
  system: [
    {
      type: 'text',
      text: \`You are a helpful coding assistant with access to the following
             documentation... (large static content)\`,
      cache_control: { type: 'ephemeral' }, // Enable caching
    },
  ],

  // Cache conversation history
  messages: [
    ...conversationHistory.map((msg) => ({
      ...msg,
      // Cache older messages
      cache_control: msg.timestamp < cutoffTime
        ? { type: 'ephemeral' }
        : undefined,
    })),
    { role: 'user', content: newMessage },
  ],
})

// Track cache performance
for await (const chunk of stream) {
  if (chunk.type === 'message_start') {
    const usage = chunk.message.usage
    console.log('Cache read tokens:', usage.cache_read_input_tokens)
    console.log('Cache creation tokens:', usage.cache_creation_input_tokens)
    console.log('Regular input tokens:', usage.input_tokens)

    // Calculate savings
    const cacheHitRate = usage.cache_read_input_tokens /
      (usage.cache_read_input_tokens + usage.input_tokens)
    console.log('Cache hit rate:', \`\${Math.round(cacheHitRate * 100)}%\`)
  }
}`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">OpenAI Prompt Caching</h3>
          <CodeBlock language="typescript">
{`// Streaming with OpenAI prompt caching
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  stream: true,

  messages: [
    {
      role: 'system',
      content: 'Large system prompt...', // Automatically cached if >1024 tokens
    },
    ...conversationHistory,
    {
      role: 'user',
      content: newMessage,
    },
  ],
})

// OpenAI doesn't expose cache metrics in stream, check completion
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '')
}

// Check cache usage in final completion response
// (cached_tokens field in usage object)`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Performance Characteristics */}
      <ScrollReveal direction="up" delay={0.5}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Performance Characteristics</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-neutral-200 dark:border-neutral-800">
                  <th className="text-left p-4 font-semibold">Metric</th>
                  <th className="text-left p-4 font-semibold">SSE</th>
                  <th className="text-left p-4 font-semibold">WebSocket</th>
                  <th className="text-left p-4 font-semibold">HTTP</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Latency (TTFB)</td>
                  <td className="p-4 text-emerald-600 font-semibold">~50ms</td>
                  <td className="p-4">~100ms</td>
                  <td className="p-4">~50ms</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Throughput</td>
                  <td className="p-4 text-emerald-600 font-semibold">High</td>
                  <td className="p-4 text-emerald-600 font-semibold">High</td>
                  <td className="p-4">Medium</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Connection Overhead</td>
                  <td className="p-4 text-emerald-600 font-semibold">Low</td>
                  <td className="p-4">Medium</td>
                  <td className="p-4 text-emerald-600 font-semibold">Low</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Auto-Reconnect</td>
                  <td className="p-4 text-emerald-600 font-semibold">Built-in</td>
                  <td className="p-4 text-emerald-600 font-semibold">Built-in</td>
                  <td className="p-4 text-neutral-400">Manual</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Browser Support</td>
                  <td className="p-4 text-emerald-600 font-semibold">Modern</td>
                  <td className="p-4">All</td>
                  <td className="p-4 text-emerald-600 font-semibold">All</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Bidirectional</td>
                  <td className="p-4 text-neutral-400">No</td>
                  <td className="p-4 text-emerald-600 font-semibold">Yes</td>
                  <td className="p-4 text-neutral-400">No</td>
                </tr>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="p-4">Token Tracking</td>
                  <td className="p-4 text-emerald-600 font-semibold">Real-time</td>
                  <td className="p-4 text-emerald-600 font-semibold">Real-time</td>
                  <td className="p-4 text-emerald-600 font-semibold">Real-time</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Recommendation
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Start with SSE</strong> for most use cases. It provides the best balance of
              performance, reliability, and simplicity. Use WebSockets only when you need
              bidirectional communication (e.g., stop generation, typing indicators). Use HTTP
              streaming for maximum compatibility in restrictive environments.
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* Error Handling */}
      <ScrollReveal direction="up" delay={0.55}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-bold">Error Handling & Recovery</h2>
          </div>

          <CodeBlock language="typescript">
{`import { useStreamingSSE } from '@clarity-chat/react'

function RobustStreamingChat() {
  const {
    status,
    error,
    reconnectAttempt,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',

    // Automatic reconnection
    autoReconnect: true,
    maxReconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,

    // Timeout handling
    connectionTimeout: 15000,
    heartbeatInterval: 30000,

    // Error callbacks
    onError: (error) => {
      console.error('Stream error:', error)

      // Log to monitoring service
      analytics.trackError('streaming_error', {
        error: error.message,
        timestamp: Date.now(),
      })
    },

    onReconnecting: (attempt, delay) => {
      console.log(\`Reconnecting (attempt \${attempt})...\`)

      // Show user feedback
      toast.info(\`Connection lost. Reconnecting...\`)
    },

    onReconnectFailed: () => {
      console.error('Max reconnection attempts reached')

      // Show error to user
      toast.error('Unable to connect. Please refresh the page.')
    },

    // Event buffer overflow
    onEventBufferOverflow: (droppedCount, bufferSize) => {
      console.warn(\`Dropped \${droppedCount} old events\`)
    },
  })

  return (
    <div>
      {/* Error display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">Streaming Error</span>
          </div>
          <p className="text-sm text-red-800 dark:text-red-200 mt-2">
            {error.message}
          </p>
          <button
            onClick={() => connect()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Reconnection indicator */}
      {status === 'connecting' && reconnectAttempt > 0 && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
            <span className="text-sm text-amber-800 dark:text-amber-200">
              Reconnecting (attempt {reconnectAttempt}/5)...
            </span>
          </div>
        </div>
      )}

      {/* Chat content */}
      <MessageList />
    </div>
  )
}`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Common Patterns */}
      <ScrollReveal direction="up" delay={0.6}>
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-8 h-8 text-indigo-500" />
            <h2 className="text-3xl font-bold">Common Patterns</h2>
          </div>

          <h3 className="text-2xl font-semibold mb-4">Pattern 1: Streaming with Stop Generation</h3>
          <CodeBlock language="typescript">
{`function ChatWithStop() {
  const { status, connect, disconnect } = useStreamingSSE({
    url: '/api/chat/stream',
  })

  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const handleSend = (message: string) => {
    const controller = new AbortController()
    setAbortController(controller)

    connect({
      body: { message },
      signal: controller.signal,
    })
  }

  const handleStop = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
  }

  return (
    <div>
      {status === 'streaming' && (
        <button
          onClick={handleStop}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Stop Generation
        </button>
      )}
    </div>
  )
}`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Pattern 2: Token Budget Warnings</h3>
          <CodeBlock language="typescript">
{`function ChatWithBudget() {
  const { tokenStats, onBudgetWarning } = useStreamingSSE({
    url: '/api/chat/stream',
    tokenBudget: 8000,
    enableTokenTracking: true,

    onBudgetWarning: (usage) => {
      if (usage >= 0.9) {
        toast.error('Token budget almost exceeded! Consider clearing history.')
      } else if (usage >= 0.7) {
        toast.warning('Token budget at 70%. Compression recommended.')
      }
    },
  })

  return (
    <div>
      <TokenBudgetIndicator
        current={tokenStats.totalTokens}
        budget={8000}
        showWarnings={true}
      />
    </div>
  )
}`}
          </CodeBlock>

          <h3 className="text-2xl font-semibold mb-4 mt-8">Pattern 3: Streaming with Optimistic Updates</h3>
          <CodeBlock language="typescript">
{`function OptimisticStreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const { connect } = useStreamingSSE({
    url: '/api/chat/stream',

    onMessage: (event) => {
      if (event.type === 'content') {
        // Update the streaming message
        setMessages((prev) => {
          const copy = [...prev]
          const lastMsg = copy[copy.length - 1]
          if (lastMsg?.role === 'assistant') {
            lastMsg.content += event.data.content
          }
          return copy
        })
      }
    },
  })

  const handleSend = (content: string) => {
    // Optimistically add user message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    // Add placeholder for assistant response
    const assistantMsg: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      streaming: true,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])

    // Start streaming
    connect({ body: { message: content } })
  }

  return <MessageList messages={messages} />
}`}
          </CodeBlock>
        </section>
      </ScrollReveal>

      {/* Related Resources */}
      <ScrollReveal direction="up" delay={0.65}>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Related Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/cookbook/streaming-with-memory"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <Radio className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-blue-500 transition-colors">
                  Streaming with Memory
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Complete guide to streaming with persistent conversation memory
              </p>
            </Link>

            <Link
              href="/cookbook/provider-caching-setup"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-purple-500 transition-colors">
                  Provider Caching
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Achieve 90% savings on cached tokens with provider-native caching
              </p>
            </Link>

            <Link
              href="/reference/components/token-optimization"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-emerald-500 transition-colors">
                  Token Optimization
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Complete guide to token optimization and cost reduction
              </p>
            </Link>

            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="group p-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 hover:border-pink-500 dark:hover:border-pink-500 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg group-hover:text-pink-500 transition-colors">
                  50-70% Cost Reduction
                </h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Step-by-step guide to achieving baseline 50-70% savings
              </p>
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* Next Steps */}
      <ScrollReveal direction="up" delay={0.7}>
        <section className="mb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/50">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Start with the <Link href="/cookbook/streaming-with-memory" className="text-blue-500 hover:underline">Streaming with Memory</Link> cookbook for a complete implementation
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Review <Link href="/reference/components/token-optimization" className="text-blue-500 hover:underline">Token Optimization</Link> patterns to maximize savings
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Set up <Link href="/cookbook/provider-caching-setup" className="text-blue-500 hover:underline">Provider Caching</Link> for 90% savings on cached tokens
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
