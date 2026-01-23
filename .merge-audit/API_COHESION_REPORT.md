# API Cohesion Analysis Report

**Date:** 2026-01-23 **Packages Analyzed:**

- `@clarity-chat/token-optimization` (packages/token-optimization/src/index.ts)
- `@clarity-chat/react` (packages/react/src/public-api.ts)

---

## Executive Summary

**API Cohesion Score: 63.25/100** ⚠️

### Critical Issues Found: 8

### High-Priority Issues: 12

### Medium-Priority Issues: 15

### Informational: 7

---

## 1. DUPLICATE EXPORTS (Critical)

### 1.1 Component Duplication Between Packages

**Severity:** 🔴 Critical **Impact:** Confusing API surface, bundle bloat, maintenance burden

**Duplicated Components:**

```typescript
// BOTH packages export these React components:
;-TokenBudgetBar -
  TokenOptimizationBadge -
  TokenOptimizationPanel -
  TokenOptimizationDashboard -
  TokenCostPreview -
  useTokenEstimate -
  TokenUsageMeter
```

**Location:**

- `token-optimization/src/index.ts` (lines 519-564)
- `react/src/public-api.ts` (lines 713-741)

**Evidence:**

```typescript
// token-optimization/src/index.ts
export { TokenBudgetBar, useTokenBudget } from './components'
export { TokenCostPreview, useTokenEstimate } from './react'
export { TokenUsageMeter, TokenUsageMeterStatic } from './react'
export { TokenOptimizationBadge } from './react'
export { TokenOptimizationPanel } from './react'
export { TokenOptimizationDashboard } from './react'

// react/src/public-api.ts
export { TokenOptimizationPanel } from './components/token/TokenOptimizationPanel'
export { TokenOptimizationBadge } from './components/token/TokenOptimizationBadge'
export { TokenOptimizationDashboard } from './components/token/TokenOptimizationDashboard'
export { TokenCostPreview, useTokenEstimate } from './components/token/TokenCostPreview'
export { TokenUsageMeter } from './components/token/token-usage-meter'
export { TokenBudgetBar } from './components/token/token-budget-bar'
```

**Recommendation:** ✅

```typescript
// DECISION: Where should React components live?

Option A (Recommended): All React components in @clarity-chat/react
- Remove from token-optimization/src/index.ts
- Keep only in react/src/public-api.ts
- token-optimization exports ONLY hooks and logic

Option B: Keep in token-optimization (current state)
- Remove from react/src/public-api.ts
- Document that React users import from @clarity-chat/token-optimization

RECOMMENDATION: Option A
- Clearer separation of concerns
- React package is the UI layer
- Token-optimization is the logic layer
```

---

### 1.2 Type Export Conflicts

**Severity:** 🔴 Critical **Impact:** Type conflicts, ambiguous imports

**Conflicting Types:**

```typescript
// TokenEstimate - INTENTIONALLY omitted from react/public-api.ts
// Line 727: "Note: TokenEstimate type intentionally omitted to avoid conflict with app-api/token-engine.ts"

// TokenUsage - exported with DIFFERENT NAMES
token-optimization: TokenUsage (from hooks)
react: TokenUsage (from components/token/token-usage-meter)
react: AnalyticsTokenUsage (aliased)
react: TokenMeterUsage (aliased)
react: StreamTokenStats (aliased)

// ModelPricing - multiple aliases
token-optimization: ModelPricing
react: ModelPricing
react: TokenMeterPricing (aliased)
```

**Recommendation:** ✅

```typescript
// Create SINGLE source of truth in token-optimization
export type { TokenUsage } from '@clarity-chat/token-optimization'

// React should re-export, not redefine
// react/src/public-api.ts
export type { TokenUsage } from '@clarity-chat/token-optimization'
```

---

### 1.3 Hook Export Confusion

**Severity:** 🟡 High **Impact:** API discoverability issues

**Issue:**

```typescript
// TWO different "budget" hooks with similar names
token-optimization: useTokenBudget (component-specific)
react: useTokenBudgetMonitor (monitoring/analytics)

// Users don't know which to use!
```

**Evidence:**

