# 🛡️ Error Handling Guide

> **Build robust, resilient chat applications with comprehensive error recovery**

---

## 📚 Overview

Clarity Chat provides a complete error handling system designed for production applications:

- 🔄 **Automatic Retry Logic** - Exponential backoff for transient failures
- 🛡️ **Error Boundaries** - Catch and recover from React errors
- 📊 **Error Tracking Integration** - Sentry, Rollbar, Bugsnag, LogRocket
- 💬 **User-Friendly Messages** - Convert technical errors to readable messages
- 🎯 **Typed Errors** - 10+ specialized error classes
- ⚡ **Recovery Strategies** - Reload, fallback, or retry
- 📱 **Toast Notifications** - Inform users without disruption

---

## 🚀 Quick Start

### Basic Error Handling

```tsx
import { ErrorBoundary } from '@clarity-chat/react'

function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    >
      <ChatWindow {...props} />
    </ErrorBoundary>
  )
}
```

---

## 🎯 Error Types

### Built-in Error Classes

Clarity Chat includes 10 specialized error types:

```typescript
// Network errors
throw new NetworkError('Failed to connect to API')

// API errors
throw new APIError('Rate limit exceeded', { statusCode: 429 })

// Validation errors
throw new ValidationError('Message too long', { 
  field: 'content',
  maxLength: 4000 
})

// Authentication errors
throw new AuthenticationError('Session expired')

// Configuration errors
throw new ConfigurationError('API key missing')

// Timeout errors
throw new TimeoutError('Request took too long', { timeout: 30000 })

// Rate limit errors
throw new RateLimitError('Too many requests', { 
  retryAfter: 60,
  limit: 100 
})

// Streaming errors
throw new StreamError('Connection interrupted')

// Context errors
throw new ContextError('Document too large', { 
  size: 5000000,
  limit: 1000000 
})

// General application errors
throw new AppError('Unexpected error occurred')
```

---

## 🧩 Components

### ErrorBoundary

Catches React component errors and displays fallback UI:

```tsx
import { ErrorBoundary } from '@clarity-chat/react'

function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="error-page">
          <h1>Oops!</h1>
          <p>{error.message}</p>
          <button onClick={reset}>Reload Chat</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error('Caught error:', error, errorInfo)
      }}
    >
      <ChatWindow {...props} />
    </ErrorBoundary>
  )
}
```

### ErrorBoundaryEnhanced

Advanced error boundary with retry and recovery options:

```tsx
import { ErrorBoundaryEnhanced } from '@clarity-chat/react'

function App() {
  return (
    <ErrorBoundaryEnhanced
      maxRetries={3}
      retryDelay={1000}
      onRetry={(attempt) => {
        console.log(`Retry attempt ${attempt}`)
      }}
      fallback={(error, reset, retry, attempts) => (
        <div className="error-card">
          <h2>Error Occurred</h2>
          <p>{error.message}</p>
          <div className="actions">
            <button onClick={retry} disabled={attempts >= 3}>
              Retry ({attempts}/3)
            </button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>
      )}
    >
      <ChatWindow {...props} />
    </ErrorBoundaryEnhanced>
  )
}
```

---

## 🪝 Hooks

### useErrorRecovery

Automatic retry logic with exponential backoff:

```tsx
import { useErrorRecovery } from '@clarity-chat/react'

function ChatWindow() {
  const { executeWithRetry, isRetrying, attempts } = useErrorRecovery({
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  })

  const sendMessage = async (content: string) => {
    try {
      const response = await executeWithRetry(async () => {
        return await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ content }),
        })
      })

      const data = await response.json()
      // Handle success
    } catch (error) {
      // All retries exhausted
      console.error('Failed after retries:', error)
    }
  }

  return (
    <div>
      {isRetrying && <p>Retrying... (Attempt {attempts})</p>}
      {/* Your chat UI */}
    </div>
  )
}
```

### useErrorHandler

Centralized error handling:

```tsx
import { useErrorHandler } from '@clarity-chat/react'

function ChatWindow() {
  const { handleError, error, clearError } = useErrorHandler({
    onError: (error) => {
      // Log to analytics
      console.error('Error occurred:', error)
    },
  })

  const sendMessage = async (content: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new APIError('Failed to send message', { 
          statusCode: response.status 
        })
      }
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <div>
      {error && (
        <div className="error-banner">
          <p>{error.message}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
      {/* Your chat UI */}
    </div>
  )
}
```

