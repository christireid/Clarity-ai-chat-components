# Thread Management Component Specification

## Overview

The Thread Management component provides comprehensive conversation state management, message
history handling, and multi-conversation support for AI chat interfaces. This component serves as
the central state container for messages, conversation metadata, and user interactions across single
or multiple conversation threads.

### Purpose

Thread management is essential for:

- **Conversation Continuity**: Maintain message history across sessions
- **Multi-Threading**: Support multiple concurrent conversations
- **State Synchronization**: Keep UI and backend state aligned
- **Message Operations**: Enable edit, regenerate, branch, and delete
- **Token Management**: Track usage and enforce limits
- **Export/Import**: Save and restore conversation data

### Inspiration

This specification draws from proven patterns in:

**Assistant UI** (8.2k+ stars, Y Combinator-backed):

- Store-based state management for streaming optimization
- Runtime abstraction pattern for backend flexibility
- Index-based message access for efficient rendering
- Multi-level context architecture (Thread → Message → ActionBar)
- Message parts architecture for flexible content rendering
- Thread branching support with parent/source ID tracking
- Step tracking with usage metrics

**CopilotKit** (28.2k+ stars, Fortune 500 adoption):

- Hybrid pre-built + headless architecture
- Context awareness hooks for automatic prompt enhancement
- Bidirectional state sharing (app ↔ agent)
- Status-aware rendering (idle, running, streaming, complete, error)
- Human-in-the-loop approval workflows
- Generative UI for tool calls as React components
- Progressive component customization levels

## Component API

### ThreadProvider

Root provider for thread management state and operations.

```typescript
interface ThreadProviderProps {
  // Configuration
  threadId?: string;
  initialMessages?: Message[];
  maxMessages?: number;
  maxTokens?: number;

  // Backend Integration
  runtime?: ThreadRuntime;
  adapter?: ThreadAdapter;

  // State Management
  store?: ThreadStore;
  persistenceKey?: string;

  // Callbacks
  onMessageAdd?: (message: Message) => void;
  onMessageUpdate?: (message: Message) => void;
  onMessageDelete?: (messageId: string) => void;
  onThreadUpdate?: (thread: Thread) => void;
  onError?: (error: Error) => void;

  // Features
  enableBranching?: boolean;
  enablePersistence?: boolean;
  enableTokenTracking?: boolean;

  children: ReactNode;
}

// Usage
<ThreadProvider
  threadId="conversation-1"
  maxMessages={100}
  enableBranching={true}
  enableTokenTracking={true}
  onThreadUpdate={(thread) => saveToBackend(thread)}
>
  <ChatInterface />
</ThreadProvider>
```

### useThread Hook

Primary hook for accessing thread state and operations.

```typescript
interface UseThreadReturn {
  // State
  thread: Thread
  messages: Message[]
  status: ThreadStatus
  metadata: ThreadMetadata

  // Operations
  addMessage: (message: Partial<Message>) => Promise<Message>
  updateMessage: (id: string, updates: Partial<Message>) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
  regenerateMessage: (id: string) => Promise<void>
  editMessage: (id: string, content: string) => Promise<void>

  // Navigation
  switchThread: (threadId: string) => Promise<void>
  createBranch: (messageId: string) => Promise<string>
  navigateToBranch: (branchId: string) => Promise<void>

  // Bulk Operations
  clearMessages: () => Promise<void>
  exportThread: () => Promise<ThreadExport>
  importThread: (data: ThreadExport) => Promise<void>

  // Token Management
  tokenUsage: TokenUsage
  estimateTokens: (content: string) => number
  canAddMessage: (content: string) => boolean
}

// Type Definitions
type ThreadStatus = 'idle' | 'loading' | 'streaming' | 'error'

interface Thread {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messageIds: string[]
  metadata: ThreadMetadata
  branches?: ThreadBranch[]
}

interface ThreadMetadata {
  model?: string
  systemPrompt?: string
  temperature?: number
  tags?: string[]
  starred?: boolean
  archived?: boolean
  [key: string]: unknown
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: MessageContent[]
  status: MessageStatus
  timestamp: Date
  parentId?: string
  sourceId?: string
  metadata?: MessageMetadata
}

type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error' | 'cancelled'

interface MessageContent {
  type: 'text' | 'image' | 'file' | 'tool-call' | 'code' | 'thinking'
  data: unknown
  status?: 'pending' | 'running' | 'complete' | 'error'
}

interface MessageMetadata {
  tokenCount?: number
  model?: string
  finishReason?: string
  editedAt?: Date
  regeneratedFrom?: string
  [key: string]: unknown
}

interface TokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  threadTokens: number
  limit?: number
}

interface ThreadBranch {
  id: string
  parentMessageId: string
  title?: string
  createdAt: Date
}

interface ThreadExport {
  version: string
  thread: Thread
  messages: Message[]
  exportedAt: Date
}
```

