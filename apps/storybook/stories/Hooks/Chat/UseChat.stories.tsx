import type { Meta, StoryObj } from '@storybook/react'
import { useChat } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

/**
 * **useChat Hook**
 * 
 * The core hook for managing chat state, messages, and async operations.
 * 
 * **Key Features:**
 * - Message state management
 * - Async message sending with AbortController support
 * - Error handling and retry logic
 * - Loading states
 * - Message history
 * 
 * **Use Cases:**
 * - Chat applications
 * - Messaging interfaces
 * - AI assistants
 * - Customer support
 */
const meta = {
  title: 'Hooks/Chat/UseChat',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useChat\` hook provides complete chat state management with message handling,
async operations, error recovery, and loading states.

## Features

- ✅ Message state management
- ✅ Async message sending with cancellation support
- ✅ Error handling and retry logic
- ✅ Loading states
- ✅ Message history management
- ✅ AbortController integration

## Basic Usage

\`\`\`tsx
const { messages, sendMessage, isLoading, error, retry, clear } = useChat({
  initialMessages: [],
  onSendMessage: async (message, { signal }) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(message),
      signal
    })
    return response.json()
  }
})
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
const mockSendMessage = async (message: Message): Promise<Message> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: `Echo: ${message.content}`,
    createdAt: Date.now(),
    status: 'sent',
  }
}

function ChatDemo() {
  const { messages, sendMessage, isLoading, error, retry, clear } = useChat({
    initialMessages: [],
    onSendMessage: async (message) => {
      return mockSendMessage(message)
    },
  })

  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return
    await sendMessage(input)
    setInput('')
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                  : 'bg-muted mr-auto max-w-[80%]'
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {msg.role === 'user' ? 'You' : 'Assistant'}
              </div>
              <div className="text-sm">{msg.content}</div>
              {msg.status === 'error' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => retry(msg.id)}
                  className="mt-2"
                >
                  Retry
                </Button>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-muted-foreground text-sm">Thinking...</div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          Error: {error.message}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg"
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </Button>
        {messages.length > 0 && (
          <Button variant="outline" onClick={clear}>
            Clear
          </Button>
        )}
      </div>

      <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
        <div>
          <strong>Messages:</strong> {messages.length}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Error:</strong> {error ? error.message : 'None'}
        </div>
      </div>
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <ChatDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic chat interface using useChat hook with message sending and display.',
      },
    },
  },
}

function ChatWithInitialMessages() {
  const { messages, sendMessage, isLoading } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'user',
        content: 'Hello!',
        createdAt: Date.now() - 60000,
        status: 'sent',
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Hi there! How can I help you today?',
        createdAt: Date.now() - 30000,
        status: 'sent',
      },
    ],
    onSendMessage: async (message) => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `You said: "${message.content}". How can I assist?`,
        createdAt: Date.now(),
        status: 'sent',
      }
    },
  })

  const [input, setInput] = useState('')

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                : 'bg-muted mr-auto max-w-[80%]'
            }`}
          >
            <div className="text-sm">{msg.content}</div>
          </div>
        ))}
        {isLoading && <div className="text-muted-foreground">Typing...</div>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading && input.trim()) {
              sendMessage(input)
              setInput('')
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg"
          disabled={isLoading}
        />
        <Button
          onClick={() => {
            sendMessage(input)
            setInput('')
          }}
          disabled={isLoading || !input.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export const WithInitialMessages: Story = {
  render: () => <ChatWithInitialMessages />,
  parameters: {
    docs: {
      description: {
        story: 'Chat with pre-populated initial messages.',
      },
    },
  },
}

function ChatWithErrorHandling() {
  const { messages, sendMessage, isLoading, error, retry } = useChat({
    onSendMessage: async (message) => {
      // Simulate random errors
      if (Math.random() > 0.7) {
        throw new Error('Failed to send message. Please try again.')
      }
      
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Received: ${message.content}`,
        createdAt: Date.now(),
        status: 'sent',
      }
    },
  })

  const [input, setInput] = useState('')

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                : 'bg-muted mr-auto max-w-[80%]'
            } ${
              msg.status === 'error' ? 'border-2 border-destructive' : ''
            }`}
          >
            <div className="text-sm">{msg.content}</div>
            {msg.status === 'error' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => retry(msg.id)}
                className="mt-2"
              >
                Retry Message
              </Button>
            )}
          </div>
        ))}
        {isLoading && <div className="text-muted-foreground">Sending...</div>}
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
          <strong>Error:</strong> {error.message}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading && input.trim()) {
              sendMessage(input)
              setInput('')
            }
          }}
          placeholder="Type a message (may randomly fail)..."
          className="flex-1 px-3 py-2 border rounded-lg"
          disabled={isLoading}
        />
        <Button
          onClick={() => {
            sendMessage(input)
            setInput('')
          }}
          disabled={isLoading || !input.trim()}
        >
          Send
        </Button>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs">
        <strong>Note:</strong> This demo randomly fails ~30% of messages to demonstrate error handling.
        Click "Retry Message" on failed messages to resend them.
      </div>
    </div>
  )
}

export const ErrorHandling: Story = {
  render: () => <ChatWithErrorHandling />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling and retry functionality when messages fail to send.',
      },
    },
  },
}

function ChatWithCancellation() {
  const { messages, sendMessage, isLoading } = useChat({
    onSendMessage: async (message, { signal }) => {
      // Simulate a long-running request
      for (let i = 0; i < 10; i++) {
        // Check if cancelled
        if (signal?.aborted) {
          throw new Error('Request cancelled')
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
      
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Processed: ${message.content}`,
        createdAt: Date.now(),
        status: 'sent',
      }
    },
  })

  const [input, setInput] = useState('')
  const [abortController, setAbortController] = useState<AbortController | null>(null)

  const handleSend = async () => {
    const controller = new AbortController()
    setAbortController(controller)
    
    try {
      await sendMessage(input, { signal: controller.signal })
      setInput('')
    } catch (error: any) {
      if (error.message !== 'Request cancelled') {
        console.error('Send error:', error)
      }
    } finally {
      setAbortController(null)
    }
  }

  const handleCancel = () => {
    abortController?.abort()
    setAbortController(null)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-2 min-h-[300px] max-h-[400px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto max-w-[80%]'
                : 'bg-muted mr-auto max-w-[80%]'
            }`}
          >
            <div className="text-sm">{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="text-muted-foreground">
            Processing... (takes ~5 seconds, try cancelling!)
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading && input.trim()) {
              handleSend()
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg"
          disabled={isLoading}
        />
        {isLoading && abortController ? (
          <Button variant="destructive" onClick={handleCancel}>
            Cancel
          </Button>
        ) : (
          <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
            Send
          </Button>
        )}
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs">
        <strong>AbortController Support:</strong> Long-running requests can be cancelled
        mid-flight. Click "Cancel" while a message is processing to abort it.
      </div>
    </div>
  )
}

export const Cancellation: Story = {
  render: () => <ChatWithCancellation />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates AbortController support for cancelling in-flight requests.',
      },
    },
  },
}
