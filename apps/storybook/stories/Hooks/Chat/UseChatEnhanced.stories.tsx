import { SecureLogger } from '@/lib/security/secureLogger';
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useChatEnhanced as useChat } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useChat Hook (Enhanced)**
 * 
 * Enhanced useChat hook with full Vercel AI SDK compatibility.
 * Provides complete chat interface with streaming support, message management,
 * tool calling, and multi-modal content.
 * 
 * **Key Features:**
 * - Vercel AI SDK compatible API
 * - Streaming support (SSE and data protocols)
 * - Multi-modal messages (text, images, tool calls)
 * - Tool invocation support
 * - Message management
 * - Error handling and recovery
 * - Request cancellation
 * - Form handling
 * 
 * **Use Cases:**
 * - AI chat interfaces
 * - Multi-turn conversations
 * - Tool-using assistants
 * - Multi-modal chat applications
 * - Enterprise chat solutions
 */
const meta = {
  title: 'Hooks/Chat/UseChatEnhanced',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The enhanced \`useChat\` hook provides full Vercel AI SDK compatibility
with streaming support, message management, and tool calling capabilities.

## Features

- ✅ Vercel AI SDK compatible API
- ✅ Streaming support (SSE and data protocols)
- ✅ Multi-modal messages (text, images, tool calls)
- ✅ Tool invocation support
- ✅ Message management
- ✅ Error handling and recovery
- ✅ Request cancellation
- ✅ Form handling
- ✅ Loading and error states

## Basic Usage

\`\`\`tsx
const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
  api: '/api/chat',
  initialMessages: [],
  onFinish: (message) => SecureLogger.debug('Finished:', message),
  onError: (error) => SecureLogger.error('Error:', error),
})

// Handle form submission
<form onSubmit={handleSubmit}>
  <input value={input} onChange={(e) => setInput(e.target.value)} />
  <button type="submit" disabled={isLoading}>Send</button>
</form>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function BasicChatDemo() {
  const { messages, append, isLoading, handleSubmit, input, setInput, error, stop } = useChat({
    initialMessages: [],
    onFinish: (message) => {
      SecureLogger.debug('Message finished:', message)
    },
    onError: (error) => {
      SecureLogger.error('Chat error:', error)
    },
  })

  return (
    <div className="flex flex-col h-[500px] border rounded-lg max-w-2xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Start a conversation by sending a message
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {typeof msg.content === 'string' ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="text-sm">Multi-modal content</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
          {isLoading && (
            <Button type="button" onClick={stop} variant="outline">
              Stop
            </Button>
          )}
        </div>
        {error && (
          <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
            Error: {error.message}
          </div>
        )}
      </form>
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <BasicChatDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic chat interface using enhanced useChat hook with form handling and message display.',
      },
    },
  },
}

function WithInitialMessagesDemo() {
  const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! How can I help you today?',
      },
      {
        id: '2',
        role: 'user',
        content: 'Tell me about React hooks',
      },
      {
        id: '3',
        role: 'assistant',
        content: 'React hooks are functions that let you use state and other React features in functional components.',
      },
    ],
  })

  return (
    <div className="flex flex-col h-[500px] border rounded-lg max-w-2xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {typeof msg.content === 'string' ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="text-sm">Multi-modal content</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Continue the conversation..."
            className="flex-1 p-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  )
}

export const WithInitialMessages: Story = {
  render: () => <WithInitialMessagesDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Chat with pre-populated initial messages to continue an existing conversation.',
      },
    },
  },
}

function AppendMessageDemo() {
  const { messages, append, isLoading, stop } = useChat({
    initialMessages: [],
  })

  const [customMessage, setCustomMessage] = useState('')

  const handleAppend = async () => {
    if (!customMessage.trim()) return
    
    // Append user message
    await append({
      role: 'user',
      content: customMessage,
    })
    
    setCustomMessage('')
    
    // Simulate assistant response
    setTimeout(async () => {
      await append({
        role: 'assistant',
        content: `You said: "${customMessage}". This is a simulated response.`,
      })
    }, 1000)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-col h-[400px] border rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Use append() to add messages programmatically.
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                {typeof msg.content === 'string' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="text-sm">Multi-modal content</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500">
                Processing...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Custom message:</label>
        <div className="flex gap-2">
          <input
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Enter a message to append"
            className="flex-1 p-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button onClick={handleAppend} disabled={isLoading || !customMessage.trim()}>
            Append Message
          </Button>
          {isLoading && (
            <Button onClick={stop} variant="outline">
              Stop
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Using append() to programmatically add messages instead of form submission.
        </p>
      </div>
    </div>
  )
}

export const AppendMessage: Story = {
  render: () => <AppendMessageDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using append() to programmatically add messages to the chat.',
      },
    },
  },
}

function ReloadDemo() {
  const { messages, reload, isLoading, stop } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'user',
        content: 'Tell me a joke',
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Why did the chicken cross the road?',
      },
    ],
  })

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-col h-[400px] border rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                {typeof msg.content === 'string' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="text-sm">Multi-modal content</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500">
                Regenerating response...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => reload()} disabled={isLoading}>
          {isLoading ? 'Reloading...' : 'Reload Last Response'}
        </Button>
        {isLoading && (
          <Button onClick={stop} variant="outline">
            Stop
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Use reload() to regenerate the last assistant message. This is useful for retrying failed requests or getting alternative responses.
      </p>
    </div>
  )
}

export const Reload: Story = {
  render: () => <ReloadDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using reload() to regenerate the last assistant message.',
      },
    },
  },
}

function ErrorHandlingDemo() {
  const { messages, append, isLoading, error, stop } = useChat({
    initialMessages: [],
    onError: (error) => {
      SecureLogger.error('Chat error:', error)
    },
    keepLastMessageOnError: true,
  })

  const [message, setMessage] = useState('')

  const handleAppend = async () => {
    if (!message.trim()) return
    
    try {
      // Simulate an error for demo
      if (message.toLowerCase().includes('error')) {
        throw new Error('Simulated API error')
      }
      
      await append({
        role: 'user',
        content: message,
      })
      
      // Simulate assistant response
      setTimeout(async () => {
        await append({
          role: 'assistant',
          content: `Response to: "${message}"`,
        })
      }, 1000)
      
      setMessage('')
    } catch (err) {
      SecureLogger.error('Failed to append:', err)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex flex-col h-[400px] border rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                {typeof msg.content === 'string' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="text-sm">Multi-modal content</div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500">
                Processing...
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="font-medium text-red-800 dark:text-red-200">Error:</div>
          <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Message (try "error" to trigger error):</label>
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message"
            className="flex-1 p-2 border rounded-lg"
            disabled={isLoading}
          />
          <Button onClick={handleAppend} disabled={isLoading || !message.trim()}>
            Send
          </Button>
          {isLoading && (
            <Button onClick={stop} variant="outline">
              Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export const ErrorHandling: Story = {
  render: () => <ErrorHandlingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Error handling with keepLastMessageOnError option to preserve messages on error.',
      },
    },
  },
}
