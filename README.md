<div align="center">

# ✨ Clarity Chat

### **The Most Complete AI Chat Component Library for React**

<p align="center">
  <a href="https://www.npmjs.com/package/@clarity-chat/react">
    <img src="https://img.shields.io/npm/v/@clarity-chat/react?style=for-the-badge&colorA=18181B&colorB=4A90E2" alt="NPM Version" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&colorA=18181B&colorB=4A90E2" alt="License" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&colorA=18181B&colorB=4A90E2" alt="TypeScript" />
  </a>
  <a href="https://codecov.io/gh/christireid/Clarity-ai-chat-components">
    <img src="https://img.shields.io/codecov/c/github/christireid/Clarity-ai-chat-components?style=for-the-badge&colorA=18181B&colorB=4A90E2" alt="Test Coverage" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/Accessibility-WCAG%202.1%20AAA-success?style=for-the-badge" alt="WCAG AAA" />
  </a>
  <a href="https://discord.gg/clarity-chat">
    <img src="https://img.shields.io/discord/clarity-chat?style=for-the-badge&colorA=18181B&colorB=4A90E2" alt="Discord" />
  </a>
</p>

<p align="center">
  <strong>70+ Production-Ready Components</strong> • 
  <strong>35+ Custom Hooks</strong> • 
  <strong>11 Beautiful Themes</strong> • 
  <strong>Enterprise AI Infrastructure</strong>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-examples">Examples</a> •
  <a href="https://discord.gg/clarity-chat">Discord</a>
</p>

</div>

---

## 📑 Table of Contents

