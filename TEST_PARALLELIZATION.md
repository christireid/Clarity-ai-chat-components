# Test Parallelization Strategy

## Current Configuration

The Clarity AI Chat Components test suite uses Vitest with optimized parallelization for performance
and memory efficiency.

### Vitest Configuration

**Location:** `packages/react/vitest.config.mts`

```typescript
test: {
  pool: 'vmThreads',
  poolOptions: {
    vmThreads: {
      // Single thread mode significantly reduces memory overhead
      singleThread: true,
      // Memory limits per worker
      memoryLimit: '512MB',
    },
  },
  // Reduce parallelism to avoid memory issues
  maxConcurrency: 1,
  // Increase test timeout for slower execution
  testTimeout: 20000,
  // Enable isolation to avoid cumulative memory growth
  isolate: true,
}
```

## Why Single-Thread Mode?

The current configuration uses **single-thread mode** (`singleThread: true`) because:

1. **Memory Efficiency**: Large test suites with React components can consume significant memory
   when parallelized
2. **Stability**: Prevents out-of-memory (OOM) errors on CI/CD environments
3. **Isolation**: Each test runs in complete isolation, preventing state leakage

## Performance Optimization Strategies

### 1. Memory-Optimized Test Execution

**Current approach:**

- `maxConcurrency: 1` - Run one test at a time
- `memoryLimit: '512MB'` - Cap memory per worker
- `isolate: true` - Complete test isolation

**Trade-off:** Slower execution time for stability

### 2. Benchmark Parallelization

**Benchmarks run separately from tests:**

```bash
# Run all benchmarks (parallel-friendly)
pnpm bench

# Run specific benchmark suites
pnpm bench:streaming
pnpm bench:animations
pnpm bench:layout
```

**Benchmark configuration:**

```typescript
benchmark: {
  include: ['src/**/__benchmarks__/**/*.bench.{ts,tsx}'],
  outputFile: './benchmark-results.json',
}
```

### 3. CI/CD Parallelization

**GitHub Actions workflow optimization:**

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - run: pnpm test --shard=${{ matrix.shard }}/4
```

This splits the test suite into 4 parallel jobs, each running 1/4 of tests.

## Future Optimization Recommendations

### Option 1: Parallel Pools (When Memory Allows)

For environments with >8GB RAM:

```typescript
test: {
  pool: 'vmThreads',
  poolOptions: {
    vmThreads: {
      singleThread: false,  // Enable parallelization
      memoryLimit: '1024MB',
    },
  },
  maxConcurrency: 4,  // Run 4 tests concurrently
}
```

### Option 2: Test Sharding

Split tests across multiple CI jobs:

```bash
# Run 1st quarter of tests
pnpm test --shard=1/4

# Run 2nd quarter of tests
pnpm test --shard=2/4

# Run 3rd quarter of tests
pnpm test --shard=3/4

# Run 4th quarter of tests
pnpm test --shard=4/4
```

### Option 3: Separate Test Categories

Run different test categories in parallel:

```yaml
jobs:
  test-unit:
    run: pnpm test:unit
  test-integration:
    run: pnpm test:integration
  test-e2e:
    run: pnpm test:e2e
```

## Monitoring Test Performance

### 1. Test Duration Tracking

```bash
# Run tests with verbose reporter
pnpm test --reporter=verbose

# Generate JSON report for analysis
pnpm test --reporter=json --outputFile=test-results.json
```

### 2. Memory Profiling

```bash
# Monitor Node.js memory usage
NODE_OPTIONS='--max-old-space-size=4096 --expose-gc' pnpm test
```

### 3. Benchmark Performance

```bash
# Run performance benchmarks
pnpm perf:benchmark

# Generate detailed benchmark report
pnpm bench:json
```

## Best Practices

### 1. Test Isolation

✅ **Good:**

```typescript
describe('Component', () => {
  beforeEach(() => {
    // Reset state before each test
    cleanup()
  })

  it('renders correctly', () => {
    // Test implementation
  })
})
```

❌ **Bad:**

```typescript
// Shared state across tests
let component

describe('Component', () => {
  it('test 1', () => {
    component = render(<Component />)
  })

  it('test 2', () => {
    // Uses stale component from test 1
    expect(component).toBeDefined()
  })
})
```

### 2. Async Test Cleanup

✅ **Good:**

```typescript
it('async operation', async () => {
  const result = await fetchData()
  expect(result).toBeDefined()
  // Cleanup happens automatically via afterEach
})
```

### 3. Memory-Efficient Mocking

✅ **Good:**

```typescript
beforeEach(() => {
  vi.clearAllMocks() // Clear mocks between tests
})
```

## Troubleshooting

### Out of Memory Errors

**Symptoms:**

```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solutions:**

1. Increase Node.js heap size:

   ```bash
   NODE_OPTIONS='--max-old-space-size=8192' pnpm test
   ```

2. Reduce concurrency:

   ```typescript
   maxConcurrency: 1
   ```

3. Enable test sharding:
   ```bash
   pnpm test --shard=1/2
   ```

### Slow Test Execution

**Symptoms:**

- Tests take >10 minutes to complete
- CI/CD timeout errors

**Solutions:**

1. Use test sharding across CI jobs
2. Separate unit tests from integration tests
3. Run benchmarks separately from tests

## Scripts Reference

| Script                 | Purpose                | Parallelization |
| ---------------------- | ---------------------- | --------------- |
| `pnpm test`            | Run all tests          | Single-thread   |
| `pnpm test:watch`      | Watch mode             | Single-thread   |
| `pnpm bench`           | Run benchmarks         | Parallel-safe   |
| `pnpm bench:streaming` | Streaming benchmarks   | Parallel-safe   |
| `pnpm perf:benchmark`  | Performance validation | Sequential      |

## CI/CD Integration

### Current Workflow

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: NODE_OPTIONS='--max-old-space-size=4096' pnpm test
```

### Recommended Enhancement

```yaml
# .github/workflows/ci.yml
test:
  strategy:
    matrix:
      shard: [1, 2, 3, 4]
  steps:
    - name: Run test shard
      run: |
        NODE_OPTIONS='--max-old-space-size=4096' \
        pnpm test --shard=${{ matrix.shard }}/4
```

This reduces test execution time from ~10 minutes to ~2.5 minutes per shard.

---

**Last Updated:** January 24, 2026  
**Maintainer:** Code & Clarity Team