### useThreadList Hook

Manage multiple conversation threads.

```typescript
interface UseThreadListReturn {
  // State
  threads: Thread[]
  currentThreadId: string | null
  status: 'idle' | 'loading' | 'error'

  // Operations
  createThread: (title?: string) => Promise<Thread>
  deleteThread: (id: string) => Promise<void>
  updateThread: (id: string, updates: Partial<Thread>) => Promise<void>
  switchThread: (id: string) => Promise<void>

  // Filtering & Search
  searchThreads: (query: string) => Thread[]
  filterThreads: (filter: ThreadFilter) => Thread[]

  // Sorting
  sortThreads: (by: ThreadSortKey, order: 'asc' | 'desc') => Thread[]

  // Bulk Operations
  archiveThread: (id: string) => Promise<void>
  starThread: (id: string) => Promise<void>
  exportAllThreads: () => Promise<ThreadExport[]>
  importThreads: (data: ThreadExport[]) => Promise<void>
}

interface ThreadFilter {
  starred?: boolean
  archived?: boolean
  tags?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
}

type ThreadSortKey = 'createdAt' | 'updatedAt' | 'title' | 'messageCount'

// Usage
const { threads, currentThreadId, createThread, switchThread, searchThreads } = useThreadList()

const filteredThreads = searchThreads('AI integration')
```

### useThreadContext Hook

Access thread context within deeply nested components.

```typescript
interface UseThreadContextReturn {
  // Context Reading
  addContext: (key: string, value: unknown, description?: string) => void
  removeContext: (key: string) => void
  getContext: (key: string) => unknown

  // Automatic Context Injection
  contexts: Record<string, ContextValue>
}

interface ContextValue {
  value: unknown
  description?: string
  convert?: (value: unknown) => string
  categories?: string[]
}

// Usage - Similar to CopilotKit's useCopilotReadable
const { user, preferences } = useAppState()

const { addContext } = useThreadContext()

useEffect(() => {
  addContext('user', user, 'Current user information')
  addContext('preferences', preferences, 'User preferences and settings')
}, [user, preferences])
```

### useMessageByIndex Hook

Efficient access to messages by index for optimized rendering.

```typescript
interface UseMessageByIndexReturn {
  message: Message | null;
  isFirst: boolean;
  isLast: boolean;
  isStreaming: boolean;

  // Operations scoped to this message
  update: (updates: Partial<Message>) => Promise<void>;
  delete: () => Promise<void>;
  regenerate: () => Promise<void>;
  createBranch: () => Promise<string>;
}

// Usage - Inspired by Assistant UI's index-based pattern
const MessageList = () => {
  const { messages } = useThread();

  return (
    <>
      {messages.map((_, index) => (
        <MessageByIndex key={index} index={index} />
      ))}
    </>
  );
};

const MessageByIndex = ({ index }: { index: number }) => {
  const { message, isLast } = useMessageByIndex(index);

  if (!message) return null;

  return (
    <MessageBubble message={message}>
      {isLast && message.status === 'streaming' && <StreamingIndicator />}
    </MessageBubble>
  );
};
```

### ThreadStore Interface

Backend adapter for thread persistence.

