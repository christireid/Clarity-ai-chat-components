---
title: "Error Messages That Don't Make Users Rage-Quit"
description:
  'Build user-friendly error handling for AI chat. Classification, recovery options, and messaging
  that helps instead of frustrates.'
keywords: ['error handling', 'UX', 'error messages', 'user experience', 'chat errors']
author: 'Clarity Chat Team'
publishDate: 2025-01-21
readingTime: 7
category: 'UX & Psychology'
relatedPosts: ['11-retry-pattern', '09-production-ready-chat', '04-accessibility-screen-readers']
---

# Error Messages That Don't Make Users Rage-Quit

"Error: Something went wrong."

Congratulations. You've just told your user absolutely nothing.

What went wrong? Their network? Your server? The AI? Is their message lost forever? Can they retry?
Should they refresh? Contact support?

A single, useless error message can undo an entire positive user experience. I've seen users abandon
products after one bad error—not because the error happened, but because they had no idea what to do
next.

Let's fix your error messages.

---

## The Hall of Shame

I've catalogued error messages from AI chat products I've tested. Here are the worst offenders:

**"Error."** No explanation, no action, no hope.

**"Request failed. Try again later."** When is "later"? One second? One hour? Next week?

**"null"** Yes, literally the JavaScript value `null` displayed to users. Someone forgot to handle
the error case.

**"Error 500"** Technical jargon that means nothing to 99% of users.

**[Nothing happens]** The silent failure. User clicks send, loading spinner appears, loading spinner
disappears, message is gone. No indication anything went wrong.

Each of these destroys trust. Users don't know if their message was received, if they can retry, or
if the app is fundamentally broken.

---

## The Anatomy of a Good Error Message

Every error message should answer four questions:

### 1. What happened? (Clear, non-technical)

**Bad:** "Error 429" **Good:** "You've sent too many messages"

Don't expose internal error codes or technical jargon. Translate the problem into human terms.

### 2. Why did it happen? (Context)

**Bad:** (nothing) **Good:** "We limit requests to keep the service fast for everyone"

Brief context helps users understand it's not their fault (or, if it is, what they did).

### 3. What should they do next? (Actionable)

**Bad:** (nothing) **Good:** "Wait 30 seconds and try again, or reduce your message length"

Give them a path forward. If there's nothing they can do, tell them that too.

### 4. Is their data safe? (Reassurance)

**Bad:** (nothing) **Good:** "Your message has been saved and will send automatically when ready"

The worst fear is losing work. Reassure them immediately if their data is safe.

---

## Putting It Together

Here's what a good error message looks like:

```tsx
// Import icons from lucide-react, heroicons, or your preferred icon library
// npm install lucide-react
import { AlertCircle as AlertCircleIcon } from 'lucide-react'

// Error type definition
interface ChatError {
  type: 'rateLimit' | 'network' | 'server' | 'timeout' | 'auth'
  message?: string
}

function ErrorBanner({ error }: { error: ChatError }) {
  const errorContent = {
    rateLimit: {
      title: 'Slow down a bit',
      message: "You've hit our rate limit. This helps keep the service fast for everyone.",
      action: 'Wait 30 seconds, then try again.',
      reassurance: 'Your message is saved.',
    },
    network: {
      title: 'Connection lost',
      message: "We can't reach our servers right now.",
      action: "Check your internet connection. We'll retry automatically.",
      reassurance: 'Your message is saved locally.',
    },
    server: {
      title: "Something's wrong on our end",
      message: 'Our AI service is temporarily unavailable.',
      action: "We're working on it. Please try again in a few minutes.",
      reassurance: 'Your message is safe—nothing was lost.',
    },
    timeout: {
      title: 'Response taking too long',
      message: 'The AI is taking longer than usual to respond.',
      action: 'You can wait, or cancel and try a simpler question.',
      reassurance: 'Your original message is still here.',
    },
    auth: {
      title: 'Session expired',
      message: "You've been logged out for security.",
      action: 'Please log in again to continue.',
      reassurance: 'Your conversation history is saved.',
    },
  }[error.type]

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircleIcon className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-900">{errorContent.title}</h3>
          <p className="text-sm text-red-700 mt-1">{errorContent.message}</p>
          <p className="text-sm text-red-600 mt-2">{errorContent.action}</p>
          <p className="text-sm text-red-500 mt-1 italic">{errorContent.reassurance}</p>
        </div>
      </div>
    </div>
  )
}
```

---

## Error Classification

Different errors need different handling. Classify them at the point of failure:

```tsx
type ErrorType = 'network' | 'rateLimit' | 'server' | 'timeout' | 'auth' | 'validation'

function classifyError(error: unknown): ErrorType {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return 'network'
  }

  if (error instanceof Response) {
    if (error.status === 429) return 'rateLimit'
    if (error.status === 401 || error.status === 403) return 'auth'
    if (error.status >= 500) return 'server'
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'timeout'
  }

  return 'server' // Default fallback
}
```

Each type gets different treatment:

| Type       | Retry?       | Delay                  | Tone        |
| ---------- | ------------ | ---------------------- | ----------- |
| Network    | Yes, auto    | Immediate              | Calm        |
| Rate limit | Yes          | Wait for header or 30s | Informative |
| Server     | Yes          | Exponential backoff    | Apologetic  |
| Timeout    | User choice  | None                   | Neutral     |
| Auth       | No, redirect | None                   | Urgent      |
| Validation | No           | None                   | Helpful     |

