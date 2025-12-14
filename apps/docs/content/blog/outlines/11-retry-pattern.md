# Blog Post 11: The Retry Pattern: How to Handle AI API Failures Gracefully

## Meta Information

- **Reading Time:** 5 minutes (~1,200 words)
- **Category:** Technical Implementation
- **Primary Keyword:** AI API retry pattern
- **Secondary Keywords:** exponential backoff, error recovery, API reliability

---

## Hook / Opening (100 words)

**Opening line:** "72% of AI chat applications have silent failures. Users click send, something
breaks, nothing happens."

Your AI chat WILL fail. Rate limits, network hiccups, API timeouts, server errors. The question
isn't if—it's when. And when it fails, do you lose the user's message? Do they know what happened?
Can they retry?

Let's build bulletproof error recovery.

---

## Section 1: Why AI APIs Fail (200 words)

### Content:

**Common failure modes:**

1. **Rate limits (429)** - Too many requests
2. **Timeouts** - Response took too long
3. **Network errors** - Connection dropped
4. **Server errors (500/503)** - API is down
5. **Authentication (401)** - Token expired

**Failure rates in production:**

- Rate limits: 2-5% of requests
- Timeouts: 1-2% (especially for long responses)
- Server errors: 0.1-0.5%
- Total: 3-8% of requests fail

### Visual:

```
[VISUAL 1: Pie chart of failure types]
Rate Limits: 45%
Timeouts: 25%
Network: 15%
Server: 10%
Auth: 5%
```

---

## Section 2: Naive Retry vs Smart Retry (250 words)

### Content:

**Naive approach (don't do this):**

```tsx
// BAD: Immediate retry hammers the server
async function sendMessage(msg) {
  try {
    return await api.send(msg)
  } catch (e) {
    return await api.send(msg) // Retry immediately
  }
}
```

**Why it fails:**

- Rate limited? Immediate retry = more rate limiting
- Server overloaded? More requests = more overload
- No user feedback
- No attempt limit

**Smart retry with exponential backoff:**

```tsx
// GOOD: Increasing delays between retries
import { useErrorRecovery } from '@clarity-chat/react'

const { execute, error, attemptNumber, isRetrying } = useErrorRecovery({
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  backoffStrategy: 'exponential', // 1s, 2s, 4s
  maxDelay: 30000, // Cap at 30s
  retryOn: [429, 500, 503], // Only retry these
})

await execute(async () => {
  return await sendToAPI(message)
})
```

### Visual:

```
[VISUAL 2: Timeline comparison]
Naive Retry:
Attempt 1 ──X── Attempt 2 ──X── Attempt 3 ──X── FAIL
            0ms            0ms

Exponential Backoff:
Attempt 1 ──X────── Attempt 2 ──X──────── Attempt 3 ──✓
            1000ms            2000ms
```

---

## Section 3: Full Implementation (350 words)

### Code Example:

```tsx
import { useErrorRecovery, useOptimisticMessage, RetryButton } from '@clarity-chat/react'

function ResilientChat() {
  const { addOptimistic, updateMessage } = useOptimisticMessage()

  const { execute, error, errorType, attemptNumber, maxAttempts, retryIn, canRetry, reset } =
    useErrorRecovery({
      maxRetries: 3,
      initialDelay: 1000,
      backoffStrategy: 'exponential',
      // Classify errors for different handling
      classifyError: (error) => {
        if (error.status === 429) return 'rateLimit'
        if (error.status === 401) return 'auth'
        if (error.status >= 500) return 'server'
        if (error.name === 'TimeoutError') return 'timeout'
        return 'network'
      },
      // Only retry recoverable errors
      shouldRetry: (error, attempt) => {
        if (error.type === 'auth') return false // Don't retry auth
        if (attempt >= 3) return false
        return true
      },
      onRetrySuccess: (attempt) => {
        analytics.track('retry_success', { attempt })
      },
      onMaxRetriesReached: () => {
        showErrorDialog()
      },
    })

  const handleSend = async (content: string) => {
    // Show message immediately
    const msgId = addOptimistic({ content, status: 'sending' })

    try {
      const response = await execute(async () => {
        return await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: content }),
          signal: AbortSignal.timeout(30000),
        })
      })

      updateMessage(msgId, { status: 'sent' })
      addResponse(response)
    } catch (err) {
      updateMessage(msgId, { status: 'failed', error: err })
    }
  }

  return (
    <div>
      <MessageList messages={messages} />

      {error && (
        <ErrorBanner
          type={errorType}
          message={getErrorMessage(errorType)}
          attempt={attemptNumber}
          maxAttempts={maxAttempts}
        >
          {canRetry && <RetryButton countdown={retryIn} onClick={retry} attempt={attemptNumber} />}
        </ErrorBanner>
      )}
    </div>
  )
}
```

---

## Section 4: Error-Specific Handling (200 words)

### Content:

| Error Type | Delay Strategy             | User Message                           |
| ---------- | -------------------------- | -------------------------------------- |
| Rate Limit | Respect Retry-After header | "Too many requests. Waiting 30s..."    |
| Timeout    | Longer timeout on retry    | "Response taking longer than usual..." |
| Network    | Quick retry                | "Connection lost. Retrying..."         |
| Server     | Exponential backoff        | "Service busy. Trying again..."        |
| Auth       | Don't retry, re-auth       | "Session expired. Please log in."      |

### Code snippet:

```tsx
const errorConfig = {
  rateLimit: {
    delay: (headers) => parseInt(headers['Retry-After']) * 1000 || 30000,
    maxRetries: 2,
    message: 'Slowing down—too many requests.',
  },
  timeout: {
    delay: 2000,
    maxRetries: 2,
    message: 'Taking a bit longer than usual...',
  },
  server: {
    delay: 'exponential',
    maxRetries: 3,
    message: 'Service is temporarily busy.',
  },
}
```

---

## Section 5: UX During Retries (150 words)

### Content:

**Keep users informed:**

- Show attempt number: "Retry 2 of 3"
- Show countdown: "Retrying in 5s..."
- Allow cancel: "Stop trying"
- Preserve their message: Never lose data

### Visual:

```
[VISUAL 3: Retry UI mockup]
┌─────────────────────────────────────┐
│ ⚠️ Connection issue                 │
│ Retrying in 5 seconds... (2/3)      │
│                                     │
│ [Cancel] [Retry Now]                │
│                                     │
│ Your message is saved.              │
└─────────────────────────────────────┘
```

---

## Conclusion (80 words)

### Key takeaways:

1. AI APIs fail 3-8% of the time
2. Never retry immediately (use backoff)
3. Different errors need different handling
4. Never lose user data

### Subtle CTA:

"Clarity Chat's useErrorRecovery hook handles exponential backoff, error classification, user-facing
retries, and data preservation automatically. Build resilient chat without reinventing error
handling."
