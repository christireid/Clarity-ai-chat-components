'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle,
  WifiOff,
  Server,
  Clock,
  Code2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Interactive Demo Components
// ============================================================================

type ErrorType = 'network' | 'validation' | 'server' | 'timeout'

const errorConfigs = {
  network: {
    icon: WifiOff,
    title: 'Network Error',
    message:
      'Unable to connect to the server. Please check your internet connection.',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
  },
  validation: {
    icon: AlertTriangle,
    title: 'Validation Error',
    message: 'Your input contains invalid data. Please check and try again.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  server: {
    icon: Server,
    title: 'Server Error',
    message: 'An unexpected server error occurred. Our team has been notified.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
  timeout: {
    icon: Clock,
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
}

function ErrorTypeSelector({
  errorType,
  onChange,
}: {
  errorType: ErrorType
  onChange: (type: ErrorType) => void
}) {
  return (
    <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
      <p className="text-sm font-medium mb-3">Select Error Type:</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(errorConfigs) as ErrorType[]).map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={cn(
              'px-3 py-2 text-xs rounded-md transition-colors',
              errorType === type
                ? 'bg-brand-500 text-white'
                : 'bg-muted hover:bg-muted/70 text-foreground'
            )}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

function ErrorDisplay({
  errorType,
  isRetrying,
  onRetry,
}: {
  errorType: ErrorType
  isRetrying: boolean
  onRetry: () => void
}) {
  const config = errorConfigs[errorType]
  const Icon = config.icon

  return (
    <motion.div
      key={errorType}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: durations.fast }}
      className="space-y-4"
    >
      <div
        className={cn(
          'p-4 rounded-lg',
          config.bgColor,
          'border',
          config.borderColor
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.color)} />
          <div className="flex-1">
            <h4 className={cn('font-semibold mb-1', config.color)}>
              {config.title}
            </h4>
            <p className="text-sm text-muted-foreground">{config.message}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', isRetrying && 'animate-spin')} />
          {isRetrying ? 'Retrying...' : 'Retry'}
        </button>
        <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          Dismiss
        </button>
      </div>
    </motion.div>
  )
}

function SuccessDisplay() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center py-8"
    >
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
        Success!
      </h3>
      <p className="text-sm text-muted-foreground text-center">
        Operation completed successfully
      </p>
    </motion.div>
  )
}

