# Error Handling Migration Guide: v1 to v2

This guide helps you migrate from the legacy error handling API (v1) to the new enhanced error
handling system (v2).

## Overview of Changes

The v2 error handling system introduces:

- **Type-safe error codes** with compile-time validation
- **Abstract base class** `ClarityError` with proper prototype chain handling
- **Provider-specific errors** with auto-detection from API responses
- **Enhanced React error boundaries** using `react-error-boundary` v5
- **Streaming error handling** with circuit breaker and retry logic
- **Stream resumption** for partial content recovery
- **Structured logging** with backpressure support

## Quick Migration Reference

| v1 (Legacy)        | v2 (New)                  |
| ------------------ | ------------------------- |
| `ClarityChatError` | `ClarityError` (abstract) |
| `APIError`         | `ApiError`                |
| `StreamError`      | `StreamingError`          |
| `ValidationError`  | `EnhancedValidationError` |
| N/A                | `ProviderError`           |
| `ErrorBoundary`    | `EnhancedErrorBoundary`   |
| `useErrorHandler`  | `useEnhancedErrorHandler` |
| N/A                | `useStreamingError`       |

## Error Classes Migration

### Before (v1)

```typescript
import { APIError, StreamError, ValidationError } from '@clarity-chat/error-handling'

// Creating errors manually
throw new APIError('Request failed', {
  code: 'API_ERROR',
  statusCode: 500,
  solution: 'Try again later',
})

throw new StreamError('Connection lost', {
  code: 'STREAM_ERROR',
})

throw new ValidationError('Invalid input', {
  field: 'email',
  value: 'not-an-email',
})
```

### After (v2)

```typescript
import {
  ApiError,
  ApiErrorCode,
  StreamingError,
  EnhancedValidationError,
  ProviderError,
} from '@clarity-chat/error-handling'

// Type-safe error codes with factory methods
throw new ApiError('Request failed', {
  code: ApiErrorCode.SERVER_ERROR,
  statusCode: 500,
})

// Or use static factory methods
throw ApiError.fromResponse(response)
throw ApiError.timeout('/api/chat', 30000)
throw ApiError.networkError(originalError)

// Streaming errors with partial content preservation
throw StreamingError.connectionLost('sse', {
  partialContent: 'The partial response...',
  lastEventId: 'evt_123',
})

// Field-level validation errors
throw EnhancedValidationError.required('email')
throw EnhancedValidationError.invalidFormat('email', 'user@example')
throw EnhancedValidationError.tooLong('message', 10000, 5000)

// Provider-specific errors with auto-detection
throw ProviderError.fromProviderResponse('openai', 429, errorBody, 'gpt-4')
throw ProviderError.rateLimit('anthropic', 30)
throw ProviderError.contextLengthExceeded('openai', 128000, 150000)
```

## Type Guards Migration

### Before (v1)

```typescript
// Manual type checking
if (error instanceof APIError) {
  console.log(error.statusCode)
}
```

### After (v2)

```typescript
import {
  isApiError,
  isStreamingError,
  isProviderError,
  isValidationError,
  isRecoverableError,
  isRateLimitError,
  getErrorStatusCode,
  getUserMessage,
} from '@clarity-chat/error-handling'

// Type guards
if (isApiError(error)) {
  console.log(error.endpoint, error.statusCode)
}

if (isStreamingError(error)) {
  console.log(error.transport, error.partialContent)
}

if (isProviderError(error)) {
  console.log(error.provider, error.retryAfter)
}

// Utility type guards
if (isRecoverableError(error)) {
  // Show retry button
}

if (isRateLimitError(error)) {
  // Show countdown timer
}

// Utility functions
const status = getErrorStatusCode(error) // Works with any error type
const message = getUserMessage(error) // User-friendly message
```

## Error Boundary Migration

### Before (v1)

