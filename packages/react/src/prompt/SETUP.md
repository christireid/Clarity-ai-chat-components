# Setup Guide: Prompt & Token Optimization

Get started with prompt and token optimization in minutes. Zero configuration required.

## Installation

The prompt optimization layer is included with `@clarity-chat/react`. No additional packages needed.

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Quick Start (30 seconds)

### Option 1: Enable in useClarityChat (Easiest)

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
    },
  })

  return <div>{/* Your chat UI */}</div>
}
```

That's it! Token optimization is now active.

### Option 2: Use Standalone Hooks

```tsx
import { useTokenBudget } from '@clarity-chat/react/prompt'

function TokenTracker({ messages }) {
  const budget = useTokenBudget({
    messages,
    modelMetadata: 'gpt-4',
    targetBudget: 4000,
  })

  return <div>Tokens: {budget.currentTokens}</div>
}
```

## Import Paths

All prompt optimization features are available via the `/prompt` subpath:

```tsx
// Core utilities
import { toon, estimatePromptTokens } from '@clarity-chat/react/prompt'

// React hooks
import { useTokenBudget, usePromptOptimizer } from '@clarity-chat/react/prompt'

// Model presets
import { MODEL_PROFILES } from '@clarity-chat/react/prompt'

// Built-in recipes
import { BUILT_IN_RECIPES } from '@clarity-chat/react/prompt'
```

## TypeScript Support

Full TypeScript support is included. Types are automatically available:

```tsx
import type { 
  CoreMessage,
  PromptRecipe,
  ModelProfile 
} from '@clarity-chat/react/prompt'
```

## Common Patterns

### Pattern 1: Basic Chat with Optimization

```tsx
import { useClarityChat } from '@clarity-chat/react'

const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'hybrid',
    model: 'gpt-4',
  },
})
```

### Pattern 2: Custom Token Budget

```tsx
import { useTokenBudget } from '@clarity-chat/react/prompt'

const budget = useTokenBudget({
  messages: myMessages,
  modelMetadata: 'gpt-4',
  targetBudget: 8000, // Custom budget
})

if (budget.isExceeded) {
  const optimized = await budget.optimize('hybrid')
  // Use optimized.messages
}
```

### Pattern 3: Advanced Optimization Engine

```tsx
import { usePromptOptimizer } from '@clarity-chat/react/prompt'

const optimizer = usePromptOptimizer({
  messages: myMessages,
  model: 'gpt-4',
  targetTokens: 4000,
  autoOptimize: true,
})

// optimizer.optimizedMessages
// optimizer.tokenStats
// optimizer.diagnostics
```

### Pattern 4: Dynamic Model Routing

```tsx
import { useDynamicModelRouting } from '@clarity-chat/react/prompt'

const routing = useDynamicModelRouting({
  currentModel: 'gpt-4',
  targetTokens: 4000,
  costBudget: 0.1, // $0.10 per request
})

if (routing.shouldSwitch) {
  // Switch to routing.recommendedModel
}
```

## Configuration Options

### useClarityChat Options

```tsx
promptOptimization?: {
  enabled?: boolean              // Default: false
  targetTokens?: number           // Default: 4000
  strategy?: 'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'
  model?: string                  // Default: 'gpt-4'
  keepRecent?: number             // For sliding-window strategy
  summarizeFn?: (messages) => Promise<string>  // Custom summarization
}
```

### Model Selection

Use built-in model profiles:

```tsx
import { MODEL_PROFILES } from '@clarity-chat/react/prompt'

// Available models:
MODEL_PROFILES['gpt-4']
MODEL_PROFILES['gpt-4-turbo']
MODEL_PROFILES['gpt-3.5-turbo']
MODEL_PROFILES['claude-3-opus']
MODEL_PROFILES['claude-3-sonnet']
MODEL_PROFILES['claude-3-haiku']
MODEL_PROFILES['gemini-1.5-pro']
MODEL_PROFILES['gemini-1.5-flash']
MODEL_PROFILES['mistral-large']
MODEL_PROFILES['mistral-small']
```

## Examples

### Complete Examples

- **Basic**: `apps/examples/prompt-optimization-example.tsx`
- **Advanced**: `apps/examples/advanced-prompt-optimization-example.tsx`

### Copy-Paste Examples

See [QUICK_START.md](./QUICK_START.md) for copy-pasteable code snippets.

## Troubleshooting

### Import Errors

If you see import errors, ensure you're using the `/prompt` subpath:

```tsx
// ✅ Correct
import { useTokenBudget } from '@clarity-chat/react/prompt'

// ❌ Incorrect
import { useTokenBudget } from '@clarity-chat/react'
```

### Type Errors

Ensure TypeScript can resolve types:

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16", "nodenext"
    "resolvePackageJsonExports": true
  }
}
```

### Build Errors

If using a bundler (Vite, Webpack, etc.), ensure it supports package.json exports:

- **Vite**: ✅ Supported by default
- **Webpack 5**: ✅ Supported by default
- **Webpack 4**: ⚠️ May need configuration
- **Parcel**: ✅ Supported by default

## Next Steps

1. **Read the docs**: [README.md](./README.md)
2. **Try examples**: See `apps/examples/`
3. **Explore advanced features**: [ADVANCED.md](./ADVANCED.md)
4. **Check API reference**: [EXPORTS.md](./EXPORTS.md)

## Support

- **Documentation**: See docs in `packages/react/src/prompt/`
- **Examples**: See `apps/examples/`
- **Issues**: GitHub issues

---

**That's it!** You're ready to use prompt and token optimization. 🚀
