# Content Migration Guide

This document describes the content that has been migrated from various sources into the docs-site for integration.

## Migration Status

### ✅ Content Copied (Ready for Integration)

#### 1. Blog Content
**Source:** `/blog/`  
**Destination:** `content/blog/`

**Files:**
- `ai-chat-ux-pain-points-and-solutions.md`
- `the-7-ux-disasters-killing-ai-chat-apps-v2.md`
- `the-7-ux-disasters-killing-ai-chat-apps.md`
- `viral-strategies-research.md`
- `animations/` (8 HTML demo files)
- `assets/` (7 HTML demo files)

**Next Steps:**
- Create Next.js pages in `app/blog/` for each markdown file
- Create route handlers for HTML demo files
- Update blog index page

#### 2. Commercial Documentation
**Source:** `/commercial-docs/`  
**Destination:** `content/commercial/`

**Files:**
- `CASE_STUDIES.md`
- `IMPLEMENTATION_GUIDE.md`
- `PRICING.md`
- `PRIVACY_POLICY.md`
- `SALES_DECK_OUTLINE.md`
- `TERMS_OF_SERVICE.md`
- `README.md`

**Next Steps:**
- Create Next.js pages in `app/commercial/` for each document
- Link from main navigation
- Ensure proper styling

#### 3. Root Documentation
**Source:** `/docs/`  
**Destination:** `content/guides-migration/`

**Files:**
- `api/` (4 files: primitives.md, react-components.md, token-optimization.md, vercel-ai-sdk-hooks.md)
- `enterprise/` (2 files: ENTERPRISE_FEATURES.md, QUICK_REFERENCE.md)
- `guides/` (5 files: best-practices.md, integration-guide.md, rag-guide.md, token-optimization.md, usage-examples.md)
- `research/` (5 files)
- `TOKEN_OPTIMIZATION_QUICK_REFERENCE.md`

**Next Steps:**
- Merge API docs into `app/reference/`
- Merge enterprise docs into `app/commercial/enterprise/`
- Merge guides into `app/guides/`
- Archive or integrate research docs

#### 4. VitePress Documentation
**Source:** `apps/docs/` (VitePress)  
**Destination:** `content/vitepress-migration/`

**Structure:**
- `guide/` (32 guide files)
- `api/` (6 API documentation files)
- `examples/` (3 example documentation files)
- `integrations/` (3 integration guides)
- `cookbook.md`
- `index.md`

**Next Steps:**
- Review each guide and merge into appropriate `app/guides/` pages
- Merge API docs into `app/reference/`
- Merge integration guides into `app/integrations/` or `app/guides/`
- Integrate cookbook content

## Integration Priority

### High Priority
1. **Enterprise Documentation** - Important for commercial users
   - `content/guides-migration/enterprise/ENTERPRISE_FEATURES.md`
   - `content/guides-migration/enterprise/QUICK_REFERENCE.md`

2. **Missing Guides** - Guides that exist in VitePress but not in Next.js
   - Review `content/vitepress-migration/guide/` for unique content
   - Create corresponding pages in `app/guides/`

### Medium Priority
3. **Blog Integration** - Marketing content
   - Create blog pages in `app/blog/`
   - Set up routing for HTML demos

4. **Commercial Docs** - Sales and legal content
   - Create pages in `app/commercial/`
   - Link from navigation

### Low Priority
5. **Research Documentation** - May be archived or kept separate
   - Review `content/guides-migration/research/`
   - Decide on integration vs archive

## Guide Comparison

### Guides in VitePress (`apps/docs/guide/`)
- accessibility.md ✅ (exists in docs-site)
- agents.md ✅ (exists in docs-site)
- audit-logging.md ❌ (missing)
- components.md ❌ (missing)
- customization.md ❌ (missing)
- error-handling.md ❌ (missing)
- file-upload.md ❌ (missing)
- getting-started.md ❌ (exists as quick-start)
- hooks.md ❌ (missing)
- installation.md ❌ (missing)
- interactive.md ❌ (missing)
- memory.md ❌ (missing)
- message-operations.md ❌ (missing)
- messages.md ❌ (missing)
- migration.md ❌ (missing)
- model-adapters.md ❌ (missing)
- multi-tenancy.md ❌ (missing)
- observability.md ❌ (missing)
- performance.md ✅ (exists in docs-site)
- plugins.md ❌ (missing)
- prompts.md ❌ (missing)
- quick-start.md ❌ (exists as learn/quick-start)
- rag.md ✅ (exists in docs-site)
- rbac.md ❌ (missing)
- reranking.md ❌ (missing)
- safety.md ❌ (missing)
- streaming.md ✅ (exists in docs-site)
- theming.md ❌ (missing)
- token-optimization.md ✅ (exists in docs-site)
- tutorials.md ❌ (missing)
- usage-quotas.md ❌ (missing)
- webhooks.md ❌ (missing)

### Guides in Next.js (`apps/docs-site/app/guides/`)
- accessibility ✅
- agents ✅
- mobile ❌ (not in VitePress)
- performance ✅
- production-deployment ❌ (not in VitePress)
- rag ✅
- security ❌ (not in VitePress)
- state-management ❌ (not in VitePress)
- streaming ✅
- testing ❌ (not in VitePress)
- token-optimization ✅

## Recommended Actions

1. **Create Missing Guide Pages**
   - Add pages for: audit-logging, components, customization, error-handling, file-upload, hooks, installation, memory, message-operations, messages, migration, model-adapters, multi-tenancy, observability, plugins, prompts, rbac, reranking, safety, theming, tutorials, usage-quotas, webhooks

2. **Merge Enterprise Content**
   - Create `app/commercial/enterprise/` pages
   - Integrate enterprise features guide

3. **Set Up Blog**
   - Create `app/blog/` structure
   - Convert markdown to Next.js pages
   - Handle HTML demo files

4. **Clean Up After Integration**
   - Delete source directories after verification
   - Remove migration content directory after integration

## Notes

- All content has been copied to `content/` directories for safe migration
- Source directories remain intact until integration is verified
- Next.js pages need to be created manually or via script
- Consider using MDX for better markdown integration
