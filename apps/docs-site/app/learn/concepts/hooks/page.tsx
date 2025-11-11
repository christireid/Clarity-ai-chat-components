import { Metadata } from 'next'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'
import { TryItOut } from '@/components/Enhanced/TryItOut'

export const metadata: Metadata = {
  title: 'Hooks Overview - Learn Clarity Chat',
  description:
    'Understand the React hooks available in Clarity Chat and how to use them effectively.',
}

export default function HooksConceptPage() {
  return (
    <div className="docs-content">
      <div className="mb-8">
        <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
          Concept
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
          React Hooks
        </h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Clarity Chat provides 30+ React hooks to handle chat functionality, state management,
          streaming, and more. Hooks provide a clean, composable API for building chat interfaces.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Understand the hook architecture and patterns',
          'Learn core hooks for chat functionality',
          'Discover hooks for advanced features',
          'Explore hook composition patterns',
        ]}
      />

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Core Hooks</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">useMessageOperations</h3>
            <p className="text-text-secondary mb-4">
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
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">useStreamingChat</h3>
            <p className="text-text-secondary mb-4">
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
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">useTokenTracker</h3>
            <p className="text-text-secondary mb-4">
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

      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6">Hook Composition</h2>
        
        <p className="text-text-secondary mb-6">
          Hooks are designed to be composed together. Here's an example combining multiple hooks:
        </p>

        <EnhancedCodeBlock
          code={`import {
  useMessageOperations,
  useStreamingChat,
  useTokenTracker,
  useLocalStorage,
  useAutoScroll,
} from '@clarity-chat/react'

function AdvancedChat() {
  // Persist chat ID
  const [chatId, setChatId] = useLocalStorage('chatId', 'default')
  
  // Handle streaming
  const {
    messages,
    isLoading,
    sendMessage,
  } = useStreamingChat({
    apiEndpoint: '/api/chat/stream',
    chatId,
  })
  
  // Message operations
  const {
    editMessage,
    regenerateMessage,
    deleteMessage,
  } = useMessageOperations(messages, setMessages)
  
  // Token tracking
  const tokenStats = useTokenTracker(messages)
  
  // Auto-scroll
  const scrollRef = useAutoScroll(messages)
  
  return (
    <div ref={scrollRef}>
      <TokenCounter {...tokenStats} />
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
        onEditMessage={editMessage}
        onRegenerateMessage={regenerateMessage}
        onDeleteMessage={deleteMessage}
        isLoading={isLoading}
      />
    </div>
  )
}`}
          language="tsx"
          filename="AdvancedChat.tsx"
          showLineNumbers
          showCopyButton
        />

        <TryItOut title="Try composing hooks">
          <p className="text-text-secondary mb-4">
            Experiment with combining different hooks. Each hook handles a specific concern,
            making your code more maintainable and testable.
          </p>
        </TryItOut>
      </section>

      <Callout type="info">
        <p>
          <strong>Tip:</strong> Check out the <a href="/reference/hooks" className="text-brand-500 hover:underline">Hooks API Reference</a> for
          complete documentation of all available hooks.
        </p>
      </Callout>
    </div>
  )
}
