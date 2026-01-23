# API Cohesion Fixes - Implementation Checklist

## Phase 1: Critical Fixes (Week 1) ⚡

### Task 1.1: Remove Duplicate Component Exports from token-optimization
**Priority:** 🔴 Critical
**File:** `packages/token-optimization/src/index.ts`

- [ ] **Lines 519-527** - Remove TokenBudgetBar exports
  ```typescript
  // DELETE:
  export { TokenBudgetBar, useTokenBudget } from './components'
  export type {
    BudgetStatus,
    TokenBudgetTheme,
    TokenBudgetBarProps,
    UseTokenBudgetConfig,
    UseTokenBudgetReturn,
  } from './components'
  ```

- [ ] **Lines 528-534** - Remove TokenCostPreview exports
  ```typescript
  // DELETE:
  export { TokenCostPreview, useTokenEstimate } from './react'
  export type {
    TokenCostPreviewProps,
    UseTokenEstimateOptions,
    TokenEstimate,
  } from './react'
  ```

- [ ] **Lines 535-550** - Remove TokenUsageMeter exports
  ```typescript
  // DELETE:
  export {
    TokenUsageMeter,
    TokenUsageMeterStatic,
    MODEL_PRICING_PRESETS,
  } from './react'
  export type {
    TokenUsage as TokenMeterUsage,
    ModelPricing as TokenMeterPricing,
    TokenUsageMeterProps,
    TokenUsageStatic as TokenMeterUsageStatic,
    ModelPricingStatic as TokenMeterPricingStatic,
    TokenUsageMeterStaticProps,
  } from './react'
  ```

- [ ] **Lines 551-564** - Remove TokenOptimization component exports
  ```typescript
  // DELETE:
  export {
    TokenOptimizationBadge,
    TokenOptimizationPanel,
    TokenOptimizationDashboard,
    createEmptyStats,
  } from './react'
  export type {
    TokenOptimizationBadgeProps,
    TokenOptimizationPanelProps,
    TokenOptimizationDashboardProps,
    OptimizationMetrics,
    TokenOptimizationStats,
  } from './react'
  ```

- [ ] **Verify:** Run `npm run build` in token-optimization package
- [ ] **Verify:** No export errors in build output

---

### Task 1.2: Fix Type Export Conflicts
**Priority:** 🔴 Critical
**File:** `packages/react/src/public-api.ts`

- [ ] **Add TokenEstimate export** (currently omitted)
  ```typescript
  // ADD after line 727:
  export type {
    TokenEstimate,
  } from '@clarity-chat/token-optimization'
  ```

- [ ] **Consolidate TokenUsage** (remove aliases)
  ```typescript
  // REPLACE existing TokenUsage exports with:
  export type {
    TokenUsage,
  } from '@clarity-chat/token-optimization'

  // REMOVE aliases:
  // - AnalyticsTokenUsage
  // - TokenMeterUsage
  // - StreamTokenStats (if referring to same type)
  ```

- [ ] **Consolidate ModelPricing**
  ```typescript
  // REPLACE existing ModelPricing exports with:
  export type {
    ModelPricing,
  } from '@clarity-chat/token-optimization'

  // REMOVE alias:
  // - TokenMeterPricing
  ```

- [ ] **Verify:** TypeScript compilation succeeds
- [ ] **Verify:** No duplicate type errors in IDE

---

### Task 1.3: Resolve Hook Naming Confusion
**Priority:** 🔴 Critical
**Files:**
- `packages/token-optimization/src/components/token-budget-bar.tsx`
- `packages/token-optimization/src/hooks/use-token-budget-monitor.tsx`

**Option A (Recommended): Rename hooks**
- [ ] Rename `useTokenBudget` → `useTokenBudgetBar`
- [ ] Rename `useTokenBudgetMonitor` → `useTokenBudgetTracking`
- [ ] Update all internal references
- [ ] Update export statements in index files

**Option B: Consolidate hooks**
- [ ] Create unified `useTokenBudget({ mode: 'display' | 'monitor' })`
- [ ] Deprecate old hooks with migration guide

