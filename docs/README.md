# Clarity Chat Documentation

**Complete AI Chat Component Library** - Production-ready React components and hooks for building sophisticated AI chat interfaces.

---

## 📚 Documentation

### Getting Started
- **[Quick Start Guide](./quick-start.md)** - Get up and running in 5 minutes
- **[Choosing the Right Hook](./guides/choosing-hooks.md)** ⭐ **START HERE** - Decision tree for 95+ hooks
- **[Choosing the Right Component](./guides/choosing-components.md)** - Component selection guide

### Core Concepts
- **[Architecture Overview](./guides/architecture.md)** - System design and patterns
- **[Token Optimization](./guides/token-optimization.md)** - Save 50-70% on AI costs automatically
- **[Memory Management](./guides/memory.md)** - Conversation context and history
- **[Streaming](./guides/streaming.md)** - Real-time AI responses
- **[Error Handling](./guides/error-handling.md)** - Robust failure recovery

### API Reference
- **[All Hooks](./api/hooks/README.md)** - Complete reference for 95+ hooks
- **[All Components](./api/components/README.md)** - Complete reference for 183+ components
- **[TypeScript Types](./api/types.md)** - Type definitions and interfaces

### Integration Guides
- **[Token Optimization Integration](./integration/token-optimization.md)** - Step-by-step setup
- **[Memory Integration](./integration/memory.md)** - Add conversation memory
- **[Streaming Setup](./integration/streaming.md)** - SSE and WebSocket configuration
- **[Accessibility](./integration/accessibility.md)** - WCAG 2.1 AA compliance
- **[Error Boundaries](./integration/error-boundaries.md)** - Production error handling

### Advanced
- **[RAG Pipelines](./advanced/rag.md)** - Retrieval-augmented generation
- **[Custom Adapters](./advanced/adapters.md)** - Add custom AI providers
- **[Performance Optimization](./advanced/performance.md)** - Scale to production
- **[Security](./advanced/security.md)** - Best practices and hardening

### Examples & Recipes
- **[Examples Gallery](./examples/README.md)** - 20+ working examples
- **[Cookbook](./cookbook/README.md)** - Copy-paste recipes
- **[Common Patterns](./patterns/README.md)** - Reusable patterns

### Reference
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions
- **[Migration Guide](./migration.md)** - Upgrading from older versions
- **[FAQ](./faq.md)** - Frequently asked questions
- **[Changelog](./changelog.md)** - Version history

---

## 🚀 Quick Links

**New to Clarity Chat?**
1. Read the [Quick Start Guide](./quick-start.md) (5 min)
2. Follow the [Choosing the Right Hook](./guides/choosing-hooks.md) guide
3. Try an [example](./examples/README.md)
4. Join our [Discord](https://discord.gg/clarity-chat) for help

**Building a Feature?**
- Need streaming? → [Streaming Guide](./guides/streaming.md)
- Need to save costs? → [Token Optimization](./guides/token-optimization.md)
- Need memory? → [Memory Guide](./guides/memory.md)
- Need error handling? → [Error Handling Guide](./guides/error-handling.md)

**Looking for Something?**
- Browse [all hooks](./api/hooks/README.md) (95+ hooks)
- Browse [all components](./api/components/README.md) (183+ components)
- Search [examples](./examples/README.md)

---

## 💡 Key Features

### 🎯 Smart Defaults
Token optimization enabled by default - save 50-70% on AI costs automatically.

### 🔄 Production-Ready Streaming
SSE and WebSocket support with automatic reconnection and error recovery.

### 🧠 Advanced Memory
Episodic and semantic memory with decay curves and importance scoring.

### ♿ Accessible
WCAG 2.1 AA compliant with full keyboard navigation and screen reader support.

### 📦 180+ Components
Pre-built UI components for every use case - from simple chat to advanced dashboards.

### 🎣 95+ Hooks
Composable hooks for streaming, tokens, memory, caching, and more.

### 🔒 Secure
Built-in XSS protection, input sanitization, and content moderation.

### 📊 Observable
Built-in metrics, logging, and performance monitoring.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Application Components (Your Code)   │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│   High-Level Hooks (useClarityChat)     │ ← Start here
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│  Feature Hooks (useStreaming, useTokens)│
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│    Primitive Hooks & Utilities          │
└────────────────┬────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│      AI Provider Adapters               │
│   (OpenAI, Anthropic, Google, Custom)   │
└─────────────────────────────────────────┘
```

---

## 📖 Documentation Philosophy

### Complete Coverage
Every hook and component is documented with:
- Purpose and use cases
- API reference
- TypeScript types
- Working examples
- Best practices
- Common pitfalls

### Decision-Driven
We help you choose the right tool:
- "Which hook should I use?"
- "When should I use memory?"
- "Streaming vs non-streaming?"

### Example-First
Learn by doing:
- 20+ working examples
- Copy-paste recipes
- Real-world patterns

### Production-Ready
Enterprise patterns:
- Error handling
- Performance optimization
- Security best practices
- Accessibility compliance

---

## 🆘 Need Help?

- **Questions?** Check the [FAQ](./faq.md) or [Troubleshooting](./troubleshooting.md)
- **Bug?** [Open an issue](https://github.com/clarity-chat/clarity/issues)
- **Feature request?** [Start a discussion](https://github.com/clarity-chat/clarity/discussions)
- **Chat?** [Join Discord](https://discord.gg/clarity-chat)

---

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Built with ❤️ by the Clarity team**
