# Documentation Queue: Priority Classification

**Phase 3: Priority Classification**
**Generated**: 2026-01-28
**Based on**: Phase 2 Analysis (5 documents)
**Scope**: apps/streamlined-docs only

---

## Executive Summary

**Total Work Items**: 47
**Total Estimated Effort**: 274 hours (34 working days)

### Priority Breakdown
- **P0 (Release Blockers)**: 15 items, 154 hours, 19 days
- **P1 (Pre-Release)**: 21 items, 87 hours, 11 days
- **P2 (Post-Release)**: 11 items, 46 hours, 6 days

### Critical Path
1. Fix value proposition claims (2 hours) ← **START HERE**
2. Create cookbooks (40 hours) ← Depends on #1
3. Create API reference pages (90 hours) ← Depends on #1
4. Enhance demos (28 hours) ← Depends on #1

---

## P0: Release Blockers (Must Ship Before Launch)

### Milestone: Value Proposition Corrections
**Total**: 10 hours | **Dependencies**: None | **Blocking**: All other work

#### 1.1 Update Hero Claims Across All Pages
**Priority**: P0-CRITICAL
**Effort**: 2 hours
**Owner**: TBD
**Blocking**: Items 1.2, 1.3, 2.1-2.7, 3.1-3.18

**Description**:
Global search and replace of incorrect "80%+" claims with accurate "50-70%" baseline claim.

**Files to Update**:
```
apps/streamlined-docs/app/guides/token-optimization/page.tsx (line 1, ~50)
apps/streamlined-docs/app/examples/token-optimization/page.tsx (~150)
apps/streamlined-docs/app/tools/token-roi-calculator/page.tsx (TBD)
apps/streamlined-docs/app/page.tsx (if token optimization mentioned)
apps/streamlined-docs/components/Hero.tsx (if exists)
```

**Required Changes**:
```tsx
// ❌ WRONG (current):
<h1>Save 80%+ on AI Costs</h1>

// ✅ CORRECT (required):
<h1>Reduce AI Costs by 50-70%</h1>
<p className="text-lg text-muted-foreground">
  Up to 90% with provider caching
</p>
```

**Acceptance Criteria**:
- [ ] All "80%+" references replaced with "50-70%"
- [ ] All pages include "up to 90% with provider caching" subtext
- [ ] No mentions of "80%" remain except in real-world examples with breakdown

**QA Check**:
```bash
# Search for any remaining incorrect claims
grep -r "80%" apps/streamlined-docs/app/
grep -r "Save.*%" apps/streamlined-docs/app/
```

---

#### 1.2 Add Savings Breakdown to Real-World Examples
**Priority**: P0-CRITICAL
**Effort**: 3 hours
**Owner**: TBD
**Dependencies**: 1.1 (value proposition fix)
**Blocking**: 2.1 (cookbooks reference these examples)

**Description**:
Real-world examples currently claim "80% savings" without explaining HOW. Add breakdown showing baseline + provider caching = total.

**Location**: `apps/streamlined-docs/app/guides/token-optimization/page.tsx` (Real-World Examples section)

**Required Addition** (Support Chatbot Example):
```tsx
<div className="space-y-4">
  <h3 className="text-xl font-semibold">Support Chatbot - 80% Cost Reduction</h3>

  {/* Cost comparison */}
  <div className="bg-muted p-4 rounded-lg">
    <p className="font-mono">
      <strong>Before optimization:</strong> $5,000/month<br />
      <strong>After optimization:</strong> $1,000/month<br />
      <strong className="text-brand-600">Total savings: 80%</strong>
    </p>
  </div>

  {/* Optimization breakdown */}
  <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg">
    <p className="font-semibold mb-2">How We Achieved 80% Savings:</p>
    <ul className="space-y-1 text-sm">
      <li>✓ Provider caching (system prompts): 60% savings</li>
      <li>✓ Compression (user context): 15% savings</li>
      <li>✓ Smart routing (simple queries → cheaper models): 5% savings</li>
    </ul>
    <p className="mt-3 text-xs text-muted-foreground">
      This example shows how combining multiple strategies achieves 80% savings,
      exceeding the 50-70% baseline.
    </p>
  </div>

  <p>
    The chatbot processes 10,000 conversations/day with 500 tokens/conversation...
  </p>
</div>
```

**Acceptance Criteria**:
- [ ] Support chatbot example has savings breakdown
- [ ] Document analysis example has savings breakdown
- [ ] Code assistant example has savings breakdown
- [ ] Each breakdown shows: baseline cost, final cost, strategy breakdown
- [ ] Each includes note explaining how it exceeds 50-70% baseline

---

#### 1.3 Clarify Provider Caching "90%" Context
**Priority**: P0-CRITICAL
**Effort**: 2 hours
**Owner**: TBD
**Dependencies**: 1.1 (value proposition fix)
**Blocking**: 2.2 (provider caching cookbook)

**Description**:
Provider caching section emphasizes "90% cost reduction" without clarifying this applies to cached tokens only, not overall costs.

**Location**: `apps/streamlined-docs/app/guides/token-optimization/page.tsx` (Provider Caching section)

**Required Warning Banner**:
```tsx
<div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg mb-6">
  <div className="flex items-start gap-3">
    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-semibold text-amber-900 dark:text-amber-100">
        Important: Provider caching achieves 90% savings on <strong>cached tokens only</strong>
      </p>
      <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
        Your overall cost reduction will be 50-70% baseline when combining provider
        caching with other strategies across all tokens. The 90% rate applies only
        to static content like system prompts that meet the caching threshold.
      </p>
    </div>
  </div>
</div>
```

**Updated Section Heading**:
```tsx
// ❌ Current:
<h2>Provider Caching - Up to 90% Cost Reduction</h2>

// ✅ Corrected:
<h2>Provider Caching - Up to 90% on Cached Content</h2>
```

**Acceptance Criteria**:
- [ ] Warning banner added before provider caching examples
- [ ] Section heading clarifies "90% on Cached Content"
- [ ] All provider caching examples include note about cached vs total cost

---

#### 1.4 Create Deprecation Notice Page
**Priority**: P0-CRITICAL
**Effort**: 3 hours
**Owner**: TBD
**Dependencies**: 1.1 (value proposition fix)
**Blocking**: 3.5 (compression API docs reference this)

**Description**:
`DynamicCompressionEngine` was deprecated in v1.0.0 but no deprecation notice exists in docs.

