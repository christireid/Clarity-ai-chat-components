# Message Hooks

Message hooks provide advanced message management features including editing, regeneration, conversation branching, undo/redo, and optimistic updates.

## Overview

| Hook | Purpose | Key Feature |
|------|---------|-------------|
| `useMessageOperations` | Message operations | Edit, delete, regenerate, branch, undo/redo |
| `useOptimisticMessage` | Optimistic updates | Instant UI feedback with React 19 |

---

## useMessageOperations

**Advanced message operations for chat interfaces with editing, branching, and undo/redo support.**

### Signature

```typescript
function useMessageOperations(options?: UseMessageOperationsOptions): UseMessageOperationsReturn

interface UseMessageOperationsOptions {
  initialMessages?: MessageWithOperations[]
  maxHistorySize?: number              // Default: 50
  onEdit?: (messageId: string, newContent: string) => void
  onRegenerate?: (messageId: string) => void
  onBranch?: (branchId: string, parentMessageId: string) => void
  onDelete?: (messageId: string) => void
}

interface UseMessageOperationsReturn {
  // State
  messages: MessageWithOperations[]
  currentBranchId: string
  canUndo: boolean
  canRedo: boolean

  // Operations
  addMessage: (message: Omit<MessageWithOperations, 'id' | 'timestamp'>) => string
  editMessage: (messageId: string, newContent: string) => void
  startEditing: (messageId: string) => void
  cancelEditing: (messageId: string) => void
  regenerateMessage: (messageId: string) => void
  deleteMessage: (messageId: string) => void

  // Branching
  branchConversation: (messageId: string) => string
  getMessagesUpTo: (messageId: string) => MessageWithOperations[]
  getBranches: () => Map<string, MessageWithOperations[]>
  switchToBranch: (branchId: string) => void

  // History
  undo: () => void
  redo: () => void
  clear: () => void
}

interface MessageWithOperations {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  chatId?: string
  parentId?: string
  branchId?: string
  isEditing?: boolean
  originalContent?: string
  version?: number
}
```

### Examples

#### Basic Message Operations

```tsx
import { useMessageOperations } from '@clarity-chat/react/hooks/message'

function EditableChat() {
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    undo,
    canUndo,
  } = useMessageOperations({
    onEdit: (id, content) => {
      console.log('Message edited:', id, content)
    },
  })

  const handleSend = (content: string) => {
    addMessage({
      role: 'user',
      content,
    })
  }

  return (
    <div>
      {messages.map((msg) => (
        <MessageCard
          key={msg.id}
          message={msg}
          onEdit={(content) => editMessage(msg.id, content)}
          onDelete={() => deleteMessage(msg.id)}
        />
      ))}
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
    </div>
  )
}
```

#### Message Editing with UI

```tsx
function EditableMessage({ message }: { message: MessageWithOperations }) {
  const { editMessage, startEditing, cancelEditing } = useMessageOperations()
  const [editContent, setEditContent] = useState(message.content)

  if (message.isEditing) {
    return (
      <div className="p-4 bg-card rounded-lg">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => {
              editMessage(message.id, editContent)
            }}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Save
          </button>
          <button
            onClick={() => cancelEditing(message.id)}
            className="px-4 py-2 bg-secondary rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-card rounded-lg">
      <p>{message.content}</p>
      {message.version && message.version > 0 && (
        <span className="text-xs text-muted-foreground">
          (edited v{message.version})
        </span>
      )}
      <button
        onClick={() => startEditing(message.id)}
        className="text-sm text-primary mt-2"
      >
        Edit
      </button>
    </div>
  )
}
```

#### Regenerate AI Response

```tsx
function RegenerableChat() {
  const {
    messages,
    addMessage,
    regenerateMessage,
    getMessagesUpTo,
  } = useMessageOperations({
    onRegenerate: async (messageId) => {
      // Get context up to the message being regenerated
      const context = getMessagesUpTo(messageId)

      // Call AI with same context
      const response = await callAI(context)

      // Replace the message
      editMessage(messageId, response.content)
    },
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <p>{msg.content}</p>
          {msg.role === 'assistant' && (
            <button
              onClick={() => regenerateMessage(msg.id)}
              className="text-sm text-primary"
            >
              🔄 Regenerate
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
```

