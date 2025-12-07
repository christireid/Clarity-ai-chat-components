import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useClarityChat Hook | Clarity Chat',
  description:
    'Primary hook for chat functionality with memory integration, streaming, and AI interactions. Recommended for all new projects.',
}

export default function UseClarityChatPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>⭐</span>
          <span>Recommended for all new projects</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useClarityChat</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Primary React hook for building chat interfaces with message management,
          streaming responses, memory integration, and AI model integration.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
          <strong>Domain:</strong> Chat State
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">✨ Core Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Message state management with optimistic updates</li>
              <li>Streaming response handling (SSE/WebSocket)</li>
              <li>Multi-model support (OpenAI, Anthropic, Google)</li>
              <li>Automatic token counting and context management</li>
              <li>Error handling and retry logic</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">🚀 Enhanced Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Memory integration (sliding-window, vector-store)</li>
              <li>Prompt optimization (token budget management)</li>
              <li>WebSocket support with auto-reconnection</li>
              <li>File upload and attachment handling</li>
              <li>Message editing and deletion</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Simple Chat</h3>
            <CodePlayground
              code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function ChatComponent() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  const handleSendMessage = async (content: string) => {
    await chat.append({ role: 'user', content })
  }

  const handleClear = () => {
    chat.setMessages([])
  }

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handleSendMessage}
      onClear={handleClear}
    />
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">With Handlers (Recommended)</h3>
            <CodePlayground
              code={`import { 
  useClarityChat, 
  useChatHandlers, 
  ChatWindow 
} from '@clarity-chat/react'

function ChatComponent() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Pre-configured handlers - no boilerplate! ✨
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
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Memory Integration</h2>
        <CodePlayground
          code={`import { useClarityChat, MemoryProvider, ChatWindow } from '@clarity-chat/react'

function ChatWithMemory() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store', // or 'sliding-window', 'semantic-chunks'
      maxTokens: 8000,
      retryOnError: true,
      maxRetryAttempts: 2,
    },
  })

  const handleSendMessage = async (content: string) => {
    await chat.append({ role: 'user', content })
  }

  return (
    <div>
      <div className="mb-4">
        <p>Memory Status: {chat.memoryInfo.enabled ? 'Enabled' : 'Disabled'}</p>
        <p>Memory Count: {chat.memoryInfo.memoryCount}</p>
        {chat.memoryErrorInfo.memoryError && (
          <p className="text-red-500">
            Memory Error: {chat.memoryErrorInfo.memoryError.message}
          </p>
        )}
      </div>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}

