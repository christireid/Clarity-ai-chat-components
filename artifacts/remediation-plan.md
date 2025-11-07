# Prioritized Remediation Plan

## Overview
This plan addresses all discovered issues in prioritized batches. Each batch is designed to be:
- Small and auditable (≤200 LOC changes)
- Independently testable
- Low risk to dependent packages

## Batch 1: Critical Build Fixes ✅ COMPLETED
**Status:** ✅ All fixes applied and validated
**Files Changed:** 6
**Risk:** Low
**Effort:** 1.3 hours

### Changes Applied:
1. ✅ Fixed `token-optimized-context.ts` - Changed `const` to `let` for `remainingBudget`
2. ✅ Fixed `use-chat-enhanced.ts` - Restructured if-else block syntax
3. ✅ Fixed workspace protocol - Replaced `workspace:*` with `*` in 4 example packages
4. ✅ Added missing icon exports (ClockIcon, DollarSignIcon, TrendingUpIcon, ShieldIcon, FilterIcon)

### Validation:
```bash
cd packages/react && npm run build  # ✅ Success
```

---

## Batch 2: Dependency Alignment
**Status:** ⏳ Pending
**Files Changed:** ~10
**Risk:** Medium
**Effort:** 2 hours

### Issues:
- **ISSUE-004**: React 19 peer dependency conflict
- **ISSUE-005**: npm vulnerabilities  
- **ISSUE-006**: Deprecated packages

### Strategy:
1. **React 19 Conflict Resolution:**
   - Option A (Recommended): Pin React to ^18.0.0 in examples using React 19
   - Option B: Update lucide-react to version supporting React 19 (if available)
   - Option C: Document --legacy-peer-deps requirement in CI/CD

2. **Security Vulnerabilities:**
   ```bash
   npm audit fix
   # Review critical vulnerability manually
   npm audit fix --force  # Only if safe
   ```

3. **Deprecated Packages:**
   - Update eslint to v9.x (flat config already in use)
   - Update other direct dependencies pulling in deprecated packages

### Files to Modify:
- `examples/enterprise-ai-ops/package.json`
- `examples/conversational-analytics/package.json`
- `examples/ai-research-platform/package.json`
- `package.json` (root)
- `.github/workflows/*.yml` (if CI exists)

### Validation:
```bash
npm install --legacy-peer-deps  # Should work without flag after fix
npm audit  # Should show reduced vulnerabilities
npm run build  # Should pass
```

---

## Batch 3: Example Build Fixes
**Status:** ⏳ Pending  
**Files Changed:** TBD
**Risk:** Low
**Effort:** 1 hour

### Issues:
- `token-optimization-demo` build failing (investigation needed)

### Strategy:
1. Investigate build error in token-optimization-demo
2. Fix missing dependencies or configuration issues
3. Ensure all examples build successfully

### Validation:
```bash
npm run build  # All packages should build
```

---

## Batch 4: TypeScript Strictness Improvements
**Status:** ⏳ Pending
**Files Changed:** ~5
**Risk:** Low  
**Effort:** 2 hours

### Current State:
- `strict: true` enabled ✅
- `noUnusedLocals: false` ⚠️
- `noUnusedParameters: false` ⚠️

### Strategy:
1. Enable `noUnusedLocals: true` incrementally
2. Enable `noUnusedParameters: true` incrementally
3. Fix resulting type errors
4. Consider `noUncheckedIndexedAccess` for stricter array/object access

### Files to Modify:
- `tsconfig.json` (root)
- Package-level `tsconfig.json` files

### Validation:
```bash
npm run typecheck  # Should pass with new flags
```

---

## Batch 5: Lint Rule Enhancements
**Status:** ⏳ Pending
**Files Changed:** ~3
**Risk:** Low
**Effort:** 1 hour

### Current State:
- ESLint flat config ✅
- React/TypeScript rules configured ✅
- Some rules set to 'warn' that could be 'error'

### Strategy:
1. Review and tighten rule severity
2. Add missing accessibility rules
3. Ensure consistent config across packages

### Validation:
```bash
npm run lint  # Should pass with stricter rules
```

---

## Batch 6: Test Infrastructure
**Status:** ⏳ Pending
**Files Changed:** TBD
**Risk:** Low
**Effort:** 2 hours

### Strategy:
1. Run full test suite
2. Fix failing tests
3. Ensure coverage thresholds are met
4. Add missing test utilities

### Validation:
```bash
npm run test:coverage  # Should pass with acceptable coverage
```

---

## Batch 7: Storybook & E2E
**Status:** ⏳ Pending
**Files Changed:** TBD
**Risk:** Low
**Effort:** 2 hours

### Strategy:
1. Build Storybook
2. Fix any build errors
3. Run E2E tests
4. Fix failing E2E tests

### Validation:
```bash
npm run storybook:build  # Should succeed
npm run test:e2e  # Should pass
```

---

## Implementation Protocol

### For Each Batch:
1. Create feature branch: `chore/reliability-hardening-batch-N`
2. Apply changes
3. Run validation commands
4. Commit with message: `fix(category): description (#ISSUE-XXX)`
5. Push and create PR (if Push Mode = open PR)
6. Document results in `artifacts/commit-###.md`

### Success Criteria:
- ✅ Clean install without --legacy-peer-deps (or documented requirement)
- ✅ Zero build errors
- ✅ Zero type errors  
- ✅ Zero lint errors
- ✅ All tests passing
- ✅ Storybook builds successfully
- ✅ E2E tests pass

---

## Rollout Timeline

- **Week 1:** Batches 1-3 (Critical fixes)
- **Week 2:** Batches 4-5 (Code quality)
- **Week 3:** Batches 6-7 (Testing)

---

## Risk Mitigation

- **Breaking Changes:** All batches designed to be non-breaking
- **Dependency Updates:** Tested incrementally
- **CI/CD:** Ensure CI uses same Node/npm versions as local
