# QA Docs Audit - Fix Plan

## Priority Matrix

| Priority | Definition                       | Target              |
| -------- | -------------------------------- | ------------------- |
| P0       | Breaks build/functionality       | Fix immediately     |
| P1       | Major issues, incorrect behavior | Fix before launch   |
| P2       | Polish, minor issues             | Fix if time permits |

---

## Phase 1: P0 Fixes (Critical)

### Fix 1.1: Add missing `logger` import/definition

**Files**:

- `apps/docs/content/blog/scripts/check-pricing-freshness.ts`
- `apps/docs/lib/ai/feedbackStore.ts`
- `apps/docs/lib/ai/sessionStore.ts`
- `apps/docs/lib/ai/tokenUtils.test.ts`

**Approach**: Create a simple logger utility that falls back to console in dev **Effort**: Small
**Risk**: Low

---

### Fix 1.2: Fix `lib/ai/streaming.ts` variable redeclaration

**File**: `apps/docs/lib/ai/streaming.ts` **Issues**:

- `tools` variable redeclared in nested scope
- `executeToolCall` property missing
- `tools` namespace used incorrectly

**Approach**: Rename inner variable, fix type references **Effort**: Medium **Risk**: Medium (may
affect streaming behavior)

---

### Fix 1.3: Export missing animation variants

**File**: `apps/docs/lib/animations.ts` **Missing Exports**:

- `fadeInLeft`
- `fadeInRight`
- `slideUp`
- `slideDown`
- `scaleUp`
- `scaleDown`
- `rotateIn`
- `scrollReveal`

**Approach**: Add named exports for these variants **Effort**: Small **Risk**: Low

---

## Phase 2: P1 Fixes (Major)

### Fix 2.1: Fix framer-motion Variant types

**File**: `apps/docs/lib/animations.ts` **Lines**: 248, 258, 268, 450, 455

**Approach**: Use correct framer-motion types (`TargetAndTransition`, `Variant`) **Effort**: Small
**Risk**: Low

---

### Fix 2.2: Fix NODE_ENV test assignments

**Files**:

- `apps/docs/lib/ai/__tests__/chat-analytics.test.ts`
- `apps/docs/lib/ai/promptValidation.test.ts`

**Approach**: Use `vi.stubEnv('NODE_ENV', 'value')` instead of direct assignment **Effort**: Small
**Risk**: Low

---

### Fix 2.3: Update Playwright accessibility API

**File**: `apps/docs/tests/visual/docs-assistant.spec.ts` **Line**: 161

**Approach**: Use `@axe-core/playwright` for accessibility testing **Effort**: Medium **Risk**: Low

---

### Fix 2.4: Fix analytics PerformanceEntry types

**File**: `apps/docs/lib/analytics.ts` **Lines**: 68, 81, 82

**Approach**: Use correct Performance API types or type guards **Effort**: Small **Risk**: Low

---

### Fix 2.5: Add reduced motion support (batch fix)

**Scope**: 50+ components with animation accessibility violations

**Approach**:

1. Create `useReducedMotion` hook
2. Add to framer-motion components via variant pattern
3. Or use Tailwind's `motion-reduce:*` utilities

**Effort**: Large (spread across many files) **Risk**: Low

---

## Phase 3: P2 Fixes (Polish)

### Fix 3.1: Replace hardcoded durations

**Pattern**: `duration: 0.15` → `durations.fast` **Scope**: 50+ occurrences

---

### Fix 3.2: Migrate inline animations to library

**Pattern**: Use `fadeInUp`, `slideUp` from `@/lib/animations` **Scope**: Many components

---

### Fix 3.3: Add copy buttons to all code blocks

**Components**: Ensure `CodeBlock` component has copy functionality everywhere

---

## Execution Order

### Iteration 1 (Current)

1. ✅ Create logger utility
2. ✅ Add missing animation exports
3. ⬜ Fix streaming.ts variable issues

### Iteration 2

4. ⬜ Fix framer-motion types
5. ⬜ Fix NODE_ENV in tests
6. ⬜ Fix analytics types

### Iteration 3

7. ⬜ Update Playwright accessibility API
8. ⬜ Begin reduced motion support

### Iterations 4-10

9. ⬜ Continue reduced motion rollout
10. ⬜ Address remaining lint warnings

### Iterations 11-15

11. ⬜ Polish fixes
12. ⬜ Hardcoded duration cleanup
13. ⬜ Final testing and verification

---

## Files to Modify (Summary)

| File                                      | Priority | Type                  |
| ----------------------------------------- | -------- | --------------------- |
| `lib/logger.ts`                           | P0       | Create                |
| `lib/ai/feedbackStore.ts`                 | P0       | Edit                  |
| `lib/ai/sessionStore.ts`                  | P0       | Edit                  |
| `lib/ai/streaming.ts`                     | P0       | Edit                  |
| `lib/animations.ts`                       | P0       | Edit                  |
| `lib/analytics.ts`                        | P1       | Edit                  |
| `lib/ai/__tests__/chat-analytics.test.ts` | P1       | Edit                  |
| `lib/ai/promptValidation.test.ts`         | P1       | Edit                  |
| `tests/visual/docs-assistant.spec.ts`     | P1       | Edit                  |
| (Many components)                         | P1       | Edit (reduced motion) |

---

## Rollback Plan

If any fix causes regressions:

1. Revert specific file changes
2. Document issue in audit log
3. Escalate to next iteration with different approach
