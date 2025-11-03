# Clarity Chat - Quick Reference

**For AI Agents**: Ultra-fast lookup guide for common queries

---

## 🚀 Instant Answers

### Q: How do I build a basic chat?
```typescript
import { ChatWindow, ThemeProvider, useChat } from '@clarity-chat/react'

const { messages, sendMessage, isLoading } = useChat({
  onSendMessage: async (msg) => {
    await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(msg)
    })
  }
})

<ThemeProvider defaultTheme="ocean">
  <ChatWindow messages={messages} onSend={sendMessage} isLoading={isLoading} />
</ThemeProvider>
```

### Q: How do I add streaming?
```typescript
const { content, isStreaming, startStreaming } = useStreaming()

const handleSend = async (text) => {
  const response = await fetch('/api/stream', { /* ... */ })
  await startStreaming(response.body)
}

<StreamingMessage content={content} isStreaming={isStreaming} />
```

### Q: How do I add context/documents?
```typescript
<ContextManager
  contexts={contexts}
  onAdd={handleAdd}
  onRemove={handleRemove}
  onToggle={handleToggle}
/>
```

### Q: How do I switch models?
```typescript
<ModelSelector
  models={availableModels}
  value={selectedModel}
  onChange={setSelectedModel}
/>
```

### Q: How do I change themes?
```typescript
<ThemeProvider defaultTheme="ocean"> {/* or dark, light, glassmorphism, etc. */}
  <App />
</ThemeProvider>
```

---

## 📦 Essential Imports

### Core Chat
```typescript
import {
  ChatWindow,
  ChatInput,
  Message,
  MessageList,
  ThemeProvider
} from '@clarity-chat/react'
```

### Hooks
```typescript
import {
  useChat,
  useStreaming,
  useLocalStorage,
  useDebounce,
  useClipboard
} from '@clarity-chat/react'
```

### AI Infrastructure
```typescript
import {
  openAIAdapter,
  anthropicAdapter,
  PineconeStore,
  OpenAIEmbeddings,
  Agent,
  ReActAgent
} from '@clarity-chat/react'
```

### Primitives
```typescript
import {
  Button,
  Badge,
  Card,
  Avatar,
  Dialog
} from '@clarity-chat/primitives'
```

---

## 🎨 Theme Names

```typescript
'ocean'          // Default blue theme
'glassmorphism'  // Frosted glass effect
'dark'           // Pure dark mode
'light'          // Pure light mode
'sunset'         // Warm sunset colors
'forest'         // Forest green
'midnight'       // Deep blue
'paper'          // Paper white
'synthwave'      // Retro neon
'hacker'         // Matrix green
'monochrome'     // Black & white
```

---

## 🪝 Hook Cheat Sheet

| Need | Hook | Usage |
|------|------|-------|
| Chat state | `useChat()` | `const { messages, sendMessage } = useChat()` |
| Streaming | `useStreaming()` | `const { content, startStreaming } = useStreaming()` |
| Local storage | `useLocalStorage()` | `const [value, setValue] = useLocalStorage('key', default)` |
| Debounce | `useDebounce()` | `const debounced = useDebounce(value, 500)` |
| Copy text | `useClipboard()` | `const { copy, copied } = useClipboard()` |
| Window size | `useWindowSize()` | `const { width, height } = useWindowSize()` |
| Media query | `useMediaQuery()` | `const isMobile = useMediaQuery('(max-width: 768px)')` |
| Toggle state | `useToggle()` | `const modal = useToggle(false)` |
| Previous value | `usePrevious()` | `const prev = usePrevious(value)` |
| Error retry | `useErrorRecovery()` | `const recovery = useErrorRecovery({ operation })` |

---

## 🎯 Component Cheat Sheet

