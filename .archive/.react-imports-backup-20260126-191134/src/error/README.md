# Error Tracking System

A comprehensive error tracking and reporting system with support for multiple providers, user feedback collection, and React error boundary integration.

## Features

- **Provider-Agnostic**: Support for Sentry, Rollbar, Bugsnag, and custom APIs
- **Automatic Error Reporting**: Capture unhandled errors and promise rejections
- **User Feedback**: Collect user feedback when errors occur
- **Error Boundary Integration**: Enhanced error boundaries with tracking
- **Breadcrumbs**: Track user actions leading to errors
- **Error Statistics**: Monitor error frequency and patterns
- **Console Capture**: Optionally capture console.error calls
- **Sampling**: Control error reporting rate
- **Filtering**: Filter errors before reporting
- **Offline Support**: Store errors locally when offline

## Installation

```bash
npm install @chat-ui/react
```

## Quick Start

### 1. Setup Error Reporter

Wrap your app with `ErrorReporterProvider`:

```tsx
import {
  ErrorReporterProvider,
  createSentryProvider,
  createConsoleProvider,
} from '@chat-ui/react'

function App() {
  return (
    <ErrorReporterProvider
      config={{
        providers: [
          // Production error tracking
          createSentryProvider({
            dsn: 'https://xxx@sentry.io/123',
            environment: 'production',
            release: '1.0.0',
          }),
          // Development logging
          createConsoleProvider(),
        ],
        enabled: process.env.NODE_ENV === 'production',
        autoReport: true,
        enableFeedback: true,
      }}
    >
      <YourApp />
    </ErrorReporterProvider>
  )
}
```

### 2. Use Enhanced Error Boundary

Wrap components with error boundaries:

```tsx
import { ErrorBoundaryEnhanced } from '@chat-ui/react'

function ChatPage() {
  return (
    <ErrorBoundaryEnhanced
      enableFeedback
      errorContext={{ page: 'chat' }}
    >
      <ChatWindow />
    </ErrorBoundaryEnhanced>
  )
}
```

### 3. Manual Error Reporting

Report errors manually in your components:

```tsx
import { useErrorReporter } from '@chat-ui/react'

function MyComponent() {
  const { reportError, addBreadcrumb } = useErrorReporter()

  const handleAction = async () => {
    addBreadcrumb('User clicked submit button')

    try {
      await submitForm()
    } catch (error) {
      reportError(error, {
        action: 'form_submission',
        formId: 'contact-form',
      })
    }
  }

  return <button onClick={handleAction}>Submit</button>
}
```

## Built-in Providers

### Sentry

```tsx
import { createSentryProvider } from '@chat-ui/react'

const sentryProvider = createSentryProvider({
  dsn: 'https://xxx@sentry.io/123',
  environment: 'production',
  release: '1.0.0',
  tracesSampleRate: 0.1,
})
```

### Rollbar

```tsx
import { createRollbarProvider } from '@chat-ui/react'

const rollbarProvider = createRollbarProvider({
  accessToken: 'your-access-token',
  environment: 'production',
  codeVersion: '1.0.0',
})
```

### Bugsnag

```tsx
import { createBugsnagProvider } from '@chat-ui/react'

const bugsnagProvider = createBugsnagProvider({
  apiKey: 'your-api-key',
  releaseStage: 'production',
  appVersion: '1.0.0',
})
```

### Custom API

```tsx
import { createCustomAPIProvider } from '@chat-ui/react'

const apiProvider = createCustomAPIProvider({
  endpoint: 'https://api.example.com/errors',
  headers: {
    'Authorization': 'Bearer token',
  },
  method: 'POST',
})
```

### Console (Development)

```tsx
import { createConsoleProvider } from '@chat-ui/react'

const consoleProvider = createConsoleProvider()
```

### LocalStorage (Offline)

```tsx
import { createLocalStorageProvider, getStoredErrors } from '@chat-ui/react'

const localProvider = createLocalStorageProvider(50) // Keep 50 errors

// Later, retrieve stored errors
const errors = getStoredErrors()
```

## Configuration Options

```tsx
interface ErrorReporterConfig {
  // Required: List of error tracking providers
  providers: ErrorProvider[]

  // Enable/disable error reporting (default: true)
  enabled?: boolean

  // Auto-report unhandled errors (default: true)
  autoReport?: boolean

  // Capture console.error calls (default: false)
  captureConsole?: boolean

  // Enable user feedback collection (default: true)
  enableFeedback?: boolean

  // Error sampling rate 0-1 (default: 1.0)
  sampleRate?: number

  // Filter function to exclude errors
  beforeSend?: (report: ErrorReport) => ErrorReport | null

  // Callback when error is reported
  onError?: (report: ErrorReport) => void

  // Global tags for all errors
  globalTags?: Record<string, string>

  // Global context for all errors
  globalContext?: Record<string, any>
}
```

## useErrorReporter Hook

```tsx
const {
  // Report an error with basic context
  reportError,

  // Report an error with full options
  reportErrorDetailed,

  // Set user context
  setUser,

  // Set global context
  setContext,

  // Add breadcrumb
  addBreadcrumb,

  // Get error statistics
  getStats,

  // Check if reporting is enabled
  isEnabled,
} = useErrorReporter()
```

### Examples

#### Set User Context

```tsx
useEffect(() => {
  if (user) {
    setUser(user.id, user.email, {
      name: user.name,
      plan: user.plan,
    })
  }
}, [user])
```

#### Add Context

```tsx
useEffect(() => {
  setContext({
    conversationId: conversation.id,
    messageCount: messages.length,
  })
}, [conversation, messages])
```

#### Track User Actions

