# Choosing the Right Hook - Complete Decision Guide

**Problem:** Clarity Chat has 95+ hooks. Which one should you use?

**Solution:** Use this decision tree to find the perfect hook for your use case.

---

## 🎯 Quick Decision Tree

### I want to... build a chat interface

#### ✅ Simple chat (recommended for 90% of use cases)
```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    tokenOptimization: 'smart', // ← Saves 50-70% costs automatically
  })

  return <ChatWindow messages={messages} onSend={append} isLoading={isLoading} />
}
```

**When to use:** Building any chat interface (simple or complex)
**What it does:** Complete chat management with streaming, memory, token optimization
**Alternatives:** None - this is the main hook

---

#### Advanced: Chat with tools/function calling
```tsx
import { useClarityChatWithTools } from '@clarity-chat/react'

const tools = [{
  name: 'search',
  description: 'Search the web',
  parameters: { query: { type: 'string' } },
  execute: async (params) => { /* ... */ }
}]

const { messages, append } = useClarityChatWithTools({
  api: '/api/chat',
  tools,
})
```

**When to use:** AI needs to call functions/tools
**See:** [Tools Guide](./tools.md)

---

#### Advanced: Structured output (JSON)
```tsx
import { useClarityObject } from '@clarity-chat/react'

const { object, submit, isLoading } = useClarityObject({
  api: '/api/generate',
  schema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' }
    }
  }
})
```

**When to use:** Need typed JSON output, not conversation
**See:** [Structured Output Guide](../advanced/structured-output.md)

---

### I want to... optimize token costs

#### ✅ Enable smart defaults (recommended)
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart', // ← This one line saves 50-70%
})
```

**What it enables:**
- ✅ Semantic caching (40-60% savings)
- ✅ Prompt compression (20-30% savings)
- ✅ Model routing (10-20% savings)
- ✅ Context optimization (15-25% savings)

**Modes:**
- `'smart'` - Balanced cost/quality (recommended)
- `'aggressive'` - Maximum savings
- `'conservative'` - Minimal optimization
- `'off'` - No optimization

---

#### Advanced: Manual token optimization
```tsx
import {
  useSemanticCache,
  usePromptCompressor,
  useTokenBudget,
  useCostTracker
} from '@clarity-chat/react'

// Semantic caching (40-60% cache hit rate)
const cache = useSemanticCache({
  similarityThreshold: 0.85,
  ttlMs: 3600000, // 1 hour
})

// Prompt compression (20-30% reduction)
const compressor = usePromptCompressor({
  targetRatio: 0.7, // Compress to 70% of original
  preserveQuality: true,
})

// Budget tracking
const budget = useTokenBudget({
  sessionBudgetTokens: 100000,
  onWarning: (usage) => console.warn('80% budget used'),
  onCritical: (usage) => console.error('95% budget used'),
})

// Cost tracking
const costTracker = useCostTracker({
  onCostUpdate: (total) => console.log(`Total: $${total}`),
})
```

**When to use:** Need fine-grained control over each optimization
**See:** [Token Optimization Guide](./token-optimization.md)

---

### I want to... handle streaming

#### ✅ Streaming is automatic with useClarityChat
```tsx
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
  // Streaming is automatic! No extra config needed.
})
```

**What you get automatically:**
- ✅ Token-by-token streaming
- ✅ Automatic reconnection on disconnect
- ✅ Exponential backoff retry
- ✅ Heartbeat monitoring
- ✅ Progress tracking

---

#### Advanced: Custom streaming logic
```tsx
import { useStreaming } from '@clarity-chat/react'

const { content, isStreaming, startStreaming, stopStreaming } = useStreaming({
  onChunk: (chunk) => console.log('Received:', chunk),
  onComplete: (full) => console.log('Done:', full),
  onError: (err) => console.error('Failed:', err),
})
```

**When to use:** Building custom streaming UI, non-chat streaming
**See:** [Streaming Guide](./streaming.md)

---

#### Advanced: SSE vs WebSocket
```tsx
import { useStreamingSSE } from '@clarity-chat/react'
// OR
import { useStreamingWebSocket } from '@clarity-chat/react'

