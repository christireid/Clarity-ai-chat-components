# Running Tree-shaking Tests

## Prerequisites

1. Build the `@clarity-ai/react` package first:

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components
pnpm --filter @clarity-ai/react build
```

2. Navigate to test directory:

```bash
cd packages/react/scripts/tree-shaking-test
```

## Quick Start

Run all tests:

```bash
pnpm test
```

This will:

1. Build all 7 test apps with Rollup and esbuild
2. Generate bundle analysis
3. Create reports (JSON and Markdown)
4. Check bundle size thresholds

## Step-by-Step Execution

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Build Test Apps

```bash
pnpm run build:all
```

Output:

- `dist/rollup-*.js` - Rollup builds
- `dist/esbuild-*.js` - esbuild builds
- `dist/no-treeshake-*.js` - Baseline builds

### Step 3: Analyze Bundles

```bash
pnpm run analyze
```

Output:

- Console output with size comparisons
- `tree-shaking-report.json` - Detailed metrics
- `TREE-SHAKING-REPORT.md` - Human-readable report

### Step 4: Check Thresholds (Optional)

```bash
node check-thresholds.js
```

This validates bundles meet size requirements (used in CI).

## Individual Test Builds

Build a single test case:

```bash
# Using Rollup
npx rollup -c -i test-apps/minimal.js -o dist/minimal.js \
  --external react,react-dom,lucide-react \
  --format esm

# Using esbuild
npx esbuild test-apps/minimal.js \
  --bundle --minify --tree-shaking=true \
  --external:react --external:react-dom \
  --outfile=dist/minimal-esbuild.js
```

## Analyzing Results

### View Console Output

The analyze script prints detailed results to console.

### Read Markdown Report

```bash
cat TREE-SHAKING-REPORT.md
```

### View JSON Report

```bash
cat tree-shaking-report.json | jq
```

### Specific Metrics

```bash
# Get size of minimal bundle
cat tree-shaking-report.json | jq '.[] | select(.test=="minimal") | .rollup.gzip'

# Get all gzipped sizes
cat tree-shaking-report.json | jq '.[] | {test: .test, size: .rollup.gzip}'
```

## Regression Testing

Compare with baseline (e.g., main branch):

```bash
# Save current results as baseline
cp tree-shaking-report.json baseline-report.json

# Make changes...

# Rebuild and analyze
pnpm test

# Compare
node compare-reports.js baseline-report.json tree-shaking-report.json
```

## Troubleshooting

### Error: Cannot find module '@clarity-ai/react'

**Solution**: Build the package first

```bash
cd /Users/christireid/Dev/Clarity-ai-chat-components
pnpm --filter @clarity-ai/react build
```

### Error: ENOENT: no such file or directory

**Solution**: Run from correct directory

```bash
cd packages/react/scripts/tree-shaking-test
```

### Large bundle sizes

**Investigation**:

1. Check if package is built: `ls ../../dist`
2. Verify sideEffects: `cat ../../package.json | grep sideEffects`
3. Check for circular deps: `npx madge --circular ../../src`

### Tests fail with bundler errors

**Solution**: Update bundler dependencies

```bash
pnpm update @rollup/plugin-node-resolve @rollup/plugin-commonjs esbuild
```

## CI/CD Usage

The GitHub Actions workflow runs these tests automatically:

```yaml
- name: Run tree-shaking tests
  run: |
    cd packages/react/scripts/tree-shaking-test
    pnpm install
    pnpm test

- name: Check thresholds
  run: node packages/react/scripts/tree-shaking-test/check-thresholds.js
```

## Expected Runtime

- Full test suite: ~30-60 seconds
- Individual build: ~2-5 seconds
- Analysis: ~1 second

## Output Files

After running tests, expect these files:

```
tree-shaking-test/
├── dist/                       # Built bundles
│   ├── rollup-minimal.js
│   ├── rollup-minimal.js.map
│   ├── esbuild-minimal.js
│   ├── no-treeshake-minimal.js
│   └── ... (more test outputs)
├── tree-shaking-report.json   # Detailed metrics
├── TREE-SHAKING-REPORT.md     # Human-readable report
└── node_modules/              # Test dependencies
```

## Next Steps

After running tests:

1. Review `TREE-SHAKING-REPORT.md` for insights
2. Check if bundles meet size expectations
3. Investigate any warnings or failures
4. Optimize package structure if needed
5. Commit results for historical tracking

## Example Session

```bash
# Navigate to test directory
cd /Users/christireid/Dev/Clarity-ai-chat-components/packages/react/scripts/tree-shaking-test

# Install and run
pnpm install
pnpm test

# Review results
cat TREE-SHAKING-REPORT.md

# Check specific bundle
ls -lh dist/rollup-minimal.js

# View detailed metrics
cat tree-shaking-report.json | jq
```

## Questions?

See:

- [Test Suite README](./README.md) - Complete documentation
- [Tree-shaking Guide](../../docs/performance/TREE-SHAKING.md) - Optimization guide
- [Performance Docs](../../docs/performance/) - Performance best practices
