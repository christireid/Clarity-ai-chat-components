# Frictionless Setup Guide

## 🎯 Zero-Configuration Setup

### Option 1: One-Line Hook (Recommended)

```tsx
import { useQuickOptimize } from '@clarity-chat/react'

const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
})
```

**That's it!** Everything else is automatic:
- ✅ Auto-detects optimal token budget (80% of model max)
- ✅ Uses balanced preset by default
- ✅ Auto-optimizes when messages change
- ✅ Handles errors gracefully

### Option 2: useClarityChat Integration

```tsx
import { useClarityChat } from '@clarity-chat/react'

const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'sliding-window',
    model: {
      model: 'gpt-4',
      maxTokens: 8000,
    },
  },
})

// Token stats automatically available
console.log(chat.tokenStats)
```

## 📦 Presets (Choose Your Style)

All presets work out of the box:

```tsx
// Conservative - Maximum quality
useQuickOptimize({ messages, model: 'gpt-4', preset: 'conservative' })

// Balanced - Good balance (default)
useQuickOptimize({ messages, model: 'gpt-4', preset: 'balanced' })

// Aggressive - Maximum savings
useQuickOptimize({ messages, model: 'gpt-4', preset: 'aggressive' })

// Cost Optimized - Prioritize cost
useQuickOptimize({ messages, model: 'gpt-4', preset: 'costOptimized' })

// Quality First - Prioritize quality
useQuickOptimize({ messages, model: 'gpt-4', preset: 'qualityFirst' })
```

## 🤖 Supported Models (Out of the Box)

All these models work immediately:

**OpenAI:**
- `gpt-4`, `gpt-4-turbo`, `gpt-4-mini`, `gpt-3.5-turbo`

**Anthropic:**
- `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`

**Google:**
- `gemini-1.5-pro`, `gemini-1.5-flash`

**Mistral:**
- `mistral-large`, `mistral-small`

## 🛠️ Helper Functions

### Check if optimization needed

```tsx
import { needsOptimization } from '@clarity-chat/react'

if (needsOptimization(messages, 'gpt-4')) {
  // Optimize!
}
```

### Get recommended token budget

```tsx
import { getRecommendedTargetTokens } from '@clarity-chat/react'

const target = getRecommendedTargetTokens('gpt-4') // 6553 for GPT-4
```

### List available models

```tsx
import { getAvailableModels } from '@clarity-chat/react'

console.log(getAvailableModels()) // ['gpt-4', 'claude-3-opus', ...]
```

### Validate configuration

```tsx
import { validateOptimizationConfig } from '@clarity-chat/react'

const { valid, errors } = validateOptimizationConfig({
  model: 'gpt-4',
  targetTokens: 4000,
  preset: 'balanced',
})

if (!valid) {
  console.error('Configuration errors:', errors)
}
```

## 📝 Common Patterns

### Pattern 1: Simple Chat with Optimization

```tsx
const chat = useClarityChat({ api: '/api/chat' })
const { optimizedMessages } = useQuickOptimize({
  messages: chat.messages,
  model: 'gpt-4',
})

<ChatWindow messages={optimizedMessages} />
```

### Pattern 2: With Custom Token Budget

```tsx
const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
  targetTokens: 4000, // Custom budget
})
```

### Pattern 3: With Summarization

```tsx
const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
  summarizeFn: async (msgs) => {
    // Your summarization logic
    return summarize(msgs)
  },
})
```

### Pattern 4: Programmatic Usage

```tsx
import { quickOptimizeMessages } from '@clarity-chat/react'

const result = await quickOptimizeMessages(messages, 'gpt-4', {
  preset: 'balanced',
})

console.log(result.tokenStats) // { original, optimized, saved }
```

## 🎨 Customization (When Needed)

### Custom Preset Configuration

```tsx
import { quickSetup } from '@clarity-chat/react'

const config = quickSetup({
  model: 'gpt-4',
  targetTokens: 4000,
  preset: 'balanced',
  customConfig: {
    enableSemanticPrioritization: true,
    prioritizationWeights: {
      recency: 0.4,
      semanticRelevance: 0.3,
      // ...
    },
  },
})
```

### Full Control

```tsx
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react'

const optimizer = usePromptOptimizer({
  messages: chatMessages,
  model: getModelProfile('gpt-4')!,
  targetTokens: 4000,
  options: {
    // Full control over all options
  },
})
```

## 🐛 Troubleshooting

### Model Not Found?

```tsx
import { getAvailableModels } from '@clarity-chat/react'

// Check available models
const models = getAvailableModels()
console.log('Available:', models)

// Get model info
import { getModelInfo } from '@clarity-chat/react'
const info = getModelInfo('gpt-4')
console.log(info) // { name, maxTokens, costPer1K, style }
```

### Validation Errors?

```tsx
import { validateOptimizationConfig } from '@clarity-chat/react'

const { valid, errors } = validateOptimizationConfig({
  model: 'gpt-4',
  targetTokens: 10000, // Might exceed model max
})

if (!valid) {
  console.error('Errors:', errors)
}
```

## 📚 Next Steps

- **Basic Usage**: See [Quick Start Guide](../docs/quick-start-optimization.md)
- **Advanced Features**: See [Advanced Optimization](../docs/advanced-prompt-optimization.md)
- **Examples**: Check `packages/react/src/prompt/examples/`

## 💡 Pro Tips

1. **Start with defaults** - They work great for most cases
2. **Try different presets** - Find what works best for your use case
3. **Monitor token stats** - See how much you're saving
4. **Add summarization** - For even better compression (optional)

## ✅ Setup Checklist

- [ ] Import `useQuickOptimize` or `useClarityChat` with optimization
- [ ] Choose a model (default: 'gpt-4')
- [ ] Optionally choose a preset (default: 'balanced')
- [ ] Use optimized messages
- [ ] Done! 🎉
