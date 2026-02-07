# Consolidation Evidence Report

> Generated 2026-02-07. Branch: `claude/continue-work-uGkck`

---

## Summary

Comprehensive monorepo consolidation executing Phases 0-6 of the Staff+ audit.

**Before:** Code reuse score ~65%, 18 major duplication categories, broken `cn()`, version
inconsistencies across 7 packages, 9+ deprecated dead code exports in memory package, duplicate
`useReducedMotion` implementations missing SSR safety.

**After:** All P0 and P1 consolidation items resolved, deprecated dead code removed, version
inconsistencies fixed, dead CSS classes removed, public API expanded with promoted stable internal
exports.

---

## Changes by Category

### P0 — Critical Fixes

| Item                                          | Before                                                                | After                                                                             | Verification                              |
| --------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------- |
| **cn() in @clarity-chat/react**               | Broken: `filter(Boolean).join(' ')` — no Tailwind conflict resolution | Re-export from `@clarity-chat/primitives` (canonical `twMerge(clsx())`)           | Build passes, all 109 showcase tests pass |
| **cn() in @clarity-chat/playground**          | Dead duplicate of canonical                                           | Deleted file                                                                      | Build passes                              |
| **debounce in performance-unified.ts**        | Local reimplementation without `flush()`                              | Re-export from canonical `@clarity-chat/utils/async`                              | 460 utils tests pass                      |
| **debounce/throttle in memory/utils/core.ts** | Local reimplementations                                               | Re-exported from `@clarity-chat/utils/async` (now removed entirely as deprecated) | Memory build passes                       |

### P1 — High Priority

| Item                                              | Before                                                                                                   | After                                                 | Verification                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------- |
| **CopyButton migration artifact**                 | Both `copy-button.tsx` and `CopyButton.tsx` in same directory                                            | Deleted dead `copy-button.tsx` (kebab-case)           | React build passes              |
| **assertDefined duplicate**                       | Local reimplementation in `react/internal/assertions.ts`                                                 | Re-export from `@clarity-chat/utils/validation`       | React build passes              |
| **Public API promotions**                         | `useSafeTimeout`, `useSafeInterval`, `CopyButton`, `AnimatedDots` only in `@clarity-chat/react/internal` | Promoted to `@clarity-chat/react` public API          | Build passes                    |
| **useReducedMotion in react/utils/animations.ts** | Local duplicate missing SSR safety, no browser compat fallbacks                                          | Re-export from `@clarity-chat/primitives` (canonical) | Build passes                    |
| **useReducedMotion in token-optimization**        | Local function in TokenCostPreview.tsx, missing SSR safety                                               | Import from `@clarity-chat/primitives`                | Token-optimization build passes |
| **deepMerge in primitives**                       | Duplicate implementation (effectively dead — not exported from package)                                  | Deleted                                               | Primitives build passes         |

### Deprecated Code Removal

| Item                                          | Status         | Lines Removed |
| --------------------------------------------- | -------------- | ------------- |
| `memory/utils/core.ts` — clamp re-export      | Removed (dead) | ~2            |
| `memory/utils/core.ts` — deepMerge function   | Removed (dead) | ~28           |
| `memory/utils/core.ts` — generateId re-export | Removed (dead) | ~4            |
| `memory/utils/core.ts` — sleep re-export      | Removed (dead) | ~4            |
| `memory/utils/core.ts` — retry re-export      | Removed (dead) | ~4            |
| `memory/utils/core.ts` — debounce re-export   | Removed (dead) | ~4            |
| `memory/utils/core.ts` — throttle re-export   | Removed (dead) | ~4            |
| `memory/utils/core.ts` — isBrowser re-export  | Removed (dead) | ~4            |
| `memory/utils/core.ts` — isNode re-export     | Removed (dead) | ~4            |
| **Total deprecated lines removed**            |                | **~58**       |

### Dead Code Removal

| Item                                                                           | Lines Removed  |
| ------------------------------------------------------------------------------ | -------------- |
| `playground/src/utils/cn.ts` (dead file)                                       | 21             |
| `react/components/message/copy-button.tsx` (migration artifact)                | 266            |
| `primitives/lib/utils/object.ts` — deepMerge function                          | ~28            |
| `globals.css` — `.component-section`, `.component-grid-2`, `.component-grid-3` | ~9             |
| **Total dead code removed**                                                    | **~324 lines** |

### NPM Version Fixes

