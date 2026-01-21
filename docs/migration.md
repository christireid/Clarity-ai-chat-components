# Migration Guide

Guide for upgrading Clarity Chat and migrating from other libraries.

---

## 📦 Version Upgrades

### Upgrading Within Clarity Chat

```bash
# Check current version
npm list @clarity-chat/react

# Upgrade to latest
npm install @clarity-chat/react@latest @clarity-chat/memory@latest
```

**Breaking changes by version:** See [Changelog](./changelog.md)

---

## 🔄 Migrating from Old Hooks

### From `useChat` to `useClarityChat`

**Old (deprecated):**
```typescript
import { useChat } from '@clarity-chat/react'

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
})
```

**New (recommended):**
```typescript
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})

// Handle input in your component
const [input, setInput] = useState('')
const handleSubmit = () => append({ role: 'user', content: input })
```

**Why change?**
- More flexible (not coupled to input state)
- Better TypeScript types
- Supports all new features (memory, optimization)
- Cleaner API

---

### From `useCompletion` to `useClarityChat`

**Old:**
```typescript
const { completion, complete, isLoading } = useCompletion({
  api: '/api/completion',
})
```

**New:**
```typescript
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
  initialMessages: [],
})

// For single completions, just use the last message
const completion = messages[messages.length - 1]?.content || ''
```

---

## 🎯 Migrating from Vercel AI SDK

### Comparing APIs

| Vercel AI SDK | Clarity Chat | Notes |
|---------------|--------------|-------|
| `useChat()` | `useClarityChat()` | Similar API, more features |
| `useCompletion()` | `useClarityChat()` | Use messages for completions |
| `experimental_useObject()` | `useClarityObject()` | Structured output |
| `StreamingTextResponse` | `StreamingTextResponse` | Compatible! |
| `OpenAIStream` | `OpenAIStream` | Compatible! |

### Migration Steps

**1. Update imports**
```typescript
// Before
import { useChat } from 'ai'

// After
import { useClarityChat } from '@clarity-chat/react'
```

**2. Update hook usage**
```typescript
// Before (Vercel AI SDK)
const {
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading
} = useChat()

// After (Clarity Chat)
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})

// Handle input yourself (more flexible)
const [input, setInput] = useState('')
const handleSubmit = () => {
  append({ role: 'user', content: input })
  setInput('')
}
```

**3. API routes stay the same!**
```typescript
// Your existing API route works as-is
import { StreamingTextResponse, OpenAIStream } from '@clarity-chat/react/adapters'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  return new StreamingTextResponse(OpenAIStream(response))
}
```

**4. Add new features**
```typescript
// Enable cost savings (50-70%!)
const chat = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart', // NEW!
  memory: true, // NEW!
})
```

### Why Migrate?

**Clarity Chat adds:**
- ✅ 50-70% cost savings (token optimization)
- ✅ Built-in conversation memory
- ✅ Advanced error handling
- ✅ Token budget tracking
- ✅ 180+ pre-built components
- ✅ 95+ composable hooks
- ✅ Better TypeScript support
- ✅ WCAG 2.1 AA accessibility

**And it's backwards compatible with Vercel AI SDK API routes!**

---

## 🔧 API Compatibility

### StreamingTextResponse

Fully compatible! Use the same API:

```typescript
import { StreamingTextResponse } from '@clarity-chat/react/adapters'

// Works exactly like Vercel AI SDK
return new StreamingTextResponse(stream)
```

### OpenAIStream

Fully compatible! Use the same API:

```typescript
import { OpenAIStream } from '@clarity-chat/react/adapters'

const stream = OpenAIStream(response)
```

### Message Format

Compatible message format:

```typescript
interface Message {
  id?: string
  role: 'user' | 'assistant' | 'system'
  content: string
  // Additional Clarity Chat fields (optional):
  createdAt?: Date
  metadata?: Record<string, any>
}
```

---

## 📋 Migration Checklist

### Phase 1: Preparation
- [ ] Read this migration guide
- [ ] Review [Choosing the Right Hook](./guides/choosing-hooks.md)
- [ ] Check [Changelog](./changelog.md) for breaking changes
- [ ] Backup your code

### Phase 2: Update Dependencies
- [ ] Install Clarity Chat packages
- [ ] Update package.json
- [ ] Run `npm install`
- [ ] Verify build works

### Phase 3: Update Code
- [ ] Replace old hook imports
- [ ] Update hook usage
- [ ] Test each component
- [ ] Fix TypeScript errors

### Phase 4: Test
- [ ] Test locally
- [ ] Test streaming
- [ ] Test error handling
- [ ] Test on different browsers
- [ ] Test accessibility

### Phase 5: Deploy
- [ ] Deploy to staging
- [ ] Monitor for errors
- [ ] Deploy to production
- [ ] Monitor performance

---

## 🆘 Migration Help

**Stuck during migration?**

1. Check [Troubleshooting](./troubleshooting.md)
2. Ask in [Discord](https://discord.gg/clarity-chat)
3. Open an [issue](https://github.com/clarity-chat/clarity/issues)

**Need help with large-scale migration?**

Contact us for migration assistance: [email protected]

---

## 📚 Related Guides

- [Quick Start](./quick-start.md)
- [Choosing the Right Hook](./guides/choosing-hooks.md)
- [API Reference](./api/hooks/README.md)
- [Changelog](./changelog.md)