// SSE (Server-Sent Events) - one-way streaming
const sseStream = useStreamingSSE({
  url: '/api/stream',
  reconnect: true,
  maxReconnectAttempts: 5,
})

// WebSocket - bidirectional streaming
const wsStream = useStreamingWebSocket({
  url: 'ws://localhost:3000',
  protocols: ['chat'],
  heartbeatInterval: 30000,
})
```

**When to use SSE:** One-way streaming (AI → client), simpler setup
**When to use WebSocket:** Two-way streaming, real-time updates
**See:** [Streaming Protocols](../advanced/streaming-protocols.md)

---

### I want to... manage conversation memory

#### ✅ Memory is automatic with useClarityChat
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: true, // ← Automatic conversation memory
})
```

**What you get:**
- ✅ Conversation history persistence
- ✅ Token-aware context windows
- ✅ Automatic old message pruning

---

#### Advanced: Custom memory configuration
```tsx
import { useMemory } from '@clarity-chat/memory'

const memory = useMemory({
  storageBackend: 'indexeddb', // or 'memory', 'file'
  enableDecay: true, // Forget old memories
  maxMemories: 1000,
  importanceScoring: 'tfidf', // Rank by importance
})

// Add memory
await memory.add({
  content: 'User prefers dark mode',
  type: 'semantic', // or 'episodic'
  importance: 0.9,
})

// Recall relevant memories
const relevant = await memory.recall('What are my preferences?', { limit: 5 })
```

**When to use:** Need fine control over memory, custom storage
**See:** [Memory Guide](./memory.md)

---

#### Decision: Which memory strategy?
```
Use 'episodic' when:
- Tracking recent conversation turns
- Short-term context (minutes to hours)
- User's immediate questions/requests

Use 'semantic' when:
- Storing facts and preferences
- Long-term context (days to months)
- User's profile and history

Use both when:
- Building sophisticated agents
- Need both recent context AND user preferences
```

**See:** [Memory Strategies](../advanced/memory-strategies.md)

---

### I want to... handle errors

#### ✅ Error handling is automatic
```tsx
const { messages, append, error, retry } = useClarityChat({
  api: '/api/chat',
  // Error handling automatic with retries!
})

return (
  <div>
    {error && (
      <ErrorMessage error={error} onRetry={retry} />
    )}
    <ChatWindow messages={messages} onSend={append} />
  </div>
)
```

**What you get automatically:**
- ✅ Automatic retry with exponential backoff
- ✅ Circuit breaker pattern
- ✅ Network error recovery
- ✅ Rate limit handling

---

#### Advanced: Custom error handling
```tsx
import {
  useCircuitBreaker,
  useRetryWithBackoff,
  useErrorRecovery,
} from '@clarity-chat/react'

// Circuit breaker (stop hammering failing service)
const circuitBreaker = useCircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 60000, // 1 minute
  onOpen: () => console.log('Circuit breaker opened'),
  onClose: () => console.log('Circuit breaker closed'),
})

// Retry with exponential backoff
const retry = useRetryWithBackoff({
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  shouldRetry: (error) => error.status !== 401, // Don't retry auth errors
})

// Error recovery strategies
const errorRecovery = useErrorRecovery({
  strategies: ['retry', 'fallback', 'graceful-degradation'],
  fallbackResponse: 'Service temporarily unavailable',
})
```

**When to use:** Custom error UX, specific retry logic, fallback strategies
**See:** [Error Handling Guide](./error-handling.md)

---

### I want to... track tokens and costs

