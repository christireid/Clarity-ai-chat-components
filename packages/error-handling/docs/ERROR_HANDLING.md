# Error Handling Guide

Comprehensive guide to error handling in Clarity Chat React Component Library.

## Table of Contents

- [Overview](#overview)
- [Error Classes](#error-classes)
- [Error Factory Functions](#error-factory-functions)
- [Components](#components)
- [Hooks](#hooks)
- [Best Practices](#best-practices)
- [Integration Guide](#integration-guide)

## Overview

Clarity Chat provides a comprehensive error handling system with:

- **10 specialized error classes** with helpful context
- **Factory functions** for consistent error creation
- **ErrorBoundary component** for catching React errors
- **5 custom hooks** for different error handling scenarios
- **Automatic retry logic** with exponential backoff
- **Developer-friendly messages** with solutions and documentation links

## Error Classes

### ClarityChatError (Base Class)

Base class for all Clarity Chat errors.

```typescript
import { ClarityChatError } from '@claritychat/react'

throw new ClarityChatError('Something went wrong', {
  code: 'CUSTOM_ERROR',
  solution: 'Try doing X',
  docs: 'https://docs.claritychat.dev/errors#custom',
  context: { userId: '123', action: 'delete' },
})
```

**Properties:**
- `code: string` - Error code for identification
- `solution?: string` - Suggested fix for the error
- `docs?: string` - Link to documentation
- `context?: Record<string, any>` - Additional context data

### ConfigurationError

Thrown when component configuration is invalid or incomplete.

```typescript
import { ConfigurationError } from '@claritychat/react'

throw new ConfigurationError('Missing API endpoint', {
  code: 'MISSING_API_ENDPOINT',
  solution: 'Add apiEndpoint prop: <ChatContainer apiEndpoint="/api/chat" />',
})
```

**Common Scenarios:**
- Missing required props
- Invalid configuration values
- Malformed configuration objects

### APIError

Thrown when API requests fail.

```typescript
import { APIError } from '@claritychat/react'

throw new APIError('Request failed', {
  code: 'API_REQUEST_FAILED',
  statusCode: 500,
  solution: 'Check your API endpoint and server logs',
  context: { endpoint: '/api/chat', method: 'POST' },
})
```

**Additional Properties:**
- `statusCode?: number` - HTTP status code

### AuthenticationError

Thrown when authentication fails.

```typescript
import { AuthenticationError } from '@claritychat/react'

throw new AuthenticationError('Invalid API key', {
  code: 'INVALID_API_KEY',
  solution: 'Check that your API key is correct and has not expired',
})
```

### RateLimitError

Thrown when rate limits are exceeded.

```typescript
import { RateLimitError } from '@claritychat/react'

throw new RateLimitError('Rate limit exceeded', {
  code: 'RATE_LIMIT_EXCEEDED',
  retryAfter: 60,
  limit: 100,
  solution: 'Wait 60 seconds before making another request',
})
```

**Additional Properties:**
- `retryAfter?: number` - Seconds to wait before retry
- `limit?: number` - Rate limit threshold
- `remaining?: number` - Remaining requests

### ValidationError

Thrown when input validation fails.

```typescript
import { ValidationError } from '@claritychat/react'

throw new ValidationError('Invalid email format', {
  code: 'INVALID_FORMAT',
  field: 'email',
  value: 'not-an-email',
  expected: 'email format',
})
```

**Additional Properties:**
- `field?: string` - Field that failed validation
- `value?: any` - Invalid value provided
- `expected?: string` - Expected format/type

### StreamError

Thrown when streaming connections fail.

```typescript
import { StreamError } from '@claritychat/react'

throw new StreamError('Connection lost', {
  code: 'STREAM_CONNECTION_LOST',
  solution: 'The connection will automatically retry',
})
```

### TokenLimitError

Thrown when message or context exceeds token limits.

```typescript
import { TokenLimitError } from '@claritychat/react'

throw new TokenLimitError('Message too long', {
  code: 'MESSAGE_TOO_LONG',
  limit: 4096,
  actual: 5000,
  solution: 'Reduce message length to 4096 tokens or less',
})
```

**Additional Properties:**
- `limit?: number` - Maximum token limit
- `actual?: number` - Actual token count

### NetworkError

Thrown when network connectivity fails.

```typescript
import { NetworkError } from '@claritychat/react'

throw new NetworkError('Connection failed', {
  code: 'CONNECTION_FAILED',
  solution: 'Check your internet connection',
})
```

### TimeoutError

Thrown when requests timeout.

```typescript
import { TimeoutError } from '@claritychat/react'

throw new TimeoutError('Request timed out', {
  code: 'REQUEST_TIMEOUT',
  timeout: 5000,
  solution: 'Try increasing the timeout or check your network',
})
```

**Additional Properties:**
- `timeout?: number` - Timeout duration in milliseconds

### ComponentError

Thrown when component lifecycle issues occur.

```typescript
import { ComponentError } from '@claritychat/react'

throw new ComponentError('Component mount failed', {
  code: 'COMPONENT_MOUNT_FAILED',
  componentName: 'ChatContainer',
})
```

**Additional Properties:**
- `componentName?: string` - Name of the component

## Error Factory Functions

Factory functions provide a consistent way to create errors with pre-configured messages and solutions.

### Configuration Errors

```typescript
import { createConfigError } from '@claritychat/react'

// Missing API endpoint
throw createConfigError.missingApiEndpoint()

// Invalid model
throw createConfigError.invalidModel('gpt-5', ['gpt-3.5-turbo', 'gpt-4'])

// Missing API key
throw createConfigError.missingApiKey()

// Invalid configuration
throw createConfigError.invalidConfiguration('maxTokens', 'not-a-number', 'number')

// Missing required prop
throw createConfigError.missingRequiredProp('apiEndpoint', 'ChatContainer')
```

### API Errors

```typescript
import { createApiError } from '@claritychat/react'

// Request failed
throw createApiError.requestFailed('/api/chat', 500, 'Internal Server Error')

// Invalid response
throw createApiError.invalidResponse('/api/chat', 'Missing content field')

// Server error
throw createApiError.serverError('/api/chat', 503)

// Not found
throw createApiError.notFound('/api/unknown')
```

### Authentication Errors

```typescript
import { createAuthError } from '@claritychat/react'

// Missing API key
throw createAuthError.missingApiKey()

// Invalid API key
throw createAuthError.invalidApiKey()

// Insufficient permissions
throw createAuthError.insufficientPermissions('delete')
```

### Network Errors

```typescript
import { createNetworkError } from '@claritychat/react'

// Connection failed
throw createNetworkError.connectionFailed('/api/chat')

// Request timeout
throw createNetworkError.requestTimeout('/api/chat', 5000)

// Offline
throw createNetworkError.offline()

// DNS lookup failed
throw createNetworkError.dnsLookupFailed('api.example.com')
```

### Validation Errors

```typescript
import { createValidationError } from '@claritychat/react'

// Invalid input
throw createValidationError.invalidInput('email', 'not-email', 'email format')

// Required field
throw createValidationError.requiredField('username')

// Value too long
throw createValidationError.valueTooLong('message', 1000, 1500)

// Invalid format
throw createValidationError.invalidFormat('phone', 'XXX-XXX-XXXX')
```

### Stream Errors

```typescript
import { createStreamError } from '@claritychat/react'

// Connection lost
throw createStreamError.connectionLost()

// Malformed data
throw createStreamError.malformedData('invalid json')

// Stream aborted
throw createStreamError.streamAborted()

// Stream timeout
throw createStreamError.streamTimeout(10000)
```

## Components

### ErrorBoundary

Catches errors in child components and displays a fallback UI.

```typescript
import { ErrorBoundary } from '@claritychat/react'

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div>
          <h1>Error: {error.message}</h1>
          <button onClick={resetError}>Try Again</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        console.error('Error caught:', error, errorInfo)
      }}
      onReset={() => {
        console.log('Error boundary reset')
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  )
}
```

**Props:**
- `children: ReactNode` - Components to render
- `fallback?: (props) => ReactNode` - Custom error UI
- `onError?: (error, errorInfo) => void` - Error callback
- `onReset?: () => void` - Reset callback

## Hooks

### useErrorHandler

Central error handler with logging and notifications.

```typescript
import { useErrorHandler } from '@claritychat/react'

function MyComponent() {
  const { handleError } = useErrorHandler({
    logErrors: true,
    showToast: true,
    onError: (error) => {
      // Send to error tracking service
      Sentry.captureException(error)
    },
  })

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error('Request failed')
      return response.json()
    } catch (error) {
      handleError(error)
    }
  }

  return <button onClick={fetchData}>Fetch Data</button>
}
```

### useAsyncError

Handles async operations with automatic retry logic.

```typescript
import { useAsyncError } from '@claritychat/react'

function MyComponent() {
  const { executeAsync, isLoading, error, retryCount } = useAsyncError()

  const fetchData = async () => {
    const result = await executeAsync(
      async () => {
        const res = await fetch('/api/data')
        if (!res.ok) throw new Error('Request failed')
        return res.json()
      },
      {
        maxRetries: 3,
        retryDelay: 1000,
        onError: (error) => console.error('Failed:', error),
        onSuccess: () => console.log('Success!'),
      }
    )

    if (result) {
      console.log('Data:', result)
    }
  }

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      {retryCount > 0 && <p>Retry attempt {retryCount}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
```

### useErrorBoundary

Programmatically throw errors to error boundaries.

```typescript
import { useErrorBoundary } from '@claritychat/react'

function MyComponent() {
  const { showBoundary } = useErrorBoundary()

  const handleCriticalError = () => {
    showBoundary(new Error('Critical failure!'))
  }

  return <button onClick={handleCriticalError}>Trigger Error</button>
}
```

### useErrorRecovery

Manage custom recovery strategies for different error types.

```typescript
import { useErrorRecovery } from '@claritychat/react'

function MyComponent() {
  const { registerStrategy, recover, isRecovering } = useErrorRecovery()

  useEffect(() => {
    // Register recovery strategies
    registerStrategy('API_ERROR', async () => {
      await reconnectToAPI()
    })

    registerStrategy('AUTH_ERROR', async () => {
      await refreshToken()
    })
  }, [registerStrategy])

  const handleError = async (errorType: string) => {
    const success = await recover(errorType)
    if (success) {
      console.log('Recovery successful')
    }
  }

  return (
    <div>
      {isRecovering && <p>Recovering...</p>}
      <button onClick={() => handleError('API_ERROR')}>
        Recover from API Error
      </button>
    </div>
  )
}
```

### useErrorToast

Manage toast notifications for errors.

```typescript
import { useErrorToast } from '@claritychat/react'

function MyComponent() {
  const { toasts, showToast, hideToast, clearAll } = useErrorToast()

  const handleError = () => {
    showToast('Something went wrong!', 'error', 5000)
  }

  return (
    <div>
      <button onClick={handleError}>Trigger Error Toast</button>
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
            <button onClick={() => hideToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Best Practices

### 1. Use Specific Error Classes

```typescript
// ❌ Bad
throw new Error('Invalid configuration')

// ✅ Good
throw new ConfigurationError('Missing API endpoint', {
  code: 'MISSING_API_ENDPOINT',
  solution: 'Add apiEndpoint prop to your component',
})
```

### 2. Provide Helpful Context

```typescript
throw new APIError('Request failed', {
  code: 'API_REQUEST_FAILED',
  statusCode: 500,
  solution: 'Check your API endpoint and server logs',
  context: {
    endpoint: '/api/chat',
    method: 'POST',
    timestamp: Date.now(),
  },
})
```

### 3. Use Error Factories

```typescript
// ❌ Bad
throw new ConfigurationError('Missing apiEndpoint', { code: 'MISSING_API_ENDPOINT' })

// ✅ Good
throw createConfigError.missingApiEndpoint()
```

### 4. Wrap Critical Code in ErrorBoundary

```typescript
<ErrorBoundary>
  <CriticalComponent />
</ErrorBoundary>
```

### 5. Use Retry Logic for Transient Failures

```typescript
const { executeAsync } = useAsyncError()

await executeAsync(fetchData, {
  maxRetries: 3,
  retryDelay: 1000,
})
```

### 6. Log Errors in Production

```typescript
const { handleError } = useErrorHandler({
  onError: (error) => {
    if (process.env.NODE_ENV === 'production') {
      Sentry.captureException(error)
    }
  },
})
```

## Integration Guide

### Basic Setup

```typescript
import { ErrorBoundary, useErrorHandler } from '@claritychat/react'

function App() {
  return (
    <ErrorBoundary>
      <ChatApp />
    </ErrorBoundary>
  )
}

function ChatApp() {
  const { handleError } = useErrorHandler({ logErrors: true })

  // Use handleError throughout your app
  return <YourComponents />
}
```

### With Error Tracking Services

```typescript
import * as Sentry from '@sentry/react'

Sentry.init({ dsn: 'your-dsn' })

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        Sentry.captureException(error, {
          contexts: { react: errorInfo },
        })
      }}
    >
      <ChatApp />
    </ErrorBoundary>
  )
}
```

### With Custom UI

```typescript
function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-container">
          <h1>Oops! Something went wrong</h1>
          <p>{error.message}</p>
          {error instanceof ClarityChatError && error.solution && (
            <div className="solution">
              <strong>💡 Solution:</strong>
              <p>{error.solution}</p>
            </div>
          )}
          <button onClick={resetError}>Try Again</button>
        </div>
      )}
    >
      <ChatApp />
    </ErrorBoundary>
  )
}
```

## Next Steps

- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common error solutions
- Check out [Storybook](https://storybook.claritychat.dev) for interactive examples
- Read the [API Reference](../README.md) for detailed component documentation
