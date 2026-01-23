# Memory System Troubleshooting Guide

This guide helps you diagnose and resolve common issues with the Clarity Memory system.

---

## Table of Contents

1. [Quick Diagnostic Checklist](#quick-diagnostic-checklist)
2. [Common Errors](#common-errors)
3. [Performance Issues](#performance-issues)
4. [Privacy & Consent Issues](#privacy--consent-issues)
5. [Memory Retrieval Problems](#memory-retrieval-problems)
6. [Integration Issues](#integration-issues)
7. [Debugging Strategies](#debugging-strategies)
8. [Production Issues](#production-issues)

---

## Quick Diagnostic Checklist

Before diving deep, run through this checklist:

```typescript
// 1. Check configuration
const config = memoryService.getConfig()
console.log('Memory Config:', config)

// 2. Verify consent status (if privacy enabled)
const consentStatus = await memoryService.checkConsent('user_123')
console.log('Consent Status:', consentStatus)

// 3. Check memory stats
const stats = await memoryService.getStats()
console.log('Memory Stats:', stats)

// 4. Test basic operations
try {
  const memory = await memoryService.addMemory(
    'Test memory',
    'working',
    'session',
    {}
  )
  console.log('✅ Basic write working:', memory.id)

  const results = await memoryService.query('test', { limit: 1 })
  console.log('✅ Basic query working:', results.length)
} catch (error) {
  console.error('❌ Basic operations failing:', error)
}
```

---

## Common Errors

### 1. MemoryConsentError: "Consent required but not granted"

**Symptoms:**

```typescript
MemoryConsentError: Consent required but not granted for user: user_123
  at ConsentManager.checkConsent (consent-manager.ts:45)
```

**Cause:** Privacy mode is enabled but user hasn't granted consent.

**Solution:**

```typescript
// Option 1: Grant consent explicitly
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// Grant consent before storing memories
await memory.grantConsent('user_123', {
  scopes: ['user', 'thread', 'session'],
  purposes: ['personalization', 'analytics'],
  expiresAt: new Date('2026-12-31'),
})

// Now this will work
await memory.add('User message', {
  type: 'episodic',
  scope: 'user',
  metadata: { userId: 'user_123' },
})
```

```typescript
// Option 2: Disable privacy mode (not recommended for production)
const memory = clarityMemory({
  privacy: {
    enabled: false, // Disable consent checks
  },
})
```

```typescript
// Option 3: Use React hook to manage consent
import { useMemoryConsent } from '@clarity-chat/memory'

function ConsentDialog() {
  const { grantConsent, revokeConsent, hasConsent, loading } = useMemoryConsent('user_123')

  const handleGrant = async () => {
    await grantConsent({
      scopes: ['user', 'thread'],
      purposes: ['personalization'],
    })
  }

  return (
    <button onClick={handleGrant} disabled={loading}>
      {hasConsent ? 'Consent Granted ✅' : 'Grant Consent'}
    </button>
  )
}
```

**Prevention:**

- Always check consent status before storing user-scoped memories
- Implement consent UI early in your app flow
- Use `strictMode: false` for development/testing only

---

### 2. MemoryOperationError: "Memory content exceeds maximum size"

**Symptoms:**

```typescript
MemoryOperationError: Memory content exceeds maximum size limit (5000 chars)
  at MemoryService.addMemory (memory-service.ts:123)
```

**Cause:** Content exceeds configured `maxMemorySize` limit.

**Solutions:**

```typescript
// Solution 1: Increase size limit
const memory = clarityMemory({
  maxMemorySize: 10000, // Increase from default 5000
})
```

```typescript
// Solution 2: Truncate or summarize content
function truncateContent(content: string, maxLength = 4500): string {
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength) + '... [truncated]'
}

await memory.add(truncateContent(longContent), {
  type: 'episodic',
  scope: 'thread',
})
```

```typescript
// Solution 3: Split into multiple memories
function splitIntoMemories(content: string, chunkSize = 4000) {
  const chunks = []
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.slice(i, i + chunkSize))
  }
  return chunks
}

const chunks = splitIntoMemories(longContent)
for (const [index, chunk] of chunks.entries()) {
  await memory.add(chunk, {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      partIndex: index,
      totalParts: chunks.length,
      messageId: 'msg_123',
    },
  })
}
```

**Prevention:**

- Set appropriate size limits based on your use case
- Implement content summarization for long messages
- Store full content elsewhere and use memory for summaries

---

### 3. MemoryQueryError: "Query failed - no embedding provider configured"

**Symptoms:**

```typescript
MemoryQueryError: Cannot perform semantic search - no embedding provider configured
  at MemoryService.query (memory-service.ts:234)
```

**Cause:** Attempting semantic search without an embedding provider.

**Solutions:**

```typescript
// Solution 1: Configure embedding provider
import { clarityMemory } from '@clarity-chat/memory'
import { OpenAIEmbeddings } from '@langchain/openai'

const memory = clarityMemory({
  embeddingProvider: new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-3-small',
  }),
})
```

```typescript
// Solution 2: Use keyword search instead
const results = await memory.query('search query', {
  useSemanticSearch: false, // Disable semantic search
  limit: 10,
})
```

```typescript
// Solution 3: Use metadata filtering
const results = await memory.query('', {
  filters: {
    type: 'episodic',
    metadata: { topic: 'pricing' },
  },
  limit: 10,
})
```

**Prevention:**

- Always configure embedding provider for semantic search
- Use configuration presets that include embeddings
- Fall back to keyword search when embeddings unavailable

---

### 4. MemoryConfigError: "Invalid token budget configuration"

**Symptoms:**

```typescript
MemoryConfigError: maxTokensPerMemory (2000) exceeds maxTotalTokens (1000)
  at validateTokenConfig (memory-service.ts:67)
```

**Cause:** Invalid token budget configuration.

**Solution:**

```typescript
// WRONG: maxTokensPerMemory > maxTotalTokens
const memory = clarityMemory({
  maxTokensPerMemory: 2000,
  maxTotalTokens: 1000, // Error!
})

// RIGHT: Ensure maxTokensPerMemory <= maxTotalTokens
const memory = clarityMemory({
  maxTokensPerMemory: 500,
  maxTotalTokens: 2000,
})

// BETTER: Use configuration presets
import { createBrowserConfig } from '@clarity-chat/memory'

const memory = clarityMemory(
  createBrowserConfig({
    tokenBudget: 'generous', // 4000 total, 800 per memory
  })
)
```

**Prevention:**

- Use configuration presets to avoid invalid combinations
- Validate token budgets: `maxTokensPerMemory <= maxTotalTokens`
- Test configuration with `memory.getConfig()` before use

---

### 5. TypeError: "Cannot read property 'add' of undefined"

**Symptoms:**

```typescript
TypeError: Cannot read property 'add' of undefined
  at MyComponent.tsx:45
```

**Cause:** Memory service not initialized or context missing.

**Solutions:**

```typescript
// Solution 1: Ensure MemoryProvider wraps your app
import { MemoryProvider } from '@clarity-chat/memory'

function App() {
  return (
    <MemoryProvider>
      <MyComponent /> {/* Now has access to memory context */}
    </MemoryProvider>
  )
}
```

```typescript
// Solution 2: Check hook usage location
import { useMemoryService } from '@clarity-chat/memory'

function MyComponent() {
  // ✅ GOOD: Inside component
  const memory = useMemoryService()

  useEffect(() => {
    // ✅ GOOD: Inside effect
    memory.add('test', { type: 'working', scope: 'session' })
  }, [])

  return <div>...</div>
}

// ❌ BAD: Outside component
const memory = useMemoryService() // Error!
```

```typescript
// Solution 3: Use service directly (non-React)
import { clarityMemory } from '@clarity-chat/memory'

// Create service instance
const memory = clarityMemory()

// Now use it
await memory.add('test', { type: 'working', scope: 'session' })
```

**Prevention:**

- Always use `MemoryProvider` in React apps
- Only call hooks inside components/hooks
- Use direct service instantiation in non-React code

---

## Performance Issues

### Issue: Slow Memory Queries

**Symptoms:**

- Queries taking >500ms
- UI freezing during memory operations
- High memory usage

**Diagnostic Steps:**

```typescript
// 1. Check memory count and token usage
const stats = await memory.getStats()
console.log('Total memories:', stats.totalMemories)
console.log('Token usage:', stats.totalTokens, '/', stats.maxTotalTokens)
console.log('Cache hit rate:', stats.cacheHitRate)

// 2. Profile query performance
console.time('memory-query')
const results = await memory.query('search term', { limit: 10 })
console.timeEnd('memory-query')

// 3. Check if semantic search is bottleneck
console.time('semantic-search')
const semanticResults = await memory.query('test', {
  useSemanticSearch: true,
})
console.timeEnd('semantic-search')

console.time('keyword-search')
const keywordResults = await memory.query('test', {
  useSemanticSearch: false,
})
console.timeEnd('keyword-search')
```

**Solutions:**

```typescript
// Solution 1: Reduce memory count
const memory = clarityMemory({
  maxMemoryCount: 100, // Reduce from default 1000
})
```

```typescript
// Solution 2: Use aggressive token limits
const memory = clarityMemory({
  maxTotalTokens: 2000, // Stricter limit
  enforceTokenLimits: true, // Enable enforcement
})
```

```typescript
// Solution 3: Optimize queries with filters
// ❌ SLOW: No filters, searches everything
const results = await memory.query('pricing')

// ✅ FAST: Filter by type and scope
const results = await memory.query('pricing', {
  filters: {
    type: 'episodic',
    scope: 'thread',
  },
  limit: 5, // Limit results
})
```

```typescript
// Solution 4: Use React Query with caching
import { useMemoryQuery } from '@clarity-chat/memory'
import { useQuery } from '@tanstack/react-query'

function MyComponent() {
  const memoryService = useMemoryService()

  const { data, isLoading } = useQuery({
    queryKey: ['memories', 'pricing'],
    queryFn: () => memoryService.query('pricing', { limit: 10 }),
    staleTime: 60000, // Cache for 1 minute
  })

  return <div>...</div>
}
```

```typescript
// Solution 5: Debounce frequent queries
import { useMemo } from 'react'
import { debounce } from 'lodash'

function SearchComponent() {
  const memory = useMemoryService()

  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        const results = await memory.query(query, { limit: 5 })
        setResults(results)
      }, 300),
    [memory]
  )

  return <input onChange={(e) => debouncedSearch(e.target.value)} />
}
```

**Prevention:**

- Set appropriate memory limits from the start
- Use filters and limits in all queries
- Implement caching for repeated queries
- Profile performance regularly

---

### Issue: Memory Leaks / Unbounded Growth

**Symptoms:**

- Memory usage growing indefinitely
- Application slowing down over time
- Browser tab crashing

**Diagnostic:**

```typescript
// Monitor memory growth
setInterval(() => {
  const stats = memoryService.getStats()
  console.log('Memory count:', stats.totalMemories)
  console.log('Token usage:', stats.totalTokens)

  if (stats.totalMemories > 1000) {
    console.warn('⚠️ Memory count exceeding safe limits!')
  }
}, 10000) // Check every 10 seconds
```

**Solutions:**

```typescript
// Solution 1: Enable automatic eviction
const memory = clarityMemory({
  maxMemoryCount: 500,
  evictionPolicy: 'lru', // Least Recently Used
})
```

```typescript
// Solution 2: Use working memory for temporary data
// ❌ WRONG: Storing temporary data in episodic
await memory.add('temporary calculation result', {
  type: 'episodic', // Will persist!
  scope: 'user',
})

// ✅ RIGHT: Use working memory
await memory.add('temporary calculation result', {
  type: 'working', // Auto-cleared
  scope: 'session',
})
```

```typescript
// Solution 3: Manual cleanup of old memories
async function cleanupOldMemories() {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

  const oldMemories = await memory.query('', {
    filters: {
      type: 'episodic',
      createdBefore: oneWeekAgo,
    },
    limit: 1000,
  })

  for (const mem of oldMemories) {
    await memory.deleteMemory(mem.id)
  }

  console.log(`Cleaned up ${oldMemories.length} old memories`)
}

// Run cleanup periodically
setInterval(cleanupOldMemories, 24 * 60 * 60 * 1000) // Daily
```

```typescript
// Solution 4: Clear session memory on unmount
function ChatSession() {
  const memory = useMemoryService()
  const sessionId = useSessionId()

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      memory.clearSession(sessionId)
    }
  }, [sessionId])

  return <div>...</div>
}
```

**Prevention:**

- Always set `maxMemoryCount` and `maxTotalTokens`
- Use working memory for temporary data
- Implement cleanup strategies
- Monitor memory usage in production

---

## Privacy & Consent Issues

### Issue: GDPR Deletion Not Working

**Symptoms:**

- User memories persist after deletion request
- `deleteUserData()` not removing all data

**Diagnostic:**

```typescript
// Check what memories exist for user
const userMemories = await memory.query('', {
  filters: {
    scope: 'user',
    metadata: { userId: 'user_123' },
  },
  limit: 100,
})

console.log('User memories found:', userMemories.length)
console.log('Scopes:', [...new Set(userMemories.map((m) => m.scope))])
```

**Solutions:**

```typescript
// Solution 1: Use proper GDPR deletion method
await memory.deleteUserData('user_123', {
  includeScopes: ['user', 'thread', 'session'], // All scopes
  auditLog: true, // Log deletion for compliance
})
```

```typescript
// Solution 2: Check for memories in all scopes
const allScopes = ['global', 'user', 'thread', 'session']

for (const scope of allScopes) {
  const memories = await memory.query('', {
    filters: {
      scope,
      metadata: { userId: 'user_123' },
    },
    limit: 1000,
  })

  console.log(`${scope}: ${memories.length} memories`)

  for (const mem of memories) {
    await memory.deleteMemory(mem.id)
  }
}
```

```typescript
// Solution 3: Verify consent was revoked
const consentStatus = await memory.checkConsent('user_123')
console.log('Consent still exists?', consentStatus.granted)

// Revoke consent explicitly
await memory.revokeConsent('user_123')
```

**Prevention:**

- Use `deleteUserData()` for GDPR compliance
- Include all scopes in deletion
- Always revoke consent after data deletion
- Implement audit logging
- Test deletion in development

---

### Issue: Consent Modal Appearing Repeatedly

**Symptoms:**

- Consent dialog shows on every page load
- Consent not persisting

**Solutions:**

```typescript
// Solution 1: Persist consent properly
import { useMemoryConsent } from '@clarity-chat/memory'

function ConsentBanner() {
  const { hasConsent, grantConsent } = useMemoryConsent('user_123')

  // ✅ Check if consent already granted
  if (hasConsent) return null

  const handleGrant = async () => {
    await grantConsent({
      scopes: ['user', 'thread'],
      purposes: ['personalization'],
      // ✅ Set long expiration
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    })
  }

  return <ConsentDialog onGrant={handleGrant} />
}
```

```typescript
// Solution 2: Use localStorage for consent state
const CONSENT_KEY = 'clarity-memory-consent'

function saveConsent(userId: string, granted: boolean) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ userId, granted, timestamp: Date.now() })
  )
}

function loadConsent(userId: string): boolean {
  const stored = localStorage.getItem(CONSENT_KEY)
  if (!stored) return false

  const data = JSON.parse(stored)
  return data.userId === userId && data.granted
}
```

**Prevention:**

- Set long consent expiration dates
- Persist consent state properly
- Check consent status before showing dialog

---

## Memory Retrieval Problems

### Issue: Query Returns No Results

**Symptoms:**

- `memory.query()` returns empty array
- Expected memories not found

**Diagnostic:**

```typescript
// 1. Check if memories exist
const allMemories = await memory.query('', { limit: 100 })
console.log('Total memories:', allMemories.length)

// 2. Check specific filters
const filtered = await memory.query('', {
  filters: {
    type: 'episodic',
    scope: 'thread',
    metadata: { threadId: 'thread_123' },
  },
})
console.log('Filtered memories:', filtered.length)

// 3. Verify memory content
console.log('Sample memory:', allMemories[0])
```

**Solutions:**

```typescript
// Solution 1: Check query syntax
// ❌ WRONG: Filters won't match
await memory.query('pricing', {
  filters: {
    metadata: { topic: 'Pricing' }, // Case sensitive!
  },
})

// ✅ RIGHT: Use consistent casing or case-insensitive search
await memory.query('pricing', {
  filters: {
    metadata: { topic: 'pricing' },
  },
})
```

```typescript
// Solution 2: Verify metadata structure
// When adding memory
await memory.add('User asked about pricing', {
  type: 'episodic',
  scope: 'thread',
  metadata: {
    threadId: 'thread_123', // ✅ Include threadId
    topic: 'pricing',
  },
})

// When querying
const results = await memory.query('pricing', {
  filters: {
    metadata: { threadId: 'thread_123' }, // ✅ Match threadId
  },
})
```

```typescript
// Solution 3: Use broader queries
// ❌ TOO SPECIFIC: May miss results
await memory.query('exact phrase from memory', { limit: 5 })

// ✅ BROADER: More likely to match
await memory.query('pricing plans', { limit: 10 })

// ✅ FILTER-BASED: Reliable for structured queries
await memory.query('', {
  filters: { type: 'episodic', scope: 'thread' },
  limit: 20,
})
```

**Prevention:**

- Use consistent metadata structure
- Test queries immediately after adding memories
- Use filters for reliable retrieval

---

### Issue: Query Returns Irrelevant Results

**Symptoms:**

- Search results don't match query intent
- Low relevance scores

**Solutions:**

```typescript
// Solution 1: Use relevance threshold
const results = await memory.query('pricing', {
  minRelevance: 0.7, // Only return highly relevant results
  limit: 10,
})
```

```typescript
// Solution 2: Combine filters with search
const results = await memory.query('pricing', {
  filters: {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      topic: 'pricing', // Ensure topic matches
    },
  },
  minRelevance: 0.5,
  limit: 10,
})
```

```typescript
// Solution 3: Use semantic search with good embeddings
const memory = clarityMemory({
  embeddingProvider: new OpenAIEmbeddings({
    modelName: 'text-embedding-3-large', // Better quality
  }),
})
```

```typescript
// Solution 4: Improve memory content quality
// ❌ POOR: Vague content
await memory.add('User asked something', { type: 'episodic', scope: 'thread' })

// ✅ GOOD: Specific, detailed content
await memory.add(
  'User asked about startup pricing plans, specifically interested in monthly vs annual billing',
  {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      topic: 'pricing',
      entities: ['startup', 'monthly billing', 'annual billing'],
      intent: 'compare_plans',
    },
  }
)
```

**Prevention:**

- Store detailed, specific memory content
- Use rich metadata for filtering
- Configure quality embedding provider
- Use relevance thresholds

---

## Integration Issues

### Issue: Tool Calls Not Being Captured

**Symptoms:**

- `getToolHistory()` returns empty
- Tool calls not appearing in memory

**Diagnostic:**

```typescript
// Check if tools are being captured
const toolHistory = await memory.getToolHistory({ limit: 20 })
console.log('Tool calls captured:', toolHistory.length)

// Check memory stats
const stats = await memory.getStats()
console.log('Total memories:', stats.totalMemories)
```

**Solutions:**

```typescript
// Solution 1: Use captureToolCall explicitly
async function myTool(input: string) {
  const toolCallId = `tool_${Date.now()}`

  try {
    // Execute tool
    const result = await executeTool(input)

    // ✅ Capture tool call
    await memory.captureToolCall('myTool', { input }, result, {
      threadId: 'thread_123',
      toolType: 'database',
    })

    return result
  } catch (error) {
    // ✅ Capture errors too
    await memory.captureToolCall(
      'myTool',
      { input },
      { error: error.message },
      { threadId: 'thread_123', status: 'error' }
    )
    throw error
  }
}
```

```typescript
// Solution 2: Use automatic tool capture with LangChain
import { MemoryToolWrapper } from '@clarity-chat/memory'

const wrappedTool = new MemoryToolWrapper(myTool, memory, {
  autoCapture: true, // Enable automatic capture
  captureInput: true,
  captureOutput: true,
})
```

```typescript
// Solution 3: Verify tool metadata
const toolHistory = await memory.getToolHistory({
  filters: {
    metadata: {
      toolName: 'myTool', // Filter by tool name
      threadId: 'thread_123',
    },
  },
})
console.log('Tool calls for myTool:', toolHistory.length)
```

**Prevention:**

- Always call `captureToolCall()` in tool functions
- Use automatic tool wrappers when available
- Include threadId in tool call metadata
- Capture both successes and errors

---

### Issue: Streaming Messages Creating Duplicates

**Symptoms:**

- Multiple memories created for single message
- Memory count growing rapidly during streaming

**Solutions:**

```typescript
// Solution 1: Use messageId for deduplication
const memory = clarityMemory({
  deduplication: {
    enabled: true,
    similarityThreshold: 0.95,
  },
})

let messageBuffer = ''
let messageId = `msg_${Date.now()}`

// During streaming
onStreamChunk((chunk) => {
  messageBuffer += chunk

  // ✅ Use same messageId for all chunks
  await memory.add(messageBuffer, {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      messageId, // Deduplication key
      role: 'assistant',
      isStreaming: true,
    },
  })
})

onStreamComplete(() => {
  // Final message with complete content
  await memory.add(messageBuffer, {
    type: 'episodic',
    scope: 'thread',
    metadata: {
      messageId, // Same ID - will update existing
      role: 'assistant',
      isStreaming: false,
    },
  })
})
```

```typescript
// Solution 2: Only store complete messages
let messageBuffer = ''

onStreamChunk((chunk) => {
  messageBuffer += chunk
  // Don't store yet
})

onStreamComplete(() => {
  // ✅ Store once when complete
  await memory.add(messageBuffer, {
    type: 'episodic',
    scope: 'thread',
    metadata: { role: 'assistant' },
  })
})
```

```typescript
// Solution 3: Use updateMemory for streaming
let memoryId: string | null = null

onStreamChunk(async (chunk) => {
  if (!memoryId) {
    // Create initial memory
    const mem = await memory.add(chunk, {
      type: 'working', // Use working memory for in-progress
      scope: 'session',
    })
    memoryId = mem.id
  } else {
    // ✅ Update existing memory
    await memory.updateMemory(memoryId, {
      content: messageBuffer + chunk,
    })
  }

  messageBuffer += chunk
})

onStreamComplete(() => {
  // Promote to episodic when complete
  await memory.updateMemory(memoryId!, {
    type: 'episodic',
    scope: 'thread',
  })
})
```

**Prevention:**

- Enable deduplication in config
- Use messageId consistently
- Store only complete messages, or update existing
- Use working memory for in-progress content

---

## Debugging Strategies

### Enable Debug Logging

```typescript
// Enable comprehensive logging
const memory = clarityMemory({
  debug: true, // Enable debug mode
})

// Or set environment variable
process.env.CLARITY_MEMORY_DEBUG = 'true'

// Or use logger
import { setLogger } from '@clarity-chat/memory'

setLogger({
  debug: (msg, data) => console.debug('[MEMORY DEBUG]', msg, data),
  info: (msg, data) => console.info('[MEMORY INFO]', msg, data),
  warn: (msg, data) => console.warn('[MEMORY WARN]', msg, data),
  error: (msg, data) => console.error('[MEMORY ERROR]', msg, data),
})
```

### Inspect Memory State

```typescript
// Get comprehensive stats
const stats = await memory.getStats()
console.log('Memory Statistics:', {
  totalMemories: stats.totalMemories,
  byType: stats.byType,
  byScope: stats.byScope,
  tokenUsage: `${stats.totalTokens} / ${stats.maxTotalTokens}`,
  cacheHitRate: stats.cacheHitRate,
})

// Export all memories for inspection
const allMemories = await memory.query('', { limit: 1000 })
console.log('All memories:', JSON.stringify(allMemories, null, 2))

// Check specific memory
const memory = await memory.getMemoryById('mem_123')
console.log('Memory details:', memory)
```

### Test in Isolation

```typescript
// Create isolated test instance
import { clarityMemory } from '@clarity-chat/memory'

describe('Memory System', () => {
  let testMemory: ReturnType<typeof clarityMemory>

  beforeEach(() => {
    // Fresh instance for each test
    testMemory = clarityMemory({
      privacy: { enabled: false }, // Disable for testing
      embeddingProvider: undefined, // Use keyword search
    })
  })

  it('should store and retrieve memories', async () => {
    await testMemory.add('test content', {
      type: 'working',
      scope: 'session',
    })

    const results = await testMemory.query('test')
    expect(results).toHaveLength(1)
    expect(results[0].content).toBe('test content')
  })
})
```

### Monitor Performance

```typescript
// Track operation timing
class MemoryPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  async measure<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      return await fn()
    } finally {
      const duration = performance.now() - start

      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, [])
      }
      this.metrics.get(operation)!.push(duration)

      if (duration > 500) {
        console.warn(`⚠️ Slow operation: ${operation} took ${duration}ms`)
      }
    }
  }

  getStats(operation: string) {
    const times = this.metrics.get(operation) || []
    return {
      count: times.length,
      avg: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      p95: times.sort()[Math.floor(times.length * 0.95)],
    }
  }
}

const monitor = new MemoryPerformanceMonitor()

// Use it
await monitor.measure('memory.query', () =>
  memory.query('search term', { limit: 10 })
)

// Check stats
console.log('Query performance:', monitor.getStats('memory.query'))
```

---

## Production Issues

### Issue: Memory System Failing in Production

**Diagnostic:**

```typescript
// Add comprehensive error handling
try {
  await memory.add(content, options)
} catch (error) {
  if (error instanceof MemoryConsentError) {
    console.error('Consent error:', error.userId, error.code)
    // Handle consent issue
  } else if (error instanceof MemoryOperationError) {
    console.error('Operation error:', error.operation, error.code)
    // Handle operation failure
  } else if (error instanceof MemoryConfigError) {
    console.error('Config error:', error.code)
    // Handle configuration issue
  } else {
    console.error('Unknown memory error:', error)
    // Handle unexpected error
  }

  // Report to error tracking
  Sentry.captureException(error, {
    tags: { component: 'memory-system' },
    contexts: { memory: { operation: 'add', options } },
  })
}
```

### Production Monitoring

```typescript
// Track key metrics
setInterval(async () => {
  try {
    const stats = await memory.getStats()

    // Send to monitoring service
    metrics.gauge('memory.total_count', stats.totalMemories)
    metrics.gauge('memory.token_usage', stats.totalTokens)
    metrics.gauge('memory.cache_hit_rate', stats.cacheHitRate)

    // Alert on anomalies
    if (stats.totalMemories > 5000) {
      alerts.warn('Memory count exceeding safe limits')
    }

    if (stats.totalTokens / stats.maxTotalTokens > 0.9) {
      alerts.warn('Token budget near limit')
    }
  } catch (error) {
    alerts.error('Memory stats collection failed', error)
  }
}, 60000) // Every minute
```

### Production Best Practices

```typescript
// 1. Use production-ready configuration
import { createProductionConfig } from '@clarity-chat/memory'

const memory = clarityMemory(
  createProductionConfig({
    enableCompression: true,
    enableCaching: true,
    errorReporting: true,
  })
)

// 2. Implement circuit breaker for external services
class CircuitBreaker {
  private failures = 0
  private lastFailure = 0
  private threshold = 5
  private timeout = 60000

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker open')
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private isOpen() {
    if (this.failures >= this.threshold) {
      if (Date.now() - this.lastFailure < this.timeout) {
        return true
      }
      this.reset()
    }
    return false
  }

  private onSuccess() {
    this.failures = 0
  }

  private onFailure() {
    this.failures++
    this.lastFailure = Date.now()
  }

  private reset() {
    this.failures = 0
  }
}

// 3. Implement graceful degradation
async function addMemoryWithFallback(content: string, options: any) {
  try {
    return await memory.add(content, options)
  } catch (error) {
    console.error('Memory add failed, using fallback', error)

    // Fallback: store in localStorage temporarily
    const fallbackKey = `memory_fallback_${Date.now()}`
    localStorage.setItem(fallbackKey, JSON.stringify({ content, options }))

    // Retry later
    retryQueue.push({ content, options })

    return { id: fallbackKey, ...options }
  }
}
```

---

## Getting Help

If you're still experiencing issues:

1. **Check the documentation:**
   - [API Reference](./API.md)
   - [Configuration Guide](./CONFIGURATION.md)
   - [Best Practices](./BEST_PRACTICES.md)

2. **Enable debug logging** and collect logs

3. **Create a minimal reproduction:**

```typescript
// Minimal example that reproduces the issue
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// Steps to reproduce...
```

4. **File an issue** with:
   - Error messages and stack traces
   - Configuration used
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (browser/Node.js, versions)

5. **Check for known issues** in the GitHub repository

---

## Common Pitfalls Summary

| Pitfall                      | Solution                                                 |
| ---------------------------- | -------------------------------------------------------- |
| Forgetting to grant consent  | Always check/grant consent before user-scoped operations |
| Exceeding size limits        | Configure appropriate limits or summarize content        |
| No embedding provider        | Configure provider or disable semantic search            |
| Invalid token config         | Use configuration presets                                |
| Memory leaks                 | Set maxMemoryCount and use working memory appropriately  |
| Duplicate streaming messages | Use messageId and deduplication                          |
| Query returns nothing        | Verify metadata structure and use consistent casing      |
| Slow queries                 | Use filters, limits, and caching                         |
| GDPR deletion incomplete     | Use deleteUserData() with all scopes                     |
| Production errors            | Implement error handling, monitoring, and fallbacks      |

---

**Need more help?** Join our community Discord or file an issue on GitHub.
