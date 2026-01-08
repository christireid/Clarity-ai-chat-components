import type { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'useChatEnhanced Hook | Clarity Chat',
  description:
    'Enhanced chat hook with Vercel AI SDK compatibility. Mid-level API for building custom chat interfaces.',
}

const useChatEnhancedOptions: Prop[] = [
  {
    name: 'api',
    type: 'string',
    default: '"/api/chat"',
    description: 'API endpoint URL for chat requests.',
  },
  {
    name: 'initialMessages',
    type: 'CoreMessage[]',
    default: '[]',
    description: 'Initial messages to load in the chat.',
  },
  {
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body data to send with requests.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    default: '{}',
    description: 'Custom headers to include in API requests.',
  },
  {
    name: 'credentials',
    type: 'RequestCredentials',
    description: 'Fetch credentials mode (same-origin, include, omit).',
  },
  {
    name: 'fetch',
    type: 'typeof fetch',
    description:
      'Custom fetch implementation (for testing or custom behavior).',
  },
  {
    name: 'maxSteps',
    type: 'number',
    description: 'Maximum number of steps for agentic workflows.',
  },
  {
    name: 'streamProtocol',
    type: '"sse" | "data"',
    default: '"sse"',
    description: 'Streaming protocol. SSE is Vercel-compatible.',
  },
  {
    name: 'id',
    type: '() => string',
    description: 'Custom function to generate unique message IDs.',
  },
  {
    name: 'onResponse',
    type: '(response: Response) => void | Promise<void>',
    description: 'Callback when HTTP response is received.',
  },
  {
    name: 'onFinish',
    type: '(message: CoreMessage) => void | Promise<void>',
    description: 'Callback when a message stream finishes.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback when an error occurs.',
  },
  {
    name: 'onMessageAppend',
    type: '(message: CoreMessage) => void',
    description: 'Callback when a message is appended to the conversation.',
  },
  {
    name: 'transform',
    type: '(messages: CoreMessage[]) => CoreMessage[]',
    description: 'Transform messages before sending to API.',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses.',
  },
  {
    name: 'keepLastMessageOnError',
    type: 'boolean',
    default: 'false',
    description: 'Keep the last message when an error occurs.',
  },
  {
    name: 'sendExtraMessageFields',
    type: 'boolean',
    default: 'false',
    description: 'Send additional message fields to the API.',
  },
]

const useChatEnhancedReturn: Prop[] = [
  {
    name: 'messages',
    type: 'CoreMessage[]',
    description: 'Array of messages in the conversation.',
  },
  {
    name: 'setMessages',
    type: 'React.Dispatch<React.SetStateAction<CoreMessage[]>>',
    description: 'Replace all messages in the conversation.',
  },
  {
    name: 'append',
    type: '(message: CoreMessage | Pick<CoreMessage, "role" | "content">, options?: { data?: Record<string, any> }) => Promise<string | null>',
    description:
      'Add a new message and trigger AI response. Returns message ID.',
  },
  {
    name: 'reload',
    type: '(options?: { data?: Record<string, any> }) => Promise<string | null>',
    description: 'Reload/retry the last assistant message.',
  },
  {
    name: 'stop',
    type: '() => void',
    description: 'Stop the current streaming response.',
  },
  {
    name: 'handleSubmit',
    type: '(event?: React.FormEvent<HTMLFormElement>, options?: { data?: Record<string, any> }) => void',
    description: 'Handle form submission (uses input value).',
  },
  {
    name: 'input',
    type: 'string',
    description: 'Current input value.',
  },
  {
    name: 'setInput',
    type: 'React.Dispatch<React.SetStateAction<string>>',
    description: 'Update the input value.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether the chat is currently loading a response.',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Current error state, if any.',
  },
  {
    name: 'data',
    type: 'CoreMessage | undefined',
    description: 'Current assistant message being streamed.',
  },
  {
    name: 'abort',
    type: '() => void',
    description: 'Abort the current request.',
  },
]

export default function UseChatEnhancedPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useChatEnhanced</h1>

      <p className="lead">
        Enhanced chat hook with full Vercel AI SDK compatibility. This is the
        mid-level API for building custom chat interfaces with streaming support
        and message management.
      </p>

      <Callout type="info" title="Architecture Layer">
        <p>
          <strong>useChatEnhanced</strong> is a mid-level hook that provides
          Vercel AI SDK compatibility plus additional enterprise features. For
          simpler use cases, use top-level <code>useClarityChat</code> instead.
          For basic chat, use <code>useChat</code>.
        </p>
      </Callout>

      <Callout type="warning" title="Vercel AI SDK Compatible">
        <p>
          This hook is fully compatible with Vercel AI SDK's{' '}
          <code>useChat</code> hook. You can migrate from Vercel AI SDK by
          simply changing the import path.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'

