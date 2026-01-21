# Memory + Tool Integration Guide

**Comprehensive guide to tool call persistence, memory integration, and context optimization**

---

## Table of Contents

1. [Overview](#overview)
2. [What Gets Stored](#what-gets-stored)
3. [Message Format in Memory](#message-format-in-memory)
4. [Memory Scopes for Tools](#memory-scopes-for-tools)
5. [Token Budgeting with Tools](#token-budgeting-with-tools)
6. [Memory Trimming Rules](#memory-trimming-rules)
7. [Tool Result Summarization](#tool-result-summarization)
8. [Integration Patterns](#integration-patterns)
9. [Lifecycle + Memory Integration](#lifecycle--memory-integration)
10. [Best Practices](#best-practices)
11. [Examples](#examples)
12. [Testing](#testing)

---

## Overview

The memory system determines **what gets persisted** from tool calls and **how tool invocations are retrieved** for context windows. Proper memory integration ensures:

- Tool calls and results are available for future reference
- Token budgets are respected when including tool history
- Important tool results are retained, trivial ones discarded
- Tool state is properly restored across conversations

**Key Principle**: Tool invocations are part of assistant messages, stored in `toolInvocations` array.

---

## What Gets Stored

### 1. Tool Call Requests

When the AI requests a tool call, we store:

```typescript
{
  role: 'assistant',
  content: '', // Often empty during tool calling
  toolInvocations: [
    {
      state: 'call',
      toolCallId: 'call_abc123',
      toolName: 'get_weather',
      args: { location: 'San Francisco' }
    }
  ]
}
```

**Memory Properties**:
- **Scope**: `thread` (belongs to conversation)
- **Type**: `episodic` (specific event)
- **Importance**: Base 0.5, +0.2 if requiresApproval=true

### 2. Tool Call Results

After execution, we store:

```typescript
{
  role: 'assistant',
  content: '', // Or AI's response using the result
  toolInvocations: [
    {
      state: 'result',
      toolCallId: 'call_abc123',
      toolName: 'get_weather',
      args: { location: 'San Francisco' },
      result: { temperature: 72, condition: 'sunny' }
    }
  ]
}
```

**Memory Properties**:
- **Scope**: `thread` (default) or `global` (if marked for promotion)
- **Type**: `episodic` (event) → may compress to `semantic` (knowledge)
- **Importance**: Base 0.5, +0.3 if result is referenced in future messages

### 3. Tool Call Errors

Failures are also stored for learning/debugging:

```typescript
{
  role: 'assistant',
  content: 'I encountered an error calling the weather tool.',
  toolInvocations: [
    {
      state: 'error',
      toolCallId: 'call_abc123',
      toolName: 'get_weather',
      args: { location: 'Invalid' },
      error: 'Location not found'
    }
  ]
}
```

**Memory Properties**:
- **Scope**: `thread`
- **Type**: `episodic`
- **Importance**: 0.3 (lower, but kept for debugging)

### 4. What's NOT Stored

To save tokens and avoid clutter:

- **Partial tool calls** (state: `partial-call`) are NOT persisted until complete
- **Cached tool results** may use a reference instead of full result
- **Intermediate tool states** (e.g., progress updates) are ephemeral

---

## Message Format in Memory

### Canonical Storage Format

Messages with tool invocations are stored as:

```typescript
interface MemoryEntry {
  id: string
  message: AssistantMessage // Contains toolInvocations
  timestamp: number
  scope: 'session' | 'thread' | 'global'
  importance: number // 0-1
  embedding?: number[] // For semantic search

  // Tool-specific metadata
  metadata?: {
    toolNames?: string[] // For quick filtering
    hasToolResults?: boolean
    toolResultSummary?: string // Compressed version
  }
}
```

### Example Entry

```typescript
const entry: MemoryEntry = {
  id: 'mem_1234567890_abc',
  message: {
    id: 'msg_1234567890_xyz',
    chatId: 'chat_001',
    role: 'assistant',
    content: 'The weather in San Francisco is sunny and 72°F.',
    status: 'sent',
    createdAt: new Date(),
    updatedAt: new Date(),
    toolInvocations: [
      {
        state: 'result',
        toolCallId: 'call_abc123',
        toolName: 'get_weather',
        args: { location: 'San Francisco' },
        result: { temperature: 72, condition: 'sunny' }
      }
    ]
  },
  timestamp: 1234567890000,
  scope: 'thread',
  importance: 0.8,
  metadata: {
    toolNames: ['get_weather'],
    hasToolResults: true,
    toolResultSummary: 'Weather data for San Francisco'
  }
}
```

---

## Memory Scopes for Tools

Different tools warrant different persistence levels:

### Session-Scoped Tools

**Use for**: Ephemeral, one-time operations

```typescript
// Example: Calculator tool
{
  scope: 'session',
  type: 'episodic',
  importance: 0.3
}
```

**Behavior**:
- Cleared when browser session ends
- Not available after page refresh
- Minimal token budget impact

### Thread-Scoped Tools (Default)

**Use for**: Conversation-specific tool calls

```typescript
// Example: Weather tool, search tool
{
  scope: 'thread',
  type: 'episodic',
  importance: 0.5-0.8
}
```

**Behavior**:
- Persists within conversation thread
- Available across page refreshes (if using IndexedDB)
- Included in context when resuming thread
- May be compressed to semantic memory

### Global-Scoped Tools

**Use for**: User preferences, reusable knowledge

```typescript
// Example: User settings tool, preference storage
{
  scope: 'global',
  type: 'semantic',
  importance: 0.9
}
```

**Behavior**:
- Persists across all threads and sessions
- Requires explicit promotion: `promoteToGlobal: true`
- Typically compressed to semantic memory
- Included in all conversations for that user

### Scope Decision Matrix

| Tool Category | Scope | Example |
|--------------|-------|---------|
| Stateless query | Session | Calculator, unit converter |
| API call | Thread | Weather, stock price |
| Database query | Thread | Search documents |
| User preference | Global | Set theme, language |
| Learning | Global | User corrections, feedback |

---

## Token Budgeting with Tools

### Token Estimation

Tool invocations consume tokens:

```typescript
function estimateToolInvocationTokens(invocation: ToolInvocation): number {
  let tokens = 0

  // Base overhead for tool structure
  tokens += 10 // role, toolCallId, state

  // Tool name + args
  tokens += invocation.toolName.length / 4
  tokens += JSON.stringify(invocation.args).length / 4

  // Result (if present)
  if (invocation.state === 'result' && invocation.result) {
    tokens += JSON.stringify(invocation.result).length / 4
  }

  // Error (if present)
  if (invocation.state === 'error' && invocation.error) {
    tokens += invocation.error.length / 4
  }

  return Math.ceil(tokens)
}
```

### Budget Allocation

Typical token budget split:

```
Total Context: 8,192 tokens
├─ System Prompt: 500 tokens (fixed)
├─ Recent Messages: 4,000 tokens (dynamic)
│  ├─ Text content: ~3,000 tokens
│  └─ Tool invocations: ~1,000 tokens
├─ Retrieved Memory: 2,000 tokens (dynamic)
│  ├─ Semantic memories: ~1,000 tokens
│  └─ Tool results: ~1,000 tokens
└─ Reserved for Response: 1,692 tokens
```

### Budget-Aware Retrieval

```typescript
function retrieveContextWithTools(
  state: MemoryEngineState,
  query?: string,
  maxTokens: number = 2000
): MemoryContext {
  const entries = state.entries
  const selected: MemoryEntry[] = []
  let currentTokens = 0

  // Prioritize recent messages with tool results
  const sortedEntries = entries
    .sort((a, b) => {
      // Higher importance for messages with tool results
      const aScore = a.importance + (a.metadata?.hasToolResults ? 0.2 : 0)
      const bScore = b.importance + (b.metadata?.hasToolResults ? 0.2 : 0)
      return bScore - aScore
    })

  for (const entry of sortedEntries) {
    const entryTokens = estimateMessageTokens(entry.message)

    if (currentTokens + entryTokens > maxTokens) {
      break // Budget exceeded
    }

    selected.push(entry)
    currentTokens += entryTokens
  }

  return {
    messages: selected.map(e => e.message),
    totalTokens: currentTokens,
    truncated: selected.length < entries.length
  }
}
```

---

## Memory Trimming Rules

### When to Trim

Trimming occurs when:

1. **Token budget exceeded**: Context window approaching limit
2. **Entry count limit**: More than `maxEntries` in memory
3. **Storage quota**: IndexedDB approaching capacity
4. **User request**: Explicit memory clear

### What to Trim (Priority Order)

From lowest to highest retention priority:

1. **Session-scoped entries** (lowest retention)
2. **Failed tool calls** (state: `error`)
3. **Old session memories** (> 1 hour old)
4. **Cached tool results** (can be regenerated)
5. **Thread-scoped episodic memories** (> 1 day old, low importance)
6. **Recent thread memories** (< 1 day old)
7. **Semantic memories** (compressed knowledge)
8. **Global memories** (highest retention)

### Trimming Algorithm

```typescript
function trimMemory(
  entries: MemoryEntry[],
  targetTokens: number
): MemoryEntry[] {
  let currentTokens = entries.reduce(
    (sum, e) => sum + estimateMessageTokens(e.message),
    0
  )

  if (currentTokens <= targetTokens) {
    return entries // No trimming needed
  }

  // Sort by retention priority (inverse of trim priority)
  const sorted = entries.sort((a, b) => {
    const aRetention = calculateRetentionScore(a)
    const bRetention = calculateRetentionScore(b)
    return bRetention - aRetention
  })

  // Keep trimming until we hit target
  const kept: MemoryEntry[] = []
  let keptTokens = 0

  for (const entry of sorted) {
    const entryTokens = estimateMessageTokens(entry.message)
    if (keptTokens + entryTokens > targetTokens) {
      break
    }
    kept.push(entry)
    keptTokens += entryTokens
  }

  return kept
}

function calculateRetentionScore(entry: MemoryEntry): number {
  let score = entry.importance // Base: 0-1

  // Scope bonus
  if (entry.scope === 'global') score += 1.0
  if (entry.scope === 'thread') score += 0.5
  if (entry.scope === 'session') score += 0.0

  // Recency bonus (0-0.5)
  const ageMs = Date.now() - entry.timestamp
  const ageHours = ageMs / (1000 * 60 * 60)
  const recencyScore = Math.max(0, 0.5 - ageHours / 48) // Decay over 48 hours
  score += recencyScore

  // Tool result bonus
  if (entry.metadata?.hasToolResults) {
    score += 0.3
  }

  // Error penalty
  const hasError = entry.message.toolInvocations?.some(
    inv => inv.state === 'error'
  )
  if (hasError) {
    score -= 0.2
  }

  return score
}
```

---

## Tool Result Summarization

Large tool results consume excessive tokens. Summarize them:

### When to Summarize

- Tool result > 500 tokens
- Result contains structured data (arrays, nested objects)
- Result is unlikely to be referenced verbatim

### Summarization Strategies

#### 1. Metadata Extraction

Extract key fields:

```typescript
// Before (250 tokens)
{
  result: {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com', ... },
      { id: 2, name: 'Bob', email: 'bob@example.com', ... },
      // ... 20 more users
    ],
    total: 22,
    page: 1
  }
}

// After (20 tokens)
{
  result: {
    summary: 'Found 22 users (page 1)',
    sampleNames: ['Alice', 'Bob']
  },
  fullResultAvailable: true // Can retrieve if needed
}
```

#### 2. Statistical Summarization

For numerical data:

```typescript
// Before (500 tokens)
{
  result: {
    stockPrices: [150.2, 151.0, 149.5, ... /* 100 values */]
  }
}

// After (30 tokens)
{
  result: {
    summary: 'Stock prices: min=145.2, max=155.8, avg=150.3, count=100'
  }
}
```

#### 3. Temporal Compression

For time-series data:

```typescript
// Before
{
  result: {
    events: [
      { timestamp: '2024-01-01T10:00:00Z', event: '...' },
      // ... 50 events
    ]
  }
}

// After
{
  result: {
    summary: '50 events from 2024-01-01 to 2024-01-05',
    keyEvents: [/* 3 most important */]
  }
}
```

### Implementation

```typescript
async function summarizeToolResult(
  toolName: string,
  result: ToolResult
): Promise<ToolResult> {
  const resultStr = JSON.stringify(result)
  const tokens = resultStr.length / 4

  if (tokens < 500) {
    return result // No summarization needed
  }

  // Strategy 1: Try metadata extraction
  if (Array.isArray(result) || (typeof result === 'object' && result !== null)) {
    return extractMetadata(result)
  }

  // Strategy 2: LLM-based summarization (optional)
  // Only if AI API is available
  if (hasAIApi) {
    return await llmSummarize(toolName, result)
  }

  // Strategy 3: Truncate with notice
  return {
    summary: `Large result (${tokens} tokens) - truncated`,
    preview: resultStr.slice(0, 500) + '...',
    fullResultAvailable: true
  }
}

function extractMetadata(result: unknown): ToolResult {
  if (Array.isArray(result)) {
    return {
      summary: `Array of ${result.length} items`,
      sample: result.slice(0, 3),
      count: result.length
    }
  }

  if (typeof result === 'object' && result !== null) {
    const keys = Object.keys(result)
    return {
      summary: `Object with ${keys.length} keys: ${keys.slice(0, 5).join(', ')}`,
      keys
    }
  }

  return result
}
```

---

## Integration Patterns

### Pattern 1: Simple Memory with Tools

```typescript
import { ToolOrchestrator } from '@clarity-chat/react/core/tool-orchestrator'
import {
  createMemoryEngine,
  addToMemory,
  retrieveContext
} from '@clarity-chat/react/app-api/memory-engine'

const orchestrator = new ToolOrchestrator({
  autoApprove: false,
  tools: [weatherTool, calculatorTool]
})

const memoryState = createMemoryEngine({
  strategy: 'hybrid',
  maxTokens: 4000,
  storage: 'indexeddb',
  scopes: ['thread']
})

async function handleUserMessage(content: string) {
  // 1. Retrieve relevant context
  const context = retrieveContext(memoryState, content, { maxTokens: 2000 })

  // 2. Send to AI with context
  const response = await aiApi.chat({
    messages: [...context.messages, { role: 'user', content }],
    tools: orchestrator.getAllTools()
  })

  // 3. Handle tool calls
  if (response.toolCalls) {
    for (const toolCall of response.toolCalls) {
      const result = await orchestrator.executeTool(
        toolCall.toolName,
        toolCall.args
      )

      // 4. Store tool result in memory
      const message: AssistantMessage = {
        role: 'assistant',
        content: '',
        toolInvocations: [{
          state: 'result',
          toolCallId: toolCall.id,
          toolName: toolCall.toolName,
          args: toolCall.args,
          result: result.result
        }]
      }

      await addToMemory(memoryState, message, {
        storage: 'indexeddb',
        scope: 'thread',
        importanceThreshold: 0.5
      })
    }
  }

  // 5. Store final AI response
  await addToMemory(memoryState, response.message, {
    storage: 'indexeddb'
  })
}
```

### Pattern 2: Memory with Tool Result Summarization

```typescript
async function handleToolCall(toolCall: ToolCall) {
  // Execute tool
  const result = await orchestrator.executeTool(
    toolCall.toolName,
    toolCall.args
  )

  // Summarize if large
  const summarizedResult = await summarizeToolResult(
    toolCall.toolName,
    result.result
  )

  // Store summarized version
  const message: AssistantMessage = {
    role: 'assistant',
    content: '',
    toolInvocations: [{
      state: 'result',
      toolCallId: toolCall.id,
      toolName: toolCall.toolName,
      args: toolCall.args,
      result: summarizedResult
    }]
  }

  await addToMemory(memoryState, message, {
    storage: 'indexeddb',
    scope: 'thread'
  })

  // Return full result to AI (not summarized)
  return result.result
}
```

### Pattern 3: Episodic → Semantic Compression

```typescript
async function compressEpisodicToSemantic(
  threadId: string
): Promise<void> {
  // Get all tool-related episodic memories
  const episodic = memoryState.entries.filter(
    e => e.scope === 'thread' &&
        e.type === 'episodic' &&
        e.metadata?.hasToolResults
  )

  if (episodic.length < 10) {
    return // Not enough to compress
  }

  // Group by tool name
  const byTool = groupBy(episodic, e => e.metadata?.toolNames?.[0])

  for (const [toolName, entries] of Object.entries(byTool)) {
    // Extract common patterns
    const knowledge = extractKnowledge(entries)

    // Create semantic memory
    const semantic: MemoryEntry = {
      id: generateId(),
      message: {
        role: 'system',
        content: knowledge
      },
      timestamp: Date.now(),
      scope: 'global', // Promote
      type: 'semantic',
      importance: 0.9,
      metadata: {
        toolNames: [toolName],
        compressedFrom: entries.map(e => e.id)
      }
    }

    // Add semantic memory
    await addToMemory(memoryState, semantic.message, {
      scope: 'global',
      promoteToGlobal: true
    })

    // Remove old episodic memories
    for (const entry of entries) {
      removeFromMemory(memoryState, entry.id)
    }
  }
}
```

---

## Lifecycle + Memory Integration

The lifecycle manager tracks tool execution state. Memory system persists it.

### Integration Points

| Lifecycle Event | Memory Action |
|----------------|---------------|
| `tool_requested` | Create episodic entry (state: `call`) |
| `tool_executing` | Update entry metadata (executionStart) |
| `tool_completed` | Update entry (state: `result`), summarize if large |
| `tool_failed` | Update entry (state: `error`), lower importance |
| `tool_timeout` | Update entry (state: `error`), mark as timeout |
| `tool_cancelled` | Remove entry or mark as cancelled |

### Implementation

```typescript
orchestrator.lifecycle.on('tool_completed', async (event) => {
  const { call, result } = event

  // Find or create memory entry
  let entry = findMemoryEntry(memoryState, call.id)

  if (!entry) {
    entry = {
      id: generateId(),
      message: {
        role: 'assistant',
        content: '',
        toolInvocations: []
      },
      timestamp: call.startedAt || Date.now(),
      scope: 'thread',
      importance: 0.5
    }
  }

  // Update with result
  const invocation: ToolInvocation = {
    state: 'result',
    toolCallId: call.id,
    toolName: call.toolName,
    args: call.args,
    result: await summarizeToolResult(call.toolName, result)
  }

  entry.message.toolInvocations = [
    ...(entry.message.toolInvocations || []),
    invocation
  ]

  // Calculate importance based on result
  entry.importance = calculateImportance(entry.message, call)

  // Store
  await addToMemory(memoryState, entry.message, {
    storage: 'indexeddb'
  })
})
```

---

## Best Practices

### 1. Store Selectively

**Don't store everything**:

```typescript
// ❌ Bad: Store every calculator call
await addToMemory(memoryState, calculatorResult, { scope: 'thread' })

// ✅ Good: Only store if referenced later
if (isReferencedInConversation(calculatorResult)) {
  await addToMemory(memoryState, calculatorResult, { scope: 'session' })
}
```

### 2. Summarize Aggressively

**Large results waste tokens**:

```typescript
// ❌ Bad: Store 10KB JSON response
result: { data: [/* 500 items */] }

// ✅ Good: Store metadata
result: {
  summary: '500 items found',
  preview: [/* first 3 */],
  fullResultId: 'cached_abc123'
}
```

### 3. Use Appropriate Scopes

**Match scope to use case**:

```typescript
// ❌ Bad: Global scope for weather query
{ scope: 'global', toolName: 'get_weather' }

// ✅ Good: Thread scope
{ scope: 'thread', toolName: 'get_weather' }

// ✅ Good: Global scope for preferences
{ scope: 'global', toolName: 'set_user_preference' }
```

### 4. Implement Retention Policies

**Set TTLs for different scopes**:

```typescript
const retentionPolicies = {
  session: 60 * 60 * 1000,        // 1 hour
  thread: 7 * 24 * 60 * 60 * 1000, // 7 days
  global: Infinity                 // Never expire
}

async function enforceRetention() {
  const now = Date.now()

  for (const entry of memoryState.entries) {
    const ttl = retentionPolicies[entry.scope]
    const age = now - entry.timestamp

    if (age > ttl) {
      await removeFromMemory(memoryState, entry.id)
    }
  }
}
```

### 5. Monitor Token Usage

**Track tool memory overhead**:

```typescript
function getToolMemoryStats() {
  const toolEntries = memoryState.entries.filter(
    e => e.metadata?.hasToolResults
  )

  const totalTokens = toolEntries.reduce(
    (sum, e) => sum + estimateMessageTokens(e.message),
    0
  )

  const percentage = (totalTokens / memoryState.maxTokens) * 100

  console.log(`Tool memory: ${totalTokens} tokens (${percentage.toFixed(1)}%)`)

  if (percentage > 50) {
    console.warn('⚠️  Tool results consuming >50% of memory budget')
  }
}
```

---

## Examples

### Example 1: Weather Tool with Memory

```typescript
const weatherTool: ToolDefinition = {
  name: 'get_weather',
  description: 'Get current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: { type: 'string' }
    },
    required: ['location']
  },
  execute: async (args) => {
    const data = await fetchWeather(args.location)

    // Return full result (memory will summarize if needed)
    return {
      temperature: data.temp,
      condition: data.condition,
      humidity: data.humidity,
      windSpeed: data.wind,
      forecast: data.forecast // Array of 7 days
    }
  },

  // Memory hooks
  hooks: {
    onAfter: async (result, args, context) => {
      // Auto-store in memory with appropriate scope
      const message: AssistantMessage = {
        role: 'assistant',
        content: '',
        toolInvocations: [{
          state: 'result',
          toolCallId: context.callId,
          toolName: 'get_weather',
          args,
          result: await summarizeToolResult('get_weather', result)
        }]
      }

      await addToMemory(memoryState, message, {
        scope: 'thread', // Thread-scoped
        importanceThreshold: 0.5
      })
    }
  }
}
```

### Example 2: User Preference Tool (Global Memory)

```typescript
const setPreferenceTool: ToolDefinition = {
  name: 'set_user_preference',
  description: 'Store a user preference',
  parameters: {
    type: 'object',
    properties: {
      key: { type: 'string' },
      value: { type: 'string' }
    },
    required: ['key', 'value']
  },
  execute: async (args) => {
    // Store in database
    await db.preferences.set(args.key, args.value)
    return { success: true }
  },

  hooks: {
    onAfter: async (result, args, context) => {
      // Store in GLOBAL memory
      const message: AssistantMessage = {
        role: 'assistant',
        content: `User preference set: ${args.key} = ${args.value}`,
        toolInvocations: [{
          state: 'result',
          toolCallId: context.callId,
          toolName: 'set_user_preference',
          args,
          result
        }]
      }

      await addToMemory(memoryState, message, {
        scope: 'global', // Global scope!
        promoteToGlobal: true,
        importanceThreshold: 0.9
      })
    }
  }
}
```

---

## Testing

### Test 1: Tool Results Stored in Memory

```typescript
it('should store tool results in memory', async () => {
  const memory = createMemoryEngine({ strategy: 'sliding-window' })

  const result = await orchestrator.executeTool('get_weather', {
    location: 'San Francisco'
  })

  const message: AssistantMessage = {
    role: 'assistant',
    content: '',
    toolInvocations: [{
      state: 'result',
      toolCallId: result.callId,
      toolName: 'get_weather',
      args: { location: 'San Francisco' },
      result: result.result
    }]
  }

  await addToMemory(memory, message, { storage: 'memory' })

  expect(memory.entries).toHaveLength(1)
  expect(memory.entries[0].metadata?.hasToolResults).toBe(true)
  expect(memory.entries[0].metadata?.toolNames).toContain('get_weather')
})
```

### Test 2: Tool Results Summarized

```typescript
it('should summarize large tool results', async () => {
  const largeResult = {
    users: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`
    }))
  }

  const summarized = await summarizeToolResult('list_users', largeResult)

  expect(summarized).toHaveProperty('summary')
  expect(summarized.summary).toContain('100')

  const tokens = JSON.stringify(summarized).length / 4
  expect(tokens).toBeLessThan(100) // Much smaller
})
```

### Test 3: Memory Trimming with Tools

```typescript
it('should trim tool results when over budget', async () => {
  const memory = createMemoryEngine({
    strategy: 'sliding-window',
    maxTokens: 500
  })

  // Add 10 tool results (each ~200 tokens)
  for (let i = 0; i < 10; i++) {
    await addToMemory(memory, createToolResultMessage(), {
      storage: 'memory'
    })
  }

  // Should trim to fit budget
  const context = retrieveContext(memory, undefined, { maxTokens: 500 })

  expect(context.totalTokens).toBeLessThanOrEqual(500)
  expect(context.truncated).toBe(true)
})
```

### Test 4: Scope-Based Retrieval

```typescript
it('should retrieve tool results by scope', async () => {
  const memory = createMemoryEngine()

  // Add session-scoped tool result
  await addToMemory(memory, {
    role: 'assistant',
    content: '',
    toolInvocations: [{ state: 'result', toolName: 'calculator' }]
  }, { scope: 'session' })

  // Add thread-scoped tool result
  await addToMemory(memory, {
    role: 'assistant',
    content: '',
    toolInvocations: [{ state: 'result', toolName: 'get_weather' }]
  }, { scope: 'thread' })

  const threadContext = retrieveContext(memory, undefined, {
    scope: ['thread']
  })

  expect(threadContext.messages).toHaveLength(1)
  expect(threadContext.messages[0].toolInvocations[0].toolName)
    .toBe('get_weather')
})
```

---

## Summary

**Memory + Tool Integration Checklist**:

- ✅ Store tool calls and results in assistant messages
- ✅ Use appropriate memory scopes (session/thread/global)
- ✅ Summarize large tool results to save tokens
- ✅ Calculate importance scores for retention
- ✅ Implement token budgeting for tool memory
- ✅ Trim low-importance tool results when over budget
- ✅ Integrate lifecycle events with memory persistence
- ✅ Use episodic → semantic compression for long-term knowledge
- ✅ Test memory storage, retrieval, and trimming

**Key Takeaways**:

1. **Tool invocations are part of messages**, stored in `toolInvocations` array
2. **Scope determines persistence**: session (ephemeral), thread (conversation), global (user-wide)
3. **Summarize aggressively**: Large tool results waste tokens
4. **Budget carefully**: Tool history can consume 25-50% of context window
5. **Trim intelligently**: Keep recent, high-importance tool results; discard old, low-importance
6. **Integrate lifecycle**: Memory persistence triggered by lifecycle events
7. **Test thoroughly**: Verify storage, retrieval, summarization, and trimming

For streaming integration with tools, see [STREAMING_TOOLS.md](./STREAMING_TOOLS.md).
