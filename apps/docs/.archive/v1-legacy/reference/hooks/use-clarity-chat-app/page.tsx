'use client'

import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function UseClarityChatAppPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-4">
          <span>Recommended Hook</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useClarityChatApp</h1>
        <p className="text-xl text-muted-foreground mb-4">
          The unified hook for building custom chat UIs with all advanced
          features accessible via simple configuration.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> App-Level &bull;{' '}
          <strong>Domain:</strong> Chat State + Features
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-gradient-to-br from-emerald-50 to-brand-50 dark:from-emerald-950/30 dark:to-brand-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { useClarityChatApp } from '@clarity-chat/react'

const chat = useClarityChatApp({ api: '/api/chat' })

// Use chat.messages, chat.send(), chat.isLoading, chat.meta`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded">
            Headless
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Full Feature Access
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Rich Metadata
          </span>
        </div>
      </section>

      {/* When to Use */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
              Use This When:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You need complete UI control</li>
              <li>Building a custom chat interface</li>
              <li>You want access to rich metadata (tokens, memory, RAG)</li>
              <li>Integrating with existing component libraries</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
              Consider Alternatives When:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                You want a ready-made UI →{' '}
                <Link
                  href="/reference/components/clarity-chat-app"
                  className="text-brand-600 hover:underline"
                >
                  ClarityChatApp
                </Link>
              </li>
              <li>
                You don&apos;t need the unified features →{' '}
                <Link
                  href="/reference/hooks/use-clarity-chat"
                  className="text-brand-600 hover:underline"
                >
                  useClarityChat
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Basic Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="space-y-6">
          <CollapsibleSection title="Custom Chat UI" defaultOpen={true}>
            <CodePlayground
              code={`import { useClarityChatApp } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChatApp({
    api: '/api/chat',
    features: { memory: true, tokenOptimization: true },
  })

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {chat.messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            Start a conversation...
          </div>
        )}
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={\`mb-4 \${msg.role === 'user' ? 'text-right' : ''}\`}
          >
            <div
              className={\`inline-block px-4 py-2 rounded-lg \${
                msg.role === 'user'
                  ? 'bg-brand-500 text-white'
                  : 'bg-muted'
              }\`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {chat.isLoading && (
          <div className="text-muted-foreground">Thinking...</div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={chat.input}
            onChange={chat.handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && chat.handleSubmit()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={() => chat.handleSubmit()}
            disabled={chat.isLoading || !chat.input.trim()}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="With Token Stats Display" badge="Popular">
            <CodePlayground
              code={`import { useClarityChatApp } from '@clarity-chat/react'

function ChatWithStats() {
  const chat = useClarityChatApp({
    api: '/api/chat',
    features: { tokenOptimization: true },
    config: {
      tokenOptimization: { budget: 8000, showStats: true },
    },
  })

  return (
    <div>
      {/* Token Stats Bar */}
      <div className="flex justify-between p-2 bg-muted text-sm">
        <span>Input: {chat.meta.token.inputTokens}</span>
        <span>Output: {chat.meta.token.outputTokens}</span>
        <span>Budget: {chat.meta.token.budgetRemaining}</span>
        <span>
          Utilization: {(chat.meta.token.utilization * 100).toFixed(1)}%
        </span>
      </div>

      {/* Messages */}
      <div className="p-4">
        {chat.messages.map((msg) => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>

      {/* Send button that shows remaining budget */}
      <button
        onClick={() => chat.send('Hello!')}
        disabled={!chat.meta.token.budgetRemaining}
      >
        Send ({chat.meta.token.budgetRemaining} tokens left)
      </button>
    </div>
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="With Memory Stats">
            <CodePlayground
              code={`import { useClarityChatApp } from '@clarity-chat/react'

function ChatWithMemory() {
  const chat = useClarityChatApp({
    api: '/api/chat',
    features: { memory: true },
    config: {
      memory: { strategy: 'vector-store', maxTokens: 4000 },
    },
  })

  return (
    <div>
      {/* Memory Stats */}
      <div className="p-2 bg-muted text-sm">
        <span>Memory: {chat.meta.memory.enabled ? 'On' : 'Off'}</span>
        <span>Items: {chat.meta.memory.totalItems}</span>
        <span>Hits: {chat.meta.memory.hits}</span>
        <span>Injected: {chat.meta.memory.itemsInjected}</span>
      </div>

      {/* Chat UI */}
      {chat.messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      <button onClick={() => chat.clear()}>
        Clear Chat (keeps memory)
      </button>
    </div>
  )
}`}
            />
          </CollapsibleSection>
        </div>
      </section>

      {/* API Reference */}
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
                      <strong>Required.</strong> API endpoint for chat requests.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">preset</td>
                    <td className="p-3 font-mono text-sm">ClarityAppPreset</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Configuration preset (simple, pro, memory, rag, tools,
                      enterprise).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">features</td>
                    <td className="p-3 font-mono text-sm">
                      ClarityFeatureFlags
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Feature flags to enable/disable.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">config</td>
                    <td className="p-3 font-mono text-sm">ClarityAppConfig</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Detailed configuration overrides.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">initialMessages</td>
                    <td className="p-3 font-mono text-sm">Message[]</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Initial messages to populate the chat.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">systemPrompt</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      System prompt for the AI.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">model</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Model identifier (e.g., gpt-4).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">sources</td>
                    <td className="p-3 font-mono text-sm">RAGSource[]</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      RAG sources for document retrieval.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onEvent</td>
                    <td className="p-3 font-mono text-sm">
                      (event: ClarityEvent) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Event handler for all events.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Return Value" defaultOpen={true}>
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
                    <td className="p-3 font-mono text-sm">Message[]</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Current messages in the chat.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">send</td>
                    <td className="p-3 font-mono text-sm">
                      (content: string) =&gt; Promise&lt;void&gt;
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Send a user message.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">append</td>
                    <td className="p-3 font-mono text-sm">
                      (message) =&gt; Promise&lt;void&gt;
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Append a message directly.
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
                    <td className="p-3 text-sm text-muted-foreground">
                      Current error if any.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">stop</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Stop current streaming response.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">retry</td>
                    <td className="p-3 font-mono text-sm">
                      () =&gt; Promise&lt;void&gt;
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Retry the last failed request.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">clear</td>
                    <td className="p-3 font-mono text-sm">() =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Clear all messages.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">setMessages</td>
                    <td className="p-3 font-mono text-sm">
                      (messages: Message[]) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Set messages directly.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">input</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Current input value for controlled input.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">setInput</td>
                    <td className="p-3 font-mono text-sm">
                      (value: string) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Set input value.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">handleInputChange</td>
                    <td className="p-3 font-mono text-sm">
                      (e: ChangeEvent) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Handle input change events.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">handleSubmit</td>
                    <td className="p-3 font-mono text-sm">
                      (e?: FormEvent) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Handle form submission.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">meta</td>
                    <td className="p-3 font-mono text-sm">ClarityMeta</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Rich metadata (tokens, memory, rag, safety, tools).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">config</td>
                    <td className="p-3 font-mono text-sm">
                      ClarityResolvedConfig
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Fully resolved configuration.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Metadata (meta) Structure">
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`interface ClarityMeta {
  token: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
    utilization: number       // 0-1 ratio
    budgetRemaining: number
    estimatedCost?: number
  }
  memory: {
    enabled: boolean
    hits: number              // Cache hits
    itemsInjected: number     // Items added to context
    totalItems: number        // Total stored items
    lastQueryLatencyMs?: number
  }
  rag: {
    enabled: boolean
    sources: number
    chunksRetrieved: number
    queryLatencyMs?: number
  }
  safety: {
    enabled: boolean
    riskLevel: 'none' | 'low' | 'medium' | 'high'
    redactions: number
    blockedRequests: number
  }
  tools: {
    enabled: boolean
    callsTotal: number
    callsPending: number
    lastResult?: unknown
  }
}`}</code>
            </pre>
          </CollapsibleSection>
        </div>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/clarity-chat-app"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ClarityChatApp</h3>
            <p className="text-sm text-muted-foreground">
              Ready-to-use component with built-in UI.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Legacy hook for lower-level control.
            </p>
          </Link>
        </div>
      </section>

      {/* Feedback Widget */}
      <FeedbackWidget pageId="use-clarity-chat-app" className="mt-12" />
    </div>
  )
}
