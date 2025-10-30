# Clarity Chat 🚀

> **Premium AI Chat Components for React** - Production-ready, accessible, and beautiful.

[![NPM Version](https://img.shields.io/npm/v/@clarity-chat/react?style=flat-square)](https://www.npmjs.com/package/@clarity-chat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Test Coverage](https://img.shields.io/codecov/c/github/christireid/Clarity-ai-chat-components?style=flat-square)](https://codecov.io/gh/christireid/Clarity-ai-chat-components)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@clarity-chat/react?style=flat-square)](https://bundlephobia.com/package/@clarity-chat/react)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

**A comprehensive, enterprise-grade React component library for building AI-powered chat applications.**

[📚 Documentation](./docs/README.md) • [🎨 Storybook](https://storybook.clarity-chat.dev) • [💬 Discord](https://discord.gg/clarity-chat) • [🎯 Examples](./examples)

---

## ✨ **Highlights**

- **🎨 47+ Production Components** - Message UI, chat windows, voice input, file uploads
- **🪝 25+ Custom Hooks** - Streaming, error recovery, analytics, accessibility
- **🎭 11 Built-in Themes** - Including glassmorphism with live editor
- **♿ WCAG 2.1 AAA** - Complete accessibility with keyboard navigation
- **📊 Analytics & Error Tracking** - 13 provider integrations (Sentry, GA4, Mixpanel)
- **🤖 AI Features** - Smart suggestions, moderation, sentiment analysis
- **📱 Mobile-First** - iOS/Android keyboard handling, touch gestures
- **⚡ Performance** - Virtualized lists for 1000+ messages
- **🔒 TypeScript-First** - 100% typed with strict mode
- **📦 32,650 LOC** - Battle-tested production code

---

## 🚀 **Quick Start**

### **Installation**

```bash
npm install @clarity-chat/react
```

### **Basic Usage** (2 minutes)

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
        }}
      />
    </ThemeProvider>
  )
}
```

**[➡️ Full Quick Start Guide](./docs/getting-started/quick-start.md)**

---

## 🎯 **Key Features**

### **🎨 Beautiful Design System**
- 11 built-in themes (default, dark, ocean, sunset, glassmorphism, etc.)
- Live theme editor with color pickers
- Dark mode with smooth transitions
- Responsive design for all screen sizes
- 50+ Framer Motion animations

### **🧩 Comprehensive Components**
- Message components with markdown & code highlighting
- Advanced input with autocomplete & file upload
- Voice input with speech-to-text
- Project management & conversation organization
- Knowledge base auto-generation
- Performance dashboard with metrics
- Error feedback forms

### **♿ Accessibility Excellence**
- WCAG 2.1 AAA compliance
- Screen reader optimization
- Keyboard shortcuts system (Shift+?)
- Focus management & contrast checking
- Full ARIA support

### **📊 Analytics & Monitoring**
- 7 analytics providers (GA4, Mixpanel, PostHog, Amplitude, Segment)
- 35+ predefined events
- Auto-tracking for interactions
- A/B testing support
- Performance monitoring dashboard

### **🐛 Error Handling**
- 6 error tracking providers (Sentry, Rollbar, Bugsnag)
- 10 specialized error classes
- Automatic retry with exponential backoff
- User feedback collection
- Offline error storage

### **🤖 AI Features**
- Smart suggestions & quick replies
- Content moderation (profanity filter, PII detection)
- Sentiment analysis with confidence scoring
- Auto-complete with context awareness
- 8 built-in AI providers

### **⚡ Performance**
- Virtualized lists for 1000+ messages
- Code splitting & tree-shaking
- Bundle size monitoring (<100KB)
- Memory leak detection
- Render performance metrics

---

## 📦 **What's Inside**

### **Packages**

| Package | Description | Size |
|---------|-------------|------|
| `@clarity-chat/react` | Main component library | ~95KB |
| `@clarity-chat/types` | TypeScript definitions | ~8KB |
| `@clarity-chat/primitives` | Base UI components | ~25KB |
| `@clarity-chat/error-handling` | Error recovery system | ~45KB |

### **Project Statistics**

- **32,650** lines of production code
- **47** React components
- **25+** custom hooks
- **11** built-in themes
- **9** working examples
- **80%+** test coverage
- **100%** TypeScript

---

## 📚 **Documentation**

### **Getting Started**
- [Installation](./docs/getting-started/installation.md)
- [Quick Start Guide](./docs/getting-started/quick-start.md) (5 minutes)
- [First Component](./docs/getting-started/first-component.md)

### **Guides**
- [Theming System](./docs/guides/theming.md)
- [Accessibility](./docs/guides/accessibility.md)
- [Analytics Integration](./docs/guides/analytics.md)
- [Error Handling](./docs/guides/error-handling.md)
- [Voice Input](./docs/guides/voice-input.md)
- [Mobile Optimization](./docs/guides/mobile.md)
- [Streaming Messages](./docs/guides/streaming.md)
- [Performance](./docs/guides/performance.md)

### **API Reference**
- [Components API](./docs/api/components.md)
- [Hooks API](./docs/api/hooks.md)
- [Utilities API](./docs/api/utilities.md)

### **Examples**
- [Basic Chat](./examples/basic-chat) - Simple integration
- [AI Assistant](./examples/ai-assistant) - Advanced features
- [Customer Support](./examples/customer-support) - Pre-built template
- [Streaming Chat](./examples/streaming-chat) - Real-time responses
- [+ 5 more examples](./examples)

---

## 🎨 **Live Demos**

Try our interactive examples:

1. **[Basic Chat Demo](https://clarity-chat-basic.vercel.app)** - Simple chat interface
2. **[Theme Showcase](https://clarity-chat-themes.vercel.app)** - All 11 themes
3. **[Voice Input Demo](https://clarity-chat-voice.vercel.app)** - Speech-to-text
4. **[Full Features](https://clarity-chat-demo.vercel.app)** - All features enabled

---

## 🏗️ **Architecture**

```
Clarity-ai-chat-components/
├── packages/
│   ├── react/           # Main library (32,650 LOC)
│   ├── types/           # TypeScript definitions
│   ├── primitives/      # Base UI components
│   └── error-handling/  # Error recovery system
├── apps/
│   ├── storybook/       # Interactive docs
│   └── docs/            # VitePress docs site
├── examples/            # 9 working examples
└── docs/                # Markdown documentation
```

**[➡️ Full Architecture Overview](./docs/architecture/overview.md)**

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](./docs/architecture/contributing.md).

### **Development Setup**

```bash
# Clone repository
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# Install dependencies
npm install

