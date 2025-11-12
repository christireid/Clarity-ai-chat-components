# Documentation Migration Status

**Last Updated**: 2025-11-11
**Status**: In Progress

---

## Overview

Migrating documentation from 3 sources into a single Next.js documentation site:
- `apps/docs/` (VitePress) - 32 guide files, 6 API files, 3 example files, 3 integration files
- `docs/` (root) - Additional guides, API docs, enterprise docs, research docs
- `blog/` - Blog posts and HTML demos
- `commercial-docs/` - Commercial documentation

**Target**: `apps/docs/` (Next.js) ✅ **COMPLETE** - Renamed from `apps/docs-site/`

---

## Migration Pattern

The Next.js docs site uses React components (`page.tsx`) for guides, not MDX files. Each guide needs to be converted from markdown to a React component following this pattern:

```tsx
import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Guide Title - Clarity Chat',
  description: 'Guide description',
}

export default function GuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Guide Title</h1>
        <p className="docs-lead">Guide description</p>
      </div>

      <section className="docs-section">
        {/* Content sections */}
      </section>
    </div>
  )
}
```

### Key Components Available:
- `<CodeBlock language="tsx" code={...} />` - For code examples
- `<Callout type="info|warning|error|tip" title="...">` - For callouts/admonitions
- Standard HTML/JSX for content

---

## Migration Checklist

### Guides from `apps/docs/guide/` (32 files)

**Already Migrated** (exist in `apps/docs/app/guides/`):
- [x] accessibility
- [x] agents
- [x] rag
- [x] streaming
- [x] token-optimization
- [x] performance
- [x] testing
- [x] security
- [x] mobile
- [x] state-management
- [x] production-deployment
- [x] error-handling ✅
- [x] getting-started ✅
- [x] installation ✅
- [x] quick-start ✅
- [x] theming ✅
- [x] customization ✅
- [x] components ✅
- [x] hooks ✅
- [x] file-upload ✅
- [x] message-operations ✅
- [x] messages ✅
- [x] model-adapters ✅
- [x] plugins ✅
- [x] migration ✅
- [x] interactive ✅
- [x] prompts ✅
- [x] memory ✅
- [x] observability ✅
- [x] safety ✅
- [x] audit-logging ✅
- [x] multi-tenancy ✅
- [x] rbac ✅
- [x] reranking ✅
- [x] tutorials ✅
- [x] usage-quotas ✅
- [x] webhooks ✅

**Need Migration** (0 files):

### API Docs from `apps/docs/api/` (6 files)

**Migrated**:
- [x] components.md → `apps/docs/app/reference/api/components/` ✅
- [x] hooks.md → `apps/docs/app/reference/api/hooks/` ✅
- [x] model-adapters.md → `apps/docs/app/reference/api/model-adapters/` ✅
- [x] streaming-components.md → `apps/docs/app/reference/api/streaming-components/` ✅
- [x] types.md → `apps/docs/app/reference/api/types/` ✅
- [x] utilities.md → `apps/docs/app/reference/api/utilities/` ✅

### Content from `docs/` (root)

**Guides** (`docs/guides/`):
- [ ] rag-guide.md
- [ ] integration-guide.md
- [ ] usage-examples.md
- [ ] token-optimization.md (may duplicate existing)
- [ ] best-practices.md

**API** (`docs/api/`):
- [ ] primitives.md
- [ ] react-components.md
- [ ] vercel-ai-sdk-hooks.md
- [ ] token-optimization.md

**Enterprise** (`docs/enterprise/`):
- [ ] ENTERPRISE_FEATURES.md
- [ ] QUICK_REFERENCE.md

**Research** (`docs/research/`):
- [ ] vercel-ai-sdk-competitive-analysis.md (consider archiving)
- [ ] create-clarity-assistant-design.md (consider archiving)
- [ ] vercel-ai-observability-adapter.md (consider archiving)
- [ ] vercel-ai-sdk-feature-audit.md (consider archiving)
- [ ] vercel-ai-sdk-integration-guide.md (consider archiving)

