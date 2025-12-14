# Blog Post 5: Error Messages That Don't Make Users Rage-Quit

## Meta Information

- **Reading Time:** 4 minutes (~1,000 words)
- **Category:** UX & Design
- **Primary Keyword:** AI chatbot error handling
- **Secondary Keywords:** error messages, user experience, API errors

---

## Hook / Opening (100 words)

**Opening line:** "'Error: Something went wrong.' Congratulations, you've just told your user
absolutely nothing."

The scenario: User types a thoughtful 200-word question. Clicks send. Waits. Gets "Error." Message
is gone. This happens in 72% of AI chat apps I've tested.

Your error messages are either building trust or destroying it. There's no neutral ground.

---

## Section 1: The Error Message Hall of Shame (200 words)

### Content:

**Hall of Shame examples:**

- "Error: Something went wrong"
- "Request failed"
- "Error 500"
- "null"
- Just... nothing happens

**Why these fail:**

- No context (what failed?)
- No solution (what now?)
- No reassurance (is my data lost?)
- Technical jargon (what's a 500?)

### Visual:

```
[VISUAL 1: "Hall of Shame" mockups]
4 example error states showing bad patterns:
1. Generic "Something went wrong" toast
2. Raw JSON error in UI
3. Spinner that never stops
4. Silent failure (nothing happens)
```

---

## Section 2: The Anatomy of a Good Error (250 words)

### Content:

**Four components of effective error messages:**

1. **What happened** (clear, non-technical)
   - Bad: "Error 429"
   - Good: "You've sent too many messages"

2. **Why it happened** (context)
   - Bad: (nothing)
   - Good: "Our servers limit requests to prevent overload"

3. **What to do next** (actionable)
   - Bad: (nothing)
   - Good: "Wait 30 seconds and try again"

4. **Reassurance** (data safety)
   - Bad: (nothing)
   - Good: "Your message has been saved"

### Visual:

```
[VISUAL 2: Annotated error message]
"Unable to send message"  ← What happened
"The AI service is temporarily busy"  ← Why
[Retry in 15s] [Save Draft]  ← What to do
"Your message is saved and will be sent automatically"  ← Reassurance
```

---

## Section 3: Error Classification System (200 words)

### Content:

Different errors need different handling:

| Type       | Example           | Tone        | Action           |
| ---------- | ----------------- | ----------- | ---------------- |
| Network    | No internet       | Calm        | Auto-retry       |
| Rate Limit | Too many requests | Informative | Countdown        |
| Server     | AI down           | Apologetic  | Notify when back |
| Auth       | Session expired   | Urgent      | Re-login         |
| Validation | Empty message     | Helpful     | Focus input      |

### Code Example:

```tsx
import { useErrorRecovery, RetryButton } from '@clarity-chat/react'

function ChatWithErrors() {
  const { error, errorType, canRetry, retryIn } = useErrorRecovery({
    maxRetries: 3,
    backoffStrategy: 'exponential',
  })

  if (!error) return null

  return (
    <div className={`error-banner error-${errorType}`}>
      <ErrorIcon type={errorType} />
      <div>
        <p className="error-message">{getErrorMessage(errorType)}</p>
        <p className="error-hint">{getErrorHint(errorType)}</p>
      </div>
      {canRetry && <RetryButton countdown={retryIn} onClick={handleRetry} />}
    </div>
  )
}
```

---

## Section 4: Never Lose User Data (200 words)

### Content:

**The cardinal sin:** Losing the user's message on error.

**The solution:**

1. Optimistic UI: Show message immediately
2. Queue failed messages locally
3. Auto-retry in background
4. Show clear status: sending → failed → retry

### Code Example:

```tsx
import { useOptimisticMessage } from '@clarity-chat/react'

function SafeChat() {
  const { addOptimisticMessage, updateMessage } = useOptimisticMessage()

  const handleSend = async (content: string) => {
    // Message appears immediately
    const tempId = addOptimisticMessage({
      content,
      status: 'sending',
    })

    try {
      await sendToAPI(content)
      updateMessage(tempId, { status: 'sent' })
    } catch (error) {
      // Message stays visible with failed status
      updateMessage(tempId, {
        status: 'failed',
        error: error.message,
      })
      // User can retry without retyping
    }
  }
}
```

### Visual:

```
[VISUAL 3: Message status flow]
Timeline showing:
1. Message with "Sending..." indicator
2. Message with checkmark (success) OR
3. Message with "Failed" badge + Retry button
```

---

## Section 5: The Retry Button Done Right (150 words)

### Content:

**Retry button requirements:**

- Show attempts remaining
- Countdown to next retry
- Different messaging per attempt
- Know when to give up

### Code Example:

```tsx
<RetryButton
  onRetry={handleRetry}
  attemptNumber={2}
  maxAttempts={3}
  countdown={15}
  messages={{
    1: 'Try again',
    2: 'Still not working? Try once more',
    3: 'Last attempt',
  }}
  onMaxAttemptsReached={() => {
    showContactSupport()
  }}
/>
```

---

## Conclusion (80 words)

### Key takeaways:

1. Generic errors destroy trust
2. Include: what, why, action, reassurance
3. Never lose user data
4. Classify errors, handle differently

### Subtle CTA:

"Clarity Chat's error handling system automatically classifies errors, preserves user data,
implements exponential backoff, and shows contextual recovery options. Your users never see
'Something went wrong' again."

---

## Graphics Summary

1. **Hall of Shame:** Bad error message examples
2. **Anatomy:** Annotated good error message
3. **Flow diagram:** Message status lifecycle
4. **Table:** Error classification guide
