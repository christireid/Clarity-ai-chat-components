# Code Reuse & Consistency Audit Report

**Date**: 2026-02-07
**Scope**: `packages/` and `apps/component-showcase/`
**Branch**: `claude/audit-code-reuse-nOFjJ`

---

## Executive Summary

**Overall Code Reuse Score: ~62%** — Approximately 38% of code across `packages/` and `apps/component-showcase/` could leverage existing shared assets instead of duplicating functionality.

The monorepo contains a rich library of 200+ components, 80+ hooks, and 150+ utilities. However, organic growth across packages has produced significant duplication in core infrastructure: error handling, accessibility utilities, animation presets, circuit breakers, retry logic, and type definitions. The component showcase app also has opportunities to use more shared utilities.

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 5 | Duplicate base classes/types creating incompatible APIs |
| **High** | 12 | Redundant implementations increasing maintenance burden |
| **Medium** | 8 | Inconsistencies that cause developer confusion |
| **Low** | 6 | Minor duplications or nice-to-have consolidations |

---

## Section 1: Critical Issues (Must-Fix)

### C1. Three Incompatible `ClarityError` Base Classes

| File | Package | API Surface |
|------|---------|-------------|
| `packages/error-handling/src/errors/base-error.ts` | error-handling | `code`, `statusCode`, `recoverable`, `solution`, `docs` |
| `packages/utils/src/errors/base.ts` | utils | `userMessage`, `technicalMessage`, `solutions[]`, `toTerminalString()` |
| `packages/react/src/error/clarity-error.ts` | react | `code`, `context`, validation helpers (`validateArrayProp`, etc.) |

**Impact**: Consumers cannot pass errors between packages without conversion. `toJSON()` outputs differ. `isRecoverableError()` implementations have different fallback behavior (error-handling returns `false` for unknown; token-optimization returns `true`).

**Refactor Approach**: Designate `packages/error-handling` as the canonical error package. Merge the richer `solutions[]` from utils into it. Have `packages/react` and `packages/utils` re-export from error-handling.

---

### C2. 10+ Incompatible `ChatMessage` / `Message` Type Definitions

| File | Package | Notable Differences |
|------|---------|-------------------|
| `packages/types/src/message.ts` | types | Full `Message` with `id`, `chatId`, `attachments`, `metadata`, `feedback` |
| `packages/react/src/types/messages.ts` | react | `UIMessage` / `ModelMessage` (Vercel AI SDK 5 pattern) |
| `packages/react/src/adapters/types.ts` | react | `ChatMessage` with `ClarityChatMessage extends ChatMessage` |
| `packages/token-optimization/src/tokenizers/accurate-counter.ts` | token-optimization | `ChatMessage` with `role` union including `'function' \| 'tool'` |
| `packages/react/src/hooks/clarity-tokens/pipeline/types.ts` | react | Another `ChatMessage` interface |
| `packages/react/src/hooks/chat/use-chat-history.ts` | react | Another `ChatMessage` interface |
| `packages/react/src/components/clarity/expandable-chat.tsx` | react | Another `ChatMessage` interface |
| `packages/react/src/providers/ClarityChatProvider.tsx` | react | Another `ChatMessage` interface |

**Impact**: Type conversion boilerplate everywhere. TypeScript cannot validate message passing between packages. Each team working in a different package may drift further apart.

**Refactor Approach**: Define a single `ChatMessage` in `packages/types` that covers all use cases (including `role: 'tool'`). Create narrower subtypes (`UIMessage`, `ModelMessage`) that extend it. All packages import from `@clarity-chat/types`.

---

### C3. Broken `cn` Utility in `packages/react`

| File | Implementation | Tailwind Conflict Resolution |
|------|---------------|------------------------------|
| `packages/primitives/src/lib/cn.ts` | `twMerge(clsx(inputs))` | Yes |
| `packages/playground/src/utils/cn.ts` | `twMerge(clsx(inputs))` | Yes |
| `packages/react/src/utils/cn.ts` | Manual filter + join | **No** — `cn('px-2', 'px-4')` keeps both classes |

**Impact**: Any component in `packages/react` using `cn()` will have broken Tailwind class precedence. A comment in the file itself acknowledges this and recommends using primitives, but the function is still imported by other modules.

**Refactor Approach**: Replace `packages/react/src/utils/cn.ts` with a re-export from `@clarity-chat/primitives`. Remove the playground copy.

