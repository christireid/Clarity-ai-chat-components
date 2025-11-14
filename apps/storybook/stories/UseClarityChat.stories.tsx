import type { Meta, StoryObj } from '@storybook/react'
import { useClarityChat, ChatWindow, MemoryProvider, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { Button, Card, Badge, Select } from '@clarity-chat/primitives'
import { useState, useMemo } from 'react'

/**
 * **useClarityChat Hook (Flagship API)**
 * 
 * Clarity's flagship chat hook that extends useChatEnhanced with:
 * - Memory integration (sliding-window, semantic-chunks, vector-store)
 * - Transport selection (SSE/WebSocket)
 * - Context enrichment
 * - Auto memory capture
 * 
 * **Key Features:**
 * - Full Vercel AI SDK compatibility
 * - Memory-aware conversations
 * - Configurable memory strategies
 * - Transport protocol selection
 * - Context summary generation
 * - Auto memory capture
 * 
 * **Use Cases:**
 * - Production AI chat applications
 * - Long-context conversations
 * - Memory-enabled assistants
 * - Enterprise chat solutions
 * - Multi-turn conversations with context
 */
const meta = {
  title: 'Hooks/useClarityChat (Flagship)',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useClarityChat\` hook is Clarity's flagship API for building production-ready
AI chat applications with memory integration and advanced features.

## Features

- ✅ Full Vercel AI SDK compatibility
- ✅ Memory integration with multiple strategies
- ✅ Transport protocol selection (SSE/WebSocket)
- ✅ Context enrichment
- ✅ Auto memory capture
- ✅ Context summary generation
- ✅ Memory status tracking

## Memory Strategies

- **sliding-window**: Fast, recent context only (best for short conversations)
- **semantic-chunks**: Context-aware retrieval (best for medium conversations)
- **vector-store**: Long-term memory (best for enterprise applications)

## Basic Usage

\`\`\`tsx
import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading, memoryEnabled, contextSummary } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
    transport: 'sse',
  })

  return <ChatWindow messages={messages} onSendMessage={(content) => append({ role: 'user', content })} />
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Mock API function
const mockApiCall = async (messages: any[]) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const lastMessage = messages[messages.length - 1]
  const response = `Response to: "${lastMessage.content}"`
  
  return new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()
        const chunks = response.split(' ')
        
        chunks.forEach((chunk, index) => {
          setTimeout(() => {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk + ' ' })}\n\n`)
            )
            if (index === chunks.length - 1) {
              controller.close()
            }
          }, index * 50)
        })
      },
    })
  )
}

// Mock fetch
global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
  if (typeof url === 'string' && url.includes('/api/chat')) {
    const body = JSON.parse(init?.body as string)
    return mockApiCall(body.messages || [])
  }
  throw new Error('Unknown endpoint')
}

function BasicDemo() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
    memoryEnabled,
    contextSummary,
  } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    await append({
      role: 'user',
      content: input,
    })
    setInput('')
  }

  return (
    <div className="space-y-4 w-full max-w-4xl">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Basic useClarityChat</h3>
          {memoryEnabled && (
            <Badge variant="success">Memory Enabled</Badge>
          )}
        </div>
        
        {contextSummary && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Memory Context:
            </p>
            <p className="text-xs text-foreground/80">{contextSummary}</p>
          </div>
        )}

        <div className="border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start a conversation!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-50 ml-12'
                      : 'bg-gray-50 mr-12'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{msg.role}</div>
                  <div className="text-sm">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="text-muted-foreground text-sm">Thinking...</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>

        {error && (
          <div className="mt-2 text-red-600 text-sm">
            Error: {error.message}
          </div>
        )}
      </Card>
    </div>
  )
}

function MemoryStrategiesDemo() {
  const [strategy, setStrategy] = useState<
    'sliding-window' | 'semantic-chunks' | 'vector-store'
  >('sliding-window')

  const {
    messages: coreMessages,
    append,
    isLoading,
    memoryEnabled,
    contextSummary,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy,
      maxTokens: 4000,
      autoCapture: true,
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    await append({
      role: 'user',
      content: input,
    })
    setInput('')
  }

  return (
    <div className="space-y-4 w-full max-w-4xl">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Memory Strategies</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Strategy:</label>
            <Select
              value={strategy}
              onValueChange={(value: any) => setStrategy(value)}
            >
              <option value="sliding-window">Sliding Window</option>
              <option value="semantic-chunks">Semantic Chunks</option>
              <option value="vector-store">Vector Store</option>
            </Select>
          </div>
        </div>

        {memoryEnabled && (
          <Badge variant="success" className="mb-4">
            Memory Active: {strategy}
          </Badge>
        )}

        {contextSummary && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Context Summary:
            </p>
            <p className="text-xs text-foreground/80">{contextSummary}</p>
          </div>
        )}

        <div className="border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Try different strategies to see how memory works!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-50 ml-12'
                      : 'bg-gray-50 mr-12'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{msg.role}</div>
                  <div className="text-sm">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="text-muted-foreground text-sm">Thinking...</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}

