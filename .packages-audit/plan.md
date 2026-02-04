# Remediation Plan — Detailed, Executable

**Date:** 2026-01-23 **Branch:** clean-up **Execution Order:** Strictly sequential (dependencies
matter)

**HARD STOP CONDITION:** No plan is acceptable if it allows duplicates to remain.

---

## EXECUTION PHASES

### PHASE 1: Consolidate Duplicate APIs (CRITICAL — P0)

**Goal:** Eliminate all 150 duplicate API implementations **duplicateApisRemaining Target:** 7
(domain extensions only) **Estimated Effort:** 40 hours

---

#### Task 1.1: Token Counter Consolidation (10 duplicates)

**Canonical:** `AccurateTokenCounter` in
`/packages/token-optimization/src/tokenizers/accurate-counter.ts`

**DELETE:**

```
✗ /packages/token-optimization/src/tokenizers/fast-counter.ts
✗ /packages/token-optimization/src/tokenizers/simple-counter.ts
✗ /packages/token-optimization/src/tokenizers/advanced-counter.ts (merge features into AccurateTokenCounter first)
✗ /packages/token-optimization/src/legacy-compatibility.ts (LegacyTokenCounter, TokenCounter alias)
✗ /packages/memory/src/utils/token-counter.ts
✗ /packages/react/src/utils/tokenization/performance-optimization.ts
✗ /packages/react/src/utils/tokenization/smart-fallback.ts
✗ /packages/react/src/utils/tokenization/robust-error-handling.ts
✗ /packages/react/src/memory/token-optimizer.ts
```

**MIGRATE CONSUMERS:**

```bash
# Search for old API usage
rg "FastTokenCounter|SimpleTokenCounter|AdvancedTokenCounter|LegacyTokenCounter|OptimizedTokenCounter|SmartTokenCounter|RobustTokenCounter" --type ts

# Replace all with:
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
```

**ACCEPTANCE CRITERIA:**

- ✅ Only AccurateTokenCounter remains
- ✅ All features from other counters merged
- ✅ All tests pass
- ✅ Zero references to deleted counters (`rg` search returns 0 results)

**VERIFICATION:**

```bash
rg "TokenCounter" --type ts | grep -v "AccurateTokenCounter" | grep -v "// test" | wc -l
# Should return 0
```

---

#### Task 1.2: Token Hooks Consolidation (27 duplicates)

**Canonical Package:** `/packages/token-optimization/src/hooks/`

**DELETE:**

```
✗ /packages/react/src/hooks/token/* (entire directory)
✗ /packages/react/src/hooks/clarity-tokens/* (most files, keep only necessary wrappers)
```

**KEEP (thin wrappers if necessary):**

```
packages/react/src/hooks/token/
└── index.ts (re-exports from token-optimization)
```

**MIGRATE CONSUMERS:**

```bash
# Find all usage
rg "import.*from.*hooks/token" --type tsx
rg "import.*from.*hooks/clarity-tokens" --type tsx

# Replace with:
import {
  useTokenCount,
  useTokenOptimization,
  useTokenBudgetMonitor,
  // ... etc
} from '@clarity-chat/token-optimization'
```

**ACCEPTANCE CRITERIA:**

- ✅ All hooks in token-optimization package
- ✅ React package only has thin re-exports (optional)
- ✅ All hook consumers updated
- ✅ All tests pass

**VERIFICATION:**

```bash
ls packages/react/src/hooks/token/ | wc -l  # Should be 0 or 1 (index.ts)
ls packages/react/src/hooks/clarity-tokens/ | wc -l  # Should be 0 or 1 (index.ts)
```

---

#### Task 1.3: Compression Consolidation (10 duplicates)

**Canonical:** `/packages/token-optimization/src/compression/`

**DELETE:**

```
✗ /packages/token-optimization/src/compression/dynamic-compression.ts (DEPRECATED)
✗ /packages/memory/src/utils/token-optimization-stubs.ts (MemoryCompressor stub)
✗ /packages/react/src/utils/optimization/llmlingua-compressor.ts
✗ /packages/react/src/utils/tokenization/advanced-compression.ts
✗ /packages/react/src/memory/token-optimizer.ts (MemoryCompressor)
✗ /packages/react/src/utils/optimization/ (SemanticCompressor, PromptCompressor)
```

**MIGRATE CONSUMERS:**

```bash
# Search for compression usage
rg "MemoryCompressor|LLMLinguaCompressor|SemanticCompressor|PromptCompressor" --type ts

# Replace with:
import {
  LLMLinguaCompressor,
  AdaptiveCompressor,
  // ... etc
} from '@clarity-chat/token-optimization'
```

**ACCEPTANCE CRITERIA:**

