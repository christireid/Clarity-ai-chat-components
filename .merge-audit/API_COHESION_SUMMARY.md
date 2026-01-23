# API Cohesion Summary - Quick Reference

## Overall Score: 63.25/100 (D+) ⚠️

### Critical Issues (Immediate Action Required)

#### 1. Duplicate Component Exports

**Both packages export the same React components**

```
TokenBudgetBar, TokenOptimizationBadge, TokenOptimizationPanel,
TokenOptimizationDashboard, TokenCostPreview, TokenUsageMeter
```

- **Fix:** Remove from token-optimization, keep in react package only

#### 2. Type Export Conflicts

**Multiple aliases for same types across packages**

```
TokenUsage → AnalyticsTokenUsage, TokenMeterUsage, StreamTokenStats
ModelPricing → TokenMeterPricing
TokenEstimate → Intentionally omitted (creates phantom type!)
```

- **Fix:** Single source of truth in token-optimization, re-export in react

#### 3. Hook Naming Confusion

**Similar names, different purposes**

```
useTokenBudget (component-specific)
useTokenBudgetMonitor (analytics/tracking)
```

- **Fix:** Rename to useTokenBudgetBar and useTokenBudgetTracking

---

## Issues Breakdown

| Priority    | Count | Description                              |
| ----------- | ----- | ---------------------------------------- |
| 🔴 Critical | 8     | Breaking API issues, immediate attention |
| 🟡 High     | 12    | Significant confusion, high priority     |
| 🟠 Medium   | 15    | Moderate issues, plan refactoring        |
| ℹ️ Info     | 7     | Informational, no immediate action       |

---

## Package Export Analysis

### token-optimization/src/index.ts (681 lines)

```
✅ Hooks: useTokenCount, useTokenOptimization, etc.
✅ Utils: countTokens, compressText, etc.
✅ Types: ModelId, TokenModelConfig, etc.
❌ Components: 46 lines (SHOULD BE 0)
```

### react/src/public-api.ts (1066 lines)

```
✅ Components: ClarityChat, MessageList, etc.
✅ Chat Hooks: useClarityChat, useChat, etc.
❌ Missing: useTokenCount, useTokenOptimization (from token-optimization)
❌ Missing Types: ModelId, TokenModelConfig, etc.
```

---

## Import Direction (Layering)

```
✅ CORRECT: react → token-optimization (52 imports)
✅ CORRECT: No reverse imports detected
⚠️ WARNING: token-optimization exports React components (layering violation)
```

---

## Top 10 Specific Issues

1. **TokenCounter Name Overload** - 4 different TokenCounter exports
2. **Component Duplication** - 7 components exported from both packages
3. **Type Conflicts** - TokenEstimate missing from react package
4. **Hook Naming** - useTokenBudget vs useTokenBudgetMonitor confusion
5. **Model Type Collision** - TokenModelConfig vs ModelConfig
6. **BudgetStatus Duplication** - Same type, aliased unnecessarily
7. **Missing Hook Re-exports** - Token hooks not in react package
8. **Incomplete Type Exports** - Core types missing from react package
9. **Deprecated Exports Active** - Still in public API with @deprecated tags
10. **Deep Import Usage** - Bypassing public API surface

---

## Quick Wins (Easy Fixes)

### 1. Remove Component Exports from token-optimization

**File:** `packages/token-optimization/src/index.ts` **Lines:** 519-564 **Action:** Delete all
component exports

### 2. Re-export Token Hooks in React Package

**File:** `packages/react/src/public-api.ts` **Add:**

```typescript
export {
  useTokenCount,
  useTokenOptimization,
  useTieredCache,
  useModelRouter,
} from '@clarity-chat/token-optimization'
```

### 3. Export Missing Types in React Package

**File:** `packages/react/src/public-api.ts` **Add:**

```typescript
export type {
  ModelId,
  KnownModelId,
  TokenModelConfig,
  TokenEstimate,
  ModelPricing,
  CostCalculation,
} from '@clarity-chat/token-optimization'
```

---

## Recommended Refactoring Plan

### Week 1: Critical Fixes (Score: 63 → 75)

- Remove duplicate component exports
- Fix type export conflicts
- Resolve hook naming confusion

### Week 2: Naming Cleanup (Score: 75 → 82)

- Rename TokenCounter variants
- Fix model type name collisions
- Consolidate BudgetStatus type

### Week 3: Complete Public API (Score: 82 → 90)

- Re-export all hooks in react package
- Export all necessary types
- Remove deprecated exports

### Week 4: Documentation (Score: 90 → 92)

- Add "Which package?" guide
- Create migration guide
- Document sunset timeline for deprecated APIs

---

## Validation Commands

```bash
# After each fix, run:
npm run build          # Must succeed
npm run test           # Must pass
npm run type-check     # TypeScript strict mode
```

---

## Expected Outcome

### Current State

```typescript
// ❌ Confusing
import { TokenBudgetBar } from '@clarity-chat/token-optimization'
import { TokenBudgetBar } from '@clarity-chat/react' // Same export!
```

### Target State

```typescript
// ✅ Clear
import { useTokenCount, countTokens } from '@clarity-chat/token-optimization'
import { TokenBudgetBar } from '@clarity-chat/react'
```

**Projected Score After Fixes: 92/100 (A-)**

---

## Contact

For questions about this analysis, see the detailed report: `.merge-audit/API_COHESION_REPORT.md`
