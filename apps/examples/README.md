# Clarity Chat Component Examples

> **26 Production-Ready Examples** showcasing Clarity Chat Components

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples)

---

## Quick Navigation

- [Hero Examples](#-hero-examples) - Best showcases
- [Getting Started](#-getting-started) - Beginner friendly
- [Core Features](#-core-features) - Chat fundamentals
- [Analytics](#-analytics--optimization) - Token & cost tracking
- [AI/ML](#-aiml-features) - RAG, multi-provider
- [Enterprise](#-enterprise-features) - Production-ready
- [Design System](#-design-system) - Theming & components
- [Industry Solutions](#-industry-solutions) - Domain-specific

---

## 🏆 Hero Examples

Our top three showcases demonstrating the full power of Clarity Chat:

### 1. AI Research Platform
Enterprise-grade multi-agent RAG system with knowledge visualization.
```
apps/examples/ai-research-platform
```
[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples/ai-research-platform)

### 2. Enterprise AI Ops
Full operations dashboard with safety review, evaluation, and monitoring.
```
apps/examples/enterprise-ai-ops
```
[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples/enterprise-ai-ops)

### 3. Comprehensive Chat Demo
All features working together: edit, regenerate, export, search, command palette.
```
apps/examples/comprehensive-chat-demo
```
[![Deploy](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples/comprehensive-chat-demo)

---

## 🚀 Getting Started

### Beginner Examples

| Example | Description | Complexity |
|---------|-------------|------------|
| [minimal-chat](./minimal-chat) | 5 lines of code - simplest possible | ⭐ |
| [basic-chat](./basic-chat) | Simple chat with message operations | ⭐ |
| [customized-chat](./customized-chat) | Custom styling and callbacks | ⭐ |

### Prerequisites

```bash
# From workspace root
npm install
npm run build --workspace=@clarity-chat/primitives
npm run build --workspace=@clarity-chat/react
npm run build --workspace=@clarity-chat/types
```

### Running an Example

```bash
cd apps/examples/basic-chat
npm install
npm run dev
```

---

## 💬 Core Features

| Example | Features | Status |
|---------|----------|--------|
| [streaming-chat](./streaming-chat) | SSE streaming, cancellation, stop generation | ✅ |
| [advanced-chat-features](./advanced-chat-features) | Edit, regenerate, delete, undo/redo | ✅ |
| [comprehensive-chat-demo](./comprehensive-chat-demo) | All features + search + command palette | ✅ |
| [ai-assistant](./ai-assistant) | TanStack Query integration | ✅ |

---

## 📊 Analytics & Optimization

| Example | Features | Status |
|---------|----------|--------|
| [analytics-console-demo](./analytics-console-demo) | Token usage dashboard, cost analytics | ✅ |
| [token-optimization-demo](./token-optimization-demo) | In-chat token tracking | ✅ |
| [performance-dashboard](./performance-dashboard) | Component benchmarking | ✅ |
| [conversational-analytics](./conversational-analytics) | Conversation insights | ✅ |

---

## 🤖 AI/ML Features

| Example | Features | API Keys Required |
|---------|----------|-------------------|
| [rag-workbench-demo](./rag-workbench-demo) | RAG, vector search, citations | OpenAI, Anthropic, Google |
| [model-comparison-demo](./model-comparison-demo) | Compare AI providers | OpenAI, Anthropic, Google |
| [code-assistant](./code-assistant) | Code generation, debugging | OpenAI |
| [ai-research-platform](./ai-research-platform) | Multi-agent, knowledge graph | OpenAI, Anthropic, Google |

---

## 🏢 Enterprise Features

| Example | Features | Status |
|---------|----------|--------|
| [enterprise-ai-ops](./enterprise-ai-ops) | Safety review, evaluation, monitoring | ✅ |
| [complex-chat](./complex-chat) | Enterprise patterns, sidebar | ✅ |
| [multi-user-chat](./multi-user-chat) | Remix + WebSockets | ✅ |

---

## 🎨 Design System

| Example | Features | Status |
|---------|----------|--------|
| [design-system-showcase](./design-system-showcase) | All components, variants, tokens | ✅ |
| [theme-builder](./theme-builder) | Interactive theme editor | ✅ |
| [component-demo](./component-demo) | Component patterns | ✅ |
| [examples-showcase](./examples-showcase) | Multi-view example browser | ✅ |

---

## 🏪 Industry Solutions

| Example | Industry | Features |
|---------|----------|----------|
| [ecommerce-assistant](./ecommerce-assistant) | E-Commerce | Product search, cart, recommendations |
| [customer-support](./customer-support) | Support | Ticket management, Supabase |
| [vercel-ai-sdk-compatible](./vercel-ai-sdk-compatible) | Integration | Vercel AI SDK patterns |

---

## 📚 Documentation Integration

### Feature → Example Mapping

See [EXAMPLES_INDEX.md](./EXAMPLES_INDEX.md) for complete feature-to-example mapping.

### JSON Index

See [examples-index.json](./examples-index.json) for programmatic access.

---

## 🔑 API Keys Setup

Examples requiring API keys have `.env.example` files:

```bash
# Copy and configure
cp .env.example .env.local

# Required keys (check each example)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
```

---

## 📝 Example Structure

Each example follows this structure:

```
example-name/
├── src/
│   ├── app/
│   │   ├── page.tsx        # Main page
│   │   ├── layout.tsx      # Layout with CSS
│   │   ├── globals.css     # Tailwind CSS
│   │   └── api/            # API routes (if needed)
├── package.json
├── README.md               # Detailed documentation
├── .env.example            # Environment template
├── tailwind.config.js
└── next.config.ts
```

---

## 🎯 Design Philosophy

All examples follow Clarity Chat design principles:

- ✅ Clean, modern aesthetics
- ✅ Consistent Header / Footer / "How to Use" pattern
- ✅ Friendly error handling (no white screen crashes)
- ✅ Smooth, purposeful animations
- ✅ Accessible by default (WCAG 2.1 AAA)
- ✅ Responsive and mobile-friendly
- ✅ Performance-optimized

---

## 🤝 Contributing

These examples serve as both documentation and testing grounds:

1. Add new examples for new features
2. Follow the established patterns
3. Include comprehensive README
4. Add `.env.example` if API keys needed
5. Test both `dev` and `build` modes

---

## 📞 Support

For questions or issues:
1. Check the example's README
2. Review [EXAMPLES_INDEX.md](./EXAMPLES_INDEX.md)
3. Open an issue on GitHub

---

**Happy Coding! 🚀**
