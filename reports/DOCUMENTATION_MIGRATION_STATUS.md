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

**Target**: `apps/docs-site/` (Next.js) → will become `apps/docs/`

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

**Already Migrated** (exist in `apps/docs-site/app/guides/`):
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

**Need Migration**:
- [ ] components.md → `apps/docs-site/app/reference/components/`
- [ ] hooks.md → `apps/docs-site/app/reference/hooks/`
- [ ] model-adapters.md → `apps/docs-site/app/reference/`
- [ ] streaming-components.md → `apps/docs-site/app/reference/components/`
- [ ] types.md → `apps/docs-site/app/reference/types/`
- [ ] utilities.md → `apps/docs-site/app/reference/utilities/`

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
- [ ] ai-chat-ux-pain-points-and-solutions.md → `apps/docs-site/app/blog/`
- [ ] the-7-ux-disasters-killing-ai-chat-apps.md → `apps/docs-site/app/blog/`
- [ ] the-7-ux-disasters-killing-ai-chat-apps-v2.md → `apps/docs-site/app/blog/`
- [ ] viral-strategies-research.md → `apps/docs-site/app/blog/`

**Demos**:
- [ ] blog/animations/*.html (8 files) - Convert to React components or keep as static HTML
- [ ] blog/assets/*.html (7 files) - Convert to React components or keep as static HTML

### Commercial Docs (`commercial-docs/`)

- [ ] CASE_STUDIES.md → `apps/docs-site/app/enterprise/`
- [ ] IMPLEMENTATION_GUIDE.md → `apps/docs-site/app/enterprise/`
- [ ] PRICING.md → `apps/docs-site/app/enterprise/`
- [ ] SALES_DECK_OUTLINE.md → `apps/docs-site/app/enterprise/`
- [ ] TERMS_OF_SERVICE.md → `apps/docs-site/app/enterprise/`
- [ ] PRIVACY_POLICY.md → `apps/docs-site/app/enterprise/`
- [ ] LICENSE files → Keep in root or move to appropriate location

### Examples Docs (`apps/docs/examples/`)

- [ ] index.md → `apps/docs-site/app/examples/`
- [ ] model-switching.md → `apps/docs-site/app/examples/`
- [ ] streaming.md → `apps/docs-site/app/examples/`

### Integrations (`apps/docs/integrations/`)

- [ ] nextjs.md → `apps/docs-site/app/integrations/`
- [ ] remix.md → `apps/docs-site/app/integrations/`
- [ ] vite.md → `apps/docs-site/app/integrations/`

---

## Migration Steps

### For Each Guide:

1. **Read the markdown file** from source
2. **Create directory** `apps/docs-site/app/guides/{guide-name}/`
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

Similar process but place in `apps/docs-site/app/reference/` structure.

### For Blog Posts:

Create blog section structure and convert markdown to React components or use MDX if supported.

---

## Progress Summary

- **Guides**: 32/32 migrated (100%) ✅ **COMPLETE**
- **API Docs**: 0/6 migrated (0%)
- **Blog**: 0/4 posts migrated (0%)
- **Enterprise**: 0/2 migrated (0%)
- **Examples**: 0/3 migrated (0%)
- **Integrations**: 0/3 migrated (0%)

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
8. Rename `apps/docs-site` → `apps/docs`
9. Delete old directories

---

## Notes

- Some guides may have overlapping content - review and merge as needed
- Research docs may be better archived than migrated
- HTML demos in blog may need conversion to React components
- Links will need updating throughout the migration
