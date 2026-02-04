# Tree-shaking Test Results Summary

This document summarizes the tree-shaking test infrastructure and expected outcomes for
`@clarity-ai/react`.

## Test Infrastructure Created

### 1. Test Suite Location

```
packages/react/scripts/tree-shaking-test/
├── test-apps/                    # 7 test applications
│   ├── minimal.js               # Single utility import
│   ├── single-component.js      # One React component
│   ├── multiple-components.js   # Three related components
│   ├── hooks-only.js            # Custom hooks without UI
│   ├── utilities-only.js        # Utility functions only
│   ├── external-deps.js         # Peer dependency externalization
│   └── full-import.js           # Everything (baseline)
├── build-all-tests.js           # Build script (Rollup + esbuild)
├── analyze-bundles.js           # Bundle analysis script
├── compare-reports.js           # Regression detection
├── check-thresholds.js          # CI threshold validation
├── package.json                 # Test dependencies
└── README.md                    # Complete documentation
```

### 2. CI/CD Integration

```
.github/workflows/tree-shaking.yml
```

Features:

- Runs on every PR affecting packages/react
- Builds all test apps with multiple bundlers
- Analyzes bundle sizes and content
- Checks size thresholds
- Detects regressions vs main branch
- Posts results as PR comments
- Uploads artifacts for review

## Test Cases Overview

### Test 1: Minimal Import

```javascript
import { sanitizeInput } from '@clarity-ai/react'
```

**Expected Results**:

- Bundle size: < 5 KB (gzipped)
- Contents: Pure JS utility code only
- Should NOT include: React, UI components, theme system
- Tests: Pure utility tree-shaking

### Test 2: Single Component

```javascript
import { ChatInput } from '@clarity-ai/react'
```

**Expected Results**:

- Bundle size: 15-30 KB (gzipped)
- Contents: ChatInput component + React + necessary deps
- Should NOT include: Other components, theme system, dashboards
- Tests: Component isolation

### Test 3: Multiple Components

```javascript
import { ChatInput, ClarityChat, FollowUpSuggestions } from '@clarity-ai/react'
```

**Expected Results**:

- Bundle size: 20-50 KB (gzipped)
- Contents: Only imported components + shared dependencies
- Should NOT include: Unrelated components, unused utilities
- Tests: Shared dependency optimization

### Test 4: Hooks Only

```javascript
import { useClarityChat, useAutoScroll } from '@clarity-ai/react'
```

**Expected Results**:

- Bundle size: 5-20 KB (gzipped)
- Contents: Hook logic + minimal React
- Should NOT include: UI components, theme system
- Tests: Hook isolation from UI

### Test 5: Utilities Only

```javascript
import { sanitizeInput, truncateText, formatTokenCount } from '@clarity-ai/react'
```

**Expected Results**:

- Bundle size: < 10 KB (gzipped)
- Contents: Pure JavaScript utilities
- Should NOT include: React, any UI code, hooks
- Tests: Complete React elimination

### Test 6: External Dependencies

```javascript
import { ClarityChat } from '@clarity-ai/react'
// Uses: react, react-dom, lucide-react
```

**Expected Results**:

- Bundle size: 10-30 KB (gzipped, excluding externals)
- Externals: react, react-dom, lucide-react marked as external
- Tests: Peer dependency externalization

### Test 7: Full Import (Baseline)

```javascript
import * as Clarity from '@clarity-ai/react'
```

**Expected Results**:

- Bundle size: 200-500 KB (gzipped)
- Contents: Everything in the package
- Purpose: Worst-case baseline for comparison

## Bundle Size Thresholds

Thresholds enforced by CI:

| Test Case           | Max Size (gzipped) | Purpose                      |
| ------------------- | ------------------ | ---------------------------- |
| minimal             | 5 KB               | Utility tree-shaking         |
| single-component    | 50 KB              | Component isolation          |
| multiple-components | 100 KB             | Multi-component optimization |
| hooks-only          | 30 KB              | Hook isolation               |
| utilities-only      | 10 KB              | Pure JS tree-shaking         |
| external-deps       | 50 KB              | Externalization verification |
| full-import         | 500 KB             | Baseline (warning only)      |

