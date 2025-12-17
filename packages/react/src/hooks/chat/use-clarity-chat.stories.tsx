/**
 * useClarityChat Storybook Stories
 *
 * Demonstrates the flagship chat hook with memory and transport options
 */

import type { Meta, StoryObj } from '@storybook/react'
import React, { useMemo } from 'react'
import { useClarityChat, coreMessagesToMessages } from './use-clarity-chat'
import { ChatWindow } from '../../components/chat/chat-window'
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Button,
} from '@clarity-chat/primitives'
import { MemoryProvider } from '../../memory/memory-provider'

const meta = {
  title: 'Hooks/useClarityChat',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Flagship chat hook that wraps useChatEnhanced with Clarity-specific enhancements.

## Features
- Full Vercel AI SDK compatibility
- Memory integration (3 strategies)
- Transport selection (SSE/WebSocket)
- Context enrichment
- Auto memory capture
- Enhanced error handling

## Usage

\`\`\`tsx
import { useClarityChat, ChatWindow, coreMessagesToMessages } from '@clarity-chat/react'

const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window'
  }
})

const messages = useMemo(
  () => coreMessagesToMessages(chat.messages),
  [chat.messages]
)

<ChatWindow
  messages={messages}
  isLoading={chat.isLoading}
  onSendMessage={async (content) => {
    await chat.append({ role: 'user', content })
  }}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Mock API handler for Storybook
const mockChatAPI = async (messages: any[]): Promise<Response> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const lastMessage = messages[messages.length - 1]
  const response = `This is a mock response to: "${lastMessage.content}". In a real implementation, this would call your AI API.`

  return new Response(
    JSON.stringify({
      choices: [
        {
          delta: { content: response },
          finish_reason: 'stop',
        },
      ],
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

export const BasicChat: Story = {
  render: () => {
    const chat = useClarityChat({
      api: '/api/chat',
      fetch: async (url, options) => {
        const body = JSON.parse((options?.body as string) || '{}')
        return mockChatAPI(body.messages || [])
      },
    })

    const messages = useMemo(
      () => coreMessagesToMessages(chat.messages),
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

export const WithMemory: Story = {
  render: () => {
    const chat = useClarityChat({
      api: '/api/chat',
      memory: {
        enabled: true,
        strategy: 'sliding-window',
        maxTokens: 1000,
      },
      fetch: async (url, options) => {
        const body = JSON.parse((options?.body as string) || '{}')
        return mockChatAPI(body.messages || [])
      },
    })

    const messages = useMemo(
      () => coreMessagesToMessages(chat.messages),
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

export const WithTransport: Story = {
  render: () => {
    const [transport, setTransport] = React.useState<'sse' | 'websocket'>('sse')

    const chat = useClarityChat({
      api: '/api/chat',
      transport,
      fetch: async (url, options) => {
        const body = JSON.parse((options?.body as string) || '{}')
        return mockChatAPI(body.messages || [])
      },
    })

    const messages = useMemo(
      () => coreMessagesToMessages(chat.messages),
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

export const AdvancedFeatures: Story = {
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
      fetch: async (url, options) => {
        const body = JSON.parse((options?.body as string) || '{}')
        return mockChatAPI(body.messages || [])
      },
    })

    const messages = useMemo(
      () => coreMessagesToMessages(chat.messages),
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