function TransportDemo() {
  const [transport, setTransport] = useState<'sse' | 'websocket'>('sse')

  const {
    messages: coreMessages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    transport,
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    await append({
      role: 'user',
      content: input,
    })
    setInput('')
  }

  return (
    <div className="space-y-4 w-full max-w-4xl">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transport Selection</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Transport:</label>
            <Select
              value={transport}
              onValueChange={(value: any) => setTransport(value)}
            >
              <option value="sse">SSE (Server-Sent Events)</option>
              <option value="websocket">WebSocket</option>
            </Select>
          </div>
        </div>

        <Badge variant="info" className="mb-4">
          Using: {transport.toUpperCase()}
        </Badge>

        <div className="border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Switch transports to see the difference!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-50 ml-12'
                      : 'bg-gray-50 mr-12'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{msg.role}</div>
                  <div className="text-sm">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="text-muted-foreground text-sm">Thinking...</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  )
}

function FullFeaturedDemo() {
  const [memoryStrategy, setMemoryStrategy] = useState<
    'sliding-window' | 'semantic-chunks' | 'vector-store'
  >('sliding-window')
  const [transport, setTransport] = useState<'sse' | 'websocket'>('sse')
  const [memoryEnabled, setMemoryEnabled] = useState(false)

  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
    memoryEnabled: hookMemoryEnabled,
    contextSummary,
  } = useClarityChat({
    api: '/api/chat',
    memory: memoryEnabled
      ? {
          enabled: true,
          strategy: memoryStrategy,
          maxTokens: 4000,
          autoCapture: true,
        }
      : undefined,
    transport,
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    await append({
      role: 'user',
      content: input,
    })
    setInput('')
  }

  return (
    <div className="space-y-4 w-full max-w-4xl">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Full-Featured Configuration</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enable-memory"
              checked={memoryEnabled}
              onChange={(e) => setMemoryEnabled(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="enable-memory" className="text-sm font-medium">
              Enable Memory
            </label>
          </div>

          {memoryEnabled && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Strategy:</label>
              <Select
                value={memoryStrategy}
                onValueChange={(value: any) => setMemoryStrategy(value)}
              >
                <option value="sliding-window">Sliding Window</option>
                <option value="semantic-chunks">Semantic Chunks</option>
                <option value="vector-store">Vector Store</option>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Transport:</label>
            <Select
              value={transport}
              onValueChange={(value: any) => setTransport(value)}
            >
              <option value="sse">SSE</option>
              <option value="websocket">WebSocket</option>
            </Select>
          </div>
        </div>

        {hookMemoryEnabled && (
          <Badge variant="success" className="mb-4">
            Memory Active: {memoryStrategy}
          </Badge>
        )}

        {contextSummary && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Memory Context:
            </p>
            <p className="text-xs text-foreground/80 line-clamp-2">
              {contextSummary}
            </p>
          </div>
        )}

        <div className="border rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Configure memory and transport, then start chatting!
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-50 ml-12'
                      : 'bg-gray-50 mr-12'
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">{msg.role}</div>
                  <div className="text-sm">{msg.content}</div>
                </div>
              ))}
              {isLoading && (
                <div className="text-muted-foreground text-sm">Thinking...</div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>

        {error && (
          <div className="mt-2 text-red-600 text-sm">
            Error: {error.message}
          </div>
        )}
      </Card>
    </div>
  )
}

export const Basic: Story = {
  render: () => (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <BasicDemo />
    </MemoryProvider>
  ),
}

export const MemoryStrategies: Story = {
  render: () => (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <MemoryStrategiesDemo />
    </MemoryProvider>
  ),
}

export const TransportSelection: Story = {
  render: () => (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <TransportDemo />
    </MemoryProvider>
  ),
}

export const FullFeatured: Story = {
  render: () => (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <FullFeaturedDemo />
    </MemoryProvider>
  ),
}
