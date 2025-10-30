# Clarity Chat 🚀

> **Production-ready AI chat components for React** - Beautiful, accessible, and highly customizable.

[![NPM Version](https://img.shields.io/npm/v/@clarity-chat/react?style=flat&colorA=18181B&colorB=4A90E2)](https://www.npmjs.com/package/@clarity-chat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat&colorA=18181B&colorB=4A90E2)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat&colorA=18181B&colorB=4A90E2)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/codecov/c/github/christireid/Clarity-ai-chat-components?style=flat&colorA=18181B&colorB=4A90E2)](https://codecov.io/gh/christireid/Clarity-ai-chat-components)

**[Documentation](./docs/README.md)** • **[Examples](./examples/README.md)** • **[Storybook](https://storybook.clarity-chat.dev)** • **[Discord](https://discord.gg/clarity-chat)**

---

## ✨ Features

### 🎨 **Beautiful Design System**
- **11 Built-in Themes** (Ocean, Glassmorphism, Dark, and more)
- **Live Theme Editor** with real-time preview
- **Dark Mode** with smooth transitions
- **Fully Responsive** for all screen sizes
- **50+ Animations** powered by Framer Motion

### 🧩 **47+ Production-Ready Components**
- Rich message display with Markdown & code highlighting
- Streaming chat with SSE/WebSocket support
- Voice input with speech-to-text
- File upload with drag & drop
- Context management for documents
- Analytics dashboard & error tracking

### ♿ **WCAG 2.1 AAA Accessibility**
- Screen reader optimized
- Keyboard shortcuts (Shift+? for help)
- Focus management & ARIA labels
- AAA contrast ratios

### 🤖 **AI-Powered Features**
- Smart suggestions & auto-complete
- Content moderation & PII detection
- Sentiment analysis
- Token tracking & cost estimation
- 8 AI provider adapters (OpenAI, Anthropic, Azure, etc.)

### 📊 **Analytics & Monitoring**
- 7 analytics providers (GA4, Mixpanel, PostHog, Amplitude)
- 35+ predefined events
- A/B testing support
- Performance monitoring dashboard

### 🐛 **Enterprise Error Handling**
- 6 error tracking providers (Sentry, Rollbar, Bugsnag)
- Automatic retry with exponential backoff
- User feedback collection
- Detailed error reporting

---

## 🚀 Quick Start

### Installation

```bash
npm install @clarity-chat/react
```

### Basic Usage (5 Minutes)

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const [messages, setMessages] = useState([])

  return (
    <ThemeProvider theme={themes.ocean}>
      <ChatWindow
        messages={messages}
        onSendMessage={async (content) => {
          // Your AI integration here
          const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: content }),
          })
          // Handle response
        }}
      />
    </ThemeProvider>
  )
}
```

**[→ Full Quick Start Guide](./docs/getting-started/quick-start.md)**

---

## 📚 Documentation

### **Getting Started**
- [Installation](./docs/getting-started/installation.md)
- [Quick Start (5 min)](./docs/getting-started/quick-start.md)
- [First Component](./docs/getting-started/first-component.md)

### **Guides**
- [Theming System](./docs/guides/theming.md)
- [Voice Input](./docs/guides/voice-input.md)
- [Streaming Messages](./docs/guides/streaming.md)
- [Error Handling](./docs/guides/error-handling.md)
- [Analytics Integration](./docs/guides/analytics.md)
- [Accessibility](./docs/guides/accessibility.md)
- [Mobile Optimization](./docs/guides/mobile.md)

### **API Reference**
- [Components (47+)](./docs/api/components.md)
- [Hooks (25+)](./docs/api/hooks.md)
- [Utilities](./docs/api/utilities.md)
- [TypeScript Types](./docs/api/types.md)

### **Examples**
- [Example Gallery](./examples/README.md) - 9 working examples
- [OpenAI Integration](./examples/ai-assistant/)
- [Customer Support Bot](./examples/customer-support/)
- [Streaming Chat](./examples/streaming-chat/)

---

## 🎯 Feature Highlights

### **Voice Input**
```tsx
<VoiceInput
  onTranscript={(text) => sendMessage(text)}
  lang="en-US"
  autoSubmit
/>
```

### **Streaming Responses**
```tsx
const { streamMessage } = useStreaming()

await streamMessage('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: content }),
})
```

### **Error Recovery**
```tsx
const { executeWithRetry } = useErrorRecovery({
  maxRetries: 3,
  initialDelay: 1000,
})

