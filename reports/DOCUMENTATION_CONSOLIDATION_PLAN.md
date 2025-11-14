# Documentation Consolidation Plan

**Status**: Ready for Execution
**Priority**: HIGH
**Estimated Effort**: Medium-High

---

## Overview

Consolidate 3 documentation sites into a single authoritative Next.js-based documentation site.

**Current State**:
- `apps/docs/` (VitePress) - Markdown-based docs
- `apps/docs-site/` (Next.js) - Interactive docs site ✅ **KEEP THIS**
- `docs/` (root) - Additional markdown files

**Target State**:
- `apps/docs/` (Next.js) - Single unified docs site

---

## Step-by-Step Plan

### Phase 1: Content Audit

1. **Map all content sources**:
   - `apps/docs/guide/*.md` → 33 guide files
   - `apps/docs/api/*.md` → 6 API files
   - `apps/docs/examples/*.md` → 3 example files
   - `apps/docs/integrations/*.md` → 3 integration files
   - `docs/guides/*.md` → 5 guide files
   - `docs/api/*.md` → 4 API files
   - `docs/enterprise/*.md` → 2 enterprise files
   - `docs/research/*.md` → 5 research files
   - `blog/*.md` → Blog posts
   - `commercial-docs/*.md` → Commercial docs

2. **Identify duplicates**:
   - Check for overlapping content
   - Determine best version to keep
   - Note any unique content

### Phase 2: Content Migration

#### 2.1 Migrate Guides

**Source**: `apps/docs/guide/*.md` + `docs/guides/*.md`
**Target**: `apps/docs-site/app/guides/`

**Action**:
- Convert markdown files to Next.js pages
- Create page.tsx files for each guide
- Use MDX for markdown content
- Update internal links

**Files to migrate**:
- accessibility.md
- agents.md
- audit-logging.md
- components.md
- customization.md
- error-handling.md
- file-upload.md
- getting-started.md
- hooks.md
- installation.md
- interactive.md
- memory.md
- message-operations.md
- messages.md
- migration.md
- model-adapters.md
- multi-tenancy.md
- observability.md
- performance.md
- plugins.md
- prompts.md
- quick-start.md
- rag.md
- rbac.md
- reranking.md
- safety.md
- streaming.md
- theming.md
- token-optimization.md
- tutorials.md
- usage-quotas.md
- webhooks.md
- best-practices.md (from docs/guides/)
- integration-guide.md (from docs/guides/)
- rag-guide.md (from docs/guides/)
- usage-examples.md (from docs/guides/)

#### 2.2 Migrate API Reference

**Source**: `apps/docs/api/*.md` + `docs/api/*.md`
**Target**: `apps/docs-site/app/reference/`

**Action**:
- Convert to Next.js pages
- Ensure consistent formatting
- Update code examples

**Files to migrate**:
- components.md
- hooks.md
- model-adapters.md
- streaming-components.md
- types.md
- utilities.md
- primitives.md (from docs/api/)
- react-components.md (from docs/api/)
- token-optimization.md (from docs/api/)
- vercel-ai-sdk-hooks.md (from docs/api/)

#### 2.3 Migrate Enterprise Docs

**Source**: `docs/enterprise/*.md` + `commercial-docs/*.md`
**Target**: `apps/docs-site/app/enterprise/`

**Action**:
- Create enterprise section
- Migrate all enterprise content
- Organize commercial docs

**Files to migrate**:
- ENTERPRISE_FEATURES.md
- QUICK_REFERENCE.md
- CASE_STUDIES.md
- IMPLEMENTATION_GUIDE.md
- PRICING.md
- SALES_DECK_OUTLINE.md
- TERMS_OF_SERVICE.md
- PRIVACY_POLICY.md

#### 2.4 Migrate Blog

**Source**: `blog/*.md` + `blog/*.html`
**Target**: `apps/docs-site/app/blog/`

**Action**:
- Create blog section
- Migrate blog posts
- Migrate HTML demos (or convert to React components)