// Wrap with MemoryProvider for vector-store strategy
function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatWithMemory />
    </MemoryProvider>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Prompt Optimization</h2>
        <CodePlayground
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function OptimizedChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 8000,
      strategy: 'hybrid', // 'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'
      model: 'gpt-4',
      keepRecent: 2, // Always keep last 2 messages
    },
  })

  const handleSendMessage = async (content: string) => {
    await chat.append({ role: 'user', content })
  }

  return (
    <div>
      {chat.tokenStats && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <p>Input Tokens: {chat.tokenStats.inputTokens}</p>
          <p>Remaining Budget: {chat.tokenStats.remainingBudget}</p>
          <p>Utilization: {(chat.tokenStats.utilization * 100).toFixed(1)}%</p>
          {chat.tokenStats.wasOptimized && (
            <p className="text-sm text-muted-foreground">
              Optimized: {chat.tokenStats.lastOptimizationReason}
            </p>
          )}
        </div>
      )}
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With WebSocket Transport</h2>
        <CodePlayground
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function WebSocketChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    transport: 'websocket',
    websocket: {
      autoReconnect: true,
      maxReconnectAttempts: 5,
      enableHeartbeat: true,
      protocols: ['chat-protocol'],
    },
  })

  const handleSendMessage = async (content: string) => {
    await chat.append({ role: 'user', content })
  }

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handleSendMessage}
    />
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Validation & Error Handling</h2>
        <CodePlayground
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function ChatWithValidation() {
  // Validate API endpoint before using hook
  const apiEndpoint = process.env.NEXT_PUBLIC_CHAT_API || '/api/chat'
  
  if (!apiEndpoint || apiEndpoint.trim().length === 0) {
    throw new Error('API endpoint is required. Set NEXT_PUBLIC_CHAT_API or provide api prop.')
  }

  const chat = useClarityChat({
    api: apiEndpoint,
    onError: (error) => {
      console.error('Chat error:', error)
      // Handle different error types
      if (error.message.includes('network')) {
        // Network error - show retry option
      } else if (error.message.includes('rate limit')) {
        // Rate limit - show wait message
      } else {
        // Other errors - show generic error
      }
    },
  })

  const handleSendMessage = async (content: string) => {
    // Validate input
    if (!content || content.trim().length === 0) {
      return // Don't send empty messages
    }

    try {
      await chat.append({ role: 'user', content })
    } catch (error) {
      // Handle send error
      console.error('Failed to send message:', error)
      // Could show toast notification here
    }
  }

  return (
    <div>
      {chat.error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
          <p className="text-red-700 dark:text-red-300 text-sm mt-1">
            {chat.error.message}
          </p>
          {chat.error.message.includes('network') && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm underline"
            >
              Retry connection
            </button>
          )}
        </div>
      )}
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Error Handling</h2>
        <CodePlayground
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function ChatWithErrorHandling() {
  const chat = useClarityChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
      // Handle error (show toast, log to analytics, etc.)
    },
  })

  const handleSendMessage = async (content: string) => {
    try {
      await chat.append({ role: 'user', content })
    } catch (error) {
      // Handle send error
      console.error('Failed to send message:', error)
    }
  }

  return (
    <div>
      {chat.error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            Error: {chat.error.message}
          </p>
        </div>
      )}
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Options</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">api</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <strong>Required.</strong> API endpoint URL for chat requests.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">memory</td>
                    <td className="p-3 font-mono text-sm">ClarityMemoryOptions</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Memory integration configuration. See{' '}
                      <Link href="/guides/memory" className="text-brand-600 hover:underline">
                        Memory Guide
                      </Link>
                      .
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">transport</td>
                    <td className="p-3 font-mono text-sm">'sse' | 'websocket'</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Transport protocol. Default: 'sse' (Server-Sent Events).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">websocket</td>
                    <td className="p-3 font-mono text-sm">ClarityWebSocketOptions</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      WebSocket-specific options (only used when transport is 'websocket').
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">promptOptimization</td>
                    <td className="p-3 font-mono text-sm">ClarityPromptOptimizationOptions</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Prompt optimization configuration for token budget management.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">...rest</td>
                    <td className="p-3 font-mono text-sm">UseChatEnhancedOptions</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      All options from{' '}
                      <Link
                        href="/reference/hooks/use-chat"
                        className="text-brand-600 hover:underline"
                      >
                        useChatEnhanced
                      </Link>
                      .
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">messages</td>
                    <td className="p-3 font-mono text-sm">CoreMessage[]</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Array of chat messages in CoreMessage format.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">append</td>
                    <td className="p-3 font-mono text-sm">(message: CoreMessage) =&gt; Promise{'<'}{'string | null'}{'>'}</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Add a new message and trigger AI response. Returns message ID or null.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">isLoading</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether a request is in progress.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">error</td>
                    <td className="p-3 font-mono text-sm">Error | null</td>
                    <td className="p-3 text-sm text-muted-foreground">Last error, if any.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">memoryInfo</td>
                    <td className="p-3 font-mono text-sm">ClarityChatMemoryInfo</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Memory statistics and context summary.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">memoryErrorInfo</td>
                    <td className="p-3 font-mono text-sm">ClarityChatErrorInfo</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Error information for memory operations.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">tokenStats</td>
                    <td className="p-3 font-mono text-sm">ClarityChatTokenStats | undefined</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Token statistics (if prompt optimization enabled).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">...rest</td>
                    <td className="p-3 font-mono text-sm">UseChatEnhancedReturn</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      All return values from{' '}
                      <Link
                        href="/reference/hooks/use-chat"
                        className="text-brand-600 hover:underline"
                      >
                        useChatEnhanced
                      </Link>
                      .
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Migration from useChat</h2>
        <div className="bg-muted p-6 rounded-lg">
          <p className="mb-4">
            If you're using the legacy <code className="bg-background px-2 py-1 rounded">useChat</code> hook,
            migrating to <code className="bg-background px-2 py-1 rounded">useClarityChat</code> is straightforward:
          </p>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Before (useChat)</h4>
              <pre className="bg-background p-4 rounded text-sm overflow-x-auto">
                <code>{`const {
  messages,
  append,
  isLoading,
  error
} = useChat({
  apiEndpoint: '/api/chat',
  model: 'gpt-4',
})`}</code>
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">After (useClarityChat)</h4>
              <pre className="bg-background p-4 rounded text-sm overflow-x-auto">
                <code>{`const {
  messages,
  append,
  isLoading,
  error
} = useClarityChat({
  api: '/api/chat', // Note: 'api' instead of 'apiEndpoint'
  // model option works the same way
})`}</code>
              </pre>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <strong>Key Changes:</strong>
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
            <li>
              <code className="bg-background px-1 rounded">apiEndpoint</code> → <code className="bg-background px-1 rounded">api</code>
            </li>
            <li>All other options remain the same</li>
            <li>Additional features: memory, prompt optimization, WebSocket support</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Use useChatHandlers for Simpler Integration</h3>
            <p className="text-sm text-muted-foreground">
              Instead of manually wiring up handlers, use <code className="bg-muted px-1 rounded">useChatHandlers</code> for
              pre-configured handlers that work seamlessly with <code className="bg-muted px-1 rounded">ChatWindow</code>.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Enable Memory for Long Conversations</h3>
            <p className="text-sm text-muted-foreground">
              For conversations that need context beyond the token limit, enable memory with{' '}
              <code className="bg-muted px-1 rounded">vector-store</code> strategy for semantic retrieval.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Use Prompt Optimization for Cost Savings</h3>
            <p className="text-sm text-muted-foreground">
              Enable prompt optimization to automatically manage token budgets and reduce API costs by 30-50%.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Handle Memory Errors Gracefully</h3>
            <p className="text-sm text-muted-foreground">
              Check <code className="bg-muted px-1 rounded">memoryErrorInfo</code> and provide fallback behavior when memory operations fail.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">MemoryProvider Requires Config</h3>
            <p className="text-sm text-muted-foreground">
              When using <code className="bg-muted px-1 rounded">vector-store</code> strategy, always wrap with{' '}
              <code className="bg-muted px-1 rounded">MemoryProvider</code> and provide the required{' '}
              <code className="bg-muted px-1 rounded">config</code> prop with <code className="bg-muted px-1 rounded">maxTokens</code>.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/chat-window"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ChatWindow Component</h3>
            <p className="text-sm text-muted-foreground">
              Main chat container component that works seamlessly with useClarityChat.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-chat-handlers"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useChatHandlers Hook</h3>
            <p className="text-sm text-muted-foreground">
              Pre-configured handlers for easier integration with ChatWindow.
            </p>
          </Link>
          <Link
            href="/guides/memory"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Memory Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn how to use memory integration for long conversations.
            </p>
          </Link>
          <Link
            href="/guides/token-optimization"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Token Optimization Guide</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive guide on reducing API costs with prompt optimization.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
