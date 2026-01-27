# RAG Evaluation Framework

Comprehensive tools for measuring and improving Retrieval-Augmented Generation (RAG) system quality.

## Features

- **Standard IR Metrics**: Precision@K, Recall@K, F1@K, MAP, MRR, NDCG@K
- **Test Set Management**: Build, save, and load evaluation datasets
- **Per-Query Analysis**: Detailed breakdown for each test case
- **Report Generation**: Human-readable formatted reports
- **Progress Tracking**: Monitor evaluation progress for large test sets

## Quick Start

```typescript
import { RAGEvaluator, TestSetBuilder } from '@clarity-chat/react/internal'

// 1. Build test set
const testSet = new TestSetBuilder()
  .addTestCase('What is machine learning?', ['doc1', 'doc3', 'doc5'])
  .addTestCase('How does neural network work?', ['doc2', 'doc4'])
  .addTestCase('Explain deep learning', ['doc1', 'doc6'])
  .build()

// 2. Create evaluator
const evaluator = new RAGEvaluator(testSet, [1, 3, 5, 10])

// 3. Evaluate your retrieval function
const results = await evaluator.evaluate(async (query, k) => {
  // Your retrieval logic
  const docs = await myVectorStore.query(query, k)
  return docs.map((doc, i) => ({
    id: doc.id,
    score: doc.score,
    rank: i + 1
  }))
})

// 4. View metrics
console.log(`Precision@5: ${results.precision[5].toFixed(3)}`)
console.log(`Recall@5: ${results.recall[5].toFixed(3)}`)
console.log(`MAP: ${results.map.toFixed(3)}`)
console.log(`MRR: ${results.mrr.toFixed(3)}`)

// 5. Print formatted report
console.log(RAGEvaluator.formatReport(results))
```

## Metrics Explained

### Precision@K
Percentage of retrieved documents (in top K) that are relevant.
- **Formula**: `relevant_in_top_k / k`
- **Range**: 0-1 (higher is better)
- **Meaning**: Quality of results

### Recall@K
Percentage of relevant documents that were retrieved in top K.
- **Formula**: `relevant_in_top_k / total_relevant`
- **Range**: 0-1 (higher is better)
- **Meaning**: Coverage

### F1@K
Harmonic mean of Precision and Recall.
- **Formula**: `2 * (P * R) / (P + R)`
- **Range**: 0-1 (higher is better)
- **Meaning**: Balanced quality & coverage

### MAP (Mean Average Precision)
Average precision across all queries.
- **Range**: 0-1 (higher is better)
- **Meaning**: Overall ranking quality

### MRR (Mean Reciprocal Rank)
Average position of first relevant result.
- **Formula**: `avg(1 / rank_of_first_relevant)`
- **Range**: 0-1 (higher is better)
- **Meaning**: How quickly users find relevant docs

### NDCG@K (Normalized Discounted Cumulative Gain)
Considers both ranking quality and relevance grades.
- **Range**: 0-1 (higher is better)
- **Meaning**: Overall ranking quality with graded relevance

## Test Set Management

### Building Test Sets

```typescript
const builder = new TestSetBuilder()

// Add test cases with binary relevance
builder.addTestCase(
  'What is RAG?',
  ['doc1', 'doc5', 'doc7']
)

// Add with graded relevance scores
builder.addTestCase(
  'How to optimize embeddings?',
  ['doc2', 'doc3'],
  {
    'doc2': 3,  // Highly relevant
    'doc3': 1,  // Somewhat relevant
  }
)

const testSet = builder.build()
```

### Saving and Loading

```typescript
// Save to JSON
const json = builder.toJSON()
localStorage.setItem('ragTestSet', json)
// Or write to file
fs.writeFileSync('test-set.json', json)

// Load later
const loaded = TestSetBuilder.fromJSON(json)
const testSet = loaded.build()
```

## Advanced Usage

### Progress Tracking

```typescript
const results = await evaluator.evaluate(
  retrievalFn,
  {
    verbose: true,  // Log each query
    onProgress: (current, total) => {
      console.log(`Evaluating ${current}/${total}...`)
    }
  }
)
```

### Custom K Values

```typescript
// Evaluate at K = 1, 5, 10, 20, 50
const evaluator = new RAGEvaluator(testSet, [1, 5, 10, 20, 50])
```

### Per-Query Analysis

```typescript
const results = await evaluator.evaluate(retrievalFn)

// Analyze individual queries
results.perQueryMetrics.forEach((metric, i) => {
  console.log(`Query: ${metric.query}`)
  console.log(`  Retrieved: ${metric.retrieved}`)
  console.log(`  Found: ${metric.foundRelevant.length}/${metric.totalRelevant}`)
  console.log(`  Missed: ${metric.missedRelevant.join(', ')}`)
  console.log(`  Precision@5: ${metric.precision[5]}`)
  console.log(`  Recall@5: ${metric.recall[5]}`)
})
```

## Best Practices

### 1. Create Representative Test Sets

```typescript
// Include diverse query types
const builder = new TestSetBuilder()
  .addTestCase('factual question', ['doc1'])
  .addTestCase('how-to query', ['doc2', 'doc3'])
  .addTestCase('comparison query', ['doc4', 'doc5'])
  .addTestCase('opinion/analysis', ['doc6'])
  .build()
```

