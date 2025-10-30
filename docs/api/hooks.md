# Hooks API Reference

Complete reference for all 25+ custom hooks in Clarity Chat.

---

## 🎯 Hook Categories Overview

```mermaid
mindmap
  root((Clarity Hooks))
    Core
      useChat
      useStreaming
      useStreamingSSE
      useStreamingWebSocket
    Error Handling
      useErrorRecovery
      useAsyncError
    Input
      useVoiceInput
      useMobileKeyboard
    Messages
      useMessageOperations
      useRealisticTyping
    Analytics
      useTokenTracker
      useAnalytics
      usePageTracking
    UI
      useTheme
      useClipboard
      useToggle
      useAutoScroll
    Performance
      useDebounce
      useThrottle
      useIntersectionObserver
    Storage
      useLocalStorage
      useSessionStorage
    Responsive
      useMediaQuery
      useWindowSize
    Utility
      usePrevious
      useMounted
      useEventListener
```

---

## 🎯 Core Hooks

### useChat

Main hook for managing chat state and message operations.

#### Hook State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Initialize
    Idle --> Sending: sendMessage()
    Sending --> Processing: API call in progress
    Processing --> Success: Response received
    Processing --> Error: API error
    
    Success --> Idle: Message added
    Error --> Idle: Error handled
    
    Idle --> Updating: updateMessage()
    Updating --> Idle: Message updated
    
    Idle --> Deleting: deleteMessage()
    Deleting --> Idle: Message removed
    
    Idle --> Clearing: clearMessages()
    Clearing --> [*]: All messages removed
    
    note right of Processing
        isLoading = true
    end note
    
    note right of Idle
        isLoading = false
    end note
```

#### Data Flow

```mermaid
sequenceDiagram
    participant Component
    participant useChat
    participant State
    participant Storage
    participant API
    
    Component->>useChat: const { messages, sendMessage } = useChat()
    useChat->>State: Initialize state
    useChat->>Storage: Load persisted messages?
    Storage-->>State: Restore messages
    
    Component->>useChat: sendMessage(content)
    useChat->>State: Add user message
    useChat->>useChat: Set isLoading = true
    useChat->>API: POST /api/chat
    
    API-->>useChat: Response
    useChat->>State: Add assistant message
    useChat->>Storage: Persist messages?
    useChat->>useChat: Set isLoading = false
    useChat-->>Component: Re-render with new messages
```

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

#### Streaming Hook Lifecycle

```mermaid
sequenceDiagram
    participant Component
    participant Hook as useStreaming
    participant Fetch as Fetch API
    participant Stream as ReadableStream
    participant API
    
    Component->>Hook: streamMessage(url, options)
    Hook->>Hook: Set isStreaming = true
    Hook->>Fetch: fetch(url, options)
    Fetch->>API: HTTP Request
    
    API-->>Fetch: ReadableStream response
    Fetch->>Stream: Get reader
    
    loop Read chunks
        Stream->>Hook: Read chunk
        Hook->>Hook: Decode chunk
        Hook->>Component: onChunk(text)
        Component->>Component: Update UI
    end
    
    Stream->>Hook: Stream complete
    Hook->>Component: onComplete(fullText)
    Hook->>Hook: Set isStreaming = false
    Hook-->>Component: Final state
```

#### Cancellation Flow

```mermaid
graph LR
    A[Streaming Active] --> B{User clicks cancel}
    B -->|Yes| C[AbortController.abort]
    C --> D[Stream closed]
    D --> E[Cleanup]
    E --> F[isStreaming = false]
    
    B -->|No| G[Continue streaming]
    G --> H[Stream completes]
    H --> F
    
    style C fill:#ef4444,color:#fff
    style H fill:#7ED321,color:#fff
    style F fill:#4A90E2,color:#fff
```

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

#### Retry Strategy Visualization

```mermaid
graph TB
    A[Operation Fails] --> B{Retry Attempt}
    B -->|Attempt 1| C[Wait 1s]
    C --> D[Retry]
    D --> E{Success?}
    E -->|No| F{Attempt 2}
    
    F -->|Yes| G[Wait 2s]
    G --> H[Retry]
    H --> I{Success?}
    I -->|No| J{Attempt 3}
    
    J -->|Yes| K[Wait 4s]
    K --> L[Retry]
    L --> M{Success?}
    M -->|No| N{Max Retries?}
    
    N -->|Yes| O[Give Up]
    N -->|No| P[Wait 8s]
    P --> Q[Retry...]
    
    E -->|Yes| R[Success]
    I -->|Yes| R
    M -->|Yes| R
    
    style C fill:#F5A623,color:#fff
    style G fill:#f59e0b,color:#fff
    style K fill:#ef4444,color:#fff
    style R fill:#7ED321,color:#fff
    style O fill:#991b1b,color:#fff