**New Page**: `apps/streamlined-docs/app/reference/deprecated/dynamic-compression-engine/page.tsx`

**Content**:
```tsx
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'DynamicCompressionEngine (Deprecated) | Token Optimization',
  description: 'Deprecated API - Use LLMLinguaCompressor, ExtractiveCompressor, or AdaptiveCompressor instead',
}

export default function DynamicCompressionEngineDeprecatedPage() {
  return (
    <div className="space-y-8">
      {/* Deprecation banner */}
      <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-lg">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              DynamicCompressionEngine (Deprecated)
            </h1>
            <p className="text-red-800 dark:text-red-200">
              <strong>Deprecated in v1.0.0</strong> - Will be removed in v2.0.0
            </p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-2">
              Use <code>LLMLinguaCompressor</code>, <code>ExtractiveCompressor</code>,
              or <code>AdaptiveCompressor</code> instead.
            </p>
          </div>
        </div>
      </div>

      {/* Reason for deprecation */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Reason for Deprecation</h2>
        <p className="text-muted-foreground">
          The original <code>DynamicCompressionEngine</code> claimed "70-85% compression"
          but delivered only 10-30% (mostly whitespace removal). The new strategy-based
          compressors achieve <strong>2-20x real compression</strong> with quality monitoring.
        </p>
      </section>

      {/* Migration guide */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Migration Guide</h2>
        <p className="text-muted-foreground mb-4">
          Follow our comprehensive{' '}
          <Link href="/guides/compression-strategies" className="text-brand-600 hover:underline">
            Compression Strategies Guide
          </Link>{' '}
          for step-by-step migration instructions.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Old API */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              ❌ Old API (Deprecated)
            </h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`// ❌ Old (deprecated):
import { DynamicCompressionEngine } from '@clarity-chat/token-optimization'

const engine = new DynamicCompressionEngine({
  targetRatio: 0.5
})
const result = await engine.compress(text)`}</code>
            </pre>
          </div>

          {/* New API */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              ✅ New API (Recommended)
            </h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`// ✅ New (recommended):
import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

const result = await compressWithLLMLingua(text, {
  targetRatio: 0.5,
  qualityThreshold: 0.7,
})`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Breaking changes */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Breaking Changes</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Return type changed from <code>string</code> to <code>CompressionResult</code></li>
          <li>Quality metrics now included in result</li>
          <li>Error handling improved with typed errors</li>
          <li>Synchronous API removed (all compression is async)</li>
        </ul>
      </section>

      {/* Next steps */}
      <section className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Next Steps</h2>
        <div className="space-y-3">
          <Link
            href="/guides/compression-strategies"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Read Compression Strategies Guide
          </Link>
          <Link
            href="/reference/classes/llmlingua-compressor"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            LLMLinguaCompressor API Reference
          </Link>
          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Achieving 50%+ Cost Reduction Cookbook
          </Link>
        </div>
      </section>
    </div>
  )
}
```

**Acceptance Criteria**:
- [ ] Deprecation page created at `/reference/deprecated/dynamic-compression-engine`
- [ ] Page clearly states deprecated in v1.0.0, removed in v2.0.0
- [ ] Migration guide with old vs new API
- [ ] Links to replacement APIs
- [ ] Navigation updated to include deprecated section

---

### Milestone: Critical Cookbooks
**Total**: 40 hours | **Dependencies**: 1.1 | **Blocking**: Demo enhancements

#### 2.1 Cookbook: Achieving 50-70% Cost Reduction
**Priority**: P0-CRITICAL
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: 1.1, 1.2, 1.3 (value prop fixes)
**Blocking**: 4.1, 4.2, 4.3 (demos reference this)

**New Page**: `apps/streamlined-docs/app/cookbook/achieving-50-percent-reduction/page.tsx`

**Structure**:
1. Introduction - "This cookbook shows how to achieve 50-70% cost reduction"
2. Prerequisites - Install library, basic token counting
3. Strategy 1: Provider Caching (50%+ savings)
   - Implementation steps
   - Before/after code comparison
   - Cost calculation example
4. Strategy 2: Compression (15-25% additional)
   - Choose right compressor
   - Implementation
   - Quality vs cost tradeoff
5. Strategy 3: Smart Routing (10-15% additional)
   - Complexity detection
   - Model selection rules
   - Implementation
6. Combining Strategies - Full pipeline example
7. Measuring Results - CostTracker integration
8. Next Steps - Links to advanced guides

**Acceptance Criteria**:
- [ ] Page created with ISR (revalidate: 3600)
- [ ] All code examples use correct imports
- [ ] Before/after cost comparison shows 50-70% reduction
- [ ] Working code samples that can be copied
- [ ] Links to relevant API reference pages

---

#### 2.2 Cookbook: Provider Caching Setup
**Priority**: P0-CRITICAL
**Effort**: 5 hours
**Owner**: TBD
**Dependencies**: 1.3 (caching context clarification)

**New Page**: `apps/streamlined-docs/app/cookbook/provider-caching-setup/page.tsx`

**Structure**:
1. Introduction - "90% savings on cached tokens"
2. Prerequisites
3. Step 1: Format prompts for caching
   - Anthropic example
   - OpenAI example
   - Gemini example
4. Step 2: Implement caching in React
5. Step 3: Implement caching in Node.js
6. Step 4: Monitor cache hit rates
7. Troubleshooting - Common issues
8. Cost Impact Calculator

**Acceptance Criteria**:
- [ ] Page includes warning that 90% applies to cached tokens only
- [ ] Examples for all 3 major providers
- [ ] Cache hit rate monitoring examples
- [ ] Cost calculator showing savings with different hit rates

---

#### 2.3 Cookbook: Smart Model Routing
**Priority**: P0
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: 1.1

**New Page**: `apps/streamlined-docs/app/cookbook/smart-routing/page.tsx`

**Structure**:
1. Introduction - "40-60% savings via complexity-based routing"
2. Prerequisites
3. Step 1: Analyze query complexity
4. Step 2: Define routing rules
5. Step 3: Implement ModelRouter
6. Step 4: Test routing decisions
7. Real-world example - Customer support routing
8. Cost impact analysis

**Acceptance Criteria**:
- [ ] Complexity detection examples
- [ ] Routing rules for common scenarios
- [ ] Cost comparison: all-GPT-4 vs smart routing
- [ ] Performance metrics (latency + cost)

---

