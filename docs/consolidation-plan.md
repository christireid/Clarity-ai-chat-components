# Consolidation Plan

> Generated 2026-02-07. Branch: `claude/continue-work-uGkck` Companion document:
> [docs/monorepo-inventory.md](./monorepo-inventory.md)

---

## Target End-State Architecture

```
@clarity-chat/types          ← shared type definitions (ChatMessage, StreamEvent, etc.)
@clarity-chat/utils          ← domain-agnostic utilities (generateId, debounce, throttle, deepMerge, cn)
@clarity-chat/primitives     ← UI primitives + cn() re-export from utils (or keep canonical here)
@clarity-chat/error-handling ← error boundaries, recovery, reporting
@clarity-chat/token-optimization ← token budget, compression, caching
@clarity-chat/memory         ← conversation memory, summarization
@clarity-chat/react          ← hooks + components (imports all above, zero local reimplementations)
```

**Principles:**

1. Every symbol has exactly ONE canonical source package
2. Other packages import or re-export — never reimplement
3. Public API (`@clarity-chat/react`) is the only consumer-facing entrypoint
4. Internal barrel (`@clarity-chat/react/internal`) for unstable exports; promote when stable
5. Showcase app imports from packages only — no local type copies

---

## P0 — Critical (implement now)

These fix correctness bugs or eliminate symbols that produce wrong results.

### P0-1: Fix broken `cn()` in `@clarity-chat/react`

**Problem:** `packages/react/src/utils/cn.ts` uses `filter(Boolean).join(' ')` without
`tailwind-merge`, producing wrong class output when Tailwind classes conflict (e.g.
`cn('px-2', 'px-4')` → `'px-2 px-4'` instead of `'px-4'`). 6 component files import it.

**Canonical source:** `packages/primitives/src/lib/cn.ts` (uses `twMerge(clsx())`)

**Action:**

1. Replace body of `packages/react/src/utils/cn.ts` with a re-export:
   ```ts
   export { cn } from '@clarity-chat/primitives'
   ```
2. Verify the 6 importing files still compile (no signature change needed — both accept
   `ClassValue[]`)
3. Delete `packages/playground/src/utils/cn.ts` (dead code — index.ts already re-exports from
   primitives)

**Risk:** LOW — the canonical `cn` is a strict superset of the broken one. **Regression guard:** Add
a unit test in `packages/react` that verifies `cn('px-2', 'px-4')` returns `'px-4'`.

---

### P0-2: Consolidate `generateId` within packages

**Problem:** 7 implementations with different ID formats. `@clarity-chat/utils` has the canonical
one (`prefix_base36ts_random`), but `memory`, doc apps, and internal react files have independent
copies.

**Action:**

1. In `packages/react/src/utils/id-generator.ts` — already wraps canonical. **No change needed.**
2. In `packages/react/src/internal/helpers.ts` — already re-exports. **No change needed.**
3. In `packages/memory/src/utils/core.ts` — if `generateId` exists, replace with import from
   `@clarity-chat/utils`. (Audit shows only `estimateTokens` is imported from core, `generateId` may
   not exist there — **verify before changing**.)
4. Leave doc-app local copies alone (different apps, different deploy targets — acceptable
   divergence for demo-only code).

**Risk:** LOW — format change only affects display, not correctness. **Regression guard:** Existing
tests cover ID generation in utils.

---

### P0-3: Unify `debounce` / `throttle`

**Problem:** 6+ implementations with different cancellation semantics. Most feature-rich is
`@clarity-chat/utils/async` (has `cancel()` + `flush()` for debounce, `cancel()` + leading/trailing
options for throttle).

**Action:**

1. **Canonical source:** `packages/utils/src/async/index.ts` — already the most complete. Keep
   as-is.
2. In `packages/react/src/utils/optimization/performance.ts`: Replace `debounce` and `throttle`
   bodies with re-exports from `@clarity-chat/utils/async`. Keep
   `createDebouncedFunction`/`createThrottledFunction` if they're used (config-based API is
   different enough to warrant existence), but have them delegate internally.