- [ ] **Verify:** All hook usages updated
- [ ] **Verify:** Tests pass with new names

---

## Phase 2: Naming Cleanup (Week 2) 🏷️

### Task 2.1: Rename TokenCounter Variants
**Priority:** 🟡 High
**Files:**
- `packages/token-optimization/src/tokenizers/simple-counter.ts`
- `packages/token-optimization/src/legacy-compatibility.ts`

- [ ] **Rename SimpleTokenCounter → FastTokenCounter**
  ```typescript
  // File: tokenizers/simple-counter.ts
  export class FastTokenCounter {
    // ... implementation
  }
  ```

- [ ] **Rename TokenCounter → LegacyTokenCounter**
  ```typescript
  // File: legacy-compatibility.ts
  /**
   * @deprecated Use AccurateTokenCounter instead
   */
  export class LegacyTokenCounter {
    // ... implementation
  }
  ```

- [ ] **Update index.ts exports**
  ```typescript
  export { AccurateTokenCounter } from './tokenizers/accurate-counter'
  export { FastTokenCounter } from './tokenizers/simple-counter'
  export { LegacyTokenCounter } from './legacy-compatibility'
  export { AdvancedTokenCounter } from './tokenizers/advanced-counter'
  ```

- [ ] **Fix TokenCounter interface collision**
  ```typescript
  // File: providers/types.ts:337
  // RENAME:
  export interface TokenCountingProvider {
    // ... implementation
  }
  ```

- [ ] **Update all usages** (26 files in react package)
- [ ] **Verify:** No import errors across packages

---

### Task 2.2: Fix Model Type Name Collisions
**Priority:** 🟡 High
**Files:**
- `packages/token-optimization/src/models/model-registry.ts`
- `packages/token-optimization/src/routing/model-router.ts`

**Option A: Rename types**
- [ ] `TokenModelConfig` → `ModelRegistryConfig`
- [ ] `ModelConfig` (routing) → `ModelRoutingConfig`
- [ ] Update all references

**Option B: Use namespaces**
- [ ] Create `Tokenization` namespace
- [ ] Create `Routing` namespace
- [ ] Move types into respective namespaces

- [ ] **Verify:** No type conflicts in TypeScript
- [ ] **Verify:** Documentation updated

---

### Task 2.3: Consolidate BudgetStatus Type
**Priority:** 🟡 High

- [ ] **Create canonical location**
  ```typescript
  // File: packages/token-optimization/src/types/budget.ts
  export interface BudgetStatus {
    // ... definition
  }
  ```

- [ ] **Update token-optimization index.ts**
  ```typescript
  export type { BudgetStatus } from './types/budget'
  ```

- [ ] **Update react public-api.ts**
  ```typescript
  // REMOVE alias:
  // export type { BudgetStatus as TokenBudgetStatus }

  // REPLACE with:
  export type { BudgetStatus } from '@clarity-chat/token-optimization'
  ```

- [ ] **Verify:** Single source of truth established

---

## Phase 3: Complete Public API (Week 3) 📦

### Task 3.1: Re-export Token Hooks in React Package
**Priority:** 🟠 Medium
**File:** `packages/react/src/public-api.ts`

- [ ] **Add hook re-exports** (around line 490)
  ```typescript
  // ============================================================================
  // TOKEN OPTIMIZATION HOOKS (Re-exported from @clarity-chat/token-optimization)
  // ============================================================================

  export {
    useTokenCount,
    useTieredCache,
    useModelRouter,
    useOptimizationPipeline,
    useTokenOptimization,
  } from '@clarity-chat/token-optimization'

  export type {
    UseTokenCountOptions,
    UseTokenCountReturn,
    UseTieredCacheConfig,
    UseTieredCacheReturn,
    UseModelRouterConfig,
    UseModelRouterReturn,
    OptimizationPipelineConfig,
    PipelineResult,
    PipelineStats,
    UseOptimizationPipelineReturn,
    UseTokenOptimizationConfig,
    UseTokenOptimizationReturn,
    TokenOptimizationPreset,
  } from '@clarity-chat/token-optimization'
  ```