#### 2.4 Cookbook: React Integration
**Priority**: P0
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: 1.1, 2.1

**New Page**: `apps/streamlined-docs/app/cookbook/react-integration/page.tsx`

**Structure**:
1. Introduction
2. Prerequisites
3. Hook 1: useTokenOptimization
4. Hook 2: useTokenBudgetMonitor
5. Hook 3: useTieredCache
6. Hook 4: useModelRouter
7. Complete example - Chat interface with optimization
8. Performance best practices

**Acceptance Criteria**:
- [ ] All 4 major hooks documented
- [ ] Complete working example
- [ ] Debouncing patterns
- [ ] Memoization strategies
- [ ] Cost tracking integration

---

#### 2.5 Cookbook: Node.js Backend Integration
**Priority**: P0
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: 1.1, 2.1

**New Page**: `apps/streamlined-docs/app/cookbook/nodejs-integration/page.tsx`

**Structure**:
1. Introduction
2. Prerequisites
3. Pattern 1: API endpoint optimization
4. Pattern 2: Background job optimization
5. Pattern 3: Streaming responses with caching
6. Pattern 4: Batch processing
7. Complete example - Optimized API server
8. Production considerations

**Acceptance Criteria**:
- [ ] Express.js examples
- [ ] Streaming implementation
- [ ] Circuit breaker pattern
- [ ] Resource limits
- [ ] Error handling

---

#### 2.6 Cookbook: TOON Migration Guide
**Priority**: P0
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: 1.1, 1.4 (deprecation notice)

**New Page**: `apps/streamlined-docs/app/cookbook/toon-migration/page.tsx`

**Structure**:
1. Introduction - "Migrate from TOON to new library"
2. Breaking changes summary
3. Step 1: Update imports
4. Step 2: Replace DynamicCompressionEngine
5. Step 3: Update provider caching
6. Step 4: Migrate custom configurations
7. Step 5: Test and validate
8. Troubleshooting common issues

**Acceptance Criteria**:
- [ ] Side-by-side TOON vs new API comparison
- [ ] Migration checklist
- [ ] Breaking changes clearly documented
- [ ] Working migration examples
- [ ] Links to deprecation notices

---

#### 2.7 Cookbook: Enterprise Production Pipeline
**Priority**: P0
**Effort**: 5 hours
**Owner**: TBD
**Dependencies**: 1.1, 2.1, 2.2, 2.3

**New Page**: `apps/streamlined-docs/app/cookbook/enterprise-pipeline/page.tsx`

**Structure**:
1. Introduction - "Robust optimization pipeline"
2. Prerequisites
3. Architecture - Full pipeline diagram
4. Component 1: Request preprocessing
5. Component 2: Caching layer
6. Component 3: Compression layer
7. Component 4: Routing layer
8. Component 5: Monitoring & observability
9. Security considerations
10. Deployment guide

**Acceptance Criteria**:
- [ ] Complete working pipeline example
- [ ] Security best practices
- [ ] Monitoring integration
- [ ] Load testing guidance
- [ ] Cost tracking implementation

---

### Milestone: Interactive Demo Enhancements
**Total**: 28 hours | **Dependencies**: 1.1, 2.1-2.7 | **Blocking**: QA phase

#### 4.1 Enhance Existing Demos with Savings Focus
**Priority**: P0
**Effort**: 8 hours
**Owner**: TBD
**Dependencies**: 1.1, 1.2, 2.1

**Description**:
Current demos show features but don't emphasize cost savings. Add before/after cost comparisons to all 4 existing demos.

**Files to Update**:
```
apps/streamlined-docs/app/examples/token-optimization/page.tsx
```

**Required Changes**:
Each of the 4 demos (Token Counter, Budget Monitor, Auto-Trim, Cost Estimation) should include:

1. **Cost Impact Banner** above demo:
```tsx
<div className="bg-brand-500/10 border border-brand-500/30 p-3 rounded-lg mb-4">
  <p className="text-sm">
    <strong className="text-brand-700 dark:text-brand-300">💰 Cost Impact:</strong>{' '}
    <span className="text-muted-foreground">
      This feature enables [X]% cost reduction by [mechanism]
    </span>
  </p>
</div>
```

2. **Before/After Comparison** in demo output:
```tsx
<div className="grid grid-cols-2 gap-4 mt-4">
  <div>
    <p className="text-xs text-muted-foreground mb-1">Before Optimization</p>
    <p className="font-mono text-2xl text-red-600">$0.50</p>
  </div>
  <div>
    <p className="text-xs text-muted-foreground mb-1">After Optimization</p>
    <p className="font-mono text-2xl text-green-600">$0.15</p>
    <p className="text-xs text-green-600 font-semibold">70% savings</p>
  </div>
</div>
```

**Acceptance Criteria**:
- [ ] All 4 existing demos have cost impact banners
- [ ] All 4 demos show before/after cost comparison
- [ ] Savings percentages are accurate (50-70% range)
- [ ] Demos are still interactive and functional

---

#### 4.2 Create BeforeAfterComparison Component
**Priority**: P0
**Effort**: 10 hours
**Owner**: TBD
**Dependencies**: 1.1, 2.1

**New Component**: `apps/streamlined-docs/components/token-optimization/BeforeAfterComparison.tsx`

**Features**:
- Interactive slider to compare before/after optimization
- Live token counting on both sides
- Real-time cost calculation
- Visual diff of prompt formatting
- Savings percentage display
- Multiple optimization strategies (caching, compression, routing)

**Props Interface**:
```typescript
interface BeforeAfterComparisonProps {
  scenario: 'caching' | 'compression' | 'routing' | 'combined'
  defaultText?: string
  model?: 'gpt-4o' | 'claude-3-5-sonnet-20241022'
  showCode?: boolean
}
```

**Acceptance Criteria**:
- [ ] Component created and exported
- [ ] Interactive slider works
- [ ] Live token counting accurate
- [ ] Cost calculations show 50-70% savings
- [ ] Multiple scenarios supported
- [ ] Code example toggle

---

#### 4.3 Create SavingsDashboard Component
**Priority**: P0
**Effort**: 10 hours
**Owner**: TBD
**Dependencies**: 1.1, 2.1, 4.2

**New Component**: `apps/streamlined-docs/components/token-optimization/SavingsDashboard.tsx`

**Features**:
- Real-time cost tracking
- Savings over time chart
- Strategy breakdown (caching, compression, routing)
- Monthly projections
- Cost per request histogram
- Export data to CSV

