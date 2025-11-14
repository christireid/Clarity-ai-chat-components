# Prompt & Token Optimization Layer

Optional addon layer for advanced prompt composition and token optimization in Clarity AI Chat Components.

## Overview

This layer provides:

- **Prompt DSL (toon)**: Lightweight prompt composition system with metadata, scoped blocks, and compression rules
- **Token Estimation**: Model-aware token counting with 15+ pre-configured model profiles
- **Message Optimization**: Multiple strategies (sliding window, summarization, semantic prioritization, compression)
- **Advanced Features**: Dynamic model routing, cost optimization, semantic compression
- **React Hooks**: Easy integration with React applications
- **useClarityChat Integration**: Opt-in optimization via hook options
- **Debug Tools**: Step-by-step optimization history and diagnostics

## Quick Start

### Enable in useClarityChat

```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, tokenStats } = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'sliding-window',
    model: {
      id: 'gpt-4',
      maxTokens: 8192,
      inputPricePer1K: 0.03,
    },
  },
})
```

### Use Core Utilities

```tsx
import {
  createPromptRecipe,
  estimatePromptTokens,
  optimizeMessagesForBudget,
} from '@clarity-chat/react/prompt'

// Create a prompt recipe
const recipe = createPromptRecipe({
  id: 'chatbot',
  system: 'You are {{name}}.',
  user: '{{message}}',
})

// Build a prompt
const prompt = recipe.build({ name: 'Clarity', message: 'Hello!' })

// Estimate tokens
const tokens = estimatePromptTokens(prompt, { model: 'gpt-4' })

// Optimize messages
const { messages, diagnostics } = await optimizeMessagesForBudget(
  messages,
  4000,
  { strategy: 'hybrid', model: { id: 'gpt-4', maxTokens: 8192 } }
)
```

### Use React Hooks

```tsx
import {
  usePromptRecipe,
  useTokenBudget,
  useOptimizedChatContext,
  usePromptInspector,
} from '@clarity-chat/react/prompt'

// Build prompts
const { buildPrompt } = usePromptRecipe({ recipe })

// Track budget
const { currentTokens, remainingBudget } = useTokenBudget({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetBudget: 4000,
})

// Auto-optimize
const { optimizedMessages, tokenStats } = useOptimizedChatContext({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetTokens: 4000,
})

// Inspect (dev tool)
const { inspection } = usePromptInspector({
  messages,
  model: 'gpt-4',
})
```

## Core Exports

### Prompt DSL

- `createPromptRecipe(template)` - Create a composable prompt recipe
- `createSimpleRecipe(system, user, variables?)` - Create a simple recipe
- `composeRecipes(recipes)` - Compose multiple recipes

### Token Estimation

- `estimatePromptTokens(prompt, options?)` - Estimate tokens for a prompt
- `estimateMessageArrayTokens(messages, options?)` - Estimate tokens for messages
- `estimateMessageTokens(message, options?)` - Estimate tokens for a single message
- `estimatePromptCost(prompt, model)` - Estimate cost in USD
- `getModelMetadata(modelId)` - Get built-in model metadata

### Message Optimization

- `optimizeMessagesForBudget(messages, targetTokens, options?)` - Optimize messages
- `summarizeHistoryForCompression(messages, targetTokens, summarizeFn?)` - Summarize history

### Build Model Prompt

- `buildModelPrompt(options)` - Build a complete model-ready prompt

## React Hooks

### Basic Hooks
- `usePromptRecipe(options)` - Build prompts from recipes
- `useTokenBudget(options)` - Track token usage and budget
- `useOptimizedChatContext(options)` - Auto-optimize chat context
- `usePromptInspector(options)` - Inspect prompts (dev tool)

### Advanced Hooks (Phase 2)
- `usePromptOptimizer(options)` - Full optimization engine wrapper
- `useDynamicModelRouting(options)` - Intelligent model selection
- `usePromptDebugger(options)` - Step-by-step optimization history

## Optimization Strategies

### Basic Strategies
1. **sliding-window**: Keep most recent messages
2. **summarize-old**: Summarize older messages
3. **drop-low-priority**: Drop low-priority messages
4. **hybrid**: Combine multiple strategies

### Advanced Strategies (Phase 2)
- **semantic-grouping**: Cluster messages by topic
- **tool-output-condensing**: Compress verbose tool responses
- **intent-preserving-summarization**: Create compact conversation summaries
- **weighted-semantic-prioritization**: Multi-signal message ranking
- **adaptive-routing**: Automatic strategy selection based on context

## Documentation

📚 **Start Here**: [INDEX.md](./INDEX.md) - Complete documentation index

### Quick Links
- **[Getting Started](./GETTING_STARTED.md)** ⭐ - 5-minute tutorial
- **[Copy-Paste Examples](./COPY_PASTE_EXAMPLES.md)** ⚡ - Ready-to-use code
- **[Setup Guide](./SETUP.md)** 🔧 - Installation & configuration
- **[Verification](./VERIFICATION.md)** ✅ - Test that everything works

### Reference
- **[Quick Start](./QUICK_START.md)** - Fast examples
- **[Full Documentation](../../../docs/prompt-optimization.md)** - Complete API reference
- **[Advanced Features](../../../docs/advanced-prompt-optimization.md)** - Phase 2 features guide
- **[Type Reference](./TYPES.md)** - Complete type definitions

## Examples

- **[Basic Example](./examples/optimized-chat-example.tsx)** - Simple optimization
- **[Advanced Example](./examples/advanced-optimization-example.tsx)** - Full optimization pipeline
- **[Recipe Example](./examples/prompt-recipe-example.tsx)** - Prompt DSL usage

## Installation

No additional installation required! The prompt optimization layer is included in `@clarity-chat/react`.

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Quick Example

```tsx
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react/prompt'

function MyChat() {
  const model = getModelProfile('gpt-4')
  
  const { optimizedMessages, tokenStats } = usePromptOptimizer({
    messages: chatMessages,
    model,
    targetTokens: 4000,
    autoOptimize: true,
  })
  
  return <ChatWindow messages={optimizedMessages} />
}
```

That's it! No configuration needed.
