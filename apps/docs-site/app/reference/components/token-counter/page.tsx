import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Token Counter',
  description: 'A real-time token usage counter with cost estimation, visual progress bar, and smart pruning suggestions.',
}

# Token Counter

A real-time token usage display with cost estimation, color-coded progress bar, threshold warnings, and smart pruning suggestions for managing conversation context.

## Overview

The Token Counter provides transparency into token usage and API costs, helping users stay within context limits and understand the cost of their conversations.

### Key Features

- **Real-time Counting** - Live token usage display
- **Cost Estimation** - Transparent API cost calculations
- **Progress Bar** - Visual usage indicator with color coding
- **Threshold Warnings** - Alerts at 80% and 95% usage
- **Smart Suggestions** - Recommends pruning when needed
- **3 Size Variants** - Small, medium, large
- **Accessible** - ARIA labels and semantic HTML
- **Color-coded States** - Green (safe), yellow (warning), red (critical)

## Installation

```bash
npm install @clarity-chat/react
```

## Basic Usage

```tsx
import { TokenCounter } from '@clarity-chat/react'

<TokenCounter
  currentTokens={1250}
  maxTokens={4096}
/>
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentTokens` | `number` | **Required** | Current token count |
| `maxTokens` | `number` | **Required** | Maximum tokens allowed |
| `costPerToken` | `number` | `undefined` | Cost per token in dollars |
| `showWarning` | `boolean` | `true` | Show warning messages |
| `warningThreshold` | `number` | `0.8` | Warning at 80% |
| `criticalThreshold` | `number` | `0.95` | Critical at 95% |
| `showCost` | `boolean` | `true` | Show cost estimate |
| `showBar` | `boolean` | `true` | Show progress bar |
| `onWarning` | `() => void` | `undefined` | Warning callback |
| `onCritical` | `() => void` | `undefined` | Critical callback |
| `suggestPruning` | `boolean` | `false` | Show prune button |
| `onPruneSuggested` | `() => void` | `undefined` | Prune callback |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Display size |
| `className` | `string` | `''` | Additional CSS classes |

## With Cost Estimation

```tsx
<TokenCounter
  currentTokens={3500}
  maxTokens={4096}
  costPerToken={0.000002}  // $0.002 per 1K tokens
  showCost={true}
/>
```

**Displays:** "$0.007" or "0.7¢" for costs under $0.01

## With Warnings

```tsx
<TokenCounter
  currentTokens={3400}
  maxTokens={4096}
  warningThreshold={0.8}     // Warning at 80%
  criticalThreshold={0.95}   // Critical at 95%
  onWarning={() => {
    console.log('Approaching limit')
  }}
  onCritical={() => {
    console.log('Critical!')
    showPruneDialog()
  }}
/>
```

## With Pruning Suggestions

```tsx
<TokenCounter
  currentTokens={3900}
  maxTokens={4096}
  suggestPruning={true}
  onPruneSuggested={() => {
    pruneOldMessages()
  }}
/>
```

## Size Variants

```tsx
// Small - compact display
<TokenCounter
  currentTokens={500}
  maxTokens={4096}
  size="sm"
/>

// Medium - default
<TokenCounter
  currentTokens={500}
  maxTokens={4096}
  size="md"
/>

// Large - prominent display
<TokenCounter
  currentTokens={500}
  maxTokens={4096}
  size="lg"
/>
```

## Complete Example: Chat Interface

```tsx
'use client'

import { useState, useEffect } from 'react'
import { TokenCounter } from '@clarity-chat/react'
import { countTokens } from '@/lib/tokens'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [tokenCount, setTokenCount] = useState(0)
  const maxTokens = 4096

  // Recalculate tokens when messages change
  useEffect(() => {
    const total = messages.reduce((sum, msg) => {
      return sum + countTokens(msg.content)
    }, 0)
    setTokenCount(total)
  }, [messages])

  const handlePrune = () => {
    // Remove oldest messages until under 70%
    const targetTokens = maxTokens * 0.7
    let currentTotal = tokenCount
    let prunedMessages = [...messages]

    while (currentTotal > targetTokens && prunedMessages.length > 2) {
      const removed = prunedMessages.shift()
      currentTotal -= countTokens(removed.content)
    }

    setMessages(prunedMessages)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with token counter */}
      <div className="p-4 border-b">
        <TokenCounter
          currentTokens={tokenCount}
          maxTokens={maxTokens}
          costPerToken={0.000002}
          suggestPruning
          onPruneSuggested={handlePrune}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <Message key={msg.id} {...msg} />
        ))}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  )
}
```

## Complete Example: Token Calculation

```tsx
import { encode } from 'gpt-tokenizer'

// Calculate tokens for a message
export function countTokens(text: string): number {
  return encode(text).length
}

// Calculate total conversation tokens
export function calculateTotalTokens(messages: Message[]): number {
  return messages.reduce((total, msg) => {
    return total + countTokens(msg.content)
  }, 0)
}

// Usage
const tokens = calculateTotalTokens(conversation.messages)

<TokenCounter
  currentTokens={tokens}
  maxTokens={conversation.model.contextWindow}
/>
```

## Color-coded States

### Safe (Green) - 0-79%

```
Token usage: 2000 / 4096 (48.8%)
Color: Green
No warnings
```

### Warning (Yellow) - 80-94%

```
Token usage: 3400 / 4096 (83.0%)
Color: Yellow
Warning: "Approaching Context Limit"
Message: "You're using a large portion of the context window"
```

### Critical (Red) - 95-100%

