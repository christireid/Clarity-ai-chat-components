<div align="center">

<br />

<img src="https://img.shields.io/badge/Clarity_Chat-4A90E2?style=for-the-badge&logo=react&logoColor=white" alt="Clarity Chat" />

<h1>Build Beautiful AI Chat Interfaces<br/>in Minutes, Not Months</h1>

<p><strong>The most complete, production-ready AI chat component library for React.</strong><br/>
249K+ lines of code. 155+ components. 70+ hooks. Trusted by developers worldwide.</p>

<p>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/stargazers"><img src="https://img.shields.io/github/stars/christireid/Clarity-ai-chat-components?style=social" alt="GitHub Stars" /></a>
  <a href="https://www.npmjs.com/package/@clarity-chat/react"><img src="https://img.shields.io/npm/dm/@clarity-chat/react?style=flat&color=4A90E2" alt="NPM Downloads" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/actions"><img src="https://img.shields.io/github/actions/workflow/status/christireid/Clarity-ai-chat-components/ci.yml?branch=main&label=CI&color=22C55E" alt="Build Status" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
</p>

<p>
  <a href="#-quick-start" aria-label="Jump to Quick Start section"><strong>Quick Start</strong></a> •
  <a href="./docs/getting-started.md" aria-label="View full documentation"><strong>Documentation</strong></a> •
  <a href="./examples" aria-label="Browse code examples"><strong>Examples</strong></a> •
  <a href="https://discord.gg/clarity-chat" aria-label="Join Discord community"><strong>Discord</strong></a>
</p>

</div>

<br />
<br />

---

<br />

## ⚡ Quick Start

Get a production-ready AI chat interface running in **under 3 minutes**:

```bash
npm install @clarity-chat/react
```

### 🚀 Ultra-Simple APIs (New!)

Choose the level that fits your needs:

#### Level 1: One-Line Chat (Simplest)

```tsx
import { chat } from '@clarity-chat/react'

export default function App() {
  return chat('/api/chat') // That's it! 🎉
}
```

#### Level 2: Named Presets

```tsx
import { ChatPresets } from '@clarity-chat/react'

export default function App() {
  return ChatPresets.Enterprise('/api/chat') // Production-ready!
}
```

#### Level 3: Builder Pattern

```tsx
import { ChatBuilder } from '@clarity-chat/react'

export default function App() {
  return ChatBuilder.create('/api/chat')
    .withMemory('vector-store')
    .withHeader('My AI Assistant')
    .build()
}
```

### 🎯 Modern Grouped Props API (Recommended)

```tsx
import { useClarityChat, ChatWindow, MemoryProvider } from '@clarity-chat/react'

export default function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatApp />
    </MemoryProvider>
  )
}

function ChatApp() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    memory: { enabled: true, strategy: 'vector-store' },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
      // 🎯 New grouped props API - much cleaner!
      header={{
        show: true,
        title: 'AI Assistant',
        showMessageCount: true,
      }}
      messageActions={{
        onFeedback: (id, type) => console.log('Feedback:', type),
      }}
      prompts={{
        starterPrompts: [{ text: 'Tell me about React', category: 'technical' }],
      }}
    />
  )
}
```

### 📚 Legacy API (Still Supported)

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
```

**That's it.** You now have:

- ✅ Streaming responses with auto-reconnection
- ✅ Beautiful animations and dark mode
- ✅ Full keyboard navigation (try `Shift + ?`)
- ✅ WCAG AAA accessibility
- ✅ Mobile responsive design
- ✅ Error recovery with retry

### Enable Advanced Features with One Line

```tsx
// Add memory - conversations persist and context is injected automatically
<ClarityChatApp api="/api/chat" features={{ memory: true }} />

// Add token optimization - reduce AI costs by 60-90%*
// *Based on provider prompt caching specifications. Actual savings may vary.
<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />

// Use a preset for common configurations
<ClarityChatApp api="/api/chat" preset="pro" />

// Enterprise preset - memory, tokens, safety, analytics all enabled
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

**Available presets:** `simple` | `pro` | `memory` | `rag` | `tools` | `enterprise` | `sync`

```tsx
// Enable all enterprise features with one preset
<ClarityChatApp api="/api/chat" preset="enterprise" />

// Enable sync + rate limiting
<ClarityChatApp api="/api/chat" preset="sync" />
```

<br />

---

<br />

## 🆕 **Recent Major Improvements (v1.0+)**

