import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { Pagination } from '@/components/Navigation/Pagination'

export const metadata: Metadata = {
  title: 'Common Patterns | Clarity Chat',
  description:
    'Essential patterns for building production AI chat interfaces. Hook composition, provider setup, error handling, and state management.',
}

export default function CommonPatternsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Common Patterns</h1>

      <p className="lead">
        Essential patterns for building production-ready AI chat interfaces.
        These patterns represent best practices from real-world applications.
      </p>

      <section className="my-12">
        <h2 id="quick-reference">Quick Reference</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <a
            href="#provider-composition"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Provider Composition</h3>
            <p className="text-sm text-muted-foreground">
              Properly nesting context providers
            </p>
          </a>
          <a
            href="#hook-composition"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Hook Composition</h3>
            <p className="text-sm text-muted-foreground">
              Combining hooks for complex features
            </p>
          </a>
          <a
            href="#error-boundaries"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Error Boundaries</h3>
            <p className="text-sm text-muted-foreground">
              Graceful error handling patterns
            </p>
          </a>
          <a
            href="#streaming-patterns"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Streaming Patterns</h3>
            <p className="text-sm text-muted-foreground">
              Real-time streaming best practices
            </p>
          </a>
          <a
            href="#state-persistence"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">State Persistence</h3>
            <p className="text-sm text-muted-foreground">
              Persisting chat state across sessions
            </p>
          </a>
          <a
            href="#optimistic-updates"
            className="p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold">Optimistic Updates</h3>
            <p className="text-sm text-muted-foreground">
              Instant UI feedback patterns
            </p>
          </a>
        </div>
      </section>

      <section className="my-12">
        <h2 id="provider-composition">Provider Composition</h2>

        <p>
          The recommended order for nesting providers ensures proper
          initialization and access to context values:
        </p>

        <EnhancedCodeBlock
          code={`import {
  ThemeProvider,
  MemoryProvider,
  ErrorBoundary,
  ToastProvider,
} from '@clarity-chat/react'

function App() {
  return (
    // 1. Theme first (UI needs styles)
    <ThemeProvider theme="default">
      {/* 2. Error boundary catches all errors */}
      <ErrorBoundary fallback={<ErrorFallback />}>
        {/* 3. Toast for notifications */}
        <ToastProvider>
          {/* 4. Memory for context management */}
          <MemoryProvider config={{ maxTokens: 8000 }}>
            {/* Your app components */}
            <ChatInterface />
          </MemoryProvider>
        </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

function ErrorFallback() {
  return (
    <div className="p-4 text-center">
      <h2>Something went wrong</h2>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="tip">
          <p>
            <strong>Memory order matters:</strong> MemoryProvider should be
            inside ErrorBoundary so memory errors are caught, but outside your
            chat components so they can access memory context.
          </p>
        </Callout>
      </section>

      <section className="my-12">
        <h2 id="hook-composition">Hook Composition</h2>

        <p>
          Combine multiple hooks to build feature-rich chat experiences. Each
          hook handles one concern:
        </p>

        <EnhancedCodeBlock
          code={`import {
  useClarityChat,
  useTokenTracker,
  useMemoryContext,
  useTheme,
} from '@clarity-chat/react'

function useEnhancedChat(options: { api: string }) {
  // Core chat functionality
  const chat = useClarityChat({
    api: options.api,
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  // Token tracking for cost management
  const tokens = useTokenTracker({
    maxTokens: 4000,
    onLimitReached: () => {
      // Automatically summarize when approaching limit
      chat.append({
        role: 'system',
        content: 'Please summarize the conversation so far.',
      })
    },
  })

  // Memory for context-aware responses
  const memory = useMemoryContext()

  // Theme for consistent styling
  const { theme } = useTheme()

  // Combine into unified API
  return {
    // Chat actions
    messages: chat.messages,
    append: chat.append,
    isLoading: chat.isLoading,
    error: chat.error,
    stop: chat.stop,

    // Token info
    tokenCount: tokens.count,
    tokenLimit: tokens.limit,
    isNearLimit: tokens.count > tokens.limit * 0.8,

    // Memory actions
    addMemory: memory.addMemory,
    queryMemory: memory.query,

    // Theme
    currentTheme: theme,
  }
}

// Usage
function Chat() {
  const {
    messages,
    append,
    isLoading,
    tokenCount,
    isNearLimit,
  } = useEnhancedChat({ api: '/api/chat' })

  return (
    <div>
      {isNearLimit && (
        <div className="text-amber-500">
          Approaching token limit ({tokenCount})
        </div>
      )}
      {/* Chat UI */}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="error-boundaries">Error Boundaries</h2>

        <p>
          Use error boundaries strategically to isolate failures and provide
          graceful degradation:
        </p>

        <EnhancedCodeBlock
          code={`import { ErrorBoundary, useToast } from '@clarity-chat/react'

// Granular error boundaries for different failure modes
function ChatApp() {
  const { toast } = useToast()

  return (
    <div className="flex h-screen">
      {/* Sidebar can fail independently */}
      <ErrorBoundary
        fallback={<SidebarFallback />}
        onError={(error) => {
          toast({
            title: 'Sidebar error',
            description: 'History unavailable',
            variant: 'warning',
          })
        }}
      >
        <ChatSidebar />
      </ErrorBoundary>

      {/* Main chat area */}
      <ErrorBoundary
        fallback={<ChatFallback />}
        onError={(error) => {
          // Log to monitoring
          logError('chat_error', error)
        }}
      >
        <ChatMain />
      </ErrorBoundary>
    </div>
  )
}

// Fallback with retry
function ChatFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="mb-4">Chat temporarily unavailable</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Retry
      </button>
    </div>
  )
}

// Minimal fallback keeps app usable
function SidebarFallback() {
  return (
    <div className="w-64 bg-muted p-4">
      <p className="text-muted-foreground">
        Chat history unavailable
      </p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="streaming-patterns">Streaming Patterns</h2>

        <p>
          Handle streaming responses with proper loading states and
          cancellation:
        </p>

        <EnhancedCodeBlock
          code={`import { useClarityChat, StreamingMessage } from '@clarity-chat/react'
import { useRef, useCallback } from 'react'

function StreamingChat() {
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    messages,
    append,
    isLoading,
    stop,
  } = useClarityChat({
    api: '/api/chat',
    onResponse: (response) => {
      // Store abort controller for cancellation
      abortControllerRef.current = new AbortController()
    },
    onFinish: () => {
      // Clean up
      abortControllerRef.current = null
    },
    onError: (error) => {
      if (error.name === 'AbortError') {
        // User cancelled - not an error
        return
      }
      console.error('Stream error:', error)
    },
  })

  const handleCancel = useCallback(() => {
    stop()
    abortControllerRef.current?.abort()
  }, [stop])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'assistant' && isLoading ? (
              <StreamingMessage
                content={msg.content}
                isStreaming={true}
              />
            ) : (
              <div>{msg.content}</div>
            )}
          </div>
        ))}
      </div>

      {isLoading && (
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-destructive text-white rounded"
        >
          Stop generating
        </button>
      )}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="info">
          <p>
            <strong>SSE vs WebSocket:</strong> Use SSE (default) for most cases.
            Use WebSocket only when you need bidirectional communication or
            extremely low latency.
          </p>
        </Callout>
      </section>

      <section className="my-12">
        <h2 id="state-persistence">State Persistence</h2>

        <p>
          Persist chat state across sessions with localStorage or IndexedDB:
        </p>

        <EnhancedCodeBlock
          code={`import { useClarityChat, useIndexedDB } from '@clarity-chat/react'
import { useEffect, useCallback } from 'react'

function PersistentChat() {
  const db = useIndexedDB('clarity-chat')

  const {
    messages,
    setMessages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    id: 'main-chat', // Stable ID for persistence
    onFinish: (message) => {
      // Persist after each response
      saveMessages(messages)
    },
  })

  // Load saved messages on mount
  useEffect(() => {
    async function loadMessages() {
      try {
        const saved = await db.get('messages', 'main-chat')
        if (saved?.messages) {
          setMessages(saved.messages)
        }
      } catch (error) {
        console.error('Failed to load messages:', error)
      }
    }
    loadMessages()
  }, [db, setMessages])

  // Save messages to IndexedDB
  const saveMessages = useCallback(async (msgs: Message[]) => {
    try {
      await db.put('messages', {
        id: 'main-chat',
        messages: msgs,
        updatedAt: Date.now(),
      })
    } catch (error) {
      console.error('Failed to save messages:', error)
    }
  }, [db])

  // Clear conversation
  const clearChat = useCallback(async () => {
    await db.delete('messages', 'main-chat')
    setMessages([])
  }, [db, setMessages])

  return (
    <div>
      <button onClick={clearChat}>Clear History</button>
      {/* Chat UI */}
    </div>
  )
}

// Simpler: localStorage for small conversations
function SimplePersistence() {
  const { messages, setMessages } = useClarityChat({
    api: '/api/chat',
    initialMessages: () => {
      // Load from localStorage on init
      const saved = localStorage.getItem('chat-messages')
      return saved ? JSON.parse(saved) : []
    },
    onFinish: () => {
      // Save after each response
      localStorage.setItem('chat-messages', JSON.stringify(messages))
    },
  })

  return <ChatUI messages={messages} />
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="optimistic-updates">Optimistic Updates</h2>

        <p>Show user messages immediately for better perceived performance:</p>

        <EnhancedCodeBlock
          code={`import { useClarityChat, type Message } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

function OptimisticChat() {
  const [optimisticMessage, setOptimisticMessage] = useState<Message | null>(null)

  const {
    messages,
    append,
    isLoading,
    error,
  } = useClarityChat({
    api: '/api/chat',
    onResponse: () => {
      // Clear optimistic message when response starts
      setOptimisticMessage(null)
    },
    onError: () => {
      // Keep optimistic message visible on error for retry
    },
  })

  const handleSend = useCallback(async (content: string) => {
    // Show message immediately
    const tempMessage: Message = {
      id: \`temp-\${Date.now()}\`,
      role: 'user',
      content,
      status: 'sending',
      createdAt: new Date(),
    }
    setOptimisticMessage(tempMessage)

    try {
      await append({ role: 'user', content })
    } catch (error) {
      // Update optimistic message to show error
      setOptimisticMessage({
        ...tempMessage,
        status: 'error',
      })
    }
  }, [append])

  // Combine real and optimistic messages
  const displayMessages = optimisticMessage
    ? [...messages, optimisticMessage]
    : messages

  return (
    <div>
      {displayMessages.map((msg) => (
        <div
          key={msg.id}
          className={msg.status === 'sending' ? 'opacity-70' : ''}
        >
          {msg.content}
          {msg.status === 'error' && (
            <button onClick={() => handleSend(msg.content)}>
              Retry
            </button>
          )}
        </div>
      ))}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="conditional-rendering">Conditional Feature Loading</h2>

        <p>Load features only when needed to reduce bundle size:</p>

        <EnhancedCodeBlock
          code={`import { lazy, Suspense } from 'react'
import { ClarityChat, FeatureLoader } from '@clarity-chat/react'

// Lazy load heavy features
const VoiceInput = lazy(() => import('@clarity-chat/react/voice'))
const FileUpload = lazy(() => import('@clarity-chat/react/file-upload'))

function AdaptiveChat({ enableVoice, enableFiles }) {
  return (
    <div>
      <ClarityChat
        api="/api/chat"
        renderInput={({ onSend }) => (
          <div className="flex gap-2">
            <input placeholder="Type a message..." />

            {enableVoice && (
              <Suspense fallback={<button disabled>...</button>}>
                <VoiceInput onTranscript={(text) => onSend(text)} />
              </Suspense>
            )}

            {enableFiles && (
              <Suspense fallback={<button disabled>...</button>}>
                <FileUpload onUpload={(files) => console.log(files)} />
              </Suspense>
            )}
          </div>
        )}
      />
    </div>
  )
}

// Or use FeatureLoader for automatic lazy loading
function AutoLoadingChat() {
  const loader = new FeatureLoader()

  return (
    <ClarityChat
      api="/api/chat"
      featureLoader={loader}
      features={['voice', 'file-upload', 'code-highlighting']}
    />
  )
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="testing-patterns">Testing Patterns</h2>

        <p>Test chat components with mock providers and utilities:</p>

        <EnhancedCodeBlock
          code={`import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  MockChatProvider,
  createMockMessages,
  mockStreamingResponse,
} from '@clarity-chat/react/test-utils'
import { ChatInterface } from './ChatInterface'

describe('ChatInterface', () => {
  it('sends messages and displays responses', async () => {
    const mockMessages = createMockMessages([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ])

    render(
      <MockChatProvider initialMessages={mockMessages}>
        <ChatInterface />
      </MockChatProvider>
    )

    // Verify messages displayed
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()

    // Type and send new message
    const input = screen.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'How are you?')
    await userEvent.click(screen.getByRole('button', { name: /send/i }))

    // Verify message was added
    await waitFor(() => {
      expect(screen.getByText('How are you?')).toBeInTheDocument()
    })
  })

  it('handles streaming responses', async () => {
    const streamResponse = mockStreamingResponse('This is a streamed response')

    render(
      <MockChatProvider streamResponse={streamResponse}>
        <ChatInterface />
      </MockChatProvider>
    )

    // Trigger a message
    const input = screen.getByPlaceholderText(/type a message/i)
    await userEvent.type(input, 'Test{enter}')

    // Verify streaming indicator appears
    expect(await screen.findByTestId('streaming-indicator')).toBeInTheDocument()

    // Wait for stream to complete
    await waitFor(() => {
      expect(screen.getByText(/streamed response/)).toBeInTheDocument()
    })
  })
})`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="related">Related</h2>

        <ul>
          <li>
            <Link href="/reference/hooks/selector">Hook Selector</Link> - Find
            the right hook for your use case
          </li>
          <li>
            <Link href="/guides/error-handling">Error Handling Guide</Link> -
            Comprehensive error handling
          </li>
          <li>
            <Link href="/guides/streaming">Streaming Guide</Link> - SSE vs
            WebSocket deep dive
          </li>
          <li>
            <Link href="/learn/guides/testing">Testing Guide</Link> - Test
            utilities and patterns
          </li>
          <li>
            <Link href="/cookbook/backend-integration-patterns">
              Backend Integration
            </Link>{' '}
            - Server-side patterns
          </li>
        </ul>
      </section>

      <Pagination
        previous={{
          title: 'Testing',
          href: '/learn/guides/testing',
        }}
        next={{
          title: 'FAQ',
          href: '/learn/faq',
        }}
      />
    </>
  )
}
