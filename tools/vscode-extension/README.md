# Clarity Chat for VS Code

[![Version](https://img.shields.io/visual-studio-marketplace/v/code-and-clarity.clarity-chat)](https://marketplace.visualstudio.com/items?itemName=code-and-clarity.clarity-chat)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/code-and-clarity.clarity-chat)](https://marketplace.visualstudio.com/items?itemName=code-and-clarity.clarity-chat)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/code-and-clarity.clarity-chat)](https://marketplace.visualstudio.com/items?itemName=code-and-clarity.clarity-chat)

**The Ultimate VS Code Extension for Building AI Chat Applications**

Build production-ready AI chat interfaces in minutes with intelligent code completion, 50+ snippets,
GitHub Copilot integration, and comprehensive tooling for the
[Clarity Chat](https://github.com/code-and-clarity/clarity-chat) component library.

![Clarity Chat Extension Demo](https://raw.githubusercontent.com/code-and-clarity/clarity-chat/main/assets/vscode-extension-demo.gif)

## Why Clarity Chat?

| Feature                  | Clarity Chat                 | shadcn/ui  | Chakra UI  | MUI        |
| ------------------------ | ---------------------------- | ---------- | ---------- | ---------- |
| AI Chat Components       | ✅ Purpose-built             | ❌ Generic | ❌ Generic | ❌ Generic |
| Copilot Chat Participant | ✅ @clarity                  | ❌         | ❌         | ❌         |
| Memory Management        | ✅ Built-in                  | ❌         | ❌         | ❌         |
| Token Optimization       | ✅ Automatic                 | ❌         | ❌         | ❌         |
| Streaming Support        | ✅ SSE + WebSocket           | ❌         | ❌         | ❌         |
| Multi-Provider           | ✅ OpenAI, Anthropic, Google | ❌         | ❌         | ❌         |

## Features

### 🤖 GitHub Copilot Chat Integration

Chat with `@clarity` directly in VS Code! Get instant help with:

```
@clarity How do I add memory to my chat?
@clarity /component MessageList
@clarity /hook useTokenBudgetMonitor
@clarity /migrate from Vercel AI SDK
```

**Available Commands:**

- `/component` - Get component documentation and examples
- `/hook` - Get hook documentation and examples
- `/memory` - Learn about memory management strategies
- `/optimize` - Token optimization guidance
- `/migrate` - Migration help from other libraries
- `/docs` - Quick documentation links

### 🎯 Visual Component Picker

**Command:** `Clarity Chat: Add Component` (`Ctrl/Cmd+Shift+P`)

Browse and insert components by category:

- **Top-Level:** ClarityChat, ClarityChatPresets
- **Building Blocks:** ChatWindow, MessageList, ChatInput, MessageBubble
- **Streaming:** StreamingMessage, ThinkingIndicator, TypingIndicator
- **Providers:** ClarityChatProvider, MemoryProvider
- **Token Management:** TokenBudgetDisplay, TokenCounter
- **Utilities:** MarkdownRenderer, CodeBlock, ErrorBoundary

Each component includes:

- Full TypeScript props
- Auto-import handling
- Inline documentation

### 🪝 Hook Picker

**Command:** `Clarity Chat: Add Hook` (`Ctrl/Cmd+Shift+P`)

Access all hooks organized by category:

- **Primary:** useClarityChat, useChatEnhanced
- **Memory:** useMemoryContext, useConversationHistory
- **Streaming:** useStreamingSSE, useStreamingWebSocket
- **Token Optimization:** useTokenBudgetMonitor, useTokenOptimizationEnhanced
- **UI State:** useLoadingState, useErrorHandler, useAutoScroll
- **Provider:** useProviderConfig, useMultiProvider
- **Utilities:** useMessageParser, useKeyboardShortcuts, useVoiceInput

### 🚀 API Route Generator

**Command:** `Clarity Chat: Create API Route` (`Ctrl/Cmd+Shift+P`)

Generate production-ready streaming API routes:

- **Providers:** OpenAI, Anthropic, Google AI, Multi-Provider
- **Frameworks:** Next.js App Router, Next.js Pages Router, Express, Hono
- **Features:** Streaming, error handling, type safety

### 🔄 Migration Assistant

**Command:** `Clarity Chat: Convert to Clarity Chat` (`Ctrl/Cmd+Shift+P`)

Migrate from Vercel AI SDK with one click:

- Automatic import conversion
- Hook migration (`useChat` → `useClarityChat`)
- Options translation
- Type updates
- Preview changes before applying

### 📝 50+ Code Snippets

Type `cc-` to access all snippets:

#### Components

| Prefix           | Description                           |
| ---------------- | ------------------------------------- |
| `cc-chat`        | Complete ClarityChat component        |
| `cc-chat-memory` | ClarityChat with MemoryProvider       |
| `cc-window`      | ChatWindow with MessageList and Input |
| `cc-messagelist` | MessageList component                 |
| `cc-chatinput`   | ChatInput component                   |
| `cc-streaming`   | StreamingMessage component            |
| `cc-thinking`    | ThinkingIndicator                     |
| `cc-page`        | Complete chat page template           |
| `cc-styled`      | ClarityChat with custom styling       |

#### Hooks

| Prefix                 | Description                            |
| ---------------------- | -------------------------------------- |
| `cc-useclaritychat`    | useClarityChat hook                    |
| `cc-usechat-memory`    | useClarityChat with memory config      |
| `cc-usechat-callbacks` | useClarityChat with callbacks          |
| `cc-usememory`         | useMemoryContext hook                  |
| `cc-usebudget`         | useTokenBudgetMonitor hook             |
| `cc-usesse`            | useStreamingSSE hook                   |
| `cc-hook-setup`        | Complete hook setup with all utilities |

#### API Routes

| Prefix             | Description                |
| ------------------ | -------------------------- |
| `cc-api-openai`    | OpenAI streaming route     |
| `cc-api-anthropic` | Anthropic streaming route  |
| `cc-api-google`    | Google AI streaming route  |
| `cc-api-multi`     | Multi-provider route       |
| `cc-api-express`   | Express streaming endpoint |
| `cc-api-hono`      | Hono streaming endpoint    |

#### Imports

| Prefix                 | Description               |
| ---------------------- | ------------------------- |
| `cc-import-all`        | Import all common exports |
| `cc-import-components` | Import components         |
| `cc-import-hooks`      | Import hooks              |
| `cc-import-types`      | Import types              |

### 💡 Intelligent IntelliSense

Context-aware completions for:

- **Components:** All Clarity Chat components with documentation
- **Hooks:** All hooks with parameter hints
- **Props:** Component props with types and descriptions
- **Options:** Hook options with defaults
- **Models:** AI model names with pricing info

### 📖 Hover Documentation

Hover over any Clarity Chat element to see:

- Component/hook description
- Available props/options
- Usage examples
- Links to documentation

### 🔍 CodeLens Hints

Inline hints showing:

- API call detection
- Memory strategy info
- Quick navigation to docs

### ⚠️ Diagnostics & Quick Fixes

Real-time detection and fixes for:

- Hardcoded API keys
- Missing error handling
- Deprecated patterns
- Configuration issues

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (`Ctrl/Cmd+Shift+X`)
3. Search for "Clarity Chat"
4. Click **Install**

### From Command Line

```bash
code --install-extension code-and-clarity.clarity-chat
```

## Quick Start

### 1. Add a Component

```
Ctrl/Cmd+Shift+P → "Clarity Chat: Add Component" → Select ClarityChat
```

### 2. Use Snippets

Type `cc-page` in a new file for a complete chat page:

```tsx
'use client'

import { ClarityChat, MemoryProvider, ClarityChatProvider } from '@clarity-chat/react'

export default function ChatPage() {
  return (
    <ClarityChatProvider config={{ api: '/api/chat' }}>
      <MemoryProvider strategy="hybrid" maxTokens={2000}>
        <div className="h-screen flex flex-col">
          <header className="p-4 border-b">
            <h1 className="text-xl font-semibold">AI Chat</h1>
          </header>
          <main className="flex-1 overflow-hidden">
            <ClarityChat placeholder="Type your message..." showTimestamp enableMarkdown />
          </main>
        </div>
      </MemoryProvider>
    </ClarityChatProvider>
  )
}
```

### 3. Create an API Route

```
Ctrl/Cmd+Shift+P → "Clarity Chat: Create API Route" → OpenAI → Next.js App Router
```

### 4. Ask Copilot

```
@clarity How do I implement conversation memory?
```

## Commands

| Command                 | Description                      | Shortcut             |
| ----------------------- | -------------------------------- | -------------------- |
| Add Component           | Visual component picker          | -                    |
| Add Hook                | Visual hook picker               | -                    |
| Create API Route        | Generate API route               | -                    |
| Convert to Clarity Chat | Migrate from other libraries     | -                    |
| Open Documentation      | Browse docs                      | -                    |
| Open Storybook          | Interactive component playground | -                    |
| Initialize Project      | Set up new project               | `Ctrl/Cmd+Shift+C I` |
| Add Provider            | Add AI provider                  | `Ctrl/Cmd+Shift+C P` |
| Validate Configuration  | Check for issues                 | `Ctrl/Cmd+Shift+C V` |
| Show Examples           | Browse code examples             | `Ctrl/Cmd+Shift+C E` |
| Component Preview       | Preview components               | `Ctrl/Cmd+Shift+C O` |
| Manage API Keys         | Secure key management            | -                    |

## Configuration

Access via `Settings → Extensions → Clarity Chat`:

| Setting                             | Default  | Description                |
| ----------------------------------- | -------- | -------------------------- |
| `clarityChat.enableIntelliSense`    | `true`   | Enable code completion     |
| `clarityChat.enableHoverDocs`       | `true`   | Enable hover documentation |
| `clarityChat.enableCodeLens`        | `true`   | Enable CodeLens hints      |
| `clarityChat.enableCodeActions`     | `true`   | Enable quick fixes         |
| `clarityChat.defaultProvider`       | `openai` | Default AI provider        |
| `clarityChat.defaultMemoryStrategy` | `hybrid` | Default memory strategy    |

## Requirements

- **VS Code** 1.90.0 or higher
- **Node.js** 18.x or higher (for development)
- For Copilot Chat integration: GitHub Copilot extension

## Documentation

- [📖 Documentation](https://docs.claritychat.dev)
- [🎨 Storybook](https://storybook.claritychat.dev)
- [💻 GitHub](https://github.com/code-and-clarity/clarity-chat)
- [💬 Discord Community](https://discord.gg/claritychat)

## Contributing

Found a bug or have a feature request?

- [Open an issue](https://github.com/code-and-clarity/clarity-chat/issues)
- [Join our Discord](https://discord.gg/claritychat)

## License

MIT © [Code and Clarity](https://github.com/code-and-clarity)

---

**Build amazing AI chat experiences with Clarity Chat!** ✨
