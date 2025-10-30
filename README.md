# Clarity Chat 🚀

<div align="center">

![Clarity Chat Logo](https://via.placeholder.com/800x200/4A90E2/ffffff?text=Clarity+Chat)

**Premium AI Chat Component Library for React**

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react)](https://www.npmjs.com/package/@clarity-chat/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/codecov/c/github/christireid/Clarity-ai-chat-components)](https://codecov.io/gh/christireid/Clarity-ai-chat-components)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@clarity-chat/react)](https://bundlephobia.com/package/@clarity-chat/react)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/christireid/Clarity-ai-chat-components/blob/main/CONTRIBUTING.md)

[Documentation](./docs/README.md) • [Examples](./examples) • [Storybook](https://storybook.clarity-chat.dev) • [Discord](https://discord.gg/clarity-chat)

</div>

---

## ✨ Features at a Glance

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'

// 🎯 5 minutes to production
<ThemeProvider theme={themes.glassmorphism}>
  <ChatWindow messages={messages} onSendMessage={handleSend} />
</ThemeProvider>
```

### 🎨 **Design System**
- 🎭 **11 Built-in Themes** - Default, Dark, Ocean, Sunset, Glassmorphism, and more
- 🎨 **Live Theme Editor** - Customize colors in real-time
- 🌓 **Dark Mode** - Smooth transitions with system detection
- 📱 **Fully Responsive** - Mobile-first design
- ♿ **WCAG 2.1 AAA** - Complete accessibility compliance

### 🧩 **47+ Production Components**
- 💬 **Rich Message Display** - Markdown, code highlighting, LaTeX support
- 🎤 **Voice Input** - Speech-to-text (20+ languages)
- 📎 **File Upload** - Drag & drop with previews
- 🔄 **Streaming Support** - SSE and WebSocket
- 🎯 **Smart Suggestions** - Context-aware auto-complete
- 📊 **Analytics Dashboard** - Built-in performance metrics

### 🪝 **25+ Custom Hooks**
- `useChat` - Complete chat state management
- `useStreaming` - Real-time AI responses
- `useErrorRecovery` - Auto-retry with exponential backoff
- `useVoiceInput` - Voice-to-text integration
- `useMobileKeyboard` - iOS/Android keyboard handling
- `useTokenTracker` - Cost estimation and tracking

### 🔌 **Integrations**
- **7 Analytics Providers** - GA4, Mixpanel, PostHog, Amplitude, Segment
- **6 Error Tracking** - Sentry, Rollbar, Bugsnag, Custom API
- **8 AI Providers** - OpenAI, Anthropic, Azure, Cohere, Hugging Face
- **Built-in Adapters** - Drop-in compatibility

---

## 🚀 Quick Start

### Installation

```bash
npm install @clarity-chat/react
```

### Basic Usage (30 seconds)

```tsx
import { ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'
import { useState } from 'react'

function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ])

  const handleSend = async (content: string) => {
    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])

    // Call your AI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    })
    const data = await response.json()

    // Add AI response
    setMessages((prev) => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.message,
      timestamp: new Date(),
    }])
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

### Production Setup (5 minutes)

```tsx
import {
  ChatWindow,
  ThemeProvider,
  ErrorBoundaryEnhanced,
  AnalyticsProvider,
  themes,
  createGoogleAnalyticsProvider,
} from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <AnalyticsProvider
        config={{
          providers: [createGoogleAnalyticsProvider('GA-XXXXX')],
          autoTrack: { pageViews: true, errors: true },
        }}
      >
        <ErrorBoundaryEnhanced enableFeedback>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSend}
            enableVoiceInput
            enableFileUpload
          />
        </ErrorBoundaryEnhanced>
      </AnalyticsProvider>
    </ThemeProvider>
  )
}
```

**[→ View Full Quick Start Guide](./docs/getting-started/quick-start.md)**

---

## 📦 What's Inside?

### Monorepo Structure

```
clarity-chat/
├── 📦 packages/
│   ├── react/              # Main library (32,650 LOC)
│   ├── types/              # TypeScript definitions
│   ├── primitives/         # Base UI components
│   ├── error-handling/     # Error recovery system
│   ├── dev-tools/          # Developer utilities
│   └── cli/                # CLI tools
│
├── 📱 apps/
│   ├── storybook/          # Interactive docs
│   └── docs/               # Documentation site
│
└── 💡 examples/
    ├── basic-chat/         # Simple integration
    ├── ai-assistant/       # Advanced features
    ├── customer-support/   # Pre-built template
    └── 6 more examples...
```

