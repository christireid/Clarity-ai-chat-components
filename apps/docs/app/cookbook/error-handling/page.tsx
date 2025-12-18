'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Error Handling Recipe | Clarity Chat Cookbook',
  description:
    'Learn how to handle errors gracefully in your chat application with retry logic and user-friendly messages.',
}

export default function ErrorHandlingPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Error Handling Recipe</h1>

      <p className="lead">
        Implement robust error handling in your chat application with retry
        logic, user-friendly messages, and graceful degradation.
      </p>

      <Callout type="warning" title="Errors Happen">
        <p>
          Network failures, API rate limits, and service outages are inevitable.
          Good error handling makes your app feel reliable even when things go
          wrong.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          ClarityChat includes built-in error handling:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  return (
    <ClarityChat
      api="/api/chat"
      onError={(error) => {
        // Custom error handling
        logger.error('Chat error:', error)
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Error Types</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Common error types you should handle:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">Network Errors</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'

function Chat() {
  return (
    <ClarityChat
      api="/api/chat"
      onError={(error) => {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          // Network error - show retry option
          toast.error('Network error. Check your connection and try again.')
        }
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Rate Limit Errors</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'

function Chat() {
  return (
    <ClarityChat
      api="/api/chat"
      onError={(error) => {
        if (error.message.includes('rate limit') || error.status === 429) {
          // Rate limit - show wait message
          toast.error('Too many requests. Please wait a moment and try again.')
        }
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          Authentication Errors
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'

function Chat() {
  return (
    <ClarityChat
      api="/api/chat"
      onError={(error) => {
        if (error.status === 401 || error.status === 403) {
          // Authentication error - redirect to login
          router.push('/login')
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With useClarityChat</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Access error state directly:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const { messages, append, error, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">
          {error.message || 'Something went wrong. Please try again.'}
        </p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        try {
          await append({ role: 'user', content })
        } catch (err) {
          logger.error('Failed to send message:', err)
          toast.error('Failed to send message. Please try again.')
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Retry Logic</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Implement automatic retry with exponential backoff:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'
import { useCallback } from 'react'

function Chat() {
  const { append, error } = useClarityChat({
    api: '/api/chat',
  })

  const retryWithBackoff = useCallback(async (
    fn: () => Promise<void>,
    maxRetries = 3
  ) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fn()
        return // Success
      } catch (err) {
        if (i === maxRetries - 1) throw err // Last attempt failed
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }, [])

  const handleSend = async (content: string) => {
    await retryWithBackoff(async () => {
      await append({ role: 'user', content })
    })
  }

  return <ChatWindow onSendMessage={handleSend} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Error Boundaries</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Use React Error Boundaries for catastrophic errors:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { ErrorBoundary } from '@clarity-chat/react'
import { ClarityChat } from '@clarity-chat/react'

function ChatApp() {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
    >
      <ClarityChat api="/api/chat" />
    </ErrorBoundary>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">
          User-Friendly Error Messages
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Transform technical errors into user-friendly messages:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase()

  if (message.includes('network') || message.includes('fetch')) {
    return 'Unable to connect. Please check your internet connection.'
  }

  if (message.includes('rate limit') || message.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.'
  }

  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.'
  }

  if (message.includes('unauthorized') || message.includes('401')) {
    return 'Please sign in to continue.'
  }

  if (message.includes('forbidden') || message.includes('403')) {
    return 'You don\'t have permission to perform this action.'
  }

  if (message.includes('not found') || message.includes('404')) {
    return 'The requested resource was not found.'
  }

  if (message.includes('server error') || message.includes('500')) {
    return 'Server error. Our team has been notified. Please try again later.'
  }

  // Default message
  return 'Something went wrong. Please try again.'
}

// Usage
<ClarityChat
  api="/api/chat"
  onError={(error) => {
    const userMessage = getErrorMessage(error)
    toast.error(userMessage)
  }}
/>`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Error Logging</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Log errors for debugging and monitoring:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'

function Chat() {
  return (
    <ClarityChat
      api="/api/chat"
      onError={(error) => {
        // Log to error tracking service
        errorTracking.captureException(error, {
          tags: { component: 'ClarityChat' },
          extra: {
            api: '/api/chat',
            timestamp: new Date().toISOString(),
          },
        })

        // Also log to console in development
        if (process.env.NODE_ENV === 'development') {
          logger.error('Chat error:', error)
        }

        // Show user-friendly message
        toast.error(getErrorMessage(error))
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Always handle errors</strong> - Never let errors go
            unhandled
          </li>
          <li>
            <strong>Show user-friendly messages</strong> - Don't expose
            technical details
          </li>
          <li>
            <strong>Provide retry options</strong> - Let users retry failed
            operations
          </li>
          <li>
            <strong>Log errors for debugging</strong> - Use error tracking
            services
          </li>
          <li>
            <strong>Handle different error types</strong> - Network, rate limit,
            auth, etc.
          </li>
          <li>
            <strong>Use error boundaries</strong> - Catch catastrophic errors
          </li>
          <li>
            <strong>Implement retry logic</strong> - Automatic retry with
            backoff
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/clarity-chat" className="docs-card">
            <h3>ClarityChat Component</h3>
            <p>Component with built-in error handling</p>
          </a>
          <a href="/reference/hooks/use-clarity-chat" className="docs-card">
            <h3>useClarityChat Hook</h3>
            <p>Hook with error state</p>
          </a>
          <a href="/guides/error-handling" className="docs-card">
            <h3>Error Handling Guide</h3>
            <p>Complete error handling guide</p>
          </a>
          <a href="/reference/components/error-boundary" className="docs-card">
            <h3>ErrorBoundary Component</h3>
            <p>React error boundary component</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Streaming Setup', href: '/cookbook/streaming-setup' }}
        next={{ title: 'Multi-Modal Chat', href: '/cookbook/multi-modal-chat' }}
      />
    </>
  )
}
