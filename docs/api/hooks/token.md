# Token Hooks

Hooks for tracking, managing, and optimizing LLM token usage and costs.

## Overview

| Hook | Purpose | Key Features | Status |
|------|---------|--------------|--------|
| `useTokenTracker` | Real-time token counting and cost tracking | Auto-pricing, warning thresholds, pruning suggestions, multi-model support | ✅ Active |
| `useTokenBudgetMonitor` | Token budget monitoring with auto-trimming | Context window management, auto-trim, cost tracking | ⚠️ Deprecated (use `@clarity-chat/token-optimization`) |
| `useTokenCounter` | Model-aware token counting | Accurate encoding, message overhead, async loading | ⚠️ Deprecated (use `@clarity-chat/react/hooks/clarity-tokens`) |

---

## useTokenTracker

Real-time token counting and cost tracking for conversations with automatic model pricing.

### Signature

```typescript
function useTokenTracker(options: UseTokenTrackerOptions): UseTokenTrackerReturn

interface UseTokenTrackerOptions {
  modelName: string              // e.g., 'gpt-4', 'claude-3-opus'
  maxTokens?: number             // Auto-detected from model
  inputCostPerToken?: number     // Auto-detected from model
  outputCostPerToken?: number    // Auto-detected from model
  warningThreshold?: number      // Default: 0.8 (80%)
  criticalThreshold?: number     // Default: 0.95 (95%)
  onWarning?: () => void
  onCritical?: () => void
}

interface UseTokenTrackerReturn {
  tokens: number                 // Total tokens
  inputTokens: number            // User message tokens
  outputTokens: number           // Assistant message tokens
  estimatedCost: number          // Cost in dollars
  isNearLimit: boolean           // ≥ warning threshold
  isCritical: boolean            // ≥ critical threshold
  percentage: number             // 0-100
  canSend: (estimatedTokens: number) => boolean
  suggestPruning: boolean        // Whether to prune old messages
  addMessage: (message: MessageWithTokens) => void
  removeMessage: (index: number) => void
  clear: () => void
  estimateTokens: (text: string) => number
}

interface MessageWithTokens {
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens?: number  // Optional pre-computed count
}
```

### Supported Models

The hook auto-detects pricing and limits for popular models from MODEL_REGISTRY:

| Model Family | Context Window | Input Cost | Output Cost |
|--------------|----------------|------------|-------------|
| **GPT-4** | 8,192 - 128,000 | $0.01-0.03/1K | $0.03-0.06/1K |
| **GPT-3.5 Turbo** | 16,385 | $0.0005/1K | $0.0015/1K |
| **Claude 3 Opus** | 200,000 | $0.015/1K | $0.075/1K |
| **Claude 3.5 Sonnet** | 200,000 | $0.003/1K | $0.015/1K |
| **Claude 3 Haiku** | 200,000 | $0.00025/1K | $0.00125/1K |

*Custom models supported via manual pricing configuration*

### Examples

#### Basic Token Tracking

```tsx
import { useTokenTracker } from '@clarity/react/hooks/token'

function ChatWithTokens() {
  const {
    tokens,
    estimatedCost,
    percentage,
    isNearLimit,
    addMessage,
    estimateTokens,
  } = useTokenTracker({
    modelName: 'gpt-4',
  })

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({
      role: 'user',
      content,
      tokens: estimateTokens(content),
    })

    // Get AI response
    const response = await getAIResponse(content)

    // Add assistant message
    addMessage({
      role: 'assistant',
      content: response,
      tokens: estimateTokens(response),
    })
  }

  return (
    <div>
      <div className="token-stats">
        <span>{tokens.toLocaleString()} tokens</span>
        <span>${estimatedCost.toFixed(4)}</span>
        <span>{percentage.toFixed(1)}% used</span>
        {isNearLimit && (
          <span className="text-warning">Approaching limit</span>
        )}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  )
}
```

#### Visual Token Counter

