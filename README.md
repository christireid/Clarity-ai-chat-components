# 🚀 Clarity Chat

<div align="center">

**Premium AI Chat Component Library for React**

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react.svg)](https://www.npmjs.com/package/@clarity-chat/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/coverage-80%25-green)](./docs/architecture/testing.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./docs/architecture/contributing.md)

[Documentation](https://docs/README.md) • [Examples](./examples) • [Storybook](https://storybook.clarity-chat.dev) • [Discord](https://discord.gg/clarity-chat)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 **Beautiful & Customizable**
- **47+ Production Components**
- **11 Built-in Themes** (including Glassmorphism)
- **Live Theme Editor** with preview
- **Dark Mode** with smooth transitions
- **Fully Responsive** design

</td>
<td width="50%">

### ⚡ **Performance Optimized**
- **Virtualized Lists** for 1000+ messages
- **Code Splitting** ready
- **Tree-Shakeable** exports
- **< 100KB** gzipped bundle
- **Real-time Streaming** support

</td>
</tr>
<tr>
<td width="50%">

### ♿ **Accessible by Default**
- **WCAG 2.1 AAA** compliant
- **Keyboard Navigation** with shortcuts
- **Screen Reader** optimized
- **Focus Management** built-in
- **High Contrast** modes

</td>
<td width="50%">

### 🤖 **AI-Powered Features**
- **Smart Suggestions** with context
- **Content Moderation** filters
- **Sentiment Analysis** real-time
- **Voice Input** (speech-to-text)
- **8 AI Provider** integrations

</td>
</tr>
<tr>
<td width="50%">

### 📊 **Analytics & Monitoring**
- **7 Analytics Providers** (GA4, Mixpanel, etc.)
- **35+ Predefined Events**
- **A/B Testing** support
- **Performance Dashboard**
- **Error Tracking** (Sentry, Rollbar, etc.)

</td>
<td width="50%">

### 🛡️ **Production Ready**
- **100% TypeScript** with strict mode
- **80%+ Test Coverage**
- **Comprehensive Error Handling**
- **Mobile Optimized** (iOS & Android)
- **Enterprise Battle-Tested**

</td>
</tr>
</table>

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
import { useState } from 'react'

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
          // Handle response
        }}
      />
    </ThemeProvider>
  )
}
```

**[📖 Full Quick Start Guide →](./docs/getting-started/quick-start.md)**

---

## 🎨 Live Demo

Try our interactive examples:

- **[Basic Chat](./examples/basic-chat)** - Simple integration
- **[AI Assistant](./examples/ai-assistant)** - Advanced features
- **[Customer Support](./examples/customer-support)** - Pre-built template
- **[Streaming Chat](./examples/streaming-chat)** - Real-time responses
- **[View All Examples →](./examples)**

---

## 📦 What's Inside?

### **Packages**

| Package | Description | Bundle Size |
|---------|-------------|-------------|
| [`@clarity-chat/react`](./packages/react) | Main component library | ~95KB gzipped |
| [`@clarity-chat/types`](./packages/types) | TypeScript definitions | ~8KB gzipped |
| [`@clarity-chat/primitives`](./packages/primitives) | Base UI components | ~25KB gzipped |
| [`@clarity-chat/error-handling`](./packages/error-handling) | Error recovery system | ~45KB gzipped |

### **Key Statistics**

- 📝 **32,650+** lines of production code
- 🎨 **47** React components
- 🪝 **25+** custom hooks
- 🎭 **11** built-in themes
- 💡 **9** working examples
- ✅ **80%+** test coverage
- ♿ **WCAG 2.1 AAA** accessibility

---

## 🎯 Feature Highlights

### 🎤 **Voice Input**
```tsx
import { VoiceInput } from '@clarity-chat/react'

<VoiceInput 
  onTranscript={(text) => handleSend(text)}
  lang="en-US"
  autoSubmit 
/>
```

### 📱 **Mobile Keyboard Handling**
```tsx
import { useMobileKeyboard } from '@clarity-chat/react'

const { isKeyboardVisible, keyboardHeight } = useMobileKeyboard({
  onKeyboardShow: () => console.log('Keyboard opened'),
  onKeyboardHide: () => console.log('Keyboard closed'),
})
```

### 📊 **Analytics Integration**
```tsx
import { AnalyticsProvider, createGoogleAnalyticsProvider } from '@clarity-chat/react'

<AnalyticsProvider
  config={{
    providers: [
      createGoogleAnalyticsProvider(GA_TRACKING_ID)
    ],
    autoTrack: { pageViews: true, errors: true }
  }}
>
  <App />
</AnalyticsProvider>
```

### 🛡️ **Error Handling**
```tsx
import { ErrorBoundary, useAsyncError } from '@clarity-chat/react'

