# RAG Architecture Deep Dive

## System Overview

The Clarity RAG infrastructure is built with **modularity**, **extensibility**, and **production readiness** as core principles. Each component can be used independently or as part of the full pipeline.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         RAG SYSTEM ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ INGESTION LAYER                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   PDF    │  │   DOCX   │  │   HTML   │  │Markdown  │            │
│  │  Loader  │  │  Loader  │  │  Loader  │  │  Loader  │            │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
│       └──────────────┴──────────────┴──────────────┘                │
│                            │                                          │
│                     ┌──────▼───────┐                                │
│                     │LoaderRegistry │                                │
│                     └──────┬───────┘                                │
│                            │                                          │
│                            ▼                                          │
│                     ┌──────────────┐                                │
│                     │   Document   │                                │
│                     │   Validation │                                │
│                     └──────┬───────┘                                │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNKING LAYER                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │  Recursive    │  │   Character   │  │     Token     │          │
│  │TextSplitter   │  │TextSplitter   │  │TextSplitter   │          │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘          │
│          └──────────────────┴──────────────────┘                    │
│                            │                                          │
│  Strategies: Fixed, Sentence, Paragraph, Balanced                   │
│  Configurable: Size, Overlap, Separators                            │
│                            │                                          │
│                            ▼                                          │
│                     ┌──────────────┐                                │
│                     │    Chunks    │                                │
│                     │ with Metadata│                                │
│                     └──────┬───────┘                                │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ EMBEDDING LAYER                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  OpenAI  │  │  Cohere  │  │  Local   │  │  Custom  │          │
│  │Embeddings│  │Embeddings│  │Embeddings│  │ Provider │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       └──────────────┴──────────────┴──────────────┘                │
│                            │                                          │
│              ┌─────────────▼────────────────┐                       │
│              │   Embedding Cache (LRU)      │                       │
│              │  - Memory / LocalStorage     │                       │
│              │  - Semantic Similarity       │                       │
│              └─────────────┬────────────────┘                       │
│                            │                                          │
│                            ▼                                          │
│                     ┌──────────────┐                                │
│                     │   Vectors    │                                │
│                     │ (embeddings) │                                │
│                     └──────┬───────┘                                │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│ STORAGE LAYER (Vector Stores)                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Pinecone │  │  Qdrant  │  │ Weaviate │  │  Chroma  │          │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘          │
│       └──────────────┴──────────────┴──────────────┘                │
│                            │                                          │
│              ┌─────────────▼────────────────┐                       │
│              │   Unified VectorStore API    │                       │
│              │ - Query, Upsert, Delete      │                       │
│              │ - Metadata Filtering         │                       │
│              │ - Namespace Support          │                       │
│              └──────────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────┘

[Query Phase begins here]