---

### C4. Four Incompatible `TokenBudgetConfig` Definitions

| File | Key Properties |
|------|---------------|
| `packages/memory/src/types/config.ts` | `maxContextWindow`, `allocation` (6-field object), `dynamicAllocation` |
| `packages/react/src/utils/tokenization/token-budget-validator.ts` | `maxTokens`, `warningThreshold`, `criticalThreshold`, `autoTruncate`, `truncationStrategy` |
| `packages/token-optimization/src/budget/advanced-budget.ts` | `maxTokens`, `reserveTokens`, `minQualityThreshold`, `enableCompression`, `priorityWeights` |
| `packages/token-optimization/src/hooks/use-token-budget-monitor.ts` | `maxInputTokens`, `warningThreshold`, `criticalThreshold`, `reservedForOutput`, `model`, `callbacks` |

**Impact**: Impossible to share budget configurations between packages. Memory package and token-optimization package cannot interop without manual mapping.

**Refactor Approach**: Define canonical `TokenBudgetConfig` in `packages/token-optimization` with all fields (using optional properties for package-specific needs). All other packages import and extend from there.

---

### C5. Two Separate Error Handling Systems

`packages/error-handling` and `packages/utils/src/errors/` are two complete, parallel error hierarchies:

- **error-handling**: `ApiError`, `StreamingError`, `ProviderError`, `EnhancedValidationError` + error boundaries + hooks
- **utils**: `APIKeyMissingError`, `APIRateLimitError`, `APINetworkError`, `ValidationError`, `CLIError` + utilities

Both packages export `ClarityError`, `formatError()`, `normalizeError()`, `isRecoverableError()` with different signatures and behavior.

**Refactor Approach**: `packages/error-handling` owns React-specific error handling (boundaries, hooks, components). `packages/utils` owns non-React error classes and utilities. Both share a single `ClarityError` base defined in one location.

---

## Section 2: High-Severity Issues

### H1. Three Separate Circuit Breaker Implementations

| File | Generic? | State Names | Registry? |
|------|----------|-------------|-----------|
| `packages/react/src/utils/resilience/circuit-breaker.ts` | No | `CLOSED/OPEN/HALF_OPEN` | No |
| `packages/token-optimization/src/resilience/circuit-breaker.ts` | Yes `<T>` | `closed/open/half-open` | Yes |
| `packages/react/src/adapters/circuit-breaker.ts` | No | Mixed | Yes |

**Refactor**: Consolidate into `packages/utils` with generic type support. Standardize on lowercase state names.

---

### H2. Five Separate Retry/Backoff Implementations

| File | Function | Returns |
|------|----------|---------|
| `packages/utils/src/async/index.ts` | `retry()` | Direct value or throws |
| `packages/react/src/utils/resilience/retry-with-backoff.ts` | `retryWithBackoff()` | `RetryResult<T>` with attempts/totalTime |
| `packages/react/src/hooks/resilience/use-retry-with-backoff.ts` | `useRetryWithBackoff()` | React hook with state |
| `packages/token-optimization/src/errors/index.ts` | `withRetry()` | Direct value or throws |
| `packages/react/src/adapters/retry.ts` | `withRetry()` | `RetryTracker` class |

**Refactor**: Canonical `retry()` in `packages/utils`. React hook in `packages/react` wrapping it. Remove other copies.

---

### H3. `useReducedMotion` Exists in 6 Locations

| File | Type |
|------|------|
| `packages/primitives/src/hooks/use-reduced-motion.ts` | **Canonical** — SSR-safe, fallback listeners |
| `packages/react/src/hooks/ui/use-reduced-motion.ts` | Re-export (correct) |
| `packages/react/src/utils/animations.ts` | Duplicate implementation (simpler) |
| `packages/react/src/animations/zero-dependency.ts` | `prefersReducedMotion()` function |
| `packages/error-handling/src/accessibility.ts` | Re-export (correct) |
| `packages/dev-tools/src/react/components/accessibility.tsx` | Duplicate implementation |

**Refactor**: Delete duplicate implementations. All packages should re-export from `@clarity-chat/primitives`.

---

### H4. Accessibility Utilities Duplicated Across 4 Packages