```typescript
interface ThreadStore {
  // Thread Operations
  getThread: (id: string) => Promise<Thread | null>
  saveThread: (thread: Thread) => Promise<void>
  deleteThread: (id: string) => Promise<void>
  listThreads: (filter?: ThreadFilter) => Promise<Thread[]>

  // Message Operations
  getMessages: (threadId: string) => Promise<Message[]>
  addMessage: (threadId: string, message: Message) => Promise<void>
  updateMessage: (threadId: string, messageId: string, updates: Partial<Message>) => Promise<void>
  deleteMessage: (threadId: string, messageId: string) => Promise<void>

  // Bulk Operations
  exportThread: (threadId: string) => Promise<ThreadExport>
  importThread: (data: ThreadExport) => Promise<void>
}

// Built-in Implementations
class LocalStorageThreadStore implements ThreadStore {
  /* ... */
}
class IndexedDBThreadStore implements ThreadStore {
  /* ... */
}
class RESTThreadStore implements ThreadStore {
  /* ... */
}
class SupabaseThreadStore implements ThreadStore {
  /* ... */
}
```

### ThreadRuntime Interface

Backend integration abstraction for LLM providers and agent frameworks.

```typescript
interface ThreadRuntime {
  // Message Streaming
  streamMessage: (messages: Message[], options?: StreamOptions) => AsyncGenerator<MessageChunk>

  // Message Generation
  generateMessage: (messages: Message[], options?: GenerateOptions) => Promise<Message>

  // Tool Execution
  executeTool: (toolName: string, args: Record<string, unknown>) => Promise<unknown>

  // Lifecycle Hooks
  onStart?: () => void
  onChunk?: (chunk: MessageChunk) => void
  onComplete?: (message: Message) => void
  onError?: (error: Error) => void
}

interface StreamOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stopSequences?: string[]
  tools?: ToolDefinition[]
}

interface MessageChunk {
  type: 'text' | 'tool-call' | 'thinking' | 'done'
  data: unknown
  metadata?: Record<string, unknown>
}

// Built-in Runtime Adapters
class OpenAIRuntime implements ThreadRuntime {
  /* ... */
}
class AnthropicRuntime implements ThreadRuntime {
  /* ... */
}
class LangGraphRuntime implements ThreadRuntime {
  /* ... */
}
class LocalRuntime implements ThreadRuntime {
  /* ... */
}
```

## Usage Examples

### Basic Thread Management

```typescript
import { ThreadProvider, useThread } from '@clarity/react';

function ChatApp() {
  return (
    <ThreadProvider
      threadId="conversation-1"
      enablePersistence={true}
      persistenceKey="chat-history"
    >
      <ChatInterface />
    </ThreadProvider>
  );
}

function ChatInterface() {
  const {
    messages,
    addMessage,
    status,
    tokenUsage
  } = useThread();

  const handleSend = async (content: string) => {
    await addMessage({
      role: 'user',
      content: [{ type: 'text', data: content }]
    });
  };

  return (
    <div>
      <MessageList messages={messages} />
      <TokenUsageBar usage={tokenUsage} />
      <MessageInput onSend={handleSend} disabled={status === 'streaming'} />
    </div>
  );
}
```

### Multi-Thread Conversation List

```typescript
import { ThreadProvider, useThreadList, useThread } from '@clarity/react';

function ConversationApp() {
  const {
    threads,
    currentThreadId,
    createThread,
    switchThread,
    deleteThread
  } = useThreadList();

  return (
    <div className="app">
      <ThreadSidebar
        threads={threads}
        currentId={currentThreadId}
        onSwitch={switchThread}
        onCreate={createThread}
        onDelete={deleteThread}
      />

      {currentThreadId && (
        <ThreadProvider threadId={currentThreadId}>
          <ChatInterface />
        </ThreadProvider>
      )}
    </div>
  );
}
```

### Message Branching

```typescript
function MessageWithBranching({ message }: { message: Message }) {
  const { createBranch, navigateToBranch } = useThread();
  const [branches, setBranches] = useState<ThreadBranch[]>([]);

  const handleCreateBranch = async () => {
    const branchId = await createBranch(message.id);
    // Navigate to new branch for alternative conversation path
    await navigateToBranch(branchId);
  };

  return (
    <div>
      <MessageBubble message={message} />
      <button onClick={handleCreateBranch}>
        Create Branch
      </button>
      {branches.length > 0 && (
        <BranchPicker branches={branches} onSelect={navigateToBranch} />
      )}
    </div>
  );
}
```

### Custom Backend Integration

