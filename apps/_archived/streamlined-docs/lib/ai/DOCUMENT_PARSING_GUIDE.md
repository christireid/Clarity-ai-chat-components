# Document Parsing and Chunking Guide

> **Enhanced RAG System with Advanced Document Processing**

## Overview

This guide explains the enhanced document parsing and chunking system for improved RAG (Retrieval-Augmented Generation) responses. The system provides:

- **Advanced Markdown Parsing**: Hierarchical section extraction, frontmatter support
- **Code Block Extraction**: Language detection, keyword extraction, executability analysis
- **Section-Aware Chunking**: Preserve semantic boundaries and context
- **Metadata Extraction**: Automatic tagging, category inference, cross-reference detection
- **Smart Search**: Chunk-level search with relevance scoring

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Document Loading                         │
│  (libraryContext.ts: loadLibraryDocs)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Document Parsing                           │
│  (documentParser.ts: parseMarkdownDocument)                 │
│  • Extract frontmatter                                       │
│  • Parse heading hierarchy                                   │
│  • Extract code blocks                                       │
│  • Detect cross-references                                   │
│  • Generate tags                                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Document Chunking                           │
│  (documentChunker.ts: chunkDocument)                        │
│  • Hierarchical chunking (default)                          │
│  • Semantic chunking                                         │
│  • Fixed-size chunking                                       │
│  • Hybrid strategy                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Enhanced Search                           │
│  (libraryContext.ts: searchDocumentChunks)                  │
│  • Chunk-level relevance scoring                            │
│  • Code block filtering                                      │
│  • Category filtering                                        │
│  • Context-aware ranking                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Usage Examples

### Basic Document Loading

```typescript
import { loadLibraryDocs } from '@/lib/ai/libraryContext'

// Load with enhanced parsing (default)
const docs = await loadLibraryDocs({
  parseDocuments: true,
  chunkDocuments: true,
})

console.log(`Loaded ${docs.length} documents`)
console.log(`Total chunks: ${docs.reduce((sum, d) => sum + (d.chunks?.length || 0), 0)}`)
```

### Custom Chunking Options

```typescript
import { loadLibraryDocs } from '@/lib/ai/libraryContext'

const docs = await loadLibraryDocs({
  parseDocuments: true,
  chunkDocuments: true,
  chunkingOptions: {
    strategy: 'hierarchical', // 'semantic' | 'fixed-size' | 'hybrid'
    maxChunkSize: 1500,       // Maximum characters per chunk
    minChunkSize: 200,        // Minimum characters per chunk
    overlapSize: 300,         // Overlap between chunks
    separateCodeBlocks: true, // Create separate chunks for code
    includeParentContext: true, // Include parent section context
    maxHeadingLevel: 3,       // Chunk up to H3 level
  },
})
```

### Searching Documents

```typescript
import { searchLibraryDocs } from '@/lib/ai/libraryContext'

const docs = await loadLibraryDocs()

// Basic search
const results = searchLibraryDocs(docs, 'useChat hook', 5)

// Advanced search with options
const advancedResults = searchLibraryDocs(docs, 'authentication example', 5, {
  searchChunks: true,        // Use chunk-level search
  includeCodeBlocks: true,   // Include code examples
  filterByCategory: ['hook', 'component'], // Filter by category
})
```

### Getting Relevant Chunks

```typescript
import { getRelevantChunks } from '@/lib/ai/libraryContext'

const docs = await loadLibraryDocs()
const chunks = getRelevantChunks(docs, 'streaming chat messages', 8, {
  includeCodeBlocks: true,
  filterByCategory: ['component', 'guide'],
})

// Each chunk contains:
chunks.forEach(chunk => {
  console.log('Title:', chunk.title)
  console.log('Section Path:', chunk.sectionPath.join(' > '))
  console.log('Type:', chunk.type)
  console.log('Has Code:', chunk.codeBlocks.length > 0)
  console.log('Languages:', chunk.metadata.languages)
  console.log('Executable:', chunk.metadata.hasExecutableCode)
  console.log('---')
})
```

### Formatting for RAG

```typescript
import { formatLibraryDocsForRAG } from '@/lib/ai/libraryContext'

const docs = await loadLibraryDocs()
const query = 'How do I implement streaming?'

// Format for LLM context
const ragContext = formatLibraryDocsForRAG(docs, query, {
  maxLength: 4000,           // Maximum context length
  includeChunks: true,       // Use chunk-level formatting
  includeCodeBlocks: true,   // Include code examples
  includeMetadata: true,     // Include metadata (tags, languages)
})

// Use in LLM prompt
const systemPrompt = `You are a documentation assistant.