```tsx
import {
  useTokenCounter,
  useTokenBudget,
  useCostTracker,
  useCostEstimator,
} from '@clarity-chat/react'

// Count tokens accurately
const { countTokens, streamingTokenCount } = useTokenCounter({
  model: 'gpt-4',
  enableCaching: true,
})

// Budget management
const budget = useTokenBudget({
  sessionBudgetTokens: 100000,
  warningThreshold: 0.8, // Warn at 80%
  criticalThreshold: 0.95, // Alert at 95%
})

// Cost tracking
const { totalCost, costByModel, addCost } = useCostTracker({
  currency: 'USD',
  onCostUpdate: (total) => updateBillingUI(total),
})

// Cost estimation (before sending request)
const estimator = useCostEstimator({
  model: 'gpt-4',
  inputTokenCost: 0.03 / 1000,
  outputTokenCost: 0.06 / 1000,
})

const estimate = estimator.estimate(prompt)
console.log(`This will cost ~$${estimate.toFixed(4)}`)
```

**When to use:** Budget limits, cost tracking, billing, optimization decisions
**See:** [Token Management Guide](./token-optimization.md)

---

### I want to... customize the UI

#### Use pre-built components (recommended)
```tsx
import {
  ChatWindow,
  ChatInput,
  Message,
  MessageList,
  StreamingMessage,
  TypingIndicator,
} from '@clarity-chat/react'

<ChatWindow messages={messages} onSend={append} />
```

**See:** [Components Guide](../api/components/README.md)

---

#### Build custom UI with hooks
```tsx
import {
  useAutoScroll,
  useClipboard,
  useKeyboardShortcuts,
  useToggle,
} from '@clarity-chat/react'

// Auto-scroll to latest message
const { scrollRef, scrollToBottom } = useAutoScroll({
  behavior: 'smooth',
  enabled: !userHasScrolledUp,
})

// Copy message content
const { copy, isCopied } = useClipboard()

// Keyboard shortcuts
useKeyboardShortcuts({
  'Ctrl+Enter': handleSend,
  'Escape': clearInput,
  'Ctrl+K': openCommandPalette,
})

// Toggle UI elements
const [sidebarOpen, toggleSidebar] = useToggle(false)
```

**When to use:** Custom UI, branded design, special requirements
**See:** [Custom UI Guide](../advanced/custom-ui.md)

---

### I want to... add search functionality

```tsx
import {
  useMessageSearch,
  useSemanticSearch,
  useFullTextSearch,
} from '@clarity-chat/react'

// Simple message search
const { results, search, isSearching } = useMessageSearch({
  messages,
  debounce: 300,
})

// Semantic search (meaning-based, not keyword)
const semanticSearch = useSemanticSearch({
  messages,
  threshold: 0.7,
  useEmbeddings: true,
})

// Full-text search with filters
const fullTextSearch = useFullTextSearch({
  messages,
  filters: {
    role: ['assistant'],
    dateRange: [startDate, endDate],
  },
})
```

**When to use:** Message history search, conversation browsing
**See:** [Search Guide](../advanced/search.md)

---

### I want to... handle file uploads

```tsx
import { useFileUpload } from '@clarity-chat/react'

const {
  files,
  upload,
  remove,
  isUploading,
  progress,
} = useFileUpload({
  maxSize: 10 * 1024 * 1024, // 10MB
  accept: ['image/*', 'application/pdf'],
  multiple: true,
  onUploadComplete: (files) => {
    append({
      role: 'user',
      content: 'Analyze these files',
      files,
    })
  },
})
```

**When to use:** Multi-modal chat, document processing
**See:** [File Upload Guide](../advanced/file-uploads.md)

---

### I want to... add keyboard shortcuts

```tsx
import {
  useKeyboardShortcuts,
  useCommandPalette,
  useChatKeyboardNavigation,
} from '@clarity-chat/react'

// Global shortcuts
useKeyboardShortcuts({
  'Ctrl+K': () => setCommandPaletteOpen(true),
  'Ctrl+/': () => setShortcutsHelpOpen(true),
  'Escape': () => closeAllModals(),
})

// Command palette
const commandPalette = useCommandPalette({
  commands: [
    { id: 'new', label: 'New conversation', action: startNew },
    { id: 'search', label: 'Search messages', action: openSearch },
  ],
})

// Chat-specific navigation
useChatKeyboardNavigation({
  onUp: () => navigateToPreviousMessage(),
  onDown: () => navigateToNextMessage(),
  onEnter: () => executeSelectedAction(),
})
```

