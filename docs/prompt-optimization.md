# Prompt & Token Optimization Layer

The Prompt & Token Optimization layer is an **optional addon** for Clarity AI Chat Components that provides advanced control over prompt composition and token management. This layer is built around a lightweight prompt DSL ("toon") and offers React hooks and utilities for token-aware context management.

## What This Layer Does

This layer provides:

1. **Prompt Pipeline Ergonomics**
   - Easy composition of system + user + tool messages
   - Clear separation of "template" vs "runtime values"
   - Reusable prompt "recipes" (chatbot, QA over docs, tool-using agent, etc.)

2. **Token-Aware Context Management**
   - Estimate tokens for message lists and prompt DSL trees
   - Keep conversations under a target token budget
   - Multiple optimization strategies:
     - Sliding window (keep most recent messages)
     - Summarization of older messages
     - Dropping low-value messages
     - Hybrid approach (combines multiple strategies)

3. **Model-Aware Optimization**
   - Accept model metadata (max tokens, pricing, etc.)
   - Different strategies per model class
   - Cost estimation

4. **Opt-in Design**
   - Completely optional - Clarity works fine without it
   - Advanced users can "turn on" optimization in a few lines
   - No breaking changes to existing APIs

## Quick Start

### Enable in useClarityChat

The simplest way to enable prompt optimization is via `useClarityChat`:

```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, tokenStats } = useClarityChat({
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

// tokenStats provides:
// - currentTokens: number
// - targetTokens: number
// - remainingTokens: number
// - isExceeded: boolean
// - usagePercent: number
```

### Using Core Utilities

For more control, use the core utilities directly:

```tsx
import {
  createPromptRecipe,
  estimatePromptTokens,
  optimizeMessagesForBudget,
  buildModelPrompt,
} from '@clarity-chat/react/prompt'

// Create a prompt recipe
const recipe = createPromptRecipe({
  id: 'chatbot',
  name: 'Chatbot Assistant',
  system: 'You are a helpful assistant named {{name}}.',
  user: '{{userMessage}}',
  variables: [
    { name: 'name', required: true },
    { name: 'userMessage', required: true },
  ],
})

// Build a prompt
const prompt = recipe.build({
  name: 'Clarity',
  userMessage: 'Hello!',
})

// Estimate tokens
const tokens = estimatePromptTokens(prompt, { model: 'gpt-4' })

// Optimize messages
const { messages, diagnostics } = await optimizeMessagesForBudget(
  messages,
  4000,
  {
    strategy: 'hybrid',
    model: { id: 'gpt-4', maxTokens: 8192 },
  }
)
```

### Using React Hooks

For React applications, use the provided hooks:

```tsx
import {
  usePromptRecipe,
  useTokenBudget,
  useOptimizedChatContext,
  usePromptInspector,
} from '@clarity-chat/react/prompt'

// Build prompts from recipes
const { buildPrompt } = usePromptRecipe({
  recipe: myRecipe,
  initialVariables: { name: 'Clarity' },
})

// Track token budget
const { currentTokens, remainingBudget, optimize } = useTokenBudget({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192, inputPricePer1K: 0.03 },
  targetBudget: 4000,
  budgetUnit: 'tokens',
})

// Auto-optimize chat context
const { optimizedMessages, tokenStats } = useOptimizedChatContext({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetTokens: 4000,
  strategy: 'hybrid',
})

// Inspect prompts (dev tool)
const { inspection } = usePromptInspector({
  messages,
  model: 'gpt-4',
  enabled: process.env.NODE_ENV === 'development',
})
```

## Examples

### Example 1: Keep Under 4K Tokens

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
        id: 'gpt-4',
        maxTokens: 8192,
        inputPricePer1K: 0.03,
      },
    },
  })

  return (
    <div>
      <ChatWindow messages={messages} onSend={append} />
      {tokenStats && (
        <div className="token-stats">
          <div>Tokens: {tokenStats.currentTokens} / {tokenStats.targetTokens}</div>
          <div>Remaining: {tokenStats.remainingTokens}</div>
          {tokenStats.isExceeded && (
            <div className="warning">Budget exceeded!</div>
          )}
        </div>
      )}
    </div>
  )
}
```

### Example 2: Prompt Recipe with Variables

```tsx
import { createPromptRecipe, usePromptRecipe } from '@clarity-chat/react/prompt'

const qaRecipe = createPromptRecipe({
  id: 'qa',
  name: 'Q&A Assistant',
  system: `You are a helpful assistant that answers questions about {{topic}}.
  
Context:
{{context}}`,
  user: '{{question}}',
  variables: [
    { name: 'topic', required: true },
    { name: 'context', required: true },
    { name: 'question', required: true },
  ],
})

function QAComponent() {
  const { buildPrompt } = usePromptRecipe({
    recipe: qaRecipe,
  })

  const handleQuestion = (question: string) => {
    const prompt = buildPrompt({
      topic: 'React',
      context: 'React is a JavaScript library...',
      question,
    })
    
    // Send prompt.messages to your API
  }

  return <div>...</div>
}
```

### Example 3: Debug Panel with Token Inspector

```tsx
import { useClarityChat } from '@clarity-chat/react'
import { usePromptInspector } from '@clarity-chat/react/prompt'