| Function | primitives | react | error-handling | dev-tools | token-optimization |
|----------|-----------|-------|----------------|-----------|-------------------|
| `announce()` | Yes | Yes | — | — | Yes (domain-specific) |
| `getFocusableElements()` | Yes | Yes (2x) | — | Yes | — |
| `useFocusManagement()` | — | Yes | Yes | Yes | — |
| `useKeyboardNavigation()` | — | Yes | Yes | Yes | — |
| `useScreenReaderAnnounce()` | — | Yes | Yes | — | — |

**Refactor**: `packages/primitives` owns low-level accessibility utilities (`announce`, `getFocusableElements`, ARIA helpers). `packages/react` owns React hooks wrapping them. Other packages re-export.

---

### H5. Duplicate Animation Preset Systems

| File | Duration values | Spring configs |
|------|----------------|---------------|
| `packages/primitives/src/lib/animation-presets.ts` | fast: 0.1, normal: 0.2, slow: 0.3 | snappy, gentle, bouncy, smooth |
| `packages/react/src/utils/animations.ts` | FAST: 0.15, NORMAL: 0.3, SLOW: 0.5 | ease, spring, bounce, gentleSpring |

Timing values differ (e.g., "fast" = 100ms vs 150ms). Spring configurations overlap but use different names.

**Refactor**: Canonical presets in `packages/primitives`. React package re-exports and adds domain-specific variants (messageEnter, thinkingPulse, etc.).

---

### H6. Debounce/Throttle in Both `packages/utils` and `packages/primitives`

| File | Functions |
|------|----------|
| `packages/utils/src/async/index.ts` | `debounce()`, `throttle()` with cancel/flush, also `sleep()`, `timeout()`, `pool()` |
| `packages/primitives/src/lib/utils/async.ts` | `debounce()`, `throttle()`, `sleep()` (simpler versions) |

**Refactor**: Remove from primitives, import from `@clarity-chat/utils`. React hooks (`useDebounce`, `useThrottle`) are correct and wrap the utility.

---

### H7. Five `formatError` / `normalizeError` Implementations

| File | Return Type |
|------|------------|
| `packages/utils/src/errors/utils.ts` | Formatted string with emoji |
| `packages/memory/src/errors.ts` | User-friendly string with error code |
| `packages/utils/src/error-handler.ts` | Formatted display object |
| `packages/react/src/utils/resilience/error-handling.ts` | `ClarityError` interface object |
| `packages/token-optimization/src/errors/index.ts` | Errors with docs links |

| `normalizeError()` Location | Return |
|----|--------|
| `packages/utils/src/errors/utils.ts` | `Error` instance |
| `packages/error-handling/src/errors/type-guards.ts` | `{name, code, message, statusCode, recoverable}` |
| `packages/react/src/utils/resilience/error-handling.ts` | `{message, type, statusCode, retryable}` |

**Refactor**: Single `normalizeError()` in `packages/error-handling` returning a standardized shape. Domain packages can add context.

---

## Section 3: Medium-Severity Issues

### M1. Showcase Uses Inline Formatting Instead of `@clarity-chat/utils`

20+ instances across showcase pages where `.toFixed()`, `Math.round()`, or template literal formatting is used instead of importing `formatNumber()`, `formatDuration()`, `formatBytes()`, `formatPercent()` from `@clarity-chat/utils`.

| File | Example | Should Use |
|------|---------|-----------|
| `apps/component-showcase/app/chat/page.tsx:294` | `` `${(1.5 + Math.random()).toFixed(1)}s` `` | `formatDuration()` |
| `apps/component-showcase/app/chat/page.tsx:837` | `${((total / 1000) * 0.01).toFixed(4)}` | `formatNumber()` |
| `apps/component-showcase/app/dashboards/page.tsx:124` | `{(totalUsed / 1000000).toFixed(2)}M` | `formatNumber()` |
| `apps/component-showcase/app/features/page.tsx` (10+ lines) | Multiple `.toFixed()` calls | `formatNumber()` / `formatPercent()` |

---

### M2. 209+ Hardcoded Color Values in Component Showcase

Examples by page:

| File | Count | Examples |
|------|-------|---------|
| `apps/component-showcase/app/theme/page.tsx` | 40+ | `#3b82f6`, `#6366f1`, `#22c55e`, `#84cc16` |
| `apps/component-showcase/app/clones/page.tsx` | 50+ | `bg-[#2b2a27]`, `text-[#d4d3cf]`, `bg-[#da7756]` |
| `apps/component-showcase/app/code-data/page.tsx` | 30+ | `bg-[#1e1e1e]`, `text-[#d4d4d4]`, `text-[#6e7681]` |
| `apps/component-showcase/app/loading-states/page.tsx` | 20+ | `rgba(255,255,255,0.2)` in gradients |
| `packages/globals.css` | 42 | `border-green-500`, `text-red-500`, `bg-yellow-500/10` |

Note: Some hardcoded colors in `clones/page.tsx` are intentional (replicating specific product UIs like Claude, ChatGPT). However, generic showcase pages should use design tokens.

---

### M3. Undefined AI Color Tokens

`tailwind.config.js` references six AI-specific CSS variables that are never defined in `globals.css`:

```javascript
ai: {
  assistant: 'var(--ai-assistant)',  // undefined
  user: 'var(--ai-user)',            // undefined
  thinking: 'var(--ai-thinking)',    // undefined
  tool: 'var(--ai-tool)',            // undefined
  error: 'var(--ai-error)',          // undefined
  system: 'var(--ai-system)',        // undefined
}
```

**Impact**: Any usage of `bg-ai-assistant`, `text-ai-thinking`, etc. will render with no color.

---

### M4. Border-Radius Mismatch Between Design System and Showcase

| Source | `--radius` Value |
|--------|-----------------|
| `packages/globals.css` | `0.625rem` (10px) |
| `apps/component-showcase/app/globals.css` | `0.5rem` (8px) |

Components rendered in the showcase will have different border-radius than the design system specifies.

---

### M5. Duplicate `getIcon()` Functions

| File | Purpose |
|------|---------|
| `apps/component-showcase/app/feedback-status/page.tsx:65` | Icon by toast/notification type |
| `apps/component-showcase/app/feedback-status/page.tsx:435` | Identical duplicate in same file |
| `packages/error-handling/src/components/ChatErrorBoundary.tsx:182` | Same pattern |
| `packages/error-handling/src/components/ErrorDisplay.tsx:190` | Same pattern |
| `packages/error-handling/src/components/ErrorToast.tsx:264` | Same pattern |

Similarly, `getFileIcon()` appears in both `apps/component-showcase/app/media-files/page.tsx` and `packages/react/src/components/ai/Attachments.tsx` / `FileTree.tsx`.

---

### M6. Repeated Chat Input State Pattern in Showcase

The `clones/page.tsx` file repeats this identical pattern 7 times (once per AI clone):

```tsx
const [input, setInput] = useState('')
const [messages, setMessages] = useState([...])
const handleSend = () => {
  if (!input.trim()) return
  setMessages(prev => [...prev, { role: 'user', content: input }])
  setInput('')
  setTimeout(() => {
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }])
  }, 1000)
}
```

This should be extracted to a `useDemoChat()` hook.

---

### M7. `useFocusManagement` Has 4 Different APIs

| File | Options |
|------|---------|
| `packages/error-handling/src/accessibility.ts` | `trapFocus`, `restoreFocus`, `initialFocus`, navigation methods |
| `packages/error-handling/src/hooks/useAccessibility.ts` | `captureFocus`, `focusError`, `restoreFocus` (deprecated) |
| `packages/react/src/utils/accessibility-helpers.tsx` | `initialFocus`, `returnFocus`, `trapFocus` |
| `packages/dev-tools/src/react/components/accessibility.tsx` | `enabled`, `returnFocus`, `initialFocus` |

---

### M8. Showcase Monolithic File Sizes

| File | Lines | Issue |
|------|-------|-------|
| `apps/component-showcase/app/features/page.tsx` | 6,647 | 81 inline demo components |
| `apps/component-showcase/app/chat/page.tsx` | 2,252 | Multiple demo functions with heavy state |
| `apps/component-showcase/app/clones/page.tsx` | 1,913 | 7 nearly-identical clone implementations |

---

## Section 4: Low-Severity Issues

### L1. `packages/dev-tools` has local `formatDuration()` instead of importing from utils
### L2. Duplicate keyframe definitions in showcase's `tailwind.config.js` (accordion-down/up already in root config)
### L3. `ModelIdentifier = ModelId | string` is redundant (ModelId already allows arbitrary strings)
### L4. Multiple re-export chains for types create confusing import paths (e.g., `ChatMessage` importable from 3+ paths)
### L5. Terminal component custom properties (`--terminal-bg`, etc.) outside design token system
### L6. Showcase `StatCard` component could potentially import from `packages/react/components/clarity/charts.tsx`

