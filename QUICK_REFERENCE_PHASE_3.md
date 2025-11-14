# Phase 3: Quick Reference Guide

## 🚀 Quick Start

### Minimal Usage (5 lines)
```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/dist/styles/index.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

### Domain-Based Imports
```tsx
import { Chat, Memory, AI, Enterprise, Streaming } from '@clarity-chat/react'

// Chat UI
<Chat.ClarityChat api="/api/chat" />

// Memory
const memory = Memory.useMemoryStore({ enabled: true })
const store = Memory.createMemoryStore({ enabled: true })

// AI Infrastructure
const agent = AI.useAgent({ model: 'gpt-4', tools: [] })
const rag = AI.useRAGPipeline({ vectorStore: 'pinecone', embeddingProvider: 'openai' })

// Enterprise
const shell = Enterprise.createEnterpriseShell({ multiTenancy: { enabled: true } })
const auth = Enterprise.useEnterpriseAuth({ provider: 'okta' })

// Streaming
const chat = Streaming.useStreamingChat({ api: '/api/stream', protocol: 'sse' })
```

### Core Exports (Essential APIs Only)
```tsx
import { 
  ClarityChat, 
  useClarityChat, 
  createMemoryStore 
} from '@clarity-chat/react/core'
```

---

## 📚 Top-Level APIs

### Chat UI
- `ClarityChat` - Drop-in component (5 lines)
- `ClarityChatSimple` - Ultra-minimal component (1 prop)
- `useClarityChat` - Flagship hook

### Memory
- `useMemoryStore` - Drop-in hook
- `createMemoryStore` - Factory function (NEW)

### AI Infrastructure
- `useAgent` - Agent orchestration
- `useRAGPipeline` - RAG pipeline

### Enterprise
- `createEnterpriseShell` - Enterprise setup
- `useEnterpriseAuth` - Enterprise authentication

### Streaming
- `useStreamingChat` - Streaming chat

---

## 🔧 Utilities

### Error Handling
```tsx
import { classifyError, normalizeError, formatErrorForUser } from '@clarity-chat/react'

const error = normalizeError(someError)
const type = classifyError(error) // 'network' | 'ratelimit' | 'server' | etc.
const userMessage = formatErrorForUser(error)
```

### Message Conversion
```tsx
import { 
  convertCoreMessagesToMessages, 
  convertMessagesToCoreMessages 
} from '@clarity-chat/react'

const messages = convertCoreMessagesToMessages(coreMessages)
const coreMessages = convertMessagesToCoreMessages(messages)
```

---

## 📖 Documentation

- **Quick Start**: `QUICK_START_GUIDE.md`
- **Migration**: `MIGRATION_GUIDE.md`
- **API Reference**: `API_REFERENCE_QUICK.md`
- **Architecture**: `DESIGN.md`
- **Phase 3 Report**: `PHASE_3_FINAL_EXECUTION_REPORT.md`

---

## ✅ Validation

- ✅ All hooks return objects (not tuples)
- ✅ All hooks start with `use`
- ✅ All components use standardized props
- ✅ All APIs have comprehensive JSDoc
- ✅ Unified error handling
- ✅ Consistent naming conventions

---

**Phase 3 Complete! 🎉**