function ErrorStateDemo() {
  const [errorType, setErrorType] = React.useState<ErrorType>('network')
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handleRetry = async () => {
    setIsRetrying(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRetrying(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleTypeChange = (type: ErrorType) => {
    setErrorType(type)
    setShowSuccess(false)
  }

  return (
    <div className="space-y-4">
      <ErrorTypeSelector errorType={errorType} onChange={handleTypeChange} />

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg p-6">
        {showSuccess ? (
          <SuccessDisplay />
        ) : (
          <ErrorDisplay
            errorType={errorType}
            isRetrying={isRetrying}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function ErrorHandlingGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        {/* Header */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Error Handling & Recovery</h1>
              <p className="text-muted-foreground">
                Comprehensive guide to handling errors gracefully in AI chat
                applications
              </p>
            </div>
          </div>

          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                Production AI applications must handle errors gracefully to
                provide reliable user experiences. This guide covers error
                handling patterns, retry strategies, and recovery mechanisms for
                Clarity Chat components.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-3">
                Key Principles
              </h3>
              <ul className="space-y-2">
                <li>
                  <strong>Fail Gracefully:</strong> Never crash the UI. Always
                  provide user-friendly error messages.
                </li>
                <li>
                  <strong>Automatic Recovery:</strong> Implement exponential
                  backoff retry for transient failures.
                </li>
                <li>
                  <strong>User Control:</strong> Allow users to manually retry
                  or dismiss errors.
                </li>
                <li>
                  <strong>Preserve State:</strong> Don't lose user input when
                  errors occur.
                </li>
                <li>
                  <strong>Observability:</strong> Log errors for monitoring and
                  debugging.
                </li>
              </ul>
            </div>
          </section>

          {/* Interactive Demo */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Demo</h2>
            <p className="text-muted-foreground mb-6">
              Try different error types and see how graceful error handling
              works:
            </p>
            <ErrorStateDemo />
          </section>

          {/* Error Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Common Error Types</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <WifiOff className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Network Errors</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Connectivity issues, DNS failures, or unreachable servers.
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      Error codes: ECONNREFUSED, ETIMEDOUT, ENETUNREACH
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Validation Errors</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Invalid user input, malformed requests, or constraint
                      violations.
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      HTTP 400 Bad Request, 422 Unprocessable Entity
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Server className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Server Errors</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Internal server failures, database errors, or external API
                      failures.
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      HTTP 500 Internal Server Error, 503 Service Unavailable
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Timeout Errors</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Requests that exceed configured timeout limits.
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">
                      HTTP 408 Request Timeout, ETIMEDOUT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Basic Error Handling */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Basic Error Handling</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Use the built-in error handling with <code>useClarityChat</code>
                :
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useClarityChat } from '@clarity-chat/react'

function ChatWithErrorHandling() {
  const {
    messages,
    sendMessage,
    error,
    clearError,
    retry,
  } = useClarityChat({
    api: '/api/chat',
    onError: (error) => {
      // Optional custom error handler
      console.error('Chat error:', error)
    },
  })

  return (
    <div>
      <MessageList messages={messages} />

      {error && (
        <ErrorBanner
          error={error}
          onRetry={retry}
          onDismiss={clearError}
        />
      )}

      <ChatInput onSend={sendMessage} />
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Exponential Backoff */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Exponential Backoff Retry
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Implement smart retry logic with exponential backoff:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useClarityChat } from '@clarity-chat/react'

function ChatWithRetry() {
  const { sendMessage } = useClarityChat({
    api: '/api/chat',
    retry: {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      // Retry on network errors and 5xx server errors
      shouldRetry: (error) => {
        if (error.code === 'NETWORK_ERROR') return true
        if (error.status >= 500) return true
        return false
      },
    },
  })

  return <ChatWindow onSend={sendMessage} />
}

// Custom retry utility with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let attempt = 0
  let delay = initialDelay

  while (attempt < maxAttempts) {
    try {
      return await fn()
    } catch (error) {
      attempt++
      if (attempt >= maxAttempts) throw error

      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }

  throw new Error('Max retry attempts exceeded')
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Error Boundaries */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Error Boundaries</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Use React Error Boundaries to catch rendering errors:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { ChatErrorBoundary } from '@clarity-chat/react'

function App() {
  return (
    <ChatErrorBoundary
      fallback={(error, reset) => (
        <div className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            {error.message}
          </p>
          <button
            onClick={reset}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}
    >
      <ClarityChat api="/api/chat" />
    </ChatErrorBoundary>
  )
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* State Preservation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Preserving User State</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Never lose user input when errors occur:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useClarityChat, useMessageQueue } from '@clarity-chat/react'

function ResilientChat() {
  const { sendMessage, error } = useClarityChat({ api: '/api/chat' })
  const [inputValue, setInputValue] = useState('')
  const { enqueue, flush } = useMessageQueue()

  const handleSend = async (content: string) => {
    // Save input immediately
    setInputValue(content)

    try {
      await sendMessage(content)
      setInputValue('') // Clear only on success
    } catch (error) {
      // Keep input value for retry
      enqueue({ content, timestamp: Date.now() })
    }
  }

  const handleRetry = async () => {
    if (inputValue) {
      await handleSend(inputValue)
    }
    await flush() // Retry queued messages
  }

  return (
    <div>
      {error && (
        <ErrorBanner error={error} onRetry={handleRetry} />
      )}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
      />
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Monitoring */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Error Monitoring</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Integrate error tracking for production observability:
              </p>

              <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
                <pre className="text-sm">
                  <code>{`import { useClarityChat } from '@clarity-chat/react'
import * as Sentry from '@sentry/react'

function MonitoredChat() {
  const { sendMessage } = useClarityChat({
    api: '/api/chat',
    onError: (error, context) => {
      // Log to monitoring service
      Sentry.captureException(error, {
        extra: {
          messageId: context.messageId,
          userId: context.userId,
          conversationId: context.conversationId,
          errorType: error.type,
          retryCount: context.retryCount,
        },
        tags: {
          feature: 'chat',
          errorCategory: categorizeError(error),
        },
      })

      // Track error metrics
      trackErrorMetric({
        type: error.type,
        status: error.status,
        endpoint: '/api/chat',
      })
    },
  })

  return <ChatWindow onSend={sendMessage} />
}

function categorizeError(error: Error): string {
  if (error.message.includes('network')) return 'network'
  if (error.message.includes('timeout')) return 'timeout'
  if ('status' in error && error.status >= 500) return 'server'
  return 'unknown'
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold mt-6 mb-3">Do's ✅</h3>
              <ul className="space-y-2">
                <li>Show specific, actionable error messages to users</li>
                <li>
                  Implement automatic retry with exponential backoff for
                  transient errors
                </li>
                <li>Preserve user input when errors occur</li>
                <li>Log errors to monitoring services for observability</li>
                <li>Use Error Boundaries to catch React rendering errors</li>
                <li>Provide manual retry and dismiss options</li>
                <li>Test error handling paths as thoroughly as happy paths</li>
              </ul>

              <h3 className="text-lg font-semibold mt-6 mb-3">Don'ts ❌</h3>
              <ul className="space-y-2">
                <li>Don't show technical stack traces to end users</li>
                <li>Don't retry forever - set max attempt limits</li>
                <li>Don't lose user data when errors occur</li>
                <li>Don't ignore errors silently</li>
                <li>Don't retry on validation errors (4xx status codes)</li>
                <li>Don't use generic "Something went wrong" messages</li>
                <li>Don't block the entire UI during retry attempts</li>
              </ul>
            </div>
          </section>

          {/* Related Resources */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Related Resources</h2>
            <div className="grid gap-4">
              <Link
                href="/guides/streaming"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-brand-500" />
                  <div>
                    <h4 className="font-semibold">Streaming Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      Handle streaming errors and connection drops
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/reference/hooks/use-clarity-chat"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-brand-500" />
                  <div>
                    <h4 className="font-semibold">useClarityChat API</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete API reference with error handling options
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/cookbook/error-recovery-patterns"
                className="p-4 rounded-lg border border-border/50 bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-brand-500" />
                  <div>
                    <h4 className="font-semibold">Error Recovery Cookbook</h4>
                    <p className="text-sm text-muted-foreground">
                      Common error recovery patterns and recipes
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
