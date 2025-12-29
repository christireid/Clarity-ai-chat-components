# Token Optimization Architecture Map

**Audit Date:** 2025-12-29 **Auditor:** Staff+ AI Product Engineer **Objective:** Map all token
optimization functionality to enable rigorous measurement

---

## Executive Summary

This codebase contains **extensive** token optimization infrastructure across multiple packages.
However, **critical gaps exist**:

1. **No provider-billed token instrumentation** - All "savings" are based on client-side estimates
2. **Multiple conflicting estimation methods** - 3+ different char/token ratios used inconsistently
3. **No A/B testing infrastructure** - Cannot prove optimizations reduce actual spend
4. **Placebo optimization risk** - Frontend optimizations may not reduce provider-billed tokens

---

## Package Structure

### 1. `packages/token-optimization/` (Dedicated Package)

| File                                     | Purpose                           | Optimization Technique                                                   |
| ---------------------------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `src/tokenizers/advanced-counter.ts`     | Token counting with gpt-tokenizer | Uses `encode()` from gpt-tokenizer for GPT models, heuristics for others |
| `src/tokenizers/simple-counter.ts`       | Simple char-ratio counting        | ~4 chars/token                                                           |
| `src/compression/basic-engine.ts`        | Basic text compression            | Filler removal, deduplication                                            |
| `src/compression/dynamic-compression.ts` | Quality-aware compression         | Adaptive compression with quality gates                                  |
| `src/compression/advanced-engine.ts`     | LLMLingua-style compression       | Selective context, token pruning                                         |
| `src/caching/advanced-cache.ts`          | Context caching                   | Semantic similarity matching                                             |
| `src/caching/advanced-semantic-cache.ts` | Semantic response caching         | Embedding-based cache lookup                                             |
| `src/routing/simple-router.ts`           | Model routing                     | Route simple queries to cheaper models                                   |
| `src/routing/intelligent-routing.ts`     | Advanced routing                  | Cost/quality tradeoff routing                                            |
| `src/cost/cost-aware-optimizer.ts`       | Budget management                 | Token budget allocation                                                  |
| `src/quality/quality-gate.ts`            | Quality preservation              | 85% minimum quality threshold                                            |
| `src/formats/toon-optimizer.ts`          | TOON format                       | JSON → TOON conversion (claimed 30-60% savings)                          |
| `src/unified-optimizer.ts`               | Combined optimizer                | Orchestrates all techniques                                              |

### 2. `packages/react/src/utils/tokenization/` (React Utils)

| File                         | Purpose                | Issues Found                                                    |
| ---------------------------- | ---------------------- | --------------------------------------------------------------- |
| `estimator.ts`               | Centralized estimation | Uses 4 chars/token (OpenAI), 3.8 (Claude) - **ESTIMATION ONLY** |
| `accurate-counter.ts`        | Tiktoken integration   | Claims accurate counting but falls back to estimation           |
| `smart-fallback.ts`          | Fallback strategies    | Multiple fallback paths obscure true counts                     |
| `token-budget-validator.ts`  | Budget validation      | Validates against estimates, not provider usage                 |
| `text-compression.ts`        | Text compression       | Semantic/extractive compression                                 |
| `intelligent-caching.ts`     | Multi-level caching    | L1/L2/L3 cache hierarchy                                        |
| `smart-truncation.ts`        | Smart truncation       | Semantic-aware truncation                                       |
| `dynamic-optimization.ts`    | Dynamic optimization   | Model-specific optimization                                     |
| `adaptive-optimizer.ts`      | Adaptive optimization  | Learns from usage patterns                                      |
| `optimization-middleware.ts` | Request middleware     | Intercepts requests for optimization                            |

### 3. `packages/react/src/hooks/token/` (React Hooks)

| Hook                                  | Purpose                  | Status                  |
| ------------------------------------- | ------------------------ | ----------------------- |
| `use-token-optimization.tsx`          | Legacy optimization hook | **DEPRECATED**          |
| `use-token-optimization-enhanced.tsx` | Enhanced optimization    | Current primary hook    |
| `use-token-tracker.tsx`               | Token tracking           | Tracks estimated tokens |
| `use-token-budget-monitor.tsx`        | Budget monitoring        | Monitors against budget |

