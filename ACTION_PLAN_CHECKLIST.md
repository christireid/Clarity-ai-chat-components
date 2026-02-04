# Action Plan Checklist

## Clarity AI Chat Components - Path to Production

**Generated:** 2026-01-27 **Target Completion:** Week 8 (56 days) **Current Status:** 🔴 Week 0 (Not
Started)

---

## Quick Status

```
Progress: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0/144 hours
Security: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0/9 days
Overall:  [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%
```

**Next Action:** Schedule security team meeting (Week 1)

---

## PHASE 0: Pre-Migration Security (9 Days) **BLOCKING**

### Week 1: Critical Security Fixes (CANNOT SKIP)

**Day 1-2: Secret Detection & Redaction**

- [ ] Design secret redaction pattern
- [ ] Implement in all logger implementations
- [ ] Test redaction with sample secrets
- [ ] Verify no secrets in error logs
- [ ] Run secret scanner on test output
- [ ] Document redaction pattern

**Files to modify:**

```
packages/utils/src/logger/index.ts
packages/memory/src/audit/audit-logger.ts
packages/error-handling/src/utils/error-logger.ts
```

**Acceptance Criteria:**

```bash
✅ node scripts/scan-secrets.js  # 0 secrets found
✅ Test logs contain [REDACTED] for API keys
✅ Secret scanner passes on all test output
```

---

**Day 3: Sensitive Field Filtering**

- [ ] Identify sensitive field patterns (password, apiKey, token, etc.)
- [ ] Add auto-redaction to ValidationError
- [ ] Test with various sensitive fields
- [ ] Verify no sensitive data in error responses
- [ ] Update error handling documentation

**Files to modify:**

```
packages/error-handling/src/errors/validation-error.ts
```

**Acceptance Criteria:**

```typescript
✅ ValidationError.field('password', 'Too short', 'TOO_SHORT')
   // Returns: { value: '[REDACTED]' }
✅ ValidationError.field('apiKey', 'Invalid', 'INVALID_FORMAT')
   // Returns: { value: '[REDACTED]' }
✅ All tests pass
```

---

**Day 4: XSS Protection (DOMPurify)**

- [ ] Install isomorphic-dompurify
- [ ] Replace regex-based sanitization
- [ ] Configure DOMPurify for all contexts
- [ ] Test XSS bypass attempts
- [ ] Update security documentation

**Files to modify:**

```
packages/react/src/utils/security/sanitize-html.ts
packages/react/src/components/ai/enhanced-markdown-renderer.tsx
```

**Dependencies:**

```bash
pnpm add isomorphic-dompurify
pnpm add -D @types/dompurify
```

**Acceptance Criteria:**

```bash
✅ node scripts/test-xss-protection.js  # All vectors blocked
✅ <scr<script>ipt>alert(1)</script>  # Sanitized
✅ All markdown rendering uses DOMPurify
```

---

**Day 5: Security Testing & Verification**

- [ ] Run full security test suite
- [ ] Execute penetration testing
- [ ] Verify all fixes effective
- [ ] Document security improvements
- [ ] Prepare security team review

**Tests to run:**

```bash
pnpm test:security
node scripts/scan-secrets.js
node scripts/test-xss-protection.js
pnpm audit
```

**Acceptance Criteria:**

```
✅ All security tests pass
✅ 0 critical vulnerabilities
✅ 0 high vulnerabilities
✅ Penetration test report clean
```

---

### Week 2: High Priority Security (RECOMMENDED)

**Day 6-7: Secure Cache Wrapper**

- [ ] Add collision detection to LRUCache
- [ ] Implement hash verification
- [ ] Add cache integrity checks
- [ ] Test with 100k items
- [ ] Performance benchmark

**Files to modify:**

```
packages/utils/src/cache/index.ts
```

**Acceptance Criteria:**

```bash
✅ node scripts/detect-hash-collisions.js  # 0 collisions
✅ Collision detection throws on mismatch
✅ Performance impact <5%
```

---

**Day 8: Stronger Hash Function**

- [ ] Evaluate hash alternatives (SHA-256 vs FNV-1a)
- [ ] Implement cache versioning
- [ ] Add migration path for existing caches
- [ ] Test collision probability
- [ ] Benchmark performance

**Files to modify:**

```
packages/token-optimization/src/tokenizers/accurate-counter.ts
```

**Acceptance Criteria:**

