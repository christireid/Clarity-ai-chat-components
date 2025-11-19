import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Hooks API Reference - Clarity Chat',
  description: 'Complete API reference for all React hooks in Clarity Chat',
}

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
    <>
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

      <Callout type="info" className="mb-8">
        <p>
          <strong>Note:</strong> All hooks are client-side only and must be used within components
          marked with <code className="px-1.5 py-0.5 bg-bg-secondary rounded text-sm">'use client'</code>.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Core Hooks</h2>

        <div className="space-y-12">
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
      console.error('Streaming error:', error)
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
    </>
  )
}