```typescript
import { ThreadProvider, ThreadRuntime } from '@clarity/react';

class CustomAPIRuntime implements ThreadRuntime {
  async *streamMessage(messages, options) {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ messages, ...options })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      yield JSON.parse(chunk);
    }
  }

  async generateMessage(messages, options) {
    // Non-streaming implementation
  }

  async executeTool(toolName, args) {
    // Tool execution
  }
}

function App() {
  const runtime = new CustomAPIRuntime();

  return (
    <ThreadProvider runtime={runtime}>
      <ChatInterface />
    </ThreadProvider>
  );
}
```

### Context-Aware Thread

```typescript
function DocumentChatbot({ document }) {
  const { addContext } = useThreadContext();

  // Automatically inject document context
  useEffect(() => {
    addContext('document', {
      title: document.title,
      content: document.content,
      metadata: document.metadata
    }, 'Current document being discussed');
  }, [document]);

  return <ChatInterface />;
}
```

### Export/Import Functionality

```typescript
function ThreadActions() {
  const { exportThread, importThread, clearMessages } = useThread();

  const handleExport = async () => {
    const data = await exportThread();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thread-${data.thread.id}.json`;
    a.click();
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    await importThread(data);
  };

  return (
    <div>
      <button onClick={handleExport}>Export Conversation</button>
      <input type="file" onChange={(e) => handleImport(e.target.files[0])} />
      <button onClick={clearMessages}>Clear All Messages</button>
    </div>
  );
}
```

## Visual Design

### Thread List Interface

```
┌─────────────────────────────────────┐
│  Conversations                  [+] │
├─────────────────────────────────────┤
│ ★ Project Planning Discussion      │
│   Last message: 2 hours ago         │
│   12 messages • 4,521 tokens        │
├─────────────────────────────────────┤
│   Customer Support Inquiry          │
│   Last message: Yesterday           │
│   5 messages • 1,234 tokens         │
├─────────────────────────────────────┤
│   Code Review Assistant             │
│   Last message: 3 days ago          │
│   23 messages • 8,912 tokens        │
└─────────────────────────────────────┘
```

### Message with Branching UI

```
┌─────────────────────────────────────────┐
│ User                          3:45 PM   │
│ How do I implement caching?             │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Assistant                     3:45 PM   │
│ Here are three approaches...            │
│                                         │
│ [Copy] [Regenerate] [Branch] [Edit]    │
└─────────────────────────────────────────┘
           ↓
    ┌──────┴──────┐
    ↓             ↓
  Branch 1     Branch 2
  (Redis)      (Memory)
```

### Token Usage Visualization

```
┌─────────────────────────────────────────┐
│ Token Usage                             │
├─────────────────────────────────────────┤
│ ████████████████░░░░ 16,234 / 20,000   │
│                                         │
│ Input:  12,145 tokens                   │
│ Output:  4,089 tokens                   │
│ Remaining: 3,766 tokens                 │
└─────────────────────────────────────────┘
```

### Thread Metadata Panel

```
┌─────────────────────────────────────────┐
│ Thread Details                          │
├─────────────────────────────────────────┤
│ Title: Project Planning Discussion      │
│ Created: Jan 15, 2026                   │
│ Updated: 2 hours ago                    │
│                                         │
│ Model: gpt-4o                           │
│ Temperature: 0.7                        │
│ System Prompt: You are a helpful...    │
│                                         │
│ Tags: [planning] [project]              │
│ Status: ★ Starred                       │
└─────────────────────────────────────────┘
```

## Implementation Details

### State Management Architecture

Use a store-based approach inspired by Assistant UI's `@assistant-ui/store`:

```typescript
// Thread Store Implementation
interface ThreadState {
  threads: Map<string, Thread>
  messages: Map<string, Message[]>
  currentThreadId: string | null
  status: ThreadStatus
}

class ThreadStoreImpl {
  private state: ThreadState
  private listeners: Set<(state: ThreadState) => void>

  // State mutation methods
  addMessage(threadId: string, message: Message) {
    // Update state
    // Notify listeners
  }

