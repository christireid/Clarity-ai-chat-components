# Deprecated & Incorrect Content List

**Phase 2: Documentation Analysis**
**Generated**: 2026-01-28
**Scope**: apps/streamlined-docs

---

## Summary

**Total Issues**: 12
**Critical**: 3 (incorrect value propositions)
**High**: 5 (outdated APIs, broken links)
**Medium**: 3 (inconsistent terminology)
**Low**: 1 (minor style inconsistencies)

---

## Critical Issues (🔴 Must Fix Immediately)

### 1. Incorrect Savings Claim: "80%+" Instead of "50-70%"

**Severity**: 🔴 CRITICAL
**Impact**: Misrepresents core value proposition
**Locations**:

- `apps/streamlined-docs/app/guides/token-optimization/page.tsx:1`
  - **Current**: `<h1>Save 80%+ on AI Costs</h1>`
  - **Should Be**: `<h1>Reduce AI Costs by 50-70%</h1>`
  - **Subheading**: `<p>Up to 90% with provider caching</p>`

- `apps/streamlined-docs/app/guides/token-optimization/page.tsx:~50`
  - **Current**: Claims "80%+" in introduction paragraph
  - **Should Be**: "50-70% baseline reduction, up to 90% with provider caching"

- `apps/streamlined-docs/app/examples/token-optimization/page.tsx:~150`
  - **Current**: Page description mentions cost reduction but no specific %
  - **Should Add**: Prominently feature "50-70%" in header

**Fix Required**:
```tsx
// ❌ WRONG (current):
<h1 className="text-4xl font-bold">Save 80%+ on AI Costs</h1>

// ✅ CORRECT (should be):
<h1 className="text-4xl font-bold">Reduce AI Costs by 50-70%</h1>
<p className="text-lg text-muted-foreground">
  Up to 90% with provider caching
</p>
```

**Priority**: P0 - Release Blocker
**Effort**: 2 hours (global search and replace + QA)

---

### 2. Real-World Examples: Inconsistent Savings Claims

**Severity**: 🔴 CRITICAL
**Impact**: Undermines credibility of "50-70%" claim
**Location**: `apps/streamlined-docs/app/guides/token-optimization/page.tsx` (Real-World Examples section)

**Issues**:
- Support chatbot example claims "80% savings"
- No breakdown showing HOW 80% was achieved
- Missing baseline costs (before optimization)

**Current Content**:
```tsx
// Support Chatbot Example
<div>
  <h3>Support Chatbot - 80% Cost Reduction</h3>
  <p>Reduced monthly costs from $5,000 to $1,000...</p>
</div>
```

**Should Be**:
```tsx
// Support Chatbot Example
<div>
  <h3>Support Chatbot - 80% Cost Reduction</h3>

  <div className="bg-muted p-4 rounded-lg mb-4">
    <p><strong>Before optimization:</strong> $5,000/month</p>
    <p><strong>After optimization:</strong> $1,000/month</p>
    <p><strong>Total savings:</strong> 80%</p>
  </div>

  <p><strong>Optimization Breakdown:</strong></p>
  <ul>
    <li>Provider caching (system prompts): 60% savings</li>
    <li>Compression (user context): 15% savings</li>
    <li>Smart routing (simple queries): 5% savings</li>
  </ul>

  <p>
    This example shows how combining multiple strategies
    achieves 80% savings, exceeding the 50-70% baseline.
  </p>
</div>
```

**Priority**: P0 - Release Blocker
**Effort**: 3 hours

---

### 3. Provider Caching: "90%" Presented as Only Savings Number

**Severity**: 🔴 CRITICAL
**Impact**: Users may think 90% is baseline, not provider-caching-specific
**Location**: `apps/streamlined-docs/app/guides/token-optimization/page.tsx` (Provider Caching section)

**Issue**: Provider caching section heavily emphasizes "90% cost reduction" without clarifying this is:
1. Only for **cached tokens** (not all tokens)
2. Requires ≥1024 token threshold
3. Works best with static system prompts

**Current Framing**:
```tsx
<h2>Provider Caching - Up to 90% Cost Reduction</h2>
<p>
  All providers offer 90% cost reduction on cached tokens...
</p>
```