### useAsyncError

Handle async errors in components:

```tsx
import { useAsyncError } from '@clarity-chat/react'

function ChatWindow() {
  const throwError = useAsyncError()

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (!response.ok) {
        // This will be caught by ErrorBoundary
        throwError(new NetworkError('Failed to load messages'))
      }
      return await response.json()
    } catch (error) {
      throwError(error)
    }
  }

  return <MessageList onLoad={loadMessages} />
}
```

### useErrorToast

Display error notifications:

```tsx
import { useErrorToast } from '@clarity-chat/react'

function ChatWindow() {
  const { showError, showSuccess } = useErrorToast({
    position: 'top-right',
    duration: 5000,
  })

  const sendMessage = async (content: string) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      showSuccess('Message sent!')
    } catch (error) {
      showError(error.message)
    }
  }

  return <ChatInput onSend={sendMessage} />
}
```

---

## 📖 Common Patterns

### Pattern 1: Network Error Handling

Handle network failures gracefully:

```tsx
import { useErrorRecovery, NetworkError } from '@clarity-chat/react'

function ChatWindow() {
  const [isOnline, setIsOnline] = useState(true)
  const { executeWithRetry } = useErrorRecovery({
    maxRetries: 3,
    onRetry: (attempt) => {
      console.log(`Network retry attempt ${attempt}`)
    },
  })

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const sendMessage = async (content: string) => {
    if (!isOnline) {
      throw new NetworkError('No internet connection')
    }

    return await executeWithRetry(async () => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new NetworkError(`HTTP ${response.status}`)
      }

      return response.json()
    })
  }

  return (
    <>
      {!isOnline && (
        <div className="offline-banner">
          ⚠️ You're offline. Messages will be sent when connection is restored.
        </div>
      )}
      <ChatInput onSend={sendMessage} />
    </>
  )
}
```

### Pattern 2: Rate Limiting

Handle API rate limits:

```tsx
import { useErrorRecovery, RateLimitError } from '@clarity-chat/react'

function ChatWindow() {
  const [rateLimitInfo, setRateLimitInfo] = useState(null)
  
  const { executeWithRetry } = useErrorRecovery({
    maxRetries: 2,
    shouldRetry: (error, attempt) => {
      if (error instanceof RateLimitError) {
        // Wait for rate limit to reset
        return attempt < 2
      }
      return true
    },
    getRetryDelay: (attempt, error) => {
      if (error instanceof RateLimitError && error.retryAfter) {
        return error.retryAfter * 1000 // Convert to ms
      }
      return Math.min(1000 * Math.pow(2, attempt), 10000)
    },
  })

  const sendMessage = async (content: string) => {
    try {
      const response = await executeWithRetry(async () => {
        const res = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ content }),
        })

        if (res.status === 429) {
          const retryAfter = parseInt(res.headers.get('Retry-After') || '60')
          throw new RateLimitError('Rate limit exceeded', { retryAfter })
        }

        return res.json()
      })

      setRateLimitInfo(null)
      return response
    } catch (error) {
      if (error instanceof RateLimitError) {
        setRateLimitInfo({
          message: error.message,
          retryAfter: error.retryAfter,
        })
      }
      throw error
    }
  }

  return (
    <>
      {rateLimitInfo && (
        <div className="rate-limit-notice">
          ⏱️ {rateLimitInfo.message}. 
          Try again in {rateLimitInfo.retryAfter} seconds.
        </div>
      )}
      <ChatInput onSend={sendMessage} />
    </>
  )
}
```

### Pattern 3: Timeout Handling

Set request timeouts:

```tsx
import { useErrorRecovery, TimeoutError } from '@clarity-chat/react'

function ChatWindow() {
  const { executeWithRetry } = useErrorRecovery()

  const sendMessageWithTimeout = async (content: string, timeout = 30000) => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await executeWithRetry(async () => {
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ content }),
            signal: controller.signal,
          })
          return await res.json()
        } catch (error) {
          if (error.name === 'AbortError') {
            throw new TimeoutError('Request timed out', { timeout })
          }
          throw error
        }
      })

      return response
    } finally {
      clearTimeout(timeoutId)
    }
  }

  return <ChatInput onSend={sendMessageWithTimeout} />
}
```