### Blog (`blog/`)

**Posts**:
- [x] ai-chat-ux-pain-points-and-solutions.md → `apps/docs/app/blog/` ✅
- [x] the-7-ux-disasters-killing-ai-chat-apps.md → `apps/docs/app/blog/` ✅
- [ ] viral-strategies-research.md → `apps/docs/app/blog/` (optional)

**Demos**:
- [ ] blog/animations/*.html (8 files) - Convert to React components or keep as static HTML
- [ ] blog/assets/*.html (7 files) - Convert to React components or keep as static HTML

### Commercial Docs (`commercial-docs/`)

- [x] CASE_STUDIES.md → `apps/docs/app/enterprise/case-studies/` ✅
- [x] PRICING.md → `apps/docs/app/enterprise/pricing/` ✅
- [ ] IMPLEMENTATION_GUIDE.md → `apps/docs/app/enterprise/` (can be added later)
- [ ] SALES_DECK_OUTLINE.md → `apps/docs/app/enterprise/` (can be added later)
- [ ] TERMS_OF_SERVICE.md → `apps/docs/app/enterprise/` (can be added later)
- [ ] PRIVACY_POLICY.md → `apps/docs/app/enterprise/` (can be added later)
- [ ] LICENSE files → Keep in root or move to appropriate location

### Examples Docs (`apps/docs/examples/`)

- [x] index.md → `apps/docs/app/examples/` ✅ (already exists)
- [x] model-switching.md → `apps/docs/app/examples/model-switching/` ✅
- [x] streaming.md → `apps/docs/app/examples/streaming/` ✅

### Integrations (`apps/docs/integrations/`)

- [x] nextjs.md → `apps/docs/app/integrations/nextjs/` ✅
- [x] remix.md → `apps/docs/app/integrations/remix/` ✅
- [x] vite.md → `apps/docs/app/integrations/vite/` ✅

---

## Migration Steps

### For Each Guide:

1. **Read the markdown file** from source
2. **Create directory** `apps/docs/app/guides/{guide-name}/`
3. **Create `page.tsx`** following the pattern above
4. **Convert markdown to JSX**:
   - Headers → `<h2>`, `<h3>`, etc.
   - Code blocks → `<CodeBlock />` component
   - Callouts → `<Callout />` component
   - Lists → `<ul>`, `<ol>`
   - Links → Update paths to new structure
   - Paragraphs → `<p>`
5. **Add metadata** (title, description)
6. **Test** the page loads correctly
7. **Update navigation** if needed

### For API Docs:

Similar process but place in `apps/docs/app/reference/` structure.

### For Blog Posts:

Create blog section structure and convert markdown to React components or use MDX if supported.

---

## Progress Summary

- **Guides**: 35/35 migrated (100%) ✅ **COMPLETE** (includes RAG, best-practices, integration from docs/)
- **API Docs**: 8/8 migrated (100%) ✅ **COMPLETE** (includes primitives, react-components from docs/api/)
- **Blog**: 2/3 migrated (67%) - index ✅, the-7-ux-disasters ✅, ai-chat-ux-pain-points ✅
- **Enterprise**: 3/3 migrated (100%) ✅ **COMPLETE** (index ✅, pricing ✅, case-studies ✅)
- **Examples**: 2/3 migrated (67%) - index.md already exists, model-switching ✅, streaming ✅
- **Integrations**: 3/3 migrated (100%) ✅ **COMPLETE** (nextjs ✅, remix ✅, vite ✅)

**Overall**: ~15% complete

---

## Next Steps

1. Continue migrating guides (prioritize: error-handling, getting-started, installation)
2. Migrate API docs
3. Set up blog section structure
4. Migrate enterprise docs
5. Migrate examples and integrations
6. Update all internal links
7. Test all pages
8. ✅ Rename `apps/docs-site` → `apps/docs` **COMPLETE**
9. Delete old directories

---

## Notes

- Some guides may have overlapping content - review and merge as needed
- Research docs may be better archived than migrated
- HTML demos in blog may need conversion to React components
- Links will need updating throughout the migration
