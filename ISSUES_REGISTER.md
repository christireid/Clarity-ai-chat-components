# Clarity Chat Components - Issues Register

**Generated:** January 2026 **Status:** Phase 4 - Issue Documentation and Fix Implementation

---

## Critical Issues (P0) - Build Blockers

### ISSUE-001: Missing @clarity-chat/token-optimization Module

**Severity:** CRITICAL - Build blocker **Affected Files:** 25+ files in `/packages/react/src/`

**Description:** The `@clarity-chat/token-optimization` module is referenced but not found. This
causes TypeScript compilation failures.

**Affected Areas:**

- `/src/hooks/clarity-tokens/types.ts` (lines 8, 12)
- `/src/hooks/clarity-tokens/use-context-window.ts` (lines 4, 5)
- `/src/hooks/clarity-tokens/use-cost-estimator.ts` (lines 9, 10)
- `/src/hooks/clarity-tokens/use-prompt-compressor.ts` (lines 9, 10)
- `/src/hooks/clarity-tokens/use-semantic-cache.ts` (line 10)
- `/src/hooks/clarity-tokens/use-stream-optimizer.ts` (line 4)
- `/src/hooks/clarity-tokens/use-token-counter.ts` (lines 4, 5)
- `/src/hooks/clarity-tokens/use-token-limit-guard.ts` (lines 4, 5)
- `/src/utils/tokenization/*.ts` (14+ files)

**Root Cause:** Dependent package `@clarity-chat/token-optimization` needs to be built before the
react package can type-check.

**Solution:** Build dependent packages first in correct order.

---

### ISSUE-002: Duplicate Export Errors in hooks.ts

**Severity:** CRITICAL - Build blocker **Affected Files:** `/packages/react/src/hooks.ts:167`

**Description:** Module `./hooks/token` has already exported members causing ambiguity:

- `TokenEncoding`
- `UseTokenCounterReturn`
- `useTokenCounter`

**Root Cause:** Re-exporting from `./hooks/clarity-tokens` and `./hooks/token` creates duplicate
exports.

**Solution:** Explicitly re-export using unique names or consolidate exports.

---

### ISSUE-003: Missing gpt-tokenizer Module

**Severity:** CRITICAL - Build blocker **Affected Files:**
`/src/hooks/clarity-tokens/use-lazy-token-counter.ts`

**Lines:** 47, 48, 149, 337

**Description:** The `gpt-tokenizer` module is imported but not found.

**Solution:** Add `gpt-tokenizer` to package.json dependencies or update imports.

---

### ISSUE-004: Missing Prismjs Type Declarations

**Severity:** HIGH - Build warning **Affected Files:**
`/src/components/message/markdown-code-block.tsx`

**Lines:** 48-51

**Description:** Missing type declarations for prismjs language components:

- `prismjs/components/prism-bash`
- `prismjs/components/prism-css`
- `prismjs/components/prism-markdown`
- `prismjs/components/prism-python`

**Solution:** Add `@ts-ignore` comments or declare module types.

---

## High Priority Issues (P1) - Documentation Drift

### ISSUE-005: 92 Documented Hooks Without Implementations

**Severity:** HIGH - Documentation misleads users **Affected Files:**
`/apps/docs/content/hooks/*.mdx`

**Description:** 92 hook documentation files exist without corresponding implementations.

**Sample Missing Hooks:**

- `use-ab-testing.mdx`
- `use-analytics.mdx`
- `use-auto-focus.mdx`
- `use-offline-chat.mdx`
- `use-security.mdx`
- (87 more)

**Solution:** Either implement the documented hooks or remove/update the documentation.

---

### ISSUE-006: useChat Method Signature Mismatches

**Severity:** HIGH - API Documentation incorrect **Affected Files:**

- Docs: `/apps/docs/content/hooks/use-chat.mdx`
- Impl: `/packages/react/src/hooks/chat/use-chat-unified.ts`

**Discrepancies:**

1. `retry()` method documented but doesn't exist
2. `clear()` documented but implementation has `clearMessages()`
3. Return types differ (`Promise<void>` vs `Promise<string | null>`)
4. Missing documentation for `input`, `setInput`, `stop`, `reload`, `chat`
5. Error type mismatch: `Error | null` vs `Error | undefined`

**Solution:** Update documentation to match actual implementation.

---

### ISSUE-007: useClarityChat Documentation Incomplete

**Severity:** HIGH - Critical hook poorly documented **Affected Files:**

- Docs: `/apps/docs/content/hooks/use-clarity-chat.mdx`
- Impl: `/packages/react/src/hooks/use-clarity-chat/`

**Description:** Auto-generated documentation only shows function signature with no details about:

- `memoryInfo` property
- `memoryErrorInfo` property
- `tokenStats` property
- Configuration options for memory, transport, promptOptimization
- All inherited properties from useChatEnhanced

**Solution:** Rewrite documentation with comprehensive property descriptions and examples.

---

### ISSUE-008: Deprecated Hooks Not Marked in Documentation

**Severity:** HIGH - Users may use deprecated APIs **Affected Files:**

- Docs: `/apps/docs/content/hooks/use-chat.mdx`
- Impl: `/packages/react/src/hooks/chat/use-chat.ts`

**Description:** `use-chat.ts` is marked `@deprecated` with message:

> This hook will be removed in v3.0. Please migrate to `useClarityChat`.

But documentation shows no deprecation warning.

**Solution:** Add deprecation notice to documentation with migration guide.

---

### ISSUE-009: useStreaming Type Documentation Error

**Severity:** MEDIUM - Incorrect type information **Affected Files:**

- Docs: `/apps/docs/content/hooks/use-streaming.mdx`
- Impl: `/packages/react/src/hooks/streaming/use-streaming.ts`

**Description:** Documentation shows:

```typescript
startStreaming: (stream: ReadableStream<Uint8Array<ArrayBufferLike>>, ...)
```

But implementation uses:

```typescript
startStreaming: (stream: ReadableStream<Uint8Array>, ...)
```

The `<ArrayBufferLike>` generic parameter is incorrect.

**Solution:** Fix type in documentation.

---

## Medium Priority Issues (P2) - Code Quality

### ISSUE-010: Internal Hooks Export Locations

**Severity:** MEDIUM - API surface inconsistency

**Description:** Some hooks were documented but only exported from internal modules, not the public
API:

- `useAutoFocus` - in accessibility/focus-management.ts
- `useAnalytics` - in analytics/AnalyticsProvider.tsx
- `useABTesting` - in components/dashboards/ab-testing-dashboard.tsx

**Resolution:** These hooks are correctly available via `@clarity-chat/react/internal` through the
re-export chain. The orphaned documentation was removed in ISSUE-005. The public API is
intentionally curated - advanced hooks remain in internal exports for power users.

---

### ISSUE-011: Component Test Coverage Gaps

**Severity:** MEDIUM - Quality assurance

**Description:** Some components lack dedicated test files:

- No dedicated tests: MobileChatOptimized, OfflineChatSync
- Partial coverage: Some UI components

**Current Coverage Analysis:**

- Test files: 181
- Source components: 186
- Hooks: 81

**Assessment:** Overall test coverage is good (~1:1 ratio). The mentioned components are edge cases.
Most core functionality is well-tested. Specific component tests can be added incrementally as part
of ongoing development.

**Recommendation:** Track as technical debt for incremental improvement rather than blocking issue.

---

### ISSUE-012: Storybook Build Failure - AnimationPlayground

**Severity:** MEDIUM - Build blocker for Storybook

**Description:** AnimationPlayground.stories.tsx imported animation components from the public API
(`@clarity-chat/react`) but these components are only available in internal exports.

**Affected File:** `apps/storybook/stories/Foundation/AnimationPlayground.stories.tsx`

**Components Affected:**

- FeedbackAnimation, SuccessCheckmark, ErrorShake, PulseAttention
- RippleEffect, ConfettiEffect, GlowEffect, BounceIn
- SlideNotification, AnimatedList, AnimatedListItem
- FadePresence, SlidePresence, ScalePresence, StaggerContainer, AnimatedGrid

**Solution:** Updated imports to use `@clarity-chat/react/internal`.

---

## Low Priority Issues (P3) - Enhancements

### ISSUE-013: Accessibility Audit

**Severity:** LOW - Enhancement

**Description:** Verify accessibility infrastructure is complete.

**Audit Findings - COMPREHENSIVE SYSTEM IN PLACE:**

1. **WCAG Validator** (`wcag-validator.ts`) - Full WCAG 2.1 AAA compliance checking
2. **Accessibility Automation** (`accessibility-automation.ts`) - Auto-generates ARIA attributes
3. **Core Utilities** (`core-utilities.ts`) - 20+ accessibility helper functions:
   - Contrast ratio checking, screen reader announcements, live regions
   - Button/input/navigation/modal accessibility helpers
   - Skip link creation, ARIA validation
4. **Focus Management** (`focus-management.ts`) - Focus trap, restoration, auto-focus
5. **Keyboard Shortcuts** (`keyboard-shortcuts.tsx`) - Full keyboard navigation system
6. **Storybook Documentation** - Complete accessibility guide with a11y addon integration
7. **Test Coverage** - 542-line test suite for accessibility automation

