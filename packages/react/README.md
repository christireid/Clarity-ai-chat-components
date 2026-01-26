# @clarity-chat/react

**Build beautiful AI chat interfaces in one line of code.**

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react)](https://www.npmjs.com/package/@clarity-chat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Installation

```bash
npm install @clarity-chat/react
```

## Peer Dependencies

### Required

These dependencies are required for all installations:

```bash
# Core React runtime (required)
npm install react react-dom

# Icons and animations (required)
npm install lucide-react framer-motion

# Core utilities (required)
npm install zod react-markdown remark-gfm rehype-highlight
```

| Package            | Version            | Size   | Purpose            |
| ------------------ | ------------------ | ------ | ------------------ |
| `react`            | ^18.0.0 or ^19.0.0 | ~130KB | Core framework     |
| `react-dom`        | ^18.0.0 or ^19.0.0 | ~130KB | DOM rendering      |
| `lucide-react`     | ^0.500.0           | ~20KB  | Icon library       |
| `framer-motion`    | ^12.23.25          | ~90KB  | Animations         |
| `zod`              | ^3.24.0            | ~50KB  | Runtime validation |
| `react-markdown`   | ^10.0.0            | ~45KB  | Markdown rendering |
| `remark-gfm`       | ^4.0.0             | ~20KB  | GitHub markdown    |
| `rehype-highlight` | ^7.0.0             | ~20KB  | Code highlighting  |

**Total base size:** ~505KB (minified + gzipped)

### Optional Features

Install only the dependencies you need for specific features:

#### Syntax Highlighting

```bash
npm install shiki
```

Enables code syntax highlighting in messages. Without it:

- Code blocks render as plain text with basic styling
- Saves ~150KB from bundle
- Use when: Code sharing is a primary feature

#### RAG Document Processing

```bash
# PDF support
npm install pdfjs-dist

# DOCX support
npm install mammoth

# Export conversations as ZIP
npm install jszip
```

| Package      | Size   | Feature                | Alternative             |
| ------------ | ------ | ---------------------- | ----------------------- |
| `pdfjs-dist` | ~800KB | PDF document parsing   | Server-side processing  |
| `mammoth`    | ~100KB | DOCX document parsing  | Server-side processing  |
| `jszip`      | ~110KB | Export as ZIP archives | Individual file exports |

**Bundle impact:** 800-1000KB for full RAG features

#### Advanced Features

```bash
# Mermaid diagram rendering
npm install mermaid

# Advanced tokenization (more accurate than default)
npm install flowtoken

# Reranking for RAG (semantic search improvement)
npm install cohere-ai
```

| Package     | Size   | Feature                 | Savings without it |
| ----------- | ------ | ----------------------- | ------------------ |
| `mermaid`   | ~400KB | Diagram rendering       | ~400KB             |
| `flowtoken` | ~50KB  | Precise token counting  | ~50KB              |
| `cohere-ai` | ~80KB  | Search result reranking | ~80KB              |

### Bundle Size Breakdown

| Configuration         | Size      | Use Case                     |
| --------------------- | --------- | ---------------------------- |
| Core only             | ~370KB    | Basic chat                   |
| + Syntax highlighting | ~520KB    | Developer tools              |
| + RAG (no docs)       | ~370KB    | Vector search only           |
| + Full RAG            | ~1.4MB    | Document processing          |
| + All features        | ~1.9MB    | Enterprise with all features |
| `core-minimal` bundle | **~30KB** | Headless, bring your own UI  |

**Optimization tip:** Use dynamic imports for heavy features:

```tsx
// Lazy load PDF support
const PDFLoader = lazy(() => import('./pdf-loader'))

// Only load when needed
if (file.type === 'application/pdf') {
  const { parsePDF } = await import('./pdf-parser')
}
```

### Troubleshooting

#### Peer dependency warnings

```
npm WARN peer dependency missing: shiki@^3.0.0
```

**Solution:** These warnings are safe to ignore if you're not using the feature. To silence them:

```bash
# Install as dev dependency (won't be bundled)
npm install -D shiki

# Or use --legacy-peer-deps
npm install --legacy-peer-deps
```

#### Version conflicts

```
Error: Cannot find module 'framer-motion'
```

**Solution:** Ensure peer dependencies match the required versions:

```bash
# Check installed versions
npm list react react-dom framer-motion lucide-react

# Update to compatible versions
npm install react@latest react-dom@latest framer-motion@latest
```

#### Bundle size issues

If your bundle is too large:

1. **Use core-minimal** for maximum tree-shaking:

   ```tsx
   import { ClarityChatApp } from '@clarity-chat/react/core-minimal'
   ```

2. **Lazy load features:**

   ```tsx
   const RAGFeatures = lazy(() => import('./rag-features'))
   ```

3. **Disable unused features:**
   ```tsx
   <ClarityChatApp
     api="/api/chat"
     features={{
       rag: false, // Excludes document loaders
       diagrams: false, // Excludes mermaid
     }}
   />
   ```

#### React 19 compatibility

All components are fully compatible with React 19. If you see warnings:

```bash
# Ensure you're on latest versions
npm install react@19 react-dom@19 @clarity-chat/react@latest
```

#### Missing icons

```
Error: lucide-react icons not rendering
```

**Solution:** lucide-react is a required peer dependency:

```bash
npm install lucide-react@latest
```

#### TypeScript errors

```
Cannot find type definitions for 'framer-motion'
```

**Solution:** Install type definitions:

```bash
npm install -D @types/react @types/react-dom
```

Note: framer-motion, lucide-react, and shiki include their own types.

## Quick Start (3 Minutes)

```tsx
import { ClarityChatApp } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
```

**That's it.** You now have a production-ready chat with streaming, error handling, memory, and
accessibility.

---

## Enable Features with One Line

```tsx
// Add memory - conversations persist automatically
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Add token optimization - reduce AI costs by 60-90%
<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />

// Use a preset - pro, memory, rag, tools, or enterprise
<ClarityChatApp api="/api/chat" preset="enterprise" />

// Combine preset with custom config
<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
  config={{ tokenOptimization: { budget: 16000 } }}
/>
```

### Available Presets

| Preset       | Features Included                                        |
| ------------ | -------------------------------------------------------- |
| `simple`     | Streaming + error recovery + accessible UI               |
| `pro`        | + Token stats, basic safety                              |
| `memory`     | + Memory with sliding-window                             |
| `rag`        | + Document sources, chunking, retrieval                  |
| `tools`      | + Tool calling with registry pattern                     |
| `enterprise` | **All features**: Memory, tokens, safety, RAG, analytics |

---

## Headless Mode (Full Control)

```tsx
import { useClarityChatApp } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChatApp({
    api: '/api/chat',
    preset: 'pro',
  })

  return (
    <div>
      {chat.messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input
        value={chat.input}
        onChange={chat.handleInputChange}
        onKeyDown={(e) => e.key === 'Enter' && chat.handleSubmit()}
      />
      <button onClick={chat.handleSubmit}>Send</button>

      {/* Access metadata from all systems */}
      <div>Tokens: {chat.meta.token.totalTokens}</div>
      <div>Memory items: {chat.meta.memory.totalItems}</div>
    </div>
  )
}
```

---

## Why Clarity Chat?

| Feature            | Clarity Chat       | DIY Solution       |
| ------------------ | ------------------ | ------------------ |
| Setup time         | **3 minutes**      | Days               |
| Streaming          | Built-in           | Manual             |
| Memory management  | **6 presets**      | Build from scratch |
| Token optimization | **60-90% savings** | Manual             |
| Accessibility      | **WCAG AAA**       | DIY                |
| Error recovery     | Auto-retry         | Custom logic       |

---

## Core APIs

### Primary (Recommended)

| API                   | Use Case                                               |
| --------------------- | ------------------------------------------------------ |
| `<ClarityChatApp />`  | **Recommended.** Full-featured chat with one component |
| `useClarityChatApp()` | **Recommended.** Headless hook with all features       |

### Legacy (Still Supported)

| API                         | Use Case                      |
| --------------------------- | ----------------------------- |
| `<ClarityChat />`           | Drop-in chat component        |
| `useClarityChat()`          | Chat hook with memory options |
| `useClarityObject<T>()`     | Structured output generation  |
| `useClarityChatWithTools()` | Chat with function calling    |

---

## Components

### Chat Components

```tsx
import {
  ClarityChatApp, // Full-featured (recommended)
  ClarityChat, // Drop-in component
  ChatWindow, // UI-only component
  ChatInput, // Message input
  VirtualizedMessageList, // Optimized for large lists
  StreamingMessage, // Real-time streaming display
} from '@clarity-chat/react'
```

### Layout Components

```tsx
import {
  ChatLayout, // Basic layout
  ResizableChatLayout, // Resizable panels
  FloatingChatWidget, // Floating chat button
} from '@clarity-chat/react'
```

### Headless Primitives

```tsx
import { ChatPrimitive } from '@clarity-chat/react'
;<ChatPrimitive.Root>
  <ChatPrimitive.Messages>
    {messages.map((msg) => (
      <ChatPrimitive.Message key={msg.id}>
        <ChatPrimitive.MessageContent>{msg.content}</ChatPrimitive.MessageContent>
        <ChatPrimitive.MessageActions>
          <ChatPrimitive.CopyButton />
          <ChatPrimitive.RegenerateButton />
        </ChatPrimitive.MessageActions>
      </ChatPrimitive.Message>
    ))}
  </ChatPrimitive.Messages>
  <ChatPrimitive.Input />
</ChatPrimitive.Root>
```

---

## Bundle Size

| Import Path                        | Size      | Use Case            |
| ---------------------------------- | --------- | ------------------- |
| `@clarity-chat/react`              | ~600KB    | Full library        |
| `@clarity-chat/react/core`         | ~300KB    | Core + hooks        |
| `@clarity-chat/react/core-minimal` | **~30KB** | Just ClarityChatApp |
| `@clarity-chat/react/slim`         | ~276KB    | Optimized bundle    |

**Tree-shaking**: All imports are tree-shakeable. Import only what you need.

---

## Feature Flags

```typescript
interface ClarityFeatureFlags {
  memory?: boolean // Context persistence
  tokenOptimization?: boolean // Cost reduction
  tools?: boolean // Function calling
  rag?: boolean // Document retrieval
  safety?: boolean // Content moderation
  observability?: boolean // Analytics
  streaming?: boolean // Real-time responses (default: true)
  errorRecovery?: boolean // Auto-retry (default: true)
}
```

---

## Configuration

```tsx
<ClarityChatApp
  api="/api/chat"
  preset="enterprise"
  features={{ memory: true, tokenOptimization: true }}
  config={{
    memory: {
      strategy: 'sliding-window',
      maxTokens: 8000,
    },
    tokenOptimization: {
      budget: 16000,
      showStats: true,
    },
    safety: {
      piiRedaction: true,
      promptInjectionDetection: true,
    },
  }}
/>
```

---

## Examples

### Minimal Examples

```tsx
// Basic chat
<ClarityChatApp api="/api/chat" />

// With memory
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Enterprise
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

### Production Example

```tsx
import { ClarityChatApp, ThemeProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ThemeProvider theme="ocean">
      <ClarityChatApp
        api="/api/chat"
        preset="enterprise"
        systemPrompt="You are a helpful assistant."
        onEvent={(event) => {
          if (event.type === 'message:sent') {
            analytics.track('message_sent')
          }
        }}
      />
    </ThemeProvider>
  )
}
```

---

## Documentation

- **[Getting Started](../../docs/getting-started.md)** - Quick start guide
- **[Migration Guide](../../docs/MIGRATION_GUIDE.md)** - Migrate from other libraries
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[Examples](../../apps/examples/)** - 40+ production examples

---

## Related Packages

- `@clarity-chat/memory` - Memory management system
- `@clarity-chat/types` - Type definitions
- `@clarity-chat/primitives` - UI building blocks
- `@clarity-chat/utils` - Utility functions

---

## License

MIT License - See [LICENSE](../../LICENSE) file.

---

**Ready to build?** Start with `<ClarityChatApp api="/api/chat" />` and add features as you need
them!
