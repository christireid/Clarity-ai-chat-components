# Quick Start: Prompt & Token Optimization

Get started with prompt and token optimization in 5 minutes.

## 1. Enable in useClarityChat (Simplest)

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
      strategy: 'sliding-window',
    },
  })

  return (
    <div>
      <ChatWindow messages={messages} onSend={append} />
      {tokenStats && (
        <div>
          Tokens: {tokenStats.currentTokens} / {tokenStats.targetTokens}
        </div>
      )}
    </div>
  )
}
```

## 2. Use a Prompt Recipe

```tsx
import { createQARecipe, usePromptRecipe } from '@clarity-chat/react/prompt'

function QAComponent() {
  const recipe = createQARecipe()
  const { buildPrompt } = usePromptRecipe({ recipe })

  const handleQuestion = (question: string) => {
    const prompt = buildPrompt({
      context: 'React is a JavaScript library...',
      question,
    })
    
    // Send prompt.messages to your API
  }
}
```

## 3. Track Token Budget

```tsx
import { useTokenBudget } from '@clarity-chat/react/prompt'

function BudgetTracker({ messages }) {
  const { currentTokens, remainingBudget, isExceeded } = useTokenBudget({
    messages,
    model: { id: 'gpt-4', maxTokens: 8192 },
    targetBudget: 4000,
  })

  return (
    <div>
      <div>Tokens: {currentTokens} / 4000</div>
      <div>Remaining: {remainingBudget}</div>
      {isExceeded && <div className="warning">Budget exceeded!</div>}
    </div>
  )
}
```

## 4. Auto-Optimize Chat Context

```tsx
import { useOptimizedChatContext } from '@clarity-chat/react/prompt'

function OptimizedChat({ messages }) {
  const { optimizedMessages, tokenStats } = useOptimizedChatContext({
    messages,
    model: { id: 'gpt-4', maxTokens: 8192 },
    targetTokens: 4000,
    strategy: 'hybrid',
  })

  // Use optimizedMessages instead of messages
  return <ChatWindow messages={optimizedMessages} />
}
```

## 5. Inspect Prompts (Dev Tool)

```tsx
import { usePromptInspector } from '@clarity-chat/react/prompt'

function DebugPanel({ messages }) {
  const { inspection } = usePromptInspector({
    messages,
    model: 'gpt-4',
    enabled: process.env.NODE_ENV === 'development',
  })

  if (!inspection) return null

  return (
    <div className="debug-panel">
      <div>Total: {inspection.totalTokens} tokens</div>
      {inspection.messageBreakdown.map((msg, i) => (
        <div key={i}>
          {msg.role}: {msg.tokens} tokens
        </div>
      ))}
    </div>
  )
}
```

## Next Steps

- Read the [full documentation](../../../docs/prompt-optimization.md)
- Check out [examples](./examples/)
- Explore [pre-built recipes](./core/recipes.ts)
