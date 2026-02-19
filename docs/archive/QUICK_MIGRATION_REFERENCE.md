# Quick Migration Reference

Fast lookup table for common API migrations after consolidation.

## Token Counting

| Old Import                                                    | New Import                                                                                                                  |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `import { TokenCounter } from '@clarity-chat/react'`          | `import { AccurateTokenCounter } from '@clarity-chat/token-optimization'`                                                   |
| `import { useTokenCounter } from '@clarity-chat/react/hooks'` | `import { AccurateTokenCounter } from '@clarity-chat/token-optimization'`<br/>Create instance: `new AccurateTokenCounter()` |
| `AccurateTokenCounter.count(text)`                            | `counter.count(text)` (instance method)                                                                                     |

## Compression

| Old Import                                                        | New Import                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `import { PromptCompressor } from '@clarity-chat/react/utils'`    | `import { AdaptiveCompressor } from '@clarity-chat/token-optimization'`        |
| `import { LLMLinguaCompressor } from '@clarity-chat/react/utils'` | `import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'`       |
| `import { compressText } from '@clarity-chat/react/utils/memory'` | `import { compressAdaptively } from '@clarity-chat/token-optimization/simple'` |

## Caching

| Old Import                                               | New Import                                                            |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| `import { LRUCache } from '@clarity-chat/memory/utils'`  | `import { LRUCache } from '@clarity-chat/utils/cache'`                |
| `import { SmartCache } from '@clarity-chat/react/utils'` | `import { SmartCache } from '@clarity-chat/token-optimization/cache'` |
| `import { memoize } from '@clarity-chat/react/internal'` | `import { memoize } from '@clarity-chat/utils/cache'`                 |

## Utilities

| Old Import                                                        | New Import                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| `import { cn } from '@clarity-chat/react/utils'`                  | `import { cn } from '@clarity-chat/primitives'`               |
| `import { debounce } from '@clarity-chat/react/internal'`         | `import { debounce } from '@clarity-chat/utils/async'`        |
| `import { throttle } from '@clarity-chat/primitives/lib/utils'`   | `import { throttle } from '@clarity-chat/utils/async'`        |
| `import { retry } from '@clarity-chat/memory/utils'`              | `import { retry } from '@clarity-chat/utils/async'`           |
| `import { generateId } from '@clarity-chat/react/utils'`          | `import { generateId } from '@clarity-chat/utils/id'`         |
| `import { isBrowser } from '@clarity-chat/react/internal'`        | `import { isBrowser } from '@clarity-chat/utils/env'`         |
| `import { clamp } from '@clarity-chat/primitives/lib/utils'`      | `import { clamp } from '@clarity-chat/utils/math'`            |
| `import { pick, omit } from '@clarity-chat/primitives/lib/utils'` | `import { pick, omit } from '@clarity-chat/utils/validation'` |

## Formatting

| Old Import                                                         | New Import                                                    |
| ------------------------------------------------------------------ | ------------------------------------------------------------- |
| `import { formatBytes } from '@clarity-chat/primitives/lib/utils'` | `import { formatBytes } from '@clarity-chat/utils/format'`    |
| `import { truncate } from '@clarity-chat/primitives/lib/utils'`    | `import { truncate } from '@clarity-chat/utils/format'`       |
| `import { formatDuration } from '@clarity-chat/react/utils'`       | `import { formatDuration } from '@clarity-chat/utils/format'` |

## Validation

| Old Import                                                           | New Import                                                       |
| -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `import { isString } from '@clarity-chat/react/internal'`            | `import { isString } from '@clarity-chat/utils/validation'`      |
| `import { assertDefined } from '@clarity-chat/primitives/lib/utils'` | `import { assertDefined } from '@clarity-chat/utils/validation'` |
| `import { isValidEmail } from '@clarity-chat/react/utils'`           | `import { isValidEmail } from '@clarity-chat/utils/validation'`  |

## Errors

| Old Import                                                       | New Import                                                             |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `import { ClarityError } from '@clarity-chat/errors'`            | `import { ClarityError } from '@clarity-chat/utils/errors'`            |
| `import { ValidationError } from '@clarity-chat/errors'`         | `import { ValidationError } from '@clarity-chat/utils/errors'`         |
| `import { ErrorBoundary } from '@clarity-chat/react/components'` | `import { EnhancedErrorBoundary } from '@clarity-chat/error-handling'` |

## Performance

| Old Import                                                       | New Import                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| `import { PerformanceMonitor } from '@clarity-chat/react/utils'` | `import { UnifiedPerformanceMonitor } from '@clarity-chat/utils'` |
| `import { measurePerformance } from '@clarity-chat/react/utils'` | `import { measurePerformance } from '@clarity-chat/utils'`        |

## Quick Command Reference

```bash
# Find deprecated imports
rg "from ['\"]@clarity-chat/react/utils/(cn|id-generator)" --type ts

# Find static TokenCounter calls
rg "AccurateTokenCounter\.(count|countChat)" --type ts

# Check for deleted cache imports
rg "from ['\"]@clarity-chat/memory/utils/cache" --type ts

# Verify build after changes
pnpm typecheck && pnpm test && pnpm build:packages
```

## Common Patterns

### Pattern: Token Counting

```typescript
// Before
import { TokenCounter } from '@clarity-chat/react'
const count = TokenCounter.count(text)

// After
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter()
const count = counter.count(text)
```

### Pattern: Compression

```typescript
// Before
import { compressText } from '@clarity-chat/react/utils/memory'
const result = compressText(text)

// After
import { compressAdaptively } from '@clarity-chat/token-optimization/simple'
const result = await compressAdaptively(text, { targetRatio: 0.5 })
```

### Pattern: Utilities

```typescript
// Before
import { cn } from '@clarity-chat/react/utils'
import { debounce } from '@clarity-chat/react/internal'
import { retry } from '@clarity-chat/memory/utils'

// After
import { cn } from '@clarity-chat/primitives'
import { debounce, retry } from '@clarity-chat/utils/async'
```

### Pattern: Environment Detection

```typescript
// Before
import { isBrowser } from '@clarity-chat/react/internal/helpers'

// After
import { isBrowser } from '@clarity-chat/utils/env'
```

---

See [CONSOLIDATION_MIGRATION_GUIDE.md](./CONSOLIDATION_MIGRATION_GUIDE.md) for detailed migration
instructions.
