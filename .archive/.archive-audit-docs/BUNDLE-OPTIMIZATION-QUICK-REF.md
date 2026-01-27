# Bundle Optimization Quick Reference

**TL;DR:** Bundle can be reduced by **~810KB** through externalization, tree-shaking, and code
splitting.

---

## Top 10 Heaviest Dependencies Still Bundled

| #   | Dependency                   | Size  | Minified  | Files  | Next Action    |
| --- | ---------------------------- | ----- | --------- | ------ | -------------- |
| 1   | react-resizable-panels       | 1.1MB | **~80KB** | 1      | ⚡ Externalize |
| 2   | react-window                 | 940KB | **~25KB** | 1      | 🔄 Consider    |
| 3   | sonner                       | 288KB | **~20KB** | 1      | ⚡ Externalize |
| 4   | react-virtualized-auto-sizer | 100KB | ~8KB      | 1      | 🔄 Consider    |
| 5   | @tanstack/react-virtual      | 36KB  | ~12KB     | 1      | 🔄 Consider    |
| 6   | isomorphic-dompurify         | 24KB  | **~15KB** | 2      | ⚡ Externalize |
| 7   | @radix-ui/react-slot         | ~20KB | ~5KB      | 1      | ✅ Keep        |
| 8   | @clarity-chat/utils          | -     | ~40KB     | Many   | ✅ Internal    |
| 9   | @clarity-chat/memory         | -     | ~30KB     | Medium | ✅ Internal    |
| 10  | @clarity-chat/primitives     | -     | ~15KB     | Many   | ✅ Internal    |

**Legend:** ⚡ High Priority | 🔄 Medium Priority | ✅ Keep Bundled

---

## Externalization Roadmap

### Phase 3: High-Impact Wins (~115KB savings)

```diff
+ react-resizable-panels  →  Peer Dependency  (~80KB saved)
+ sonner                  →  Peer Dependency  (~20KB saved)
+ isomorphic-dompurify    →  Peer Dependency  (~15KB saved)
```

**Timeline:** 1-2 weeks | **Effort:** 4-6 hours | **Risk:** Low

---

### Phase 4: Medium-Impact Optimizations (~95KB savings)

```diff
+ Virtual scrolling bundle →  Peer Dependencies  (~45KB saved)
  - @tanstack/react-virtual
  - react-window
  - react-virtualized-auto-sizer

+ React import optimization  →  Named imports    (~50KB saved)
  - Convert 399 namespace imports
  - Replace 396 barrel exports
```

**Timeline:** 1 month | **Effort:** 16-20 hours | **Risk:** Medium

---

### Phase 5: Code Splitting (~500KB initial load reduction)

New entry points to create:

- `./dashboards` - 200KB
- `./ai-ops` - 150KB
- `./enterprise` - 100KB
- `./media` - 80KB
- `./search` - 50KB
- `./testing` - 100KB

**Timeline:** 2-3 months | **Effort:** 24-32 hours | **Risk:** Medium

---

## Tree-Shaking Issues

### Issue #1: React Namespace Imports (399 files)

```typescript
// ❌ Current (399 files)
import * as React from 'react'

// ✅ Optimized
import { useState, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
```

**Savings:** 50-100KB

---

### Issue #2: Barrel Exports (396 files)

```typescript
// ❌ Current
export * from './ComponentA'
export * from './ComponentB'

// ✅ Optimized
export { ComponentA, type ComponentAProps } from './ComponentA'
export { ComponentB, type ComponentBProps } from './ComponentB'
```

**Savings:** 30-50KB

---

### Issue #3: Limited Dynamic Imports

```typescript
// ✅ Add lazy loading for heavy features
const AnalyticsDashboard = lazy(() => import('./dashboards/AnalyticsDashboard'))
const SafetyReviewConsole = lazy(() => import('./ai-ops/SafetyReviewConsole'))
```

**Savings:** 300-400KB initial load

---

## Dead Code Opportunities