- ✅ dynamic-compression.ts deleted (1246 lines removed)
- ✅ All compression in token-optimization package
- ✅ No compression code in react/memory packages
- ✅ All tests pass

---

#### Task 1.4: Cache Consolidation (30 duplicates)

**Canonical Simple:** `/packages/utils/src/cache/index.ts` — LRUCache, TTLCache

**Canonical Advanced:** `/packages/token-optimization/src/cache/` — TieredCache, SmartCache,
ExactCache

**DELETE:**

```
✗ /packages/memory/src/utils/cache.ts (LRUCache duplicate)
✗ /packages/react/src/utils/optimization/smart-cache.ts
✗ /packages/react/src/utils/optimization/semantic-cache-persistent.ts
✗ /packages/react/src/utils/tokenization/intelligent-caching.ts
✗ All cache implementations in react package (except imports)
```

**MIGRATE CONSUMERS:**

```bash
# Replace imports
# Simple caching:
import { LRUCache, TTLCache } from '@clarity-chat/utils'

# Advanced caching:
import { SmartCache, TieredCache, ExactCache } from '@clarity-chat/token-optimization'
```

**ACCEPTANCE CRITERIA:**

- ✅ Basic caching in utils
- ✅ Advanced caching in token-optimization
- ✅ No cache implementations in react/memory
- ✅ All cache hooks updated

---

#### Task 1.5: Error Boundary Consolidation (7 duplicates → 1 extension)

**Canonical:** `/packages/error-handling/src/components/EnhancedErrorBoundary.ts`

**KEEP as Extension:** `/packages/error-handling/src/components/ChatErrorBoundary.ts`

**DELETE:**

```
✗ /packages/error-handling/src/components/ErrorBoundary.ts (class component)
✗ /packages/playground/src/components/ErrorBoundary.ts
✗ /packages/react/src/components/feedback/error-boundary.tsx
✗ /packages/react/src/components/demos/prompt-architect/components/PromptArchitectErrorBoundary.tsx
✗ /packages/cli/templates/components/error-boundary/ErrorBoundary.tsx
✗ /examples/**/error-boundary.tsx (20+ files)
```

**MIGRATE CONSUMERS:**

```bash
# Search all ErrorBoundary imports
rg "import.*ErrorBoundary" --type tsx

# Replace with:
import { EnhancedErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'
# OR for chat-specific:
import { ChatErrorBoundary } from '@clarity-chat/error-handling'
```

**ACCEPTANCE CRITERIA:**

- ✅ Only 2 implementations remain (Enhanced + ChatErrorBoundary)
- ✅ All examples use library import
- ✅ ~3,720 LOC removed from examples

---

#### Task 1.6: Logger Consolidation (8 duplicates → 2 extensions)

**Canonical:** `/packages/utils/src/logger/index.ts` — `getLogger()`

**KEEP as Extensions:**

- `/packages/memory/src/audit/audit-logger.ts` — AuditLogger
- `/packages/error-handling/src/utils/error-logger.ts` — ErrorLogger

**DELETE:**

```
✗ /packages/cli/src/utils/logger.ts
✗ /packages/dev-tools/src/debug/logger.ts
✗ /packages/memory/src/utils/logger.ts
✗ /packages/token-optimization/src/observability/index.ts (logger parts)
✗ /packages/react/src/utils/logger.ts
✗ /packages/react/src/adapters/logging.ts
✗ /packages/react/src/audit/audit-logger.ts (use memory package)
```

**MIGRATE CONSUMERS:**

```bash
# Replace all logger usage:
import { getLogger } from '@clarity-chat/utils'

# Extensions inherit:
import { AuditLogger } from '@clarity-chat/memory'
import { ErrorLogger } from '@clarity-chat/error-handling'
```

**ACCEPTANCE CRITERIA:**

- ✅ Single canonical logger
- ✅ 2 domain extensions only
- ✅ All packages use utils/logger

---

#### Task 1.7: Validation Error Consolidation (9 duplicates → 4 extensions)

**Canonical:** `/packages/error-handling/src/errors/validation-error.ts`

**KEEP as Extensions:**

- `MemoryValidationError`
- `ToolValidationError`
- `ConfigValidationError`
- `CLIValidationError`

**DELETE (generic ValidationError):**

```
✗ /packages/token-optimization/src/errors/index.ts (ValidationError)
✗ /packages/utils/src/errors/validation.ts (ValidationError)
✗ /packages/cli/src/utils/errors.ts (ValidationError)
✗ /packages/react/src/enterprise/enterprise-errors.ts (ValidationError)
```

**MIGRATE:**

```typescript
// Base class from error-handling:
import { ValidationError } from '@clarity-chat/error-handling'

// Domain-specific extend:
export class MemoryValidationError extends ValidationError {
  /* ... */
}
```