#### Conversation Branching

```tsx
function BranchingChat() {
  const {
    messages,
    branchConversation,
    getBranches,
    switchToBranch,
    currentBranchId,
  } = useMessageOperations({
    onBranch: (branchId, parentId) => {
      console.log(`Created branch ${branchId} from message ${parentId}`)
    },
  })

  const branches = getBranches()

  const handleBranch = (messageId: string) => {
    const newBranchId = branchConversation(messageId)
    console.log('New branch created:', newBranchId)
  }

  return (
    <div className="flex">
      {/* Sidebar with branches */}
      <div className="w-64 p-4 bg-muted">
        <h3 className="font-semibold mb-2">Conversation Branches</h3>
        {Array.from(branches.entries()).map(([branchId, branchMessages]) => (
          <button
            key={branchId}
            onClick={() => switchToBranch(branchId)}
            className={`
              block w-full text-left p-2 rounded mb-1
              ${branchId === currentBranchId ? 'bg-primary text-white' : 'hover:bg-accent'}
            `}
          >
            {branchId}
            <span className="text-xs ml-2">
              ({branchMessages.length} messages)
            </span>
          </button>
        ))}
      </div>

      {/* Main chat */}
      <div className="flex-1 p-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-4">
            <p>{msg.content}</p>
            <button
              onClick={() => handleBranch(msg.id)}
              className="text-xs text-muted-foreground mt-1"
            >
              🌿 Branch from here
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

#### Undo/Redo with Keyboard Shortcuts

```tsx
function UndoRedoChat() {
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useMessageOperations()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey && canRedo) {
          redo()
        } else if (canUndo) {
          undo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, canUndo, canRedo])

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="px-4 py-2 bg-secondary rounded disabled:opacity-50"
        >
          ⬅️ Undo (Ctrl+Z)
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="px-4 py-2 bg-secondary rounded disabled:opacity-50"
        >
          ➡️ Redo (Ctrl+Shift+Z)
        </button>
      </div>
      <ChatInterface messages={messages} />
    </div>
  )
}
```

#### Complete Message Management UI

```tsx
function AdvancedMessageCard({ message }: { message: MessageWithOperations }) {
  const {
    editMessage,
    deleteMessage,
    regenerateMessage,
    branchConversation,
    startEditing,
  } = useMessageOperations()

  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className="p-4 bg-card rounded-lg relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold">
              {message.role === 'user' ? 'You' : 'Assistant'}
            </span>
            {message.version && message.version > 0 && (
              <span className="text-xs px-2 py-0.5 bg-muted rounded">
                v{message.version}
              </span>
            )}
          </div>
          <p className="text-sm">{message.content}</p>
        </div>

        {/* Action menu */}
        {showActions && (
          <div className="flex gap-1 ml-2">
            {message.role === 'user' && (
              <button
                onClick={() => startEditing(message.id)}
                className="p-1 hover:bg-accent rounded"
                title="Edit"
              >
                ✏️
              </button>
            )}
            {message.role === 'assistant' && (
              <button
                onClick={() => regenerateMessage(message.id)}
                className="p-1 hover:bg-accent rounded"
                title="Regenerate"
              >
                🔄
              </button>
            )}
            <button
              onClick={() => branchConversation(message.id)}
              className="p-1 hover:bg-accent rounded"
              title="Branch"
            >
              🌿
            </button>
            <button
              onClick={() => deleteMessage(message.id)}
              className="p-1 hover:bg-destructive rounded text-destructive"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Show original content if edited */}
      {message.originalContent && message.originalContent !== message.content && (
        <details className="mt-2 text-xs text-muted-foreground">
          <summary>View original</summary>
          <p className="mt-1 p-2 bg-muted rounded">
            {message.originalContent}
          </p>
        </details>
      )}
    </div>
  )
}
```

#### Version History Viewer

```tsx
function MessageHistory({ message }: { message: MessageWithOperations }) {
  const { editMessage } = useMessageOperations()
  const [history, setHistory] = useState<string[]>([])

  // Track version history in component state
  useEffect(() => {
    if (message.originalContent) {
      setHistory((prev) => {
        if (!prev.includes(message.originalContent!)) {
          return [...prev, message.originalContent!]
        }
        return prev
      })
    }
  }, [message.originalContent])

  if (history.length === 0) return null

  return (
    <div className="mt-2 p-2 bg-muted rounded">
      <h4 className="text-xs font-semibold mb-2">Version History</h4>
      <div className="space-y-1">
        {history.map((content, i) => (
          <div key={i} className="flex justify-between items-center text-xs">
            <span className="flex-1 truncate">{content}</span>
            <button
              onClick={() => editMessage(message.id, content)}
              className="ml-2 text-primary hover:underline"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Operation Types

```typescript
type MessageOperation =
  | { type: 'add'; messageId: string; previousState?: MessageWithOperations }
  | { type: 'edit'; messageId: string; previousState: MessageWithOperations }
  | { type: 'delete'; messageId: string; previousState: MessageWithOperations }
  | { type: 'regenerate'; messageId: string; previousState: MessageWithOperations }
  | { type: 'branch'; messageId: string; previousState?: MessageWithOperations }
```

### When to Use

- **Use for:** Advanced chat UIs with editing, branching, undo/redo
- **Best when:** ChatGPT-like interfaces, collaborative editing
- **Alternatives:** Simple `useState` for basic message lists

---

## useOptimisticMessage

**Optimistic UI updates for instant feedback when sending messages, built with React 19's useOptimistic.**

### Signature

```typescript
function useOptimisticMessage(options: UseOptimisticMessageOptions): UseOptimisticMessageReturn

interface UseOptimisticMessageOptions {
  onSend: (content: string) => Promise<Message>
  onConfirm?: (message: Message) => void
  onError?: (error: Error, optimisticMessage: OptimisticMessage) => void
  defaultUser?: {
    id: string
    name?: string
    avatar?: string
  }
}

interface UseOptimisticMessageReturn {
  messages: OptimisticMessage[]
  sendOptimistic: (content: string) => Promise<void>
  setMessages: (messages: Message[]) => void
  isSending: boolean
  retry: (messageId: string) => Promise<void>
  cancel: (messageId: string) => void
}

interface OptimisticMessage extends Message {
  isOptimistic?: boolean
  error?: string
}
```

### Examples

#### Basic Optimistic Updates

```tsx
import { useOptimisticMessage } from '@clarity-chat/react/hooks/message'

function OptimisticChat() {
  const {
    messages,
    sendOptimistic,
    isSending,
  } = useOptimisticMessage({
    onSend: async (content) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Send to API
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })

      return response.json()
    },
    onConfirm: (message) => {
      console.log('Message confirmed:', message.id)
    },
  })

  const handleSend = async (content: string) => {
    await sendOptimistic(content)
  }

  return (
    <div>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`
            p-3 mb-2 rounded
            ${msg.isOptimistic ? 'opacity-50' : 'opacity-100'}
          `}
        >
          {msg.content}
          {msg.status === 'sending' && <span className="ml-2">⏳</span>}
        </div>
      ))}
      {isSending && <div className="text-sm text-muted-foreground">Sending...</div>}
    </div>
  )
}
```

#### Error Handling with Retry

```tsx
function RobustOptimisticChat() {
  const {
    messages,
    sendOptimistic,
    retry,
    cancel,
  } = useOptimisticMessage({
    onSend: async (content) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return response.json()
    },
    onError: (error, message) => {
      console.error('Send failed:', error, message)
    },
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id} className="p-3 mb-2 bg-card rounded">
          <p>{msg.content}</p>

          {/* Show status indicators */}
          {msg.status === 'sending' && (
            <div className="text-xs text-muted-foreground mt-1">
              Sending...
            </div>
          )}

          {msg.status === 'error' && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-destructive">
                Failed: {msg.error}
              </span>
              <button
                onClick={() => retry(msg.id)}
                className="text-xs px-2 py-1 bg-primary text-white rounded"
              >
                Retry
              </button>
              <button
                onClick={() => cancel(msg.id)}
                className="text-xs px-2 py-1 bg-secondary rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

#### Visual Feedback During Send

```tsx
function VisualOptimisticChat() {
  const { messages, sendOptimistic } = useOptimisticMessage({
    onSend: sendMessageToAPI,
  })

  return (
    <div>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`
            p-4 mb-3 rounded-lg transition-all
            ${msg.isOptimistic
              ? 'bg-primary/10 border-2 border-dashed border-primary/30'
              : 'bg-card border border-border'
            }
          `}
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${msg.isOptimistic ? 'bg-primary/20 animate-pulse' : 'bg-primary'}
            `}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p>{msg.content}</p>

              {/* Status */}
              {msg.isOptimistic && (
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Sending...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

#### Screen Reader Announcements

The hook automatically announces message status to screen readers:

```tsx
function AccessibleOptimisticChat() {
  const { messages, sendOptimistic } = useOptimisticMessage({
    onSend: sendMessageToAPI,
  })

  // The hook automatically announces:
  // - "Message sent successfully" (polite) on confirmation
  // - "Failed to send message: [error]" (assertive) on error
  // - "Message retry successful" (polite) on retry success
  // - "Message retry failed: [error]" (assertive) on retry failure

  return (
    <div>
      {/* Messages are announced to screen readers automatically */}
      {messages.map((msg) => (
        <div
          key={msg.id}
          role="article"
          aria-label={`${msg.role} message`}
          aria-busy={msg.status === 'sending'}
        >
          {msg.content}
        </div>
      ))}
    </div>
  )
}
```

#### Loading from Server

```tsx
function SyncedOptimisticChat() {
  const {
    messages,
    sendOptimistic,
    setMessages,
  } = useOptimisticMessage({
    onSend: sendMessageToAPI,
  })

  // Load initial messages from server
  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(serverMessages => {
        setMessages(serverMessages)
      })
  }, [setMessages])

  return <ChatInterface messages={messages} onSend={sendOptimistic} />
}
```

#### Generic Optimistic State

```tsx
import { useOptimisticState } from '@clarity-chat/react/hooks/message'

function OptimisticCounter() {
  const [serverCount, setServerCount] = useState(0)

  const { state, update, isPending } = useOptimisticState({
    serverState: serverCount,
    onUpdate: async (newCount) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update server
      const response = await fetch('/api/count', {
        method: 'POST',
        body: JSON.stringify({ count: newCount }),
      })

      const result = await response.json()
      setServerCount(result.count)
      return result.count
    },
  })

  return (
    <div>
      <p className={isPending ? 'opacity-50' : ''}>
        Count: {state}
      </p>
      <button onClick={() => update(state + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### React 19 Integration

This hook uses React 19's native `useOptimistic` and `useTransition`:

```typescript
// Internally uses:
const [optimisticMessages, addOptimistic] = useOptimistic(
  confirmedMessages,
  optimisticReducer
)

const [isPending, startTransition] = useTransition()

// All optimistic updates wrapped in transitions:
startTransition(() => {
  addOptimistic({ type: 'add', message: optimisticMessage })
})
```

### Message Status

```typescript
type MessageStatus = 'sending' | 'sent' | 'error'

// Optimistic message starts as 'sending'
// Confirmed → 'sent'
// Failed → 'error'
```

### When to Use

- **Use for:** Instant feedback, improved perceived performance
- **Best when:** Network latency is noticeable, user expects instant response
- **Requires:** React 19+

---

## Common Patterns

### Combined Operations and Optimistic Updates

```tsx
function AdvancedChat() {
  const operations = useMessageOperations({
    onRegenerate: async (messageId) => {
      const context = operations.getMessagesUpTo(messageId)
      const response = await callAI(context)
      operations.editMessage(messageId, response.content)
    },
  })

  const optimistic = useOptimisticMessage({
    onSend: async (content) => {
      const response = await sendToAPI(content)
      operations.addMessage({
        role: 'user',
        content: response.content,
      })
      return response
    },
  })

  return (
    <div>
      <ChatMessages messages={operations.messages} />
      <ChatInput onSend={optimistic.sendOptimistic} />
    </div>
  )
}
```

### Message Operations with Persistence

```tsx
function PersistentChat() {
  const {
    messages,
    addMessage,
    editMessage,
    deleteMessage,
  } = useMessageOperations({
    initialMessages: loadFromLocalStorage(),
    onEdit: (id, content) => {
      // Persist to localStorage
      saveToLocalStorage(messages)
    },
    onDelete: (id) => {
      saveToLocalStorage(messages)
    },
  })

  // Auto-save on changes
  useEffect(() => {
    saveToLocalStorage(messages)
  }, [messages])

  return <ChatInterface messages={messages} />
}
```

---

## Troubleshooting

### Optimistic Message Not Appearing

**Problem:** Message doesn't show immediately.

**Solutions:**

1. Ensure component is wrapped in React 19 context
2. Check that `onSend` is async and returns a Promise
3. Verify no errors in console

```tsx
// Wrap in Suspense if needed
<Suspense fallback={<Loading />}>
  <OptimisticChat />
</Suspense>
```

### Undo Not Working

**Problem:** `undo()` doesn't reverse operation.

**Solutions:**

1. Check `canUndo` is true before calling
2. Verify `maxHistorySize` isn't too small
3. Ensure operations are being tracked

```tsx
// Debug history
const { history } = useMessageOperations()
console.log('History length:', history.length)
```

### Branch Switching Fails

**Problem:** `switchToBranch()` doesn't change visible messages.

**Solution:** Ensure branch exists and messages are filtered correctly:

```tsx
const branches = getBranches()
console.log('Available branches:', Array.from(branches.keys()))
console.log('Current branch:', currentBranchId)
```

### Message Stuck in "Sending" State

**Problem:** Optimistic message never confirms or errors.

**Solutions:**

1. Check `onSend` promise resolves/rejects
2. Add error boundaries
3. Implement timeout

```tsx
const { sendOptimistic } = useOptimisticMessage({
  onSend: async (content) => {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 10000)
    )

    const send = fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ content }),
    })

    return Promise.race([send, timeout])
  },
})
```

---

## Related Hooks

- **[Chat Hooks](/docs/api/hooks/chat.md)**: Core chat functionality
- **[UI Hooks](/docs/api/hooks/ui.md)**: UI state management
- **[Memory Hooks](/docs/api/hooks/memory.md)**: Context and conversation memory

---

## Best Practices

### 1. Use Optimistic Updates for Better UX

Always prefer optimistic updates for user actions:

```tsx
// Good - instant feedback
const { sendOptimistic } = useOptimisticMessage({ onSend })
await sendOptimistic(content)

// Avoid - wait for confirmation
const response = await sendToAPI(content)
setMessages(prev => [...prev, response])
```

### 2. Provide Clear Error Recovery

Always show retry and cancel options for failed messages:

```tsx
{msg.status === 'error' && (
  <div className="flex gap-2">
    <button onClick={() => retry(msg.id)}>Retry</button>
    <button onClick={() => cancel(msg.id)}>Cancel</button>
  </div>
)}
```

### 3. Track Version History

Store original content when editing:

```tsx
const { editMessage } = useMessageOperations({
  onEdit: (id, newContent) => {
    // Track in analytics or version history DB
    trackEdit(id, newContent)
  },
})
```

### 4. Limit Undo History

Don't let history grow unbounded:

```tsx
useMessageOperations({
  maxHistorySize: 50,  // Reasonable limit
})
```

### 5. Use Branches for Exploration

Encourage users to explore different conversation paths:

```tsx
// Add branch button to messages
<button onClick={() => branchConversation(msg.id)}>
  🌿 Try a different approach
</button>
```