| Category              | Location                      | Est. Size | Action              |
| --------------------- | ----------------------------- | --------- | ------------------- |
| Testing utils         | `utils/testing-helpers.tsx`   | ~40KB     | Move to `./testing` |
| Dev helpers           | `utils/dev-helpers.ts`        | ~20KB     | Move to `./dev`     |
| Visual regression     | `utils/visual-regression.ts`  | ~30KB     | Move to `./testing` |
| Migration helpers     | `utils/migration-helpers.tsx` | ~20KB     | Remove in v2.0      |
| Deprecated components | Various                       | ~50KB     | Audit & remove      |

**Total:** ~160KB removable

---

## Bundle Size Targets

| Bundle              | Current | Phase 3 | Phase 5   | Reduction  |
| ------------------- | ------- | ------- | --------- | ---------- |
| **Full (minified)** | 800KB   | 685KB   | **450KB** | **44%** ⬇️ |
| **Full (gzip)**     | 220KB   | 190KB   | **120KB** | **45%** ⬇️ |
| Core                | 500KB   | 450KB   | 350KB     | 30% ⬇️     |
| Core-minimal        | 30KB    | 30KB    | 25KB      | 17% ⬇️     |

---

## Quick Wins (Do This Week)

### 1. Add Bundle Size Monitoring

```bash
pnpm add -D @next/bundle-analyzer webpack-bundle-analyzer
```

### 2. Set Up CI Check

```yaml
# .github/workflows/bundle-size.yml
- uses: andresz1/size-limit-action@v1
```

### 3. Run Dead Code Analysis

```bash
npx knip
npx ts-prune | head -100
```

### 4. Measure Current State

```bash
pnpm size
du -sh dist/*.{js,mjs}
```

---

## Optimization Checklist

### Before Externalizing a Dependency

- [ ] Check usage count (how many files import it?)
- [ ] Verify it's truly optional
- [ ] Create fallback or error handling
- [ ] Add to peer dependencies with `optional: true`
- [ ] Update documentation
- [ ] Add example showing how to install it
- [ ] Test with and without the peer dependency

### Before Creating New Entry Point

- [ ] Identify logical feature grouping
- [ ] Measure size of new bundle
- [ ] Update package.json exports
- [ ] Update tsup.config.ts entries
- [ ] Add TypeScript declarations
- [ ] Document import path in README
- [ ] Test tree-shaking effectiveness

---

## Commands Reference

```bash
# Build & analyze
pnpm build
pnpm size
pnpm size:why

# Find issues
npx knip                    # Dead code
npx ts-prune               # Unused exports
grep -r "import \*" src/   # Namespace imports
grep -r "export \*" src/   # Barrel exports

# Measure sizes
du -sh dist/*.mjs
du -sh node_modules/PACKAGE_NAME

# Test tree-shaking
npx esbuild --bundle --analyze src/index.ts
```

---

## Impact Summary

### Total Optimization Potential

```
┌─────────────────────────────────────────┐
│  Current:  800KB minified                │
│  Target:   450KB minified                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Reduction: 350KB (44% smaller) ⬇️       │
│                                          │
│  Breakdown:                              │
│  • Externalization:  160KB (20%)         │
│  • Tree-shaking:     150KB (19%)         │
│  • Code splitting:   500KB* (initial)    │
│  • Dead code:        160KB (20%)         │
│                                          │
│  *Reduces initial load, not total size  │
└─────────────────────────────────────────┘
```

### Per-Phase Savings

```
Phase 3:  115KB  [██████████░░░░░░░░░░] 26% of target
Phase 4:   95KB  [████████░░░░░░░░░░░░] 21% of target
Phase 5:  600KB* [████████████████████] 53% of target

Total:    810KB* [████████████████████] 100% achieved
```

---

## Next Steps

### This Week

1. Review BUNDLE-ANALYSIS.md full report
2. Approve Phase 3 implementation plan
3. Set up bundle size monitoring

### This Month

4. Implement Phase 3 externalizations
5. Measure and document improvements
6. Begin Phase 4 planning

### Next Quarter

7. Convert React imports to named exports
8. Create new entry points
9. Run comprehensive dead code analysis

---

**Quick Links:**

- Full Analysis: [BUNDLE-ANALYSIS.md](./BUNDLE-ANALYSIS.md)
- Build Config: [tsup.config.ts](./tsup.config.ts)
- Size Limits: [.size-limit.js](./.size-limit.js)
- Package Info: [package.json](./package.json)

**Last Updated:** January 26, 2026
