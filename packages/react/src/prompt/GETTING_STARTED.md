# Getting Started: Prompt Optimization

Welcome! This guide will get you up and running with prompt optimization in under 5 minutes.

## What is Prompt Optimization?

Prompt optimization helps you:
- ✅ Stay within token budgets
- ✅ Reduce API costs
- ✅ Improve response quality
- ✅ Handle long conversations
- ✅ Automatically choose the best model

## Three Ways to Get Started

### 1. Zero-Config (Recommended for Beginners)

Just enable it in `useClarityChat`:

```tsx
import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,  // That's all!
    },
  })

  return (
    <div>
      <ChatWindow messages={messages} onSend={append} />
      {tokenStats && (
        <div>Tokens: {tokenStats.currentTokens}</div>
      )}
    </div>
  )
}
```

**What this does:**
- Automatically optimizes your prompts
- Keeps you within token limits
- Shows token usage stats
- No configuration needed!

### 2. Custom Configuration (Recommended for Production)

```tsx
import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,  // Your token budget
      strategy: 'hybrid',   // Optimization strategy
      model: {
        id: 'gpt-4',
        maxTokens: 8192,
        inputPricePer1K: 0.03,
      },
    },
  })

  return <ChatWindow messages={messages} onSend={append} />
}
```

**What this does:**
- Sets a specific token budget (4000 tokens)
- Uses hybrid optimization (best of all strategies)
- Tracks costs for GPT-4
- Automatically optimizes when needed

### 3. Advanced Usage (Full Control)

```tsx
import { 
  usePromptOptimizer, 
  useDynamicModelRouting,
  getModelProfile 
} from '@clarity-chat/react/prompt'

function AdvancedChat({ messages }) {
  // Get model profile (pre-configured)
  const model = getModelProfile('gpt-4')
  
  // Optimize prompts
  const { 
    optimizedMessages, 
    tokenStats,
    diagnostics 
  } = usePromptOptimizer({
    messages,
    model,
    targetTokens: 4000,
    autoOptimize: true,
  })
  
  // Route to best model
  const { decision } = useDynamicModelRouting({
    messages: optimizedMessages,
    currentModel: model,
    availableModels: [
      { model: getModelProfile('gpt-4') },
      { model: getModelProfile('gpt-4o-mini') },
    ],
  })
  
  return (
    <div>
      <ChatWindow messages={optimizedMessages} />
      <div>
        Tokens: {tokenStats.currentTokens} / {tokenStats.targetTokens}
        {decision.shouldSwitch && (
          <button onClick={() => switchModel(decision.recommendedModel)}>
            Switch to {decision.recommendedModel.name}
          </button>
        )}
      </div>
    </div>
  )
}
```

**What this does:**
- Full control over optimization
- Automatic model routing
- Detailed diagnostics
- Cost tracking

## Common Use Cases

### Use Case 1: Long Conversations

**Problem**: Conversation exceeds token limit

**Solution**:
```tsx
promptOptimization: {
  enabled: true,
  targetTokens: 4000,
  strategy: 'summarize-old',  // Summarizes old messages
}
```

### Use Case 2: Cost Optimization

**Problem**: Want to reduce API costs

**Solution**:
```tsx
promptOptimization: {
  enabled: true,
  targetTokens: 2000,  // Lower budget = lower costs
  strategy: 'drop-low-priority',  // Removes less important messages
  model: {
    id: 'gpt-4o-mini',  // Cheaper model
    maxTokens: 128000,
    inputPricePer1K: 0.00015,
  },
}
```

### Use Case 3: Multiple Models

**Problem**: Want to automatically switch models

**Solution**:
```tsx
const { decision } = useDynamicModelRouting({
  messages,
  currentModel: getModelProfile('gpt-4'),
  availableModels: [
    { model: getModelProfile('gpt-4') },
    { model: getModelProfile('gpt-4o-mini') },
    { model: getModelProfile('gpt-3.5-turbo') },
  ],
  costBudget: 0.10,  // Max $0.10 per request
})
```

### Use Case 4: Debugging

**Problem**: Want to see what's happening

**Solution**:
```tsx
import { usePromptDebugger } from '@clarity-chat/react/prompt'

const { debugInfo } = usePromptDebugger({
  result: optimizationResult,
  enabled: true,
})

console.log(debugInfo.stages)  // See optimization stages
console.log(debugInfo.messageBreakdown)  // Token breakdown
```

## Pre-Built Models

No need to configure models manually! We have 15+ pre-configured:

```tsx
import { getModelProfile, MODEL_PROFILES } from '@clarity-chat/react/prompt'

// Get a specific model
const gpt4 = getModelProfile('gpt-4')
const claude = getModelProfile('claude-3-sonnet')
const gemini = getModelProfile('gemini-1.5-pro')

// List all available models
console.log(Object.keys(MODEL_PROFILES))
// ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4o-mini', ...]
```

## Next Steps

1. ✅ **Try the zero-config approach** - Just enable it!
2. ✅ **Read [QUICK_START.md](./QUICK_START.md)** - More examples
3. ✅ **Check [examples/](./examples/)** - Working code
4. ✅ **Read [advanced docs](../../../docs/advanced-prompt-optimization.md)** - Advanced features

## Troubleshooting

### "Module not found"
Make sure you're importing from the correct path:
```tsx
import { ... } from '@clarity-chat/react/prompt'  // ✅ Correct
```

### "Model not found"
Use `getModelProfile()` instead of manual config:
```tsx
const model = getModelProfile('gpt-4')  // ✅ Pre-configured
```

### "Optimization not working"
Check that `enabled: true` is set and `targetTokens` is reasonable:
```tsx
promptOptimization: {
  enabled: true,  // ✅ Must be true
  targetTokens: 4000,  // ✅ Set a budget
}
```

## That's It!

You're ready to use prompt optimization. Start with the zero-config approach and customize as needed.

Happy optimizing! 🚀