- [ ] **Verify:** Hooks accessible from @clarity-chat/react
- [ ] **Verify:** TypeScript autocomplete works

---

### Task 3.2: Export All Necessary Types
**Priority:** 🟠 Medium
**File:** `packages/react/src/public-api.ts`

- [ ] **Add comprehensive type re-exports**
  ```typescript
  // ============================================================================
  // TOKEN OPTIMIZATION TYPES (Re-exported from @clarity-chat/token-optimization)
  // ============================================================================

  export type {
    // Model types
    ModelId,
    KnownModelId,
    ModelProvider,
    TokenModelConfig,
    TokenizerEncoding,

    // Pricing types
    PricingProvider,
    ModelPricing,
    CostCalculation,

    // Cache types
    SemanticCacheConfig,
    CachedEntry,
    CacheMetadata,
    SemanticCacheResult,
    CacheContext,
    CacheStats,

    // Token types
    TokenUsage,
    TokenEstimate,
    BudgetStatus,
  } from '@clarity-chat/token-optimization'
  ```

- [ ] **Verify:** All public types accessible
- [ ] **Verify:** No missing type errors in consuming code

---

### Task 3.3: Remove Deprecated Exports
**Priority:** 🟠 Medium

- [ ] **Identify all @deprecated exports**
  ```bash
  grep -r "@deprecated" packages/react/src/public-api.ts
  grep -r "@deprecated" packages/token-optimization/src/index.ts
  ```

- [ ] **For each deprecated export:**
  - [ ] Check usage in codebase
  - [ ] Add runtime warning if still in use
  - [ ] Document sunset timeline
  - [ ] Remove or add breaking change notice

- [ ] **Files to review:**
  - [ ] `react/src/components/token/TokenCostPreview.tsx`
  - [ ] `react/src/utils/tokenization/estimator.ts`
  - [ ] `react/src/utils/tokenization/model-pricing.ts`
  - [ ] `react/src/utils/tokenization/model-registry.ts`

- [ ] **Verify:** Deprecated exports have migration path

---

## Phase 4: Documentation (Week 4) 📚

### Task 4.1: Add "Which Package?" Guide
**Priority:** 🟠 Medium
**Files:**
- `packages/token-optimization/README.md`
- `packages/react/README.md`

- [ ] **Create package decision tree**
  ```markdown
  ## Which Package Should I Use?

  ### Use @clarity-chat/token-optimization when:
  - ✅ You need token counting utilities (countTokens, etc.)
  - ✅ You need React hooks for token optimization
  - ✅ You're building a Node.js application
  - ✅ You want headless token optimization logic

  ### Use @clarity-chat/react when:
  - ✅ You're building a React chat UI
  - ✅ You need pre-built chat components
  - ✅ You want the full Clarity Chat experience

  ### Import Examples

  #### Token Optimization Logic
  ```typescript
  import { useTokenCount, countTokens } from '@clarity-chat/token-optimization'
  ```

  #### React UI Components
  ```typescript
  import { ClarityChat, TokenBudgetBar } from '@clarity-chat/react'
  ```
  ```

- [ ] **Add to both package READMEs**
- [ ] **Add to main monorepo README**

---

### Task 4.2: Create Migration Guide
**Priority:** 🟠 Medium
**File:** `docs/MIGRATION_GUIDE.md`

- [ ] **Document breaking changes**
  ```markdown
  # Migration Guide

  ## v2.0.0 - API Cohesion Updates

  ### Breaking Changes

  #### 1. React Components Removed from token-optimization

  **Before:**
  ```typescript
  import { TokenBudgetBar } from '@clarity-chat/token-optimization'
  ```

  **After:**
  ```typescript
  import { TokenBudgetBar } from '@clarity-chat/react'
  ```

  #### 2. TokenCounter Renamed

  **Before:**
  ```typescript
  import { SimpleTokenCounter } from '@clarity-chat/token-optimization'
  ```

  **After:**
  ```typescript
  import { FastTokenCounter } from '@clarity-chat/token-optimization'
  ```

  #### 3. Hook Names Changed

  **Before:**
  ```typescript
  const budget = useTokenBudget(...)
  const monitor = useTokenBudgetMonitor(...)
  ```

  **After:**
  ```typescript
  const budget = useTokenBudgetBar(...) // Component-specific
  const tracking = useTokenBudgetTracking(...) // Analytics
  ```
  ```

