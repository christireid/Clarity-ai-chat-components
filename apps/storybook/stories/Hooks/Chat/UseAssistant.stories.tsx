import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import { SecureLogger } from '@/lib/security/secureLogger';
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useAssistant } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useAssistant Hook**
 * 
 * Hook for managing AI assistant interactions with tool calling support,
 * multi-step workflows, and thread/run management.
 * 
 * **Key Features:**
 * - Assistant thread management
 * - Tool calling support
 * - Multi-step workflows
 * - Status tracking (idle, in_progress, awaiting_message)
 * - Streaming responses
 * - Error handling
 * - Request cancellation
 * 
 * **Use Cases:**
 * - AI assistants with tools
 * - Multi-step agent workflows
 * - Thread-based conversations
 * - Tool-using agents
 * - Enterprise assistant applications
 */
const meta = {
  title: 'Hooks/Chat/UseAssistant',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useAssistant\` hook provides a way to manage AI assistant interactions
with tool calling support and multi-step workflows.

## Features

- ✅ Assistant thread management
- ✅ Tool calling support
- ✅ Multi-step workflows
- ✅ Status tracking (idle, in_progress, awaiting_message)
- ✅ Streaming responses
- ✅ Error handling
- ✅ Request cancellation
- ✅ Form handling

## Basic Usage

\`\`\`tsx
const { status, messages, submitMessage, handleSubmit, input, setInput } = useAssistant({
  api: '/api/assistant',
  assistantId: 'asst_123',
  threadId: 'thread_456',
  onToolCall: (toolCall) => {
    SecureLogger.debug('Tool called:', toolCall)
  },
})

// Handle form submission
<form onSubmit={handleSubmit}>
  <input value={input} onChange={(e) => setInput(e.target.value)} />
  <button type="submit" disabled={status !== 'idle'}>Send</button>
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

function BasicAssistantDemo() {
  const { status, messages, submitMessage, handleSubmit, input, setInput, error, stop } = useAssistant({
    assistantId: 'demo-assistant',
    onToolCall: (toolCall) => {
      SecureLogger.debug('Tool called:', toolCall)
    },
    onFinish: (message) => {
      SecureLogger.debug('Assistant finished:', message)
    },
    onError: (error) => {
      SecureLogger.error('Assistant error:', error)
    },
  })

  return (
    <div className="flex flex-col h-[500px] border rounded-lg max-w-2xl">
      <div className="border-b p-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Assistant Status: {status}</div>
          {status === 'in_progress' && (
            <Button onClick={stop} size="sm" variant="outline">
              Stop
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Start a conversation with the assistant
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
        {status === 'in_progress' && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500">
              Assistant is thinking...
            </div>
          </div>
        )}
        {status === 'awaiting_message' && (
          <div className="flex justify-start">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-2 text-yellow-800 dark:text-yellow-200">
              Assistant is awaiting your message...
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
            disabled={status !== 'idle'}
          />
          <Button type="submit" disabled={status !== 'idle' || !input.trim()}>
            {status === 'in_progress' ? 'Processing...' : 'Send'}
          </Button>
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
  render: () => <BasicAssistantDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic assistant interface with status tracking and form handling.',
      },
    },
  },
}

function StatusTrackingDemo() {
  const { status, messages, submitMessage, isLoading, error } = useAssistant({
    assistantId: 'demo-assistant',
  })

  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) return
    await submitMessage(message)
    setMessage('')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <h3 className="font-medium mb-2">Status Tracking</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Status:</strong>{' '}
            <span
              className={`px-2 py-1 rounded ${
                status === 'idle'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  : status === 'in_progress'
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                  : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
              }`}
            >
              {status}
            </span>
          </div>
          <div>
            <strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Messages Count:</strong> {messages.length}
          </div>
          {error && (
            <div>
              <strong>Error:</strong> <span className="text-red-600 dark:text-red-400">{error.message}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col h-[300px] border rounded-lg">
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
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message"
          className="flex-1 p-2 border rounded-lg"
          disabled={status !== 'idle'}
        />
        <Button onClick={handleSubmit} disabled={status !== 'idle' || !message.trim()}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export const StatusTracking: Story = {
  render: () => <StatusTrackingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Tracking assistant status (idle, in_progress, awaiting_message) and related state.',
      },
    },
  },
}

function ToolCallingDemo() {
  const { status, messages, submitMessage, isLoading } = useAssistant({
    assistantId: 'demo-assistant',
    onToolCall: (toolCall) => {
      SecureLogger.debug('Tool invocation:', toolCall)
      // In a real app, you would handle the tool call here
      // For example, call an API, update database, etc.
    },
  })

  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) return
    await submitMessage(message)
    setMessage('')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-medium mb-2">Tool Calling Support</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          The assistant can call tools during the conversation. Check the browser console
          to see tool invocation events when they occur.
        </p>
      </div>

      <div className="flex flex-col h-[300px] border rounded-lg">
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
                    : msg.role === 'tool'
                    ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                {typeof msg.content === 'string' ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <div className="text-sm">
                    {msg.toolInvocations && msg.toolInvocations.length > 0
                      ? `Tool invocations: ${msg.toolInvocations.length}`
                      : 'Multi-modal content'}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-500">
                Assistant is processing...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message that might trigger tool calls"
          className="flex-1 p-2 border rounded-lg"
          disabled={status !== 'idle'}
        />
        <Button onClick={handleSubmit} disabled={status !== 'idle' || !message.trim()}>
          Submit
        </Button>
      </div>
    </div>
  )
}

export const ToolCalling: Story = {
  render: () => <ToolCallingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Assistant with tool calling support. Tool invocations are logged to the console.',
      },
    },
  },
}

function ThreadManagementDemo() {
  const [threadId, setThreadId] = useState<string | undefined>(undefined)
  const { status, messages, submitMessage, isLoading } = useAssistant({
    assistantId: 'demo-assistant',
    threadId,
  })

  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) return
    await submitMessage(message)
    setMessage('')
  }

  const createNewThread = () => {
    setThreadId(`thread-${Date.now()}`)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
        <h3 className="font-medium mb-2">Thread Management</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Thread ID:</strong>{' '}
            {threadId ? (
              <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">{threadId}</code>
            ) : (
              <span className="text-gray-500">None (create a new thread)</span>
            )}
          </div>
          <Button onClick={createNewThread} size="sm" variant="outline">
            Create New Thread
          </Button>
        </div>
      </div>

      <div className="flex flex-col h-[300px] border rounded-lg">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {threadId ? 'Start a conversation in this thread' : 'Create a thread to start'}
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

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message"
          className="flex-1 p-2 border rounded-lg"
          disabled={status !== 'idle' || !threadId}
        />
        <Button onClick={handleSubmit} disabled={status !== 'idle' || !message.trim() || !threadId}>
          Submit
        </Button>
      </div>
      {!threadId && (
        <p className="text-xs text-gray-500">
          Create a thread first to enable message submission.
        </p>
      )}
    </div>
  )
}

export const ThreadManagement: Story = {
  render: () => <ThreadManagementDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Managing assistant threads for multi-turn conversations.',
      },
    },
  },
}