```typescript
✅ Cache includes version: { version: '2.0.0', tokens: 42 }
✅ Old cache entries auto-invalidated
✅ Collision probability <0.01% at 100k items
```

---

**Day 9: Validation XSS Protection**

- [ ] Sanitize all validation error messages
- [ ] Test with XSS payloads in validation
- [ ] Ensure no script execution
- [ ] Update validation documentation

---

### Security Phase Sign-Off

**Checklist:**

- [ ] All Day 1-5 tasks complete (MANDATORY)
- [ ] All security tests pass
- [ ] Security team reviewed and approved
- [ ] Penetration test passed
- [ ] No critical/high vulnerabilities remain
- [ ] Security documentation updated

**Sign-Off:**

```
Security Lead: _________________ Date: _______
Engineering Lead: ______________ Date: _______
```

**🔴 DO NOT PROCEED TO PHASE 1 WITHOUT SECURITY SIGN-OFF**

---

## PHASE 1: API Consolidation (40 Hours)

### Task 1.1: Token Counter Consolidation (10 → 1) - 6 hours

- [ ] **Step 1:** Verify AccurateTokenCounter is canonical

  ```bash
  # Check features
  cat packages/token-optimization/src/tokenizers/accurate-counter.ts
  ```

- [ ] **Step 2:** Find all old counter usage

  ```bash
  rg "FastTokenCounter|SimpleTokenCounter|AdvancedTokenCounter" --type ts -l > affected_files.txt
  ```

- [ ] **Step 3:** Update imports systematically

  ```bash
  # For each file in affected_files.txt:
  # OLD: import { FastTokenCounter } from '...'
  # NEW: import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
  ```

- [ ] **Step 4:** Delete duplicate implementations

  ```bash
  rm packages/token-optimization/src/tokenizers/fast-counter.ts
  rm packages/token-optimization/src/tokenizers/simple-counter.ts
  rm packages/token-optimization/src/tokenizers/advanced-counter.ts
  rm packages/token-optimization/src/legacy-compatibility.ts
  rm packages/memory/src/utils/token-counter.ts
  rm packages/react/src/utils/tokenization/performance-optimization.ts
  rm packages/react/src/utils/tokenization/smart-fallback.ts
  rm packages/react/src/utils/tokenization/robust-error-handling.ts
  rm packages/react/src/memory/token-optimizer.ts
  ```

- [ ] **Step 5:** Verify zero old references

  ```bash
  rg "TokenCounter" --type ts | grep -v "AccurateTokenCounter" | wc -l
  # Should return: 0
  ```

- [ ] **Step 6:** Run tests
  ```bash
  pnpm test
  # All pass
  ```

---

### Task 1.2: Token Hooks Consolidation (27 → 1) - 8 hours

- [ ] **Step 1:** Audit all token hook usage

  ```bash
  rg "import.*from.*hooks/token" --type tsx -l
  rg "import.*from.*hooks/clarity-tokens" --type tsx -l
  ```

- [ ] **Step 2:** Update to canonical package

  ```typescript
  // OLD
  import { useTokenCount } from '../hooks/token'

  // NEW
  import { useTokenCount } from '@clarity-chat/token-optimization'
  ```

- [ ] **Step 3:** Delete duplicate directories

  ```bash
  rm -rf packages/react/src/hooks/token/
  # Keep only: packages/react/src/hooks/clarity-tokens/ (thin wrappers)
  ```

- [ ] **Step 4:** Verify all consumers updated

  ```bash
  rg "hooks/token" --type tsx | wc -l
  # Should return: 0
  ```

- [ ] **Step 5:** Test all token hooks
  ```bash
  pnpm test packages/token-optimization
  pnpm test packages/react
  ```

---

### Task 1.3: Compression Consolidation (10 → 1) - 4 hours

- [ ] **Step 1:** Delete deprecated dynamic-compression.ts (1246 lines)

  ```bash
  rm packages/token-optimization/src/compression/dynamic-compression.ts
  ```

- [ ] **Step 2:** Find compression usage

  ```bash
  rg "MemoryCompressor|LLMLinguaCompressor|SemanticCompressor" --type ts -l
  ```

- [ ] **Step 3:** Update to canonical package

  ```typescript
  // OLD
  import { MemoryCompressor } from '../memory/token-optimizer'

  // NEW
  import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'
  ```