  // Subscription
  subscribe(listener: (state: ThreadState) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  // State access
  getState() {
    return this.state
  }
}

// React Integration
export function useThreadState<T>(selector: (state: ThreadState) => T): T {
  const store = useContext(ThreadStoreContext)
  const [value, setValue] = useState(() => selector(store.getState()))

  useEffect(() => {
    return store.subscribe((state) => {
      setValue(selector(state))
    })
  }, [store, selector])

  return value
}
```

### Message Indexing for Performance

```typescript
// Efficient message rendering with index-based access
const MessageList = memo(() => {
  const messageCount = useThreadState((s) => s.messages.get(s.currentThreadId)?.length ?? 0);

  return (
    <div>
      {Array.from({ length: messageCount }, (_, index) => (
        <MessageByIndex key={index} index={index} />
      ))}
    </div>
  );
});

const MessageByIndex = memo(({ index }: { index: number }) => {
  const message = useThreadState((s) => {
    const messages = s.messages.get(s.currentThreadId);
    return messages?.[index];
  });

  if (!message) return null;
  return <MessageBubble message={message} />;
});
```

### Streaming Integration

```typescript
class StreamingMessageHandler {
  async handleStream(
    runtime: ThreadRuntime,
    messages: Message[],
    onChunk: (chunk: MessageChunk) => void
  ) {
    const messageId = generateId()
    const partialMessage: Message = {
      id: messageId,
      role: 'assistant',
      content: [],
      status: 'streaming',
      timestamp: new Date(),
    }

    // Add initial message
    store.addMessage(threadId, partialMessage)

    // Stream chunks
    for await (const chunk of runtime.streamMessage(messages)) {
      switch (chunk.type) {
        case 'text':
          store.updateMessageContent(messageId, chunk.data)
          break
        case 'tool-call':
          store.addMessagePart(messageId, {
            type: 'tool-call',
            data: chunk.data,
            status: 'running',
          })
          break
        case 'done':
          store.updateMessage(messageId, {
            status: 'complete',
            metadata: chunk.metadata,
          })
          break
      }

      onChunk(chunk)
    }
  }
}
```

### Branch Management

```typescript
class BranchManager {
  createBranch(threadId: string, parentMessageId: string): string {
    const branchId = generateId()
    const parentIndex = this.findMessageIndex(threadId, parentMessageId)

    // Create new branch thread
    const branch: Thread = {
      id: branchId,
      title: `Branch from ${threadId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      messageIds: [],
      metadata: {
        parentThreadId: threadId,
        branchPoint: parentMessageId,
      },
    }

    // Copy messages up to branch point
    const messages = this.getMessages(threadId).slice(0, parentIndex + 1)
    this.setMessages(branchId, messages)

    // Register branch
    this.addBranch(threadId, {
      id: branchId,
      parentMessageId,
      createdAt: new Date(),
    })

    return branchId
  }

  navigateToBranch(branchId: string) {
    this.setCurrentThread(branchId)
  }

  mergeBranch(fromBranchId: string, toThreadId: string, strategy: 'append' | 'replace') {
    // Implementation for merging branches
  }
}
```

### Token Tracking

```typescript
class TokenTracker {
  private encoder: TokenEncoder

  estimateTokens(content: string): number {
    return this.encoder.encode(content).length
  }

  calculateMessageTokens(message: Message): number {
    let total = 0

    for (const part of message.content) {
      if (part.type === 'text') {
        total += this.estimateTokens(part.data as string)
      }
      // Add tokens for other content types
    }

    return total
  }

  getThreadTokenUsage(threadId: string): TokenUsage {
    const messages = store.getMessages(threadId)

    let inputTokens = 0
    let outputTokens = 0

    for (const message of messages) {
      const tokens = message.metadata?.tokenCount ?? this.calculateMessageTokens(message)

      if (message.role === 'user') {
        inputTokens += tokens
      } else if (message.role === 'assistant') {
        outputTokens += tokens
      }
    }

    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
      threadTokens: inputTokens + outputTokens,
    }
  }

  canAddMessage(threadId: string, content: string, limit: number): boolean {
    const current = this.getThreadTokenUsage(threadId)
    const estimated = this.estimateTokens(content)

    return current.totalTokens + estimated <= limit
  }
}
```

## File Structure

```
packages/react/src/thread/
├── index.ts                          # Public exports
├── components/
│   ├── ThreadProvider.tsx            # Root provider component
│   ├── ThreadList.tsx                # Thread list UI component
│   ├── ThreadItem.tsx                # Individual thread item
│   ├── MessageList.tsx               # Message list container
│   ├── MessageByIndex.tsx            # Index-based message renderer
│   ├── BranchPicker.tsx              # Branch navigation UI
│   ├── TokenUsageBar.tsx             # Token visualization
│   └── ThreadMetadataPanel.tsx       # Metadata display/edit
├── hooks/
│   ├── useThread.ts                  # Main thread hook
│   ├── useThreadList.ts              # Multi-thread management
│   ├── useThreadContext.ts           # Context injection hook
│   ├── useMessageByIndex.ts          # Index-based message access
│   ├── useThreadState.ts             # State selector hook
│   └── useThreadRuntime.ts           # Runtime access hook
├── store/
│   ├── ThreadStore.ts                # Core store implementation
│   ├── ThreadState.ts                # State type definitions
│   ├── ThreadActions.ts              # Action creators
│   └── ThreadSelectors.ts            # State selectors
├── runtime/
│   ├── ThreadRuntime.ts              # Runtime interface
│   ├── OpenAIRuntime.ts              # OpenAI adapter
│   ├── AnthropicRuntime.ts           # Anthropic adapter
│   ├── LangGraphRuntime.ts           # LangGraph adapter
│   └── LocalRuntime.ts               # In-memory runtime
├── persistence/
│   ├── ThreadPersistence.ts          # Persistence interface
│   ├── LocalStorageStore.ts          # localStorage implementation
│   ├── IndexedDBStore.ts             # IndexedDB implementation
│   ├── RESTStore.ts                  # REST API implementation
│   └── SupabaseStore.ts              # Supabase implementation
├── utils/
│   ├── TokenTracker.ts               # Token counting utilities
│   ├── BranchManager.ts              # Branching logic
│   ├── MessageSerializer.ts          # Import/export utilities
│   └── MessageValidator.ts           # Message validation
└── types/
    ├── Thread.ts                     # Thread types
    ├── Message.ts                    # Message types
    ├── Runtime.ts                    # Runtime types
    └── Store.ts                      # Store types
```

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.0 || ^19.0.0",
    "zustand": "^5.0.0",
    "immer": "^10.0.0",
    "zod": "^3.23.0",
    "date-fns": "^3.0.0"
  },
  "peerDependencies": {
    "@clarity/core": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "vitest": "^1.0.0"
  }
}
```

### Optional Integrations

- **Token Counting**: `js-tiktoken` for accurate token estimation
- **Persistence**: `idb` for IndexedDB wrapper
- **Backend**: `@supabase/supabase-js` for Supabase integration
- **LangGraph**: `@langchain/langgraph` for agent integration

## Accessibility

### Keyboard Navigation

- **Thread List**: Arrow keys to navigate, Enter to select, Delete to remove
- **Message Actions**: Tab to focus action buttons, Enter to execute
- **Branch Picker**: Arrow keys for branch selection

### Screen Reader Support

```typescript
// ARIA labels for thread list
<div
  role="list"
  aria-label="Conversation threads"
  aria-describedby="thread-list-description"
>
  <span id="thread-list-description" className="sr-only">
    List of {threads.length} conversation threads.
    Use arrow keys to navigate, Enter to select.
  </span>

