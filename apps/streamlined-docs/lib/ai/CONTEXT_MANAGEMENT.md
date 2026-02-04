# Conversation Context Management

Advanced conversation context management system for the Clarity Chat documentation assistant. This system ensures conversations stay within token budgets while preserving important context and maintaining conversation quality.

## Overview

The context management system provides:

1. **Intelligent message summarization** - Automatically summarizes older messages when context window fills up
2. **Context window optimization** - Dynamically adjusts conversation history to fit within model limits
3. **Important context retention** - Preserves critical information like errors, code examples, and user preferences
4. **Token budget management** - Prevents token overflow and manages costs
5. **Multiple compression strategies** - Adapts approach based on conversation size and token pressure

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Context Manager                          │
│                                                              │
│  ┌────────────────┐    ┌──────────────────┐                │
│  │   Importance   │    │   Compression    │                │
│  │   Scoring      │───▶│   Strategy       │                │
│  │                │    │   Selection      │                │
│  └────────────────┘    └──────────────────┘                │
│           │                     │                            │
│           │                     ▼                            │
│           │          ┌────────────────────┐                 │
│           └─────────▶│  Message           │                 │
│                      │  Optimization      │                 │
│                      └────────────────────┘                 │
│                               │                              │
└───────────────────────────────┼──────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Optimized Messages   │
                    │  + Summary (optional) │
                    └───────────────────────┘
```

## Compression Strategies

The system automatically selects the optimal compression strategy based on token pressure:

### 1. None (Within Budget)

**When:** Current tokens ≤ target tokens
**Action:** No compression needed
**Use Case:** Short conversations or large context windows

```typescript
// No optimization needed
messages: [...originalMessages]
strategy: 'none'
```

### 2. Sliding Window

**When:** Small overage (1-1.5x budget), few messages
**Action:** Keep most recent N messages that fit budget
**Use Case:** Growing conversations with straightforward history

```typescript
// Keep last 10 messages + system messages
messages: [systemMessages, ...last10Messages]
strategy: 'sliding-window'
```

### 3. Summarize Old

**When:** Moderate overage (1.5-2x budget), many messages
**Action:** Summarize older messages, keep recent ones intact
**Use Case:** Long conversations with important recent context

```typescript
messages: [
  {
    role: 'system',
    content: '<summary>Earlier conversation covered: Topics A, B, C...</summary>',
  },
  ...last10MessagesIntact,
]
strategy: 'summarize-old'
```

### 4. Hierarchical

**When:** High overage (2-3x budget)
**Action:** Multi-level summarization (chunk → summarize → meta-summary)
**Use Case:** Very long conversations with multiple topic shifts

```typescript
messages: [
  {
    role: 'system',
    content: '<hierarchical_summary>
      Phase 1: Component setup
      Phase 2: Error troubleshooting
      Phase 3: Performance optimization
    </hierarchical_summary>',
  },
  ...recentMessages,
]
strategy: 'hierarchical'
```

### 5. Aggressive

**When:** Severe overage (>3x budget)
**Action:** Keep only highest-importance messages
**Use Case:** Emergency token budget recovery

```typescript
// Only keep messages with importance score > threshold
messages: [...criticalMessagesOnly]
strategy: 'aggressive'
```

## Message Importance Scoring

Each message receives an importance score (0-100) based on multiple factors:

### Scoring Factors

| Factor                  | Score | Example                                         |
| ----------------------- | ----- | ----------------------------------------------- |
| System message          | +100  | System prompts                                  |
| Recency                 | +30   | More recent = higher score                      |
| Code examples           | +25   | Messages with \`\`\` code blocks                |
| User preferences        | +30   | "I prefer...", "Set my..."                      |
| Error information       | +20   | Error messages, stack traces                    |
| Source citations        | +15   | Messages with documented sources               |
| Early context           | +15   | First 2 messages set conversation tone          |
| Message length          | +15   | Longer, detailed responses                      |
| Has code                | ✓     | Boolean flag                                    |
| Has error               | ✓     | Boolean flag                                    |
| Is preference           | ✓     | Boolean flag                                    |

### Example Scoring

```typescript
// High importance message (score: 75)
{
  role: 'user',
  content: 'I prefer dark mode. How do I configure the ChatWindow theme?',
  // Score: 30 (preference) + 25 (recent) + 20 (question)
}

// Medium importance (score: 40)
{
  role: 'assistant',
  content: 'Here is an example:\n```tsx\n<ChatWindow theme="dark" />\n```',
  // Score: 25 (code) + 15 (length)
}

// Low importance (score: 15)
{
  role: 'user',
  content: 'Thanks!',
  // Score: 15 (recent)
}
```

## Usage Examples

### Basic Usage

```typescript
import { ContextManager } from '@/lib/ai/contextManager'
import type { SessionMessage } from '@/lib/ai/sessionStore'