```

#### Exponential Backoff Timeline

```mermaid
gantt
    title Retry Timeline with Exponential Backoff
    dateFormat ss
    
    section Attempts
    Initial attempt      :a1, 00, 1s
    Fail                 :milestone, after a1, 0s
    Wait 1s              :a2, after a1, 1s
    Retry 1              :a3, after a2, 1s
    Fail                 :milestone, after a3, 0s
    Wait 2s              :a4, after a3, 2s
    Retry 2              :a5, after a4, 1s
    Fail                 :milestone, after a5, 0s
    Wait 4s              :a6, after a5, 4s
    Retry 3              :a7, after a6, 1s
    Success              :milestone, after a7, 0s
```

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

#### Voice Recognition State Flow

```mermaid
stateDiagram-v2
    [*] --> Idle: Initialize
    Idle --> Checking: Check browser support
    Checking --> Unsupported: Not supported
    Checking --> Ready: Supported
    
    Ready --> Listening: startListening()
    Listening --> Processing: User speaks
    Processing --> InterimResults: Partial transcription
    InterimResults --> Processing: Continue speaking
    Processing --> Final: User stops
    Final --> Ready: stopListening()
    
    Listening --> Error: Recognition error
    Error --> Ready: Reset
    
    Ready --> Idle: Cleanup
    Unsupported --> [*]
    
    note right of InterimResults
        interimResults = true
        Real-time feedback
    end note
```

#### Language Support Matrix

```mermaid
graph TB
    subgraph "Tier 1: Full Support"
        T1A[English en-US/GB]
        T1B[Spanish es-ES/MX]
        T1C[French fr-FR]
        T1D[German de-DE]
        T1E[Italian it-IT]
    end
    
    subgraph "Tier 2: Good Support"
        T2A[Chinese zh-CN]
        T2B[Japanese ja-JP]
        T2C[Korean ko-KR]
        T2D[Portuguese pt-BR]
        T2E[Russian ru-RU]
    end
    
    subgraph "Tier 3: Basic Support"
        T3A[Arabic ar-SA]
        T3B[Hindi hi-IN]
        T3C[Dutch nl-NL]
        T3D[Polish pl-PL]
        T3E[Turkish tr-TR]
    end
    
    style T1A fill:#7ED321,color:#fff
    style T2A fill:#F5A623,color:#fff
    style T3A fill:#f59e0b,color:#fff
```

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

#### Mobile Keyboard Detection

```mermaid
sequenceDiagram
    participant User
    participant Input
    participant Hook as useMobileKeyboard
    participant Viewport
    
    User->>Input: Focus input field
    Input->>Hook: Focus event
    Hook->>Viewport: Measure viewport height
    
    Viewport-->>Hook: Initial height
    
    Note over Viewport: Keyboard appears
    
    Viewport->>Hook: Resize event
    Hook->>Hook: Calculate new height
    Hook->>Hook: Detect keyboard
    Hook->>Hook: keyboardHeight = initialHeight - newHeight
    Hook-->>Hook: isKeyboardVisible = true
    Hook->>Hook: Call onShow(height)
    
    User->>Input: Blur input field
    
    Note over Viewport: Keyboard disappears
    
    Viewport->>Hook: Resize event
    Hook->>Hook: Height returns to normal
    Hook-->>Hook: isKeyboardVisible = false
    Hook->>Hook: Call onHide()
```

#### Viewport Adjustment Strategy

```mermaid
graph TB
    A[Keyboard Shows] --> B{Detect Height Change}
    B --> C[Calculate Keyboard Height]
    C --> D[Adjust Viewport]
    
    D --> E[Option 1: Padding]
    D --> F[Option 2: Transform]
    D --> G[Option 3: Scroll]
    
    E --> H[paddingBottom += height]
    F --> I[translateY -= height]
    G --> J[scrollIntoView]
    
    H --> K[Input Visible]
    I --> K
    J --> K
    
    style A fill:#F5A623,color:#fff
    style C fill:#4A90E2,color:#fff
    style K fill:#7ED321,color:#fff
