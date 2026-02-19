# Getting Started with Clarity Chat Examples

Welcome! This directory contains 29 robust examples demonstrating Clarity Chat Components.

## Quick Start

### Run Any Example

```bash
# 1. Choose an example
cd apps/examples/basic-chat

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev
```

That's it! All examples are pre-configured with their required peer dependencies.

## Choose Your Example

### By Complexity

**Beginner** (< 300KB)

- [minimal-chat](./minimal-chat) - Bare minimum setup (257KB)
- [basic-chat](./basic-chat) - Token counting added (262KB)
- [theme-builder](./theme-builder) - Theme customization (257KB)

**Intermediate** (300-500KB)

- [streaming-chat](./streaming-chat) - Real-time AI responses (282KB)
- [customer-support](./customer-support) - With Supabase persistence (282KB)
- [ai-assistant](./ai-assistant) - Full-featured assistant (287KB)
- [code-assistant](./code-assistant) - Code generation & debugging (352KB)

**Advanced** (500KB+)

- [component-demo](./component-demo) - All UI components (619KB)
- [enterprise-rag](./enterprise-rag) - Full RAG pipeline (1.1MB)
- [rag-workbench-demo](./rag-workbench-demo) - RAG experimentation (1.1MB)

### By Framework

**Next.js Apps** (11 examples)

- [ai-research-platform](./ai-research-platform) - Multi-agent RAG
- [analytics-console-demo](./analytics-console-demo) - Token analytics
- [code-assistant](./code-assistant) - AI code helper
- [conversational-analytics](./conversational-analytics) - Data queries
- [customer-support](./customer-support) - Support system
- [ecommerce-assistant](./ecommerce-assistant) - Shopping assistant
- [enterprise-ai-ops](./enterprise-ai-ops) - AI operations dashboard
- [enterprise-rag](./enterprise-rag) - Enterprise RAG
- [model-comparison-demo](./model-comparison-demo) - Compare AI models
- [rag-workbench-demo](./rag-workbench-demo) - RAG workbench
- [streaming-chat](./streaming-chat) - Streaming responses

**Vite Apps** (14 examples)

- [advanced-chat-features](./advanced-chat-features) - Advanced features
- [ai-assistant](./ai-assistant) - AI assistant
- [basic-chat](./basic-chat) - Simple chat
- [component-demo](./component-demo) - Component showcase
- [comprehensive-chat-demo](./comprehensive-chat-demo) - Feature demo
- [design-system-showcase](./design-system-showcase) - Design system
- [enhanced-ui-ux-showcase](./enhanced-ui-ux-showcase) - 2025 UI trends
- [gallery](./gallery) - Interactive gallery
- [multi-user-chat](./multi-user-chat) - Real-time multi-user
- [performance-dashboard](./performance-dashboard) - Performance metrics
- [theme-builder](./theme-builder) - Theme customization
- [token-optimization-demo](./token-optimization-demo) - Token optimization
- [use-clarity-chat-showcase](./use-clarity-chat-showcase) - Hook showcase
- [vercel-ai-sdk-compatible](./vercel-ai-sdk-compatible) - Vercel AI SDK

### By Feature

**RAG (Retrieval Augmented Generation)**

- [enterprise-rag](./enterprise-rag) - PDF/DOCX, reranking, embeddings
- [rag-workbench-demo](./rag-workbench-demo) - RAG experimentation
- [ai-research-platform](./ai-research-platform) - Multi-agent RAG
- [gallery](./gallery) - Basic RAG

**Token Optimization**

- [token-optimization-demo](./token-optimization-demo) - Budget monitoring
- [analytics-console-demo](./analytics-console-demo) - Token analytics
- [basic-chat](./basic-chat) - Token counting

**Theming & Customization**

- [theme-builder](./theme-builder) - Interactive theme builder
- [design-system-showcase](./design-system-showcase) - Design system
- [enhanced-ui-ux-showcase](./enhanced-ui-ux-showcase) - Modern UI

**Real-time Features**

- [streaming-chat](./streaming-chat) - Streaming responses
- [multi-user-chat](./multi-user-chat) - Multi-user real-time
- [conversational-analytics](./conversational-analytics) - Live dashboards

**Document Processing**

- [enterprise-rag](./enterprise-rag) - PDF + DOCX
- [rag-workbench-demo](./rag-workbench-demo) - Document Q&A

**Production Examples**

- [customer-support](./customer-support) - Supabase integration
- [ecommerce-assistant](./ecommerce-assistant) - Product recommendations
- [enterprise-ai-ops](./enterprise-ai-ops) - Observability dashboard

## Bundle Sizes

All examples include bundle size estimates in their READMEs.