### 2. Evaluate Regularly

```typescript
// Run evaluation after changes
async function evaluateRetrieval() {
  const results = await evaluator.evaluate(retrievalFn)

  // Track over time
  const metrics = {
    timestamp: Date.now(),
    precision_5: results.precision[5],
    recall_5: results.recall[5],
    map: results.map,
    mrr: results.mrr,
  }

  logMetrics(metrics)

  // Alert if quality drops
  if (results.map < 0.6) {
    console.warn('⚠️ Retrieval quality degraded!')
  }
}
```

### 3. Compare Strategies

```typescript
// Compare different approaches
const baseline = await evaluator.evaluate(vectorSearchOnly)
const hybrid = await evaluator.evaluate(hybridSearch)
const reranked = await evaluator.evaluate(withReranking)

console.log('Strategy Comparison:')
console.log(`Baseline MAP: ${baseline.map.toFixed(3)}`)
console.log(`Hybrid MAP:   ${hybrid.map.toFixed(3)}`)
console.log(`Reranked MAP: ${reranked.map.toFixed(3)}`)
```

### 4. Use Graded Relevance

```typescript
// For NDCG, use relevance scores
builder.addTestCase(
  'machine learning frameworks',
  ['doc1', 'doc2', 'doc3'],
  {
    'doc1': 3,  // Perfect match
    'doc2': 2,  // Good match
    'doc3': 1,  // Partial match
  }
)
```

## Example: Complete Evaluation Pipeline

```typescript
import { RAGEvaluator, TestSetBuilder } from '@clarity-chat/react/internal'
import { vectorStore, hybridSearch, reranker } from './my-rag-setup'

async function runEvaluation() {
  // 1. Build test set
  const testSet = new TestSetBuilder()
    .addTestCase('What is machine learning?', ['ml-intro', 'ml-basics'])
    .addTestCase('Deep learning architectures', ['dl-arch', 'neural-nets'])
    .addTestCase('Natural language processing', ['nlp-intro', 'transformers'])
    .build()

  // 2. Create evaluator
  const evaluator = new RAGEvaluator(testSet, [1, 3, 5, 10])

  // 3. Evaluate different strategies
  console.log('Evaluating Vector Search...')
  const vectorResults = await evaluator.evaluate(async (query, k) => {
    const docs = await vectorStore.query(query, k)
    return docs.map((d, i) => ({ id: d.id, score: d.score, rank: i + 1 }))
  })

  console.log('Evaluating Hybrid Search...')
  const hybridResults = await evaluator.evaluate(async (query, k) => {
    const docs = await hybridSearch.search(query, k)
    return docs.map((d, i) => ({ id: d.id, score: d.score, rank: i + 1 }))
  })

  console.log('Evaluating with Reranking...')
  const rerankedResults = await evaluator.evaluate(async (query, k) => {
    const candidates = await hybridSearch.search(query, k * 2)
    const reranked = await reranker.rerank({
      query,
      documents: candidates,
      topK: k
    })
    return reranked.results.map((r, i) => ({
      id: r.id,
      score: r.rerankScore,
      rank: i + 1
    }))
  })

  // 4. Compare results
  console.log('\n' + '='.repeat(60))
  console.log('EVALUATION RESULTS')
  console.log('='.repeat(60))

  const strategies = [
    { name: 'Vector Search', results: vectorResults },
    { name: 'Hybrid Search', results: hybridResults },
    { name: 'With Reranking', results: rerankedResults },
  ]

  strategies.forEach(({ name, results }) => {
    console.log(`\n${name}:`)
    console.log(`  MAP:          ${results.map.toFixed(3)}`)
    console.log(`  MRR:          ${results.mrr.toFixed(3)}`)
    console.log(`  Precision@5:  ${results.precision[5].toFixed(3)}`)
    console.log(`  Recall@5:     ${results.recall[5].toFixed(3)}`)
    console.log(`  NDCG@10:      ${results.ndcg[10].toFixed(3)}`)
  })

  // 5. Detailed report for best strategy
  console.log('\n' + RAGEvaluator.formatReport(rerankedResults))
}

runEvaluation().catch(console.error)
```

## API Reference

### `RAGEvaluator`

#### Constructor
```typescript
new RAGEvaluator(testSet: RAGTestCase[], kValues?: number[])
```

#### Methods

**`evaluate(retrievalFn, options?): Promise<EvaluationResults>`**
- Evaluate a retrieval function
- Options: `k`, `verbose`, `onProgress`

**`static formatReport(results): string`**
- Generate human-readable report

### `TestSetBuilder`

#### Methods

**`addTestCase(query, relevantDocs, relevanceScores?): this`**
- Add a test case

**`addFromJSON(testCases): this`**
- Add multiple test cases from JSON

**`build(): RAGTestCase[]`**
- Build the test set

**`toJSON(): string`**
- Export to JSON

**`static fromJSON(json): TestSetBuilder`**
- Import from JSON

## See Also

- [RAG Getting Started Guide](../../../../docs/rag-getting-started.md)
- [RAG Architecture](../../../../docs/rag-architecture.md)
- [RAG Audit Report](../../../../docs/rag-audit-report.md)
