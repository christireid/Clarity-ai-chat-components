# Context Management Quick Start

5-minute guide to using the conversation context management system.

## Installation

No installation needed - already integrated into the docs assistant.

## Basic Usage

### Option 1: Automatic (Recommended)

Context management is **automatically enabled** when saving sessions:

```typescript
import { updateSessionWithMessages } from '@/lib/ai/sessionStore'

// That's it! Compression happens automatically when needed
await updateSessionWithMessages(sessionId, newMessages)
```

### Option 2: Manual Control

For fine-grained control:

```typescript
import { ContextManager } from '@/lib/ai/contextManager'

const manager = new ContextManager()
const optimized = await manager.optimizeContext(messages, 128000)

console.log(`Reduced from ${optimized.originalTokens} to ${optimized.optimizedTokens} tokens`)
```

## Common Scenarios

### Scenario 1: Long Conversation Overflowing Budget

```typescript
// Problem: 100+ messages, 30K tokens, model has 8K budget
const messages = await getMessages(sessionId) // 100 messages

// Solution: Automatic optimization
const manager = new ContextManager({
  maxContextTokens: 6000, // Stay under 8K with room for response
})

const optimized = await manager.optimizeContext(messages, 8192)
// Result: 11 messages (1 summary + 10 recent), 6K tokens ✅
```

### Scenario 2: Cost Optimization

```typescript
// Goal: Reduce token usage to save costs
const manager = new ContextManager({
  maxContextTokens: 4000, // Lower budget
  targetCompressionRatio: 0.3, // Compress to 30%
  recentMessagesToKeep: 8, // Fewer recent messages
})

const optimized = await manager.optimizeContext(messages, 128000)
// Result: 60-70% token reduction = significant cost savings 💰
```

### Scenario 3: Quality Priority

```typescript
// Goal: Maximum context preservation
const manager = new ContextManager({
  maxContextTokens: 16000, // Large budget
  recentMessagesToKeep: 20, // Keep many recent messages
  enableSummarization: true, // Summarize only if needed
})

const optimized = await manager.optimizeContext(messages, 200000)
// Result: Minimal compression, maximum quality ✨
```

### Scenario 4: Preserve Important Information

```typescript
// Tag critical messages
const messages = [
  {
    role: 'user',
    content: 'I prefer dark mode and TypeScript',
    metadata: { isPreference: true }, // ⭐ High importance
  },
  {
    role: 'assistant',
    content: 'Error: TypeError...',
    metadata: { hasError: true }, // ⭐ High importance
  },
  // ... other messages
]

// These messages will be preserved even under heavy compression
const optimized = await manager.optimizeContext(messages, 8192)
```

## Configuration Cheat Sheet

```typescript
// Conservative (Save money)
{
  maxContextTokens: 4000,
  reservedTokens: 2000,
  recentMessagesToKeep: 5,
  enableSummarization: true,
  targetCompressionRatio: 0.3, // 70% reduction
}

// Balanced (Recommended)
{
  maxContextTokens: 8000,
  reservedTokens: 4000,
  recentMessagesToKeep: 10,
  enableSummarization: true,
  targetCompressionRatio: 0.5, // 50% reduction
}

// Generous (Maximize quality)
{
  maxContextTokens: 16000,
  reservedTokens: 8000,
  recentMessagesToKeep: 20,
  enableSummarization: true,
  targetCompressionRatio: 0.7, // 30% reduction
}
```

## Compression Strategies

The system automatically selects the best strategy:

| Strategy       | When Used            | What It Does                        |
| -------------- | -------------------- | ----------------------------------- |
| `none`         | Within budget        | No compression                      |
| `sliding-window` | Small overage      | Keep most recent N messages         |
| `summarize-old` | Moderate overage    | Summarize old, keep recent intact   |
| `hierarchical` | High overage         | Multi-level summarization           |
| `aggressive`   | Severe overage       | Keep only critical messages         |

## Quick Recipes

### Recipe 1: Get Optimized Messages for API Call

```typescript
import { getOptimizedSessionMessages } from '@/lib/ai/sessionStore'

const messages = await getOptimizedSessionMessages(sessionId, 128000)
// Ready to use in API call! Already optimized for 128K context window
```

### Recipe 2: Model-Specific Optimization

```typescript
import { optimizeMessagesForModel } from '@/lib/ai/contextManager'

// Automatically uses correct context window for model
const optimized = await optimizeMessagesForModel(messages, 'gpt-4')
// GPT-4: 8K context window → optimized accordingly
```

### Recipe 3: Check What Would Be Compressed

