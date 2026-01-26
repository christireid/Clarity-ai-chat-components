# Performance Test Results

This directory contains comprehensive performance testing and bundle size analysis for the
@clarity-chat/react package.

## Quick Summary

| Metric                  | Value                    |
| ----------------------- | ------------------------ |
| **Current Bundle Size** | 299.31 KB (ESM, gzipped) |
| **Pre-optimization**    | ~899 KB (estimated)      |
| **Total Reduction**     | **600 KB (66.7%)**       |
| **Test Date**           | January 26, 2026         |

## Documents

### 1. [PERFORMANCE-TEST-RESULTS.md](./PERFORMANCE-TEST-RESULTS.md)

Comprehensive test results including:

- Detailed measurements
- Phase 1 & 2 verification
- Real-world scenario testing
- Network performance impact
- Tree-shaking verification

### 2. [BUNDLE-SIZE-ANALYSIS.md](./BUNDLE-SIZE-ANALYSIS.md)

In-depth bundle size analysis covering:

- Overall results comparison
- Phase-by-phase breakdown
- Optimization opportunities
- Build configuration analysis
- Recommendations for users and maintainers

### 3. [comparison-report.json](./comparison-report.json)

Machine-readable report containing:

- Baseline measurements
- Scenario comparisons
- Phase savings breakdown
- Structured data for automation

### 4. [bundle-report-latest.json](./bundle-report-latest.json)

Current build analysis including:

- Entry point sizes
- Chunk breakdown
- Compression ratios
- Externalization status

## Key Results

### Bundle Size Reduction

```
Before:  ████████████████████ ~899 KB
After:   ███████ 299 KB
Savings: █████████████ 600 KB (66.7%)
```

### Phase Breakdown

| Phase     | Focus                      | Savings    | Status          |
| --------- | -------------------------- | ---------- | --------------- |
| Phase 1   | Optional peer dependencies | 410 KB     | ✅ Complete     |
| Phase 2   | Required peer dependencies | 190 KB     | ✅ Complete     |
| **Total** | **All externalizations**   | **600 KB** | **✅ Complete** |

### Entry Points

| Entry Point        | Size (gzipped) | Use Case           |
| ------------------ | -------------- | ------------------ |
| `index.mjs`        | 299.31 KB      | Full package       |
| `core.mjs`         | ~150 KB        | Core features only |
| `core-minimal.mjs` | ~30 KB         | Minimal bundle     |
| `slim.mjs`         | ~200 KB        | Standard features  |

## Test Scenarios

### Scenario 1: Basic Chat

- **Bundle**: 299 KB
- **Savings**: 600 KB (66.7%)
- **Load time (3G)**: 3.0s vs 9.0s

### Scenario 2: With Syntax Highlighting

- **Bundle**: 449 KB (+ shiki)
- **Savings**: 450 KB (50%)
- **Load time (3G)**: 4.5s vs 9.0s

### Scenario 3: Full-Featured

- **Bundle**: 709 KB (+ all optional)
- **Savings**: 190 KB (21.1%)
- **Load time (3G)**: 7.1s vs 9.0s

## Scripts

### Generate Current Bundle Report

```bash
npx tsx scripts/simple-bundle-report.ts
```

### Compare Scenarios

```bash
npx tsx scripts/compare-with-without-peers.ts
```

### Analyze Current Bundle

```bash
npx tsx scripts/analyze-current-bundle.ts
```

## Verification Checklist

- [x] Bundle size measured accurately
- [x] Phase 1 externalization verified (410 KB savings)
- [x] Phase 2 externalization verified (190 KB savings)
- [x] Tree-shaking working correctly
- [x] Code-splitting enabled (16 chunks)
- [x] Performance budgets met
- [x] Real-world scenarios tested
- [x] Network impact calculated
- [x] Documentation complete

## Maintenance

These reports should be regenerated:

- **After each build configuration change**
- **Before major releases**
- **When adding new dependencies**
- **Monthly as part of performance monitoring**

## CI/CD Integration

Bundle size monitoring is integrated via:

- `.size-limit.js` configuration
- GitHub Actions workflow
- PR comments with size changes
- Automated regression detection

## Next Steps

1. Monitor bundle sizes in production
2. Track real-world performance metrics
3. Consider additional lazy loading opportunities
4. Update documentation with peer requirements
5. Create migration guide for v2.0.0

---

**Last Updated**: January 26, 2026 **Package Version**: 1.1.0 **Test Status**: ✅ All tests passed
