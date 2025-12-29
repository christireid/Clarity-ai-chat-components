# Token Waste Findings Report

**Audit Date:** 2025-12-29 **Auditor:** Staff+ AI Product Engineer **Status:** PHASE 6 COMPLETE -
Root causes identified

---

## Executive Summary

Token optimization **WORKS** but **UNDERPERFORMS** claims:

| Preset       | Claimed Savings | Actual Measured                        | Verdict                               |
| ------------ | --------------- | -------------------------------------- | ------------------------------------- |
| Conservative | 10-20%          | 3-5%                                   | ❌ FAILS to meet claim                |
| Balanced     | 20-30%          | 3-5%                                   | ❌ FAILS to meet claim                |
| Aggressive   | 30-60%          | **14%** (overall), **41%** (JSON-only) | ⚠️ PARTIAL - only for structured data |

**Key Finding:** The 30-60% savings claims are **only valid for JSON-heavy content**. For typical
chat (prose, Q&A, code discussions), savings are **3-14%**.

---

## Measured Results

### Test Run Configuration

- **Scenarios:** 27 total (22 deterministic + 5 adversarial)
- **Baseline:** All optimizations OFF
- **Optimized:** All optimizations ON with various presets
- **Trials:** 1 per scenario
- **Model:** GPT-4 (simulated with gpt-tokenizer)

### Aggregate Results

| Run Type               | Mean Input Tokens | Reduction | Effective? |
| ---------------------- | ----------------- | --------- | ---------- |
| Baseline               | 162.3             | -         | -          |
| Balanced               | 156.7             | 3.4%      | ⚠️ Minor   |
| Aggressive             | 139.4             | **14.1%** | ✅ Yes     |
| JSON-only (aggressive) | 4623 from 7826    | **40.9%** | ✅ Yes     |

### Per-Technique Breakdown

| Technique           | Activated?     | Tokens Saved                | % of Total Savings |
| ------------------- | -------------- | --------------------------- | ------------------ |
| History Limiting    | ✅             | 15-50 per long conversation | ~20%               |
| Prompt Compression  | ✅             | 5-20 per long prompt        | ~15%               |
| TOON Format         | ✅ (JSON only) | 30-40% of JSON content      | ~60%               |
| PII Redaction       | ✅             | 0-5 per message with PII    | ~1%                |
| Filler Word Removal | ✅             | 2-10 per casual message     | ~4%                |

---

## Token Waste Drivers (Ranked by Impact)

### 1. **TOON Not Applied to Non-JSON Content (HIGH IMPACT)**

**Problem:** TOON format conversion only works on JSON arrays/objects. Most chat content is prose.

**Evidence:**

- JSON dump scenario: 41% savings
- Structured data scenario: 30% savings
- All other scenarios: <5% savings from TOON

**Root Cause Location:**
`packages/token-optimization/audit/harness/test-runner.ts:applyOptimizations()` - TOON only triggers
on `msg.content.match(/\[[\s\S]*\]|\{[\s\S]*\}/)`

**Fix Required:** Cannot apply TOON to prose. This is a marketing/documentation issue, not a code
bug. Claims should be updated to specify "for structured data only."

### 2. **History Limiting Threshold Too High (MEDIUM IMPACT)**

**Problem:** With `maxHistoryMessages: 10`, optimization only kicks in after 20+ messages. Most
conversations never trigger it.

**Evidence:**

- replay-05-history-pruning: Only saved 15 tokens on turn 11 (when history exceeded 10 pairs)
- All other scenarios: No history limiting applied

**Root Cause Location:**
`packages/react/src/utils/optimization/token-optimization.ts:limitHistory()`

**Fix Required:** Lower default threshold, or implement progressive summarization.

### 3. **Compression Only Removes Basic Filler (MEDIUM IMPACT)**

**Problem:** Current compression only removes simple filler words like "um", "uh", "like",
"basically". This achieves <5% compression on typical content.

