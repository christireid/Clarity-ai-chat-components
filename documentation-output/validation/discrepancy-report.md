# @clarity-chat/token-optimization - Discrepancy Report

**Generated:** 2026-01-28
**Package Version:** 1.0.0
**Total APIs Analyzed:** 230+
**Token Optimization APIs:** 22 core APIs

---

## Executive Summary

✅ **Strengths:**
- Comprehensive type definitions with strict TypeScript
- Clear separation of concerns across modules
- Well-documented value proposition (50-70% cost reduction)
- Multiple entry points (index, react, compression, cache subpaths)
- Backward compatibility maintained with deprecation notices

⚠️ **Documentation Gaps:**
- Missing before/after token count examples for compression strategies
- No live demos for cost calculations
- Provider caching examples need API integration context
- React component props need comprehensive examples
- Missing cookbook recipes for common optimization patterns

🔍 **Clarification Needed:**
- Exact formula for complexity analysis weights
- Semantic similarity threshold tuning guidance
- Memory vs. computation trade-offs for each strategy
- When to use TieredCache vs. AdvancedSemanticCache
- Provider caching "90% savings" claim - needs breakdown

---

## 1. Missing Documentation

### HIGHEST Priority (Token Optimization Core)

#### AccurateTokenCounter
- ❌ **Missing:** Performance benchmarks vs. tiktoken
- ❌ **Missing:** Bundle size comparison chart
- ❌ **Missing:** Cache hit rate statistics
- ❌ **Missing:** Memory usage patterns
- ✅ **Has:** Basic usage example
- ⚠️ **Needs:** Multi-model comparison table

#### TieredCache
- ❌ **Missing:** Cache tier fallback diagram
- ❌ **Missing:** Hit rate distribution by tier
- ❌ **Missing:** Performance comparison vs. single-tier
- ❌ **Missing:** Memory consumption per tier
- ❌ **Missing:** Configuration decision tree
- ✅ **Has:** Basic API documentation
- ⚠️ **Needs:** When to use exact vs. smart vs. semantic

#### AdvancedSemanticCache
- ❌ **Missing:** Embedding cost calculation
- ❌ **Missing:** Similarity threshold tuning guide
- ❌ **Missing:** Trade-off analysis (accuracy vs. cost)
- ❌ **Missing:** Cache warming strategies
- ❌ **Missing:** Vector database integration examples
- ✅ **Has:** Config interface
- ⚠️ **Needs:** Real-world hit rate examples

#### LLMLinguaCompressor
- ❌ **Missing:** Quality vs. compression ratio chart
- ❌ **Missing:** Language-specific performance
- ❌ **Missing:** Content type recommendations
- ❌ **Missing:** Before/after examples with token counts
- ❌ **Missing:** Quality metrics explanation
- ✅ **Has:** Options interface
- ⚠️ **Needs:** When to use aggressive vs. conservative

#### ExtractiveCompressor
- ❌ **Missing:** Sentence scoring algorithm details
- ❌ **Missing:** Comparison with LLMLingua
- ❌ **Missing:** Best use cases
- ❌ **Missing:** Quality metrics
- ✅ **Has:** Basic API
- ⚠️ **Needs:** Content type suitability guide

#### AdaptiveCompressor
- ❌ **Missing:** Strategy selection logic flowchart
- ❌ **Missing:** Content analysis criteria
- ❌ **Missing:** Override options
- ❌ **Missing:** Performance characteristics
- ✅ **Has:** Auto-selection
- ⚠️ **Needs:** How strategy is chosen

#### ProviderCachingFormatter
- ❌ **Missing:** Provider API integration examples
- ❌ **Missing:** "90% savings" breakdown and proof
- ❌ **Missing:** Cache control header examples per provider
- ❌ **Missing:** Cost comparison table
- ❌ **Missing:** Cache hit rate expectations
- ⚠️ **Critical:** Users need to understand this only formats, doesn't make API calls
- ⚠️ **Needs:** Complete working example with Anthropic, OpenAI, Google

