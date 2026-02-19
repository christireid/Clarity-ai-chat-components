# Documentation Fix Plan - Systematic Approach

> **Created**: January 28, 2026 **Status**: Ready for Execution **Method**: Parallel specialized
> agents for maximum efficiency

---

## Executive Summary

Based on comprehensive indexing and audit, we have identified **7 critical accuracy issues** in the
streamlined-docs site, primarily in cookbook examples. This plan outlines systematic fixes using
parallel agents to ensure zero downtime and complete accuracy.

---

## Phase 1: Critical Fixes (Immediate)

### Issue 1: Incorrect Import - `formatForCaching`

**Severity**: HIGH | **Affected Files**: 4 files

**Files to Fix**:

1. `/apps/streamlined-docs/app/reference/types/caching-options/page.tsx`
2. `/apps/streamlined-docs/app/reference/hooks/use-smart-cache/page.tsx`
3. `/apps/streamlined-docs/app/reference/api/optimization-middleware/page.tsx`
4. `/apps/streamlined-docs/app/reference/api/batch-optimization/page.tsx`

**Find & Replace**:

```typescript
// WRONG (current)
import { formatForCaching } from '@clarity-chat/token-optimization'

// CORRECT (fixed)
import { formatMessagesForProviderCaching } from '@clarity-chat/token-optimization'
```

**Agent Assignment**: `fix-imports-agent-1`

---

### Issue 2: Incorrect Import - `compress`

**Severity**: HIGH | **Affected Files**: 1 file

**Files to Fix**:

1. `/apps/streamlined-docs/app/cookbook/streaming-setup/page.mdx`

**Find & Replace**:

```typescript
// WRONG
import { compress } from '@clarity-chat/token-optimization'
const result = compress(token)

// CORRECT
import { compressText } from '@clarity-chat/token-optimization'
const result = compressText(token)
```

**Agent Assignment**: `fix-imports-agent-2`

---

### Issue 3: Incorrect Import - `compressMessages`

**Severity**: HIGH | **Affected Files**: 1 file

**Files to Fix**:

1. `/apps/streamlined-docs/app/cookbook/openai-streaming-chat/page.mdx`

**Replace With**:

```typescript
// WRONG
import { compressMessages } from '@clarity-chat/token-optimization'
const compressed = await compressMessages(messages, options)

// CORRECT
import { compressText } from '@clarity-chat/token-optimization'
const compressed = await Promise.all(messages.map((msg) => compressText(msg.content, options)))
```

**Agent Assignment**: `fix-imports-agent-3`

---

### Issue 4: Incorrect Import - `countTokens`

**Severity**: HIGH | **Affected Files**: 1 file

**Files to Fix**:

1. `/apps/streamlined-docs/app/cookbook/openai-streaming-chat/page.mdx`

**Replace With**:

```typescript
// WRONG
import { countTokens } from '@clarity-chat/token-optimization'
const count = countTokens(text, 'gpt-4')

// CORRECT (React component)
import { useTokenCount } from '@clarity-chat/token-optimization'
const { count } = useTokenCount(text, { model: 'gpt-4' })

// OR (Server-side)
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter({ model: 'gpt-4' })
const count = counter.count(text)
```

**Agent Assignment**: `fix-imports-agent-4`

---

### Issue 5: Incorrect Import - `trackUsage`

**Severity**: HIGH | **Affected Files**: 1 file

**Files to Fix**:

1. `/apps/streamlined-docs/app/cookbook/openai-streaming-chat/page.mdx`

**Replace With**:

```typescript
// WRONG
import { trackUsage } from '@clarity-chat/token-optimization'
await trackUsage({ model: 'gpt-4', tokens: 150 })

// CORRECT
import { CostTracker } from '@clarity-chat/token-optimization'
const tracker = new CostTracker()
tracker.trackUsage({ model: 'gpt-4', inputTokens: 100, outputTokens: 50 })
```

**Agent Assignment**: `fix-imports-agent-5`

---

### Issue 6: Incorrect Import - `createAnthropicAdapter`

**Severity**: MEDIUM | **Affected Files**: 1 file

**Files to Fix**:

1. `/apps/streamlined-docs/app/cookbook/openai-streaming-chat/page.mdx`

**Replace With**:

```typescript
// WRONG
import { createAnthropicAdapter } from '@clarity-chat/react/adapters'

// CORRECT
import { anthropicAdapter } from '@clarity-chat/react/adapters'
```

**Agent Assignment**: `fix-imports-agent-6`

---

### Issue 7: Missing Export - `useNetworkStatus`

**Severity**: MEDIUM | **Affected Files**: 1 file

**Files to Fix**:

1. `/apps/streamlined-docs/app/cookbook/error-handling/page.mdx`

**Replace With**:

```typescript
// WRONG
import { useNetworkStatus } from '@clarity-chat/react'

// CORRECT (Option 1: Use component)
import { NetworkStatusBanner } from '@clarity-chat/react'

// CORRECT (Option 2: Direct import)
import { useNetworkStatus } from '@clarity-chat/react/components/feedback/NetworkStatusBanner'
```