  {threads.map((thread) => (
    <div
      key={thread.id}
      role="listitem"
      aria-label={`Thread: ${thread.title}`}
      aria-current={thread.id === currentThreadId}
      tabIndex={0}
    >
      {/* Thread content */}
    </div>
  ))}
</div>

// Message status announcements
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {status === 'streaming' && 'Assistant is typing...'}
  {status === 'complete' && 'Message complete'}
  {status === 'error' && 'Message failed. Please try again.'}
</div>

// Token limit warnings
<div
  role="alert"
  aria-live="assertive"
  className="sr-only"
>
  {tokenUsage.totalTokens > tokenUsage.limit * 0.9 &&
    `Warning: Approaching token limit. ${tokenUsage.limit - tokenUsage.totalTokens} tokens remaining.`}
</div>
```

### Focus Management

- Focus moves to new thread when created
- Focus returns to thread list after deletion
- Focus on first message when switching threads
- Focus trap in branch picker modal

### Color Contrast

- Thread status indicators meet WCAG AA standards
- Token usage bar colors accessible in light and dark modes
- Selected thread has clear visual distinction

## Testing Strategy

### Unit Tests

```typescript
describe('useThread', () => {
  it('should add message to thread', async () => {
    const { result } = renderHook(() => useThread(), {
      wrapper: ({ children }) => (
        <ThreadProvider threadId="test">{children}</ThreadProvider>
      )
    });

    await act(async () => {
      await result.current.addMessage({
        role: 'user',
        content: [{ type: 'text', data: 'Hello' }]
      });
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content[0].data).toBe('Hello');
  });

  it('should track token usage', async () => {
    const { result } = renderHook(() => useThread());

    await act(async () => {
      await result.current.addMessage({
        role: 'user',
        content: [{ type: 'text', data: 'Test message' }]
      });
    });

    expect(result.current.tokenUsage.totalTokens).toBeGreaterThan(0);
  });

  it('should create branch from message', async () => {
    const { result } = renderHook(() => useThread());

    const messageId = result.current.messages[0].id;

    await act(async () => {
      const branchId = await result.current.createBranch(messageId);
      expect(branchId).toBeDefined();
    });
  });
});

describe('useThreadList', () => {
  it('should create new thread', async () => {
    const { result } = renderHook(() => useThreadList());

    await act(async () => {
      await result.current.createThread('New Conversation');
    });

    expect(result.current.threads).toHaveLength(1);
    expect(result.current.threads[0].title).toBe('New Conversation');
  });

  it('should switch between threads', async () => {
    const { result } = renderHook(() => useThreadList());

    await act(async () => {
      const thread1 = await result.current.createThread('Thread 1');
      const thread2 = await result.current.createThread('Thread 2');
      await result.current.switchThread(thread1.id);
    });

    expect(result.current.currentThreadId).toBe(result.current.threads[0].id);
  });
});
```

### Integration Tests

```typescript
describe('Thread Integration', () => {
  it('should persist thread to storage', async () => {
    const store = new LocalStorageThreadStore();

    render(
      <ThreadProvider threadId="test" store={store}>
        <ChatInterface />
      </ThreadProvider>
    );

    // Add message
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Test message');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    // Verify persistence
    const savedThread = await store.getThread('test');
    expect(savedThread).toBeDefined();
    expect(savedThread.messageIds).toHaveLength(1);
  });

  it('should stream messages from runtime', async () => {
    const mockRuntime = new MockStreamingRuntime();

    render(
      <ThreadProvider runtime={mockRuntime}>
        <ChatInterface />
      </ThreadProvider>
    );

    // Send message
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    // Verify streaming
    await waitFor(() => {
      expect(screen.getByText(/assistant is typing/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/message complete/i)).toBeInTheDocument();
    });
  });
});
```

### E2E Tests

```typescript
test('complete conversation flow', async ({ page }) => {
  await page.goto('/chat')

  // Create new thread
  await page.click('[aria-label="Create new conversation"]')
  await expect(page.locator('[role="list"]')).toContainText('New Conversation')

  // Send message
  await page.fill('[role="textbox"]', 'What is React?')
  await page.click('[aria-label="Send message"]')

  // Wait for response
  await expect(page.locator('.message[data-role="assistant"]')).toBeVisible()

  // Create branch
  await page.hover('.message[data-role="assistant"]')
  await page.click('[aria-label="Create branch"]')
  await expect(page.locator('[role="dialog"]')).toBeVisible()

  // Export thread
  const downloadPromise = page.waitForEvent('download')
  await page.click('[aria-label="Export conversation"]')
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/thread-.*\.json/)
})
```

### Performance Tests

```typescript
describe('Performance', () => {
  it('should handle 1000 messages efficiently', async () => {
    const { result } = renderHook(() => useThread());

    const startTime = performance.now();

    await act(async () => {
      for (let i = 0; i < 1000; i++) {
        await result.current.addMessage({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: [{ type: 'text', data: `Message ${i}` }]
        });
      }
    });

    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(5000); // 5 seconds max
  });

  it('should render large thread without lag', async () => {
    const messages = Array.from({ length: 1000 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: [{ type: 'text', data: `Message ${i}` }],
      status: 'complete',
      timestamp: new Date()
    }));

    const startTime = performance.now();

    render(
      <ThreadProvider initialMessages={messages}>
        <MessageList />
      </ThreadProvider>
    );

    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(1000); // 1 second max
  });
});
```

## Documentation Requirements

### API Documentation

Each hook and component must have comprehensive JSDoc:

````typescript
/**
 * Hook for managing conversation thread state and operations.
 *
 * @example
 * ```tsx
 * function ChatInterface() {
 *   const { messages, addMessage, status } = useThread();
 *
 *   return (
 *     <div>
 *       <MessageList messages={messages} />
 *       <MessageInput
 *         onSend={(content) => addMessage({ role: 'user', content })}
 *         disabled={status === 'streaming'}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link ThreadProvider} for setup
 * @see {@link useThreadList} for multi-thread management
 */
export function useThread(): UseThreadReturn {
  // Implementation
}
````

### Usage Guides

- **Getting Started**: Basic setup with single thread
- **Multi-Thread Management**: Managing multiple conversations
- **Message Branching**: Exploring alternative conversation paths
- **Custom Backend**: Integrating with different LLM providers
- **Token Management**: Tracking and limiting token usage
- **Export/Import**: Saving and restoring conversations
- **Performance Optimization**: Best practices for large threads

### Migration Guides

- From basic chat to thread management
- From local storage to backend persistence
- From single thread to multi-thread
- Upgrading between versions

### Examples

- Basic chat with thread persistence
- Multi-conversation application
- Branching conversation explorer
- Custom runtime integration
- Token-aware conversation limiter
- Conversation export/import tool

## Timeline

### Week 1: Core Implementation (5 days)

**Day 1-2: State Management Foundation**

- Implement ThreadStore with Zustand
- Create ThreadState and actions
- Build subscription system
- Write unit tests for store

**Day 3-4: Thread Operations**

- Implement useThread hook
- Add message CRUD operations
- Build token tracking
- Implement persistence layer (localStorage, IndexedDB)

**Day 5: Multi-Thread Support**

- Implement useThreadList hook
- Add thread CRUD operations
- Build filtering and search
- Create export/import functionality

### Week 1: Runtime & Components (2 days)

**Day 6: Runtime Integration**

- Create ThreadRuntime interface
- Implement OpenAI adapter
- Implement Anthropic adapter
- Add streaming support

**Day 7: UI Components**

- Build ThreadProvider component
- Create ThreadList component
- Implement MessageByIndex component
- Add BranchPicker component
- Create TokenUsageBar component

### Total Deliverables

By end of Week 1:

- ✅ Core thread state management
- ✅ Thread and message CRUD operations
- ✅ Multi-thread support with list management
- ✅ Token tracking and limits
- ✅ Persistence (localStorage, IndexedDB)
- ✅ Runtime adapters (OpenAI, Anthropic)
- ✅ Essential UI components
- ✅ Message branching support
- ✅ Export/import functionality
- ✅ Comprehensive test coverage (>85%)
- ✅ API documentation
- ✅ Usage examples

### Future Enhancements (Post-Week 1)

- Additional runtime adapters (LangGraph, local models)
- Advanced branching visualization
- Thread templates and presets
- Collaborative editing
- Real-time synchronization
- Advanced search and filtering
- Thread analytics and insights
- AI-powered thread summarization

## Success Metrics

- **Test Coverage**: >85% code coverage
- **Performance**: Support 1000+ messages without lag
- **Bundle Size**: <50KB gzipped for core thread management
- **Type Safety**: 100% TypeScript coverage with no `any` types
- **Documentation**: All public APIs documented with examples
- **Accessibility**: WCAG 2.1 AA compliance
- **Developer Experience**: Setup working thread management in <5 minutes

## Open Questions

1. Should thread branching be enabled by default or opt-in?
2. What's the default token limit for threads?
3. Should we implement automatic thread summarization for long conversations?
4. How should we handle thread conflicts in collaborative editing?
5. What's the preferred persistence strategy (local-first, server-first, hybrid)?
6. Should we support thread templates/presets?
7. How should we handle message versioning (for edits/regenerations)?
8. What's the strategy for thread archival and cleanup?

## Related Specifications

- Message Bubble Component (existing)
- Message Input Component (existing)
- Streaming Response Component (existing)
- Tool Calling UI Component (future)
- Multi-Agent Coordination (future)
- Conversation Analytics Component (future)
