'use client'

import type { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useClarityChat Hook | Clarity Chat',
  description: 'Primary hook for chat functionality with message management, streaming, and AI interactions.',
}

const useClarityChatOptions: Prop[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description: 'API endpoint URL for chat requests.',
  },
  {
    name: 'chatId',
    type: 'string',
    description: 'Optional chat ID for conversation persistence.',
  },
  {
    name: 'initialMessages',
    type: 'CoreMessage[]',
    description: 'Initial messages to load in the chat.',
  },
  {
    name: 'streamProtocol',
    type: '"sse" | "websocket"',
    default: '"sse"',
    description: 'Streaming protocol to use for real-time responses.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Custom headers to include in API requests.',
  },
  {
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body parameters to include in API requests.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum tokens for AI responses.',
  },
  {
    name: 'temperature',
    type: 'number',
    description: 'Temperature setting for AI responses (0-2).',
  },
  {
    name: 'model',
    type: 'string',
    description: 'AI model to use (e.g., "gpt-4", "claude-3-opus").',
  },
  {
    name: 'memory',
    type: 'MemoryConfig',
    description: 'Memory configuration for conversation context.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Error handler callback.',
  },
  {
    name: 'onFinish',
    type: '(message: CoreMessage) => void',
    description: 'Callback when a message stream finishes.',
  },
  {
    name: 'transport',
    type: '"sse" | "websocket"',
    default: '"sse"',
    description: 'Transport protocol for streaming. SSE is default and Vercel-compatible.',
  },
  {
    name: 'websocket',
    type: 'ClarityWebSocketOptions',
    description: 'WebSocket-specific options (only used when transport is "websocket").',
  },
  {
    name: 'promptOptimization',
    type: 'ClarityPromptOptimizationOptions',
    description: 'Prompt optimization configuration for token reduction.',
  },
]

const useClarityChatReturn: Prop[] = [
  {
    name: 'messages',
    type: 'CoreMessage[]',
    description: 'Array of messages in the conversation.',
  },
  {
    name: 'append',
    type: '(message: CoreMessage | CoreMessage[]) => Promise<string | null>',
    description: 'Add a new message and trigger AI response.',
  },
  {
    name: 'setMessages',
    type: '(messages: CoreMessage[]) => void',
    description: 'Replace all messages in the conversation.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether the chat is currently loading a response.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Current error state, if any.',
  },
  {
    name: 'stop',
    type: '() => void',
    description: 'Stop the current streaming response.',
  },
  {
    name: 'reload',
    type: '() => Promise<string | null>',
    description: 'Reload the last assistant message.',
  },
  {
    name: 'input',
    type: 'string',
    description: 'Current input value (if using built-in input handling).',
  },
  {
    name: 'setInput',
    type: '(input: string) => void',
    description: 'Update the input value.',
  },
  {
    name: 'memoryInfo',
    type: 'ClarityChatMemoryInfo',
    description: 'Memory information and statistics (enabled, strategy, count, context summary).',
  },
  {
    name: 'memoryErrorInfo',
    type: 'ClarityChatErrorInfo',
    description: 'Error information for memory operations (error, operation type, error classification).',
  },
  {
    name: 'tokenStats',
    type: 'ClarityChatTokenStats | undefined',
    description: 'Token statistics from prompt optimization (if enabled).',
  },
  {
    name: 'data',
    type: 'CoreMessage | undefined',
    description: 'Current assistant message being streamed.',
  },
]

export default function UseClarityChatPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useClarityChat</h1>

      <p className="lead">
        Primary hook for chat functionality in Clarity Chat. This is the recommended
        hook for building custom chat interfaces with full control over the UI.
      </p>

      <Callout type="info" title="Architecture Layer">
        <p>
          <strong>useClarityChat</strong> is a top-level hook that wraps <code>useChatEnhanced</code>
          with Clarity-specific enhancements including memory integration and transport selection.
          For Vercel AI SDK compatibility, use <code>useChatEnhanced</code> instead.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSend}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with the useClarityChat hook:
        </p>
        <CodePlayground
          initialCode={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Example() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  return (
    <div style={{ height: '500px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSend}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Memory</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 8000,
    },
  })

  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  // Memory is automatically managed
  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, append, error, isLoading } = useClarityChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
      // Send to error tracking service
    },
  })

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <ChatWindow messages={messages} isLoading={isLoading} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Headers</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    headers: {
      'Authorization': 'Bearer token',
      'X-Custom-Header': 'value',
    },
  })

  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Model Configuration</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  })

  const handleSend = async (content: string) => {
    await append({ role: 'user', content })
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Streaming Control</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, append, stop, isLoading } = useClarityChat({
    api: '/api/chat',
    streamProtocol: 'sse', // or 'websocket'
  })

  const handleStop = () => {
    stop() // Stop current streaming response
  }

  return (
    <div>
      {isLoading && (
        <button onClick={handleStop}>Stop</button>
      )}
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With useChatHandlers</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, useChatHandlers, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const chat = useClarityChat({ api: '/api/chat' })
  
  // Pre-configured handlers - no boilerplate!
  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useClarityChatOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useClarityChatReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Message Format</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Messages use the <code>CoreMessage</code> format:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`type CoreMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
  id?: string
  name?: string
  function_call?: FunctionCall
  tool_calls?: ToolCall[]
  tool_call_id?: string
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Architecture</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          <strong>useClarityChat</strong> is built on top of <code>useChatEnhanced</code> and adds:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Memory integration (sliding window, semantic chunks, vector store)</li>
          <li>Transport selection (SSE, WebSocket)</li>
          <li>Prompt optimization</li>
          <li>Error classification and recovery</li>
          <li>Token tracking and optimization</li>
        </ul>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          For Vercel AI SDK compatibility, use <code>useChatEnhanced</code> directly.
        </p>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Performance Considerations</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Messages are automatically memoized to prevent unnecessary re-renders</li>
          <li>Streaming responses are optimized for performance</li>
          <li>Memory management reduces token usage automatically</li>
          <li>Error recovery includes automatic retry with exponential backoff</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/clarity-chat" className="docs-card">
            <h3>ClarityChat Component</h3>
            <p>Drop-in component using useClarityChat</p>
          </a>
          <a href="/reference/components/chat-window" className="docs-card">
            <h3>ChatWindow Component</h3>
            <p>UI component for displaying messages</p>
          </a>
          <a href="/reference/hooks/use-chat" className="docs-card">
            <h3>useChat Hook</h3>
            <p>Core chat hook (lower level)</p>
          </a>
          <a href="/guides/memory" className="docs-card">
            <h3>Memory Guide</h3>
            <p>Learn about memory strategies</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Hooks Overview', href: '/reference/hooks' }}
        next={{ title: 'useChat', href: '/reference/hooks/use-chat' }}
      />
    </>
  )
}