- [ ] **Step 4:** Delete duplicates

  ```bash
  rm packages/memory/src/utils/token-optimization-stubs.ts
  rm packages/react/src/utils/optimization/llmlingua-compressor.ts
  rm packages/react/src/utils/tokenization/advanced-compression.ts
  rm packages/react/src/memory/token-optimizer.ts
  rm -rf packages/react/src/utils/optimization/
  ```

- [ ] **Step 5:** Verify and test
  ```bash
  rg "MemoryCompressor" --type ts
  # Should only find in token-optimization package
  pnpm test
  ```

---

### Task 1.4: Cache Consolidation (30 → 2) - 8 hours

- [ ] **Step 1:** Identify cache usage patterns

  ```bash
  rg "LRUCache|TTLCache|SmartCache|TieredCache" --type ts -l
  ```

- [ ] **Step 2:** Update simple caching imports

  ```typescript
  // OLD
  import { LRUCache } from '../utils/cache'

  // NEW
  import { LRUCache, TTLCache } from '@clarity-chat/utils'
  ```

- [ ] **Step 3:** Update advanced caching imports

  ```typescript
  // OLD
  import { SmartCache } from '../utils/optimization/smart-cache'

  // NEW
  import { SmartCache, TieredCache, ExactCache } from '@clarity-chat/token-optimization'
  ```

- [ ] **Step 4:** Delete duplicate caches

  ```bash
  rm packages/memory/src/utils/cache.ts
  rm packages/react/src/utils/optimization/smart-cache.ts
  rm packages/react/src/utils/optimization/semantic-cache-persistent.ts
  rm packages/react/src/utils/tokenization/intelligent-caching.ts
  ```

- [ ] **Step 5:** Verify and test
  ```bash
  rg "class.*Cache" packages/react/ packages/memory/
  # Should find 0 cache implementations
  pnpm test
  ```

---

### Task 1.5: Error Boundary Consolidation (7 → 2) - 4 hours

- [ ] **Step 1:** Find all ErrorBoundary usage

  ```bash
  rg "import.*ErrorBoundary" --type tsx -l > error_boundaries.txt
  ```

- [ ] **Step 2:** Update to canonical

  ```typescript
  // OLD
  import { ErrorBoundary } from './components/ErrorBoundary'

  // NEW
  import { EnhancedErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'
  // OR for chat-specific:
  import { ChatErrorBoundary } from '@clarity-chat/error-handling'
  ```

- [ ] **Step 3:** Delete duplicates

  ```bash
  rm packages/error-handling/src/components/ErrorBoundary.ts
  rm packages/playground/src/components/ErrorBoundary.ts
  rm packages/react/src/components/feedback/error-boundary.tsx
  rm packages/react/src/components/demos/prompt-architect/components/PromptArchitectErrorBoundary.tsx
  rm packages/cli/templates/components/error-boundary/ErrorBoundary.tsx
  find examples/ -name "*error-boundary*" -delete
  ```

- [ ] **Step 4:** Update barrel exports

  ```typescript
  // packages/react/src/index.ts
  // REMOVE: export * from './components/feedback/error-boundary'
  ```

- [ ] **Step 5:** Verify ~3,720 LOC removed
  ```bash
  git diff --stat | grep "error"
  pnpm test
  ```

---

### Task 1.6: Logger Consolidation (8 → 3) - 4 hours

- [ ] **Step 1:** Find logger usage

  ```bash
  rg "getLogger|Logger" --type ts -l | grep -v node_modules
  ```

- [ ] **Step 2:** Update to canonical

  ```typescript
  // OLD
  import { logger } from './utils/logger'

  // NEW
  import { getLogger } from '@clarity-chat/utils'
  const logger = getLogger('module-name')
  ```

- [ ] **Step 3:** Keep domain extensions

  ```
  ✅ KEEP: packages/memory/src/audit/audit-logger.ts (AuditLogger)
  ✅ KEEP: packages/error-handling/src/utils/error-logger.ts (ErrorLogger)
  ```

- [ ] **Step 4:** Delete generic duplicates

  ```bash
  rm packages/cli/src/utils/logger.ts
  rm packages/dev-tools/src/debug/logger.ts
  rm packages/memory/src/utils/logger.ts
  rm packages/react/src/utils/logger.ts
  rm packages/react/src/adapters/logging.ts
  rm packages/react/src/audit/audit-logger.ts
  ```

