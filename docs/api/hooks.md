# Hooks API Reference

Complete reference for all custom hooks in Clarity Chat.

---

## 📚 **Table of Contents**

### Chat Hooks
- [useChat](#usechat)
- [useStreaming](#usestreaming)
- [useStreamingSSE](#usestreamingsse)
- [useStreamingWebSocket](#usestreamingwebsocket)
- [useMessageOperations](#usemessageoperations)

### UI Hooks
- [useAutoScroll](#useautoscroll)
- [useClipboard](#useclipboard)
- [useToggle](#usetoggle)
- [useRealisticTyping](#userealistictyping)

### Performance Hooks
- [useDebounce](#usedebounce)
- [useThrottle](#usethrottle)
- [usePerformance](#useperformance)
- [useOptimisticMessage](#useoptimisticmessage)

### Error Handling Hooks
- [useErrorRecovery](#useerrorrecovery)
- [useAsyncError](#useasyncerror)

### Analytics Hooks
- [useAnalytics](#useanalytics)
- [useTokenTracker](#usetokentracker)

### Accessibility Hooks
- [useKeyboardShortcuts](#usekeyboardshortcuts)
- [useFocusTrap](#usefocustrap)

### Mobile Hooks
- [useMobileKeyboard](#usemobilekeyboard)
- [useVoiceInput](#usevoiceinput)

### Utility Hooks
- [useLocalStorage](#uselocalstorage)
- [useMediaQuery](#usemediaquery)
- [useMounted](#usemounted)
- [usePrevious](#useprevious)
- [useWindowSize](#usewindowsize)
- [useEventListener](#useeventlistener)
- [useIntersectionObserver](#useintersectionobserver)

---

## 💬 **Chat Hooks**

### **useChat**

Main hook for managing chat state and operations.

#### **Import**

```typescript
import { useChat } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useChat(options?: UseChatOptions): UseChatReturn

interface UseChatOptions {
  initialMessages?: Message[]
  maxMessages?: number
  persistKey?: string
  onError?: (error: Error) => void
}

interface UseChatReturn {
  messages: Message[]
  sendMessage: (content: string, options?: SendOptions) => Promise<void>
  editMessage: (id: string, content: string) => void
  deleteMessage: (id: string) => void
  clearMessages: () => void
  isLoading: boolean
  error: Error | null
}
```

#### **Usage**

```typescript
function ChatApp() {
  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    clearMessages,
    isLoading,
    error,
  } = useChat({
    initialMessages: [],
    maxMessages: 1000,
    persistKey: 'my-chat',
    onError: (error) => console.error('Chat error:', error),
  })

  return (
    <div>
      <MessageList messages={messages} />
      <ChatInput
        onSubmit={sendMessage}
        disabled={isLoading}
      />
      {error && <ErrorMessage error={error} />}
    </div>
  )
}
```

---

### **useStreaming**

Hook for handling streaming AI responses.

#### **Import**

```typescript
import { useStreaming } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useStreaming(options?: UseStreamingOptions): UseStreamingReturn

interface UseStreamingOptions {
  onChunk?: (chunk: string) => void
  onComplete?: (fullText: string) => void
  onError?: (error: Error) => void
}

interface UseStreamingReturn {
  stream: (url: string, options?: RequestInit) => Promise<void>
  streamMessage: (message: string) => Promise<void>
  cancel: () => void
  isStreaming: boolean
  currentText: string
  error: Error | null
}
```

#### **Usage**

```typescript
function StreamingChat() {
  const { messages, sendMessage } = useChat()
  const { stream, isStreaming, currentText, cancel } = useStreaming({
    onChunk: (chunk) => console.log('Chunk:', chunk),
    onComplete: (text) => console.log('Complete:', text),
  })

  const handleSend = async (content: string) => {
    await sendMessage(content)
    
    await stream('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })
  }

  return (
    <div>
      <MessageList messages={messages} />
      {isStreaming && (
        <div>
          <ThinkingIndicator />
          <button onClick={cancel}>Cancel</button>
          <p>{currentText}</p>
        </div>
      )}
      <ChatInput onSubmit={handleSend} disabled={isStreaming} />
    </div>
  )
}
```

---

### **useMessageOperations**

Hook for advanced message operations (edit, regenerate, branch, undo/redo).

#### **Import**

```typescript
import { useMessageOperations } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useMessageOperations(
  messages: Message[]
): UseMessageOperationsReturn

interface UseMessageOperationsReturn {
  editMessage: (id: string, content: string) => void
  regenerateMessage: (id: string) => Promise<void>
  branchConversation: (fromMessageId: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  history: Message[][]
}
```

#### **Usage**

```typescript
function AdvancedChat() {
  const { messages } = useChat()
  const {
    editMessage,
    regenerateMessage,
    branchConversation,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations(messages)

  return (
    <div>
      <button onClick={undo} disabled={!canUndo}>Undo</button>
      <button onClick={redo} disabled={!canRedo}>Redo</button>
      
      <MessageList
        messages={messages}
        onEdit={editMessage}
        onRegenerate={regenerateMessage}
        onBranch={branchConversation}
      />
    </div>
  )
}
```

---

## 🎨 **UI Hooks**

### **useAutoScroll**

Automatically scrolls to bottom when new messages arrive.

#### **Import**

```typescript
import { useAutoScroll } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useAutoScroll<T extends HTMLElement>(
  dependencies: any[],
  options?: UseAutoScrollOptions
): React.RefObject<T>

interface UseAutoScrollOptions {
  enabled?: boolean
  smooth?: boolean
  threshold?: number // px from bottom
  onScroll?: () => void
}
```

#### **Usage**

```typescript
function Chat() {
  const { messages } = useChat()
  const scrollRef = useAutoScroll<HTMLDivElement>([messages], {
    enabled: true,
    smooth: true,
    threshold: 100,
  })

  return (
    <div ref={scrollRef} className="overflow-y-auto">
      <MessageList messages={messages} />
    </div>
  )
}
```

---

### **useClipboard**

Copy text to clipboard with success/error handling.

#### **Import**

```typescript
import { useClipboard } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useClipboard(options?: UseClipboardOptions): UseClipboardReturn

interface UseClipboardOptions {
  timeout?: number // ms
  onSuccess?: () => void
  onError?: (error: Error) => void
}

interface UseClipboardReturn {
  copy: (text: string) => Promise<void>
  copied: boolean
  error: Error | null
}
```

#### **Usage**

```typescript
function CopyButton({ text }: { text: string }) {
  const { copy, copied, error } = useClipboard({
    timeout: 2000,
    onSuccess: () => console.log('Copied!'),
  })

  return (
    <button onClick={() => copy(text)}>
      {copied ? '✓ Copied' : 'Copy'}
      {error && <span>Error: {error.message}</span>}
    </button>
  )
}
```

---

### **useToggle**

Toggle boolean state with helper functions.

#### **Import**

```typescript
import { useToggle } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useToggle(initialValue = false): UseToggleReturn

type UseToggleReturn = [
  value: boolean,
  toggle: () => void,
  setTrue: () => void,
  setFalse: () => void
]
```

#### **Usage**

```typescript
function Sidebar() {
  const [isOpen, toggle, open, close] = useToggle(false)

  return (
    <div>
      <button onClick={toggle}>Toggle</button>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
      
      {isOpen && <SidebarContent />}
    </div>
  )
}
```

---

## ⚡ **Performance Hooks**

### **useDebounce**

Debounce a value to prevent excessive updates.

#### **Import**

```typescript
import { useDebounce } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useDebounce<T>(value: T, delay: number): T
```

#### **Usage**

```typescript
function SearchableChat() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    // Only searches after 300ms of no typing
    if (debouncedSearch) {
      performSearch(debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search messages..."
    />
  )
}
```

---

### **useThrottle**

Throttle a function to limit execution rate.

#### **Import**

```typescript
import { useThrottle } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T
```

#### **Usage**

```typescript
function ScrollTracker() {
  const handleScroll = useThrottle((e: Event) => {
    console.log('Scroll position:', window.scrollY)
  }, 100)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return <div>Scroll tracker active</div>
}
```

---

### **useOptimisticMessage**

Optimistically update UI before server confirmation.

#### **Import**

```typescript
import { useOptimisticMessage } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useOptimisticMessage(): UseOptimisticMessageReturn

interface UseOptimisticMessageReturn {
  addOptimistic: (message: Message) => string // Returns temp ID
  confirmOptimistic: (tempId: string, realId: string) => void
  rejectOptimistic: (tempId: string) => void
  optimisticMessages: Message[]
}
```

#### **Usage**

```typescript
function OptimisticChat() {
  const { messages } = useChat()
  const {
    addOptimistic,
    confirmOptimistic,
    rejectOptimistic,
    optimisticMessages,
  } = useOptimisticMessage()

  const handleSend = async (content: string) => {
    const tempId = addOptimistic({
      role: 'user',
      content,
      timestamp: new Date(),
    })

    try {
      const response = await api.sendMessage(content)
      confirmOptimistic(tempId, response.id)
    } catch (error) {
      rejectOptimistic(tempId)
    }
  }

  return (
    <MessageList messages={[...messages, ...optimisticMessages]} />
  )
}
```

---

## 🛡️ **Error Handling Hooks**

### **useErrorRecovery**

Automatic error recovery with retry logic.

#### **Import**

```typescript
import { useErrorRecovery } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useErrorRecovery(
  options?: UseErrorRecoveryOptions
): UseErrorRecoveryReturn

interface UseErrorRecoveryOptions {
  maxRetries?: number
  retryDelay?: number
  exponentialBackoff?: boolean
  onError?: (error: Error, attempt: number) => void
  onSuccess?: () => void
  shouldRetry?: (error: Error) => boolean
}

interface UseErrorRecoveryReturn {
  handleError: (error: Error) => void
  retry: () => Promise<void>
  reset: () => void
  isRetrying: boolean
  retryCount: number
  lastError: Error | null
}
```

#### **Usage**

```typescript
function ResilientChat() {
  const {
    handleError,
    retry,
    isRetrying,
    retryCount,
    lastError,
  } = useErrorRecovery({
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
    shouldRetry: (error) => error.message !== 'Unauthorized',
  })

  const handleSend = async (content: string) => {
    try {
      await api.sendMessage(content)
    } catch (error) {
      handleError(error as Error)
    }
  }

  return (
    <div>
      {lastError && (
        <div>
          Error: {lastError.message}
          {isRetrying && <span> (Retrying... {retryCount}/3)</span>}
          <button onClick={retry}>Retry Now</button>
        </div>
      )}
      <ChatInput onSubmit={handleSend} />
    </div>
  )
}
```

---

## 📊 **Analytics Hooks**

### **useAnalytics**

Track events and user interactions.

#### **Import**

```typescript
import { useAnalytics } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useAnalytics(): UseAnalyticsReturn

interface UseAnalyticsReturn {
  track: (event: string, properties?: Record<string, any>) => void
  identify: (userId: string, traits?: Record<string, any>) => void
  page: (name: string, properties?: Record<string, any>) => void
}
```

#### **Usage**

```typescript
function AnalyticsChat() {
  const { track, identify } = useAnalytics()

  useEffect(() => {
    identify('user-123', {
      name: 'John Doe',
      plan: 'premium',
    })
  }, [])

  const handleSend = (content: string) => {
    track('message_sent', {
      length: content.length,
      has_attachments: false,
    })
    // ... send message
  }

  return <ChatInput onSubmit={handleSend} />
}
```

---

### **useTokenTracker**

Track token usage and cost estimation.

#### **Import**

```typescript
import { useTokenTracker } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useTokenTracker(
  options?: UseTokenTrackerOptions
): UseTokenTrackerReturn

interface UseTokenTrackerOptions {
  model?: string
  costPerToken?: number
  onLimitReached?: (usage: TokenUsage) => void
}

interface UseTokenTrackerReturn {
  tokens: number
  cost: number
  addTokens: (count: number) => void
  reset: () => void
  usage: TokenUsage
}
```

#### **Usage**

```typescript
function TokenAwareChat() {
  const {
    tokens,
    cost,
    addTokens,
    usage,
  } = useTokenTracker({
    model: 'gpt-4',
    costPerToken: 0.00003,
    onLimitReached: (usage) => {
      alert(`Token limit reached: ${usage.tokens}`)
    },
  })

  return (
    <div>
      <TokenCounter tokens={tokens} cost={cost} />
      <ChatWindow
        onSendMessage={(content) => {
          // Estimate tokens
          addTokens(content.length / 4)
          // ... send message
        }}
      />
    </div>
  )
}
```

---

## ♿ **Accessibility Hooks**

### **useKeyboardShortcuts**

Register global keyboard shortcuts.

#### **Import**

```typescript
import { useKeyboardShortcuts } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useKeyboardShortcuts(
  shortcuts: Shortcut[],
  options?: UseKeyboardShortcutsOptions
): void

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: () => void
  description?: string
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  preventDefault?: boolean
}
```

#### **Usage**

```typescript
function ChatWithShortcuts() {
  const [showHelp, setShowHelp] = useState(false)

  useKeyboardShortcuts([
    {
      key: '/',
      handler: () => focusInput(),
      description: 'Focus input',
    },
    {
      key: '?',
      shift: true,
      handler: () => setShowHelp(true),
      description: 'Show help',
    },
    {
      key: 'k',
      ctrl: true,
      handler: () => clearChat(),
      description: 'Clear chat',
    },
  ])

  return <ChatWindow />
}
```

---

## 📱 **Mobile Hooks**

### **useMobileKeyboard**

Detect and handle mobile keyboard visibility.

#### **Import**

```typescript
import { useMobileKeyboard } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useMobileKeyboard(
  options?: UseMobileKeyboardOptions
): UseMobileKeyboardReturn

interface UseMobileKeyboardOptions {
  onShow?: () => void
  onHide?: () => void
  autoScroll?: boolean
}

interface UseMobileKeyboardReturn {
  isKeyboardVisible: boolean
  keyboardHeight: number
  viewportHeight: number
}
```

#### **Usage**

```typescript
function MobileChat() {
  const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard({
    onShow: () => console.log('Keyboard shown'),
    onHide: () => console.log('Keyboard hidden'),
    autoScroll: true,
  })

  return (
    <div
      style={{
        paddingBottom: isKeyboardVisible ? keyboardHeight : 0,
      }}
    >
      <ChatWindow />
    </div>
  )
}
```

---

### **useVoiceInput**

Web Speech API integration for voice input.

#### **Import**

```typescript
import { useVoiceInput } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useVoiceInput(
  options?: UseVoiceInputOptions
): UseVoiceInputReturn

interface UseVoiceInputOptions {
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
  start: () => void
  stop: () => void
  isSupported: boolean
  error: Error | null
}
```

#### **Usage**

```typescript
function VoiceEnabledChat() {
  const {
    isListening,
    transcript,
    interimTranscript,
    start,
    stop,
    isSupported,
  } = useVoiceInput({
    lang: 'en-US',
    continuous: true,
    interimResults: true,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        sendMessage(text)
      }
    },
  })

  if (!isSupported) {
    return <div>Voice input not supported in this browser</div>
  }

  return (
    <div>
      <button onClick={isListening ? stop : start}>
        {isListening ? 'Stop' : 'Start'} Recording
      </button>
      
      {isListening && (
        <div>
          <p>You said: {transcript}</p>
          <p className="text-gray-400">{interimTranscript}</p>
        </div>
      )}
    </div>
  )
}
```

---

## 🔧 **Utility Hooks**

### **useLocalStorage**

Persist state to localStorage with SSR support.

#### **Import**

```typescript
import { useLocalStorage } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void]
```

#### **Usage**

```typescript
function PersistentChat() {
  const [messages, setMessages, clearMessages] = useLocalStorage<Message[]>(
    'chat-messages',
    []
  )

  return (
    <div>
      <button onClick={clearMessages}>Clear History</button>
      <MessageList messages={messages} />
    </div>
  )
}
```

---

### **useMediaQuery**

Responsive design with media queries.

#### **Import**

```typescript
import { useMediaQuery } from '@clarity-chat/react'
```

#### **Signature**

```typescript
function useMediaQuery(query: string): boolean
```

#### **Usage**

```typescript
function ResponsiveChat() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <ChatWindow
      showSidebar={!isMobile}
      theme={prefersDark ? themes.dark : themes.default}
    />
  )
}
```

---

## 🔗 **Related Documentation**

- [Components API](./components.md) - All components
- [Utilities API](./utilities.md) - Helper functions
- [Examples](../examples/README.md) - Code examples

---

**Need help?** [Join our Discord](https://discord.gg/clarity-chat)