---

## Section 5: Recommended Consolidation Plan

### Phase 1: Fix Critical Type/API Conflicts (Highest Impact)

| # | Action | Packages Affected |
|---|--------|-------------------|
| 1 | Unify `ClarityError` base class — merge `solutions[]` from utils into error-handling's version | error-handling, utils, react |
| 2 | Consolidate `ChatMessage` types into `packages/types` | types, react, token-optimization, memory |
| 3 | Fix `cn()` in `packages/react` — re-export from primitives | react, primitives |
| 4 | Consolidate `TokenBudgetConfig` into `packages/token-optimization` | token-optimization, memory, react |
| 5 | Define missing AI color tokens in `globals.css` | globals.css |

### Phase 2: Eliminate Redundant Implementations (Reduce Maintenance)

| # | Action | Files to Change |
|---|--------|----------------|
| 6 | Single circuit breaker in `packages/utils` | react (2 files), token-optimization (1 file) |
| 7 | Single `retry()` in `packages/utils`, React hook wrapper in react | react (3 files), token-optimization (1 file) |
| 8 | Remove duplicate `useReducedMotion` — re-export from primitives everywhere | react (2 files), dev-tools (1 file) |
| 9 | Canonical accessibility primitives in primitives, React hooks in react | react (3 files), dev-tools (1 file) |
| 10 | Single animation preset system in primitives + domain extensions in react | react (1 file) |
| 11 | Remove debounce/throttle from primitives, use utils | primitives (1 file) |

### Phase 3: Improve Showcase Consistency

| # | Action | Files to Change |
|---|--------|----------------|
| 12 | Replace inline formatting with `@clarity-chat/utils` imports | 4 showcase pages |
| 13 | Extract `useDemoChat()` hook for clone pages | clones/page.tsx |
| 14 | Fix border-radius mismatch | showcase globals.css |
| 15 | Extract `getIcon()` / `getFileIcon()` to shared utility | feedback-status, media-files, error-handling |
| 16 | Split features/page.tsx into smaller files | features/page.tsx |

---

## Section 6: New Abstractions to Extract

| Abstraction | Source | Benefit |
|-------------|--------|---------|
| `@clarity-chat/resilience` package (or subpath in utils) | Circuit breaker + retry + backoff from 3 packages | Single resilience API |
| `useDemoChat()` hook | 7 identical patterns in clones/page.tsx | Showcase DRY |
| `getIconByType()` utility | 5 duplicate implementations | Single icon mapping |
| Unified `formatError()` with pluggable formatters | 5 implementations | Consistent error display |
| `TokenBudget` canonical type family | 4 incompatible definitions | Type-safe token interop |

---

## Appendix: Full Findings Table