#### ModelRouter
- ❌ **Missing:** Complexity detection algorithm
- ❌ **Missing:** Model tier configuration examples
- ❌ **Missing:** Routing decision tree
- ❌ **Missing:** Cost savings calculation
- ❌ **Missing:** Fallback behavior
- ✅ **Has:** Builder pattern
- ⚠️ **Needs:** Real-world routing scenarios

#### ComplexityAnalyzer
- ❌ **Missing:** Complexity factor weights
- ❌ **Missing:** Example prompts with complexity scores
- ❌ **Missing:** Calibration guide
- ❌ **Missing:** Custom weight configuration
- ⚠️ **Needs:** How to tune for specific domains

#### CostTracker
- ❌ **Missing:** Savings calculation methodology
- ❌ **Missing:** Real-time vs. batch tracking
- ❌ **Missing:** Dashboard integration examples
- ❌ **Missing:** Export/reporting formats
- ⚠️ **Needs:** ROI demonstration examples

### MEDIUM Priority (Integration & Components)

#### useTokenCount
- ❌ **Missing:** Debouncing behavior examples
- ❌ **Missing:** Performance optimization tips
- ❌ **Missing:** Error handling patterns
- ✅ **Has:** Basic hook API

#### useTokenOptimization
- ❌ **Missing:** Comprehensive configuration guide
- ❌ **Missing:** Feature enablement examples
- ❌ **Missing:** Integration with other hooks
- ⚠️ **Needs:** Full pipeline example

#### TokenCostPreview
- ❌ **Missing:** Styling customization
- ❌ **Missing:** Layout variants
- ❌ **Missing:** Accessibility features
- ❌ **Missing:** Loading states

#### TokenOptimizationBadge
- ❌ **Missing:** Theming guide
- ❌ **Missing:** Placement recommendations
- ❌ **Missing:** Animation options
- ⚠️ **Needs:** Usage in documentation context

#### TokenOptimizationDashboard
- ❌ **Missing:** Data source integration
- ❌ **Missing:** Real-time updates
- ❌ **Missing:** Export functionality
- ❌ **Missing:** Mobile responsive behavior

#### ToonOptimizer
- ❌ **Missing:** TOON format specification
- ❌ **Missing:** Comparison with MessagePack/CBOR
- ❌ **Missing:** Schema validation examples
- ❌ **Missing:** "30-60% savings" proof with examples
- ⚠️ **Needs:** When to use vs. JSON

### LOW Priority (Utilities & Advanced)

#### TextChunker
- ❌ **Missing:** Strategy comparison table
- ❌ **Missing:** Chunk size recommendations
- ✅ **Has:** Basic API

#### CircuitBreaker
- ❌ **Missing:** Threshold tuning guide
- ❌ **Missing:** Recovery strategies
- ✅ **Has:** Config interface

#### QualityGate
- ❌ **Missing:** Metrics explanation
- ❌ **Missing:** Threshold recommendations
- ✅ **Has:** Basic usage

---

## 2. Unclear Types

### Type Definitions Needing Clarification

#### `TokenUsage` (Multiple Definitions)
**Issue:** Three different `TokenUsage` types in different modules:
- `analytics/cost-calculator.ts` - `AnalyticsTokenUsage`
- `hooks/use-token-budget-monitor.ts` - `TokenUsage` (deprecated)
- `budget/memory-budget.ts` - `MemoryTokenUsage`

**Resolution Needed:**
- ✅ Aliasing in place: `AnalyticsTokenUsage` is canonical
- ⚠️ Document deprecation migration path
- ⚠️ Add JSDoc warnings to deprecated types

#### `CacheStats` (Overloaded)
**Issue:** Two different `CacheStats` interfaces:
- `tokenizers/accurate-counter.ts` - `TokenCacheStats`
- `cache/tiered-cache.ts` - `TieredCacheStats`

**Resolution Needed:**
- ✅ Already aliased
- ⚠️ Consider renaming for clarity

#### `CostCalculation` vs. `CostEstimate`
**Issue:** Similar but distinct types:
- `models/model-pricing.ts` - `CostCalculation` (actual cost)
- `cost/cost-aware-optimizer.ts` - `CostEstimate` (projected cost)

**Resolution Needed:**
- ⚠️ Document semantic difference
- ⚠️ Add examples showing when to use each

#### `RoutingResult` Return Type
**Issue:** `estimatedCost` is optional but not documented when it's undefined

