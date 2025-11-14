# Copy-Paste Examples

Ready-to-use code snippets. Just copy, paste, and customize!

## 🚀 Quickest Start (30 seconds)

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    promptOptimization: { enabled: true },
  })

  return <ChatWindow messages={messages} onSend={append} isLoading={isLoading} />
}
```

**That's it!** Optimization is now enabled with sensible defaults.

## 📊 With Token Stats

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: { enabled: true },
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

## 🎯 Custom Token Budget

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function MyChat() {
  const { messages, append } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,  // Your budget
    },
  })

  return <ChatWindow messages={messages} onSend={append} />
}
```

## 💰 Cost Tracking

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, tokenStats } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 4000,
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
        <div>
          Cost: ${tokenStats.estimatedCost?.toFixed(4)}
        </div>
      )}
    </div>
  )
}
```

## 🔧 Advanced: Full Control

```tsx
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react/prompt'
import { ChatWindow } from '@clarity-chat/react'

function AdvancedChat({ messages }) {
  const { optimizedMessages, tokenStats, diagnostics } = usePromptOptimizer({
    messages,
    model: getModelProfile('gpt-4'),
    targetTokens: 4000,
    autoOptimize: true,
  })

  return (
    <div>
      <ChatWindow messages={optimizedMessages} />
      <div>
        Tokens: {tokenStats.currentTokens} / {tokenStats.targetTokens}
        Savings: {tokenStats.savings} tokens ({tokenStats.savingsPercent.toFixed(1)}%)
      </div>
    </div>
  )
}
```

## 🎨 Model Routing

```tsx
import { 
  usePromptOptimizer, 
  useDynamicModelRouting,
  getModelProfile 
} from '@clarity-chat/react/prompt'

function SmartChat({ messages }) {
  const model = getModelProfile('gpt-4')
  
  const { optimizedMessages } = usePromptOptimizer({
    messages,
    model,
    targetTokens: 4000,
  })

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
      {decision.shouldSwitch && (
        <div>
          💡 Switch to {decision.recommendedModel.name} to save $
          {decision.estimatedSavings?.toFixed(4)}
        </div>
      )}
    </div>
  )
}
```

## 🐛 Debug Mode

```tsx
import { usePromptDebugger } from '@clarity-chat/react/prompt'

function DebugChat({ optimizationResult }) {
  const { debugInfo, exportDebugInfo } = usePromptDebugger({
    result: optimizationResult,
    enabled: true,
  })

  return (
    <div>
      <h3>Optimization Stages</h3>
      {debugInfo.stages.map((stage, i) => (
        <div key={i}>
          {stage.name}: {stage.tokensBefore} → {stage.tokensAfter} tokens
        </div>
      ))}
      
      <button onClick={() => console.log(exportDebugInfo())}>
        Export Debug Info
      </button>
    </div>
  )
}
```

## 📝 Prompt Recipes

```tsx
import { createPromptRecipe, usePromptRecipe } from '@clarity-chat/react/prompt'

function RecipeChat() {
  const recipe = createPromptRecipe({
    id: 'assistant',
    system: 'You are a helpful assistant named {{name}}.',
    user: '{{message}}',
    variables: [
      { name: 'name', defaultValue: 'Clarity' },
      { name: 'message', required: true },
    ],
  })

  const { buildPrompt } = usePromptRecipe({ recipe })

  const handleSend = (text: string) => {
    const prompt = buildPrompt({ message: text })
    // Send prompt.messages to your API
  }

  return <div>...</div>
}
```

## 🎯 Pre-Built Recipes

```tsx
import { 
  createChatbotRecipe, 
  createQARecipe,
  createCodeAssistantRecipe 
} from '@clarity-chat/react/prompt'

// Chatbot
const chatbot = createChatbotRecipe()

// Q&A
const qa = createQARecipe()

// Code Assistant
const codeAssistant = createCodeAssistantRecipe()
```

## 💡 Tips

1. **Start simple**: Use `enabled: true` first, then customize
2. **Use pre-built models**: `getModelProfile('gpt-4')` instead of manual config
3. **Enable debug in dev**: `debug: true` to see what's happening
4. **Monitor costs**: Set `costBudget` to prevent surprises
5. **Try different strategies**: `'hybrid'` is usually best

## Need Help?

- Check [GETTING_STARTED.md](./GETTING_STARTED.md)
- Read [QUICK_START.md](./QUICK_START.md)
- See [examples/](./examples/)