### 4. `packages/react/src/utils/optimization/` (Core Optimization)

| File                      | Purpose                     | Techniques                                                              |
| ------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| `token-optimization.ts`   | Main optimization utilities | Prompt shortening, history limiting, caching, throttling, model routing |
| `prompt-compression.ts`   | Prompt compression          | LLMLingua-style compression                                             |
| `llmlingua-compressor.ts` | Intelligent compression     | Perplexity-based pruning                                                |
| `smart-cache.ts`          | Smart caching               | Semantic similarity cache                                               |
| `response-prefilling.ts`  | Response prefilling         | Skip preambles with prefill                                             |
| `prompt-structure.ts`     | Prompt restructuring        | Question-at-end pattern                                                 |

### 5. `packages/react/src/utils/toon/` (TOON Format)

| File           | Purpose           | Claimed Savings           |
| -------------- | ----------------- | ------------------------- |
| `encoder.ts`   | JSON → TOON       | 30-60% on structured data |
| `decoder.ts`   | TOON → JSON       | N/A                       |
| `optimizer.ts` | Auto-optimization | Decides JSON vs TOON      |

### 6. `packages/memory/` (Memory Management)

| File                                   | Purpose                 |
| -------------------------------------- | ----------------------- |
| `src/utils/token-counter.ts`           | Memory-specific counter |
| `src/compression/truncate-strategy.ts` | Truncation strategies   |
| `src/context/token-budget.ts`          | Budget management       |

---

## Token Estimation Methods (CONFLICT ANALYSIS)

### Method 1: Character Ratio (Most Common)

```typescript
// packages/react/src/utils/tokenization/estimator.ts
const MODEL_CHAR_RATIOS = {
  'gpt-4': 4,
  'claude-3-opus': 3.8,
  // ... etc
}
return Math.ceil(text.length / ratio)
```

**Problem:** Pure estimate, varies by content type (code vs prose)

### Method 2: gpt-tokenizer (Advanced Counter)

```typescript
// packages/token-optimization/src/tokenizers/advanced-counter.ts
import { encode } from 'gpt-tokenizer'
count = encode(text).length
```

**Problem:** Only works for GPT models, falls back to heuristics for Claude/Gemini

### Method 3: Memory Package Counter

```typescript
// packages/memory/src/utils/token-counter.ts
static readonly AVG_CHARS_PER_TOKEN = 4
return Math.ceil(text.length / this.AVG_CHARS_PER_TOKEN)
```

**Problem:** Hardcoded 4 chars/token, ignores model differences

### Method 4: React Tokenizer

```typescript
// packages/react/src/prompt/core/tokenizer.ts
const adjusted = text.replace(/\s+/g, ' ').trim()
return Math.ceil(adjusted.length / this.charsPerToken)
```

**Problem:** Different whitespace handling than other methods

---

## Optimization Techniques (VERIFICATION STATUS)

| Technique           | Claimed Savings | Verification Status                                    |
| ------------------- | --------------- | ------------------------------------------------------ |
| Prompt Shortening   | 10-20%          | ❌ UNVERIFIED - estimates only                         |
| History Limiting    | Variable        | ❌ UNVERIFIED - truncation may reduce quality          |
| TOON Format         | 30-60%          | ❌ UNVERIFIED - never tested with provider             |
| Response Caching    | 50-90%          | ⚠️ PARTIAL - cache hits save, but semantics may differ |
| Semantic Caching    | 80%+            | ❌ UNVERIFIED - similarity threshold is configurable   |
| Prompt Compression  | 30-50%          | ❌ UNVERIFIED - quality impact unknown                 |
| Model Routing       | 20-50%          | ⚠️ PARTIAL - cost savings real if routing is correct   |
| PII Redaction       | ~5 tokens/PII   | ❌ UNVERIFIED - may cause model confusion              |
| Response Prefilling | 10-20 tokens    | ⚠️ PARTIAL - depends on provider support               |
| Prompt Structure    | Unknown         | ❌ UNVERIFIED - attention pattern claims               |

