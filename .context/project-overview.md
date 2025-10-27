# Clarity Chat - Project Overview

## What is Clarity Chat?

Clarity Chat is a comprehensive AI chat framework providing production-ready templates, tools, and examples for building modern AI applications with OpenAI, Anthropic, and Google AI.

## Project Structure

```
clarity-chat/
├── packages/
│   ├── cli/                 # Beautiful CLI tool with 7 commands
│   ├── core/                # Core chat functionality
│   ├── stream/              # Streaming responses
│   ├── analytics/           # Usage tracking & cost calculation
│   └── rag/                 # RAG document processing
├── examples/
│   ├── model-comparison-demo/    # Compare AI models side-by-side
│   ├── rag-workbench-demo/       # Document processing with RAG
│   ├── analytics-console-demo/   # Real-time analytics dashboard
│   └── examples-showcase/        # Marketing landing page
└── .context/                # AI-optimized context docs (this directory)
```

## Core Capabilities

### 1. Multi-Provider Support
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3 (Opus, Sonnet, Haiku)
- **Google**: Gemini Pro

### 2. Streaming Responses
- Real-time token streaming
- Server-sent events (SSE)
- React hooks for easy integration

### 3. RAG (Retrieval Augmented Generation)
- Document upload and processing
- Smart chunking with overlap
- Semantic search
- Context injection

### 4. Analytics & Cost Tracking
- Per-token cost calculation
- Usage tracking across providers
- Performance metrics
- Beautiful dashboard UI

### 5. Beautiful CLI
- Interactive project scaffolding
- Component management
- Development workflows
- Deployment automation

## Technology Stack

### Core
- **Language**: TypeScript 5.7.2 (strict mode)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3.4.0
- **Process Management**: PM2

### AI SDKs
- **OpenAI**: `openai` package
- **Anthropic**: `@anthropic-ai/sdk`
- **Google**: `@google/generative-ai`

### Development
- **CLI Framework**: Ink 4.4.1 (React for CLIs)
- **Testing**: Comprehensive test suites
- **Documentation**: Markdown with examples

## Key Design Decisions

### 1. Next.js 15 + App Router
**Why**: Modern React patterns, built-in API routes, excellent TypeScript support
**Trade-off**: Route isolation means in-memory storage doesn't work across routes

### 2. Monorepo with npm Workspaces
**Why**: Code sharing, unified tooling, easier maintenance
**Trade-off**: More complex build process

### 3. TypeScript Strict Mode
**Why**: Catch errors early, better IDE support, self-documenting code
**Trade-off**: More verbose, steeper learning curve

### 4. PM2 for Process Management
**Why**: Production-ready, log management, auto-restart, clustering
**Trade-off**: Extra dependency, configuration needed

### 5. In-Memory Storage for Demos
**Why**: Simple, no database setup needed, perfect for demos
**Trade-off**: Data lost on restart, not suitable for production
**Solution**: Documented migration paths to PostgreSQL, Redis, MongoDB

## Development Philosophy

### 1. Production-Ready First
Every example is production-quality code, not toy demos.

### 2. Documentation Driven
Comprehensive READMEs, test results, and deployment guides.

### 3. AI-Friendly Architecture
Clean separation of concerns, clear patterns, easy to understand.

### 4. Developer Experience
Beautiful CLIs, helpful errors, excellent documentation.

### 5. Cost Conscious
Track token usage, calculate costs, optimize for efficiency.

## Common Workflows

### Starting a New Project
```bash
npx @clarity-chat/cli init my-project
cd my-project
npm install
npm run dev
```

### Adding a Component
```bash
clarity-chat add streaming-chat
# or
clarity-chat add rag-pipeline
```

### Running Examples
```bash
cd examples/analytics-console-demo
npm install
npm run dev
# or
pm2 start ecosystem.config.cjs
```

### Deploying
```bash
npm run build
npm run deploy
# or use PM2
pm2 start ecosystem.config.cjs
```

## Key Files

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js settings
- `tailwind.config.ts` - Styling configuration
- `ecosystem.config.cjs` - PM2 process management

### Environment
- `.env.local` - API keys (NEVER commit)
- `.env.local.example` - Environment template

### Git
- `.gitignore` - Files to ignore (includes .env.local)

## API Keys Required

All examples require API keys:

```bash
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...
```

Get keys from:
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/
- Google: https://makersuite.google.com/app/apikey

## Project Status

**Phase 2 Complete** ✅
- ✅ 3 production-ready examples
- ✅ Beautiful CLI with 7 commands
- ✅ Comprehensive documentation
- ✅ Marketing showcase page
- ✅ All tests passing

**Current Phase**: DX Enhancement
- 🔄 AI-optimized context documents
- ⏳ VS Code extension
- ⏳ MCP integration
- ⏳ Enhanced error system

## Quick Links

- [Architecture](./architecture.md) - System design
- [API Reference](./api-reference.md) - All APIs
- [Common Tasks](./common-tasks.md) - Frequent operations
- [Troubleshooting](./troubleshooting.md) - Common issues

## Next Steps for AI Agents

1. Read `architecture.md` for system design
2. Check `common-tasks.md` for workflows
3. Reference feature-specific docs as needed
4. Consult `troubleshooting.md` for issues

---

**Version**: 1.0 (Phase 2 Complete)  
**Last Updated**: 2025-10-27  
**Status**: Production Ready
