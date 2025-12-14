---
title: "Optimistic UI in AI Chat: The Pattern That Changes Everything"
description: "Make chat feel instant with optimistic updates. Implement temporary IDs, status transitions, and rollback patterns."
keywords: ["optimistic UI", "instant feedback", "chat UX", "state management", "React patterns"]
author: "Clarity Chat Team"
publishDate: 2025-02-13
readingTime: 7
category: "Streaming & Real-Time"
relatedPosts: ["02-loading-states-progress", "06-typing-indicator-art", "11-retry-pattern"]
---

# Optimistic UI in AI Chat: The Pattern That Changes Everything

Messages should appear before they're sent.

Wait, what? Yes. In a well-designed chat, when a user clicks send, their message should appear instantly in the conversation—before the server confirms it. This is optimistic UI, and it's why iMessage feels faster than it actually is.

Let's build chat that feels instant.

---

## What Is Optimistic UI?

Traditional (pessimistic) approach:

1. User clicks send
2. Show loading spinner
3. Wait for server response (500-2000ms)
4. Server confirms
5. Display message

Result: User stares at a spinner for 500-2000ms every time they send a message. It feels sluggish even when your server is fast.

Optimistic approach:

1. User clicks send
2. Display message immediately (status: sending)
3. Send to server in background
4. Server confirms
5. Update status silently (status: sent)

Result: 0ms perceived latency. The message appears the instant they click send.

The difference is dramatic. A 500ms server response feels instant with optimistic UI, while the same 500ms feels slow with the traditional approach.

This isn't cheating—it's aligning the UI with user intent. When someone clicks send, they expect the message to be sent. Showing it immediately reflects that expectation.

---

## The Three States of a Message

Every message in an optimistic system has one of three states:

**Sending** (optimistic)
- Appears immediately when user clicks send
- Slightly faded or shows an indicator (clock icon, spinner)
- Uses a temporary ID (not yet assigned by server)
- User can potentially cancel

**Sent** (confirmed)
- Full opacity, normal appearance
- Server ID replaces temporary ID
- Optional "delivered" indicator
- This is the permanent state

**Failed** (error)
- Visible with error indicator (red outline, warning icon)
- Retry button available
- Never disappears automatically—the user's words are precious
- Can be manually dismissed only by user action

Here's how this looks in code:

```tsx
type MessageStatus = 'sending' | 'sent' | 'failed'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  status: MessageStatus
  timestamp: Date
  tempId?: string  // For tracking before server assigns ID
  error?: string   // For failed messages
}
```

---

## Implementation

Let's build a complete optimistic message system:

```tsx
interface UseOptimisticMessageConfig {
  persistFailed?: boolean  // Keep failed messages in localStorage
  generateId?: () => string
}

function useOptimisticMessage(config: UseOptimisticMessageConfig = {}) {
  const {
    persistFailed = true,
    generateId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  } = config

  const [messages, setMessages] = useState<Message[]>([])

  // Restore failed messages from localStorage on mount
  useEffect(() => {
    if (persistFailed) {
      const stored = localStorage.getItem('failed-messages')
      if (stored) {
        const failed = JSON.parse(stored) as Message[]
        setMessages(prev => [...prev, ...failed])
      }
    }
  }, [persistFailed])

  // Persist failed messages to localStorage
  useEffect(() => {
    if (persistFailed) {
      const failed = messages.filter(m => m.status === 'failed')
      if (failed.length > 0) {
        localStorage.setItem('failed-messages', JSON.stringify(failed))
      } else {
        localStorage.removeItem('failed-messages')
      }
    }
  }, [messages, persistFailed])

  const addOptimistic = useCallback((
    partial: Omit<Message, 'id' | 'status' | 'timestamp'>
  ): string => {
    const tempId = generateId()

    const message: Message = {
      ...partial,
      id: tempId,
      tempId,
      status: 'sending',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, message])
    return tempId
  }, [generateId])

  const confirmMessage = useCallback((
    tempId: string,
    updates: { id?: string; status?: MessageStatus }
  ) => {
    setMessages(prev => prev.map(m => {
      if (m.tempId === tempId || m.id === tempId) {
        return {
          ...m,
          id: updates.id || m.id,
          status: updates.status || 'sent',
          tempId: undefined,  // Clear temp ID after confirmation
        }
      }
      return m
    }))
  }, [])

  const failMessage = useCallback((
    tempId: string,
    error: string
  ) => {
    setMessages(prev => prev.map(m => {
      if (m.tempId === tempId || m.id === tempId) {
        return {
          ...m,
          status: 'failed',
          error,
        }
      }
      return m
    }))
  }, [])

  const retryMessage = useCallback((id: string) => {
    const message = messages.find(m => m.id === id)
    if (!message || message.status !== 'failed') return null

    // Reset to sending state
    setMessages(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: 'sending',
          error: undefined,
        }
      }
      return m
    }))

    return message.content
  }, [messages])

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  return {
    messages,
    addOptimistic,
    confirmMessage,
    failMessage,
    retryMessage,
    removeMessage,
  }
}
```

Usage in a chat component:

```tsx
function OptimisticChat() {
  const {
    messages,
    addOptimistic,
    confirmMessage,
    failMessage,
    retryMessage,
  } = useOptimisticMessage({ persistFailed: true })

  const handleSend = async (content: string) => {
    // 1. Add message instantly with "sending" status
    const tempId = addOptimistic({
      role: 'user',
      content,
    })

    try {
      // 2. Send to server
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const { id } = await response.json()

      // 3. Confirm with real server ID
      confirmMessage(tempId, { id, status: 'sent' })

    } catch (error) {
      // 4. Mark as failed (but keep visible!)
      failMessage(tempId, (error as Error).message)
    }
  }

  const handleRetry = async (id: string) => {
    const content = retryMessage(id)
    if (content) {
      // Re-send the message
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const { id: serverId } = await response.json()
        confirmMessage(id, { id: serverId, status: 'sent' })
      } catch (error) {
        failMessage(id, (error as Error).message)
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRetry={() => handleRetry(msg.id)}
          />
        ))}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  )
}
```

---

## Visual Indicators

The UI needs to communicate status without being noisy:

```tsx
// Utility for conditional class names
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function MessageBubble({
  message,
  onRetry,
}: {
  message: Message
  onRetry: () => void
}) {
  const isUser = message.role === 'user'

  return (
    <div className={cn(
      "max-w-[80%] p-4 rounded-lg",
      isUser ? "ml-auto bg-blue-500 text-white" : "bg-gray-100",
      // Visual status indicators
      message.status === 'sending' && "opacity-70",
      message.status === 'failed' && "border-2 border-red-400"
    )}>
      <p>{message.content}</p>

      {/* Status footer */}
      <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
        <span>{formatTime(message.timestamp)}</span>

        {message.status === 'sending' && (
          <ClockIcon className="w-3 h-3 animate-pulse" />
        )}

        {message.status === 'sent' && (
          <CheckIcon className="w-3 h-3" />
        )}

        {message.status === 'failed' && (
          <>
            <XCircleIcon className="w-3 h-3 text-red-500" />
            <button
              onClick={onRetry}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  )
}
```

---

## Edge Cases That Will Break You

### Race Conditions

What if the user sends multiple messages quickly and responses return out of order?

```tsx
// Problem: Messages could get out of order
const handleSend = async (content: string) => {
  const tempId = addOptimistic({ role: 'user', content })
  const response = await fetch('/api/messages', { /* ... */ })
  // Response for message 1 might arrive after response for message 2!
}

// Solution: Use timestamps for ordering, not arrival order
const sortedMessages = useMemo(() => {
  return [...messages].sort((a, b) =>
    a.timestamp.getTime() - b.timestamp.getTime()
  )
}, [messages])
```

### Duplicate Prevention

What if a retry creates a duplicate message on the server?

```tsx
// Use idempotency keys
function generateIdempotencyKey(userId: string, content: string): string {
  const hash = simpleHash(content)
  return `${userId}-${Date.now()}-${hash}`
}

const handleSend = async (content: string, retryKey?: string) => {
  const idempotencyKey = retryKey || generateIdempotencyKey(userId, content)

  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ content }),
  })

  // Server should check idempotency key and return existing message if duplicate
}
```

### Offline Handling

What if the user goes offline?

```tsx
function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

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

  return isOnline
}

// In your chat
function OfflineAwareChat() {
  const isOnline = useNetworkStatus()
  const [offlineQueue, setOfflineQueue] = useState<string[]>([])

  const handleSend = (content: string) => {
    if (!isOnline) {
      // Queue for later
      setOfflineQueue(prev => [...prev, content])
      addOptimistic({ role: 'user', content })
      // Show "will send when online" status
      return
    }

    // Normal send
    sendMessage(content)
  }

  // Process queue when back online
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      offlineQueue.forEach(content => sendMessage(content))
      setOfflineQueue([])
    }
  }, [isOnline, offlineQueue])

  return (
    <>
      {!isOnline && (
        <div className="bg-amber-100 p-2 text-center text-sm">
          You're offline. Messages will send when connected.
        </div>
      )}
      {/* ... rest of chat */}
    </>
  )
}
```

---

## Why This Feels Better

The psychology is simple:

| Delay | Perception |
|-------|------------|
| 0-100ms | Feels instant |
| 100-300ms | Responsive |
| 300-1000ms | Noticeable, feels slow |
| 1000ms+ | User questions if it worked |

With pessimistic UI, you're always in the 500-2000ms range—the "feels slow" zone.

With optimistic UI, you're always at 0ms—the "feels instant" zone.

The trust equation:
- **Show immediately** = "this app is responsive"
- **Show status** = "this app is reliable"
- **Keep failed messages** = "this app respects my data"

Combined, users describe optimistic apps as "fast" and "reliable" even when the actual network speed is identical.

---

## The Takeaway

Optimistic UI isn't premature optimization—it's correct UX. Users expect their actions to have immediate effect. Making them wait for server confirmation is pessimistic design.

The pattern:

1. **Show messages before server confirms** — Trust the user's intent
2. **Track three states** — sending, sent, failed
3. **Never lose failed messages** — The user's words are precious
4. **Handle edge cases** — Race conditions, duplicates, offline
5. **Persist through failures** — localStorage is your friend

Implement this once, and your chat transforms from "web app" to "native-feeling experience."

---

*Clarity Chat's `useOptimisticMessage` hook handles temporary IDs, status transitions, retry logic, and offline queuing. Make your chat feel instant without reinventing the pattern. [See the optimistic UI docs →](/docs/hooks/use-optimistic-message)*