**Small** (250-300KB) Perfect for simple chat interfaces, minimal features.

**Medium** (300-500KB) Good balance of features and performance. Most production apps.

**Large** (500KB-1MB+) Full-featured with RAG, document processing, advanced UI.

## Common Features

### What's Included in All Examples

- ✅ React 19 + TypeScript
- ✅ Framer Motion animations
- ✅ Lucide React icons
- ✅ Zod validation
- ✅ Responsive design
- ✅ Dark mode support (most examples)
- ✅ Accessibility (WCAG 2.1 AA)

### Optional Features by Example

Check each example's README for:

- Token counting (`flowtoken`)
- Markdown rendering (`react-markdown`)
- PDF processing (`pdfjs-dist`)
- RAG features (`cohere-ai`)
- Syntax highlighting (`shiki`, `prismjs`)
- Export functionality (`jszip`)

## Development

### Install Dependencies

From monorepo root:

```bash
pnpm install
```

This installs all dependencies for all examples.

### Run an Example

```bash
cd apps/examples/<example-name>
pnpm dev
```

Default ports:

- Vite apps: `http://localhost:5173`
- Next.js apps: `http://localhost:3000`
- Custom ports shown in terminal

### Build for Production

```bash
pnpm build
```

Output locations:

- Vite: `dist/`
- Next.js: `.next/`

### Preview Production Build

```bash
pnpm preview  # Vite only
pnpm start    # Next.js only
```

## Configuration

### Environment Variables

Most examples use mock data by default. For production:

```bash
# Create .env.local
cp .env.example .env.local

# Add your API keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...
COHERE_API_KEY=...  # For RAG examples
```

### API Integration

Replace mock responses with your API:

```typescript
// Example API route
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
})
```

## Deployment

### Vercel (Next.js)

1-click deploy buttons in Next.js example READMEs.

Or manually:

```bash
cd apps/examples/<nextjs-example>
vercel
```

### Vercel (Vite)

```bash
cd apps/examples/<vite-example>
pnpm build
vercel --prod
```

### Cloudflare Pages

```bash
pnpm build
npx wrangler pages publish dist
```

### Netlify

```bash
pnpm build
netlify deploy --prod --dir=dist
```

## Troubleshooting

### Build Errors

**"Cannot find module..."**

```bash
pnpm install  # Ensure all deps installed
```

**"Type error in..."**

```bash
pnpm add -D typescript@latest
```

### Runtime Errors

**"Module not found"** Check that all peer dependencies are in `package.json`.

**Bundle too large**

- Use `/core-minimal` export for basics
- Remove unused features
- Enable tree-shaking
- Lazy load heavy components

### Development Issues

**Port already in use**

```bash
pnpm dev --port 3001  # Use different port
```

**Slow hot reload**

- Restart dev server
- Clear `.next` or `dist` folders
- Check for circular dependencies

## Learn More

### Documentation

- [Clarity Chat Docs](https://clarity-chat.dev/docs)
- [Component API Reference](https://clarity-chat.dev/docs/api)
- [Migration Guide](../../docs/MIGRATION-2.0.md)

### Community

- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)

### Related

- [Monorepo CLAUDE.md](../../apps/streamlined-docs/CLAUDE.md) - Development guide
- [React Package Guide](../../packages/react/CLAUDE.md) - Component development

## Example Comparison

| Example          | Size  | Framework | Features      | Best For           |
| ---------------- | ----- | --------- | ------------- | ------------------ |
| minimal-chat     | 257KB | Vite      | Basic         | Learning basics    |
| basic-chat       | 262KB | Vite      | Tokens        | Simple production  |
| streaming-chat   | 282KB | Next.js   | Streaming     | Real-time apps     |
| ai-assistant     | 287KB | Vite      | Full-featured | General purpose    |
| customer-support | 282KB | Next.js   | Supabase      | Production SaaS    |
| component-demo   | 619KB | Vite      | All features  | Testing/showcasing |
| enterprise-rag   | 1.1MB | Next.js   | Full RAG      | Document Q&A       |

## Scripts

The following scripts help maintain examples:

```bash
# Audit all examples
node scripts/audit-examples.mjs

# Update dependencies
node scripts/update-example-dependencies.mjs

# Update READMEs
node scripts/update-example-readmes.mjs
```

Results saved to `.cleanup-results/`.

## Contributing

To add a new example:

1. Create directory in `apps/examples/your-example`
2. Add `package.json` with required scripts
3. Include peer dependencies
4. Add README following template
5. Run audit script to verify
6. Test build and dev modes
7. Submit PR

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.

## License

MIT - see [LICENSE](../../LICENSE) for details.