```typescript
const manager = new ContextManager()
const optimized = await manager.optimizeContext(messages, 128000)

console.log(`
Strategy: ${optimized.strategy}
Original: ${optimized.originalTokens} tokens
Optimized: ${optimized.optimizedTokens} tokens
Savings: ${Math.round((1 - optimized.compressionRatio) * 100)}%
Kept: ${optimized.keptMessages} messages
Summarized: ${optimized.summarizedMessages} messages
`)
```

### Recipe 4: Extract Key Information

```typescript
const manager = new ContextManager()
const keyContext = manager.extractKeyContext(messages)

console.log({
  systemPrompt: keyContext.systemPrompt,
  preferences: keyContext.userPreferences,
  errors: keyContext.errorContext,
  codeExamples: keyContext.codeExamples,
})
// Perfect for debugging or migration
```

## Integration Points

### In API Routes

```typescript
// app/api/docs-assistant/route.ts
export async function POST(request: NextRequest) {
  const { sessionId } = await request.json()

  // ✅ Get optimized messages
  const messages = await getOptimizedSessionMessages(sessionId, 128000)

  // Use in streaming response
  const response = await streamWithRAG(userMessage, messages)
  return response
}
```

### In Session Updates

```typescript
// After generating response
await updateSessionWithMessages(
  sessionId,
  [userMessage, assistantResponse],
  {
    maxContextTokens: 8000,
    enableCompression: true,
  }
)
// Compression happens automatically if needed
```

## Monitoring

### Track Compression Events

```typescript
const optimized = await manager.optimizeContext(messages, 128000)

if (optimized.strategy !== 'none') {
  console.warn(`⚠️  Context compressed using ${optimized.strategy}`)

  // Send to analytics
  trackEvent('context_compression', {
    strategy: optimized.strategy,
    originalTokens: optimized.originalTokens,
    optimizedTokens: optimized.optimizedTokens,
    compressionRatio: optimized.compressionRatio,
  })
}
```

### Session Metadata

```typescript
const session = await store.get(sessionId)

console.log('Compression History:', {
  strategy: session.metadata.compressionStrategy,
  originalCount: session.metadata.originalMessageCount,
  currentCount: session.messages.length,
  ratio: session.metadata.compressionRatio,
})
```

## Troubleshooting

### Problem: Still Over Budget

```typescript
// Solution: Lower the budget or increase compression
const manager = new ContextManager({
  maxContextTokens: 2000, // Even lower
  targetCompressionRatio: 0.2, // More aggressive (80% reduction)
})
```

### Problem: Important Messages Dropped

```typescript
// Solution: Tag them with metadata
message.metadata = {
  isPreference: true, // +30 importance
  hasError: true, // +20 importance
}
```

### Problem: Too Much Compression

```typescript
// Solution: Keep more messages or disable summarization
const manager = new ContextManager({
  recentMessagesToKeep: 25, // Keep more intact
  enableSummarization: false, // Use sliding window only
})
```

## Performance Tips

1. **Cache Manager Instances:**
   ```typescript
   const manager = new ContextManager(config)
   // Reuse for multiple conversations
   ```

2. **Lazy Load Context Manager:**
   ```typescript
   // Already done in session store!
   const { ContextManager } = await import('./contextManager')
   ```

3. **Set Realistic Budgets:**
   ```typescript
   // Don't set budget higher than needed
   maxContextTokens: 8000 // Not 100000
   ```

## Testing

```typescript
import { describe, it, expect } from 'vitest'
import { ContextManager } from './contextManager'

it('compresses large conversations', async () => {
  const messages = createMessages(100)
  const manager = new ContextManager({ maxContextTokens: 2000 })

  const result = await manager.optimizeContext(messages, 128000)

  expect(result.optimizedTokens).toBeLessThanOrEqual(2000)
  expect(result.strategy).not.toBe('none')
})
```

Run tests:
```bash
pnpm test lib/ai/__tests__/contextManager.test.ts
```

## Next Steps

1. **Read Full Documentation:**
   - `/lib/ai/CONTEXT_MANAGEMENT.md` - Complete guide
   - `/lib/ai/CONTEXT_IMPROVEMENTS_SUMMARY.md` - Feature summary

2. **Explore Source Code:**
   - `/lib/ai/contextManager.ts` - Implementation
   - `/lib/ai/sessionStore.ts` - Integration

3. **Run Tests:**
   - `/lib/ai/__tests__/contextManager.test.ts` - Test suite

4. **Experiment:**
   - Try different configurations
   - Monitor compression in action
   - Measure token savings

## Key Takeaways

✅ **Automatic by default** - No code changes needed
✅ **Intelligent compression** - Preserves important context
✅ **Multiple strategies** - Adapts to conversation size
✅ **Cost effective** - 30-70% token reduction
✅ **Quality preserved** - Recent messages always kept
✅ **Well tested** - 40+ test cases
✅ **Production ready** - Already integrated

---

**Questions?** Check the full documentation or source code comments.
