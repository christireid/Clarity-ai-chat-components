# The Retry Pattern: Never Lose a Message

*Newsletter version of: Handle AI API Failures Gracefully*

---

72% of AI chat applications have silent failures.

User clicks send. Something breaks. Nothing happens. Message vanishes.

Your AI chat WILL fail. Rate limits, network hiccups, API timeouts. The question isn't if—it's when.

## Error Classification

Not all errors are equal:

| Type | Retryable? | Action |
|------|-----------|--------|
| 429 Rate Limit | Yes | Wait, retry with backoff |
| 500 Server Error | Yes | Retry immediately |
| Network Error | Yes | Retry with backoff |
| 401 Auth Error | No | Refresh token or re-auth |
| 400 Bad Request | No | Show error, don't retry |

## Exponential Backoff

Don't hammer a failing API:

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (!isRetryable(error) || attempt === maxRetries - 1) {
        throw error
      }
      // Wait: 1s, 2s, 4s...
      await sleep(Math.pow(2, attempt) * 1000)
    }
  }
}
```

## User-Facing Retry

The user should be able to retry manually:

```typescript
function FailedMessage({ message, onRetry }) {
  return (
    <div className="border-red-500">
      <p>{message.content}</p>
      <span className="text-red-500">Failed to send</span>
      <button onClick={onRetry}>Retry</button>
    </div>
  )
}
```

## Key Rules

1. **Never lose user input** — preserve the message
2. **Show what happened** — "Rate limited" not "Error"
3. **Offer a path forward** — retry button, not dead end
4. **Add jitter** — randomize delays to avoid thundering herd

---

**Read the full post** for complete retry hooks and error classification utilities.

[Read full post →]
