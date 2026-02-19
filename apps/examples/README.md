# Clarity Chat Examples

> **29 Robust Examples** - Copy, customize, and ship in minutes.

Every example is a complete, working application with **all peer dependencies pre-configured**. Just run `pnpm install && pnpm dev`!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples)

---

## ⚡ Quick Start

All examples now run out of the box with **zero configuration**:

```bash
# Pick any example
cd apps/examples/basic-chat

# Install (includes all peer dependencies)
pnpm install

# Run immediately
pnpm dev
```

**No manual dependency installation needed!** All peer dependencies are pre-configured.

---

## 📦 What's New - January 2026

✅ **Complete Peer Dependencies** - All 29 examples now include all required dependencies
✅ **Bundle Size Documentation** - Know exactly what you're shipping (257KB - 1.1MB)
✅ **Comprehensive READMEs** - Installation, features, configuration in every example
✅ **Zero Configuration** - Run any example immediately after `pnpm install`

**See [GETTING-STARTED.md](./GETTING-STARTED.md) for the complete guide.**

---

## 🎯 Choose by Bundle Size

| Size Range | Examples | Best For |
|------------|----------|----------|
| **Small** (250-300KB) | 13 examples | Production apps, minimal bundle |
| **Medium** (300-500KB) | 10 examples | Balanced features & performance |
| **Large** (500KB-1MB) | 4 examples | Full-featured applications |
| **Enterprise** (1MB+) | 2 examples | Complete RAG pipelines |

