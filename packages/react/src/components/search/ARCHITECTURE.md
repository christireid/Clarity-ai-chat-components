# Search Components Architecture

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                      Search Components                          │
│                         (index.ts)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌────────────────┐    ┌──────────────────┐
│  Basic Search │    │ Advanced Search│    │ Semantic Search  │
│ message-search│    │  (modular)     │    │   (modular)      │
└───────────────┘    └────────────────┘    └──────────────────┘
                              │                     │
                              │                     │
                              ▼                     ▼
                     ┌────────────────┐    ┌──────────────────┐
                     │   components/  │    │   semantic/      │
                     │   ├─ filters   │    │   ├─ components/ │
                     │   ├─ pills     │    │   ├─ hooks/      │
                     │   ├─ panel     │    │   ├─ types.ts    │
                     │   └─ summary   │    │   ├─ config.ts   │
                     │                │    │   └─ utils.ts    │
                     │   hooks/       │    └──────────────────┘
                     │   ├─ filtered  │
                     │   ├─ saved     │
                     │   └─ count     │
                     └────────────────┘
                              │
                              │
                              ▼
                     ┌────────────────┐
                     │    shared/     │
                     │  ┌──────────┐  │
                     │  │  types   │  │
                     │  │  utils   │  │
                     │  └──────────┘  │
                     │                │
                     │ Common logic   │
                     │ for all search │
                     └────────────────┘
```

## Dependency Flow

```
┌──────────────────────────────────────────────────────┐
│                    User Code                         │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────┐
│         SemanticMessageSearch Component              │
│  ┌────────────────────────────────────────────────┐  │
│  │  State Management & Orchestration              │  │
│  │  - query, results, config                      │  │
│  │  - search history, expanded states             │  │
│  │  - cleanup & abort controllers                 │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
           │                    │
           ▼                    ▼
┌─────────────────┐   ┌─────────────────────┐
│  Semantic Hooks │   │  UI Components      │
│  ┌───────────┐  │   │  ┌───────────────┐  │
│  │ Embeddings│  │   │  │ Header        │  │
│  │ Search    │  │   │  │ Input         │  │
│  └───────────┘  │   │  │ Result Card   │  │
└─────────────────┘   │  │ Config Panel  │  │
           │          │  │ History       │  │
           ▼          │  │ Expansion     │  │
┌─────────────────┐   │  └───────────────┘  │
│  Semantic Utils │   └─────────────────────┘
│  ┌───────────┐  │
│  │ Cosine    │  │
│  │ Expand    │  │
│  │ Quality   │  │
│  │ Fallback  │  │
│  └───────────┘  │
└─────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│       Shared Utilities              │
│  ┌───────────────────────────────┐  │
│  │ keywordSearch                 │  │
│  │ extractHighlights             │  │
│  │ applyFilters                  │  │
│  │ escapeRegex                   │  │
│  │ storage helpers               │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Data Flow

```
User Input
    │
    ▼
┌─────────────────┐
│ Search Query    │
│ "find errors"   │
└─────────────────┘
    │
    ▼
┌─────────────────────────┐
│ Query Expansion         │
│ ["find errors",         │
│  "bug", "issue",        │
│  "problem", ...]        │
└─────────────────────────┘
    │
    ├──────────────┬──────────────┐
    ▼              ▼              ▼
┌────────┐   ┌─────────┐   ┌──────────┐
│Semantic│   │Keyword  │   │Reranking │
│Scoring │   │Scoring  │   │(optional)│
│        │   │         │   │          │
│Vector  │   │TF-IDF   │   │Cohere/   │
│Embeddi-│   │like     │   │Custom    │
│ngs     │   │         │   │          │
└────────┘   └─────────┘   └──────────┘
    │              │              │
    └──────┬───────┴──────────────┘
           ▼
   ┌──────────────┐
   │ Hybrid Score │
   │ Calculation  │
   │              │
   │ semantic_wt  │
   │ * semantic + │
   │ keyword_wt   │
   │ * keyword    │
   └──────────────┘
           │
           ▼
   ┌──────────────┐
   │  Filtering   │
   │ threshold,   │
   │ max results  │
   └──────────────┘
           │
           ▼
   ┌──────────────┐
   │   Results    │
   │ with scores, │
   │ highlights,  │
   │ quality      │
   └──────────────┘
           │
           ▼
   ┌──────────────┐
   │ UI Rendering │
   │ Result Cards │
   └──────────────┘
```

## Module Responsibilities

### Shared Module
**Purpose:** Common utilities for all search types

**Responsibilities:**
- Text processing (regex escaping)
- Keyword search with TF-IDF scoring
- Highlight extraction
- Filter application (role, date, model, etc.)
- Storage management (localStorage)
- Type guards and validation