- [ ] **Step 5:** Test logging
  ```bash
  pnpm test
  # Check logs are working correctly
  ```

---

### Task 1.7: Validation Error Consolidation (9 → 5) - 3 hours

- [ ] **Step 1:** Find ValidationError usage

  ```bash
  rg "ValidationError" --type ts -l
  ```

- [ ] **Step 2:** Update to canonical

  ```typescript
  // OLD
  import { ValidationError } from './utils/errors'

  // NEW
  import { ValidationError } from '@clarity-chat/error-handling'
  ```

- [ ] **Step 3:** Keep domain extensions

  ```
  ✅ KEEP: MemoryValidationError
  ✅ KEEP: ToolValidationError
  ✅ KEEP: ConfigValidationError
  ✅ KEEP: CLIValidationError
  ```

- [ ] **Step 4:** Delete generic duplicates

  ```bash
  rm packages/token-optimization/src/errors/index.ts  # ValidationError part
  rm packages/utils/src/errors/validation.ts
  rm packages/cli/src/utils/errors.ts  # ValidationError part
  rm packages/react/src/enterprise/enterprise-errors.ts  # ValidationError part
  ```

- [ ] **Step 5:** Verify domain extensions inherit
  ```typescript
  // Each domain extension should:
  import { ValidationError } from '@clarity-chat/error-handling'
  export class MemoryValidationError extends ValidationError {}
  ```

---

### Task 1.8: Utility Consolidation (40+ → 0) - 3 hours

**cn utility (3 duplicates → 1):**

- [ ] Canonical: `packages/primitives/src/lib/cn.ts`
- [ ] Delete: `primitives/lib/utils.ts` (duplicate cn)
- [ ] Delete: `playground/src/utils/cn.ts`
- [ ] Delete: `react/src/utils/cn.ts`
- [ ] Update imports:
  ```typescript
  import { cn } from '@clarity-chat/primitives'
  ```

**useReducedMotion (4 duplicates → 1):**

- [ ] Canonical: `packages/primitives/src/hooks/use-reduced-motion.ts`
- [ ] Delete: `error-handling/.../use-reduced-motion.ts`
- [ ] Delete: `react/src/accessibility/use-reduced-motion.ts`
- [ ] Delete: `react/src/animations/use-reduced-motion.ts`
- [ ] Update imports:
  ```typescript
  import { useReducedMotion } from '@clarity-chat/primitives'
  ```

**Memory Service types (1 duplicate → 0):**

- [ ] Canonical: `packages/memory/src/memory-service.ts`
- [ ] Delete: `react/src/memory/types.ts` (MemoryServiceConfig duplicate)
- [ ] Update imports:
  ```typescript
  import { MemoryServiceConfig } from '@clarity-chat/memory'
  ```

---

### Phase 1 Sign-Off

**Verification Commands:**

```bash
✅ rg "FastTokenCounter|SimpleTokenCounter" --type ts  # 0 results
✅ rg "MemoryCompressor|LLMLinguaCompressor" --type ts  # Only canonical
✅ rg "import.*from.*hooks/token" --type tsx  # 0 results
✅ pnpm typecheck  # All pass
✅ pnpm test  # All pass
✅ pnpm build:packages  # All build
```

**Metrics:**

- [ ] duplicateApisRemaining: 150 → 7 ✅
- [ ] LOC removed: ~5,000+
- [ ] All tests pass
- [ ] Zero old API references

**Sign-Off:**

```
Engineering Lead: _________________ Date: _______
```

---

## PHASE 2: Update All Consumers (20 Hours)

### Task 2.1: Global Search & Replace (12 hours)

For each consolidated API:

**Token Counters:**

```bash
rg "FastTokenCounter" --type ts -l | xargs sed -i 's/FastTokenCounter/AccurateTokenCounter/g'
rg "SimpleTokenCounter" --type ts -l | xargs sed -i 's/SimpleTokenCounter/AccurateTokenCounter/g'
# Repeat for all old counter types
```

**Cache Implementations:**

```bash
# Update imports
rg "from '../utils/cache'" --type ts -l | xargs sed -i "s|from '../utils/cache'|from '@clarity-chat/utils'|g"
```

**Error Boundaries:**

```bash
# Update imports
rg "import { ErrorBoundary }" --type tsx -l | xargs sed -i "s/{ ErrorBoundary }/{ EnhancedErrorBoundary as ErrorBoundary }/g"
```