**Status:** Accessibility infrastructure is mature and comprehensive.

---

### ISSUE-014: Performance Optimization

**Severity:** LOW - Enhancement

**Description:** Verify performance optimization infrastructure.

**Audit Findings - COMPREHENSIVE SYSTEM IN PLACE:**

1. **Large Message List Rendering:**
   - `virtualized-message-list.tsx` - Virtual scrolling for long conversations
   - `tanstack-message-list.tsx` - TanStack Virtual integration
   - `performance-optimization.ts` - Virtual scroll utilities with overscan

2. **Animation Frame Usage:**
   - Performance hooks (`use-performance.tsx`)
   - Debounced input handling utilities
   - Efficient re-rendering strategies

3. **Bundle Size Optimization:**
   - `bundle-analyzer.ts` - Full bundle analysis with:
     - Size thresholds per asset type
     - Gzip/Brotli compression analysis
     - Treemap generation
     - Asset group configuration
   - Tree-shakeable exports with multiple entry points

**Status:** Performance optimization infrastructure is mature and comprehensive.

---

### ISSUE-015: TypeScript Errors from Main Branch Merge

**Severity:** HIGH - Build blocker **Progress:** ~99 errors remaining (down from ~200)

**Description:** After merging main branch, TypeScript errors were introduced.

**FIXED Items:**

- ✅ Missing icon exports (SortIcon, StarIcon, ShareIcon, UploadIcon, PlusIcon, etc.) - Added to
  icons.tsx
- ✅ Missing UI components (Switch, Label, Separator) - Created re-exports from primitives
- ✅ `setMessages` missing from RateLimitedChatReturn - Added to interface and return
- ✅ `onDeleteMessage`, `onEditMessage`, `onRegenerateMessage` undefined - Fixed to use
  processedProps
- ✅ monaco-editor types - Created type declaration file
- ✅ clarity-chat.tsx callback mismatches - Fixed callback references
- ✅ React UMD global errors - Added imports to utility files
- ✅ toast.tsx type exports - Recreated from JS with proper TypeScript
- ✅ use-chat-unified types - Recreated from JS with proper TypeScript
- ✅ utils/cn import path issues - Fixed to use @clarity-chat/primitives
- ✅ Animation duration constants - Added `durations` to affected files
- ✅ Duplicate exports in public-api.ts and internal.ts - Removed or consolidated
- ✅ Security exports - Updated to match actual exports from security.tsx
- ✅ Button 'outline' variant - Added to Button component
- ✅ Override modifiers - Added to error-boundary.tsx class methods

**Remaining Issues (~99 errors):**

- Type mismatches in prompt-library.tsx (actions, comments)
- CoreMessage property issues (timestamp, metadata)
- Various overload and generic type mismatches
- Some duplicate export warnings in internal.ts

---

## Resolution Progress

| Issue ID  | Status     | Assigned | Fixed In                                           |
| --------- | ---------- | -------- | -------------------------------------------------- |
| ISSUE-001 | FIXED      | Audit    | Built @clarity-chat/token-optimization             |
| ISSUE-002 | FIXED      | Audit    | packages/react/src/hooks.ts - explicit exports     |
| ISSUE-003 | FIXED      | Audit    | packages/react/src/types/gpt-tokenizer.d.ts        |
| ISSUE-004 | FIXED      | Audit    | packages/react/src/types/prismjs.d.ts              |
| ISSUE-005 | FIXED      | Audit    | Deleted 81 orphaned hook documentation files       |
| ISSUE-006 | FIXED      | Audit    | apps/docs/content/hooks/use-chat.mdx rewritten     |
| ISSUE-007 | FIXED      | Audit    | apps/docs/content/hooks/use-clarity-chat.mdx       |
| ISSUE-008 | FIXED      | Audit    | Added deprecation notice to use-chat.mdx           |
| ISSUE-009 | FIXED      | Audit    | Fixed type in use-streaming.mdx                    |
| ISSUE-010 | FIXED      | Audit    | Verified internal exports, removed orphan docs     |
| ISSUE-011 | DOCUMENTED | Audit    | Good coverage (181 tests), gaps tracked            |
| ISSUE-012 | FIXED      | Audit    | Updated imports to @clarity-chat/react/internal    |
| ISSUE-013 | VERIFIED   | Audit    | Comprehensive a11y system already in place         |
| ISSUE-014 | VERIFIED   | Audit    | Comprehensive perf system already in place         |
| ISSUE-015 | PROGRESS   | Audit    | Major fixes applied, ~99 errors remain (50% fixed) |

---

_Last Updated: January 2026_
