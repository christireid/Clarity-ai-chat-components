import { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = {
  title: 'Streaming with Memory | Clarity Chat Cookbook',
  description:
    'Build a production chat with streaming responses, persistent memory, and RAG-powered context',
}

export default function StreamingWithMemoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Streaming with Memory & RAG</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Build a complete chat system with streaming responses, persistent
        conversation memory, and RAG-powered document context.
      </p>

      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            This recipe combines three powerful features: streaming for
            real-time responses, persistent memory for conversation history, and
            RAG for document-grounded answers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl mb-2">🌊</div>
              <h3 className="font-semibold mb-1">Streaming</h3>
              <p className="text-sm text-muted-foreground">
                Token-by-token responses with progress indicators
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-semibold mb-1">Memory</h3>
              <p className="text-sm text-muted-foreground">
                Persistent conversations across sessions
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold mb-1">RAG</h3>
              <p className="text-sm text-muted-foreground">
                Document-grounded responses with citations
              </p>
            </div>
          </div>
        </section>

        {/* Prerequisites */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Prerequisites</h2>
          <CodeBlock language="bash">
            {`npm install @clarity-chat/react @clarity-chat/memory
npm install @anthropic-ai/sdk
npm install @vercel/kv  # or another KV store`}
          </CodeBlock>
        </section>

        {/* Step 1: Memory Store */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Step 1: Set Up Memory Store
          </h2>
          <p className="mb-4">
            Create{' '}
            <code className="px-2 py-1 bg-muted rounded text-sm">
              lib/memory.ts
            </code>
          </p>
          <CodeBlock language="typescript">
            {`import { kv } from '@vercel/kv'
import { ContextManager } from '@/lib/ai/contextManager'

export interface StoredMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    intent?: string
    qualityScore?: number
    sources?: string[]
  }
}

export class ConversationMemory {
  private contextManager: ContextManager

  constructor() {
    this.contextManager = new ContextManager({
      maxContextTokens: 100000,
      targetCompressionRatio: 0.3,
    })
  }

  // Store message in KV
  async storeMessage(sessionId: string, message: StoredMessage) {
    const key = \`conversation:\${sessionId}\`
    const messages = await this.getMessages(sessionId)
    messages.push(message)

    // Store with 7-day TTL
    await kv.setex(key, 60 * 60 * 24 * 7, JSON.stringify(messages))
  }

  // Get all messages for a session
  async getMessages(sessionId: string): Promise<StoredMessage[]> {
    const key = \`conversation:\${sessionId}\`
    const data = await kv.get(key)
    return data ? JSON.parse(data as string) : []
  }

  // Get compressed messages for context window
  async getCompressedContext(sessionId: string, preserveRecent = 2) {
    const messages = await this.getMessages(sessionId)

    if (messages.length <= 5) {
      return messages
    }

    // Compress older messages
    const compressed = await this.contextManager.compressConversation(
      messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      })),
      {
        preserveRecent,
        targetRatio: 0.4,
      }
    )

    return compressed
  }

  // Clear session
  async clearSession(sessionId: string) {
    await kv.del(\`conversation:\${sessionId}\`)
  }
}`}
          </CodeBlock>
        </section>

        {/* Step 2: Streaming API */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Step 2: Create Streaming API
          </h2>
          <p className="mb-4">
            Create{' '}
            <code className="px-2 py-1 bg-muted rounded text-sm">
              app/api/chat-stream/route.ts
            </code>
          </p>
          <CodeBlock language="typescript">
            {`import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { ConversationMemory } from '@/lib/memory'
import { processQuery } from '@/lib/ai/query-processing'
import { getOptimizedRAG } from '@/lib/ai/ragOptimized'
import { validateResponse } from '@/lib/ai/prompts/response-validation'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const memory = new ConversationMemory()

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()
  const { message, sessionId } = await request.json()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 1. Store user message
        await memory.storeMessage(sessionId, {
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        })

        // 2. Process query
        const processed = await processQuery(message, {
          conversationId: sessionId,
          domain: 'docs',
        })

        controller.enqueue(
          encoder.encode(
            \`data: \${JSON.stringify({
              type: 'metadata',
              intent: processed.intent,
              confidence: processed.confidence,
            })}\\n\\n\`
          )
        )

        // 3. Get RAG context
        const rag = await getOptimizedRAG()
        const context = await rag.retrieve(processed.expandedQuery, { topK: 5 })

        // 4. Get conversation history
        const history = await memory.getCompressedContext(sessionId, 2)

        // 5. Generate streaming response
        const systemPrompt = \`You are a helpful AI assistant.

Documentation context:
\${context.map((doc, i) => \`[\${i + 1}] \${doc.content}\`).join('\\n\\n')}

Always cite sources using [1], [2], etc.\`

        const claudeStream = await anthropic.messages.stream({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          system: systemPrompt,
          messages: [
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: message },
          ],
        })

        let fullResponse = ''
        let sources: string[] = []

        for await (const event of claudeStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            fullResponse += event.delta.text
            controller.enqueue(
              encoder.encode(
                \`data: \${JSON.stringify({ text: event.delta.text })}\\n\\n\`
              )
            )
          }
        }

        // 6. Validate quality
        const validation = validateResponse(
          fullResponse,
          {
            hasMinLength: fullResponse.length >= 50,
            hasCitations: /\\[\\d+\\]/.test(fullResponse),
            notEmpty: fullResponse.trim().length > 0,
          },
          message
        )

        // Extract sources from citations
        const citations = fullResponse.match(/\\[(\\d+)\\]/g) || []
        sources = [
          ...new Set(
            citations.map((c) => {
              const idx = parseInt(c.slice(1, -1)) - 1
              return context[idx]?.metadata?.title || \`Source \${idx + 1}\`
            })
          ),
        ]

        // 7. Store assistant message
        await memory.storeMessage(sessionId, {
          role: 'assistant',
          content: fullResponse,
          timestamp: new Date().toISOString(),
          metadata: {
            intent: processed.intent,
            qualityScore: validation.score,
            sources,
          },
        })

        // 8. Send final metadata
        controller.enqueue(
          encoder.encode(
            \`data: \${JSON.stringify({
              type: 'complete',
              qualityScore: validation.score,
              sources,
            })}\\n\\n\`
          )
        )

        controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
        controller.close()
      } catch (error) {
        console.error('Stream error:', error)
        controller.error(error)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}`}
          </CodeBlock>
        </section>

        {/* Step 3: Client Component */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Step 3: Create Chat Component
          </h2>
          <CodeBlock language="typescript">
            {`'use client'

import { useState, useEffect } from 'react'
import { ChatWindow, Message } from '@clarity-chat/react'
import { v4 as uuidv4 } from 'uuid'

export function PersistentRAGChat() {
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [metadata, setMetadata] = useState({
    intent: '',
    qualityScore: 0,
    sources: [] as string[],
  })

  // Initialize or restore session
  useEffect(() => {
    const stored = localStorage.getItem('chat-session-id')
    if (stored) {
      setSessionId(stored)
      loadHistory(stored)
    } else {
      const newId = uuidv4()
      setSessionId(newId)
      localStorage.setItem('chat-session-id', newId)
    }
  }, [])

  const loadHistory = async (id: string) => {
    const response = await fetch(\`/api/chat-history?sessionId=\${id}\`)
    const { messages } = await response.json()
    setMessages(
      messages.map((m: any) => ({
        id: \`\${m.timestamp}-\${m.role}\`,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp),
        metadata: m.metadata,
      }))
    )
  }

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, sessionId }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)

              if (parsed.text) {
                assistantContent += parsed.text
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: assistantContent }
                      : m
                  )
                )
              } else if (parsed.type === 'metadata') {
                setMetadata((prev) => ({
                  ...prev,
                  intent: parsed.intent,
                  confidence: parsed.confidence,
                }))
              } else if (parsed.type === 'complete') {
                setMetadata((prev) => ({
                  ...prev,
                  qualityScore: parsed.qualityScore,
                  sources: parsed.sources,
                }))
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = async () => {
    await fetch(\`/api/chat-clear?sessionId=\${sessionId}\`, { method: 'POST' })
    setMessages([])
    const newId = uuidv4()
    setSessionId(newId)
    localStorage.setItem('chat-session-id', newId)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Session: <code className="text-xs">{sessionId.slice(0, 8)}</code>
        </div>
        <button
          onClick={handleClearHistory}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear History
        </button>
      </div>

      <ChatWindow
        messages={messages}
        onSend={handleSend}
        isLoading={isLoading}
        placeholder="Ask anything... (messages are saved)"
      />

      {/* Metadata Display */}
      {metadata.intent && (
        <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
          <div>
            <strong>Intent:</strong> {metadata.intent}
          </div>
          {metadata.qualityScore > 0 && (
            <div>
              <strong>Quality:</strong> {metadata.qualityScore}/100
            </div>
          )}
          {metadata.sources.length > 0 && (
            <div>
              <strong>Sources:</strong>{' '}
              {metadata.sources.map((s, i) => (
                <span key={i} className="inline-block mr-2">
                  [{i + 1}] {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}`}
          </CodeBlock>
        </section>

        {/* Features Explained */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
              <h3 className="font-semibold mb-2">1. Message Storage</h3>
              <p className="text-sm">
                Every message is stored in KV with a 7-day TTL. Messages include
                metadata like intent, quality score, and sources for future
                reference.
              </p>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
              <h3 className="font-semibold mb-2">2. Context Compression</h3>
              <p className="text-sm">
                When conversations exceed 5 messages, older messages are
                automatically compressed while preserving the last 2 messages.
                This saves 30-70% tokens.
              </p>
            </div>

            <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
              <h3 className="font-semibold mb-2">3. RAG Integration</h3>
              <p className="text-sm">
                Each query triggers document retrieval with query expansion and
                caching. Retrieved context is injected into the system prompt
                with citation markers.
              </p>
            </div>

            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950">
              <h3 className="font-semibold mb-2">4. Streaming Response</h3>
              <p className="text-sm">
                Responses stream token-by-token for immediate feedback. Quality
                validation happens after streaming completes, then results are
                stored for session continuity.
              </p>
            </div>
          </div>
        </section>

        {/* Environment Variables */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Environment Variables</h2>
          <CodeBlock language="bash">
            {`ANTHROPIC_API_KEY=your_key_here
KV_URL=your_kv_url  # Vercel KV, Upstash, or similar
ENHANCED_RAG=true`}
          </CodeBlock>
        </section>

        {/* Benefits */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-2xl">💾</span>
              <div>
                <strong>Persistent Memory</strong>
                <p className="text-sm text-muted-foreground">
                  Conversations are saved and can be resumed across sessions.
                  Perfect for long-running projects or multi-day discussions.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <strong>Real-time Streaming</strong>
                <p className="text-sm text-muted-foreground">
                  Users see responses immediately as they're generated,
                  improving perceived performance and engagement.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <strong>Context-Aware RAG</strong>
                <p className="text-sm text-muted-foreground">
                  System understands conversation history and retrieves relevant
                  documents based on full context, not just the latest message.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">💰</span>
              <div>
                <strong>Cost Efficient</strong>
                <p className="text-sm text-muted-foreground">
                  Automatic compression reduces token usage by 30-70% in long
                  conversations, significantly lowering API costs.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Next Steps */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/cookbook/rag-document-chat"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <strong>📚 Basic RAG Chat</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Start with a simpler RAG implementation
              </p>
            </a>
            <a
              href="/examples/enhanced-rag"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <strong>🔍 Interactive Demo</strong>
              <p className="text-sm text-muted-foreground mt-1">
                See enhanced RAG features in action
              </p>
            </a>
            <a
              href="/reference/rag-system"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <strong>📖 Full Documentation</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Complete RAG system reference
              </p>
            </a>
            <a
              href="/guides/memory"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <strong>🧠 Memory Guide</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Deep dive into memory management
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