### Project Statistics

| Metric | Value |
|--------|-------|
| **Lines of Code** | 32,650+ |
| **Components** | 47 |
| **Custom Hooks** | 25+ |
| **Built-in Themes** | 11 |
| **Test Coverage** | 80%+ |
| **Bundle Size** | ~95KB (gzipped) |
| **TypeScript** | 100% |

---

## 🎯 Key Features Deep Dive

### 1. Theming System

```tsx
import { ThemeProvider, themes, createTheme } from '@clarity-chat/react'

// Use built-in theme
<ThemeProvider theme={themes.glassmorphism}>
  <ChatWindow {...props} />
</ThemeProvider>

// Or create custom theme
const myTheme = createTheme({
  name: 'Custom',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    // ... more colors
  },
})
```

**[→ Complete Theming Guide](./docs/guides/theming.md)**

---

### 2. Voice Input

```tsx
import { VoiceInput } from '@clarity-chat/react'

<VoiceInput
  onTranscript={(text) => sendMessage(text)}
  lang="en-US"
  autoSubmit
/>
```

**Supported:** 20+ languages, Chrome/Safari, iOS 14.5+

**[→ Voice Input Guide](./docs/guides/voice-input.md)**

---

### 3. Streaming Responses

```tsx
import { useStreaming } from '@clarity-chat/react'

const { streamMessage, isStreaming, streamedContent } = useStreaming({
  onComplete: (fullText) => console.log('Done:', fullText),
})

await streamMessage('/api/chat-stream', {
  method: 'POST',
  body: JSON.stringify({ message: 'Hello' }),
})
```

**[→ Streaming Guide](./docs/guides/streaming.md)**

---

### 4. Error Recovery

```tsx
import { useErrorRecovery } from '@clarity-chat/react'

const { executeWithRetry, isRetrying } = useErrorRecovery({
  maxRetries: 3,
  retryDelay: 1000,
  backoffMultiplier: 2, // 1s, 2s, 4s
})

await executeWithRetry(async () => {
  const response = await fetch('/api/chat')
  if (!response.ok) throw new Error('API Error')
  return response.json()
})
```

**[→ Error Handling Guide](./docs/guides/error-handling.md)**

---

### 5. Analytics Integration

```tsx
import {
  AnalyticsProvider,
  useAnalytics,
  createGoogleAnalyticsProvider,
  createMixpanelProvider,
} from '@clarity-chat/react'

<AnalyticsProvider
  config={{
    providers: [
      createGoogleAnalyticsProvider('GA-ID'),
      createMixpanelProvider('MX-TOKEN'),
    ],
    autoTrack: {
      pageViews: true,
      errors: true,
      messagesSent: true,
    },
  }}
>
  <App />
</AnalyticsProvider>

// In components
const { trackEvent } = useAnalytics()
trackEvent('custom_event', { category: 'engagement' })
```

**Supported:** GA4, Mixpanel, PostHog, Amplitude, Segment, Custom API

**[→ Analytics Guide](./docs/guides/analytics.md)**

---

## 📚 Documentation

### 🎓 **Learning Path**

1. **[Installation](./docs/getting-started/installation.md)** - Set up in your project
2. **[Quick Start](./docs/getting-started/quick-start.md)** - First chat app in 5 minutes
3. **[Core Concepts](./docs/getting-started/first-component.md)** - Understand the basics
4. **[API Reference](./docs/api/components.md)** - Complete component docs
5. **[Examples](./examples/README.md)** - Real-world integrations

### 📖 **Guides**

- [Theming System](./docs/guides/theming.md)
- [Accessibility](./docs/guides/accessibility.md)
- [Analytics Integration](./docs/guides/analytics.md)
- [Error Handling](./docs/guides/error-handling.md)
- [Voice Input](./docs/guides/voice-input.md)
- [Mobile Optimization](./docs/guides/mobile.md)
- [Streaming Messages](./docs/guides/streaming.md)
- [Performance](./docs/guides/performance.md)

### 🔧 **API Reference**