3. In `packages/react/src/utils/optimization/performance-optimization.ts`: Same — delegate to
   `@clarity-chat/utils/async` internally.
4. In `packages/memory/src/utils/core.ts`: Replace local `debounce`/`throttle` with imports from
   `@clarity-chat/utils/async`.
5. In `packages/primitives/src/lib/utils/async.ts`: Replace with re-exports from
   `@clarity-chat/utils/async`. (Primitives already has no dep on utils — would need to add it, OR
   move these to utils and have primitives re-export. **Prefer adding the dep since primitives is a
   leaf package.**)
6. `packages/utils/src/performance-unified.ts`: Delete the duplicate
   `debounce`/`createDebouncedFunction`/`createThrottledFunction` — they're copies of
   async/index.ts + performance-optimization.ts.

**Risk:** MEDIUM — cancellation semantics change for consumers of minimal implementations (they gain
`.cancel()` they didn't have before, which is additive, not breaking). The `primitives → utils`
dependency addition needs Turborepo graph verification. **Regression guard:** Run full
`pnpm check:all` after each package change. Add test that `debounce` returned function has `.cancel`
and `.flush` methods.

---

## P1 — High Priority (implement in this session)

### P1-1: Fix `CopyButton` migration artifact

**Problem:** Both `copy-button.tsx` and `CopyButton.tsx` exist in
`packages/react/src/components/ui/`. One is likely dead.

**Action:**

1. Check which file is imported anywhere. Delete the unused one.
2. If both are imported, merge into the PascalCase file and update imports.

**Risk:** LOW — file deletion of dead code.

---

### P1-2: Consolidate `assertDefined`

**Problem:** `packages/react/src/internal/assertions.ts` has its own copy instead of importing from
`@clarity-chat/utils/validation`.

**Action:** Replace body with re-export from `@clarity-chat/utils/validation`.

**Risk:** LOW — identical semantics.

---

### P1-3: Promote stable internal exports to public API

**Problem:** Showcase imports 5 symbols from `@clarity-chat/react/internal` that are stable enough
for public API: `useSafeInterval`, `useSafeTimeout`, `CopyButton`, `AnimatedDots`,
`useSmoothedText`.

**Action:**

1. Add these 5 exports to `packages/react/src/public-api.ts`.
2. Update showcase imports from `@clarity-chat/react/internal` → `@clarity-chat/react`.

**Risk:** LOW — additive API change, no breaking change. Internal path continues to work.

---

### P1-4: Consolidate `useReducedMotion`

**Problem:** 4 independent implementations across primitives, error-handling, token-optimization,
and react.

**Action:**

1. **Canonical source:** `packages/primitives` (leaf package, most appropriate for a UI hook).
2. In error-handling, token-optimization, react: replace local copies with
   `import { useReducedMotion } from '@clarity-chat/primitives'`.

**Risk:** LOW — identical behavior (all check `prefers-reduced-motion` media query).

---

### P1-5: Unify `CircuitState` type conventions

**Problem:** 3 incompatible conventions: lowercase strings, uppercase strings, TypeScript enum.

**Action:**

1. **Canonical convention:** lowercase strings (`'closed' | 'open' | 'half-open'`) — matches the
   public `useCircuitBreaker` hook API.
2. Audit all 5 locations and standardize to lowercase.
3. Add a type alias in `@clarity-chat/types`: `type CircuitState = 'closed' | 'open' | 'half-open'`.

**Risk:** MEDIUM — consumers comparing against uppercase strings will break silently. Need to grep
for `'OPEN'`, `'CLOSED'`, `'HALF_OPEN'` usage. **Regression guard:** Type-level change — TypeScript
will catch mismatches at compile time.

---

### P1-6: Clean up `deepMerge` implementations

**Problem:** 8 implementations with different mutability guarantees.

**Action:**

1. **Canonical source:** `packages/utils` — ensure it does NOT mutate target (pure function).
2. Replace all other implementations with imports from `@clarity-chat/utils`.
3. In `packages/react`, `packages/memory`, `packages/token-optimization`, `packages/dev-tools`,
   `packages/error-handling`: swap local implementations for imports.

**Risk:** MEDIUM — implementations that mutated target will now be pure. Callers relying on mutation
side-effects will break. **Regression guard:** Run full test suite after each package change.

---

## P2 — Lower Priority (future sessions)

### P2-1: Consolidate `ErrorBoundary` implementations

- 13+ implementations is excessive but many are specialized (ChatErrorBoundary, FormErrorBoundary,
  etc.)
- **Action:** Audit which are truly duplicates vs. domain-specific variants. Create a base
  `ErrorBoundary` in `error-handling` with slot-based customization. Migrate the 4 within
  `@clarity-chat/react` to use the base.

### P2-2: Unify `ChatMessage` type

- 12+ definitions with incompatible timestamps
- **Action:** Establish canonical type in `@clarity-chat/types` with `timestamp: number` (epoch ms).
  Add runtime adapters for string/Date conversion at boundaries. This is a large migration requiring
  careful API versioning.

### P2-3: Consolidate SSE parsing

- 3 implementations in showcase and react
- **Action:** Create a single SSE parser in `@clarity-chat/utils` or `@clarity-chat/react/internal`
  that both showcase and react import.

### P2-4: Consolidate model routing

- `ai-infrastructure` vs `token-optimization` both do complexity-based model selection
- **Action:** Merge into `token-optimization` (larger, more established) or create a shared
  interface.

### P2-5: Enable `dts: true` in `@clarity-chat/react` dev builds

- Would eliminate the need for `showcase/lib/clarity-chat-types.ts` (121 lines of copied types)
- **Action:** Fix the tsup dev config, verify DX impact (build speed).

### P2-6: Remove dead CSS classes from showcase

- `.component-section`, `.component-grid-2`, `.component-grid-3` appear unused (superseded by React
  components)
- **Action:** Grep for usage, remove if confirmed dead.

---

## Implementation Order (P0 + P1)

Each step is an atomic commit. Run `pnpm check:all` after each.

| Step | Item                                                                | Commit Scope                            |
| ---- | ------------------------------------------------------------------- | --------------------------------------- |
| 1    | P0-1: Fix `cn()` re-export                                          | `packages/react`, `packages/playground` |
| 2    | P0-2: Verify `generateId` consolidation                             | `packages/memory` (if needed)           |
| 3    | P0-3a: Add `utils` dep to `primitives`, re-export debounce/throttle | `packages/primitives`                   |
| 4    | P0-3b: Delegate react debounce/throttle to utils                    | `packages/react`                        |
| 5    | P0-3c: Delegate memory debounce/throttle to utils                   | `packages/memory`                       |
| 6    | P0-3d: Clean up performance-unified.ts duplicates                   | `packages/utils`                        |
| 7    | P1-1: Clean up CopyButton migration artifact                        | `packages/react`                        |
| 8    | P1-2: Consolidate assertDefined                                     | `packages/react`                        |
| 9    | P1-3: Promote internal exports to public API                        | `packages/react`                        |
| 10   | P1-4: Consolidate useReducedMotion                                  | 4 packages                              |
| 11   | P1-5: Unify CircuitState types                                      | `packages/types`, `packages/react`      |
| 12   | P1-6: Consolidate deepMerge                                         | 5+ packages                             |
| 13   | Regression: full `pnpm check:all` pass                              | —                                       |

---

## Non-Negotiable Constraints

- **No breaking public API changes** — all changes to `@clarity-chat/react` public exports must be
  additive
- **No big-bang refactors** — one commit per consolidation target
- **Preserve behavior** — re-exports must match existing signatures
- **Evidence-based** — each change references a specific duplication finding (D1–D18)
- **Regression guarded** — `pnpm check:all` must pass after each commit
