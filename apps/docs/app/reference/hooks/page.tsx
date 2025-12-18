'use client'

import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { ToastProvider } from '@clarity-chat/react'

const useMessageOperationsProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to manage',
  },
  {
    name: 'setMessages',
    type: 'React.Dispatch<React.SetStateAction<Message[]>>',
    required: true,
    description: 'State setter function for messages',
  },
  {
    name: 'options',
    type: 'MessageOperationsOptions',
    description: 'Optional configuration object',
  },
]

const useStreamingChatProps: Prop[] = [
  {
    name: 'apiEndpoint',
    type: 'string',
    required: true,
    description: 'API endpoint URL for streaming chat',
  },
  {
    name: 'options',
    type: 'StreamingChatOptions',
    description: 'Optional configuration including onError, onComplete, etc.',
  },
]

const useTokenTrackerProps: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to track tokens for',
  },
  {
    name: 'options',
    type: 'TokenTrackerOptions',
    description: 'Configuration including model, includeSystemPrompts, etc.',
  },
]

export default function HooksPage() {
  return (
    <ToastProvider>
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          Hooks API Reference
        </h1>
        
        <p className="text-xl text-text-secondary leading-relaxed">
          Complete API reference for all React hooks available in Clarity Chat. Hooks provide
          a clean, composable API for building chat interfaces.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand hook APIs and parameters',
          'Learn return values and methods',
          'Discover hook composition patterns',
          'See practical usage examples',
        ]}
      />

      {/* Hook Selector CTA */}
      <Link
        href="/reference/hooks/selector"
        className="block mb-8 p-6 border-2 border-dashed border-brand-300 dark:border-brand-700 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">🧭</div>
          <div>
            <h3 className="text-xl font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
              Not sure which hook to use?
            </h3>
            <p className="text-text-secondary">
              Try our interactive Hook Selector wizard to find the right hook for your use case.
            </p>
          </div>
          <svg className="w-6 h-6 ml-auto text-brand-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      <Callout type="info" className="mb-8">
        <p>
          <strong>Note:</strong> All hooks are client-side only and must be used within components
          marked with <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">'use client'</code>.
        </p>
      </Callout>

      {/* Architecture Diagram */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Architecture Overview</h2>
        <p className="text-text-secondary mb-6">
          Clarity Chat hooks are organized into three architecture layers, from high-level drop-in solutions to low-level utilities:
        </p>

        <div className="border rounded-xl p-6 bg-gradient-to-b from-bg-secondary/50 to-transparent">
          {/* Top-Level Layer */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-semibold">
                Top-Level
              </div>
              <span className="text-sm text-text-secondary">Drop-in Ready</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Link href="/reference/hooks/use-clarity-chat" className="px-3 py-2 bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg text-sm font-mono hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors">
                useClarityChat
              </Link>
              <Link href="/reference/hooks/use-clarity-object" className="px-3 py-2 bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-lg text-sm font-mono hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors">
                useClarityObject
              </Link>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-4">
            <svg className="w-6 h-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Mid-Level Layer */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold">
                Mid-Level
              </div>
              <span className="text-sm text-text-secondary">Composable Building Blocks</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Link href="/reference/hooks/use-chat-enhanced" className="px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-mono hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors">
                useChatEnhanced
              </Link>
              <Link href="/reference/hooks/use-clarity-chat-with-tools" className="px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-mono hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors">
                useClarityChatWithTools
              </Link>
              <Link href="/reference/hooks/use-memory-context" className="px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-mono hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors">
                useMemoryContext
              </Link>
              <Link href="/reference/hooks/use-streaming-sse" className="px-3 py-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm font-mono hover:bg-amber-100 dark:hover:bg-amber-900 transition-colors">
                useStreamingSSE
              </Link>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center my-4">
            <svg className="w-6 h-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* Low-Level Layer */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                Low-Level
              </div>
              <span className="text-sm text-text-secondary">Utilities & Primitives</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Link href="/reference/hooks/use-debounce" className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                useDebounce
              </Link>
              <Link href="/reference/hooks/use-local-storage" className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                useLocalStorage
              </Link>
              <Link href="/reference/hooks/use-indexed-db" className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                useIndexedDB
              </Link>
              <Link href="/reference/hooks/use-design-tokens" className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                useDesignTokens
              </Link>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-secondary mt-4">
          <strong>Tip:</strong> Start with top-level hooks for most use cases. Compose mid-level hooks for custom behavior. Use low-level utilities for fine-grained control.
        </p>
      </section>

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Core Hooks</h2>

        <div className="space-y-12">
          {/* useClarityChat */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">useClarityChat</h3>
            <p className="text-text-secondary mb-6">
              Primary hook for chat functionality with memory integration, streaming, and AI interactions. 
              <strong className="text-brand-500"> Recommended for all new projects.</strong>
            </p>
            <div className="mt-4">
              <Link
                href="/reference/hooks/use-clarity-chat"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
              >
                View Documentation →
              </Link>
            </div>
          </div>

          {/* useTokenOptimizationEnhanced */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">useTokenOptimizationEnhanced</h3>
            <p className="text-text-secondary mb-6">
              Comprehensive token optimization with TOON, prompt caching, semantic caching, and real-time cost tracking. 
              Save 50-90% on AI costs.
            </p>
            <div className="mt-4">
              <Link
                href="/reference/hooks/use-token-optimization-enhanced"
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-semibold transition-colors"
              >
                View Documentation →
              </Link>
            </div>
          </div>

          {/* useMessageOperations */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">useMessageOperations</h3>
            <p className="text-text-secondary mb-6">
              Manage message operations like edit, regenerate, delete, and undo/redo.
            </p>

            <EnhancedCodeBlock
              code={`import { useMessageOperations } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const {
    editMessage,
    regenerateMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations(messages, setMessages)

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      onEditMessage={editMessage}
      onRegenerateMessage={regenerateMessage}
      onDeleteMessage={deleteMessage}
    />
  )
}`}
              language="tsx"
              filename="ChatComponent.tsx"
              showLineNumbers
              showCopyButton
            />

            <PropsTable props={useMessageOperationsProps} title="Parameters" />

            <div className="mt-6">
              <h4 className="text-xl font-semibold mb-3">Returns</h4>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-bg-secondary border-b border-border">
                      <th className="text-left p-4 font-semibold text-text-primary">Name</th>
                      <th className="text-left p-4 font-semibold text-text-primary">Type</th>
                      <th className="text-left p-4 font-semibold text-text-primary">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="text-sm font-mono">editMessage</code></td>
                      <td className="p-4"><code className="text-sm font-mono text-brand-500">(id: string, content: string) {'=>'} void</code></td>
                      <td className="p-4 text-sm text-text-secondary">Edit a message by ID</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="text-sm font-mono">regenerateMessage</code></td>
                      <td className="p-4"><code className="text-sm font-mono text-brand-500">(id: string) {'=>'} void</code></td>
                      <td className="p-4 text-sm text-text-secondary">Regenerate a message</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="text-sm font-mono">deleteMessage</code></td>
                      <td className="p-4"><code className="text-sm font-mono text-brand-500">(id: string) {'=>'} void</code></td>
                      <td className="p-4 text-sm text-text-secondary">Delete a message</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="text-sm font-mono">undo</code></td>
                      <td className="p-4"><code className="text-sm font-mono text-brand-500">() {'=>'} void</code></td>
                      <td className="p-4 text-sm text-text-secondary">Undo last operation</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="text-sm font-mono">redo</code></td>
                      <td className="p-4"><code className="text-sm font-mono text-brand-500">() {'=>'} void</code></td>
                      <td className="p-4 text-sm text-text-secondary">Redo last undone operation</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4"><code className="text-sm font-mono">canUndo</code></td>
                      <td className="p-4"><code className="text-sm font-mono text-brand-500">boolean</code></td>
                      <td className="p-4 text-sm text-text-secondary">Whether undo is available</td>
                    </tr>
                    <tr>
                      <td className="p-4"><code className="text-sm font-mono">canRedo</code></td>
                      <td className="p-4"><code className="text-sm font-mono text-brand-500">boolean</code></td>
                      <td className="p-4 text-sm text-text-secondary">Whether redo is available</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* useStreamingChat */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">useStreamingChat</h3>
            <p className="text-text-secondary mb-6">
              Handle streaming chat responses with real-time updates.
            </p>

            <EnhancedCodeBlock
              code={`import { useStreamingChat } from '@clarity-chat/react'

function StreamingChat() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    stopStreaming,
  } = useStreamingChat({
    apiEndpoint: '/api/chat/stream',
    onError: (error) => {
      logger.error('Streaming error:', error)
    },
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`}
              language="tsx"
              filename="StreamingChat.tsx"
              showLineNumbers
              showCopyButton
            />

            <PropsTable props={useStreamingChatProps} title="Parameters" />
          </div>

          {/* useTokenTracker */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">useTokenTracker</h3>
            <p className="text-text-secondary mb-6">
              Track token usage and estimate costs for AI API calls.
            </p>

            <EnhancedCodeBlock
              code={`import { useTokenTracker, TokenCounter } from '@clarity-chat/react'

function ChatWithTracking() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const tokenStats = useTokenTracker(messages, {
    model: 'gpt-4',
    includeSystemPrompts: true,
  })

  return (
    <div>
      <TokenCounter
        inputTokens={tokenStats.inputTokens}
        outputTokens={tokenStats.outputTokens}
        totalTokens={tokenStats.totalTokens}
        estimatedCost={tokenStats.estimatedCost}
      />
      <ChatWindow
        messages={messages}
        onSendMessage={handleSend}
      />
    </div>
  )
}`}
              language="tsx"
              filename="ChatWithTracking.tsx"
              showLineNumbers
              showCopyButton
            />

            <PropsTable props={useTokenTrackerProps} title="Parameters" />
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Utility Hooks</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h4 className="font-semibold text-text-primary mb-2">useLocalStorage</h4>
            <p className="text-sm text-text-secondary mb-4">
              Persist state to localStorage with automatic serialization.
            </p>
            <EnhancedCodeBlock
              code={`const [chatId, setChatId] = useLocalStorage('chatId', 'default')`}
              language="tsx"
              showCopyButton
            />
          </div>

          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h4 className="font-semibold text-text-primary mb-2">useIndexedDB</h4>
            <p className="text-sm text-text-secondary mb-4">
              Store large data in IndexedDB for offline support.
            </p>
            <EnhancedCodeBlock
              code={`const { data, setData, loading } = useIndexedDB('messages')`}
              language="tsx"
              showCopyButton
            />
          </div>

          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h4 className="font-semibold text-text-primary mb-2">useAutoScroll</h4>
            <p className="text-sm text-text-secondary mb-4">
              Automatically scroll to bottom when new messages arrive.
            </p>
            <EnhancedCodeBlock
              code={`const scrollRef = useAutoScroll(messages, { behavior: 'smooth' })`}
              language="tsx"
              showCopyButton
            />
          </div>

          <div className="p-6 rounded-lg bg-bg-secondary border border-border">
            <h4 className="font-semibold text-text-primary mb-2">useErrorRecovery</h4>
            <p className="text-sm text-text-secondary mb-4">
              Handle errors with automatic retry and recovery.
            </p>
            <EnhancedCodeBlock
              code={`const { retry, isRetrying } = useErrorRecovery({ maxRetries: 3 })`}
              language="tsx"
              showCopyButton
            />
          </div>
        </div>
      </section>

      <Callout type="tip">
        <p>
          <strong>Learn more:</strong> Check out the <a href="/learn/concepts/hooks" className="text-brand-500 hover:underline">Hooks Concept Guide</a> for
          detailed explanations and composition patterns.
        </p>
      </Callout>
    </ToastProvider>
  )
}
