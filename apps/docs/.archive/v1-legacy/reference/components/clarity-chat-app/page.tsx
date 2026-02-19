'use client'

import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function ClarityChatAppPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-4">
          <span>Recommended</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">ClarityChatApp</h1>
        <p className="text-xl text-muted-foreground mb-4">
          The unified, easy-to-use chat component. Get a robust AI
          chat in 3 minutes with automatic integration of advanced features.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> App-Level (Highest) &bull;{' '}
          <strong>Domain:</strong> Complete Chat Solution
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-gradient-to-br from-emerald-50 to-brand-50 dark:from-emerald-950/30 dark:to-brand-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { ClarityChatApp } from '@clarity-chat/react'

// That's it! Full-featured chat in one component
<ClarityChatApp api="/api/chat" />`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded">
            3-Minute Setup
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Streaming Built-In
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            All Features via Flags
          </span>
        </div>
      </section>

      {/* Why Use This */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Why ClarityChatApp?</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-lg p-4 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/20">
            <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              One Component, All Features
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Memory, RAG, Tools, Safety &mdash; all via simple flags</li>
              <li>No additional imports or providers needed</li>
              <li>Production defaults out of the box</li>
              <li>Automatic error recovery and retry logic</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-950/20">
            <h3 className="font-semibold text-brand-600 dark:text-brand-400 mb-2">
              Presets for Common Use Cases
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                <code className="text-xs bg-muted px-1 rounded">simple</code>{' '}
                &mdash; Streaming + retries
              </li>
              <li>
                <code className="text-xs bg-muted px-1 rounded">pro</code>{' '}
                &mdash; + Token stats + optimization
              </li>
              <li>
                <code className="text-xs bg-muted px-1 rounded">memory</code>{' '}
                &mdash; + Conversation memory
              </li>
              <li>
                <code className="text-xs bg-muted px-1 rounded">enterprise</code>{' '}
                &mdash; All features enabled
              </li>
            </ul>
          </div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>New to Clarity Chat?</strong> Start with ClarityChatApp. It&apos;s
            the fastest path to a working chat. Use{' '}
            <Link href="/reference/components/clarity-chat" className="underline">
              ClarityChat
            </Link>{' '}
            (legacy) only if you need lower-level control.
          </p>
        </div>
      </section>

      {/* Basic Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="space-y-6">
          <CollapsibleSection title="Minimal Setup" defaultOpen={true}>
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <div style={{ height: '500px' }}>
      <ClarityChatApp api="/api/chat" />
    </div>
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="With Memory Enabled" badge="Popular">
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      features={{ memory: true }}
    />
  )
}`}
            />
            <p className="mt-4 text-sm text-muted-foreground">
              Memory enables the chat to remember context across messages using
              a sliding window by default. Use{' '}
              <code className="bg-muted px-1 rounded">
                config.memory.strategy
              </code>{' '}
              to change to vector-store for longer conversations.
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="Using a Preset">
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="pro"
    />
  )
}