**Files to migrate**:
- ai-chat-ux-pain-points-and-solutions.md
- the-7-ux-disasters-killing-ai-chat-apps.md
- the-7-ux-disasters-killing-ai-chat-apps-v2.md
- viral-strategies-research.md
- animations/*.html (8 files)
- assets/*.html (7 files)

#### 2.5 Migrate Research Docs

**Source**: `docs/research/*.md`
**Target**: `apps/docs-site/app/research/` or archive

**Action**:
- Decide: Keep in docs or archive
- If keeping, create research section
- If archiving, move to `.archive/research/`

**Files**:
- vercel-ai-sdk-competitive-analysis.md
- create-clarity-assistant-design.md
- vercel-ai-observability-adapter.md
- vercel-ai-sdk-feature-audit.md
- vercel-ai-sdk-integration-guide.md

#### 2.6 Migrate Examples Docs

**Source**: `apps/docs/examples/*.md`
**Target**: `apps/docs-site/app/examples/`

**Files**:
- index.md
- model-switching.md
- streaming.md

#### 2.7 Migrate Integrations

**Source**: `apps/docs/integrations/*.md`
**Target**: `apps/docs-site/app/integrations/`

**Files**:
- nextjs.md
- remix.md
- vite.md

### Phase 3: Cleanup

1. **Rename docs-site to docs**:
   ```bash
   mv apps/docs-site apps/docs-new
   rm -rf apps/docs  # Old VitePress site
   mv apps/docs-new apps/docs
   ```

2. **Update package.json**:
   - Update name from `@clarity-chat/docs-site` to `@clarity-chat/docs`
   - Update scripts if needed

3. **Delete old directories**:
   - `docs/` (root) - after migration
   - `blog/` - after migration
   - `commercial-docs/` - after migration (or keep licenses)

4. **Update root package.json**:
   - Update docs scripts to reference `apps/docs`

### Phase 4: Link Updates

1. **Update all internal links**:
   - Search for references to old paths
   - Update README files
   - Update component documentation
   - Update examples

2. **Update external references**:
   - GitHub links
   - Documentation links in code
   - Storybook links

### Phase 5: Verification

1. **Build docs site**:
   ```bash
   cd apps/docs
   pnpm install
   pnpm run build
   ```

2. **Test all pages**:
   - Verify all guides load
   - Verify all API docs load
   - Verify all examples load
   - Check for broken links

3. **Run link checker**:
   - Use tool to find broken links
   - Fix any issues

---

## Migration Checklist

### Content Migration
- [ ] Migrate all guides (33+ files)
- [ ] Migrate all API docs (10+ files)
- [ ] Migrate enterprise docs (8+ files)
- [ ] Migrate blog posts (4+ files)
- [ ] Migrate blog demos (15+ HTML files)
- [ ] Migrate research docs (5 files) or archive
- [ ] Migrate examples docs (3 files)
- [ ] Migrate integrations (3 files)

### Cleanup
- [ ] Rename `apps/docs-site` → `apps/docs`
- [ ] Delete old `apps/docs` (VitePress)
- [ ] Delete `docs/` directory
- [ ] Delete `blog/` directory
- [ ] Delete or archive `commercial-docs/`
- [ ] Update package.json files
- [ ] Update workspace configs

### Link Updates
- [ ] Update README.md links
- [ ] Update component docs links
- [ ] Update example links
- [ ] Update Storybook links
- [ ] Update GitHub links

### Verification
- [ ] Build docs site successfully
- [ ] Test all pages load
- [ ] Check for broken links
- [ ] Verify search works
- [ ] Test navigation

---

## Notes

- **MDX Conversion**: Some markdown files may need conversion to MDX format for Next.js
- **Component Examples**: Code examples may need to be converted to React components
- **HTML Demos**: Blog HTML demos could be converted to React components or kept as static HTML
- **Research Docs**: Consider archiving instead of migrating if not actively used
- **Licenses**: Keep LICENSE files from commercial-docs in appropriate location

---

## Estimated Time

- Content audit: 1-2 hours
- Content migration: 4-6 hours
- Cleanup: 1 hour
- Link updates: 2-3 hours
- Verification: 1-2 hours

**Total**: 9-14 hours

---

## Risks

1. **Content Loss**: Risk of losing content during migration
   - **Mitigation**: Keep backups, migrate incrementally

2. **Broken Links**: Many internal links may break
   - **Mitigation**: Use link checker, update systematically

3. **Format Issues**: Markdown to MDX conversion issues
   - **Mitigation**: Test each file after conversion

4. **Build Failures**: Next.js build may fail with new content
   - **Mitigation**: Test builds incrementally

---

## Success Criteria

✅ Single docs site at `apps/docs/` (Next.js)
✅ All content migrated successfully
✅ No broken links
✅ All pages build successfully
✅ Old documentation directories removed
✅ All references updated

---

**Next Steps**: Execute migration phase by phase, testing after each phase.