const messages: SessionMessage[] = [
  /* ... conversation history ... */
]

const manager = new ContextManager({
  maxContextTokens: 8000, // 8K tokens for context
  reservedTokens: 4000, // 4K for system + response
  recentMessagesToKeep: 10, // Always keep last 10
  enableSummarization: true,
})

const optimized = await manager.optimizeContext(messages, 128000)

console.log({
  strategy: optimized.strategy, // 'summarize-old'
  originalTokens: optimized.originalTokens, // 12,450
  optimizedTokens: optimized.optimizedTokens, // 7,800
  compressionRatio: optimized.compressionRatio, // 0.63 (37% reduction)
  keptMessages: optimized.keptMessages, // 11 (1 summary + 10 recent)
  summarizedMessages: optimized.summarizedMessages, // 45
})
```

### Integration with Session Store

```typescript
import {
  updateSessionWithMessages,
  getOptimizedSessionMessages,
} from '@/lib/ai/sessionStore'

// Automatically compresses when saving
await updateSessionWithMessages(sessionId, newMessages, {
  maxContextTokens: 8000,
  enableCompression: true, // Default: true
})

// Retrieve optimized messages
const optimizedMessages = await getOptimizedSessionMessages(sessionId, 128000)
```

### Integration with API Route

```typescript
// app/api/docs-assistant/route.ts
import { getOptimizedSessionMessages } from '@/lib/ai/sessionStore'

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json()

  // Get optimized conversation history
  const messages = await getOptimizedSessionMessages(sessionId, 128000)

  // Messages are already optimized for the model's context window
  const response = await streamWithRAG(userMessage, messages)

  return response
}
```

### Custom Configuration

```typescript
const manager = new ContextManager({
  maxContextTokens: 16000, // Larger context budget
  reservedTokens: 8000, // More room for response
  minMessagesToKeep: 5, // Keep at least 5 messages
  recentMessagesToKeep: 20, // Keep last 20 intact
  enableSummarization: true,
  targetCompressionRatio: 0.4, // Compress to 40%
})
```

## Configuration Options

```typescript
interface ContextManagerConfig {
  /** Maximum tokens for conversation history */
  maxContextTokens: number // Default: 8000

  /** Reserve tokens for system prompt and response */
  reservedTokens: number // Default: 4000

  /** Minimum messages to keep (even if over budget) */
  minMessagesToKeep: number // Default: 2

  /** Number of recent messages to always keep */
  recentMessagesToKeep: number // Default: 10

  /** Enable automatic summarization */
  enableSummarization: boolean // Default: true

  /** Target compression ratio when summarizing */
  targetCompressionRatio: number // Default: 0.3 (30%)
}
```

## Model Context Windows

The system adapts to different model context windows:

| Model                          | Context Window | Recommended Max Context |
| ------------------------------ | -------------- | ----------------------- |
| GPT-4 Turbo                    | 128K           | 8K                      |
| GPT-4                          | 8K             | 4K                      |
| GPT-3.5 Turbo                  | 16K            | 6K                      |
| Claude 3.5 Sonnet              | 200K           | 16K                     |
| Claude 3 Haiku                 | 200K           | 16K                     |
| Gemini 1.5 Pro                 | 1M             | 32K                     |
| Gemini 1.5 Flash               | 1M             | 32K                     |

```typescript
import { optimizeMessagesForModel } from '@/lib/ai/contextManager'

// Automatically optimizes for model's context window
const optimized = await optimizeMessagesForModel(messages, 'claude-3-5-sonnet-20241022')
```

## Context Extraction

Extract key information that must be preserved:

```typescript
const keyContext = manager.extractKeyContext(messages)

console.log({
  systemPrompt: keyContext.systemPrompt,
  userPreferences: {
    // User-specified settings
    theme: 'dark',
    model: 'gpt-4-turbo',
  },
  errorContext: [
    // Last 3 errors discussed
    'TypeError: Cannot read property...',
  ],
  codeExamples: [
    // Last 3 code blocks
    '```tsx\n<ChatWindow />\n```',
  ],
})
```

## Performance Metrics

Track optimization results:

```typescript
const optimized = await manager.optimizeContext(messages)

console.log(`
Strategy: ${optimized.strategy}
Original: ${optimized.originalTokens} tokens
Optimized: ${optimized.optimizedTokens} tokens
Savings: ${Math.round((1 - optimized.compressionRatio) * 100)}%
Kept: ${optimized.keptMessages} messages
Summarized: ${optimized.summarizedMessages} messages
`)
```

Example output:

```
Strategy: summarize-old
Original: 15,240 tokens
Optimized: 7,896 tokens
Savings: 48%
Kept: 11 messages
Summarized: 52 messages
```

## Best Practices

### 1. Set Appropriate Budgets

```typescript
// Conservative (cost-optimized)
maxContextTokens: 4000,
reservedTokens: 2000,

