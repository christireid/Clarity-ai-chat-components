'use client'

import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function UseClarityChatPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>Top-Level Hook</span>
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

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { useClarityChat } from '@clarity-chat/react'

const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat'
})

// Send a message
await append({ role: 'user', content: 'Hello!' })`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">Streaming</span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">Memory</span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">Multi-model</span>
        </div>
      </section>

      {/* When to Use */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Use This When:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Building a new chat interface from scratch</li>
              <li>You need memory/context persistence across sessions</li>
              <li>You want streaming responses with SSE or WebSocket</li>
              <li>You need token optimization and cost management</li>
              <li>You want the simplest path to a working chat</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Consider Alternatives When:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You need tool/function calling → <Link href="/reference/hooks/use-clarity-chat-with-tools" className="text-brand-600 hover:underline">useClarityChatWithTools</Link></li>
              <li>You need structured JSON output → <Link href="/reference/hooks/use-clarity-object" className="text-brand-600 hover:underline">useClarityObject</Link></li>
              <li>You need fine-grained streaming control → <Link href="/reference/hooks/use-streaming-sse" className="text-brand-600 hover:underline">useStreamingSSE</Link></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Core Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Message state management with optimistic updates</li>
              <li>Streaming response handling (SSE/WebSocket)</li>
              <li>Multi-model support (OpenAI, Anthropic, Google)</li>
              <li>Automatic token counting and context management</li>
              <li>Error handling and retry logic</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Enhanced Features</h3>
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
          <CollapsibleSection title="Simple Chat" defaultOpen={true}>
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

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handleSendMessage}
    />
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="With Handlers (Recommended)" badge="Best Practice">
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
          </CollapsibleSection>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Advanced Examples</h2>
        <div className="space-y-4">
          <CollapsibleSection title="With Memory Integration" badge="Pro">
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
    },
  })

  return (
    <div>
      <div className="mb-4">
        <p>Memory Status: {chat.memoryInfo.enabled ? 'Enabled' : 'Disabled'}</p>
        <p>Memory Count: {chat.memoryInfo.memoryCount}</p>
      </div>
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={(content) => chat.append({ role: 'user', content })}
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
          </CollapsibleSection>

          <CollapsibleSection title="With Prompt Optimization" badge="Cost Saving">
            <CodePlayground
              code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function OptimizedChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 8000,
      strategy: 'hybrid', // 'sliding-window' | 'summarize-old' | 'hybrid'
      keepRecent: 2, // Always keep last 2 messages
    },
  })

  return (
    <div>
      {chat.tokenStats && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <p>Input Tokens: {chat.tokenStats.inputTokens}</p>
          <p>Remaining Budget: {chat.tokenStats.remainingBudget}</p>
          <p>Utilization: {(chat.tokenStats.utilization * 100).toFixed(1)}%</p>
        </div>
      )}
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={(content) => chat.append({ role: 'user', content })}
      />
    </div>
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="With WebSocket Transport">
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
    },
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={(content) => chat.append({ role: 'user', content })}
    />
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Error Handling">
            <CodePlayground
              code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function ChatWithErrorHandling() {
  const chat = useClarityChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  return (
    <div>
      {chat.error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg">
          <p className="text-red-800 dark:text-red-200">
            Error: {chat.error.message}
          </p>
        </div>
      )}
      <ChatWindow
        messages={chat.messages}
        isLoading={chat.isLoading}
        onSendMessage={(content) => chat.append({ role: 'user', content })}
      />
    </div>
  )
}`}
            />
          </CollapsibleSection>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-4">
          <CollapsibleSection title="Options" defaultOpen={true}>
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
                      Memory integration configuration.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">transport</td>
                    <td className="p-3 font-mono text-sm">'sse' | 'websocket'</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Transport protocol. Default: 'sse'.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">promptOptimization</td>
                    <td className="p-3 font-mono text-sm">ClarityPromptOptimizationOptions</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Token budget management configuration.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onError</td>
                    <td className="p-3 font-mono text-sm">(error: Error) =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Error callback handler.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Return Value">
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
                      Array of chat messages.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">append</td>
                    <td className="p-3 font-mono text-sm">(message) =&gt; Promise</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Add message and trigger AI response.
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
                      Memory statistics and context.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">tokenStats</td>
                    <td className="p-3 font-mono text-sm">TokenStats | undefined</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Token usage statistics.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">setMessages</td>
                    <td className="p-3 font-mono text-sm">(messages) =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Directly set messages array.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">stop</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Stop current streaming response.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        </div>
      </section>

      <section className="mb-12">
        <CollapsibleSection title="Migration from useChat" badge="Legacy">
          <div className="bg-muted p-6 rounded-lg">
            <p className="mb-4">
              If you're using the legacy <code className="bg-background px-2 py-1 rounded">useChat</code> hook,
              migrating is straightforward:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Before (useChat)</h4>
                <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
                  <code>{`useChat({
  apiEndpoint: '/api/chat',
})`}</code>
                </pre>
              </div>
              <div>
                <h4 className="font-semibold mb-2">After (useClarityChat)</h4>
                <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
                  <code>{`useClarityChat({
  api: '/api/chat',
})`}</code>
                </pre>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <strong>Key Change:</strong> <code className="bg-background px-1 rounded">apiEndpoint</code> → <code className="bg-background px-1 rounded">api</code>
            </p>
          </div>
        </CollapsibleSection>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Use useChatHandlers for Simpler Integration</h3>
            <p className="text-sm text-muted-foreground">
              Use <code className="bg-muted px-1 rounded">useChatHandlers</code> for
              pre-configured handlers that work seamlessly with <code className="bg-muted px-1 rounded">ChatWindow</code>.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Enable Memory for Long Conversations</h3>
            <p className="text-sm text-muted-foreground">
              For conversations beyond the token limit, enable memory with{' '}
              <code className="bg-muted px-1 rounded">vector-store</code> strategy.
            </p>
          </div>
          <div className="border-l-4 border-brand-500 pl-4">
            <h3 className="font-semibold mb-2">Use Prompt Optimization for Cost Savings</h3>
            <p className="text-sm text-muted-foreground">
              Enable prompt optimization to reduce API costs by 30-50%.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-clarity-chat-with-tools"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChatWithTools</h3>
            <p className="text-sm text-muted-foreground">
              Chat with function calling and tool UI registry.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-memory-context"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useMemoryContext</h3>
            <p className="text-sm text-muted-foreground">
              Direct access to memory operations.
            </p>
          </Link>
          <Link
            href="/reference/hooks/compare"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Compare Hooks</h3>
            <p className="text-sm text-muted-foreground">
              Compare this hook with alternatives side-by-side.
            </p>
          </Link>
          <Link
            href="/guides/memory"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Memory Guide</h3>
            <p className="text-sm text-muted-foreground">
              Complete guide to memory integration.
            </p>
          </Link>
        </div>
      </section>

      {/* Feedback Widget */}
      <FeedbackWidget pageId="use-clarity-chat" className="mt-12" />
    </div>
  )
}