**Checklist:**

- [ ] Token counters updated (10 types)
- [ ] Token hooks updated (27 instances)
- [ ] Compression updated (10 instances)
- [ ] Caches updated (30 instances)
- [ ] Error boundaries updated (7 instances)
- [ ] Loggers updated (8 instances)
- [ ] Validation errors updated (9 instances)
- [ ] Utilities updated (40+ instances)

---

### Task 2.2: Update Package Dependencies (8 hours)

**For each package that used duplicates:**

```json
// packages/react/package.json
{
  "dependencies": {
    "@clarity-chat/token-optimization": "workspace:*", // ADD
    "@clarity-chat/memory": "workspace:*", // ADD
    "@clarity-chat/error-handling": "workspace:*", // ADD
    "@clarity-chat/primitives": "workspace:*" // VERIFY
  }
}
```

**Checklist:**

- [ ] packages/react/package.json updated
- [ ] packages/memory/package.json updated
- [ ] packages/cli/package.json updated
- [ ] packages/dev-tools/package.json updated
- [ ] packages/playground/package.json updated
- [ ] All apps/\*/package.json verified
- [ ] Run `pnpm install` to update lockfile
- [ ] Verify no duplicate dependencies

---

## PHASE 3: Remove Dead Code (10 Hours)

### Task 3.1: Delete Duplicate Files (6 hours)

**Verification before deletion:**

```bash
# Ensure zero references before deleting
rg "token-optimizer" packages/react/
# Should return 0 results

# Then delete
rm packages/react/src/memory/token-optimizer.ts
```

**Systematic deletion:**

- [ ] Token optimization duplicates

  ```bash
  rm -rf packages/react/src/utils/tokenization/
  rm -rf packages/react/src/utils/optimization/
  rm packages/react/src/memory/token-optimizer.ts
  ```

- [ ] Compression duplicates

  ```bash
  rm packages/token-optimization/src/compression/dynamic-compression.ts
  ```

- [ ] Cache duplicates

  ```bash
  rm packages/react/src/utils/tokenization/intelligent-caching.ts
  rm packages/memory/src/utils/cache.ts
  ```

- [ ] Error boundaries

  ```bash
  rm packages/react/src/components/feedback/error-boundary.tsx
  find examples/ -name "*error-boundary*" -delete
  ```

- [ ] Loggers

  ```bash
  rm packages/react/src/utils/logger.ts
  rm packages/cli/src/utils/logger.ts
  ```

- [ ] Utilities
  ```bash
  rm packages/playground/src/utils/cn.ts
  rm packages/react/src/utils/cn.ts
  ```

**Post-deletion verification:**

```bash
✅ pnpm build:packages  # All build successfully
✅ git status  # Verify expected files deleted
✅ git diff --stat  # Confirm ~5,000+ LOC removed
```

---

### Task 3.2: Update Barrel Exports (4 hours)

**For each package that exported deleted code:**

```typescript
// packages/react/src/index.ts
// REMOVE these lines:
// export * from './utils/tokenization'
// export * from './utils/optimization'
// export * from './components/feedback/error-boundary'

// ADD re-exports from canonical packages:
export {
  AccurateTokenCounter,
  useTokenCount,
  useTokenOptimization,
} from '@clarity-chat/token-optimization'

export { EnhancedErrorBoundary, ChatErrorBoundary } from '@clarity-chat/error-handling'
```

**Checklist:**

- [ ] packages/react/src/index.ts (public-api.ts) updated
- [ ] packages/memory/src/index.ts updated
- [ ] packages/cli/src/index.ts updated
- [ ] packages/dev-tools/src/index.ts updated
- [ ] Test exports: `pnpm build && node -e "console.log(require('./packages/react/dist'))"`

---

## PHASE 4: Clean APIs & Simplify (30 Hours)

### Task 4.1: Break Circular Dependency (4 hours)

**Problem:** token-optimization → primitives (circular)

**Solution:** Extract UI utils from primitives to utils

```bash
# Move files
mv packages/primitives/src/lib/cn.ts packages/utils/src/ui-helpers/cn.ts
mv packages/primitives/src/lib/glass-variants.ts packages/utils/src/ui-helpers/
mv packages/primitives/src/lib/semantic-gradients.ts packages/utils/src/ui-helpers/
```