function Chat() {
  const { messages, append, isLoading, input, setInput } = useChatEnhanced({
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
          Experiment with the useChatEnhanced hook:
        </p>
        <CodePlayground
          code={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'

function Example() {
  const { messages, append, isLoading, input, setInput } = useChatEnhanced({
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

        <h3 className="text-xl font-semibold mt-6 mb-4">With Form Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useChatEnhanced } from '@clarity-chat/react/internal'

function Chat() {
  const { messages, handleSubmit, input, setInput, isLoading } = useChatEnhanced({
    api: '/api/chat',
  })

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading || !input.trim()}>
        Send
      </button>
    </form>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react/internal'

function Chat() {
  const { messages, append, error, isLoading } = useChatEnhanced({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
      // Send to error tracking service
    },
  })

  if (error) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return <ChatWindow messages={messages} isLoading={isLoading} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Message Transformation
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useChatEnhanced } from '@clarity-chat/react/internal'

function Chat() {
  const { messages, append } = useChatEnhanced({
    api: '/api/chat',
    transform: (messages) => {
      // Add system message or modify messages before sending
      return [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages,
      ]
    },
  })

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Headers</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useChatEnhanced } from '@clarity-chat/react/internal'

function Chat() {
  const { messages, append } = useChatEnhanced({
    api: '/api/chat',
    headers: {
      'Authorization': 'Bearer token',
      'X-Custom-Header': 'value',
    },
  })

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Reload/Retry</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react/internal'

function Chat() {
  const { messages, append, reload, isLoading } = useChatEnhanced({
    api: '/api/chat',
  })

  const handleRetry = async () => {
    await reload() // Retries the last assistant message
  }

  return (
    <div>
      {isLoading && (
        <button onClick={() => stop()}>Stop</button>
      )}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
        onMessageRetry={handleRetry}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useChatEnhancedOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useChatEnhancedReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Message Format</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Messages use the <code>CoreMessage</code> format (Vercel AI SDK
          compatible):
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`type CoreMessage = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: string | Array<{
    type: 'text' | 'image' | 'tool-call' | 'tool-result'
    text?: string
    image?: string | ArrayBuffer
    toolCallId?: string
    toolName?: string
    args?: Record<string, any>
    result?: any
  }>
  id?: string
  name?: string
  toolCallId?: string
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args: Record<string, any>
    state: 'partial-call' | 'call' | 'result'
    result?: any
  }>
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Vercel AI SDK Migration</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          If you're using Vercel AI SDK, migration is simple:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`// Before (Vercel AI SDK)
import { useChat } from 'ai/react'

const { messages, append, isLoading } = useChat({
  api: '/api/chat',
})

// After (Clarity Chat)
import { useChatEnhanced } from '@clarity-chat/react/internal'

const { messages, append, isLoading } = useChatEnhanced({
  api: '/api/chat',
})

// That's it! The API is identical.`}
        />
        <Callout type="success" title="Drop-in Replacement">
          <p>
            <code>useChatEnhanced</code> is a drop-in replacement for Vercel AI
            SDK's
            <code>useChat</code>. All props and return values are identical.
          </p>
        </Callout>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Architecture</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          <strong>useChatEnhanced</strong> is built on top of{' '}
          <code>useChat</code> and provides:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Full Vercel AI SDK compatibility</li>
          <li>Enhanced streaming support (SSE and WebSocket)</li>
          <li>Better error handling and recovery</li>
          <li>Message transformation hooks</li>
          <li>Agent workflow support (maxSteps)</li>
        </ul>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          For Clarity-specific features (memory, token optimization), use{' '}
          <code>useClarityChat</code> instead.
        </p>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Performance Considerations</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            Messages are automatically memoized to prevent unnecessary
            re-renders
          </li>
          <li>Streaming responses are optimized for performance</li>
          <li>Abort controller is properly cleaned up on unmount</li>
          <li>
            Component mount state is tracked to prevent state updates after
            unmount
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-clarity-chat" className="docs-card">
            <h3>useClarityChat Hook</h3>
            <p>Top-level hook with Clarity-specific features</p>
          </a>
          <a href="/reference/hooks/use-chat-handlers" className="docs-card">
            <h3>useChatHandlers Hook</h3>
            <p>Pre-configured handlers for useChatEnhanced</p>
          </a>
          <a href="/reference/hooks/use-chat" className="docs-card">
            <h3>useChat Hook</h3>
            <p>Core chat hook (lower level)</p>
          </a>
          <a href="/learn/migration/from-vercel-ai-sdk" className="docs-card">
            <h3>Migration Guide</h3>
            <p>Migrate from Vercel AI SDK</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'useChatHandlers',
          href: '/reference/hooks/use-chat-handlers',
        }}
        next={{ title: 'useChat', href: '/reference/hooks/use-chat' }}
      />
    </>
  )
}
