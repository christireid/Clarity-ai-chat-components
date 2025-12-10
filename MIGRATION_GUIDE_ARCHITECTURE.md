# Migration Guide: Architecture Restructuring v0.1.0

This guide covers the architectural changes made to improve code organization, eliminate circular
dependencies, and enable better tree-shaking.

## Overview

**What changed?**

- Factory functions consolidated to dedicated modules
- Circular dependencies eliminated
- Package exports reorganized for granular imports
- Internal utilities added with comprehensive tests

**Impact:** Low-to-none for most users. Changes are primarily internal.

## Breaking Changes

### 1. Factory Function Imports (Internal)

If you were importing factory functions directly from `react.tsx` files, update to use the dedicated
factory modules.

**Before:**

```tsx
// This pattern may have worked due to barrel exports
import { createEmbeddingProvider } from '@clarity-chat/react/embeddings'
```

**After (same API, different internal path):**

```tsx
// Same import, but now sourced from factory.ts internally
import { createEmbeddingProvider } from '@clarity-chat/react/embeddings'
```

> **Note:** The public API is unchanged. Only internal module structure changed.

### 2. Vector Store Factory

**Before:**

```tsx
// Direct construction (still works)
import { PineconeVectorStore } from '@clarity-chat/react/vector-stores'
const store = new PineconeVectorStore(config)
```

**Recommended:**

```tsx
// Use factory for consistency
import { createVectorStore } from '@clarity-chat/react/vector-stores'
const store = createVectorStore({ provider: 'pinecone', ...config })
```

## New Package Exports

Granular imports are now available for better tree-shaking:

```tsx
// Core functionality only
import { useClarityChat, useChat } from '@clarity-chat/react/core'

// Hooks only
import { useStreamingResponse, useMessage } from '@clarity-chat/react/hooks'

// Components only
import { ChatWindow, MessageList } from '@clarity-chat/react/components'

// Utilities
import { cn, compressPrompt } from '@clarity-chat/react/utils'

// Embeddings
import { createEmbeddingProvider, useEmbeddings } from '@clarity-chat/react/embeddings'

// Vector stores
import { createVectorStore, useVectorStore } from '@clarity-chat/react/vector-stores'

// Memory management
import { useMemory, ConversationMemory } from '@clarity-chat/react/memory'

// Analytics
import { useAnalytics, trackEvent } from '@clarity-chat/react/analytics'

// Adapters
import { OpenAIAdapter, AnthropicAdapter } from '@clarity-chat/react/adapters'

// Animations
import { AnimatedBackground } from '@clarity-chat/react/animations'

// Prompt utilities
import { buildPrompt, optimizePrompt } from '@clarity-chat/react/prompt'

// Styles
import '@clarity-chat/react/styles.css'
```

## Circular Dependency Fixes

### Embeddings Module

The circular dependency between `embeddings/index.ts` and `embeddings/react.tsx` was eliminated by:

1. Creating `embeddings/factory.ts` with `createEmbeddingProvider()`
2. Both `index.ts` and `react.tsx` now import from `factory.ts`

**Architecture:**

```
index.ts ─────┐
              ├──> factory.ts (shared)
react.tsx ────┘
```

### Vector Stores Module

Same pattern applied to `vector-stores/`:

1. Created `vector-stores/factory.ts` with `createVectorStore()`
2. Eliminates duplication and circular imports

**Architecture:**

```
index.ts ─────┐
              ├──> factory.ts (shared)
react.tsx ────┘
```

## Bundle Size Tracking

Bundle sizes are now tracked with size-limit. Run:

```bash
pnpm size
```

Current baselines:

- Full Bundle (ESM): ~3.1 MB (gzipped, with all deps)
- Full Bundle (CJS): ~3.3 MB (gzipped, with all deps)
- Core Hooks Only: ~2.9 MB (gzipped)

> **Note:** Large size is due to dependencies (framer-motion, react-markdown, etc.). Use granular
> imports for smaller bundles.

## Testing Internal Utilities

Comprehensive tests were added for internal utilities:

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test internal
```

Test coverage includes:

- `deepMerge` - Deep object merging
- `formatBytes` - Byte formatting
- `debounce` / `throttle` - Rate limiting
- `safeJsonParse` - Safe JSON parsing
- `retry` - Retry with exponential backoff
- `createEventEmitter` - Event emitter pattern
- `createQueue` - Async queue management
- `generateId` - Unique ID generation
- `classNames` / `cn` - Class name utilities

## Verification Steps

After updating, verify your setup:

```bash
# 1. Check for circular dependencies
pnpm madge --circular --extensions ts,tsx src/

# 2. Run type checks
pnpm typecheck

# 3. Run tests
pnpm test

# 4. Check bundle size
pnpm size
```

## Troubleshooting

### Import Errors

If you see import errors after updating:

1. Clear your module cache:

   ```bash
   rm -rf node_modules/.cache
   pnpm install
   ```

2. Rebuild the package:
   ```bash
   pnpm build
   ```

### Type Errors

If TypeScript reports missing types:

1. Ensure you have the latest types package:

   ```bash
   pnpm add @clarity-chat/types@latest
   ```

2. Restart your TypeScript server in your editor

### Bundle Size Increased

If your bundle size increased unexpectedly:

1. Use granular imports instead of the full bundle
2. Check that unused code is being tree-shaken
3. Consider lazy-loading heavy components (markdown, code blocks)

## Getting Help

- Check existing issues in the repository
- File new issues with reproduction steps
- Include your package versions and build setup