**Update imports:**

```typescript
// In token-optimization package:
// OLD: import { cn } from '@clarity-chat/primitives'
// NEW: import { cn } from '@clarity-chat/utils/ui-helpers'
```

**Checklist:**

- [ ] UI utils moved to @clarity-chat/utils
- [ ] All imports updated in token-optimization
- [ ] All imports updated in primitives
- [ ] Verify no circular dependency:
  ```bash
  node scripts/check-circular-deps.js
  # Should return: 0 circular dependencies
  ```
- [ ] All tests pass

---

### Task 4.2: Split primitives/utils.ts (8 hours)

**Current:** 1526 lines, 172 functions in one file **Target:** 8 focused modules

**Create directory structure:**

```bash
mkdir -p packages/primitives/src/lib/utils
```

**Split into modules:**

- [ ] `type-guards.ts` (30 functions)

  ```typescript
  export const isString = (value: unknown): value is string => ...
  export const isNumber = (value: unknown): value is number => ...
  // ... 28 more
  ```

- [ ] `string-utils.ts` (20 functions)

  ```typescript
  export const capitalize = (str: string): string => ...
  export const truncate = (str: string, length: number): string => ...
  // ... 18 more
  ```

- [ ] `array-utils.ts` (15 functions)

  ```typescript
  export const chunk = <T>(array: T[], size: number): T[][] => ...
  export const unique = <T>(array: T[]): T[] => ...
  // ... 13 more
  ```

- [ ] `object-utils.ts` (12 functions)

  ```typescript
  export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => ...
  export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => ...
  // ... 10 more
  ```

- [ ] `html-validators.ts` (40 functions)

  ```typescript
  export const isSVG = (content: string): boolean => ...
  export const isXML = (content: string): boolean => ...
  // ... 38 more
  ```

- [ ] `async-utils.ts` (20 functions)

  ```typescript
  export const retry = async <T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T> => ...
  export const sleep = (ms: number): Promise<void> => ...
  // ... 18 more
  ```

- [ ] `format-utils.ts` (15 functions)

  ```typescript
  export const formatBytes = (bytes: number): string => ...
  export const formatDate = (date: Date): string => ...
  // ... 13 more
  ```

- [ ] `index.ts` (re-export all for compatibility)
  ```typescript
  export * from './type-guards'
  export * from './string-utils'
  export * from './array-utils'
  export * from './object-utils'
  export * from './html-validators'
  export * from './async-utils'
  export * from './format-utils'
  ```

**Verification:**

```bash
✅ rm packages/primitives/src/lib/utils.ts  # Delete old file
✅ pnpm build packages/primitives
✅ pnpm test packages/primitives
✅ Check bundle size (should improve tree-shaking)
```

---

### Task 4.3: Split Large Files >1000 Lines (18 hours)

**File 1: toon-optimizer.ts (1814 lines)**

- [ ] Split into:
  ```
  packages/token-optimization/src/formats/toon/
  ├── parser.ts (400 lines)
  ├── encoder.ts (350 lines)
  ├── validator.ts (300 lines)
  ├── schema.ts (200 lines)
  ├── types.ts (150 lines)
  └── index.ts (50 lines - coordinator)
  ```

**File 2: memory-service.ts (1577 lines)**

- [ ] Split into:
  ```
  packages/memory/src/services/
  ├── memory-cache-service.ts (400 lines)
  ├── memory-persistence-service.ts (350 lines)
  ├── memory-optimization-service.ts (300 lines)
  ├── memory-query-service.ts (300 lines)
  └── memory-service.ts (227 lines - coordinator)
  ```

**File 3-7: Other files >1000 lines**

- [ ] ThemeCustomizer.tsx (1653 lines) → 8 sub-components
- [ ] advanced-message-search.tsx (1417 lines) → shared logic + sub-components
- [ ] tool-executor.ts (1286 lines) → simplify using lru-cache library
- [ ] semantic-cache.ts (1118 lines) → split into cache types
- [ ] tool-registry.ts (1072 lines) → split into registry services

**Verification after each split:**

```bash
✅ pnpm typecheck  # Zero errors
✅ pnpm test  # All pass
✅ git diff --stat  # Verify expected changes
✅ Check complexity: node scripts/check-complexity.js
```

---

## PHASE 5: Tests (20 Hours)

### Task 5.1: Add Codemods Tests (6 hours)

