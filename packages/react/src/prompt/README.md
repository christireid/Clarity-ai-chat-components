# Prompt & Token Optimization Layer

Optional addon layer for advanced prompt composition and token optimization in Clarity AI Chat Components.

## Overview

This layer provides:

- **Prompt DSL (toon)**: Lightweight prompt composition system
- **Token Estimation**: Model-aware token counting
- **Message Optimization**: Multiple strategies for keeping conversations under token budgets
- **React Hooks**: Easy integration with React applications
- **useClarityChat Integration**: Opt-in optimization via hook options

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

- `usePromptRecipe(options)` - Build prompts from recipes
- `useTokenBudget(options)` - Track token usage and budget
- `useOptimizedChatContext(options)` - Auto-optimize chat context
- `usePromptInspector(options)` - Inspect prompts (dev tool)

## Optimization Strategies

1. **sliding-window**: Keep most recent messages
2. **summarize-old**: Summarize older messages
3. **drop-low-priority**: Drop low-priority messages
4. **hybrid**: Combine multiple strategies

## Documentation

See [prompt-optimization.md](../../../docs/prompt-optimization.md) for complete documentation.

## Examples

See [examples/optimized-chat-example.tsx](./examples/optimized-chat-example.tsx) for a complete example.
