import type { Meta, StoryObj } from '@storybook/react-vite'
import { useClarityChat, ChatWindow, MemoryProvider, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { Button, Card, Badge } from '@clarity-chat/primitives'
import { useState, useMemo } from 'react'

/**
 * **useClarityChat Hook - Essentials Track**
 * 
 * This track focuses on the most common use cases for useClarityChat.
 * These examples are production-ready and can be copied directly into your app.
 * 
 * For advanced patterns, see the "Enterprise" track.
 */
const meta = {
  title: 'Hooks/useClarityChat/Essentials',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useClarityChat\` hook is Clarity's flagship API for building AI chat
interfaces. This track shows the essential patterns you'll use in 90% of cases.

## When to Use

- Building AI chat interfaces
- Simple chat applications
- Quick prototypes
- Learning Clarity Chat

## Quick Start

\`\`\`tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
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

/**
 * **Essential Pattern 1: Basic Chat**
 * 
 * The simplest use case - a basic chat interface with minimal configuration.
 * This is what you'll use most often.
 */
export const BasicChat: Story = {
  render: () => {
    const {
      messages: coreMessages,
      append,
      isLoading,
      error,
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
          <h3 className="text-lg font-semibold mb-4">Basic Chat</h3>
          
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
  },
  parameters: {
    docs: {
      description: {
        story: `
The most basic chat setup. This is the foundation for all other patterns.

**Features:**
- Message sending
- Loading states
- Error handling
- Basic UI

**When to use:**
- Quick prototypes
- Simple chat apps
- Learning Clarity Chat
        `,
      },
    },
  },
}

/**
 * **Essential Pattern 2: With ChatWindow**
 * 
 * Use the ChatWindow component for a complete, production-ready interface.
 * This is the recommended pattern for most applications.
 */
export const WithChatWindow: Story = {
  render: () => {
    const {
      messages: coreMessages,
      append,
      isLoading,
    } = useClarityChat({
      api: '/api/chat',
    })

    const messages = useMemo(
      () => convertCoreMessagesToMessages(coreMessages),
      [coreMessages]
    )

    return (
      <div className="w-full max-w-4xl">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">With ChatWindow Component</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Using ChatWindow provides a complete, production-ready interface with
            all features built-in.
          </p>
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={async (content) => {
              await append({ role: 'user', content })
            }}
          />
        </Card>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Use ChatWindow for a complete chat interface. This is the recommended
pattern for production applications.

**Features:**
- Complete UI (messages, input, actions)
- Built-in animations
- Accessibility features
- Mobile responsive

**When to use:**
- Production applications
- Quick development
- Standard chat interfaces
        `,
      },
    },
  },
}

/**
 * **Essential Pattern 3: With Memory**
 * 
 * Enable conversation memory for context-aware responses.
 * This is essential for multi-turn conversations.
 */
export const WithMemory: Story = {
  render: () => {
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
        strategy: 'sliding-window',
        maxTokens: 4000,
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
            <h3 className="text-lg font-semibold">With Memory Enabled</h3>
            {memoryEnabled && (
              <Badge variant="success">Memory Active</Badge>
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
                Memory is enabled. Start a conversation to see context management!
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
  },
  parameters: {
    docs: {
      description: {
        story: `
Enable conversation memory for context-aware responses. This is essential
for multi-turn conversations where context matters.

**Features:**
- Context management
- Memory strategies
- Context summaries
- Token optimization

**When to use:**
- Multi-turn conversations
- Context-dependent responses
- Long conversations
- Enterprise applications
        `,
      },
    },
  },
}