### Pattern 4: Validation Errors

Handle input validation:

```tsx
import { ValidationError } from '@clarity-chat/react'

function ChatInput() {
  const [error, setError] = useState<string | null>(null)

  const validateAndSend = async (content: string) => {
    setError(null)

    try {
      // Validate input
      if (!content.trim()) {
        throw new ValidationError('Message cannot be empty')
      }

      if (content.length > 4000) {
        throw new ValidationError('Message too long', {
          field: 'content',
          maxLength: 4000,
          currentLength: content.length,
        })
      }

      // Send message
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.message)
      } else {
        throw err // Let error boundary handle it
      }
    }
  }

  return (
    <div>
      {error && <p className="error-message">{error}</p>}
      <textarea onSubmit={(e) => validateAndSend(e.target.value)} />
    </div>
  )
}
```

---

## 🔌 Error Tracking Integration

### Sentry Integration

```tsx
import * as Sentry from '@sentry/react'
import { ErrorBoundary } from '@clarity-chat/react'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        Sentry.captureException(error, {
          contexts: { react: errorInfo },
        })
      }}
    >
      <ChatWindow {...props} />
    </ErrorBoundary>
  )
}
```

### Custom Error Reporter

```tsx
import { ErrorBoundary } from '@clarity-chat/react'

function reportError(error: Error, errorInfo: any) {
  // Send to your backend
  fetch('/api/errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }),
  })
}

function App() {
  return (
    <ErrorBoundary onError={reportError}>
      <ChatWindow {...props} />
    </ErrorBoundary>
  )
}
```

---

## 🎨 Error UI Components

### Inline Error Message

```tsx
function InlineError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="inline-error">
      <span className="error-icon">⚠️</span>
      <p className="error-text">{error.message}</p>
      <button onClick={onRetry} className="retry-button">
        Retry
      </button>
    </div>
  )
}
```

### Full-Page Error

```tsx
function FullPageError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1>Something went wrong</h1>
        <p className="error-message">{error.message}</p>
        <div className="error-actions">
          <button onClick={reset} className="primary">
            Try Again
          </button>
          <button onClick={() => window.location.href = '/'} className="secondary">
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Toast Notification

```tsx
import { Toast } from '@clarity-chat/react'

function ErrorToast({ error, onClose }: { error: Error; onClose: () => void }) {
  return (
    <Toast variant="error" onClose={onClose} duration={5000}>
      <div className="toast-content">
        <strong>Error</strong>
        <p>{error.message}</p>
      </div>
    </Toast>
  )
}
```

---

## ♿ Accessibility

### ARIA Announcements

```tsx
function ChatWindow() {
  const [announcement, setAnnouncement] = useState('')
  const { handleError } = useErrorHandler({
    onError: (error) => {
      setAnnouncement(`Error: ${error.message}`)
    },
  })

  return (
    <>
      {/* Screen reader announcements */}
      <div role="alert" aria-live="assertive" className="sr-only">
        {announcement}
      </div>

      {/* Chat UI */}
    </>
  )
}
```

---

## 📊 Best Practices

### ✅ Do's
- Use typed error classes for better debugging
- Implement retry logic for transient failures
- Show user-friendly error messages
- Log errors to tracking services
- Provide recovery options
- Handle network connectivity issues
- Set appropriate timeouts
- Validate user input

### ❌ Don'ts
- Don't swallow errors silently
- Don't show technical stack traces to users
- Don't retry indefinitely
- Don't ignore error contexts
- Don't use generic error messages
- Don't forget to clean up resources
- Don't block the UI during retries

---

## 🔗 Related Documentation

- **[API Reference](../api/components.md)** - Error handling API
- **[Hooks](../api/hooks.md)** - Error handling hooks
- **[Analytics](./analytics.md)** - Track errors in analytics
- **[Streaming](./streaming.md)** - Handle streaming errors

---

**Build resilient applications!** Check out our [Error Handling Examples](../../examples/error-handling/)! 🛡️