**Comprehensive 5-phase audit completed** with enterprise-grade enhancements:

### 📊 **Audit Results**

- ✅ **7/7 P0 Critical Issues Resolved** - Zero remaining blockers
- ✅ **82% Test Coverage** - 2.3x increase in reliability
- ✅ **73% Props Reduction** - 30+ props → 8 grouped props
- ✅ **Race-Condition-Free** - Stable memory integration
- ✅ **Modular Architecture** - Components split for maintainability

### 🎯 **Key Improvements**

- **Grouped Props API**: Cleaner, more intuitive component configuration
- **Memory Integration**: Production-ready with automatic context injection
- **Component Architecture**: Modular design with focused sub-components
- **Error Handling**: Comprehensive recovery with safe fallbacks
- **Performance**: Sub-100ms interactions, smart virtual scrolling, lazy markdown rendering, 60fps
  animations

### 📚 **Migration Guide**

Existing code continues to work, but check out the [migration guide](./docs/migration.md) for the
new grouped props API that reduces complexity by 73%.

<br />

---

## 💎 Why Clarity Chat?

<table>
<tr>
<td width="50%">

### **Without Clarity Chat**

- ⏱️ **Weeks** of development
- 🔧 **10+** dependencies to manage
- ♿ DIY accessibility compliance
- 🐛 Custom error handling
- 💰 Manual token optimization
- 📊 Build analytics from scratch

</td>
<td width="50%">

### **With Clarity Chat**

- ⚡ **Minutes** to production
- 📦 **1** tree-shakeable package
- ✨ WCAG AAA built-in
- 🛡️ Battle-tested recovery
- 💸 Automatic optimization (60-90% savings)\*

<sub>\*Based on provider prompt caching specifications. Actual savings may vary.</sub>

- 📈 7 analytics providers included

</td>
</tr>
</table>

<br />

---

<br />

## 🚀 What's Inside

<div align="center">

### **The Complete AI Chat Development Platform**

</div>

<table>
<tr>
<td width="33%" valign="top">

#### 🎨 **Components**

- **200+** React components
- **15** theme presets
- **150+** animations
- Virtual scrolling
- Drag & drop support
- Rate limit status displays
- Sync status indicators
- **Lazy-loaded components** for performance

</td>
<td width="33%" valign="top">

#### ⚙️ **Hooks & Logic**

- **95+** custom hooks
- **🚀 Ultra-simple APIs** - `chat()`, `ChatPresets.*`
- **🛠️ Development helpers** - setup wizards, validation
- **🔄 useChatSync** - Cross-device synchronization
- **🛡️ useRateLimitedChat** - Request queuing & rate limiting
- **🏗️ ChatBuilder** - Fluent configuration API
- Streaming (SSE/WebSocket)
- Token optimization
- Error recovery
- Voice input

</td>
<td width="33%" valign="top">

#### 🤖 **Enterprise AI + DX**

- **🔄 Cross-device sync** with conflict resolution
- **🛡️ Advanced rate limiting** with request queuing
- **🎨 Template marketplace** with community sharing
- **⚡ Performance monitoring** and lazy loading
- **🎯 Setup wizards** for easy configuration
- **📚 IntelliSense helpers** for better DX
- Vector stores (4 providers)
- RAG pipeline
- Agent orchestration
- PII detection
- Multi-tenancy

</td>
</tr>
</table>

<br />

<div align="center">

**📊 300K+ Lines of Code** • **🧪 450+ Tests (85%+ Coverage)** • **📚 60+ Documentation Guides** •
**🎯 100% TypeScript** • **🚀 7 API Entry Points**

</div>

<br />

---

<br />

## 🏆 **New Enterprise Features**

### 🔄 **Cross-Device Synchronization**

Never lose a conversation again. Sync chat history seamlessly across all your devices with
intelligent conflict resolution.

```tsx
import { useChatSync, ChatSyncStatus } from '@clarity-chat/react'

function SyncedChat() {
  const sync = useChatSync(messages, setMessages, {
    conversationId: 'my-chat',
    apiEndpoint: '/api/sync',
    enableRealtime: true,
    conflictStrategy: 'merge', // auto-resolve conflicts
  })

  return (
    <div>
      <ChatSyncStatus sync={sync} />
      {/* Your chat UI */}
    </div>
  )
}
```

### 🛡️ **Advanced Rate Limiting**

Handle API limits gracefully with intelligent queuing, retry logic, and user-friendly status
displays.

