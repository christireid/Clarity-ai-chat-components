# Breaking Changes - v2.0.0

**Release Date:** January 23, 2026 **Branch:** clean-up → main

This document lists all breaking changes introduced in the consolidation effort that eliminated 150+
duplicate API implementations.

---

## Overview

### What Broke?

1. **Static Methods Removed**: `AccurateTokenCounter` static methods converted to instance methods
2. **Import Paths Changed**: 150+ files deleted, imports must be updated
3. **Package Dependencies**: Some internal dependencies changed
4. **API Removals**: Duplicate implementations removed entirely

### Impact Level

- **High Impact**: Token counting API changes (affects most applications)
- **Medium Impact**: Utility import path changes
- **Low Impact**: Cache and compression imports (fewer usage points)

### Backward Compatibility

- ✅ **Re-exports maintained** for most changes (deprecated)
- ⚠️ **Some APIs removed** with no fallback (duplicates)
- ❌ **Static methods removed** (breaking, no fallback)

---

## Breaking Change #1: Token Counter Instance Methods

**Impact:** 🔴 HIGH - Affects all token counting code

### What Changed

`AccurateTokenCounter` no longer supports static method calls. All methods are now instance methods.

### Before (v1.x)

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

// Static methods worked
const count = AccurateTokenCounter.count(text)
const chatCount = AccurateTokenCounter.countChat(messages)
const batchCounts = AccurateTokenCounter.countBatch(texts)
```

### After (v2.0)

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

// Must create instance
const counter = new AccurateTokenCounter({
  model: 'gpt-4',
  cacheResults: true,
})

// Use instance methods
const count = counter.count(text)
const chatCount = counter.countChat(messages)
const batchCounts = counter.countBatch(texts)
```

### Why Changed

- Enables proper state management (caching, monitoring)
- Allows per-instance configuration
- Follows best practices (no global state)
- Better for testing (mockable instances)

### Migration Path

**Automatic:** Use this regex to find all static calls:

```bash
rg "AccurateTokenCounter\.(count|countChat|countBatch|truncate|estimate)" --type ts
```

**Manual:** Update each occurrence:

```typescript
// Add instance creation at component/module level
const counter = new AccurateTokenCounter()

// Replace static calls with instance calls
- const count = AccurateTokenCounter.count(text)
+ const count = counter.count(text)
```

**For React Components:**

```typescript
function MyComponent() {
  // Create instance in useMemo to avoid recreation
  const counter = useMemo(() => new AccurateTokenCounter({ model: 'gpt-4' }), [])

  const count = counter.count(text)
  // ...
}
```

---

## Breaking Change #2: Removed Duplicate Token Counters

**Impact:** 🟠 MEDIUM - Only affects code using deprecated implementations

### What Changed

All duplicate token counter implementations removed:

- ❌ `FastTokenCounter` (use `AccurateTokenCounter`)
- ❌ `SimpleTokenCounter` (use `AccurateTokenCounter`)
- ❌ `AdvancedTokenCounter` (merged into `AccurateTokenCounter`)
- ❌ `OptimizedTokenCounter` from React (use `AccurateTokenCounter`)
- ❌ `SmartTokenCounter` from React (use `AccurateTokenCounter`)
- ❌ `RobustTokenCounter` from React (use `AccurateTokenCounter`)
- ❌ `TokenCounter` from Memory (use wrapper or direct import)
- ❌ `useTokenCounter` hook from React (create instance manually)

### Before (v1.x)

```typescript
// These all worked (duplicates)
import { FastTokenCounter } from '@clarity-chat/token-optimization'
import { OptimizedTokenCounter } from '@clarity-chat/react/utils/tokenization'
import { TokenCounter } from '@clarity-chat/memory'
import { useTokenCounter } from '@clarity-chat/react/hooks/token'
```

### After (v2.0)

```typescript
// Only canonical implementation exists
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter()
```

### Migration Path

All variants → `AccurateTokenCounter`

---

## Breaking Change #3: Compression Import Paths

**Impact:** 🟠 MEDIUM - Affects compression usage

### What Changed

All compression implementations consolidated to `@clarity-chat/token-optimization`. React package
duplicates removed.

### Before (v1.x)

```typescript
// All of these worked (duplicates)
import { PromptCompressor } from '@clarity-chat/react/utils/optimization'
import { LLMLinguaCompressor } from '@clarity-chat/react/utils/optimization'
import { advancedCompress } from '@clarity-chat/react/utils/tokenization'
import { compressText } from '@clarity-chat/react/utils/memory'
```

### After (v2.0)

```typescript
// Single canonical source
import {
  LLMLinguaCompressor,
  ExtractiveCompressor,
  AdaptiveCompressor,
} from '@clarity-chat/token-optimization'

// Or use simple API
import { compressAdaptively } from '@clarity-chat/token-optimization/simple'
```

