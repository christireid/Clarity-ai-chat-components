---
layout: home

hero:
  name: Clarity Chat
  text: Enterprise-grade React AI Chat Components
  tagline: Build beautiful, production-ready AI chat interfaces in minutes
  image:
    src: /logo.svg
    alt: Clarity Chat
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/yourusername/clarity-chat

features:
  - icon: 🎨
    title: Beautiful UI Components
    details: 43 professionally designed chat components with modern aesthetics and smooth animations
  
  - icon: ⚡
    title: Model-Agnostic Adapters
    details: Switch between OpenAI, Anthropic, and Google AI in 3 lines of code with unified streaming interface
  
  - icon: 🔧
    title: Fully Customizable
    details: Extensive theming system with CSS variables and component overrides
  
  - icon: 📦
    title: Zero Config
    details: Works out of the box with sensible defaults and automatic optimizations
  
  - icon: 🎯
    title: TypeScript First
    details: Written in TypeScript with complete type definitions and IntelliSense support
  
  - icon: ♿
    title: Accessible
    details: WCAG 2.1 compliant with keyboard navigation and screen reader support
  
  - icon: 📱
    title: Responsive
    details: Mobile-first design that works beautifully on all screen sizes
  
  - icon: 🚀
    title: Production Ready
    details: Battle-tested with error boundaries, retry logic, and performance optimizations
  
  - icon: 🔌
    title: Framework Agnostic
    details: Works with Next.js, Remix, Vite, and any React framework
---

## Quick Start

Install the package:

```bash
npm install @clarity-chat/react
```

Use in your app:

```tsx
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  
  const handleSend = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      role: 'user', 
      content,
      timestamp: Date.now() 
    }])
    
    // Call your AI API...
  }
  
  return (
    <ChatWindow 
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Why Clarity Chat?

### 🏗️ Built for Production

Every component is battle-tested with comprehensive error handling, loading states, and edge cases covered. Ready to deploy to production without modifications.

### 🎯 Developer Experience

Intuitive API design with TypeScript support, comprehensive documentation, and 5 working demo applications to get you started quickly.

### 🔋 Batteries Included

- **Message Operations**: Edit, regenerate, branch, undo/redo
- **File Upload**: Drag-and-drop with validation
- **Context Management**: Documents, images, links
- **Token Tracking**: Real-time counting and cost estimation
- **Network Status**: Offline detection and reconnection
- **Streaming**: SSE and WebSocket support
- **Error Recovery**: Automatic retry with exponential backoff

### 📚 Comprehensive Documentation

- 23 Storybook stories with interactive examples
- 5 complete demo applications
- 25+ cookbook recipes
- Integration guides for Next.js, Remix, Vite
- API reference with TypeScript definitions

## What's Included

- **43 Chat Components**: ChatWindow, StreamingMessage, ModelSelector, ToolInvocationCard, CitationCard, and more
- **Model Adapters**: OpenAI, Anthropic, Google AI with cost estimation
- **21 React Hooks**: useChat, useStreamingChat, useMessageOperations, etc.
- **Type Definitions**: Complete TypeScript types and interfaces
- **77 Storybook Stories**: Interactive component documentation
- **Demo Applications**: 5 working examples
- **Cookbook**: 25+ recipes for common use cases

## Next Steps

<div class="vp-doc">

- [Getting Started](/guide/getting-started) - Learn the basics
- [Quick Start](/guide/quick-start) - Build your first chat app
- [Components](/guide/components) - Explore all components
- [API Reference](/api/components) - Complete API documentation
- [Examples](/examples/) - See working demos
- [Cookbook](/cookbook) - Recipes for common patterns

</div>