---

#### Task 1.8: Utility Consolidation (cn, useReducedMotion, etc.)

**cn utility (3 duplicates):**

- Canonical: `/packages/primitives/src/lib/cn.ts`
- DELETE: primitives/lib/utils.ts (duplicate), playground/utils/cn.ts, react/utils/cn.ts

**useReducedMotion (4 duplicates):**

- Canonical: `/packages/primitives/src/hooks/use-reduced-motion.ts`
- DELETE: error-handling, react/accessibility, react/animations versions

**Memory Service types (1 duplicate):**

- Canonical: `/packages/memory/src/memory-service.ts`
- DELETE: react/memory/types.ts duplicate MemoryServiceConfig

---

### PHASE 2: Update All Consumers

**Goal:** Migrate all imports to canonical APIs **Estimated Effort:** 20 hours

#### Task 2.1: Global Search & Replace

For each consolidated API, execute:

```bash
# 1. Find all usage
rg "<OLD_API_NAME>" --type ts --type tsx -l > affected_files.txt

# 2. Update imports
# Manual or with codemod

# 3. Verify zero old references remain
rg "<OLD_API_NAME>" --type ts --type tsx
# Should return 0 results (except in deprecated.md)
```

#### Task 2.2: Update Package Dependencies

Update package.json files to reflect new imports:

```json
// packages/react/package.json
{
  "dependencies": {
    "@clarity-chat/token-optimization": "workspace:*",
    "@clarity-chat/memory": "workspace:*",
    "@clarity-chat/error-handling": "workspace:*"
    // Remove duplicate implementations
  }
}
```

---

### PHASE 3: Remove Dead Code

**Goal:** Delete all duplicate implementations **Estimated Effort:** 10 hours

#### Task 3.1: Delete Duplicate Files

Execute deletions in order:

```bash
# Token optimization duplicates
rm -rf packages/react/src/utils/tokenization/
rm -rf packages/react/src/utils/optimization/
rm -rf packages/react/src/memory/token-optimizer.ts

# Compression
rm packages/token-optimization/src/compression/dynamic-compression.ts

# Caching
rm -rf packages/react/src/utils/tokenization/intelligent-caching.ts

# Error boundaries
rm packages/react/src/components/feedback/error-boundary.tsx
rm examples/**/error-boundary.tsx

# Loggers
rm packages/react/src/utils/logger.ts
rm packages/cli/src/utils/logger.ts
# ... etc

# Utilities
rm packages/playground/src/utils/cn.ts
rm packages/react/src/utils/cn.ts
```

#### Task 3.2: Update Barrel Exports

Remove deleted exports from index.ts files:

```typescript
// packages/react/src/index.ts
// REMOVE:
// export * from './utils/tokenization'
// export * from './utils/optimization'
// export * from './components/feedback/error-boundary'

// Keep only:
export { useTokenCount } from '@clarity-chat/token-optimization'
// ... etc
```

---

### PHASE 4: Clean APIs & Simplify

**Goal:** Fix architectural issues **Estimated Effort:** 30 hours

#### Task 4.1: Break Circular Dependency (token-optimization → primitives)

**Option A (Recommended):** Extract UI utilities to @clarity-chat/utils

```bash
# Move from primitives to utils:
mv packages/primitives/src/lib/cn.ts packages/utils/src/ui-helpers/cn.ts
mv packages/primitives/src/lib/glass-variants.ts packages/utils/src/ui-helpers/
mv packages/primitives/src/lib/semantic-gradients.ts packages/utils/src/ui-helpers/

# Update imports in token-optimization:
# From: import { cn } from '@clarity-chat/primitives'
# To:   import { cn } from '@clarity-chat/utils/ui-helpers'
```

**Verification:**

```bash
# Ensure no primitives imports in token-optimization:
rg "@clarity-chat/primitives" packages/token-optimization/
# Should return 0 results
```

**ACCEPTANCE CRITERIA:**

- ✅ token-optimization has zero imports from primitives
- ✅ Circular dependency eliminated
- ✅ All tests pass

---

#### Task 4.2: Split primitives/utils.ts (172 functions → 8 modules)

**Create:**

```
packages/primitives/src/lib/utils/
├── type-guards.ts        # 30 type checking functions
├── string-utils.ts       # 20 string manipulation
├── array-utils.ts        # 15 array operations
├── object-utils.ts       # 12 object operations
├── html-validators.ts    # 40 HTML/SVG/XML validators
├── async-utils.ts        # retry, sleep, debounce, throttle
├── format-utils.ts       # formatBytes, formatDate, etc.
└── index.ts              # Re-export all (maintain compatibility)
```

**Migrate:**

