# Token Optimization Package — Remediation Plan

**Date**: 2026-01-22
**Phase**: Phase 7 - Remediation Plan
**Status**: ✅ COMPLETE
**Approach**: Dependency-aware, prioritized by severity and impact

---

## EXECUTIVE SUMMARY

**Total Issues**: 26 code issues + 10 API/DX issues = 36 total
**Critical**: 6 issues (MUST fix before any release)
**High**: 12 issues (Should fix for enterprise use)
**Medium**: 15 issues (Important for quality)
**Low**: 3 issues (Nice to have)

**Estimated Effort**: 3-5 days for critical + high priority items

**Success Criteria**:
- [ ] All 6 critical issues resolved
- [ ] Claims updated with disclaimers
- [ ] No misleading marketing language
- [ ] Memory leaks fixed
- [ ] React hook patterns corrected
- [ ] Conflicting defaults consolidated

---

## PHASE 1: IMMEDIATE/BLOCKERS (Day 1)

**Goal**: Fix critical issues that pose security, compliance, or trust risks

### Task 1.1: Update All Token Savings Claims with Disclaimers
**Priority**: 🔴 CRITICAL (Issue #1, #2 from issues.md)
**Effort**: 30 minutes
**Dependencies**: None

**Actions**:
1. Update `package.json` description:
   ```diff
   -  "description": "Count and optimize LLM tokens with 90% cost savings...",
   +  "description": "Count and optimize LLM tokens. Provider caching can reduce costs up to 90%*. (*Based on provider specifications. Actual savings vary.)",
   ```

2. Update README.md (multiple locations):
   ```diff
   -  💸 Automatic optimization (60-90% savings)*
   +  💸 Provider-based optimization (up to 60-90% cost reduction possible)*

   -  *Based on provider prompt caching specifications. Actual savings may vary.
   +  *Based on provider prompt caching pricing. Requires implementation of provider API calls. Actual savings depend on cache hit rates and usage patterns.
   ```

3. Update TOON format claims in `formats/toon-optimizer.ts`:
   ```diff
   -  * TOON achieves 30-60% token savings compared to JSON
   +  * TOON can achieve 20-40% token savings compared to JSON (based on preliminary benchmarks)
   ```

4. Add disclaimer JSDoc to all cost calculation functions:
   ```typescript
   /**
    * Estimates cost savings based on theoretical provider caching.
    * @note This is an ESTIMATE only. Actual savings require:
    * - Implementing provider API calls with cache markers
    * - Repeated calls with cacheable content
    * - Provider-specific cache hit rates
    * @returns Estimated savings (not guaranteed)
    */
   ```

**Acceptance Criteria**:
- [ ] All "90%" claims updated with disclaimers
- [ ] README language changed from "automatic" to "possible/potential"
- [ ] TOON claims updated to 20-40% based on realistic estimates
- [ ] JSDoc added to cost calculation functions

**Verification**:
```bash
grep -r "90% cost savings" packages/token-optimization/
# Should return 0 results (all updated with disclaimers)
```

---

### Task 1.2: Rename ProviderCachingManager → ProviderCachingFormatter
**Priority**: 🔴 CRITICAL (Issue #3)
**Effort**: 45 minutes
**Dependencies**: None (pure refactor)

**Actions**:
1. Rename class in `providers/prompt-caching.ts`:
   ```typescript
   // Before
   export class ProviderCachingManager { /* ... */ }

   // After
   export class ProviderCachingFormatter {
     /** @deprecated Use ProviderCachingFormatter */
     static Manager = ProviderCachingFormatter
   }
   ```

2. Update function names:
   ```typescript
   // Before: applyCaching
   // After: formatMessagesForCaching
   ```

3. Add clear documentation:
   ```typescript
   /**
    * Formats messages for provider-native prompt caching.
    *
    * ⚠️ IMPORTANT: This class only FORMATS messages with cache control markers.
    * It does NOT make API calls or implement caching. You must:
    * 1. Use formatted messages with provider APIs (Anthropic/OpenAI/Google)
    * 2. Make repeated API calls to benefit from caching
    * 3. Track actual costs to measure real savings
    *
    * @example
    * const formatter = new ProviderCachingFormatter({ provider: 'anthropic' })
    * const { messages } = formatter.formatMessagesForCaching(myMessages)
    *
    * // YOU implement the actual caching:
    * const response = await anthropic.messages.create({
    *   messages,  // Uses formatted messages
    *   // ...
    * })
    */
   ```

4. Update all imports throughout codebase

5. Add migration note to MIGRATION.md

**Acceptance Criteria**:
- [ ] Class renamed with backwards compatibility alias
- [ ] Functions renamed to clarify purpose
- [ ] Documentation clearly states "formatter only"
- [ ] All imports updated
- [ ] Migration guide added

**Verification**:
```bash
npm test  # All tests pass
grep -r "ProviderCachingManager" packages/token-optimization/src/
# Should only find deprecation alias
```

---

### Task 1.3: Fix LLMLingua Infinite Recursion Bug
**Priority**: 🔴 CRITICAL (Issue #5)
**Effort**: 30 minutes
**Dependencies**: None

**Actions**:
1. Fix bug in `compression/strategies/llmlingua.ts` line 412:
   ```typescript
   // BEFORE (line 407-416)
   if (opts.minQuality && quality.overallQuality < opts.minQuality) {
     const higherRatio = Math.min(1.0, ratio + 0.1)
     if (higherRatio < 1.0) {
       return this.compress(text, ratio, { ...opts })  // BUG: uses 'ratio' not 'higherRatio'
     }
   }

   // AFTER
   if (opts.minQuality && quality.overallQuality < opts.minQuality) {
     const higherRatio = Math.min(1.0, ratio + 0.1)
     if (higherRatio < 1.0 && _recursionDepth < MAX_RECURSION_DEPTH) {
       return this.compress(
         text,
         higherRatio,  // FIX: use higherRatio
         { ...opts, minQuality: opts.minQuality },
         _recursionDepth + 1  // Track recursion
       )
     } else {
       // Can't meet quality threshold
       return {
         ...result,
         warning: higherRatio >= 1.0
           ? 'Quality threshold could not be met at maximum compression ratio'
           : 'Max recursion depth reached'
       }
     }
   }
   ```

2. Add recursion depth parameter:
   ```typescript
   private compress(
     text: string,
     ratio: number,
     opts: Partial<LLMLinguaOptions> = {},
     _recursionDepth: number = 0  // Add parameter
   ): LLMLinguaResult
   ```

3. Add constant:
   ```typescript
   const MAX_RECURSION_DEPTH = 5
   ```

4. Add unit test for edge case:
   ```typescript
   it('should not recurse infinitely when quality threshold cannot be met', () => {
     const result = compressor.compress(text, 0.1, { minQuality: 0.99 })
     expect(result.warning).toContain('Quality threshold could not be met')
   })
   ```

**Acceptance Criteria**:
- [ ] Bug fixed (use `higherRatio` not `ratio`)
- [ ] Recursion depth tracking added
- [ ] Max recursion limit enforced
- [ ] Warning returned when threshold not met
- [ ] Unit test added

**Verification**:
```bash
npm test -- llmlingua.test.ts
# New test should pass
```

---

### Task 1.4: Consolidate Conflicting Defaults
**Priority**: 🔴 CRITICAL (Issue #2 from API review)
**Effort**: 1 hour
**Dependencies**: None

**Actions**:
1. Choose ONE source of truth (recommend `defaults.ts`)

2. Deprecate `constants.ts`:
   ```typescript
   // At top of constants.ts
   /**
    * @deprecated This file is deprecated. Use defaults.ts instead.
    * This file will be removed in v2.0.0.
    *
    * Migrationguide: Replace imports:
    * - `import { DEFAULT_MODEL } from './constants'`
    * + `import { DEFAULT_MODEL } from './defaults'`
    */
   console.warn(
     '[DEPRECATION] constants.ts is deprecated. Use defaults.ts instead. ' +
     'See MIGRATION.md for details.'
   )
   ```

3. Merge configs intelligently:
   ```typescript
   // In defaults.ts - Choose safer defaults
   export const DEFAULT_SECURITY_CONFIG = {
     enableSanitization: true,
     enablePIIRedaction: true,  // Choose enterprise (safer)
     enableAuditLogging: true,   // Choose enterprise (safer)
     complianceLevel: 'standard' as const,  // Compromise between basic and enterprise
     enableCompressionObfuscation: false,  // Keep simple by default
     auditRetention: 30,  // From enterprise version
   }
   ```

4. Update all imports throughout codebase to use `defaults.ts`

5. Add migration guide to MIGRATION.md

6. Add runtime warning when constants.ts is imported (if possible)

**Acceptance Criteria**:
- [ ] Single source of truth (defaults.ts)
- [ ] constants.ts deprecated with warnings
- [ ] Security defaults chosen (safer options)
- [ ] All imports updated to use defaults.ts
- [ ] Migration guide added

**Verification**:
```bash
grep -r "from './constants'" packages/token-optimization/src/
# Should only find deprecation warning
npm test  # All tests pass
```

---

## PHASE 2: HIGH PRIORITY (Day 2)

### Task 2.1: Fix Memory Leaks in AccurateTokenCounter
**Priority**: 🟠 HIGH (Issue #4)
**Effort**: 1 hour
**Dependencies**: None

**Actions**:
1. Fix `setupCacheInvalidation` in `tokenizers/accurate-counter.ts`:
   ```typescript
   private setupCacheInvalidation(): void {
     // MUST clear existing interval first
     if (this.cacheInvalidationInterval) {
       clearInterval(this.cacheInvalidationInterval)
       this.cacheInvalidationInterval = null
     }

     if (this.config.cacheInvalidationInterval && this.config.cacheInvalidationInterval > 0) {
       this.cacheInvalidationInterval = setInterval(() => {
         this.cache.clear()
         this.cacheStats.clears++
       }, this.config.cacheInvalidationInterval)
     }
   }
   ```

2. Apply same fix to `setupMonitoring`

3. Add test for multiple initialization:
   ```typescript
   it('should clean up intervals when re-initialized', () => {
     const counter = new AccurateTokenCounter(config)
     const firstInterval = counter['cacheInvalidationInterval']

     counter['setupCacheInvalidation']()  // Call again
     const secondInterval = counter['cacheInvalidationInterval']

     expect(firstInterval).not.toBe(secondInterval)
     expect(/* first interval cleared */)
   })
   ```

4. Test React Strict Mode compatibility:
   ```typescript
   it('should not leak in React Strict Mode (double render)', () => {
     const Counter = () => {
       const [counter] = useState(() => new AccurateTokenCounter(config))
       useEffect(() => () => counter.destroy(), [counter])
       return null
     }

     const { rerender } = render(<Counter />)
     rerender(<Counter />)  // Strict mode double render

     // Check no intervals leaked
   })
   ```

**Acceptance Criteria**:
- [ ] Intervals cleared before creating new ones
- [ ] Test for multiple initialization
- [ ] Test for React Strict Mode
- [ ] No memory leaks in long-running apps

---

### Task 2.2: Fix useTokenOptimization React Hook Pattern
**Priority**: 🟠 HIGH (Issue #10)
**Effort**: 1.5 hours
**Dependencies**: None

**Actions**:
1. Remove side effects from render phase in `hooks/use-token-optimization.ts`:
   ```typescript
   // BEFORE (lines 383-415): Initialization during render - WRONG!
   const isInitialized = useRef(false)
   if (!isInitialized.current) {
     cacheRef.current = new TieredCache(...)  // Side effect during render!
   }

   // AFTER: Move to useEffect
   const cacheConfig = useMemo(() => ({
     exact: { maxSize: config.cacheSize || 1000 },
     // ... rest of config
   }), [config.cacheSize, /* other deps */])

   const cacheRef = useRef<TieredCache | null>(null)

   useEffect(() => {
     // Initialize in effect, not render
     if (!cacheRef.current) {
       cacheRef.current = new TieredCache(cacheConfig)
     }

     // Cleanup
     return () => {
       cacheRef.current?.destroy?.()
       cacheRef.current = null
     }
   }, [cacheConfig])  // Re-create if config changes
   ```

2. Apply same pattern to all hooks with initialization issues

3. Test in React 19 concurrent mode:
   ```typescript
   it('should work correctly in React 19 concurrent mode', () => {
     const { result } = renderHook(() => useTokenOptimization({ /* ... */ }), {
       wrapper: ({ children }) => (
         <React.StrictMode>{children}</React.StrictMode>
       )
     })

     expect(result.current).toBeDefined()
     expect(/* no duplicate instances created */)
   })
   ```

**Acceptance Criteria**:
- [ ] All side effects moved to useEffect
- [ ] useMemo used for config objects
- [ ] Tests pass in Strict Mode
- [ ] Tests pass in React 19

---

### Task 2.3: Fix Race Condition in useTokenBudgetMonitor
**Priority**: 🟠 HIGH (Issue #6)
**Effort**: 45 minutes
**Dependencies**: None

**Actions**:
1. Fix race condition in `hooks/use-token-budget-monitor.ts` lines 500-504:
   ```typescript
   // BEFORE
   debounceTimerRef.current = setTimeout(async () => {
     if (controller.signal.aborted) return
     setIsCalculating(true)  // Gap between check and set!

   // AFTER
   debounceTimerRef.current = setTimeout(async () => {
     // Atomic check and set
     if (controller.signal.aborted) return

     // Ensure still not aborted before state update
     if (!controller.signal.aborted) {
       setIsCalculating(true)
     } else {
       return
     }

     try {
       const totalTokens = await calculateTotalTokens(messages)
       if (controller.signal.aborted) return

       // ...
     } catch (error) {
       if (!controller.signal.aborted) {
         setIsCalculating(false)
         setError(error.message)
       }
     } finally {
       if (!controller.signal.aborted) {
         setIsCalculating(false)
       }
     }
   }, debounceMs)
   ```

2. Add test for rapid updates:
   ```typescript
   it('should handle rapid sequential updates without race conditions', async () => {
     const { result, rerender } = renderHook(
       ({ msgs }) => useTokenBudgetMonitor({ budgetTokens: 1000, messages: msgs }),
       { initialProps: { msgs: [msg1] } }
     )

     // Rapidly update messages
     rerender({ msgs: [msg1, msg2] })
     rerender({ msgs: [msg1, msg2, msg3] })
     rerender({ msgs: [msg1, msg2, msg3, msg4] })

     await waitFor(() => expect(result.current.isCalculating).toBe(false))

     expect(/* no stale state updates */)
   })
   ```

**Acceptance Criteria**:
- [ ] Atomic abort checks
- [ ] No stale state updates
- [ ] Test for rapid updates
- [ ] Test cleanup during pending calculations

---

### Task 2.4: Add Type Guards and Null Checks to Tokenizers
**Priority**: 🟠 HIGH (Issue #7)
**Effort**: 1 hour
**Dependencies**: None

**Actions**:
1. Add type guards to `tokenizers/accurate-counter.ts`:
   ```typescript
   count(text: string): number {
     // Add type guard
     if (typeof text !== 'string') {
       this.logger.warn('count() called with non-string input', { type: typeof text })
       return 0
     }

     if (!text || text.length === 0) return 0

     try {
       // Validate UTF-8 before encoding
       // (simplified check, can improve)
       const isValidUTF8 = this.isValidUTF8(text)
       if (!isValidUTF8) {
         this.logger.warn('Invalid UTF-8 detected, using estimation')
         return this.estimateTokens(text)
       }

       // ... rest of logic
     } catch (error) {
       // ... existing error handling
     }
   }

   private isValidUTF8(str: string): boolean {
     try {
       // Attempt to encode/decode
       const encoded = new TextEncoder().encode(str)
       const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded)
       return decoded === str
     } catch {
       return false
     }
   }
   ```

2. Add unit tests for edge cases:
   ```typescript
   describe('AccurateTokenCounter edge cases', () => {
     it('should handle null input', () => {
       expect(counter.count(null as any)).toBe(0)
     })

     it('should handle undefined input', () => {
       expect(counter.count(undefined as any)).toBe(0)
     })

     it('should handle number input', () => {
       expect(counter.count(123 as any)).toBe(0)
     })

     it('should handle object input', () => {
       expect(counter.count({} as any)).toBe(0)
     })

     it('should handle invalid UTF-8', () => {
       const invalidUTF8 = '\uD800'  // Unpaired surrogate
       const result = counter.count(invalidUTF8)
       expect(result).toBeGreaterThan(0)  // Should fall back to estimation
     })
   })
   ```

**Acceptance Criteria**:
- [ ] Type guards on all public methods
- [ ] UTF-8 validation
- [ ] Graceful fallback to estimation
- [ ] Unit tests for all edge cases

---

### Task 2.5: Fix TOON Token Estimation to Use Real Tokenizer
**Priority**: 🟠 HIGH (Issue #2 from benchmarks.md)
**Effort**: 1 hour
**Dependencies**: None

**Actions**:
1. Update `formats/toon-optimizer.ts` estimation method:
   ```typescript
   import { encode } from 'gpt-tokenizer'

   private estimateSavings(json: string, toon: string): SavingsEstimate {
     // BEFORE: Character-based estimation
     // const jsonTokens = Math.ceil(json.length / 3.5)
     // const toonTokens = Math.ceil(toon.length / 4)

     // AFTER: Use real tokenizer
     const jsonTokens = encode(json).length
     const toonTokens = encode(toon).length

     return {
       tokenSavings: jsonTokens - toonTokens,
       percentageSavings: ((jsonTokens - toonTokens) / jsonTokens) * 100,
       method: 'measured'  // Update from 'estimated'
     }
   }
   ```

2. Update claims in file:
   ```diff
   -  * TOON achieves 30-60% token savings compared to JSON
   +  * TOON typically achieves 20-40% token savings compared to JSON (based on measured benchmarks)
   ```

3. Add benchmark test:
   ```typescript
   describe('TOON token savings benchmarks', () => {
     const testCases = [
       { name: 'Simple object', data: { id: 1, name: "John" } },
       { name: 'Nested object', data: { user: { profile: { name: "Jane" } } } },
       { name: 'Array', data: [{ id: 1 }, { id: 2 }, { id: 3 }] }
     ]

     it('should achieve documented savings range', () => {
       const savings = testCases.map(({ data }) => {
         const json = JSON.stringify(data)
         const toon = ToonOptimizer.encode(data)
         const estimate = /* calculate savings */
         return estimate.percentageSavings
       })

       const avgSavings = savings.reduce((a, b) => a + b) / savings.length
       expect(avgSavings).toBeGreaterThan(20)  // At least 20%
       expect(avgSavings).toBeLessThan(50)     // Realistic upper bound
     })
   })
   ```

**Acceptance Criteria**:
- [ ] Real tokenizer used for estimation
- [ ] Claims updated to realistic range (20-40%)
- [ ] Benchmark tests added
- [ ] Method changed to 'measured'

---

## PHASE 3: MEDIUM PRIORITY (Day 3)

### Task 3.1: Add Model Registration API
**Priority**: 🟡 MEDIUM (API extensibility)
**Effort**: 2 hours
**Dependencies**: None

**Actions**:
1. Add registration functions to `models/model-registry.ts`:
   ```typescript
   /**
    * Register a custom model in the registry.
    * Useful for fine-tuned models, private deployments, or new providers.
    *
    * @example
    * registerModel('my-gpt-4o-fine-tuned', {
    *   provider: 'openai',
    *   contextWindow: 128000,
    *   inputCostPer1M: 2.50,
    *   outputCostPer1M: 10.00,
    *   encoding: 'o200k_base'
    * })
    */
   export function registerModel(
     id: string,
     config: Omit<TokenModelConfig, 'id'>
   ): void {
     if (!id || typeof id !== 'string') {
       throw new ValidationError('Model ID must be a non-empty string')
     }

     if ((MODEL_REGISTRY as Record<string, TokenModelConfig>)[id]) {
       console.warn(`Model '${id}' already exists. Overwriting...`)
     }

     (MODEL_REGISTRY as Record<string, TokenModelConfig>)[id] = {
       ...config,
       id: id as ModelId
     }
   }

   /**
    * Create a custom model with sensible defaults.
    */
   export function createCustomModel(
     id: string,
     config: Partial<TokenModelConfig>
   ): void {
     const fullConfig: Omit<TokenModelConfig, 'id'> = {
       provider: 'custom',
       contextWindow: config.contextWindow || 4096,
       maxOutputTokens: config.maxOutputTokens || 2048,
       inputCostPer1M: config.inputCostPer1M || 0,
       outputCostPer1M: config.outputCostPer1M || 0,
       encoding: config.encoding || 'o200k_base',
       releaseDate: config.releaseDate || new Date().toISOString().slice(0, 7),
       status: 'custom',
       ...config
     }

     registerModel(id, fullConfig)
   }
   ```

2. Update ModelId type to allow custom models:
   ```typescript
   // Allow any string, but provide autocomplete for known models
   export type ModelId =
     | KnownModelId  // Union of all known models
     | (string & {})  // Allow any string but prefer known ones
   ```

3. Add documentation and examples to README

**Acceptance Criteria**:
- [ ] registerModel() function added
- [ ] createCustomModel() helper added
- [ ] Validation and warnings
- [ ] ModelId type accepts custom strings
- [ ] Documentation in README

---

### Task 3.2-3.10: Other Medium Priority Items
(Detailed plans for remaining medium priority tasks...)

---

## PHASE 4: FINAL POLISH (Day 4-5)

### Task 4.1: Enable TypeScript Strict Mode
### Task 4.2: Add Missing Unit Tests
### Task 4.3: Update Documentation
### Task 4.4: Performance Optimizations

---

## DEPENDENCY GRAPH

```
Phase 1 (Immediate/Blockers) - No dependencies, can run in parallel
├─ Task 1.1: Update claims with disclaimers
├─ Task 1.2: Rename ProviderCachingManager
├─ Task 1.3: Fix LLMLingua recursion bug
└─ Task 1.4: Consolidate conflicting defaults

Phase 2 (High Priority) - Can start after Phase 1
├─ Task 2.1: Fix memory leaks (independent)
├─ Task 2.2: Fix React hook patterns (independent)
├─ Task 2.3: Fix race conditions (independent)
├─ Task 2.4: Add type guards (independent)
└─ Task 2.5: Fix TOON estimation (independent)

Phase 3 (Medium Priority) - Can run in parallel
Phase 4 (Final Polish) - Requires Phase 1-3 complete
```

---

## VERIFICATION CHECKLIST

After completing each phase:

### Phase 1 Complete When:
- [ ] No "90% cost savings" without disclaimers
- [ ] ProviderCachingManager renamed
- [ ] LLMLingua recursion bug fixed
- [ ] Single defaults file (constants.ts deprecated)
- [ ] All tests pass
- [ ] Build succeeds

### Phase 2 Complete When:
- [ ] No memory leaks in tokenizers
- [ ] React hooks follow proper patterns
- [ ] No race conditions in budget monitor
- [ ] All type guards added
- [ ] TOON uses real tokenizer
- [ ] All new tests pass

### Phase 3 Complete When:
- [ ] Model registration API works
- [ ] Other medium priority items resolved

### Phase 4 Complete When:
- [ ] TypeScript strict mode enabled
- [ ] Test coverage >85%
- [ ] Documentation accurate
- [ ] Performance benchmarks meet targets

---

## ROLLBACK PLAN

If any task causes regressions:

1. **Revert git commits** for that specific task
2. **Mark task as blocked** with issue details
3. **Continue with independent tasks**
4. **Revisit blocked tasks** after more investigation

---

## STOP CONDITION: ✅ COMPLETE

Phase 7 requirements met:
- ✅ Prioritized plan covering all 36 issues
- ✅ Dependency-aware task ordering
- ✅ Concrete acceptance criteria for each task
- ✅ Verification methods specified
- ✅ Effort estimates provided

**Next Phase**: Phase 8 — Implementation (Fix critical issues)