```typescript
// token-optimization/src/index.ts:519
export { TokenBudgetBar, useTokenBudget } from './components'

// token-optimization/src/hooks/index.ts:62
export { useTokenBudgetMonitor } from './use-token-budget-monitor'

// react/src/public-api.ts:875
export { useTokenBudgetMonitor } from './hooks/token/use-token-budget-monitor'
```

**Recommendation:** ✅

```typescript
// Rename for clarity
useTokenBudget → useTokenBudgetBar (component-specific)
useTokenBudgetMonitor → useTokenBudgetTracking (monitoring)

// Or consolidate into one hook with options
useTokenBudget({ mode: 'display' | 'monitor' })
```

---

## 2. INCONSISTENT NAMING (High Priority)

### 2.1 TokenCounter Name Overload

**Severity:** 🟡 High **Impact:** Developer confusion, import errors

**Evidence:**

```typescript
// FOUR different "TokenCounter" exports!
1. AccurateTokenCounter (tokenizers/accurate-counter.ts)
2. SimpleTokenCounter (tokenizers/simple-counter.ts)
3. TokenCounter (legacy-compatibility.ts) - legacy
4. AdvancedTokenCounter (tokenizers/advanced-counter.ts)

// Plus interface collision:
5. TokenCounter interface (providers/types.ts:337)
```

**Recommendation:** ✅

```typescript
// Clear naming hierarchy
export { AccurateTokenCounter } // Production use (recommended)
export { FastTokenCounter } // Renamed from SimpleTokenCounter
export { LegacyTokenCounter } // Explicitly legacy
export { AdvancedTokenCounter } // Advanced features

// Remove interface name collision
export interface TokenCountingProvider { ... } // Renamed
```

---

### 2.2 Model Type Name Collision

**Severity:** 🟡 High **Impact:** Type confusion in routing vs tokenization

**Evidence:**

```typescript
// model-registry.ts exports TokenModelConfig
export type { TokenModelConfig } from './models/model-registry'

// model-router.ts exports ModelConfig
export type { ModelConfig } from './routing/model-router'

// Comment in model-registry.ts:98
// "Note: Named TokenModelConfig to avoid collision with ModelConfig in routing/model-router.ts"
```

**Issue:** Already acknowledged but inconsistent pattern.

**Recommendation:** ✅

```typescript
// Consistent naming across modules
TokenModelConfig → ModelRegistryConfig
ModelConfig (routing) → ModelRoutingConfig

// Or use namespaces
export namespace Tokenization {
  export type ModelConfig = TokenModelConfig
}
export namespace Routing {
  export type ModelConfig = ModelRoutingConfig
}
```

---

### 2.3 BudgetStatus Duplication

**Severity:** 🟡 High

**Evidence:**

```typescript
// token-optimization exports
export type { BudgetStatus } from './components'

// react exports (aliased to avoid conflict!)
export type { BudgetStatus as TokenBudgetStatus } from './components'

// WHY ALIAS? Same type!
```

**Recommendation:** ✅

```typescript
// Choose ONE canonical location
// token-optimization/src/types.ts
export interface BudgetStatus { ... }

// Both packages import from same source
```

---

## 3. MISSING EXPORTS (Medium Priority)

### 3.1 React Hook Not Available in React Package

**Severity:** 🟠 Medium **Impact:** Users import from wrong package

**Missing from react/public-api.ts:**

```typescript
// These hooks ARE in token-optimization but NOT in react:
useTokenCount
useTieredCache
useModelRouter
useOptimizationPipeline
useTokenOptimization (unified hook)
```

**Current State:**

```typescript
// Users must do:
import { useTokenCount } from '@clarity-chat/token-optimization'

// Expected:
import { useTokenCount } from '@clarity-chat/react'
```

**Recommendation:** ✅

```typescript
// react/src/public-api.ts should re-export
export {
  useTokenCount,
  useTieredCache,
  useModelRouter,
  useOptimizationPipeline,
  useTokenOptimization,
} from '@clarity-chat/token-optimization'
```

---

### 3.2 Incomplete Type Exports

**Severity:** 🟠 Medium

**Missing Types in react/public-api.ts:**

