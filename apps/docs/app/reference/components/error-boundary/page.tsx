import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Error Boundary Components',
  description: 'React error boundaries for graceful error handling, fallback UI, and error recovery in chat applications.',
}

const errorBoundaryProps: Prop[] = [
  {
    name: 'fallback',
    type: 'React.ComponentType<ErrorFallbackProps> | React.ReactNode',
    description: 'Fallback UI to render when an error occurs.',
  },
  {
    name: 'onError',
    type: '(error: Error, errorInfo: React.ErrorInfo) => void',
    description: 'Callback fired when an error is caught.',
  },
  {
    name: 'onReset',
    type: '() => void',
    description: 'Callback fired when error boundary is reset.',
  },
  {
    name: 'resetKeys',
    type: 'Array<unknown>',
    description: 'Keys that trigger a reset when changed.',
  },
  {
    name: 'showErrorDetails',
    type: 'boolean',
    default: 'false',
    description: 'Show detailed error information in development.',
  },
]

const errorBoundaryFunctionsProps: Prop[] = [
  {
    name: 'ContentErrorBoundary',
    type: 'React.ComponentType<ErrorBoundaryProps>',
    description: 'Error boundary optimized for content rendering failures.',
  },
  {
    name: 'InlineContentErrorBoundary',
    type: 'React.ComponentType<ErrorBoundaryProps>',
    description: 'Compact error boundary for inline content.',
  },
  {
    name: 'MediaErrorBoundary',
    type: 'React.ComponentType<ErrorBoundaryProps>',
    description: 'Error boundary for media loading failures.',
  },
  {
    name: 'AsyncContentErrorBoundary',
    type: 'React.ComponentType<ErrorBoundaryProps>',
    description: 'Error boundary for async content loading.',
  },
  {
    name: 'BaseErrorBoundary',
    type: 'React.ComponentType<ErrorBoundaryProps>',
    description: 'Basic error boundary with minimal features.',
  },
  {
    name: 'ContentErrorFallback',
    type: 'React.ComponentType<ErrorFallbackProps>',
    description: 'Default fallback component for content errors.',
  },
  {
    name: 'InlineErrorFallback',
    type: 'React.ComponentType<ErrorFallbackProps>',
    description: 'Compact fallback for inline errors.',
  },
  {
    name: 'EmptyStateErrorFallback',
    type: 'React.ComponentType<ErrorFallbackProps>',
    description: 'Fallback that shows an empty state.',
  },
  {
    name: 'ResilientErrorBoundary',
    type: 'React.ComponentType<ErrorBoundaryProps>',
    description: 'Error boundary with automatic retry capabilities.',
  },
  {
    name: 'ReportableErrorBoundary',
    type: 'React.ComponentType<ErrorBoundaryProps>',
    description: 'Error boundary that reports errors to monitoring services.',
  },
  {
    name: 'withErrorBoundary',
    type: '(Component: React.ComponentType, options?: ErrorBoundaryOptions) => React.ComponentType',
    description: 'Higher-order component for adding error boundaries.',
  },
  {
    name: 'useErrorHandler',
    type: '(options?: ErrorHandlerOptions) => ErrorHandlerHook',
    description: 'Hook for handling errors within components.',
  },
  {
    name: 'useAsyncErrorHandler',
    type: '(options?: AsyncErrorHandlerOptions) => AsyncErrorHandlerHook',
    description: 'Hook for handling async operation errors.',
  },
  {
    name: 'errorReporter',
    type: 'ErrorReporter',
    description: 'Global error reporting utility.',
  },
]