function ChatWithDebugPanel() {
  const { messages } = useClarityChat({ api: '/api/chat' })
  const { inspection } = usePromptInspector({
    messages,
    model: 'gpt-4',
    enabled: true, // Set to false in production
  })

  return (
    <div className="chat-container">
      <ChatWindow messages={messages} />
      
      {inspection && (
        <div className="debug-panel">
          <h3>Token Breakdown</h3>
          <div>Total: {inspection.totalTokens} tokens</div>
          
          <h4>By Role</h4>
          {Object.entries(inspection.roleBreakdown).map(([role, tokens]) => (
            <div key={role}>
              {role}: {tokens} tokens
            </div>
          ))}
          
          <h4>By Message</h4>
          {inspection.messageBreakdown.map((msg, i) => (
            <div key={i}>
              <strong>{msg.role}</strong>: {msg.tokens} tokens
              <div className="preview">{msg.contentPreview}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Optimization Strategies

### Sliding Window (`sliding-window`)

Keeps only the most recent N messages that fit within the token budget. Always preserves system messages.

**Best for:** Simple conversations where recent context is most important.

### Summarize Old (`summarize-old`)

Summarizes older messages into a single summary message, keeping recent messages intact.

**Best for:** Long conversations where you want to preserve context but reduce tokens.

### Drop Low Priority (`drop-low-priority`)

Drops messages with lower priority scores, keeping high-priority messages.

**Best for:** When you can assign priorities to messages.

### Hybrid (`hybrid`)

Combines multiple strategies:
- Summarizes very old messages
- Drops low-priority moderately old messages
- Keeps recent messages intact

**Best for:** Complex scenarios requiring multiple optimization techniques.

## API Reference

### Core Utilities

#### `createPromptRecipe(template)`

Creates a composable prompt recipe from a template.

#### `estimatePromptTokens(prompt, options?)`

Estimates token count for a resolved prompt.

#### `optimizeMessagesForBudget(messages, targetTokens, options?)`

Optimizes messages to fit within a token budget.

#### `buildModelPrompt(options)`

Builds a model-ready prompt from various components (tools, memory, history, etc.).

### React Hooks

#### `usePromptRecipe(options)`

Hook for building prompts from recipes.

#### `useTokenBudget(options)`

Hook for tracking token usage and budget management.

#### `useOptimizedChatContext(options)`

Hook that automatically optimizes messages for token budgets.

#### `usePromptInspector(options)`

Dev tool hook for inspecting prompt composition and token usage.

## Model Support

The layer includes built-in metadata for common models:

- GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- Claude 3 Opus, Sonnet, Haiku
- Gemini Pro, Ultra

You can also provide custom model metadata:

```tsx
const customModel = {
  id: 'my-model',
  maxTokens: 10000,
  inputPricePer1K: 0.01,
  outputPricePer1K: 0.02,
  tokensPerChar: 0.25, // Optional, for token estimation
}
```

## Token Estimation

Token estimation uses approximate character-to-token ratios. For production use, consider integrating with:

- `tiktoken` (OpenAI models)
- Model-specific tokenizers
- Custom tokenization functions

You can provide a custom tokenizer:

```tsx
import { estimatePromptTokens } from '@clarity-chat/react/prompt'
import { encoding_for_model } from 'tiktoken'

const tokenizer = (text: string) => {
  const encoding = encoding_for_model('gpt-4')
  return encoding.encode(text).length
}

const tokens = estimatePromptTokens(prompt, {
  tokenizer,
})
```

## Best Practices

1. **Start Simple**: Enable basic optimization in `useClarityChat` first
2. **Monitor Token Usage**: Use `tokenStats` to track usage over time
3. **Choose Appropriate Strategy**: Match strategy to your use case
4. **Test Optimization**: Verify that optimization doesn't degrade quality
5. **Use Debug Tools**: Leverage `usePromptInspector` during development

## Migration Guide

### From Basic useClarityChat

```tsx
// Before
const { messages } = useClarityChat({ api: '/api/chat' })

// After (add prompt optimization)
const { messages, tokenStats } = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'sliding-window',
  },
})
```

### Adding Token Budget Tracking

```tsx
// Add useTokenBudget hook
import { useTokenBudget } from '@clarity-chat/react/prompt'

const { currentTokens, remainingBudget } = useTokenBudget({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetBudget: 4000,
})
```

## Troubleshooting

### Optimization Not Working

- Ensure `promptOptimization.enabled` is `true`
- Check that `targetTokens` is set
- Verify model metadata is provided

### Token Counts Seem Off

- Token estimation is approximate (character-based)
- For accurate counts, use a custom tokenizer
- Model-specific ratios may vary

### Messages Being Dropped Unexpectedly

- Check optimization strategy
- Verify message priorities (if using `drop-low-priority`)
- Consider adjusting `targetTokens`

## See Also

- [useClarityChat Documentation](../packages/react/src/hooks/USE_CLARITY_CHAT.md)
- [Memory System Documentation](../packages/react/src/memory/README.md)
- [Core Types](../packages/types/src/message.ts)