**Currently: 0% coverage (CRITICAL GAP)**

```typescript
// packages/codemods/src/__tests__/v2-migration.test.ts
describe('v2-migration codemod', () => {
  it('migrates FastTokenCounter to AccurateTokenCounter', () => {
    const input = `
      import { FastTokenCounter } from '@clarity-chat/react'
      const counter = new FastTokenCounter()
    `
    const output = runCodemod(input, 'v2-migration')
    expect(output).toContain('AccurateTokenCounter')
    expect(output).toContain('@clarity-chat/token-optimization')
  })

  it('migrates ErrorBoundary to EnhancedErrorBoundary', () => {
    const input = `
      import { ErrorBoundary } from './components/ErrorBoundary'
    `
    const output = runCodemod(input, 'v2-migration')
    expect(output).toContain('EnhancedErrorBoundary as ErrorBoundary')
    expect(output).toContain('@clarity-chat/error-handling')
  })

  // ... 20+ more test cases
})
```

**Checklist:**

- [ ] Test each API migration pattern
- [ ] Test edge cases (nested imports, aliases)
- [ ] Test error handling
- [ ] Coverage ≥80%

---

### Task 5.2: Add GDPR Tests (6 hours)

**Currently: 0% coverage (LEGAL RISK)**

```typescript
// packages/memory/src/__tests__/gdpr-compliance.test.ts
describe('GDPR compliance', () => {
  it('exports user data in machine-readable format', async () => {
    const memory = new MemoryService()
    await memory.addMessage('user-123', { content: 'Hello' })

    const export = await memory.exportUserData('user-123')

    expect(export.format).toBe('JSON')
    expect(export.data.messages).toHaveLength(1)
    expect(export.data.messages[0].content).toBe('Hello')
  })

  it('deletes all user data on request', async () => {
    const memory = new MemoryService()
    await memory.addMessage('user-123', { content: 'Hello' })

    await memory.deleteUserData('user-123')

    const remaining = await memory.getUserMessages('user-123')
    expect(remaining).toHaveLength(0)
  })

  it('anonymizes user data on request', async () => {
    const memory = new MemoryService()
    await memory.addMessage('user-123', { content: 'My name is John', metadata: { email: 'john@example.com' } })

    await memory.anonymizeUserData('user-123')

    const messages = await memory.getUserMessages('user-123')
    expect(messages[0].content).not.toContain('John')
    expect(messages[0].metadata.email).toBe('[REDACTED]')
  })

  // ... 15+ more GDPR tests
})
```

**Checklist:**

- [ ] Test right to access (export)
- [ ] Test right to deletion
- [ ] Test right to anonymization
- [ ] Test consent management
- [ ] Coverage ≥90% (legal requirement)

---

### Task 5.3: Increase Overall Coverage (8 hours)

**Target: 27% → 60%+**

**Focus areas:**

- [ ] Critical paths (chat flow, token management)
- [ ] Error handling edge cases
- [ ] Security features (XSS protection, sanitization)
- [ ] Data integrity (cache, token counts)
- [ ] React hooks (lifecycle, cleanup)

**Priority packages:**

```
1. token-optimization (22% → 60%)
2. utils (25% → 60%)
3. memory (30% → 70%)
4. react (35% → 55%)
```

**Commands:**

```bash
pnpm test --coverage
# Check coverage report
open coverage/index.html
```

---

## PHASE 6: Documentation (15 Hours)

### Task 6.1: Update Deprecated API References (10 hours)

**Currently: 120+ deprecated references**

**Systematic approach:**

```bash
# Find all deprecated API references
rg "FastTokenCounter|SimpleTokenCounter|MemoryCompressor" docs/ apps/ examples/ -l

# For each file:
# 1. Update imports
# 2. Update code examples
# 3. Add migration notes
# 4. Verify example still runs
```

**Checklist:**

- [ ] Getting Started guide
- [ ] API Reference (17 pages)
- [ ] Hook Reference (5 pages)
- [ ] Guides (8 pages)
- [ ] Examples (20+ examples)
- [ ] README files (8 packages)

**Verification:**

```bash
✅ rg "FastTokenCounter" docs/ apps/ examples/  # 0 results
✅ rg "MemoryCompressor" docs/ apps/ examples/  # 0 results
✅ All code examples compile
```

---

### Task 6.2: Create Migration Guides (5 hours)