# Start Storybook
npm run storybook

# Run tests
npm run test

# Build packages
npm run build
```

---

## 🗺️ **Roadmap**

### ✅ **Phase 1-4: Complete**
- Core components & hooks
- Theming system
- Analytics & error tracking
- Voice input & mobile support
- Pre-built templates

### 🚧 **Phase 5: In Progress**
- [ ] Plugin system
- [ ] Real-time collaboration
- [ ] Advanced AI features (RAG, multi-modal)
- [ ] Video tutorials
- [ ] Landing page

---

## 📊 **Browser Support**

| Browser | Version |
|---------|---------|
| Chrome | ✅ Last 2 versions |
| Firefox | ✅ Last 2 versions |
| Safari | ✅ Last 2 versions |
| Edge | ✅ Last 2 versions |
| iOS Safari | ✅ 14.5+ |
| Chrome Android | ✅ Last 2 versions |

---

## 📄 **License**

MIT License - © 2024 Code & Clarity

See [LICENSE](LICENSE) for details.

---

## 🙏 **Acknowledgments**

Built with these amazing open-source projects:
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [Vitest](https://vitest.dev/) - Testing framework

---

## 🌟 **Support**

If you find Clarity Chat useful, please:
- ⭐ Star this repository
- 🐦 Follow us on [Twitter](https://twitter.com/codeclarity)
- 💬 Join our [Discord community](https://discord.gg/clarity-chat)
- 📝 Share your projects built with Clarity Chat

---

## 📞 **Contact**

- **Website**: [codeclarity.ai](https://codeclarity.ai)
- **Email**: team@codeclarity.ai
- **Discord**: [Join community](https://discord.gg/clarity-chat)
- **Twitter**: [@codeclarity](https://twitter.com/codeclarity)

---

<div align="center">

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**

[📚 Docs](./docs/README.md) • [🎨 Storybook](https://storybook.clarity-chat.dev) • [💬 Discord](https://discord.gg/clarity-chat) • [🐛 Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

</div>