- [Components API](./docs/api/components.md) - All 47 components
- [Hooks API](./docs/api/hooks.md) - All 25+ hooks
- [Utilities API](./docs/api/utilities.md) - Helper functions
- [TypeScript Types](./docs/api/types.md) - Complete types

### 🏗️ **Architecture**

- [System Overview](./docs/architecture/overview.md)
- [Design Decisions](./docs/architecture/design-decisions.md)
- [Monorepo Structure](./docs/architecture/monorepo.md)
- [Contributing Guide](./docs/architecture/contributing.md)

---

## 💡 Examples

### 9 Working Examples

1. **[Basic Chat](./examples/basic-chat)** - Simple integration
2. **[AI Assistant](./examples/ai-assistant)** - Advanced AI features
3. **[Customer Support](./examples/customer-support)** - Pre-built template
4. **[Streaming Chat](./examples/streaming-chat)** - Real-time responses
5. **[Multi-User Chat](./examples/multi-user-chat)** - Collaborative chat
6. **[RAG Workbench](./examples/rag-workbench-demo)** - Document Q&A
7. **[Model Comparison](./examples/model-comparison-demo)** - Compare AI models
8. **[Analytics Console](./examples/analytics-console-demo)** - Analytics demo
9. **[Examples Showcase](./examples/examples-showcase)** - All features

**[→ Browse All Examples](./examples/README.md)**

---

## 🔌 Integrations

### AI Providers

```tsx
import {
  createOpenAIAdapter,
  createAnthropicAdapter,
  createAzureOpenAIAdapter,
} from '@clarity-chat/react/adapters'

// OpenAI
const openai = createOpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
})

// Anthropic Claude
const claude = createAnthropicAdapter({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus',
})

// Azure OpenAI
const azure = createAzureOpenAIAdapter({
  apiKey: process.env.AZURE_OPENAI_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
})
```

**Supported:** OpenAI, Anthropic, Azure OpenAI, Cohere, Hugging Face, Custom

**[→ Integration Guide](./docs/examples/integrations.md)**

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

**Test Coverage:** 80%+ across all packages

---

## 🚢 Deployment

### Next.js

```tsx
// app/page.tsx
'use client'
import { ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return <ChatWindow {...props} />
}
```

### Vite

```tsx
// src/main.tsx
import '@clarity-chat/react/styles.css'
import App from './App'
// ...
```

**[→ Deployment Guide](./docs/guides/deployment.md)**

---

## 🤝 Contributing

We welcome contributions! Please see:

- [Contributing Guide](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Development Setup](./docs/architecture/contributing.md)

---

## 📄 License

MIT © 2024 [Code & Clarity](https://codeclarity.ai)

See [LICENSE](./LICENSE) for details.

---

## 🌟 Roadmap

### ✅ Completed (Phases 1-4)
- Core chat components and hooks
- 11 built-in themes with live editor
- Voice input and mobile optimization
- Analytics and error tracking
- Accessibility (WCAG 2.1 AAA)
- Pre-built templates
- Comprehensive documentation

### 🚧 Phase 5 (In Progress)
- [ ] Plugin system architecture
- [ ] Advanced AI features (RAG, agents)
- [ ] Real-time collaboration
- [ ] Video tutorials
- [ ] Figma design system

### 🔮 Future
- [ ] Offline support with service workers
- [ ] Multi-modal (image, audio, video)
- [ ] Mobile SDK (React Native)
- [ ] Desktop app (Electron)

**[→ Full Roadmap](./ROADMAP.md)**

---

## 💬 Community & Support

- **📖 Documentation:** [docs/](./docs)
- **🎨 Storybook:** [storybook.clarity-chat.dev](https://storybook.clarity-chat.dev)
- **💬 Discord:** [Join our community](https://discord.gg/clarity-chat)
- **🐛 Issues:** [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **💡 Discussions:** [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- **🐦 Twitter:** [@clarity_chat](https://twitter.com/clarity_chat)

---

## 🙏 Acknowledgments

Built with these amazing technologies:

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Primitives
- [Vitest](https://vitest.dev/) - Testing
- [Turborepo](https://turbo.build/) - Monorepo management

---

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=christireid/Clarity-ai-chat-components&type=Date)](https://star-history.com/#christireid/Clarity-ai-chat-components&Date)

---

<div align="center">

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**

[Documentation](./docs/README.md) • [Examples](./examples) • [Contributing](./CONTRIBUTING.md)

</div>
