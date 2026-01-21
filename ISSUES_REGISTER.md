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

### ISSUE-010: Internal Hooks Exported from Wrong Locations

**Severity:** MEDIUM - API surface inconsistency

**Description:** Some hooks are documented but only exported from internal modules, not the public
API:

- `useAutoFocus` - in accessibility/ but not in public-api.ts
- `useAnalytics` - in integrations/ but not in public-api.ts
- `useABTesting` - in dashboards/ but not in public-api.ts

**Solution:** Either add to public-api.ts or remove from documentation.

---

### ISSUE-011: Component Test Coverage Gaps

**Severity:** MEDIUM - Quality assurance

**Description:** Many components lack comprehensive tests:

- No tests: MobileChatOptimized, OfflineChatSync, MentionSystem, etc.
- Partial tests: StreamingMessage, Citation, many UI components

**Solution:** Add comprehensive test suites for untested components.

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

### ISSUE-013: Accessibility Audit Needed

**Severity:** LOW - Enhancement

**Description:** While core components have good accessibility, a full audit is needed to ensure:

- All ARIA attributes are correct
- Focus management is consistent
- Screen reader announcements work properly
- Keyboard navigation covers all features

---

### ISSUE-014: Performance Optimization Opportunities

**Severity:** LOW - Enhancement

**Description:** Potential optimization areas identified:

- Large message list rendering
- Animation frame usage
- Bundle size optimization

---

## Resolution Progress

| Issue ID  | Status  | Assigned | Fixed In                                        |
| --------- | ------- | -------- | ----------------------------------------------- |
| ISSUE-001 | FIXED   | Audit    | Built @clarity-chat/token-optimization          |
| ISSUE-002 | FIXED   | Audit    | packages/react/src/hooks.ts - explicit exports  |
| ISSUE-003 | FIXED   | Audit    | packages/react/src/types/gpt-tokenizer.d.ts     |
| ISSUE-004 | FIXED   | Audit    | packages/react/src/types/prismjs.d.ts           |
| ISSUE-005 | FIXED   | Audit    | Deleted 81 orphaned hook documentation files    |
| ISSUE-006 | FIXED   | Audit    | apps/docs/content/hooks/use-chat.mdx rewritten  |
| ISSUE-007 | FIXED   | Audit    | apps/docs/content/hooks/use-clarity-chat.mdx    |
| ISSUE-008 | FIXED   | Audit    | Added deprecation notice to use-chat.mdx        |
| ISSUE-009 | FIXED   | Audit    | Fixed type in use-streaming.mdx                 |
| ISSUE-010 | Pending | -        | -                                               |
| ISSUE-011 | Pending | -        | -                                               |
| ISSUE-012 | FIXED   | Audit    | Updated imports to @clarity-chat/react/internal |
| ISSUE-013 | Pending | -        | -                                               |
| ISSUE-014 | Pending | -        | -                                               |

---

_Last Updated: January 2026_