**When to use:** Power user features, accessibility, efficiency
**See:** [Keyboard Navigation Guide](./accessibility.md#keyboard-navigation)

---

### I want to... improve accessibility

```tsx
import {
  useAriaLiveRegion,
  useFocusTrap,
  useReducedMotion,
} from '@clarity-chat/react'

// Announce AI responses to screen readers
useAriaLiveRegion({
  message: currentAIMessage,
  politeness: 'polite', // or 'assertive'
})

// Trap focus in modal
const modalRef = useRef<HTMLDivElement>(null)
useFocusTrap(modalRef, isModalOpen)

// Respect reduced motion preference
const prefersReducedMotion = useReducedMotion()
const animationDuration = prefersReducedMotion ? 0 : 300
```

**When to use:** WCAG compliance, inclusive design, screen reader support
**See:** [Accessibility Guide](../integration/accessibility.md)

---

## 📊 Hook Categories Reference

### Chat & Conversation (6 hooks)
- `useClarityChat` - Main chat hook ⭐ **START HERE**
- `useClarityChatWithTools` - Chat with function calling
- `useClarityObject` - Structured JSON output
- `useChatHistory` - Conversation history management
- `useConversationList` - Multiple conversations
- `useConversationBrowser` - Browse past conversations

### Token Optimization (18 hooks)
- `useSemanticCache` - Vector similarity caching (40-60% hit rate)
- `useResponseCache` - Exact match caching
- `usePromptCompressor` - Compress prompts (20-30% reduction)
- `useTokenCounter` - Count tokens accurately
- `useTokenBudget` - Budget management
- `useTokenBudgetMonitor` - Budget tracking & alerts
- `useCostTracker` - Cost tracking
- `useCostEstimator` - Cost estimation
- `useAdaptiveModel` - Smart model routing
- `useTokenThrottle` - Rate limiting
- `useTokenLimitGuard` - Prevent overruns
- `useContextWindow` - Context window management
- `useContextInjector` - Optimal context placement
- `useEmbeddingCache` - Embedding caching
- `useExactCache` - In-memory exact match
- `useStreamOptimizer` - Stream-level optimization
- `useLazyTokenCounter` - Lazy-loaded tokenizer
- `useVectorSearch` - Vector similarity search

### Streaming (8 hooks)
- `useStreaming` - Low-level streaming primitive
- `useStreamingSSE` - Server-Sent Events streaming
- `useStreamingWebSocket` - WebSocket streaming
- `useStreamingChat` - Chat-specific streaming
- `useStreamStatus` - Stream status tracking
- `useSmoothedText` - Smooth text animation
- `useStreamableUI` - Streaming React components
- `useRealisticTyping` - Human-like typing speed

### Error Handling & Resilience (6 hooks)
- `useCircuitBreaker` - Circuit breaker pattern
- `useRetryWithBackoff` - Exponential backoff retry
- `useErrorRecovery` - Error recovery strategies
- `useRequestDeduplication` - Prevent duplicate requests
- `useRateLimiter` - Rate limiting
- `useNetworkStatus` - Network status monitoring

### Memory & Storage (8 hooks)
- `useMemory` - Main memory hook
- `useMemoryStore` - Persistent memory backend
- `useMemoryContext` - Memory provider access
- `useChatHistory` - Conversation history
- `useLocalStorage` - localStorage integration
- `useIndexedDB` - IndexedDB integration
- `useHistoryManagement` - History pagination & filtering
- `useConversationPersistence` - Conversation persistence

### Search (5 hooks)
- `useMessageSearch` - Simple message search
- `useSemanticSearch` - Meaning-based search
- `useFullTextSearch` - Full-text search with filters
- `useFuzzySearch` - Fuzzy matching
- `useDeferredSearch` - Debounced search

### UI & Interaction (15 hooks)
- `useAutoScroll` - Auto-scroll to latest
- `useClipboard` - Clipboard operations
- `useToggle` - Boolean toggle state
- `useKeyboardShortcuts` - Global shortcuts
- `useCommandPalette` - Command palette
- `useChatKeyboardNavigation` - Chat navigation
- `useWindowSize` - Window dimensions
- `useMediaQuery` - Media query matching
- `useTheme` - Theme management
- `useReducedMotion` - Motion preferences
- `useFocusTrap` - Focus trapping
- `useAriaLiveRegion` - Screen reader announcements
- `useFileUpload` - File upload handling
- `useVoiceInput` - Voice transcription
- `useMobileKeyboard` - Mobile keyboard handling

### Performance (7 hooks)
- `usePerformance` - Performance monitoring
- `useDeferredValue` - Deferred updates
- `useSmartCache` - Intelligent caching
- `useBatteryAware` - Battery-aware optimization
- `useRenderOptimization` - Render optimization
- `useVirtualization` - Virtual scrolling
- `useSmartThrottle` - Adaptive throttling

### Analytics & Monitoring (5 hooks)
- `useAnalytics` - Analytics tracking
- `useUsageMetrics` - Usage metrics
- `useDashboardData` - Dashboard data aggregation
- `usePerformanceMetrics` - Performance metrics
- `useErrorTracking` - Error tracking

### Embeddings & Vector (4 hooks)
- `useEmbeddings` - Generate embeddings
- `useVectorStore` - Vector database operations
- `useSemanticSimilarity` - Similarity calculations
- `useReranking` - Result reranking

### Agent & Tools (4 hooks)
- `useAgent` - Agent orchestration
- `useToolExecution` - Tool/function execution
- `useWorkflow` - Workflow management
- `useChainOfThought` - Reasoning visualization

---

## 🤔 Still Not Sure Which Hook to Use?

### Decision Matrix

| I want to... | Use this hook | Alternative |
|-------------|---------------|-------------|
| Build a chat | `useClarityChat` | None - this is it |
| Save on costs | Enable `tokenOptimization: 'smart'` in useClarityChat | Manual optimization hooks |
| Handle streaming | Automatic in `useClarityChat` | `useStreaming` for custom |
| Add memory | Enable `memory: true` in useClarityChat | `useMemory` for custom |
| Track tokens | `useTokenCounter` | Auto in `useClarityChat` |
| Search messages | `useMessageSearch` | `useSemanticSearch` for meaning |
| Handle errors | Automatic in `useClarityChat` | `useCircuitBreaker` for custom |
| Add shortcuts | `useKeyboardShortcuts` | `useCommandPalette` for UI |
| Upload files | `useFileUpload` | Handle manually |
| Voice input | `useVoiceInput` | Use Web Speech API directly |

---

## ❓ Common Questions

### "Which hook is the easiest to get started?"
**Answer:** `useClarityChat` with default config. It handles 90% of use cases.

### "Do I need to use multiple hooks?"
**Answer:** No! `useClarityChat` includes streaming, memory, token optimization, and error handling. Only use additional hooks for advanced customization.

### "What's the difference between useClarityChat and useChat?"
**Answer:** `useChat` is deprecated. Use `useClarityChat` instead. See [Migration Guide](../migration.md).

### "How do I enable token optimization?"
**Answer:** Add `tokenOptimization: 'smart'` to your `useClarityChat` config. That's it!

### "When should I use custom hooks instead of useClarityChat?"
**Answer:** When building non-chat interfaces (CLI tools, batch processors, custom UI), or when you need precise control over each feature.

### "Can I mix hooks?"
**Answer:** Yes! Hooks are composable. But start with `useClarityChat` and only add others when needed.

---

## 📚 Next Steps

1. **Try an example:** [Examples Gallery](../examples/README.md)
2. **Read the Quick Start:** [Quick Start Guide](../quick-start.md)
3. **Browse all hooks:** [Hooks API Reference](../api/hooks/README.md)
4. **Join the community:** [Discord](https://discord.gg/clarity-chat)

---

**Still confused?** [Ask in Discord](https://discord.gg/clarity-chat) or [open a discussion](https://github.com/clarity-chat/clarity/discussions).
