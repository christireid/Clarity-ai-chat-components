# React Hooks Guide

Comprehensive guide to using Clarity Memory hooks in React applications. These hooks provide a React-friendly interface to the memory service with proper state management, loading states, and error handling.

---

## Table of Contents

- [Installation](#installation)
- [Hook Hierarchy](#hook-hierarchy)
- [Core Hooks](#core-hooks)
- [Specialized Hooks](#specialized-hooks)
- [Best Practices](#best-practices)
- [Examples](#examples)
- [Performance Optimization](#performance-optimization)
- [TypeScript Support](#typescript-support)

---

## Installation

```bash
npm install @clarity-chat/memory
# or
pnpm add @clarity-chat/memory
# or
yarn add @clarity-chat/memory
```

---

## Hook Hierarchy

```
useMemoryService (base service hook)
  ├── useMemories (memory CRUD operations)
  │   ├── useMemoryStorage (simplified storage)
  │   └── useMemoryQuery (advanced queries)
  ├── useMemoryStats (statistics and metrics)
  ├── useMemoryConsent (GDPR compliance)
  └── useMemoryTools (tool integration)
```

**Design Principles**:

1. **Composition**: Build complex functionality from simple primitives
2. **Single Responsibility**: Each hook does one thing well
3. **Consistent API**: Similar patterns across all hooks
4. **Type Safety**: Full TypeScript support
5. **Performance**: Optimized with memoization and minimal re-renders

---

## Core Hooks

### useMemoryService

**Purpose**: Initialize and manage the base memory service instance.

**Signature**:

```typescript
function useMemoryService(config?: Partial<MemoryServiceConfig>): MemoryService
```

**Usage**:

```typescript
import { useMemoryService } from '@clarity-chat/memory/react'
import { createConfig } from '@clarity-chat/memory'

function MyComponent() {
  // Option 1: Use with preset/profile
  const memory = useMemoryService(createConfig('browser', 'chatbot'))

  // Option 2: Custom configuration
  const memory = useMemoryService({
    limits: {
      maxMemories: 1000,
      maxTotalTokens: 100000,
    },
    consent: {
      enabled: true,
      requireConsentForWrites: true,
    },
  })

  // Option 3: Default configuration
  const memory = useMemoryService()

  return <ChatInterface memory={memory} />
}
```

**When to Use**:

- ✅ Need direct access to memory service
- ✅ Building custom hooks on top
- ✅ Advanced use cases

**When NOT to Use**:

- ❌ Simple memory operations (use `useMemories`)
- ❌ Just querying memories (use `useMemoryQuery`)

---

### useMemories

**Purpose**: Complete memory management with CRUD operations, loading states, and error handling.

**Signature**:

```typescript
function useMemories(config?: UseMemoriesConfig): {
  memories: MemoryItem[]
  isLoading: boolean
  error: Error | null
  add: (content: string, options: AddOptions) => Promise<MemoryItem>
  query: (query: string, options?: QueryOptions) => Promise<MemoryItem[]>
  update: (id: string, updates: Partial<MemoryItem>) => Promise<MemoryItem>
  remove: (id: string) => Promise<boolean>
  clear: () => Promise<void>
  refresh: () => Promise<void>
}
```

**Usage**:

```typescript
import { useMemories } from '@clarity-chat/memory/react'

function ChatComponent() {
  const {
    memories,
    isLoading,
    error,
    add,
    query,
    remove,
    clear,
  } = useMemories({
    userId: 'user_123',
    autoLoad: true, // Automatically load memories on mount
  })

  const handleSendMessage = async (message: string) => {
    // Store message
    await add(message, {
      type: 'episodic',
      scope: 'thread',
      metadata: { role: 'user' },
    })
  }

  const handleSearch = async (searchQuery: string) => {
    const results = await query(searchQuery, {
      types: ['semantic', 'episodic'],
      limit: 10,
    })
    console.log('Search results:', results)
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <MemoryList memories={memories} />
      <ChatInput onSend={handleSendMessage} />
      <SearchBar onSearch={handleSearch} />
    </div>
  )
}
```

**Features**:

- ✅ Automatic state management
- ✅ Loading and error states
- ✅ Optimistic updates
- ✅ Auto-refresh on changes
- ✅ Memoized callbacks

---

### useMemoryQuery

**Purpose**: Advanced querying with filters, pagination, and real-time updates.

**Signature**:

```typescript
function useMemoryQuery(
  query: string | MemoryQuery,
  options?: UseMemoryQueryOptions
): {
  results: MemorySearchResult[]
  isLoading: boolean
  error: Error | null
  hasMore: boolean
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
  refetch: (newQuery: string | MemoryQuery) => Promise<void>
}
```

**Usage**:

```typescript
import { useMemoryQuery } from '@clarity-chat/memory/react'

function MemorySearchComponent() {
  const [searchTerm, setSearchTerm] = useState('')
  const {
    results,
    isLoading,
    hasMore,
    loadMore,
    refetch,
  } = useMemoryQuery(searchTerm, {
    types: ['semantic', 'episodic'],
    limit: 20,
    realtime: true, // Auto-refresh on memory changes
  })

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          refetch(e.target.value)
        }}
      />

      {results.map((result) => (
        <MemoryCard
          key={result.memory.id}
          memory={result.memory}
          relevance={result.relevance}
        />
      ))}

      {hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          Load More
        </button>
      )}
    </div>
  )
}
```

---

## Specialized Hooks

### useMemoryConsent

**Purpose**: Manage GDPR/CCPA consent for memory storage.

**Signature**:

```typescript
function useMemoryConsent(userId: string): {
  hasConsent: boolean
  isLoading: boolean
  grantConsent: (purposes: ConsentPurpose[]) => Promise<void>
  withdrawConsent: (purposes: ConsentPurpose[]) => Promise<void>
  checkConsent: (purpose: ConsentPurpose) => boolean
  consentRecords: ConsentRecord[]
}
```

**Usage**:

```typescript
import { useMemoryConsent } from '@clarity-chat/memory/react'

function ConsentBanner() {
  const {
    hasConsent,
    grantConsent,
    withdrawConsent,
    checkConsent,
  } = useMemoryConsent('user_123')

  if (hasConsent) {
    return null // Don't show banner if consent already granted
  }

  return (
    <div className="consent-banner">
      <p>We use memory to personalize your experience.</p>
      <button onClick={() => grantConsent(['message_storage', 'personalization'])}>
        Accept
      </button>
      <button onClick={() => {/* Show settings */}}>
        Customize
      </button>
    </div>
  )
}

function PrivacySettings() {
  const { checkConsent, withdrawConsent } = useMemoryConsent('user_123')

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checkConsent('message_storage')}
          onChange={(e) => {
            if (e.target.checked) {
              grantConsent(['message_storage'])
            } else {
              withdrawConsent(['message_storage'])
            }
          }}
        />
        Message Storage
      </label>

      <label>
        <input
          type="checkbox"
          checked={checkConsent('personalization')}
          onChange={(e) => {
            if (e.target.checked) {
              grantConsent(['personalization'])
            } else {
              withdrawConsent(['personalization'])
            }
          }}
        />
        Personalization
      </label>
    </div>
  )
}
```

---

### useMemoryStats

**Purpose**: Monitor memory usage, performance, and statistics.

**Signature**:

```typescript
function useMemoryStats(options?: UseMemoryStatsOptions): {
  stats: MemoryStats
  isLoading: boolean
  refresh: () => Promise<void>
}
```

**Usage**:

```typescript
import { useMemoryStats } from '@clarity-chat/memory/react'

function MemoryDashboard() {
  const { stats, refresh } = useMemoryStats({
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return (
    <div className="dashboard">
      <StatCard title="Total Memories" value={stats.total} />
      <StatCard title="Token Usage" value={`${stats.totalTokens} / ${stats.maxTokens}`} />
      <StatCard
        title="Usage"
        value={`${Math.round(stats.totalTokens / stats.maxTokens * 100)}%`}
      />

      <h3>By Type</h3>
      <ul>
        <li>Episodic: {stats.byType.episodic}</li>
        <li>Semantic: {stats.byType.semantic}</li>
        <li>Procedural: {stats.byType.procedural}</li>
        <li>Working: {stats.byType.working}</li>
      </ul>

      <h3>By Scope</h3>
      <ul>
        <li>Global: {stats.byScope.global}</li>
        <li>User: {stats.byScope.user}</li>
        <li>Thread: {stats.byScope.thread}</li>
        <li>Session: {stats.byScope.session}</li>
      </ul>

      <button onClick={refresh}>Refresh Stats</button>
    </div>
  )
}
```

---

### useMemoryTools

**Purpose**: Automatic tool call capture and retrieval.

**Signature**:

```typescript
function useMemoryTools(options?: UseMemoryToolsOptions): {
  captureToolCall: (
    toolName: string,
    params: any,
    result: any,
    options?: CaptureOptions
  ) => Promise<MemoryItem | null>
  getToolHistory: (toolName?: string) => Promise<MemoryItem[]>
  getToolContext: (query: string) => Promise<string>
  isCapturing: boolean
}
```

**Usage**:

```typescript
import { useMemoryTools } from '@clarity-chat/memory/react'

function DatabaseQueryComponent() {
  const { captureToolCall, getToolHistory } = useMemoryTools({
    autoCapture: true,
    toolFilter: (name) => name.startsWith('database_'),
  })

  const handleQuery = async (sql: string) => {
    const result = await executeSQL(sql)

    // Automatically captured if autoCapture=true
    // Or manually capture:
    await captureToolCall('database_query', { sql }, result, {
      toolType: 'database',
      priority: 'medium',
    })

    return result
  }

  const handleShowHistory = async () => {
    const history = await getToolHistory('database_query')
    console.log('Query history:', history)
  }

  return (
    <div>
      <QueryEditor onExecute={handleQuery} />
      <button onClick={handleShowHistory}>Show Query History</button>
    </div>
  )
}
```

---

## Best Practices

### 1. Hook Composition

Build complex functionality from simple hooks:

```typescript
// Custom hook combining multiple memory hooks
function useChatMemory(userId: string, threadId: string) {
  const { add, query } = useMemories({ userId })
  const { captureToolCall } = useMemoryTools()
  const { hasConsent, grantConsent } = useMemoryConsent(userId)

  const addMessage = useCallback(
    async (message: Message) => {
      if (!hasConsent) {
        await grantConsent(['message_storage'])
      }

      return add(message.content, {
        type: 'episodic',
        scope: 'thread',
        metadata: {
          threadId,
          messageId: message.id,
          role: message.role,
        },
      })
    },
    [userId, threadId, hasConsent, add, grantConsent]
  )

  const searchConversation = useCallback(
    async (searchQuery: string) => {
      return query(searchQuery, {
        types: ['episodic'],
        metadata: { threadId },
        limit: 20,
      })
    },
    [query, threadId]
  )

  return {
    addMessage,
    searchConversation,
    captureToolCall,
  }
}
```

### 2. Memoization

Prevent unnecessary re-renders:

```typescript
function ChatComponent({ userId }: Props) {
  // ✅ GOOD: Memoize configuration
  const config = useMemo(
    () => createConfig('browser', 'chatbot'),
    [] // Only create once
  )

  const memory = useMemoryService(config)

  // ✅ GOOD: Memoize callbacks
  const handleAdd = useCallback(
    async (content: string) => {
      await memory.add(content, { type: 'episodic' })
    },
    [memory] // Only recreate if memory changes
  )

  return <ChatInterface onSend={handleAdd} />
}

// ❌ BAD: Creating new config every render
function BadComponent({ userId }: Props) {
  const memory = useMemoryService(createConfig('browser', 'chatbot')) // New config every render!
  return <ChatInterface memory={memory} />
}
```

### 3. Error Handling

Always handle errors properly:

```typescript
function RobustComponent() {
  const { add, error } = useMemories()

  const handleAdd = async (content: string) => {
    try {
      await add(content, { type: 'episodic' })
      toast.success('Memory saved')
    } catch (err) {
      // Error is also available in the hook's error state
      toast.error(`Failed to save: ${err.message}`)

      // Report to error tracking service
      Sentry.captureException(err)
    }
  }

  // Also check the hook's error state
  if (error) {
    return <ErrorBoundary error={error} />
  }

  return <ChatInterface onSend={handleAdd} />
}
```

### 4. Loading States

Provide feedback during async operations:

```typescript
function LoadingAwareComponent() {
  const { memories, isLoading, add } = useMemories()
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = async (content: string) => {
    setIsAdding(true)
    try {
      await add(content, { type: 'episodic' })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <MemoryList memories={memories} />
      )}

      <AddButton onClick={handleAdd} disabled={isAdding} />
    </div>
  )
}
```

### 5. Cleanup

Clean up resources when unmounting:

```typescript
function ComponentWithCleanup() {
  const { clear } = useMemories()

  useEffect(() => {
    return () => {
      // Clear session memories on unmount
      clear({ scopes: ['session'] })
    }
  }, [clear])

  return <ChatInterface />
}
```

---

## Examples

### Complete Chat Application

```typescript
import {
  useMemories,
  useMemoryConsent,
  useMemoryTools,
} from '@clarity-chat/memory/react'

function ChatApp({ userId, threadId }: Props) {
  const [messages, setMessages] = useState<Message[]>([])

  // Memory management
  const { add, query } = useMemories({ userId, autoLoad: true })

  // Consent management
  const { hasConsent, grantConsent } = useMemoryConsent(userId)

  // Tool integration
  const { captureToolCall } = useMemoryTools({ autoCapture: true })

  // Send message
  const handleSend = async (content: string) => {
    // Check consent
    if (!hasConsent) {
      const granted = await requestConsent()
      if (!granted) return
      await grantConsent(['message_storage'])
    }

    // Add user message
    const userMessage = { role: 'user', content }
    setMessages((prev) => [...prev, userMessage])

    // Store to memory
    await add(content, {
      type: 'episodic',
      scope: 'thread',
      metadata: { threadId, role: 'user' },
    })

    // Get AI response (with relevant context)
    const context = await query('relevant context', {
      limit: 10,
      metadata: { threadId },
    })

    const response = await getAIResponse(content, context)

    // Add assistant message
    const assistantMessage = { role: 'assistant', content: response }
    setMessages((prev) => [...prev, assistantMessage])

    // Store assistant response
    await add(response, {
      type: 'episodic',
      scope: 'thread',
      metadata: { threadId, role: 'assistant' },
    })
  }

  // Search conversation
  const handleSearch = async (query: string) => {
    const results = await query(query, {
      types: ['episodic'],
      metadata: { threadId },
      limit: 20,
    })
    return results
  }

  return (
    <ChatInterface
      messages={messages}
      onSend={handleSend}
      onSearch={handleSearch}
    />
  )
}
```

---

## Performance Optimization

### Debounced Search

```typescript
import { useDebouncedCallback } from 'use-debounce'

function SearchComponent() {
  const { query } = useMemories()
  const [results, setResults] = useState([])

  const debouncedSearch = useDebouncedCallback(
    async (searchTerm: string) => {
      const searchResults = await query(searchTerm, { limit: 10 })
      setResults(searchResults)
    },
    300 // 300ms debounce
  )

  return (
    <input
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search memories..."
    />
  )
}
```

### Pagination

```typescript
function PaginatedMemories() {
  const [page, setPage] = useState(0)
  const { query } = useMemories()
  const [memories, setMemories] = useState<MemoryItem[]>([])

  const loadPage = useCallback(async (pageNum: number) => {
    const results = await query('', {
      limit: 20,
      offset: pageNum * 20,
    })
    setMemories(results.map(r => r.memory))
  }, [query])

  useEffect(() => {
    loadPage(page)
  }, [page, loadPage])

  return (
    <div>
      <MemoryList memories={memories} />
      <Pagination
        page={page}
        onPageChange={setPage}
      />
    </div>
  )
}
```

---

## TypeScript Support

All hooks are fully typed:

```typescript
import type {
  MemoryItem,
  MemorySearchResult,
  UseMemoriesConfig,
} from '@clarity-chat/memory/react'

// Type-safe configuration
const config: UseMemoriesConfig = {
  userId: 'user_123',
  autoLoad: true,
  onError: (error) => console.error(error),
}

// Type-safe results
const results: MemorySearchResult[] = await query('search', {
  types: ['episodic'], // Type-checked!
  scopes: ['thread'], // Type-checked!
})

// Type-safe memory creation
const memory: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'> = {
  content: 'User prefers TypeScript',
  type: 'semantic',
  scope: 'user',
  // ... fully typed!
}
```

---

## See Also

- [Memory Types Guide](./MEMORY_TYPES.md) - Understanding memory types
- [Scopes Guide](./SCOPES.md) - Understanding memory scopes
- [API Reference](./API.md) - Complete API documentation
- [Best Practices](./BEST_PRACTICES.md) - Memory system best practices