await executeWithRetry(async () => {
  return await fetch('/api/chat')
})
```

### **Analytics Tracking**
```tsx
<AnalyticsProvider
  config={{
    providers: [createGoogleAnalyticsProvider('GA-ID')],
    autoTrack: { pageViews: true, errors: true },
  }}
>
  <ChatWindow {...props} />
</AnalyticsProvider>
```

---

## 📦 Packages

| Package | Description | Size |
|---------|-------------|------|
| [`@clarity-chat/react`](./packages/react) | Main component library | ~95KB |
| [`@clarity-chat/types`](./packages/types) | TypeScript definitions | ~8KB |
| [`@clarity-chat/primitives`](./packages/primitives) | Base UI components | ~25KB |
| [`@clarity-chat/error-handling`](./packages/error-handling) | Error recovery system | ~45KB |

---

## 🏗️ Project Structure

```
clarity-chat/
├── packages/
│   ├── react/           # Main library (32,650 LOC)
│   ├── types/           # TypeScript definitions
│   ├── primitives/      # Base components
│   └── error-handling/  # Error system
├── apps/
│   ├── storybook/       # Component documentation
│   └── docs/            # Documentation site
├── examples/            # 9 working examples
└── docs/                # Markdown documentation
```

---

## 🎨 Themes

```tsx
import { themes } from '@clarity-chat/react'

// 11 Built-in themes
themes.default       // Clean, professional
themes.dark          // Dark mode
themes.ocean         // Blue ocean vibes
themes.glassmorphism // Modern glass effect
themes.sunset        // Warm sunset colors
themes.forest        // Green nature theme
themes.corporate     // Professional business
themes.neon          // Cyberpunk neon
themes.minimal       // Ultra minimal
themes.warm          // Cozy warm tones
themes.cool          // Cool blue/gray
```

**[→ Custom Theme Guide](./docs/guides/theming.md)**

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Type checking
npm run typecheck
```

**Test Coverage:** 80%+ (target: 85%)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/architecture/contributing.md).

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

## 📊 Stats

- **32,650+** lines of TypeScript code
- **47** React components
- **25+** custom hooks
- **11** built-in themes
- **9** working examples
- **80%+** test coverage
- **WCAG 2.1 AAA** accessibility compliant

---

## 🗺️ Roadmap

### ✅ **Phase 1-4: Complete**
- Core chat components
- Streaming support
- Voice input
- Mobile optimization
- Glassmorphism theme
- Pre-built templates

### 🚧 **Phase 5: In Progress**
- [ ] Plugin system
- [ ] Real-time collaboration
- [ ] Advanced RAG features
- [ ] Video tutorials
- [ ] Landing page

**[→ Full Roadmap](./docs/architecture/roadmap.md)**

---

## 💡 Examples

### **OpenAI Integration**
```tsx
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const handleSend = async (content: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content }],
  })
  return response.choices[0].message.content
}
```

### **Anthropic Claude**
```tsx
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const handleSend = async (content: string) => {
  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: [{ role: 'user', content }],
  })
  return message.content[0].text
}
```

**[→ More Integration Examples](./examples/README.md)**

---

## 🌟 Showcase

Projects built with Clarity Chat:

- **[AI Code Assistant](https://example.com)** - Pair programming AI
- **[Customer Support Bot](https://example.com)** - 24/7 support automation
- **[Documentation Helper](https://example.com)** - Interactive docs

**[Submit your project](https://github.com/christireid/Clarity-ai-chat-components/discussions)**

---

## 📄 License

MIT © 2024 [Code & Clarity](https://codeclarity.ai)

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Radix UI](https://www.radix-ui.com/)
- [Vitest](https://vitest.dev/)

---

## 🔗 Links

- **Documentation:** [clarity-chat.dev](https://clarity-chat.dev)
- **Storybook:** [storybook.clarity-chat.dev](https://storybook.clarity-chat.dev)
- **Discord:** [Join Community](https://discord.gg/clarity-chat)
- **Twitter:** [@clarity_chat](https://twitter.com/clarity_chat)
- **GitHub:** [Repository](https://github.com/christireid/Clarity-ai-chat-components)

---

## 📞 Support

- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💡 [Feature Requests](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- 📧 [Email Support](mailto:support@codeclarity.ai)

---

<div align="center">

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**

[⭐ Star on GitHub](https://github.com/christireid/Clarity-ai-chat-components) • [📖 Read the Docs](./docs/README.md) • [🚀 Try Examples](./examples/README.md)

</div>