**Agent Assignment**: `fix-imports-agent-7`

---

## Phase 2: Missing Documentation (High Priority)

### Area 1: Token Optimization - Missing Docs

**Missing Content**:

1. ✅ Migration guide: v2 → v3 (`useTokenBudgetMonitor` → `useTokenBudgetTracking`)
2. ❌ Compression comparison benchmarks
3. ❌ Caching strategy decision tree
4. ❌ Provider caching setup guide (Anthropic specific)
5. ❌ Performance impact analysis

**Agent Assignment**: `docs-writer-token-optimization`

**Deliverables**:

- `/apps/streamlined-docs/app/guides/token-optimization/migration-v2-v3.mdx`
- `/apps/streamlined-docs/app/guides/token-optimization/compression-benchmarks.mdx`
- `/apps/streamlined-docs/app/guides/token-optimization/caching-decision-tree.mdx`
- `/apps/streamlined-docs/app/guides/token-optimization/anthropic-caching-setup.mdx`
- `/apps/streamlined-docs/app/guides/token-optimization/performance-analysis.mdx`

---

### Area 2: Streaming & Virtualization - Missing Docs

**Missing Content**:

1. ❌ Virtual scrolling best practices
2. ❌ Performance optimization guide
3. ❌ Memory management for long conversations
4. ❌ Streaming error handling patterns
5. ❌ SSE vs WebSocket decision guide

**Agent Assignment**: `docs-writer-streaming`

**Deliverables**:

- `/apps/streamlined-docs/app/guides/streaming/virtual-scrolling.mdx`
- `/apps/streamlined-docs/app/guides/streaming/performance-optimization.mdx`
- `/apps/streamlined-docs/app/guides/streaming/memory-management.mdx`
- `/apps/streamlined-docs/app/guides/streaming/error-handling-patterns.mdx`
- `/apps/streamlined-docs/app/guides/streaming/sse-vs-websocket.mdx`

---

### Area 3: RAG & Document Processing - Missing Docs

**Missing Content**:

1. ❌ Document loader API reference for each format
2. ❌ Embedding provider comparison
3. ❌ Chunking strategy decision guide
4. ❌ Vector store setup guides
5. ❌ RAG pipeline configuration

**Agent Assignment**: `docs-writer-rag`

**Deliverables**:

- `/apps/streamlined-docs/app/reference/api/document-loaders/` (folder with per-format docs)
- `/apps/streamlined-docs/app/guides/rag/embedding-providers.mdx`
- `/apps/streamlined-docs/app/guides/rag/chunking-strategies.mdx`
- `/apps/streamlined-docs/app/guides/rag/vector-stores.mdx`
- `/apps/streamlined-docs/app/guides/rag/pipeline-configuration.mdx`

---

### Area 4: Tool Calling & Registry - Missing Docs

**Missing Content**:

1. ❌ Tool registry API reference
2. ❌ Tool definition guide
3. ❌ Tool execution lifecycle
4. ❌ Approval workflow customization
5. ❌ Tool chaining examples

**Agent Assignment**: `docs-writer-tools`

**Deliverables**:

- `/apps/streamlined-docs/app/reference/api/tool-registry.mdx`
- `/apps/streamlined-docs/app/guides/tools/defining-tools.mdx`
- `/apps/streamlined-docs/app/guides/tools/execution-lifecycle.mdx`
- `/apps/streamlined-docs/app/guides/tools/approval-workflows.mdx`
- `/apps/streamlined-docs/app/guides/tools/tool-chaining.mdx`

---

## Phase 3: API Reference Completion

### Component API References (Missing: 118 of 245)

**Strategy**: Generate from TypeScript interfaces using automated extraction

**Agent Assignment**: `api-ref-generator-components`

**Approach**:

1. Read component TypeScript files
2. Extract prop interfaces
3. Generate markdown documentation
4. Include usage examples
5. Link related components/hooks

**Template Structure**:

````markdown
# ComponentName

## Overview

[Brief description]

## Import

```tsx
import { ComponentName } from '@clarity-chat/react'
```
````

## Props

[Auto-generated props table]

## Examples

### Basic Usage

[Code example]

### Advanced Usage

[Code example]

## Related

- [RelatedComponent](/reference/components/related)
- [useRelatedHook](/reference/hooks/use-related)

## Accessibility

[ARIA attributes, keyboard navigation]

````

**Deliverables**: 118 component reference pages

---

### Hook API References (Missing: 27 of 50)

**Agent Assignment**: `api-ref-generator-hooks`

**Same approach as components**, with focus on:
- Parameters
- Return type
- Usage patterns
- Common pitfalls

**Deliverables**: 27 hook reference pages

---

## Phase 4: Interactive Demos & Examples

### Live Demos (Missing: 8 of 25)

**Agent Assignment**: `demo-builder`

**Missing Demos**:
1. Virtual scrolling performance demo
2. Compression comparison demo (live)
3. Semantic cache visualization
4. Tool approval workflow demo
5. RAG document chunking demo
6. Model routing decision viewer
7. Cost tracking dashboard
8. Memory management demo

