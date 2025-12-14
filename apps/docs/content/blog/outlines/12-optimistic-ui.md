# Blog Post 12: Optimistic UI in AI Chat: The Pattern That Changes Everything

## Meta Information

- **Reading Time:** 5 minutes (~1,200 words)
- **Category:** Technical Implementation
- **Primary Keyword:** optimistic UI chat
- **Secondary Keywords:** instant feedback, React patterns, perceived performance

---

## Hook / Opening (100 words)

**Opening line:** "Messages should appear before they're sent."

Wait, what? Yes. In a well-designed chat, when a user clicks send, their message should appear
instantly in the conversation—before the server confirms it. This is optimistic UI, and it's why
iMessage feels faster than it actually is.

Let's build chat that feels instant.

---

## Section 1: What Is Optimistic UI? (200 words)

### Content:

**Pessimistic (traditional):**

1. User clicks send
2. Wait for server
3. Server confirms
4. Show message **Result:** 500-2000ms of nothing

**Optimistic:**

1. User clicks send
2. Show message immediately (status: sending)
3. Server confirms in background
4. Update status to "sent" **Result:** 0ms perceived latency

### Visual:

```
[VISUAL 1: Timeline comparison]
Pessimistic:
Click ──────────[wait 800ms]────────── Message appears

Optimistic:
Click ── Message appears instantly ── Status updates
```

---

## Section 2: Implementation (350 words)

### Code Example:

```tsx
import { useOptimisticMessage, Message } from '@clarity-chat/react'

function OptimisticChat() {
  const { messages, addOptimistic, confirmMessage, failMessage, retryMessage } =
    useOptimisticMessage<Message>({
      // Persist failed messages for retry
      persistFailed: true,
      // Generate temporary IDs
      generateId: () => `temp-${Date.now()}`,
    })

  const handleSend = async (content: string) => {
    // 1. Add message instantly with "sending" status
    const tempId = addOptimistic({
      role: 'user',
      content,
      status: 'sending',
      timestamp: new Date(),
    })

    try {
      // 2. Send to server
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })

      const { id } = await response.json()

      // 3. Confirm with real server ID
      confirmMessage(tempId, {
        id, // Replace temp ID with server ID
        status: 'sent',
      })
    } catch (error) {
      // 4. Mark as failed (but keep visible!)
      failMessage(tempId, {
        status: 'failed',
        error: error.message,
      })
    }
  }

  return (
    <MessageList>
      {messages.map((msg) => (
        <Message
          key={msg.id}
          {...msg}
          // Visual indicators for status
          showStatus={msg.status !== 'sent'}
          onRetry={msg.status === 'failed' ? () => retryMessage(msg.id) : undefined}
        />
      ))}
    </MessageList>
  )
}
```

### Visual:

```
[VISUAL 2: Message status states]
Three message bubbles:
1. "Sending..." - Slightly faded, clock icon
2. "Sent" ✓ - Normal appearance, checkmark
3. "Failed" ✗ - Red indicator, retry button
```

---

## Section 3: The Three States of a Message (200 words)

### Content:

**1. Sending (optimistic)**

- Appears immediately
- Slightly faded or with indicator
- User can cancel
- Temporary ID

**2. Sent (confirmed)**

- Full opacity
- Server ID replaces temp ID
- Optional "delivered" indicator
- Permanent state

**3. Failed (error)**

- Visible with error indicator
- Retry button
- Never disappears (user's words are precious)
- Can be manually dismissed

### Code snippet:

```tsx
<Message
  content={msg.content}
  status={msg.status}
  className={cn(
    msg.status === 'sending' && 'opacity-70',
    msg.status === 'failed' && 'border-red-500'
  )}
>
  {msg.status === 'sending' && <Spinner size="sm" />}
  {msg.status === 'sent' && <CheckIcon />}
  {msg.status === 'failed' && <button onClick={() => retry(msg.id)}>Retry</button>}
</Message>
```

---

## Section 4: Edge Cases (250 words)

### Content:

**Race conditions:** What if user sends multiple messages quickly?

```tsx
// Each message gets unique temp ID
// Order preserved by timestamp
// Server can return in any order—UI stays consistent
```

**Duplicate prevention:** What if retry creates duplicate?

```tsx
// Use idempotency keys
const idempotencyKey = `${userId}-${timestamp}-${hash(content)}`

fetch('/api/messages', {
  headers: { 'Idempotency-Key': idempotencyKey },
  body: JSON.stringify({ content }),
})
```

**Offline handling:** What if user goes offline?

```tsx
const { isOnline } = useNetworkStatus()

if (!isOnline) {
  // Queue message locally
  queueMessage(content)
  showToast("You're offline. Message will send when connected.")
}
```

---

## Section 5: Why It Feels Better (150 words)

### Content:

**Psychology of instant feedback:**

- 100ms: Feels instant
- 100-300ms: Noticeable but acceptable
- 300-1000ms: Feels slow
- 1000ms+: User questions if it worked

Optimistic UI keeps you in the "feels instant" category, even when servers take 500ms.

**The trust equation:**

- Show immediately = "app is responsive"
- Show status = "app is reliable"
- Keep failed messages = "app respects my data"

### Visual:

```
[VISUAL 3: Perception timeline]
0-100ms: "Instant" ✓
100-300ms: "Responsive"
300-1000ms: "Slow"
1000ms+: "Is it broken?"

Optimistic UI keeps you at 0ms
```

---

## Conclusion (80 words)

### Key takeaways:

1. Show messages before server confirms
2. Three states: sending, sent, failed
3. Never lose failed messages
4. Handle edge cases (race conditions, offline)

### Subtle CTA:

"Clarity Chat's useOptimisticMessage hook handles temporary IDs, status transitions, retry logic,
and offline queuing. Make your chat feel instant without reinventing the pattern."
