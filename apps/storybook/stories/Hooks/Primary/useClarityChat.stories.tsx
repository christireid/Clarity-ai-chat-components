/**
 * useClarityChat Storybook Stories
 *
 * The primary hook for managing AI chat state and interactions.
 * Use this hook when you need full control over the chat UI while
 * letting Clarity Chat handle the complex state management.
 *
 * ## Features
 * - Automatic streaming handling
 * - Built-in memory support
 * - Transport selection (SSE/WebSocket)
 * - Context enrichment
 * - Full TypeScript support
 *
 * ## Return Value
 * ```typescript
 * {
 *   messages: CoreMessage[]      // All messages in the conversation
 *   input: string                // Current input value
 *   handleInputChange: (e) => void
 *   handleSubmit: (e?) => void
 *   isLoading: boolean           // True while waiting for response
 *   error: Error | null          // Most recent error
 *   setMessages: (messages) => void
 *   append: (message) => void
 *   reload: () => void           // Regenerate last response
 *   stop: () => void             // Stop current generation
 *   memoryInfo: ClarityChatMemoryInfo
 * }
 * ```
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useMemo } from 'react'
import { http, HttpResponse, delay } from 'msw'
import {
  useClarityChat,
  convertCoreMessagesToMessages,
  ChatWindow,
  MemoryProvider,
} from '@clarity-chat/react'
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Button,
} from '@clarity-chat/primitives'

const meta = {
  title: 'Hooks/Primary/useClarityChat',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The primary hook for AI chat functionality. Manages messages, streaming, ' +
          'memory, and provides a simple API for building custom chat interfaces.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

/**
 * Mock handlers for MSW - Simulates streaming AI responses
 */