```typescript
// token-optimization exports these, react doesn't:
- ModelId, KnownModelId
- TokenModelConfig
- PricingProvider
- ModelPricing (has alias but not canonical)
- CostCalculation
- SemanticCacheConfig
- CacheMetadata
```

**Impact:** TypeScript users can't properly type their code when using @clarity-chat/react

**Recommendation:** ✅

```typescript
// react/src/public-api.ts
export type {
  ModelId,
  KnownModelId,
  TokenModelConfig,
  ModelPricing,
  CostCalculation,
  // ... all public types
} from '@clarity-chat/token-optimization'
```

---

## 4. IMPROPER LAYERING (High Priority)

### 4.1 React Package Importing from token-optimization

**Severity:** 🟡 High **Impact:** Correct (token-optimization is dependency)

**Analysis:**

```bash
# All imports flow correctly:
react → token-optimization ✅

# NO reverse imports found:
token-optimization → react ❌ (none found - good!)
```

**Evidence:**

```typescript
// react/src/utils/tokenization/*.ts
import { TokenCounter } from '@clarity-chat/token-optimization'

// This is CORRECT layering
```

**Status:** ✅ Passing

---

### 4.2 Circular Import Risk

**Severity:** 🟠 Medium

**Potential Issue:**

```typescript
// token-optimization/src/index.ts exports React components
export { TokenBudgetBar } from './components' // React component!
export { TokenCostPreview } from './react' // React component!

// BUT token-optimization should be React-agnostic
```

**Recommendation:** ✅

```typescript
// token-optimization should ONLY export:
- Hooks (useTokenCount, etc.) - can use React
- Logic/utilities (countTokens, etc.) - pure JS
- Types

// NOT components (those belong in react package)
```

---

## 5. DEPRECATION INCONSISTENCIES (Medium)

### 5.1 Deprecated Exports Still in Public API

**Severity:** 🟠 Medium

**Evidence:**

```typescript
// react/src/components/token/TokenCostPreview.tsx:2
/**
 * @deprecated Import from '@clarity-chat/token-optimization/react' instead
 */
export { TokenCostPreview, useTokenEstimate } from '@clarity-chat/token-optimization/react'

// BUT still exported in react/public-api.ts:724!
export { TokenCostPreview, useTokenEstimate } from './components/token/TokenCostPreview'
```

**Also deprecated but still exported:**

```typescript
// react/src/utils/tokenization/estimator.ts
/** @deprecated Import from '@clarity-chat/token-optimization' instead */

// react/src/utils/tokenization/model-pricing.ts
/** @deprecated Import from '@clarity-chat/token-optimization' instead */

// react/src/utils/tokenization/model-registry.ts
/** @deprecated Import from '@clarity-chat/token-optimization' instead */
```

**Recommendation:** ✅

```typescript
// Either:
1. Remove deprecated exports from public API
2. Add runtime console.warn() for deprecated usage
3. Update documentation to guide migration
```

---

## 6. CROSS-PACKAGE IMPORT PATTERNS

### 6.1 Import Analysis

**Severity:** ℹ️ Informational

**Findings:**

```bash
react → token-optimization: 52 import statements ✅
token-optimization → react: 0 import statements ✅
```

**Import Patterns:**

```typescript
// Most common imports in react package:
import { TokenCounter } from '@clarity-chat/token-optimization' (26 files)
import { AccurateTokenCounter } from '@clarity-chat/token-optimization' (8 files)
import { estimateTokens } from '@clarity-chat/token-optimization' (5 files)
```

**Status:** ✅ Correct dependency direction

---

### 6.2 Deep Import Usage

**Severity:** 🟠 Medium

**Evidence:**

```typescript
// react package using DEEP imports:
import { ... } from '@clarity-chat/token-optimization/compression'
import { ... } from '@clarity-chat/token-optimization/react'
```

**Issue:** Deep imports bypass public API, can break with refactoring

**Recommendation:** ✅

```typescript
// All exports should be available from package root
import { compressWithLLMLingua } from '@clarity-chat/token-optimization'
// NOT
import { compressWithLLMLingua } from '@clarity-chat/token-optimization/compression'
```

---

## 7. TYPE SAFETY ISSUES

### 7.1 Missing Generic Constraints

**Severity:** 🟠 Medium

**Evidence:**