function Chat() {
  const { executeAsync, retryCount } = useAsyncError()
  
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ChatWindow {...props} />
    </ErrorBoundary>
  )
}
```

---

## 📚 Documentation

### **Getting Started**
- [Installation Guide](./docs/getting-started/installation.md) - Setup in your project
- [Quick Start](./docs/getting-started/quick-start.md) - Build in 5 minutes
- [First Component](./docs/getting-started/first-component.md) - Core concepts

### **Guides**
- [Theming System](./docs/guides/theming.md) - Customize appearance
- [Accessibility](./docs/guides/accessibility.md) - WCAG compliance
- [Analytics](./docs/guides/analytics.md) - Track user behavior
- [Error Handling](./docs/guides/error-handling.md) - Robust recovery
- [Performance](./docs/guides/performance.md) - Optimization tips
- [Mobile](./docs/guides/mobile.md) - iOS & Android best practices
- [Streaming](./docs/guides/streaming.md) - Real-time responses
- [Voice Input](./docs/guides/voice-input.md) - Speech integration

### **API Reference**
- [Components API](./docs/api/components.md) - All 47+ components
- [Hooks API](./docs/api/hooks.md) - All 25+ hooks
- [Utilities API](./docs/api/utilities.md) - Helper functions
- [Types Reference](./docs/api/types.md) - TypeScript definitions

### **Architecture**
- [System Overview](./docs/architecture/overview.md) - Architecture deep dive
- [Design Decisions](./docs/architecture/design-decisions.md) - Why we built it this way
- [Contributing Guide](./docs/architecture/contributing.md) - How to contribute

---

## 🏗️ Development

### **Prerequisites**
- Node.js >= 18.0.0
- npm >= 9.0.0

### **Setup**

```bash
# Clone repository
git clone https://github.com/christireid/Clarity-ai-chat-components.git
cd Clarity-ai-chat-components

# Install dependencies
npm install

# Start development
npm run dev

# Run Storybook
npm run storybook

# Run tests
npm test

# Build packages
npm run build
```

### **Project Structure**

```
Clarity-ai-chat-components/
├── packages/           # Component packages
│   ├── react/          # Main library
│   ├── types/          # TypeScript types
│   ├── primitives/     # Base components
│   └── error-handling/ # Error system
├── apps/
│   ├── storybook/      # Interactive docs
│   └── docs/           # Documentation site
├── examples/           # 9 working examples
└── docs/               # Documentation
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/architecture/contributing.md) for details.

### **Ways to Contribute**

- 🐛 [Report bugs](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💡 [Suggest features](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- 📖 [Improve documentation](./docs)
- 🎨 [Submit themes](./packages/react/src/theme)
- ✨ [Add components](./packages/react/src/components)

---

## 🗺️ Roadmap

### ✅ **Phase 1-4: Complete**
- Core chat components
- Streaming support
- Error handling system
- Analytics integration
- Accessibility features
- Voice input
- Mobile optimization
- Pre-built templates

### 🔜 **Phase 5: Upcoming**
- [ ] Plugin system for extensibility
- [ ] Real-time collaboration
- [ ] Multi-modal support (image, audio, video)
- [ ] RAG (Retrieval Augmented Generation)
- [ ] WebRTC integration
- [ ] Offline support with Service Workers
- [ ] Advanced theming with Figma integration

---

## 🏢 Who's Using Clarity Chat?

*Are you using Clarity Chat? [Let us know!](https://github.com/christireid/Clarity-ai-chat-components/discussions)*

---

## 📄 License

MIT License - © 2024 Code & Clarity

See [LICENSE](./LICENSE) for details.

---

## 💬 Community & Support

- 📖 **Documentation**: [docs/README.md](./docs/README.md)
- 🎨 **Storybook**: [storybook.clarity-chat.dev](https://storybook.clarity-chat.dev)
- 💬 **Discord**: [Join our community](https://discord.gg/clarity-chat)
- 🐛 **Issues**: [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- 🐦 **Twitter**: [@clarity_chat](https://twitter.com/clarity_chat)

---

## 🌟 Show Your Support

If you find Clarity Chat useful, please:

- ⭐ **Star this repository**
- 🐦 **Share on Twitter**
- 📝 **Write a blog post**
- 🎥 **Create a tutorial**

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- [React](https://react.dev) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Primitives
- [Vitest](https://vitest.dev/) - Testing
- [Turborepo](https://turbo.build/repo) - Monorepo

---

<div align="center">

**Built with ❤️ by [Code & Clarity](https://codeclarity.ai)**

*Creating products developers love to use*

[Website](https://codeclarity.ai) • [Twitter](https://twitter.com/code_clarity) • [LinkedIn](https://linkedin.com/company/code-clarity)

</div>