${ragContext}

Answer the user's question based on the documentation above.`
```

---

## Document Structure

### ParsedDocument

```typescript
interface ParsedDocument {
  path: string                    // File path
  title: string                   // Document title
  category: DocumentCategory      // Inferred category
  frontmatter: Record<string, unknown> // YAML frontmatter
  sections: DocumentSection[]     // Hierarchical sections
  codeBlocks: CodeBlock[]         // Extracted code blocks
  crossReferences: CrossReference[] // Detected references
  tags: string[]                  // Generated tags
  lastModified: Date              // Last modified timestamp
}
```

### DocumentSection

```typescript
interface DocumentSection {
  id: string              // Unique section ID
  heading: string         // Section heading text
  level: number           // Heading level (1-6)
  content: string         // Section content (markdown)
  parentId?: string       // Parent section ID
  childIds: string[]      // Child section IDs
  codeBlockIds: string[]  // Code blocks in section
  crossReferenceIds: string[] // Cross-references in section
  startLine: number       // Start line in document
  endLine: number         // End line in document
}
```

### CodeBlock

```typescript
interface CodeBlock {
  id: string              // Unique code block ID
  language: string        // Programming language
  code: string            // Code content
  caption?: string        // Optional caption
  sectionId: string       // Section containing this block
  keywords: string[]      // Extracted keywords
  lineNumber: number      // Line number in document
  isExecutable: boolean   // Whether code is complete/valid
}
```

### DocumentChunk

```typescript
interface DocumentChunk {
  id: string                  // Unique chunk ID
  title: string               // Chunk title
  content: string             // Chunk content (markdown)
  url: string                 // Document URL/path
  category: string            // Document category
  type: ChunkType             // Chunk type
  sectionId?: string          // Section ID
  sectionPath: string[]       // Section hierarchy (breadcrumb)
  codeBlocks: CodeBlock[]     // Code blocks in chunk
  crossReferences: CrossReference[] // Cross-references
  keywords: string[]          // Keywords for search
  metadata: {
    headingLevel?: number
    languages: string[]
    hasExecutableCode: boolean
    isCompleteExample: boolean
    tags: string[]
    lastUpdated: string
    headings: string[]
    wordCount: number
    estimatedTokens: number
  }
}
```

---

## Chunking Strategies

### 1. Hierarchical Chunking (Default)

Preserves document structure by chunking at section boundaries.

**Use when:**
- Documentation has clear heading structure
- Semantic boundaries are important
- You want to preserve context hierarchy

**Example:**
```typescript
const chunks = chunkDocument(parsed, {
  strategy: 'hierarchical',
  maxHeadingLevel: 3, // Chunk up to H3
  includeParentContext: true,
})
```

**Output:**
- One chunk per section (up to max heading level)
- Parent context included for nested sections
- Separate chunks for code blocks (optional)

### 2. Semantic Chunking

Chunks at natural boundaries (paragraphs, sections).

**Use when:**
- Document has variable section sizes
- Want to avoid oversized chunks
- Natural language boundaries are important

**Example:**
```typescript
const chunks = chunkDocument(parsed, {
  strategy: 'semantic',
  maxChunkSize: 1000,
})
```

**Output:**
- Chunks split at paragraph boundaries
- Respects sentence boundaries when possible
- Maintains semantic coherence

### 3. Fixed-Size Chunking

Fixed-size chunks with overlap.

**Use when:**
- Document structure is irregular
- Need consistent chunk sizes
- Overlap is important for retrieval

**Example:**
```typescript
const chunks = chunkDocument(parsed, {
  strategy: 'fixed-size',
  maxChunkSize: 1000,
  overlapSize: 200,
})
```

**Output:**
- Uniform chunk sizes
- Overlapping content between chunks
- Better for edge-case queries

### 4. Hybrid Strategy

Combines hierarchical and fixed-size strategies.

**Use when:**
- Want best of both approaches
- Have documents with mixed structure
- Need to handle variable-length sections

**Example:**
```typescript
const chunks = chunkDocument(parsed, {
  strategy: 'hybrid',
  maxChunkSize: 1000,
  maxHeadingLevel: 3,
})
```

**Output:**
- Hierarchical chunking first
- Large chunks split with fixed-size
- Maintains structure where possible

---

## Search and Ranking

### Relevance Scoring

Chunks are scored based on:

1. **Title Match** (weight: 10-20)
   - Exact match: 20 points
   - Partial match: 10 points

2. **Section Path Match** (weight: 8)
   - Query appears in section hierarchy

3. **Keyword Match** (weight: 2 per keyword)
   - Keywords extracted from content

4. **Content Match** (weight: 0.5 per word)
   - TF-IDF-like scoring with diminishing returns

5. **Tag Match** (weight: 1.5 per tag)
   - Tags from document metadata

6. **Type Relevance** (weight: 1.5x multiplier)
   - "example" query → boost code-example chunks
   - "api" query → boost api-reference chunks

7. **Code Relevance** (weight: 1.3x multiplier)
   - Boost executable code for "how to" queries

8. **Recency Bonus** (weight: 1.1x multiplier)
   - Boost recently updated content

### Example Search Flow

```typescript
// User query
const query = "How do I implement streaming messages?"

