# Quick Start: Prompt Optimization

Get started with prompt optimization in under 60 seconds.

## Simplest Possible Usage

```tsx
import { useQuickOptimize } from '@clarity-chat/react'

const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4', // That's it!
})
```

## One-Line Integration

```tsx
import { useClarityChat, useQuickOptimize } from '@clarity-chat/react'

const chat = useClarityChat({ api: '/api/chat' })
const { optimizedMessages } = useQuickOptimize({
  messages: chat.messages,
  model: 'gpt-4',
})

// Use optimized messages
<ChatWindow messages={optimizedMessages} />
```

## With Presets

```tsx
const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
  preset: 'standard', // or 'minimal', 'production', 'enterprise'
})
```

## Programmatic Usage

```tsx
import { quickOptimizeMessages } from '@clarity-chat/react'

const result = await quickOptimizeMessages(
  messages,
  'gpt-4',
  { preset: 'standard' }
)

console.log(result.tokenStats) // { original, optimized, saved }
```

## Presets Explained

- **`minimal`** - Lightweight optimization with basic features
- **`standard`** (default) - Good balance of quality and efficiency
- **`production`** - Ready to use with comprehensive features
- **`enterprise`** - Maximum features with advanced optimizations

## Available Models

All these models work out of the box:

- `gpt-4`, `gpt-4-turbo`, `gpt-4-mini`, `gpt-3.5-turbo`
- `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`
- `gemini-1.5-pro`, `gemini-1.5-flash`
- `mistral-large`, `mistral-small`

## Advanced Usage

For more control, see:
- [Basic Prompt Optimization](./prompt-optimization.md)
- [Advanced Prompt Optimization](./advanced-prompt-optimization.md)

## Troubleshooting

### Model not found?

```tsx
import { getAvailableModels } from '@clarity-chat/react'

console.log(getAvailableModels()) // List all available models
```

### Need custom configuration?

```tsx
import { quickSetup } from '@clarity-chat/react'

const config = quickSetup({
  model: 'gpt-4',
  targetTokens: 4000,
  preset: 'standard',
  customConfig: {
    // Your custom options
  },
})
```

## Next Steps

1. Try different presets to find what works best
2. Add summarization function for better compression
3. Explore advanced features for fine-grained control
