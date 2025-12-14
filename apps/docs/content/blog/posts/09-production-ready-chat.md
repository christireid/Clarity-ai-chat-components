---
title: "Build a Production-Ready Chat Interface in React (Not Another Tutorial)"
description: "Complete production chat implementation with streaming, error recovery, accessibility, and mobile optimization. Real code, not tutorial toy examples."
keywords: ["React chat", "production chat", "TypeScript", "streaming", "accessibility", "chat UI"]
author: "Clarity Chat Team"
publishDate: 2025-02-04
readingTime: 15
category: "Strategy & Architecture"
featured: true
relatedPosts: ["07-sse-vs-websockets", "11-retry-pattern", "23-production-readiness-checklist"]
---

# Build a Production-Ready Chat Interface in React (Not Another Tutorial)

Most React chat tutorials stop at "display messages in a list." Here's an array, here's a map, here's an input—done.

Then you ship to production and discover you need error handling, retry logic, streaming, accessibility, mobile optimization, keyboard shortcuts, loading states, token tracking, optimistic updates, scroll management, theming...

This isn't another basic tutorial. This is what production actually requires.

---

## What Tutorials Skip

Here's the tutorial version:

```tsx
function BasicChat() {
  const [messages, setMessages] = useState<{text: string}[]>([])
  const [input, setInput] = useState('')

  const sendMessage = async () => {
    setMessages([...messages, { text: input }])
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: input })
    })
    const data = await response.json()
    setMessages(prev => [...prev, { text: data.response }])
    setInput('')
  }

  return (
    <div>
      {messages.map((m, i) => <div key={i}>{m.text}</div>)}
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}
```

20 lines. It "works." Ship it!

