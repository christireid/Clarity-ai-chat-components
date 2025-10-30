# Hooks API Reference

Complete reference for all 25+ custom hooks in Clarity Chat.

---

## 🎯 Core Hooks

### useChat

Main hook for managing chat state and message operations.

```tsx
import { useChat } from '@clarity-chat/react'

const {
  messages,
  sendMessage,
  updateMessage,
  deleteMessage,
  clearMessages,
  isLoading,
} = useChat(options)
```

**Options:**
```typescript
interface UseChatOptions {
  initialMessages?: Message[]
  onError?: (error: Error) => void
  persistMessages?: boolean
  storageKey?: string
}
```

**Returns:**
```typescript
interface UseChatReturn {
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  updateMessage: (id: string, updates: Partial<Message>) => void
  deleteMessage: (id: string) => void
  clearMessages: () => void
  isLoading: boolean
}
```

**Example:**
```tsx
function ChatComponent() {
  const { messages, sendMessage, isLoading } = useChat({
    initialMessages: [],
    persistMessages: true,
    storageKey: 'my-chat-history',
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}
```

---

### useStreaming

Handle streaming responses from AI APIs.

```tsx
import { useStreaming } from '@clarity-chat/react'

const {
  streamMessage,
  isStreaming,
  cancel,
  currentChunk,
} = useStreaming(options)
```

**Options:**
```typescript
interface UseStreamingOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
}
```

**Example:**
```tsx
function StreamingChat() {
  const { streamMessage, isStreaming, cancel } = useStreaming({
    onChunk: (chunk) => console.log('Received:', chunk),
    onComplete: (text) => console.log('Complete:', text),
  })

  const handleSend = async (content: string) => {
    await streamMessage('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })
  }

  return (
    <>
      <ChatWindow onSendMessage={handleSend} isLoading={isStreaming} />
      {isStreaming && <button onClick={cancel}>Cancel</button>}
    </>
  )
}
```

---

### useErrorRecovery

Automatic error recovery with exponential backoff.

```tsx
import { useErrorRecovery } from '@clarity-chat/react'

const { executeWithRetry, isRetrying, retryCount } = useErrorRecovery(options)
```

**Options:**
```typescript
interface UseErrorRecoveryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
  onError?: (error: Error) => void
  onRetry?: (attempt: number) => void
}
```

**Example:**
```tsx
function ResilientChat() {
  const { executeWithRetry, isRetrying, retryCount } = useErrorRecovery({
    maxRetries: 3,
    initialDelay: 1000,
    backoffMultiplier: 2,
  })

  const handleSend = async (content: string) => {
    await executeWithRetry(async () => {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content }),
      })
      if (!res.ok) throw new Error('API Error')
      return res.json()
    })
  }

  return (
    <div>
      <ChatWindow onSendMessage={handleSend} />
      {isRetrying && <p>Retrying... (Attempt {retryCount})</p>}
    </div>
  )
}
```

---

### useVoiceInput

Voice-to-text input with Web Speech API.

```tsx
import { useVoiceInput } from '@clarity-chat/react'

const {
  isListening,
  transcript,
  interimTranscript,
  startListening,
  stopListening,
  isSupported,
} = useVoiceInput(options)
```

**Options:**
```typescript
interface UseVoiceInputOptions {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onTranscript?: (text: string) => void
  onError?: (error: Error) => void
}
```

**Example:**
```tsx
function VoiceChat() {
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  } = useVoiceInput({
    lang: 'en-US',
    continuous: false,
    onTranscript: (text) => console.log('Final:', text),
  })

  if (!isSupported) {
    return <p>Voice input not supported in this browser</p>
  }

  return (
    <div>
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? '🎤 Stop' : '🎤 Start'}
      </button>
      <p>Transcript: {transcript}</p>
    </div>
  )
}
```

---

### useMobileKeyboard

Detect and handle mobile keyboard events.

```tsx
import { useMobileKeyboard } from '@clarity-chat/react'

const {
  isKeyboardVisible,
  keyboardHeight,
  viewportHeight,
} = useMobileKeyboard(options)
```

**Options:**
```typescript
interface UseMobileKeyboardOptions {
  onShow?: (height: number) => void
  onHide?: () => void
  debounceMs?: number
}
```

**Example:**
```tsx
function MobileChat() {
  const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard({
    onShow: (height) => console.log('Keyboard shown:', height),
    onHide: () => console.log('Keyboard hidden'),
  })

  return (
    <div
      style={{
        paddingBottom: isKeyboardVisible ? keyboardHeight : 0,
        transition: 'padding 0.2s',
      }}
    >
      <ChatWindow {...props} />
    </div>
  )
}
```

---

## 🎨 UI Hooks

### useTheme

Access and modify the current theme.

```tsx
import { useTheme } from '@clarity-chat/react'

const { theme, setTheme, themes } = useTheme()
```

### useClipboard

Copy text to clipboard with feedback.

