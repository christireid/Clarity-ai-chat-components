# Documentation Migration Notes

## Status

✅ **Completed:**
- Blog content moved to `app/blog/`
- Commercial docs moved to `app/commercial/`

⚠️ **Pending:**
- VitePress docs (`apps/docs/`) content needs to be migrated
- 46 markdown files in `apps/docs/` need to be converted to Next.js pages or integrated

## VitePress to Next.js Migration

The `apps/docs/` directory contains VitePress markdown files that need to be migrated to Next.js pages.

### Content to Migrate:

**Guides (30+ files):**
- `guide/getting-started.md` → Already exists in `app/learn/quick-start/` (verify content)
- `guide/installation.md` → Already exists in `app/learn/installation/` (verify content)
- `guide/streaming.md` → Check if exists in `app/guides/`
- `guide/token-optimization.md` → Check if exists in `app/guides/`
- `guide/error-handling.md` → Check if exists in `app/guides/`
- `guide/memory.md` → Check if exists in `app/guides/`
- `guide/theming.md` → Check if exists in `app/guides/`
- `guide/rag.md` → Check if exists in `app/guides/`
- `guide/performance.md` → Check if exists in `app/guides/`
- And 20+ more guides...

**API Documentation (6 files):**
- `api/components.md` → Should be in `app/reference/components/`
- `api/hooks.md` → Should be in `app/reference/hooks/`
- `api/model-adapters.md` → Should be in `app/reference/` or `app/api/`
- `api/streaming-components.md` → Should be in `app/reference/components/`
- `api/types.md` → Should be in `app/reference/types/`
- `api/utilities.md` → Should be in `app/reference/utilities/`

**Examples (3 files):**
- `examples/index.md` → Should be in `app/examples/`
- `examples/model-switching.md` → Should be in `app/examples/`
- `examples/streaming.md` → Should be in `app/examples/`

**Integrations (3 files):**
- `integrations/nextjs.md` → Should be in `app/guides/integrations/nextjs/`
- `integrations/remix.md` → Should be in `app/guides/integrations/remix/`
- `integrations/vite.md` → Should be in `app/guides/integrations/vite/`

**Cookbook:**
- `cookbook.md` → Already exists in `app/cookbook/` (verify content)

## Migration Strategy

1. **Content Audit:** Compare VitePress content with existing Next.js pages
2. **Identify Gaps:** Find content that doesn't exist in Next.js docs
3. **Merge Content:** Integrate unique content from VitePress into Next.js pages
4. **Convert Format:** Convert markdown to TSX pages if needed, or use MDX
5. **Update Links:** Fix all internal links
6. **Delete Old:** Remove `apps/docs/` after migration complete

## Next Steps

1. Create comparison script to identify content differences
2. Migrate unique content from VitePress docs
3. Update navigation and links
4. Test documentation site
5. Delete `apps/docs/` directory
6. Rename `apps/docs-site/` → `apps/docs/`