| Need | Component | Props |
|------|-----------|-------|
| Complete chat | `<ChatWindow>` | `messages`, `onSend`, `isLoading` |
| Message display | `<Message>` | `role`, `content`, `status` |
| Input field | `<ChatInput>` | `onSend`, `placeholder` |
| Rich input | `<AdvancedChatInput>` | `onSend`, `enableVoice`, `onFileUpload` |
| Streaming text | `<StreamingMessage>` | `content`, `isStreaming` |
| Model picker | `<ModelSelector>` | `models`, `value`, `onChange` |
| Context manager | `<ContextManager>` | `contexts`, `onAdd`, `onRemove` |
| File upload | `<FileUpload>` | `onFileUpload`, `accept`, `maxFiles` |
| Loading | `<ThinkingIndicator>` | `status`, `variant` |
| Copy button | `<CopyButton>` | `text` |

---

## 📊 Type Reference

### Message
```typescript
interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status: 'pending' | 'sent' | 'error' | 'streaming'
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}
```

### Context
```typescript
interface Context {
  id: string
  projectId: string
  name: string
  content: string
  type: 'file' | 'url' | 'text' | 'code'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}
```

### ModelInfo
```typescript
interface ModelInfo {
  id: string
  name: string
  provider: string
  description?: string
  contextWindow: number
  speed: 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  quality: 'basic' | 'good' | 'excellent'
}
```

---

## 🔧 Common Tasks

### Add a message
```typescript
const newMessage: Message = {
  id: generateId(),
  chatId: 'default',
  role: 'user',
  content: 'Hello',
  status: 'sent',
  createdAt: new Date(),
  updatedAt: new Date()
}
setMessages(prev => [...prev, newMessage])
```

### Update a message
```typescript
setMessages(prev => prev.map(msg =>
  msg.id === targetId 
    ? { ...msg, status: 'sent' }
    : msg
))
```

### Remove a message
```typescript
setMessages(prev => prev.filter(msg => msg.id !== targetId))
```

### Clear all messages
```typescript
setMessages([])
```

---

## ⚡ Performance Tips

### ✅ DO
```typescript
// Use virtualization for long lists
<MessageList virtualized messages={messages} />

// Memoize expensive calculations
const sortedMessages = useMemo(() => 
  messages.sort((a, b) => a.createdAt - b.createdAt),
  [messages]
)

// Debounce search
const debouncedSearch = useDebounce(searchTerm, 300)

// Use refs for non-rendering values
const wsRef = useRef<WebSocket>()
```

### ❌ DON'T
```typescript
// Don't inline object creation in JSX
<Component config={{ key: 'value' }} /> // Creates new object every render

// Don't forget dependencies
useEffect(() => {
  doSomethingWith(prop)
}, []) // Missing prop!

// Don't create functions in render
<button onClick={() => handleClick(id)}>Click</button> // New function every render
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Theme not applying | Wrap in `<ThemeProvider>` |
| Hooks error | Call hooks at top level only |
| Build fails | Run `npm run build` in primitives first |
| Types not found | Install `@clarity-chat/types` |
| Streaming not working | Check response has `.body` stream |
| Messages not updating | Use proper state setter: `setMessages(prev => ...)` |
| Memory leak | Ensure cleanup in `useEffect` |

---

## 📚 File Locations

### Components
`packages/react/src/components/[component-name].tsx`

### Hooks
`packages/react/src/hooks/use-[hook-name].ts(x)`

### Types
`packages/types/src/index.ts`

### Primitives
`packages/primitives/src/components/[component].tsx`

### Tests
`packages/react/src/**/__tests__/[file].test.ts(x)`

---

## 🎯 Best Practices Checklist

- [ ] Wrap app in `ThemeProvider`
- [ ] Use TypeScript for type safety
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Provide cleanup in useEffect
- [ ] Memoize callbacks with useCallback
- [ ] Use proper dependency arrays
- [ ] Test critical paths
- [ ] Add accessibility attributes
- [ ] Implement error boundaries

---

**Quick Reference Complete**  
**For detailed APIs**: See `AI_CONTEXT_COMPONENTS.md` and `AI_CONTEXT_HOOKS.md`  
**For architecture**: See `AI_CONTEXT_ARCHITECTURE.md`  
**For examples**: See `AI_CONTEXT_EXAMPLES.md`  

_Ultra-fast lookup guide for AI agents._