```

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

#### Theme Context Architecture

```mermaid
graph TB
    A[ThemeProvider] --> B[Theme Context]
    B --> C[useTheme Hook]
    
    C --> D[Component A]
    C --> E[Component B]
    C --> F[Component N]
    
    D --> G[Access theme.colors]
    E --> H[Access theme.typography]
    F --> I[Call setTheme]
    
    I --> J[Update Context]
    J --> K[Re-render All Consumers]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#F5A623,color:#fff
    style K fill:#ec4899,color:#fff
```

```tsx
import { useTheme } from '@clarity-chat/react'

const { theme, setTheme, themes } = useTheme()
```

### useClipboard

Copy text to clipboard with feedback.

#### Clipboard Copy Flow

```mermaid
sequenceDiagram
    participant User
    participant Button
    participant Hook as useClipboard
    participant API as Clipboard API
    
    User->>Button: Click copy
    Button->>Hook: copy(text)
    Hook->>API: navigator.clipboard.writeText()
    
    alt Success
        API-->>Hook: Resolved
        Hook->>Hook: Set copied = true
        Hook->>Hook: Start timeout
        Hook-->>Button: Show "Copied!"
        
        Note over Hook: Wait 2 seconds
        
        Hook->>Hook: Set copied = false
        Hook-->>Button: Show "Copy"
    else Error
        API-->>Hook: Rejected
        Hook->>Hook: Set error
        Hook-->>Button: Show error message
    end
```

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

#### Analytics Event Pipeline

```mermaid
graph LR
    A[User Action] --> B[trackEvent]
    B --> C{Analytics Provider}
    
    C --> D[Google Analytics]
    C --> E[Mixpanel]
    C --> F[Segment]
    C --> G[Custom Backend]
    
    D --> H[Cloud Storage]
    E --> H
    F --> H
    G --> H
    
    H --> I[Dashboard]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style I fill:#F5A623,color:#fff
```

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

#### Debounce Timing Diagram

```mermaid
gantt
    title Debounce Behavior (500ms delay)
    dateFormat ss.SSS
    
    section User Input
    Keystroke 1    :a1, 00.000, 10ms
    Keystroke 2    :a2, 00.100, 10ms
    Keystroke 3    :a3, 00.250, 10ms
    Keystroke 4    :a4, 00.400, 10ms
    
    section Debounce Wait
    Wait period    :b1, 00.400, 500ms
    
    section API Call
    Execute search :c1, 00.900, 50ms
    
    section Result
    Only 1 API call instead of 4!
```

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

#### Throttle vs Debounce

```mermaid
graph TB
    subgraph "Debounce (Wait for silence)"
        D1[Events: ||||||||]
        D2[Wait period after last event]
        D3[Execute once]
        D1 --> D2 --> D3
    end
    
    subgraph "Throttle (Regular intervals)"
        T1[Events: ||||||||||||]
        T2[Execute at fixed intervals]
        T3[Execute multiple times]
        T1 --> T2 --> T3
    end
    
    style D3 fill:#4A90E2,color:#fff
    style T3 fill:#50E3C2,color:#fff
```

```tsx
import { useThrottle } from '@clarity-chat/react'

const [scrollPos, setScrollPos] = useState(0)
const throttledScroll = useThrottle(scrollPos, 100)
```

### useIntersectionObserver

Detect element visibility.

#### Intersection Observer Visualization

```mermaid
graph TB
    subgraph "Viewport"
        A[Visible Area]
    end
    
    subgraph "Elements"
        B[Element 1<br/>✓ Visible]
        C[Element 2<br/>✓ Visible]
        D[Element 3<br/>✓ Visible]
        E[Element 4<br/>❌ Below fold]
        F[Element 5<br/>❌ Below fold]
    end
    
    A -.-> B
    A -.-> C
    A -.-> D
    
    B --> G[Render Component]
    C --> G
    D --> G
    
    E --> H[Skip Render]
    F --> H
    
    style B fill:#7ED321,color:#fff
    style C fill:#7ED321,color:#fff
    style D fill:#7ED321,color:#fff
    style E fill:#ef4444,color:#fff
    style F fill:#ef4444,color:#fff
```

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

#### Storage Synchronization

```mermaid
sequenceDiagram
    participant Component
    participant Hook as useLocalStorage
    participant State
    participant Storage as localStorage
    
    Component->>Hook: Initialize with key
    Hook->>Storage: Read existing value
    Storage-->>Hook: Return stored value
    Hook->>State: Set initial state
    
    Component->>Hook: Update value
    Hook->>State: Update state
    Hook->>Storage: Write to localStorage
    State-->>Component: Re-render
    
    Note over Component,Storage: Other tab/window
    
    Storage->>Hook: storage event
    Hook->>State: Sync state
    State-->>Component: Re-render with synced data