- [ ] **Add automated migration script** (optional)
- [ ] **Test migration guide with example project**

---

### Task 4.3: Update API Documentation
**Priority:** 🟠 Medium

- [ ] **Document all public exports**
  - [ ] token-optimization package
  - [ ] react package

- [ ] **Add TypeScript examples**
  - [ ] Basic usage
  - [ ] Advanced patterns
  - [ ] Type inference examples

- [ ] **Document deprecation timeline**
  - [ ] v2.0.0: Deprecate old exports
  - [ ] v2.1.0: Runtime warnings
  - [ ] v3.0.0: Remove deprecated exports

- [ ] **Update changelog**
  - [ ] List all breaking changes
  - [ ] Provide migration instructions
  - [ ] Highlight new features

---

## Validation Checklist ✅

After completing each phase, run these checks:

### Build & Type Check
- [ ] `npm run build` - All packages build successfully
- [ ] `npm run type-check` - No TypeScript errors
- [ ] `npm run lint` - No linting errors

### Tests
- [ ] `npm run test` - All tests pass
- [ ] `npm run test:integration` - Integration tests pass
- [ ] `npm run test:types` - Type tests pass

### Package Validation
- [ ] No duplicate exports between packages
- [ ] All public APIs properly typed
- [ ] No circular dependencies
- [ ] Import direction correct (react → token-optimization)

### Documentation
- [ ] READMEs updated
- [ ] Migration guide complete
- [ ] API docs current
- [ ] Examples working

---

## Success Metrics 📊

### Before Fixes
- API Cohesion Score: **63.25/100 (D+)**
- Critical Issues: **8**
- High-Priority Issues: **12**
- Duplicate Exports: **7 components**

### After Phase 1 (Target)
- API Cohesion Score: **75/100 (C)**
- Critical Issues: **0**
- High-Priority Issues: **8**
- Duplicate Exports: **0**

### After Phase 2 (Target)
- API Cohesion Score: **82/100 (B-)**
- Critical Issues: **0**
- High-Priority Issues: **0**
- Naming Inconsistencies: **0**

### After Phase 3 (Target)
- API Cohesion Score: **90/100 (A-)**
- All Exports Complete: **Yes**
- Missing Types: **0**
- Deprecated Exports: **Documented/Removed**

### After Phase 4 (Target)
- API Cohesion Score: **92/100 (A)**
- Documentation Complete: **Yes**
- Migration Guide: **Available**
- User Confusion: **Minimal**

---

## Notes & Considerations

### Breaking Changes
- All changes in Phase 1-2 are **breaking changes**
- Require major version bump (v2.0.0)
- Communicate clearly to users

### Backwards Compatibility
- Consider keeping old exports with deprecation warnings
- Provide automated migration tools if possible
- Give users 1-2 versions notice before removal

### Testing Strategy
- Test both packages independently
- Test cross-package imports
- Test in example applications
- Verify bundle size impact

### Rollout Plan
1. Merge fixes to development branch
2. Test thoroughly in staging
3. Publish beta versions
4. Gather user feedback
5. Publish stable release
6. Monitor for issues

---

## Timeline Summary

| Phase | Duration | Score Improvement | Status |
|-------|----------|-------------------|--------|
| Phase 1 | Week 1 | 63 → 75 (+12) | ⏸️ Pending |
| Phase 2 | Week 2 | 75 → 82 (+7) | ⏸️ Pending |
| Phase 3 | Week 3 | 82 → 90 (+8) | ⏸️ Pending |
| Phase 4 | Week 4 | 90 → 92 (+2) | ⏸️ Pending |

**Total Duration:** 4 weeks
**Total Improvement:** +29 points (D+ → A)

---

## Questions?

For detailed analysis and rationale behind each fix, see:
- Full Report: `.merge-audit/API_COHESION_REPORT.md`
- Quick Summary: `.merge-audit/API_COHESION_SUMMARY.md`