**Props Interface**:
```typescript
interface SavingsDashboardProps {
  timeRange?: '24h' | '7d' | '30d' | '90d'
  showProjections?: boolean
  showBreakdown?: boolean
  data?: CostTrackingData
}
```

**Acceptance Criteria**:
- [ ] Component created and exported
- [ ] Charts render correctly
- [ ] Data updates in real-time
- [ ] Shows 50-70% baseline savings
- [ ] Export functionality works
- [ ] Responsive design

---

### Milestone: Critical Navigation & Search
**Total**: 8 hours | **Dependencies**: 1.1, 2.1-2.7 | **Blocking**: None

#### 5.1 Add Token Optimization to Top Navigation
**Priority**: P0
**Effort**: 2 hours
**Owner**: TBD
**Dependencies**: 1.1, 2.1-2.7

**File to Update**: `apps/streamlined-docs/components/Navigation.tsx` (or similar)

**Required Changes**:
```tsx
{/* Add to main navigation */}
<NavigationItem
  href="/guides/token-optimization"
  badge="Save 50-70%"
  badgeColor="brand"
>
  Token Optimization
</NavigationItem>
```

**Acceptance Criteria**:
- [ ] "Token Optimization" appears in top nav
- [ ] Badge shows "Save 50-70%"
- [ ] Link goes to main guide
- [ ] Prominent placement (top 3 items)

---

#### 5.2 Update Search Metadata for Token Optimization Pages
**Priority**: P0
**Effort**: 3 hours
**Owner**: TBD
**Dependencies**: 1.1, 2.1-2.7

**Description**:
Update all token optimization pages with SEO-optimized metadata and keywords to ensure they rank highly in site search.

**Files to Update**: All pages in `/guides/token-optimization`, `/cookbook/*`, `/reference/*/token-*`

**Required Metadata**:
```typescript
export const metadata: Metadata = {
  title: 'Token Optimization | Reduce AI Costs by 50-70%',
  description: 'Save 50-70% on AI costs with provider caching, compression, and smart routing. Complete guide with examples.',
  keywords: ['token optimization', 'ai cost reduction', '50-70% savings', 'provider caching', 'compression'],
  openGraph: {
    images: ['/images/token-optimization-og.png'],
  },
}
```

**Acceptance Criteria**:
- [ ] All token optimization pages have updated metadata
- [ ] Keywords include "50-70% cost reduction"
- [ ] Descriptions mention cost savings
- [ ] OG images created for social sharing

---

#### 5.3 Create Search Priority Configuration
**Priority**: P0
**Effort**: 3 hours
**Owner**: TBD
**Dependencies**: 5.2

**Description**:
Configure site search to prioritize token optimization pages in results.

**File to Create/Update**: Search configuration (implementation depends on search provider)

**Required Configuration**:
```typescript
// Priority weights for search results
const searchPriority = {
  '/guides/token-optimization': 100,
  '/cookbook/achieving-50-percent-reduction': 95,
  '/cookbook/provider-caching-setup': 90,
  '/reference/hooks/use-token-optimization': 85,
  // ... other pages
}
```

**Acceptance Criteria**:
- [ ] Token optimization pages rank first for "optimization" query
- [ ] Token optimization pages rank first for "cost" query
- [ ] Token optimization pages rank first for "savings" query
- [ ] Search results show cost savings in snippets

---

### Milestone: Critical Content Fixes
**Total**: 68 hours | **Dependencies**: 1.1 | **Blocking**: Phase 5 (validation)

#### 6.1 Create Stub Pages for Broken Links
**Priority**: P0
**Effort**: 4 hours
**Owner**: TBD
**Dependencies**: None

**Description**:
Current docs have broken internal links. Create stub pages with "Coming Soon" messages.

**Pages to Create**:
```
apps/streamlined-docs/app/guides/compression-strategies/page.tsx
apps/streamlined-docs/app/guides/model-routing/page.tsx
apps/streamlined-docs/app/guides/advanced-optimization/page.tsx
apps/streamlined-docs/app/guides/best-practices/page.tsx
```

**Stub Template**:
```tsx
export default function ComingSoonPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Compression Strategies Guide</h1>
      <p className="text-lg text-muted-foreground mb-8">
        📝 This guide is currently being written. Check back soon!
      </p>
      <p className="text-sm text-muted-foreground mb-6">In the meantime, see:</p>
      <div className="space-y-2">
        <Link href="/guides/token-optimization" className="block text-brand-600 hover:underline">
          Main Token Optimization Guide
        </Link>
        <Link href="/examples/token-optimization" className="block text-brand-600 hover:underline">
          Interactive Examples
        </Link>
      </div>
    </div>
  )
}
```

**Acceptance Criteria**:
- [ ] All 4 stub pages created
- [ ] No 404 errors when clicking nav links
- [ ] Stubs link to existing content
- [ ] Metadata indicates "Coming Soon"

---

#### 6.2-6.19 Create API Reference Pages (18 pages)
**Priority**: P0
**Effort**: 5 hours each = 90 hours total
**Owner**: TBD
**Dependencies**: 1.1 (value prop fix), 1.4 (deprecation notice)

**Description**:
Create dedicated API reference pages for all 18 missing HIGHEST priority APIs.

**Pages to Create**:
1. `/reference/classes/accurate-token-counter/page.tsx`
2. `/reference/classes/tiered-cache/page.tsx`
3. `/reference/classes/llmlingua-compressor/page.tsx`
4. `/reference/classes/extractive-compressor/page.tsx`
5. `/reference/classes/adaptive-compressor/page.tsx`
6. `/reference/classes/model-router/page.tsx`
7. `/reference/classes/provider-caching-formatter/page.tsx`
8. `/reference/classes/cost-tracker/page.tsx`
9. `/reference/hooks/use-token-count/page.tsx`
10. `/reference/hooks/use-tiered-cache/page.tsx`
11. `/reference/hooks/use-model-router/page.tsx`
12. `/reference/components/token-optimization-badge/page.tsx`
13. `/reference/functions/compress-with-llmlingua/page.tsx`
14. `/reference/functions/compress-with-extractive/page.tsx`
15. `/reference/functions/compress-with-adaptive/page.tsx`
16. `/reference/functions/format-for-caching/page.tsx`
17. `/reference/functions/count-tokens/page.tsx`
18. `/reference/functions/estimate-cost/page.tsx`

