import type { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'useChatEnhanced Hook (Deprecated) | Clarity Chat',
  description:
    'DEPRECATED: useChatEnhanced has been replaced by useClarityChat. This page is for migration guidance only.',
}

export default function UseChatEnhancedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-sm font-medium mb-4">
          <span>⚠️ DEPRECATED</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useChatEnhanced (Deprecated)</h1>
        <p className="text-xl text-muted-foreground mb-4">
          <strong>This hook has been deprecated.</strong> Please migrate to{' '}
          <a href="/reference/hooks/use-clarity-chat" className="text-brand-600 hover:underline">
            useClarityChat
          </a>{' '}
          for new projects.
        </p>
        <p className="text-muted-foreground">
          <strong>Status:</strong> Deprecated •{' '}
          <strong>Replacement:</strong> useClarityChat •{' '}
          <strong>Removal:</strong> v2.0.0
        </p>
      </div>

      <Callout type="error" title="Migration Required">
        <p className="mb-2">
          <strong>useChatEnhanced is deprecated</strong> and will be removed in v2.0.0.
          All functionality has been moved to <code>useClarityChat</code> with additional enterprise features.
        </p>
        <p>
          Migration is straightforward and mostly involves updating import statements.
        </p>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Migration Guide</h2>

        <h3 className="text-xl font-semibold mb-4">1. Update Imports</h3>
        <CodePlayground
          code={`// Before
import { useChatEnhanced } from '@clarity-chat/react'

// After
import { useClarityChat } from '@clarity-chat/react'`}
        />

        <h3 className="text-xl font-semibold mb-4 mt-8">2. Update Hook Usage</h3>
        <CodePlayground
          code={`// Before
const { messages, append, isLoading, error } = useChatEnhanced({
  api: '/api/chat',
  initialMessages: [],
})

// After
const { messages, append, isLoading, error } = useClarityChat({
  api: '/api/chat',
  initialMessages: [],
})`}
        />

        <h3 className="text-xl font-semibold mb-4 mt-8">3. New Enterprise Features</h3>
        <p className="mb-4">useClarityChat includes powerful new features not available in useChatEnhanced:</p>

        <CodePlayground
          code={`// Rate limiting with automatic queuing
const chat = useClarityChat({
  api: '/api/chat',
  enableRateLimiting: true,
  maxConcurrentRequests: 3,
  maxQueueSize: 10,
})

// Cross-device synchronization
const syncChat = useClarityChat({
  api: '/api/chat',
  conversationId: 'session-123', // Enables sync
})

// Real-time status
console.log(chat.isRateLimited)     // Rate limit status
console.log(chat.queueStatus)       // Queue information
console.log(sync.status)            // Sync status`}
        />

        <Callout type="tip" title="Enhanced Error Handling">
          <p>
            useClarityChat provides better error handling with automatic retries,
            rate limit recovery, and detailed error information.
          </p>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Breaking Changes</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold">Return Value Changes</h4>
            <p className="text-sm text-muted-foreground">
              Some property names have changed for consistency:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li><code>loading</code> → <code>isLoading</code></li>
              <li><code>input</code> → <code>inputValue</code> (in some cases)</li>
              <li>Added: <code>isRateLimited</code>, <code>queueStatus</code></li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold">Enhanced Options</h4>
            <p className="text-sm text-muted-foreground">
              New options for enterprise features:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li><code>enableRateLimiting</code> - Enable automatic rate limiting</li>
              <li><code>conversationId</code> - Enable cross-device sync</li>
              <li><code>maxConcurrentRequests</code> - Control concurrency</li>
              <li><code>onRateLimited</code> - Rate limit callback</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold">Improved Performance</h4>
            <p className="text-sm text-muted-foreground">
              Better memory management and automatic cleanup.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Migration Checklist</h2>

        <div className="space-y-3">
          {[
            'Update import statements',
            'Change hook name from useChatEnhanced to useClarityChat',
            'Review and update option names (loading → isLoading)',
            'Add enterprise features (rate limiting, sync) if desired',
            'Update error handling to use new error properties',
            'Test with new features enabled',
            'Remove useChatEnhanced from codebase'
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>

        <Callout type="info" title="Automated Migration">
          <p>
            For large codebases, consider writing a codemod to automate the migration
            from useChatEnhanced to useClarityChat.
          </p>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Legacy Documentation</h2>

        <Callout type="warning" title="This Documentation is Deprecated">
          <p>
            The documentation below is for the deprecated useChatEnhanced hook.
            It remains for reference during migration but should not be used for new development.
          </p>
        </Callout>

        <div className="mt-6 p-6 bg-muted rounded-lg opacity-75">
          <p className="text-sm text-muted-foreground mb-4">
            <em>The original useChatEnhanced documentation has been moved here for reference.</em>
          </p>

          <div className="text-sm text-muted-foreground">
            <p>
              useChatEnhanced was a mid-level React hook for building chat interfaces
              with message management, streaming responses, memory integration, and AI model integration.
            </p>
            <p className="mt-2">
              It has been superseded by useClarityChat which includes all original functionality
              plus enterprise features like rate limiting and cross-device synchronization.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Need Help?</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Migration Support</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Check the <a href="/reference/hooks/use-clarity-chat" className="text-brand-600 hover:underline">useClarityChat documentation</a></li>
              <li>Review the <a href="/learn/migration" className="text-brand-600 hover:underline">migration guide</a></li>
              <li>Join our <a href="https://discord.gg/clarity-chat" className="text-brand-600 hover:underline">Discord community</a></li>
              <li>Open a <a href="https://github.com/christireid/Clarity-ai-chat-components/issues" className="text-brand-600 hover:underline">GitHub issue</a></li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">v1.0.0: useChatEnhanced deprecated (current)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">v1.5.0: Deprecation warnings added</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">v2.0.0: useChatEnhanced removed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

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
          code={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react'
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
          initialCode={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react'
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
          code={`import { useChatEnhanced } from '@clarity-chat/react'

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
          code={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react'

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
          code={`import { useChatEnhanced } from '@clarity-chat/react'

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
          code={`import { useChatEnhanced } from '@clarity-chat/react'

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
          code={`import { useChatEnhanced, ChatWindow } from '@clarity-chat/react'

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
import { useChatEnhanced } from '@clarity-chat/react'

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