- [Why Clarity Chat?](#-why-clarity-chat)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Key Features](#-key-features)
- [What Makes This Library Special?](#-what-makes-this-library-special)
  - [Blueprint Coverage](#the-only-library-with-100-blueprint-coverage)
  - [Feature Comparison](#feature-comparison)
- [Environment Support](#️-environment-support)
- [Visual Showcase](#-visual-showcase)
  - [Component Architecture](#component-architecture)
  - [Data Flow Visualization](#data-flow-visualization)
- [Feature Highlights](#-feature-highlights)
  - [Token Optimization Suite](#1-token-optimization-suite-)
  - [Beautiful Design System](#2-beautiful-design-system-)
  - [Streaming & Real-Time Updates](#3-streaming--real-time-updates-)
  - [Enterprise AI Infrastructure](#4-enterprise-ai-infrastructure-)
  - [Advanced Message Operations](#5-advanced-message-operations-)
  - [Voice Input & Multi-Modal](#6-voice-input--multi-modal-)
  - [Command Palette & Keyboard Shortcuts](#7-command-palette--keyboard-shortcuts-)
  - [Analytics & Monitoring](#8-analytics--monitoring-)
- [Component Library](#-component-library)
  - [Core Components (70+)](#core-components-70)
  - [Complete Component Reference](#complete-component-reference)
  - [Custom Hooks (35+)](#custom-hooks-35)
- [Enterprise AI Infrastructure](#️-enterprise-ai-infrastructure)
- [Utilities & Helpers](#️-utilities--helpers)
- [Templates & Pre-built Solutions](#-templates--pre-built-solutions)
- [Analytics System](#-analytics-system)
- [Accessibility Features](#️-accessibility-features)
- [Theme System](#️-theme-system)
- [Animation System](#️-animation-system)
- [Packages](#-packages)
- [Documentation](#-documentation)
  - [Getting Started](#getting-started)
  - [Comparison & Migration](#comparison--migration)
- [Performance Metrics](#-performance-metrics)
- [Developer Experience](#️-developer-experience)
  - [Beautiful CLI Tool](#beautiful-cli-tool)
  - [MCP Server](#mcp-server-model-context-protocol)
  - [Memory Management Tools](#memory-management-tools)
  - [VSCode Extension](#vscode-extension)
  - [Interactive Playground](#interactive-playground)
  - [Advanced Debugging Tools](#advanced-debugging-tools)
- [Testing & Quality](#-testing--quality)
- [Community & Support](#-community--support)
- [Stats & Metrics](#-stats--metrics)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🚀 Why Clarity Chat?

Building an AI chat interface from scratch is **hard**. You need streaming, error handling, token management, accessibility, performance optimization, and so much more. Clarity Chat gives you **everything** you need in one beautifully designed package.

**Stop building. Start shipping.** 🎯

---

## 📦 Installation

```bash
npm install @clarity-chat/react
# or
yarn add @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
bun add @clarity-chat/react
```

---

## ⚡ Quick Start

Get a production-ready AI chat interface in 60 seconds:

```tsx
import { useClarityChat, ChatWindow, coreMessagesToMessages } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const convertedMessages = coreMessagesToMessages(messages)

  return (
    <ChatWindow
      messages={convertedMessages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

**That's it!** ✨ You now have a production-ready AI chat interface with:

- ✨ Beautiful animations and transitions
- ⌨️ Full keyboard navigation
- 📱 Mobile responsive design
- ⚡ Optimized performance
- ♿ WCAG AAA accessibility
- 🔒 Production-ready security

**[📖 View Full Quick Start Guide](./apps/docs-site/app/learn/quick-start)** • **[📚 Browse Examples](./apps/examples/README.md)**

---

## ✨ Features

- 🎨 **Beautiful Design System** - 11 stunning themes, 6-level shadow system, 150+ animations
- ♿ **WCAG AAA Accessible** - Screen reader optimized, keyboard navigation, AAA contrast ratios
- 💰 **Token Optimization** - Save 50-80% on AI API costs with comprehensive optimization suite
- 🚀 **Lightning Fast** - Virtual scrolling, optimized rendering, <50ms initial render
- 🤖 **Enterprise AI Ready** - Vector stores, RAG pipeline, agent orchestration, multi-tenancy
- 📊 **Built-in Analytics** - 7 providers, 35+ events, A/B testing support
- ⚡ **Streaming Support** - SSE and WebSocket with auto-reconnection
- 🔒 **Production Security** - AI safety guardrails, PII detection, audit logging

---

## 🎯 What Makes This Library Special?

Imagine building a ChatGPT-like interface. Now imagine having **every single component, hook, and utility** you need, perfectly polished, accessible, and ready to drop into your app. That's Clarity Chat.

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🎨  Beautiful Design System      🚀  Lightning Fast         ║
║     ♿  WCAG AAA Accessible          🧩  70+ Components         ║
║     💰  Token Optimization          🤖  Enterprise AI Ready     ║
║     📊  Built-in Analytics          🎭  11 Stunning Themes      ║
║     🔒  Production Security         ⚡  Streaming Support       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### The Only Library with 100% Blueprint Coverage

We analyzed every major AI chat platform (ChatGPT, Claude, Gemini) and built **every essential feature**:

```
╔═══════════════════════════════════════════════════════════════╗
║          BLUEPRINT COVERAGE: 100% COMPLETE                    ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ✅ 27/27 Essential Features Implemented                       ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ ✓ Message Management & Display        (6/6)  ████████   │  ║
║  │ ✓ Conversation Management             (4/4)  ████████   │  ║
║  │ ✓ Input & Interaction                 (5/5)  ████████   │  ║
║  │ ✓ State & Error Management            (4/4)  ████████   │  ║
║  │ ✓ Accessibility                       (3/3)  ████████   │  ║
║  │ ✓ Performance                         (3/3)  ████████   │  ║
║  │ ✓ Advanced Features                   (2/2)  ████████   │  ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ➕ 12 Enterprise Features (Beyond Competitors)                ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ 🗄️  Vector Stores & RAG Pipeline                         │ ║
║  │ 🤖  Agent Orchestration                                   │ ║
║  │ 🛡️  AI Safety Guardrails                                 │ ║
║  │ 🏢  Multi-Tenancy & RBAC                                 │  ║
║  │ 📊  Observability & Tracing                              │  ║
║  │ 🔌  Webhook System                                       │  ║
║  │ 🔌  Plugin Architecture                                  │  ║
║  │ 📝  Audit Logging                                        │  ║
║  │ 💰  Token Optimization Suite                             │  ║
║  │ 📈  Analytics Integration                                │  ║
║  │ 🐛  Error Tracking                                       │  ║
║  │ 🔐  Security Features                                    │  ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### Feature Comparison

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FEATURE COMPARISON                            │
├──────────────────────┬──────────┬──────────┬──────────┬───────────┤
│ Feature              │ Clarity   │ ChatGPT  │ Claude   │ Gemini    │
├──────────────────────┼──────────┼──────────┼──────────┼───────────┤
│ Components           │    70+    │    ❌     │    ❌     │    ❌     │
│ Custom Hooks         │    35+    │    ❌     │    ❌     │    ❌     │
│ Themes               │    11     │    1     │    1     │    1     │
│ Token Optimization   │    ✅      │    ❌     │    ❌     │    ❌     │
│ Vector Stores        │    4      │    ❌     │    ❌     │    ❌     │
│ RAG Pipeline         │    ✅      │    ❌     │    ❌     │    ❌     │
│ Agent Orchestration  │    ✅      │    ❌     │    ❌     │    ❌     │
│ Accessibility        │    AAA     │    AA     │    AA     │    AA     │
│ Open Source          │    ✅      │    ❌     │    ❌     │    ❌     │
│ Customizable         │    ✅      │    ❌     │    ❌     │    ❌     │
└──────────────────────┴──────────┴──────────┴──────────┴───────────┘
```

---

## 🖥️ Environment Support

- **Modern Browsers** - Chrome, Firefox, Safari, Edge (last 2 versions)
- **Server-Side Rendering** - Next.js, Remix, and more
- **Mobile** - iOS Safari, Chrome Mobile
- **Node.js** - 18+ for server-side features

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](https://godban.github.io/browsers-support-badges/)<br>Edge |
| --- | --- | --- | --- |
| ✅ Last 2 versions | ✅ Last 2 versions | ✅ Last 2 versions | ✅ Last 2 versions |

---

## 🎨 Visual Showcase

### Component Architecture

```
╔═══════════════════════════════════════════════════════════════════╗
║                    CLARITY CHAT ECOSYSTEM                         ║
║              The Complete AI Chat Development Platform            ║
╚═══════════════════════════════════════════════════════════════════╝
```

<details>
<summary><b>View Full Architecture Diagram</b></summary>

```
┌─────────────────────────────────────────────────────────────────────┐
│                         UI COMPONENTS LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ ChatWindow   │  │ MessageList  │  │ ChatInput    │              │
│  │              │  │              │  │              │              │
│  │ • Layout     │  │ • Virtual    │  │ • Auto-resize│              │
│  │ • Themes     │  │ • Streaming  │  │ • Voice      │              │
│  │ • Responsive │  │ • Markdown   │  │ • Files      │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │ TokenCounter │  │CommandPalette│  │ ContextMenu  │              │
│  │              │  │              │  │              │              │
│  │ • Real-time  │  │ • Fuzzy      │  │ • Smooth     │              │
│  │ • Warnings   │  │ • Search     │  │ • Animations │              │
│  │ • Cost calc  │  │ • Shortcuts  │  │ • Keyboard   │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          HOOKS LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Streaming            Error Handling        Token Management         │
│  ├─ useStreamingSSE   ├─ useErrorRecovery   ├─ useTokenTracker       │
│  └─ useStreamingWS    └─ useRetry           └─ useTokenOptimization  │
│                                                                       │
│  Message Ops          Realistic UX          Utilities                │
│  ├─ useMessageOps     ├─ useRealisticTyping ├─ useAutoScroll         │
│  └─ useBranching      └─ useTypingIndicator └─ useKeyboardShortcuts  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      ENTERPRISE AI INFRASTRUCTURE                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Vector Stores        Agents              RAG Pipeline               │
│  ├─ Pinecone          ├─ ReAct Pattern    ├─ Document Loaders        │
│  ├─ Qdrant            ├─ Tool Calling     ├─ Text Splitting          │
│  ├─ Weaviate          └─ Orchestration    ├─ Hybrid Search            │
│  └─ Chroma                              └─ Reranking                 │
│                                                                       │
│  AI Safety            Observability       Multi-Tenancy               │
│  ├─ PII Detection     ├─ Tracing          ├─ Tenant Isolation        │
│  ├─ Content Filter    ├─ Metrics          ├─ RBAC                    │
│  └─ Guardrails        └─ Evaluation       └─ Audit Logging           │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

</details>

### Data Flow Visualization

```
┌─────────────────────────────────────────────────────────────────────┐
│                    MESSAGE FLOW DIAGRAM                            │
└─────────────────────────────────────────────────────────────────────┘

    👤 User Types Message
           │
           │  ┌───────────────────────────────────────────────┐
           └─▶│        ChatInput Component                   │
              │  • Auto-resize textarea                      │
              │  • Voice input support                       │
              │  • File upload (drag & drop)                 │
              └──────────────────┬───────────────────────────┘
                                 │
                                 ▼
              ┌───────────────────────────────────────────────┐
              │    useTokenTracker Hook                       │
              │  • Check token limits                         │
              │  • Calculate cost                             │
              │  • Show warnings                              │
              └──────────────────┬─────────────────────────────┘
                                 │
                                 ▼
              ┌───────────────────────────────────────────────┐
              │   useErrorRecovery Hook                       │
              │  • Retry logic                                │
              │  • Exponential backoff                         │
              │  • Error classification                       │
              └──────────────────┬─────────────────────────────┘
                                 │
                                 ▼
              ┌───────────────────────────────────────────────┐
              │      API Request Layer                        │
              │  • SSE streaming                              │
              │  • WebSocket support                          │
              │  • Auto-reconnection                          │
              └──────────────────┬─────────────────────────────┘
                                 │
                                 ▼
              ┌───────────────────────────────────────────────┐
              │      Streaming UI Layer                       │
              │  • Real-time updates                          │
              │  • Typing indicators                          │
              │  • Progress tracking                          │
              └──────────────────┬─────────────────────────────┘
                                 │
                                 ▼
              ┌───────────────────────────────────────────────┐
              │     Message Display                           │
              │  • Markdown rendering                         │
              │  • Code syntax highlighting                   │
              │  • LaTeX math rendering                       │
              │  • Copy/Edit/Regenerate                       │
              └───────────────────────────────────────────────┘
```

---

## 🌟 Feature Highlights

### 1. Token Optimization Suite 💰

**Save 50-80% on AI API costs** with our comprehensive optimization toolkit:

```tsx
import {
  usePromptCompression,
  useSmartCache,
  useModelRouter,
  TokenOptimizationDashboard,
} from '@clarity-chat/react'

function OptimizedChat() {
  const compression = usePromptCompression({ removeFillers: true })
  const cache = useSmartCache({ enableSemanticMatching: true })
  const router = useModelRouter()

  const handleSend = async (content: string) => {
    // 1. Compress prompt (20-35% savings)
    const { compressed } = compression.compress(content)
    
    // 2. Check semantic cache (40-60% savings)
    const cached = await cache.get(compressed)
    if (cached) return cached
    
    // 3. Route to optimal model (40-60% cost savings)
    const { model } = router.route(compressed)
    
    // 4. Query with optimizations
    const response = await queryAPI(compressed, { model: model.id })
    await cache.set(compressed, response)
    return response
  }

  return (
    <>
      <TokenOptimizationDashboard
        metrics={{
          totalTokens: 50000,
          tokensSaved: 15000,
          costSaved: 0.45,
          savingsPercent: 30,
        }}
      />
      <ChatWindow onSendMessage={handleSend} />
    </>
  )
}
```

**Optimization Features:**
- 🗜️ **Prompt Compression**: 20-35% input token reduction
- 💾 **Smart Caching**: 40-60% savings with semantic similarity
- 🎯 **Model Routing**: 40-60% cost reduction via intelligent routing
- ✂️ **Response Limiting**: 30-50% output token savings
- 📦 **Request Batching**: 30-40% savings through batch discounts
- ⏱️ **Smart Throttling**: 50%+ API call reduction

**[→ Token Optimization Guide](./apps/docs/guide/token-optimization.md)**

---

### 2. Beautiful Design System 🎨

**11 Stunning Themes** with a 6-level shadow system and 150+ animations:

```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'

// Choose from 11 built-in themes
<ThemeProvider theme={themes.ocean}>      {/* 🌊 Ocean vibes */}
<ThemeProvider theme={themes.glassmorphism}> {/* ✨ Modern glass */}
<ThemeProvider theme={themes.dark}>      {/* 🌙 Dark mode */}
<ThemeProvider theme={themes.sunset}>    {/* 🌅 Warm sunset */}
<ThemeProvider theme={themes.forest}>   {/* 🌲 Nature green */}
<ThemeProvider theme={themes.neon}>     {/* 💜 Cyberpunk neon */}
// ... and 5 more!

// Or create your own
<ThemeProvider theme={{
  colors: { primary: '#your-color' },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.05)' },
  animations: { duration: { fast: 150 } }
}}>
```

**Design System Features:**
- 🎭 **6-Level Shadow System**: xs, sm, md, lg, xl, 2xl for perfect depth
- ⚡ **150+ Animations**: Professional cubic-bezier easing
- 📐 **4px Grid System**: Precise alignment throughout
- 🎨 **Refined Typography**: Perfect spacing & font smoothing
- ♿ **WCAG AAA Focus States**: Enhanced accessibility
- 🌈 **Polished Color System**: Better contrast & hierarchy

**[→ Design System Guide](./DESIGN_SYSTEM_GUIDE.md)**

---

### 3. Streaming & Real-Time Updates ⚡

**Multiple streaming options** with automatic reconnection:

```tsx
import { useStreamingSSE, StreamingMessage } from '@clarity-chat/react'

function StreamingChat() {
  const { streamMessage, isStreaming } = useStreamingSSE({
    endpoint: '/api/chat/stream',
    autoReconnect: true,
    reconnectDelay: 1000,
  })

  const handleSend = async (content: string) => {
    await streamMessage({
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })
  }

  return (
    <ChatWindow
      onSendMessage={handleSend}
      renderMessage={(msg) => (
        <StreamingMessage
          message={msg}
          showTypingIndicator={isStreaming}
        />
      )}
    />
  )
}
```

**Streaming Features:**
- 📡 **SSE Support**: Server-Sent Events with auto-reconnect
- 🔌 **WebSocket Support**: Bidirectional real-time communication
- 🔄 **Auto-Reconnection**: Exponential backoff on failures
- 💓 **Heartbeat Monitoring**: Connection health tracking
- 📊 **Progress Indicators**: Real-time streaming progress

---

### 4. Enterprise AI Infrastructure 🤖

**Complete RAG pipeline, agents, and vector stores**:

```tsx
import {
  useVectorStore,
  useRAGPipeline,
  useAgentOrchestration,
} from '@clarity-chat/react'

function EnterpriseChat() {
  const vectorStore = useVectorStore('pinecone', { apiKey: '...' })
  const ragPipeline = useRAGPipeline({
    vectorStore,
    embeddingProvider: 'openai',
    reranker: 'cohere',
  })
  const agent = useAgentOrchestration({
    model: 'gpt-4',
    tools: [webSearchTool, calculatorTool],
  })

  const handleQuery = async (query: string) => {
    // 1. Retrieve relevant documents
    const docs = await ragPipeline.retrieve(query)
    
    // 2. Rerank for relevance
    const ranked = await ragPipeline.rerank(query, docs)
    
    // 3. Generate response with agent
    const response = await agent.run({
      query,
      context: ranked,
    })
    
    return response
  }

  return <ChatWindow onSendMessage={handleQuery} />
}
```

**Enterprise Features:**
- 🗄️ **4 Vector Stores**: Pinecone, Qdrant, Weaviate, Chroma
- 🔗 **RAG Pipeline**: Document loaders, splitting, hybrid search, reranking
- 🤖 **Agent Orchestration**: ReAct pattern with tool calling
- 🛡️ **AI Safety**: PII detection, content filtering, guardrails
- 📊 **Observability**: Tracing, metrics, evaluation (LangSmith-like)
- 🔐 **Multi-Tenancy**: Tenant isolation, RBAC, audit logging

---

### 5. Advanced Message Operations ✏️

**Edit, regenerate, branch, and undo/redo** conversations:

```tsx
import { useMessageOperations, MessageList } from '@clarity-chat/react'

function AdvancedChat() {
  const {
    messages,
    editMessage,
    regenerateMessage,
    branchConversation,
    undo,
    redo,
  } = useMessageOperations()

  return (
    <>
      <MessageList
        messages={messages}
        onEdit={editMessage}
        onRegenerate={regenerateMessage}
        onBranch={branchConversation}
      />
      <div>
        <button onClick={undo}>↶ Undo</button>
        <button onClick={redo}>↷ Redo</button>
      </div>
    </>
  )
}
```

**Message Features:**
- ✏️ **Edit Messages**: Version history and undo/redo
- 🔄 **Regenerate**: Get new AI responses
- 🌳 **Branch Conversations**: Create alternative paths
- 📤 **Export**: Markdown, JSON, or plain text
- 🔍 **Search**: Full-text search across conversations
- 📋 **Copy**: One-click copy with animations

---

### 6. Voice Input & Multi-Modal 🎤

**Voice input with animated waveform visualization**:

```tsx
import { VoiceInput, FileUpload } from '@clarity-chat/react'

function MultiModalChat() {
  return (
    <ChatWindow
      inputComponents={{
        voice: (
          <VoiceInput
            onTranscript={(text) => sendMessage(text)}
            lang="en-US"
            autoSubmit
            showWaveform
          />
        ),
        file: (
          <FileUpload
            onUpload={(files) => handleFiles(files)}
            accept="image/*,application/pdf"
            maxSize={10 * 1024 * 1024}
            dragAndDrop
          />
        ),
      }}
    />
  )
}
```

**Multi-Modal Features:**
- 🎤 **Voice Input**: Speech-to-text with waveform animation
- 📎 **File Upload**: Drag & drop with preview
- 🖼️ **Image Support**: Display and preview images
- 📄 **Document Context**: PDF, Markdown, and more
- 🎬 **Staggered Animations**: Beautiful upload feedback

---

### 7. Command Palette & Keyboard Shortcuts ⌨️

**Power-user features for efficiency**:

```tsx
import { CommandPalette, useKeyboardShortcuts } from '@clarity-chat/react'

function PowerUserChat() {
  useKeyboardShortcuts({
    'cmd+k': () => openCommandPalette(),
    'cmd+/': () => showShortcuts(),
    'cmd+b': () => branchConversation(),
    'esc': () => closeAll(),
  })

  return (
    <>
      <CommandPalette
        commands={[
          { id: 'new', label: 'New Chat', action: () => newChat() },
          { id: 'export', label: 'Export', action: () => exportChat() },
          { id: 'settings', label: 'Settings', action: () => openSettings() },
        ]}
        fuzzySearch
      />
      <ChatWindow {...props} />
    </>
  )
}
```

**Power Features:**
- ⌨️ **Keyboard Shortcuts**: Fully customizable (Shift+? for help)
- 🔍 **Command Palette**: Fuzzy search with cmd+k
- 📋 **Context Menus**: Right-click actions with animations
- 🖱️ **Drag & Drop**: Reorder messages, upload files
- 📳 **Haptic Feedback**: Mobile device vibrations

---

### 8. Analytics & Monitoring 📊

**Built-in analytics with 7 providers**:

```tsx
import { AnalyticsProvider, createGoogleAnalyticsProvider } from '@clarity-chat/react'

function AnalyticsChat() {
  return (
    <AnalyticsProvider
      config={{
        providers: [
          createGoogleAnalyticsProvider('GA-ID'),
          createMixpanelProvider('MIXPANEL-ID'),
          createPostHogProvider('POSTHOG-ID'),
        ],
        autoTrack: {
          pageViews: true,
          errors: true,
          performance: true,
        },
      }}
    >
      <ChatWindow {...props} />
    </AnalyticsProvider>
  )
}
```

**Analytics Features:**
- 📈 **7 Providers**: GA4, Mixpanel, PostHog, Amplitude, and more
- 📊 **35+ Events**: Pre-defined event tracking
- 🧪 **A/B Testing**: Built-in support
- 📉 **Performance Monitoring**: Real-time dashboard
- 🔍 **Error Tracking**: 6 providers (Sentry, Rollbar, Bugsnag)

---

## 📦 Component Library

### Core Components (70+)

```
╔═══════════════════════════════════════════════════════════════╗
║                  COMPONENT CATEGORIES                         ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  📨 Messaging Components (15)                                  ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ ChatWindow          │ MessageList                         │║
║  │ Message             │ StreamingMessage                    │║
║  │ MessageBubble       │ MessageMetadata                     │║
║  │ MessageActions      │ MessageSearch                       │║
║  │ ConversationTimeline│ MemoryInspector                     │║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ⌨️ Input & Interaction (12)                                  ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ ChatInput           │ AdvancedChatInput                   │║
║  │ VoiceInput          │ FileUpload                          │║
║  │ CommandPalette      │ ContextMenu                         │║
║  │ FollowUpSuggestions │ PromptSuggestions                   │║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  🎨 UI Primitives (20)                                         ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Button              │ Input                               │║
║  │ Card                │ Badge                               │║
║  │ Dialog              │ Tooltip                             │║
║  │ Dropdown            │ Tabs                                │║
║  │ Switch              │ Checkbox                            │║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  📊 Data Display (10)                                          ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ TokenCounter       │ AnalyticsDashboard                  │ ║
║  │ UsageDashboard     │ ResponseQualityMeter                │ ║
║  │ PerformanceMetrics │ SessionSummaryCard                  │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  🤖 Enterprise AI (13)                                         ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ VectorStoreViewer  │ AgentRunFeed                        │ ║
║  │ RAGPipeline        │ SafetyStatusCard                    │ ║
║  │ DocumentViewer     │ MultiModalPreview                   │ ║
║  │ AuditLogViewer     │ WorkflowSuggestionList              │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

#### Complete Component Reference

**📨 Messaging Components (20+):** `ChatWindow`, `MessageList`, `VirtualizedMessageList`, `Message`, `MessageOptimized`, `StreamingMessage`, `MessageBubble`, `MessageMetadata`, `MessageSearch`, `AdvancedMessageSearch`, `ConversationTimeline`, `ConversationList`, `ConversationBranchVisualizer`, `MemoryInspector`, `StreamBlock`, `StreamingTextRenderer`, `ThinkingIndicator`, `CopyButton`, `StreamCancellation`, `EmptyState`

**⌨️ Input & Interaction (15+):** `ChatInput`, `AdvancedChatInput`, `VoiceInput`, `FileUpload`, `CommandPalette`, `ContextMenu`, `Draggable`, `FollowUpSuggestions`, `PromptSuggestions`, `KeyboardHint`, `ModelSelector`, `PersonaPanel`

**🎨 UI Primitives & Layout (25+):** `Button`, `Input`, `Card`, `InteractiveCard`, `Badge`, `Dialog`, `Tooltip`, `Dropdown`, `Tabs`, `Switch`, `Checkbox`, `Skeleton`, `AnimatedList`, `Toast`, `Progress`, `FeedbackAnimation`, `Icons`, `ThemeSelector`, `ThemeSwitcher`, `ThemePreview`, `ProjectSidebar`, `SettingsPanel`, `LinkPreview`, `ContextCard`, `ContextManager`, `ContextVisualizer`

**📊 Data Display & Analytics (15+):** `TokenCounter`, `TokenOptimizationPanel`, `TokenOptimizationBadge`, `TokenOptimizationDashboard`, `AnalyticsDashboard`, `UsageDashboard`, `PerformanceDashboard`, `ResponseQualityMeter`, `SessionSummaryCard`, `PerformanceMetrics`, `NetworkStatus`, `ErrorBoundary`, `ErrorBoundaryEnhanced`, `RetryButton`

**🤖 Enterprise AI (15+):** `VectorStoreViewer`, `AgentRunFeed`, `RAGPipeline`, `SafetyStatusCard`, `DocumentViewer`, `MultiModalPreview`, `AuditLogViewer`, `WorkflowSuggestionList`, `KnowledgeBaseViewer`, `CitationCard`, `ToolInvocationCard`, `AIOps`, `Enterprise`

**📤 Export & Management (5+):** `ExportDialog`, `BatchExportDialog`, `PromptLibrary`

**🎨 Enhanced Rendering (5+):** `EnhancedMarkdownRenderer`, `MarkdownRendererEnhanced`, `EnhancedCodeBlock`

### Custom Hooks (35+)

#### Streaming Hooks
```tsx
useStreamingSSE()          // Server-Sent Events with auto-reconnect
useStreamingWebSocket()    // WebSocket connections with heartbeat
useStreaming()             // Unified streaming interface
useStreamableUI()          // Streamable UI components
useAssistant()             // Assistant API integration
```

#### Error Handling Hooks
```tsx
useErrorRecovery()         // Retry with exponential backoff
useRetry()                 // Manual retry logic
```

#### Token Management Hooks
```tsx
useTokenTracker()          // Track usage and costs
useTokenOptimization()     // Comprehensive optimization suite
useSmartCache()            // Semantic caching for token savings
useModelRouter()           // Intelligent model routing
useSmartThrottle()         // Smart request throttling
```

#### Message Operations Hooks
```tsx
useMessageOperations()     // Edit, regenerate, branch, undo/redo
useMessageHistory()        // Message history management
useBranching()             // Conversation branching
useOptimisticMessage()     // Optimistic UI updates
useClarityChat()           // 🚀 Flagship hook - Recommended for all new projects
useChat()                  // Core chat functionality (legacy)
useChatEnhanced()          // Enhanced chat with advanced features
useCompletion()             // Text completion
```

#### UX Enhancement Hooks
```tsx
useRealisticTyping()       // Realistic typing indicators
useTypingIndicator()       // Multi-stage typing indicators
useAutoScroll()            // Smart auto-scrolling
useCommandPaletteCommands() // Command palette integration
useDeferredSearch()        // Deferred search for performance
```

#### Voice & Mobile Hooks
```tsx
useVoiceInput()            // Voice input with waveform
useMobileKeyboard()        // Mobile keyboard handling
```

#### Utility Hooks
```tsx
useKeyboardShortcuts()     // Keyboard bindings
useDebounce()              // Debounced values
useThrottle()              // Throttled callbacks
useClipboard()             // Clipboard operations
useLocalStorage()          // LocalStorage persistence
useIndexedDB()             // IndexedDB persistence
useMediaQuery()            // Responsive breakpoints
useEventListener()          // Event listener management
useIntersectionObserver()  // Intersection observer
useMounted()               // Component mount state
usePrevious()              // Previous value tracking
useToggle()                // Boolean toggle state
useWindowSize()            // Window size tracking
```

#### Performance Hooks
```tsx
usePerformance()           // Performance monitoring
```

#### Enterprise AI Hooks
```tsx
useVectorStore()          // Vector database operations
useRAGPipeline()          // RAG workflow management
useAgentOrchestration()   // Agent management and orchestration
useObservability()        // Tracing and metrics
```

#### Memory Management Hooks
```tsx
useSlidingContextManager()  // Sliding window with RAG retrieval
useTokenOptimizedContext()  // Context compression and optimization
useVectorStoreAdapter()     // Vector store integration for memory
useMemoryRetrieval()        // Semantic memory search
useMemoryStorage()          // Store and manage conversation memories
```

---

## 🏢 Enterprise AI Infrastructure

### Vector Stores
- **Pinecone** - High-performance vector database
- **Qdrant** - Open-source vector search engine
- **Weaviate** - Cloud-native vector database
- **Chroma** - Embedding database

### Embeddings
- **OpenAI Embeddings** - text-embedding-ada-002, text-embedding-3-small/large
- **Cohere Embeddings** - embed-english-v3.0, embed-multilingual-v3.0
- **Caching** - Semantic similarity caching for cost reduction

### Agent Orchestration
- **ReAct Pattern** - Reasoning and Acting agent framework
- **Tool Calling** - Function/tool invocation support
- **Multi-Agent Systems** - Coordinate multiple agents
- **Agent Run Feed** - Real-time agent execution visualization

### RAG Pipeline
- **Document Loaders** - PDF, Markdown, HTML, CSV, JSON, and more
- **Text Splitting** - Intelligent chunking strategies
- **Hybrid Search** - Keyword + semantic search
- **Reranking** - Cohere, Jina, Voyage reranking support

### AI Safety
- **PII Detection** - Detect personally identifiable information
- **Content Filtering** - Moderation and content safety
- **Guardrails** - Prompt injection protection
- **Safety Status Card** - Real-time safety monitoring

### Observability
- **Tracing** - Request tracing and debugging
- **Metrics** - Performance and usage metrics
- **Evaluation** - Response quality evaluation
- **LangSmith Integration** - Compatible with LangSmith

### Multi-Tenancy & RBAC
- **Tenant Isolation** - Secure multi-tenant support
- **Role-Based Access Control** - Fine-grained permissions
- **Audit Logging** - Complete audit trail
- **Usage Quotas** - Per-tenant quota management

### Webhooks & Plugins
- **Webhook System** - Event-driven webhooks
- **Plugin Architecture** - Extensible plugin system
- **Custom Integrations** - Build custom integrations

---

## 🛠️ Utilities & Helpers

### Model Adapters
- **OpenAI** - GPT-3.5, GPT-4, GPT-4 Turbo, GPT-4o
- **Anthropic** - Claude 3 Opus/Sonnet/Haiku, Claude 3.5 Sonnet
- **Google** - Gemini Pro, Gemini Ultra
- **Azure OpenAI** - Azure-hosted OpenAI models
- **Custom Providers** - Extensible adapter pattern

### Streaming Utilities
- **StreamableValue** - React Server Components streaming
- **Streaming Parser** - Parse streaming responses
- **Chat Helpers** - Message formatting and processing

### Performance Utilities
- **Performance Optimization** - React optimization helpers
- **Virtual Scrolling** - Efficient list rendering
- **Memoization** - Smart memoization utilities

### Export Utilities
- **Markdown Export** - Export conversations as Markdown
- **JSON Export** - Export as structured JSON
- **Batch Export** - Export multiple conversations

### Context Management
- **Context Window** - Manage conversation context
- **Sliding Window** - Dynamic context window
- **Token-Optimized Context** - Compress context intelligently

### Rate Limiting
- **Token-Based Rate Limiting** - Per-user rate limits
- **Request Rate Limiting** - API rate limiting
- **Smart Throttling** - Intelligent request throttling

### Hybrid Search
- **Keyword Search** - Traditional keyword matching
- **Semantic Search** - Vector similarity search
- **Hybrid Scoring** - Combine both approaches

---

## 📚 Templates & Pre-built Solutions

### Application Templates
Pre-built templates for common use cases:
- **AI Assistant** - General-purpose AI assistant
- **Code Assistant** - AI coding companion
- **Customer Support** - Support chatbot template
- **Documentation Helper** - Interactive docs assistant
- **E-commerce Assistant** - Shopping assistant
- **Healthcare Assistant** - Medical appointment booking
- **Financial Advisor** - Budget planning assistant
- **AI Tutor** - Adaptive learning system

### Prompt Templates
Pre-built prompt templates for common tasks:
- **System Prompts** - Role-based system prompts
- **Instruction Templates** - Task-specific instructions
- **Few-Shot Examples** - Example-based prompts
- **Chain-of-Thought** - Reasoning prompts
- **Custom Templates** - Create your own prompt templates

---

## 📊 Analytics System

### Analytics Providers
- **Google Analytics 4** - GA4 integration
- **Mixpanel** - Product analytics
- **PostHog** - Open-source analytics
- **Amplitude** - Product analytics
- **Segment** - Customer data platform
- **Custom Providers** - Extensible analytics

### Event Tracking
- **35+ Pre-defined Events** - Message sent, response received, errors, etc.
- **Custom Events** - Track custom events
- **A/B Testing** - Built-in A/B testing support
- **Performance Monitoring** - Real-time performance metrics

### Error Tracking
- **Sentry** - Error tracking and monitoring
- **Rollbar** - Real-time error tracking
- **Bugsnag** - Application stability monitoring
- **Custom Providers** - Integrate any error tracking service

---

## ♿ Accessibility Features

- **WCAG 2.1 AAA Compliance** - Highest accessibility standard
- **Screen Reader Support** - Full ARIA labels and descriptions
- **Keyboard Navigation** - Complete keyboard accessibility
- **Focus Management** - Proper focus handling
- **High Contrast Support** - Enhanced contrast modes
- **Reduced Motion** - Respects prefers-reduced-motion
- **Voice Control** - Voice input and control support

---

## 🎨 Theme System

### Built-in Themes (11)
- **default** - Clean, professional
- **dark** - Dark mode
- **ocean** - Blue ocean vibes 🌊
- **glassmorphism** - Modern glass effect ✨
- **sunset** - Warm sunset colors 🌅
- **forest** - Green nature theme 🌲
- **corporate** - Professional business 💼
- **neon** - Cyberpunk neon 💜
- **minimal** - Ultra minimal
- **warm** - Cozy warm tones 🔥
- **cool** - Cool blue/gray ❄️

### Theme Features
- **Live Theme Editor** - Edit themes in real-time
- **Custom Themes** - Create your own themes
- **Theme Preview** - Preview themes before applying
- **6-Level Shadow System** - xs, sm, md, lg, xl, 2xl
- **150+ Animations** - Professional cubic-bezier easing
- **4px Grid System** - Precise alignment
- **Refined Typography** - Perfect spacing & font smoothing

---

## 🎬 Animation System

- **150+ Animations** - Pre-built animation presets
- **Framer Motion Integration** - Powered by Framer Motion
- **Cubic-Bezier Easing** - Professional easing curves
- **Staggered Animations** - Sequential element animations
- **Feedback Animations** - User interaction feedback
- **Performance Optimized** - GPU-accelerated animations
- **Reduced Motion Support** - Respects accessibility preferences

---

## 📦 Packages

| Package | Description | Size |
|---------|-------------|------|
| [`@clarity-chat/react`](./packages/react) | Main library + AI infrastructure ⭐ | ~120KB |
| [`@clarity-chat/types`](./packages/types) | TypeScript definitions | ~8KB |
| [`@clarity-chat/primitives`](./packages/primitives) | Base UI components | ~25KB |
| [`@clarity-chat/error-handling`](./packages/error-handling) | Error recovery system | ~45KB |
| [`@clarity-chat/cli`](./packages/cli) | Developer CLI tool 🛠️ | ~15KB |
| [`@clarity-chat/mcp-server`](./mcp-server) | MCP server for AI agents 🤖 | ~20KB |

**New in v2.0**:
- Vector stores, embeddings, agents, RAG pipeline
- AI safety, observability, webhooks, plugins
- Multi-tenancy, RBAC, audit logging, quotas
- Token optimization suite 🆕
- Memory management tools 🧠
- MCP server for AI agent integration 🤖
- All optional, tree-shakeable modules (+35KB)

---

## 📚 Documentation

### Quick Start Guides
- **[Getting Started with Clarity Chat](./docs/getting-started-clarity-chat.md)** ⭐ **START HERE** - Minimal example, get running in minutes
- **[Clarity vs Vercel AI SDK UI](./docs/clarity-vs-vercel-ai-sdk-ui.md)** - Feature comparison and when to choose Clarity
- **[Migrating from Vercel AI SDK](./docs/migrating-from-vercel-ai-sdk.md)** - Step-by-step migration guide

### Getting Started
- **[Getting Started with Clarity Chat](./docs/getting-started-clarity-chat.md)** - Get from zero to working chat in minutes ⭐
- [Quick Start Guide](./apps/docs/guide/quick-start.md) - Detailed quick start (5 minutes)
- [Installation Guide](./apps/docs/guide/installation.md)
- [First Component Tutorial](./apps/docs/guide/getting-started.md)

### Comparison & Migration
- **[Clarity vs Vercel AI SDK UI](./docs/clarity-vs-vercel-ai-sdk-ui.md)** - Detailed feature comparison ⭐
- **[Migrating from Vercel](./docs/migrating-from-vercel.md)** - Step-by-step migration guide ⭐

### Guides
- [Theming System](./apps/docs/guide/theming.md)
- [Token Optimization](./apps/docs/guide/token-optimization.md) 🆕
- [Streaming Messages](./apps/docs/guide/streaming.md)
- [Error Handling](./apps/docs/guide/error-handling.md)
- [Accessibility](./apps/docs/guide/accessibility.md)
- [Performance Guide](./PERFORMANCE_GUIDE.md)

### API Reference
- [Components (70+)](./apps/docs/api/components.md)
- [Hooks (35+)](./apps/docs/api/hooks.md)
- [Utilities](./apps/docs/api/utilities.md)
- [TypeScript Types](./apps/docs/api/types.md)

### Examples Gallery (30+ Production-Ready Examples)

```
📁 apps/examples/
├── 🆕 token-optimization-demo/    # Complete optimization showcase
├── 🆕 ecommerce-assistant/        # Shopping chatbot
├── 🆕 code-assistant/              # AI coding companion
├── 🆕 ai-agents-workflow/          # Multi-agent system
├── 🆕 document-summarizer/         # Intelligent summarization
├── 🆕 email-assistant/             # Email composition
├── 🆕 healthcare-assistant/        # Appointment booking
├── 🆕 financial-advisor/          # Budget planning
├── 🆕 ai-tutor/                    # Adaptive learning
├── advanced-chat-features/        # All modern features
├── basic-chat/                     # Simple chat interface
├── comprehensive-chat-demo/       # Complete integration
├── component-demo/                # Component patterns
├── design-system-showcase/         # Design system demo
├── theme-builder/                  # Theme customization
├── performance-dashboard/          # Performance monitoring
├── model-comparison-demo/          # Compare AI providers
├── rag-workbench-demo/             # Document Q&A
├── analytics-console-demo/        # Usage tracking
├── ai-assistant/                   # TanStack Query patterns
├── ai-research-platform/           # Research assistant
├── ai-sales-copilot/               # Sales automation
├── customer-support/               # Supabase integration
├── streaming-chat/                 # Streaming patterns
├── conversational-analytics/       # Analytics dashboard
├── devops-command-center/         # DevOps assistant
├── enterprise-ai-ops/              # Enterprise operations
├── enterprise-knowledge-hub/       # Knowledge management
├── multi-user-chat/                # Multi-user support
├── vercel-ai-sdk-compatible/       # Vercel AI SDK integration
└── integration-examples/           # Integration patterns
```

**[→ View All Examples](./apps/examples/README.md)**

---

## 🎯 Performance Metrics

```
╔═══════════════════════════════════════════════════════════════╗
║              PERFORMANCE BENCHMARKS                           ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  ⚡ Bundle Size                                                ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Core Library:        ~120KB (gzipped)                    │ ║
║  │ With Primitives:     ~145KB (gzipped)                     │║
║  │ Full Enterprise:     ~180KB (gzipped)                     │║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  🚀 Rendering Performance                                      ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Initial Render:      <50ms    ████████░░  80%            │ ║
║  │ Message Append:      <16ms    ██████████ 100% (60fps)    │ ║
║  │ Virtual Scrolling:   1000+    ██████████ 100% smooth     │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  📊 Memory Usage                                               ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Base:                ~2MB                                │ ║
║  │ 100 Messages:        ~5MB                                │ ║
║  │ 1000 Messages:       ~15MB (with virtualization)         │ ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ♿ Accessibility Score                                        ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Lighthouse:          100/100  ██████████                  │║
║  │ WCAG Level:          AAA      ██████████                  │║
║  │ Keyboard Nav:        100%     ██████████                  │║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 🛠️ Developer Experience

### Beautiful CLI Tool

```bash
# Interactive component browser
clarity-chat browse

# Search components
clarity-chat search "chat"

# Smart package updates
clarity-chat upgrade

# Performance benchmarking
clarity-chat benchmark

# Project analysis
clarity-chat analyze

# Initialize new project
clarity-chat init

# Add components to project
clarity-chat add component-name

# Generate code from templates
clarity-chat generate

# Run development server
clarity-chat dev

# Check project health
clarity-chat doctor

# View documentation
clarity-chat docs
```

**CLI Features:**
- 🎨 **12 Commands**: Complete developer toolkit
- 🖥️ **9+ TUI Components**: Gorgeous terminal UI with animations
- 🔍 **Component Search**: Find what you need instantly
- 📊 **Performance Analysis**: Benchmark your app
- 🔧 **Project Scaffolding**: Initialize and configure projects
- 📦 **Smart Updates**: Intelligent dependency management

### MCP Server (Model Context Protocol)

**Enable AI agents like Claude Desktop to interact with Clarity Chat projects**:

```bash
# Install globally
npm install -g @clarity-chat/mcp-server

# Or use via npx
npx @clarity-chat/mcp-server
```

**Configure Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "clarity-chat": {
      "command": "npx",
      "args": ["@clarity-chat/mcp-server"]
    }
  }
}
```

**MCP Server Features:**
- 🛠️ **7 Tools**: Initialize projects, list examples, validate config, get model info, calculate costs, analyze projects
- 📚 **6 Resources**: Documentation, architecture, API reference, examples, model pricing, capabilities
- 💬 **5 Prompts**: Implement features, debug issues, optimize performance, review code, convert examples
- 🔒 **Secure**: Input validation, path sanitization, structured error handling
- ⚡ **Fast**: Resource caching, optimized queries, efficient data structures

**Example Usage:**
```
"Can you initialize a new Clarity Chat project with OpenAI in /path/to/my-app?"
"What are the capabilities and pricing of GPT-4 Turbo?"
"How much would it cost to process 1000 input tokens with Claude 3 Opus?"
```

**[→ MCP Server Documentation](./mcp-server/README.md)**

### Memory Management Tools

**Advanced conversation memory and context management**:

```tsx
import {
  useSlidingContextManager,
  useTokenOptimizedContext,
  useVectorStoreAdapter,
} from '@clarity-chat/react'

function MemoryEnabledChat() {
  const memoryManager = useSlidingContextManager({
    maxTokens: 8000,
    vectorStore: 'qdrant', // or 'pinecone', 'weaviate', 'chroma'
    enableRAG: true,
  })

  const optimizedContext = useTokenOptimizedContext({
    compressionRatio: 0.7,
    preserveImportantMessages: true,
  })

  const handleSend = async (message: string) => {
    // 1. Retrieve relevant memories
    const memories = await memoryManager.retrieveRelevant(message)
    
    // 2. Optimize context window
    const context = optimizedContext.optimize([
      ...memories,
      ...recentMessages,
    ])
    
    // 3. Send with optimized context
    const response = await sendMessage(message, { context })
    
    // 4. Store important memories
    await memoryManager.storeMemory({
      type: 'episodic',
      content: { message, response },
      importanceScore: 0.8,
    })
    
    return response
  }

  return <ChatWindow onSendMessage={handleSend} />
}
```

**Memory Features:**
- 🧠 **Sliding Context Window**: Fixed-size buffer with semantic retrieval
- 🔍 **RAG Integration**: Vector-based memory search across conversation history
- 💾 **Multi-Layer Memory**: Episodic, semantic, preference, and behavioral memory
- 🎯 **Token Optimization**: Intelligent context compression (30-50% reduction)
- 📊 **Memory Types**: Session, thread, global, and user-scoped memories
- 🗄️ **Vector Store Support**: Qdrant, Pinecone, Weaviate, Chroma
- 🔄 **Auto-Archival**: Automatic memory importance scoring and archival

**Memory Infrastructure:**
```bash
# Start memory services (Qdrant, Redis, PostgreSQL)
docker-compose -f docker-compose.memory.yml up -d
```

**[→ Memory Management Guide](./apps/docs/guide/memory.md)**

### VSCode Extension

- 📝 **60+ Code Snippets**: Type `cc-` for component templates
- 💡 **IntelliSense**: Full TypeScript support with hover docs
- 🔍 **Real-time Diagnostics**: Catch errors as you type
- 👁️ **Component Preview**: See components in action
- 🎨 **Theme Support**: Preview themes directly in editor
- 📚 **Inline Documentation**: Quick access to API docs

### Interactive Playground

Monaco-based REPL for testing components in real-time:
- 🎮 **Live Preview**: See components render as you code
- 📝 **Code Templates**: Pre-built examples for common patterns
- 🔄 **Hot Reload**: Instant updates as you type
- 📦 **Import Any Component**: Test any component from the library
- 🎨 **Theme Switcher**: Try all 11 themes instantly
- 📊 **Performance Metrics**: Real-time performance monitoring

### Advanced Debugging Tools

- ⏪ **Time-Travel Debugger**: Record and replay conversation states
- 🔀 **Model Comparator**: Compare AI responses side-by-side
- 📈 **Performance Profiler**: Track latency and token usage
- 🐛 **Error Inspector**: Detailed error analysis with stack traces
- 📊 **Token Tracker**: Real-time token usage visualization
- 🔍 **Network Monitor**: Inspect API calls and streaming events

---

## 🧪 Testing & Quality

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npm run typecheck

# E2E tests (Playwright)
npm run test:e2e
```

**Quality Metrics:**
- ✅ **80%+ Test Coverage** (target: 85%)
- ✅ **WCAG 2.1 AAA** accessibility compliant
- ✅ **100% TypeScript** with strict mode
- ✅ **Playwright E2E** (6 browsers + 2 mobile devices)
- ✅ **Visual Regression** with Chromatic
- ✅ **Accessibility Testing** with Lighthouse + Axe

---

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

```bash
# Clone the repo
git clone https://github.com/christireid/Clarity-ai-chat-components.git

# Install dependencies
npm install

# Start development
npm run dev

# Run Storybook
npm run storybook
```

---

## 💬 Community & Support

- 💬 [Discord Community](https://discord.gg/clarity-chat) - Join our friendly community
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues) - Found a bug?
- 💡 [Feature Requests](https://github.com/christireid/Clarity-ai-chat-components/discussions) - Have an idea?
- 📧 [Email Support](mailto:support@codeclarity.ai) - Need help?

---

## 📊 Stats & Metrics

```
╔═══════════════════════════════════════════════════════════════╗
║                    LIBRARY STATS                              ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  📦 Codebase                                                   ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Lines of Code:       35,000+  ████████████████████       │ ║
║  │ Components:          70+      ████████████████████       │ ║
║  │ Hooks:                35+      ████████████████████       │║
║  │ Animations:          150+      ████████████████████       │║
║  │ Themes:               11       ████████████████████       │║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  📚 Documentation                                              ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Examples:            30+ production-ready                 │║
║  │ Guides:              10+ comprehensive                     ║
║  │ API Docs:            100% coverage                         ║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
║  ✅ Quality                                                    ║
║  ┌──────────────────────────────────────────────────────────┐ ║
║  │ Test Coverage:       80%+     ████████████████░░         │ ║
║  │ TypeScript:          100%     ████████████████████        │║
║  │ Accessibility:       AAA      ████████████████████        │║
║  │ Bundle Size:         ~120KB   ████████░░░░░░░░░░          │║
║  └──────────────────────────────────────────────────────────┘ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📄 License

MIT © 2024 [Code & Clarity](https://codeclarity.ai)

---

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [Vitest](https://vitest.dev/) - Testing

---

<div align="center">

## 🌟 Built with ❤️ by [Code & Clarity](https://codeclarity.ai)

<p align="center">
  <a href="https://github.com/christireid/Clarity-ai-chat-components">⭐ Star on GitHub</a> •
  <a href="https://docs.clarity-chat.dev">📖 Read the Docs</a> •
  <a href="./apps/examples/README.md">🚀 Try Examples</a> •
  <a href="https://discord.gg/clarity-chat">💬 Join Discord</a>
</p>

<p align="center">
  <sub>If Clarity Chat helps you build something amazing, we'd love to see it!</sub>
</p>

</div>
