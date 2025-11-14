# Getting Started with Prompt Optimization

Welcome! This guide will get you up and running in under 2 minutes.

## 🎯 Choose Your Path

### Path 1: Zero Configuration (Recommended for Most Users)

**Best for:** Quick setup, standard use cases

```tsx
import { useQuickOptimize } from '@clarity-chat/react'

const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
})
```

**Done!** That's all you need. See [Quick Start Guide](./SETUP_GUIDE.md) for details.

### Path 2: useClarityChat Integration

**Best for:** Already using `useClarityChat`, want built-in optimization

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

### Path 3: Full Control

**Best for:** Advanced users who need fine-grained control

```tsx
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react'

const optimizer = usePromptOptimizer({
  messages: chatMessages,
  model: getModelProfile('gpt-4')!,
  targetTokens: 4000,
  options: {
    enableSemanticPrioritization: true,
    enableCompression: true,
    // ... full control
  },
})
```

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Frictionless setup instructions
- **[Quick Start](./docs/quick-start-optimization.md)** - 60-second quick start
- **[Basic Optimization](./docs/prompt-optimization.md)** - Core features
- **[Advanced Optimization](./docs/advanced-prompt-optimization.md)** - Advanced features

## 🎨 Examples

- **[Quick Start Example](./examples/quick-start-example.tsx)** - Simplest possible example
- **[Basic Example](./examples/prompt-optimization-example.tsx)** - Standard usage
- **[Advanced Example](./examples/advanced-optimization-example.tsx)** - Full features

## 🚀 Common Use Cases

### Use Case 1: Simple Chat Optimization

```tsx
const chat = useClarityChat({ api: '/api/chat' })
const { optimizedMessages } = useQuickOptimize({
  messages: chat.messages,
  model: 'gpt-4',
})

<ChatWindow messages={optimizedMessages} />
```

### Use Case 2: Cost-Conscious Application

```tsx
const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
  preset: 'costOptimized', // Prioritizes cost savings
})
```

### Use Case 3: Quality-Critical Application

```tsx
const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
  preset: 'qualityFirst', // Prioritizes quality
})
```

### Use Case 4: Custom Token Budget

```tsx
const { optimizedMessages } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
  targetTokens: 4000, // Custom budget
})
```

## 💡 Pro Tips

1. **Start simple** - Use `useQuickOptimize` with defaults
2. **Try presets** - They cover 90% of use cases
3. **Monitor stats** - Check `tokenStats` to see savings
4. **Add summarization** - For better compression (optional)

## ❓ FAQ

### Which hook should I use?

- **`useQuickOptimize`** - Simplest, zero config
- **`useClarityChat` with optimization** - Built-in, automatic
- **`usePromptOptimizer`** - Full control, advanced

### What model should I use?

Any model from the [supported list](./SETUP_GUIDE.md#-supported-models-out-of-the-box) works. Default: `gpt-4`.

### Do I need to configure anything?

No! Defaults work great. Only configure if you need specific behavior.

### How do I know if optimization is working?

Check `tokenStats` or `wasOptimized` flag:

```tsx
const { optimizedMessages, wasOptimized, tokenStats } = useQuickOptimize({
  messages: chatMessages,
  model: 'gpt-4',
})

if (wasOptimized) {
  console.log(`Saved ${tokenStats.saved} tokens!`)
}
```

## 🎉 You're Ready!

Pick a path above and start optimizing. For more details, check the [Setup Guide](./SETUP_GUIDE.md).
