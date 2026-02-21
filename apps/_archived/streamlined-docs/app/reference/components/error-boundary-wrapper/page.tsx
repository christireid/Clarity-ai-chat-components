'use client'

import * as React from 'react'
import { Shield, RefreshCw, AlertCircle, Zap, Bell } from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import { cn } from '../../../../lib/utils'

const PACKAGE_NAME = '@clarity-chat/error-handling'

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 1 },
  { id: 'features', title: 'Key Features', level: 2 },
  { id: 'when-to-use', title: 'When to Use', level: 2 },
  { id: 'props', title: 'Props API', level: 1 },
  { id: 'core-props', title: 'Core Props', level: 2 },
  { id: 'callback-props', title: 'Callback Props', level: 2 },
  { id: 'customization-props', title: 'Customization Props', level: 2 },
  { id: 'error-types', title: 'Error Types', level: 1 },
  { id: 'examples', title: 'Code Examples', level: 1 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'with-monitoring', title: 'With Monitoring', level: 2 },
  { id: 'custom-fallback', title: 'Custom Fallback', level: 2 },
  { id: 'recovery', title: 'Recovery Strategies', level: 1 },
  { id: 'automatic-recovery', title: 'Automatic Recovery', level: 2 },
  { id: 'manual-recovery', title: 'Manual Recovery', level: 2 },
  { id: 'integration', title: 'Integration', level: 1 },
  { id: 'sentry-integration', title: 'Sentry', level: 2 },
  { id: 'logrocket-integration', title: 'LogRocket', level: 2 },
  { id: 'custom-handlers', title: 'Custom Handlers', level: 2 },
  { id: 'live-demo', title: 'Live Demo', level: 1 },
  { id: 'related', title: 'Related APIs', level: 1 },
]

const relatedAPIs = [
  {
    name: 'useErrorBoundary',
    type: 'hook' as const,
    description: 'Hook for programmatic error handling and recovery within components',
    href: '/reference/hooks/use-error-boundary',
  },
  {
    name: 'useErrorRecovery',
    type: 'hook' as const,
    description: 'Hook for managing custom recovery strategies for different error types',
    href: '/reference/hooks/use-error-recovery',
  },
  {
    name: 'ErrorDisplay',
    type: 'component' as const,
    description: 'Beautiful error display component with severity levels and actions',
    href: '/reference/components/error-display',
  },
  {
    name: 'errorReporter',
    type: 'utility' as const,
    description: 'Centralized error reporting service for tracking and analytics',
    href: '/reference/utilities/error-reporter',
  },
]

