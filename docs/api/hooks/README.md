# Hooks API Reference

Complete reference for all 95+ React hooks in Clarity Chat.

---

## 🎯 Quick Navigation

**New to hooks?** Start with [Choosing the Right Hook](../../guides/choosing-hooks.md)

### Core Hooks (Start Here)
- **[useClarityChat](./chat.md#useclaritychat)** ⭐ - Main chat hook (use this for 90% of cases)
- **[useClarityChatWithTools](./chat.md#useclaritychatwithtools)** - Chat with function calling
- **[useClarityObject](./chat.md#useclarityobject)** - Structured JSON output

### By Category

| Category | Count | Description | Link |
|----------|-------|-------------|------|
| **Chat & Conversation** | 14 | Core chat functionality | [→ Chat Hooks](./chat.md) |
| **Token Optimization** | 15 | Cost optimization & caching | [→ Token Hooks](./token.md) |
| **Streaming** | 8 | Real-time streaming | [→ Streaming Hooks](./streaming.md) |
| **Error Handling** | 6 | Resilience & retry | [→ Error Hooks](./error.md) |
| **Memory & Storage** | 8 | Conversation memory | [→ Memory Hooks](./memory.md) |
| **Search** | 5 | Message search | [→ Search Hooks](./search.md) |
| **UI & Interaction** | 15 | UI utilities | [→ UI Hooks](./ui.md) |
| **Keyboard & Navigation** | 6 | Shortcuts & navigation | [→ Keyboard Hooks](./keyboard.md) |
| **Performance** | 7 | Optimization | [→ Performance Hooks](./performance.md) |
| **Input** | 5 | Input handling | [→ Input Hooks](./input.md) |
| **Analytics** | 3 | Tracking & metrics | [→ Analytics Hooks](./analytics.md) |
| **Agent & Tools** | 3 | Agent orchestration | [→ Agent Hooks](./agent.md) |

**Total: 95 hooks documented**

---

## 📖 How to Use This Reference

### Finding the Right Hook

1. **Start with the decision guide**: [Choosing the Right Hook](../../guides/choosing-hooks.md)
2. **Browse by category**: Use the table above
3. **Search**: Use Ctrl+F to find specific functionality
4. **Check examples**: Each hook has working examples

### Hook Documentation Format

Each hook page includes:
- **Purpose** - What it does and when to use it
- **API Signature** - TypeScript types and parameters
- **Parameters** - All options with descriptions
- **Return Value** - What the hook returns
- **Examples** - 2-3 working examples
- **Related Hooks** - Similar or complementary hooks
- **Common Pitfalls** - Things to watch out for
- **Performance Notes** - Optimization tips

---

## 🚀 Most Popular Hooks

### 1. useClarityChat
The main hook for building chat interfaces. Handles streaming, memory, token optimization, and error handling automatically.

```tsx
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})
```

[Full documentation →](./chat.md#useclaritychat)

---

### 2. useTokenBudget
Track and limit token usage to control costs.

```tsx
const budget = useTokenBudget({
  sessionBudgetTokens: 100000,
  onWarning: () => alert('80% budget used'),
})
```

[Full documentation →](./token.md#usetokenbudget)

---

### 3. useSemanticCache
Cache AI responses using vector similarity for 40-60% hit rates.

```tsx
const cache = useSemanticCache({
  similarityThreshold: 0.85,
  ttlMs: 3600000,
})
```

[Full documentation →](./token.md#usesemantic cache)

---

### 4. useStreamingSSE
Low-level Server-Sent Events streaming with automatic reconnection.

```tsx
const stream = useStreamingSSE({
  url: '/api/stream',
  reconnect: true,
})
```

[Full documentation →](./streaming.md#usestreamingsse)

---

### 5. useKeyboardShortcuts
Add keyboard shortcuts to your chat interface.

```tsx
useKeyboardShortcuts({
  'Ctrl+K': openCommandPalette,
  'Ctrl+Enter': sendMessage,
})
```

[Full documentation →](./keyboard.md#usekeyboardshortcuts)

---

## 🔍 Search by Use Case

### "I want to..."

| Use Case | Hook(s) | Link |
|----------|---------|------|
| Build a chat | `useClarityChat` | [→](./chat.md#useclaritychat) |
| Save costs | `useSemanticCache`, `usePromptCompressor` | [→](./token.md) |
| Handle streaming | `useStreaming`, `useStreamingSSE` | [→](./streaming.md) |
| Add memory | `useMemory`, `useChatHistory` | [→](./memory.md) |
| Handle errors | `useCircuitBreaker`, `useRetryWithBackoff` | [→](./error.md) |
| Search messages | `useMessageSearch`, `useSemanticSearch` | [→](./search.md) |
| Add shortcuts | `useKeyboardShortcuts` | [→](./keyboard.md) |
| Track tokens | `useTokenCounter`, `useCostTracker` | [→](./token.md) |
| Upload files | `useFileUpload` | [→](./input.md) |
| Voice input | `useVoiceInput` | [→](./input.md) |
| Improve performance | `useSmartCache`, `useBatteryAware` | [→](./performance.md) |
| Call functions/tools | `useClarityChatWithTools` | [→](./chat.md#useclaritychatwithtools) |
| Generate JSON | `useClarityObject` | [→](./chat.md#useclarityobject) |
| Build RAG pipeline | `useRAGPipeline` | [→](./chat.md#useragpipeline) |
| Copy to clipboard | `useClipboard` | [→](./ui.md#useclipboard) |

---

## 📚 Hook Categories Explained

### Chat & Conversation Hooks
Core hooks for building chat interfaces. These handle message state, API calls, streaming, and conversation management.

**Start here:** Almost every project needs `useClarityChat`

[Browse Chat Hooks →](./chat.md)

---

### Token Optimization Hooks
Hooks for reducing AI costs through caching, compression, and intelligent routing.

**Impact:** Can reduce costs by 50-70%

[Browse Token Hooks →](./token.md)

---

### Streaming Hooks
Low-level hooks for managing real-time streaming responses.

**Note:** `useClarityChat` includes streaming automatically - only use these for custom implementations

[Browse Streaming Hooks →](./streaming.md)

---

### Error Handling Hooks
Hooks for resilient error handling with retries, circuit breakers, and graceful degradation.

**Note:** `useClarityChat` includes error handling automatically

[Browse Error Hooks →](./error.md)

---

### Memory Hooks
Hooks for managing conversation memory and history.

**Use when:** You need persistent conversations or context across sessions

[Browse Memory Hooks →](./memory.md)

---

### UI & Interaction Hooks
Utility hooks for common UI patterns like auto-scroll, clipboard, themes.

[Browse UI Hooks →](./ui.md)

---

### Performance Hooks
Hooks for optimizing performance and monitoring metrics.

[Browse Performance Hooks →](./performance.md)

---

## 🆕 Recently Added Hooks

- `useAdaptiveModel` - Smart model routing based on query complexity
- `useBatteryAware` - Adjust features based on battery level
- `useCommandPalette` - Command palette UI
- `useContextMonitor` - Monitor context window usage
- `useDeferredSearch` - Debounced search with defer
- `useSmartThrottle` - Adaptive throttling

[See changelog for more →](../../changelog.md)

---

## ⚠️ Deprecated Hooks

These hooks are deprecated and will be removed in a future version:

| Hook | Replacement | Migration Guide |
|------|-------------|-----------------|
| `useChat` (old) | `useClarityChat` | [→](../../migration.md#usechat) |
| `useCompletion` | `useClarityChat` with mode | [→](../../migration.md#usecompletion) |

---

## 💡 Pro Tips

### 1. Start Simple
Most projects only need `useClarityChat`. Don't over-engineer with too many hooks.

```tsx
// ✅ Good - simple and works
const chat = useClarityChat({ api: '/api/chat' })

// ❌ Over-engineered - unnecessary complexity
const chat = useClarityChat({ ... })
const cache = useSemanticCache({ ... })
const budget = useTokenBudget({ ... })
const compressor = usePromptCompressor({ ... })
// ... (useClarityChat already does all this!)
```

### 2. Enable Token Optimization
One line can save 50-70% on costs:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart', // ← Add this!
})
```

### 3. Use Composition
Hooks are composable - combine them as needed:

```tsx
const chat = useClarityChat({ api: '/api/chat' })
const shortcuts = useKeyboardShortcuts({
  'Ctrl+Enter': () => chat.append({ role: 'user', content: input })
})
```

### 4. Check Return Types
All hooks are fully typed. Use TypeScript to explore what they return:

```tsx
const chat = useClarityChat({ api: '/api/chat' })
//    ^? hover to see: UseClarityChatReturn
```

### 5. Read the Source
Hooks are well-documented in code. Check the source for details:

```bash
packages/react/src/hooks/
```

---

## 🤝 Contributing

Found a bug or want to add a hook?

- [Report issues](https://github.com/clarity-chat/clarity/issues)
- [Request features](https://github.com/clarity-chat/clarity/discussions)
- [Contribute](../../CONTRIBUTING.md)

---

## 📞 Need Help?

- **Quick question?** Check [Choosing the Right Hook](../../guides/choosing-hooks.md)
- **Stuck?** See [Troubleshooting](../../troubleshooting.md)
- **Chat?** [Join Discord](https://discord.gg/clarity-chat)

---

**Next:** Browse hooks by category or use the decision guide to find the perfect hook for your use case.