### Deleted Files

- ❌ `packages/react/src/utils/memory/prompt-compression.ts`
- ❌ `packages/react/src/utils/optimization/llmlingua-compressor.ts`
- ❌ `packages/react/src/utils/tokenization/advanced-compression.ts`
- ❌ And 8 more compression files...

### Migration Path

Update imports to point to `@clarity-chat/token-optimization`

---

## Breaking Change #4: Cache Import Paths

**Impact:** 🟡 LOW - Limited usage points

### What Changed

Cache implementations consolidated:

- **Simple caching** → `@clarity-chat/utils/cache`
- **Advanced caching** → `@clarity-chat/token-optimization/cache`

### Before (v1.x)

```typescript
import { LRUCache } from '@clarity-chat/memory/utils/cache'
import { SmartCache } from '@clarity-chat/react/utils/optimization'
import { memoize } from '@clarity-chat/react/internal/helpers'
```

### After (v2.0)

```typescript
import { LRUCache, TTLCache, memoize } from '@clarity-chat/utils/cache'
import { SmartCache, ExactCache } from '@clarity-chat/token-optimization/cache'
```

### Deleted Files

- ❌ `packages/memory/src/utils/cache.ts`
- ❌ `packages/react/src/utils/tokenization/intelligent-caching.ts`
- ❌ `packages/react/src/utils/optimization/semantic-cache-persistent.ts`

---

## Breaking Change #5: Utility Function Locations

**Impact:** 🟠 MEDIUM - Widely used utilities

### What Changed

All utility functions consolidated to `@clarity-chat/utils` with focused exports.

### Before (v1.x)

```typescript
// Scattered across packages
import { cn } from '@clarity-chat/react/utils/cn'
import { debounce } from '@clarity-chat/react/internal/helpers'
import { retry } from '@clarity-chat/memory/utils/retry'
import { clamp } from '@clarity-chat/primitives/lib/utils'
import { isBrowser } from '@clarity-chat/react/internal/helpers'
```

### After (v2.0)

```typescript
// Consolidated with categorical exports
import { cn } from '@clarity-chat/primitives'
import { debounce, retry, throttle } from '@clarity-chat/utils/async'
import { clamp } from '@clarity-chat/utils/math'
import { isBrowser, isNode, isDev } from '@clarity-chat/utils/env'
```

### New Modules

- `@clarity-chat/utils/async` - debounce, throttle, retry, sleep, pool
- `@clarity-chat/utils/math` - clamp, and more math utilities
- `@clarity-chat/utils/env` - environment detection
- `@clarity-chat/utils/id` - ID generation with prefixes
- `@clarity-chat/utils/format` - formatting utilities
- `@clarity-chat/utils/validation` - type guards and assertions

### Deleted Files

Over 77 duplicate utility implementations removed, including:

- ❌ `packages/memory/src/utils/retry.ts`
- ❌ `packages/react/src/utils/optimization/performance.ts`
- ❌ Large portions of `packages/primitives/src/lib/utils.ts`

---

## Breaking Change #6: Error Import Paths

**Impact:** 🟡 LOW - Straightforward migration

### What Changed

`@clarity-chat/errors` package deprecated. All errors moved to `@clarity-chat/utils/errors`.

### Before (v1.x)

```typescript
import { ClarityError, ValidationError } from '@clarity-chat/errors'
```

### After (v2.0)

```typescript
import { ClarityError, ValidationError } from '@clarity-chat/utils/errors'
```

### Note

The `@clarity-chat/errors` package still works (re-exports) but shows deprecation warnings.

---

## Breaking Change #7: Error Boundary Consolidation

**Impact:** 🟡 LOW - Limited usage

### What Changed

All error boundary duplicates removed. Single canonical implementation in
`@clarity-chat/error-handling`.

### Before (v1.x)

```typescript
// Multiple implementations existed
import { ErrorBoundary } from '@clarity-chat/react/components/feedback'
import { ErrorBoundary } from '@clarity-chat/playground/components'
```

### After (v2.0)

```typescript
// Single canonical implementation
import { EnhancedErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'
```

### Deleted Files

- ❌ `packages/react/src/components/feedback/error-boundary.tsx`
- ❌ `packages/playground/src/components/ErrorBoundary.tsx`
- ❌ 20+ duplicate implementations in examples/

---

## Breaking Change #8: Performance Monitor Consolidation

**Impact:** 🟡 LOW - Limited usage

### What Changed

Performance monitoring consolidated to `UnifiedPerformanceMonitor` in `@clarity-chat/utils`.

### Before (v1.x)

```typescript
import { PerformanceMonitor } from '@clarity-chat/react/utils/optimization'
```

### After (v2.0)

```typescript
import { UnifiedPerformanceMonitor } from '@clarity-chat/utils'

// Or use alias
import { PerformanceMonitor } from '@clarity-chat/utils'
```