**Deliverables**: 8 interactive Next.js demo pages in `/apps/streamlined-docs/app/examples/`

---

### Cookbook Recipes (Missing: 10 of 43)

**Agent Assignment**: `cookbook-writer`

**Missing Recipes**:
1. Hybrid search implementation
2. Reranking strategies
3. Tool result caching
4. Parallel tool execution
5. Streaming with compression
6. Provider caching migration
7. Multi-tier caching setup
8. Semantic similarity tuning
9. Budget enforcement patterns
10. Cost alerting setup

**Deliverables**: 10 cookbook recipe pages in `/apps/streamlined-docs/app/cookbook/`

---

## Execution Strategy

### Parallel Agent Deployment

```mermaid
graph TD
    A[Start] --> B[Phase 1: Critical Fixes]
    B --> C1[fix-imports-agent-1]
    B --> C2[fix-imports-agent-2]
    B --> C3[fix-imports-agent-3]
    B --> C4[fix-imports-agent-4]
    B --> C5[fix-imports-agent-5]
    B --> C6[fix-imports-agent-6]
    B --> C7[fix-imports-agent-7]

    C1 --> D[Validate Fixes]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    C6 --> D
    C7 --> D

    D --> E[Phase 2: Missing Docs]
    E --> F1[docs-writer-token-optimization]
    E --> F2[docs-writer-streaming]
    E --> F3[docs-writer-rag]
    E --> F4[docs-writer-tools]

    F1 --> G[Review & Test]
    F2 --> G
    F3 --> G
    F4 --> G

    G --> H[Phase 3: API References]
    H --> I1[api-ref-generator-components]
    H --> I2[api-ref-generator-hooks]

    I1 --> J[Review & Link]
    I2 --> J

    J --> K[Phase 4: Demos & Examples]
    K --> L1[demo-builder]
    K --> L2[cookbook-writer]

    L1 --> M[Final Validation]
    L2 --> M

    M --> N[Deploy to Production]
````

### Agent Configuration

Each agent will:

1. **Read** relevant source files
2. **Write** or **Edit** target documentation files
3. **Validate** rendered output (no errors)
4. **Report** completion status

### Quality Checks

After each phase:

1. Build streamlined-docs site: `pnpm build`
2. Check for TypeScript errors
3. Verify all imports resolve
4. Test interactive demos
5. Validate cross-references

---

## Timeline Estimate

| Phase     | Agent Count   | Est. Duration  | Dependencies      |
| --------- | ------------- | -------------- | ----------------- |
| Phase 1   | 7 parallel    | 15 minutes     | None              |
| Phase 2   | 4 parallel    | 45 minutes     | Phase 1 complete  |
| Phase 3   | 2 parallel    | 60 minutes     | Phase 2 complete  |
| Phase 4   | 2 parallel    | 45 minutes     | Phase 3 complete  |
| **Total** | **15 agents** | **~2.5 hours** | Sequential phases |

With full parallelization within phases, total wall-clock time: **~2.5 hours**

---

## Success Criteria

### Phase 1 Success

- ✅ All 7 import errors fixed
- ✅ Site builds without errors
- ✅ All cookbook examples run successfully

### Phase 2 Success

- ✅ 20 new guide pages created
- ✅ All guides render without errors
- ✅ Cross-references validated

### Phase 3 Success

- ✅ 145 API reference pages created
- ✅ All props/parameters documented
- ✅ All examples tested

### Phase 4 Success

- ✅ 8 interactive demos working
- ✅ 10 cookbook recipes added
- ✅ All examples validated

### Overall Success

- ✅ Site builds with zero errors
- ✅ All documentation accurate
- ✅ All links functional
- ✅ All demos interactive
- ✅ Complete API coverage

---

## Risk Mitigation

### Risk 1: Build Failures

**Mitigation**: Each agent validates their changes by checking TypeScript compilation before marking
complete.

### Risk 2: Cross-Reference Breaks

**Mitigation**: Final validation step checks all internal links and reports broken references.

### Risk 3: Example Code Doesn't Work

**Mitigation**: All cookbook examples include working test files that are executed before
deployment.

### Risk 4: Performance Degradation

**Mitigation**: Monitor build time and bundle size. If bundle grows >10%, investigate lazy loading
opportunities.

---

## Post-Deployment

### Monitoring

1. Check deployment logs for errors
2. Verify all pages render in production
3. Test interactive demos in prod environment
4. Monitor user feedback channels

### Maintenance

1. Add to CI/CD: automated link checking
2. Add to CI/CD: example code validation
3. Schedule quarterly documentation audits
4. Set up automated API drift detection

---

## Next Steps

**Immediate**: Execute Phase 1 (Critical Fixes) using 7 parallel agents **After Phase 1**: Review
and validate all fixes **Continue**: Execute Phases 2-4 systematically

**Estimated Completion**: All phases complete in ~2.5 hours of wall-clock time

---

**Created**: January 28, 2026 **Last Updated**: January 28, 2026 **Status**: Ready for Execution