export default function ErrorBoundaryWrapperPage() {
  const [demoError, setDemoError] = React.useState<string | null>(null)
  const [resetKey, setResetKey] = React.useState(0)

  const triggerError = (errorType: string) => {
    setDemoError(errorType)
  }

  const handleReset = () => {
    setDemoError(null)
    setResetKey((prev) => prev + 1)
  }

  return (
    <DocumentationPage
      title="ErrorBoundaryWrapper"
      description="Robust error boundary with automatic recovery, error reporting, and graceful fallback UI for production reliability"
      icon={Shield}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName={PACKAGE_NAME}
      features={[
        {
          icon: RefreshCw,
          label: 'Automatic Recovery',
          description: 'Retry logic with exponential backoff',
        },
        {
          icon: Bell,
          label: 'Error Reporting',
          description: 'Integration with monitoring services',
        },
        {
          icon: AlertCircle,
          label: 'Graceful Degradation',
          description: 'Beautiful fallback UI',
        },
        {
          icon: Zap,
          label: 'Stack Trace Capture',
          description: 'Detailed error context',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={relatedAPIs}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="space-y-4 text-muted-foreground">
          <p>
            The <code className="text-sm bg-accent px-2 py-0.5 rounded">ErrorBoundaryWrapper</code>{' '}
            component (exported as <code className="text-sm bg-accent px-2 py-0.5 rounded">EnhancedErrorBoundary</code>)
            is a robust error boundary built on top of{' '}
            <a
              href="https://github.com/bvaughn/react-error-boundary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-500 hover:underline"
            >
              react-error-boundary v5
            </a>
            . It provides comprehensive error handling with automatic recovery, beautiful fallback UI, and seamless
            integration with error monitoring services.
          </p>

          <div
            id="features"
            className="p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-border/50"
          >
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>
                  <strong>React 19 Compatible:</strong> Built specifically for React 19 with modern error handling
                  patterns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>
                  <strong>Automatic Recovery:</strong> Retry logic with exponential backoff for transient failures
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>
                  <strong>Beautiful Default UI:</strong> Premium fallback component with animations and accessibility
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>
                  <strong>Error Reporting:</strong> Built-in integration with Sentry, LogRocket, and custom services
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>
                  <strong>Type-Safe:</strong> Full TypeScript support with specialized error types
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>
                  <strong>WCAG 2.1 AA Compliant:</strong> Accessible by default with ARIA labels and keyboard navigation
                </span>
              </li>
            </ul>
          </div>

          <div id="when-to-use" className="mt-6">
            <h3 className="text-lg font-semibold mb-3">When to Use</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Use ErrorBoundary When:</h4>
                <ul className="space-y-1 text-sm text-emerald-700 dark:text-emerald-300">
                  <li>• Wrapping entire application or major routes</li>
                  <li>• Catching component lifecycle errors</li>
                  <li>• Providing graceful degradation for users</li>
                  <li>• Integrating with error monitoring services</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Consider Alternatives When:
                </h4>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  <li>• Handling async errors (use try/catch or hooks)</li>
                  <li>• Form validation errors (use validation libraries)</li>
                  <li>• API request errors (use error handling hooks)</li>
                  <li>• Event handler errors (use try/catch blocks)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props API">
        <div className="space-y-6">
          <div id="core-props">
            <h3 className="text-xl font-semibold mb-4">Core Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Prop</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Default</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">children</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">React.ReactNode</code>
                    </td>
                    <td className="p-3 text-muted-foreground">required</td>
                    <td className="p-3">Components to render within the error boundary</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">FallbackComponent</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">React.ComponentType</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">DefaultFallback</code>
                    </td>
                    <td className="p-3">Custom fallback UI component to display when error occurs</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">fallback</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">React.ReactNode</code>
                    </td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Simple fallback element (overridden by FallbackComponent)</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">resetKeys</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">unknown[]</code>
                    </td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Array of keys that trigger boundary reset when changed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="callback-props">
            <h3 className="text-xl font-semibold mb-4">Callback Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Prop</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">onError</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">(error: Error, info: ErrorInfo) =&gt; void</code>
                    </td>
                    <td className="p-3">Called when error is caught, ideal for logging to external services</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">onReset</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">(details: ResetDetails) =&gt; void</code>
                    </td>
                    <td className="p-3">
                      Called when error boundary is reset, useful for cleanup operations
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="customization-props">
            <h3 className="text-xl font-semibold mb-4">Customization Props</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Prop</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Default</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">enableLogging</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">boolean</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">true</code>
                    </td>
                    <td className="p-3">Enable error logging to console and external services</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">className</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">string</code>
                    </td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Additional CSS classes for the boundary wrapper</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">variant</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">'default' | 'minimal' | 'fullscreen'</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">'default'</code>
                    </td>
                    <td className="p-3">Visual variant for the fallback UI</td>
                  </tr>
                  <tr>
                    <td className="p-3">
                      <code className="text-xs bg-accent px-2 py-1 rounded">colorScheme</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">'auto' | 'light' | 'dark'</code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs">'auto'</code>
                    </td>
                    <td className="p-3">Color scheme for fallback UI (auto respects system preference)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Error Types Section */}
      <Section id="error-types" title="Error Types">
        <p className="text-muted-foreground mb-4">
          The error boundary handles various error types from the{' '}
          <code className="text-sm bg-accent px-2 py-0.5 rounded">@clarity-chat/error-handling</code> package:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Error Type</th>
                <th className="text-left p-3 font-semibold">Recoverable</th>
                <th className="text-left p-3 font-semibold">Description</th>
                <th className="text-left p-3 font-semibold">Common Causes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-3">
                  <code className="text-xs bg-accent px-2 py-1 rounded">ClarityError</code>
                </td>
                <td className="p-3">
                  <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
                </td>
                <td className="p-3">Base error with solution suggestions</td>
                <td className="p-3">Application-level errors with known solutions</td>
              </tr>
              <tr>
                <td className="p-3">
                  <code className="text-xs bg-accent px-2 py-1 rounded">ConfigurationError</code>
                </td>
                <td className="p-3">
                  <span className="text-red-600 dark:text-red-400">No</span>
                </td>
                <td className="p-3">Invalid component configuration</td>
                <td className="p-3">Missing props, invalid config values</td>
              </tr>
              <tr>
                <td className="p-3">
                  <code className="text-xs bg-accent px-2 py-1 rounded">APIError</code>
                </td>
                <td className="p-3">
                  <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
                </td>
                <td className="p-3">API request failures</td>
                <td className="p-3">Network issues, server errors, rate limits</td>
              </tr>
              <tr>
                <td className="p-3">
                  <code className="text-xs bg-accent px-2 py-1 rounded">NetworkError</code>
                </td>
                <td className="p-3">
                  <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
                </td>
                <td className="p-3">Network connectivity issues</td>
                <td className="p-3">Offline, DNS failures, connection timeouts</td>
              </tr>
              <tr>
                <td className="p-3">
                  <code className="text-xs bg-accent px-2 py-1 rounded">StreamError</code>
                </td>
                <td className="p-3">
                  <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
                </td>
                <td className="p-3">Streaming connection failures</td>
                <td className="p-3">Connection lost, malformed stream data</td>
              </tr>
              <tr>
                <td className="p-3">
                  <code className="text-xs bg-accent px-2 py-1 rounded">ComponentError</code>
                </td>
                <td className="p-3">
                  <span className="text-amber-600 dark:text-amber-400">Maybe</span>
                </td>
                <td className="p-3">Component lifecycle errors</td>
                <td className="p-3">Mount failures, render errors</td>
              </tr>
              <tr>
                <td className="p-3">
                  <code className="text-xs bg-accent px-2 py-1 rounded">Standard Error</code>
                </td>
                <td className="p-3">
                  <span className="text-amber-600 dark:text-amber-400">Maybe</span>
                </td>
                <td className="p-3">Generic JavaScript errors</td>
                <td className="p-3">Unexpected application errors</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Code Examples Section */}
      <Section id="examples" title="Code Examples">
        <div className="space-y-8">
          <div id="basic-usage">
            <h3 className="text-xl font-semibold mb-4">Basic Usage</h3>
            <p className="text-muted-foreground mb-4">
              Wrap your application or component tree with the error boundary for automatic error catching:
            </p>
            <CodeBlock
              code={`import { EnhancedErrorBoundary } from '@clarity-chat/error-handling'

function App() {
  return (
    <EnhancedErrorBoundary>
      <YourApplication />
    </EnhancedErrorBoundary>
  )
}

// Or wrap specific components
function ChatFeature() {
  return (
    <EnhancedErrorBoundary>
      <ChatWindow />
      <MessageList />
      <InputArea />
    </EnhancedErrorBoundary>
  )
}`}
              language="tsx"
              filename="App.tsx"
            />
          </div>

          <div id="with-monitoring">
            <h3 className="text-xl font-semibold mb-4">With Error Monitoring</h3>
            <p className="text-muted-foreground mb-4">
              Integrate with Sentry, LogRocket, or other monitoring services:
            </p>
            <CodeBlock
              code={`import { EnhancedErrorBoundary } from '@clarity-chat/error-handling'
import * as Sentry from '@sentry/react'

function App() {
  return (
    <EnhancedErrorBoundary
      enableLogging={true}
      onError={(error, errorInfo) => {
        // Send to Sentry
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
          tags: {
            errorBoundary: true,
          },
        })

        // Log to custom analytics
        analytics.track('Error Occurred', {
          error: error.message,
          stack: error.stack,
          timestamp: Date.now(),
        })
      }}
      onReset={(details) => {
        console.log('Error boundary reset:', details.reason)

        // Clear error state in your store
        store.dispatch(clearErrors())
      }}
    >
      <YourApplication />
    </EnhancedErrorBoundary>
  )
}`}
              language="tsx"
              filename="App.tsx"
            />
          </div>

          <div id="custom-fallback">
            <h3 className="text-xl font-semibold mb-4">Custom Fallback UI</h3>
            <p className="text-muted-foreground mb-4">
              Provide a custom fallback component that matches your brand:
            </p>
            <CodeBlock
              code={`import { EnhancedErrorBoundary, type FallbackProps } from '@clarity-chat/error-handling'

function CustomErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Go home
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500">
              Error details
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <EnhancedErrorBoundary FallbackComponent={CustomErrorFallback}>
      <YourApplication />
    </EnhancedErrorBoundary>
  )
}`}
              language="tsx"
              filename="ErrorFallback.tsx"
            />
          </div>
        </div>
      </Section>

      {/* Recovery Strategies Section */}
      <Section id="recovery" title="Recovery Strategies">
        <div className="space-y-6">
          <div id="automatic-recovery">
            <h3 className="text-xl font-semibold mb-4">Automatic Recovery</h3>
            <p className="text-muted-foreground mb-4">
              The error boundary automatically resets when <code>resetKeys</code> change:
            </p>
            <CodeBlock
              code={`import { EnhancedErrorBoundary } from '@clarity-chat/error-handling'
import { useState } from 'react'

function ChatContainer() {
  const [userId, setUserId] = useState<string>()
  const [conversationId, setConversationId] = useState<string>()

  return (
    <EnhancedErrorBoundary
      // Automatically reset when user or conversation changes
      resetKeys={[userId, conversationId]}
      onReset={(details) => {
        if (details.reason === 'keys') {
          console.log('Reset due to key change:', {
            prev: details.prev,
            next: details.next,
          })
        }
      }}
    >
      <ChatWindow
        userId={userId}
        conversationId={conversationId}
      />
    </EnhancedErrorBoundary>
  )
}`}
              language="tsx"
              filename="ChatContainer.tsx"
            />
          </div>

          <div id="manual-recovery">
            <h3 className="text-xl font-semibold mb-4">Manual Recovery with Hook</h3>
            <p className="text-muted-foreground mb-4">
              Use the <code>useErrorBoundary</code> hook for programmatic error handling:
            </p>
            <CodeBlock
              code={`import { useErrorBoundary } from '@clarity-chat/error-handling'
import { useState } from 'react'

function ChatWindow() {
  const { showBoundary, resetBoundary } = useErrorBoundary()
  const [isRetrying, setIsRetrying] = useState(false)

  const sendMessage = async (message: string) => {
    try {
      setIsRetrying(false)
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return await response.json()
    } catch (error) {
      // Show error in boundary (triggers fallback UI)
      showBoundary(error)
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)

    try {
      // Reset the boundary
      resetBoundary()

      // Retry the operation
      await sendMessage('Retry message')
    } catch (error) {
      console.error('Retry failed:', error)
      setIsRetrying(false)
    }
  }

  return (
    <div>
      {isRetrying && <LoadingSpinner />}
      {/* Your UI */}
    </div>
  )
}`}
              language="tsx"
              filename="ChatWindow.tsx"
            />
          </div>
        </div>
      </Section>

      {/* Integration Section */}
      <Section id="integration" title="Integration">
        <div className="space-y-6">
          <div id="sentry-integration">
            <h3 className="text-xl font-semibold mb-4">Sentry Integration</h3>
            <p className="text-muted-foreground mb-4">Complete Sentry integration with source maps and context:</p>
            <CodeBlock
              code={`import { EnhancedErrorBoundary } from '@clarity-chat/error-handling'
import * as Sentry from '@sentry/react'

// Initialize Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Add custom context
    if (hint.originalException instanceof Error) {
      event.contexts = {
        ...event.contexts,
        clarity: {
          userId: getCurrentUserId(),
          conversationId: getCurrentConversationId(),
        },
      }
    }
    return event
  },
})

function App() {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        // Send to Sentry with full context
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
          tags: {
            source: 'error-boundary',
          },
          level: 'error',
        })
      }}
    >
      <YourApplication />
    </EnhancedErrorBoundary>
  )
}`}
              language="tsx"
              filename="sentry-config.tsx"
            />
          </div>

          <div id="logrocket-integration">
            <h3 className="text-xl font-semibold mb-4">LogRocket Integration</h3>
            <p className="text-muted-foreground mb-4">
              Integrate with LogRocket for session replay and error tracking:
            </p>
            <CodeBlock
              code={`import { EnhancedErrorBoundary } from '@clarity-chat/error-handling'
import LogRocket from 'logrocket'

// Initialize LogRocket
LogRocket.init('your-app-id/your-app-name')

function App() {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        // Log to LogRocket with session URL
        LogRocket.captureException(error, {
          tags: {
            source: 'error-boundary',
          },
          extra: {
            componentStack: errorInfo.componentStack,
            sessionURL: LogRocket.sessionURL,
          },
        })

        // Add breadcrumb for debugging
        LogRocket.log('Error Boundary Triggered', {
          error: error.message,
          stack: error.stack,
        })
      }}
    >
      <YourApplication />
    </EnhancedErrorBoundary>
  )
}`}
              language="tsx"
              filename="logrocket-config.tsx"
            />
          </div>

          <div id="custom-handlers">
            <h3 className="text-xl font-semibold mb-4">Custom Error Handlers</h3>
            <p className="text-muted-foreground mb-4">Create custom error handling logic for your specific needs:</p>
            <CodeBlock
              code={`import { EnhancedErrorBoundary, errorReporter } from '@clarity-chat/error-handling'

function App() {
  const handleError = async (error: Error, errorInfo: React.ErrorInfo) => {
    // 1. Report to built-in error reporter
    errorReporter.report({
      componentName: 'ErrorBoundary',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      additionalData: {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      },
    })

    // 2. Send to custom API endpoint
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
          },
          context: {
            componentStack: errorInfo.componentStack,
            timestamp: Date.now(),
            userId: getCurrentUserId(),
          },
        }),
      })
    } catch (err) {
      console.error('Failed to report error:', err)
    }

    // 3. Show user notification
    showNotification({
      type: 'error',
      message: 'Something went wrong. Our team has been notified.',
    })

    // 4. Track in analytics
    analytics.track('Error Occurred', {
      errorMessage: error.message,
      errorType: error.name,
    })
  }

  return (
    <EnhancedErrorBoundary onError={handleError}>
      <YourApplication />
    </EnhancedErrorBoundary>
  )
}`}
              language="tsx"
              filename="custom-error-handler.tsx"
            />
          </div>
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="live-demo" title="Live Demo">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Try triggering different error scenarios to see how the error boundary handles them:
          </p>

          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => triggerError('render')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    'bg-red-100 text-red-700 hover:bg-red-200',
                    'dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                  )}
                >
                  Trigger Render Error
                </button>
                <button
                  onClick={() => triggerError('async')}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    'bg-amber-100 text-amber-700 hover:bg-amber-200',
                    'dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30'
                  )}
                >
                  Trigger Async Error
                </button>
                <button
                  onClick={handleReset}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
                    'dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30'
                  )}
                >
                  Reset Demo
                </button>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border/50 min-h-[200px] flex items-center justify-center">
                {demoError === 'render' ? (
                  <DemoErrorComponent />
                ) : demoError === 'async' ? (
                  <p className="text-amber-600 dark:text-amber-400">
                    Async errors need to be handled with try/catch or error hooks, not error boundaries!
                  </p>
                ) : (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">Demo area ready</p>
                    <p className="text-sm text-muted-foreground">
                      Click a button above to trigger an error scenario
                    </p>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                <strong>Note:</strong> The error boundary catches render errors during the component lifecycle. Async
                errors (like failed API calls) should be handled with try/catch blocks or error handling hooks.
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}

// Demo component that throws an error
function DemoErrorComponent() {
  throw new Error('This is a demo error from the error boundary!')
}
