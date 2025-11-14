# Hooks API

Complete reference for all Clarity Chat hooks.

## useChat

Main hook for managing chat state and operations.

### Signature

```typescript
function useChat(options?: UseChatOptions): UseChatReturn
```

### Options

```typescript
interface UseChatOptions {
  initialMessages?: Message[]
  onError?: (error: Error) => void
  maxMessages?: number
}
```

### Return Value

```typescript
interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}
```

### Usage

```typescript
const { 
  messages, 
  isLoading, 
  sendMessage,
  undo,
  redo,
} = useChat({
  initialMessages: [{
    id: '1',
    role: 'assistant',
    content: 'Hello!',
    timestamp: Date.now(),
  }],
  onError: (error) => console.error(error),
})
```

---

## useStreamingChat

Hook for handling streaming AI responses with Server-Sent Events.

### Signature

```typescript
function useStreamingChat(options: UseStreamingChatOptions): UseStreamingChatReturn
```

### Options

```typescript
interface UseStreamingChatOptions {
  apiEndpoint: string
  onChunk?: (chunk: string) => void
  onComplete?: (fullMessage: string) => void
  onError?: (error: Error) => void
}
```

### Return Value

```typescript
interface UseStreamingChatReturn {
  messages: Message[]
  isStreaming: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  cancelStream: () => void
}
```

### Usage

```typescript
const { 
  messages, 
  isStreaming, 
  sendMessage,
  cancelStream,
} = useStreamingChat({
  apiEndpoint: '/api/chat/stream',
  onChunk: (chunk) => console.log('Received:', chunk),
  onComplete: (msg) => console.log('Complete:', msg),
})
```

---

## useMessageOperations

Hook for message editing, regeneration, and branching.

### Signature

```typescript
function useMessageOperations(messages: Message[]): UseMessageOperationsReturn
```

### Return Value

```typescript
interface UseMessageOperationsReturn {
  messages: Message[]
  editMessage: (id: string, newContent: string) => void
  deleteMessage: (id: string) => void
  regenerateMessage: (id: string) => Promise<void>
  branchFromMessage: (id: string) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}
```

### Usage

```typescript
const {
  messages,
  editMessage,
  regenerateMessage,
  branchFromMessage,
  undo,
  redo,
} = useMessageOperations(initialMessages)
```

---

## useTokenCount

Hook for counting tokens and estimating costs.

### Signature

```typescript
function useTokenCount(options: UseTokenCountOptions): UseTokenCountReturn
```

### Options

```typescript
interface UseTokenCountOptions {
  messages: Message[]
  model?: string
  encoding?: 'cl100k_base' | 'p50k_base' | 'r50k_base'
}
```

### Return Value

```typescript
interface UseTokenCountReturn {
  tokenCount: number
  estimatedCost: number
  percentage: number // of max tokens
  isNearLimit: boolean
}
```

### Usage

```typescript
const { 
  tokenCount, 
  estimatedCost, 
  isNearLimit 
} = useTokenCount({
  messages,
  model: 'gpt-4',
})
```

---

## useFileUpload

Hook for handling file uploads with validation.

### Signature

```typescript
function useFileUpload(options?: UseFileUploadOptions): UseFileUploadReturn
```

### Options

```typescript
interface UseFileUploadOptions {
  maxSize?: number
  maxFiles?: number
  accept?: string
  onUpload?: (files: File[]) => Promise<void>
  onError?: (error: Error) => void
}
```

### Return Value

```typescript
interface UseFileUploadReturn {
  files: File[]
  isUploading: boolean
  error: Error | null
  uploadFiles: (files: File[]) => Promise<void>
  removeFile: (index: number) => void
  clearFiles: () => void
}
```

### Usage

```typescript
const {
  files,
  isUploading,
  uploadFiles,
  removeFile,
} = useFileUpload({
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  accept: 'image/*,.pdf',
  onUpload: async (files) => {
    // Upload logic
  },
})
```

---

## useContextManager

Hook for managing conversation context (documents, images, etc.).

### Signature

```typescript
function useContextManager(options?: UseContextManagerOptions): UseContextManagerReturn
```

### Options

```typescript
interface UseContextManagerOptions {
  initialContext?: ContextItem[]
  maxContextSize?: number
}
```

### Return Value

```typescript
interface UseContextManagerReturn {
  context: ContextItem[]
  addContext: (item: ContextItem) => void
  removeContext: (id: string) => void
  clearContext: () => void
  getContextSize: () => number
}
```

### Usage

```typescript
const {
  context,
  addContext,
  removeContext,
  clearContext,
} = useContextManager({
  maxContextSize: 1024 * 1024, // 1MB
})
```

---

## useNetworkStatus

