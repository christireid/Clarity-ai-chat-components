# Prompt & Token Optimization

The Prompt & Token Optimization layer provides advanced control over prompt composition and token management for AI chat applications. This is an **optional addon layer** that works seamlessly with Clarity's existing chat system.

## What This Layer Does

The prompt optimization layer provides:

1. **Prompt Pipeline Ergonomics** - Easy composition of system + user + tool messages using templates
2. **Token-Aware Context Management** - Estimate tokens, keep conversations under budget, and apply optimization strategies
3. **Model-Aware Optimization** - Works with different models (OpenAI, Anthropic, etc.) with accurate token estimation
4. **Opt-in Design** - Completely optional; existing code continues to work without changes

## Quick Start

### Enable in useClarityChat

The simplest way to enable prompt optimization is via `useClarityChat`:

```tsx
import { useClarityChat } from '@clarity-chat/react'

function ChatComponent() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
      strategy: 'sliding-window',
      model: {
        model: 'gpt-4',
        maxTokens: 8000,
        inputPricePer1K: 0.03,
        tokenizer: 'openai',
      },
    },
  })

  return (
    <div>
      {tokenStats && (
        <div>
          <p>Tokens: {tokenStats.optimized} / {tokenStats.original}</p>
          {tokenStats.wasOptimized && (
            <p>Saved: {tokenStats.saved} tokens</p>
          )}
        </div>
      )}
      {/* Your chat UI */}
    </div>
  )
}
```

That's it! In under 10 lines, you've enabled automatic token optimization.

## Core Concepts

### Prompt Recipes

A **prompt recipe** defines how to compose prompts from templates:

```tsx
import { createPromptRecipe } from '@clarity-chat/react'

const recipe = createPromptRecipe({
  system: 'You are a helpful assistant.',
  user: 'User: {{userInput}}',
  metadata: {
    name: 'Chatbot',
    description: 'Simple conversational assistant',
  },
})

const result = recipe.build({
  userInput: 'Hello',
  history: [],
}, {
  model: 'gpt-4',
  maxTokens: 8000,
})

// result.messages - Ready-to-send message array
// result.tokenEstimate - Token count and breakdown
```

### Token Estimation

Estimate tokens for messages or templates:

```tsx
import { estimatePromptTokens } from '@clarity-chat/react'

const estimate = estimatePromptTokens(messages, {
  model: 'gpt-4',
  maxTokens: 8000,
  tokenizer: 'openai',
})

console.log(estimate.tokens) // Total tokens
console.log(estimate.breakdown) // By role
console.log(estimate.estimatedCost) // Cost in USD
```

### Optimization Strategies

Four strategies are available:

1. **`sliding-window`** - Keep most recent N messages
2. **`summarize-old`** - Summarize older messages
3. **`drop-low-priority`** - Drop low-priority messages
4. **`hybrid`** - Combine strategies (default)

## React Hooks

### usePromptRecipe

Build prompts from recipes:

```tsx
import { usePromptRecipe } from '@clarity-chat/react'

const { buildPrompt } = usePromptRecipe({
  recipe: {
    system: 'You are a helpful assistant.',
    user: '{{userInput}}',
  },
  model: { model: 'gpt-4', maxTokens: 8000 },
})

const result = buildPrompt({
  userInput: 'Hello',
  history: [],
})
```

### useTokenBudget

Manage token budgets:

```tsx
import { useTokenBudget } from '@clarity-chat/react'

const { currentTokens, remainingBudget, optimize } = useTokenBudget({
  messages,
  model: { model: 'gpt-4', maxTokens: 8000 },
  targetBudget: { tokens: 4000 },
})

const optimized = optimize(messages, 'sliding-window')
```

### useOptimizedChatContext

Automatically optimize chat context:

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

### usePromptInspector

Dev tool for inspecting prompts:

```tsx
import { usePromptInspector } from '@clarity-chat/react'

const inspector = usePromptInspector({
  messages,
  model: { model: 'gpt-4', maxTokens: 8000 },
})

// Render in debug panel
<div>
  <p>Tokens: {inspector.totalTokens} / 8000</p>
  <p>Budget: {inspector.budgetPercentage.toFixed(1)}%</p>
  {inspector.messageInspections.map((msg, i) => (
    <div key={i}>
      {msg.role}: {msg.tokens} tokens
    </div>
  ))}
</div>
```

## Examples

### Keep Under 4K Tokens

