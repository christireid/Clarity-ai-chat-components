# ZERO_DEFECT_PLAN.md

> **Strict Format Backlog** - All defects must be logged here before fixing. **Last Updated:**
> 2025-12-19 **Status:** Phase 4 - Wave 1 & 2 Fixes Pushed, Wave 2 ESLint Issues Discovered

---

## Plan Overview

### Wave Structure

- **Wave 1:** Unblock CI/Build (blockers)
- **Wave 2:** Type/Lint Correctness (high)
- **Wave 3:** Tests + Flake Elimination (medium)
- **Wave 4:** Warnings + Polish (low)

### Statistics

| Severity  | Queued | In Progress | Fixed | Verified |
| --------- | ------ | ----------- | ----- | -------- |
| Blocker   | 0      | 0           | 2     | 0        |
| High      | 3      | 0           | 2     | 0        |
| Medium    | 2      | 0           | 0     | 0        |
| Low       | 2      | 0           | 0     | 0        |
| **Total** | 7      | 0           | 4     | 0        |

---

## Completed Items

### ZD-001: Memory package build fails - missing EnhancedSecurityConfig export ✅ FIXED

| Field      | Value     |
| ---------- | --------- |
| **Status** | **fixed** |
| **Commit** | 5e02f1a6  |

**Fix Applied:** Removed `EnhancedSecurityConfig` from re-exports in `packages/memory/src/index.ts`.

---

### ZD-002: token-optimization ESLint version conflict ✅ FIXED

| Field      | Value     |
| ---------- | --------- |
| **Status** | **fixed** |
| **Commit** | 5e02f1a6  |

**Fix Applied:**

1. Removed local ESLint devDependencies from `packages/token-optimization/package.json`
2. Updated lint script to use root eslint config

---

### ZD-003: Format check fails on 2154 files ⏳ PARTIAL

| Field      | Value       |
| ---------- | ----------- |
| **Status** | **partial** |
| **Commit** | 5e02f1a6    |

**Fix Applied:**

1. Added `.hbs` template files to `.prettierignore`
2. Added sales deck files with unstable formatting to `.prettierignore`

**Note:** Full formatting run requires separate commit due to pre-commit hook resource limits.

---

### ZD-004: Memory package re-exports non-existent types ✅ FIXED

| Field      | Value     |
| ---------- | --------- |
| **Status** | **fixed** |
| **Commit** | 5e02f1a6  |

**Fix Applied:** Same as ZD-001 - removed non-existent type from re-exports.

---

## Wave 1: Unblock CI/Build (Blockers) - COMPLETED

### ZD-009: Truncated use-magnetic.ts hook ✅ FIXED

| Field        | Value               |
| ------------ | ------------------- |
| **ID**       | ZD-009              |
| **Category** | build               |
| **Severity** | blocker             |
| **Scope**    | packages/primitives |
| **Status**   | **fixed**           |
| **Commit**   | 5e02f1a6            |

**Symptom:** The use-magnetic.ts hook was truncated to just a function signature with no body.

**Fix Applied:** Rewrote the complete hook implementation based on test expectations and usage
patterns.

---

### ZD-010: Build script file extension mismatch ✅ FIXED

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-010         |
| **Category** | config         |
| **Severity** | high           |
| **Scope**    | packages/react |
| **Status**   | **fixed**      |
| **Commit**   | 5e02f1a6       |

**Symptom:** `build-sequential.cjs` uses ESM syntax (`import.meta.url`) but has CommonJS extension.

**Fix Applied:**

1. Renamed `build-sequential.cjs` to `build-sequential.mjs`
2. Updated package.json script reference

---

## Wave 2: Type/Lint Correctness (High)

### ZD-011: Syntax errors in test files ⏳ PARTIAL

| Field        | Value                       |
| ------------ | --------------------------- |
| **ID**       | ZD-011                      |
| **Category** | type                        |
| **Severity** | high                        |
| **Scope**    | packages/react              |
| **Status**   | **partial**                 |
| **Commit**   | 5e02f1a6 (adversarial only) |

**Symptom:** Multiple test files had syntax errors:

- `skeleton-prediction.test.tsx`: Extra quote at end of line
- `skeleton-accessibility.test.tsx`: Wrong closing tag `</button>` instead of `</a>`
- `enhanced.test.ts`: JSX in .ts file (needed .tsx)
- `adversarial-integration.test.ts`: Malformed escape sequence

**Fix Applied:** Corrected adversarial-integration.test.ts escape sequence.

**Blocked:** Other test files have pre-existing ESLint errors (see ZD-012, ZD-013).

---

### ZD-012: Test files missing jest globals ⏳ QUEUED

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-012         |
| **Category** | lint           |
| **Severity** | high           |
| **Scope**    | packages/react |
| **Status**   | queued         |

**Symptom:** Test files use `jest` globals without proper imports or ESLint config.

**Files Affected:**

- `skeleton-prediction.test.tsx` (~35 occurrences)
- `skeleton-accessibility.test.tsx` (~20 occurrences)

**Root Cause:** ESLint doesn't recognize jest globals in these test files.

---

### ZD-013: Test files missing React imports ⏳ QUEUED

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-013         |
| **Category** | lint           |
| **Severity** | high           |
| **Scope**    | packages/react |
| **Status**   | queued         |

**Symptom:** `enhanced.test.tsx` uses `React` without importing it.

**Files Affected:**

- `enhanced.test.tsx` (lines 488, 491, 506, 581)

---

### ZD-014: Test files reference undefined components ⏳ QUEUED

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-014         |
| **Category** | lint           |
| **Severity** | high           |
| **Scope**    | packages/react |
| **Status**   | queued         |

**Symptom:** Test file references components that aren't imported.

**Files Affected:**

- `skeleton-accessibility.test.tsx`: `EnhancedSkeletonText`, `EnhancedSkeletonAvatar`,
  `SkeletonComposer`

---

## Wave 3: Tests + Flake Elimination (Medium)

### ZD-005: React package test failures

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-005         |
| **Category** | test           |
| **Severity** | medium         |
| **Scope**    | packages/react |
| **Status**   | queued         |
| **Owner**    | QA Specialist  |

**Status:** Still queued - build must pass first.

---

### ZD-006: Test worker memory exhaustion

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-006         |
| **Category** | test           |
| **Severity** | medium         |
| **Scope**    | packages/react |
| **Status**   | queued         |
| **Owner**    | QA Specialist  |

**Status:** Still queued - build must pass first.

---

## Wave 4: Warnings + Polish (Low)

### ZD-007: Marketing site animation warnings

| Field      | Value  |
| ---------- | ------ |
| **ID**     | ZD-007 |
| **Status** | queued |

---

### ZD-008: Deprecation warnings in dependencies

| Field      | Value  |
| ---------- | ------ |
| **ID**     | ZD-008 |
| **Status** | queued |

Note: Reduced from 12 to 9 deprecated subdependencies after removing ESLint from token-optimization.

---

## Session Summary

### Fixes Applied & Pushed (Commit 5e02f1a6)

1. **ZD-001/ZD-004:** Removed `EnhancedSecurityConfig` from memory package re-exports
2. **ZD-002:** Removed conflicting ESLint dependencies from token-optimization
3. **ZD-003:** Updated `.prettierignore` for .hbs and sales deck files
4. **ZD-009:** Rebuilt truncated `use-magnetic.ts` hook with full implementation
5. **ZD-010:** Renamed `build-sequential.cjs` to `.mjs` and updated script reference
6. **ZD-011:** Fixed adversarial-integration.test.ts escape sequence

### Discovered Issues (Not Yet Fixed)

1. **ZD-012:** Test files using `jest` globals without proper ESLint config
2. **ZD-013:** Missing React imports in enhanced.test.tsx
3. **ZD-014:** Undefined component references in skeleton-accessibility.test.tsx

### Next Steps Required

1. Fix ZD-012/013/014 ESLint issues in test files
2. Complete full formatting run for remaining 2154 files
3. Run verification sweep (build, typecheck, lint, test)
4. Continue Wave 3 & 4 items

### Branch Status

- **Branch:** `claude/zero-defect-stabilization-f7T1W`
- **Latest Commit:** 5e02f1a6
- **Pushed:** Yes

---

_Document maintained as part of Zero-Defect Stabilization effort._