**Should Frame As**:
```tsx
<h2>Provider Caching - Up to 90% on Cached Content</h2>

<div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mb-6">
  <p className="font-semibold">⚠️ Important: Provider caching achieves 90% savings on <strong>cached tokens only</strong></p>
  <p>Your overall cost reduction will be 50-70% baseline when combining provider caching with other strategies across all tokens.</p>
</div>

<p>
  Providers offer 90% cost reduction on cached tokens (static content like system prompts)...
</p>
```

**Priority**: P0 - Release Blocker
**Effort**: 2 hours

---

## High Priority Issues (🟡 Should Fix Before Release)

### 4. Missing Deprecation Warnings for DynamicCompressionEngine

**Severity**: 🟡 HIGH
**Impact**: Users may use deprecated APIs
**Location**: N/A (missing from docs)

**Issue**: According to `api-truth-map.json` and package docs (ARCHITECTURE.md), `DynamicCompressionEngine` was deprecated in favor of strategy-based compressors (LLMLingua, Extractive, Adaptive), but no deprecation notice exists in streamlined-docs.

**Required Addition**:
Create deprecation notice page at:
- `apps/streamlined-docs/app/reference/deprecated/dynamic-compression-engine/page.tsx`

**Content Template**:
```markdown
# DynamicCompressionEngine (Deprecated)

> ⚠️ **Deprecated in v1.0.0** - Will be removed in v2.0.0
>
> Use `LLMLinguaCompressor`, `ExtractiveCompressor`, or `AdaptiveCompressor` instead.

## Reason for Deprecation

The original `DynamicCompressionEngine` claimed "70-85% compression" but delivered only 10-30% (mostly whitespace removal). The new strategy-based compressors achieve 2-20x **real** compression with quality monitoring.

## Migration Guide

[Link to TOON Migration Guide]

## Old API (Deprecated)
```typescript
// ❌ Old (deprecated):
const engine = new DynamicCompressionEngine({ targetRatio: 0.5 })
const result = await engine.compress(text)
```

## New API (Recommended)
```typescript
// ✅ New (recommended):
import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

const result = await compressWithLLMLingua(text, {
  targetRatio: 0.5,
  qualityThreshold: 0.7,
})
```
```

**Priority**: P1
**Effort**: 3 hours

---

### 5. Broken Internal Links to Non-Existent Pages

**Severity**: 🟡 HIGH
**Impact**: Poor user experience, broken navigation
**Locations**: Various pages

**Broken Links Found**:

1. **In main guide** (`/guides/token-optimization/page.tsx`):
   - Link to `/guides/compression-strategies` → 404 (page doesn't exist)
   - Link to `/guides/model-routing` → 404 (page doesn't exist)
   - Link to `/cookbook/*` → All 404 (cookbooks folder doesn't exist)

2. **In examples page** (`/examples/token-optimization/page.tsx`):
   - "View full cookbook" links → 404

3. **In component reference pages**:
   - Links to "Related APIs" that don't have reference pages yet

**Fix Options**:

**Option A**: Remove broken links temporarily
```tsx
// ❌ Current (broken):
<Link href="/guides/compression-strategies">Learn more about compression</Link>

// ✅ Temporary fix:
<span className="text-muted-foreground">
  Learn more about compression (guide coming soon)
</span>
```

**Option B**: Create stub pages with "Coming Soon"
```tsx
// Create: /guides/compression-strategies/page.tsx
export default function CompressionStrategiesPage() {
  return (
    <div>
      <h1>Compression Strategies Guide</h1>
      <p className="text-amber-600">
        📝 This guide is currently being written. Check back soon!
      </p>
      <p>In the meantime, see:</p>
      <ul>
        <li><Link href="/guides/token-optimization">Main Token Optimization Guide</Link></li>
        <li><Link href="/examples/token-optimization">Interactive Examples</Link></li>
      </ul>
    </div>
  )
}
```

**Recommendation**: Option B (create stub pages) to avoid 404s

**Priority**: P1
**Effort**: 4 hours (create all stub pages)

---

### 6. Outdated API Import Paths

**Severity**: 🟡 HIGH
**Impact**: Copy-paste code examples won't work
**Locations**: Various code examples in docs

**Issue**: Some code examples show old import paths that were deprecated.

**Examples of Outdated Imports**:

```typescript
// ❌ Old (may not work):
import { TokenCounter } from '@clarity-chat/react'
import { formatBytes } from '@clarity-chat/react'

// ✅ New (correct):
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { formatBytes } from '@clarity-chat/utils'
```

**Audit Required**: Search all `.tsx` files for code examples with imports and verify against current exports.

**Priority**: P1
**Effort**: 6 hours (comprehensive audit + fixes)

---

### 7. Inconsistent Terminology: "Token Counting" vs "Tokenization"

**Severity**: 🟡 HIGH
**Impact**: Confusing for users
**Locations**: Throughout docs

**Issue**: Documentation uses both "token counting" and "tokenization" interchangeably, but they have different meanings:

- **Tokenization**: The process of converting text → tokens (encoding)
- **Token Counting**: Counting how many tokens a text has (utility function)

**Current Inconsistencies**:
- Some pages say "tokenization" when they mean "counting"
- Some API names use "Tokenizer" but only provide counting, not encoding/decoding

**Standardization Required**:

| Term | Use For |
|------|---------|
| Token Counting | Utility functions that return a number (e.g., `countTokens()`) |
| Tokenization | Process of encoding/decoding (e.g., `encode()`, `decode()`) |
| Token Counter | Class/component that counts tokens |
| Tokenizer | Class that can encode and decode |

**Fix**: Global search and replace + style guide

**Priority**: P1
**Effort**: 4 hours

---

### 8. Missing Version Information

**Severity**: 🟡 HIGH
**Impact**: Users don't know which features require which version
**Locations**: All API reference pages

**Issue**: API reference pages don't specify:
- When the API was introduced (e.g., "Added in v1.0.0")
- When it was deprecated (e.g., "Deprecated in v1.2.0")
- Breaking changes between versions

**Required Addition** to all API reference pages:
```tsx
<div className="border-l-4 border-brand-500 bg-brand-500/10 p-4 mb-6">
  <p className="text-sm font-mono">
    <strong>Added in:</strong> v1.0.0<br />
    <strong>Current version:</strong> v1.0.0
  </p>
</div>
```

**Priority**: P1
**Effort**: 8 hours (add to all existing pages + template)

---

## Medium Priority Issues (⚠️ Fix Post-Release)

### 9. Inconsistent Code Style in Examples

**Severity**: ⚠️ MEDIUM
**Impact**: Confusing for users copying examples
**Locations**: Various code examples

**Issues**:
- Some examples use `async/await`, others use `.then()`
- Some use `function`, others use arrow functions
- Inconsistent spacing and formatting

**Style Guide Needed**:
```typescript
// ✅ Preferred style (use consistently):

// 1. Always use async/await (not .then())
const result = await someAsyncFunction()

// 2. Use arrow functions for inline callbacks
array.map((item) => item.value)

// 3. Use function declarations for page-level functions
export default function ComponentPage() {
  // ...
}

// 4. Use named exports for utilities
export function helperFunction() {
  // ...
}
```

**Priority**: P2
**Effort**: 6 hours

---

### 10. Missing TypeScript Import Examples

**Severity**: ⚠️ MEDIUM
**Impact**: TypeScript users don't see type imports
**Locations**: API reference pages

**Issue**: Code examples don't show how to import types.

**Current**:
```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function MyComponent() {
  const { count } = useTokenCount(text)
  // ...
}
```

**Should Include Types**:
```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'
import type { UseTokenCountOptions, UseTokenCountReturn } from '@clarity-chat/token-optimization'

function MyComponent() {
  const options: UseTokenCountOptions = {
    model: 'gpt-4o',
    debounceMs: 300,
  }

  const { count }: UseTokenCountReturn = useTokenCount(text, options)
  // ...
}
```

**Priority**: P2
**Effort**: 4 hours

---

### 11. Inconsistent Component Naming in Docs vs Source

**Severity**: ⚠️ MEDIUM
**Impact**: Confusion when comparing docs to source code
**Locations**: Component reference pages

**Issue**: Some component pages use slightly different names than the actual source files.

**Example**:
- **Docs page**: "Token Optimization Dashboard"
- **Source file**: `TokenOptimizationDashboard.tsx`
- **Import**: `import { TokenOptimizationDashboard } from '...'`

**Solution**: Ensure documentation always shows the exact component name as it appears in imports.

**Priority**: P2
**Effort**: 2 hours

---

## Low Priority Issues (🔵 Polish)

### 12. Minor Markdown Formatting Inconsistencies

**Severity**: 🔵 LOW
**Impact**: Minor visual inconsistencies
**Locations**: Various pages

**Issues**:
- Inconsistent use of code blocks (some use `tsx`, others use `typescript`)
- Inconsistent heading levels (some sections use h2, others h3 for same hierarchy level)
- Inconsistent list formatting (some use `-`, others use `*`)

**Style Guide**:
```markdown
✅ Use these conventions:

- Code blocks: Always specify language (`tsx`, `typescript`, `bash`)
- Headings: h1 for page title, h2 for main sections, h3 for subsections
- Lists: Use `-` for unordered lists, `1.` for ordered lists
- Emphasis: `**bold**` for important, `*italic*` for emphasis, `code` for inline code
```

**Priority**: P2
**Effort**: 3 hours

---

## Package Docs vs Streamlined Docs Discrepancies

### Discrepancy 1: Different Savings Claims

**Issue**: Package docs (README.md) claim "up to 90%" while streamlined-docs claims "80%+".

**Resolution**: Both should say:
- **Primary claim**: "50-70% cost reduction"
- **Secondary claim**: "up to 90% with provider caching"

**Files to Update**:
- `packages/token-optimization/README.md`
- `packages/token-optimization/package.json` description
- `apps/streamlined-docs/app/guides/token-optimization/page.tsx`

---

### Discrepancy 2: Bundle Size Claims

**Issue**: Package docs claim "5-6x smaller than tiktoken" but specific sizes vary:
- README: "972KB vs 5.3MB"
- Docs: "~400KB" for the package

**Resolution**: Standardize on:
```markdown
Bundle Size:
- @clarity-chat/token-optimization: ~400KB (core package)
- gpt-tokenizer: 972KB
- tiktoken (js-tiktoken): 5.3MB

Result: 5-6x smaller than tiktoken
```

---

## Deprecated APIs to Document

Based on package docs, these APIs are deprecated but not documented in streamlined-docs:

1. **DynamicCompressionEngine** (deprecated in v1.0.0)
   - Replacement: LLMLinguaCompressor, ExtractiveCompressor, AdaptiveCompressor
   - Reason: Claimed 70-85% but delivered 10-30%

2. **Legacy TOON APIs** (if applicable)
   - Need confirmation from source code
   - Migration guide required

---

## Action Plan

### Phase 1 (Week 1): Critical Fixes

1. ✅ Update all "80%+" claims to "50-70%" (2 hours)
2. ✅ Add savings breakdown to real-world examples (3 hours)
3. ✅ Clarify provider caching "90%" is for cached tokens only (2 hours)
4. ✅ Create deprecation notice for DynamicCompressionEngine (3 hours)

**Total**: 10 hours

### Phase 2 (Week 2): High Priority Fixes

1. ⚠️ Create stub pages for broken links (4 hours)
2. ⚠️ Audit and fix import paths in code examples (6 hours)
3. ⚠️ Standardize terminology (token counting vs tokenization) (4 hours)
4. ⚠️ Add version information to all API pages (8 hours)

**Total**: 22 hours

### Phase 3 (Post-Release): Medium/Low Priority

1. 🔵 Standardize code style in examples (6 hours)
2. 🔵 Add TypeScript import examples (4 hours)
3. 🔵 Fix component naming inconsistencies (2 hours)
4. 🔵 Fix markdown formatting (3 hours)

**Total**: 15 hours

---

## Summary

**Immediate Blockers**: 3 issues (7 hours to fix)
**Pre-Release Fixes**: 5 issues (22 hours to fix)
**Post-Release Polish**: 4 issues (15 hours to fix)

**Total Deprecation/Correction Effort**: 44 hours

---

**Analysis Complete** ✅
**Next Phase**: Priority Classification & Documentation Roadmap