## Success Criteria

### Good Tree-shaking (✅)

- Minimal import < 10% of full import size
- Single component doesn't pull unrelated components
- Utilities-only has zero React code
- All peer dependencies externalized
- 50%+ reduction vs no-treeshake baseline

### Poor Tree-shaking (❌)

- Minimal import > 30% of full import
- Every import pulls theme system
- Utilities include React runtime
- Peer deps bundled instead of external
- < 20% reduction vs baseline

## Content Analysis

Each bundle is analyzed for unexpected code patterns:

| Pattern              | minimal | utilities-only | hooks-only | single-component |
| -------------------- | ------- | -------------- | ---------- | ---------------- |
| React code           | ✗       | ✗              | ✓          | ✓                |
| Theme system         | ✗       | ✗              | ✗          | ✗                |
| Dashboard components | ✗       | ✗              | ✗          | ✗                |
| CodeBlock component  | ✗       | ✗              | ✗          | ✗                |
| Markdown renderer    | ✗       | ✗              | ✗          | ✗                |
| Animation libraries  | ✗       | ✗              | ✗          | ?                |
| Lucide icons         | ✗       | ✗              | ✗          | ?                |

✓ = Expected to be present ✗ = Should NOT be present ? = May be present depending on component

## Bundler Comparison

Tests build with multiple bundlers to ensure compatibility:

### Rollup

- Best tree-shaking capabilities
- Uses static analysis
- Production-grade optimization
- Reference implementation

### esbuild

- Faster build times (10-100x)
- Good tree-shaking
- Alternative bundler validation
- Modern JavaScript optimization

### No Tree-shaking

- Rollup with `treeshake: false`
- Shows maximum bundle size
- Baseline for effectiveness measurement

## Running Tests

### Local Development

```bash
cd packages/react/scripts/tree-shaking-test
pnpm install
pnpm test
```

### Individual Steps

```bash
# Build all test apps
pnpm run build:all

# Analyze bundles
pnpm run analyze

# Check thresholds (CI)
node check-thresholds.js
```

### CI Integration

Tests run automatically on:

- Pull requests affecting `packages/react/src/**`
- Changes to `package.json` or `tsconfig.json`
- Manual workflow dispatch

## Output Files

### 1. `dist/` Directory

Contains built bundles:

- `rollup-{test}.js` - Rollup builds
- `rollup-{test}.js.map` - Source maps
- `esbuild-{test}.js` - esbuild builds
- `no-treeshake-{test}.js` - Baseline builds

### 2. `tree-shaking-report.json`

Machine-readable report with:

- Bundle sizes (minified + gzipped)
- Content analysis results
- Per-test metrics
- Used for regression detection

### 3. `TREE-SHAKING-REPORT.md`

Human-readable report with:

- Size comparison tables
- Test case descriptions
- Tree-shaking effectiveness metrics
- Recommendations
- Key findings

## Regression Detection

The `compare-reports.js` script detects size regressions:

### Thresholds

- **Warning**: 5% size increase
- **Critical**: 10% size increase (fails CI)
- **Improvement**: 5% size decrease

### Example Output

```
✅ minimal [PASS]
   Baseline: 2.45 KB
   Current:  2.38 KB
   Change:   -0.07 KB (-2.86%)

⚠️  single-component [WARNING]
   Baseline: 24.12 KB
   Current:  25.89 KB
   Change:   +1.77 KB (+7.33%)
   ⚠️  Noticeable size increase

❌ hooks-only [CRITICAL]
   Baseline: 12.34 KB
   Current:  14.15 KB
   Change:   +1.81 KB (+14.67%)
   ⚠️  BUNDLE SIZE REGRESSION DETECTED
```

## Troubleshooting

### Issue: Tests fail to build