**Resolution Needed:**
- ⚠️ Document when cost is unavailable
- ⚠️ Add fallback behavior examples

#### `SemanticCacheResult.similarity`
**Issue:** Similarity score range not documented

**Resolution Needed:**
- ⚠️ Document range: 0-1 (0 = no match, 1 = exact)
- ⚠️ Document relationship to `similarityThreshold`

#### `CompressionResult` Quality Metrics
**Issue:** Quality metrics vary by strategy but interface is generic

**Resolution Needed:**
- ⚠️ Document which metrics are available per strategy
- ⚠️ Add discriminated union for strategy-specific metrics

---

## 3. Ambiguous APIs

### Functions/Methods Needing Clarification

#### `estimateTokens` vs. `countTokens`
**Issue:** Unclear when to use estimation vs. counting

**Clarification Needed:**
```typescript
// When should I use...
estimateTokens(text)  // Fast approximation?
countTokens(text)     // Accurate counting?
providerNativeCount(text) // 100% accurate?
```

**Resolution:**
- ⚠️ Add decision tree to docs
- ⚠️ Document accuracy vs. performance trade-offs
- ⚠️ Recommend defaults per use case

#### `TieredCache.get()` - Cache Miss Behavior
**Issue:** Returns `null` on miss, but doesn't indicate which tier was hit

**Clarification Needed:**
```typescript
const result = await cache.get(key)
// result.tier = 'exact' | 'smart' | 'semantic' | null?
// How do I know which tier was hit?
```

**Resolution:**
- ✅ Result includes `tier` property
- ⚠️ Document in API reference
- ⚠️ Add example reading tier

#### `ModelRouter.route()` - Fallback Logic
**Issue:** Fallback behavior not documented

**Clarification Needed:**
- When does fallback trigger?
- Can I customize fallback logic?
- What happens if fallback also fails?

**Resolution:**
- ⚠️ Document fallback triggers
- ⚠️ Add configuration examples
- ⚠️ Document error handling

#### `compressAdaptively` - Strategy Selection
**Issue:** Strategy selection algorithm is a black box

**Clarification Needed:**
```typescript
const result = await compressAdaptively(text)
// How was strategy chosen?
// Can I see the decision reasoning?
// Can I override?
```

**Resolution:**
- ⚠️ Document content analysis factors
- ⚠️ Add `debug` option to see reasoning
- ⚠️ Allow manual override

#### Provider Caching - Message Formatting
**Issue:** Which messages get cache control headers?

**Clarification Needed:**
```typescript
formatMessagesForProviderCaching(messages, 'anthropic')
// Which messages are marked for caching?
// Can I customize cache breakpoints?
// What's the default behavior?
```

**Resolution:**
- ⚠️ Document default heuristics
- ⚠️ Show cache control placement
- ⚠️ Add configuration examples

---

## 4. Areas Needing Expansion

### 4.1 Before/After Examples

**Missing for ALL token optimization APIs:**

Each token optimization API should have:
```markdown
## Before/After Comparison

### Without Optimization
```typescript
// ❌ 1,247 tokens, $0.025 cost
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: longConversation
})
```

### With @clarity/token-optimization
```typescript
// ✅ 623 tokens (50% reduction), $0.013 cost (48% savings)
const optimized = await cache.get(prompt)
const response = await openai.chat.completions.create({
  model: router.route(prompt).model,
  messages: optimized || longConversation
})
```

### Savings Breakdown
| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Tokens | 1,247 | 623 | -50% |
| Cost | $0.025 | $0.013 | -48% |
| Latency | 2.3s | 1.1s | -52% |
```

**Needed for:**
- All cache implementations
- All compression strategies
- Model router
- Provider caching
- TOON optimizer

### 4.2 Live Demos

**Missing interactive demonstrations:**

1. **Token Calculator**
   - Input: Text field
   - Output: Real-time token count, cost for multiple models
   - Feature: Compare models side-by-side

2. **Savings Dashboard**
   - Input: Usage scenario (requests/day, avg tokens)
   - Output: Monthly cost with/without optimization
   - Feature: Interactive sliders for parameters

