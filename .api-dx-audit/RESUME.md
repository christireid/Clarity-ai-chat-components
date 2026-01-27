# API/DX Audit Resume Instructions

**Session**: audit-resume-20260127 **Last Updated**: 2026-01-27 **Current Phase**: PHASE_4_IMPLEMENT
**Score**: 35/100 (Target: 98/100)

---

## What Was Accomplished

### Completed Phases

✅ **Phase 0: Baseline** - Repository profiled, verification commands captured ✅ **Phase 1: P0
Blocking Fixes** - Fixed 5 critical blocking issues:

- Added `/env` subpath export to utils package
- Removed deleted performance module export from memory package
- Fixed enhanced-markdown-renderer import path
- Deleted insecure webhook manager backups
- Fixed CSS build and SSR boundaries

✅ **Phase 2: Canonical Decisions** - Created comprehensive decisions document:

- Consolidate from 18 → 8 packages
- Identified canonical APIs (useClarityChat, EnhancedMarkdownRenderer, etc.)
- Defined merge/delete strategy for duplicate packages

✅ **Phase 3: P1 Critical Consolidation** - Started API consolidation

- Fixed dev-tools package typecheck errors
- Removed duplicate error boundary implementations
- Updated EnhancedErrorBoundary API

---

## Current State: BLOCKED

### 🚨 CRITICAL BLOCKER

**React package has 58+ typecheck errors after API consolidation**

This is preventing:

- Build verification
- Further consolidation work
- Frontend readiness testing
- Rubric scoring

### Specific Errors to Fix

1. **EnhancedErrorBoundary prop mismatches**
   - `componentName` prop removed
   - `showErrorDetails` prop removed
   - Components still passing these props

2. **PerformanceMetrics API shape changes**
   - Old properties removed
   - Components using outdated API

3. **Duplicate SemanticSearchResult exports**
   - Multiple files exporting same type
   - Need to consolidate to single source

4. **Missing UnifiedPerformanceMonitor methods**
   - `getInstance()` method missing
   - Components expecting this method

5. **Missing getPerformanceSummary function**
   - Function referenced but not exported
   - Need to add or remove references

6. **Type mismatches**
   - Date/number conflicts in multiple components

---

## Next Steps (Immediate)

### Step 1: Run typecheck to capture exact errors

```bash
cd packages/react
pnpm typecheck 2>&1 | tee ../../.api-dx-audit/react-typecheck-errors.log
```

### Step 2: Fix errors in priority order

1. Remove invalid props from EnhancedErrorBoundary usages
2. Update PerformanceMetrics API calls
3. Consolidate duplicate exports
4. Add missing methods or remove references
5. Fix type mismatches

### Step 3: Verify fix

```bash
pnpm typecheck
```

### Step 4: Continue with consolidation

Once typecheck passes, resume:

- Consolidate duplicate logic (5 retry locations, 3 validation locations)
- Merge errors package into error-handling
- Restructure react package (50 → 12 directories)

---

## Remaining Work Summary

### High Priority

- [ ] Fix 58+ typecheck errors (BLOCKING)
- [ ] Consolidate duplicate retry logic (5 locations)
- [ ] Consolidate duplicate validation (3 locations)
- [ ] Merge errors package into error-handling

### Medium Priority

- [ ] Restructure react package (50 → 12 directories)
- [ ] Fix 7 frontend readiness issues
- [ ] Extract 12 reuse opportunities

### Final Phase

- [ ] Run final truth pass (grep for stale references)
- [ ] Verify frontend readiness (Vite, Next.js, Webpack smoke tests)
- [ ] Score against rubric (need ≥98/100)

---

## Progress Metrics

| Metric                  | Current     | Target | Status |
| ----------------------- | ----------- | ------ | ------ |
| **Rubric Score**        | 35/100      | 98/100 | 🔴     |
| **Duplicate APIs**      | 11          | 0      | 🔴     |
| **Duplicate Files**     | 21          | 0      | 🔴     |
| **Duplicate Logic**     | ~2000 lines | 0      | 🔴     |
| **Stale Imports**       | 3           | 0      | 🟡     |
| **Frontend Issues**     | 7           | 0      | 🔴     |
| **Reuse Opportunities** | 12          | 0      | 🔴     |

---

## How to Resume

Run in Claude Code:

```
Resume API/DX audit from .api-dx-audit/session-state.json
```

Or directly:

```
Fix the 58+ typecheck errors in packages/react/ blocking the audit
```