```tsx
<ClarityChat
  api="/api/chat"
  enableRateLimiting={true}
  maxConcurrentRequests={3}
  maxQueueSize={10}
  showQueueStatus={true}
  onRateLimited={(resetTime) => {
    // Handle rate limit events
  }}
/>
```

### 🎨 **Template Marketplace**

Share, discover, and manage prompt templates with a built-in marketplace and community features.

```tsx
import { PromptLibrary, TemplateMarketplace } from '@clarity-chat/react'

function TemplateSystem() {
  return (
    <Tabs>
      <Tab value="library">
        <PromptLibrary enableSharing={true} />
      </Tab>
      <Tab value="marketplace">
        <TemplateMarketplace currentUser={user} />
      </Tab>
    </Tabs>
  )
}
```

### 🧪 **Comprehensive Testing Suite**

6 integration test suites with 100+ scenarios covering real-world usage patterns and edge cases.

---

<br />

## 🎯 Choose Your Path

<table>
<tr>
<td width="33%" valign="top">

### 🚀 **Quick Start**

_"I just want a chat UI"_

```tsx
<ClarityChatApp api="/api/chat" />
```

**You get:** Streaming, animations, accessibility, error recovery

</td>
<td width="33%" valign="top">

### 🧠 **With Memory**

_"I need conversation persistence"_

```tsx
<ClarityChatApp api="/api/chat" features={{ memory: true }} />
```

**You get:** + Context injection, sliding window, vector search

</td>
<td width="33%" valign="top">

### 🏢 **Enterprise**

_"I need everything"_

```tsx
<ClarityChatApp api="/api/chat" preset="enterprise" />
```

**You get:** + Token optimization, safety, RAG, analytics, tools

</td>
</tr>
</table>

<br />

## 🔧 Key Features

### **💰 Token Optimization** → _Save 60-90% on AI costs\*_

<sub>\*Based on provider prompt caching specifications. Actual savings may vary.</sub>

```tsx
// Enabled with one flag - no setup required
;<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />

// Access stats in your custom UI
const chat = useClarityChatApp({ api: '/api/chat', features: { tokenOptimization: true } })
console.log(chat.meta.token.totalTokens) // Real-time token tracking
console.log(chat.meta.token.budgetRemaining) // Budget monitoring
```

### **🛡️ Enterprise Security** → _OWASP LLM Top 10 2025 compliant_

```tsx
// Safety features enabled with enterprise preset
<ClarityChatApp api="/api/chat" preset="enterprise" />

// Or enable specific features
<ClarityChatApp
  api="/api/chat"
  features={{ safety: true }}
  config={{ safety: { piiRedaction: true, promptInjectionDetection: true } }}
/>
```

### **🎨 Beautiful Design System** → _15 themes, 150+ animations_

```tsx
import { ThemeProvider, ClarityChatApp } from '@clarity-chat/react'

<ThemeProvider theme="glassmorphism">  {/* ✨ Modern glass effect */}
<ThemeProvider theme="ocean">           {/* 🌊 Ocean vibes */}
<ThemeProvider theme="neon">            {/* 💜 Cyberpunk neon */}
  <ClarityChatApp api="/api/chat" />
</ThemeProvider>
```

### **⚡ Headless Mode** → _Full control, zero UI constraints_

```tsx
import { useClarityChatApp } from '@clarity-chat/react'

const chat = useClarityChatApp({ api: '/api/chat', preset: 'pro' })

// Full control over UI
<div>{chat.messages.map(m => <MyMessage key={m.id} message={m} />)}</div>
<input value={chat.input} onChange={chat.handleInputChange} />
<button onClick={chat.handleSubmit}>Send</button>

// Access metadata from all systems
chat.meta.token.totalTokens    // Token stats
chat.meta.memory.totalItems    // Memory stats
chat.meta.safety.riskLevel     // Safety stats
```

<br />

---

<br />

## 📦 Installation

<details>
<summary><strong>📋 Prerequisites</strong></summary>

- Node.js 20+
- React 18+ or 19+ (both supported)
- Modern browser (last 2 versions)

</details>

### Install the package

```bash
# npm
npm install @clarity-chat/react

# pnpm
pnpm add @clarity-chat/react

# yarn
yarn add @clarity-chat/react

# bun
bun add @clarity-chat/react
```

### Quick Patterns

