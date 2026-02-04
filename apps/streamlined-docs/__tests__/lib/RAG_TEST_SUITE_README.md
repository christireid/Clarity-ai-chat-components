# RAG Pipeline Test Suite

Comprehensive test suite for validating the Retrieval-Augmented Generation (RAG) system quality, performance, and reliability.

## Overview

This test suite provides extensive coverage of the RAG pipeline with focus on:

1. **Vector Search Accuracy** - Semantic similarity and relevance
2. **Retrieval Quality Metrics** - Precision, Recall, MRR, NDCG, MAP
3. **End-to-End Pipeline** - Complete workflow validation
4. **Performance Benchmarks** - Latency, throughput, scalability
5. **Regression Testing** - Quality maintenance over time

## Test Files

### 1. `rag-vector-search-accuracy.test.ts`

Tests semantic search quality and embedding accuracy.

**Coverage:**
- Semantic similarity calculations
- Cosine similarity correctness
- Embedding quality and consistency
- Result ranking by relevance
- Edge case handling (empty queries, special characters)
- Multi-concept query handling

**Key Metrics:**
- Search precision > 70%
- Top result relevance > 80%
- Consistent results for similar queries

**Run:** `pnpm test rag-vector-search-accuracy`

### 2. `rag-retrieval-quality.test.ts`

Measures retrieval quality using standard Information Retrieval metrics.

**Coverage:**
- Precision@K (K=1,3,5,10)
- Recall@K
- Mean Reciprocal Rank (MRR)
- Normalized Discounted Cumulative Gain (NDCG@K)
- Mean Average Precision (MAP)
- F1 Score

**Quality Targets:**
- Precision@5 > 60%
- Recall@10 > 70%
- MRR > 80%
- NDCG@5 > 75%
- MAP > 70%

**Run:** `pnpm test rag-retrieval-quality`

### 3. `rag-e2e-pipeline.test.ts`

Validates the complete RAG pipeline from query to response.

**Coverage:**
- Query processing and filtering
- Hybrid search (keyword + semantic)
- Result fusion with RRF
- Reranking algorithms
- MMR diversity optimization
- Context building
- Citation formatting
- Follow-up suggestions

**Pipeline Stages Tested:**
1. Query classification
2. Hybrid retrieval
3. Score fusion
4. Reranking
5. Diversity filtering
6. Context formatting
7. Response validation

**Run:** `pnpm test rag-e2e-pipeline`

### 4. `rag-performance-benchmarks.test.ts`

Benchmarks system performance and scalability.

**Coverage:**
- Search latency (p50, p95, p99)
- Throughput (queries per second)
- Memory usage
- Index build time
- Scalability with dataset size
- Concurrent query handling
- Stress testing

**Performance Targets:**
- p50 latency < 100ms
- p95 latency < 250ms
- p99 latency < 500ms
- Throughput > 10 QPS
- Memory < 500MB
- Index build < 10s for 1000 docs

**Run:** `pnpm test rag-performance-benchmarks`

### 5. `rag-regression.test.ts`

Ensures improvements don't degrade quality over time.

**Coverage:**
- Historical test case validation
- Bug fix verification
- Feature completeness checks
- Quality baseline maintenance
- Performance baseline maintenance
- Edge case handling
- Data consistency

**Baseline Metrics:**
- Version tracking
- Quality thresholds
- Performance limits
- Feature requirements

**Run:** `pnpm test rag-regression`

## Running Tests

### Run All RAG Tests

```bash
pnpm test:rag
```

### Run Specific Test Suite

```bash
# Vector search accuracy
pnpm test rag-vector-search-accuracy

# Retrieval quality metrics
pnpm test rag-retrieval-quality

# End-to-end pipeline
pnpm test rag-e2e-pipeline

# Performance benchmarks
pnpm test rag-performance-benchmarks

# Regression tests
pnpm test rag-regression
```

### Run with Coverage

```bash
pnpm test:coverage -- __tests__/lib/rag-
```

### Run in Watch Mode

```bash
pnpm test:watch rag-
```

### Run with UI

```bash
pnpm test:ui
```

## Test Structure

Each test file follows this structure:

```typescript
describe('Feature Category', () => {
  // Setup
  beforeAll(() => {
    // Initialize test data
  })

  describe('Specific Feature', () => {
    it('should meet quality standard', () => {
      // Arrange
      // Act
      // Assert
    })

    it('should handle edge cases', () => {
      // Test edge cases
    })
  })
})
```

## Quality Gates

Tests enforce these quality gates:

### Search Quality
- ✅ Semantic similarity > 0.8 for identical queries
- ✅ Top result relevance > 0.7
- ✅ Precision@5 > 0.6
- ✅ Recall@10 > 0.7
- ✅ MRR > 0.8

