# Migration Guide

This guide covers breaking changes and migration paths for @clarity-chat/react.

## Version 1.1.0 (API Cleanup Release)

This release cleans up the public API surface for better developer experience. Most users will not
be affected as the primary APIs remain unchanged.

### Breaking Changes

#### 1. `exports.ts` Renamed to `_internal-exports.ts`

**What changed:** The large exports file was renamed and marked as internal-only.

**Who is affected:** Only users who were directly importing from the source file (not recommended).

**Migration:**

```tsx
// Before (not recommended)
import { SomeComponent } from '@clarity-chat/react/src/exports'

// After (use proper entry points)
import { SomeComponent } from '@clarity-chat/react'
// or
import { SomeComponent } from '@clarity-chat/react/internal'
```

#### 2. `FeatureLoader` Class Removed from `core-minimal`

**What changed:** The `FeatureLoader` class and lazy loading utilities have been removed from the
public API.

**Who is affected:** Users who were using `FeatureLoader` for dynamic imports.

**Migration:**

```tsx
// Before
import { featureLoader } from '@clarity-chat/react/core-minimal'
await featureLoader.loadAnalytics()

// After - use React.lazy or dynamic imports directly
const AnalyticsProvider = React.lazy(() =>
  import('@clarity-chat/react').then((m) => ({ default: m.AnalyticsProvider }))
)

// Or simply import what you need
import { AnalyticsProvider } from '@clarity-chat/react'
```

#### 3. `useChatSimple` Removed from `/core`

**What changed:** `useChatSimple` is no longer exported from `@clarity-chat/react/core`.

**Who is affected:** Users importing `useChatSimple` from `/core`.

**Migration:**

```tsx
// Before
import { useChatSimple } from '@clarity-chat/react/core'

// After - use useClarityChat (recommended)
import { useClarityChat } from '@clarity-chat/react/core'

// useClarityChat handles all use cases that useChatSimple covered
const { messages, sendMessage, isLoading } = useClarityChat({
  api: '/api/chat',
})
```

### Non-Breaking Improvements

#### README Examples Updated

The README now shows correct API usage:

- `TokenBudgetProvider` and `useTokenBudget` for token optimization
- `ClarityChatPresets.Enterprise` for security features
- Correct theme syntax: `theme="ocean"` instead of `themes.ocean`
- `useClarityChat` for streaming control

#### Clearer Entry Points

| Entry Point                        | Purpose                      | Bundle Size      |
| ---------------------------------- | ---------------------------- | ---------------- |
| `@clarity-chat/react`              | Full library (recommended)   | Full             |
| `@clarity-chat/react/core`         | Essential components + hooks | ~30% smaller     |
| `@clarity-chat/react/core-minimal` | Ultra-minimal subset         | ~50% smaller     |
| `@clarity-chat/react/internal`     | Advanced/internal APIs       | Full + internals |

### Recommended Import Patterns

```tsx
// Most users - just use the main package
import { ClarityChat, useClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// Size-conscious apps - start minimal
import { ClarityChat } from '@clarity-chat/react/core'
import { TokenBudgetProvider } from '@clarity-chat/react' // add features as needed

// Power users - access internal APIs
import { useStreamingSSE } from '@clarity-chat/react/internal'
```

### Questions?

If you have questions about migration, please:

1. Check the [API Reference](./api-reference.md)
2. Open an issue on GitHub
3. Join our Discord community
