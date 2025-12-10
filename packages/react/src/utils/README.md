# Utilities

> Pure utility functions for token optimization, streaming, and data transformation.

## Categories

### Token Optimization

- `tokenization/` - Token counting and truncation
- `prompt-compression.ts` - Prompt compression
- `kv-cache-prompt-builder.ts` - KV cache optimization
- `toon.ts` - TOON format (30-60% savings)

### Streaming

- `streaming-helpers.ts` - Stream parsing utilities
- `streaming-optimizer.ts` - Stream optimization
- `streamable-value.ts` - Streamable values

### Message Handling

- `message-conversion.ts` - Format conversion
- `message-grouping.ts` - Message grouping
- `chat-helpers.ts` - Chat utilities

### Caching

- `smart-cache.ts` - Semantic caching
- `semantic-cache-persistent.ts` - Persistent cache
- `prompt-caching/` - Prompt cache management

### API

- `batch-api.ts` - Batch request handling
- `rate-limiting.ts` - Rate limit utilities
- `model-fallback.ts` - Fallback strategies

## Quick Start

### Token Counting

```typescript
import { countTokens, truncateToTokenBudget } from '@clarity-chat/react'

const tokens = countTokens('Hello, world!', 'gpt-4')
// { count: 4, model: 'gpt-4' }

const truncated = truncateToTokenBudget(longText, 1000, 'gpt-4')
```

### Prompt Compression

```typescript
import { compressPrompt } from '@clarity-chat/react'

const result = compressPrompt(prompt, {
  targetRatio: 0.5,
  preserveKeywords: ['important', 'critical'],
})
```

### Message Conversion

```typescript
import { convertCoreMessageToMessage, convertMessagesToCoreMessages } from '@clarity-chat/react'

const messages = convertMessagesToCoreMessages(uiMessages)
```

## Usage Guidelines

### Import Best Practices

```typescript
// GOOD: Import specific utilities
import { countTokens } from '@clarity-chat/react'

// AVOID: Importing entire utils module
import * as utils from '@clarity-chat/react/utils'
```

### Internal vs Public

- **Public**: Exported from main index.ts
- **Internal**: In `../internal/` folder, not exported

## File Organization

```
utils/
├── index.ts              # Public exports (explicit)
├── tokenization/         # Token utilities
│   ├── index.ts
│   ├── counter.ts
│   └── model-registry.ts
├── streaming-helpers.ts  # Streaming utilities
├── message-conversion.ts # Message utilities
└── README.md
```

## Adding New Utilities

1. Create utility file with clear name
2. Add JSDoc documentation
3. Export explicitly from index.ts
4. Add tests in `__tests__/`
5. Update this README