export default function ErrorBoundaryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mb-4">
          <span>🛡️ Error Boundaries</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Error Boundary Components</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Specialized React error boundaries for graceful error handling, recovery mechanisms,
          and user-friendly fallback UI in AI chat applications.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Error Handling •{' '}
          <strong>Domain:</strong> Resilience •{' '}
          <strong>Impact:</strong> User Experience
        </p>
      </div>

      <Callout type="info" title="Why Error Boundaries Matter in AI Chat">
        <p className="mb-2">
          AI chat interfaces are complex systems with streaming data, dynamic content rendering,
          and real-time updates. A single component error shouldn't crash the entire chat experience.
          Error boundaries provide resilience by isolating failures and maintaining usability.
        </p>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Error Boundary Usage</h2>
        <CodePlayground
          code={`import {
  ContentErrorBoundary,
  ContentErrorFallback
} from '@clarity-chat/react'

function ChatApp() {
  return (
    <ContentErrorBoundary
      fallback={<ContentErrorFallback />}
      onError={(error, errorInfo) => {
        console.error('Chat error:', error, errorInfo)
        // Send to error monitoring service
        errorReporter.report(error, {
          component: 'ChatApp',
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }}
    >
      <ClarityChat api="/api/chat" />
    </ContentErrorBoundary>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Basic error boundary that catches rendering errors and displays a user-friendly fallback,
          while logging detailed error information for debugging.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Specialized Error Boundaries</h2>
        <CodePlayground
          code={`import {
  MediaErrorBoundary,
  AsyncContentErrorBoundary,
  InlineContentErrorBoundary,
  ResilientErrorBoundary
} from '@clarity-chat/react'

function AdvancedChatApp() {
  return (
    <div className="chat-app">
      {/* Main chat with resilience */}
      <ResilientErrorBoundary
        maxRetries={3}
        retryDelay={1000}
        onRetry={(attempt, error) => {
          console.log(\`Retrying chat load (attempt \${attempt})\`, error)
        }}
      >
        <ClarityChat api="/api/chat" />
      </ResilientErrorBoundary>

      {/* Message list with content error handling */}
      <ContentErrorBoundary
        fallback={
          <div className="error-state">
            <h3>Unable to load messages</h3>
            <p>Please refresh to try again</p>
            <button onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        }
      >
        <MessageList messages={messages} />
      </ContentErrorBoundary>

      {/* Inline errors for small components */}
      <div className="chat-controls">
        <InlineContentErrorBoundary>
          <TypingIndicator />
        </InlineContentErrorBoundary>

        <InlineContentErrorBoundary>
          <ConnectionStatus />
        </InlineContentErrorBoundary>
      </div>

      {/* Media content with specialized handling */}
      <MediaErrorBoundary
        fallback={({ error }) => (
          <div className="media-error">
            <p>Media failed to load: {error.message}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}
      >
        <MessageMedia content={messageContent} />
      </MediaErrorBoundary>

      {/* Async operations */}
      <AsyncContentErrorBoundary
        fallback={
          <div className="loading-error">
            <p>Failed to load chat data</p>
            <p>Check your connection and try again</p>
          </div>
        }
        onError={(error) => {
          // Log network errors specifically
          if (error.message.includes('fetch')) {
            analytics.track('network_error', { error: error.message })
          }
        }}
      >
        <ChatDataLoader conversationId={conversationId} />
      </AsyncContentErrorBoundary>
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Specialized error boundaries for different failure scenarios: media loading,
          async operations, inline components, and resilient recovery with automatic retries.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Error Recovery & Reset</h2>
        <CodePlayground
          code={`import {
  ContentErrorBoundary,
  useErrorHandler
} from '@clarity-chat/react'

function RecoverableChatApp() {
  const [conversationId, setConversationId] = useState('default')
  const { resetError, lastError } = useErrorHandler()

  const handleNewConversation = () => {
    // Generate new conversation ID - this will reset the error boundary
    setConversationId(\`conversation-\${Date.now()}\`)
    resetError()
  }

  const handleRetry = () => {
    // Force a reset of the error boundary
    resetError()
    // Optionally reload data or retry the failed operation
    loadChatData()
  }

  return (
    <ContentErrorBoundary
      fallback={({ error, resetError: boundaryReset }) => (
        <div className="error-recovery-panel">
          <h3>Something went wrong</h3>
          <p>{error.message}</p>

          <div className="recovery-options">
            <button
              onClick={() => {
                boundaryReset()
                handleRetry()
              }}
              className="retry-button"
            >
              Try Again
            </button>

            <button
              onClick={handleNewConversation}
              className="new-conversation-button"
            >
              Start New Conversation
            </button>

            <button
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              Reload Page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="error-details">
              <summary>Error Details (Dev Only)</summary>
              <pre>{error.stack}</pre>
            </details>
          )}
        </div>
      )}
      resetKeys={[conversationId]} // Reset when conversation changes
      onError={(error) => {
        // Log to error monitoring
        errorReporter.report(error, {
          conversationId,
          userId: currentUser?.id,
          timestamp: Date.now()
        })
      }}
    >
      <ChatInterface conversationId={conversationId} />
    </ContentErrorBoundary>
  )
}

// Component that uses error handler hook
function ChatInterface({ conversationId }) {
  const { handleError, clearError } = useErrorHandler()

  const sendMessage = async (message) => {
    try {
      clearError() // Clear any previous errors
      await api.sendMessage(conversationId, message)
    } catch (error) {
      handleError(error, {
        operation: 'sendMessage',
        conversationId,
        messageLength: message.length
      })
      throw error // Re-throw for boundary to catch
    }
  }

  return (
    <div>
      <MessageInput onSend={sendMessage} />
      <MessageList conversationId={conversationId} />
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive error recovery with multiple reset strategies, development debugging,
          and graceful degradation options for different error scenarios.
        </p>

        <Callout type="tip" title="Error Recovery Strategies">
          <ul className="list-disc list-inside">
            <li><strong>Automatic Reset:</strong> Use resetKeys for state-based recovery</li>
            <li><strong>User-Initiated:</strong> Provide manual retry options</li>
            <li><strong>Context-Aware:</strong> Different recovery options based on error type</li>
            <li><strong>Development Support:</strong> Detailed error info in dev mode</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Higher-Order Components & Hooks</h2>
        <CodePlayground
          code={`import {
  withErrorBoundary,
  useAsyncErrorHandler,
  errorReporter
} from '@clarity-chat/react'

// Higher-order component for error boundaries
const ChatWithErrorBoundary = withErrorBoundary(ChatComponent, {
  fallback: ({ error, retry }) => (
    <div className="chat-error">
      <h3>Chat temporarily unavailable</h3>
      <p>{error.message}</p>
      <button onClick={retry}>Try Again</button>
    </div>
  ),
  onError: (error) => {
    errorReporter.report(error, { component: 'ChatComponent' })
  }
})

// Hook for async error handling
function AsyncDataLoader() {
  const {
    execute,
    isLoading,
    error,
    retry,
    reset
  } = useAsyncErrorHandler({
    onError: (error, context) => {
      console.error('Async operation failed:', error, context)
      // Could show toast notification
    },
    retryOptions: {
      maxAttempts: 3,
      backoffMs: 1000
    }
  })

  const loadData = () => {
    execute(async () => {
      const response = await fetch('/api/chat/data')
      if (!response.ok) {
        throw new Error('Failed to load chat data')
      }
      return response.json()
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return <div>Loading chat data...</div>
  }

  if (error) {
    return (
      <div className="error-state">
        <p>Failed to load data: {error.message}</p>
        <button onClick={retry}>Retry</button>
        <button onClick={reset}>Reset</button>
      </div>
    )
  }

  return <ChatDataDisplay data={data} />
}

// Global error reporting configuration
errorReporter.configure({
  destination: '/api/errors',
  batchSize: 10,
  flushInterval: 30000,
  includeContext: true,
  filters: {
    ignoreErrors: [/^ResizeObserver loop limit exceeded$/],
    ignoreUrls: ['/favicon.ico']
  },
  transformers: {
    // Anonymize sensitive data
    transformError: (error) => ({
      ...error,
      message: error.message.replace(/API_KEY_[^\\s]+/g, '[REDACTED]')
    })
  }
})

// Usage throughout app
function App() {
  return (
    <ErrorProvider>
      <ChatWithErrorBoundary />
      <AsyncDataLoader />
    </ErrorProvider>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Advanced error handling patterns with higher-order components, async operation hooks,
          and global error reporting configuration for comprehensive application resilience.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Error Monitoring Integration</h2>
        <CodePlayground
          code={`import {
  ReportableErrorBoundary,
  errorReporter
} from '@clarity-chat/react'

function MonitoredChatApp() {
  const [errorMetrics, setErrorMetrics] = useState({
    totalErrors: 0,
    recoveredErrors: 0,
    criticalErrors: 0
  })

  // Configure error reporting
  useEffect(() => {
    errorReporter.configure({
      destination: '/api/error-reports',
      apiKey: process.env.ERROR_REPORTING_API_KEY,
      environment: process.env.NODE_ENV,
      release: process.env.RELEASE_VERSION,
      user: {
        id: currentUser?.id,
        email: currentUser?.email
      },
      tags: {
        component: 'chat',
        version: '1.0.0'
      }
    })

    // Subscribe to error events for local metrics
    const unsubscribe = errorReporter.subscribe((errorEvent) => {
      setErrorMetrics(prev => ({
        ...prev,
        totalErrors: prev.totalErrors + 1,
        recoveredErrors: errorEvent.recovered ? prev.recoveredErrors + 1 : prev.recoveredErrors,
        criticalErrors: errorEvent.severity === 'critical' ? prev.criticalErrors + 1 : prev.criticalErrors
      }))
    })

    return unsubscribe
  }, [])

  return (
    <div>
      {/* Error metrics dashboard (development/staging only) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="error-dashboard fixed top-4 right-4 bg-black text-white p-3 rounded text-xs">
          <div>Errors: {errorMetrics.totalErrors}</div>
          <div>Recovered: {errorMetrics.recoveredErrors}</div>
          <div>Critical: {errorMetrics.criticalErrors}</div>
        </div>
      )}

      <ReportableErrorBoundary
        reportErrors={true}
        includeContext={true}
        severityLevels={{
          ReferenceError: 'high',
          TypeError: 'medium',
          default: 'low'
        }}
        onError={(error, context) => {
          // Additional local error handling
          console.error('Reported error:', error, context)

          // Could trigger user notification
          if (context.severity === 'critical') {
            showCriticalErrorNotification(error)
          }
        }}
      >
        <ClarityChat
          api="/api/chat"
          onError={(error) => {
            // Component-level error handling
            errorReporter.report(error, {
              component: 'ClarityChat',
              operation: 'general'
            })
          }}
        />
      </ReportableErrorBoundary>
    </div>
  )
}

// Custom error reporting destination
class CustomErrorReporter {
  async report(error, context) {
    // Send to multiple destinations
    const report = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context: {
        ...context,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    }

    try {
      // Send to primary error service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      })

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error Report:', report)
      }

      // Could also send to:
      // - Sentry
      // - LogRocket
      // - DataDog
      // - Custom analytics

    } catch (reportingError) {
      // Fallback error handling
      console.error('Failed to report error:', reportingError)
    }
  }
}

// Register custom reporter
errorReporter.registerDestination(new CustomErrorReporter())`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive error monitoring with severity classification, context capture,
          multiple reporting destinations, and development-time error metrics.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Testing Error Boundaries</h2>
        <CodePlayground
          code={`import {
  ContentErrorBoundary,
  BaseErrorBoundary
} from '@clarity-chat/react'

// Component that throws errors for testing
function ErrorThrowingComponent({ shouldError }) {
  if (shouldError) {
    throw new Error('Test error for boundary testing')
  }
  return <div>Normal component content</div>
}

// Test suite for error boundaries
describe('Error Boundaries', () => {
  it('renders fallback on error', () => {
    const { rerender } = render(
      <BaseErrorBoundary fallback={<div>Error occurred</div>}>
        <ErrorThrowingComponent shouldError={false} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Normal component content')).toBeInTheDocument()

    // Trigger error
    rerender(
      <BaseErrorBoundary fallback={<div>Error occurred</div>}>
        <ErrorThrowingComponent shouldError={true} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })

  it('calls onError callback', () => {
    const onError = vi.fn()

    render(
      <BaseErrorBoundary
        fallback={<div>Error</div>}
        onError={onError}
      >
        <ErrorThrowingComponent shouldError={true} />
      </BaseErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('resets on resetKeys change', () => {
    const { rerender } = render(
      <BaseErrorBoundary
        fallback={<div>Error</div>}
        resetKeys={[1]}
      >
        <ErrorThrowingComponent shouldError={true} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Error')).toBeInTheDocument()

    // Change reset key
    rerender(
      <BaseErrorBoundary
        fallback={<div>Error</div>}
        resetKeys={[2]}
      >
        <ErrorThrowingComponent shouldError={false} />
      </BaseErrorBoundary>
    )

    expect(screen.getByText('Normal component content')).toBeInTheDocument()
  })

  it('handles async errors', async () => {
    function AsyncErrorComponent() {
      const [error, setError] = useState(null)

      useEffect(() => {
        // Simulate async error
        setTimeout(() => {
          setError(new Error('Async operation failed'))
        }, 100)
      }, [])

      if (error) {
        throw error
      }

      return <div>Loading...</div>
    }

    render(
      <BaseErrorBoundary fallback={<div>Async error caught</div>}>
        <AsyncErrorComponent />
      </BaseErrorBoundary>
    )

    await waitFor(() => {
      expect(screen.getByText('Async error caught')).toBeInTheDocument()
    })
  })
})

// Integration test with real chat component
describe('Chat Error Boundaries', () => {
  it('handles API errors gracefully', async () => {
    // Mock API failure
    global.fetch = vi.fn(() => Promise.reject(new Error('API unavailable')))

    render(
      <ContentErrorBoundary fallback={<div>Chat unavailable</div>}>
        <ClarityChat api="/api/chat" />
      </ContentErrorBoundary>
    )

    // Should render fallback instead of crashing
    await waitFor(() => {
      expect(screen.getByText('Chat unavailable')).toBeInTheDocument()
    })
  })

  it('recovers from errors', async () => {
    let shouldError = true

    const { rerender } = render(
      <ResilientErrorBoundary>
        <ErrorThrowingComponent shouldError={shouldError} />
      </ResilientErrorBoundary>
    )

    // Should show error state
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    // Fix the error
    shouldError = false

    rerender(
      <ResilientErrorBoundary resetKeys={[shouldError]}>
        <ErrorThrowingComponent shouldError={shouldError} />
      </ResilientErrorBoundary>
    )

    // Should recover
    await waitFor(() => {
      expect(screen.getByText('Normal component content')).toBeInTheDocument()
    })
  })
})`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive testing strategies for error boundaries including unit tests,
          integration tests, async error handling, and recovery scenarios.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <h3 className="text-xl font-semibold mb-4">Components</h3>
        <PropsTable props={errorBoundaryFunctionsProps.slice(0, 10)} />

        <h3 className="text-xl font-semibold mb-4 mt-8">Functions</h3>
        <PropsTable props={errorBoundaryFunctionsProps.slice(10)} />

        <h3 className="text-xl font-semibold mb-4 mt-8">Props</h3>
        <PropsTable props={errorBoundaryProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <Callout type="info" title="Error Boundary Placement">
            <p>Place error boundaries at natural application boundaries:</p>
            <ul className="list-disc list-inside mt-2">
              <li><strong>Page Level:</strong> Catch entire page errors</li>
              <li><strong>Feature Level:</strong> Isolate complex features</li>
              <li><strong>Component Level:</strong> For reusable components</li>
              <li><strong>Content Level:</strong> For user-generated content</li>
            </ul>
          </Callout>

          <Callout type="tip" title="Error Recovery Patterns">
            <ul className="list-disc list-inside">
              <li><strong>Retry:</strong> For transient network errors</li>
              <li><strong>Reset:</strong> Clear component state and retry</li>
              <li><strong>Fallback:</strong> Show degraded but functional UI</li>
              <li><strong>Report:</strong> Always log errors for debugging</li>
            </ul>
          </Callout>

          <Callout type="warning" title="Error Boundary Limitations">
            <p>Error boundaries don't catch:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Errors in event handlers</li>
              <li>Errors in async code (use try/catch)</li>
              <li>Errors in server-side rendering</li>
              <li>Errors thrown in the error boundary itself</li>
            </ul>
          </Callout>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/guides/error-handling"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Error Handling Guide</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive error handling strategies for React applications.
            </p>
          </Link>
          <Link
            href="/reference/utilities/performance-monitoring"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Performance Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Monitor performance alongside error tracking.
            </p>
          </Link>
          <Link
            href="/reference/utilities/security"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Security Utilities</h3>
            <p className="text-sm text-muted-foreground">
              Secure your applications and handle security-related errors.
            </p>
          </Link>
          <Link
            href="/guides/testing"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Testing Guide</h3>
            <p className="text-sm text-muted-foreground">
              Test error boundaries and error handling scenarios.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}