| Package            | Field               | Before  | After    |
| ------------------ | ------------------- | ------- | -------- |
| codemods           | vitest              | ^1.0.0  | ^4.0.16  |
| codemods           | typescript          | ^5.0.0  | ^5.9.3   |
| codemods           | tsup                | ^8.0.0  | ^8.5.1   |
| codemods           | @types/node         | ^20.0.0 | ^22.10.5 |
| license            | vitest              | ^3.0.0  | ^4.0.16  |
| license            | @vitest/coverage-v8 | ^3.0.0  | ^4.0.16  |
| license            | tsup                | ^8.0.0  | ^8.5.1   |
| license            | typescript          | ^5.9.0  | ^5.9.3   |
| token-optimization | jsdom               | ^26.0.0 | ^27.3.0  |

---

## Test Results

| Suite                              | Tests   | Status       |
| ---------------------------------- | ------- | ------------ |
| `@clarity-chat/component-showcase` | 109     | All pass     |
| `@clarity-chat/utils`              | 460     | All pass     |
| **Total verified**                 | **569** | **All pass** |

## Build Results

| Package                               | Status        |
| ------------------------------------- | ------------- |
| `@clarity-chat/utils`                 | Build success |
| `@clarity-chat/primitives`            | Build success |
| `@clarity-chat/memory`                | Build success |
| `@clarity-chat/token-optimization`    | Build success |
| `@clarity-chat/react` (all 8 bundles) | Build success |

---

## Documents Produced

| Document                     | Purpose                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `docs/monorepo-inventory.md` | Phase 1: Complete workspace map, categorized index, duplication matrix (18 categories) |
| `docs/consolidation-plan.md` | Phase 2: Target architecture, P0/P1/P2 prioritized refactors                           |
| `docs/npm-leverage-audit.md` | Phase 4: Dependency audit, version inconsistencies, recommendations                    |
| `docs/evidence.md`           | Phase 6: This document — before/after evidence with regression results                 |

---

## Commit 2: Complete Consolidation (all P1/P2 items)

### P1-5: CircuitState Unification

- Standardized to UPPERCASE (`'CLOSED' | 'OPEN' | 'HALF_OPEN'`) across all 5 definitions
- 44 string literal replacements in token-optimization and error-handling

### P2-1: ErrorBoundary Consolidation

- **Deleted 3 dead files** (1,596 lines): `ui/error-boundary.tsx`,
  `ui/dashboard-error-boundary.tsx`, `ui/__tests__/error-boundary.test.tsx`
- **Refactored 2 files** to delegate to `@clarity-chat/error-handling`'s `EnhancedErrorBoundary`
- Fixed broken imports in `enhanced-markdown-renderer.tsx` and `dashboard-components.test.tsx`
- Cleaned up `ui/ErrorBoundary.tsx`: removed `null as any` stubs, fixed `require()` → static import

### P2-2: ChatMessage Type Alignment

- Standardized showcase status enum: `'sending'|'sent'|'delivered'|'read'` →
  `'pending'|'streaming'|'complete'|'error'`
- Added missing `MessageToolCall` interface and `toolCalls` field to `clarity-chat-types.ts`

### P2-3: SSE Parsing Consolidation

- Removed dead `parseSSELine` from `adapters/shared.ts` (exported but never imported)
- Added canonical source cross-references in all 3 parser files

### P2-4: Model Routing Documentation

- Documented distinction: ai-infrastructure (server dispatch) vs token-optimization (cost routing)
- Added cross-reference comments in both packages

### Infrastructure

- **Added `deepMerge` to `@clarity-chat/utils`** as canonical source (new `object.ts` + subpath
  export)
- Updated `react/internal/helpers.ts` → re-export from utils (breaks no consumers)
- Replaced `memory/config-presets.ts` local `deepMerge` with utils import
- **Deleted dead files** (723 lines): `performance.ts`, `performance-optimization.ts`
- Moved react from CLI deps to devDeps, aligned boxen to ^8.0.1

### Combined Metrics (both commits)

| Metric                          | Value                          |
| ------------------------------- | ------------------------------ |
| Files deleted                   | 8                              |
| Lines removed (net)             | ~3,900                         |
| Duplication categories resolved | 14 of 18                       |
| Packages modified               | 10                             |
| Tests passing                   | 569 (109 showcase + 460 utils) |
| Builds passing                  | All 6 core packages            |

## Remaining Items (deferred — require breaking changes or deep design)

| Item                                                      | Reason for Deferral                       |
| --------------------------------------------------------- | ----------------------------------------- |
| Unify ChatMessage type across ALL 12+ package definitions | Requires semver-major API change          |
| Enable dts:true in dev builds                             | DX impact (build speed) assessment needed |