```tsx
import { ErrorBoundary } from '@clarity-chat/error-handling'

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div>
          <p>{error.message}</p>
          <button onClick={resetError}>Retry</button>
        </div>
      )}
      onError={(error, errorInfo) => {
        logToService(error)
      }}
    >
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### After (v2)

```tsx
import {
  EnhancedErrorBoundary,
  ChatErrorBoundary,
  useErrorBoundary,
} from '@clarity-chat/error-handling'

// General enhanced boundary
function App() {
  return (
    <EnhancedErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div>
          <p>{error.message}</p>
          <button onClick={resetErrorBoundary}>Retry</button>
        </div>
      )}
      onError={(error, info) => logToService(error)}
      onReset={() => console.log('Reset!')}
      resetKeys={[userId]} // Auto-reset when these change
      enableLogging={true}
    >
      <MyComponent />
    </EnhancedErrorBoundary>
  )
}

// Chat-specific boundary with streaming support
function ChatApp() {
  return (
    <ChatErrorBoundary
      chatId={chatId}
      provider="openai"
      onError={(error) => logChatError(error)}
      onRetry={() => reconnect()}
    >
      <ChatWindow />
    </ChatErrorBoundary>
  )
}

// Programmatic error boundary control
function MyComponent() {
  const { showBoundary } = useErrorBoundary()

  const handleAsyncError = async () => {
    try {
      await riskyOperation()
    } catch (error) {
      showBoundary(error) // Triggers nearest ErrorBoundary
    }
  }
}
```

## Hooks Migration

### Before (v1)

```typescript
import { useErrorHandler } from '@clarity-chat/error-handling'

function MyComponent() {
  const { handleError } = useErrorHandler({
    logErrors: true,
    onError: (error) => toast.error(error.message),
  })

  const fetchData = async () => {
    try {
      const data = await api.fetch()
      return data
    } catch (error) {
      handleError(error)
    }
  }
}
```

### After (v2)

```typescript
import {
  useEnhancedErrorHandler,
  useStreamingError,
} from '@clarity-chat/error-handling'

// Enhanced error handler with async support
function MyComponent() {
  const {
    handleError,
    handleAsync,
    withErrorHandling,
    clearError,
    error,
    hasError,
    isRecoverable,
  } = useEnhancedErrorHandler({
    onError: (error) => toast.error(error.message),
    showBoundary: false,
    logInDev: true,
  })

  // Automatic error handling for promises
  const data = await handleAsync(api.fetch())

  // Wrap functions with error handling
  const safeFetch = withErrorHandling(api.fetch)
  await safeFetch()

  // Show error UI
  if (hasError) {
    return (
      <div>
        <p>{error.message}</p>
        {isRecoverable && <button onClick={clearError}>Retry</button>}
      </div>
    )
  }
}

// Streaming-specific error handling
function StreamingChat() {
  const {
    handleStreamError,
    retry,
    resumeStream,
    setRetryCallback,
    error,
    canRetry,
    canResume,
    isRetrying,
    retryAfterMs,
    circuitState,
  } = useStreamingError({
    maxRetries: 3,
    retryDelay: 1000,
    jitterFactor: 0.3,
    circuitBreakerThreshold: 5,
    onRetry: (attempt) => console.log(`Retry ${attempt}`),
    onCircuitOpen: () => console.log('Circuit breaker opened'),
  })

  // Register retry callback
  useEffect(() => {
    setRetryCallback(async (resumePayload) => {
      await connectToStream(resumePayload)
    })
  }, [setRetryCallback])

  // Handle streaming errors
  const connect = async () => {
    try {
      await connectToStream()
    } catch (err) {
      handleStreamError(err, {
        partialContent: currentContent,
        lastEventId: lastId,
      })
    }
  }

  // Show appropriate UI
  if (circuitState === 'open') {
    return <p>Service temporarily unavailable</p>
  }

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        {canResume && <button onClick={() => resumeStream()}>Continue</button>}
        {canRetry && !canResume && (
          <button onClick={retry} disabled={isRetrying}>
            {isRetrying ? `Retrying in ${retryAfterMs}ms...` : 'Retry'}
          </button>
        )}
      </div>
    )
  }
}
```

## API Handler Migration

### Before (v1)

```typescript
// Manual error handling in API routes
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await processChat(body)
    return Response.json({ data: result })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

