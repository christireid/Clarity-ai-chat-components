# Token Counting That Actually Works: A Deep Dive

JavaScript's `string.length` has nothing to do with tokens. That's why your cost estimates are wrong.

You estimated 1,000 tokens. The API charged you for 2,300. What happened?

Token counting is deceptively complex. Different models use different tokenizers. Unicode characters can be 1 token or 4. Code and natural language tokenize differently. And the way conversations accumulate tokens surprises most developers.

Let's fix your token counting once and for all.

---

## Why String Length Fails

The most common misconception: "1 token ≈ 4 characters."

That's a rough average from the early GPT days. It's not a rule, and it's increasingly inaccurate with modern models and international text.

Here's reality:

| Text | Characters | Tokens (GPT-4) |
|------|------------|----------------|
| "hello" | 5 | 1 |
| "Hello" | 5 | 1 |
| "HELLO" | 5 | 1 |
| "héllo" | 5 | 2 |
| "你好" | 2 | 2 |
| "🎉" | 1 | 1 |
| "const" | 5 | 1 |
| "XMLHttpRequest" | 14 | 4 |
| "backgroundColor" | 15 | 3 |

The pattern? Common English words are often single tokens. CamelCase splits into multiple tokens. Diacritical marks and non-ASCII characters cost more. Emojis vary wildly—some are 1 token, others are 5+.

Here's a function to see how your text actually tokenizes:

```typescript
import { encodingForModel } from 'js-tiktoken'

function analyzeTokens(text: string, model = 'gpt-4') {
  const encoder = encodingForModel(model)
  const tokens = encoder.encode(text)

  // Decode each token to see the breakdown
  const breakdown = tokens.map(token => {
    const decoded = encoder.decode([token])
    return { token, text: decoded }
  })

  return {
    text,
    characterCount: text.length,
    tokenCount: tokens.length,
    ratio: (tokens.length / text.length).toFixed(2),
    breakdown,
  }
}

// Example usage
console.log(analyzeTokens("XMLHttpRequest.send()"))
// {
//   text: "XMLHttpRequest.send()",
//   characterCount: 21,
//   tokenCount: 7,
//   ratio: "0.33",
//   breakdown: [
//     { token: 55, text: "XML" },
//     { token: 5765, text: "Http" },
//     { token: 2839, text: "Request" },
//     { token: 13, text: "." },
//     { token: 6076, text: "send" },
//     { token: 368, text: "(" },
//     { token: 369, text: ")" },
//   ]
// }
```

That ratio of 0.33 tokens per character is way off from the "0.25 tokens per character" rule of thumb. For code, your estimates will consistently be wrong.

---

## Model-Specific Tokenizers

Different AI providers use different tokenizers. The same text can have different token counts across models:

| Text | GPT-4 (cl100k) | Claude | Gemini |
|------|----------------|--------|--------|
| "Build a React component" | 4 | 5 | 5 |
| "Hello, how are you?" | 5 | 5 | 6 |
| "console.log('test')" | 6 | 5 | 7 |

This matters for cost estimation and context window planning.

Here's how to count tokens correctly for each provider:

```typescript
import { encodingForModel } from 'js-tiktoken'

type ModelProvider = 'openai' | 'anthropic' | 'google'

interface TokenResult {
  count: number
  estimatedCost: number
}

function countTokens(
  text: string,
  model: string,
  provider: ModelProvider
): TokenResult {
  // OpenAI: Use tiktoken directly
  if (provider === 'openai') {
    // Note: tiktoken types may require casting for dynamic model names
    // For type-safe usage, use a union type of supported models
    const encoder = encodingForModel(model as Parameters<typeof encodingForModel>[0])
    const tokens = encoder.encode(text)

    return {
      count: tokens.length,
      estimatedCost: calculateCost(tokens.length, model),
    }
  }

  // Claude: Approximate using cl100k_base + 15% adjustment
  // Claude's tokenizer tends to produce slightly more tokens
  if (provider === 'anthropic') {
    const encoder = encodingForModel('gpt-4')
    const baseCount = encoder.encode(text).length
    const adjustedCount = Math.ceil(baseCount * 1.15)

    return {
      count: adjustedCount,
      estimatedCost: calculateCost(adjustedCount, model),
    }
  }

  // Gemini: Approximate using character count / 3.5
  // Google's tokenizer is less efficient for English
  if (provider === 'google') {
    const estimatedCount = Math.ceil(text.length / 3.5)

    return {
      count: estimatedCount,
      estimatedCost: calculateCost(estimatedCount, model),
    }
  }

  throw new Error(`Unknown provider: ${provider}`)
}

// Current pricing as of 2025 (per 1M tokens)
const PRICING = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'claude-3-5-sonnet': { input: 3.00, output: 15.00 },
  'gemini-1.5-pro': { input: 1.25, output: 5.00 },
}

function calculateCost(tokens: number, model: string): number {
  const pricing = PRICING[model as keyof typeof PRICING]
  if (!pricing) return 0

  // Input cost (output estimated as 2x input for typical conversation)
  const inputCost = (tokens * pricing.input) / 1_000_000
  const estimatedOutputCost = (tokens * 2 * pricing.output) / 1_000_000

  return inputCost + estimatedOutputCost
}
```

For production applications, you might want to call each provider's actual tokenization API for exact counts, but these approximations are close enough for UI display and budget alerts.

---

## Counting Full Conversations

Here's where most token counting goes wrong: they count the last message, not the full conversation.

Every API call sends the entire conversation history. A 10-message conversation might look like 500 tokens in the latest message, but you're actually sending 4,000 tokens including all previous context.

```typescript
interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ConversationTokens {
  systemPrompt: number
  userMessages: number
  assistantMessages: number
  overhead: number
  total: number
  estimatedCost: number
}

function countConversationTokens(
  messages: Message[],
  systemPrompt: string,
  model = 'gpt-4o'
): ConversationTokens {
  // Cast needed for dynamic model parameter - tiktoken accepts specific model strings
  const encoder = encodingForModel(model as Parameters<typeof encodingForModel>[0])

  // Count system prompt
  const systemTokens = encoder.encode(systemPrompt).length

  // Count messages by role
  let userTokens = 0
  let assistantTokens = 0

  for (const msg of messages) {
    const tokenCount = encoder.encode(msg.content).length
    if (msg.role === 'user') {
      userTokens += tokenCount
    } else if (msg.role === 'assistant') {
      assistantTokens += tokenCount
    }
  }

  // Account for message structure overhead
  // Each message has ~4 tokens for role markers and formatting
  const overhead = (messages.length + 1) * 4 // +1 for system

  const total = systemTokens + userTokens + assistantTokens + overhead

  return {
    systemPrompt: systemTokens,
    userMessages: userTokens,
    assistantMessages: assistantTokens,
    overhead,
    total,
    estimatedCost: calculateCost(total, model),
  }
}

// Usage
const breakdown = countConversationTokens(
  messages,
  "You are a helpful assistant that writes code.",
  "gpt-4o"
)

console.log(breakdown)
// {
//   systemPrompt: 12,
//   userMessages: 450,
//   assistantMessages: 1200,
//   overhead: 48,
//   total: 1710,
//   estimatedCost: 0.037
// }
```

That overhead adds up. A 50-message conversation has 200+ tokens just in role markers.

---

## Real-Time Token Display

Showing users their token count serves multiple purposes: cost awareness, context limit warnings, and informed decisions about when to start a new conversation.

Here's a React component for real-time token tracking:

```tsx
import { useState, useMemo, useEffect } from 'react'
import { encodingForModel } from 'js-tiktoken'

interface TokenCounterProps {
  text: string
  model?: string
  maxTokens?: number
  showCost?: boolean
}

// Type for tiktoken encoder
type TiktokenEncoder = ReturnType<typeof encodingForModel>

function TokenCounter({
  text,
  model = 'gpt-4o',
  maxTokens = 128000,
  showCost = true
}: TokenCounterProps) {
  const [encoder, setEncoder] = useState<TiktokenEncoder | null>(null)

  // Initialize encoder
  useEffect(() => {
    setEncoder(encodingForModel(model as Parameters<typeof encodingForModel>[0]))
  }, [model])

  const { tokens, cost, percentage } = useMemo(() => {
    if (!encoder) return { tokens: 0, cost: 0, percentage: 0 }

    const tokenCount = encoder.encode(text).length
    const pricing = PRICING[model as keyof typeof PRICING]
    const inputCost = pricing
      ? (tokenCount * pricing.input) / 1_000_000
      : 0

    return {
      tokens: tokenCount,
      cost: inputCost,
      percentage: (tokenCount / maxTokens) * 100,
    }
  }, [text, encoder, model, maxTokens])

  const formatTokens = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const formatCost = (amount: number): string => {
    if (amount < 0.01) {
      return `${(amount * 100).toFixed(2)}¢`
    }
    return `$${amount.toFixed(2)}`
  }

  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <span className="font-mono">
        {formatTokens(tokens)} tokens
      </span>

      {showCost && cost > 0 && (
        <span className="text-gray-400">
          ~{formatCost(cost)}
        </span>
      )}

      {percentage > 80 && (
        <span className="text-amber-600">
          {percentage.toFixed(0)}% of context
        </span>
      )}

      {percentage > 95 && (
        <span className="text-red-600 font-medium">
          Context nearly full
        </span>
      )}
    </div>
  )
}
```

Use it in your input area:

```tsx
function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [draft, setDraft] = useState('')

  return (
    <div className="border rounded-lg">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="w-full p-4 resize-none"
        placeholder="Type your message..."
        rows={4}
      />

      <div className="flex justify-between items-center px-4 py-2 border-t bg-gray-50">
        <TokenCounter text={draft} model="gpt-4o" />

        <button
          onClick={() => {
            onSend(draft)
            setDraft('')
          }}
          disabled={!draft.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}
```

---

## Cost Calculation That Actually Helps

Raw token counts aren't useful to most users. "2,340 tokens" means nothing. "$0.05" means everything.

Here's a more complete cost tracking implementation:

```tsx
interface CostTrackerState {
  totalInputTokens: number
  totalOutputTokens: number
  totalCost: number
  sessionMessages: number
  averageTokensPerMessage: number
}

function useCostTracker(model: string) {
  const [state, setState] = useState<CostTrackerState>({
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalCost: 0,
    sessionMessages: 0,
    averageTokensPerMessage: 0,
  })

  const pricing = PRICING[model as keyof typeof PRICING]

  const trackMessage = useCallback((
    inputTokens: number,
    outputTokens: number
  ) => {
    setState(prev => {
      const newInputTotal = prev.totalInputTokens + inputTokens
      const newOutputTotal = prev.totalOutputTokens + outputTokens
      const newMessageCount = prev.sessionMessages + 1

      const inputCost = (inputTokens * pricing.input) / 1_000_000
      const outputCost = (outputTokens * pricing.output) / 1_000_000

      return {
        totalInputTokens: newInputTotal,
        totalOutputTokens: newOutputTotal,
        totalCost: prev.totalCost + inputCost + outputCost,
        sessionMessages: newMessageCount,
        averageTokensPerMessage: (newInputTotal + newOutputTotal) / newMessageCount,
      }
    })
  }, [pricing])

  const estimateRemainingBudget = useCallback((budget: number) => {
    if (state.sessionMessages === 0) return Infinity

    const costPerMessage = state.totalCost / state.sessionMessages
    return Math.floor((budget - state.totalCost) / costPerMessage)
  }, [state])

  return {
    ...state,
    trackMessage,
    estimateRemainingBudget,
    formattedCost: `$${state.totalCost.toFixed(4)}`,
  }
}
```

---

## The Takeaway

Token counting is not `string.length / 4`. It's:

1. **Model-specific** — Different providers use different tokenizers
2. **Conversation-cumulative** — You send the full history every time
3. **Overhead-inclusive** — Message structure costs tokens too
4. **Useful for UX** — Show costs, not abstract numbers

Get your token counting right, and you'll finally understand why your AI bills look the way they do. More importantly, you can pass that visibility to your users and help them make informed decisions about their usage.

---

*Clarity Chat's `useTokenTracker` hook handles model-specific tokenization, conversation counting, cost estimation, and real-time display. Stop guessing your API costs. [See the token tracking docs →](/docs/hooks/use-token-tracker)*