const createMockHandlers = (
  responseText: string = "Hello! I'm powered by the useClarityChat hook. How can I help you?"
) => [
  http.post('/api/chat', async () => {
    await delay(300)

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = responseText.split(' ')

        for (const word of words) {
          await delay(30)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ content: word + ' ' })}\n\n`
            )
          )
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
      },
    })
  }),
]

/**
 * Basic usage of the useClarityChat hook.
 * Shows a simple chat interface with streaming responses.
 */
export const BasicChat: Story = {
  parameters: {
    msw: { handlers: createMockHandlers() },
    docs: {
      description: {
        story:
          'The most basic usage of useClarityChat. Connect to an API endpoint ' +
          'and the hook handles streaming, state management, and message formatting.',
      },
    },
  },
  render: () => {
    const chat = useClarityChat({
      api: '/api/chat',
    })

    const messages = useMemo(
      () => convertCoreMessagesToMessages(chat.messages),
      [chat.messages]
    )

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Basic Chat</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Simple chat interface using useClarityChat
          </p>
        </div>

        <div className="border rounded-lg" style={{ height: '500px' }}>
          <ChatWindow
            messages={messages}
            isLoading={chat.isLoading}
            onSendMessage={async (content) => {
              await chat.append({ role: 'user', content })
            }}
          />
        </div>

        {chat.error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive">
                Error: {chat.error.message}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  },
}

/**
 * Chat with memory integration enabled.
 * Uses the sliding-window strategy to maintain conversation context.
 */
export const WithMemory: Story = {
  parameters: {
    msw: {
      handlers: createMockHandlers(
        "I'll remember our conversation! Using sliding-window memory to maintain context across turns."
      ),
    },
    docs: {
      description: {
        story:
          'When memory is enabled, the hook automatically enriches prompts with ' +
          'relevant context from previous conversations.',
      },
    },
  },
  render: () => {
    const chat = useClarityChat({
      api: '/api/chat',
      memory: {
        enabled: true,
        strategy: 'sliding-window',
        maxTokens: 1000,
      },
    })

    const messages = useMemo(
      () => convertCoreMessagesToMessages(chat.messages),
      [chat.messages]
    )

    return (
      <MemoryProvider>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Chat with Memory</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with memory integration enabled (sliding-window strategy)
            </p>
          </div>

          <div className="flex gap-2 mb-2">
            <Badge variant={chat.memoryInfo.enabled ? 'default' : 'secondary'}>
              Memory: {chat.memoryInfo.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
            {chat.memoryInfo.lastContextSummary && (
              <Badge variant="outline">
                Context: {chat.memoryInfo.lastContextSummary.substring(0, 50)}
                ...
              </Badge>
            )}
          </div>

          <div className="border rounded-lg" style={{ height: '500px' }}>
            <ChatWindow
              messages={messages}
              isLoading={chat.isLoading}
              onSendMessage={async (content) => {
                await chat.append({ role: 'user', content })
              }}
            />
          </div>

          {chat.memoryErrorInfo.hasError && (
            <Card className="border-yellow-500">
              <CardContent className="pt-6">
                <div className="text-yellow-700">
                  Memory Warning: {chat.memoryErrorInfo.lastError?.message}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MemoryProvider>
    )
  },
}

/**
 * Chat with transport selection.
 * Toggle between SSE and WebSocket transport protocols.
 */
export const WithTransport: Story = {
  parameters: {
    msw: { handlers: createMockHandlers() },
    docs: {
      description: {
        story:
          'useClarityChat supports both SSE and WebSocket transports. ' +
          'SSE is the default and works great for most use cases. ' +
          'WebSocket provides bidirectional communication for advanced scenarios.',
      },
    },
  },
  render: () => {
    const [transport, setTransport] = React.useState<'sse' | 'websocket'>('sse')

    const chat = useClarityChat({
      api: '/api/chat',
      transport,
    })

    const messages = useMemo(
      () => convertCoreMessagesToMessages(chat.messages),
      [chat.messages]
    )

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Chat with Transport Selection
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose between SSE and WebSocket transport protocols
          </p>
        </div>

        <div className="flex gap-2 mb-2">
          <Button
            variant={transport === 'sse' ? 'default' : 'outline'}
            onClick={() => setTransport('sse')}
            size="sm"
          >
            SSE
          </Button>
          <Button
            variant={transport === 'websocket' ? 'default' : 'outline'}
            onClick={() => setTransport('websocket')}
            size="sm"
          >
            WebSocket
          </Button>
          <Badge variant="outline">Current: {transport.toUpperCase()}</Badge>
        </div>

        <div className="border rounded-lg" style={{ height: '500px' }}>
          <ChatWindow
            messages={messages}
            isLoading={chat.isLoading}
            onSendMessage={async (content) => {
              await chat.append({ role: 'user', content })
            }}
          />
        </div>
      </div>
    )
  },
}

/**
 * Advanced features demonstration.
 * Shows memory with semantic-chunks, user/thread IDs, and callbacks.
 */
export const AdvancedFeatures: Story = {
  parameters: {
    msw: {
      handlers: createMockHandlers(
        'This is an advanced chat with semantic-chunks memory, user tracking, and callback integration.'
      ),
    },
    docs: {
      description: {
        story:
          'For enterprise use cases, useClarityChat supports advanced features like ' +
          'semantic memory chunking, user/thread identification, and lifecycle callbacks.',
      },
    },
  },
  render: () => {
    const chat = useClarityChat({
      api: '/api/chat',
      memory: {
        enabled: true,
        strategy: 'semantic-chunks',
        maxTokens: 2000,
      },
      transport: 'sse',
      userId: 'user-123',
      threadId: 'thread-456',
      onFinish: (message) => {
        console.log('Message finished:', message)
      },
    })

    const messages = useMemo(
      () => convertCoreMessagesToMessages(chat.messages),
      [chat.messages]
    )

    return (
      <MemoryProvider>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Advanced Features</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with memory, user/thread IDs, and callbacks
            </p>
          </div>

          <Card>
            <CardHeader>
              <h4 className="font-semibold">Configuration</h4>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Memory:</strong>{' '}
                  {chat.memoryInfo.enabled ? 'Enabled' : 'Disabled'}(
                  {chat.memoryInfo.strategy || 'none'})
                </div>
                <div>
                  <strong>Transport:</strong> SSE
                </div>
                <div>
                  <strong>User ID:</strong> user-123
                </div>
                <div>
                  <strong>Thread ID:</strong> thread-456
                </div>
                <div>
                  <strong>Messages:</strong> {messages.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="border rounded-lg" style={{ height: '500px' }}>
            <ChatWindow
              messages={messages}
              isLoading={chat.isLoading}
              onSendMessage={async (content) => {
                await chat.append({ role: 'user', content })
              }}
            />
          </div>

          {chat.error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="text-destructive">
                  Error: {chat.error.message}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MemoryProvider>
    )
  },
}