---

## Critical Gaps Identified

### GAP 1: No Provider Token Instrumentation

- **Current State:** All "token counts" are client-side estimates
- **Impact:** Cannot verify if optimizations reduce actual provider billing
- **Fix Required:** Capture `usage.prompt_tokens` and `usage.completion_tokens` from provider
  responses

### GAP 2: No Before/After Comparison Framework

- **Current State:** Tests only verify optimization runs, not that it saves tokens
- **Impact:** Cannot A/B test optimizations
- **Fix Required:** Build measurement harness with toggle to disable all optimizations

### GAP 3: Inconsistent Token Counting

- **Current State:** 4+ different estimation methods used
- **Impact:** "Savings" calculated differently in different components
- **Fix Required:** Standardize on single counting method, validate against provider

### GAP 4: No Quality Gates in Production

- **Current State:** QualityGate exists but not wired into main optimization path
- **Impact:** Aggressive optimization may degrade response quality
- **Fix Required:** Add quality regression detection

### GAP 5: No Cost Tracking

- **Current State:** Cost calculations exist but not persisted/aggregated
- **Impact:** Cannot calculate ROI of optimization features
- **Fix Required:** Persist cost data, calculate before/after

---

## File Paths Summary (All Token-Related)

```
packages/token-optimization/
├── src/
│   ├── tokenizers/advanced-counter.ts      # gpt-tokenizer integration
│   ├── tokenizers/simple-counter.ts        # Simple estimation
│   ├── compression/*.ts                    # Compression engines
│   ├── caching/*.ts                        # Caching strategies
│   ├── routing/*.ts                        # Model routing
│   ├── cost/*.ts                           # Cost management
│   ├── quality/*.ts                        # Quality gates
│   ├── formats/*.ts                        # TOON format
│   └── unified-optimizer.ts                # Main orchestrator

packages/react/src/
├── utils/tokenization/
│   ├── estimator.ts                        # CENTRAL estimator
│   ├── accurate-counter.ts                 # Tiktoken wrapper
│   ├── smart-fallback.ts                   # Fallback strategies
│   └── *.ts                                # Other utilities
├── utils/optimization/
│   ├── token-optimization.ts               # Main optimization utils
│   ├── prompt-compression.ts               # Compression
│   └── *.ts                                # Other optimizations
├── utils/toon/
│   ├── encoder.ts                          # JSON → TOON
│   ├── decoder.ts                          # TOON → JSON
│   └── optimizer.ts                        # Auto-optimization
├── hooks/token/
│   ├── use-token-optimization.tsx          # DEPRECATED
│   └── use-token-optimization-enhanced.tsx # PRIMARY HOOK
└── memory/token-optimizer.ts               # Memory-specific

packages/memory/
├── src/utils/token-counter.ts              # Memory counter
├── src/context/token-budget.ts             # Budget context
└── src/compression/truncate-strategy.ts    # Truncation
```

---

## Next Steps (Instrumentation Plan)

1. **Create Token Audit Harness** (`packages/token-optimization/audit/`)
   - Intercept all provider requests
   - Capture actual `usage` from responses
   - Log before/after optimization payloads
   - Calculate real savings vs estimated savings

2. **Build Test Scenarios**
   - 20+ representative conversation flows
   - Adversarial "token bomb" scenarios
   - Edge cases (empty, huge, code-heavy)

3. **Run Baseline Measurements**
   - All optimizations OFF
   - Capture provider-billed tokens

4. **Run Optimized Measurements**
   - All optimizations ON
   - Compare to baseline

5. **Identify Real vs Placebo Optimizations**
   - Any optimization that doesn't reduce provider tokens = FAILURE

---

**Document Status:** PHASE 0 COMPLETE **Next Phase:** Build Token Audit Instrumentation Harness
