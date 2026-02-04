# RAG Test Suite - Quick Reference

**📊 Stats:** 5 test files | 165 test cases | 3,119 lines of code

## 🚀 Quick Start

```bash
# Run all RAG tests
pnpm test:rag

# Run with coverage
pnpm test:rag:coverage

# Run in watch mode
pnpm test:rag:watch
```

## 📁 Test Files

| File | Tests | Purpose | Run Command |
|------|-------|---------|-------------|
| **rag-vector-search-accuracy** | 25 | Semantic search quality | `pnpm test rag-vector-search-accuracy` |
| **rag-retrieval-quality** | 21 | IR metrics (P/R/MRR/NDCG/MAP) | `pnpm test rag-retrieval-quality` |
| **rag-e2e-pipeline** | 35 | Complete workflow | `pnpm test rag-e2e-pipeline` |
| **rag-performance-benchmarks** | 18 | Latency & throughput | `pnpm test rag-performance-benchmarks` |
| **rag-regression** | 35 | Quality maintenance | `pnpm test rag-regression` |

## 🎯 Quality Targets

### Search Quality
- ✅ Precision@5 > 60%
- ✅ Recall@10 > 70%
- ✅ MRR > 80%
- ✅ NDCG@5 > 75%
- ✅ MAP > 70%

### Performance
- ✅ p50 latency < 100ms
- ✅ p95 latency < 250ms
- ✅ p99 latency < 500ms
- ✅ Throughput > 10 QPS
- ✅ Memory < 500MB

## 📊 Metrics Explained

| Metric | Formula | What It Measures |
|--------|---------|------------------|
| **Precision@K** | Relevant in top K / K | % of results that are relevant |
| **Recall@K** | Relevant in top K / Total relevant | % of relevant docs found |
| **MRR** | 1 / rank of 1st relevant | How quickly we find relevant docs |
| **NDCG@K** | DCG@K / IDCG@K | Ranking quality (position matters) |
| **MAP** | Mean(AP per query) | Overall precision across queries |
| **F1** | 2PR / (P+R) | Balance of precision & recall |

## 🔍 Test Categories

### 1. Vector Search Accuracy (25 tests)
```typescript
// Tests semantic similarity, embeddings, ranking
✓ Semantic similarity calculations
✓ Cosine similarity correctness
✓ Embedding quality
✓ Result ranking
✓ Edge cases
```

### 2. Retrieval Quality (21 tests)
```typescript
// Tests IR metrics
✓ Precision@K (K=1,3,5,10)
✓ Recall@K
✓ MRR, NDCG, MAP, F1
✓ System quality
```

### 3. E2E Pipeline (35 tests)
```typescript
// Tests complete workflow
✓ Query processing
✓ Hybrid search
✓ Context building
✓ Citations
✓ Follow-ups
```

### 4. Performance (18 tests)
```typescript
// Tests speed & scalability
✓ Latency (p50/p95/p99)
✓ Throughput (QPS)
✓ Scalability
✓ Memory usage
✓ Stress tests
```

### 5. Regression (35 tests)
```typescript
// Tests quality maintenance
✓ Historical cases
✓ Bug fixes
✓ Feature completeness
✓ Baselines
✓ Consistency
```

## 🛠️ Common Commands

```bash
# Run specific test file
pnpm test rag-vector-search-accuracy

# Run with verbose output
pnpm test rag-e2e-pipeline --reporter=verbose

# Run single test
pnpm test rag-regression -t "should remain fixed"

# Generate coverage report
pnpm test:rag:coverage

# Run in UI mode
pnpm test:ui

# Run tests matching pattern
pnpm test rag-performance

# Watch mode for development
pnpm test:rag:watch
```

## 🐛 Debugging

```bash
# Run with debugging
NODE_OPTIONS='--inspect' pnpm test rag-performance-benchmarks

# Profile memory
NODE_OPTIONS='--expose-gc' pnpm test rag-performance-benchmarks

# Repeat test multiple times
pnpm test rag-vector-search-accuracy --run --repeat=5

# Run with timeout
pnpm test rag-performance-benchmarks --testTimeout=30000
```

## 📈 Quality Gates

All PRs must pass:
- ✅ All 165 tests pass
- ✅ No regression from baseline
- ✅ Performance targets met
- ✅ Coverage > 85%

## 🔧 Adding New Tests

### 1. Add Test Case
```typescript
it('should meet quality standard', async () => {
  // Arrange
  const input = 'test input'

  // Act
  const result = await hybridSearch(input, { topK: 5 })

  // Assert
  expect(result.length).toBeGreaterThan(0)
  expect(result[0].score).toBeGreaterThan(0.7)
})
```

### 2. Add Regression Case
```typescript
const REGRESSION_TEST_CASES: RegressionTestCase[] = [
  {
    id: 'new-feature-test',
    query: 'test query',
    minScore: 0.7,
    description: 'What this validates',
    addedInVersion: '1.1.0',
  },
]
```

### 3. Update Baseline
```typescript
const BASELINE_METRICS = {
  version: '1.1.0',
  minPrecision: 0.65, // Improved from 0.6
  // ... other metrics
}
```

## 📚 Documentation

- **README:** Comprehensive guide - `RAG_TEST_SUITE_README.md`
- **Summary:** Implementation details - `RAG_TEST_SUMMARY.md`
- **Quick Ref:** This file - `RAG_QUICK_REFERENCE.md`

## 🔗 Related Files

### Source Files
- `/lib/ai/ragOptimized.ts` - Main RAG implementation
- `/lib/ai/vectorStore.ts` - Vector storage
- `/lib/ai/embeddings.ts` - Embedding generation
- `/lib/ai/vectorIndexHNSW.ts` - HNSW index
- `/lib/ai/keywordSearch.ts` - Keyword search
- `/lib/ai/ragPrompts.ts` - Prompt engineering

### Test Files
- `/lib/ai/__tests__/vectorSearchPerformance.test.ts` - Existing perf tests
- `/__tests__/lib/ragPrompts.test.ts` - Existing prompt tests
- `/__tests__/lib/ragOptimized-security.test.ts` - Security tests

## 💡 Tips

### For Development
- Use watch mode while developing
- Run affected tests only
- Use test.only for focused testing
- Check coverage regularly

### For CI/CD
- Run full suite on PR
- Track metrics over time
- Set quality gates
- Alert on regressions

### For Debugging
- Use --reporter=verbose for details
- Check test isolation
- Review recent changes
- Use UI mode for exploration

## 📞 Support

**Issues?**
1. Check test output
2. Review error messages
3. Run in isolation
4. Check recent changes
5. Open GitHub issue

**Questions?**
- See full README for details
- Check inline documentation
- Review test examples
- Ask in team chat

---

**Version:** 1.0.0
**Updated:** January 27, 2026
**Tests:** 165 passing ✅
