# Hooks API Reference

Complete reference for all 25+ custom hooks in Clarity Chat.

---

## 📑 Table of Contents

### Core Hooks
- [useChat](#usechat)
- [useStreaming](#usestreaming)
- [useStreamingSSE](#usestreamingsse)
- [useStreamingWebSocket](#usestreamingwebsocket)

### Message Operations
- [useMessageOperations](#usemessageoperations)
- [useOptimisticMessage](#useoptimisticmessage)
- [useRealisticTyping](#userealistictyping)

### Error Handling
- [useErrorRecovery](#useerrorrecovery)
- [useAsyncError](#useasyncerror)

### Analytics
- [useAnalytics](#useanalytics)
- [useTrackEvent](#usetrackevent)
- [usePageView](#usepageview)

### Voice & Mobile
- [useVoiceInput](#usevoiceinput)
- [useMobileKeyboard](#usemobilekeyboard)

### Performance
- [usePerformance](#useperformance)
- [useTokenTracker](#usetokentracker)

### UI Utilities
- [useAutoScroll](#useautoscroll)
- [useClipboard](#useclipboard)
- [useKeyboardShortcuts](#usekeyboardshortcuts)

### General Utilities
- [useDebounce](#usedebounce)
- [useThrottle](#usethrottle)
- [useLocalStorage](#uselocalstorage)
- [useMediaQuery](#usemediaquery)
- [useMounted](#usemounted)
- [useToggle](#usetoggle)
- [usePrevious](#useprevious)

---

## Core Hooks

### useChat

Main hook for managing chat state and operations.

**Import:**
```tsx
import { useChat } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useChat(config?: UseChatConfig): UseChatReturn

interface UseChatConfig {
  initialMessages?: Message[]
  onError?: (error: Error) => void
  persistMessages?: boolean
  storageKey?: string
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  addMessage: (message: Message) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  deleteMessage: (id: string) => void
  clearMessages: () => void
  retryLastMessage: () => Promise<void>
}
```

**Usage Example:**

```tsx
function ChatApp() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage,
    updateMessage,
    deleteMessage,
    clearMessages,
    retryLastMessage,
  } = useChat({
    initialMessages: [],
    persistMessages: true,
    storageKey: 'my-chat-history',
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  const handleSend = async (content: string) => {
    await sendMessage(content)
  }

  return (
    <div>
      <MessageList
        messages={messages}
        onDelete={deleteMessage}
        onRetry={retryLastMessage}
      />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
      {error && <ErrorDisplay error={error} />}
    </div>
  )
}
```

**Advanced Usage with Custom API:**

```tsx
function AdvancedChat() {
  const { messages, sendMessage } = useChat({
    onError: async (error) => {
      await fetch('/api/log-error', {
        method: 'POST',
        body: JSON.stringify({ error: error.message }),
      })
    },
  })

  // Custom send with streaming
  const handleSendWithStreaming = async (content: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk
        
        // Update message in real-time
        updateMessage('temp-id', { content: assistantMessage })
      }
    } catch (error) {
      console.error('Streaming error:', error)
    }
  }

  return <ChatWindow messages={messages} onSendMessage={handleSendWithStreaming} />
}
```

---

### useStreaming

Hook for handling streaming AI responses (SSE and WebSocket).

**Import:**
```tsx
import { useStreaming } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useStreaming(config?: UseStreamingConfig): UseStreamingReturn

interface UseStreamingConfig {
  onChunk?: (chunk: string) => void
  onComplete?: (fullMessage: string) => void
  onError?: (error: Error) => void
  protocol?: 'sse' | 'websocket'
}

interface UseStreamingReturn {
  isStreaming: boolean
  streamedContent: string
  error: Error | null
  startStream: (url: string, options?: RequestInit) => Promise<void>
  stopStream: () => void
  resetStream: () => void
}
```

**Usage Example:**

```tsx
function StreamingChat() {
  const {
    isStreaming,
    streamedContent,
    error,
    startStream,
    stopStream,
  } = useStreaming({
    onChunk: (chunk) => {
      console.log('Received chunk:', chunk)
    },
    onComplete: (fullMessage) => {
      console.log('Stream complete:', fullMessage)
    },
    onError: (error) => {
      console.error('Stream error:', error)
    },
    protocol: 'sse', // or 'websocket'
  })

  const handleSend = async (content: string) => {
    await startStream('/api/chat-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content }),
    })
  }

  return (
    <div>
      <MessageList
        messages={[...messages, {
          id: 'streaming',
          role: 'assistant',
          content: streamedContent,
          timestamp: new Date(),
        }]}
      />
      <ChatInput onSend={handleSend} disabled={isStreaming} />
      {isStreaming && (
        <button onClick={stopStream}>Stop Generation</button>
      )}
    </div>
  )
}
```

---

### useMessageOperations

Hook for advanced message operations (edit, regenerate, branch, undo/redo).

**Import:**
```tsx
import { useMessageOperations } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useMessageOperations(
  messages: Message[],
  setMessages: (messages: Message[]) => void
): UseMessageOperationsReturn

interface UseMessageOperationsReturn {
  editMessage: (id: string, newContent: string) => void
  regenerateMessage: (id: string) => Promise<void>
  branchConversation: (fromMessageId: string) => void
  deleteMessage: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  history: Message[][]
}
```

**Usage Example:**

```tsx
function EditableChat() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const {
    editMessage,
    regenerateMessage,
    branchConversation,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations(messages, setMessages)

  return (
    <div>
      <MessageList
        messages={messages}
        onEdit={(id, content) => editMessage(id, content)}
        onRegenerate={(id) => regenerateMessage(id)}
        onDelete={(id) => deleteMessage(id)}
        onBranch={(id) => branchConversation(id)}
      />
      <div className="toolbar">
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
    </div>
  )
}
```

---

### useErrorRecovery

Hook for automatic error recovery with exponential backoff.

**Import:**
```tsx
import { useErrorRecovery } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useErrorRecovery(config?: UseErrorRecoveryConfig): UseErrorRecoveryReturn

interface UseErrorRecoveryConfig {
  maxRetries?: number
  retryDelay?: number
  backoffMultiplier?: number
  onError?: (error: Error) => void
  onRetry?: (attempt: number) => void
  onSuccess?: () => void
}

interface UseErrorRecoveryReturn {
  executeWithRetry: <T>(
    fn: () => Promise<T>,
    options?: RetryOptions
  ) => Promise<T>
  isRetrying: boolean
  retryCount: number
  lastError: Error | null
  reset: () => void
}
```

**Usage Example:**

```tsx
function ResilientChat() {
  const {
    executeWithRetry,
    isRetrying,
    retryCount,
    lastError,
  } = useErrorRecovery({
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2, // 1s, 2s, 4s
    onError: (error) => {
      console.error('Error occurred:', error)
    },
    onRetry: (attempt) => {
      console.log(`Retrying... Attempt ${attempt}`)
    },
  })

  const handleSend = async (content: string) => {
    try {
      await executeWithRetry(async () => {
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: content }),
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        return await response.json()
      })
    } catch (error) {
      console.error('Failed after retries:', error)
    }
  }

  return (
    <div>
      <ChatInput onSend={handleSend} disabled={isRetrying} />
      {isRetrying && (
        <div className="retry-indicator">
          Retrying... (Attempt {retryCount + 1}/3)
        </div>
      )}
      {lastError && <ErrorDisplay error={lastError} />}
    </div>
  )
}
```

---

### useVoiceInput

Hook for voice-to-text functionality using Web Speech API.

**Import:**
```tsx
import { useVoiceInput } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useVoiceInput(config?: UseVoiceInputConfig): UseVoiceInputReturn

interface UseVoiceInputConfig {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onTranscript?: (text: string, isFinal: boolean) => void
  onError?: (error: Error) => void
}

interface UseVoiceInputReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: Error | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  isSupported: boolean
}
```

**Usage Example:**

```tsx
function VoiceEnabledChat() {
  const [inputValue, setInputValue] = useState('')
  
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
  } = useVoiceInput({
    lang: 'en-US',
    continuous: false,
    interimResults: true,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        setInputValue(text)
        sendMessage(text)
      }
    },
    onError: (error) => {
      console.error('Voice error:', error)
    },
  })

  if (!isSupported) {
    return <div>Voice input not supported in this browser</div>
  }

  return (
    <div>
      <input
        value={inputValue || interimTranscript}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type or speak..."
      />
      <button
        onClick={isListening ? stopListening : startListening}
        className={isListening ? 'recording' : ''}
      >
        {isListening ? '🔴 Stop' : '🎤 Speak'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </div>
  )
}
```

---

### useMobileKeyboard

Hook for detecting and handling mobile keyboard visibility.

**Import:**
```tsx
import { useMobileKeyboard } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useMobileKeyboard(config?: UseMobileKeyboardConfig): UseMobileKeyboardReturn

interface UseMobileKeyboardConfig {
  onShow?: (height: number) => void
  onHide?: () => void
  autoScroll?: boolean
  scrollTarget?: HTMLElement | null
}

interface UseMobileKeyboardReturn {
  isKeyboardVisible: boolean
  keyboardHeight: number
  visualViewportHeight: number
}
```

**Usage Example:**

```tsx
function MobileOptimizedChat() {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  
  const {
    isKeyboardVisible,
    keyboardHeight,
    visualViewportHeight,
  } = useMobileKeyboard({
    autoScroll: true,
    scrollTarget: chatContainerRef.current,
    onShow: (height) => {
      console.log('Keyboard shown, height:', height)
    },
    onHide: () => {
      console.log('Keyboard hidden')
    },
  })

  return (
    <div
      ref={chatContainerRef}
      className="chat-container"
      style={{
        height: isKeyboardVisible
          ? `${visualViewportHeight}px`
          : '100vh',
        paddingBottom: isKeyboardVisible ? `${keyboardHeight}px` : '0',
      }}
    >
      <MessageList messages={messages} />
      <ChatInput />
    </div>
  )
}
```

---

### useTokenTracker

Hook for tracking token usage and cost estimation.

**Import:**
```tsx
import { useTokenTracker } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useTokenTracker(config?: UseTokenTrackerConfig): UseTokenTrackerReturn

interface UseTokenTrackerConfig {
  model?: string
  pricing?: {
    inputTokenCost: number
    outputTokenCost: number
  }
}

interface UseTokenTrackerReturn {
  totalTokens: number
  inputTokens: number
  outputTokens: number
  estimatedCost: number
  trackMessage: (message: Message) => void
  reset: () => void
}
```

**Usage Example:**

```tsx
function CostAwareChat() {
  const {
    totalTokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    trackMessage,
    reset,
  } = useTokenTracker({
    model: 'gpt-4',
    pricing: {
      inputTokenCost: 0.03 / 1000,  // $0.03 per 1K tokens
      outputTokenCost: 0.06 / 1000, // $0.06 per 1K tokens
    },
  })

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      metadata: { tokens: estimateTokens(content) },
    }
    trackMessage(userMessage)

    // Send to API...
    const aiMessage: Message = { /* ... */ }
    trackMessage(aiMessage)
  }

  return (
    <div>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
      <div className="token-stats">
        <div>Total Tokens: {totalTokens.toLocaleString()}</div>
        <div>Estimated Cost: ${estimatedCost.toFixed(4)}</div>
        <button onClick={reset}>Reset Counter</button>
      </div>
    </div>
  )
}
```

---

## UI Utility Hooks

### useAutoScroll

Automatically scrolls to bottom on new messages.

**Import:**
```tsx
import { useAutoScroll } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useAutoScroll<T extends HTMLElement>(
  dependencies: any[],
  config?: UseAutoScrollConfig
): RefObject<T>

interface UseAutoScrollConfig {
  behavior?: ScrollBehavior
  enabled?: boolean
  threshold?: number
}
```

**Usage Example:**

```tsx
function AutoScrollChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const scrollRef = useAutoScroll<HTMLDivElement>([messages], {
    behavior: 'smooth',
    enabled: true,
    threshold: 100, // Don't auto-scroll if user scrolled up >100px
  })

  return (
    <div ref={scrollRef} className="message-container">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  )
}
```

---

### useClipboard

Copy text to clipboard with status feedback.

**Import:**
```tsx
import { useClipboard } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useClipboard(timeout?: number): UseClipboardReturn

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>
  copied: boolean
  error: Error | null
}
```

**Usage Example:**

```tsx
function CopyableMessage({ content }: { content: string }) {
  const { copy, copied, error } = useClipboard(2000)

  return (
    <div className="message">
      <p>{content}</p>
      <button onClick={() => copy(content)}>
        {copied ? '✓ Copied!' : '📋 Copy'}
      </button>
      {error && <span className="error">{error.message}</span>}
    </div>
  )
}
```

---

## General Utility Hooks

### useDebounce

Debounce a value with configurable delay.

**Import:**
```tsx
import { useDebounce } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useDebounce<T>(value: T, delay: number): T
```

**Usage Example:**

```tsx
function SearchableChat() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    if (debouncedSearch) {
      // Perform search
      searchMessages(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search messages..."
    />
  )
}
```

---

### useLocalStorage

Persist state in localStorage with automatic serialization.

**Import:**
```tsx
import { useLocalStorage } from '@clarity-chat/react'
```

**Signature:**
```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void]
```

**Usage Example:**

```tsx
function PersistentChat() {
  const [messages, setMessages, clearMessages] = useLocalStorage<Message[]>(
    'chat-history',
    []
  )

  const handleSend = (content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <div>
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
      <button onClick={clearMessages}>Clear History</button>
    </div>
  )
}
```

---

## 📚 Additional Resources

- **[Components API](./components.md)** - All components
- **[Utilities API](./utilities.md)** - Helper functions
- **[TypeScript Types](./types.md)** - Type definitions
- **[Examples](../examples/README.md)** - Real-world usage

---

**Next:** [Utilities API Reference →](./utilities.md)