// Balanced (recommended)
maxContextTokens: 8000,
reservedTokens: 4000,

// Generous (quality-optimized)
maxContextTokens: 16000,
reservedTokens: 8000,
```

### 2. Preserve Important Messages

Tag important messages with metadata:

```typescript
const message: SessionMessage = {
  role: 'user',
  content: 'I prefer TypeScript',
  timestamp: new Date().toISOString(),
  metadata: {
    isPreference: true, // Increases importance score
  },
}
```

### 3. Monitor Compression

Track when compression occurs:

```typescript
if (optimized.strategy !== 'none') {
  console.warn(
    `Context compressed: ${optimized.strategy} (${optimized.summarizedMessages} messages summarized)`
  )

  // Log to analytics
  analytics.track('context_compression', {
    strategy: optimized.strategy,
    originalTokens: optimized.originalTokens,
    compressionRatio: optimized.compressionRatio,
  })
}
```

### 4. Test Edge Cases

```typescript
// Empty conversation
const empty = await manager.optimizeContext([])

// Single message
const single = await manager.optimizeContext([message])

// Massive conversation (1000+ messages)
const massive = await manager.optimizeContext(thousandMessages)

// All messages are critical
const allCritical = messages.map((m) => ({
  ...m,
  metadata: { isPreference: true },
}))
```

## Debugging

Enable detailed logging:

```typescript
const optimized = await manager.optimizeContext(messages)

console.log('Context Optimization Report', {
  strategy: optimized.strategy,
  metrics: {
    originalTokens: optimized.originalTokens,
    optimizedTokens: optimized.optimizedTokens,
    compressionRatio: optimized.compressionRatio,
  },
  messages: {
    total: messages.length,
    kept: optimized.keptMessages,
    summarized: optimized.summarizedMessages,
  },
  summary: optimized.summary,
})
```

## Testing

```typescript
import { describe, it, expect } from 'vitest'
import { ContextManager } from './contextManager'

describe('ContextManager', () => {
  it('does not compress when within budget', async () => {
    const messages = createMessages(5) // Small conversation
    const manager = new ContextManager()

    const result = await manager.optimizeContext(messages, 128000)

    expect(result.strategy).toBe('none')
    expect(result.messages.length).toBe(messages.length)
  })

  it('applies sliding window for small overages', async () => {
    const messages = createMessages(50)
    const manager = new ContextManager({ maxContextTokens: 2000 })

    const result = await manager.optimizeContext(messages, 128000)

    expect(result.strategy).toBe('sliding-window')
    expect(result.optimizedTokens).toBeLessThanOrEqual(2000)
  })

  it('summarizes old messages for moderate overages', async () => {
    const messages = createMessages(100)
    const manager = new ContextManager({ maxContextTokens: 4000 })

    const result = await manager.optimizeContext(messages, 128000)

    expect(result.strategy).toBe('summarize-old')
    expect(result.summary).toBeTruthy()
    expect(result.optimizedTokens).toBeLessThanOrEqual(4000)
  })

  it('preserves high-importance messages', async () => {
    const messages = [
      { role: 'system', content: 'System prompt', timestamp: '...' },
      {
        role: 'user',
        content: 'I prefer dark mode',
        timestamp: '...',
        metadata: { isPreference: true },
      },
      ...createMessages(50),
    ]

    const manager = new ContextManager({ maxContextTokens: 2000 })
    const result = await manager.optimizeContext(messages, 128000)

    // System message and preference should be kept
    const hasSystem = result.messages.some((m) => m.role === 'system')
    const hasPreference = result.messages.some(
      (m) => m.metadata?.isPreference === true
    )

    expect(hasSystem).toBe(true)
    expect(hasPreference).toBe(true)
  })
})
```

## Future Enhancements

1. **Semantic Clustering** - Group related messages for better summarization
2. **User-Controlled Compression** - Let users mark messages as "important"
3. **Adaptive Budgets** - Adjust budgets based on query complexity
4. **Compression Analytics** - Track compression effectiveness over time
5. **Multi-Modal Support** - Handle images, files, and other content types

## Related Files

- `/lib/ai/contextManager.ts` - Core context management logic
- `/lib/ai/sessionStore.ts` - Session storage with context integration
- `/lib/ai/tokenUtils.ts` - Token counting utilities
- `/lib/ai/token-budget-context.ts` - Token budget awareness for AI
- `/app/api/docs-assistant/route.ts` - API integration

## Support

For questions or issues:

1. Check the test suite: `apps/streamlined-docs/lib/ai/__tests__/contextManager.test.ts`
2. Review examples in this document
3. Check the source code comments
4. File an issue on GitHub

---

**Version:** 1.0.0
**Last Updated:** January 2026
**Maintainer:** Clarity Chat Team
