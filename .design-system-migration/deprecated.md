# Deprecated Items

This document tracks deprecated patterns, files, and APIs that should be removed or updated.

## Token Systems to Consolidate

### Docs Site Tokens (`--color-*`)

**Location**: `/apps/docs/styles/globals.css`, `/apps/streamlined-docs/styles/globals.css`

**Status**: To be replaced

**Replacement**: Use canonical tokens from `/packages/react/src/theme/theme.css`

| Old Token                | New Token                                                       |
| ------------------------ | --------------------------------------------------------------- |
| `--color-bg-primary`     | `--background` / `oklch(var(--clarity-background))`             |
| `--color-bg-secondary`   | `--muted` / `oklch(var(--clarity-muted))`                       |
| `--color-text-primary`   | `--foreground` / `oklch(var(--clarity-foreground))`             |
| `--color-text-secondary` | `--muted-foreground` / `oklch(var(--clarity-muted-foreground))` |
| `--color-brand`          | `--primary` / `oklch(var(--clarity-primary))`                   |
| `--glass-bg`             | `--glass-bg-opacity` (use oklch with opacity)                   |
| `--glass-border`         | `--glass-border-opacity` (use oklch with opacity)               |

### Storybook Tokens (`--sb-*`)

**Location**: `/apps/storybook/.storybook/globals.css`

**Status**: To be replaced

**Replacement**: Use canonical tokens

| Old Token             | New Token            |
| --------------------- | -------------------- |
| `--sb-bg-primary`     | `--background`       |
| `--sb-bg-secondary`   | `--muted`            |
| `--sb-text-primary`   | `--foreground`       |
| `--sb-text-secondary` | `--muted-foreground` |
| `--sb-brand-primary`  | `--primary`          |
| `--sb-border`         | `--border`           |

---

## Glass Implementations to Consolidate

### Docs `.glass-card`

**Location**: `/apps/docs/styles/globals.css:1005-1027`

**Status**: To be replaced

**Replacement**: Use `GlassSurface` primitive or `glassVariants` CVA

```tsx
// Old
<div className="glass-card">...</div>

// New
<GlassSurface intensity="medium">...</GlassSurface>
// or
<div className={glassVariants({ intensity: 'medium' })}>...</div>
```

### Duplicate Animation Keyframes

**Issue**: `gradient-shift`, `glow-pulse`, `shimmer` defined in multiple files

**Locations**:

- `/styles/globals.css`
- `/apps/docs/styles/globals.css`
- `/apps/streamlined-docs/styles/globals.css`
- `/packages/react/src/theme/theme.css`
- `/tailwind.config.js`

**Resolution**: Keep only in `/tailwind.config.js` and `/styles/globals.css`

---

## Files to Remove After Migration

| File     | Reason | Dependencies |
| -------- | ------ | ------------ |
| None yet | -      | -            |

---

## APIs to Deprecate

### Theme Builder Legacy API

**Location**: `/packages/react/src/theme/theme-builder.ts`

**Status**: Keep for now (used in ThemeProvider)

**Notes**: May be replaced by modern `create-theme.ts` in future

---

## Migration Notes

### Breaking Changes

None planned - maintaining backwards compatibility with unprefixed CSS variables.

### Deprecation Timeline

1. **Phase 6**: Mark old tokens as deprecated in comments
2. **Phase 9**: Remove unused files after verification
3. **Future**: Consider removing backwards compatibility layer (major version)

---

## Removal Checklist

Before removing any deprecated item:

- [ ] All usages have been migrated
- [ ] Tests pass without the deprecated code
- [ ] No console warnings about missing variables
- [ ] Documentation updated
- [ ] Migration guide provided if public API
