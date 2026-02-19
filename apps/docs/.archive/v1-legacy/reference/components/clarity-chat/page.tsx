import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'ClarityChat Component | Clarity Chat',
  description:
    'Top-level drop-in component for AI chat. The simplest way to add chat to your app - just provide an API endpoint.',
}

const clarityChatProps: Prop[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description:
      'API endpoint URL for chat requests. This is the only required prop.',
  },
  {
    name: 'chatId',
    type: 'string',
    description:
      'Optional chat ID for conversation persistence across sessions.',
  },
  {
    name: 'conversationId',
    type: 'string',
    description:
      'Unique identifier for cross-device conversation synchronization.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Optional CSS class name for the chat container.',
  },
  {
    name: 'emptyState',
    type: 'ReactNode',
    description: 'Custom content to display when there are no messages.',
  },
  {
    name: 'showHeader',
    type: 'boolean',
    default: 'false',
    description: 'Show header with session information.',
  },
  {
    name: 'sessionTitle',
    type: 'string',
    description: 'Title displayed in the header when showHeader is true.',
  },
  {
    name: 'sessionSubtitle',
    type: 'string',
    description: 'Subtitle or description displayed in the header.',
  },
  {
    name: 'headerActions',
    type: 'ReactNode',
    description: 'Custom actions to display in the header.',
  },
  {
    name: 'showMessageCount',
    type: 'boolean',
    default: 'false',
    description: 'Show badge with message count in the header.',
  },
  {
    name: 'onExport',
    type: '() => void',
    description: 'Callback function for exporting the conversation.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description: 'Callback function for clearing the chat.',
  },
  {
    name: 'autoScroll',
    type: 'boolean',
    default: 'true',
    description: 'Automatically scroll to bottom when new messages arrive.',
  },
  {
    name: 'onMessageCopy',
    type: '(id: string, content: string) => void',
    description: 'Callback when a message is copied to clipboard.',
  },
  {
    name: 'onMessageFeedback',
    type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
    description:
      'Callback when user provides thumbs up/down feedback on a message. Optionally includes a comment.',
  },
  {
    name: 'onEditMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user initiates editing a message.',
  },
  {
    name: 'onRegenerateMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user requests regenerating a message response.',
  },
  {
    name: 'onDeleteMessage',
    type: '(messageId: string) => void',
    description: 'Callback when user deletes a message from the conversation.',
  },
  {
    name: 'theme',
    type: 'string',
    description: 'Theme name to apply to the chat interface.',
  },
  {
    name: 'showTokenCounter',
    type: 'boolean',
    default: 'false',
    description: 'Show token counter in the input area.',
  },
  {
    name: 'showNetworkStatus',
    type: 'boolean',
    default: 'false',
    description: 'Show network connection status indicator.',
  },
  {
    name: 'enableMessageOperations',
    type: 'boolean',
    default: 'false',
    description: 'Enable message operations like edit, delete, and branch.',
  },
  {
    name: 'enableRateLimiting',
    type: 'boolean',
    default: 'false',
    description: 'Enable advanced rate limiting with request queuing and automatic retry.',
  },
  {
    name: 'maxConcurrentRequests',
    type: 'number',
    default: '3',
    description: 'Maximum number of concurrent API requests when rate limiting is enabled.',
  },
  {
    name: 'maxQueueSize',
    type: 'number',
    default: '10',
    description: 'Maximum size of the request queue when rate limiting is enabled.',
  },
  {
    name: 'showQueueStatus',
    type: 'boolean',
    default: 'false',
    description: 'Show real-time queue status and rate limiting indicators.',
  },
  {
    name: 'onRateLimited',
    type: '(resetTime?: number) => void',
    description: 'Callback when rate limit is exceeded. Provides estimated reset time.',
  },
  {
    name: 'onRequestQueued',
    type: '(position: number, estimatedWaitMs: number) => void',
    description: 'Callback when a request is queued due to rate limiting.',
  },
  {
    name: 'onQueueFull',
    type: '() => void',
    description: 'Callback when the request queue reaches maximum capacity.',
  },
  {
    name: 'compactQueueStatus',
    type: 'boolean',
    default: 'false',
    description: 'Show compact version of queue status display.',
  },
  {
    name: 'memoryStrategy',
    type: '"sliding-window" | "semantic-chunks" | "vector-store"',
    description: 'Memory strategy for conversation context management.',
  },
  {
    name: 'onError',
    type: '(error: Error, errorInfo?: React.ErrorInfo) => void',
    description: 'Error handler callback with error details.',
  },
  {
    name: 'memory',
    type: 'ClarityMemoryOptions',
    description:
      'Memory integration configuration. See useClarityChat documentation.',
  },
  {
    name: 'transport',
    type: '"sse" | "websocket"',
    default: '"sse"',
    description:
      'Transport protocol for streaming. Default is Server-Sent Events.',
  },
  {
    name: 'websocket',
    type: 'ClarityWebSocketOptions',
    description:
      'WebSocket-specific options (only used when transport is "websocket").',
  },
  {
    name: 'promptOptimization',
    type: 'ClarityPromptOptimizationOptions',
    description:
      'Prompt optimization configuration for token budget management.',
  },
]

