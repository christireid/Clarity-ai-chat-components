# Clarity Chat Examples Index

> **Feature → Example Mapping** for Documentation Integration

This index maps Clarity Chat features to their corresponding example applications. Use this for linking from documentation to live demos.

---

## Quick Reference Table

| Feature | Primary Example | Alternative Examples |
|---------|-----------------|---------------------|
| Basic Chat | [basic-chat](./basic-chat) | [minimal-chat](./minimal-chat) |
| Streaming/SSE | [streaming-chat](./streaming-chat) | [ai-assistant](./ai-assistant) |
| Message Operations | [comprehensive-chat-demo](./comprehensive-chat-demo) | [advanced-chat-features](./advanced-chat-features) |
| Token Tracking | [token-optimization-demo](./token-optimization-demo) | [analytics-console-demo](./analytics-console-demo) |
| RAG/Knowledge Base | [rag-workbench-demo](./rag-workbench-demo) | [ai-research-platform](./ai-research-platform) |
| Multi-Provider | [model-comparison-demo](./model-comparison-demo) | - |
| Theming | [theme-builder](./theme-builder) | [design-system-showcase](./design-system-showcase) |
| Enterprise | [enterprise-ai-ops](./enterprise-ai-ops) | [ai-research-platform](./ai-research-platform) |
| Code Assistant | [code-assistant](./code-assistant) | - |
| E-Commerce | [ecommerce-assistant](./ecommerce-assistant) | - |
| Customer Support | [customer-support](./customer-support) | - |

---

## By Feature Category

### Core Chat Features

#### `<ChatWindow />` Component
- **Primary**: [basic-chat](./basic-chat) - Simple chat implementation
- **Minimal**: [minimal-chat](./minimal-chat) - 5-line implementation
- **Customized**: [customized-chat](./customized-chat) - Custom styling

```markdown
<!-- Docs snippet -->
See the [Basic Chat Example](/examples/basic-chat) for a complete implementation.
```

#### Streaming Responses (SSE)
- **Primary**: [streaming-chat](./streaming-chat) - Real-time SSE demo
- **With Cancellation**: Shows stop generation functionality

```markdown
<!-- Docs snippet -->
For real-time streaming, check our [Streaming Chat Demo](/examples/streaming-chat).
```

#### Message Operations (Edit/Delete/Regenerate)
- **Primary**: [comprehensive-chat-demo](./comprehensive-chat-demo)
- **Features**: Edit, regenerate, delete, undo/redo

```markdown
<!-- Docs snippet -->
See message operations in action: [Comprehensive Chat Demo](/examples/comprehensive-chat-demo)
```

---

### Analytics & Optimization

#### Token Tracking & Cost Analytics
- **Primary**: [analytics-console-demo](./analytics-console-demo) - Full dashboard
- **In-Chat**: [token-optimization-demo](./token-optimization-demo) - Inline tracking

```markdown
<!-- Docs snippet -->
Monitor token usage with our [Analytics Console](/examples/analytics-console-demo).
```

#### Performance Monitoring
- **Primary**: [performance-dashboard](./performance-dashboard) - Component benchmarks

```markdown
<!-- Docs snippet -->
Profile component performance: [Performance Dashboard](/examples/performance-dashboard)
```

---

### AI/ML Features

#### RAG (Retrieval-Augmented Generation)
- **Primary**: [rag-workbench-demo](./rag-workbench-demo)
- **Enterprise**: [ai-research-platform](./ai-research-platform)
- **Features**: Document upload, vector search, citations

```markdown
<!-- Docs snippet -->
Build RAG applications: [RAG Workbench Demo](/examples/rag-workbench-demo)
```

#### Multi-Provider Support
- **Primary**: [model-comparison-demo](./model-comparison-demo)
- **Providers**: OpenAI, Anthropic, Google

```markdown
<!-- Docs snippet -->
Compare AI providers: [Model Comparison Demo](/examples/model-comparison-demo)
```