---

## Breaking Change #9: ID Generation

**Impact:** 🟡 LOW - New canonical module

### What Changed

ID generation moved to dedicated module with prefix support.

### Before (v1.x)

```typescript
import { generateId } from '@clarity-chat/react/utils/id-generator'
import { nanoid } from 'nanoid' // Direct dependency
```

### After (v2.0)

```typescript
import {
  generateId,
  generateMessageId,
  generateSessionId,
  generateBatchId,
} from '@clarity-chat/utils/id'
```

---

## Breaking Change #10: Primitives Utils Split

**Impact:** 🟠 MEDIUM - Large file split into modules

### What Changed

`packages/primitives/src/lib/utils.ts` split into focused modules:

- `utils/classnames.ts` - cn and class utilities
- `utils/dom.ts` - DOM manipulation utilities
- `utils/style.ts` - Style utilities

### Before (v1.x)

```typescript
import { cn, clamp, debounce, pick, omit } from '@clarity-chat/primitives/lib/utils'
```

### After (v2.0)

```typescript
import { cn } from '@clarity-chat/primitives'
// Other utilities moved to @clarity-chat/utils
import { clamp } from '@clarity-chat/utils/math'
import { debounce } from '@clarity-chat/utils/async'
import { pick, omit } from '@clarity-chat/utils/validation'
```

### File Reduction

- Before: `utils.ts` was 900+ lines
- After: Split into 3 focused modules (~200 lines each)
- Moved 224 lines to `@clarity-chat/utils`

---

## Package Dependency Changes

### New Dependencies

- `@clarity-chat/utils` now has:
  - `nanoid` - ID generation
  - `date-fns` - Date formatting (optional peer)

### Removed Dependencies

- `@clarity-chat/react` no longer depends on:
  - `nanoid` (moved to utils)
  - Multiple duplicate implementations

### Peer Dependencies

No changes to peer dependencies.

---

## Migration Checklist

Use this checklist to ensure complete migration:

### Code Changes

- [ ] Replace `AccurateTokenCounter.count()` static calls with instance methods
- [ ] Update token counter imports to `@clarity-chat/token-optimization`
- [ ] Update compression imports to `@clarity-chat/token-optimization`
- [ ] Update cache imports to `@clarity-chat/utils/cache`
- [ ] Update `cn` imports to `@clarity-chat/primitives`
- [ ] Update async utility imports to `@clarity-chat/utils/async`
- [ ] Update environment detection to `@clarity-chat/utils/env`
- [ ] Update ID generation to `@clarity-chat/utils/id`
- [ ] Update error imports to `@clarity-chat/utils/errors`
- [ ] Update error boundary imports to `@clarity-chat/error-handling`

### Verification

- [ ] Run `pnpm typecheck` - No TypeScript errors
- [ ] Run `pnpm lint` - No linting errors
- [ ] Run `pnpm test` - All tests pass
- [ ] Run `pnpm build:packages` - Build succeeds
- [ ] Check for deprecation warnings in console
- [ ] Update any custom scripts that import removed files

### Documentation

- [ ] Update README with new imports
- [ ] Update code examples
- [ ] Update API documentation
- [ ] Update tutorial content

---

## Rollback Plan

If you need to rollback to v1.x:

```bash
# Revert to previous version
git checkout main  # or your previous branch

# Or use package versions
pnpm add @clarity-chat/token-optimization@1.x
pnpm add @clarity-chat/utils@1.x
```

---

## Getting Help

### Automated Tools

```bash
# Find all static TokenCounter calls
rg "AccurateTokenCounter\.(count|countChat|countBatch)" --type ts

# Find deprecated import paths
rg "from ['\"]@clarity-chat/(react|memory)/utils/(cn|cache|retry)" --type ts

# Find removed files
rg "from ['\"]@clarity-chat/react/utils/tokenization/(intelligent-caching|smart-fallback)" --type ts
```

### Support

- **Migration Guide**: See [CONSOLIDATION_MIGRATION_GUIDE.md](./CONSOLIDATION_MIGRATION_GUIDE.md)
- **Quick Reference**: See [QUICK_MIGRATION_REFERENCE.md](./QUICK_MIGRATION_REFERENCE.md)
- **Issues**: Open a GitHub issue with `migration` label
- **Questions**: Discussions tab on GitHub

---

## Timeline

- **v1.0-v1.9**: Deprecated APIs work with warnings
- **v2.0** (current): Breaking changes implemented, duplicates removed
- **v2.x**: Stability period, no further breaking changes
- **v3.0** (future): Remove all deprecated re-exports

---

**Document Version:** 1.0 **Last Updated:** January 23, 2026 **Total Breaking Changes:** 10 major
categories **Files Deleted:** 150+ **Lines Removed:** 23,000+
