'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic hook demo
function BasicHookDemo() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div className="w-full max-w-2xl" style={{ height: '400px' }}>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={async (content) => {
          await chat.append({ role: 'user', content })
        }}
        className="border border-border rounded-lg"
      />
    </div>
  )
}

// With memory demo
function MemoryHookDemo() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  return (
    <div className="w-full max-w-2xl" style={{ height: '400px' }}>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={async (content) => {
          await chat.append({ role: 'user', content })
        }}
        className="border border-border rounded-lg"
      />
    </div>
  )
}

const useClarityChatOptionsProps: Prop[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description: 'API endpoint URL for chat requests. This is the only required option.',
  },
  {
    name: 'memory',
    type: 'ClarityMemoryOptions',
    description: 'Memory configuration for context-aware conversations.',
  },
  {
    name: 'transport',
    type: '"sse" | "websocket"',
    default: '"sse"',
    description: 'Transport protocol for streaming. SSE is default, WebSocket for bidirectional.',
  },
  {
    name: 'websocket',
    type: 'ClarityWebSocketOptions',
    description: 'WebSocket-specific options (only used when transport is "websocket").',
  },
  {
    name: 'promptOptimization',
    type: 'ClarityPromptOptimizationOptions',
    description: 'Prompt optimization configuration for token management.',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses for real-time updates.',
  },
  {
    name: 'initialMessages',
    type: 'CoreMessage[]',
    description: 'Initial messages to populate the chat.',
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
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body parameters to send with each request.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Additional headers to send with each request.',
  },
  {
    name: 'credentials',
    type: '"include" | "omit" | "same-origin"',
    description: 'Credentials mode for fetch requests.',
  },
]

const useClarityChatReturnProps: Prop[] = [
  {
    name: 'messages',
    type: 'CoreMessage[]',
    description: 'Array of messages in the conversation.',
  },
  {
    name: 'append',
    type: '(message: CoreMessage) => Promise<void>',
    description: 'Add a new message and trigger AI response.',
  },
  {
    name: 'setMessages',
    type: '(messages: CoreMessage[] | ((prev: CoreMessage[]) => CoreMessage[])) => void',
    description: 'Update the messages array directly.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether a request is currently in progress.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Last error that occurred, if any.',
  },
  {
    name: 'stop',
    type: '() => void',
    description: 'Stop the current streaming response.',
  },
  {
    name: 'reload',
    type: '() => Promise<void>',
    description: 'Reload the last message.',
  },
  {
    name: 'memoryInfo',
    type: 'ClarityChatMemoryInfo',
    description: 'Memory statistics and context summary.',
  },
  {
    name: 'memoryErrorInfo',
    type: 'ClarityChatErrorInfo',
    description: 'Error information for memory operations.',
  },
  {
    name: 'tokenStats',
    type: 'ClarityChatTokenStats | undefined',
    description: 'Token statistics (if prompt optimization enabled).',
  },
]

const memoryOptionsProps: Prop[] = [
  {
    name: 'enabled',
    type: 'boolean',
    description: 'Enable memory integration.',
  },
  {
    name: 'strategy',
    type: '"sliding-window" | "semantic-chunks" | "vector-store"',
    description: 'Memory strategy for context management.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum tokens for memory context.',
  },
  {
    name: 'retryOnError',
    type: 'boolean',
    default: 'true',
    description: 'Retry failed memory operations.',
  },
  {
    name: 'maxRetryAttempts',
    type: 'number',
    default: '2',
    description: 'Maximum retry attempts for memory operations.',
  },
  {
    name: 'onMemoryError',
    type: '(error: Error, operation: "query" | "store") => void',
    description: 'Callback when memory operation fails.',
  },
]

export const dynamic = 'force-dynamic'