**Solution**: Ensure `@clarity-ai/react` is built first

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components
pnpm --filter @clarity-ai/react build
```

### Issue: Large bundle despite tree-shaking

**Possible Causes**:

1. Namespace import instead of named imports
2. Circular dependencies
3. Side effects in modules
4. Bundler not configured for ESM

**Investigation**:

```bash
# Analyze specific bundle
npx rollup-plugin-visualizer dist/rollup-single-component.js
```

### Issue: Peer dependencies bundled

**Solution**: Verify bundler externals configuration

```javascript
// rollup.config.js
external: ['react', 'react-dom', 'lucide-react', 'framer-motion']
```

## Expected Improvements Over Time

As the package structure improves, we expect:

1. **Smaller bundles**: Reduced shared dependencies
2. **Better isolation**: Components more independent
3. **Faster builds**: Improved tree-shaking speed
4. **Lower thresholds**: Stricter size limits

## Integration with Performance Monitoring

Tree-shaking tests integrate with:

1. **Bundle size tracking**: Historical size trends
2. **Performance budgets**: Automated threshold enforcement
3. **PR comments**: Immediate feedback on changes
4. **Artifacts**: Detailed analysis for review

## Documentation

Complete documentation available in:

- **[Test Suite README](../../scripts/tree-shaking-test/README.md)**: Detailed test documentation
- **[Tree-shaking Guide](./TREE-SHAKING.md)**: Developer guide
- **[Bundle Size Guide](./bundle-size.md)**: Optimization techniques
- **[Import Patterns](../guides/importing.md)**: Best practices

## Next Steps

1. **Run initial baseline**: Execute tests to establish baseline
2. **Review results**: Identify optimization opportunities
3. **Set CI thresholds**: Configure acceptable limits
4. **Monitor trends**: Track bundle sizes over time
5. **Optimize**: Address any tree-shaking issues found

## Sample Output

### Console Output

```
🌳 Tree-shaking Effectiveness Test Suite
=========================================

📦 Building minimal with Rollup...
✅ Rollup build complete: minimal

⚡ Building minimal with esbuild...
✅ esbuild build complete: minimal

📊 Building minimal without tree-shaking (baseline)...
✅ No-treeshake build complete: minimal

...

🔍 Tree-shaking Analysis Results
=================================

📊 MINIMAL
--------------------------------------------------
  Rollup (minified):      1.84 KB
  Rollup (gzip):          0.89 KB
  esbuild (minified):     1.92 KB
  esbuild (gzip):         0.94 KB
  No tree-shake:          45.23 KB
  Reduction:              95.9%

  Content Analysis:
    - React code:      ✗
    - Theme system:    ✗
    - Dashboards:      ✗
    - CodeBlock:       ✗
    - Markdown:        ✗
    - Animations:      ✗
    - Lucide icons:    ✗

📈 SUMMARY REPORT
================================================================================
Test                      Rollup (gzip)  esbuild (gzip)   Reduction
--------------------------------------------------------------------------------
minimal                         0.89 KB         0.94 KB       95.9%
single-component               24.12 KB        25.89 KB       68.2%
multiple-components            38.45 KB        40.12 KB       52.4%
hooks-only                     12.34 KB        13.01 KB       78.5%
utilities-only                  2.15 KB         2.24 KB       92.1%
external-deps                  22.89 KB        24.56 KB       69.8%
full-import                   245.67 KB       258.34 KB        0.0%

🌳 TREE-SHAKING EFFECTIVENESS
================================================================================
Minimal bundle is 0.4% the size of full import
Tree-shaking eliminated 99.6% of unused code
```

## Related Files

- `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/scripts/tree-shaking-test/*`
- `/Users/christireid/Dev/Clarity-ai-chat-components/.github/workflows/tree-shaking.yml`
- `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/docs/performance/TREE-SHAKING.md`
- `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/package.json`
- `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/tsconfig.json`

---

**Status**: Infrastructure complete, ready for baseline testing **Created**: 2026-01-26 **Next
Action**: Run tests to establish baseline metrics