3. **Compression Comparison**
   - Input: Sample text
   - Output: Side-by-side comparison of strategies
   - Feature: Quality score, token reduction, visual diff

4. **Cache Hit Simulator**
   - Input: Query patterns
   - Output: Predicted hit rates for exact/smart/semantic
   - Feature: Tune similarity threshold

5. **Model Router Playground**
   - Input: Sample prompts
   - Output: Routing decisions with reasoning
   - Feature: Customize complexity weights

### 4.3 Cookbooks

**Missing practical recipes:**

1. **"Achieving 50% Token Reduction"**
   - Scenario: Chat application with memory
   - Strategy: TieredCache + ExtractiveCompressor + ModelRouter
   - Implementation: Step-by-step guide
   - Result: Measured savings

2. **"Provider Caching for 90% Savings"**
   - Scenario: Multi-turn conversations with system prompts
   - Strategy: Format messages for Anthropic/OpenAI caching
   - Implementation: Complete working example
   - Result: Cost breakdown

3. **"Smart Model Routing"**
   - Scenario: Mixed simple/complex queries
   - Strategy: ComplexityAnalyzer + ModelRouter
   - Implementation: Configuration guide
   - Result: Cost savings per complexity tier

4. **"JSON to TOON Migration"**
   - Scenario: API with structured data
   - Strategy: ToonOptimizer for requests/responses
   - Implementation: Migration steps
   - Result: 30-60% token reduction

5. **"Enterprise Compression Pipeline"**
   - Scenario: Large document processing
   - Strategy: AdaptiveCompressor + Chunking + Caching
   - Implementation: Robust setup
   - Result: Cost at scale

### 4.4 Configuration Guides

**Missing decision trees:**

1. **Cache Strategy Selection**
```
Need caching? → Yes
  ↓
Queries mostly identical? → Yes → ExactCache
  ↓ No
Queries similar but not identical? → Yes → SmartCache
  ↓ No
Semantically similar queries? → Yes → SemanticCache
  ↓ No
Need all tiers? → Yes → TieredCache
```

2. **Compression Strategy Selection**
```
What content type?
  ↓
Long documents? → Yes → LLMLingua (2-20x)
  ↓ No
Structured data? → Yes → TOON (30-60%)
  ↓ No
Natural text? → Yes → Extractive (2-5x)
  ↓ No
Mixed content? → Yes → Adaptive (auto-select)
```

3. **Model Routing Configuration**
```
What's your priority?
  ↓
Cost optimization? → strategy: 'cost-optimized'
  ↓
Quality first? → strategy: 'quality-optimized'
  ↓
Balance both? → strategy: 'balanced' (default)
```

---

## 5. Technical Clarifications Needed

### 5.1 Complexity Analysis

**Question:** How are complexity weights determined?

```typescript
interface ComplexityWeights {
  length: number        // How much does length matter?
  entities: number      // Entity count weight?
  technicalTerms: number // Technical complexity weight?
  structure: number     // Structural complexity weight?
}
```

**Clarification Needed:**
- Default weight values
- Tuning recommendations
- Domain-specific adjustments
- Examples of weight impact

### 5.2 Semantic Similarity

**Question:** How is `similarityThreshold` tuned?

```typescript
interface SemanticCacheConfig {
  similarityThreshold: number // Default 0.92 - why?
}
```

**Clarification Needed:**
- Threshold impact on hit rate
- Threshold impact on false positives
- Tuning based on use case
- A/B testing recommendations

### 5.3 Provider Caching Claims

**Question:** "90% savings on cached tokens" - how?

**Clarification Needed:**
- Pricing breakdown (cached vs. non-cached)
- Which providers support what levels
- Cache warming strategies
- Hit rate expectations

### 5.4 Compression Quality

**Question:** What do quality metrics mean?

```typescript
interface QualityMetrics {
  coherence: number      // What is coherence?
  informativeness: number // How measured?
  fluency: number        // Subjective or objective?
}
```

**Clarification Needed:**
- Metric definitions
- Scoring methodology
- Acceptable thresholds
- Quality vs. compression trade-off

---

## 6. Export Naming Inconsistencies

### Issues to Resolve