┌─────────────────────────────────────────────────────────────────────┐
│ RETRIEVAL LAYER                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User Query                                                          │
│       │                                                               │
│       ▼                                                               │
│  ┌────────────────┐                                                 │
│  │  Query         │                                                 │
│  │  Processing    │ (future: expansion, spell check, intent)       │
│  └────────┬───────┘                                                 │
│           │                                                          │
│           ▼                                                          │
│  ┌────────────────┐                                                 │
│  │  Embedding     │                                                 │
│  │  Generation    │                                                 │
│  └────────┬───────┘                                                 │
│           │                                                          │
│           ├───────────────┬────────────────┐                        │
│           ▼               ▼                ▼                        │
│    ┌──────────┐   ┌──────────┐    ┌──────────┐                   │
│    │  Vector  │   │   BM25   │    │  Hybrid  │                   │
│    │  Search  │   │  Search  │    │  Search  │                   │
│    └────┬─────┘   └────┬─────┘    └────┬─────┘                   │
│         │              │               │                            │
│         └──────────────┴───────────────┘                           │
│                        │                                             │
│                        ▼                                             │
│              ┌─────────────────┐                                    │
│              │  Score Fusion   │                                    │
│              │  - RRF          │                                    │
│              │  - Weighted     │                                    │
│              │  - DBSF         │                                    │
│              └────────┬────────┘                                    │
│                       │                                              │
│                       ▼                                              │
│              ┌─────────────────┐                                    │
│              │   MMR Diversity │                                    │
│              │   Filtering     │                                    │
│              └────────┬────────┘                                    │
│                       │                                              │
│                       ▼                                              │
│              ┌─────────────────┐                                    │
│              │   Top K Results │                                    │
│              │   (20-50 docs)  │                                    │
│              └────────┬────────┘                                    │
└───────────────────────┼─────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│ RERANKING LAYER (Optional but Recommended)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                         │
│  │  Cohere  │  │   Jina   │  │  Simple  │                         │
│  │  Rerank  │  │  Rerank  │  │ Reranker │                         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                         │
│       └──────────────┴──────────────┘                               │
│                      │                                               │
│                      ▼                                               │
│            ┌─────────────────┐                                      │
│            │   Top 5-10 Docs │                                      │
│            │ (highest quality)│                                      │
│            └────────┬────────┘                                      │
└─────────────────────┼─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│ CONTEXT BUILDING LAYER                                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────┐                  │
│  │        Prompt Construction                    │                  │
│  │                                                │                  │
│  │  1. Format retrieved documents                │                  │
│  │  2. Add source metadata                       │                  │
│  │  3. Manage token budget                       │                  │
│  │  4. Structure for LLM clarity                 │                  │
│  │  5. Include conversation history (if chat)    │                  │
│  │                                                │                  │
│  └────────────────────┬───────────────────────────┘                  │
│                       │                                              │
│                       ▼                                              │
│            ┌─────────────────┐                                      │
│            │  Final Prompt   │                                      │
│            │ (with citations)│                                      │
│            └────────┬────────┘                                      │
└─────────────────────┼─────────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │      LLM      │
              │   Generation  │
              └───────┬───────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────┐        ┌────────────────┐                      │
│  │   AI Response  │        │   Citations    │                      │
│  │                │        │                │                      │
│  │  - Generated   │        │ - Source links │                      │
│  │    text        │        │ - Confidence   │                      │
│  │  - Structured  │        │ - Excerpts     │                      │
│  │    output      │        │ - Metadata     │                      │
│  └────────────────┘        └────────────────┘                      │
│                                                                       │
│         SourceCitation Component                                    │
│         - Inline, Card, or List variants                            │
│         - Click-through to sources                                  │
│         - Accessibility built-in                                    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Document Loaders

**Purpose**: Parse various document formats and extract structured text.

**Key Design Decisions:**
- **Pluggable architecture**: Easy to add new loaders
- **Consistent interface**: All loaders implement `DocumentLoader`
- **Graceful degradation**: Fallback parsing when libraries unavailable
- **Metadata preservation**: Track source, page, section throughout pipeline

**Implementation Files:**
- `document-loaders/text-splitter.ts`: Text chunking logic
- `document-loaders/loaders.ts`: Format-specific loaders
- `document-loaders/pdf-loader.ts`: PDF parsing with pdfjs-dist
- `document-loaders/docx-loader.ts`: DOCX parsing with mammoth

**Extension Points:**
```typescript
// Add custom loader
class CustomLoader implements DocumentLoader {
  name = 'custom'
  supportedTypes = ['application/custom']

  async load(source: string | File | Blob): Promise<Document[]> {
    // Custom parsing logic
  }

  supports(type: string): boolean {
    return this.supportedTypes.includes(type)
  }
}

// Register
const registry = new LoaderRegistry()
registry.register(new CustomLoader())
```

### 2. Embedding Layer

**Purpose**: Convert text into dense vector representations for semantic search.

**Architecture:**
```
EmbeddingProvider Interface
         ↓
┌─────────┬─────────┬─────────┐
│         │         │         │
OpenAI  Cohere   Local   Custom
```

**Key Features:**
- **Provider abstraction**: Switch providers without code changes
- **Automatic batching**: Optimize API calls
- **Multi-layer caching**: Memory → LocalStorage → Semantic
- **Cost tracking**: Monitor token usage

**Cache Strategy:**
1. **Memory Cache**: Fast, ephemeral, LRU eviction
2. **LocalStorage Cache**: Persistent across sessions
3. **Semantic Cache**: Fuzzy matching for similar texts