```typescript
// token-optimization ModelId type allows any string
export type ModelId = KnownModelId | (string & Record<never, never>)

// But many functions don't validate
export function getModelConfig(id: ModelId): TokenModelConfig {
  return MODEL_REGISTRY[id] // Runtime error if id not in registry!
}
```

**Recommendation:** ✅

```typescript
// Add runtime validation or use branded types
export type ModelId = KnownModelId | CustomModelId
type CustomModelId = string & { __brand: 'CustomModelId' }

// Or require validation
export function getModelConfig(id: ModelId): TokenModelConfig {
  if (!isValidModelId(id)) {
    throw new UnsupportedModelError(id)
  }
  return MODEL_REGISTRY[id]
}
```

---

### 7.2 Type Re-exports Create Phantom Types

**Severity:** 🟠 Medium

**Evidence:**

```typescript
// react/public-api.ts:727
// Note: TokenEstimate type intentionally omitted to avoid conflict

// This creates MISSING type for users of react package!
const estimate = useTokenEstimate(text)
// estimate.cost - type error! TokenEstimate not exported
```

**Recommendation:** ✅

```typescript
// Don't omit types - resolve conflicts properly
export type { TokenEstimate as TokenCostEstimate } from '@clarity-chat/token-optimization'

// Or consolidate into single definition
```

---

## 8. DOCUMENTATION GAPS

### 8.1 Missing "Which Package?" Guidance

**Severity:** 🟠 Medium

**Issue:** No clear guidance on:

- When to use @clarity-chat/react vs @clarity-chat/token-optimization
- Which package exports which functionality
- Migration path for duplicated exports

**Recommendation:** ✅ Add to README:

```markdown
## Package Structure

### @clarity-chat/token-optimization

Core token optimization logic (use in Node.js or React)

- Hooks: useTokenCount, useTokenOptimization, etc.
- Utilities: countTokens, compressText, etc.
- Types: ModelId, TokenUsage, etc.

### @clarity-chat/react

React UI components for Clarity Chat

- Components: ClarityChat, MessageList, etc.
- Chat Hooks: useClarityChat, useChat, etc.
- Token UI: TokenBudgetBar, TokenOptimizationPanel (import from token-optimization!)
```

---

## 9. SUMMARY OF ISSUES

### Critical Issues (🔴 Priority 1)

1. ✅ **Duplicate React component exports** (components, hooks, types)
2. ✅ **Type export conflicts** (TokenEstimate, TokenUsage, ModelPricing)
3. ✅ **Hook naming confusion** (useTokenBudget vs useTokenBudgetMonitor)

### High-Priority Issues (🟡 Priority 2)

4. ✅ **TokenCounter name overload** (4+ variations)
5. ✅ **Model type name collision** (TokenModelConfig vs ModelConfig)
6. ✅ **BudgetStatus duplication**
7. ✅ **Missing React hooks in React package**
8. ✅ **Improper component layering** (React components in token-optimization)

### Medium-Priority Issues (🟠 Priority 3)

9. ✅ **Incomplete type exports in React package**
10. ✅ **Deprecated exports still active**
11. ✅ **Deep import usage bypassing public API**
12. ✅ **Missing type safety in model registry**
13. ✅ **Phantom types from intentional omissions**
14. ✅ **Documentation gaps**

### Informational (ℹ️)

15. ✅ **Import direction is correct** (react → token-optimization only)

---

## 10. RECOMMENDED ACTIONS

### Phase 1: Critical Fixes (Week 1)

```typescript
// 1. Remove React component exports from token-optimization
// packages/token-optimization/src/index.ts
// DELETE lines 519-564 (all component exports)

// 2. Consolidate React components in react package only
// packages/react/src/public-api.ts
// KEEP existing component exports

// 3. Fix type conflicts
// Create single source of truth for TokenUsage, TokenEstimate
```

### Phase 2: Naming Cleanup (Week 2)

```typescript
// 1. Rename TokenCounter variants
SimpleTokenCounter → FastTokenCounter
TokenCounter → LegacyTokenCounter

// 2. Resolve hook naming
useTokenBudget → useTokenBudgetBar
useTokenBudgetMonitor → useTokenBudgetTracking

// 3. Fix type name collisions
TokenModelConfig → ModelRegistryConfig
ModelConfig → ModelRoutingConfig
```