```
Token usage: 3900 / 4096 (95.2%)
Color: Red
Warning: "Context Limit Nearly Reached"
Message: "The conversation may be truncated soon"
+ Prune suggestion button (if enabled)
```

## Cost Calculation Examples

### OpenAI GPT-4 Turbo

```tsx
// $0.01 per 1K input tokens
const costPerToken = 0.00001

<TokenCounter
  currentTokens={5000}
  maxTokens={128000}
  costPerToken={costPerToken}
/>
// Displays: "$0.05"
```

### GPT-3.5 Turbo

```tsx
// $0.0015 per 1K input tokens
const costPerToken = 0.0000015

<TokenCounter
  currentTokens={3000}
  maxTokens={16385}
  costPerToken={costPerToken}
/>
// Displays: "$0.0045" or "0.45¢"
```

### Claude 3 Opus

```tsx
// $0.015 per 1K input tokens
const costPerToken = 0.000015

<TokenCounter
  currentTokens={10000}
  maxTokens={200000}
  costPerToken={costPerToken}
/>
// Displays: "$0.15"
```

## Accessibility

The Token Counter follows accessibility best practices:

- **ARIA Role** - `role="status"` for live updates
- **ARIA Label** - Descriptive label with full details
- **Progress Bar** - Semantic progressbar with values
- **Alert** - Warning messages use `role="alert"`
- **Color + Text** - Never relies on color alone
- **Keyboard** - Prune button is keyboard accessible

### Screen Reader Experience

```
"Token usage: 3400 of 4096 (83.0%)"
"Alert: Approaching Context Limit"
"You're using a large portion of the context window"
"Prune old messages to free up space, button"
```

## TypeScript Support

Full TypeScript support:

```typescript
import type { TokenCounterProps } from '@clarity-chat/react'

interface TokenCounterProps {
  currentTokens: number
  maxTokens: number
  costPerToken?: number
  showWarning?: boolean
  warningThreshold?: number
  criticalThreshold?: number
  showCost?: boolean
  showBar?: boolean
  onWarning?: () => void
  onCritical?: () => void
  suggestPruning?: boolean
  onPruneSuggested?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

## Related Components

- **[Model Selector](../model-selector)** - Select AI models
- **[Settings Panel](../settings-panel)** - User preferences
- **[Progress](../progress)** - Progress indicators
- **[Badge](../badge)** - Status badges

## Best Practices

### 1. Calculate Tokens Accurately

Use proper tokenizer for the model:

```tsx
import { encode } from 'gpt-tokenizer'

const tokens = encode(text).length

<TokenCounter currentTokens={tokens} maxTokens={4096} />
```

### 2. Set Appropriate Thresholds

```tsx
// ✅ Good - reasonable thresholds
<TokenCounter
  warningThreshold={0.8}   // 80%
  criticalThreshold={0.95} // 95%
/>

// ❌ Bad - too aggressive
<TokenCounter
  warningThreshold={0.5}   // Warns too early
  criticalThreshold={0.7}  // Critical too early
/>
```

### 3. Provide Pruning Option

```tsx
// ✅ Good - offers solution
<TokenCounter
  suggestPruning
  onPruneSuggested={handlePrune}
/>

// ❌ Bad - warns but no action
<TokenCounter
  // No pruning option
/>
```

### 4. Show Cost for Transparency

```tsx
// ✅ Good - shows cost
<TokenCounter
  currentTokens={tokens}
  maxTokens={4096}
  costPerToken={0.000002}
  showCost
/>
```

### 5. Handle Callbacks

```tsx
const handleWarning = () => {
  toast.warning('Approaching token limit')
}

const handleCritical = () => {
  toast.error('Token limit reached!')
  // Optionally auto-prune
  pruneOldMessages()
}

<TokenCounter
  onWarning={handleWarning}
  onCritical={handleCritical}
/>
```

## Use Cases

### 1. Chat Interface Header

```tsx
<ChatHeader>
  <TokenCounter
    currentTokens={conversationTokens}
    maxTokens={model.contextWindow}
    size="sm"
  />
</ChatHeader>
```

### 2. Settings Dashboard

```tsx
<UsageDashboard>
  <TokenCounter
    currentTokens={totalTokensToday}
    maxTokens={dailyLimit}
    costPerToken={pricing.input}
    size="lg"
  />
</UsageDashboard>
```

### 3. API Playground

```tsx
<Playground>
  <TokenCounter
    currentTokens={calculateTokens(input + output)}
    maxTokens={selectedModel.contextWindow}
    showCost
  />
</Playground>
```

## Performance Tips

### 1. Memoize Token Calculation

```tsx
const totalTokens = useMemo(() => {
  return messages.reduce((sum, msg) => {
    return sum + countTokens(msg.content)
  }, 0)
}, [messages])

<TokenCounter currentTokens={totalTokens} maxTokens={4096} />
```

### 2. Debounce Updates

```tsx
const [tokens, setTokens] = useState(0)

const updateTokens = useMemo(
  () => debounce((text: string) => {
    setTokens(countTokens(text))
  }, 500),
  []
)

// Update as user types
onChange={(e) => updateTokens(e.target.value)}
```

### 3. Throttle Callbacks

```tsx
const handleWarning = useCallback(
  throttle(() => {
    showWarningToast()
  }, 5000), // Max once per 5 seconds
  []
)
```

---

**Related Documentation:**
- [Model Selector](../model-selector)
- [Settings Panel](../settings-panel)
- [Progress](../progress)
- [Badge](../badge)