**Details:** See [bundle sizes](#-examples-by-bundle-size) below.

---

## Find the Right Example

| I want to...              | Start with...                                      | Complexity   |
| ------------------------- | -------------------------------------------------- | ------------ |
| **Fastest setup**         | [minimal-chat](./minimal-chat)                     | ⭐ Beginner  |
| Learn the basics          | [basic-chat](./basic-chat)                         | Beginner     |
| Add streaming             | [streaming-chat](./streaming-chat)                 | Beginner     |
| Build a code assistant    | [code-assistant](./code-assistant)                 | Intermediate |
| Create an e-commerce bot  | [ecommerce-assistant](./ecommerce-assistant)       | Intermediate |
| Build enterprise features | [enterprise-ai-ops](./enterprise-ai-ops)           | Advanced     |
| Compare AI models         | [model-comparison-demo](./model-comparison-demo)   | Intermediate |
| Customize themes          | [theme-builder](./theme-builder)                   | Beginner     |
| Track token usage         | [analytics-console-demo](./analytics-console-demo) | Intermediate |

---

## Featured Examples

Three showcases demonstrating the full power of Clarity Chat:

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

## 📦 Examples by Bundle Size

All examples include estimated production bundle sizes (gzipped):

### Small (250-300KB) - 13 Examples
Perfect for production apps needing minimal bundle size.

| Example | Size | Framework | Features |
|---------|------|-----------|----------|
| [minimal-chat](./minimal-chat) | 257KB | Vite | Basic functionality |
| [theme-builder](./theme-builder) | 257KB | Vite | Theme customization |
| [basic-chat](./basic-chat) | 262KB | Vite | Token counting |
| [customized-chat](./customized-chat) | 262KB | Vite | Custom styling |
| [streaming-chat](./streaming-chat) | 282KB | Next.js | Streaming responses |
| [customer-support](./customer-support) | 282KB | Next.js | Supabase persistence |
| [ecommerce-assistant](./ecommerce-assistant) | 282KB | Next.js | Product recommendations |

### Medium (300-500KB) - 10 Examples
Best balance of features and performance.

| Example | Size | Framework | Features |
|---------|------|-----------|----------|
| [ai-assistant](./ai-assistant) | 287KB | Vite | Full-featured assistant |
| [code-assistant](./code-assistant) | 352KB | Next.js | Code generation |
| [advanced-chat-features](./advanced-chat-features) | 357KB | Vite | Advanced features |
| [ai-research-platform](./ai-research-platform) | 402KB | Next.js | Multi-agent RAG |

### Large (500KB+) - 4 Examples
Full-featured with advanced capabilities.

| Example | Size | Framework | Features |
|---------|------|-----------|----------|
| [design-system-showcase](./design-system-showcase) | 544KB | Vite | Complete design system |
| [component-demo](./component-demo) | 619KB | Vite | All components |

### Enterprise (1MB+) - 2 Examples
Complete RAG pipelines with document processing.

| Example | Size | Framework | Features |
|---------|------|-----------|----------|
| [enterprise-rag](./enterprise-rag) | 1.1MB | Next.js | Full RAG + PDF/DOCX |
| [rag-workbench-demo](./rag-workbench-demo) | 1.1MB | Next.js | RAG experimentation |

**Average bundle size**: 385KB (342KB excluding RAG examples)

---

## 🚀 Getting Started

### Beginner Examples

| Example                              | Size | Description                        | Complexity |
| ------------------------------------ | ---- | ---------------------------------- | ---------- |
| [minimal-chat](./minimal-chat)       | 257KB | **ONE LINE of code** - start here! | ⭐ Easiest |
| [basic-chat](./basic-chat)           | 262KB | Chat with message operations       | ⭐         |
| [customized-chat](./customized-chat) | 262KB | Custom styling and callbacks       | ⭐         |

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

| Example                                              | Features                                     | Status |
| ---------------------------------------------------- | -------------------------------------------- | ------ |
| [streaming-chat](./streaming-chat)                   | SSE streaming, cancellation, stop generation | ✅     |
| [advanced-chat-features](./advanced-chat-features)   | Edit, regenerate, delete, undo/redo          | ✅     |
| [comprehensive-chat-demo](./comprehensive-chat-demo) | All features + search + command palette      | ✅     |
| [ai-assistant](./ai-assistant)                       | TanStack Query integration                   | ✅     |

---

## 📊 Analytics & Optimization

| Example                                                | Features                              | Status |
| ------------------------------------------------------ | ------------------------------------- | ------ |
| [analytics-console-demo](./analytics-console-demo)     | Token usage dashboard, cost analytics | ✅     |
| [token-optimization-demo](./token-optimization-demo)   | In-chat token tracking                | ✅     |
| [performance-dashboard](./performance-dashboard)       | Component benchmarking                | ✅     |
| [conversational-analytics](./conversational-analytics) | Conversation insights                 | ✅     |

---

## 🤖 AI/ML Features

| Example                                          | Features                      | API Keys Required         |
| ------------------------------------------------ | ----------------------------- | ------------------------- |
| [rag-workbench-demo](./rag-workbench-demo)       | RAG, vector search, citations | OpenAI, Anthropic, Google |
| [model-comparison-demo](./model-comparison-demo) | Compare AI providers          | OpenAI, Anthropic, Google |
| [code-assistant](./code-assistant)               | Code generation, debugging    | OpenAI                    |
| [ai-research-platform](./ai-research-platform)   | Multi-agent, knowledge graph  | OpenAI, Anthropic, Google |

---

## 🏢 Enterprise Features

| Example                                  | Features                              | Status |
| ---------------------------------------- | ------------------------------------- | ------ |
| [enterprise-ai-ops](./enterprise-ai-ops) | Safety review, evaluation, monitoring | ✅     |
| [complex-chat](./complex-chat)           | Enterprise patterns, sidebar          | ✅     |
| [multi-user-chat](./multi-user-chat)     | Remix + WebSockets                    | ✅     |

---

## 🎨 Design System

| Example                                            | Features                         | Status |
| -------------------------------------------------- | -------------------------------- | ------ |
| [design-system-showcase](./design-system-showcase) | All components, variants, tokens | ✅     |
| [theme-builder](./theme-builder)                   | Interactive theme editor         | ✅     |
| [component-demo](./component-demo)                 | Component patterns               | ✅     |
| [examples-showcase](./examples-showcase)           | Multi-view example browser       | ✅     |

---

## 🏪 Industry Solutions

| Example                                                | Industry    | Features                              |
| ------------------------------------------------------ | ----------- | ------------------------------------- |
| [ecommerce-assistant](./ecommerce-assistant)           | E-Commerce  | Product search, cart, recommendations |
| [customer-support](./customer-support)                 | Support     | Ticket management, Supabase           |
| [vercel-ai-sdk-compatible](./vercel-ai-sdk-compatible) | Integration | Vercel AI SDK patterns                |

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
