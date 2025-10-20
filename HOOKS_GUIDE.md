# 🎣 Custom Hooks Guide

Clarity Chat provides a comprehensive set of **15 production-ready custom hooks** that handle common React patterns. These hooks follow modern best practices and are fully typed with TypeScript.

## 📚 Table of Contents

### 🌊 Streaming Hooks (New!)
- [useStreamingSSE](#usestreamingsse) - ⭐ Server-Sent Events streaming with reconnection
- [useStreamingWebSocket](#usestreamingwebsocket) - ⭐ WebSocket streaming with lifecycle management

### 🔧 Utility Hooks
- [useAutoScroll](#useautoscroll) - Auto-scroll to bottom with user control
- [useClipboard](#useclipboard) - Copy to clipboard with success tracking
- [useDebounce](#usedebounce) - Debounce values and callbacks
- [useThrottle](#usethrottle) - Throttle values and callbacks
- [useEventListener](#useeventlistener) - Attach event listeners safely
- [useIntersectionObserver](#useintersectionobserver) - Detect element visibility
- [useKeyboardShortcuts](#usekeyboardshortcuts) - Register keyboard shortcuts
- [useLocalStorage](#uselocalstorage) - Persist state in localStorage
- [useMediaQuery](#usemediaquery) - Track media queries and breakpoints
- [useMounted](#usemounted) - Check if component is mounted
- [usePrevious](#useprevious) - Get previous value of state/prop
- [useToggle](#usetoggle) - Enhanced boolean state management
- [useWindowSize](#usewindowsize) - Track window dimensions

---

## 🌊 Streaming Hooks

### useStreamingSSE

Production-ready SSE (Server-Sent Events) streaming hook with automatic reconnection, authentication handling, token assembly, and network status detection. **Perfect for OpenAI/Anthropic-style streaming responses.**

#### Features

- ✅ Automatic reconnection with exponential backoff
- ✅ Token authentication (header + cookie fallback)
- ✅ Resume from last event ID
- ✅ Partial message assembly and parsing
- ✅ Network status detection
- ✅ Heartbeat monitoring
- ✅ Memory-efficient event buffering
- ✅ Custom headers support
- ✅ POST request support with body

#### Basic Usage

```tsx
import { useStreamingSSE } from '@clarity-chat/react'

function AIChat() {
  const {
    status,
    data,
    error,
    connect,
    disconnect,
  } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Hello', conversationId: '123' },
    authToken: user.token,
    onMessage: (event) => {
      if (event.type === 'done') {
        disconnect()
      }
    },
  })

  return (
    <div>
      <button onClick={connect} disabled={status !== 'idle'}>
        Send Message
      </button>
      {status === 'streaming' && <div>{data}</div>}
      {error && <div>Error: {error.message}</div>}
    </div>
  )
}
```

#### API Reference

```typescript
interface UseStreamingSSEOptions {
  url: string                       // SSE endpoint URL
  method?: 'GET' | 'POST'          // HTTP method (default: 'GET')
  body?: any                        // Request body for POST
  headers?: Record<string, string>  // Custom headers
  authToken?: string                // Auth token (adds Bearer header)
  useCookieFallback?: boolean       // Use cookies if headers fail (default: true)
  autoReconnect?: boolean           // Enable auto-reconnect (default: true)
  maxReconnectAttempts?: number     // Max reconnect attempts (default: 5)
  reconnectDelay?: number           // Initial delay in ms (default: 1000)
  maxReconnectDelay?: number        // Max delay in ms (default: 30000)
  heartbeatInterval?: number        // Heartbeat interval (default: 30000)
  resumeFromLastEventId?: boolean   // Resume from last event (default: true)
  autoParseJson?: boolean           // Auto-parse JSON (default: true)
  onOpen?: () => void
  onMessage?: (event: SSEEvent) => void
  onError?: (error: Error) => void
  onClose?: () => void
  onReconnecting?: (attempt: number, delay: number) => void
  onMaxReconnectAttemptsReached?: () => void
}

interface UseStreamingSSEReturn {
  status: SSEStatus                 // Connection status
  events: SSEEvent[]                // All received events
  lastEvent: SSEEvent | null        // Latest event
  data: string                      // Accumulated data
  error: Error | null               // Current error
  connect: () => void               // Connect to SSE
  disconnect: () => void            // Disconnect from SSE
  reconnect: () => void             // Reconnect
  reset: () => void                 // Reset state
  reconnectAttempt: number          // Current attempt
  isReconnecting: boolean           // Reconnecting state
}
```

#### Advanced Usage

```tsx
// With authentication and retry logic
const { status, data, reconnectAttempt } = useStreamingSSE({
  url: '/api/ai/generate',
  method: 'POST',
  body: {
    prompt: userPrompt,
    model: 'gpt-4',
    temperature: 0.7,
  },
  authToken: authToken,
  autoReconnect: true,
  maxReconnectAttempts: 3,
  onMessage: (event) => {
    // Handle different event types
    switch (event.type) {
      case 'token':
        // Handle streaming token
        console.log('Token:', event.data)
        break
      case 'done':
        // Generation complete
        console.log('Complete!')
        disconnect()
        break
      case 'error':
        // Server error
        console.error('Server error:', event.data)
        break
    }
  },
  onReconnecting: (attempt, delay) => {
    console.log(`Reconnecting... Attempt ${attempt}, delay ${delay}ms`)
  },
})
```

---

### useStreamingWebSocket

Production-ready WebSocket streaming hook with automatic reconnection, heartbeat/ping-pong, and lifecycle management. **Perfect for real-time bidirectional chat.**

#### Features

- ✅ Automatic reconnection with exponential backoff
- ✅ Heartbeat/ping-pong for keepalive
- ✅ Support for text and binary messages
- ✅ Automatic JSON parsing
- ✅ Connection lifecycle management
- ✅ Custom protocols support
- ✅ Connect on mount option
- ✅ Memory-efficient message buffering

#### Basic Usage

```tsx
import { useStreamingWebSocket } from '@clarity-chat/react'

function RealtimeChat() {
  const [input, setInput] = React.useState('')
  
  const {
    status,
    messages,
    send,
    connect,
    disconnect,
  } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    autoReconnect: true,
    enableHeartbeat: true,
    onMessage: (message) => {
      console.log('Received:', message.data)
    },
  })

  const handleSend = () => {
    send({ type: 'chat', message: input })
    setInput('')
  }

  return (
    <div>
      <button onClick={connect} disabled={status !== 'idle'}>
        Connect
      </button>
      <button onClick={disconnect}>Disconnect</button>
      
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={status !== 'connected'}
      />
      <button onClick={handleSend} disabled={status !== 'connected'}>
        Send
      </button>
      
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{JSON.stringify(msg.data)}</div>
        ))}
      </div>
    </div>
  )
}
```

#### API Reference

```typescript
interface UseStreamingWebSocketOptions {
  url: string                       // WebSocket URL (ws:// or wss://)
  protocols?: string | string[]     // WS protocols
  autoReconnect?: boolean           // Auto-reconnect (default: true)
  maxReconnectAttempts?: number     // Max attempts (default: 5)
  reconnectDelay?: number           // Initial delay (default: 1000)
  maxReconnectDelay?: number        // Max delay (default: 30000)
  enableHeartbeat?: boolean         // Enable heartbeat (default: true)
  heartbeatInterval?: number        // Interval in ms (default: 30000)
  heartbeatTimeout?: number         // Timeout in ms (default: 5000)
  heartbeatMessage?: string         // Ping message (default: 'ping')
  autoParseJson?: boolean           // Auto-parse JSON (default: true)
  connectOnMount?: boolean          // Connect on mount (default: false)
  onOpen?: (event: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onError?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onReconnecting?: (attempt: number, delay: number) => void
  onMaxReconnectAttemptsReached?: () => void
  onHeartbeatFailed?: () => void
}

interface UseStreamingWebSocketReturn {
  status: WebSocketStatus           // Connection status
  messages: WebSocketMessage[]      // All messages
  lastMessage: WebSocketMessage | null // Latest message
  error: Event | null               // Current error
  readyState: number                // WebSocket ready state
  connect: () => void               // Connect to WS
  disconnect: (code?: number, reason?: string) => void
  send: (data: string | object | ArrayBuffer | Blob) => boolean
  sendJson: (data: any) => boolean  // Convenience method
  reconnect: () => void             // Reconnect
  reset: () => void                 // Reset state
  reconnectAttempt: number          // Current attempt
  isReconnecting: boolean           // Reconnecting state
}
```

#### Advanced Usage

```tsx
// With custom protocols and heartbeat
const { status, send, messages } = useStreamingWebSocket({
  url: 'wss://game.example.com/multiplayer',
  protocols: ['game-protocol-v1'],
  enableHeartbeat: true,
  heartbeatInterval: 15000,
  heartbeatMessage: JSON.stringify({ type: 'ping' }),
  onMessage: (message) => {
    // Handle different message types
    const data = message.data
    switch (data.type) {
      case 'player_join':
        console.log('Player joined:', data.playerId)
        break
      case 'game_state':
        updateGameState(data.state)
        break
      case 'pong':
        // Heartbeat response
        break
    }
  },
  onHeartbeatFailed: () => {
    console.warn('Connection may be stale')
  },
})

// Send game actions
const movePlayer = (x: number, y: number) => {
  send({
    type: 'player_move',
    position: { x, y },
    timestamp: Date.now(),
  })
}
```

---

### When to Use SSE vs WebSocket

| Feature | SSE (Server-Sent Events) | WebSocket |
|---------|-------------------------|-----------|
| **Direction** | Unidirectional (server → client) | Bidirectional (client ↔ server) |
| **Use Cases** | - AI streaming (OpenAI, Anthropic)<br>- Live notifications<br>- Server updates | - Real-time chat<br>- Live collaboration<br>- Gaming<br>- Interactive apps |
| **Protocol** | HTTP (easier through firewalls) | WebSocket protocol |
| **Reconnection** | Built-in automatic reconnection | Manual reconnection needed |
| **Event IDs** | ✅ Supports resumption | ❌ No built-in resumption |
| **Latency** | Slightly higher | Lower latency |
| **Browser Support** | All modern browsers | All modern browsers |
| **Complexity** | Simpler (HTTP-based) | More complex (persistent connection) |

**Choose SSE when:**
- You only need server-to-client streaming
- You're building OpenAI/Anthropic-style chat
- You want automatic reconnection and resumption
- You need to pass through corporate firewalls easily

**Choose WebSocket when:**
- You need bidirectional communication
- You're building real-time collaboration
- You need the lowest possible latency
- You need to send data from client to server frequently

---

## useAutoScroll

Auto-scroll to bottom of container when new content is added. Only scrolls if user is near bottom to avoid disrupting manual scrolling.

### Usage

```tsx
import { useAutoScroll } from '@clarity-chat/react'

function ChatMessages({ messages }) {
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold: 100,
    behavior: 'smooth'
  })

  return (
    <div className="relative">
      <div ref={scrollRef} className="overflow-y-auto h-96">
        {messages.map(msg => <Message key={msg.id} {...msg} />)}
      </div>
      
      {!isNearBottom && (
        <button onClick={scrollToBottom}>
          Scroll to bottom
        </button>
      )}
    </div>
  )
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Whether auto-scroll is enabled |
| `behavior` | `'smooth' \| 'auto'` | `'smooth'` | Scroll behavior |
| `threshold` | `number` | `100` | Distance from bottom (px) to trigger auto-scroll |
| `dependencies` | `any[]` | `[]` | Dependencies that trigger scroll check |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `scrollRef` | `RefObject<HTMLElement>` | Ref to attach to scrollable container |
| `isNearBottom` | `boolean` | Whether user is near bottom |
| `scrollToBottom` | `() => void` | Manually scroll to bottom |
| `setEnabled` | `(enabled: boolean) => void` | Enable/disable auto-scroll |

---

## useClipboard

Copy text to clipboard with success tracking and automatic reset.

### Usage

```tsx
import { useClipboard } from '@clarity-chat/react'

function CodeBlock({ code }) {
  const { copy, copied } = useClipboard({
    timeout: 3000,
    onSuccess: () => console.log('Copied!')
  })

  return (
    <div className="relative">
      <pre><code>{code}</code></pre>
      <button onClick={() => copy(code)}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `2000` | Timeout in ms before resetting copied state |
| `onSuccess` | `() => void` | `undefined` | Callback when copy succeeds |
| `onError` | `(error: Error) => void` | `undefined` | Callback when copy fails |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `value` | `string` | Current clipboard value |
| `copied` | `boolean` | Whether value was recently copied |
| `copy` | `(text: string) => Promise<void>` | Copy text to clipboard |
| `reset` | `() => void` | Reset copied state |

---

## useDebounce

Debounce a value or callback - only updates after delay has passed since last change.

### Usage

```tsx
import { useDebounce, useDebouncedCallback } from '@clarity-chat/react'

// Debounce a value
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    // Only fires 500ms after user stops typing
    searchAPI(debouncedSearch)
  }, [debouncedSearch])

  return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
}

// Debounce a callback
function AutoSave({ data }) {
  const debouncedSave = useDebouncedCallback(
    (value) => saveToAPI(value),
    1000
  )

  useEffect(() => {
    debouncedSave(data)
  }, [data])

  return <div>Auto-saving...</div>
}
```

### API

```tsx
// Debounce value
const debouncedValue = useDebounce<T>(value: T, delay?: number): T

// Debounce callback
const debouncedCallback = useDebouncedCallback<T>(
  callback: T,
  delay?: number
): (...args: Parameters<T>) => void
```

---

## useThrottle

Throttle a value or callback - only updates at most once per delay period.

### Usage

```tsx
import { useThrottle, useThrottledCallback } from '@clarity-chat/react'

// Throttle a value
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  const throttledScrollY = useThrottle(scrollY, 100)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div>Scroll position: {throttledScrollY}</div>
}

// Throttle a callback
function ResizeHandler() {
  const throttledResize = useThrottledCallback(
    () => console.log('Resized!'),
    200
  )

  useEffect(() => {
    window.addEventListener('resize', throttledResize)
    return () => window.removeEventListener('resize', throttledResize)
  }, [throttledResize])

  return <div>Resize the window</div>
}
```

---

## useEventListener

Attach event listener to element with automatic cleanup.

### Usage

```tsx
import { useEventListener } from '@clarity-chat/react'

function KeyboardHandler() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Listen to specific element
  useEventListener('click', (e) => {
    console.log('Button clicked!', e)
  }, buttonRef)

  // Listen to window
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setModalOpen(false)
    }
  })

  return <button ref={buttonRef}>Click me</button>
}
```

---

## useIntersectionObserver

Observe element intersection with viewport using IntersectionObserver. Perfect for lazy loading, infinite scroll, and animations on scroll.

### Usage

```tsx
import { useIntersectionObserver } from '@clarity-chat/react'

function LazyImage({ src }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    freezeOnceVisible: true
  })

  return (
    <div
      ref={ref}
      className={isIntersecting ? 'animate-fade-in' : 'opacity-0'}
    >
      {isIntersecting && <img src={src} alt="" />}
    </div>
  )
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number \| number[]` | `0` | Percentage of element visibility to trigger |
| `root` | `Element \| null` | `null` | Root element for intersection |
| `rootMargin` | `string` | `'0%'` | Margin around root |
| `freezeOnceVisible` | `boolean` | `false` | Freeze observed state on first intersection |

---

## useKeyboardShortcuts

Register keyboard shortcuts with support for modifiers.

### Usage

```tsx
import { useKeyboardShortcuts, useShortcutDisplay } from '@clarity-chat/react'

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const getShortcut = useShortcutDisplay()

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => setSearchOpen(true),
      description: 'Open search'
    },
    {
      key: 'escape',
      callback: () => setSearchOpen(false),
      description: 'Close search'
    },
    {
      key: 'mod+enter',
      callback: handleSubmit,
      description: 'Submit form',
      enableInInput: true
    }
  ])

  return (
    <div>
      <p>Press <kbd>{getShortcut('mod+k')}</kbd> to search</p>
      {/* Shows ⌘K on Mac, Ctrl+K on Windows */}
    </div>
  )
}
```

### Shortcut Pattern

Use these patterns for key combinations:
- `mod` - Cmd on Mac, Ctrl on Windows/Linux
- `ctrl`, `alt`, `shift`, `meta` - Specific modifiers
- Combine with `+`: `mod+k`, `ctrl+shift+f`, `alt+enter`

---

## useLocalStorage

Persist state in localStorage with automatic serialization and cross-tab sync.

### Usage

```tsx
import { useLocalStorage } from '@clarity-chat/react'

function ThemeToggle() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <button onClick={removeTheme}>
        Reset to default
      </button>
    </div>
  )
}

// Works with complex objects
function UserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('prefs', {
    fontSize: 'medium',
    language: 'en',
    notifications: true
  })

  return (
    <div>
      <select 
        value={preferences.fontSize} 
        onChange={(e) => setPreferences(prev => ({
          ...prev,
          fontSize: e.target.value
        }))}
      >
        <option>small</option>
        <option>medium</option>
        <option>large</option>
      </select>
    </div>
  )
}
```

### API

```tsx
const [storedValue, setValue, removeValue] = useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options?: {
    serializer?: (value: T) => string
    deserializer?: (value: string) => T
    initializeWithValue?: boolean
  }
): [T, Dispatch<SetStateAction<T>>, () => void]
```

---

## useMediaQuery

Track media queries and responsive breakpoints with SSR support.

### Usage

```tsx
import { useMediaQuery, useBreakpoint } from '@clarity-chat/react'

function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDark = useMediaQuery('(prefers-color-scheme: dark)')
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return isMobile ? <MobileNav /> : <DesktopNav />
}

// Or use Tailwind breakpoints
function BreakpointAware() {
  const breakpoint = useBreakpoint()
  // Returns: 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  return (
    <div>
      Current breakpoint: {breakpoint}
      {breakpoint === 'md' ? <TabletView /> : <MobileView />}
    </div>
  )
}
```

---

## useMounted

Track if component is currently mounted. Useful for preventing state updates after unmount.

### Usage

```tsx
import { useMounted } from '@clarity-chat/react'

function DataFetcher() {
  const [data, setData] = useState(null)
  const isMounted = useMounted()

  useEffect(() => {
    async function fetchData() {
      const result = await api.get('/data')
      
      // Only update state if component is still mounted
      if (isMounted()) {
        setData(result)
      }
    }
    fetchData()
  }, [isMounted])

  return <div>{data?.title}</div>
}
```

---

## usePrevious

Get previous value of state or prop.

### Usage

```tsx
import { usePrevious } from '@clarity-chat/react'

function Counter() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount ?? 'N/A'}</p>
      <p>Change: {count - (prevCount ?? 0)}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

---

## useToggle

Enhanced boolean state with helper functions.

### Usage

```tsx
import { useToggle } from '@clarity-chat/react'

function Modal() {
  const modal = useToggle(false)
  const sidebar = useToggle(true)

  return (
    <div>
      <button onClick={modal.toggle}>Toggle Modal</button>
      <button onClick={modal.setTrue}>Open Modal</button>
      <button onClick={modal.setFalse}>Close Modal</button>
      
      {modal.value && (
        <div className="modal">
          <h2>Modal Content</h2>
          <button onClick={modal.setFalse}>Close</button>
        </div>
      )}
    </div>
  )
}
```

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `value` | `boolean` | Current toggle state |
| `toggle` | `() => void` | Toggle the state |
| `setTrue` | `() => void` | Set to true |
| `setFalse` | `() => void` | Set to false |
| `setValue` | `Dispatch<SetStateAction<boolean>>` | Set to specific value |

---

## useWindowSize

Track window dimensions with throttled updates.

### Usage

```tsx
import { useWindowSize } from '@clarity-chat/react'

function ResponsiveComponent() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>Window size: {width} x {height}</p>
      {width < 768 ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  )
}
```

---

## 🎯 Hook Combinations

These hooks are designed to work together. Here are some powerful combinations:

### Smart Search with Debouncing

```tsx
function SmartSearch() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery).then(setResults)
    }
  }, [debouncedQuery])

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  )
}
```

### Infinite Scroll with Intersection Observer

```tsx
function InfiniteList({ items, loadMore }) {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 1.0
  })

  useEffect(() => {
    if (isIntersecting) {
      loadMore()
    }
  }, [isIntersecting, loadMore])

  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)}
      <div ref={ref} className="loading">
        Loading more...
      </div>
    </div>
  )
}
```

### Keyboard Shortcuts with Local Storage

```tsx
function App() {
  const [shortcutsEnabled, setShortcutsEnabled] = useLocalStorage(
    'shortcuts-enabled',
    true
  )

  useKeyboardShortcuts([
    {
      key: 'mod+k',
      callback: () => console.log('Search opened'),
      enabled: shortcutsEnabled
    },
    {
      key: 'mod+/',
      callback: () => setShortcutsEnabled(!shortcutsEnabled),
      description: 'Toggle keyboard shortcuts'
    }
  ])

  return <div>Shortcuts {shortcutsEnabled ? 'enabled' : 'disabled'}</div>
}
```

---

## 💡 Best Practices

1. **Use Dependencies Wisely** - Only include necessary dependencies to avoid unnecessary re-renders
2. **Memoize Callbacks** - Use `useCallback` for callbacks passed to hooks
3. **SSR Support** - All hooks handle server-side rendering gracefully
4. **TypeScript** - Leverage TypeScript generics for type safety
5. **Cleanup** - Hooks automatically clean up timers, listeners, and observers
6. **Performance** - Hooks use `useCallback` and `useMemo` internally for optimization

---

## 🚀 What's Next?

Check out:
- [Component Examples](./EXAMPLES.md) - Real-world usage examples
- [Recipes](./RECIPES.md) - Common patterns and solutions
- [API Reference](./API.md) - Complete API documentation
- [Storybook](./apps/storybook) - Interactive component playground

---

**Built with ❤️ by Code & Clarity**