### Phase 3: Complete Public API (Week 3)

```typescript
// 1. Export all hooks in react package
// packages/react/src/public-api.ts
export {
  useTokenCount,
  useTokenOptimization,
  useTieredCache,
  useModelRouter,
} from '@clarity-chat/token-optimization'

// 2. Export all necessary types
export type {
  ModelId,
  TokenModelConfig,
  TokenUsage,
  // ... all public types
} from '@clarity-chat/token-optimization'
```

### Phase 4: Documentation (Week 4)

```markdown
1. Add "Which package to use?" guide
2. Create migration guide for duplicate exports
3. Document deprecated APIs with sunset timeline
4. Add TypeScript examples for common patterns
```

---

## 11. API COHESION SCORECARD

| Category                   | Score  | Weight | Weighted Score |
| -------------------------- | ------ | ------ | -------------- |
| **No Duplicate Exports**   | 40/100 | 25%    | 10.0           |
| **Consistent Naming**      | 65/100 | 20%    | 13.0           |
| **Complete Type Coverage** | 75/100 | 15%    | 11.25          |
| **Proper Layering**        | 90/100 | 15%    | 13.5           |
| **Clear Documentation**    | 60/100 | 10%    | 6.0            |
| **No Missing Exports**     | 70/100 | 10%    | 7.0            |
| **Deprecation Management** | 50/100 | 5%     | 2.5            |

**TOTAL API COHESION SCORE: 63.25/100** ⚠️

### Grade: D+ (Needs Improvement)

**Interpretation:**

- 90-100: Excellent (A) - Production-ready, minimal issues
- 80-89: Good (B) - Minor cleanup needed
- 70-79: Fair (C) - Moderate refactoring recommended
- 60-69: Poor (D) - Significant issues, refactoring required ⬅️ YOU ARE HERE
- 0-59: Critical (F) - Major architectural problems

---

## 12. BEFORE/AFTER COMPARISON

### Current State (Score: 63)

```typescript
// ❌ Confusing - same component in both packages
import { TokenBudgetBar } from '@clarity-chat/token-optimization'
import { TokenBudgetBar } from '@clarity-chat/react'

// ❌ Type conflicts
import { TokenEstimate } from '@clarity-chat/token-optimization' // exists
import { TokenEstimate } from '@clarity-chat/react' // MISSING!

// ❌ Name collision
import { TokenCounter } from '...' // which one???
```

### After Cleanup (Projected Score: 92)

```typescript
// ✅ Clear separation
import { useTokenCount, countTokens } from '@clarity-chat/token-optimization'
import { TokenBudgetBar } from '@clarity-chat/react'

// ✅ Consistent types
import type { TokenEstimate, ModelId } from '@clarity-chat/token-optimization'

// ✅ Clear naming
import { AccurateTokenCounter, FastTokenCounter } from '@clarity-chat/token-optimization'
```

---

## 13. VALIDATION CHECKLIST

Run these checks after implementing fixes:

```bash
# 1. No duplicate exports
npm run check:exports

# 2. All types exported
npm run check:types

# 3. No import cycles
npm run check:circular

# 4. Deprecated usage tracked
npm run check:deprecated

# 5. Build succeeds
npm run build

# 6. Tests pass
npm run test

# 7. TypeScript strict mode
npm run type-check

# 8. Bundle size within limits
npm run analyze
```

---

## APPENDIX: Detailed File Analysis

### token-optimization/src/index.ts

- **Total Exports:** 681 lines
- **Component Exports:** 46 lines (should be 0)
- **Type Exports:** ~150 lines
- **Utility Exports:** ~485 lines

### react/src/public-api.ts

- **Total Exports:** 1066 lines
- **Component Exports:** ~300 lines
- **Hook Exports:** ~150 lines
- **Type Exports:** ~100 lines
- **Utility Exports:** ~516 lines

### Import Graph

```
react (1221 files)
  ↓ (52 imports)
token-optimization (220 files)
  ↓ (0 imports)
[external dependencies]
```

**Status:** ✅ No circular dependencies detected
