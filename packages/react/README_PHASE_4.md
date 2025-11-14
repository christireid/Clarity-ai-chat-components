# @clarity-chat/react

> **The Most Complete AI Chat Component Library for React** — Enterprise-grade, stupid-simple, drop-in ready.

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react)](https://www.npmjs.com/package/@clarity-chat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Value Proposition

Clarity Chat is the most complete AI chat component library for React. Get a production-ready chat interface in **one line**, or compose powerful features with our layered API architecture. Built for developers who want enterprise-grade capabilities without the complexity.

**Key Differentiators**:
- ⚡ **One-line setup** - `<ClarityChat api="/api/chat" />` and you're done
- 🏗️ **Layered architecture** - Start simple, scale to enterprise
- 🎨 **Production-ready UI** - Beautiful, accessible, responsive components
- 💾 **Built-in memory** - Three strategies for context retention
- 🛠️ **Tool UI registry** - Automatic rendering of tool results
- 📡 **Dual transport** - SSE and WebSocket support
- 🔒 **Enterprise features** - RBAC, audit, multi-tenancy ready

---

## 📦 Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

Don't forget the styles:

```tsx
import '@clarity-chat/react/styles.css'
```

---

## ⚡ Quick Start

### The Simplest Way (1 line)

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it!** ✨ You now have a fully-featured AI chat interface with:
- Automatic message conversion
- Built-in loading states
- Error handling
- Auto-scroll
- Message actions (copy, feedback, retry)
- And more...

### With Memory (1 line)

```tsx
import { ChatWithMemory } from '@clarity-chat/react'

function App() {
  return <ChatWithMemory api="/api/chat" strategy="vector-store" />
}
```

### With Full Control (~15 lines)

```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}
```

---

## 🎯 Top-Level APIs (Drop-In Ready)

### Components

| Component | Use Case | Config Required |
|-----------|----------|----------------|
| `ClarityChat` | Simplest setup | `api` only |
| `ChatWithMemory` | Chat with memory | `api`, `strategy` |
| `ChatComplete` | Full-featured stack | `api`, `memoryStrategy` |
| `ChatWithAnalytics` | Chat with analytics | `api` |
| `ChatWithPersistence` | Chat with localStorage | `api` |
| `ChatWithErrorHandling` | Chat with error boundary | `api` |

### Hooks

| Hook | Use Case | Config Required |
|------|----------|----------------|
| `useChat` | Simplified chat hook | `api` |
| `useClarityChat` | Full control hook | `api` |
| `useMemory` | Memory access | Requires `MemoryProvider` |
| `useAnalytics` | Analytics tracking | Requires `AnalyticsProvider` |

---

## 📚 Documentation

### Getting Started
- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[API Guide](./API_GUIDE.md)** - Complete API reference
- **[Examples](./src/examples/)** - Copy-pasteable examples

### Architecture
- **[Design Document](./DESIGN.md)** - Architecture and design principles
- **[Public API Table](./PUBLIC_API_TABLE.md)** - Complete API listing
- **[Migration Guide](./MIGRATION_GUIDE_PHASE_2.md)** - Migrating from old APIs

### Advanced
- **[Safety Nets](./SAFETY_NETS.md)** - Runtime protections and validations
- **[Performance Guide](./PERFORMANCE_GUIDE.md)** - Optimization strategies
- **[TypeScript Guide](./TYPESCRIPT_GUIDE.md)** - Type definitions and patterns

---

## 🎨 Examples

### Hello World (1-10 lines)

See `src/examples/hello-world-examples.tsx` for the simplest possible usage.

### Intermediate (30-50 lines)

See `src/examples/intermediate-examples.tsx` for real-world patterns.

### Advanced / Enterprise (60-100+ lines)

See `src/examples/advanced-examples.tsx` for full power demonstrations.

---

## 🏗️ Architecture

Clarity Chat follows a **layered architecture** with 6 core domains:

1. **Chat UI** - User-facing chat interface
2. **Memory & Context** - Conversation memory and RAG
3. **AI Infrastructure** - Agents, tools, streaming
4. **Enterprise Platform** - RBAC, audit, multi-tenancy
5. **Analytics & Observability** - Tracking and monitoring
6. **Developer Experience** - Presets, recipes, utilities

Each domain has three layers:
- **Top-level**: Drop-in APIs (zero config)
- **Mid-level**: Composable building blocks
- **Low-level**: Primitives and utilities

See [DESIGN.md](./DESIGN.md) for complete architecture details.

---

## 🔒 Safety & Validation

All top-level APIs include runtime validation with developer-friendly error messages:

- ✅ API endpoint validation
- ✅ Component prop validation
- ✅ Provider context validation
- ✅ Enum/strategy validation
- ✅ Storage key validation

See [SAFETY_NETS.md](./SAFETY_NETS.md) for complete details.

---

## 🤝 Compatibility

### Vercel AI SDK
Full API compatibility with Vercel AI SDK UI. See [Migration Guide](./MIGRATION_GUIDE_PHASE_2.md).

### React Version
Requires React 19.0.0 or higher.

---

## 📝 License

See [LICENSE](../../LICENSE) file.

---

## 🙏 Acknowledgments

Built with inspiration from Vercel AI SDK and the React community.

---

**Ready to build?** Start with the [Quick Start Guide](./QUICKSTART.md)!