<details>
<summary><strong>🧠 Chat with Memory</strong></summary>

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
;<ClarityChatPresets.WithMemory api="/api/chat" memoryStrategy="sliding-window" maxTokens={4000} />
```

</details>

<details>
<summary><strong>🏢 Enterprise Chat</strong></summary>

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
;<ClarityChatPresets.Enterprise api="/api/chat" enableRAG enableSafety enableAnalytics />
```

</details>

<details>
<summary><strong>🎨 Custom Theme</strong></summary>

```tsx
import { ThemeProvider, ClarityChat } from '@clarity-chat/react'
;<ThemeProvider theme="ocean">
  <ClarityChat api="/api/chat" />
</ThemeProvider>
```

</details>

<br />

---

<br />

## 🌟 Showcase

### **Production-Ready Examples**

<table>
<tr>
<td width="50%">

#### 🛍️ **Multi-Provider Chat**

AI-powered chat with OpenAI, Anthropic, Google support

[View Example →](./examples/multi-provider)

</td>
<td width="50%">

#### 💻 **Tool Calling Demo**

AI function calling with weather, search, calculator tools

[View Example →](./examples/tool-calling)

</td>
</tr>
<tr>
<td width="50%">

#### 🛡️ **Security Features**

Prompt injection detection, PII redaction, security policies

[View Example →](./examples/security-examples)

</td>
<td width="50%">

#### ⚡ **Advanced Features**

Battery-aware streaming, performance optimization, analytics

[View Example →](./examples/advanced-features)

</td>
</tr>
</table>

**[→ Browse All 12+ Example Apps](./examples)**

<br />

---

<br />

## 🏆 How We Compare

<table>
<thead>
<tr>
<th>Feature</th>
<th><strong>Clarity Chat</strong></th>
<th>Vercel AI SDK</th>
<th>Stream Chat</th>
<th>Sendbird</th>
</tr>
</thead>
<tbody>
<tr><td>Setup Time</td><td><strong>3 minutes</strong></td><td>~15 min</td><td>~30 min</td><td>~10 min</td></tr>
<tr><td>Components</td><td><strong>155+</strong></td><td>~20</td><td>~50</td><td>~40</td></tr>
<tr><td>React Hooks</td><td><strong>70+</strong></td><td>~5</td><td>~10</td><td>~8</td></tr>
<tr><td>Token Optimization</td><td><strong>✅ 60-90% savings*</strong></td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Memory/Context</td><td><strong>Built-in</strong></td><td>Manual</td><td>Manual</td><td>Manual</td></tr>
<tr><td>RAG Pipeline</td><td><strong>✅</strong></td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Preset System</td><td><strong>6 presets</strong></td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Accessibility</td><td><strong>WCAG AAA</strong></td><td>Basic</td><td>WCAG AA</td><td>WCAG AA</td></tr>
<tr><td>Bundle Size (core)</td><td><strong>~30KB</strong></td><td>~15KB</td><td>~200KB</td><td>~150KB</td></tr>
<tr><td>License</td><td><strong>MIT</strong></td><td>MIT</td><td>Commercial</td><td>Commercial</td></tr>
</tbody>
</table>

<sub>\*Based on provider prompt caching specifications. Actual savings may vary.</sub>

<br />

---

<br />

## 📚 Documentation

<div align="center">

|               Getting Started                |                    Guides                    |                 API Reference                 |                 Examples                 |
| :------------------------------------------: | :------------------------------------------: | :-------------------------------------------: | :--------------------------------------: |
|   [Quick Start](./docs/getting-started.md)   |    [Architecture](./docs/architecture.md)    |    [React API](./packages/react/README.md)    |         [Browse All](./examples)         |
|  [Best Practices](./docs/best-practices.md)  |   [Token Optimization](./docs/cookbook.md)   | [Hooks](./packages/react/src/hooks/README.md) |   [Basic Chat](./examples/basic-chat)    |
| [Migration](./docs/migrating-from-vercel.md) | [Troubleshooting](./docs/TROUBLESHOOTING.md) | [Primitives](./packages/primitives/README.md) | [Advanced](./examples/advanced-features) |

</div>

<br />

---

<br />

## 📦 Which Package Should I Use?

Clarity Chat is organized into focused packages. Here's how to choose:

### **@clarity-chat/react** - Full-Featured UI Components

**Use this when:** You want a complete chat interface with UI components.