**Standard Template** (per page):
```tsx
import { Metadata } from 'next'
import { PropsTable } from '@/components/PropsTable'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = {
  title: 'AccurateTokenCounter | Token Optimization API',
  description: 'Accurate token counting for all major LLM providers. Enables 50-70% cost reduction.',
}

export default function AccurateTokenCounterPage() {
  return (
    <div className="space-y-8">
      {/* Cost savings badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 border border-brand-500/30 rounded-full">
        <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
          🔥 Enables 50%+ cost reduction
        </span>
      </div>

      {/* Introduction */}
      <section>
        <h1 className="text-3xl font-bold mb-3">AccurateTokenCounter</h1>
        <p className="text-lg text-muted-foreground">
          Provider-accurate token counting class that ensures cost estimates match actual API usage.
        </p>
      </section>

      {/* Version info */}
      <div className="border-l-4 border-brand-500 bg-brand-500/10 p-4">
        <p className="text-sm font-mono">
          <strong>Added in:</strong> v1.0.0<br />
          <strong>Current version:</strong> v1.0.0<br />
          <strong>Package:</strong> @clarity-chat/token-optimization
        </p>
      </div>

      {/* Installation */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Installation</h2>
        <CodeBlock language="bash">
          npm install @clarity-chat/token-optimization
        </CodeBlock>
      </section>

      {/* Quick start */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Quick Start</h2>
        <CodeBlock language="typescript">{`import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
})