```tsx
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

### Custom Summarization

```tsx
const summarizeMessages = async (messages: CoreMessage[]) => {
  // Call your summarization API
  const response = await fetch('/api/summarize', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })
  const { summary } = await response.json()
  return summary
}

const { messages } = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'summarize-old',
    summarizeFn: summarizeMessages,
    model: {
      model: 'gpt-4',
      maxTokens: 8000,
    },
  },
})
```

## Built-in Recipes

Pre-built recipes for common patterns:

```tsx
import { builtInRecipes } from '@clarity-chat/react'

// Simple chatbot
const chatbot = builtInRecipes.chatbot

// QA over documents
const qa = builtInRecipes.qa

// Tool-using agent
const agent = builtInRecipes.agent
```

## Model Support

The layer supports multiple models with appropriate tokenizers:

- **OpenAI** (`tokenizer: 'openai'`) - GPT-3.5, GPT-4, etc.
- **Anthropic** (`tokenizer: 'anthropic'`) - Claude models
- **Approximate** (`tokenizer: 'approximate'`) - Fallback for other models

## API Reference

### Core Utilities

- `createPromptRecipe(definition)` - Create a prompt recipe builder
- `estimatePromptTokens(messages, model)` - Estimate tokens
- `optimizeMessagesForBudget(messages, options, model)` - Optimize messages
- `summarizeHistoryForCompression(messages, summarizeFn?)` - Summarize history
- `buildModelPrompt(context, model, options?)` - Build final prompt

### React Hooks

- `usePromptRecipe(options)` - Build prompts from recipes
- `useTokenBudget(options)` - Manage token budgets
- `useOptimizedChatContext(options)` - Auto-optimize context
- `usePromptInspector(options)` - Inspect prompts (dev tool)

## How It Relies on the Prompt Template System

The optimization layer builds on Clarity's existing prompt template system (`packages/react/src/prompts/`). Recipes use the same template syntax with variables (`{{variable}}`), making it easy to compose prompts.

## Opt-in Design

- **No breaking changes** - Existing code works without modification
- **Optional imports** - Only import what you need
- **Progressive enhancement** - Add optimization incrementally
- **Safe defaults** - Sensible defaults when options aren't specified

## Best Practices

1. **Start simple** - Enable optimization in `useClarityChat` first
2. **Monitor token stats** - Use `tokenStats` to understand optimization impact
3. **Choose the right strategy** - `sliding-window` for most cases, `summarize-old` for long conversations
4. **Set realistic budgets** - Leave room for responses (typically 20-30% of max tokens)
5. **Use `usePromptInspector` in development** - Understand token usage before optimizing

## Important Notes

### Async Strategies in Transform Functions

When using `promptOptimization` in `useClarityChat`, the optimization happens in a synchronous `transform` function. This means:

- ✅ **Synchronous strategies work**: `sliding-window`, `drop-low-priority`
- ⚠️ **Async strategies fall back**: `summarize-old` and `hybrid` with `summarizeFn` will fall back to `sliding-window` in transform functions
- 💡 **For async strategies**: Use `useOptimizedChatContext` hook instead, which supports full async optimization

### Example: Using Async Strategies

```tsx
// ❌ Won't work fully in transform (falls back to sliding-window)
useClarityChat({
  promptOptimization: {
    enabled: true,
    strategy: 'summarize-old', // Falls back to sliding-window
    summarizeFn: async (msgs) => { /* ... */ },
  },
})

// ✅ Use hook for async strategies
const { messages } = useClarityChat({ api: '/api/chat' })
const { optimizedMessages } = useOptimizedChatContext({
  messages,
  strategy: 'summarize-old',
  summarizeFn: async (msgs) => { /* ... */ },
})
```

## Troubleshooting

### Optimization not working?

- Ensure `promptOptimization.enabled` is `true`
- Check that `targetTokens` is set
- Verify `model` metadata is provided
- Check that messages exceed `targetTokens` (optimization only applies when needed)
- For async strategies (`summarize-old`), use `useOptimizedChatContext` instead of `promptOptimization` config

### Token counts seem off?

- Use `tokenizer: 'openai'` or `'anthropic'` for accurate counts
- `'approximate'` is a fallback and less accurate
- Consider integrating `tiktoken` for production use

## Next Steps

- See the [example component](./examples/prompt-optimization-example.tsx) for a complete implementation
- Explore the [API reference](../src/prompt/core/types.ts) for detailed type definitions
- Check out [built-in recipes](../src/prompt/core/recipe.ts) for common patterns