Hook for monitoring network connectivity.

### Signature

```typescript
function useNetworkStatus(): UseNetworkStatusReturn
```

### Return Value

```typescript
interface UseNetworkStatusReturn {
  isOnline: boolean
  isSlow: boolean
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
  reconnect: () => Promise<void>
}
```

### Usage

```typescript
const { 
  isOnline, 
  isSlow, 
  reconnect 
} = useNetworkStatus()

if (!isOnline) {
  return <div>You're offline. <button onClick={reconnect}>Reconnect</button></div>
}
```

---

## useLocalStorage

Hook for persisting chat state to localStorage.

### Signature

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

### Usage

```typescript
const [messages, setMessages] = useLocalStorage<Message[]>('chat-messages', [])
```

---

## useDebounce

Hook for debouncing values (useful for search, typing indicators).

### Signature

```typescript
function useDebounce<T>(value: T, delay: number): T
```

### Usage

```typescript
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  // Search with debounced query
  performSearch(debouncedQuery)
}, [debouncedQuery])
```

---

## useClipboard

Hook for copying text to clipboard.

### Signature

```typescript
function useClipboard(): UseClipboardReturn
```

### Return Value

```typescript
interface UseClipboardReturn {
  copy: (text: string) => Promise<void>
  isCopied: boolean
  error: Error | null
}
```

### Usage

```typescript
const { copy, isCopied } = useClipboard()

<button onClick={() => copy(messageContent)}>
  {isCopied ? 'Copied!' : 'Copy'}
</button>
```

---

## useRetry

Hook for implementing retry logic with exponential backoff.

### Signature

```typescript
function useRetry<T>(
  fn: () => Promise<T>, 
  options?: UseRetryOptions
): UseRetryReturn<T>
```

### Options

```typescript
interface UseRetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: 'linear' | 'exponential'
  onRetry?: (attempt: number) => void
}
```

### Return Value

```typescript
interface UseRetryReturn<T> {
  execute: () => Promise<T>
  isRetrying: boolean
  attempt: number
  error: Error | null
}
```

### Usage

```typescript
const { execute, isRetrying, attempt } = useRetry(
  async () => {
    const response = await fetch('/api/chat')
    return response.json()
  },
  {
    maxAttempts: 3,
    backoff: 'exponential',
  }
)
```

---

## useAutoScroll

Hook for automatic scrolling to bottom of message list.

### Signature

```typescript
function useAutoScroll(dependencies: any[]): RefObject<HTMLDivElement>
```

### Usage

```typescript
const scrollRef = useAutoScroll([messages])

<div ref={scrollRef}>
  {messages.map(msg => <Message key={msg.id} message={msg} />)}
</div>
```

---

## useTypingIndicator

Hook for managing typing indicators.

### Signature

```typescript
function useTypingIndicator(timeout?: number): UseTypingIndicatorReturn
```

### Return Value

```typescript
interface UseTypingIndicatorReturn {
  isTyping: boolean
  startTyping: () => void
  stopTyping: () => void
}
```

### Usage

```typescript
const { isTyping, startTyping, stopTyping } = useTypingIndicator(3000)

<input 
  onChange={(e) => {
    startTyping()
    // ... handle change
  }}
/>

{isTyping && <TypingIndicator />}
```

---

## useConversationHistory

Hook for managing conversation history and persistence.

### Signature

```typescript
function useConversationHistory(): UseConversationHistoryReturn
```

### Return Value

```typescript
interface UseConversationHistoryReturn {
  conversations: Conversation[]
  currentConversation: Conversation | null
  createConversation: (title: string) => void
  selectConversation: (id: string) => void
  deleteConversation: (id: string) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
}
```

### Usage

```typescript
const {
  conversations,
  currentConversation,
  createConversation,
  selectConversation,
} = useConversationHistory()
```

---

## Hook Composition Example

Combine multiple hooks for complex functionality:

```typescript
function AdvancedChat() {
  const { messages, sendMessage, isLoading } = useChat()
  const { tokenCount, isNearLimit } = useTokenCount({ messages })
  const { isOnline, reconnect } = useNetworkStatus()
  const { context, addContext } = useContextManager()
  const { files, uploadFiles } = useFileUpload()
  
  const handleSend = async (content: string) => {
    if (!isOnline) {
      await reconnect()
    }
    
    if (isNearLimit) {
      alert('Token limit approaching!')
      return
    }
    
    await sendMessage(content)
  }
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSend}
      onFileUpload={uploadFiles}
    />
  )
}
```

## Next Steps

- [Components API](/api/components) - Component reference
- [Types](/api/types) - Type definitions
- [Examples](/examples/) - See hooks in action
- [Cookbook](/cookbook) - Common patterns