const count = counter.count('Your text here')
console.log(\`Tokens: \${count}\`) // Exact provider count`}</CodeBlock>
      </section>

      {/* Constructor */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Constructor</h2>
        <CodeBlock language="typescript">{`new AccurateTokenCounter(config: TokenizerConfig)`}</CodeBlock>
        <PropsTable
          props={[
            {
              name: 'config.provider',
              type: "'anthropic' | 'openai' | 'google'",
              required: true,
              description: 'LLM provider for accurate counting',
            },
            {
              name: 'config.model',
              type: 'string',
              required: true,
              description: 'Model ID (e.g., "claude-3-5-sonnet-20241022")',
            },
          ]}
        />
      </section>

      {/* Methods */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Methods</h2>

        <h3 className="text-xl font-semibold mb-2 mt-6">count()</h3>
        <p className="text-muted-foreground mb-3">
          Count tokens in a string using provider-specific tokenization.
        </p>
        <CodeBlock language="typescript">{`count(text: string): number`}</CodeBlock>
        <PropsTable
          props={[
            {
              name: 'text',
              type: 'string',
              required: true,
              description: 'Text to count tokens for',
            },
            {
              name: 'returns',
              type: 'number',
              required: false,
              description: 'Exact token count for the provider',
            },
          ]}
        />
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Examples</h2>

        <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
        <CodeBlock language="typescript">{`const counter = new AccurateTokenCounter({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
})

const text = 'Hello, how can I help you today?'
const tokens = counter.count(text)
console.log(\`Tokens: \${tokens}\`)`}</CodeBlock>

        <h3 className="text-lg font-semibold mb-2 mt-6">Cost Estimation</h3>
        <CodeBlock language="typescript">{`import { AccurateTokenCounter, estimateCost } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
})

const inputTokens = counter.count(userMessage)
const cost = estimateCost({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  inputTokens,
  outputTokens: 500,
})

console.log(\`Estimated cost: $\${cost.toFixed(4)}\`)`}</CodeBlock>
      </section>

      {/* Cost impact */}
      <section className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">💰 Cost Impact</h2>
        <p className="text-muted-foreground mb-4">
          Accurate token counting is the foundation of all optimization strategies.
          It enables:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Provider caching</strong>: Identify what to cache for 90% savings</li>
          <li><strong>Budget enforcement</strong>: Prevent cost overruns</li>
          <li><strong>Smart routing</strong>: Choose the right model for cost efficiency</li>
          <li><strong>Cost tracking</strong>: Monitor actual vs estimated costs</li>
        </ul>
        <p className="mt-4 text-sm">
          Learn more in our{' '}
          <Link href="/cookbook/achieving-50-percent-reduction" className="text-brand-600 hover:underline">
            Achieving 50-70% Cost Reduction
          </Link>{' '}
          cookbook.
        </p>
      </section>

      {/* Related */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">Related</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/reference/functions/count-tokens" className="text-brand-600 hover:underline">
              countTokens() function
            </Link>
            {' '}- Simple function wrapper
          </li>
          <li>
            <Link href="/reference/hooks/use-token-count" className="text-brand-600 hover:underline">
              useTokenCount hook
            </Link>
            {' '}- React hook for token counting
          </li>
          <li>
            <Link href="/reference/classes/cost-tracker" className="text-brand-600 hover:underline">
              CostTracker
            </Link>
            {' '}- Track costs over time
          </li>
        </ul>
      </section>
    </div>
  )
}
```

**Acceptance Criteria** (per page):
- [ ] Page created with ISR (revalidate: 3600)
- [ ] Cost savings badge at top
- [ ] Version information included
- [ ] Complete API reference (constructor, methods, props)
- [ ] 2-3 working code examples
- [ ] Cost impact section explaining how it enables 50-70% savings
- [ ] Related APIs section with links
- [ ] All imports correct
- [ ] TypeScript types documented

**Note**: Due to 90 hours total, this milestone should be split across multiple developers or completed iteratively.

---

## P0 Summary

**Total**: 154 hours (19 working days)
**Critical Path**: 1.1 → {2.1-2.7, 4.1-4.3, 6.2-6.19} → Phase 5

**Milestone Breakdown**:
1. Value Proposition Corrections: 10 hours (2-3 hours per item)
2. Critical Cookbooks: 40 hours (5-6 hours per cookbook)
3. Interactive Demo Enhancements: 28 hours (8-10 hours per component)
4. Critical Navigation & Search: 8 hours (2-3 hours per item)
5. Critical Content Fixes: 68 hours (4 hours stubs + 90 hours API docs - but we only counted missing ones)

**Release Blocker**: Cannot ship without completing all P0 items.

---

## P1: Pre-Release (Should Complete Before Launch)

### Milestone: Advanced Guides
**Total**: 24 hours | **Dependencies**: P0 complete

#### 7.1 Guide: Compression Strategies
**Priority**: P1
**Effort**: 8 hours
**Owner**: TBD
**Dependencies**: 1.4, 2.1, 6.2-6.6 (compressor API docs)

**New Page**: `apps/streamlined-docs/app/guides/compression-strategies/page.tsx`

**Structure**:
1. Introduction - "2-20x compression with quality monitoring"
2. When to use compression
3. Strategy 1: LLMLingua - Learned compression
4. Strategy 2: Extractive - Sentence extraction
5. Strategy 3: Adaptive - Automatic strategy selection
6. Quality vs cost tradeoff
7. Combining with caching
8. Production considerations

**Acceptance Criteria**:
- [ ] All 3 compressor strategies explained
- [ ] Quality metrics documented
- [ ] Performance benchmarks included
- [ ] Real-world examples
- [ ] Links to API reference

---

#### 7.2 Guide: Model Routing Strategies
**Priority**: P1
**Effort**: 8 hours
**Owner**: TBD
**Dependencies**: 2.1, 2.3, 6.7 (ModelRouter API doc)

**New Page**: `apps/streamlined-docs/app/guides/model-routing/page.tsx`

**Structure**:
1. Introduction - "40-60% savings via complexity-based routing"
2. Complexity detection algorithms
3. Routing rules and patterns
4. Custom routing logic
5. Monitoring routing decisions
6. Production deployment
7. Cost analysis

**Acceptance Criteria**:
- [ ] Complexity detection explained
- [ ] Routing algorithms documented
- [ ] Custom rule examples
- [ ] Performance benchmarks
- [ ] Cost comparison charts

---

#### 7.3 Guide: Advanced Optimization Strategies
**Priority**: P1
**Effort**: 8 hours
**Owner**: TBD
**Dependencies**: 2.1, 7.1, 7.2

**New Page**: `apps/streamlined-docs/app/guides/advanced-optimization/page.tsx`

**Structure**:
1. Introduction - "Combining strategies for maximum savings"
2. Strategy layering
3. Pipeline architecture
4. Quality gates
5. Monitoring and observability
6. A/B testing optimization strategies
7. Production patterns

**Acceptance Criteria**:
- [ ] Pipeline architecture diagram
- [ ] Strategy combination examples
- [ ] Quality gate implementation
- [ ] Monitoring setup guide
- [ ] A/B testing methodology

---

### Milestone: Additional API Reference
**Total**: 30 hours | **Dependencies**: P0 API docs complete

#### 8.1-8.6 Create MEDIUM Priority API Reference Pages (6 pages)
**Priority**: P1
**Effort**: 5 hours each = 30 hours total
**Owner**: TBD
**Dependencies**: 6.2-6.19 (HIGHEST priority APIs)

**Pages to Create**:
1. `/reference/classes/compression-quality-monitor/page.tsx`
2. `/reference/classes/routing-decision-logger/page.tsx`
3. `/reference/hooks/use-compression-quality/page.tsx`
4. `/reference/hooks/use-routing-analytics/page.tsx`
5. `/reference/components/compression-quality-badge/page.tsx`
6. `/reference/components/routing-visualization/page.tsx`

**Use same template as P0 API docs** (see 6.2-6.19)

**Acceptance Criteria** (per page):
- [ ] Complete API reference
- [ ] Cost impact section
- [ ] Working examples
- [ ] Related APIs links

---

### Milestone: Content Quality & Consistency
**Total**: 33 hours | **Dependencies**: P0 complete

#### 9.1 Audit and Fix Import Paths
**Priority**: P1
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: 6.2-6.19 (API docs complete)

**Description**:
Comprehensive audit of all code examples to ensure imports are correct and up-to-date.

**Process**:
1. Extract all code blocks from all pages
2. Parse import statements
3. Verify against current package exports
4. Update incorrect imports
5. Test that all examples compile

**Acceptance Criteria**:
- [ ] All imports verified against package exports
- [ ] No deprecated imports remain
- [ ] All examples use consistent import style
- [ ] Type imports included where appropriate

---

#### 9.2 Standardize Terminology
**Priority**: P1
**Effort**: 4 hours
**Owner**: TBD
**Dependencies**: All P0 content

**Description**:
Global search and replace to standardize "token counting" vs "tokenization" terminology.

**Style Guide**:
| Term | Use For |
|------|---------|
| Token Counting | Utility functions that return a number |
| Tokenization | Process of encoding/decoding |
| Token Counter | Class/component that counts tokens |
| Tokenizer | Class that can encode and decode |

**Acceptance Criteria**:
- [ ] All pages use correct terminology
- [ ] Style guide documented
- [ ] No inconsistencies remain

---

#### 9.3 Add Version Information to All API Pages
**Priority**: P1
**Effort**: 8 hours
**Owner**: TBD
**Dependencies**: 6.2-6.19, 8.1-8.6 (all API docs)

**Description**:
Add "Added in", "Current version", "Deprecated in" information to all API reference pages.

**Template**:
```tsx
<div className="border-l-4 border-brand-500 bg-brand-500/10 p-4 mb-6">
  <p className="text-sm font-mono">
    <strong>Added in:</strong> v1.0.0<br />
    <strong>Current version:</strong> v1.0.0<br />
    <strong>Package:</strong> @clarity-chat/token-optimization
  </p>
</div>
```

**Acceptance Criteria**:
- [ ] All API pages have version info
- [ ] Deprecated APIs clearly marked
- [ ] Breaking changes documented

---

#### 9.4 Standardize Code Style in Examples
**Priority**: P1
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: All P0 content

**Description**:
Enforce consistent code style across all examples.

**Style Rules**:
1. Always use async/await (not .then())
2. Use arrow functions for callbacks
3. Use function declarations for components
4. Use named exports for utilities
5. Consistent spacing and formatting

**Acceptance Criteria**:
- [ ] All examples follow style guide
- [ ] Prettier/ESLint configured
- [ ] Pre-commit hook validates style

---

#### 9.5 Add TypeScript Import Examples
**Priority**: P1
**Effort**: 4 hours
**Owner**: TBD
**Dependencies**: 6.2-6.19 (API docs)

**Description**:
Add type import examples to all API reference pages.

**Template**:
```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'
import type { UseTokenCountOptions, UseTokenCountReturn } from '@clarity-chat/token-optimization'
```

**Acceptance Criteria**:
- [ ] All API pages show type imports
- [ ] Type definitions linked
- [ ] Examples use typed variables

---

#### 9.6 Fix Component Naming Inconsistencies
**Priority**: P1
**Effort**: 2 hours
**Owner**: TBD
**Dependencies**: All P0 content

**Description**:
Ensure documentation always uses exact component names as they appear in imports.

**Acceptance Criteria**:
- [ ] All component names match source files
- [ ] No display name mismatches
- [ ] Import statements use exact names

---

#### 9.7 Fix Markdown Formatting
**Priority**: P1
**Effort**: 3 hours
**Owner**: TBD
**Dependencies**: All P0 content

**Description**:
Standardize markdown formatting across all pages.

**Style Rules**:
- Code blocks: Always specify language
- Headings: h1 for page title, h2 for sections, h3 for subsections
- Lists: Use `-` for unordered, `1.` for ordered
- Emphasis: `**bold**`, `*italic*`, `` `code` ``

**Acceptance Criteria**:
- [ ] All pages follow markdown style guide
- [ ] Consistent heading hierarchy
- [ ] Code blocks have language specified

---

## P1 Summary

**Total**: 87 hours (11 working days)
**Dependencies**: P0 must be complete first

**Milestone Breakdown**:
1. Advanced Guides: 24 hours (8 hours per guide)
2. Additional API Reference: 30 hours (5 hours per page)
3. Content Quality & Consistency: 33 hours (2-8 hours per item)

**Should Ship**: These items significantly improve documentation quality but aren't release blockers.

---

## P2: Post-Release (Polish & Enhancement)

### Milestone: Documentation Migration
**Total**: 20 hours | **Dependencies**: None

#### 10.1 Migrate ARCHITECTURE.md
**Priority**: P2
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: None

**New Page**: `apps/streamlined-docs/app/guides/architecture/page.tsx`

**Content Source**: `packages/token-optimization/docs/ARCHITECTURE.md`

**Acceptance Criteria**:
- [ ] All architecture content migrated
- [ ] Diagrams converted to Mermaid/SVG
- [ ] Links updated to streamlined-docs pages
- [ ] Interactive examples added

---

#### 10.2 Migrate BEST_PRACTICES.md
**Priority**: P2
**Effort**: 6 hours
**Owner**: TBD
**Dependencies**: None

**New Page**: `apps/streamlined-docs/app/guides/best-practices/page.tsx`

**Content Source**: `packages/token-optimization/docs/BEST_PRACTICES.md`

**Acceptance Criteria**:
- [ ] All best practices migrated
- [ ] Code examples updated
- [ ] Links to relevant API docs
- [ ] Production checklist included

---

#### 10.3 Migrate SECURITY.md
**Priority**: P2
**Effort**: 5 hours
**Owner**: TBD
**Dependencies**: None

**New Page**: `apps/streamlined-docs/app/guides/security/page.tsx`

**Content Source**: `packages/token-optimization/docs/SECURITY.md`

**Acceptance Criteria**:
- [ ] All security content migrated
- [ ] OWASP compliance documented
- [ ] Threat model included
- [ ] Security checklist

---

#### 10.4 Migrate TROUBLESHOOTING.md
**Priority**: P2
**Effort**: 3 hours
**Owner**: TBD
**Dependencies**: None

**New Page**: `apps/streamlined-docs/app/guides/troubleshooting/page.tsx`

**Content Source**: `packages/token-optimization/docs/TROUBLESHOOTING.md`

**Acceptance Criteria**:
- [ ] All troubleshooting content migrated
- [ ] Error codes documented
- [ ] Debug mode explained
- [ ] Links to relevant solutions

---

### Milestone: Additional Tools & Components
**Total**: 18 hours | **Dependencies**: P0 complete

#### 11.1 Enhance Token ROI Calculator
**Priority**: P2
**Effort**: 10 hours
**Owner**: TBD
**Dependencies**: 2.1 (achieving 50% cookbook)

**File to Update**: `apps/streamlined-docs/app/tools/token-roi-calculator/page.tsx`

**Required Enhancements**:
- [ ] Prominently display "50-70% baseline reduction"
- [ ] Add "up to 90% with provider caching" scenario
- [ ] Monthly cost comparison chart
- [ ] Payback period calculation
- [ ] Export results to PDF
- [ ] Share results via URL

**Acceptance Criteria**:
- [ ] Calculator shows 50-70% baseline prominently
- [ ] Multiple scenario support
- [ ] Cost projection charts
- [ ] Export and share functionality

---

#### 11.2 Create Token Cost Comparison Tool
**Priority**: P2
**Effort**: 8 hours
**Owner**: TBD
**Dependencies**: 2.1, 6.9 (countTokens API doc)

**New Page**: `apps/streamlined-docs/app/tools/cost-comparison/page.tsx`

**Features**:
- Compare costs across all major providers
- Input: text, model selections
- Output: cost breakdown, cheapest option
- Integration with optimization strategies
- Export comparison table

**Acceptance Criteria**:
- [ ] All major providers included
- [ ] Real-time cost calculation
- [ ] Optimization strategy recommendations
- [ ] Export to CSV/PDF

---

### Milestone: Additional Interactive Content
**Total**: 8 hours | **Dependencies**: P0 demos complete

#### 12.1 Create Compression Quality Demo
**Priority**: P2
**Effort**: 4 hours
**Owner**: TBD
**Dependencies**: 4.2, 6.4-6.6 (compressor API docs)

**New Section**: Add to `apps/streamlined-docs/app/examples/token-optimization/page.tsx`

**Features**:
- Input text for compression
- Select compression strategy
- Adjust target ratio
- Display quality metrics
- Show before/after comparison

**Acceptance Criteria**:
- [ ] All 3 compressors available
- [ ] Quality metrics displayed
- [ ] Visual diff of compressed text
- [ ] Cost savings calculation

---

#### 12.2 Create Routing Decision Visualizer
**Priority**: P2
**Effort**: 4 hours
**Owner**: TBD
**Dependencies**: 4.3, 6.7 (ModelRouter API doc)

**New Section**: Add to `apps/streamlined-docs/app/examples/token-optimization/page.tsx`

**Features**:
- Input queries of varying complexity
- Visualize routing decisions
- Show model selection rationale
- Display cost comparison
- Chart routing distribution

**Acceptance Criteria**:
- [ ] Complexity scoring visualized
- [ ] Routing logic explained
- [ ] Cost comparison shown
- [ ] Distribution charts

---

## P2 Summary

**Total**: 46 hours (6 working days)
**Can Ship After Release**: These items enhance documentation but aren't critical.

**Milestone Breakdown**:
1. Documentation Migration: 20 hours (3-6 hours per guide)
2. Additional Tools & Components: 18 hours (8-10 hours per tool)
3. Additional Interactive Content: 8 hours (4 hours per demo)

---

## Implementation Strategy

### Phase-Based Approach

**Week 1-3: P0 Critical Path**
- Days 1-2: Value proposition fixes (10 hours)
- Days 3-8: Cookbooks (40 hours)
- Days 9-16: API reference pages (90 hours) ← Parallelize across 3 devs
- Days 17-19: Demo enhancements (28 hours)
- Days 19: Navigation & search (8 hours)

**Week 4-5: P1 Pre-Release**
- Days 1-3: Advanced guides (24 hours)
- Days 4-8: Additional API docs (30 hours) ← Parallelize
- Days 9-11: Content quality (33 hours)

**Week 6: P2 Post-Release**
- Days 1-3: Migration (20 hours)
- Days 4-5: Tools (18 hours)
- Day 6: Interactive content (8 hours)

### Parallelization Opportunities

**Can Work Simultaneously**:
- Value prop fixes (1 dev)
- Cookbooks (2 devs, 3-4 each)
- API reference pages (3 devs, 6 each)
- Demo enhancements (1 dev)
- Navigation (1 dev)

**Total Team Size**: 5-7 developers
**Optimal Timeline**: 4-6 weeks
**Minimum Timeline**: 3 weeks (if heavily parallelized)

---

## Quality Gates

### Before Marking P0 Complete:
- [ ] All "80%+" references replaced with "50-70%"
- [ ] All 7 cookbooks created and tested
- [ ] All 18 HIGHEST priority API docs created
- [ ] All 4 demos show cost savings prominently
- [ ] BeforeAfterComparison component working
- [ ] SavingsDashboard component working
- [ ] Navigation shows "Save 50-70%" badge
- [ ] Search prioritizes token optimization
- [ ] No broken links remain
- [ ] All code examples compile and run

### Before Marking P1 Complete:
- [ ] All 3 advanced guides created
- [ ] All 6 MEDIUM priority API docs created
- [ ] All imports verified
- [ ] Terminology standardized
- [ ] Version info on all API pages
- [ ] Code style consistent
- [ ] TypeScript examples included
- [ ] Component names consistent
- [ ] Markdown formatting consistent

### Before Marking P2 Complete:
- [ ] All package docs migrated
- [ ] ROI calculator enhanced
- [ ] Cost comparison tool created
- [ ] Compression demo added
- [ ] Routing visualizer added

---

## Dependency Graph

```
1.1 (value prop fix)
├─→ 1.2 (real-world examples breakdown)
├─→ 1.3 (provider caching context)
├─→ 1.4 (deprecation notice)
├─→ 2.1-2.7 (all cookbooks)
│   ├─→ 4.1 (enhance demos)
│   ├─→ 4.2 (BeforeAfter component)
│   ├─→ 4.3 (Savings dashboard)
│   └─→ 6.2-6.19 (API reference pages)
│       ├─→ 7.1-7.3 (advanced guides)
│       ├─→ 8.1-8.6 (MEDIUM priority API docs)
│       └─→ 9.1-9.7 (content quality)
├─→ 5.1 (navigation)
├─→ 5.2 (search metadata)
└─→ 5.3 (search priority)
```

**Critical Path**: 1.1 → 2.1-2.7 → 6.2-6.19 → Phase 5

---

## Risk Analysis

### High Risk Items:
1. **API Reference Pages (90 hours)** - Large volume, requires deep API knowledge
   - **Mitigation**: Parallelize across 3 devs, use template, automate where possible

2. **Cookbooks (40 hours)** - Requires working knowledge of optimization strategies
   - **Mitigation**: Start with cookbook 2.1 (achieving 50%), use as template for others

3. **Demo Components (28 hours)** - Complex interactive components with real-time calculations
   - **Mitigation**: Reuse existing component patterns, extensive testing

### Medium Risk Items:
1. **Advanced Guides (24 hours)** - Requires deep technical knowledge
   - **Mitigation**: Work with subject matter experts, reference package docs

2. **Content Quality (33 hours)** - Large surface area of existing content
   - **Mitigation**: Automated tooling (linters, grep), batch processing

### Low Risk Items:
1. **Value Prop Fixes (10 hours)** - Straightforward search and replace
2. **Navigation (8 hours)** - Simple UI updates
3. **Documentation Migration (20 hours)** - Content already exists

---

## Success Metrics

### Token Optimization Prominence Score Target: ≥80/100

**Current**: 35/100
**After P0**: 70/100
**After P1**: 80/100
**After P2**: 85/100

**Score Improvements**:
| Criteria | Current | After P0 | After P1 | After P2 |
|----------|---------|----------|----------|----------|
| Landing page mentions 50-70% | 0/15 | 15/15 | 15/15 | 15/15 |
| Savings calculator visible | 10/15 | 10/15 | 10/15 | 15/15 |
| Navigation highlights optimization | 5/10 | 10/10 | 10/10 | 10/10 |
| API reference has badges | 0/10 | 8/10 | 10/10 | 10/10 |
| Dedicated guide exists | 10/10 | 10/10 | 10/10 | 10/10 |
| Before/after examples | 0/10 | 10/10 | 10/10 | 10/10 |
| Live demos | 5/10 | 10/10 | 10/10 | 10/10 |
| Cookbooks | 0/10 | 10/10 | 10/10 | 10/10 |
| Search priority | 5/10 | 7/10 | 7/10 | 7/10 |
| API docs mention cost | 0/10 | 0/10 | 8/10 | 8/10 |
| **TOTAL** | **35/100** | **90/100** | **100/100** | **105/100** |

---

## Next Phase: Phase 4 (Content Generation)

After completing priority classification, Phase 4 will:
1. Generate all cookbooks (2.1-2.7)
2. Generate all API reference pages (6.2-6.19, 8.1-8.6)
3. Generate all guides (7.1-7.3, 10.1-10.4)
4. Generate all components (4.2-4.3, 11.1-11.2, 12.1-12.2)
5. Apply all fixes (1.1-1.4, 4.1, 5.1-5.3, 6.1, 9.1-9.7)

**Phase 4 Output**: 47 files created/updated, ready for Phase 5 validation.

---

**Priority Classification Complete** ✅
**Total Work Items Classified**: 47
**Ready for Phase 4**: Content Generation