Here's what's missing:
- ❌ No error handling (API fails = app breaks)
- ❌ No retry logic (network hiccup = message lost)
- ❌ No streaming (users stare at blank screen for 10 seconds)
- ❌ No loading states (is it working?)
- ❌ No message status (sent? pending? failed?)
- ❌ No accessibility (keyboard users can't navigate)
- ❌ No mobile optimization (virtual keyboard breaks layout)
- ❌ No scroll management (new messages offscreen)
- ❌ No theming (light mode only)
- ❌ No type safety (runtime errors waiting to happen)

That 20-line demo becomes 2,000+ lines of production code.

---

## The Minimum Viable Production Chat

Let's build what production actually needs. I'll break it into layers.

### Layer 1: Type-Safe Message State

First, proper types and state management:

```tsx
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  status: 'pending' | 'sending' | 'sent' | 'failed'
  timestamp: Date
  error?: string
}

function useMessages() {
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, newMessage])
    return newMessage.id
  }, [])

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, ...updates } : m)
    )
  }, [])

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id))
  }, [])

  return { messages, addMessage, updateMessage, removeMessage }
}
```

### Layer 2: Streaming with Error Recovery

Real streaming implementation with proper error handling:

```tsx
function useStreamingChat() {
  const { messages, addMessage, updateMessage } = useMessages()
  const [status, setStatus] = useState<'idle' | 'streaming' | 'error'>('idle')
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    // Add user message immediately (optimistic)
    const userMsgId = addMessage({
      role: 'user',
      content,
      status: 'sending',
    })

    // Add placeholder for AI response
    const aiMsgId = addMessage({
      role: 'assistant',
      content: '',
      status: 'pending',
    })

    abortControllerRef.current = new AbortController()
    setStatus('streaming')

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: messages.filter(m => m.status === 'sent'),
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      // Mark user message as sent
      updateMessage(userMsgId, { status: 'sent' })
      updateMessage(aiMsgId, { status: 'sending' })

      // Stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulated += parseSSEChunk(chunk)

        updateMessage(aiMsgId, { content: accumulated })
      }

      updateMessage(aiMsgId, { status: 'sent' })
      setStatus('idle')

    } catch (error) {
      if (error.name === 'AbortError') {
        updateMessage(aiMsgId, { status: 'sent', content: accumulated + ' [cancelled]' })
      } else {
        updateMessage(userMsgId, { status: 'failed', error: error.message })
        updateMessage(aiMsgId, { status: 'failed', error: error.message })
        setStatus('error')
      }
    }
  }, [messages, addMessage, updateMessage])

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  const retry = useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message?.status === 'failed' && message.role === 'user') {
      removeMessage(messageId)
      // Also remove the failed AI response
      const aiMsgIndex = messages.findIndex(m => m.id === messageId) + 1
      if (messages[aiMsgIndex]?.status === 'failed') {
        removeMessage(messages[aiMsgIndex].id)
      }
      sendMessage(message.content)
    }
  }, [messages, sendMessage, removeMessage])

  return { messages, status, sendMessage, cancel, retry }
}
```

### Layer 3: Accessible Message List

Screen readers and keyboard navigation:

```tsx
// Utility for conditional class names
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function MessageList({ messages, onRetry }: {
  messages: Message[]
  onRetry: (id: string) => void
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages.length])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && focusedIndex > 0) {
      e.preventDefault()
      setFocusedIndex(prev => prev - 1)
    }
    if (e.key === 'ArrowDown' && focusedIndex < messages.length - 1) {
      e.preventDefault()
      setFocusedIndex(prev => prev + 1)
    }
  }

  return (
    <div
      ref={listRef}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isFocused={index === focusedIndex}
          onRetry={() => onRetry(message.id)}
        />
      ))}
    </div>
  )
}

function MessageBubble({ message, isFocused, onRetry }: {
  message: Message
  isFocused: boolean
  onRetry: () => void
}) {
  const isUser = message.role === 'user'

  return (
    <article
      className={cn(
        'max-w-[80%] p-4 rounded-lg',
        isUser ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100',
        isFocused && 'ring-2 ring-blue-400',
        message.status === 'failed' && 'border-2 border-red-400'
      )}
      aria-label={`${isUser ? 'You' : 'AI'}, ${formatTime(message.timestamp)}`}
    >
      <div className="prose prose-sm">
        {message.content || <LoadingDots />}
      </div>

      {/* Status indicators */}
      <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
        {message.status === 'sending' && <Spinner size="sm" />}
        {message.status === 'sent' && <CheckIcon className="w-3 h-3" />}
        {message.status === 'failed' && (
          <>
            <XIcon className="w-3 h-3 text-red-500" />
            <button
              onClick={onRetry}
              className="text-blue-500 hover:underline"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </article>
  )
}
```

### Layer 4: Smart Input

Mobile-aware input with keyboard shortcuts:

```tsx
function ChatInput({ onSend, disabled }: {
  onSend: (content: string) => void
  disabled: boolean
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + Enter to send
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
    // Enter without modifier on desktop sends
    // But on mobile, Enter should add newline (let user tap send button)
    if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (trimmed && !disabled) {
      onSend(trimmed)
      setValue('')
    }
  }

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border p-3 focus:outline-none focus:ring-2"
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          aria-label="Send message"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}

function isMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}
```

### Layer 5: Putting It Together

```tsx
function ProductionChat() {
  const { messages, status, sendMessage, cancel, retry } = useStreamingChat()

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b">
        <h1 className="font-semibold">AI Assistant</h1>
      </header>

      <MessageList messages={messages} onRetry={retry} />

      {status === 'streaming' && (
        <div className="px-4 py-2 flex items-center justify-between bg-blue-50">
          <span className="text-sm text-blue-600">AI is responding...</span>
          <button
            onClick={cancel}
            className="text-sm text-blue-600 hover:underline"
          >
            Stop
          </button>
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        disabled={status === 'streaming'}
      />
    </div>
  )
}
```

---

## The Edge Cases That Break You

Production reveals edge cases that tutorials ignore.

### Race Conditions

What if a user sends another message while AI is still responding?

```tsx
// Solution: Queue messages, process sequentially
const messageQueue = useRef<string[]>([])
const [isProcessing, setIsProcessing] = useState(false)

const queueMessage = (content: string) => {
  messageQueue.current.push(content)
  if (!isProcessing) {
    processQueue()
  }
}

const processQueue = async () => {
  setIsProcessing(true)
  while (messageQueue.current.length > 0) {
    const content = messageQueue.current.shift()!
    await sendMessage(content)
  }
  setIsProcessing(false)
}
```

### Mobile Virtual Keyboard

When the keyboard appears, it changes the viewport. Your input might get hidden.

```tsx
// Scroll input into view when focused
const handleFocus = () => {
  setTimeout(() => {
    textareaRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, 300) // Wait for keyboard animation
}
```

### Long Message Lists

At 200+ messages, rendering slows down. Use virtualization:

```tsx
import { FixedSizeList as List } from 'react-window'

function VirtualizedMessageList({ messages }) {
  const listRef = useRef<List>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    listRef.current?.scrollToItem(messages.length - 1)
  }, [messages.length])

  return (
    <List
      ref={listRef}
      height={600}
      itemCount={messages.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <MessageBubble message={messages[index]} />
        </div>
      )}
    </List>
  )
}
```

---

## What You Actually Need vs. What You Build

| Feature | Lines of Code | Time to Build |
|---------|---------------|---------------|
| Basic messaging | 50 | 1 day |
| Streaming | 150 | 2 days |
| Error handling | 100 | 1 day |
| Retry logic | 80 | 1 day |
| Accessibility | 200 | 2 days |
| Mobile optimization | 100 | 1 day |
| Theming | 150 | 1 day |
| Virtualization | 100 | 1 day |
| Loading states | 80 | 0.5 days |
| Testing | 500+ | 3 days |
| **Total** | **~1,500** | **~13 days** |

That's 3 weeks for a production-ready chat. Longer if you count debugging and iteration.

---

## The Takeaway

Tutorial chat is not production chat. The gap is massive:

1. **Error handling everywhere** — Every async operation can fail
2. **Loading and status states** — Users need feedback at every step
3. **Accessibility from day one** — Retrofit costs 10x more
4. **Mobile is different** — Virtual keyboards, touch targets, responsive layouts
5. **Performance at scale** — Virtualization for long histories
6. **Edge cases multiply** — Race conditions, network issues, browser quirks

You can spend 3+ weeks building this yourself, or use something that's already solved these problems.

---

*Clarity Chat provides all of this out of the box: streaming, error recovery, accessibility, mobile optimization, virtualization, theming, and more. [See the quick start →](/docs/getting-started)*
