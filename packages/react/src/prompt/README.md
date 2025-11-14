# Prompt & Token Optimization Layer

Advanced prompt composition and token optimization utilities for Clarity AI Chat Components.

## Quick Start

### Enable in useClarityChat

```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, tokenStats } = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'sliding-window',
    model: {
      model: 'gpt-4',
      maxTokens: 8000,
      tokenizer: 'openai',
    },
  },
})
```

### Use Standalone Hooks

```tsx
import { useOptimizedChatContext } from '@clarity-chat/react'

const { messages } = useClarityChat({ api: '/api/chat' })

const { optimizedMessages, tokenStats } = useOptimizedChatContext({
  messages,
  model: { model: 'gpt-4', maxTokens: 8000 },
  targetTokens: 4000,
  strategy: 'sliding-window',
})
```

## Core Concepts

### Prompt Recipes

Composable prompt builders using templates:

```tsx
import { createPromptRecipe } from '@clarity-chat/react'

const recipe = createPromptRecipe({
  system: 'You are a helpful assistant.',
  user: 'User: {{userInput}}',
})

const result = recipe.build({
  userInput: 'Hello',
  history: [],
}, { model: 'gpt-4', maxTokens: 8000 })
```

### Optimization Strategies

- **`sliding-window`** - Keep most recent N messages
- **`summarize-old`** - Summarize older messages (requires async)
- **`drop-low-priority`** - Drop low-priority messages
- **`hybrid`** - Combine strategies

### Token Estimation

Model-aware token counting:

```tsx
import { estimatePromptTokens, getModelMetadata } from '@clarity-chat/react'

const model = getModelMetadata('gpt-4')!
const estimate = estimatePromptTokens(messages, model)

console.log(estimate.tokens) // Total tokens
console.log(estimate.breakdown) // By role
console.log(estimate.estimatedCost) // Cost in USD
```

## API Reference

### Core Utilities

- `createPromptRecipe(definition)` - Create prompt recipe builder
- `estimatePromptTokens(messages, model)` - Estimate tokens
- `optimizeMessagesForBudget(messages, options, model)` - Optimize (async)
- `optimizeMessagesForBudgetSync(messages, options, model)` - Optimize (sync)
- `buildModelPrompt(context, model, options?)` - Build final prompt
- `getModelMetadata(modelName)` - Get metadata for common models

### React Hooks

- `usePromptRecipe(options)` - Build prompts from recipes
- `useTokenBudget(options)` - Manage token budgets
- `useOptimizedChatContext(options)` - Auto-optimize context
- `usePromptInspector(options)` - Inspect prompts (dev tool)

### Utility Functions

- `formatTokenCount(tokens)` - Format for display
- `formatCost(cost)` - Format cost for display
- `needsOptimization(messages, targetTokens, model)` - Check if needed
- `getRecommendedTargetTokens(model)` - Get recommended budget

## Examples

See:
- [Full Example Component](../examples/prompt-optimization-example.tsx)
- [Documentation](../../docs/prompt-optimization.md)

## Built-in Recipes

```tsx
import { builtInRecipes } from '@clarity-chat/react'

const chatbot = builtInRecipes.chatbot
const qa = builtInRecipes.qa
const agent = builtInRecipes.agent
```

## Model Support

Pre-configured models:
- `gpt-4`, `gpt-4-turbo`, `gpt-3.5-turbo` (OpenAI)
- `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku` (Anthropic)

Or provide custom metadata:

```tsx
const customModel: ModelMetadata = {
  model: 'custom-model',
  maxTokens: 10000,
  inputPricePer1K: 0.01,
  outputPricePer1K: 0.02,
  tokenizer: 'approximate',
}
```

## Best Practices

1. **Start with `useClarityChat` integration** - Simplest approach
2. **Use `useOptimizedChatContext` for async strategies** - Full async support
3. **Monitor token stats** - Track optimization impact
4. **Set realistic budgets** - Leave 20-30% for responses
5. **Use `usePromptInspector` in development** - Understand token usage

## Limitations

- Transform functions are synchronous - Async strategies fall back in `useClarityChat`
- Token estimation is approximate - Consider `tiktoken` for production
- Summarization requires external function - Provide `summarizeFn` for best results

## See Also

- [Full Documentation](../../docs/prompt-optimization.md)
- [Implementation Summary](../PROMPT_OPTIMIZATION_SUMMARY.md)
- [Final Implementation Notes](../PROMPT_OPTIMIZATION_FINAL.md)