| # | File | Issue | Existing Asset | Severity | Status |
|---|------|-------|---------------|----------|--------|
| 1 | `packages/react/src/utils/cn.ts` | Broken cn() without tailwind-merge | `packages/primitives/src/lib/cn.ts` | Critical | **FIXED** — Re-exports from primitives |
| 2 | `packages/utils/src/errors/base.ts` | Separate ClarityError hierarchy | `packages/error-handling/src/errors/base-error.ts` | Critical | **DOCUMENTED** — Cross-refs added, incompatible constructors noted |
| 3 | `packages/react/src/error/clarity-error.ts` | Third ClarityError variant | `packages/error-handling/src/errors/base-error.ts` | Critical | **DOCUMENTED** — @see reference to canonical base |
| 4 | 10+ files | Incompatible ChatMessage types | `packages/types/src/message.ts` | Critical | **FIXED** — Canonical ChatMessage + subtypes added to @clarity-chat/types, all local defs deprecated |
| 5 | 4 files | Incompatible TokenBudgetConfig | Should be in `packages/token-optimization` | Critical | **FIXED** — CanonicalTokenBudgetConfig + narrowed subtypes in token-optimization/types, all local defs deprecated |
| 6 | `packages/react/src/utils/resilience/circuit-breaker.ts` | Duplicate circuit breaker | `packages/token-optimization/src/resilience/circuit-breaker.ts` | High | **DOCUMENTED** — Cross-refs to all 3 implementations, consolidation plan noted |
| 7 | `packages/react/src/adapters/circuit-breaker.ts` | Third circuit breaker | Same as above | High | **DOCUMENTED** — Same as above |
| 8 | 5 files | Duplicate retry/backoff | `packages/utils/src/async/index.ts` | High | **FIXED** — adapters/retry.ts deprecated, resilience version is canonical |
| 9 | `packages/react/src/utils/animations.ts` | Duplicate animation presets | `packages/primitives/src/lib/animation-presets.ts` | High | **FIXED** — Aligned DURATION/EASING, re-exports from primitives |
| 10 | `packages/primitives/src/lib/utils/async.ts` | Duplicate debounce/throttle | `packages/utils/src/async/index.ts` | High | **DOCUMENTED** — Note added about canonical source |
| 11 | 6 files | Duplicate useReducedMotion | `packages/primitives/src/hooks/use-reduced-motion.ts` | High | **FIXED** — All duplicates replaced with re-exports from primitives |
| 12 | 4+ files | Duplicate getFocusableElements | `packages/primitives/src/lib/aria.ts` | High | **FIXED** — Re-exports added to accessibility-helpers.tsx, dev-tools, error-handling |
| 13 | 3+ files | Duplicate announce() | `packages/primitives/src/lib/aria.ts` | High | **FIXED** — Re-exports added to accessibility-helpers.tsx |
| 14 | 5 files | Duplicate formatError/normalizeError | Should be in `packages/error-handling` | High | **DOCUMENTED** — Cross-refs added to all 3 implementations explaining different contexts |
| 15 | `apps/component-showcase/app/globals.css` | Border-radius mismatch (0.5rem vs 0.625rem) | `packages/globals.css` | Medium | **FIXED** — Changed to 0.625rem |
| 16 | `tailwind.config.js` | 6 undefined AI color tokens | `packages/globals.css` (missing definitions) | Medium | **FIXED** — All 6 AI tokens defined in light + dark mode |
| 17 | 4 showcase pages | Inline formatting instead of utils | `@clarity-chat/utils` format functions | Medium | **FIXED** — format-helpers.ts created with formatCompact/formatPercent/formatCost |
| 18 | `apps/component-showcase/app/clones/page.tsx` | 7x repeated chat state pattern | Extract `useDemoChat()` | Medium | **FIXED** — useDemoChat hook created, 3 clones migrated (others have different UX) |
| 19 | 5 files | Duplicate getIcon() functions | Extract shared utility | Medium | **FIXED** — use-status-icon.tsx created with getStatusIcon/getFileIcon |
| 20 | 4 files | Inconsistent useFocusManagement APIs | Standardize single API | Medium | **DOCUMENTED** — Canonical version identified in accessibility-helpers.tsx, cross-refs added |
| 21 | `packages/globals.css` | 42 hardcoded Tailwind colors | Design tokens | Medium | Unchanged — Intentional for Tailwind utility reference |
| 22 | Showcase pages | 209+ hardcoded hex/rgb/hsl values | Design tokens / Tailwind theme | Medium | Unchanged — Many intentional (clone brand colors) |
| 23 | `apps/component-showcase/app/features/page.tsx` | 6,647 lines, 81 inline demos | Split into smaller files | Medium | **STARTED** — EXTRACTION_GUIDE.md + demos/ directory structure created |
| 24 | `packages/dev-tools` | Local formatDuration() | `@clarity-chat/utils` | Low | **FIXED** — Replaced with import from @clarity-chat/utils/format |
| 25 | Showcase tailwind.config.js | Duplicate accordion keyframes | Root tailwind.config.js | Low | **FIXED** — Removed duplicate keyframes, kept animation refs |
| 26 | `packages/react` | `ModelIdentifier = ModelId \| string` redundant | Just use `ModelId` | Low | **FIXED** — ModelIdentifier and TokenEncoding deprecated |
| 27 | Multiple packages | Confusing re-export chains | Document canonical import paths | Low | **FIXED** — Tool types barrel (tool.ts), canonical sources documented across packages |
| 28 | `packages/globals.css` | Terminal properties outside token system | Integrate into tokens | Low | **DOCUMENTED** — Note explaining intentional Night Owl scheme separation |

---

*Generated by automated code reuse audit. All file paths are relative to repository root.*