```tsx
const handleSendMessage = async (message: string) => {
  addBreadcrumb('User sent message', { length: message.length })

  try {
    await sendMessage(message)
  } catch (error) {
    reportError(error, { messageLength: message.length })
  }
}
```

#### Detailed Error Reporting

```tsx
reportErrorDetailed({
  message: 'Failed to load conversation',
  severity: 'error',
  context: {
    conversationId,
    attemptCount: 3,
  },
  tags: {
    feature: 'chat',
    action: 'load',
  },
  userFeedback: 'Messages not loading',
})
```

## Error Boundary

### Basic Usage

```tsx
<ErrorBoundaryEnhanced>
  <YourComponent />
</ErrorBoundaryEnhanced>
```

### With Custom Fallback

```tsx
<ErrorBoundaryEnhanced
  fallback={(error, reset, showFeedback) => (
    <div>
      <h1>Error: {error.message}</h1>
      <button onClick={reset}>Try Again</button>
      <button onClick={showFeedback}>Report Issue</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundaryEnhanced>
```

### With Context and Severity

```tsx
<ErrorBoundaryEnhanced
  enableFeedback
  severity="fatal"
  errorContext={{
    page: 'checkout',
    step: 'payment',
  }}
  onError={(error, errorInfo) => {
    console.log('Custom error handling', error)
  }}
>
  <CheckoutForm />
</ErrorBoundaryEnhanced>
```

### Auto-Reset on Changes

```tsx
<ErrorBoundaryEnhanced
  resetKeys={[conversationId]}
  onReset={() => {
    console.log('Error boundary reset')
  }}
>
  <ChatWindow conversationId={conversationId} />
</ErrorBoundaryEnhanced>
```

## User Feedback

### Automatic Feedback (with ErrorBoundaryEnhanced)

```tsx
<ErrorBoundaryEnhanced enableFeedback>
  <YourComponent />
</ErrorBoundaryEnhanced>
```

### Manual Feedback Component

```tsx
import { ErrorFeedback } from '@chat-ui/react'

function MyComponent() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { reportErrorDetailed } = useErrorReporter()

  const handleFeedbackSubmit = (feedback) => {
    reportErrorDetailed({
      message: error.message,
      severity: 'error',
      userFeedback: JSON.stringify(feedback),
    })
    setShowFeedback(false)
  }

  return (
    <>
      <button onClick={() => setShowFeedback(true)}>
        Report Issue
      </button>

      <ErrorFeedback
        show={showFeedback}
        error={error}
        onSubmit={handleFeedbackSubmit}
        onCancel={() => setShowFeedback(false)}
      />
    </>
  )
}
```

### Feedback Button

```tsx
import { ErrorFeedbackButton } from '@chat-ui/react'

<ErrorFeedbackButton
  error={error}
  onSubmit={handleFeedback}
>
  Report Issue
</ErrorFeedbackButton>
```

## Error Statistics

```tsx
function ErrorStatsDisplay() {
  const { getStats } = useErrorReporter()
  const stats = getStats()

  return (
    <div>
      <p>Total Errors: {stats.totalErrors}</p>
      <p>Fatal: {stats.bySeverity.fatal}</p>
      <p>Errors: {stats.bySeverity.error}</p>
      <p>Warnings: {stats.bySeverity.warning}</p>

      <h3>Top Errors:</h3>
      <ul>
        {stats.topErrors.map((error, i) => (
          <li key={i}>
            {error.message} ({error.count} times)
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Advanced Patterns

### Multiple Providers

```tsx
<ErrorReporterProvider
  config={{
    providers: [
      createSentryProvider({ dsn: 'sentry-dsn' }),
      createRollbarProvider({ accessToken: 'rollbar-token' }),
      createLocalStorageProvider(), // Offline backup
    ],
  }}
>
  <App />
</ErrorReporterProvider>
```

### Error Filtering

```tsx
<ErrorReporterProvider
  config={{
    providers: [sentryProvider],
    beforeSend: (report) => {
      // Don't report 404 errors
      if (report.message.includes('404')) {
        return null
      }

      // Add extra context
      report.context = {
        ...report.context,
        customField: 'value',
      }

      return report
    },
  }}
>
  <App />
</ErrorReporterProvider>
```

### Sampling

```tsx
<ErrorReporterProvider
  config={{
    providers: [sentryProvider],
    sampleRate: 0.1, // Report 10% of errors
  }}
>
  <App />
</ErrorReporterProvider>
```

### Environment-Specific Configuration

```tsx
const getErrorConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      providers: [
        createSentryProvider({ dsn: process.env.SENTRY_DSN }),
      ],
      enabled: true,
      autoReport: true,
      sampleRate: 0.5,
    }
  }

  return {
    providers: [createConsoleProvider()],
    enabled: true,
    autoReport: true,
    captureConsole: true,
  }
}

<ErrorReporterProvider config={getErrorConfig()}>
  <App />
</ErrorReporterProvider>
```

## Best Practices

1. **Always wrap your app** with ErrorReporterProvider
2. **Use error boundaries** at appropriate component boundaries
3. **Add breadcrumbs** for important user actions
4. **Set user context** when user logs in
5. **Update context** when navigation or state changes
6. **Enable feedback** in production for user reports
7. **Use sampling** to control costs in high-traffic apps
8. **Filter sensitive data** in beforeSend
9. **Test error reporting** in development
10. **Monitor error statistics** to identify patterns

## TypeScript

All types are fully typed. Import types:

```tsx
import type {
  ErrorReport,
  ErrorProvider,
  ErrorReporterConfig,
  ErrorFeedback,
  ErrorSeverity,
  ErrorStats,
} from '@chat-ui/react'
```

## License

MIT
