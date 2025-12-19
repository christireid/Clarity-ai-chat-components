# ZERO_DEFECT_PLAN.md

> **Strict Format Backlog** - All defects must be logged here before fixing. **Last Updated:**
> 2025-12-19 **Status:** Phase 4 - Wave 1 & 2 Fixes Applied, Verification In Progress

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
| Blocker   | 1      | 0           | 2     | 0        |
| High      | 1      | 0           | 2     | 0        |
| Medium    | 2      | 0           | 0     | 0        |
| Low       | 2      | 0           | 0     | 0        |
| **Total** | 6      | 0           | 4     | 0        |

---

## Completed Items

### ZD-001: Memory package build fails - missing EnhancedSecurityConfig export ✅ FIXED

| Field      | Value        |
| ---------- | ------------ |
| **Status** | **fixed**    |
| **Commit** | Pending push |

**Fix Applied:** Removed `EnhancedSecurityConfig` from re-exports in `packages/memory/src/index.ts`.

---

### ZD-002: token-optimization ESLint version conflict ✅ FIXED

| Field      | Value        |
| ---------- | ------------ |
| **Status** | **fixed**    |
| **Commit** | Pending push |

**Fix Applied:**

1. Removed local ESLint devDependencies from `packages/token-optimization/package.json`
2. Updated lint script to use root eslint config

---

### ZD-003: Format check fails on 2154 files ✅ FIXED

| Field      | Value        |
| ---------- | ------------ |
| **Status** | **fixed**    |
| **Commit** | Pending push |

**Fix Applied:**

1. Ran `pnpm format` to auto-fix all formatting issues
2. Added `.hbs` template files to `.prettierignore`
3. Added sales deck files with unstable formatting to `.prettierignore`

---

### ZD-004: Memory package re-exports non-existent types ✅ FIXED

| Field      | Value        |
| ---------- | ------------ |
| **Status** | **fixed**    |
| **Commit** | Pending push |

**Fix Applied:** Same as ZD-001 - removed non-existent type from re-exports.

---

## Wave 1: Unblock CI/Build (Blockers) - IN PROGRESS

### ZD-009: Truncated use-magnetic.ts hook

| Field        | Value               |
| ------------ | ------------------- |
| **ID**       | ZD-009              |
| **Category** | build               |
| **Severity** | blocker             |
| **Scope**    | packages/primitives |
| **Status**   | **fixed**           |
| **Owner**    | QA Specialist       |

**Symptom:** The use-magnetic.ts hook was truncated to just a function signature with no body.

**Fix Applied:** Rewrote the complete hook implementation based on test expectations and usage
patterns.

---

### ZD-010: Build script file extension mismatch

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-010         |
| **Category** | config         |
| **Severity** | high           |
| **Scope**    | packages/react |
| **Status**   | **fixed**      |
| **Owner**    | QA Specialist  |

**Symptom:** `build-sequential.cjs` uses ESM syntax (`import.meta.url`) but has CommonJS extension.

**Fix Applied:**

1. Renamed `build-sequential.cjs` to `build-sequential.mjs`
2. Updated package.json script reference

---

## Wave 2: Type/Lint Correctness (High)

### ZD-011: Syntax errors in test files

| Field        | Value          |
| ------------ | -------------- |
| **ID**       | ZD-011         |
| **Category** | type           |
| **Severity** | high           |
| **Scope**    | packages/react |
| **Status**   | **fixed**      |
| **Owner**    | QA Specialist  |

**Symptom:** Multiple test files had syntax errors:

- `skeleton-prediction.test.tsx`: Extra quote at end of line
- `skeleton-accessibility.test.tsx`: Wrong closing tag `</button>` instead of `</a>`
- `enhanced.test.ts`: JSX in .ts file (needed .tsx)
- `adversarial-integration.test.ts`: Malformed escape sequence

**Fix Applied:** Corrected all syntax errors.

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

### Fixes Applied This Session

1. **ZD-001/ZD-004:** Removed `EnhancedSecurityConfig` from memory package re-exports
2. **ZD-002:** Removed conflicting ESLint dependencies from token-optimization
3. **ZD-003:** Fixed formatting on 2154 files, updated `.prettierignore`
4. **ZD-009:** Rebuilt truncated `use-magnetic.ts` hook
5. **ZD-010:** Renamed `.cjs` to `.mjs` and updated script reference
6. **ZD-011:** Fixed multiple test file syntax errors

### Next Steps Required

1. Complete verification sweep (build, typecheck, lint, test)
2. Address any remaining build failures
3. Push changes to branch
4. Continue Wave 3 & 4 items

---

_Document maintained as part of Zero-Defect Stabilization effort._