### After (v2)

```typescript
import {
  apiHandler,
  streamingApiHandler,
  successResponse,
  errorResponse,
} from '@clarity-chat/error-handling'

// Wrapped API handler with automatic error handling
export const POST = apiHandler(async (request, context) => {
  const body = await request.json()
  const result = await processChat(body)
  return successResponse(result)
})

// Streaming API handler for SSE
export const POST = streamingApiHandler(async (request) => {
  const body = await request.json()
  const stream = await createChatStream(body)
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
})
```

## Error Logging Migration

### Before (v1)

```typescript
// Manual console logging
console.error('Error occurred:', error)
```

### After (v2)

```typescript
import {
  createErrorLogger,
  configureErrorLogger,
  logError,
  logWarning,
  logInfo,
} from '@clarity-chat/error-handling'

// Configure global logger
configureErrorLogger({
  endpoint: 'https://logs.example.com/errors',
  apiKey: process.env.LOGGING_API_KEY,
  batchSize: 10,
  flushInterval: 5000,
  maxQueueSize: 1000,
  backpressureStrategy: 'drop-oldest',
  onDropped: (count, reason) => console.warn(`Dropped ${count} logs: ${reason}`),
  transform: (entry) => ({
    ...entry,
    context: { ...entry.context, environment: 'production' },
  }),
  filter: (entry) => entry.level !== 'info', // Only log errors and warnings
})

// Use convenience functions
logError(error, {
  context: { action: 'sendMessage' },
  user: { id: userId },
  request: { url: '/api/chat', method: 'POST' },
})

logWarning(deprecationError)
logInfo(operationError)

// Or create custom logger
const chatLogger = createErrorLogger({
  endpoint: 'https://logs.example.com/chat-errors',
  batchSize: 5,
})

chatLogger.error(error, { context: { chatId } })
await chatLogger.flush() // Manual flush
```

## Breaking Changes

### 1. Error Code Types

Error codes are now typed constants instead of strings:

```typescript
// v1: Any string accepted
new APIError('Error', { code: 'any_string' })

// v2: Must use typed constants
import { ApiErrorCode } from '@clarity-chat/error-handling'
new ApiError('Error', { code: ApiErrorCode.SERVER_ERROR })
```

### 2. ErrorBoundary Props

The `EnhancedErrorBoundary` uses different prop names:

```typescript
// v1
<ErrorBoundary fallback={...} onError={...} />

// v2
<EnhancedErrorBoundary FallbackComponent={...} onError={...} onReset={...} />
```

### 3. useErrorHandler Return Values

The hook now returns additional properties:

```typescript
// v1
const { handleError } = useErrorHandler()

// v2
const {
  handleError,
  handleAsync, // New
  withErrorHandling, // New
  clearError, // New
  error, // New
  hasError, // New
  isRecoverable, // New
} = useEnhancedErrorHandler()
```

## Backward Compatibility

The legacy classes are still available but marked as deprecated:

```typescript
// These still work but show deprecation warnings
import {
  ClarityChatError, // @deprecated - use ClarityError
  APIError, // @deprecated - use ApiError
  StreamError, // @deprecated - use StreamingError
  ValidationError, // @deprecated - use EnhancedValidationError
} from '@clarity-chat/error-handling'
```

## Recommended Migration Steps

1. **Update imports** to use new error classes
2. **Replace error codes** with typed constants
3. **Update ErrorBoundary** to use `EnhancedErrorBoundary` or `ChatErrorBoundary`
4. **Migrate hooks** to `useEnhancedErrorHandler` and `useStreamingError`
5. **Configure error logging** with the new logger
6. **Add type guards** for better error handling
7. **Test** all error paths thoroughly

## Need Help?

- Check the [Error Handling Documentation](./ERROR_HANDLING.md)
- See the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- Review the Storybook examples for interactive demos
