# Setup Guide: Prompt Optimization Layer

This guide will help you set up the prompt optimization layer with zero friction.

## Prerequisites

- ✅ `@clarity-chat/react` installed (the prompt layer is included)
- ✅ React 19+ (peer dependency)
- ✅ TypeScript (recommended, but not required)

## Installation

The prompt optimization layer is **already included** in `@clarity-chat/react`. No additional packages needed!

```bash
# If you haven't installed Clarity yet:
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Quick Setup (30 seconds)

### Option 1: Enable in useClarityChat (Easiest)

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,  // That's it!
      targetTokens: 4000,
    },
  })

  return <ChatWindow messages={messages} onSend={append} />
}
```

### Option 2: Use the Optimization Hook

```tsx
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react/prompt'

function MyChat({ messages }) {
  const { optimizedMessages } = usePromptOptimizer({
    messages,
    model: getModelProfile('gpt-4'),  // Pre-configured!
    targetTokens: 4000,
    autoOptimize: true,  // Automatic optimization
  })

  return <ChatWindow messages={optimizedMessages} />
}
```

## TypeScript Setup

If using TypeScript, types are included. No additional `@types` packages needed.

```tsx
import type {
  ModelMetadata,
  OptimizationStrategy,
  PromptRecipe,
} from '@clarity-chat/react/prompt'
```

## Common Setup Issues & Solutions

### Issue: "Cannot find module '@clarity-chat/react/prompt'"

**Solution**: Make sure you're importing from the correct path:
```tsx
// ✅ Correct
import { usePromptOptimizer } from '@clarity-chat/react/prompt'

// ❌ Wrong
import { usePromptOptimizer } from '@clarity-chat/react'
```

### Issue: "getModelProfile is not a function"

**Solution**: Make sure you're importing from the prompt subpath:
```tsx
// ✅ Correct
import { getModelProfile } from '@clarity-chat/react/prompt'

// ❌ Wrong
import { getModelProfile } from '@clarity-chat/react'
```

### Issue: Type errors with CoreMessage

**Solution**: Import types from the correct location:
```tsx
import type { CoreMessage } from '@clarity-chat/react'
// CoreMessage is the base type used throughout
```

## Verification

Test that everything works:

```tsx
import { 
  getModelProfile, 
  estimateMessageArrayTokens,
  MODEL_PROFILES 
} from '@clarity-chat/react/prompt'

// Should work without errors
const model = getModelProfile('gpt-4')
console.log('Model:', model.name)  // "GPT-4"

const tokens = estimateMessageArrayTokens([
  { role: 'user', content: 'Hello!' }
], { model: 'gpt-4' })
console.log('Tokens:', tokens)  // Should be a number
```

## Next Steps

1. ✅ **Read [QUICK_START.md](./QUICK_START.md)** - 5-minute tutorial
2. ✅ **Check [examples/](./examples/)** - Working code examples
3. ✅ **Read [docs/advanced-prompt-optimization.md](../../../docs/advanced-prompt-optimization.md)** - Advanced features

## Need Help?

- Check the [README.md](./README.md) for overview
- See [TYPES.md](./TYPES.md) for type definitions
- Review examples in [examples/](./examples/)

## Zero-Config Defaults

The layer works out of the box with sensible defaults:

- **Model**: Uses GPT-4 profile if not specified
- **Strategy**: 'sliding-window' if not specified
- **Target Tokens**: 80% of model max tokens if not specified
- **Auto-optimize**: Enabled by default in hooks

You can start using it immediately without any configuration!