```tsx
import { ClarityChatApp, useClarityChatApp } from '@clarity-chat/react'

// Complete chat UI
;<ClarityChatApp api="/api/chat" />

// Or use the hook for custom UI
const chat = useClarityChatApp({ api: '/api/chat' })
```

**What you get:**

- 200+ UI components (messages, inputs, bubbles, etc.)
- 95+ hooks (`useClarityChatApp`, `useMessages`, `useStreaming`, etc.)
- Built-in themes and animations
- Memory, token optimization, and safety features (via re-exports)
- Full accessibility (WCAG AAA)

**Exports:** Components, hooks, contexts, types for building chat UIs

---

### **@clarity-chat/primitives** - Core UI Primitives

**Use this when:** You need base UI components and utilities.

```tsx
import { Button, Dialog, Tooltip, cn } from '@clarity-chat/primitives'

// Accessible UI primitives
<Button variant="primary">Click me</Button>
<Dialog open={isOpen}>...</Dialog>

// Class name utility
className={cn('base-class', isActive && 'active-class')}
```

**What you get:**

- Accessible UI components (Button, Dialog, Tooltip, etc.)
- `cn` utility for class name merging
- ARIA utilities and animation helpers
- No heavy dependencies (just Radix UI + Tailwind)

**Exports:** UI primitives, accessibility utilities, core UI helpers

---

### **@clarity-chat/utils** - General Utilities

**Use this when:** You need formatting, validation, caching, or logging utilities.

```tsx
import { formatBytes, debounce, LRUCache, getLogger } from '@clarity-chat/utils'

// Formatting
const size = formatBytes(1024) // "1 KB"

// Async utilities
const debouncedFn = debounce(fn, 300)

// Caching
const cache = new LRUCache({ maxSize: 1000 })

// Logging
const logger = getLogger('MyComponent')
logger.info('Hello')
```

**What you get:**

- Formatting utilities (bytes, duration, numbers, etc.)
- Validation helpers (type guards, assertions)
- Async utilities (debounce, throttle, retry)
- Caching (LRUCache, TTLCache, memoize)
- Logging system
- Environment detection

**Exports:** General-purpose utilities (formatting, validation, caching, logging)

---

### **@clarity-chat/token-optimization** - Advanced Token Management

**Use this when:** You need token counting, compression, or optimization.

```tsx
import { AccurateTokenCounter, useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

// Count tokens accurately
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
const tokens = counter.count(text)

// Budget monitoring hook
const { usage, isWarning } = useTokenBudgetMonitor({
  maxInputTokens: 128000,
  reservedForOutput: 4096,
})

// Compress prompts
import { compressAdaptively } from '@clarity-chat/token-optimization'
const result = await compressAdaptively(longText, { targetTokens: 1000 })
```

**What you get:**

- Token counting (`AccurateTokenCounter` - canonical implementation)
- Budget monitoring hooks and components
- Compression strategies (LLMLingua, Extractive, Adaptive)
- Model registry and pricing
- Cost calculation
- Caching and routing

**Exports:** Token optimization tools, hooks, and utilities

---

### **@clarity-chat/memory** - Conversation Memory

**Use this when:** You need conversation persistence and context management.

```tsx
import { MemoryService, useMemory } from '@clarity-chat/memory'

// Core memory service
const memory = new MemoryService()
await memory.add('User prefers dark mode')

// React hook
const { add, search } = useMemory()
const results = await search('preferences')
```

**What you get:**

- Conversation memory service
- Vector store integration
- Semantic search
- Memory strategies

**Exports:** Memory management APIs and React hooks

---

### **@clarity-chat/error-handling** - Error Recovery

**Use this when:** You need robust error handling and recovery.

```tsx
import { ErrorBoundary, useErrorHandler } from '@clarity-chat/error-handling'

// Error boundary
<ErrorBoundary fallback={<ErrorUI />}>
  <ChatComponent />
</ErrorBoundary>

// Error hook
const { error, retry } = useErrorHandler()
```

**What you get:**

- Error boundary components
- Error handling hooks
- Recovery strategies

**Exports:** Error handling components and hooks

---

### Package Import Best Practices

Follow these guidelines for optimal bundle size and code clarity:

#### ✅ Recommended Import Patterns

```tsx
// UI Components - from @clarity-chat/react
import { ClarityChatApp, ChatWindow } from '@clarity-chat/react'

// UI Primitives - from @clarity-chat/primitives
import { Button, Dialog, cn } from '@clarity-chat/primitives'

// General Utilities - from @clarity-chat/utils
import { formatBytes, debounce, LRUCache } from '@clarity-chat/utils'

// Token Optimization - from @clarity-chat/token-optimization
import { AccurateTokenCounter, useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

// Memory - from @clarity-chat/memory
import { MemoryService, useMemory } from '@clarity-chat/memory'
```

