# Bundle Size Monitoring - Quick Reference

## Quick Commands

```bash
# Check if within limits
pnpm size

# Track current sizes
pnpm size:track

# View dashboard
pnpm size:dashboard:open

# Generate visualizations
pnpm size:visualize:open

# View trends
pnpm size:report

# Why is bundle large?
pnpm size:why

# Compare with commit
pnpm size:compare <commit-hash>
```

## Daily Workflow

### Before Starting Work

```bash
# Record baseline
pnpm build && pnpm size:track
```

### After Making Changes

```bash
# Build and check
pnpm build && pnpm size

# View impact
pnpm size:report
```

### Before Committing

```bash
# Verify limits
pnpm size || exit 1
```

### Before PR

```bash
# Generate dashboard for review
pnpm size:dashboard:open
```

## Understanding Output

### Bundle Size Check (`pnpm size`)

```
✔ 📦 Main Bundle (ESM)          304.12 KB
✔ 🎯 Core Bundle (ESM)          120.45 KB
✔ ⚡ Core Minimal (ESM)          35.20 KB
```

- ✔ = Within limit (green)
- ⚠ = Near limit >90% (yellow)
- ✖ = Over limit (red)

### Size Report (`pnpm size:report`)

```
📈 Bundle Size Trend Report
Measurements: 15
Trend: 📉 DECREASING
Change: -5.23%

📊 Size Comparison (Gzipped)
First:  320.45 KB (01/20/2026)
Latest: 303.95 KB (01/26/2026)
Diff:   -16.50 KB
```

### Dashboard Metrics

- **Total Size (Gzip)**: Actual download size
- **Bundle Count**: Number of entry points tracked
- **Compliance**: % of bundles within limits
- **Compression Ratio**: Gzip efficiency

## Bundle Size Limits (Phase 2)

| Entry Point  | Limit  | Purpose              |
| ------------ | ------ | -------------------- |
| Main (ESM)   | 1.3 MB | Full library         |
| Core         | 400 KB | Essential components |
| Core Minimal | 40 KB  | Ultra-light          |
| Slim         | 250 KB | Minimal features     |

## Optimization Checklist

When bundle size increases:

- [ ] Check for new heavy dependencies
- [ ] Verify peer deps are externalized
- [ ] Look for duplicate code
- [ ] Check import statements (no barrel imports)
- [ ] Consider lazy loading
- [ ] Run `pnpm size:why` for analysis
- [ ] Review tree-shaking effectiveness

## File Locations

```
packages/react/
├── .size-limit.js              # Limit configuration
├── .bundle-analysis/           # Analysis data
│   ├── current.json           # Latest measurements
│   ├── phase2-baseline.json   # Phase 2 baseline
│   ├── dashboard.html         # Dashboard
│   ├── history/               # Historical data
│   └── visualizations/        # Visual reports
└── scripts/
    ├── bundle-size-tracker.ts # Tracking tool
    ├── bundle-visualizer.ts   # Visualization generator
    └── bundle-dashboard.ts    # Dashboard generator
```

## CI/CD Integration

### Pull Request Checks

Every PR automatically:

1. Builds all bundles
2. Measures sizes
3. Compares with base branch
4. Posts report as comment
5. Fails if limits exceeded

### PR Comment Structure

```markdown
## 📦 Bundle Size Report

✅ No Significant Change

### Summary

| Metric | Base   | Current | Change |
| ------ | ------ | ------- | ------ |
| Total  | 304 KB | 306 KB  | +2 KB  |

### 📊 Significant Changes

(Lists bundles with >5% or >1KB change)
```

## Troubleshooting

### "Bundle exceeds limit"

```bash
# See what's in the bundle
pnpm size:why

# Compare with baseline
pnpm size:report

# Check if external deps included
pnpm verify:externals
```

### "No history data"

```bash
# Create first measurement
pnpm size:track
```

### Dashboard won't open

```bash
# Generate dashboard
pnpm size:dashboard

# Open manually
open .bundle-analysis/dashboard.html
```

## Best Practices

### DO

- ✅ Run `pnpm size` before committing
- ✅ Track sizes after major changes
- ✅ Review PR bundle reports
- ✅ Keep peer deps externalized
- ✅ Use lazy loading for heavy features

### DON'T

- ❌ Increase limits without discussion
- ❌ Ignore "bundle increased" warnings
- ❌ Import entire libraries (use named imports)
- ❌ Bundle optional dependencies
- ❌ Skip size checks in CI

## Performance Targets

| Network | Speed    | Target Load Time  |
| ------- | -------- | ----------------- |
| Slow 3G | 400 Kbps | <3s (150 KB max)  |
| 3G      | 1.6 Mbps | <2s (400 KB max)  |
| 4G      | 10 Mbps  | <1s (1.25 MB max) |

**Current Main Bundle:** 304 KB (gzip)

- Slow 3G: 6s ⚠️
- 3G: 1.5s ✅
- 4G: 0.24s ✅

## Resources

- [Full Documentation](.bundle-analysis/README.md)
- [Size Limit Config](.size-limit.js)
- [Build Config](tsup.config.ts)
- [CI Workflow](../../.github/workflows/bundle-size.yml)

## Quick Tips

### Reduce Bundle Size

1. **Lazy load heavy components:**

   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent'))
   ```

2. **Use named imports:**

   ```typescript
   // ❌ Bad
   import * as utils from './utils'

   // ✅ Good
   import { formatDate, parseDate } from './utils'
   ```

3. **Check dependency sizes:**

   ```bash
   npx bundlephobia <package-name>
   ```

4. **Externalize peer dependencies:**
   - Add to `peerDependencies` in package.json
   - Add to `external` in tsup.config.ts

### Monitor Effectively

1. **Set up alerts:** Check size after every build
2. **Review trends:** Weekly `pnpm size:report`
3. **Investigate spikes:** Use `pnpm size:why`
4. **Document changes:** Note size impacts in PRs

---

**Phase 2 Baseline:** 304 KB (gzip) | 1.18 MB (raw) **Last Updated:** January 26, 2026
