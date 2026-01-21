# Memory & Context Management Hooks

Hooks for managing conversation memory, context windows, and long-term information retention.

---

## Overview

These hooks provide intelligent memory and context window management for AI applications. **Essential for multi-turn conversations.**

| Hook | Purpose | Use Case |
|------|---------|----------|
| [`useMemoryStore`](#usememorystore) | Conversation memory management | Long-term context |
| [`useContextMonitor`](#usecontextmonitor) | Context window monitoring ⭐ | Optimization |
| [`useChatHistory`](#usechathistory) | Message history management | Covered in [Chat Hooks](./chat.md) |

**Quick Start: Enable memory**
```tsx
const memory = useMemoryStore({ enabled: true })

const chat = useClarityChat({
  api: '/api/chat',
  memory: memory.config, // Automatic memory integration!
})
```

---

## useMemoryStore

**Conversation memory management with multiple strategies.** Enables long-term context retention across sessions.

### Signature

```typescript
function useMemoryStore(
  options?: UseMemoryStoreOptions
): UseMemoryStoreReturn

interface UseMemoryStoreOptions {
  /** Enable memory (default: false) */
  enabled?: boolean
  /** Memory strategy */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
  /** Memory scope: 'session' | 'user' | 'global' */
  scope?: MemoryScope
}

interface UseMemoryStoreReturn {
  /** Whether memory is enabled */
  enabled: boolean
  /** Memory service instance */
  service: MemoryContextValue | null
  /** Configuration for useClarityChat */
  config: {
    enabled: boolean
    strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
    maxTokens?: number
  }
  /** Add a memory */
  addMemory: (
    content: string,
    type?: MemoryType,
    metadata?: Record<string, any>
  ) => Promise<void>
  /** Query memories */
  query: (query: string) => Promise<any[]>
  /** Clear memories */
  clear: () => Promise<void>
}
```

### Examples

#### Basic Memory Integration

```typescript
import { useMemoryStore } from '@clarity-chat/react/hooks'
import { useClarityChat } from '@clarity-chat/react'

function MemoryEnabledChat() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'sliding-window', // Keep recent messages
    maxTokens: 4000, // Reserve 4K tokens for memory
  })

  const chat = useClarityChat({
    api: '/api/chat',
    memory: memory.config, // Pass memory config
  })

  return (
    <div>
      <ChatWindow
        messages={chat.messages}
        onSendMessage={(content) => chat.append({ role: 'user', content })}
        isLoading={chat.isLoading}
      />
      {memory.enabled && (
        <div className="memory-indicator">
          💾 Memory enabled
        </div>
      )}
    </div>
  )
}
```

#### Semantic Chunks Strategy

```typescript
function SemanticMemoryChat() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'semantic-chunks', // Intelligent chunking
    maxTokens: 8000,
  })

  const chat = useClarityChat({
    api: '/api/chat',
    memory: memory.config,
  })

  // Semantic chunks automatically group related messages
  // and include relevant context for each query
  return <ChatInterface chat={chat} />
}
```

#### Vector Store Strategy

```typescript
function VectorStoreMemory() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'vector-store', // RAG-style retrieval
    maxTokens: 6000,
    scope: 'user', // Per-user memory
  })

  const chat = useClarityChat({
    api: '/api/chat',
    memory: memory.config,
  })

  // Vector store retrieves semantically similar past conversations
  // Perfect for customer support or documentation assistants
  return (
    <div>
      <ChatInterface chat={chat} />
      <button onClick={() => memory.clear()}>
        Clear Memory
      </button>
    </div>
  )
}
```

#### Manual Memory Management

```typescript
function ManualMemory() {
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'vector-store',
  })

  const handleSaveImportantInfo = async (info: string) => {
    // Manually add important information to memory
    await memory.addMemory(info, 'episodic', {
      importance: 'high',
      category: 'user-preference',
    })
    
    toast.success('Saved to memory')
  }

  const handleSearch = async (query: string) => {
    // Search through memory
    const results = await memory.query(query)
    console.log('Found memories:', results)
    return results
  }

  return (
    <div>
      <ChatInterface onSave={handleSaveImportantInfo} />
      <MemorySearch onSearch={handleSearch} />
    </div>
  )
}
```

### When to Use

✅ **Use `useMemoryStore` for:**
- Multi-turn conversations
- Customer support chatbots
- Personal assistants
- Long-running sessions
- Cross-session context

❌ **Don't use for:**
- Single-turn Q&A
- Stateless operations
- When context window is sufficient

### Memory Strategies

| Strategy | How It Works | Best For | Token Usage |
|----------|--------------|----------|-------------|
| `sliding-window` | Keep N recent messages | Short conversations | Low |
| `semantic-chunks` | Group related messages | Medium conversations | Medium |
| `vector-store` | RAG-style retrieval | Long-term memory | Dynamic |

```typescript
// Sliding Window (simplest)
// - Keeps last N messages
// - FIFO: oldest messages drop off
// - Good for: chat, debugging
const memory = useMemoryStore({ strategy: 'sliding-window' })

// Semantic Chunks (intelligent)
// - Groups related messages
// - Summarizes old chunks
// - Good for: support, documentation
const memory = useMemoryStore({ strategy: 'semantic-chunks' })

// Vector Store (advanced)
// - Stores in vector DB
// - Retrieves similar past conversations
// - Good for: RAG, long-term memory
const memory = useMemoryStore({ strategy: 'vector-store' })
```

---

## useContextMonitor

**Real-time context window monitoring with efficiency metrics and optimization recommendations.** Essential for managing context limits.

### Signature

```typescript
function useContextMonitor(
  options?: UseContextMonitorOptions
): UseContextMonitorReturn

interface UseContextMonitorOptions {
  /** Max context window tokens (default: 128000) */
  maxTokens?: number
  /** Tokens reserved for response (default: 4096) */
  reservedTokens?: number
  /** Warning threshold 0-1 (default: 0.8 = 80%) */
  warningThreshold?: number
  /** Critical threshold 0-1 (default: 0.95 = 95%) */
  criticalThreshold?: number
  /** Track utilization history (default: false) */
  trackHistory?: boolean
  /** Max history entries (default: 100) */
  maxHistoryEntries?: number
  /** Model name for accurate token estimation */
  model?: string
  /** Staleness threshold in minutes (default: 60) */
  stalenessThresholdMinutes?: number
}

interface UseContextMonitorReturn {
  /** Current context utilization */
  utilization: ContextUtilization | null
  /** Active warnings */
  warnings: ContextWarning[]
  /** Optimization recommendations */
  recommendations: OptimizationRecommendation[]
  /** Utilization history */
  history: ContextUtilization[]
  /** Analyze messages */
  analyzeMessages: (messages: ContextMessage[]) => ContextUtilization
  /** Get utilization without updating state */
  getUtilization: (messages: ContextMessage[]) => ContextUtilization
  /** Clear history */
  clearHistory: () => void
  /** At warning level? */
  isWarning: boolean
  /** At critical level? */
  isCritical: boolean
}

interface ContextUtilization {
  /** Total tokens used */
  totalTokens: number
  /** Max tokens available */
  maxTokens: number
  /** Utilization percentage 0-100 */
  utilizationPercent: number
  /** Token breakdown by category */
  breakdown: {
    systemPrompt: number
    conversationHistory: number
    retrievedContext: number
    userMessage: number
    reserved: number
  }
  /** Efficiency metrics */
  efficiency: {
    informationDensity: number  // 0-1
    recencyScore: number         // 0-1
    relevanceScore: number       // 0-1
  }
  timestamp: number
}
```

### Examples

#### Context Utilization Display

```typescript
import { useContextMonitor } from '@clarity-chat/react/hooks'

function ContextAwareChat() {
  const {
    utilization,
    warnings,
    recommendations,
    analyzeMessages,
    isWarning,
    isCritical,
  } = useContextMonitor({
    maxTokens: 128000, // Claude 3.5 context window
    reservedTokens: 4096, // Reserve for response
    warningThreshold: 0.8, // Warn at 80%
    criticalThreshold: 0.95, // Critical at 95%
  })

  const chat = useClarityChat({ api: '/api/chat' })

  // Analyze context on message changes
  useEffect(() => {
    if (chat.messages.length > 0) {
      analyzeMessages(chat.messages)
    }
  }, [chat.messages, analyzeMessages])

  return (
    <div>
      {/* Context utilization bar */}
      {utilization && (
        <div className="context-bar">
          <ProgressBar
            value={utilization.utilizationPercent}
            color={
              isCritical ? 'red' :
              isWarning ? 'yellow' :
              'green'
            }
          />
          <span>
            {utilization.totalTokens.toLocaleString()} / {utilization.maxTokens.toLocaleString()} tokens
            ({utilization.utilizationPercent.toFixed(1)}%)
          </span>
        </div>
      )}

      {/* Warnings */}
      {warnings.map((warning, i) => (
        <Alert key={i} severity={warning.level}>
          <strong>{warning.message}</strong>
          <div>{warning.recommendation}</div>
        </Alert>
      ))}

      <ChatWindow chat={chat} />
    </div>
  )
}
```

#### Token Breakdown Visualization

```typescript
function TokenBreakdownChart() {
  const monitor = useContextMonitor({
    maxTokens: 128000,
    trackHistory: true,
  })

  const chat = useClarityChat({ api: '/api/chat' })

  useEffect(() => {
    monitor.analyzeMessages(chat.messages)
  }, [chat.messages])

  if (!monitor.utilization) return null

  const { breakdown } = monitor.utilization

  return (
    <div className="token-breakdown">
      <h3>Context Window Usage</h3>
      
      <div className="breakdown-chart">
        <BreakdownBar
          label="System Prompt"
          tokens={breakdown.systemPrompt}
          color="blue"
        />
        <BreakdownBar
          label="Conversation"
          tokens={breakdown.conversationHistory}
          color="green"
        />
        <BreakdownBar
          label="Retrieved Context (RAG)"
          tokens={breakdown.retrievedContext}
          color="purple"
        />
        <BreakdownBar
          label="Current Message"
          tokens={breakdown.userMessage}
          color="orange"
        />
        <BreakdownBar
          label="Reserved (Response)"
          tokens={breakdown.reserved}
          color="gray"
        />
      </div>

      <div className="efficiency-metrics">
        <Metric
          label="Information Density"
          value={monitor.utilization.efficiency.informationDensity}
          format="percent"
        />
        <Metric
          label="Recency Score"
          value={monitor.utilization.efficiency.recencyScore}
          format="percent"
        />
      </div>
    </div>
  )
}
```

#### Optimization Recommendations

```typescript
function SmartContextOptimization() {
  const monitor = useContextMonitor({
    maxTokens: 128000,
    warningThreshold: 0.7, // Earlier warning
  })

  const chat = useClarityChat({ api: '/api/chat' })

  useEffect(() => {
    monitor.analyzeMessages(chat.messages)
  }, [chat.messages])

  const applyRecommendation = async (action: string) => {
    switch (action) {
      case 'summarize':
        // Summarize old messages
        const summary = await summarizeMessages(
          chat.messages.slice(0, -5)
        )
        chat.setMessages([
          { role: 'system', content: `Summary: ${summary}` },
          ...chat.messages.slice(-5),
        ])
        break

      case 'compress':
        // Enable compression
        // (would integrate with usePromptCompressor)
        break

      case 'archive':
        // Archive to vector store
        await archiveOldContext(chat.messages)
        break
    }
  }

  return (
    <div>
      <ChatWindow chat={chat} />

      {/* Show recommendations */}
      {monitor.recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Optimization Suggestions</h3>
          {monitor.recommendations.map((rec) => (
            <Card key={rec.id}>
              <h4>{rec.description}</h4>
              <p>
                Save ~{rec.estimatedSavings.toLocaleString()} tokens
              </p>
              <button onClick={() => applyRecommendation(rec.action)}>
                Apply
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

#### Proactive Context Management

```typescript
function ProactiveContextManager() {
  const monitor = useContextMonitor({
    maxTokens: 128000,
    criticalThreshold: 0.90,
  })

  const chat = useClarityChat({ api: '/api/chat' })

  // Auto-compress when reaching threshold
  useEffect(() => {
    if (monitor.isCritical && chat.messages.length > 10) {
      // Automatically summarize oldest messages
      const summarizeOld = async () => {
        const oldMessages = chat.messages.slice(0, -5)
        const summary = await summarizeConversation(oldMessages)
        
        chat.setMessages([
          {
            role: 'system',
            content: `Previous conversation summary: ${summary}`,
          },
          ...chat.messages.slice(-5),
        ])

        toast.info('Automatically optimized context window')
      }

      summarizeOld()
    }
  }, [monitor.isCritical, chat.messages])

  // Prevent sending when context full
  const handleSend = (message: string) => {
    const estimatedTokens = Math.ceil(message.length / 4)
    
    if (!monitor.canSendMessage?.(estimatedTokens)) {
      toast.error('Context window full. Please start a new conversation.')
      return
    }

    chat.append({ role: 'user', content: message })
  }

  return (
    <ChatInterface
      messages={chat.messages}
      onSend={handleSend}
      utilization={monitor.utilization}
    />
  )
}
```

### When to Use

✅ **Use `useContextMonitor` for:**
- Long conversations
- Large context windows (100K+ tokens)
- RAG applications
- Cost optimization
- Production monitoring

❌ **Don't use for:**
- Very short conversations
- When context is never an issue
- Simple Q&A

### Efficiency Metrics

The hook calculates three efficiency scores:

**1. Information Density (0-1)**
- Measures useful vs filler content
- < 0.3 = Low quality (lots of filler)
- 0.3-0.7 = Normal
- \> 0.7 = High quality (dense information)

```typescript
// Low density (0.2) - lots of filler
"Um, like, I think, you know, basically what I mean is..."

// High density (0.9) - concise, informative
"Deploy function: POST /api/deploy, returns {jobId: string}"
```

**2. Recency Score (0-1)**
- How recent is the context (exponential decay)
- Uses 30-minute half-life by default
- < 0.3 = Stale (> 2 hours old)
- \> 0.7 = Fresh (< 30 minutes)

**3. Relevance Score (0-1)**
- Semantic relevance to current query
- Currently placeholder (0.7)
- Would need embeddings for real implementation

---

## Common Patterns

### Memory + Context Monitoring

```typescript
function OptimizedMemoryChat() {
  // Enable memory for long-term context
  const memory = useMemoryStore({
    enabled: true,
    strategy: 'vector-store',
    maxTokens: 8000,
  })

  // Monitor context window
  const monitor = useContextMonitor({
    maxTokens: 128000,
    warningThreshold: 0.75,
  })

  const chat = useClarityChat({
    api: '/api/chat',
    memory: memory.config,
  })

  // Analyze context on changes
  useEffect(() => {
    if (chat.messages.length > 0) {
      monitor.analyzeMessages(chat.messages)
    }
  }, [chat.messages])

  // Auto-optimize when context gets full
  useEffect(() => {
    if (monitor.isCritical) {
      // Archive old context to memory
      const oldMessages = chat.messages.slice(0, -5)
      oldMessages.forEach((msg) => {
        memory.addMemory(msg.content, 'episodic')
      })

      // Clear old messages from active context
      chat.setMessages(chat.messages.slice(-5))

      toast.info('Archived old context to memory')
    }
  }, [monitor.isCritical])

  return (
    <div>
      {/* Context status */}
      <ContextBar
        utilization={monitor.utilization?.utilizationPercent ?? 0}
        isWarning={monitor.isWarning}
        isCritical={monitor.isCritical}
      />

      {/* Chat interface */}
      <ChatWindow chat={chat} />

      {/* Warnings */}
      {monitor.warnings.map((w) => (
        <Alert key={w.timestamp} severity={w.level}>
          {w.message}
        </Alert>
      ))}
    </div>
  )
}
```

### Progressive Context Management

```typescript
function ProgressiveContextManager() {
  const memory = useMemoryStore({ enabled: true })
  const monitor = useContextMonitor({ maxTokens: 128000 })
  const chat = useClarityChat({ api: '/api/chat', memory: memory.config })

  useEffect(() => {
    monitor.analyzeMessages(chat.messages)

    const percent = monitor.utilization?.utilizationPercent ?? 0

    // Stage 1: 60% - Start warning
    if (percent > 60) {
      console.log('Context getting full, consider optimization')
    }

    // Stage 2: 75% - Compress low-density content
    if (percent > 75) {
      const lowDensity = monitor.utilization?.efficiency.informationDensity ?? 1
      if (lowDensity < 0.5) {
        // Would integrate with usePromptCompressor
        console.log('Enabling compression due to low density')
      }
    }

    // Stage 3: 85% - Summarize old messages
    if (percent > 85 && chat.messages.length > 10) {
      console.log('Summarizing old messages')
      // Auto-summarize
    }

    // Stage 4: 95% - Archive to vector store
    if (percent > 95) {
      console.log('Critical: Archiving to vector store')
      // Archive oldest content
    }
  }, [monitor.utilization])

  return <ChatInterface chat={chat} monitor={monitor} />
}
```

---

## Troubleshooting

**Memory not persisting?**
- Check `scope` setting ('session' vs 'user' vs 'global')
- Verify memory provider is configured
- Check browser storage permissions

**Context monitor showing inaccurate counts?**
- Specify `model` parameter for accurate tokenization
- Use pre-computed `tokens` in messages when available
- Check that message format matches `ContextMessage` interface

**Utilization always at 100%?**
- Verify `maxTokens` matches your model's context window
- Check `reservedTokens` isn't too high
- Ensure messages array is correct

**Low information density warnings?**
- Enable prompt compression (when available)
- Remove system prompt filler
- Summarize verbose messages

**Memory strategy not working?**
- `sliding-window`: Simplest, always works
- `semantic-chunks`: Requires message grouping logic
- `vector-store`: Requires vector DB setup

[See full troubleshooting guide →](../../troubleshooting.md)

---

## Related Hooks

- [Chat Hooks →](./chat.md) - Chat with memory integration
- [Token Hooks →](./token.md) - Token optimization
- [Error Hooks →](./error.md) - Error handling

---

## Best Practices

### 1. Enable Memory for Multi-Turn Conversations

```typescript
// Good: Memory for assistant
const memory = useMemoryStore({
  enabled: true,
  strategy: 'vector-store',
})

// Bad: No memory for multi-turn chat
const chat = useClarityChat({ api: '/api/chat' })
```

### 2. Monitor Context in Production

```typescript
// Good: Proactive monitoring
const monitor = useContextMonitor({
  maxTokens: 128000,
  warningThreshold: 0.75, // Early warning
  trackHistory: true, // For analytics
})

// Bad: No monitoring until it breaks
const chat = useClarityChat({ api: '/api/chat' })
```

### 3. Choose Appropriate Strategy

```typescript
// Short conversations (<10 messages)
useMemoryStore({ strategy: 'sliding-window' })

// Medium conversations (10-50 messages)
useMemoryStore({ strategy: 'semantic-chunks' })

// Long-term memory (>50 messages, cross-session)
useMemoryStore({ strategy: 'vector-store' })
```

### 4. Auto-Optimize Context

```typescript
// Good: Automatic optimization
useEffect(() => {
  if (monitor.isCritical) {
    autoSummarizeOldMessages()
  }
}, [monitor.isCritical])

// Bad: Manual intervention required
if (contextFull) {
  alert('Please clear context')
}
```

---

**Next:** [Search Hooks →](./search.md)
