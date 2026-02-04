# Phase 2 Externalization Tests - Quick Start

## Quick Commands

```bash
# Run all integration tests
pnpm test src/__tests__/integration

# Run specific test file
pnpm test phase2-externalization

# Run with coverage
pnpm test:coverage src/__tests__/integration

# Run performance benchmarks
pnpm bench phase2-performance

# Watch mode
pnpm test:watch phase2-externalization
```

## What Gets Tested

### 1. All Peers Installed ✅

Everything works perfectly with syntax highlighting and markdown features.

### 2. No Optional Peers ✅

Graceful fallbacks with clear installation instructions.

### 3. Partial Peers ✅

Markdown works without syntax highlighting (progressive enhancement).

### 4. Error Messages ✅

Helpful, actionable guidance for missing dependencies.

### 5. Performance ✅

No degradation from fallback mechanisms.

## Test Files

| File                                | Purpose                 | Tests |
| ----------------------------------- | ----------------------- | ----- |
| `phase2-externalization.test.tsx`   | Main integration tests  | 37    |
| `phase2-performance.bench.ts`       | Performance benchmarks  | 30+   |
| `peer-dependency-matrix.test.tsx`   | Dependency combinations | 100+  |
| `phase2-visual-regression.test.tsx` | UI consistency          | 50+   |

## Expected Results

```
✅ 34+ tests passing
⚠️  3 tests with network errors (non-critical)
⏱️  Duration: ~2s for unit tests, ~5s for full suite
📊 Coverage: 95%+ for integration scenarios
```

## Common Issues

### Network Errors in Tests

**Symptom:**
`Failed to execute "fetch()" on "Window" with URL "http://localhost:3000/api/analytics"`

**Cause:** Analytics tracking tries to reach API in test environment

**Solution:** Non-critical - components still function correctly

### Module Not Found

**Symptom:** `Cannot find module 'shiki'`

**Cause:** Optional peer dependency not installed

**Solution:** Expected - test validates this scenario

### Test Timeout

**Symptom:** Tests exceed timeout

**Cause:** Large markdown/code rendering

**Solution:** Increase timeout in test file or use `--testTimeout=20000`

## Verify Test Setup

```bash
# Check dependencies installed
pnpm install

# Verify test runner
pnpm test --version

# Check available tests
pnpm test --list src/__tests__/integration
```

## Reading Test Results

### Passing Test Example

```
✅ EnhancedMarkdownRenderer works with all features (1486ms)
```

Good! Component works correctly.

### Expected "Failure" (Actually Success)

```
✅ shows helpful error for missing react-markdown
```

Good! Error handling works correctly.

### Network Error (Non-Critical)

```
⚠️  Unhandled Rejection: NetworkError: Failed to execute "fetch()"
```

Non-blocking - analytics tracking in test environment.

## Performance Benchmarks

```bash
# Run all benchmarks
pnpm bench

# Run specific benchmark
pnpm bench phase2-performance

# Output to JSON
pnpm bench:json
```

**Expected Results:**

- Short markdown: < 10ms
- Medium markdown: < 50ms
- Large markdown: < 200ms
- Code blocks: < 50ms for 50 lines
- Cached loads: < 5ms

## Debug Failed Tests

```bash
# Run with verbose output
pnpm test phase2-externalization --reporter=verbose

# Run single test
pnpm test -t "renders markdown without syntax highlighting"

# Run with UI
pnpm test:ui phase2-externalization
```

## CI/CD Integration

```yaml
# .github/workflows/test.yml
- name: Run Integration Tests
  run: |
    cd packages/react
    pnpm test src/__tests__/integration --run

- name: Run Benchmarks
  run: |
    cd packages/react
    pnpm bench --run
```

## Next Steps

1. **Review Results**: Check test output for any failures
2. **Check Coverage**: Run with `--coverage` flag
3. **Run Benchmarks**: Validate performance baselines
4. **Update Docs**: If adding new tests, update README.md

## Documentation

- [Full Test Documentation](./README.md)
- [Test Results Summary](./TEST-SUMMARY.md)
- [Phase 2 Externalization Plan](../../../../../../docs/PHASE-2-EXTERNALIZATION.md)

## Questions?

See the [main README](./README.md) or file an issue.