```tsx
function TokenCounter() {
  const tracker = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
  })

  const getProgressColor = () => {
    if (tracker.isCritical) return 'bg-destructive'
    if (tracker.isNearLimit) return 'bg-warning'
    return 'bg-primary'
  }

  return (
    <div className="token-counter">
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all ${getProgressColor()}`}
          style={{ width: `${tracker.percentage}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm mt-1">
        <span>
          {tracker.tokens.toLocaleString()} / 8,192 tokens
        </span>
        <span className="text-muted-foreground">
          ${tracker.estimatedCost.toFixed(4)}
        </span>
      </div>

      {/* Warning messages */}
      {tracker.isCritical && (
        <div className="text-destructive text-sm mt-2">
          ⚠️ Critical: Near context limit. Consider pruning old messages.
        </div>
      )}

      {tracker.isNearLimit && !tracker.isCritical && (
        <div className="text-warning text-sm mt-2">
          Approaching token limit
        </div>
      )}
    </div>
  )
}
```

#### Pre-Send Validation

```tsx
function ChatInput() {
  const [message, setMessage] = React.useState('')
  const tracker = useTokenTracker({ modelName: 'gpt-4' })

  const handleSend = () => {
    const estimatedTokens = tracker.estimateTokens(message)

    // Check if message would exceed limit
    if (!tracker.canSend(estimatedTokens)) {
      alert(
        `Message too long! Would exceed context limit.\n` +
        `Current: ${tracker.tokens} tokens\n` +
        `Message: ~${estimatedTokens} tokens\n` +
        `Limit: 8,192 tokens`
      )
      return
    }

    // Send message
    sendMessage(message)
    tracker.addMessage({
      role: 'user',
      content: message,
      tokens: estimatedTokens,
    })
  }

  const estimatedTokens = tracker.estimateTokens(message)
  const wouldExceed = !tracker.canSend(estimatedTokens)

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={wouldExceed ? 'border-destructive' : ''}
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          ~{estimatedTokens} tokens
        </span>

        <button
          onClick={handleSend}
          disabled={wouldExceed || !message.trim()}
        >
          {wouldExceed ? 'Message Too Long' : 'Send'}
        </button>
      </div>
    </div>
  )
}
```

#### Warning Callbacks

```tsx
function ChatWithAlerts() {
  const [showPruneDialog, setShowPruneDialog] = React.useState(false)

  const tracker = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    onWarning: () => {
      console.log('Warning: Approaching 80% of context limit')
      toast.warning('Approaching token limit')
    },
    onCritical: () => {
      console.log('Critical: At 95% of context limit')
      setShowPruneDialog(true)
    },
  })

  const handlePrune = () => {
    // Remove first half of messages
    const messagesToKeep = Math.floor(messages.length / 2)
    setMessages(messages.slice(-messagesToKeep))
    tracker.clear()
    setShowPruneDialog(false)
  }

  return (
    <div>
      <MessageList />

      {showPruneDialog && (
        <Dialog onClose={() => setShowPruneDialog(false)}>
          <h2>Context Limit Reached</h2>
          <p>
            You're at {tracker.percentage.toFixed(1)}% of the context limit.
            Would you like to prune old messages?
          </p>
          <button onClick={handlePrune}>Prune Messages</button>
          <button onClick={() => setShowPruneDialog(false)}>Cancel</button>
        </Dialog>
      )}
    </div>
  )
}
```

#### Smart Pruning

```tsx
function ChatWithSmartPruning() {
  const [messages, setMessages] = React.useState<Message[]>([])

  const tracker = useTokenTracker({
    modelName: 'gpt-4',
    criticalThreshold: 0.95,
  })

  // Auto-prune when suggestion appears
  React.useEffect(() => {
    if (tracker.suggestPruning) {
      // Keep system message + last 50% of conversation
      const systemMessages = messages.filter(m => m.role === 'system')
      const conversationMessages = messages.filter(m => m.role !== 'system')
      const keepCount = Math.floor(conversationMessages.length / 2)
      const prunedMessages = [
        ...systemMessages,
        ...conversationMessages.slice(-keepCount),
      ]

      setMessages(prunedMessages)
      tracker.clear()

      // Re-add pruned messages to tracker
      prunedMessages.forEach(msg => {
        tracker.addMessage({
          role: msg.role,
          content: msg.content,
          tokens: tracker.estimateTokens(msg.content),
        })
      })

      toast.info(`Pruned ${messages.length - prunedMessages.length} old messages`)
    }
  }, [tracker.suggestPruning])

  return <ChatWindow messages={messages} />
}
```

#### Custom Model Configuration

```tsx
function CustomModelChat() {
  const tracker = useTokenTracker({
    modelName: 'my-custom-model',
    maxTokens: 32000,                    // Custom context window
    inputCostPerToken: 0.00002,          // $0.02 per 1K tokens
    outputCostPerToken: 0.00004,         // $0.04 per 1K tokens
    warningThreshold: 0.7,               // Warn at 70%
    criticalThreshold: 0.9,              // Critical at 90%
  })

  return (
    <div>
      <div className="model-info">
        <strong>my-custom-model</strong>
        <span>32,000 token context</span>
        <span>$0.02/$0.04 per 1K tokens (in/out)</span>
      </div>

      <TokenCounter tracker={tracker} />
      <ChatWindow />
    </div>
  )
}
```

#### Real-Time Cost Tracking

```tsx
function CostTracker() {
  const [sessionCost, setSessionCost] = React.useState(0)

  const tracker = useTokenTracker({
    modelName: 'gpt-4',
  })

  // Track cumulative session cost
  React.useEffect(() => {
    setSessionCost(tracker.estimatedCost)
  }, [tracker.estimatedCost])

  return (
    <div className="cost-tracker">
      <div className="stat">
        <span className="label">Current Conversation</span>
        <span className="value">${tracker.estimatedCost.toFixed(4)}</span>
      </div>

      <div className="stat">
        <span className="label">Session Total</span>
        <span className="value">${sessionCost.toFixed(4)}</span>
      </div>

      <div className="stat">
        <span className="label">Input Tokens</span>
        <span className="value">
          {tracker.inputTokens.toLocaleString()}
          <small className="text-muted-foreground ml-1">
            (${(tracker.inputTokens * 0.00003).toFixed(4)})
          </small>
        </span>
      </div>

      <div className="stat">
        <span className="label">Output Tokens</span>
        <span className="value">
          {tracker.outputTokens.toLocaleString()}
          <small className="text-muted-foreground ml-1">
            (${(tracker.outputTokens * 0.00006).toFixed(4)})
          </small>
        </span>
      </div>
    </div>
  )
}
```

### Token Estimation

The hook uses a centralized token estimator with ~4 character-per-token approximation plus role overhead:

```typescript
// Rough estimation formula
tokens = Math.ceil(text.length / 4) + 4  // +4 for role/formatting overhead

// Examples
estimateTokens("Hello!")                    // ~6 tokens
estimateTokens("What is the weather?")       // ~9 tokens
estimateTokens("Very long message...")       // varies by length
```

**Note:** For production accuracy, use actual token counts from your LLM API response.

### When to Use

✅ **Use when:**
- Displaying token usage to users
- Preventing context limit errors
- Tracking API costs in real-time
- Building cost-conscious applications
- Need multi-model token tracking

❌ **Avoid when:**
- Don't need cost tracking
- Using fixed-cost API
- Token limits aren't a concern
- Already have server-side tracking

---

## Deprecated Hooks

### useTokenBudgetMonitor (Deprecated)

**Status:** ⚠️ Deprecated - migrate to `@clarity-chat/token-optimization`

```typescript
// OLD (deprecated)
import { useTokenBudgetMonitor } from '@clarity-chat/react'

// NEW (recommended)
import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'
```

**Deprecation Warning:** This hook has been moved to a separate `@clarity-chat/token-optimization` package for better modularity and additional features. The re-export from `@clarity-chat/react` will be removed in v3.0.0.

**Migration:** Update your import path. The API remains unchanged.

---

### useTokenCounter (Deprecated)

**Status:** ⚠️ Deprecated - migrate to `@clarity-chat/react/hooks/clarity-tokens`

```typescript
// OLD (deprecated)
import { useTokenCounter } from '@clarity-chat/react/hooks/token'

// NEW (recommended)
import { useTokenCounter } from '@clarity-chat/react/hooks/clarity-tokens'
```

**Features** (in new location):
- Accurate token counting using tiktoken/AccurateTokenCounter
- Model-aware encoding (cl100k_base, o200k_base)
- Message overhead calculation
- Cached encoder instances
- Async encoder loading

**Migration Example:**

```tsx
// Before
import { useTokenCounter } from '@clarity-chat/react/hooks/token'

function OldComponent() {
  const { countTokens, isReady } = useTokenCounter({
    encoding: 'cl100k_base',
    preload: true,
  })

  if (!isReady) return <Spinner />

  const tokens = countTokens('Hello world')
  return <div>{tokens} tokens</div>
}

// After
import { useTokenCounter } from '@clarity-chat/react/hooks/clarity-tokens'

function NewComponent() {
  const { countTokens, isReady } = useTokenCounter({
    encoding: 'cl100k_base',
    preload: true,
  })

  if (!isReady) return <Spinner />

  const tokens = countTokens('Hello world')  // Same API
  return <div>{tokens} tokens</div>
}
```

---

## Common Patterns

### Complete Token Management

```tsx
function ProductionChat() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputMessage, setInputMessage] = React.useState('')

  // Token tracking
  const tracker = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    criticalThreshold: 0.95,
    onWarning: () => {
      toast.warning('Approaching context limit')
    },
    onCritical: () => {
      toast.error('Context limit critical - please clear some messages')
    },
  })

  // Character counter for input
  const counter = useCharacterCounter({
    value: inputMessage,
    maxLength: 4000,
  })

  const handleSend = async (content: string) => {
    const estimatedTokens = tracker.estimateTokens(content)

    // Validate against context limit
    if (!tracker.canSend(estimatedTokens)) {
      toast.error('Message too long for current context')
      return
    }

    // Add user message
    const userMsg = { role: 'user' as const, content }
    setMessages(prev => [...prev, userMsg])
    tracker.addMessage({
      ...userMsg,
      tokens: estimatedTokens,
    })

    // Get AI response
    const response = await getAIResponse(content)

    // Add assistant message
    const assistantMsg = { role: 'assistant' as const, content: response }
    setMessages(prev => [...prev, assistantMsg])
    tracker.addMessage({
      ...assistantMsg,
      tokens: tracker.estimateTokens(response),
    })
  }

  return (
    <div>
      {/* Token usage display */}
      <div className="token-bar">
        <div className="progress-bar">
          <div
            className={
              tracker.isCritical
                ? 'bg-destructive'
                : tracker.isNearLimit
                ? 'bg-warning'
                : 'bg-primary'
            }
            style={{ width: `${tracker.percentage}%` }}
          />
        </div>
        <div className="stats">
          <span>{tracker.tokens.toLocaleString()} tokens</span>
          <span>${tracker.estimatedCost.toFixed(4)}</span>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <ChatInput
        value={inputMessage}
        onChange={setInputMessage}
        onSend={handleSend}
        disabled={tracker.isCritical}
        tokenWarning={!tracker.canSend(
          tracker.estimateTokens(inputMessage)
        )}
      />

      {/* Prune suggestion */}
      {tracker.suggestPruning && (
        <div className="prune-suggestion">
          <button onClick={() => {
            setMessages(messages.slice(-10))  // Keep last 10 messages
            tracker.clear()
          }}>
            Clear old messages to free up space
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## Troubleshooting

### "Inaccurate token counts"

**Problem:** Token estimates don't match actual API usage.

**Solution:** Use actual token counts from API response:

```tsx
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message }),
})

const data = await response.json()

// Use actual tokens from API
tracker.addMessage({
  role: 'assistant',
  content: data.response,
  tokens: data.usage.total_tokens,  // Actual count from API
})
```

---

### "Model not found in pricing"

**Problem:** Using a custom or new model not in MODEL_REGISTRY.

**Solution:** Provide manual pricing:

```tsx
const tracker = useTokenTracker({
  modelName: 'my-custom-model',
  maxTokens: 16000,
  inputCostPerToken: 0.00001,   // $0.01 per 1K
  outputCostPerToken: 0.00002,  // $0.02 per 1K
})
```

---

### "Thresholds not triggering"

**Problem:** onWarning/onCritical callbacks not firing.

**Solution:** Callbacks only fire once when threshold is first crossed:

```tsx
const tracker = useTokenTracker({
  modelName: 'gpt-4',
  warningThreshold: 0.8,
  onWarning: () => {
    console.log('This fires once at 80%')
  },
})

// To reset warnings, clear the tracker
tracker.clear()  // Resets warning flags
```

---

## Related Hooks

- `useCharacterCounter` - Character counting for inputs
- `useContextMonitor` - Advanced context window management
- `useSmartCache` - Cache to reduce token usage
- `useClarityChat` - Full chat integration with token tracking