**Create comprehensive migration documentation:**

````markdown
<!-- docs/migration/v2.0.md -->

# Migration Guide: v1.x → v2.0

## Breaking Changes

### Token Counters

**OLD:**

```typescript
import { FastTokenCounter } from '@clarity-chat/react'
const counter = new FastTokenCounter()
```
````

**NEW:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
```

### Cache Implementations

...

### Error Boundaries

...

## Automatic Migration

Run the codemod:

```bash
npx @clarity-chat/codemods v2-migration
```

## Manual Migration Checklist

- [ ] Update token counter imports
- [ ] Update cache imports
- [ ] Update error boundary imports ...

````

**Checklist:**
- [ ] Migration guide for each breaking change
- [ ] Before/after code examples
- [ ] Automatic codemod instructions
- [ ] Manual migration checklist
- [ ] FAQ section

---

## FINAL VERIFICATION CHECKLIST

### Build & Test
```bash
✅ pnpm install          # No errors
✅ pnpm typecheck        # Zero errors
✅ pnpm lint             # Zero errors
✅ pnpm test             # All pass, ≥60% coverage
✅ pnpm build:packages   # All packages build
✅ pnpm build            # Apps build successfully
````

### API Consolidation

```bash
✅ rg "FastTokenCounter|SimpleTokenCounter" --type ts  # 0 results
✅ rg "MemoryCompressor|LLMLinguaCompressor" --type ts # 0 results
✅ rg "import.*from.*hooks/token" --type tsx           # 0 results
✅ node scripts/verify-duplicates.js                  # duplicateApisRemaining == 7
```

### Security

```bash
✅ node scripts/scan-secrets.js                       # 0 secrets found
✅ node scripts/test-xss-protection.js                # All vectors blocked
✅ pnpm audit                                         # 0 critical/high
✅ node scripts/security-regression-test.js           # 100% pass
```

### Data Integrity

```bash
✅ node scripts/verify-cache-migration.js             # 100% match
✅ node scripts/verify-token-counts.js                # <5% divergence
✅ node scripts/compare-validation-snapshots.js       # 0 differences
✅ node scripts/verify-error-handlers.js              # All preserved
```

### Performance

```bash
✅ ANALYZE=true pnpm build                            # Bundle ≤500KB
✅ node scripts/lighthouse-ci.js                      # Score ≥85
✅ node scripts/check-web-vitals.js                   # LCP <2.5s, FID <100ms
```

### Documentation

```bash
✅ rg "FastTokenCounter" docs/ apps/ examples/        # 0 results
✅ All code examples compile
✅ Migration guide complete
✅ API reference updated
```

---

## SIGN-OFF MATRIX

| Stakeholder        | Phase             | Status | Date   | Signature  |
| ------------------ | ----------------- | ------ | ------ | ---------- |
| Security Lead      | Security Fixes    | [ ]    | **\_** | ****\_**** |
| Engineering Lead   | API Consolidation | [ ]    | **\_** | ****\_**** |
| QA Lead            | Testing           | [ ]    | **\_** | ****\_**** |
| Documentation Lead | Documentation     | [ ]    | **\_** | ****\_**** |
| Product Lead       | Final Approval    | [ ]    | **\_** | ****\_**** |

---

## PROGRESS TRACKING

**Update this section weekly:**

```
Week 1: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - Security Day 1-2
Week 2: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - Security Day 3-9
Week 3: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - API Consolidation 1.1-1.4
Week 4: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - API Consolidation 1.5-1.8
Week 5: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - Consumer Updates + Dead Code
Week 6: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - Architecture Cleanup
Week 7: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - Testing
Week 8: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0% - Documentation + Sign-off

Overall: [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0/144 hours
```

**Last Updated:** 2026-01-27

---

## REFERENCES

- [Full Report](./FINAL_CONSOLIDATED_AUDIT_REPORT.md)
- [Executive Summary](./EXECUTIVE_SUMMARY.md)
- [Dashboard](./AUDIT_DASHBOARD.md)
- [Security Summary](./.packages-audit/SECURITY_SUMMARY.md)
- [Remediation Plan](./.packages-audit/plan.md)
- [API Decisions](./.api-dx-audit/decisions.md)

---

**NEXT ACTION:** Schedule security team meeting for Week 1 planning

**Status:** 🔴 Ready to Begin (Awaiting Approval)
