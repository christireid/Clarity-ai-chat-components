# Bundle Size Monitoring System

Comprehensive bundle size tracking and visualization for `@clarity-chat/react`.

## Overview

This directory contains all bundle size analysis data, historical measurements, and visualizations.
The monitoring system tracks bundle sizes over time, compares changes, and ensures we stay within
defined limits.

## Directory Structure

```
.bundle-analysis/
├── README.md                 # This file
├── current.json              # Latest bundle measurements
├── phase2-baseline.json      # Phase 2 baseline (Jan 2026)
├── phase2-comparison.json    # Phase 1 vs Phase 2 comparison
├── dashboard.html            # Interactive dashboard
├── history/                  # Historical measurements
│   └── *.json               # Timestamped measurements
└── visualizations/          # Visual reports
    ├── index.html           # Visualization index
    ├── treemap.html         # Bundle composition treemap
    └── charts.html          # Size comparison charts
```

## Quick Start

### 1. Record Current Bundle Sizes

```bash
pnpm size:track
```

This measures all bundles and saves to `current.json` and `history/`.

### 2. View Dashboard

```bash
pnpm size:dashboard:open
```

Opens an interactive dashboard showing:

- Current bundle sizes
- Limit compliance
- Historical trends
- Compression ratios

### 3. Generate Visualizations

```bash
pnpm size:visualize:open
```

Creates and opens visual reports including:

- Treemap of bundle composition
- Size comparison charts
- Category breakdowns

### 4. Check Size Limits

```bash
pnpm size
```

Validates all bundles against limits defined in `.size-limit.js`.

## Available Commands

### Basic Measurement

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `pnpm size`         | Check if bundles are within limits |
| `pnpm size:why`     | Analyze why a bundle is large      |
| `pnpm size:analyze` | Export size data to JSON           |
| `pnpm size:track`   | Record current bundle sizes        |

### Analysis & Reporting

| Command                      | Description                        |
| ---------------------------- | ---------------------------------- |
| `pnpm size:report`           | Generate trend report from history |
| `pnpm size:compare <commit>` | Compare with specific commit       |
| `pnpm size:dashboard`        | Generate HTML dashboard            |
| `pnpm size:dashboard:open`   | Generate and open dashboard        |

### Visualization

| Command                    | Description                  |
| -------------------------- | ---------------------------- |
| `pnpm size:visualize`      | Generate visualizations      |
| `pnpm size:visualize:open` | Generate and open in browser |

## Phase 2 Baseline

**Date:** January 26, 2026

After externalizing heavy optional dependencies:

| Metric                     | Size                                  |
| -------------------------- | ------------------------------------- |
| **Total Bundle**           | 1.18 MB (304 KB gzip)                 |
| **Reduction from Phase 1** | 73.33%                                |
| **Required Peers**         | 4 (React, Framer Motion, Lucide, Zod) |
| **Optional Peers**         | 12 (mermaid, pdfjs, mammoth, etc.)    |

### Entry Point Limits

Based on Phase 2 measurements with 10% buffer:

| Entry Point       | Limit (gzip) | Purpose              |
| ----------------- | ------------ | -------------------- |
| Main Bundle (ESM) | 1.3 MB       | Full library         |
| Main Bundle (CJS) | 1.4 MB       | CommonJS version     |
| Core Bundle       | 400 KB       | Essential components |
| Core Minimal      | 40 KB        | Ultra-light bundle   |
| Slim Bundle       | 250 KB       | Minimal features     |
| Utils             | 150 KB       | Utility functions    |
| Animations        | 80 KB        | Animation system     |
| Prompt            | 100 KB       | Prompt components    |
| Analytics         | 120 KB       | Analytics features   |
| Memory            | 100 KB       | Memory management    |
| Adapters          | 60 KB        | Provider adapters    |

## Size Limit Configuration

Bundle limits are defined in `.size-limit.js`:

```javascript
module.exports = [
  {
    name: '📦 Main Bundle (ESM)',
    path: 'dist/index.mjs',
    limit: '1.3 MB',
    gzip: true,
  },
  // ... more entries
]
```

### Modifying Limits

1. Update `.size-limit.js` with new limits
2. Document reason in commit message
3. Re-baseline if major optimization made
4. Update this README with new baseline

## Historical Tracking

Bundle sizes are automatically tracked in `history/`:

- Each measurement saved with timestamp
- Includes git commit and branch info
- Used for trend analysis
- Retained indefinitely for analysis

### Viewing Trends

```bash
# Generate trend report
pnpm size:report
```

Output includes:

- First vs latest comparison
- Trend direction (increasing/decreasing/stable)
- Per-bundle changes
- Recent measurements (last 10)

## CI/CD Integration

Bundle size is automatically checked in PRs via GitHub Actions:

**Workflow:** `.github/workflows/bundle-size.yml`

**Features:**

- Compares PR bundle sizes with base branch
- Posts detailed report as PR comment
- Fails if limits exceeded
- Uploads analysis artifacts

### PR Comment Format

```markdown
## 📦 Bundle Size Report

✅ No Significant Change

### Summary

| Metric       | Base   | Current | Change         |
| ------------ | ------ | ------- | -------------- |
| Total (gzip) | 304 KB | 306 KB  | +2 KB (+0.66%) |

### 📊 Significant Changes

| Bundle      | Base   | Current | Change         |
| ----------- | ------ | ------- | -------------- |
| 📈 core.mjs | 120 KB | 125 KB  | +5 KB (+4.17%) |
```

## Visualization Types

### 1. Dashboard (`dashboard.html`)

Interactive dashboard showing:

- Key metrics (total size, compliance, compression)
- Historical trend chart
- Size distribution chart
- Detailed bundle table

**Access:** `pnpm size:dashboard:open`

### 2. Treemap (`visualizations/treemap.html`)

Visual breakdown of bundle composition:

- Components (blue)
- Hooks (purple)
- Utils (green)
- External dependencies (orange)
- Other code (gray)

**Access:** `pnpm size:visualize:open`

### 3. Charts (`visualizations/charts.html`)

Comparative analysis:

- Bundle size comparison
- Stacked composition chart
- Category breakdown

**Access:** Via visualization index

## Best Practices

### When Making Changes

1. **Before changes:** Run `pnpm size:track` to baseline
2. **Make changes:** Implement feature/optimization
3. **After changes:** Run `pnpm size:track` again
4. **Compare:** Run `pnpm size:report` to see impact
5. **Visualize:** Run `pnpm size:dashboard:open` to verify

### Preventing Size Regressions

1. **Check limits locally:** `pnpm size` before committing
2. **Review PR comments:** Check CI bundle size report
3. **Investigate increases:** Use `pnpm size:why` for analysis
4. **Update limits carefully:** Require approval for limit increases

### Optimizing Bundle Size

1. **Lazy load heavy features:**

   ```typescript
   const MermaidRenderer = lazy(() => import('./MermaidRenderer'))
   ```

2. **Check tree-shaking:**

   ```bash
   pnpm size:why
   ```

3. **Externalize heavy deps:**
   - Add to `peerDependencies`
   - Mark as optional if not required
   - Update `tsup.config.ts` external list

4. **Code splitting:**
   - Enable in `tsup.config.ts`
   - Create focused entry points

## Troubleshooting

### Bundle Size Unexpectedly Large

1. **Check imports:**

   ```bash
   pnpm size:why
   ```

2. **Look for circular dependencies:**

   ```bash
   pnpm build 2>&1 | grep -i circular
   ```

3. **Verify externals:**
   ```bash
   pnpm verify:externals
   ```

### Missing History Data

```bash
# Rebuild history by tracking current state
pnpm size:track

# Check history directory
ls -la .bundle-analysis/history/
```