export default function ClarityChatPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>⭐</span>
          <span>Recommended entry point for most use cases</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">ClarityChat</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Enterprise-ready AI chat component with cross-device sync, rate limiting, and template marketplace.
          The simplest way to add production-grade AI chat to your app - just provide an API endpoint.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
          <strong>Domain:</strong> Enterprise Chat UI •{' '}
          <strong>Features:</strong> Sync, Rate Limiting, Templates
        </p>
      </div>

      <Callout type="info" title="When to Use ClarityChat">
        <p className="mb-2">
          <strong>Use ClarityChat when:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 mb-2">
          <li>You want the simplest possible integration</li>
          <li>You're building a new feature and want to get started quickly</li>
          <li>You don't need fine-grained control over the chat state</li>
        </ul>
        <p className="mb-2">
          <strong>Use ChatWindow + useClarityChat when:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>You need more control over the chat state</li>
          <li>You want to customize the UI extensively</li>
          <li>You need to integrate with complex state management</li>
        </ul>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'
// Note: Import styles in your app's entry point
// import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          That's it! You now have a fully functional AI chat interface with
          streaming, error handling, and all robust features.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Memory Integration</h2>
        <CodePlayground
          code={`import { ClarityChat, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ClarityChat
        api="/api/chat"
        memory={{
          enabled: true,
          strategy: 'vector-store',
          maxTokens: 8000,
        }}
      />
    </MemoryProvider>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Custom Header</h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      header={{
        show: true,
        title: 'AI Assistant',
        subtitle: 'Ask me anything!',
        showMessageCount: true,
        actions: (
          <button onClick={() => console.log('Settings clicked')}>
            Settings
          </button>
        )
      }}
    />
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">
          With Prompt Optimization
        </h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      promptOptimization={{
        enabled: true,
        targetTokens: 8000,
        strategy: 'hybrid',
        model: 'gpt-4',
      }}
      showTokenCounter
    />
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">
          With WebSocket Transport
        </h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      transport="websocket"
      websocket={{
        autoReconnect: true,
        maxReconnectAttempts: 5,
        enableHeartbeat: true,
      }}
    />
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Message Operations</h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      messageActions={{
        onCopy: (id, content) => {
          console.log('Message copied:', id)
        },
        onFeedback: (messageId, feedbackType) => {
          console.log('Feedback:', messageId, feedbackType)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Rate Limiting & Queue Management</h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      enableRateLimiting={true}
      maxConcurrentRequests={3}
      maxQueueSize={10}
      showQueueStatus={true}
      onRateLimited={(resetTime) => {
        console.log('Rate limited, resets at:', new Date(resetTime || 0))
      }}
      onRequestQueued={(position, waitMs) => {
        console.log(\`Queued at position \${position}, ~\${Math.round(waitMs/1000)}s wait\`)
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Automatically handles API rate limits with intelligent queuing, retry logic,
          and real-time status indicators. Perfect for high-traffic applications.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Cross-Device Synchronization</h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      conversationId="user-session-123"
      enableRateLimiting={true}
      showQueueStatus={true}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Seamlessly sync conversations across devices with automatic conflict resolution.
          Conversations persist and continue exactly where you left off.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Enterprise Configuration</h2>
        <CodePlayground
          code={`import { ClarityChat, MemoryProvider } from '@clarity-chat/react'

function EnterpriseApp() {
  return (
    <MemoryProvider config={{ maxTokens: 50000 }}>
      <ClarityChat
        api="/api/chat"
        conversationId="enterprise-session"
        enableRateLimiting={true}
        maxConcurrentRequests={5}
        maxQueueSize={20}
        showQueueStatus={true}
        memory={{
          enabled: true,
          strategy: 'vector-store',
          maxTokens: 40000,
        }}
        promptOptimization={{
          enabled: true,
          targetTokens: 32000,
          strategy: 'hybrid',
        }}
        onRateLimited={(resetTime) => {
          // Log to monitoring system
          analytics.track('rate_limit_exceeded', { resetTime })
        }}
        onError={(error) => {
          // Send to error monitoring
          errorReporting.captureException(error)
        }}
      />
    </MemoryProvider>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Complete enterprise configuration with memory, rate limiting, sync,
          and comprehensive error handling. Robust for high-traffic applications.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Props Reference</h2>
        <PropsTable props={clarityChatProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">✨ Core Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Automatic message format conversion</li>
              <li>Built-in loading states</li>
              <li>Error handling and recovery</li>
              <li>Streaming support (SSE/WebSocket)</li>
              <li>Multi-model support</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🚀 Enhanced Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Memory integration</li>
              <li>Prompt optimization</li>
              <li>Token counter</li>
              <li>Network status indicator</li>
              <li>Message operations (edit, delete, branch)</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🏆 Enterprise Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Cross-device synchronization</li>
              <li>Advanced rate limiting & queuing</li>
              <li>Real-time conflict resolution</li>
              <li>Offline support & queue management</li>
              <li>Template marketplace integration</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Always Import Styles</h3>
            <p className="text-sm text-muted-foreground">
              Don't forget to import the CSS file:{' '}
              <code className="bg-muted px-1 rounded">
                import '@clarity-chat/react/styles.css'
              </code>
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Use Presets for Common Cases</h3>
            <p className="text-sm text-muted-foreground">
              For common use cases, consider using{' '}
              <Link
                href="/reference/components/clarity-chat-presets"
                className="text-brand-600 hover:underline"
              >
                ClarityChatPresets
              </Link>{' '}
              for even simpler integration.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Handle Errors</h3>
            <p className="text-sm text-muted-foreground">
              Always provide an{' '}
              <code className="bg-muted px-1 rounded">onError</code> callback to
              handle errors gracefully in production.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">
              Enable Memory for Long Conversations
            </h3>
            <p className="text-sm text-muted-foreground">
              For conversations that need context beyond the token limit, enable
              memory with the{' '}
              <code className="bg-muted px-1 rounded">vector-store</code>{' '}
              strategy.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/clarity-chat-presets"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ClarityChatPresets</h3>
            <p className="text-sm text-muted-foreground">
              Pre-configured presets for common use cases.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChat Hook</h3>
            <p className="text-sm text-muted-foreground">
              The hook that powers ClarityChat. Use this for more control.
            </p>
          </Link>
          <Link
            href="/reference/components/chat-window"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ChatWindow Component</h3>
            <p className="text-sm text-muted-foreground">
              The underlying component used by ClarityChat.
            </p>
          </Link>
          <Link
            href="/learn/quick-start"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Quick Start Guide</h3>
            <p className="text-sm text-muted-foreground">
              Get started with Clarity Chat in 5 minutes.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