export default function UseClarityChatPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useClarityChat</h1>

        <p className="lead">
          The primary public API for chat functionality in Clarity. This hook wraps{' '}
          <code>useChatEnhanced</code> with Clarity-specific enhancements including memory
          integration, transport selection, and prompt optimization.
        </p>

        <Callout type="info">
          <p>
            <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready)
            <br />
            <strong>Domain:</strong> Chat State
            <br />
            <br />
            For Vercel AI SDK compatibility, use mid-level <code>useChatEnhanced</code> instead.
            For raw state management, use low-level <code>useChat</code>.
          </p>
        </Callout>

        <ViewInStorybook component="useClarityChat" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Experiment with the useClarityChat hook! Try different configurations including memory,
            streaming, and optimization options.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
    />
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useClarityChat } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          The simplest way to use <code>useClarityChat</code> is to just provide an API endpoint:
        </p>

        <ComponentPreview
          title="Simple Chat Hook"
          description="Basic usage with minimal configuration"
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function ChatApp() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
    />
  )
}`}
        >
          <BasicHookDemo />
        </ComponentPreview>

        <h2 id="with-memory">With Memory</h2>

        <p>
          Enable conversation memory for context-aware responses. You'll need to wrap your app with
          a <code>MemoryProvider</code>:
        </p>

        <ComponentPreview
          title="Chat with Memory"
          description="Context-aware conversations with memory enabled"
          code={`import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={async (content) => {
        await chat.append({ role: 'user', content })
      }}
    />
  )
}`}
        >
          <MemoryHookDemo />
        </ComponentPreview>

        <Callout type="info">
          <p>
            Learn more about memory strategies in the{' '}
            <a href="/guides/memory">Memory System Guide</a>.
          </p>
        </Callout>

        <h2 id="with-handlers">With Handlers</h2>

        <p>
          Use <code>useChatHandlers</code> to reduce boilerplate and get pre-configured handlers:
        </p>

        <EnhancedCodeBlock
          code={`import { useClarityChat, ChatWindow, useChatHandlers } from '@clarity-chat/react'