### Dashboard Not Opening

```bash
# Generate dashboard manually
pnpm size:dashboard

# Open manually
open .bundle-analysis/dashboard.html
```

## Metrics Explained

### Bundle Size (Raw)

Uncompressed JavaScript file size. Less relevant for users since browsers don't download raw files.

### Bundle Size (Gzip)

Size after gzip compression. Most servers use gzip, so this is the typical download size.

**Target:** Keep below limit for good UX

### Bundle Size (Brotli)

Size after Brotli compression. Some modern servers support this, typically 15-20% smaller than gzip.

**Tracking:** Recorded but not enforced

### Compression Ratio

`(gzipSize / rawSize) * 100`

Good compression ratios:

- 70-80%: Excellent (lots of repetitive code)
- 50-70%: Good (typical JavaScript)
- 30-50%: Fair (already minified)
- <30%: Poor (binary data, images)

### Tree-Shaking Effectiveness

Measures how well unused code is removed.

**Test:** Import single component and measure size.

**Good:** Size proportional to what's imported **Bad:** Importing one component pulls in everything

## Integration with Development Workflow

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
# Check bundle size limits
pnpm --filter @clarity-chat/react size || {
  echo "❌ Bundle size exceeds limits"
  exit 1
}
```

### Pre-push Hook

Add to `.husky/pre-push`:

```bash
# Track bundle size before pushing
pnpm --filter @clarity-chat/react size:track
```

### Release Process

1. **Before release:** Verify bundle sizes

   ```bash
   pnpm build
   pnpm size
   pnpm size:track
   ```

2. **Create baseline:** For major releases

   ```bash
   cp .bundle-analysis/current.json \
      .bundle-analysis/v${VERSION}-baseline.json
   ```

3. **Document changes:** Update CHANGELOG.md with size impacts

## Performance Targets

Based on Phase 2 measurements:

| Bundle Type      | Target (gzip) | Rationale                         |
| ---------------- | ------------- | --------------------------------- |
| **Core Minimal** | <50 KB        | Fits in single HTTP/2 frame       |
| **Slim**         | <300 KB       | Fast on 3G (< 1s download)        |
| **Core**         | <500 KB       | Reasonable on 3G (< 2s)           |
| **Full**         | <1.5 MB       | Acceptable for full-featured apps |

### Network Performance

| Connection | Speed    | Max Bundle (3s)    |
| ---------- | -------- | ------------------ |
| Slow 3G    | 400 Kbps | 150 KB             |
| 3G         | 1.6 Mbps | 600 KB             |
| 4G         | 10 Mbps  | 3.75 MB            |
| WiFi       | 50+ Mbps | No practical limit |

**Target:** Full bundle downloads in <3s on 3G

## Resources

### Internal Documentation

- [tsup.config.ts](../tsup.config.ts) - Build configuration
- [.size-limit.js](../.size-limit.js) - Size limit definitions
- [package.json](../package.json) - NPM scripts

### External Resources

- [size-limit](https://github.com/ai/size-limit) - Bundle size checker
- [Bundle Phobia](https://bundlephobia.com) - Check dependency sizes
- [Web.dev Performance](https://web.dev/performance/) - Performance best practices

## Changelog

### 2026-01-26: Phase 2 Baseline

- Established after heavy dependency externalization
- Total bundle: 1.18 MB → 304 KB gzip (73% reduction)
- Added 12 optional peer dependencies
- Set conservative limits with 10% buffer

### Future Improvements

- [ ] Add Brotli compression to CI
- [ ] Implement size budget per PR
- [ ] Add performance metrics (FCP, TTI)
- [ ] Create size trend dashboard
- [ ] Automate limit adjustments based on trends

---

**Last Updated:** January 26, 2026 **Phase:** Phase 2 (Peer Dependency Externalization)
**Maintainer:** Christi Reid