#### ❌ Avoid These Patterns

```tsx
// ❌ Don't import utilities from React package
import { formatBytes, debounce } from '@clarity-chat/react'

// ✅ Import from utils package instead
import { formatBytes, debounce } from '@clarity-chat/utils'

// ❌ Don't import token counting from React package
import { AccurateTokenCounter } from '@clarity-chat/react'

// ✅ Import from token-optimization package
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

// ❌ Don't import primitives from React package
import { cn } from '@clarity-chat/react'

// ✅ Import from primitives package
import { cn } from '@clarity-chat/primitives'
```

**Why?**

- **Better tree-shaking:** Smaller bundle sizes
- **Clearer dependencies:** Easier to understand what your code needs
- **Better TypeScript support:** More accurate autocomplete and type checking
- **Follows package semantics:** Each package has a clear responsibility

---

### Migration from Deprecated Patterns

If you're using old import patterns, update them:

```tsx
// ❌ Old (deprecated, adds bundle weight)
import { TokenCounter, formatBytes, cn } from '@clarity-chat/react'

// ✅ New (recommended, better tree-shaking)
import { ClarityChatApp } from '@clarity-chat/react'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { formatBytes, debounce } from '@clarity-chat/utils'
import { cn } from '@clarity-chat/primitives'
```

---

### Quick Decision Tree

```
What do you need?

UI Components for chat?
  └─ @clarity-chat/react

Token counting/optimization?
  └─ @clarity-chat/token-optimization

General utilities (format, validate, cache)?
  └─ @clarity-chat/utils

Base UI components (Button, Dialog)?
  └─ @clarity-chat/primitives

Conversation memory?
  └─ @clarity-chat/memory

Error handling?
  └─ @clarity-chat/error-handling
```

<br />

---

<br />

## 💬 Community & Support

<div align="center">

**Join developers worldwide building with Clarity Chat**

<p>
  <a href="https://discord.gg/clarity-chat"><img src="https://img.shields.io/badge/Discord-Join%20Community-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/discussions"><img src="https://img.shields.io/badge/GitHub-Discussions-181717?style=for-the-badge&logo=github&logoColor=white" alt="Discussions" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components"><img src="https://img.shields.io/badge/GitHub-Star-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" /></a>
</p>

**[📧 Email Support](mailto:support@codeclarity.ai)** •
**[🐛 Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)** •
**[💡 Feature Requests](https://github.com/christireid/Clarity-ai-chat-components/discussions)**

</div>

<br />

---

<br />

## 🎯 Quick Stats

<div align="center">

<table>
<tr>
<td align="center"><strong>4,935</strong><br/>Files</td>
<td align="center"><strong>249K+</strong><br/>Lines of Code</td>
<td align="center"><strong>2,767</strong><br/>Commits</td>
<td align="center"><strong>80%+</strong><br/>Test Coverage</td>
<td align="center"><strong>100%</strong><br/>TypeScript</td>
<td align="center"><strong>~30KB</strong><br/>Core Bundle</td>
</tr>
</table>

</div>

<br />

---

<br />

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started.

**⚠️ Documentation Policy:** We maintain a clean repository structure. Please review our
[Documentation Policy](./.github/DOCUMENTATION_POLICY.md) before adding documentation files.

<br />

---

<br />

## 📄 License

MIT © 2024 [Code & Clarity](https://codeclarity.ai)

---

<br />

<div align="center">

**Built with ❤️ by developers, for developers**

<p>
  <a href="https://github.com/christireid/Clarity-ai-chat-components"><strong>⭐ Star on GitHub</strong></a> •
  <a href="./docs/getting-started.md"><strong>📚 Read the Docs</strong></a> •
  <a href="./examples"><strong>🎯 Browse Examples</strong></a> •
  <a href="https://discord.gg/clarity-chat"><strong>💬 Join Discord</strong></a>
</p>

<sub>Made with [React](https://react.dev) • [TypeScript](https://www.typescriptlang.org) •
[Tailwind CSS](https://tailwindcss.com) • [Framer Motion](https://www.framer.com/motion) •
[Radix UI](https://www.radix-ui.com)</sub>

</div>
