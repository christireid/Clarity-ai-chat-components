# Search Components

Comprehensive search functionality for message and conversation search.

## Structure

```
search/
├── shared/                          # Shared utilities and types
│   ├── types.ts                    # Common types for all search components
│   ├── utils.ts                    # Shared utility functions
│   └── index.ts                    # Barrel exports
│
├── semantic/                        # Semantic search module
│   ├── types.ts                    # Semantic search types
│   ├── config.ts                   # Default configuration
│   ├── utils.ts                    # Semantic-specific utilities
│   ├── hooks/                      # Custom hooks
│   │   ├── use-embeddings.ts      # Embedding generation and caching
│   │   ├── use-semantic-search.ts # Semantic search logic
│   │   └── index.ts               # Hook exports
│   ├── components/                 # UI components
│   │   ├── semantic-search-header.tsx
│   │   ├── semantic-search-input.tsx
│   │   ├── semantic-search-result.tsx
│   │   ├── semantic-config-panel.tsx
│   │   ├── query-expansion-preview.tsx
│   │   ├── semantic-search-history.tsx
│   │   └── index.ts               # Component exports
│   ├── semantic-message-search.tsx # Main component
│   └── index.ts                    # Module exports
│
├── components/                      # Advanced search components
│   ├── active-filters-pills.tsx
│   ├── saved-searches-panel.tsx
│   ├── search-filters-panel.tsx
│   ├── search-results-summary.tsx
│   └── index.ts
│
├── hooks/                          # Advanced search hooks
│   ├── use-filtered-messages.ts
│   ├── use-saved-searches.ts
│   ├── use-active-filter-count.ts
│   └── index.ts
│
├── message-search.tsx              # Basic message search
├── advanced-message-search.tsx     # Advanced search with filters
├── types.ts                        # Advanced search types
├── constants.ts                    # Shared constants
└── index.ts                        # Main barrel exports
```

## Components

### MessageSearch
Basic message search with highlighting and navigation.

```tsx
import { MessageSearch } from '@clarity-chat/react'

<MessageSearch
  messages={messages}
  onResultSelect={(message) => scrollToMessage(message)}
/>
```

### AdvancedMessageSearch
Advanced search with filters, saved searches, and export functionality.

```tsx
import { AdvancedMessageSearch } from '@clarity-chat/react'

<AdvancedMessageSearch
  messages={messages}
  onResultsChange={(filtered) => setFilteredMessages(filtered)}
  enableSavedSearches
  enableExport
  enableSorting
/>
```

### SemanticMessageSearch
AI-powered semantic search with vector embeddings.

```tsx
import { SemanticMessageSearch } from '@clarity-chat/react'

<SemanticMessageSearch
  messages={messages}
  config={{
    embeddings: {
      type: 'openai',
      model: 'text-embedding-3-small',
    },
    hybrid: {
      enabled: true,
      semanticWeight: 0.7,
    },
  }}
  onGenerateEmbedding={async (text) => {
    const response = await fetch('/api/embed', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return response.json()
  }}
  onResultSelect={(result) => scrollToMessage(result.message)}
/>
```

## Shared Utilities

### Keyword Search
```tsx
import { keywordSearch } from '@clarity-chat/react'

const scores = keywordSearch(query, messages)
```

### Filter Application
```tsx
import { applyFilters } from '@clarity-chat/react'

const filtered = applyFilters(messages, {
  role: 'user',
  dateRange: { start: new Date('2024-01-01') },
  hasAttachments: true,
})
```

### Highlight Extraction
```tsx
import { extractHighlights } from '@clarity-chat/react'

const highlights = extractHighlights(content, query, 3)
```

## Semantic Search Features

### Embedding Generation
```tsx
import { useEmbeddings } from '@clarity-chat/react'

const { generateEmbedding } = useEmbeddings({
  onGenerateEmbedding: async (text) => {
    // Custom embedding logic
    return embedding
  }
})
```

### Semantic Search Hook
```tsx
import { useSemanticSearch } from '@clarity-chat/react'

const { performSearch, expandedQueries } = useSemanticSearch({
  messages,
  config,
  onGenerateEmbedding,
  onRerank,
})
```

### Query Expansion
```tsx
import { expandQuery } from '@clarity-chat/react'

const expanded = expandQuery('fix error')
// Returns: ['fix error', 'solve', 'repair', 'correct', 'bug', 'issue', ...]
```

### Cosine Similarity
```tsx
import { cosineSimilarity } from '@clarity-chat/react'

const similarity = cosineSimilarity(embedding1, embedding2)
// Returns: 0.0 to 1.0
```

## Migration Guide

### From Old Semantic Search

The old monolithic file has been split into modules:

**Before:**
```tsx
import { SemanticMessageSearch } from './advanced-message-search-semantic'
```

**After:**
```tsx
import { SemanticMessageSearch } from './semantic'
// or from the main barrel:
import { SemanticMessageSearch } from '@clarity-chat/react'
```

All functionality remains the same, but now you can also import individual utilities:

```tsx
import {
  cosineSimilarity,
  expandQuery,
  useEmbeddings,
  useSemanticSearch,
} from '@clarity-chat/react'
```

## Benefits of Modular Structure

1. **Better Code Organization**: Clear separation of concerns
2. **Improved Maintainability**: Easier to find and update code
3. **Enhanced Reusability**: Import only what you need
4. **Better Testing**: Test individual modules in isolation
5. **Reduced Bundle Size**: Tree-shaking removes unused code
6. **Type Safety**: Stronger type inference with focused modules
7. **Easier Collaboration**: Multiple developers can work on different modules

## Performance Considerations

- **Embeddings are cached** to avoid recomputing
- **Debounced search** prevents excessive API calls
- **Abort controllers** clean up in-flight requests
- **Component unmount cleanup** prevents memory leaks
- **Memoized configuration** prevents unnecessary recalculations

## Storage

Search history and saved searches are stored in localStorage:

- `clarity-semantic-search-history` - Recent semantic searches
- `clarity-advanced-search-saved` - Saved search configurations
- `clarity-advanced-search-recent` - Recent search queries
