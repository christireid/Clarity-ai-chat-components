# Export Restructuring Guide

> **Purpose**: Guide for converting `export * from` patterns to explicit named exports for
> tree-shaking optimization.

## Overview

The Clarity Chat library currently has **377 `export * from` statements** that prevent effective
tree-shaking. This guide provides a systematic approach to convert these to explicit named exports.

## Why This Matters

```typescript
// BAD: Tree-shaking cannot work
export * from './components'
// Result: ALL components are bundled even if only one is used

// GOOD: Tree-shaking works perfectly
export { ChatWindow } from './components/ChatWindow'
export type { ChatWindowProps } from './components/ChatWindow'
// Result: Only imported components are bundled
```

**Impact**: Users importing `{ ChatWindow }` currently bundle the entire library. With explicit
exports, they bundle only what they use.

---

## Current State Analysis

### Files with `export * from` patterns:

| File                                 | Count    | Priority |
| ------------------------------------ | -------- | -------- |
| `packages/react/src/index.ts`        | 45+      | Critical |
| `packages/react/src/utils/index.ts`  | 20+      | High     |
| Domain index files (analytics, etc.) | 15+ each | Medium   |
| Total                                | 377      | -        |

### Categories of Exports

1. **Components** (~100 exports)
2. **Hooks** (~60 exports)
3. **Types** (~80 exports)
4. **Utilities** (~50 exports)
5. **Domain modules** (~87 exports)

---

## Restructuring Strategy

### Phase 1: Critical Path (Main index.ts)

Convert the main index.ts from:

```typescript
// BEFORE: packages/react/src/index.ts (912 lines)
export * from './analytics'
export * from './observability'
export * from './hooks/use-streaming-sse'
export * from './utils'
```

To:

```typescript
// AFTER: packages/react/src/index.ts (~150 lines)

// ============================================================================
// TOP-LEVEL APIs
// ============================================================================

export { ClarityChat } from './components/clarity-chat'
export type { ClarityChatProps } from './components/clarity-chat'

export { useClarityChat } from './hooks/use-clarity-chat'
export type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityMemoryOptions,
} from './hooks/use-clarity-chat'

// ============================================================================
// MID-LEVEL APIs
// ============================================================================

export { ChatWindow } from './components/chat-window'
export { ChatInput } from './components/chat-input'
export { MessageList } from './components/virtualized-message-list'

export { useChatEnhanced } from './hooks/use-chat-enhanced'
export type { UseChatEnhancedOptions } from './hooks/use-chat-enhanced'

// ... explicit exports continue
```

### Phase 2: Domain Modules

Create explicit exports in each domain:

```typescript
// packages/react/src/analytics/index.ts

// BEFORE
export * from './types'
export * from './AnalyticsProvider'
export * from './providers'
export * from './hooks'

// AFTER
export type {
  AnalyticsEvent,
  AnalyticsUser,
  PageView,
  AnalyticsConfig,
  AnalyticsProvider as AnalyticsProviderInterface,
} from './types'

export { AnalyticsEvents } from './types'
export { AnalyticsProvider, useAnalytics } from './AnalyticsProvider'
export { createGoogleAnalyticsProvider } from './providers/google-analytics'
export { createMixpanelProvider } from './providers/mixpanel'
export { useTrackEvent, useTrackPageView } from './hooks'
```

### Phase 3: Utility Modules

```typescript
// packages/react/src/utils/index.ts

// BEFORE
export * from './cn'
export * from './model-fallback'
export * from './streaming-helpers'
export * from './tokenization'

// AFTER
export { cn } from './cn'

export { createModelFallback, type FallbackConfig } from './model-fallback'

export { createStreamReader, parseStreamChunk } from './streaming-helpers'

export { countTokens, truncateToTokenBudget } from './tokenization'
```

---

## Implementation Checklist

### For Each Module

- [ ] Inventory all current exports (run `grep "export" filename.ts`)
- [ ] Categorize: public API vs internal
- [ ] Write explicit `export { name } from './path'` statements
- [ ] Add `export type` for type-only exports
- [ ] Test: `pnpm build && pnpm test`
- [ ] Verify bundle size with `pnpm size`

### Main index.ts Transformation

1. [ ] Create backup: `cp index.ts index.ts.backup`
2. [ ] Group exports by category (top-level, mid-level, low-level)
3. [ ] Replace each `export * from` with explicit exports
4. [ ] Run typecheck after each batch of changes
5. [ ] Update package.json exports field for sub-paths

---

## Type Export Best Practices

```typescript
// Use `export type` for type-only exports
export type { Message, MessageRole } from './types/messages'

// Use regular export for values (functions, classes, constants)
export { formatMessage, MESSAGE_ROLES } from './types/messages'

// Mixed exports
export { formatMessage } from './types/messages'
export type { Message } from './types/messages'
```

---

## Testing Tree-Shaking

After conversion, verify tree-shaking works:

```typescript
// test-bundle.ts
import { ChatWindow } from '@clarity-chat/react'

// Build and check bundle size
// Should be ~50KB, not 350KB
```

Use the size-limit configuration already in place:

```json
{
  "size-limit": [
    {
      "name": "Single Component Import (Tree-shaken)",
      "path": "dist/index.mjs",
      "import": "{ ChatWindow }",
      "limit": "50 KB",
      "gzip": true
    }
  ]
}
```

---

## Gradual Migration Path

### Week 1: Critical Components

- [ ] Main index.ts top-level exports
- [ ] Primary hooks (useClarityChat, useChatEnhanced)
- [ ] Core components (ClarityChat, ChatWindow)

### Week 2: Domain Modules

- [ ] analytics/index.ts
- [ ] observability/index.ts
- [ ] security/index.ts
- [ ] theme/index.ts

### Week 3: Utility Modules

- [ ] utils/index.ts
- [ ] utils/tokenization/index.ts
- [ ] utils/streaming-helpers.ts

### Week 4: Cleanup

- [ ] Remove all remaining `export * from`
- [ ] Update documentation
- [ ] Run full test suite
- [ ] Publish with release notes

---

## Common Patterns to Replace

| Pattern                        | Replace With                     |
| ------------------------------ | -------------------------------- |
| `export * from './components'` | Individual component exports     |
| `export * from './hooks'`      | Individual hook exports          |
| `export * from './types'`      | `export type { ... }` statements |
| `export * from './utils'`      | Individual utility exports       |

---

## Verification Commands

```bash
# Count remaining export * statements
grep -r "export \* from" packages/react/src/*.ts | wc -l

# Typecheck after changes
pnpm typecheck

# Build and check size
pnpm build
pnpm size

# Check for circular dependencies
npx madge --circular packages/react/src/index.ts
```

---

## Notes

- The `export type` syntax requires TypeScript 3.8+
- Some exports may need both value and type exports
- Test IDE autocomplete after changes
- Update README examples if export paths change
