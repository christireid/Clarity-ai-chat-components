# Tokenizer Import Usage Guide

## Quick Decision Matrix

| Use Case    | Import Pattern                                       | Bundle Size   | Accuracy |
| ----------- | ---------------------------------------------------- | ------------- | -------- |
| UI display  | `import { estimateTokens }`                          | 27 KB         | ~90%     |
| Billing     | `import { AccurateTokenCounter } from '/tokenizers'` | 989 KB        | 99%+     |
| Server-side | Either (prefer accurate)                             | Less critical | Varies   |
| Mobile app  | `estimateTokens`                                     | 27 KB         | ~90%     |

## Import Patterns

### 1. Lightweight Estimation (Recommended Default)

```typescript
import { estimateTokens } from '@clarity-chat/token-optimization'

// Quick estimation
const count = estimateTokens('Your text here')
console.log(`Estimated: ${count} tokens`)

// With options
const detailed = estimateTokens(text, {
  model: 'gpt-4o',
  includeMetadata: true,
})
```

**Bundle Impact:** +27 KB **Accuracy:** ~90% **Speed:** ~0.1ms per call

### 2. Accurate Tokenization (Opt-in)

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization/tokenizers'

// Create counter instance
const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  enableCaching: true,
})

// Count tokens
const count = counter.count('Your text here')
console.log(`Accurate: ${count} tokens`)

// Advanced features
const info = counter.getTokenInfo(text)
const truncated = counter.truncate(text, 100) // Truncate to 100 tokens
const withinLimit = counter.isWithinLimit(text, 1000) // Check limit
```

**Bundle Impact:** +989 KB (includes gpt-tokenizer) **Accuracy:** 99%+ **Speed:** ~0.5ms per call

### 3. Dynamic Import (Best of Both Worlds)

```typescript
// Start with estimation (small bundle)
import { estimateTokens } from '@clarity-chat/token-optimization'

// Load accurate counter on-demand
async function getAccurateCount(text: string) {
  // Only loads when this function is called
  const { AccurateTokenCounter } = await import('@clarity-chat/token-optimization/tokenizers')

  const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
  return counter.count(text)
}

// Use estimation by default
const estimated = estimateTokens(userInput)
showToUser(`~${estimated} tokens`)

// Get accurate count when needed
if (needsPrecision) {
  const accurate = await getAccurateCount(userInput)
  chargeBilling(accurate)
}
```

**Initial Bundle:** 27 KB **Loaded on-demand:** +989 KB (only when needed) **Best for:** Progressive
enhancement

## Bundle Size Comparison

```
Without Tokenizers:  ████ 27 KB
With Tokenizers:     ████████████████████████████████████████ 989 KB

Savings: 962 KB (97.2% smaller)
```

## When to Use Each

### Use Estimation When:

- Displaying token counts in UI
- Providing real-time feedback as user types
- Building mobile applications
- Bundle size is critical
- ~90% accuracy is acceptable
- Working with edge functions (Vercel Edge, Cloudflare Workers)

### Use Accurate Counting When:

- Processing billing/payments
- Enforcing strict token limits
- Server-side processing (bundle size less critical)
- Need exact counts for API calls
- Working with token budgets
- Generating invoices

## Code Examples

### Example 1: Chat UI with Estimation

```typescript
import { estimateTokens } from '@clarity-chat/token-optimization'
import { useState } from 'react'

function ChatInput() {
  const [text, setText] = useState('')
  const tokens = estimateTokens(text)

  return (
    <div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <span>{tokens} tokens</span>
    </div>
  )
}
```

Bundle impact: +27 KB

### Example 2: Server Billing with Accurate Counting

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization/tokenizers'

const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  enableCaching: true,
})

export async function POST(request: Request) {
  const { text } = await request.json()

  // Get exact token count for billing
  const tokens = counter.count(text)

  // Calculate cost
  const cost = (tokens / 1000) * 0.03 // $0.03 per 1K tokens

  await chargeBilling(userId, cost)

  return Response.json({ tokens, cost })
}
```

Server bundle: Size less critical, use accurate counting

### Example 3: Progressive Enhancement

```typescript
import { estimateTokens } from '@clarity-chat/token-optimization'

let accurateCounter: any = null

async function getTokenCount(text: string, accurate = false) {
  if (!accurate) {
    return estimateTokens(text)
  }

  // Lazy load accurate counter
  if (!accurateCounter) {
    const { AccurateTokenCounter } = await import('@clarity-chat/token-optimization/tokenizers')
    accurateCounter = new AccurateTokenCounter({ model: 'gpt-4o' })
  }

  return accurateCounter.count(text)
}

// UI: Show estimate immediately (fast, small bundle)
const estimate = await getTokenCount(text, false)
displayToUser(`~${estimate} tokens`)

// Background: Get accurate count for records
const accurate = await getTokenCount(text, true)
saveToDatabase(accurate)
```

## Performance Comparison

| Metric        | Estimation | Accurate   |
| ------------- | ---------- | ---------- |
| Bundle Size   | 27 KB      | 989 KB     |
| Initial Load  | ~5-10ms    | ~150-200ms |
| Runtime Speed | ~0.1ms     | ~0.5ms     |
| Accuracy      | ~90%       | 99%+       |
| Memory        | Minimal    | ~2-3 MB    |

## Migration Guide

### From Always Accurate to Smart Estimation

**Before:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization/tokenizers'
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
const count = counter.count(text)
```

**After:**

```typescript
import { estimateTokens } from '@clarity-chat/token-optimization'
const count = estimateTokens(text)
```

**Savings:** 962 KB (97.2% reduction)

### Add Accurate Counting Only Where Needed

**Before:**

```typescript
// Everywhere uses accurate counting (large bundle)
import { AccurateTokenCounter } from '@clarity-chat/token-optimization/tokenizers'
```

**After:**

```typescript
// UI uses estimation (small bundle)
import { estimateTokens } from '@clarity-chat/token-optimization'

// Server uses accurate (size less critical)
import { AccurateTokenCounter } from '@clarity-chat/token-optimization/tokenizers'
```

## Summary

1. **Default to estimation** for UI/UX (27 KB bundle)
2. **Use accurate counting** for billing/limits (989 KB bundle)
3. **Dynamic import** for progressive enhancement
4. **Save 962 KB** by choosing wisely

The tokenizer split architecture gives you the flexibility to optimize for bundle size while
maintaining accuracy where it matters.
