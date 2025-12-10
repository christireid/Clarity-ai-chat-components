# VitePress Migration Content (Deprecated)

> **Note**: This directory contains markdown files from a previous VitePress-based documentation system. These files are preserved for reference but are no longer actively maintained.

## Status

- **Status**: Deprecated / Archive
- **Reason**: Documentation has been migrated to Next.js App Router with TSX pages
- **Canonical Docs**: See `/apps/docs/app/` for current documentation

## Known Issues

Some links in these files reference paths that don't exist in the current documentation structure:

- `/api/plugins` - Not implemented
- `/api/safety` - See `/guides/safety/` instead
- `/api/quotas` - See `/guides/usage-quotas/` instead
- `/api/observability` - See `/guides/observability/` instead
- `/api/audit` - See `/guides/audit-logging/` instead

## Migration

If you need content from these files:

1. Check if equivalent content exists in `/apps/docs/app/`
2. If not, the content can be migrated to a new `page.tsx` file
3. Update any broken links to point to existing pages

## Structure

```
vitepress-migration/
├── api/           # API reference markdown (deprecated)
├── examples/      # Example markdown (deprecated)
├── guide/         # Guide markdown (deprecated)
├── integrations/  # Integration markdown (deprecated)
└── package.json   # Legacy config
```
