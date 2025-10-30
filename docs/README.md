# Clarity Chat - Documentation Hub

> 🚀 **Production-ready AI chat components for React**

Welcome to the comprehensive documentation for **Clarity Chat** - a premium, enterprise-grade React component library for building AI-powered chat applications.

---

## 📚 Quick Navigation

### 🎯 **Getting Started**
- [Installation](./getting-started/installation.md) - Install and set up the library
- [Quick Start Guide](./getting-started/quick-start.md) - Build your first chat app in 5 minutes
- [First Component](./getting-started/first-component.md) - Understand the core concepts

### 📖 **Guides**
- [Theming System](./guides/theming.md) - Customize themes and create your own
- [Accessibility](./guides/accessibility.md) - WCAG 2.1 AAA compliance guide
- [Analytics Integration](./guides/analytics.md) - Track user interactions
- [Error Handling](./guides/error-handling.md) - Robust error recovery patterns
- [Voice Input](./guides/voice-input.md) - Speech-to-text integration
- [Mobile Optimization](./guides/mobile.md) - iOS and Android best practices
- [Streaming Messages](./guides/streaming.md) - Real-time AI responses
- [Performance](./guides/performance.md) - Optimize for scale

### 🔧 **API Reference**
- [Components API](./api/components.md) - All 47+ components documented
- [Hooks API](./api/hooks.md) - All 25+ custom hooks
- [Utilities API](./api/utilities.md) - Helper functions and tools
- [TypeScript Types](./api/types.md) - Complete type reference

### 💡 **Examples**
- [Example Gallery](./examples/README.md) - Browse all examples
- [Basic Chat](./examples/basic-chat.md) - Simple integration
- [AI Assistant](./examples/ai-assistant.md) - Advanced AI features
- [Customer Support Bot](./examples/support-bot.md) - Pre-built template
- [Streaming Chat](./examples/streaming.md) - Real-time responses
- [Backend Integrations](./examples/integrations.md) - OpenAI, Anthropic, Azure

### 🏗️ **Architecture**
- [System Overview](./architecture/overview.md) - High-level architecture
- [Design Decisions](./architecture/design-decisions.md) - Why we built it this way
- [Monorepo Structure](./architecture/monorepo.md) - Package organization
- [Contributing Guide](./architecture/contributing.md) - How to contribute

---

## 🎨 **What is Clarity Chat?**

Clarity Chat is a **comprehensive React component library** designed specifically for building AI-powered chat applications. It provides:

### ✨ **Core Features**

- **47+ Production-Ready Components** - Message UI, chat windows, file uploads, voice input
- **25+ Custom Hooks** - Streaming, error recovery, keyboard shortcuts, analytics
- **11 Built-in Themes** - Including glassmorphism with live theme editor
- **Complete Accessibility** - WCAG 2.1 AAA compliant with keyboard navigation
- **Analytics & Error Tracking** - 13 provider integrations (Sentry, GA4, Mixpanel, etc.)
- **AI Features** - Suggestions, moderation, sentiment analysis
- **Mobile-First** - iOS/Android keyboard handling, touch gestures
- **TypeScript-First** - 100% typed with strict mode

### 🚀 **Quick Preview**

```tsx
import { ChatWindow, ThemeProvider, themes } from '@clarity-chat/react'

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
            body: JSON.stringify({ message: content })
          })
          // Handle streaming response
        }}
      />
    </ThemeProvider>
  )
}
```

---

## 📦 **Packages**

The library is organized as a monorepo with multiple packages:

| Package | Description | Size |
|---------|-------------|------|
| `@clarity-chat/react` | Main component library | ~95KB |
| `@clarity-chat/types` | TypeScript definitions | ~8KB |
| `@clarity-chat/primitives` | Base UI components | ~25KB |
| `@clarity-chat/error-handling` | Error recovery system | ~45KB |

---

## 🎓 **Learning Path**

### **Beginner → Intermediate → Advanced**

1. **Start Here** (15 minutes)
   - Read [Quick Start Guide](./getting-started/quick-start.md)
   - Follow [First Component](./getting-started/first-component.md) tutorial
   - Run the [Basic Chat Example](./examples/basic-chat.md)

2. **Core Concepts** (1 hour)
   - Learn about [Theming](./guides/theming.md)
   - Understand [Message Operations](./api/hooks.md#usemessageoperations)
   - Explore [Streaming](./guides/streaming.md)

3. **Production Features** (2-3 hours)
   - Implement [Error Handling](./guides/error-handling.md)
   - Add [Analytics](./guides/analytics.md)
   - Optimize [Performance](./guides/performance.md)

4. **Advanced Topics** (3+ hours)
   - Build custom [Provider Integrations](./examples/integrations.md)
   - Create [Custom Themes](./guides/theming.md#custom-themes)
   - Implement [Voice Input](./guides/voice-input.md)
   - Master [Accessibility](./guides/accessibility.md)

---

## 🤝 **Community & Support**

- **📖 Documentation**: [clarity-chat.dev](https://clarity-chat.dev)
- **🎨 Storybook**: [storybook.clarity-chat.dev](https://storybook.clarity-chat.dev)
- **💬 Discord**: [Join our community](https://discord.gg/clarity-chat)
- **🐛 Issues**: [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- **🚀 Discussions**: [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

---

## 📊 **Project Statistics**

- **32,650+** lines of production code
- **47** React components
- **25+** custom hooks
- **80%+** test coverage
- **11** built-in themes
- **9** working examples
- **WCAG 2.1 AAA** accessibility

---

## 🗺️ **Next Steps**

Choose your path:

### 👨‍💻 **For Developers**
→ [Install the library](./getting-started/installation.md) and start building

### 🎨 **For Designers**
→ Explore the [Theming System](./guides/theming.md) and [Storybook](https://storybook.clarity-chat.dev)

### 🏢 **For Enterprise**
→ Review [Architecture](./architecture/overview.md) and [Security](./guides/security.md)

### 🤝 **For Contributors**
→ Read the [Contributing Guide](./architecture/contributing.md)

---

## 📄 **License**

MIT License - © 2024 Code & Clarity

---

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**