// Available presets:
// - "simple": Streaming + retries + accessible UI
// - "pro": + Token stats, basic optimization, basic safety
// - "memory": + Memory with sliding-window defaults
// - "rag": + Sources + chunking + retrieval defaults
// - "tools": + Tool calling with registry pattern
// - "enterprise": All features enabled`}
            />
          </CollapsibleSection>
        </div>
      </section>

      {/* Advanced Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Advanced Examples</h2>
        <div className="space-y-4">
          <CollapsibleSection
            title="Enterprise Configuration"
            badge="Enterprise"
          >
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      preset="enterprise"
      model="gpt-4"
      systemPrompt="You are a helpful enterprise assistant..."
      config={{
        tokenOptimization: {
          budget: 16000,
          showStats: true,
        },
        memory: {
          strategy: 'vector-store',
          maxTokens: 8000,
        },
        safety: {
          level: 'strict',
          piiRedaction: true,
        },
        observability: {
          metrics: true,
          tracing: true,
        },
      }}
      onEvent={(event) => {
        console.log('Event:', event.type, event.data)
      }}
      onError={(error) => {
        console.error('Error:', error)
      }}
    />
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="With RAG Sources" badge="RAG">
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      features={{ rag: true }}
      sources={[
        {
          type: 'text',
          content: 'Your company documentation here...',
          metadata: { source: 'docs' },
        },
        {
          type: 'url',
          url: 'https://example.com/api-docs',
        },
      ]}
      config={{
        rag: {
          topK: 5,
          showCitations: true,
          similarityThreshold: 0.7,
        },
      }}
    />
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="With Custom Tools" badge="Tools">
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      features={{ tools: true }}
      config={{
        tools: {
          registry: [
            {
              name: 'get_weather',
              description: 'Get current weather for a location',
              parameters: {
                type: 'object',
                properties: {
                  location: { type: 'string' },
                },
                required: ['location'],
              },
              execute: async ({ location }) => {
                // Your API call here
                return { temp: 72, condition: 'sunny' }
              },
            },
          ],
          autoApprove: false,
          timeoutMs: 5000,
        },
      }}
    />
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Event Handling & Callbacks">
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      features={{ observability: true }}
      onEvent={(event) => {
        switch (event.type) {
          case 'message:sent':
            console.log('User sent:', event.data.message)
            break
          case 'message:received':
            console.log('AI responded:', event.data.message)
            break
          case 'token:counted':
            console.log('Tokens used:', event.data)
            break
          case 'memory:injected':
            console.log('Memory context injected')
            break
          case 'safety:blocked':
            console.warn('Content blocked:', event.data.reason)
            break
        }
      }}
      onMessageSent={(message) => {
        // Analytics: track user message
      }}
      onMessageReceived={(message) => {
        // Analytics: track AI response
      }}
      onError={(error) => {
        // Error tracking
        Sentry.captureException(error)
      }}
    />
  )
}`}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Custom UI Components">
            <CodePlayground
              code={`import { ClarityChatApp } from '@clarity-chat/react'

function CustomHeader({ title }) {
  return (
    <div className="p-4 border-b flex justify-between items-center">
      <h2 className="font-bold">{title}</h2>
      <span className="text-xs text-muted-foreground">Powered by Clarity</span>
    </div>
  )
}

function App() {
  return (
    <ClarityChatApp
      api="/api/chat"
      header={<CustomHeader title="Support Chat" />}
      footer={
        <div className="p-2 text-center text-xs text-muted-foreground">
          Responses may not be accurate. Please verify.
        </div>
      }
      config={{
        ui: {
          theme: 'dark',
          layout: 'minimal',
          showTypingIndicator: true,
          animations: true,
        },
      }}
    />
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
          <CollapsibleSection title="Props" defaultOpen={true}>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Prop</th>
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
                      Configuration preset:{' '}
                      <code className="bg-muted px-1 rounded">simple</code>,{' '}
                      <code className="bg-muted px-1 rounded">pro</code>,{' '}
                      <code className="bg-muted px-1 rounded">memory</code>,{' '}
                      <code className="bg-muted px-1 rounded">rag</code>,{' '}
                      <code className="bg-muted px-1 rounded">tools</code>,{' '}
                      <code className="bg-muted px-1 rounded">enterprise</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">features</td>
                    <td className="p-3 font-mono text-sm">
                      ClarityFeatureFlags
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Feature flags:{' '}
                      <code className="bg-muted px-1 rounded">memory</code>,{' '}
                      <code className="bg-muted px-1 rounded">
                        tokenOptimization
                      </code>
                      , <code className="bg-muted px-1 rounded">tools</code>,{' '}
                      <code className="bg-muted px-1 rounded">rag</code>,{' '}
                      <code className="bg-muted px-1 rounded">safety</code>,{' '}
                      <code className="bg-muted px-1 rounded">observability</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">config</td>
                    <td className="p-3 font-mono text-sm">ClarityAppConfig</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Detailed configuration overrides. See Configuration
                      section below.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">initialMessages</td>
                    <td className="p-3 font-mono text-sm">Message[]</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Pre-populate the chat with initial messages.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">systemPrompt</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      System prompt for the AI model.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">model</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Model to use (e.g., gpt-4, claude-3).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">sources</td>
                    <td className="p-3 font-mono text-sm">RAGSource[]</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      RAG sources (shorthand for config.rag.sources).
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onEvent</td>
                    <td className="p-3 font-mono text-sm">
                      (event: ClarityEvent) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Event handler for instrumentation.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onError</td>
                    <td className="p-3 font-mono text-sm">
                      (error: Error) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Error handler callback.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onMessageSent</td>
                    <td className="p-3 font-mono text-sm">
                      (message: Message) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Called when user sends a message.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">onMessageReceived</td>
                    <td className="p-3 font-mono text-sm">
                      (message: Message) =&gt; void
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Called when AI response is received.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">header</td>
                    <td className="p-3 font-mono text-sm">ReactNode</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Custom header content.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">footer</td>
                    <td className="p-3 font-mono text-sm">ReactNode</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Custom footer content.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">className</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Additional CSS class.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Feature Flags">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Flag</th>
                    <th className="text-left p-3 font-semibold">Default</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">memory</td>
                    <td className="p-3 font-mono text-sm">false</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable conversation memory and context persistence.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">tokenOptimization</td>
                    <td className="p-3 font-mono text-sm">false</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable token counting, budget management, and cost
                      optimization.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">tools</td>
                    <td className="p-3 font-mono text-sm">false</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable tool/function calling with approval workflow.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">rag</td>
                    <td className="p-3 font-mono text-sm">false</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable RAG (Retrieval Augmented Generation) for
                      document-based responses.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">safety</td>
                    <td className="p-3 font-mono text-sm">false</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable PII redaction, prompt injection detection, and
                      content moderation.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">observability</td>
                    <td className="p-3 font-mono text-sm">false</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable metrics, tracing, and logging.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">streaming</td>
                    <td className="p-3 font-mono text-sm">true</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable streaming responses.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">errorRecovery</td>
                    <td className="p-3 font-mono text-sm">true</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Enable automatic retry with exponential backoff.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Presets">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">simple</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Streaming + error recovery + accessible UI. No advanced
                  features.
                </p>
                <pre className="text-xs bg-muted p-2 rounded">
                  {`features: { streaming: true, errorRecovery: true }`}
                </pre>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">pro</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Simple + token stats + basic optimization + basic safety.
                </p>
                <pre className="text-xs bg-muted p-2 rounded">
                  {`features: { ...simple, tokenOptimization: true, safety: true }`}
                </pre>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">memory</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Simple + memory with sliding-window defaults.
                </p>
                <pre className="text-xs bg-muted p-2 rounded">
                  {`features: { ...simple, memory: true }`}
                </pre>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">enterprise</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  All features enabled with production defaults.
                </p>
                <pre className="text-xs bg-muted p-2 rounded">
                  {`features: { memory: true, tokenOptimization: true, tools: true, rag: true, safety: true, observability: true, streaming: true, errorRecovery: true }`}
                </pre>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Event Types">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Event Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  <tr>
                    <td className="p-3 font-mono">message:sent</td>
                    <td className="p-3 text-muted-foreground">
                      User message was sent
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">message:received</td>
                    <td className="p-3 text-muted-foreground">
                      AI response was received
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">message:error</td>
                    <td className="p-3 text-muted-foreground">
                      Error during message processing
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">memory:injected</td>
                    <td className="p-3 text-muted-foreground">
                      Memory context was injected into prompt
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">memory:stored</td>
                    <td className="p-3 text-muted-foreground">
                      Message was stored in memory
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">token:counted</td>
                    <td className="p-3 text-muted-foreground">
                      Token count was computed
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">token:optimized</td>
                    <td className="p-3 text-muted-foreground">
                      Context was optimized for token budget
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">tool:called</td>
                    <td className="p-3 text-muted-foreground">
                      Tool was called by AI
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">tool:result</td>
                    <td className="p-3 text-muted-foreground">
                      Tool execution completed
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">rag:retrieved</td>
                    <td className="p-3 text-muted-foreground">
                      RAG context was retrieved
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">safety:checked</td>
                    <td className="p-3 text-muted-foreground">
                      Safety check was performed
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono">safety:blocked</td>
                    <td className="p-3 text-muted-foreground">
                      Content was blocked by safety
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        </div>
      </section>

      {/* Headless Usage */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Headless Usage</h2>
        <p className="text-muted-foreground mb-4">
          For complete UI control, use{' '}
          <code className="bg-muted px-1 rounded">useClarityChatApp</code> hook
          or{' '}
          <code className="bg-muted px-1 rounded">ClarityChatAppProvider</code>{' '}
          with{' '}
          <code className="bg-muted px-1 rounded">useClarityChatAppContext</code>
          .
        </p>
        <CollapsibleSection title="With Hook" defaultOpen={true}>
          <CodePlayground
            code={`import { useClarityChatApp } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChatApp({
    api: '/api/chat',
    features: { memory: true },
  })

  return (
    <div>
      {chat.messages.map((msg) => (
        <div key={msg.id} className={msg.role}>
          {msg.content}
        </div>
      ))}

      <input
        value={chat.input}
        onChange={chat.handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && chat.handleSubmit()}
      />

      {chat.isLoading && <span>Thinking...</span>}

      {/* Access rich metadata */}
      <div>
        Tokens: {chat.meta.token.inputTokens} / {chat.meta.token.budgetRemaining}
        Memory hits: {chat.meta.memory.hits}
      </div>
    </div>
  )
}`}
          />
        </CollapsibleSection>
      </section>

      {/* Related */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-clarity-chat-app"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChatApp</h3>
            <p className="text-sm text-muted-foreground">
              Headless hook for complete UI control.
            </p>
          </Link>
          <Link
            href="/reference/components/clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ClarityChat (Legacy)</h3>
            <p className="text-sm text-muted-foreground">
              Lower-level component for granular control.
            </p>
          </Link>
          <Link
            href="/guides/token-optimization"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Token Optimization Guide</h3>
            <p className="text-sm text-muted-foreground">
              Reduce API costs by up to 90%.
            </p>
          </Link>
          <Link
            href="/guides/memory"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Memory Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn about memory strategies and configuration.
            </p>
          </Link>
        </div>
      </section>

      {/* Feedback Widget */}
      <FeedbackWidget pageId="clarity-chat-app" className="mt-12" />
    </div>
  )
}