```tsx
import { useClipboard } from '@clarity-chat/react'

const { copy, copied, error } = useClipboard()

// Usage
<button onClick={() => copy('Hello World')}>
  {copied ? '✓ Copied!' : 'Copy'}
</button>
```

### useToggle

Boolean state toggle utility.

```tsx
import { useToggle } from '@clarity-chat/react'

const [isOpen, toggle, setOpen] = useToggle(false)

<button onClick={toggle}>Toggle</button>
<button onClick={() => setOpen(true)}>Open</button>
```

---

## 📊 Analytics Hooks

### useAnalytics

Track user interactions and events.

```tsx
import { useAnalytics } from '@clarity-chat/react'

const { trackEvent, trackPageView, identify } = useAnalytics()

// Track events
trackEvent('message_sent', { content_length: 42 })
trackPageView('/chat')
identify('user-123', { plan: 'pro' })
```

### usePageTracking

Automatically track page views.

```tsx
import { usePageTracking } from '@clarity-chat/react'

usePageTracking() // Tracks route changes automatically
```

---

## ⚡ Performance Hooks

### useDebounce

Debounce a value with configurable delay.

```tsx
import { useDebounce } from '@clarity-chat/react'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  // Runs only after 500ms of no changes
  performSearch(debouncedSearch)
}, [debouncedSearch])
```

### useThrottle

Throttle a value or function.

```tsx
import { useThrottle } from '@clarity-chat/react'

const [scrollPos, setScrollPos] = useState(0)
const throttledScroll = useThrottle(scrollPos, 100)
```

### useIntersectionObserver

Detect element visibility.

```tsx
import { useIntersectionObserver } from '@clarity-chat/react'

const [ref, isVisible] = useIntersectionObserver({
  threshold: 0.5,
  rootMargin: '0px',
})

<div ref={ref}>
  {isVisible && <ExpensiveComponent />}
</div>
```

---

## 🛠️ Utility Hooks

### useLocalStorage

Persist state to localStorage.

```tsx
import { useLocalStorage } from '@clarity-chat/react'

const [messages, setMessages] = useLocalStorage('chat-history', [])
```

### useMediaQuery

Responsive design utilities.

```tsx
import { useMediaQuery } from '@clarity-chat/react'

const isMobile = useMediaQuery('(max-width: 768px)')
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
```

### useWindowSize

Track window dimensions.

```tsx
import { useWindowSize } from '@clarity-chat/react'

const { width, height } = useWindowSize()
```

### usePrevious

Access previous value of state.

```tsx
import { usePrevious } from '@clarity-chat/react'

const [count, setCount] = useState(0)
const prevCount = usePrevious(count)
```

### useMounted

Check if component is mounted.

```tsx
import { useMounted } from '@clarity-chat/react'

const isMounted = useMounted()

// Safe async operations
useEffect(() => {
  fetchData().then(data => {
    if (isMounted()) {
      setData(data)
    }
  })
}, [])
```

---

## 📚 Complete Hook List

| Hook | Category | Description |
|------|----------|-------------|
| `useChat` | Core | Main chat state management |
| `useStreaming` | Core | Handle streaming responses |
| `useStreamingSSE` | Core | Server-Sent Events streaming |
| `useStreamingWebSocket` | Core | WebSocket streaming |
| `useErrorRecovery` | Error | Automatic retry with backoff |
| `useAsyncError` | Error | Async operation error handling |
| `useVoiceInput` | Input | Voice-to-text transcription |
| `useMobileKeyboard` | Mobile | Keyboard visibility detection |
| `useMessageOperations` | Messages | Edit, delete, retry messages |
| `useRealisticTyping` | Messages | Typing indicator simulation |
| `useTokenTracker` | Analytics | Track token usage and costs |
| `useAnalytics` | Analytics | Event tracking |
| `usePageTracking` | Analytics | Automatic page tracking |
| `useTheme` | UI | Theme management |
| `useClipboard` | UI | Copy to clipboard |
| `useToggle` | UI | Boolean state toggle |
| `useAutoScroll` | UI | Automatic scroll management |
| `useDebounce` | Performance | Debounce values |
| `useThrottle` | Performance | Throttle values |
| `useIntersectionObserver` | Performance | Visibility detection |
| `useLocalStorage` | Storage | Persist to localStorage |
| `useSessionStorage` | Storage | Persist to sessionStorage |
| `useMediaQuery` | Responsive | Media query matching |
| `useWindowSize` | Responsive | Window dimensions |
| `usePrevious` | Utility | Previous value tracking |
| `useMounted` | Utility | Mount status check |
| `useEventListener` | Utility | Event listener management |

---

## 📖 Related Documentation

- [Components API](./components.md)
- [Utilities API](./utilities.md)
- [TypeScript Types](./types.md)
- [Examples](../examples/README.md)

---

**Need Help?** Join our [Discord Community](https://discord.gg/clarity-chat)