**Files:**
- `embeddings/types.ts`: Interfaces and types
- `embeddings/openai.ts`: OpenAI implementation
- `embeddings/cohere.ts`: Cohere implementation
- `embeddings/cache.ts`: Caching implementations
- `embeddings/factory.ts`: Provider factory

### 3. Vector Store Layer

**Purpose**: Efficiently store, index, and query embedding vectors at scale.

**Unified Interface:**
```typescript
interface VectorStore {
  initialize(): Promise<void>
  upsert(vectors: Vector[]): Promise<void>
  query(query: VectorQuery): Promise<VectorMatch[]>
  delete(ids: string[]): Promise<void>
  getStats(): Promise<VectorStats>
}
```

**Provider Comparison:**

| Feature | Pinecone | Qdrant | Weaviate | Chroma |
|---------|----------|--------|----------|--------|
| Hosting | Managed | Both | Both | Self-hosted |
| Scale | Excellent | Excellent | Good | Basic |
| Latency | <50ms | <50ms | <100ms | Variable |
| Filtering | ✅ Advanced | ✅ Advanced | ✅ Advanced | ⚠️ Basic |
| Hybrid Search | ✅ | ✅ | ✅ | ❌ |
| Cost | $$$ | Free/$ | $$ | Free |

**Files:**
- `vector-stores/types.ts`: Unified interface
- `vector-stores/pinecone.ts`: Pinecone implementation
- `vector-stores/qdrant.ts`: Qdrant implementation
- `vector-stores/weaviate.ts`: Weaviate implementation
- `vector-stores/chroma.ts`: Chroma implementation
- `vector-stores/factory.ts`: Provider factory

### 4. Retrieval Layer

**Purpose**: Find most relevant documents for a given query using multiple strategies.

**Hybrid Search Architecture:**
```
Query
  │
  ├─► Vector Search (semantic) ────┐
  │                                 │
  └─► BM25 Search (keyword) ────────┤
                                    │
                         Score Fusion
                         (RRF/Weighted)
                                    │
                              MMR Diversity
                                    │
                              Top K Results
```

**Fusion Algorithms:**

1. **RRF (Reciprocal Rank Fusion)**:
   - Rank-based, doesn't need score normalization
   - Formula: `score = 1 / (k + rank)`
   - Best for: Combining different retrieval methods
   - Implementation: `hybrid-search.ts:165`

2. **Weighted Score Fusion**:
   - Direct score combination
   - Requires score normalization
   - Best for: When you trust score calibration
   - Implementation: `hybrid-search.ts:216`

3. **DBSF (Distribution-Based Score Fusion)**:
   - Z-score normalization
   - Accounts for score distributions
   - Best for: When scores have different scales
   - Implementation: `hybrid-search.ts:334`

**MMR (Maximal Marginal Relevance)**:
- Balances relevance and diversity
- Reduces redundant results
- Formula: `MMR = λ * Rel(q,d) - (1-λ) * max Sim(d,d')`
- Implementation: `use-vector-search.ts:108`

**Files:**
- `utils/search/hybrid-search.ts`: Hybrid search implementation
- `hooks/clarity-tokens/use-vector-search.ts`: React hook
- `hooks/chat/use-rag-pipeline.ts`: High-level pipeline

### 5. Reranking Layer

**Purpose**: Refine initial retrieval with sophisticated cross-encoder models.

**Why Rerank?**
- Initial retrieval uses **bi-encoders** (query and docs encoded separately)
- Reranking uses **cross-encoders** (query-doc pairs encoded together)
- Cross-encoders understand relationships better → +10-30% accuracy

**Cost-Quality Tradeoff:**
```
Stage 1: Fast retrieval (bi-encoder)
  ↓ Retrieve 50-100 candidates
  ↓ Cost: Vector search only

Stage 2: Quality reranking (cross-encoder)
  ↓ Rerank top 50 → Final top 5-10
  ↓ Cost: ~$0.002 per rerank request
  ↓ Quality: +20% accuracy

Result: Best quality at reasonable cost
```

**Cohere Rerank Features:**
- Understands negation ("not about X")
- Handles nuance and context
- Supports 100+ languages (multilingual model)
- Production SLA

**Files:**
- `reranking/types.ts`: Interfaces
- `reranking/simple-reranker.ts`: Basic TF-IDF reranker
- `reranking/cohere.ts`: Cohere API integration

