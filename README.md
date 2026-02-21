<div align="center">

<br />

<img src="https://img.shields.io/badge/Clarity_Chat-4A90E2?style=for-the-badge&logo=react&logoColor=white" alt="Clarity Chat" />

<h1>React Components for AI Chat Interfaces</h1>

<p>An open-source component library for building AI chat UIs in React.<br/>
TypeScript. Accessible. Streaming. Token-aware.</p>

<p>
  <a href="./ROADMAP.md"><img src="https://img.shields.io/badge/status-pre--release-orange?style=flat" alt="Status: Pre-release" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/stargazers"><img src="https://img.shields.io/github/stars/christireid/Clarity-ai-chat-components?style=social" alt="GitHub Stars" /></a>
  <a href="https://github.com/christireid/Clarity-ai-chat-components/actions"><img src="https://img.shields.io/github/actions/workflow/status/christireid/Clarity-ai-chat-components/ci.yml?branch=main&label=CI&color=22C55E" alt="Build Status" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License" /></a>
</p>

<p>
  <a href="#quick-start"><strong>Quick Start</strong></a> &bull;
  <a href="./docs/getting-started.md"><strong>Docs</strong></a> &bull;
  <a href="./apps/examples"><strong>Examples</strong></a> &bull;
  <a href="https://github.com/christireid/Clarity-ai-chat-components/discussions"><strong>Discussions</strong></a>
</p>

</div>

---

> **Status:** This project is in active development and has not yet been published to npm. You can try it by cloning the repo and building from source. See [Development Setup](#development-setup) below.

## Quick Start

Once published to npm (coming soon):

```bash
npm install @clarity-chat/react
```

### Simplest: Drop-in Chat

```tsx
import { ClarityChatApp } from '@clarity-chat/react'

export default function App() {
  return <ClarityChatApp api="/api/chat" />
}
```

### With Presets

```tsx
import { ChatPresets } from '@clarity-chat/react'

// Simple chat
ChatPresets.Simple('/api/chat')

// With memory
ChatPresets.Memory('/api/chat')

// Full-featured
ChatPresets.Enterprise('/api/chat')
```

### Custom UI with Hooks

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

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
      header={{ show: true, title: 'AI Assistant' }}
    />
  )
}
```

**That's it.** You get streaming, animations, dark mode, keyboard navigation, WCAG AA accessibility, mobile responsive design, and error recovery.

---

## What's Included

| Category | Details |
|----------|---------|
| **Components** | Chat window, message list, input, code blocks, markdown rendering, voice input, file upload, typing indicators |
| **Hooks** | `useClarityChat`, `useStreaming`, `useTokenBudget`, `useMemoryFeedback`, `useAutoScroll`, `useClipboard`, and more |
| **Features** | Streaming (SSE/WebSocket), token tracking, conversation memory, error boundaries, virtual scrolling |
| **Themes** | 15 theme presets, dark mode, custom theming via Tailwind CSS |
| **Accessibility** | WCAG AA compliant with AAA targets, keyboard navigation, screen reader support, reduced motion |
| **Presets** | `simple`, `pro`, `memory`, `rag`, `tools`, `enterprise`, `sync` |

### Token Optimization

Track and visualize token usage across AI providers:

```tsx
<ClarityChatApp api="/api/chat" features={{ tokenOptimization: true }} />
```

Token savings depend on your AI provider's prompt caching capabilities (e.g., OpenAI, Anthropic). Clarity provides the UI to monitor and visualize costs — the actual savings come from provider-side caching.

### Memory

Persist conversations with automatic context injection:

```tsx
<ClarityChatApp api="/api/chat" features={{ memory: true }} />
```

---

## Packages

| Package | Purpose |
|---------|---------|
| `@clarity-chat/react` | UI components and hooks for chat interfaces |
| `@clarity-chat/primitives` | Base UI primitives (Button, Dialog, Tooltip) built on Radix UI |
| `@clarity-chat/types` | TypeScript type definitions |
| `@clarity-chat/utils` | Formatting, caching, logging utilities |
| `@clarity-chat/token-optimization` | Token counting, budget monitoring, compression |
| `@clarity-chat/memory` | Conversation memory and vector search |
| `@clarity-chat/error-handling` | Error boundaries and recovery for React 19 |

Most users only need `@clarity-chat/react`, which re-exports from the other packages.

---

## Feature Comparison

| Feature | Clarity Chat | Vercel AI SDK | assistant-ui | Stream Chat |
|---------|-------------|---------------|--------------|-------------|
| Focus | Full UI kit | AI primitives | Chat UI | Chat infra |
| Token tracking | Built-in | No | No | No |
| Memory/Context | Built-in | Manual | Manual | Manual |
| Accessibility | WCAG AA | Basic | WCAG AA | WCAG AA |
| License | MIT | MIT | MIT | Commercial |
| Maturity | **Pre-release** | Mature | Growing | Mature |

Clarity's unique value is built-in token optimization UI and conversation memory. For a mature, battle-tested solution, consider Vercel AI SDK or assistant-ui.

---

## Requirements

- Node.js 20+
- React 18 or 19
- TypeScript 5+ (recommended)

## Installation

Not yet published to npm. Coming soon.

## Development Setup

```bash
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components
pnpm install
pnpm build:packages
pnpm storybook          # Browse components in Storybook
```

Requires Node.js 20+ and pnpm 10+.

---

## Documentation

| Resource | Link |
|----------|------|
| Getting Started | [docs/getting-started.md](./docs/getting-started.md) |
| Architecture | [docs/architecture.md](./docs/architecture.md) |
| API Reference | [packages/react/README.md](./packages/react/README.md) |
| Hooks Guide | [packages/react/src/hooks/README.md](./packages/react/src/hooks/README.md) |
| Examples | [apps/examples/](./apps/examples/) |
| Migration Guide | [docs/migration.md](./docs/migration.md) |

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT &copy; 2025-2026 [Christi Reid](https://github.com/christireid)