#### Code Assistant
- **Primary**: [code-assistant](./code-assistant)
- **Features**: Debugging, code generation, review

```markdown
<!-- Docs snippet -->
Build a coding assistant: [Code Assistant Demo](/examples/code-assistant)
```

---

### Design System

#### Theming
- **Builder**: [theme-builder](./theme-builder) - Interactive theme editor
- **Showcase**: [design-system-showcase](./design-system-showcase) - All components

```markdown
<!-- Docs snippet -->
Customize themes: [Theme Builder](/examples/theme-builder)
```

#### Component Showcase
- **Primary**: [component-demo](./component-demo) - All primitives
- **Design System**: [design-system-showcase](./design-system-showcase)

```markdown
<!-- Docs snippet -->
Browse all components: [Component Demo](/examples/component-demo)
```

---

### Enterprise Features

#### Operations Dashboard
- **Primary**: [enterprise-ai-ops](./enterprise-ai-ops)
- **Features**: Safety review, evaluation, monitoring

```markdown
<!-- Docs snippet -->
Enterprise AI operations: [Enterprise AI Ops](/examples/enterprise-ai-ops)
```

#### Research Platform
- **Primary**: [ai-research-platform](./ai-research-platform)
- **Features**: Multi-agent, knowledge graph, memory

```markdown
<!-- Docs snippet -->
AI research platform: [AI Research Platform](/examples/ai-research-platform)
```

---

### Industry Solutions

#### E-Commerce
- **Primary**: [ecommerce-assistant](./ecommerce-assistant)
- **Features**: Product search, recommendations, cart

#### Customer Support
- **Primary**: [customer-support](./customer-support)
- **Features**: Ticket management, Supabase integration

#### Conversational Analytics
- **Primary**: [conversational-analytics](./conversational-analytics)
- **Features**: Conversation insights, metrics

---

## Integration Framework Compatibility

| Framework | Example |
|-----------|---------|
| Vercel AI SDK | [vercel-ai-sdk-compatible](./vercel-ai-sdk-compatible) |
| TanStack Query | [ai-assistant](./ai-assistant) |
| Remix | [multi-user-chat](./multi-user-chat) |

---

## Complexity Levels

### Beginner
1. [minimal-chat](./minimal-chat) - 5 lines of code
2. [basic-chat](./basic-chat) - Basic features
3. [customized-chat](./customized-chat) - Styling

### Intermediate
1. [streaming-chat](./streaming-chat) - SSE streaming
2. [advanced-chat-features](./advanced-chat-features) - Message ops
3. [token-optimization-demo](./token-optimization-demo) - Analytics

### Advanced
1. [comprehensive-chat-demo](./comprehensive-chat-demo) - All features
2. [ai-research-platform](./ai-research-platform) - Enterprise
3. [enterprise-ai-ops](./enterprise-ai-ops) - Ops dashboard

---

## Hero Examples (Recommended for Marketing)

These examples showcase the library's full potential:

1. **🥇 AI Research Platform** - Enterprise-grade multi-agent RAG
2. **🥈 Enterprise AI Ops** - Full operations dashboard
3. **🥉 Comprehensive Chat Demo** - All features working together

---

## Deploy Buttons

For Vercel deployment, use this URL pattern:

```
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/christireid/Clarity-ai-chat-components/tree/main/apps/examples/{example-name})
```

---

## Docs Integration Snippets

### For Feature Documentation

```mdx
import { ExampleLink } from '@/components/ExampleLink'

<ExampleLink
  name="streaming-chat"
  title="Streaming Chat Demo"
  description="See real-time SSE streaming in action"
/>
```

### For API Reference

```mdx
## ChatWindow

<CodeExample path="basic-chat/src/App.tsx" />

[View full example →](/examples/basic-chat)
```

### For Tutorials

```mdx
:::tip Live Demo
Try the [Streaming Chat Demo](/examples/streaming-chat) to see this code in action.
:::
```

---

*Last updated: 2025-12-12*