// 1. Load documents with parsing
const docs = await loadLibraryDocs()

// 2. Search for relevant chunks
const chunks = getRelevantChunks(docs, query, 5, {
  includeCodeBlocks: true,
})

// 3. Format for RAG
const context = formatLibraryDocsForRAG(docs, query, {
  includeChunks: true,
  includeCodeBlocks: true,
})

// 4. Generate LLM response with context
const response = await generateLLMResponse({
  systemPrompt: context,
  userMessage: query,
})
```

---

## Code Block Detection

### Automatic Language Detection

```typescript
// Detected from code fence
```typescript
function example() {
  return 'typescript'
}
```

// Keyword extraction
keywords: ['function', 'example', 'return']
```

### Executability Analysis

Code is marked as executable if it has:

- Import statements
- Export statements
- Complete function/component definitions
- Balanced braces/brackets

**Example:**

```typescript
// ✅ Executable (complete component)
import React from 'react'

export function ChatMessage({ message }) {
  return <div>{message}</div>
}

// ❌ Not executable (incomplete)
const result = someFunction(
```

---

## Cross-Reference Detection

### Supported Reference Types

1. **Internal Links**: `[text](/path)`
2. **External Links**: `[text](https://...)`
3. **Component References**: `<ComponentName />`
4. **Hook References**: `useHookName()`
5. **Import References**: `import { X } from 'Y'`
6. **See Also**: `See also: Related Topic`

### Example

```typescript
const parsed = parseMarkdownDocument(content, '/docs/example.md')

parsed.crossReferences.forEach(ref => {
  console.log(`Type: ${ref.type}`)
  console.log(`Text: ${ref.text}`)
  console.log(`Target: ${ref.target}`)
  console.log(`Context: ${ref.context}`)
})
```

**Output:**
```
Type: component-ref
Text: ChatMessage
Target: ChatMessage
Context: Use the <ChatMessage /> component to display messages.

Type: hook-ref
Text: useChat
Target: useChat
Context: The useChat() hook manages conversation state.
```

---

## Best Practices

### 1. Choose the Right Strategy

- **Hierarchical**: Well-structured docs with clear headings
- **Semantic**: Mixed content with variable section sizes
- **Fixed-size**: Irregular structure or when overlap is critical
- **Hybrid**: Default choice for most use cases

### 2. Optimize Chunk Size

```typescript
// For GPT-3.5/GPT-4 (8K context)
maxChunkSize: 1000  // ~250 tokens per chunk

// For Claude (100K context)
maxChunkSize: 2000  // ~500 tokens per chunk

// For long-context models
maxChunkSize: 4000  // ~1000 tokens per chunk
```

### 3. Use Code Block Separation

```typescript
// Enable for documentation with many code examples
separateCodeBlocks: true

// Disable for text-heavy documents
separateCodeBlocks: false
```

### 4. Filter by Category

```typescript
// Narrow search scope for better precision
const chunks = getRelevantChunks(docs, query, 5, {
  filterByCategory: ['component', 'hook'], // Only components and hooks
})
```

### 5. Include Parent Context

```typescript
// Better for nested documentation
includeParentContext: true  // "Parent: Getting Started > Installation"

// Cleaner for flat docs
includeParentContext: false
```

---

## Integration with Existing RAG

### Before (Traditional Approach)

```typescript
// Load full documents
const docs = await loadLibraryDocs()

// Search at document level
const results = searchLibraryDocs(docs, query, 3)

// Truncate content to fit context
const context = formatLibraryDocsForRAG(results)
```

**Limitations:**
- No code block indexing
- Document-level granularity only
- Manual truncation loses context
- No hierarchical awareness

### After (Enhanced Approach)

```typescript
// Load with parsing and chunking
const docs = await loadLibraryDocs({
  parseDocuments: true,
  chunkDocuments: true,
})

// Search at chunk level
const chunks = getRelevantChunks(docs, query, 8, {
  includeCodeBlocks: true,
  filterByCategory: ['component'],
})

// Format with metadata
const context = formatLibraryDocsForRAG(docs, query, {
  includeChunks: true,
  includeMetadata: true,
})
```

**Benefits:**
- Precise code block retrieval
- Chunk-level relevance scoring
- Automatic metadata enrichment
- Context-aware formatting

---

## Performance Considerations

### Caching

```typescript
// Documents are cached for 5 minutes
const CACHE_TTL = 5 * 60 * 1000

// Subsequent calls use cached results
const docs1 = await loadLibraryDocs() // Parse and chunk
const docs2 = await loadLibraryDocs() // From cache (fast)
```

### Parsing Performance

- **Small docs** (<10KB): <10ms per document
- **Medium docs** (10-100KB): 10-50ms per document
- **Large docs** (>100KB): 50-200ms per document

### Chunking Performance

- **Hierarchical**: Fastest (O(n) where n = sections)
- **Semantic**: Medium (O(n) + paragraph splitting)
- **Fixed-size**: Fast (O(n) where n = characters)
- **Hybrid**: Slowest (O(n) + potential re-splitting)

### Search Performance

- **Document-level**: O(d) where d = documents
- **Chunk-level**: O(c) where c = chunks (higher granularity)
- **Filtering**: Reduces search space significantly

---

## Troubleshooting

### Issue: Large documents not chunking properly

**Solution:**
```typescript
// Increase max chunk size or use hybrid strategy
const docs = await loadLibraryDocs({
  chunkingOptions: {
    strategy: 'hybrid',
    maxChunkSize: 2000,
  },
})
```

### Issue: Code blocks not detected

**Solution:**
```typescript
// Ensure proper markdown formatting:
```typescript  // ✅ Correct
code here
```

```typescript    // ❌ Wrong (extra spaces)
```

### Issue: Poor search results

**Solution:**
```typescript
// Try chunk-level search with category filtering
const chunks = getRelevantChunks(docs, query, 10, {
  includeCodeBlocks: true,
  filterByCategory: ['component', 'hook', 'guide'],
})
```

### Issue: Context window exceeded

**Solution:**
```typescript
// Reduce max length or number of chunks
const context = formatLibraryDocsForRAG(docs, query, {
  maxLength: 2000,  // Smaller context
})
```

---

## Future Enhancements

### Planned Features

1. **Vector Embeddings for Chunks**
   - Semantic similarity at chunk level
   - Better ranking for conceptual queries

2. **Dynamic Chunking**
   - Adjust chunk size based on query complexity
   - Merge small chunks, split large ones

3. **Cross-Reference Graph**
   - Build knowledge graph from references
   - Surface related content automatically

4. **Code Execution Validation**
   - Actually run code blocks in sandbox
   - Mark as executable only if passes

5. **Multi-Document Context**
   - Combine chunks from multiple documents
   - Preserve inter-document relationships

---

## Related Files

- `documentParser.ts` - Markdown parsing and structure extraction
- `documentChunker.ts` - Chunking strategies and algorithms
- `libraryContext.ts` - Document loading and search
- `rag.ts` - RAG integration
- `keywordSearch.ts` - Keyword-based search fallback

---

## Summary

The enhanced document parsing and chunking system provides:

✅ **Better Retrieval**: Chunk-level search finds more relevant content
✅ **Code-Aware**: Separate indexing for code blocks
✅ **Context-Preserving**: Hierarchical structure maintained
✅ **Metadata-Rich**: Tags, categories, cross-references
✅ **Flexible**: Multiple chunking strategies for different needs

**Result**: Higher quality RAG responses with more precise, contextual answers.
