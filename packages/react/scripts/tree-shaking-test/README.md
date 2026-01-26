# Tree-shaking Effectiveness Tests

This directory contains comprehensive tests to measure and verify tree-shaking effectiveness for
`@clarity-ai/react`.

## Purpose

Tree-shaking is critical for modern web applications to eliminate unused code and reduce bundle
sizes. This test suite verifies that:

1. Unused components are completely eliminated from production bundles
2. Importing one component doesn't pull in unrelated code
3. Peer dependencies (React, lucide-react) are properly externalized
4. Utilities can be imported without bundling React
5. The package structure supports optimal tree-shaking

## Test Cases

### 1. Minimal Import (`minimal.js`)

**What**: Imports a single utility function **Expected**: Smallest possible bundle, no React, no UI
components **Tests**: Dead code elimination for non-React utilities

### 2. Single Component (`single-component.js`)

**What**: Imports one React component (`ChatInput`) **Expected**: Only that component + React +
necessary deps **Should NOT include**: Other components, theme system, dashboards

### 3. Multiple Components (`multiple-components.js`)

**What**: Imports 3 related components **Expected**: Only imported components + shared dependencies
**Should NOT include**: Unrelated components, unused utilities

### 4. Hooks Only (`hooks-only.js`)

**What**: Imports custom hooks without UI components **Expected**: Hook code + minimal React
**Should NOT include**: UI components, theme system

### 5. Utilities Only (`utilities-only.js`)

**What**: Imports utility functions **Expected**: Minimal bundle, no React required **Should NOT
include**: React, any UI code

### 6. External Dependencies (`external-deps.js`)

**What**: Tests peer dependency externalization **Expected**: React/ReactDOM/lucide-react marked as
external **Tests**: Proper peer dependency handling

### 7. Full Import (`full-import.js`)

**What**: Imports everything (anti-pattern) **Expected**: Largest bundle, baseline for comparison
**Purpose**: Worst-case scenario measurement

## Running Tests

```bash
# Install dependencies
pnpm install

# Run all tests
pnpm test

# Or run individual steps
pnpm run build:all    # Build all test apps
pnpm run analyze      # Analyze bundles
```

## Output

The test suite generates:

1. **Console output**: Real-time build and analysis results
2. **`dist/`**: Built bundles with multiple bundlers
   - `rollup-*.js`: Rollup builds (best tree-shaking)
   - `esbuild-*.js`: esbuild builds (fast alternative)
   - `no-treeshake-*.js`: Baseline without tree-shaking
3. **`tree-shaking-report.json`**: Detailed JSON report
4. **`TREE-SHAKING-REPORT.md`**: Human-readable markdown report

## Bundlers Tested

### Rollup

- Best tree-shaking capabilities
- Uses static analysis
- Reference implementation

### esbuild

- Faster builds
- Good tree-shaking
- Alternative bundler validation

### No Tree-shaking

- Baseline comparison
- Shows maximum bundle size
- Measures tree-shaking effectiveness

## Expected Results

Based on proper tree-shaking:

| Test Case           | Expected Gzip Size | Expected Content                    |
| ------------------- | ------------------ | ----------------------------------- |
| minimal             | < 2 KB             | Utility code only                   |
| single-component    | 10-30 KB           | One component + React               |
| multiple-components | 20-50 KB           | Three components + shared deps      |
| hooks-only          | 5-20 KB            | Hook logic + minimal React          |
| utilities-only      | < 5 KB             | Pure JS utilities                   |
| external-deps       | 10-30 KB           | Component code (externals excluded) |
| full-import         | 100-500 KB         | Everything included                 |

## Success Criteria

✅ **Good Tree-shaking**:

- Minimal import is < 10% of full import size
- Single component doesn't include unrelated components
- Utilities-only has no React code
- Peer dependencies are external, not bundled
- 50%+ reduction compared to no-treeshake baseline

❌ **Poor Tree-shaking**:

- Minimal import > 30% of full import
- Every import pulls in theme system
- Utilities include React runtime
- Peer deps are bundled
- < 20% reduction vs baseline

## Analyzing Results

### Bundle Size Analysis

```javascript
// Good: Small, focused bundle
import { sanitizeInput } from '@clarity-ai/react'
// Result: ~1-2 KB gzipped

// Good: Single component
import { ChatInput } from '@clarity-ai/react'
// Result: ~15-25 KB gzipped

// Bad: Everything imported
import * as Clarity from '@clarity-ai/react'
// Result: 200+ KB gzipped
```

### Content Analysis

The analyzer checks for code patterns:

- React runtime presence
- Theme system code
- Dashboard components
- Animation libraries
- Icon libraries (lucide-react)

### Recommendations

Based on results, the analyzer provides:

- Warnings about unexpected bundle contents
- Size optimization opportunities
- Import pattern recommendations

## Integration with CI/CD

Add to your CI pipeline:

```yaml
# .github/workflows/tree-shaking.yml
name: Tree-shaking Tests

on: [pull_request]

jobs:
  tree-shaking:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: cd packages/react/scripts/tree-shaking-test && pnpm test
      - name: Check bundle sizes
        run: |
          # Fail if minimal bundle > 5KB gzipped
          # Fail if single component > 50KB gzipped
          node packages/react/scripts/tree-shaking-test/check-thresholds.js
```

## Troubleshooting

### Large minimal bundle

**Problem**: Minimal import includes React **Solution**: Check that utilities are pure JS, no React
imports

### Components include everything

**Problem**: Every import pulls in full library **Solution**:

- Verify package.json has `"sideEffects": false`
- Check barrel exports use named exports
- Ensure no circular dependencies

### Peer deps bundled

**Problem**: React is bundled instead of external **Solution**:

- Add to rollup/webpack externals
- Mark as peerDependencies in package.json
- Don't import from peer deps in non-React code

## Continuous Monitoring

Track bundle sizes over time:

```bash
# After each change
pnpm test > results.txt

# Compare with previous
diff previous-results.txt results.txt

# Fail if size increased > 10%
node check-size-regression.js
```

## Related Documentation

- [Bundle Size Optimization](../../docs/performance/bundle-size.md)
- [Import Patterns](../../docs/guides/importing.md)
- [Build Configuration](../../rollup.config.js)