---

## Never Lose User Data

The absolute worst error experience: user types a long message, it fails to send, and the message is
_gone_.

Never let this happen. Implement optimistic UI with persistent state:

```tsx
function useSafeMessageSend() {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessage = async (content: string) => {
    // 1. Create message with pending status
    const tempId = crypto.randomUUID()
    const newMessage: Message = {
      id: tempId,
      content,
      status: 'sending',
      timestamp: new Date(),
    }

    // 2. Add to state immediately
    setMessages((prev) => [...prev, newMessage])

    // 3. Persist to localStorage as backup
    localStorage.setItem(`pending-${tempId}`, JSON.stringify(newMessage))

    try {
      // 4. Send to server
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      })

      if (!response.ok) {
        throw response
      }

      const { id: serverId } = await response.json()

      // 5. Update with server ID, remove from localStorage
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, id: serverId, status: 'sent' } : m))
      )
      localStorage.removeItem(`pending-${tempId}`)
    } catch (error) {
      // 6. Mark as failed but keep visible
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, status: 'failed', error: classifyError(error) } : m
        )
      )
      // Note: Don't remove from localStorage—it's our backup
    }
  }

  // On mount, restore any pending messages
  useEffect(() => {
    const pending = Object.keys(localStorage)
      .filter((key) => key.startsWith('pending-'))
      .map((key) => JSON.parse(localStorage.getItem(key)!))

    if (pending.length > 0) {
      setMessages((prev) => [...prev, ...pending])
    }
  }, [])

  return { messages, sendMessage }
}
```

Failed messages stay visible with a retry button:

```tsx
import { Check as CheckIcon } from 'lucide-react'

// Utility for conditional class names
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

// Hook for chat actions - this would be defined elsewhere in your app
// or provided by a chat library like Clarity Chat
function useChatActions() {
  const retrySend = async (messageId: string) => {
    // Re-fetch the message from state and re-send
    console.log('Retrying message:', messageId)
    // Implementation: get message content, call sendMessage again
  }

  return { retrySend }
}

function MessageWithStatus({ message }: { message: Message }) {
  const { retrySend } = useChatActions()

  return (
    <div className="relative">
      <div
        className={cn('p-4 rounded-lg', message.status === 'failed' && 'border-2 border-red-300')}
      >
        {message.content}
      </div>

      {message.status === 'sending' && <span className="text-xs text-gray-400">Sending...</span>}

      {message.status === 'sent' && <CheckIcon className="w-4 h-4 text-green-500" />}

      {message.status === 'failed' && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-red-500">Failed to send</span>
          <button
            onClick={() => retrySend(message.id)}
            className="text-xs text-blue-500 hover:underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## The Retry Button Done Right

A proper retry button isn't just a button that re-submits. It should:

1. **Show attempt count:** "Try again (2 of 3)"
2. **Respect backoff:** Disable briefly after failure
3. **Know when to stop:** After 3 fails, suggest alternative action
4. **Show countdown:** "Retry available in 5s..."

```tsx
function RetryButton({
  onRetry,
  attempt,
  maxAttempts,
  cooldown,
}: {
  onRetry: () => void
  attempt: number
  maxAttempts: number
  cooldown: number
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(cooldown)
  const [isReady, setIsReady] = useState(cooldown === 0)

  useEffect(() => {
    if (cooldown === 0) {
      setIsReady(true)
      return
    }

    setSecondsRemaining(cooldown)
    setIsReady(false)

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsReady(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldown])

  if (attempt >= maxAttempts) {
    return (
      <div className="text-sm text-gray-500">
        Unable to send. Please try again later or{' '}
        <a href="/support" className="text-blue-500 hover:underline">
          contact support
        </a>
        .
      </div>
    )
  }

  return (
    <button
      onClick={onRetry}
      disabled={!isReady}
      className={cn(
        'text-sm font-medium',
        isReady ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'
      )}
    >
      {isReady
        ? `Try again (${attempt + 1} of ${maxAttempts})`
        : `Retry in ${secondsRemaining}s...`}
    </button>
  )
}
```

---

## Proactive Error Prevention

The best error message is no error message. Prevent errors before they happen:

**Disable send when input is empty:**

```tsx
<button disabled={message.trim().length === 0}>Send</button>
```

**Show character/token limits:**

```tsx
{
  message.length > 10000 && (
    <span className="text-yellow-600">Message is quite long. Consider breaking it up.</span>
  )
}
```

**Warn before sending during known issues:**

```tsx
{
  systemStatus === 'degraded' && (
    <Banner type="warning">
      Our AI service is experiencing delays. Messages may take longer than usual.
    </Banner>
  )
}
```

---

## The Takeaway

Error messages are a core part of UX, not an afterthought. Every error is an opportunity to build or
destroy trust.

The rules:

1. **Never show technical jargon** — Translate for humans
2. **Always provide next steps** — What should they do?
3. **Never lose user data** — Persist messages locally
4. **Classify and handle differently** — Not all errors are the same
5. **Know when to give up** — After multiple retries, offer alternatives

Your users will forgive errors. They won't forgive being left in the dark about what to do next.

---

_Don't want to build error handling from scratch? Clarity Chat's error recovery system handles
classification, retry logic, optimistic UI, and user-facing messaging automatically.
[See the error handling docs →](/docs/error-handling)_
