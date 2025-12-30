# QA Docs Audit - Master Context

## Project Overview

**Repository**: Clarity-ai-chat-components **Docs Site Package**: `@clarity-chat/docs` (apps/docs)
**Framework**: Next.js 16.1.1 with App Router + Turbopack **Date**: 2025-12-30

## Stack Summary

| Component         | Technology                         |
| ----------------- | ---------------------------------- |
| Framework         | Next.js 16.1.1 (App Router)        |
| Bundler           | Turbopack (dev), Webpack (prod)    |
| Styling           | Tailwind CSS 3.4.x                 |
| UI Components     | @clarity-chat/react (workspace)    |
| MDX               | @next/mdx + next-mdx-remote        |
| Code Highlighting | prism-react-renderer, highlight.js |
| Animations        | framer-motion                      |
| Icons             | lucide-react                       |
| State Management  | React Context + custom hooks       |
| Theming           | next-themes                        |

## Directory Structure (Docs-Relevant)

```
apps/docs/
├── app/                 # Next.js App Router pages (421 routes)
│   ├── api/            # API routes for demos
│   │   ├── ai/         # AI search/components/hooks APIs
│   │   ├── chat/       # Chat demo API
│   │   ├── hero-chat/  # Hero section chat API
│   │   ├── live-demo-chat/ # Live demo chat API
│   │   └── docs-assistant/ # Docs assistant API
│   ├── cookbook/       # Cookbook pages (~45 recipes)
│   ├── demos/          # Interactive demos (10 demo pages)
│   ├── examples/       # Example pages (~18 examples)
│   ├── guides/         # Guide pages (~60 guides)
│   ├── learn/          # Learning paths (~25 pages)
│   ├── reference/      # API reference
│   │   ├── components/ # Component docs (120+ pages)
│   │   └── hooks/      # Hook docs (50+ pages)
│   ├── playground/     # Interactive playground
│   ├── enterprise/     # Enterprise docs
│   └── page.tsx        # Homepage
├── components/         # Docs-specific components
├── content/            # MDX content files
├── lib/                # Utilities and helpers
├── public/             # Static assets
└── styles/             # Global CSS
```

## Run Commands

```bash
# Install dependencies
pnpm install

# Build workspace packages (required first)
pnpm build:packages

# Development (docs only)
pnpm docs
# or
cd apps/docs && pnpm dev

# Production build
pnpm docs:build
# or
cd apps/docs && pnpm build

# Run all checks
pnpm check:all

# Typecheck
pnpm typecheck

# Lint
pnpm lint

# Tests
pnpm test
pnpm test:e2e
```

## Environment Configuration

Required for full demo functionality (from `.env.example`):

```env
# AI Provider API Keys (at least one for demos)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=...

# Optional: Caching/Vector search
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=clarity-docs
```

**Note**: Demos work without API keys using fallback mocks.

## API Routes

| Route                 | Purpose             | Mock Available |
| --------------------- | ------------------- | -------------- |
| `/api/chat`           | Main chat API       | Yes            |
| `/api/hero-chat`      | Homepage hero demo  | Yes            |
| `/api/live-demo-chat` | Live demo pages     | Yes            |
| `/api/docs-assistant` | Docs AI assistant   | Yes            |
| `/api/ai/search`      | AI-powered search   | Yes            |
| `/api/ai/components`  | Component discovery | Yes            |
| `/api/ai/hooks`       | Hook discovery      | Yes            |

## Key Dependencies

```json
{
  "@clarity-chat/react": "workspace:*",
  "@clarity-chat/primitives": "workspace:*",
  "next": "^16.0.9",
  "react": "^19.2.0",
  "prism-react-renderer": "^2.3.1",
  "framer-motion": "^12.23.25",
  "highlight.js": "^11.10.0"
}
```

## Known Constraints

1. **TypeScript Errors**: ~60+ TS errors in docs pages (ignored via `ignoreBuildErrors: true`)
2. **SSR Bailout**: Dynamic components (DocsAssistant, particles) use client-side rendering
3. **API Keys**: Optional; demos fall back to mocks when not provided
4. **WASM**: tiktoken requires asyncWebAssembly experiment

## Page Count Summary

| Section              | Page Count |
| -------------------- | ---------- |
| Total Routes         | 421        |
| Cookbook             | ~45        |
| Guides               | ~60        |
| Reference/Components | ~120       |
| Reference/Hooks      | ~50        |
| Examples             | ~18        |
| Demos                | 10         |
| Learn                | ~25        |
| Other                | ~93        |

## QA Harness Commands

```bash
# Full QA check
pnpm check:all  # typecheck + lint + test + build

# Individual checks
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e

# Docs-specific
cd apps/docs
pnpm test
pnpm build
```
