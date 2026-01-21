# Error Handling & Resilience Hooks

Production-ready hooks for automatic error recovery, retry logic, and resilience patterns.

---

## Overview

These hooks implement battle-tested resilience patterns for production AI applications. **Grade A-** error handling according to our audit.

| Hook | Purpose | Pattern |
|------|---------|---------|
| [`useErrorRecovery`](#useerrorrecovery) | Intelligent retry with error classification ⭐ | Exponential backoff |
| [`useRetryWithBackoff`](#useretrywithbackoff) | Simple retry with exponential backoff | Retry pattern |
| [`useCircuitBreaker`](#usecircuitbreaker) | Fail-fast when service is down | Circuit breaker |
| [`useRequestDeduplication`](#userequestdeduplication) | Prevent duplicate requests | Deduplication |

**Quick Start: Automatic retry**
```tsx
const { execute, error, isRetrying, retry } = useErrorRecovery({
  operation: async () => fetch('/api/chat').then(r => r.json()),
  maxAttempts: 3,
})

await execute() // Automatically retries on failure
```

---

## useErrorRecovery

**Production-ready error recovery with intelligent retry logic and error classification.** Automatically retries network failures, rate limits, and server errors with exponential backoff.

### Signature

```typescript
function useErrorRecovery<T>(
  options: UseErrorRecoveryOptions<T>
): UseErrorRecoveryReturn<T>

interface UseErrorRecoveryOptions<T> {
  /** The async operation to execute (required) */
  operation: (...args: unknown[]) => Promise<T>
  /** Max retry attempts (default: 3) */
  maxAttempts?: number
  /** Backoff delays in ms (default: [1000, 3000, 10000]) */
  backoffMs?: number[]
  /** Determine if error is retryable (default: all retryable) */
  shouldRetry?: (error: Error, attempt: number) => boolean
  
  // Callbacks for analytics
  onRetryStart?: (attempt: number) => void
  onRetrySuccess?: (result: T, attempt: number) => void
  onRetryFail?: (error: Error, attempt: number) => void
  onMaxAttemptsReached?: (error: Error) => void
}

interface UseErrorRecoveryReturn<T> {
  /** Execute operation with retry logic */
  execute: (...args: unknown[]) => Promise<T | null>
  /** Manually retry last failed operation */
  retry: () => Promise<T | null>
  /** Current error */
  error: Error | null
  /** Whether operation is currently executing */
  isLoading: boolean
  /** Whether operation is retrying */
  isRetrying: boolean
  /** Current attempt number (0 = not started) */
  attemptNumber: number
  /** Whether can retry */
  canRetry: boolean
  /** User-friendly error message */
  errorMessage: string | null
  /** Error type: 'network' | 'ratelimit' | 'server' | 'auth' | 'unknown' */
  errorType: ErrorType | null
  /** Last successful result */
  data: T | null
  /** Reset state */
  reset: () => void
}
```

### Examples

#### Basic API Retry

```typescript
import { useErrorRecovery } from '@clarity-chat/react/hooks'

function ResilientChat() {
  const {
    execute,
    error,
    errorMessage,
    isLoading,
    isRetrying,
    retry,
    canRetry,
  } = useErrorRecovery({
    operation: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      return response.json()
    },
    maxAttempts: 3,
    backoffMs: [1000, 3000, 10000], // 1s, 3s, 10s
  })

  const handleSend = async (message: string) => {
    const result = await execute(message)
    if (result) {
      console.log('Success:', result)
    }
  }

  return (
    <div>
      {isRetrying && (
        <Alert severity="warning">
          Connection issue. Retrying...
        </Alert>
      )}
      
      {error && (
        <Alert severity="error">
          {errorMessage}
          {canRetry && (
            <button onClick={retry}>Try Again</button>
          )}
        </Alert>
      )}
      
      <ChatInput
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  )
}
```

#### Custom Retry Logic

```typescript
function SmartRetry() {
  const { execute, errorType } = useErrorRecovery({
    operation: sendMessage,
    maxAttempts: 5,
    backoffMs: [1000, 2000, 5000, 10000, 30000],
    shouldRetry: (error, attempt) => {
      // Don't retry auth errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false
      }
      
      // Only retry network errors up to 3 times
      if (error.message.includes('network') && attempt > 3) {
        return false
      }
      
      // Retry rate limits but wait longer
      if (error.message.includes('429')) {
        return attempt <= 5
      }
      
      // Retry server errors (500s)
      if (error.message.includes('500')) {
        return true
      }
      
      return true
    },
  })

  // Error type is automatically classified
  useEffect(() => {
    if (errorType === 'auth') {
      // Redirect to login
      router.push('/login')
    } else if (errorType === 'ratelimit') {
      // Show user-friendly message
      toast.warning('Please slow down. Try again in a moment.')
    }
  }, [errorType])

  return <ChatInterface onSend={execute} />
}
```

#### With Analytics

```typescript
function AnalyticsRetry() {
  const recovery = useErrorRecovery({
    operation: sendMessage,
    onRetryStart: (attempt) => {
      analytics.track('retry_started', { attempt })
      console.log(`Retry attempt ${attempt}`)
    },
    onRetrySuccess: (result, attempt) => {
      analytics.track('retry_succeeded', { attempt })
      toast.success(`Recovered after ${attempt} attempts!`)
    },
    onRetryFail: (error, attempt) => {
      analytics.track('retry_failed', { attempt, error: error.message })
    },
    onMaxAttemptsReached: (error) => {
      analytics.track('max_retries_reached', { error: error.message })
      toast.error('Unable to connect. Please try again later.')
      showSupportDialog()
    },
  })

  return <ChatInterface recovery={recovery} />
}
```

#### OpenAI Streaming with Retry

```typescript
function ResilientOpenAIChat() {
  const {
    execute,
    isRetrying,
    attemptNumber,
  } = useErrorRecovery({
    operation: async (messages: Message[]) => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          stream: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || `HTTP ${response.status}`)
      }

      return response.body
    },
    maxAttempts: 3,
    shouldRetry: (error) => {
      // Retry on network issues and 5xx errors
      return error.message.includes('network') || 
             error.message.includes('500') ||
             error.message.includes('502') ||
             error.message.includes('503')
    },
  })

  return (
    <div>
      {isRetrying && (
        <div>
          Reconnecting (attempt {attemptNumber})...
        </div>
      )}
    </div>
  )
}
```

### When to Use

✅ **Use `useErrorRecovery` for:**
- API request error handling
- Network failure recovery
- Rate limit handling
- Server error retry
- Production resilience

❌ **Don't use for:**
- Simple operations that shouldn't retry
- User input validation errors
- Business logic errors
- Authentication flows (handle separately)

### Error Classification

The hook automatically classifies errors into types:

| Error Type | Examples | User Message |
|------------|----------|--------------|
| `network` | "network error", "fetch failed", "connection" | "Connection lost. Please check your internet." |
| `ratelimit` | "429", "rate limit", "too many requests" | "Too many requests. Please wait a moment." |
| `server` | "500", "502", "503", "504" | "Server error. Please try again in a moment." |
| `auth` | "401", "403", "unauthorized" | "Authentication failed. Please sign in again." |
| `unknown` | Everything else | "Something went wrong. Please try again." |

---

## useRetryWithBackoff

**Simple exponential backoff retry for async operations.** Lower-level primitive without error classification.

### Signature

```typescript
function useRetryWithBackoff(
  options?: UseRetryWithBackoffOptions
): UseRetryWithBackoffReturn

interface UseRetryWithBackoffOptions {
  /** Max retries (default: 3) */
  maxRetries?: number
  /** Base delay in ms (default: 1000) */
  baseDelay?: number
  /** Max delay in ms (default: 30000) */
  maxDelay?: number
  /** Jitter (0-1, default: 0.1) */
  jitter?: number
  /** Callback when retry starts */
  onRetry?: (attempt: number, delay: number, error: Error) => void
}

interface UseRetryWithBackoffReturn {
  /** Execute function with retry logic */
  execute: <T>(fn: () => Promise<T>) => Promise<RetryResult<T>>
  /** Whether currently retrying */
  isRetrying: boolean
  /** Current retry attempt */
  attempt: number
  /** Cancel pending retries */
  cancel: () => void
  /** Last error */
  lastError: Error | null
  /** Reset state */
  reset: () => void
}
```

### Examples

#### Basic Retry

```typescript
import { useRetryWithBackoff } from '@clarity-chat/react/hooks'

function SimpleRetry() {
  const {
    execute,
    isRetrying,
    attempt,
    cancel,
  } = useRetryWithBackoff({
    maxRetries: 3,
    baseDelay: 1000,
    onRetry: (attempt, delay) => {
      console.log(`Retry ${attempt} after ${delay}ms`)
    },
  })

  const handleSubmit = async () => {
    try {
      const { result, attempts, succeeded } = await execute(() => 
        fetch('/api/submit').then(r => r.json())
      )
      
      if (succeeded) {
        toast.success(`Submitted (took ${attempts} attempts)`)
      }
    } catch (error) {
      toast.error('Failed after all retries')
    }
  }

  return (
    <div>
      <button onClick={handleSubmit} disabled={isRetrying}>
        Submit
      </button>
      {isRetrying && (
        <div>
          Retrying... (attempt {attempt})
          <button onClick={cancel}>Cancel</button>
        </div>
      )}
    </div>
  )
}
```

### When to Use

✅ **Use `useRetryWithBackoff` for:**
- Simple retry needs
- When you don't need error classification
- Building custom retry logic
- Low-level operations

❌ **Don't use for:**
- Chat/API (use `useErrorRecovery` instead)
- When you need error classification

---

## useCircuitBreaker

**Fail-fast when a service is down to prevent cascading failures.** Opens circuit after threshold failures, preventing requests until service recovers.

### Signature

```typescript
function useCircuitBreaker(
  options: UseCircuitBreakerOptions
): UseCircuitBreakerReturn

interface UseCircuitBreakerOptions {
  /** Circuit name (for logging) */
  name: string
  /** Failure threshold to open circuit (default: 5) */
  failureThreshold?: number
  /** Success threshold to close circuit (default: 2) */
  successThreshold?: number
  /** Timeout in ms before trying half-open (default: 60000) */
  resetTimeout?: number
  /** Callback when circuit opens */
  onOpen?: (name: string) => void
  /** Callback when circuit closes */
  onClose?: (name: string) => void
  /** Callback when circuit half-opens */
  onHalfOpen?: (name: string) => void
}

interface UseCircuitBreakerReturn {
  /** Execute function through circuit breaker */
  execute: <T>(fn: () => Promise<T>) => Promise<T>
  /** Circuit state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' */
  state: CircuitState
  /** Circuit statistics */
  stats: {
    failures: number
    successes: number
    totalRequests: number
    totalFailures: number
  }
  /** Reset circuit to closed */
  reset: () => void
  /** Whether circuit allows requests */
  isAllowed: boolean
}
```

### Examples

#### API Circuit Breaker

```typescript
import { useCircuitBreaker, isCircuitOpenError } from '@clarity-chat/react/hooks'

function CircuitBreakerAPI() {
  const {
    execute,
    state,
    stats,
    reset,
    isAllowed,
  } = useCircuitBreaker({
    name: 'openai-api',
    failureThreshold: 5, // Open after 5 failures
    successThreshold: 2, // Close after 2 successes
    resetTimeout: 60000, // Try again after 1 minute
    onOpen: () => {
      toast.error('AI service temporarily unavailable')
      analytics.track('circuit_opened', { service: 'openai' })
    },
    onClose: () => {
      toast.success('AI service recovered')
      analytics.track('circuit_closed', { service: 'openai' })
    },
  })

  const handleSend = async (message: string) => {
    try {
      const result = await execute(() => callOpenAI(message))
      return result
    } catch (error) {
      if (isCircuitOpenError(error)) {
        // Circuit is open - use cached responses or fallback
        return getCachedResponse(message)
      }
      throw error
    }
  }

  return (
    <div>
      <div className="circuit-status">
        State: {state}
        {state === 'OPEN' && (
          <span className="error">
            Service unavailable
            <button onClick={reset}>Force Reset</button>
          </span>
        )}
      </div>
      
      <div className="stats">
        <span>Failures: {stats.failures}</span>
        <span>Successes: {stats.successes}</span>
        <span>Total: {stats.totalRequests}</span>
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={!isAllowed}
      />
    </div>
  )
}
```

#### Multiple Service Circuit Breakers

```typescript
function MultiServiceCircuitBreaker() {
  const openai = useCircuitBreaker({ name: 'openai', failureThreshold: 5 })
  const anthropic = useCircuitBreaker({ name: 'anthropic', failureThreshold: 5 })
  const fallback = useCircuitBreaker({ name: 'fallback', failureThreshold: 3 })

  const handleSend = async (message: string) => {
    // Try OpenAI first
    if (openai.isAllowed) {
      try {
        return await openai.execute(() => callOpenAI(message))
      } catch (error) {
        if (!isCircuitOpenError(error)) throw error
        // OpenAI circuit open, try Anthropic
      }
    }

    // Try Anthropic
    if (anthropic.isAllowed) {
      try {
        return await anthropic.execute(() => callAnthropic(message))
      } catch (error) {
        if (!isCircuitOpenError(error)) throw error
        // Anthropic circuit open, try fallback
      }
    }

    // Try fallback service
    if (fallback.isAllowed) {
      return await fallback.execute(() => callFallbackService(message))
    }

    throw new Error('All services unavailable')
  }

  return (
    <div>
      <ServiceStatus name="OpenAI" breaker={openai} />
      <ServiceStatus name="Anthropic" breaker={anthropic} />
      <ServiceStatus name="Fallback" breaker={fallback} />
      <ChatInput onSend={handleSend} />
    </div>
  )
}
```

### When to Use

✅ **Use `useCircuitBreaker` for:**
- External API calls
- Preventing cascading failures
- Multi-service architectures
- Service degradation
- Fail-fast patterns

❌ **Don't use for:**
- User input validation
- Internal operations
- When you need retries (use `useErrorRecovery`)

### Circuit States

```
CLOSED → (failures ≥ threshold) → OPEN
   ↑                                 ↓
   |            (after reset timeout)|
   |                                 ↓
   |                            HALF_OPEN
   |                                 |
   └─ (successes ≥ threshold) ───────┘
```

---

## useRequestDeduplication

**Prevent duplicate requests from double-clicks, React StrictMode, or rapid interactions.** Ensures only one request per key is in-flight.

### Signature

```typescript
function useRequestDeduplication(
  options?: UseRequestDeduplicationOptions
): UseRequestDeduplicationReturn

interface UseRequestDeduplicationOptions {
  /** Debounce delay in ms (default: 0) */
  debounceMs?: number
  /** Callback when request is deduplicated */
  onDedupe?: (key: string) => void
}

interface UseRequestDeduplicationReturn {
  /** Execute request with deduplication */
  execute: <T>(key: string, fn: () => Promise<T>) => Promise<T>
  /** Execute with debounce (waits for quiet period) */
  executeDebounced: <T>(key: string, fn: () => Promise<T>) => Promise<T>
  /** Check if request is pending */
  isPending: (key: string) => boolean
  /** Cancel pending debounced request */
  cancelDebounced: (key: string) => boolean
  /** Statistics */
  stats: {
    totalRequests: number
    deduplicatedRequests: number
    pendingCount: number
  }
  /** Clear all pending state */
  clear: () => void
}
```

### Examples

#### Prevent Double-Click Submission

```typescript
import { useRequestDeduplication } from '@clarity-chat/react/hooks'

function DoubleClickProofChat() {
  const {
    execute,
    isPending,
    stats,
  } = useRequestDeduplication({
    debounceMs: 300, // Wait 300ms of quiet before sending
    onDedupe: () => {
      console.log('Duplicate request blocked')
    },
  })

  const handleSend = async (message: string) => {
    const key = `send-${Date.now()}`
    
    try {
      const result = await execute(key, () => 
        fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message }),
        }).then(r => r.json())
      )
      
      return result
    } catch (error) {
      if (isDebouncedError(error)) {
        // Request was debounced - ignore
        return
      }
      throw error
    }
  }

  return (
    <div>
      <ChatInput
        onSend={handleSend}
        disabled={isPending('send')}
      />
      <div className="stats">
        Prevented: {stats.deduplicatedRequests} duplicate requests
      </div>
    </div>
  )
}
```

#### Message-Based Deduplication

```typescript
function MessageDeduplication() {
  const { execute, isPending } = useRequestDeduplication()

  const handleSend = async (message: string) => {
    // Use message content as key
    const key = createMessageKey(message)
    
    if (isPending(key)) {
      toast.info('This message is already being sent')
      return
    }

    await execute(key, () => sendMessage(message))
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Search with Debounce

```typescript
function DebouncedSearch() {
  const {
    executeDebounced,
    cancelDebounced,
  } = useRequestDeduplication({
    debounceMs: 500, // Wait 500ms of quiet
  })

  const handleSearch = async (query: string) => {
    const key = 'search'
    
    try {
      const results = await executeDebounced(key, () =>
        fetch(`/api/search?q=${query}`).then(r => r.json())
      )
      setResults(results)
    } catch (error) {
      if (isDebouncedError(error)) {
        // Still typing - ignore
        return
      }
      throw error
    }
  }

  const handleClear = () => {
    cancelDebounced('search')
    setResults([])
  }

  return (
    <div>
      <input
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleClear}>Clear</button>
    </div>
  )
}
```

### When to Use

✅ **Use `useRequestDeduplication` for:**
- Preventing double-click submissions
- React StrictMode double-renders
- Search-as-you-type debouncing
- Rapid user interactions
- Form submissions

❌ **Don't use for:**
- Intentional parallel requests
- Different operations

---

## Common Patterns

### Full Resilience Stack

```typescript
function FullResilientChat() {
  // Layer 1: Deduplication (prevent duplicates)
  const dedup = useRequestDeduplication({
    debounceMs: 300,
  })

  // Layer 2: Circuit breaker (fail-fast when down)
  const circuit = useCircuitBreaker({
    name: 'api',
    failureThreshold: 5,
    resetTimeout: 60000,
  })

  // Layer 3: Error recovery (retry with backoff)
  const recovery = useErrorRecovery({
    operation: async (message: string) => {
      return circuit.execute(() =>
        fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message }),
        }).then(r => r.json())
      )
    },
    maxAttempts: 3,
    backoffMs: [1000, 3000, 10000],
  })

  const handleSend = async (message: string) => {
    const key = createMessageKey(message)
    
    // Execute through all layers
    return dedup.execute(key, () => recovery.execute(message))
  }

  return (
    <div>
      {/* Circuit status */}
      {circuit.state === 'OPEN' && (
        <Alert severity="error">Service temporarily unavailable</Alert>
      )}
      
      {/* Retry status */}
      {recovery.isRetrying && (
        <Alert severity="warning">
          Retrying... (attempt {recovery.attemptNumber})
        </Alert>
      )}
      
      {/* Error display */}
      {recovery.error && !recovery.canRetry && (
        <Alert severity="error">{recovery.errorMessage}</Alert>
      )}
      
      <ChatInput onSend={handleSend} />
    </div>
  )
}
```

### Progressive Enhancement

```typescript
function ProgressiveResilience() {
  const recovery = useErrorRecovery({
    operation: sendMessage,
    maxAttempts: 3,
    onMaxAttemptsReached: async (error) => {
      // Escalate to more aggressive retry
      const aggressive = useRetryWithBackoff({
        maxRetries: 5,
        baseDelay: 5000,
        maxDelay: 60000,
      })
      
      try {
        await aggressive.execute(() => sendMessage(lastMessage))
        toast.success('Recovered!')
      } catch {
        // Show offline UI
        showOfflineMode()
      }
    },
  })

  return <ChatInterface recovery={recovery} />
}
```

---

## Troubleshooting

**Retries not working?**
- Check `maxAttempts` is set correctly
- Verify `shouldRetry` returns true
- Check network/error logs

**Circuit breaker stays open?**
- Verify `resetTimeout` is appropriate
- Check service is actually recovering
- Call `reset()` to force close if needed

**Duplicate requests still happening?**
- Increase `debounceMs`
- Use unique keys per request
- Check key generation logic

**Too many retries?**
- Reduce `maxAttempts`
- Add `shouldRetry` logic to skip certain errors
- Use circuit breaker to fail-fast

[See full troubleshooting guide →](../../troubleshooting.md)

---

## Related Hooks

- [Chat Hooks →](./chat.md) - High-level chat with built-in error handling
- [Streaming Hooks →](./streaming.md) - Streaming with automatic reconnection

---

## Best Practices

### 1. Layer Your Resilience

```typescript
// Good: Multiple layers
deduplication → circuit breaker → retry → request

// Bad: Single layer
retry only
```

### 2. Choose Appropriate Retry Counts

```typescript
// Network failures: More retries
useErrorRecovery({ maxAttempts: 5 })

// Server errors: Fewer retries
useErrorRecovery({ maxAttempts: 2 })

// Auth errors: Don't retry
useErrorRecovery({
  shouldRetry: (error) => !error.message.includes('401')
})
```

### 3. Use Circuit Breakers for External Services

```typescript
// Good: Prevent cascade failures
const openai = useCircuitBreaker({ name: 'openai' })
const anthropic = useCircuitBreaker({ name: 'anthropic' })

// Bad: No circuit breaker on flaky service
await fetch('https://flaky-service.com')
```

### 4. Add Analytics to Track Failures

```typescript
useErrorRecovery({
  operation: sendMessage,
  onRetryStart: (attempt) => {
    analytics.track('retry_started', { attempt })
  },
  onMaxAttemptsReached: (error) => {
    analytics.track('retry_exhausted', {
      error: error.message,
      errorType: classifyError(error),
    })
  },
})
```

---

**Next:** [Memory Hooks →](./memory.md)