```bash
# Move functions to appropriate modules
# Update internal imports
# Keep index.ts exporting everything for backward compatibility
```

**ACCEPTANCE CRITERIA:**

- ✅ utils.ts deleted (1526 lines)
- ✅ 8 focused modules created
- ✅ Backward compatibility maintained via index.ts
- ✅ Better tree-shaking (test bundle size)

---

#### Task 4.3: Split Large Files (>1000 lines)

**toon-optimizer.ts (1814 lines):**

```
packages/token-optimization/src/formats/toon/
├── parser.ts
├── encoder.ts
├── validator.ts
├── schema.ts
├── types.ts
└── index.ts
```

**memory-service.ts (1577 lines):**

```
packages/memory/src/services/
├── memory-cache-service.ts
├── memory-persistence-service.ts
├── memory-optimization-service.ts
├── memory-query-service.ts
└── memory-service.ts (coordinator)
```

**DELETE dynamic-compression.ts:**

```bash
rm packages/token-optimization/src/compression/dynamic-compression.ts
# 1246 lines of deprecated code removed
```

---

### PHASE 5: Tests

**Goal:** Ensure canonical APIs are well-tested **Estimated Effort:** 20 hours

#### Task 5.1: Add Missing Tests

**Priority tests:**

```
✓ AccurateTokenCounter (comprehensive)
✓ All token hooks
✓ EnhancedErrorBoundary
✓ Compression strategies
✓ Cache implementations
✓ Codemods (CRITICAL)
✓ GDPR features (ConsentManager, AuditLogger)
```

#### Task 5.2: Consolidate Test Utilities

Move to `/packages/testing-utils/src/`:

```
✗ Delete packages/react/src/test-utils.tsx
✗ Delete packages/react/src/test-utils/index.tsx
✓ Keep testing-utils as canonical
```

---

### PHASE 6: Documentation

**Goal:** Update all docs to reference canonical APIs **Estimated Effort:** 15 hours

#### Task 6.1: Update Storybook

```bash
# Add deprecation warnings:
- UseChatEnhanced.stories.tsx
- All Token* stories

# Update imports to canonical:
import { useTokenCount } from '@clarity-chat/token-optimization'
```

#### Task 6.2: Update Examples

```bash
# Replace local ErrorBoundary with library import
# Update all deprecated hook usage
# Fix package name inconsistencies
```

#### Task 6.3: Create Migration Guide

Create `.packages-audit/migrations.md` with step-by-step migration for each API consolidation.

---

## VERIFICATION COMMANDS

After each phase:

```bash
# 1. Check for old API references
rg "<OLD_API>" --type ts --type tsx
# Should return 0 results

# 2. Typecheck
pnpm typecheck

# 3. Lint
pnpm lint

# 4. Tests
pnpm test

# 5. Build
pnpm build:packages

# 6. Update progress
cat .packages-audit/progress.json
```

---

## ACCEPTANCE CRITERIA (OVERALL)

### Must Pass:

- ✅ **duplicateApisRemaining == 7** (domain extensions only)
- ✅ **pnpm typecheck** passes
- ✅ **pnpm lint** passes
- ✅ **pnpm test** passes
- ✅ **pnpm build:packages** passes
- ✅ **rg searches for old APIs return 0 results**
- ✅ **No circular dependencies** (`token-optimization` doesn't import `primitives`)
- ✅ **Large files split** (no files >1000 lines except justified cases)
- ✅ **Documentation updated** (no deprecated API references)

### Metrics Targets:

| Metric                 | Current | Target | Status |
| ---------------------- | ------- | ------ | ------ |
| duplicateApisRemaining | 150     | 7      | ⏳     |
| Packages >3MB          | 1       | 0      | ⏳     |
| Files >1000 lines      | 15      | 3      | ⏳     |
| Test coverage          | 27%     | 60%    | ⏳     |
| Deprecated API refs    | 120+    | 0      | ⏳     |

---

## ESTIMATED TOTAL EFFORT

| Phase                     | Effort (hours)             |
| ------------------------- | -------------------------- |
| 1. Consolidate Duplicates | 40                         |
| 2. Update Consumers       | 20                         |
| 3. Remove Dead Code       | 10                         |
| 4. Clean APIs             | 30                         |
| 5. Tests                  | 20                         |
| 6. Documentation          | 15                         |
| **TOTAL**                 | **135 hours** (~3.5 weeks) |

---

## RISK MITIGATION

1. **Create feature branch** for consolidation work
2. **Incremental commits** after each task
3. **Run verification** after each phase
4. **Keep deprecated.md** updated with migration paths
5. **Communicate breaking changes** to users

---

**NEXT STEP:** Proceed to PHASE 4 execution with Task 1.1 (Token Counter Consolidation)