**Used By:** Advanced Search, Semantic Search

### Semantic Module
**Purpose:** AI-powered semantic search

**Responsibilities:**
- Vector embedding generation & caching
- Cosine similarity calculation
- Query expansion with synonyms
- Hybrid search (semantic + keyword)
- Reranking integration
- Match quality assessment
- Semantic-specific UI components

**Dependencies:** Shared utilities, external embedding API

### Advanced Search Module
**Purpose:** Keyword search with filters

**Responsibilities:**
- Text search with filters
- Saved searches
- Export functionality
- Sorting options
- Filter management UI

**Dependencies:** Shared utilities

## Component Tree

```
SemanticMessageSearch
├── Card
│   ├── SemanticSearchHeader
│   │   ├── Icon (Brain)
│   │   ├── Title & Description
│   │   └── Config Badges (Hybrid, Expansion, Reranking)
│   └── CardContent
│       ├── SemanticSearchInput
│       │   ├── Search Icon
│       │   ├── Input Field
│       │   ├── Loading Spinner (conditional)
│       │   ├── Clear Button (conditional)
│       │   ├── SemanticSearchHistory (Popover)
│       │   └── SemanticConfigPanel (Popover)
│       ├── QueryExpansionPreview (conditional)
│       │   └── Badges for expanded terms
│       └── Error Message (conditional)
└── Results Section
    ├── Loading State (Card with spinner)
    ├── Results List (AnimatePresence)
    │   ├── Results Header (count indicator)
    │   └── SemanticSearchResult[] (mapped)
    │       ├── Score Badge
    │       ├── Match Type Badge
    │       ├── Role Badge
    │       ├── Copy Button
    │       ├── Expand Button
    │       ├── Content Preview
    │       ├── Highlights (conditional)
    │       └── Quality Indicator
    └── No Results State (conditional)
```

## Hook Dependencies

```
useSemanticSearch
├── useEmbeddings
│   ├── embeddingsCache (ref)
│   └── generateEmbedding (callback)
│       ├── onGenerateEmbedding (custom API)
│       └── generateFallbackEmbedding (fallback)
├── keywordSearch (from shared)
├── extractHighlights (from shared)
├── cosineSimilarity
└── expandQuery

SemanticMessageSearch
├── useSemanticSearch
├── useState (multiple)
│   ├── query
│   ├── results
│   ├── isSearching
│   ├── error
│   ├── searchHistory
│   ├── localConfig
│   ├── copiedId
│   └── expandedResults
├── useRef (multiple)
│   ├── inputRef
│   ├── copyTimeoutRef
│   ├── searchAbortRef
│   ├── isMountedRef
│   └── onResultsFoundRef
├── useEffect (multiple)
│   ├── Cleanup
│   ├── Load history
│   ├── Debounced search
│   └── Update callback refs
└── useCallback (multiple)
    ├── handleSearch
    ├── handleCopy
    ├── toggleExpanded
    └── clearHistory
```

## Storage Schema

```typescript
// localStorage keys
{
  "clarity-semantic-search-history": [
    {
      query: string,
      timestamp: number,
      resultCount: number
    }
  ],
  "clarity-advanced-search-saved": [
    {
      id: string,
      name: string,
      filters: SearchFilters,
      createdAt: number,
      lastUsed?: number
    }
  ],
  "clarity-advanced-search-recent": string[]
}
```

## Type Hierarchy

```
BaseSearchFilters (shared)
    │
    ├─> SearchFilters (advanced search)
    │
    └─> SemanticSearchFilters (semantic search)

BaseSearchResult (shared)
    │
    └─> SemanticSearchResult
        ├─ highlights
        ├─ matchType
        └─ explanation

FilterPreset<TFilters> (generic)
    │
    ├─> FilterPreset (advanced search)
    │
    └─> (can be extended for semantic)
```

## Performance Optimizations

1. **Embedding Cache** - Avoid recomputation
2. **Debounced Search** - Reduce API calls (300ms)
3. **Abort Controllers** - Cancel in-flight requests
4. **Memoization** - Config, callbacks, computed values
5. **Refs for Callbacks** - Prevent re-render loops
6. **Cleanup Timeouts** - Prevent memory leaks
7. **Deferred Values** - React 18 concurrent features
8. **Tree Shaking** - Import only needed modules

## Error Handling

```
Component Level
├── Try/Catch in handleSearch
├── AbortError detection
├── Mounted check before state updates
└── Error state display

Storage Level
├── Try/Catch in all storage ops
├── Validation before parse
└── Graceful fallback to defaults

API Level
├── Custom embedding errors
├── Reranking errors
└── Fallback embeddings
```