### 6. Evaluation Framework

**Purpose**: Measure and improve RAG quality systematically.

**Metrics:**

1. **Precision@K**: % of retrieved docs that are relevant
   - Formula: `relevant_retrieved / k`
   - Interpretation: Quality of results

2. **Recall@K**: % of relevant docs that were retrieved
   - Formula: `relevant_retrieved / total_relevant`
   - Interpretation: Coverage

3. **F1@K**: Harmonic mean of Precision and Recall
   - Formula: `2 * (P * R) / (P + R)`
   - Interpretation: Balanced measure

4. **MRR (Mean Reciprocal Rank)**: Average position of first relevant result
   - Formula: `avg(1 / rank_of_first_relevant)`
   - Interpretation: How quickly users find what they need

5. **NDCG@K (Normalized Discounted Cumulative Gain)**:
   - Considers ranking quality and relevance grades
   - Range: 0-1, higher is better
   - Interpretation: Overall ranking quality

**Usage:**
```typescript
const evaluator = new RAGEvaluator(testSet, [1, 3, 5, 10])
const results = await evaluator.evaluate(retrievalFn)

console.log(RAGEvaluator.formatReport(results))
```

**Files:**
- `evaluation/rag-evaluator.ts`: Complete evaluation framework

## Data Flow

### Ingestion Flow

```
1. Document → Loader → Parse text
                    ↓
2. Text → Splitter → Chunks (with metadata)
                    ↓
3. Chunks → Embeddings → Vectors
                    ↓
4. Vectors → Vector Store → Indexed
```

### Query Flow

```
1. User Query → Embed → Query Vector
                       ↓
2. Query Vector → Search → Top 50 candidates
                       ↓
3. Candidates → Rerank → Top 5-10
                       ↓
4. Top docs → Context Builder → Prompt
                       ↓
5. Prompt → LLM → Response + Citations
```

## Performance Characteristics

### Latency Breakdown (typical query)

```
Embedding generation:     100-300ms
Vector search:            10-50ms
Reranking:               200-500ms
LLM generation:          500-2000ms
─────────────────────────────────
Total:                   ~800-2850ms
```

### Optimization Strategies

1. **Cache Embeddings**: Save 100-300ms per repeat query
2. **Parallel Search**: Run vector + BM25 concurrently
3. **Batch Operations**: Reduce API roundtrips
4. **Result Caching**: Cache entire query results for duplicates
5. **Index Warming**: Pre-load frequently accessed vectors

## Scalability

### Vector Store Scaling

| Scale | Documents | Vectors | Strategy |
|-------|-----------|---------|----------|
| Small | <100K | <1M | Single node Chroma/Qdrant |
| Medium | 100K-1M | 1M-10M | Managed Pinecone |
| Large | 1M-10M | 10M-100M | Pinecone + sharding |
| Enterprise | >10M | >100M | Multi-region Pinecone |

### Cost Optimization

1. **Embedding costs**:
   - Cache aggressively
   - Use text-embedding-3-small ($0.02/1M tokens)
   - Batch requests

2. **Vector store costs**:
   - Right-size dimensions
   - Use quantization (if available)
   - Archive cold data

3. **Reranking costs**:
   - Only rerank final top-K
   - Cache rerank results
   - Cost: $2 per 1000 requests

## Extension Points

### Custom Components

1. **Add Document Loader**: Implement `DocumentLoader` interface
2. **Add Embedding Provider**: Implement `EmbeddingProvider` interface
3. **Add Vector Store**: Implement `VectorStore` interface
4. **Add Reranker**: Implement `Reranker` interface
5. **Add Fusion Algorithm**: Extend `HybridSearch.customFusion`

### Integration Points

1. **LLM Integration**: Use context from retrieval
2. **Analytics**: Hook into search events
3. **Monitoring**: Export metrics to observability platform
4. **Access Control**: Filter by metadata/namespace
5. **Multi-tenancy**: Use namespaces in vector stores

## Next Steps

- [Configuration Guide](./rag-configuration.md)
- [Production Deployment](./rag-production.md)
- [Evaluation Guide](./rag-evaluation.md)
