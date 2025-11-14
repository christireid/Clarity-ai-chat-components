# Prompt & Token Optimization Layer

An optional addon layer for advanced prompt composition and token optimization, built around the **toon** prompt DSL.

> 🚀 **Quick Start**: See [GETTING_STARTED.md](./GETTING_STARTED.md) for a 5-minute setup guide.

## Overview

This layer provides:

- **Toon DSL**: A composable, type-safe DSL for building prompts
- **Token-aware context management**: Keep conversations under token budgets
- **Model-aware optimization**: Works with different models (OpenAI, Anthropic, etc.)
- **React hooks**: Easy integration with React applications
- **Opt-in design**: Safe to use without breaking existing code

## Quick Start

### Enable in useClarityChat

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
      strategy: 'hybrid',
      model: 'gpt-4',
    },
  })

  return (
    <div>
      {chat.messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {chat.tokenStats && (
        <div>
          Tokens: {chat.tokenStats.inputTokens} / {chat.tokenStats.remainingBudget + chat.tokenStats.inputTokens}
          {chat.tokenStats.wasOptimized && (
            <span> (Optimized: {chat.tokenStats.lastOptimizationReason})</span>
          )}
        </div>
      )}
    </div>
  )
}
```

## Core Concepts

### Toon DSL

The **toon** (Template Object-Oriented Notation) DSL provides a structured way to compose prompts:

```tsx
import { toon } from '@clarity-chat/react/prompt'

const prompt = toon()
  .role('system', (b) =>
    b.text('You are a helpful assistant.')
      .conditional('userName', (b) => b.text(' You are talking to {{userName}}.'))
  )
  .role('user', (b) => b.variable('userInput', { required: true }))
  .build()
```

### Prompt Recipes

Reusable prompt patterns:

```tsx
import { createPromptRecipe, BUILT_IN_RECIPES } from '@clarity-chat/react/prompt'

// Use built-in recipe
const chatbotRecipe = BUILT_IN_RECIPES.chatbot()

// Or create custom recipe
const customRecipe = createPromptRecipe('my-recipe', 'My Recipe', {
  systemPrompt: (b) => b.text('Custom system prompt'),
  userMessage: (b) => b.variable('input', { required: true }),
})
```

### Token Budget Management

```tsx
import { useTokenBudget } from '@clarity-chat/react/prompt'

function MyComponent({ messages }) {
  const budget = useTokenBudget({
    messages,
    modelMetadata: 'gpt-4',
    targetBudget: 4000,
  })

  if (budget.isExceeded) {
    const { optimizedMessages } = await budget.optimize('hybrid')
    // Use optimizedMessages
  }
}
```

## API Reference

### Core Utilities

#### `toon()`

Create a new toon builder:

```tsx
import { toon } from '@clarity-chat/react/prompt'

const prompt = toon()
  .text('Hello')
  .variable('name')
  .build()
```

#### `createPromptRecipe(id, name, options)`

Create a reusable prompt recipe:

```tsx
import { createPromptRecipe } from '@clarity-chat/react/prompt'

const recipe = createPromptRecipe('qa', 'QA Recipe', {
  systemPrompt: (b) => b.text('Answer questions based on context'),
  userMessage: (b) => b.text('Context: {{context}}\nQuestion: {{question}}'),
})
```

#### `estimatePromptTokens(node, variables, tokenizer)`

Estimate tokens for a prompt:

```tsx
import { estimatePromptTokens } from '@clarity-chat/react/prompt'

const tokens = estimatePromptTokens(prompt, { name: 'Alice' })
```

#### `optimizeMessagesForBudget(messages, options)`

Optimize messages to fit a token budget:

```tsx
import { optimizeMessagesForBudget } from '@clarity-chat/react/prompt'

const { optimizedMessages, diagnostics } = await optimizeMessagesForBudget(
  messages,
  {
    targetTokens: 4000,
    strategy: 'hybrid',
  }
)
```

#### `buildModelPrompt(options)`

Build a final, model-ready prompt:

```tsx
import { buildModelPrompt, MODEL_PRESETS } from '@clarity-chat/react/prompt'

const result = await buildModelPrompt({
  recipe: myRecipe,
  variables: { input: 'Hello' },
  modelMetadata: MODEL_PRESETS['gpt-4'],
  targetTokens: 4000,
  optimization: { enabled: true, strategy: 'hybrid' },
})
```

### React Hooks

#### `usePromptRecipe(options)`

Build prompts from recipes:

```tsx
import { usePromptRecipe } from '@clarity-chat/react/prompt'

const { buildPrompt, estimateTokens, debugView } = usePromptRecipe({
  recipe: myRecipe,
  variables: { name: 'Alice' },
  debug: true,
})

const messages = buildPrompt()
```

#### `useTokenBudget(options)`

Manage token budgets:

```tsx
import { useTokenBudget } from '@clarity-chat/react/prompt'

const budget = useTokenBudget({
  messages,
  modelMetadata: 'gpt-4',
  targetBudget: 4000,
})

// Access: budget.currentTokens, budget.remainingBudget, budget.optimize()
```

#### `useOptimizedChatContext(options)`

Automatically optimize chat context:

```tsx
import { useOptimizedChatContext } from '@clarity-chat/react/prompt'

const { optimizedMessages, tokenStats, lastOptimizationReason } =
  useOptimizedChatContext({
    messages,
    memoryContext: memoryResults,
    modelMetadata: 'gpt-4',
    targetTokens: 4000,
    strategy: 'hybrid',
  })
```

#### `usePromptInspector(options)`

Inspect prompts (dev tool):

```tsx
import { usePromptInspector } from '@clarity-chat/react/prompt'

const inspector = usePromptInspector({
  messages,
  modelMetadata: 'gpt-4',
  detailed: true,
})

console.log(inspector.formattedView.summary)
console.log(inspector.breakdown)
```

## Optimization Strategies

### `sliding-window`

Keep only the N most recent messages:

```tsx
strategy: 'sliding-window',
keepRecent: 5, // Keep 5 most recent messages
```

### `summarize-old`

Summarize older messages:

```tsx
strategy: 'summarize-old',
summarizeFn: async (messages) => {
  // Call your summarization API
  return summary
},
keepRecent: 2,
```

### `drop-low-priority`

Drop messages based on priority scores:

```tsx
strategy: 'drop-low-priority',
priorities: [
  { messageId: 'msg-1', priority: 0.9, reason: 'Important' },
  { messageId: 'msg-2', priority: 0.3, reason: 'Less important' },
],
```

### `hybrid`

Combine multiple strategies (default):

```tsx
strategy: 'hybrid', // Tries drop-low-priority, then summarize-old, then sliding-window
```

## Model Presets

Built-in model presets with token limits and pricing:

```tsx
import { MODEL_PRESETS } from '@clarity-chat/react/prompt'

MODEL_PRESETS['gpt-4'] // GPT-4 preset
MODEL_PRESETS['gpt-3.5-turbo'] // GPT-3.5 Turbo preset
MODEL_PRESETS['claude-3-opus'] // Claude 3 Opus preset
MODEL_PRESETS['claude-3-sonnet'] // Claude 3 Sonnet preset
MODEL_PRESETS['claude-3-haiku'] // Claude 3 Haiku preset
```

## Examples

See `apps/examples/prompt-optimization-example.tsx` for a complete example.

## Opt-in Design

This layer is **completely optional**. You can:

- Use Clarity without any prompt optimization (default behavior)
- Enable optimization in `useClarityChat` with a few lines
- Use individual hooks and utilities as needed
- Mix and match with existing code

No breaking changes to existing APIs.
