# Cleanup Plan - Old Documentation Directories

## Status: ✅ Content Safely Migrated

All content from the following directories has been safely copied to `apps/docs-site/content/`:

- ✅ `apps/docs/` → `apps/docs-site/content/vitepress-migration/`
- ✅ `/docs/` → `apps/docs-site/content/guides-migration/`
- ✅ `/blog/` → `apps/docs-site/content/blog/`
- ✅ `/commercial-docs/` → `apps/docs-site/content/commercial/`

## Verification

**Content Files Migrated:** 77 markdown files + HTML/assets
**Location:** `apps/docs-site/content/`

## Safe to Delete

After verifying content integration, the following directories can be safely deleted:

1. **`apps/docs/`** - VitePress documentation (content copied)
2. **`/docs/`** - Root documentation (content copied)
3. **`/blog/`** - Blog content (content copied)
4. **`/commercial-docs/`** - Commercial docs (content copied)

## Deletion Command

```bash
# After verifying content integration:
rm -rf apps/docs
rm -rf docs
rm -rf blog
rm -rf commercial-docs
```

## Notes

- All content is safely preserved in `apps/docs-site/content/`
- Migration guide available at `apps/docs-site/CONTENT_MIGRATION.md`
- Source directories can be kept for reference until integration is complete