### Performance
- ✅ p99 latency < 500ms
- ✅ Throughput > 10 QPS
- ✅ Memory usage < 500MB
- ✅ No memory leaks over time

### Reliability
- ✅ No regressions from baseline
- ✅ All historical bugs remain fixed
- ✅ Consistent results for same query
- ✅ Graceful degradation on errors

## Continuous Integration

These tests run automatically on:

- Pull request creation
- Merge to main branch
- Nightly builds
- Release candidates

### CI Configuration

```yaml
# .github/workflows/rag-tests.yml
name: RAG Quality Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm test:rag
```

## Metrics Dashboard

Track quality over time:

```bash
# Generate quality report
pnpm test:rag --reporter=json > rag-metrics.json

# View metrics
node scripts/analyze-rag-metrics.js rag-metrics.json
```

## Debugging Failed Tests

### Common Issues

**1. Flaky Tests**
```bash
# Run test multiple times
pnpm test rag-vector-search-accuracy --run --reporter=verbose --repeat=5
```

**2. Performance Issues**
```bash
# Profile test execution
NODE_OPTIONS='--inspect' pnpm test rag-performance-benchmarks
```

**3. Memory Leaks**
```bash
# Monitor memory usage
NODE_OPTIONS='--expose-gc' pnpm test rag-performance-benchmarks
```

## Adding New Tests

### Test Template

```typescript
describe('New Feature', () => {
  it('should meet quality standard', async () => {
    // Arrange
    const input = 'test input'
    const expected = 'expected output'

    // Act
    const result = await featureUnderTest(input)

    // Assert
    expect(result).toBe(expected)
  })

  it('should handle edge cases', async () => {
    // Test edge cases
  })
})
```

### Regression Test Template

```typescript
const REGRESSION_TEST_CASES: RegressionTestCase[] = [
  {
    id: 'unique-test-id',
    query: 'test query',
    expectedTopResult: 'expected-doc-id',
    minScore: 0.7,
    description: 'What this test validates',
    addedInVersion: '1.1.0',
  },
]
```

## Metrics Explanation

### Precision@K
Percentage of top K results that are relevant.
```
Precision@K = (Relevant in top K) / K
```

### Recall@K
Percentage of relevant documents found in top K.
```
Recall@K = (Relevant in top K) / (Total Relevant)
```

### Mean Reciprocal Rank (MRR)
Average of reciprocal ranks of first relevant result.
```
MRR = 1 / (rank of first relevant document)
```

### NDCG@K
Quality of ranking considering position of relevant docs.
```
NDCG@K = DCG@K / IDCG@K
```

### Mean Average Precision (MAP)
Average precision across all queries.
```
MAP = mean(AP for each query)
```

## Best Practices

### 1. Test Independence
Each test should be independent and not rely on other tests.

```typescript
// ✅ Good
beforeEach(() => {
  // Fresh setup for each test
})

// ❌ Bad
let sharedState
it('test 1', () => {
  sharedState = something
})
it('test 2', () => {
  use(sharedState) // Depends on test 1
})
```

### 2. Deterministic Tests
Use fixed seeds and mocks for consistent results.

```typescript
// ✅ Good
vi.mock('random', () => ({
  random: vi.fn(() => 0.5),
}))

// ❌ Bad
const random = Math.random()
```

### 3. Clear Assertions
Make expectations explicit and well-documented.

```typescript
// ✅ Good
expect(result.score).toBeGreaterThan(0.7) // Minimum quality threshold

// ❌ Bad
expect(result.score).toBeGreaterThan(0.5) // Why 0.5?
```

### 4. Performance Tests
Use appropriate iteration counts and warmup.

```typescript
// ✅ Good
// Warmup
for (let i = 0; i < 10; i++) await search()

// Measure
for (let i = 0; i < 100; i++) {
  // Measure latency
}

// ❌ Bad
for (let i = 0; i < 3; i++) {
  // Not enough iterations
}
```

## Maintenance

### Weekly
- Review test results
- Update baseline metrics if improved
- Add regression tests for bugs

### Monthly
- Analyze quality trends
- Update performance targets
- Review and remove outdated tests

### Quarterly
- Major quality assessment
- Benchmark against alternatives
- Update test infrastructure

## Resources

- [RAG Best Practices](../../docs/rag-best-practices.md)
- [Performance Tuning Guide](../../docs/performance-tuning.md)
- [Vitest Documentation](https://vitest.dev/)
- [Information Retrieval Metrics](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval))

## Contributing

When adding new features to the RAG system:

1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add regression test for the new feature
4. Update baseline metrics if improved
5. Document test in this README

## Support

For issues with tests:
- Check test output and error messages
- Review recent changes to RAG system
- Run tests in isolation
- Check CI logs
- Open an issue with reproduction steps

---

**Last Updated:** January 27, 2026
**Test Suite Version:** 1.0.0
**Maintained by:** Clarity AI Chat Components Team
