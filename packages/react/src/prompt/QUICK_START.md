# Quick Start: Prompt & Token Optimization

Get started with prompt and token optimization in under 5 minutes.

## Enable in useClarityChat (Simplest)

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,  // Keep under 4K tokens
      strategy: 'hybrid',   // Smart optimization
      model: 'gpt-4',      // Model for token counting
    },
  })

  return (
    <div>
      {/* Your chat UI */}
      {chat.messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      {/* Token stats */}
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

That's it! Clarity will automatically:
- Count tokens for each message
- Optimize when approaching the budget
- Keep the most important/recent messages
- Summarize old messages if needed

## Use Standalone Hooks

### Track Token Budget

```tsx
import { useTokenBudget } from '@clarity-chat/react/prompt'

function TokenTracker({ messages }) {
  const budget = useTokenBudget({
    messages,
    modelMetadata: 'gpt-4',
    targetBudget: 4000,
  })

  return (
    <div>
      <div>Tokens: {budget.currentTokens} / {budget.currentTokens + budget.remainingBudget}</div>
      <div>Utilization: {(budget.utilization * 100).toFixed(1)}%</div>
      {budget.isExceeded && (
        <button onClick={() => budget.optimize('hybrid')}>
          Optimize
        </button>
      )}
    </div>
  )
}
```

### Build Prompts with Recipes

```tsx
import { usePromptRecipe, BUILT_IN_RECIPES } from '@clarity-chat/react/prompt'

function RecipeExample() {
  const recipe = BUILT_IN_RECIPES.chatbot()
  const { buildPrompt, estimateTokens } = usePromptRecipe({
    recipe,
    variables: { userName: 'Alice', userInput: 'Hello!' },
  })

  const messages = buildPrompt()
  const tokens = estimateTokens()

  return <div>Tokens: {tokens}</div>
}
```

### Inspect Prompts (Dev Tool)

```tsx
import { usePromptInspector } from '@clarity-chat/react/prompt'

function DevPanel({ messages }) {
  const inspector = usePromptInspector({
    messages,
    modelMetadata: 'gpt-4',
    detailed: true,
  })

  return (
    <div>
      <div>{inspector.formattedView.summary}</div>
      <div>
        {Object.entries(inspector.byRole).map(([role, stats]) => (
          <div key={role}>
            {role}: {stats.tokens} tokens ({stats.percentage.toFixed(1)}%)
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Optimization Strategies

Choose the right strategy for your use case:

### `sliding-window` - Keep Recent Messages
Best for: Real-time chat, keeping conversation fresh

```tsx
strategy: 'sliding-window',
keepRecent: 5,  // Keep 5 most recent messages
```

### `summarize-old` - Compress History
Best for: Long conversations, preserving context

```tsx
strategy: 'summarize-old',
summarizeFn: async (messages) => {
  // Call your summarization API
  const response = await fetch('/api/summarize', {
    method: 'POST',
    body: JSON.stringify({ messages }),
  })
  return response.json().summary
},
keepRecent: 2,
```

### `drop-low-priority` - Smart Filtering
Best for: When you have message importance scores

```tsx
strategy: 'drop-low-priority',
priorities: [
  { messageId: 'msg-1', priority: 0.9, reason: 'Important context' },
  { messageId: 'msg-2', priority: 0.3, reason: 'Less important' },
],
```

### `hybrid` - Best of All (Default)
Best for: Most use cases, automatically tries multiple strategies

```tsx
strategy: 'hybrid',  // Default - tries drop-low-priority, then summarize-old, then sliding-window
```

## Model Presets

Built-in presets with token limits and pricing:

```tsx
import { MODEL_PRESETS } from '@clarity-chat/react/prompt'

MODEL_PRESETS['gpt-4']           // 8K tokens, $0.03/$0.06 per 1K
MODEL_PRESETS['gpt-4-turbo']     // 128K tokens, $0.01/$0.03 per 1K
MODEL_PRESETS['gpt-3.5-turbo']  // 16K tokens, $0.0015/$0.002 per 1K
MODEL_PRESETS['claude-3-opus']  // 200K tokens, $0.015/$0.075 per 1K
MODEL_PRESETS['claude-3-sonnet'] // 200K tokens, $0.003/$0.015 per 1K
MODEL_PRESETS['claude-3-haiku']  // 200K tokens, $0.00025/$0.00125 per 1K
```

## Next Steps

- Read the [full documentation](./README.md)
- Check out [complete examples](../../../apps/examples/prompt-optimization-example.tsx)
- Explore the [toon DSL](./README.md#toon-dsl) for advanced prompt composition