**Evidence:**

- replay-03-compression-target input: "I really really want to know, you know, like..."
- Expected: High compression (lots of filler)
- Actual: Only ~10 tokens saved

**Root Cause Location:** `test-runner.ts:applyOptimizations()` line 92-108

**Fix Required:** Implement semantic compression (LLMLingua-style) that preserves meaning while
removing redundancy.

### 4. **No Deduplication of Repeated Content (LOW IMPACT)**

**Problem:** In multi-turn conversations, context is repeated. No deduplication occurs.

**Evidence:**

- adversarial-02-repeated-content: "I need help! " repeated 500 times
- No deduplication applied

**Root Cause:** Not implemented in test harness optimization simulation.

**Fix Required:** Add content deduplication.

### 5. **System Prompts Not Optimized (LOW IMPACT)**

**Problem:** System prompts are passed through unmodified, even when verbose.

**Evidence:**

- replay-04-system-heavy: 105 token system prompt, 10 token user message
- No system prompt optimization applied

**Fix Required:** Implement system prompt caching (Anthropic) or compression.

---

## Gap Analysis: Claimed vs Actual Techniques

| Feature              | Documentation Claims | Implementation Status | Effectiveness          |
| -------------------- | -------------------- | --------------------- | ---------------------- |
| TOON Format          | 30-60% savings       | ✅ Implemented        | ✅ Works (JSON only)   |
| Prompt Compression   | 20-40% savings       | ⚠️ Basic only         | ❌ <5% actual          |
| History Limiting     | Variable             | ✅ Implemented        | ⚠️ High threshold      |
| Semantic Caching     | 80%+ savings         | ⚠️ In hooks only      | ❌ Not in harness      |
| Model Routing        | 20-50% cost savings  | ✅ Implemented        | N/A (cost, not tokens) |
| Response Prefilling  | 10-20 tokens         | ⚠️ Stub only          | ❌ Not measured        |
| Prompt Restructuring | Unknown              | ⚠️ Stub only          | ❌ Not measured        |

---

## Recommendations (Prioritized)

### Priority 1: Fix Documentation Claims (No Code Change)

Update marketing/documentation to accurately state:

- "30-60% savings **on structured JSON data**"
- "10-15% savings on general chat with aggressive optimization"
- "Best results when combining with semantic caching"

### Priority 2: Lower History Limiting Threshold

```typescript
// Current
maxHistoryMessages: 10 // Only kicks in at 20+ messages

// Recommended
maxHistoryMessages: 5 // Kicks in at 10+ messages
tokenBudget: 2000 // Or use token-based limiting
```

### Priority 3: Implement Real LLMLingua Compression

The codebase has `llmlingua-compressor.ts` but it's not properly integrated. Real LLMLingua should
achieve 50%+ compression.

### Priority 4: Add Prompt Caching Integration

For Anthropic Claude, system prompts can be cached with `cache_control`. This saves 100% of repeated
system prompt tokens.

### Priority 5: Add Content Deduplication

Detect and deduplicate repeated content within messages:

```typescript
// Before
'I need help! I need help! I need help!'

// After
'I need help! [repeated 3x]'
```

---

## Files Requiring Changes

1. `packages/token-optimization/audit/harness/test-runner.ts` - Fix optimization simulation
2. `packages/react/src/utils/optimization/token-optimization.ts` - Lower thresholds
3. `packages/react/src/utils/optimization/llmlingua-compressor.ts` - Integrate properly
4. `packages/react/src/hooks/token/use-token-optimization-enhanced.tsx` - Wire up all techniques
5. Documentation - Update savings claims

---

## Next Steps

1. ✅ Document findings (this file)
2. 🔄 Implement Priority 2-3 fixes
3. 🔄 Re-run audit to verify improvements
4. 📋 Produce final scorecard

---

**Document Status:** PHASE 6 COMPLETE **Next Phase:** Implement fixes and re-audit