```

```tsx
import { useLocalStorage } from '@clarity-chat/react'

const [messages, setMessages] = useLocalStorage('chat-history', [])
```

### useMediaQuery

Responsive design utilities.

#### Responsive Breakpoints

```mermaid
graph LR
    A[Screen Width] --> B{Breakpoint Check}
    
    B -->|< 640px| C[Mobile<br/>xs]
    B -->|640-768px| D[Mobile<br/>sm]
    B -->|768-1024px| E[Tablet<br/>md]
    B -->|1024-1280px| F[Desktop<br/>lg]
    B -->|> 1280px| G[Large Desktop<br/>xl]
    
    C --> H[Show Mobile UI]
    D --> H
    E --> I[Show Tablet UI]
    F --> J[Show Desktop UI]
    G --> J
    
    style C fill:#ef4444,color:#fff
    style D fill:#f59e0b,color:#fff
    style E fill:#F5A623,color:#fff
    style F fill:#7ED321,color:#fff
    style G fill:#10b981,color:#fff
```

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

#### Previous Value Tracking

```mermaid
sequenceDiagram
    participant Component
    participant Hook as usePrevious
    participant Ref
    
    Component->>Hook: usePrevious(currentValue)
    Hook->>Ref: Read ref.current
    Note over Ref: undefined (first render)
    Hook-->>Component: Return undefined
    
    Note over Component: Render complete
    
    Hook->>Ref: Set ref.current = currentValue
    
    Note over Component: Next render
    
    Component->>Hook: usePrevious(newValue)
    Hook->>Ref: Read ref.current
    Note over Ref: oldValue
    Hook-->>Component: Return oldValue
    
    Hook->>Ref: Set ref.current = newValue
```

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

```mermaid
graph TB
    subgraph "Hook Categories"
        A[Core: 4 hooks]
        B[Error: 2 hooks]
        C[Input: 2 hooks]
        D[Messages: 2 hooks]
        E[Analytics: 3 hooks]
        F[UI: 4 hooks]
        G[Performance: 3 hooks]
        H[Storage: 2 hooks]
        I[Responsive: 2 hooks]
        J[Utility: 3 hooks]
    end
    
    K[Total: 27 Hooks] --> A
    K --> B
    K --> C
    K --> D
    K --> E
    K --> F
    K --> G
    K --> H
    K --> I
    K --> J
    
    style K fill:#4A90E2,color:#fff
    style A fill:#50E3C2,color:#fff
    style E fill:#F5A623,color:#fff
    style G fill:#ec4899,color:#fff
```

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

## 🎯 Hook Composition Patterns

### Pattern 1: Chat with Persistence

```mermaid
graph LR
    A[Component] --> B[useChat]
    B --> C[useLocalStorage]
    C --> D[Browser Storage]
    
    B --> E[useErrorRecovery]
    E --> F[Retry Logic]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#F5A623,color:#fff
```

### Pattern 2: Streaming with Analytics

```mermaid
graph LR
    A[Component] --> B[useStreaming]
    A --> C[useTokenTracker]
    A --> D[useAnalytics]
    
    B --> E[Stream chunks]
    C --> F[Count tokens]
    D --> G[Track events]
    
    E --> H[Update UI]
    F --> H
    G --> I[Send to backend]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style C fill:#F5A623,color:#fff
    style D fill:#ec4899,color:#fff
```

### Pattern 3: Responsive Chat

```mermaid
graph TB
    A[Component] --> B[useMediaQuery]
    A --> C[useWindowSize]
    A --> D[useMobileKeyboard]
    
    B --> E{Is Mobile?}
    C --> F[Adjust Layout]
    D --> G[Handle Keyboard]
    
    E -->|Yes| H[Mobile UI]
    E -->|No| I[Desktop UI]
    
    style A fill:#4A90E2,color:#fff
    style B fill:#50E3C2,color:#fff
    style H fill:#F5A623,color:#fff
    style I fill:#ec4899,color:#fff
```

---

## 📖 Related Documentation

- [Components API](./components.md)
- [Utilities API](./utilities.md)
- [TypeScript Types](./types.md)
- [Examples](../examples/README.md)

---

**Need Help?** Join our [Discord Community](https://discord.gg/clarity-chat)