1. **`ProviderCachingManager` (deprecated) vs. `ProviderCachingFormatter`**
   - ⚠️ Deprecation notice in place
   - ⚠️ Need migration guide
   - ⚠️ Document why renamed

2. **`useTokenBudgetMonitor` (deprecated) vs. `useTokenBudgetTracking`**
   - ⚠️ Deprecation in place
   - ⚠️ Need side-by-side comparison
   - ⚠️ Document breaking changes

3. **`applyProviderCaching` (deprecated) vs. `formatMessagesForProviderCaching`**
   - ⚠️ Deprecation in place
   - ⚠️ Need reason documented

4. **`TokenUsage` (deprecated) vs. `TokenBudgetUsage` and `AnalyticsTokenUsage`**
   - ⚠️ Three types with similar names
   - ⚠️ Need clear usage guide

---

## 7. Missing Performance Data

### Benchmarks Needed

#### Bundle Size
- ❌ **Missing:** Actual bundle sizes per subpath
- ❌ **Missing:** Comparison with alternatives (tiktoken, LangChain)
- ⚠️ **Claims:** "5-6x smaller than tiktoken" - need proof

#### Performance
- ❌ **Missing:** Token counting speed benchmarks
- ❌ **Missing:** Cache lookup latency
- ❌ **Missing:** Compression time vs. savings trade-off
- ❌ **Missing:** Memory usage per strategy

#### Accuracy
- ❌ **Missing:** AccurateTokenCounter accuracy vs. tiktoken
- ❌ **Missing:** ProviderNativeCounter validation results
- ❌ **Missing:** Semantic cache false positive rates

#### Savings
- ❌ **Missing:** Real-world savings case studies
- ❌ **Missing:** Cache hit rate distributions
- ❌ **Missing:** Compression quality benchmarks
- ❌ **Missing:** Router cost savings by strategy

---

## 8. Priority Actions

### Critical (Block Documentation Release)

1. ✅ Complete Phase 1 API Truth Map ← **Done**
2. ⚠️ Add before/after examples for all HIGHEST priority APIs
3. ⚠️ Create working examples for ProviderCachingFormatter (with actual API calls)
4. ⚠️ Document "50-70% savings" breakdown with proof
5. ⚠️ Create live demo: Token Calculator
6. ⚠️ Create live demo: Savings Dashboard
7. ⚠️ Write cookbook: "Achieving 50% Token Reduction"
8. ⚠️ Write cookbook: "Provider Caching for 90% Savings"

### High Priority (Complete Before Launch)

9. ⚠️ Document complexity analysis algorithm
10. ⚠️ Document semantic similarity tuning
11. ⚠️ Create decision trees for strategy selection
12. ⚠️ Add performance benchmarks
13. ⚠️ Create live demo: Compression Comparison
14. ⚠️ Create live demo: Model Router Playground
15. ⚠️ Write cookbook: "Smart Model Routing"
16. ⚠️ Write cookbook: "JSON to TOON Migration"

### Medium Priority (Post-Launch Improvements)

17. ⚠️ Add bundle size analysis
18. ⚠️ Add accuracy validation reports
19. ⚠️ Create live demo: Cache Hit Simulator
20. ⚠️ Write cookbook: "Enterprise Compression Pipeline"
21. ⚠️ Add migration guides for deprecated APIs
22. ⚠️ Add troubleshooting section
23. ⚠️ Add FAQ section
24. ⚠️ Add glossary of terms

---

## 9. Recommendation

**READY FOR PHASE 2:** ✅

The source validation is complete. The API surface is well-structured with clear type definitions. The main gaps are in **documentation** (examples, demos, cookbooks), not in the **API design** itself.

**Next Steps:**
1. Proceed to Phase 2: Documentation Analysis
2. Compare old/new docs sites against this truth map
3. Prioritize content generation for HIGHEST priority APIs
4. Focus on before/after examples and live demos

**Token Optimization Prominence:**
- ✅ Clear API separation (HIGHEST priority = optimization)
- ✅ Value proposition well-defined (50-70% savings)
- ⚠️ Need to prove claims with data
- ⚠️ Need to show ROI through examples

---

**Phase 1 Status:** ✅ **COMPLETE**

Ready to proceed to Phase 2: Documentation Analysis.