function ChatApp() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

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
          language="tsx"
          showLineNumbers
        />

        <h2 id="with-streaming">With Streaming</h2>

        <p>
          Streaming is enabled by default. You can configure the transport protocol (SSE or
          WebSocket):
        </p>

        <EnhancedCodeBlock
          code={`// SSE (default) - Server-Sent Events
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse',
})

// WebSocket - Bidirectional real-time communication
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
  websocket: {
    autoReconnect: true,
    maxReconnectAttempts: 5,
    enableHeartbeat: true,
  },
})`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="with-optimization">With Prompt Optimization</h2>

        <p>Enable prompt optimization to manage token usage:</p>

        <EnhancedCodeBlock
          code={`const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 8000,
    strategy: 'hybrid',
    model: 'gpt-4',
  },
})

// Access token statistics
console.log(chat.tokenStats)
// {
//   inputTokens: 5000,
//   remainingBudget: 3000,
//   utilization: 0.625,
//   wasOptimized: true,
// }`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="options">Options</h2>

        <PropsTable props={useClarityChatOptionsProps} title="useClarityChat Options" />

        <h3 id="memory-options">Memory Options</h3>

        <PropsTable props={memoryOptionsProps} title="ClarityMemoryOptions" />

        <h2 id="return-values">Return Values</h2>

        <PropsTable props={useClarityChatReturnProps} title="useClarityChat Return" />

        <h2 id="memory-info">Memory Information</h2>

        <p>
          When memory is enabled, you can access memory statistics and context information:
        </p>

        <EnhancedCodeBlock
          code={`const chat = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'vector-store' },
})

// Access memory info
console.log(chat.memoryInfo)
// {
//   memoryCount: 42,
//   enabled: true,
//   strategy: 'vector-store',
//   lastContextSummary: 'Recent conversation about...',
// }

// Access error info
if (chat.memoryErrorInfo.memoryError) {
  console.error('Memory error:', chat.memoryErrorInfo.memoryError)
  console.error('Operation:', chat.memoryErrorInfo.memoryErrorOperation)
  console.error('Type:', chat.memoryErrorInfo.memoryErrorType)
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="examples">Examples</h2>

        <h3>Complete Example with All Features</h3>

        <EnhancedCodeBlock
          code={`import { useClarityChat, ChatWindow, MemoryProvider, useChatHandlers } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
      maxTokens: 8000,
      retryOnError: true,
      maxRetryAttempts: 3,
      onMemoryError: (error, operation) => {
        console.error('Memory error:', error, operation)
      },
    },
    transport: 'sse',
    promptOptimization: {
      enabled: true,
      targetTokens: 8000,
      strategy: 'hybrid',
      model: 'gpt-4',
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
    onFinish: (message) => {
      console.log('Message finished:', message)
    },
  })

  const handlers = useChatHandlers({ chat })

  return (
    <div>
      {/* Display memory info */}
      {chat.memoryInfo.enabled && (
        <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <p>Memory: {chat.memoryInfo.memoryCount} memories</p>
          <p>Strategy: {chat.memoryInfo.strategy}</p>
        </div>
      )}

      {/* Display token stats */}
      {chat.tokenStats && (
        <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <p>Tokens: {chat.tokenStats.inputTokens} / {chat.tokenStats.inputTokens + chat.tokenStats.remainingBudget}</p>
          <p>Utilization: {(chat.tokenStats.utilization * 100).toFixed(1)}%</p>
        </div>
      )}

      {/* Chat window */}
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handlers.onSendMessage}
        onClear={handlers.onClear}
      />

      {/* Error display */}
      {chat.error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded">
          <p>Error: {chat.error.message}</p>
          <button onClick={() => chat.reload()}>Retry</button>
        </div>
      )}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h3>Error Handling Example</h3>

        <EnhancedCodeBlock
          code={`const chat = useClarityChat({
  api: '/api/chat',
  onError: (error) => {
    // Handle different error types
    if (error.message.includes('network')) {
      // Network error - show retry button
      setShowRetry(true)
    } else if (error.message.includes('rate limit')) {
      // Rate limit - show wait message
      setRateLimitMessage('Too many requests. Please wait.')
    } else {
      // Other errors - log and show generic message
      console.error('Chat error:', error)
      setErrorMessage('Something went wrong. Please try again.')
    }
  },
})

// Handle memory errors
if (chat.memoryErrorInfo.memoryError) {
  const { memoryError, memoryErrorOperation, memoryErrorType } = chat.memoryErrorInfo
  
  if (memoryErrorType === 'network') {
    // Network error - retry
    console.log('Retrying memory operation...')
  } else if (memoryErrorType === 'auth') {
    // Auth error - redirect to login
    router.push('/login')
  }
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="success">
          <p>
            <strong>Great job!</strong> You now know how to use the useClarityChat hook. Check out
            the <a href="/reference/components/clarity-chat">ClarityChat component</a> for a
            simpler drop-in solution, or explore{' '}
            <a href="/reference/hooks/use-chat-handlers">useChatHandlers</a> for pre-configured
            handlers.
          </p>
        </Callout>

        <h2 id="accessibility">Accessibility</h2>

        <p>
          The hook itself doesn't render UI, but when used with components like{' '}
          <code>ChatWindow</code>, accessibility features are built-in:
        </p>

        <ul>
          <li>✅ Full keyboard navigation support</li>
          <li>✅ ARIA labels and roles for screen readers</li>
          <li>✅ Focus management for input and buttons</li>
          <li>✅ High contrast mode compatible</li>
          <li>✅ Reduced motion support</li>
        </ul>

        <h2 id="performance">Performance Tips</h2>

        <Callout type="tip">
          <p>For optimal performance:</p>
          <ul>
            <li>Use memory strategies to limit context size</li>
            <li>Enable prompt optimization for large conversations</li>
            <li>Use WebSocket for lower latency when needed</li>
            <li>Debounce rapid message sends</li>
            <li>Monitor token usage with tokenStats</li>
          </ul>
        </Callout>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/clarity-chat">ClarityChat</a> - Drop-in component
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Composable component
          </li>
          <li>
            <a href="/reference/hooks/use-chat-handlers">useChatHandlers</a> - Pre-configured handlers
          </li>
          <li>
            <a href="/reference/hooks/use-chat-enhanced">useChatEnhanced</a> - Mid-level hook
          </li>
          <li>
            <a href="/guides/memory">Memory System Guide</a> - Memory strategies
          </li>
          <li>
            <a href="/guides/streaming">Streaming Guide</a> - Transport protocols
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'Hooks Overview',
            href: '/reference/hooks',
          }}
          next={{
            title: 'useChatHandlers',
            href: '/reference/hooks/use-chat-handlers',
          }}
        />
      </>
    </ToastProvider>
  )
}
